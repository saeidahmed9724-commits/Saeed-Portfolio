export type Theme = "light" | "dark";

export const THEME_STORAGE_KEY = "saeed_portfolio_theme";

export function isValidTheme(value: unknown): value is Theme {
  return value === "light" || value === "dark";
}

export function resolveInitialTheme(
  stored: string | null | undefined,
  prefersDark: boolean
): Theme {
  if (isValidTheme(stored)) {
    return stored;
  }
  return prefersDark ? "dark" : "light";
}

export function getNextTheme(current: Theme): Theme {
  return current === "dark" ? "light" : "dark";
}
