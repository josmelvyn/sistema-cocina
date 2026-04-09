import { defineConfig } from 'vite';
import laravel from 'laravel-vite-plugin';
import react from '@vitejs/plugin-react';
import { VitePWA } from 'vite-plugin-pwa';

export default defineConfig({
    server: {
        host: '10.0.0.52', // Permite conexiones externas
        hmr: {
            // El dominio de tu túnel ngrok actual
            host: 'miyoko-unreleased-overfavorably.ngrok-free.dev',
            protocol: 'wss', // Requerido para HTTPS de ngrok
        },
        cors: {
            // Esto elimina el error de "blocked by CORS policy"
            origin: '*',
            methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
            credentials: true,
        },
    },
    plugins: [
        laravel({
            input: 'resources/js/app.jsx',
            refresh: true,
        }),
        react(),
        VitePWA({
            registerType: 'autoUpdate',
            injectRegister: 'auto',
            devOptions: {
                enabled: true 
            },
            workbox: {
                globPatterns: ['**/*.{js,css,html,ico,png,svg,woff2,woff,ttf}'],
                runtimeCaching: [
                    {
                        urlPattern: ({ url }) => {
                            const internalPaths = ['/conduces', '/rutas', '/escuelas', '/mobile-dashboard', '/platos', '/insumos', '/dashboard', '/'];
                            return internalPaths.some(path => url.pathname === path || url.pathname.startsWith(path + '/'));
                        },
                        handler: 'NetworkFirst',
                        options: {
                            cacheName: 'system-navigation-cache',
                            networkTimeoutSeconds: 3, 
                            expiration: {
                                maxEntries: 100,
                                maxAgeSeconds: 30 * 24 * 60 * 60,
                            },
                            cacheableResponse: {
                                statuses: [0, 200]
                            }
                        },
                    },
                ]
            },
            manifest: {
                name: 'Sistema Cocina Industrial',
                short_name: 'CocinaApp',
                start_url: '/dashboard',
                scope: '/',
                theme_color: '#4f46e5',
                background_color: '#ffffff',
                display: 'standalone',
                icons: [
                    {
                        src: '/icons/icon-192x192.png',
                        sizes: '192x192',
                        type: 'image/png',
                        purpose: 'any'
                    },
                    {
                        src: '/icons/icon-512x512.png',
                        sizes: '512x512',
                        type: 'image/png',
                        purpose: 'maskable'
                    }
                ]
            }
        })
    ],
});