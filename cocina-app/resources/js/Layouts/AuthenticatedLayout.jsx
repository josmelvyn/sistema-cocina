import ApplicationLogo from '@/Components/ApplicationLogo';
import Dropdown from '@/Components/Dropdown';
import NavLink from '@/Components/NavLink';
import ResponsiveNavLink from '@/Components/ResponsiveNavLink';
import { Link, usePage } from '@inertiajs/react';
import { useState, useEffect } from 'react'; // <-- Importamos useEffect

export default function AuthenticatedLayout({ header, children }) {
    const user = usePage().props.auth.user;
    const [showingNavigationDropdown, setShowingNavigationDropdown] = useState(false);
    
    // --- LÓGICA DE ESTADO OFFLINE ---
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
        <div className="min-h-screen bg-gray-100">
            {/* BARRA DE ALERTA OFFLINE */}
            {!isOnline && (
                <div className="bg-red-600 text-white text-[10px] font-black uppercase py-2 text-center animate-pulse sticky top-0 z-50 tracking-widest">
                    ⚠️ Sin conexión: Estás trabajando en modo local (Offline)
                </div>
            )}

            <nav className="border-b border-gray-100 bg-white">
                <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
                    <div className="flex h-16 justify-between">
                        <div className="flex">
                            <div className="flex shrink-0 items-center">
                                <Link href="/dashboard">
                                    <ApplicationLogo className="block h-9 w-auto fill-current text-gray-800" />
                                </Link>
                            </div>

                            <div className="hidden space-x-8 sm:-my-px sm:ms-10 sm:flex">
                                <NavLink href={route('dashboard')} active={route().current('dashboard')}>Inicio</NavLink>
                                <NavLink href={route('rutas.index')} active={route().current('rutas.*')}>Rutas</NavLink>
                                <NavLink href={route('escuelas.index')} active={route().current('escuelas.*')}>Escuelas</NavLink>
                                <NavLink href={route('insumos.index')} active={route().current('insumos.*')}>Insumos</NavLink>
                                <NavLink href={route('recetas.index')} active={route().current('recetas.*')}>Recetas</NavLink>
                                <NavLink href={route('conduces.index')} active={route().current('conduces.*')}>Conduces</NavLink>
                                <NavLink href={route('platos.index')} active={route().current('platos.*')}>Platos</NavLink>
                                <NavLink href={route('contabilidad.index')} active={route().current('contabilidad.*')}>Contabilidad</NavLink>
                                
                                {/* ENLACE DE USUARIOS ($12 USD) - Solo para Admin */}
                                {user.rol === 'admin' && (
                                    <NavLink href={route('usuarios.index')} active={route().current('usuarios.*')}>
                                        Personal
                                    </NavLink>
                                )}
                            </div>
                        </div>

                        <div className="hidden sm:ms-6 sm:flex sm:items-center">
                            <div className="relative ms-3">
                                <Dropdown>
                                    <Dropdown.Trigger>
                                        <span className="inline-flex rounded-md">
                                            <button type="button" className="inline-flex items-center rounded-md border border-transparent bg-white px-3 py-2 text-sm font-medium leading-4 text-gray-500 transition duration-150 ease-in-out hover:text-gray-700 focus:outline-none">
                                                {user.name}
                                                <svg className="-me-0.5 ms-2 h-4 w-4" xmlns="http://www.w3.org" viewBox="0 0 20 20" fill="currentColor">
                                                 <path fillRule="evenodd" d="M5.293 7.293a1 1 0 011.414 0L10 10.586l3.293-3.293a1 1 0 111.414 1.414l-4 4a1 1 0 01-1.414 0l-4-4a1 1 0 010-1.414z" clipRule="evenodd" />
                                                    </svg>
                                            </button>
                                        </span>
                                    </Dropdown.Trigger>

                                    <Dropdown.Content>
                                        {/* ACCESO AL PANEL MAESTRO (Solo si eres tú) */}
                                        {user.email === 'tu_correo@gmail.com' && (
                                            <Dropdown.Link href={route('superadmin.index')}>Panel Maestro</Dropdown.Link>
                                        )}
                                        <Dropdown.Link href={route('profile.edit')}>Perfil</Dropdown.Link>
                                        <Dropdown.Link href={route('logout')} method="post" as="button">Cerrar Sesión</Dropdown.Link>
                                    </Dropdown.Content>
                                </Dropdown>
                            </div>
                        </div>

                        <div className="-me-2 flex items-center sm:hidden">
                            <button onClick={() => setShowingNavigationDropdown((previousState) => !previousState)} className="inline-flex items-center justify-center rounded-md p-2 text-gray-400 transition duration-150 ease-in-out hover:bg-gray-100 hover:text-gray-500 focus:bg-gray-100 focus:text-gray-500 focus:outline-none">
                                <svg className="h-6 w-6" stroke="currentColor" fill="none" viewBox="0 0 24 24">
                                    <path className={!showingNavigationDropdown ? 'inline-flex' : 'hidden'} strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 6h16M4 12h16M4 18h16" />
                                    <path className={showingNavigationDropdown ? 'inline-flex' : 'hidden'} strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12" />
                                </svg>
                            </button>
                        </div>
                    </div>
                </div>

                {/* MENÚ RESPONSIVO */}
                <div className={(showingNavigationDropdown ? 'block' : 'hidden') + ' sm:hidden'}>
                    <div className="space-y-1 pb-3 pt-2">
                        <ResponsiveNavLink href={route('dashboard')} active={route().current('dashboard')}>Dashboard</ResponsiveNavLink>
                        <ResponsiveNavLink href={route('rutas.index')} active={route().current('rutas.*')}>Rutas</ResponsiveNavLink>
                        <ResponsiveNavLink href={route('escuelas.index')} active={route().current('escuelas.*')}>Escuelas</ResponsiveNavLink>
                        <ResponsiveNavLink href={route('insumos.index')} active={route().current('insumos.*')}>Insumos</ResponsiveNavLink>
                        <ResponsiveNavLink href={route('recetas.index')} active={route().current('recetas.*')}>Recetas</ResponsiveNavLink>
                        <ResponsiveNavLink href={route('conduces.index')} active={route().current('conduces.*')}>Conduces</ResponsiveNavLink>
                        <ResponsiveNavLink href={route('platos.index')} active={route().current('platos.*')}>Platos</ResponsiveNavLink>
                        <ResponsiveNavLink href={route('contabilidad.index')} active={route().current('contabilidad.*')}>Contabilidad</ResponsiveNavLink>
                        {user.rol === 'admin' && (
                            <ResponsiveNavLink href={route('usuarios.index')} active={route().current('usuarios.*')}>Personal</ResponsiveNavLink>
                        )}
                    </div>
                </div>
            </nav>

            {header && (
                <header className="bg-white shadow">
                    <div className="mx-auto max-w-7xl px-4 py-6 sm:px-6 lg:px-8">{header}</div>
                </header>
            )}

            <main>{children}</main>
        </div>
    );
}