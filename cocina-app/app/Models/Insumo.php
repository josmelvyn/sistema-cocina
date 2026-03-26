<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class Insumo extends Model
{
    use HasFactory;

    protected $fillable = ['nombre', 'unidad_medida', 'stock_actual', 'precio_compra_promedio'];

    // Relación con los movimientos de entrada y salida
    public function movimientos()
    {
        return $this->hasMany(MovimientoInventario::class);
    }
}