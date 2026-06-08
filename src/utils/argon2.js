import { argon2id, argon2Verify } from 'hash-wasm'

export async function hashArgon2(password, timeCost = 2, memoryCost = 16384) {
  const salt = crypto.getRandomValues(new Uint8Array(16))

  const t0 = performance.now()
  const hash = await argon2id({
    password,
    salt,
    iterations: timeCost,
    memorySize: memoryCost,
    hashLength: 32,
    parallelism: 1,
    outputType: 'encoded',
  })
  const t1 = performance.now()

  return {
    hash,
    timeMs: t1 - t0,
  }
}

/**
 * Parses an Argon2 PHC string into named segments.
 * Format: $argon2id$v=19$m=65536,t=2,p=1$<salt>$<hash>
 */
export function parseArgon2Hash(hash) {
  if (!hash || !hash.startsWith('$argon2')) return null

  const match = hash.match(
    /^(\$argon2\w+)(\$v=\d+)(\$m=\d+),?(t=\d+),?(p=\d+)(\$[^$]+)(\$[^$]+)$/
  )
  if (!match) return null

  const [, algoId, version, mPart, tPart, pPart, salt, digest] = match

  return [
    { label: 'Algorithm',   value: algoId,      color: '#2563EB', title: 'Argon2id — hybrid of Argon2i and Argon2d, recommended variant' },
    { label: 'Version',     value: version,     color: '#7C3AED', title: 'Argon2 spec version (19 = 0x13)' },
    { label: 'Memory (m)',  value: mPart + ',', color: '#D97706', title: `${mPart.replace('$m=','')} KB required — defeats GPU/ASIC parallelism` },
    { label: 'Time (t)',    value: tPart + ',', color: '#0891B2', title: `${tPart.replace('t=','')} pass(es) over memory` },
    { label: 'Parallelism', value: pPart,       color: '#DB2777', title: `${pPart.replace('p=','')} parallel thread(s)` },
    { label: 'Salt',        value: salt,        color: '#16A34A', title: 'Base64url-encoded random salt — unique every hash' },
    { label: 'Hash',        value: digest,      color: '#DC2626', title: 'Base64url-encoded 32-byte Argon2id output' },
  ]
}
