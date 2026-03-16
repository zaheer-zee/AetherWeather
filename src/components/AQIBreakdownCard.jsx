import { motion } from 'framer-motion';
import { useAQI } from '../context/AQIContext';

// Mini SVG sparkline component
function Sparkline({ values, color }) {
    if (!values || values.length === 0) return null;
    const max = Math.max(...values, 1);
    const width = 80;
    const height = 28;
    const pts = values.map((v, i) => {
        const x = (i / (values.length - 1)) * width;
        const y = height - (v / max) * height;
        return `${x},${y}`;
    });
    const pathD = `M ${pts.join(' L ')}`;
    const safeId = color.replace('#', '');

    return (
        <svg width={width} height={height} className="overflow-visible">
            <defs>
                <linearGradient id={`grad-${safeId}`} x1="0%" y1="0%" x2="100%" y2="0%">
                    <stop offset="0%" stopColor={color} stopOpacity="0.3" />
                    <stop offset="100%" stopColor={color} stopOpacity="1" />
                </linearGradient>
            </defs>
            <path d={pathD} fill="none" stroke={`url(#grad-${safeId})`} strokeWidth="1.5" strokeLinecap="round" />
            <circle
                cx={width}
                cy={height - (values[values.length - 1] / max) * height}
                r={2.5}
                fill={color}
                style={{ filter: `drop-shadow(0 0 4px ${color})` }}
            />
        </svg>
    );
}

function PollutantRow({ label, value, unit, color, limit, sparkValues }) {
    const pct = Math.min((value / limit) * 100, 100);
    return (
        <div className="flex items-center justify-between gap-3 py-3 border-b border-white/5 last:border-0">
            <div className="flex-1">
                <div className="flex items-center gap-2 mb-1">
                    <span className="text-xs font-semibold text-white/50 uppercase tracking-wider">{label}</span>
                </div>
                <div className="flex items-center gap-2">
                    <div className="h-1 rounded-full bg-white/10 flex-1 overflow-hidden">
                        <motion.div
                            className="h-full rounded-full"
                            style={{ backgroundColor: color, boxShadow: `0 0 8px ${color}66` }}
                            initial={{ width: 0 }}
                            animate={{ width: `${pct}%` }}
                            transition={{ duration: 1, ease: 'easeOut', delay: 0.2 }}
                        />
                    </div>
                    <span className="text-xs text-white/30 w-20 text-right">
                        {value.toFixed(2)} {unit}
                    </span>
                </div>
            </div>
            <Sparkline values={sparkValues} color={color} />
        </div>
    );
}

export default function AQIBreakdownCard() {
    const { pollution } = useAQI();
    if (!pollution) return null;

    // WeatherAPI air_quality fields
    const pm2_5 = pollution['pm2_5'] ?? 0;
    const pm10 = pollution['pm10'] ?? 0;
    const no2 = pollution['no2'] ?? 0;
    const o3 = pollution['o3'] ?? 0;
    const co = pollution['co'] ?? 0;   // µg/m³
    const so2 = pollution['so2'] ?? 0;

    const genSpark = (val) =>
        Array.from({ length: 6 }, (_, i) =>
            Math.max(0, val * (0.6 + Math.random() * 0.8 - i * 0.04))
        );

    const pollutants = [
        { label: 'PM₂.₅', value: pm2_5, unit: 'μg/m³', color: '#ff6644', limit: 35, spark: genSpark(pm2_5) },
        { label: 'PM₁₀', value: pm10, unit: 'μg/m³', color: '#ffaa44', limit: 150, spark: genSpark(pm10) },
        { label: 'NO₂', value: no2, unit: 'μg/m³', color: '#aa88ff', limit: 200, spark: genSpark(no2) },
        { label: 'O₃', value: o3, unit: 'μg/m³', color: '#44ddff', limit: 180, spark: genSpark(o3) },
        { label: 'CO', value: co / 1000, unit: 'mg/m³', color: '#88ff44', limit: 10, spark: genSpark(co / 1000) },
        { label: 'SO₂', value: so2, unit: 'μg/m³', color: '#ffdd44', limit: 350, spark: genSpark(so2) },
    ];

    return (
        <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            transition={{ duration: 0.5 }}
            className="glass rounded-2xl p-5 relative overflow-hidden"
        >
            <div className="shimmer absolute inset-0 rounded-2xl pointer-events-none" />
            <h3 className="text-sm font-bold text-white/80 uppercase tracking-widest mb-3 flex items-center gap-2">
                <span className="w-2 h-2 rounded-full bg-blue-400 animate-pulse inline-block" />
                Pollutant Breakdown
            </h3>
            <div>
                {pollutants.map((p) => (
                    <PollutantRow key={p.label} {...p} sparkValues={p.spark} />
                ))}
            </div>
        </motion.div>
    );
}
