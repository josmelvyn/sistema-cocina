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
            $table->decimal('entrega_latitud', 10, 8)->nullable()->after('estado');
            $table->decimal('entrega_longitud', 11, 8)->nullable()->after('entrega_latitud');
            $table->string('foto_evidencia')->nullable()->after('entrega_longitud');
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::table('conduces', function (Blueprint $table) {
            $table->dropColumn(['entrega_latitud', 'entrega_longitud', 'foto_evidencia']);
        });
    }
};
