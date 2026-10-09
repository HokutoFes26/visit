import { useSyncExternalStore } from "react";
import translations from "./translations.json";

type Language = "ja" | "en";
type Theme = "light" | "dark";
const KEY = "company-visit:preferences:v1";
const dictionary: Record<string, string> = translations;
function readPreferences(): {
  language: Language;
  theme: Theme;
  error: boolean;
} {
  const theme = window.matchMedia("(prefers-color-scheme: dark)").matches
    ? "dark"
    : "light";
  try {
    const saved = JSON.parse(localStorage.getItem(KEY) || "null");
    return {
      language: saved?.language === "en" ? "en" : "ja",
      theme:
        saved?.theme === "dark" || saved?.theme === "light"
          ? saved.theme
          : theme,
      error: false,
    };
  } catch {
    return { language: "ja", theme, error: true };
  }
}
let preferences = readPreferences();
const listeners = new Set<() => void>();
function apply() {
  document.documentElement.lang = preferences.language;
  document.documentElement.dataset.theme = preferences.theme;
  document.title =
    preferences.language === "ja"
      ? "県外企業見学 | Company Visit Guide"
      : "Company Visits Outside Toyama | Company Visit Guide";
  document
    .querySelector('meta[name="theme-color"]')
    ?.setAttribute(
      "content",
      preferences.theme === "dark" ? "#101b2d" : "#edf4ff",
    );
}
apply();
function update(next: Partial<{ language: Language; theme: Theme }>) {
  preferences = { ...preferences, ...next, error: false };
  try {
    localStorage.setItem(
      KEY,
      JSON.stringify({
        language: preferences.language,
        theme: preferences.theme,
      }),
    );
  } catch {
    preferences = { ...preferences, error: true };
  }
  apply();
  listeners.forEach((listener) => listener());
}
window.addEventListener("storage", (event) => {
  if (event.key === KEY || event.key === null) {
    preferences = readPreferences();
    apply();
    listeners.forEach((listener) => listener());
  }
});
const subscribe = (listener: () => void) => {
  listeners.add(listener);
  return () => {
    listeners.delete(listener);
  };
};
export const getLanguage = () => preferences.language;
export function usePreferences() {
  const state = useSyncExternalStore(subscribe, () => preferences);
  return {
    ...state,
    setLanguage: (language: Language) => update({ language }),
    setTheme: (theme: Theme) => update({ theme }),
  };
}
// Translate display strings only. IDs, form values and user-written notes stay intact.
export function t<T>(value: T, values?: Record<string, string | number>): T {
  if (typeof value !== "string") return value;
  const normalized = value.trim().replace(/\s+/g, " ");
  let result =
    preferences.language === "en" ? (dictionary[normalized] ?? value) : value;
  if (values)
    result = result.replace(/\{(\w+)\}/g, (match, key: string) =>
      values[key] === undefined ? match : String(values[key]),
    );
  return result as T;
}
