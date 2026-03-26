import React from 'react';
import AuthenticatedLayout from '@/Layouts/AuthenticatedLayout';
import { Head, useForm, router } from '@inertiajs/react'; // <--- AGREGA 'router' AQU

export default function Index({ auth, usuarios, limite, actuales }) {
    const { data, setData, post, processing, reset, errors } = useForm({
        name: '',
        email: '',
        password: '',
    });

    const submit = (e) => {
        e.preventDefault();
        post(route('usuarios.store'), {
            onSuccess: () => reset(),
        });
    };

    const cuposDisponibles = limite - actuales;

    return (
        <AuthenticatedLayout
            user={auth.user}
            header={<h2 className="font-black text-xl text-gray-800 leading-tight uppercase tracking-tighter">Personal de Cocina y Almacén</h2>}
        >
            <Head title="Usuarios" />

            <div className="py-12 max-w-7xl mx-auto sm:px-6 lg:px-8 space-y-6">
                
                {/* STATUS DE SUSCRIPCIÓN ($12 USD) */}
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                    <div className="bg-black text-white p-6 rounded-xl shadow-lg">
                        <p className="text-[10px] font-black uppercase text-gray-400 tracking-widest">Plan de Usuarios</p>
                        <p className="text-3xl font-black">{actuales} <span className="text-gray-500 text-lg">/ {limite}</span></p>
                        <div className="w-full bg-gray-800 h-2 mt-2 rounded-full overflow-hidden">
                            <div 
                                className="bg-indigo-500 h-full transition-all duration-500" 
                                style={{ width: `${(actuales / limite) * 100}%` }}
                            ></div>
                        </div>
                    </div>

                    <div className="bg-white p-6 rounded-xl shadow border-l-8 border-green-500 flex flex-col justify-center">
                        <p className="text-[10px] font-black uppercase text-gray-400">Inversión Mensual</p>
                        <p className="text-2xl font-black text-gray-800">${(limite * 12).toLocaleString()} USD</p>
                    </div>

                    <div className="bg-white p-6 rounded-xl shadow border-l-8 border-indigo-500 flex flex-col justify-center">
                        <p className="text-[10px] font-black uppercase text-gray-400">Cupos Libres</p>
                        <p className="text-2xl font-black text-indigo-600">{cuposDisponibles} Disponibles</p>
                    </div>
                </div>

                {/* FORMULARIO DE REGISTRO */}
                <div className="bg-white p-6 shadow-xl rounded-xl border border-gray-100">
                    <h3 className="font-black text-gray-700 mb-4 uppercase text-sm italic border-b pb-2">Registrar Nuevo Colaborador</h3>
                    
                    {cuposDisponibles > 0 ? (
                        <form onSubmit={submit} className="grid grid-cols-1 md:grid-cols-4 gap-4 items-end">
                            <div>
                                <label className="block text-[10px] font-black text-gray-500 uppercase">Nombre Completo</label>
                                <input 
                                    type="text" 
                                    value={data.name} 
                                    onChange={e => setData('name', e.target.value)} 
                                    className="w-full border-gray-200 rounded-lg text-sm font-bold focus:ring-black"
                                    placeholder="Ej: Juan Pérez"
                                    required 
                                />
                            </div>
                            <div>
                                <label className="block text-[10px] font-black text-gray-500 uppercase">Correo Electrónico</label>
                                <input 
                                    type="email" 
                                    value={data.email} 
                                    onChange={e => setData('email', e.target.value)} 
                                    className="w-full border-gray-200 rounded-lg text-sm font-bold focus:ring-black"
                                    placeholder="cocina@empresa.com"
                                    required 
                                />
                            </div>
                            <div>
                                <label className="block text-[10px] font-black text-gray-500 uppercase">Contraseña Temporal</label>
                                <input 
                                    type="password" 
                                    value={data.password} 
                                    onChange={e => setData('password', e.target.value)} 
                                    className="w-full border-gray-200 rounded-lg text-sm font-bold focus:ring-black"
                                    placeholder="******"
                                    required 
                                />
                            </div>
                            <button 
                                disabled={processing}
                                className="bg-black text-white px-6 py-2.5 rounded-lg font-black text-xs uppercase hover:bg-indigo-600 transition-all shadow-md"
                            >
                                {processing ? '...' : 'Añadir al Equipo'}
                            </button>
                        </form>
                    ) : (
                        <div className="bg-indigo-50 border-2 border-dashed border-indigo-200 p-4 rounded-lg text-center">
                            <p className="text-indigo-800 font-bold text-sm uppercase italic">
                                🚫 Límite alcanzado. Debes solicitar más cupos ($12 c/u) al administrador del sistema.
                            </p>
                        </div>
                    )}
                    {errors.email && <p className="text-red-500 text-[10px] mt-2 font-bold uppercase">{errors.email}</p>}
                </div>

                {/* TABLA DE PERSONAL */}
                <div className="bg-white shadow-md rounded-2xl border border-gray-100 overflow-hidden">
                    <table className="w-full text-left">
                        <thead className="bg-gray-50 border-b">
                            <tr>
                                <th className="p-4 text-[10px] font-black uppercase text-gray-500 tracking-widest">Colaborador</th>
                                <th className="p-4 text-[10px] font-black uppercase text-gray-500 tracking-widest">Contacto</th>
                                <th className="p-4 text-[10px] font-black uppercase text-gray-500 tracking-widest text-center">Rol en Sistema</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-gray-100">
                          {usuarios.map(u => (
    <tr key={u.id} className="border-b">
        <td className="p-4 font-bold uppercase text-sm">{u.name}</td>
        <td className="p-4 text-gray-600">{u.email}</td>
        <td className="p-4">
            {/* Solo mostramos el botón si NO es el propio Admin (no puede borrarse a sí mismo) */}
            {u.id !== auth.user.id && (
                <button 
                    onClick={() => {
                        if(confirm('¿Estás seguro de eliminar a este colaborador? Se liberará un cupo de $12.')) {
                            router.delete(route('usuarios.destroy', u.id));
                        }
                    }}
                    className="bg-red-100 text-red-600 px-3 py-1 rounded-lg font-black text-[10px] uppercase hover:bg-red-600 hover:text-white transition-all"
                >
                    Eliminar
                </button>
            )}
        </td>
    </tr>
))}
                        </tbody>
                    </table>
                </div>
            </div>
        </AuthenticatedLayout>
    );
}