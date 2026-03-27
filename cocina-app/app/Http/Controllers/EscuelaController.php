<?php

namespace App\Http\Controllers;

use App\Models\Escuela;
use App\Models\Ruta;
use Illuminate\Http\Request;
use Inertia\Inertia;

class EscuelaController extends Controller
{
    public function index()
    {
        return Inertia::render('Escuelas/Index', [
            'escuelas' => Escuela::with('ruta')->get(),
            'rutas' => Ruta::all() // Para el selector en el formulario
        ]);
    }

    public function store(Request $request)
    {
        $validated = $request->validate([
            'ruta_id' => 'required|exists:rutas,id',
            'nombre' => 'required|string',
            'codigo_minerd' => 'required|unique:escuelas',
            'raciones_estandar' => 'required|integer|min:1',
            'director' => 'nullable|string',
            'direccion' => 'nullable|string',
            'rnc' => 'nullable|string',
            'municipio' => 'nullable|string',
            'telefono' => 'nullable|string',
            'distrito' => 'nullable|string',
        ]);

        Escuela::create($validated);
        return redirect()->route('escuelas.index');
    }
}
