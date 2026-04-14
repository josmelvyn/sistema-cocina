import ApplicationLogo from '@/Components/ApplicationLogo';
import Dropdown from '@/Components/Dropdown';
import NavLink from '@/Components/NavLink';
import ResponsiveNavLink from '@/Components/ResponsiveNavLink';
import { Link, usePage } from '@inertiajs/react';
import { useState, useEffect } from 'react';

export default function AuthenticatedLayout({ header, children }) {
    const user = usePage().props.auth.user;
    const [showingNavigationDropdown, setShowingNavigationDropdown] = useState(false);

    // --- 1. LÓGICA DE MODO OSCURO (NUEVO) ---
    const [theme, setTheme] = useState(localStorage.getItem('theme') || 'light');

    useEffect(() => {
        if (theme === 'dark') {
            document.documentElement.classList.add('dark');
        } else {
            document.documentElement.classList.remove('dark');
        }
        localStorage.setItem('theme', theme);
    }, [theme]);

    const toggleTheme = () => setTheme(theme === 'light' ? 'dark' : 'light');

    // --- 2. LÓGICA DE ESTADO OFFLINE (TUYA ORIGINAL) ---
    const [isOnline, setIsOnline] = useState(navigator.onLine);
    useEffect(() => {
        const handleOnline = () => setIsOnline(true);
        const handleOffline = () => setIsOnline(false);
        window.addEventListener('online', handleOnline);
        window.addEventListener('offline', handleOffline);
        return () => {
            window.removeEventListener('online', handleOnline);
            window.removeEventListener('offline', handleOffline);
        };
    }, []);

    return (
        <div className="min-h-screen bg-gray-100 dark:bg-gray-950 transition-colors duration-300">
            {/* BARRA DE ALERTA OFFLINE */}
            {!isOnline && (
                <div className="bg-red-600 text-white text-[10px] font-black uppercase py-2 text-center 
                animate-pulse sticky top-0 z-50 tracking-widest">
                    ⚠️ Sin conexión: Estás trabajando en modo local (Offline)
                </div>
            )}

            <nav className="border-b border-gray-100 dark:border-gray-800 bg-white dark:bg-gray-900">
                <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
                    <div className="flex h-16 justify-between">
                        <div className="flex">
                            <div className="flex shrink-0 items-center">
                                <Link href="/dashboard">
                                    <ApplicationLogo className="block h-9 w-auto fill-current text-gray-800 dark:text-gray-200" />
                                </Link>
                            </div>
                            <div className="hidden space-x-8 sm:-my-px sm:ms-10 sm:flex">
                                <NavLink href={route('dashboard')} active={route().current('dashboard')}>Inicio</NavLink>
                                <NavLink href={route('rutas.index')} active={route().current('rutas.*')}>Rutas</NavLink>
                                <NavLink href={route('escuelas.index')} active={route().current('escuelas.*')}>Escuelas</NavLink>
                                <NavLink href={route('insumos.index')} active={route().current('insumos.*')}>Insumos</NavLink>
                                <NavLink href={route('recetas.index')} active={route().current('recetas.*')}>Recetas</NavLink>
                                <NavLink href={route('platos.index')} active={route().current('platos.*')}>Platos</NavLink>
                                
                                {user.rol === 'admin' && (
                                    <>
                                        <NavLink href={route('usuarios.index')} active={route().current('usuarios.*')}>Personal</NavLink>
                                        <NavLink href={route('facturas.index')} active={route().current('facturas.*')}>Facturacion</NavLink>
                                        <NavLink href={route('reportes.index')} active={route().current('reportes.*')}>Reportes</NavLink>
                                        <NavLink href={route('contabilidad.index')} active={route().current('contabilidad.*')}>Contabilidad</NavLink>
                                        <NavLink href={route('conduces.index')} active={route().current('conduces.*')}>Conduces</NavLink>
                                        <NavLink href={route('configuracion.index')} active={route().current('configuracion.*')}>Configuracion</NavLink>
                                    </>
                                )}
                            </div>
                        </div>

                        <div className="hidden sm:ms-6 sm:flex sm:items-center space-x-3">
                            {/* --- BOTÓN TOGGLE TEMA (NUEVO) --- */}
                            <button 
                                onClick={toggleTheme}
                                className="p-2 rounded-lg bg-gray-100 dark:bg-gray-800 text-gray-600 dark:text-gray-400 hover:text-blue-600 dark:hover:text-yellow-400 transition"
                                title="Cambiar Tema"
                            >
                                {theme === 'light' ? '🌙' : '☀️'}
                            </button>

                            <div className="relative ms-3">
                                <Dropdown>
                                    <Dropdown.Trigger>
                                        <span className="inline-flex rounded-md">
                                            <button type="button" className="inline-flex items-center rounded-md border border-transparent bg-white dark:bg-gray-800 px-3 py-2 text-sm font-medium leading-4 text-gray-500 dark:text-gray-400 transition hover:text-gray-700 dark:hover:text-gray-200 focus:outline-none">
                                                {user.name}
                                                <svg className="-me-0.5 ms-2 h-4 w-4" xmlns="http://w3.org" viewBox="0 0 20 20" fill="currentColor">
                                                    <path fillRule="evenodd" d="M5.293 7.293a1 1 0 011.414 0L10 10.586l3.293-3.293a1 1 0 111.414 1.414l-4 4a1 1 0 01-1.414 0l-4-4a1 1 0 010-1.414z" clipRule="evenodd" />
                                                </svg>
                                            </button>
                                        </span>
                                    </Dropdown.Trigger>
                                    <Dropdown.Content>
                                        {user.email === 'tu_correo@gmail.com' && (
                                            <Dropdown.Link href={route('superadmin.index')}>Panel Maestro</Dropdown.Link>
                                        )}
                                        <Dropdown.Link href={route('profile.edit')}>Perfil</Dropdown.Link>
                                        <Dropdown.Link href={route('logout')} method="post" as="button">Cerrar Sesión</Dropdown.Link>
                                    </Dropdown.Content>
                                </Dropdown>
                            </div>
                        </div>

                        {/* MENÚ MÓVIL (BOTÓN) */}
                        <div className="-me-2 flex items-center sm:hidden space-x-2">
                             <button onClick={toggleTheme} className="p-2 text-gray-500">
                                {theme === 'light' ? '🌙' : '☀️'}
                            </button>
                            <button onClick={() => setShowingNavigationDropdown((p) => !p)} className="inline-flex items-center justify-center rounded-md p-2 text-gray-400 hover:bg-gray-100 dark:hover:bg-gray-800 transition">
                                <svg className="h-6 w-6" stroke="currentColor" fill="none" viewBox="0 0 24 24">
                                    <path className={!showingNavigationDropdown ? 'inline-flex' : 'hidden'} strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 6h16M4 12h16M4 18h16" />
                                    <path className={showingNavigationDropdown ? 'inline-flex' : 'hidden'} strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12" />
                                </svg>
                            </button>
                        </div>
                    </div>
                </div>

                {/* MENÚ RESPONSIVO MÓVIL */}
                <div className={(showingNavigationDropdown ? 'block' : 'hidden') + ' sm:hidden bg-white dark:bg-gray-900 border-t dark:border-gray-800'}>
                    <div className="space-y-1 pb-3 pt-2">
                        <ResponsiveNavLink href={route('dashboard')} active={route().current('dashboard')}>Dashboard</ResponsiveNavLink>
                        {/* ... Repetir ResponsiveNavLinks para los demás ... */}
                    </div>
                </div>
            </nav>

            {header && (
                <header className="bg-white dark:bg-gray-900 shadow">
                    <div className="mx-auto max-w-7xl px-4 py-6 sm:px-6 lg:px-8 text-gray-800 dark:text-gray-100">
                        {header}
                    </div>
                </header>
            )}

            <main className="text-gray-900 dark:text-gray-100">
                {children}
            </main>
        </div>
    );
}