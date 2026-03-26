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
       Schema::create('recetas', function (Blueprint $table) {
        $table->id();
        $table->foreignId('insumo_id')->constrained(); // Ej: Arroz
        $table->decimal('cantidad_por_racion', 10, 4); // Ej: 0.2500 lb
        $table->timestamps();
    });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('recetas');
    }
};
