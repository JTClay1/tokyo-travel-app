import { useEffect, useState } from "react";
import Loading from "../components/Loading";
import ErrorMessage from "../components/ErrorMessage";
import { getTokyoWeather } from "../services/api";
import SeasonalClimateTable from "../components/SeasonalClimateTable";

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
    56: "Freezing drizzle",
    57: "Dense freezing drizzle",
    61: "Slight rain",
    63: "Moderate rain",
    65: "Heavy rain",
    66: "Freezing rain",
    67: "Heavy freezing rain",
    71: "Slight snow",
    73: "Moderate snow",
    75: "Heavy snow",
    77: "Snow grains",
    80: "Rain showers",
    81: "Moderate rain showers",
    82: "Violent rain showers",
    85: "Snow showers",
    86: "Heavy snow showers",
    95: "Thunderstorm",
    96: "Thunderstorm with hail",
    99: "Heavy thunderstorm with hail",
  };

  return weatherCodeMap[code] || "Unknown conditions";
}

function getWeatherIcon(code) {
  if ([0, 1].includes(code)) return "☀️";
  if (code === 2) return "⛅";
  if (code === 3) return "☁️";
  if ([45, 48].includes(code)) return "🌫️";
  if ([51, 53, 55, 56, 57].includes(code)) return "🌦️";
  if ([61, 63, 65, 66, 67, 80, 81, 82].includes(code)) return "🌧️";
  if ([71, 73, 75, 77, 85, 86].includes(code)) return "❄️";
  if ([95, 96, 99].includes(code)) return "⛈️";

  return "🌤️";
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

function formatHumidity(value) {
  return value == null ? "N/A" : `${value}%`;
}

function formatForecastDate(dateString) {
  const [year, month, day] = dateString.split("-").map(Number);
  const date = new Date(year, month - 1, day);

  return date.toLocaleDateString("en-US", {
    weekday: "short",
    month: "short",
    day: "numeric",
  });
}

function formatHourlyTime(timestamp) {
  const date = new Date(timestamp);

  return date.toLocaleTimeString("en-US", {
    hour: "numeric",
    minute: "2-digit",
    hour12: true,
  });
}

function buildDailyHumidityMap(hourly) {
  if (!hourly?.time || !hourly?.relative_humidity_2m) {
    return {};
  }

  const groupedHumidity = {};

  hourly.time.forEach((timestamp, index) => {
    const dayKey = timestamp.split("T")[0];

    if (!groupedHumidity[dayKey]) {
      groupedHumidity[dayKey] = [];
    }

    groupedHumidity[dayKey].push(hourly.relative_humidity_2m[index]);
  });

  const averagedHumidity = {};

  Object.keys(groupedHumidity).forEach((dayKey) => {
    const values = groupedHumidity[dayKey];
    const average =
      values.reduce((sum, value) => sum + value, 0) / values.length;

    averagedHumidity[dayKey] = Math.round(average);
  });

  return averagedHumidity;
}

function buildHourlyForecastMap(hourly) {
  if (
    !hourly?.time ||
    !hourly?.temperature_2m ||
    !hourly?.relative_humidity_2m ||
    !hourly?.weather_code
  ) {
    return {};
  }

  const groupedByDay = {};

  hourly.time.forEach((timestamp, index) => {
    const dayKey = timestamp.split("T")[0];

    if (!groupedByDay[dayKey]) {
      groupedByDay[dayKey] = [];
    }

    groupedByDay[dayKey].push({
      timestamp,
      temperature: hourly.temperature_2m[index],
      humidity: hourly.relative_humidity_2m[index],
      weatherCode: hourly.weather_code[index],
    });
  });

  return groupedByDay;
}

function Weather() {
  const [weatherData, setWeatherData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [unit, setUnit] = useState("c");
  const [expandedDay, setExpandedDay] = useState(null);

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

  if (loading) return <Loading message="Fetching Tokyo weather..." />;
  if (error) return <ErrorMessage message={error} />;
  if (!weatherData) return <ErrorMessage message="Weather data is unavailable." />;

  const current = weatherData.current;
  const daily = weatherData.daily;
  const dailyHumidityMap = buildDailyHumidityMap(weatherData.hourly);
  const hourlyForecastMap = buildHourlyForecastMap(weatherData.hourly);

  function handleToggleDay(day) {
    setExpandedDay((currentExpandedDay) =>
      currentExpandedDay === day ? null : day
    );
  }

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

        <div className="current-condition">
          <span className="current-weather-icon" aria-hidden="true">
            {getWeatherIcon(current.weather_code)}
          </span>
          <p>
            <strong>{getWeatherLabel(current.weather_code)}</strong>
          </p>
        </div>

        <div className="weather-details">
          <p>Temperature: {formatTemperature(current.temperature_2m, unit)}</p>
          <p>Humidity: {formatHumidity(current.relative_humidity_2m)}</p>
          <p>Wind Speed: {current.wind_speed_10m} km/h</p>
        </div>
      </div>

      <div className="forecast-section">
        <h3>7-Day Forecast</h3>

        <div className="forecast-grid">
          {daily.time.map((day, index) => {
            const isExpanded = expandedDay === day;
            const hourlyEntries = hourlyForecastMap[day] || [];

            return (
              <div
                key={day}
                className={
                  isExpanded
                    ? "forecast-card forecast-card-expanded"
                    : "forecast-card"
                }
              >
                <p className="forecast-date">
                  <strong>{formatForecastDate(day)}</strong>
                </p>

                <div className="forecast-condition">
                  <span className="forecast-icon" aria-hidden="true">
                    {getWeatherIcon(daily.weather_code[index])}
                  </span>
                  <span>{getWeatherLabel(daily.weather_code[index])}</span>
                </div>

                <p>
                  High: {formatTemperature(daily.temperature_2m_max[index], unit)}
                </p>
                <p>
                  Low: {formatTemperature(daily.temperature_2m_min[index], unit)}
                </p>
                <p>Avg Humidity: {formatHumidity(dailyHumidityMap[day])}</p>

                <button
                  type="button"
                  className="forecast-toggle-button"
                  onClick={() => handleToggleDay(day)}
                >
                  {isExpanded ? "Hide Hourly Forecast" : "Show Hourly Forecast"}
                </button>

                {isExpanded ? (
                  <div className="hourly-forecast-list">
                    {hourlyEntries.map((entry) => (
                      <div
                        key={entry.timestamp}
                        className="hourly-forecast-row"
                      >
                        <span className="hourly-time">
                          {formatHourlyTime(entry.timestamp)}
                        </span>
                        <span className="hourly-condition">
                          {getWeatherIcon(entry.weatherCode)}{" "}
                          {getWeatherLabel(entry.weatherCode)}
                        </span>
                        <span className="hourly-temp">
                          {formatTemperature(entry.temperature, unit)}
                        </span>
                        <span className="hourly-humidity">
                          {formatHumidity(entry.humidity)}
                        </span>
                      </div>
                    ))}
                  </div>
                ) : null}
              </div>
            );
          })}
        </div>
      </div>

      <SeasonalClimateTable />
    </section>
  );
}

export default Weather;