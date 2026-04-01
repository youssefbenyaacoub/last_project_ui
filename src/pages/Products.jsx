import { useEffect, useMemo, useState } from "react";
import { Search, Star, AlertCircle, X, Info } from "lucide-react";
import { useTheme } from "../contexts/ThemeContext";
import { useLanguage } from "../contexts/LanguageContext";
import { getClientId, getClientRecommendation, getProductsCatalog } from "../api";

const uiByLanguage = {
  en: {
    title: "Products Catalog",
    subtitle: "Explore all BH Bank products with complete details.",
    searchPlaceholder: "Search by product name or description",
    allCategories: "All categories",
    loading: "Loading products...",
    noProducts: "No products found.",
    recommended: "Recommended",
    moreInfo: "More info",
    recommendationTitle: "Why this product is good for you",
    recommendationFallback:
      "This product matches your profile, account activity, and financial goals.",
    featuresTitle: "Key features",
    detailsTitle: "Additional details",
    close: "Close",
  },
  fr: {
    title: "Catalogue des produits",
    subtitle: "Explorez tous les produits BH Bank avec leurs details complets.",
    searchPlaceholder: "Rechercher par nom ou description",
    allCategories: "Toutes les categories",
    loading: "Chargement des produits...",
    noProducts: "Aucun produit trouve.",
    recommended: "Recommande",
    moreInfo: "Plus d'infos",
    recommendationTitle: "Pourquoi ce produit est adapte a votre profil",
    recommendationFallback:
      "Ce produit est coherent avec votre profil, votre activite bancaire et vos objectifs financiers.",
    featuresTitle: "Caracteristiques principales",
    detailsTitle: "Informations complementaires",
    close: "Fermer",
  },
  ar: {
    title: "دليل المنتجات",
    subtitle: "اكتشف جميع منتجات بنك BH مع شرح واضح لكل خدمة.",
    searchPlaceholder: "ابحث باسم المنتج أو وصفه",
    allCategories: "كل الفئات",
    loading: "جاري تحميل المنتجات...",
    noProducts: "لم يتم العثور على منتجات.",
    recommended: "موصى به لك",
    moreInfo: "عرض التفاصيل",
    recommendationTitle: "لماذا ننصحك بهذا المنتج؟",
    recommendationFallback:
      "اخترنا هذا المنتج لأنه يتوافق مع احتياجاتك المالية ونمط استخدامك البنكي.",
    featuresTitle: "المزايا الأساسية",
    detailsTitle: "تفاصيل إضافية",
    close: "إغلاق",
  },
};

const categoryLabels = {
  en: {
    "Épargne": "Savings",
    "Crédits": "Loans",
    Cartes: "Cards",
    Packs: "Packs",
    Assurances: "Insurance",
    Services: "Services",
  },
  fr: {
    "Épargne": "Epargne",
    "Crédits": "Credits",
    Cartes: "Cartes",
    Packs: "Packs",
    Assurances: "Assurances",
    Services: "Services",
  },
  ar: {
    "Épargne": "ادخار",
    "Crédits": "قروض",
    Cartes: "بطاقات",
    Packs: "حزم",
    Assurances: "تأمين",
    Services: "خدمات",
  },
};

const extendedProducts = [
  {
    id: "certificat-depot",
    category: "Épargne",
    name: "Certificat de Depot",
    description: "Placement negocie pour les montants importants avec rendement fixe.",
    features: ["Capital garanti", "Taux negocie", "Durée flexible"],
  },
  {
    id: "carte-yasmine",
    category: "Cartes",
    name: "Carte Yasmine",
    description: "Carte nationale pour paiements et retraits avec services BH digitaux.",
    features: ["Paiement local", "Retrait DAB", "Gestion via BH Net"],
  },
  {
    id: "carte-go",
    category: "Cartes",
    name: "Carte GO",
    description: "Carte adaptee aux jeunes 18-25 ans avec offres digitales.",
    features: ["Offres jeunes", "Paiements rapides", "Compatible mobile"],
  },
  {
    id: "carte-gold-nat",
    category: "Cartes",
    name: "Carte BH Gold Nationale",
    description: "Carte premium nationale avec plafonds et services etendus.",
    features: ["Plafond eleve", "Assistance", "Avantages premium"],
  },
  {
    id: "carte-platinum-nat",
    category: "Cartes",
    name: "Carte BH Platinum Nationale",
    description: "Carte haut de gamme avec avantages exclusifs et assistance renforcee.",
    features: ["Premium", "Conciergerie", "Assurances"],
  },
  {
    id: "visa-classic-int",
    category: "Cartes",
    name: "Visa Classic Internationale",
    description: "Carte internationale pour paiements et retraits a l'etranger.",
    features: ["Paiement international", "Retrait international", "Securite 3D"],
  },
  {
    id: "carte-scolarite",
    category: "Cartes",
    name: "Carte BH Scolarite",
    description: "Carte dediee aux depenses scolaires et universitaires.",
    features: ["Frais etudes", "Suivi parental", "Paiement securise"],
  },
  {
    id: "pack-affaires",
    category: "Packs",
    name: "Pack Affaires",
    description: "Pack pour createurs d'entreprise et activite professionnelle.",
    features: ["Compte pro", "Services digitaux", "Accompagnement"],
  },
  {
    id: "assur-senior",
    category: "Assurances",
    name: "Assur Senior",
    description: "Protection et assistance adaptees aux clients seniors.",
    features: ["Protection senior", "Assistance medicale", "Couverture etendue"],
  },
  {
    id: "assurance-incendie",
    category: "Assurances",
    name: "Assurance Incendie",
    description: "Couverture des biens en cas d'incendie et risques associes.",
    features: ["Protection habitation", "Indemnisation", "Assistance"],
  },
  {
    id: "bh-netmobile",
    category: "Services",
    name: "BH NetMobile",
    description: "Application mobile pour suivre comptes, cartes et operations.",
    features: ["24/7", "Virements", "Consultation en temps reel"],
  },
  {
    id: "credit-pro",
    category: "Crédits",
    name: "Credit PRO",
    description: "Financement dedie aux besoins professionnels et tres petites entreprises.",
    features: ["Tresorerie", "Investissement", "Echeances adaptees"],
  },
  {
    id: "cmt",
    category: "Crédits",
    name: "CMT",
    description: "Credit moyen terme pour equipement professionnel.",
    features: ["Moyen terme", "Equipement", "Montant sur mesure"],
  },
  {
    id: "avance-promedica",
    category: "Crédits",
    name: "Avance Promedica",
    description: "Solution de financement ciblee pour professionnels de la sante.",
    features: ["Professions medicales", "Deblocage rapide", "Taux preferentiel"],
  },
];

const recommendationKeyToProductId = {
  "plan-epargne-etudes": "epargne-etudes",
  cse: "cse-yaychek",
  "bon-de-caisse": "bon-caisse",
  "certificat-depot": "certificat-depot",
  cat: "cat",
  "pel-classique": "pel",
  "pel-el-jedid": "pel",
  "credit-direct": "credit-immo",
  "al-masken": "premier-logement",
  "credit-personnel": "credit-perso",
  "bh-auto": "bh-auto",
  "credit-ordinateur": "credit-ordi",
  "credit-amenagement": "credit-amenagement",
  "carte-cib": "carte-cib",
  "carte-yasmine": "carte-yasmine",
  "carte-go": "carte-go",
  "carte-gold-nat": "carte-gold-nat",
  "carte-platinum-nat": "carte-platinum-nat",
  "visa-classic-int": "visa-classic-int",
  "carte-gold-int": "carte-gold-intl",
  "carte-platinum-int": "carte-platinum-intl",
  "carte-travel": "carte-travel",
  "carte-scolarite": "carte-scolarite",
  "carte-technologie": "carte-technologie",
  "carte-3xpay": "carte-3xpay",
  "pack-smart": "pack-smart",
  "pack-select": "pack-select",
  "pack-senior": "pack-senior",
  "pack-grow": "pack-grow",
  "pack-affaires": "pack-affaires",
  "pack-platinum": "pack-platinum",
  "dhamen-credit": "dhamen-credit",
  "dhamen-compte": "dhamen-compte",
  "dhamen-epargne-ret": "dhamen-retraite",
  "assur-senior": "assur-senior",
  "assurance-incendie": "assurance-incendie",
  "bh-netmobile": "bh-netmobile",
  "bh-sms": "bh-sms",
  "credit-pro": "credit-pro",
  cmt: "cmt",
  "avance-promedica": "avance-promedica",
};

const productNameTranslations = {
  "epargne-etudes": {
    en: "Education Savings Plan",
    fr: "Plan Epargne Etudes",
    ar: "خطة ادخار التعليم",
  },
  "cse-yaychek": {
    en: "Y'Aychek Savings Account",
    fr: "Compte Epargne Y'Aychek",
    ar: "حساب ادخار يعيشك",
  },
  "bon-caisse": { en: "Cash Certificate", fr: "Bon de Caisse", ar: "شهادة ادخار نقدية" },
  cat: { en: "Term Deposit Account", fr: "Compte a Terme", ar: "حساب لأجل" },
  pel: { en: "Home Savings Plan", fr: "Plan Epargne Logement", ar: "خطة ادخار السكن" },
  sicav: { en: "SICAV BH Placement", fr: "SICAV BH Placement", ar: "سيكاف BH للاستثمار" },
  "credit-immo": {
    en: "Direct Mortgage Loan",
    fr: "Credit Immobilier Direct",
    ar: "قرض عقاري مباشر",
  },
  "premier-logement": {
    en: "First Home Program",
    fr: "Al Masken Al Awel",
    ar: "برنامج المسكن الأول",
  },
  "credit-perso": { en: "Personal Loan", fr: "Credit Personnel", ar: "قرض شخصي" },
  "bh-auto": { en: "BH Auto Loan", fr: "BH Auto", ar: "قرض سيارة BH" },
  "credit-ordi": { en: "Computer Loan", fr: "Credit Ordinateur", ar: "قرض حاسوب" },
  "credit-amenagement": {
    en: "Renovation Loan",
    fr: "Credit Amenagement",
    ar: "قرض التهيئة",
  },
  "carte-3xpay": {
    en: "3XPAY Card",
    fr: "Carte 3XPAY",
    ar: "بطاقة 3XPAY",
  },
  "carte-platinum-intl": {
    en: "International Platinum Card",
    fr: "Carte Platinum Internationale",
    ar: "بطاقة بلاتينيوم دولية",
  },
  "carte-gold-intl": {
    en: "International Gold Card",
    fr: "Carte Gold Internationale",
    ar: "بطاقة ذهبية دولية",
  },
  "carte-technologie": {
    en: "BH Technology Card",
    fr: "Carte BH Technologie",
    ar: "بطاقة BH للتكنولوجيا",
  },
  "carte-travel": { en: "BH Travel Card", fr: "Carte BH Travel", ar: "بطاقة BH للسفر" },
  "carte-cib": { en: "CIB Card", fr: "Carte CIB", ar: "بطاقة CIB" },
  "pack-select": { en: "Select+ Pack", fr: "Pack Select+", ar: "حزمة Select+" },
  "pack-platinum": { en: "Platinum Pack", fr: "Pack Platinum", ar: "حزمة بلاتينيوم" },
  "pack-grow": { en: "GROW Pack", fr: "Pack GROW", ar: "حزمة GROW" },
  "pack-senior": { en: "Senior Pack", fr: "Pack Senior", ar: "حزمة سينيور" },
  "pack-smart": { en: "SMART Pack", fr: "Pack SMART", ar: "حزمة SMART" },
  "dhamen-credit": { en: "DHAMEN Credit", fr: "DHAMEN Credit", ar: "تأمين ضمان القرض" },
  "dhamen-compte": { en: "DHAMEN Account", fr: "DHAMEN Compte", ar: "تأمين ضمان الحساب" },
  "dhamen-retraite": {
    en: "Retirement Savings Insurance",
    fr: "Dhamen Epargne Retraite",
    ar: "تأمين ادخار التقاعد",
  },
  "bh-sms": { en: "BH SMS Alerts", fr: "BH SMS", ar: "خدمة رسائل BH" },
  "e-trade": { en: "E-Trade Service", fr: "E-Trade", ar: "خدمة التجارة الإلكترونية" },
  "certificat-depot": { en: "Deposit Certificate", fr: "Certificat de Depot", ar: "شهادة إيداع" },
  "carte-yasmine": { en: "Yasmine Card", fr: "Carte Yasmine", ar: "بطاقة ياسمين" },
  "carte-go": { en: "GO Card", fr: "Carte GO", ar: "بطاقة GO" },
  "carte-gold-nat": {
    en: "National Gold Card",
    fr: "Carte BH Gold Nationale",
    ar: "بطاقة ذهبية وطنية",
  },
  "carte-platinum-nat": {
    en: "National Platinum Card",
    fr: "Carte BH Platinum Nationale",
    ar: "بطاقة بلاتينيوم وطنية",
  },
  "visa-classic-int": {
    en: "Visa Classic International",
    fr: "Visa Classic Internationale",
    ar: "فيزا كلاسيك دولية",
  },
  "carte-scolarite": {
    en: "School Card",
    fr: "Carte BH Scolarite",
    ar: "بطاقة الدراسة",
  },
  "pack-affaires": { en: "Business Pack", fr: "Pack Affaires", ar: "حزمة الأعمال" },
  "assur-senior": { en: "Senior Insurance", fr: "Assur Senior", ar: "تأمين كبار السن" },
  "assurance-incendie": {
    en: "Fire Insurance",
    fr: "Assurance Incendie",
    ar: "تأمين الحريق",
  },
  "bh-netmobile": { en: "BH NetMobile", fr: "BH NetMobile", ar: "تطبيق BH NetMobile" },
  "credit-pro": { en: "Professional Loan", fr: "Credit PRO", ar: "قرض مهني" },
  cmt: { en: "Medium-Term Loan", fr: "CMT", ar: "قرض متوسط الأجل" },
  "avance-promedica": {
    en: "Promedica Advance",
    fr: "Avance Promedica",
    ar: "سلفة بروميديكا",
  },
};

const categoryImageTheme = {
  "Épargne": { from: "#0ea5e9", to: "#0369a1", accent: "#bae6fd" },
  "Crédits": { from: "#4f46e5", to: "#1d4ed8", accent: "#c7d2fe" },
  Cartes: { from: "#0f766e", to: "#0ea5a3", accent: "#99f6e4" },
  Packs: { from: "#7c3aed", to: "#a855f7", accent: "#ddd6fe" },
  Assurances: { from: "#059669", to: "#16a34a", accent: "#bbf7d0" },
  Services: { from: "#ea580c", to: "#f59e0b", accent: "#fed7aa" },
};

const normalizeText = (value) =>
  String(value || "")
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .toLowerCase()
    .replace(/[^a-z0-9\u0600-\u06ff]+/g, " ")
    .trim();

const canonicalId = (value) => String(value || "").toLowerCase().replace(/_/g, "-").trim();

const slugFromName = (name) => normalizeText(name).replace(/\s+/g, "-");

function productImageDataUri(product) {
  const theme = categoryImageTheme[product.category] || {
    from: "#1e3a8a",
    to: "#1d4ed8",
    accent: "#93c5fd",
  };

  const svg = `
<svg xmlns="http://www.w3.org/2000/svg" width="800" height="420" viewBox="0 0 800 420">
  <defs>
    <linearGradient id="g" x1="0" y1="0" x2="1" y2="1">
      <stop offset="0%" stop-color="${theme.from}"/>
      <stop offset="100%" stop-color="${theme.to}"/>
    </linearGradient>
  </defs>
  <rect width="800" height="420" rx="34" fill="url(#g)"/>
  <circle cx="700" cy="90" r="110" fill="${theme.accent}" opacity="0.25"/>
  <circle cx="120" cy="360" r="130" fill="${theme.accent}" opacity="0.18"/>
</svg>`;

  return `data:image/svg+xml;utf8,${encodeURIComponent(svg)}`;
}

function localizedCategory(category, language) {
  if (language === "ar") return categoryLabels.ar[category] || category;
  if (language === "en") return categoryLabels.en[category] || category;
  return categoryLabels.fr[category] || category;
}

function localizedDescription(product, language) {
  if (language === "fr") return product.description || "";

  const categoryCopy = {
    en: {
      "Épargne": "Designed to help you save and grow your balance with better yields.",
      "Crédits": "Built to finance your projects with transparent and flexible repayments.",
      Cartes: "Optimized for daily payments, secure transactions, and banking convenience.",
      Packs: "A bundled offer combining key services for better value and simpler banking.",
      Assurances: "Protection coverage to secure your account, credit, and personal assets.",
      Services: "Digital banking service to monitor and manage your activity in real time.",
    },
    ar: {
      "Épargne": "مصمم لمساعدتك على الادخار وتنمية رصيدك بعوائد أفضل.",
      "Crédits": "مخصص لتمويل مشاريعك مع أقساط واضحة ومرنة.",
      Cartes: "مثالي للمدفوعات اليومية مع أمان عال وسهولة في الاستخدام.",
      Packs: "حزمة تجمع الخدمات الأساسية بقيمة أفضل وإدارة أبسط.",
      Assurances: "تغطية تأمينية لحماية حسابك وقروضك وممتلكاتك.",
      Services: "خدمة رقمية لمتابعة عملياتك البنكية وإدارتها في الوقت الفعلي.",
    },
  };

  return categoryCopy[language]?.[product.category] || product.description || "";
}

function localizedDetails(category, language) {
  const details = {
    en: {
      "Épargne": ["Flexible contribution rhythm", "Capital secured", "Suitable for medium and long term planning"],
      "Crédits": ["Clear repayment plan", "Adjustable financing amount", "Fast eligibility decision"],
      Cartes: ["Daily secure payments", "ATM and online usage", "Spending control options"],
      Packs: ["Bundled pricing advantage", "Multi-service access", "Simple activation"],
      Assurances: ["Protection against major risks", "Coverage adapted to your profile", "Easy claim follow-up"],
      Services: ["Digital access 24/7", "Real-time notifications", "Simple account management"],
    },
    fr: {
      "Épargne": ["Versements flexibles", "Capital securise", "Adaptation au moyen et long terme"],
      "Crédits": ["Plan de remboursement clair", "Montant modulable", "Decision d'eligibilite rapide"],
      Cartes: ["Paiements securises au quotidien", "Usage DAB et en ligne", "Controle des depenses"],
      Packs: ["Tarification groupee avantageuse", "Services multiples", "Activation simple"],
      Assurances: ["Protection contre les risques majeurs", "Couverture adaptee a votre profil", "Suivi simple"],
      Services: ["Acces digital 24/7", "Notifications en temps reel", "Gestion simplifiee"],
    },
    ar: {
      "Épargne": ["مساهمات مرنة حسب قدرتك", "رأس المال محمي", "ملائم للتخطيط المتوسط والطويل الأجل"],
      "Crédits": ["خطة سداد واضحة", "قيمة التمويل قابلة للتخصيص", "قرار الأهلية سريع"],
      Cartes: ["مدفوعات يومية آمنة", "استخدام في الصراف الآلي والإنترنت", "تحكم أفضل في المصاريف"],
      Packs: ["تسعير مجمّع أوفر", "وصول إلى خدمات متعددة", "تفعيل سريع وسهل"],
      Assurances: ["حماية من المخاطر الأساسية", "تغطية مناسبة لملفك", "متابعة المطالبات بسهولة"],
      Services: ["وصول رقمي على مدار الساعة", "تنبيهات فورية", "إدارة مبسطة للحساب"],
    },
  };

  return details[language]?.[category] || details.fr[category] || [];
}

function recommendationFallback(language, ui) {
  return ui.recommendationFallback;
}

function productPhotoTag(language) {
  return language === "ar" ? "بنك BH" : "BH BANK";
}

function normalizeProduct(product) {
  const id = canonicalId(product?.id || slugFromName(product?.name));
  return {
    id,
    category: product?.category || "Services",
    name: product?.name || "Produit",
    description: product?.description || "",
    features: Array.isArray(product?.features) ? product.features : [],
    color: product?.color || "#0A2240",
    icon: product?.icon || "box",
  };
}

function matchRecommendation(product, entries) {
  const productNameNorm = normalizeText(product.name);

  for (const entry of entries) {
    if (entry.key) {
      const mappedId = recommendationKeyToProductId[entry.key] || entry.key;
      if (mappedId === product.id) {
        return entry;
      }
    }

    if (!entry.nameNorm) continue;

    if (
      productNameNorm.includes(entry.nameNorm) ||
      entry.nameNorm.includes(productNameNorm)
    ) {
      return entry;
    }
  }

  return null;
}

export function Products() {
  const { theme } = useTheme();
  const { language, isRTL } = useLanguage();
  const isDark = theme === "dark";

  const ui = uiByLanguage[language] || uiByLanguage.fr;

  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [search, setSearch] = useState("");
  const [products, setProducts] = useState([]);
  const [selectedCategory, setSelectedCategory] = useState("all");
  const [recommendationEntries, setRecommendationEntries] = useState([]);
  const [selectedProduct, setSelectedProduct] = useState(null);

  const clientId = getClientId();

  useEffect(() => {
    const loadProducts = async () => {
      try {
        setLoading(true);
        setError("");

        const [catalogData, recommendationData] = await Promise.all([
          getProductsCatalog(),
          clientId ? getClientRecommendation(clientId).catch(() => null) : Promise.resolve(null),
        ]);

        const backendProducts = Array.isArray(catalogData?.products)
          ? catalogData.products.map(normalizeProduct)
          : [];

        const merged = [...backendProducts];
        const existingIds = new Set(backendProducts.map((item) => item.id));

        for (const extra of extendedProducts) {
          const normalized = normalizeProduct(extra);
          if (!existingIds.has(normalized.id)) {
            merged.push(normalized);
            existingIds.add(normalized.id);
          }
        }

        setProducts(merged);

        const rawRecommendations = Array.isArray(recommendationData?.recommended_products)
          ? recommendationData.recommended_products
          : [];

        const entries = rawRecommendations.map((item) => {
          if (typeof item === "string") {
            return {
              key: "",
              name: item,
              nameNorm: normalizeText(item),
              reason: "",
            };
          }

          const key = canonicalId(item?.product_key || "");
          const name = item?.product_name || item?.name || "";

          return {
            key,
            name,
            nameNorm: normalizeText(name),
            reason: item?.reason || "",
          };
        });

        setRecommendationEntries(entries);
      } catch (err) {
        setError(err.message || "Impossible de charger les produits.");
      } finally {
        setLoading(false);
      }
    };

    loadProducts();
  }, [clientId]);

  const categories = useMemo(() => {
    const raw = Array.from(new Set(products.map((product) => product.category).filter(Boolean)));
    return ["all", ...raw];
  }, [products]);

  const localizedProducts = useMemo(() => {
    return products.map((product) => {
      const nameTranslation = productNameTranslations[product.id]?.[language]
        || productNameTranslations[product.id]?.fr
        || product.name;

      const displayName = nameTranslation || product.name;
      const displayDescription = localizedDescription(product, language);
      const displayFeatures =
        language === "fr" && product.features.length > 0
          ? product.features
          : localizedDetails(product.category, language);

      const recommendation = matchRecommendation(product, recommendationEntries);
      const recommendationReason =
        language === "fr" && recommendation?.reason
          ? recommendation.reason
          : recommendation
            ? recommendationFallback(language, ui)
            : "";

      return {
        ...product,
        displayName,
        displayDescription,
        displayFeatures,
        displayDetails: localizedDetails(product.category, language),
        localizedCategory: localizedCategory(product.category, language),
        isRecommended: Boolean(recommendation),
        recommendationReason,
      };
    });
  }, [products, language, recommendationEntries, ui]);

  const filteredProducts = useMemo(() => {
    const term = normalizeText(search);

    return localizedProducts.filter((product) => {
      const matchesCategory = selectedCategory === "all" || product.category === selectedCategory;
      const haystack = normalizeText(
        `${product.displayName} ${product.displayDescription} ${product.localizedCategory}`,
      );

      const matchesSearch = term.length === 0 || haystack.includes(term);
      return matchesCategory && matchesSearch;
    });
  }, [localizedProducts, search, selectedCategory]);

  return (
    <div
      dir={isRTL ? "rtl" : "ltr"}
      className={`min-h-full space-y-6 p-4 lg:p-8 ${
        isDark ? "bg-gray-900 text-white" : "bg-gray-50 text-gray-900"
      } ${isRTL ? "text-right" : "text-left"}`}
    >
      <div>
        <h1 className="text-2xl font-semibold lg:text-3xl">{ui.title}</h1>
        <p className={isDark ? "text-gray-400" : "text-gray-600"}>{ui.subtitle}</p>
      </div>

      {error && (
        <div
          className={`flex items-center gap-2 rounded-xl border p-4 text-sm ${
            isDark
              ? "border-red-800 bg-red-950/30 text-red-300"
              : "border-red-200 bg-red-50 text-red-700"
          }`}
        >
          <AlertCircle className="h-4 w-4" />
          {error}
        </div>
      )}

      <div className="grid gap-4 lg:grid-cols-3">
        <div
          className={`lg:col-span-2 flex items-center gap-2 rounded-xl border px-4 py-3 ${
            isDark ? "border-gray-700 bg-gray-800" : "border-gray-200 bg-white"
          } ${isRTL ? "flex-row-reverse" : ""}`}
        >
          <Search className="h-4 w-4 text-gray-400" />
          <input
            value={search}
            onChange={(event) => setSearch(event.target.value)}
            placeholder={ui.searchPlaceholder}
            className={`w-full bg-transparent outline-none ${isRTL ? "text-right" : "text-left"}`}
          />
        </div>

        <select
          value={selectedCategory}
          onChange={(event) => setSelectedCategory(event.target.value)}
          className={`rounded-xl border px-4 py-3 ${
            isDark
              ? "border-gray-700 bg-gray-800 text-white"
              : "border-gray-200 bg-white text-gray-900"
          } ${isRTL ? "text-right" : "text-left"}`}
        >
          {categories.map((category) => (
            <option key={category} value={category}>
              {category === "all" ? ui.allCategories : localizedCategory(category, language)}
            </option>
          ))}
        </select>
      </div>

      {loading ? (
        <div
          className={`rounded-xl border p-4 ${
            isDark ? "border-gray-700 bg-gray-800" : "border-gray-200 bg-white"
          }`}
        >
          {ui.loading}
        </div>
      ) : (
        <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-3">
          {filteredProducts.map((product) => (
            <article
              key={product.id}
              className={`overflow-hidden rounded-xl border ${
                isDark ? "border-gray-700 bg-gray-800" : "border-gray-200 bg-white"
              }`}
            >
              <div className="relative h-36 w-full overflow-hidden">
                <img
                  src={productImageDataUri(product)}
                  alt={product.displayName}
                  className="h-full w-full object-cover"
                />
                <div className="absolute inset-0 bg-gradient-to-r from-black/50 via-black/20 to-transparent" />
                <div className={`absolute inset-x-0 bottom-0 p-3 ${isRTL ? "text-right" : "text-left"}`}>
                  <p className="text-[10px] font-semibold tracking-[0.14em] text-white/80">
                    {productPhotoTag(language)}
                  </p>
                  <p className="mt-1 truncate text-sm font-semibold text-white">{product.displayName}</p>
                  <p className="text-xs text-blue-100">{product.localizedCategory}</p>
                </div>
              </div>

              <div className="p-5">
                <div className="mb-3 flex items-center justify-between gap-2">
                  <span
                    className={`rounded-full px-2.5 py-1 text-xs ${
                      isDark ? "bg-gray-900 text-gray-300" : "bg-gray-100 text-gray-600"
                    }`}
                  >
                    {product.localizedCategory}
                  </span>
                  {product.isRecommended && (
                    <span className="inline-flex items-center gap-1 rounded-full bg-amber-100 px-2.5 py-1 text-xs text-amber-700">
                      <Star className="h-3 w-3" />
                      {ui.recommended}
                    </span>
                  )}
                </div>

                <h2 className="text-lg font-semibold">{product.displayName}</h2>
                <p className={`mt-2 text-sm ${isDark ? "text-gray-300" : "text-gray-600"}`}>
                  {product.displayDescription}
                </p>

                {product.isRecommended && (
                  <p className={`mt-3 rounded-lg px-3 py-2 text-xs ${isDark ? "bg-amber-900/20 text-amber-200" : "bg-amber-50 text-amber-800"}`}>
                    {product.recommendationReason || ui.recommendationFallback}
                  </p>
                )}

                <button
                  type="button"
                  onClick={() => setSelectedProduct(product)}
                  className="mt-4 inline-flex items-center gap-2 rounded-lg bg-[#0A2240] px-3 py-2 text-sm font-medium text-white hover:bg-[#12305b]"
                >
                  <Info className="h-4 w-4" />
                  {ui.moreInfo}
                </button>
              </div>
            </article>
          ))}

          {filteredProducts.length === 0 && (
            <div
              className={`md:col-span-2 xl:col-span-3 rounded-xl border p-6 text-sm ${
                isDark
                  ? "border-gray-700 bg-gray-800 text-gray-300"
                  : "border-gray-200 bg-white text-gray-600"
              }`}
            >
              {ui.noProducts}
            </div>
          )}
        </div>
      )}

      {selectedProduct && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/55 p-4">
          <div
            className={`max-h-[92vh] w-full max-w-3xl overflow-y-auto rounded-2xl border ${
              isDark ? "border-gray-700 bg-gray-900 text-white" : "border-gray-200 bg-white text-gray-900"
            }`}
          >
            <div className="relative h-52 w-full overflow-hidden">
              <img
                src={productImageDataUri(selectedProduct)}
                alt={selectedProduct.displayName}
                className="h-full w-full object-cover"
              />
              <div className="absolute inset-0 bg-gradient-to-r from-black/55 via-black/20 to-transparent" />
              <div className={`absolute inset-x-0 bottom-0 p-5 ${isRTL ? "text-right" : "text-left"}`}>
                <p className="text-xs font-semibold tracking-[0.18em] text-white/80">
                  {productPhotoTag(language)}
                </p>
                <p className="mt-1 text-2xl font-semibold leading-tight text-white">
                  {selectedProduct.displayName}
                </p>
                <p className="mt-1 text-sm text-blue-100">{selectedProduct.localizedCategory}</p>
              </div>
              <button
                type="button"
                onClick={() => setSelectedProduct(null)}
                className={`absolute top-3 inline-flex h-9 w-9 items-center justify-center rounded-full bg-black/40 text-white hover:bg-black/60 ${
                  isRTL ? "left-3" : "right-3"
                }`}
                aria-label={ui.close}
              >
                <X className="h-4 w-4" />
              </button>
            </div>

            <div className="space-y-5 p-6">
              <div className="flex flex-wrap items-center justify-between gap-3">
                <div>
                  <h2 className="text-2xl font-semibold">{selectedProduct.displayName}</h2>
                  <p className={isDark ? "text-gray-400" : "text-gray-600"}>
                    {selectedProduct.localizedCategory}
                  </p>
                </div>

                {selectedProduct.isRecommended && (
                  <span className="inline-flex items-center gap-1 rounded-full bg-amber-100 px-3 py-1 text-xs text-amber-700">
                    <Star className="h-3.5 w-3.5" />
                    {ui.recommended}
                  </span>
                )}
              </div>

              <p className={isDark ? "text-gray-300" : "text-gray-700"}>{selectedProduct.displayDescription}</p>

              {selectedProduct.isRecommended && (
                <div className={`rounded-xl border p-4 ${isDark ? "border-amber-800 bg-amber-900/15" : "border-amber-200 bg-amber-50"}`}>
                  <h3 className="mb-2 text-sm font-semibold">{ui.recommendationTitle}</h3>
                  <p className="text-sm">{selectedProduct.recommendationReason || ui.recommendationFallback}</p>
                </div>
              )}

              <div className="grid gap-4 md:grid-cols-2">
                <div className={`rounded-xl border p-4 ${isDark ? "border-gray-700 bg-gray-800" : "border-gray-200 bg-gray-50"}`}>
                  <h3 className="mb-2 text-sm font-semibold">{ui.featuresTitle}</h3>
                  <ul className={`list-disc space-y-1.5 text-sm ${isRTL ? "pr-5" : "pl-5"}`}>
                    {(selectedProduct.displayFeatures || []).slice(0, 6).map((feature) => (
                      <li key={feature}>{feature}</li>
                    ))}
                  </ul>
                </div>

                <div className={`rounded-xl border p-4 ${isDark ? "border-gray-700 bg-gray-800" : "border-gray-200 bg-gray-50"}`}>
                  <h3 className="mb-2 text-sm font-semibold">{ui.detailsTitle}</h3>
                  <ul className={`list-disc space-y-1.5 text-sm ${isRTL ? "pr-5" : "pl-5"}`}>
                    {(selectedProduct.displayDetails || []).slice(0, 6).map((detail) => (
                      <li key={detail}>{detail}</li>
                    ))}
                  </ul>
                </div>
              </div>

              <div className={`flex ${isRTL ? "justify-start" : "justify-end"}`}>
                <button
                  type="button"
                  onClick={() => setSelectedProduct(null)}
                  className={`rounded-lg px-4 py-2 text-sm ${
                    isDark ? "bg-gray-800 hover:bg-gray-700" : "bg-gray-100 hover:bg-gray-200"
                  }`}
                >
                  {ui.close}
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
