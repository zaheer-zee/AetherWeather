# AetherWeather

Created by **ZaheerChoudhari**

> ☁️ *Why did the cloud stay at home?*
> *Because it was feeling a little under the weather!* 🌧️

## What is AetherWeather?

A full production-ready **3D Weather & Air Quality** React application built with:
- React (Vite)
- Tailwind CSS (with glassmorphism aesthetic)
- React Three Fiber & Drei (for the central 3D orb and atmosphere)
- Framer Motion (page transitions and component reveals)
- WeatherAPI.com (real-time weather and air quality data)

### Features

- **3D Interactive Atmosphere**: A central distorted sphere that reacts to air quality index (AQI) levels.
- **Dynamic Fog & Particles**: `Three.js` Fog Exp2 and particle systems simulate smog that physically thickens when AQI worsens.
- **Real-Time Data**: Fast, single API calls fetching both current weather and accurate AQI.
- **Glowing AQI Ring**: An SVG animated circle measuring the US-EPA 1-6 scale.
- **Detailed Pollutant Breakdown**: Deep dive into PM2.5, PM10, NO2, O3, CO, and SO2 with animated progress bars and micro-sparklines.
- **Health Advisories**: Context-aware slide-up panel giving actual recommendations based on the current hazard level.

## Getting Started

1. Clone the repository
2. Install dependencies:
   ```bash
   npm install
   ```
3. Set up your `.env` file by copying `.env.example`:
   ```bash
   cp .env.example .env
   ```
4. Add your free [WeatherAPI.com](https://www.weatherapi.com/) key to `.env`
5. Start the dev server:
   ```bash
   npm run dev
   ```

## Cloudflare Pages Demo

Check out the live deployment here: **[https://aether-weather.pages.dev](https://aether-weather.pages.dev)**
