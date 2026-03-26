<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::create('gastos', function (Blueprint $table) {
            $table->id();
            $table->string('concepto'); // Ej: Pago Gas, Nómina, Reparación Camión
            $table->decimal('monto', 12, 2);
            $table->date('fecha_gasto');
            $table->string('categoria')->nullable(); // Operativo, Administrativo, Insumos
            $table->timestamps();
        });
    }

    public function down(): void
    {
        Schema::dropIfExists('gastos');
    }
};