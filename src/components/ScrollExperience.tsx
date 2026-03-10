import { useRef, useEffect } from 'react';
import { Canvas, useFrame, useThree } from '@react-three/fiber';
import { Float, Stars, Points, PointMaterial } from '@react-three/drei';
import * as THREE from 'three';
import { useMemo } from 'react';

function Scene() {
    const group = useRef<THREE.Group>(null);
    const scrollTarget = useRef(0);
    const scrollCurrent = useRef(0);
    const { viewport } = useThree();
    const isMobile = viewport.width < 10; // Simple check based on three.js units

    useEffect(() => {
        const handleScroll = () => {
            const maxScroll = document.documentElement.scrollHeight - window.innerHeight;
            scrollTarget.current = maxScroll > 0 ? window.scrollY / maxScroll : 0;
        };
        window.addEventListener('scroll', handleScroll, { passive: true });
        handleScroll(); // Initial call
        return () => window.removeEventListener('scroll', handleScroll);
    }, []);

    useFrame(() => {
        if (group.current) {
            const damping = 0.05;
            scrollCurrent.current = THREE.MathUtils.lerp(
                scrollCurrent.current,
                scrollTarget.current,
                damping
            );

            const offset = scrollCurrent.current;
            group.current.rotation.y = offset * 0.5;
            group.current.rotation.x = offset * 0.2;
            group.current.position.z = offset * 80;
        }
    });

    const particles = useMemo(() => {
        const count = isMobile ? 1000 : 2000;
        const positions = new Float32Array(count * 3);
        for (let i = 0; i < count; i++) {
            positions[i * 3] = (Math.random() - 0.5) * 100;
            positions[i * 3 + 1] = (Math.random() - 0.5) * 100;
            positions[i * 3 + 2] = (Math.random() - 0.5) * 200 - 100;
        }
        return positions;
    }, [isMobile]);

    return (
        <group ref={group}>
            <Stars radius={100} depth={50} count={5000} factor={4} saturation={0} fade speed={1} />

            <Points positions={particles} stride={3} frustumCulled={false}>
                <PointMaterial
                    transparent
                    color="#456882"
                    size={0.1}
                    sizeAttenuation={true}
                    depthWrite={false}
                    blending={THREE.AdditiveBlending}
                />
            </Points>

            <Float speed={2} rotationIntensity={0.5} floatIntensity={0.5}>
                <mesh position={[isMobile ? -2 : -5, 2, -10]}>
                    <sphereGeometry args={[1, 32, 32]} />
                    <meshStandardMaterial color="#234c6a" wireframe />
                </mesh>
            </Float>
            <Float speed={1.5} rotationIntensity={1} floatIntensity={1}>
                <mesh position={[isMobile ? 2 : 5, -3, -30]}>
                    <sphereGeometry args={[1.5, 32, 32]} />
                    <meshStandardMaterial color="#456882" wireframe />
                </mesh>
            </Float>
            <Float speed={1.2} rotationIntensity={0.8} floatIntensity={0.8}>
                <mesh position={[0, -5, -60]}>
                    <octahedronGeometry args={[2]} />
                    <meshStandardMaterial color="#ff7a00" wireframe />
                </mesh>
            </Float>
            <ambientLight intensity={0.5} />
            <pointLight position={[10, 10, 10]} intensity={1} />
        </group>
    );
}

export function ScrollExperience() {
    return (
        <div
            className="fixed inset-0"
            style={{
                zIndex: -1,
                pointerEvents: 'none',
            }}
        >
            <Canvas
                eventPrefix="client"
                camera={{ position: [0, 0, 10], fov: 75 }}
                style={{ background: '#010409' }}
                gl={{ antialias: true, alpha: true }}
                onCreated={({ gl }) => {
                    gl.setClearColor(new THREE.Color('#010409'), 1);
                }}
            >
                <Scene />
            </Canvas>
        </div>
    );
}
