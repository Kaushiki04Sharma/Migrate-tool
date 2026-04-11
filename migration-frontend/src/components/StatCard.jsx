import React from 'react'

export default function StatCard({ label, value, color }) {
  return (
    <div style={{
      background: 'var(--bg2)', border: '0.5px solid var(--border)',
      borderRadius: 'var(--radius-lg)', padding: '1rem 1.25rem',
    }}>
      <div style={{ fontSize: '10px', color: 'var(--text3)', textTransform: 'uppercase', letterSpacing: '0.1em', marginBottom: '6px' }}>
        {label}
      </div>
      <div style={{ fontSize: '28px', fontWeight: 600, color: color || 'var(--text)', fontFamily: 'var(--font-display)' }}>
        {value}
      </div>
    </div>
  )
}
