<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::table('rutas', function (Blueprint $table) {
            // Agregamos las columnas faltantes después del ID
            $table->string('nombre')->after('id');
            $table->string('chofer')->nullable()->after('nombre');
        });
    }

    public function down(): void
    {
        Schema::table('rutas', function (Blueprint $table) {
            $table->dropColumn(['nombre', 'chofer']);
        });
    }
};
