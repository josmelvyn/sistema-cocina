import React, { useState } from "react";
import { Head, router, usePage } from "@inertiajs/react"; // Añadido usePage
import AuthenticatedLayout from "@/Layouts/AuthenticatedLayout";

export default function ReportesIndex({ auth, escuelas, facturas, secuencia }) {
    // Extraemos las alertas (flash) que envía Laravel
  const { flash } = usePage().props;

// ...

{/* Cambia el bloque de la alerta por este que es a prueba de errores */}
{flash?.error && (
    <div className="bg-red-600 text-white p-4 rounded-xl shadow-lg flex items-center gap-3 animate-pulse">
        <span className="text-xl">⚠️</span>
        <span className="font-bold uppercase text-xs">{flash.error}</span>
    </div>
)}

    const [data, setData] = useState({
        escuela_id: "",
        desde: "",
        hasta: "",
    });

    // Cálculos para el panel de aviso NCF
    const disponibles = secuencia ? (secuencia.numero_final - secuencia.proximo_numero + 1) : 0;
    const proximoNcf = secuencia ? `${secuencia.prefijo}${String(secuencia.proximo_numero).padStart(8, '0')}` : '---';

    const imprimirFacturaGlobal = () => {
        if (!data.desde || !data.hasta) {
            alert("⚠️ Por favor, selecciona el rango de fechas arriba (Desde / Hasta)");
            return;
        }

        if (confirm("¿Desea generar una nueva factura oficial para el INABIE? Esto consumirá un NCF.")) {
            const url = route("reportes.facturaGlobalImprimir", {
                desde: data.desde,
                hasta: data.hasta,
            });
            window.open(url, "_blank");
            // Recargar para actualizar el historial y el contador NCF
            router.reload({ only: ['facturas', 'secuencia'] });
        }
    };

    const generarRelacionCentro = (e) => {
        e.preventDefault();
        if (!data.escuela_id || !data.desde || !data.hasta) {
            alert("⚠️ Por favor complete todos los campos (Escuela y Fechas)");
            return;
        }
        router.get(route("conduces.relacionCentro", data.escuela_id), {
            desde: data.desde,
            hasta: data.hasta,
        });
    };

    return (
        <AuthenticatedLayout user={auth.user}>
            <Head title="Menú de Reportes" />

            <div className="py-12">
                <div className="max-w-5xl mx-auto sm:px-6 lg:px-8 space-y-8">
                    
                    {/* ALERTAS DE ERROR / ÉXITO */}
                    {flash.error && (
                        <div className="bg-red-600 text-white p-4 rounded-xl shadow-lg flex items-center gap-3 animate-pulse">
                            <span className="text-xl">⚠️</span>
                            <span className="font-bold uppercase text-xs">{flash.error}</span>
                        </div>
                    )}

                    {/* PANEL DE AVISO NCF (NUEVO) */}
                    <div className="bg-slate-900 rounded-[2rem] p-8 shadow-2xl border border-slate-800 relative overflow-hidden">
                        <div className="absolute top-0 right-0 p-8 opacity-10 text-6xl italic font-black text-white">B15</div>
                        <div className="relative z-10 flex flex-col md:flex-row justify-between items-center gap-6">
                            <div>
                                <h3 className="text-blue-400 text-[10px] font-bold uppercase tracking-[0.3em] mb-2">Monitor de Comprobantes Gubernamentales</h3>
                                <p className="text-3xl font-mono text-white font-black tracking-tighter">
                                    {proximoNcf}
                                </p>
                                <p className="text-[10px] text-slate-400 mt-2 font-bold uppercase">Próximo número disponible</p>
                            </div>
                            <div className="bg-slate-800 p-6 rounded-3xl border border-slate-700 text-center min-w-[150px]">
                                <p className="text-[10px] font-bold text-slate-500 uppercase mb-1">Disponibles</p>
                                <p className={`text-4xl font-black ${disponibles < 5 ? 'text-red-500 animate-bounce' : 'text-green-400'}`}>
                                    {disponibles}
                                </p>
                            </div>
                        </div>
                        {/* Barra de progreso visual */}
                        <div className="w-full bg-slate-800 h-1 mt-6 rounded-full overflow-hidden">
                            <div 
                                className={`h-full transition-all duration-1000 ${disponibles < 5 ? 'bg-red-500' : 'bg-blue-500'}`}
                                style={{ width: `${(secuencia?.proximo_numero / secuencia?.numero_final) * 100}%` }}
                            ></div>
                        </div>
                    </div>

                    {/* PANEL DE CONTROL PRINCIPAL */}
                    <div className="bg-white overflow-hidden shadow-sm sm:rounded-lg p-8">
                        <h2 className="text-2xl font-bold mb-6 text-gray-800 border-b pb-4 flex items-center gap-2">
                            📦 Panel de Reportes y Facturación
                        </h2>

                        <div className="bg-blue-50 p-6 rounded-xl mb-8 border border-blue-100">
                            <h3 className="text-blue-800 font-bold mb-4 uppercase text-[10px] tracking-widest">Paso 1: Definir Periodo</h3>
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                <div>
                                    <label className="block text-sm font-medium text-gray-700 italic">Fecha Inicial (Desde):</label>
                                    <input
                                        type="date"
                                        className="w-full mt-1 border-gray-300 rounded-md shadow-sm focus:ring-blue-500"
                                        value={data.desde}
                                        onChange={(e) => setData({ ...data, desde: e.target.value })}
                                    />
                                </div>
                                <div>
                                    <label className="block text-sm font-medium text-gray-700 italic">Fecha Final (Hasta):</label>
                                    <input
                                        type="date"
                                        className="w-full mt-1 border-gray-300 rounded-md shadow-sm focus:ring-blue-500"
                                        value={data.hasta}
                                        onChange={(e) => setData({ ...data, hasta: e.target.value })}
                                    />
                                </div>
                            </div>
                        </div>

                        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                            <div className="border rounded-xl p-6 bg-white shadow-sm border-gray-200">
                                <h3 className="font-bold text-lg text-slate-700 mb-4">📄 Relación por Centro</h3>
                                <form onSubmit={generarRelacionCentro} className="space-y-4">
                                    <div>
                                        <select
                                            className="w-full border-gray-300 rounded-md"
                                            value={data.escuela_id}
                                            onChange={(e) => setData({ ...data, escuela_id: e.target.value })}
                                        >
                                            <option value="">-- Seleccione Escuela --</option>
                                            {escuelas.map((esc) => (
                                                <option key={esc.id} value={esc.id}>{esc.nombre}</option>
                                            ))}
                                        </select>
                                    </div>
                                    <button type="submit" className="w-full bg-blue-600 hover:bg-blue-700 text-white font-bold py-3 rounded-lg transition">
                                        Ver Relación de Conduces
                                    </button>
                                </form>
                            </div>

                            <div className="border rounded-xl p-6 bg-slate-50 border-gray-200">
                                <h3 className="font-bold text-lg text-green-700 mb-4">💰 Factura INABIE</h3>
                                <p className="text-xs text-gray-600 mb-6 font-semibold">Genera factura global gubernamental para el periodo seleccionado.</p>
                                <button
                                    onClick={imprimirFacturaGlobal}
                                    className="w-full bg-green-600 hover:bg-green-700 text-white font-bold py-3 rounded-lg shadow-md flex items-center justify-center gap-2 transition"
                                >
                                    <span>🏛️</span> Generar Factura Gubernamental
                                </button>
                            </div>
                        </div>
                    </div>

                    {/* HISTORIAL DE FACTURAS */}
                    <div className="bg-white shadow-sm sm:rounded-lg p-8">
                        <h3 className="text-lg font-bold mb-5 text-slate-800 flex items-center gap-2 border-b pb-4">
                            🕒 Historial de Facturas (INABIE)
                        </h3>
                        <div className="overflow-x-auto">
                            <table className="w-full text-left text-[11px] uppercase">
                                <thead>
                                    <tr className="bg-slate-50 text-slate-500 border-b border-slate-200">
                                        <th className="p-3">NCF B15</th>
                                        <th className="p-3">Periodo Facturado</th>
                                        <th className="p-3 text-right">Monto Total</th>
                                        <th className="p-3 text-center">Acción</th>
                                    </tr>
                                </thead>
                                <tbody className="divide-y divide-slate-100">
                                    {facturas && facturas.length > 0 ? facturas.map((f) => (
                                        <tr key={f.id} className="hover:bg-blue-50/50">
                                            <td className="p-3 font-mono font-bold text-blue-700">{f.ncf}</td>
                                            <td className="p-3 text-slate-500 italic">{f.periodo}</td>
                                            <td className="p-3 text-right font-bold">
                                                RD$ {Number(f.monto_total).toLocaleString(undefined, {minimumFractionDigits: 2})}
                                            </td>
                                            <td className="p-3 text-center">
                                                <button 
                                                    onClick={() => window.open(route('facturas.reimprimir', f.id), '_blank')}
                                                    className="bg-slate-800 text-white px-4 py-1.5 rounded shadow hover:bg-black transition text-[10px]"
                                                >
                                                    🖨️ Reimprimir
                                                </button>
                                            </td>
                                        </tr>
                                    )) : (
                                        <tr>
                                            <td colSpan="4" className="p-6 text-center text-gray-400 italic font-bold">
                                                No hay facturas emitidas recientemente.
                                            </td>
                                        </tr>
                                    )}
                                </tbody>
                            </table>
                        </div>
                    </div>
                </div>
            </div>
        </AuthenticatedLayout>
    );
}