import React, { useEffect, useState } from 'react'
import Navbar from '../components/Navbar'
import api from '../api'
import toast from 'react-hot-toast'

export default function GitHistory() {
  const [history, setHistory] = useState([])
  const [loading, setLoading] = useState(true)

  async function fetchHistory() {
    setLoading(true)
    try {
      const { data } = await api.get('/git-history')
      setHistory(data)
    } catch {
      toast.error('Failed to load git history')
    } finally { setLoading(false) }
  }

  useEffect(() => { fetchHistory() }, [])

  const migrations = history.filter(c => c.message.includes('migration') && !c.message.includes('Revert'))
  const rollbacks = history.filter(c => c.message.includes('Revert'))
  const others = history.filter(c => !c.message.includes('migration') && !c.message.includes('Revert'))

  return (
    <div style={{ minHeight: '100vh', background: 'var(--bg)' }}>
      <Navbar />
      <div style={{ maxWidth: '860px', margin: '0 auto', padding: '1.5rem' }}>

        {/* Header */}
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '1.25rem' }} className="fade-up">
          <div>
            <div style={{ fontFamily: 'var(--font-display)', fontSize: '20px', fontWeight: 700 }}>Git History</div>
            <div style={{ fontSize: '12px', color: 'var(--text3)', marginTop: '2px' }}>{history.length} commits tracked</div>
          </div>
          <button onClick={fetchHistory} style={{
            padding: '8px 16px', fontSize: '12px', fontFamily: 'var(--font-mono)',
            border: '0.5px solid var(--border2)', borderRadius: 'var(--radius)',
            background: 'transparent', color: 'var(--text2)', cursor: 'pointer',
          }}>Refresh</button>
        </div>

        {/* Stats */}
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '10px', marginBottom: '1.25rem' }} className="fade-up-1">
          {[
            { label: 'Migrations Run', value: migrations.length, color: 'var(--green)' },
            { label: 'Rollbacks', value: rollbacks.length, color: 'var(--red)' },
            { label: 'Other Commits', value: others.length, color: 'var(--text2)' },
          ].map(({ label, value, color }) => (
            <div key={label} style={{ background: 'var(--bg2)', border: '0.5px solid var(--border)', borderRadius: 'var(--radius-lg)', padding: '1rem 1.25rem' }}>
              <div style={{ fontSize: '10px', color: 'var(--text3)', textTransform: 'uppercase', letterSpacing: '0.1em', marginBottom: '6px' }}>{label}</div>
              <div style={{ fontSize: '28px', fontWeight: 600, color, fontFamily: 'var(--font-display)' }}>{value}</div>
            </div>
          ))}
        </div>

        {/* Commits Table */}
        <div style={{
          background: 'var(--bg2)', border: '0.5px solid var(--border)',
          borderRadius: 'var(--radius-lg)', overflow: 'hidden',
        }} className="fade-up-2">
          <div style={{ padding: '10px 16px', background: 'var(--bg3)', borderBottom: '0.5px solid var(--border)' }}>
            <span style={{ fontSize: '10px', color: 'var(--text3)', textTransform: 'uppercase', letterSpacing: '0.08em' }}>All Commits</span>
          </div>
          <div style={{ padding: '8px 0' }}>
            {loading ? (
              <div style={{ padding: '3rem', textAlign: 'center', color: 'var(--text3)', fontSize: '13px' }}>Loading...</div>
            ) : history.length === 0 ? (
              <div style={{ padding: '3rem', textAlign: 'center', color: 'var(--text3)', fontSize: '13px' }}>No commits found.</div>
            ) : history.map((commit, i) => {
              const isRollback = commit.message.includes('Revert')
              const isMigration = commit.message.includes('migration') && !isRollback
              return (
                <div key={i} style={{
                  display: 'flex', alignItems: 'center', gap: '14px',
                  padding: '10px 16px', borderBottom: '0.5px solid var(--border)',
                  transition: 'background 0.1s',
                }}
                  onMouseEnter={e => e.currentTarget.style.background = 'var(--bg3)'}
                  onMouseLeave={e => e.currentTarget.style.background = 'transparent'}>

                  {/* Dot indicator */}
                  <div style={{
                    width: '8px', height: '8px', borderRadius: '50%', flexShrink: 0,
                    background: isRollback ? 'var(--red)' : isMigration ? 'var(--green)' : 'var(--border2)',
                  }} />

                  {/* Hash */}
                  <span style={{ fontSize: '11px', color: 'var(--purple)', fontFamily: 'var(--font-mono)', flexShrink: 0, width: '70px' }}>
                    {commit.hash}
                  </span>

                  {/* Message */}
                  <span style={{
                    fontSize: '13px', flex: 1,
                    color: isRollback ? 'var(--red)' : isMigration ? 'var(--green)' : 'var(--text2)',
                  }}>{commit.message}</span>

                  {/* Badge */}
                  <span style={{
                    fontSize: '10px', padding: '3px 10px', borderRadius: '999px', flexShrink: 0,
                    background: isRollback ? 'var(--red-bg)' : isMigration ? 'var(--green-bg)' : 'var(--bg4)',
                    color: isRollback ? 'var(--red)' : isMigration ? 'var(--green)' : 'var(--text3)',
                    fontWeight: 600, letterSpacing: '0.04em',
                  }}>
                    {isRollback ? 'rollback' : isMigration ? 'migration' : 'other'}
                  </span>
                </div>
              )
            })}
          </div>
        </div>

      </div>
    </div>
  )
}