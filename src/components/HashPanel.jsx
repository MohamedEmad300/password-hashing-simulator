import React, { useState } from 'react'
import { Zap, Lock, ShieldCheck, Timer, Copy, Check, AlertTriangle } from 'lucide-react'

const ALGO_META = {
  sha256: {
    label: 'SHA-256',
    color: 'var(--algo-sha)',
    bg: 'var(--algo-sha-bg)',
    tagClass: 'tag-sha',
    Icon: Zap,
    warning: 'Never use for passwords — no salt, instant to compute, vulnerable to rainbow tables.',
  },
  bcrypt: {
    label: 'bcrypt',
    color: 'var(--algo-bcrypt)',
    bg: 'var(--algo-bcrypt-bg)',
    tagClass: 'tag-bcrypt',
    Icon: Lock,
    warning: null,
    badge: 'Salted · Slow by design',
  },
  argon2: {
    label: 'Argon2id',
    color: 'var(--algo-argon)',
    bg: 'var(--algo-argon-bg)',
    tagClass: 'tag-argon',
    Icon: ShieldCheck,
    warning: null,
    badge: 'PHC Winner · Memory-hard',
  },
}

function formatTime(ms) {
  if (ms === null || ms === undefined) return '—'
  if (ms < 1) return `${(ms * 1000).toFixed(0)} µs`
  if (ms < 1000) return `${ms.toFixed(1)} ms`
  return `${(ms / 1000).toFixed(2)} s`
}

export default function HashPanel({ algo, hash, timeMs, isLoading, style }) {
  const [copied, setCopied] = useState(false)
  const meta = ALGO_META[algo]
  const { Icon } = meta

  const handleCopy = () => {
    if (!hash) return
    navigator.clipboard.writeText(hash)
    setCopied(true)
    setTimeout(() => setCopied(false), 1800)
  }

  return (
    <div
      className="glass-card"
      style={{
        padding: '22px 24px',
        borderTop: `3px solid ${meta.color}`,
        ...style,
      }}
    >
      {/* Header row */}
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '14px', gap: '8px' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
          <Icon size={18} color={meta.color} strokeWidth={2} />
          <h3 style={{
            fontFamily: 'Lora, serif',
            fontSize: '1.05rem',
            fontWeight: 600,
            color: meta.color,
          }}>
            {meta.label}
          </h3>
          {meta.badge && !isLoading && hash && (
            <span className={`tag ${meta.tagClass}`} style={{ fontSize: '11px' }}>
              {meta.badge}
            </span>
          )}
        </div>

        {/* Timing badge */}
        <div style={{
          display: 'flex',
          alignItems: 'center',
          gap: '6px',
          padding: '4px 12px',
          borderRadius: '99px',
          background: meta.bg,
          border: `1px solid ${meta.color}30`,
        }}>
          {isLoading
            ? <span className="spinner" style={{ width: '12px', height: '12px', borderWidth: '2px', borderTopColor: meta.color }} />
            : <Timer size={12} color={meta.color} strokeWidth={2} />
          }
          <span style={{
            fontFamily: 'DM Mono, monospace',
            fontSize: '12px',
            fontWeight: 500,
            color: meta.color,
          }}>
            {isLoading ? 'computing…' : formatTime(timeMs)}
          </span>
        </div>
      </div>

      {/* Hash output */}
      <div style={{
        position: 'relative',
        background: 'rgba(0,0,0,0.06)',
        borderRadius: '10px',
        padding: '12px 44px 12px 14px',
        minHeight: '52px',
        display: 'flex',
        alignItems: 'center',
      }}>
        {isLoading ? (
          <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
            <span className="spinner" style={{ borderTopColor: meta.color }} />
            <span style={{ fontSize: '13px', color: 'var(--text-muted)', fontStyle: 'italic' }}>
              Computing hash…
            </span>
          </div>
        ) : hash ? (
          <p style={{
            fontFamily: 'DM Mono, monospace',
            fontSize: '11.5px',
            color: 'var(--text-primary)',
            wordBreak: 'break-all',
            lineHeight: 1.6,
            margin: 0,
          }}>
            {hash}
          </p>
        ) : (
          <p style={{ fontSize: '13px', color: 'var(--text-muted)', fontStyle: 'italic', margin: 0 }}>
            Hash output will appear here
          </p>
        )}

        {hash && !isLoading && (
          <button
            onClick={handleCopy}
            title="Copy hash"
            style={{
              position: 'absolute',
              right: '10px',
              top: '10px',
              background: 'none',
              border: 'none',
              cursor: 'pointer',
              color: copied ? 'var(--safe-text)' : 'var(--text-muted)',
              opacity: 0.7,
              transition: 'opacity 0.2s, color 0.2s, transform 0.15s',
              padding: '2px',
              display: 'flex',
              alignItems: 'center',
            }}
            onMouseEnter={e => e.currentTarget.style.opacity = '1'}
            onMouseLeave={e => e.currentTarget.style.opacity = '0.7'}
          >
            {copied ? <Check size={15} strokeWidth={2.5} /> : <Copy size={15} />}
          </button>
        )}
      </div>

      {/* Warning note */}
      {meta.warning && hash && !isLoading && (
        <div style={{
          marginTop: '10px',
          padding: '8px 12px',
          borderRadius: '8px',
          background: 'var(--danger-bg)',
          border: '1px solid var(--danger-text)25',
          display: 'flex',
          alignItems: 'flex-start',
          gap: '8px',
        }}>
          <AlertTriangle size={13} color="var(--danger-text)" strokeWidth={2.5} style={{ flexShrink: 0, marginTop: '1px' }} />
          <p style={{ fontSize: '12px', color: 'var(--danger-text)', margin: 0, lineHeight: 1.5 }}>
            {meta.warning}
          </p>
        </div>
      )}
    </div>
  )
}
