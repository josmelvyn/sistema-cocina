import React, { useState } from "react";
import AuthenticatedLayout from "@/Layouts/AuthenticatedLayout";
import MobileLayout from "@/Layouts/MobileLayout";
import { Head, useForm, Link, router, usePage } from "@inertiajs/react";
import { db } from "@/db";
import { useLiveQuery } from "dexie-react-hooks";

export default function Index({ auth, conduces, escuelas, platos, rutas }) {
    const { isMobile } = usePage().props;
    const [editando, setEditando] = useState(false);
    const [idEdicion, setIdEdicion] = useState(null);

    // MODO OFFLINE: Leer catálogos desde la DB local si las props del servidor fallan (Offline)
    const localConduces = useLiveQuery(() => db.conduces.reverse().sortBy("id"), []) || conduces;
    const localEscuelas = useLiveQuery(() => db.escuelas.toArray(), []) || escuelas;
    const localPlatos = useLiveQuery(() => db.platos.toArray(), []) || platos;
    const isOnline = typeof navigator !== 'undefined' ? navigator.onLine : true;

    // Obtener mes y año actual para el periodo por defecto
    const fechaActual = new Date();
    const periodoDefault = fechaActual.toLocaleString("es-ES", {
        month: "long",
        year: "numeric",
    });

    // 1. Formulario Manual (Registro Individual)
    const formIndividual = useForm({
        escuela_id: "",
        plato_id: "",
        fecha_despacho: fechaActual.toISOString().split("T")[0],
        periodo_entrega: periodoDefault, // <--- NUEVO CAMPO FIX
        cantidad_entregada: "",
        precio_racion: "",
        entrega_latitud: "",
        entrega_longitud: "",
        foto_evidencia: null,
    });

    // 2. Formulario de Autoconduce (Masivo por Ruta)
    const formMasivo = useForm({
        ruta_id: "",
        plato_id: "",
        fecha: fechaActual.toISOString().split("T")[0],
        periodo_entrega: periodoDefault, // <--- NUEVO CAMPO FIX
    });

    const handlePlatoChange = (e) => {
        const selectedId = e.target.value;
        const plato = localPlatos?.find((p) => p.id == selectedId);
        formIndividual.setData((prev) => ({
            ...prev,
            plato_id: selectedId,
            precio_racion: plato ? plato.precio_base : "",
        }));
    };

    const submitIndividual = async (e) => {
        e.preventDefault();

        // LOGICA OFFLINE PWA
        if (!isOnline && isMobile && !editando) {
            const fakeId = Date.now();
            const payload = { ...formIndividual.data };

            // Añadir a cola de Sync
            await db.sync_queue.add({
                action: 'POST',
                route: route("conduces.store"),
                payload: payload,
                timestamp: fakeId,
                status: 'pending'
            });

            // Registrar temporal en Dexie local para visualización instantánea
            const escuelaObj = localEscuelas?.find(esc => esc.id == payload.escuela_id);
            const platoObj = localPlatos?.find(p => p.id == payload.plato_id);
            
            await db.conduces.add({
                id: fakeId,
                escuela_id: payload.escuela_id,
                plato_id: payload.plato_id,
                cantidad_entregada: payload.cantidad_entregada,
                estado: 'pendiente',
                numero_conduce: `LOC-${fakeId.toString().slice(-4)}`,
                escuela: escuelaObj,
                plato: platoObj,
                _offline: 1
            });

            alert("Sin conexión: El despacho se guardó en tu celular y se sincronizará automáticamente cuando vuelva el internet.");
            formIndividual.reset();
            return;
        }

        if (editando) {
            formIndividual.patch(route("conduces.update", idEdicion), {
                onSuccess: () => {
                    setEditando(false);
                    formIndividual.reset();
                },
            });
        } else {
            formIndividual.post(route("conduces.store"), {
                onSuccess: () => formIndividual.reset(),
            });
        }
    };

    const submitMasivo = (e) => {
        e.preventDefault();
        if (!formMasivo.data.ruta_id || !formMasivo.data.plato_id) {
            alert("Por favor selecciona una Ruta y un Menú.");
            return;
        }
        if (
            confirm("¿Generar conduces para TODAS las escuelas de esta ruta?")
        ) {
            formMasivo.post(route("conduces.masivo"), {
                onSuccess: () => {
                    alert("¡Proceso completado!");
                    formMasivo.reset();
                },
            });
        }
    };

    const handleAnular = (id) => {
        const motivo = prompt("Motivo de anulación:");
        if (motivo && motivo.length >= 5)
            router.patch(`/anular-conduce/${id}`, { motivo });
    };

    const [seleccionados, setSeleccionados] = useState([]);

    const toggleSeleccion = (id) => {
        setSeleccionados((prev) =>
            prev.includes(id) ? prev.filter((i) => i !== id) : [...prev, id],
        );
    };

    const enviarFacturacionMasiva = () => {
        if (
            confirm(
                `¿Generar NCF para los ${seleccionados.length} conduces seleccionados?`,
            )
        ) {
            router.post(
                route("facturas.masiva"),
                { ids: seleccionados },
                {
                    onSuccess: () => setSeleccionados([]),
                },
            );
        }
    };

    if (isMobile) {
        return (
            <MobileLayout title="Despachos" headerTitle="Despachos" headerSubtitle="Gestión Diaria">
                <div className="p-4 space-y-6">
                    {/* ACCIÓN MASIVA */}
                    {seleccionados.length > 0 && (
                        <div className="bg-indigo-600 p-4 rounded-3xl mb-4 flex justify-between items-center shadow-2xl animate-in fade-in sticky top-20 z-40">
                            <div className="flex items-center gap-3">
                                <div className="bg-white text-indigo-600 w-8 h-8 rounded-full flex items-center justify-center font-black">
                                    {seleccionados.length}
                                </div>
                                <div>
                                    <p className="text-white font-bold text-xs uppercase tracking-widest leading-tight">Seleccionados</p>
                                    <p className="text-indigo-200 text-[9px] uppercase">Listos para NCF</p>
                                </div>
                            </div>
                            <button onClick={enviarFacturacionMasiva} className="bg-white text-indigo-600 px-4 py-3 rounded-xl font-black text-[10px] uppercase shadow-sm active:scale-95 transition-transform">
                                Facturar
                            </button>
                        </div>
                    )}

                    {/* REGISTRO MANUAL */}
                    <div className="bg-white rounded-3xl p-5 shadow-sm border border-slate-100">
                        <h3 className="text-sm font-black text-slate-800 uppercase mb-4 flex items-center gap-2">
                            <span>📝</span> {editando ? "Editar Despacho" : "Nuevo Despacho"}
                        </h3>
                        <form onSubmit={submitIndividual} className="space-y-4">
                            <div>
                                <label className="text-[10px] font-bold text-slate-400 uppercase ml-1">Escuela Destino</label>
                                <select value={formIndividual.data.escuela_id} onChange={e => formIndividual.setData("escuela_id", e.target.value)} className="w-full bg-slate-50 border-slate-100 rounded-xl mt-1 h-12 text-sm text-slate-700 font-medium">
                                    <option value="">Seleccionar</option>
                                    {localEscuelas?.map(esc => <option key={esc.id} value={esc.id}>{esc.nombre}</option>)}
                                </select>
                            </div>
                            <div className="grid grid-cols-2 gap-3">
                                <div>
                                    <label className="text-[10px] font-bold text-slate-400 uppercase ml-1">Menú</label>
                                    <select value={formIndividual.data.plato_id} onChange={handlePlatoChange} className="w-full bg-slate-50 border-slate-100 rounded-xl mt-1 h-12 text-sm text-slate-700 font-medium">
                                        <option value="">Seleccionar</option>
                                        {localPlatos?.map(p => <option key={p.id} value={p.id}>{p.nombre}</option>)}
                                    </select>
                                </div>
                                <div>
                                    <label className="text-[10px] font-bold text-slate-400 uppercase ml-1">Periodo</label>
                                    <input type="text" value={formIndividual.data.periodo_entrega} onChange={e => formIndividual.setData("periodo_entrega", e.target.value)} className="w-full bg-slate-50 border-slate-100 rounded-xl mt-1 h-12 text-center text-xs uppercase font-bold text-slate-500" />
                                </div>
                            </div>
                            <div className="grid grid-cols-2 gap-3">
                                <div>
                                    <label className="text-[10px] font-bold text-slate-400 uppercase ml-1">Cantidad</label>
                                    <input type="number" value={formIndividual.data.cantidad_entregada} onChange={e => formIndividual.setData("cantidad_entregada", e.target.value)} className="w-full bg-slate-50 border-slate-100 rounded-xl mt-1 h-12 text-center text-xl font-black text-slate-700" placeholder="0" />
                                </div>
                                <div>
                                    <label className="text-[10px] font-bold text-slate-400 uppercase ml-1">Precio Unit.</label>
                                    <div className="relative">
                                        <span className="absolute left-3 top-1/2 -translate-y-1/2 font-bold text-slate-400">$</span>
                                        <input type="number" step="0.01" value={formIndividual.data.precio_racion} onChange={e => formIndividual.setData("precio_racion", e.target.value)} className="w-full bg-slate-50 border-slate-100 rounded-xl mt-1 h-12 text-center text-sm font-bold text-indigo-600 pl-8" placeholder="0.00" />
                                    </div>
                                </div>
                            </div>
                            
                            {/* EVIDENCIA GPS & FOTO (Solo Móvil) */}
                            {isMobile && (
                                <div className="space-y-4 p-4 bg-slate-50 rounded-2xl border border-dashed border-slate-200">
                                    <div className="flex justify-between items-center">
                                        <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest leading-none">Prueba de Entrega</p>
                                        {(formIndividual.data.entrega_latitud && formIndividual.data.entrega_longitud) && (
                                            <span className="text-[8px] bg-emerald-100 text-emerald-700 px-2 py-0.5 rounded-full font-black uppercase">GPS ok</span>
                                        )}
                                    </div>
                                    
                                    <div className="grid grid-cols-2 gap-3">
                                        <button 
                                            type="button"
                                            onClick={() => {
                                                if (navigator.geolocation) {
                                                    navigator.geolocation.getCurrentPosition((pos) => {
                                                        formIndividual.setData(prev => ({
                                                            ...prev,
                                                            entrega_latitud: pos.coords.latitude,
                                                            entrega_longitud: pos.coords.longitude
                                                        }));
                                                        alert("📍 Ubicación capturada con éxito");
                                                    }, (err) => alert("No se pudo obtener la ubicación. Activa el GPS."));
                                                }
                                            }}
                                            className={`h-11 rounded-xl text-[10px] font-black uppercase flex items-center justify-center gap-2 transition-all ${formIndividual.data.entrega_latitud ? 'bg-emerald-50 text-emerald-600 border border-emerald-100' : 'bg-white text-indigo-600 border border-slate-200'}`}
                                        >
                                            <span>📍</span> {formIndividual.data.entrega_latitud ? 'Ubicación OK' : 'Capturar GPS'}
                                        </button>

                                        <div className="relative">
                                            <input 
                                                type="file" 
                                                accept="image/*" 
                                                capture="camera"
                                                onChange={e => formIndividual.setData("foto_evidencia", e.target.files[0])}
                                                className="hidden" 
                                                id="foto-camera"
                                            />
                                            <label 
                                                htmlFor="foto-camera"
                                                className={`h-11 rounded-xl text-[10px] font-black uppercase flex items-center justify-center gap-2 transition-all cursor-pointer ${formIndividual.data.foto_evidencia ? 'bg-emerald-50 text-emerald-600 border border-emerald-100' : 'bg-white text-indigo-600 border border-slate-200'}`}
                                            >
                                                <span>📸</span> {formIndividual.data.foto_evidencia ? 'Foto OK' : 'Tomar Foto'}
                                            </label>
                                        </div>
                                    </div>
                                    <p className="text-[8px] text-slate-400 italic text-center">* La ubicación y foto se guardarán como prueba de que estuviste en el centro.</p>
                                </div>
                            )}

                            <button disabled={formIndividual.processing} className={`w-full h-12 mt-2 rounded-xl font-black text-[10px] uppercase tracking-widest text-white transition-all active:scale-95 ${editando ? "bg-orange-500 shadow-orange-500/30" : "bg-indigo-600 shadow-indigo-500/30"} shadow-lg`}>
                                {formIndividual.processing ? "Guardando..." : (editando ? "Actualizar Registro" : "Guardar Despacho")}
                            </button>
                            {editando && (
                                <button type="button" onClick={() => { setEditando(false); formIndividual.reset(); }} className="w-full h-10 rounded-xl font-bold text-[10px] uppercase tracking-widest text-slate-500 bg-slate-100 mt-2">
                                    Cancelar Edición
                                </button>
                            )}
                        </form>
                    </div>

                    {/* HISTORIAL */}
                    <div>
                        <h3 className="text-sm font-black text-slate-800 uppercase mb-3 ml-1">Últimos Despachos</h3>
                        <div className="space-y-3">
                            {localConduces.length > 0 ? localConduces.map(c => (
                                <div key={c.id} className={`bg-white rounded-[1.5rem] p-4 shadow-sm border ${c.estado === 'anulado' ? 'opacity-60 border-red-100' : c._offline ? 'border-orange-200 border-dashed bg-orange-50/10' : 'border-slate-100'}`}>
                                    <div className="flex justify-between items-start mb-3">
                                        <div className="flex items-center gap-3">
                                            <div className={`h-10 w-10 rounded-full flex items-center justify-center font-bold text-white shadow-inner ${c.estado === 'anulado' ? 'bg-red-400' : c._offline ? 'bg-orange-300' : c.estado === 'facturado' ? 'bg-blue-400' : 'bg-emerald-400'}`}>
                                                {c.estado === 'anulado' ? '🚫' : c._offline ? '⏳' : c.estado === 'facturado' ? '✅' : '📦'}
                                            </div>
                                            <div>
                                                <p className="font-bold text-slate-800 leading-tight text-sm">{c.escuela?.nombre}</p>
                                                <p className="text-[10px] text-indigo-500 font-bold uppercase mt-0.5">{c.plato?.nombre}</p>
                                            </div>
                                        </div>
                                    </div>
                                    
                                    <div className="bg-slate-50 rounded-xl p-3 flex justify-between items-center mb-3">
                                        <div>
                                            <p className="text-[9px] text-slate-400 uppercase font-bold tracking-widest mb-0.5">Volumen</p>
                                            <p className="text-lg font-black text-slate-700 leading-none">{c.cantidad_entregada} <span className="text-[10px] font-medium text-slate-500">uds</span></p>
                                        </div>
                                        <div className="text-right">
                                            <p className="text-[9px] text-slate-400 uppercase font-bold tracking-widest mb-0.5">Estado</p>
                                            <span className={`inline-block text-[9px] px-2.5 py-1 rounded-md font-black uppercase tracking-wider border ${c._offline ? 'bg-orange-100 text-orange-700 border-orange-200' : c.estado === 'pendiente' ? 'bg-amber-100 text-amber-700 border-amber-200' : c.estado === 'anulado' ? 'bg-red-100 text-red-700 border-red-200' : 'bg-emerald-100 text-emerald-700 border-emerald-200'}`}>
                                                {c._offline ? 'Pendiente Red' : c.estado}
                                            </span>
                                        </div>
                                    </div>
                                    
                                    <div className="flex items-center justify-between">
                                        <div className="flex items-center gap-2 pl-1">
                                            {c.estado === 'pendiente' && (
                                                <input
                                                    type="checkbox"
                                                    className="rounded-lg border-slate-300 w-5 h-5 text-indigo-600 focus:ring-indigo-500"
                                                    checked={seleccionados.includes(c.id)}
                                                    onChange={() => toggleSeleccion(c.id)}
                                                />
                                            )}
                                            <span className="text-[10px] text-slate-400 font-mono tracking-wider">REF: {c.numero_conduce}</span>
                                        </div>
                                        
                                        <div className="flex gap-1.5">
                                            <a href={route("conduces.imprimir", c.id)} target="_blank" className="w-8 h-8 rounded-full bg-slate-100 flex items-center justify-center text-slate-600 active:scale-95 transition-transform text-xs border border-slate-200 shadow-sm">🖨️</a>
                                            {c.estado === 'pendiente' && (
                                                <>
                                                    <button onClick={() => { setEditando(true); setIdEdicion(c.id); formIndividual.setData(c); window.scrollTo({top:0, behavior:'smooth'}); }} className="w-8 h-8 rounded-full bg-orange-50 flex items-center justify-center text-orange-500 active:scale-95 transition-transform text-xs border border-orange-100 shadow-sm">📝</button>
                                                    <button onClick={() => handleAnular(c.id)} className="w-8 h-8 rounded-full bg-red-50 flex items-center justify-center text-red-500 active:scale-95 transition-transform text-xs border border-red-100 shadow-sm">🚫</button>
                                                </>
                                            )}
                                        </div>
                                    </div>
                                </div>
                            )) : (
                                <div className="text-center p-8 bg-white rounded-3xl border border-dashed border-slate-200">
                                    <p className="text-3xl mb-2 opacity-50">📂</p>
                                    <p className="text-xs font-bold text-slate-500 uppercase tracking-widest">No hay historial</p>
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
            header={
                <div className="flex justify-between items-end">
                    <div>
                        <p className="text-[10px] font-bold text-slate-400 uppercase tracking-[0.2em]">
                            Logística Diaria
                        </p>
                        <h2 className="font-bold text-2xl text-slate-800 italic text-blue-600 tracking-tighter">
                            Despacho de Raciones
                        </h2>
                    </div>
                </div>
            }
        >
            <Head title="Conduces" />
            {/* BOTÓN FLOTANTE DE ACCIÓN MASIVA */}
            {seleccionados.length > 0 && (
                <div className="bg-blue-600 p-4 rounded-2xl mb-6 flex justify-between items-center shadow-2xl border border-blue-400 sticky top-4 z-50 animate-in fade-in slide-in-from-top-4 duration-300">
                    <div className="flex items-center gap-4 px-2">
                        <div className="bg-white text-blue-600 w-8 h-8 rounded-full flex items-center justify-center font-black text-sm shadow-inner">
                            {seleccionados.length}
                        </div>
                        <div>
                            <p className="text-white font-black uppercase text-[10px] tracking-widest leading-none">
                                Conduces Seleccionados
                            </p>
                            <p className="text-blue-100 text-[9px] uppercase mt-0.5">
                                Listo para generar comprobantes fiscales
                            </p>
                        </div>
                    </div>

                    <button
                        onClick={enviarFacturacionMasiva}
                        className="bg-white text-blue-600 hover:bg-slate-50 px-8 py-3 rounded-xl font-black uppercase text-[10px] tracking-[0.1em] transition shadow-lg active:scale-95"
                    >
                        ⚡ Generar NCF Masivo
                    </button>
                </div>
            )}
            <div className="py-8 bg-slate-50 min-h-screen">
                <div className="max-w-7xl mx-auto sm:px-6 lg:px-8 space-y-8">
                    {/* PANEL DE AUTOCONDUCE */}
                    <div className="bg-slate-900 rounded-[2.5rem] p-8 shadow-2xl border border-slate-800 relative overflow-hidden">
                        <div className="absolute top-0 right-0 p-8 opacity-10 text-6xl italic font-black text-white">
                            AUTO
                        </div>
                        <h3 className="text-blue-400 text-xs font-bold uppercase tracking-widest mb-6 flex items-center gap-2">
                            <span className="w-2 h-2 bg-blue-500 rounded-full animate-pulse"></span>
                            ⚡ Autoconduce Inteligente (Por Ruta)
                        </h3>
                        <form
                            onSubmit={submitMasivo}
                            className="grid grid-cols-1 md:grid-cols-5 gap-4 items-end relative z-10"
                        >
                            <div>
                                <label className="text-[10px] uppercase font-bold text-slate-500 mb-2 block tracking-widest text-center">
                                    Ruta
                                </label>
                                <select
                                    value={formMasivo.data.ruta_id}
                                    onChange={(e) =>
                                        formMasivo.setData(
                                            "ruta_id",
                                            e.target.value,
                                        )
                                    }
                                    className="w-full bg-slate-800 border-none rounded-2xl text-white text-sm h-11"
                                >
                                    <option value="">Seleccionar Ruta</option>
                                    {rutas?.map((r) => (
                                        <option key={r.id} value={r.id}>
                                            {r.nombre}
                                        </option>
                                    ))}
                                </select>
                            </div>
                            <div>
                                <label className="text-[10px] uppercase font-bold text-slate-500 mb-2 block tracking-widest text-center">
                                    Menú
                                </label>
                                <select
                                    value={formMasivo.data.plato_id}
                                    onChange={(e) =>
                                        formMasivo.setData(
                                            "plato_id",
                                            e.target.value,
                                        )
                                    }
                                    className="w-full bg-slate-800 border-none rounded-2xl text-white text-sm h-11"
                                >
                                    <option value="">Seleccionar Menú</option>
                                    {platos?.map((p) => (
                                        <option key={p.id} value={p.id}>
                                            {p.nombre}
                                        </option>
                                    ))}
                                </select>
                            </div>
                            <div>
                                <label className="text-[10px] uppercase font-bold text-slate-500 mb-2 block tracking-widest text-center">
                                    Periodo
                                </label>
                                <input
                                    type="text"
                                    value={formMasivo.data.periodo_entrega}
                                    onChange={(e) =>
                                        formMasivo.setData(
                                            "periodo_entrega",
                                            e.target.value,
                                        )
                                    }
                                    className="w-full bg-slate-800 border-none rounded-2xl text-white text-sm h-11 uppercase font-bold"
                                />
                            </div>
                            <div>
                                <label className="text-[10px] uppercase font-bold text-slate-500 mb-2 block tracking-widest text-center">
                                    Fecha
                                </label>
                                <input
                                    type="date"
                                    value={formMasivo.data.fecha}
                                    onChange={(e) =>
                                        formMasivo.setData(
                                            "fecha",
                                            e.target.value,
                                        )
                                    }
                                    className="w-full bg-slate-800 border-none rounded-2xl text-white text-sm h-11"
                                />
                            </div>
                            {/* BOTÓN FLOTANTE DE ACCIÓN MASIVA */}
                            {seleccionados.length > 0 && (
                                <div className="bg-blue-600 p-4 rounded-2xl mb-6 flex justify-between items-center shadow-2xl border border-blue-400 sticky top-4 z-50 animate-in fade-in slide-in-from-top-4 duration-300">
                                    <div className="flex items-center gap-4 px-2">
                                        <div className="bg-white text-blue-600 w-8 h-8 rounded-full flex items-center justify-center font-black text-sm shadow-inner">
                                            {seleccionados.length}
                                        </div>
                                        <div>
                                            <p className="text-white font-black uppercase text-[10px] tracking-widest leading-none">
                                                Conduces Seleccionados
                                            </p>
                                            <p className="text-blue-100 text-[9px] uppercase mt-0.5">
                                                Listo para generar comprobantes
                                                fiscales
                                            </p>
                                        </div>
                                    </div>

                                    <button
                                        onClick={enviarFacturacionMasiva}
                                        className="bg-white text-blue-600 hover:bg-slate-50 px-8 py-3 rounded-xl font-black uppercase text-[10px] tracking-[0.1em] transition shadow-lg active:scale-95"
                                    >
                                        ⚡ Generar NCF Masivo
                                    </button>
                                </div>
                            )}
                            <button
                                disabled={formMasivo.processing}
                                className="bg-blue-600 hover:bg-blue-500 text-white font-black py-3 rounded-2xl transition uppercase text-[10px] tracking-widest h-11"
                            >
                                {formMasivo.processing
                                    ? "..."
                                    : "Despacho Masivo"}
                            </button>
                        </form>
                    </div>
                    {/* REGISTRO MANUAL */}
                    <div className="bg-white rounded-[2rem] p-8 shadow-sm border border-slate-100">
                        <form
                            onSubmit={submitIndividual}
                            className="grid grid-cols-1 md:grid-cols-6 gap-3 items-end"
                        >
                            <div className="md:col-span-1">
                                <label className="text-[10px] uppercase font-bold text-slate-400 mb-1 block">
                                    Escuela
                                </label>
                                <select
                                    value={formIndividual.data.escuela_id}
                                    onChange={(e) =>
                                        formIndividual.setData(
                                            "escuela_id",
                                            e.target.value,
                                        )
                                    }
                                    className="w-full border-slate-100 bg-slate-50 rounded-xl text-sm h-11"
                                >
                                    <option value="">Escuela</option>
                                    {escuelas.map((esc) => (
                                        <option key={esc.id} value={esc.id}>
                                            {esc.nombre}
                                        </option>
                                    ))}
                                </select>
                            </div>
                            <div className="md:col-span-1">
                                <label className="text-[10px] uppercase font-bold text-slate-400 mb-1 block">
                                    Menú
                                </label>
                                <select
                                    value={formIndividual.data.plato_id}
                                    onChange={handlePlatoChange}
                                    className="w-full border-slate-100 bg-slate-50 rounded-xl text-sm h-11"
                                >
                                    <option value="">Plato</option>
                                    {platos.map((p) => (
                                        <option key={p.id} value={p.id}>
                                            {p.nombre}
                                        </option>
                                    ))}
                                </select>
                            </div>
                            <div>
                                <label className="text-[10px] uppercase font-bold text-slate-400 mb-1 block text-center">
                                    Periodo
                                </label>
                                <input
                                    type="text"
                                    value={formIndividual.data.periodo_entrega}
                                    onChange={(e) =>
                                        formIndividual.setData(
                                            "periodo_entrega",
                                            e.target.value,
                                        )
                                    }
                                    className="w-full border-slate-100 bg-slate-50 rounded-xl text-sm h-11 uppercase font-bold text-center"
                                />
                            </div>
                            <div>
                                <label className="text-[10px] uppercase font-bold text-slate-400 mb-1 block text-center">
                                    Cantidad
                                </label>
                                <input
                                    type="number"
                                    value={
                                        formIndividual.data.cantidad_entregada
                                    }
                                    onChange={(e) =>
                                        formIndividual.setData(
                                            "cantidad_entregada",
                                            e.target.value,
                                        )
                                    }
                                    className="w-full border-slate-100 bg-slate-50 rounded-xl text-sm h-11 text-center"
                                />
                            </div>
                            <div>
                                <label className="text-[10px] uppercase font-bold text-slate-400 mb-1 block text-center">
                                    Precio
                                </label>
                                <input
                                    type="number"
                                    step="0.01"
                                    value={formIndividual.data.precio_racion}
                                    onChange={(e) =>
                                        formIndividual.setData(
                                            "precio_racion",
                                            e.target.value,
                                        )
                                    }
                                    className="w-full border-slate-100 bg-slate-50 rounded-xl text-sm font-bold text-blue-600 h-11 text-center"
                                />
                            </div>

                            <button
                                className={`w-full py-3 rounded-xl font-black text-[10px] uppercase tracking-widest transition h-11 ${editando ? "bg-orange-500 text-white" : "bg-slate-800 text-white"}`}
                            >
                                {editando ? "Actualizar" : "Guardar"}
                            </button>
                        </form>
                    </div>
                    {/* TABLA DE ACTIVIDAD */}
                    <div className="bg-white rounded-[2.5rem] shadow-sm border border-slate-100 overflow-hidden">
                        <table className="w-full text-sm">
                            <thead className="bg-slate-50/50 text-[10px] text-slate-400 font-bold uppercase tracking-wider">
                                <tr>
                                    <th className="px-4 py-5 text-center">
                                        <input
                                            type="checkbox"
                                            className="rounded border-slate-300 text-blue-600 focus:ring-blue-500"
                                            onChange={(e) => {
                                                if (e.target.checked)
                                                    setSeleccionados(
                                                        conduces
                                                            .filter(
                                                                (c) =>
                                                                    c.estado ===
                                                                    "pendiente",
                                                            )
                                                            .map((c) => c.id),
                                                    );
                                                else setSeleccionados([]);
                                            }}
                                            checked={
                                                seleccionados.length > 0 &&
                                                seleccionados.length ===
                                                    conduces.filter(
                                                        (c) =>
                                                            c.estado ===
                                                            "pendiente",
                                                    ).length
                                            }
                                        />
                                    </th>
                                    <th className="px-8 py-5 text-left">
                                        Referencia
                                    </th>
                                    <th className="px-6 py-5 text-left">
                                        Escuela / Menú
                                    </th>
                                    <th className="px-6 py-5 text-center">
                                        Raciones
                                    </th>
                                    <th className="px-8 py-5 text-right">
                                        Acciones
                                    </th>
                                </tr>
                            </thead>
                            <tbody className="divide-y divide-slate-50 text-slate-600">
                                {conduces.map((c) => (
                                    <tr
                                        key={c.id}
                                        className={`group hover:bg-slate-50/50 transition ${c.estado === "anulado" ? "opacity-30 italic" : ""}`}
                                    >
                                        <td className="px-4 py-5 text-center">
                                            {c.estado === "pendiente" && (
                                                <input
                                                    type="checkbox"
                                                    className="rounded border-slate-300 text-blue-600 focus:ring-blue-500"
                                                    checked={seleccionados.includes(
                                                        c.id,
                                                    )}
                                                    onChange={() =>
                                                        toggleSeleccion(c.id)
                                                    }
                                                />
                                            )}
                                        </td>
                                        <td className="px-8 py-5 font-mono text-xs font-bold text-slate-400">
                                            {c.numero_conduce}
                                        </td>
                                        <td className="px-6 py-5">
                                            <p className="font-bold text-slate-800 uppercase tracking-tighter">
                                                {c.escuela?.nombre}
                                            </p>
                                            <p className="text-[10px] text-blue-500 font-bold uppercase italic">
                                                {c.plato?.nombre}
                                            </p>
                                        </td>
                                        <td className="px-6 py-5 text-center font-black text-slate-700 text-lg">
                                            {c.cantidad_entregada}
                                        </td>
                                        <td className="px-8 py-5 text-right space-x-2 flex items-center justify-end">
                                            <a
                                                href={route(
                                                    "conduces.imprimir",
                                                    c.id,
                                                )}
                                                target="_blank"
                                                className="p-2 text-slate-400 hover:text-blue-500 font-bold text-xs uppercase transition"
                                            >
                                                🖨️
                                            </a>
                                            {c.estado === "pendiente" && (
                                                <>
                                                    <button
                                                        onClick={() => {
                                                            setEditando(true);
                                                            setIdEdicion(c.id);
                                                            formIndividual.setData(
                                                                c,
                                                            );
                                                        }}
                                                        className="p-2 text-slate-400 hover:text-orange-500 font-bold text-xs uppercase transition"
                                                    >
                                                        📝
                                                    </button>
                                                    <button
                                                        onClick={() =>
                                                            handleAnular(c.id)
                                                        }
                                                        className="p-2 text-slate-400 hover:text-red-500 font-bold text-xs uppercase transition"
                                                    >
                                                        🚫
                                                    </button>
                                                    <button
                                                        onClick={() => {
                                                            if (
                                                                confirm(
                                                                    "¿Generar factura con NCF?",
                                                                )
                                                            ) {
                                                                router.post(
                                                                    route(
                                                                        "facturas.emitir",
                                                                        c.id,
                                                                    ),
                                                                );
                                                            }
                                                        }}
                                                        className="bg-emerald-50 text-emerald-600 px-3 py-1 rounded-lg border border-emerald-100 uppercase font-black text-[9px] transition"
                                                    >
                                                        Facturar
                                                    </button>
                                                </>
                                            )}
                                            {c.estado === "facturado" && (
                                                <span className="text-[9px] font-black bg-blue-50 text-blue-500 px-3 py-1 rounded-lg uppercase italic border border-blue-100">
                                                    ✅ Facturado
                                                </span>
                                            )}
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>{" "}
                </div>
            </div>
        </AuthenticatedLayout>
    );
}
