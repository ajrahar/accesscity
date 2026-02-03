
import React, { useState, useEffect } from 'react';
import SimpleMap from './components/SimpleMap';
import RouteForm from './components/RouteForm';
import AccessibilitySidebar from './components/AccessibilitySidebar';

function App() {
    const [backendStatus, setBackendStatus] = useState("Checking...");
    const [route, setRoute] = useState(null);
    const [highContrast, setHighContrast] = useState(false);

    useEffect(() => {
        fetch('http://localhost:8000/status')
            .then(res => res.json())
            .then(data => setBackendStatus(data.status))
            .catch(err => setBackendStatus("Offline"));
    }, []);

    const appStyle = {
        fontFamily: 'Arial, sans-serif',
        position: 'relative',
        filter: highContrast ? 'grayscale(100%) contrast(120%)' : 'none'
    };

    return (
        <div style={appStyle}>
            <header style={{
                padding: '20px',
                backgroundColor: highContrast ? '#000' : '#282c34',
                color: highContrast ? '#ff0' : 'white',
                textAlign: 'center',
                borderBottom: highContrast ? '2px solid #ff0' : 'none'
            }}>
                <h1>AccessCity Frontend 🗺️</h1>
                <p>Current Backend Status: <strong>{backendStatus}</strong></p>
            </header>

            <main style={{ padding: '0', position: 'relative' }}>
                <AccessibilitySidebar
                    route={route}
                    highContrast={highContrast}
                    onToggleContrast={() => setHighContrast(!highContrast)}
                />
                <RouteForm onRouteFound={(geom) => setRoute(geom)} />
                <SimpleMap routeGeometry={route} />
            </main>
        </div>
    );
}

export default App;
