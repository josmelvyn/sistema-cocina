import React, { useState } from 'react'; // Añadimos useState
import { useForm, usePage, Link } from '@inertiajs/react';

const NfcManager = () => {
    const { sequences } = usePage().props;
    const [editId, setEditId] = useState(null); // Para saber si estamos editando

    const { data, setData, post, put, processing, errors, reset, clearErrors } = useForm({
        nombre: '',
        tipo: 1, 
        prefijo: 'B01',
        proximo_numero: '',
        numero_final: '',
        fecha_vencimiento: '',
    });

    const handleSubmit = (e) => {
        e.preventDefault();
        if (editId) {
            // Si hay un ID, usamos PUT para actualizar
            put(route('nfc.update', editId), {
                onSuccess: () => { reset(); setEditId(null); }
            });
        } else {
            // Si no, usamos POST para crear nuevo
            post(route('nfc.store'), {
                onSuccess: () => reset()
            });
        }
    };

    // Función para cargar los datos en el formulario al querer editar
    const handleEdit = (s) => {
        setEditId(s.id);
        clearErrors();
        setData({
            nombre: s.nombre,
            tipo: s.tipo,
            prefijo: s.prefijo,
            proximo_numero: s.proximo_numero,
            numero_final: s.numero_final,
            fecha_vencimiento: s.fecha_vencimiento,
        });
        window.scrollTo({ top: 0, behavior: 'smooth' }); // Sube al formulario
    };

    const handleCancel = () => {
        setEditId(null);
        reset();
    };

    const handleTipoChange = (valorNumerico) => {
        const num = parseInt(valorNumerico);
        setData(prevData => ({
            ...prevData,
            tipo: num,
            prefijo: `B${String(num).padStart(2, '0')}`
        }));
    };

    return (
        <div className="p-6 max-w-5xl mx-auto">
            <div className="flex justify-between items-center mb-6">
                <h1 className="text-2xl font-bold text-gray-800">
                    {editId ? 'Modificando Secuencia' : 'Configuración de NCF'}
                </h1>
                <Link href={route('dashboard')} className="bg-gray-500 text-white px-4 py-2 rounded hover:bg-gray-600 flex items-center transition">
                    Volver al Dashboard
                </Link>
            </div>

            <form onSubmit={handleSubmit} className={`bg-white p-6 rounded-lg shadow-md border mb-8 ${editId ? 'border-orange-400 ring-1 ring-orange-200' : ''}`}>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="col-span-2">
                        <label className="block text-sm font-semibold text-gray-700">Nombre del Comprobante</label>
                        <input type="text" className="w-full border p-2 border-orange-200 rounded mt-1 outline-none" value={data.nombre} onChange={e => setData('nombre', e.target.value)} />
                    </div>

                    <div>
                        <label className="block text-sm font-semibold text-gray-700">Tipo de NCF</label>
                        <select className="w-full border p-2 rounded mt-1" value={data.tipo} onChange={e => handleTipoChange(e.target.value)}>
                            <option value="1">01 - Crédito Fiscal</option>
                            <option value="2">02 - Consumo</option>
                            <option value="14">14 - Régimen Especial</option>
                            <option value="15">15 - Gubernamental</option>
                        </select>
                    </div>

                    <div>
                        <label className="block text-sm font-semibold text-gray-700">Prefijo</label>
                        <input type="text" readOnly className="w-full border p-2 border-orange-200 rounded mt-1 bg-gray-100 font-bold" value={data.prefijo} />
                    </div>

                    <div>
                        <label className="block text-sm font-semibold text-gray-700 font-bold text-blue-600">Desde (Modificar Rango)</label>
                        <input type="number" className="w-full border-2 border-orange-200 p-2 rounded mt-1" value={data.proximo_numero} onChange={e => setData('proximo_numero', e.target.value)} />
                    </div>

                    <div>
                        <label className="block text-sm font-semibold text-gray-700 font-bold text-blue-600">Hasta (Modificar Rango)</label>
                        <input type="number" className="w-full border-2 border-orange-200 p-2 rounded mt-1" value={data.numero_final} onChange={e => setData('numero_final', e.target.value)} />
                    </div>

                    <div className="col-span-2">
                        <label className="block text-sm font-semibold text-gray-700 font-bold text-orange-600">Fecha de Vencimiento</label>
                        <input type="date" className="w-full border-2 border-orange-200 p-2 rounded mt-1" value={data.fecha_vencimiento} onChange={e => setData('fecha_vencimiento', e.target.value)} />
                    </div>
                </div>

                <div className="flex gap-2">
                    <button disabled={processing} className={`w-full mt-6 p-3 rounded font-bold text-white transition ${editId ? 'bg-orange-500 hover:bg-orange-600' : 'bg-blue-600 hover:bg-blue-700'}`}>
                        {processing ? 'Procesando...' : editId ? 'Actualizar Cambios' : 'Registrar Nueva Secuencia'}
                    </button>
                    {editId && (
                        <button type="button" onClick={handleCancel} className="w-1/3 mt-6 bg-gray-200 p-3 rounded font-bold hover:bg-gray-300">
                            Cancelar
                        </button>
                    )}
                </div>
            </form>

            <div className="bg-white rounded-lg shadow-md border overflow-hidden">
                <table className="w-full text-sm">
                    <thead className="bg-gray-50 border-b">
                        <tr className="text-gray-600 uppercase text-xs">
                            <th className="p-4 text-left">Nombre</th>
                            <th className="p-4 text-left">Prefijo</th>
                            <th className="p-4 text-left">Rango</th>
                            <th className="p-4 text-left">Vence</th>
                            <th className="p-4 text-center">Acción</th>
                        </tr>
                    </thead>
                    <tbody>
                        {sequences && sequences.map((s) => (
                            <tr key={s.id} className="border-b hover:bg-gray-50 transition">
                                <td className="p-4 font-medium">{s.nombre}</td>
                                <td className="p-4 font-bold">{s.prefijo}</td>
                                <td className="p-4">{s.proximo_numero} - {s.numero_final}</td>
                                <td className="p-4 text-orange-700 font-semibold">{s.fecha_vencimiento}</td>
                                <td className="p-4 text-center">
                                    <button 
                                        onClick={() => handleEdit(s)}
                                        className="text-blue-600 hover:text-blue-800 font-bold bg-blue-50 px-3 py-1 rounded-md"
                                    >
                                        Editar
                                    </button>
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>
        </div>
    );
};

export default NfcManager;