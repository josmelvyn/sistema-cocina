import React, { useState } from 'react';
import AuthenticatedLayout from '@/Layouts/AuthenticatedLayout';
import MobileLayout from '@/Layouts/MobileLayout';
import { Head, useForm, router, Link, usePage } from '@inertiajs/react';

export default function Index({ auth, insumos }) {
    const { isMobile } = usePage().props;
    const [mostrarForm, setMostrarForm] = useState(false);
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

    if (isMobile) {
        return (
            <MobileLayout title="Almacén Móvil" headerTitle="Inventario" headerSubtitle="Gestión de Insumos">
                <div className="p-4 space-y-6 pb-20">
                    {/* ENCABEZADO Y ACCIONES */}
                    <div className="flex justify-between items-center bg-orange-500 rounded-3xl p-5 shadow-lg shadow-orange-500/30 text-white relative overflow-hidden">
                        <div className="absolute top-0 right-0 p-4 opacity-20 text-5xl">📦</div>
                        <div className="relative z-10">
                            <p className="text-3xl font-black leading-none">{insumos.length}</p>
                            <p className="text-[10px] uppercase font-bold text-orange-100 tracking-widest mt-1">Items Registrados</p>
                        </div>
                        <button onClick={() => setMostrarForm(!mostrarForm)} className={`relative z-10 bg-white text-orange-600 px-4 py-3 rounded-xl font-black text-[10px] uppercase shadow-sm active:scale-95 transition-all ${mostrarForm ? 'opacity-80' : ''}`}>
                            {mostrarForm ? "Cerrar" : "+ Añadir"}
                        </button>
                    </div>

                    {/* FORMULARIO DESPLEGABLE */}
                    {mostrarForm && (
                        <div className="bg-white rounded-3xl p-5 shadow-sm border border-slate-100 animate-in fade-in slide-in-from-top-4">
                            <h3 className="text-sm font-black text-slate-800 uppercase mb-4 flex items-center gap-2">
                                <span>🛒</span> Nuevo Insumo
                            </h3>
                            <form onSubmit={submitNuevo} className="space-y-4">
                                <div>
                                    <label className="text-[10px] font-bold text-slate-400 uppercase ml-1">Nombre</label>
                                    <input type="text" value={data.nombre} onChange={e => setData('nombre', e.target.value)} className="w-full bg-slate-50 border-slate-100 rounded-xl mt-1 h-12 text-sm font-bold text-slate-700 focus:ring-orange-500" placeholder="Ej: Arroz" required />
                                </div>
                                <div className="grid grid-cols-2 gap-3">
                                    <div>
                                        <label className="text-[10px] font-bold text-slate-400 uppercase ml-1">Medida</label>
                                        <select value={data.unidad_medida} onChange={e => setData('unidad_medida', e.target.value)} className="w-full bg-slate-50 border-slate-100 rounded-xl mt-1 h-12 text-xs font-bold text-slate-600 focus:ring-orange-500">
                                            <option value="LB">Libras (LB)</option>
                                            <option value="KG">Kilos (KG)</option>
                                            <option value="GL">Galones (GL)</option>
                                            <option value="UD">Unidades (UD)</option>
                                        </select>
                                    </div>
                                    <div>
                                        <label className="text-[10px] font-bold text-slate-400 uppercase ml-1">Stock Inicial</label>
                                        <input type="number" step="0.01" value={data.stock_actual} onChange={e => setData('stock_actual', e.target.value)} className="w-full bg-slate-50 border-slate-100 rounded-xl mt-1 h-12 text-center text-lg font-black text-orange-600 focus:ring-orange-500" placeholder="0" required />
                                    </div>
                                </div>
                                <button type="submit" disabled={processing} className="w-full h-12 bg-orange-600 text-white rounded-xl font-black text-[10px] uppercase tracking-widest shadow-lg shadow-orange-600/30 active:scale-95 transition-transform mt-2">
                                    {processing ? 'Guardando...' : 'Registrar Mercancía'}
                                </button>
                            </form>
                        </div>
                    )}

                    {/* LISTA DE INSUMOS */}
                    <div>
                        <div className="flex justify-between items-center mb-4 px-1">
                            <h3 className="text-sm font-black text-slate-800 uppercase">Existencias</h3>
                            <Link href={route('recetas.index')} className="text-[9px] font-black uppercase text-indigo-500 bg-indigo-50 px-3 py-1.5 rounded-lg active:scale-95">
                                Recetas 🧑‍🍳
                            </Link>
                        </div>
                        <div className="space-y-3">
                            {insumos.map((insumo) => (
                                <div key={insumo.id} className={`bg-white rounded-[1.5rem] p-4 shadow-sm border ${insumo.stock_actual < 10 ? 'border-red-200 bg-red-50/10' : 'border-slate-100'}`}>
                                    <div className="flex justify-between items-center">
                                        <div className="flex items-center gap-3">
                                            <div className={`h-12 w-12 rounded-full flex items-center justify-center font-black shadow-inner border ${insumo.stock_actual < 10 ? 'bg-red-50 text-red-500 border-red-100' : 'bg-orange-50 text-orange-500 border-orange-100'}`}>
                                                {insumo.nombre.charAt(0).toUpperCase()}
                                            </div>
                                            <div>
                                                <p className="font-bold text-slate-800 text-sm leading-tight uppercase">{insumo.nombre}</p>
                                                <p className="text-[10px] uppercase font-bold text-slate-400 mt-1">{insumo.unidad_medida}</p>
                                            </div>
                                        </div>
                                        <div className="text-right">
                                            <p className="text-[9px] uppercase font-bold text-slate-400 tracking-widest mb-0.5">Stock</p>
                                            <span className={`text-xl font-black ${insumo.stock_actual < 10 ? 'text-red-600' : 'text-slate-700'}`}>
                                                {insumo.stock_actual}
                                            </span>
                                        </div>
                                    </div>
                                    <div className="mt-4 pt-3 border-t border-slate-50 text-right">
                                        <button 
                                            onClick={() => setSelectedInsumo(insumo)}
                                            className="w-full bg-emerald-50 text-emerald-600 py-3 rounded-xl text-[10px] font-black uppercase tracking-widest active:scale-95 transition-transform border border-emerald-100 flex items-center justify-center gap-2"
                                        >
                                            <span>📥</span> Entrada / Reponer
                                        </button>
                                    </div>
                                </div>
                            ))}
                            {insumos.length === 0 && (
                                <div className="text-center p-8 bg-white rounded-3xl border border-dashed border-slate-200">
                                    <p className="text-3xl mb-2 opacity-50">💨</p>
                                    <p className="text-xs font-bold text-slate-500 uppercase tracking-widest">Almacén Vacío</p>
                                </div>
                            )}
                        </div>
                    </div>
                </div>

                {/* MODAL REABASTECER PWA */}
                {selectedInsumo && (
                    <div className="fixed inset-0 bg-slate-900/40 backdrop-blur-sm flex items-end justify-center z-[100] animate-in fade-in">
                        <div className="bg-white w-full rounded-t-3xl p-6 shadow-2xl animate-in slide-in-from-bottom flex flex-col pb-10">
                            <div className="w-12 h-1.5 bg-slate-200 rounded-full mx-auto mb-6"></div>
                            <h3 className="font-black text-xl mb-1 text-slate-800">Cargar Inventario</h3>
                            <p className="text-xs text-slate-500 mb-6 font-medium">Ingresa cuánto <span className="text-orange-500 font-bold uppercase">{selectedInsumo.nombre} ({selectedInsumo.unidad_medida})</span> estás recibiendo en físico.</p>
                            <form onSubmit={handleUpdateStock} className="flex flex-col gap-4 max-h-[80vh]">
                                <div className="relative">
                                    <span className="absolute right-4 top-1/2 -translate-y-1/2 text-xs font-black text-slate-300 uppercase">{selectedInsumo.unidad_medida}</span>
                                    <input 
                                        type="number" step="0.01" autoFocus
                                        className="w-full bg-slate-50 border-slate-200 rounded-2xl h-16 text-center text-3xl font-black text-slate-700 focus:ring-orange-500 focus:border-orange-500"
                                        placeholder="0.00"
                                        value={cantidadExtra}
                                        onChange={e => setCantidadExtra(e.target.value)}
                                        required
                                    />
                                </div>
                                <div className="grid grid-cols-2 gap-3 mt-4">
                                    <button type="button" onClick={() => {setSelectedInsumo(null); setCantidadExtra('');}} className="w-full h-14 bg-slate-100 text-slate-500 rounded-xl font-black text-[10px] uppercase tracking-widest active:scale-95">Cerrar</button>
                                    <button type="submit" className="w-full h-14 bg-emerald-500 text-white rounded-xl font-black text-[10px] uppercase tracking-widest shadow-lg shadow-emerald-500/30 active:scale-95">Confirmar</button>
                                </div>
                            </form>
                        </div>
                    </div>
                )}
            </MobileLayout>
        );
    }

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