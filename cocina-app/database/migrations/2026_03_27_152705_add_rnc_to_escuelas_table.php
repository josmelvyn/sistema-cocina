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
        // El RNC tiene 9 u 11 dígitos, lo ponemos como string
        $table->string('rnc')->nullable()->after('codigo_minerd');
    });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::table('escuelas', function (Blueprint $table) {
        $table->dropColumn('rnc');
    });
    }
};
