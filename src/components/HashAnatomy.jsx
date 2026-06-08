import React, { useState } from 'react'
import { Microscope, Lock, ShieldCheck } from 'lucide-react'
import { parseBcryptHash } from '../utils/bcrypt'
import { parseArgon2Hash } from '../utils/argon2'

function Segment({ seg, isActive, onHover, onLeave }) {
  return (
    <span
      onMouseEnter={() => onHover(seg)}
      onMouseLeave={onLeave}
      style={{
        display: 'inline',
        fontFamily: 'DM Mono, monospace',
        fontSize: '12px',
        padding: '2px 5px',
        borderRadius: '5px',
        background: isActive ? seg.color : `${seg.color}28`,
        color: isActive ? '#fff' : seg.color,
        cursor: 'default',
        transition: 'background 0.18s ease, color 0.18s ease',
        wordBreak: 'break-all',
        lineHeight: 1.9,
      }}
    >
      {seg.value}
    </span>
  )
}

function AnatomyBlock({ title, Icon, color, segments, placeholder }) {
  const [active, setActive] = useState(null)

  if (!segments) {
    return (
      <div style={{
        padding: '18px 20px',
        borderRadius: '12px',
        background: 'rgba(0,0,0,0.04)',
        border: '1px dashed var(--glass-border)',
      }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '10px' }}>
          <Icon size={15} color={color} strokeWidth={2} />
          <span style={{ fontFamily: 'Lora, serif', fontSize: '0.95rem', fontWeight: 600, color }}>{title}</span>
        </div>
        <p style={{ fontSize: '12px', color: 'var(--text-muted)', fontStyle: 'italic' }}>{placeholder}</p>
      </div>
    )
  }

  return (
    <div style={{
      padding: '18px 20px',
      borderRadius: '12px',
      background: 'rgba(0,0,0,0.04)',
      border: `1px solid ${color}30`,
    }}>
      <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '12px' }}>
        <Icon size={15} color={color} strokeWidth={2} />
        <span style={{ fontFamily: 'Lora, serif', fontSize: '0.95rem', fontWeight: 600, color }}>{title}</span>
      </div>

      <div style={{ marginBottom: '12px', lineHeight: 2 }}>
        {segments.map((seg, i) => (
          <Segment
            key={i}
            seg={seg}
            isActive={active?.label === seg.label}
            onHover={setActive}
            onLeave={() => setActive(null)}
          />
        ))}
      </div>

      <div style={{
        minHeight: '38px',
        padding: '8px 12px',
        borderRadius: '8px',
        background: active ? `${active.color}18` : 'transparent',
        border: `1px solid ${active ? active.color + '40' : 'transparent'}`,
        transition: 'background 0.2s ease, border-color 0.2s ease',
      }}>
        {active ? (
          <div style={{ display: 'flex', alignItems: 'baseline', gap: '8px' }}>
            <span style={{
              fontSize: '11px',
              fontWeight: 700,
              textTransform: 'uppercase',
              letterSpacing: '0.06em',
              color: active.color,
              whiteSpace: 'nowrap',
            }}>
              {active.label}
            </span>
            <span style={{ fontSize: '12px', color: 'var(--text-secondary)', lineHeight: 1.4 }}>
              {active.title}
            </span>
          </div>
        ) : (
          <p style={{ fontSize: '12px', color: 'var(--text-muted)', fontStyle: 'italic', margin: 0 }}>
            Hover a segment to inspect it
          </p>
        )}
      </div>

      <div style={{ display: 'flex', flexWrap: 'wrap', gap: '6px', marginTop: '12px' }}>
        {segments.map((seg, i) => (
          <span
            key={i}
            onMouseEnter={() => setActive(seg)}
            onMouseLeave={() => setActive(null)}
            style={{
              fontSize: '11px',
              padding: '2px 9px',
              borderRadius: '99px',
              background: `${seg.color}20`,
              color: seg.color,
              border: `1px solid ${seg.color}35`,
              cursor: 'default',
              fontWeight: 600,
              transition: 'background 0.15s',
            }}
          >
            {seg.label}
          </span>
        ))}
      </div>
    </div>
  )
}

export default function HashAnatomy({ bcryptHash, argon2Hash }) {
  const bcryptSegs = bcryptHash ? parseBcryptHash(bcryptHash) : null
  const argon2Segs = argon2Hash ? parseArgon2Hash(argon2Hash) : null

  return (
    <div className="glass-card" style={{ padding: '22px 24px', marginBottom: '28px' }}>
      <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '20px' }}>
        <Microscope size={18} color="var(--text-primary)" strokeWidth={1.75} />
        <h3 style={{ fontFamily: 'Lora, serif', fontSize: '1.05rem', fontWeight: 600, color: 'var(--text-primary)' }}>
          Hash Anatomy
        </h3>
        <span style={{ fontSize: '13px', color: 'var(--text-muted)', fontStyle: 'italic', marginLeft: '4px' }}>
          — hover any segment to inspect it
        </span>
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '16px' }}>
        <AnatomyBlock
          title="bcrypt"
          Icon={Lock}
          color="var(--algo-bcrypt)"
          segments={bcryptSegs}
          placeholder="Hash a password to see the bcrypt string breakdown"
        />
        <AnatomyBlock
          title="Argon2id"
          Icon={ShieldCheck}
          color="var(--algo-argon)"
          segments={argon2Segs}
          placeholder="Hash a password to see the Argon2 PHC string breakdown"
        />
      </div>
    </div>
  )
}
