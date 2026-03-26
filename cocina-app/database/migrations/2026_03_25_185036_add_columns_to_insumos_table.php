<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::table('insumos', function (Blueprint $table) {
            // Añadimos los campos después del ID
            $table->string('nombre')->after('id');
            $table->string('unidad_medida')->after('nombre');
            $table->decimal('stock_actual', 10, 2)->default(0)->after('unidad_medida');
        });
    }

    public function down(): void
    {
        Schema::table('insumos', function (Blueprint $table) {
            $table->dropColumn(['nombre', 'unidad_medida', 'stock_actual']);
        });
    }
};
