import { useCallback, useEffect, useState } from "react";
import Loading from "../components/Loading";
import ErrorMessage from "../components/ErrorMessage";
import { searchTokyoRestaurants } from "../services/api";

const tokyoNeighborhoods = [
  { value: "all", label: "All Tokyo" },
  { value: "shibuya", label: "Shibuya" },
  { value: "shinjuku", label: "Shinjuku" },
  { value: "asakusa", label: "Asakusa" },
  { value: "ginza", label: "Ginza" },
  { value: "ueno", label: "Ueno" },
  { value: "akihabara", label: "Akihabara" },
  { value: "harajuku", label: "Harajuku" },
  { value: "roppongi", label: "Roppongi" },
  { value: "ikebukuro", label: "Ikebukuro" },
  { value: "tokyo_station", label: "Tokyo Station / Marunouchi" },
];

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

function getMapLink(properties) {
  const searchText = [properties.name, properties.formatted]
    .filter(Boolean)
    .join(" ");

  if (!searchText) return "";

  return `https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(
    searchText
  )}`;
}

function Restaurants() {
  const [query, setQuery] = useState("sushi");
  const [selectedArea, setSelectedArea] = useState("all");
  const [restaurants, setRestaurants] = useState([]);
  const [searchStarted, setSearchStarted] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const runSearch = useCallback(async (searchTerm, areaKey) => {
    setSearchStarted(true);
    setLoading(true);
    setError("");

    try {
      const results = await searchTokyoRestaurants(searchTerm, areaKey);
      setRestaurants(results);
    } catch (err) {
      setError(err.message);
      setRestaurants([]);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    runSearch("sushi", "all");
  }, [runSearch]);

  async function handleSubmit(event) {
    event.preventDefault();
    runSearch(query, selectedArea);
  }

  function handleSuggestedKeywordClick(keyword) {
    setQuery(keyword);
  }

  const selectedAreaLabel =
    tokyoNeighborhoods.find((area) => area.value === selectedArea)?.label ||
    "All Tokyo";

  return (
    <section className="restaurant-page">
      <h2>Tokyo Restaurant Locator</h2>
      <p className="restaurant-intro">
        Search by cuisine, restaurant name, or food type, then narrow the
        results to the Tokyo neighborhood where you are staying.
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

        <select
          className="restaurant-area-select"
          value={selectedArea}
          onChange={(event) => setSelectedArea(event.target.value)}
        >
          {tokyoNeighborhoods.map((area) => (
            <option key={area.value} value={area.value}>
              {area.label}
            </option>
          ))}
        </select>

        <button type="submit" className="restaurant-search-button">
          Search
        </button>
      </form>

      {searchStarted ? (
        <p className="restaurant-subtle">
          Showing results for <strong>{query || "restaurants"}</strong> in{" "}
          <strong>{selectedAreaLabel}</strong>.
        </p>
      ) : null}

      {loading ? <Loading message="Searching Tokyo restaurants..." /> : null}
      {error ? <ErrorMessage message={error} /> : null}

      {searchStarted && !loading && !error && restaurants.length === 0 ? (
        <div className="status-card">
          <p>No matching restaurants found. Try a broader keyword.</p>
        </div>
      ) : null}

      <div className="restaurant-results">
        {restaurants.map((restaurant) => {
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