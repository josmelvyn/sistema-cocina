<?php

use App\Http\Controllers\ProfileController;
use App\Http\Controllers\RutaController;
use App\Http\Controllers\EscuelaController;
use App\Http\Controllers\ConduceController;
use App\Http\Controllers\RecetaController;
use App\Http\Controllers\InsumoController;
use App\Http\Controllers\DashboardController;
use App\Http\Controllers\ContabilidadController;
use App\Http\Controllers\PlatoController;
use App\Http\Controllers\SuscripcionController;
use Illuminate\Foundation\Application;
use App\Http\Controllers\SuperAdminController;
use App\Http\Controllers\UserController;

use Illuminate\Support\Facades\Route;
use App\Http\Middleware\CheckSubscription; 
use Inertia\Inertia;

Route::get('/', function () {
    return Inertia::render('Welcome', [
        'canLogin' => Route::has('login'),
        'canRegister' => Route::has('register'),
        'laravelVersion' => Application::VERSION,
        'phpVersion' => PHP_VERSION,
    ]);
});
Route::get('/pago-pendiente', function () {
    return "<h2>Tu suscripción de $12 USD ha vencido</h2>
            <p>Para renovar el acceso de tu cocina, por favor realiza una transferencia:</p>
            <ul>
                <li>Banco: [BHD ]</li>
                <li>Cuenta: [256523614]</li>
                <li>Monto: $12 USD (o equivalente local)</li>
            </ul>
            <p>Envía el comprobante al WhatsApp: [+1829-701-6721]</p>";
})->name('pago.pendiente');

Route::middleware(['auth'])->group(function () {
Route::post('/logout', [AuthenticatedSessionController::class, 'destroy'])->name('logout');
Route::get('/pago-pendiente', [SuscripcionController::class, 'aviso'])->name('pago.pendiente');   
Route::post('/suscribir-ahora', [SuscripcionController::class, 'suscribir'])->name('suscribir.post');
    // PANEL MAESTRO (Solo para ti)
    Route::group(['middleware' => function ($request, $next) {
        // CAMBIA ESTO POR TU CORREO REAL
        if (auth()->user()->email !== 'josmelvyn@outlook.es') {
            abort(403, 'No tienes permiso para entrar al Panel Maestro.');
        }
        return $next($request);
    }], function () {
        Route::get('/master-panel', [SuperAdminController::class, 'index'])->name('superadmin.index');
        Route::put('/master-panel/{id}', [SuperAdminController::class, 'actualizarPlan'])->name('superadmin.update');
    });

});

Route::middleware(['auth', CheckSubscription::class])->group(function () {
    
    // 1. Dashboard
    Route::get('/dashboard', [DashboardController::class, 'index'])->name('dashboard');

    // 2. Perfil
    Route::get('/profile', [ProfileController::class, 'edit'])->name('profile.edit');
    Route::patch('/profile', [ProfileController::class, 'update'])->name('profile.update');
    Route::delete('/profile', [ProfileController::class, 'destroy'])->name('profile.destroy');
    Route::get('/usuarios', [UserController::class, 'index'])->name('usuarios.index');
    Route::post('/usuarios', [UserController::class, 'store'])->name('usuarios.store');
    Route::delete('/usuarios/{id}', [UserController::class, 'destroy'])->name('usuarios.destroy');
    // 3. Conduces (LAS RUTAS ESPECÍFICAS VAN PRIMERO)
    Route::get('/conduces/{id}/imprimir', [ConduceController::class, 'imprimir'])->name('conduces.imprimir');
    Route::patch('/conduces/{id}/pagar', [ConduceController::class, 'pagar'])->name('conduces.pagar');
    Route::patch('/anular-conduce/{id}', [ConduceController::class, 'anular'])->name('conduces.anular');
    Route::resource('conduces', ConduceController::class);
    Route::post('/conduces/masivo', [ConduceController::class, 'generarMasivo'])->name('conduces.masivo');
    // 4. Recursos Básicos
    Route::resource('rutas', RutaController::class);
    Route::resource('escuelas', EscuelaController::class);
    Route::resource('insumos', InsumoController::class);
    Route::resource('recetas', RecetaController::class);
    Route::resource('platos', PlatoController::class);

    // 5. Platos e Ingredientes
    Route::post('/platos/{id}/ingrediente', [PlatoController::class, 'addIngrediente'])->name('platos.ingrediente');
    Route::get('/reporte-despacho', [PlatoController::class, 'reporteDespacho'])->name('reporte.despacho');
    // 6. Contabilidad y Gastos
    Route::get('/contabilidad', [ContabilidadController::class, 'index'])->name('contabilidad.index');
    Route::post('/gastos', [ContabilidadController::class, 'store'])->name('gastos.store');
    
    // 7. Reportes
    Route::get('/rutas/{id}/reporte', [RutaController::class, 'reporte'])->name('rutas.reporte');
    Route::get('/contabilidad/reporte-escuelas', [ContabilidadController::class, 'reporteEscuelas'])->name('contabilidad.reporte_escuelas');
    Route::get('/contabilidad/reporte', [ContabilidadController::class, 'reporteMensual'])->name('contabilidad.reporte');
});

require __DIR__.'/auth.php';