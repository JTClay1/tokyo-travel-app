import { useState } from "react";
import Loading from "../components/Loading";
import ErrorMessage from "../components/ErrorMessage";
import {
  searchTokyoRestaurants,
  getRestaurantDetails,
} from "../services/api";

function Restaurants() {
  const [query, setQuery] = useState("sushi");
  const [restaurants, setRestaurants] = useState([]);
  const [searchStarted, setSearchStarted] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const [selectedPlaceId, setSelectedPlaceId] = useState("");
  const [selectedPlaceDetails, setSelectedPlaceDetails] = useState(null);
  const [detailsLoading, setDetailsLoading] = useState(false);
  const [detailsError, setDetailsError] = useState("");

  async function handleSubmit(event) {
    event.preventDefault();

    setSearchStarted(true);
    setLoading(true);
    setError("");
    setSelectedPlaceId("");
    setSelectedPlaceDetails(null);
    setDetailsError("");

    try {
      const results = await searchTokyoRestaurants(query);
      setRestaurants(results);
    } catch (err) {
      setError(err.message);
      setRestaurants([]);
    } finally {
      setLoading(false);
    }
  }

  async function handleViewDetails(placeId) {
    if (selectedPlaceId === placeId) {
      setSelectedPlaceId("");
      setSelectedPlaceDetails(null);
      setDetailsError("");
      return;
    }

    setSelectedPlaceId(placeId);
    setSelectedPlaceDetails(null);
    setDetailsError("");
    setDetailsLoading(true);

    try {
      const details = await getRestaurantDetails(placeId);
      setSelectedPlaceDetails(details);
    } catch (err) {
      setDetailsError(err.message);
    } finally {
      setDetailsLoading(false);
    }
  }

  function renderReviews() {
    const reviews = selectedPlaceDetails?.reviews || [];

    if (reviews.length === 0) {
      return <p className="restaurant-subtle">No reviews returned for this place.</p>;
    }

    return (
      <div className="review-list">
        <p className="restaurant-subtle">Reviews are shown in Google’s relevance order.</p>

        {reviews.map((review, index) => (
          <div key={`${review.authorAttribution?.displayName || "review"}-${index}`} className="review-card">
            <p className="review-author">
              {review.authorAttribution?.displayName || "Google user"}
            </p>

            {review.rating ? (
              <p className="review-meta">Rating: {review.rating} / 5</p>
            ) : null}

            <p>
              {review.text?.text ||
                review.originalText?.text ||
                "No review text available."}
            </p>

            {review.authorAttribution?.uri ? (
              <a
                href={review.authorAttribution.uri}
                target="_blank"
                rel="noreferrer"
                className="feature-link"
              >
                View author profile
              </a>
            ) : null}
          </div>
        ))}
      </div>
    );
  }

  function renderAttributions() {
    const attributions = selectedPlaceDetails?.attributions || [];

    if (attributions.length === 0) {
      return null;
    }

    return (
      <div className="attribution-block">
        <p className="restaurant-subtle">Attributions</p>
        <ul className="attribution-list">
          {attributions.map((item, index) => (
            <li key={`${item.provider || "provider"}-${index}`}>
              {item.providerUri ? (
                <a href={item.providerUri} target="_blank" rel="noreferrer">
                  {item.provider}
                </a>
              ) : (
                item.provider
              )}
            </li>
          ))}
        </ul>
      </div>
    );
  }

  return (
    <section className="restaurant-page">
      <h2>Tokyo Restaurant Finder</h2>
      <p className="restaurant-intro">
        Search by cuisine, vibe, or use case. Try things like sushi, ramen,
        dessert, quiet lunch, or Shibuya cafe.
      </p>

      <form className="restaurant-search-form" onSubmit={handleSubmit}>
        <input
          type="text"
          className="restaurant-search-input"
          value={query}
          onChange={(event) => setQuery(event.target.value)}
          placeholder="Search Tokyo restaurants..."
        />
        <button type="submit" className="restaurant-search-button">
          Search
        </button>
      </form>

      {loading ? <Loading /> : null}
      {error ? <ErrorMessage message={error} /> : null}

      {searchStarted && !loading && !error && restaurants.length === 0 ? (
        <p>No matching restaurants found. Try a broader keyword.</p>
      ) : null}

      <div className="restaurant-results">
        {restaurants.map((place) => (
          <article key={place.id} className="restaurant-card">
            <h3>{place.displayName?.text || "Unnamed place"}</h3>

            <p className="restaurant-meta">
              {place.primaryTypeDisplayName?.text || "Restaurant"}
            </p>

            <p>{place.formattedAddress || "No address available"}</p>

            <p className="restaurant-meta">
              Rating: {place.rating ? `${place.rating} / 5` : "No rating yet"}
              {place.userRatingCount
                ? ` • ${place.userRatingCount} reviews`
                : ""}
            </p>

            {place.googleMapsUri ? (
              <p>
                <a
                  href={place.googleMapsUri}
                  target="_blank"
                  rel="noreferrer"
                  className="feature-link"
                >
                  Open in Google Maps
                </a>
              </p>
            ) : null}

            <button
              className="restaurant-details-button"
              onClick={() => handleViewDetails(place.id)}
            >
              {selectedPlaceId === place.id ? "Hide Reviews" : "View Reviews"}
            </button>

            {selectedPlaceId === place.id ? (
              <div className="review-panel">
                {detailsLoading ? <Loading /> : null}
                {detailsError ? <ErrorMessage message={detailsError} /> : null}

                {!detailsLoading && !detailsError && selectedPlaceDetails ? (
                  <>
                    {renderReviews()}
                    {renderAttributions()}
                  </>
                ) : null}
              </div>
            ) : null}
          </article>
        ))}
      </div>
    </section>
  );
}

export default Restaurants;