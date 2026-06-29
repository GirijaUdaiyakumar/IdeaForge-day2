import { useRef, useMemo, useState, useEffect } from "react";
import { Canvas, useFrame, useThree } from "@react-three/fiber";
import { Sphere, MeshDistortMaterial, Float, Stars } from "@react-three/drei";
import * as THREE from "three";

/* ── Mouse tracker ── */
function MouseTracker({ setMouse }) {
  const { size } = useThree();
  useEffect(() => {
    const handle = e => {
      setMouse(new THREE.Vector2(
        (e.clientX / size.width)  * 2 - 1,
       -(e.clientY / size.height) * 2 + 1
      ));
    };
    window.addEventListener("mousemove", handle, { passive: true });
    return () => window.removeEventListener("mousemove", handle);
  }, [size, setMouse]);
  return null;
}

/* ── Central AI core sphere with mouse influence ── */
function AICore({ mouse }) {
  const ref = useRef();
  useFrame((state, delta) => {
    const t = state.clock.elapsedTime;
    ref.current.rotation.y += delta * 0.12;
    ref.current.rotation.x = THREE.MathUtils.lerp(ref.current.rotation.x, mouse.y * 0.3, 0.04);
    ref.current.position.x = THREE.MathUtils.lerp(ref.current.position.x, mouse.x * 0.4, 0.03);
    ref.current.position.y = THREE.MathUtils.lerp(ref.current.position.y, mouse.y * 0.3 + Math.sin(t * 0.6) * 0.1, 0.03);
  });
  return (
    <Float speed={1.8} rotationIntensity={0.2} floatIntensity={0.4}>
      <mesh ref={ref}>
        <Sphere args={[1.1, 96, 96]}>
          <MeshDistortMaterial
            color="#f59e0b"
            emissive="#f97316"
            emissiveIntensity={0.35}
            distort={0.35}
            speed={2.2}
            roughness={0.05}
            metalness={0.7}
            transparent
            opacity={0.92}
          />
        </Sphere>
      </mesh>
    </Float>
  );
}

/* ── Orbital rings with mouse tilt ── */
function OrbitRing({ radius, speed, color, tiltX, tiltZ, mouse }) {
  const ref = useRef();
  const geom = useMemo(() => {
    const pts = [];
    for (let i = 0; i <= 160; i++) {
      const a = (i / 160) * Math.PI * 2;
      pts.push(new THREE.Vector3(Math.cos(a) * radius, Math.sin(a) * radius, 0));
    }
    return new THREE.BufferGeometry().setFromPoints(pts);
  }, [radius]);

  useFrame((state, delta) => {
    ref.current.rotation.z += delta * speed;
    ref.current.rotation.x = THREE.MathUtils.lerp(ref.current.rotation.x, tiltX + mouse.y * 0.15, 0.03);
    ref.current.rotation.y = THREE.MathUtils.lerp(ref.current.rotation.y, mouse.x * 0.1, 0.03);
  });

  return (
    <lineLoop ref={ref} geometry={geom} rotation={[tiltX, 0, tiltZ]}>
      <lineBasicMaterial color={color} transparent opacity={0.4} />
    </lineLoop>
  );
}

/* ── Neural node ── */
function IdeaNode({ position, color, scale = 1 }) {
  const ref = useRef();
  const offset = useMemo(() => Math.random() * Math.PI * 2, []);
  useFrame((state) => {
    const t = state.clock.elapsedTime;
    ref.current.position.y = position[1] + Math.sin(t * 0.7 + offset) * 0.12;
    ref.current.rotation.x += 0.008;
    ref.current.rotation.z += 0.005;
  });
  return (
    <mesh ref={ref} position={position} scale={scale}>
      <octahedronGeometry args={[0.13, 0]} />
      <meshStandardMaterial color={color} emissive={color} emissiveIntensity={0.5} metalness={0.6} roughness={0.1} transparent opacity={0.85} />
    </mesh>
  );
}

/* ── Neural connections between nodes ── */
function NeuralLine({ from, to, color }) {
  const ref = useRef();
  const geom = useMemo(() => {
    const g = new THREE.BufferGeometry().setFromPoints([
      new THREE.Vector3(...from),
      new THREE.Vector3(...to),
    ]);
    return g;
  }, [from, to]);

  useFrame((state) => {
    if (ref.current?.material) {
      ref.current.material.opacity = 0.08 + Math.sin(state.clock.elapsedTime * 1.5) * 0.06;
    }
  });

  return (
    <line ref={ref} geometry={geom}>
      <lineBasicMaterial color={color} transparent opacity={0.12} />
    </line>
  );
}

/* ── Ambient particle cloud ── */
function ParticleField() {
  const ref = useRef();
  const { positions, colors } = useMemo(() => {
    const count = 280;
    const pos = new Float32Array(count * 3);
    const col = new Float32Array(count * 3);
    for (let i = 0; i < count; i++) {
      const r   = 3.8 + Math.random() * 2.8;
      const th  = Math.random() * Math.PI * 2;
      const phi = Math.acos(2 * Math.random() - 1);
      pos[i * 3]     = r * Math.sin(phi) * Math.cos(th);
      pos[i * 3 + 1] = r * Math.sin(phi) * Math.sin(th);
      pos[i * 3 + 2] = r * Math.cos(phi);
      // Gold → orange → purple gradient
      const t = Math.random();
      col[i * 3]     = t < 0.5 ? 0.96 : 0.55 + t * 0.3;
      col[i * 3 + 1] = t < 0.5 ? 0.62 + t * 0.4 : 0.36 * (1 - t);
      col[i * 3 + 2] = t < 0.5 ? 0.04 : 0.35 + t * 0.4;
    }
    return { positions: pos, colors: col };
  }, []);

  useFrame((state, delta) => {
    ref.current.rotation.y += delta * 0.035;
    ref.current.rotation.x  = Math.sin(state.clock.elapsedTime * 0.12) * 0.08;
  });

  return (
    <points ref={ref}>
      <bufferGeometry>
        <bufferAttribute attach="attributes-position" count={positions.length / 3} array={positions} itemSize={3} />
        <bufferAttribute attach="attributes-color"    count={colors.length / 3}    array={colors}    itemSize={3} />
      </bufferGeometry>
      <pointsMaterial size={0.022} vertexColors transparent opacity={0.75} sizeAttenuation />
    </points>
  );
}

/* ── Floating geometric shape ── */
function FloatingShape({ position, color, size, speed, shape = "cube" }) {
  const ref = useRef();
  const off = useMemo(() => Math.random() * 10, []);
  useFrame((state, delta) => {
    ref.current.rotation.x += delta * speed;
    ref.current.rotation.y += delta * speed * 0.65;
    ref.current.position.y = position[1] + Math.sin(state.clock.elapsedTime * 0.9 + off) * 0.18;
  });
  return (
    <mesh ref={ref} position={position}>
      {shape === "cube"   && <boxGeometry args={[size, size, size]} />}
      {shape === "tetra"  && <tetrahedronGeometry args={[size, 0]} />}
      {shape === "icosa"  && <icosahedronGeometry args={[size * 0.8, 0]} />}
      <meshStandardMaterial color={color} emissive={color} emissiveIntensity={0.4} metalness={0.5} roughness={0.15} transparent opacity={0.72} wireframe={shape === "icosa"} />
    </mesh>
  );
}

/* ── Scene camera that gently follows mouse ── */
function CameraRig({ mouse }) {
  useFrame((state, delta) => {
    state.camera.position.x = THREE.MathUtils.lerp(state.camera.position.x, mouse.x * 0.5, 0.04);
    state.camera.position.y = THREE.MathUtils.lerp(state.camera.position.y, mouse.y * 0.3, 0.04);
    state.camera.lookAt(0, 0, 0);
  });
  return null;
}

/* ── Node network positions ── */
const NODES = [
  { pos: [2.4,  1.1, 0.2],  color: "#f59e0b", scale: 1.2 },
  { pos: [-2.1, 0.8, -0.3], color: "#8b5cf6", scale: 1.0 },
  { pos: [1.6, -1.6, 0.6],  color: "#10b981", scale: 0.9 },
  { pos: [-1.7,-1.4, 0.1],  color: "#f97316", scale: 1.1 },
  { pos: [0.3,  2.6, -0.4], color: "#06b6d4", scale: 0.8 },
  { pos: [-0.5,-2.5, 0.5],  color: "#d946ef", scale: 0.85 },
];
const CONNECTIONS = [[0,1],[1,2],[2,3],[3,4],[4,5],[0,2],[1,3],[0,4]];

/* ── Main export ── */
export default function HeroScene3D() {
  const [mouse, setMouse] = useState(new THREE.Vector2(0, 0));

  return (
    <div style={{ width: "100%", height: "100%", position: "absolute", inset: 0, pointerEvents: "none" }}>
      <Canvas
        camera={{ position: [0, 0, 6.5], fov: 48 }}
        gl={{ antialias: true, alpha: true, powerPreference: "high-performance" }}
        dpr={[1, 1.5]}
        style={{ background: "transparent" }}
        performance={{ min: 0.5 }}
      >
        <MouseTracker setMouse={setMouse} />
        <CameraRig mouse={mouse} />

        {/* Lighting */}
        <ambientLight intensity={0.35} />
        <pointLight position={[5, 5, 5]}   intensity={1.8} color="#f59e0b" />
        <pointLight position={[-4, -3, -2]} intensity={0.8} color="#8b5cf6" />
        <pointLight position={[0, -5, 3]}  intensity={0.5} color="#10b981" />
        <spotLight  position={[0, 8, 2]} intensity={1.2} color="#fbbf24" angle={0.35} penumbra={0.6} castShadow={false} />

        <Stars radius={22} depth={10} count={350} factor={2.2} saturation={0.1} fade speed={0.4} />

        <AICore mouse={mouse} />
        <ParticleField />

        {/* Orbital rings */}
        <OrbitRing radius={2.0} speed={0.14}  color="#f59e0b" tiltX={0.5}  tiltZ={0}   mouse={mouse} />
        <OrbitRing radius={2.6} speed={-0.09} color="#8b5cf6" tiltX={1.2}  tiltZ={0.3} mouse={mouse} />
        <OrbitRing radius={3.2} speed={0.07}  color="#10b981" tiltX={0.8}  tiltZ={0.6} mouse={mouse} />
        <OrbitRing radius={3.8} speed={-0.05} color="#06b6d4" tiltX={0.3}  tiltZ={1.0} mouse={mouse} />

        {/* Idea nodes */}
        {NODES.map((n, i) => <IdeaNode key={i} position={n.pos} color={n.color} scale={n.scale} />)}

        {/* Neural connections */}
        {CONNECTIONS.map(([a, b], i) => (
          <NeuralLine key={i} from={NODES[a].pos} to={NODES[b].pos} color={NODES[a].color} />
        ))}

        {/* Floating shapes */}
        <FloatingShape position={[3.2,  0.4, -1]}  color="#f59e0b" size={0.16} speed={0.55} shape="cube" />
        <FloatingShape position={[-2.8, 1.5, 0.2]}  color="#8b5cf6" size={0.13} speed={0.45} shape="tetra" />
        <FloatingShape position={[2.0, -2.2, 0.5]}  color="#10b981" size={0.15} speed={0.7}  shape="cube" />
        <FloatingShape position={[-3.1,-1.0,-0.3]}  color="#f97316" size={0.12} speed={0.38} shape="icosa" />
        <FloatingShape position={[0.5,  3.2,-0.6]}  color="#06b6d4" size={0.11} speed={0.62} shape="tetra" />
      </Canvas>
    </div>
  );
}
