import React from 'react';
import AuthenticatedLayout from '@/Layouts/AuthenticatedLayout';
import { Head } from '@inertiajs/react';

export default function Reporte({ auth, data }) {
    // 1. Filtrar conduces en 0
    const conducesActivos = data.conduces.filter(c => Number(c.total_monto) > 0);
    const balance = data.ingresos_cobrados - data.total_gastos;

    // Helper para formato de moneda
    const formatCurrency = (value) => 
        new Intl.NumberFormat('es-DO', { style: 'currency', currency: 'DOP' }).format(value);

    return (
        <AuthenticatedLayout
            user={auth.user}
            header={<h2 className="font-bold text-xl uppercase">Reporte Financiero: {data.mes_nombre}</h2>}
        >
            <Head title="Reporte Contable" />

            <div className="py-12 max-w-7xl mx-auto sm:px-6 lg:px-8 space-y-6">
                
                {/* RESUMEN EJECUTIVO */}
                <div className="grid grid-cols-1 md:grid-cols-4 gap-4 no-print">
                    <div className="bg-white p-6 shadow rounded-lg border-l-4 border-blue-500">
                        <p className="text-xs font-bold text-gray-500 uppercase italic">Ventas Totales (Proyectado)</p>
                        <p className="text-2xl font-black text-blue-700">{formatCurrency(data.ingresos_pendientes + data.ingresos_cobrados)}</p>
                    </div>
                    <div className="bg-white p-6 shadow rounded-lg border-l-4 border-green-500">
                        <p className="text-xs font-bold text-gray-500 uppercase">Cobrado (Entrada Real)</p>
                        <p className="text-2xl font-black text-green-600">{formatCurrency(data.ingresos_cobrados)}</p>
                    </div>
                    <div className="bg-white p-6 shadow rounded-lg border-l-4 border-red-500">
                        <p className="text-xs font-bold text-gray-500 uppercase">Gastos Pagados</p>
                        <p className="text-2xl font-black text-red-600">{formatCurrency(data.total_gastos)}</p>
                    </div>
                    <div className="bg-gray-800 p-6 shadow rounded-lg text-white">
                        <p className="text-xs font-bold text-gray-400 uppercase font-mono tracking-widest">Balance Neto</p>
                        <p className={`text-2xl font-black ${balance >= 0 ? 'text-green-400' : 'text-red-400'}`}>
                            {formatCurrency(balance)}
                        </p>
                    </div>
                </div>

                {/* DETALLE DE CONDUCES */}
                <div className="bg-white shadow rounded-lg overflow-hidden border">
                    <div className="p-4 bg-gray-100 font-bold border-b flex justify-between items-center">
                        <span className="text-gray-700">DETALLE DE CONDUCES DESPACHADOS (FACTURABLES)</span>
                        <button onClick={() => window.print()} className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded text-xs font-bold transition no-print shadow-sm">
                            🖨️ IMPRIMIR REPORTE
                        </button>
                    </div>
                    <div className="overflow-x-auto">
                        <table className="w-full text-sm">
                            <thead className="bg-gray-50 text-gray-600 uppercase text-[10px] tracking-wider">
                                <tr>
                                    <th className="p-3 text-left">Fecha</th>
                                    <th className="p-3 text-left">Escuela / Centro</th>
                                    <th className="p-3 text-center">Raciones</th>
                                    <th className="p-3 text-right">Monto Bruto</th>
                                    <th className="p-3 text-center">Estado</th>
                                </tr>
                            </thead>
                            <tbody className="divide-y">
                                {conducesActivos.length > 0 ? (
                                    conducesActivos.map(c => (
                                        <tr key={c.id} className="hover:bg-gray-50 transition-colors">
                                            <td className="p-3 text-gray-600">{c.fecha_despacho}</td>
                                            <td className="p-3 font-bold">{c.escuela?.nombre}</td>
                                            <td className="p-3 text-center">{c.cantidad_entregada}</td>
                                            <td className="p-3 text-right font-bold">{formatCurrency(c.total_monto)}</td>
                                            <td className="p-3 text-center">
                                                <span className={`px-2 py-1 rounded-full text-[10px] font-bold ${c.estado === 'pagado' ? 'bg-green-100 text-green-700' : 'bg-yellow-100 text-yellow-700'}`}>
                                                    {c.estado.toUpperCase()}
                                                </span>
                                            </td>
                                        </tr>
                                    ))
                                ) : (
                                    <tr><td colSpan="5" className="p-10 text-center text-gray-400 italic">No hay conduces facturables este mes.</td></tr>
                                )}
                            </tbody>
                            {/* Mejora: Fila de totales para conduces */}
                            {conducesActivos.length > 0 && (
                                <tfoot className="bg-gray-50 font-black border-t-2 border-gray-200">
                                    <tr>
                                        <td colSpan="2" className="p-3 text-right uppercase text-xs">Total Facturado:</td>
                                        <td className="p-3 text-center">{conducesActivos.reduce((acc, c) => acc + c.cantidad_entregada, 0)}</td>
                                        <td className="p-3 text-right text-blue-700">{formatCurrency(conducesActivos.reduce((acc, c) => acc + Number(c.total_monto), 0))}</td>
                                        <td></td>
                                    </tr>
                                </tfoot>
                            )}
                        </table>
                    </div>
                </div>

                {/* RESUMEN DE GASTOS */}
                <div className="bg-white shadow rounded-lg overflow-hidden border">
                    <div className="p-4 bg-red-50 text-red-800 font-bold border-b">RESUMEN DE EGRESOS / GASTOS OPERATIVOS</div>
                    <div className="overflow-x-auto">
                        <table className="w-full text-sm">
                            <thead className="bg-gray-50 text-red-900 uppercase text-[10px]">
                                <tr>
                                    <th className="p-3 text-left">Fecha</th>
                                    <th className="p-3 text-left">Concepto</th>
                                    <th className="p-3 text-left">Categoría</th>
                                    <th className="p-3 text-right">Monto</th>
                                </tr>
                            </thead>
                            <tbody className="divide-y">
                                {data.gastos.map(g => (
                                    <tr key={g.id} className="hover:bg-red-50/30">
                                        <td className="p-3">{g.fecha_gasto}</td>
                                        <td className="p-3 font-semibold text-gray-800">{g.concepto}</td>
                                        <td className="p-3">
                                            <span className="text-[10px] bg-gray-100 px-2 py-1 rounded text-gray-600">{g.categoria}</span>
                                        </td>
                                        <td className="p-3 text-right font-bold text-red-600">-{formatCurrency(g.monto)}</td>
                                    </tr>
                                ))}
                            </tbody>
                            <tfoot className="bg-red-50 font-black border-t-2 border-red-100">
                                <tr>
                                    <td colSpan="3" className="p-3 text-right uppercase text-xs text-red-800">Total Egresos:</td>
                                    <td className="p-3 text-right text-red-700">{formatCurrency(data.total_gastos)}</td>
                                </tr>
                            </tfoot>
                        </table>
                    </div>
                </div>
            </div>

            <style>{`
                @media print {
                    .no-print { display: none !important; }
                    body { background: white; padding: 0; }
                    .max-w-7xl { max-width: 100% !important; width: 100%; margin: 0; padding: 0; }
                    .shadow { shadow: none !important; border: 1px solid #ddd; }
                    table { page-break-inside: auto; }
                    tr { page-break-inside: avoid; page-break-after: auto; }
                }
            `}</style>
        </AuthenticatedLayout>
    );
}