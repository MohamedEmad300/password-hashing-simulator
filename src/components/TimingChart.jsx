import React, { useEffect, useState } from 'react'
import { BarChart2, Zap, Lock, ShieldCheck } from 'lucide-react'

const BARS = [
  { key: 'sha256', label: 'SHA-256',  color: 'var(--algo-sha)',    Icon: Zap },
  { key: 'bcrypt', label: 'bcrypt',   color: 'var(--algo-bcrypt)', Icon: Lock },
  { key: 'argon2', label: 'Argon2id', color: 'var(--algo-argon)',  Icon: ShieldCheck },
]

function formatTime(ms) {
  if (ms === null || ms === undefined) return null
  if (ms < 1) return `${(ms * 1000).toFixed(0)} µs`
  if (ms < 1000) return `${ms.toFixed(1)} ms`
  return `${(ms / 1000).toFixed(2)} s`
}

export default function TimingChart({ times }) {
  const [animated, setAnimated] = useState(false)

  const values = BARS.map(b => times[b.key] ?? null)
  const max = Math.max(...values.filter(v => v !== null), 1)

  useEffect(() => {
    setAnimated(false)
    const id = requestAnimationFrame(() => {
      requestAnimationFrame(() => setAnimated(true))
    })
    return () => cancelAnimationFrame(id)
  }, [times])

  const hasAny = values.some(v => v !== null)

  return (
    <div className="glass-card" style={{ padding: '22px 24px', marginBottom: '28px' }}>
      <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '20px' }}>
        <BarChart2 size={18} color="var(--text-primary)" strokeWidth={1.75} />
        <h3 style={{ fontFamily: 'Lora, serif', fontSize: '1.05rem', fontWeight: 600, color: 'var(--text-primary)' }}>
          Compute Time Comparison
        </h3>
        {hasAny && (
          <span className="tag tag-default" style={{ marginLeft: 'auto', fontSize: '11px' }}>
            log scale
          </span>
        )}
      </div>

      {!hasAny ? (
        <p style={{ fontSize: '13px', color: 'var(--text-muted)', fontStyle: 'italic', textAlign: 'center', padding: '20px 0' }}>
          Hash a password to see the timing comparison
        </p>
      ) : (
        <div style={{ display: 'flex', flexDirection: 'column', gap: '14px' }}>
          {BARS.map(bar => {
            const raw = times[bar.key]
            const safeRaw = raw ?? 0.00001

            const logVal = Math.log10(safeRaw + 0.001)
            const logMax = Math.log10(max + 0.001)
            const logMin = Math.log10(0.001)
            const pct = ((logVal - logMin) / (logMax - logMin)) * 100
            const width = Math.max(pct, raw !== null ? 4 : 0)

            return (
              <div key={bar.key}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '6px' }}>
                  <span style={{ fontSize: '13px', fontWeight: 600, color: bar.color, display: 'flex', alignItems: 'center', gap: '5px' }}>
                    <bar.Icon size={13} strokeWidth={2} /> {bar.label}
                  </span>
                  <span style={{
                    fontFamily: 'DM Mono, monospace',
                    fontSize: '12px',
                    color: raw !== null ? bar.color : 'var(--text-muted)',
                    fontWeight: 500,
                  }}>
                    {raw !== null ? formatTime(raw) : '—'}
                  </span>
                </div>
                <div style={{
                  height: '10px',
                  borderRadius: '99px',
                  background: 'rgba(0,0,0,0.07)',
                  overflow: 'hidden',
                }}>
                  <div style={{
                    height: '100%',
                    width: animated ? `${width}%` : '0%',
                    borderRadius: '99px',
                    background: `linear-gradient(90deg, ${bar.color}99, ${bar.color})`,
                    transition: 'width 0.7s cubic-bezier(0.22,1,0.36,1)',
                    boxShadow: `0 0 8px ${bar.color}60`,
                  }} />
                </div>
              </div>
            )
          })}

          {times.sha256 !== null && times.bcrypt !== null && (
            <p style={{
              marginTop: '6px',
              fontSize: '12px',
              color: 'var(--text-muted)',
              fontStyle: 'italic',
              textAlign: 'right',
            }}>
              bcrypt is ~{Math.round(times.bcrypt / (times.sha256 || 0.00001)).toLocaleString()}x slower than SHA-256
            </p>
          )}
        </div>
      )}
    </div>
  )
}
