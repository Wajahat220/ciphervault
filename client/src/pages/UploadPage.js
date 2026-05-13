import React, { useState, useRef } from 'react';
import { Upload, CheckCircle, AlertTriangle, X } from 'lucide-react';
import { uploadFile } from '../services/api';

const STEPS = ['Scanning for malware', 'Encrypting with AES-256', 'Generating RSA signature', 'Storing securely'];

export default function UploadPage() {
  const [file, setFile] = useState(null);
  const [privateKey, setPrivateKey] = useState('');
  const [dragging, setDragging] = useState(false);
  const [uploading, setUploading] = useState(false);
  const [step, setStep] = useState(-1);
  const [result, setResult] = useState(null);
  const [error, setError] = useState('');
  const fileInputRef = useRef();

  const handleDrop = (e) => {
    e.preventDefault();
    setDragging(false);
    const dropped = e.dataTransfer.files[0];
    if (dropped) setFile(dropped);
  };

  const handleUpload = async () => {
    if (!file) return setError('Please select a file');
    setError('');
    setResult(null);
    setUploading(true);
    setStep(0);

    // Simulate step progression
    const interval = setInterval(() => {
      setStep(prev => (prev < STEPS.length - 1 ? prev + 1 : prev));
    }, 700);

    try {
      const fd = new FormData();
      fd.append('file', file);
      if (privateKey.trim()) fd.append('privateKey', privateKey.trim());
      const { data } = await uploadFile(fd);
      clearInterval(interval);
      setStep(STEPS.length);
      setResult(data);
    } catch (err) {
      clearInterval(interval);
      setStep(-1);
      setError(err.response?.data?.message || 'Upload failed');
    } finally {
      setUploading(false);
    }
  };

  const reset = () => {
    setFile(null);
    setResult(null);
    setError('');
    setStep(-1);
    setPrivateKey('');
  };

  const formatSize = (bytes) => bytes < 1024 * 1024
    ? `${(bytes / 1024).toFixed(1)} KB`
    : `${(bytes / (1024 * 1024)).toFixed(1)} MB`;

  return (
    <div>
      <h1 className="page-title">Upload File</h1>
      <p className="page-subtitle">Files are scanned, encrypted with AES-256, and optionally signed with your RSA key</p>

      <div style={{ display: 'grid', gridTemplateColumns: '1fr 380px', gap: 24 }}>
        <div>
          {/* Drop Zone */}
          {!file && (
            <div
              className={`drop-zone ${dragging ? 'active' : ''}`}
              onDragOver={e => { e.preventDefault(); setDragging(true); }}
              onDragLeave={() => setDragging(false)}
              onDrop={handleDrop}
              onClick={() => fileInputRef.current.click()}
            >
              <Upload size={40} color="#9ca3af" style={{ marginBottom: 12 }} />
              <div style={{ fontWeight: 600, marginBottom: 4 }}>Drag and drop your file here</div>
              <div style={{ color: 'var(--text-gray)', fontSize: 14 }}>or click to browse — max 50 MB</div>
              <input ref={fileInputRef} type="file" hidden onChange={e => setFile(e.target.files[0])} />
            </div>
          )}

          {/* Selected File */}
          {file && !result && (
            <div className="card-cv" style={{ marginBottom: 16 }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <div>
                  <div style={{ fontWeight: 600 }}>{file.name}</div>
                  <div style={{ fontSize: 13, color: 'var(--text-gray)' }}>{formatSize(file.size)} • {file.type || 'Unknown type'}</div>
                </div>
                <button onClick={reset} style={{ background: 'none', border: 'none', cursor: 'pointer', color: '#9ca3af' }}><X size={18} /></button>
              </div>
            </div>
          )}

          {/* Private Key (optional) */}
          {file && !result && (
            <div className="card-cv" style={{ marginBottom: 16 }}>
              <label style={{ fontSize: 13, fontWeight: 600, display: 'block', marginBottom: 6 }}>
                Private Key <span style={{ color: '#9ca3af', fontWeight: 400 }}>(optional — required for digital signature)</span>
              </label>
              <textarea
                className="form-control-cv"
                placeholder="Paste your PEM private key here..."
                value={privateKey}
                onChange={e => setPrivateKey(e.target.value)}
                style={{ height: 100, fontFamily: 'monospace', fontSize: 11, resize: 'vertical' }}
              />
            </div>
          )}

          {/* Upload Progress */}
          {uploading && step >= 0 && (
            <div className="card-cv" style={{ marginBottom: 16 }}>
              <div style={{ fontWeight: 600, marginBottom: 12 }}>Processing...</div>
              {STEPS.map((s, i) => (
                <div key={i} className={`progress-step ${i < step ? 'done' : i === step ? 'loading' : 'waiting'}`}>
                  {i < step ? <CheckCircle size={16} /> : i === step ? <div className="spinner-border spinner-border-sm" style={{ width: 16, height: 16, borderWidth: 2 }} /> : <div style={{ width: 16, height: 16, borderRadius: '50%', border: '2px solid #d1d5db' }} />}
                  {s}
                </div>
              ))}
            </div>
          )}

          {/* Result */}
          {result && (
            <div className="alert-success-cv" style={{ marginBottom: 16 }}>
              <div style={{ display: 'flex', gap: 8, alignItems: 'center', fontWeight: 700, marginBottom: 8 }}>
                <CheckCircle size={18} /> File uploaded successfully!
              </div>
              <div style={{ fontSize: 13 }}>
                <div>🔒 Encrypted: <strong>{result.file?.encryptionType}</strong></div>
                <div>🛡 Malware: <strong>{result.file?.malwareStatus}</strong></div>
                <div>✍ Signature: <strong>{result.file?.digitalSignature}</strong></div>
                <div style={{ fontFamily: 'monospace', fontSize: 11, marginTop: 6, wordBreak: 'break-all', color: '#6b7280' }}>
                  Hash: {result.file?.fileHash}
                </div>
              </div>
              <button className="btn-outline-green" onClick={reset} style={{ marginTop: 12, fontSize: 13, padding: '8px 16px' }}>Upload Another</button>
            </div>
          )}

          {/* Error */}
          {error && (
            <div className="alert-danger-cv" style={{ marginBottom: 16 }}>
              <div style={{ display: 'flex', gap: 8, alignItems: 'center' }}>
                <AlertTriangle size={16} /> {error}
              </div>
            </div>
          )}

          {file && !result && (
            <button className="btn-green" onClick={handleUpload} disabled={uploading} style={{ fontSize: 15, padding: '12px 32px' }}>
              {uploading ? 'Uploading...' : 'Encrypt & Upload'}
            </button>
          )}
        </div>

        {/* Info Panel */}
        <div>
          <div className="card-cv">
            <h3 style={{ fontSize: 15, fontWeight: 700, marginBottom: 16 }}>Upload Pipeline</h3>
            {[
              { icon: '🔍', title: 'Malware Scan', desc: 'SHA-256 hash checked against threat database' },
              { icon: '🔒', title: 'AES-256 Encrypt', desc: 'File encrypted before touching the disk' },
              { icon: '✍️', title: 'RSA Signature', desc: 'Optional digital signature with your private key' },
              { icon: '💾', title: 'Secure Storage', desc: 'Only encrypted bytes stored on server' },
            ].map((item, i) => (
              <div key={i} style={{ display: 'flex', gap: 12, marginBottom: 16 }}>
                <div style={{ fontSize: 20 }}>{item.icon}</div>
                <div>
                  <div style={{ fontWeight: 600, fontSize: 13 }}>{item.title}</div>
                  <div style={{ fontSize: 12, color: 'var(--text-gray)' }}>{item.desc}</div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
