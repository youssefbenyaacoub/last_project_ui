import { useMemo, useState } from "react";
import { useNavigate } from "react-router";
import { motion as Motion, AnimatePresence } from "framer-motion";
import {
  AlertCircle,
  Check,
  CreditCard,
  Eye,
  EyeOff,
  House,
  KeyRound,
  Lock,
  Mail,
  ShieldCheck,
  User,
} from "lucide-react";
import { useTheme } from "../contexts/ThemeContext";
import { useLanguage } from "../contexts/LanguageContext";
import logoWhite from "../assets/bh_logo_blanc.png";
import flagAr from "../assets/flags/Flag_of_Tunisia.svg.webp";
import flagEn from "../assets/flags/Flag_of_the_United_Kingdom_(3-5).svg.webp";
import flagFr from "../assets/flags/Flag_of_France.svg.png";
import {
  completeSigninRegistration,
  requestSigninEmailCode,
  setAuthSession,
  verifySigninEmailCode,
} from "../api";

const LABELS = {
  fr: {
    steps: ["Email", "Code email", "Securite", "Mot de passe"],
    stepSidebarTitles: [
      "Identification Email",
      "Code de Verification",
      "Validation Securite",
      "Mot de Passe",
    ],
    stepDetails: [
      "Verification de votre adresse email associee au compte BH",
      "Authentification par code a 6 chiffres",
      "Controle des informations personnelles",
      "Configuration de vos acces securises",
    ],
    activeTag: "EN COURS",
    title: "Activez votre espace client BH",
    subtitle: "Parcours securise en 4 etapes pour finaliser votre acces.",
    hintEmail: "Saisissez l'email deja associe a votre compte BH.",
    hintCode: "Saisissez le code a 6 chiffres envoye par email.",
    hintSecurity: "Choisissez une seule preuve de securite.",
    hintPassword: "Creez un mot de passe fort pour vos prochaines connexions.",
    sendCode: "Envoyer code",
    verifyCode: "Verifier code",
    continue: "Continuer",
    create: "Creer compte",
    back: "Retour",
    home: "Accueil",
    resend: "Renvoyer",
    noCode: "Code non recu ?",
    emailPlaceholder: "Entrez votre email",
    modePhrase: "Phrase secrete",
    modeTransaction: "Derniere transaction",
    phrasePlaceholder: "Votre phrase secrete",
    amountPlaceholder: "Montant de la derniere transaction",
    passwordPlaceholder: "Mot de passe",
    confirmPasswordPlaceholder: "Confirmer mot de passe",
    passwordHint: "8+ caracteres, 1 majuscule, 1 chiffre",
    haveAccount: "Vous avez deja un compte ?",
    signIn: "Se connecter",
    faq: "FAQ",
    leftBadge: "",
    leftText: "",
    loading: "Traitement...",
    errCode: "Le code doit contenir 6 chiffres.",
    errPhrase: "La phrase secrete doit contenir au moins 4 caracteres.",
    errAmount: "Montant invalide.",
    errPassword: "Mot de passe faible.",
    errMatch: "Les mots de passe ne correspondent pas.",
    errEmail: "Entrez une adresse email valide.",
    errCodeInvalid: "Code invalide ou expire. Verifiez le code recu puis reessayez.",
    errSecurityProof: "La preuve de securite est invalide. Verifiez les informations saisies.",
    errNetwork: "Erreur reseau. Verifiez votre connexion puis reessayez.",
    errTooMany: "Trop de tentatives. Merci de patienter avant de reessayer.",
    errSendCodeFailed: "Impossible d'envoyer le code de verification pour le moment.",
    errVerifyCodeFailed: "Impossible de verifier le code pour le moment.",
    errCreateFailed: "Impossible de finaliser l'inscription pour le moment.",
    errResendFailed: "Impossible de renvoyer le code pour le moment.",
    errRouteMissing: "Service d'inscription indisponible. Redemarrez le backend puis reessayez.",
  },
  en: {
    steps: ["Email", "Email code", "Security", "Password"],
    stepSidebarTitles: [
      "Email Identification",
      "Verification Code",
      "Security Validation",
      "Password Setup",
    ],
    stepDetails: [
      "Verification of the email linked to your BH account",
      "Two-factor authentication with your 6-digit code",
      "Personal information security check",
      "Configuration of your secure access",
    ],
    activeTag: "IN PROGRESS",
    title: "Activate your BH client space",
    subtitle: "Complete this secure 4-step journey to finalize your access.",
    hintEmail: "Enter the email already linked to your BH account.",
    hintCode: "Enter the 6-digit code sent by email.",
    hintSecurity: "Choose one security proof.",
    hintPassword: "Create a strong password for your next sign-ins.",
    sendCode: "Send code",
    verifyCode: "Verify code",
    continue: "Continue",
    create: "Create account",
    back: "Back",
    home: "Home",
    resend: "Resend",
    noCode: "Code not received?",
    emailPlaceholder: "Enter your email",
    modePhrase: "Secret phrase",
    modeTransaction: "Last transaction",
    phrasePlaceholder: "Your secret phrase",
    amountPlaceholder: "Last transaction amount",
    passwordPlaceholder: "Password",
    confirmPasswordPlaceholder: "Confirm password",
    passwordHint: "8+ chars, 1 uppercase, 1 digit",
    haveAccount: "Already have an account?",
    signIn: "Sign in",
    faq: "FAQ",
    leftBadge: "",
    leftText: "",
    loading: "Processing...",
    errCode: "Code must contain 6 digits.",
    errPhrase: "Secret phrase must contain at least 4 characters.",
    errAmount: "Invalid amount.",
    errPassword: "Password is too weak.",
    errMatch: "Passwords do not match.",
    errEmail: "Enter a valid email address.",
    errCodeInvalid: "Invalid or expired code. Check your email and try again.",
    errSecurityProof: "Security proof is invalid. Check your information and try again.",
    errNetwork: "Network error. Check your connection and try again.",
    errTooMany: "Too many attempts. Please wait before trying again.",
    errSendCodeFailed: "Unable to send verification code right now.",
    errVerifyCodeFailed: "Unable to verify the code right now.",
    errCreateFailed: "Unable to complete sign-up right now.",
    errResendFailed: "Unable to resend code right now.",
    errRouteMissing: "Sign-in service is unavailable. Restart the backend and try again.",
  },
  ar: {
    steps: ["البريد الإلكتروني", "رمز البريد", "الأمان", "كلمة المرور"],
    stepSidebarTitles: [
      "تحديد البريد الإلكتروني",
      "رمز التحقق",
      "التحقق الأمني",
      "كلمة المرور",
    ],
    stepDetails: [
      "التحقق من البريد الإلكتروني المرتبط بحسابك لدى BH",
      "مصادقة ثنائية عبر رمز مكون من 6 أرقام",
      "مراجعة معلومات الأمان الشخصية",
      "إعداد وصول آمن إلى حسابك",
    ],
    activeTag: "قيد التنفيذ",
    title: "تفعيل فضاء الحريف لدى BH",
    subtitle: "أكمل هذا المسار الآمن المكوّن من 4 مراحل لإتمام الوصول.",
    hintEmail: "أدخل البريد الإلكتروني المرتبط مسبقًا بحسابك لدى BH.",
    hintCode: "أدخل الرمز المكوّن من 6 أرقام المرسل عبر البريد الإلكتروني.",
    hintSecurity: "اختر وسيلة واحدة لإثبات الأمان.",
    hintPassword: "أنشئ كلمة مرور قوية لعمليات الدخول القادمة.",
    sendCode: "إرسال الرمز",
    verifyCode: "تأكيد الرمز",
    continue: "متابعة",
    create: "إنشاء الحساب",
    back: "رجوع",
    home: "الرئيسية",
    resend: "إعادة الإرسال",
    noCode: "لم يصلك الرمز؟",
    emailPlaceholder: "أدخل بريدك الإلكتروني",
    modePhrase: "عبارة سرية",
    modeTransaction: "آخر عملية",
    phrasePlaceholder: "عبارتك السرية",
    amountPlaceholder: "مبلغ آخر عملية",
    passwordPlaceholder: "كلمة المرور",
    confirmPasswordPlaceholder: "تأكيد كلمة المرور",
    passwordHint: "8 أحرف على الأقل، حرف كبير واحد، ورقم واحد",
    haveAccount: "لديك حساب بالفعل؟",
    signIn: "تسجيل الدخول",
    faq: "الأسئلة الشائعة",
    leftBadge: "",
    leftText: "",
    loading: "جارٍ المعالجة...",
    errCode: "يجب أن يتكون الرمز من 6 أرقام.",
    errPhrase: "يجب أن تحتوي العبارة السرية على 4 أحرف على الأقل.",
    errAmount: "مبلغ غير صالح.",
    errPassword: "كلمة المرور ضعيفة.",
    errMatch: "كلمتا المرور غير متطابقتين.",
    errEmail: "يرجى إدخال بريد إلكتروني صالح.",
    errCodeInvalid: "الرمز غير صالح أو منتهي الصلاحية. تحقق من الرمز ثم أعد المحاولة.",
    errSecurityProof: "بيانات التحقق الأمني غير صحيحة. يرجى المراجعة والمحاولة مجددًا.",
    errNetwork: "مشكلة في الشبكة. تحقق من الاتصال ثم أعد المحاولة.",
    errTooMany: "محاولات كثيرة جدا. يرجى الانتظار قبل إعادة المحاولة.",
    errSendCodeFailed: "تعذر إرسال رمز التحقق حاليا.",
    errVerifyCodeFailed: "تعذر التحقق من الرمز حاليا.",
    errCreateFailed: "تعذر إكمال إنشاء الحساب حاليا.",
    errResendFailed: "تعذر إعادة إرسال الرمز حاليا.",
    errRouteMissing: "خدمة التسجيل غير متاحة حاليا. أعد تشغيل الخادم ثم حاول مجددًا.",
  },
};

const LANGUAGE_OPTIONS = [
  {
    code: "ar",
    label: "AR",
    flag: flagAr,
    flagAlt: "Tunisia flag",
    aria: "Switch to Arabic",
  },
  {
    code: "en",
    label: "EN",
    flag: flagEn,
    flagAlt: "United Kingdom flag",
    aria: "Switch to English",
  },
  {
    code: "fr",
    label: "FR",
    flag: flagFr,
    flagAlt: "France flag",
    aria: "Switch to French",
  },
];

const CODE_LENGTH = 6;

const toAsciiDigits = (value) =>
  String(value || "")
    .replace(/[٠-٩]/g, (digit) => String(digit.charCodeAt(0) - 1632))
    .replace(/[۰-۹]/g, (digit) => String(digit.charCodeAt(0) - 1776));

const extractCodeDigits = (value) =>
  toAsciiDigits(value)
    .replace(/\D/g, "")
    .slice(0, CODE_LENGTH)
    .split("");

const isStrongPassword = (value) => {
  const password = String(value || "");
  return password.length >= 8 && /[A-Z]/.test(password) && /\d/.test(password);
};

const isRouteMissingMessage = (message) =>
  /(endpoint api introuvable|requested url was not found on the server)/i.test(String(message || ""));

const isLikelyNetworkError = (error) => {
  if (!error) return false;
  if (typeof error.status === "number") return false;
  const message = String(error.message || "").toLowerCase();
  return message.includes("failed to fetch") || message.includes("network") || message.includes("offline");
};

const resolveSigninApiError = (error, labels, context = "generic") => {
  const rawMessage = String(error?.message || "").trim();
  const normalized = rawMessage.toLowerCase();

  if (error?.status === 404 || isRouteMissingMessage(rawMessage)) {
    return labels.errRouteMissing;
  }

  if (isLikelyNetworkError(error)) {
    return labels.errNetwork;
  }

  if (error?.status === 429 || /(too many|trop de tentatives|locked)/i.test(rawMessage)) {
    return labels.errTooMany;
  }

  if (/email invalide|invalid email/.test(normalized)) {
    return labels.errEmail;
  }

  if (/code invalide|invalid code|expire/.test(normalized)) {
    return labels.errCodeInvalid;
  }

  if (/phrase secrete invalide|transaction invalide|does not match/.test(normalized)) {
    return labels.errSecurityProof;
  }

  if (context === "requestCode") {
    if (error?.status === 400) return labels.errEmail;
    return labels.errSendCodeFailed;
  }

  if (context === "verifyCode") {
    if (error?.status === 400 || error?.status === 401 || error?.status === 403) {
      return labels.errCodeInvalid;
    }
    return labels.errVerifyCodeFailed;
  }

  if (context === "complete") {
    if (error?.status === 401 || error?.status === 403) {
      return labels.errSecurityProof;
    }
    return labels.errCreateFailed;
  }

  if (context === "resend") {
    if (error?.status === 400) return labels.errEmail;
    return labels.errResendFailed;
  }

  return rawMessage || labels.errCreateFailed;
};

const STEP_ANIMATION = {
  initial: { opacity: 0, x: -20 },
  animate: { opacity: 1, x: 0 },
  exit: { opacity: 0, x: 20 },
  transition: { duration: 0.3, ease: "easeOut" },
};

const STEP_ICONS = [Mail, KeyRound, ShieldCheck, Lock];

export function SignInPage() {
  const navigate = useNavigate();
  const { theme } = useTheme();
  const { language, setLanguage, isRTL } = useLanguage();
  const t = useMemo(() => LABELS[language] || LABELS.fr, [language]);

  const [step, setStep] = useState(1);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const [email, setEmail] = useState("");
  const [code, setCode] = useState(() => Array.from({ length: CODE_LENGTH }, () => ""));
  const [securityMode, setSecurityMode] = useState("phrase");
  const [securityPhrase, setSecurityPhrase] = useState("");
  const [lastTransactionAmount, setLastTransactionAmount] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);

  const isDark = theme === "dark";
  const normalizedEmail = email.trim().toLowerCase();

  const alignClass = isRTL ? "text-right" : "text-left";
  const baseInputClass = `w-full border rounded-xl py-4 placeholder:text-gray-400 focus:outline-none focus:border-[#242f54] focus:ring-2 focus:ring-[#242f54]/20 transition-all cursor-text ${
    isDark
      ? "bg-gray-800 border-gray-700 text-white"
      : "bg-white border-gray-300 text-gray-900"
  } ${alignClass}`;
  const inputStyle = isRTL
    ? { paddingRight: "3rem", paddingLeft: "1rem" }
    : { paddingLeft: "3rem", paddingRight: "1rem" };
  const iconStyle = isRTL ? { right: "1rem" } : { left: "1rem" };
  const toggleStyle = isRTL ? { left: "1rem" } : { right: "1rem" };

  const currentHint =
    step === 1
      ? t.hintEmail
      : step === 2
        ? t.hintCode
        : step === 3
          ? t.hintSecurity
          : t.hintPassword;

  const errorBanner = error ? (
    <Motion.div
      initial={{ opacity: 0, y: 8 }}
      animate={{ opacity: 1, y: 0 }}
      className={`rounded-2xl border p-3 ${
        isDark ? "border-red-800/45 bg-red-950/30" : "border-red-200 bg-red-50"
      }`}
    >
      <div className={`flex items-start gap-2.5 ${isRTL ? "flex-row-reverse text-right" : "text-left"}`}>
        <AlertCircle className={`mt-0.5 h-4 w-4 shrink-0 ${isDark ? "text-red-300" : "text-red-700"}`} />
        <p className={`text-sm ${isDark ? "text-red-100" : "text-red-700"}`}>{error}</p>
      </div>
    </Motion.div>
  ) : null;

  const verifyStepTwoCode = async (rawCode, { showLengthError = true } = {}) => {
    if (step !== 2 || loading) return false;

    const joinedCode = extractCodeDigits(rawCode).join("");
    if (joinedCode.length !== CODE_LENGTH) {
      if (showLengthError) setError(t.errCode);
      return false;
    }

    try {
      setLoading(true);
      setError("");
      await verifySigninEmailCode({ email: normalizedEmail, code: joinedCode });
      setStep(3);
      return true;
    } catch (e) {
      setError(resolveSigninApiError(e, t, "verifyCode"));
      return false;
    } finally {
      setLoading(false);
    }
  };

  const updateCodeDigit = (index, value) => {
    const normalized = toAsciiDigits(value).replace(/\D/g, "").slice(-1);
    const next = [...code];
    next[index] = normalized;
    setCode(next);
    setError("");

    if (normalized && index < CODE_LENGTH - 1) {
      document.getElementById(`signin-code-${index + 1}`)?.focus();
    }

    if (next.every((digit) => digit !== "")) {
      void verifyStepTwoCode(next.join(""), { showLengthError: false });
    }
  };

  const handleCodePaste = (event) => {
    event.preventDefault();
    const pastedDigits = extractCodeDigits(
      event.clipboardData?.getData("text") || event.nativeEvent?.clipboardData?.getData("text") || "",
    );
    if (pastedDigits.length === 0) return;

    const next = Array.from({ length: CODE_LENGTH }, (_, index) => pastedDigits[index] || "");
    setCode(next);
    setError("");

    if (pastedDigits.length === CODE_LENGTH) {
      void verifyStepTwoCode(next.join(""), { showLengthError: false });
      return;
    }

    const nextIndex = Math.min(pastedDigits.length, CODE_LENGTH - 1);
    document.getElementById(`signin-code-${nextIndex}`)?.focus();
  };

  const handleContinue = async () => {
    setError("");
    if (step === 1) {
      const hasValidEmail = /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(normalizedEmail);
      if (!hasValidEmail) {
        setError(t.errEmail);
        return;
      }

      try {
        setLoading(true);
        await requestSigninEmailCode({ email: normalizedEmail });
        setStep(2);
      } catch (e) {
        setError(resolveSigninApiError(e, t, "requestCode"));
      } finally {
        setLoading(false);
      }
      return;
    }

    if (step === 2) {
      await verifyStepTwoCode(code.join(""));
      return;
    }

    if (step === 3) {
      if (securityMode === "phrase" && securityPhrase.trim().length < 4) {
        setError(t.errPhrase);
        return;
      }
      if (securityMode === "transaction") {
        const amount = String(lastTransactionAmount || "").trim().replace(",", ".");
        if (!amount || Number.isNaN(Number(amount))) {
          setError(t.errAmount);
          return;
        }
      }
      setStep(4);
      return;
    }

    if (password !== confirmPassword) {
      setError(t.errMatch);
      return;
    }
    if (!isStrongPassword(password)) {
      setError(t.errPassword);
      return;
    }

    const payload = { email: normalizedEmail, password };
    if (securityMode === "phrase") {
      payload.login_phrase = securityPhrase;
    } else {
      payload.last_transaction_amount = String(lastTransactionAmount || "").trim();
    }

    try {
      setLoading(true);
      const authPayload = await completeSigninRegistration(payload);
      setAuthSession(authPayload);
      navigate("/dashboard");
    } catch (e) {
      setError(resolveSigninApiError(e, t, "complete"));
    } finally {
      setLoading(false);
    }
  };

  const handleBack = () => {
    setError("");
    if (step > 1) setStep((prev) => prev - 1);
  };

  const resendCode = async () => {
    const hasValidEmail = /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(normalizedEmail);
    if (!hasValidEmail) {
      setError(t.errEmail);
      return;
    }

    try {
      setLoading(true);
      setError("");
      await requestSigninEmailCode({ email: normalizedEmail });
    } catch (e) {
      setError(resolveSigninApiError(e, t, "resend"));
    } finally {
      setLoading(false);
    }
  };

  return (
    <div
      dir={isRTL ? "rtl" : "ltr"}
      className={`min-h-screen flex ${isDark ? "bg-gray-900" : ""}`}
    >
      <div
        className={`w-full lg:w-1/2 ${isDark ? "bg-gray-900" : "bg-white"} flex items-center justify-center p-8 overflow-y-auto`}
      >
        <Motion.div
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.6, delay: 0.2 }}
          className="w-full max-w-md"
        >
          <div
            className={`mb-8 flex items-center ${isRTL ? "justify-end" : "justify-start"}`}
          >
            <button
              type="button"
              onClick={() => navigate("/")}
              className={`inline-flex items-center gap-2 rounded-full px-4 py-2 text-sm font-medium transition-colors cursor-pointer ${
                isDark
                  ? "border border-gray-700 text-gray-200 hover:bg-gray-800"
                  : "border border-[#242f54]/20 text-[#242f54] hover:bg-[#242f54]/5"
              } ${isRTL ? "flex-row-reverse" : ""}`}
            >
              <House size={16} />
              {t.home}
            </button>
          </div>

          <div className="mb-5 flex flex-wrap gap-2 lg:hidden">
            {t.steps.map((label, index) => {
              const current = index + 1;
              const done = step > current;
              const active = step === current;
              return (
                <span
                  key={label}
                  className={`inline-flex items-center gap-1 rounded-full px-3 py-1 text-xs font-medium ${
                    active
                      ? "bg-[#242f54] text-white"
                      : done
                        ? "bg-emerald-100 text-emerald-700"
                        : isDark
                          ? "bg-gray-800 text-gray-300"
                          : "bg-gray-100 text-gray-700"
                  }`}
                >
                  {done ? <Check size={12} /> : current}
                  {label}
                </span>
              );
            })}
          </div>

          <AnimatePresence mode="wait">
            {step === 1 && (
              <Motion.div key="step1" {...STEP_ANIMATION}>
                <h1
                  className={`mb-2 text-[36px] ${
                    isDark ? "text-white" : "text-gray-900"
                  } ${alignClass}`}
                >
                  {t.title}
                </h1>
                <p
                  className={`mb-1 ${
                    isDark ? "text-gray-400" : "text-gray-600"
                  } ${alignClass}`}
                >
                  {t.subtitle}
                </p>
                <p
                  className={`mb-8 text-sm ${
                    isDark ? "text-gray-300" : "text-gray-700"
                  } ${alignClass}`}
                >
                  {currentHint}
                </p>

                <div className="space-y-6">
                  <div className="relative">
                    <div
                      className={`absolute top-1/2 -translate-y-1/2 ${
                        isDark ? "text-gray-500" : "text-gray-400"
                      }`}
                      style={iconStyle}
                    >
                      <Mail size={20} />
                    </div>
                    <input
                      type="email"
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      placeholder={t.emailPlaceholder}
                      autoComplete="email"
                      inputMode="email"
                      className={baseInputClass}
                      style={inputStyle}
                    />
                  </div>

                  {errorBanner}

                  <button
                    type="button"
                    onClick={handleContinue}
                    disabled={loading}
                    className="w-full bg-[#242f54] text-white rounded-xl py-4 hover:bg-[#1a2340] transition-colors cursor-pointer disabled:opacity-60 disabled:cursor-not-allowed"
                  >
                    {loading ? t.loading : t.sendCode}
                  </button>
                </div>
              </Motion.div>
            )}

            {step === 2 && (
              <Motion.div key="step2" {...STEP_ANIMATION}>
                <h1
                  className={`mb-2 text-[36px] ${
                    isDark ? "text-white" : "text-gray-900"
                  } ${alignClass}`}
                >
                  {t.steps[1]}
                </h1>
                <p
                  className={`mb-8 ${
                    isDark ? "text-gray-400" : "text-gray-600"
                  } ${alignClass}`}
                >
                  {currentHint}
                </p>

                <div className="space-y-6">
                  <div className="flex gap-3 justify-center" style={{ direction: "ltr" }}>
                    {code.map((digit, index) => (
                      <input
                        key={index}
                        id={`signin-code-${index}`}
                        type="text"
                        dir="ltr"
                        inputMode="numeric"
                        maxLength={1}
                        disabled={loading}
                        autoComplete={index === 0 ? "one-time-code" : "off"}
                        value={digit}
                        onChange={(e) => updateCodeDigit(index, e.target.value)}
                        onPaste={handleCodePaste}
                        onKeyDown={(e) => {
                          if (e.key === "Backspace" && !digit && index > 0) {
                            document
                              .getElementById(`signin-code-${index - 1}`)
                              ?.focus();
                          }
                        }}
                        className={`h-12 w-12 rounded-xl border text-center text-xl font-semibold tabular-nums focus:outline-none focus:border-[#242f54] focus:ring-2 focus:ring-[#242f54]/20 transition-all cursor-text disabled:opacity-70 ${
                          isDark
                            ? "bg-gray-800 border-gray-700 text-white"
                            : "bg-white border-gray-300 text-gray-900"
                        }`}
                      />
                    ))}
                  </div>

                  <p
                    className={`text-center text-sm ${
                      isDark ? "text-gray-400" : "text-gray-600"
                    }`}
                  >
                    {t.noCode}{" "}
                    <button
                      type="button"
                      onClick={resendCode}
                      className="text-[#242f54] hover:underline cursor-pointer"
                    >
                      {t.resend}
                    </button>
                  </p>

                  {errorBanner}

                  <div className="flex gap-4">
                    <button
                      type="button"
                      onClick={handleBack}
                      disabled={loading}
                      className={`flex-1 border rounded-xl py-4 transition-colors cursor-pointer disabled:opacity-60 ${
                        isDark
                          ? "border-gray-700 text-gray-300 hover:bg-gray-800"
                          : "border-gray-300 text-gray-700 hover:bg-gray-50"
                      }`}
                    >
                      {t.back}
                    </button>
                    <button
                      type="button"
                      onClick={handleContinue}
                      disabled={loading}
                      className="flex-1 bg-[#242f54] text-white rounded-xl py-4 hover:bg-[#1a2340] transition-colors cursor-pointer disabled:opacity-60"
                    >
                      {loading ? t.loading : t.verifyCode}
                    </button>
                  </div>
                </div>
              </Motion.div>
            )}

            {step === 3 && (
              <Motion.div key="step3" {...STEP_ANIMATION}>
                <h1
                  className={`mb-2 text-[36px] ${
                    isDark ? "text-white" : "text-gray-900"
                  } ${alignClass}`}
                >
                  {t.steps[2]}
                </h1>
                <p
                  className={`mb-8 ${
                    isDark ? "text-gray-400" : "text-gray-600"
                  } ${alignClass}`}
                >
                  {currentHint}
                </p>

                <div className="space-y-6">
                  <div
                    className={`grid grid-cols-2 rounded-xl border p-1 ${
                      isDark
                        ? "border-gray-700 bg-gray-800"
                        : "border-gray-300 bg-gray-100"
                    }`}
                  >
                    <button
                      type="button"
                      onClick={() => setSecurityMode("phrase")}
                      className={`rounded-lg px-3 py-2 text-sm font-medium transition-colors cursor-pointer ${
                        securityMode === "phrase"
                          ? "bg-[#242f54] text-white"
                          : isDark
                            ? "text-gray-200 hover:bg-gray-700"
                            : "text-gray-700 hover:bg-white"
                      }`}
                    >
                      {t.modePhrase}
                    </button>
                    <button
                      type="button"
                      onClick={() => setSecurityMode("transaction")}
                      className={`rounded-lg px-3 py-2 text-sm font-medium transition-colors cursor-pointer ${
                        securityMode === "transaction"
                          ? "bg-[#242f54] text-white"
                          : isDark
                            ? "text-gray-200 hover:bg-gray-700"
                            : "text-gray-700 hover:bg-white"
                      }`}
                    >
                      {t.modeTransaction}
                    </button>
                  </div>

                  {securityMode === "phrase" ? (
                    <div className="relative">
                      <div
                        className={`absolute top-1/2 -translate-y-1/2 ${
                          isDark ? "text-gray-500" : "text-gray-400"
                        }`}
                        style={iconStyle}
                      >
                        <User size={20} />
                      </div>
                      <input
                        type="text"
                        value={securityPhrase}
                        onChange={(e) => setSecurityPhrase(e.target.value)}
                        placeholder={t.phrasePlaceholder}
                        className={baseInputClass}
                        style={inputStyle}
                      />
                    </div>
                  ) : (
                    <div className="relative">
                      <div
                        className={`absolute top-1/2 -translate-y-1/2 ${
                          isDark ? "text-gray-500" : "text-gray-400"
                        }`}
                        style={iconStyle}
                      >
                        <CreditCard size={20} />
                      </div>
                      <input
                        type="text"
                        value={lastTransactionAmount}
                        onChange={(e) => setLastTransactionAmount(e.target.value)}
                        placeholder={t.amountPlaceholder}
                        className={baseInputClass}
                        style={inputStyle}
                      />
                    </div>
                  )}

                  {errorBanner}

                  <div className="flex gap-4">
                    <button
                      type="button"
                      onClick={handleBack}
                      disabled={loading}
                      className={`flex-1 border rounded-xl py-4 transition-colors cursor-pointer disabled:opacity-60 ${
                        isDark
                          ? "border-gray-700 text-gray-300 hover:bg-gray-800"
                          : "border-gray-300 text-gray-700 hover:bg-gray-50"
                      }`}
                    >
                      {t.back}
                    </button>
                    <button
                      type="button"
                      onClick={handleContinue}
                      disabled={loading}
                      className="flex-1 bg-[#242f54] text-white rounded-xl py-4 hover:bg-[#1a2340] transition-colors cursor-pointer disabled:opacity-60"
                    >
                      {loading ? t.loading : t.continue}
                    </button>
                  </div>
                </div>
              </Motion.div>
            )}

            {step === 4 && (
              <Motion.div key="step4" {...STEP_ANIMATION}>
                <h1
                  className={`mb-2 text-[36px] ${
                    isDark ? "text-white" : "text-gray-900"
                  } ${alignClass}`}
                >
                  {t.steps[3]}
                </h1>
                <p
                  className={`mb-8 ${
                    isDark ? "text-gray-400" : "text-gray-600"
                  } ${alignClass}`}
                >
                  {currentHint}
                </p>

                <div className="space-y-6">
                  <div className="relative">
                    <div
                      className={`absolute top-1/2 -translate-y-1/2 ${
                        isDark ? "text-gray-500" : "text-gray-400"
                      }`}
                      style={iconStyle}
                    >
                      <Lock size={20} />
                    </div>
                    <input
                      type={showPassword ? "text" : "password"}
                      value={password}
                      onChange={(e) => setPassword(e.target.value)}
                      placeholder={t.passwordPlaceholder}
                      className={baseInputClass}
                      style={inputStyle}
                    />
                    <button
                      type="button"
                      onClick={() => setShowPassword((value) => !value)}
                      className={`absolute top-1/2 -translate-y-1/2 cursor-pointer ${
                        isDark
                          ? "text-gray-500 hover:text-gray-400"
                          : "text-gray-400 hover:text-gray-600"
                      }`}
                      style={toggleStyle}
                    >
                      {showPassword ? <EyeOff size={20} /> : <Eye size={20} />}
                    </button>
                  </div>

                  <div className="relative">
                    <div
                      className={`absolute top-1/2 -translate-y-1/2 ${
                        isDark ? "text-gray-500" : "text-gray-400"
                      }`}
                      style={iconStyle}
                    >
                      <Lock size={20} />
                    </div>
                    <input
                      type={showConfirmPassword ? "text" : "password"}
                      value={confirmPassword}
                      onChange={(e) => setConfirmPassword(e.target.value)}
                      placeholder={t.confirmPasswordPlaceholder}
                      className={baseInputClass}
                      style={inputStyle}
                    />
                    <button
                      type="button"
                      onClick={() => setShowConfirmPassword((value) => !value)}
                      className={`absolute top-1/2 -translate-y-1/2 cursor-pointer ${
                        isDark
                          ? "text-gray-500 hover:text-gray-400"
                          : "text-gray-400 hover:text-gray-600"
                      }`}
                      style={toggleStyle}
                    >
                      {showConfirmPassword ? <EyeOff size={20} /> : <Eye size={20} />}
                    </button>
                  </div>

                  <p
                    className={`text-xs ${
                      isDark ? "text-gray-400" : "text-gray-600"
                    } ${alignClass}`}
                  >
                    {t.passwordHint}
                  </p>

                  {errorBanner}

                  <div className="flex gap-4">
                    <button
                      type="button"
                      onClick={handleBack}
                      disabled={loading}
                      className={`flex-1 border rounded-xl py-4 transition-colors cursor-pointer disabled:opacity-60 ${
                        isDark
                          ? "border-gray-700 text-gray-300 hover:bg-gray-800"
                          : "border-gray-300 text-gray-700 hover:bg-gray-50"
                      }`}
                    >
                      {t.back}
                    </button>
                    <button
                      type="button"
                      onClick={handleContinue}
                      disabled={loading}
                      className="flex-1 bg-[#242f54] text-white rounded-xl py-4 hover:bg-[#1a2340] transition-colors cursor-pointer disabled:opacity-60"
                    >
                      {loading ? t.loading : t.create}
                    </button>
                  </div>
                </div>
              </Motion.div>
            )}
          </AnimatePresence>

          <p
            className={`text-center text-sm mt-8 ${
              isDark ? "text-gray-400" : "text-gray-600"
            }`}
          >
            {t.haveAccount}{" "}
            <button
              type="button"
              onClick={() => navigate("/login")}
              className="text-[#242f54] hover:underline cursor-pointer"
            >
              {t.signIn}
            </button>
          </p>

          <div
            className={`flex items-center justify-center gap-4 mt-6 pt-6 border-t ${
              isDark ? "border-gray-700" : "border-gray-200"
            }`}
          >
            <div
              className={`flex items-center gap-1.5 rounded-2xl p-1.5 ${
                isDark ? "bg-gray-800" : "bg-gray-100"
              }`}
            >
              {LANGUAGE_OPTIONS.map((option) => {
                const isActive = language === option.code;
                return (
                  <button
                    key={option.code}
                    type="button"
                    aria-label={option.aria}
                    onClick={() => setLanguage(option.code)}
                    className={`flex items-center gap-1.5 rounded-xl px-2.5 py-1.5 transition-all duration-200 cursor-pointer ${
                      isActive
                        ? "bg-[#0A2240] text-white shadow-sm"
                        : isDark
                          ? "text-gray-300 hover:bg-gray-700"
                          : "text-gray-700 hover:bg-white"
                    }`}
                  >
                    <img
                      src={option.flag}
                      alt={option.flagAlt}
                      className={`h-4 w-6 rounded-xs object-cover ${
                        isActive ? "ring-1 ring-white/80" : ""
                      }`}
                    />
                    <span className="text-[11px] font-bold tracking-wide">
                      {option.label}
                    </span>
                  </button>
                );
              })}
            </div>

            <div
              className={`h-6 w-px ${
                isDark ? "bg-gray-700" : "bg-gray-300"
              }`}
            />

            <button
              type="button"
              onClick={() => navigate("/faq")}
              className={`text-sm font-medium cursor-pointer hover:underline ${
                isDark
                  ? "text-gray-400 hover:text-white"
                  : "text-gray-600 hover:text-gray-900"
              }`}
            >
              {t.faq}
            </button>
          </div>
        </Motion.div>
      </div>

      <div
        className={`hidden lg:flex lg:w-1/2 bg-linear-to-br from-[#10203c] via-[#0d1a30] to-[#0a1424] items-stretch justify-stretch p-6 relative overflow-hidden`}
      >
        <div className="absolute inset-0 opacity-10">
          <div className="absolute top-20 left-20 w-72 h-72 bg-white rounded-full blur-3xl animate-pulse"></div>
          <div className="absolute bottom-20 right-20 w-96 h-96 bg-white rounded-full blur-3xl animate-pulse delay-1000"></div>
        </div>

        <div className="relative z-10 flex h-full w-full items-center justify-center text-white">
          <div className="relative flex h-full w-full max-w-sm flex-col items-center justify-center py-10">
            <img
              src={logoWhite}
              alt="BH Bank"
              className="mb-12 h-12 w-auto drop-shadow-2xl"
            />

            <div className="relative z-10 flex w-full flex-col items-center">
              {t.steps.map((label, index) => {
                const current = index + 1;
                const done = step > current;
                const active = step === current;
                const Icon = STEP_ICONS[index] || Check;
                const displayLabel = t.stepSidebarTitles?.[index] || label;

                return (
                  <div key={label} className="flex flex-col items-center">
                    <span
                      className={`relative inline-flex h-12 w-12 items-center justify-center rounded-full border shadow-[0_10px_28px_-22px_rgba(0,0,0,0.95)] ${
                        active
                          ? "border-white bg-white text-[#0f172a]"
                          : done
                            ? "border-white bg-[#10203c] text-white"
                            : "border-white/45 bg-[#10203c] text-white/80"
                      }`}
                    >
                      <Icon size={18} />
                      <span
                        className={`absolute -bottom-1.5 flex h-5 w-5 items-center justify-center rounded-full text-[10px] font-bold ${
                          isRTL ? "-left-1" : "-right-1"
                        } ${
                          active
                            ? "bg-white text-[#0f172a]"
                            : done
                              ? "bg-white/95 text-[#0f172a]"
                              : "bg-white/22 text-white"
                        }`}
                      >
                        {current}
                      </span>
                    </span>

                    <p className={`mt-3 px-2 text-center text-base font-semibold tracking-wide md:text-lg ${active ? "text-white" : "text-white/82"}`}>
                      {displayLabel}
                    </p>

                    {index < t.steps.length - 1 ? (
                      <span className="mt-5 h-10 w-px bg-white/42" />
                    ) : null}
                  </div>
                );
              })}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}