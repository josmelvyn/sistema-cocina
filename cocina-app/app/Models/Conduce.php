<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use App\Models\Plato;

class Conduce extends Model
{
    use HasFactory;

    protected $fillable = [
        'numero_conduce', 
    'escuela_id', 
    'fecha_despacho', 
    'cantidad_entregada', 
    'precio_racion', 
    'periodo_entrega',
    'total_monto', 
    'plato_id',
    'estado'
    ];

    // El conduce pertenece a una escuela
    public function escuela()
    {
        return $this->belongsTo(Escuela::class);
    }

    // Scope para filtrar por estado fácilmente
    public function scopePendientes($query)
    {
        return $query->where('estado', 'pendiente');
    }

    public function plato() {
    return $this->belongsTo(Plato::class);
}
public function factura()
{
    // Relacionamos el ID del conduce con el campo factura
    return $this->hasOne(Factura::class, 'conduce_id');
}


}