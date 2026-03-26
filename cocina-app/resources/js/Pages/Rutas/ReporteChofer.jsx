import React from 'react';
import { Head } from '@inertiajs/react';

export default function ReporteChofer({ ruta, fecha }) {
    return (
        <div className="min-h-screen bg-white p-6 text-gray-900 font-sans">
            <Head title={`Hoja de Ruta - ${ruta.nombre}`} />
            
            <div className="max-w-3xl mx-auto border-2 border-black p-4">
                <div className="flex justify-between items-center border-b-2 border-black pb-2 mb-4">
                    <div>
                        <h1 className="text-2xl font-black uppercase">{ruta.nombre}</h1>
                        <p className="text-sm font-bold">CHOFER: {ruta.chofer || 'No asignado'}</p>
                    </div>
                    <div className="text-right">
                        <p className="text-sm">FECHA:</p>
                        <p className="font-bold">{fecha}</p>
                    </div>
                </div>

                <h2 className="text-center font-black bg-black text-white py-1 mb-4 uppercase tracking-tighter">
                    Plan de Entrega Diaria
                </h2>

                <table className="w-full border-collapse">
                    <thead>
                        <tr className="border-b-2 border-black">
                            <th className="text-left p-2">ORDEN</th>
                            <th className="text-left p-2">ESCUELA</th>
                            <th className="text-center p-2">RACIONES</th>
                            <th className="text-right p-2">ENTREGADO</th>
                        </tr>
                    </thead>
                    <tbody>
                        {ruta.escuelas.map((escuela, index) => {
                            // Buscamos el conduce de hoy para esta escuela
                            const conduceHoy = escuela.conduces[0];
                            return (
                                <tr key={escuela.id} className="border-b border-gray-300">
                                    <td className="p-4 font-bold">{index + 1}</td>
                                    <td className="p-4">
                                        <div className="font-black text-lg">{escuela.nombre}</div>
                                        <div className="text-xs text-gray-500">Cód: {escuela.codigo_minerd}</div>
                                    </td>
                                    <td className="p-4 text-center font-black text-xl">
                                        {conduceHoy ? conduceHoy.cantidad_entregada : '---'}
                                    </td>
                                    <td className="p-4 text-right">
                                        <div className="inline-block w-8 h-8 border-2 border-black"></div>
                                    </td>
                                </tr>
                            );
                        })}
                    </tbody>
                </table>

                <div className="mt-10 pt-10 border-t-2 border-dashed border-gray-400">
                    <p className="text-[10px] text-gray-400 italic text-center">
                        Este documento es para control logístico del chofer. Los conduces oficiales deben ser firmados por cada centro.
                    </p>
                </div>
            </div>

            <div className="mt-6 flex justify-center no-print">
                <button 
                    onClick={() => window.print()} 
                    className="bg-black text-white px-8 py-3 rounded-full font-bold shadow-lg"
                >
                    🖨️ IMPRIMIR HOJA DE RUTA
                </button>
            </div>

            <style>{`
                @media print { .no-print { display: none; } }
            `}</style>
        </div>
    );
}