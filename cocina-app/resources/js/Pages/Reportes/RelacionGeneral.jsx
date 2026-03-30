import React, { useEffect } from 'react';
import { Head } from '@inertiajs/react';

export default function RelacionGeneral({ conduces, filtros }) {
    // Cálculo de raciones totales
    const totalRaciones = conduces.reduce((acc, c) => acc + (Number(c.cantidad_entregada) || 0), 0);

    return (
        <div className="bg-white min-h-screen p-4 text-black font-sans uppercase text-[10px]">
            <Head title="Relación General de Conduces" />

            <div className="max-w-[850px] mx-auto p-4">
                
                {/* ENCABEZADO OFICIAL */}
                <div className="text-center mb-4 leading-tight">
                    <h1 className="text-lg font-bold">YDELSA MARIANA COLON BAUTISTA</h1>
                    <p className="text-[9px]">AV. HERMANOS MORENO MARTINEZ ESQ. TRINITARIA, LAS CEJAS, SAN FCO. DE MACORIS</p>
                    <p className="text-[9px]">Tel: 809-345-4022 / 809-588-4407 · E-Mail: ydelsa3@hotmail.com</p>
                    <p className="text-[9px] font-bold">RNC: 058-0079732-7</p>
                    <h2 className="text-md font-bold mt-4">RELACIÓN DE CONDUCES GENERAL</h2>
                    <p className="font-bold underline">Desde: {filtros.desde} Hasta: {filtros.hasta}</p>
                </div>

                <div className="flex justify-between mb-1 italic">
                    <span>Página: 1 de 1</span>
                    <span>Fecha Reporte: {new Date().toLocaleDateString('es-DO')}</span>
                </div>

                {/* TABLA ESTILO IMAGEN */}
                <table className="w-full border-collapse border border-gray-400">
                    <thead>
                        <tr className="bg-gray-100 text-center font-bold">
                            <th className="border border-gray-400 p-1 w-20">Fecha</th>
                            <th className="border border-gray-400 p-1 w-24 uppercase">No. de Conduce</th>
                            <th className="border border-gray-400 p-1 uppercase">Código y Nombre del Centro Educativo</th>
                            <th className="border border-gray-400 p-1 w-32 uppercase leading-none text-[8px]">
                                Cantidad de Raciones de Almuerzo Escolar con Postre
                            </th>
                        </tr>
                    </thead>
                    <tbody>
                        {conduces.map((c) => (
                            <tr key={c.id} className="text-center">
                                <td className="border border-gray-400 p-1">
                                    {/* Formateamos la fecha si viene YYYY-MM-DD */}
                                    {c.fecha_despacho}
                                </td>
                                <td className="border border-gray-400 p-1">
                                    {c.numero_conduce}
                                </td>
                                <td className="border border-gray-400 p-1 text-left px-2">
                                    <span className="font-bold">{c.escuela?.codigo_minerd}</span> - {c.escuela?.nombre}
                                </td>
                                <td className="border border-gray-400 p-1 font-bold text-right px-4">
                                    {Number(c.cantidad_entregada).toLocaleString()}
                                </td>
                            </tr>
                        ))}
                    </tbody>
                    <tfoot>
                        <tr className="font-bold bg-gray-50">
                            <td colSpan="3" className="border border-gray-400 p-2 text-right uppercase">Total General:</td>
                            <td className="border border-gray-400 p-2 text-right px-4 underline text-sm">
                                {totalRaciones.toLocaleString()}
                            </td>
                        </tr>
                    </tfoot>
                </table>

                {/* ÁREA DE FIRMA (Opcional, según imagen) */}
                <div className="mt-12 flex justify-end no-print">
                   <button 
                        onClick={() => window.print()} 
                        className="bg-black text-white px-6 py-2 rounded-full font-bold text-[12px] shadow-lg"
                    >
                        🖨️ IMPRIMIR REPORTE
                    </button>
                </div>
            </div>

            <style>{`
                @media print { 
                    .no-print { display: none !important; } 
                    @page { size: letter; margin: 1cm; }
                }
            `}</style>
        </div>
    );
}