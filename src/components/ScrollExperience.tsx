import { useRef, useEffect } from 'react';
import { Canvas, useFrame } from '@react-three/fiber';
import { Float, Stars } from '@react-three/drei';
import * as THREE from 'three';

function Scene() {
    const group = useRef<THREE.Group>(null);
    const scrollTarget = useRef(0);
    const scrollCurrent = useRef(0);

    useEffect(() => {
        const handleScroll = () => {
            const maxScroll = document.documentElement.scrollHeight - window.innerHeight;
            scrollTarget.current = maxScroll > 0 ? window.scrollY / maxScroll : 0;
        };
        window.addEventListener('scroll', handleScroll);
        handleScroll(); // Initial call
        return () => window.removeEventListener('scroll', handleScroll);
    }, []);

    useFrame(() => {
        if (group.current) {
            // Smooth damping using lerp
            // We use a constant for damping speed, or adjust based on delta
            const damping = 0.05;
            scrollCurrent.current = THREE.MathUtils.lerp(
                scrollCurrent.current,
                scrollTarget.current,
                damping
            );

            const offset = scrollCurrent.current;

            // Gentle rotation based on smoothed scroll
            group.current.rotation.y = offset * 0.5;
            group.current.rotation.x = offset * 0.2;

            // Moving into the screen effect
            group.current.position.z = offset * 50;
        }
    });

    return (
        <group ref={group}>
            <Stars radius={100} depth={50} count={5000} factor={4} saturation={0} fade speed={1} />
            <Float speed={2} rotationIntensity={0.5} floatIntensity={0.5}>
                <mesh position={[-5, 2, -10]}>
                    <sphereGeometry args={[1, 32, 32]} />
                    <meshStandardMaterial color="#234c6a" wireframe />
                </mesh>
            </Float>
            <Float speed={1.5} rotationIntensity={1} floatIntensity={1}>
                <mesh position={[5, -3, -15]}>
                    <sphereGeometry args={[1.5, 32, 32]} />
                    <meshStandardMaterial color="#456882" wireframe />
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
