import '../css/app.css';
import './bootstrap';

import { createInertiaApp } from '@inertiajs/react';
import { resolvePageComponent } from 'laravel-vite-plugin/inertia-helpers';
import { createRoot } from 'react-dom/client';
// 1. IMPORTAMOS EL REGISTRADOR DE PWA
import { registerSW } from 'virtual:pwa-register';

const appName = import.meta.env.VITE_APP_NAME || 'Laravel';

createInertiaApp({
    title: (title) => `${title} - ${appName}`,
    resolve: (name) =>
        resolvePageComponent(
            `./Pages/${name}.jsx`,
            import.meta.glob('./Pages/**/*.jsx'),
        ),
    setup({ el, App, props }) {
        const root = createRoot(el);

        root.render(<App {...props} />);
    },
    progress: {
        color: '#4B5563',
    },
});

// 2. REGISTRAMOS EL SERVICE WORKER (Para iPhone y Android)
if ('serviceWorker' in navigator) {
    registerSW({
        onOfflineReady() {
            console.log('✅ Sistema de Cocina listo para trabajar sin internet.');
        },
        onNeedRefresh() {
            // Esto avisa si subiste una actualización al servidor
            if (confirm('Hay una nueva versión del sistema. ¿Deseas actualizar?')) {
                window.location.reload();
            }
        },
    });
}