import { useEffect, useMemo, useState } from "react";
import {
  Accessibility,
  AlignJustify,
  Keyboard,
  Minimize2,
  Moon,
  Pause,
  Play,
  Square,
  Timer,
  Type,
  Volume2,
} from "lucide-react";
import { useTheme } from "../contexts/ThemeContext";
import { useLanguage } from "../contexts/LanguageContext";

const SETTINGS_STORAGE_KEY = "bh_dashboard_settings";

const TEXT_SIZE_VALUES = ["small", "medium", "large", "xlarge"];
const READING_SPACING_VALUES = ["normal", "comfortable", "wide"];
const VOICE_RATE_MIN = 0.7;
const VOICE_RATE_MAX = 1.3;
const DEFAULT_VOICE_RATE = 0.95;

const ROOT_ACCESSIBILITY_CLASSES = {
  reduceMotion: "reduce-motion-mode",
  keyboardNavigation: "keyboard-navigation-mode",
};

const ROOT_TEXT_SIZE_CLASSES = TEXT_SIZE_VALUES.map((value) => `text-size-${value}`);
const ROOT_READING_SPACING_CLASSES = READING_SPACING_VALUES.map(
  (value) => `reading-spacing-${value}`,
);

const defaultSettings = {
  accessibility: {
    textSize: "medium",
    readingSpacing: "normal",
    reduceMotion: false,
    keyboardNavigation: false,
    screenReader: false,
    voiceName: "auto",
    voiceRate: DEFAULT_VOICE_RATE,
  },
};

const normalizeSettings = (value = {}) => {
  const incomingAccessibility = value.accessibility || {};

  const normalized = {
    accessibility: {
      ...defaultSettings.accessibility,
      reduceMotion: Boolean(incomingAccessibility.reduceMotion),
      keyboardNavigation: Boolean(incomingAccessibility.keyboardNavigation),
      screenReader: Boolean(incomingAccessibility.screenReader),
      textSize: incomingAccessibility.textSize,
      readingSpacing: incomingAccessibility.readingSpacing,
      voiceName: incomingAccessibility.voiceName || "auto",
      voiceRate: incomingAccessibility.voiceRate,
    },
  };

  if (!TEXT_SIZE_VALUES.includes(normalized.accessibility.textSize)) {
    normalized.accessibility.textSize = defaultSettings.accessibility.textSize;
  }

  if (!READING_SPACING_VALUES.includes(normalized.accessibility.readingSpacing)) {
    normalized.accessibility.readingSpacing = defaultSettings.accessibility.readingSpacing;
  }

  const voiceRate = Number(normalized.accessibility.voiceRate);
  if (!Number.isFinite(voiceRate)) {
    normalized.accessibility.voiceRate = DEFAULT_VOICE_RATE;
  } else {
    normalized.accessibility.voiceRate = Math.min(
      VOICE_RATE_MAX,
      Math.max(VOICE_RATE_MIN, voiceRate),
    );
  }

  if (!normalized.accessibility.voiceName) {
    normalized.accessibility.voiceName = "auto";
  }

  return normalized;
};

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
      dyslexiaMode: "Dyslexia mode",
      dyslexiaModeDesc: "Use a dyslexia-friendly font and more spacing for easier reading.",
      darkMode: "Dark mode",
      darkModeDesc: "Switch the application to dark mode.",
      textSizeLabel: "Advanced text size",
      textSizeDesc: "Choose Small, Medium, Large or Extra Large for your comfort.",
      textSizeSmall: "Small",
      textSizeMedium: "Medium",
      textSizeLarge: "Large",
      textSizeXLarge: "Extra Large",
      readingSpacingLabel: "Reading spacing",
      readingSpacingDesc: "Adjust line and paragraph spacing to reduce visual fatigue.",
      readingSpacingNormal: "Normal",
      readingSpacingComfortable: "Comfortable",
      readingSpacingWide: "Wide",
      reduceMotion: "Motion-free mode",
      reduceMotionDesc: "Disable animations and transitions for a calmer interface.",
      keyboardNavigation: "Keyboard navigation",
      keyboardNavigationDesc: "Enable visible focus and simple keyboard shortcuts.",
      keyboardNavigationHowToTitle: "How to use keyboard navigation",
      keyboardNavigationHowToDesc: "Use Tab to move and quick shortcuts to switch dashboard pages.",
      keyboardNavigationHowToStepFocus: "Tab / Shift+Tab: move focus between controls.",
      keyboardNavigationHowToStepActivate: "Enter or Space: activate the selected button or link.",
      keyboardNavigationHowToStepShortcuts:
        "Alt + 1..9: quick open Dashboard, Chatbot, Products, Simulator, Budget, Profile, Complaints, Settings.",
      keyboardNavigationHowToStepTip: "Tip: keep Alt pressed, then tap a number.",
      screenReader: "Screen voice reading",
      screenReaderDesc: "Read key page content aloud to assist navigation.",
      screenReaderTry: "Read this screen",
      screenReaderPause: "Pause",
      screenReaderResume: "Resume",
      screenReaderStop: "Stop",
      voiceSettings: "Voice settings",
      voiceSettingsDesc: "Choose voice and speaking speed.",
      voiceChoice: "Voice",
      voiceChoiceAuto: "Automatic voice",
      voiceRateLabel: "Speech speed",
      screenReaderSample:
        "Accessibility mode enabled. This screen helps you adjust reading, contrast and interaction settings.",
      voiceUnavailable:
        "Voice reading is not available in this browser. You can use Chrome or Edge for this option.",
      largeButtons: "Larger buttons",
      largeButtonsDesc: "Increase click and tap target size for easier interaction on mobile.",
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
      dyslexiaMode: "Mode dyslexie",
      dyslexiaModeDesc: "Utilise une police adaptee et augmente l'espacement pour faciliter la lecture.",
      darkMode: "Mode sombre",
      darkModeDesc: "Bascule l'application en theme sombre.",
      textSizeLabel: "Taille de texte avancee",
      textSizeDesc: "Permet de choisir Petit, Moyen, Grand ou Tres grand selon le confort visuel.",
      textSizeSmall: "Petit",
      textSizeMedium: "Moyen",
      textSizeLarge: "Grand",
      textSizeXLarge: "Tres grand",
      readingSpacingLabel: "Espacement de lecture",
      readingSpacingDesc: "Ajuste l'interligne et l'espacement des paragraphes pour reduire la fatigue visuelle.",
      readingSpacingNormal: "Normal",
      readingSpacingComfortable: "Confort",
      readingSpacingWide: "Large",
      reduceMotion: "Mode sans animation",
      reduceMotionDesc: "Coupe les animations et transitions pour une interface plus stable.",
      keyboardNavigation: "Navigation clavier",
      keyboardNavigationDesc: "Active un focus visible et des raccourcis clavier simples.",
      keyboardNavigationHowToTitle: "Comment utiliser la navigation clavier",
      keyboardNavigationHowToDesc: "Utilisez Tab pour avancer et des raccourcis pour changer vite de page.",
      keyboardNavigationHowToStepFocus: "Tab / Shift+Tab : passer d'un element a l'autre.",
      keyboardNavigationHowToStepActivate: "Entree ou Espace : activer le bouton ou le lien cible.",
      keyboardNavigationHowToStepShortcuts:
        "Alt + 1..9 : ouvrir vite Dashboard, Chatbot, Produits, Simulateur, Budget, Profil, Reclamation, Parametres.",
      keyboardNavigationHowToStepTip: "Astuce : gardez Alt appuye, puis tapez un chiffre.",
      screenReader: "Lecture vocale des ecrans",
      screenReaderDesc: "Lit les contenus importants a voix haute pour accompagner la navigation.",
      screenReaderTry: "Lire cet ecran",
      screenReaderPause: "Pause",
      screenReaderResume: "Reprendre",
      screenReaderStop: "Arreter",
      voiceSettings: "Reglages de voix",
      voiceSettingsDesc: "Choisissez la voix et la vitesse de lecture.",
      voiceChoice: "Voix",
      voiceChoiceAuto: "Voix automatique",
      voiceRateLabel: "Vitesse de lecture",
      screenReaderSample:
        "Mode accessibilite active. Cet ecran vous aide a ajuster la lecture, le contraste et l'interaction.",
      voiceUnavailable:
        "La lecture vocale n'est pas disponible dans ce navigateur. Utilisez Chrome ou Edge pour cette option.",
      largeButtons: "Boutons agrandis",
      largeButtonsDesc: "Augmente la taille des zones cliquables pour une interaction plus simple sur mobile.",
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
      dyslexiaMode: "وضع عسر القراءة",
      dyslexiaModeDesc: "يستخدم خطا اوضح ويزيد المسافات لتسهيل القراءة.",
      darkMode: "الوضع الداكن",
      darkModeDesc: "تبديل التطبيق الى الوضع الداكن.",
      textSizeLabel: "حجم النص المتقدم",
      textSizeDesc: "اختر صغير او متوسط او كبير او كبير جدا حسب الراحة البصرية.",
      textSizeSmall: "صغير",
      textSizeMedium: "متوسط",
      textSizeLarge: "كبير",
      textSizeXLarge: "كبير جدا",
      readingSpacingLabel: "تباعد القراءة",
      readingSpacingDesc: "يضبط تباعد السطور والفقرات لتقليل اجهاد العين.",
      readingSpacingNormal: "عادي",
      readingSpacingComfortable: "مريح",
      readingSpacingWide: "واسع",
      reduceMotion: "وضع بدون حركة",
      reduceMotionDesc: "يلغي الحركات والانتقالات لواجهة اكثر ثباتا.",
      keyboardNavigation: "التنقل بلوحة المفاتيح",
      keyboardNavigationDesc: "يفعل تركيزا مرئيا مع اختصارات لوحة مفاتيح سهلة.",
      keyboardNavigationHowToTitle: "كيفية استخدام التنقل بلوحة المفاتيح",
      keyboardNavigationHowToDesc: "استخدم Tab للتنقل واختصارات سريعة لتغيير صفحات لوحة التحكم.",
      keyboardNavigationHowToStepFocus: "Tab / Shift+Tab: التنقل بين العناصر.",
      keyboardNavigationHowToStepActivate: "Enter او Space: تفعيل الزر او الرابط المحدد.",
      keyboardNavigationHowToStepShortcuts:
        "Alt + 1..9: فتح سريع للوحة التحكم، الشاتبوت، المنتجات، المحاكي، الميزانية، الملف الشخصي، الشكاوى، الاعدادات.",
      keyboardNavigationHowToStepTip: "نصيحة: اضغط Alt باستمرار ثم اضغط الرقم.",
      screenReader: "القراءة الصوتية للشاشات",
      screenReaderDesc: "يقرأ المحتوى المهم بصوت لمساعدة المستخدم في التنقل.",
      screenReaderTry: "اقرأ هذه الشاشة",
      screenReaderPause: "ايقاف مؤقت",
      screenReaderResume: "استئناف",
      screenReaderStop: "ايقاف",
      voiceSettings: "اعدادات الصوت",
      voiceSettingsDesc: "اختر الصوت وسرعة القراءة.",
      voiceChoice: "الصوت",
      voiceChoiceAuto: "صوت تلقائي",
      voiceRateLabel: "سرعة القراءة",
      screenReaderSample:
        "تم تفعيل وضع امكانية الوصول. هذه الصفحة تساعدك على ضبط القراءة والتباين والتفاعل.",
      voiceUnavailable:
        "القراءة الصوتية غير متوفرة في هذا المتصفح. يمكن استخدام Chrome او Edge.",
      largeButtons: "تكبير الازرار",
      largeButtonsDesc: "يزيد مساحة النقر لتفاعل اسهل خاصة على الهاتف.",
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
  const { theme, toggleTheme } = useTheme();
  const { language, isRTL } = useLanguage();

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
  const [feedback, setFeedback] = useState("");
  const [availableVoices, setAvailableVoices] = useState([]);

  const getVoiceId = (voice) => voice?.voiceURI || voice?.name || "";

  const getSpeechVoices = () => {
    if (typeof window === "undefined" || !("speechSynthesis" in window)) {
      return [];
    }

    return window.speechSynthesis
      .getVoices()
      .filter((voice) => Boolean(voice?.name));
  };

  const accessibilityRows = useMemo(
    () => [
      {
        key: "darkMode",
        icon: Moon,
        label: ui.accessibility.darkMode,
        description: ui.accessibility.darkModeDesc,
      },
      {
        key: "reduceMotion",
        icon: Minimize2,
        label: ui.accessibility.reduceMotion,
        description: ui.accessibility.reduceMotionDesc,
      },
      {
        key: "keyboardNavigation",
        icon: Keyboard,
        label: ui.accessibility.keyboardNavigation,
        description: ui.accessibility.keyboardNavigationDesc,
      },
      {
        key: "screenReader",
        icon: Volume2,
        label: ui.accessibility.screenReader,
        description: ui.accessibility.screenReaderDesc,
      },
    ],
    [ui],
  );

  useEffect(() => {
    localStorage.setItem(SETTINGS_STORAGE_KEY, JSON.stringify(settings));
  }, [settings]);

  useEffect(() => {
    const root = document.documentElement;
    const accessibility = settings?.accessibility || defaultSettings.accessibility;

    Object.entries(ROOT_ACCESSIBILITY_CLASSES).forEach(([key, className]) => {
      root.classList.toggle(className, Boolean(accessibility[key]));
    });

    ROOT_TEXT_SIZE_CLASSES.forEach((className) => root.classList.remove(className));
    root.classList.add(`text-size-${accessibility.textSize || defaultSettings.accessibility.textSize}`);

    ROOT_READING_SPACING_CLASSES.forEach((className) => root.classList.remove(className));
    root.classList.add(
      `reading-spacing-${accessibility.readingSpacing || defaultSettings.accessibility.readingSpacing}`,
    );

    if (typeof window !== "undefined") {
      window.dispatchEvent(new CustomEvent("bh-accessibility-updated"));
    }
  }, [settings]);

  useEffect(() => {
    if (settings?.accessibility?.screenReader) return;
    if (typeof window !== "undefined" && "speechSynthesis" in window) {
      window.speechSynthesis.cancel();
    }
  }, [settings?.accessibility?.screenReader]);

  useEffect(() => {
    if (typeof window === "undefined" || !("speechSynthesis" in window)) return;

    const synth = window.speechSynthesis;
    const canUseEventListener = typeof synth.addEventListener === "function";

    const updateVoices = () => {
      const voices = getSpeechVoices().map((voice) => ({
          id: getVoiceId(voice),
          name: voice.name,
          lang: voice.lang,
        }));
      setAvailableVoices(voices);
    };

    const updateTimer = window.setTimeout(updateVoices, 0);
    if (canUseEventListener) {
      synth.addEventListener("voiceschanged", updateVoices);
    } else {
      synth.onvoiceschanged = updateVoices;
    }

    return () => {
      window.clearTimeout(updateTimer);
      if (canUseEventListener) {
        synth.removeEventListener("voiceschanged", updateVoices);
      } else if (synth.onvoiceschanged === updateVoices) {
        synth.onvoiceschanged = null;
      }
    };
  }, []);

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
    if (key === "darkMode") {
      toggleTheme();
      setFeedback(ui.feedback.updated);
      return;
    }

    const nextEnabled = !settings?.[category]?.[key];

    setSettings((prev) => ({
      ...prev,
      [category]: {
        ...prev[category],
        [key]: nextEnabled,
      },
    }));

    if (key === "screenReader" && nextEnabled) {
      setTimeout(() => {
        const spoken = speakAccessibilityPreview();
        if (!spoken) {
          setFeedback(ui.accessibility.voiceUnavailable);
        }
      }, 80);
      return;
    }

    setFeedback(ui.feedback.updated);
  };

  const updateSettingValue = (category, key, value) => {
    setSettings((prev) => ({
      ...prev,
      [category]: {
        ...prev[category],
        [key]: value,
      },
    }));
    setFeedback(ui.feedback.updated);
  };

  const getVoiceRate = () => {
    const currentRate = Number(settings?.accessibility?.voiceRate);
    if (!Number.isFinite(currentRate)) {
      return DEFAULT_VOICE_RATE;
    }
    return Math.min(VOICE_RATE_MAX, Math.max(VOICE_RATE_MIN, currentRate));
  };

  const getVoiceForSpeech = () => {
    const voices = getSpeechVoices();
    if (!voices.length) {
      return null;
    }

    const selectedVoiceId = settings?.accessibility?.voiceName;
    if (selectedVoiceId && selectedVoiceId !== "auto") {
      const explicit = voices.find((voice) => getVoiceId(voice) === selectedVoiceId);
      if (explicit) {
        return explicit;
      }
    }

    const languagePrefix = language === "ar" ? "ar" : language === "fr" ? "fr" : "en";
    const localeMatched = voices.find((voice) =>
      (voice.lang || "").toLowerCase().startsWith(languagePrefix),
    );

    return localeMatched || voices[0];
  };

  const speakAccessibilityPreview = () => {
    if (typeof window === "undefined" || !("speechSynthesis" in window)) {
      return false;
    }

    const selectedVoice = getVoiceForSpeech();
    const utterance = new SpeechSynthesisUtterance();
    utterance.text = ui.accessibility.screenReaderSample;
    utterance.lang = language === "ar" ? "ar-TN" : language === "en" ? "en-US" : "fr-FR";
    utterance.rate = getVoiceRate();
    utterance.pitch = 1;

    if (selectedVoice) {
      utterance.voice = selectedVoice;
    }

    try {
      window.speechSynthesis.cancel();
      window.speechSynthesis.speak(utterance);
      return true;
    } catch {
      return false;
    }
  };

  const pauseSpeech = () => {
    if (typeof window === "undefined" || !("speechSynthesis" in window)) {
      return false;
    }
    window.speechSynthesis.pause();
    return true;
  };

  const resumeSpeech = () => {
    if (typeof window === "undefined" || !("speechSynthesis" in window)) {
      return false;
    }
    window.speechSynthesis.resume();
    return true;
  };

  const stopSpeech = () => {
    if (typeof window === "undefined" || !("speechSynthesis" in window)) {
      return false;
    }
    window.speechSynthesis.cancel();
    return true;
  };

  const activePrefsCount = useMemo(() => {
    const accessibility = settings?.accessibility || defaultSettings.accessibility;
    let count = 0;

    Object.keys(ROOT_ACCESSIBILITY_CLASSES).forEach((key) => {
      if (accessibility[key]) {
        count += 1;
      }
    });

    if (accessibility.textSize !== defaultSettings.accessibility.textSize) {
      count += 1;
    }

    if (accessibility.readingSpacing !== defaultSettings.accessibility.readingSpacing) {
      count += 1;
    }

    if (theme === "dark") {
      count += 1;
    }

    return count;
  }, [settings, theme]);

  const containerBgClass = theme === "dark" ? "bg-gray-900" : "bg-gray-50";
  const cardClass =
    theme === "dark"
      ? "bg-gray-800 border-gray-700"
      : "bg-white border-gray-200";
  const softCardClass =
    theme === "dark" ? "bg-gray-700" : "bg-gray-100";
  const textMainClass = theme === "dark" ? "text-white" : "text-gray-900";
  const textMutedClass = theme === "dark" ? "text-gray-400" : "text-gray-600";

  const textSizeOptions = [
    { value: "small", label: ui.accessibility.textSizeSmall },
    { value: "medium", label: ui.accessibility.textSizeMedium },
    { value: "large", label: ui.accessibility.textSizeLarge },
    { value: "xlarge", label: ui.accessibility.textSizeXLarge },
  ];

  const readingSpacingOptions = [
    { value: "normal", label: ui.accessibility.readingSpacingNormal },
    { value: "comfortable", label: ui.accessibility.readingSpacingComfortable },
    { value: "wide", label: ui.accessibility.readingSpacingWide },
  ];

  return (
    <div className={`p-4 lg:p-8 space-y-6 ${containerBgClass}`}>
      <div>
        <div className={`flex items-start justify-between gap-3 ${isRTL ? "flex-row-reverse" : ""}`}>
          <div className={isRTL ? "text-right" : "text-left"}>
            <h1 className={`text-2xl font-semibold mb-2 ${textMainClass}`}>
              {ui.title}
            </h1>
            <p className={textMutedClass}>{ui.subtitle}</p>
          </div>
          <div
            className={`rounded-full border px-3 py-1 text-xs font-medium ${
              theme === "dark"
                ? "border-gray-600 bg-gray-800 text-gray-200"
                : "border-gray-300 bg-white text-gray-700"
            }`}
          >
            {activePrefsCount} {ui.activePrefs}
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

      <div className="space-y-6">
        <div className={`${cardClass} border rounded-xl p-6`}>
            <div
              className={`flex items-center gap-3 mb-4 ${
                isRTL ? "flex-row-reverse" : ""
              }`}
            >
              <div
                className={`w-10 h-10 rounded-lg flex items-center justify-center ${softCardClass}`}
              >
                <Accessibility className="w-5 h-5 text-amber-500" />
              </div>
              <h2 className={`text-lg font-semibold ${textMainClass}`}>
                {ui.sections.accessibility}
              </h2>
            </div>

            <div className="space-y-4">
              {accessibilityRows.map((item) => {
                const isEnabled =
                  item.key === "darkMode"
                    ? theme === "dark"
                    : Boolean(settings.accessibility?.[item.key]);
                const Icon = item.icon;

                return (
                  <div
                    key={item.key}
                    className={`rounded-xl border p-3 ${
                      theme === "dark" ? "border-gray-700 bg-gray-700/30" : "border-gray-200 bg-gray-50"
                    }`}
                  >
                    <div
                      className={`flex items-start justify-between gap-3 ${isRTL ? "flex-row-reverse" : ""}`}
                    >
                      <div className={`flex items-start gap-3 ${isRTL ? "flex-row-reverse" : ""}`}>
                        <div className={`mt-0.5 h-9 w-9 shrink-0 rounded-lg flex items-center justify-center ${softCardClass}`}>
                          <Icon className="h-4 w-4 text-cyan-600" />
                        </div>
                        <div className={isRTL ? "text-right" : "text-left"}>
                          <p className={`font-medium ${textMainClass}`}>{item.label}</p>
                          <p className={`text-sm ${textMutedClass}`}>{item.description}</p>
                        </div>
                      </div>

                      <button
                        type="button"
                        aria-label={item.label}
                        onClick={() => toggleSetting("accessibility", item.key)}
                        className={getTrackClass(isEnabled)}
                      >
                        <span className={getThumbClass(isEnabled)} />
                      </button>
                    </div>

                    {item.key === "screenReader" && isEnabled && (
                      <div className={`mt-3 space-y-3 ${isRTL ? "text-right" : "text-left"}`}>
                        <div
                          className={`rounded-xl border p-3 ${
                            theme === "dark" ? "border-gray-600 bg-gray-800/70" : "border-gray-300 bg-white"
                          }`}
                        >
                          <div className={`flex items-center gap-2 ${isRTL ? "flex-row-reverse" : ""}`}>
                            <Volume2 className="h-4 w-4 text-cyan-600" />
                            <p className={`font-medium ${textMainClass}`}>{ui.accessibility.voiceSettings}</p>
                          </div>
                          <p className={`mt-1 text-sm ${textMutedClass}`}>{ui.accessibility.voiceSettingsDesc}</p>

                          <div className="mt-3 grid gap-3 lg:grid-cols-2">
                            <label className="space-y-1">
                              <span className={`text-xs font-medium ${textMutedClass}`}>
                                {ui.accessibility.voiceChoice}
                              </span>
                              <select
                                value={settings.accessibility?.voiceName || "auto"}
                                onChange={(event) =>
                                  updateSettingValue("accessibility", "voiceName", event.target.value)
                                }
                                className={`w-full rounded-lg border px-3 py-2 text-sm ${
                                  theme === "dark"
                                    ? "border-gray-600 bg-gray-800 text-gray-100"
                                    : "border-gray-300 bg-white text-gray-700"
                                }`}
                              >
                                <option value="auto">{ui.accessibility.voiceChoiceAuto}</option>
                                {availableVoices.map((voice) => (
                                  <option key={voice.id} value={voice.id}>
                                    {voice.name} ({voice.lang || "--"})
                                  </option>
                                ))}
                              </select>
                            </label>

                            <label className="space-y-1">
                              <span className={`text-xs font-medium ${textMutedClass}`}>
                                {ui.accessibility.voiceRateLabel}
                              </span>
                              <div className={`flex items-center gap-2 ${isRTL ? "flex-row-reverse" : ""}`}>
                                <Timer className="h-4 w-4 text-cyan-600" />
                                <input
                                  type="range"
                                  min={VOICE_RATE_MIN}
                                  max={VOICE_RATE_MAX}
                                  step="0.05"
                                  value={getVoiceRate()}
                                  onChange={(event) =>
                                    updateSettingValue(
                                      "accessibility",
                                      "voiceRate",
                                      Number(event.target.value),
                                    )
                                  }
                                  className="w-full"
                                />
                                <span className={`w-12 text-xs font-medium ${textMainClass}`}>
                                  {getVoiceRate().toFixed(2)}x
                                </span>
                              </div>
                            </label>
                          </div>
                        </div>

                        <div className={`flex flex-wrap items-center gap-2 ${isRTL ? "justify-end" : ""}`}>
                          <button
                            type="button"
                            onClick={() => {
                              const spoken = speakAccessibilityPreview();
                              setFeedback(spoken ? ui.feedback.updated : ui.accessibility.voiceUnavailable);
                            }}
                            className={`inline-flex items-center gap-2 rounded-lg border px-3 py-2 text-sm ${
                              theme === "dark"
                                ? "border-gray-500 bg-gray-800 text-gray-200 hover:bg-gray-700"
                                : "border-gray-300 bg-white text-gray-700 hover:bg-gray-100"
                            } ${isRTL ? "flex-row-reverse" : ""}`}
                          >
                            <Play className="h-4 w-4" />
                            {ui.accessibility.screenReaderTry}
                          </button>

                          <button
                            type="button"
                            onClick={() => {
                              const paused = pauseSpeech();
                              setFeedback(paused ? ui.feedback.updated : ui.accessibility.voiceUnavailable);
                            }}
                            className={`inline-flex items-center gap-2 rounded-lg border px-3 py-2 text-sm ${
                              theme === "dark"
                                ? "border-gray-500 bg-gray-800 text-gray-200 hover:bg-gray-700"
                                : "border-gray-300 bg-white text-gray-700 hover:bg-gray-100"
                            } ${isRTL ? "flex-row-reverse" : ""}`}
                          >
                            <Pause className="h-4 w-4" />
                            {ui.accessibility.screenReaderPause}
                          </button>

                          <button
                            type="button"
                            onClick={() => {
                              const resumed = resumeSpeech();
                              setFeedback(resumed ? ui.feedback.updated : ui.accessibility.voiceUnavailable);
                            }}
                            className={`inline-flex items-center gap-2 rounded-lg border px-3 py-2 text-sm ${
                              theme === "dark"
                                ? "border-gray-500 bg-gray-800 text-gray-200 hover:bg-gray-700"
                                : "border-gray-300 bg-white text-gray-700 hover:bg-gray-100"
                            } ${isRTL ? "flex-row-reverse" : ""}`}
                          >
                            <Volume2 className="h-4 w-4" />
                            {ui.accessibility.screenReaderResume}
                          </button>

                          <button
                            type="button"
                            onClick={() => {
                              const stopped = stopSpeech();
                              setFeedback(stopped ? ui.feedback.updated : ui.accessibility.voiceUnavailable);
                            }}
                            className={`inline-flex items-center gap-2 rounded-lg border px-3 py-2 text-sm ${
                              theme === "dark"
                                ? "border-red-700 bg-red-900/30 text-red-200 hover:bg-red-900/40"
                                : "border-red-300 bg-red-50 text-red-700 hover:bg-red-100"
                            } ${isRTL ? "flex-row-reverse" : ""}`}
                          >
                            <Square className="h-4 w-4" />
                            {ui.accessibility.screenReaderStop}
                          </button>
                        </div>
                      </div>
                    )}

                    {item.key === "keyboardNavigation" && isEnabled && (
                      <div
                        className={`mt-3 rounded-xl border p-3 ${
                          theme === "dark" ? "border-gray-600 bg-gray-800/70" : "border-gray-300 bg-white"
                        } ${isRTL ? "text-right" : "text-left"}`}
                      >
                        <p className={`font-medium ${textMainClass}`}>
                          {ui.accessibility.keyboardNavigationHowToTitle}
                        </p>
                        <p className={`mt-1 text-sm ${textMutedClass}`}>
                          {ui.accessibility.keyboardNavigationHowToDesc}
                        </p>

                        <ul className={`mt-2 space-y-1 text-sm ${textMutedClass}`}>
                          <li>{ui.accessibility.keyboardNavigationHowToStepFocus}</li>
                          <li>{ui.accessibility.keyboardNavigationHowToStepActivate}</li>
                          <li>{ui.accessibility.keyboardNavigationHowToStepShortcuts}</li>
                          <li>{ui.accessibility.keyboardNavigationHowToStepTip}</li>
                        </ul>
                      </div>
                    )}
                  </div>
                );
              })}

              <div className="grid gap-4 lg:grid-cols-2">
                <label className={`rounded-xl border p-3 ${theme === "dark" ? "border-gray-700 bg-gray-700/30" : "border-gray-200 bg-gray-50"}`}>
                  <div className={`flex items-center gap-2 ${isRTL ? "flex-row-reverse" : ""}`}>
                    <Type className="h-4 w-4 text-cyan-600" />
                    <p className={`font-medium ${textMainClass}`}>{ui.accessibility.textSizeLabel}</p>
                  </div>
                  <p className={`mt-1 text-sm ${textMutedClass}`}>{ui.accessibility.textSizeDesc}</p>
                  <select
                    value={settings.accessibility?.textSize || "medium"}
                    onChange={(event) => updateSettingValue("accessibility", "textSize", event.target.value)}
                    className={`mt-3 w-full rounded-lg border px-3 py-2 text-sm ${
                      theme === "dark"
                        ? "border-gray-600 bg-gray-800 text-gray-100"
                        : "border-gray-300 bg-white text-gray-700"
                    }`}
                  >
                    {textSizeOptions.map((option) => (
                      <option key={option.value} value={option.value}>
                        {option.label}
                      </option>
                    ))}
                  </select>
                </label>

                <label className={`rounded-xl border p-3 ${theme === "dark" ? "border-gray-700 bg-gray-700/30" : "border-gray-200 bg-gray-50"}`}>
                  <div className={`flex items-center gap-2 ${isRTL ? "flex-row-reverse" : ""}`}>
                    <AlignJustify className="h-4 w-4 text-cyan-600" />
                    <p className={`font-medium ${textMainClass}`}>{ui.accessibility.readingSpacingLabel}</p>
                  </div>
                  <p className={`mt-1 text-sm ${textMutedClass}`}>{ui.accessibility.readingSpacingDesc}</p>
                  <select
                    value={settings.accessibility?.readingSpacing || "normal"}
                    onChange={(event) => updateSettingValue("accessibility", "readingSpacing", event.target.value)}
                    className={`mt-3 w-full rounded-lg border px-3 py-2 text-sm ${
                      theme === "dark"
                        ? "border-gray-600 bg-gray-800 text-gray-100"
                        : "border-gray-300 bg-white text-gray-700"
                    }`}
                  >
                    {readingSpacingOptions.map((option) => (
                      <option key={option.value} value={option.value}>
                        {option.label}
                      </option>
                    ))}
                  </select>
                </label>
              </div>
            </div>
          </div>
      </div>
    </div>
  );
}
