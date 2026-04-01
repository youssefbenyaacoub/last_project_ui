import { RouterProvider } from "react-router-dom";
import { router } from "./Routes.jsx";
import { ThemeProvider } from "./contexts/ThemeContext";
import { LanguageProvider } from "./contexts/LanguageContext";
import { UserPreferencesProvider } from "./contexts/UserPreferencesContext";

export default function App() {
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
