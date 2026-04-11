import React, { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import toast from 'react-hot-toast'
import api from '../api'

const styles = {
  wrap: {
    minHeight: '100vh', display: 'flex', alignItems: 'center',
    justifyContent: 'center', padding: '2rem', background: 'var(--bg)',
  },
  container: { width: '100%', maxWidth: '400px' },
  brand: {
    fontFamily: 'var(--font-display)', fontSize: '22px', fontWeight: 700,
    color: 'var(--text)', marginBottom: '2rem', display: 'flex',
    alignItems: 'center', gap: '10px',
  },
  dot: {
    width: '10px', height: '10px', borderRadius: '50%',
    background: 'var(--green)', display: 'inline-block',
    boxShadow: '0 0 10px var(--green)',
  },
  card: {
    background: 'var(--bg2)', border: '0.5px solid var(--border)',
    borderRadius: 'var(--radius-lg)', padding: '2rem',
  },
  tabs: {
    display: 'flex', marginBottom: '1.5rem',
    background: 'var(--bg3)', borderRadius: 'var(--radius)',
    padding: '3px', gap: '3px',
  },
  tab: (active) => ({
    flex: 1, padding: '7px', fontSize: '12px', fontFamily: 'var(--font-mono)',
    border: 'none', borderRadius: '6px', cursor: 'pointer',
    background: active ? 'var(--bg4)' : 'transparent',
    color: active ? 'var(--text)' : 'var(--text3)',
    fontWeight: active ? 500 : 400,
    transition: 'all 0.15s',
  }),
  field: { marginBottom: '1rem' },
  label: {
    display: 'block', fontSize: '11px', color: 'var(--text2)',
    marginBottom: '5px', textTransform: 'uppercase', letterSpacing: '0.08em',
  },
  input: {
    width: '100%', padding: '9px 12px', fontSize: '13px',
    background: 'var(--bg3)', border: '0.5px solid var(--border)',
    borderRadius: 'var(--radius)', color: 'var(--text)', outline: 'none',
    transition: 'border-color 0.15s',
  },
  select: {
    width: '100%', padding: '9px 12px', fontSize: '13px',
    background: 'var(--bg3)', border: '0.5px solid var(--border)',
    borderRadius: 'var(--radius)', color: 'var(--text)', outline: 'none',
  },
  btn: {
    width: '100%', padding: '10px', fontSize: '13px',
    fontFamily: 'var(--font-mono)', fontWeight: 600,
    background: 'var(--green)', color: '#0a0c0f',
    border: 'none', borderRadius: 'var(--radius)', cursor: 'pointer',
    marginTop: '0.5rem', letterSpacing: '0.04em',
    transition: 'opacity 0.15s',
  },
  hint: {
    marginTop: '1.25rem', fontSize: '11px', color: 'var(--text3)',
    textAlign: 'center', lineHeight: 1.8,
  },
}

export default function Login() {
  const [tab, setTab] = useState('login')
  const [loading, setLoading] = useState(false)
  const [form, setForm] = useState({ username: '', password: '', role: 'viewer' })
  const navigate = useNavigate()

  const set = (k) => (e) => setForm(f => ({ ...f, [k]: e.target.value }))

  async function doLogin() {
    if (!form.username || !form.password) { toast.error('Fill in all fields'); return }
    setLoading(true)
    try {
      const { data } = await api.post('/auth/login', { username: form.username, password: form.password })
      localStorage.setItem('token', data.token)
      const payload = JSON.parse(atob(data.token.split('.')[1]))
      localStorage.setItem('role', payload.role)
      toast.success('Welcome back!')
      navigate('/dashboard')
    } catch (e) {
      toast.error(e.response?.data?.msg || 'Login failed')
    } finally { setLoading(false) }
  }

  async function doRegister() {
    if (!form.username || !form.password) { toast.error('Fill in all fields'); return }
    setLoading(true)
    try {
      await api.post('/auth/register', { username: form.username, password: form.password, role: form.role })
      toast.success('Registered! Please login.')
      setTab('login')
    } catch (e) {
      toast.error('Registration failed')
    } finally { setLoading(false) }
  }

  return (
    <div style={styles.wrap}>
      <div style={styles.container} className="fade-up">
        <div style={styles.brand}>
          <span style={styles.dot} /> MigrateTool
        </div>
        <div style={styles.card}>
          <div style={styles.tabs}>
            <button style={styles.tab(tab === 'login')} onClick={() => setTab('login')}>Login</button>
            <button style={styles.tab(tab === 'register')} onClick={() => setTab('register')}>Register</button>
          </div>

          {tab === 'login' ? (
            <div>
              <div style={styles.field}>
                <label style={styles.label}>Username</label>
                <input style={styles.input} value={form.username} onChange={set('username')} placeholder="enter username" onKeyDown={e => e.key === 'Enter' && doLogin()} />
              </div>
              <div style={styles.field}>
                <label style={styles.label}>Password</label>
                <input style={styles.input} type="password" value={form.password} onChange={set('password')} placeholder="enter password" onKeyDown={e => e.key === 'Enter' && doLogin()} />
              </div>
              <button style={{ ...styles.btn, opacity: loading ? 0.6 : 1 }} onClick={doLogin} disabled={loading}>
                {loading ? 'Logging in...' : 'Login →'}
              </button>
            </div>
          ) : (
            <div>
              <div style={styles.field}>
                <label style={styles.label}>Username</label>
                <input style={styles.input} value={form.username} onChange={set('username')} placeholder="choose username" />
              </div>
              <div style={styles.field}>
                <label style={styles.label}>Password</label>
                <input style={styles.input} type="password" value={form.password} onChange={set('password')} placeholder="choose password" />
              </div>
              <div style={styles.field}>
                <label style={styles.label}>Role</label>
                <select style={styles.select} value={form.role} onChange={set('role')}>
                  <option value="viewer">Viewer — read only</option>
                  <option value="developer">Developer — create migrations</option>
                  <option value="admin">Admin — full access</option>
                </select>
              </div>
              <button style={{ ...styles.btn, opacity: loading ? 0.6 : 1 }} onClick={doRegister} disabled={loading}>
                {loading ? 'Registering...' : 'Register →'}
              </button>
            </div>
          )}
        </div>
        <div style={styles.hint}>
          Backend must be running on localhost:5000
        </div>
      </div>
    </div>
  )
}
