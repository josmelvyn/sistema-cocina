<?php

namespace App\Http\Controllers;

use App\Models\User;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Hash;
use Inertia\Inertia;

class UserController extends Controller
{
    public function index()
    {
        $auth = auth()->user();
        
        // El "dueño" es el ID del admin actual (si es staff, buscamos a su jefe)
        $empresaId = $auth->empresa_id ?? $auth->id;

        // Listamos todos los que pertenecen a esta misma cocina
        $usuarios = User::where('empresa_id', $empresaId)
                        ->orWhere('id', $empresaId)
                        ->get();

        return Inertia::render('Usuarios/Index', [
            'usuarios' => $usuarios,
            'limite'   => $auth->limite_usuarios ?? 1,
            'actuales' => User::where('empresa_id', $empresaId)->count()
        ]);
    }

    public function store(Request $request)
    {
        $admin = auth()->user();
        $empresaId = $admin->empresa_id ?? $admin->id;

        // 1. Validar si tiene cupo disponible para otro usuario de $12
        $conteoActual = User::where('empresa_id', $empresaId)->count();
        
        if ($conteoActual >= $admin->limite_usuarios) {
            return redirect()->back()->with('error', 'Límite alcanzado. Aumenta tu plan para agregar más personal.');
        }

        // 2. Validar datos
        $request->validate([
            'name'     => 'required|string|max:255',
            'email'    => 'required|string|email|max:255|unique:users',
            'password' => 'required|min:6',
        ]);

        // 3. Crear el "Hijo" (Empleado) vinculado al "Padre" (Admin)
        User::create([
            'name'               => $request->name,
            'email'              => $request->email,
            'password'           => Hash::make($request->password),
            'empresa_id'         => $empresaId,
            'rol'                => 'staff',
            'suscripcion_activa' => $admin->suscripcion_activa,
            'vence_el'           => $admin->vence_el
        ]);

        return redirect()->back()->with('message', 'Personal añadido correctamente.');
    }
    public function destroy($id)
{
    $usuario = User::findOrFail($id);
    $admin = auth()->user();

    // SEGURIDAD: Solo el dueño puede borrar usuarios de su propia cocina
    if ($usuario->empresa_id !== $admin->id) {
        return redirect()->back()->with('error', 'No tienes permiso para eliminar este usuario.');
    }

    $usuario->delete();

    return redirect()->back()->with('message', 'Usuario eliminado y cupo liberado.');
}
}