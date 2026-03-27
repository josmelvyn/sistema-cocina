import React, { useState } from 'react';
import { Head, router } from '@inertiajs/react';
import AuthenticatedLayout from '@/Layouts/AuthenticatedLayout'; // Ajusta según tu layout

export default function ReportesIndex({ auth, escuelas }) {
    const [data, setData] = useState({
        escuela_id: '',
        desde: '',
        hasta: '',
    });

    const generarRelacionCentro = (e) => {
        e.preventDefault();
        if (!data.escuela_id || !data.desde || !data.hasta) {
            alert("Por favor complete todos los campos");
            return;
        }
        
        // Redirige a la ruta que creamos en Laravel
        router.get(route('conduces.relacionCentro', data.escuela_id), {
            desde: data.desde,
            hasta: data.hasta
        });
    };

    return (
        <AuthenticatedLayout user={auth.user}>
            <Head title="Menú de Reportes" />

            <div className="py-12">
                <div className="max-w-4xl mx-auto sm:px-6 lg:px-8">
                    <div className="bg-white overflow-hidden shadow-sm sm:rounded-lg p-8">
                        <h2 className="text-2xl font-bold mb-6 text-gray-800 border-b pb-2">📦 Panel de Reportes</h2>

                        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                            
                            {/* TARJETA: RELACIÓN POR CENTRO */}
                            <div className="border rounded-xl p-6 hover:shadow-md transition bg-gray-50">
                                <h3 className="font-bold text-lg text-blue-700 mb-4 flex items-center">
                                    📄 Relación de Conduce por Centro
                                </h3>
                                <form onSubmit={generarRelacionCentro} className="space-y-4">
                                    <div>
                                        <label className="block text-sm font-medium text-gray-700">Seleccionar Centro:</label>
                                        <select 
                                            className="w-full mt-1 border-gray-300 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500"
                                            value={data.escuela_id}
                                            onChange={e => setData({...data, escuela_id: e.target.value})}
                                        >
                                            <option value="">-- Seleccione una escuela --</option>
                                            {escuelas.map(escuela => (
                                                <option key={escuela.id} value={escuela.id}>
                                                    {escuela.nombre} ({escuela.codigo_minerd})
                                                </option>
                                            ))}
                                        </select>
                                    </div>

                                    <div className="grid grid-cols-2 gap-4">
                                        <div>
                                            <label className="block text-sm font-medium text-gray-700">Desde:</label>
                                            <input 
                                                type="date" 
                                                className="w-full mt-1 border-gray-300 rounded-md shadow-sm"
                                                value={data.desde}
                                                onChange={e => setData({...data, desde: e.target.value})}
                                            />
                                        </div>
                                        <div>
                                            <label className="block text-sm font-medium text-gray-700">Hasta:</label>
                                            <input 
                                                type="date" 
                                                className="w-full mt-1 border-gray-300 rounded-md shadow-sm"
                                                value={data.hasta}
                                                onChange={e => setData({...data, hasta: e.target.value})}
                                            />
                                        </div>
                                    </div>

                                    <button 
                                        type="submit"
                                        className="w-full bg-blue-600 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded-md transition"
                                    >
                                        Ver Reporte / Imprimir
                                    </button>
                                </form>
                            </div>

                            {/* ESPACIO PARA OTROS REPORTES (Ej: Cierre de mes, Inventario) */}
                            <div className="border border-dashed border-gray-300 rounded-xl p-6 flex flex-col justify-center items-center text-gray-400">
                                <p>Próximamente:</p>
                                <p className="font-semibold">Resumen de Facturación Mensual</p>
                            </div>

                        </div>
                    </div>
                </div>
            </div>
        </AuthenticatedLayout>
    );
}