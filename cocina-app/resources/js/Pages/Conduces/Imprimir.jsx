import React, { useEffect } from 'react';
import { Head } from '@inertiajs/react';

export default function Imprimir({ conduce }) {
    // Disparar el diálogo de impresión al cargar
    useEffect(() => {
        window.print();
    }, []);

    return (
        <div className="p-10 bg-white min-h-screen text-black font-serif">
            <Head title={`Conduce ${conduce.numero_conduce}`} />
            
            <div className="border-2 border-black p-6">
                <div className="flex justify-between items-start border-b-2 border-black pb-4 mb-6">
                    <div>
                        <h1 className="text-3xl font-bold uppercase">SISTEMA DE COCINA</h1>
                        <p className="text-sm">Raciones Escolares - Despacho Diario</p>
                    </div>
                    <div className="text-right">
                        <h2 className="text-xl font-bold">CONDUCE NO.</h2>
                        <p className="text-2xl font-mono text-red-600">{conduce.numero_conduce}</p>
                    </div>
                </div>

                <div className="grid grid-cols-2 gap-8 mb-8">
                    <div>
                        <p className="font-bold uppercase text-xs text-gray-500">ENTREGAR A:</p>
                        <p className="text-xl font-bold">{conduce.escuela?.nombre}</p>
                        <p>Código MINERD: {conduce.escuela?.codigo_minerd}</p>
                        <p>Ruta: {conduce.escuela?.ruta?.nombre}</p>
                    </div>
                    <div className="text-right">
                        <p className="font-bold uppercase text-xs text-gray-500">FECHA DE DESPACHO:</p>
                        <p className="text-xl font-bold">{conduce.fecha_despacho}</p>
                    </div>
                </div>

                <table className="w-full border-collapse border border-black mb-10">
                    <thead>
                        <tr className="bg-gray-100">
                            <th className="border border-black p-3 text-left">DESCRIPCIÓN</th>
                            <th className="border border-black p-3 text-right">CANTIDAD</th>
                        </tr>
                    </thead>
                    <tbody>
                        <tr>
                            <td className="border border-black p-3 text-lg">RACIONES ALIMENTICIAS (ALMUERZO/DESAYUNO)</td>
                            <td className="border border-black p-3 text-right text-2xl font-bold">{conduce.cantidad_entregada}</td>
                        </tr>
                    </tbody>
                </table>

                <div className="grid grid-cols-2 gap-20 mt-20">
                    <div className="border-t border-black text-center pt-2">
                        <p className="font-bold uppercase text-xs">Entregado por (Chofer)</p>
                    </div>
                    <div className="border-t border-black text-center pt-2">
                        <p className="font-bold uppercase text-xs">Recibido por (Escuela)</p>
                    </div>
                </div>
            </div>
            
            <button 
                onClick={() => window.print()} 
                className="mt-6 bg-blue-600 text-white px-4 py-2 rounded no-print"
            >
                Re-Imprimir
            </button>

            <style>{`
                @media print {
                    .no-print { display: none; }
                    body { background: white; }
                }
            `}</style>
        </div>
    );
}