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
       Schema::table('escuelas', function (Blueprint $table) {
        $table->string('director')->nullable();
        $table->string('direccion')->nullable();
        $table->string('municipio')->nullable()->default('San Francisco de Macorís');
        $table->string('telefono')->nullable();
        $table->string('distrito')->nullable()->default('07-05');
    });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
       Schema::table('escuelas', function (Blueprint $table) {
        $table->dropColumn(['director', 'direccion', 'municipio', 'telefono', 'distrito']);
    });
    }
};
