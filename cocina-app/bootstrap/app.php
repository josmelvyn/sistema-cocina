<?php

use Illuminate\Foundation\Application;
use Illuminate\Foundation\Configuration\Exceptions;
use Illuminate\Foundation\Configuration\Middleware;

return Application::configure(basePath: dirname(__DIR__))
    ->withRouting(
        web: __DIR__.'/../routes/web.php',
        commands: __DIR__.'/../routes/console.php',
        health: '/up',
    )
    ->withMiddleware(function (Middleware $middleware): void {
        $middleware->web(append: [
            \App\Http\Middleware\HandleInertiaRequests::class,
            \Illuminate\Http\Middleware\AddLinkHeadersForPreloadedAssets::class,
        ]);
        // Esto le dice a Laravel 11 que confíe en el túnel de ngrok
    $middleware->trustProxies(at: '*'); 
    
    $middleware->alias([
        'suscrito' => \App\Http\Middleware\CheckSubscription::class,
    ]);


        //
    })
    ->withExceptions(function (Exceptions $exceptions): void {
        //
    })->create();
