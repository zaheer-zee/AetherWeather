import React, { createContext, useContext, useState, useCallback } from 'react';
import axios from 'axios';

const AQIContext = createContext(null);

// WeatherAPI.com US-EPA index: 1=Good, 2=Moderate, 3=Unhealthy(Sensitive),
// 4=Unhealthy, 5=Very Unhealthy, 6=Hazardous
export const AQI_LEVELS = {
    1: { label: 'Good', color: '#00e400', bgFrom: '#0a2a0a', bgTo: '#0a1a2e', glowClass: 'glow-good', category: 'good' },
    2: { label: 'Moderate', color: '#ffff00', bgFrom: '#1a1a00', bgTo: '#0a1a2e', glowClass: 'glow-moderate', category: 'moderate' },
    3: { label: 'Unhealthy (Sensitive)', color: '#ff7e00', bgFrom: '#1a0d00', bgTo: '#1a0d1a', glowClass: 'glow-sensitive', category: 'sensitive' },
    4: { label: 'Unhealthy', color: '#ff0000', bgFrom: '#1a0000', bgTo: '#0d0d1a', glowClass: 'glow-unhealthy', category: 'unhealthy' },
    5: { label: 'Very Unhealthy', color: '#8f3f97', bgFrom: '#0f0014', bgTo: '#1a001a', glowClass: 'glow-very-unhealthy', category: 'veryUnhealthy' },
    6: { label: 'Hazardous', color: '#7e0023', bgFrom: '#1a0008', bgTo: '#0a0010', glowClass: 'glow-hazardous', category: 'hazardous' },
};

export const HEALTH_RECOMMENDATIONS = {
    1: [
        { icon: '🏃', title: 'Perfect for outdoor exercise', desc: 'Air quality is ideal for running, cycling, or any outdoor activity.' },
        { icon: '🪟', title: 'Open your windows', desc: 'Great time to ventilate your home with fresh air.' },
        { icon: '🌿', title: 'Enjoy nature', desc: 'Head outdoors — air quality poses little to no risk.' },
    ],
    2: [
        { icon: '🚶', title: 'Light activity is fine', desc: 'Unusually sensitive people should consider reducing prolonged exertion.' },
        { icon: '👁️', title: 'Watch for symptoms', desc: 'Monitor if you experience eye or respiratory irritation.' },
        { icon: '🪟', title: 'Windows optional', desc: 'Ventilation is fine for most people.' },
    ],
    3: [
        { icon: '😷', title: 'Consider a mask outdoors', desc: 'Sensitive groups should wear N95 masks for extended outdoor exposure.' },
        { icon: '🏠', title: 'Limit outdoor time', desc: 'Reduce prolonged or heavy exertion outdoors.' },
        { icon: '🪟', title: 'Keep windows closed', desc: 'Use air purifiers indoors to clean the air.' },
    ],
    4: [
        { icon: '😷', title: 'Wear a mask', desc: 'N95 mask strongly recommended for any outdoor activity.' },
        { icon: '🚫', title: 'Avoid outdoor exercise', desc: 'Everyone should avoid prolonged exertion outdoors.' },
        { icon: '🏠', title: 'Stay indoors', desc: 'Keep windows and doors closed. Run air purifiers.' },
    ],
    5: [
        { icon: '🚨', title: 'Health emergency', desc: 'Everyone should avoid all outdoor physical activity.' },
        { icon: '😷', title: 'Mask required outdoors', desc: 'Use N95 or higher if you must go outside.' },
        { icon: '🏥', title: 'Seek medical help if needed', desc: 'Serious health effects possible for everyone.' },
    ],
    6: [
        { icon: '🚨', title: 'HAZARDOUS — Stay inside', desc: 'Avoid any outdoor exposure. Emergency conditions.' },
        { icon: '😷', title: 'Respirator required', desc: 'N95/P100 respirator mandatory if you must leave.' },
        { icon: '🏥', title: 'Medical emergency possible', desc: 'Contact emergency services if experiencing symptoms.' },
    ],
};

const API_KEY = import.meta.env.VITE_WEATHERAPI_KEY || '';
const BASE_URL = 'https://api.weatherapi.com/v1';

export function AQIProvider({ children }) {
    const [weather, setWeather] = useState(null);
    const [aqi, setAqi] = useState(null);   // 1-6 US-EPA index
    const [pollution, setPollution] = useState(null);   // raw air_quality object
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(null);
    const [city, setCity] = useState('');
    const [view, setView] = useState('weather'); // 'weather' | 'aqi'

    const fetchData = useCallback(async (cityName) => {
        if (!cityName.trim()) return;
        setLoading(true);
        setError(null);

        try {
            // WeatherAPI current.json — single call returns both weather + AQI
            const res = await axios.get(`${BASE_URL}/current.json`, {
                params: { key: API_KEY, q: cityName, aqi: 'yes' },
            });

            const data = res.data;
            setWeather(data);

            const aq = data.current.air_quality;
            setPollution(aq);

            // us-epa-index is 1–6
            const aqiVal = aq?.['us-epa-index'] ?? 1;
            setAqi(aqiVal);
            setCity(data.location.name);

        } catch (err) {
            if (err.response?.status === 400 || err.response?.status === 404) {
                setError('City not found. Please try another search.');
            } else if (err.response?.status === 401 || err.response?.status === 403) {
                setError('Invalid API key. Please check your VITE_WEATHERAPI_KEY.');
            } else {
                setError('Failed to fetch data. Please check your connection.');
            }
        } finally {
            setLoading(false);
        }
    }, []);

    const aqiLevel = aqi ? AQI_LEVELS[aqi] : null;
    const recommendations = aqi ? HEALTH_RECOMMENDATIONS[aqi] : [];

    return (
        <AQIContext.Provider value={{
            weather, aqi, pollution, loading, error,
            city, view, setView, fetchData, aqiLevel, recommendations,
        }}>
            {children}
        </AQIContext.Provider>
    );
}

export function useAQI() {
    const ctx = useContext(AQIContext);
    if (!ctx) throw new Error('useAQI must be used within AQIProvider');
    return ctx;
}
