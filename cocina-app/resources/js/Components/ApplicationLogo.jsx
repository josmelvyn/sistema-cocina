export default function ApplicationLogo(props) {
    return (
        <svg
            {...props}
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="1.5"
            strokeLinecap="round"
            strokeLinejoin="round"
            className={`${props.className} text-orange-500`} // Forzamos el color naranja
        >
            {/* Gorro de Chef */}
            <path d="M6 18h12a2 2 0 0 0 2-2v-2a6 6 0 0 0-12 0v2a2 2 0 0 0 2 2Z" />
            <path d="M9 14.5a3 3 0 0 1 6 0" />
            <path d="M15 18v2a2 2 0 0 1-2 2h-2a2 2 0 0 1-2-2v-2" />
            
            {/* Cubiertos a los lados */}
            <path d="M2 14h2" />
            <path d="M20 14h2" />
            <path d="M12 2v2" />
        </svg>
    );
}