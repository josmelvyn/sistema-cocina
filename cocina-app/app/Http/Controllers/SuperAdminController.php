<?php

namespace App\Http\Controllers;

use App\Models\User;
use Illuminate\Http\Request;
use Inertia\Inertia;

class SuperAdminController extends Controller
{
    // Solo entras tú
    public function index()
    {
        // Traemos solo a los "Dueños" de cocinas (los que no tienen jefe)
        $clientes = User::whereNull('empresa_id')
                        ->withCount(['empleados' => function($query) {
                            $query->where('rol', 'staff');
                        }])
                        ->get();

        return Inertia::render('SuperAdmin/Dashboard', [
            'clientes' => $clientes
        ]);
    }

    // Función para activar/subir límite cuando te paguen
    public function actualizarPlan(Request $request, $id)
    {
        $cliente = User::findOrFail($id);
        
        $cliente->update([
            'limite_usuarios' => $request->nuevo_limite,
            'vence_el' => now()->addDays(30), // Le damos 30 días más
            'suscripcion_activa' => true
        ]);

        return redirect()->back()->with('message', 'Plan actualizado para ' . $cliente->name);
    }
}