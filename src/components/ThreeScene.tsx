import { useRef, useMemo } from 'react';
import { Canvas, useFrame, useThree } from '@react-three/fiber';
import * as THREE from 'three';

// Adaptive constants for high-fidelity
const isMobile = typeof window !== 'undefined' && window.innerWidth < 768;
const BUNDLE_COUNT = isMobile ? 8 : 12;
const CABLES_PER_BUNDLE = isMobile ? 4 : 6;
const POINTS_PER_CABLE = 150;

const vertexShader = `
    varying float vProgress;
    varying float vAlpha;
    varying vec3 vViewPosition;
    
    attribute float aProgress;
    attribute float aOffset;
    attribute vec3 aLocalOffset;
    attribute float aTwistSpeed;
    
    uniform float uTime;
    
    vec3 rotateVector(vec3 v, vec3 axis, float angle) {
        float s = sin(angle);
        float c = cos(angle);
        float oc = 1.0 - c;
        mat3 m = mat3(
            oc * axis.x * axis.x + c,           oc * axis.x * axis.y - axis.z * s,  oc * axis.z * axis.x + axis.y * s,
            oc * axis.x * axis.y + axis.z * s,  oc * axis.y * axis.y + c,           oc * axis.y * axis.z - axis.x * s,
            oc * axis.z * axis.x - axis.y * s,  oc * axis.y * axis.z + axis.x * s,  oc * axis.z * axis.z + c
        );
        return m * v;
    }

    void main() {
        vProgress = mod(aProgress - uTime * 0.15 + aOffset, 1.0);
        
        // 1. DYNAMIC SPINE DEFORMATION
        // The "spine" itself now snakes and sways in 3D
        vec3 pos = position;
        float spineSwayTime = uTime * 0.4 + aOffset * 5.0;
        pos.y += sin(spineSwayTime + aProgress * 3.0) * 1.5 * sin(aProgress * 3.14);
        pos.z += cos(spineSwayTime * 0.7 + aProgress * 2.5) * 1.2 * sin(aProgress * 3.14);
        
        // 2. BREATHING HELIX RADIUS
        // Contract and expand the bundle's thickness
        float breathing = 1.0 + sin(uTime * 1.2 + aOffset * 6.28) * 0.4;
        vec3 radialOffset = aLocalOffset * breathing;
        
        // 3. DYNAMIC TWIST PITCH
        // Tighten and loosen the helical wrap
        float twistAngle = uTime * (1.2 + aTwistSpeed) + aProgress * (12.0 + sin(uTime * 0.5) * 6.0) + aOffset * 6.28;
        
        // Use a local "tangent" (simplified as X-axis for horizontal flow) to rotate
        vec3 finalOffset = rotateVector(radialOffset, vec3(1.0, 0.0, 0.0), twistAngle);
        pos += finalOffset;

        // 4. EMISSIVE TRAVELERS
        float pulseWidth = 0.3;
        vAlpha = smoothstep(1.0 - pulseWidth, 1.0, 1.0 - abs(vProgress - 0.5) * 2.0);
        vAlpha = pow(vAlpha, 2.5);
        vAlpha += 0.06;

        vec4 mvPosition = modelViewMatrix * vec4(pos, 1.0);
        vViewPosition = -mvPosition.xyz;
        gl_Position = projectionMatrix * mvPosition;
    }
`;

const fragmentShader = `
    varying float vProgress;
    varying float vAlpha;
    uniform vec3 uColor;
    
    void main() {
        vec3 finalColor = uColor;
        if (vAlpha > 0.7) {
            finalColor = mix(uColor, vec3(1.0), (vAlpha - 0.7) * 4.0);
        }
        gl_FragColor = vec4(finalColor, vAlpha * 0.8);
    }
`;

function FiberNetwork() {
    const { mouse, viewport } = useThree();
    const groupRef = useRef<THREE.Group>(null);
    const coreRef = useRef<THREE.Mesh>(null);
    const materialRef = useRef<THREE.ShaderMaterial>(null);

    const targetRotation = useRef(new THREE.Vector2(0, 0));
    const currentRotation = useRef(new THREE.Vector2(0, 0));

    const combinedGeometry = useMemo(() => {
        const vertices = [];
        const progressArr = [];
        const offsetsArr = [];
        const localOffsetsArr = [];
        const twistSpeedsArr = [];

        for (let b = 0; b < BUNDLE_COUNT; b++) {
            const basePoints = [];
            // Generate higher control-point count for more expressive deformation
            for (let s = 0; s < 7; s++) {
                basePoints.push(new THREE.Vector3(
                    (s / 6 - 0.5) * 55,
                    (Math.random() - 0.5) * 24,
                    (Math.random() - 0.5) * 16
                ));
            }

            const baseCurve = new THREE.CatmullRomCurve3(basePoints);
            const spinePoints = baseCurve.getPoints(POINTS_PER_CABLE);
            const bundleOffset = Math.random() * 50.0;

            for (let c = 0; c < CABLES_PER_BUNDLE; c++) {
                const radius = 0.8 + Math.random() * 1.2;
                const initialAngle = (c / CABLES_PER_BUNDLE) * Math.PI * 2;
                const localOffset = new THREE.Vector3(
                    0,
                    Math.cos(initialAngle) * radius,
                    Math.sin(initialAngle) * radius
                );

                const twistSpeed = Math.random() * 0.8;

                for (let i = 0; i < spinePoints.length - 1; i++) {
                    const p1 = spinePoints[i];
                    const p2 = spinePoints[i + 1];
                    const prog1 = i / POINTS_PER_CABLE;
                    const prog2 = (i + 1) / POINTS_PER_CABLE;

                    vertices.push(p1.x, p1.y, p1.z, p2.x, p2.y, p2.z);
                    progressArr.push(prog1, prog2);
                    offsetsArr.push(bundleOffset, bundleOffset);
                    localOffsetsArr.push(localOffset.x, localOffset.y, localOffset.z, localOffset.x, localOffset.y, localOffset.z);
                    twistSpeedsArr.push(twistSpeed, twistSpeed);
                }
            }
        }

        const geo = new THREE.BufferGeometry();
        geo.setAttribute('position', new THREE.Float32BufferAttribute(vertices, 3));
        geo.setAttribute('aProgress', new THREE.Float32BufferAttribute(progressArr, 1));
        geo.setAttribute('aOffset', new THREE.Float32BufferAttribute(offsetsArr, 1));
        geo.setAttribute('aLocalOffset', new THREE.Float32BufferAttribute(localOffsetsArr, 3));
        geo.setAttribute('aTwistSpeed', new THREE.Float32BufferAttribute(twistSpeedsArr, 1));
        return geo;
    }, []);

    useFrame((state, delta) => {
        const time = state.clock.getElapsedTime();
        if (materialRef.current) materialRef.current.uniforms.uTime.value = time;

        if (groupRef.current) {
            // Stronger scene-wide breathing
            groupRef.current.position.z = Math.sin(time * 0.3) * 1.0;

            targetRotation.current.set(mouse.x * 0.12, -mouse.y * 0.06);
            currentRotation.current.x = THREE.MathUtils.lerp(currentRotation.current.x, targetRotation.current.x, delta * 1.5);
            currentRotation.current.y = THREE.MathUtils.lerp(currentRotation.current.y, targetRotation.current.y, delta * 1.5);

            groupRef.current.rotation.y = currentRotation.current.x;
            groupRef.current.rotation.x = currentRotation.current.y;
            groupRef.current.position.y = isMobile ? -3.0 : -1.5;
        }

        if (coreRef.current) {
            coreRef.current.scale.setScalar(1 + Math.sin(time * 2.0) * 0.1);
            coreRef.current.rotation.y += delta * 0.3;
        }
    });

    return (
        <group ref={groupRef}>
            <lineSegments geometry={combinedGeometry}>
                <shaderMaterial
                    ref={materialRef}
                    vertexShader={vertexShader}
                    fragmentShader={fragmentShader}
                    transparent
                    blending={THREE.AdditiveBlending}
                    uniforms={{
                        uTime: { value: 0 },
                        uColor: { value: new THREE.Color("#00e5ff") }
                    }}
                />
            </lineSegments>

            <mesh ref={coreRef} position={[0, 0, -25]}>
                <sphereGeometry args={[25, 32, 32]} />
                <meshBasicMaterial color="#00e5ff" transparent opacity={0.015} blending={THREE.AdditiveBlending} />
            </mesh>

            <pointLight
                position={[(mouse.x * viewport.width) / 2, (mouse.y * viewport.height) / 2, 10]}
                intensity={isMobile ? 1.5 : 2.5}
                distance={40}
                color="#00e5ff"
            />
        </group>
    );
}

export default function ThreeScene() {
    return (
        <div className="absolute inset-0 z-0 pointer-events-none bg-[#010409]">
            <Canvas
                camera={{ position: [0, 0, isMobile ? 48 : 38], fov: 45 }}
                gl={{ antialias: true, alpha: true, powerPreference: "high-performance" }}
            >
                <color attach="background" args={['#010409']} />
                <FiberNetwork />
                <fog attach="fog" args={['#010409', 20, 120]} />
            </Canvas>

            <div className="absolute inset-0 bg-[radial-gradient(circle_at_50%_50%,rgba(0,229,255,0.1)_0%,transparent_90%)]" />
            <div className="absolute inset-0 bg-gradient-to-b from-[#010409] via-transparent to-[#010409] opacity-90" />
            <div className="absolute inset-0 shadow-[inset_0_0_300px_rgba(0,0,0,0.95)] pointer-events-none" />
        </div>
    );
}
