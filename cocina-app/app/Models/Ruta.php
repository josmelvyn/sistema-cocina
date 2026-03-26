<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class Ruta extends Model
{
    use HasFactory;

    protected $fillable = ['nombre', 'chofer'];

    // Una ruta tiene muchas escuelas asignadas
    public function escuelas()
    {
        return $this->hasMany(Escuela::class);
    }
}