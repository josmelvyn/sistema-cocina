import Dexie from 'dexie';

export const db = new Dexie('CocinaDB');

// Definimos las tablas locales (copia de lo que tienes en MySQL) y la cola de sincronización PWA
db.version(2).stores({
    platos: 'id, nombre, precio_base',
    insumos: 'id, nombre, stock_actual, unidad_medida',
    escuelas: 'id, nombre, ruta_id, director',
    rutas: 'id, nombre, chofer',
    conduces: 'id, escuela_id, plato_id, cantidad_entregada, estado, _offline', 
    sync_queue: '++id, action, route, payload, timestamp, status, errorMessage', // pending, error
    cache: 'key, data' // Para stats y otros fragmentos
});