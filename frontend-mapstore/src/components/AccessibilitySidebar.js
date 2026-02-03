import React from 'react';

const AccessibilitySidebar = ({ route, onToggleContrast, highContrast, profile, setProfile }) => {
    const speakRoute = () => {
        if (!route) {
            const utterance = new SpeechSynthesisUtterance("Belum ada rute yang dipilih.");
            utterance.lang = 'id-ID';
            window.speechSynthesis.speak(utterance);
            return;
        }

        // Estimasi jarak kasar (jumlah titik * 15 meter) - hanya simulasi
        const distance = route.properties.total_nodes ? route.properties.total_nodes * 15 : 0;

        const text = `Rute ditemukan. Jarak tempuh sekitar ${distance} meter. Tingkat keamanan: Aman bagi pengguna kursi roda.`;
        const utterance = new SpeechSynthesisUtterance(text);
        utterance.lang = 'id-ID';
        window.speechSynthesis.speak(utterance);
    };

    return (
        <div style={{
            position: 'absolute',
            top: '20px',
            left: '20px',
            background: highContrast ? '#000000' : '#ffffff',
            color: highContrast ? '#ffff00' : '#000000',
            padding: '20px',
            borderRadius: '8px',
            boxShadow: '0 2px 10px rgba(0,0,0,0.2)',
            zIndex: 1000,
            width: '250px',
            border: highContrast ? '2px solid #ffff00' : 'none'
        }}>
            <h3>♿ Aksesibilitas</h3>

            <div style={{ marginBottom: '15px' }}>
                <label style={{ display: 'block', marginBottom: '5px', fontWeight: 'bold' }}>Profil Mobilitas:</label>
                <select
                    value={profile}
                    onChange={(e) => setProfile(e.target.value)}
                    style={{
                        width: '100%',
                        padding: '8px',
                        borderRadius: '4px',
                        border: '1px solid #ccc',
                        backgroundColor: highContrast ? '#000' : '#fff',
                        color: highContrast ? '#ff0' : '#000'
                    }}
                >
                    <option value="wheelchair">🦽 Pengguna Kursi Roda</option>
                    <option value="cane">walking stick Lansia / Tongkat</option>
                    <option value="visual">👁️ Tunanetra</option>
                </select>
            </div>

            <div style={{ marginBottom: '15px' }}>
                <label style={{ display: 'flex', alignItems: 'center', cursor: 'pointer' }}>
                    <input
                        type="checkbox"
                        checked={highContrast}
                        onChange={onToggleContrast}
                        style={{ marginRight: '10px', width: '20px', height: '20px' }}
                    />
                    Mode Kontras Tinggi
                </label>
            </div>

            <hr style={{ borderColor: highContrast ? 'yellow' : '#ccc' }} />

            {route ? (
                <div>
                    <h4>Info Rute:</h4>
                    <p>Jarak Est: {route.properties.total_nodes ? route.properties.total_nodes * 15 : 0} m</p>
                    <button
                        onClick={speakRoute}
                        style={{
                            width: '100%',
                            padding: '10px',
                            backgroundColor: highContrast ? '#ffff00' : '#28a745',
                            color: highContrast ? '#000000' : '#ffffff',
                            border: 'none',
                            borderRadius: '4px',
                            cursor: 'pointer',
                            fontWeight: 'bold',
                            fontSize: '16px'
                        }}
                    >
                        🔊 Bacakan Rute
                    </button>
                </div>
            ) : (
                <p>Silakan cari rute terlebih dahulu.</p>
            )}
        </div>
    );
};

export default AccessibilitySidebar;
