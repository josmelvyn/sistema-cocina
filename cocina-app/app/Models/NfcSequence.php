<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class NfcSequence extends Model
{
    // Cambia 'nfc' por 'ncf' que es el nombre real de tu tabla
    protected $table = 'ncf_sequences'; 

    protected $fillable = [
        'nombre',
        'tipo',
        'prefijo',
        'proximo_numero',
        'numero_final',
        'fecha_vencimiento',
        'activa'
    ];
}