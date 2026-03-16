import { motion, AnimatePresence } from 'framer-motion';
import { useAQI } from '../context/AQIContext';

export default function HealthRecommendations() {
    const { aqi, recommendations, aqiLevel } = useAQI();

    if (!aqi) return null;

    return (
        <motion.div
            initial={{ y: '100%', opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            exit={{ y: '100%', opacity: 0 }}
            transition={{ type: 'spring', stiffness: 120, damping: 20 }}
            className="glass rounded-2xl p-5 relative overflow-hidden"
        >
            <div className="shimmer absolute inset-0 rounded-2xl pointer-events-none" />

            <h3 className="text-sm font-bold text-white/80 uppercase tracking-widest mb-4 flex items-center gap-2">
                <span
                    className="w-2 h-2 rounded-full inline-block animate-pulse"
                    style={{ backgroundColor: aqiLevel?.color }}
                />
                Health Advisory
            </h3>

            <div className="space-y-3">
                <AnimatePresence mode="wait">
                    {recommendations.map((rec, i) => (
                        <motion.div
                            key={`${aqi}-${i}`}
                            initial={{ opacity: 0, x: -20 }}
                            animate={{ opacity: 1, x: 0 }}
                            exit={{ opacity: 0, x: 20 }}
                            transition={{ delay: i * 0.1, duration: 0.4 }}
                            className="flex items-start gap-3 p-3 rounded-xl"
                            style={{
                                background: `${aqiLevel?.color}11`,
                                border: `1px solid ${aqiLevel?.color}22`,
                            }}
                        >
                            <span className="text-2xl flex-shrink-0">{rec.icon}</span>
                            <div>
                                <div className="text-sm font-semibold text-white/90">{rec.title}</div>
                                <div className="text-xs text-white/50 mt-0.5 leading-relaxed">{rec.desc}</div>
                            </div>
                        </motion.div>
                    ))}
                </AnimatePresence>
            </div>
        </motion.div>
    );
}
