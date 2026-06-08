import React from 'react'
import { Sun, Moon } from 'lucide-react'

export default function ThemeToggle({ theme, onToggle }) {
  const isDark = theme === 'dark'

  return (
    <button
      onClick={onToggle}
      aria-label={`Switch to ${isDark ? 'light' : 'dark'} mode`}
      style={{
        position: 'relative',
        width: '52px',
        height: '28px',
        borderRadius: '99px',
        border: '1.5px solid var(--glass-border)',
        background: isDark ? 'rgba(167,139,250,0.18)' : 'rgba(201,106,46,0.15)',
        cursor: 'pointer',
        padding: 0,
        transition: 'background 0.35s ease, border-color 0.35s ease',
        flexShrink: 0,
      }}
    >
      {/* Track ghost icons */}
      <span style={{
        position: 'absolute',
        left: '5px',
        top: '50%',
        transform: 'translateY(-50%)',
        lineHeight: 1,
        opacity: isDark ? 0.35 : 0,
        transition: 'opacity 0.25s ease',
        pointerEvents: 'none',
        display: 'flex',
        alignItems: 'center',
      }}>
        <Sun size={12} color="var(--algo-bcrypt)" />
      </span>
      <span style={{
        position: 'absolute',
        right: '5px',
        top: '50%',
        transform: 'translateY(-50%)',
        lineHeight: 1,
        opacity: isDark ? 0 : 0.35,
        transition: 'opacity 0.25s ease',
        pointerEvents: 'none',
        display: 'flex',
        alignItems: 'center',
      }}>
        <Moon size={12} color="var(--accent-primary)" />
      </span>

      {/* Sliding thumb */}
      <span style={{
        position: 'absolute',
        top: '3px',
        left: isDark ? '26px' : '3px',
        width: '20px',
        height: '20px',
        borderRadius: '50%',
        background: isDark ? '#A78BFA' : '#C96A2E',
        boxShadow: '0 2px 6px rgba(0,0,0,0.20)',
        transition: 'left 0.3s cubic-bezier(0.34,1.56,0.64,1), background 0.35s ease',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
      }}>
        {isDark
          ? <Moon size={11} color="#fff" strokeWidth={2.5} />
          : <Sun size={11} color="#fff" strokeWidth={2.5} />
        }
      </span>
    </button>
  )
}
