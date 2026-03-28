import React, { useEffect } from "react";
import { Head } from "@inertiajs/react";

export default function Imprimir({ factura }) {
    useEffect(() => {
        const timer = setTimeout(() => window.print(), 500);
        return () => clearTimeout(timer);
    }, []);

    const { conduce } = factura;
    const subtotal = Number(conduce.cantidad_entregada * conduce.precio_racion);
    const itbis = Number(factura.itbis);
    const total = Number(factura.monto_total);

    return (
        <div className="bg-white min-h-screen text-black p-0 print:p-0" style={{ fontFamily: 'Arial, sans-serif' }}>
            <Head title={`Factura ${factura.ncf}`} />

            <div className="max-w-[850px] mx-auto p-12 pt-16 print:p-8">
                
                {/* ENCABEZADO Y DATOS NCF */}
                <div className="flex justify-between items-start mb-6">
                    <div className="w-2/3 uppercase">
                        <h1 className="text-lg font-bold">YDELSA MARIANA COLON BAUTISTA</h1>
                        <p className="text-[10px] leading-tight">
                            AV. HERMANOS MORENO MARTINEZ ESQ. TRINITARIA, LAS CEJAS, SFM<br/>
                            Tel: 809-345-4022 / 809-588-4407, E-Mail: ydelsa3@hotmail.com
                        </p>
                        <p className="text-[11px] font-bold mt-1">RNC: 058-0079732-7</p>
                        <p className="text-[11px] font-bold">FECHA: {new Date(factura.created_at).toLocaleDateString('es-DO')}</p>
                    </div>
                    <div className="text-right uppercase">
                        <h2 className="text-[11px] font-bold">FACTURA GUBERNAMENTAL</h2>
                        <p className="text-[11px] font-bold">NCF: <span className="ml-8">{factura.ncf}</span></p>
                        <p className="text-[11px] font-bold">VALIDO HASTA: {factura.fecha_vencimiento_ncf}</p>
                    </div>
                </div>

                {/* DATOS DEL CLIENTE (LÍNEAS LARGAS) */}
                <div className="text-[11px] uppercase space-y-2 mb-6">
                    <p className="border-b border-black pb-1">
                        <span className="font-bold inline-block w-32">RNC CLIENTE:</span> {conduce.escuela?.rnc || '401-50561-4'}
                    </p>
                    <p className="border-b border-black pb-1">
                        <span className="font-bold inline-block w-48 text-nowrap">NOMBRE O RAZON SOCIAL:</span> {'INSTITUTO NACIONAL DE BIENESTAR ESTUDIANTIL'}
                    </p>
                </div>

                {/* PERIODO Y CANTIDAD (LÍNEAS PUNTEADAS) */}
                <div className="text-[11px] uppercase mb-4 border-b border-dotted border-black pb-1">
                    <span className="font-bold">Periodo de factura:</span> <span className="underline ml-4">{factura.periodo || 'Del día'} / {new Date().toLocaleString('es-ES', { month: 'long' })} {new Date().getFullYear()}</span>
                </div>
                <div className="text-[11px] uppercase mb-4 border-b border-dotted border-black pb-1">
                    <span className="font-bold">Cantidad de Conduces:</span> <span className="ml-4">01</span> 
                    <span className="font-bold ml-12">del No.</span> <span className="ml-4">{conduce.numero_conduce}</span> 
                    <span className="font-bold ml-8">al</span> <span className="ml-4">{conduce.numero_conduce}</span>
                </div>

                {/* CABECERA DE TABLA PUNTEADA */}
                <div className="border-t border-b border-dotted border-black py-1 flex justify-between font-bold text-[10px] uppercase mb-2">
                    <span className="w-1/2">PRODUCTO</span>
                    <span className="w-1/6 text-right">CANTIDAD</span>
                    <span className="w-1/6 text-right">PRECIO S/ITBIS</span>
                    <span className="w-1/6 text-right">VALOR RD$</span>
                </div>

                {/* CUERPO DE LA FACTURA */}
                <div className="flex min-h-[150px] text-[11px] uppercase border-b border-dotted border-black pb-4">
                    <div className="w-1/2 font-bold italic">
                        {"RACIONES ALIMENTICIA CON POSTRE"}
                    </div>
                    <div className="w-1/6 text-right font-bold">
                        {conduce.cantidad_entregada.toLocaleString()}
                    </div>
                    <div className="w-1/6 text-right font-bold">
                        {Number(conduce.precio_racion).toFixed(2)}
                    </div>
                    <div className="w-1/6 text-right font-bold">
                        {subtotal.toLocaleString(undefined, {minimumFractionDigits: 2})}
                    </div>
                </div>

                {/* TOTALES ALINEADOS A LA DERECHA */}
                <div className="flex justify-end mt-4">
                    <div className="w-1/3 text-[11px] font-bold uppercase space-y-1">
                        <div className="flex justify-between border-b border-dotted border-black pb-1">
                            <span>SUB-TOTAL:</span>
                            <span>{subtotal.toLocaleString(undefined, {minimumFractionDigits: 2})}</span>
                        </div>
                        <div className="flex justify-between border-b border-dotted border-black pb-1">
                            <span>ITBIS:</span>
                            <span>{itbis.toLocaleString(undefined, {minimumFractionDigits: 2})}</span>
                        </div>
                        <div className="flex justify-between text-sm pt-1">
                            <span>TOTAL:</span>
                            <span>{total.toLocaleString(undefined, {minimumFractionDigits: 2})}</span>
                        </div>
                    </div>
                </div>

                {/* FIRMA Y SELLO ABAJO A LA DERECHA */}
                <div className="mt-20 flex flex-col items-end pr-10">
                    <div className="text-center">
                        <p className="text-[10px] font-bold uppercase mb-8">FIRMA Y SELLO DE LA EMPRESA</p>
                        <div className="border-t border-black w-48 mx-auto"></div>
                        {/* Aquí iría la imagen de tu firma si la escaneas */}
                    </div>
                </div>

            </div>

            <style>{`
                @media print {
                    .no-print { display: none !important; }
                    body { -webkit-print-color-adjust: exact; }
                    @page { margin: 0; size: letter; }
                }
            `}</style>
        </div>
    );
}