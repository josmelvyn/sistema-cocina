import AuthenticatedLayout from '@/Layouts/AuthenticatedLayout';
import { Head, Link } from '@inertiajs/react';
import { useLiveQuery } from 'dexie-react-hooks';
import { useEffect } from 'react'; // <--- ESTO ES LO QUE FALTA
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
                <div className="flex justify-between items-center">
                    <h2 className="font-black text-2xl text-gray-800 tracking-tight">Centro de Comando</h2>
                    <span className="text-sm font-medium bg-white px-4 py-1 rounded-full shadow-sm border border-gray-100 text-gray-500">
                        {new Date().toLocaleDateString('es-ES', { weekday: 'long', day: 'numeric', month: 'long' })}
                    </span>
                </div>
            }
        >
            <Head title="Dashboard" />

            <div className="py-8 bg-gray-50/50 min-h-screen">
                <div className="max-w-7xl mx-auto sm:px-6 lg:px-8 space-y-8">

                    {/* Tarjetas de Alto Impacto + Control de Suscripción */}
        <div className="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-5 gap-6">
            
            {/* CONTROL DE PERSONAL ($12 USD) - Solo visible para Admin */}
            {auth.user.rol === 'admin' && (
                <div className="bg-slate-900 rounded-3xl shadow-xl p-6 relative overflow-hidden border-b-8 border-indigo-500 hover:bg-black transition-colors">
                    <div className="flex justify-between items-start mb-4">
                        <div>
                            <p className="text-[9px] font-black uppercase text-indigo-400 tracking-widest mb-1 italic">Personal Activo</p>
                            <h3 className="text-3xl font-black text-white">{suscripcion.actuales} / {suscripcion.limite}</h3>
                        </div>
                        <div className="h-10 w-10 rounded-xl bg-indigo-500/20 flex items-center justify-center text-xl border border-indigo-500/30">
                            👥
                        </div>
                    </div>
                    <p className="text-[10px] font-bold text-gray-400 mb-4 uppercase italic">Inversión: ${(suscripcion.limite * 12)} USD/mes</p>
                    
                    <div className="w-full bg-gray-800 h-1.5 rounded-full overflow-hidden mb-4">
                        <div 
                            className={`h-full transition-all duration-700 ${suscripcion.actuales >= suscripcion.limite ? 'bg-red-500' : 'bg-indigo-400'}`} 
                            style={{ width: `${(suscripcion.actuales / suscripcion.limite) * 100}%` }}
                        ></div>
                    </div>

                    <Link href={route('usuarios.index')} className="inline-block w-full text-center py-2 bg-indigo-600 hover:bg-white hover:text-black text-white text-[10px] font-black uppercase rounded-xl transition-all">
                        {suscripcion.actuales >= suscripcion.limite ? 'Solicitar Cupos' : 'Gestionar Equipo'}
                    </Link>
                </div>
            )}
                    
                    {/* Tarjetas de Alto Impacto */}
                    
                        <Card title="Escuelas Activas" value={stats.total_escuelas} color="indigo" icon="🏢" description="Centros en servicio" />
                        <Card title="Raciones / Hoy" value={stats.raciones_hoy} color="orange" icon="⚡" description="Meta diaria: 2,500" progress={ (stats.raciones_hoy / 2500) * 100 } />
                        <Card title="Cuentas x Cobrar" value={`$${Number(stats.por_cobrar).toLocaleString()}`} color="rose" icon="💳" description="Pendiente de pago" />
                        <Card title="Gasto Operativo" value={`$${Number(stats.total_gastos).toLocaleString()}`} color="slate" icon="📊" description="Histórico mensual" />
                    </div>
                    

                    <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                        
                        {/* Panel de Inventario Critico */}
                        <div className="lg:col-span-1 bg-white rounded-3xl shadow-xl shadow-gray-200/50 border border-gray-100 overflow-hidden">
                            <div className="p-6 border-b border-gray-50 bg-gradient-to-r from-red-50 to-transparent">
                                <h3 className="font-black text-gray-800 flex items-center gap-2">
                                    <span className="flex h-3 w-3 rounded-full bg-red-500 animate-ping"></span>
                                    ALERTAS DE ABASTO
                                </h3>
                            </div>
                            <div className="p-6">
                                {insumos_bajos.length > 0 ? (
                                    <div className="space-y-4">
                                        {insumos_bajos.map(i => (
                                            <div key={i.id} className="group p-4 rounded-2xl bg-red-50/50 border border-red-100 hover:bg-red-50 transition-colors">
                                                <div className="flex justify-between items-center">
                                                    <div>
                                                        <p className="text-sm font-bold text-gray-800 uppercase tracking-tight">{i.nombre}</p>
                                                        <p className="text-xs text-red-500 font-medium">Nivel crítico detectado</p>
                                                    </div>
                                                    <div className="text-right">
                                                        <span className="text-lg font-black text-red-600">{i.stock_actual}</span>
                                                        <span className="text-[10px] block font-bold text-gray-400 uppercase">{i.unidad_medida}</span>
                                                    </div>
                                                </div>
                                            </div>
                                        ))}
                                        <Link href={route('insumos.index')} className="block text-center text-xs font-bold text-indigo-600 hover:underline pt-2">IR AL ALMACÉN →</Link>
                                    </div>
                                ) : (
                                    <div className="text-center py-10">
                                        <div className="text-4xl mb-4">✅</div>
                                        <p className="text-gray-400 text-sm font-medium italic">Almacén abastecido</p>
                                    </div>
                                )}
                            </div>
                        </div>
                                    
                        {/* Monitor de Logística */}
                        <div className="lg:col-span-2 bg-white rounded-3xl shadow-xl shadow-gray-200/50 border border-gray-100 overflow-hidden">
                            <div className="p-6 border-b border-gray-50 flex justify-between items-center">
                                <h3 className="font-black text-gray-800">FLUJO DE DESPACHOS RECIENTES</h3>
                                <Link href={route('conduces.index')} className="text-xs font-bold text-indigo-600 bg-indigo-50 px-3 py-1 rounded-lg">VER TODO</Link>
                            </div>
                            <div className="overflow-x-auto">
                                <table className="w-full">
                                    <thead>
                                        <tr className="bg-gray-50/50 text-[10px] font-black text-gray-400 uppercase tracking-[0.2em]">
                                            <th className="px-6 py-4 text-left">Centro Educativo</th>
                                            <th className="px-6 py-4 text-center">Volumen</th>
                                            <th className="px-6 py-4 text-right">Estatus Fiscal</th>
                                        </tr>
                                    </thead>
                                    <tbody className="divide-y divide-gray-50">
                                        {ultimos_conduces.map(c => (
                                            <tr key={c.id} className="group hover:bg-gray-50/80 transition-colors">
                                                <td className="px-6 py-5">
                                                    <div className="flex items-center gap-3">
                                                        <div className="h-10 w-10 rounded-xl bg-gray-100 flex items-center justify-center font-bold text-gray-400 group-hover:bg-indigo-100 group-hover:text-indigo-600 transition-colors">
                                                            {c.escuela?.nombre.charAt(0)}
                                                        </div>
                                                        <div>
                                                            <p className="text-sm font-bold text-gray-800">{c.escuela?.nombre}</p>
                                                            <p className="text-[10px] text-gray-400 font-medium italic">Referencia: {c.numero_conduce}</p>
                                                        </div>
                                                    </div>
                                                </td>
                                                <td className="px-6 py-5 text-center">
                                                    <span className="text-sm font-black text-gray-700">{c.cantidad_entregada}</span>
                                                    <span className="text-[10px] ml-1 text-gray-400 font-bold">UDS</span>
                                                </td>
                                                <td className="px-6 py-5 text-right">
                                                    <span className={`inline-flex px-3 py-1 rounded-full text-[10px] font-black tracking-tighter uppercase border ${
                                                        c.estado === 'pendiente' 
                                                        ? 'bg-amber-50 text-amber-600 border-amber-100' 
                                                        : 'bg-emerald-50 text-emerald-600 border-emerald-100'
                                                    }`}>
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
        indigo: 'from-indigo-500 to-blue-600 shadow-indigo-200 text-indigo-600',
        orange: 'from-orange-400 to-rose-500 shadow-orange-200 text-orange-600',
        rose: 'from-rose-500 to-red-600 shadow-rose-200 text-rose-600',
        slate: 'from-slate-700 to-slate-900 shadow-slate-200 text-slate-700',
    };

    return (
        <div className="bg-white rounded-3xl p-6 shadow-xl shadow-gray-200/50 border border-gray-100 relative overflow-hidden group hover:-translate-y-1 transition-all duration-300">
            <div className="flex justify-between items-start mb-4">
                <div className={`h-12 w-12 rounded-2xl bg-gray-50 flex items-center justify-center text-2xl group-hover:scale-110 transition-transform`}>
                    {icon}
                </div>
                <div className="text-right">
                    <p className="text-[10px] font-black text-gray-400 uppercase tracking-widest">{title}</p>
                    <p className={`text-2xl font-black ${colorMap[color].split(' ').pop()}`}>{value}</p>
                </div>
            </div>
            
            {progress !== undefined ? (
                <div className="mt-4">
                    <div className="flex justify-between text-[10px] font-bold mb-1">
                        <span className="text-gray-400 uppercase">Progreso Meta</span>
                        <span className="text-gray-800">{Math.round(progress)}%</span>
                    </div>
                    <div className="h-1.5 w-full bg-gray-100 rounded-full overflow-hidden">
                        <div 
                            className={`h-full bg-gradient-to-r ${colorMap[color].split(' ').slice(0,2).join(' ')}`} 
                            style={{ width: `${progress}%` }}
                        ></div>
                    </div>
                </div>
            ) : (
                <p className="mt-4 text-[10px] font-bold text-gray-400 italic border-t border-gray-50 pt-3">
                    {description}
                </p>
            )}
        </div>
    );
}