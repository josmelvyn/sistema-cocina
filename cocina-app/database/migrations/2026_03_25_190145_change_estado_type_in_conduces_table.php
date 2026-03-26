<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
{
    // Usamos una consulta cruda de SQL para asegurar que el cambio se haga sí o sí
    DB::statement("ALTER TABLE conduces MODIFY COLUMN estado VARCHAR(255) DEFAULT 'pendiente'");
}

    public function down(): void
{
    // No es estrictamente necesario para que funcione ahora
}
};