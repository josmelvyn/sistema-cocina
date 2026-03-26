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
        Schema::create('conduces', function (Blueprint $table) {
    $table->id();
    $table->string('numero_conduce')->unique(); 
    $table->foreignId('escuela_id')->constrained();
    $table->date('fecha_despacho');
    $table->integer('cantidad_entregada');
    $table->decimal('precio_racion', 10, 2);
    $table->enum('estado', ['borrador', 'despachado', 'facturado'])->default('borrador');
    $table->timestamps();
});
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('conduces');
    }
};
