import { useEffect, useRef } from "react"
import * as THREE from "three"

interface WebGLShaderProps {
  className?: string
}

export function WebGLShader({ className }: WebGLShaderProps) {
  const canvasRef = useRef<HTMLCanvasElement>(null)
  const sceneRef = useRef<{
    scene: THREE.Scene | null
    camera: THREE.OrthographicCamera | null
    renderer: THREE.WebGLRenderer | null
    mesh: THREE.Mesh | null
    uniforms: Record<string, { value: number | number[] }> | null
    animationId: number | null
  }>({
    scene: null,
    camera: null,
    renderer: null,
    mesh: null,
    uniforms: null,
    animationId: null,
  })

  useEffect(() => {
    if (!canvasRef.current) return

    const canvas = canvasRef.current
    const { current: refs } = sceneRef

    const vertexShader = `
      attribute vec3 position;
      void main() {
        gl_Position = vec4(position, 1.0);
      }
    `

    // White background + electric blue #2563EB lines (0.145, 0.388, 0.922)
    // Navy #1B2A4A on offset channels for chromatic aberration fringe
    const fragmentShader = `
      precision highp float;
      uniform vec2 resolution;
      uniform float time;
      uniform float xScale;
      uniform float yScale;
      uniform float distortion;

      void main() {
        vec2 p = (gl_FragCoord.xy * 2.0 - resolution) / min(resolution.x, resolution.y);
        
        float d = length(p) * distortion;
        
        // Chromatic aberration offsets
        float rx = p.x * (1.0 + d);
        float gx = p.x;
        float bx = p.x * (1.0 - d);

        // Line intensity per channel — white bg so we subtract toward brand color
        float lineR = clamp(0.032 / abs(p.y + sin((rx + time) * xScale) * yScale), 0.0, 1.0);
        float lineG = clamp(0.032 / abs(p.y + sin((gx + time) * xScale) * yScale), 0.0, 1.0);
        float lineB = clamp(0.032 / abs(p.y + sin((bx + time) * xScale) * yScale), 0.0, 1.0);
        
        // Brand color: #2563EB = (0.145, 0.388, 0.922)
        // Mix from white (1,1,1) toward brand color based on line intensity
        float r = 1.0 - lineR * (1.0 - 0.145);
        float g = 1.0 - lineG * (1.0 - 0.388);
        float b = 1.0 - lineB * (1.0 - 0.922);
        
        gl_FragColor = vec4(r, g, b, 1.0);
      }
    `

    const container = canvas.parentElement
    const getSize = () => ({
      w: container?.clientWidth ?? window.innerWidth,
      h: container?.clientHeight ?? window.innerHeight,
    })

    const initScene = () => {
      refs.scene = new THREE.Scene()
      refs.renderer = new THREE.WebGLRenderer({ canvas, antialias: true })
      refs.renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2))
      refs.renderer.setClearColor(new THREE.Color(0xffffff))

      refs.camera = new THREE.OrthographicCamera(-1, 1, 1, -1, 0, -1)

      const { w, h } = getSize()
      refs.uniforms = {
        resolution: { value: [w, h] },
        time: { value: 0.0 },
        xScale: { value: 1.0 },
        yScale: { value: 0.38 },
        distortion: { value: 0.018 },
      }

      const position = [
        -1.0, -1.0, 0.0,
         1.0, -1.0, 0.0,
        -1.0,  1.0, 0.0,
         1.0, -1.0, 0.0,
        -1.0,  1.0, 0.0,
         1.0,  1.0, 0.0,
      ]

      const positions = new THREE.BufferAttribute(new Float32Array(position), 3)
      const geometry = new THREE.BufferGeometry()
      geometry.setAttribute("position", positions)

      const material = new THREE.RawShaderMaterial({
        vertexShader,
        fragmentShader,
        uniforms: refs.uniforms,
        side: THREE.DoubleSide,
      })

      refs.mesh = new THREE.Mesh(geometry, material)
      refs.scene.add(refs.mesh)

      handleResize()
    }

    const animate = () => {
      if (refs.uniforms) {
        (refs.uniforms.time.value as number) += 0.006
      }
      if (refs.renderer && refs.scene && refs.camera) {
        refs.renderer.render(refs.scene, refs.camera)
      }
      refs.animationId = requestAnimationFrame(animate)
    }

    const handleResize = () => {
      if (!refs.renderer || !refs.uniforms) return
      const { w, h } = getSize()
      refs.renderer.setSize(w, h, false)
      refs.uniforms.resolution.value = [w, h]
    }

    initScene()
    animate()
    window.addEventListener("resize", handleResize)

    return () => {
      if (refs.animationId) cancelAnimationFrame(refs.animationId)
      window.removeEventListener("resize", handleResize)
      if (refs.mesh) {
        refs.scene?.remove(refs.mesh)
        refs.mesh.geometry.dispose()
        if (refs.mesh.material instanceof THREE.Material) {
          refs.mesh.material.dispose()
        }
      }
      refs.renderer?.dispose()
    }
  }, [])

  return (
    <canvas
      ref={canvasRef}
      className={className ?? "absolute inset-0 w-full h-full block"}
    />
  )
}
