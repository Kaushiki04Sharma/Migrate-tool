import React, { useEffect, useState } from 'react'
import toast from 'react-hot-toast'
import Navbar from '../components/Navbar'
import StatCard from '../components/StatCard'
import StatusBadge from '../components/StatusBadge'
import CreateMigrationModal from '../components/CreateMigrationModal'
import MigrationModal from '../components/MigrationModal'
import api from '../api'

export default function Dashboard() {
  const [migrations, setMigrations] = useState([])
  const [loading, setLoading] = useState(true)
  const [showCreate, setShowCreate] = useState(false)
  const [selectedLogs, setSelectedLogs] = useState(null)
  const [actionLoading, setActionLoading] = useState(null)
  const role = localStorage.getItem('role') || 'viewer'
  const [gitHistory, setGitHistory] = useState([])

async function fetchGitHistory() {
  try {
    const { data } = await api.get('/git-history')
    setGitHistory(data)
  } catch { }
}
  async function fetchMigrations() {
    try {
      const { data } = await api.get('/migrations')
      setMigrations(data)
    } catch {
      toast.error('Failed to load migrations')
    } finally { setLoading(false) }
  }

   useEffect(() => { fetchMigrations() }, [])

  async function runMigration(m) {
    if (!window.confirm(`Run migration "${m.name}"?`)) return
    setActionLoading(m._id + '_run')
    try {
      const { data } = await api.post(`/migrations/run/${m._id}`)
      toast.success('Migration completed!')
      setSelectedLogs(data)
      await fetchMigrations()
    } catch (e) {
      toast.error(e.response?.data?.error || 'Run failed')
    } finally { setActionLoading(null) }
  }

  async function rollbackMigration(m) {
    if (!window.confirm(`Rollback "${m.name}"? This will revert the Git commit.`)) return
    setActionLoading(m._id + '_rollback')
    try {
      const { data } = await api.post(`/migrations/rollback/${m._id}`)
      toast.success('Rollback successful!')
      setSelectedLogs(data)
      await fetchMigrations()
    } catch (e) {
      toast.error(e.response?.data?.error || 'Rollback failed')
    } finally { setActionLoading(null) }
  }

  const total = migrations.length
  const completed = migrations.filter(m => m.status === 'completed').length
  const failed = migrations.filter(m => m.status === 'failed').length
  const pending = migrations.filter(m => m.status === 'pending').length

  return (
    <div style={{ minHeight: '100vh', background: 'var(--bg)' }}>
      <Navbar />
      <div style={{ maxWidth: '960px', margin: '0 auto', padding: '1.5rem' }}>

        {/* Header */}
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '1.25rem', flexWrap: 'wrap', gap: '8px' }} className="fade-up">
          <div>
            <div style={{ fontFamily: 'var(--font-display)', fontSize: '20px', fontWeight: 700 }}>Migrations</div>
            <div style={{ fontSize: '12px', color: 'var(--text3)', marginTop: '2px' }}>{total} migration{total !== 1 ? 's' : ''} in database</div>
          </div>
          {(role === 'admin' || role === 'developer') && (
            <button onClick={() => setShowCreate(true)} style={{
              padding: '8px 16px', fontSize: '12px', fontFamily: 'var(--font-mono)',
              fontWeight: 600, background: 'var(--green)', color: '#0a0c0f',
              border: 'none', borderRadius: 'var(--radius)', cursor: 'pointer',
              letterSpacing: '0.04em',
            }}>+ New Migration</button>
          )}
        </div>

        {/* Stats */}
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: '10px', marginBottom: '1.25rem' }} className="fade-up-1">
          <StatCard label="Total" value={total} />
          <StatCard label="Completed" value={completed} color="var(--green)" />
          <StatCard label="Failed" value={failed} color="var(--red)" />
          <StatCard label="Pending" value={pending} color="var(--amber)" />
        </div>

        {/* Table */}
        <div style={{
          background: 'var(--bg2)', border: '0.5px solid var(--border)',
          borderRadius: 'var(--radius-lg)', overflow: 'hidden',
        }} className="fade-up-2">
          <div style={{ overflowX: 'auto' }}>
            <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: '13px' }}>
              <thead>
                <tr style={{ background: 'var(--bg3)' }}>
                  {['Name', 'Version', 'Status', 'Created', 'Actions'].map(h => (
                    <th key={h} style={{
                      padding: '10px 16px', textAlign: 'left', fontSize: '10px',
                      fontWeight: 600, color: 'var(--text3)', textTransform: 'uppercase',
                      letterSpacing: '0.08em', borderBottom: '0.5px solid var(--border)',
                      whiteSpace: 'nowrap',
                    }}>{h}</th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {loading ? (
                  <tr><td colSpan={5} style={{ padding: '3rem', textAlign: 'center', color: 'var(--text3)' }}>Loading...</td></tr>
                ) : migrations.length === 0 ? (
                  <tr><td colSpan={5} style={{ padding: '3rem', textAlign: 'center', color: 'var(--text3)' }}>
                    No migrations yet.{(role === 'admin' || role === 'developer') ? ' Create one above.' : ''}
                  </td></tr>
                ) : migrations.map((m, i) => {
                  const canRun = role === 'admin' && m.status === 'pending'
                  const canRollback = role === 'admin' && m.status === 'completed'
                  const hasLogs = m.logs && m.logs.length > 0
                  const isRunning = actionLoading === m._id + '_run'
                  const isRolling = actionLoading === m._id + '_rollback'
                  return (
                    <tr key={m._id} style={{ borderBottom: '0.5px solid var(--border)', transition: 'background 0.1s' }}
                      onMouseEnter={e => e.currentTarget.style.background = 'var(--bg3)'}
                      onMouseLeave={e => e.currentTarget.style.background = 'transparent'}>
                      <td style={{ padding: '12px 16px', fontWeight: 500, color: 'var(--text)', maxWidth: '200px', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
                        {m.name || '—'}
                      </td>
                      <td style={{ padding: '12px 16px', color: 'var(--text2)', fontFamily: 'var(--font-mono)' }}>
                        v{m.version || '—'}
                      </td>
                      <td style={{ padding: '12px 16px' }}>
                        <StatusBadge status={m.status} />
                      </td>
                      <td style={{ padding: '12px 16px', color: 'var(--text3)', whiteSpace: 'nowrap' }}>
                        {new Date(m.createdAt).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })}
                      </td>
                      <td style={{ padding: '12px 16px' }}>
                        <div style={{ display: 'flex', gap: '6px', flexWrap: 'wrap' }}>
                          {canRun && (
                            <button onClick={() => runMigration(m)} disabled={!!actionLoading} style={{
                              fontSize: '11px', padding: '4px 10px', fontFamily: 'var(--font-mono)',
                              border: '0.5px solid var(--green-dim)', borderRadius: 'var(--radius)',
                              background: 'var(--green-bg)', color: 'var(--green)', cursor: 'pointer',
                              opacity: isRunning ? 0.6 : 1,
                            }}>{isRunning ? '...' : 'Run'}</button>
                          )}
                          {canRollback && (
                            <button onClick={() => rollbackMigration(m)} disabled={!!actionLoading} style={{
                              fontSize: '11px', padding: '4px 10px', fontFamily: 'var(--font-mono)',
                              border: '0.5px solid var(--purple)', borderRadius: 'var(--radius)',
                              background: 'var(--purple-bg)', color: 'var(--purple)', cursor: 'pointer',
                              opacity: isRolling ? 0.6 : 1,
                            }}>{isRolling ? '...' : 'Rollback'}</button>
                          )}
                          {hasLogs && (
                            <button onClick={() => setSelectedLogs(m)} style={{
                              fontSize: '11px', padding: '4px 10px', fontFamily: 'var(--font-mono)',
                              border: '0.5px solid var(--border2)', borderRadius: 'var(--radius)',
                              background: 'transparent', color: 'var(--text2)', cursor: 'pointer',
                            }}>Logs</button>
                          )}
                          {!canRun && !canRollback && !hasLogs && (
                            <span style={{ fontSize: '12px', color: 'var(--text3)' }}>—</span>
                          )}
                        </div>
                      </td>
                    </tr>
                  )
                })}
              </tbody>
            </table>
          </div>
        </div>

        {selectedLogs && (
          <MigrationModal migration={selectedLogs} onClose={() => setSelectedLogs(null)} />
        )}


      </div>

      {showCreate && (
        <CreateMigrationModal onClose={() => setShowCreate(false)} onCreated={fetchMigrations} />
      )}
    </div>
  )
}
