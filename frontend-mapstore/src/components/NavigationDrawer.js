import React from 'react';

const NavigationDrawer = ({ instructions, isOpen, onClose }) => {
    if (!isOpen || !instructions) return null;

    const styles = {
        container: {
            position: 'absolute',
            bottom: '20px',
            left: '20px',
            width: '300px',
            backgroundColor: 'white',
            borderRadius: '10px',
            boxShadow: '0 -2px 15px rgba(0,0,0,0.2)',
            padding: '15px',
            zIndex: 2000,
            maxHeight: '400px',
            overflowY: 'auto',
            fontFamily: "'Poppins', sans-serif"
        },
        header: {
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'center',
            borderBottom: '1px solid #eee',
            paddingBottom: '10px',
            marginBottom: '10px'
        },
        step: {
            padding: '10px',
            borderBottom: '1px solid #f0f0f0',
            fontSize: '0.9rem',
            display: 'flex',
            alignItems: 'center',
            gap: '10px'
        }
    };

    return (
        <div style={styles.container}>
            <div style={styles.header}>
                <h4 style={{ margin: 0 }}>Petunjuk Arah</h4>
                <button onClick={onClose} style={{ border: 'none', background: 'transparent', cursor: 'pointer' }}>✖</button>
            </div>
            {instructions.map((step, idx) => (
                <div key={idx} style={styles.step}>
                    <span>📍</span>
                    <span>{step}</span>
                </div>
            ))}
        </div>
    );
};

export default NavigationDrawer;
