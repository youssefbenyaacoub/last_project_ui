import { Suspense, lazy, useEffect, useState } from "react";
import { Outlet, useNavigate } from "react-router-dom";

const LazyScreenReaderDock = lazy(() =>
  import("./ScreenReaderDock").then((module) => ({ default: module.ScreenReaderDock })),
);

const SETTINGS_STORAGE_KEY = "bh_dashboard_settings";

const shortcutPathByCode = {
  Digit1: "/dashboard",
  Digit2: "/dashboard/chatbot",
  Digit3: "/dashboard/products",
  Digit5: "/dashboard/simulator",
  Digit6: "/dashboard/budget",
  Digit7: "/dashboard/profile",
  Digit8: "/dashboard/reclamation",
  Digit9: "/dashboard/parametres",
};

const isEditableTarget = (target) => {
  if (!(target instanceof Element)) return false;

  const tag = (target.tagName || "").toLowerCase();
  if (tag === "input" || tag === "textarea" || tag === "select") return true;

  return Boolean(target.isContentEditable);
};

const getKeyboardNavigationEnabled = () => {
  try {
    const raw = localStorage.getItem(SETTINGS_STORAGE_KEY);
    const parsed = raw ? JSON.parse(raw) : {};
    return Boolean(parsed?.accessibility?.keyboardNavigation);
  } catch {
    return false;
  }
};

export function AppShell() {
  const navigate = useNavigate();
  const [keyboardNavigationEnabled, setKeyboardNavigationEnabled] = useState(() =>
    getKeyboardNavigationEnabled(),
  );

  useEffect(() => {
    const syncKeyboardMode = () => {
      setKeyboardNavigationEnabled(getKeyboardNavigationEnabled());
    };

    syncKeyboardMode();

    const onStorage = (event) => {
      if (!event || !event.key || event.key === SETTINGS_STORAGE_KEY) {
        syncKeyboardMode();
      }
    };

    const onAccessibilityUpdated = () => {
      syncKeyboardMode();
    };

    window.addEventListener("storage", onStorage);
    window.addEventListener("bh-accessibility-updated", onAccessibilityUpdated);

    return () => {
      window.removeEventListener("storage", onStorage);
      window.removeEventListener("bh-accessibility-updated", onAccessibilityUpdated);
    };
  }, []);

  useEffect(() => {
    if (!keyboardNavigationEnabled) return undefined;

    const onKeyDown = (event) => {
      const hasShortcutModifier = event.altKey && !event.ctrlKey && !event.metaKey;
      if (!hasShortcutModifier) {
        return;
      }

      if (isEditableTarget(event.target)) {
        return;
      }

      const targetPath = shortcutPathByCode[event.code];
      if (!targetPath) {
        return;
      }

      event.preventDefault();
      navigate(targetPath);
    };

    window.addEventListener("keydown", onKeyDown, true);
    return () => {
      window.removeEventListener("keydown", onKeyDown, true);
    };
  }, [keyboardNavigationEnabled, navigate]);

  return (
    <>
      <Outlet />
      <Suspense fallback={null}>
        <LazyScreenReaderDock />
      </Suspense>
    </>
  );
}
