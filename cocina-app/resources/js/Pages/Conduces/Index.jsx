import React, { useState } from "react";
import AuthenticatedLayout from "@/Layouts/AuthenticatedLayout";
import { Head, useForm, Link, router } from "@inertiajs/react";

export default function Index({ auth, conduces, escuelas, platos, rutas }) {
    const [editando, setEditando] = useState(false);
    const [idEdicion, setIdEdicion] = useState(null);

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
        const plato = platos.find((p) => p.id == selectedId);
        formIndividual.setData((prev) => ({
            ...prev,
            plato_id: selectedId,
            precio_racion: plato ? plato.precio_base : "",
        }));
    };

    const submitIndividual = (e) => {
        e.preventDefault();
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
