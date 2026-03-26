<?php

namespace App\Http\Controllers;

use App\Models\Ruta;
use Illuminate\Http\Request;
use Inertia\Inertia;

class RutaController extends Controller
{
    public function index()
    {
        return Inertia::render('Rutas/Index', [
            'rutas' => Ruta::withCount('escuelas')->get()
        ]);

        {
    return Inertia::render('Rutas/Index', [
        'rutas' => \App\Models\Ruta::all()
    ]);
}
    }

    public function store(Request $request)
    {
        $validated = $request->validate([
            'nombre' => 'required|string|max:255',
            'chofer' => 'nullable|string|max:255',
        ]);

        Ruta::create($validated);
        return redirect()->back()->with('message', 'Ruta creada con éxito');
    }

    public function reporte($id)
{
    $ruta = \App\Models\Ruta::with(['escuelas.conduces' => function($query) {
        $query->whereDate('fecha_despacho', now());
    }])->findOrFail($id);

    return \Inertia\Inertia::render('Rutas/ReporteChofer', [
        'ruta' => $ruta,
        'fecha' => now()->format('d/m/Y')
    ]);
}
    
}
