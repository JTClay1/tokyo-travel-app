import { useCallback, useEffect, useMemo, useState } from "react";
import Loading from "../components/Loading";
import ErrorMessage from "../components/ErrorMessage";
import {
  geocodeTokyoLocation,
  searchTokyoRestaurants,
} from "../services/api";

// This is the default anchor point for the restaurant page so the first render
// already has a real Tokyo-based search center.
const DEFAULT_SEARCH_CENTER = {
  latitude: 35.6812,
  longitude: 139.7671,
  label: "Tokyo Station",
  radius: 4000,
};

// Japanese keyword chips help users get stronger local-style search results
// without needing to know how to type those terms themselves.
const suggestedKeywords = [
  { english: "Sushi", japanese: "寿司" },
  { english: "Ramen", japanese: "ラーメン" },
  { english: "Cafe", japanese: "カフェ" },
  { english: "Gyoza", japanese: "餃子" },
  { english: "Steak", japanese: "ステーキ" },
  { english: "Rice", japanese: "米" },
];

function formatCategory(category) {
  if (!category) return "Restaurant";

  return category
    .split(".")
    .map((part) => part.replaceAll("_", " "))
    .join(" • ");
}

// Geoapify / OSM metadata can be inconsistent, so these helpers pull from a
// few likely fields before giving up.
function extractWebsite(properties) {
  return (
    properties.website ||
    properties.datasource?.raw?.website ||
    properties.datasource?.raw?.["contact:website"] ||
    properties.datasource?.raw?.contact_website ||
    ""
  );
}

function extractPhone(properties) {
  return (
    properties.phone ||
    properties.datasource?.raw?.phone ||
    properties.datasource?.raw?.["contact:phone"] ||
    properties.datasource?.raw?.contact_phone ||
    ""
  );
}

function extractOpeningHours(properties) {
  return (
    properties.opening_hours ||
    properties.datasource?.raw?.opening_hours ||
    ""
  );
}

// Use a Google Maps handoff because it is familiar and fast for the user once
// they actually want to navigate somewhere.
function getMapLink(properties) {
  const searchText = [properties.name, properties.formatted]
    .filter(Boolean)
    .join(" ");

  if (!searchText) return "";

  return `https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(
    searchText
  )}`;
}

function toRadians(value) {
  return (value * Math.PI) / 180;
}

// Haversine formula for straight-line distance between the searched Tokyo area
// and each restaurant result.
function getDistanceKm(lat1, lon1, lat2, lon2) {
  const earthRadiusKm = 6371;
  const dLat = toRadians(lat2 - lat1);
  const dLon = toRadians(lon2 - lon1);

  const a =
    Math.sin(dLat / 2) ** 2 +
    Math.cos(toRadians(lat1)) *
      Math.cos(toRadians(lat2)) *
      Math.sin(dLon / 2) ** 2;

  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));

  return earthRadiusKm * c;
}

function formatDistance(distanceKm) {
  if (distanceKm == null) return "Distance unavailable";

  if (distanceKm < 1) {
    return `${Math.round(distanceKm * 1000)} m`;
  }

  return `${distanceKm.toFixed(1)} km`;
}

function Restaurants() {
  const [query, setQuery] = useState("sushi");
  const [locationInput, setLocationInput] = useState(
    DEFAULT_SEARCH_CENTER.label
  );
  const [activeSearchCenter, setActiveSearchCenter] = useState(
    DEFAULT_SEARCH_CENTER
  );
  const [sortOption, setSortOption] = useState("default");
  const [restaurants, setRestaurants] = useState([]);
  const [searchStarted, setSearchStarted] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const runSearch = useCallback(async (searchTerm, searchCenter) => {
    // Shared search runner keeps initial load and normal searches using the
    // same logic path instead of duplicating request code.
    setSearchStarted(true);
    setLoading(true);
    setError("");

    try {
      const results = await searchTokyoRestaurants(searchTerm, searchCenter);
      setRestaurants(results);
      setActiveSearchCenter(searchCenter);
    } catch (err) {
      setError(err.message);
      setRestaurants([]);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    // Default page load starts with something useful instead of a blank layout.
    runSearch("sushi", DEFAULT_SEARCH_CENTER);
  }, [runSearch]);

  async function handleSubmit(event) {
    event.preventDefault();

    setSearchStarted(true);
    setLoading(true);
    setError("");

    try {
      // If the user typed a location, geocode it first. Otherwise fall back to
      // the default Tokyo Station search center.
      const resolvedLocation = locationInput.trim()
        ? await geocodeTokyoLocation(locationInput)
        : DEFAULT_SEARCH_CENTER;

      const results = await searchTokyoRestaurants(query, resolvedLocation);

      setRestaurants(results);
      setActiveSearchCenter(resolvedLocation);
    } catch (err) {
      setError(err.message);
      setRestaurants([]);
    } finally {
      setLoading(false);
    }
  }

  function handleSuggestedKeywordClick(keyword) {
    // Chip click only changes the keyword field. The actual search still waits
    // for submit so the user can pair it with any location they want.
    setQuery(keyword);
  }

  const restaurantsWithDistance = useMemo(() => {
    // Attach a computed distance to each result so the UI can display it and
    // the sorting control can use it.
    return restaurants.map((restaurant) => {
      const properties = restaurant.properties;
      const lat = Number(properties?.lat);
      const lon = Number(properties?.lon);

      const distanceKm =
        Number.isFinite(lat) && Number.isFinite(lon)
          ? getDistanceKm(
              activeSearchCenter.latitude,
              activeSearchCenter.longitude,
              lat,
              lon
            )
          : null;

      return {
        ...restaurant,
        distanceKm,
      };
    });
  }, [restaurants, activeSearchCenter]);

  const sortedRestaurants = useMemo(() => {
    // Copy the array first so sorting does not mutate the original results.
    const sorted = [...restaurantsWithDistance];

    if (sortOption === "nearest") {
      sorted.sort((a, b) => {
        if (a.distanceKm == null && b.distanceKm == null) return 0;
        if (a.distanceKm == null) return 1;
        if (b.distanceKm == null) return -1;
        return a.distanceKm - b.distanceKm;
      });
    }

    if (sortOption === "alphabetical") {
      sorted.sort((a, b) => {
        const nameA = a.properties?.name || "Unnamed restaurant";
        const nameB = b.properties?.name || "Unnamed restaurant";

        return nameA.localeCompare(nameB);
      });
    }

    // "default" just preserves the order returned by the API.
    return sorted;
  }, [restaurantsWithDistance, sortOption]);

  return (
    <section className="restaurant-page">
      <h2>Tokyo Restaurant Locator</h2>
      <p className="restaurant-intro">
        Search by cuisine, restaurant name, or food type, then narrow the
        results with a Tokyo neighborhood, station area, address, or zip code.
      </p>

      <div className="restaurant-helper-card">
        <h3>Search tip</h3>
        <p>
          This search can work better when you use Japanese keywords instead of
          English ones. Click a suggestion below to auto-fill the search box.
        </p>

        <div className="keyword-chip-row">
          {suggestedKeywords.map((keyword) => (
            <button
              key={keyword.english}
              type="button"
              className="keyword-chip"
              onClick={() => handleSuggestedKeywordClick(keyword.japanese)}
            >
              {keyword.english} → {keyword.japanese}
            </button>
          ))}
        </div>

        <p className="restaurant-subtle">
          Need another phrase?{" "}
          <a
            href="https://translate.google.com/?sl=en&tl=ja&op=translate"
            target="_blank"
            rel="noreferrer"
            className="feature-link"
          >
            Open Google Translate
          </a>
        </p>
      </div>

      <form className="restaurant-search-form" onSubmit={handleSubmit}>
        <input
          type="text"
          className="restaurant-search-input"
          value={query}
          onChange={(event) => setQuery(event.target.value)}
          placeholder="Try sushi, ramen, cafe, dessert..."
        />

        <input
          type="text"
          className="restaurant-location-input"
          value={locationInput}
          onChange={(event) => setLocationInput(event.target.value)}
          placeholder="Try Shibuya, Tokyo Station, 100-0005, or a Tokyo address"
        />

        <select
          className="restaurant-sort-select"
          value={sortOption}
          onChange={(event) => setSortOption(event.target.value)}
        >
          <option value="default">Default</option>
          <option value="nearest">Nearest First</option>
          <option value="alphabetical">Alphabetical</option>
        </select>

        <button type="submit" className="restaurant-search-button">
          Search
        </button>
      </form>

      {searchStarted ? (
        <div>
          <p className="restaurant-subtle">
            Showing results for <strong>{query || "restaurants"}</strong> near{" "}
            <strong>{activeSearchCenter.label}</strong>.
          </p>
          <p className="restaurant-subtle">
            Distance is based on <strong>{activeSearchCenter.label}</strong>.
          </p>
        </div>
      ) : null}

      {loading ? <Loading message="Searching Tokyo restaurants..." /> : null}
      {error ? <ErrorMessage message={error} /> : null}

      {searchStarted &&
      !loading &&
      !error &&
      sortedRestaurants.length === 0 ? (
        <div className="status-card">
          <p>No matching restaurants found. Try a broader keyword.</p>
        </div>
      ) : null}

      <div className="restaurant-results">
        {sortedRestaurants.map((restaurant) => {
          const properties = restaurant.properties;
          const website = extractWebsite(properties);
          const phone = extractPhone(properties);
          const openingHours = extractOpeningHours(properties);
          const mapLink = getMapLink(properties);

          return (
            <article
              key={
                properties.place_id ||
                `${properties.name}-${properties.lat}-${properties.lon}`
              }
              className="restaurant-card"
            >
              <h3>{properties.name || "Unnamed restaurant"}</h3>

              <p className="restaurant-meta">
                {formatCategory(properties.categories?.[0])}
              </p>

              <p>{properties.formatted || "No address available"}</p>

              <p className="restaurant-distance">
                Distance from {activeSearchCenter.label}:{" "}
                {formatDistance(restaurant.distanceKm)}
              </p>

              {properties.suburb || properties.district ? (
                <p className="restaurant-subtle">
                  Area: {properties.suburb || properties.district}
                </p>
              ) : null}

              {openingHours ? (
                <p className="restaurant-subtle">Hours: {openingHours}</p>
              ) : null}

              {phone ? (
                <p className="restaurant-subtle">Phone: {phone}</p>
              ) : null}

              <div className="restaurant-link-row">
                {website ? (
                  <a
                    href={website}
                    target="_blank"
                    rel="noreferrer"
                    className="feature-link"
                  >
                    Visit Website
                  </a>
                ) : null}

                {mapLink ? (
                  <a
                    href={mapLink}
                    target="_blank"
                    rel="noreferrer"
                    className="feature-link"
                  >
                    Search in Google Maps
                  </a>
                ) : null}
              </div>
            </article>
          );
        })}
      </div>

      <p className="restaurant-credit">
        Restaurant data is powered by OpenStreetMap through Geoapify.
      </p>
    </section>
  );
}

export default Restaurants;