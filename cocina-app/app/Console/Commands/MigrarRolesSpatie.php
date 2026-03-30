<?php

namespace App\Console\Commands;

use Illuminate\Console\Command;
use App\Models\User;
use Spatie\Permission\Models\Role;

class MigrarRolesSpatie extends Command
{
    /**
     * The name and signature of the console command.
     *
     * @var string
     */
    protected $signature = 'roles:migrar';

    /**
     * The console command description.
     *
     * @var string
     */
    protected $description = 'Migra la columna rol de la tabla users a Spatie Permission';

    /**
     * Execute the console command.
     */
    public function handle()
    {
        $this->info('Iniciando migración de roles existenes a Spatie Permission...');

        $users = User::all();
        $count = 0;

        // Aseguramos que los roles existen
        Role::firstOrCreate(['name' => 'admin']);
        Role::firstOrCreate(['name' => 'staff']);

        foreach ($users as $user) {
            if ($user->rol) {
                // Asignar rol. Cuidado con usuarios que tienen roles no creados.
                if (in_array($user->rol, ['admin', 'staff'])) {
                    // Prevenir error si no tiene el trait asignado temporalmente, 
                    // usar try catch.
                    try {
                        $user->assignRole($user->rol);
                        $count++;
                    } catch (\Exception $e) {
                         $this->warn("Error al asignar rol a usuario {$user->id}: " . $e->getMessage());
                    }
                } else {
                    $this->warn("El usuario ID {$user->id} tiene un rol desconocido: '{$user->rol}'. Creándolo y asignándolo.");
                    Role::firstOrCreate(['name' => $user->rol]);
                    $user->assignRole($user->rol);
                    $count++;
                }
            }
        }

        $this->info("¡Completado! Migrados exitosamente {$count} usuarios.");
        return Command::SUCCESS;
    }
}
