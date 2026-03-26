<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class MovimientoInventario extends Model
{
    use HasFactory;

    protected $table = 'movimientos_inventario'; // Especificamos el nombre de la tabla

    protected $fillable = ['insumo_id', 'tipo', 'cantidad', 'descripcion'];

    public function insumo()
    {
        return $this->belongsTo(Insumo::class);
    }
}