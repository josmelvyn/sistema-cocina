<?php

namespace App\Http\Controllers;

use App\Models\Receta;
use App\Models\Insumo;
use Illuminate\Http\Request;
use Inertia\Inertia;

class RecetaController extends Controller
{
    public function index()
    {
        return Inertia::render('Insumos/Recetas', [
            // Traemos las recetas con el nombre del insumo relacionado
            'recetas' => Receta::with('insumo')->get(),
            // Mandamos los insumos para el selector del formulario
            'insumos' => Insumo::all()
        ]);
    }

    public function store(Request $request)
    {
        $validated = $request->validate([
            'insumo_id' => 'required|exists:insumos,id|unique:recetas,insumo_id',
            'cantidad_por_racion' => 'required|numeric|min:0.0001',
        ], [
            'insumo_id.unique' => 'Este insumo ya está agregado a la receta.'
        ]);

        Receta::create($validated);

        return redirect()->back()->with('message', 'Ingrediente añadido a la receta base.');
    }

    public function destroy($id)
    {
        Receta::findOrFail($id)->delete();
        return redirect()->back()->with('message', 'Ingrediente eliminado de la receta.');
    }
}