import { createContext, useContext, useEffect, useState } from "react";
import api from "../lib/axios";

const ThemeContext = createContext();

export const useTheme = () => useContext(ThemeContext);

export const ThemeProvider = ({ children }) => {
  const [theme, setTheme] = useState("system");
  const [density, setDensity] = useState("comfortable");
  const [loaded, setLoaded] = useState(false);

  // Apply theme to document
  const applyTheme = (newTheme) => {
    const root = document.documentElement;
    const systemPrefersDark = window.matchMedia("(prefers-color-scheme: dark)").matches;
    
    let activeTheme = newTheme;
    if (newTheme === "system") {
      activeTheme = systemPrefersDark ? "dark" : "light";
    }

    if (activeTheme === "dark") {
      root.classList.add("dark");
      root.classList.remove("light");
    } else {
      root.classList.add("light");
      root.classList.remove("dark");
    }

    // Store in localStorage for persistence
    localStorage.setItem("theme", newTheme);
  };

  // Apply density to document
  const applyDensity = (newDensity) => {
    const root = document.documentElement;
    root.setAttribute("data-density", newDensity);
    localStorage.setItem("density", newDensity);
  };

  // Load settings on mount
  useEffect(() => {
    const loadSettings = async () => {
      // First, check localStorage for immediate application
      const savedTheme = localStorage.getItem("theme") || "system";
      const savedDensity = localStorage.getItem("density") || "comfortable";
      
      setTheme(savedTheme);
      setDensity(savedDensity);
      applyTheme(savedTheme);
      applyDensity(savedDensity);

      // Only fetch from server if we have a token
      const token = localStorage.getItem("token");
      if (!token) {
        setLoaded(true);
        return;
      }

      // Then fetch from server to sync
      try {
        const { data } = await api.get("/settings/appearance");
        if (data) {
          // Only update if server value is different to avoid flickering or overwriting local changes
          if (data.theme && data.theme !== savedTheme) {
            setTheme(data.theme);
            applyTheme(data.theme);
          }
          if (data.density && data.density !== savedDensity) {
            setDensity(data.density);
            applyDensity(data.density);
          }
        }
      } catch (err) {
        // Silently fail if not authorized - user is likely logging out or has an expired session
        if (err.response?.status !== 401) {
          console.error("Failed to sync appearance settings:", err);
        }
      } finally {
        setLoaded(true);
      }
    };

    loadSettings();

    // Listen for system theme changes
    const mediaQuery = window.matchMedia("(prefers-color-scheme: dark)");
    const handleChange = () => {
      const currentTheme = localStorage.getItem("theme") || "system";
      if (currentTheme === "system") {
        applyTheme("system");
      }
    };
    mediaQuery.addEventListener("change", handleChange);
    return () => mediaQuery.removeEventListener("change", handleChange);
  }, []);

  const updateTheme = async (newTheme) => {
    setTheme(newTheme);
    applyTheme(newTheme);
    try {
      // Only send the theme to avoid stale density state
      await api.patch("/settings/appearance", { theme: newTheme });
    } catch (err) {
      console.error("Failed to save theme:", err);
    }
  };

  const updateDensity = async (newDensity) => {
    setDensity(newDensity);
    applyDensity(newDensity);
    try {
      // Only send the density to avoid stale theme state
      await api.patch("/settings/appearance", { density: newDensity });
    } catch (err) {
      console.error("Failed to save density:", err);
    }
  };

  return (
    <ThemeContext.Provider
      value={{
        theme,
        density,
        loaded,
        setTheme: updateTheme,
        setDensity: updateDensity,
        applyTheme,
        applyDensity,
      }}
    >
      {children}
    </ThemeContext.Provider>
  );
};
