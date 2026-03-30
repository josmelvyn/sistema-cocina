import React, { useEffect } from "react";
import { Head, usePage } from "@inertiajs/react";

export default function Imprimir({ conduce }) {
    const { empresa } = usePage().props.auth;
    useEffect(() => {
        const timer = setTimeout(() => window.print(), 500);
        return () => clearTimeout(timer);
    }, []);

    return (
        <div className="bg-white min-h-screen text-black font-serif p-0 print:p-0">
            <Head title={`Conduce ${conduce.numero_conduce}`} />

            <div className="max-w-[850px] mx-auto p-10 pt-16 print:p-6 print:pt-10">
                
                {/* ENCABEZADO CENTRAL */}
                <div className="text-center mb-10 uppercase">
                    <h1 className="text-xl font-bold">{empresa?.nombre_empresa || 'YDELSA MARIANA COLON BAUTISTA'}</h1>
                    <p className="text-[10px] tracking-tight">{empresa?.direccion || 'AV. HERMANOS MORENO MARTINEZ ESQ. TRINITARIA, LAS CEJAS, SAN FCO. DE MACORIS'}</p>
                    <p className="text-[10px]">Tel.: {empresa?.telefono || '809-345-4022 / 809-588-4407'}. E-mail: {empresa?.email || 'ydelsa3@hotmail.com'}</p>
                    <p className="text-[11px] font-bold mt-1">RNC: {empresa?.rnc || '058-0079732-7'}</p>
                </div>

               {/* BLOQUE DE DATOS SUPERIOR (DINÁMICO) */}
                <div className="flex justify-between text-[11px] uppercase leading-snug mb-6">
                    <div className="w-[60%] space-y-0.5">
                        <p><span className="font-bold inline-block w-44">NOMBRE CENTRO EDUCATIVO:</span> {conduce.escuela?.nombre}</p>
                        {/* Campo Director */}
                        <p><span className="font-bold inline-block w-44">DIRECTOR DEL CENTRO:</span> {conduce.escuela?.director || ""}</p>
                        {/* Campo Dirección */}
                        <p><span className="font-bold inline-block w-44">DIRECCION:</span> {conduce.escuela?.direccion}</p>
                        {/* Campo Municipio */}
                        <p><span className="font-bold inline-block w-44">PROVINCIA O MUNICIPIO:</span> {conduce.escuela?.municipio || "SAN FRANCISCO DE MACORIS"}</p>
                        <p className="font-bold mt-4">RUTA: {conduce.escuela?.ruta?.nombre}</p>
                    </div>
                    <div className="w-[35%] space-y-0.5">
                        <p><span className="font-bold inline-block w-28">CONDUCE NO.:</span> {conduce.numero_conduce}</p>
                        <p><span className="font-bold inline-block w-28">FECHA:</span> {conduce.fecha_despacho}</p>
                        <p><span className="font-bold inline-block w-28">CODIGO CENTRO:</span> {conduce.escuela?.codigo_minerd}</p>
                        {/* Campo Teléfono */}
                        <p><span className="font-bold inline-block w-28">TELEFONO:</span> {conduce.escuela?.telefono || ""}</p>
                        {/* Campo Distrito */}
                        <p className="mt-4"><span className="font-bold inline-block w-28">REGIONAL/DISTRITO:</span> {conduce.escuela?.distrito || ""}</p>
                    </div>
                </div>
                {/* TABLA DE PRODUCTOS (LÍNEAS PUNTEADAS COMO EN LA FOTO) */}
                <div className="border-t border-dotted border-black">
                    <div className="flex justify-between font-bold text-[11px] py-1 border-b border-dotted border-black uppercase">
                        <span className="pl-14">DESCRIPCION DEL PRODUCTO</span>
                        <span className="pr-2">CANTIDAD</span>
                    </div>

                    <div className="flex min-h-[220px] relative">
                        {/* TEXTO VERTICAL IZQUIERDO */}
                        <div className="w-12 border-r border-black flex items-center justify-center">
                            <span className="rotate-[-90deg] whitespace-nowrap font-bold text-[9px] uppercase tracking-tighter text-center leading-none">
                                RACIONES <br/> ALIMENTICIA <br/> CON POSTRE
                            </span>
                        </div>

                        {/* CONTENIDO DEL PLATO */}
                        <div className="flex-1 p-4 text-[12px] uppercase leading-relaxed font-medium italic">
                            {conduce.plato ? (
                                <div className="whitespace-pre-line">
                                    {conduce.plato.nombre}
                                    {conduce.plato.descripcion && `\n${conduce.plato.descripcion}`}
                                </div>
                            ) : (
                                <p>{conduce.descripcion || "RACIONES ALIMENTICIAS DEL DÍA"}</p>
                            )}
                        </div>

                        {/* CANTIDAD A LA DERECHA */}
                        <div className="w-16 text-right pt-4 pr-2 font-bold text-[13px]">
                            {conduce.cantidad_entregada}
                        </div>
                    </div>
                </div>

                {/* OBSERVACIONES */}
                <div className="mt-4 text-[11px] font-bold uppercase flex items-baseline">
                    <span className="whitespace-nowrap">OBSERVACIONES:</span>
                    <div className="flex-1 border-b border-black ml-1"> {conduce.observaciones}</div>
                </div>

                 {/* SECCIÓN DE FIRMAS Y SELLOS (RÉPLICA FIEL A LA FOTO) */}
                <div className="grid grid-cols-2 gap-20 mt-32">
                    
                    {/* LADO DEL SUPLIDOR (SIN LÍNEA) */}
                    <div className="flex flex-col items-center justify-end pb-2">
                        <div className="text-center">
                            {/* Espacio vacío para el sello circular de la foto */}
                            <p className="text-[11px] font-bold uppercase tracking-tight">
                                FIRMA Y SELLO DEL SUPLIDOR
                            </p>
                        </div>
                    </div>
                    {/* Lado Recibido (Cuadro de texto) */}
                    <div className="text-[11px] uppercase space-y-4 border-l border-gray-300 pl-10">
                        <p className="font-bold underline mb-4">RECIBIDO POR:</p>
                        <p className="flex">NOMBRE: <span className="flex-1 border-b border-gray-400 ml-1"></span></p>
                        <p className="flex">FIRMA: <span className="flex-1 border-b border-gray-400 ml-1"></span></p>
                        <p className="flex">FECHA RECEPCION: <span className="flex-1 border-b border-gray-400 ml-1"></span></p>
                        <p className="flex">HORA DE RECEPCION: <span className="flex-1 border-b border-gray-400 ml-1"></span></p>
                        <p className="font-bold pt-4">SELLO DEL CENTRO</p>
                    </div>
                </div>
            </div>

            {/* Estilos para impresión limpia */}
            <style>{`
                @media print {
                    .no-print { display: none !important; }
                    body { -webkit-print-color-adjust: exact; margin: 0; }
                    @page { margin: 0; size: letter; }
                }
                * { font-family: "Arial", Times, sans-serif; }
            `}</style>

            <button onClick={() => window.print()} className="fixed bottom-8 right-8 bg-black text-white p-4 rounded-full no-print shadow-xl">
                🖨️
            </button>
        </div>
    );
}