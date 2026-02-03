import React, { useState } from 'react';

const SurfaceAnalyzer = ({ isOpen, onClose }) => {
    const [file, setFile] = useState(null);
    const [result, setResult] = useState(null);
    const [loading, setLoading] = useState(false);

    if (!isOpen) return null;

    const handleUpload = async () => {
        if (!file) return;
        setLoading(true);

        const formData = new FormData();
        formData.append('file', file);

        try {
            const res = await fetch('http://localhost:8000/api/v1/ai/analyze-surface', {
                method: 'POST',
                body: formData
            });
            const data = await res.json();
            setResult(data);
        } catch (e) {
            alert("Error analyzing image");
        } finally {
            setLoading(false);
        }
    };

    const styles = {
        overlay: {
            position: 'fixed',
            top: 0, left: 0, right: 0, bottom: 0,
            background: 'rgba(0,0,0,0.5)',
            display: 'flex',
            justifyContent: 'center',
            alignItems: 'center',
            zIndex: 3000
        },
        modal: {
            background: 'white',
            padding: '20px',
            borderRadius: '10px',
            width: '400px',
            textAlign: 'center',
            fontFamily: "'Poppins', sans-serif"
        }
    };

    return (
        <div style={styles.overlay}>
            <div style={styles.modal}>
                <h3>📸 AI Surface Analyzer</h3>
                <input type="file" onChange={(e) => setFile(e.target.files[0])} />
                <br /><br />
                <button
                    onClick={handleUpload}
                    disabled={!file || loading}
                    style={{ padding: '10px 20px', background: '#3498db', color: 'white', border: 'none', borderRadius: '5px', cursor: 'pointer' }}
                >
                    {loading ? 'Analyzing...' : 'Analyze Surface'}
                </button>
                <button onClick={onClose} style={{ marginLeft: '10px', padding: '10px', background: '#ccc', border: 'none', borderRadius: '5px', cursor: 'pointer' }}>Close</button>

                {result && (
                    <div style={{ marginTop: '20px', textAlign: 'left', background: '#f9f9f9', padding: '10px', borderRadius: '5px' }}>
                        <p><strong>Prediction:</strong> {result.prediction}</p>
                        <p><strong>Confidence:</strong> {(result.confidence * 100).toFixed(1)}%</p>
                        <p><strong>Description:</strong> {result.description}</p>
                    </div>
                )}
            </div>
        </div>
    );
};

export default SurfaceAnalyzer;
