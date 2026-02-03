import React, { useEffect, useRef } from 'react';
import 'ol/ol.css';
import Map from 'ol/Map';
import View from 'ol/View';
import TileLayer from 'ol/layer/Tile';
import VectorLayer from 'ol/layer/Vector';
import VectorSource from 'ol/source/Vector';
import OSM from 'ol/source/OSM';
import GeoJSON from 'ol/format/GeoJSON';
import { Circle as CircleStyle, Fill, Stroke, Style } from 'ol/style';
import { fromLonLat } from 'ol/proj';

const SimpleMap = ({ routeGeometry }) => {
    const mapRef = useRef();
    const mapInstance = useRef(null);
    const vectorSource = useRef(new VectorSource());

    useEffect(() => {
        // Initialize Map
        const vectorLayer = new VectorLayer({
            source: vectorSource.current,
            style: new Style({
                stroke: new Stroke({
                    color: '#28a745', // Green for safe route
                    width: 5,
                }),
            }),
        });

        const map = new Map({
            target: mapRef.current,
            layers: [
                new TileLayer({
                    source: new OSM(),
                }),
                vectorLayer
            ],
            view: new View({
                center: fromLonLat([110.390, -7.750]), // Yogyakarta
                zoom: 14,
            }),
        });

        mapInstance.current = map;

        return () => map.setTarget(null);
    }, []);

    // Update map when routeGeometry changes
    useEffect(() => {
        if (routeGeometry && mapInstance.current) {
            const format = new GeoJSON({
                featureProjection: 'EPSG:3857'
            });
            const feature = format.readFeature(routeGeometry);

            vectorSource.current.clear();
            vectorSource.current.addFeature(feature);

            // Zoom to fit route
            const extent = feature.getGeometry().getExtent();
            mapInstance.current.getView().fit(extent, { padding: [50, 50, 50, 50] });
        }
    }, [routeGeometry]);

    const handleSOS = async () => {
        if (!navigator.geolocation) {
            alert("Geolocation requires HTTPS or localhost.");
            return;
        }
        navigator.geolocation.getCurrentPosition(async (pos) => {
            const { latitude, longitude } = pos.coords;
            try {
                await fetch('http://localhost:8000/api/v1/safety/sos', {
                    method: 'POST',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify({ lat: latitude, lon: longitude })
                });
                alert("🚨 SINYAL DARURAT TERKIRIM! Bantuan sedang dikirim.");
            } catch (e) {
                alert("Gagal mengirim SOS: " + e.message);
            }
        });
    };

    const handleReportObstacle = () => {
        const type = prompt("Jenis Hambatan (ketik): construction, broken_curb, stairs, flooding");
        if (!type) return;

        navigator.geolocation.getCurrentPosition(async (pos) => {
            const { latitude, longitude } = pos.coords;
            try {
                await fetch('http://localhost:8000/api/v1/community/report', {
                    method: 'POST',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify({ lat: latitude, lon: longitude, type: type })
                });
                alert("Laporan berhasil dikirim! Terima kasih.");
            } catch (e) {
                alert("Gagal mengirim laporan: " + e.message);
            }
        });
    };

    return (
        <div style={{ position: 'relative' }}>
            <div ref={mapRef} style={{ width: '100%', height: 'calc(100vh - 120px)' }}></div>

            {/* Weather Widget - Centered Top */}
            <div style={{
                position: 'absolute',
                top: '20px',
                left: '50%',
                transform: 'translateX(-50%)',
                background: 'rgba(255, 255, 255, 0.95)',
                padding: '8px 15px',
                borderRadius: '20px',
                boxShadow: '0 2px 10px rgba(0,0,0,0.1)',
                display: 'flex',
                alignItems: 'center',
                gap: '10px',
                fontFamily: "'Poppins', sans-serif",
                zIndex: 900
            }}>
                <span style={{ fontSize: '24px' }}>🌤️</span>
                <div>
                    <div style={{ fontSize: '14px', fontWeight: 'bold' }}>Yogyakarta</div>
                    <div style={{ fontSize: '12px', color: '#666' }}>Cerah 30°C</div>
                </div>
            </div>

            {/* Bottom Right Controls Stack */}
            <div style={{
                position: 'absolute',
                bottom: '30px',
                right: '30px',
                display: 'flex',
                flexDirection: 'column',
                alignItems: 'center',
                gap: '15px',
                zIndex: 1000
            }}>
                {/* Advanced Toggles (Mini FABs) */}
                <div style={{ display: 'flex', flexDirection: 'column', gap: '10px', marginBottom: '10px' }}>
                    <button title="3D Mode" style={{ width: '40px', height: '40px', borderRadius: '50%', border: 'none', background: 'white', boxShadow: '0 2px 5px rgba(0,0,0,0.2)', cursor: 'pointer', fontSize: '18px' }} onClick={() => alert("3D Mode Activated")}>🏙️</button>
                    <button title="Indoor Map" style={{ width: '40px', height: '40px', borderRadius: '50%', border: 'none', background: 'white', boxShadow: '0 2px 5px rgba(0,0,0,0.2)', cursor: 'pointer', fontSize: '18px' }} onClick={() => alert("Indoor Map: Plaza Ambarrukmo")}>🏢</button>
                    <button title="Transit" style={{ width: '40px', height: '40px', borderRadius: '50%', border: 'none', background: 'white', boxShadow: '0 2px 5px rgba(0,0,0,0.2)', cursor: 'pointer', fontSize: '18px' }} onClick={() => alert("Transit Layer On")}>🚌</button>
                </div>

                {/* Obstacle Report */}
                <button
                    onClick={handleReportObstacle}
                    title="Lapor Hambatan"
                    style={{
                        width: '50px',
                        height: '50px',
                        borderRadius: '50%',
                        backgroundColor: '#f39c12',
                        color: 'white',
                        border: 'none',
                        fontSize: '24px',
                        boxShadow: '0 4px 10px rgba(243, 156, 18, 0.4)',
                        cursor: 'pointer'
                    }}
                >
                    ⚠️
                </button>

                {/* SOS Button */}
                <button
                    onClick={handleSOS}
                    title="Sinyal Darurat"
                    style={{
                        width: '60px',
                        height: '60px',
                        borderRadius: '50%',
                        backgroundColor: '#e74c3c',
                        color: 'white',
                        border: 'none',
                        fontSize: '28px',
                        boxShadow: '0 4px 15px rgba(231, 76, 60, 0.5)',
                        cursor: 'pointer'
                    }}
                >
                    🆘
                </button>
            </div>
        </div>
    );
};

export default SimpleMap;
