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
          // Campo para el NCF de la Nota de Crédito (B04...)
            $table->string('ncf_nota_credito', 11)->nullable()->after('ncf');
            
            // Campo para registrar el motivo legal de la anulación
            $table->text('motivo_anulacion')->nullable()->after('ncf_nota_credito');
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::table('facturas', function (Blueprint $table) {
               $table->dropColumn(['ncf_nota_credito', 'motivo_anulacion']);
        });
       
    }
};
