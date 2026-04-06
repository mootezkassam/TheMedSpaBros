import { useRef, useEffect } from 'react'

const W = 500
const H = 300
const LINE_COUNT = 18
const DOT_COUNT = 28
const CX = W * 0.47
const CY = H / 2

export default function FunnelAnimation() {
  const canvasRef = useRef(null)
  const frameRef = useRef(null)

  useEffect(() => {
    const canvas = canvasRef.current
    if (!canvas) return

    const dpr = Math.min(window.devicePixelRatio || 1, 2)
    canvas.width = W * dpr
    canvas.height = H * dpr
    const ctx = canvas.getContext('2d')
    ctx.scale(dpr, dpr)

    // Line definitions — evenly spread on left, all converge to CX,CY
    const lines = Array.from({ length: LINE_COUNT }, (_, i) => {
      const t = i / (LINE_COUNT - 1)
      const spread = (t - 0.5) * 2
      return { startY: CY + spread * (H * 0.43), index: i }
    })

    // Dot definitions — travel along lines continuously
    const dots = Array.from({ length: DOT_COUNT }, () => ({
      lineIdx: Math.floor(Math.random() * LINE_COUNT),
      progress: Math.random(),
      speed: 0.0012 + Math.random() * 0.0028,
      size: 1.4 + Math.random() * 1.6,
      trail: [],
    }))

    function getPoint(line, t, time) {
      // t: 0→1 along the full path
      // Phase 1 (0–0.55): curved funnel — spread left → converge center
      // Phase 2 (0.55–1): straight line — center → right exit
      if (t <= 0.55) {
        const lt = t / 0.55
        const sx = 0
        const sy = line.startY
        // Wave motion — stronger near the start, fades as lines converge
        const wave = Math.sin(time * 1.8 + line.index * 0.7 + lt * 4) * 3.5 * (1 - lt)
        // Quadratic bezier: start → control → convergence
        const cpx = CX * 0.4
        const cpy = sy + (CY - sy) * 0.35
        const x = (1 - lt) * (1 - lt) * sx + 2 * (1 - lt) * lt * cpx + lt * lt * CX
        const y = (1 - lt) * (1 - lt) * sy + 2 * (1 - lt) * lt * (cpy + wave) + lt * lt * CY
        return { x, y }
      } else {
        const lt = (t - 0.55) / 0.45
        return { x: CX + (W - CX) * lt, y: CY }
      }
    }

    const startTime = performance.now()

    function draw(now) {
      const time = (now - startTime) / 1000
      ctx.clearRect(0, 0, W, H)

      // ── Draw funnel lines ──
      lines.forEach((line) => {
        ctx.beginPath()
        ctx.strokeStyle = 'rgba(37, 99, 235, 0.13)'
        ctx.lineWidth = 0.8
        for (let j = 0; j <= 80; j++) {
          const t = j / 80
          const p = getPoint(line, t, time)
          if (j === 0) ctx.moveTo(p.x, p.y)
          else ctx.lineTo(p.x, p.y)
        }
        ctx.stroke()
      })

      // ── Update & draw dots ──
      dots.forEach((dot) => {
        dot.progress += dot.speed
        if (dot.progress > 1.06) {
          dot.progress = -0.04
          dot.lineIdx = Math.floor(Math.random() * LINE_COUNT)
          dot.trail = []
        }

        const ct = Math.max(0, Math.min(1, dot.progress))
        const line = lines[dot.lineIdx]
        const p = getPoint(line, ct, time)

        // Trail history
        dot.trail.push({ x: p.x, y: p.y })
        if (dot.trail.length > 10) dot.trail.shift()

        // Draw trail
        for (let ti = 0; ti < dot.trail.length; ti++) {
          const tp = dot.trail[ti]
          const alpha = (ti / dot.trail.length) * 0.35
          ctx.beginPath()
          ctx.arc(tp.x, tp.y, dot.size * 0.5, 0, Math.PI * 2)
          ctx.fillStyle = `rgba(37, 99, 235, ${alpha})`
          ctx.fill()
        }

        if (dot.progress >= 0 && dot.progress <= 1) {
          // Outer glow
          const grad = ctx.createRadialGradient(p.x, p.y, 0, p.x, p.y, dot.size * 6)
          grad.addColorStop(0, 'rgba(37, 99, 235, 0.5)')
          grad.addColorStop(0.35, 'rgba(37, 99, 235, 0.12)')
          grad.addColorStop(1, 'rgba(37, 99, 235, 0)')
          ctx.fillStyle = grad
          ctx.beginPath()
          ctx.arc(p.x, p.y, dot.size * 6, 0, Math.PI * 2)
          ctx.fill()

          // White core
          ctx.beginPath()
          ctx.arc(p.x, p.y, dot.size, 0, Math.PI * 2)
          ctx.fillStyle = 'rgba(255, 255, 255, 0.92)'
          ctx.fill()
        }
      })

      // ── Convergence point glow ──
      const pulse = 0.35 + Math.sin(time * 2.5) * 0.1
      const cg = ctx.createRadialGradient(CX, CY, 0, CX, CY, 28)
      cg.addColorStop(0, `rgba(37, 99, 235, ${pulse})`)
      cg.addColorStop(0.4, 'rgba(37, 99, 235, 0.08)')
      cg.addColorStop(1, 'rgba(37, 99, 235, 0)')
      ctx.fillStyle = cg
      ctx.beginPath()
      ctx.arc(CX, CY, 28, 0, Math.PI * 2)
      ctx.fill()

      // Bright core
      ctx.beginPath()
      ctx.arc(CX, CY, 3, 0, Math.PI * 2)
      ctx.fillStyle = `rgba(255, 255, 255, ${0.65 + Math.sin(time * 3) * 0.2})`
      ctx.fill()

      frameRef.current = requestAnimationFrame(draw)
    }

    frameRef.current = requestAnimationFrame(draw)
    return () => {
      if (frameRef.current) cancelAnimationFrame(frameRef.current)
    }
  }, [])

  return (
    <canvas
      ref={canvasRef}
      width={W}
      height={H}
      className="funnel-canvas"
    />
  )
}
