import React from 'react';
import { Link } from 'react-router-dom';
import { Shield, Lock, Key, Database, Fingerprint, CheckCircle, ArrowRight } from 'lucide-react';

export default function LandingPage() {
  const features = [
    { icon: <Lock size={24} />, title: 'AES-256 Encryption', desc: 'Files encrypted with military-grade AES-256 before storage. Your data remains unreadable without the key.' },
    { icon: <Key size={24} />, title: 'RSA Digital Signatures', desc: 'Every file is signed with your RSA private key, proving authenticity and detecting tampering.' },
    { icon: <Shield size={24} />, title: 'Malware Detection', desc: 'SHA-256 hash-based malware scanning checks every file against a threat database before upload.' },
    { icon: <Database size={24} />, title: 'Encrypted Storage', desc: 'Files are stored in encrypted form locally. No plaintext ever touches the disk.' },
  ];

  const steps = [
    'Upload File', 'Malware Scan', 'AES Encrypt', 'Digital Sign', 'Store Securely', 'Verify & Download'
  ];

  return (
    <div style={{ background: 'var(--bg)', minHeight: '100vh' }}>
      {/* Navbar */}
      <nav className="navbar-cv">
        <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
          <Shield size={22} color="#16a34a" />
          <span style={{ fontWeight: 800, fontSize: 18, color: '#16a34a' }}>CipherVault</span>
        </div>
        <div style={{ display: 'flex', gap: 12, alignItems: 'center' }}>
          <Link to="/login" className="btn-outline-green">Login</Link>
          <Link to="/register" className="btn-green">Get Started</Link>
        </div>
      </nav>

      {/* Hero */}
      <section style={{ padding: '80px 80px 60px', maxWidth: 1100, margin: '0 auto', display: 'flex', alignItems: 'center', gap: 60 }}>
        <div style={{ flex: 1 }}>
          <div style={{ display: 'inline-flex', alignItems: 'center', gap: 6, background: '#dcfce7', color: '#15803d', padding: '4px 12px', borderRadius: 999, fontSize: 13, fontWeight: 600, marginBottom: 20 }}>
            <Shield size={14} /> Secure File Storage Portal
          </div>
          <h1 style={{ fontSize: 48, fontWeight: 800, lineHeight: 1.15, marginBottom: 20, color: '#111827' }}>
            Secure Your Files With<br />
            <span style={{ color: '#16a34a' }}>AES-256 Encryption</span>
          </h1>
          <p style={{ fontSize: 17, color: '#6b7280', lineHeight: 1.7, marginBottom: 32, maxWidth: 480 }}>
            Upload, encrypt, sign, and verify your files with enterprise-grade cryptography. Built on AES-256, RSA signatures, and SHA-256 malware detection.
          </p>
          <div style={{ display: 'flex', gap: 12 }}>
            <Link to="/register" className="btn-green" style={{ display: 'inline-flex', alignItems: 'center', gap: 6, fontSize: 15 }}>
              Get Started <ArrowRight size={16} />
            </Link>
            <Link to="/login" className="btn-outline-green" style={{ fontSize: 15 }}>Login</Link>
          </div>
        </div>
        <div style={{ flex: 1, display: 'flex', justifyContent: 'center' }}>
          <div style={{ width: 300, height: 300, background: 'linear-gradient(135deg, #dcfce7, #bbf7d0)', borderRadius: '50%', display: 'flex', alignItems: 'center', justifyContent: 'center', boxShadow: '0 20px 60px rgba(22,163,74,0.2)' }}>
            <Shield size={120} color="#16a34a" strokeWidth={1.2} />
          </div>
        </div>
      </section>

      {/* Features */}
      <section style={{ padding: '60px 80px', maxWidth: 1100, margin: '0 auto' }}>
        <h2 style={{ textAlign: 'center', fontSize: 30, fontWeight: 700, marginBottom: 8 }}>Security Features</h2>
        <p style={{ textAlign: 'center', color: '#6b7280', marginBottom: 40 }}>Full cryptographic pipeline protecting your files</p>
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: 20 }}>
          {features.map((f, i) => (
            <div key={i} className="card-cv" style={{ textAlign: 'center', transition: 'transform 0.2s', cursor: 'default' }}
              onMouseEnter={e => e.currentTarget.style.transform = 'translateY(-4px)'}
              onMouseLeave={e => e.currentTarget.style.transform = 'translateY(0)'}>
              <div style={{ width: 48, height: 48, background: '#dcfce7', borderRadius: 12, display: 'flex', alignItems: 'center', justifyContent: 'center', margin: '0 auto 16px', color: '#16a34a' }}>{f.icon}</div>
              <h3 style={{ fontSize: 15, fontWeight: 700, marginBottom: 8 }}>{f.title}</h3>
              <p style={{ fontSize: 13, color: '#6b7280', lineHeight: 1.6 }}>{f.desc}</p>
            </div>
          ))}
        </div>
      </section>

      {/* Workflow */}
      <section style={{ padding: '60px 80px', background: 'var(--white)', borderTop: '1px solid var(--border)', borderBottom: '1px solid var(--border)' }}>
        <div style={{ maxWidth: 1100, margin: '0 auto' }}>
          <h2 style={{ textAlign: 'center', fontSize: 30, fontWeight: 700, marginBottom: 40 }}>Security Pipeline</h2>
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 0, flexWrap: 'wrap' }}>
            {steps.map((s, i) => (
              <React.Fragment key={i}>
                <div style={{ textAlign: 'center', padding: '16px 20px', background: '#f8fafc', border: '1px solid var(--border)', borderRadius: 10, minWidth: 120 }}>
                  <div style={{ width: 32, height: 32, background: '#16a34a', borderRadius: '50%', color: 'white', display: 'flex', alignItems: 'center', justifyContent: 'center', margin: '0 auto 8px', fontSize: 13, fontWeight: 700 }}>{i + 1}</div>
                  <div style={{ fontSize: 12, fontWeight: 600, color: '#374151' }}>{s}</div>
                </div>
                {i < steps.length - 1 && <div style={{ width: 24, height: 2, background: '#16a34a', margin: '0 4px' }} />}
              </React.Fragment>
            ))}
          </div>
        </div>
      </section>

      {/* AES vs DES */}
      <section style={{ padding: '60px 80px', maxWidth: 1100, margin: '0 auto' }}>
        <h2 style={{ textAlign: 'center', fontSize: 30, fontWeight: 700, marginBottom: 8 }}>AES vs DES Comparison</h2>
        <p style={{ textAlign: 'center', color: '#6b7280', marginBottom: 40 }}>Understanding why AES replaced DES</p>
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 24, maxWidth: 700, margin: '0 auto' }}>
          {[
            { name: 'AES-256', keySize: '256 bits', blockSize: '128 bits', status: 'Secure ✅', color: '#16a34a', bg: '#f0fdf4', bar: '100%' },
            { name: 'DES', keySize: '56 bits', blockSize: '64 bits', status: 'Deprecated ❌', color: '#dc2626', bg: '#fef2f2', bar: '22%' }
          ].map((alg, i) => (
            <div key={i} className="card-cv" style={{ border: `2px solid ${alg.color}20` }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 16 }}>
                <span style={{ fontWeight: 700, fontSize: 18 }}>{alg.name}</span>
                <span style={{ fontSize: 12, padding: '3px 10px', borderRadius: 999, background: alg.bg, color: alg.color, fontWeight: 600 }}>{alg.status}</span>
              </div>
              <div style={{ fontSize: 13, color: '#6b7280', marginBottom: 16 }}>
                <div>Key Size: <strong>{alg.keySize}</strong></div>
                <div>Block Size: <strong>{alg.blockSize}</strong></div>
              </div>
              <div style={{ background: '#f3f4f6', borderRadius: 999, height: 8, overflow: 'hidden' }}>
                <div style={{ width: alg.bar, height: '100%', background: alg.color, borderRadius: 999, transition: 'width 1s' }} />
              </div>
              <div style={{ fontSize: 11, color: '#9ca3af', marginTop: 4 }}>Security strength</div>
            </div>
          ))}
        </div>
      </section>

      {/* Footer */}
      <footer style={{ background: 'var(--white)', borderTop: '1px solid var(--border)', padding: '24px 80px', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
          <Shield size={18} color="#16a34a" />
          <span style={{ fontWeight: 700, color: '#16a34a' }}>CipherVault</span>
        </div>
        <span style={{ fontSize: 13, color: '#9ca3af' }}>© 2024 CipherVault — Academic Security Project</span>
      </footer>
    </div>
  );
}
