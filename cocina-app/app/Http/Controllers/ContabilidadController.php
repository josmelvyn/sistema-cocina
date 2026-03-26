<?php

namespace App\Http\Controllers;
use Illuminate\Http\Request; 
use App\Models\Conduce;
use App\Models\Gasto;
use Inertia\Inertia;

class ContabilidadController extends Controller
{
    public function index()
    {
        return Inertia::render('Contabilidad/Index', [
            // Conduces que aún no han sido pagados
            'cuentas_por_cobrar' => Conduce::with('escuela')
                ->where('estado', 'pendiente')
                ->get(),
            // Resumen de totales
            'totales' => [
                'por_cobrar' => Conduce::where('estado', 'pendiente')->sum('total_monto'),
                'cobrado'    => Conduce::where('estado', 'pagado')->sum('total_monto'),
                'gastos'     => Gasto::sum('monto'),
            ],
            'ultimos_gastos' => Gasto::latest()->take(10)->get()
        ]);
    }
    public function store(Request $request)
{
    $validated = $request->validate([
        'concepto' => 'required|string|max:255',
        'monto' => 'required|numeric|min:0',
        'fecha_gasto' => 'required|date',
        'categoria' => 'required|string',
    ]);

    \App\Models\Gasto::create($validated);

    return redirect()->back()->with('message', 'Gasto registrado correctamente');
}

public function pagarConduce($id)
{
    $conduce = Conduce::findOrFail($id);
    $conduce->update(['estado' => 'pagado']);

    return redirect()->back()->with('message', 'Pago registrado');
}
public function reporteMensual(Request $request)
{
    $mes = $request->input('mes', date('m'));
    $anio = $request->input('anio', date('Y'));

    $conduces = \App\Models\Conduce::with('escuela')
        ->whereMonth('fecha_despacho', $mes)
        ->whereYear('fecha_despacho', $anio)
        ->get();

    $gastos = \App\Models\Gasto::whereMonth('fecha_gasto', $mes)
        ->whereYear('fecha_gasto', $anio)
        ->get();

    return \Inertia\Inertia::render('Contabilidad/Reporte', [
        'data' => [
            'ingresos_pendientes' => $conduces->where('estado', 'pendiente')->sum('total_monto'),
            'ingresos_cobrados' => $conduces->where('estado', 'pagado')->sum('total_monto'),
            'total_gastos' => $gastos->sum('monto'),
            'conduces' => $conduces,
            'gastos' => $gastos,
            'mes_nombre' => \Carbon\Carbon::create(null, $mes)->locale('es')->monthName
        ]
    ]);
}

public function reporteEscuelas(Request $request)
{
    $desde = $request->input('desde', now()->startOfMonth()->format('Y-m-d'));
    $hasta = $request->input('hasta', now()->format('Y-m-d'));
    $escuela_id = $request->input('escuela_id');

    $query = \App\Models\Conduce::with(['escuela', 'plato'])
        ->whereBetween('fecha_despacho', [$desde, $hasta]);

    if ($escuela_id) {
        $query->where('escuela_id', $escuela_id);
    }

    $conduces = $query->orderBy('fecha_despacho', 'asc')->get();

    return \Inertia\Inertia::render('Contabilidad/ReporteEscuelas', [
        'conduces' => $conduces,
        'escuelas' => \App\Models\Escuela::all(),
        'filtros'  => [
            'desde' => $desde, 
            'hasta' => $hasta, 
            'escuela_id' => $escuela_id
        ],
        // ASEGÚRATE DE QUE ESTA PARTE ESTÉ ASÍ:
        'totales'  => [
            'raciones' => (int) $conduces->sum('cantidad_entregada'),
            'monto'    => (float) $conduces->sum('total_monto'),
        ]
    ]);
}
}