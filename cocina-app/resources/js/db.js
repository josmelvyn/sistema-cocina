import Dexie from 'dexie';

export const db = new Dexie('CocinaDB');

// Definimos las tablas locales (copia de lo que tienes en MySQL)
db.version(1).stores({
    platos: 'id, nombre, precio_base',
    insumos: 'id, nombre, stock_actual',
    escuelas: 'id, nombre, matricula'
});