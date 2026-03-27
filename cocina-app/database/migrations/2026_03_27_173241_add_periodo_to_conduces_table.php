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
        Schema::table('conduces', function (Blueprint $table) {
             $table->string('periodo_entrega')->nullable()->after('fecha_despacho');
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::table('conduces', function (Blueprint $table) {
            //
        });
    }
};
