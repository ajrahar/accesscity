import React, { useState } from 'react';

const RouteForm = ({ onRouteFound }) => {
    const [start, setStart] = useState("-7.750, 110.390"); // Default: UGM area
    const [end, setEnd] = useState("-7.755, 110.395");
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(null);

    const handleSearch = async (e) => {
        e.preventDefault();
        setLoading(true);
        setError(null);

        try {
            // Parse inputs (simple text parsing for now)
            const [lat1, lon1] = start.split(',').map(s => parseFloat(s.trim()));
            const [lat2, lon2] = end.split(',').map(s => parseFloat(s.trim()));

            const payload = {
                origin: { lat: lat1, lon: lon1 },
                destination: { lat: lat2, lon: lon2 },
                mode: "wheelchair",
                avoid_stairs: true
            };

            const response = await fetch('http://localhost:8000/api/v1/simulation/route', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(payload)
            });

            if (!response.ok) throw new Error("Failed to calculate route");

            const data = await response.json();
            onRouteFound(data.geometry); // Pass the GeoJSON LineString up

        } catch (err) {
            setError(err.message);
        } finally {
            setLoading(false);
        }
    };

    return (
        <div style={{
            position: 'absolute',
            top: '20px',
            right: '20px',
            background: 'white',
            padding: '20px',
            borderRadius: '8px',
            boxShadow: '0 2px 10px rgba(0,0,0,0.2)',
            zIndex: 1000,
            width: '300px'
        }}>
            <h3>🚀 Rute Aman</h3>
            <form onSubmit={handleSearch}>
                <div style={{ marginBottom: '10px' }}>
                    <label>Awal (Lat, Lon):</label>
                    <input
                        type="text"
                        value={start}
                        onChange={(e) => setStart(e.target.value)}
                        style={{ width: '100%', padding: '5px' }}
                    />
                </div>
                <div style={{ marginBottom: '10px' }}>
                    <label>Tujuan (Lat, Lon):</label>
                    <input
                        type="text"
                        value={end}
                        onChange={(e) => setEnd(e.target.value)}
                        style={{ width: '100%', padding: '5px' }}
                    />
                </div>
                <button
                    type="submit"
                    disabled={loading}
                    style={{
                        width: '100%',
                        padding: '10px',
                        backgroundColor: '#007bff',
                        color: 'white',
                        border: 'none',
                        borderRadius: '4px',
                        cursor: 'pointer'
                    }}
                >
                    {loading ? 'Menghitung...' : 'Cari Rute Aman'}
                </button>
            </form>
            {error && <p style={{ color: 'red', marginTop: '10px' }}>Error: {error}</p>}
        </div>
    );
};

export default RouteForm;
