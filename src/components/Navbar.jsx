import { useEffect, useState } from "react";
import { NavLink } from "react-router-dom";

// This keeps Tokyo time formatting in one place so the component stays cleaner.
function getTokyoTime() {
  return new Intl.DateTimeFormat("en-GB", {
    timeZone: "Asia/Tokyo",
    hour: "2-digit",
    minute: "2-digit",
    second: "2-digit",
    hour12: false,
  }).format(new Date());
}

function Navbar({ theme, onToggleTheme }) {
  // Initialize with the current Tokyo time right away so the clock is not blank
  // on first render.
  const [tokyoTime, setTokyoTime] = useState(getTokyoTime());

  useEffect(() => {
    // Update once per second so the clock feels live without being overkill.
    const timer = setInterval(() => {
      setTokyoTime(getTokyoTime());
    }, 1000);

    // Always clean intervals up so nothing keeps running after unmount.
    return () => clearInterval(timer);
  }, []);

  return (
    <nav className="navbar">
      <h1 className="nav-logo">Tokyo Travel App</h1>

      <div className="nav-right">
        {/* NavLink handles the active route styling for us. */}
        <div className="nav-links">
          <NavLink to="/">Home</NavLink>
          <NavLink to="/weather">Weather</NavLink>
          <NavLink to="/restaurants">Restaurants</NavLink>
          <NavLink to="/phrases-quiz">Phrases Quiz</NavLink>
        </div>

        {/* Small travel-focused touch so the app feels more tied to Tokyo
            instead of just being another generic project. */}
        <div className="tokyo-clock" aria-label="Current Tokyo time">
          <span className="tokyo-clock-label">Tokyo Time</span>
          <span className="tokyo-clock-time">{tokyoTime}</span>
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