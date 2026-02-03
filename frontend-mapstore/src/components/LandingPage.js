import React from 'react';

const LandingPage = ({ onStart }) => {
    const styles = {
        container: {
            height: '100vh',
            display: 'flex',
            flexDirection: 'column',
            justifyContent: 'center',
            alignItems: 'center',
            textAlign: 'center',
            backgroundColor: '#ffffff',
            color: '#333333',
            fontFamily: "'Poppins', sans-serif",
            padding: '20px',
        },
        title: {
            fontSize: '3rem',
            fontWeight: '700',
            marginBottom: '1rem',
            color: '#2c3e50',
        },
        subtitle: {
            fontSize: '1.2rem',
            fontWeight: '300',
            marginBottom: '2.5rem',
            color: '#7f8c8d',
            maxWidth: '600px',
        },
        button: {
            padding: '12px 30px',
            fontSize: '1rem',
            fontWeight: '600',
            color: '#ffffff',
            backgroundColor: '#3498db',
            border: 'none',
            borderRadius: '50px',
            cursor: 'pointer',
            transition: 'transform 0.2s, background-color 0.2s',
            boxShadow: '0 4px 15px rgba(52, 152, 219, 0.3)',
        },
        buttonHover: {
            backgroundColor: '#2980b9',
            transform: 'translateY(-2px)',
        }
    };

    return (
        <div style={styles.container}>
            <h1 style={styles.title}>AccessCity</h1>
            <p style={styles.subtitle}>
                Menjelajahi kota dengan inklusif. Temukan rute yang ramah aksesibilitas dan nikmati perjalanan Anda tanpa hambatan.
            </p>
            <button
                style={styles.button}
                onClick={onStart}
                onMouseOver={(e) => Object.assign(e.target.style, styles.buttonHover)}
                onMouseOut={(e) => {
                    e.target.style.backgroundColor = styles.button.backgroundColor;
                    e.target.style.transform = 'none';
                }}
            >
                Mulai Sekarang
            </button>
        </div>
    );
};

export default LandingPage;
