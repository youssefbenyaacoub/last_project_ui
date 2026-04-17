import { useMemo, useState } from "react";
import {
  AlertCircle,
  BadgePercent,
  BarChart3,
  Building2,
  CarFront,
  Calculator,
  Landmark,
  Package,
  PiggyBank,
  TrendingUp,
  User,
  Wallet,
  Wrench,
} from "lucide-react";
import { useTheme } from "../contexts/ThemeContext";
import { useLanguage } from "../contexts/LanguageContext";
import { savingsProjection, simulateLoan } from "../api";

const TMM_REFERENCE = 6.99;

const getLocalizedLabel = (labels, language) => labels?.[language] || labels?.en || "";

const SOCIO_CATEGORIES = [
  {
    value: "liberal",
    labels: {
      en: "Liberal profession",
      fr: "Profession liberale",
      ar: "مهنة حرة",
    },
  },
  {
    value: "employee",
    labels: {
      en: "Employee",
      fr: "Salarie",
      ar: "موظف",
    },
  },
  {
    value: "senior",
    labels: {
      en: "Senior",
      fr: "Senior",
      ar: "كبار السن",
    },
  },
  {
    value: "tre",
    labels: {
      en: "Tunisian resident abroad",
      fr: "Tunisien resident a l'etranger",
      ar: "تونسي مقيم بالخارج",
    },
  },
];

const LOAN_TYPE_OPTIONS = [
  {
    value: "consommation",
    iconKey: "consommation",
    labels: {
      en: "Consumer Loan",
      fr: "Credit Consommation",
      ar: "قرض استهلاكي",
    },
  },
  {
    value: "amenagement",
    iconKey: "amenagement",
    labels: {
      en: "Renovation Loan",
      fr: "Credit Amenagement",
      ar: "قرض تهيئة",
    },
  },
  {
    value: "auto",
    iconKey: "auto",
    labels: {
      en: "Auto Loan",
      fr: "Credit Auto",
      ar: "قرض سيارة",
    },
  },
  {
    value: "habitat",
    iconKey: "habitat",
    labels: {
      en: "Housing Loan",
      fr: "Credit Habitat",
      ar: "قرض سكن",
    },
  },
];

const AUTO_VARIANTS = [
  {
    value: "neuve_gt4",
    rate: 10.49,
    labels: {
      en: "New car (> 4 hp)",
      fr: "Auto neuve (> 4 cv)",
      ar: "سيارة جديدة (أكثر من 4 خيول)",
    },
  },
  {
    value: "occasion_lte4",
    rate: 10.74,
    labels: {
      en: "Used car (<= 4 hp)",
      fr: "Auto occasion (<= 4 cv)",
      ar: "سيارة مستعملة (4 خيول او اقل)",
    },
  },
  {
    value: "occasion_gt4",
    rate: 10.74,
    labels: {
      en: "Used car (> 4 hp)",
      fr: "Auto occasion (> 4 cv)",
      ar: "سيارة مستعملة (أكثر من 4 خيول)",
    },
  },
];

const HABITAT_TYPES = [
  {
    value: "credit-habitat",
    labels: {
      en: "Housing Loan",
      fr: "Credit Habitat",
      ar: "قرض السكن",
    },
  },
  {
    value: "credit-habitat-direct",
    labels: {
      en: "Housing Loan + Direct Rate",
      fr: "Credit Habitat + Taux credit direct",
      ar: "قرض السكن + نسبة القرض المباشر",
    },
  },
];

const HABITAT_OPTIONS = [
  {
    value: "normal-epargne-logement",
    labels: {
      en: "Normal loan linked to housing savings",
      fr: "Credit Normal lie a l'epargne logement",
      ar: "قرض عادي مرتبط بادخار السكن",
    },
  },
  {
    value: "jedd-epargne-jedd",
    labels: {
      en: "Jedd loan linked to Jedd savings",
      fr: "Credit Jedd lie a l'epargne Jedd",
      ar: "قرض جِدّ مرتبط بادخار جِدّ",
    },
  },
  {
    value: "complementaire",
    labels: {
      en: "Complementary loan",
      fr: "Credit Complementaire",
      ar: "قرض تكميلي",
    },
  },
  {
    value: "direct-sans-epargne",
    labels: {
      en: "Direct loan without prior savings",
      fr: "Credit direct sans epargne prealable",
      ar: "قرض مباشر دون ادخار مسبق",
    },
  },
];

const UI_COPY = {
  en: {
    title: "Credit & Savings Simulator",
    subtitle: "A clearer workflow: choose product, fill profile, then run the simulation.",
    creditMode: "Credit",
    savingsMode: "Savings",
    tmmLabel: "TMM",
    activeRateLabel: "Active rate",
    stepProduct: "1. Product selection",
    stepProfile: "2. Profile and income",
    stepFinance: "3. Financing settings",
    paginationLabel: "Step navigation",
    previous: "Previous",
    next: "Next",
    page: "Page",
    savingsProjection: "Savings projection",
    loanType: "Loan type",
    vehicleType: "Vehicle type / fiscal power",
    habitatType: "Housing type",
    specificOption: "Specific option",
    tmmReference: "Reference TMM",
    appliedRate: "Applied rate",
    socioCategory: "Socio-professional category",
    ageMin: "Age (minimum 18)",
    incomeType: "Income type",
    monthlyGross: "Monthly gross",
    annualGross: "Annual gross",
    grossIncome: "Gross income (TND)",
    otherLoans: "Other monthly installments (TND)",
    monthlyIncomeComputed: "Calculated monthly gross income",
    debtWithoutNew: "Current debt ratio (without new loan)",
    requestedAmount: "Requested loan amount (TND)",
    downPayment: "Down payment (TND)",
    durationMonths: "Duration (months)",
    financedEstimated: "Estimated financed amount",
    selectedProduct: "Selected product",
    runLoan: "Run credit simulation",
    editFinance: "Edit financing settings",
    runSavings: "Run savings projection",
    loading: "Processing...",
    results: "Results",
    noResultsTitle: "No result yet.",
    noResultsSavings: "Fill in savings fields, then run the projection.",
    monthlyPayment: "Monthly payment",
    totalCost: "Total cost",
    totalInterest: "Total interest",
    duration: "Duration",
    debtRatioEstimated: "Estimated debt ratio",
    monthlyGrossIncome: "Monthly gross income",
    otherInstallments: "Other monthly installments",
    financedAmount: "Financed amount",
    initialAmount: "Initial amount",
    annualRate: "Annual rate",
    monthlyDeposit: "Monthly deposit",
    durationYears: "Duration (years)",
    retainedType: "Selected type",
    finalBalance: "Final balance",
    totalDeposited: "Total deposited",
    generatedInterest: "Generated interest",
    projectionPoints: "Projection points",
    rateRecap: "Rate recap",
    months: "months",
    years: "years",
    debtHealthyTitle: "Healthy debt ratio",
    debtHealthyMsg: "Ratio is within the general 40% threshold.",
    debtWatchTitle: "Debt to monitor",
    debtWatchMsg: "Ratio is above 40%. A detailed review is recommended.",
    debtHighTitle: "High debt ratio",
    debtHighMsg: "Ratio is high and may affect approval.",
    errAgeMin: "Minimum age for this simulator is 18.",
    errIncomePositive: "Gross income must be greater than 0.",
    errDurationRange: "Duration must be between 1 and 360 months.",
    errLoanAmountPositive: "Loan amount must be greater than 0.",
    errDownPaymentNegative: "Down payment cannot be negative.",
    errDownPaymentTooHigh: "Down payment cannot exceed requested amount.",
    errFinancedPositive: "Financed amount must be greater than 0.",
    errInitialNonNegative: "Initial amount cannot be negative.",
    errAnnualRatePositive: "Annual rate must be positive.",
    errMonthlyDepositNonNegative: "Monthly deposit cannot be negative.",
    errYearsPositive: "Years must be greater than 0.",
    errGeneric: "Simulation failed.",
  },
  fr: {
    title: "Simulateur Credit & Epargne",
    subtitle: "Un parcours plus clair: choix produit, profil client, puis simulation.",
    creditMode: "Credit",
    savingsMode: "Epargne",
    tmmLabel: "TMM",
    activeRateLabel: "Taux actif",
    stepProduct: "1. Choix du produit",
    stepProfile: "2. Profil et revenus",
    stepFinance: "3. Parametres du financement",
    paginationLabel: "Navigation des etapes",
    previous: "Precedent",
    next: "Suivant",
    page: "Page",
    savingsProjection: "Projection epargne",
    loanType: "Type de credit",
    vehicleType: "Type vehicule / puissance fiscale",
    habitatType: "Type Habitat",
    specificOption: "Option specifique",
    tmmReference: "TMM de reference",
    appliedRate: "Taux applique",
    socioCategory: "Categorie socioprofessionnelle",
    ageMin: "Age (minimum 18 ans)",
    incomeType: "Type de revenu",
    monthlyGross: "Mensuel brut",
    annualGross: "Annuel brut",
    grossIncome: "Revenu brut (TND)",
    otherLoans: "Mensualite autres financements (TND)",
    monthlyIncomeComputed: "Revenu mensuel brut calcule",
    debtWithoutNew: "Endettement actuel (sans nouveau credit)",
    requestedAmount: "Montant credit demande (TND)",
    downPayment: "Apport propre (TND)",
    durationMonths: "Duree (mois)",
    financedEstimated: "Montant finance estime",
    selectedProduct: "Produit selectionne",
    runLoan: "Lancer la simulation credit",
    editFinance: "Modifier les parametres du financement",
    runSavings: "Lancer la projection epargne",
    loading: "Calcul en cours...",
    results: "Resultats",
    noResultsTitle: "Aucun resultat pour le moment.",
    noResultsSavings: "Renseignez les champs epargne puis lancez la projection.",
    monthlyPayment: "Mensualite",
    totalCost: "Cout total",
    totalInterest: "Interets totaux",
    duration: "Duree",
    debtRatioEstimated: "Taux d'endettement estime",
    monthlyGrossIncome: "Revenu mensuel brut",
    otherInstallments: "Autres mensualites",
    financedAmount: "Montant finance",
    initialAmount: "Montant initial",
    annualRate: "Taux annuel",
    monthlyDeposit: "Versement mensuel",
    durationYears: "Duree (annees)",
    retainedType: "Type retenu",
    finalBalance: "Solde final",
    totalDeposited: "Total depose",
    generatedInterest: "Interets generes",
    projectionPoints: "Points de projection",
    rateRecap: "Recapitulatif des taux",
    months: "mois",
    years: "annees",
    debtHealthyTitle: "Endettement sain",
    debtHealthyMsg: "Le ratio reste dans la norme generale de 40%.",
    debtWatchTitle: "Endettement a surveiller",
    debtWatchMsg: "Le ratio depasse 40%. Une analyse detaillee est recommandee.",
    debtHighTitle: "Endettement eleve",
    debtHighMsg: "Le ratio est eleve et peut compromettre l'acceptation.",
    errAgeMin: "L'age minimum pour ce simulateur est 18 ans.",
    errIncomePositive: "Le revenu brut doit etre superieur a 0.",
    errDurationRange: "La duree doit etre entre 1 et 360 mois.",
    errLoanAmountPositive: "Le montant du credit doit etre superieur a 0.",
    errDownPaymentNegative: "L'apport propre ne peut pas etre negatif.",
    errDownPaymentTooHigh: "L'apport propre ne peut pas depasser le montant du credit.",
    errFinancedPositive: "Le montant finance doit etre superieur a 0.",
    errInitialNonNegative: "Le montant initial ne peut pas etre negatif.",
    errAnnualRatePositive: "Le taux annuel doit etre positif.",
    errMonthlyDepositNonNegative: "Le versement mensuel ne peut pas etre negatif.",
    errYearsPositive: "La duree en annees doit etre superieure a 0.",
    errGeneric: "Simulation impossible.",
  },
  ar: {
    title: "محاكي القروض والادخار",
    subtitle: "مسار أوضح: اختر المنتج، أدخل الملف الشخصي، ثم شغّل المحاكاة.",
    creditMode: "قرض",
    savingsMode: "ادخار",
    tmmLabel: "TMM",
    activeRateLabel: "النسبة المعتمدة",
    stepProduct: "1. اختيار المنتج",
    stepProfile: "2. الملف الشخصي والدخل",
    stepFinance: "3. إعدادات التمويل",
    paginationLabel: "التنقل بين المراحل",
    previous: "السابق",
    next: "التالي",
    page: "صفحة",
    savingsProjection: "توقع الادخار",
    loanType: "نوع القرض",
    vehicleType: "نوع السيارة / القوة الجبائية",
    habitatType: "نوع السكن",
    specificOption: "خيار خاص",
    tmmReference: "TMM المرجعي",
    appliedRate: "النسبة المطبقة",
    socioCategory: "الفئة الاجتماعية والمهنية",
    ageMin: "العمر (الحد الأدنى 18)",
    incomeType: "نوع الدخل",
    monthlyGross: "شهري خام",
    annualGross: "سنوي خام",
    grossIncome: "الدخل الخام (TND)",
    otherLoans: "الأقساط الشهرية الأخرى (TND)",
    monthlyIncomeComputed: "الدخل الشهري الخام المحتسب",
    debtWithoutNew: "نسبة المديونية الحالية (بدون قرض جديد)",
    requestedAmount: "مبلغ القرض المطلوب (TND)",
    downPayment: "الدفعة الذاتية (TND)",
    durationMonths: "المدة (بالأشهر)",
    financedEstimated: "المبلغ الممول المتوقع",
    selectedProduct: "المنتج المختار",
    runLoan: "تشغيل محاكاة القرض",
    editFinance: "تعديل إعدادات التمويل",
    runSavings: "تشغيل توقع الادخار",
    loading: "جاري الحساب...",
    results: "النتائج",
    noResultsTitle: "لا توجد نتائج حالياً.",
    noResultsSavings: "املأ بيانات الادخار ثم شغّل التوقع.",
    monthlyPayment: "القسط الشهري",
    totalCost: "الكلفة الإجمالية",
    totalInterest: "إجمالي الفوائد",
    duration: "المدة",
    debtRatioEstimated: "نسبة المديونية التقديرية",
    monthlyGrossIncome: "الدخل الشهري الخام",
    otherInstallments: "الأقساط الأخرى",
    financedAmount: "المبلغ الممول",
    initialAmount: "المبلغ الأولي",
    annualRate: "النسبة السنوية",
    monthlyDeposit: "الإيداع الشهري",
    durationYears: "المدة (بالسنوات)",
    retainedType: "النوع المعتمد",
    finalBalance: "الرصيد النهائي",
    totalDeposited: "إجمالي المبلغ المودع",
    generatedInterest: "الفوائد المتولدة",
    projectionPoints: "نقاط التوقع",
    rateRecap: "ملخص النسب",
    months: "شهر",
    years: "سنوات",
    debtHealthyTitle: "مديونية سليمة",
    debtHealthyMsg: "النسبة ضمن الحد العام 40%.",
    debtWatchTitle: "مديونية تحتاج متابعة",
    debtWatchMsg: "النسبة تتجاوز 40% ويُنصح بمراجعة مفصلة.",
    debtHighTitle: "مديونية مرتفعة",
    debtHighMsg: "النسبة مرتفعة وقد تؤثر على قبول الطلب.",
    errAgeMin: "الحد الأدنى للعمر في هذا المحاكي هو 18 سنة.",
    errIncomePositive: "يجب أن يكون الدخل الخام أكبر من 0.",
    errDurationRange: "يجب أن تكون المدة بين 1 و360 شهراً.",
    errLoanAmountPositive: "يجب أن يكون مبلغ القرض أكبر من 0.",
    errDownPaymentNegative: "لا يمكن أن تكون الدفعة الذاتية سالبة.",
    errDownPaymentTooHigh: "لا يمكن أن تتجاوز الدفعة الذاتية مبلغ القرض.",
    errFinancedPositive: "يجب أن يكون المبلغ الممول أكبر من 0.",
    errInitialNonNegative: "لا يمكن أن يكون المبلغ الأولي سالباً.",
    errAnnualRatePositive: "يجب أن تكون النسبة السنوية موجبة.",
    errMonthlyDepositNonNegative: "لا يمكن أن يكون الادخار الشهري سالباً.",
    errYearsPositive: "يجب أن تكون المدة بالسنوات أكبر من 0.",
    errGeneric: "تعذر تنفيذ المحاكاة.",
  },
};

const toNumber = (value) => Number(value || 0);

const formatAmount = (value) =>
  `${new Intl.NumberFormat("fr-TN", {
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  }).format(Number(value || 0))} TND`;

const formatRate = (value) => `${Number(value || 0).toFixed(2)} %`;

const LOAN_CATEGORY_ICONS = {
  consommation: Package,
  amenagement: Wrench,
  auto: CarFront,
  habitat: Building2,
};

const CATEGORY_ICON_TONES = {
  consommation: {
    light: "border-[#c6d7f1] bg-[#eef4ff] text-[#214b89]",
    dark: "border-[#3e6db1]/70 bg-[#10213e] text-[#bdd5ff]",
  },
  amenagement: {
    light: "border-[#c6d7f1] bg-[#eef4ff] text-[#214b89]",
    dark: "border-[#3e6db1]/70 bg-[#10213e] text-[#bdd5ff]",
  },
  auto: {
    light: "border-[#c6d7f1] bg-[#eef4ff] text-[#214b89]",
    dark: "border-[#3e6db1]/70 bg-[#10213e] text-[#bdd5ff]",
  },
  habitat: {
    light: "border-[#c6d7f1] bg-[#eef4ff] text-[#214b89]",
    dark: "border-[#3e6db1]/70 bg-[#10213e] text-[#bdd5ff]",
  },
};

const categoryIconBadgeClass = (isDark, iconKey) => {
  const tone = CATEGORY_ICON_TONES[iconKey] || CATEGORY_ICON_TONES.consommation;
  return `inline-flex h-10 w-10 items-center justify-center rounded-2xl border shadow-sm ${
    isDark ? tone.dark : tone.light
  }`;
};

const categorySelectorCardClass = (isDark, active) => {
  if (active) {
    return isDark
      ? "border-[#3e6db1]/80 bg-[#10213e] text-white shadow-[0_0_0_2px_rgba(62,109,177,0.25)]"
      : "border-[#214b89]/40 bg-[#f7fbff] text-[#10203c] shadow-[0_0_0_2px_rgba(33,75,137,0.14)]";
  }

  return isDark
    ? "border-white/15 bg-black text-gray-200 hover:border-[#3e6db1]"
    : "border-[#d7e0ee] bg-white text-[#13233f] hover:border-[#c6d7f1]";
};

const SECTION_TONES = {
  neutral: {
    dark: "border-white/10 bg-[#111f37]",
    light: "border-[#dbe4f2] bg-white",
  },
  blue: {
    dark: "border-[#3e6db1]/70 bg-gradient-to-br from-[#0d1628] via-[#10213e] to-[#152b4f]",
    light: "border-[#c6d7f1] bg-gradient-to-br from-white via-[#f5f9ff] to-[#edf4ff]",
  },
  emerald: {
    dark: "border-[#355f9e]/70 bg-gradient-to-br from-[#0d1628] via-[#112744] to-[#0f223d]",
    light: "border-[#c7d8f2] bg-gradient-to-br from-white via-[#f6faff] to-[#eef4ff]",
  },
  indigo: {
    dark: "border-[#2f588f]/70 bg-gradient-to-br from-[#0d1628] via-[#102645] to-[#112d55]",
    light: "border-[#cad9f2] bg-gradient-to-br from-white via-[#f4f8ff] to-[#edf3ff]",
  },
  amber: {
    dark: "border-[#3e6db1]/70 bg-gradient-to-br from-[#0d1628] via-[#10213e] to-[#112846]",
    light: "border-[#c6d7f1] bg-gradient-to-br from-white via-[#f6faff] to-[#edf4ff]",
  },
  rose: {
    dark: "border-[#D71920]/40 bg-gradient-to-br from-[#1e1317] via-[#171b2a] to-[#10213e]",
    light: "border-[#f0c7cb] bg-gradient-to-br from-white via-[#fff7f8] to-[#f7f1f2]",
  },
};

const ICON_TONES = {
  blue: {
    dark: "bg-[#10213e] text-[#bdd5ff]",
    light: "bg-[#eef4ff] text-[#214b89]",
  },
  emerald: {
    dark: "bg-[#10213e] text-[#bdd5ff]",
    light: "bg-[#eef4ff] text-[#214b89]",
  },
  indigo: {
    dark: "bg-[#10213e] text-[#bdd5ff]",
    light: "bg-[#eef4ff] text-[#214b89]",
  },
  amber: {
    dark: "bg-[#3b1a22] text-[#f3b6bd]",
    light: "bg-[#fff0f2] text-[#b21f29]",
  },
  rose: {
    dark: "bg-[#3b1a22] text-[#f3b6bd]",
    light: "bg-[#fff0f2] text-[#b21f29]",
  },
};

const sectionCardClass = (isDark, tone = "neutral") => {
  const resolvedTone = SECTION_TONES[tone] || SECTION_TONES.neutral;
  return `rounded-2xl border shadow-sm ${isDark ? resolvedTone.dark : resolvedTone.light}`;
};

const sectionIconClass = (isDark, tone = "blue") => {
  const resolvedTone = ICON_TONES[tone] || ICON_TONES.blue;
  return `inline-flex h-10 w-10 items-center justify-center rounded-xl border shadow-sm ${
    isDark ? resolvedTone.dark : resolvedTone.light
  } ${isDark ? "border-white/15" : "border-[#d7e0ee]"}`;
};

const miniStatCardClass = (isDark, tone = "blue") => {
  const map = {
    blue: isDark
      ? "border border-[#3e6db1]/70 bg-[#10213e]"
      : "border border-[#c6d7f1] bg-[#eef4ff]",
    emerald: isDark
      ? "border border-[#355f9e]/70 bg-[#0f223d]"
      : "border border-[#c7d8f2] bg-[#f4f8ff]",
    indigo: isDark
      ? "border border-[#2f588f]/70 bg-[#112744]"
      : "border border-[#cad9f2] bg-[#f1f6ff]",
    rose: isDark
      ? "border border-[#D71920]/35 bg-[#28171d]"
      : "border border-[#f0c7cb] bg-[#fff5f6]",
  };

  return `rounded-xl p-3 ${map[tone] || map.blue}`;
};

const inputClass = (isDark, isRTL) =>
  `w-full rounded-xl border px-3 py-2.5 text-sm transition focus:outline-none focus:ring-2 focus:ring-[#214b89]/25 ${
    isDark
      ? "border-white/15 bg-[#0d1628] text-white placeholder:text-white/35"
      : "border-[#d7e0ee] bg-[#fbfcff] text-[#13233f] placeholder:text-[#95a2b9]"
  } ${isRTL ? "text-right" : "text-left"}`;

const quickButtonClass = (isDark, active) =>
  `rounded-lg border px-2.5 py-1 text-xs transition ${
    active
      ? "border-[#0A2240] bg-[#0A2240] text-white"
      : isDark
        ? "border-white/15 bg-[#0d1628] text-white/80 hover:border-[#3e6db1]"
        : "border-[#d7e0ee] bg-white text-[#13233f] hover:border-[#c6d7f1]"
  }`;

const pagerButtonClass = (isDark) =>
  `rounded-lg border px-3 py-2 text-xs font-medium transition disabled:cursor-not-allowed disabled:opacity-45 ${
    isDark
      ? "border-white/15 bg-[#0d1628] text-white/80 hover:border-[#3e6db1]"
      : "border-[#d7e0ee] bg-white text-[#13233f] hover:border-[#c6d7f1]"
  }`;

const getAppliedRate = (loanType, autoVariant) => {
  if (loanType === "consommation") return 11.99;
  if (loanType === "amenagement") return 10.74;
  if (loanType === "habitat") return 10.24;
  if (loanType === "auto") {
    const variant = AUTO_VARIANTS.find((item) => item.value === autoVariant);
    return variant ? variant.rate : 10.74;
  }
  return 10.74;
};

const getLoanLabel = (loanType, autoVariant, language) => {
  if (loanType === "auto") {
    const variant = AUTO_VARIANTS.find((item) => item.value === autoVariant);
    return variant ? getLocalizedLabel(variant.labels, language) : getLocalizedLabel(LOAN_TYPE_OPTIONS[2].labels, language);
  }

  const option = LOAN_TYPE_OPTIONS.find((item) => item.value === loanType);
  return option ? getLocalizedLabel(option.labels, language) : "";
};

const getDebtRatioStatus = (ratio, ui) => {
  if (ratio <= 40) {
    return {
      title: ui.debtHealthyTitle,
      message: ui.debtHealthyMsg,
      chipClass: "bg-[#e8f1ff] text-[#204a8a]",
      barClass: "bg-[#214b89]",
    };
  }

  if (ratio <= 50) {
    return {
      title: ui.debtWatchTitle,
      message: ui.debtWatchMsg,
      chipClass: "bg-[#fff0f2] text-[#a3222b]",
      barClass: "bg-[#D71920]",
    };
  }

  return {
    title: ui.debtHighTitle,
    message: ui.debtHighMsg,
    chipClass: "bg-[#D71920] text-white",
    barClass: "bg-[#D71920]",
  };
};

const buildNoResultLoanMessage = (language, loanLabel, rate) => {
  if (language === "ar") {
    return `المحاكاة جاهزة لمنتج ${loanLabel} بنسبة ${formatRate(rate)}.`;
  }
  if (language === "fr") {
    return `Simulation prete pour ${loanLabel} au taux ${formatRate(rate)}.`;
  }
  return `Simulation is ready for ${loanLabel} at ${formatRate(rate)}.`;
};

export function Simulator() {
  const { theme } = useTheme();
  const { language, isRTL } = useLanguage();
  const isDark = theme === "dark";
  const ui = UI_COPY[language] || UI_COPY.en;

  const [mode, setMode] = useState("loan");
  const [loanStepPage, setLoanStepPage] = useState(1);

  const [loanType, setLoanType] = useState("consommation");
  const [autoVariant, setAutoVariant] = useState("neuve_gt4");
  const [habitatType, setHabitatType] = useState("credit-habitat");
  const [habitatOption, setHabitatOption] = useState("normal-epargne-logement");
  const [socioCategory, setSocioCategory] = useState(SOCIO_CATEGORIES[0].value);
  const [age, setAge] = useState(30);
  const [incomePeriod, setIncomePeriod] = useState("monthly");
  const [grossIncome, setGrossIncome] = useState(3000);
  const [otherMonthlyLoans, setOtherMonthlyLoans] = useState(0);
  const [loanAmount, setLoanAmount] = useState(1000);
  const [downPayment, setDownPayment] = useState(0);
  const [durationMonths, setDurationMonths] = useState(12);

  const [savingsAmount, setSavingsAmount] = useState(10000);
  const [savingsAnnualRate, setSavingsAnnualRate] = useState(8.5);
  const [monthlyDeposit, setMonthlyDeposit] = useState(500);
  const [years, setYears] = useState(5);

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [result, setResult] = useState(null);
  const [hasLoanSimulationTriggered, setHasLoanSimulationTriggered] = useState(false);

  const appliedRate = useMemo(() => getAppliedRate(loanType, autoVariant), [loanType, autoVariant]);

  const supportsDownPayment = loanType === "auto" || loanType === "habitat";

  const normalizedLoanAmount = toNumber(loanAmount);
  const normalizedDownPayment = supportsDownPayment ? toNumber(downPayment) : 0;
  const financedAmountPreview = Math.max(0, normalizedLoanAmount - normalizedDownPayment);

  const monthlyGrossIncome =
    incomePeriod === "annual" ? toNumber(grossIncome) / 12 : toNumber(grossIncome);

  const debtRatioPreview =
    monthlyGrossIncome > 0 ? (toNumber(otherMonthlyLoans) / monthlyGrossIncome) * 100 : 0;

  const loanLabelPreview = getLoanLabel(loanType, autoVariant, language);
  const SelectedLoanIcon = LOAN_CATEGORY_ICONS[loanType] || Landmark;

  const debtRatioResult = toNumber(result?.simulation_meta?.debtRatio);
  const debtStatus = getDebtRatioStatus(debtRatioResult, ui);

  const switchMode = (nextMode) => {
    setMode(nextMode);
    if (nextMode === "loan") {
      setLoanStepPage(1);
    }
    setError("");
    setResult(null);
    setHasLoanSimulationTriggered(false);
  };

  const setLoanTypeWithPreset = (nextType) => {
    setLoanType(nextType);
    setError("");
    setResult(null);
    setHasLoanSimulationTriggered(false);

    if (nextType === "consommation") {
      setLoanAmount(1000);
      setDurationMonths(12);
      setDownPayment(0);
      return;
    }

    if (nextType === "amenagement") {
      setLoanAmount(1000);
      setDurationMonths(12);
      setDownPayment(0);
      return;
    }

    if (nextType === "auto") {
      setLoanAmount(30000);
      setDurationMonths(60);
      setDownPayment(0);
      return;
    }

    if (nextType === "habitat") {
      setLoanAmount(100000);
      setDurationMonths(180);
      setDownPayment(0);
    }
  };

  const runSimulation = async () => {
    try {
      setLoading(true);
      setError("");
      setResult(null);

      if (mode === "loan") {
        setHasLoanSimulationTriggered(true);

        if (toNumber(age) < 18) {
          throw new Error(ui.errAgeMin);
        }

        if (toNumber(grossIncome) <= 0) {
          throw new Error(ui.errIncomePositive);
        }

        if (toNumber(durationMonths) <= 0 || toNumber(durationMonths) > 360) {
          throw new Error(ui.errDurationRange);
        }

        if (normalizedLoanAmount <= 0) {
          throw new Error(ui.errLoanAmountPositive);
        }

        if (normalizedDownPayment < 0) {
          throw new Error(ui.errDownPaymentNegative);
        }

        if (supportsDownPayment && normalizedDownPayment > normalizedLoanAmount) {
          throw new Error(ui.errDownPaymentTooHigh);
        }

        const financedAmount = supportsDownPayment
          ? normalizedLoanAmount - normalizedDownPayment
          : normalizedLoanAmount;

        if (financedAmount <= 0) {
          throw new Error(ui.errFinancedPositive);
        }

        const data = await simulateLoan({
          amount: financedAmount,
          duration_months: Number(durationMonths),
          annual_rate: Number(appliedRate),
          type: loanType,
        });

        const monthlyPayment = toNumber(data?.monthly_payment);
        const otherLoans = toNumber(otherMonthlyLoans);
        const obligations = monthlyPayment + otherLoans;
        const debtRatio = monthlyGrossIncome > 0 ? (obligations / monthlyGrossIncome) * 100 : 0;

        setResult({
          ...data,
          simulation_meta: {
            tmm: TMM_REFERENCE,
            loanType,
            autoVariant,
            habitatType,
            habitatOption,
            socioCategory,
            age: toNumber(age),
            incomePeriod,
            grossIncome: toNumber(grossIncome),
            monthlyGrossIncome,
            otherMonthlyLoans: otherLoans,
            loanAmount: normalizedLoanAmount,
            downPayment: normalizedDownPayment,
            financedAmount,
            annualRate: appliedRate,
            debtRatio,
            debtLimit: 40,
          },
        });
      } else {
        if (toNumber(savingsAmount) < 0) {
          throw new Error(ui.errInitialNonNegative);
        }
        if (toNumber(savingsAnnualRate) < 0) {
          throw new Error(ui.errAnnualRatePositive);
        }
        if (toNumber(monthlyDeposit) < 0) {
          throw new Error(ui.errMonthlyDepositNonNegative);
        }
        if (toNumber(years) <= 0) {
          throw new Error(ui.errYearsPositive);
        }

        const data = await savingsProjection({
          initial_amount: Number(savingsAmount),
          monthly_deposit: Number(monthlyDeposit),
          annual_rate: Number(savingsAnnualRate),
          years: Number(years),
        });
        setResult(data);
      }
    } catch (err) {
      setError(err.message || ui.errGeneric);
    } finally {
      setLoading(false);
    }
  };

  const resultLoanLabel = getLoanLabel(
    result?.simulation_meta?.loanType || loanType,
    result?.simulation_meta?.autoVariant || autoVariant,
    language,
  );

  return (
    <div
      dir={isRTL ? "rtl" : "ltr"}
      className={`min-h-full p-4 lg:p-8 ${
        isDark ? "bg-black text-white" : "bg-white text-black"
      } ${isRTL ? "text-right" : "text-left"}`}
    >
      <div className="mx-auto max-w-7xl space-y-6">
        <section className={`${sectionCardClass(isDark, "neutral")} p-5 lg:p-6`}>
          <div className="flex flex-wrap items-start justify-between gap-4">
            <div>
              <h1 className="text-3xl font-semibold tracking-tight lg:text-4xl">{ui.title}</h1>
              <p className={`mt-2 text-xs font-medium uppercase tracking-[0.12em] ${isDark ? "text-[#bdd5ff]" : "text-[#214b89]"}`}>
                {ui.subtitle}
              </p>
            </div>

            <div className="grid grid-cols-2 gap-2 text-xs sm:text-sm">
              <div
                className={`rounded-xl border px-3 py-2 ${
                  isDark
                    ? "border-[#3e6db1]/70 bg-[#10213e] text-[#d2e3ff]"
                    : "border-[#c6d7f1] bg-[#eef4ff] text-[#214b89]"
                }`}
              >
                <p className="text-[11px] uppercase tracking-wide opacity-80">{ui.tmmLabel}</p>
                <p className="text-lg font-semibold">{formatRate(TMM_REFERENCE)}</p>
              </div>
              <div
                className={`rounded-xl border px-3 py-2 ${
                  isDark
                    ? "border-[#3e6db1]/70 bg-[#10213e] text-[#d2e3ff]"
                    : "border-[#c6d7f1] bg-[#eef4ff] text-[#214b89]"
                }`}
              >
                <p className="text-[11px] uppercase tracking-wide opacity-80">{ui.activeRateLabel}</p>
                <p className="text-lg font-semibold">{formatRate(appliedRate)}</p>
              </div>
            </div>
          </div>

          <div className={`mt-4 inline-flex rounded-xl border p-1 ${isDark ? "border-[#3e6db1]/70 bg-[#0d1628]" : "border-[#c6d7f1] bg-white"}`}>
            <button
              type="button"
              onClick={() => switchMode("loan")}
              className={`inline-flex items-center gap-2 rounded-lg px-4 py-2 text-sm font-medium transition ${
                mode === "loan"
                  ? "bg-[#0A2240] text-white"
                  : isDark
                    ? "text-white/80 hover:bg-[#10213e]"
                    : "text-[#13233f] hover:bg-[#eef4ff]"
              } ${isRTL ? "flex-row-reverse" : ""}`}
            >
              <Landmark className="h-4 w-4" />
              {ui.creditMode}
            </button>
            <button
              type="button"
              onClick={() => switchMode("savings")}
              className={`inline-flex items-center gap-2 rounded-lg px-4 py-2 text-sm font-medium transition ${
                mode === "savings"
                  ? "bg-[#0A2240] text-white"
                  : isDark
                    ? "text-white/80 hover:bg-[#10213e]"
                    : "text-[#13233f] hover:bg-[#eef4ff]"
              } ${isRTL ? "flex-row-reverse" : ""}`}
            >
              <PiggyBank className="h-4 w-4" />
              {ui.savingsMode}
            </button>
          </div>
        </section>

        <div className="space-y-6">
          <div className="space-y-4">
            {mode === "loan" ? (
              <>
                {loanStepPage === 1 && (
                <section className={`${sectionCardClass(isDark, "blue")} p-5`}>
                  <div className={`mb-4 flex items-center gap-2 ${isRTL ? "flex-row-reverse" : ""}`}>
                    <span className={sectionIconClass(isDark, "blue")}>
                      <Landmark className="h-4 w-4" />
                    </span>
                    <h2 className="text-lg font-semibold">{ui.stepProduct}</h2>
                  </div>

                  <div className="grid gap-4 md:grid-cols-2">
                    <div className="text-sm md:col-span-2">
                      <span className="mb-1 block">{ui.loanType}</span>
                      <div className="grid gap-2 sm:grid-cols-2">
                        {LOAN_TYPE_OPTIONS.map((option) => {
                          const CategoryIcon = LOAN_CATEGORY_ICONS[option.iconKey] || Landmark;
                          const active = loanType === option.value;
                          return (
                            <button
                              key={option.value}
                              type="button"
                              onClick={() => setLoanTypeWithPreset(option.value)}
                              className={`flex items-center gap-3 rounded-2xl border px-3 py-2.5 text-sm transition ${categorySelectorCardClass(
                                isDark,
                                active,
                              )} ${isRTL ? "flex-row-reverse" : ""}`}
                            >
                              <span className={categoryIconBadgeClass(isDark, option.iconKey)}>
                                <CategoryIcon className="h-4 w-4" />
                              </span>
                              <span className="font-medium">{getLocalizedLabel(option.labels, language)}</span>
                            </button>
                          );
                        })}
                      </div>
                    </div>

                    {loanType === "auto" && (
                      <label className="block text-sm">
                        <span className="mb-1 block">{ui.vehicleType}</span>
                        <select
                          value={autoVariant}
                          onChange={(event) => {
                            setAutoVariant(event.target.value);
                            setResult(null);
                          }}
                          className={inputClass(isDark, isRTL)}
                        >
                          {AUTO_VARIANTS.map((option) => (
                            <option key={option.value} value={option.value}>
                              {getLocalizedLabel(option.labels, language)}
                            </option>
                          ))}
                        </select>
                      </label>
                    )}

                    {loanType === "habitat" && (
                      <>
                        <label className="block text-sm">
                          <span className="mb-1 block">{ui.habitatType}</span>
                          <select
                            value={habitatType}
                            onChange={(event) => setHabitatType(event.target.value)}
                            className={inputClass(isDark, isRTL)}
                          >
                            {HABITAT_TYPES.map((option) => (
                              <option key={option.value} value={option.value}>
                                {getLocalizedLabel(option.labels, language)}
                              </option>
                            ))}
                          </select>
                        </label>

                        <label className="block text-sm md:col-span-2">
                          <span className="mb-1 block">{ui.specificOption}</span>
                          <select
                            value={habitatOption}
                            onChange={(event) => setHabitatOption(event.target.value)}
                            className={inputClass(isDark, isRTL)}
                          >
                            {HABITAT_OPTIONS.map((option) => (
                              <option key={option.value} value={option.value}>
                                {getLocalizedLabel(option.labels, language)}
                              </option>
                            ))}
                          </select>
                        </label>
                      </>
                    )}
                  </div>

                  <div className="mt-4 grid gap-3 sm:grid-cols-2">
                    <div
                      className={`rounded-xl border px-3 py-3 ${
                        isDark
                          ? "border-[#3e6db1]/70 bg-[#10213e] text-[#d2e3ff]"
                          : "border-[#c6d7f1] bg-[#eef4ff] text-[#214b89]"
                      }`}
                    >
                      <p className="text-xs uppercase tracking-wide opacity-80">{ui.tmmReference}</p>
                      <p className="text-base font-semibold">{formatRate(TMM_REFERENCE)}</p>
                    </div>
                    <div
                      className={`rounded-xl border px-3 py-3 ${
                        isDark
                          ? "border-[#3e6db1]/70 bg-[#10213e] text-[#d2e3ff]"
                          : "border-[#c6d7f1] bg-[#eef4ff] text-[#214b89]"
                      }`}
                    >
                      <p className="text-xs uppercase tracking-wide opacity-80">{ui.appliedRate}</p>
                      <p className="text-base font-semibold">{formatRate(appliedRate)}</p>
                    </div>
                  </div>

                  <div className={`mt-5 flex items-center justify-between ${isRTL ? "flex-row-reverse" : ""}`}>
                    <button
                      type="button"
                      onClick={() => setLoanStepPage((current) => Math.max(1, current - 1))}
                      disabled
                      className={pagerButtonClass(isDark)}
                    >
                      {ui.previous}
                    </button>
                    <button
                      type="button"
                      onClick={() => setLoanStepPage(2)}
                      className={pagerButtonClass(isDark)}
                    >
                      {ui.next}
                    </button>
                  </div>
                </section>
                )}

                {loanStepPage === 2 && (
                <section className={`${sectionCardClass(isDark, "emerald")} p-5`}>
                  <div className={`mb-4 flex items-center gap-2 ${isRTL ? "flex-row-reverse" : ""}`}>
                    <span className={sectionIconClass(isDark, "emerald")}>
                      <User className="h-4 w-4" />
                    </span>
                    <h2 className="text-lg font-semibold">{ui.stepProfile}</h2>
                  </div>

                  <div className="grid gap-4 md:grid-cols-2">
                    <label className="block text-sm">
                      <span className="mb-1 block">{ui.socioCategory}</span>
                      <select
                        value={socioCategory}
                        onChange={(event) => setSocioCategory(event.target.value)}
                        className={inputClass(isDark, isRTL)}
                      >
                        {SOCIO_CATEGORIES.map((category) => (
                          <option key={category.value} value={category.value}>
                            {getLocalizedLabel(category.labels, language)}
                          </option>
                        ))}
                      </select>
                    </label>

                    <label className="block text-sm">
                      <span className="mb-1 block">{ui.ageMin}</span>
                      <input
                        type="number"
                        min={18}
                        value={age}
                        onChange={(event) => setAge(event.target.value)}
                        className={inputClass(isDark, isRTL)}
                      />
                    </label>

                    <label className="block text-sm">
                      <span className="mb-1 block">{ui.incomeType}</span>
                      <select
                        value={incomePeriod}
                        onChange={(event) => setIncomePeriod(event.target.value)}
                        className={inputClass(isDark, isRTL)}
                      >
                        <option value="monthly">{ui.monthlyGross}</option>
                        <option value="annual">{ui.annualGross}</option>
                      </select>
                    </label>

                    <label className="block text-sm">
                      <span className="mb-1 block">{ui.grossIncome}</span>
                      <input
                        type="number"
                        value={grossIncome}
                        onChange={(event) => setGrossIncome(event.target.value)}
                        className={inputClass(isDark, isRTL)}
                      />
                    </label>

                    <label className="block text-sm md:col-span-2">
                      <span className="mb-1 block">{ui.otherLoans}</span>
                      <input
                        type="number"
                        value={otherMonthlyLoans}
                        onChange={(event) => setOtherMonthlyLoans(event.target.value)}
                        className={inputClass(isDark, isRTL)}
                      />
                    </label>
                  </div>

                  <div
                    className={`mt-4 rounded-xl border p-3 text-sm ${
                      isDark
                        ? "border-[#3e6db1]/60 bg-[#10213e]/70 text-[#d2e3ff]"
                        : "border-[#c6d7f1] bg-[#eef4ff] text-[#214b89]"
                    }`}
                  >
                    <p>
                      {ui.monthlyIncomeComputed}: <span className="font-semibold">{formatAmount(monthlyGrossIncome)}</span>
                    </p>
                    <p>
                      {ui.debtWithoutNew}: <span className="font-semibold">{formatRate(debtRatioPreview)}</span>
                    </p>
                  </div>

                  <div className={`mt-5 flex items-center justify-between ${isRTL ? "flex-row-reverse" : ""}`}>
                    <button
                      type="button"
                      onClick={() => setLoanStepPage(1)}
                      className={pagerButtonClass(isDark)}
                    >
                      {ui.previous}
                    </button>
                    <button
                      type="button"
                      onClick={() => setLoanStepPage(3)}
                      className={pagerButtonClass(isDark)}
                    >
                      {ui.next}
                    </button>
                  </div>
                </section>
                )}

                {loanStepPage === 3 && (
                hasLoanSimulationTriggered ? (
                  <section className={`${sectionCardClass(isDark, "amber")} p-5`}>
                    <div className={`mb-4 flex items-center gap-2 ${isRTL ? "flex-row-reverse" : ""}`}>
                      <span className={sectionIconClass(isDark, "amber")}>
                        <BarChart3 className="h-4 w-4" />
                      </span>
                      <h2 className="text-lg font-semibold">{ui.results}</h2>
                    </div>

                    {error && (
                      <div
                        className={`mb-4 flex items-center gap-2 rounded-xl border p-3 text-sm ${
                          isDark
                            ? "border-[#D71920]/40 bg-[#2a1318] text-[#ffd7db]"
                            : "border-[#f0c7cb] bg-[#fff2f4] text-[#a3222b]"
                        }`}
                      >
                        <AlertCircle className="h-4 w-4" />
                        {error}
                      </div>
                    )}

                    {!result && !error && (
                      <div
                        className={`rounded-xl border border-dashed p-4 text-sm ${
                          isDark
                            ? "border-[#3e6db1]/60 bg-[#10213e]/40 text-[#d2e3ff]"
                            : "border-[#c6d7f1] bg-[#eef4ff] text-[#214b89]"
                        }`}
                      >
                        <p className="font-medium">{ui.noResultsTitle}</p>
                        <p className="mt-1">{buildNoResultLoanMessage(language, loanLabelPreview, appliedRate)}</p>
                      </div>
                    )}

                    {result && (
                      <div className="space-y-4 text-sm">
                        <div className="grid gap-3 sm:grid-cols-2">
                          <div className={miniStatCardClass(isDark, "blue")}>
                            <span className={`mb-1 inline-flex h-6 w-6 items-center justify-center rounded-md ${isDark ? "bg-[#214b89]/30 text-[#cfe1ff]" : "bg-[#214b89]/12 text-[#214b89]"}`}>
                              <Wallet className="h-3.5 w-3.5" />
                            </span>
                            <p className="text-xs opacity-75">{ui.monthlyPayment}</p>
                            <p className="text-base font-semibold">{formatAmount(result.monthly_payment)}</p>
                          </div>
                          <div className={miniStatCardClass(isDark, "emerald")}>
                            <span className={`mb-1 inline-flex h-6 w-6 items-center justify-center rounded-md ${isDark ? "bg-[#214b89]/30 text-[#cfe1ff]" : "bg-[#214b89]/12 text-[#214b89]"}`}>
                              <TrendingUp className="h-3.5 w-3.5" />
                            </span>
                            <p className="text-xs opacity-75">{ui.totalCost}</p>
                            <p className="text-base font-semibold">{formatAmount(result.total_cost)}</p>
                          </div>
                          <div className={miniStatCardClass(isDark, "indigo")}>
                            <span className={`mb-1 inline-flex h-6 w-6 items-center justify-center rounded-md ${isDark ? "bg-[#214b89]/30 text-[#cfe1ff]" : "bg-[#214b89]/12 text-[#214b89]"}`}>
                              <BadgePercent className="h-3.5 w-3.5" />
                            </span>
                            <p className="text-xs opacity-75">{ui.totalInterest}</p>
                            <p className="text-base font-semibold">{formatAmount(result.total_interest)}</p>
                          </div>
                          <div className={miniStatCardClass(isDark, "rose")}>
                            <span className={`mb-1 inline-flex h-6 w-6 items-center justify-center rounded-md ${isDark ? "bg-[#D71920]/30 text-[#ffd7db]" : "bg-[#D71920]/12 text-[#a3222b]"}`}>
                              <Calculator className="h-3.5 w-3.5" />
                            </span>
                            <p className="text-xs opacity-75">{ui.duration}</p>
                            <p className="text-base font-semibold">{result.duration_months} {ui.months}</p>
                          </div>
                        </div>

                        <div className={`rounded-xl border p-4 ${isDark ? "border-[#3e6db1]/60 bg-[#10213e]/35" : "border-[#c6d7f1] bg-[#f4f8ff]"}`}>
                          <div className="mb-2 flex items-center justify-between gap-2">
                            <p className="font-medium">{ui.debtRatioEstimated}</p>
                            <span className={`rounded-full px-2 py-0.5 text-xs font-semibold ${debtStatus.chipClass}`}>
                              {debtStatus.title}
                            </span>
                          </div>
                          <p className="text-lg font-semibold">{formatRate(result.simulation_meta?.debtRatio)}</p>
                          <div className={`mt-2 h-2 overflow-hidden rounded-full ${isDark ? "bg-gray-700" : "bg-gray-200"}`}>
                            <div
                              className={`h-full rounded-full ${debtStatus.barClass}`}
                              style={{ width: `${Math.min(100, Math.max(0, debtRatioResult))}%` }}
                            />
                          </div>
                          <p className={`mt-2 text-xs ${isDark ? "text-[#bdd5ff]" : "text-[#48648f]"}`}>
                            {debtStatus.message}
                          </p>
                        </div>

                        <div className={`rounded-xl border p-4 ${isDark ? "border-[#3e6db1]/60 bg-[#10213e]/35" : "border-[#c6d7f1] bg-[#f4f8ff]"}`}>
                          <p>
                            {ui.monthlyGrossIncome}: <span className="font-semibold">{formatAmount(result.simulation_meta?.monthlyGrossIncome)}</span>
                          </p>
                          <p>
                            {ui.otherInstallments}: <span className="font-semibold">{formatAmount(result.simulation_meta?.otherMonthlyLoans)}</span>
                          </p>
                          <p>
                            {ui.financedAmount}: <span className="font-semibold">{formatAmount(result.simulation_meta?.financedAmount)}</span>
                          </p>
                          <p>
                            {ui.retainedType}: <span className="font-semibold">{resultLoanLabel || "-"}</span>
                          </p>
                        </div>
                      </div>
                    )}

                    <div className={`mt-5 flex ${isRTL ? "justify-start" : "justify-end"}`}>
                      <button
                        type="button"
                        onClick={() => setHasLoanSimulationTriggered(false)}
                        className={pagerButtonClass(isDark)}
                      >
                        {ui.editFinance}
                      </button>
                    </div>
                  </section>
                ) : (
                  <section className={`${sectionCardClass(isDark, "indigo")} p-5`}>
                    <div className={`mb-4 flex items-center gap-2 ${isRTL ? "flex-row-reverse" : ""}`}>
                      <span className={sectionIconClass(isDark, "indigo")}>
                        <Wallet className="h-4 w-4" />
                      </span>
                      <h2 className="text-lg font-semibold">{ui.stepFinance}</h2>
                    </div>

                    <div className="grid gap-4 md:grid-cols-2">
                      <label className="block text-sm md:col-span-2">
                        <span className="mb-1 block">{ui.requestedAmount}</span>
                        <input
                          type="number"
                          value={loanAmount}
                          onChange={(event) => setLoanAmount(event.target.value)}
                          className={inputClass(isDark, isRTL)}
                        />
                      </label>

                      <div className="md:col-span-2 flex flex-wrap gap-2">
                        {[1000, 5000, 10000, 20000, 50000, 100000].map((preset) => (
                          <button
                            key={preset}
                            type="button"
                            onClick={() => setLoanAmount(preset)}
                            className={quickButtonClass(isDark, Number(loanAmount) === preset)}
                          >
                            {formatAmount(preset)}
                          </button>
                        ))}
                      </div>

                      {supportsDownPayment && (
                        <label className="block text-sm md:col-span-2">
                          <span className="mb-1 block">{ui.downPayment}</span>
                          <input
                            type="number"
                            value={downPayment}
                            onChange={(event) => setDownPayment(event.target.value)}
                            className={inputClass(isDark, isRTL)}
                          />
                        </label>
                      )}

                      <label className="block text-sm md:col-span-2">
                        <span className="mb-1 block">{ui.durationMonths}</span>
                        <input
                          type="number"
                          min={1}
                          max={360}
                          value={durationMonths}
                          onChange={(event) => setDurationMonths(event.target.value)}
                          className={inputClass(isDark, isRTL)}
                        />
                      </label>

                      <div className="md:col-span-2">
                        <input
                          type="range"
                          min={1}
                          max={360}
                          value={Math.min(360, Math.max(1, Number(durationMonths) || 1))}
                          onChange={(event) => setDurationMonths(event.target.value)}
                          className="w-full accent-[#0A2240]"
                        />
                      </div>

                      <div className="md:col-span-2 flex flex-wrap gap-2">
                        {[12, 24, 36, 60, 84, 120, 180, 240].map((preset) => (
                          <button
                            key={preset}
                            type="button"
                            onClick={() => setDurationMonths(preset)}
                            className={quickButtonClass(isDark, Number(durationMonths) === preset)}
                          >
                            {preset} {ui.months}
                          </button>
                        ))}
                      </div>
                    </div>

                    <div
                      className={`mt-4 rounded-xl border p-3 text-sm ${
                        isDark
                          ? "border-[#3e6db1]/70 bg-[#10213e] text-[#d2e3ff]"
                          : "border-[#c6d7f1] bg-[#eef4ff] text-[#214b89]"
                      }`}
                    >
                      <p>
                        {ui.financedEstimated}: <span className="font-semibold">{formatAmount(financedAmountPreview)}</span>
                      </p>
                      <p>
                        {ui.selectedProduct}:{" "}
                        <span className="inline-flex items-center gap-1.5 font-semibold">
                          <SelectedLoanIcon className="h-4 w-4" />
                          {loanLabelPreview}
                        </span>
                      </p>
                    </div>

                    <div className={`mt-5 flex items-center justify-between ${isRTL ? "flex-row-reverse" : ""}`}>
                      <button
                        type="button"
                        onClick={() => setLoanStepPage(2)}
                        className={pagerButtonClass(isDark)}
                      >
                        {ui.previous}
                      </button>
                      <button
                        type="button"
                        onClick={() => setLoanStepPage((current) => Math.min(3, current + 1))}
                        disabled
                        className={pagerButtonClass(isDark)}
                      >
                        {ui.next}
                      </button>
                    </div>

                    <button
                      type="button"
                      onClick={runSimulation}
                      disabled={loading}
                      className="mt-4 w-full rounded-xl bg-[#0A2240] px-4 py-3 text-sm font-semibold text-white transition hover:bg-[#123662] disabled:opacity-60"
                    >
                      {loading ? ui.loading : ui.runLoan}
                    </button>
                  </section>
                )
                )}
              </>
            ) : (
              <section className={`${sectionCardClass(isDark, "blue")} p-5`}>
                <div className={`mb-4 flex items-center gap-2 ${isRTL ? "flex-row-reverse" : ""}`}>
                  <span className={sectionIconClass(isDark, "blue")}>
                    <PiggyBank className="h-4 w-4" />
                  </span>
                  <h2 className="text-lg font-semibold">{ui.savingsProjection}</h2>
                </div>

                <div className="grid gap-4 md:grid-cols-2">
                  <label className="block text-sm md:col-span-2">
                    <span className="mb-1 block">{ui.initialAmount} (TND)</span>
                    <input
                      type="number"
                      value={savingsAmount}
                      onChange={(event) => setSavingsAmount(event.target.value)}
                      className={inputClass(isDark, isRTL)}
                    />
                  </label>

                  <label className="block text-sm">
                    <span className="mb-1 block">{ui.annualRate} (%)</span>
                    <input
                      type="number"
                      value={savingsAnnualRate}
                      onChange={(event) => setSavingsAnnualRate(event.target.value)}
                      className={inputClass(isDark, isRTL)}
                    />
                  </label>

                  <label className="block text-sm">
                    <span className="mb-1 block">{ui.monthlyDeposit} (TND)</span>
                    <input
                      type="number"
                      value={monthlyDeposit}
                      onChange={(event) => setMonthlyDeposit(event.target.value)}
                      className={inputClass(isDark, isRTL)}
                    />
                  </label>

                  <label className="block text-sm md:col-span-2">
                    <span className="mb-1 block">{ui.durationYears}</span>
                    <input
                      type="number"
                      value={years}
                      onChange={(event) => setYears(event.target.value)}
                      className={inputClass(isDark, isRTL)}
                    />
                  </label>
                </div>

                <button
                  type="button"
                  onClick={runSimulation}
                  disabled={loading}
                  className="mt-4 w-full rounded-xl bg-[#0A2240] px-4 py-3 text-sm font-semibold text-white transition hover:bg-[#123662] disabled:opacity-60"
                >
                  {loading ? ui.loading : ui.runSavings}
                </button>
              </section>
            )}
          </div>

          {mode === "savings" && (
          <section className={`${sectionCardClass(isDark, "amber")} p-5`}>
              <div className={`mb-4 flex items-center gap-2 ${isRTL ? "flex-row-reverse" : ""}`}>
                <span className={sectionIconClass(isDark, "amber")}>
                  <BarChart3 className="h-4 w-4" />
                </span>
                <h2 className="text-lg font-semibold">{ui.results}</h2>
              </div>

              {error && (
                <div
                  className={`mb-4 flex items-center gap-2 rounded-xl border p-3 text-sm ${
                    isDark
                      ? "border-[#D71920]/40 bg-[#2a1318] text-[#ffd7db]"
                      : "border-[#f0c7cb] bg-[#fff2f4] text-[#a3222b]"
                  }`}
                >
                  <AlertCircle className="h-4 w-4" />
                  {error}
                </div>
              )}

              {!result && !error && (
                <div
                  className={`rounded-xl border border-dashed p-4 text-sm ${
                    isDark
                      ? "border-[#3e6db1]/60 bg-[#10213e]/40 text-[#d2e3ff]"
                      : "border-[#c6d7f1] bg-[#eef4ff] text-[#214b89]"
                  }`}
                >
                  <p className="font-medium">{ui.noResultsTitle}</p>
                  <p className="mt-1">{ui.noResultsSavings}</p>
                </div>
              )}

              {result && mode === "loan" && (
                <div className="space-y-4 text-sm">
                  <div className="grid gap-3 sm:grid-cols-2">
                    <div className={miniStatCardClass(isDark, "blue")}>
                      <span className={`mb-1 inline-flex h-6 w-6 items-center justify-center rounded-md ${isDark ? "bg-[#214b89]/30 text-[#cfe1ff]" : "bg-[#214b89]/12 text-[#214b89]"}`}>
                        <Wallet className="h-3.5 w-3.5" />
                      </span>
                      <p className="text-xs opacity-75">{ui.monthlyPayment}</p>
                      <p className="text-base font-semibold">{formatAmount(result.monthly_payment)}</p>
                    </div>
                    <div className={miniStatCardClass(isDark, "emerald")}>
                      <span className={`mb-1 inline-flex h-6 w-6 items-center justify-center rounded-md ${isDark ? "bg-[#214b89]/30 text-[#cfe1ff]" : "bg-[#214b89]/12 text-[#214b89]"}`}>
                        <TrendingUp className="h-3.5 w-3.5" />
                      </span>
                      <p className="text-xs opacity-75">{ui.totalCost}</p>
                      <p className="text-base font-semibold">{formatAmount(result.total_cost)}</p>
                    </div>
                    <div className={miniStatCardClass(isDark, "indigo")}>
                      <span className={`mb-1 inline-flex h-6 w-6 items-center justify-center rounded-md ${isDark ? "bg-[#214b89]/30 text-[#cfe1ff]" : "bg-[#214b89]/12 text-[#214b89]"}`}>
                        <BadgePercent className="h-3.5 w-3.5" />
                      </span>
                      <p className="text-xs opacity-75">{ui.totalInterest}</p>
                      <p className="text-base font-semibold">{formatAmount(result.total_interest)}</p>
                    </div>
                    <div className={miniStatCardClass(isDark, "rose")}>
                      <span className={`mb-1 inline-flex h-6 w-6 items-center justify-center rounded-md ${isDark ? "bg-[#D71920]/30 text-[#ffd7db]" : "bg-[#D71920]/12 text-[#a3222b]"}`}>
                        <Calculator className="h-3.5 w-3.5" />
                      </span>
                      <p className="text-xs opacity-75">{ui.duration}</p>
                      <p className="text-base font-semibold">{result.duration_months} {ui.months}</p>
                    </div>
                  </div>

                  <div className={`rounded-xl border p-4 ${isDark ? "border-[#3e6db1]/60 bg-[#10213e]/35" : "border-[#c6d7f1] bg-[#f4f8ff]"}`}>
                    <div className="mb-2 flex items-center justify-between gap-2">
                      <p className="font-medium">{ui.debtRatioEstimated}</p>
                      <span className={`rounded-full px-2 py-0.5 text-xs font-semibold ${debtStatus.chipClass}`}>
                        {debtStatus.title}
                      </span>
                    </div>
                    <p className="text-lg font-semibold">{formatRate(result.simulation_meta?.debtRatio)}</p>
                    <div className={`mt-2 h-2 overflow-hidden rounded-full ${isDark ? "bg-gray-700" : "bg-gray-200"}`}>
                      <div
                        className={`h-full rounded-full ${debtStatus.barClass}`}
                        style={{ width: `${Math.min(100, Math.max(0, debtRatioResult))}%` }}
                      />
                    </div>
                    <p className={`mt-2 text-xs ${isDark ? "text-[#bdd5ff]" : "text-[#48648f]"}`}>
                      {debtStatus.message}
                    </p>
                  </div>

                  <div className={`rounded-xl border p-4 ${isDark ? "border-[#3e6db1]/60 bg-[#10213e]/35" : "border-[#c6d7f1] bg-[#f4f8ff]"}`}>
                    <p>
                      {ui.monthlyGrossIncome}: <span className="font-semibold">{formatAmount(result.simulation_meta?.monthlyGrossIncome)}</span>
                    </p>
                    <p>
                      {ui.otherInstallments}: <span className="font-semibold">{formatAmount(result.simulation_meta?.otherMonthlyLoans)}</span>
                    </p>
                    <p>
                      {ui.financedAmount}: <span className="font-semibold">{formatAmount(result.simulation_meta?.financedAmount)}</span>
                    </p>
                    <p>
                      {ui.retainedType}: <span className="font-semibold">{resultLoanLabel || "-"}</span>
                    </p>
                  </div>
                </div>
              )}

              {result && mode === "savings" && (
                <div className="space-y-3 text-sm">
                  <div className={miniStatCardClass(isDark, "blue")}>
                    <p className="text-xs opacity-75">{ui.finalBalance}</p>
                    <p className="text-base font-semibold">{formatAmount(result.final_balance)}</p>
                  </div>
                  <div className={miniStatCardClass(isDark, "emerald")}>
                    <p className="text-xs opacity-75">{ui.totalDeposited}</p>
                    <p className="text-base font-semibold">{formatAmount(result.total_deposited)}</p>
                  </div>
                  <div className={miniStatCardClass(isDark, "indigo")}>
                    <p className="text-xs opacity-75">{ui.generatedInterest}</p>
                    <p className="text-base font-semibold">{formatAmount(result.total_interest)}</p>
                  </div>
                  <div className={miniStatCardClass(isDark, "rose")}>
                    <p className="text-xs opacity-75">{ui.projectionPoints}</p>
                    <p className="text-base font-semibold">
                      {Array.isArray(result.projections) ? result.projections.length : 0}
                    </p>
                  </div>
                </div>
              )}
          </section>
          )}
        </div>
      </div>
    </div>
  );
}
