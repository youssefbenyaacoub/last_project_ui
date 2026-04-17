import { useEffect } from "react";
import { RouterProvider } from "react-router-dom";
import { router } from "./Routes.jsx";
import { ThemeProvider } from "./contexts/ThemeContext";
import { LanguageProvider } from "./contexts/LanguageContext";
import { UserPreferencesProvider } from "./contexts/UserPreferencesContext";

const SETTINGS_STORAGE_KEY = "bh_dashboard_settings";

const TEXT_SIZE_VALUES = ["small", "medium", "large", "xlarge"];
const READING_SPACING_VALUES = ["normal", "comfortable", "wide"];

const ROOT_ACCESSIBILITY_CLASSES = {
  reduceMotion: "reduce-motion-mode",
  keyboardNavigation: "keyboard-navigation-mode",
};

const ROOT_TEXT_SIZE_CLASSES = TEXT_SIZE_VALUES.map((value) => `text-size-${value}`);
const ROOT_READING_SPACING_CLASSES = READING_SPACING_VALUES.map(
  (value) => `reading-spacing-${value}`,
);

const DEFAULT_ACCESSIBILITY_SETTINGS = {
  textSize: "medium",
  readingSpacing: "normal",
  reduceMotion: false,
  keyboardNavigation: false,
};

function applyStoredAccessibilitySettings() {
  if (typeof window === "undefined") return;

  let parsed = {};
  try {
    const raw = localStorage.getItem(SETTINGS_STORAGE_KEY);
    parsed = raw ? JSON.parse(raw) : {};
  } catch {
    parsed = {};
  }

  const accessibility = {
    ...DEFAULT_ACCESSIBILITY_SETTINGS,
    ...(parsed?.accessibility || {}),
  };

  if (!TEXT_SIZE_VALUES.includes(accessibility.textSize)) {
    accessibility.textSize = DEFAULT_ACCESSIBILITY_SETTINGS.textSize;
  }

  if (!READING_SPACING_VALUES.includes(accessibility.readingSpacing)) {
    accessibility.readingSpacing = DEFAULT_ACCESSIBILITY_SETTINGS.readingSpacing;
  }

  const root = document.documentElement;
  root.classList.remove("high-contrast-mode");

  Object.entries(ROOT_ACCESSIBILITY_CLASSES).forEach(([key, className]) => {
    root.classList.toggle(className, Boolean(accessibility[key]));
  });

  ROOT_TEXT_SIZE_CLASSES.forEach((className) => root.classList.remove(className));
  root.classList.add(`text-size-${accessibility.textSize}`);

  ROOT_READING_SPACING_CLASSES.forEach((className) => root.classList.remove(className));
  root.classList.add(`reading-spacing-${accessibility.readingSpacing}`);
}

export default function App() {
  useEffect(() => {
    applyStoredAccessibilitySettings();

    const onStorage = (event) => {
      if (!event || !event.key || event.key === SETTINGS_STORAGE_KEY) {
        applyStoredAccessibilitySettings();
      }
    };

    const onAccessibilityUpdated = () => {
      applyStoredAccessibilitySettings();
    };

    window.addEventListener("storage", onStorage);
    window.addEventListener("bh-accessibility-updated", onAccessibilityUpdated);

    return () => {
      window.removeEventListener("storage", onStorage);
      window.removeEventListener("bh-accessibility-updated", onAccessibilityUpdated);
    };
  }, []);

  return (
    <ThemeProvider>
      <LanguageProvider>
        <UserPreferencesProvider>
          <RouterProvider router={router} />
        </UserPreferencesProvider>
      </LanguageProvider>
    </ThemeProvider>
  );
}
