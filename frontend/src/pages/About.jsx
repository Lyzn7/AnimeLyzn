import React, { useState } from 'react';

const About = () => {
  const [imgSrc, setImgSrc] = useState('/profil.jpg'); // place profile.jpg in /public; fallback to favicon

  return (
    <div className="container" style={{ padding: '2rem 1rem' }}>
      <div className="glass" style={{ padding: '1.5rem', borderRadius: '16px', display: 'grid', gap: '1rem' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '1rem', flexWrap: 'wrap' }}>
          <img
            src={imgSrc}
            alt="Profile"
            style={{ width: 96, height: 96, borderRadius: '12px', objectFit: 'cover', border: '1px solid var(--glass-border)', background: 'var(--bg-secondary)' }}
            onError={() => setImgSrc('/favicon.ico')}
          />
          <div>
            <p style={{ margin: 0, color: 'var(--text-secondary)', letterSpacing: '0.02em' }}>🌟 Tentang Saya</p>
            <h2 style={{ margin: '0.2rem 0 0' }}>M Naufal SJK (Lyzn)</h2>
            <p style={{ margin: '0.2rem 0', color: 'var(--text-secondary)' }}>Mahasiswa Teknologi Informatika · Universitas Alma Ata</p>
          </div>
        </div>

        <p style={{ margin: 0, color: 'var(--text-primary)' }}>
          Halo! Saya M Naufal SJK (Lyzn), seorang mahasiswa Teknologi Informatika di Universitas Alma Ata yang memiliki ketertarikan besar dalam dunia pemrograman, desain, dan pengembangan aplikasi.
          Saya senang belajar hal baru, berbagi ilmu, dan mengembangkan solusi digital yang kreatif serta bermanfaat.
        </p>
        <p style={{ margin: 0, color: 'var(--text-primary)' }}>
          Saya memiliki pengalaman mengembangkan aplikasi menggunakan Flutter, Laravel, dan Unity, serta pernah mengerjakan berbagai proyek berbasis Augmented Reality (AR), IoT, dan game edukasi.
          Bagi saya, teknologi bukan hanya tentang kode, tetapi tentang menciptakan dampak nyata bagi banyak orang.
        </p>

        <div className="glass" style={{ padding: '1rem', borderRadius: '12px', border: '1px solid var(--glass-border)' }}>
          <h3 style={{ marginTop: 0, marginBottom: '0.4rem' }}>👩‍💻 Profil Singkat</h3>
          <p style={{ margin: '0.2rem 0' }}><strong>Nama:</strong> LYZN</p>
          <p style={{ margin: '0.2rem 0' }}><strong>Bidang:</strong> Teknologi Informasi</p>
          <p style={{ margin: '0.2rem 0' }}><strong>Fokus Keahlian:</strong></p>
          <ul style={{ margin: 0, paddingLeft: '1.2rem', color: 'var(--text-secondary)' }}>
            <li>Mobile App Development (Flutter)</li>
            <li>Backend Development (Laravel, REST API)</li>
            <li>Desktop App (PySide6 / Qt)</li>
            <li>Augmented Reality (AR)</li>
            <li>Game Edukasi (Unity)</li>
            <li>IoT Dasar</li>
          </ul>
        </div>

        <div className="glass" style={{ padding: '1rem', borderRadius: '12px', border: '1px solid var(--glass-border)', display: 'grid', gap: '0.25rem' }}>
          <h3 style={{ marginTop: 0, marginBottom: '0.4rem' }}>💡 Keahlian Utama</h3>
          <div style={{ display: 'flex', flexWrap: 'wrap', gap: '0.5rem' }}>
            {[
              'Flutter & Dart',
              'Laravel & MySQL',
              'REST API Development',
              'UI/UX Design Dasar',
              'Git & GitHub',
              'Pengolahan Data & Data Mining',
              'Desain Grafis',
            ].map((skill) => (
              <span key={skill} className="glass" style={{ padding: '0.4rem 0.6rem', borderRadius: '10px', border: '1px solid var(--glass-border)', color: 'var(--text-secondary)', fontSize: '0.9rem' }}>
                {skill}
              </span>
            ))}
          </div>
        </div>

        <div className="glass" style={{ padding: '1rem', borderRadius: '12px', border: '1px solid var(--glass-border)' }}>
          <h3 style={{ marginTop: 0, marginBottom: '0.4rem' }}>🎯 Motto Hidup</h3>
          <p style={{ margin: 0, fontStyle: 'italic', color: 'var(--text-primary)' }}>
            “Belajar tanpa henti, berbagi tanpa batas, dan tumbuh bersama teknologi.”
          </p>
        </div>
      </div>
    </div>
  );
};

export default About;
