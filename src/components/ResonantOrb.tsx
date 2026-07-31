import { useRef, useEffect } from 'react';
import { Canvas, useFrame, useThree } from '@react-three/fiber';
import { MeshTransmissionMaterial } from '@react-three/drei';
import * as THREE from 'three';

// ── Frosted glassmorphism shell ───────────────────────────────────────────────
function GlassShell() {
    const matRef = useRef<any>(null!);
    const t = useRef(0);

    useFrame((_, delta) => {
        t.current += delta;
        // Slow surface shimmer (14s) — very subtle
        const hum = (Math.sin((t.current / 14) * Math.PI * 2) + 1) / 2;
        if (matRef.current) {
            matRef.current.distortionScale = 0.05 + hum * 0.12;
            matRef.current.temporalDistortion = 0.005 + hum * 0.015;
        }
    });

    return (
        <mesh>
            <sphereGeometry args={[1.1, 64, 64]} />
            <MeshTransmissionMaterial
                ref={matRef}
                samples={10}
                resolution={512}
                // Glassmorphism = frosted, not crystal-clear
                transmission={0.7}
                roughness={0.35}
                thickness={0.6}
                ior={1.4}
                chromaticAberration={0.008}
                anisotropy={0.05}
                distortion={0.03}
                distortionScale={0.08}
                temporalDistortion={0.01}
                // Soft cyan-white tint — matches the site accent
                color="#d6f8f4"
                backside={true}
                attenuationDistance={8}
                attenuationColor="#64FFDA"
                // Subtle reflectivity for the glass edge highlight
                envMapIntensity={0.4}
            />
        </mesh>
    );
}

// ── Glass edge highlight ring — gives the "pane of glass" feel ───────────────
function GlassRim() {
    return (
        <mesh>
            <sphereGeometry args={[1.12, 64, 64]} />
            <meshPhysicalMaterial
                color="#ffffff"
                roughness={0.0}
                metalness={0.0}
                transparent
                opacity={0.04}
                side={THREE.BackSide}
                depthWrite={false}
            />
        </mesh>
    );
}

// ── Pulsing core light: very dim, 5-second cycle ──────────────────────────────
function CoreLight() {
    const lightRef = useRef<THREE.PointLight>(null!);
    const t = useRef(0);

    useFrame((_, delta) => {
        t.current += delta;
        const pulse = (Math.sin((t.current / 5) * Math.PI * 2) + 1) / 2;
        if (lightRef.current) {
            // Very gentle range: 0.0 → 0.6
            lightRef.current.intensity = pulse * 0.6;
        }
    });

    return (
        <pointLight
            ref={lightRef}
            position={[0, 0, 0]}
            color="#64FFDA"
            intensity={0}
            distance={3}
            decay={2}
        />
    );
}

// ── Cursor parallax ───────────────────────────────────────────────────────────
function OrbMesh({ mouse }: { mouse: React.RefObject<{ x: number; y: number }> }) {
    const groupRef = useRef<THREE.Group>(null!);

    useFrame(() => {
        if (!groupRef.current || !mouse.current) return;
        const targetX = -mouse.current.y * 0.0873;
        const targetY = mouse.current.x * 0.0873;
        groupRef.current.rotation.x += (targetX - groupRef.current.rotation.x) * 0.04;
        groupRef.current.rotation.y += (targetY - groupRef.current.rotation.y) * 0.04;
    });

    return (
        <group ref={groupRef}>
            {/* Neutral scene lighting — soft, studio-like */}
            <ambientLight intensity={0.5} color="#cce8ff" />
            <directionalLight position={[-3, 4, 3]} intensity={0.6} color="#ffffff" />
            <directionalLight position={[2, -2, -1]} intensity={0.15} color="#64FFDA" />

            <GlassShell />
            <GlassRim />
            <CoreLight />
        </group>
    );
}

// ── Gentle camera drift ───────────────────────────────────────────────────────
function CameraRig() {
    const { camera } = useThree();
    const t = useRef(0);
    useFrame((_, delta) => {
        t.current += delta;
        camera.position.y = Math.sin(t.current * 0.05 * Math.PI * 2) * 0.06;
    });
    return null;
}

// ── Public component ──────────────────────────────────────────────────────────
export default function ResonantOrb() {
    const mouse = useRef({ x: 0, y: 0 });

    useEffect(() => {
        const onMove = (e: MouseEvent) => {
            mouse.current.x = (e.clientX / window.innerWidth) * 2 - 1;
            mouse.current.y = -((e.clientY / window.innerHeight) * 2 - 1);
        };
        window.addEventListener('mousemove', onMove);
        return () => window.removeEventListener('mousemove', onMove);
    }, []);

    return (
        <Canvas
            camera={{ position: [0, 0, 4], fov: 40 }}
            gl={{ antialias: true, alpha: true }}
            style={{ background: 'transparent' }}
            dpr={[1, 1.5]}
        >
            <CameraRig />
            <OrbMesh mouse={mouse} />
        </Canvas>
    );
}
