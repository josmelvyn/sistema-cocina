import React, { useEffect, useState } from 'react';
import { MapContainer, TileLayer, Marker, Popup, useMapEvents, Polyline } from 'react-leaflet';
import 'leaflet/dist/leaflet.css';
import L from 'leaflet';

// Fix for default marker icons in React Leaflet
import markerIcon from 'leaflet/dist/images/marker-icon.png';
import markerShadow from 'leaflet/dist/images/marker-shadow.png';

let DefaultIcon = L.icon({
    iconUrl: markerIcon,
    shadowUrl: markerShadow,
    iconSize: [25, 41],
    iconAnchor: [12, 41]
});

L.Marker.prototype.options.icon = DefaultIcon;

// Custom SVG Icons for Status
const createColoredIcon = (color) => L.divIcon({
    className: 'custom-marker',
    html: `
        <div style="
            background-color: ${color};
            width: 24px;
            height: 24px;
            border-radius: 50% 50% 50% 0;
            transform: rotate(-45deg);
            border: 2px solid white;
            box-shadow: 0 0 10px rgba(0,0,0,0.3);
            display: flex;
            align-items: center;
            justify-content: center;
        ">
            <div style="
                width: 8px;
                height: 8px;
                background-color: white;
                border-radius: 50%;
                transform: rotate(45deg);
            "></div>
        </div>
    `,
    iconSize: [24, 24],
    iconAnchor: [12, 24],
});

const GreenIcon = createColoredIcon('#22c55e'); // Green-500
const AmberIcon = createColoredIcon('#f59e0b'); // Amber-500
const BlueIcon = createColoredIcon('#3b82f6');  // Blue-500

function LocationPicker({ onLocationSelected }) {
    useMapEvents({
        click(e) {
            onLocationSelected(e.latlng);
        },
    });
    return null;
}

export default function MapComponent({ escuelas = [], onSelectLocation, selectedLocation }) {
    // Default center for Dominican Republic if no schools
    const defaultCenter = [18.4861, -69.9312]; 
    
    return (
        <div className="h-[400px] w-full rounded-2xl overflow-hidden shadow-inner border border-slate-200">
            <MapContainer 
                center={selectedLocation ? [selectedLocation.lat, selectedLocation.lng] : defaultCenter} 
                zoom={8} 
                style={{ height: '100%', width: '100%' }}
            >
                <TileLayer
                    attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
                    url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
                />
                
                {/* Existing Schools */}
                {escuelas.filter(e => e.latitud && e.longitud).map(escuela => {
                    // Determine icon based on today's delivery status
                    const isDelivered = escuela.entregado_hoy > 0;
                    const icon = isDelivered ? GreenIcon : AmberIcon;
                    const statusText = isDelivered ? 'Entrega Completada' : 'Pendiente de Entrega';
                    const statusColor = isDelivered ? 'text-green-600' : 'text-amber-600';

                    return (
                        <Marker 
                            key={escuela.id} 
                            position={[escuela.latitud, escuela.longitud]}
                            icon={icon}
                        >
                            <Popup>
                                <div className="p-2 min-w-[150px]">
                                    <p className="font-bold text-slate-800 mb-0.5 leading-tight">{escuela.nombre}</p>
                                    <p className="text-[10px] text-slate-500 uppercase font-bold tracking-wider mb-2">
                                        Ruta: {escuela.ruta?.nombre || 'Sin Ruta'}
                                    </p>
                                    
                                    <div className={`text-[9px] font-black uppercase mb-3 flex items-center gap-1 ${statusColor}`}>
                                        <span className={`w-2 h-2 rounded-full ${isDelivered ? 'bg-green-500' : 'bg-amber-500 animate-pulse'}`}></span>
                                        {statusText}
                                    </div>

                                    <a 
                                        href={`https://www.google.com/maps/dir/?api=1&destination=${escuela.latitud},${escuela.longitud}`} 
                                        target="_blank" 
                                        rel="noopener noreferrer"
                                        className="inline-flex items-center justify-center w-full bg-indigo-600 text-white text-[10px] font-black uppercase py-2 px-3 rounded-lg shadow-md shadow-indigo-600/20 active:scale-95 transition-all no-underline"
                                    >
                                        <span>📍 Abrir en GPS</span>
                                    </a>
                                </div>
                            </Popup>
                        </Marker>
                    );
                })}

                {/* Selected/New Location Marker */}
                {selectedLocation && (
                    <Marker position={[selectedLocation.lat, selectedLocation.lng]} icon={BlueIcon}>
                        <Popup>Nueva Ubicación</Popup>
                    </Marker>
                )}

                {onSelectLocation && <LocationPicker onLocationSelected={onSelectLocation} />}

                {/* Route Polylines */}
                {Object.entries(
                    escuelas
                        .filter(e => e.latitud && e.longitud && e.ruta_id)
                        .reduce((acc, current) => {
                            (acc[current.ruta_id] = acc[current.ruta_id] || []).push(current);
                            return acc;
                        }, {})
                ).map(([rutaId, routeEscuelas]) => (
                    <Polyline 
                        key={`route-${rutaId}`}
                        positions={routeEscuelas.map(e => [e.latitud, e.longitud])}
                        pathOptions={{ 
                            color: '#4f46e5', // indigo-600
                            weight: 3, 
                            opacity: 0.4,
                            dashArray: '10, 10',
                            lineJoin: 'round'
                        }}
                    />
                ))}
            </MapContainer>
        </div>
    );
}
