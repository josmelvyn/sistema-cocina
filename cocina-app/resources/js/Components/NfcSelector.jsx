import React, { useState, useEffect } from 'react';
import axios from 'axios';

export default function NfcSelector({ onSelect }) {
    const [types, setTypes] = useState([]);

    useEffect(() => {
        axios.get('/api/nfc-sequences').then(res => setTypes(res.data));
    }, []);

    return (
        <div className="form-group">
            <label>Tipo de Comprobante</label>
            <select className="form-control" onChange={(e) => onSelect(e.target.value)}>
                <option value="">Seleccione...</option>
                {types.map(t => (
                    <option key={t.id} value={t.type}>
                        {t.name} (Disp: {t.final - t.current})
                    </option>
                ))}
            </select>
        </div>
    );
}