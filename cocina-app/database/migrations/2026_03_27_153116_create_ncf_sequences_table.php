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
       Schema::create('ncf_sequences', function (Blueprint $table) {
        $table->id();
        $table->string('nombre'); // Ej: "Crédito Fiscal Gubernamental"
        $table->string('tipo', 2)->default('01'); // 01=Crédito Fiscal, 15=Gubernamental
        $table->string('prefijo', 3)->default('B01');
        $table->bigInteger('proximo_numero')->default(1);
        $table->bigInteger('numero_final'); // El límite que te dio la DGII
        $table->date('fecha_vencimiento');
        $table->boolean('activa')->default(true);
        $table->timestamps();
    });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('ncf_sequences');
    }
};
