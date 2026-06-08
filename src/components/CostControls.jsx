import React from 'react'
import { Lock, ShieldCheck } from 'lucide-react'

function SliderRow({ label, value, min, max, step = 1, onChange, formatValue, hint, color }) {
  return (
    <div style={{ marginBottom: '20px' }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'baseline', marginBottom: '8px' }}>
        <label style={{ fontSize: '13px', fontWeight: 600, color: 'var(--text-secondary)' }}>
          {label}
        </label>
        <span style={{
          fontFamily: 'DM Mono, monospace',
          fontSize: '13px',
          fontWeight: 500,
          color: color || 'var(--accent-primary)',
          background: `${color || 'var(--accent-primary)'}18`,
          padding: '2px 10px',
          borderRadius: '99px',
        }}>
          {formatValue ? formatValue(value) : value}
        </span>
      </div>
      <input
        type="range"
        min={min}
        max={max}
        step={step}
        value={value}
        onChange={e => onChange(Number(e.target.value))}
      />
      {hint && (
        <p style={{ fontSize: '11px', color: 'var(--text-muted)', marginTop: '5px', fontStyle: 'italic' }}>
          {hint}
        </p>
      )}
    </div>
  )
}

export default function CostControls({ bcryptCost, setBcryptCost, argonTimeCost, setArgonTimeCost, argonMemCost, setArgonMemCost }) {
  return (
    <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '20px', marginBottom: '28px' }}>

      {/* bcrypt */}
      <div className="glass-card" style={{ padding: '22px 24px', borderTop: '3px solid var(--algo-bcrypt)' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '18px' }}>
          <Lock size={16} color="var(--algo-bcrypt)" strokeWidth={2} />
          <h3 style={{ fontFamily: 'Lora, serif', fontSize: '1rem', fontWeight: 600, color: 'var(--algo-bcrypt)' }}>
            bcrypt Cost Factor
          </h3>
        </div>

        <SliderRow
          label="Work factor"
          value={bcryptCost}
          min={4}
          max={14}
          onChange={setBcryptCost}
          formatValue={v => `${v}  (${(Math.pow(2, v)).toLocaleString()} rounds)`}
          hint="Each +1 doubles compute time. 12 is the 2025 recommended minimum."
          color="var(--algo-bcrypt)"
        />

        <div style={{ padding: '10px 14px', borderRadius: '8px', background: 'var(--algo-bcrypt-bg)', border: '1px solid var(--algo-bcrypt)25' }}>
          <p style={{ fontSize: '12px', color: 'var(--algo-bcrypt)', margin: 0, lineHeight: 1.5 }}>
            2<sup>{bcryptCost}</sup> = <strong>{Math.pow(2, bcryptCost).toLocaleString()}</strong> iterations per hash attempt
          </p>
        </div>
      </div>

      {/* Argon2 */}
      <div className="glass-card" style={{ padding: '22px 24px', borderTop: '3px solid var(--algo-argon)' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '18px' }}>
          <ShieldCheck size={16} color="var(--algo-argon)" strokeWidth={2} />
          <h3 style={{ fontFamily: 'Lora, serif', fontSize: '1rem', fontWeight: 600, color: 'var(--algo-argon)' }}>
            Argon2 Parameters
          </h3>
        </div>

        <SliderRow
          label="Time cost (iterations)"
          value={argonTimeCost}
          min={1}
          max={5}
          onChange={setArgonTimeCost}
          hint="Number of passes over memory. More = slower + safer."
          color="var(--algo-argon)"
        />

        <SliderRow
          label="Memory cost"
          value={argonMemCost}
          min={1024}
          max={65536}
          step={1024}
          onChange={setArgonMemCost}
          formatValue={v => v >= 1024 ? `${(v / 1024).toFixed(0)} MB` : `${v} KB`}
          hint="Memory required per hash. GPUs can't parallelize memory-hard functions."
          color="var(--algo-argon)"
        />
      </div>

    </div>
  )
}
