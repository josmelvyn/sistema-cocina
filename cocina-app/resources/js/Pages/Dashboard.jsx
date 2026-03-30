import AuthenticatedLayout from '@/Layouts/AuthenticatedLayout';
import { Head, Link } from '@inertiajs/react';
import { useLiveQuery } from 'dexie-react-hooks';
import { useEffect } from 'react';
import { db } from '../db';

export default function Dashboard({ auth, stats, insumos_bajos,suscripcion, ultimos_conduces,platos, escuelas }) {

    const totalInsumos = insumos_bajos.length;
     // 1. Efecto para guardar datos localmente cuando hay internet
    useEffect(() => {
        if (platos) db.platos.bulkPut(platos);
        if (insumos_bajos) db.insumos.bulkPut(insumos_bajos);
        if (escuelas) db.escuelas.bulkPut(escuelas);
    }, [platos, insumos_bajos, escuelas]);

    // 2. Leer de la DB local (esto funciona aunque no haya internet)
    const platosLocales = useLiveQuery(() => db.platos.toArray());
    
    return (
        <AuthenticatedLayout
            user={auth.user}
            header={
                <div className="flex justify-between items-center px-2">
                    <div>
                        <h2 className="font-extrabold text-2xl md:text-3xl bg-clip-text text-transparent bg-gradient-to-r from-slate-800 to-slate-500 tracking-tight">Centro de Comando</h2>
                        <p className="text-xs md:text-sm text-slate-500 font-medium mt-1">Resumen general de operaciones</p>
                    </div>
                    <div className="hidden sm:flex items-center gap-3">
                        <span className="relative flex h-3 w-3">
                          <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
                          <span className="relative inline-flex rounded-full h-3 w-3 bg-emerald-500"></span>
                        </span>
                        <span className="text-xs md:text-sm font-semibold bg-white/70 backdrop-blur-md px-4 md:px-5 py-2 rounded-2xl shadow-sm border border-slate-200/60 text-slate-600">
                            {new Date().toLocaleDateString('es-ES', { weekday: 'long', day: 'numeric', month: 'long' })}
                        </span>
                    </div>
                </div>
            }
        >
            <Head title="Dashboard" />

            {/* Fondo moderno con radial gradient */}
            <div className="py-8 bg-[radial-gradient(ellipse_at_top,_var(--tw-gradient-stops))] from-slate-50 via-gray-50 to-slate-100 min-h-screen relative overflow-hidden">
                
                {/* Elementos decorativos de fondo super sutiles */}
                <div className="absolute top-0 left-0 w-full h-full overflow-hidden pointer-events-none z-0">
                    <div className="absolute -top-40 -right-40 w-96 h-96 bg-indigo-500/5 rounded-full blur-3xl"></div>
                    <div className="absolute top-40 -left-40 w-96 h-96 bg-rose-500/5 rounded-full blur-3xl"></div>
                </div>

                <div className="max-w-7xl mx-auto sm:px-6 lg:px-8 space-y-10 relative z-10">

                    {/* Tarjetas de Alto Impacto + Control de Suscripción */}
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-6">
                        
                        {/* CONTROL DE PERSONAL ($12 USD) - Solo visible para Admin */}
                        {auth.user.roles?.includes('admin') && (
                            <div className="lg:col-span-1 bg-gradient-to-br from-slate-900 to-slate-800 rounded-[2rem] shadow-[0_8px_30px_rgb(0,0,0,0.12)] p-7 relative overflow-hidden border border-slate-700/50 hover:shadow-indigo-500/20 transition-all duration-500 group">
                                <div className="absolute inset-0 bg-indigo-500/10 opacity-0 group-hover:opacity-100 transition-opacity duration-500"></div>
                                
                                <div className="flex justify-between items-start mb-6 relative z-10">
                                    <div>
                                        <p className="text-[10px] font-bold uppercase text-indigo-400 tracking-[0.2em] mb-2">Suscripción</p>
                                        <h3 className="text-4xl font-black text-white flex items-end gap-1">
                                            {suscripcion.actuales} 
                                            <span className="text-xl text-slate-400 font-medium">/ {suscripcion.limite}</span>
                                        </h3>
                                    </div>
                                    <div className="h-12 w-12 rounded-2xl bg-indigo-500/20 flex items-center justify-center text-2xl border border-indigo-500/30 shadow-[0_0_15px_rgba(99,102,241,0.2)]">
                                        💎
                                    </div>
                                </div>
                                
                                
                                <div className="w-full bg-slate-800 h-2 rounded-full overflow-hidden mb-2 relative z-10">
                                    <div 
                                        className={`h-full transition-all duration-1000 ease-out shadow-[0_0_10px_rgba(255,255,255,0.5)] ${suscripcion.actuales >= suscripcion.limite ? 'bg-rose-500' : 'bg-gradient-to-r from-indigo-500 to-blue-400'}`} 
                                        style={{ width: `${(suscripcion.actuales / suscripcion.limite) * 100}%` }}
                                    ></div>
                                </div>
                                <div className="flex justify-between items-center mb-6 relative z-10">
                                  <p className="text-[10px] font-medium text-slate-400 uppercase">Uso de licencias</p>
                                  <p className="text-[10px] font-bold text-indigo-300">${(suscripcion.limite * 12)} /mes</p>
                                </div>

                                <Link href={route('usuarios.index')} className="relative z-10 flex items-center justify-center w-full py-3 bg-white/10 hover:bg-white text-white hover:text-slate-900 text-xs font-bold uppercase tracking-wider rounded-xl transition-all duration-300 border border-white/20 hover:border-white hover:shadow-[0_0_20px_rgba(255,255,255,0.3)]">
                                    {suscripcion.actuales >= suscripcion.limite ? 'Ampliar Plan' : 'Gestionar Equipo'}
                                </Link>
                            </div>
                        )}
                        
                        {/* Tarjetas de Alto Impacto */}
                        <div className={`grid grid-cols-1 sm:grid-cols-2 gap-6 ${auth.user.roles?.includes('admin') ? 'lg:col-span-4 lg:grid-cols-4' : 'lg:col-span-5 lg:grid-cols-4'}`}>
                            <Card title="Escuelas Activas" value={stats.total_escuelas} color="indigo" icon="🏢" description="Centros en servicio" />
                            <Card title="Raciones / Hoy" value={stats.raciones_hoy} color="orange" icon="⚡" description="Meta diaria: 2,500" progress={ (stats.raciones_hoy / 2500) * 100 } />
                            <Card title="Cuentas x Cobrar" value={`$${Number(stats.por_cobrar).toLocaleString()}`} color="rose" icon="💳" description="Pendiente de pago" />
                            <Card title="Gasto Operativo" value={`$${Number(stats.total_gastos).toLocaleString()}`} color="emerald" icon="📊" description="Histórico mensual" />
                        </div>
                    </div>
                    

                    <div className="grid grid-cols-1 xl:grid-cols-3 gap-8">
                        
                        {/* Panel de Inventario Critico */}
                        <div className="xl:col-span-1 bg-white/70 backdrop-blur-xl rounded-[2rem] shadow-[0_8px_30px_rgb(0,0,0,0.04)] border border-white overflow-hidden flex flex-col h-full transform transition-all duration-500 hover:shadow-[0_8px_30px_rgb(0,0,0,0.08)]">
                            <div className="p-7 border-b border-rose-100/50 bg-gradient-to-r from-rose-50/50 to-transparent">
                                <h3 className="font-extrabold text-slate-800 flex items-center gap-3 text-sm tracking-widest uppercase">
                                    <span className="relative flex h-2.5 w-2.5">
                                        <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-rose-400 opacity-75"></span>
                                        <span className="relative inline-flex rounded-full h-2.5 w-2.5 bg-rose-500"></span>
                                    </span>
                                    Inventario Crítico
                                </h3>
                            </div>
                            <div className="p-7 flex-1 flex flex-col">
                                {insumos_bajos.length > 0 ? (
                                    <>
                                        <div className="space-y-4 flex-1">
                                            {insumos_bajos.map(i => (
                                                <div key={i.id} className="group p-5 rounded-2xl bg-white border border-rose-100/50 hover:bg-rose-50/30 transition-all duration-300 shadow-sm hover:shadow-md hover:border-rose-200">
                                                    <div className="flex justify-between items-center">
                                                        <div>
                                                            <p className="text-sm font-bold text-slate-800 tracking-tight">{i.nombre}</p>
                                                            <p className="text-[10px] text-rose-500 font-medium mt-1 flex items-center gap-1 uppercase">
                                                                <svg className="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z"></path></svg>
                                                                Nivel crítico
                                                            </p>
                                                        </div>
                                                        <div className="flex flex-col items-end">
                                                            <span className="text-xl font-black text-rose-600 bg-rose-50 px-3 py-1 rounded-xl">{i.stock_actual}</span>
                                                            <span className="text-[10px] font-bold text-slate-400 uppercase mt-1">{i.unidad_medida}</span>
                                                        </div>
                                                    </div>
                                                </div>
                                            ))}
                                        </div>
                                        <div className="mt-6 pt-6 border-t border-slate-100">
                                            <Link href={route('insumos.index')} className="flex items-center justify-center gap-2 w-full py-3 bg-slate-50 hover:bg-slate-100 text-slate-600 text-xs font-bold uppercase tracking-wider rounded-xl transition-all duration-300 border border-slate-200">
                                                <span>Ver Almacén Completo</span>
                                            </Link>
                                        </div>
                                    </>
                                ) : (
                                    <div className="flex-1 flex flex-col items-center justify-center py-12 text-center">
                                        <div className="h-20 w-20 bg-emerald-50 rounded-full flex items-center justify-center mb-6 shadow-inner">
                                            <span className="text-4xl shadow-emerald-200/50 drop-shadow-md">✨</span>
                                        </div>
                                        <h4 className="text-lg font-bold text-slate-800 mb-2">Todo en Orden</h4>
                                        <p className="text-slate-500 text-sm font-medium">Niveles de inventario óptimos</p>
                                    </div>
                                )}
                            </div>
                        </div>
                                    
                        {/* Monitor de Logística */}
                        <div className="xl:col-span-2 bg-white/70 backdrop-blur-xl rounded-[2rem] shadow-[0_8px_30px_rgb(0,0,0,0.04)] border border-white overflow-hidden flex flex-col h-full transform transition-all duration-500 hover:shadow-[0_8px_30px_rgb(0,0,0,0.08)]">
                            <div className="p-7 border-b border-slate-100 flex justify-between items-center bg-white/50">
                                <h3 className="font-extrabold text-slate-800 text-sm tracking-widest uppercase">Flujo de Despachos Recientes</h3>
                                <Link href={route('conduces.index')} className="text-xs font-bold text-indigo-600 bg-indigo-50/80 hover:bg-indigo-100 px-4 py-2 rounded-xl transition-colors">VER TODO</Link>
                            </div>
                            <div className="flex-1 overflow-x-auto p-4 md:p-6">
                                <table className="w-full border-separate border-spacing-y-3">
                                    <thead>
                                        <tr className="text-[10px] font-bold text-slate-400 uppercase tracking-widest text-left">
                                            <th className="px-4 py-2 font-semibold">Destino Educativo</th>
                                            <th className="px-4 py-2 font-semibold text-center">Volumen</th>
                                            <th className="px-4 py-2 font-semibold text-right">Estatus</th>
                                        </tr>
                                    </thead>
                                    <tbody className="mt-4">
                                        {ultimos_conduces.map(c => (
                                            <tr key={c.id} className="group bg-white hover:bg-slate-50/80 transition-all duration-300 rounded-2xl shadow-sm border border-slate-100/50">
                                                <td className="px-4 py-4 md:px-6 md:py-5 rounded-l-2xl border-y border-l border-slate-100/80">
                                                    <div className="flex items-center gap-4">
                                                        <div className="h-10 w-10 md:h-12 md:w-12 rounded-xl bg-gradient-to-br from-slate-100 to-slate-200 flex items-center justify-center font-bold text-slate-500 group-hover:from-indigo-100 group-hover:to-indigo-50 group-hover:text-indigo-600 transition-all shadow-inner">
                                                            {c.escuela?.nombre.charAt(0)}
                                                        </div>
                                                        <div>
                                                            <p className="text-sm md:text-base font-bold text-slate-800 group-hover:text-indigo-700 transition-colors">{c.escuela?.nombre}</p>
                                                            <p className="text-[10px] md:text-xs text-slate-400 font-medium tracking-wider mt-0.5">REF: {c.numero_conduce}</p>
                                                        </div>
                                                    </div>
                                                </td>
                                                <td className="px-4 py-4 md:px-6 md:py-5 text-center border-y border-slate-100/80">
                                                    <div className="inline-flex items-baseline gap-1 bg-slate-50 px-3 py-1.5 md:px-4 md:py-2 rounded-xl border border-slate-100">
                                                        <span className="text-sm md:text-base font-black text-slate-700">{c.cantidad_entregada}</span>
                                                        <span className="text-[10px] text-slate-400 font-bold">UDS</span>
                                                    </div>
                                                </td>
                                                <td className="px-4 py-4 md:px-6 md:py-5 text-right rounded-r-2xl border-y border-r border-slate-100/80">
                                                    <span className={`inline-flex items-center gap-1.5 px-3 py-1.5 md:px-4 md:py-2 rounded-xl text-[10px] md:text-xs font-bold tracking-widest uppercase border ${
                                                        c.estado === 'pendiente' 
                                                        ? 'bg-amber-50/80 text-amber-600 border-amber-200/50' 
                                                        : 'bg-emerald-50/80 text-emerald-600 border-emerald-200/50'
                                                    }`}>
                                                        <span className={`w-1.5 h-1.5 rounded-full ${c.estado === 'pendiente' ? 'bg-amber-500 animate-pulse' : 'bg-emerald-500'}`}></span>
                                                        {c.estado}
                                                    </span>
                                                </td>
                                            </tr>
                                        ))}
                                    </tbody>
                                </table>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </AuthenticatedLayout>
    );
}

function Card({ title, value, color, icon, description, progress }) {
    const colorMap = {
        indigo: { bg: 'bg-indigo-500', from: 'from-indigo-500', to: 'to-indigo-600', text: 'text-indigo-600', light: 'bg-indigo-50', border: 'border-indigo-100' },
        orange: { bg: 'bg-orange-500', from: 'from-orange-400', to: 'to-rose-500', text: 'text-orange-600', light: 'bg-orange-50', border: 'border-orange-100' },
        rose: { bg: 'bg-rose-500', from: 'from-rose-500', to: 'to-rose-600', text: 'text-rose-600', light: 'bg-rose-50', border: 'border-rose-100' },
        emerald: { bg: 'bg-emerald-500', from: 'from-emerald-400', to: 'to-emerald-600', text: 'text-emerald-600', light: 'bg-emerald-50', border: 'border-emerald-100' },
        slate: { bg: 'bg-slate-500', from: 'from-slate-600', to: 'to-slate-800', text: 'text-slate-700', light: 'bg-slate-100', border: 'border-slate-200' },
    };

    const style = colorMap[color] || colorMap.slate;

    return (
        <div className="bg-white/80 backdrop-blur-xl rounded-[2rem] p-7 shadow-[0_8px_30px_rgb(0,0,0,0.04)] border border-white relative overflow-hidden group hover:-translate-y-2 transition-all duration-500 hover:shadow-[0_20px_40px_rgb(0,0,0,0.08)] flex flex-col justify-between">
            <div className={`absolute -right-6 -top-6 w-32 h-32 rounded-full blur-[40px] opacity-20 group-hover:opacity-40 transition-opacity duration-500 pointer-events-none z-0 ${style.bg}`}></div>
            
            <div>
                <div className="flex justify-between items-start mb-4 relative z-10">
                    <div className={`h-14 w-14 rounded-2xl ${style.light} ${style.text} flex items-center justify-center text-2xl group-hover:scale-110 transition-all duration-500 shadow-sm border ${style.border}`}>
                        {icon}
                    </div>
                </div>
                
                <div className="relative z-10 mt-2">
                    <p className="text-[10px] sm:text-xs font-bold text-slate-400 uppercase tracking-widest mb-1">{title}</p>
                    <p className={`text-3xl font-black bg-clip-text text-transparent bg-gradient-to-r ${style.from} ${style.to} tracking-tight`}>{value}</p>
                </div>
            </div>
            
            {progress !== undefined ? (
                <div className="mt-6 relative z-10">
                    <div className="flex justify-between text-[10px] font-bold mb-2">
                        <span className="text-slate-400 uppercase tracking-wider">Progreso</span>
                        <span className="text-slate-700">{Math.round(progress)}%</span>
                    </div>
                    <div className="h-2 w-full bg-slate-100 rounded-full overflow-hidden shadow-inner">
                        <div 
                            className={`h-full bg-gradient-to-r ${style.from} ${style.to} rounded-full relative overflow-hidden transition-all duration-1000 ease-out`} 
                            style={{ width: `${progress}%` }}
                        >
                            <div className="absolute top-0 right-0 bottom-0 left-0 bg-white/20 animate-pulse"></div>
                        </div>
                    </div>
                </div>
            ) : (
                <p className="mt-6 text-xs font-medium text-slate-500 border-t border-slate-100 pt-4 relative z-10">
                    {description}
                </p>
            )}
        </div>
    );
}