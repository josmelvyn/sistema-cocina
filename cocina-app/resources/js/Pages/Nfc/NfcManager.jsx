import React from 'react';
import { useForm, usePage, Link } from '@inertiajs/react'; // Importamos Link

const NfcManager = () => {
    const { sequences } = usePage().props;

    const { data, setData, post, processing, errors, reset } = useForm({
        nombre: '',
        tipo: 1, 
        prefijo: 'B01',
        proximo_numero: '',
        numero_final: '',
        fecha_vencimiento: '',
    });

    const handleSubmit = (e) => {
        e.preventDefault();
        post(route('nfc.store'), {
            onSuccess: () => reset(),
        });
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
            {/* Header con botón de Dashboard */}
            <div className="flex justify-between items-center mb-6">
                <h1 className="text-2xl font-bold text-gray-800">Configuración de NCF</h1>
                <Link 
                    href={route('dashboard')} 
                    className="bg-gray-500 text-white px-4 py-2 rounded hover:bg-gray-600 flex items-center transition"
                >
                    <svg xmlns="http://w3.org" className="h-5 w-5 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6" />
                    </svg>
                    Volver al Dashboard
                </Link>
            </div>

            <form onSubmit={handleSubmit} className="bg-white p-6 rounded-lg shadow-md border mb-8">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="col-span-2">
                        <label className="block text-sm font-semibold text-gray-700">Nombre del Comprobante</label>
                        <input 
                            type="text" 
                            placeholder="Ej: Factura de Crédito Fiscal"
                            className="w-full border p-2 rounded mt-1 focus:ring-2 focus:ring-blue-500 outline-none"
                            value={data.nombre}
                            onChange={e => setData('nombre', e.target.value)}
                        />
                        {errors.nombre && <p className="text-red-500 text-xs mt-1">{errors.nombre}</p>}
                    </div>

                    <div>
                        <label className="block text-sm font-semibold text-gray-700">Tipo de NCF</label>
                        <select 
                            className="w-full border p-2 rounded mt-1 bg-white"
                            value={data.tipo}
                            onChange={e => handleTipoChange(e.target.value)}
                        >
                            <option value="1">01 - Crédito Fiscal</option>
                            <option value="2">02 - Consumo</option>
                            <option value="14">14 - Régimen Especial</option>
                            <option value="15">15 - Gubernamental</option>
                        </select>
                    </div>

                    <div>
                        <label className="block text-sm font-semibold text-gray-700">Prefijo (Auto)</label>
                        <input 
                            type="text" 
                            readOnly
                            className="w-full border p-2 rounded mt-1 bg-gray-100 font-bold"
                            value={data.prefijo}
                        />
                    </div>

                    <div>
                        <label className="block text-sm font-semibold text-gray-700">Secuencia Desde</label>
                        <input 
                            type="number" 
                            className="w-full border p-2 rounded mt-1"
                            value={data.proximo_numero}
                            onChange={e => setData('proximo_numero', e.target.value)}
                        />
                    </div>

                    <div>
                        <label className="block text-sm font-semibold text-gray-700">Secuencia Hasta</label>
                        <input 
                            type="number" 
                            className="w-full border p-2 rounded mt-1"
                            value={data.numero_final}
                            onChange={e => setData('numero_final', e.target.value)}
                        />
                    </div>

                    <div className="col-span-2">
                        <label className="block text-sm font-semibold text-gray-700">Fecha de Vencimiento</label>
                        <input 
                            type="date" 
                            className="w-full border p-2 rounded mt-1"
                            value={data.fecha_vencimiento}
                            onChange={e => setData('fecha_vencimiento', e.target.value)}
                        />
                    </div>
                </div>

                <button 
                    disabled={processing}
                    className="w-full mt-6 bg-blue-600 text-white p-3 rounded font-bold hover:bg-blue-700 disabled:opacity-50 transition"
                >
                    {processing ? 'Procesando...' : 'Registrar Nueva Secuencia'}
                </button>
            </form>

            {/* Tabla de registros */}
            <div className="bg-white rounded-lg shadow-md border overflow-hidden">
                <table className="w-full text-sm">
                    <thead className="bg-gray-50 border-b">
                        <tr className="text-gray-600 uppercase text-xs">
                            <th className="p-4 text-left">ID Tipo</th>
                            <th className="p-4 text-left">Nombre</th>
                            <th className="p-4 text-left">Prefijo</th>
                            <th className="p-4 text-left">Rango</th>
                            <th className="p-4 text-left">Estado</th>
                        </tr>
                    </thead>
                    <tbody>
                        {sequences && sequences.length > 0 ? sequences.map((s) => (
                            <tr key={s.id} className="border-b hover:bg-gray-50 transition">
                                <td className="p-4 font-mono text-blue-600">{String(s.tipo).padStart(2, '0')}</td>
                                <td className="p-4 font-medium">{s.nombre}</td>
                                <td className="p-4 font-bold text-gray-700">{s.prefijo}</td>
                                <td className="p-4">{s.proximo_numero} - {s.numero_final}</td>
                                <td className="p-4">
                                    <span className={`px-2 py-1 rounded-full text-[10px] font-bold uppercase ${s.activa ? 'bg-green-100 text-green-700' : 'bg-red-100 text-red-700'}`}>
                                        {s.activa ? 'Activo' : 'Inactivo'}
                                    </span>
                                </td>
                            </tr>
                        )) : (
                            <tr>
                                <td colSpan="5" className="p-4 text-center text-gray-500">No hay secuencias registradas.</td>
                            </tr>
                        )}
                    </tbody>
                </table>
            </div>
        </div>
    );
};

export default NfcManager;