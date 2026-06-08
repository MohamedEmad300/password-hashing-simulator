import React from 'react'
import { KeyRound } from 'lucide-react'
import ThemeToggle from './ThemeToggle'

export default function Header({ theme, onToggle }) {
  return (
    <header style={{
      padding: '32px 0 28px',
      display: 'flex',
      alignItems: 'flex-start',
      justifyContent: 'space-between',
      gap: '16px',
    }}>
      <div>
        <div style={{
          display: 'inline-flex',
          alignItems: 'center',
          gap: '10px',
          marginBottom: '8px',
        }}>
          <span style={{
            display: 'flex',
            alignItems: 'center',
            color: 'var(--accent-primary)',
            filter: 'drop-shadow(0 2px 4px rgba(0,0,0,0.15))',
          }}>
            <KeyRound size={28} strokeWidth={1.75} />
          </span>
          <h1 style={{
            fontFamily: 'Lora, serif',
            fontSize: 'clamp(1.4rem, 3vw, 2rem)',
            fontWeight: 700,
            color: 'var(--text-primary)',
            letterSpacing: '-0.01em',
          }}>
            Password Hashing Simulator
          </h1>
        </div>
        <p style={{
          fontSize: '14px',
          color: 'var(--text-secondary)',
          maxWidth: '560px',
          lineHeight: 1.55,
          fontStyle: 'italic',
        }}>
          Explore why SHA-256 is dangerous for passwords — and how bcrypt &amp; Argon2
          defend against brute-force and rainbow table attacks.
        </p>
      </div>

      <div style={{ paddingTop: '4px', flexShrink: 0 }}>
        <ThemeToggle theme={theme} onToggle={onToggle} />
      </div>
    </header>
  )
}
