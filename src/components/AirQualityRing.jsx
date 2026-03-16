import { useMemo } from 'react';
import { motion } from 'framer-motion';
import { useAQI, AQI_LEVELS } from '../context/AQIContext';

const SIZE = 200;
const STROKE = 16;
const R = (SIZE - STROKE) / 2;
const CIRCUMFERENCE = 2 * Math.PI * R;

// AQI scale is 1-6 in WeatherAPI
const AQI_RANGE_LABELS = {
    1: '0–50',
    2: '51–100',
    3: '101–150',
    4: '151–200',
    5: '201–300',
    6: '301+',
};

export default function AirQualityRing() {
    const { aqi, aqiLevel } = useAQI();
    const level = aqi || 1;
    const info = aqiLevel || AQI_LEVELS[1];

    // Map 1-6 to 0-100%
    const progress = useMemo(() => ((level - 1) / 5) * 100, [level]);
    const dashOffset = CIRCUMFERENCE - (progress / 100) * CIRCUMFERENCE;

    return (
        <div className="flex flex-col items-center gap-2">
            <div className="relative" style={{ width: SIZE, height: SIZE }}>
                <svg width={SIZE} height={SIZE} style={{ transform: 'rotate(-90deg)' }}>
                    {/* Track */}
                    <circle
                        cx={SIZE / 2} cy={SIZE / 2} r={R}
                        fill="none"
                        stroke="rgba(255,255,255,0.08)"
                        strokeWidth={STROKE}
                    />
                    {/* Progress arc */}
                    <motion.circle
                        cx={SIZE / 2} cy={SIZE / 2} r={R}
                        fill="none"
                        stroke={info.color}
                        strokeWidth={STROKE}
                        strokeLinecap="round"
                        strokeDasharray={CIRCUMFERENCE}
                        initial={{ strokeDashoffset: CIRCUMFERENCE }}
                        animate={{ strokeDashoffset: dashOffset }}
                        transition={{ duration: 1.2, ease: 'easeOut' }}
                        style={{ filter: `drop-shadow(0 0 12px ${info.color}) drop-shadow(0 0 24px ${info.color}55)` }}
                    />
                </svg>

                {/* Center text */}
                <div className="absolute inset-0 flex flex-col items-center justify-center">
                    <motion.div
                        key={level}
                        initial={{ scale: 0.5, opacity: 0 }}
                        animate={{ scale: 1, opacity: 1 }}
                        transition={{ duration: 0.5, type: 'spring' }}
                        className="text-4xl font-black"
                        style={{ color: info.color, textShadow: `0 0 20px ${info.color}` }}
                    >
                        AQI
                    </motion.div>
                    <motion.div
                        key={`label-${level}`}
                        initial={{ y: 10, opacity: 0 }}
                        animate={{ y: 0, opacity: 1 }}
                        transition={{ delay: 0.2, duration: 0.4 }}
                        className="text-sm font-semibold text-white/70 mt-1 text-center px-2"
                    >
                        {info.label}
                    </motion.div>
                    <div className="text-xs text-white/40 mt-0.5">{AQI_RANGE_LABELS[level]}</div>
                </div>
            </div>
        </div>
    );
}
