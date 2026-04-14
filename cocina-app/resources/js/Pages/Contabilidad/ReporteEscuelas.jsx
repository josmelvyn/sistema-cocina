import React from 'react';
import AuthenticatedLayout from '@/Layouts/AuthenticatedLayout';
import { Head, useForm } from '@inertiajs/react';

export default function ReporteEscuelas({ auth, conduces, escuelas, filtros, totales }) {
    
    // 1. Filtrar conduces anulados o en 0
    const conducesActivos = conduces.filter(c => Number(c.total_monto) > 0);

    const { data, setData, get, processing } = useForm({
        desde: filtros.desde || '',
        hasta: filtros.hasta || '',
        escuela_id: filtros.escuela_id || '',
    });

    const handleFilter = (e) => {
        e.preventDefault();
        get(route('contabilidad.reporte_escuelas'));
    };

    // Helper para formato de moneda
    const formatMoney = (amount) => 
        new Intl.NumberFormat('es-DO', { style: 'currency', currency: 'DOP' }).format(amount);

    return (
        <AuthenticatedLayout
            user={auth.user}
            header={<h2 className="font-bold text-xl uppercase tracking-tight">📊 Reporte Detallado de Raciones</h2>}
        >
            <Head title="Reporte por Escuelas" />

            <div className="py-8 max-w-7xl mx-auto sm:px-6 lg:px-8 space-y-6">
                
                {/* FILTROS DE BÚSQUEDA */}
                <div className="p-6 bg-white shadow-sm rounded-xl border border-gray-200 no-print">
                    <form onSubmit={handleFilter} className="grid grid-cols-1 md:grid-cols-4 gap-4 items-end">
                        <div>
                            <label className="block text-[10px] font-black text-gray-400 uppercase mb-1">Fecha Inicio</label>
                            <input type="date" value={data.desde} onChange={e => setData('desde', e.target.value)} className="w-full border-gray-200 rounded-lg text-sm focus:ring-blue-500" />
                        </div>
                        <div>
                            <label className="block text-[10px] font-black text-gray-400 uppercase mb-1">Fecha Fin</label>
                            <input type="date" value={data.hasta} onChange={e => setData('hasta', e.target.value)} className="w-full border-gray-200 rounded-lg text-sm focus:ring-blue-500" />
                        </div>
                        <div>
                            <label className="block text-[10px] font-black text-gray-400 uppercase mb-1">Centro Educativo</label>
                            <select value={data.escuela_id} onChange={e => setData('escuela_id', e.target.value)} className="w-full border-gray-200 rounded-lg text-sm focus:ring-blue-500">
                                <option value="">🏢 Todas las escuelas</option>
                                {escuelas.map(esc => <option key={esc.id} value={esc.id}>{esc.nombre}</option>)}
                            </select>
                        </div>
                        <button 
                            disabled={processing} 
                            className="bg-blue-600 text-white font-bold py-2.5 rounded-lg shadow-md hover:bg-blue-700 transition-all uppercase text-xs disabled:opacity-50"
                        >
                            {processing ? 'Procesando...' : '🔍 Actualizar Vista'}
                        </button>
                    </form>
                </div>

                {/* RESUMEN DE TOTALES */}
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                    <div className="bg-white border-l-4 border-blue-600 p-5 rounded-xl shadow-sm">
                        <p className="text-[10px] font-bold uppercase text-gray-400">Raciones Entregadas</p>
                        <p className="text-3xl font-black text-gray-800">{(totales?.raciones || 0).toLocaleString()}</p>
                    </div>
                    <div className="bg-white border-l-4 border-green-500 p-5 rounded-xl shadow-sm">
                        <p className="text-[10px] font-bold uppercase text-gray-400">Total Bruto</p>
                        <p className="text-3xl font-black text-green-600">{formatMoney(totales?.monto || 0)}</p>
                    </div>
                    {/* Nueva métrica de valor promedio */}
                    <div className="bg-gray-50 border-l-4 border-gray-400 p-5 rounded-xl shadow-sm">
                        <p className="text-[10px] font-bold uppercase text-gray-400">Ticket Promedio / Conduce</p>
                        <p className="text-3xl font-black text-gray-600">
                            {conducesActivos.length > 0 ? formatMoney(totales?.monto / conducesActivos.length) : '$0.00'}
                        </p>
                    </div>
                </div>

                {/* TABLA DE RESULTADOS */}
                <div className="bg-white shadow-xl rounded-xl overflow-hidden border border-gray-100">
                    <div className="p-4 bg-gray-800 flex justify-between items-center text-white">
                        <div className="flex flex-col">
                            <span className="font-bold text-sm tracking-widest uppercase">Relación de Despachos</span>
                            <span className="text-[10px] text-gray-400 font-mono italic">Período: {data.desde || '...'} / {data.hasta || '...'}</span>
                        </div>
                        <button onClick={() => window.print()} className="bg-white/10 hover:bg-white/20 text-white px-4 py-2 rounded-lg text-[10px] font-black transition no-print border border-white/20">
                            🖨️ EXPORTAR A PDF / IMPRIMIR
                        </button>
                    </div>
                    
                    <div className="overflow-x-auto">
                        <table className="w-full text-sm">
                            <thead className="bg-gray-50 text-gray-500 uppercase text-[10px] font-black border-b">
                                <tr>
                                    <th className="p-4 text-left">Fecha</th>
                                    <th className="p-4 text-left">Referencia</th>
                                    <th className="p-4 text-left">Centro Educativo</th>
                                    <th className="p-4 text-left">Menú del Día</th>
                                    <th className="p-4 text-center">Cant.</th>
                                    <th className="p-4 text-right">Precio Unit.</th>
                                    <th className="p-4 text-right bg-blue-50/50 text-blue-700">Subtotal</th>
                                </tr>
                            </thead>
                            <tbody className="divide-y divide-gray-100">
                                {conducesActivos.length > 0 ? (
                                    conducesActivos.map(c => (
                                        <tr key={c.id} className="hover:bg-blue-50/30 transition-colors group">
                                            <td className="p-4 text-gray-600 font-medium">{c.fecha_despacho}</td>
                                            <td className="p-4">
                                                <span className="px-2 py-1 bg-gray-100 text-gray-700 rounded font-mono text-xs group-hover:bg-blue-100 group-hover:text-blue-700 transition">
                                                    #{c.numero_conduce}
                                                </span>
                                            </td>
                                            <td className="p-4 font-bold text-gray-800 uppercase text-xs">{c.escuela?.nombre}</td>
                                            <td className="p-4 italic text-gray-500 text-xs truncate max-w-[200px]">{c.plato?.nombre}</td>
                                            <td className="p-4 text-center font-black text-gray-700">{c.cantidad_entregada}</td>
                                            <td className="p-4 text-right text-gray-400">{formatMoney(c.precio_racion)}</td>
                                            <td className="p-4 text-right font-black text-blue-700 bg-blue-50/20">{formatMoney(c.total_monto)}</td>
                                        </tr>
                                    ))
                                ) : (
                                    <tr>
                                        <td colSpan="7" className="p-20 text-center">
                                            <div className="flex flex-col items-center opacity-30">
                                                <span className="text-5xl mb-2">📁</span>
                                                <p className="font-bold uppercase tracking-widest text-xs">Sin registros facturables</p>
                                            </div>
                                        </td>
                                    </tr>
                                )}
                            </tbody>
                            {/* Fila de Totales en la Tabla */}
                            {conducesActivos.length > 0 && (
                                <tfoot className="bg-gray-900 text-white font-bold border-t-4 border-white">
                                    <tr>
                                        <td colSpan="4" className="p-4 text-right text-[10px] uppercase tracking-[0.2em] text-gray-400">Totales del Listado:</td>
                                        <td className="p-4 text-center text-lg">{totales?.raciones}</td>
                                        <td className="p-4"></td>
                                        <td className="p-4 text-right text-lg text-green-400">{formatMoney(totales?.monto)}</td>
                                    </tr>
                                </tfoot>
                            )}
                        </table>
                    </div>
                </div>
            </div>

            <style>{`
                @media print {
                    .no-print { display: none !important; }
                    body { background: white !important; font-size: 10pt; }
                    .max-w-7xl { max-width: 100% !important; width: 100%; margin: 0; padding: 0; }
                    .shadow-xl, .shadow-sm { box-shadow: none !important; }
                    .rounded-xl { border-radius: 0 !important; }
                    table { border-collapse: collapse !important; width: 100%; }
                    th { background-color: #f3f4f6 !important; color: black !important; }
                    tfoot { background-color: black !important; color: white !important; }
                }
            `}</style>
        </AuthenticatedLayout>
    );
}