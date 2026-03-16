import { useMemo } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { AQIProvider, useAQI, AQI_LEVELS } from './context/AQIContext';
import Scene from './three/Scene';
import MainDashboard from './pages/MainDashboard';
import './index.css';

// Dynamic background gradient based on AQI
function DynamicBackground() {
  const { aqi } = useAQI();

  const gradient = useMemo(() => {
    if (!aqi) return 'radial-gradient(ellipse at 50% 30%, #0d1b3e 0%, #050510 60%, #000000 100%)';
    const gradients = {
      1: 'radial-gradient(ellipse at 30% 20%, #0a2a4a 0%, #052a1a 40%, #030f1e 80%, #000000 100%)',
      2: 'radial-gradient(ellipse at 40% 20%, #1a1a0a 0%, #0a1520 50%, #030308 100%)',
      3: 'radial-gradient(ellipse at 50% 10%, #2a1200 0%, #1a0a12 40%, #0a0510 80%, #000000 100%)',
      4: 'radial-gradient(ellipse at 60% 15%, #2a0500 0%, #150010 40%, #080010 80%, #000000 100%)',
      5: 'radial-gradient(ellipse at 50% 20%, #1a0028 0%, #0d001a 50%, #050008 100%)',
    };
    return gradients[aqi] || gradients[1];
  }, [aqi]);

  return (
    <motion.div
      className="fixed inset-0 z-0"
      animate={{ background: gradient }}
      transition={{ duration: 2, ease: 'easeInOut' }}
    />
  );
}

function AppInner() {
  return (
    <div className="relative w-full h-screen overflow-hidden">
      {/* Dynamic gradient background */}
      <DynamicBackground />

      {/* 3D Scene behind everything */}
      <Scene />

      {/* UI overlay */}
      <div className="relative z-10 h-full overflow-y-auto">
        <MainDashboard />
      </div>
    </div>
  );
}

export default function App() {
  return (
    <AQIProvider>
      <AppInner />
    </AQIProvider>
  );
}
