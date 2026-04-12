import { useEffect, useState } from "react";
import Loading from "../components/Loading";
import ErrorMessage from "../components/ErrorMessage";
import { getTokyoWeather } from "../services/api";

function getWeatherLabel(code) {
  const weatherCodeMap = {
    0: "Clear sky",
    1: "Mainly clear",
    2: "Partly cloudy",
    3: "Overcast",
    45: "Fog",
    48: "Depositing rime fog",
    51: "Light drizzle",
    53: "Moderate drizzle",
    55: "Dense drizzle",
    61: "Slight rain",
    63: "Moderate rain",
    65: "Heavy rain",
    71: "Slight snow",
    73: "Moderate snow",
    75: "Heavy snow",
    80: "Rain showers",
    81: "Moderate rain showers",
    82: "Violent rain showers",
    95: "Thunderstorm",
  };

  return weatherCodeMap[code] || "Unknown conditions";
}

function convertToFahrenheit(celsius) {
  return ((celsius * 9) / 5 + 32).toFixed(1);
}

function formatTemperature(celsius, unit) {
  if (unit === "f") {
    return `${convertToFahrenheit(celsius)}°F`;
  }

  return `${Number(celsius).toFixed(1)}°C`;
}

function Weather() {
  const [weatherData, setWeatherData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [unit, setUnit] = useState("c");

  useEffect(() => {
    async function loadWeather() {
      try {
        const data = await getTokyoWeather();
        setWeatherData(data);
      } catch (err) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    }

    loadWeather();
  }, []);

  if (loading) return <Loading />;
  if (error) return <ErrorMessage message={error} />;

  const current = weatherData.current;
  const daily = weatherData.daily;

  return (
    <section>
      <h2>Tokyo Weather</h2>

      <div className="unit-toggle">
        <button
          className={unit === "c" ? "unit-button active" : "unit-button"}
          onClick={() => setUnit("c")}
        >
          Celsius
        </button>
        <button
          className={unit === "f" ? "unit-button active" : "unit-button"}
          onClick={() => setUnit("f")}
        >
          Fahrenheit
        </button>
      </div>

      <div className="weather-card">
        <h3>Current Conditions</h3>
        <p>Temperature: {formatTemperature(current.temperature_2m, unit)}</p>
        <p>Wind Speed: {current.wind_speed_10m} km/h</p>
        <p>Conditions: {getWeatherLabel(current.weather_code)}</p>
      </div>

      <div className="forecast-section">
        <h3>5-Day Forecast</h3>
        <div className="forecast-grid">
          {daily.time.map((day, index) => (
            <div key={day} className="forecast-card">
              <p>
                <strong>{day}</strong>
              </p>
              <p>High: {formatTemperature(daily.temperature_2m_max[index], unit)}</p>
              <p>Low: {formatTemperature(daily.temperature_2m_min[index], unit)}</p>
              <p>{getWeatherLabel(daily.weather_code[index])}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

export default Weather;