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
    Schema::create('escuelas', function (Blueprint $table) {
    $table->id();
    $table->foreignId('ruta_id')->constrained();
    $table->string('nombre');
    $table->string('codigo_minerd')->unique(); // <--- ASEGÚRATE QUE ESTA LÍNEA ESTÉ AQUÍ
    $table->integer('raciones_estandar')->default(0);
    $table->timestamps();
});
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('escuelas');
    }
};
