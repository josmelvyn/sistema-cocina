<?php

namespace App\Http\Middleware;

use Closure;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use Carbon\Carbon;

class CheckSubscription
{
    public function handle(Request $request, Closure $next)
    {
        $user = Auth::user();

        // 1. Si no hay usuario o es tu correo de Super Admin, dejar pasar
        if (!$user) return redirect()->route('login');
        if ($user->email === 'tu_correo@gmail.com') return $next($request); // <--- CAMBIA ESTO

        // 2. Evitar bloqueo en rutas de salida o pago
        if ($request->routeIs('logout') || $request->routeIs('pago.pendiente')) {
            return $next($request);
        }

        // 3. Identificar al pagador correctamente
        // Si no tiene empresa_id, él mismo es el pagador (Admin)
        $pagador = $user->empresa_id ? \App\Models\User::find($user->empresa_id) : $user;

        // 4. Si el pagador no existe (error de ID), bloqueamos por seguridad
        if (!$pagador) return redirect()->route('pago.pendiente');

        // 5. Validación de Switch
        if (!$pagador->suscripcion_activa) {
            return redirect()->route('pago.pendiente');
        }

        // 6. Validación de Fecha con Carbon
        $hoy = Carbon::today();
        $vencimiento = $pagador->vence_el ? Carbon::parse($pagador->vence_el)->startOfDay() : null;

        if (!$vencimiento || $hoy->gt($vencimiento)) {
            // Solo actualizamos si realmente ya venció hoy
            if ($pagador->suscripcion_activa && $vencimiento && $hoy->gt($vencimiento)) {
                $pagador->update(['suscripcion_activa' => false]);
            }
            return redirect()->route('pago.pendiente');
        }

        return $next($request);
    }
}

