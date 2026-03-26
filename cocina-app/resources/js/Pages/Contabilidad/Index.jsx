import React from 'react';
import AuthenticatedLayout from '@/Layouts/AuthenticatedLayout';
import { Head, useForm, Link } from '@inertiajs/react';

export default function Index({ auth, cuentas_por_cobrar, totales, ultimos_gastos }) {
    
    // Formulario de Gastos
    const { data, setData, post, processing, reset, errors } = useForm({
        concepto: '',
        monto: '',
        fecha_gasto: new Date().toISOString().split('T')[0],
        categoria: 'Operativo',
    });

    const submitGasto = (e) => {
        e.preventDefault();
        post(route('gastos.store'), {
            onSuccess: () => {
                alert('Gasto registrado correctamente');
                reset();
            },
        });
    };

    return (
        <AuthenticatedLayout
            user={auth.user}
            header={
                <div className="flex flex-col md:flex-row justify-between items-center gap-4">
                    <h2 className="font-semibold text-xl text-gray-800 leading-tight">Contabilidad y Finanzas</h2>
                    
                    {/* BOTONES DE REPORTES */}
                    <div className="flex gap-2">
                        <Link 
                            href={route('contabilidad.reporte_escuelas')} 
                            className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-md font-black text-[10px] shadow-md transition uppercase tracking-widest"
                        >
                            📋 Reporte de Raciones (Filtros)
                        </Link>
                        <Link 
                            href={route('contabilidad.reporte')} 
                            className="bg-indigo-600 hover:bg-indigo-700 text-white px-4 py-2 rounded-md font-black text-[10px] shadow-md transition uppercase tracking-widest"
                        >
                            📊 Resumen Mensual
                        </Link>
                    </div>
                </div>
            }
        >
            <Head title="Contabilidad" />

            <div className="py-12">
                <div className="max-w-7xl mx-auto sm:px-6 lg:px-8 space-y-6">
                    
                    {/* RESUMEN DE CAJA */}
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                        <div className="bg-white p-6 rounded-lg shadow border-l-8 border-yellow-500">
                            <div className="text-gray-400 text-[10px] font-black uppercase tracking-widest">Cuentas por Cobrar</div>
                            <div className="text-3xl font-black text-red-600">${Number(totales.por_cobrar).toLocaleString(undefined, {minimumFractionDigits: 2})}</div>
                            <p className="text-[10px] text-gray-500 mt-1 italic">Facturas pendientes</p>
                        </div>
                        <div className="bg-white p-6 rounded-lg shadow border-l-8 border-green-500">
                            <div className="text-gray-400 text-[10px] font-black uppercase tracking-widest">Ingresos Cobrados</div>
                            <div className="text-3xl font-black text-green-600">${Number(totales.cobrado).toLocaleString(undefined, {minimumFractionDigits: 2})}</div>
                            <p className="text-[10px] text-gray-500 mt-1 italic">Efectivo en caja</p>
                        </div>
                        <div className="bg-white p-6 rounded-lg shadow border-l-8 border-red-600">
                            <div className="text-gray-400 text-[10px] font-black uppercase tracking-widest">Gastos Totales</div>
                            <div className="text-3xl font-black text-gray-800">${Number(totales.gastos).toLocaleString(undefined, {minimumFractionDigits: 2})}</div>
                            <p className="text-[10px] text-gray-500 mt-1 italic">Total de egresos</p>
                        </div>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        {/* REGISTRO DE GASTO */}
                        <div className="bg-white shadow rounded-lg p-6 border-t-4 border-red-500">
                            <h3 className="font-black text-sm mb-4 uppercase text-gray-600 tracking-tighter italic">Registrar Salida (Gasto)</h3>
                            <form onSubmit={submitGasto} className="space-y-4">
                                <div>
                                    <label className="block text-xs font-bold text-gray-500 uppercase">Concepto</label>
                                    <input 
                                        type="text" 
                                        value={data.concepto}
                                        onChange={e => setData('concepto', e.target.value)}
                                        className="mt-1 block w-full border-gray-300 rounded-md text-sm"
                                        placeholder="Ej: Pago de Gasina Camión"
                                        required
                                    />
                                </div>
                                <div className="grid grid-cols-2 gap-4">
                                    <div>
                                        <label className="block text-xs font-bold text-gray-500 uppercase">Monto ($)</label>
                                        <input 
                                            type="number" 
                                            value={data.monto}
                                            onChange={e => setData('monto', e.target.value)}
                                            className="mt-1 block w-full border-gray-300 rounded-md text-sm font-bold"
                                            required
                                        />
                                    </div>
                                    <div>
                                        <label className="block text-xs font-bold text-gray-500 uppercase">Categoría</label>
                                        <select 
                                            value={data.categoria}
                                            onChange={e => setData('categoria', e.target.value)}
                                            className="mt-1 block w-full border-gray-300 rounded-md text-sm"
                                        >
                                            <option value="Operativo">Operativo</option>
                                            <option value="Nomina">Nómina</option>
                                            <option value="Insumos">Insumos/Compras</option>
                                            <option value="Mantenimiento">Mantenimiento</option>
                                        </select>
                                    </div>
                                </div>
                                <button 
                                    type="submit" 
                                    disabled={processing}
                                    className="w-full bg-red-600 text-white font-black py-3 rounded-md hover:bg-red-700 shadow-lg transition uppercase text-xs tracking-widest"
                                >
                                    {processing ? '...' : 'Registrar Gasto'}
                                </button>
                            </form>
                        </div>

                        {/* LISTADO PENDIENTES */}
                        <div className="bg-white shadow rounded-lg overflow-hidden border-t-4 border-yellow-500 font-sans text-sm">
                            <div className="p-4 bg-yellow-50 border-b font-black text-xs text-yellow-800 uppercase tracking-widest">Conduces por Cobrar</div>
                            <table className="w-full">
                                <thead className="bg-gray-100 text-[10px] font-black text-gray-500 uppercase">
                                    <tr>
                                        <th className="p-3 text-left">Factura</th>
                                        <th className="p-3 text-left">Escuela</th>
                                        <th className="p-3 text-right">Total</th>
                                    </tr>
                                </thead>
                                <tbody className="divide-y divide-gray-100">
                                    {cuentas_por_cobrar.map(c => (
                                        <tr key={c.id} className="hover:bg-gray-50">
                                            <td className="p-3 font-mono text-blue-600 font-bold">{c.numero_conduce}</td>
                                            <td className="p-3 font-bold text-gray-700">{c.escuela?.nombre}</td>
                                            <td className="p-3 text-right font-black text-red-500">
                                                ${Number(c.total_monto).toLocaleString(undefined, {minimumFractionDigits: 2})}
                                            </td>
                                        </tr>
                                    ))}
                                </tbody>
                            </table>
                        </div>
                    </div>
                </div>
            </div>
        </AuthenticatedLayout>
    );
}