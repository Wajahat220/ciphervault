import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { Files, Upload, Shield, CheckCircle, Lock } from 'lucide-react';
import { getFiles } from '../services/api';
import { useAuth } from '../context/AuthContext';

export default function DashboardHome() {
  const { user } = useAuth();
  const [files, setFiles] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    getFiles().then(r => setFiles(r.data)).catch(() => {}).finally(() => setLoading(false));
  }, []);

  const stats = [
    { label: 'Total Files', value: files.length, icon: <Files size={20} />, color: '#16a34a' },
    { label: 'Encrypted', value: files.filter(f => f.encryptionType === 'AES').length, icon: <Lock size={20} />, color: '#2563eb' },
    { label: 'Signed', value: files.filter(f => f.isSigned).length, icon: <CheckCircle size={20} />, color: '#7c3aed' },
    { label: 'Clean Files', value: files.filter(f => f.malwareStatus === 'clean').length, icon: <Shield size={20} />, color: '#059669' },
  ];

  return (
    <div>
      <h1 className="page-title">Welcome back, {user?.name} 👋</h1>
      <p className="page-subtitle">Your encrypted file storage dashboard</p>

      {/* Stats */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: 16, marginBottom: 32 }}>
        {stats.map((s, i) => (
          <div key={i} className="stat-card">
            <div className="stat-icon" style={{ background: s.color + '18', color: s.color }}>{s.icon}</div>
            <div>
              <div style={{ fontSize: 24, fontWeight: 800 }}>{loading ? '...' : s.value}</div>
              <div style={{ fontSize: 13, color: 'var(--text-gray)' }}>{s.label}</div>
            </div>
          </div>
        ))}
      </div>

      {/* Quick Actions */}
      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 20, marginBottom: 32 }}>
        <Link to="/dashboard/upload" style={{ textDecoration: 'none' }}>
          <div className="card-cv" style={{ display: 'flex', alignItems: 'center', gap: 16, cursor: 'pointer', transition: 'transform 0.2s' }}
            onMouseEnter={e => e.currentTarget.style.transform = 'translateY(-2px)'}
            onMouseLeave={e => e.currentTarget.style.transform = 'translateY(0)'}>
            <div style={{ width: 52, height: 52, background: '#dcfce7', borderRadius: 12, display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#16a34a' }}>
              <Upload size={22} />
            </div>
            <div>
              <div style={{ fontWeight: 700, fontSize: 15 }}>Upload File</div>
              <div style={{ fontSize: 13, color: 'var(--text-gray)' }}>Encrypt and store a new file</div>
            </div>
          </div>
        </Link>

        <Link to="/dashboard/comparison" style={{ textDecoration: 'none' }}>
          <div className="card-cv" style={{ display: 'flex', alignItems: 'center', gap: 16, cursor: 'pointer', transition: 'transform 0.2s' }}
            onMouseEnter={e => e.currentTarget.style.transform = 'translateY(-2px)'}
            onMouseLeave={e => e.currentTarget.style.transform = 'translateY(0)'}>
            <div style={{ width: 52, height: 52, background: '#dbeafe', borderRadius: 12, display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#2563eb' }}>
              <Shield size={22} />
            </div>
            <div>
              <div style={{ fontWeight: 700, fontSize: 15 }}>AES vs DES</div>
              <div style={{ fontSize: 13, color: 'var(--text-gray)' }}>Run performance comparison</div>
            </div>
          </div>
        </Link>
      </div>

      {/* Recent Files */}
      <div className="card-cv">
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 16 }}>
          <h3 style={{ fontSize: 16, fontWeight: 700 }}>Recent Files</h3>
          <Link to="/dashboard/files" style={{ fontSize: 13, color: 'var(--green)', fontWeight: 600, textDecoration: 'none' }}>View all →</Link>
        </div>
        {loading ? (
          <div style={{ textAlign: 'center', padding: '32px', color: 'var(--text-gray)' }}>Loading...</div>
        ) : files.length === 0 ? (
          <div style={{ textAlign: 'center', padding: '32px', color: 'var(--text-gray)' }}>
            <Files size={40} color="#d1d5db" style={{ marginBottom: 12 }} />
            <div>No files yet. <Link to="/dashboard/upload" style={{ color: 'var(--green)' }}>Upload your first file</Link></div>
          </div>
        ) : (
          <table style={{ width: '100%', borderCollapse: 'collapse' }} className="table-cv">
            <thead>
              <tr>
                <th>File Name</th>
                <th>Encryption</th>
                <th>Malware</th>
                <th>Signed</th>
                <th>Date</th>
              </tr>
            </thead>
            <tbody>
              {files.slice(0, 5).map(f => (
                <tr key={f._id}>
                  <td style={{ fontWeight: 500 }}>{f.originalFileName}</td>
                  <td><span className="badge-encrypted">{f.encryptionType}</span></td>
                  <td><span className={f.malwareStatus === 'clean' ? 'badge-clean' : 'badge-threat'}>{f.malwareStatus}</span></td>
                  <td>{f.isSigned ? <span className="badge-signed">✔ Signed</span> : <span style={{ color: '#9ca3af', fontSize: 13 }}>No</span>}</td>
                  <td style={{ color: 'var(--text-gray)', fontSize: 13 }}>{new Date(f.uploadDate).toLocaleDateString()}</td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </div>
    </div>
  );
}
