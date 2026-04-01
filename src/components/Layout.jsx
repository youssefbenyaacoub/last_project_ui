import { useEffect, useState } from "react";
import { Link, Outlet, useLocation, useNavigate } from "react-router";
import {
  LayoutDashboard,
  MessageSquare,
  Package,
  Gauge,
  Wallet,
  User,
  AlertCircle,
  Settings,
  LogOut,
  ChevronRight,
  ChevronLeft,
} from "lucide-react";

import { useTheme } from "../contexts/ThemeContext";
import { useLanguage } from "../contexts/LanguageContext";
import {
  clearAuthSession,
  getClientId,
  getFormData,
  getFormSchema,
  submitForm,
} from "../api";
import { FirstLoginFormModal } from "./FirstLoginFormModal";

import logoExpanded from "../assets/BH_logo2.png";
import logoCollapsed from "../assets/BH_logo3.png";
import flagAr from "../assets/flags/Flag_of_Tunisia.svg.webp";
import flagEn from "../assets/flags/Flag_of_the_United_Kingdom_(3-5).svg.webp";
import flagFr from "../assets/flags/Flag_of_France.svg.png";

export function Layout() {
  const location = useLocation();
  const navigate = useNavigate();

  const { theme } = useTheme();
  const { t, isRTL, language, setLanguage } = useLanguage();

  const languageOptions = [
    {
      code: "ar",
      label: "AR",
      flag: flagAr,
      flagAlt: "Tunisia flag",
    },
    {
      code: "en",
      label: "EN",
      flag: flagEn,
      flagAlt: "United Kingdom flag",
    },
    {
      code: "fr",
      label: "FR",
      flag: flagFr,
      flagAlt: "France flag",
    },
  ];

  // sidebar expand / collapse
  const [isExpanded, setIsExpanded] = useState(false);
  const [onboardingSchema, setOnboardingSchema] = useState(null);
  const [onboardingInitialData, setOnboardingInitialData] = useState({});
  const [onboardingOpen, setOnboardingOpen] = useState(false);
  const [onboardingSaving, setOnboardingSaving] = useState(false);
  const [onboardingError, setOnboardingError] = useState("");

  useEffect(() => {
    let isMounted = true;

    const loadOnboardingStatus = async () => {
      const clientId = getClientId();
      if (!clientId) return;

      try {
        const [schemaData, formData] = await Promise.all([
          getFormSchema(),
          getFormData(clientId),
        ]);

        if (!isMounted) return;

        const initialData = formData?.form_data || {};
        const completed =
          formData?.form_completed === true ||
          String(formData?.form_completed || "").toLowerCase() === "true";

        setOnboardingSchema(schemaData || null);
        setOnboardingInitialData(initialData);
        setOnboardingOpen(!completed);
      } catch {
        if (!isMounted) return;
        setOnboardingSchema(null);
        setOnboardingInitialData({});
        setOnboardingOpen(false);
      }
    };

    loadOnboardingStatus();

    return () => {
      isMounted = false;
    };
  }, []);

  const menuItems = [
    { path: "/dashboard", label: t("dashboard"), icon: LayoutDashboard },
    { path: "/dashboard/chatbot", label: t("chatbot"), icon: MessageSquare },
    { path: "/dashboard/products", label: t("products"), icon: Package },
    { path: "/dashboard/simulator", label: t("simulator"), icon: Gauge },
    { path: "/dashboard/budget", label: t("budget"), icon: Wallet },
    { path: "/dashboard/profile", label: t("profile"), icon: User },
    { path: "/dashboard/reclamation", label: t("claims"), icon: AlertCircle },
    { path: "/dashboard/parametres", label: t("settings"), icon: Settings },
  ];

  const handleLogout = () => {
    clearAuthSession();
    navigate("/");
  };

  const handleOnboardingSubmit = async (payload) => {
    const clientId = getClientId();
    if (!clientId) return;

    try {
      setOnboardingSaving(true);
      setOnboardingError("");
      await submitForm(clientId, payload);
      setOnboardingOpen(false);
    } catch (error) {
      setOnboardingError(
        error?.message || "Impossible d'enregistrer le formulaire."
      );
    } finally {
      setOnboardingSaving(false);
    }
  };

  return (
    <div
      className={`flex h-screen ${
        theme === "dark" ? "bg-gray-900" : "bg-[#f9f9f9]"
      }`}
    >
      {/* Sidebar */}
      <aside
        className={`${
          theme === "dark" ? "bg-gray-900" : "bg-[#f9f9f9]"
        } flex flex-col py-6 transition-all duration-300 ${
          isExpanded ? "w-40" : "w-16"
        }`}
      >
        {/* Logo */}
        <div className="px-3 mb-7">
          {isExpanded ? (
            <img src={logoExpanded} alt="BH Bank" className="w-full h-auto" />
          ) : (
            <img src={logoCollapsed} alt="BH" className="w-10 h-10 mx-auto" />
          )}
        </div>

        {/* Toggle Sidebar */}
        <button
          onClick={() => setIsExpanded(!isExpanded)}
          className="mx-3 mb-6 p-2 text-gray-300 hover:bg-white/10 rounded-lg"
        >
          {isExpanded ? (
            <ChevronLeft className="w-5 h-5" />
          ) : (
            <ChevronRight className="w-5 h-5" />
          )}
        </button>

        {/* Navigation */}
        <nav className="flex-1 flex flex-col space-y-2 px-3">
          {menuItems.map((item) => {
            const isActive = location.pathname === item.path;

            return (
              <Link
                key={item.path}
                to={item.path}
                className={`flex items-center gap-2.5 px-2.5 py-2.5 rounded-2xl transition-colors ${
                  isActive
                    ? "bg-white text-[#242f54]"
                    : "text-gray-300 hover:text-[#242f54] hover:bg-white/10"
                } ${isRTL ? "flex-row-reverse" : ""}`}
              >
                <item.icon className="w-4.5 h-5 shrink-0" />

                {isExpanded && (
                  <span className="text-sm font-medium">{item.label}</span>
                )}
              </Link>
            );
          })}
        </nav>

        {/* Logout */}
        <div className="px-3 mt-3">
          <div
            className={`rounded-xl border p-1.5 ${
              theme === "dark"
                ? "border-gray-600 bg-gray-800"
                : "border-gray-200 bg-gray-100"
            } ${isExpanded ? "flex items-center gap-1" : "flex flex-col gap-1"}`}
          >
            {languageOptions.map((option) => (
              <button
                key={option.code}
                onClick={() => setLanguage(option.code)}
                className={`rounded-md border text-[10px] font-semibold py-1.5 transition-colors flex items-center justify-center gap-1.5 ${
                  isExpanded ? "flex-1" : "w-full"
                } ${
                  language === option.code
                    ? "bg-blue-600 border-blue-600 text-white"
                    : theme === "dark"
                      ? "border-gray-500 text-gray-300 hover:bg-gray-700"
                      : "border-gray-300 bg-white text-gray-700 hover:bg-gray-50"
                }`}
                aria-label={`Switch language to ${option.label}`}
              >
                <img
                  src={option.flag}
                  alt={option.flagAlt}
                  className={`h-3.5 w-5 rounded-xs object-cover ${
                    language === option.code ? "ring-1 ring-white/80" : ""
                  }`}
                />
                {isExpanded && <span>{option.label}</span>}
              </button>
            ))}
          </div>
        </div>

        <div className="px-3 mt-4">
          <button
            onClick={handleLogout}
            className={`flex items-center gap-3 px-3 py-3 rounded-lg text-red-400 hover:text-red-300 hover:bg-white/10 transition-colors w-full ${isRTL ? "flex-row-reverse" : ""}`}
          >
            <LogOut className="w-4.5 h-5 shrink-0" />

            {isExpanded && (
              <span className="text-sm font-medium">{t("logout")}</span>
            )}
          </button>
        </div>
      </aside>

      {/* Main Content */}
      <div
        className={`flex-1 flex flex-col overflow-hidden shadow-lg bg-white ${
          isRTL ? "rounded-tr-[25px]" : "rounded-tl-[25px]"
        }`}
      >
        <main className="flex-1 overflow-auto">
          <Outlet />
        </main>
      </div>

      {onboardingOpen && (
        <FirstLoginFormModal
          schema={onboardingSchema}
          initialData={onboardingInitialData}
          isSaving={onboardingSaving}
          error={onboardingError}
          onSubmit={handleOnboardingSubmit}
        />
      )}
    </div>
  );
}
