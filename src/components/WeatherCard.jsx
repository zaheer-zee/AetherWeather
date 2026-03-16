import { motion } from 'framer-motion';
import { useAQI } from '../context/AQIContext';

const WEATHER_ICONS = {
    'Sunny': '☀️', 'Clear': '🌙', 'Partly cloudy': '⛅', 'Cloudy': '☁️',
    'Overcast': '☁️', 'Mist': '🌫️', 'Fog': '🌫️', 'Freezing fog': '🌫️',
    'Patchy rain possible': '🌦️', 'Patchy snow possible': '🌨️',
    'Blowing snow': '❄️', 'Blizzard': '❄️', 'Thundery outbreaks possible': '⛈️',
    'Light rain': '🌧️', 'Moderate rain': '🌧️', 'Heavy rain': '🌧️',
    'Light snow': '❄️', 'Moderate snow': '❄️', 'Heavy snow': '❄️',
    'Light sleet': '🌨️', 'Moderate or heavy sleet': '🌨️',
    'Torrential rain shower': '🌧️', 'Light drizzle': '🌦️',
};

export default function WeatherCard() {
    const { weather, aqiLevel, aqi } = useAQI();
    if (!weather) return null;

    const loc = weather.location;
    const cur = weather.current;
    const icon = WEATHER_ICONS[cur.condition.text] ?? '🌡️';

    const statItems = [
        { label: 'Humidity', value: `${cur.humidity}%`, icon: '💧' },
        { label: 'Wind', value: `${cur.wind_kph} km/h`, icon: '🌬️' },
        { label: 'Feels Like', value: `${cur.feelslike_c}°C`, icon: '🌡️' },
        { label: 'Visibility', value: `${cur.vis_km} km`, icon: '👁️' },
        { label: 'UV Index', value: `${cur.uv}`, icon: '🔆' },
        { label: 'Pressure', value: `${cur.pressure_mb} mb`, icon: '⏱️' },
    ];

    return (
        <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            transition={{ duration: 0.5 }}
            className="glass rounded-2xl p-6 relative overflow-hidden"
        >
            <div className="shimmer absolute inset-0 rounded-2xl pointer-events-none" />

            {/* Header */}
            <div className="flex items-start justify-between mb-4">
                <div className="flex items-center gap-2">
                    <span className="text-4xl">{icon}</span>
                    <div>
                        <div className="text-5xl font-black text-white leading-none">{Math.round(cur.temp_c)}°</div>
                        <div className="text-sm text-white/50 capitalize mt-1">{cur.condition.text}</div>
                    </div>
                </div>
                <div className="text-right">
                    <div className="text-2xl font-bold text-white">{loc.name}</div>
                    <div className="text-sm text-white/50">{loc.country}</div>
                    {aqiLevel && (
                        <div
                            className="text-xs font-semibold mt-1 px-2 py-0.5 rounded-full inline-block"
                            style={{
                                color: aqiLevel.color,
                                backgroundColor: `${aqiLevel.color}22`,
                                border: `1px solid ${aqiLevel.color}44`,
                            }}
                        >
                            Air: {aqiLevel.label}
                        </div>
                    )}
                </div>
            </div>

            {/* Stats Grid */}
            <div className="grid grid-cols-3 gap-2">
                {statItems.map((stat, i) => (
                    <motion.div
                        key={stat.label}
                        initial={{ opacity: 0, scale: 0.8 }}
                        animate={{ opacity: 1, scale: 1 }}
                        transition={{ delay: i * 0.08, duration: 0.3 }}
                        className="rounded-xl p-2.5 text-center"
                        style={{ background: 'rgba(255,255,255,0.05)', border: '1px solid rgba(255,255,255,0.08)' }}
                    >
                        <div className="text-lg mb-0.5">{stat.icon}</div>
                        <div className="text-xs text-white/40 mb-0.5">{stat.label}</div>
                        <div className="text-sm font-semibold text-white/90">{stat.value}</div>
                    </motion.div>
                ))}
            </div>
        </motion.div>
    );
}
