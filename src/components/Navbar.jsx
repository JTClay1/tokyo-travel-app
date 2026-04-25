import { useEffect, useState } from "react";
import { NavLink } from "react-router-dom";

// Split the Tokyo date/time formatting into one helper so the component stays
// clean and we only define the timezone rules in one place.
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
  // Initialize both pieces right away so the clock is fully populated on first render.
  const [tokyoDateTime, setTokyoDateTime] = useState(getTokyoDateTime());

  useEffect(() => {
    const timer = setInterval(() => {
      setTokyoDateTime(getTokyoDateTime());
    }, 1000);

    return () => clearInterval(timer);
  }, []);

  return (
    <nav className="navbar">
      <h1 className="nav-logo">Tokyo Travel App</h1>

      <div className="nav-right">
        <div className="nav-links">
          <NavLink to="/">Home</NavLink>
          <NavLink to="/weather">Weather</NavLink>
          <NavLink to="/restaurants">Restaurants</NavLink>
          <NavLink to="/phrases-quiz">Phrases Quiz</NavLink>
        </div>

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