import React from 'react'
import { useNavigate, useLocation } from 'react-router-dom'
import toast from 'react-hot-toast'

const roleColors = {
  admin: { bg: 'var(--green-bg)', color: 'var(--green)' },
  developer: { bg: 'var(--blue-bg)', color: 'var(--blue)' },
  viewer: { bg: 'var(--amber-bg)', color: 'var(--amber)' },
}

export default function Navbar() {
  const navigate = useNavigate()
  const location = useLocation()
  const role = localStorage.getItem('role') || 'viewer'
  const rc = roleColors[role] || roleColors.viewer

  function logout() {
    localStorage.removeItem('token')
    localStorage.removeItem('role')
    toast.success('Logged out')
    navigate('/login')
  }

  const navLink = (path, label) => (
    <button onClick={() => navigate(path)} style={{
      fontSize: '12px', padding: '5px 12px', fontFamily: 'var(--font-mono)',
      border: '0.5px solid ' + (location.pathname === path ? 'var(--green)' : 'var(--border2)'),
      borderRadius: 'var(--radius)', background: 'transparent',
      color: location.pathname === path ? 'var(--green)' : 'var(--text2)',
      cursor: 'pointer',
    }}>{label}</button>
  )

  return (
    <nav style={{
      background: 'var(--bg2)', borderBottom: '0.5px solid var(--border)',
      padding: '0 1.5rem', height: '52px', display: 'flex',
      alignItems: 'center', justifyContent: 'space-between',
      position: 'sticky', top: 0, zIndex: 50,
    }}>
      <div style={{ fontFamily: 'var(--font-display)', fontSize: '16px', fontWeight: 700, display: 'flex', alignItems: 'center', gap: '8px' }}>
        <span style={{ width: '8px', height: '8px', borderRadius: '50%', background: 'var(--green)', display: 'inline-block', boxShadow: '0 0 8px var(--green)' }} />
        MigrateTool
      </div>
      <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
        {navLink('/dashboard', 'Migrations')}
        {navLink('/git-history', 'Git History')}
        <span style={{
          fontSize: '10px', padding: '3px 9px', borderRadius: '999px',
          background: rc.bg, color: rc.color,
          textTransform: 'uppercase', letterSpacing: '0.08em', fontWeight: 600,
        }}>{role}</span>
        <button onClick={logout} style={{
          fontSize: '12px', padding: '5px 12px', fontFamily: 'var(--font-mono)',
          border: '0.5px solid var(--border2)', borderRadius: 'var(--radius)',
          background: 'transparent', color: 'var(--text2)', cursor: 'pointer',
        }}>Logout</button>
      </div>
    </nav>
  )
}