import React, { useState, useEffect } from "react";
import AuthenticatedLayout from "@/Layouts/AuthenticatedLayout";
import MobileLayout from "@/Layouts/MobileLayout";
import { Head, useForm, usePage } from "@inertiajs/react";
import MapComponent from "@/Components/MapComponent";

export default function Index({ auth, escuelas, rutas }) {
    const { isMobile } = usePage().props;
    const [mostrarForm, setMostrarForm] = useState(false);
    // 1. Configuración del formulario con los campos nuevos
    const { data, setData, post, processing, errors, reset } = useForm({
        nombre: "",
        ruta_id: "",
        codigo_minerd: "",
        raciones_estandar: "",
        director: "", // Nuevo
        direccion: "", // Nuevo
        municipio: "", // Nuevo
        telefono: "", // Nuevo
        distrito: "", // Nuevo
        rnc: "",
        latitud: "",
        longitud: "",
    });

    const submit = (e) => {
        e.preventDefault();
        post(route("escuelas.store"), {
            onSuccess: () => {
                alert("¡Escuela guardada con éxito!");
                reset();
            },
        });
    };

    if (isMobile) {
        return (
            <MobileLayout title="Directorio de Escuelas" headerTitle="Escuelas" headerSubtitle="Centros Educativos">
                <div className="p-4 space-y-6">
                    {/* ACCIONES SUPERIORES */}
                    <div className="flex justify-between items-center bg-indigo-600 rounded-3xl p-5 shadow-lg shadow-indigo-500/30 text-white">
                        <div className="flex items-center gap-3">
                            <div className="text-3xl">🎒</div>
                            <div>
                                <p className="text-2xl font-black leading-none">{escuelas.length}</p>
                                <p className="text-[10px] uppercase font-bold text-indigo-200 tracking-widest mt-0.5">Cobertura Total</p>
                            </div>
                        </div>
                        <button onClick={() => setMostrarForm(!mostrarForm)} className={`bg-white text-indigo-600 px-4 py-3 rounded-xl font-black text-[10px] uppercase shadow-sm active:scale-95 transition-all ${mostrarForm ? 'opacity-80' : ''}`}>
                            {mostrarForm ? "Cerrar" : "+ Registrar"}
                        </button>
                    </div>

                    {/* FORMULARIO DESPLEGABLE */}
                    {mostrarForm && (
                        <div className="bg-white rounded-3xl p-5 shadow-sm border border-slate-100 animate-in fade-in slide-in-from-top-4">
                            <h3 className="text-sm font-black text-slate-800 uppercase mb-4 flex items-center gap-2">
                                <span>🏫</span> Nuevo Registro
                            </h3>
                            <form onSubmit={submit} className="space-y-4">
                                <div>
                                    <label className="text-[10px] font-bold text-slate-400 uppercase ml-1">Nombre de Escuela</label>
                                    <input type="text" value={data.nombre} onChange={e => setData("nombre", e.target.value)} className="w-full bg-slate-50 border-slate-100 rounded-xl mt-1 h-12 text-sm font-bold text-slate-700" required />
                                </div>
                                <div className="grid grid-cols-2 gap-3">
                                    <div>
                                        <label className="text-[10px] font-bold text-slate-400 uppercase ml-1">Código</label>
                                        <input type="text" value={data.codigo_minerd} onChange={e => setData("codigo_minerd", e.target.value)} className="w-full bg-slate-50 border-slate-100 rounded-xl mt-1 h-12 text-sm text-center font-mono font-bold" required />
                                    </div>
                                    <div>
                                        <label className="text-[10px] font-bold text-slate-400 uppercase ml-1">RNC</label>
                                        <input type="text" value={data.rnc} onChange={e => setData("rnc", e.target.value)} className="w-full bg-slate-50 border-slate-100 rounded-xl mt-1 h-12 text-sm text-center font-mono font-bold" />
                                    </div>
                                </div>
                                <div className="grid grid-cols-2 gap-3">
                                    <div>
                                        <label className="text-[10px] font-bold text-slate-400 uppercase ml-1">Ruta</label>
                                        <select value={data.ruta_id} onChange={e => setData("ruta_id", e.target.value)} className="w-full bg-slate-50 border-slate-100 rounded-xl mt-1 h-12 text-xs font-bold text-slate-600" required>
                                            <option value="">Selección</option>
                                            {rutas.map(r => <option key={r.id} value={r.id}>{r.nombre}</option>)}
                                        </select>
                                    </div>
                                    <div>
                                        <label className="text-[10px] font-bold text-slate-400 uppercase ml-1">Raciones</label>
                                        <input type="number" value={data.raciones_estandar} onChange={e => setData("raciones_estandar", e.target.value)} className="w-full bg-slate-50 border-slate-100 rounded-xl mt-1 h-12 text-center text-lg font-black text-indigo-600" required />
                                    </div>
                                </div>
                                <div>
                                    <label className="text-[10px] font-bold text-slate-400 uppercase ml-1">Director(a)</label>
                                    <input type="text" value={data.director} onChange={e => setData("director", e.target.value)} className="w-full bg-slate-50 border-slate-100 rounded-xl mt-1 h-12 text-sm font-medium" />
                                </div>
                                <div className="grid grid-cols-2 gap-3">
                                    <div>
                                        <label className="text-[10px] font-bold text-slate-400 uppercase ml-1">Teléfono</label>
                                        <input type="text" value={data.telefono} onChange={e => setData("telefono", e.target.value)} className="w-full bg-slate-50 border-slate-100 rounded-xl mt-1 h-12 text-sm text-center font-mono" />
                                    </div>
                                    <div>
                                        <label className="text-[10px] font-bold text-slate-400 uppercase ml-1">Distrito</label>
                                        <input type="text" value={data.distrito} onChange={e => setData("distrito", e.target.value)} className="w-full bg-slate-50 border-slate-100 rounded-xl mt-1 h-12 text-sm text-center" />
                                    </div>
                                </div>
                                <div>
                                    <label className="text-[10px] font-bold text-slate-400 uppercase ml-1">Dirección</label>
                                    <input type="text" value={data.direccion} onChange={e => setData("direccion", e.target.value)} className="w-full bg-slate-50 border-slate-100 rounded-xl mt-1 h-12 text-sm" />
                                </div>
                                <div className="p-1">
                                    <label className="text-[10px] font-bold text-slate-400 uppercase ml-1">Ubicación en Mapa</label>
                                    <MapComponent 
                                        escuelas={escuelas} 
                                        selectedLocation={data.latitud ? { lat: parseFloat(data.latitud), lng: parseFloat(data.longitud) } : null}
                                        onSelectLocation={(latlng) => {
                                            setData(prev => ({ ...prev, latitud: latlng.lat.toFixed(6), longitud: latlng.lng.toFixed(6) }));
                                        }}
                                    />
                                    <div className="grid grid-cols-2 gap-2 mt-2">
                                        <div className="bg-slate-50 p-2 rounded-lg text-center">
                                            <p className="text-[8px] text-slate-400 uppercase font-black">LAT</p>
                                            <p className="text-[10px] font-mono font-black">{data.latitud || '---'}</p>
                                        </div>
                                        <div className="bg-slate-50 p-2 rounded-lg text-center">
                                            <p className="text-[8px] text-slate-400 uppercase font-black">LNG</p>
                                            <p className="text-[10px] font-mono font-black">{data.longitud || '---'}</p>
                                        </div>
                                    </div>
                                </div>
                                <button disabled={processing} className="w-full h-12 bg-indigo-600 text-white rounded-xl font-black text-[10px] uppercase tracking-widest shadow-lg shadow-indigo-600/30 active:scale-95 transition-transform mt-2">
                                    {processing ? "Guardando..." : "Guardar Escuela"}
                                </button>
                            </form>
                        </div>
                    )}

                    {/* LISTA DE ESCUELAS */}
                    <div>
                        <h3 className="text-sm font-black text-slate-800 uppercase mb-3 ml-1">Directorio</h3>
                        <div className="space-y-3">
                            {escuelas.length > 0 ? escuelas.map((escuela) => (
                                <div key={escuela.id} className="bg-white rounded-[1.5rem] p-4 shadow-sm border border-slate-100">
                                    <div className="flex gap-4">
                                        <div className="h-12 w-12 rounded-full bg-slate-50 border border-slate-100 flex items-center justify-center font-black text-slate-400 shadow-inner">
                                            🏫
                                        </div>
                                        <div className="flex-1">
                                            <p className="font-bold text-slate-800 leading-tight text-sm">{escuela.nombre}</p>
                                            <p className="text-[9px] font-black text-indigo-500 uppercase mt-1 tracking-widest">RUT: {escuela.ruta?.nombre || "Sin Asignar"}</p>
                                        </div>
                                    </div>
                                    <div className="mt-4 bg-slate-50 p-3 rounded-xl border border-slate-100 flex justify-between items-center">
                                        <div>
                                            <p className="text-[9px] uppercase font-bold text-slate-400 tracking-wider">Director</p>
                                            <p className="text-xs font-bold text-slate-700">{escuela.director || <span className="text-red-400 italic">No Reg.</span>}</p>
                                        </div>
                                        <div className="text-right">
                                            <p className="text-[9px] uppercase font-bold text-slate-400 tracking-wider mb-0.5">Raciones</p>
                                            <span className="bg-white px-2 py-1 rounded-md text-sm font-black text-indigo-600 border border-indigo-50">{escuela.raciones_estandar || 0}</span>
                                        </div>
                                    </div>
                                </div>
                            )) : (
                                <div className="text-center p-8 bg-white rounded-3xl border border-dashed border-slate-200">
                                    <p className="text-3xl mb-2 opacity-50">🏫</p>
                                    <p className="text-xs font-bold text-slate-500 uppercase tracking-widest">Sin Centros</p>
                                </div>
                            )}
                        </div>
                    </div>
                </div>
            </MobileLayout>
        );
    }

    return (
        <AuthenticatedLayout
            user={auth.user}
            header={
                <h2 className="font-semibold text-xl text-gray-800 leading-tight">
                    Gestión de Escuelas
                </h2>
            }
        >
            <Head title="Escuelas" />

            <div className="py-12">
                <div className="max-w-7xl mx-auto sm:px-6 lg:px-8 space-y-6">
                    {/* FORMULARIO DE REGISTRO */}
                    <div className="p-4 sm:p-8 bg-white shadow sm:rounded-lg">
                        <h3 className="text-lg font-medium text-gray-900 mb-4">
                            Registrar Nueva Escuela
                        </h3>
                        <form onSubmit={submit} className="space-y-4">
                            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                                {/* Nombre */}
                                <div className="md:col-span-2">
                                    <label className="block text-sm font-medium text-gray-700">
                                        Nombre de Escuela
                                    </label>
                                    <input
                                        type="text"
                                        value={data.nombre}
                                        onChange={(e) =>
                                            setData("nombre", e.target.value)
                                        }
                                        className="mt-1 block w-full border-gray-300 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500"
                                        required
                                    />
                                    {errors.nombre && (
                                        <div className="text-red-500 text-xs mt-1">
                                            {errors.nombre}
                                        </div>
                                    )}
                                </div>

                                {/* Código MINERD */}
                                <div>
                                    <label className="block text-sm font-medium text-gray-700">
                                        Código MINERD
                                    </label>
                                    <input
                                        type="text"
                                        value={data.codigo_minerd}
                                        onChange={(e) =>
                                            setData(
                                                "codigo_minerd",
                                                e.target.value,
                                            )
                                        }
                                        className="mt-1 block w-full border-gray-300 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500"
                                        required
                                    />
                                </div>
                                {/* RNC de la Escuela / Institución */}
                                <div>
                                    <label className="block text-sm font-medium text-gray-700">
                                        RNC (Facturación)
                                    </label>
                                    <input
                                        type="text"
                                        placeholder="Ej: 401037534"
                                        value={data.rnc}
                                        onChange={(e) =>
                                            setData("rnc", e.target.value)
                                        }
                                        className="mt-1 block w-full border-gray-300 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500"
                                    />
                                    {errors.rnc && (
                                        <div className="text-red-500 text-xs mt-1">
                                            {errors.rnc}
                                        </div>
                                    )}
                                </div>

                                {/* Ruta */}
                                <div>
                                    <label className="block text-sm font-medium text-gray-700">
                                        Ruta Asignada
                                    </label>
                                    <select
                                        value={data.ruta_id}
                                        onChange={(e) =>
                                            setData("ruta_id", e.target.value)
                                        }
                                        className="mt-1 block w-full border-gray-300 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500"
                                        required
                                    >
                                        <option value="">
                                            Seleccione una ruta
                                        </option>
                                        {rutas.map((ruta) => (
                                            <option
                                                key={ruta.id}
                                                value={ruta.id}
                                            >
                                                {ruta.nombre}
                                            </option>
                                        ))}
                                    </select>
                                </div>

                                {/* Raciones Estándar */}
                                <div>
                                    <label className="block text-sm font-medium text-gray-700">
                                        Raciones Estándar
                                    </label>
                                    <input
                                        type="number"
                                        value={data.raciones_estandar}
                                        onChange={(e) =>
                                            setData(
                                                "raciones_estandar",
                                                e.target.value,
                                            )
                                        }
                                        className="mt-1 block w-full border-gray-300 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500"
                                        required
                                    />
                                </div>

                                {/* Director */}
                                <div>
                                    <label className="block text-sm font-medium text-gray-700">
                                        Director(a)
                                    </label>
                                    <input
                                        type="text"
                                        value={data.director}
                                        onChange={(e) =>
                                            setData("director", e.target.value)
                                        }
                                        className="mt-1 block w-full border-gray-300 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500"
                                    />
                                </div>

                                {/* Teléfono */}
                                <div>
                                    <label className="block text-sm font-medium text-gray-700">
                                        Teléfono
                                    </label>
                                    <input
                                        type="text"
                                        value={data.telefono}
                                        onChange={(e) =>
                                            setData("telefono", e.target.value)
                                        }
                                        className="mt-1 block w-full border-gray-300 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500"
                                    />
                                </div>

                                {/* Distrito */}
                                <div>
                                    <label className="block text-sm font-medium text-gray-700">
                                        Distrito
                                    </label>
                                    <input
                                        type="text"
                                        value={data.distrito}
                                        onChange={(e) =>
                                            setData("distrito", e.target.value)
                                        }
                                        className="mt-1 block w-full border-gray-300 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500"
                                    />
                                </div>

                                {/* Municipio */}
                                <div>
                                    <label className="block text-sm font-medium text-gray-700">
                                        Municipio
                                    </label>
                                    <input
                                        type="text"
                                        value={data.municipio}
                                        onChange={(e) =>
                                            setData("municipio", e.target.value)
                                        }
                                        className="mt-1 block w-full border-gray-300 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500"
                                    />
                                </div>

                                {/* Dirección (Larga) */}
                                <div className="md:col-span-3">
                                    <label className="block text-sm font-medium text-gray-700">
                                        Dirección
                                    </label>
                                    <input
                                        type="text"
                                        value={data.direccion}
                                        onChange={(e) =>
                                            setData("direccion", e.target.value)
                                        }
                                        className="mt-1 block w-full border-gray-300 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500"
                                    />
                                </div>

                                {/* Mapa en Desktop */}
                                <div className="md:col-span-3">
                                    <label className="block text-sm font-medium text-gray-700 mb-2">
                                        Ubicación Geográfica (Haz clic en el mapa para marcar)
                                    </label>
                                    <div className="grid grid-cols-4 gap-4">
                                        <div className="col-span-3">
                                             <MapComponent 
                                                escuelas={escuelas} 
                                                selectedLocation={data.latitud ? { lat: parseFloat(data.latitud), lng: parseFloat(data.longitud) } : null}
                                                onSelectLocation={(latlng) => {
                                                    setData(prev => ({ ...prev, latitud: latlng.lat.toFixed(6), longitud: latlng.lng.toFixed(6) }));
                                                }}
                                            />
                                        </div>
                                        <div className="col-span-1 space-y-4">
                                            <div className="bg-blue-50 p-4 rounded-xl border border-blue-100">
                                                <p className="text-[10px] font-black text-blue-600 uppercase tracking-widest mb-1">Latitud</p>
                                                <input 
                                                    type="text" 
                                                    value={data.latitud} 
                                                    onChange={e => setData('latitud', e.target.value)}
                                                    className="w-full bg-white border-blue-100 rounded-lg text-sm font-mono font-bold text-blue-800"
                                                />
                                            </div>
                                            <div className="bg-indigo-50 p-4 rounded-xl border border-indigo-100">
                                                <p className="text-[10px] font-black text-indigo-600 uppercase tracking-widest mb-1">Longitud</p>
                                                <input 
                                                    type="text" 
                                                    value={data.longitud} 
                                                    onChange={e => setData('longitud', e.target.value)}
                                                    className="w-full bg-white border-indigo-100 rounded-lg text-sm font-mono font-bold text-indigo-800"
                                                />
                                            </div>
                                            <p className="text-[10px] text-slate-400 italic">
                                                * El chofer podrá usar estas coordenadas para llegar usando GPS.
                                            </p>
                                        </div>
                                    </div>
                                </div>
                            </div>

                            <div className="flex justify-end pt-4">
                                <button
                                    type="submit"
                                    disabled={processing}
                                    className="bg-blue-600 text-white px-6 py-2 rounded-md hover:bg-blue-700 transition disabled:opacity-50"
                                >
                                    {processing
                                        ? "Guardando..."
                                        : "Guardar Escuela"}
                                </button>
                            </div>
                        </form>
                    </div>

                    {/* TABLA DE ESCUELAS */}
                    <div className="p-4 sm:p-8 bg-white shadow sm:rounded-lg overflow-x-auto">
                        <table className="min-w-full divide-y divide-gray-200">
                            <thead className="bg-gray-50">
                                <tr>
                                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">
                                        Nombre
                                    </th>
                                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">
                                        Ruta
                                    </th>
                                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">
                                        Director
                                    </th>
                                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">
                                        Acciones
                                    </th>
                                </tr>
                            </thead>
                            <tbody className="bg-white divide-y divide-gray-200">
                                {escuelas.map((escuela) => (
                                    <tr key={escuela.id}>
                                        <td className="px-6 py-4 text-sm text-gray-900">
                                            {escuela.nombre}
                                        </td>
                                        <td className="px-6 py-4 text-sm">
                                            <span className="px-2 py-1 bg-green-100 text-green-800 rounded-full text-xs font-semibold">
                                                {escuela.ruta?.nombre ||
                                                    "Sin Ruta"}
                                            </span>
                                        </td>
                                        <td className="px-6 py-4 text-sm text-gray-500">
                                            {escuela.director || "---"}
                                        </td>
                                        <td className="px-6 py-4 text-sm font-medium">
                                            <button className="text-blue-600 hover:text-blue-900">
                                                Editar
                                            </button>
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                </div>
            </div>
        </AuthenticatedLayout>
    );
}
