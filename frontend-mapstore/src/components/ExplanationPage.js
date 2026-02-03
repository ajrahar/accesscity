import React from 'react';

const ExplanationPage = () => {
    const styles = {
        container: {
            padding: '40px',
            maxWidth: '800px',
            margin: '0 auto',
            fontFamily: "'Poppins', sans-serif",
            color: '#333',
            lineHeight: '1.6',
        },
        header: {
            fontSize: '2rem',
            fontWeight: '600',
            marginBottom: '20px',
            color: '#2c3e50',
            borderBottom: '2px solid #eee',
            paddingBottom: '10px',
        },
        section: {
            marginBottom: '30px',
        },
        subHeader: {
            fontSize: '1.4rem',
            fontWeight: '500',
            marginBottom: '10px',
            color: '#34495e',
        },
        text: {
            marginBottom: '15px',
            color: '#555',
        }
    };

    return (
        <div style={styles.container}>
            <div style={styles.section}>
                <h1 style={styles.header}>Tentang AccessCity</h1>
                <p style={styles.text}>
                    AccessCity adalah platform navigasi yang didedikasikan untuk membantu pengguna menemukan rute paling inklusif di dalam kota. Kami memahami bahwa setiap perjalanan itu unik, dan hambatan fisik tidak seharusnya menghalangi mobilitas Anda.
                </p>
            </div>

            <div style={styles.section}>
                <h2 style={styles.subHeader}>Mengapa AccessCity?</h2>
                <p style={styles.text}>
                    Banyak aplikasi peta konvensional hanya fokus pada jarak terpendek atau waktu tercepat, seringkali mengabaikan kondisi trotoar, ketersediaan ramp, atau hambatan lainnya. AccessCity memprioritaskan informasi yang relevan bagi pengguna kursi roda, orang tua, dan pejalan kaki yang membutuhkan aksesibilitas lebih.
                </p>
            </div>

            <div style={styles.section}>
                <h2 style={styles.subHeader}>Bagaimana Cara Kerjanya?</h2>
                <p style={styles.text}>
                    Cukup masukkan lokasi awal dan tujuan Anda di halaman Peta. Sistem kami akan menganalisis data jalan dan trotoar untuk menyarankan rute yang paling aman dan nyaman untuk dilewati.
                </p>
            </div>
        </div>
    );
};

export default ExplanationPage;
