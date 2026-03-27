<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class Escuela extends Model
{
    use HasFactory;

    protected $fillable = [
        'ruta_id', 
        'nombre', 
        'codigo_minerd', 
        'raciones_estandar',
        'director',   
        'rnc',
        'direccion',   
        'telefono', 
        'distrito'     ];

    // La escuela pertenece a una ruta específica
    public function ruta()
    {
        return $this->belongsTo(Ruta::class);
    }

    // Una escuela tiene muchos conduces generados
    public function conduces()
    {
        return $this->hasMany(Conduce::class);
    }
}