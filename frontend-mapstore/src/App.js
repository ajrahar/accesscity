
import React, { useState, useEffect } from 'react';
import SimpleMap from './components/SimpleMap';
import RouteForm from './components/RouteForm';
import AccessibilitySidebar from './components/AccessibilitySidebar';
import LandingPage from './components/LandingPage';
import ExplanationPage from './components/ExplanationPage';
import NavigationDrawer from './components/NavigationDrawer';
import SurfaceAnalyzer from './components/SurfaceAnalyzer';

function App() {
    const [backendStatus, setBackendStatus] = useState("Checking...");
    const [route, setRoute] = useState(null);
    const [instructions, setInstructions] = useState([]);
    const [showDrawer, setShowDrawer] = useState(false);
    const [showAnalyzer, setShowAnalyzer] = useState(false);
    const [highContrast, setHighContrast] = useState(false);
    const [activeTab, setActiveTab] = useState('landing');
    const [profile, setProfile] = useState('wheelchair'); // default profile

    useEffect(() => {
        fetch('http://localhost:8000/status')
            .then(res => res.json())
            .then(data => setBackendStatus(data.status))
            .catch(err => setBackendStatus("Offline"));
    }, []);

    const handleRouteFound = (routeData) => {
        setRoute(routeData.geometry);
        if (routeData.instructions) {
            setInstructions(routeData.instructions);
            setShowDrawer(true);
        } else if (routeData.geometry && routeData.geometry.properties && routeData.geometry.properties.instructions) {
            // Backup check if instructions are inside geometry properties (GeoJSON standard)
            setInstructions(routeData.geometry.properties.instructions);
            setShowDrawer(true);
        }
    };

    const appStyle = {
        fontFamily: "'Poppins', sans-serif",
        position: 'relative',
        filter: highContrast ? 'grayscale(100%) contrast(120%)' : 'none',
        minHeight: '100vh',
        backgroundColor: '#f8f9fa'
    };

    const navStyle = {
        display: 'flex',
        justifyContent: 'center',
        padding: '15px',
        backgroundColor: highContrast ? '#000' : 'white',
        boxShadow: '0 2px 10px rgba(0,0,0,0.05)',
        position: 'sticky',
        top: 0,
        zIndex: 1000,
        borderBottom: highContrast ? '2px solid #ff0' : 'none'
    };

    const tabStyle = (isActive) => ({
        padding: '10px 20px',
        margin: '0 10px',
        cursor: 'pointer',
        fontSize: '1rem',
        fontWeight: isActive ? '600' : '400',
        color: isActive ? (highContrast ? '#ff0' : '#2980b9') : (highContrast ? '#fff' : '#7f8c8d'),
        borderBottom: isActive ? `2px solid ${highContrast ? '#ff0' : '#2980b9'}` : 'none',
        transition: 'color 0.2s',
    });

    const renderContent = () => {
        switch (activeTab) {
            case 'landing':
                return <LandingPage onStart={() => setActiveTab('map')} />;
            case 'explanation':
                return <ExplanationPage />;
            case 'map':
                return (
                    <div style={{ position: 'relative', height: 'calc(100vh - 60px)' }}>
                        <div style={{
                            padding: '10px 20px',
                            backgroundColor: highContrast ? '#000' : '#282c34',
                            color: highContrast ? '#ff0' : 'white',
                            textAlign: 'center',
                            borderBottom: highContrast ? '2px solid #ff0' : 'none'
                        }}>
                            <p style={{ margin: 0, fontSize: '0.9rem' }}>Backend Status: <strong>{backendStatus}</strong></p>
                        </div>
                        <AccessibilitySidebar
                            route={route}
                            highContrast={highContrast}
                            onToggleContrast={() => setHighContrast(!highContrast)}
                            profile={profile}
                            setProfile={setProfile}
                        />
                        <RouteForm
                            onRouteFound={handleRouteFound}
                            profile={profile}
                        />
                        <SimpleMap routeGeometry={route} />
                        <NavigationDrawer
                            instructions={instructions}
                            isOpen={showDrawer}
                            onClose={() => setShowDrawer(false)}
                        />
                        <SurfaceAnalyzer
                            isOpen={showAnalyzer}
                            onClose={() => setShowAnalyzer(false)}
                        />

                        {/* Floating Action Button for AI Camera */}
                        <button
                            onClick={() => setShowAnalyzer(true)}
                            title="AI Surface Check"
                            style={{
                                position: 'absolute',
                                bottom: '30px',
                                right: '110px', // Left of SOS button
                                width: '60px',
                                height: '60px',
                                borderRadius: '50%',
                                backgroundColor: '#9b59b6',
                                color: 'white',
                                border: 'none',
                                fontSize: '24px',
                                boxShadow: '0 4px 15px rgba(155, 89, 182, 0.4)',
                                cursor: 'pointer',
                                zIndex: 1000
                            }}
                        >
                            📷
                        </button>
                    </div>
                );
            default:
                return <LandingPage onStart={() => setActiveTab('map')} />;
        }
    };

    return (
        <div style={appStyle}>
            {activeTab !== 'landing' && (
                <nav style={navStyle}>
                    <div style={tabStyle(activeTab === 'landing')} onClick={() => setActiveTab('landing')}>Home</div>
                    <div style={tabStyle(activeTab === 'explanation')} onClick={() => setActiveTab('explanation')}>Penjelasan</div>
                    <div style={tabStyle(activeTab === 'map')} onClick={() => setActiveTab('map')}>Peta</div>
                </nav>
            )}

            <main style={{ padding: '0', position: 'relative' }}>
                {renderContent()}
            </main>
        </div>
    );
}

export default App;
