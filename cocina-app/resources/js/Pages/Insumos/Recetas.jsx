import React, { useState, useEffect } from 'react';
import AuthenticatedLayout from '@/Layouts/AuthenticatedLayout';
import { useForm } from '@inertiajs/react';

export default function Recetas({ auth, insumos, recetas }) {
    // 1. Estado para el cálculo global (esto no se envía a Laravel)
    const [global, setGlobal] = useState({
        cantidad_total: '',
        estudiantes: 30 // Base por defecto
    });

    const { data, setData, post, processing, reset } = useForm({
        insumo_id: '',
        cantidad_por_racion: '',
    });

    // 2. Efecto para calcular la ración automáticamente cuando escribes en los campos globales
    useEffect(() => {
        if (global.cantidad_total > 0 && global.estudiantes > 0) {
            const calculo = global.cantidad_total / global.estudiantes;
            setData('cantidad_por_racion', calculo.toFixed(6)); // 6 decimales para precisión industrial
        }
    }, [global]);

    const submit = (e) => {
        e.preventDefault();
        post(route('recetas.store'), {
            onSuccess: () => {
                reset();
                setGlobal({ ...global, cantidad_total: '' }); // Limpiar el total después de guardar
            }
        });
    };

    return (
        <AuthenticatedLayout 
            user={auth.user} 
            header={<h2 className="font-bold text-xl uppercase tracking-tight">Configurar Receta (Cálculo Global)</h2>}
        >
            <div className="py-12 max-w-7xl mx-auto sm:px-6 lg:px-8">
                
                {/* Formulario de Entrada */}
                <div className="bg-white p-6 shadow rounded-lg mb-6 border-t-4 border-black">
                    <form onSubmit={submit} className="space-y-6">
                        <div className="grid grid-cols-1 md:grid-cols-4 gap-4 items-end">
                            
                            {/* Selector de Insumo */}
                            <div className="col-span-1">
                                <label className="block text-xs font-black uppercase mb-1">Insumo</label>
                                <select 
                                    value={data.insumo_id} 
                                    onChange={e => setData('insumo_id', e.target.value)} 
                                    className="w-full border-gray-300 rounded text-sm focus:ring-black focus:border-black"
                                    required
                                >
                                    <option value="">-- Seleccionar --</option>
                                    {insumos.map(i => <option key={i.id} value={i.id}>{i.nombre} ({i.unidad_medida})</option>)}
                                </select>
                            </div>

                            {/* Campo: Cantidad Total para el grupo */}
                            <div>
                                <label className="block text-xs font-black uppercase mb-1 text-blue-600">Cant. Total (Ej: 15 Lbs)</label>
                                <input 
                                    type="number" 
                                    step="any"
                                    placeholder="Total para el grupo"
                                    value={global.cantidad_total} 
                                    onChange={e => setGlobal({...global, cantidad_total: e.target.value})} 
                                    className="w-full border-blue-200 bg-blue-50 rounded text-sm focus:ring-blue-500"
                                />
                            </div>

                            {/* Campo: Cantidad de Estudiantes */}
                            <div>
                                <label className="block text-xs font-black uppercase mb-1 text-blue-600">Estudiantes</label>
                                <input 
                                    type="number" 
                                    value={global.estudiantes} 
                                    onChange={e => setGlobal({...global, estudiantes: e.target.value})} 
                                    className="w-full border-blue-200 bg-blue-50 rounded text-sm focus:ring-blue-500"
                                />
                            </div>

                            {/* Resultado Final (Lo que va a la BD) */}
                            <div>
                                <label className="block text-xs font-black uppercase mb-1">Gasto x Ración</label>
                                <input 
                                    type="number" 
                                    step="0.000001" 
                                    readOnly
                                    value={data.cantidad_por_racion} 
                                    className="w-full border-gray-100 bg-gray-100 rounded text-sm font-mono text-gray-600 cursor-not-allowed" 
                                />
                            </div>
                        </div>

                        <div className="flex justify-end border-t pt-4">
                            <button 
                                disabled={processing}
                                className="bg-black text-white px-8 py-2 rounded font-bold uppercase text-xs hover:bg-gray-800 transition-all disabled:opacity-50"
                            >
                                {processing ? 'Guardando...' : 'Vincular a Receta'}
                            </button>
                        </div>
                    </form>
                </div>

                {/* Tabla de Resultados */}
                <div className="bg-white shadow rounded-lg overflow-hidden border border-gray-200">
                    <table className="w-full text-left">
                        <thead className="bg-gray-50 border-b">
                            <tr>
                                <th className="p-4 text-xs font-black uppercase text-gray-500">Ingrediente</th>
                                <th className="p-4 text-xs font-black uppercase text-gray-500">Ración Unitaria</th>
                                <th className="p-4 text-xs font-black uppercase text-gray-500 bg-blue-50 text-blue-700">Estimado Global (30 est.)</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-gray-100">
                            {recetas.map(r => (
                                <tr key={r.id} className="hover:bg-gray-50 transition-colors">
                                    <td className="p-4 font-bold text-gray-800">{r.insumo?.nombre}</td>
                                    <td className="p-4 font-mono text-sm text-gray-600">{r.cantidad_por_racion}</td>
                                    <td className="p-4 font-bold text-blue-700 bg-blue-50/30">
                                        {(r.cantidad_por_racion * 30).toFixed(2)} {r.insumo?.unidad_medida}
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                    {recetas.length === 0 && (
                        <div className="p-10 text-center text-gray-400 italic">No hay ingredientes vinculados aún.</div>
                    )}
                </div>
            </div>
        </AuthenticatedLayout>
    );
}