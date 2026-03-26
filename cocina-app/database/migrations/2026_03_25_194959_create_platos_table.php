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
    // 1. Crear tabla platos si no existe
    if (!Schema::hasTable('platos')) {
        Schema::create('platos', function (Blueprint $table) {
            $table->id();
            $table->string('nombre');
            $table->timestamps();
        });
    }

    // 2. Modificar la tabla recetas (que ya existe) para agregar plato_id
    Schema::table('recetas', function (Blueprint $table) {
        if (!Schema::hasColumn('recetas', 'plato_id')) {
            $table->foreignId('plato_id')->after('id')->nullable()->constrained('platos')->onDelete('cascade');
        }
    });

    // 3. Modificar conduces para que sepa qué plato se entregó
    Schema::table('conduces', function (Blueprint $table) {
        if (!Schema::hasColumn('conduces', 'plato_id')) {
            $table->foreignId('plato_id')->after('escuela_id')->nullable()->constrained('platos');
        }
    });
}
};
