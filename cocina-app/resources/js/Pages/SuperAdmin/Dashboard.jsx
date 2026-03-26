import React from 'react';
import AuthenticatedLayout from '@/Layouts/AuthenticatedLayout';
import { router, Head } from '@inertiajs/react';

export default function Dashboard({ auth, clientes }) {
    
    const actualizarCuentas = (id, limiteActual) => {
    const nuevoLimite = prompt("¿Cuántos usuarios de $12 tendrá ahora?", limiteActual);
    
    console.log("Intentando actualizar ID:", id, "Nuevo Límite:", nuevoLimite);

    if (nuevoLimite) {
        router.put(route('superadmin.update', id), { 
            nuevo_limite: nuevoLimite 
        }, {
            onSuccess: () => alert("¡Plan Actualizado con éxito!"),
            onFinish: () => console.log("Petición terminada"),
        });
    }
};

    return (
        <AuthenticatedLayout user={auth.user} header={<h2 className="font-black text-xl text-red-600 uppercase">Panel de Control General (Dueño)</h2>}>
            <Head title="Super Admin" />
            <div className="py-12 max-w-7xl mx-auto sm:px-6 lg:px-8">
                <div className="bg-white shadow-2xl rounded-2xl overflow-hidden border-2 border-red-500">
                    <table className="w-full text-left">
                        <thead className="bg-red-600 text-white font-black uppercase text-xs">
                            <tr>
                                <th className="p-4">Dueño de Cocina</th>
                                <th className="p-4">Vencimiento</th>
                                <th className="p-4 text-center">Usuarios (Staff)</th>
                                <th className="p-4 text-center">Límite Pagado</th>
                                <th className="p-4 text-center">Ingreso Mensual</th>
                                <th className="p-4 text-center">Acciones</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-gray-100 italic">
                            {clientes.map(cliente => (
                                <tr key={cliente.id} className={cliente.suscripcion_activa ? '' : 'bg-red-50'}>
                                    <td className="p-4">
                                        <p className="font-black text-gray-800 uppercase">{cliente.name}</p>
                                        <p className="text-[10px] text-gray-400 font-mono">{cliente.email}</p>
                                    </td>
                                    <td className="p-4">
                                        <span className={`px-2 py-1 rounded font-bold text-xs ${cliente.suscripcion_activa ? 'bg-green-100 text-green-700' : 'bg-red-200 text-red-800'}`}>
                                            {cliente.vence_el || 'SIN FECHA'}
                                        </span>
                                    </td>
                                    <td className="p-4 text-center font-bold">{cliente.empleados_count}</td>
                                    <td className="p-4 text-center font-black text-indigo-600 text-xl">{cliente.limite_usuarios}</td>
                                    <td className="p-4 text-center font-black text-green-600 uppercase">
                                        ${cliente.limite_usuarios * 12} USD
                                    </td>
                                    <td className="p-4 text-center">
                                        <button 
                                            onClick={() => actualizarCuentas(cliente.id, cliente.limite_usuarios)}
                                            className="bg-black text-white px-4 py-2 rounded-lg font-black text-[10px] uppercase hover:bg-red-600 transition-all"
                                        >
                                            Actualizar Pago
                                        </button>
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