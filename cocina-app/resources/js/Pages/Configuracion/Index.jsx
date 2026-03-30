import React from 'react';
import AuthenticatedLayout from '@/Layouts/AuthenticatedLayout';
import { Head, useForm } from '@inertiajs/react';

export default function Index({ auth, empresa }) {
    const { data, setData, post, processing, errors, recentlySuccessful } = useForm({
        nombre_empresa: empresa?.nombre_empresa || '',
        direccion: empresa?.direccion || '',
        telefono: empresa?.telefono || '',
        email: empresa?.email || '',
        rnc: empresa?.rnc || '',
    });

    const submit = (e) => {
        e.preventDefault();
        post(route('configuracion.update'));
    };

    return (
        <AuthenticatedLayout
            user={auth.user}
            header={<h2 className="font-black text-xl text-gray-800 leading-tight uppercase">Configuración de la Empresa</h2>}
        >
            <Head title="Configuración" />

            <div className="py-12">
                <div className="max-w-4xl mx-auto sm:px-6 lg:px-8">
                    <div className="bg-white overflow-hidden shadow-xl sm:rounded-2xl border border-gray-100">
                        <div className="p-8">
                            <div className="mb-8">
                                <h3 className="text-lg font-black text-gray-800 uppercase tracking-tight">Perfil del Suplidor</h3>
                                <p className="text-sm text-gray-500 mt-1">Esta información aparecerá en el encabezado de todos tus reportes, conduces y facturas.</p>
                            </div>

                            <form onSubmit={submit} className="space-y-6">
                                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                    <div className="md:col-span-2">
                                        <label className="block text-xs font-black text-gray-500 uppercase tracking-widest mb-2">Nombre Comercial / Propietario</label>
                                        <input
                                            type="text"
                                            value={data.nombre_empresa}
                                            onChange={(e) => setData('nombre_empresa', e.target.value)}
                                            className="w-full bg-gray-50 border-gray-200 rounded-xl py-3 px-4 font-bold text-gray-700 focus:ring-indigo-500 focus:border-indigo-500 transition-all"
                                            placeholder="Ej: YDELSA MARIANA COLON BAUTISTA"
                                            required
                                        />
                                        {errors.nombre_empresa && <div className="text-red-500 text-xs mt-1 font-bold">{errors.nombre_empresa}</div>}
                                    </div>

                                    <div className="md:col-span-2">
                                        <label className="block text-xs font-black text-gray-500 uppercase tracking-widest mb-2">Dirección Completa</label>
                                        <textarea
                                            value={data.direccion}
                                            onChange={(e) => setData('direccion', e.target.value)}
                                            className="w-full bg-gray-50 border-gray-200 rounded-xl py-3 px-4 font-bold text-gray-700 focus:ring-indigo-500 focus:border-indigo-500 transition-all"
                                            placeholder="Ej: AV. HERMANOS MORENO MARTINEZ ESQ. TRINITARIA..."
                                            rows="3"
                                        />
                                        {errors.direccion && <div className="text-red-500 text-xs mt-1 font-bold">{errors.direccion}</div>}
                                    </div>

                                    <div>
                                        <label className="block text-xs font-black text-gray-500 uppercase tracking-widest mb-2">Teléfonos</label>
                                        <input
                                            type="text"
                                            value={data.telefono}
                                            onChange={(e) => setData('telefono', e.target.value)}
                                            className="w-full bg-gray-50 border-gray-200 rounded-xl py-3 px-4 font-bold text-gray-700 focus:ring-indigo-500 focus:border-indigo-500 transition-all"
                                            placeholder="809-XXX-XXXX / 829-XXX-XXXX"
                                        />
                                        {errors.telefono && <div className="text-red-500 text-xs mt-1 font-bold">{errors.telefono}</div>}
                                    </div>

                                    <div>
                                        <label className="block text-xs font-black text-gray-500 uppercase tracking-widest mb-2">Correo Electrónico</label>
                                        <input
                                            type="email"
                                            value={data.email}
                                            onChange={(e) => setData('email', e.target.value)}
                                            className="w-full bg-gray-50 border-gray-200 rounded-xl py-3 px-4 font-bold text-gray-700 focus:ring-indigo-500 focus:border-indigo-500 transition-all"
                                            placeholder="correo@ejemplo.com"
                                        />
                                        {errors.email && <div className="text-red-500 text-xs mt-1 font-bold">{errors.email}</div>}
                                    </div>

                                    <div>
                                        <label className="block text-xs font-black text-gray-500 uppercase tracking-widest mb-2">RNC</label>
                                        <input
                                            type="text"
                                            value={data.rnc}
                                            onChange={(e) => setData('rnc', e.target.value)}
                                            className="w-full bg-gray-50 border-gray-200 rounded-xl py-3 px-4 font-bold text-gray-700 focus:ring-indigo-500 focus:border-indigo-500 transition-all"
                                            placeholder="000-0000000-0"
                                        />
                                        {errors.rnc && <div className="text-red-500 text-xs mt-1 font-bold">{errors.rnc}</div>}
                                    </div>
                                </div>

                                <div className="flex items-center gap-4 pt-4">
                                    <button
                                        disabled={processing}
                                        className="bg-indigo-600 hover:bg-black text-white px-10 py-3.5 rounded-xl font-black text-xs uppercase tracking-widest transition-all shadow-lg shadow-indigo-600/20 active:scale-95 disabled:opacity-50"
                                    >
                                        {processing ? 'Guardando...' : 'Guardar Cambios'}
                                    </button>

                                    {recentlySuccessful && (
                                        <div className="text-emerald-600 font-bold text-sm animate-in fade-in slide-in-from-left-2 flex items-center gap-2">
                                            <span>✅</span> ¡Guardado con éxito!
                                        </div>
                                    )}
                                </div>
                            </form>
                        </div>
                    </div>
                </div>
            </div>
        </AuthenticatedLayout>
    );
}
