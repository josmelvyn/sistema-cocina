<?php

namespace App\Http\Controllers;

use App\Models\Configuracion;
use Illuminate\Http\Request;
use Inertia\Inertia;

class ConfiguracionController extends Controller
{
    public function index()
    {
        $configuracion = Configuracion::first();
        
        return Inertia::render('Configuracion/Index', [
            'empresa' => $configuracion,
        ]);
    }

    public function update(Request $request)
    {
        $validated = $request->validate([
            'nombre_empresa' => 'required|string|max:255',
            'direccion'      => 'nullable|string',
            'telefono'       => 'nullable|string|max:100',
            'email'          => 'nullable|email|max:255',
            'rnc'            => 'nullable|string|max:100',
        ]);

        $configuracion = Configuracion::first();

        if ($configuracion) {
            $configuracion->update($validated);
        } else {
            Configuracion::create($validated);
        }

        return redirect()->back()->with('success', 'Configuración actualizada correctamente');
    }
}
