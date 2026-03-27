<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class Factura extends Model
{
    protected $fillable = [
        'conduce_id', 
        'ncf', 
        'tipo_ncf', 
        'fecha_vencimiento_ncf', 
        'monto_total', 
        'itbis', 
        'estado'
    ];

    // Relación: Una factura pertenece a un conduce
    public function conduce()
    {
        return $this->belongsTo(Conduce::class);
    }
}
