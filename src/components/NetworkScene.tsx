import React, { useRef, useMemo } from 'react';
import { Canvas, useFrame, useThree } from '@react-three/fiber';
import * as THREE from 'three';

const vertexShader = `
    varying vec2 vUv;
    void main() {
        vUv = uv;
        gl_Position = vec4(position, 1.0);
    }
`;

// 1. REPLACE THE FRAGMENT SHADER HERE
const fragmentShader = `
    uniform float uTime;
    uniform vec2 uResolution;
    uniform vec2 uMouse;

    varying vec2 vUv;

    #define NODE_COUNT 35

    vec3 hash3(float n) {
        return fract(sin(vec3(n, n+1.0, n+2.0)) * vec3(43758.5453, 22578.1459, 19642.3490));
    }

    float lineDist(vec2 p, vec2 a, vec2 b) {
        vec2 pa = p - a;
        vec2 ba = b - a;
        float h = clamp(dot(pa, ba) / dot(ba, ba), 0.0, 1.0);
        return length(pa - ba * h);
    }

    void main() {
        vec2 uv = vUv;
        vec2 p = (uv - 0.5) * 2.0;
        p.x *= uResolution.x / uResolution.y;

        float t = uTime * 0.2;

        vec3 col = mix(vec3(0.01, 0.05, 0.1), vec3(0.005, 0.01, 0.02), length(p));

        vec2 nodes[NODE_COUNT];
        float depths[NODE_COUNT];

        for(int i = 0; i < NODE_COUNT; i++) {
            float fi = float(i);
            vec3 rnd = hash3(fi);

            float angle = rnd.x * 6.2831 + t * (0.5 + rnd.y);
            float radius = 0.2 + rnd.y * 0.6;
            
            vec2 pos = vec2(
                cos(angle + rnd.z * t), 
                sin(angle - rnd.x * t)
            ) * radius;

            float z = 0.3 + rnd.z * 0.7; 
            depths[i] = z;

            // uMouse is -1 to 1 from R3F, so this parallax works perfectly
            pos += uMouse * 0.3 * z; 

            nodes[i] = pos;

            float d = length(p - pos);

            float core = smoothstep(0.015 * z, 0.0, d);
            float glow = 0.003 / max(d, 0.001) * z; 
            
            vec3 nodeColor = vec3(0.2, 0.9, 0.85);
            col += nodeColor * core;
            col += nodeColor * glow * 0.3; 
        }

        for(int i = 0; i < NODE_COUNT; i++) {
            for(int j = i + 1; j < NODE_COUNT; j++) {
                vec2 a = nodes[i];
                vec2 b = nodes[j];
                
                float dist = length(a - b);
                float maxDist = 0.45;

                if(dist < maxDist) {
                    float d = lineDist(p, a, b);
                    float fade = smoothstep(maxDist, 0.1, dist);
                    float zAvg = (depths[i] + depths[j]) * 0.5;

                    float lineCore = smoothstep(0.005, 0.0, d);
                    float lineGlow = 0.001 / max(d, 0.001);

                    vec3 lineColor = vec3(0.1, 0.7, 0.8);
                    
                    col += lineColor * lineCore * fade * zAvg * 0.5;
                    col += lineColor * lineGlow * fade * zAvg * 0.2;
                }
            }
        }

        float vignette = smoothstep(1.8, 0.2, length(p));
        col *= vignette;

        float noise = fract(sin(dot(uv, vec2(12.9898, 78.233))) * 43758.5453);
        col += (noise - 0.5) * 0.03;

        gl_FragColor = vec4(col, 1.0);
    }
`;

// 2. THE REACT COMPONENT STAYS EXACTLY THE SAME
function NeuralNetworkBackground() {
    const materialRef = useRef<THREE.ShaderMaterial>(null);
    const { size, pointer } = useThree();

    useFrame((state, delta) => {
        if (materialRef.current) {
            // Keep the safe delta to prevent stuttering on page changes!
            const safeDelta = Math.min(delta, 0.1);
            materialRef.current.uniforms.uTime.value += safeDelta;

            materialRef.current.uniforms.uResolution.value.set(size.width, size.height);

            const uniforms = materialRef.current.uniforms;
            // R3F's state.pointer is already normalized from -1.0 to 1.0
            uniforms.uMouse.value.x = THREE.MathUtils.lerp(uniforms.uMouse.value.x, pointer.x, 0.05);
            uniforms.uMouse.value.y = THREE.MathUtils.lerp(uniforms.uMouse.value.y, pointer.y, 0.05);
        }
    });

    const uniforms = useMemo(() => ({
        uTime: { value: 0 },
        uResolution: { value: new THREE.Vector2(size.width, size.height) },
        uMouse: { value: new THREE.Vector2(0, 0) },
    }), [size]);

    return (
        <mesh>
            <planeGeometry args={[2, 2]} />
            <shaderMaterial
                ref={materialRef}
                vertexShader={vertexShader}
                fragmentShader={fragmentShader}
                uniforms={uniforms}
                depthWrite={false}
                depthTest={false}
            />
        </mesh>
    );
}

// 3. YOUR MEMOIZED SCENE WRAPPER
const NetworkScene = React.memo(() => {
    return (
        <div className="fixed inset-0 z-0 pointer-events-none bg-[#010409]">
            <Canvas
                orthographic
                camera={{ position: [0, 0, 1], zoom: 1 }}
                gl={{ antialias: false, powerPreference: "high-performance" }}
                dpr={[1, 1.5]}
                frameloop="always"
            >
                <NeuralNetworkBackground />
            </Canvas>

            <div className="absolute inset-0 bg-gradient-to-b from-[#010409] via-transparent to-[#010409] opacity-80" />
            <div className="absolute inset-0 shadow-[inset_0_0_200px_rgba(0,0,0,0.95)] pointer-events-none" />
        </div>
    );
});

export default NetworkScene;