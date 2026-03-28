import React from 'react';
import { Head } from '@inertiajs/react';

export default function FacturaPeriodo({ escuela, conduces, filtros }) {
    // Cálculos totales
    const totalRaciones = conduces.reduce((acc, c) => acc + Number(c.cantidad_entregada), 0);
    const totalDinero = conduces.reduce((acc, c) => acc + (Number(c.cantidad_entregada) * Number(c.precio_racion)), 0);

    return (
        <div className="bg-white min-h-screen p-10 text-black font-sans uppercase text-[11px]">
            <Head title={`Factura - ${escuela.nombre}`} />

            <div className="max-w-[850px] mx-auto border border-gray-300 p-8 print:border-none">
                <div className="text-center mb-6">
                    <h1 className="text-xl font-bold">YDELSA MARIANA COLON BAUTISTA</h1>
                    <p className="text-[10px]">RNC: 058-0079730-7</p>
                    <h2 className="text-lg font-black mt-4 border-y border-black py-1">FACTURA DE SERVICIOS ALIMENTICIOS</h2>
                </div>

                <div className="grid grid-cols-2 mb-6">
                    <div>
                        <p><strong>CLIENTE:</strong> {escuela.nombre}</p>
                        <p><strong>CÓDIGO:</strong> {escuela.codigo_minerd}</p>
                    </div>
                    <div className="text-right">
                        <p><strong>PERIODO:</strong> {filtros.desde} AL {filtros.hasta}</p>
                    </div>
                </div>

                <table className="w-full border-collapse">
                    <thead>
                        <tr className="border-b-2 border-black">
                            <th className="text-left p-2">FECHA</th>
                            <th className="text-left p-2">CONDUCE</th>
                            <th className="text-center p-2">CANTIDAD</th>
                            <th className="text-right p-2">PRECIO</th>
                            <th className="text-right p-2">SUB-TOTAL</th>
                        </tr>
                    </thead>
                    <tbody>
                        {conduces.map((c) => (
                            <tr key={c.id} className="border-b border-gray-200">
                                <td className="p-2">{c.fecha_despacho}</td>
                                <td className="p-2">{c.numero_conduce}</td>
                                <td className="p-2 text-center">{c.cantidad_entregada}</td>
                                <td className="p-2 text-right">${Number(c.precio_racion).toFixed(2)}</td>
                                <td className="p-2 text-right font-bold">
                                    ${(c.cantidad_entregada * c.precio_racion).toLocaleString()}
                                </td>
                            </tr>
                        ))}
                    </tbody>
                    <tfoot>
                        <tr className="text-lg font-black">
                            <td colSpan="2" className="p-4 text-right italic">TOTALES ==={">"}</td>
                            <td className="p-4 text-center border-t-2 border-black">{totalRaciones}</td>
                            <td colSpan="2" className="p-4 text-right border-t-2 border-black text-2xl">
                                RD$ {totalDinero.toLocaleString(undefined, {minimumFractionDigits: 2})}
                            </td>
                        </tr>
                    </tfoot>
                </table>

                <div className="mt-20 grid grid-cols-2 gap-10 text-center">
                    <div className="border-t border-black pt-2">PREPARADO POR</div>
                    <div className="border-t border-black pt-2">RECIBIDO CONFORME</div>
                </div>
            </div>

            <button onClick={() => window.print()} className="fixed bottom-10 right-10 bg-blue-700 text-white p-4 rounded-full no-print shadow-2xl">
                🖨️ IMPRIMIR FACTURA
            </button>
        </div>
    );
}