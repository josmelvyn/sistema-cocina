import React, { useEffect } from "react";
import { Head } from "@inertiajs/react";

export default function FacturaGlobalImprimir({ datos_inabie, ncf_data }) {
    useEffect(() => { 
        if (datos_inabie) setTimeout(() => window.print(), 500); 
    }, [datos_inabie]);

    // Función segura para formatear números
    const fN = (n) => Number(n || 0).toLocaleString('en-US', { minimumFractionDigits: 2 });

    return (
        <div className="bg-white min-h-screen text-black p-0 uppercase select-none" style={{ fontFamily: 'Arial, sans-serif' }}>
            <Head title={`Factura ${ncf_data?.ncf}`} />
            <div className="max-w-[850px] mx-auto p-12 pt-16 print:p-8">
                
                {/* CABECERA */}
                <div className="flex justify-between items-start mb-6">
                    <div className="w-2/3 leading-tight">
                        <h1 className="text-lg font-bold">YDELSA MARIANA COLON BAUTISTA</h1>
                        <p className="text-[10px] leading-tight">
                            AV. HERMANOS MORENO MARTINEZ ESQ. TRINITARIA, LAS CEJAS, SFM<br/>
                            Tel: 809-345-4022 / 809-588-4407, E-Mail: ydelsa3@hotmail.com</p>
                        
                        <p className="text-[11px] font-bold mt-1">RNC: 058-0079732-7</p>
                        <p className="text-[11px] font-bold">FECHA: {new Date().toLocaleDateString('es-DO')}</p>
                    </div>
                    <div className="text-right uppercase">
                        <h2 className="text-[11px] font-bold">FACTURA GUBERNAMENTAL</h2>
                        <p className="text-[11px] font-bold">NCF: <span className="ml-8">{ncf_data?.ncf}</span></p>
                        <p className="text-[11px] font-bold">VALIDO HASTA: {ncf_data?.vencimiento}</p>
                    </div>
                </div>

                {/* DATOS CLIENTE */}
                <div className="text-[11px] space-y-2 mb-6 border-t-2 border-black pt-4">
                    <p><span className="font-bold inline-block w-32">RNC CLIENTE:</span> {datos_inabie?.rnc}</p>
                    <p className="border-b border-black pb-1 uppercase">
                        <span className="font-bold inline-block w-48">NOMBRE O RAZON SOCIAL:</span> {datos_inabie?.nombre}
                    </p>
                </div>

                {/* PERIODO Y CONDUCES */}
                <div className="border-b border-dotted border-black py-1 flex text-[11px]">
                    <span className="font-bold">PERIODO DE FACTURA:</span> 
                    <span className="underline ml-4 font-bold italic">{datos_inabie?.periodo_full}</span>
                </div>
                <div className="border-b border-dotted border-black py-1 flex text-[11px]">
                    <span className="font-bold uppercase">CANTIDAD DE CONDUCES:</span> 
                    <span className="ml-4 font-bold">{datos_inabie?.cant_conduces || '00'}</span>
                    <span className="font-bold ml-12 uppercase text-[10px]">DEL NO.</span> 
                    <span className="ml-4 font-bold">{datos_inabie?.conduce_desde || '---'}</span>
                    <span className="font-bold ml-8 uppercase text-[10px]">AL</span> 
                    <span className="ml-4 font-bold">{datos_inabie?.conduce_hasta || '---'}</span>
                </div>

                {/* TABLA */}
                <div className="border-t border-b border-dotted border-black py-1 flex justify-between font-bold text-[10px] mt-4 mb-2">
                    <span className="w-1/2">PRODUCTO</span>
                    <span className="w-1/6 text-right">CANTIDAD</span>
                    <span className="w-1/6 text-right">PRECIO S/ITBIS</span>
                    <span className="w-1/6 text-right">VALOR RD$</span>
                </div>

                <div className="flex min-h-[200px] text-[11px] border-b border-dotted border-black pb-4 pt-2">
                    <span className="w-1/2 font-bold italic">RACIONES ALIMENTICIA CON POSTRE</span>
                    <span className="w-1/6 text-right font-bold">{Number(datos_inabie?.total_raciones || 0).toLocaleString()}</span>
                    <span className="w-1/6 text-right font-bold">{fN(datos_inabie?.subtotal / (datos_inabie?.total_raciones || 1))}</span>
                    <span className="w-1/6 text-right font-bold">{fN(datos_inabie?.subtotal)}</span>
                </div>

                {/* TOTALES */}
                <div className="flex justify-end mt-4">
                    <div className="w-1/3 text-[11px] font-bold space-y-1">
                        <div className="flex justify-between border-b border-dotted border-black pb-1">
                            <span>SUB-TOTAL:</span><span>{fN(datos_inabie?.subtotal)}</span>
                        </div>
                        <div className="flex justify-between text-sm pt-1 border-t border-black font-black italic">
                            <span>ITBIS:</span><span>{fN(datos_inabie?.itbis)}</span>
                        </div>
                        <div className="flex justify-between text-sm pt-1 border-t border-black font-black italic">
                            <span>TOTAL:</span><span>{fN(datos_inabie?.total)}</span>
                        </div>
                    </div>
                </div>

                <div className="mt-32 flex flex-col items-end pr-10">
                    <div className="text-center w-64 uppercase">
                        <p className="text-[10px] font-bold mb-14">FIRMA Y SELLO DE LA EMPRESA</p>
                    </div>
                </div>
            </div>
        </div>
    );
}