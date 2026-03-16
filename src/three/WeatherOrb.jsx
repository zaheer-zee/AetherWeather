import { useRef, useMemo } from 'react';
import { useFrame } from '@react-three/fiber';
import { Sphere, MeshDistortMaterial, Float } from '@react-three/drei';
import * as THREE from 'three';
import { useAQI } from '../context/AQIContext';

// AQI 1-6 orb colors
export default function WeatherOrb() {
    const meshRef = useRef();
    const { aqi } = useAQI();

    const orbConfig = useMemo(() => {
        const level = aqi || 1;
        const baseColors = {
            1: { color: '#33aaff', emissive: '#004488', speed: 0.5 },
            2: { color: '#aaaa33', emissive: '#444400', speed: 0.6 },
            3: { color: '#ff8833', emissive: '#662200', speed: 0.8 },
            4: { color: '#ff3333', emissive: '#440000', speed: 1.0 },
            5: { color: '#aa44bb', emissive: '#330044', speed: 1.4 },
            6: { color: '#660011', emissive: '#220000', speed: 1.8 },
        };
        return baseColors[level] || baseColors[1];
    }, [aqi]);

    const distort = useMemo(() => {
        const level = aqi || 1;
        return 0.12 + level * 0.07; // More distortion for worse AQI
    }, [aqi]);

    useFrame((state) => {
        if (!meshRef.current) return;
        meshRef.current.rotation.y += 0.004;
        meshRef.current.rotation.x = Math.sin(state.clock.elapsedTime * 0.3) * 0.1;
        const pulse = 1 + Math.sin(state.clock.elapsedTime * 1.2) * 0.03;
        meshRef.current.scale.setScalar(pulse);
    });

    return (
        <Float speed={1.5} rotationIntensity={0.2} floatIntensity={0.5}>
            <Sphere ref={meshRef} args={[1.8, 64, 64]} position={[0, 0, 0]}>
                <MeshDistortMaterial
                    color={orbConfig.color}
                    emissive={orbConfig.emissive}
                    emissiveIntensity={0.6}
                    distort={distort}
                    speed={orbConfig.speed}
                    roughness={0.1}
                    metalness={0.3}
                    transparent
                    opacity={0.9}
                />
            </Sphere>
            {/* Inner glow */}
            <Sphere args={[1.2, 32, 32]} position={[0, 0, 0]}>
                <meshBasicMaterial color={orbConfig.color} transparent opacity={0.12} side={THREE.BackSide} />
            </Sphere>
            {/* Outer glow */}
            <Sphere args={[2.3, 32, 32]} position={[0, 0, 0]}>
                <meshBasicMaterial color={orbConfig.color} transparent opacity={0.04} side={THREE.BackSide} />
            </Sphere>
        </Float>
    );
}
