<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class Plato extends Model
{
    protected $fillable = ['nombre'];

public function recetas() {
    return $this->hasMany(Receta::class);
}
}
