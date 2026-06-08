export async function hashSHA256(password) {
  const encoder = new TextEncoder()
  const t0 = performance.now()
  const buffer = await crypto.subtle.digest('SHA-256', encoder.encode(password))
  const t1 = performance.now()

  const hex = Array.from(new Uint8Array(buffer))
    .map(b => b.toString(16).padStart(2, '0'))
    .join('')

  return {
    hash: hex,
    timeMs: t1 - t0,
  }
}
