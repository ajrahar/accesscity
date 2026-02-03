import React, { useState } from 'react';

const RouteForm = ({ onRouteFound, profile }) => {
    const [start, setStart] = useState("Universitas Gadjah Mada");
    const [end, setEnd] = useState("Tugu Yogyakarta");
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(null);

    const geocode = async (query) => {
        const response = await fetch('http://localhost:8000/api/v1/simulation/geocode', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ query: query })
        });
        if (!response.ok) throw new Error(`Location not found: ${query}`);
        const result = await response.json();
        return result.data; // { lat, lon, address }
    };

    const handleSearch = async (e) => {
        e.preventDefault();
        setLoading(true);
        setError(null);

        try {
            // 1. Geocode Start
            const startCoords = await geocode(start);
            // 2. Geocode End
            const endCoords = await geocode(end);

            const payload = {
                origin: { lat: startCoords.lat, lon: startCoords.lon },
                destination: { lat: endCoords.lat, lon: endCoords.lon },
                mode: "wheelchair",
                profile: profile, // Use the selected profile
                avoid_stairs: true
            };

            const response = await fetch('http://localhost:8000/api/v1/simulation/route', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(payload)
            });

            if (!response.ok) throw new Error("Failed to calculate route");

            const data = await response.json();
            // Pass the whole data object so we can access instructions
            if (data.geometry) {
                // Inject instructions into properties if backend didn't (resilience)
                if (data.geometry.properties && !data.geometry.properties.instructions) {
                    // If for some reason backend sends it separately, adapt here.
                    // But our backend sends it in geometry.properties.
                }
            }
            onRouteFound(data);

        } catch (err) {
            setError(err.message);
        } finally {
            setLoading(false);
        }
    };

    const handleVoiceInput = (field) => {
        if (!('webkitSpeechRecognition' in window)) {
            alert("Browser Anda tidak mendukung Voice Input.");
            return;
        }
        const recognition = new window.webkitSpeechRecognition();
        recognition.lang = 'id-ID';
        recognition.start();

        recognition.onresult = (event) => {
            const transcript = event.results[0][0].transcript;
            if (field === 'start') setStart(transcript);
            else setEnd(transcript);
        };

        recognition.onerror = (e) => console.error("Voice Error:", e);
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
                    <label>Awal (Lokasi/Alamat):</label>
                    <div style={{ display: 'flex', gap: '5px' }}>
                        <input
                            type="text"
                            value={start}
                            onChange={(e) => setStart(e.target.value)}
                            style={{ flex: 1, padding: '5px' }}
                        />
                        <button type="button" onClick={() => handleVoiceInput('start')}>🎤</button>
                    </div>
                </div>
                <div style={{ marginBottom: '10px' }}>
                    <label>Tujuan (Lokasi/Alamat):</label>
                    <div style={{ display: 'flex', gap: '5px' }}>
                        <input
                            type="text"
                            value={end}
                            onChange={(e) => setEnd(e.target.value)}
                            style={{ flex: 1, padding: '5px' }}
                        />
                        <button type="button" onClick={() => handleVoiceInput('end')}>🎤</button>
                    </div>
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
