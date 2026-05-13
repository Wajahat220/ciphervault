import React from 'react';
import { Outlet, NavLink, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import {
  Shield, Upload, Files, CheckCircle, BarChart2,
  LogOut, LayoutDashboard
} from 'lucide-react';

export default function DashboardLayout() {
  const { user, logoutUser } = useAuth();
  const navigate = useNavigate();

  const handleLogout = () => {
    logoutUser();
    navigate('/');
  };

  const links = [
    { to: '/dashboard', label: 'Dashboard', icon: <LayoutDashboard size={18} />, end: true },
    { to: '/dashboard/upload', label: 'Upload File', icon: <Upload size={18} /> },
    { to: '/dashboard/files', label: 'My Files', icon: <Files size={18} /> },
    { to: '/dashboard/verify', label: 'Verify Signature', icon: <CheckCircle size={18} /> },
    { to: '/dashboard/comparison', label: 'AES vs DES', icon: <BarChart2 size={18} /> },
  ];

  return (
    <div style={{ display: 'flex' }}>
      {/* Sidebar */}
      <nav className="sidebar">
        <div className="sidebar-logo">
          <Shield size={22} color="#16a34a" />
          <span>CipherVault</span>
        </div>

        {links.map((l) => (
          <NavLink
            key={l.to}
            to={l.to}
            end={l.end}
            className={({ isActive }) => `sidebar-link ${isActive ? 'active' : ''}`}
          >
            {l.icon}
            {l.label}
          </NavLink>
        ))}

        <div style={{ marginTop: 'auto', padding: '20px 20px 0', borderTop: '1px solid var(--border)', marginTop: '32px' }}>
          <div style={{ fontSize: 13, color: 'var(--text-gray)', marginBottom: 12 }}>
            <div style={{ fontWeight: 600, color: 'var(--text-dark)' }}>{user?.name}</div>
            <div style={{ fontSize: 12 }}>{user?.email}</div>
          </div>
          <button className="sidebar-link" onClick={handleLogout} style={{ color: '#dc2626' }}>
            <LogOut size={18} /> Logout
          </button>
        </div>
      </nav>

      {/* Main */}
      <main className="main-content">
        <Outlet />
      </main>
    </div>
  );
}
