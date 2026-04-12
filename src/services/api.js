const TOKYO_LAT = 35.6762;
const TOKYO_LON = 139.6503;

export async function getTokyoWeather() {
  const url =
    `https://api.open-meteo.com/v1/forecast` +
    `?latitude=${TOKYO_LAT}` +
    `&longitude=${TOKYO_LON}` +
    `&current=temperature_2m,weather_code,wind_speed_10m` +
    `&daily=weather_code,temperature_2m_max,temperature_2m_min` +
    `&timezone=Asia%2FTokyo` +
    `&forecast_days=5`;

  const response = await fetch(url);

  if (!response.ok) {
    throw new Error("Failed to fetch weather data.");
  }

  return response.json();
}