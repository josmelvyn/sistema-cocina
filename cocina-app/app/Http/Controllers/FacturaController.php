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
    
}