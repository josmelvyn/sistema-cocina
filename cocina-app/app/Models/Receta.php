<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class Receta extends Model
{
   protected $fillable = ['insumo_id', 'plato_id', 'cantidad_por_racion'];

    public function insumo()
    {
        return $this->belongsTo(Insumo::class);
    }

    public function plato() {
    return $this->belongsTo(Plato::class);
}
}