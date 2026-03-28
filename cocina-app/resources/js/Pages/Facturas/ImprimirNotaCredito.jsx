import React, { useEffect } from "react";
import { Head } from "@inertiajs/react";

export default function ImprimirNotaCredito({ factura }) {
    useEffect(() => {
        setTimeout(() => window.print(), 500);
    }, []);

    // FIX: Si es factura global, los datos vienen de la factura, no del conduce
    const clienteNombre = factura.nombre_cliente || "INSTITUTO NACIONAL DE BIENESTAR ESTUDIANTIL";
    const clienteRnc = factura.rnc_cliente || "401-50561-4";

    return (
        <div className="bg-white min-h-screen text-black p-0 uppercase" style={{ fontFamily: 'Arial, sans-serif' }}>
            <Head title={`Nota de Crédito ${factura.ncf_nota_credito}`} />

            <div className="max-w-[850px] mx-auto p-12 pt-16 print:p-8">
                {/* ENCABEZADO */}
                <div className="flex justify-between items-start mb-6">
                    <div className="w-2/3">
                        <h1 className="text-lg font-bold">YDELSA MARIANA COLON BAUTISTA</h1>
                        <p className="text-[10px]">RNC: 058-0079732-7</p>
                        <p className="text-[11px] font-bold mt-4">NOTA DE CRÉDITO</p>
                    </div>
                    <div className="text-right">
                        <p className="text-[11px] font-bold">NCF: <span className="ml-8">{factura.ncf_nota_credito}</span></p>
                        <p className="text-[10px]">NCF MODIFICADO: {factura.ncf}</p>
                        <p className="text-[10px]">FECHA: {new Date().toLocaleDateString('es-DO')}</p>
                    </div>
                </div>

                {/* DATOS DEL CLIENTE - USAMOS VARIABLES FIX */}
                <div className="text-[11px] space-y-2 mb-6 border-t border-black pt-4">
                    <p className="border-b border-black pb-1">
                        <span className="font-bold inline-block w-32">RNC CLIENTE:</span> {clienteRnc}
                    </p>
                    <p className="border-b border-black pb-1">
                        <span className="font-bold inline-block w-48">NOMBRE O RAZON SOCIAL:</span> {clienteNombre}
                    </p>
                </div>

                {/* MOTIVO DE ANULACIÓN */}
                <div className="text-[11px] border-b border-dotted border-black py-2">
                    <span className="font-bold">MOTIVO:</span> {factura.motivo_anulacion || 'ERROR EN FACTURACIÓN'}
                </div>

                {/* TABLA DE VALORES */}
                <div className="mt-10 border-t border-b border-dotted border-black py-1 flex justify-between font-bold text-[10px]">
                    <span>CONCEPTO</span>
                    <span>VALOR RD$</span>
                </div>
                <div className="flex justify-between py-4 text-[11px] font-bold italic">
                    <span>ANULACIÓN DE FACTURA {factura.ncf} / PERIODO: {factura.periodo}</span>
                    <span>{Number(factura.monto_total).toLocaleString(undefined, {minimumFractionDigits: 2})}</span>
                </div>

                <div className="flex justify-end mt-10">
                    <div className="w-1/3 text-[11px] font-bold space-y-1">
                        <div className="flex justify-between">
                            <span>TOTAL ANULADO:</span>
                            <span>RD$ {Number(factura.monto_total).toLocaleString(undefined, {minimumFractionDigits: 2})}</span>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}