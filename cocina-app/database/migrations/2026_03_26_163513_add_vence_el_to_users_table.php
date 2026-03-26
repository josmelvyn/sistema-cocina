<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::table('users', function (Blueprint $table) {
            // Agregamos los campos que faltan (vence_el y limite)
            // Si ya tenías suscripcion_activa, Laravel ignorará el error o puedes comentarlo
            if (!Schema::hasColumn('users', 'suscripcion_activa')) {
                $table->boolean('suscripcion_activa')->default(false);
            }
            
            $table->date('vence_el')->nullable()->after('suscripcion_activa');
            $table->integer('limite_usuarios')->default(1)->after('vence_el');
        });
    }

    public function down(): void
    {
        Schema::table('users', function (Blueprint $table) {
            $table->dropColumn(['suscripcion_activa', 'vence_el', 'limite_usuarios']);
        });
    }
};