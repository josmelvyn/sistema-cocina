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
        Schema::create('facturas', function (Blueprint $table) {
        $table->id();
        // Relación con el conduce (un conduce genera una factura)
        $table->foreignId('conduce_id')->constrained('conduces')->onDelete('cascade');
        
        // Datos Fiscales (Exigidos por DGII)
        $table->string('ncf', 11)->unique(); // Ej: B0100000001
        $table->string('tipo_ncf', 2)->default('01'); // 01 = Crédito Fiscal
        $table->date('fecha_vencimiento_ncf');
        
        // Totales (Importante para reportes)
        $table->decimal('monto_total', 12, 2);
        $table->decimal('itbis', 12, 2)->default(0.00); // Las raciones suelen ser exentas (0%)
        
        // Control
        $table->string('estado')->default('emitida'); // emitida, pagada, anulada
        $table->timestamps();
    });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('facturas');
    }
};
