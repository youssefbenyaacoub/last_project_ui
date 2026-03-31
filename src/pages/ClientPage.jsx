import { useEffect } from "react";
import { useNavigate } from "react-router";
import { useTheme } from "../contexts/ThemeContext";
import { useLanguage } from "../contexts/LanguageContext";

export function ClientPage() {
  const navigate = useNavigate();
  const { theme } = useTheme();
  const { language } = useLanguage();

  useEffect(() => {
    // Redirect to dashboard after a brief moment
    const timer = setTimeout(() => {
      navigate("/dashboard");
    }, 1500);

    return () => clearTimeout(timer);
  }, [navigate]);

  return (
    <div
      className={`min-h-screen flex items-center justify-center ${theme === "dark" ? "bg-gray-900" : "bg-linear-to-br from-blue-50 to-white"}`}
    >
      <div className="text-center space-y-6">
        <div className="w-20 h-20 border-4 border-[#242f54] border-t-transparent rounded-full animate-spin mx-auto"></div>
        <h2
          className={`text-2xl font-semibold ${theme === "dark" ? "text-white" : "text-gray-900"}`}
        >
          {language === "fr"
            ? "Chargement de votre espace..."
            : "Loading your space..."}
        </h2>
        <p
          className={`${theme === "dark" ? "text-gray-400" : "text-gray-600"}`}
        >
          {language === "fr" ? "Veuillez patienter" : "Please wait"}
        </p>
      </div>
    </div>
  );
}
