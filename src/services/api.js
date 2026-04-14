const TOKYO_LAT = 35.6762;
const TOKYO_LON = 139.6503;
const GEOAPIFY_API_KEY = import.meta.env.VITE_GEOAPIFY_API_KEY;

const TOKYO_AREA_FILTERS = {
  all: `circle:${TOKYO_LON},${TOKYO_LAT},18000`,
  shibuya: "circle:139.7005,35.6595,1800",
  shinjuku: "circle:139.7034,35.6938,1800",
  asakusa: "circle:139.7967,35.7148,1500",
  ginza: "circle:139.7650,35.6717,1500",
  ueno: "circle:139.7772,35.7138,1500",
  akihabara: "circle:139.7730,35.6984,1500",
  harajuku: "circle:139.7027,35.6702,1400",
  roppongi: "circle:139.7314,35.6628,1500",
  ikebukuro: "circle:139.7109,35.7295,1700",
  tokyo_station: "circle:139.7671,35.6812,1600",
};

function ensureGeoapifyKey() {
  if (!GEOAPIFY_API_KEY) {
    throw new Error(
      "Missing Geoapify API key. Add VITE_GEOAPIFY_API_KEY to .env.local."
    );
  }
}

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

export async function searchTokyoRestaurants(searchTerm = "", areaKey = "all") {
  ensureGeoapifyKey();

  const params = new URLSearchParams({
    categories: "catering.restaurant,catering.fast_food,catering.cafe",
    filter: TOKYO_AREA_FILTERS[areaKey] || TOKYO_AREA_FILTERS.all,
    bias: `proximity:${TOKYO_LON},${TOKYO_LAT}`,
    limit: "20",
    lang: "en",
    apiKey: GEOAPIFY_API_KEY,
  });

  const cleanedQuery = searchTerm.trim();

  if (cleanedQuery) {
    params.set("name", cleanedQuery);
  }

  const response = await fetch(
    `https://api.geoapify.com/v2/places?${params.toString()}`
  );
  const data = await response.json();

  if (!response.ok) {
    throw new Error(data?.message || "Failed to fetch restaurant data.");
  }

  return data.features || [];
}