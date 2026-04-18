import { useEffect, useState } from "react";
import { useNavigate } from "react-router";
import { Eye, EyeOff, Lock, Mail, ShieldCheck } from "lucide-react";
import { useTheme } from "../contexts/ThemeContext";
import { useLanguage } from "../contexts/LanguageContext";
import logoExpanded from "../assets/BH_logo2.png";
import flagAr from "../assets/flags/Flag_of_Tunisia.svg.webp";
import flagEn from "../assets/flags/Flag_of_the_United_Kingdom_(3-5).svg.webp";
import flagFr from "../assets/flags/Flag_of_France.svg.png";
import {
  checkAgentPortalAccess,
  clearAgentAuthSession,
  getAgentAuthToken,
  loginAgent,
  requestAgentPasswordReset,
  setAgentAuthSession,
} from "../api";

const REMEMBER_AGENT_EMAIL_KEY = "bh_agent_last_email";
const AGENT_ROLE_STORAGE_KEY = "bh_agent_role";

const languageOptions = [
  {
    code: "fr",
    label: "FR",
    flag: flagFr,
    flagAlt: "France flag",
    aria: "Switch to French",
  },
  {
    code: "en",
    label: "EN",
    flag: flagEn,
    flagAlt: "United Kingdom flag",
    aria: "Switch to English",
  },
  {
    code: "ar",
    label: "AR",
    flag: flagAr,
    flagAlt: "Tunisia flag",
    aria: "Switch to Arabic",
  },
];

const isRouteMissingMessage = (message) =>
  /(endpoint api introuvable|requested url was not found on the server)/i.test(String(message || ""));

const isLikelyNetworkError = (error) => {
  if (!error) return false;
  if (typeof error.status === "number") return false;
  const message = String(error.message || "").toLowerCase();
  return message.includes("failed to fetch") || message.includes("network") || message.includes("offline");
};

const resolveAgentLoginError = (error, ui) => {
  const rawMessage = String(error?.message || "").trim();

  if (
    error?.status === 429 ||
    error?.status === 423 ||
    /(verrouill|locked|lockout|too many|trop de tentatives|retry|minutes?)/i.test(rawMessage)
  ) {
    return rawMessage || ui.lockoutMessage;
  }

  if (error?.status === 401) {
    return ui.invalidCredentials;
  }

  if (error?.status === 400) {
    return ui.invalidLoginInput;
  }

  if (error?.status === 404 || isRouteMissingMessage(rawMessage)) {
    return ui.serviceUnavailable;
  }

  if (isLikelyNetworkError(error)) {
    return ui.networkError;
  }

  return rawMessage || ui.loginFailedFallback;
};

const resolveAgentForgotError = (error, ui) => {
  const rawMessage = String(error?.message || "").trim();

  if (error?.status === 400) {
    return ui.forgotIdentifierRequired;
  }

  if (error?.status === 429) {
    return ui.forgotTooManyRequests;
  }

  if (error?.status === 404 || isRouteMissingMessage(rawMessage)) {
    return ui.serviceUnavailable;
  }

  if (isLikelyNetworkError(error)) {
    return ui.networkError;
  }

  return rawMessage || ui.forgotRequestFailed;
};

const copyByLanguage = {
  en: {
    title: "Agent Portal",
    subtitle: "Secure access for BH Bank staff",
    accessBadge: "Secure staff session",
    emailLabel: "Agent email or username",
    emailPlaceholder: "name@bhbank.tn or AGT-001",
    passwordLabel: "Password",
    passwordPlaceholder: "Enter your password",
    rememberMe: "Remember my agent login",
    forgotPasswordAction: "Forgot your password?",
    forgotTitle: "Password reset request",
    forgotSubtitle: "An administrator must approve your request before a reset link is sent.",
    forgotIdentifierLabel: "Agent email or username",
    forgotIdentifierPlaceholder: "name@bhbank.tn or AGT-001",
    forgotIdentifierRequired: "Please enter your agent email or username.",
    forgotReasonLabel: "Reason (optional)",
    forgotReasonPlaceholder: "Example: lost password, locked account",
    forgotSubmit: "Send request",
    forgotSubmitting: "Sending...",
    forgotClose: "Close",
    forgotTooManyRequests: "Too many reset requests. Please wait before trying again.",
    forgotSuccess:
      "Your request was submitted. You will receive an email after the administrator decision.",
    forgotRequestFailed: "Unable to submit your reset request right now.",
    emailPasswordRequired: "Email/username and password are required.",
    invalidCredentials: "Email/username or password is incorrect.",
    invalidLoginInput: "Please verify your login details and try again.",
    lockoutMessage: "Too many attempts. Your account is temporarily locked.",
    networkError: "Network error. Check your connection and try again.",
    serviceUnavailable: "Authentication service is unavailable. Try again shortly.",
    loginFailedFallback: "Agent login failed.",
    signIn: "Sign in",
    loading: "Signing in...",
    scopeTitle: "After login, your dashboard is categorized",
    scopeProfile: "Client profile and household context",
    scopeFinance: "Financial indicators and borrowing capacity",
    scopeRisk: "Risk level and credit decision reasons",
    scopeProducts: "Existing products and cross-sell opportunities",
    workspaceTitle: "BH Agent Workspace",
    workspaceDescription:
      "This portal is reserved for BH Bank staff. Agent sessions use dedicated authentication and isolated local storage keys.",
    primaryInfoLabel: "Key login information",
    securityTitle: "Security and scope",
    securityEndpoint: "Dedicated endpoint: /api/auth/agent/login",
    securityRoutes: "Dedicated routes: /agent/login and /agent/dashboard",
    securityStorage: "Dedicated storage keys: bh_agent_*",
  },
  fr: {
    title: "Portail Agent",
    subtitle: "Acces securise pour les equipes BH Bank",
    accessBadge: "Session securisee equipes BH",
    emailLabel: "Email ou username agent",
    emailPlaceholder: "nom@bhbank.tn ou AGT-001",
    passwordLabel: "Mot de passe",
    passwordPlaceholder: "Entrez votre mot de passe",
    rememberMe: "Se souvenir de ma connexion agent",
    forgotPasswordAction: "Mot de passe oublie ?",
    forgotTitle: "Demande de reinitialisation",
    forgotSubtitle: "Un administrateur doit approuver votre demande avant l'envoi du lien de reinitialisation.",
    forgotIdentifierLabel: "Email ou username agent",
    forgotIdentifierPlaceholder: "nom@bhbank.tn ou AGT-001",
    forgotIdentifierRequired: "Veuillez saisir votre email ou username agent.",
    forgotReasonLabel: "Raison (optionnel)",
    forgotReasonPlaceholder: "Exemple: mot de passe perdu, compte bloque",
    forgotSubmit: "Envoyer la demande",
    forgotSubmitting: "Envoi...",
    forgotClose: "Fermer",
    forgotTooManyRequests: "Trop de demandes de reinitialisation. Veuillez patienter.",
    forgotSuccess:
      "Votre demande a ete envoyee. Vous recevrez un email apres la decision de l'administrateur.",
    forgotRequestFailed: "Impossible d'envoyer la demande de reinitialisation pour le moment.",
    emailPasswordRequired: "Email/username et mot de passe sont obligatoires.",
    invalidCredentials: "Email/username ou mot de passe incorrect.",
    invalidLoginInput: "Verifiez vos informations puis reessayez.",
    lockoutMessage: "Trop de tentatives. Votre compte est temporairement verrouille.",
    networkError: "Erreur reseau. Verifiez votre connexion puis reessayez.",
    serviceUnavailable: "Le service d'authentification est indisponible pour le moment.",
    loginFailedFallback: "Connexion agent impossible.",
    signIn: "Connexion",
    loading: "Connexion...",
    scopeTitle: "Apres connexion, votre dashboard est categorise",
    scopeProfile: "Profil client et contexte familial",
    scopeFinance: "Indicateurs financiers et capacite d'emprunt",
    scopeRisk: "Niveau de risque et raisons de decision credit",
    scopeProducts: "Produits existants et opportunites de cross-sell",
    workspaceTitle: "Espace Agent BH",
    workspaceDescription:
      "Ce portail est reserve aux equipes BH Bank. Les sessions agent utilisent une authentification dediee et des cles locales isolees.",
    primaryInfoLabel: "Informations principales",
    securityTitle: "Securite et perimetre",
    securityEndpoint: "Endpoint dedie: /api/auth/agent/login",
    securityRoutes: "Routes dediees: /agent/login et /agent/dashboard",
    securityStorage: "Cles de stockage dediees: bh_agent_*",
  },
  ar: {
    title: "بوابة الوكيل",
    subtitle: "دخول آمن لموظفي بنك BH",
    accessBadge: "جلسة موظفين آمنة",
    emailLabel: "بريد الوكيل أو اسم المستخدم",
    emailPlaceholder: "name@bhbank.tn أو AGT-001",
    passwordLabel: "كلمة المرور",
    passwordPlaceholder: "أدخل كلمة المرور",
    rememberMe: "تذكر تسجيل دخول الوكيل",
    forgotPasswordAction: "هل نسيت كلمة المرور؟",
    forgotTitle: "طلب إعادة تعيين كلمة المرور",
    forgotSubtitle: "يجب أن يوافق المسؤول على طلبك قبل إرسال رابط إعادة التعيين.",
    forgotIdentifierLabel: "بريد الوكيل أو اسم المستخدم",
    forgotIdentifierPlaceholder: "name@bhbank.tn أو AGT-001",
    forgotIdentifierRequired: "يرجى إدخال بريد الوكيل أو اسم المستخدم.",
    forgotReasonLabel: "السبب (اختياري)",
    forgotReasonPlaceholder: "مثال: فقدان كلمة المرور، حساب مقفل",
    forgotSubmit: "إرسال الطلب",
    forgotSubmitting: "جارٍ الإرسال...",
    forgotClose: "إغلاق",
    forgotTooManyRequests: "طلبات إعادة التعيين كثيرة جدًا. حاول لاحقًا.",
    forgotSuccess:
      "تم إرسال طلبك. ستتلقى رسالة بريد إلكتروني بعد قرار المسؤول.",
    forgotRequestFailed: "تعذر إرسال طلب إعادة التعيين حاليًا.",
    emailPasswordRequired: "بريد/اسم المستخدم وكلمة المرور مطلوبان.",
    invalidCredentials: "بريد/اسم المستخدم أو كلمة المرور غير صحيحة.",
    invalidLoginInput: "يرجى التحقق من بيانات الدخول ثم المحاولة مرة أخرى.",
    lockoutMessage: "محاولات كثيرة جدًا. تم قفل الحساب مؤقتًا.",
    networkError: "مشكلة في الشبكة. تحقق من الاتصال ثم أعد المحاولة.",
    serviceUnavailable: "خدمة المصادقة غير متاحة حاليًا. حاول بعد قليل.",
    loginFailedFallback: "فشل تسجيل دخول الوكيل.",
    signIn:  "تسجيل الدخول",
    loading: "جارٍ تسجيل الدخول...",
    scopeTitle: "بعد تسجيل الدخول، تصبح لوحة التحكم مصنفة",
    scopeProfile: "ملف العميل والسياق العائلي",
    scopeFinance: "المؤشرات المالية والقدرة على الاقتراض",
    scopeRisk: "مستوى المخاطر وأسباب قرار الائتمان",
    scopeProducts: "المنتجات الحالية وفرص البيع الإضافي",
    workspaceTitle: "مساحة وكيل BH",
    workspaceDescription:
      "هذه البوابة مخصصة لموظفي بنك BH. جلسات الوكيل تستخدم مصادقة مخصصة ومفاتيح تخزين محلية معزولة.",
    primaryInfoLabel: "معلومات تسجيل الدخول الأساسية",
    securityTitle: "الأمان والنطاق",
    securityEndpoint: "نقطة نهاية مخصصة: /api/auth/agent/login",
    securityRoutes: "مسارات مخصصة: /agent/login و /agent/dashboard",
    securityStorage: "مفاتيح تخزين مخصصة: bh_agent_*",
  },
};

const getLangKey = (language) => {
  if (language === "ar") return "ar";
  if (language === "en") return "en";
  return "fr";
};

export function AgentLoginPage() {
  const navigate = useNavigate();
  const { theme } = useTheme();
  const { language, setLanguage, isRTL } = useLanguage();

  const ui = copyByLanguage[getLangKey(language)] || copyByLanguage.fr;

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [rememberMe, setRememberMe] = useState(true);
  const [showPassword, setShowPassword] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [errorMessage, setErrorMessage] = useState("");
  const [forgotOpen, setForgotOpen] = useState(false);
  const [forgotIdentifier, setForgotIdentifier] = useState("");
  const [forgotReason, setForgotReason] = useState("");
  const [forgotSubmitting, setForgotSubmitting] = useState(false);
  const [forgotError, setForgotError] = useState("");
  const [forgotFeedback, setForgotFeedback] = useState("");
  const [isPortalChecking, setIsPortalChecking] = useState(true);

  useEffect(() => {
    let active = true;

    const bootstrapPortal = async () => {
      try {
        await checkAgentPortalAccess();
      } catch {
        if (active) {
          navigate("/login", { replace: true });
        }
        return;
      }

      if (!active) return;

      const savedEmail = localStorage.getItem(REMEMBER_AGENT_EMAIL_KEY) || "";
      if (savedEmail) {
        setEmail(savedEmail);
        setRememberMe(true);
      }

      if (getAgentAuthToken()) {
        const storedRole = String(localStorage.getItem(AGENT_ROLE_STORAGE_KEY) || "").toLowerCase();
        navigate(storedRole === "admin" ? "/agent/admin" : "/agent/dashboard", { replace: true });
        return;
      }

      setIsPortalChecking(false);
    };

    bootstrapPortal();

    return () => {
      active = false;
    };
  }, [navigate]);

  if (isPortalChecking) {
    return null;
  }

  const handleSubmit = async (event) => {
    event.preventDefault();
    if (isSubmitting) return;

    const identifier = email.trim();
    if (!identifier || !password.trim()) {
      setErrorMessage(ui.emailPasswordRequired);
      return;
    }

    try {
      setIsSubmitting(true);
      setErrorMessage("");
      clearAgentAuthSession();

      const normalizedIdentifier = identifier.includes("@")
        ? identifier.toLowerCase()
        : identifier.toUpperCase();

      const payload = await loginAgent({
        identifier: normalizedIdentifier,
        password,
      });

      if (rememberMe) {
        localStorage.setItem(REMEMBER_AGENT_EMAIL_KEY, normalizedIdentifier);
      } else {
        localStorage.removeItem(REMEMBER_AGENT_EMAIL_KEY);
      }

      setAgentAuthSession(payload);
      const role = String(payload?.agent?.role || "").toLowerCase();
      navigate(role === "admin" ? "/agent/admin" : "/agent/dashboard", { replace: true });
    } catch (error) {
      setErrorMessage(resolveAgentLoginError(error, ui));
    } finally {
      setIsSubmitting(false);
    }
  };

  const openForgotModal = () => {
    setForgotIdentifier(email.trim());
    setForgotReason("");
    setForgotError("");
    setForgotFeedback("");
    setForgotOpen(true);
  };

  const closeForgotModal = () => {
    if (forgotSubmitting) return;
    setForgotOpen(false);
  };

  const handleForgotSubmit = async (event) => {
    event.preventDefault();
    if (forgotSubmitting) return;

    const identifier = forgotIdentifier.trim();
    if (!identifier) {
      setForgotError(ui.forgotIdentifierRequired);
      return;
    }

    const normalizedIdentifier = identifier.includes("@")
      ? identifier.toLowerCase()
      : identifier.toUpperCase();

    try {
      setForgotSubmitting(true);
      setForgotError("");
      setForgotFeedback("");

      const payload = await requestAgentPasswordReset({
        identifier: normalizedIdentifier,
        reason: forgotReason,
      });

      setForgotFeedback(payload?.message || ui.forgotSuccess);
      setForgotReason("");
    } catch (error) {
      setForgotError(resolveAgentForgotError(error, ui));
    } finally {
      setForgotSubmitting(false);
    }
  };

  const organicShapes = [
    {
      top: "7%",
      left: "4%",
      size: 74,
      rotate: -18,
      radius: "46% 54% 58% 42% / 40% 44% 56% 60%",
      light: "radial-gradient(circle at 28% 26%, rgba(255, 230, 176, 0.95), rgba(198, 109, 214, 0.8) 52%, rgba(127, 73, 203, 0.7))",
      dark: "radial-gradient(circle at 30% 25%, rgba(255, 208, 140, 0.78), rgba(184, 90, 203, 0.68) 50%, rgba(99, 63, 188, 0.62))",
    },
    {
      top: "24%",
      left: "10%",
      size: 58,
      rotate: 12,
      radius: "54% 46% 42% 58% / 45% 58% 42% 55%",
      light: "radial-gradient(circle at 26% 24%, rgba(255, 222, 170, 0.92), rgba(220, 118, 206, 0.76) 56%, rgba(152, 88, 212, 0.66))",
      dark: "radial-gradient(circle at 26% 24%, rgba(255, 196, 132, 0.74), rgba(208, 98, 189, 0.62) 54%, rgba(118, 77, 204, 0.56))",
    },
    {
      bottom: "12%",
      left: "7%",
      size: 72,
      rotate: -8,
      radius: "44% 56% 50% 50% / 58% 40% 60% 42%",
      light: "radial-gradient(circle at 34% 24%, rgba(255, 230, 180, 0.88), rgba(211, 115, 209, 0.74) 52%, rgba(138, 82, 205, 0.64))",
      dark: "radial-gradient(circle at 34% 24%, rgba(250, 196, 136, 0.72), rgba(191, 94, 193, 0.6) 52%, rgba(102, 70, 186, 0.56))",
    },
    {
      top: "10%",
      right: "18%",
      size: 44,
      rotate: 18,
      radius: "60% 40% 55% 45% / 38% 62% 38% 62%",
      light: "radial-gradient(circle at 30% 26%, rgba(255, 236, 196, 0.9), rgba(199, 119, 220, 0.68) 50%, rgba(96, 145, 238, 0.6))",
      dark: "radial-gradient(circle at 30% 26%, rgba(255, 210, 152, 0.74), rgba(184, 102, 207, 0.56) 52%, rgba(84, 127, 210, 0.52))",
    },
  ];

  return (
    <div className={`relative min-h-screen overflow-hidden ${theme === "dark" ? "bg-[#0d1628]" : "bg-[#edf2f9]"}`} dir={isRTL ? "rtl" : "ltr"}>
      <div
        className="pointer-events-none absolute inset-0"
        style={{
          backgroundImage:
            theme === "dark"
              ? "radial-gradient(circle at 10% 16%, rgba(10,77,179,0.14) 0%, rgba(10,77,179,0) 44%), radial-gradient(circle at 90% 10%, rgba(215,25,32,0.10) 0%, rgba(215,25,32,0) 40%), radial-gradient(circle at 84% 84%, rgba(10,34,64,0.16) 0%, rgba(10,34,64,0) 48%)"
              : "radial-gradient(circle at 11% 18%, rgba(10,77,179,0.10) 0%, rgba(10,77,179,0) 44%), radial-gradient(circle at 91% 11%, rgba(215,25,32,0.08) 0%, rgba(215,25,32,0) 40%), radial-gradient(circle at 84% 86%, rgba(10,34,64,0.08) 0%, rgba(10,34,64,0) 48%)",
        }}
      />

      {organicShapes.map((shape, index) => (
        <div
          key={`organic-shape-${index}`}
          className="pointer-events-none absolute hidden lg:block shadow-[0_10px_25px_rgba(10,34,64,0.18)]"
          style={{
            top: shape.top,
            right: shape.right,
            bottom: shape.bottom,
            left: shape.left,
            width: shape.size,
            height: shape.size,
            borderRadius: shape.radius,
            background: theme === "dark" ? shape.dark : shape.light,
            transform: `rotate(${shape.rotate}deg)`,
            opacity: theme === "dark" ? 0.68 : 0.58,
          }}
        />
      ))}

      <div className={`pointer-events-none absolute -left-36 top-6 h-104 w-104 rounded-full border ${theme === "dark" ? "border-blue-200/15" : "border-[#0A2240]/10"}`} />
      <div className={`pointer-events-none absolute -right-28 -bottom-28 h-80 w-80 rounded-[5rem] border ${theme === "dark" ? "border-red-200/15" : "border-[#D71920]/12"}`} />
      <div className={`pointer-events-none absolute right-[15%] top-[16%] h-16 w-16 rotate-45 rounded-xl border ${theme === "dark" ? "border-slate-200/20" : "border-[#0A4DB3]/14"}`} />

      <div className="pointer-events-none absolute -left-20 top-0 h-72 w-72 rounded-full bg-[#0A2240]/10 blur-3xl" />
      <div className="pointer-events-none absolute -right-20 bottom-0 h-80 w-80 rounded-full bg-[#D71920]/7 blur-3xl" />

      <div className="fixed right-3 top-1/2 z-30 -translate-y-1/2 sm:right-5">
        <div
          className={`inline-flex flex-col items-stretch gap-1 rounded-2xl border p-1.5 ${
            theme === "dark" ? "border-white/20 bg-[#0f1d34]" : "border-[#d4ddec] bg-[#f4f7fc]"
          }`}
        >
          {languageOptions.map((item) => {
            const isActive = language === item.code;
            return (
              <button
                key={item.code}
                type="button"
                onClick={() => setLanguage(item.code)}
                className={`inline-flex h-9 w-9 items-center justify-center rounded-xl text-[11px] font-semibold transition ${
                  isActive
                    ? theme === "dark"
                      ? "bg-[#1f4b8f] text-white"
                      : "bg-[#0A2240] text-white"
                    : theme === "dark"
                      ? "text-white/85 hover:bg-white/10"
                      : "text-[#3d5174] hover:bg-[#e7eef9]"
                }`}
                aria-pressed={isActive}
                aria-label={item.aria}
              >
                <img src={item.flag} alt={item.flagAlt} className="h-4 w-4 rounded-full object-cover" />
              </button>
            );
          })}
        </div>
      </div>

      <div className="relative z-10 mx-auto flex min-h-screen w-full max-w-4xl items-center justify-center px-4 py-6 sm:px-6">
        <div className="grid w-full max-w-2xl gap-6">
          <section
            className={`rounded-3xl border p-6 sm:p-7 ${
              theme === "dark"
                ? "border-white/10 bg-[#111f37]/95 text-white shadow-[0_18px_35px_rgba(0,0,0,0.35)]"
                : "border-[#dbe4f2] bg-white text-[#13233f] shadow-[0_16px_32px_rgba(18,35,65,0.09)]"
            }`}
          >
            <div className="mb-7 space-y-4">
              <div className="flex justify-center">
                <img src={logoExpanded} alt="BH Bank" className="h-10 w-auto" />
              </div>

              <div className="text-center">
                <h1 className="text-2xl font-extrabold tracking-tight sm:text-[1.85rem]">{ui.title}</h1>
                <p className={`mt-1 text-sm ${theme === "dark" ? "text-white/75" : "text-[#60718f]"}`}>
                  {ui.subtitle}
                </p>
              </div>
            </div>

            <form className="space-y-5" onSubmit={handleSubmit}>
              <div>
                <label className={`mb-2 block text-sm font-medium ${isRTL ? "text-right" : "text-left"}`}>{ui.emailLabel}</label>
                <div className="relative">
                  <Mail
                    size={18}
                    className={`pointer-events-none absolute top-1/2 -translate-y-1/2 ${
                      isRTL ? "right-4" : "left-4"
                    } ${theme === "dark" ? "text-white/50" : "text-[#7384a4]"}`}
                  />
                  <input
                    type="text"
                    name="username"
                    value={email}
                    onChange={(event) => setEmail(event.target.value)}
                    autoComplete="username"
                    placeholder={ui.emailPlaceholder}
                    className={`w-full rounded-xl border py-3 text-sm ${
                      isRTL ? "pr-11 pl-3 text-right" : "pl-11 pr-3 text-left"
                    } ${
                      theme === "dark"
                        ? "border-white/15 bg-[#0c1628] text-white placeholder:text-white/35"
                        : "border-[#d7e0ee] bg-[#fbfcff] text-[#13233f] placeholder:text-[#95a2b9]"
                    }`}
                    required
                  />
                </div>
              </div>

              <div>
                <label className={`mb-2 block text-sm font-medium ${isRTL ? "text-right" : "text-left"}`}>{ui.passwordLabel}</label>
                <div className="relative">
                  <Lock
                    size={18}
                    className={`pointer-events-none absolute top-1/2 -translate-y-1/2 ${
                      isRTL ? "right-4" : "left-4"
                    } ${theme === "dark" ? "text-white/50" : "text-[#7384a4]"}`}
                  />
                  <input
                    type={showPassword ? "text" : "password"}
                    name="current-password"
                    value={password}
                    onChange={(event) => setPassword(event.target.value)}
                    autoComplete="current-password"
                    placeholder={ui.passwordPlaceholder}
                    className={`w-full rounded-xl border py-3 text-sm ${
                      isRTL ? "pr-11 pl-11 text-right" : "pl-11 pr-11 text-left"
                    } ${
                      theme === "dark"
                        ? "border-white/15 bg-[#0c1628] text-white placeholder:text-white/35"
                        : "border-[#d7e0ee] bg-[#fbfcff] text-[#13233f] placeholder:text-[#95a2b9]"
                    }`}
                    required
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword((prev) => !prev)}
                    className={`absolute top-1/2 -translate-y-1/2 ${isRTL ? "left-4" : "right-4"} ${
                      theme === "dark" ? "text-white/65" : "text-[#7384a4]"
                    }`}
                  >
                    {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
                  </button>
                </div>
              </div>

              <div className={`flex flex-wrap items-center justify-between gap-3 pt-1 ${isRTL ? "flex-row-reverse" : ""}`}>
                <label className={`inline-flex items-center gap-2 text-sm ${isRTL ? "flex-row-reverse" : ""}`}>
                  <input
                    type="checkbox"
                    checked={rememberMe}
                    onChange={(event) => setRememberMe(event.target.checked)}
                    className="h-4 w-4 rounded border-gray-300 text-[#0A2240]"
                  />
                  <span>{ui.rememberMe}</span>
                </label>
                <button
                  type="button"
                  onClick={openForgotModal}
                  className={`inline-flex text-sm font-semibold underline-offset-4 hover:underline ${
                    theme === "dark" ? "text-[#a8c4ff]" : "text-[#0A2240]"
                  }`}
                >
                  {ui.forgotPasswordAction}
                </button>
              </div>

              {errorMessage && (
                <p className={`rounded-xl border px-3 py-2 text-sm ${
                  theme === "dark"
                    ? "border-red-900/60 bg-red-950/40 text-red-300"
                    : "border-red-200 bg-red-50 text-red-700"
                } ${isRTL ? "text-right" : "text-left"}`}>
                  {errorMessage}
                </p>
              )}

              <button
                type="submit"
                disabled={isSubmitting}
                className="inline-flex w-full items-center justify-center gap-2 rounded-2xl bg-[#0A2240] px-4 py-3 text-sm font-semibold text-white transition hover:bg-[#122f57] disabled:cursor-not-allowed disabled:opacity-60"
              >
                
                {isSubmitting ? ui.loading : ui.signIn}
              </button>
            </form>
          </section>
        </div>
      </div>

      {forgotOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-[#081326]/65 px-4" onClick={closeForgotModal}>
          <div
            className={`w-full max-w-md rounded-3xl border p-5 sm:p-6 ${
              theme === "dark"
                ? "border-white/15 bg-[#0f1e36] text-white shadow-[0_20px_40px_rgba(0,0,0,0.45)]"
                : "border-[#d8e1ef] bg-white text-[#14233e] shadow-[0_20px_40px_rgba(18,35,65,0.2)]"
            }`}
            onClick={(event) => event.stopPropagation()}
          >
            <div className={`mb-3 flex items-center justify-between gap-3 ${isRTL ? "flex-row-reverse" : ""}`}>
              <h2 className="text-lg font-bold">{ui.forgotTitle}</h2>
              <button
                type="button"
                onClick={closeForgotModal}
                className={`rounded-xl border px-3 py-1.5 text-sm font-medium ${
                  theme === "dark"
                    ? "border-white/20 text-white/90 hover:bg-white/10"
                    : "border-[#d4ddec] text-[#0A2240] hover:bg-[#eff4fb]"
                }`}
              >
                {ui.forgotClose}
              </button>
            </div>

            <p className={`text-sm ${theme === "dark" ? "text-white/75" : "text-[#5d7091]"}`}>{ui.forgotSubtitle}</p>

            <form className="mt-5 space-y-4" onSubmit={handleForgotSubmit}>
              <div>
                <label className={`mb-2 block text-sm font-medium ${isRTL ? "text-right" : "text-left"}`}>
                  {ui.forgotIdentifierLabel}
                </label>
                <input
                  type="text"
                  value={forgotIdentifier}
                  onChange={(event) => setForgotIdentifier(event.target.value)}
                  placeholder={ui.forgotIdentifierPlaceholder}
                  className={`w-full rounded-xl border px-3 py-3 ${
                    isRTL ? "text-right" : "text-left"
                  } ${
                    theme === "dark"
                      ? "border-white/15 bg-[#0c1628] text-white placeholder:text-white/35"
                      : "border-[#d7e0ee] bg-[#fbfcff] text-[#13233f] placeholder:text-[#95a2b9]"
                  }`}
                  required
                />
              </div>

              <div>
                <label className={`mb-2 block text-sm font-medium ${isRTL ? "text-right" : "text-left"}`}>
                  {ui.forgotReasonLabel}
                </label>
                <textarea
                  rows={3}
                  value={forgotReason}
                  onChange={(event) => setForgotReason(event.target.value)}
                  placeholder={ui.forgotReasonPlaceholder}
                  className={`w-full rounded-xl border px-3 py-2.5 ${
                    isRTL ? "text-right" : "text-left"
                  } ${
                    theme === "dark"
                      ? "border-white/15 bg-[#0c1628] text-white placeholder:text-white/35"
                      : "border-[#d7e0ee] bg-[#fbfcff] text-[#13233f] placeholder:text-[#95a2b9]"
                  }`}
                />
              </div>

              {forgotError && (
                <p
                  className={`rounded-xl border px-3 py-2 text-sm ${
                    theme === "dark"
                      ? "border-red-900/60 bg-red-950/40 text-red-300"
                      : "border-red-200 bg-red-50 text-red-700"
                  } ${isRTL ? "text-right" : "text-left"}`}
                >
                  {forgotError}
                </p>
              )}

              {forgotFeedback && (
                <p
                  className={`rounded-xl border px-3 py-2 text-sm ${
                    theme === "dark"
                      ? "border-emerald-800/60 bg-emerald-950/35 text-emerald-200"
                      : "border-emerald-200 bg-emerald-50 text-emerald-700"
                  } ${isRTL ? "text-right" : "text-left"}`}
                >
                  {forgotFeedback}
                </p>
              )}

              <button
                type="submit"
                disabled={forgotSubmitting}
                className="inline-flex w-full items-center justify-center rounded-2xl bg-[#0A2240] px-4 py-2.5 text-sm font-semibold text-white transition hover:bg-[#122f57] disabled:cursor-not-allowed disabled:opacity-60"
              >
                {forgotSubmitting ? ui.forgotSubmitting : ui.forgotSubmit}
              </button>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
