import React from 'react';
import { Head, Link, usePage } from '@inertiajs/react';

export default function Aviso() {
    // Obtenemos los datos del usuario logueado desde Inertia
    const { auth } = usePage().props;

    return (
        <div className="min-h-screen bg-slate-900 flex items-center justify-center p-6 text-white text-center font-sans">
            <Head title="Acceso Bloqueado" />
            
            <div className="max-w-md bg-white text-black p-10 rounded-[40px] shadow-2xl border-b-[12px] border-red-600">
                <div className="text-6xl mb-6">⚠️</div>
                
                <h1 className="font-black text-3xl uppercase tracking-tighter mb-2 text-gray-900">
                    Acceso Suspendido
                </h1>
                
                <p className="text-gray-500 font-bold mb-8 uppercase text-[10px] tracking-widest leading-relaxed">
                    Tu suscripción de $12 USD ha vencido o no ha sido activada por el administrador.
                </p>

                <div className="space-y-4">
                    <div className="bg-gray-50 p-4 rounded-2xl border border-gray-100 mb-6">
                        <p className="text-[10px] font-black text-gray-400 uppercase mb-1">Estado de cuenta</p>
                        <p className="text-red-600 font-black uppercase">Pendiente de Pago</p>
                    </div>

                    {/* BOTÓN SECRETO: Solo para el dueño del sistema */}
                    {auth.user.email === 'josmelvyn@outlook.es' && (
                        <Link 
                            href={route('superadmin.index')} 
                            className="block w-full bg-red-600 text-white py-4 rounded-2xl font-black text-xs uppercase hover:bg-black transition-all shadow-lg"
                        >
                            ⚙️ Entrar al Panel Maestro
                        </Link>
                    )}

                    <Link 
                        href={route('logout')} 
                        method="post" 
                        as="button" 
                        className="w-full bg-black text-white py-4 rounded-2xl font-black text-xs uppercase hover:bg-red-600 transition-all shadow-lg"
                    >
                        Cerrar Sesión para reintentar
                    </Link>
                </div>

                <p className="mt-8 text-[9px] text-gray-300 font-bold uppercase tracking-widest">
                    Sistema de Gestión de Cocina Industrial v1.0
                </p>
            </div>
        </div>
    );
}