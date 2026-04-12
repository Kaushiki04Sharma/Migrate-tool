import React from 'react'
import { Routes, Route, Navigate } from 'react-router-dom'
import { Toaster } from 'react-hot-toast'
import Login from './pages/Login'
import Dashboard from './pages/Dashboard'
import GitHistory from './pages/GitHistory'

function PrivateRoute({ children }) {
  const token = localStorage.getItem('token')
  return token ? children : <Navigate to="/login" replace />
}

export default function App() {
  return (
    <>
      <Toaster
        position="top-right"
        toastOptions={{
          style: {
            background: '#1e2430',
            color: '#e8edf5',
            border: '0.5px solid #262d3a',
            fontFamily: "'JetBrains Mono', monospace",
            fontSize: '13px',
            borderRadius: '8px',
          },
          success: { iconTheme: { primary: '#00d88a', secondary: '#0a0c0f' } },
          error: { iconTheme: { primary: '#ff4d6a', secondary: '#0a0c0f' } },
        }}
      />
      <Routes>
        <Route path="/login" element={<Login />} />
        <Route path="/dashboard" element={<PrivateRoute><Dashboard /></PrivateRoute>} />
        <Route path="/git-history" element={<PrivateRoute><GitHistory /></PrivateRoute>} />
        <Route path="*" element={<Navigate to="/login" replace />} />
      </Routes>
    </>
  )
}