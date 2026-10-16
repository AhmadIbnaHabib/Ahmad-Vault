import { Canvas, useFrame, useThree } from '@react-three/fiber'
import { useTexture } from '@react-three/drei'
import { useEffect, useMemo, useRef } from 'react'
import * as THREE from 'three'
import {
  VAULT_BACK_EVENT,
  VAULT_ENTER_COMPLETE_EVENT,
  VAULT_ENTER_EVENT,
} from '@/lib/vault-events'

const IMAGE_SRC = '/images/vault-entry-background.png'

const vertexShader = `
  varying vec2 vUv;
  void main() {
    vUv = uv;
    gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0);
  }
`

const fragmentShader = `
  precision highp float;
  uniform sampler2D uTex;
  uniform float uTime;
  uniform float uEnter;
  uniform float uReverse;
  uniform float uRadial;
  uniform float uIntro;
  uniform vec2 uClick;
  uniform float uClickT;
  uniform vec2 uRes;
  uniform vec2 uImgRes;
  varying vec2 vUv;

  const vec3 DEEP = vec3(0.165, 0.0, 0.086);

  float hash(vec2 p) {
    return fract(sin(dot(p, vec2(127.1, 311.7))) * 43758.5453);
  }

  void main() {
    float aspect = uRes.x / uRes.y;
    float intro = uIntro * uIntro * (3.0 - 2.0 * uIntro);
    vec2 cover = uRes / uImgRes;
    float coverScale = max(cover.x, cover.y);
    vec2 uv = (vUv - 0.5) * (uRes / (uImgRes * coverScale)) + 0.5;
    float zoom = 0.94 - (1.0 - intro) * 0.07 - uEnter * 0.1;
    uv = (uv - 0.5) * zoom + 0.5;

    vec3 probe = texture2D(uTex, uv).rgb;
    float honey = smoothstep(0.15, 0.35, probe.g - probe.b)
      * step(0.55, probe.r) * step(0.35, probe.g);
    vec2 wave = vec2(
      sin(uv.y * 9.0 + uTime * 0.8 + sin(uv.x * 4.0 + uTime * 0.4) * 1.2),
      cos(uv.x * 6.0 - uTime * 0.6 + uv.y * 4.0)
    );
    float cream = smoothstep(0.62, 0.28, uv.y);
    vec2 disp = wave * 0.0028 * cream;

    vec2 clickDelta = (vUv - uClick) * vec2(aspect, 1.0);
    float clickDistance = length(clickDelta);
    float ripple = sin(clickDistance * 48.0 - uClickT * 13.0)
      * exp(-abs(clickDistance - uClickT * 0.75) * 9.0)
      * exp(-uClickT * 1.4);
    disp += clickDelta / (clickDistance + 0.0001) * ripple * 0.006;

    vec2 suv = uv + disp;
    vec2 ca = (vUv - 0.5) * (0.0022 + uEnter * 0.01);
    vec3 col = vec3(
      texture2D(uTex, suv + ca).r,
      texture2D(uTex, suv).g,
      texture2D(uTex, suv - ca).b
    );

    col += vec3(1.0, 0.82, 0.45)
      * pow(0.5 + 0.5 * sin(uv.y * 38.0 + uTime * 4.0), 10.0)
      * honey * 0.35;

    float vignette = smoothstep(1.15, 0.35, length((vUv - 0.5) * vec2(1.2, 1.0)));
    col *= mix(0.55, 1.0, vignette);
    col += (hash(vUv * uRes + uTime) - 0.5) * 0.025;

    if (uEnter > 0.0) {
      float drips = pow(0.5 + 0.5 * sin(vUv.x * 21.0 + 1.3), 3.0) * 0.2
        + (0.5 + 0.5 * sin(vUv.x * 57.0 + 0.7)) * 0.05;
      float wipeY = 1.0 - vUv.y;
      float forwardEdge = uEnter * 1.5 + drips * uEnter;
      float reverseEdge = 1.0 - forwardEdge;
      vec2 radialDelta = (vUv - 0.5) * vec2(aspect, 1.0);
      float radialDistance = length(radialDelta) / length(vec2(aspect, 1.0) * 0.5);
      float radialEdge = uEnter * 1.08 + drips * uEnter * 0.08;
      float edge = mix(mix(forwardEdge, reverseEdge, uReverse), radialEdge, uRadial);
      float forwardInside = 1.0 - smoothstep(edge - 0.004, edge + 0.004, wipeY);
      float reverseInside = smoothstep(edge - 0.004, edge + 0.004, wipeY);
      float directionalInside = mix(forwardInside, reverseInside, uReverse);
      float radialInside = 1.0 - smoothstep(edge - 0.004, edge + 0.004, radialDistance);
      float inside = mix(directionalInside, radialInside, uRadial);
      float directionalBody = clamp(mix(edge - wipeY, wipeY - edge, uReverse) * 2.5, 0.0, 1.0);
      float radialBody = clamp((edge - radialDistance) * 2.5, 0.0, 1.0);
      float body = mix(directionalBody, radialBody, uRadial);
      vec2 refrOffset = mix(
        vec2(0.0, (vUv.y - edge) * 0.1),
        normalize(radialDelta + vec2(0.0001)) * (radialDistance - edge) * 0.1,
        uRadial
      );
      vec3 refr = texture2D(uTex, uv + refrOffset).rgb;
      vec3 honeyCol = mix(vec3(1.0, 0.64, 0.14), vec3(0.85, 0.2, 0.42), body);
      honeyCol = mix(honeyCol, refr * vec3(1.1, 0.75, 0.45), 0.22);
      honeyCol += pow(0.5 + 0.5 * sin(vUv.x * 38.0 + vUv.y * 5.0 + uTime * 2.0), 12.0)
        * 0.22 * (1.0 - body);
      col = mix(col, honeyCol, inside);
      col = mix(col, DEEP, smoothstep(0.72, 1.0, uEnter));
    }

    col = mix(DEEP, col, intro);
    gl_FragColor = vec4(col, 1.0);
  }
`

function LivingImage() {
  const texture = useTexture(IMAGE_SRC)
  const { size, viewport, gl } = useThree()
  const materialRef = useRef(null)
  const entering = useRef(false)
  const exiting = useRef(false)
  const reducedMotion = useMemo(
    () => window.matchMedia('(prefers-reduced-motion: reduce)').matches,
    [],
  )

  const uniforms = useMemo(() => {
    texture.minFilter = THREE.LinearMipmapLinearFilter
    texture.magFilter = THREE.LinearFilter
    texture.generateMipmaps = true
    texture.anisotropy = gl.capabilities.getMaxAnisotropy()
    texture.needsUpdate = true
    return {
      uTex: { value: texture },
      uTime: { value: 0 },
      uClick: { value: new THREE.Vector2(0.5, 0.5) },
      uClickT: { value: 100 },
      uEnter: { value: 0 },
      uReverse: { value: 0 },
      uRadial: { value: 0 },
      uIntro: { value: reducedMotion ? 1 : 0 },
      uRes: { value: new THREE.Vector2(1, 1) },
      uImgRes: { value: new THREE.Vector2(texture.image.width, texture.image.height) },
    }
  }, [texture, gl, reducedMotion])

  useEffect(() => {
    const onDown = (event) => {
      uniforms.uClick.value.set(
        event.clientX / window.innerWidth,
        1 - event.clientY / window.innerHeight,
      )
      uniforms.uClickT.value = 0
    }
    const onEnter = () => {
      uniforms.uReverse.value = 0
      uniforms.uRadial.value = 1
      entering.current = true
      exiting.current = false
    }
    const onBack = () => {
      uniforms.uReverse.value = 1
      uniforms.uRadial.value = 0
      entering.current = true
      exiting.current = false
    }
    const onEnterComplete = () => {
      entering.current = false
      exiting.current = true
    }
    window.addEventListener('pointerdown', onDown, { passive: true })
    window.addEventListener(VAULT_ENTER_EVENT, onEnter)
    window.addEventListener(VAULT_BACK_EVENT, onBack)
    window.addEventListener(VAULT_ENTER_COMPLETE_EVENT, onEnterComplete)
    return () => {
      window.removeEventListener('pointerdown', onDown)
      window.removeEventListener(VAULT_ENTER_EVENT, onEnter)
      window.removeEventListener(VAULT_BACK_EVENT, onBack)
      window.removeEventListener(VAULT_ENTER_COMPLETE_EVENT, onEnterComplete)
    }
  }, [uniforms])

  useFrame((_, rawDelta) => {
    const material = materialRef.current
    if (!material) return
    const delta = Math.min(rawDelta, 0.05)
    const current = material.uniforms

    if (!reducedMotion) current.uTime.value += delta
    current.uClickT.value += delta
    current.uIntro.value = Math.min(1, current.uIntro.value + delta / 2.2)
    if (entering.current) current.uEnter.value = Math.min(1, current.uEnter.value + delta / 1.5)
    if (exiting.current) {
      current.uEnter.value = Math.max(0, current.uEnter.value - delta / 1.2)
      if (current.uEnter.value === 0) exiting.current = false
    }

    current.uRes.value.set(size.width, size.height)
  })

  return (
    <mesh>
      <planeGeometry args={[viewport.width, viewport.height]} />
      <shaderMaterial
        ref={materialRef}
        uniforms={uniforms}
        vertexShader={vertexShader}
        fragmentShader={fragmentShader}
        glslVersion={THREE.GLSL1}
      />
    </mesh>
  )
}

export default function Vault3DScene() {
  return (
    <Canvas
      flat
      linear
      orthographic
      camera={{ position: [0, 0, 5], zoom: 1 }}
      dpr={[1, 2]}
      gl={{ antialias: false, powerPreference: 'high-performance' }}
      className="!absolute inset-0"
    >
      <LivingImage />
    </Canvas>
  )
}
