import React from 'react'

const statusMap = {
  pending:     { bg: 'var(--amber-bg)',  color: 'var(--amber)',  label: 'pending' },
  running:     { bg: 'var(--blue-bg)',   color: 'var(--blue)',   label: 'running' },
  completed:   { bg: 'var(--green-bg)',  color: 'var(--green)',  label: 'completed' },
  failed:      { bg: 'var(--red-bg)',    color: 'var(--red)',    label: 'failed' },
  rolled_back: { bg: 'var(--purple-bg)', color: 'var(--purple)', label: 'rolled back' },
}

export default function StatusBadge({ status }) {
  const s = statusMap[status] || statusMap.pending
  return (
    <span style={{
      fontSize: '10px', padding: '3px 9px', borderRadius: '999px',
      background: s.bg, color: s.color,
      fontWeight: 600, letterSpacing: '0.06em', textTransform: 'uppercase',
      display: 'inline-block',
    }}>
      {s.label}
    </span>
  )
}
