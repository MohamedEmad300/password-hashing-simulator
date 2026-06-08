import React, { useState } from 'react'
import { Eye, EyeOff, Zap, AlertTriangle } from 'lucide-react'

export default function PasswordInput({ onHash, isHashing }) {
  const [password, setPassword] = useState('')
  const [show, setShow] = useState(false)

  const handleSubmit = (e) => {
    e.preventDefault()
    if (password.trim() && !isHashing) onHash(password)
  }

  return (
    <div className="glass-card fade-up" style={{ padding: '28px 32px', marginBottom: '28px' }}>
      <p className="section-label">Step 1 — Enter a password</p>
      <form onSubmit={handleSubmit} style={{ display: 'flex', gap: '12px', alignItems: 'stretch' }}>
        <div style={{ position: 'relative', flex: 1 }}>
          <input
            className="input-field mono"
            type={show ? 'text' : 'password'}
            value={password}
            onChange={e => setPassword(e.target.value)}
            placeholder='e.g. hunter2'
            autoComplete="off"
            spellCheck={false}
            style={{ paddingRight: '48px' }}
          />
          <button
            type="button"
            onClick={() => setShow(s => !s)}
            aria-label={show ? 'Hide password' : 'Show password'}
            style={{
              position: 'absolute',
              right: '14px',
              top: '50%',
              transform: 'translateY(-50%)',
              background: 'none',
              border: 'none',
              cursor: 'pointer',
              color: 'var(--text-muted)',
              padding: '4px',
              display: 'flex',
              alignItems: 'center',
              transition: 'color 0.2s',
            }}
          >
            {show ? <EyeOff size={17} /> : <Eye size={17} />}
          </button>
        </div>

        <button
          type="submit"
          className="btn-primary"
          disabled={!password.trim() || isHashing}
        >
          {isHashing ? (
            <><span className="spinner" style={{ borderTopColor: 'rgba(255,255,255,0.8)' }} /> Hashing…</>
          ) : (
            <><Zap size={15} strokeWidth={2.5} /> Hash It</>
          )}
        </button>
      </form>

      {password && (
        <p style={{
          marginTop: '10px',
          fontSize: '12px',
          color: 'var(--text-muted)',
          fontFamily: 'DM Mono, monospace',
          display: 'flex',
          alignItems: 'center',
          gap: '6px',
        }}>
          {password.length} character{password.length !== 1 ? 's' : ''}
          {password.length < 8 && (
            <span style={{ color: 'var(--danger-text)', display: 'inline-flex', alignItems: 'center', gap: '4px' }}>
              <AlertTriangle size={12} strokeWidth={2.5} /> too short for real use
            </span>
          )}
        </p>
      )}
    </div>
  )
}
