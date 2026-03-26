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
        // 2. Configuramos la App (PWA)
        VitePWA({
            registerType: 'autoUpdate',
            injectRegister: 'auto',
            workbox: {
                globPatterns: ['**/*.{js,css,html,ico,png,svg}'], // Guarda estos archivos para offline
            },
            manifest: {
                name: 'Sistema Cocina Industrial',
                short_name: 'CocinaApp',
                description: 'Gestión de cocina con modo offline',
                theme_color: '#000000', // El color negro de tu diseño
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