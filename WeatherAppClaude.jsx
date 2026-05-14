import { useState, useEffect } from "react";

const API_KEY = "9d4c7d0e54e448cafa6fdb26ee891b96";
const BASE_URL = "https://api.openweathermap.org/data/2.5";

const weatherIcons = {
  Clear: "☀️",
  Clouds: "☁️",
  Rain: "🌧️",
  Drizzle: "🌦️",
  Thunderstorm: "⛈️",
  Snow: "❄️",
  Mist: "🌫️",
  Fog: "🌫️",
  Haze: "🌫️",
};

const weatherBg = {
  Clear: { from: "#f97316", to: "#fbbf24", accent: "#fff7ed" },
  Clouds: { from: "#64748b", to: "#94a3b8", accent: "#f1f5f9" },
  Rain: { from: "#1e3a5f", to: "#3b82f6", accent: "#eff6ff" },
  Drizzle: { from: "#1e40af", to: "#60a5fa", accent: "#dbeafe" },
  Thunderstorm: { from: "#1e1b4b", to: "#4c1d95", accent: "#ede9fe" },
  Snow: { from: "#bae6fd", to: "#e0f2fe", accent: "#f0f9ff" },
  Mist: { from: "#475569", to: "#94a3b8", accent: "#f8fafc" },
  default: { from: "#0f172a", to: "#1e40af", accent: "#dbeafe" },
};

const weekDays = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"];
const months = [
  "Jan",
  "Feb",
  "Mar",
  "Apr",
  "May",
  "Jun",
  "Jul",
  "Aug",
  "Sep",
  "Oct",
  "Nov",
  "Dec",
];

function formatTime(unix) {
  const d = new Date(unix * 1000);
  let h = d.getHours(),
    m = d.getMinutes();
  const ampm = h >= 12 ? "PM" : "AM";
  h = h % 12 || 12;
  return `${h}:${m.toString().padStart(2, "0")} ${ampm}`;
}

function getTodayLabel() {
  const d = new Date();
  return `${weekDays[d.getDay()]}, ${d.getDate()} ${
    months[d.getMonth()]
  } ${d.getFullYear()}`;
}

export default function Lander() {
  const [city, setCity] = useState("");
  const [inputVal, setInputVal] = useState("");
  const [weather, setWeather] = useState(null);
  const [forecast, setForecast] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [unit, setUnit] = useState("metric");

  const condition = weather?.weather?.[0]?.main || "default";
  const bg = weatherBg[condition] || weatherBg.default;
  const icon = weatherIcons[condition] || "🌡️";
  const tempUnit = unit === "metric" ? "°C" : "°F";

  async function fetchWeather(q) {
    if (!q.trim()) return;
    setLoading(true);
    setError("");
    try {
      const [curr, fore] = await Promise.all([
        fetch(
          `${BASE_URL}/weather?q=${encodeURIComponent(
            q,
          )}&appid=${API_KEY}&units=${unit}`,
        ).then((r) => r.json()),
        fetch(
          `${BASE_URL}/forecast?q=${encodeURIComponent(
            q,
          )}&appid=${API_KEY}&units=${unit}`,
        ).then((r) => r.json()),
      ]);
      if (curr.cod !== 200) throw new Error(curr.message || "City not found");
      setWeather(curr);
      const daily = {};
      fore.list?.forEach((item) => {
        const d = new Date(item.dt * 1000);
        const key = `${d.getFullYear()}-${d.getMonth()}-${d.getDate()}`;
        if (!daily[key]) daily[key] = { ...item, day: weekDays[d.getDay()] };
      });
      setForecast(Object.values(daily).slice(1, 6));
    } catch (e) {
      setError(e.message || "Something went wrong");
      setWeather(null);
      setForecast([]);
    } finally {
      setLoading(false);
    }
  }

  function handleSearch(e) {
    e.preventDefault();
    setCity(inputVal);
    fetchWeather(inputVal);
  }

  useEffect(() => {
    if (city) fetchWeather(city);
  }, [unit]);

  const styles = {
    app: {
      minHeight: "100vh",
      background: weather
        ? `linear-gradient(135deg, ${bg.from} 0%, ${bg.to} 100%)`
        : "linear-gradient(135deg, #0f172a 0%, #1e3a8a 100%)",
      fontFamily: "'DM Sans', sans-serif",
      display: "flex",
      flexDirection: "column",
      alignItems: "center",
      justifyContent: "flex-start",
      padding: "0 16px 48px",
      transition: "background 1.2s ease",
      position: "relative",
      overflow: "hidden",
    },
    bgCircle1: {
      position: "absolute",
      top: "-120px",
      right: "-120px",
      width: "400px",
      height: "400px",
      borderRadius: "50%",
      background: "rgba(255,255,255,0.06)",
      pointerEvents: "none",
    },
    bgCircle2: {
      position: "absolute",
      bottom: "-80px",
      left: "-80px",
      width: "300px",
      height: "300px",
      borderRadius: "50%",
      background: "rgba(255,255,255,0.04)",
      pointerEvents: "none",
    },
    header: {
      width: "100%",
      maxWidth: "680px",
      display: "flex",
      justifyContent: "space-between",
      alignItems: "center",
      padding: "28px 0 0",
    },
    logo: {
      fontSize: "22px",
      fontWeight: "700",
      color: "#fff",
      letterSpacing: "-0.5px",
    },
    logoSpan: { color: "rgba(255,255,255,0.55)" },
    unitToggle: {
      display: "flex",
      gap: "4px",
      background: "rgba(255,255,255,0.12)",
      borderRadius: "40px",
      padding: "4px",
    },
    unitBtn: (active) => ({
      border: "none",
      cursor: "pointer",
      background: active ? "rgba(255,255,255,0.9)" : "transparent",
      color: active ? "#0f172a" : "rgba(255,255,255,0.7)",
      fontWeight: active ? "700" : "500",
      fontSize: "13px",
      borderRadius: "40px",
      padding: "5px 14px",
      transition: "all 0.2s",
    }),
    searchWrap: {
      width: "100%",
      maxWidth: "680px",
      marginTop: "36px",
      display: "flex",
      gap: "10px",
    },
    input: {
      flex: 1,
      padding: "14px 20px",
      fontSize: "15px",
      fontFamily: "inherit",
      background: "rgba(255,255,255,0.15)",
      border: "1px solid rgba(255,255,255,0.25)",
      borderRadius: "14px",
      color: "#fff",
      outline: "none",
      backdropFilter: "blur(8px)",
      transition: "border 0.2s",
    },
    searchBtn: {
      padding: "14px 26px",
      background: "rgba(255,255,255,0.92)",
      border: "none",
      borderRadius: "14px",
      fontWeight: "700",
      fontSize: "14px",
      color: "#0f172a",
      cursor: "pointer",
      fontFamily: "inherit",
      transition: "transform 0.15s, opacity 0.15s",
    },
    error: {
      width: "100%",
      maxWidth: "680px",
      marginTop: "16px",
      padding: "14px 20px",
      background: "rgba(239,68,68,0.25)",
      borderRadius: "12px",
      border: "1px solid rgba(239,68,68,0.4)",
      color: "#fecaca",
      fontSize: "14px",
    },
    mainCard: {
      width: "100%",
      maxWidth: "680px",
      marginTop: "24px",
      background: "rgba(255,255,255,0.12)",
      backdropFilter: "blur(24px)",
      borderRadius: "28px",
      border: "1px solid rgba(255,255,255,0.2)",
      padding: "36px",
    },
    topRow: {
      display: "flex",
      justifyContent: "space-between",
      alignItems: "flex-start",
    },
    cityName: {
      fontSize: "32px",
      fontWeight: "700",
      color: "#fff",
      lineHeight: 1.1,
      margin: "0 0 6px",
    },
    dateStr: {
      fontSize: "14px",
      color: "rgba(255,255,255,0.6)",
      fontWeight: "400",
    },
    iconBig: {
      fontSize: "72px",
      lineHeight: 1,
    },
    tempBig: {
      fontSize: "96px",
      fontWeight: "800",
      color: "#fff",
      letterSpacing: "-4px",
      lineHeight: 1,
      marginTop: "8px",
    },
    conditionLabel: {
      fontSize: "20px",
      color: "rgba(255,255,255,0.8)",
      fontWeight: "500",
      marginTop: "4px",
    },
    feelsLike: {
      fontSize: "14px",
      color: "rgba(255,255,255,0.55)",
      marginTop: "4px",
    },
    divider: {
      height: "1px",
      background: "rgba(255,255,255,0.15)",
      margin: "28px 0",
    },
    statsGrid: {
      display: "grid",
      gridTemplateColumns: "repeat(4,1fr)",
      gap: "16px",
    },
    statCard: {
      background: "rgba(255,255,255,0.1)",
      borderRadius: "16px",
      padding: "16px",
      textAlign: "center",
    },
    statLabel: {
      fontSize: "11px",
      fontWeight: "600",
      color: "rgba(255,255,255,0.5)",
      textTransform: "uppercase",
      letterSpacing: "0.8px",
      marginBottom: "8px",
    },
    statValue: {
      fontSize: "20px",
      fontWeight: "700",
      color: "#fff",
    },
    statSub: {
      fontSize: "12px",
      color: "rgba(255,255,255,0.5)",
      marginTop: "2px",
    },
    forecastSection: {
      width: "100%",
      maxWidth: "680px",
      marginTop: "16px",
      background: "rgba(255,255,255,0.10)",
      backdropFilter: "blur(16px)",
      borderRadius: "24px",
      border: "1px solid rgba(255,255,255,0.18)",
      padding: "24px 28px",
    },
    forecastTitle: {
      fontSize: "12px",
      fontWeight: "600",
      color: "rgba(255,255,255,0.5)",
      textTransform: "uppercase",
      letterSpacing: "1px",
      marginBottom: "20px",
    },
    forecastRow: {
      display: "flex",
      justifyContent: "space-between",
      alignItems: "center",
      gap: "8px",
    },
    forecastDay: {
      display: "flex",
      flexDirection: "column",
      alignItems: "center",
      gap: "8px",
      flex: 1,
    },
    forecastDayLabel: {
      fontSize: "13px",
      fontWeight: "600",
      color: "rgba(255,255,255,0.65)",
    },
    forecastEmoji: { fontSize: "28px", lineHeight: 1 },
    forecastTemp: {
      fontSize: "17px",
      fontWeight: "700",
      color: "#fff",
    },
    hero: {
      width: "100%",
      maxWidth: "680px",
      marginTop: "80px",
      textAlign: "center",
      padding: "0 20px",
    },
    heroTitle: {
      fontSize: "48px",
      fontWeight: "800",
      color: "#fff",
      letterSpacing: "-1.5px",
      lineHeight: 1.1,
      margin: "0 0 16px",
    },
    heroSub: {
      fontSize: "17px",
      color: "rgba(255,255,255,0.6)",
      maxWidth: "420px",
      margin: "0 auto 36px",
      lineHeight: 1.6,
    },
    heroHint: {
      display: "inline-flex",
      alignItems: "center",
      gap: "8px",
      background: "rgba(255,255,255,0.1)",
      borderRadius: "40px",
      padding: "8px 18px",
      fontSize: "13px",
      color: "rgba(255,255,255,0.7)",
    },
    dot: {
      width: "7px",
      height: "7px",
      borderRadius: "50%",
      background: "#4ade80",
      boxShadow: "0 0 0 3px rgba(74,222,128,0.25)",
    },
  };

  return (
    <div style={styles.app}>
      <link
        href="https://fonts.googleapis.com/css2?family=DM+Sans:wght@400;500;600;700;800&display=swap"
        rel="stylesheet"
      />
      <div style={styles.bgCircle1} />
      <div style={styles.bgCircle2} />

      <header style={styles.header}>
        <div style={styles.logo}>
          sky<span style={styles.logoSpan}>cast</span>
        </div>
        <div style={styles.unitToggle}>
          <button
            style={styles.unitBtn(unit === "metric")}
            onClick={() => setUnit("metric")}
          >
            °C
          </button>
          <button
            style={styles.unitBtn(unit === "imperial")}
            onClick={() => setUnit("imperial")}
          >
            °F
          </button>
        </div>
      </header>

      <form style={styles.searchWrap} onSubmit={handleSearch}>
        <input
          style={styles.input}
          placeholder="Search city — London, Tokyo, New York…"
          value={inputVal}
          onChange={(e) => setInputVal(e.target.value)}
          spellCheck={false}
        />
        <button type="submit" style={styles.searchBtn}>
          {loading ? "…" : "Search"}
        </button>
      </form>

      {error && <div style={styles.error}>⚠ {error}</div>}

      {!weather && !loading && (
        <div style={styles.hero}>
          <div style={{ fontSize: "80px", marginBottom: "24px" }}>🌤️</div>
          <h1 style={styles.heroTitle}>
            Real-time weather,
            <br />
            beautifully simple.
          </h1>
          <p style={styles.heroSub}>
            Search any city to get live temperature, humidity, wind speed, and a
            5-day forecast — all in one glance.
          </p>
          <span style={styles.heroHint}>
            <span style={styles.dot} />
            Powered by OpenWeather API
          </span>
        </div>
      )}

      {weather && (
        <>
          <div style={styles.mainCard}>
            <div style={styles.topRow}>
              <div>
                <h1 style={styles.cityName}>
                  {weather.name}, {weather.sys?.country}
                </h1>
                <div style={styles.dateStr}>{getTodayLabel()}</div>
              </div>
              <div style={styles.iconBig}>{icon}</div>
            </div>

            <div style={styles.tempBig}>
              {Math.round(weather.main?.temp)}
              {tempUnit}
            </div>
            <div style={styles.conditionLabel}>
              {weather.weather?.[0]?.description?.charAt(0).toUpperCase()}
              {weather.weather?.[0]?.description?.slice(1)}
            </div>
            <div style={styles.feelsLike}>
              Feels like {Math.round(weather.main?.feels_like)}
              {tempUnit}
              &nbsp;·&nbsp; High {Math.round(weather.main?.temp_max)}
              {tempUnit}
              &nbsp;·&nbsp; Low {Math.round(weather.main?.temp_min)}
              {tempUnit}
            </div>

            <div style={styles.divider} />

            <div style={styles.statsGrid}>
              {[
                {
                  label: "Humidity",
                  value: `${weather.main?.humidity}%`,
                  sub: "relative",
                },
                {
                  label: "Wind",
                  value: `${Math.round(weather.wind?.speed)} ${
                    unit === "metric" ? "m/s" : "mph"
                  }`,
                  sub: `dir ${weather.wind?.deg}°`,
                },
                {
                  label: "Visibility",
                  value: `${((weather.visibility || 0) / 1000).toFixed(1)} km`,
                  sub: "range",
                },
                {
                  label: "Sunrise",
                  value: formatTime(weather.sys?.sunrise),
                  sub: `set ${formatTime(weather.sys?.sunset)}`,
                },
              ].map((s) => (
                <div key={s.label} style={styles.statCard}>
                  <div style={styles.statLabel}>{s.label}</div>
                  <div style={styles.statValue}>{s.value}</div>
                  <div style={styles.statSub}>{s.sub}</div>
                </div>
              ))}
            </div>
          </div>

          {forecast.length > 0 && (
            <div style={styles.forecastSection}>
              <div style={styles.forecastTitle}>5-day forecast</div>
              <div style={styles.forecastRow}>
                {forecast.map((f, i) => (
                  <div key={i} style={styles.forecastDay}>
                    <div style={styles.forecastDayLabel}>{f.day}</div>
                    <div style={styles.forecastEmoji}>
                      {weatherIcons[f.weather?.[0]?.main] || "🌡️"}
                    </div>
                    <div style={styles.forecastTemp}>
                      {Math.round(f.main?.temp)}
                      {tempUnit}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}
        </>
      )}
    </div>
  );
}
