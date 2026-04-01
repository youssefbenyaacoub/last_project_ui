import { useMemo, useState } from "react";
import {
  AlertCircle,
  BadgePercent,
  Calculator,
  Clock3,
  PiggyBank,
  ShieldCheck,
  TrendingUp,
  Wallet,
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
    labels: {
      en: "Consumer Loan",
      fr: "Credit Consommation",
      ar: "قرض استهلاكي",
    },
  },
  {
    value: "amenagement",
    labels: {
      en: "Renovation Loan",
      fr: "Credit Amenagement",
      ar: "قرض تهيئة",
    },
  },
  {
    value: "auto",
    labels: {
      en: "Auto Loan",
      fr: "Credit Auto",
      ar: "قرض سيارة",
    },
  },
  {
    value: "habitat",
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

const RATE_RECAP = [
  {
    value: "consommation",
    rate: 11.99,
    labels: {
      en: "Consumer Loan",
      fr: "Credit Consommation",
      ar: "قرض استهلاكي",
    },
  },
  {
    value: "amenagement",
    rate: 10.74,
    labels: {
      en: "Renovation Loan",
      fr: "Credit Amenagement",
      ar: "قرض تهيئة",
    },
  },
  {
    value: "auto-neuve-gt4",
    rate: 10.49,
    labels: {
      en: "Auto Loan New (>4 hp)",
      fr: "Credit Auto Neuve (>4 cv)",
      ar: "قرض سيارة جديدة (أكثر من 4 خيول)",
    },
  },
  {
    value: "auto-occasion-lte4",
    rate: 10.74,
    labels: {
      en: "Auto Loan Used (<=4 hp)",
      fr: "Credit Auto Occasion (<=4 cv)",
      ar: "قرض سيارة مستعملة (4 خيول او اقل)",
    },
  },
  {
    value: "auto-occasion-gt4",
    rate: 10.74,
    labels: {
      en: "Auto Loan Used (>4 hp)",
      fr: "Credit Auto Occasion (>4 cv)",
      ar: "قرض سيارة مستعملة (أكثر من 4 خيول)",
    },
  },
  {
    value: "habitat",
    rate: 10.24,
    labels: {
      en: "Housing Loan",
      fr: "Credit Habitat",
      ar: "قرض السكن",
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

const SECTION_TONES = {
  neutral: {
    dark: "border-gray-700 bg-gray-800/80",
    light: "border-gray-200 bg-white",
  },
  blue: {
    dark: "border-blue-800/70 bg-gradient-to-br from-blue-950/35 via-gray-900 to-gray-800/80",
    light: "border-blue-200 bg-gradient-to-br from-blue-50 via-white to-white",
  },
  emerald: {
    dark: "border-emerald-800/70 bg-gradient-to-br from-emerald-950/30 via-gray-900 to-gray-800/80",
    light: "border-emerald-200 bg-gradient-to-br from-emerald-50 via-white to-white",
  },
  indigo: {
    dark: "border-indigo-800/70 bg-gradient-to-br from-indigo-950/30 via-gray-900 to-gray-800/80",
    light: "border-indigo-200 bg-gradient-to-br from-indigo-50 via-white to-white",
  },
  amber: {
    dark: "border-amber-800/70 bg-gradient-to-br from-amber-950/20 via-gray-900 to-gray-800/80",
    light: "border-amber-200 bg-gradient-to-br from-amber-50 via-white to-white",
  },
  rose: {
    dark: "border-rose-800/70 bg-gradient-to-br from-rose-950/25 via-gray-900 to-gray-800/80",
    light: "border-rose-200 bg-gradient-to-br from-rose-50 via-white to-white",
  },
};

const ICON_TONES = {
  blue: {
    dark: "bg-blue-900/40 text-blue-200",
    light: "bg-blue-100 text-blue-700",
  },
  emerald: {
    dark: "bg-emerald-900/35 text-emerald-200",
    light: "bg-emerald-100 text-emerald-700",
  },
  indigo: {
    dark: "bg-indigo-900/35 text-indigo-200",
    light: "bg-indigo-100 text-indigo-700",
  },
  amber: {
    dark: "bg-amber-900/35 text-amber-200",
    light: "bg-amber-100 text-amber-700",
  },
  rose: {
    dark: "bg-rose-900/35 text-rose-200",
    light: "bg-rose-100 text-rose-700",
  },
};

const sectionCardClass = (isDark, tone = "neutral") => {
  const resolvedTone = SECTION_TONES[tone] || SECTION_TONES.neutral;
  return `rounded-2xl border ${isDark ? resolvedTone.dark : resolvedTone.light}`;
};

const sectionIconClass = (isDark, tone = "blue") => {
  const resolvedTone = ICON_TONES[tone] || ICON_TONES.blue;
  return `inline-flex h-9 w-9 items-center justify-center rounded-xl ${
    isDark ? resolvedTone.dark : resolvedTone.light
  }`;
};

const miniStatCardClass = (isDark, tone = "blue") => {
  const map = {
    blue: isDark
      ? "border border-blue-800/60 bg-blue-950/25"
      : "border border-blue-200 bg-blue-50",
    emerald: isDark
      ? "border border-emerald-800/60 bg-emerald-950/20"
      : "border border-emerald-200 bg-emerald-50",
    indigo: isDark
      ? "border border-indigo-800/60 bg-indigo-950/20"
      : "border border-indigo-200 bg-indigo-50",
    rose: isDark
      ? "border border-rose-800/60 bg-rose-950/20"
      : "border border-rose-200 bg-rose-50",
  };

  return `rounded-xl p-3 ${map[tone] || map.blue}`;
};

const inputClass = (isDark, isRTL) =>
  `w-full rounded-xl border px-3 py-2.5 text-sm transition focus:outline-none focus:ring-2 focus:ring-[#0A2240]/25 ${
    isDark
      ? "border-gray-600 bg-gray-800 text-white placeholder:text-gray-400"
      : "border-gray-300 bg-white text-gray-900 placeholder:text-gray-500"
  } ${isRTL ? "text-right" : "text-left"}`;

const quickButtonClass = (isDark, active) =>
  `rounded-lg border px-2.5 py-1 text-xs transition ${
    active
      ? "border-[#0A2240] bg-[#0A2240] text-white"
      : isDark
        ? "border-gray-600 bg-gray-800 text-gray-300 hover:border-gray-500"
        : "border-gray-300 bg-white text-gray-700 hover:border-gray-400"
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
      chipClass: "bg-emerald-100 text-emerald-700",
      barClass: "bg-emerald-500",
    };
  }

  if (ratio <= 50) {
    return {
      title: ui.debtWatchTitle,
      message: ui.debtWatchMsg,
      chipClass: "bg-amber-100 text-amber-800",
      barClass: "bg-amber-500",
    };
  }

  return {
    title: ui.debtHighTitle,
    message: ui.debtHighMsg,
    chipClass: "bg-red-100 text-red-700",
    barClass: "bg-red-500",
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

  const debtRatioResult = toNumber(result?.simulation_meta?.debtRatio);
  const debtStatus = getDebtRatioStatus(debtRatioResult, ui);

  const switchMode = (nextMode) => {
    setMode(nextMode);
    setError("");
    setResult(null);
  };

  const setLoanTypeWithPreset = (nextType) => {
    setLoanType(nextType);
    setError("");
    setResult(null);

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
        isDark ? "bg-gray-900 text-white" : "bg-gray-50 text-gray-900"
      } ${isRTL ? "text-right" : "text-left"}`}
    >
      <div className="mx-auto max-w-7xl space-y-6">
        <section className={`${sectionCardClass(isDark, "neutral")} p-5 lg:p-6`}>
          <div className="flex flex-wrap items-start justify-between gap-4">
            <div>
              <h1 className="text-2xl font-semibold lg:text-3xl">{ui.title}</h1>
              <p className={isDark ? "mt-1 text-gray-300" : "mt-1 text-gray-600"}>{ui.subtitle}</p>
            </div>

            <div className="grid grid-cols-2 gap-2 text-xs sm:text-sm">
              <div
                className={`rounded-xl border px-3 py-2 ${
                  isDark
                    ? "border-blue-800/70 bg-blue-950/25 text-blue-100"
                    : "border-blue-200 bg-blue-50 text-blue-900"
                }`}
              >
                <p className="text-[11px] uppercase tracking-wide opacity-80">{ui.tmmLabel}</p>
                <p className="font-semibold">{formatRate(TMM_REFERENCE)}</p>
              </div>
              <div
                className={`rounded-xl border px-3 py-2 ${
                  isDark
                    ? "border-indigo-800/70 bg-indigo-950/30 text-indigo-100"
                    : "border-indigo-200 bg-indigo-50 text-indigo-900"
                }`}
              >
                <p className="text-[11px] uppercase tracking-wide opacity-80">{ui.activeRateLabel}</p>
                <p className="font-semibold">{formatRate(appliedRate)}</p>
              </div>
            </div>
          </div>

          <div className={`mt-4 inline-flex rounded-xl p-1 ${isDark ? "bg-gray-900" : "bg-gray-100"}`}>
            <button
              type="button"
              onClick={() => switchMode("loan")}
              className={`inline-flex items-center gap-2 rounded-lg px-4 py-2 text-sm font-medium transition ${
                mode === "loan"
                  ? "bg-[#0A2240] text-white"
                  : isDark
                    ? "text-gray-300 hover:bg-gray-800"
                    : "text-gray-700 hover:bg-white"
              } ${isRTL ? "flex-row-reverse" : ""}`}
            >
              <TrendingUp className="h-4 w-4" />
              {ui.creditMode}
            </button>
            <button
              type="button"
              onClick={() => switchMode("savings")}
              className={`inline-flex items-center gap-2 rounded-lg px-4 py-2 text-sm font-medium transition ${
                mode === "savings"
                  ? "bg-[#0A2240] text-white"
                  : isDark
                    ? "text-gray-300 hover:bg-gray-800"
                    : "text-gray-700 hover:bg-white"
              } ${isRTL ? "flex-row-reverse" : ""}`}
            >
              <PiggyBank className="h-4 w-4" />
              {ui.savingsMode}
            </button>
          </div>
        </section>

        <div className="grid gap-6 xl:grid-cols-[1.4fr,1fr]">
          <div className="space-y-4">
            {mode === "loan" ? (
              <>
                <section className={`${sectionCardClass(isDark, "blue")} p-5`}>
                  <div className={`mb-4 flex items-center gap-2 ${isRTL ? "flex-row-reverse" : ""}`}>
                    <span className={sectionIconClass(isDark, "blue")}>
                      <BadgePercent className="h-4 w-4" />
                    </span>
                    <h2 className="text-lg font-semibold">{ui.stepProduct}</h2>
                  </div>

                  <div className="grid gap-4 md:grid-cols-2">
                    <label className="block text-sm">
                      <span className="mb-1 block">{ui.loanType}</span>
                      <select
                        value={loanType}
                        onChange={(event) => setLoanTypeWithPreset(event.target.value)}
                        className={inputClass(isDark, isRTL)}
                      >
                        {LOAN_TYPE_OPTIONS.map((option) => (
                          <option key={option.value} value={option.value}>
                            {getLocalizedLabel(option.labels, language)}
                          </option>
                        ))}
                      </select>
                    </label>

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
                          ? "border-blue-700 bg-blue-950/25 text-blue-100"
                          : "border-blue-200 bg-blue-50 text-blue-900"
                      }`}
                    >
                      <p className="text-xs uppercase tracking-wide opacity-80">{ui.tmmReference}</p>
                      <p className="text-base font-semibold">{formatRate(TMM_REFERENCE)}</p>
                    </div>
                    <div
                      className={`rounded-xl border px-3 py-3 ${
                        isDark
                          ? "border-blue-700 bg-blue-950/25 text-blue-100"
                          : "border-blue-200 bg-blue-50 text-blue-900"
                      }`}
                    >
                      <p className="text-xs uppercase tracking-wide opacity-80">{ui.appliedRate}</p>
                      <p className="text-base font-semibold">{formatRate(appliedRate)}</p>
                    </div>
                  </div>
                </section>

                <section className={`${sectionCardClass(isDark, "emerald")} p-5`}>
                  <div className={`mb-4 flex items-center gap-2 ${isRTL ? "flex-row-reverse" : ""}`}>
                    <span className={sectionIconClass(isDark, "emerald")}>
                      <Wallet className="h-4 w-4" />
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
                        ? "border-gray-600 bg-gray-900/40 text-gray-300"
                        : "border-gray-200 bg-gray-50 text-gray-700"
                    }`}
                  >
                    <p>
                      {ui.monthlyIncomeComputed}: <span className="font-semibold">{formatAmount(monthlyGrossIncome)}</span>
                    </p>
                    <p>
                      {ui.debtWithoutNew}: <span className="font-semibold">{formatRate(debtRatioPreview)}</span>
                    </p>
                  </div>
                </section>

                <section className={`${sectionCardClass(isDark, "indigo")} p-5`}>
                  <div className={`mb-4 flex items-center gap-2 ${isRTL ? "flex-row-reverse" : ""}`}>
                    <span className={sectionIconClass(isDark, "indigo")}>
                      <Calculator className="h-4 w-4" />
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
                        ? "border-blue-700 bg-blue-950/20 text-blue-100"
                        : "border-blue-200 bg-blue-50 text-blue-900"
                    }`}
                  >
                    <p>
                      {ui.financedEstimated}: <span className="font-semibold">{formatAmount(financedAmountPreview)}</span>
                    </p>
                    <p>
                      {ui.selectedProduct}: <span className="font-semibold">{loanLabelPreview}</span>
                    </p>
                  </div>

                  <button
                    type="button"
                    onClick={runSimulation}
                    disabled={loading}
                    className="mt-4 w-full rounded-xl bg-[#0A2240] px-4 py-3 text-sm font-semibold text-white transition hover:bg-[#12305b] disabled:opacity-60"
                  >
                    {loading ? ui.loading : ui.runLoan}
                  </button>
                </section>
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
                  className="mt-4 w-full rounded-xl bg-[#0A2240] px-4 py-3 text-sm font-semibold text-white transition hover:bg-[#12305b] disabled:opacity-60"
                >
                  {loading ? ui.loading : ui.runSavings}
                </button>
              </section>
            )}
          </div>

          <aside className="space-y-4 self-start xl:sticky xl:top-6">
            <section className={`${sectionCardClass(isDark, "amber")} p-5`}>
              <div className={`mb-4 flex items-center gap-2 ${isRTL ? "flex-row-reverse" : ""}`}>
                <span className={sectionIconClass(isDark, "amber")}>
                  <ShieldCheck className="h-4 w-4" />
                </span>
                <h2 className="text-lg font-semibold">{ui.results}</h2>
              </div>

              {error && (
                <div
                  className={`mb-4 flex items-center gap-2 rounded-xl border p-3 text-sm ${
                    isDark
                      ? "border-red-800 bg-red-950/30 text-red-300"
                      : "border-red-200 bg-red-50 text-red-700"
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
                      ? "border-amber-700/60 bg-amber-950/15 text-amber-100"
                      : "border-amber-200 bg-amber-50 text-amber-800"
                  }`}
                >
                  <p className="font-medium">{ui.noResultsTitle}</p>
                  {mode === "loan" ? (
                    <p className="mt-1">{buildNoResultLoanMessage(language, loanLabelPreview, appliedRate)}</p>
                  ) : (
                    <p className="mt-1">{ui.noResultsSavings}</p>
                  )}
                </div>
              )}

              {result && mode === "loan" && (
                <div className="space-y-4 text-sm">
                  <div className="grid gap-3 sm:grid-cols-2">
                    <div className={miniStatCardClass(isDark, "blue")}>
                      <p className="text-xs opacity-75">{ui.monthlyPayment}</p>
                      <p className="text-base font-semibold">{formatAmount(result.monthly_payment)}</p>
                    </div>
                    <div className={miniStatCardClass(isDark, "emerald")}>
                      <p className="text-xs opacity-75">{ui.totalCost}</p>
                      <p className="text-base font-semibold">{formatAmount(result.total_cost)}</p>
                    </div>
                    <div className={miniStatCardClass(isDark, "indigo")}>
                      <p className="text-xs opacity-75">{ui.totalInterest}</p>
                      <p className="text-base font-semibold">{formatAmount(result.total_interest)}</p>
                    </div>
                    <div className={miniStatCardClass(isDark, "rose")}>
                      <p className="text-xs opacity-75">{ui.duration}</p>
                      <p className="text-base font-semibold">{result.duration_months} {ui.months}</p>
                    </div>
                  </div>

                  <div className={`rounded-xl border p-4 ${isDark ? "border-gray-600 bg-gray-900/40" : "border-gray-200 bg-gray-50"}`}>
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
                    <p className={`mt-2 text-xs ${isDark ? "text-gray-400" : "text-gray-600"}`}>
                      {debtStatus.message}
                    </p>
                  </div>

                  <div className={`rounded-xl border p-4 ${isDark ? "border-gray-600 bg-gray-900/40" : "border-gray-200 bg-gray-50"}`}>
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

            {mode === "loan" && (
              <section className={`${sectionCardClass(isDark, "rose")} p-5`}>
                <div className={`mb-4 flex items-center gap-2 ${isRTL ? "flex-row-reverse" : ""}`}>
                  <span className={sectionIconClass(isDark, "rose")}>
                    <Clock3 className="h-4 w-4" />
                  </span>
                  <h2 className="text-lg font-semibold">{ui.rateRecap}</h2>
                </div>

                <div className="space-y-2 text-sm">
                  {RATE_RECAP.map((item) => {
                    const active = mode === "loan" && item.rate === appliedRate;
                    return (
                      <div
                        key={item.value}
                        className={`flex items-center justify-between gap-2 rounded-lg border px-3 py-2 ${
                          active
                            ? "border-[#0A2240] bg-[#0A2240] text-white"
                            : isDark
                              ? "border-gray-600 bg-gray-900 text-gray-300"
                              : "border-gray-200 bg-gray-50 text-gray-700"
                        }`}
                      >
                        <span>{getLocalizedLabel(item.labels, language)}</span>
                        <span className="font-semibold">{formatRate(item.rate)}</span>
                      </div>
                    );
                  })}
                </div>
              </section>
            )}
          </aside>
        </div>
      </div>
    </div>
  );
}
