import { NavLink } from "react-router-dom";

function Navbar() {
  return (
    <nav className="navbar">
      <h1 className="nav-logo">Tokyo Travel App</h1>

      <div className="nav-links">
        <NavLink to="/">Home</NavLink>
        <NavLink to="/weather">Weather</NavLink>
        <NavLink to="/restaurants">Restaurants</NavLink>
        <NavLink to="/phrases-quiz">Phrases Quiz</NavLink>
      </div>
    </nav>
  );
}

export default Navbar;