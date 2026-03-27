<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class NcfSequence extends Model
{
    public function generarProximoNcf()
{
  App\Models\NcfSequence::create([
    'nombre' => 'Crédito Fiscal Gubernamental',
    'tipo' => '01',
    'prefijo' => 'B01',
    'proximo_numero' => 1,
    'numero_final' => 1000,
    'fecha_vencimiento' => '2026-12-31',
    'activa' => true
]);
}
}
