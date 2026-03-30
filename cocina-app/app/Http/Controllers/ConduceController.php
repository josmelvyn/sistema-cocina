<?php

namespace App\Http\Controllers;

use App\Models\Conduce;
use App\Models\Escuela;
use App\Models\Receta;
use App\Models\Insumo;
use App\Models\MovimientoInventario;
use Illuminate\Http\Request;
use Inertia\Inertia;
use Illuminate\Support\Facades\DB;

class ConduceController extends Controller
{
   public function index()
{
    return Inertia::render('Conduces/Index', [
        'rutas' => \App\Models\Ruta::all(),
        'conduces' => Conduce::with(['escuela.ruta', 'plato'])->latest()->get(),
        'escuelas' => Escuela::all(),
        'platos'   => \App\Models\Plato::all() // <-- Enviamos los platos a React
    ]);
}

public function store(Request $request)
{
    $validated = $request->validate([
        'escuela_id' => 'required|exists:escuelas,id',
        'plato_id'   => 'required|exists:platos,id', // <-- Obligatorio elegir el menú
        'fecha_despacho' => 'required|date',
        'periodo_entrega' => 'required|string',
        'cantidad_entregada' => 'required|integer|min:1',
        'precio_racion' => 'required|numeric|min:0',
    ]);

    return \Illuminate\Support\Facades\DB::transaction(function () use ($validated) {
        // 1. Crear Conduce
        $numero = 'CON-' . date('Ymd') . '-' . (Conduce::count() + 1);
        $conduce = Conduce::create(array_merge($validated, [
            'numero_conduce' => $numero,
            'total_monto' => $validated['cantidad_entregada'] * $validated['precio_racion'],
            'estado' => 'pendiente'
        ]));

        // 2. DESCUENTO PRO: Solo ingredientes del plato seleccionado
        $recetas = \App\Models\Receta::where('plato_id', $validated['plato_id'])->get();

        foreach ($recetas as $item) {
            $gastoTotal = $item->cantidad_por_racion * $validated['cantidad_entregada'];
            $insumo = \App\Models\Insumo::find($item->insumo_id);
            
            if ($insumo) {
                $insumo->decrement('stock_actual', $gastoTotal);
                
                \App\Models\MovimientoInventario::create([
                    'insumo_id' => $insumo->id,
                    'tipo' => 'salida',
                    'cantidad' => $gastoTotal,
                    'descripcion' => "Despacho {$numero} - Menú: " . \App\Models\Plato::find($validated['plato_id'])->nombre
                ]);
            }
        }

        return redirect()->back()->with('message', 'Conduce y descarga de inventario exitosa');
    });
}

    public function pagar($id)
    {
        $conduce = Conduce::findOrFail($id);
        $conduce->update(['estado' => 'pagado']);
        return redirect()->back();
    }

   public function imprimir($id)
{
    // Agregamos 'platos' a la carga de relaciones
    $conduce = Conduce::with(['escuela.ruta', 'plato'])->findOrFail($id);

    return Inertia::render('Conduces/Imprimir', [
        'conduce' => $conduce
    ]);
}

    public function show($id)
    {
        return $this->imprimir($id);
    }

    public function anular(Request $request, $id)
{
    $request->validate(['motivo' => 'required|string|min:5']);

    return \Illuminate\Support\Facades\DB::transaction(function () use ($request, $id) {
        $conduce = \App\Models\Conduce::findOrFail($id);

        if ($conduce->estado === 'anulado') {
            return redirect()->back()->with('error', 'Este conduce ya está anulado.');
        }

        // 1. Devolver Insumos al Inventario (Revertir Receta)
        $recetas = \App\Models\Receta::where('plato_id', $conduce->plato_id)->get();
        foreach ($recetas as $item) {
            $cantidadADevolver = $item->cantidad_por_racion * $conduce->cantidad_entregada;
            $insumo = \App\Models\Insumo::find($item->insumo_id);
            
            if ($insumo) {
                $insumo->increment('stock_actual', $cantidadADevolver); // Sumamos de vuelta
                
                \App\Models\MovimientoInventario::create([
                    'insumo_id' => $insumo->id,
                    'tipo' => 'entrada',
                    'cantidad' => $cantidadADevolver,
                    'descripcion' => "REVERSIÓN POR ANULACIÓN: {$conduce->numero_conduce}"
                ]);
            }
        }

        // 2. Marcar Conduce como Anulado
        $conduce->update([
            'estado' => 'anulado',
            'motivo_anulacion' => $request->motivo,
            'total_monto' => 0 // Para que no sume en contabilidad
        ]);

        return redirect()->back()->with('message', 'Conduce anulado e inventario devuelto.');
    });
}
public function update(Request $request, $id)
{
    $validated = $request->validate([
        'escuela_id' => 'required|exists:escuelas,id',
        'plato_id' => 'required|exists:platos,id',
        'cantidad_entregada' => 'required|integer|min:1',
        'precio_racion' => 'required|numeric',
    ]);

    return DB::transaction(function () use ($validated, $id) {
        $conduce = Conduce::findOrFail($id);

        // 1. REVERTIR INVENTARIO ANTERIOR
        $recetasViejas = Receta::where('plato_id', $conduce->plato_id)->get();
        foreach ($recetasViejas as $item) {
            $cantidadVieja = $item->cantidad_por_racion * $conduce->cantidad_entregada;
            Insumo::find($item->insumo_id)->increment('stock_actual', $cantidadVieja);
        }

        // 2. ACTUALIZAR LOS DATOS DEL CONDUCE
        $conduce->update(array_merge($validated, [
            'total_monto' => $validated['cantidad_entregada'] * $validated['precio_racion']
        ]));

        // 3. DESCONTAR NUEVO INVENTARIO
        $recetasNuevas = Receta::where('plato_id', $validated['plato_id'])->get();
        foreach ($recetasNuevas as $item) {
            $cantidadNueva = $item->cantidad_por_racion * $validated['cantidad_entregada'];
            Insumo::find($item->insumo_id)->decrement('stock_actual', $cantidadNueva);
        }

        return redirect()->back()->with('message', 'Conduce actualizado e inventario re-calculado');
    });
}
public function generarMasivo(Request $request)
{
    $validated = $request->validate([
        'ruta_id'  => 'required',
        'plato_id' => 'required',
        'fecha'    => 'required|date',
    ]);

    try {
        return DB::transaction(function () use ($validated) {
            // 1. Buscamos escuelas de la ruta
            $escuelas = \App\Models\Escuela::where('ruta_id', $validated['ruta_id'])->get();

            if ($escuelas->isEmpty()) {
                return redirect()->back()->with('error', "No hay escuelas en la Ruta ID: " . $validated['ruta_id']);
            }

            $plato = \App\Models\Plato::findOrFail($validated['plato_id']);
            $precio = $plato->precio_base ?? 0;
            $conducesCreados = 0;
            $fechaFiltro = \Carbon\Carbon::parse($validated['fecha'])->format('Y-m-d');
            
            // Correlativo inicial para evitar duplicados de número
            $ultimoId = \App\Models\Conduce::max('id') ?? 0;

            foreach ($escuelas as $escuela) {
                // Evitar duplicados por fecha y escuela
                $existe = \App\Models\Conduce::where('escuela_id', $escuela->id)
                    ->whereDate('fecha_despacho', $fechaFiltro)
                    ->exists();
                
                if ($existe) continue;

                // --- FIX AQUÍ: Usamos raciones_estandar ---
                $cantidad = (int) ($escuela->raciones_estandar ?? 0);
                
                if ($cantidad <= 0) continue; 

                $ultimoId++;
                
                // 2. Crear Conduce
                \App\Models\Conduce::create([
                    'numero_conduce'     => 'AUT-' . date('Ymd') . '-' . str_pad($ultimoId, 5, '0', STR_PAD_LEFT),
                    'escuela_id'         => $escuela->id,
                    'plato_id'           => $validated['plato_id'],
                    'fecha_despacho'     => $fechaFiltro,
                    'cantidad_entregada' => $cantidad,
                    'precio_racion'      => $precio,
                    'total_monto'        => $cantidad * $precio,
                    'estado'             => 'pendiente'
                ]);

                // 3. Descontar Inventario
                $recetas = \App\Models\Receta::where('plato_id', $validated['plato_id'])->get();
                foreach ($recetas as $item) {
                    $gasto = $item->cantidad_por_racion * $cantidad;
                    \App\Models\Insumo::where('id', $item->insumo_id)->decrement('stock_actual', $gasto);
                }
                
                $conducesCreados++;
            }

            if ($conducesCreados === 0) {
                return redirect()->back()->with('info', "No se generaron conduces nuevos (revisa si ya existen o si las escuelas tienen raciones_estandar > 0).");
            }

            return redirect()->back()->with('message', "¡Éxito! Se generaron $conducesCreados conduces.");
        });

    } catch (\Exception $e) {
        return redirect()->back()->with('error', "Error en el proceso: " . $e->getMessage());
    }
}
public function reporteDespacho(Request $request)
{
    $plato = Plato::with('recetas.insumo')->findOrFail($request->plato_id);
    $estudiantes = $request->estudiantes;

    $insumosCalculados = $plato->recetas->map(function ($receta) use ($estudiantes) {
        return [
            'insumo' => $receta.insumo.nombre,
            'cantidad_total' => $receta->cantidad_por_racion * $estudiantes,
            'unidad' => $receta.insumo.unidad_medida,
        ];
    });

    return Inertia::render('Reportes/DespachoDetalle', [
        'plato' => $plato->nombre,
        'estudiantes' => $estudiantes,
        'insumos' => $insumosCalculados,
        'fecha' => now()->format('d/m/Y')
    ]);
}
public function relacionPorCentro(Request $request, $escuelaId)
{
    // 1. Validamos que las fechas existan
    $request->validate([
        'desde' => 'required|date',
        'hasta' => 'required|date',
    ]);

    // 2. Buscamos la escuela
    $escuela = Escuela::with('ruta')->findOrFail($escuelaId);
    
    // 3. Traemos los conduces filtrados
    $conduces = Conduce::where('escuela_id', $escuelaId)
        ->whereBetween('fecha_despacho', [$request->desde, $request->hasta]) 
        ->orderBy('fecha_despacho', 'asc')
        ->get();

    // 4. Retornamos a la vista de React (asegúrate de que la ruta coincida)
    return Inertia::render('Reportes/RelacionCentro', [
        'escuela' => $escuela,
        'conduces' => $conduces,
        'filtros' => $request->only(['desde', 'hasta'])
    ]);
}
public function indexReportes()
{
    $escuelas = Escuela::orderBy('nombre', 'asc')->get();
    
    // 1. BUSCAMOS LA SECUENCIA ACTIVA (Añade esto)
    $secuencia = DB::table('ncf_sequences')
        ->where('nombre', 'LIKE', '%Gurbenamental%') // Verifica que se escriba así en tu BD
        ->where('activa', 1)
        ->first();

    // 2. Traemos las facturas
    $facturas = DB::table('facturas')
        ->orderBy('created_at', 'desc') 
        ->limit(10)
        ->get();
    
    return Inertia::render('Reportes/Index', [
        'escuelas' => $escuelas,
        'facturas' => $facturas,
        'secuencia' => $secuencia // <--- ¡ESTA ES LA PIEZA QUE FALTA!
    ]);
}
//Factura por periodo 
public function facturaPeriodo(Request $request, $escuelaId)
{
    $escuela = Escuela::findOrFail($escuelaId);
    
    $conduces = Conduce::where('escuela_id', $escuelaId)
        ->whereBetween('fecha_despacho', [$request->desde, $request->hasta])
        ->where('estado', '!=', 'anulado')
        ->orderBy('fecha_despacho', 'asc')
        ->get();

    return Inertia::render('Reportes/FacturaPeriodo', [
        'escuela' => $escuela,
        'conduces' => $conduces,
        'filtros' => $request->only(['desde', 'hasta'])
    ]);
}

public function facturaGlobalImprimir(Request $request)
{
    
    $request->validate(['desde' => 'required|date', 'hasta' => 'required|date']);

    
    // 1. Preparamos la consulta base (Query)
    $query = \App\Models\Conduce::whereBetween('fecha_despacho', [$request->desde, $request->hasta])
        ->whereNotIn('estado', ['pagado', 'anulado']);

    // 2. Comprobamos si existen registros ANTES de seguir (El Candado)
    if (!$query->exists()) {
        return back()->with('error', '⚠️ No hay conduces pendientes en este rango.');
    }

    // 3. AHORA SÍ definimos la variable $conduces obteniendo los datos
    $conduces = $query->orderBy('numero_conduce', 'asc')->get();


    // 5. Procedemos con la secuencia NCF
    $secuencia = \DB::table('ncf_sequences')
        ->where('nombre', 'LIKE', '%Gurbenamental%')
        ->where('activa', 1)
        ->first();

    if (!$secuencia) return back()->with('error', 'No hay NCF disponibles.');

      if ($secuencia->proximo_numero > $secuencia->numero_final) {
        return back()->with('error', '❌ Se ha agotado el rango de NCF B15. El último número permitido era el ' . $secuencia->numero_final . '. Por favor, solicite una nueva secuencia a la DGII.');
    }

        // 4. Marcamos como PAGADOS en la base de datos
  

    // 6. Realizamos los cálculos usando la variable $conduces (que ya está definida)
    $totalRaciones = $conduces->sum('cantidad_entregada');
    $subtotal = $conduces->sum(fn($c) => $c->cantidad_entregada * $c->precio_racion);
    $itbis = $subtotal * 0.18;
    $totalGeneral = $subtotal + $itbis;

    $ncfGenerado = $secuencia->prefijo . str_pad($secuencia->proximo_numero, 8, '0', STR_PAD_LEFT);
    


    $ncfGenerado = $secuencia->prefijo . str_pad($secuencia->proximo_numero, 8, '0', STR_PAD_LEFT);
    \DB::table('ncf_sequences')->where('id', $secuencia->id)->increment('proximo_numero');

    // 7. Guardar en tabla facturas
    $facturaId = \DB::table('facturas')->insertGetId([
        'ncf' => $ncfGenerado,
        'periodo' => \Carbon\Carbon::parse($request->desde)->format('d/m/Y') . " A " . \Carbon\Carbon::parse($request->hasta)->format('d/m/Y'),
        'monto_total' => $totalGeneral,
        'itbis' => $itbis,
        'tipo_ncf' => '15',
        'fecha_vencimiento_ncf' => $secuencia->fecha_vencimiento,
        'estado' => 'emitida',
        'created_at' => now(),
    ]);
      $query->update([
            'estado' => 'pagado',
            'factura_id'=> $facturaId
        ]);

    return \Inertia\Inertia::render('Reportes/FacturaGlobalImprimir', [
        'datos_inabie' => [
            'nombre' => 'INSTITUTO NACIONAL DE BIENESTAR ESTUDIANTIL (INABIE)',
            'rnc' => '401-50561-4',
            'total_raciones' => $totalRaciones,
            'subtotal' => $subtotal,
            'itbis' => $itbis,
            'total' => $totalGeneral,
            'cant_conduces' => $conduces->count(),
            'conduce_desde' => $conduces->first()->numero_conduce,
            'conduce_hasta' => $conduces->last()->numero_conduce,
            'periodo_full' => \Carbon\Carbon::parse($request->desde)->format('d/m/Y') . " A " . \Carbon\Carbon::parse($request->hasta)->format('d/m/Y')
        ],
        'ncf_data' => ['ncf' => $ncfGenerado, 'vencimiento' => $secuencia->fecha_vencimiento]
    ]);
}

public function reimprimirFactura($id)
{
    // 1. Buscamos la factura grabada
    $factura = DB::table('facturas')->where('id', $id)->first();

    if (!$factura) return back()->with('error', 'Factura no encontrada.');

    // 2. Extraemos las fechas del texto "01/03/2026 A 31/03/2026" para recuperar los datos reales
    $partes = explode(' A ', strtoupper($factura->periodo));
    
    // Recuperamos los conduces de ese periodo para rellenar los datos que faltan en la tabla facturas
    $desde = \Carbon\Carbon::createFromFormat('d/m/Y', trim($partes[0]))->format('Y-m-d');
    $hasta = \Carbon\Carbon::createFromFormat('d/m/Y', trim($partes[1]))->format('Y-m-d');
    
    $conduces = Conduce::whereBetween('fecha_despacho', [$desde, $hasta])
        ->where('estado', '!=', 'anulado')
        ->orderBy('numero_conduce', 'asc')
        ->get();

    // 3. Montamos el objeto EXACTAMENTE igual al de la factura Global
    $subtotal = (float)$factura->monto_total - (float)$factura->itbis;

    return Inertia::render('Reportes/FacturaGlobalImprimir', [
        'datos_inabie' => [
            'nombre' => 'INSTITUTO NACIONAL DE BIENESTAR ESTUDIANTIL (INABIE)',
            'rnc' => '401-50561-4',
            'total_raciones' => $conduces->sum('cantidad_entregada') ?: 0, 
            'subtotal' => $subtotal,
            'itbis' => (float)$factura->itbis,
            'total' => (float)$factura->monto_total,
            'cant_conduces' => $conduces->count() ?: 'VARIOS',
            'conduce_desde' => $conduces->first()->numero_conduce ?? '---',
            'conduce_hasta' => $conduces->last()->numero_conduce ?? '---',
            'periodo_texto' => $factura->periodo, 
            'periodo_full' => $factura->periodo 
        
        ],
        'ncf_data' => [
            'ncf' => $factura->ncf,
            'vencimiento' => $factura->fecha_vencimiento_ncf
        ]
    ]);
}
public function relacionGeneral(Request $request)
{
    $request->validate(['desde' => 'required|date', 'hasta' => 'required|date']);

    $conduces = Conduce::whereBetween('fecha_despacho', [$request->desde, $request->hasta])
        ->with('escuela') // Para el código y nombre del centro
        ->where('estado', '!=', 'anulado')
        ->orderBy('fecha_despacho', 'asc')
        ->orderBy('numero_conduce', 'asc')
        ->get();

    return Inertia::render('Reportes/RelacionGeneral', [
        'conduces' => $conduces,
        'filtros' => [
            'desde' => \Carbon\Carbon::parse($request->desde)->format('d/m/Y'),
            'hasta' => \Carbon\Carbon::parse($request->hasta)->format('d/m/Y')
        ]
    ]);
}

}