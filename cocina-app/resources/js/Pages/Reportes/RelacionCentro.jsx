import React, { useEffect } from 'react';
import { Head } from '@inertiajs/react';

export default function RelacionCentro({ escuela, conduces, filtros }) {
    // Cálculo del total general
    const totalGeneral = conduces.reduce((acc, c) => acc + (Number(c.cantidad_entregada) || 0), 0);

    return (
        <div className="bg-white min-h-screen p-4 text-black font-sans uppercase text-[11px]">
            <Head title={`Relación ${escuela.nombre}`} />

            <div className="max-w-[850px] mx-auto p-4">
                
                {/* ENCABEZADO OFICIAL */}
                <div className="text-center mb-4">
                    <h1 className="text-lg font-bold">YDELSA MARIANA COLON BAUTISTA</h1>
                    <p className="text-[10px]">AV. HERMANOS MORENO MARTINEZ ESQ. TRINITARIA, LAS CEJAS, SAN FCO. DE MACORIS</p>
                    <p className="text-[10px]">Tel: 809-345-4022 / 809-588-4407 · RNC: 058-0079730-7</p>
                    <h2 className="text-md font-bold mt-4 underline">RELACIÓN DE CONDUCES POR CENTRO</h2>
                    <p className="font-bold">Desde: {filtros.desde}  Hasta: {filtros.hasta}</p>
                </div>

                <p className="mb-2">Página: 1 de 1</p>

                {/* TABLA ESTILO IMAGEN */}
                <table className="w-full border-collapse border border-gray-400">
                    <thead>
                        <tr className="bg-gray-200">
                            <th className="border border-gray-400 p-1 w-24">Fecha</th>
                            <th className="border border-gray-400 p-1 w-24">NO. DE CONDUCE</th>
                            <th className="border border-gray-400 p-1">CÓDIGO Y NOMBRE DEL CENTRO EDUCATIVO</th>
                            <th className="border border-gray-400 p-1 w-32 text-[9px]">Cantidad de Raciones de Almuerzo Escolar con Postre</th>
                        </tr>
                    </thead>
                    <tbody>
                        {conduces.map((c) => (
                            <tr key={c.id} className="text-center">
                                <td className="border border-gray-400 p-1">{c.fecha_despacho}</td>
                                <td className="border border-gray-400 p-1">{c.numero_conduce}</td>
                                <td className="border border-gray-400 p-1 text-left px-2">
                                    {escuela.codigo_minerd} - {escuela.nombre}
                                </td>
                                <td className="border border-gray-400 p-1 font-bold">
                                    {Number(c.cantidad_entregada).toLocaleString()}
                                </td>
                            </tr>
                        ))}
                    </tbody>
                    <tfoot>
                        <tr className="font-bold bg-gray-100">
                            <td colSpan="3" className="border border-gray-400 p-2 text-left text-sm italic">
                                Totales ==={">"}
                            </td>
                            <td className="border border-gray-400 p-2 text-center text-lg">
                                {totalGeneral.toLocaleString()}
                            </td>
                        </tr>
                    </tfoot>
                </table>

                {/* AREA DE FIRMA Y SELLO */}
                <div className="mt-16 flex flex-col items-center">
                    <div className="w-64 border-t border-black text-center pt-1">
                        <img src="/img/firma_ydelsa.png" alt="" className="h-12 mx-auto -mt-12 mb-2 opacity-80" /> {/* Opcional: Imagen de firma */}
                        <p className="font-bold">Ydelsa Colon</p>
                        <p className="text-[10px]">Gerente General</p>
                    </div>
                    
                   
                </div>
            </div>

            <button onClick={() => window.print()} className="fixed bottom-10 right-10 bg-black text-white p-4 rounded-full no-print shadow-xl">
                🖨️ Imprimir
            </button>

            <style>{`@media print { .no-print { display: none !important; } @page { margin: 0.5cm; } }`}</style>
        </div>
    );
}