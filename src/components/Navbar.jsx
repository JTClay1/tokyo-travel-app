import { useEffect, useState } from "react";
import { NavLink } from "react-router-dom";

// Keep Tokyo time formatting in one helper so the timezone rules only live in
// one place and the component itself stays cleaner.
function getTokyoDateTime() {
  const now = new Date();

  const time = new Intl.DateTimeFormat("en-US", {
    timeZone: "Asia/Tokyo",
    hour: "numeric",
    minute: "2-digit",
    second: "2-digit",
    hour12: true,
  }).format(now);

  const date = new Intl.DateTimeFormat("en-US", {
    timeZone: "Asia/Tokyo",
    month: "short",
    day: "numeric",
    year: "numeric",
  }).format(now);

  return { time, date };
}

function Navbar({ theme, onToggleTheme }) {
  // Initialize the Tokyo clock immediately so the navbar is fully populated on
  // first render instead of briefly showing nothing.
  const [tokyoDateTime, setTokyoDateTime] = useState(getTokyoDateTime());

  useEffect(() => {
    // Update the clock once per second so it actually feels live.
    const timer = setInterval(() => {
      setTokyoDateTime(getTokyoDateTime());
    }, 1000);

    // Always clean intervals up so we do not leave background work running.
    return () => clearInterval(timer);
  }, []);

  return (
    <nav className="navbar">
      <h1 className="nav-logo">Tokyo Travel App</h1>

      <div className="nav-right">
        {/* NavLink gives route-aware active styling automatically. */}
        <div className="nav-links">
          <NavLink to="/">Home</NavLink>
          <NavLink to="/weather">Weather</NavLink>
          <NavLink to="/restaurants">Restaurants</NavLink>
          <NavLink to="/phrases-quiz">Phrases Quiz</NavLink>
        </div>

        {/* Small feature, but it helps the whole app feel anchored to Tokyo
            instead of just being a generic travel project. */}
        <div className="tokyo-clock" aria-label="Current Tokyo date and time">
          <span className="tokyo-clock-label">Tokyo Time</span>
          <span className="tokyo-clock-time">{tokyoDateTime.time}</span>
          <span className="tokyo-clock-date">{tokyoDateTime.date}</span>
        </div>

        <button
          type="button"
          className="theme-toggle-button"
          onClick={onToggleTheme}
          aria-label={`Switch to ${theme === "light" ? "dark" : "light"} mode`}
        >
          {theme === "light" ? "Dark Mode" : "Light Mode"}
        </button>
      </div>
    </nav>
  );
}

export default Navbar;