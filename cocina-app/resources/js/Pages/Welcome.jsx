import { Head, Link } from '@inertiajs/react';

export default function Welcome({ auth }) {
    return (
        <>
            <Head title="Panel de Cocina" />
            <div className="relative min-h-screen bg-gray-100 flex flex-col items-center justify-center selection:bg-orange-500 selection:text-white dark:bg-zinc-950">
                
                {/* Fondo decorativo sutil */}
                <div className="absolute inset-0 overflow-hidden pointer-events-none">
                    <div className="absolute -top-[10%] -left-[10%] w-[40%] h-[40%] rounded-full bg-orange-500/10 blur-[120px]"></div>
                    <div className="absolute -bottom-[10%] -right-[10%] w-[40%] h-[40%] rounded-full bg-red-600/10 blur-[120px]"></div>
                </div>

                <div className="relative w-full max-w-2xl px-6 py-12 bg-white dark:bg-zinc-900 shadow-2xl rounded-2xl border border-gray-200 dark:border-zinc-800 text-center">
                    
                    {/* Logo o Icono de Cocina */}
                    <div className="flex justify-center mb-6">
                        <div className="bg-orange-500 p-4 rounded-2xl shadow-lg shadow-orange-500/20">
                            {/* Icono de Gorro de Chef / Cubiertos */}
                            <svg className="w-12 h-12 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 6V4m0 2a2 2 0 100 4m0-4a2 2 0 110 4m-6 8a2 2 0 100-4m0 4a2 2 0 110-4m0 4v2m0-6V4m6 6v10m6-2a2 2 0 100-4m0 4a2 2 0 110-4m0 4v2m0-6V4"></path>
                            </svg>
                        </div>
                    </div>

                    <h1 className="text-3xl font-bold text-gray-900 dark:text-white mb-2">
                        Kitchen System <span className="text-orange-500">v1.0</span>
                    </h1>
                    <p className="text-gray-500 dark:text-gray-400 mb-8">
                        Gestión de comandas y pedidos en tiempo real.
                    </p>

                    <div className="flex flex-col sm:flex-row gap-4 justify-center">
                        {auth.user ? (
                            <Link
                                href={route('dashboard')}
                                className="w-full sm:w-auto px-8 py-3 bg-orange-500 hover:bg-orange-600 text-white font-semibold rounded-xl transition-all shadow-lg shadow-orange-500/25 focus:ring-2 focus:ring-orange-500 focus:ring-offset-2"
                            >
                                Ir al Panel de Control
                            </Link>
                        ) : (
                            <>
                                <Link
                                    href={route('login')}
                                    className="w-full sm:w-auto px-8 py-3 bg-zinc-900 dark:bg-white text-white dark:text-black font-semibold rounded-xl hover:bg-zinc-800 dark:hover:bg-gray-200 transition-all focus:ring-2 focus:ring-gray-400"
                                >
                                    Iniciar Sesión
                                </Link>
                                
                                <Link
                                    href={route('register')}
                                    className="w-full sm:w-auto px-8 py-3 bg-white dark:bg-zinc-800 text-gray-700 dark:text-gray-200 font-semibold rounded-xl border border-gray-200 dark:border-zinc-700 hover:bg-gray-50 dark:hover:bg-zinc-700 transition-all"
                                >
                                    Registrar Cocinero
                                </Link>
                            </>
                        )}
                    </div>

                    <footer className="mt-12 text-sm text-gray-400 dark:text-zinc-600 italic">
                        "El orden en la cocina es el éxito en la mesa."
                    </footer>
                </div>
            </div>
        </>
    );
}