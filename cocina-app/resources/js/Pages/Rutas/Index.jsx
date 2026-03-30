import React from 'react';
import AuthenticatedLayout from '@/Layouts/AuthenticatedLayout';
import MobileLayout from '@/Layouts/MobileLayout';
import { Head, useForm, usePage } from '@inertiajs/react';

export default function Index({ auth, rutas }) {
    const { isMobile } = usePage().props;
    // Formulario para crear nuevas rutas
    const { data, setData, post, processing, errors, reset } = useForm({
        nombre: '',
        chofer: '',
    });

    const submit = (e) => {
        e.preventDefault();
        post(route('rutas.store'), {
            onSuccess: () => {
                alert('Ruta creada con éxito');
                reset();
            },
        });
    };

    if (isMobile) {
        return (
            <MobileLayout title="Rutas de Despacho" headerTitle="Rutas" headerSubtitle="Gestión Logística">
                <div className="p-4 space-y-6">
                    {/* NUEVA RUTA */}
                    <div className="bg-white rounded-3xl p-5 shadow-sm border border-slate-100">
                        <h3 className="text-sm font-black text-slate-800 uppercase mb-4 flex items-center gap-2">
                            <span>📍</span> Nueva Ruta
                        </h3>
                        <form onSubmit={submit} className="space-y-4">
                            <div>
                                <label className="text-[10px] font-bold text-slate-400 uppercase ml-1">Nombre Ruta</label>
                                <input 
                                    type="text" 
                                    value={data.nombre}
                                    onChange={e => setData('nombre', e.target.value)}
                                    placeholder="Ej: Ruta Norte"
                                    className="w-full bg-slate-50 border-slate-100 rounded-xl mt-1 h-12 text-sm text-slate-700 font-bold focus:ring-green-500"
                                    required
                                />
                                {errors.nombre && <div className="text-red-500 text-xs mt-1 px-2">{errors.nombre}</div>}
                            </div>
                            <div>
                                <label className="text-[10px] font-bold text-slate-400 uppercase ml-1">Chofer Asignado</label>
                                <input 
                                    type="text" 
                                    value={data.chofer}
                                    onChange={e => setData('chofer', e.target.value)}
                                    placeholder="Nombre del conductor"
                                    className="w-full bg-slate-50 border-slate-100 rounded-xl mt-1 h-12 text-sm text-slate-700 font-medium focus:ring-green-500"
                                />
                                {errors.chofer && <div className="text-red-500 text-xs mt-1 px-2">{errors.chofer}</div>}
                            </div>
                            <button 
                                disabled={processing}
                                className="w-full h-12 mt-2 rounded-xl font-black text-[10px] uppercase tracking-widest text-white bg-green-600 shadow-lg shadow-green-600/30 active:scale-95 transition-transform"
                            >
                                {processing ? "Guardando..." : "Crear Ruta"}
                            </button>
                        </form>
                    </div>

                    {/* LISTA DE RUTAS */}
                    <div>
                        <h3 className="text-sm font-black text-slate-800 uppercase mb-3 ml-1">Logística Activa</h3>
                        <div className="grid grid-cols-1 gap-3">
                            {rutas.map((ruta) => (
                                <div key={ruta.id} className="bg-white rounded-[1.5rem] p-4 flex flex-col justify-between shadow-sm border border-slate-100">
                                    <div className="flex items-start justify-between mb-3">
                                        <div className="flex items-center gap-3">
                                            <div className="h-10 w-10 rounded-full bg-blue-50 text-blue-500 flex items-center justify-center font-bold text-lg shadow-inner border border-blue-100">
                                                🚚
                                            </div>
                                            <div>
                                                <p className="font-black text-slate-800 uppercase tracking-tight text-sm leading-tight">{ruta.nombre}</p>
                                                <p className="text-[10px] font-bold text-slate-400 mt-0.5">REF: {ruta.id}</p>
                                            </div>
                                        </div>
                                    </div>

                                    <div className="bg-slate-50 rounded-xl p-3 flex justify-between items-center mb-4 border border-slate-100">
                                        <div className="flex items-center gap-2">
                                            <span className="text-lg">👤</span>
                                            <div>
                                                <p className="text-[9px] text-slate-400 uppercase font-black tracking-widest mb-0.5">Conductor</p>
                                                <p className="text-xs font-bold text-slate-700 capitalize w-24 truncate">{ruta.chofer || <span className="text-red-400 italic">Sin Asignar</span>}</p>
                                            </div>
                                        </div>
                                    </div>
                                    
                                    <a 
                                        href={route('rutas.reporte', ruta.id)} 
                                        target="_blank"
                                        className="w-full flex items-center justify-center gap-2 bg-blue-50 text-blue-600 font-black uppercase text-[10px] py-3 rounded-xl tracking-widest active:scale-95 transition-transform border border-blue-100"
                                    >
                                        <span>🖨️</span> Hoja de Ruta
                                    </a>
                                </div>
                            ))}
                            {rutas.length === 0 && (
                                <div className="text-center p-8 bg-white rounded-3xl border border-dashed border-slate-200">
                                    <p className="text-3xl mb-2 opacity-50">🌍</p>
                                    <p className="text-xs font-bold text-slate-500 uppercase tracking-widest">Sin Rutas</p>
                                </div>
                            )}
                        </div>
                    </div>
                </div>
            </MobileLayout>
        );
    }

    return (
        <AuthenticatedLayout
            user={auth.user}
            header={<h2 className="font-semibold text-xl text-gray-800 leading-tight">Gestión de Rutas de Despacho</h2>}
        >
            <Head title="Rutas" />

            <div className="py-12">
                <div className="max-w-7xl mx-auto sm:px-6 lg:px-8 space-y-6">
                    
                    {/* FORMULARIO DE CREACIÓN */}
                    <div className="p-6 bg-white shadow sm:rounded-lg border-t-4 border-green-600">
                        <h3 className="text-lg font-bold mb-4 text-gray-700 uppercase tracking-widest">Nueva Ruta</h3>
                        <form onSubmit={submit} className="grid grid-cols-1 md:grid-cols-3 gap-4 items-end">
                            <div>
                                <label className="block text-sm font-bold text-gray-600 mb-1">Nombre de la Ruta</label>
                                <input 
                                    type="text" 
                                    value={data.nombre}
                                    onChange={e => setData('nombre', e.target.value)}
                                    placeholder="Ej: Ruta Norte - San Francisco"
                                    className="w-full border-gray-300 rounded-md shadow-sm focus:ring-green-500"
                                    required
                                />
                                {errors.nombre && <div className="text-red-500 text-xs mt-1">{errors.nombre}</div>}
                            </div>
                            <div>
                                <label className="block text-sm font-bold text-gray-600 mb-1">Nombre del Chofer</label>
                                <input 
                                    type="text" 
                                    value={data.chofer}
                                    onChange={e => setData('chofer', e.target.value)}
                                    placeholder="Nombre del conductor"
                                    className="w-full border-gray-300 rounded-md shadow-sm focus:ring-green-500"
                                />
                                {errors.chofer && <div className="text-red-500 text-xs mt-1">{errors.chofer}</div>}
                            </div>
                            <button 
                                type="submit"
                                disabled={processing}
                                className="bg-green-600 hover:bg-green-700 text-white font-black py-2 px-6 rounded-md shadow transition duration-150 disabled:opacity-50 uppercase"
                            >
                                {processing ? '...' : 'CREAR RUTA'}
                            </button>
                        </form>
                    </div>

                    {/* TABLA DE RUTAS */}
                    <div className="bg-white shadow sm:rounded-lg overflow-hidden">
                        <table className="min-w-full divide-y divide-gray-200">
                            <thead className="bg-gray-800 text-white">
                                <tr>
                                    <th className="px-6 py-3 text-left text-xs font-bold uppercase tracking-wider">ID</th>
                                    <th className="px-6 py-3 text-left text-xs font-bold uppercase tracking-wider">Nombre de Ruta</th>
                                    <th className="px-6 py-3 text-left text-xs font-bold uppercase tracking-wider">Chofer Asignado</th>
                                    <th className="px-6 py-3 text-right text-xs font-bold uppercase tracking-wider">Logística</th>
                                </tr>
                            </thead>
                            <tbody className="bg-white divide-y divide-gray-200">
                                {rutas.map((ruta) => (
                                    <tr key={ruta.id} className="hover:bg-gray-50 transition">
                                        <td className="px-6 py-4 text-sm text-gray-500 font-mono">#{ruta.id}</td>
                                        <td className="px-6 py-4 text-sm font-black text-gray-900 uppercase">{ruta.nombre}</td>
                                        <td className="px-6 py-4 text-sm text-gray-600 font-medium">
                                            {ruta.chofer ? `👤 ${ruta.chofer}` : <span className="text-red-400 italic">Sin asignar</span>}
                                        </td>
                                        <td className="px-6 py-4 text-right">
                                            {/* BOTÓN PRO: Generar Hoja de Ruta para el Chofer */}
                                            <a 
                                                href={route('rutas.reporte', ruta.id)} 
                                                target="_blank"
                                                className="inline-flex items-center bg-blue-600 hover:bg-blue-700 text-white px-4 py-1.5 rounded-full text-xs font-black shadow-md transition transform hover:scale-105"
                                            >
                                                🚚 HOJA DE CHOFER
                                            </a>
                                        </td>
                                    </tr>
                                ))}
                                {rutas.length === 0 && (
                                    <tr>
                                        <td colSpan="4" className="px-6 py-10 text-center text-gray-400 italic font-medium">
                                            No hay rutas configuradas. Crea la primera arriba.
                                        </td>
                                    </tr>
                                )}
                            </tbody>
                        </table>
                    </div>
                </div>
            </div>
        </AuthenticatedLayout>
    );
}