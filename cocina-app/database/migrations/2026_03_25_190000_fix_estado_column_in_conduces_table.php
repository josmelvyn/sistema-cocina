<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    /**
     * Run the migrations.
     */
  public function up(): void
{
    Schema::table('conduces', function (Blueprint $table) {
        // Cambiamos a string normal para que acepte cualquier texto como 'pendiente'
        $table->string('estado')->default('pendiente')->change();
    });
}

public function down(): void
{
    Schema::table('conduces', function (Blueprint $table) {
        // En caso de volver atrás (opcional)
        $table->enum('estado', ['borrador', 'despachado', 'facturado'])->change();
    });
}
};
