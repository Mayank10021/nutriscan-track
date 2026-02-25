import React, { createContext, useContext, useState, useEffect } from "react";

const Ctx = createContext();

export function ThemeProvider({ children }) {

  // Default Light + LocalStorage check
  const [dark, setDark] = useState(() => {
    return localStorage.getItem("theme") === "dark";
  });

  // Save theme whenever it changes
  useEffect(() => {
    localStorage.setItem("theme", dark ? "dark" : "light");

    if (dark) {
      document.documentElement.classList.add("dark");
    } else {
      document.documentElement.classList.remove("dark");
    }
  }, [dark]);

  return (
    <Ctx.Provider value={{ dark, toggle: () => setDark(d => !d) }}>
      {children}
    </Ctx.Provider>
  );
}

export const useTheme = () => useContext(Ctx);