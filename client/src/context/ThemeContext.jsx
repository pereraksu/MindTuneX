import { useEffect, useMemo, useState } from "react";
import { ThemeContext } from "./themeContextObject";

const getInitialTheme = () => {
  const saved = localStorage.getItem("theme");

  if (saved === "dark") return true;
  if (saved === "light") return false;

  const prefersDark = window.matchMedia?.("(prefers-color-scheme: dark)").matches;
  if (typeof prefersDark === "boolean") return prefersDark;

  const hour = new Date().getHours();
  return hour >= 18 || hour < 6;
};

export const ThemeProvider = ({ children }) => {
  const [darkMode, setDarkMode] = useState(getInitialTheme);

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
      toggleTheme,
      setTheme,
      theme: darkMode ? "dark" : "light",
    }),
    [darkMode]
  );

  return <ThemeContext.Provider value={value}>{children}</ThemeContext.Provider>;
};