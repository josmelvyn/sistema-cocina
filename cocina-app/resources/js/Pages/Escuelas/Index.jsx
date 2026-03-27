import React from "react";
import AuthenticatedLayout from "@/Layouts/AuthenticatedLayout";
import { Head, useForm } from "@inertiajs/react";

export default function Index({ auth, escuelas, rutas }) {
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
