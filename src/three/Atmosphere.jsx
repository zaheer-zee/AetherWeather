import { useRef, useMemo } from 'react';
import { useFrame } from '@react-three/fiber';
import { FogExp2, Color } from 'three';
import { useAQI } from '../context/AQIContext';

// AQI scale is now 1-6 (WeatherAPI us-epa-index)
export default function Atmosphere() {
    const { aqi } = useAQI();
    const ambientRef = useRef();
    const dirRef = useRef();

    const config = useMemo(() => {
        const level = aqi || 1;
        const configs = {
            1: { fogColor: '#0a1a3e', fogDensity: 0.006, ambientIntensity: 0.65, dirIntensity: 2.2, dirColor: '#a8d4ff' },
            2: { fogColor: '#1a1a2e', fogDensity: 0.018, ambientIntensity: 0.50, dirIntensity: 1.5, dirColor: '#ffe8a0' },
            3: { fogColor: '#2a1a0a', fogDensity: 0.035, ambientIntensity: 0.35, dirIntensity: 1.0, dirColor: '#ffaa44' },
            4: { fogColor: '#2a0808', fogDensity: 0.055, ambientIntensity: 0.25, dirIntensity: 0.7, dirColor: '#ff5522' },
            5: { fogColor: '#1a0820', fogDensity: 0.080, ambientIntensity: 0.15, dirIntensity: 0.4, dirColor: '#aa4488' },
            6: { fogColor: '#12000a', fogDensity: 0.120, ambientIntensity: 0.08, dirIntensity: 0.2, dirColor: '#660022' },
        };
        return configs[level] || configs[1];
    }, [aqi]);

    useFrame(({ scene }) => {
        if (!scene.fog) {
            scene.fog = new FogExp2(new Color(config.fogColor), 0);
        }
        scene.fog.color.lerp(new Color(config.fogColor), 0.02);
        scene.fog.density += (config.fogDensity - scene.fog.density) * 0.02;
        if (ambientRef.current) ambientRef.current.intensity += (config.ambientIntensity - ambientRef.current.intensity) * 0.05;
        if (dirRef.current) dirRef.current.intensity += (config.dirIntensity - dirRef.current.intensity) * 0.05;
    });

    return (
        <>
            <ambientLight ref={ambientRef} intensity={config.ambientIntensity} />
            <directionalLight
                ref={dirRef}
                position={[10, 10, 5]}
                intensity={config.dirIntensity}
                color={config.dirColor}
                castShadow
            />
            <pointLight position={[-10, -5, -5]} intensity={0.3} color="#4488ff" />
            <pointLight position={[5, -8, 3]} intensity={0.2} color="#ff8844" />
        </>
    );
}
