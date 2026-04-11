import React, { useState } from 'react'
import toast from 'react-hot-toast'
import api from '../api'

const inp = {
  width: '100%', padding: '9px 12px', fontSize: '13px',
  background: 'var(--bg3)', border: '0.5px solid var(--border)',
  borderRadius: 'var(--radius)', color: 'var(--text)', outline: 'none',
}

export default function CreateMigrationModal({ onClose, onCreated }) {
  const [form, setForm] = useState({ name: '', version: '', up: '', down: '' })
  const [loading, setLoading] = useState(false)
  const set = (k) => (e) => setForm(f => ({ ...f, [k]: e.target.value }))

  async function submit() {
    if (!form.name || !form.version || !form.up || !form.down) {
      toast.error('All fields are required'); return
    }
    let up, down
    try { up = JSON.parse(form.up) } catch { toast.error('Invalid JSON in Up Action'); return }
    try { down = JSON.parse(form.down) } catch { toast.error('Invalid JSON in Down Action'); return }

    setLoading(true)
    try {
      await api.post('/migrations/create', { name: form.name, version: form.version, up, down })
      toast.success('Migration created!')
      onCreated()
      onClose()
    } catch (e) {
      toast.error(e.response?.data?.message || 'Failed to create migration')
    } finally { setLoading(false) }
  }

  return (
    <div style={{
      position: 'fixed', inset: 0, background: 'rgba(0,0,0,0.7)',
      display: 'flex', alignItems: 'center', justifyContent: 'center',
      zIndex: 100, padding: '1rem',
    }}>
      <div style={{
        background: 'var(--bg2)', border: '0.5px solid var(--border2)',
        borderRadius: 'var(--radius-lg)', padding: '1.75rem',
        width: '100%', maxWidth: '440px',
      }} className="fade-up">
        <div style={{ fontFamily: 'var(--font-display)', fontSize: '16px', fontWeight: 600, marginBottom: '1.5rem' }}>
          New Migration
        </div>

        {[
          { key: 'name', label: 'Migration Name', placeholder: 'e.g. add_phone_field' },
          { key: 'version', label: 'Version', placeholder: 'e.g. 001' },
          { key: 'up', label: 'Up Action (JSON)', placeholder: '{"action": "addField"}' },
          { key: 'down', label: 'Down Action (JSON)', placeholder: '{"action": "removeField"}' },
        ].map(({ key, label, placeholder }) => (
          <div key={key} style={{ marginBottom: '1rem' }}>
            <label style={{ display: 'block', fontSize: '10px', color: 'var(--text3)', textTransform: 'uppercase', letterSpacing: '0.08em', marginBottom: '5px' }}>
              {label}
            </label>
            <input style={inp} value={form[key]} onChange={set(key)} placeholder={placeholder} />
          </div>
        ))}

        <div style={{ display: 'flex', gap: '8px', justifyContent: 'flex-end', marginTop: '1.5rem' }}>
          <button onClick={onClose} style={{
            padding: '8px 16px', fontSize: '12px', fontFamily: 'var(--font-mono)',
            border: '0.5px solid var(--border2)', borderRadius: 'var(--radius)',
            background: 'transparent', color: 'var(--text2)', cursor: 'pointer',
          }}>Cancel</button>
          <button onClick={submit} disabled={loading} style={{
            padding: '8px 16px', fontSize: '12px', fontFamily: 'var(--font-mono)',
            fontWeight: 600, background: 'var(--green)', color: '#0a0c0f',
            border: 'none', borderRadius: 'var(--radius)', cursor: 'pointer',
            opacity: loading ? 0.6 : 1,
          }}>{loading ? 'Creating...' : 'Create →'}</button>
        </div>
      </div>
    </div>
  )
}
