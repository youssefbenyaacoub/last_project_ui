import { useEffect, useMemo, useRef, useState } from "react";
import { Link, Outlet, useLocation, useNavigate } from "react-router";
import {
  ArrowUpRight,
  BellRing,
  LayoutDashboard,
  Menu,
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
  Sparkles,
  X,
} from "lucide-react";

import { useTheme } from "../contexts/ThemeContext";
import { useLanguage } from "../contexts/LanguageContext";
import {
  clearAuthSession,
  getClientRecommendation,
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

const ENTRY_POPUP_DELAY_MS = 1400;
const BETWEEN_NOTIFICATIONS_DELAY_MS = 20000;
const POPUP_AUTO_CLOSE_MS = 9000;
const POPUP_AUTO_CLOSE_EXPANDED_MS = 15000;
const SCROLL_TRIGGER_PX = 220;
const ONBOARDING_FIRST_LOGIN_DONE_PREFIX = "bh_onboarding_first_login_done_";

const notificationPopupCopy = {
  en: {
    smartTitle: "Smart notification",
    viewProduct: "View product",
    openTarget: "Open link",
    tapToOpen: "Tap to open details",
    closeLabel: "Close",
    productSuggestionTitle: "Suggested for you",
    productSuggestionMessage: "We selected this product based on your current profile.",
    spendingSuggestionTitle: "Spending-based suggestion",
  },
  fr: {
    smartTitle: "Notification intelligente",
    viewProduct: "Voir le produit",
    openTarget: "Ouvrir le lien",
    tapToOpen: "Cliquez pour ouvrir les details",
    closeLabel: "Fermer",
    productSuggestionTitle: "Suggestion pour vous",
    productSuggestionMessage: "Ce produit est selectionne selon votre profil actuel.",
    spendingSuggestionTitle: "Suggestion basee sur vos depenses",
  },
  ar: {
    smartTitle: "Notification",
    viewProduct: "View product",
    openTarget: "Open link",
    tapToOpen: "Tap to open",
    closeLabel: "Close",
    productSuggestionTitle: "Suggestion",
    productSuggestionMessage: "Product selected based on your profile.",
    spendingSuggestionTitle: "Spending suggestion",
  },
};

const getPopupUi = (language) => notificationPopupCopy[language] || notificationPopupCopy.fr;

const getPrimaryRecommendedProduct = (recommendation) => {
  const rawRecommendations = Array.isArray(recommendation?.recommended_products)
    ? recommendation.recommended_products
    : [];

  for (const item of rawRecommendations) {
    if (typeof item === "string" && item.trim()) {
      return item.trim();
    }

    if (item && typeof item === "object") {
      const candidate = String(item.product_name || item.name || "").trim();
      if (candidate) return candidate;
    }
  }

  return "";
};

const buildPortalPopupNotifications = (recommendation, ui) => {
  const notificationsFromApi = Array.isArray(recommendation?.portal_notifications)
    ? recommendation.portal_notifications
        .filter((item) => item && typeof item === "object")
        .map((item, index) => ({
          id: item.id || `api-${index}`,
          type: item.type || "info",
          title: String(item.title || "").trim(),
          message: String(item.message || "").trim(),
          ctaLabel: String(item.cta_label || ui.viewProduct).trim() || ui.viewProduct,
          ctaPath: String(item.cta_path || "/dashboard/products").trim() || "/dashboard/products",
        }))
        .filter((item) => item.title || item.message)
    : [];

  if (notificationsFromApi.length > 0) {
    return notificationsFromApi.slice(0, 3);
  }

  const featuredProduct = getPrimaryRecommendedProduct(recommendation);
  const topSpendingCategory = recommendation?.spending_signals?.top_category;
  const topSpendingLabel = String(topSpendingCategory?.label || "").trim();
  const topSpendingPct = Number(topSpendingCategory?.percentage || 0);

  const fallback = [];

  if (featuredProduct) {
    fallback.push({
      id: "fallback-product",
      type: "product",
      title: `${ui.productSuggestionTitle}: ${featuredProduct}`,
      message: ui.productSuggestionMessage,
      ctaLabel: ui.viewProduct,
      ctaPath: "/dashboard/products",
    });
  }

  if (featuredProduct && topSpendingLabel) {
    const pctText = Number.isFinite(topSpendingPct) && topSpendingPct > 0
      ? `${Math.round(topSpendingPct)}%`
      : "-";

    fallback.push({
      id: "fallback-spending",
      type: "spending_match",
      title: ui.spendingSuggestionTitle,
      message: `${topSpendingLabel} (${pctText}) -> ${featuredProduct}`,
      ctaLabel: ui.viewProduct,
      ctaPath: "/dashboard/products",
    });
  }

  return fallback.slice(0, 2);
};

const isTruthyFlag = (value) =>
  value === true || String(value ?? "").trim().toLowerCase() === "true";

const hasAnyMeaningfulValue = (value) => {
  if (Array.isArray(value)) return value.length > 0;
  if (value && typeof value === "object") return Object.keys(value).length > 0;
  return String(value ?? "").trim() !== "";
};

const isOnboardingCompleted = (formResponse) => {
  const formData = formResponse?.form_data || {};

  if (isTruthyFlag(formResponse?.form_completed) || isTruthyFlag(formData?.form_completed)) {
    return true;
  }

  // Keep compatibility with previously saved payloads.
  if (hasAnyMeaningfulValue(formData?.submitted_at) || hasAnyMeaningfulValue(formResponse?.submitted_at)) {
    return true;
  }

  return false;
};

const getOnboardingFirstLoginDoneKey = (clientId) =>
  `${ONBOARDING_FIRST_LOGIN_DONE_PREFIX}${clientId}`;

export function Layout() {
  const location = useLocation();
  const navigate = useNavigate();
  const clientId = getClientId();

  const { theme } = useTheme();
  const { t, isRTL, language, setLanguage } = useLanguage();
  const popupUi = useMemo(() => getPopupUi(language), [language]);
  const isChatbotPage = location.pathname.startsWith("/dashboard/chatbot");

  const languageOptions = [
    {
      code: "ar",
      label: "Arabic",
      flag: flagAr,
      flagAlt: "Tunisia flag",
    },
    {
      code: "en",
      label: "English",
      flag: flagEn,
      flagAlt: "United Kingdom flag",
    },
    {
      code: "fr",
      label: "Francais",
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
  const [popupRecommendation, setPopupRecommendation] = useState(null);
  const [activePopup, setActivePopup] = useState(null);
  const [popupExpanded, setPopupExpanded] = useState(false);
  const [entryPopupShown, setEntryPopupShown] = useState(false);
  const [scrollPopupShown, setScrollPopupShown] = useState(false);
  const [scrollTriggerReached, setScrollTriggerReached] = useState(false);
  const [isMobileSidebarOpen, setIsMobileSidebarOpen] = useState(false);

  const firstPopupTimestampRef = useRef(0);
  const mainScrollRef = useRef(null);

  useEffect(() => {
    let isMounted = true;

    const loadOnboardingStatus = async () => {
      const clientId = getClientId();
      if (!clientId) return;

      // Avoid random onboarding popups across pages and HMR reloads.
      if (location.pathname !== "/dashboard") {
        if (isMounted) {
          setOnboardingOpen(false);
        }
        return;
      }

      const firstLoginDoneKey = getOnboardingFirstLoginDoneKey(clientId);
      if (localStorage.getItem(firstLoginDoneKey) === "1") {
        if (isMounted) {
          setOnboardingOpen(false);
        }
        return;
      }

      let schemaData = null;
      try {
        schemaData = await getFormSchema();

        if (!isMounted) return;
        setOnboardingSchema(schemaData || null);

        const formData = await getFormData(clientId);

        if (!isMounted) return;

        const initialData = formData?.form_data || {};
        const completed = isOnboardingCompleted(formData);

        setOnboardingSchema(schemaData || null);
        setOnboardingInitialData(initialData);
        const shouldOpen = !completed;
        setOnboardingOpen(shouldOpen);

        // First-login onboarding can be shown only once per client on this browser.
        localStorage.setItem(firstLoginDoneKey, "1");
      } catch {
        if (!isMounted) return;

        setOnboardingSchema(schemaData || null);
        setOnboardingInitialData({});

        // Never auto-open onboarding on transient errors; this avoids random popups.
        setOnboardingOpen(false);
      }
    };

    loadOnboardingStatus();

    return () => {
      isMounted = false;
    };
  }, [location.pathname]);

  useEffect(() => {
    setIsMobileSidebarOpen(false);
  }, [location.pathname]);

  useEffect(() => {
    let isMounted = true;

    const loadPopupRecommendation = async () => {
      if (!clientId) {
        if (isMounted) {
          setPopupRecommendation(null);
        }
        return;
      }

      try {
        const recommendationData = await getClientRecommendation(clientId);
        if (isMounted) {
          setPopupRecommendation(recommendationData || null);
        }
      } catch {
        if (isMounted) {
          setPopupRecommendation(null);
        }
      }
    };

    loadPopupRecommendation();

    return () => {
      isMounted = false;
    };
  }, [clientId]);

  const popupNotifications = useMemo(
    () => buildPortalPopupNotifications(popupRecommendation, popupUi),
    [popupRecommendation, popupUi],
  );

  const followupPopupNotification = popupNotifications.length > 1
    ? popupNotifications[popupNotifications.length - 1]
    : null;

  useEffect(() => {
    const scrollNode = mainScrollRef.current;
    if (!scrollNode) return undefined;

    const handleScroll = () => {
      if (scrollNode.scrollTop >= SCROLL_TRIGGER_PX) {
        setScrollTriggerReached(true);
      }
    };

    scrollNode.addEventListener("scroll", handleScroll, { passive: true });
    return () => {
      scrollNode.removeEventListener("scroll", handleScroll);
    };
  }, []);

  useEffect(() => {
    if (isChatbotPage) {
      setActivePopup(null);
      setPopupExpanded(false);
    }
  }, [isChatbotPage]);

  useEffect(() => {
    if (activePopup) {
      setPopupExpanded(false);
    }
  }, [activePopup]);

  useEffect(() => {
    if (entryPopupShown || isChatbotPage || popupNotifications.length === 0) return undefined;

    const firstPopup = popupNotifications[0];
    const timer = window.setTimeout(() => {
      setActivePopup(firstPopup);
      setEntryPopupShown(true);
      firstPopupTimestampRef.current = Date.now();
    }, ENTRY_POPUP_DELAY_MS);

    return () => {
      window.clearTimeout(timer);
    };
  }, [entryPopupShown, isChatbotPage, popupNotifications]);

  useEffect(() => {
    if (isChatbotPage || !entryPopupShown || scrollPopupShown || !scrollTriggerReached || !followupPopupNotification) {
      return undefined;
    }

    const elapsedSinceFirst = Date.now() - firstPopupTimestampRef.current;
    const waitMs = Math.max(0, BETWEEN_NOTIFICATIONS_DELAY_MS - elapsedSinceFirst);

    const timer = window.setTimeout(() => {
      setActivePopup(followupPopupNotification);
      setScrollPopupShown(true);
    }, waitMs);

    return () => {
      window.clearTimeout(timer);
    };
  }, [
    entryPopupShown,
    followupPopupNotification,
    isChatbotPage,
    scrollPopupShown,
    scrollTriggerReached,
  ]);

  useEffect(() => {
    if (!activePopup || isChatbotPage) return undefined;

    const timeoutMs = popupExpanded ? POPUP_AUTO_CLOSE_EXPANDED_MS : POPUP_AUTO_CLOSE_MS;
    const timer = window.setTimeout(() => {
      setActivePopup(null);
      setPopupExpanded(false);
    }, timeoutMs);

    return () => {
      window.clearTimeout(timer);
    };
  }, [activePopup, isChatbotPage, popupExpanded]);

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

  const activeMenuLabel =
    [...menuItems]
      .sort((a, b) => b.path.length - a.path.length)
      .find(
        (item) =>
          location.pathname === item.path ||
          location.pathname.startsWith(`${item.path}/`),
      )?.label || t("dashboard");

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
      localStorage.setItem(getOnboardingFirstLoginDoneKey(clientId), "1");
    } catch (error) {
      setOnboardingError(
        error?.message || "Impossible d'enregistrer le formulaire."
      );
    } finally {
      setOnboardingSaving(false);
    }
  };

  const closePopup = () => {
    setActivePopup(null);
    setPopupExpanded(false);
  };

  const promotePopupToTop = () => {
    setPopupExpanded(true);
  };

  const openPopupCta = () => {
    const targetPath = activePopup?.ctaPath || "/dashboard/products";
    setActivePopup(null);
    setPopupExpanded(false);
    navigate(targetPath);
  };

  const renderSidebarContent = ({ mobile = false } = {}) => {
    const sidebarExpanded = mobile ? true : isExpanded;

    return (
      <>
        {mobile ? (
          <div className={`mb-4 flex items-center justify-between px-3 ${isRTL ? "flex-row-reverse" : ""}`}>
            <img src={logoExpanded} alt="BH Bank" className="h-8 w-auto" />
            <button
              type="button"
              onClick={() => setIsMobileSidebarOpen(false)}
              className={`rounded-lg p-2 ${theme === "dark" ? "text-gray-300 hover:bg-white/10" : "text-[#214b89] hover:bg-[#e4ecfb]"}`}
              aria-label="Close menu"
            >
              <X className="h-4 w-4" />
            </button>
          </div>
        ) : (
          <>
            <div className="mb-7 px-3">
              {sidebarExpanded ? (
                <img src={logoExpanded} alt="BH Bank" className="h-auto w-full" />
              ) : (
                <img src={logoCollapsed} alt="BH" className="mx-auto h-10 w-10" />
              )}
            </div>

            <button
              type="button"
              onClick={() => setIsExpanded(!isExpanded)}
              className={`mx-3 mb-6 rounded-lg p-2 transition-colors ${theme === "dark" ? "text-gray-300 hover:bg-white/10" : "text-[#214b89] hover:bg-[#e4ecfb]"}`}
            >
              {isExpanded ? <ChevronLeft className="h-5 w-5" /> : <ChevronRight className="h-5 w-5" />}
            </button>
          </>
        )}

        <nav className="flex flex-1 flex-col space-y-2 px-3">
          {menuItems.map((item) => {
            const isActive = location.pathname === item.path;

            return (
              <Link
                key={item.path}
                to={item.path}
                onClick={mobile ? () => setIsMobileSidebarOpen(false) : undefined}
                className={`flex items-center gap-2.5 rounded-2xl px-2.5 py-2.5 transition-colors ${
                  isActive
                    ? "bg-white text-[#242f54]"
                    : theme === "dark"
                      ? "text-gray-300 hover:bg-white/10 hover:text-white"
                      : "text-[#4d5f7d] hover:bg-[#e8effb] hover:text-[#242f54]"
                } ${isRTL ? "flex-row-reverse" : ""}`}
              >
                <item.icon className="h-5 w-4.5 shrink-0" />

                {sidebarExpanded && <span className="text-sm font-medium">{item.label}</span>}
              </Link>
            );
          })}
        </nav>

        <div className="mt-3 px-3">
          <div
            className={`rounded-xl border p-1.5 ${
              theme === "dark"
                ? "border-gray-600 bg-gray-800"
                : "border-gray-200 bg-gray-100"
            } ${sidebarExpanded ? "flex items-center gap-1" : "flex flex-col gap-1"}`}
          >
            {languageOptions.map((option) => (
              <button
                key={option.code}
                onClick={() => setLanguage(option.code)}
                className={`flex items-center justify-center rounded-md border py-1.5 text-[10px] font-semibold transition-colors ${
                  sidebarExpanded ? "flex-1" : "w-full"
                } ${
                  language === option.code
                    ? "border-blue-600 bg-blue-600 text-white"
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
              </button>
            ))}
          </div>
        </div>

        <div className="mt-4 px-3">
          <button
            type="button"
            onClick={() => {
              handleLogout();
              if (mobile) setIsMobileSidebarOpen(false);
            }}
            className={`flex w-full items-center gap-3 rounded-lg px-3 py-3 text-red-400 transition-colors hover:bg-white/10 hover:text-red-300 ${isRTL ? "flex-row-reverse" : ""}`}
          >
            <LogOut className="h-5 w-4.5 shrink-0" />

            {sidebarExpanded && (
              <span className="text-sm font-medium">{t("logout")}</span>
            )}
          </button>
        </div>
      </>
    );
  };

  return (
    <div
      className={`flex min-h-dvh h-dvh overflow-hidden ${
        theme === "dark" ? "bg-gray-900" : "bg-[#f9f9f9]"
      }`}
    >
      <aside
        className={`${
          theme === "dark" ? "bg-gray-900" : "bg-[#f9f9f9]"
        } hidden flex-col py-6 transition-all duration-300 lg:flex ${
          isExpanded ? "w-40" : "w-16"
        }`}
      >
        {renderSidebarContent()}
      </aside>

      {isMobileSidebarOpen && (
        <div className="fixed inset-0 z-40 lg:hidden">
          <button
            type="button"
            aria-label="Close sidebar"
            onClick={() => setIsMobileSidebarOpen(false)}
            className="absolute inset-0 bg-black/40"
          />

          <aside
            className={`absolute inset-y-0 ${isRTL ? "right-0" : "left-0"} flex w-[82vw] max-w-xs flex-col py-5 shadow-2xl ${
              theme === "dark" ? "bg-gray-900" : "bg-[#f9f9f9]"
            }`}
          >
            {renderSidebarContent({ mobile: true })}
          </aside>
        </div>
      )}

      <div
        className={`flex min-w-0 flex-1 flex-col overflow-hidden shadow-lg ${
          theme === "dark" ? "bg-[#0f172a]" : "bg-white"
        } rounded-none ${
          isRTL ? "lg:rounded-tr-[25px]" : "lg:rounded-tl-[25px]"
        }`}
      >
        <header
          className={`flex items-center justify-between border-b px-3 py-2 lg:hidden ${
            theme === "dark"
              ? "border-white/10 bg-[#0f172a] text-white"
              : "border-[#e2e8f2] bg-white text-[#182540]"
          } ${isRTL ? "flex-row-reverse" : ""}`}
        >
          <button
            type="button"
            onClick={() => setIsMobileSidebarOpen(true)}
            className={`inline-flex h-9 w-9 items-center justify-center rounded-lg ${
              theme === "dark" ? "bg-white/10" : "bg-[#eef3fb]"
            }`}
            aria-label="Open menu"
          >
            <Menu className="h-4.5 w-4.5" />
          </button>

          <p className="truncate text-sm font-semibold">{activeMenuLabel}</p>

          <img src={logoCollapsed} alt="BH" className="h-8 w-8" />
        </header>

        <main ref={mainScrollRef} className="min-h-0 flex-1 overflow-auto">
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

      {activePopup && !isChatbotPage && (
        <div
          className={`pointer-events-none fixed z-50 w-[min(92vw,24rem)] transition-all duration-500 ${
            popupExpanded
              ? "left-1/2 top-4 -translate-x-1/2"
              : isRTL
                ? "bottom-5 left-5"
                : "bottom-5 right-5"
          }`}
        >
          {popupExpanded ? (
            <div
              className={`pointer-events-auto relative overflow-hidden rounded-2xl border shadow-[0_20px_56px_-30px_rgba(2,6,23,0.82)] ${
                theme === "dark"
                  ? "border-slate-700 bg-linear-to-br from-slate-900 via-slate-900 to-slate-800 text-slate-100"
                  : "border-blue-200 bg-linear-to-br from-white via-[#f8fbff] to-[#e9f3ff] text-[#1e2f4a]"
              }`}
            >
              <div className="relative p-3.5">
                <div
                  className={`mb-2 inline-flex items-center gap-2 rounded-full border px-2.5 py-1 text-[11px] font-semibold tracking-wide ${
                    theme === "dark"
                      ? "border-slate-600/80 bg-slate-800/80 text-slate-200"
                      : "border-blue-200 bg-blue-50/90 text-blue-700"
                  } ${isRTL ? "flex-row-reverse" : ""}`}
                >
                  {activePopup.type === "spending_match" ? <Sparkles className="h-3.5 w-3.5" /> : <BellRing className="h-3.5 w-3.5" />}
                  {popupUi.smartTitle}
                </div>

                <div className={`flex items-start gap-2.5 ${isRTL ? "flex-row-reverse" : ""}`}>
                  <div
                    className={`mt-0.5 flex h-9 w-9 shrink-0 items-center justify-center rounded-xl ${
                      theme === "dark" ? "bg-cyan-900/45 text-cyan-300" : "bg-blue-100 text-blue-700"
                    }`}
                  >
                    {activePopup.type === "spending_match" ? <Sparkles className="h-4.5 w-4.5" /> : <BellRing className="h-4.5 w-4.5" />}
                  </div>

                  <div className="min-w-0 flex-1">
                    <p className="text-sm font-semibold leading-tight">{activePopup.title || popupUi.smartTitle}</p>
                    {activePopup.message && (
                      <p className={`mt-1 text-xs leading-relaxed ${theme === "dark" ? "text-slate-300" : "text-[#506689]"}`}>
                        {activePopup.message}
                      </p>
                    )}

                    <div className={`mt-3 flex items-center gap-2 ${isRTL ? "flex-row-reverse" : ""}`}>
                      <button
                        type="button"
                        onClick={openPopupCta}
                        className={`inline-flex items-center gap-1.5 rounded-lg px-2.5 py-1.5 text-xs font-semibold ${
                          theme === "dark"
                            ? "bg-cyan-500/20 text-cyan-200 hover:bg-cyan-500/30"
                            : "bg-blue-600 text-white hover:bg-blue-700"
                        } ${isRTL ? "flex-row-reverse" : ""}`}
                      >
                        {activePopup.ctaLabel || popupUi.openTarget}
                        <ArrowUpRight className="h-3.5 w-3.5" />
                      </button>
                    </div>
                  </div>

                  <button
                    type="button"
                    onClick={closePopup}
                    aria-label={popupUi.closeLabel}
                    className={`rounded-md p-1 ${theme === "dark" ? "text-slate-400 hover:bg-slate-800" : "text-gray-500 hover:bg-gray-100"}`}
                  >
                    <X className="h-4 w-4" />
                  </button>
                </div>
              </div>
            </div>
          ) : (
            <div className="pointer-events-auto relative">
              <button
                type="button"
                onClick={promotePopupToTop}
                className={`w-full overflow-hidden rounded-2xl border p-3 text-left shadow-[0_16px_42px_-24px_rgba(2,6,23,0.85)] transition-transform hover:-translate-y-0.5 ${
                  theme === "dark"
                    ? "border-slate-700 bg-slate-900/95 text-slate-100"
                    : "border-blue-200 bg-white/98 text-[#1e2f4a]"
                }`}
              >
                <div className={`relative flex items-center gap-2.5 ${isRTL ? "flex-row-reverse" : ""}`}>
                  <div
                    className={`flex h-8 w-8 shrink-0 items-center justify-center rounded-lg ${
                      theme === "dark" ? "bg-cyan-900/45" : "bg-blue-100"
                    }`}
                  >
                    {activePopup.type === "spending_match" ? (
                      <Sparkles className={`h-4 w-4 ${theme === "dark" ? "text-cyan-300" : "text-blue-700"}`} />
                    ) : (
                      <BellRing className={`h-4 w-4 ${theme === "dark" ? "text-cyan-300" : "text-blue-700"}`} />
                    )}
                  </div>
                  <div className="min-w-0">
                    <p className="truncate text-sm font-semibold leading-tight">{activePopup.title || popupUi.smartTitle}</p>
                    <p className={`text-[11px] ${theme === "dark" ? "text-slate-300" : "text-[#5c7090]"}`}>
                      {popupUi.tapToOpen}
                    </p>
                  </div>

                  <span className={`inline-flex h-6 w-6 items-center justify-center rounded-md ${theme === "dark" ? "bg-slate-800 text-slate-300" : "bg-blue-50 text-blue-700"}`}>
                    <ArrowUpRight className="h-3.5 w-3.5" />
                  </span>
                </div>
              </button>
              <button
                type="button"
                onClick={closePopup}
                aria-label={popupUi.closeLabel}
                className={`absolute top-2 ${isRTL ? "left-2" : "right-2"} rounded-md p-1 ${
                  theme === "dark" ? "text-slate-400 hover:bg-slate-800" : "text-gray-500 hover:bg-gray-100"
                }`}
              >
                <X className="h-3.5 w-3.5" />
              </button>
            </div>
          )}
        </div>
      )}
    </div>
  );
}
