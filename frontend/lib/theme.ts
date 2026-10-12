export type ThemeMode = "light" | "dark" | "system";
export type ResolvedTheme = "light" | "dark";
/** Visual language: modern SaaS, classic lavender, or liquid glass. */
export type DesignStyle = "saas" | "classic" | "glass";

export const THEME_STORAGE_KEY = "nisha-theme";
export const DESIGN_STYLE_STORAGE_KEY = "nisha-design-style";

export function isThemeMode(value: string | null | undefined): value is ThemeMode {
  return value === "light" || value === "dark" || value === "system";
}

export function isDesignStyle(value: string | null | undefined): value is DesignStyle {
  return value === "saas" || value === "classic" || value === "glass";
}

export function getSystemTheme(): ResolvedTheme {
  if (typeof window === "undefined") {
    return "dark";
  }

  return window.matchMedia("(prefers-color-scheme: dark)").matches ? "dark" : "light";
}

export function resolveTheme(theme: ThemeMode, systemTheme: ResolvedTheme = getSystemTheme()): ResolvedTheme {
  return theme === "system" ? systemTheme : theme;
}

export function applyTheme(theme: ResolvedTheme) {
  if (typeof document === "undefined") {
    return;
  }

  const root = document.documentElement;
  root.dataset.theme = theme;
  root.classList.toggle("dark", theme === "dark");
  root.style.colorScheme = theme;
}

export function applyDesignStyle(style: DesignStyle) {
  if (typeof document === "undefined") {
    return;
  }

  document.documentElement.dataset.design = style;
}

export function getThemeInitializerScript(): string {
  return `(() => {
    try {
      const themeKey = ${JSON.stringify(THEME_STORAGE_KEY)};
      const designKey = ${JSON.stringify(DESIGN_STYLE_STORAGE_KEY)};
      const root = document.documentElement;
      const stored = localStorage.getItem(themeKey);
      const theme = stored === "light" || stored === "dark" || stored === "system" ? stored : "dark";
      const system = window.matchMedia("(prefers-color-scheme: dark)").matches ? "dark" : "light";
      const resolved = theme === "system" ? system : theme;
      const storedDesign = localStorage.getItem(designKey);
      const design =
        storedDesign === "classic" || storedDesign === "glass" || storedDesign === "saas"
          ? storedDesign
          : "saas";
      root.dataset.theme = resolved;
      root.dataset.design = design;
      root.classList.toggle("dark", resolved === "dark");
      root.style.colorScheme = resolved;
    } catch {
      const root = document.documentElement;
      root.dataset.theme = "dark";
      root.dataset.design = "saas";
      root.classList.add("dark");
      root.style.colorScheme = "dark";
    }
  })();`;
}
