import { defineConfig } from 'vite';
import laravel from 'laravel-vite-plugin';
import react from '@vitejs/plugin-react';
import { VitePWA } from 'vite-plugin-pwa'; // <-- 1. Importamos el plugin

export default defineConfig({
    plugins: [
        laravel({
            input: 'resources/js/app.jsx',
            refresh: true,
        }),
        react(),
        // 2. Configuramos la App PWA Avanzada
        VitePWA({
            registerType: 'autoUpdate',
            injectRegister: 'auto',
            devOptions: {
                enabled: true // Permite probar el modo offline incluso en npm run dev
            },
            workbox: {
                globPatterns: ['**/*.{js,css,html,ico,png,svg,woff2,woff,ttf}'],
                runtimeCaching: [
                    {
                        // Capturamos todas las rutas internas y la raíz para que el dashboard cargue siempre
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
                                maxAgeSeconds: 30 * 24 * 60 * 60, // 30 días
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
                start_url: '/dashboard', // Asegura que Safari sepa dónde empieza la app
                scope: '/',              // Abarca todas las rutas
                theme_color: '#4f46e5',  // Indigo vibrante
                background_color: '#ffffff',
                display: 'standalone', // Se abre como una app, sin barra de navegador
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