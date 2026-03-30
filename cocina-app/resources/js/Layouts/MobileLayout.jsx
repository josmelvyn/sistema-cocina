import React, { useState, useEffect } from 'react';
import { Head, Link, usePage } from '@inertiajs/react';
import { db } from '@/db';
import { useLiveQuery } from 'dexie-react-hooks';
import axios from 'axios';

export default function MobileLayout({ children, title, headerTitle, headerSubtitle }) {
    const { auth, escuelas, conduces, rutas, insumos, platos } = usePage().props;
    
    // --- ESTADOS PWA (INSTALACIÓN) ---
    const [deferredPrompt, setDeferredPrompt] = useState(null);
    const [showInstallBtn, setShowInstallBtn] = useState(false);

    useEffect(() => {
        const handler = (e) => {
            e.preventDefault();
            setDeferredPrompt(e);
            setShowInstallBtn(true);
        };
        window.addEventListener('beforeinstallprompt', handler);
        return () => window.removeEventListener('beforeinstallprompt', handler);
    }, []);

    const handleInstallClick = async () => {
        if (!deferredPrompt) return;
        deferredPrompt.prompt();
        const { outcome } = await deferredPrompt.userChoice;
        if (outcome === 'accepted') {
            setShowInstallBtn(false);
        }
        setDeferredPrompt(null);
    };

    // --- ESTADOS OFFLINE / SYNC ---
    const [isOnline, setIsOnline] = useState(typeof navigator !== 'undefined' ? navigator.onLine : true);
    const syncQueue = useLiveQuery(() => db.sync_queue.toArray(), []) || [];
    const pendingCount = syncQueue.filter(item => item.status === 'pending').length;
    const errorCount = syncQueue.filter(item => item.status === 'error').length;

    // Detectar conectividad
    useEffect(() => {
        const handleOnline = () => setIsOnline(true);
        const handleOffline = () => setIsOnline(false);
        window.addEventListener('online', handleOnline);
        window.addEventListener('offline', handleOffline);
        return () => {
            window.removeEventListener('online', handleOnline);
            window.removeEventListener('offline', handleOffline);
        };
    }, []);

    // Respaldar datos frescos en Dexie si tenemos Red
    useEffect(() => {
        if (isOnline) {
            if (escuelas && escuelas.length) db.escuelas.bulkPut(escuelas);
            if (rutas && rutas.length) db.rutas.bulkPut(rutas);
            if (insumos && insumos.length) db.insumos.bulkPut(insumos);
            if (platos && platos.length) db.platos.bulkPut(platos);
            
            if (conduces && conduces.length) {
                // Conservar despachos creados offline que aún no se sincronizan
                db.transaction('rw', db.conduces, async () => {
                    const offlineConduces = await db.conduces.where({_offline: 1}).toArray();
                    await db.conduces.clear();
                    await db.conduces.bulkPut([...conduces, ...offlineConduces]);
                });
            }
        }
    }, [escuelas, conduces, rutas, insumos, platos, isOnline]);

    // Motor de Sincronización: Se activa si hay red y datos pendientes
    useEffect(() => {
        if (isOnline && pendingCount > 0) {
            processSyncQueue();
        }
    }, [isOnline, pendingCount]);

    const processSyncQueue = async () => {
        const pendingItems = await db.sync_queue.where('status').equals('pending').toArray();
        for (const item of pendingItems) {
            try {
                await axios({
                    method: item.action || 'POST',
                    url: item.route,
                    data: item.payload
                });
                // Éxito: borrar de la cola
                await db.sync_queue.delete(item.id);
                // Si fue un conduce, limpiar el registro falso offline para que el servidor baje el oficial
                if (item.route.includes('/conduces')) {
                    await db.conduces.where({_offline: 1}).delete();
                }
            } catch (error) {
                console.error("Error sincronizando (Posible falta de stock):", error);
                await db.sync_queue.update(item.id, {
                    status: 'error',
                    errorMessage: error.response?.data?.message || 'Error de sincronización'
                });
            }
        }
    };

    return (
        <div className="bg-slate-50 min-h-screen pb-24 font-sans text-slate-800">
            <Head title={title || "App Móvil"} />

            {/* AVISO DE INSTALACIÓN (BANNER FLOTANTE) */}
            {showInstallBtn && (
                <div className="fixed top-20 left-4 right-4 z-[100] bg-indigo-600 text-white p-4 rounded-2xl shadow-2xl flex items-center justify-between animate-in slide-in-from-top-10">
                    <div className="flex items-center gap-3">
                        <span className="text-2xl">📲</span>
                        <div>
                            <p className="font-black text-xs uppercase tracking-widest">Instalar App</p>
                            <p className="text-[10px] text-indigo-100">Para una mejor experiencia</p>
                        </div>
                    </div>
                    <div className="flex gap-2">
                        <button onClick={() => setShowInstallBtn(false)} className="text-[10px] font-bold uppercase p-2">Ahora no</button>
                        <button onClick={handleInstallClick} className="bg-white text-indigo-600 px-4 py-2 rounded-xl font-black text-[10px] uppercase shadow-sm active:scale-95 transition-all">Instalar</button>
                    </div>
                </div>
            )}

            {/* HEADER SUPERIOR */}
            <header className="sticky top-0 z-50 bg-white/80 backdrop-blur-md border-b border-slate-100 shadow-sm px-4 py-4 flex justify-between items-center">
                <div className="flex flex-col">
                    <h1 className="text-xl font-black bg-clip-text text-transparent bg-gradient-to-r from-indigo-600 to-purple-600 tracking-tight">
                        {headerTitle || "Cocina PWA"}
                    </h1>
                    <p className="text-[10px] text-slate-500 font-medium">
                        {headerSubtitle || `Hola, ${auth?.user?.name}`}
                    </p>
                </div>
                <div className="flex gap-2 items-center">
                    {/* INDICADOR DE RED Y SYNC */}
                    <div className="flex bg-slate-100 rounded-full h-8 px-3 items-center justify-center border border-slate-200 shadow-inner">
                        {!isOnline ? (
                            <span className="text-slate-400 font-black text-[10px] flex items-center gap-1 tracking-widest uppercase">☁️ OFF</span>
                        ) : pendingCount > 0 ? (
                            <span className="text-orange-500 font-black text-[10px] flex items-center gap-1 tracking-widest uppercase animate-pulse">☁️ SYNC</span>
                        ) : errorCount > 0 ? (
                            <span className="text-rose-500 font-black text-[10px] flex items-center gap-1 tracking-widest uppercase">☁️ ERR_{errorCount}</span>
                        ) : (
                            <span className="text-emerald-500 font-black text-[10px] flex items-center gap-1 tracking-widest uppercase opacity-50">☁️ ON</span>
                        )}
                    </div>

                    <Link href={route('profile.edit')} className="h-8 w-8 rounded-full bg-indigo-100 flex items-center justify-center text-indigo-600 font-bold uppercase overflow-hidden border border-indigo-200">
                        {auth?.user?.name?.charAt(0) || '?'}
                    </Link>
                </div>
            </header>

            {/* CONTENIDO PRINCIPAL */}
            <main className="min-h-full">
                {children}
            </main>

            {/* BOTTOM NAVIGATION BAR */}
            <nav className="fixed bottom-0 left-0 w-full bg-white/95 backdrop-blur-xl border-t border-slate-200/60 pb-5 pt-3 px-6 flex justify-between items-center z-50 shadow-[0_-10px_40px_rgba(0,0,0,0.06)]">
                <BottomLink href={route('dashboard')} icon="🏠" label="Inicio" active={route().current('dashboard*')} />
                <BottomLink href={route('rutas.index')} icon="🚚" label="Rutas" active={route().current('rutas.*')} />
                <BottomLink href={route('conduces.index')} icon="📝" label="Despachos" active={route().current('conduces.*')} />
                <BottomLink href={route('insumos.index')} icon="🏭" label="Insumos" active={route().current('insumos.*')} />
            </nav>
        </div>
    );
}

function BottomLink({ href, icon, label, active }) {
    return (
        <Link href={href} className="flex flex-col items-center gap-1 group w-16">
            <div className={`text-2xl transition-all duration-300 ${active ? 'scale-110 drop-shadow-md -translate-y-1' : 'opacity-40 grayscale group-active:scale-90 group-hover:opacity-100'}`}>
                {icon}
            </div>
            <span className={`text-[9px] font-bold transition-all duration-300 ${active ? 'text-indigo-600 opacity-100' : 'text-slate-500 opacity-0 group-hover:opacity-100'}`}>
                {label}
            </span>
            {active && (
                <div className="absolute -bottom-3 w-1 h-1 bg-indigo-600 rounded-full animate-bounce"></div>
            )}
        </Link>
    );
}
