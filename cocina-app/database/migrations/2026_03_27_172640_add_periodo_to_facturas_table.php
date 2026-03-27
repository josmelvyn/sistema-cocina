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
        Schema::table('facturas', function (Blueprint $table) {
            // Agregamos el campo periodo después del NCF
            $table->string('periodo')->nullable()->after('ncf');
            
            // Opcional: Si quieres guardar el rango de conduces (del No. al No.)
            $table->string('conduce_desde')->nullable()->after('periodo');
            $table->string('conduce_hasta')->nullable()->after('conduce_desde');
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::table('facturas', function (Blueprint $table) {
         $table->dropColumn(['periodo', 'conduce_desde', 'conduce_hasta']);
        });
    }
};
