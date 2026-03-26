<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::table('movimientos_inventario', function (Blueprint $table) {
            // Relación con el insumo
            $table->foreignId('insumo_id')->after('id')->constrained('insumos')->onDelete('cascade');
            
            // Tipo de movimiento (entrada o salida)
            $table->enum('tipo', ['entrada', 'salida'])->after('insumo_id');
            
            // Cantidad del movimiento
            $table->decimal('cantidad', 10, 2)->after('tipo');
            
            // Descripción opcional
            $table->string('descripcion')->nullable()->after('cantidad');
        });
    }

    public function down(): void
    {
        Schema::table('movimientos_inventario', function (Blueprint $table) {
            $table->dropForeign(['insumo_id']);
            $table->dropColumn(['insumo_id', 'tipo', 'cantidad', 'descripcion']);
        });
    }
};
