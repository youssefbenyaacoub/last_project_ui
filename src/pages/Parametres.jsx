import { useEffect, useMemo, useState } from "react";
import {
  Bot,
  Bell,
  Globe,
  HelpCircle,
  Lock,
  MessageCircle,
  Phone,
  RotateCcw,
  Shield,
  Smartphone,
  Sun,
} from "lucide-react";
import { useTheme } from "../contexts/ThemeContext";
import { useLanguage } from "../contexts/LanguageContext";
import { useUserPreferences } from "../contexts/UserPreferencesContext";
import { getMe } from "../api";
import flagAr from "../assets/flags/Flag_of_Tunisia.svg.webp";
import flagEn from "../assets/flags/Flag_of_the_United_Kingdom_(3-5).svg.webp";
import flagFr from "../assets/flags/Flag_of_France.svg.png";

const SETTINGS_STORAGE_KEY = "bh_dashboard_settings";

const defaultSettings = {
  security: {
    twoFactor: true,
    biometric: false,
    loginAlerts: true,
  },
  privacy: {
    shareData: false,
    analytics: true,
  },
  accessibility: {
    lowVision: false,
  },
};

const normalizeSettings = (value = {}) => ({
  security: {
    ...defaultSettings.security,
    ...(value.security || {}),
  },
  privacy: {
    ...defaultSettings.privacy,
    ...(value.privacy || {}),
  },
  accessibility: {
    ...defaultSettings.accessibility,
    ...(value.accessibility || {}),
  },
});

const uiByLanguage = {
  en: {
    title: "Settings",
    subtitle: "Manage preferences, privacy and account security",
    activePrefs: "active preferences",
    appearance: {
      title: "Appearance",
      theme: "Theme",
      darkEnabled: "Dark mode enabled",
      lightEnabled: "Light mode enabled",
      language: "Language",
      languageSubtitle: "Choose the interface language",
    },
    actions: {
      reset: "Reset to defaults",
      changePassword: "Change password",
      contactSupport: "Contact support",
    },
    sections: {
      notifications: "Notifications",
      security: "Security",
      privacy: "Privacy",
      accessibility: "Accessibility",
      chatbot: "Chatbot personalization",
      support: "Support",
      account: "Account Information",
      quickHelp: "Need help?",
    },
    accessibility: {
      lowVision: "Low-vision mode",
      lowVisionDesc: "Increase text size and contrast for clearer reading.",
    },
    chatbot: {
      nameLabel: "Chatbot name",
      toneLabel: "Chatbot style",
      userGenderLabel: "User profile",
      colorsLabel: "Discussion colors",
      female: "Female",
      male: "Male",
      userFemale: "Female user",
      userMale: "Male user",
    },
    notifications: {
      email: "Email notifications",
      push: "Push notifications",
      sms: "SMS notifications",
      transactions: "Transaction alerts",
      marketing: "Promotional offers",
    },
    security: {
      twoFactor: "Two-factor authentication",
      biometric: "Biometric login",
      loginAlerts: "Login alerts",
    },
    privacy: {
      shareData: "Share data with trusted partners",
      analytics: "Allow usage analytics",
    },
    support: {
      helpCenter: "Help Center",
      helpCenterDesc: "FAQ and detailed guides",
      liveChat: "Live Chat",
      liveChatDesc: "Available 24/7",
      phoneSupport: "Phone Support",
      quickHelpText:
        "Our support team is available to answer your questions and resolve incidents quickly.",
    },
    account: {
      accountNumber: "Account number",
      openingDate: "Opening date",
      status: "Status",
      statusActive: "Active",
      statusPending: "Pending verification",
      unknown: "Unknown",
      openingDateValue: "January 15, 2024",
    },
    feedback: {
      updated: "Preference updated.",
      reset: "Settings restored to defaults.",
    },
  },
  fr: {
    title: "Parametres",
    subtitle: "Gerez vos preferences, votre confidentialite et votre securite",
    activePrefs: "preferences actives",
    appearance: {
      title: "Apparence",
      theme: "Theme",
      darkEnabled: "Mode sombre active",
      lightEnabled: "Mode clair active",
      language: "Langue",
      languageSubtitle: "Choisissez la langue de l'interface",
    },
    actions: {
      reset: "Reinitialiser par defaut",
      changePassword: "Changer le mot de passe",
      contactSupport: "Contacter le support",
    },
    sections: {
      notifications: "Notifications",
      security: "Securite",
      privacy: "Confidentialite",
      accessibility: "Accessibilite",
      chatbot: "Personnalisation chatbot",
      support: "Support",
      account: "Informations du compte",
      quickHelp: "Besoin d'aide ?",
    },
    accessibility: {
      lowVision: "Mode basse vision",
      lowVisionDesc: "Augmente la taille du texte et le contraste pour une lecture plus claire.",
    },
    chatbot: {
      nameLabel: "Nom du chatbot",
      toneLabel: "Style du chatbot",
      userGenderLabel: "Profil utilisateur",
      colorsLabel: "Couleurs de discussion",
      female: "Feminin",
      male: "Masculin",
      userFemale: "Utilisatrice",
      userMale: "Utilisateur homme",
    },
    notifications: {
      email: "Notifications par e-mail",
      push: "Notifications push",
      sms: "Notifications SMS",
      transactions: "Alertes de transactions",
      marketing: "Offres promotionnelles",
    },
    security: {
      twoFactor: "Authentification a deux facteurs",
      biometric: "Connexion biometrique",
      loginAlerts: "Alertes de connexion",
    },
    privacy: {
      shareData: "Partager les donnees avec des partenaires de confiance",
      analytics: "Autoriser les analyses d'utilisation",
    },
    support: {
      helpCenter: "Centre d'aide",
      helpCenterDesc: "FAQ et guides detailles",
      liveChat: "Chat en direct",
      liveChatDesc: "Disponible 24/7",
      phoneSupport: "Support telephonique",
      quickHelpText:
        "Notre equipe support est disponible pour repondre a vos questions et traiter rapidement vos incidents.",
    },
    account: {
      accountNumber: "Numero de compte",
      openingDate: "Date d'ouverture",
      status: "Statut",
      statusActive: "Actif",
      statusPending: "En attente de verification",
      unknown: "Inconnu",
      openingDateValue: "15 janvier 2024",
    },
    feedback: {
      updated: "Preference mise a jour.",
      reset: "Parametres reinitialises par defaut.",
    },
  },
  ar: {
    title: "الاعدادات",
    subtitle: "ادارة التفضيلات والخصوصية وامان الحساب",
    activePrefs: "تفضيلات مفعلة",
    appearance: {
      title: "المظهر",
      theme: "السمة",
      darkEnabled: "تم تفعيل الوضع الداكن",
      lightEnabled: "تم تفعيل الوضع الفاتح",
      language: "اللغة",
      languageSubtitle: "اختر لغة واجهة الاستخدام",
    },
    actions: {
      reset: "اعادة الضبط الافتراضي",
      changePassword: "تغيير كلمة المرور",
      contactSupport: "اتصل بالدعم",
    },
    sections: {
      notifications: "الاشعارات",
      security: "الامان",
      privacy: "الخصوصية",
      accessibility: "امكانية الوصول",
      chatbot: "تخصيص المساعد",
      support: "الدعم",
      account: "معلومات الحساب",
      quickHelp: "هل تحتاج مساعدة؟",
    },
    accessibility: {
      lowVision: "وضع ضعف البصر",
      lowVisionDesc: "يزيد حجم الخط والتباين لقراءة اوضح.",
    },
    chatbot: {
      nameLabel: "اسم المساعد",
      toneLabel: "اسلوب المساعد",
      userGenderLabel: "ملف المستخدم",
      colorsLabel: "الوان المحادثة",
      female: "انثى",
      male: "ذكر",
      userFemale: "مستخدمة",
      userMale: "مستخدم ذكر",
    },
    notifications: {
      email: "اشعارات البريد الالكتروني",
      push: "الاشعارات الفورية",
      sms: "اشعارات الرسائل القصيرة",
      transactions: "تنبيهات المعاملات",
      marketing: "العروض الترويجية",
    },
    security: {
      twoFactor: "المصادقة الثنائية",
      biometric: "تسجيل الدخول البيومتري",
      loginAlerts: "تنبيهات تسجيل الدخول",
    },
    privacy: {
      shareData: "مشاركة البيانات مع شركاء موثوقين",
      analytics: "السماح بتحليلات الاستخدام",
    },
    support: {
      helpCenter: "مركز المساعدة",
      helpCenterDesc: "الاسئلة الشائعة والارشادات",
      liveChat: "دردشة مباشرة",
      liveChatDesc: "متاح 24/7",
      phoneSupport: "دعم هاتفي",
      quickHelpText:
        "فريق الدعم متاح للاجابة عن اسئلتك ومعالجة المشكلات بسرعة.",
    },
    account: {
      accountNumber: "رقم الحساب",
      openingDate: "تاريخ فتح الحساب",
      status: "الحالة",
      statusActive: "نشط",
      statusPending: "قيد التحقق",
      unknown: "غير متوفر",
      openingDateValue: "15 جانفي 2024",
    },
    feedback: {
      updated: "تم تحديث التفضيل.",
      reset: "تمت اعادة الاعدادات الافتراضية.",
    },
  },
};

const languageOptions = [
  {
    key: "en",
    short: "EN",
    label: "English",
    flag: flagEn,
    flagAlt: "United Kingdom flag",
  },
  {
    key: "fr",
    short: "FR",
    label: "Francais",
    flag: flagFr,
    flagAlt: "France flag",
  },
  {
    key: "ar",
    short: "AR",
    label: "العربية",
    flag: flagAr,
    flagAlt: "Tunisia flag",
  },
];

const securityItems = [
  { key: "twoFactor", icon: Lock },
  { key: "biometric", icon: Smartphone },
  { key: "loginAlerts", icon: Bell },
];

const privacyItems = [
  { key: "shareData" },
  { key: "analytics" },
];

const getLangKey = (language) => {
  if (language === "ar") {
    return "ar";
  }
  if (language === "fr") {
    return "fr";
  }
  return "en";
};

export function Parametres() {
  const { theme } = useTheme();
  const { language, setLanguage, isRTL } = useLanguage();
  const {
    chatbotName,
    userGender,
    setChatbotName,
    setUserGender,
    resetUserPreferences,
  } = useUserPreferences();

  const langKey = getLangKey(language);
  const ui = uiByLanguage[langKey] || uiByLanguage.en;

  const [settings, setSettings] = useState(() => {
    try {
      const raw = localStorage.getItem(SETTINGS_STORAGE_KEY);
      if (!raw) return defaultSettings;
      return normalizeSettings(JSON.parse(raw));
    } catch {
      return defaultSettings;
    }
  });
  const [profile, setProfile] = useState(null);
  const [feedback, setFeedback] = useState("");

  useEffect(() => {
    let isMounted = true;

    const loadProfile = async () => {
      try {
        const payload = await getMe();
        if (!isMounted) return;
        setProfile(payload || null);
      } catch {
        if (!isMounted) return;
        setProfile(null);
      }
    };

    loadProfile();

    return () => {
      isMounted = false;
    };
  }, []);

  useEffect(() => {
    localStorage.setItem(SETTINGS_STORAGE_KEY, JSON.stringify(settings));
  }, [settings]);

  useEffect(() => {
    document.documentElement.classList.toggle(
      "low-vision-mode",
      Boolean(settings?.accessibility?.lowVision),
    );
  }, [settings?.accessibility?.lowVision]);

  const enabledCount = useMemo(() => {
    return Object.values(settings).reduce((sum, section) => {
      return sum + Object.values(section).filter(Boolean).length;
    }, 0);
  }, [settings]);

  const totalCount = useMemo(() => {
    return Object.values(settings).reduce((sum, section) => {
      return sum + Object.keys(section).length;
    }, 0);
  }, [settings]);

  const openingDateLabel = useMemo(() => {
    if (!profile?.created_at) return ui.account.unknown;

    const parsed = new Date(profile.created_at);
    if (Number.isNaN(parsed.getTime())) return ui.account.unknown;

    const locale =
      language === "ar" ? "ar-TN" : language === "fr" ? "fr-FR" : "en-US";
    return new Intl.DateTimeFormat(locale, {
      year: "numeric",
      month: "long",
      day: "numeric",
    }).format(parsed);
  }, [profile?.created_at, language, ui.account.unknown]);

  const accountNumberLabel = profile?.client_id
    ? `BH-${String(profile.client_id).trim()}`
    : "BH-2026-001234";
  const accountStatusLabel =
    profile?.email_verified || profile?.is_verified
      ? ui.account.statusActive
      : ui.account.statusPending;
  const accountStatusClass =
    profile?.email_verified || profile?.is_verified
      ? theme === "dark"
        ? "bg-green-900/30 text-green-400"
        : "bg-green-100 text-green-700"
      : theme === "dark"
        ? "bg-amber-900/30 text-amber-300"
        : "bg-amber-100 text-amber-700";

  const getTrackClass = (enabled) => {
    return `relative inline-flex h-6 w-11 items-center rounded-full transition-colors ${
      enabled ? "bg-blue-600" : "bg-gray-300"
    }`;
  };

  const getThumbClass = (enabled) => {
    const transformClass = isRTL
      ? enabled
        ? "translate-x-1"
        : "translate-x-6"
      : enabled
        ? "translate-x-6"
        : "translate-x-1";

    return `inline-block h-4 w-4 transform rounded-full bg-white transition-transform ${transformClass}`;
  };

  const toggleSetting = (category, key) => {
    setSettings((prev) => ({
      ...prev,
      [category]: {
        ...prev[category],
        [key]: !prev[category][key],
      },
    }));
    setFeedback(ui.feedback.updated);
  };

  const resetSettings = () => {
    setSettings(defaultSettings);
    resetUserPreferences();
    setFeedback(ui.feedback.reset);
  };

  const containerBgClass = theme === "dark" ? "bg-gray-900" : "bg-gray-50";
  const cardClass =
    theme === "dark"
      ? "bg-gray-800 border-gray-700"
      : "bg-white border-gray-200";
  const softCardClass =
    theme === "dark" ? "bg-gray-700" : "bg-gray-100";
  const rowCardClass =
    theme === "dark"
      ? "bg-gray-700 hover:bg-gray-600"
      : "bg-gray-50 hover:bg-gray-100";
  const textMainClass = theme === "dark" ? "text-white" : "text-gray-900";
  const textMutedClass = theme === "dark" ? "text-gray-400" : "text-gray-600";

  return (
    <div className={`p-4 lg:p-8 space-y-6 ${containerBgClass}`}>
      <div
        className={`flex flex-col gap-4 md:items-center md:justify-between ${
          isRTL ? "md:flex-row-reverse" : "md:flex-row"
        }`}
      >
        <div className={isRTL ? "text-right" : "text-left"}>
          <h1 className={`text-2xl font-semibold mb-2 ${textMainClass}`}>
            {ui.title}
          </h1>
          <p className={textMutedClass}>{ui.subtitle}</p>
        </div>

        <div
          className={`inline-flex items-center gap-3 px-4 py-2 rounded-xl border ${
            theme === "dark"
              ? "bg-gray-800 border-gray-700"
              : "bg-white border-gray-200"
          } ${isRTL ? "flex-row-reverse" : ""}`}
        >
          <Shield className="w-5 h-5 text-blue-600" />
          <div className={isRTL ? "text-right" : "text-left"}>
            <p className={`text-sm font-medium ${textMainClass}`}>
              {enabledCount}/{totalCount} {ui.activePrefs}
            </p>
          </div>
        </div>
      </div>

      {feedback && (
        <div
          className={`px-4 py-3 rounded-lg border ${
            theme === "dark"
              ? "bg-blue-900/20 border-blue-800 text-blue-300"
              : "bg-blue-50 border-blue-200 text-blue-700"
          } ${isRTL ? "text-right" : "text-left"}`}
        >
          {feedback}
        </div>
      )}

      <div className="grid lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2 space-y-6">
          <div className={`${cardClass} border rounded-xl p-6 space-y-5`}>
            <div
              className={`flex items-center justify-between ${
                isRTL ? "flex-row-reverse" : ""
              }`}
            >
              <h2 className={`text-lg font-semibold ${textMainClass}`}>
                {ui.appearance.title}
              </h2>
              <button
                type="button"
                onClick={resetSettings}
                className={`inline-flex items-center gap-2 px-3 py-2 rounded-lg text-sm transition-colors ${
                  theme === "dark"
                    ? "bg-gray-700 text-gray-200 hover:bg-gray-600"
                    : "bg-gray-100 text-gray-700 hover:bg-gray-200"
                } ${isRTL ? "flex-row-reverse" : ""}`}
              >
                <RotateCcw className="w-4 h-4" />
                {ui.actions.reset}
              </button>
            </div>

            <div
              className={`flex items-center justify-between ${
                isRTL ? "flex-row-reverse" : ""
              }`}
            >
              <div
                className={`flex items-center gap-3 ${
                  isRTL ? "flex-row-reverse" : ""
                }`}
              >
                <div
                  className={`w-10 h-10 rounded-lg flex items-center justify-center ${softCardClass}`}
                >
                  <Sun className="w-5 h-5 text-amber-500" />
                </div>
                <div className={isRTL ? "text-right" : "text-left"}>
                  <p className={`font-medium ${textMainClass}`}>{ui.appearance.theme}</p>
                  <p className={`text-sm ${textMutedClass}`}>{ui.appearance.lightEnabled}</p>
                </div>
              </div>
            </div>

            <div
              className={`flex flex-col gap-3 md:items-center md:justify-between ${
                isRTL ? "md:flex-row-reverse" : "md:flex-row"
              }`}
            >
              <div
                className={`flex items-center gap-3 ${
                  isRTL ? "flex-row-reverse" : ""
                }`}
              >
                <div
                  className={`w-10 h-10 rounded-lg flex items-center justify-center ${softCardClass}`}
                >
                  <Globe className="w-5 h-5 text-cyan-600" />
                </div>
                <div className={isRTL ? "text-right" : "text-left"}>
                  <p className={`font-medium ${textMainClass}`}>
                    {ui.appearance.language}
                  </p>
                  <p className={`text-sm ${textMutedClass}`}>
                    {ui.appearance.languageSubtitle}
                  </p>
                </div>
              </div>

              <div
                className={`flex items-center gap-2 ${
                  isRTL ? "justify-end" : "justify-start"
                }`}
              >
                {languageOptions.map((option) => (
                  <button
                    key={option.key}
                    type="button"
                    onClick={() => setLanguage(option.key)}
                    className={`inline-flex items-center gap-1.5 px-3 py-2 rounded-lg text-sm font-medium border transition-colors ${
                      language === option.key
                        ? "bg-[#242f54] border-[#242f54] text-white"
                        : theme === "dark"
                          ? "bg-gray-700 border-gray-600 text-gray-200 hover:bg-gray-600"
                          : "bg-gray-50 border-gray-300 text-gray-700 hover:bg-gray-100"
                    }`}
                  >
                    <img
                      src={option.flag}
                      alt={option.flagAlt}
                      className={`h-3.5 w-5 rounded-xs object-cover ${
                        language === option.key ? "ring-1 ring-white/80" : ""
                      }`}
                    />
                    <span>{option.short}</span>
                    <span>{option.label}</span>
                  </button>
                ))}
              </div>
            </div>
          </div>

          <div className={`${cardClass} border rounded-xl p-6 space-y-4`}>
            <div
              className={`flex items-center gap-3 ${
                isRTL ? "flex-row-reverse" : ""
              }`}
            >
              <div
                className={`w-10 h-10 rounded-lg flex items-center justify-center ${softCardClass}`}
              >
                <Bot className="w-5 h-5 text-cyan-600" />
              </div>
              <h2 className={`text-lg font-semibold ${textMainClass}`}>
                {ui.sections.chatbot}
              </h2>
            </div>

            <label className="space-y-1 block">
              <span className={`text-sm ${textMutedClass}`}>{ui.chatbot.nameLabel}</span>
              <input
                value={chatbotName}
                onChange={(event) => {
                  setChatbotName(event.target.value);
                  setFeedback(ui.feedback.updated);
                }}
                className={`w-full rounded-lg border px-3 py-2 text-sm outline-none ${
                  theme === "dark"
                    ? "border-gray-600 bg-gray-700 text-white"
                    : "border-gray-300 bg-white text-gray-900"
                }`}
              />
            </label>

            <div className="grid gap-3 md:grid-cols-1">
              <label className="space-y-1 block">
                <span className={`text-sm ${textMutedClass}`}>{ui.chatbot.userGenderLabel}</span>
                <select
                  value={userGender}
                  onChange={(event) => {
                    setUserGender(event.target.value);
                    setFeedback(ui.feedback.updated);
                  }}
                  className={`w-full rounded-lg border px-3 py-2 text-sm outline-none ${
                    theme === "dark"
                      ? "border-gray-600 bg-gray-700 text-white"
                      : "border-gray-300 bg-white text-gray-900"
                  }`}
                >
                  <option value="female">{ui.chatbot.userFemale}</option>
                  <option value="male">{ui.chatbot.userMale}</option>
                </select>
              </label>
            </div>
          </div>

          <div className={`${cardClass} border rounded-xl p-6`}>
            <div
              className={`flex items-center gap-3 mb-4 ${
                isRTL ? "flex-row-reverse" : ""
              }`}
            >
              <div
                className={`w-10 h-10 rounded-lg flex items-center justify-center ${softCardClass}`}
              >
                <Shield className="w-5 h-5 text-emerald-500" />
              </div>
              <h2 className={`text-lg font-semibold ${textMainClass}`}>
                {ui.sections.security}
              </h2>
            </div>

            <div className="space-y-4">
              {securityItems.map((item) => {
                const Icon = item.icon;
                const enabled = settings.security[item.key];

                return (
                  <div
                    key={item.key}
                    className={`flex items-center justify-between ${
                      isRTL ? "flex-row-reverse" : ""
                    }`}
                  >
                    <div
                      className={`flex items-center gap-3 ${
                        isRTL ? "flex-row-reverse" : ""
                      }`}
                    >
                      <Icon className={`w-5 h-5 ${textMutedClass}`} />
                      <span className={theme === "dark" ? "text-gray-300" : "text-gray-700"}>
                        {ui.security[item.key]}
                      </span>
                    </div>
                    <button
                      type="button"
                      aria-label={ui.security[item.key]}
                      onClick={() => toggleSetting("security", item.key)}
                      className={getTrackClass(enabled)}
                    >
                      <span className={getThumbClass(enabled)} />
                    </button>
                  </div>
                );
              })}

              <div className="pt-4 border-t border-gray-200">
                <button
                  type="button"
                  className={`w-full py-3 rounded-lg font-medium transition-colors ${
                    theme === "dark"
                      ? "bg-gray-700 text-white hover:bg-gray-600"
                      : "bg-gray-100 text-gray-900 hover:bg-gray-200"
                  }`}
                >
                  {ui.actions.changePassword}
                </button>
              </div>
            </div>
          </div>

          <div className={`${cardClass} border rounded-xl p-6`}>
            <div
              className={`flex items-center gap-3 mb-4 ${
                isRTL ? "flex-row-reverse" : ""
              }`}
            >
              <div
                className={`w-10 h-10 rounded-lg flex items-center justify-center ${softCardClass}`}
              >
                <Lock className="w-5 h-5 text-violet-500" />
              </div>
              <h2 className={`text-lg font-semibold ${textMainClass}`}>
                {ui.sections.privacy}
              </h2>
            </div>

            <div className="space-y-4">
              {privacyItems.map((item) => {
                const enabled = settings.privacy[item.key];

                return (
                  <div
                    key={item.key}
                    className={`flex items-center justify-between ${
                      isRTL ? "flex-row-reverse" : ""
                    }`}
                  >
                    <span
                      className={`${
                        theme === "dark" ? "text-gray-300" : "text-gray-700"
                      } ${isRTL ? "text-right" : "text-left"}`}
                    >
                      {ui.privacy[item.key]}
                    </span>
                    <button
                      type="button"
                      aria-label={ui.privacy[item.key]}
                      onClick={() => toggleSetting("privacy", item.key)}
                      className={getTrackClass(enabled)}
                    >
                      <span className={getThumbClass(enabled)} />
                    </button>
                  </div>
                );
              })}
            </div>
          </div>

          <div className={`${cardClass} border rounded-xl p-6`}>
            <div
              className={`flex items-center gap-3 mb-4 ${
                isRTL ? "flex-row-reverse" : ""
              }`}
            >
              <div
                className={`w-10 h-10 rounded-lg flex items-center justify-center ${softCardClass}`}
              >
                <Sun className="w-5 h-5 text-amber-500" />
              </div>
              <h2 className={`text-lg font-semibold ${textMainClass}`}>
                {ui.sections.accessibility}
              </h2>
            </div>

            <div
              className={`flex items-center justify-between ${
                isRTL ? "flex-row-reverse" : ""
              }`}
            >
              <div className={isRTL ? "text-right" : "text-left"}>
                <p className={`font-medium ${textMainClass}`}>{ui.accessibility.lowVision}</p>
                <p className={`text-sm ${textMutedClass}`}>{ui.accessibility.lowVisionDesc}</p>
              </div>
              <button
                type="button"
                aria-label={ui.accessibility.lowVision}
                onClick={() => toggleSetting("accessibility", "lowVision")}
                className={getTrackClass(Boolean(settings.accessibility?.lowVision))}
              >
                <span className={getThumbClass(Boolean(settings.accessibility?.lowVision))} />
              </button>
            </div>
          </div>
        </div>

        <div className="space-y-6">
          <div className={`${cardClass} border rounded-xl p-6`}>
            <h2
              className={`text-lg font-semibold mb-4 ${textMainClass} ${
                isRTL ? "text-right" : "text-left"
              }`}
            >
              {ui.sections.support}
            </h2>

            <div className="space-y-3">
              <button
                type="button"
                className={`w-full flex items-center gap-3 p-4 rounded-lg transition-colors ${rowCardClass} ${
                  isRTL ? "flex-row-reverse" : ""
                }`}
              >
                <HelpCircle className="w-5 h-5 text-blue-600" />
                <div className={isRTL ? "text-right" : "text-left"}>
                  <p className={`font-medium ${textMainClass}`}>
                    {ui.support.helpCenter}
                  </p>
                  <p className={`text-xs ${textMutedClass}`}>{ui.support.helpCenterDesc}</p>
                </div>
              </button>

              <button
                type="button"
                className={`w-full flex items-center gap-3 p-4 rounded-lg transition-colors ${rowCardClass} ${
                  isRTL ? "flex-row-reverse" : ""
                }`}
              >
                <MessageCircle className="w-5 h-5 text-green-600" />
                <div className={isRTL ? "text-right" : "text-left"}>
                  <p className={`font-medium ${textMainClass}`}>{ui.support.liveChat}</p>
                  <p className={`text-xs ${textMutedClass}`}>{ui.support.liveChatDesc}</p>
                </div>
              </button>

              <button
                type="button"
                className={`w-full flex items-center gap-3 p-4 rounded-lg transition-colors ${rowCardClass} ${
                  isRTL ? "flex-row-reverse" : ""
                }`}
              >
                <Phone className="w-5 h-5 text-orange-600" />
                <div className={isRTL ? "text-right" : "text-left"}>
                  <p className={`font-medium ${textMainClass}`}>
                    {ui.support.phoneSupport}
                  </p>
                  <p className={`text-xs ${textMutedClass}`}>+216 71 126 000</p>
                </div>
              </button>
            </div>
          </div>

          <div
            className={`${
              theme === "dark"
                ? "bg-linear-to-br from-blue-900/30 to-cyan-900/30 border-blue-800"
                : "bg-linear-to-br from-blue-50 to-cyan-50 border-blue-200"
            } border rounded-xl p-6`}
          >
            <h3
              className={`font-semibold mb-2 ${textMainClass} ${
                isRTL ? "text-right" : "text-left"
              }`}
            >
              {ui.sections.quickHelp}
            </h3>
            <p className={`text-sm mb-4 ${theme === "dark" ? "text-gray-300" : "text-gray-700"} ${isRTL ? "text-right" : "text-left"}`}>
              {ui.support.quickHelpText}
            </p>
            <button
              type="button"
              className="w-full py-2 bg-[#242f54] text-white rounded-lg hover:bg-[#1a2340] transition-colors text-sm font-medium"
            >
              {ui.actions.contactSupport}
            </button>
          </div>

          <div className={`${cardClass} border rounded-xl p-6`}>
            <h3
              className={`font-semibold mb-4 ${textMainClass} ${
                isRTL ? "text-right" : "text-left"
              }`}
            >
              {ui.sections.account}
            </h3>

            <div className={`space-y-3 ${isRTL ? "text-right" : "text-left"}`}>
              <div>
                <p className={`text-xs ${textMutedClass}`}>{ui.account.accountNumber}</p>
                <p className={`font-mono ${textMainClass}`}>{accountNumberLabel}</p>
              </div>
              <div>
                <p className={`text-xs ${textMutedClass}`}>{ui.account.openingDate}</p>
                <p className={textMainClass}>{openingDateLabel}</p>
              </div>
              <div>
                <p className={`text-xs ${textMutedClass}`}>{ui.account.status}</p>
                <span
                  className={`inline-block px-2 py-1 text-xs rounded-full ${accountStatusClass}`}
                >
                  {accountStatusLabel}
                </span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
