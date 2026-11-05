import { useEffect, useRef, useState, type ReactNode } from "react"
import { cn } from "@/lib/utils"
import { usePrefersReducedMotion } from "@/hooks/use-prefers-reduced-motion"
import "./shader-canvas.css"

export type ShaderCanvasStatus =
  "starting" | "running" | "unsupported" | "error"

export interface ShaderCanvasProps {
  /** GLSL ES 1.0 fragment shader. Time, resolution, pointer, and color uniforms are prepended. */
  fragment?: string
  /** Uniform name → CSS color. Theme tokens are resolved again when the theme changes. */
  colors?: Record<string, string>
  /** Render resolution as a fraction of device pixels. Lower values reduce GPU work. */
  resolution?: number
  /** Animation time, in seconds, used for the reduced-motion still frame. */
  stillTime?: number
  /** Let pointer movement inside this component influence the shader. */
  pointerInteraction?: boolean
  /** Show shader compile or link errors inside the component. */
  showErrors?: boolean
  /** Called with the shader log when compilation or linking fails. */
  onError?: (message: string) => void
  /** Called when rendering starts or the component falls back. */
  onStatusChange?: (status: ShaderCanvasStatus) => void
  /** Accessible description. Omit when the canvas is decorative. */
  label?: string
  /** Content layered over the shader. */
  children?: ReactNode
  /** Merged last, so it wins. Set the component size here. */
  className?: string
}

const DEFAULT_FRAGMENT = `
float hash(vec2 point) {
  point = fract(point * vec2(123.34, 456.21));
  point += dot(point, point + 45.32);
  return fract(point.x * point.y);
}

float noise(vec2 point) {
  vec2 cell = floor(point);
  vec2 local = fract(point);
  local = local * local * (3.0 - 2.0 * local);

  float lower = mix(hash(cell), hash(cell + vec2(1.0, 0.0)), local.x);
  float upper = mix(
    hash(cell + vec2(0.0, 1.0)),
    hash(cell + vec2(1.0, 1.0)),
    local.x
  );
  return mix(lower, upper, local.y);
}

float fieldNoise(vec2 point) {
  float value = 0.0;
  float weight = 0.5;
  for (int octave = 0; octave < 4; octave++) {
    value += noise(point) * weight;
    point = point * 2.03 + vec2(17.1, 9.2);
    weight *= 0.5;
  }
  return value;
}

void main() {
  vec2 uv = gl_FragCoord.xy / u_resolution;
  vec2 p = (uv - 0.5) * vec2(u_resolution.x / u_resolution.y, 1.0);
  vec2 pointer = (u_pointer - 0.5) * vec2(u_resolution.x / u_resolution.y, 1.0);
  float drift = u_time * 0.018;

  vec2 domain = p * 1.18 + vec2(drift, -drift * 0.62);
  vec2 warp = vec2(
    fieldNoise(domain * 1.24 + vec2(2.8, 7.1)),
    fieldNoise(domain * 1.24 - vec2(6.4, 1.9))
  ) - 0.5;
  vec2 field = domain + warp * 0.2;

  float broad = fieldNoise(field * 1.35);
  float detail = fieldNoise(field * 2.6 + vec2(-3.2, 4.7));
  float distanceToPointer = length((field - pointer) * vec2(0.78, 1.12));
  float cursorField = exp(-distanceToPointer * distanceToPointer * 1.25);

  float atmosphere = smoothstep(0.28, 0.82, broad) * 0.14;
  float accentAmount = 0.07 + atmosphere + cursorField * 0.2;
  float lightAmount = 0.012 + detail * 0.025 + cursorField * 0.075;

  vec3 colour = mix(u_surface, u_accent, accentAmount);
  colour = mix(colour, u_ink, lightAmount);
  gl_FragColor = vec4(colour, 1.0);
}
`

const DEFAULT_COLORS = {
  u_accent: "var(--code-shader-accent)",
  u_ink: "var(--code-shader-highlight)",
  u_surface: "var(--code-shader-base)",
}

const VERTEX = `
attribute vec2 a_position;
void main() { gl_Position = vec4(a_position, 0.0, 1.0); }
`

const RESERVED_COLOR_UNIFORMS = new Set(["u_time", "u_resolution", "u_pointer"])
const COLOR_UNIFORM_PATTERN = /^u_[A-Za-z][A-Za-z0-9_]*$/
const INVALID_COLOR_UNIFORM_MESSAGE =
  "Color uniform names must use the u_name format."

function toRgb(
  value: string,
  host: HTMLElement,
  probe: CanvasRenderingContext2D | null
): [number, number, number] {
  const previousColor = host.style.color
  host.style.color = value
  const computed = getComputedStyle(host).color
  host.style.color = previousColor

  if (!probe) return [0.5, 0.5, 0.5]

  probe.clearRect(0, 0, 1, 1)
  probe.fillStyle = computed
  probe.fillRect(0, 0, 1, 1)
  const [red, green, blue] = probe.getImageData(0, 0, 1, 1).data

  return [red! / 255, green! / 255, blue! / 255]
}

function errorMessage(error: unknown) {
  return error instanceof Error
    ? error.message
    : "The shader could not be rendered."
}

/** A theme-aware WebGL background with a static fallback and reduced-motion support. */
export function ShaderCanvas({
  fragment = DEFAULT_FRAGMENT,
  colors = DEFAULT_COLORS,
  resolution = 0.8,
  stillTime = 4,
  pointerInteraction = true,
  showErrors = false,
  onError,
  onStatusChange,
  label,
  children,
  className,
}: ShaderCanvasProps) {
  const hostRef = useRef<HTMLDivElement>(null)
  const canvasRef = useRef<HTMLCanvasElement>(null)
  const reducedMotion = usePrefersReducedMotion()
  const callbacks = useRef({ onError, onStatusChange })
  const colorKey = JSON.stringify(colors)
  const shaderKey = JSON.stringify([
    fragment,
    colorKey,
    resolution,
    stillTime,
    pointerInteraction,
    reducedMotion,
  ])
  const [statusState, setStatusState] = useState<{
    key: string
    status: ShaderCanvasStatus
  }>(() => ({ key: shaderKey, status: "starting" }))
  const [error, setError] = useState<{ key: string; message: string } | null>(
    null
  )
  const status = statusState.key === shaderKey ? statusState.status : "starting"
  const invalidColorUniform = Object.keys(colors).some(
    (name) =>
      !COLOR_UNIFORM_PATTERN.test(name) || RESERVED_COLOR_UNIFORMS.has(name)
  )
  const displayStatus = invalidColorUniform ? "error" : status
  const displayError = invalidColorUniform
    ? INVALID_COLOR_UNIFORM_MESSAGE
    : error?.key === shaderKey
      ? error.message
      : null

  useEffect(() => {
    callbacks.current = { onError, onStatusChange }
  }, [onError, onStatusChange])

  useEffect(() => {
    if (invalidColorUniform)
      callbacks.current.onError?.(INVALID_COLOR_UNIFORM_MESSAGE)
  }, [invalidColorUniform])

  useEffect(() => {
    callbacks.current.onStatusChange?.(displayStatus)
  }, [displayStatus])

  useEffect(() => {
    const host = hostRef.current
    const canvas = canvasRef.current
    if (!host || !canvas) return
    if (invalidColorUniform) return

    const gl = canvas.getContext("webgl", {
      antialias: false,
      premultipliedAlpha: false,
    })

    if (!gl) {
      setStatusState({ key: shaderKey, status: "unsupported" })
      return
    }

    const palette = JSON.parse(colorKey) as Record<string, string>
    const names = Object.keys(palette)

    const header = [
      "precision mediump float;",
      "uniform float u_time;",
      "uniform vec2 u_resolution;",
      "uniform vec2 u_pointer;",
      ...names.map((name) => `uniform vec3 ${name};`),
    ].join("\n")
    const headerLines = names.length + 4

    let vertex: WebGLShader | null = null
    let pixel: WebGLShader | null = null
    let program: WebGLProgram | null = null
    let buffer: WebGLBuffer | null = null

    const deleteResources = () => {
      if (program) gl.deleteProgram(program)
      if (vertex) gl.deleteShader(vertex)
      if (pixel) gl.deleteShader(pixel)
      if (buffer) gl.deleteBuffer(buffer)
    }

    const compile = (type: number, source: string) => {
      const shader = gl.createShader(type)
      if (!shader) throw new Error("The browser could not create a shader.")

      gl.shaderSource(shader, source)
      gl.compileShader(shader)

      if (!gl.getShaderParameter(shader, gl.COMPILE_STATUS)) {
        const log = (gl.getShaderInfoLog(shader) ?? "")
          .replace(/[^\x20-\x7e\n]/g, "")
          .trim()
        const shifted =
          type === gl.FRAGMENT_SHADER
            ? log.replace(/(\d+):(\d+)/g, (_match, file, line) => {
                return `${file}:${Math.max(1, Number(line) - headerLines)}`
              })
            : log

        gl.deleteShader(shader)
        throw new Error(shifted || "The shader did not compile.")
      }

      return shader
    }

    try {
      vertex = compile(gl.VERTEX_SHADER, VERTEX)
      pixel = compile(gl.FRAGMENT_SHADER, `${header}\n${fragment}`)
      program = gl.createProgram()
      if (!program)
        throw new Error("The browser could not create a shader program.")

      gl.attachShader(program, vertex)
      gl.attachShader(program, pixel)
      gl.linkProgram(program)

      if (!gl.getProgramParameter(program, gl.LINK_STATUS)) {
        throw new Error(
          gl.getProgramInfoLog(program)?.trim() || "The shader did not link."
        )
      }
    } catch (compileError) {
      deleteResources()
      const message = errorMessage(compileError)
      setError({ key: shaderKey, message })
      setStatusState({ key: shaderKey, status: "error" })
      callbacks.current.onError?.(message)
      return
    }

    gl.useProgram(program)
    buffer = gl.createBuffer()
    if (!buffer) {
      deleteResources()
      const message = "The browser could not create a shader buffer."
      setError({ key: shaderKey, message })
      setStatusState({ key: shaderKey, status: "error" })
      callbacks.current.onError?.(message)
      return
    }

    gl.bindBuffer(gl.ARRAY_BUFFER, buffer)
    gl.bufferData(
      gl.ARRAY_BUFFER,
      new Float32Array([-1, -1, 3, -1, -1, 3]),
      gl.STATIC_DRAW
    )

    const position = gl.getAttribLocation(program, "a_position")
    if (position < 0) {
      deleteResources()
      const message = "The vertex shader needs an a_position attribute."
      setError({ key: shaderKey, message })
      setStatusState({ key: shaderKey, status: "error" })
      callbacks.current.onError?.(message)
      return
    }

    gl.enableVertexAttribArray(position)
    gl.vertexAttribPointer(position, 2, gl.FLOAT, false, 0, 0)

    const uniform = (name: string) => gl.getUniformLocation(program, name)
    const uTime = uniform("u_time")
    const uResolution = uniform("u_resolution")
    const uPointer = uniform("u_pointer")
    const colorUniforms = names.map((name) => [name, uniform(name)] as const)

    const probeCanvas = document.createElement("canvas")
    probeCanvas.width = 1
    probeCanvas.height = 1
    const probe = probeCanvas.getContext("2d", { willReadFrequently: true })

    const applyColors = () => {
      for (const [name, location] of colorUniforms) {
        if (location)
          gl.uniform3fv(location, toRgb(palette[name]!, canvas, probe))
      }
    }

    const pointer = { x: 0.5, y: 0.5, targetX: 0.5, targetY: 0.5 }
    let frame = 0
    let visible = true
    let elapsed = stillTime
    let last = 0
    let contextLost = false
    let hasDrawnFrame = false

    const resize = () => {
      const rect = canvas.getBoundingClientRect()
      const ratio = Math.min(2, (window.devicePixelRatio || 1) * resolution)
      canvas.width = Math.max(1, Math.round(rect.width * ratio))
      canvas.height = Math.max(1, Math.round(rect.height * ratio))
      gl.viewport(0, 0, canvas.width, canvas.height)
    }

    const render = (time: number) => {
      if (contextLost) return
      if (uTime) gl.uniform1f(uTime, time)
      if (uResolution) gl.uniform2f(uResolution, canvas.width, canvas.height)
      if (uPointer) gl.uniform2f(uPointer, pointer.x, pointer.y)
      gl.drawArrays(gl.TRIANGLES, 0, 3)
    }

    const revealCanvas = () => {
      if (hasDrawnFrame) return
      hasDrawnFrame = true
      setStatusState({ key: shaderKey, status: "running" })
    }

    const loop = (now: number) => {
      if (last) elapsed += Math.min(0.1, (now - last) / 1000)
      last = now
      pointer.x += (pointer.targetX - pointer.x) * 0.055
      pointer.y += (pointer.targetY - pointer.y) * 0.055
      render(elapsed)
      revealCanvas()
      frame = requestAnimationFrame(loop)
    }

    const stop = () => {
      cancelAnimationFrame(frame)
      last = 0
    }

    const start = () => {
      stop()
      if (reducedMotion) {
        render(stillTime)
        revealCanvas()
      } else if (visible && !document.hidden)
        frame = requestAnimationFrame(loop)
    }

    resize()
    applyColors()
    start()

    const resizeObserver =
      typeof ResizeObserver === "undefined"
        ? null
        : new ResizeObserver(() => {
            resize()
            render(reducedMotion ? stillTime : elapsed)
          })
    resizeObserver?.observe(canvas)

    const onWindowResize = () => {
      resize()
      render(reducedMotion ? stillTime : elapsed)
    }
    if (!resizeObserver) window.addEventListener("resize", onWindowResize)

    const intersection =
      typeof IntersectionObserver === "undefined"
        ? null
        : new IntersectionObserver(([entry]) => {
            visible = Boolean(entry?.isIntersecting)
            if (visible) start()
            else stop()
          })
    intersection?.observe(canvas)

    const onVisibility = () => (document.hidden ? stop() : start())
    document.addEventListener("visibilitychange", onVisibility)

    const onPointerMove = (event: PointerEvent) => {
      const rect = host.getBoundingClientRect()
      if (!rect.width || !rect.height) return

      const x = Math.min(
        1,
        Math.max(0, (event.clientX - rect.left) / rect.width)
      )
      const y = Math.min(
        1,
        Math.max(0, (event.clientY - rect.top) / rect.height)
      )
      pointer.targetX = x
      pointer.targetY = 1 - y
      host.style.setProperty("--shader-pointer-x", `${x * 100}%`)
      host.style.setProperty("--shader-pointer-y", `${y * 100}%`)
    }
    const onPointerLeave = () => {
      pointer.targetX = 0.5
      pointer.targetY = 0.5
      host.style.setProperty("--shader-pointer-x", "50%")
      host.style.setProperty("--shader-pointer-y", "50%")
    }
    if (pointerInteraction && !reducedMotion) {
      host.addEventListener("pointermove", onPointerMove, { passive: true })
      host.addEventListener("pointerleave", onPointerLeave)
    }

    const themeObserver = new MutationObserver(() => {
      applyColors()
      render(reducedMotion ? stillTime : elapsed)
    })
    themeObserver.observe(document.documentElement, {
      attributes: true,
      attributeFilter: ["class", "data-theme", "style"],
    })

    const onContextLost = (event: Event) => {
      event.preventDefault()
      contextLost = true
      stop()
      setStatusState({ key: shaderKey, status: "unsupported" })
    }
    canvas.addEventListener("webglcontextlost", onContextLost)

    return () => {
      stop()
      resizeObserver?.disconnect()
      intersection?.disconnect()
      if (!resizeObserver) window.removeEventListener("resize", onWindowResize)
      themeObserver.disconnect()
      document.removeEventListener("visibilitychange", onVisibility)
      host.removeEventListener("pointermove", onPointerMove)
      host.removeEventListener("pointerleave", onPointerLeave)
      canvas.removeEventListener("webglcontextlost", onContextLost)
      deleteResources()
    }
  }, [
    fragment,
    colorKey,
    resolution,
    stillTime,
    pointerInteraction,
    reducedMotion,
    invalidColorUniform,
    shaderKey,
  ])

  const drawing = displayStatus === "running"

  return (
    <div
      ref={hostRef}
      className={cn("shader-canvas", className)}
      data-status={displayStatus}
    >
      <div aria-hidden="true" className="shader-canvas__fallback" />
      <canvas
        ref={canvasRef}
        role={label ? "img" : undefined}
        aria-label={label}
        aria-hidden={label ? undefined : true}
        className={cn("shader-canvas__drawing", !drawing && "is-hidden")}
      />
      {showErrors && displayError ? (
        <pre className="shader-canvas__error" role="alert" tabIndex={0}>
          {displayError}
        </pre>
      ) : null}
      {children}
    </div>
  )
}

export default ShaderCanvas
