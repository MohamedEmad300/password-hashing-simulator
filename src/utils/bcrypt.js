import bcrypt from 'bcryptjs'

export async function hashBcrypt(password, costFactor = 10) {
  const t0 = performance.now()
  const hash = await bcrypt.hash(password, costFactor)
  const t1 = performance.now()

  return {
    hash,
    timeMs: t1 - t0,
  }
}

/**
 * Parses a bcrypt hash string into its named segments.
 * e.g. $2b$12$<22-char salt><31-char hash>
 * Returns an array of { label, value, color } objects.
 */
export function parseBcryptHash(hash) {
  if (!hash || !hash.startsWith('$2')) return null

  // format: $2b$12$<53 chars: 22 salt + 31 hash>
  const match = hash.match(/^(\$2[ab]?\$)(\d{2})(\$)(.{22})(.{31})$/)
  if (!match) return null

  const [, prefix, cost, sep, salt, digest] = match

  return [
    { label: 'Algorithm',   value: prefix,  color: '#2563EB', title: 'bcrypt version identifier' },
    { label: 'Cost factor', value: cost,    color: '#D97706', title: `2^${cost} = ${Math.pow(2, parseInt(cost)).toLocaleString()} iterations` },
    { label: 'Separator',   value: sep,     color: '#7C3AED', title: 'delimiter' },
    { label: 'Salt',        value: salt,    color: '#0891B2', title: '22-char Base64 salt (128 bits), random each time' },
    { label: 'Hash',        value: digest,  color: '#DB2777', title: '31-char Base64 hash (184 bits)' },
  ]
}
