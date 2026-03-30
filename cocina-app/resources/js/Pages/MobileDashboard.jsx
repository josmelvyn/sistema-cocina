import { Head, Link, usePage } from '@inertiajs/react';
import { useLiveQuery } from 'dexie-react-hooks';
import { useEffect, useState } from 'react';
import { db } from '../db';
import MobileLayout from '@/Layouts/MobileLayout';

export default function MobileDashboard({ auth, stats: serverStats, insumos_bajos: serverInsumos, ultimos_conduces: serverConduces, platos, escuelas }) {
    
    const [isOnline, setIsOnline] = useState(typeof navigator !== 'undefined' ? navigator.onLine : true);

    // 1. Obtener datos persistidos (Fallback Offline)
    const cachedData = useLiveQuery(() => db.cache.get('dashboard_stats'), [])?.data || null;
    
    // Priorizamos prop real (Online), si no hay, tiramos de caché (Offline)
    const stats = serverStats || cachedData?.stats || { raciones_hoy: 0, por_cobrar: 0, total_escuelas: 0 };
    const insumos_bajos = serverInsumos || cachedData?.insumos_bajos || [];
    const ultimos_conduces = serverConduces || cachedData?.ultimos_conduces || [];

    // 2. Efecto para guardar datos localmente cuando hay red
    useEffect(() => {
        if (typeof window !== 'undefined') {
            const handleStatus = () => setIsOnline(navigator.onLine);
            window.addEventListener('online', handleStatus);
            window.addEventListener('offline', handleStatus);
            
            if (navigator.onLine && serverStats) {
                db.cache.put({
                    key: 'dashboard_stats',
                    data: { stats: serverStats, insumos_bajos: serverInsumos, ultimos_conduces: serverConduces }
                });
                
                // También guardamos catálogos
                if (platos) db.platos.bulkPut(platos);
                if (escuelas) db.escuelas.bulkPut(escuelas);

                // --- CALENTAR CACHÉ (Warming up) ---
                const warmUp = async () => {
                    const routes = [
                        route('conduces.index'),
                        route('rutas.index'),
                        route('platos.index'),
                        route('insumos.index'),
                        route('escuelas.index')
                    ];
                    for (const r of routes) {
                        try {
                            // Guardamos la versión JSON (Para navegación Inertia)
                            await fetch(r, { headers: { 'X-Inertia': 'true' } });
                            // Guardamos la versión HTML (Para navegación forzada offline)
                            await fetch(r);
                        } catch (e) {
                            console.warn("Error pre-cargando ruta para offline:", r);
                        }
                    }
                };
                warmUp();
            }

            return () => {
                window.removeEventListener('online', handleStatus);
                window.removeEventListener('offline', handleStatus);
            };
        }
    }, [serverStats, serverInsumos, serverConduces, platos, escuelas]);

    return (
        <MobileLayout title="App Móvil" headerTitle="Cocina PWA" headerSubtitle={`Hola, ${auth.user.name}`}>
            <main className="p-4 space-y-6">
                
                {/* BANNER OFFLINE ADVERTENCIA */}
                {!isOnline && (
                    <div className="bg-orange-500 text-white rounded-2xl p-3 flex items-center gap-3 animate-pulse shadow-lg shadow-orange-500/20">
                        <span className="text-xl">📡</span>
                        <div>
                            <p className="font-black text-[10px] uppercase tracking-tighter">Modo Sin Conexión</p>
                            <p className="text-[9px] opacity-90">Viendo datos de la última vez. Puedes despachar normal.</p>
                        </div>
                    </div>
                )}

                {/* TARJETA PRINCIPAL (Raciones) */}
                <div className="bg-gradient-to-br from-indigo-600 via-purple-600 to-indigo-800 rounded-[2rem] p-6 text-white shadow-xl shadow-indigo-500/20 relative overflow-hidden active:scale-[0.98] transition-transform">
                    <div className="absolute top-0 right-0 -mr-8 -mt-8 w-32 h-32 rounded-full bg-white/10 blur-2xl pointer-events-none"></div>
                    <p className="text-xs font-bold text-indigo-200 uppercase tracking-widest mb-1">Raciones Hoy</p>
                    <h2 className="text-5xl font-black mb-6">{stats?.raciones_hoy || 0} <span className="text-lg font-medium text-indigo-200">uds</span></h2>
                    
                    <div className="grid grid-cols-2 gap-4 border-t border-white/20 pt-4">
                        <div>
                            <p className="text-[10px] text-indigo-200 uppercase font-semibold">Por Cobrar</p>
                            <p className="font-bold text-lg">${Number(stats?.por_cobrar || 0).toLocaleString()}</p>
                        </div>
                        <div>
                            <p className="text-[10px] text-indigo-200 uppercase font-semibold">Escuelas</p>
                            <p className="font-bold text-lg">{stats?.total_escuelas || 0} Activas</p>
                        </div>
                    </div>
                </div>

                {/* ACCESOS RÁPIDOS */}
                <div>
                    <h3 className="text-sm font-extrabold text-slate-800 mb-3 uppercase tracking-wider pl-1 font-black">Acciones Rápidas</h3>
                    <div className="grid grid-cols-4 gap-3">
                        <Shortcut href={route('conduces.index')} icon="📝" label="Despachar" bg="bg-emerald-100" text="text-emerald-700" />
                        <Shortcut href={route('rutas.index')} icon="🚚" label="Rutas" bg="bg-blue-100" text="text-blue-700" />
                        <Shortcut href={route('platos.index')} icon="🍲" label="Menú" bg="bg-orange-100" text="text-orange-700" />
                        <Shortcut href={route('insumos.index')} icon="📦" label="Almacén" bg="bg-slate-200" text="text-slate-700" />
                    </div>
                </div>

                {/* INSUMOS CRÍTICOS (Sólo si hay) */}
                {insumos_bajos && insumos_bajos.length > 0 && (
                    <div className="bg-rose-50 border border-rose-100/80 rounded-3xl p-5 shadow-sm">
                        <div className="flex items-center gap-2 mb-4">
                            <span className="text-rose-500 animate-pulse text-xl">⚠️</span>
                            <h3 className="text-sm font-black text-rose-800 uppercase tracking-wider">Inventario Crítico</h3>
                        </div>
                        <div className="grid gap-2">
                            {insumos_bajos.map(i => (
                                <div key={i.id} className="flex justify-between items-center bg-white p-3.5 rounded-2xl shadow-sm border border-rose-50">
                                    <span className="text-sm font-bold text-slate-700">{i.nombre}</span>
                                    <span className="bg-rose-100 text-rose-700 text-[10px] px-2.5 py-1 rounded-lg font-black uppercase tracking-wider">{i.stock_actual} {i.unidad_medida}</span>
                                </div>
                            ))}
                        </div>
                    </div>
                )}

                {/* ÚLTIMOS DESPACHOS */}
                <div>
                    <div className="flex justify-between items-center mb-3 pl-1">
                        <h3 className="text-sm font-extrabold text-slate-800 uppercase tracking-wider font-black">Últimos Despachos</h3>
                        <Link href={route('conduces.index')} className="text-[10px] font-bold text-indigo-600 bg-indigo-50 hover:bg-indigo-100 px-3 py-1.5 rounded-lg transition-colors">Ver todos</Link>
                    </div>
                    <div className="bg-white rounded-3xl shadow-sm border border-slate-100 overflow-hidden">
                        {ultimos_conduces && ultimos_conduces.length > 0 ? ultimos_conduces.map((c, index) => (
                            <Link href={route('conduces.index')} key={c.id} className={`p-4 flex justify-between items-center active:bg-slate-50 transition-colors block ${index !== ultimos_conduces.length - 1 ? 'border-b border-slate-50' : ''}`}>
                                <div className="flex items-center gap-3">
                                    <div className="h-10 w-10 rounded-full bg-slate-50 flex items-center justify-center font-bold text-slate-400 border border-slate-100">
                                        {c.escuela?.nombre?.charAt(0) || '?'}
                                    </div>
                                    <div>
                                        <p className="text-sm font-bold text-slate-800 leading-tight uppercase font-black tracking-tighter">{c.escuela?.nombre}</p>
                                        <p className="text-[10px] text-slate-400 font-medium mt-0.5 uppercase tracking-wide">REF: {c.numero_conduce}</p>
                                    </div>
                                </div>
                                <div className="text-right flex flex-col items-end gap-1">
                                    <p className="text-sm font-black text-slate-700">{c.cantidad_entregada} <span className="text-[10px] text-slate-400 font-normal">uds</span></p>
                                    <span className={`flex items-center gap-1 text-[9px] px-2 py-0.5 rounded-md font-bold uppercase tracking-wider border ${
                                        c.estado === 'pendiente' 
                                        ? 'bg-amber-50 text-amber-600 border-amber-100' 
                                        : c.estado === 'anulado'
                                        ? 'bg-rose-50 text-rose-600 border-rose-100'
                                        : 'bg-emerald-50 text-emerald-600 border-emerald-100'
                                    }`}>
                                        <span className={`w-1.5 h-1.5 rounded-full ${c.estado === 'pendiente' ? 'bg-amber-400 animate-pulse' : c.estado === 'anulado' ? 'bg-rose-500' : 'bg-emerald-400'}`}></span>
                                        {c.estado}
                                    </span>
                                </div>
                            </Link>
                        )) : (
                            <div className="p-8 text-center">
                                <span className="text-4xl block mb-2 opacity-50">📭</span>
                                <p className="text-slate-500 text-xs font-medium uppercase font-black italic">Sin actividad reciente</p>
                            </div>
                        )}
                    </div>
                </div>

            </main>
        </MobileLayout>
    );
}

function Shortcut({ href, icon, label, bg, text }) {
    const handleClick = (e) => {
        // Si no hay internet, forzamos navegación real para que el Service Worker tome el control
        if (!navigator.onLine) {
            e.preventDefault();
            window.location.href = href;
        }
    };

    return (
        <Link href={href} onClick={handleClick} className="flex flex-col items-center gap-1.5 group">
            <div className={`h-16 w-16 rounded-[1.2rem] ${bg} ${text} flex items-center justify-center text-2xl shadow-sm border border-black/5 group-active:scale-95 group-active:brightness-95 transition-all`}>
                {icon}
            </div>
            <span className="text-[10px] font-bold text-slate-600 text-center tracking-tight leading-none h-6 flex items-center">{label}</span>
        </Link>
    );
}
