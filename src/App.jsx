import { useEffect, useState } from "react";
import { Routes, Route } from "react-router-dom";
import Navbar from "./components/Navbar";
import Home from "./pages/Home";
import Weather from "./pages/Weather";
import Restaurants from "./pages/Restaurants";
import PhrasesQuiz from "./pages/PhrasesQuiz";
import NotFound from "./pages/NotFound";

function App() {
  // App owns the global theme because the whole shell needs to react to it,
  // not just one page or one component.
  const [theme, setTheme] = useState(() => {
    // Pull the saved theme on first render so the app boots up in the same
    // mode the user last left it in.
    return localStorage.getItem("theme") || "light";
  });

  useEffect(() => {
    // Save theme changes immediately so refreshes and future visits keep the
    // same light/dark preference.
    localStorage.setItem("theme", theme);
  }, [theme]);

  function handleThemeToggle() {
    // Simple two-state toggle. Nothing fancy needed here.
    setTheme((currentTheme) =>
      currentTheme === "light" ? "dark" : "light"
    );
  }

  return (
    // Theme class sits at the top-level wrapper so the CSS variables can style
    // the whole app from one place.
    <div className={`app ${theme}-theme`}>
      <Navbar theme={theme} onToggleTheme={handleThemeToggle} />

      <main className="page-container">
        {/* Route setup stays here so the page structure is easy to scan in one file. */}
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/weather" element={<Weather />} />
          <Route path="/restaurants" element={<Restaurants />} />
          <Route path="/phrases-quiz" element={<PhrasesQuiz />} />
          <Route path="*" element={<NotFound />} />
        </Routes>
      </main>
    </div>
  );
}

export default App;