<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use App\Models\User;
use Inertia\Inertia;
class SuscripcionController extends Controller
{
       public function aviso()
    {
        return Inertia::render('Suscripcion/Aviso', [
            'mensaje' => 'Tu suscripción de $12 USD ha vencido o no está activa.'
        ]);
    }
    public function suscribir(Request $request)
    {
        // IMPORTANTE: Cambia 'price_1P...' por el ID real que copiaste de Stripe
        return $request->user()
            ->newSubscription('default', 'price_1P2X...') 
            ->checkout([
                'success_url' => route('dashboard') . '?checkout=success',
                'cancel_url' => route('pago.pendiente'),
            ]);
    }
}
