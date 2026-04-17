import { useEffect } from "react";
import { useNavigate } from "react-router";
import { useTheme } from "../contexts/ThemeContext";
import { useLanguage } from "../contexts/LanguageContext";
import { Skeleton, SkeletonLines } from "../components/Skeleton";

const loadingCopyByLanguage = {
  fr: {
    title: "Chargement de votre espace...",
    subtitle: "Veuillez patienter",
  },
  en: {
    title: "Loading your space...",
    subtitle: "Please wait",
  },
  ar: {
    title: "جاري تحميل مساحتك...",
    subtitle: "يرجى الانتظار",
  },
};

export function ClientPage() {
  const navigate = useNavigate();
  const { theme } = useTheme();
  const { language } = useLanguage();
  const copy = loadingCopyByLanguage[language] || loadingCopyByLanguage.en;

  useEffect(() => {
    // Redirect to dashboard after a brief moment
    const timer = setTimeout(() => {
      navigate("/dashboard");
    }, 1500);

    return () => clearTimeout(timer);
  }, [navigate]);

  return (
    <div
      className={`min-h-screen flex items-center justify-center px-4 ${theme === "dark" ? "skeleton-dark bg-gray-900" : "bg-linear-to-br from-blue-50 to-white"}`}
    >
      <div
        className={`w-full max-w-md space-y-5 rounded-2xl border p-6 ${
          theme === "dark" ? "border-white/10 bg-[#111d33]" : "border-gray-200 bg-white/90"
        }`}
      >
        <p className="sr-only">{copy.title}</p>
        <Skeleton className="h-7 w-48 rounded-lg" />
        <SkeletonLines lines={2} className="max-w-sm" lineClassName="h-4 rounded-md" lastLineClassName="w-3/4" />
        <div className="space-y-3">
          <Skeleton className="h-11 w-full rounded-xl" />
          <Skeleton className="h-11 w-2/3 rounded-xl" />
        </div>
      </div>
    </div>
  );
}
