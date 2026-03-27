import React, { useEffect } from "react";
import { Head } from "@inertiajs/react";

export default function ImprimirNotaCredito({ factura }) {
    useEffect(() => {
        const timer = setTimeout(() => window.print(), 1000);
        return () => clearTimeout(timer);
    }, []);

    const { conduce } = factura;
    const fecha = new Date(factura.updated_at); // Usamos la fecha de anulación

    return (
        <div className="bg-white min-h-screen text-black p-0 print:p-0" style={{ fontFamily: 'Arial, sans-serif' }}>
            <Head title={`Nota de Crédito ${factura.ncf_nota_credito}`} />

            <div className="max-w-[850px] mx-auto p-12 pt-16 print:p-8">
                
                {/* ENCABEZADO NOTA DE CRÉDITO */}
                <div className="flex justify-between items-start mb-6 uppercase">
                    <div className="w-2/3">
                        <h1 className="text-xl font-bold">YDELSA MARIANA COLON BAUTISTA</h1>
                        <p className="text-[10px] leading-tight text-gray-600">AV. HERMANOS MORENO MARTINEZ ESQ. TRINITARIA, LAS CEJAS, SFM</p>
                        <p className="text-[10px] text-gray-600">RNC: 058-0079732-7 | TEL: 809-345-4022</p>
                        <div className="mt-4">
                            <p className="text-[11px] font-bold">FECHA ANULACIÓN: {fecha.toLocaleDateString('es-DO')}</p>
                        </div>
                    </div>
                    <div className="text-right border-2 border-red-600 p-3 bg-red-50">
                        <h2 className="text-[13px] font-black text-red-700 underline italic">NOTA DE CRÉDITO</h2>
                        <p className="text-[14px] font-black mt-1 text-red-600">NCF: {factura.ncf_nota_credito}</p>
                        <p className="text-[9px] font-bold text-red-800">MODIFICA A: {factura.ncf}</p>
                    </div>
                </div>

                {/* DATOS DEL CLIENTE */}
                <div className="text-[11px] uppercase space-y-3 mb-8 border-b-2 border-black pb-4">
                    <p className="flex items-end">
                        <span className="font-bold w-32">RNC CLIENTE:</span> 
                        <span className="flex-1 ml-2">{conduce.escuela?.rnc || '000-00000-0'}</span>
                    </p>
                    <p className="flex items-end">
                        <span className="font-bold w-48">NOMBRE O RAZÓN SOCIAL:</span> 
                        <span className="flex-1 ml-2">{conduce.escuela?.nombre}</span>
                    </p>
                </div>

                {/* MOTIVO LEGAL DE ANULACIÓN */}
                <div className="bg-gray-100 p-4 rounded-xl border border-gray-300 mb-8 uppercase">
                    <p className="text-[10px] font-black text-gray-500 mb-1">CONCEPTO O MOTIVO DE ANULACIÓN:</p>
                    <p className="text-[11px] font-bold italic text-red-700">
                        "{factura.motivo_anulacion || 'ERROR EN FACTURACIÓN ORIGINAL'}"
                    </p>
                </div>

                {/* TABLA DE DETALLE (TOTALES NEGATIVOS O DE REVERSO) */}
                <div className="border-t-2 border-b-2 border-dotted border-black py-1 flex justify-between font-bold text-[10px] uppercase mb-2">
                    <span className="w-1/2">REFERENCIA ORIGINAL</span>
                    <span className="w-28 text-right">VALOR ANULADO</span>
                </div>

                <div className="flex min-h-[100px] text-[11px] uppercase border-b border-dotted border-black pb-4 mb-6">
                    <div className="w-1/2 font-bold leading-tight">
                        ANULACIÓN TOTAL DE FACTURA {factura.ncf}<br/>
                        <span className="text-[9px] font-normal not-italic text-gray-500">
                            VINCULADA AL CONDUCE: {conduce.numero_conduce}
                        </span>
                    </div>
                    <div className="w-full text-right font-black text-lg">
                        RD$ {Number(factura.monto_total).toLocaleString('en-US', { minimumFractionDigits: 2 })}
                    </div>
                </div>

                {/* FIRMA Y SELLO */}
                <div className="mt-32 flex flex-col items-center">
                    <div className="text-center w-64">
                        <div className="border-t-2 border-black mb-2"></div>
                        <p className="text-[10px] font-bold uppercase">FIRMA AUTORIZADA Y SELLO</p>
                        <p className="text-[8px] text-gray-400 mt-1 italic uppercase">Original Cliente - Copia Contabilidad</p>
                    </div>
                </div>

                {/* AVISO DGII */}
                <div className="mt-16 text-[8px] text-gray-400 uppercase italic text-center border-t pt-4">
                    Este documento es una Nota de Crédito (Tipo 04) emitida según las disposiciones del Reglamento 254-06 para la modificación de comprobantes fiscales.
                </div>
            </div>

            <style>{`
                @media print {
                    .no-print { display: none !important; }
                    body { -webkit-print-color-adjust: exact; }
                }
            `}</style>
        </div>
    );
}