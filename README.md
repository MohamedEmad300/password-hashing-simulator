# Password Hashing Simulator

An interactive, browser-based educational tool that demonstrates why SHA-256 is dangerous for password storage — and how bcrypt and Argon2 defend against modern attacks.

All hashing runs entirely client-side. No backend, no data leaves your browser.

---

## Features

### Hash Comparison
Enter any password and see it hashed by all three algorithms simultaneously. Each panel shows the output hash, compute time, and a note on the algorithm's security posture. The timing difference between SHA-256 (microseconds) and bcrypt/Argon2 (milliseconds to seconds) is the core lesson.

### Hash Anatomy
Visual, color-coded breakdown of the bcrypt and Argon2 PHC hash strings. Hover any segment — algorithm identifier, cost factor, salt, hash — to see exactly what it encodes.

### Salt Demonstration
Hashes the same password twice through all three algorithms side by side. SHA-256 produces identical output both times (rainbow table vulnerability). bcrypt and Argon2 produce a unique hash every run due to random salting.

### Rainbow Table Demo
A precomputed table of common password to SHA-256 hash mappings. Type or click a known password to see it cracked instantly via lookup — no brute force needed. Illustrates why deterministic, unsalted hashing is fundamentally broken for passwords.

### Timing Chart
Live log-scale bar chart comparing compute times across all three algorithms after each hash run.

### Cost Controls
- **bcrypt** work factor slider (4-14): each increment doubles computation time
- **Argon2** time cost (1-5 iterations) and memory cost (1-64 MB) sliders

---

## Tech Stack

| Concern | Library |
|---|---|
| Framework | React 18 + Vite 5 |
| SHA-256 | `crypto.subtle.digest()` (native Web API) |
| bcrypt | `bcryptjs` (pure JS, no native deps) |
| Argon2id | `hash-wasm` (WASM, embedded as base64) |
| Icons | `lucide-react` |
| Timing | `performance.now()` |
| Fonts | Lora, DM Mono, Nunito (Google Fonts) |

---

## Getting Started

```bash
cd password-hashing-simulator
npm install
npm run dev
```

Open [http://localhost:5173](http://localhost:5173).

```bash
npm run build    # production build -> dist/
npm run preview  # preview the production build locally
```

---

## Project Structure

```
password-hashing-simulator/
├── index.html
├── vite.config.js
├── package.json
└── src/
    ├── main.jsx
    ├── App.jsx
    ├── index.css
    ├── components/
    │   ├── Header.jsx
    │   ├── ThemeToggle.jsx
    │   ├── PasswordInput.jsx
    │   ├── HashPanel.jsx
    │   ├── CostControls.jsx
    │   ├── TimingChart.jsx
    │   ├── HashAnatomy.jsx
    │   ├── SaltDemo.jsx
    │   └── RainbowTableDemo.jsx
    ├── hooks/
    │   └── useTheme.js
    └── utils/
        ├── sha256.js
        ├── bcrypt.js
        └── argon2.js
```

---

## Key Learning Outcomes

- **SHA-256 is not a password hash.** It has no salt, is instant to compute, and is trivially reversible via rainbow tables for common passwords.
- **Salting** forces unique output per hash even for identical passwords, defeating precomputed attacks.
- **Iteration cost** artificially slows computation, making brute-force attacks proportionally slower as hardware improves.
- **Argon2 won the Password Hashing Competition (PHC)** because its memory-hardness defeats GPU and ASIC parallelisation — unlike bcrypt, which only resists time-based attacks.

---

## Design

- Glass-morphism UI with warm light mode and deep-navy dark mode
- Theme persists across sessions via `localStorage`
- Respects `prefers-color-scheme` on first load
