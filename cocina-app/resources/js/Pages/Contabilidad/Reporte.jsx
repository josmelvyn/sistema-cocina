import React from 'react';
import AuthenticatedLayout from '@/Layouts/AuthenticatedLayout';
import { Head } from '@inertiajs/react';

export default function Reporte({ auth, data }) {
    const balance = data.ingresos_cobrados - data.total_gastos;

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
                        <p className="text-xs font-bold text-gray-500 uppercase">Ventas Totales</p>
                        <p className="text-2xl font-black">${(data.ingresos_pendientes + data.ingresos_cobrados).toLocaleString()}</p>
                    </div>
                    <div className="bg-white p-6 shadow rounded-lg border-l-4 border-green-500">
                        <p className="text-xs font-bold text-gray-500 uppercase">Cobrado</p>
                        <p className="text-2xl font-black text-green-600">${data.ingresos_cobrados.toLocaleString()}</p>
                    </div>
                    <div className="bg-white p-6 shadow rounded-lg border-l-4 border-red-500">
                        <p className="text-xs font-bold text-gray-500 uppercase">Gastos</p>
                        <p className="text-2xl font-black text-red-600">${data.total_gastos.toLocaleString()}</p>
                    </div>
                    <div className="bg-gray-800 p-6 shadow rounded-lg text-white">
                        <p className="text-xs font-bold text-gray-400 uppercase">Balance Neto (Caja)</p>
                        <p className="text-2xl font-black text-white">${balance.toLocaleString()}</p>
                    </div>
                </div>

                {/* DETALLE DE CONDUCES PARA EL MINERD */}
                <div className="bg-white shadow rounded-lg overflow-hidden border">
                    <div className="p-4 bg-gray-100 font-bold border-b flex justify-between items-center">
                        <span>DETALLE DE CONDUCES DESPACHADOS</span>
                        <button onClick={() => window.print()} className="bg-black text-white px-4 py-1 rounded text-xs no-print">🖨️ IMPRIMIR REPORTE</button>
                    </div>
                    <table className="w-full text-sm">
                        <thead className="bg-gray-50">
                            <tr>
                                <th className="p-3 text-left">Fecha</th>
                                <th className="p-3 text-left">Escuela</th>
                                <th className="p-3 text-center">Raciones</th>
                                <th className="p-3 text-right">Monto</th>
                                <th className="p-3 text-center">Estado</th>
                            </tr>
                        </thead>
                        <tbody>
                            {data.conduces.map(c => (
                                <tr key={c.id} className="border-t">
                                    <td className="p-3">{c.fecha_despacho}</td>
                                    <td className="p-3 font-bold">{c.escuela?.nombre}</td>
                                    <td className="p-3 text-center">{c.cantidad_entregada}</td>
                                    <td className="p-3 text-right font-black">${Number(c.total_monto).toLocaleString()}</td>
                                    <td className="p-3 text-center">
                                        <span className={c.estado === 'pagado' ? 'text-green-600' : 'text-red-500'}>
                                            {c.estado.toUpperCase()}
                                        </span>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>

                {/* RESUMEN DE GASTOS */}
                <div className="bg-white shadow rounded-lg overflow-hidden border">
                    <div className="p-4 bg-red-50 text-red-800 font-bold border-b">EGRESOS / GASTOS DEL MES</div>
                    <table className="w-full text-sm">
                        <thead className="bg-gray-50 text-red-900">
                            <tr>
                                <th className="p-3 text-left">Fecha</th>
                                <th className="p-3 text-left">Concepto</th>
                                <th className="p-3 text-left">Categoría</th>
                                <th className="p-3 text-right">Monto</th>
                            </tr>
                        </thead>
                        <tbody>
                            {data.gastos.map(g => (
                                <tr key={g.id} className="border-t">
                                    <td className="p-3">{g.fecha_gasto}</td>
                                    <td className="p-3 font-bold">{g.concepto}</td>
                                    <td className="p-3 italic">{g.categoria}</td>
                                    <td className="p-3 text-right font-bold text-red-600">-${Number(g.monto).toLocaleString()}</td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            </div>
            <style>{` @media print { .no-print { display: none; } } `}</style>
        </AuthenticatedLayout>
    );
}