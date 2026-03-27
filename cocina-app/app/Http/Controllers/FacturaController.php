<?php

namespace App\Http\Controllers;

use App\Models\Conduce;
use App\Models\Factura;
use App\Models\NcfSequence;
use Illuminate\Http\Request;
use Inertia\Inertia;

class FacturaController extends Controller

    {
    // Listado de facturas emitidas
    public function index()
    {
        return Inertia::render('Facturas/Index', [
            'facturas' => Factura::with(['conduce.escuela', 'conduce.plato'])
                ->orderBy('created_at', 'desc')
                ->get()
        ]);
    }
public function emitirFactura(Request $request, $conduce_id) 
{
    $conduce = Conduce::findOrFail($conduce_id);
    $secuencia = NcfSequence::where('tipo', '01')->where('activa', true)->first();

    if (!$secuencia) {
        return back()->withErrors(['ncf' => 'No hay secuencia de NCF configurada o activa.']);
    }

    try {
        // 2. Pasamos $request al closure para poder usarlo si fuera necesario
        return \DB::transaction(function () use ($conduce, $secuencia, $request) {
            
            $subtotal = $conduce->cantidad_entregada * ($conduce->precio_racion ?? 0);
            $itbis = $subtotal * 0.18; 
            $totalFinal = $subtotal + $itbis;

            // 3. Lógica de Periodo (Usamos la que calculaste arriba)
            $fechaInicio = \Carbon\Carbon::parse($conduce->fecha_despacho)->startOfMonth()->addDay(1)->format('d/m/Y');
            $fechaFin = \Carbon\Carbon::parse($conduce->fecha_despacho)->format('d/m/Y');
            $periodoTexto = "{$fechaInicio} a {$fechaFin}";

            $factura = new Factura();
            $factura->conduce_id = $conduce->id;
            $factura->ncf = $secuencia->prefijo . str_pad($secuencia->proximo_numero, 8, '0', STR_PAD_LEFT);
            $factura->tipo_ncf = $secuencia->tipo;
            $factura->fecha_vencimiento_ncf = $secuencia->fecha_vencimiento;
            
            $factura->monto_total = $totalFinal; 
            $factura->itbis = $itbis; 
            $factura->estado = 'emitida';
            
            // 4. FIX: Usamos periodoTexto que ya generamos automáticamente
            $factura->periodo = $periodoTexto; 
            
            $factura->save();

            // 5. Actualizar estados
            $conduce->update(['estado' => 'facturado']);
            $secuencia->increment('proximo_numero');

            return back()->with('message', 'Factura ' . $factura->ncf . ' emitida con éxito.');
        });

    } catch (\Exception $e) {
        \Log::error("Error factura: " . $e->getMessage());
        // Esto te mostrará el error en pantalla si algo falla en la base de datos
        return back()->withErrors(['error' => 'Error de base de datos: ' . $e->getMessage()]);
    }
}
public function imprimir($id)
    {
        // Buscamos la factura con todas sus relaciones para el reporte
        $factura = Factura::with([
            'conduce.escuela.ruta', 
            'conduce.plato'
        ])->findOrFail($id);

        return Inertia::render('Facturas/Imprimir', [
            'factura' => $factura
        ]);
    }

    //Facturacion masiva
    public function facturacionMasiva(Request $request)
{
    $ids = $request->ids; // Recibimos el array [1, 2, 5...]

    if (empty($ids)) {
        return back()->withErrors(['error' => 'No seleccionaste ningún conduce.']);
    }

    return \DB::transaction(function () use ($ids) {
        $secuencia = NcfSequence::where('tipo', '01')->where('activa', true)->first();
        $emitidos = 0;

        foreach ($ids as $id) {
            $conduce = Conduce::find($id);
            
            // Validar que el conduce exista y no esté facturado ya
            if ($conduce && $conduce->estado !== 'facturado') {
                
                $subtotal = $conduce->cantidad_entregada * ($conduce->precio_racion ?? 0);
                $itbis = $subtotal * 0.18;

                Factura::create([
                    'conduce_id' => $conduce->id,
                    'ncf' => $secuencia->prefijo . str_pad($secuencia->proximo_numero, 8, '0', STR_PAD_LEFT),
                    'tipo_ncf' => $secuencia->tipo,
                    'fecha_vencimiento_ncf' => $secuencia->fecha_vencimiento,
                    'monto_total' => $subtotal + $itbis,
                    'itbis' => $itbis,
                    'estado' => 'emitida',
                    'periodo' => $conduce->periodo_entrega // Toma el periodo automático
                ]);

                $conduce->update(['estado' => 'facturado']);
                $secuencia->increment('proximo_numero');
                $emitidos++;
            }
        }

        return back()->with('message', "Se emitieron $emitidos facturas con éxito.");
    });
}
//Anular Factura
public function anular(Request $request, $id)
{
    return \DB::transaction(function () use ($id, $request) {
        $factura = Factura::findOrFail($id);
        
        // 1. Buscar secuencia de Nota de Crédito (Tipo 04)
        $secuencia = NcfSequence::where('tipo', '04')->where('activa', true)->first();
        
        if (!$secuencia) {
            return back()->withErrors(['error' => 'No hay secuencia de Notas de Crédito (B04) activa.']);
        }

        // 2. Generar NCF de Nota de Crédito
        $ncfNotaCredito = $secuencia->prefijo . str_pad($secuencia->proximo_numero, 8, '0', STR_PAD_LEFT);

        // 3. Actualizar la Factura a estado Anulada y guardar el motivo
        $factura->update([
            'estado' => 'anulada',
            'ncf_modificado' => $factura->ncf, // Guardamos cuál NCF estamos anulando
            'ncf_nota_credito' => $ncfNotaCredito,
            'motivo_anulacion' => $request->motivo
        ]);

        // 4. Liberar el Conduce para que aparezca de nuevo como "Pendiente"
        $factura->conduce->update(['estado' => 'pendiente']);

        // 5. Incrementar secuencia B04
        $secuencia->increment('proximo_numero');

        return back()->with('message', "Factura anulada con Nota de Crédito $ncfNotaCredito");
    });
}
    public function imprimirNotaCredito($id)
{
    // Buscamos la factura con todas sus relaciones para que el reporte no salga vacío
    $factura = Factura::with(['conduce.escuela', 'conduce.plato'])->findOrFail($id);
    
    // IMPORTANTE: El nombre 'Facturas/ImprimirNotaCredito' debe coincidir 
    // exactamente con la ruta de tu archivo .jsx en resources/js/Pages/
    return Inertia::render('Facturas/ImprimirNotaCredito', [
        'factura' => $factura
    ]);
}
    
}