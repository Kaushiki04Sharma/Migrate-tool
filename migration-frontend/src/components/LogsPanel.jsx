import React from 'react'

export default function LogsPanel({ migration, onClose }) {
  if (!migration) return null
  return (
    <div style={{
      background: 'var(--bg2)', border: '0.5px solid var(--border)',
      borderRadius: 'var(--radius-lg)', overflow: 'hidden', marginTop: '1.25rem',
    }} className="fade-up">
      <div style={{
        padding: '10px 16px', background: 'var(--bg3)',
        borderBottom: '0.5px solid var(--border)',
        display: 'flex', alignItems: 'center', justifyContent: 'space-between',
      }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
          <span style={{ fontSize: '10px', color: 'var(--text3)', textTransform: 'uppercase', letterSpacing: '0.08em' }}>Logs</span>
          <span style={{ fontSize: '12px', color: 'var(--green)' }}>{migration.name}</span>
        </div>
        <button onClick={onClose} style={{
          background: 'transparent', border: 'none', color: 'var(--text3)',
          cursor: 'pointer', fontSize: '16px', lineHeight: 1,
        }}>×</button>
      </div>
      <div style={{ padding: '12px 16px', maxHeight: '180px', overflowY: 'auto' }}>
        {migration.logs && migration.logs.length > 0
          ? migration.logs.map((log, i) => (
            <div key={i} style={{ fontSize: '12px', color: 'var(--text2)', padding: '2px 0', display: 'flex', gap: '8px' }}>
              <span style={{ color: 'var(--green)', flexShrink: 0 }}>{'>'}</span>
              <span>{log}</span>
            </div>
          ))
          : <div style={{ fontSize: '12px', color: 'var(--text3)' }}>No logs yet.</div>
        }
        {migration.gitCommitId && (
          <div style={{ fontSize: '11px', color: 'var(--text3)', marginTop: '8px', paddingTop: '8px', borderTop: '0.5px solid var(--border)' }}>
            Git commit: <span style={{ color: 'var(--purple)' }}>{migration.gitCommitId.slice(0, 10)}</span>
          </div>
        )}
      </div>
    </div>
  )
}
