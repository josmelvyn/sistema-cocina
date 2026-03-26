<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use App\Models\Escuela;
use App\Models\Conduce;
use App\Models\Insumo;
use App\Models\Ruta;
use Inertia\Inertia;

class DashboardController extends Controller
{
    // Esta es la función que Laravel no está encontrando:
    public function index()
    {
        return Inertia::render('Dashboard', [
            'stats' => [
                'total_escuelas' => Escuela::count() ?? 0,
                'total_rutas'    => Ruta::count() ?? 0,
                'raciones_hoy'   => Conduce::whereDate('created_at', now())->sum('cantidad_entregada') ?? 0,
                'por_cobrar'     => Conduce::where('estado', 'pendiente')->sum('total_monto') ?? 0,
            ],
            'insumos_bajos' => Insumo::where('stock_actual', '<', 10)->get() ?? [],
            'ultimos_conduces' => Conduce::with('escuela')->latest()->take(5)->get() ?? [],
        ]);
    }
}