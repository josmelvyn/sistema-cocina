import React, { useState } from 'react';
import AuthenticatedLayout from '@/Layouts/AuthenticatedLayout';
import { Head, useForm, Link, router } from '@inertiajs/react';

export default function Index({ auth, conduces, escuelas, platos, rutas }) {
    const [editando, setEditando] = useState(false);
    const [idEdicion, setIdEdicion] = useState(null);

    // 1. Formulario Manual (Registro Individual)
    const formIndividual = useForm({
        escuela_id: '',
        plato_id: '',
        fecha_despacho: new Date().toISOString().split('T')[0],
        cantidad_entregada: '',
        precio_racion: '', 
    });

    // 2. Formulario de Autoconduce (Masivo por Ruta)
    const formMasivo = useForm({
        ruta_id: '',
        plato_id: '',
        fecha: new Date().toISOString().split('T')[0],
    });

    const handlePlatoChange = (e) => {
        const selectedId = e.target.value;
        const plato = platos.find(p => p.id == selectedId);
        formIndividual.setData(prev => ({
            ...prev,
            plato_id: selectedId,
            precio_racion: plato ? plato.precio_base : ''
        }));
    };

    const submitIndividual = (e) => {
        e.preventDefault();
        if (editando) {
            formIndividual.patch(route('conduces.update', idEdicion), {
                onSuccess: () => { setEditando(false); formIndividual.reset(); }
            });
        } else {
            formIndividual.post(route('conduces.store'), { onSuccess: () => formIndividual.reset() });
        }
    };

   const submitMasivo = (e) => {
    e.preventDefault();
    
    // Validación básica antes de enviar
    if(!formMasivo.data.ruta_id || !formMasivo.data.plato_id) {
        alert("Por favor selecciona una Ruta y un Menú.");
        return;
    }

    if(confirm("¿Generar conduces para TODAS las escuelas de esta ruta?")) {
        // IMPORTANTE: Usamos formMasivo.post
        formMasivo.post(route('conduces.masivo'), {
            onSuccess: () => {
                alert("¡Proceso completado! Se generaron los conduces.");
                formMasivo.reset();
            },
            onError: (errors) => {
                console.error(errors);
                alert("Hubo un error al procesar el despacho masivo.");
            }
        });
    }
};

    const handleAnular = (id) => {
        const motivo = prompt("Motivo de anulación:");
        if (motivo && motivo.length >= 5) router.patch(`/anular-conduce/${id}`, { motivo });
    };

    return (
        <AuthenticatedLayout
            user={auth.user}
            header={
                <div className="flex justify-between items-end">
                    <div>
                        <p className="text-[10px] font-bold text-slate-400 uppercase tracking-[0.2em]">Logística Diaria</p>
                        <h2 className="font-bold text-2xl text-slate-800 italic text-blue-600">Despacho de Raciones</h2>
                    </div>
                </div>
            }
        >
            <Head title="Conduces" />

            <div className="py-8 bg-slate-50 min-h-screen">
                <div className="max-w-7xl mx-auto sm:px-6 lg:px-8 space-y-8">
                    
                    {/* PANEL DE AUTOCONDUCE (DISEÑO OSCURO DESCANSA-VISTA) */}
                    <div className="bg-slate-900 rounded-[2.5rem] p-8 shadow-2xl border border-slate-800 relative overflow-hidden">
                        <div className="absolute top-0 right-0 p-8 opacity-10 text-6xl italic font-black text-white">AUTO</div>
                        <h3 className="text-blue-400 text-xs font-bold uppercase tracking-widest mb-6 flex items-center gap-2">
                            <span className="w-2 h-2 bg-blue-500 rounded-full animate-pulse"></span>
                            ⚡ Autoconduce Inteligente (Por Ruta)
                        </h3>
                        <form onSubmit={submitMasivo} className="grid grid-cols-1 md:grid-cols-4 gap-6 items-end relative z-10">
                            <div>
                                <label className="text-[10px] uppercase font-bold text-slate-500 mb-2 block">Ruta de Entrega</label>
                                <select value={formMasivo.data.ruta_id} onChange={e => formMasivo.setData('ruta_id', e.target.value)} className="w-full bg-slate-800 border-none rounded-2xl text-white text-sm focus:ring-blue-500 h-11" required>
                                    <option value="">Seleccionar Ruta</option>
                                    {rutas?.map(r => <option key={r.id} value={r.id}>{r.nombre}</option>)}
                                </select>
                            </div>
                            <div>
                                <label className="text-[10px] uppercase font-bold text-slate-500 mb-2 block">Menú del Día</label>
                                <select value={formMasivo.data.plato_id} onChange={e => formMasivo.setData('plato_id', e.target.value)} className="w-full bg-slate-800 border-none rounded-2xl text-white text-sm focus:ring-blue-500 h-11" required>
                                    <option value="">Seleccionar Menú</option>
                                    {platos?.map(p => <option key={p.id} value={p.id}>{p.nombre}</option>)}
                                </select>
                            </div>
                            <div>
                                <label className="text-[10px] uppercase font-bold text-slate-500 mb-2 block">Fecha de Despacho</label>
                                <input type="date" value={formMasivo.data.fecha} onChange={e => formMasivo.setData('fecha', e.target.value)} className="w-full bg-slate-800 border-none rounded-2xl text-white text-sm focus:ring-blue-500 h-11" />
                            </div>
                            <button disabled={formMasivo.processing} className="bg-blue-600 hover:bg-blue-500 text-white font-black py-3 rounded-2xl transition shadow-lg shadow-blue-900/50 uppercase text-[10px] tracking-widest h-11">
                                {formMasivo.processing ? 'Procesando...' : 'Iniciar Despacho Masivo'}
                            </button>
                        </form>
                    </div>

                    {/* REGISTRO MANUAL */}
                    <div className="bg-white rounded-[2rem] p-8 shadow-sm border border-slate-100">
                        <h3 className="text-slate-400 text-[10px] font-bold uppercase tracking-widest mb-6 flex items-center gap-2">
                            <span className="w-2 h-2 bg-slate-300 rounded-full"></span>
                            {editando ? 'Modificar Registro' : 'Registro Manual Individual'}
                        </h3>
                        <form onSubmit={submitIndividual} className="grid grid-cols-1 md:grid-cols-5 gap-4 items-end">
                            <div className="md:col-span-1">
                                <select value={formIndividual.data.escuela_id} onChange={e => formIndividual.setData('escuela_id', e.target.value)} className="w-full border-slate-100 bg-slate-50 rounded-xl text-sm h-11">
                                    <option value="">Escuela</option>
                                    {escuelas.map(esc => <option key={esc.id} value={esc.id}>{esc.nombre}</option>)}
                                </select>
                            </div>
                            <div className="md:col-span-1">
                                <select value={formIndividual.data.plato_id} onChange={handlePlatoChange} className="w-full border-slate-100 bg-slate-50 rounded-xl text-sm h-11">
                                    <option value="">Plato</option>
                                    {platos.map(p => <option key={p.id} value={p.id}>{p.nombre}</option>)}
                                </select>
                            </div>
                            <div>
                                <input type="number" placeholder="Cantidad" value={formIndividual.data.cantidad_entregada} onChange={e => formIndividual.setData('cantidad_entregada', e.target.value)} className="w-full border-slate-100 bg-slate-50 rounded-xl text-sm h-11" />
                            </div>
                            <div>
                                <input type="number" step="0.01" placeholder="Precio" value={formIndividual.data.precio_racion} onChange={e => formIndividual.setData('precio_racion', e.target.value)} className="w-full border-slate-100 bg-slate-50 rounded-xl text-sm font-bold text-blue-600 h-11" />
                            </div>
                            <button className={`w-full py-3 rounded-xl font-black text-[10px] uppercase tracking-widest transition shadow-sm ${editando ? 'bg-orange-500 text-white' : 'bg-slate-800 text-white hover:bg-slate-700'}`}>
                                {editando ? 'Actualizar' : 'Guardar'}
                            </button>
                        </form>
                    </div>

                    {/* TABLA DE ACTIVIDAD */}
                    <div className="bg-white rounded-[2.5rem] shadow-sm border border-slate-100 overflow-hidden">
                        <table className="w-full text-sm">
                            <thead>
                                <tr className="bg-slate-50/50">
                                    <th className="px-8 py-5 text-left text-[10px] text-slate-400 font-bold uppercase tracking-wider">Referencia</th>
                                    <th className="px-8 py-5 text-left text-[10px] text-slate-400 font-bold uppercase tracking-wider">Escuela / Menú</th>
                                    <th className="px-8 py-5 text-center text-[10px] text-slate-400 font-bold uppercase tracking-wider">Raciones</th>
                                    <th className="px-8 py-5 text-right text-[10px] text-slate-400 font-bold uppercase tracking-wider">Acciones</th>
                                </tr>
                            </thead>
                            <tbody className="divide-y divide-slate-50 text-slate-600">
                                {conduces.map((c) => (
                                    <tr key={c.id} className={`group hover:bg-slate-50/50 transition ${c.estado === 'anulado' ? 'opacity-30 italic' : ''}`}>
                                        <td className="px-8 py-5 font-mono text-xs font-bold text-slate-400">{c.numero_conduce}</td>
                                        <td className="px-8 py-5">
                                            <p className="font-bold text-slate-800">{c.escuela?.nombre}</p>
                                            <p className="text-[10px] text-blue-500 font-bold uppercase tracking-tighter">🍲 {c.plato?.nombre}</p>
                                        </td>
                                        <td className="px-8 py-5 text-center font-black text-slate-700 text-lg">{c.cantidad_entregada}</td>
                                        <td className="px-8 py-5 text-right space-x-2">
                                            <a href={route('conduces.imprimir', c.id)} target="_blank" className="p-2 text-slate-400 hover:text-blue-500 transition">🖨️</a>
                                            {c.estado === 'pendiente' && (
                                                <>
                                                    <button onClick={() => { setEditando(true); setIdEdicion(c.id); formIndividual.setData(c); }} className="p-2 text-slate-400 hover:text-orange-500 transition">✏️</button>
                                                    <button onClick={() => handleAnular(c.id)} className="p-2 text-slate-400 hover:text-red-500 transition">🚫</button>
                                                    <Link method="patch" href={route('conduces.pagar', c.id)} as="button" className="text-[10px] font-black bg-emerald-50 text-emerald-600 px-3 py-1 rounded-lg border border-emerald-100 uppercase">Cobrar</Link>
                                                </>
                                            )}
                                            {c.estado === 'anulado' && <span className="text-[10px] font-bold text-red-400 uppercase tracking-tighter">Anulado</span>}
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                </div>
            </div>
        </AuthenticatedLayout>
    );
}