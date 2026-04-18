import { createContext, useEffect, useMemo, useState } from "react";

const STORAGE_KEY = "bh_user_ui_preferences";

const DEFAULT_PREFERENCES = {
  chatbotName: "BH Advisor",
  userGender: "male",
};

const UserPreferencesContext = createContext(null);

function normalizePreferences(raw = {}) {
  const chatbotName = String(raw.chatbotName || DEFAULT_PREFERENCES.chatbotName)
    .trim()
    .slice(0, 32);
  const userGender = raw.userGender === "female" ? "female" : "male";

  return {
    chatbotName: chatbotName || DEFAULT_PREFERENCES.chatbotName,
    userGender,
  };
}

export function UserPreferencesProvider({ children }) {
  const [preferences, setPreferences] = useState(() => {
    try {
      const raw = localStorage.getItem(STORAGE_KEY);
      if (!raw) return DEFAULT_PREFERENCES;
      return normalizePreferences(JSON.parse(raw));
    } catch {
      return DEFAULT_PREFERENCES;
    }
  });

  useEffect(() => {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(preferences));
  }, [preferences]);

  const updatePreference = (key, value) => {
    setPreferences((prev) => normalizePreferences({ ...prev, [key]: value }));
  };

  const value = useMemo(
    () => ({
      ...preferences,
      setChatbotName: (name) => updatePreference("chatbotName", name),
      setUserGender: (gender) => updatePreference("userGender", gender),
      resetUserPreferences: () => setPreferences(DEFAULT_PREFERENCES),
    }),
    [preferences],
  );

  return <UserPreferencesContext.Provider value={value}>{children}</UserPreferencesContext.Provider>;
}
