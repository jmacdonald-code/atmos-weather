import { useState, useEffect, useCallback, useRef } from "react";

function WeatherIcon({ type, size = 28, color = "#000000" }) {
  const gridSize = 12;
  const dotR = 0.35;
  
  const shapes = {
    clear: [
      "....0000....",
      "...000000...",
      "..00000000..",
      ".0000000000.",
      ".0000000000.",
      "000000000000",
      "000000000000",
      ".0000000000.",
      ".0000000000.",
      "..00000000..",
      "...000000...",
      "....0000....",
    ],
    clouds: [
      "............",
      "....0000....",
      "...000000...",
      "..00000000..",
      ".000000000..",
      "00000000000.",
      "000000000000",
      "000000000000",
      "............",
      "............",
      "............",
      "............",
    ],
    rain: [
      "....0000....",
      "...000000...",
      "..00000000..",
      ".000000000..",
      "000000000000",
      "000000000000",
      "............",
      ".0...0...0..",
      "0...0...0...",
      "............",
      ".0...0...0..",
      "0...0...0...",
    ],
    drizzle: [
      "....0000....",
      "...000000...",
      "..00000000..",
      ".000000000..",
      "000000000000",
      "000000000000",
      "............",
      "..0.....0...",
      "............",
      "....0.......",
      "............",
      "............",
    ],
    thunderstorm: [
      "....0000....",
      "...000000...",
      "..00000000..",
      ".000000000..",
      "000000000000",
      "000000000000",
      ".....00.....",
      "....000.....",
      "...0000.....",
      "....00......",
      "...00.......",
      "..00........",
    ],
    snow: [
      "....0000....",
      "...000000...",
      "..00000000..",
      ".000000000..",
      "000000000000",
      "000000000000",
      "............",
      "..0...0...0.",
      "............",
      ".0...0...0..",
      "............",
      "..0...0...0.",
    ],
    mist: [
      "............",
      "000000000000",
      "000000000000",
      "............",
      "..00000000..",
      "..00000000..",
      "............",
      "000000000000",
      "000000000000",
      "............",
      "...000000...",
      "...000000...",
    ],
    night_clear: [
      "......0000..",
      "....000000..",
      "...0000.....",
      "..0000......",
      "..000.......",
      ".0000.......",
      ".0000.......",
      "..000.......",
      "..0000......",
      "...0000.....",
      "....000000..",
      "......0000..",
    ],
  };

  const grid = shapes[type] || shapes.clouds;
  const cellSize = 1;
  const viewBox = `0 0 ${gridSize} ${gridSize}`;

  return (
    <svg width={size} height={size} viewBox={viewBox} xmlns="http://www.w3.org/2000/svg">
      {grid.map((row, y) =>
        row.split("").map((cell, x) => (
          <circle
            key={`${x}-${y}`}
            cx={x + 0.5}
            cy={y + 0.5}
            r={cell === "0" ? dotR : dotR * 0.3}
            fill={cell === "0" ? color : (color === "#000000" ? "rgba(0,0,0,0.1)" : "rgba(255,255,255,0.15)")}
          />
        ))
      )}
    </svg>
  );
}

const THEME = {
  gradient: "#b0aba9",
  accent: "#e64625",
  text: "#000000",
  textSecondary: "#999999",
  cardBg: "#c4bfb8",
  cardBorder: "#b8b3ab",
  scanline: "#fef0e6",
  statusColor: "#e64625",
};

const WEATHER_LABELS = {
  clear: "Clear",
  clouds: "Overcast",
  rain: "Precipitation",
  drizzle: "Light Rain",
  thunderstorm: "Electrical Storm",
  snow: "Snowfall",
  mist: "Low Visibility",
  night_clear: "Clear Night",
};

function getThemeKey(weatherMain, icon) {
  const isNight = icon?.endsWith("n");
  const main = weatherMain?.toLowerCase();
  if (main === "clear" && isNight) return "night_clear";
  if (main === "clear") return "clear";
  if (main === "clouds") return "clouds";
  if (main === "rain") return "rain";
  if (main === "drizzle") return "drizzle";
  if (main === "thunderstorm") return "thunderstorm";
  if (main === "snow") return "snow";
  if (["mist", "fog", "haze", "smoke", "dust", "sand", "ash"].includes(main)) return "mist";
  return "clouds";
}

function ScanLines() { return null; }

function GridOverlay() { return null; }

function Particles() { return null; }

function StatusBar({ theme }) {
  const [time, setTime] = useState(new Date());
  useEffect(() => {
    const timer = setInterval(() => setTime(new Date()), 1000);
    return () => clearInterval(timer);
  }, []);
  const ts = time.toLocaleTimeString("en-GB", { hour: "2-digit", minute: "2-digit", second: "2-digit" });

  return (
    <div style={{
      width: "100%", padding: "0 4px", marginBottom: "8px",
    }}>
      <div className="header-text" style={{
        fontFamily: "'Inter', sans-serif",
        fontWeight: 900,
        color: "#000000",
        lineHeight: 1.1,
      }}>Atmos</div>
      <div className="header-text" style={{
        fontFamily: "'Inter', sans-serif",
        fontWeight: 900,
        color: "#999999",
        lineHeight: 1.1,
      }}>Weather System</div>
      <div className="header-text" style={{
        fontFamily: "'Inter', sans-serif",
        fontWeight: 900,
        color: "#000000",
        marginTop: "4px",
      }}>{ts}</div>
    </div>
  );
}

function SearchInput({ onSearch, theme }) {
  const [value, setValue] = useState("");
  const [open, setOpen] = useState(false);
  const inputRef = useRef(null);
  const doSearch = () => {
    if (value.trim()) { onSearch(value.trim()); setValue(""); setOpen(false); }
  };

  useEffect(() => {
    if (open && inputRef.current) inputRef.current.focus();
  }, [open]);

  if (!open) {
    return (
      <button onClick={() => setOpen(true)} style={{
        background: "#e64625", border: "none", borderRadius: "16px",
        width: "48px", height: "48px", cursor: "pointer",
        display: "flex", alignItems: "center", justifyContent: "center",
      }}>
        <svg width="20" height="20" viewBox="0 0 24 24" fill="none">
          <circle cx="10" cy="10" r="7" stroke="#ffffff" strokeWidth="2.5" />
          <line x1="15" y1="15" x2="21" y2="21" stroke="#ffffff" strokeWidth="2.5" strokeLinecap="round" />
        </svg>
      </button>
    );
  }

  return (
    <div style={{
      position: "fixed", top: "24px", left: "16px", right: "16px", zIndex: 10,
      display: "flex", alignItems: "center", gap: "8px",
      background: "#c4bfb8", borderRadius: "16px",
      padding: "6px 6px 6px 20px",
      boxShadow: "0 4px 24px rgba(0,0,0,0.15)",
    }}>
      <input ref={inputRef} type="text" value={value} onChange={(e) => setValue(e.target.value)}
        onKeyDown={(e) => {
          if (e.key === "Enter") doSearch();
          if (e.key === "Escape") { setOpen(false); setValue(""); }
        }}
        placeholder="Enter location..."
        style={{
          flex: 1, background: "none", border: "none", outline: "none",
          color: "#000000", fontSize: "16px",
          fontFamily: "'Inter', sans-serif", fontWeight: 700,
        }}
      />
      <button onClick={doSearch} style={{
        background: "#e64625", border: "none", borderRadius: "12px",
        padding: "12px 24px", color: "#ffffff", fontSize: "14px",
        fontFamily: "'Inter', sans-serif", fontWeight: 700,
        cursor: "pointer",
      }}>Scan</button>
      <button onClick={() => { setOpen(false); setValue(""); }} style={{
        background: "none", border: "none", cursor: "pointer",
        fontSize: "20px", color: "#999999", padding: "8px",
      }}>✕</button>
    </div>
  );
}

function DataReadout({ label, value, unit, variant = "accent" }) {
  const isLight = variant === "light";
  const bg = isLight ? "#c4bfb8" : "#e64625";
  const textColor = "#000000";
  const subColor = isLight ? "#888888" : "#000000";
  return (
    <div style={{
      background: bg, borderRadius: "20px",
      padding: "24px", position: "relative",
      display: "flex", flexDirection: "column", justifyContent: "space-between",
      minHeight: "160px",
    }}>
      <div className="data-card-label" style={{
        fontSize: "18px", fontFamily: "'Inter', sans-serif", fontWeight: 900,
        color: textColor, lineHeight: 1.2,
      }}>{label}</div>
      <div className="data-card-value" style={{
        fontSize: "42px", fontWeight: 900, color: textColor,
        fontFamily: "'Inter', sans-serif", lineHeight: 1,
      }}>
        {value}
        {unit && <span className="data-card-unit" style={{
          fontSize: "16px", fontWeight: 700, color: subColor,
          marginLeft: "4px",
        }}>{unit}</span>}
      </div>
    </div>
  );
}

function degToCompass(deg) {
  const dirs = ["N", "NE", "E", "SE", "S", "SW", "W", "NW"];
  return dirs[Math.round(deg / 45) % 8];
}

function WindReadout({ speed, deg, unit, variant = "accent" }) {
  const compass = degToCompass(deg || 0);
  const isLight = variant === "light";
  const bg = isLight ? "#c4bfb8" : "#e64625";
  const textColor = "#000000";
  const subColor = isLight ? "#888888" : "#000000";
  return (
    <div style={{
      background: bg, borderRadius: "20px",
      padding: "24px", position: "relative",
      display: "flex", flexDirection: "column", justifyContent: "space-between",
      minHeight: "160px",
    }}>
      <div className="data-card-label" style={{
        fontSize: "18px", fontFamily: "'Inter', sans-serif", fontWeight: 900,
        color: textColor, lineHeight: 1.2,
      }}>Wind</div>
      <div>
        <div style={{
          display: "flex", alignItems: "center", gap: "10px",
        }}>
          <div className="data-card-value" style={{
            fontSize: "42px", fontWeight: 900, color: textColor,
            fontFamily: "'Inter', sans-serif", lineHeight: 1,
          }}>
            {speed}
            <span className="data-card-unit" style={{
              fontSize: "16px", fontWeight: 700, color: subColor,
              marginLeft: "4px",
            }}>{unit}</span>
          </div>
          <svg className="wind-arrow" width="32" height="32" viewBox="0 0 28 28" style={{
            transform: `rotate(${deg || 0}deg)`,
          }}>
            <polygon points="14,2 8,24 14,19 20,24" fill={textColor} />
          </svg>
          <span className="wind-compass" style={{
            fontSize: "24px", fontWeight: 900, color: textColor,
            fontFamily: "'Inter', sans-serif",
          }}>{compass}</span>
        </div>
      </div>
    </div>
  );
}

function ForecastDay({ day, theme, displayTemp }) {
  const date = new Date(day.dt * 1000);
  const dayName = date.toLocaleDateString("en-GB", { weekday: "short" });
  const iconKey = getThemeKey(day.weather[0].main, day.weather[0].icon);

  return (
    <div style={{
      display: "flex", flexDirection: "column", justifyContent: "space-between",
      padding: "20px 16px", background: "#c4bfb8", borderRadius: "20px",
      minWidth: "80px", minHeight: "180px", flex: 1,
    }}>
      <span style={{
        fontSize: "16px", fontFamily: "'Inter', sans-serif", fontWeight: 900,
        color: "#000000",
      }}>{dayName}</span>
      <WeatherIcon type={iconKey} size={48} color="#000000" />
      <span style={{
        fontSize: "28px", fontWeight: 900, color: "#000000",
        fontFamily: "'Inter', sans-serif",
      }}>{displayTemp(day.main.temp)}°</span>
    </div>
  );
}

function HourlyBlock({ entry, displayTemp }) {
  const date = new Date(entry.dt * 1000);
  const hour = date.toLocaleTimeString("en-GB", { hour: "2-digit", minute: "2-digit" });
  const iconKey = getThemeKey(entry.weather[0].main, entry.weather[0].icon);

  return (
    <div style={{
      display: "flex", flexDirection: "column", justifyContent: "space-between",
      padding: "20px 16px", background: "#c4bfb8", borderRadius: "20px",
      minWidth: "80px", minHeight: "180px", flex: 1,
    }}>
      <span style={{
        fontSize: "16px", fontFamily: "'Inter', sans-serif", fontWeight: 900,
        color: "#000000",
      }}>{hour}</span>
      <WeatherIcon type={iconKey} size={48} color="#000000" />
      <span style={{
        fontSize: "28px", fontWeight: 900, color: "#000000",
        fontFamily: "'Inter', sans-serif",
      }}>{displayTemp(entry.main.temp)}°</span>
    </div>
  );
}

function ConditionBadge({ label }) {
  return (
    <div style={{
      display: "inline-flex", alignItems: "center", gap: "6px",
      padding: "8px 16px", background: "#c4bfb8", borderRadius: "12px",
      border: "none",
    }}>
      <div style={{
        width: "5px", height: "5px", borderRadius: "50%",
        background: "#e64625",
        animation: "pulse 2s ease infinite",
      }} />
      <span className="badge-text" style={{
        fontFamily: "'Inter', sans-serif", fontWeight: 700,
        color: "#000000",
      }}>{label}</span>
    </div>
  );
}

function getWarnings(weather) {
  if (!weather) return [];
  const warnings = [];
  const temp = weather.main.temp;
  const wind = weather.wind.speed;
  const humidity = weather.main.humidity;
  const main = weather.weather[0].main.toLowerCase();

  if (wind >= 50) warnings.push("High Wind");
  else if (wind >= 35) warnings.push("Strong Wind");
  if (temp <= -10) warnings.push("Extreme Cold");
  else if (temp <= 0) warnings.push("Freezing");
  if (temp >= 38) warnings.push("Extreme Heat");
  else if (temp >= 33) warnings.push("Heat");
  if (main === "thunderstorm") warnings.push("Storm");
  if (humidity >= 95 && ["mist", "fog", "haze"].includes(main)) warnings.push("Dense Fog");
  if (main === "snow" && wind >= 25) warnings.push("Blizzard");
  if (main === "rain" && humidity >= 90) warnings.push("Heavy Rain");

  return warnings;
}

function WarningBadge({ label }) {
  return (
    <div style={{
      display: "inline-flex", alignItems: "center", gap: "6px",
      padding: "8px 16px", background: "#e64625", borderRadius: "12px",
    }}>
      <span className="badge-text" style={{
        fontFamily: "'Inter', sans-serif", fontWeight: 700,
        color: "#000000",
      }}>⚠ {label}</span>
    </div>
  );
}

function UnitsToggle({ units, onToggle }) {
  return (
    <div style={{
      display: "flex", alignItems: "center", gap: "0px",
      fontFamily: "'Inter', sans-serif", fontWeight: 700, fontSize: "10px",
      letterSpacing: "0.1em",
    }}>
      <button onClick={() => onToggle("metric")} style={{
        padding: "6px 12px", border: "none", cursor: "pointer",
        fontFamily: "'Inter', sans-serif", fontWeight: 700, fontSize: "10px",
        borderRadius: "12px 0 0 12px",
        background: units === "metric" ? "#000000" : "#c4bfb8",
        color: units === "metric" ? "#ffffff" : "#999999",
      }}>°C</button>
      <button onClick={() => onToggle("imperial")} style={{
        padding: "6px 12px", border: "none", cursor: "pointer",
        fontFamily: "'Inter', sans-serif", fontWeight: 700, fontSize: "10px",
        borderRadius: "0 12px 12px 0",
        background: units === "imperial" ? "#000000" : "#c4bfb8",
        color: units === "imperial" ? "#ffffff" : "#999999",
      }}>°F</button>
    </div>
  );
}

export default function WeatherApp() {
  const [weather, setWeather] = useState(null);
  const [forecast, setForecast] = useState(null);
  const [hourly, setHourly] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [themeKey, setThemeKey] = useState("clouds");
  const [units, setUnits] = useState("metric");
  const [lastCity, setLastCity] = useState("Edinburgh");
  const theme = THEME;
  const API_KEY = "f86c56d47a6c35fb82fafb21fbf545f9";

  const toF = (c) => Math.round(c * 9 / 5 + 32);
  const toMph = (kmh) => Math.round(kmh * 0.621371);
  const toInHg = (hpa) => (hpa * 0.02953).toFixed(2);

  const displayTemp = (c) => units === "imperial" ? toF(c) : Math.round(c);
  const displayWind = (kmh) => units === "imperial" ? toMph(kmh) : Math.round(kmh);
  const displayPressure = (hpa) => units === "imperial" ? toInHg(hpa) : hpa;
  const tempUnit = units === "imperial" ? "°F" : "°C";
  const windUnit = units === "imperial" ? "MPH" : "KM/H";
  const pressureUnit = units === "imperial" ? "INHG" : "HPA";

  const loadDemoData = useCallback((city) => {
    const demos = {
      sunny: { main: "Clear", icon: "01d", temp: 24, feels: 26, humidity: 45, wind: 12, windDeg: 180, pressure: 1018, city: "Barcelona" },
      rain: { main: "Rain", icon: "09d", temp: 11, feels: 8, humidity: 82, wind: 24, windDeg: 225, pressure: 1005, city: "Glasgow" },
      snow: { main: "Snow", icon: "13d", temp: -3, feels: -8, humidity: 90, wind: 15, windDeg: 315, pressure: 1020, city: "Reykjavik" },
      cloudy: { main: "Clouds", icon: "04d", temp: 15, feels: 13, humidity: 65, wind: 18, windDeg: 270, pressure: 1012, city: "London" },
      storm: { main: "Thunderstorm", icon: "11d", temp: 19, feels: 18, humidity: 78, wind: 35, windDeg: 90, pressure: 998, city: "Miami" },
      night: { main: "Clear", icon: "01n", temp: 18, feels: 17, humidity: 55, wind: 8, windDeg: 45, pressure: 1015, city: "Tokyo" },
      mist: { main: "Mist", icon: "50d", temp: 8, feels: 6, humidity: 95, wind: 5, windDeg: 160, pressure: 1010, city: "Edinburgh" },
    };
    const cityLower = city.toLowerCase();
    let demo;
    if (cityLower.includes("barcelona") || cityLower.includes("sun")) demo = demos.sunny;
    else if (cityLower.includes("glasgow") || cityLower.includes("rain")) demo = demos.rain;
    else if (cityLower.includes("reykjavik") || cityLower.includes("snow")) demo = demos.snow;
    else if (cityLower.includes("london") || cityLower.includes("cloud")) demo = demos.cloudy;
    else if (cityLower.includes("miami") || cityLower.includes("storm")) demo = demos.storm;
    else if (cityLower.includes("tokyo") || cityLower.includes("night")) demo = demos.night;
    else if (cityLower.includes("edinburgh") || cityLower.includes("mist")) demo = demos.mist;
    else {
      const keys = Object.keys(demos);
      demo = demos[keys[Math.floor(Math.random() * keys.length)]];
      demo = { ...demo, city };
    }

    setWeather({
      name: demo.city, sys: { country: "XX" },
      weather: [{ main: demo.main, description: demo.main.toLowerCase(), icon: demo.icon }],
      main: { temp: demo.temp, feels_like: demo.feels, humidity: demo.humidity, pressure: demo.pressure },
      wind: { speed: demo.wind, deg: demo.windDeg },
    });

    const conditions = ["Clear", "Clouds", "Rain", "Snow", "Drizzle"];
    const icons = ["01d", "04d", "09d", "13d", "10d"];

    setHourly(Array.from({ length: 5 }).map((_, i) => ({
      dt: Math.floor(Date.now() / 1000) + (i + 1) * 3600,
      main: { temp: demo.temp + Math.round((Math.random() - 0.5) * 4) },
      weather: [{ main: demo.main, icon: demo.icon }],
    })));

    setForecast(Array.from({ length: 5 }).map((_, i) => ({
      dt: Math.floor(Date.now() / 1000) + (i + 1) * 86400,
      main: { temp: demo.temp + Math.round((Math.random() - 0.5) * 8) },
      weather: [{ main: conditions[i % conditions.length], icon: icons[i % icons.length] }],
    })));

    setThemeKey(getThemeKey(demo.main, demo.icon));
    setLoading(false); setError("");
  }, []);

  const fetchWeather = useCallback(async (city) => {
    setLoading(true); setError("");
    setLastCity(city);
    if (API_KEY) {
      try {
        const res = await fetch(`https://api.openweathermap.org/data/2.5/weather?q=${encodeURIComponent(city)}&units=metric&appid=${API_KEY}`);
        if (!res.ok) throw new Error("Location not found");
        const data = await res.json();
        setWeather(data);
        setThemeKey(getThemeKey(data.weather[0].main, data.weather[0].icon));
        const foreRes = await fetch(`https://api.openweathermap.org/data/2.5/forecast?q=${encodeURIComponent(city)}&units=metric&appid=${API_KEY}`);
        if (foreRes.ok) {
          const foreData = await foreRes.json();
          setHourly(foreData.list.slice(0, 5));
          setForecast(foreData.list.filter((item) => item.dt_txt.includes("12:00:00")).slice(0, 5));
        }
        setLoading(false);
        return;
      } catch (err) {
        // API failed — fall back to demo data
      }
    }
    loadDemoData(city);
  }, [loadDemoData]);

  const fetchWeatherByCoords = useCallback(async (lat, lon) => {
    setLoading(true); setError("");
    if (API_KEY) {
      try {
        const res = await fetch(`https://api.openweathermap.org/data/2.5/weather?lat=${lat}&lon=${lon}&units=metric&appid=${API_KEY}`);
        if (!res.ok) throw new Error("Location not found");
        const data = await res.json();
        setWeather(data);
        setLastCity(data.name);
        setThemeKey(getThemeKey(data.weather[0].main, data.weather[0].icon));
        const foreRes = await fetch(`https://api.openweathermap.org/data/2.5/forecast?lat=${lat}&lon=${lon}&units=metric&appid=${API_KEY}`);
        if (foreRes.ok) {
          const foreData = await foreRes.json();
          setHourly(foreData.list.slice(0, 5));
          setForecast(foreData.list.filter((item) => item.dt_txt.includes("12:00:00")).slice(0, 5));
        }
        setLoading(false);
        return;
      } catch (err) {
        // API failed — fall back
      }
    }
    loadDemoData("Edinburgh");
  }, [loadDemoData]);

  useEffect(() => {
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        (pos) => fetchWeatherByCoords(pos.coords.latitude, pos.coords.longitude),
        () => fetchWeather("Edinburgh")
      );
    } else {
      fetchWeather("Edinburgh");
    }
  }, []);

  return (
    <>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Inter:wght@400;700;900&display=swap');
        * { margin: 0; padding: 0; box-sizing: border-box; }
        html, body { height: 100%; overflow: auto; -webkit-overflow-scrolling: touch; }
        ::placeholder { color: #999999; font-family: 'Inter', sans-serif; font-weight: 600; }

        .temp-hero { font-size: min(100px, 18vw); }
        .temp-unit { font-size: min(32px, 6vw); }
        .weather-icon-hero { width: min(100px, 18vw); height: min(100px, 18vw); }

        .data-grid { display: grid; grid-template-columns: 1fr 1fr; gap: 12px; width: 100%; }
        .forecast-row { display: flex; gap: 12px; overflow-x: auto; -webkit-overflow-scrolling: touch; }
        .section-label { font-size: 11px; font-family: 'Inter', sans-serif; font-weight: 700; color: #000000; margin-bottom: 10px; padding-left: 2px; }
        .header-text { font-size: 36px; }
        .city-name { font-size: 36px; }
        .badge-text { font-size: 11px; }
        .content-wrap { max-width: 480px; gap: 24px; }
        .outer-wrap { padding: 24px 16px 60px; }

        .main-layout { display: flex; flex-direction: column; gap: 24px; width: 100%; }
        .main-left { display: flex; flex-direction: column; gap: 24px; width: 100%; }
        .main-mid { display: flex; flex-direction: column; gap: 24px; width: 100%; }
        .main-right { display: flex; flex-direction: column; gap: 24px; width: 100%; }

        @media (min-width: 768px) {
          .temp-hero { font-size: 140px !important; }
          .temp-unit { font-size: 44px !important; }
          .weather-icon-hero { width: 140px !important; height: 140px !important; }
          .data-grid { grid-template-columns: repeat(4, 1fr); gap: 16px; }
          .forecast-row { gap: 16px; overflow-x: visible; }
          .section-label { font-size: 14px; }
          .header-text { font-size: 48px; }
          .city-name { font-size: 48px; }
          .badge-text { font-size: 13px; }
          .content-wrap { max-width: 900px; gap: 32px; }
          .outer-wrap { padding: 48px 32px 80px; }
        }

        @media (min-width: 1200px) {
          .temp-hero { font-size: 160px !important; }
          .temp-unit { font-size: 50px !important; }
          .weather-icon-hero { width: 160px !important; height: 160px !important; }
          .data-grid { grid-template-columns: 1fr 1fr; gap: 16px; }
          .section-label { font-size: 16px; }
          .header-text { font-size: 56px; }
          .city-name { font-size: 64px; }
          .badge-text { font-size: 14px; }
          .content-wrap { max-width: 1600px; gap: 40px; }
          .outer-wrap { padding: 60px 48px 100px; }

          .main-layout { flex-direction: row; gap: 40px; align-items: stretch; }
          .main-left { flex: 5; display: flex; flex-direction: column; gap: 24px; }
          .main-mid { flex: 2; display: flex; flex-direction: column; }
          .main-right { flex: 2; display: flex; flex-direction: column; }
          .main-mid > div, .main-right > div { flex: 1; display: flex; flex-direction: column; }
          .main-mid .forecast-row, .main-right .forecast-row { flex: 1; }
          .main-mid .forecast-row > *, .main-right .forecast-row > * { flex: 1; min-height: 0; }
          .forecast-row { flex-direction: column; gap: 12px; overflow-x: visible; }
          .data-grid { grid-template-columns: 1fr 1fr; gap: 16px; flex: 1; display: grid; }
          .data-grid > * { min-height: 0; }
          .data-card-value { font-size: 56px !important; }
          .data-card-label { font-size: 20px !important; }
          .data-card-unit { font-size: 20px !important; }
          .wind-compass { font-size: 28px !important; }
          .wind-arrow { width: 36px !important; height: 36px !important; }
        }

        @keyframes pulse { 0%, 100% { opacity: 1; } 50% { opacity: 0.4; } }
        @keyframes fadeSlideIn { from { opacity: 0; transform: translateY(16px); } to { opacity: 1; transform: translateY(0); } }
      `}</style>

      <div className="outer-wrap" style={{
        minHeight: "100%", width: "100%", background: theme.gradient,
        display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "flex-start",
        position: "relative",
      }}>
        <GridOverlay theme={theme} />
        <ScanLines theme={theme} />
        <Particles theme={theme} weatherKey={themeKey} />

        <div className="content-wrap" style={{
          position: "relative", zIndex: 4, display: "flex", flexDirection: "column",
          alignItems: "flex-start", width: "100%",
        }}>
          {loading && (
            <div style={{
              color: theme.accent, fontSize: "10px",
              fontFamily: "'Inter', sans-serif", fontWeight: 700,
              animation: "pulse 1s ease infinite",
            }}>Scanning atmospheric data...</div>
          )}

          {error && (
            <div style={{
              color: "#E85454", fontSize: "10px",
              fontFamily: "'Inter', sans-serif", fontWeight: 700,
            }}>⚠ Error: {error}</div>
          )}

          {weather && !loading && (
            <div style={{
              width: "100%", animation: "fadeSlideIn 0.6s ease",
            }}>
              <div className="main-layout">
                <div className="main-left" style={{ display: "flex", flexDirection: "column", gap: "24px" }}>
                  <StatusBar theme={theme} />
                  <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start" }}>
                    <div>
                      <h1 className="city-name" style={{
                        fontWeight: 700, color: theme.text,
                        fontFamily: "'Inter', sans-serif",
                        lineHeight: 1.1,
                      }}>{weather.name}</h1>
                    </div>
                    <div style={{ display: "flex", alignItems: "center", gap: "8px", flexShrink: 0 }}>
                      <UnitsToggle units={units} onToggle={setUnits} />
                      <SearchInput onSearch={fetchWeather} theme={theme} />
                    </div>
                  </div>

                  <div style={{ display: "flex", alignItems: "center", gap: "12px" }}>
                    <div className="temp-hero" style={{
                      fontWeight: 700, color: theme.text,
                      lineHeight: 0.85, letterSpacing: "-0.02em",
                      fontFamily: "'Inter', sans-serif",
                    }}>
                      {displayTemp(weather.main.temp)}
                      <span className="temp-unit" style={{
                        fontWeight: 400, verticalAlign: "super",
                        marginLeft: "2px", color: "#999999",
                      }}>{tempUnit}</span>
                    </div>
                    <div className="weather-icon-hero" style={{ flexShrink: 0 }}>
                      <WeatherIcon type={themeKey} size="100%" color="#000000" />
                    </div>
                  </div>

                  <div style={{
                    display: "flex", alignItems: "center", justifyContent: "flex-start",
                    gap: "8px", flexWrap: "wrap",
                  }}>
                    <ConditionBadge label={WEATHER_LABELS[themeKey] || "Unknown"} />
                    {getWarnings(weather).map((w, i) => <WarningBadge key={i} label={w} />)}
                  </div>

                  <div className="data-grid">
                    <DataReadout label="Feels Like" value={`${displayTemp(weather.main.feels_like)}°`} variant="accent" />
                    <DataReadout label="Humidity" value={weather.main.humidity} unit="%" variant="accent" />
                    <WindReadout speed={displayWind(weather.wind.speed)} deg={weather.wind.deg} unit={windUnit} variant="accent" />
                    <DataReadout label="Pressure" value={displayPressure(weather.main.pressure)} unit={pressureUnit} variant="accent" />
                  </div>
                </div>

                <div className="main-mid">
                  {hourly && hourly.length > 0 && (
                    <div style={{ width: "100%" }}>
                      <div className="section-label">Upcoming</div>
                      <div className="forecast-row">
                        {hourly.map((entry, i) => <HourlyBlock key={i} entry={entry} displayTemp={displayTemp} />)}
                      </div>
                    </div>
                  )}
                </div>

                <div className="main-right">
                  {forecast && forecast.length > 0 && (
                    <div style={{ width: "100%" }}>
                      <div className="section-label">5-Day Forecast</div>
                      <div className="forecast-row">
                        {forecast.map((day, i) => <ForecastDay key={i} day={day} theme={theme} displayTemp={displayTemp} />)}
                      </div>
                    </div>
                  )}
                </div>
              </div>

              {!API_KEY && (
                <div style={{
                  fontSize: "11px", fontFamily: "'Inter', sans-serif", fontWeight: 700,
                  color: "#999999", textAlign: "left",
                  lineHeight: 1.7, marginTop: "4px",
                }}>
                  Demo mode — try: Edinburgh / Barcelona / Glasgow / Miami / Tokyo / Reykjavik
                  <br />Add OpenWeatherMap API key for live data
                </div>
              )}
            </div>
          )}
        </div>
      </div>
    </>
  );
}
