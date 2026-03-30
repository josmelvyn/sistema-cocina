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
            'escuelas' => Escuela::with('ruta')
                ->withCount(['conduces as entregado_hoy' => function($q) {
                    $q->whereDate('fecha_despacho', \Carbon\Carbon::today());
                }])->get(),
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
            'latitud' => 'nullable|numeric',
            'longitud' => 'nullable|numeric',
        ]);

        Escuela::create($validated);
        return redirect()->route('escuelas.index');
    }

    public function update(Request $request, Escuela $escuela)
    {
        $validated = $request->validate([
            'ruta_id' => 'required|exists:rutas,id',
            'nombre' => 'required|string',
            'codigo_minerd' => 'required|unique:escuelas,codigo_minerd,' . $escuela->id,
            'raciones_estandar' => 'required|integer|min:1',
            'director' => 'nullable|string',
            'direccion' => 'nullable|string',
            'rnc' => 'nullable|string',
            'municipio' => 'nullable|string',
            'telefono' => 'nullable|string',
            'distrito' => 'nullable|string',
            'latitud' => 'nullable|numeric',
            'longitud' => 'nullable|numeric',
        ]);

        $escuela->update($validated);
        return redirect()->route('escuelas.index');
    }
}
