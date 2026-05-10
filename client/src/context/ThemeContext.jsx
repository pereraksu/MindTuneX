import { useEffect, useMemo, useState } from "react";
import { ThemeContext } from "./themeContextObject";

const getInitialTheme = () => {
  // Local storage preference
  const savedTheme = localStorage.getItem("theme");

  if (savedTheme === "dark") return true;
  if (savedTheme === "light") return false;

  // System preference
  if (window.matchMedia) {
    return window.matchMedia("(prefers-color-scheme: dark)").matches;
  }

  // Time-based fallback
  const hour = new Date().getHours();
  return hour >= 18 || hour < 6;
};

export const ThemeProvider = ({ children }) => {
  const [darkMode, setDarkMode] = useState(getInitialTheme);

  // Apply theme to HTML
  useEffect(() => {
    const root = document.documentElement;

    if (darkMode) {
      root.classList.add("dark");
      localStorage.setItem("theme", "dark");
    } else {
      root.classList.remove("dark");
      localStorage.setItem("theme", "light");
    }
  }, [darkMode]);

  // Listen for system theme changes
  useEffect(() => {
    const mediaQuery = window.matchMedia("(prefers-color-scheme: dark)");

    const handleThemeChange = (e) => {
      const savedTheme = localStorage.getItem("theme");

      // Only auto-switch if user hasn't manually selected
      if (!savedTheme) {
        setDarkMode(e.matches);
      }
    };

    mediaQuery.addEventListener("change", handleThemeChange);

    return () => {
      mediaQuery.removeEventListener("change", handleThemeChange);
    };
  }, []);

  const toggleTheme = () => {
    setDarkMode((prev) => !prev);
  };

  const setTheme = (theme) => {
    if (theme === "dark") setDarkMode(true);
    if (theme === "light") setDarkMode(false);
  };

  const value = useMemo(
    () => ({
      darkMode,
      theme: darkMode ? "dark" : "light",
      toggleTheme,
      setTheme,
    }),
    [darkMode]
  );

  return (
    <ThemeContext.Provider value={value}>
      {children}
    </ThemeContext.Provider>
  );
};