import { useState } from 'react';
import { motion } from 'framer-motion';
import { useAQI } from '../context/AQIContext';

export default function SearchBar() {
    const { fetchData, loading } = useAQI();
    const [input, setInput] = useState('');

    const handleSubmit = (e) => {
        e.preventDefault();
        if (input.trim()) fetchData(input.trim());
    };

    return (
        <form onSubmit={handleSubmit} className="relative w-full">
            <div className="glass rounded-2xl flex items-center gap-3 px-4 py-3 transition-all duration-300 hover:border-white/25"
                style={{ border: '1px solid rgba(255,255,255,0.12)' }}>
                <svg className="w-4 h-4 text-white/40 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                </svg>
                <input
                    type="text"
                    value={input}
                    onChange={(e) => setInput(e.target.value)}
                    placeholder="Search any city..."
                    className="bg-transparent flex-1 text-white placeholder-white/30 text-sm font-medium outline-none"
                />
                <motion.button
                    type="submit"
                    whileTap={{ scale: 0.95 }}
                    whileHover={{ scale: 1.05 }}
                    disabled={loading || !input.trim()}
                    className="text-xs font-bold text-white/70 px-3 py-1.5 rounded-xl transition-all disabled:opacity-30"
                    style={{ background: 'rgba(255,255,255,0.1)', border: '1px solid rgba(255,255,255,0.15)' }}
                >
                    {loading ? (
                        <span className="flex items-center gap-1">
                            <svg className="animate-spin w-3 h-3" fill="none" viewBox="0 0 24 24">
                                <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                                <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.4 0 0 5.4 0 12h4z" />
                            </svg>
                            Fetching
                        </span>
                    ) : 'Search'}
                </motion.button>
            </div>
        </form>
    );
}
