import { useEffect, useMemo, useState } from "react";
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
import { getBudget, getClientId, getClientRecommendation, getMe, revealMyCardInfo } from "../api";
import { PageLoader } from "../components/PageLoader";

const dashboardCopy = {
  en: {
    clientFallback: "Client",
    sessionMissing: "Missing session. Please sign in to load your dashboard.",
    loadError: "Unable to load dashboard data.",
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
  },
  fr: {
    clientFallback: "Client",
    sessionMissing: "Session absente. Connectez-vous pour charger vos donnees.",
    loadError: "Impossible de charger le tableau de bord.",
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
  },
  ar: {
    clientFallback: "العميل",
    sessionMissing: "الجلسة غير موجودة. يرجى تسجيل الدخول لتحميل لوحة التحكم.",
    loadError: "تعذر تحميل بيانات لوحة التحكم.",
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

const formatCardNumber = (value) => {
  const digits = String(value || "").replace(/\D/g, "");
  if (digits.length < 12) return "5737 4677 4969 2698";
  return digits.slice(0, 16).replace(/(.{4})/g, "$1 ").trim();
};

const formatCardExpiry = (value) => {
  if (!value) return "--/--";
  const date = new Date(value);
  if (Number.isNaN(date.getTime())) return String(value);
  const month = String(date.getMonth() + 1).padStart(2, "0");
  const year = String(date.getFullYear()).slice(-2);
  return `${month}/${year}`;
};

export function Dashboard() {
  const navigate = useNavigate();
  const { theme } = useTheme();
  const { t, language, isRTL } = useLanguage();
  const isDark = theme === "dark";

  const ui = dashboardCopy[language] || dashboardCopy.en;

  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [showAmounts, setShowAmounts] = useState(true);
  const [showProfile, setShowProfile] = useState(true);
  const [showCardInfo, setShowCardInfo] = useState(false);
  const [cardRevealCode, setCardRevealCode] = useState("");
  const [cardRevealError, setCardRevealError] = useState("");
  const [revealingCard, setRevealingCard] = useState(false);
  const [revealedCard, setRevealedCard] = useState(null);
  const [recommendation, setRecommendation] = useState(null);
  const [profile, setProfile] = useState(null);
  const [budgetCategories, setBudgetCategories] = useState([]);
  const [selectedMonthKey, setSelectedMonthKey] = useState(() => getCurrentMonthKey());

  const clientId = getClientId();

  useEffect(() => {
    const loadDashboard = async () => {
      if (!clientId) {
        setError("SESSION_MISSING");
        setLoading(false);
        return;
      }

      try {
        setLoading(true);
        setError("");
        setBudgetCategories([]);

        const [recData, meData] = await Promise.all([
          getClientRecommendation(clientId),
          getMe().catch(() => null),
        ]);

        setRecommendation(recData || null);
        setProfile(meData || null);
      } catch (loadErr) {
        setError(loadErr.message || "LOAD_DASHBOARD_FAILED");
      } finally {
        setLoading(false);
      }
    };

    loadDashboard();
  }, [clientId]);

  useEffect(() => {
    let cancelled = false;

    if (!clientId || !selectedMonthKey) {
      setBudgetCategories([]);
      return undefined;
    }

    const loadBudgetByMonth = async () => {
      try {
        const budgetData = await getBudget(selectedMonthKey);
        if (!cancelled) {
          setBudgetCategories(Array.isArray(budgetData?.categories) ? budgetData.categories : []);
        }
      } catch {
        if (!cancelled) {
          setBudgetCategories([]);
        }
      }
    };

    loadBudgetByMonth();

    return () => {
      cancelled = true;
    };
  }, [clientId, selectedMonthKey]);

  useEffect(() => {
    setShowCardInfo(false);
    setCardRevealCode("");
    setCardRevealError("");
    setRevealedCard(null);
  }, [profile?.client_id, profile?.card_number_masked]);

  const indicators = recommendation?.indicators || {};

  const name = profile?.client_name || recommendation?.client_name || ui.clientFallback;
  const email = profile?.email || localStorage.getItem("bh_email") || "client@bhbank.tn";
  const profilePhoto = String(profile?.profile_photo || "").trim();
  const profileInitials = useMemo(() => {
    const base = String(name || email || ui.clientFallback).trim();
    const parts = base.split(/\s+/).filter(Boolean).slice(0, 2);
    if (parts.length === 0) return "CL";
    return parts.map((part) => part[0]?.toUpperCase() || "").join("") || "CL";
  }, [name, email, ui.clientFallback]);
  const cardNumber = showCardInfo
    ? formatCardNumber(revealedCard?.card_number)
    : String(profile?.card_number_masked || "**** **** **** ****");
  const expiry = showCardInfo
    ? formatCardExpiry(revealedCard?.card_expires_on || profile?.card_expires_on)
    : "••/••";
  const cardCIN = showCardInfo ? (revealedCard?.client_cin || profile?.client_cin || "-") : "••••••••";
  const cardsCount = showCardInfo
    ? String(revealedCard?.cards_count ?? profile?.cards_count ?? "-")
    : "•";
  const mockRevealCode = String(profile?.card_reveal_code_mock || "");

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
    return <PageLoader label={t("loading")} isDark={isDark} className={isDark ? "bg-gray-900" : "bg-[#f4f6f9]"} />;
  }

  const resolvedErrorMessage =
    error === "SESSION_MISSING" ? ui.sessionMissing : error === "LOAD_DASHBOARD_FAILED" ? ui.loadError : error;

  const onRevealCard = async () => {
    if (!/^\d{4}$/.test(cardRevealCode)) {
      setCardRevealError(ui.invalidCardCode);
      return;
    }

    try {
      setRevealingCard(true);
      setCardRevealError("");
      const payload = await revealMyCardInfo(cardRevealCode);
      setRevealedCard(payload || null);
      setShowCardInfo(true);
      setCardRevealCode("");
    } catch (revealErr) {
      setCardRevealError(revealErr.message || ui.revealCardError);
      setShowCardInfo(false);
    } finally {
      setRevealingCard(false);
    }
  };

  const onHideCard = () => {
    setShowCardInfo(false);
    setCardRevealCode("");
    setCardRevealError("");
    setRevealedCard(null);
  };

  return (
    <div className={`min-h-full ${isDark ? "bg-gray-900 text-white" : "bg-[#f4f6f9] text-[#182540]"}`}>
      <div
        className={`grid gap-3 p-3 lg:p-4 ${showProfile ? "xl:grid-cols-[minmax(0,1fr)_260px]" : "xl:grid-cols-1"} ${
          isRTL ? "text-right" : "text-left"
        }`}
      >
        <section className="space-y-3">
          <div className="flex items-start justify-between gap-3">
            <h1 className="text-base font-semibold lg:text-lg">{t("hello")}, {name}</h1>
            <button
              type="button"
              onClick={() => setShowProfile((prev) => !prev)}
              className={`rounded-xl border px-3 py-1.5 text-xs ${
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

          <div>
            <p className={`text-sm ${isDark ? "text-gray-300" : "text-[#4b5b73]"}`}>{ui.totalBalance}</p>
            <div className="mt-1 flex items-center justify-between">
              <p className="text-xl font-semibold tracking-tight lg:text-2xl">
                {showAmounts ? formatAmount(balance, language) : "••••••"}
              </p>
              <button
                type="button"
                onClick={() => setShowAmounts((prev) => !prev)}
                className={`inline-flex h-8 w-8 items-center justify-center rounded-lg border ${
                  isDark ? "border-gray-600 text-gray-200" : "border-gray-300 text-gray-500"
                }`}
              >
                {showAmounts ? <Eye className="h-4 w-4" /> : <EyeOff className="h-4 w-4" />}
              </button>
            </div>
          </div>

          <div className="grid gap-4 xl:grid-cols-[minmax(0,1fr)_minmax(0,1fr)]">
            <article className="relative overflow-hidden rounded-3xl bg-linear-to-br from-[#0a2a55] via-[#0f4f92] to-[#0b6bb4] p-4 text-white shadow-lg">
              <div className="absolute -top-10 -right-10 h-36 w-36 rounded-full bg-white/10" />
              <div className="absolute -bottom-14 -right-6 h-28 w-28 rounded-full bg-cyan-300/25" />

              <div className="mb-8 flex items-start justify-between">
                <div className="h-10 w-14 rounded-lg bg-white/25" />
                <p className="text-sm tracking-[0.18em]">BH BANK</p>
              </div>

              <p className="mb-5 text-base tracking-[0.12em] lg:text-lg">{cardNumber}</p>

              <div className="flex items-end justify-between gap-3">
                <div>
                  <p className="text-xs text-white/70">{ui.cardholder}</p>
                  <p className="text-sm font-medium lg:text-base">{name}</p>
                </div>
                <div>
                  <p className="text-xs text-white/70">{ui.expires}</p>
                  <p className="text-sm font-medium lg:text-base">{expiry}</p>
                </div>
              </div>

              <div className="mt-4 space-y-2">
                {showCardInfo ? (
                  <>
                    <div className="grid grid-cols-2 gap-2 text-xs text-white/80">
                      <p>{ui.cinLabel}: {cardCIN}</p>
                      <p>{ui.cardsCountLabel}: {cardsCount}</p>
                    </div>
                    <button
                      type="button"
                      onClick={onHideCard}
                      className="rounded-lg border border-white/40 px-3 py-1.5 text-xs text-white hover:bg-white/10"
                    >
                      {ui.hideCard}
                    </button>
                  </>
                ) : (
                  <>
                    <p className="text-xs text-white/80">{ui.cardLocked}</p>
                    {mockRevealCode && <p className="text-[11px] text-white/75">{ui.mockCodeLabel}: {mockRevealCode}</p>}
                    <div className="flex items-center gap-2">
                      <input
                        type="password"
                        inputMode="numeric"
                        maxLength={4}
                        value={cardRevealCode}
                        onChange={(event) => setCardRevealCode(event.target.value.replace(/\D/g, "").slice(0, 4))}
                        placeholder={ui.revealCodePlaceholder}
                        className="w-36 rounded-lg border border-white/40 bg-white/10 px-2.5 py-1.5 text-xs text-white placeholder:text-white/60 outline-hidden focus:border-white/70"
                        aria-label={ui.revealCodeLabel}
                      />
                      <button
                        type="button"
                        onClick={onRevealCard}
                        disabled={revealingCard}
                        className="rounded-lg border border-white/40 px-3 py-1.5 text-xs text-white hover:bg-white/10 disabled:opacity-60"
                      >
                        {revealingCard ? "..." : ui.revealCard}
                      </button>
                    </div>
                    {cardRevealError && <p className="text-[11px] text-rose-200">{cardRevealError}</p>}
                  </>
                )}
              </div>
            </article>

            <article className={`rounded-3xl border p-4 ${isDark ? "border-gray-700 bg-gray-800" : "border-gray-200 bg-[#eef1f6]"}`}>
              <div className="mb-4 flex items-center justify-between gap-2">
                <p className="text-base font-medium">{ui.paymentLimit}</p>
                <p className={`text-base font-medium ${isDark ? "text-gray-200" : "text-[#4f5e79]"}`}>
                  {showAmounts ? `${formatNumber(paymentUsed, language)} TND / ${formatNumber(paymentLimitTotal, language)} TND` : "•••••• / ••••••"}
                </p>
              </div>

              <div className={`h-3 overflow-hidden rounded-full ${isDark ? "bg-gray-700" : "bg-[#cbd5e1]"}`}>
                <div
                  className="h-3 rounded-full bg-linear-to-r from-[#183a8f] via-[#2951da] to-[#1cb3ad]"
                  style={{ width: `${paymentUsage}%` }}
                />
              </div>
              <p className="mt-2.5 text-sm font-medium text-[#2951da]">{paymentUsage}% {ui.used}</p>
            </article>
          </div>

          <section>
            <h2 className="mb-3 text-base font-medium">{ui.topCategories}</h2>
            <div className="grid gap-3 md:grid-cols-3">
              {topCategories.map((category, index) => (
                <article
                  key={`${category.label}-${index}`}
                  className={`rounded-2xl border p-3 ${isDark ? "border-gray-700 bg-gray-800" : "border-gray-200 bg-white"}`}
                >
                  <div className="mb-2 flex items-center gap-2">
                    <span className={`h-3 w-3 rounded-full ${colorByIndex[index] || colorByIndex[0]}`} />
                    <p className={`text-xs ${isDark ? "text-gray-300" : "text-[#52617a]"}`}>{category.label}</p>
                  </div>
                  <p className="text-base font-semibold">{showAmounts ? formatAmount(category.amount, language) : "••••••"}</p>
                </article>
              ))}
            </div>
          </section>

          <section className={`rounded-2xl border p-4 ${isDark ? "border-gray-700 bg-gray-800" : "border-gray-200 bg-white"}`}>
            <div className="mb-4 flex items-start justify-between gap-3">
              <div>
                <h2 className="text-base font-medium">{ui.monthlySpending}</h2>
                <p className="text-lg font-semibold">{showAmounts ? formatAmount(selectedMonthSpending, language) : "••••••"}</p>
                <p className={`mt-1 text-xs ${isDark ? "text-gray-400" : "text-[#67768f]"}`}>{selectedMonthMeta}</p>
              </div>
              <div className={`flex items-center gap-4 text-xs ${isDark ? "text-gray-400" : "text-[#67768f]"}`}>
                <button type="button" className={`border-b-4 pb-1 ${isDark ? "border-white text-white" : "border-[#222b44] text-[#222b44]"}`}>
                  {ui.monthlyLabel}
                </button>
                <button type="button" className="pb-1">{ui.yearlyLabel}</button>
              </div>
            </div>

            <div className="mt-6 flex items-end gap-4 overflow-x-auto pb-2">
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
                    className="flex min-w-16 flex-col items-center gap-1.5"
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

          <section>
            <div className="mb-3 flex items-center justify-between gap-3">
              <h2 className="text-base font-medium">{ui.lastTransactions}</h2>
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
                    <article key={item.key} className={`flex items-center justify-between px-3 py-2.5 ${index > 0 ? isDark ? "border-t border-gray-700" : "border-t border-gray-100" : ""}`}>
                      <div className="flex items-start gap-2.5">
                        <span className={`mt-1.5 h-2 w-2 rounded-full ${colorByIndex[index % colorByIndex.length]}`} />
                        <div>
                          <p className="text-sm font-medium">{item.title}</p>
                          <p className={`text-xs ${isDark ? "text-gray-300" : "text-[#5f6f8a]"}`}>{item.category}</p>
                        </div>
                      </div>

                      <div className={isRTL ? "text-left" : "text-right"}>
                        <p className="text-base font-medium text-red-500">-{showAmounts ? formatAmount(item.amount, language) : "••••••"}</p>
                        <p className={`text-[10px] ${isDark ? "text-gray-400" : "text-[#94a0b4]"}`}>{item.time}</p>
                      </div>
                    </article>
                  ))}
                </div>
              )}
            </div>
          </section>
        </section>

        {showProfile && (
          <aside className={`space-y-3 rounded-2xl border p-3 ${isDark ? "border-gray-700 bg-gray-800" : "border-gray-200 bg-white"}`}>
            <h2 className="text-base font-medium">{ui.myProfile}</h2>

            <div className="flex flex-col items-center gap-2 text-center">
              {profilePhoto ? (
                <img src={profilePhoto} alt={name} className="h-20 w-20 rounded-full object-cover" />
              ) : (
                <div className="flex h-20 w-20 items-center justify-center rounded-full bg-linear-to-br from-[#0A2240] to-[#1f5faa] text-xl font-semibold text-white">
                  {profileInitials}
                </div>
              )}
              <p className="text-xl font-medium">{name}</p>
              <p className={`text-xs ${isDark ? "text-gray-300" : "text-[#566783]"}`}>{email}</p>
              <button type="button" onClick={() => navigate("/dashboard/profile")} className="text-xs text-blue-600 hover:text-blue-700">
                {ui.moreInfo}
              </button>
            </div>

            <div className="space-y-2">
              {sidebarCards.map((card) => {
                const Icon = card.icon;
                return (
                  <article key={card.key} className={`rounded-2xl border p-2.5 ${card.cardClass}`}>
                    <div className="flex items-center justify-between gap-2">
                      <div className={`flex items-center gap-3 ${isRTL ? "flex-row-reverse" : ""}`}>
                        <div className={`h-8 w-8 shrink-0 rounded-lg ${card.iconClass} flex items-center justify-center`}>
                          <Icon className="h-4 w-4 text-white" />
                        </div>
                        <div>
                          <p className={`text-xs ${isDark ? "text-gray-400" : "text-gray-500"}`}>{card.label}</p>
                          <p className="text-base font-semibold">{showAmounts ? card.value : "••••••"}</p>
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
