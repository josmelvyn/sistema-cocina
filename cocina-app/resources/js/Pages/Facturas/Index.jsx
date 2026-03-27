import React from 'react';
import AuthenticatedLayout from '@/Layouts/AuthenticatedLayout';
import { Head, Link } from '@inertiajs/react';

export default function Index({ auth, facturas }) {
    return (
        <AuthenticatedLayout user={auth.user} header={<h2 className="font-bold text-xl text-gray-800">Historial de Facturas Fiscales</h2>}>
            <Head title="Facturas" />
            <div className="py-12">
                <div className="max-w-7xl mx-auto sm:px-6 lg:px-8">
                    <div className="bg-white overflow-hidden shadow-sm sm:rounded-lg p-6">
                        <table className="min-w-full divide-y divide-gray-200 uppercase text-xs">
                            <thead className="bg-gray-50">
                                <tr>
                                    <th className="px-6 py-3 text-left font-bold">Fecha</th>
                                    <th className="px-6 py-3 text-left font-bold">NCF</th>
                                    <th className="px-6 py-3 text-left font-bold">Escuela</th>
                                    <th className="px-6 py-3 text-left font-bold">Monto</th>
                                    <th className="px-6 py-3 text-center font-bold">Acciones</th>
                                </tr>
                            </thead>
                            <tbody className="divide-y divide-gray-100">
                                {facturas.map((f) => (
                                    <tr key={f.id} className="hover:bg-gray-50 transition">
                                        <td className="px-6 py-4">{new Date(f.created_at).toLocaleDateString()}</td>
                                        <td className="px-6 py-4 font-black text-blue-700">{f.ncf}</td>
                                        <td className="px-6 py-4">{f.conduce.escuela?.nombre}</td>
                                        <td className="px-6 py-4 font-bold">${f.monto_total}</td>
                                        <td className="px-6 py-4 text-center">
                                            <Link href={route('facturas.imprimir', f.id)} className="bg-slate-800 text-white px-3 py-1 rounded hover:bg-black transition">
                                                🖨️ Imprimir Factura
                                            </Link>
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