import React, { useState } from 'react'
import { Zap, Microscope, FlaskConical, TableProperties } from 'lucide-react'
import { useTheme } from './hooks/useTheme'
import { hashSHA256 } from './utils/sha256'
import { hashBcrypt } from './utils/bcrypt'
import { hashArgon2 } from './utils/argon2'

import Header from './components/Header'
import PasswordInput from './components/PasswordInput'
import HashPanel from './components/HashPanel'
import CostControls from './components/CostControls'
import TimingChart from './components/TimingChart'
import HashAnatomy from './components/HashAnatomy'
import SaltDemo from './components/SaltDemo'
import RainbowTableDemo from './components/RainbowTableDemo'

const SECTIONS = [
  { id: 'hash',    Icon: Zap,             label: 'Hash It' },
  { id: 'anatomy', Icon: Microscope,      label: 'Anatomy' },
  { id: 'salt',    Icon: FlaskConical,    label: 'Salting' },
  { id: 'rainbow', Icon: TableProperties, label: 'Rainbow Table' },
]

export default function App() {
  const { theme, toggle } = useTheme()

  const [bcryptCost, setBcryptCost]       = useState(10)
  const [argonTimeCost, setArgonTimeCost] = useState(2)
  const [argonMemCost, setArgonMemCost]   = useState(16384)

  const [hashes, setHashes] = useState({ sha256: null, bcrypt: null, argon2: null })
  const [times,  setTimes]  = useState({ sha256: null, bcrypt: null, argon2: null })
  const [loading, setLoading] = useState({ sha256: false, bcrypt: false, argon2: false })

  const [activeSection, setActiveSection] = useState('hash')

  const handleHash = async (password) => {
    setHashes({ sha256: null, bcrypt: null, argon2: null })
    setTimes({ sha256: null, bcrypt: null, argon2: null })
    setLoading({ sha256: true, bcrypt: true, argon2: true })

    hashSHA256(password).then(({ hash, timeMs }) => {
      setHashes(h => ({ ...h, sha256: hash }))
      setTimes(t  => ({ ...t, sha256: timeMs }))
      setLoading(l => ({ ...l, sha256: false }))
    })

    hashBcrypt(password, bcryptCost).then(({ hash, timeMs }) => {
      setHashes(h => ({ ...h, bcrypt: hash }))
      setTimes(t  => ({ ...t, bcrypt: timeMs }))
      setLoading(l => ({ ...l, bcrypt: false }))
    })

    hashArgon2(password, argonTimeCost, argonMemCost).then(({ hash, timeMs }) => {
      setHashes(h => ({ ...h, argon2: hash }))
      setTimes(t  => ({ ...t, argon2: timeMs }))
      setLoading(l => ({ ...l, argon2: false }))
    })
  }

  const isAnyHashing = Object.values(loading).some(Boolean)

  return (
    <>
      <div className="bg-scene">
        <div className="bg-orb bg-orb-1" />
        <div className="bg-orb bg-orb-2" />
        <div className="bg-orb bg-orb-3" />
        <div className="bg-noise" />
      </div>

      <div className="app-wrapper">
        <Header theme={theme} onToggle={toggle} />

        {/* Sticky nav */}
        <nav style={{
          position: 'sticky',
          top: '12px',
          zIndex: 10,
          display: 'flex',
          gap: '8px',
          marginBottom: '28px',
          padding: '6px',
          borderRadius: '14px',
          background: 'var(--glass-bg)',
          backdropFilter: 'blur(20px)',
          WebkitBackdropFilter: 'blur(20px)',
          border: '1px solid var(--glass-border)',
          boxShadow: 'var(--glass-shadow)',
          overflowX: 'auto',
        }}>
          {SECTIONS.map(({ id, Icon, label }) => (
            <button
              key={id}
              onClick={() => setActiveSection(id)}
              style={{
                flex: '1 0 auto',
                padding: '9px 16px',
                borderRadius: '10px',
                border: 'none',
                background: activeSection === id ? 'var(--accent-primary)' : 'transparent',
                color: activeSection === id ? 'var(--text-inverse)' : 'var(--text-secondary)',
                fontFamily: 'Nunito, sans-serif',
                fontSize: '13px',
                fontWeight: 700,
                cursor: 'pointer',
                transition: 'background 0.2s ease, color 0.2s ease',
                whiteSpace: 'nowrap',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                gap: '6px',
              }}
            >
              <Icon size={14} strokeWidth={2.5} />
              {label}
            </button>
          ))}
        </nav>

        {/* Hash Comparison */}
        {activeSection === 'hash' && (
          <div className="fade-up">
            <PasswordInput onHash={handleHash} isHashing={isAnyHashing} />
            <CostControls
              bcryptCost={bcryptCost}       setBcryptCost={setBcryptCost}
              argonTimeCost={argonTimeCost} setArgonTimeCost={setArgonTimeCost}
              argonMemCost={argonMemCost}   setArgonMemCost={setArgonMemCost}
            />
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gap: '16px', marginBottom: '28px' }}>
              <HashPanel algo="sha256" hash={hashes.sha256} timeMs={times.sha256} isLoading={loading.sha256} />
              <HashPanel algo="bcrypt" hash={hashes.bcrypt} timeMs={times.bcrypt} isLoading={loading.bcrypt} />
              <HashPanel algo="argon2" hash={hashes.argon2} timeMs={times.argon2} isLoading={loading.argon2} />
            </div>
            <TimingChart times={times} />
          </div>
        )}

        {/* Anatomy */}
        {activeSection === 'anatomy' && (
          <div className="fade-up">
            {!hashes.bcrypt && !hashes.argon2 ? (
              <div className="glass-card" style={{ padding: '40px', textAlign: 'center', marginBottom: '28px' }}>
                <div style={{ display: 'flex', justifyContent: 'center', marginBottom: '12px', color: 'var(--text-muted)' }}>
                  <Microscope size={36} strokeWidth={1.25} />
                </div>
                <p style={{ fontFamily: 'Lora, serif', fontSize: '1.1rem', color: 'var(--text-secondary)', marginBottom: '8px' }}>
                  No hashes yet
                </p>
                <p style={{ fontSize: '13px', color: 'var(--text-muted)' }}>
                  Go to <strong>Hash It</strong>, enter a password and hash it first — then come back here to inspect the anatomy.
                </p>
              </div>
            ) : (
              <HashAnatomy bcryptHash={hashes.bcrypt} argon2Hash={hashes.argon2} />
            )}
          </div>
        )}

        {/* Salt Demo */}
        {activeSection === 'salt' && (
          <div className="fade-up">
            <SaltDemo bcryptCost={bcryptCost} argonTimeCost={argonTimeCost} argonMemCost={argonMemCost} />
          </div>
        )}

        {/* Rainbow Table */}
        {activeSection === 'rainbow' && (
          <div className="fade-up">
            <RainbowTableDemo />
          </div>
        )}

        <footer style={{
          textAlign: 'center',
          padding: '24px 0 0',
          borderTop: '1px solid var(--glass-border)',
          color: 'var(--text-muted)',
          fontSize: '12px',
          lineHeight: 1.7,
        }}>
          <p>Built to demonstrate why <strong style={{ color: 'var(--danger-text)' }}>SHA-256 is not a password hash</strong>.</p>
          <p style={{ marginTop: '2px' }}>Use <strong style={{ color: 'var(--algo-bcrypt)' }}>bcrypt</strong> or <strong style={{ color: 'var(--algo-argon)' }}>Argon2id</strong> in production.</p>
        </footer>
      </div>
    </>
  )
}
