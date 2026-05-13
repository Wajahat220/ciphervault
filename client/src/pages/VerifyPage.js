import React, { useEffect, useState } from 'react';
import { CheckCircle, XCircle, Shield } from 'lucide-react';
import { getFiles, verifyFile } from '../services/api';

export default function VerifyPage() {
  const [files, setFiles] = useState([]);
  const [selected, setSelected] = useState('');
  const [result, setResult] = useState(null);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    getFiles().then(r => setFiles(r.data.filter(f => f.isSigned))).catch(() => {});
  }, []);

  const handleVerify = async () => {
    if (!selected) return;
    setLoading(true);
    setResult(null);
    try {
      const { data } = await verifyFile(selected);
      setResult(data);
    } catch {
      setResult({ verified: false, message: 'Verification request failed.' });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div>
      <h1 className="page-title">Verify Digital Signature</h1>
      <p className="page-subtitle">Confirm file authenticity using RSA public key verification</p>

      <div style={{ display: 'grid', gridTemplateColumns: '1fr 340px', gap: 24 }}>
        <div>
          <div className="card-cv" style={{ marginBottom: 20 }}>
            <label style={{ fontSize: 13, fontWeight: 600, display: 'block', marginBottom: 8 }}>Select a signed file</label>
            <select
              className="form-control-cv"
              value={selected}
              onChange={e => { setSelected(e.target.value); setResult(null); }}
              style={{ marginBottom: 16 }}
            >
              <option value="">— Choose a file —</option>
              {files.map(f => (
                <option key={f._id} value={f._id}>{f.originalFileName}</option>
              ))}
            </select>

            {files.length === 0 && (
              <div style={{ color: 'var(--text-gray)', fontSize: 13 }}>No signed files found. Upload a file with your private key to create a signature.</div>
            )}

            <button
              className="btn-green"
              onClick={handleVerify}
              disabled={!selected || loading}
              style={{ fontSize: 14, padding: '10px 24px' }}
            >
              {loading ? 'Verifying...' : 'Verify Signature'}
            </button>
          </div>

          {result && (
            <div style={{
              background: result.verified ? '#f0fdf4' : '#fef2f2',
              border: `1px solid ${result.verified ? '#bbf7d0' : '#fecaca'}`,
              borderRadius: 12,
              padding: 24,
            }}>
              <div style={{ display: 'flex', gap: 12, alignItems: 'center', marginBottom: 12 }}>
                {result.verified
                  ? <CheckCircle size={28} color="#16a34a" />
                  : <XCircle size={28} color="#dc2626" />}
                <div>
                  <div style={{ fontWeight: 700, fontSize: 16, color: result.verified ? '#15803d' : '#dc2626' }}>
                    {result.verified ? 'Signature Valid ✅' : 'Signature Invalid ❌'}
                  </div>
                </div>
              </div>
              <p style={{ fontSize: 14, color: result.verified ? '#166534' : '#991b1b', marginBottom: 12 }}>
                {result.message}
              </p>
              {result.fileHash && (
                <div style={{ fontFamily: 'monospace', fontSize: 11, color: '#6b7280', wordBreak: 'break-all', background: '#f9fafb', padding: 10, borderRadius: 6 }}>
                  SHA-256: {result.fileHash}
                </div>
              )}
              {result.uploadedBy && (
                <div style={{ fontSize: 13, marginTop: 8, color: '#6b7280' }}>Uploaded by: <strong>{result.uploadedBy}</strong></div>
              )}
            </div>
          )}
        </div>

        {/* Info */}
        <div className="card-cv">
          <h3 style={{ fontSize: 15, fontWeight: 700, marginBottom: 16 }}>How it works</h3>
          {[
            { step: '1', title: 'File was signed', desc: 'At upload, the file hash was signed with the uploader\'s RSA private key.' },
            { step: '2', title: 'Signature stored', desc: 'The digital signature was saved in the database alongside the file.' },
            { step: '3', title: 'Verification', desc: 'The stored public key verifies the signature against the current file hash.' },
            { step: '4', title: 'Result', desc: 'If they match, the file is authentic and untampered. If not, the file may be modified.' },
          ].map((item, i) => (
            <div key={i} style={{ display: 'flex', gap: 12, marginBottom: 14 }}>
              <div style={{ width: 24, height: 24, background: '#16a34a', borderRadius: '50%', color: 'white', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 11, fontWeight: 700, flexShrink: 0 }}>{item.step}</div>
              <div>
                <div style={{ fontWeight: 600, fontSize: 13 }}>{item.title}</div>
                <div style={{ fontSize: 12, color: 'var(--text-gray)' }}>{item.desc}</div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
