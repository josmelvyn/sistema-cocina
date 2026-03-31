<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;
use Illuminate\Support\Facades\DB;

return new class extends Migration
{
    public function up(): void
    {
        $driver = DB::getDriverName();

        if ($driver === 'mysql') {
            DB::statement("ALTER TABLE conduces MODIFY COLUMN estado VARCHAR(255) DEFAULT 'pendiente' NOT NULL");
        } elseif ($driver === 'sqlite') {
            // SQLite no soporta MODIFY COLUMN fácilmente, recrear tabla si es necesario
            // Para este caso, asumimos que la columna ya es VARCHAR, solo cambiar default
            // Si falla, manualmente ajustar en SQLite
            Schema::table('conduces', function (Blueprint $table) {
                $table->string('estado')->default('pendiente')->change();
            });
        } else {
            // Para otros drivers, usar change si soportan
            Schema::table('conduces', function (Blueprint $table) {
                $table->string('estado')->default('pendiente')->change();
            });
        }
    }

    public function down(): void
    {
        // Revertir a enum si es necesario
        $driver = DB::getDriverName();

        if ($driver === 'mysql') {
            DB::statement("ALTER TABLE conduces MODIFY COLUMN estado ENUM('pendiente', 'entregado', 'pagado', 'anulado') DEFAULT 'pendiente'");
        } elseif ($driver === 'sqlite') {
            Schema::table('conduces', function (Blueprint $table) {
                $table->enum('estado', ['pendiente', 'entregado', 'pagado', 'anulado'])->default('pendiente')->change();
            });
        }
    }
};