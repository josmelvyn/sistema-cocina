<?php

namespace App\Http\Controllers;

use App\Models\NfcSequence;
use Illuminate\Http\Request;
use Inertia\Inertia;

class NfcSequenceController extends Controller
{
    // Carga la página en React
    public function render() {
        return Inertia::render('Nfc/NfcManager'); 
    }

    // Devuelve los datos para la tabla
    public function index() {
        return NfcSequence::orderBy('tipo')->get();
    }

    public function store(Request $request) {
        $data = $request->validate([
            'nombre'            => 'required|string',
            'tipo'              => 'required|string',
            'prefijo'           => 'required|string|max:3',
            'proximo_numero'    => 'required|integer',
            'numero_final'      => 'required|integer',
            'fecha_vencimiento' => 'required|date',
            'activa'            => 'boolean'
        ]);
        $data['activa'] = true;
        return NfcSequence::create($data);
    }
}