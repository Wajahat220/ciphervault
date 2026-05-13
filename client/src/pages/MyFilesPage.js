import React, { useEffect, useState } from 'react';
import { Download, Trash2, CheckCircle, Files } from 'lucide-react';
import { getFiles, downloadFile, deleteFile, verifyFile } from '../services/api';
import { Link } from 'react-router-dom';

export default function MyFilesPage() {
  const [files, setFiles] = useState([]);
  const [loading, setLoading] = useState(true);
  const [actionMsg, setActionMsg] = useState(null);

  const load = () => {
    getFiles().then(r => setFiles(r.data)).catch(() => {}).finally(() => setLoading(false));
  };

  useEffect(() => { load(); }, []);

  const handleDownload = async (file) => {
    try {
      const { data } = await downloadFile(file._id);
      const url = URL.createObjectURL(new Blob([data]));
      const a = document.createElement('a');
      a.href = url;
      a.download = file.originalFileName;
      a.click();
      URL.revokeObjectURL(url);
    } catch {
      setActionMsg({ type: 'error', text: 'Download failed' });
    }
  };

  const handleDelete = async (id) => {
    if (!window.confirm('Delete this file permanently?')) return;
    try {
      await deleteFile(id);
      setFiles(f => f.filter(x => x._id !== id));
      setActionMsg({ type: 'success', text: 'File deleted.' });
    } catch {
      setActionMsg({ type: 'error', text: 'Delete failed.' });
    }
  };

  const handleVerify = async (id) => {
    try {
      const { data } = await verifyFile(id);
      setActionMsg({ type: data.verified ? 'success' : 'error', text: data.message });
    } catch {
      setActionMsg({ type: 'error', text: 'Verification failed.' });
    }
  };

  const formatSize = (bytes) => bytes < 1024 * 1024
    ? `${(bytes / 1024).toFixed(1)} KB`
    : `${(bytes / (1024 * 1024)).toFixed(1)} MB`;

  return (
    <div>
      <h1 className="page-title">My Files</h1>
      <p className="page-subtitle">All your encrypted files — download, verify, or delete</p>

      {actionMsg && (
        <div className={actionMsg.type === 'success' ? 'alert-success-cv' : 'alert-danger-cv'} style={{ marginBottom: 16, display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          {actionMsg.text}
          <button onClick={() => setActionMsg(null)} style={{ background: 'none', border: 'none', cursor: 'pointer', fontSize: 18 }}>×</button>
        </div>
      )}

      <div className="card-cv" style={{ padding: 0, overflow: 'hidden' }}>
        {loading ? (
          <div style={{ textAlign: 'center', padding: 40, color: 'var(--text-gray)' }}>Loading files...</div>
        ) : files.length === 0 ? (
          <div style={{ textAlign: 'center', padding: 48 }}>
            <Files size={48} color="#d1d5db" style={{ marginBottom: 12 }} />
            <div style={{ fontWeight: 600, marginBottom: 4 }}>No files yet</div>
            <div style={{ color: 'var(--text-gray)', fontSize: 14 }}>
              <Link to="/dashboard/upload" style={{ color: 'var(--green)' }}>Upload your first file</Link>
            </div>
          </div>
        ) : (
          <table style={{ width: '100%', borderCollapse: 'collapse' }} className="table-cv">
            <thead>
              <tr>
                <th>File Name</th>
                <th>Size</th>
                <th>Encryption</th>
                <th>Malware</th>
                <th>Signature</th>
                <th>Date</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              {files.map(f => (
                <tr key={f._id}>
                  <td style={{ fontWeight: 500 }}>{f.originalFileName}</td>
                  <td style={{ color: 'var(--text-gray)', fontSize: 13 }}>{formatSize(f.fileSize)}</td>
                  <td><span className="badge-encrypted">{f.encryptionType}</span></td>
                  <td><span className={f.malwareStatus === 'clean' ? 'badge-clean' : 'badge-threat'}>{f.malwareStatus}</span></td>
                  <td>{f.isSigned ? <span className="badge-signed">✔ Signed</span> : <span style={{ fontSize: 13, color: '#9ca3af' }}>—</span>}</td>
                  <td style={{ color: 'var(--text-gray)', fontSize: 13 }}>{new Date(f.uploadDate).toLocaleDateString()}</td>
                  <td>
                    <div style={{ display: 'flex', gap: 6 }}>
                      <button title="Download" onClick={() => handleDownload(f)}
                        style={{ background: '#f0fdf4', border: 'none', borderRadius: 6, padding: '6px 8px', cursor: 'pointer', color: '#16a34a' }}>
                        <Download size={14} />
                      </button>
                      {f.isSigned && (
                        <button title="Verify Signature" onClick={() => handleVerify(f._id)}
                          style={{ background: '#f0f9ff', border: 'none', borderRadius: 6, padding: '6px 8px', cursor: 'pointer', color: '#0284c7' }}>
                          <CheckCircle size={14} />
                        </button>
                      )}
                      <button title="Delete" onClick={() => handleDelete(f._id)}
                        style={{ background: '#fef2f2', border: 'none', borderRadius: 6, padding: '6px 8px', cursor: 'pointer', color: '#dc2626' }}>
                        <Trash2 size={14} />
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </div>
    </div>
  );
}
