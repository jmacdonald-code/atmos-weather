# Atmos — Weather System

A weather app with dot-matrix icons, responsive three-column layout, and live OpenWeatherMap data.

## Setup

```bash
npm install
npm run dev
```

## Deploy to Vercel

1. Push this repo to GitHub
2. Go to [vercel.com](https://vercel.com) and import the repo
3. Vercel auto-detects Vite — just click Deploy
4. Done. You'll get a URL like `atmos-weather.vercel.app`

## API Key

The OpenWeatherMap API key is in `src/WeatherApp.jsx`. For production you'd want to move this to an environment variable, but for a personal project it's fine as-is.

## Features

- Auto-detects your location via browser geolocation
- Falls back to Edinburgh if location access is denied
- Search any city worldwide
- °C / °F toggle
- Smart weather warnings (high wind, freezing, storms, etc.)
- Dot-matrix weather icons
- Responsive: mobile → tablet → three-column desktop
