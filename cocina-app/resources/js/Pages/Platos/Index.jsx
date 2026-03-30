import React, { useState } from 'react';
import AuthenticatedLayout from '@/Layouts/AuthenticatedLayout';
import MobileLayout from '@/Layouts/MobileLayout';
import { Head, useForm, router, usePage } from '@inertiajs/react';

export default function Index({ auth, platos, insumos }) {
    const { isMobile } = usePage().props;
    const [mostrarForm, setMostrarForm] = useState(false);
    // 1. Estados para la lógica de cálculo dinámica
    const [calc, setCalc] = useState({}); // Para el formulario de "Añadir"
    const [proyeccion, setProyeccion] = useState({}); // Para ver totales globales en la lista

    const handleCalcChange = (platoId, field, value) => {
        setCalc(prev => ({
            ...prev,
            [platoId]: { ...prev[platoId], [field]: value }
        }));
    };

    const handleProyeccionChange = (platoId, cant) => {
        setProyeccion(prev => ({ ...prev, [platoId]: cant }));
    };

    // 2. Formulario para crear Nuevo Plato
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

    // 3. Función para añadir ingredientes con división automática
    const agregarIngrediente = (platoId) => {
        const insumoId = document.getElementById(`insumo-${platoId}`).value;
        const totalGlobal = parseFloat(calc[platoId]?.total || 0);
        const cantEstudiantes = parseInt(calc[platoId]?.estudiantes || 1);

        let cantidadFinal = document.getElementById(`cant-manual-${platoId}`)?.value;
        
        // Si el usuario usó la calculadora negra, priorizamos ese cálculo
        if (totalGlobal > 0) {
            cantidadFinal = (totalGlobal / cantEstudiantes).toFixed(6);
        }

        if(!insumoId || !cantidadFinal || cantidadFinal <= 0) {
            return alert("Por favor, complete el insumo y la cantidad (o use la calculadora)");
        }

        router.post(route('platos.ingrediente', platoId), {
            insumo_id: insumoId,
            cantidad_por_racion: cantidadFinal
        }, {
            onSuccess: () => {
                document.getElementById(`insumo-${platoId}`).value = "";
                if(document.getElementById(`cant-manual-${platoId}`)) {
                    document.getElementById(`cant-manual-${platoId}`).value = "";
                }
                setCalc(prev => ({ ...prev, [platoId]: { total: '', estudiantes: '' } }));
            }
        });
    };

    if (isMobile) {
        return (
            <MobileLayout title="Recetas" headerTitle="Recetas" headerSubtitle="Gestión de Menús">
                <div className="p-4 space-y-6 pb-20">
                    {/* ENCABEZADO SUPERIOR */}
                    <div className="flex justify-between items-center bg-indigo-900 rounded-3xl p-5 shadow-lg shadow-indigo-900/30 text-white relative overflow-hidden">
                        <div className="absolute -bottom-2 -right-2 p-4 opacity-20 text-6xl">🧑‍🍳</div>
                        <div className="relative z-10">
                            <p className="text-3xl font-black leading-none">{platos.length}</p>
                            <p className="text-[10px] uppercase font-bold text-indigo-300 tracking-widest mt-1">Menús Creados</p>
                        </div>
                        <button onClick={() => setMostrarForm(!mostrarForm)} className={`relative z-10 bg-white text-indigo-900 px-4 py-3 rounded-xl font-black text-[10px] uppercase shadow-sm active:scale-95 transition-all ${mostrarForm ? 'opacity-80' : ''}`}>
                            {mostrarForm ? "Cerrar" : "+ Nuevo"}
                        </button>
                    </div>

                    {/* FORMULARIO DESPLEGABLE */}
                    {mostrarForm && (
                        <div className="bg-white rounded-3xl p-5 shadow-sm border border-slate-100 animate-in fade-in slide-in-from-top-4">
                            <h3 className="text-sm font-black text-slate-800 uppercase mb-4 flex items-center gap-2">
                                <span>🍲</span> Crear Plato
                            </h3>
                            <form onSubmit={submitPlato} className="space-y-4">
                                <div>
                                    <label className="text-[10px] font-bold text-slate-400 uppercase ml-1">Nombre del Menú</label>
                                    <input type="text" value={data.nombre} onChange={e => setData('nombre', e.target.value)} placeholder="Ej: Arroz con Habichuela" className="w-full bg-slate-50 border-slate-100 rounded-xl mt-1 h-12 text-sm font-bold text-slate-700 focus:ring-indigo-500" required />
                                </div>
                                <div>
                                    <label className="text-[10px] font-bold text-slate-400 uppercase ml-1">Precio Referencia x Ración ($)</label>
                                    <input type="number" step="0.01" value={data.precio_base} onChange={e => setData('precio_base', e.target.value)} placeholder="0.00" className="w-full bg-slate-50 border-slate-100 rounded-xl mt-1 h-12 text-center text-lg font-black text-indigo-600 focus:ring-indigo-500" required />
                                </div>
                                <button disabled={processing} className="w-full h-12 bg-indigo-900 text-white rounded-xl font-black text-[10px] uppercase tracking-widest shadow-lg shadow-indigo-900/30 active:scale-95 transition-transform mt-2">
                                    {processing ? 'Guardando...' : 'Registrar Plato'}
                                </button>
                            </form>
                        </div>
                    )}

                    {/* LISTADO DE MENÚS Y RECETAS */}
                    <div>
                        <h3 className="text-sm font-black text-slate-800 uppercase mb-3 ml-1">Archivo de Recetas</h3>
                        <div className="space-y-4">
                            {platos.map((plato) => (
                                <div key={plato.id} className="bg-white rounded-[1.5rem] shadow-sm border border-slate-100 overflow-hidden">
                                    {/* CABECERA TARJETA */}
                                    <div className="p-4 bg-indigo-50/50 flex justify-between items-start border-b border-indigo-50">
                                        <div>
                                            <p className="font-black text-indigo-900 uppercase text-sm leading-tight">{plato.nombre}</p>
                                            <p className="text-[10px] font-bold text-emerald-600 mt-1 bg-emerald-100/50 inline-block px-2 py-0.5 rounded-md">P. Base: ${plato.precio_base}</p>
                                        </div>
                                    </div>

                                    <div className="p-4">
                                        <div className="flex justify-between items-end mb-4">
                                            <div className="w-32">
                                                <p className="text-[9px] font-black text-indigo-400 uppercase mb-1">Calcular Proyección:</p>
                                                <div className="relative">
                                                    <span className="absolute left-3 top-1/2 -translate-y-1/2 text-[10px] font-bold text-slate-400">Niños:</span>
                                                    <input 
                                                        type="number" 
                                                        placeholder="0" 
                                                        className="w-full bg-slate-50 border-slate-100 h-10 rounded-xl text-xs font-black text-indigo-700 pl-14 focus:ring-indigo-500"
                                                        value={proyeccion[plato.id] || ''}
                                                        onChange={(e) => handleProyeccionChange(plato.id, e.target.value)}
                                                    />
                                                </div>
                                            </div>
                                            <button 
                                                onClick={() => router.get(route('reporte.despacho'), { plato_id: plato.id, estudiantes: proyeccion[plato.id] })}
                                                disabled={!proyeccion[plato.id]}
                                                className={`h-10 px-4 rounded-xl text-[10px] uppercase font-black tracking-widest flex items-center gap-1 transition-all ${proyeccion[plato.id] ? 'bg-indigo-900 text-white shadow-md active:scale-95' : 'bg-slate-100 text-slate-400'}`}
                                            >
                                                <span>🖨️</span> {proyeccion[plato.id] ? 'Imprimir' : 'PDF'}
                                            </button>
                                        </div>

                                        <h4 className="text-[10px] font-black text-slate-400 uppercase tracking-widest border-b border-slate-100 pb-2 mb-3">Total Insumos</h4>
                                        <ul className="space-y-2 mb-4">
                                            {plato.recetas?.map(receta => {
                                                const totalProyectado = proyeccion[plato.id] > 0 
                                                    ? (receta.cantidad_por_racion * proyeccion[plato.id]).toFixed(2)
                                                    : null;

                                                return (
                                                    <li key={receta.id} className="flex justify-between items-center bg-slate-50 p-3 rounded-xl border border-slate-100">
                                                        <div>
                                                            <span className="text-xs font-bold text-slate-800 uppercase block">{receta.insumo?.nombre}</span>
                                                            <span className="text-[9px] text-slate-400 font-mono">1 Unidad = {parseFloat(receta.cantidad_por_racion).toFixed(4)}</span>
                                                        </div>
                                                        <div className="text-right">
                                                            {totalProyectado ? (
                                                                <div className="flex flex-col">
                                                                    <span className="text-sm font-black text-indigo-600">{totalProyectado}</span>
                                                                    <span className="text-[8px] font-bold text-slate-400 uppercase">{receta.insumo?.unidad_medida} TTL</span>
                                                                </div>
                                                            ) : (
                                                                <span className="font-black text-xs text-slate-600">{receta.cantidad_por_racion} <span className="text-[9px] text-slate-400 uppercase">{receta.insumo?.unidad_medida}</span></span>
                                                            )}
                                                        </div>
                                                    </li>
                                                );
                                            })}
                                            {(!plato.recetas || plato.recetas.length === 0) && (
                                                <p className="text-xs text-center text-slate-400 py-2 italic">Sin insumos asignados</p>
                                            )}
                                        </ul>

                                        {/* AÑADIR INGREDIENTE */}
                                        <div className="bg-slate-800 rounded-xl p-4 mt-2">
                                            <p className="text-[10px] font-black text-indigo-300 uppercase tracking-widest mb-3 flex items-center justify-between">
                                                <span>Calculadora de Receta</span>
                                                <span>🔢</span>
                                            </p>
                                            <div className="grid grid-cols-2 gap-2 mb-3">
                                                <div>
                                                    <label className="text-[8px] uppercase font-bold text-slate-400 ml-1">Masa Total</label>
                                                    <input 
                                                        type="number" 
                                                        placeholder="Ej: 50 Lbs"
                                                        className="w-full bg-slate-900 border-none rounded-lg text-xs text-white placeholder-slate-600 h-10 focus:ring-indigo-500"
                                                        value={calc[plato.id]?.total || ''}
                                                        onChange={(e) => handleCalcChange(plato.id, 'total', e.target.value)}
                                                    />
                                                </div>
                                                <div>
                                                    <label className="text-[8px] uppercase font-bold text-slate-400 ml-1">Entre cuántos Niños</label>
                                                    <input 
                                                        type="number" 
                                                        placeholder="Ej: 100"
                                                        className="w-full bg-slate-900 border-none rounded-lg text-xs text-white placeholder-slate-600 h-10 focus:ring-indigo-500"
                                                        value={calc[plato.id]?.estudiantes || ''}
                                                        onChange={(e) => handleCalcChange(plato.id, 'estudiantes', e.target.value)}
                                                    />
                                                </div>
                                            </div>
                                            <div className="space-y-2">
                                                <select id={`insumo-${plato.id}`} className="w-full bg-slate-900 text-white text-xs font-bold rounded-lg p-2.5 border-none focus:ring-indigo-500">
                                                    <option value="">-- Insumo --</option>
                                                    {insumos.map(i => <option key={i.id} value={i.id}>{i.nombre} ({i.unidad_medida})</option>)}
                                                </select>
                                                
                                                <div className="flex gap-2">
                                                    {!(calc[plato.id]?.total > 0) && (
                                                        <input id={`cant-manual-${plato.id}`} type="number" step="0.0001" placeholder="Cant. individual" className="flex-1 bg-slate-900 text-white text-xs font-bold rounded-lg p-2.5 border-none focus:ring-indigo-500" />
                                                    )}
                                                    <button 
                                                        onClick={() => agregarIngrediente(plato.id)}
                                                        className="flex-1 bg-indigo-500 text-white rounded-lg font-black text-[10px] uppercase tracking-widest active:scale-95 transition-transform"
                                                    >
                                                        Añadir ➕
                                                    </button>
                                                </div>
                                            </div>
                                            
                                            {calc[plato.id]?.total > 0 && (
                                                <div className="mt-3 bg-indigo-900/40 p-2.5 rounded-lg border border-indigo-800/50">
                                                    <p className="text-[10px] text-indigo-300 font-bold flex items-center justify-between">
                                                        <span>Por ración:</span>
                                                        <span className="text-white font-black text-sm">{(calc[plato.id].total / (calc[plato.id].estudiantes || 1)).toFixed(5)}</span>
                                                    </p>
                                                </div>
                                            )}
                                        </div>
                                    </div>
                                </div>
                            ))}
                            {platos.length === 0 && (
                                <div className="text-center p-8 bg-white rounded-3xl border border-dashed border-slate-200">
                                    <p className="text-3xl mb-2 opacity-50">🍽️</p>
                                    <p className="text-xs font-bold text-slate-500 uppercase tracking-widest">Sin Menús</p>
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
            header={<h2 className="font-black text-xl text-gray-800 leading-tight uppercase tracking-tighter">Gestión de Menús e Ingredientes Globales</h2>}
        >
            <Head title="Platos y Menús" />

            <div className="py-12 max-w-7xl mx-auto sm:px-6 lg:px-8 space-y-6">
                
                {/* FORMULARIO: REGISTRAR PLATO */}
                <div className="p-6 bg-white shadow-xl rounded-xl border-t-8 border-indigo-600">
                    <h3 className="font-black text-gray-700 mb-4 uppercase text-sm italic underline">1. Crear Nuevo Plato / Menú</h3>
                    <form onSubmit={submitPlato} className="grid grid-cols-1 md:grid-cols-3 gap-4 items-end">
                        <div>
                            <label className="block text-[10px] font-black text-gray-400 uppercase">Nombre del Menú</label>
                            <input type="text" value={data.nombre} onChange={e => setData('nombre', e.target.value)} placeholder="Ej: Arroz con Habichuela" className="w-full border-gray-200 rounded-lg text-sm font-bold shadow-sm" required />
                        </div>
                        <div>
                            <label className="block text-[10px] font-black text-gray-400 uppercase">Precio x Ración ($)</label>
                            <input type="number" step="0.01" value={data.precio_base} onChange={e => setData('precio_base', e.target.value)} placeholder="0.00" className="w-full border-gray-200 rounded-lg text-sm font-bold shadow-sm" required />
                        </div>
                        <button disabled={processing} className="bg-indigo-600 text-white px-6 py-2.5 rounded-lg font-black text-xs uppercase hover:bg-black transition-all shadow-lg">
                            {processing ? '...' : 'REGISTRAR PLATO'}
                        </button>
                    </form>
                </div>

                {/* LISTADO DE PLATOS */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                    {platos.map((plato) => (
                        <div key={plato.id} className="bg-white shadow-md rounded-2xl border border-gray-100 overflow-hidden flex flex-col">
                            
                            {/* CABECERA DEL PLATO */}
                            <div className="p-4 bg-indigo-50 border-b border-indigo-100 flex justify-between items-center">
                                <div>
                                    <span className="font-black text-indigo-900 uppercase text-lg leading-none block">{plato.nombre}</span>
                                    <span className="text-green-600 font-bold text-xs">Precio: ${plato.precio_base}</span>
                                </div>
                                <button 
    onClick={() => router.get(route('reporte.despacho'), { 
        plato_id: plato.id, 
        estudiantes: proyeccion[plato.id] 
    })}
    disabled={!proyeccion[plato.id]}
    className="ml-2 bg-black text-white p-1 px-2 rounded text-[10px] uppercase font-bold disabled:opacity-30"
>
    PDF
</button>
                                <div className="bg-white p-2 rounded-lg border border-indigo-200 shadow-sm text-center">
                                    <p className="text-[8px] font-black text-indigo-400 uppercase">Proyectar para:</p>
                                    <input 
                                        type="number" 
                                        placeholder="Niños" 
                                        className="w-16 h-6 text-[11px] border-none focus:ring-0 font-black text-indigo-700 p-0 text-center"
                                        value={proyeccion[plato.id] || ''}
                                        onChange={(e) => handleProyeccionChange(plato.id, e.target.value)}
                                    />
                                </div>
                            </div>
                            
                            <div className="p-5 flex-1">
                                <h4 className="text-[10px] font-black text-gray-400 mb-3 uppercase tracking-widest border-b pb-1">Receta / Insumos Totales</h4>
                                
                                <ul className="space-y-2 mb-6">
                                    {plato.recetas?.map(receta => {
                                        const totalProyectado = proyeccion[plato.id] > 0 
                                            ? (receta.cantidad_por_racion * proyeccion[plato.id]).toFixed(2)
                                            : null;

                                        return (
                                            <li key={receta.id} className="flex justify-between items-center bg-gray-50 p-2 rounded-lg border border-dashed border-gray-200">
                                                <div>
                                                    <span className="text-xs font-bold text-gray-800 uppercase block">{receta.insumo?.nombre}</span>
                                                    <span className="text-[9px] text-gray-400 font-mono italic">Base: {receta.cantidad_por_racion} x ración</span>
                                                </div>
                                                <div className="text-right">
                                                    {totalProyectado ? (
                                                        <div className="flex flex-col">
                                                            <span className="text-[14px] font-black text-indigo-600">{totalProyectado}</span>
                                                            <span className="text-[9px] font-bold text-gray-400 uppercase">{receta.insumo?.unidad_medida} TOTALES</span>
                                                        </div>
                                                    ) : (
                                                        <span className="font-black text-xs text-gray-600">{receta.cantidad_por_racion} {receta.insumo?.unidad_medida}</span>
                                                    )}
                                                </div>
                                            </li>
                                        );
                                    })}
                                </ul>

                                {/* HERRAMIENTA: CALCULADORA DE DESPACHO GLOBAL */}
                                <div className="mt-auto p-4 bg-slate-900 rounded-xl text-white shadow-inner">
                                    <p className="text-[10px] font-black text-indigo-400 mb-3 uppercase text-center tracking-widest">Calculadora de Registro Global</p>
                                    
                                    <div className="grid grid-cols-2 gap-3 mb-4">
                                        <div className="space-y-1">
                                            <label className="text-[8px] uppercase font-black text-gray-500">Cantidad Total Receta</label>
                                            <input 
                                                type="number" 
                                                placeholder="Ej: 50 Lbs"
                                                className="w-full bg-slate-800 border-none rounded-md text-xs text-white placeholder-slate-600"
                                                value={calc[plato.id]?.total || ''}
                                                onChange={(e) => handleCalcChange(plato.id, 'total', e.target.value)}
                                            />
                                        </div>
                                        <div className="space-y-1">
                                            <label className="text-[8px] uppercase font-black text-gray-500">Para # de Niños</label>
                                            <input 
                                                type="number" 
                                                placeholder="Ej: 100 Niños"
                                                className="w-full bg-slate-800 border-none rounded-md text-xs text-white placeholder-slate-600"
                                                value={calc[plato.id]?.estudiantes || ''}
                                                onChange={(e) => handleCalcChange(plato.id, 'estudiantes', e.target.value)}
                                            />
                                        </div>
                                    </div>

                                    <div className="flex gap-2">
                                        <select id={`insumo-${plato.id}`} className="flex-1 bg-white text-black text-xs font-black rounded-md p-2 border-none">
                                            <option value="">-- Seleccionar Insumo --</option>
                                            {insumos.map(i => <option key={i.id} value={i.id}>{i.nombre} ({i.unidad_medida})</option>)}
                                        </select>
                                        
                                        {/* Input Manual: Solo se usa si la calculadora está vacía */}
                                        {!(calc[plato.id]?.total > 0) && (
                                            <input id={`cant-manual-${plato.id}`} type="number" placeholder="Cant." className="w-20 bg-white text-black text-xs font-bold rounded-md p-2 border-none" />
                                        )}

                                        <button 
                                            onClick={() => agregarIngrediente(plato.id)}
                                            className="bg-indigo-500 hover:bg-indigo-400 text-white px-4 rounded-md font-black text-[10px] uppercase transition shadow-lg"
                                        >
                                            VINCULAR
                                        </button>
                                    </div>

                                    {calc[plato.id]?.total > 0 && (
                                        <div className="mt-3 bg-indigo-900/30 p-2 rounded border border-indigo-800">
                                            <p className="text-[9px] text-indigo-200 italic font-bold">
                                                💡 Resultado: {(calc[plato.id].total / (calc[plato.id].estudiantes || 1)).toFixed(5)} por ración individual.
                                            </p>
                                        </div>
                                    )}
                                </div>
                            </div>
                        </div>
                    ))}
                </div>
            </div>
        </AuthenticatedLayout>
    );
}