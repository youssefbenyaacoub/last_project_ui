import { useEffect, useState } from "react";
import {
  Search,
  Star,
  Sparkles,
  X,
  TrendingUp,
  CreditCard,
  PiggyBank,
  Shield,
  Wallet,
  Building2,
  Users,
} from "lucide-react";
import { useTheme } from "../contexts/ThemeContext";
import { useLanguage } from "../contexts/LanguageContext";

const uiByLanguage = {
  en: {
    title: "Banking Products",
    subtitle: "Simplified catalog with quick filters and clear comparison",
    searchPlaceholder: "Search a product...",
    recommended: "Recommended",
    products: "products",
    noProducts: "No products found",
    forYou: "For you",
    showDetails: "Show details",
    showMore: "Show more",
    product: "Product",
    productDetails: "Product details",
    close: "Close",
    benefits: "Benefits",
    moreBenefits: "more benefits",
    whyForYou: "Why this product is for you",
    defaultReason: "This product matches your current profile.",
    primaryStrength: "Primary strength",
    pricingLevel: "Pricing level adapted",
  },
  fr: {
    title: "Produits Bancaires",
    subtitle: "Catalogue simplifie, filtres rapides et comparaison claire",
    searchPlaceholder: "Rechercher un produit...",
    recommended: "Recommandes",
    products: "produits",
    noProducts: "Aucun produit trouve",
    forYou: "Pour vous",
    showDetails: "Voir details",
    showMore: "Voir plus",
    product: "Produit",
    productDetails: "Details produit",
    close: "Fermer",
    benefits: "Avantages",
    moreBenefits: "autres avantages",
    whyForYou: "Pourquoi ce produit est pour vous",
    defaultReason: "Ce produit correspond a votre profil actuel.",
    primaryStrength: "Atout principal",
    pricingLevel: "Niveau tarifaire adapte",
  },
  ar: {
    title: "المنتجات البنكية",
    subtitle: "كتالوج مبسط مع فلاتر سريعة ومقارنة واضحة",
    searchPlaceholder: "ابحث عن منتج...",
    recommended: "موصى بها",
    products: "منتج",
    noProducts: "لم يتم العثور على منتجات",
    forYou: "مناسب لك",
    showDetails: "عرض التفاصيل",
    showMore: "عرض المزيد",
    product: "منتج",
    productDetails: "تفاصيل المنتج",
    close: "اغلاق",
    benefits: "المزايا",
    moreBenefits: "مزايا اخرى",
    whyForYou: "لماذا هذا المنتج مناسب لك",
    defaultReason: "هذا المنتج يتناسب مع ملفك الحالي.",
    primaryStrength: "الميزة الرئيسية",
    pricingLevel: "مستوى السعر المناسب",
  },
};

const productCategories = [
  { id: "all", name: { fr: "Tous", en: "All", ar: "الكل" }, count: 38 },
  {
    id: "accounts",
    name: { fr: "Comptes", en: "Accounts", ar: "الحسابات" },
    count: 6,
    icon: Wallet,
  },
  {
    id: "cards",
    name: { fr: "Cartes", en: "Cards", ar: "البطاقات" },
    count: 5,
    icon: CreditCard,
  },
  {
    id: "credits",
    name: { fr: "Credits", en: "Loans", ar: "القروض" },
    count: 8,
    icon: TrendingUp,
  },
  {
    id: "savings",
    name: { fr: "Epargne", en: "Savings", ar: "الادخار" },
    count: 7,
    icon: PiggyBank,
  },
  {
    id: "insurance",
    name: { fr: "Assurances", en: "Insurance", ar: "التامين" },
    count: 5,
    icon: Shield,
  },
  {
    id: "investments",
    name: { fr: "Placements", en: "Investments", ar: "الاستثمارات" },
    count: 4,
    icon: Building2,
  },
  {
    id: "services",
    name: { fr: "Services", en: "Services", ar: "الخدمات" },
    count: 3,
    icon: Users,
  },
];

const categoryMetaById = productCategories.reduce((acc, category) => {
  acc[category.id] = category;
  return acc;
}, {});

const categoryVisuals = {
  accounts: {
    image:
      "https://images.unsplash.com/photo-1554224155-6726b3ff858f?auto=format&fit=crop&w=1200&q=80",
    overlay: "from-sky-700/65 to-indigo-950/75",
  },
  cards: {
    image:
      "https://images.unsplash.com/photo-1556742502-ec7c0e9f34b1?auto=format&fit=crop&w=1200&q=80",
    overlay: "from-violet-700/65 to-purple-950/75",
  },
  credits: {
    image:
      "https://images.unsplash.com/photo-1554224154-26032fced8bd?auto=format&fit=crop&w=1200&q=80",
    overlay: "from-cyan-700/65 to-blue-950/75",
  },
  savings: {
    image:
      "https://images.unsplash.com/photo-1579621970795-87facc2f976d?auto=format&fit=crop&w=1200&q=80",
    overlay: "from-emerald-700/65 to-teal-950/75",
  },
  insurance: {
    image:
      "https://images.unsplash.com/photo-1450101499163-c8848c66ca85?auto=format&fit=crop&w=1200&q=80",
    overlay: "from-amber-700/65 to-orange-950/75",
  },
  investments: {
    image:
      "https://images.unsplash.com/photo-1611974789855-9c2a0a7236a3?auto=format&fit=crop&w=1200&q=80",
    overlay: "from-fuchsia-700/65 to-rose-950/75",
  },
  services: {
    image:
      "https://images.unsplash.com/photo-1556740758-90de374c12ad?auto=format&fit=crop&w=1200&q=80",
    overlay: "from-indigo-700/65 to-slate-950/75",
  },
};

const personalizationReasons = {
  accounts: {
    fr: "Vous avez besoin d'un compte simple et fluide pour vos operations quotidiennes.",
    en: "You need a simple and smooth account for daily operations.",
    ar: "تحتاج إلى حساب بسيط وسلس لعملياتك اليومية.",
  },
  cards: {
    fr: "Votre profil montre un usage regulier des paiements et des avantages carte.",
    en: "Your profile shows regular payment usage and card perks interest.",
    ar: "ملفك يُظهر استخداما منتظما للمدفوعات واهتماما بمزايا البطاقات.",
  },
  credits: {
    fr: "Votre projet actuel correspond a un financement avec mensualites adaptees.",
    en: "Your current project matches financing with adapted monthly payments.",
    ar: "مشروعك الحالي يتناسب مع تمويل بأقساط شهرية مناسبة.",
  },
  savings: {
    fr: "Vos objectifs favorisent un produit d'epargne avec rendement progressif.",
    en: "Your goals favor a savings product with progressive returns.",
    ar: "اهدافك تناسب منتج ادخار بعائد تدريجي.",
  },
  insurance: {
    fr: "Votre situation suggere une meilleure couverture pour proteger vos biens.",
    en: "Your situation suggests stronger coverage to protect your assets.",
    ar: "وضعك الحالي يشير إلى حاجة لتغطية افضل لحماية ممتلكاتك.",
  },
  investments: {
    fr: "Votre profil accepte une solution de placement structuree et diversifiee.",
    en: "Your profile fits a structured and diversified investment solution.",
    ar: "ملفك يتناسب مع حل استثماري منظم ومتنوع.",
  },
  services: {
    fr: "Ce service renforce votre confort de gestion bancaire au quotidien.",
    en: "This service improves your day-to-day banking management comfort.",
    ar: "هذه الخدمة تعزز راحتك في إدارة معاملاتك البنكية اليومية.",
  },
};

const featureArByText = {
  "Sans frais mensuels": "بدون رسوم شهرية",
  "Carte bancaire gratuite": "بطاقة بنكية مجانية",
  "Conseiller dédié": "مستشار مخصص",
  "Assurances incluses": "تأمينات مشمولة",
  "Pour 18-25 ans": "للفئة 18-25 سنة",
  "Avantages étudiants": "مزايا للطلبة",
  "Pour entreprises": "مخصص للشركات",
  "Solutions de paiement": "حلول دفع",
  "Pour couples": "للأزواج",
  "Gestion partagée": "ادارة مشتركة",
  "Disponible 24/7": "متاح 24/7",
  "Rendement quotidien": "عائد يومي",
  "Paiements mondiaux": "مدفوعات عالمية",
  "Assurance voyage": "تأمين سفر",
  "Cashback 2%": "استرجاع نقدي 2%",
  Conciergerie: "خدمة كونسيرج",
  "Cashback 3%": "استرجاع نقدي 3%",
  "Lounge aéroport": "دخول صالات المطار",
  "Contrôle budget": "التحكم في الميزانية",
  "Sans découvert": "بدون سحب على المكشوف",
  "Achats en ligne": "مشتريات عبر الانترنت",
  "Sécurité renforcée": "أمان معزز",
  "Jusqu'à 50 000 TND": "حتى 50 000 TND",
  "Réponse en 48h": "رد خلال 48 ساعة",
  "Garantie État": "ضمان الدولة",
  "Taux préférentiel": "نسبة تفضيلية",
  "Financement jusqu'à 100%": "تمويل حتى 100%",
  "Durée 7 ans": "مدة 7 سنوات",
  "Jusqu'à 25 ans": "حتى 25 سنة",
  "Assurance incluse": "تأمين مشمول",
  "Différé possible": "تأجيل ممكن",
  "Taux avantageux": "نسبة مميزة",
  "Réserve disponible": "احتياطي متاح",
  "Utilisation flexible": "استخدام مرن",
  "Pour rénovations": "مخصص للترميم",
  "Montant adapté": "مبلغ مناسب",
  "Mensualité unique": "قسط شهري موحد",
  Simplification: "تبسيط",
  "Épargne logement": "ادخار سكن",
  "Prime d'État": "منحة من الدولة",
  "Taux progressif": "نسبة تصاعدية",
  Disponibilité: "سيولة متاحة",
  "Avantages fiscaux": "مزايا ضريبية",
  "Long terme": "على المدى الطويل",
  "Pour vos enfants": "لأطفالكم",
  "Versements libres": "ايداعات مرنة",
  "Sans impôts": "بدون ضرائب",
  "Plafond 22 950 TND": "سقف 22 950 TND",
  "Taux garanti": "نسبة مضمونة",
  "Durée fixe": "مدة ثابتة",
  Bourse: "بورصة",
  "Exonération fiscale": "اعفاء ضريبي",
  "Protection famille": "حماية العائلة",
  Épargne: "ادخار",
  "Tous risques": "تأمين شامل",
  Responsabilité: "مسؤولية",
  "Assistance 24/7": "مساعدة 24/7",
  Complémentaire: "تغطية مكملة",
  "Remboursement rapide": "تعويض سريع",
  "Monde entier": "جميع أنحاء العالم",
  Rapatriement: "اجلاء",
  Diversification: "تنويع",
  "Gestion pro": "ادارة احترافية",
  Sécurité: "أمان",
  "Rendement stable": "عائد مستقر",
  Liquidité: "سيولة",
  "Risque faible": "مخاطر منخفضة",
  "Pierre-papier": "عقار ورقي",
  "Revenus locatifs": "عوائد ايجارية",
  "Documents sécurisés": "وثائق مؤمنة",
  "Accessible 24/7": "متاح 24/7",
  Rapide: "سريع",
  "Taux compétitifs": "نسب تنافسية",
  "Notifications temps réel": "اشعارات لحظية",
};

const getLocalizedRate = (rate, langKey) => {
  if (langKey !== "ar") {
    return rate;
  }

  return rate
    .replace("Variable", "متغير")
    .replace("/an", "/سنة")
    .replace("/mois", "/شهر")
    .replace("/voyage", "/رحلة")
    .replace("commission", "عمولة");
};

const getLocalizedFeature = (feature, langKey) => {
  if (langKey === "ar") {
    return featureArByText[feature] || feature;
  }

  return feature;
};

const getPersonalReasons = (product, langKey) => {
  const ui = uiByLanguage[langKey] || uiByLanguage.en;
  const categoryReason =
    personalizationReasons[product.category]?.[langKey] ||
    ui.defaultReason;

  const firstFeature = getLocalizedFeature(product.features[0], langKey);

  return [
    categoryReason,
    `${ui.primaryStrength}: ${firstFeature}`,
    `${ui.pricingLevel}: ${getLocalizedRate(product.rate, langKey)}`,
  ];
};

const allProducts = [
  // Comptes
  {
    id: 1,
    category: "accounts",
    name: "Compte Courant Classique",
    nameEn: "Classic Current Account",
    rate: "0%",
    features: ["Sans frais mensuels", "Carte bancaire gratuite"],
    recommended: false,
  },
  {
    id: 2,
    category: "accounts",
    name: "Compte Premium",
    nameEn: "Premium Account",
    rate: "0%",
    features: ["Conseiller dédié", "Assurances incluses"],
    recommended: true,
  },
  {
    id: 3,
    category: "accounts",
    name: "Compte Jeune",
    nameEn: "Youth Account",
    rate: "0%",
    features: ["Pour 18-25 ans", "Avantages étudiants"],
    recommended: false,
  },
  {
    id: 4,
    category: "accounts",
    name: "Compte Professionnel",
    nameEn: "Business Account",
    rate: "0%",
    features: ["Pour entreprises", "Solutions de paiement"],
    recommended: false,
  },
  {
    id: 5,
    category: "accounts",
    name: "Compte Joint",
    nameEn: "Joint Account",
    rate: "0%",
    features: ["Pour couples", "Gestion partagée"],
    recommended: false,
  },
  {
    id: 6,
    category: "accounts",
    name: "Compte Épargne Quotidien",
    nameEn: "Daily Savings Account",
    rate: "1.5%",
    features: ["Disponible 24/7", "Rendement quotidien"],
    recommended: false,
  },

  // Cartes
  {
    id: 7,
    category: "cards",
    name: "Carte Visa Classic",
    nameEn: "Visa Classic Card",
    rate: "0 TND/an",
    features: ["Paiements mondiaux", "Assurance voyage"],
    recommended: false,
  },
  {
    id: 8,
    category: "cards",
    name: "Carte Visa Gold",
    nameEn: "Visa Gold Card",
    rate: "50 TND/an",
    features: ["Cashback 2%", "Conciergerie"],
    recommended: true,
  },
  {
    id: 9,
    category: "cards",
    name: "Carte Mastercard Platinum",
    nameEn: "Mastercard Platinum",
    rate: "80 TND/an",
    features: ["Cashback 3%", "Lounge aéroport"],
    recommended: false,
  },
  {
    id: 10,
    category: "cards",
    name: "Carte Prépayée",
    nameEn: "Prepaid Card",
    rate: "0 TND/an",
    features: ["Contrôle budget", "Sans découvert"],
    recommended: false,
  },
  {
    id: 11,
    category: "cards",
    name: "Carte Virtuelle",
    nameEn: "Virtual Card",
    rate: "0 TND/an",
    features: ["Achats en ligne", "Sécurité renforcée"],
    recommended: false,
  },

  // Crédits
  {
    id: 12,
    category: "credits",
    name: "Crédit Personnel",
    nameEn: "Personal Loan",
    rate: "5.9%",
    features: ["Jusqu'à 50 000 TND", "Réponse en 48h"],
    recommended: true,
  },
  {
    id: 13,
    category: "credits",
    name: "DHAMEN Crédit",
    nameEn: "DHAMEN Credit",
    rate: "5.5%",
    features: ["Garantie État", "Taux préférentiel"],
    recommended: true,
  },
  {
    id: 14,
    category: "credits",
    name: "Crédit Auto",
    nameEn: "Auto Loan",
    rate: "6.2%",
    features: ["Financement jusqu'à 100%", "Durée 7 ans"],
    recommended: false,
  },
  {
    id: 15,
    category: "credits",
    name: "Crédit Immobilier",
    nameEn: "Mortgage",
    rate: "4.5%",
    features: ["Jusqu'à 25 ans", "Assurance incluse"],
    recommended: false,
  },
  {
    id: 16,
    category: "credits",
    name: "Crédit Étudiant",
    nameEn: "Student Loan",
    rate: "3.9%",
    features: ["Différé possible", "Taux avantageux"],
    recommended: false,
  },
  {
    id: 17,
    category: "credits",
    name: "Crédit Renouvelable",
    nameEn: "Revolving Credit",
    rate: "7.5%",
    features: ["Réserve disponible", "Utilisation flexible"],
    recommended: false,
  },
  {
    id: 18,
    category: "credits",
    name: "Crédit Travaux",
    nameEn: "Home Improvement Loan",
    rate: "5.8%",
    features: ["Pour rénovations", "Montant adapté"],
    recommended: false,
  },
  {
    id: 19,
    category: "credits",
    name: "Rachat de Crédits",
    nameEn: "Loan Consolidation",
    rate: "6.0%",
    features: ["Mensualité unique", "Simplification"],
    recommended: false,
  },

  // Épargne
  {
    id: 20,
    category: "savings",
    name: "PEL Classique",
    nameEn: "Classic PEL",
    rate: "2.5%",
    features: ["Épargne logement", "Prime d'État"],
    recommended: true,
  },
  {
    id: 21,
    category: "savings",
    name: "Compte Épargne Premium",
    nameEn: "Premium Savings",
    rate: "3.0%",
    features: ["Taux progressif", "Disponibilité"],
    recommended: false,
  },
  {
    id: 22,
    category: "savings",
    name: "Plan Retraite",
    nameEn: "Retirement Plan",
    rate: "4.0%",
    features: ["Avantages fiscaux", "Long terme"],
    recommended: false,
  },
  {
    id: 23,
    category: "savings",
    name: "Épargne Enfant",
    nameEn: "Child Savings",
    rate: "2.8%",
    features: ["Pour vos enfants", "Versements libres"],
    recommended: false,
  },
  {
    id: 24,
    category: "savings",
    name: "Livret A",
    nameEn: "A Booklet",
    rate: "2.0%",
    features: ["Sans impôts", "Plafond 22 950 TND"],
    recommended: false,
  },
  {
    id: 25,
    category: "savings",
    name: "Compte à Terme",
    nameEn: "Term Deposit",
    rate: "3.5%",
    features: ["Taux garanti", "Durée fixe"],
    recommended: false,
  },
  {
    id: 26,
    category: "savings",
    name: "PEA",
    nameEn: "PEA",
    rate: "Variable",
    features: ["Bourse", "Exonération fiscale"],
    recommended: false,
  },

  // Assurances
  {
    id: 27,
    category: "insurance",
    name: "Assurance Vie",
    nameEn: "Life Insurance",
    rate: "3.2%",
    features: ["Protection famille", "Épargne"],
    recommended: false,
  },
  {
    id: 28,
    category: "insurance",
    name: "Assurance Habitation",
    nameEn: "Home Insurance",
    rate: "15 TND/mois",
    features: ["Tous risques", "Responsabilité"],
    recommended: false,
  },
  {
    id: 29,
    category: "insurance",
    name: "Assurance Auto",
    nameEn: "Auto Insurance",
    rate: "45 TND/mois",
    features: ["Tous risques", "Assistance 24/7"],
    recommended: false,
  },
  {
    id: 30,
    category: "insurance",
    name: "Assurance Santé",
    nameEn: "Health Insurance",
    rate: "80 TND/mois",
    features: ["Complémentaire", "Remboursement rapide"],
    recommended: false,
  },
  {
    id: 31,
    category: "insurance",
    name: "Assurance Voyage",
    nameEn: "Travel Insurance",
    rate: "25 TND/voyage",
    features: ["Monde entier", "Rapatriement"],
    recommended: false,
  },

  // Placements
  {
    id: 32,
    category: "investments",
    name: "SICAV Actions",
    nameEn: "Stock SICAV",
    rate: "Variable",
    features: ["Diversification", "Gestion pro"],
    recommended: false,
  },
  {
    id: 33,
    category: "investments",
    name: "SICAV Obligataire",
    nameEn: "Bond SICAV",
    rate: "3.8%",
    features: ["Sécurité", "Rendement stable"],
    recommended: false,
  },
  {
    id: 34,
    category: "investments",
    name: "FCP Monétaire",
    nameEn: "Money Market Fund",
    rate: "2.3%",
    features: ["Liquidité", "Risque faible"],
    recommended: false,
  },
  {
    id: 35,
    category: "investments",
    name: "Investissement Immobilier",
    nameEn: "Real Estate Investment",
    rate: "5.5%",
    features: ["Pierre-papier", "Revenus locatifs"],
    recommended: false,
  },

  // Services
  {
    id: 36,
    category: "services",
    name: "Coffre-fort Numérique",
    nameEn: "Digital Safe",
    rate: "5 TND/mois",
    features: ["Documents sécurisés", "Accessible 24/7"],
    recommended: false,
  },
  {
    id: 37,
    category: "services",
    name: "Virement International",
    nameEn: "International Transfer",
    rate: "1% commission",
    features: ["Rapide", "Taux compétitifs"],
    recommended: false,
  },
  {
    id: 38,
    category: "services",
    name: "Alerte SMS",
    nameEn: "SMS Alerts",
    rate: "2 TND/mois",
    features: ["Notifications temps réel", "Sécurité"],
    recommended: false,
  },
];

const productNameArById = {
  1: "الحساب الجاري الكلاسيكي",
  2: "الحساب المميز",
  3: "حساب الشباب",
  4: "حساب مهني",
  5: "حساب مشترك",
  6: "حساب ادخار يومي",
  7: "بطاقة فيزا كلاسيك",
  8: "بطاقة فيزا غولد",
  9: "ماستركارد بلاتينيوم",
  10: "بطاقة مسبقة الدفع",
  11: "بطاقة افتراضية",
  12: "قرض شخصي",
  13: "قرض DHAMEN",
  14: "قرض سيارة",
  15: "قرض سكني",
  16: "قرض الطالب",
  17: "قرض متجدد",
  18: "قرض اشغال",
  19: "توحيد القروض",
  20: "PEL كلاسيكي",
  21: "حساب ادخار مميز",
  22: "خطة تقاعد",
  23: "ادخار الطفل",
  24: "دفتر التوفير A",
  25: "وديعة لاجل",
  26: "PEA",
  27: "تأمين على الحياة",
  28: "تأمين السكن",
  29: "تأمين السيارة",
  30: "تأمين صحي",
  31: "تأمين السفر",
  32: "SICAV اسهم",
  33: "SICAV سندات",
  34: "صندوق سوق نقدي",
  35: "استثمار عقاري",
  36: "خزنة رقمية",
  37: "تحويل دولي",
  38: "تنبيهات SMS",
};

const getLocalizedProductName = (product, langKey) => {
  if (langKey === "ar") {
    return productNameArById[product.id] || product.nameEn;
  }

  if (langKey === "fr") {
    return product.name;
  }

  return product.nameEn;
};

export function Products() {
  const { theme } = useTheme();
  const { language, isRTL } = useLanguage();
  const langKey = language === "ar" ? "ar" : language === "fr" ? "fr" : "en";
  const ui = uiByLanguage[langKey] || uiByLanguage.en;
  const [selectedCategory, setSelectedCategory] = useState("all");
  const [searchQuery, setSearchQuery] = useState("");
  const [showRecommended, setShowRecommended] = useState(false);
  const [visibleCount, setVisibleCount] = useState(12);
  const [modalProductId, setModalProductId] = useState(null);

  useEffect(() => {
    setVisibleCount(12);
    setModalProductId(null);
  }, [selectedCategory, searchQuery, showRecommended]);

  useEffect(() => {
    if (!modalProductId) return;

    const handleEscape = (event) => {
      if (event.key === "Escape") {
        setModalProductId(null);
      }
    };

    const previousOverflow = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    window.addEventListener("keydown", handleEscape);

    return () => {
      document.body.style.overflow = previousOverflow;
      window.removeEventListener("keydown", handleEscape);
    };
  }, [modalProductId]);

  const normalizedQuery = searchQuery.trim().toLowerCase();

  const filteredProducts = allProducts.filter((product) => {
    const matchesCategory =
      selectedCategory === "all" || product.category === selectedCategory;
    const localizedName = getLocalizedProductName(product, langKey);
    const matchesSearch =
      normalizedQuery.length === 0 ||
      [product.name, product.nameEn, localizedName].some((value) =>
        value.toLowerCase().includes(normalizedQuery),
      );
    const matchesRecommended = !showRecommended || product.recommended;

    return matchesCategory && matchesSearch && matchesRecommended;
  });

  const visibleProducts = filteredProducts.slice(0, visibleCount);
  const hasMoreProducts = filteredProducts.length > visibleCount;
  const modalProduct = allProducts.find((product) => product.id === modalProductId);
  const modalCategory = modalProduct ? categoryMetaById[modalProduct.category] : null;
  const ModalCategoryIcon = modalCategory?.icon || Wallet;
  const modalCategoryName = modalCategory?.name?.[langKey] || ui.product;
  const modalVisual = modalProduct ? categoryVisuals[modalProduct.category] : null;
  const modalReasons = modalProduct ? getPersonalReasons(modalProduct, langKey) : [];
  const modalProductName = modalProduct
    ? getLocalizedProductName(modalProduct, langKey)
    : "";
  const modalRate = modalProduct ? getLocalizedRate(modalProduct.rate, langKey) : "";

  return (
    <div
      className={`p-4 lg:p-8 space-y-6 ${theme === "dark" ? "bg-gray-900" : "bg-white"} ${isRTL ? "text-right" : "text-left"}`}
    >
      {/* Header */}
      <div>
        <h1
          className={`text-2xl font-semibold mb-2 ${theme === "dark" ? "text-white" : "text-gray-900"}`}
        >
          {ui.title}
        </h1>
        <p
          className={`${theme === "dark" ? "text-gray-400" : "text-gray-600"}`}
        >
          {ui.subtitle}
        </p>
      </div>

      {/* Compact Filters */}
      <div
        className={`rounded-xl border p-4 ${theme === "dark" ? "border-gray-800 bg-gray-800/40" : "border-gray-200 bg-gray-50"}`}
      >
        <div className={`flex flex-col gap-3 lg:flex-row ${isRTL ? "lg:flex-row-reverse" : ""}`}>
          {/* Search */}
          <div className="flex-1 relative">
            <Search
              className={`absolute ${isRTL ? "right-3" : "left-3"} top-1/2 -translate-y-1/2 w-5 h-5 ${theme === "dark" ? "text-gray-500" : "text-gray-400"}`}
            />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder={ui.searchPlaceholder}
              className={`w-full py-3 border rounded-lg focus:outline-none focus:ring-2 focus:ring-[#242f54] ${
                theme === "dark"
                  ? "bg-gray-800 border-gray-700 text-white placeholder-gray-500"
                  : "bg-white border-gray-300 text-gray-900 placeholder-gray-400"
              } ${isRTL ? "pr-10 pl-4 text-right" : "pl-10 pr-4 text-left"}`}
            />
          </div>

          {/* Category Filter */}
          <select
            value={selectedCategory}
            onChange={(e) => setSelectedCategory(e.target.value)}
            className={`w-full lg:w-56 px-4 py-3 border rounded-lg focus:outline-none focus:ring-2 focus:ring-[#242f54] ${
              theme === "dark"
                ? "bg-gray-800 border-gray-700 text-white"
                : "bg-white border-gray-300 text-gray-900"
            } ${isRTL ? "text-right" : "text-left"}`}
          >
            {productCategories.map((cat) => (
              <option key={cat.id} value={cat.id}>
                {cat.name[langKey]} ({cat.count})
              </option>
            ))}
          </select>

          {/* Recommended Filter */}
          <button
            onClick={() => setShowRecommended(!showRecommended)}
            className={`flex items-center justify-center gap-2 px-6 py-3 border rounded-lg transition-colors ${isRTL ? "flex-row-reverse" : ""} ${
              showRecommended
                ? "bg-[#242f54] text-white border-[#242f54]"
                : theme === "dark"
                  ? "bg-gray-800 border-gray-700 text-gray-300 hover:bg-gray-700"
                  : "bg-white border-gray-300 text-gray-700 hover:bg-gray-50"
            }`}
          >
            <Star
              className={`w-5 h-5 ${showRecommended ? "fill-yellow-400 text-yellow-400" : ""}`}
            />
            <span>{ui.recommended}</span>
          </button>
        </div>
      </div>

      {/* Products Grid */}
      <div>
        <div className="flex items-center justify-between mb-4">
          <h3
            className={`font-medium ${theme === "dark" ? "text-white" : "text-gray-900"}`}
          >
            {filteredProducts.length} {ui.products}
          </h3>
        </div>

        {filteredProducts.length === 0 ? (
          <div
            className={`text-center py-12 ${theme === "dark" ? "bg-gray-800" : "bg-white"} rounded-xl`}
          >
            <p
              className={`${theme === "dark" ? "text-gray-400" : "text-gray-500"}`}
            >
              {ui.noProducts}
            </p>
          </div>
        ) : (
          <>
            <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-4">
              {visibleProducts.map((product) => {
                const category = categoryMetaById[product.category];
                const CategoryIcon = category?.icon || Wallet;
                const categoryName = category?.name?.[langKey] || ui.product;
                const visual = categoryVisuals[product.category];
                const productTitle = getLocalizedProductName(product, langKey);
                const localizedFeatures = product.features.map((feature) =>
                  getLocalizedFeature(feature, langKey),
                );
                const localizedRate = getLocalizedRate(product.rate, langKey);

                return (
                  <article
                    key={product.id}
                    className={`${
                      theme === "dark"
                        ? "bg-gray-800 border-gray-700"
                        : "bg-white border-gray-200"
                    } group overflow-hidden rounded-2xl border shadow-sm hover:shadow-xl transition-all duration-300`}
                  >
                      <div className="relative h-44 overflow-hidden">
                        <img
                          src={visual?.image}
                          alt={productTitle}
                          className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-105"
                          loading="lazy"
                        />
                        <div
                          className={`absolute inset-0 bg-linear-to-t ${visual?.overlay || "from-slate-700/60 to-slate-900/70"}`}
                        />

                        <div className={`absolute top-3 flex items-center gap-2 ${isRTL ? "right-3 flex-row-reverse" : "left-3"}`}>
                          <span className="inline-flex items-center gap-1 rounded-full bg-white/90 px-2.5 py-1 text-[11px] font-semibold text-gray-900">
                            <CategoryIcon className="h-3.5 w-3.5" />
                            {categoryName}
                          </span>
                          {product.recommended && (
                            <span className="inline-flex items-center gap-1 rounded-full bg-emerald-500/95 px-2.5 py-1 text-[11px] font-semibold text-white">
                              <Sparkles className="h-3.5 w-3.5" />
                              {ui.forYou}
                            </span>
                          )}
                        </div>

                        <div className={`absolute bottom-3 left-3 right-3 flex items-end justify-between text-white ${isRTL ? "flex-row-reverse" : ""}`}>
                          <h3 className={`text-lg font-semibold leading-tight drop-shadow-sm ${isRTL ? "text-right" : "text-left"}`}>
                            {productTitle}
                          </h3>
                          <div className="rounded-full bg-white/20 px-3 py-1 text-sm font-semibold backdrop-blur-sm">
                            {localizedRate}
                          </div>
                        </div>
                      </div>

                      <div className="p-5">
                        <ul className="space-y-2">
                          {localizedFeatures.slice(0, 2).map((feature, idx) => (
                            <li
                              key={idx}
                              className={`text-xs flex items-start gap-2 ${theme === "dark" ? "text-gray-300" : "text-gray-600"} ${isRTL ? "flex-row-reverse" : ""}`}
                            >
                              <span className="mt-1.5 h-1.5 w-1.5 rounded-full bg-[#242f54] shrink-0"></span>
                              <span>{feature}</span>
                            </li>
                          ))}
                        </ul>

                        {product.features.length > 2 && (
                          <p
                            className={`text-xs mt-3 ${theme === "dark" ? "text-gray-400" : "text-gray-500"}`}
                          >
                            +{product.features.length - 2} {ui.moreBenefits}
                          </p>
                        )}

                        <button
                          onClick={() => setModalProductId(product.id)}
                          className={`mt-4 w-full inline-flex items-center justify-center gap-2 py-2.5 rounded-xl transition-colors text-sm font-semibold ${
                            theme === "dark"
                              ? "bg-gray-700 text-white hover:bg-gray-600"
                              : "bg-gray-100 text-gray-900 hover:bg-gray-200"
                          }`}
                        >
                          {ui.showDetails}
                        </button>
                      </div>
                  </article>
                );
              })}
            </div>

            {hasMoreProducts && (
              <div className="mt-5 flex justify-center">
                <button
                  onClick={() => setVisibleCount((count) => count + 12)}
                  className={`px-5 py-2.5 rounded-lg font-medium transition-colors ${
                    theme === "dark"
                      ? "bg-gray-800 text-gray-200 hover:bg-gray-700"
                      : "bg-white border border-gray-300 text-gray-700 hover:bg-gray-50"
                  }`}
                >
                  {ui.showMore}
                </button>
              </div>
            )}
          </>
        )}
      </div>

      {modalProduct && (
        <div
          className={`fixed inset-0 z-50 flex items-end justify-center bg-slate-950/65 sm:items-center sm:p-6 ${isRTL ? "text-right" : "text-left"}`}
          onClick={() => setModalProductId(null)}
        >
          <div
            role="dialog"
            aria-modal="true"
            className={`w-full max-h-[92vh] overflow-y-auto border shadow-2xl rounded-t-2xl sm:rounded-2xl sm:max-w-2xl ${
              theme === "dark"
                ? "bg-gray-900 border-gray-700"
                : "bg-white border-gray-200"
            }`}
            onClick={(event) => event.stopPropagation()}
          >
            <div
              className={`sticky top-0 z-10 px-4 py-3 sm:px-6 sm:py-4 border-b backdrop-blur-sm flex items-center justify-between ${isRTL ? "flex-row-reverse" : ""} ${
                theme === "dark"
                  ? "bg-gray-900/95 border-gray-700"
                  : "bg-white/95 border-gray-200"
              }`}
            >
              <div>
                <p
                  className={`text-xs ${langKey === "ar" ? "" : "uppercase tracking-wide"} ${
                    theme === "dark" ? "text-gray-400" : "text-gray-500"
                  }`}
                >
                  {ui.productDetails}
                </p>
                <h3
                  className={`text-base sm:text-lg font-semibold ${
                    theme === "dark" ? "text-white" : "text-gray-900"
                  }`}
                >
                  {modalProductName}
                </h3>
              </div>
              <button
                onClick={() => setModalProductId(null)}
                className={`inline-flex h-9 w-9 items-center justify-center rounded-full transition-colors ${
                  theme === "dark"
                    ? "bg-gray-800 text-gray-300 hover:bg-gray-700"
                    : "bg-gray-100 text-gray-700 hover:bg-gray-200"
                }`}
                aria-label={ui.close}
              >
                <X className="h-4 w-4" />
              </button>
            </div>

            <div className="relative h-48 sm:h-60 overflow-hidden">
              <img
                src={modalVisual?.image}
                alt={modalProductName}
                className="h-full w-full object-cover"
              />
              <div
                className={`absolute inset-0 bg-linear-to-t ${
                  modalVisual?.overlay || "from-slate-700/60 to-slate-900/70"
                }`}
              />
              <div className={`absolute top-4 flex flex-wrap gap-2 ${isRTL ? "right-4" : "left-4"}`}>
                <span className="inline-flex items-center gap-1 rounded-full bg-white/90 px-2.5 py-1 text-[11px] font-semibold text-gray-900">
                  <ModalCategoryIcon className="h-3.5 w-3.5" />
                  {modalCategoryName}
                </span>
                {modalProduct.recommended && (
                  <span className="inline-flex items-center gap-1 rounded-full bg-emerald-500/95 px-2.5 py-1 text-[11px] font-semibold text-white">
                    <Sparkles className="h-3.5 w-3.5" />
                    {ui.forYou}
                  </span>
                )}
              </div>
              <div className={`absolute bottom-4 rounded-full bg-white/20 px-3 py-1 text-sm font-semibold text-white backdrop-blur-sm ${isRTL ? "left-4" : "right-4"}`}>
                {modalRate}
              </div>
            </div>

            <div className="space-y-5 p-4 sm:p-6">
              <div>
                <h4
                  className={`mb-2 text-sm font-semibold ${
                    theme === "dark" ? "text-white" : "text-gray-900"
                  }`}
                >
                  {ui.benefits}
                </h4>
                <ul className="space-y-2">
                  {modalProduct.features.map((feature, idx) => (
                    <li
                      key={idx}
                      className={`text-sm flex items-start gap-2 ${
                        theme === "dark" ? "text-gray-300" : "text-gray-700"
                      } ${isRTL ? "flex-row-reverse" : ""}`}
                    >
                      <span className="mt-2 h-1.5 w-1.5 rounded-full bg-[#242f54] shrink-0"></span>
                      <span>{getLocalizedFeature(feature, langKey)}</span>
                    </li>
                  ))}
                </ul>
              </div>

              {modalProduct.recommended && (
                <div className="rounded-xl border border-emerald-500/30 bg-emerald-500/10 p-4">
                  <div className={`mb-2 flex items-center gap-2 ${isRTL ? "flex-row-reverse" : ""}`}>
                    <Sparkles className="h-4 w-4 text-emerald-500" />
                    <p className="text-sm font-semibold text-emerald-600">
                      {ui.whyForYou}
                    </p>
                  </div>
                  <ul className="space-y-1.5">
                    {modalReasons.map((reason, idx) => (
                      <li
                        key={idx}
                        className={`text-xs ${
                          theme === "dark" ? "text-emerald-200" : "text-emerald-700"
                        } ${isRTL ? "text-right" : "text-left"}`}
                      >
                        {isRTL ? `${reason} •` : `• ${reason}`}
                      </li>
                    ))}
                  </ul>
                </div>
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
