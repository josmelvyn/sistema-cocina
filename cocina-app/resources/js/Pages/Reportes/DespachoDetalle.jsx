import React from 'react';

export default function DespachoDetalle({ plato, estudiantes, insumos, fecha }) {
    return (
        <div className="p-10 bg-white min-h-screen text-black" id="printable">
            <div className="border-b-2 border-black pb-4 mb-6 flex justify-between items-end">
                <div>
                    <h1 className="text-2xl font-black uppercase">Orden de Salida de Almacén</h1>
                    <p className="text-sm">Cocina Industrial - Sistema de Gestión</p>
                </div>
                <div className="text-right">
                    <p className="font-bold">Fecha: {fecha}</p>
                    <p className="text-xs italic">Generado automáticamente</p>
                </div>
            </div>

            <div className="mb-8 grid grid-cols-2 gap-4 bg-gray-100 p-4 rounded-lg">
                <div>
                    <p className="text-xs uppercase font-bold text-gray-500">Menú a Preparar:</p>
                    <p className="text-lg font-black">{plato}</p>
                </div>
                <div>
                    <p className="text-xs uppercase font-bold text-gray-500">Cantidad de Estudiantes:</p>
                    <p className="text-lg font-black">{estudiantes} Raciones</p>
                </div>
            </div>

            <table className="w-full border-collapse">
                <thead>
                    <tr className="bg-black text-white text-xs uppercase">
                        <th className="p-3 text-left">Insumo / Ingrediente</th>
                        <th className="p-3 text-right">Cantidad Total a Despachar</th>
                        <th className="p-3 text-center">Unidad</th>
                        <th className="p-3 text-center border-l border-white">Entregado [ ]</th>
                    </tr>
                </thead>
                <tbody>
                    {insumos.map((item, index) => (
                        <tr key={index} className="border-b border-gray-300">
                            <td className="p-3 font-bold uppercase text-sm">{item.insumo}</td>
                            <td className="p-3 text-right text-lg font-black">{item.cantidad_total.toFixed(2)}</td>
                            <td className="p-3 text-center text-sm">{item.unidad}</td>
                            <td className="p-3 border-l border-gray-200"></td>
                        </tr>
                    ))}
                </tbody>
            </table>

            <div className="mt-20 grid grid-cols-2 gap-20 text-center">
                <div className="border-t border-black pt-2">
                    <p className="text-xs font-bold uppercase">Entregado por (Almacén)</p>
                </div>
                <div className="border-t border-black pt-2">
                    <p className="text-xs font-bold uppercase">Recibido por (Cocina)</p>
                </div>
            </div>

            <div className="mt-10 no-print">
                <button 
                    onClick={() => window.print()} 
                    className="bg-blue-600 text-white px-6 py-2 rounded font-bold uppercase text-xs"
                >
                    Imprimir para Almacén
                </button>
            </div>
            
            <style dangerouslySetInnerHTML={{__html: `
                @media print {
                    .no-print { display: none; }
                    body { background: white; }
                }
            `}} />
        </div>
    );
}