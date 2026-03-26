import React, { useState } from 'react';
import AuthenticatedLayout from '@/Layouts/AuthenticatedLayout';
import { Head, useForm, router } from '@inertiajs/react';

export default function Index({ auth, platos, insumos }) {
    // 1. Formulario para crear el Plato con su Precio Base
    const { data, setData, post, processing, reset, errors } = useForm({
        nombre: '',
        precio_base: '',
    });

    const submitPlato = (e) => {
        e.preventDefault();
        post(route('platos.store'), { 
            onSuccess: () => reset() 
        });
    };

    // 2. Función para añadir ingredientes a un plato específico
    const agregarIngrediente = (platoId) => {
        const insumoId = document.getElementById(`insumo-${platoId}`).value;
        const cant = document.getElementById(`cant-${platoId}`).value;

        if(!insumoId || !cant) return alert("Seleccione insumo y cantidad");

        router.post(route('platos.ingrediente', platoId), {
            insumo_id: insumoId,
            cantidad_por_racion: cant
        }, {
            onSuccess: () => {
                document.getElementById(`insumo-${platoId}`).value = "";
                document.getElementById(`cant-${platoId}`).value = "";
            }
        });
    };

    return (
        <AuthenticatedLayout
            user={auth.user}
            header={<h2 className="font-semibold text-xl text-gray-800 leading-tight">Configuración de Menús y Precios</h2>}
        >
            <Head title="Platos y Menús" />

            <div className="py-12 max-w-7xl mx-auto sm:px-6 lg:px-8 space-y-6">
                
                {/* FORMULARIO PARA CREAR NUEVO PLATO */}
                <div className="p-6 bg-white shadow sm:rounded-lg border-t-4 border-indigo-600">
                    <h3 className="font-bold text-gray-700 mb-4 uppercase tracking-wider">Registrar Nuevo Menú / Plato</h3>
                    <form onSubmit={submitPlato} className="grid grid-cols-1 md:grid-cols-3 gap-4 items-end">
                        <div className="flex-1">
                            <label className="block text-sm font-bold text-gray-600 mb-1">Nombre del Plato</label>
                            <input 
                                type="text" 
                                value={data.nombre}
                                onChange={e => setData('nombre', e.target.value)}
                                placeholder="Ej: Moro de Guandules con Pollo"
                                className="w-full border-gray-300 rounded-md shadow-sm focus:ring-indigo-500"
                                required
                            />
                            {errors.nombre && <div className="text-red-500 text-xs mt-1">{errors.nombre}</div>}
                        </div>
                        <div>
                            <label className="block text-sm font-bold text-gray-600 mb-1">Precio Base por Ración ($)</label>
                            <input 
                                type="number" 
                                step="0.01"
                                value={data.precio_base}
                                onChange={e => setData('precio_base', e.target.value)}
                                placeholder="0.00"
                                className="w-full border-gray-300 rounded-md shadow-sm focus:ring-indigo-500"
                                required
                            />
                            {errors.precio_base && <div className="text-red-500 text-xs mt-1">{errors.precio_base}</div>}
                        </div>
                        <button 
                            disabled={processing}
                            className="bg-indigo-600 text-white px-6 py-2 rounded font-black hover:bg-indigo-700 transition shadow-md"
                        >
                            {processing ? '...' : 'CREAR PLATO'}
                        </button>
                    </form>
                </div>

                {/* LISTADO DE PLATOS CON SUS RECETAS */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    {platos.map((plato) => (
                        <div key={plato.id} className="bg-white shadow rounded-lg border overflow-hidden">
                            <div className="p-4 bg-gray-50 border-b flex justify-between items-center">
                                <div>
                                    <span className="font-black text-indigo-800 uppercase block">{plato.nombre}</span>
                                    <span className="text-green-600 font-bold text-sm">Precio: ${Number(plato.precio_base).toLocaleString()}</span>
                                </div>
                                <span className="text-xs text-gray-400 italic">ID: {plato.id}</span>
                            </div>
                            
                            <div className="p-4">
                                <h4 className="text-xs font-bold text-gray-500 mb-2 underline uppercase tracking-tighter">Ingredientes de la Receta:</h4>
                                <ul className="text-sm space-y-1 mb-4">
                                    {plato.recetas?.map(receta => (
                                        <li key={receta.id} className="flex justify-between border-b border-dashed py-1">
                                            <span className="text-gray-700">{receta.insumo?.nombre}</span>
                                            <span className="font-bold text-gray-900">{receta.cantidad_por_racion} {receta.insumo?.unidad_medida}</span>
                                        </li>
                                    ))}
                                    {plato.recetas?.length === 0 && <li className="text-gray-400 italic py-2">No hay ingredientes asignados</li>}
                                </ul>

                                {/* FORMULARIO PARA AÑADIR INGREDIENTE */}
                                <div className="mt-4 p-3 bg-indigo-50 rounded-lg border border-indigo-100">
                                    <p className="text-[10px] font-bold text-indigo-700 mb-2 uppercase text-center">Vincular Ingrediente al Plato</p>
                                    <div className="flex gap-2">
                                        <select id={`insumo-${plato.id}`} className="text-xs border-gray-300 rounded w-full">
                                            <option value="">-- Insumo --</option>
                                            {insumos.map(i => <option key={i.id} value={i.id}>{i.nombre} ({i.unidad_medida})</option>)}
                                        </select>
                                        <input id={`cant-${plato.id}`} type="number" step="0.0001" placeholder="Cant." className="text-xs border-gray-300 rounded w-24" />
                                        <button 
                                            onClick={() => agregarIngrediente(plato.id)}
                                            className="bg-indigo-600 text-white p-2 rounded text-[10px] font-black uppercase hover:bg-indigo-700"
                                        >
                                            ADD
                                        </button>
                                    </div>
                                </div>
                            </div>
                        </div>
                    ))}
                </div>
            </div>
        </AuthenticatedLayout>
    );
}