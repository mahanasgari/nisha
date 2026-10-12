"use client";

import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useState,
  type ReactNode,
} from "react";
import {
  applyDesignStyle,
  applyTheme,
  DESIGN_STYLE_STORAGE_KEY,
  getSystemTheme,
  isDesignStyle,
  isThemeMode,
  resolveTheme,
  THEME_STORAGE_KEY,
  type DesignStyle,
  type ResolvedTheme,
  type ThemeMode,
} from "@/lib/theme";

type ThemeContextValue = {
  theme: ThemeMode;
  resolvedTheme: ResolvedTheme;
  /** Panel preference (localStorage). */
  designStyle: DesignStyle;
  /**
   * Effective design currently painted on <html>.
   * On storefront this can be the store's design_style while panel preference stays unchanged.
   */
  activeDesignStyle: DesignStyle;
  setTheme: (theme: ThemeMode) => void;
  setDesignStyle: (style: DesignStyle) => void;
  /** Temporarily paint a design without changing the panel preference. */
  setDesignOverride: (style: DesignStyle | null) => void;
  toggleTheme: () => void;
};

const ThemeContext = createContext<ThemeContextValue | null>(null);

export function ThemeProvider({ children }: { children: ReactNode }) {
  const [theme, setThemeState] = useState<ThemeMode>("dark");
  const [designStyle, setDesignStyleState] = useState<DesignStyle>("saas");
  const [designOverride, setDesignOverrideState] = useState<DesignStyle | null>(null);
  const [isLoaded, setIsLoaded] = useState(false);

  useEffect(() => {
    const storedTheme = window.localStorage.getItem(THEME_STORAGE_KEY);
    const storedDesign = window.localStorage.getItem(DESIGN_STYLE_STORAGE_KEY);
    setThemeState(isThemeMode(storedTheme) ? storedTheme : "dark");
    setDesignStyleState(isDesignStyle(storedDesign) ? storedDesign : "saas");
    setIsLoaded(true);
  }, []);

  const resolvedTheme = useMemo(() => resolveTheme(theme), [theme]);
  const activeDesignStyle = designOverride ?? designStyle;

  useEffect(() => {
    if (!isLoaded) {
      return;
    }

    applyTheme(resolvedTheme);
    window.localStorage.setItem(THEME_STORAGE_KEY, theme);
  }, [theme, resolvedTheme, isLoaded]);

  useEffect(() => {
    if (!isLoaded) {
      return;
    }

    applyDesignStyle(activeDesignStyle);
    // Only persist the seller/admin panel preference — never the store override.
    window.localStorage.setItem(DESIGN_STYLE_STORAGE_KEY, designStyle);
  }, [activeDesignStyle, designStyle, isLoaded]);

  useEffect(() => {
    if (!isLoaded || theme !== "system") {
      return;
    }

    const media = window.matchMedia("(prefers-color-scheme: dark)");
    const handleChange = () => applyTheme(media.matches ? "dark" : "light");

    media.addEventListener("change", handleChange);
    handleChange();

    return () => media.removeEventListener("change", handleChange);
  }, [theme, isLoaded]);

  const setTheme = useCallback((nextTheme: ThemeMode) => {
    setThemeState(nextTheme);
  }, []);

  const setDesignStyle = useCallback((next: DesignStyle) => {
    setDesignStyleState(next);
  }, []);

  const setDesignOverride = useCallback((next: DesignStyle | null) => {
    setDesignOverrideState(next);
  }, []);

  const toggleTheme = useCallback(() => {
    setThemeState((current) => {
      const resolved = current === "system" ? getSystemTheme() : current;
      return resolved === "dark" ? "light" : "dark";
    });
  }, []);

  const value = useMemo(
    () => ({
      theme,
      resolvedTheme,
      designStyle,
      activeDesignStyle,
      setTheme,
      setDesignStyle,
      setDesignOverride,
      toggleTheme,
    }),
    [
      theme,
      resolvedTheme,
      designStyle,
      activeDesignStyle,
      setTheme,
      setDesignStyle,
      setDesignOverride,
      toggleTheme,
    ],
  );

  return <ThemeContext.Provider value={value}>{children}</ThemeContext.Provider>;
}

export function useTheme(): ThemeContextValue {
  const ctx = useContext(ThemeContext);
  if (!ctx) {
    throw new Error("useTheme must be used within ThemeProvider");
  }
  return ctx;
}
