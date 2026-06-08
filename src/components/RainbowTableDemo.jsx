import React, { useState } from 'react'
import { TableProperties, Search, ShieldX, ShieldCheck } from 'lucide-react'
import { hashSHA256 } from '../utils/sha256'

const KNOWN_HASHES = {
  'password':  '5e884898da28047151d0e56f8dc6292773603d0d6aabbdd62a11ef721d1542d8',
  'hunter2':   'f52fbd32b2b3b86ff88ef6c490628285f482af15ddcb29541f94bcf526a3f6c7',
  '123456':    '8d969eef6ecad3c29a3a629280e686cf0c3f5d5a86aff3ca12020c923adc6c92',
  'qwerty':    '65e84be33532fb784c48129675f9eff3a682b27168c0ea744b2cf58ee02337c5',
  'letmein':   '1c8bfe8f801d79745c4631d09fff36c82aa37fc4cce4fc946683d7b336b63032',
  'monkey':    '000c285457fc971f862a79b786476c78812c8897063c6fa9c045f579a3b2d63f',
}

export default function RainbowTableDemo() {
  const [query, setQuery] = useState('')
  const [result, setResult] = useState(null)
  const [liveHash, setLiveHash] = useState(null)
  const [loading, setLoading] = useState(false)

  const handleLookup = async () => {
    if (!query.trim()) return
    setLoading(true)
    setResult(null)

    const { hash } = await hashSHA256(query.trim())
    setLiveHash(hash)

    await new Promise(r => setTimeout(r, 320))

    const match = Object.entries(KNOWN_HASHES).find(([, h]) => h === hash)
    setResult({ hash, cracked: !!match, original: match?.[0] ?? null })
    setLoading(false)
  }

  const handleKeyDown = e => { if (e.key === 'Enter') handleLookup() }

  return (
    <div className="glass-card" style={{ padding: '22px 24px', marginBottom: '28px' }}>
      <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '6px' }}>
        <TableProperties size={18} color="var(--text-primary)" strokeWidth={1.75} />
        <h3 style={{ fontFamily: 'Lora, serif', fontSize: '1.05rem', fontWeight: 600, color: 'var(--text-primary)' }}>
          Rainbow Table Demo
        </h3>
      </div>
      <p style={{ fontSize: '13px', color: 'var(--text-secondary)', marginBottom: '18px', lineHeight: 1.55 }}>
        SHA-256 is <em>deterministic</em> — the same input always produces the same output.
        Attackers precompute a table of common password hashes and look them up instantly.
        Try one of the passwords below.
      </p>

      {/* Known hash table */}
      <div style={{
        marginBottom: '18px',
        borderRadius: '10px',
        overflow: 'hidden',
        border: '1px solid var(--glass-border)',
      }}>
        <div style={{
          display: 'grid',
          gridTemplateColumns: '110px 1fr',
          background: 'rgba(0,0,0,0.06)',
          padding: '7px 14px',
          fontSize: '11px',
          fontWeight: 700,
          letterSpacing: '0.07em',
          textTransform: 'uppercase',
          color: 'var(--text-muted)',
        }}>
          <span>Password</span>
          <span>SHA-256 hash (precomputed)</span>
        </div>
        {Object.entries(KNOWN_HASHES).map(([pw, hash], i) => (
          <div
            key={pw}
            onClick={() => setQuery(pw)}
            style={{
              display: 'grid',
              gridTemplateColumns: '110px 1fr',
              padding: '7px 14px',
              borderTop: '1px solid var(--glass-border)',
              cursor: 'pointer',
              transition: 'background 0.15s',
              background: i % 2 === 0 ? 'transparent' : 'rgba(0,0,0,0.02)',
            }}
            onMouseEnter={e => e.currentTarget.style.background = 'rgba(201,106,46,0.07)'}
            onMouseLeave={e => e.currentTarget.style.background = i % 2 === 0 ? 'transparent' : 'rgba(0,0,0,0.02)'}
          >
            <span style={{ fontFamily: 'DM Mono, monospace', fontSize: '12px', color: 'var(--danger-text)', fontWeight: 500 }}>
              {pw}
            </span>
            <span style={{
              fontFamily: 'DM Mono, monospace',
              fontSize: '11px',
              color: 'var(--text-muted)',
              overflow: 'hidden',
              textOverflow: 'ellipsis',
              whiteSpace: 'nowrap',
            }}>
              {hash}
            </span>
          </div>
        ))}
      </div>

      {/* Input row */}
      <div style={{ display: 'flex', gap: '10px', marginBottom: '14px' }}>
        <input
          className="input-field mono"
          value={query}
          onChange={e => { setQuery(e.target.value); setResult(null); setLiveHash(null) }}
          onKeyDown={handleKeyDown}
          placeholder="Type or click a password above…"
          style={{ flex: 1 }}
        />
        <button className="btn-primary" onClick={handleLookup} disabled={!query.trim() || loading}>
          {loading
            ? <><span className="spinner" style={{ borderTopColor: 'rgba(255,255,255,0.8)', width: '14px', height: '14px' }} /> Looking up…</>
            : <><Search size={14} strokeWidth={2.5} /> Lookup</>
          }
        </button>
      </div>

      {/* Live hash display */}
      {liveHash && (
        <div style={{
          marginBottom: '12px',
          padding: '10px 14px',
          borderRadius: '8px',
          background: 'rgba(0,0,0,0.05)',
        }}>
          <p className="section-label" style={{ marginBottom: '4px' }}>SHA-256("{query}")</p>
          <p style={{ fontFamily: 'DM Mono, monospace', fontSize: '11px', color: 'var(--text-secondary)', wordBreak: 'break-all', margin: 0 }}>
            {liveHash}
          </p>
        </div>
      )}

      {/* Result */}
      {result && (
        <div style={{
          padding: '14px 18px',
          borderRadius: '10px',
          background: result.cracked ? 'var(--danger-bg)' : 'var(--safe-bg)',
          border: `1px solid ${result.cracked ? 'var(--danger-text)' : 'var(--safe-text)'}30`,
          animation: 'fadeUp 0.3s ease forwards',
        }}>
          {result.cracked ? (
            <div>
              <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '6px' }}>
                <ShieldX size={18} color="var(--danger-text)" strokeWidth={2} />
                <span style={{ fontWeight: 700, color: 'var(--danger-text)', fontSize: '14px' }}>
                  Instantly cracked!
                </span>
                <span className="tag tag-danger">Rainbow table hit</span>
              </div>
              <p style={{ fontSize: '13px', color: 'var(--danger-text)', margin: 0 }}>
                Hash matched <code style={{ fontFamily: 'DM Mono, monospace', background: 'rgba(0,0,0,0.08)', padding: '1px 5px', borderRadius: '4px' }}>"{result.original}"</code> in the precomputed table.
                No brute force needed — just a dictionary lookup.
              </p>
            </div>
          ) : (
            <div>
              <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '6px' }}>
                <ShieldCheck size={18} color="var(--safe-text)" strokeWidth={2} />
                <span style={{ fontWeight: 700, color: 'var(--safe-text)', fontSize: '14px' }}>
                  Not in this table
                </span>
                <span className="tag tag-safe">Unknown hash</span>
              </div>
              <p style={{ fontSize: '13px', color: 'var(--safe-text)', margin: 0 }}>
                This password isn't in our demo table — but a real rainbow table contains <em>billions</em> of entries.
                SHA-256 still has <strong>no salt</strong>, so the same password always hashes identically.
              </p>
            </div>
          )}
        </div>
      )}
    </div>
  )
}
