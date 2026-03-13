import { Suspense, useEffect, useRef, useMemo, useState } from 'react';
import { Canvas, useFrame } from '@react-three/fiber';
import { Stars, useTexture } from '@react-three/drei';
import * as THREE from 'three';
import { getProject } from '@theatre/core';
import { SheetProvider, editable as e } from '@theatre/r3f';

// Theatre.js Studio initialization removed for clean production rendering
// If studio mode is needed, import and initialize it exclusively.

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
    const targetThemeAngle = useRef(0);
    const prevIsDarkMode = useRef(isDarkMode);
    
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

        // Base zero puts angle behind Sun looking at Earth (Day side)
        // Math.PI puts angle behind Earth looking at Sun (Night side)
        // We accumulate the angle so it rotates continuously (-Math.PI makes it go in the direction user asked)
        if (!isInitialized.current) {
            smoothThemeAngle.current = isDarkMode ? Math.PI : 0;
            targetThemeAngle.current = smoothThemeAngle.current;
            prevIsDarkMode.current = isDarkMode;
            isInitialized.current = true;
        } else if (isDarkMode !== prevIsDarkMode.current) {
            targetThemeAngle.current -= Math.PI; // Orbit in the opposite direction
            prevIsDarkMode.current = isDarkMode;
        }

        smoothThemeAngle.current += (targetThemeAngle.current - smoothThemeAngle.current) * 0.03;

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
            
            // Camera distances: closer to skim the horizon for both modes
            // Zoom out slightly as requested
            const camDistance = isMobile ? 3.5 : 3.2;
            
            // Calculate smooth rotational direction for the camera
            const up = new THREE.Vector3(0, 1, 0);
            const currentEarthToCamDir = earthToSunDir.clone().applyAxisAngle(up, smoothThemeAngle.current);
            const baseCamPos = lookTarget.clone().add(currentEarthToCamDir.multiplyScalar(camDistance));

            const forward = lookTarget.clone().sub(baseCamPos).normalize();
            const right = new THREE.Vector3().crossVectors(forward, up).normalize();

            // Desktop: Earth on RIGHT edge, so Camera moves Left (negative rightShift).
            // Mobile: Earth on bottom edge, so Camera moves Up.
            // Adjusted exactly to match the 1.29 delta tested in Theatre.js
            const rightShiftAmt = isMobile ? 0 : -1.2; 
            const verticalShiftAmt = isMobile ? 1.5 : 0.0;
            
            const rightShift = right.clone().multiplyScalar(rightShiftAmt);
            const upShift = up.clone().multiplyScalar(verticalShiftAmt);

            const shiftVec = rightShift.add(upShift);

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
            {/* SUN LIGHT (Directional/Point light source) */}
            <e.pointLight 
                theatreKey="SunLight" 
                position={[0, 0, 0]} 
                // Simple pulse based on state.time or oscillate
                intensity={isDarkMode ? 3 : (12 + Math.sin(Date.now() / 2000) * 3)} 
                distance={100} 
                color={isDarkMode ? sunGlowColor : "#ffffff"} 
                decay={2}
            />

            {/* DISTANT SUN BODY (Artificial position for Light Mode background) */}
            {/* Moved to earthGroup so we can perfectly place it relative to camera */}
            
            {/* EARTH SYSTEM */}
            <e.group ref={earthGroupRef} theatreKey="EarthSystem">
                
                {/* Visual Sun for Light Mode background (Left side: +X, Background: +Z) */}
                <e.mesh theatreKey="SunBody" position={[16, 0, 35]} visible={!isDarkMode}>
                    <sphereGeometry args={[6, 64, 64]} />
                    <meshBasicMaterial 
                        map={sunMap} 
                        color="#ffeeba" 
                    />
                </e.mesh>
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
                        color={isDarkMode ? "#4aa3ff" : "#88ccff"} 
                        transparent={true}
                        opacity={isDarkMode ? 0.3 : 0.6} 
                        side={THREE.BackSide} 
                        blending={THREE.AdditiveBlending}
                        depthWrite={false}
                    />
                </e.mesh>

                {/* SATELLITE SWARM */}
                <SatelliteSwarm count={200} />

                {/* THE MOON */}
                <e.group ref={moonOrbitRef} theatreKey="MoonOrbit">
                    {/* Visual Moon for Dark Mode background (Left side: +X, Background: -Z) */}
                    <e.mesh ref={moonRef} position={[7, 0, -12]} theatreKey="MoonBody" visible={isDarkMode}>
                        <sphereGeometry args={[0.8, 32, 32]} />
                        <meshPhongMaterial map={moonMap} shininess={5} />
                    </e.mesh>
                </e.group>
            </e.group>

            {/* BACKGROUND STARS (Locked to camera rotation) */}
            <group ref={starsRef}>
                <Stars 
                    radius={100} 
                    depth={50} 
                    count={5000} 
                    factor={4} 
                    saturation={0} 
                    fade 
                    speed={0} 
                />
                {/* Overlay to fade out stars in light mode */}
                {!isDarkMode && (
                    <mesh>
                        <sphereGeometry args={[90, 32, 32]} />
                        <meshBasicMaterial color="#f0f8ff" side={THREE.BackSide} transparent opacity={0.8} />
                    </mesh>
                )}
            </group>
        </group>
    );
}

export default function ThreeScene({ isDarkMode = true }: { isDarkMode?: boolean }) {
    const [canvasHeight, setCanvasHeight] = useState('100dvh');

    useEffect(() => {
        // Lock the underlying 3D Canvas height to a static, oversized pixel value so
        // mobile navbar drag-collapses never trigger a WebGL resize or slice the rendering.
        if (typeof window !== 'undefined') {
            // Use visualViewport.height when available (most accurate on mobile),
            // falling back to screen.height. Adding 150px buffer covers address-bar resize.
            const baseHeight = window.visualViewport?.height ?? window.screen.height;
            const fixedHeight = Math.max(baseHeight, window.innerHeight) + 150;
            setCanvasHeight(`${fixedHeight}px`);
        }
    }, []);

    return (
        <div 
            className="fixed top-0 left-0 w-full pointer-events-none md:transition-colors md:duration-1000 will-change-transform"
            style={{ height: canvasHeight, zIndex: 0, backgroundColor: 'var(--bg-base)' }}
        >
            <Canvas
                camera={{ position: [0, 0, 40], fov: 45 }}
                gl={{ antialias: true, alpha: true, powerPreference: "high-performance" }}
                style={{ 
                    background: isDarkMode ? '#010409' : 'radial-gradient(ellipse at 50% 0%, #ffffff 0%, #fffcea 40%, #ffe9b3 100%)',
                    transition: 'background 1s ease-in-out'
                }}
            >
                {/* High ambient light in light mode to simulate scattered daylight filling shadows */}
                <ambientLight intensity={isDarkMode ? 0.1 : 2.5} color={isDarkMode ? "#ffffff" : "#fffcea"} />
                
                {/* Hemisphere light adds a gentle blueish fill to the dark side of objects, simulating scattered starlight/earthlight */}
                <hemisphereLight args={
                    isDarkMode 
                        ? ['#ffffff', '#001133', 0.4] 
                        : ['#ffffff', '#ffeedd', 1.5]
                } />
                
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

            {/* Sun Glare Overlay for Light Mode */}
            <div className={`fixed inset-0 pointer-events-none transition-opacity duration-1000 ${isDarkMode ? 'opacity-0' : 'opacity-100'} z-10 mix-blend-screen`}>
                <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_0%_30%,rgba(255,220,150,0.6)_0%,transparent_70%)]" />
            </div>
        </div>
    );
}

