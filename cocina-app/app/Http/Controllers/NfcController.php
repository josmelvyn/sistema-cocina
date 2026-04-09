<?php

namespace App\Http\Controllers;

use App\Models\NfcSequence;
use Illuminate\Http\Request;
use Inertia\Inertia;

// 1. EL NOMBRE DE LA CLASE DEBE COINCIDIR CON EL ARCHIVO (NfcController)
class NfcController extends Controller 
{
    // 2. Cambia 'render' por 'index' para que coincida con tu ruta 'nfc.index'
    public function index() {
        return Inertia::render('Nfc/NfcManager', [
            'sequences' => NfcSequence::orderBy('tipo')->get()
        ]); 
    }

    // 3. Si quieres una API aparte para los datos, usa otro nombre (ej. list)
    public function list() {
        return NfcSequence::orderBy('tipo')->get();
    }

   public function store(Request $request) {
    $data = $request->validate([
        'nombre'            => 'required|string',
        'tipo'              => 'required|numeric',
        'prefijo'           => 'required|string',
        'proximo_numero'    => 'required|integer',
        'numero_final'      => 'required|integer',
        'fecha_vencimiento' => 'required|date',
    ]);
    
    $data['activa'] = true;

    // ¡ESTA LÍNEA ES VITAL!
    \App\Models\NfcSequence::create($data); 

    return redirect()->back(); // Esto le dice a Inertia que recargue los datos
}
}