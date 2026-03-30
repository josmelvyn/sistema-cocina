<?php

namespace App\Http\Controllers;

use App\Models\Plato;
use App\Models\Insumo;
use App\Models\Receta;
use Illuminate\Http\Request;
use Inertia\Inertia;

class PlatoController extends Controller
{
    public function index()
    {
        return Inertia::render('Platos/Index', [
            // Traemos platos con sus ingredientes (recetas) y el nombre del insumo
            'platos' => Plato::with('recetas.insumo')->get(),
            'insumos' => Insumo::all()
        ]);
    }

    public function store(Request $request)
    {
        $validated = $request->validate([
            'nombre' => 'required|string|max:255',
            'precio_base' => 'required|numeric|min:0',
        ]);

        Plato::create($validated);
        return redirect()->back();
    }

    public function update(Request $request, $id)
    {
        $validated = $request->validate([
            'nombre' => 'required|string|max:255',
            'precio_base' => 'required|numeric|min:0',
        ]);

        $plato = Plato::findOrFail($id);
        $plato->update($validated);
        return redirect()->back();
    }

    // Método para añadir ingredientes a un plato específico
    public function addIngrediente(Request $request, $platoId)
    {
        $validated = $request->validate([
            'insumo_id' => 'required|exists:insumos,id',
            'cantidad_por_racion' => 'required|numeric|min:0.0001',
        ]);

        Receta::updateOrCreate(
            ['plato_id' => $platoId, 'insumo_id' => $validated['insumo_id']],
            ['cantidad_por_racion' => $validated['cantidad_por_racion']]
        );

        return redirect()->back();
    }
    public function reporteDespacho(\Illuminate\Http\Request $request)
{
    // 1. Validamos que lleguen los datos desde React
    $request->validate([
        'plato_id' => 'required',
        'estudiantes' => 'required|numeric|min:1'
    ]);

    // 2. Buscamos el plato con sus ingredientes (recetas) e insumos
    $plato = \App\Models\Plato::with('recetas.insumo')->findOrFail($request->plato_id);
    
    $cantidadEstudiantes = (int) $request->estudiantes;

    // 3. Mapeamos los datos calculando el TOTAL GLOBAL (Ración * Estudiantes)
    $insumosCalculados = $plato->recetas->map(function ($receta) use ($cantidadEstudiantes) {
        return [
            'insumo' => $receta->insumo->nombre ?? 'N/A',
            'cantidad_total' => (float) $receta->cantidad_por_racion * $cantidadEstudiantes,
            'unidad' => $receta->insumo->unidad_medida ?? 'Unid.',
        ];
    });

    // 4. Retornamos a la vista de React (asegúrate de crear el archivo en Pages/Reportes/DespachoDetalle.jsx)
    return \Inertia\Inertia::render('Reportes/DespachoDetalle', [
        'plato' => $plato->nombre,
        'estudiantes' => $cantidadEstudiantes,
        'insumos' => $insumosCalculados,
        'fecha' => now()->format('d/m/Y h:i A')
    ]);
}
}