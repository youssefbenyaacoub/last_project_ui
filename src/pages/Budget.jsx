import { useEffect, useMemo, useState } from "react";
import {
  AlertCircle,
  BadgePercent,
  Building2,
  CarFront,
  CalendarDays,
  CheckCircle2,
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
} from "lucide-react";
import { useTheme } from "../contexts/ThemeContext";
import { useLanguage } from "../contexts/LanguageContext";
import { getBudget, upsertBudget } from "../api";

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
    save: "Save",
    saving: "Saving...",
    loading: "Loading budget...",
    category: "Category",
    budget: "Budget",
    spent: "Spent",
    notes: "Notes",
    icon: "Icon",
    color: "Color",
    progress: "Progress",
    remove: "Remove",
    successSaved: "Budget saved successfully.",
    preloaded: "Predefined categories were loaded. Save to persist them in database.",
    loadError: "Unable to load budget.",
    saveError: "Budget save failed.",
    invalidCategory: "Category name is required.",
    unsaved: "Unsaved changes",
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
    save: "Enregistrer",
    saving: "Enregistrement...",
    loading: "Chargement du budget...",
    category: "Categorie",
    budget: "Budget",
    spent: "Depense",
    notes: "Notes",
    icon: "Icone",
    color: "Couleur",
    progress: "Progression",
    remove: "Supprimer",
    successSaved: "Budget enregistre avec succes.",
    preloaded: "Les pre-categories ont ete chargees. Enregistrez pour les persister en base.",
    loadError: "Impossible de charger le budget.",
    saveError: "Echec de sauvegarde du budget.",
    invalidCategory: "Le nom de categorie est requis.",
    unsaved: "Modifications non enregistrees",
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
    save: "حفظ",
    saving: "جارٍ الحفظ...",
    loading: "جارٍ تحميل الميزانية...",
    category: "الفئة",
    budget: "الميزانية",
    spent: "المصروف",
    notes: "ملاحظات",
    icon: "الأيقونة",
    color: "اللون",
    progress: "التقدم",
    remove: "حذف",
    successSaved: "تم حفظ الميزانية بنجاح.",
    preloaded: "تم تحميل الفئات الجاهزة. اضغط حفظ لتخزينها في قاعدة البيانات.",
    loadError: "تعذر تحميل الميزانية.",
    saveError: "فشل حفظ الميزانية.",
    invalidCategory: "اسم الفئة مطلوب.",
    unsaved: "تغييرات غير محفوظة",
  },
};

const normalizeColor = (value) => {
  const color = String(value || "#0A2240").trim();
  return /^#[0-9A-Fa-f]{6}$/.test(color) ? color : "#0A2240";
};

const normalizeCategory = (item, index) => {
  const iconValue = String(item?.icon || "wallet").trim();
  const icon = ICON_OPTIONS.some((option) => option.value === iconValue) ? iconValue : "wallet";

  return {
    category: String(item?.category || "").trim(),
    budget: Math.max(0, Number(item?.budget || 0)),
    spent: Math.max(0, Number(item?.spent || 0)),
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

const getProgress = (spent, budget) => {
  if (Number(budget || 0) <= 0) return 0;
  return Math.max(0, (Number(spent || 0) / Number(budget || 1)) * 100);
};

const resolveCategoryIcon = (value) =>
  ICON_OPTIONS.find((option) => option.value === value)?.Icon || Wallet;

export function Budget() {
  const { theme } = useTheme();
  const { language, isRTL } = useLanguage();
  const isDark = theme === "dark";
  const t = COPY[language] || COPY.en;

  const [month, setMonth] = useState(currentMonth());
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState("");
  const [feedback, setFeedback] = useState("");
  const [initialStateHash, setInitialStateHash] = useState("[]");

  const loadBudget = async (targetMonth) => {
    try {
      setLoading(true);
      setError("");
      setFeedback("");

      const data = await getBudget(targetMonth);
      const rawRows = Array.isArray(data?.categories) ? data.categories : [];
      const normalizedRows = withSequentialOrder(rawRows.map((row, index) => normalizeCategory(row, index)));

      if (normalizedRows.length > 0) {
        setCategories(normalizedRows);
        setInitialStateHash(categorySnapshot(normalizedRows));
      } else {
        const presets = buildPresetCategories(language);
        setCategories(presets);
        setInitialStateHash(categorySnapshot([]));
        setFeedback(t.preloaded);
      }
    } catch (err) {
      setError(err.message || t.loadError);
      setCategories([]);
      setInitialStateHash(categorySnapshot([]));
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadBudget(month);
  }, [month]);

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

      if (field === "budget" || field === "spent") {
        next[index] = {
          ...current,
          [field]: Math.max(0, Number(value || 0)),
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
          icon: "wallet",
          color: "#0A2240",
          notes: "",
          sort_order: prev.length,
        },
      ]),
    );
  };

  const removeCategory = (index) => {
    setCategories((prev) => withSequentialOrder(prev.filter((_, idx) => idx !== index)));
  };

  const applyPreCategories = () => {
    setError("");
    setFeedback(t.preloaded);
    setCategories(buildPresetCategories(language));
  };

  const saveBudget = async () => {
    try {
      setSaving(true);
      setError("");
      setFeedback("");

      const payloadCategories = withSequentialOrder(categories)
        .filter((item) => String(item.category || "").trim().length > 0)
        .map((item, index) => ({
          category: String(item.category || "").trim(),
          budget: Math.max(0, Number(item.budget || 0)),
          spent: Math.max(0, Number(item.spent || 0)),
          icon: String(item.icon || "wallet").trim().slice(0, 40) || "wallet",
          color: normalizeColor(item.color),
          notes: String(item.notes || "").slice(0, 300),
          sort_order: index,
        }));

      if (payloadCategories.some((item) => !item.category)) {
        throw new Error(t.invalidCategory);
      }

      await upsertBudget({
        month,
        categories: payloadCategories,
      });

      const normalizedSaved = withSequentialOrder(payloadCategories.map((item, index) => normalizeCategory(item, index)));
      setInitialStateHash(categorySnapshot(normalizedSaved));
      setFeedback(t.successSaved);
      await loadBudget(month);
    } catch (err) {
      setError(err.message || t.saveError);
    } finally {
      setSaving(false);
    }
  };

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

      <section
        className={`rounded-2xl border p-4 lg:p-5 ${
          isDark
            ? "border-blue-800/70 bg-gradient-to-br from-blue-950/30 via-gray-900 to-gray-800"
            : "border-blue-200 bg-gradient-to-br from-blue-50 via-white to-white"
        }`}
      >
        <div className="flex flex-wrap items-end justify-between gap-3">
          <label className="min-w-52 text-sm">
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

          <div className="flex flex-wrap gap-2">
            <button
              type="button"
              onClick={applyPreCategories}
              className={`inline-flex items-center gap-2 rounded-xl border px-3 py-2 text-sm ${
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
              className={`inline-flex items-center gap-2 rounded-xl border px-3 py-2 text-sm ${
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
              onClick={saveBudget}
              disabled={saving || loading}
              className="inline-flex items-center gap-2 rounded-xl bg-[#0A2240] px-4 py-2 text-sm font-medium text-white hover:bg-[#12305b] disabled:opacity-60"
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
          <p className={isDark ? "text-gray-400" : "text-gray-600"}>{t.loading}</p>
        ) : categories.length === 0 ? (
          <p className={isDark ? "text-gray-400" : "text-gray-600"}>{t.noCategory}</p>
        ) : (
          <div className="space-y-4">
            {categories.map((item, index) => {
              const progress = getProgress(item.spent, item.budget);
              const progressColor = progress > 100 ? "bg-red-500" : progress > 80 ? "bg-amber-500" : "bg-emerald-500";
              const CategoryIcon = resolveCategoryIcon(item.icon);

              return (
                <article
                  key={`${item.category || "category"}-${index}`}
                  className={`rounded-xl border p-4 ${isDark ? "border-gray-700 bg-gray-900/50" : "border-gray-200 bg-gray-50"}`}
                >
                  <div className="mb-3 flex flex-wrap items-center justify-between gap-2">
                    <div className="flex items-center gap-2">
                      <span
                        className="inline-flex h-9 w-9 items-center justify-center rounded-lg"
                        style={{ backgroundColor: `${item.color}22`, color: item.color }}
                      >
                        <CategoryIcon className="h-4 w-4" />
                      </span>
                      <p className="font-medium">{item.category || `${t.category} ${index + 1}`}</p>
                    </div>
                    <button
                      type="button"
                      onClick={() => removeCategory(index)}
                      className={`inline-flex items-center gap-1 rounded-lg border px-2.5 py-1.5 text-xs ${
                        isDark
                          ? "border-red-800 bg-red-950/20 text-red-300 hover:bg-red-950/35"
                          : "border-red-200 bg-red-50 text-red-700 hover:bg-red-100"
                      }`}
                    >
                      <Trash2 className="h-3.5 w-3.5" />
                      {t.remove}
                    </button>
                  </div>

                  <div className="grid gap-3 md:grid-cols-2 xl:grid-cols-6">
                    <label className="text-sm xl:col-span-2">
                      <span className="mb-1 block">{t.category}</span>
                      <input
                        value={item.category}
                        onChange={(event) => updateCategory(index, "category", event.target.value)}
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
                        value={item.budget}
                        onChange={(event) => updateCategory(index, "budget", event.target.value)}
                        className={`w-full rounded-lg border px-2.5 py-2 ${
                          isDark ? "border-gray-600 bg-gray-800 text-white" : "border-gray-300 bg-white text-gray-900"
                        }`}
                      />
                    </label>

                    <label className="text-sm">
                      <span className="mb-1 block">{t.spent}</span>
                      <input
                        type="number"
                        min={0}
                        value={item.spent}
                        onChange={(event) => updateCategory(index, "spent", event.target.value)}
                        className={`w-full rounded-lg border px-2.5 py-2 ${
                          isDark ? "border-gray-600 bg-gray-800 text-white" : "border-gray-300 bg-white text-gray-900"
                        }`}
                      />
                    </label>

                    <label className="text-sm xl:col-span-2">
                      <span className="mb-1 block">{t.icon}</span>
                      <div
                        className={`grid grid-cols-5 gap-2 rounded-lg border p-2 ${
                          isDark ? "border-gray-600 bg-gray-800" : "border-gray-300 bg-white"
                        }`}
                      >
                        {ICON_OPTIONS.map((option) => (
                          <button
                            key={option.value}
                            type="button"
                            title={option.label}
                            onClick={() => updateCategory(index, "icon", option.value)}
                            className={`inline-flex h-9 w-9 items-center justify-center rounded-lg border transition ${
                              item.icon === option.value
                                ? "border-[#0A2240] bg-[#0A2240] text-white"
                                : isDark
                                  ? "border-gray-500 bg-gray-700 text-gray-200 hover:border-gray-400"
                                  : "border-gray-300 bg-white text-gray-700 hover:border-gray-400"
                            }`}
                          >
                            <option.Icon className="h-4 w-4" />
                          </button>
                        ))}
                      </div>
                    </label>

                    <label className="text-sm">
                      <span className="mb-1 block">{t.color}</span>
                      <input
                        type="color"
                        value={normalizeColor(item.color)}
                        onChange={(event) => updateCategory(index, "color", event.target.value)}
                        className="h-10 w-full cursor-pointer rounded-lg border border-gray-300 bg-white px-1"
                      />
                    </label>
                  </div>

                  <label className="mt-3 block text-sm">
                    <span className="mb-1 block">{t.notes}</span>
                    <textarea
                      rows={2}
                      value={item.notes}
                      onChange={(event) => updateCategory(index, "notes", event.target.value)}
                      className={`w-full rounded-lg border px-2.5 py-2 ${
                        isDark ? "border-gray-600 bg-gray-800 text-white" : "border-gray-300 bg-white text-gray-900"
                      }`}
                    />
                  </label>

                  <div className="mt-3">
                    <div className="mb-1 flex items-center justify-between text-xs">
                      <span>{t.progress}</span>
                      <span className="font-medium">{formatRate(progress)}</span>
                    </div>
                    <div className={`h-2 overflow-hidden rounded-full ${isDark ? "bg-gray-700" : "bg-gray-200"}`}>
                      <div
                        className={`h-full ${progressColor}`}
                        style={{ width: `${Math.min(100, Math.max(0, progress))}%` }}
                      />
                    </div>
                    <p className={`mt-1 text-xs ${isDark ? "text-gray-400" : "text-gray-600"}`}>
                      {formatAmount(item.spent)} / {formatAmount(item.budget)}
                    </p>
                  </div>
                </article>
              );
            })}
          </div>
        )}
      </section>
    </div>
  );
}
