const TOKYO_LAT = 35.6762;
const TOKYO_LON = 139.6503;
const GOOGLE_PLACES_API_KEY = import.meta.env.VITE_GOOGLE_PLACES_API_KEY;

function getPlacesHeaders(fieldMask) {
  if (!GOOGLE_PLACES_API_KEY) {
    throw new Error(
      "Missing Google Places API key. Add VITE_GOOGLE_PLACES_API_KEY to .env.local."
    );
  }

  return {
    "Content-Type": "application/json",
    "X-Goog-Api-Key": GOOGLE_PLACES_API_KEY,
    "X-Goog-FieldMask": fieldMask,
  };
}

async function handleJsonResponse(response) {
  const data = await response.json();

  if (!response.ok) {
    throw new Error(data?.error?.message || "Request failed.");
  }

  return data;
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

export async function searchTokyoRestaurants(searchTerm) {
  const cleanedQuery = searchTerm.trim();
  const textQuery = cleanedQuery
    ? `${cleanedQuery} restaurants in Tokyo`
    : "restaurants in Tokyo";

  const response = await fetch(
    "https://places.googleapis.com/v1/places:searchText",
    {
      method: "POST",
      headers: getPlacesHeaders(
        "places.id,places.displayName,places.formattedAddress,places.rating,places.userRatingCount,places.googleMapsUri,places.primaryTypeDisplayName"
      ),
      body: JSON.stringify({
        textQuery,
      }),
    }
  );

  const data = await handleJsonResponse(response);
  return data.places || [];
}

export async function getRestaurantDetails(placeId) {
  const response = await fetch(
    `https://places.googleapis.com/v1/places/${placeId}`,
    {
      method: "GET",
      headers: getPlacesHeaders(
        "id,displayName,formattedAddress,rating,userRatingCount,googleMapsUri,reviews,attributions"
      ),
    }
  );

  return handleJsonResponse(response);
}