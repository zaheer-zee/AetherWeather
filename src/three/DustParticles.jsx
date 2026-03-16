import { useRef, useMemo } from 'react';
import { useFrame } from '@react-three/fiber';
import * as THREE from 'three';
import { useAQI } from '../context/AQIContext';

function Particle({ position, color, size }) {
    const ref = useRef();
    const speed = useMemo(() => ({
        x: (Math.random() - 0.5) * 0.005,
        y: (Math.random() - 0.5) * 0.003,
        z: (Math.random() - 0.5) * 0.005,
        offset: Math.random() * Math.PI * 2,
    }), []);

    useFrame((state) => {
        if (!ref.current) return;
        ref.current.position.x += Math.sin(state.clock.elapsedTime * 0.5 + speed.offset) * speed.x;
        ref.current.position.y += Math.cos(state.clock.elapsedTime * 0.3 + speed.offset) * speed.y;
        ref.current.position.z += Math.sin(state.clock.elapsedTime * 0.4 + speed.offset) * speed.z;
        if (Math.abs(ref.current.position.x) > 8) ref.current.position.x *= -0.9;
        if (Math.abs(ref.current.position.y) > 8) ref.current.position.y *= -0.9;
        if (Math.abs(ref.current.position.z) > 8) ref.current.position.z *= -0.9;
    });

    return (
        <mesh ref={ref} position={position}>
            <sphereGeometry args={[size, 4, 4]} />
            <meshBasicMaterial color={color} transparent opacity={0.4} />
        </mesh>
    );
}

export default function DustParticles() {
    const { aqi } = useAQI();
    const level = aqi || 1;

    // Scale 1-6: more particles + denser for hazardous
    const { count, color, size } = useMemo(() => {
        const configs = {
            1: { count: 0, color: '#aaddff', size: 0.03 },
            2: { count: 20, color: '#dddd88', size: 0.04 },
            3: { count: 50, color: '#ffaa44', size: 0.05 },
            4: { count: 90, color: '#ff6622', size: 0.06 },
            5: { count: 150, color: '#aa44bb', size: 0.08 },
            6: { count: 220, color: '#880022', size: 0.10 },
        };
        return configs[level] || configs[1];
    }, [level]);

    const particles = useMemo(() =>
        Array.from({ length: count }, (_, i) => ({
            id: i,
            position: [
                (Math.random() - 0.5) * 14,
                (Math.random() - 0.5) * 14,
                (Math.random() - 0.5) * 10,
            ],
        })),
        [count]
    );

    if (count === 0) return null;

    return (
        <group>
            {particles.map((p) => (
                <Particle key={p.id} position={p.position} color={color} size={size} />
            ))}
        </group>
    );
}
