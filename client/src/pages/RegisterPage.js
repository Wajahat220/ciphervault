import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Shield, Download, AlertTriangle } from 'lucide-react';
import { register } from '../services/api';
import { useAuth } from '../context/AuthContext';

export default function RegisterPage() {
  const [form, setForm] = useState({ name: '', email: '', password: '', confirm: '' });
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const [privateKey, setPrivateKey] = useState(null);
  
  // NEW: State to temporarily hold the user data until they download the key
  const [pendingUserData, setPendingUserData] = useState(null); 
  const [keySaved, setKeySaved] = useState(false);
  
  const { loginUser } = useAuth();
  const navigate = useNavigate();

  const downloadPrivateKey = (key) => {
    const blob = new Blob([key], { type: 'text/plain' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = 'ciphervault_private_key.pem';
    a.click();
    URL.revokeObjectURL(url);
    setKeySaved(true);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (form.password !== form.confirm) return setError('Passwords do not match');
    setError('');
    setLoading(true);
    try {
      const { data } = await register({ name: form.name, email: form.email, password: form.password });
      
      setPrivateKey(data.privateKey);
      setPendingUserData(data); // Store data locally, delay the login
      
    } catch (err) {
      setError(err.response?.data?.message || 'Registration failed');
    } finally {
      setLoading(false);
    }
  };

  // View: Key Download Screen
  if (privateKey) {
    return (
      <div style={{ minHeight: '100vh', background: 'var(--bg)', display: 'flex', alignItems: 'center', justifyContent: 'center', padding: 24 }}>
        <div style={{ width: '100%', maxWidth: 500 }}>
          <div className="card-cv" style={{ border: '2px solid #fbbf24' }}>
            <div style={{ display: 'flex', gap: 12, marginBottom: 20 }}>
              <AlertTriangle size={28} color="#d97706" />
              <div>
                <h2 style={{ fontSize: 20, fontWeight: 700, marginBottom: 4 }}>Save Your Private Key!</h2>
                <p style={{ color: 'var(--text-gray)', fontSize: 14 }}>This key is shown only once. It's required to sign your files. Keep it safe and never share it.</p>
              </div>
            </div>
            <textarea
              readOnly
              value={privateKey}
              style={{ width: '100%', height: 180, fontFamily: 'monospace', fontSize: 11, padding: 12, border: '1px solid var(--border)', borderRadius: 8, resize: 'none', background: '#f9fafb' }}
            />
            <div style={{ display: 'flex', gap: 12, marginTop: 16 }}>
              <button className="btn-green" onClick={() => downloadPrivateKey(privateKey)} style={{ flex: 1, display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 8 }}>
                <Download size={16} /> Download Private Key
              </button>
              <button
                className={keySaved ? 'btn-green' : 'btn-outline-green'}
                onClick={() => {
                  // NOW we log them in globally and redirect!
                  loginUser(pendingUserData);
                  navigate('/dashboard');
                }}
                disabled={!keySaved}
                style={{ flex: 1 }}
              >
                {keySaved ? 'Go to Dashboard →' : 'Download key first'}
              </button>
            </div>
          </div>
        </div>
      </div>
    );
  }

  // View: Initial Registration Form
  return (
    <div style={{ minHeight: '100vh', background: 'var(--bg)', display: 'flex', alignItems: 'center', justifyContent: 'center', padding: 24 }}>
      <div style={{ width: '100%', maxWidth: 440 }}>
        <div style={{ textAlign: 'center', marginBottom: 32 }}>
          <div style={{ width: 56, height: 56, background: '#dcfce7', borderRadius: 16, display: 'flex', alignItems: 'center', justifyContent: 'center', margin: '0 auto 16px' }}>
            <Shield size={28} color="#16a34a" />
          </div>
          <h1 style={{ fontSize: 24, fontWeight: 800 }}>Create Account</h1>
          <p style={{ color: 'var(--text-gray)', fontSize: 14 }}>An RSA key pair will be generated for you</p>
        </div>

        <div className="card-cv">
          {error && <div className="alert-danger-cv" style={{ marginBottom: 16 }}>{error}</div>}

          <form onSubmit={handleSubmit}>
            {[
              { key: 'name', label: 'Full Name', type: 'text', placeholder: 'John Doe' },
              { key: 'email', label: 'Email', type: 'email', placeholder: 'you@example.com' },
              { key: 'password', label: 'Password', type: 'password', placeholder: '••••••••' },
              { key: 'confirm', label: 'Confirm Password', type: 'password', placeholder: '••••••••' },
            ].map(field => (
              <div key={field.key} style={{ marginBottom: 16 }}>
                <label style={{ fontSize: 13, fontWeight: 600, display: 'block', marginBottom: 6 }}>{field.label}</label>
                <input
                  type={field.type}
                  className="form-control-cv"
                  placeholder={field.placeholder}
                  value={form[field.key]}
                  onChange={e => setForm({ ...form, [field.key]: e.target.value })}
                  required
                />
              </div>
            ))}

            <div style={{ background: '#fffbeb', border: '1px solid #fcd34d', borderRadius: 8, padding: '10px 14px', fontSize: 13, color: '#92400e', marginBottom: 16 }}>
              🔑 An RSA-2048 key pair will be generated. Download and keep your private key safely.
            </div>

            <button type="submit" className="btn-green" style={{ width: '100%', fontSize: 15, padding: '12px' }} disabled={loading}>
              {loading ? 'Creating account...' : 'Create Account & Generate Keys'}
            </button>
          </form>

          <p style={{ textAlign: 'center', marginTop: 20, fontSize: 14, color: 'var(--text-gray)' }}>
            Already have an account? <Link to="/login" style={{ color: 'var(--green)', fontWeight: 600 }}>Login</Link>
          </p>
        </div>
      </div>
    </div>
  );
}