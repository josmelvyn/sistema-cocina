import React, { useState } from 'react';
import AuthenticatedLayout from '@/Layouts/AuthenticatedLayout';
import { Head, useForm, router, Link } from '@inertiajs/react';

export default function Index({ auth, insumos }) {
    // 1. Formulario para Nuevo Insumo
    const { data, setData, post, processing, errors, reset } = useForm({
        nombre: '',
        unidad_medida: 'LB',
        stock_actual: '',
    });

    // 2. Estado para el Modal de "Agregar Stock"
    const [selectedInsumo, setSelectedInsumo] = useState(null);
    const [cantidadExtra, setCantidadExtra] = useState('');

    const submitNuevo = (e) => {
        e.preventDefault();
        post(route('insumos.store'), {
            onSuccess: () => {
                alert('Insumo registrado con éxito');
                reset();
            },
        });
    };

    const handleUpdateStock = (e) => {
        e.preventDefault();
        if (!cantidadExtra || cantidadExtra <= 0) return;

        // Enviamos al método update del controlador
        router.patch(route('insumos.update', selectedInsumo.id), {
            cantidad: cantidadExtra,
            descripcion: 'Compra / Reposición de inventario'
        }, {
            onSuccess: () => {
                alert('Stock actualizado correctamente');
                setSelectedInsumo(null);
                setCantidadExtra('');
            }
        });
    };

    return (
        <AuthenticatedLayout
            user={auth.user}
            header={
                <div className="flex justify-between items-center">
                    <h2 className="font-semibold text-xl text-gray-800 leading-tight">Almacén e Insumos</h2>
                    <Link href={route('recetas.index')} className="bg-black text-white px-4 py-2 rounded text-xs font-bold hover:bg-gray-800">
                        ⚙️ CONFIGURAR RECETAS
                    </Link>
                </div>
            }
        >
            <Head title="Insumos" />

            <div className="py-12">
                <div className="max-w-7xl mx-auto sm:px-6 lg:px-8 space-y-6">
                    
                    {/* FORMULARIO CREAR NUEVO */}
                    <div className="p-6 bg-white shadow sm:rounded-lg border-t-4 border-orange-500">
                        <h3 className="text-lg font-bold mb-4 text-gray-700">REGISTRAR NUEVA MERCANCÍA</h3>
                        <form onSubmit={submitNuevo} className="grid grid-cols-1 md:grid-cols-4 gap-4 items-end">
                            <div>
                                <label className="block text-sm font-bold text-gray-600">Nombre</label>
                                <input type="text" value={data.nombre} onChange={e => setData('nombre', e.target.value)} className="w-full border-gray-300 rounded-md" required />
                            </div>
                            <div>
                                <label className="block text-sm font-bold text-gray-600">Unidad</label>
                                <select value={data.unidad_medida} onChange={e => setData('unidad_medida', e.target.value)} className="w-full border-gray-300 rounded-md">
                                    <option value="LB">Libras (LB)</option>
                                    <option value="KG">Kilogramos (KG)</option>
                                    <option value="GL">Galones (GL)</option>
                                    <option value="UD">Unidades (UD)</option>
                                </select>
                            </div>
                            <div>
                                <label className="block text-sm font-bold text-gray-600">Stock Inicial</label>
                                <input type="number" step="0.01" value={data.stock_actual} onChange={e => setData('stock_actual', e.target.value)} className="w-full border-gray-300 rounded-md" required />
                            </div>
                            <button type="submit" disabled={processing} className="bg-orange-600 text-white font-bold py-2 px-4 rounded hover:bg-orange-700">
                                {processing ? 'GUARDANDO...' : 'REGISTRAR'}
                            </button>
                        </form>
                    </div>

                    {/* LISTADO DE INVENTARIO */}
                    <div className="bg-white shadow sm:rounded-lg overflow-hidden">
                        <table className="min-w-full divide-y divide-gray-200">
                            <thead className="bg-gray-100">
                                <tr>
                                    <th className="px-6 py-3 text-left text-xs font-bold text-gray-500 uppercase">Insumo</th>
                                    <th className="px-6 py-3 text-left text-xs font-bold text-gray-500 uppercase text-center">Stock Actual</th>
                                    <th className="px-6 py-3 text-right text-xs font-bold text-gray-500 uppercase">Acciones</th>
                                </tr>
                            </thead>
                            <tbody className="bg-white divide-y divide-gray-200">
                                {insumos.map((insumo) => (
                                    <tr key={insumo.id} className="hover:bg-gray-50 transition">
                                        <td className="px-6 py-4 font-bold text-gray-900 uppercase">{insumo.nombre}</td>
                                        <td className="px-6 py-4 text-center">
                                            <span className={`text-lg font-black ${insumo.stock_actual < 10 ? 'text-red-600' : 'text-gray-900'}`}>
                                                {insumo.stock_actual} <small className="text-[10px] text-gray-400">{insumo.unidad_medida}</small>
                                            </span>
                                        </td>
                                        <td className="px-6 py-4 text-right">
                                            <button 
                                                onClick={() => setSelectedInsumo(insumo)}
                                                className="bg-green-100 text-green-700 px-3 py-1 rounded-full text-xs font-bold hover:bg-green-200"
                                            >
                                                ➕ REABASTECER
                                            </button>
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                </div>
            </div>

            {/* MODAL SIMPLE PARA ACTUALIZAR STOCK */}
            {selectedInsumo && (
                <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
                    <div className="bg-white p-6 rounded-lg max-w-sm w-full shadow-2xl">
                        <h3 className="font-bold text-lg mb-2 uppercase">Reabastecer {selectedInsumo.nombre}</h3>
                        <p className="text-sm text-gray-500 mb-4">Ingresa la cantidad que vas a sumar al inventario.</p>
                        <form onSubmit={handleUpdateStock}>
                            <input 
                                type="number" step="0.01" autoFocus
                                className="w-full border-gray-300 rounded mb-4"
                                placeholder={`Cantidad en ${selectedInsumo.unidad_medida}`}
                                value={cantidadExtra}
                                onChange={e => setCantidadExtra(e.target.value)}
                                required
                            />
                            <div className="flex gap-2">
                                <button type="button" onClick={() => setSelectedInsumo(null)} className="flex-1 bg-gray-200 py-2 rounded font-bold">CANCELAR</button>
                                <button type="submit" className="flex-1 bg-green-600 text-white py-2 rounded font-bold">CONFIRMAR</button>
                            </div>
                        </form>
                    </div>
                </div>
            )}
        </AuthenticatedLayout>
    );
}