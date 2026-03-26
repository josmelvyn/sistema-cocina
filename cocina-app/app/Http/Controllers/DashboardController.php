<?php

namespace App\Http\Controllers;

use App\Models\Escuela;
use App\Models\Conduce;
use App\Models\Insumo;
use App\Models\Ruta;
use App\Models\Gasto;
use App\Models\User; // <-- Importante añadir el modelo User
use Inertia\Inertia;
use Carbon\Carbon;

class DashboardController extends Controller
{
   public function index()
{
    $auth = auth()->user();
    $empresaId = $auth->empresa_id ?? $auth->id;

    return Inertia::render('Dashboard', [
        'stats' => [
            'total_escuelas' => Escuela::count(),
            'total_rutas'    => Ruta::count(),
            'raciones_hoy'   => Conduce::whereDate('fecha_despacho', Carbon::today())->sum('cantidad_entregada') ?? 0,
            'por_cobrar'     => Conduce::where('estado', 'pendiente')->sum('total_monto') ?? 0,
            'total_gastos'   => Gasto::sum('monto') ?? 0,
        ],
        'suscripcion' => [
            'actuales' => User::where('empresa_id', $empresaId)->count(),
            'limite'   => $auth->limite_usuarios ?? 1,
            'rol'      => $auth->rol 
        ],
        'insumos_bajos' => Insumo::where('stock_actual', '<', 10)->get(),
        'ultimos_conduces' => Conduce::with('escuela')->latest()->take(5)->get(),
        
        // --- AÑADE ESTO PARA QUE REACT NO DE ERROR ---
        'platos'   => \App\Models\Plato::all(), 
        'escuelas' => Escuela::all(),
    ]);
}
}