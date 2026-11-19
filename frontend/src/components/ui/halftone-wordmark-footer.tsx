"use client"

// Halftone Wordmark Footer — adapted for Nexora
// A site footer whose wordmark is printed as a field of halftone dots on an interactive 2D canvas.
// Dots part around the pointer on springs, warming in colour as they are pushed.
// Click causes a shock ring ripple. Above it sit Nexora columns and a smooth back-to-top.

import * as React from "react"
import { Link } from "react-router-dom"

export interface HalftonePalette {
  /** The footer background. */
  background: string
  /** The dots at rest, and the text. */
  ink: string
  /** The colour a dot warms toward as it is pushed off its place. */
  warm: string
}

export type HalftonePreset = "night" | "paper" | "ember" | "cobalt" | "purple"

export interface FooterLink {
  label: string
  href?: string
}

export interface FooterColumn {
  title: string
  links: FooterLink[]
}

export interface HalftoneWordmarkFooterProps {
  /** The giant word printed in dots. Lowercase reads best. */
  wordmark?: string
  /** Top-left studio line. */
  label?: string
  /** The muted line under it. */
  meta?: string
  /** Link columns along the top. */
  columns?: FooterColumn[]
  /** Show the back-to-top link. It scrolls the window to 0. Defaults to true. */
  backToTop?: boolean
  /** Starting colours. Defaults to "night". */
  preset?: HalftonePreset
  /** Colour overrides, merged over the preset. */
  palette?: { background?: string; ink?: string; warm?: string }
  /** Distance between dot centres, in CSS px. Defaults to 6. */
  dotGap?: number
  /** How far the pointer pushes, in CSS px. Defaults to 80. */
  radius?: number
  /** How much of the word's cap height hangs below the bottom edge, 0–0.6. Defaults to 0.2. */
  crop?: number
  /** Print grain over everything, 0–1. Defaults to 0.5. */
  grain?: number
  /** Pointer and click response. Defaults to true. */
  interactive?: boolean
  /** Face for the wordmark. Heavy grotesks print best. */
  fontFamily?: string
  /** Weight of the wordmark. Defaults to 800. */
  fontWeight?: number
  /** Face for the small type. */
  monoFamily?: string
  /** Root height. A definite length, never a percentage. */
  height?: string
  /** Extra root class names. */
  className?: string
}

const PRESETS: { [K in HalftonePreset]: HalftonePalette } = {
  night: { background: "#06080d", ink: "#e2e8f0", warm: "#2dd4bf" },
  paper: { background: "#efebe3", ink: "#17150f", warm: "#c2361c" },
  ember: { background: "#160a06", ink: "#f2c48c", warm: "#ff5a1f" },
  cobalt: { background: "#0d1b4d", ink: "#dfe7ff", warm: "#ffcd3c" },
  purple: { background: "#0a0614", ink: "#e9d5ff", warm: "#a855f7" },
}

const DEFAULT_NEXORA_COLUMNS: FooterColumn[] = [
  {
    title: "Platform",
    links: [
      { label: "About Nexora", href: "/about" },
      { label: "Career GPS", href: "/career-gps" },
      { label: "Skill Assessments", href: "/assessments" },
      { label: "ATS Resume Checker", href: "/ats-checker" },
      { label: "Verified Jobs", href: "/jobs" },
    ],
  },
  {
    title: "Company",
    links: [
      { label: "About Us", href: "/about" },
      { label: "Responsible AI", href: "/responsible-ai" },
      { label: "For Employers", href: "/for-employers" },
      { label: "Contact Support", href: "/contact-support" },
    ],
  },
  {
    title: "Access & Legal",
    links: [
      { label: "Login", href: "/login" },
      { label: "Get Started", href: "/register" },
      { label: "Privacy Policy", href: "/privacy" },
      { label: "Terms of Service", href: "/terms" },
    ],
  },
]

const SANS_STACK = 'Inter, -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif'
const MONO_STACK = 'ui-monospace, SFMono-Regular, Menlo, Monaco, Consolas, monospace'

export function hwfHex(hex: string) {
  const m = /^#?([0-9a-f]{3}|[0-9a-f]{6})$/i.exec((hex || "").trim())
  if (!m) return null
  const h = m[1].length === 3 ? m[1].split("").map((c) => c + c).join("") : m[1]
  return [parseInt(h.slice(0, 2), 16), parseInt(h.slice(2, 4), 16), parseInt(h.slice(4, 6), 16)]
}

export function hwfRadius(coverage: number, gap: number) {
  const c = coverage < 0 ? 0 : coverage > 1 ? 1 : coverage
  return Math.sqrt(c) * gap * 0.56
}

export function hwfStep(
  x: number, y: number, vx: number, vy: number,
  hx: number, hy: number, px: number, py: number, r: number,
) {
  const dx = x - px
  const dy = y - py
  const d2 = dx * dx + dy * dy
  if (r > 0 && d2 < r * r) {
    const d = Math.sqrt(d2) + 0.001
    const f = (1 - d / r) * 2.6
    vx += (dx / d) * f
    vy += (dy / d) * f
  }
  vx = (vx + (hx - x) * 0.05) * 0.84
  vy = (vy + (hy - y) * 0.05) * 0.84
  return [x + vx, y + vy, vx, vy]
}

export function hwfWarmth(x: number, y: number, hx: number, hy: number, span: number) {
  const d = Math.hypot(x - hx, y - hy)
  return span > 0 ? Math.min(1, d / span) : 0
}

export function hwfFitSize(measured: number, width: number) {
  return measured > 0 ? (width / measured) * 100 : 0
}

const HWF_CSS = `
.hwf-root {
  position: relative; width: 100%; overflow: hidden; isolation: isolate;
  background: var(--hwf-bg); color: var(--hwf-ink); -webkit-font-smoothing: antialiased;
}
.hwf-root canvas { position: absolute; inset: 0; width: 100%; height: 100%; display: block; max-width: none; pointer-events: none; }
.hwf-top {
  position: relative; z-index: 10; display: grid; grid-template-columns: minmax(0, 1.4fr) repeat(3, minmax(0, 1fr));
  gap: 28px; padding: clamp(32px, 4vw, 56px) clamp(24px, 4vw, 64px) 0;
  font-family: var(--hwf-mono); font-size: 11px; letter-spacing: .16em; text-transform: uppercase; line-height: 1.8;
}
.hwf-brand strong { display: block; font-weight: 700; font-size: 13px; color: #fff; letter-spacing: .12em; }
.hwf-brand p { margin: 6px 0 0; opacity: .7; text-transform: none; font-size: 12px; font-family: sans-serif; letter-spacing: normal; line-height: 1.5; max-width: 300px; }
.hwf-brand span { display: block; margin-top: 12px; opacity: .45; font-size: 10.5px; }
.hwf-col h3 { margin: 0 0 10px; font: inherit; opacity: .5; font-weight: 600; color: #94a3b8; }
.hwf-col ul { list-style: none; margin: 0; padding: 0; space-y: 6px; }
.hwf-col a, .hwf-up {
  color: inherit; text-decoration: none; opacity: .82; background: none; border: 0; padding: 0;
  font: inherit; letter-spacing: inherit; text-transform: inherit; cursor: pointer;
  background-image: linear-gradient(currentColor, currentColor); background-size: 0% 1px;
  background-repeat: no-repeat; background-position: 0 100%; transition: opacity .25s ease, background-size .35s cubic-bezier(.2,.7,.1,1);
}
.hwf-col a:hover, .hwf-up:hover { opacity: 1; background-size: 100% 1px; color: #2dd4bf; }
.hwf-col a:focus-visible, .hwf-up:focus-visible { outline: 1px solid currentColor; outline-offset: 3px; opacity: 1; }
.hwf-rule {
  position: relative; z-index: 10; display: flex; justify-content: space-between; align-items: center; gap: 16px;
  margin: clamp(28px, 3.5vw, 44px) clamp(24px, 4vw, 64px) 0; padding-top: 16px;
  border-top: 0.5px solid color-mix(in srgb, var(--hwf-ink) 18%, transparent);
  font-family: var(--hwf-mono); font-size: 10.5px; letter-spacing: .18em; text-transform: uppercase;
}
.hwf-sr { position: absolute; width: 1px; height: 1px; overflow: hidden; clip-path: inset(50%); white-space: nowrap; }
@media (max-width: 768px) {
  .hwf-top { grid-template-columns: minmax(0, 1fr) minmax(0, 1fr); row-gap: 24px; }
  .hwf-brand { grid-column: 1 / -1; }
}
@media (max-width: 480px) {
  .hwf-top { grid-template-columns: 1fr; }
}
@media (prefers-reduced-motion: reduce) {
  .hwf-col a, .hwf-up { transition: none; }
}
`

export default function HalftoneWordmarkFooter({
  wordmark = "nexora",
  label = "Nexora",
  meta = "© 2026 Nexora Technologies Inc. All rights reserved.",
  columns = DEFAULT_NEXORA_COLUMNS,
  backToTop = true,
  preset = "night",
  palette,
  dotGap = 6,
  radius = 90,
  crop = 0.22,
  grain = 0.45,
  interactive = true,
  fontFamily = SANS_STACK,
  fontWeight = 900,
  monoFamily = MONO_STACK,
  height = "520px",
  className = "",
}: HalftoneWordmarkFooterProps) {
  const colors = { ...(PRESETS[preset] || PRESETS.night), ...(palette || {}) }
  const rootRef = React.useRef<HTMLElement | null>(null)
  const canvasRef = React.useRef<HTMLCanvasElement | null>(null)
  const opts = React.useRef({ colors, dotGap, radius, crop, grain, interactive, fontFamily, fontWeight, wordmark })
  opts.current = { colors, dotGap, radius, crop, grain, interactive, fontFamily, fontWeight, wordmark }
  const key = [wordmark, dotGap, crop, grain, fontFamily, fontWeight, colors.background, colors.ink, colors.warm].join("|")

  React.useEffect(() => {
    const root = rootRef.current
    const canvas = canvasRef.current
    if (!root || !canvas) return
    const ctx = canvas.getContext("2d")
    if (!ctx) return

    const reduced = window.matchMedia("(prefers-reduced-motion: reduce)").matches
    let w = 0
    let h = 0
    let dpr = 1
    let px = -1e5
    let py = -1e5
    let raf = 0
    let visible = true
    let awake = true
    let ring = { x: 0, y: 0, t: -1 }
    let dots = new Float32Array(0)
    let count = 0
    let grainTile: HTMLCanvasElement | null = null
    const ink = hwfHex(opts.current.colors.ink) || [226, 232, 240]
    const warm = hwfHex(opts.current.colors.warm) || [45, 212, 191]

    const layout = () => {
      const o = opts.current
      const rect = root.getBoundingClientRect()
      w = Math.max(1, Math.round(rect.width))
      h = Math.max(1, Math.round(rect.height))
      dpr = Math.min(window.devicePixelRatio || 1, 2)
      canvas.width = Math.round(w * dpr)
      canvas.height = Math.round(h * dpr)

      const mask = document.createElement("canvas")
      mask.width = w
      mask.height = h
      const m = mask.getContext("2d", { willReadFrequently: true })
      if (!m) return
      const face = o.fontWeight + " 100px " + o.fontFamily
      m.font = face
      const word = o.wordmark || "nexora"
      const fit = hwfFitSize(m.measureText(word).width, w * 0.98)
      m.font = o.fontWeight + " " + fit + "px " + o.fontFamily
      const box = m.measureText(word)
      const cap = box.actualBoundingBoxAscent || fit * 0.72
      const c = Math.max(0, Math.min(0.6, o.crop))
      m.fillStyle = "#000"
      m.textBaseline = "alphabetic"
      m.fillText(word, (w - box.width) / 2, h + cap * c)
      const img = m.getImageData(0, 0, w, h).data

      const gap = Math.max(3, o.dotGap)
      const cols = Math.ceil(w / gap)
      const rows = Math.ceil(h / gap)
      const tmp = []
      for (let gy = 0; gy < rows; gy++) {
        for (let gx = 0; gx < cols; gx++) {
          let sum = 0
          for (let sy = 0; sy < 3; sy++) {
            for (let sx = 0; sx < 3; sx++) {
              const x = Math.min(w - 1, Math.floor(gx * gap + ((sx + 0.5) * gap) / 3))
              const y = Math.min(h - 1, Math.floor(gy * gap + ((sy + 0.5) * gap) / 3))
              sum += img[(y * w + x) * 4 + 3]
            }
          }
          const cov = sum / (9 * 255)
          if (cov < 0.06) continue
          const hx = gx * gap + gap / 2
          const hy = gy * gap + gap / 2
          tmp.push(hx, hy, 0, 0, hx, hy, hwfRadius(cov, gap))
        }
      }
      dots = new Float32Array(tmp)
      count = tmp.length / 7

      grainTile = document.createElement("canvas")
      grainTile.width = 256
      grainTile.height = 256
      const g = grainTile.getContext("2d")
      if (g) {
        const id = g.createImageData(256, 256)
        for (let i = 0; i < id.data.length; i += 4) {
          const v = Math.random() * 255
          id.data[i] = id.data[i + 1] = id.data[i + 2] = v
          id.data[i + 3] = Math.random() < 0.5 ? 0 : 255
        }
        g.putImageData(id, 0, 0)
      }
      awake = true
    }

    const draw = (now: number) => {
      const o = opts.current
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0)
      ctx.fillStyle = o.colors.background
      ctx.fillRect(0, 0, w, h)

      const r = o.interactive && !reduced ? Math.max(0, o.radius) : 0
      const ringAge = ring.t < 0 ? 1e9 : now - ring.t
      const ringR = ringAge * 0.9
      let moving = false
      for (let i = 0; i < count; i++) {
        const j = i * 7
        let x = dots[j]
        let y = dots[j + 1]
        let vx = dots[j + 2]
        let vy = dots[j + 3]
        const hx = dots[j + 4]
        const hy = dots[j + 5]
        if (!reduced) {
          if (ringAge < 900) {
            const dx = hx - ring.x
            const dy = hy - ring.y
            const d = Math.sqrt(dx * dx + dy * dy) + 0.001
            const band = 1 - Math.min(1, Math.abs(d - ringR) / 26)
            if (band > 0) {
              const f = band * 3.2 * (1 - ringAge / 900)
              vx += (dx / d) * f
              vy += (dy / d) * f
            }
          }
          const s = hwfStep(x, y, vx, vy, hx, hy, px, py, r)
          x = s[0]
          y = s[1]
          vx = s[2]
          vy = s[3]
          if (Math.abs(vx) + Math.abs(vy) > 0.02 || Math.abs(x - hx) + Math.abs(y - hy) > 0.05) moving = true
          else {
            x = hx
            y = hy
            vx = 0
            vy = 0
          }
          dots[j] = x
          dots[j + 1] = y
          dots[j + 2] = vx
          dots[j + 3] = vy
        }
        const k = hwfWarmth(x, y, hx, hy, 28)
        ctx.fillStyle =
          k > 0.02
            ? "rgb(" +
              Math.round(ink[0] + (warm[0] - ink[0]) * k) + "," +
              Math.round(ink[1] + (warm[1] - ink[1]) * k) + "," +
              Math.round(ink[2] + (warm[2] - ink[2]) * k) + ")"
            : o.colors.ink
        ctx.beginPath()
        ctx.arc(x, y, dots[j + 6], 0, 6.2832)
        ctx.fill()
      }

      if (grainTile && o.grain > 0) {
        ctx.globalAlpha = Math.min(1, o.grain) * 0.08
        ctx.globalCompositeOperation = "overlay"
        const pattern = ctx.createPattern(grainTile, "repeat")
        if (pattern) {
          ctx.fillStyle = pattern
          ctx.fillRect(0, 0, w, h)
        }
        ctx.globalAlpha = 1
        ctx.globalCompositeOperation = "source-over"
      }
      awake = moving || ringAge < 900 || px > -1e4
    }

    const loop = (now: number) => {
      raf = 0
      if (!visible) return
      draw(now)
      if (awake) raf = requestAnimationFrame(loop)
    }
    const wake = () => {
      awake = true
      if (!raf && visible) raf = requestAnimationFrame(loop)
    }

    const toLocal = (e: MouseEvent) => {
      const b = root.getBoundingClientRect()
      return [e.clientX - b.left, e.clientY - b.top]
    }
    const onMove = (e: MouseEvent) => {
      if (!opts.current.interactive) return
      const p = toLocal(e)
      px = p[0]
      py = p[1]
      wake()
    }
    const onLeave = () => {
      px = -1e5
      py = -1e5
      wake()
    }
    const onDown = (e: MouseEvent) => {
      if (!opts.current.interactive || reduced) return
      if ((e.target as HTMLElement).closest("a,button")) return
      const p = toLocal(e)
      ring = { x: p[0], y: p[1], t: performance.now() }
      wake()
    }

    layout()
    draw(performance.now())
    wake()

    root.addEventListener("mousemove", onMove)
    root.addEventListener("mouseleave", onLeave)
    root.addEventListener("mousedown", onDown)
    const ro = new ResizeObserver(() => {
      layout()
      wake()
    })
    ro.observe(root)
    const io = new IntersectionObserver((entries) => {
      visible = entries[0] ? entries[0].isIntersecting : true
      if (visible) wake()
    })
    io.observe(root)

    return () => {
      cancelAnimationFrame(raf)
      ro.disconnect()
      io.disconnect()
      root.removeEventListener("mousemove", onMove)
      root.removeEventListener("mouseleave", onLeave)
      root.removeEventListener("mousedown", onDown)
    }
  }, [key])

  const toTop = () => {
    window.scrollTo({ top: 0, behavior: "smooth" })
  }

  return (
    <footer
      ref={rootRef}
      className={"hwf-root " + className}
      style={
        {
          minHeight: height,
          "--hwf-bg": colors.background,
          "--hwf-ink": colors.ink,
          "--hwf-mono": monoFamily,
        } as React.CSSProperties
      }
    >
      <style>{HWF_CSS}</style>
      <canvas ref={canvasRef} aria-hidden="true" />
      <span className="hwf-sr">{wordmark}</span>
      
      <div className="hwf-top">
        {/* Column 1 – Nexora Branding */}
        <div className="hwf-brand">
          <div className="flex items-center space-x-2.5 mb-2">
            <div className="w-7 h-7 rounded-lg bg-gradient-to-tr from-blue-600 to-teal-400 flex items-center justify-center text-white font-bold shadow-sm">
              <svg className="w-4 h-4 fill-none stroke-current stroke-2" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" d="M13 10V3L4 14h7v7l9-11h-7z" />
              </svg>
            </div>
            <strong>{label}</strong>
          </div>
          <p>Your Career. Your Skills. Your Future.</p>
          <span>{meta}</span>
        </div>

        {/* Dynamic Nav Columns */}
        {columns.map((col) => (
          <nav className="hwf-col" key={col.title} aria-label={col.title}>
            <h3>{col.title}</h3>
            <ul>
              {col.links.map((l) => (
                <li key={l.label}>
                  {l.href?.startsWith("mailto:") ? (
                    <a href={l.href}>{l.label}</a>
                  ) : (
                    <Link to={l.href || "#"}>{l.label}</Link>
                  )}
                </li>
              ))}
            </ul>
          </nav>
        ))}
      </div>

      <div className="hwf-rule">
        <span className="opacity-40 normal-case font-sans tracking-normal text-[11px] text-slate-400">
          Built for students, freshers, and progressive engineering teams.
        </span>
        {backToTop ? (
          <button type="button" className="hwf-up" onClick={toTop}>
            Back to Top ↑
          </button>
        ) : null}
      </div>
    </footer>
  )
}
