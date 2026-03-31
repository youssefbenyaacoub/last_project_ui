import { useState } from "react";
import {
  Plus,
  AlertTriangle,
  TrendingUp,
  TrendingDown,
  Edit2,
  Trash2,
  Wallet,
  BarChart3,
  Gauge,
  House,
  Activity,
  ShieldCheck,
  FileText,
  Package,
} from "lucide-react";
import { useTheme } from "../contexts/ThemeContext";
import { useLanguage } from "../contexts/LanguageContext";
import {
  PieChart,
  Pie,
  Cell,
  ResponsiveContainer,
  Legend,
  BarChart,
  Bar,
  CartesianGrid,
  XAxis,
  YAxis,
  Tooltip,
} from "recharts";

const categoryIconMap = {
  food: Package,
  transport: Gauge,
  housing: House,
  entertainment: Activity,
  shopping: Wallet,
  health: ShieldCheck,
  education: FileText,
  other: BarChart3,
};

const initialCategories = [
  {
    id: 1,
    name: { fr: "Alimentation", en: "Food", ar: "الغذاء" },
    budget: 500,
    spent: 420,
    threshold: 90,
    iconKey: "food",
    color: "#2563eb",
  },
  {
    id: 2,
    name: { fr: "Transport", en: "Transport", ar: "النقل" },
    budget: 300,
    spent: 310,
    threshold: 90,
    iconKey: "transport",
    color: "#06b6d4",
  },
  {
    id: 3,
    name: { fr: "Logement", en: "Housing", ar: "السكن" },
    budget: 1200,
    spent: 1200,
    threshold: 100,
    iconKey: "housing",
    color: "#7c3aed",
  },
  {
    id: 4,
    name: { fr: "Divertissement", en: "Entertainment", ar: "الترفيه" },
    budget: 200,
    spent: 180,
    threshold: 90,
    iconKey: "entertainment",
    color: "#f59e0b",
  },
  {
    id: 5,
    name: { fr: "Shopping", en: "Shopping", ar: "التسوق" },
    budget: 400,
    spent: 285,
    threshold: 80,
    iconKey: "shopping",
    color: "#ec4899",
  },
  {
    id: 6,
    name: { fr: "Santé", en: "Health", ar: "الصحة" },
    budget: 150,
    spent: 95,
    threshold: 80,
    iconKey: "health",
    color: "#16a34a",
  },
  {
    id: 7,
    name: { fr: "Éducation", en: "Education", ar: "التعليم" },
    budget: 250,
    spent: 240,
    threshold: 90,
    iconKey: "education",
    color: "#8b5cf6",
  },
  {
    id: 8,
    name: { fr: "Autres", en: "Other", ar: "أخرى" },
    budget: 100,
    spent: 75,
    threshold: 80,
    iconKey: "other",
    color: "#64748b",
  },
];

const uiByLanguage = {
  en: {
    title: "Budget Planner",
    subtitle: "Organized view of your spending, alerts, and performance",
    addCategory: "Add category",
    sectionOverview: "Overview",
    sectionOverviewHint: "Key indicators of your budget",
    sectionAnalytics: "Analytics",
    sectionAnalyticsHint: "Distribution and comparison",
    sectionManage: "Category Management",
    sectionManageHint: "Clear structure to edit or track each category",
    totalBudget: "Total Budget",
    spent: "Spent",
    remaining: "Remaining",
    usageRate: "Usage Rate",
    expenseDistribution: "Expense Distribution",
    budgetVsSpending: "Budget vs Spending by Category",
    overspendingAlerts: "Overspending Alerts",
    noAlerts: "No alerts at the moment",
    thresholdReached: "Threshold reached",
    alertThreshold: "Alert threshold",
    budgetSeries: "Planned Budget",
    spentSeries: "Actual Spending",
  },
  fr: {
    title: "Planificateur de Budget",
    subtitle: "Vue organisée de vos dépenses, alertes et performances",
    addCategory: "Ajouter une catégorie",
    sectionOverview: "Vue d'ensemble",
    sectionOverviewHint: "Indicateurs clés de votre budget",
    sectionAnalytics: "Analytique",
    sectionAnalyticsHint: "Distribution et comparaison",
    sectionManage: "Gestion des catégories",
    sectionManageHint: "Structure claire pour modifier ou suivre chaque poste",
    totalBudget: "Budget total",
    spent: "Dépensé",
    remaining: "Restant",
    usageRate: "Taux d'utilisation",
    expenseDistribution: "Répartition des dépenses",
    budgetVsSpending: "Budget vs Dépenses par catégorie",
    overspendingAlerts: "Alertes de dépassement",
    noAlerts: "Aucune alerte pour le moment",
    thresholdReached: "Seuil atteint",
    alertThreshold: "Seuil d'alerte",
    budgetSeries: "Budget prévu",
    spentSeries: "Dépenses réelles",
  },
  ar: {
    title: "مخطط الميزانية",
    subtitle: "رؤية منظمة لمصاريفك والتنبيهات والأداء",
    addCategory: "إضافة فئة",
    sectionOverview: "نظرة عامة",
    sectionOverviewHint: "مؤشرات أساسية لميزانيتك",
    sectionAnalytics: "التحليلات",
    sectionAnalyticsHint: "توزيع ومقارنة",
    sectionManage: "إدارة الفئات",
    sectionManageHint: "هيكل واضح لتعديل أو متابعة كل بند",
    totalBudget: "الميزانية الإجمالية",
    spent: "المصروف",
    remaining: "المتبقي",
    usageRate: "نسبة الاستعمال",
    expenseDistribution: "توزيع المصاريف",
    budgetVsSpending: "الميزانية مقابل المصروف حسب الفئة",
    overspendingAlerts: "تنبيهات تجاوز الميزانية",
    noAlerts: "لا توجد تنبيهات حالياً",
    thresholdReached: "تم بلوغ الحد",
    alertThreshold: "حد التنبيه",
    budgetSeries: "الميزانية المخططة",
    spentSeries: "المصاريف الفعلية",
  },
};

export function Budget() {
  const { theme } = useTheme();
  const { language, isRTL } = useLanguage();
  const isDark = theme === "dark";
  const langKey = language === "ar" ? "ar" : language === "fr" ? "fr" : "en";
  const copy = uiByLanguage[langKey] || uiByLanguage.en;

  const [categories, setCategories] = useState(initialCategories);

  const getCategoryName = (category) => {
    return category.name[langKey] || category.name.fr || category.name.en;
  };

  const totalBudget = categories.reduce((sum, category) => sum + category.budget, 0);
  const totalSpent = categories.reduce((sum, category) => sum + category.spent, 0);
  const remainingBudget = totalBudget - totalSpent;
  const usageRate = totalBudget === 0 ? 0 : (totalSpent / totalBudget) * 100;

  const alertCategories = categories.filter(
    (category) => (category.spent / category.budget) * 100 >= category.threshold,
  );

  const pieData = categories.map((category) => ({
    name: getCategoryName(category),
    value: category.spent,
    color: category.color,
  }));

  const barData = categories.map((category) => ({
    name: getCategoryName(category),
    budget: category.budget,
    spent: category.spent,
  }));

  const getProgressColor = (spent, budget, threshold) => {
    const percentage = (spent / budget) * 100;
    if (percentage >= 100) return "#dc2626";
    if (percentage >= 90) return "#f97316";
    if (percentage >= 70) return "#facc15";
    if (percentage >= 35) return "#22c55e";
    return "#ffffff";
  };

  const addCategory = () => {
    const newCategory = {
      id: Date.now(),
      name: {
        fr: "Nouvelle catégorie",
        en: "New category",
        ar: "فئة جديدة",
      },
      budget: 150,
      spent: 0,
      threshold: 80,
      iconKey: "other",
      color: "#64748b",
    };

    setCategories((previous) => [...previous, newCategory]);
  };

  const cardClass =
    theme === "dark"
      ? "bg-[#111827] border-[#1f2937]"
      : "bg-white border-[#dbe4f2] shadow-sm";

  const softCardClass =
    theme === "dark"
      ? "bg-[#1f2937]/75 border-[#334155]"
      : "bg-[#f6f9fd] border-[#e3ebf6]";

  const titleClass = theme === "dark" ? "text-[#f3f7ff]" : "text-[#132742]";
  const mutedClass = theme === "dark" ? "text-[#9fb0c9]" : "text-[#667892]";
  const axisTickColor = isDark ? "#9fb0c9" : "#60758f";
  const chartGridColor = isDark ? "#2b3a53" : "#dbe5f2";
  const chartTooltipStyle = {
    backgroundColor: isDark ? "#101c32" : "#ffffff",
    border: `1px solid ${isDark ? "#334155" : "#d7e1f0"}`,
    borderRadius: "10px",
    color: isDark ? "#f3f7ff" : "#132742",
    boxShadow: isDark
      ? "0 8px 28px rgba(0,0,0,0.35)"
      : "0 10px 25px rgba(15,23,42,0.12)",
  };
  const budgetBarColor = isDark ? "#60a5fa" : "#1d4ed8";
  const spentBarColor = isDark ? "#67e8f9" : "#0e7490";

  const compactCategoryLabel = (value) => {
    return value.length > 14 ? `${value.slice(0, 14)}...` : value;
  };

  return (
    <div
      className={`space-y-7 p-4 lg:p-8 ${theme === "dark" ? "bg-[#0b1220]" : "bg-[#f3f7fc]"} ${isRTL ? "text-right" : "text-left"}`}
    >
      {/* Header */}
      <section className={`rounded-2xl border p-6 ${cardClass}`}>
        <div
          className={`flex flex-col gap-4 lg:items-center lg:justify-between ${
            isRTL ? "lg:flex-row-reverse" : "lg:flex-row"
          }`}
        >
          <div>
            <h1 className={`mb-1 text-2xl font-semibold lg:text-3xl ${titleClass}`}>
              {copy.title}
            </h1>
            <p className={`${mutedClass}`}>{copy.subtitle}</p>
          </div>

          <button
            type="button"
            onClick={addCategory}
            className={`inline-flex items-center gap-2 rounded-xl bg-[#0A2240] px-4 py-2.5 text-sm font-semibold text-white transition-colors hover:bg-[#133866] cursor-pointer ${isRTL ? "flex-row-reverse" : ""}`}
          >
            <Plus className="h-4 w-4" />
            {copy.addCategory}
          </button>
        </div>
      </section>

      {/* Overview */}
      <section className="space-y-4">
        <div className="flex items-center justify-between">
          <div>
            <h2 className={`text-lg font-semibold ${titleClass}`}>{copy.sectionOverview}</h2>
            <p className={`text-sm ${mutedClass}`}>{copy.sectionOverviewHint}</p>
          </div>
        </div>

        <div className="grid grid-cols-1 gap-4 md:grid-cols-2 xl:grid-cols-4">
          <div className={`rounded-xl border p-5 ${cardClass}`}>
            <div className={`mb-2 flex items-center justify-between ${isRTL ? "flex-row-reverse" : ""}`}>
              <p className={`text-sm ${mutedClass}`}>{copy.totalBudget}</p>
              <Wallet className="h-5 w-5 text-[#0A2240]" />
            </div>
            <p className={`text-3xl font-bold ${titleClass}`}>{totalBudget} TND</p>
          </div>

          <div className={`rounded-xl border p-5 ${cardClass}`}>
            <div className={`mb-2 flex items-center justify-between ${isRTL ? "flex-row-reverse" : ""}`}>
              <p className={`text-sm ${mutedClass}`}>{copy.spent}</p>
              <TrendingDown className="h-5 w-5 text-[#c27a07]" />
            </div>
            <p className="text-3xl font-bold text-[#b45309]">{totalSpent} TND</p>
          </div>

          <div className={`rounded-xl border p-5 ${cardClass}`}>
            <div className={`mb-2 flex items-center justify-between ${isRTL ? "flex-row-reverse" : ""}`}>
              <p className={`text-sm ${mutedClass}`}>{copy.remaining}</p>
              <TrendingUp className="h-5 w-5 text-emerald-500" />
            </div>
            <p
              className={`text-3xl font-bold ${
                remainingBudget >= 0 ? "text-[#0f766e]" : "text-[#b91c1c]"
              }`}
            >
              {remainingBudget} TND
            </p>
          </div>

          <div className={`rounded-xl border p-5 ${cardClass}`}>
            <div className={`mb-2 flex items-center justify-between ${isRTL ? "flex-row-reverse" : ""}`}>
              <p className={`text-sm ${mutedClass}`}>{copy.usageRate}</p>
              <BarChart3 className="h-5 w-5 text-[#1d4ed8]" />
            </div>
            <p className={`text-3xl font-bold ${titleClass}`}>{usageRate.toFixed(1)}%</p>
          </div>
        </div>
      </section>

      {/* Analytics + Alerts */}
      <section className="space-y-4">
        <div>
          <h2 className={`text-lg font-semibold ${titleClass}`}>{copy.sectionAnalytics}</h2>
          <p className={`text-sm ${mutedClass}`}>{copy.sectionAnalyticsHint}</p>
        </div>

        <div className="grid grid-cols-1 gap-6">
          <div className="grid grid-cols-1 gap-6 xl:grid-cols-2">
            <aside className={`self-start rounded-xl border p-5 ${cardClass}`}>
              <div className={`mb-4 flex items-center gap-2 ${isRTL ? "flex-row-reverse" : ""}`}>
                <AlertTriangle className="h-5 w-5 text-amber-500" />
                <h3 className={`font-semibold ${titleClass}`}>{copy.overspendingAlerts}</h3>
              </div>

              {alertCategories.length === 0 ? (
                <p className={`text-sm ${mutedClass}`}>{copy.noAlerts}</p>
              ) : (
                <div className="space-y-3">
                  {alertCategories.map((category) => {
                    const percentage = ((category.spent / category.budget) * 100).toFixed(0);
                    const Icon = categoryIconMap[category.iconKey] || BarChart3;

                    return (
                      <div key={category.id} className={`rounded-lg border p-3 ${softCardClass}`}>
                        <div className={`mb-2 flex items-center justify-between gap-3 ${isRTL ? "flex-row-reverse" : ""}`}>
                          <div className={`flex items-center gap-2 ${isRTL ? "flex-row-reverse" : ""}`}>
                            <div
                              className="inline-flex h-7 w-7 items-center justify-center rounded-lg"
                              style={{ backgroundColor: `${category.color}22` }}
                            >
                              <Icon className="h-4 w-4" style={{ color: category.color }} />
                            </div>
                            <p className={`text-sm font-medium ${titleClass}`}>
                              {getCategoryName(category)}
                            </p>
                          </div>

                          <span className="text-xs font-semibold text-red-600">{percentage}%</span>
                        </div>
                        <p className={`text-xs ${mutedClass}`}>
                          {category.spent} TND / {category.budget} TND
                        </p>
                      </div>
                    );
                  })}
                </div>
              )}
            </aside>

            <div className={`rounded-xl border p-5 ${cardClass}`}>
              <h3 className={`mb-4 font-semibold ${titleClass}`}>{copy.expenseDistribution}</h3>
              <ResponsiveContainer width="100%" height={280}>
                <PieChart>
                  <Pie
                    data={pieData}
                    cx="50%"
                    cy="50%"
                    outerRadius={90}
                    innerRadius={50}
                    dataKey="value"
                    paddingAngle={3}
                    cornerRadius={7}
                    stroke={isDark ? "#111827" : "#f8fbff"}
                    strokeWidth={2}
                  >
                    {pieData.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={entry.color} />
                    ))}
                  </Pie>
                  <Legend
                    iconType="circle"
                    formatter={(value) => (
                      <span
                        style={{
                          color: isDark ? "#d8e3f3" : "#334b68",
                          fontSize: "12px",
                          fontWeight: 500,
                        }}
                      >
                        {value}
                      </span>
                    )}
                  />
                  <Tooltip
                    contentStyle={chartTooltipStyle}
                    formatter={(value) => `${value} TND`}
                  />
                </PieChart>
              </ResponsiveContainer>
            </div>
          </div>

          <div className={`rounded-xl border p-5 ${cardClass}`}>
            <h3 className={`mb-4 font-semibold ${titleClass}`}>{copy.budgetVsSpending}</h3>
            <ResponsiveContainer width="100%" height={360}>
              <BarChart
                data={barData}
                margin={{ top: 8, right: 16, left: 6, bottom: 56 }}
                barCategoryGap="24%"
                barGap={6}
              >
                <CartesianGrid
                  strokeDasharray="3 3"
                  stroke={chartGridColor}
                  vertical={false}
                />
                <XAxis
                  dataKey="name"
                  tick={{ fontSize: 11, fill: axisTickColor }}
                  interval={0}
                  tickFormatter={compactCategoryLabel}
                  angle={0}
                  textAnchor="middle"
                  height={72}
                  tickMargin={8}
                  tickLine={false}
                  axisLine={false}
                />
                <YAxis
                  tick={{ fontSize: 11, fill: axisTickColor }}
                  tickLine={false}
                  axisLine={false}
                />
                <Tooltip
                  contentStyle={chartTooltipStyle}
                  cursor={{ fill: isDark ? "rgba(255,255,255,0.05)" : "rgba(10,34,64,0.06)" }}
                  formatter={(value, _name, item) => {
                    const label = item?.dataKey === "budget"
                      ? copy.budgetSeries
                      : copy.spentSeries;
                    return [`${value} TND`, label];
                  }}
                />
                <Legend
                  iconType="circle"
                  formatter={(value) => (
                    <span
                      style={{
                        color: isDark ? "#d8e3f3" : "#334b68",
                        fontSize: "12px",
                        fontWeight: 500,
                      }}
                    >
                      {value}
                    </span>
                  )}
                />
                <Bar
                  dataKey="budget"
                  fill={budgetBarColor}
                  name={copy.budgetSeries}
                  radius={[8, 8, 0, 0]}
                  maxBarSize={28}
                />
                <Bar
                  dataKey="spent"
                  fill={spentBarColor}
                  name={copy.spentSeries}
                  radius={[8, 8, 0, 0]}
                  maxBarSize={28}
                />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>
      </section>

      {/* Category Management */}
      <section className="space-y-4">
        <div>
          <h2 className={`text-lg font-semibold ${titleClass}`}>{copy.sectionManage}</h2>
          <p className={`text-sm ${mutedClass}`}>{copy.sectionManageHint}</p>
        </div>

        <div className="grid grid-cols-1 gap-4 xl:grid-cols-2">
          {categories.map((category) => {
            const Icon = categoryIconMap[category.iconKey] || BarChart3;
            const percentage = (category.spent / category.budget) * 100;
            const progress = Math.min(percentage, 100);
            const progressColor = getProgressColor(
              category.spent,
              category.budget,
              category.threshold,
            );

            return (
              <div key={category.id} className={`rounded-xl border p-5 ${cardClass}`}>
                <div className={`mb-4 flex items-start justify-between gap-3 ${isRTL ? "flex-row-reverse" : ""}`}>
                  <div className={`flex items-start gap-3 ${isRTL ? "flex-row-reverse" : ""}`}>
                    <div
                      className="inline-flex h-10 w-10 items-center justify-center rounded-xl"
                      style={{ backgroundColor: `${category.color}20` }}
                    >
                      <Icon className="h-5 w-5" style={{ color: category.color }} />
                    </div>

                    <div>
                      <h4 className={`font-semibold ${titleClass}`}>{getCategoryName(category)}</h4>
                      <p className={`text-sm ${mutedClass}`}>
                        {category.spent} TND / {category.budget} TND
                      </p>
                    </div>
                  </div>

                  <div className={`flex items-center gap-1 ${isRTL ? "flex-row-reverse" : ""}`}>
                    <button
                      type="button"
                      className={`rounded-lg p-2 transition-colors cursor-pointer ${
                        theme === "dark"
                          ? "text-[#b4c3da] hover:bg-[#233047]"
                          : "text-[#5f7390] hover:bg-[#eef3fb]"
                      }`}
                    >
                      <Edit2 className="h-4 w-4" />
                    </button>
                    <button
                      type="button"
                      className="rounded-lg p-2 text-[#b91c1c] transition-colors hover:bg-[#b91c1c]/10 cursor-pointer"
                    >
                      <Trash2 className="h-4 w-4" />
                    </button>
                  </div>
                </div>

                <div
                  className={`h-2.5 overflow-hidden rounded-full ${
                    theme === "dark" ? "bg-[#273449]" : "bg-[#d6e2f3]"
                  }`}
                >
                  <div
                    className="h-full transition-all"
                    style={{
                      width: `${progress}%`,
                      backgroundColor: progressColor,
                      boxShadow:
                        progressColor === "#ffffff"
                          ? "inset 0 0 0 1px rgba(15,23,42,0.2)"
                          : "none",
                    }}
                  />
                </div>

                <div className={`mt-3 flex items-center justify-between ${isRTL ? "flex-row-reverse" : ""}`}>
                  <p className={`text-xs ${mutedClass}`}>
                    {copy.alertThreshold}: {category.threshold}%
                  </p>

                  {percentage >= category.threshold && (
                    <span className={`inline-flex items-center gap-1 text-xs font-medium text-red-600 ${isRTL ? "flex-row-reverse" : ""}`}>
                      <AlertTriangle className="h-3.5 w-3.5" />
                      {copy.thresholdReached}
                    </span>
                  )}
                </div>
              </div>
            );
          })}
        </div>
      </section>
    </div>
  );
}