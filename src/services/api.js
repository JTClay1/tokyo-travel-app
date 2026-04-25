const TOKYO_LAT = 35.6762;
const TOKYO_LON = 139.6503;
const DEFAULT_RESTAURANT_RADIUS = 4000;
const GEOAPIFY_API_KEY = import.meta.env.VITE_GEOAPIFY_API_KEY;

function ensureGeoapifyKey() {
  // Restaurant/geocoding features depend on Geoapify, so fail fast with a
  // useful message if the env var is missing.
  if (!GEOAPIFY_API_KEY) {
    throw new Error(
      "Missing Geoapify API key. Add VITE_GEOAPIFY_API_KEY to .env.local."
    );
  }
}

export async function getTokyoWeather() {
  // Build the weather request manually so it stays obvious exactly which fields
  // the weather page depends on.
  const url =
    `https://api.open-meteo.com/v1/forecast` +
    `?latitude=${TOKYO_LAT}` +
    `&longitude=${TOKYO_LON}` +
    `&current=temperature_2m,relative_humidity_2m,weather_code,wind_speed_10m` +
    `&hourly=temperature_2m,relative_humidity_2m,weather_code` +
    `&daily=weather_code,temperature_2m_max,temperature_2m_min` +
    `&timezone=Asia%2FTokyo` +
    `&forecast_days=7`;

  const response = await fetch(url);

  if (!response.ok) {
    throw new Error("Failed to fetch weather data.");
  }

  return response.json();
}

export async function geocodeTokyoLocation(locationText) {
  ensureGeoapifyKey();

  const cleanedText = locationText.trim();

  if (!cleanedText) {
    throw new Error("Enter a Tokyo location, address, or zip code.");
  }

  // Geocode user-entered Tokyo areas into lat/lon before the restaurant search
  // runs, so the page can search around a specific neighborhood or address.
  const params = new URLSearchParams({
    text: cleanedText,
    limit: "1",
    format: "json",
    lang: "en",
    filter: "countrycode:jp",
    apiKey: GEOAPIFY_API_KEY,
  });

  const response = await fetch(
    `https://api.geoapify.com/v1/geocode/search?${params.toString()}`
  );
  const data = await response.json();

  if (!response.ok) {
    throw new Error(data?.message || "Failed to look up that location.");
  }

  if (!data.results?.length) {
    throw new Error(
      "No matching Tokyo-area location was found. Try a Tokyo neighborhood, station, address, or zip code."
    );
  }

  const match = data.results[0];

  return {
    latitude: match.lat,
    longitude: match.lon,
    label: match.formatted || cleanedText,
    radius: DEFAULT_RESTAURANT_RADIUS,
  };
}

export async function searchTokyoRestaurants(searchTerm = "", options = {}) {
  ensureGeoapifyKey();

  const {
    latitude = TOKYO_LAT,
    longitude = TOKYO_LON,
    radius = DEFAULT_RESTAURANT_RADIUS,
  } = options;

  // Search center comes from either the default Tokyo area or the user’s
  // geocoded location input.
  const params = new URLSearchParams({
    categories: "catering.restaurant,catering.fast_food,catering.cafe",
    filter: `circle:${longitude},${latitude},${radius}`,
    bias: `proximity:${longitude},${latitude}`,
    limit: "20",
    lang: "en",
    apiKey: GEOAPIFY_API_KEY,
  });

  const cleanedQuery = searchTerm.trim();

  // Only apply the name keyword if the user actually typed one.
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

  // Return just the feature array so page-level code does not need to care
  // about the rest of the raw Geoapify response shape.
  return data.features || [];
}