import { useEffect, useMemo, useRef, useState } from "react";
import { useNavigate } from "react-router";
import {
  AlertCircle,
  Briefcase,
  Calendar,
  ChevronDown,
  Eye,
  EyeOff,
  PiggyBank,
  TrendingDown,
  TrendingUp,
} from "lucide-react";
import { useTheme } from "../contexts/ThemeContext";
import { useLanguage } from "../contexts/LanguageContext";
import {
  getBudget,
  getClientId,
  getClientRecommendation,
  getMe,
} from "../api";
import { Skeleton, SkeletonLines } from "../components/Skeleton";
import {
  cacheDashboardBudgetMonth,
  isOfflineCacheStale,
  readDashboardBudgetMonthFromCache,
  readDashboardOfflineCache,
  writeDashboardOfflineCache,
} from "../offlineCache";

const dashboardCopy = {
  en: {
    clientFallback: "Client",
    sessionMissing: "Missing session. Please sign in to load your dashboard.",
    loadError: "Unable to load dashboard data.",
    networkError: "No network connection. Reconnect to load your dashboard.",
    serviceUnavailable: "Dashboard service is temporarily unavailable.",
    hideProfile: "Hide profile",
    showProfile: "Show profile",
    totalBalance: "Total Balance",
    paymentLimit: "Payment Limit",
    topCategories: "Top Categories",
    monthlySpending: "Monthly Spending",
    monthlyLabel: "Monthly",
    yearlyLabel: "Yearly",
    lastTransactions: "Last Transactions",
    viewAll: "View All",
    noTransactions: "No transactions available yet.",
    myProfile: "My Profile",
    moreInfo: "More info",
    income: "Income",
    expenses: "Expenses",
    netSavings: "Net savings",
    monthlySalary: "Monthly salary",
    seniority: "Seniority",
    forMonth: "For",
    forFebruary: "For February",
    perMonth: "Per month",
    years: "years",
    cardholder: "CARDHOLDER",
    expires: "EXPIRES",
    used: "used",
    cardLocked: "Card details are hidden.",
    revealCard: "Reveal card",
    hideCard: "Hide card",
    revealCodeLabel: "4-digit card code",
    revealCodePlaceholder: "Enter 4 digits",
    revealCardError: "Unable to reveal card information.",
    invalidCardCode: "Enter a valid 4-digit code.",
    mockCodeLabel: "Mock code",
    cardsCountLabel: "Cards",
    cinLabel: "CIN",
    shoppingLabel: "Shopping",
    groceriesLabel: "Groceries",
    diningLabel: "Dining",
    socialMediaLabel: "Social media",
    entertainmentLabel: "Entertainment",
    musicLabel: "Music",
    notificationsTitle: "Smart Notifications",
    notificationsSubtitle: "Personalized value based on your spending behavior",
    viewProduct: "View product",
    productSuggestionTitle: "Suggested for you",
    productSuggestionMessage: "We selected this product based on your current profile.",
    spendingSuggestionTitle: "Spending-based suggestion",
    healthReportTitle: "Monthly Financial Health",
    healthReportSubtitle: "Automatic recap for your latest closed month.",
    healthReportFor: "For",
    healthReportOpen: "Open report",
    healthReportClose: "Close",
    healthBestDecisions: "Top 3 good decisions",
    healthImprovePoints: "Top 3 improvements",
    healthScoreLabel: "Monthly score",
    healthComparedToPrevious: "vs previous month",
    healthMotivation: "Motivational sentence",
    healthAutoBadge: "Automatic report (1st day)",
    healthUnavailable: "Monthly report is not available right now.",
    healthPrevScore: "Previous score",
    healthIncomeLabel: "Monthly income",
    healthExpensesLabel: "Monthly expenses",
    healthSavingsLabel: "Net savings",
    offlineBanner: "Offline mode enabled. Showing your latest synchronized dashboard data.",
    offlineLastSync: "Last sync",
    staleDataWarning: "Cached data may be outdated (last sync older than 24h).",
    syncInProgress: "Connection restored. Synchronizing data...",
    syncSuccess: "Dashboard synchronized successfully.",
    syncFailed: "Synchronization failed. The app will retry when the network is stable.",
  },
  fr: {
    clientFallback: "Client",
    sessionMissing: "Session absente. Connectez-vous pour charger vos donnees.",
    loadError: "Impossible de charger le tableau de bord.",
    networkError: "Aucune connexion reseau. Reconnectez-vous pour charger votre tableau de bord.",
    serviceUnavailable: "Le service du tableau de bord est temporairement indisponible.",
    hideProfile: "Masquer le profil",
    showProfile: "Afficher le profil",
    totalBalance: "Solde total",
    paymentLimit: "Limite de paiement",
    topCategories: "Top Categories",
    monthlySpending: "Depenses mensuelles",
    monthlyLabel: "Mensuel",
    yearlyLabel: "Annuel",
    lastTransactions: "Dernieres transactions",
    viewAll: "Voir tout",
    noTransactions: "Aucune transaction disponible.",
    myProfile: "Mon Profil",
    moreInfo: "Plus d'infos",
    income: "Revenus",
    expenses: "Depenses",
    netSavings: "Epargne nette",
    monthlySalary: "Salaire mensuel",
    seniority: "Anciennete",
    forMonth: "Pour",
    forFebruary: "Pour fevrier",
    perMonth: "Par mois",
    years: "ans",
    cardholder: "TITULAIRE",
    expires: "EXPIRE",
    used: "utilise",
    cardLocked: "Les informations carte sont masquees.",
    revealCard: "Afficher la carte",
    hideCard: "Masquer la carte",
    revealCodeLabel: "Code carte (4 chiffres)",
    revealCodePlaceholder: "Saisir 4 chiffres",
    revealCardError: "Impossible d'afficher les informations carte.",
    invalidCardCode: "Entrez un code valide de 4 chiffres.",
    mockCodeLabel: "Code mock",
    cardsCountLabel: "Cartes",
    cinLabel: "CIN",
    shoppingLabel: "Shopping",
    groceriesLabel: "Courses",
    diningLabel: "Restauration",
    socialMediaLabel: "Reseaux sociaux",
    entertainmentLabel: "Divertissement",
    musicLabel: "Musique",
    notificationsTitle: "Notifications intelligentes",
    notificationsSubtitle: "Des idees personnalisees basees sur vos habitudes de depense",
    viewProduct: "Voir le produit",
    productSuggestionTitle: "Suggestion pour vous",
    productSuggestionMessage: "Ce produit est selectionne selon votre profil actuel.",
    spendingSuggestionTitle: "Suggestion basee sur vos depenses",
    healthReportTitle: "Sante financiere du mois",
    healthReportSubtitle: "Bilan automatique du dernier mois cloture.",
    healthReportFor: "Pour",
    healthReportOpen: "Voir le rapport",
    healthReportClose: "Fermer",
    healthBestDecisions: "3 meilleures decisions",
    healthImprovePoints: "3 points a ameliorer",
    healthScoreLabel: "Score mensuel",
    healthComparedToPrevious: "vs mois precedent",
    healthMotivation: "Phrase motivante",
    healthAutoBadge: "Rapport auto (1er jour)",
    healthUnavailable: "Le rapport mensuel est indisponible pour le moment.",
    healthPrevScore: "Score precedent",
    healthIncomeLabel: "Revenus du mois",
    healthExpensesLabel: "Depenses du mois",
    healthSavingsLabel: "Epargne nette",
    offlineBanner: "Mode hors ligne active. Affichage des dernieres donnees synchronisees du tableau de bord.",
    offlineLastSync: "Derniere synchro",
    staleDataWarning: "Les donnees en cache peuvent etre anciennes (derniere synchro superieure a 24h).",
    syncInProgress: "Connexion retablie. Synchronisation des donnees...",
    syncSuccess: "Tableau de bord synchronise avec succes.",
    syncFailed: "Echec de synchronisation. L'application reessaiera quand le reseau sera stable.",
  },
  ar: {
    clientFallback: "العميل",
    sessionMissing: "الجلسة غير موجودة. يرجى تسجيل الدخول لتحميل لوحة التحكم.",
    loadError: "تعذر تحميل بيانات لوحة التحكم.",
    networkError: "لا يوجد اتصال بالشبكة. أعد الاتصال لتحميل لوحة التحكم.",
    serviceUnavailable: "خدمة لوحة التحكم غير متاحة مؤقتا.",
    hideProfile: "إخفاء الملف",
    showProfile: "إظهار الملف",
    totalBalance: "الرصيد الاجمالي",
    paymentLimit: "حد الدفع",
    topCategories: "اهم الفئات",
    monthlySpending: "المصاريف الشهرية",
    monthlyLabel: "شهري",
    yearlyLabel: "سنوي",
    lastTransactions: "اخر المعاملات",
    viewAll: "عرض الكل",
    noTransactions: "لا توجد معاملات حاليا.",
    myProfile: "ملفي الشخصي",
    moreInfo: "مزيد من المعلومات",
    income: "الدخل",
    expenses: "المصاريف",
    netSavings: "الادخار الصافي",
    monthlySalary: "الراتب الشهري",
    seniority: "الاقدمية",
    forMonth: "لشهر",
    forFebruary: "لشهر فيفري",
    perMonth: "شهريا",
    years: "سنوات",
    cardholder: "صاحب البطاقة",
    expires: "تنتهي",
    used: "مستخدم",
    cardLocked: "معلومات البطاقة مخفية.",
    revealCard: "اظهار البطاقة",
    hideCard: "اخفاء البطاقة",
    revealCodeLabel: "رمز البطاقة (4 ارقام)",
    revealCodePlaceholder: "ادخل 4 ارقام",
    revealCardError: "تعذر اظهار معلومات البطاقة.",
    invalidCardCode: "ادخل رمز صحيح من 4 ارقام.",
    mockCodeLabel: "رمز تجريبي",
    cardsCountLabel: "عدد البطاقات",
    cinLabel: "رقم CIN",
    shoppingLabel: "تسوق",
    groceriesLabel: "بقالة",
    diningLabel: "مطاعم",
    socialMediaLabel: "تواصل اجتماعي",
    entertainmentLabel: "ترفيه",
    musicLabel: "موسيقى",
    notificationsTitle: "اشعارات ذكية",
    notificationsSubtitle: "اقتراحات مخصصة حسب عادات الانفاق متاعك",
    viewProduct: "شوف المنتج",
    productSuggestionTitle: "اقتراح ليك",
    productSuggestionMessage: "هذا المنتج مختار حسب ملفك الحالي.",
    spendingSuggestionTitle: "اقتراح حسب الانفاق",
    healthReportTitle: "الصحة المالية الشهرية",
    healthReportSubtitle: "ملخص تلقائي لاخر شهر مغلق.",
    healthReportFor: "لشهر",
    healthReportOpen: "عرض التقرير",
    healthReportClose: "اغلاق",
    healthBestDecisions: "افضل 3 قرارات",
    healthImprovePoints: "3 نقاط للتحسين",
    healthScoreLabel: "النتيجة الشهرية",
    healthComparedToPrevious: "مقارنة بالشهر السابق",
    healthMotivation: "عبارة تحفيزية",
    healthAutoBadge: "تقرير تلقائي (اليوم الاول)",
    healthUnavailable: "التقرير الشهري غير متاح حاليا.",
    healthPrevScore: "نتيجة الشهر السابق",
    healthIncomeLabel: "دخل الشهر",
    healthExpensesLabel: "مصاريف الشهر",
    healthSavingsLabel: "الادخار الصافي",
    offlineBanner: "تم تفعيل الوضع دون انترنت. يتم عرض اخر بيانات تمت مزامنتها.",
    offlineLastSync: "اخر مزامنة",
    staleDataWarning: "قد تكون البيانات المخزنة قديمة (اخر مزامنة تجاوزت 24 ساعة).",
    syncInProgress: "تمت استعادة الاتصال. جاري مزامنة البيانات...",
    syncSuccess: "تمت مزامنة لوحة التحكم بنجاح.",
    syncFailed: "فشلت المزامنة. سيعاد المحاولة عند استقرار الشبكة.",
  },
};

const monthNames = {
  en: ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"],
  fr: ["Jan", "Fev", "Mar", "Avr", "Mai", "Juin", "Juil", "Aout", "Sep", "Oct", "Nov", "Dec"],
  ar: ["جانفي", "فيفري", "مارس", "افريل", "ماي", "جوان", "جويلية", "اوت", "سبتمبر", "اكتوبر", "نوفمبر", "ديسمبر"],
};

const colorByIndex = ["bg-blue-500", "bg-teal-500", "bg-orange-500", "bg-purple-500"];

const getLocale = (language) => {
  if (language === "ar") return "ar-TN";
  if (language === "en") return "en-US";
  return "fr-TN";
};

const getCurrentMonthKey = () => {
  const now = new Date();
  return `${now.getFullYear()}-${String(now.getMonth() + 1).padStart(2, "0")}`;
};

const buildRecentMonthKeys = (count = 8) => {
  const now = new Date();
  const keys = [];

  for (let offset = count - 1; offset >= 0; offset -= 1) {
    const absoluteMonth = now.getFullYear() * 12 + now.getMonth() - offset;
    const year = Math.floor(absoluteMonth / 12);
    const month = (absoluteMonth % 12) + 1;
    keys.push(`${year}-${String(month).padStart(2, "0")}`);
  }

  return keys;
};

const normalizeMonthKey = (value) => {
  if (!value) return "";
  const raw = String(value).trim();
  if (/^\d{4}-\d{2}$/.test(raw)) return raw;
  if (/^\d{4}-\d{2}-\d{2}/.test(raw)) return raw.slice(0, 7);

  const parsed = new Date(raw);
  if (Number.isNaN(parsed.getTime())) return "";
  return `${parsed.getFullYear()}-${String(parsed.getMonth() + 1).padStart(2, "0")}`;
};

const formatMonthLabel = (monthKey, language) => {
  const names = monthNames[language] || monthNames.en;
  const normalized = normalizeMonthKey(monthKey);
  if (!normalized) return "--";
  const monthIndex = Number(normalized.slice(5, 7)) - 1;
  if (monthIndex < 0 || monthIndex > 11) return normalized;
  return names[monthIndex] || normalized;
};

const formatAmount = (value, language) => {
  const amount = Math.round(Number(value || 0));
  const locale = getLocale(language);
  return `${new Intl.NumberFormat(locale).format(amount)} TND`;
};

const formatNumber = (value, language) => {
  const amount = Math.round(Number(value || 0));
  const locale = getLocale(language);
  return new Intl.NumberFormat(locale).format(amount);
};

const getTimeGreeting = (language) => {
  const hour = new Date().getHours();

  if (language === "fr") {
    if (hour < 12) return "Bonjour";
    if (hour < 18) return "Bon apres-midi";
    return "Bonsoir";
  }

  if (language === "ar") {
    if (hour < 12) return "صباح الخير";
    if (hour < 18) return "نهارك سعيد";
    return "مساء الخير";
  }

  if (hour < 12) return "Good morning";
  if (hour < 18) return "Good afternoon";
  return "Good evening";
};

const formatTime = (value, language) => {
  if (!value) return "--:--";
  const date = new Date(value);
  if (Number.isNaN(date.getTime())) return String(value);
  const locale = language === "en" ? "en-US" : language === "ar" ? "ar-TN" : "fr-FR";
  return new Intl.DateTimeFormat(locale, {
    hour: "2-digit",
    minute: "2-digit",
    hour12: false,
  }).format(date);
};

const formatDateTime = (value, language) => {
  if (!value) return "-";
  const date = new Date(value);
  if (Number.isNaN(date.getTime())) return "-";

  const locale = language === "en" ? "en-US" : language === "ar" ? "ar-TN" : "fr-FR";
  return new Intl.DateTimeFormat(locale, {
    day: "2-digit",
    month: "short",
    year: "numeric",
    hour: "2-digit",
    minute: "2-digit",
    hour12: false,
  }).format(date);
};

const isLikelyNetworkError = (error) => {
  if (!error) return false;
  if (typeof error.status === "number") return false;
  const message = String(error.message || "").toLowerCase();
  return message.includes("failed to fetch") || message.includes("network") || message.includes("offline");
};

const resolveDashboardLoadErrorCode = (error) => {
  const message = String(error?.message || "").toLowerCase();

  if (
    error?.status === 401 ||
    error?.status === 403 ||
    message.includes("token manquant") ||
    message.includes("token invalide")
  ) {
    return "SESSION_MISSING";
  }

  if (
    error?.status === 404 ||
    message.includes("endpoint api introuvable") ||
    message.includes("requested url was not found on the server")
  ) {
    return "SERVICE_UNAVAILABLE";
  }

  if (isLikelyNetworkError(error)) {
    return "NETWORK_ERROR";
  }

  return "LOAD_DASHBOARD_FAILED";
};

function DashboardSkeleton({ isDark }) {
  return (
    <div className={`min-h-full ${isDark ? "bg-gray-900 text-white" : "bg-[#f4f6f9] text-[#182540]"}`}>
      <div className={`grid gap-3 p-3 lg:grid-cols-[minmax(0,1fr)_260px] lg:p-4 ${isDark ? "skeleton-dark" : ""}`}>
        <section className="space-y-3">
          <Skeleton className="h-6 w-56 rounded-lg" />
          <Skeleton className="h-12 w-72 rounded-xl" />

          <div className="grid gap-4 md:grid-cols-2">
            <Skeleton className="h-56 rounded-3xl" />
            <Skeleton className="h-40 rounded-3xl" />
          </div>

          <div className="grid gap-3 md:grid-cols-3">
            {Array.from({ length: 3 }).map((_, index) => (
              <Skeleton key={`dashboard-top-skeleton-${index}`} className="h-24 rounded-2xl" />
            ))}
          </div>

          <Skeleton className="h-56 rounded-2xl" />

          <div className={`rounded-2xl border p-4 ${isDark ? "border-gray-700 bg-gray-800" : "border-gray-200 bg-white"}`}>
            <SkeletonLines lines={4} lineClassName="h-3 rounded-md" lastLineClassName="w-4/6" />
          </div>

          <div className={`rounded-2xl border p-4 ${isDark ? "border-gray-700 bg-gray-800" : "border-gray-200 bg-white"}`}>
            <Skeleton className="mb-3 h-5 w-48 rounded-lg" />
            {Array.from({ length: 4 }).map((_, index) => (
              <Skeleton key={`dashboard-row-skeleton-${index}`} className="mb-2 h-12 rounded-xl" />
            ))}
          </div>
        </section>

        <aside className={`space-y-3 rounded-2xl border p-3 ${isDark ? "border-gray-700 bg-gray-800" : "border-gray-200 bg-white"}`}>
          <Skeleton className="h-6 w-28 rounded-md" />
          <div className="space-y-2">
            <Skeleton className="mx-auto h-20 w-20 rounded-full" />
            <Skeleton className="mx-auto h-5 w-36 rounded-md" />
            <Skeleton className="mx-auto h-3 w-44 rounded-md" />
          </div>
          {Array.from({ length: 5 }).map((_, index) => (
            <Skeleton key={`dashboard-side-skeleton-${index}`} className="h-20 rounded-2xl" />
          ))}
        </aside>
      </div>
    </div>
  );
}

export function Dashboard() {
  const navigate = useNavigate();
  const { theme } = useTheme();
  const { language, isRTL } = useLanguage();
  const isDark = theme === "dark";

  const ui = dashboardCopy[language] || dashboardCopy.en;

  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [showAmounts, setShowAmounts] = useState(true);
  const [showProfile, setShowProfile] = useState(true);
  const [recommendation, setRecommendation] = useState(null);
  const [profile, setProfile] = useState(null);
  const [budgetCategories, setBudgetCategories] = useState([]);
  const [selectedMonthKey, setSelectedMonthKey] = useState(() => getCurrentMonthKey());
  const [isOffline, setIsOffline] = useState(() => (typeof navigator !== "undefined" ? !navigator.onLine : false));
  const [usingOfflineData, setUsingOfflineData] = useState(false);
  const [lastSyncAt, setLastSyncAt] = useState("");
  const [isCacheStale, setIsCacheStale] = useState(false);
  const [syncState, setSyncState] = useState("idle");
  const [refreshNonce, setRefreshNonce] = useState(0);
  const syncStateRef = useRef(syncState);

  const clientId = getClientId();

  useEffect(() => {
    if (typeof window === "undefined") return undefined;

    const handleOnline = () => {
      setIsOffline(false);
      setSyncState("syncing");
      setRefreshNonce((value) => value + 1);
    };

    const handleOffline = () => {
      setIsOffline(true);
      setSyncState("idle");
    };

    window.addEventListener("online", handleOnline);
    window.addEventListener("offline", handleOffline);

    return () => {
      window.removeEventListener("online", handleOnline);
      window.removeEventListener("offline", handleOffline);
    };
  }, []);

  useEffect(() => {
    syncStateRef.current = syncState;
  }, [syncState]);

  useEffect(() => {
    let cancelled = false;

    const loadDashboard = async () => {
      if (!clientId) {
        setError("SESSION_MISSING");
        setUsingOfflineData(false);
        setIsCacheStale(false);
        setLoading(false);
        return;
      }

      const reconnectSyncAttempt = syncStateRef.current === "syncing";
      const cachedSnapshot = readDashboardOfflineCache(clientId);

      const applyCachedSnapshot = (snapshot) => {
        const hasCachedData =
          Boolean(snapshot?.recommendation) ||
          Boolean(snapshot?.profile);

        if (!hasCachedData) return false;

        setRecommendation(snapshot.recommendation || null);
        setProfile(snapshot.profile || null);
        setLastSyncAt(snapshot.updatedAt || "");
        setIsCacheStale(isOfflineCacheStale(snapshot.updatedAt));
        return true;
      };

      try {
        const warmCacheReady = !reconnectSyncAttempt && applyCachedSnapshot(cachedSnapshot);

        setLoading(!warmCacheReady);
        setError("");

        if (!reconnectSyncAttempt && !warmCacheReady) {
          setBudgetCategories([]);
        }

        const offlineNow = typeof navigator !== "undefined" && !navigator.onLine;
        if (offlineNow) {
          setIsOffline(true);
          const usedCache = applyCachedSnapshot(cachedSnapshot);
          setUsingOfflineData(usedCache);

          if (!usedCache) {
            setError("NETWORK_ERROR");
            setIsCacheStale(false);
          }

          if (reconnectSyncAttempt) {
            setSyncState(usedCache ? "idle" : "failed");
          }

          return;
        }

        const [recData, meData] = await Promise.all([
          getClientRecommendation(clientId),
          getMe().catch(() => null),
        ]);

        if (cancelled) return;

        const nextRecommendation = recData || null;
        const nextProfile = meData || null;

        setRecommendation(nextRecommendation);
        setProfile(nextProfile);
        setUsingOfflineData(false);
        setIsOffline(false);
        setIsCacheStale(false);

        const nowIso = new Date().toISOString();
        setLastSyncAt(nowIso);

        writeDashboardOfflineCache(clientId, {
          updatedAt: nowIso,
          recommendation: nextRecommendation,
          profile: nextProfile,
          budgetByMonth: cachedSnapshot?.budgetByMonth || {},
        });

        if (reconnectSyncAttempt) {
          setSyncState("synced");
        }
      } catch (loadErr) {
        if (cancelled) return;

        const usedCache = applyCachedSnapshot(cachedSnapshot);
        setUsingOfflineData(usedCache);

        if (!usedCache) {
          setError(resolveDashboardLoadErrorCode(loadErr));
          setIsCacheStale(false);
        } else {
          setError("");
        }

        if (isLikelyNetworkError(loadErr)) {
          setIsOffline(true);
        }

        if (reconnectSyncAttempt) {
          setSyncState("failed");
        }
      } finally {
        if (!cancelled) {
          setLoading(false);
        }
      }
    };

    loadDashboard();

    return () => {
      cancelled = true;
    };
  }, [clientId, refreshNonce]);

  useEffect(() => {
    if (syncState !== "synced" && syncState !== "failed") return undefined;
    const timerId = window.setTimeout(() => setSyncState("idle"), 3000);
    return () => window.clearTimeout(timerId);
  }, [syncState]);

  useEffect(() => {
    let cancelled = false;

    if (!clientId || !selectedMonthKey) {
      setBudgetCategories([]);
      return undefined;
    }

    const loadBudgetByMonth = async () => {
      const cachedRows = readDashboardBudgetMonthFromCache(clientId, selectedMonthKey);
      if (cachedRows.length > 0 && !cancelled) {
        setBudgetCategories(cachedRows);
      }

      const offlineNow = typeof navigator !== "undefined" && !navigator.onLine;
      if (offlineNow) {
        if (!cancelled && cachedRows.length === 0) {
          setBudgetCategories([]);
        }
        return;
      }

      try {
        const budgetData = await getBudget(selectedMonthKey);
        if (!cancelled) {
          const rows = Array.isArray(budgetData?.categories) ? budgetData.categories : [];
          setBudgetCategories(rows);
          cacheDashboardBudgetMonth(clientId, selectedMonthKey, rows);
        }
      } catch {
        if (!cancelled && cachedRows.length === 0) {
          setBudgetCategories([]);
        }
      }
    };

    loadBudgetByMonth();

    return () => {
      cancelled = true;
    };
  }, [clientId, selectedMonthKey, refreshNonce]);

  const indicators = recommendation?.indicators || {};

  const name = profile?.client_name || recommendation?.client_name || ui.clientFallback;
  const email = profile?.email || localStorage.getItem("bh_email") || "client@bhbank.tn";
  const greetingLabel = getTimeGreeting(language);
  const profilePhoto = String(profile?.profile_photo || "").trim();
  const profileInitials = useMemo(() => {
    const base = String(name || email || ui.clientFallback).trim();
    const parts = base.split(/\s+/).filter(Boolean).slice(0, 2);
    if (parts.length === 0) return "CL";
    return parts.map((part) => part[0]?.toUpperCase() || "").join("") || "CL";
  }, [name, email, ui.clientFallback]);

  const balance = Number(indicators.estimated_balance || 0);
  const income = Number(indicators.avg_monthly_income || 0);
  const expenses = Number(indicators.avg_monthly_expenses || 0);
  const netSavings = Number(indicators.net_monthly_savings || 0);
  const monthlySalary = Number(indicators.monthly_salary || 0);
  const seniorityYears = Math.max(1, Math.round(Number(indicators.account_seniority_days || 365) / 365));

  const spendingBars = useMemo(() => {
    const keys = buildRecentMonthKeys(8);
    const source = Array.isArray(recommendation?.monthly_spending)
      ? recommendation.monthly_spending
      : Array.isArray(recommendation?.monthly_spending_trend)
        ? recommendation.monthly_spending_trend
        : null;

    const valuesByMonth = new Map(keys.map((monthKey) => [monthKey, 0]));

    if (Array.isArray(source) && source.length > 0) {
      const hasMonthKey = source.some((entry) => entry && typeof entry === "object" && (entry.month || entry.month_key || entry.period));

      if (hasMonthKey) {
        source.forEach((entry) => {
          const monthKey = normalizeMonthKey(entry?.month || entry?.month_key || entry?.period);
          if (!monthKey || !valuesByMonth.has(monthKey)) return;
          const amount = Number(entry?.amount ?? entry?.spent ?? entry?.value ?? 0);
          valuesByMonth.set(monthKey, Number.isFinite(amount) ? Math.max(0, amount) : 0);
        });
      } else {
        const normalizedValues = source
          .slice(-keys.length)
          .map((entry) => (typeof entry === "number" ? Number(entry || 0) : Number(entry?.amount || entry?.spent || entry?.value || 0)));
        const offset = Math.max(0, keys.length - normalizedValues.length);

        normalizedValues.forEach((value, index) => {
          const monthKey = keys[index + offset];
          if (!monthKey) return;
          valuesByMonth.set(monthKey, Number.isFinite(value) ? Math.max(0, value) : 0);
        });
      }
    }

    const maxValue = Math.max(...Array.from(valuesByMonth.values()), 1);

    return keys.map((monthKey) => {
      const amount = Number(valuesByMonth.get(monthKey) || 0);
      return {
        key: monthKey,
        month: formatMonthLabel(monthKey, language),
        amount,
        height: amount > 0 ? Math.max(20, Math.round((amount / maxValue) * 100)) : 12,
      };
    });
  }, [recommendation, language]);

  useEffect(() => {
    if (!spendingBars.length) return;
    const selectedExists = spendingBars.some((bar) => bar.key === selectedMonthKey);
    if (!selectedExists) {
      setSelectedMonthKey(spendingBars[spendingBars.length - 1].key);
    }
  }, [spendingBars, selectedMonthKey]);

  const selectedBar = useMemo(
    () => spendingBars.find((bar) => bar.key === selectedMonthKey) || spendingBars[spendingBars.length - 1] || null,
    [spendingBars, selectedMonthKey],
  );

  const budgetSpentTotal = budgetCategories.reduce((total, item) => total + Math.max(0, Number(item?.spent || 0)), 0);
  const budgetPlannedTotal = budgetCategories.reduce(
    (total, item) => total + Math.max(0, Number(item?.planned ?? item?.budget ?? item?.limit ?? 0)),
    0,
  );

  const selectedMonthSpending = Number(selectedBar?.amount || 0);
  const paymentUsed = Math.max(0, Math.round(budgetSpentTotal > 0 ? budgetSpentTotal : selectedMonthSpending));
  const indicatorLimit = Math.max(0, Math.round(monthlySalary || income || 0));
  const paymentLimitTotal = Math.max(Math.round(budgetPlannedTotal), indicatorLimit, paymentUsed);
  const paymentUsage = paymentLimitTotal > 0 ? Math.min(100, Math.round((paymentUsed / paymentLimitTotal) * 100)) : 0;
  const selectedMonthMeta = selectedBar ? `${ui.forMonth} ${selectedBar.month}` : ui.perMonth;

  const topCategories = useMemo(() => {
    const source = [...budgetCategories]
      .sort((a, b) => Number(b.spent || 0) - Number(a.spent || 0))
      .slice(0, 3)
      .map((item) => ({
        label: item.category || ui.shoppingLabel,
        amount: Number(item.spent || 0),
      }));

    if (source.length > 0) return source;

    return [
      { label: ui.shoppingLabel, amount: 0 },
      { label: ui.groceriesLabel, amount: 0 },
      { label: ui.diningLabel, amount: 0 },
    ];
  }, [budgetCategories, ui]);

  const transactions = useMemo(() => {
    const source = Array.isArray(recommendation?.recent_transactions) ? recommendation.recent_transactions : [];

    if (source.length > 0) {
      return source.slice(0, 4).map((item, index) => ({
        key: item.id || `tx-${index}`,
        title: item.label || item.description || ui.shoppingLabel,
        category: item.category || ui.shoppingLabel,
        amount: Math.abs(Number(item.amount || 0)),
        time: formatTime(item.timestamp || item.date || item.time, language),
      }));
    }

    return [];
  }, [recommendation, ui, language]);

  const sidebarCards = [
    {
      key: "income",
      label: ui.income,
      value: formatAmount(income, language),
      meta: selectedMonthMeta,
      icon: TrendingUp,
      cardClass: isDark ? "bg-emerald-900/20 border-emerald-800/50" : "bg-emerald-50 border-emerald-100",
      iconClass: "bg-emerald-600",
    },
    {
      key: "expenses",
      label: ui.expenses,
      value: formatAmount(expenses, language),
      meta: selectedMonthMeta,
      icon: TrendingDown,
      cardClass: isDark ? "bg-rose-900/20 border-rose-800/50" : "bg-rose-50 border-rose-100",
      iconClass: "bg-rose-600",
    },
    {
      key: "net-savings",
      label: ui.netSavings,
      value: formatAmount(netSavings, language),
      meta: ui.perMonth,
      icon: PiggyBank,
      cardClass: isDark ? "bg-teal-900/20 border-teal-800/50" : "bg-teal-50 border-teal-100",
      iconClass: "bg-green-600",
    },
    {
      key: "salary",
      label: ui.monthlySalary,
      value: formatAmount(monthlySalary, language),
      icon: Calendar,
      cardClass: isDark ? "bg-blue-900/20 border-blue-800/50" : "bg-blue-50 border-blue-100",
      iconClass: "bg-blue-600",
    },
    {
      key: "seniority",
      label: ui.seniority,
      value: `${seniorityYears} ${ui.years}`,
      icon: Briefcase,
      cardClass: isDark ? "bg-purple-900/20 border-purple-800/50" : "bg-purple-50 border-purple-100",
      iconClass: "bg-purple-600",
    },
  ];

  if (loading) {
    return <DashboardSkeleton isDark={isDark} />;
  }

  const resolvedErrorMessage =
    error === "SESSION_MISSING"
      ? ui.sessionMissing
      : error === "NETWORK_ERROR"
        ? ui.networkError
        : error === "SERVICE_UNAVAILABLE"
          ? ui.serviceUnavailable
          : error === "LOAD_DASHBOARD_FAILED"
            ? ui.loadError
            : error
              ? ui.loadError
              : "";

  const syncNotice =
    syncState === "syncing"
      ? ui.syncInProgress
      : syncState === "synced"
        ? ui.syncSuccess
        : syncState === "failed"
          ? ui.syncFailed
          : "";
  const connectivityNotice = syncNotice || ((isOffline || usingOfflineData) ? ui.offlineBanner : "");

  return (
    <div className={`min-h-full w-full overflow-x-hidden ${isDark ? "bg-gray-900 text-white" : "bg-[#f4f6f9] text-[#182540]"}`}>
      <div
        className={`grid min-h-full min-w-0 items-start gap-2.5 px-2.5 pt-2.5 pb-1 sm:px-3 lg:px-4 lg:pt-3 lg:pb-1 ${showProfile ? "lg:grid-cols-[minmax(0,1fr)_240px]" : "lg:grid-cols-1"} ${
          isRTL ? "text-right" : "text-left"
        }`}
      >
        <section className="min-w-0 space-y-2.5">
          <div className="mt-4 mb-2 flex flex-col items-start gap-2.5 sm:flex-row sm:items-start sm:justify-between">
            <div className="min-w-0">
              <p
                className={`text-[11px] font-semibold tracking-[0.18em] uppercase ${
                  isDark ? "text-cyan-300" : "text-[#2d5ca8]"
                } ${isRTL ? "text-right" : "text-left"}`}
              >
                {greetingLabel}
              </p>
              <h1 className="mt-1 wrap-break-word text-lg font-semibold leading-tight lg:text-xl">
                {name}
              </h1>
            </div>
            <button
              type="button"
              onClick={() => setShowProfile((prev) => !prev)}
              className={`w-full rounded-xl border px-3 py-1.5 text-xs sm:w-auto ${
                isDark ? "border-gray-600 text-gray-200 hover:bg-gray-800" : "border-gray-300 text-gray-700 hover:bg-white"
              }`}
            >
              {showProfile ? ui.hideProfile : ui.showProfile}
            </button>
          </div>

          {resolvedErrorMessage && (
            <div
              className={`flex items-center gap-2 rounded-xl border p-2.5 text-xs ${
                isDark ? "border-red-800 bg-red-950/30 text-red-300" : "border-red-200 bg-red-50 text-red-700"
              }`}
            >
              <AlertCircle className="h-4 w-4" />
              {resolvedErrorMessage}
            </div>
          )}

          {connectivityNotice && (
            <div
              className={`rounded-xl border p-2.5 text-xs ${
                syncState === "failed"
                  ? isDark
                    ? "border-red-800 bg-red-950/30 text-red-300"
                    : "border-red-200 bg-red-50 text-red-700"
                  : syncState === "synced"
                    ? isDark
                      ? "border-emerald-800 bg-emerald-950/30 text-emerald-300"
                      : "border-emerald-200 bg-emerald-50 text-emerald-700"
                    : isDark
                      ? "border-amber-800 bg-amber-950/30 text-amber-200"
                      : "border-amber-200 bg-amber-50 text-amber-700"
              }`}
            >
              <div className="flex items-start gap-2">
                <AlertCircle className="mt-0.5 h-4 w-4" />
                <div>
                  <p>{connectivityNotice}</p>
                  {lastSyncAt && (
                    <p className={`mt-1 text-[11px] ${isDark ? "text-gray-300" : "text-[#4f5c72]"}`}>
                      {ui.offlineLastSync}: {formatDateTime(lastSyncAt, language)}
                    </p>
                  )}
                  {isCacheStale && (isOffline || usingOfflineData) && (
                    <p className={`mt-1 text-[11px] ${isDark ? "text-amber-200" : "text-amber-800"}`}>
                      {ui.staleDataWarning}
                    </p>
                  )}
                </div>
              </div>
            </div>
          )}

          <div className="mt-6 sm:mt-8">
            <p className={`text-sm ${isDark ? "text-gray-300" : "text-[#4b5b73]"}`}>{ui.totalBalance}</p>
            <div className="mt-1 flex items-center justify-between">
              <p className="text-lg font-semibold tracking-tight lg:text-xl">
                {showAmounts ? formatAmount(balance, language) : "••••••"}
              </p>
              <button
                type="button"
                onClick={() => setShowAmounts((prev) => !prev)}
                aria-label={showAmounts ? "Hide amounts" : "Show amounts"}
                title={showAmounts ? "Hide amounts" : "Show amounts"}
                className={`inline-flex h-10 w-10 items-center justify-center rounded-lg border ${
                  isDark ? "border-gray-600 text-gray-200" : "border-gray-300 text-gray-500"
                }`}
              >
                {showAmounts ? <Eye className="h-4 w-4" /> : <EyeOff className="h-4 w-4" />}
              </button>
            </div>
          </div>

          <div className={`flex ${isRTL ? "justify-end" : "justify-start"}`}>
            <article className={`w-full max-w-md rounded-2xl border p-3 ${isDark ? "border-gray-700 bg-gray-800" : "border-gray-200 bg-[#eef1f6]"}`}>
              <div className="mb-2.5 flex items-start justify-between gap-2">
                <p className="text-xs font-medium">{ui.paymentLimit}</p>
                <p className={`max-w-full wrap-break-word text-[11px] font-medium sm:max-w-[70%] sm:text-xs ${isRTL ? "text-left" : "text-right"} ${isDark ? "text-gray-200" : "text-[#4f5e79]"}`}>
                  {showAmounts ? `${formatNumber(paymentUsed, language)} TND / ${formatNumber(paymentLimitTotal, language)} TND` : "•••••• / ••••••"}
                </p>
              </div>

              <div className={`h-2 overflow-hidden rounded-full ${isDark ? "bg-gray-700" : "bg-[#cbd5e1]"}`}>
                <div
                  className="h-2 rounded-full bg-linear-to-r from-[#183a8f] via-[#2951da] to-[#1cb3ad]"
                  style={{ width: `${paymentUsage}%` }}
                />
              </div>
              <p className="mt-1.5 text-[11px] font-medium text-[#2951da]">{paymentUsage}% {ui.used}</p>
            </article>
          </div>

          <section>
            <h2 className="mb-2.5 text-sm font-medium">{ui.topCategories}</h2>
            <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
              {topCategories.map((category, index) => (
                <article
                  key={`${category.label}-${index}`}
                  className={`rounded-2xl border p-2.5 ${isDark ? "border-gray-700 bg-gray-800" : "border-gray-200 bg-white"}`}
                >
                  <div className="mb-2 flex items-center gap-2">
                    <span className={`h-3 w-3 rounded-full ${colorByIndex[index] || colorByIndex[0]}`} />
                    <p className={`text-xs ${isDark ? "text-gray-300" : "text-[#52617a]"}`}>{category.label}</p>
                  </div>
                  <p className="text-sm font-semibold">{showAmounts ? formatAmount(category.amount, language) : "••••••"}</p>
                </article>
              ))}
            </div>
          </section>

          <div className="grid min-w-0 gap-3 md:grid-cols-2">
            <section className={`min-w-0 h-full rounded-2xl border p-3.5 ${isDark ? "border-gray-700 bg-gray-800" : "border-gray-200 bg-white"}`}>
              <div className="mb-3 flex flex-wrap items-start justify-between gap-3">
                <div>
                  <h2 className="text-sm font-medium">{ui.monthlySpending}</h2>
                  <p className="text-base font-semibold">{showAmounts ? formatAmount(selectedMonthSpending, language) : "••••••"}</p>
                  <p className={`mt-1 text-xs ${isDark ? "text-gray-400" : "text-[#67768f]"}`}>{selectedMonthMeta}</p>
                </div>
                <div className={`flex shrink-0 items-center gap-4 text-xs ${isDark ? "text-gray-400" : "text-[#67768f]"}`}>
                  <button type="button" className={`border-b-4 pb-1 ${isDark ? "border-white text-white" : "border-[#222b44] text-[#222b44]"}`}>
                    {ui.monthlyLabel}
                  </button>
                  <button type="button" className="pb-1">{ui.yearlyLabel}</button>
                </div>
              </div>

              <div className="-mx-1 mt-5 flex items-end gap-3 overflow-x-auto px-1 pb-2">
                {spendingBars.map((bar, index) => {
                  const gradientClass =
                    index < 2
                      ? "from-[#dbe7ff] to-[#bad2ff]"
                      : index < 4
                        ? "from-[#9ec1ff] to-[#769fe9]"
                        : "from-[#6792e8] to-[#2f61c4]";
                  const isSelected = selectedBar?.key === bar.key;

                  return (
                    <button
                      key={bar.key}
                      type="button"
                      onClick={() => setSelectedMonthKey(bar.key)}
                      aria-pressed={isSelected}
                      className="flex min-w-14 shrink-0 flex-col items-center gap-1.5"
                    >
                      <div
                        className={`w-full rounded-t-md bg-linear-to-t ${gradientClass} transition ${isSelected ? "opacity-100 ring-2 ring-[#2951da]/40" : "opacity-75 hover:opacity-95"}`}
                        style={{ height: `${bar.height + 10}px` }}
                      />
                      <p className={`text-[10px] ${isSelected ? (isDark ? "text-white" : "text-[#24324a]") : isDark ? "text-gray-400" : "text-[#7b879b]"}`}>
                        {bar.month}
                      </p>
                    </button>
                  );
                })}
              </div>
            </section>

            <section className={`min-w-0 h-full rounded-2xl border p-3.5 ${isDark ? "border-gray-700 bg-gray-800" : "border-gray-200 bg-white"}`}>
              <div className="mb-3 flex items-center justify-between gap-3">
                <h2 className="text-sm font-medium">{ui.lastTransactions}</h2>
                <button type="button" className={`text-xs ${isDark ? "text-gray-300" : "text-[#546683]"}`}>
                  {ui.viewAll}
                </button>
              </div>

              <div className={`overflow-hidden rounded-2xl border ${isDark ? "border-gray-700 bg-gray-800" : "border-gray-200 bg-white"}`}>
                {transactions.length === 0 ? (
                  <p className={`p-6 text-sm ${isDark ? "text-gray-300" : "text-gray-600"}`}>{ui.noTransactions}</p>
                ) : (
                  <div>
                    {transactions.map((item, index) => (
                      <article key={item.key} className={`flex items-start justify-between gap-3 px-3 py-2 sm:items-center ${index > 0 ? isDark ? "border-t border-gray-700" : "border-t border-gray-100" : ""}`}>
                        <div className="flex min-w-0 items-start gap-2.5">
                          <span className={`mt-1.5 h-2 w-2 rounded-full ${colorByIndex[index % colorByIndex.length]}`} />
                          <div className="min-w-0">
                            <p className="truncate text-sm font-medium">{item.title}</p>
                            <p className={`truncate text-xs ${isDark ? "text-gray-300" : "text-[#5f6f8a]"}`}>{item.category}</p>
                          </div>
                        </div>

                        <div className={`shrink-0 ${isRTL ? "text-left" : "text-right"}`}>
                          <p className="text-sm font-medium text-red-500 sm:whitespace-nowrap">-{showAmounts ? formatAmount(item.amount, language) : "••••••"}</p>
                          <p className={`text-[10px] ${isDark ? "text-gray-400" : "text-[#94a0b4]"}`}>{item.time}</p>
                        </div>
                      </article>
                    ))}
                  </div>
                )}
              </div>
            </section>
          </div>
        </section>

        {showProfile && (
          <aside className={`w-full space-y-2.5 rounded-2xl border p-2.5 ${isDark ? "border-gray-700 bg-gray-800" : "border-gray-200 bg-white"}`}>
            <h2 className="text-sm font-medium">{ui.myProfile}</h2>

            <div className="flex flex-col items-center gap-2 text-center">
              {profilePhoto ? (
                <img src={profilePhoto} alt={name} className="h-16 w-16 rounded-full object-cover" />
              ) : (
                <div className="flex h-16 w-16 items-center justify-center rounded-full bg-linear-to-br from-[#0A2240] to-[#1f5faa] text-lg font-semibold text-white">
                  {profileInitials}
                </div>
              )}
              <p className="max-w-full wrap-break-word text-base font-medium">{name}</p>
              <p className={`max-w-full break-all text-xs ${isDark ? "text-gray-300" : "text-[#566783]"}`}>{email}</p>
              <button type="button" onClick={() => navigate("/dashboard/profile")} className="text-xs text-blue-600 hover:text-blue-700">
                {ui.moreInfo}
              </button>
            </div>

            <div className="space-y-2">
              {sidebarCards.map((card) => {
                const Icon = card.icon;
                return (
                  <article key={card.key} className={`rounded-2xl border p-2 ${card.cardClass}`}>
                    <div className="flex items-center justify-between gap-2">
                      <div className={`flex items-center gap-3 ${isRTL ? "flex-row-reverse" : ""}`}>
                        <div className={`h-7 w-7 shrink-0 rounded-lg ${card.iconClass} flex items-center justify-center`}>
                          <Icon className="h-4 w-4 text-white" />
                        </div>
                        <div className="min-w-0">
                          <p className={`truncate text-xs ${isDark ? "text-gray-400" : "text-gray-500"}`}>{card.label}</p>
                          <p className="truncate text-sm font-semibold">{showAmounts ? card.value : "••••••"}</p>
                        </div>
                      </div>

                      {card.meta && (
                        <div className={`flex items-center gap-1 text-xs ${isDark ? "text-gray-400" : "text-gray-500"} ${isRTL ? "flex-row-reverse" : ""}`}>
                          <span>{card.meta}</span>
                          <ChevronDown className="h-4 w-4" />
                        </div>
                      )}
                    </div>
                  </article>
                );
              })}
            </div>
          </aside>
        )}
      </div>

    </div>
  );
}
