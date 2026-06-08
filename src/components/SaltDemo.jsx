import React, { useState } from 'react'
import { FlaskConical, Zap, Lock, ShieldCheck, Play, AlertTriangle, CheckCircle } from 'lucide-react'
import { hashSHA256 } from '../utils/sha256'
import { hashBcrypt } from '../utils/bcrypt'
import { hashArgon2 } from '../utils/argon2'

function HashRow({ label, hash, color, isLoading }) {
  return (
    <div style={{ marginBottom: '10px' }}>
      <p style={{ fontSize: '11px', fontWeight: 700, color: 'var(--text-muted)', textTransform: 'uppercase', letterSpacing: '0.07em', marginBottom: '4px' }}>
        {label}
      </p>
      <div style={{
        padding: '9px 12px',
        borderRadius: '8px',
        background: isLoading ? 'rgba(0,0,0,0.04)' : `${color}12`,
        border: `1px solid ${color}30`,
        display: 'flex',
        alignItems: 'center',
        gap: '8px',
        minHeight: '40px',
      }}>
        {isLoading
          ? <><span className="spinner" style={{ borderTopColor: color, width: '14px', height: '14px', borderWidth: '2px' }} /><span style={{ fontSize: '12px', color: 'var(--text-muted)', fontStyle: 'italic' }}>Computing…</span></>
          : <span style={{ fontFamily: 'DM Mono, monospace', fontSize: '11px', color, wordBreak: 'break-all', lineHeight: 1.6 }}>{hash || '—'}</span>
        }
      </div>
    </div>
  )
}

function AlgoBlock({ title, Icon, color, run1, run2, isLoading, identical }) {
  return (
    <div style={{
      padding: '18px 20px',
      borderRadius: '12px',
      background: 'rgba(0,0,0,0.04)',
      border: `1px solid ${color}25`,
    }}>
      <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '14px' }}>
        <Icon size={15} color={color} strokeWidth={2} />
        <span style={{ fontFamily: 'Lora, serif', fontSize: '0.95rem', fontWeight: 600, color }}>{title}</span>
        {(run1 || isLoading) && !isLoading && (
          <span className={`tag ${identical ? 'tag-danger' : 'tag-safe'}`} style={{ marginLeft: 'auto', fontSize: '11px', display: 'inline-flex', alignItems: 'center', gap: '4px' }}>
            {identical
              ? <><AlertTriangle size={10} strokeWidth={2.5} /> Identical</>
              : <><CheckCircle size={10} strokeWidth={2.5} /> Different</>
            }
          </span>
        )}
      </div>

      <HashRow label="Run 1" hash={run1} color={color} isLoading={isLoading} />
      <HashRow label="Run 2" hash={run2} color={color} isLoading={isLoading} />

      {run1 && run2 && !isLoading && (
        <div style={{
          marginTop: '10px',
          padding: '8px 12px',
          borderRadius: '8px',
          background: identical ? 'var(--danger-bg)' : 'var(--safe-bg)',
          border: `1px solid ${identical ? 'var(--danger-text)' : 'var(--safe-text)'}30`,
          display: 'flex',
          alignItems: 'flex-start',
          gap: '7px',
        }}>
          {identical
            ? <AlertTriangle size={13} color="var(--danger-text)" strokeWidth={2.5} style={{ flexShrink: 0, marginTop: '1px' }} />
            : <CheckCircle size={13} color="var(--safe-text)" strokeWidth={2.5} style={{ flexShrink: 0, marginTop: '1px' }} />
          }
          <p style={{ fontSize: '12px', color: identical ? 'var(--danger-text)' : 'var(--safe-text)', margin: 0, lineHeight: 1.5 }}>
            {identical
              ? 'Same input → same output every time. A rainbow table can crack this instantly.'
              : 'Different salt each run → unique hash every time, even for the same password.'}
          </p>
        </div>
      )}
    </div>
  )
}

export default function SaltDemo({ bcryptCost, argonTimeCost, argonMemCost }) {
  const [password, setPassword] = useState('')
  const [results, setResults] = useState(null)
  const [loading, setLoading] = useState(false)

  const handleRun = async () => {
    if (!password.trim()) return
    setLoading(true)
    setResults(null)

    const [sha1, sha2, bc1, bc2, ar1, ar2] = await Promise.all([
      hashSHA256(password),
      hashSHA256(password),
      hashBcrypt(password, bcryptCost),
      hashBcrypt(password, bcryptCost),
      hashArgon2(password, argonTimeCost, argonMemCost),
      hashArgon2(password, argonTimeCost, argonMemCost),
    ])

    setResults({ sha1: sha1.hash, sha2: sha2.hash, bc1: bc1.hash, bc2: bc2.hash, ar1: ar1.hash, ar2: ar2.hash })
    setLoading(false)
  }

  return (
    <div className="glass-card" style={{ padding: '22px 24px', marginBottom: '28px' }}>
      <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '6px' }}>
        <FlaskConical size={18} color="var(--text-primary)" strokeWidth={1.75} />
        <h3 style={{ fontFamily: 'Lora, serif', fontSize: '1.05rem', fontWeight: 600, color: 'var(--text-primary)' }}>
          Salt Demonstration
        </h3>
      </div>
      <p style={{ fontSize: '13px', color: 'var(--text-secondary)', marginBottom: '18px', lineHeight: 1.55 }}>
        Hash the <em>same password twice</em> to see the effect of salting.
        bcrypt and Argon2 generate a fresh random salt each run — SHA-256 doesn't.
      </p>

      <div style={{ display: 'flex', gap: '10px', marginBottom: '20px' }}>
        <input
          className="input-field mono"
          type="text"
          value={password}
          onChange={e => { setPassword(e.target.value); setResults(null) }}
          onKeyDown={e => e.key === 'Enter' && handleRun()}
          placeholder="Enter any password…"
          style={{ flex: 1 }}
        />
        <button className="btn-primary" onClick={handleRun} disabled={!password.trim() || loading}>
          {loading
            ? <><span className="spinner" style={{ borderTopColor: 'rgba(255,255,255,0.8)', width: '14px', height: '14px' }} /> Running…</>
            : <><Play size={14} strokeWidth={2.5} /> Run x2</>
          }
        </button>
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gap: '14px' }}>
        <AlgoBlock title="SHA-256"  Icon={Zap}         color="var(--algo-sha)"    run1={results?.sha1} run2={results?.sha2} isLoading={loading} identical={results ? results.sha1 === results.sha2 : false} />
        <AlgoBlock title="bcrypt"   Icon={Lock}        color="var(--algo-bcrypt)" run1={results?.bc1}  run2={results?.bc2}  isLoading={loading} identical={results ? results.bc1 === results.bc2 : false} />
        <AlgoBlock title="Argon2id" Icon={ShieldCheck} color="var(--algo-argon)"  run1={results?.ar1}  run2={results?.ar2}  isLoading={loading} identical={results ? results.ar1 === results.ar2 : false} />
      </div>
    </div>
  )
}
