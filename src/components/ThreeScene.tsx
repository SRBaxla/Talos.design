import { Suspense, useEffect, useRef, useMemo, useState } from 'react';
import { Canvas, useFrame } from '@react-three/fiber';
import { Stars, useTexture } from '@react-three/drei';
import * as THREE from 'three';
import { getProject } from '@theatre/core';
import studio from '@theatre/studio';
import { SheetProvider, editable as e } from '@theatre/r3f';

// Initialize Theatre.js Studio in development
if (import.meta.env.DEV) {
    studio.initialize();
}

// Create a project and sheet for Theatre.js animations
const demoProject = getProject('TalosBackgroundProject');
const mainSheet = demoProject.sheet('MainScene');

// Adaptive constants
const isMobile = typeof window !== 'undefined' && window.innerWidth < 768;

// High-performance InstancedMesh Satellite Swarm with Data Links
const MAX_LINKS = 300; // Maximum number of connection lines to draw
const LINK_DISTANCE = 0.8; // Proximity threshold to trigger a data link beam

interface SatOrbit {
    radius: number;
    inclinationX: number;
    inclinationZ: number;
    phase: number;
    speed: number;
}

function SatelliteSwarm({ count = 200 }: { count?: number }) {
    const meshRef = useRef<THREE.InstancedMesh>(null);
    const laserRef = useRef<THREE.InstancedMesh>(null);
    const dummy = useMemo(() => new THREE.Object3D(), []);
    const laserDummy = useMemo(() => new THREE.Object3D(), []);
    
    // Pre-allocate position storage
    const positions = useMemo(() => new Array(count).fill(null).map(() => new THREE.Vector3()), [count]);
    
    // Generate procedural orbital parameters
    const satellites = useMemo(() => {
        const sats: SatOrbit[] = [];
        for (let i = 0; i < count; i++) {
            const radius = 2.15 + (Math.random() * 0.65);
            const inclinationX = (Math.random() - 0.5) * Math.PI;
            const inclinationZ = (Math.random() - 0.5) * Math.PI;
            const phase = Math.random() * Math.PI * 2;
            const speed = (0.05 + Math.random() * 0.1) * (Math.random() > 0.5 ? 1 : -1);
            sats.push({ radius, inclinationX, inclinationZ, phase, speed });
        }
        return sats;
    }, [count]);

    const _euler = useMemo(() => new THREE.Euler(), []);
    const _v1 = useMemo(() => new THREE.Vector3(), []);
    const _v2 = useMemo(() => new THREE.Vector3(), []);
    const _up = useMemo(() => new THREE.Vector3(0, 1, 0), []);

    useFrame(({ clock }) => {
        if (!meshRef.current || !laserRef.current) return;
        const time = clock.getElapsedTime();

        // 1. Update Satellites
        for (let i = 0; i < count; i++) {
            const sat = satellites[i];
            const currentAngle = sat.phase + time * sat.speed;
            _euler.set(sat.inclinationX, 0, sat.inclinationZ);
            positions[i].set(Math.cos(currentAngle) * sat.radius, 0, Math.sin(currentAngle) * sat.radius).applyEuler(_euler);

            dummy.position.copy(positions[i]);
            dummy.rotation.set(time * 0.5, time * 0.2, 0);
            dummy.updateMatrix();
            meshRef.current.setMatrixAt(i, dummy.matrix);
        }
        meshRef.current.instanceMatrix.needsUpdate = true;

        // 2. Update Laser Beams
        let linkCount = 0;
        const distSq = LINK_DISTANCE * LINK_DISTANCE;

        for (let i = 0; i < count && linkCount < MAX_LINKS; i++) {
            for (let j = i + 1; j < count && linkCount < MAX_LINKS; j++) {
                const d2 = positions[i].distanceToSquared(positions[j]);

                if (d2 < distSq) {
                    const dist = Math.sqrt(d2);
                    
                    // Position at midpoint
                    _v1.addVectors(positions[i], positions[j]).multiplyScalar(0.5);
                    laserDummy.position.copy(_v1);
                    
                    // Rotate to align with the two satellites
                    _v2.subVectors(positions[j], positions[i]).normalize();
                    laserDummy.quaternion.setFromUnitVectors(_up, _v2);
                    
                    // Scale height (Y) to match the distance
                    laserDummy.scale.set(1, dist, 1);
                    
                    laserDummy.updateMatrix();
                    laserRef.current.setMatrixAt(linkCount, laserDummy.matrix);
                    linkCount++;
                }
            }
        }
        
        // Hide unused instances
        for (let i = linkCount; i < MAX_LINKS; i++) {
            laserDummy.scale.set(0, 0, 0);
            laserDummy.updateMatrix();
            laserRef.current.setMatrixAt(i, laserDummy.matrix);
        }

        laserRef.current.instanceMatrix.needsUpdate = true;
        
        // Dynamic laser flicker
        if (laserRef.current.material instanceof THREE.MeshStandardMaterial) {
            laserRef.current.material.opacity = 0.3 + Math.sin(time * 15) * 0.1;
            laserRef.current.material.emissiveIntensity = 2 + Math.sin(time * 10) * 1.5;
        }
    });

    return (
        <group>
            {/* SATELLITES */}
            <instancedMesh ref={meshRef} args={[undefined, undefined, count]}>
                <boxGeometry args={[0.012, 0.008, 0.025]} />
                <meshStandardMaterial color="#cccccc" emissive="#333333" metalness={0.8} roughness={0.2} />
            </instancedMesh>

            {/* LASER BEAMS */}
            <instancedMesh ref={laserRef} args={[undefined, undefined, MAX_LINKS]}>
                <cylinderGeometry args={[0.003, 0.003, 1, 6]} />
                <meshStandardMaterial 
                    color="#00ccff" 
                    emissive="#00ccff"
                    emissiveIntensity={2}
                    transparent={true} 
                    opacity={0.4} 
                    blending={THREE.AdditiveBlending}
                    depthWrite={false}
                />
            </instancedMesh>
        </group>
    );
}

function LightningStorm({ visible }: { visible: boolean }) {
    const [intensity, setIntensity] = useState(0);
    const [pos, setPos] = useState(new THREE.Vector3());

    useFrame(() => {
        if (!visible) {
            if (intensity > 0) setIntensity(0);
            return;
        }

        // Randomly trigger flashes
        if (Math.random() > 0.99) {
            const angle = Math.random() * Math.PI * 2;
            const phi = Math.acos(Math.random() * 2 - 1);
            const r = 2.05;
            setPos(new THREE.Vector3(
                r * Math.sin(phi) * Math.cos(angle),
                r * Math.sin(phi) * Math.sin(angle),
                r * Math.cos(phi)
            ));
            setIntensity(5 + Math.random() * 15);
        } else {
            setIntensity(prev => prev * 0.88);
        }
    });

    if (intensity < 0.1) return null;

    return (
        <pointLight 
            position={pos} 
            intensity={intensity} 
            distance={2} 
            color="#aaccff" 
            decay={2}
        />
    );
}

function SolarSystem({ isDarkMode }: { isDarkMode: boolean }) {
    const earthGroupRef = useRef<THREE.Group>(null);
    const earthRef = useRef<THREE.Mesh>(null);
    const cloudRef = useRef<THREE.Mesh>(null);
    const cloud2Ref = useRef<THREE.Mesh>(null);
    const moonOrbitRef = useRef<THREE.Group>(null);
    const moonRef = useRef<THREE.Mesh>(null);
    const starsRef = useRef<THREE.Group>(null);
    const isInitialized = useRef<boolean>(false);
    const smoothThemeAngle = useRef(0);
    
    // Native smooth scroll tracking
    const targetScroll = useRef(0);
    const smoothScroll = useRef(0);

    useEffect(() => {
        const handleScroll = () => {
            const h = document.documentElement;
            const b = document.body;
            const st = 'scrollTop';
            const sh = 'scrollHeight';
            
            const maxScroll = Math.max(h[sh], b[sh]) - window.innerHeight;
            targetScroll.current = maxScroll > 0 ? (h[st] || b[st]) / maxScroll : 0;
        };
        window.addEventListener('scroll', handleScroll, { passive: true });
        handleScroll();
        return () => window.removeEventListener('scroll', handleScroll);
    }, []);

    // Textures/Colors
    const sunGlowColor = "#ffcc00";

    // Load Textures
    const [colorMap, specularMap, cloudMap, lightsMap, moonMap, sunMap] = useTexture([
        '/textures/earth/2k_earth_daymap.jpg',      // 2K high-res daymap
        '/textures/earth/earthspec1k.jpg',            // Specular (kept at 1K - no higher JPG available)
        '/textures/earth/8k_earth_clouds.jpg',        // 8K ultra-high-res clouds
        '/textures/earth/4k_earth_nightmap.jpg',      // NASA 4K night lights (3600x1800)
        '/textures/earth/moon_1024.jpg',
        '/textures/earth/sunmap.jpg'
    ]);

    useFrame((state) => {
        const time = state.clock.getElapsedTime();
        
        // Smooth scroll interpolation
        smoothScroll.current += (targetScroll.current - smoothScroll.current) * 0.05;
        const scrollOffset = smoothScroll.current;

        // Smooth theme transition angle
        const targetThemeAngle = isDarkMode ? Math.PI : 0;
        if (!isInitialized.current) {
            smoothThemeAngle.current = targetThemeAngle;
        } else {
            smoothThemeAngle.current += (targetThemeAngle - smoothThemeAngle.current) * 0.03;
        }

        // 1. Orbital Revolution (Sync with scroll)
        // Base orbit + scroll advancement (1 full revolution per scroll depth)
        const orbitAngle = time * 0.1 + scrollOffset * Math.PI * 2;
        const orbitRadius = isMobile ? 12 : 20;

        if (earthGroupRef.current) {
            earthGroupRef.current.position.x = Math.cos(orbitAngle) * orbitRadius;
            earthGroupRef.current.position.z = Math.sin(orbitAngle) * orbitRadius;
            // Tidally lock the group to the Sun so the camera (which is relative to Earth-Sun axis) 
            // doesn't see the Earth "spinning" due to orbital revolution.
            earthGroupRef.current.lookAt(0, 0, 0); 
        }

        // 2. Self-Rotation & Moon Orbit
        if (earthRef.current) {
            earthRef.current.rotation.y += 0.001; // Slow rotation
        }
        if (cloudRef.current) {
            cloudRef.current.rotation.y += 0.0015; // Slightly faster cloud rotation
        }
        if (cloud2Ref.current) {
            cloud2Ref.current.rotation.y += 0.0007; // Slower second layer for parallax
            cloud2Ref.current.rotation.z += 0.0002;
        }
        if (moonOrbitRef.current) {
            // Disabled automatic moon revolution as requested
            // moonOrbitRef.current.rotation.y += 0.005; 
        }
        if (moonRef.current) {
            moonRef.current.rotation.y += 0.002; // Moon rotates on its own axis
        }

        // 3. Sun Pulse/Rotation (Removed visual sun mesh)

        // 4. Camera Look (Lock based on theme)
        const lookTarget = new THREE.Vector3();
        if (earthGroupRef.current) {
            earthGroupRef.current.getWorldPosition(lookTarget);
            
            // Direction from sun(0,0,0) to earth
            const earthToSunDir = new THREE.Vector3().subVectors(new THREE.Vector3(0,0,0), lookTarget).normalize();
            
            // Camera distances (closer to make Earth appear larger)
            const camDistance = isMobile ? 5 : 6; 
            
            // Calculate smooth rotational direction for the camera
            const up = new THREE.Vector3(0, 1, 0);
            const currentEarthToCamDir = earthToSunDir.clone().applyAxisAngle(up, smoothThemeAngle.current);
            const baseCamPos = lookTarget.clone().add(currentEarthToCamDir.multiplyScalar(camDistance));

            // Shift camera and look target to the left, so Earth appears on the right
            const forward = lookTarget.clone().sub(baseCamPos).normalize();
            const right = new THREE.Vector3().crossVectors(forward, up).normalize();
            const left = right.clone().negate();

            // Adjust offset based on screen size (mobile vs desktop)
            const screenOffset = isMobile ? 1.5 : 2.5; 
            const shiftVec = left.clone().multiplyScalar(screenOffset);

            const targetCamPos = baseCamPos.clone().add(shiftVec);
            const finalLookTarget = lookTarget.clone().add(shiftVec);

            state.camera.position.copy(targetCamPos);
            state.camera.lookAt(finalLookTarget);

            if (!isInitialized.current) {
                isInitialized.current = true;
            }

            if (starsRef.current) {
                // Copy camera rotation to stars group but inverse it so stars stay locked to screen
                // We actually want the stars to move WITH the camera so they don't seem to parallax/spin as much
                // Or simply reset their rotation to 0 relative to World?
                // Actually, the simplest way to fix stars to the background is to have them NOT rotate when the camera rotates.
                // Since they are in world space and camera rotates, they appear to move.
                // We can set the stars group's rotation to exactly match the camera's rotation.
                starsRef.current.rotation.copy(state.camera.rotation);
            }
        }
    });


    return (
        <group>
            {/* SUN LIGHT (Invisible, just for illumination) */}
            <e.pointLight theatreKey="SunLight" position={[0, 0, 0]} intensity={3} distance={100} color={sunGlowColor} />

            {/* DISTANT SUN BODY */}
            <e.mesh theatreKey="SunBody" position={[0, 0, 0]}>
                <sphereGeometry args={[4, 64, 64]} />
                <meshBasicMaterial map={sunMap} color="#ffffff" />
            </e.mesh>

            {/* EARTH SYSTEM */}
            <e.group ref={earthGroupRef} theatreKey="EarthSystem">
                {/* EARTH BODY */}
                <e.mesh ref={earthRef} theatreKey="EarthBody">
                    <sphereGeometry args={[2, 64, 64]} />
                    <meshPhongMaterial 
                        map={colorMap}
                        specularMap={specularMap}
                        specular={new THREE.Color('#1a1a1a')} // Much darker, subtler specular
                        shininess={8} // Spread it out so it's not a sharp plastic dot
                        emissive={new THREE.Color('#ffffff')}
                        emissiveMap={lightsMap}
                        emissiveIntensity={isDarkMode ? 1.5 : 0.0} // Turn off city lights during day mode
                    />
                </e.mesh>

                {/* ATMOSPHERE/CLOUDS LAYER 1 */}
                <e.mesh ref={cloudRef} scale={[1.025, 1.025, 1.025]} theatreKey="AtmosphereClouds">
                    <sphereGeometry args={[2, 64, 64]} />
                    <meshPhongMaterial 
                        map={cloudMap}
                        transparent={true}
                        opacity={0.4} 
                        blending={THREE.AdditiveBlending}
                        depthWrite={false}
                        side={THREE.DoubleSide}
                    />
                </e.mesh>

                {/* ATMOSPHERE/CLOUDS LAYER 2 (Weather evolution) */}
                <e.mesh ref={cloud2Ref} scale={[1.04, 1.04, 1.04]} theatreKey="AtmosphereClouds2">
                    <sphereGeometry args={[2, 64, 64]} />
                    <meshPhongMaterial 
                        map={cloudMap}
                        transparent={true}
                        opacity={0.25} 
                        blending={THREE.AdditiveBlending}
                        depthWrite={false}
                        side={THREE.DoubleSide}
                    />
                </e.mesh>

                {/* LIGHTNING STORMS (Only on dark side) */}
                <LightningStorm visible={isDarkMode} />

                {/* ATMOSPHERE GLOW */}
                <e.mesh scale={[1.15, 1.15, 1.15]} theatreKey="AtmosphereGlow">
                    <sphereGeometry args={[2, 64, 64]} />
                    <meshBasicMaterial 
                        color="#4aa3ff" 
                        transparent={true}
                        opacity={isDarkMode ? 0.3 : 0.15} 
                        side={THREE.BackSide} 
                        blending={THREE.AdditiveBlending}
                        depthWrite={false}
                    />
                </e.mesh>

                {/* SATELLITE SWARM */}
                <SatelliteSwarm count={200} />

                {/* THE MOON */}
                <e.group ref={moonOrbitRef} theatreKey="MoonOrbit">
                    {/* Moon positioned 5 units away from Earth center */}
                    <e.mesh ref={moonRef} position={[5, 0, 0]} theatreKey="MoonBody">
                        <sphereGeometry args={[0.54, 32, 32]} /> {/* Moon is roughly 27% the size of Earth */}
                        <meshPhongMaterial map={moonMap} shininess={5} />
                    </e.mesh>
                </e.group>
            </e.group>

            {/* BACKGROUND STARS (Locked to camera rotation) */}
            <group ref={starsRef}>
                <Stars radius={100} depth={50} count={5000} factor={4} saturation={0} fade speed={0} />
            </group>
        </group>
    );
}

export default function ThreeScene({ isDarkMode = true }: { isDarkMode?: boolean }) {
    return (
        <div 
            className="fixed inset-0 pointer-events-none transition-colors duration-1000"
            style={{ zIndex: 0, backgroundColor: 'transparent' }} // Let main body color show through if needed, or force it here.
        >
            <Canvas
                camera={{ position: [0, 0, 40], fov: 45 }}
                gl={{ antialias: true, alpha: true, powerPreference: "high-performance" }}
                style={{ background: '#010409' }} // Locked to deep space
            >
                <ambientLight intensity={isDarkMode ? 0.1 : 0.8} />
                {/* Hemisphere light adds a gentle blueish fill to the dark side of objects, simulating scattered starlight/earthlight */}
                <hemisphereLight args={['#ffffff', '#001133', isDarkMode ? 0.4 : 0.6]} />
                
                <Suspense fallback={null}>
                    <SheetProvider sheet={mainSheet}>
                        <SolarSystem isDarkMode={isDarkMode} />
                    </SheetProvider>
                </Suspense>
            </Canvas>

            {/* Overlays for cinematic depth */}
            <div className={`fixed inset-0 pointer-events-none transition-opacity duration-1000 ${isDarkMode ? 'opacity-100' : 'opacity-10'} z-10`}>
                <div className="absolute inset-0 bg-[radial-gradient(circle_at_50%_50%,rgba(0,170,255,0.05)_0%,transparent_90%)]" />
                <div className="absolute inset-0 bg-gradient-to-b from-[#010409] via-transparent to-[#010409] opacity-90" />
            </div>
        </div>
    );
}

