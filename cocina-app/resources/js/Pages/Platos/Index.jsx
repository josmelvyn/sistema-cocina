import React, { useState } from 'react';
import AuthenticatedLayout from '@/Layouts/AuthenticatedLayout';
import { Head, useForm, router } from '@inertiajs/react';

export default function Index({ auth, platos, insumos }) {
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