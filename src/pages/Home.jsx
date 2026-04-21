import { Link } from "react-router-dom";
import ImageCarousel from "../components/ImageCarousel";

function Home() {
  return (
    <section className="home-page">
      <div className="hero-section">
        <p className="hero-eyebrow">Tokyo Travel App</p>
        <h2>Plan your Tokyo trip with confidence!</h2>
        <p className="hero-text">
          Check current weather, get a feel for seasonal temperatures, and learn
          a few useful Japanese phrases before you go.
        </p>
      </div>

      {/* Carousel adds some visual pull to the landing page and helps the app
          feel more like an actual travel tool instead of just a utility menu. */}
      <ImageCarousel />

      <div className="feature-grid">
        <article className="feature-card">
          <h3>Tokyo Weather</h3>
          <p>
            View current conditions, a 7-day forecast, and a seasonal climate
            table to help plan your trip.
          </p>
          <Link to="/weather" className="feature-link">
            Go to Weather
          </Link>
        </article>

        <article className="feature-card">
          <h3>Restaurant Locator</h3>
          <p>
            Search for places to eat by cuisine or neighborhood and quickly hand
            the result off to Google Maps.
          </p>
          <Link to="/restaurants" className="feature-link">
            Go to Restaurants
          </Link>
        </article>

        <article className="feature-card">
          <h3>Phrases Quiz</h3>
          <p>
            Practice useful romaji phrases for greetings, travel, shopping, and
            common day-to-day situations.
          </p>
          <Link to="/phrases-quiz" className="feature-link">
            Go to Quiz
          </Link>
        </article>
      </div>

      <div className="home-info-card">
        <h3>Why use this app?</h3>
        <p>
          A trip to Tokyo can be a bit overwhelming, especially your first time
          there. This app will give you the tools you need to hit the ground
          with the confidence you need to make your first time there as smooth
          and stress-free as possible.
        </p>
      </div>
    </section>
  );
}

export default Home;