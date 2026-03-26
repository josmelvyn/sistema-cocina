import React from 'react';
import AuthenticatedLayout from '@/Layouts/AuthenticatedLayout';
import { Head, useForm } from '@inertiajs/react';

export default function Index({ auth, rutas }) {
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