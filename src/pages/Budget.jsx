import { useCallback, useEffect, useMemo, useState } from "react";
import {
  AlertCircle,
  BadgePercent,
  Building2,
  CarFront,
  CalendarDays,
  CheckCircle2,
  FileDown,
  HeartPulse,
  House,
  Landmark,
  Plus,
  Receipt,
  Save,
  ShoppingBag,
  Sparkles,
  Trash2,
  Users,
  Wallet,
  X,
} from "lucide-react";
import { useTheme } from "../contexts/ThemeContext";
import { useLanguage } from "../contexts/LanguageContext";
import { getBudget, upsertBudget } from "../api";
import { Skeleton, SkeletonLines } from "../components/Skeleton";
import { jsPDF } from "jspdf";
import html2canvas from "html2canvas";
import bhLogo from "../assets/BH_logo2.png";

const currentMonth = () => new Date().toISOString().slice(0, 7);

const PRESET_TEMPLATES = [
  {
    key: "housing",
    labels: { en: "Housing", fr: "Logement", ar: "السكن" },
    icon: "home",
    color: "#2563EB",
    budget: 1200,
  },
  {
    key: "food",
    labels: { en: "Food", fr: "Alimentation", ar: "الغذاء" },
    icon: "food",
    color: "#059669",
    budget: 700,
  },
  {
    key: "transport",
    labels: { en: "Transport", fr: "Transport", ar: "النقل" },
    icon: "car",
    color: "#7C3AED",
    budget: 400,
  },
  {
    key: "health",
    labels: { en: "Health", fr: "Sante", ar: "الصحة" },
    icon: "health",
    color: "#DC2626",
    budget: 350,
  },
  {
    key: "education",
    labels: { en: "Education", fr: "Education", ar: "التعليم" },
    icon: "education",
    color: "#D97706",
    budget: 300,
  },
  {
    key: "leisure",
    labels: { en: "Leisure", fr: "Loisirs", ar: "الترفيه" },
    icon: "leisure",
    color: "#DB2777",
    budget: 250,
  },
];

const ICON_OPTIONS = [
  { value: "wallet", label: "Wallet", Icon: Wallet },
  { value: "home", label: "Housing", Icon: House },
  { value: "food", label: "Food", Icon: Receipt },
  { value: "car", label: "Transport", Icon: CarFront },
  { value: "health", label: "Health", Icon: HeartPulse },
  { value: "education", label: "Education", Icon: Landmark },
  { value: "leisure", label: "Leisure", Icon: Sparkles },
  { value: "shopping", label: "Shopping", Icon: ShoppingBag },
  { value: "family", label: "Family", Icon: Users },
  { value: "business", label: "Business", Icon: Building2 },
];

const RAMADAN_CATEGORY_LABELS = {
  food: {
    en: "Ramadan Food",
    fr: "Alimentation Ramadan",
    ar: "غذاء رمضان",
  },
  gifts: {
    en: "Gifts",
    fr: "Cadeaux",
    ar: "الهدايا",
  },
  zakat: {
    en: "Zakat",
    fr: "Zakat",
    ar: "الزكاة",
  },
};

const getRamadanCategoryLabel = (categoryKey, language) => {
  const labels = RAMADAN_CATEGORY_LABELS[String(categoryKey || "").trim().toLowerCase()];
  if (!labels) return String(categoryKey || "").trim();
  return labels[language] || labels.en;
};

const COPY = {
  en: {
    title: "Budget Planner",
    subtitle: "Track monthly spending by category and keep every change synced with the database.",
    month: "Month",
    totalBudget: "Total Budget",
    totalSpent: "Total Spent",
    remaining: "Remaining",
    usageRate: "Usage Rate",
    overBudget: "Over Budget Categories",
    categories: "Categories",
    noCategory: "No categories yet for this month.",
    addCategory: "Add category",
    addPreCategories: "Load pre categories",
    downloadPdf: "Download PDF",
    downloadingPdf: "Generating PDF...",
    save: "Save",
    saving: "Saving...",
    loading: "Loading budget...",
    category: "Category",
    budget: "Budget",
    spent: "Spent",
    cardSpent: "Card spent",
    cashSpent: "Cash spent",
    notes: "Notes",
    icon: "Icon",
    color: "Color",
    pickIcon: "Pick icon",
    iconModalTitle: "Choose an icon",
    iconModalHint: "Select the icon that best matches this category.",
    editCategoryTitle: "Edit category",
    editCategoryHint: "Update category values in a dedicated modal.",
    openCategory: "Open category",
    close: "Close",
    progress: "Progress",
    remove: "Remove",
    successSaved: "Budget saved successfully.",
    saveQueued: "Saved instantly. Syncing with server...",
    preloaded: "Predefined categories were loaded. Save to persist them in database.",
    loadError: "Unable to load budget.",
    saveError: "Budget save failed.",
    invalidCategory: "Category name is required.",
    unsaved: "Unsaved changes",
    pdfReady: "Budget PDF downloaded.",
    pdfGeneratedOn: "Generated",
    pdfStatus: "Status",
    pdfExceeded: "Exceeded",
    pdfWithinLimit: "Within limit",
    alertEmailSent: "Alert email sent for {count} exceeded category(ies).",
    ramadanModeTitle: "Ramadan Preparation Mode",
    ramadanPrepMessage: "Detected 6 weeks before Ramadan. Plan is based on your previous Ramadan spending.",
    ramadanActiveMessage: "Ramadan is active. Live alerts are enabled to avoid exceeding your planned budget.",
    ramadanDaysLeft: "{count} day(s) before Ramadan",
    ramadanSuggestedPlan: "Suggested categories",
    ramadanApplyPlan: "Apply Ramadan plan",
    ramadanPlanApplied: "Ramadan plan applied. Save to persist it.",
    ramadanHistory: "Previous Ramadan spending",
    ramadanRealtimeAlerts: "Live Ramadan alerts",
    ramadanNoRealtimeAlerts: "No exceeded category for now.",
    ramadanExceededBy: "Exceeded by",
    ramadanUpcoming: "Upcoming Ramadan",
    ramadanPrevious: "Previous Ramadan",
  },
  fr: {
    title: "Planificateur de Budget",
    subtitle: "Suivez les depenses mensuelles par categorie et synchronisez chaque modification avec la base de donnees.",
    month: "Mois",
    totalBudget: "Budget Total",
    totalSpent: "Depenses Totales",
    remaining: "Reste",
    usageRate: "Taux d'utilisation",
    overBudget: "Categories depassees",
    categories: "Categories",
    noCategory: "Aucune categorie pour ce mois.",
    addCategory: "Ajouter une categorie",
    addPreCategories: "Charger les pre-categories",
    downloadPdf: "Telecharger PDF",
    downloadingPdf: "Generation PDF...",
    save: "Enregistrer",
    saving: "Enregistrement...",
    loading: "Chargement du budget...",
    category: "Categorie",
    budget: "Budget",
    spent: "Depense",
    cardSpent: "Depense carte",
    cashSpent: "Depense cash",
    notes: "Notes",
    icon: "Icone",
    color: "Couleur",
    pickIcon: "Choisir une icone",
    iconModalTitle: "Choisir une icone",
    iconModalHint: "Selectionnez l'icone la plus adaptee a cette categorie.",
    editCategoryTitle: "Modifier la categorie",
    editCategoryHint: "Mettez a jour les informations de la categorie dans une fenetre dediee.",
    openCategory: "Ouvrir la categorie",
    close: "Fermer",
    progress: "Progression",
    remove: "Supprimer",
    successSaved: "Budget enregistre avec succes.",
    saveQueued: "Enregistre instantanement. Synchronisation avec le serveur...",
    preloaded: "Les pre-categories ont ete chargees. Enregistrez pour les persister en base.",
    loadError: "Impossible de charger le budget.",
    saveError: "Echec de sauvegarde du budget.",
    invalidCategory: "Le nom de categorie est requis.",
    unsaved: "Modifications non enregistrees",
    pdfReady: "PDF budget telecharge.",
    pdfGeneratedOn: "Genere le",
    pdfStatus: "Statut",
    pdfExceeded: "Depasse",
    pdfWithinLimit: "Respecte",
    alertEmailSent: "Email d'alerte envoye pour {count} categorie(s) depassee(s).",
    ramadanModeTitle: "Mode Preparation Ramadan",
    ramadanPrepMessage: "Active automatiquement 6 semaines avant Ramadan avec un plan base sur votre Ramadan precedent.",
    ramadanActiveMessage: "Ramadan est en cours. Les alertes live surveillent les depassements du budget prevu.",
    ramadanDaysLeft: "J-{count} avant Ramadan",
    ramadanSuggestedPlan: "Categories suggerees",
    ramadanApplyPlan: "Appliquer le plan Ramadan",
    ramadanPlanApplied: "Plan Ramadan applique. Enregistrez pour le persister.",
    ramadanHistory: "Depenses du Ramadan precedent",
    ramadanRealtimeAlerts: "Alertes live Ramadan",
    ramadanNoRealtimeAlerts: "Aucune categorie depassee pour le moment.",
    ramadanExceededBy: "Depassement",
    ramadanUpcoming: "Ramadan a venir",
    ramadanPrevious: "Ramadan precedent",
  },
  ar: {
    title: "مخطط الميزانية",
    subtitle: "تابع المصاريف الشهرية حسب الفئة مع مزامنة كل تغيير مباشرة مع قاعدة البيانات.",
    month: "الشهر",
    totalBudget: "إجمالي الميزانية",
    totalSpent: "إجمالي المصروف",
    remaining: "المتبقي",
    usageRate: "نسبة الاستعمال",
    overBudget: "الفئات المتجاوزة",
    categories: "الفئات",
    noCategory: "لا توجد فئات لهذا الشهر.",
    addCategory: "إضافة فئة",
    addPreCategories: "تحميل الفئات الجاهزة",
    downloadPdf: "تحميل PDF",
    downloadingPdf: "جاري إنشاء PDF...",
    save: "حفظ",
    saving: "جارٍ الحفظ...",
    loading: "جارٍ تحميل الميزانية...",
    category: "الفئة",
    budget: "الميزانية",
    spent: "المصروف",
    cardSpent: "مصروف البطاقة",
    cashSpent: "مصروف الكاش",
    notes: "ملاحظات",
    icon: "الأيقونة",
    color: "اللون",
    pickIcon: "اختيار أيقونة",
    iconModalTitle: "اختر الأيقونة",
    iconModalHint: "اختَر الأيقونة الأنسب لهذه الفئة.",
    editCategoryTitle: "تعديل الفئة",
    editCategoryHint: "حدّث بيانات الفئة داخل نافذة مخصصة.",
    openCategory: "فتح الفئة",
    close: "إغلاق",
    progress: "التقدم",
    remove: "حذف",
    successSaved: "تم حفظ الميزانية بنجاح.",
    saveQueued: "تم الحفظ فورا. جاري المزامنة مع الخادم...",
    preloaded: "تم تحميل الفئات الجاهزة. اضغط حفظ لتخزينها في قاعدة البيانات.",
    loadError: "تعذر تحميل الميزانية.",
    saveError: "فشل حفظ الميزانية.",
    invalidCategory: "اسم الفئة مطلوب.",
    unsaved: "تغييرات غير محفوظة",
    pdfReady: "تم تحميل PDF الميزانية.",
    pdfGeneratedOn: "تاريخ الإنشاء",
    pdfStatus: "الحالة",
    pdfExceeded: "متجاوز",
    pdfWithinLimit: "ضمن الحد",
    alertEmailSent: "تم إرسال بريد تنبيه لـ {count} فئة متجاوزة.",
    ramadanModeTitle: "وضع الاستعداد لرمضان",
    ramadanPrepMessage: "يتفعل تلقائيا قبل 6 اسابيع من رمضان مع خطة مبنية على مصاريف رمضان السابق.",
    ramadanActiveMessage: "رمضان نشط حاليا. تم تفعيل التنبيهات الفورية لتجنب تجاوز الميزانية المخططة.",
    ramadanDaysLeft: "متبقي {count} يوم لرمضان",
    ramadanSuggestedPlan: "الفئات المقترحة",
    ramadanApplyPlan: "تطبيق خطة رمضان",
    ramadanPlanApplied: "تم تطبيق خطة رمضان. احفظ لتثبيتها.",
    ramadanHistory: "مصاريف رمضان السابق",
    ramadanRealtimeAlerts: "تنبيهات رمضان الفورية",
    ramadanNoRealtimeAlerts: "لا توجد فئات متجاوزة حاليا.",
    ramadanExceededBy: "قيمة التجاوز",
    ramadanUpcoming: "رمضان القادم",
    ramadanPrevious: "رمضان السابق",
  },
};

const normalizeColor = (value) => {
  const color = String(value || "#0A2240").trim();
  return /^#[0-9A-Fa-f]{6}$/.test(color) ? color : "#0A2240";
};

const normalizeCategory = (item, index) => {
  const iconValue = String(item?.icon || "wallet").trim();
  const icon = ICON_OPTIONS.some((option) => option.value === iconValue) ? iconValue : "wallet";

  const rawSpent = Math.max(0, Number(item?.spent || 0));
  const rawCashSpent = item?.cash_spent;
  const cashSpent = Math.max(
    0,
    Number(rawCashSpent == null || Number.isNaN(Number(rawCashSpent)) ? 0 : rawCashSpent),
  );

  const hasCardSpent = item?.card_spent != null && !Number.isNaN(Number(item?.card_spent));
  const cardSpent = hasCardSpent
    ? Math.max(0, Number(item?.card_spent || 0))
    : Math.max(0, rawSpent - cashSpent);

  const totalSpent = Math.max(0, cardSpent + cashSpent);

  return {
    category: String(item?.category || "").trim(),
    budget: Math.max(0, Number(item?.budget || 0)),
    spent: totalSpent,
    card_spent: cardSpent,
    cash_spent: cashSpent,
    icon,
    color: normalizeColor(item?.color),
    notes: String(item?.notes || "").slice(0, 300),
    sort_order: Number.isFinite(Number(item?.sort_order)) ? Number(item.sort_order) : index,
  };
};

const buildPresetCategories = (language) =>
  PRESET_TEMPLATES.map((template, index) => ({
    category: template.labels[language] || template.labels.en,
    budget: template.budget,
    spent: 0,
    card_spent: 0,
    cash_spent: 0,
    icon: template.icon,
    color: template.color,
    notes: "",
    sort_order: index,
  }));

const withSequentialOrder = (categories) =>
  categories.map((item, index) => ({
    ...item,
    sort_order: index,
  }));

const categorySnapshot = (categories) =>
  JSON.stringify(
    categories.map((item) => ({
      category: String(item.category || ""),
      budget: Number(item.budget || 0),
      spent: Number(item.spent || 0),
      card_spent: Number(item.card_spent || 0),
      cash_spent: Number(item.cash_spent || 0),
      icon: String(item.icon || "wallet"),
      color: normalizeColor(item.color),
      notes: String(item.notes || ""),
      sort_order: Number(item.sort_order || 0),
    })),
  );

const formatAmount = (value) =>
  `${new Intl.NumberFormat("fr-TN", {
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  }).format(Number(value || 0))} TND`;

const formatRate = (value) => `${Number(value || 0).toFixed(2)} %`;

const getLocale = (language) => {
  if (language === "ar") return "ar-TN";
  if (language === "en") return "en-US";
  return "fr-TN";
};

const formatAmountForLocale = (value, language) =>
  `${new Intl.NumberFormat(getLocale(language), {
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  }).format(Number(value || 0))} TND`;

const formatMonthLabel = (value, language) => {
  const normalized = String(value || "").trim();
  if (!/^\d{4}-\d{2}$/.test(normalized)) return normalized || "-";

  const parsed = new Date(`${normalized}-01T00:00:00`);
  if (Number.isNaN(parsed.getTime())) return normalized;

  return new Intl.DateTimeFormat(getLocale(language), {
    month: "long",
    year: "numeric",
  }).format(parsed);
};

const formatDayLabel = (value, language) => {
  const normalized = String(value || "").trim();
  if (!/^\d{4}-\d{2}-\d{2}$/.test(normalized)) return normalized || "-";

  const parsed = new Date(`${normalized}T00:00:00`);
  if (Number.isNaN(parsed.getTime())) return normalized;

  return new Intl.DateTimeFormat(getLocale(language), {
    day: "2-digit",
    month: "short",
    year: "numeric",
  }).format(parsed);
};

const replaceCountToken = (template, count) =>
  String(template || "").replace("{count}", String(count));

const PDF_CATEGORY_LABELS = {
  en: {
    wallet: "Wallet",
    home: "Housing",
    food: "Food",
    car: "Transport",
    health: "Health",
    education: "Education",
    leisure: "Leisure",
    shopping: "Shopping",
    family: "Family",
    business: "Business",
  },
  fr: {
    wallet: "Portefeuille",
    home: "Logement",
    food: "Alimentation",
    car: "Transport",
    health: "Sante",
    education: "Education",
    leisure: "Loisirs",
    shopping: "Shopping",
    family: "Famille",
    business: "Business",
  },
  ar: {
    wallet: "محفظة",
    home: "السكن",
    food: "الغذاء",
    car: "النقل",
    health: "الصحة",
    education: "التعليم",
    leisure: "الترفيه",
    shopping: "التسوق",
    family: "العائلة",
    business: "العمل",
  },
};

const normalizeLabelToken = (value) =>
  String(value || "")
    .trim()
    .toLowerCase()
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .replace(/\s+/g, " ");

const TEMPLATE_BY_LABEL = (() => {
  const lookup = new Map();

  PRESET_TEMPLATES.forEach((template) => {
    Object.values(template.labels).forEach((label) => {
      const token = normalizeLabelToken(label);
      if (token) {
        lookup.set(token, template);
      }
    });
  });

  return lookup;
})();

const ICON_BY_LABEL = (() => {
  const lookup = new Map();

  Object.values(PDF_CATEGORY_LABELS).forEach((labelsByIcon) => {
    Object.entries(labelsByIcon).forEach(([icon, label]) => {
      const token = normalizeLabelToken(label);
      if (token) {
        lookup.set(token, icon);
      }
    });
  });

  return lookup;
})();

const getIconLabelForLanguage = (icon, language) => {
  const labels = PDF_CATEGORY_LABELS[language] || PDF_CATEGORY_LABELS.en;
  return labels[String(icon || "").trim()] || "";
};

const escapeHtml = (value) =>
  String(value ?? "")
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;")
    .replace(/'/g, "&#39;");

const tryFixMojibakeUtf8 = (value) => {
  const raw = String(value ?? "").trim();
  if (!raw) return "";

  const looksMojibake = /[ÃØÙþ]/.test(raw);
  if (!looksMojibake || typeof TextDecoder === "undefined") {
    return raw;
  }

  try {
    const bytes = Uint8Array.from(raw, (char) => char.charCodeAt(0) & 0xff);
    const decoded = new TextDecoder("utf-8", { fatal: false }).decode(bytes).trim();
    if (!decoded) return raw;

    // Keep decoded text only when it becomes clearly readable.
    if (/[\u0600-\u06FFA-Za-zÀ-ÿ]/.test(decoded)) {
      return decoded;
    }
  } catch {
    return raw;
  }

  return raw;
};

const localizeCategoryLabelByLanguage = (rawCategory, icon, language) => {
  const fixedRaw = tryFixMojibakeUtf8(rawCategory);
  const fallbackByIcon = getIconLabelForLanguage(icon, language);

  if (!fixedRaw) return fallbackByIcon;

  const token = normalizeLabelToken(fixedRaw);
  if (!token) return fallbackByIcon || fixedRaw;

  const template = TEMPLATE_BY_LABEL.get(token);
  if (template) {
    return template.labels[language] || template.labels.en;
  }

  const matchedIcon = ICON_BY_LABEL.get(token);
  if (matchedIcon) {
    return getIconLabelForLanguage(matchedIcon, language) || fallbackByIcon || fixedRaw;
  }

  return fixedRaw;
};

const normalizeCategoryLabelForPdf = (item, index, language, t) => {
  const fallbackByIcon = getIconLabelForLanguage(item?.icon, language) || `${t.category} ${index + 1}`;
  const fixed = localizeCategoryLabelByLanguage(item?.category, item?.icon, language);
  if (!fixed) return fallbackByIcon;

  const hasReadableChars = /[A-Za-zÀ-ÿ\u0600-\u06FF]/.test(fixed);
  const hasLegacyMojibakeChars = /[þð�]/i.test(fixed);

  // Hard fallback for still unreadable payloads from legacy encoding.
  if (!hasReadableChars || (hasLegacyMojibakeChars && !/[\u0600-\u06FF]/.test(fixed)) || fixed.length < 2) {
    return fallbackByIcon;
  }

  return fixed;
};

const getProgress = (spent, budget) => {
  if (Number(budget || 0) <= 0) return 0;
  return Math.max(0, (Number(spent || 0) / Number(budget || 1)) * 100);
};

const resolveCategoryIcon = (value) =>
  ICON_OPTIONS.find((option) => option.value === value)?.Icon || Wallet;

function BudgetCategoriesSkeleton({ isDark }) {
  return (
    <div className={`space-y-4 ${isDark ? "skeleton-dark" : ""}`}>
      {Array.from({ length: 3 }).map((_, index) => (
        <article
          key={`budget-skeleton-${index}`}
          className={`rounded-xl border p-5 ${isDark ? "border-gray-700 bg-gray-900/50" : "border-gray-200 bg-gray-50"}`}
        >
          <div className="mb-3 flex items-center justify-between gap-2">
            <div className="flex items-center gap-2">
              <Skeleton className="h-9 w-9 rounded-lg" />
              <Skeleton className="h-4 w-36 rounded-md" />
            </div>
            <Skeleton className="h-8 w-24 rounded-lg" />
          </div>

          <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-6">
            <Skeleton className="h-10 rounded-lg xl:col-span-2" />
            <Skeleton className="h-10 rounded-lg" />
            <Skeleton className="h-10 rounded-lg" />
            <Skeleton className="h-10 rounded-lg xl:col-span-2" />
          </div>

          <SkeletonLines className="mt-3" lines={2} lineClassName="h-3 rounded-md" lastLineClassName="w-4/5" />
          <Skeleton className="mt-3 h-2 w-full rounded-full" />
          <Skeleton className="mt-2 h-3 w-32 rounded-md" />
        </article>
      ))}
    </div>
  );
}

export function Budget() {
  const { theme } = useTheme();
  const { language, isRTL } = useLanguage();
  const isDark = theme === "dark";
  const t = COPY[language] || COPY.en;

  const [month, setMonth] = useState(currentMonth());
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [downloadingPdf, setDownloadingPdf] = useState(false);
  const [ramadanMode, setRamadanMode] = useState(null);
  const [realtimeAlerts, setRealtimeAlerts] = useState([]);
  const [spendingSource, setSpendingSource] = useState("planner");
  const [error, setError] = useState("");
  const [feedback, setFeedback] = useState("");
  const [initialStateHash, setInitialStateHash] = useState("[]");
  const [iconPickerIndex, setIconPickerIndex] = useState(null);
  const [categoryEditorIndex, setCategoryEditorIndex] = useState(null);

  const loadBudget = useCallback(async (targetMonth, options = {}) => {
    const silent = Boolean(options?.silent);

    try {
      if (!silent) {
        setLoading(true);
        setError("");
        setFeedback("");
      }

      const data = await getBudget(targetMonth);
      setRamadanMode(data?.ramadan_mode || null);
      setRealtimeAlerts(Array.isArray(data?.realtime_alerts) ? data.realtime_alerts : []);
      setSpendingSource(String(data?.spending_source || "planner").trim().toLowerCase() || "planner");
      const rawRows = Array.isArray(data?.categories) ? data.categories : [];
      const normalizedRows = withSequentialOrder(
        rawRows.map((row, index) => {
          const normalized = normalizeCategory(row, index);
          return {
            ...normalized,
            category: localizeCategoryLabelByLanguage(normalized.category, normalized.icon, language),
          };
        }),
      );

      if (normalizedRows.length > 0) {
        setCategories(normalizedRows);
        setInitialStateHash(categorySnapshot(normalizedRows));
      } else {
        const presets = buildPresetCategories(language);
        setCategories(presets);
        setInitialStateHash(categorySnapshot([]));
      }
    } catch (err) {
      if (!silent) {
        setError(err.message || t.loadError);
        setRamadanMode(null);
        setRealtimeAlerts([]);
        setSpendingSource("planner");
        setCategories([]);
        setInitialStateHash(categorySnapshot([]));
      }
    } finally {
      if (!silent) {
        setLoading(false);
      }
    }
  }, [language, t.loadError]);

  useEffect(() => {
    loadBudget(month);
  }, [month, loadBudget]);

  useEffect(() => {
    if (month !== currentMonth()) return undefined;
    if ((ramadanMode?.phase || "") !== "active") return undefined;

    const refreshInterval = window.setInterval(() => {
      loadBudget(month, { silent: true });
    }, 60_000);

    return () => window.clearInterval(refreshInterval);
  }, [month, ramadanMode?.phase, loadBudget]);

  const totals = useMemo(() => {
    const budget = categories.reduce((sum, item) => sum + Number(item.budget || 0), 0);
    const spent = categories.reduce((sum, item) => sum + Number(item.spent || 0), 0);
    const remaining = budget - spent;
    const usageRate = budget > 0 ? (spent / budget) * 100 : 0;
    const overBudget = categories.filter((item) => Number(item.spent || 0) > Number(item.budget || 0)).length;

    return {
      budget,
      spent,
      remaining,
      usageRate,
      overBudget,
    };
  }, [categories]);

  const hasUnsavedChanges = useMemo(
    () => categorySnapshot(categories) !== initialStateHash,
    [categories, initialStateHash],
  );

  const updateCategory = (index, field, value) => {
    setCategories((prev) => {
      const next = [...prev];
      const current = next[index] || normalizeCategory({}, index);

      if (field === "budget") {
        next[index] = {
          ...current,
          budget: Math.max(0, Number(value || 0)),
        };
      } else if (field === "spent" || field === "card_spent" || field === "cash_spent") {
        const numericValue = Math.max(0, Number(value || 0));
        const currentCardSpent = Math.max(0, Number(current.card_spent || 0));
        const currentCashSpent = Math.max(0, Number(current.cash_spent || 0));

        let nextCardSpent = currentCardSpent;
        let nextCashSpent = currentCashSpent;

        if (field === "card_spent") {
          nextCardSpent = numericValue;
        } else if (field === "cash_spent") {
          nextCashSpent = numericValue;
        } else {
          // Backward compatibility: when "spent" is used directly, interpret as total spent.
          nextCardSpent = Math.max(0, numericValue - currentCashSpent);
        }

        next[index] = {
          ...current,
          card_spent: nextCardSpent,
          cash_spent: nextCashSpent,
          spent: Math.max(0, nextCardSpent + nextCashSpent),
        };
      } else if (field === "notes") {
        next[index] = {
          ...current,
          notes: String(value || "").slice(0, 300),
        };
      } else if (field === "color") {
        next[index] = {
          ...current,
          color: normalizeColor(value),
        };
      } else {
        next[index] = {
          ...current,
          [field]: String(value || ""),
        };
      }

      return withSequentialOrder(next);
    });
  };

  const addCategory = () => {
    setCategories((prev) =>
      withSequentialOrder([
        ...prev,
        {
          category: "",
          budget: 0,
          spent: 0,
          card_spent: 0,
          cash_spent: 0,
          icon: "wallet",
          color: "#0A2240",
          notes: "",
          sort_order: prev.length,
        },
      ]),
    );
    setCategoryEditorIndex(categories.length);
  };

  const openCategoryEditor = (index) => {
    setCategoryEditorIndex(index);
  };

  const closeCategoryEditor = () => {
    setCategoryEditorIndex(null);
  };

  const openIconPicker = (index) => {
    setIconPickerIndex(index);
  };

  const closeIconPicker = () => {
    setIconPickerIndex(null);
  };

  const selectIconFromModal = (iconValue) => {
    if (iconPickerIndex == null) return;
    updateCategory(iconPickerIndex, "icon", iconValue);
    closeIconPicker();
  };

  useEffect(() => {
    if (iconPickerIndex == null) return;
    if (!categories[iconPickerIndex]) {
      setIconPickerIndex(null);
    }
  }, [categories, iconPickerIndex]);

  useEffect(() => {
    if (categoryEditorIndex == null) return;
    if (!categories[categoryEditorIndex]) {
      setCategoryEditorIndex(null);
    }
  }, [categories, categoryEditorIndex]);

  const removeCategory = (index) => {
    setCategories((prev) => withSequentialOrder(prev.filter((_, idx) => idx !== index)));
  };

  const removeActiveCategory = () => {
    if (categoryEditorIndex == null) return;
    removeCategory(categoryEditorIndex);
    closeCategoryEditor();
  };

  const applyPreCategories = () => {
    setError("");
    setFeedback(t.preloaded);
    setCategories(buildPresetCategories(language));
  };

  const applyRamadanPlan = () => {
    const suggestedRows = Array.isArray(ramadanMode?.suggested_categories)
      ? ramadanMode.suggested_categories
      : [];

    if (!suggestedRows.length) return;

    const mappedRows = withSequentialOrder(
      suggestedRows.map((item, index) =>
        normalizeCategory(
          {
            category: getRamadanCategoryLabel(item?.category_key, language) || `${t.category} ${index + 1}`,
            budget: Math.max(0, Number(item?.budget || 0)),
            spent: Math.max(0, Number(item?.spent || 0)),
            icon: String(item?.icon || "wallet").trim() || "wallet",
            color: normalizeColor(item?.color),
            notes: String(item?.notes || "").slice(0, 300),
            sort_order: index,
          },
          index,
        ),
      ),
    );

    setError("");
    setFeedback(t.ramadanPlanApplied);
    setCategories(mappedRows);
  };

  const saveBudget = async () => {
    const previousSnapshotHash = initialStateHash;

    try {
      setSaving(true);
      setError("");
      setFeedback("");

      const payloadCategories = withSequentialOrder(categories)
        .filter((item) => String(item.category || "").trim().length > 0)
        .map((item, index) => {
          const cardSpent = Math.max(0, Number(item.card_spent || 0));
          const cashSpent = Math.max(0, Number(item.cash_spent || 0));
          const totalSpent = Math.max(0, cardSpent + cashSpent);

          return {
            category: String(item.category || "").trim(),
            budget: Math.max(0, Number(item.budget || 0)),
            spent: totalSpent,
            card_spent: cardSpent,
            cash_spent: cashSpent,
            icon: String(item.icon || "wallet").trim().slice(0, 40) || "wallet",
            color: normalizeColor(item.color),
            notes: String(item.notes || "").slice(0, 300),
            sort_order: index,
          };
        });

      if (payloadCategories.some((item) => !item.category)) {
        throw new Error(t.invalidCategory);
      }

      const normalizedSaved = withSequentialOrder(payloadCategories.map((item, index) => normalizeCategory(item, index)));
      const optimisticSavedHash = categorySnapshot(normalizedSaved);
      setInitialStateHash(optimisticSavedHash);
      setFeedback(t.saveQueued);

      const response = await upsertBudget({
        month,
        categories: payloadCategories,
      });
      const alertsSent = Math.max(0, Number(response?.alerts_sent || 0));

      if (alertsSent > 0) {
        setFeedback(`${t.successSaved} ${replaceCountToken(t.alertEmailSent, alertsSent)}`);
      } else {
        setFeedback(t.successSaved);
      }
      await loadBudget(month, { silent: true });
    } catch (err) {
      setInitialStateHash(previousSnapshotHash);
      setFeedback("");
      setError(err.message || t.saveError);
    } finally {
      setSaving(false);
    }
  };

  const downloadBudgetPdf = async () => {
    let reportContainer = null;

    try {
      setDownloadingPdf(true);
      setError("");
      setFeedback("");

      const printableRows = categories.map((item, index) => {
        const budgetValue = Number(item.budget || 0);
        const spentValue = Number(item.spent || 0);
        const remainingValue = budgetValue - spentValue;
        const exceeded = spentValue > budgetValue;

        return {
          category: normalizeCategoryLabelForPdf(item, index, language, t),
          budget: formatAmountForLocale(budgetValue, language),
          spent: formatAmountForLocale(spentValue, language),
          remaining: formatAmountForLocale(remainingValue, language),
          status: exceeded ? t.pdfExceeded : t.pdfWithinLimit,
          exceeded,
        };
      });

      const exceededRows = printableRows.filter((row) => row.exceeded);
      const rowsMarkup = printableRows
        .map(
          (row) => `
            <tr>
              <td>${escapeHtml(row.category)}</td>
              <td class="num">${escapeHtml(row.budget)}</td>
              <td class="num">${escapeHtml(row.spent)}</td>
              <td class="num">${escapeHtml(row.remaining)}</td>
              <td>
                <span class="status-chip ${row.exceeded ? "status-over" : "status-ok"}">
                  ${escapeHtml(row.status)}
                </span>
              </td>
            </tr>
          `,
        )
        .join("");

      const exceededSummary = exceededRows.length
        ? `${t.overBudget}: ${exceededRows.length} - ${exceededRows.map((row) => row.category).join(", ")}`
        : "";

      reportContainer = document.createElement("div");
      reportContainer.setAttribute("aria-hidden", "true");
      reportContainer.style.position = "fixed";
      reportContainer.style.left = "-20000px";
      reportContainer.style.top = "0";
      reportContainer.style.width = "1080px";
      reportContainer.style.padding = "28px";
      reportContainer.style.background = "#f4f6f9";
      reportContainer.style.zIndex = "-1";

      const pdfLanguageClass = language === "ar" ? "lang-ar" : "lang-default";

      reportContainer.innerHTML = `
        <style>
          .pdf-sheet {
            direction: ${isRTL ? "rtl" : "ltr"};
            font-family: "Bahnschrift", "Segoe UI Variable Text", "Segoe UI", Arial, "Noto Sans Arabic", sans-serif;
            color: #1d2b44;
            border-radius: 24px;
            overflow: hidden;
            background: #f4f6f9;
          }
          .pdf-header {
            position: relative;
            background: #ffffff;
            color: #16263e;
            border: 1px solid #d7dee8;
            border-radius: 24px;
            padding: 30px 34px 28px;
            box-shadow: 0 8px 16px rgba(15, 23, 42, 0.06);
          }
          .pdf-brand {
            display: flex;
            justify-content: center;
            margin-bottom: 12px;
          }
          .pdf-logo {
            width: 260px;
            max-width: 100%;
            max-height: 82px;
            height: auto;
            display: block;
            object-fit: contain;
          }
          .pdf-title {
            margin: 0;
            text-align: center;
            color: #11233c;
            font-size: 56px;
            font-weight: 700;
            letter-spacing: 0.2px;
            line-height: 1.08;
          }
          .pdf-meta-stack {
            margin-top: 30px;
            display: flex;
            justify-content: center;
            gap: 12px;
            flex-wrap: wrap;
          }
          .pdf-meta {
            color: #44546d;
            font-size: 18px;
            font-weight: 500;
            background: #f2f5f9;
            border: 1px solid #d8e0ea;
            border-radius: 999px;
            padding: 9px 16px;
          }
          .pdf-grid {
            margin-top: 26px;
            display: grid;
            grid-template-columns: repeat(2, minmax(0, 1fr));
            gap: 18px;
          }
          .pdf-card {
            background: #ffffff;
            border: 1px solid #d8dfe9;
            border-radius: 18px;
            padding: 18px 20px;
            min-height: 124px;
            box-shadow: 0 8px 18px rgba(15, 23, 42, 0.06);
          }
          .pdf-card-wide {
            grid-column: span 2;
          }
          .pdf-card-label {
            color: #5a6679;
            font-size: 16px;
            font-weight: 600;
            letter-spacing: 0.5px;
            text-transform: uppercase;
          }
          .pdf-card-value {
            margin-top: 14px;
            color: #10213b;
            font-size: 42px;
            font-weight: 700;
            line-height: 1.08;
            font-variant-numeric: tabular-nums;
          }
          .pdf-table-wrap {
            margin-top: 28px;
            background: #ffffff;
            border: 1px solid #d8dfe8;
            border-radius: 18px;
            overflow: hidden;
            box-shadow: 0 10px 20px rgba(15, 23, 42, 0.06);
          }
          .pdf-table-title {
            background: #ffffff;
            color: #11233c;
            font-size: 30px;
            font-weight: 800;
            letter-spacing: 0.2px;
            padding: 18px 20px 12px;
          }
          .pdf-table {
            width: 100%;
            border-collapse: separate;
            border-spacing: 0;
            font-size: 20px;
            table-layout: fixed;
          }
          .pdf-table thead th {
            background: #f1f4f8;
            color: #2b3a52;
            text-align: start;
            padding: 14px 16px;
            font-size: 18px;
            font-weight: 700;
            border-top: 1px solid #dce3ec;
            border-bottom: 1px solid #dce3ec;
          }
          .pdf-table thead th + th {
            border-left: 1px solid #dce3ec;
          }
          .pdf-table tbody td {
            padding: 14px 16px;
            border-bottom: 1px solid #e8edf3;
            color: #1f2d45;
            font-size: 18px;
          }
          .pdf-table tbody td + td {
            border-left: 1px solid #edf2f7;
          }
          .pdf-table tbody tr:nth-child(even) {
            background: #fafbfd;
          }
          .pdf-table tbody tr:last-child td {
            border-bottom: none;
          }
          .pdf-table tbody td:first-child {
            font-weight: 600;
            color: #142843;
          }
          .pdf-table .num {
            text-align: end;
            white-space: nowrap;
            font-variant-numeric: tabular-nums;
          }
          .pdf-sheet.lang-ar {
            font-family: "Tahoma", "Arial", "Segoe UI", "Noto Naskh Arabic", "Noto Sans Arabic", sans-serif;
          }
          .pdf-sheet.lang-ar .pdf-title {
            font-family: "Tahoma", "Arial", "Segoe UI", "Noto Naskh Arabic", "Noto Sans Arabic", sans-serif;
            font-size: 52px;
            font-weight: 700;
            letter-spacing: 0;
            line-height: 1.24;
            text-rendering: optimizeLegibility;
            unicode-bidi: plaintext;
          }
          .pdf-sheet.lang-ar .pdf-meta {
            font-size: 20px;
            line-height: 1.35;
            letter-spacing: 0;
          }
          .pdf-sheet.lang-ar .pdf-card-label {
            text-transform: none;
            letter-spacing: 0;
            font-size: 19px;
            font-weight: 600;
          }
          .pdf-sheet.lang-ar .pdf-card-value {
            font-size: 46px;
            line-height: 1.14;
          }
          .pdf-sheet.lang-ar .pdf-table-title {
            font-size: 36px;
            letter-spacing: 0;
          }
          .pdf-sheet.lang-ar .pdf-table thead th,
          .pdf-sheet.lang-ar .pdf-table tbody td {
            font-size: 20px;
          }
          .pdf-sheet .num {
            direction: ltr;
            unicode-bidi: isolate;
          }
          .status-chip {
            display: inline-block;
            border-radius: 999px;
            padding: 6px 12px;
            font-size: 15px;
            font-weight: 700;
          }
          .status-ok {
            color: #0f7a3a;
            background: #eaf8f0;
            border: 1px solid #c3e9cf;
          }
          .status-over {
            color: #af3527;
            background: #fdeeed;
            border: 1px solid #f6cac6;
          }
          .pdf-alert {
            margin-top: 20px;
            border-radius: 14px;
            padding: 14px 16px;
            background: #fef1ef;
            border: 1px solid #f3c5c0;
            color: #b23b31;
            font-size: 18px;
            font-weight: 700;
            line-height: 1.35;
          }
        </style>

        <div class="pdf-sheet ${pdfLanguageClass}" lang="${escapeHtml(language)}">
          <section class="pdf-header">
            <div class="pdf-brand">
              <img class="pdf-logo" src="${escapeHtml(bhLogo)}" alt="BH Bank" />
            </div>
            <h1 class="pdf-title">${escapeHtml(t.title)}</h1>
            <div class="pdf-meta-stack">
              <div class="pdf-meta">${escapeHtml(`${t.month}: ${formatMonthLabel(month, language)}`)}</div>
              <div class="pdf-meta">${escapeHtml(`${t.pdfGeneratedOn}: ${new Date().toLocaleString(getLocale(language))}`)}</div>
              <div class="pdf-meta">${escapeHtml(`${t.categories}: ${printableRows.length}`)}</div>
            </div>
          </section>

          <section class="pdf-grid">
            <article class="pdf-card">
              <div class="pdf-card-label">${escapeHtml(t.totalBudget)}</div>
              <div class="pdf-card-value">${escapeHtml(formatAmountForLocale(totals.budget, language))}</div>
            </article>
            <article class="pdf-card">
              <div class="pdf-card-label">${escapeHtml(t.totalSpent)}</div>
              <div class="pdf-card-value">${escapeHtml(formatAmountForLocale(totals.spent, language))}</div>
            </article>
            <article class="pdf-card">
              <div class="pdf-card-label">${escapeHtml(t.remaining)}</div>
              <div class="pdf-card-value">${escapeHtml(formatAmountForLocale(totals.remaining, language))}</div>
            </article>
            <article class="pdf-card">
              <div class="pdf-card-label">${escapeHtml(t.usageRate)}</div>
              <div class="pdf-card-value">${escapeHtml(formatRate(totals.usageRate))}</div>
            </article>
            <article class="pdf-card pdf-card-wide">
              <div class="pdf-card-label">${escapeHtml(t.overBudget)}</div>
              <div class="pdf-card-value">${escapeHtml(String(totals.overBudget))}</div>
            </article>
          </section>

          <section class="pdf-table-wrap">
            <div class="pdf-table-title">${escapeHtml(t.categories)}</div>
            <table class="pdf-table">
              <thead>
                <tr>
                  <th>${escapeHtml(t.category)}</th>
                  <th class="num">${escapeHtml(t.budget)}</th>
                  <th class="num">${escapeHtml(t.spent)}</th>
                  <th class="num">${escapeHtml(t.remaining)}</th>
                  <th>${escapeHtml(t.pdfStatus)}</th>
                </tr>
              </thead>
              <tbody>
                ${rowsMarkup || `<tr><td colspan="5">${escapeHtml(t.noCategory)}</td></tr>`}
              </tbody>
            </table>
          </section>

          ${exceededRows.length ? `<section class="pdf-alert">${escapeHtml(exceededSummary)}</section>` : ""}
        </div>
      `;

      document.body.appendChild(reportContainer);

      if (document.fonts?.ready) {
        await document.fonts.ready;
      }

      const canvas = await html2canvas(reportContainer, {
        backgroundColor: "#f4f6f9",
        scale: 2,
        useCORS: true,
        logging: false,
      });

      const pdf = new jsPDF({ unit: "pt", format: "a4", orientation: "portrait" });
      const pageWidth = pdf.internal.pageSize.getWidth();
      const pageHeight = pdf.internal.pageSize.getHeight();
      const margin = 22;
      const printableWidth = pageWidth - margin * 2;
      const printableHeight = pageHeight - margin * 2;
      const pageCanvasHeight = Math.floor((printableHeight * canvas.width) / printableWidth);

      let renderedHeight = 0;
      let pageIndex = 0;

      while (renderedHeight < canvas.height) {
        const sliceHeight = Math.min(pageCanvasHeight, canvas.height - renderedHeight);
        const pageCanvas = document.createElement("canvas");
        pageCanvas.width = canvas.width;
        pageCanvas.height = sliceHeight;

        const context = pageCanvas.getContext("2d");
        if (!context) {
          throw new Error("Canvas context unavailable");
        }

        context.drawImage(
          canvas,
          0,
          renderedHeight,
          canvas.width,
          sliceHeight,
          0,
          0,
          canvas.width,
          sliceHeight,
        );

        if (pageIndex > 0) {
          pdf.addPage();
        }

        const imageData = pageCanvas.toDataURL("image/png");
        const imageHeightOnPdf = (sliceHeight * printableWidth) / canvas.width;
        pdf.addImage(imageData, "PNG", margin, margin, printableWidth, imageHeightOnPdf, undefined, "FAST");

        renderedHeight += sliceHeight;
        pageIndex += 1;
      }

      const safeMonth = String(month || currentMonth()).replace(/[^0-9-]/g, "");
      pdf.save(`budget_${safeMonth || "report"}.pdf`);
      setFeedback(t.pdfReady);
    } catch (err) {
      setError(err?.message || t.saveError);
    } finally {
      if (reportContainer && reportContainer.parentNode) {
        reportContainer.parentNode.removeChild(reportContainer);
      }
      setDownloadingPdf(false);
    }
  };

  const ramadanSuggestedCategories = Array.isArray(ramadanMode?.suggested_categories)
    ? ramadanMode.suggested_categories
    : [];
  const ramadanHistoryTotals =
    ramadanMode && typeof ramadanMode === "object" && ramadanMode.history_totals
      ? ramadanMode.history_totals
      : {};
  const upcomingRamadan =
    ramadanMode && typeof ramadanMode === "object" ? ramadanMode.upcoming_ramadan : null;
  const previousRamadan =
    ramadanMode && typeof ramadanMode === "object" ? ramadanMode.previous_ramadan : null;

  const activeIconCategory =
    iconPickerIndex != null && categories[iconPickerIndex] ? categories[iconPickerIndex] : null;
  const ActiveIconPreview = resolveCategoryIcon(activeIconCategory?.icon || "wallet");
  const activeCategory =
    categoryEditorIndex != null && categories[categoryEditorIndex] ? categories[categoryEditorIndex] : null;
  const ActiveCategoryIcon = resolveCategoryIcon(activeCategory?.icon || "wallet");

  return (
    <div
      dir={isRTL ? "rtl" : "ltr"}
      className={`min-h-full space-y-6 p-4 lg:p-8 ${
        isDark ? "bg-gray-900 text-white" : "bg-gray-50 text-gray-900"
      } ${isRTL ? "text-right" : "text-left"}`}
    >
      <div className="space-y-1">
        <h1 className="text-2xl font-semibold lg:text-3xl">{t.title}</h1>
        <p className={isDark ? "text-gray-400" : "text-gray-600"}>{t.subtitle}</p>
      </div>

      {ramadanMode?.show_mode && (
        <section
          className={`rounded-2xl border p-4 lg:p-5 ${
            isDark
              ? "border-emerald-800/70 bg-emerald-950/10"
              : "border-emerald-200 bg-emerald-50/70"
          }`}
        >
          <div className="flex flex-wrap items-start justify-between gap-4">
            <div className="space-y-1">
              <p className={`text-xs font-semibold uppercase tracking-wide ${isDark ? "text-emerald-300" : "text-emerald-700"}`}>
                {t.ramadanModeTitle}
              </p>
              <p className="text-base font-medium">
                {(ramadanMode?.phase || "") === "active" ? t.ramadanActiveMessage : t.ramadanPrepMessage}
              </p>
              {typeof ramadanMode?.days_until_ramadan === "number" && ramadanMode.days_until_ramadan > 0 && (
                <p className={`text-xs ${isDark ? "text-emerald-300" : "text-emerald-700"}`}>
                  {replaceCountToken(t.ramadanDaysLeft, ramadanMode.days_until_ramadan)}
                </p>
              )}
              {upcomingRamadan?.start_date && upcomingRamadan?.end_date && (
                <p className={`text-xs ${isDark ? "text-gray-300" : "text-gray-700"}`}>
                  {t.ramadanUpcoming}: {formatDayLabel(upcomingRamadan.start_date, language)} - {formatDayLabel(upcomingRamadan.end_date, language)}
                </p>
              )}
              {previousRamadan?.start_date && previousRamadan?.end_date && (
                <p className={`text-xs ${isDark ? "text-gray-400" : "text-gray-600"}`}>
                  {t.ramadanPrevious}: {formatDayLabel(previousRamadan.start_date, language)} - {formatDayLabel(previousRamadan.end_date, language)}
                </p>
              )}
            </div>

            <button
              type="button"
              onClick={applyRamadanPlan}
              disabled={!ramadanSuggestedCategories.length}
              className={`inline-flex items-center gap-2 rounded-xl border px-3 py-2 text-sm disabled:cursor-not-allowed disabled:opacity-60 ${
                isDark
                  ? "border-emerald-700 bg-emerald-900/30 text-emerald-100 hover:bg-emerald-900/40"
                  : "border-emerald-200 bg-white text-emerald-700 hover:bg-emerald-100"
              }`}
            >
              <Sparkles className="h-4 w-4" />
              {t.ramadanApplyPlan}
            </button>
          </div>

          <div className="mt-4 grid gap-3 sm:grid-cols-3">
            {[
              { key: "food", value: Number(ramadanHistoryTotals.food || 0) },
              { key: "gifts", value: Number(ramadanHistoryTotals.gifts || 0) },
              { key: "zakat", value: Number(ramadanHistoryTotals.zakat || 0) },
            ].map((entry) => (
              <div
                key={entry.key}
                className={`rounded-xl border p-3 ${
                  isDark ? "border-emerald-900/80 bg-emerald-950/20" : "border-emerald-200 bg-white"
                }`}
              >
                <p className={`text-xs ${isDark ? "text-emerald-300" : "text-emerald-700"}`}>{t.ramadanHistory}</p>
                <p className="mt-1 text-sm font-medium">{getRamadanCategoryLabel(entry.key, language)}</p>
                <p className="mt-1 text-base font-semibold">{formatAmount(entry.value)}</p>
              </div>
            ))}
          </div>

          {ramadanSuggestedCategories.length > 0 && (
            <div className={`mt-4 rounded-xl border p-3 ${isDark ? "border-gray-700 bg-gray-900/40" : "border-gray-200 bg-white"}`}>
              <p className="mb-2 text-sm font-medium">{t.ramadanSuggestedPlan}</p>
              <div className="grid gap-2 sm:grid-cols-3">
                {ramadanSuggestedCategories.map((item, index) => (
                  <div
                    key={`${item?.category_key || "ramadan"}-${index}`}
                    className={`rounded-lg border px-3 py-2 ${isDark ? "border-gray-700 bg-gray-800" : "border-gray-200 bg-gray-50"}`}
                  >
                    <p className="text-sm font-medium">{getRamadanCategoryLabel(item?.category_key, language)}</p>
                    <p className="text-sm">{formatAmount(item?.budget)}</p>
                  </div>
                ))}
              </div>
            </div>
          )}

          {(ramadanMode?.phase || "") === "active" && (
            <div className={`mt-4 rounded-xl border p-3 ${isDark ? "border-red-900/70 bg-red-950/20" : "border-red-200 bg-red-50"}`}>
              <p className="mb-2 text-sm font-medium">{t.ramadanRealtimeAlerts}</p>
              {realtimeAlerts.length > 0 ? (
                <div className="space-y-2">
                  {realtimeAlerts.map((alert, index) => (
                    <div key={`${alert?.category_key || "alert"}-${index}`} className="flex items-center justify-between gap-3 text-sm">
                      <span className="inline-flex items-center gap-2 font-medium">
                        <AlertCircle className="h-4 w-4" />
                        {getRamadanCategoryLabel(alert?.category_key || alert?.category, language)}
                      </span>
                      <span>
                        {t.ramadanExceededBy}: {formatAmount(alert?.excess || 0)}
                      </span>
                    </div>
                  ))}
                </div>
              ) : (
                <p className={`text-sm ${isDark ? "text-red-200" : "text-red-700"}`}>{t.ramadanNoRealtimeAlerts}</p>
              )}
            </div>
          )}
        </section>
      )}

      <section
        className={`rounded-2xl border p-4 lg:p-5 ${
          isDark
            ? "border-blue-800/70 bg-gray-900"
            : "border-blue-200 bg-white"
        }`}
      >
        <div className="space-y-3">
          <label className="block max-w-xs text-sm">
            <span className="mb-1 inline-flex items-center gap-2">
              <CalendarDays className="h-4 w-4" />
              {t.month}
            </span>
            <input
              type="month"
              value={month}
              onChange={(event) => setMonth(event.target.value)}
              className={`w-full rounded-xl border px-3 py-2 ${
                isDark ? "border-gray-600 bg-gray-800 text-white" : "border-gray-300 bg-white text-gray-900"
              }`}
            />
          </label>

          <div className="grid gap-2 sm:grid-cols-2 xl:grid-cols-4">
            <button
              type="button"
              onClick={applyPreCategories}
              className={`inline-flex items-center justify-center gap-2 rounded-xl border px-3 py-2 text-sm ${
                isDark
                  ? "border-amber-700 bg-amber-950/20 text-amber-200 hover:bg-amber-950/35"
                  : "border-amber-200 bg-amber-50 text-amber-700 hover:bg-amber-100"
              }`}
            >
              <Sparkles className="h-4 w-4" />
              {t.addPreCategories}
            </button>

            <button
              type="button"
              onClick={addCategory}
              className={`inline-flex items-center justify-center gap-2 rounded-xl border px-3 py-2 text-sm ${
                isDark
                  ? "border-gray-600 bg-gray-800 text-gray-200 hover:border-gray-500"
                  : "border-gray-300 bg-white text-gray-700 hover:border-gray-400"
              }`}
            >
              <Plus className="h-4 w-4" />
              {t.addCategory}
            </button>

            <button
              type="button"
              onClick={downloadBudgetPdf}
              disabled={downloadingPdf || loading}
              className={`inline-flex items-center justify-center gap-2 rounded-xl border px-3 py-2 text-sm disabled:cursor-not-allowed disabled:opacity-60 ${
                isDark
                  ? "border-blue-700 bg-blue-950/30 text-blue-200 hover:bg-blue-950/45"
                  : "border-blue-200 bg-blue-50 text-blue-700 hover:bg-blue-100"
              }`}
            >
              <FileDown className="h-4 w-4" />
              {downloadingPdf ? t.downloadingPdf : t.downloadPdf}
            </button>

            <button
              type="button"
              onClick={saveBudget}
              disabled={saving || loading || downloadingPdf}
              className="inline-flex items-center justify-center gap-2 rounded-xl bg-[#0A2240] px-4 py-2 text-sm font-medium text-white hover:bg-[#12305b] disabled:opacity-60"
            >
              <Save className="h-4 w-4" />
              {saving ? t.saving : t.save}
            </button>
          </div>
        </div>

        {hasUnsavedChanges && !saving && (
          <p className={`mt-3 text-xs ${isDark ? "text-amber-200" : "text-amber-700"}`}>• {t.unsaved}</p>
        )}
      </section>

      <section className="grid gap-4 sm:grid-cols-2 xl:grid-cols-5">
        <div className={`rounded-xl border p-4 ${isDark ? "border-gray-700 bg-gray-800" : "border-gray-200 bg-white"}`}>
          <p className={isDark ? "text-gray-400" : "text-gray-500"}>{t.totalBudget}</p>
          <p className="mt-1 text-lg font-semibold">{formatAmount(totals.budget)}</p>
        </div>
        <div className={`rounded-xl border p-4 ${isDark ? "border-gray-700 bg-gray-800" : "border-gray-200 bg-white"}`}>
          <p className={isDark ? "text-gray-400" : "text-gray-500"}>{t.totalSpent}</p>
          <p className="mt-1 text-lg font-semibold">{formatAmount(totals.spent)}</p>
        </div>
        <div className={`rounded-xl border p-4 ${isDark ? "border-gray-700 bg-gray-800" : "border-gray-200 bg-white"}`}>
          <p className={isDark ? "text-gray-400" : "text-gray-500"}>{t.remaining}</p>
          <p className="mt-1 text-lg font-semibold">{formatAmount(totals.remaining)}</p>
        </div>
        <div className={`rounded-xl border p-4 ${isDark ? "border-gray-700 bg-gray-800" : "border-gray-200 bg-white"}`}>
          <p className={isDark ? "text-gray-400" : "text-gray-500"}>{t.usageRate}</p>
          <p className="mt-1 text-lg font-semibold">{formatRate(totals.usageRate)}</p>
        </div>
        <div className={`rounded-xl border p-4 ${isDark ? "border-gray-700 bg-gray-800" : "border-gray-200 bg-white"}`}>
          <p className={isDark ? "text-gray-400" : "text-gray-500"}>{t.overBudget}</p>
          <p className="mt-1 text-lg font-semibold">{totals.overBudget}</p>
        </div>
      </section>

      {(error || feedback) && (
        <div
          className={`flex items-center gap-2 rounded-xl border p-4 text-sm ${
            error
              ? isDark
                ? "border-red-800 bg-red-950/30 text-red-300"
                : "border-red-200 bg-red-50 text-red-700"
              : isDark
                ? "border-emerald-800 bg-emerald-950/20 text-emerald-300"
                : "border-emerald-200 bg-emerald-50 text-emerald-700"
          }`}
        >
          {error ? <AlertCircle className="h-4 w-4" /> : <CheckCircle2 className="h-4 w-4" />}
          {error || feedback}
        </div>
      )}

      <section className={`rounded-2xl border p-5 ${isDark ? "border-gray-700 bg-gray-800" : "border-gray-200 bg-white"}`}>
        <div className="mb-4 flex items-center gap-2">
          <BadgePercent className="h-5 w-5" />
          <h2 className="text-lg font-semibold">{t.categories}</h2>
        </div>

        {loading ? (
          <BudgetCategoriesSkeleton isDark={isDark} />
        ) : categories.length === 0 ? (
          <p className={isDark ? "text-gray-400" : "text-gray-600"}>{t.noCategory}</p>
        ) : (
          <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
            {categories.map((item, index) => {
              const progress = getProgress(item.spent, item.budget);
              const progressColor = progress > 100 ? "bg-red-500" : progress > 80 ? "bg-amber-500" : "bg-emerald-500";
              const CategoryIcon = resolveCategoryIcon(item.icon);
              const localizedCategoryName = localizeCategoryLabelByLanguage(item.category, item.icon, language);

              return (
                <button
                  key={`${item.category || "category"}-${index}`}
                  type="button"
                  onClick={() => openCategoryEditor(index)}
                  aria-label={`${t.openCategory}: ${localizedCategoryName || `${t.category} ${index + 1}`}`}
                  className={`rounded-xl border p-4 transition focus:outline-none focus:ring-2 focus:ring-[#0A2240] ${
                    isDark
                      ? "border-gray-700 bg-gray-900/50 text-white hover:border-gray-500"
                      : "border-gray-200 bg-gray-50 text-gray-900 hover:border-gray-400"
                  } ${isRTL ? "text-right" : "text-left"}`}
                >
                  <div className="flex items-center justify-between gap-2">
                    <span
                      className="inline-flex h-12 w-12 items-center justify-center rounded-xl"
                      style={{ backgroundColor: `${normalizeColor(item.color)}22`, color: normalizeColor(item.color) }}
                    >
                      <CategoryIcon className="h-6 w-6" />
                    </span>
                    <span
                      className={`rounded-lg border px-2 py-1 text-[10px] font-semibold uppercase tracking-wide ${
                        isDark ? "border-gray-600 text-gray-300" : "border-gray-300 text-gray-600"
                      }`}
                    >
                      {t.openCategory}
                    </span>
                  </div>

                  <p className="mt-3 line-clamp-1 text-sm font-semibold">{localizedCategoryName || `${t.category} ${index + 1}`}</p>
                  <p className={`mt-1 text-xs ${isDark ? "text-gray-400" : "text-gray-600"}`}>
                    {formatAmount(item.spent)} / {formatAmount(item.budget)}
                  </p>

                  <div className={`mt-2 h-2 overflow-hidden rounded-full ${isDark ? "bg-gray-700" : "bg-gray-200"}`}>
                    <div
                      className={`h-full ${progressColor}`}
                      style={{ width: `${Math.min(100, Math.max(0, progress))}%` }}
                    />
                  </div>

                  <p className={`mt-2 text-[11px] ${isDark ? "text-gray-500" : "text-gray-500"}`}>
                    {formatRate(progress)}
                  </p>
                </button>
              );
            })}
          </div>
        )}
      </section>

      {activeCategory && (
        <div
          className="fixed inset-0 z-40 flex items-center justify-center bg-black/45 p-4"
          onClick={closeCategoryEditor}
        >
          <div
            role="dialog"
            aria-modal="true"
            aria-label={t.editCategoryTitle}
            onClick={(event) => event.stopPropagation()}
            className={`w-full max-w-3xl rounded-2xl border p-4 shadow-xl ${
              isDark ? "border-gray-700 bg-gray-900 text-white" : "border-gray-200 bg-white text-gray-900"
            }`}
          >
            <div className={`mb-4 flex items-start justify-between gap-3 ${isRTL ? "flex-row-reverse" : ""}`}>
              <div className="flex items-center gap-2">
                <span
                  className="inline-flex h-10 w-10 items-center justify-center rounded-lg"
                  style={{ backgroundColor: `${normalizeColor(activeCategory.color)}22`, color: normalizeColor(activeCategory.color) }}
                >
                  <ActiveCategoryIcon className="h-5 w-5" />
                </span>
                <div>
                  <p className="text-sm font-semibold">{t.editCategoryTitle}</p>
                  <p className={`text-xs ${isDark ? "text-gray-400" : "text-gray-600"}`}>{t.editCategoryHint}</p>
                </div>
              </div>

              <button
                type="button"
                onClick={closeCategoryEditor}
                className={`inline-flex h-8 w-8 items-center justify-center rounded-lg border ${
                  isDark ? "border-gray-600 bg-gray-800 text-gray-200 hover:border-gray-500" : "border-gray-300 bg-white text-gray-700 hover:border-gray-400"
                }`}
                aria-label={t.close}
              >
                <X className="h-4 w-4" />
              </button>
            </div>

            <div className={`grid gap-4 md:grid-cols-2 ${isRTL ? "text-right" : "text-left"}`}>
              <label className="text-sm md:col-span-2">
                <span className="mb-1 block">{t.category}</span>
                <input
                  value={activeCategory.category}
                  onChange={(event) => categoryEditorIndex != null && updateCategory(categoryEditorIndex, "category", event.target.value)}
                  placeholder={t.category}
                  className={`w-full rounded-lg border px-2.5 py-2 ${
                    isDark ? "border-gray-600 bg-gray-800 text-white" : "border-gray-300 bg-white text-gray-900"
                  }`}
                />
              </label>

              <label className="text-sm">
                <span className="mb-1 block">{t.budget}</span>
                <input
                  type="number"
                  min={0}
                  value={activeCategory.budget}
                  onChange={(event) => categoryEditorIndex != null && updateCategory(categoryEditorIndex, "budget", event.target.value)}
                  className={`w-full rounded-lg border px-2.5 py-2 ${
                    isDark ? "border-gray-600 bg-gray-800 text-white" : "border-gray-300 bg-white text-gray-900"
                  }`}
                />
              </label>

              <label className="text-sm">
                <span className="mb-1 block">{t.cashSpent}</span>
                <input
                  type="number"
                  min={0}
                  value={Math.max(0, Number(activeCategory.cash_spent || 0))}
                  onChange={(event) => categoryEditorIndex != null && updateCategory(categoryEditorIndex, "cash_spent", event.target.value)}
                  className={`w-full rounded-lg border px-2.5 py-2 ${
                    isDark ? "border-gray-600 bg-gray-800 text-white" : "border-gray-300 bg-white text-gray-900"
                  }`}
                />
              </label>

              <label className="text-sm">
                <span className="mb-1 block">{t.cardSpent}</span>
                <input
                  type="number"
                  min={0}
                  value={Math.max(0, Number(activeCategory.card_spent || 0))}
                  disabled={spendingSource === "transactions"}
                  onChange={(event) => categoryEditorIndex != null && updateCategory(categoryEditorIndex, "card_spent", event.target.value)}
                  className={`w-full rounded-lg border px-2.5 py-2 ${
                    isDark ? "border-gray-600 bg-gray-800 text-white disabled:bg-gray-900 disabled:text-gray-400" : "border-gray-300 bg-white text-gray-900 disabled:bg-gray-100 disabled:text-gray-500"
                  }`}
                />
                <span className={`mt-1 block min-h-4 text-[11px] ${isDark ? "text-gray-400" : "text-gray-500"}`}>
                  {spendingSource === "transactions" ? `${t.spent} auto` : "\u00A0"}
                </span>
              </label>

              <label className="text-sm">
                <span className="mb-1 block">{t.color}</span>
                <div
                  className={`flex items-center gap-2 rounded-lg border px-2 py-1.5 ${
                    isDark ? "border-gray-600 bg-gray-800" : "border-gray-300 bg-white"
                  }`}
                >
                  <span
                    className="inline-flex h-6 w-6 rounded-md border border-black/10"
                    style={{ backgroundColor: normalizeColor(activeCategory.color) }}
                  />
                  <span className={`text-xs font-mono ${isDark ? "text-gray-300" : "text-gray-700"}`}>{normalizeColor(activeCategory.color)}</span>
                  <input
                    type="color"
                    value={normalizeColor(activeCategory.color)}
                    onChange={(event) => categoryEditorIndex != null && updateCategory(categoryEditorIndex, "color", event.target.value)}
                    className="ml-auto h-8 w-10 cursor-pointer rounded border border-gray-300 bg-white p-0.5"
                  />
                </div>
              </label>

              <label className="text-sm md:col-span-2">
                <span className="mb-1 block">{t.icon}</span>
                <button
                  type="button"
                  onClick={() => categoryEditorIndex != null && openIconPicker(categoryEditorIndex)}
                  className={`flex w-full items-center gap-2 rounded-lg border px-2.5 py-2 text-left ${
                    isDark ? "border-gray-600 bg-gray-800 text-white hover:border-gray-500" : "border-gray-300 bg-white text-gray-900 hover:border-gray-400"
                  } ${isRTL ? "flex-row-reverse text-right" : ""}`}
                >
                  <span
                    className="inline-flex h-9 w-9 shrink-0 items-center justify-center rounded-lg"
                    style={{ backgroundColor: `${normalizeColor(activeCategory.color)}22`, color: normalizeColor(activeCategory.color) }}
                  >
                    <ActiveCategoryIcon className="h-4 w-4" />
                  </span>
                  <span className="min-w-0">
                    <span className={`block text-[11px] ${isDark ? "text-gray-400" : "text-gray-500"}`}>{t.pickIcon}</span>
                    <span className="block truncate text-sm font-medium">{getIconLabelForLanguage(activeCategory.icon, language) || t.icon}</span>
                  </span>
                </button>
              </label>
            </div>

            <label className="mt-3 block text-sm">
              <span className="mb-1 block">{t.notes}</span>
              <textarea
                rows={2}
                value={activeCategory.notes}
                onChange={(event) => categoryEditorIndex != null && updateCategory(categoryEditorIndex, "notes", event.target.value)}
                className={`w-full rounded-lg border px-2.5 py-2 ${
                  isDark ? "border-gray-600 bg-gray-800 text-white" : "border-gray-300 bg-white text-gray-900"
                }`}
              />
            </label>

            <div className="mt-3">
              <div className="mb-1 flex items-center justify-between text-xs">
                <span>{t.progress}</span>
                <span className="font-medium">{formatRate(getProgress(activeCategory.spent, activeCategory.budget))}</span>
              </div>
              <div className={`h-2 overflow-hidden rounded-full ${isDark ? "bg-gray-700" : "bg-gray-200"}`}>
                <div
                  className={`h-full ${
                    getProgress(activeCategory.spent, activeCategory.budget) > 100
                      ? "bg-red-500"
                      : getProgress(activeCategory.spent, activeCategory.budget) > 80
                        ? "bg-amber-500"
                        : "bg-emerald-500"
                  }`}
                  style={{ width: `${Math.min(100, Math.max(0, getProgress(activeCategory.spent, activeCategory.budget)))}%` }}
                />
              </div>
              <p className={`mt-1 text-xs ${isDark ? "text-gray-400" : "text-gray-600"}`}>
                {formatAmount(activeCategory.spent)} / {formatAmount(activeCategory.budget)}
              </p>
              <p className={`mt-0.5 text-[11px] ${isDark ? "text-gray-500" : "text-gray-500"}`}>
                {t.cardSpent}: {formatAmount(activeCategory.card_spent)} + {t.cashSpent}: {formatAmount(activeCategory.cash_spent)}
              </p>
            </div>

            <div className={`mt-4 flex items-center justify-between gap-3 ${isRTL ? "flex-row-reverse" : ""}`}>
              <button
                type="button"
                onClick={removeActiveCategory}
                className={`inline-flex items-center gap-1 rounded-lg border px-3 py-2 text-xs ${
                  isDark
                    ? "border-red-800 bg-red-950/20 text-red-300 hover:bg-red-950/35"
                    : "border-red-200 bg-red-50 text-red-700 hover:bg-red-100"
                }`}
              >
                <Trash2 className="h-3.5 w-3.5" />
                {t.remove}
              </button>

              <button
                type="button"
                onClick={closeCategoryEditor}
                className={`inline-flex items-center rounded-lg border px-3 py-2 text-xs ${
                  isDark ? "border-gray-600 bg-gray-800 text-gray-200 hover:border-gray-500" : "border-gray-300 bg-white text-gray-700 hover:border-gray-400"
                }`}
              >
                {t.close}
              </button>
            </div>
          </div>
        </div>
      )}

      {activeIconCategory && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center bg-black/45 p-4"
          onClick={closeIconPicker}
        >
          <div
            role="dialog"
            aria-modal="true"
            aria-label={t.iconModalTitle}
            onClick={(event) => event.stopPropagation()}
            className={`w-full max-w-xl rounded-2xl border p-4 shadow-xl ${
              isDark ? "border-gray-700 bg-gray-900 text-white" : "border-gray-200 bg-white text-gray-900"
            }`}
          >
            <div className={`mb-4 flex items-start justify-between gap-3 ${isRTL ? "flex-row-reverse" : ""}`}>
              <div className="flex items-center gap-2">
                <span
                  className="inline-flex h-9 w-9 items-center justify-center rounded-lg"
                  style={{ backgroundColor: `${normalizeColor(activeIconCategory.color)}22`, color: normalizeColor(activeIconCategory.color) }}
                >
                  <ActiveIconPreview className="h-4 w-4" />
                </span>
                <div>
                  <p className="text-sm font-semibold">{t.iconModalTitle}</p>
                  <p className={`text-xs ${isDark ? "text-gray-400" : "text-gray-600"}`}>{t.iconModalHint}</p>
                </div>
              </div>

              <button
                type="button"
                onClick={closeIconPicker}
                className={`inline-flex h-8 w-8 items-center justify-center rounded-lg border ${
                  isDark ? "border-gray-600 bg-gray-800 text-gray-200 hover:border-gray-500" : "border-gray-300 bg-white text-gray-700 hover:border-gray-400"
                }`}
                aria-label={t.close}
              >
                <X className="h-4 w-4" />
              </button>
            </div>

            <div className="grid grid-cols-3 gap-2 sm:grid-cols-5">
              {ICON_OPTIONS.map((option) => {
                const optionLabel = getIconLabelForLanguage(option.value, language) || option.label;
                const isSelected = activeIconCategory.icon === option.value;

                return (
                  <button
                    key={option.value}
                    type="button"
                    onClick={() => selectIconFromModal(option.value)}
                    className={`flex items-center gap-2 rounded-xl border px-2.5 py-2 text-left transition ${
                      isSelected
                        ? "border-[#0A2240] bg-[#0A2240] text-white"
                        : isDark
                          ? "border-gray-600 bg-gray-800 text-gray-200 hover:border-gray-500"
                          : "border-gray-300 bg-white text-gray-700 hover:border-gray-400"
                    } ${isRTL ? "flex-row-reverse text-right" : ""}`}
                  >
                    <option.Icon className="h-4 w-4 shrink-0" />
                    <span className="truncate text-xs font-medium">{optionLabel}</span>
                  </button>
                );
              })}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
