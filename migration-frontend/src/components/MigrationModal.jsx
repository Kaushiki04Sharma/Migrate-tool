import React from 'react'
import StatusBadge from './StatusBadge'

export default function MigrationModal({ migration, onClose }) {
  if (!migration) return null

  return (
    <div style={{
      position: 'fixed', inset: 0, background: 'rgba(0,0,0,0.75)',
      display: 'flex', alignItems: 'center', justifyContent: 'center',
      zIndex: 100, padding: '1rem',
    }} onClick={onClose}>
      <div style={{
        background: 'var(--bg2)', border: '0.5px solid var(--border2)',
        borderRadius: 'var(--radius-lg)', padding: '1.75rem',
        width: '100%', maxWidth: '520px', maxHeight: '80vh',
        overflowY: 'auto',
      }} onClick={e => e.stopPropagation()} className="fade-up">

        {/* Header */}
        <div style={{ display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between', marginBottom: '1.25rem' }}>
          <div>
            <div style={{ fontFamily: 'var(--font-display)', fontSize: '16px', fontWeight: 700, marginBottom: '6px' }}>
              {migration.name}
            </div>
            <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
              <span style={{ fontSize: '11px', color: 'var(--text3)', fontFamily: 'var(--font-mono)' }}>v{migration.version}</span>
              <StatusBadge status={migration.status} />
            </div>
          </div>
          <button onClick={onClose} style={{
            background: 'transparent', border: 'none',
            color: 'var(--text3)', cursor: 'pointer', fontSize: '20px', lineHeight: 1,
          }}>×</button>
        </div>

        {/* Details */}
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '10px', marginBottom: '1.25rem' }}>
          {[
            { label: 'Created', value: new Date(migration.createdAt).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' }) },
            { label: 'Status', value: migration.status },
            { label: 'Git Commit', value: migration.gitCommitId ? migration.gitCommitId.slice(0, 10) : 'None' },
            { label: 'Logs Count', value: migration.logs?.length || 0 },
          ].map(({ label, value }) => (
            <div key={label} style={{
              background: 'var(--bg3)', borderRadius: 'var(--radius)',
              padding: '10px 14px',
            }}>
              <div style={{ fontSize: '10px', color: 'var(--text3)', textTransform: 'uppercase', letterSpacing: '0.08em', marginBottom: '4px' }}>{label}</div>
              <div style={{ fontSize: '13px', color: label === 'Git Commit' ? 'var(--purple)' : 'var(--text)', fontFamily: label === 'Git Commit' ? 'var(--font-mono)' : 'inherit' }}>{value}</div>
            </div>
          ))}
        </div>

        {/* Up / Down Actions */}
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '10px', marginBottom: '1.25rem' }}>
          {[
            { label: 'Up Action', value: migration.up, color: 'var(--green)' },
            { label: 'Down Action', value: migration.down, color: 'var(--red)' },
          ].map(({ label, value, color }) => (
            <div key={label} style={{ background: 'var(--bg3)', borderRadius: 'var(--radius)', padding: '10px 14px' }}>
              <div style={{ fontSize: '10px', color: color, textTransform: 'uppercase', letterSpacing: '0.08em', marginBottom: '6px' }}>{label}</div>
              <pre style={{ fontSize: '11px', color: 'var(--text2)', fontFamily: 'var(--font-mono)', margin: 0, whiteSpace: 'pre-wrap' }}>
                {JSON.stringify(value, null, 2)}
              </pre>
            </div>
          ))}
        </div>

        {/* Logs */}
        <div style={{ background: 'var(--bg3)', borderRadius: 'var(--radius)', padding: '10px 14px' }}>
          <div style={{ fontSize: '10px', color: 'var(--text3)', textTransform: 'uppercase', letterSpacing: '0.08em', marginBottom: '8px' }}>Execution Logs</div>
          {migration.logs && migration.logs.length > 0
            ? migration.logs.map((log, i) => (
              <div key={i} style={{ fontSize: '12px', color: 'var(--text2)', padding: '3px 0', display: 'flex', gap: '8px', fontFamily: 'var(--font-mono)' }}>
                <span style={{ color: 'var(--green)', flexShrink: 0 }}>{'>'}</span>
                <span>{log}</span>
              </div>
            ))
            : <div style={{ fontSize: '12px', color: 'var(--text3)' }}>No logs yet.</div>
          }
        </div>

      </div>
    </div>
  )
}