<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Foundation\Auth\User as Authenticatable;
use Illuminate\Notifications\Notifiable;
use Laravel\Cashier\Billable;

class User extends Authenticatable
{
    use HasFactory, Notifiable, Billable;

    protected $fillable = [
        'name', 'email', 'password', 'empresa_id', 'rol', 
        'suscripcion_activa', 'vence_el', 'limite_usuarios',
    ];

    protected $hidden = [
        'password', 'remember_token',
    ];

    protected function casts(): array
    {
        return [
            'email_verified_at' => 'datetime',
            'password' => 'hashed',
            'vence_el' => 'date',
            'suscripcion_activa' => 'boolean',
            'limite_usuarios' => 'integer',
        ];
    }

    public function empleados() { return $this->hasMany(User::class, 'empresa_id'); }
    public function jefe() { return $this->belongsTo(User::class, 'empresa_id'); }
}
