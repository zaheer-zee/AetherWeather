import { Suspense } from 'react';
import { Canvas } from '@react-three/fiber';
import { OrbitControls, Stars } from '@react-three/drei';
import Atmosphere from './Atmosphere';
import WeatherOrb from './WeatherOrb';
import DustParticles from './DustParticles';
import { useAQI } from '../context/AQIContext';

export default function Scene() {
    const { aqi } = useAQI();
    const starsCount = aqi ? Math.max(0, 3000 - aqi * 600) : 3000;

    return (
        <div className="canvas-container">
            <Canvas
                camera={{ position: [0, 0, 6], fov: 60 }}
                gl={{ antialias: true, alpha: true }}
                shadows
            >
                <Suspense fallback={null}>
                    <Atmosphere />

                    {/* Starfield fades with worsening AQI */}
                    <Stars
                        radius={80}
                        depth={50}
                        count={starsCount}
                        factor={4}
                        saturation={0}
                        fade
                    />

                    <WeatherOrb />
                    <DustParticles />

                    <OrbitControls
                        enableZoom={false}
                        enablePan={false}
                        rotateSpeed={0.4}
                        autoRotate={false}
                        maxPolarAngle={Math.PI * 0.75}
                        minPolarAngle={Math.PI * 0.25}
                    />
                </Suspense>
            </Canvas>
        </div>
    );
}
