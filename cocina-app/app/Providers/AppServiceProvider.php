<?php

namespace App\Providers;

use Illuminate\Support\Facades\Vite;
use Illuminate\Support\ServiceProvider;
use Illuminate\Support\Facades\URL; // <-- Importante

class AppServiceProvider extends ServiceProvider
{
    /**
     * Register any application services.
     */
    public function register(): void
    {
        //
    }

    /**
     * Bootstrap any application services.
     */
    public function boot()
{
    if (str_contains(request()->getHost(), 'ngrok-free')) {
        URL::forceScheme('https');
        // Esto obliga a que los assets no busquen el localhost
        URL::forceRootUrl(config('app.url')); 
    }
}
}
