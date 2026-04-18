import { NavLink } from "react-router-dom";

function Navbar({ theme, onToggleTheme }) {
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