import { useEffect, useState } from "react";
import { Routes, Route } from "react-router-dom";
import Navbar from "./components/Navbar";
import Home from "./pages/Home";
import Weather from "./pages/Weather";
import Restaurants from "./pages/Restaurants";
import PhrasesQuiz from "./pages/PhrasesQuiz";
import NotFound from "./pages/NotFound";

function App() {
  // App owns the overall shell, so theme state lives here instead of being
  // buried in the navbar. That way the whole app can respond to theme changes.
  const [theme, setTheme] = useState(() => {
    return localStorage.getItem("theme") || "light";
  });

  // Persist the current theme so the app comes back the way the user left it.
  useEffect(() => {
    localStorage.setItem("theme", theme);
  }, [theme]);

  // Small toggle helper to flip between the only two modes we support.
  function handleThemeToggle() {
    setTheme((currentTheme) =>
      currentTheme === "light" ? "dark" : "light"
    );
  }

  return (
    // Theme class gets attached at the top level so the CSS variables can
    // control the full app from one place.
    <div className={`app ${theme}-theme`}>
      <Navbar theme={theme} onToggleTheme={handleThemeToggle} />

      <main className="page-container">
        {/* Keeping all route definitions here makes the page structure obvious
            and keeps navigation predictable. */}
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