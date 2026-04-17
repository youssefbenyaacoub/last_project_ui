import { createContext, useContext, useState, useEffect } from "react";

const LanguageContext = createContext();

const translations = {
  en: {
    // Navigation
    dashboard: "Dashboard",
    chatbot: "Chatbot",
    products: "Products",
    comparator: "Comparator",
    simulator: "Simulator",
    budget: "Budget",
    objectives: "Objectives",
    profile: "My Profile",
    claims: "Claims",
    settings: "Settings",
    logout: "Logout",

    // Common
    welcome: "Welcome",
    hello: "Hello",
    viewAll: "View All",
    save: "Save",
    cancel: "Cancel",
    submit: "Submit",
    search: "Search",
    filter: "Filter",
    loading: "Loading...",

    // Dashboard
    totalBalance: "Total Balance",
    income: "Income",
    expenses: "Expenses",
    lastTransactions: "Last Transactions",
    monthlySpending: "Monthly Spending",
    paymentLimit: "Payment Limit",
    topCategories: "Top Categories",

    // Profile
    personalInfo: "Personal Information",
    firstName: "First Name",
    lastName: "Last Name",
    email: "Email Address",
    phone: "Phone Number",
    address: "Address",
    city: "City",
    zipCode: "Zip Code",
    country: "Country",

    // Auth
    login: "Login",
    signIn: "Sign In",
    signUp: "Sign Up",
    password: "Password",
    forgotPassword: "Forgot Password?",
    rememberMe: "Remember Me",

    // Theme
    lightMode: "Light",
    darkMode: "Dark",

    // Landing Page
    accessYourSpace: "Access your space",
    heroHeadline: "Simple banking, built around you.",
    heroSubtitle:
      "Understand your activity and make better financial decisions.",
    featureActivityTitle: "Clear overview of activity",
    featureActivityDesc: "Track all your transactions and balances in one place.",
    featureInsightsTitle: "Personalized insights",
    featureInsightsDesc: "Receive tailored advice based on your spending habits.",
    featureSecureTitle: "Secure access",
    featureSecureDesc: "Your data is protected with bank-level encryption.",

    // Carousel
    carouselTitle1: "Clear financial overview",
    carouselSubtitle1: "Understand your income and expenses",
    carouselDesc1: "Stable this month",
    carouselLabel1: "1.",
    carouselTitle2: "Personalized insights",
    carouselSubtitle2: "Based on your financial behavior",
    carouselDesc2: "Higher spending detected",
    carouselLabel2: "2.",
    carouselTitle3: "Smart guidance",
    carouselSubtitle3: "Make better daily decisions",
    carouselDesc3: "Save up to 200 TND/month",
    carouselLabel3: "3.",

    // Trust
    trustedBy: "Trusted by thousands of customers",
    activeUsers: "Active users",
    transactionsProcessed: "Transactions processed",
    uptime: "Uptime",

    // Footer
    footerContact: "Contact",
    footerContactDesc: "Need help? Reach us anytime.",
    footerContactEmail: "support@bhbank.tn",
    footerContactPhone: "+216 71 126 000",
    footerHelp: "Help",
    footerHelpDesc: "Find answers to your questions.",
    footerFAQ: "FAQ",
    footerGuides: "User Guides",
    footerSupport: "Support Center",
    footerLegal: "Legal",
    footerLegalDesc: "Your rights and our commitments.",
    footerPrivacy: "Privacy Policy",
    footerTerms: "Terms of Service",
    footerSecurity: "Security",
    footerRights: "© 2026 BH Bank. All rights reserved.",
  },
  fr: {
    // Navigation
    dashboard: "Tableau de bord",
    chatbot: "Chatbot",
    products: "Produits",
    comparator: "Comparateur",
    simulator: "Simulateur",
    budget: "Budget",
    objectives: "Objectifs",
    profile: "Mon Profil",
    claims: "Réclamations",
    settings: "Paramètres",
    logout: "Déconnexion",

    // Common
    welcome: "Bienvenue",
    hello: "Bonjour",
    viewAll: "Voir tout",
    save: "Enregistrer",
    cancel: "Annuler",
    submit: "Soumettre",
    search: "Rechercher",
    filter: "Filtrer",
    loading: "Chargement...",

    // Dashboard
    totalBalance: "Solde total",
    income: "Revenus",
    expenses: "Dépenses",
    lastTransactions: "Dernières transactions",
    monthlySpending: "Dépenses mensuelles",
    paymentLimit: "Limite de paiement",
    topCategories: "Principales catégories",

    // Profile
    personalInfo: "Informations personnelles",
    firstName: "Prénom",
    lastName: "Nom",
    email: "Adresse e-mail",
    phone: "Numéro de téléphone",
    address: "Adresse",
    city: "Ville",
    zipCode: "Code postal",
    country: "Pays",

    // Auth
    login: "Connexion",
    signIn: "S'inscrire",
    signUp: "Créer un compte",
    password: "Mot de passe",
    forgotPassword: "Mot de passe oublié?",
    rememberMe: "Se souvenir de moi",

    // Theme
    lightMode: "Clair",
    darkMode: "Sombre",

    // Landing Page
    accessYourSpace: "Accéder à votre espace",
    heroHeadline: "La banque simple, pensée pour vous.",
    heroSubtitle:
      "Comprenez votre activité et prenez de meilleures décisions financières.",
    featureActivityTitle: "Vue claire de votre activité",
    featureActivityDesc: "Suivez toutes vos transactions et soldes en un seul endroit.",
    featureInsightsTitle: "Conseils personnalisés",
    featureInsightsDesc: "Recevez des conseils adaptés à vos habitudes de dépenses.",
    featureSecureTitle: "Accès sécurisé",
    featureSecureDesc: "Vos données sont protégées par un chiffrement bancaire.",

    // Carousel
    carouselTitle1: "Vue financiere claire",
    carouselSubtitle1: "Comprenez vos revenus et vos depenses",
    carouselDesc1: "Stable ce mois-ci",
    carouselLabel1: "1.",
    carouselTitle2: "Analyses personnalisees",
    carouselSubtitle2: "Basees sur votre comportement financier",
    carouselDesc2: "Hausse des depenses detectee",
    carouselLabel2: "2.",
    carouselTitle3: "Guidage intelligent",
    carouselSubtitle3: "Prenez de meilleures decisions au quotidien",
    carouselDesc3: "Economisez jusqu'a 200 TND/mois",
    carouselLabel3: "3.",

    // Trust
    trustedBy: "La confiance de milliers de clients",
    activeUsers: "Utilisateurs actifs",
    transactionsProcessed: "Transactions traitées",
    uptime: "Disponibilité",

    // Footer
    footerContact: "Contact",
    footerContactDesc: "Besoin d'aide ? Contactez-nous à tout moment.",
    footerContactEmail: "support@bhbank.tn",
    footerContactPhone: "+216 71 126 000",
    footerHelp: "Aide",
    footerHelpDesc: "Trouvez les réponses à vos questions.",
    footerFAQ: "FAQ",
    footerGuides: "Guides d'utilisation",
    footerSupport: "Centre d'assistance",
    footerLegal: "Mentions légales",
    footerLegalDesc: "Vos droits et nos engagements.",
    footerPrivacy: "Politique de confidentialité",
    footerTerms: "Conditions d'utilisation",
    footerSecurity: "Sécurité",
    footerRights: "© 2026 BH Bank. Tous droits réservés.",
  },
  ar: {
    // Navigation
    dashboard: "لوحة التحكم",
    chatbot: "المساعد الذكي",
    products: "المنتجات",
    comparator: "المقارن",
    simulator: "المحاكي",
    budget: "الميزانية",
    objectives: "الأهداف",
    profile: "ملفي الشخصي",
    claims: "الشكاوى",
    settings: "الإعدادات",
    logout: "تسجيل الخروج",

    // Common
    welcome: "مرحباً",
    hello: "أهلاً",
    viewAll: "عرض الكل",
    save: "حفظ",
    cancel: "إلغاء",
    submit: "إرسال",
    search: "بحث",
    filter: "تصفية",
    loading: "جاري التحميل...",

    // Dashboard
    totalBalance: "الرصيد الإجمالي",
    income: "الدخل",
    expenses: "المصاريف",
    lastTransactions: "آخر المعاملات",
    monthlySpending: "الإنفاق الشهري",
    paymentLimit: "حد الدفع",
    topCategories: "أهم الفئات",

    // Profile
    personalInfo: "المعلومات الشخصية",
    firstName: "الاسم الأول",
    lastName: "اسم العائلة",
    email: "البريد الإلكتروني",
    phone: "رقم الهاتف",
    address: "العنوان",
    city: "المدينة",
    zipCode: "الرمز البريدي",
    country: "البلد",

    // Auth
    login: "تسجيل الدخول",
    signIn: "تسجيل",
    signUp: "إنشاء حساب",
    password: "كلمة المرور",
    forgotPassword: "نسيت كلمة المرور؟",
    rememberMe: "تذكرني",

    // Theme
    lightMode: "فاتح",
    darkMode: "داكن",

    // Landing Page
    accessYourSpace: "الوصول إلى حسابك",
    heroHeadline: "خدمات مصرفية بسيطة، مصممة من أجلك.",
    heroSubtitle: "افهم نشاطك المالي واتخذ قرارات مالية أفضل.",
    featureActivityTitle: "نظرة واضحة على نشاطك",
    featureActivityDesc: "تابع جميع معاملاتك وأرصدتك في مكان واحد.",
    featureInsightsTitle: "نصائح مخصصة لك",
    featureInsightsDesc: "احصل على نصائح مخصصة بناءً على عادات الإنفاق الخاصة بك.",
    featureSecureTitle: "وصول آمن",
    featureSecureDesc: "بياناتك محمية بتشفير بنكي عالي المستوى.",

    // Carousel
    carouselTitle1: "نظرة مالية واضحة",
    carouselSubtitle1: "افهم دخلك ومصاريفك",
    carouselDesc1: "مستقر هذا الشهر",
    carouselLabel1: "١.",
    carouselTitle2: "رؤى مخصصة",
    carouselSubtitle2: "بناءً على سلوكك المالي",
    carouselDesc2: "تم اكتشاف ارتفاع في الإنفاق",
    carouselLabel2: "٢.",
    carouselTitle3: "إرشاد ذكي",
    carouselSubtitle3: "اتخذ قرارات يومية أفضل",
    carouselDesc3: "وفّر حتى 200 د.ت شهريًا",
    carouselLabel3: "٣.",

    // Trust
    trustedBy: "موثوق من آلاف العملاء",
    activeUsers: "مستخدم نشط",
    transactionsProcessed: "معاملة تمت معالجتها",
    uptime: "وقت التشغيل",

    // Footer
    footerContact: "اتصل بنا",
    footerContactDesc: "تحتاج مساعدة؟ تواصل معنا في أي وقت.",
    footerContactEmail: "support@bhbank.tn",
    footerContactPhone: "+216 71 126 000",
    footerHelp: "المساعدة",
    footerHelpDesc: "ابحث عن إجابات لأسئلتك.",
    footerFAQ: "الأسئلة الشائعة",
    footerGuides: "أدلة الاستخدام",
    footerSupport: "مركز الدعم",
    footerLegal: "الشروط القانونية",
    footerLegalDesc: "حقوقك والتزاماتنا.",
    footerPrivacy: "سياسة الخصوصية",
    footerTerms: "شروط الخدمة",
    footerSecurity: "الأمان",
    footerRights: "© 2026 BH Bank. جميع الحقوق محفوظة.",
  },
};

export function LanguageProvider({ children }) {
  const [language, setLanguageState] = useState(() => {
    return localStorage.getItem("language") || "en";
  });

  const isRTL = language === "ar";

  useEffect(() => {
    localStorage.setItem("language", language);
    document.documentElement.setAttribute("dir", isRTL ? "rtl" : "ltr");
    document.documentElement.setAttribute("lang", language);
  }, [language, isRTL]);

  const setLanguage = (lang) => {
    setLanguageState(lang);
  };

  // Keep legacy toggleLanguage for backward compat with other pages
  const toggleLanguage = () => {
    const langs = ["en", "fr", "ar"];
    const currentIdx = langs.indexOf(language);
    const nextIdx = (currentIdx + 1) % langs.length;
    setLanguageState(langs[nextIdx]);
  };

  const t = (key) => {
    return (translations[language] && translations[language][key]) || key;
  };

  return (
    <LanguageContext.Provider
      value={{ language, setLanguage, toggleLanguage, t, isRTL }}
    >
      {children}
    </LanguageContext.Provider>
  );
}

// eslint-disable-next-line react-refresh/only-export-components
export function useLanguage() {
  const context = useContext(LanguageContext);
  if (!context) {
    throw new Error("useLanguage must be used within LanguageProvider");
  }
  return context;
}
