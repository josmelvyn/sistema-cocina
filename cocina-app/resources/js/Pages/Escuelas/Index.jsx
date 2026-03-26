import React from 'react';
import AuthenticatedLayout from '@/Layouts/AuthenticatedLayout';
import { Head, useForm } from '@inertiajs/react';

export default function Index({ auth, escuelas, rutas }) {
    // Configuración del formulario con Inertia
    const { data, setData, post, processing, errors, reset } = useForm({
        nombre: '',
        ruta_id: '',
        codigo_minerd: '',
        raciones_estandar: '', // Asegúrate de que este campo esté aquí
    });

    const submit = (e) => {
        e.preventDefault();
        console.log("Enviando datos:", data); 

        post(route('escuelas.store'), {
            onSuccess: () => {
                alert('¡Escuela guardada con éxito!');
                reset();
            },
            onError: (err) => {
                console.error("Errores detectados:", err);
            }
        });
    };

    return (
        <AuthenticatedLayout
            user={auth.user}
            header={<h2 className="font-semibold text-xl text-gray-800 leading-tight">Gestión de Escuelas</h2>}
        >
            <Head title="Escuelas" />

            <div className="py-12">
                <div className="max-w-7xl mx-auto sm:px-6 lg:px-8 space-y-6">
                    
                    {/* Formulario para agregar Escuela */}
                    <div className="p-4 sm:p-8 bg-white shadow sm:rounded-lg">
                        <h3 className="text-lg font-medium text-gray-900 mb-4">Registrar Nueva Escuela</h3>
                        
                        <form onSubmit={submit} className="space-y-4">
                            <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                                {/* Nombre */}
                                <div>
                                    <label className="block text-sm font-medium text-gray-700">Nombre de Escuela</label>
                                    <input 
                                        type="text" 
                                        value={data.nombre}
                                        onChange={e => setData('nombre', e.target.value)}
                                        className="mt-1 block w-full border-gray-300 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500" 
                                        required
                                    />
                                    {errors.nombre && <div className="text-red-500 text-xs mt-1">{errors.nombre}</div>}
                                </div>

                                {/* Ruta */}
                                <div>
                                    <label className="block text-sm font-medium text-gray-700">Ruta Asignada</label>
                                    <select 
                                        value={data.ruta_id}
                                        onChange={e => setData('ruta_id', e.target.value)}
                                        className="mt-1 block w-full border-gray-300 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500"
                                        required
                                    >
                                        <option value="">Seleccione una ruta</option>
                                        {rutas.map(ruta => (
                                            <option key={ruta.id} value={ruta.id}>{ruta.nombre}</option>
                                        ))}
                                    </select>
                                    {errors.ruta_id && <div className="text-red-500 text-xs mt-1">{errors.ruta_id}</div>}
                                </div>

                                {/* Código MINERD */}
                                <div>
                                    <label className="block text-sm font-medium text-gray-700">Código MINERD</label>
                                    <input 
                                        type="text" 
                                        value={data.codigo_minerd}
                                        onChange={e => setData('codigo_minerd', e.target.value)}
                                        className="mt-1 block w-full border-gray-300 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500" 
                                        required
                                    />
                                    {errors.codigo_minerd && <div className="text-red-500 text-xs mt-1">{errors.codigo_minerd}</div>}
                                </div>

                                {/* Raciones Estándar - ¡IMPORTANTE! */}
                                <div>
                                    <label className="block text-sm font-medium text-gray-700">Raciones Estándar</label>
                                    <input 
                                        type="number" 
                                        value={data.raciones_estandar}
                                        onChange={e => setData('raciones_estandar', e.target.value)}
                                        className="mt-1 block w-full border-gray-300 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500" 
                                        required
                                    />
                                    {errors.raciones_estandar && <div className="text-red-500 text-xs mt-1">{errors.raciones_estandar}</div>}
                                </div>
                            </div>

                            <div className="flex justify-end">
                                <button 
                                    type="submit"
                                    disabled={processing}
                                    className="bg-blue-600 text-white px-6 py-2 rounded-md hover:bg-blue-700 transition disabled:opacity-50"
                                >
                                    {processing ? 'Guardando...' : 'Guardar Escuela'}
                                </button>
                            </div>
                        </form>
                    </div>

                    {/* Tabla de Escuelas */}
                    <div className="p-4 sm:p-8 bg-white shadow sm:rounded-lg overflow-x-auto">
                        <table className="min-w-full divide-y divide-gray-200">
                            <thead className="bg-gray-50">
                                <tr>
                                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Nombre</th>
                                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Ruta</th>
                                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Código</th>
                                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Raciones</th>
                                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Acciones</th>
                                </tr>
                            </thead>
                            <tbody className="bg-white divide-y divide-gray-200">
                                {escuelas.map((escuela) => (
                                    <tr key={escuela.id}>
                                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">{escuela.nombre}</td>
                                        <td className="px-6 py-4 whitespace-nowrap">
                                            <span className="px-2 py-1 bg-green-100 text-green-800 rounded-full text-xs font-semibold">
                                                {escuela.ruta?.nombre || 'Sin Ruta'}
                                            </span>
                                        </td>
                                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{escuela.codigo_minerd}</td>
                                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900 font-bold">{escuela.raciones_estandar}</td>
                                        <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                                            <button className="text-blue-600 hover:text-blue-900">Editar</button>
                                        </td>
                                    </tr>
                                ))}
                                {escuelas.length === 0 && (
                                    <tr>
                                        <td colSpan="5" className="px-6 py-4 text-center text-gray-500">No hay escuelas registradas.</td>
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