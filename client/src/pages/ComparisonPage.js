import React, { useState } from 'react';
import { BarChart2, Zap } from 'lucide-react';
import { getComparison } from '../services/api';

export default function ComparisonPage() {
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const runTest = async () => {
    setLoading(true);
    setError('');
    try {
      const { data: res } = await getComparison();
      setData(res);
    } catch {
      setError('Test failed. Make sure you are connected to the server.');
    } finally {
      setLoading(false);
    }
  };

  const maxTime = data
    ? Math.max(data.aes.encryptionTimeMs, data.aes.decryptionTimeMs, data.des.encryptionTimeMs, data.des.decryptionTimeMs)
    : 1;

  const Bar = ({ value, color }) => (
    <div style={{ background: '#f3f4f6', borderRadius: 999, height: 10, overflow: 'hidden', marginTop: 4 }}>
      <div style={{ width: `${(value / maxTime) * 100}%`, height: '100%', background: color, borderRadius: 999, transition: 'width 0.8s ease' }} />
    </div>
  );

  return (
    <div>
      <h1 className="page-title">AES vs DES Comparison</h1>
      <p className="page-subtitle">Educational performance comparison — 100 KB test data</p>

      <div style={{ marginBottom: 24 }}>
        <button className="btn-green" onClick={runTest} disabled={loading} style={{ display: 'flex', alignItems: 'center', gap: 8, fontSize: 15, padding: '12px 28px' }}>
          <Zap size={16} /> {loading ? 'Running test...' : 'Run Performance Test'}
        </button>
      </div>

      {error && <div className="alert-danger-cv" style={{ marginBottom: 16 }}>{error}</div>}

      {/* Static info cards (always visible) */}
      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 20, marginBottom: 24 }}>
        {[
          {
            name: 'AES-256-CBC', badge: 'Secure ✅', badgeColor: '#16a34a', badgeBg: '#dcfce7',
            border: '#16a34a',
            specs: [
              { label: 'Key Size', value: '256 bits' },
              { label: 'Block Size', value: '128 bits' },
              { label: 'Status', value: 'Industry Standard' },
              { label: 'Year Adopted', value: '2001 (NIST)' },
            ],
            desc: 'AES-256 is the gold standard for symmetric encryption. Used everywhere from TLS to disk encryption.',
          },
          {
            name: 'DES-CBC', badge: 'Deprecated ❌', badgeColor: '#dc2626', badgeBg: '#fee2e2',
            border: '#dc2626',
            specs: [
              { label: 'Key Size', value: '56 bits (effective)' },
              { label: 'Block Size', value: '64 bits' },
              { label: 'Status', value: 'Cryptographically broken' },
              { label: 'Retired', value: '1999 (cracked in 22h)' },
            ],
            desc: 'DES is included only for educational comparison. It should NEVER be used in any real system.',
          }
        ].map((alg, i) => (
          <div key={i} className="card-cv" style={{ border: `2px solid ${alg.border}20` }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 16 }}>
              <h3 style={{ fontSize: 17, fontWeight: 700 }}>{alg.name}</h3>
              <span style={{ fontSize: 12, padding: '3px 10px', borderRadius: 999, background: alg.badgeBg, color: alg.badgeColor, fontWeight: 600 }}>{alg.badge}</span>
            </div>
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 8, marginBottom: 14 }}>
              {alg.specs.map((s, j) => (
                <div key={j} style={{ background: '#f9fafb', borderRadius: 8, padding: '8px 12px' }}>
                  <div style={{ fontSize: 11, color: '#9ca3af', marginBottom: 2 }}>{s.label}</div>
                  <div style={{ fontSize: 13, fontWeight: 600 }}>{s.value}</div>
                </div>
              ))}
            </div>
            <p style={{ fontSize: 13, color: '#6b7280', lineHeight: 1.6 }}>{alg.desc}</p>
          </div>
        ))}
      </div>

      {/* Performance Results */}
      {data && (
        <div className="card-cv">
          <h3 style={{ fontSize: 16, fontWeight: 700, marginBottom: 4 }}>Performance Results — {data.testSizeKB} KB test</h3>
          <p style={{ fontSize: 13, color: '#6b7280', marginBottom: 20 }}>Lower is faster. Times in milliseconds.</p>

          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 24 }}>
            {[
              { label: 'AES Encryption', value: data.aes.encryptionTimeMs, color: '#16a34a' },
              { label: 'DES Encryption', value: data.des.encryptionTimeMs, color: '#dc2626' },
              { label: 'AES Decryption', value: data.aes.decryptionTimeMs, color: '#16a34a' },
              { label: 'DES Decryption', value: data.des.decryptionTimeMs, color: '#dc2626' },
            ].map((item, i) => (
              <div key={i}>
                <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: 13 }}>
                  <span style={{ fontWeight: 600 }}>{item.label}</span>
                  <span style={{ fontWeight: 700, color: item.color }}>{item.value.toFixed(3)} ms</span>
                </div>
                <Bar value={item.value} color={item.color} />
              </div>
            ))}
          </div>

          <div style={{ marginTop: 24, background: '#f8fafc', border: '1px solid var(--border)', borderRadius: 8, padding: 16 }}>
            <div style={{ fontWeight: 700, marginBottom: 4 }}>📌 Verdict</div>
            <p style={{ fontSize: 14, color: '#374151', lineHeight: 1.6 }}>{data.verdict}</p>
          </div>
        </div>
      )}

      {/* Comparison table */}
      <div className="card-cv" style={{ marginTop: 20 }}>
        <h3 style={{ fontSize: 15, fontWeight: 700, marginBottom: 16 }}>Feature Comparison</h3>
        <table style={{ width: '100%', borderCollapse: 'collapse' }} className="table-cv">
          <thead>
            <tr><th>Feature</th><th>AES-256</th><th>DES</th></tr>
          </thead>
          <tbody>
            {[
              ['Key Length', '256 bits', '56 bits'],
              ['Block Size', '128 bits', '64 bits'],
              ['Security', '✅ Strong', '❌ Broken'],
              ['Performance', '✅ Fast', '⚠️ Slower on modern hardware'],
              ['Recommended', '✅ Yes', '❌ Never in production'],
              ['Brute force resistance', '✅ 2^256 combinations', '❌ Cracked in <1 day'],
            ].map(([feat, aes, des], i) => (
              <tr key={i}>
                <td style={{ fontWeight: 600 }}>{feat}</td>
                <td style={{ color: '#15803d' }}>{aes}</td>
                <td style={{ color: '#dc2626' }}>{des}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
