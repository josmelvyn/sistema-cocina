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
    public function __construct()
    {
        $this->middleware(function ($request, $next) {
            $user = auth()->user();
            $restrictedActions = [
                'store',
                'update',
                'generarMasivo',
                'anular',
                'pagar',
            ];

            if ($user && $user->rol === 'chofer' && in_array($request->route()->getActionMethod(), $restrictedActions)) {
                return redirect()->back()->with('error', 'No tienes permiso para realizar esta operación. Los conduces se generan desde la administración.');
            }

            return $next($request);
        });
    }

   public function index()
{
    return Inertia::render('Conduces/Index', [
        'rutas' => \App\Models\Ruta::all(),
        'conduces' => Conduce::with(['escuela.ruta', 'plato'])->latest()->get(),
        'escuelas' => Escuela::all(),
        'platos'   => \App\Models\Plato::all()
    ]);
}

public function store(Request $request)
{
    if (auth()->user()->rol === 'chofer') {
        return redirect()->back()->with('error', 'No tienes permiso para crear conduces.');
    }
    $validated = $request->validate([
        'escuela_id' => 'required|exists:escuelas,id',
        'plato_id'   => 'required|exists:platos,id',
        'fecha_despacho' => 'required|date',
        'periodo_entrega' => 'required|string',
        'cantidad_entregada' => 'required|integer|min:1',
        'precio_racion' => 'required|numeric|min:0',
        'entrega_latitud' => 'nullable|numeric',
        'entrega_longitud' => 'nullable|numeric',
        'foto_evidencia' => 'nullable|image|max:2048',
    ]);

    return \Illuminate\Support\Facades\DB::transaction(function () use ($validated, $request) {
        $fotoPath = null;
        if ($request->hasFile('foto_evidencia')) {
            $fotoPath = $request->file('foto_evidencia')->store('evidencias', 'public');
        }

        $numero = 'CON-' . date('Ymd') . '-' . (Conduce::count() + 1);
        $conduce = Conduce::create(array_merge($validated, [
            'numero_conduce' => $numero,
            'total_monto' => $validated['cantidad_entregada'] * $validated['precio_racion'],
            'estado' => 'pendiente',
            'foto_evidencia' => $fotoPath,
        ]));

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

        return redirect()->back()->with('message', 'Conduce exitoso');
    });
}

    public function pagar($id)
    {
        if (auth()->user()->rol === 'chofer') {
            return redirect()->back()->with('error', 'No tienes permiso para realizar esta acción.');
        }
        $conduce = Conduce::findOrFail($id);
        $conduce->update(['estado' => 'pagado']);
        return redirect()->back();
    }

   public function imprimir($id)
{
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
    if (auth()->user()->rol === 'chofer') {
        return redirect()->back()->with('error', 'No tienes permiso para anular conduces.');
    }
    $request->validate(['motivo' => 'required|string|min:5']);

    return \Illuminate\Support\Facades\DB::transaction(function () use ($request, $id) {
        $conduce = \App\Models\Conduce::findOrFail($id);

        if ($conduce->estado === 'anulado') {
            return redirect()->back()->with('error', 'Este conduce ya está anulado.');
        }

        $recetas = \App\Models\Receta::where('plato_id', $conduce->plato_id)->get();
        foreach ($recetas as $item) {
            $cantidadADevolver = $item->cantidad_por_racion * $conduce->cantidad_entregada;
            $insumo = \App\Models\Insumo::find($item->insumo_id);
            if ($insumo) {
                $insumo->increment('stock_actual', $cantidadADevolver);
                \App\Models\MovimientoInventario::create([
                    'insumo_id' => $insumo->id,
                    'tipo' => 'entrada',
                    'cantidad' => $cantidadADevolver,
                    'descripcion' => "REVERSIÓN POR ANULACIÓN: {$conduce->numero_conduce}"
                ]);
            }
        }

        $conduce->update([
            'estado' => 'anulado',
            'motivo_anulacion' => $request->motivo,
            'total_monto' => 0 
        ]);

        return redirect()->back()->with('message', 'Conduce anulado');
    });
}

public function update(Request $request, $id)
{
    if (auth()->user()->rol === 'chofer') {
        return redirect()->back()->with('error', 'No tienes permiso para editar conduces.');
    }
    $validated = $request->validate([
        'escuela_id' => 'required|exists:escuelas,id',
        'plato_id' => 'required|exists:platos,id',
        'cantidad_entregada' => 'required|integer|min:1',
        'precio_racion' => 'required|numeric',
    ]);

    return DB::transaction(function () use ($validated, $id) {
        $conduce = Conduce::findOrFail($id);

        $recetasViejas = \App\Models\Receta::where('plato_id', $conduce->plato_id)->get();
        foreach ($recetasViejas as $item) {
            $cantidadVieja = $item->cantidad_por_racion * $conduce->cantidad_entregada;
            \App\Models\Insumo::find($item->insumo_id)->increment('stock_actual', $cantidadVieja);
        }

        $conduce->update(array_merge($validated, [
            'total_monto' => $validated['cantidad_entregada'] * $validated['precio_racion']
        ]));

        $recetasNuevas = \App\Models\Receta::where('plato_id', $validated['plato_id'])->get();
        foreach ($recetasNuevas as $item) {
            $cantidadNueva = $item->cantidad_por_racion * $validated['cantidad_entregada'];
            \App\Models\Insumo::find($item->insumo_id)->decrement('stock_actual', $cantidadNueva);
        }

        return redirect()->back()->with('message', 'Conduce actualizado');
    });
}

public function generarMasivo(Request $request)
{
    if (auth()->user()->rol === 'chofer') {
        return redirect()->back()->with('error', 'No tienes permiso para generar conduces masivos.');
    }
    $validated = $request->validate([
        'ruta_id'  => 'required',
        'plato_id' => 'required',
        'fecha'    => 'required|date',
    ]);

    try {
        return DB::transaction(function () use ($validated) {
            $escuelas = \App\Models\Escuela::where('ruta_id', $validated['ruta_id'])->get();
            if ($escuelas->isEmpty()) {
                return redirect()->back()->with('error', "No hay escuelas");
            }
            $plato = \App\Models\Plato::findOrFail($validated['plato_id']);
            $precio = $plato->precio_base ?? 0;
            $conducesCreados = 0;
            $fechaFiltro = \Carbon\Carbon::parse($validated['fecha'])->format('Y-m-d');
            $ultimoId = \App\Models\Conduce::max('id') ?? 0;

            foreach ($escuelas as $escuela) {
                $existe = \App\Models\Conduce::where('escuela_id', $escuela->id)
                    ->whereDate('fecha_despacho', $fechaFiltro)
                    ->exists();
                if ($existe) continue;
                $cantidad = (int) ($escuela->raciones_estandar ?? 0);
                if ($cantidad <= 0) continue; 
                $ultimoId++;
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
                $recetas = \App\Models\Receta::where('plato_id', $validated['plato_id'])->get();
                foreach ($recetas as $item) {
                    $gasto = $item->cantidad_por_racion * $cantidad;
                    \App\Models\Insumo::where('id', $item->insumo_id)->decrement('stock_actual', $gasto);
                }
                $conducesCreados++;
            }
            return redirect()->back()->with('message', "¡Éxito! $conducesCreados conduces.");
        });
    } catch (\Exception $e) {
        return redirect()->back()->with('error', "Error: " . $e->getMessage());
    }
}

public function relacionPorCentro(Request $request, $escuelaId)
{
    $request->validate(['desde' => 'required|date', 'hasta' => 'required|date']);
    $escuela = \App\Models\Escuela::with('ruta')->findOrFail($escuelaId);
    $conduces = Conduce::where('escuela_id', $escuelaId)
        ->whereBetween('fecha_despacho', [$request->desde, $request->hasta]) 
        ->orderBy('fecha_despacho', 'asc')->get();
    return Inertia::render('Reportes/RelacionCentro', [
        'escuela' => $escuela, 'conduces' => $conduces, 'filtros' => $request->only(['desde', 'hasta'])
    ]);
}

public function indexReportes()
{
    $escuelas = \App\Models\Escuela::orderBy('nombre', 'asc')->get();
    $secuencia = DB::table('ncf_sequences')->where('nombre', 'LIKE', '%Gurbenamental%')->where('activa', 1)->first();
    $facturas = DB::table('facturas')->orderBy('created_at', 'desc')->limit(10)->get();
    return Inertia::render('Reportes/Index', [
        'escuelas' => $escuelas, 'facturas' => $facturas, 'secuencia' => $secuencia
    ]);
}

public function facturaPeriodo(Request $request, $escuelaId)
{
    $escuela = \App\Models\Escuela::findOrFail($escuelaId);
    $conduces = Conduce::where('escuela_id', $escuelaId)
        ->whereBetween('fecha_despacho', [$request->desde, $request->hasta])
        ->where('estado', '!=', 'anulado')->orderBy('fecha_despacho', 'asc')->get();
    return Inertia::render('Reportes/FacturaPeriodo', [
        'escuela' => $escuela, 'conduces' => $conduces, 'filtros' => $request->only(['desde', 'hasta'])
    ]);
}

public function facturaGlobalImprimir(Request $request)
{
    $request->validate(['desde' => 'required|date', 'hasta' => 'required|date']);
    $query = \App\Models\Conduce::whereBetween('fecha_despacho', [$request->desde, $request->hasta])
        ->whereNotIn('estado', ['pagado', 'anulado']);
    if (!$query->exists()) return back()->with('error', '⚠️ No hay conduces pendientes.');
    $conduces = $query->orderBy('numero_conduce', 'asc')->get();
    $secuencia = \DB::table('ncf_sequences')->where('nombre', 'LIKE', '%Gurbenamental%')->where('activa', 1)->first();
    if (!$secuencia) return back()->with('error', 'No hay NCF.');
    if ($secuencia->proximo_numero > $secuencia->numero_final) return back()->with('error', '❌ NCF agotado.');

    $totalRaciones = $conduces->sum('cantidad_entregada');
    $subtotal = $conduces->sum(fn($c) => $c->cantidad_entregada * $c->precio_racion);
    $itbis = $subtotal * 0.18;
    $totalGeneral = $subtotal + $itbis;
    $ncfGenerado = $secuencia->prefijo . str_pad($secuencia->proximo_numero, 8, '0', STR_PAD_LEFT);
    \DB::table('ncf_sequences')->where('id', $secuencia->id)->increment('proximo_numero');

    $facturaId = \DB::table('facturas')->insertGetId([
        'ncf' => $ncfGenerado,
        'periodo' => \Carbon\Carbon::parse($request->desde)->format('d/m/Y') . " A " . \Carbon\Carbon::parse($request->hasta)->format('d/m/Y'),
        'monto_total' => $totalGeneral, 'itbis' => $itbis, 'tipo_ncf' => '15', 'fecha_vencimiento_ncf' => $secuencia->fecha_vencimiento,
        'estado' => 'emitida', 'created_at' => now(),
    ]);
    $query->update(['estado' => 'pagado', 'factura_id'=> $facturaId]);

    return \Inertia\Inertia::render('Reportes/FacturaGlobalImprimir', [
        'datos_inabie' => [
            'nombre' => 'INSTITUTO NACIONAL DE BIENESTAR ESTUDIANTIL (INABIE)', 'rnc' => '401-50561-4',
            'total_raciones' => $totalRaciones, 'subtotal' => $subtotal, 'itbis' => $itbis, 'total' => $totalGeneral,
            'cant_conduces' => $conduces->count(), 'conduce_desde' => $conduces->first()->numero_conduce,
            'conduce_hasta' => $conduces->last()->numero_conduce,
            'periodo_full' => \Carbon\Carbon::parse($request->desde)->format('d/m/Y') . " A " . \Carbon\Carbon::parse($request->hasta)->format('d/m/Y')
        ],
        'ncf_data' => ['ncf' => $ncfGenerado, 'vencimiento' => $secuencia->fecha_vencimiento]
    ]);
}

public function reimprimirFactura($id)
{
    $factura = DB::table('facturas')->where('id', $id)->first();
    if (!$factura) return back()->with('error', 'No encontrada.');
    $partes = explode(' A ', strtoupper($factura->periodo));
    $desde = \Carbon\Carbon::createFromFormat('d/m/Y', trim($partes[0]))->format('Y-m-d');
    $hasta = \Carbon\Carbon::createFromFormat('d/m/Y', trim($partes[1]))->format('Y-m-d');
    $conduces = Conduce::whereBetween('fecha_despacho', [$desde, $hasta])->where('estado', '!=', 'anulado')->orderBy('numero_conduce', 'asc')->get();
    $subtotal = (float)$factura->monto_total - (float)$factura->itbis;
    return Inertia::render('Reportes/FacturaGlobalImprimir', [
        'datos_inabie' => [
            'nombre' => 'INSTITUTO NACIONAL DE BIENESTAR ESTUDIANTIL (INABIE)', 'rnc' => '401-50561-4',
            'total_raciones' => $conduces->sum('cantidad_entregada') ?: 0, 'subtotal' => $subtotal,
            'itbis' => (float)$factura->itbis, 'total' => (float)$factura->monto_total, 'cant_conduces' => $conduces->count(),
            'conduce_desde' => $conduces->first()->numero_conduce ?? '---', 'conduce_hasta' => $conduces->last()->numero_conduce ?? '---',
            'periodo_full' => $factura->periodo 
        ],
        'ncf_data' => ['ncf' => $factura->ncf, 'vencimiento' => $factura->fecha_vencimiento_ncf]
    ]);
}

public function relacionGeneral(Request $request)
{
    $request->validate(['desde' => 'required|date', 'hasta' => 'required|date']);
    $conduces = Conduce::whereBetween('fecha_despacho', [$request->desde, $request->hasta])
        ->with('escuela')->where('estado', '!=', 'anulado')->orderBy('fecha_despacho', 'asc')->get();
    return Inertia::render('Reportes/RelacionGeneral', [
        'conduces' => $conduces,
        'filtros' => ['desde' => \Carbon\Carbon::parse($request->desde)->format('d/m/Y'), 'hasta' => \Carbon\Carbon::parse($request->hasta)->format('d/m/Y')]
    ]);
}

public function completarEntrega(Request $request, $id)
{
    $validated = $request->validate([
        'entrega_latitud' => 'required|numeric',
        'entrega_longitud' => 'required|numeric',
        'foto_evidencia' => 'nullable|image|max:2048',
    ]);
    $conduce = Conduce::findOrFail($id);

    $updateData = [
        'entrega_latitud' => $validated['entrega_latitud'],
        'entrega_longitud' => $validated['entrega_longitud'],
        'estado' => 'entregado',
    ];

    if ($request->hasFile('foto_evidencia')) {
        $updateData['foto_evidencia'] = $request->file('foto_evidencia')->store('evidencias', 'public');
    }

    $conduce->update($updateData);

    return redirect()->back()->with('message', 'Entrega confirmada');
}

}
