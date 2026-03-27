import { Head, useForm, Link, router } from '@inertiajs/react'; 
import AuthenticatedLayout from '@/Layouts/AuthenticatedLayout';
import React, { useState } from 'react';

export default function Index({ auth, facturas }) {
    const handleAnularFactura = (id) => {
        const motivo = prompt(
            "Indique el motivo legal de la anulación (Ej: Error en RNC o Monto):",
        );
        if (motivo && motivo.length >= 10) {
            router.patch(route("facturas.anular", id), { motivo });
        } else {
            alert("El motivo debe ser más descriptivo.");
        }
    };
    return (
        <AuthenticatedLayout
            user={auth.user}
            header={
                <h2 className="font-bold text-xl text-gray-800">
                    Historial de Facturas Fiscales
                </h2>
            }
        >
            <Head title="Facturas" />
            <div className="py-12">
                <div className="max-w-7xl mx-auto sm:px-6 lg:px-8">
                    <div className="bg-white overflow-hidden shadow-sm sm:rounded-lg p-6">
                        <table className="min-w-full divide-y divide-gray-200 uppercase text-xs">
                            <thead className="bg-gray-50">
                                <tr>
                                    <th className="px-6 py-3 text-left font-bold">
                                        Fecha
                                    </th>
                                    <th className="px-6 py-3 text-left font-bold">
                                        NCF
                                    </th>
                                    <th className="px-6 py-3 text-left font-bold">
                                        Escuela
                                    </th>
                                    <th className="px-6 py-3 text-left font-bold">
                                        Monto
                                    </th>
                                    <th className="px-6 py-3 text-center font-bold">
                                        Acciones
                                    </th>
                                </tr>
                            </thead>
                            {/* TABLA DE FACTURAS */}
                            <tbody className="divide-y divide-slate-50 text-slate-600">
                                {facturas.map(
                                    (
                                        f, // <--- AQUÍ DEFINES "f"
                                    ) => (
                                        <tr
                                            key={f.id}
                                            className="hover:bg-slate-50 transition uppercase text-xs"
                                        >
                                            <td className="px-6 py-4 font-mono text-slate-400">
                                                {new Date(
                                                    f.created_at,
                                                ).toLocaleDateString()}
                                            </td>
                                            <td className="px-6 py-4 font-black text-blue-600">
                                                {f.ncf}
                                            </td>
                                            <td className="px-6 py-4 font-bold">
                                                {f.conduce?.escuela?.nombre}
                                            </td>
                                            <td className="px-6 py-4 text-right font-black">
                                                RD${" "}
                                                {Number(
                                                    f.monto_total,
                                                ).toLocaleString()}
                                            </td>
                                            <td className="px-6 py-4 text-center space-x-2">
    {f.estado !== 'anulada' ? (
        <>
            {/* BOTÓN NORMAL SI ESTÁ ACTIVA */}
            <a 
                href={route('facturas.imprimir', f.id)} 
                target="_blank" 
                className="bg-slate-800 text-white px-3 py-1.5 rounded-xl font-bold text-[10px] hover:bg-black transition"
            >
                🖨️ IMPRIMIR FACTURA
            </a>
            <button 
                onClick={() => handleAnularFactura(f.id)}
                className="text-red-500 font-bold hover:underline text-[10px] uppercase"
            >
                🚫 Anular
            </button>
        </>
    ) : (
        <>
            {/* BOTÓN DE NOTA DE CRÉDITO SI ESTÁ ANULADA */}
            <a 
                href={route('facturas.nota_credito', f.id)} 
                target="_blank" 
                className="bg-red-600 text-white px-3 py-1.5 rounded-xl font-bold text-[10px] hover:bg-red-700 transition shadow-lg"
            >
                📜 IMPRIMIR NOTA DE CRÉDITO
            </a>
            <span className="block text-[9px] font-black text-red-600 mt-1 italic">
                ANULADA CON {f.ncf_nota_credito}
            </span>
        </>
    )}
</td>
                                        </tr>
                                    ),
                                )}
                            </tbody>
                        </table>
                    </div>
                </div>
            </div>
        </AuthenticatedLayout>
    );
}
