import { motion, AnimatePresence } from 'framer-motion';
import { useAQI } from '../context/AQIContext';
import SearchBar from '../components/SearchBar';
import WeatherCard from '../components/WeatherCard';
import AirQualityRing from '../components/AirQualityRing';
import AQIBreakdownCard from '../components/AQIBreakdownCard';
import HealthRecommendations from '../components/HealthRecommendations';

// Landing state (no data yet)
function LandingHero() {
    return (
        <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -30 }}
            className="flex flex-col items-center justify-center text-center py-6"
        >
            <motion.div
                className="text-6xl mb-4"
                animate={{ y: [0, -10, 0] }}
                transition={{ repeat: Infinity, duration: 3, ease: 'easeInOut' }}
            >
                🌍
            </motion.div>

            <div className="glass-strong mt-2 p-8 rounded-3xl relative overflow-hidden ring-1 ring-white/20 shadow-[0_0_50px_rgba(0,100,255,0.15)] w-full">
                <div className="shimmer absolute inset-0 rounded-3xl pointer-events-none opacity-50" />
                <h2 className="text-4xl font-black text-white mb-4 tracking-tight drop-shadow-lg">
                    Created by<br />
                    <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-400 via-indigo-300 to-emerald-400 leading-tight">
                        ZaheerChoudhari
                    </span>
                </h2>

                <div className="w-16 h-1 bg-gradient-to-r from-transparent via-white/30 to-transparent mx-auto rounded-full mb-5"></div>

                <p className="text-lg text-white/90 italic font-medium leading-relaxed drop-shadow-sm">
                    "Why did the weatherman bring a ladder to work?<br />
                    <span className="text-blue-300 font-bold not-italic">He heard the forecast was high chance of elevation!</span> ☁️"
                </p>
            </div>

            <p className="text-white/50 text-sm max-w-sm mt-8 leading-relaxed font-medium">
                Search any city above to explore real-time weather and air quality with a live 3D atmosphere.
            </p>
        </motion.div>
    );
}

export default function MainDashboard() {
    const { weather, aqi, aqiLevel, error, loading, view, setView } = useAQI();
    const hasData = weather && aqi;

    return (
        <div className="ui-layer min-h-screen flex flex-col px-4 py-6 max-w-lg mx-auto">
            {/* Top bar */}
            <div className="flex items-center justify-between mb-4">
                <div className="flex items-center gap-2">
                    <div className="w-2 h-2 rounded-full bg-blue-400 animate-pulse" />
                    <span className="text-xs font-bold text-white/60 uppercase tracking-widest">Aether Weather</span>
                </div>
                {hasData && (
                    <div className="flex gap-1.5">
                        {['weather', 'aqi'].map((v) => (
                            <button
                                key={v}
                                onClick={() => setView(v)}
                                className="text-xs font-semibold px-3 py-1.5 rounded-xl transition-all duration-300"
                                style={{
                                    background: view === v ? 'rgba(255,255,255,0.15)' : 'rgba(255,255,255,0.05)',
                                    border: `1px solid ${view === v ? 'rgba(255,255,255,0.25)' : 'rgba(255,255,255,0.08)'}`,
                                    color: view === v ? '#fff' : 'rgba(255,255,255,0.4)',
                                }}
                            >
                                {v === 'weather' ? '🌤 Weather' : '🫁 Air Quality'}
                            </button>
                        ))}
                    </div>
                )}
            </div>

            {/* Search */}
            <div className="mb-5">
                <SearchBar />
            </div>

            {/* Error */}
            <AnimatePresence>
                {error && (
                    <motion.div
                        initial={{ opacity: 0, height: 0 }}
                        animate={{ opacity: 1, height: 'auto' }}
                        exit={{ opacity: 0, height: 0 }}
                        className="mb-4 rounded-xl px-4 py-3 text-sm text-red-300"
                        style={{ background: 'rgba(255,60,60,0.12)', border: '1px solid rgba(255,60,60,0.25)' }}
                    >
                        ⚠️ {error}
                    </motion.div>
                )}
            </AnimatePresence>

            {/* AQI ring (top center, shown when data exists) */}
            <AnimatePresence mode="wait">
                {hasData && (
                    <motion.div
                        key="ring"
                        initial={{ opacity: 0, scale: 0.7 }}
                        animate={{ opacity: 1, scale: 1 }}
                        exit={{ opacity: 0, scale: 0.7 }}
                        transition={{ duration: 0.6, type: 'spring' }}
                        className="flex justify-center mb-5"
                    >
                        <AirQualityRing />
                    </motion.div>
                )}
            </AnimatePresence>

            {/* Main content area with view switching */}
            <div className="flex-1 overflow-y-auto pb-4 space-y-4">
                <AnimatePresence mode="wait">
                    {!hasData && !loading && (
                        <LandingHero key="landing" />
                    )}

                    {loading && (
                        <motion.div
                            key="loading"
                            initial={{ opacity: 0 }}
                            animate={{ opacity: 1 }}
                            exit={{ opacity: 0 }}
                            className="flex flex-col items-center justify-center py-20 gap-4"
                        >
                            <div className="relative w-16 h-16">
                                <div className="absolute inset-0 rounded-full border-2 border-white/10" />
                                <div className="absolute inset-0 rounded-full border-2 border-t-blue-400 border-r-transparent border-b-transparent border-l-transparent animate-spin" />
                            </div>
                            <p className="text-white/40 text-sm">Fetching atmosphere data...</p>
                        </motion.div>
                    )}

                    {hasData && view === 'weather' && (
                        <motion.div
                            key="weather-view"
                            initial={{ opacity: 0, x: -30 }}
                            animate={{ opacity: 1, x: 0 }}
                            exit={{ opacity: 0, x: 30 }}
                            transition={{ duration: 0.4 }}
                            className="space-y-4"
                        >
                            <WeatherCard />
                            <HealthRecommendations />
                        </motion.div>
                    )}

                    {hasData && view === 'aqi' && (
                        <motion.div
                            key="aqi-view"
                            initial={{ opacity: 0, x: 30 }}
                            animate={{ opacity: 1, x: 0 }}
                            exit={{ opacity: 0, x: -30 }}
                            transition={{ duration: 0.4 }}
                            className="space-y-4"
                        >
                            {/* AQI header card */}
                            <motion.div
                                className="glass rounded-2xl p-5 relative overflow-hidden"
                                initial={{ opacity: 0 }}
                                animate={{ opacity: 1 }}
                            >
                                <div className="shimmer absolute inset-0 rounded-2xl pointer-events-none" />
                                <div className="flex items-center justify-between">
                                    <div>
                                        <div className="text-xs font-bold text-white/50 uppercase tracking-widest mb-1">
                                            Air Quality Index
                                        </div>
                                        <div className="text-3xl font-black" style={{ color: aqiLevel?.color, textShadow: `0 0 20px ${aqiLevel?.color}66` }}>
                                            {aqiLevel?.label}
                                        </div>
                                        <div className="text-xs text-white/40 mt-1">
                                            US-EPA Scale: Level {aqi} of 5
                                        </div>
                                    </div>
                                    <div
                                        className="w-16 h-16 rounded-2xl flex items-center justify-center text-3xl font-black"
                                        style={{
                                            background: `${aqiLevel?.color}22`,
                                            border: `2px solid ${aqiLevel?.color}55`,
                                            color: aqiLevel?.color,
                                            boxShadow: `0 0 24px ${aqiLevel?.color}44`,
                                        }}
                                    >
                                        {aqi}
                                    </div>
                                </div>
                            </motion.div>

                            <AQIBreakdownCard />
                            <HealthRecommendations />
                        </motion.div>
                    )}
                </AnimatePresence>
            </div>

            {/* Footer */}
            <div className="mt-4 text-center text-xs text-white/20">
                Data from WeatherAPI.com · {new Date().toLocaleTimeString()}
            </div>
        </div>
    );
}
