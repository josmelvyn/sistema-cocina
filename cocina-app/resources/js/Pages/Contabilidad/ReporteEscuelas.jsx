import React from 'react';
import AuthenticatedLayout from '@/Layouts/AuthenticatedLayout';
import { Head, useForm } from '@inertiajs/react';

export default function ReporteEscuelas({ auth, conduces, escuelas, filtros, totales }) {
    
    const { data, setData, get, processing } = useForm({
        desde: filtros.desde,
        hasta: filtros.hasta,
        escuela_id: filtros.escuela_id || '',
    });

    const handleFilter = (e) => {
        e.preventDefault();
        get(route('contabilidad.reporte_escuelas'));
    };

    return (
        <AuthenticatedLayout
            user={auth.user}
            header={<h2 className="font-bold text-xl uppercase">Reporte Detallado de Raciones</h2>}
        >
            <Head title="Reporte por Escuelas" />

            <div className="py-12 max-w-7xl mx-auto sm:px-6 lg:px-8 space-y-6">
                
                {/* FILTROS DE BÚSQUEDA */}
                <div className="p-6 bg-white shadow rounded-lg border-t-4 border-blue-600 no-print">
                    <form onSubmit={handleFilter} className="grid grid-cols-1 md:grid-cols-4 gap-4 items-end">
                        <div>
                            <label className="block text-xs font-bold text-gray-500 uppercase">Desde</label>
                            <input type="date" value={data.desde} onChange={e => setData('desde', e.target.value)} className="w-full border-gray-300 rounded text-sm" />
                        </div>
                        <div>
                            <label className="block text-xs font-bold text-gray-500 uppercase">Hasta</label>
                            <input type="date" value={data.hasta} onChange={e => setData('hasta', e.target.value)} className="w-full border-gray-300 rounded text-sm" />
                        </div>
                        <div>
                            <label className="block text-xs font-bold text-gray-500 uppercase">Escuela (Opcional)</label>
                            <select value={data.escuela_id} onChange={e => setData('escuela_id', e.target.value)} className="w-full border-gray-300 rounded text-sm">
                                <option value="">Todas las escuelas</option>
                                {escuelas.map(esc => <option key={esc.id} value={esc.id}>{esc.nombre}</option>)}
                            </select>
                        </div>
                        <button disabled={processing} className="bg-blue-600 text-white font-bold py-2 rounded shadow hover:bg-blue-700 uppercase text-xs">
                            {processing ? 'Buscando...' : 'Filtrar Reporte'}
                        </button>
                    </form>
                </div>

                {/* RESUMEN DE TOTALES */}
               <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
    <div className="bg-gray-800 text-white p-6 rounded-lg shadow text-center">
        <p className="text-xs font-bold uppercase text-gray-400">Total Raciones Despachadas</p>
        {/* Usamos totales?.raciones para evitar el error de undefined */}
        <p className="text-4xl font-black">{(totales?.raciones || 0).toLocaleString()}</p>
    </div>
    <div className="bg-green-600 text-white p-6 rounded-lg shadow text-center">
        <p className="text-xs font-bold uppercase text-green-200">Facturación Total del Período</p>
        <p className="text-4xl font-black">
            ${(totales?.monto || 0).toLocaleString(undefined, {minimumFractionDigits: 2})}
        </p>
    </div>
</div>

                {/* TABLA DE RESULTADOS */}
                <div className="bg-white shadow rounded-lg overflow-hidden border border-gray-200">
                    <div className="p-4 bg-gray-50 border-b flex justify-between items-center">
                        <span className="font-bold text-gray-700">LISTADO DE CONDUCES DEL {data.desde} AL {data.hasta}</span>
                        <button onClick={() => window.print()} className="bg-black text-white px-4 py-1 rounded text-xs font-bold no-print">🖨️ IMPRIMIR</button>
                    </div>
                    <div className="overflow-x-auto">
                        <table className="w-full text-sm">
                            <thead className="bg-gray-100 text-gray-600 uppercase text-[10px] font-black">
                                <tr>
                                    <th className="p-3 text-left">Fecha</th>
                                    <th className="p-3 text-left">No. Conduce</th>
                                    <th className="p-3 text-left">Escuela</th>
                                    <th className="p-3 text-left">Menú/Plato</th>
                                    <th className="p-3 text-center">Cant.</th>
                                    <th className="p-3 text-right">Precio</th>
                                    <th className="p-3 text-right">Subtotal</th>
                                </tr>
                            </thead>
                            <tbody className="divide-y divide-gray-200">
                                {conduces.map(c => (
                                    <tr key={c.id} className="hover:bg-gray-50 transition">
                                        <td className="p-3">{c.fecha_despacho}</td>
                                        <td className="p-3 font-mono font-bold text-blue-600">{c.numero_conduce}</td>
                                        <td className="p-3 font-bold text-gray-800">{c.escuela?.nombre}</td>
                                        <td className="p-3 italic text-gray-500">{c.plato?.nombre}</td>
                                        <td className="p-3 text-center font-black">{c.cantidad_entregada}</td>
                                        <td className="p-3 text-right">${Number(c.precio_racion).toFixed(2)}</td>
                                        <td className="p-3 text-right font-black text-green-700">${Number(c.total_monto).toLocaleString()}</td>
                                    </tr>
                                ))}
                                {conduces.length === 0 && (
                                    <tr>
                                        <td colSpan="7" className="p-10 text-center text-gray-400 italic font-medium">No se encontraron raciones despachadas en este rango de fechas.</td>
                                    </tr>
                                )}
                            </tbody>
                        </table>
                    </div>
                </div>
            </div>
            <style>{` @media print { .no-print { display: none; } } `}</style>
        </AuthenticatedLayout>
    );
}