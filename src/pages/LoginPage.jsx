import { useEffect, useState } from "react";
import { useNavigate } from "react-router";
import { motion as Motion, AnimatePresence } from "framer-motion";
import {
  AlertCircle,
  Lock,
  Mail,
  Eye,
  EyeOff,
  House,
  ShieldAlert,
} from "lucide-react";
import { useTheme } from "../contexts/ThemeContext";
import { useLanguage } from "../contexts/LanguageContext";
import logoWhite from "../assets/bh_logo_blanc.png";
import flagAr from "../assets/flags/Flag_of_Tunisia.svg.webp";
import flagEn from "../assets/flags/Flag_of_the_United_Kingdom_(3-5).svg.webp";
import flagFr from "../assets/flags/Flag_of_France.svg.png";
import { loginUser, requestClientPasswordReset, setAuthSession } from "../api";

const HELLO_MESSAGES = [
  { text: "Hello" },
  { text: "Bonjour" },
  { text: "مرحبا", isArabic: true },
  { text: "Hola" },
  { text: "Ciao" },
  { text: "Hallo" },
  { text: "Ola" },
  { text: "こんにちは" },
];

const isRouteMissingMessage = (message) =>
  /(endpoint api introuvable|requested url was not found on the server)/i.test(String(message || ""));

const isLikelyNetworkError = (error) => {
  if (!error) return false;
  if (typeof error.status === "number") return false;
  const message = String(error.message || "").toLowerCase();
  return message.includes("failed to fetch") || message.includes("network") || message.includes("offline");
};

const resolveLoginError = (error, ui) => {
  const rawMessage = String(error?.message || "").trim();

  if (
    error?.status === 429 ||
    error?.status === 423 ||
    /(verrouill|locked|lockout|too many|trop de tentatives|retry|minutes?)/i.test(rawMessage)
  ) {
    return {
      type: "lockout",
      message: rawMessage || ui.lockoutServerMessage,
    };
  }

  if (error?.status === 401) {
    return {
      type: "invalid",
      message: ui.invalidCredMessage,
    };
  }

  if (error?.status === 400) {
    return {
      type: "invalid",
      message: ui.invalidLoginInput,
    };
  }

  if (error?.status === 404 || isRouteMissingMessage(rawMessage)) {
    return {
      type: "generic",
      message: ui.serviceUnavailable,
    };
  }

  if (isLikelyNetworkError(error)) {
    return {
      type: "generic",
      message: ui.networkError,
    };
  }

  return {
    type: "generic",
    message: rawMessage || ui.loginFailed,
  };
};

const resolveForgotError = (error, ui) => {
  const rawMessage = String(error?.message || "").trim();

  if (error?.status === 400) {
    return ui.forgotInvalidEmail;
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

export function LoginPage() {
  const navigate = useNavigate();
  const { theme } = useTheme();
  const { language, setLanguage, isRTL } = useLanguage();
  const [currentStep, setCurrentStep] = useState(1);
  const [showPassword, setShowPassword] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [errorMessage, setErrorMessage] = useState("");
  const [errorType, setErrorType] = useState("");
  const [forgotOpen, setForgotOpen] = useState(false);
  const [forgotEmail, setForgotEmail] = useState("");
  const [forgotReason, setForgotReason] = useState("");
  const [forgotSubmitting, setForgotSubmitting] = useState(false);
  const [forgotFeedback, setForgotFeedback] = useState("");
  const [forgotError, setForgotError] = useState("");
  const [helloIndex, setHelloIndex] = useState(0);

  // Step 1: Login
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  // Step 2: Phone Verification
  const [phoneCode, setPhoneCode] = useState(["", "", "", "", "", ""]);

  const languageOptions = [
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

  const loginCopy = {
    en: {
      loginTitle: "Login",
      loginSubtitle: "Sign in to your account",
      home: "Home",
      emailLabel: "Email",
      emailPlaceholder: "Enter your email",
      emailRequired: "Email is required.",
      emailPasswordRequired: "Email and password are required.",
      passwordLabel: "Password",
      passwordPlaceholder: "Enter your password",
      signingIn: "Signing in...",
      forgotPassword: "Forgot password?",
      forgotTitle: "Reset password request",
      forgotSubtitle: "Submit your email. A BH admin will approve or reject your reset request.",
      forgotReasonLabel: "Reason (optional)",
      forgotReasonPlaceholder: "Explain your request context",
      forgotSuccess:
        "Request submitted. A BH administrator will process it and you will receive an email.",
      forgotSend: "Send request",
      forgotSending: "Sending...",
      forgotClose: "Close",
      lockoutTitle: "Account temporarily locked",
      lockoutHint: "Use password reset if needed, or wait before trying again.",
      lockoutServerMessage: "Too many attempts. Your account is temporarily locked.",
      invalidCredTitle: "Incorrect credentials",
      invalidCredHint: "Check your email and password, then try again.",
      invalidCredMessage: "Email or password is incorrect.",
      invalidLoginInput: "Please check your credentials and try again.",
      loginFailed: "Unable to sign in right now.",
      networkError: "Network error. Check your connection and try again.",
      serviceUnavailable: "Authentication service is unavailable. Try again in a moment.",
      forgotInvalidEmail: "Enter a valid email address.",
      forgotTooManyRequests: "Too many reset requests. Please wait before trying again.",
      forgotRequestFailed: "Unable to submit your reset request right now.",
      signIn: "Sign in",
      verificationTitle: "Verification",
      verificationSubtitle: "6-digit code sent to your phone",
      codeNotReceived: "Didn't receive the code? ",
      resend: "Resend",
      back: "Back",
      verify: "Verify",
      noAccount: "Don't have an account? ",
      signUp: "Sign up",
      faq: "FAQ",
    },
    fr: {
      loginTitle: "Connexion",
      loginSubtitle: "Connectez-vous a votre compte",
      home: "Accueil",
      emailLabel: "Email",
      emailPlaceholder: "Entrez votre email",
      emailRequired: "Email requis.",
      emailPasswordRequired: "Email et mot de passe sont obligatoires.",
      passwordLabel: "Mot de passe",
      passwordPlaceholder: "Entrez votre mot de passe",
      signingIn: "Connexion...",
      forgotPassword: "Mot de passe oublie?",
      forgotTitle: "Demande de reinitialisation",
      forgotSubtitle: "Soumettez votre email. Un admin BH approuvera ou refusera votre demande.",
      forgotReasonLabel: "Motif (optionnel)",
      forgotReasonPlaceholder: "Precisez le contexte de votre demande",
      forgotSuccess:
        "Demande transmise. Un administrateur BH la traitera et vous recevrez un email.",
      forgotSend: "Envoyer la demande",
      forgotSending: "Envoi...",
      forgotClose: "Fermer",
      lockoutTitle: "Compte temporairement verrouille",
      lockoutHint: "Utilisez la reinitialisation si besoin, ou patientez avant une nouvelle tentative.",
      lockoutServerMessage: "Trop de tentatives. Votre compte est temporairement verrouille.",
      invalidCredTitle: "Identifiants incorrects",
      invalidCredHint: "Verifiez votre email et votre mot de passe, puis reessayez.",
      invalidCredMessage: "Email ou mot de passe incorrect.",
      invalidLoginInput: "Verifiez vos informations puis reessayez.",
      loginFailed: "Connexion impossible pour le moment.",
      networkError: "Erreur reseau. Verifiez votre connexion puis reessayez.",
      serviceUnavailable: "Le service d'authentification est indisponible pour le moment.",
      forgotInvalidEmail: "Saisissez une adresse email valide.",
      forgotTooManyRequests: "Trop de demandes de reinitialisation. Reessayez plus tard.",
      forgotRequestFailed: "Impossible d'envoyer la demande de reinitialisation pour le moment.",
      signIn: "Se connecter",
      verificationTitle: "Verification",
      verificationSubtitle: "Code a 6 chiffres envoye a votre telephone",
      codeNotReceived: "Code non recu? ",
      resend: "Renvoyer",
      back: "Retour",
      verify: "Verifier",
      noAccount: "Vous n'avez pas de compte? ",
      signUp: "S'inscrire",
      faq: "FAQ",
    },
    ar: {
      loginTitle: "تسجيل الدخول",
      loginSubtitle: "قم بتسجيل الدخول إلى حسابك",
      home: "الرئيسية",
      emailLabel: "البريد الإلكتروني",
      emailPlaceholder: "أدخل بريدك الإلكتروني",
      emailRequired: "البريد الإلكتروني مطلوب.",
      emailPasswordRequired: "البريد الإلكتروني وكلمة المرور مطلوبان.",
      passwordLabel: "كلمة المرور",
      passwordPlaceholder: "أدخل كلمة المرور",
      signingIn: "جارٍ تسجيل الدخول...",
      forgotPassword: "هل نسيت كلمة المرور؟",
      forgotTitle: "طلب إعادة تعيين كلمة المرور",
      forgotSubtitle: "أدخل بريدك الإلكتروني. سيقوم مسؤول BH بالموافقة أو الرفض على طلبك.",
      forgotReasonLabel: "السبب (اختياري)",
      forgotReasonPlaceholder: "اشرح سبب الطلب",
      forgotSuccess:
        "تم إرسال الطلب. سيقوم مسؤول BH بمعالجته وستصلك رسالة عبر البريد الإلكتروني.",
      forgotSend: "إرسال الطلب",
      forgotSending: "جارٍ الإرسال...",
      forgotClose: "إغلاق",
      lockoutTitle: "تم قفل الحساب مؤقتًا",
      lockoutHint: "يمكنك استخدام إعادة تعيين كلمة المرور أو الانتظار قبل المحاولة مرة أخرى.",
      lockoutServerMessage: "محاولات كثيرة جدا. تم قفل الحساب مؤقتا.",
      invalidCredTitle: "بيانات الدخول غير صحيحة",
      invalidCredHint: "تحقق من البريد الإلكتروني وكلمة المرور ثم حاول مرة أخرى.",
      invalidCredMessage: "البريد الإلكتروني أو كلمة المرور غير صحيحة.",
      invalidLoginInput: "يرجى التحقق من البيانات وإعادة المحاولة.",
      loginFailed: "تعذر تسجيل الدخول حاليا.",
      networkError: "مشكلة في الشبكة. تحقق من الاتصال ثم أعد المحاولة.",
      serviceUnavailable: "خدمة المصادقة غير متاحة حاليا. حاول مرة أخرى بعد قليل.",
      forgotInvalidEmail: "يرجى إدخال بريد إلكتروني صالح.",
      forgotTooManyRequests: "طلبات إعادة التعيين كثيرة جدا. حاول لاحقا.",
      forgotRequestFailed: "تعذر إرسال طلب إعادة التعيين حاليا.",
      signIn: "دخول",
      verificationTitle: "التحقق",
      verificationSubtitle: "تم إرسال رمز من 6 أرقام إلى هاتفك",
      codeNotReceived: "لم يصلك الرمز؟ ",
      resend: "إعادة الإرسال",
      back: "رجوع",
      verify: "تحقق",
      noAccount: "ليس لديك حساب؟ ",
      signUp: "إنشاء حساب",
      faq: "الأسئلة الشائعة",
    },
  };

  const ui = loginCopy[language] || loginCopy.en;
  const isLockoutError = errorType === "lockout";
  const isInvalidCredentialsError = errorType === "invalid";
  const currentHello = HELLO_MESSAGES[helloIndex];

  useEffect(() => {
    const intervalId = window.setInterval(() => {
      setHelloIndex((previousIndex) =>
        (previousIndex + 1) % HELLO_MESSAGES.length,
      );
    }, 1400);

    return () => {
      window.clearInterval(intervalId);
    };
  }, []);

  const handlePhoneCodeChange = (index, value) => {
    if (value.length <= 1 && /^\d*$/.test(value)) {
      const newCode = [...phoneCode];
      newCode[index] = value;
      setPhoneCode(newCode);

      if (value && index < 5) {
        const nextInput = document.getElementById(`phone-code-${index + 1}`);
        nextInput?.focus();
      }
    }
  };

  const handleNextStep = async () => {
    if (currentStep !== 1) {
      navigate("/dashboard");
      return;
    }

    const normalizedEmail = email.trim().toLowerCase();
    if (!normalizedEmail || !password.trim()) {
      setErrorType("invalid");
      setErrorMessage(ui.emailPasswordRequired);
      return;
    }

    try {
      setIsSubmitting(true);
      setErrorMessage("");
      setErrorType("");

      const payload = await loginUser({
        email: normalizedEmail,
        password,
      });

      setAuthSession(payload);
      navigate("/dashboard");
    } catch (error) {
      const resolved = resolveLoginError(error, ui);
      setErrorType(resolved.type);
      setErrorMessage(resolved.message);
    } finally {
      setIsSubmitting(false);
    }
  };

  const handlePreviousStep = () => {
    if (currentStep > 1) {
      setCurrentStep(currentStep - 1);
    }
  };

  const openForgotPasswordModal = () => {
    setForgotOpen(true);
    setForgotError("");
    setForgotFeedback("");
    setForgotReason("");
    setForgotEmail(email.trim().toLowerCase());
  };

  const closeForgotPasswordModal = () => {
    if (forgotSubmitting) return;
    setForgotOpen(false);
  };

  const handleForgotPasswordSubmit = async (event) => {
    event.preventDefault();
    if (forgotSubmitting) return;

    const normalizedEmail = forgotEmail.trim().toLowerCase();
    if (!normalizedEmail) {
      setForgotError(ui.emailRequired || ui.emailPlaceholder);
      return;
    }

    try {
      setForgotSubmitting(true);
      setForgotError("");

      await requestClientPasswordReset({
        email: normalizedEmail,
        reason: forgotReason.trim() || undefined,
      });
      setForgotFeedback(ui.forgotSuccess);
    } catch (error) {
      setForgotError(resolveForgotError(error, ui));
    } finally {
      setForgotSubmitting(false);
    }
  };

  return (
    <div
      className={`min-h-screen flex ${theme === "dark" ? "bg-gray-900" : ""}`}
    >
      {/* Left Side - Login Form */}
      <div
        className={`w-full lg:w-1/2 ${theme === "dark" ? "bg-gray-900" : "bg-white"} flex items-center justify-center p-8 overflow-y-auto`}
      >
        <Motion.div
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.6, delay: 0.2 }}
          className="w-full max-w-md"
        >
          <div className={`mb-8 flex ${isRTL ? "justify-end" : "justify-start"}`}>
            <button
              type="button"
              onClick={() => navigate("/")}
              className={`inline-flex items-center gap-2 rounded-full px-4 py-2 text-sm font-medium transition-colors cursor-pointer ${
                theme === "dark"
                  ? "border border-gray-700 text-gray-200 hover:bg-gray-800"
                  : "border border-[#242f54]/20 text-[#242f54] hover:bg-[#242f54]/5"
              } ${isRTL ? "flex-row-reverse" : ""}`}
            >
              <House size={16} />
              {ui.home}
            </button>
          </div>

          {/* Step Indicator */}

          <AnimatePresence mode="wait">
            {/* Step 1: Login with email and password */}
            {currentStep === 1 && (
              <Motion.div
                key="step1"
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: 20 }}
                transition={{ duration: 0.3 }}
              >
                <h1
                  className={`mb-2 text-[36px] font-bold ${theme === "dark" ? "text-white" : "text-gray-900"} ${
                    isRTL ? "text-right" : "text-left"
                  }`}
                >
                  {ui.loginTitle}
                </h1>
                <p
                  className={`mb-8 ${theme === "dark" ? "text-gray-400" : "text-gray-600"} ${
                    isRTL ? "text-right" : "text-left"
                  }`}
                >
                  {ui.loginSubtitle}
                </p>

                <form className="space-y-6">
                  {/* Email */}
                  <div>
                    <label
                      className={`block text-sm mb-2 ${theme === "dark" ? "text-gray-300" : "text-gray-700"} ${
                        isRTL ? "text-right" : "text-left"
                      }`}
                    >
                      {ui.emailLabel}
                    </label>
                    <div className="relative">
                      <div
                        className={`absolute ${isRTL ? "right-4" : "left-4"} top-1/2 -translate-y-1/2 ${theme === "dark" ? "text-gray-500" : "text-gray-400"}`}
                      >
                        <Mail size={20} />
                      </div>
                      <input
                        type="email"
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        placeholder={ui.emailPlaceholder}
                        autoComplete="email"
                        inputMode="email"
                        className={`w-full border rounded-xl px-12 py-4 placeholder:text-gray-400 focus:outline-none focus:border-[#242f54] focus:ring-2 focus:ring-[#242f54]/20 transition-all cursor-text ${
                          theme === "dark"
                            ? "bg-gray-800 border-gray-700 text-white"
                            : "bg-white border-gray-300 text-gray-900"
                        } ${isRTL ? "text-right" : "text-left"}`}
                      />
                    </div>
                  </div>

                  {/* Password */}
                  <div>
                    <label
                      className={`block text-sm mb-2 ${theme === "dark" ? "text-gray-300" : "text-gray-700"} ${
                        isRTL ? "text-right" : "text-left"
                      }`}
                    >
                      {ui.passwordLabel}
                    </label>
                    <div className="relative">
                      <div
                        className={`absolute ${isRTL ? "right-4" : "left-4"} top-1/2 -translate-y-1/2 ${theme === "dark" ? "text-gray-500" : "text-gray-400"}`}
                      >
                        <Lock size={20} />
                      </div>
                      <input
                        type={showPassword ? "text" : "password"}
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                        placeholder={ui.passwordPlaceholder}
                        className={`w-full border rounded-xl px-12 py-4 placeholder:text-gray-400 focus:outline-none focus:border-[#242f54] focus:ring-2 focus:ring-[#242f54]/20 transition-all cursor-text ${
                          theme === "dark"
                            ? "bg-gray-800 border-gray-700 text-white"
                            : "bg-white border-gray-300 text-gray-900"
                        } ${isRTL ? "text-right" : "text-left"}`}
                      />
                      <button
                        type="button"
                        onClick={() => setShowPassword(!showPassword)}
                        className={`absolute ${isRTL ? "left-4" : "right-4"} top-1/2 -translate-y-1/2 cursor-pointer ${
                          theme === "dark"
                            ? "text-gray-500 hover:text-gray-400"
                            : "text-gray-400 hover:text-gray-600"
                        }`}
                      >
                        {showPassword ? (
                          <EyeOff size={20} />
                        ) : (
                          <Eye size={20} />
                        )}
                      </button>
                    </div>
                  </div>

                  {/* Forgot Password */}
                  <div className="text-right">
                    <button
                      type="button"
                      onClick={openForgotPasswordModal}
                      className="text-sm text-[#242f54] hover:underline cursor-pointer"
                    >
                      {ui.forgotPassword}
                    </button>
                  </div>

                  {errorMessage &&
                    (isLockoutError ? (
                      <Motion.div
                        initial={{ opacity: 0, y: 10 }}
                        animate={{ opacity: 1, y: 0 }}
                        className={`rounded-2xl border p-3.5 ${
                          theme === "dark"
                            ? "border-amber-700/40 bg-amber-900/20"
                            : "border-amber-200 bg-amber-50"
                        }`}
                      >
                        <div
                          className={`flex items-start gap-3 ${
                            isRTL ? "flex-row-reverse text-right" : "text-left"
                          }`}
                        >
                          <div
                            className={`mt-0.5 flex h-9 w-9 shrink-0 items-center justify-center rounded-full ${
                              theme === "dark"
                                ? "bg-amber-800/35 text-amber-300"
                                : "bg-amber-100 text-amber-700"
                            }`}
                          >
                            <ShieldAlert size={18} />
                          </div>
                          <div>
                            <p
                              className={`text-sm font-semibold ${
                                theme === "dark" ? "text-amber-200" : "text-amber-800"
                              }`}
                            >
                              {ui.lockoutTitle}
                            </p>
                            <p
                              className={`mt-1 text-sm ${
                                theme === "dark" ? "text-amber-100" : "text-amber-700"
                              }`}
                            >
                              {errorMessage}
                            </p>
                            <p
                              className={`mt-2 text-xs ${
                                theme === "dark" ? "text-amber-200/85" : "text-amber-700/90"
                              }`}
                            >
                              {ui.lockoutHint}
                            </p>
                          </div>
                        </div>
                      </Motion.div>
                    ) : isInvalidCredentialsError ? (
                      <Motion.div
                        initial={{ opacity: 0, y: 10 }}
                        animate={{ opacity: 1, y: 0 }}
                        className={`rounded-2xl border p-3.5 ${
                          theme === "dark"
                            ? "border-red-800/40 bg-red-950/25"
                            : "border-red-200 bg-red-50"
                        }`}
                      >
                        <div
                          className={`flex items-start gap-3 ${
                            isRTL ? "flex-row-reverse text-right" : "text-left"
                          }`}
                        >
                          <div
                            className={`mt-0.5 flex h-9 w-9 shrink-0 items-center justify-center rounded-full ${
                              theme === "dark"
                                ? "bg-red-900/45 text-red-300"
                                : "bg-red-100 text-red-700"
                            }`}
                          >
                            <Lock size={18} />
                          </div>
                          <div>
                            <p
                              className={`text-sm font-semibold ${
                                theme === "dark" ? "text-red-200" : "text-red-800"
                              }`}
                            >
                              {ui.invalidCredTitle}
                            </p>
                            <p
                              className={`mt-1 text-sm ${
                                theme === "dark" ? "text-red-100" : "text-red-700"
                              }`}
                            >
                              {errorMessage}
                            </p>
                            <p
                              className={`mt-2 text-xs ${
                                theme === "dark" ? "text-red-200/85" : "text-red-700/90"
                              }`}
                            >
                              {ui.invalidCredHint}
                            </p>
                          </div>
                        </div>
                      </Motion.div>
                    ) : (
                      <Motion.div
                        initial={{ opacity: 0, y: 10 }}
                        animate={{ opacity: 1, y: 0 }}
                        className={`rounded-2xl border p-3.5 ${
                          theme === "dark"
                            ? "border-red-800/40 bg-red-950/25"
                            : "border-red-200 bg-red-50"
                        }`}
                      >
                        <div
                          className={`flex items-start gap-3 ${
                            isRTL ? "flex-row-reverse text-right" : "text-left"
                          }`}
                        >
                          <div
                            className={`mt-0.5 flex h-9 w-9 shrink-0 items-center justify-center rounded-full ${
                              theme === "dark"
                                ? "bg-red-900/45 text-red-300"
                                : "bg-red-100 text-red-700"
                            }`}
                          >
                            <AlertCircle size={18} />
                          </div>
                          <p
                            className={`text-sm ${
                              theme === "dark" ? "text-red-100" : "text-red-700"
                            }`}
                          >
                            {errorMessage}
                          </p>
                        </div>
                      </Motion.div>
                    ))}

                  {/* Submit Button */}
                  <button
                    type="button"
                    onClick={handleNextStep}
                    disabled={isSubmitting}
                    className="w-full bg-[#242f54] text-white rounded-xl py-4 hover:bg-[#1a2340] transition-colors cursor-pointer disabled:opacity-60 disabled:cursor-not-allowed"
                  >
                    {isSubmitting ? ui.signingIn : ui.signIn}
                  </button>
                </form>
              </Motion.div>
            )}

            {/* Step 2: Phone Verification */}
            {currentStep === 2 && (
              <Motion.div
                key="step2"
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: 20 }}
                transition={{ duration: 0.3 }}
              >
                <h1
                  className={`text-4xl mb-2 ${theme === "dark" ? "text-white" : "text-gray-900"}`}
                >
                  {ui.verificationTitle}
                </h1>
                <p
                  className={`mb-8 ${theme === "dark" ? "text-gray-400" : "text-gray-600"}`}
                >
                  {ui.verificationSubtitle}
                </p>

                <div className="space-y-6">
                  {/* Phone Code Input */}
                  <div className="flex gap-3 justify-center">
                    {phoneCode.map((digit, index) => (
                      <input
                        key={index}
                        id={`phone-code-${index}`}
                        type="text"
                        inputMode="numeric"
                        maxLength={1}
                        value={digit}
                        onChange={(e) =>
                          handlePhoneCodeChange(index, e.target.value)
                        }
                        onKeyDown={(e) => {
                          if (e.key === "Backspace" && !digit && index > 0) {
                            document
                              .getElementById(`phone-code-${index - 1}`)
                              ?.focus();
                          }
                        }}
                        className={`w-14 h-14 text-center border rounded-xl text-2xl focus:outline-none focus:border-[#242f54] focus:ring-2 focus:ring-[#242f54]/20 transition-all cursor-text ${
                          theme === "dark"
                            ? "bg-gray-800 border-gray-700 text-white"
                            : "bg-white border-gray-300 text-gray-900"
                        }`}
                      />
                    ))}
                  </div>

                  <p
                    className={`text-center text-sm ${theme === "dark" ? "text-gray-400" : "text-gray-600"}`}
                  >
                    {ui.codeNotReceived}
                    <button className="text-[#242f54] hover:underline cursor-pointer">
                      {ui.resend}
                    </button>
                  </p>

                  {/* Buttons */}
                  <div className="flex gap-4">
                    <button
                      type="button"
                      onClick={handlePreviousStep}
                      className={`flex-1 border rounded-xl py-4 transition-colors cursor-pointer ${
                        theme === "dark"
                          ? "border-gray-700 text-gray-300 hover:bg-gray-800"
                          : "border-gray-300 text-gray-700 hover:bg-gray-50"
                      }`}
                    >
                      {ui.back}
                    </button>
                    <button
                      type="button"
                      onClick={handleNextStep}
                      className="flex-1 bg-[#242f54] text-white rounded-xl py-4 hover:bg-[#1a2340] transition-colors cursor-pointer"
                    >
                      {ui.verify}
                    </button>
                  </div>
                </div>
              </Motion.div>
            )}
          </AnimatePresence>

          {/* Sign up link */}
          <p
            className={`text-center text-sm mt-8 ${theme === "dark" ? "text-gray-400" : "text-gray-600"}`}
          >
            {ui.noAccount}
            <button
              onClick={() => navigate("/signin")}
              className="text-[#242f54] hover:underline cursor-pointer"
            >
              {ui.signUp}
            </button>
          </p>

          {/* Bottom Section: Language & FAQ */}
          <div className="flex items-center justify-center space-x-4 mt-6 pt-6 border-t border-gray-200 dark:border-gray-700">
            <div
              className={`flex items-center gap-1.5 rounded-2xl p-1.5 ${
                theme === "dark" ? "bg-gray-800" : "bg-gray-100"
              }`}
            >
              {languageOptions.map((option) => {
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
                        : theme === "dark"
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
              className={`h-6 w-px ${theme === "dark" ? "bg-gray-700" : "bg-gray-300"}`}
            />

            <button
              onClick={() => navigate("/faq")}
              className={`text-sm font-medium cursor-pointer hover:underline ${
                theme === "dark"
                  ? "text-gray-400 hover:text-white"
                  : "text-gray-600 hover:text-gray-900"
              }`}
            >
              {ui.faq}
            </button>
          </div>
        </Motion.div>
      </div>

      {/* Right Side - Aesthetic Background */}
      <div
        className={`hidden lg:flex lg:w-1/2 ${
          theme === "dark"
            ? "bg-linear-to-br from-[#10203c] via-[#0d1a30] to-[#0a1424]"
            : "bg-linear-to-br from-[#10203c] via-[#0d1a30] to-[#0a1424]"
        } items-center justify-center p-12 relative overflow-hidden`}
      >
        {/* Animated background elements */}
        <div className="absolute inset-0 opacity-10">
          <div className="absolute top-20 left-20 w-72 h-72 bg-white rounded-full blur-3xl animate-pulse"></div>
          <div className="absolute bottom-20 right-20 w-96 h-96 bg-blue-300 rounded-full blur-3xl animate-pulse delay-1000"></div>
        </div>

        <div className="relative z-10 h-full w-full max-w-xl">
          <Motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.55, delay: 0.1 }}
            className="relative h-full w-full"
          >
            <div className="absolute inset-0 scale-150 rounded-full bg-cyan-300/10 blur-3xl" />

            <div className="absolute left-1/2 top-8 -translate-x-1/2 md:top-12">
              <img
                src={logoWhite}
                alt="BH Bank"
                className="h-16 w-auto drop-shadow-2xl md:h-20"
              />
            </div>

            <div className="absolute inset-0 flex items-center justify-center">
              <AnimatePresence mode="wait">
                <Motion.p
                  key={currentHello.text}
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -10 }}
                  transition={{ duration: 0.35 }}
                  className="px-6 text-center text-3xl font-bold tracking-wide text-white md:text-4xl"
                  style={
                    currentHello.isArabic
                      ? {
                          fontFamily:
                            "'Noto Naskh Arabic', 'Amiri', 'Scheherazade New', serif",
                        }
                      : undefined
                  }
                >
                  {currentHello.text}
                </Motion.p>
              </AnimatePresence>
            </div>
          </Motion.div>
        </div>
      </div>

      {forgotOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-[#09101f]/60 px-4">
          <div
            className={`w-full max-w-md rounded-2xl border p-6 shadow-2xl ${
              theme === "dark"
                ? "border-gray-700 bg-gray-900 text-white"
                : "border-[#d8e1ef] bg-white text-[#10203c]"
            }`}
          >
            <h2 className={`text-xl font-semibold ${isRTL ? "text-right" : "text-left"}`}>{ui.forgotTitle}</h2>
            <p className={`mt-2 text-sm ${theme === "dark" ? "text-gray-300" : "text-[#5f7391]"} ${isRTL ? "text-right" : "text-left"}`}>
              {ui.forgotSubtitle}
            </p>

            <form className="mt-5 space-y-4" onSubmit={handleForgotPasswordSubmit}>
              <div>
                <label
                  className={`mb-2 block text-sm ${theme === "dark" ? "text-gray-300" : "text-[#314866]"} ${
                    isRTL ? "text-right" : "text-left"
                  }`}
                >
                  {ui.emailLabel}
                </label>
                <input
                  type="email"
                  value={forgotEmail}
                  onChange={(event) => setForgotEmail(event.target.value)}
                  placeholder={ui.emailPlaceholder}
                  autoComplete="email"
                  inputMode="email"
                  className={`w-full rounded-xl border px-3 py-2.5 text-sm ${
                    theme === "dark"
                      ? "border-gray-700 bg-gray-800 text-white"
                      : "border-[#ccd9eb] bg-white text-[#10203c]"
                  } ${isRTL ? "text-right" : "text-left"}`}
                  required
                />
              </div>

              <div>
                <label
                  className={`mb-2 block text-sm ${theme === "dark" ? "text-gray-300" : "text-[#314866]"} ${
                    isRTL ? "text-right" : "text-left"
                  }`}
                >
                  {ui.forgotReasonLabel}
                </label>
                <textarea
                  rows={3}
                  value={forgotReason}
                  onChange={(event) => setForgotReason(event.target.value)}
                  placeholder={ui.forgotReasonPlaceholder}
                  className={`w-full rounded-xl border px-3 py-2.5 text-sm ${
                    theme === "dark"
                      ? "border-gray-700 bg-gray-800 text-white"
                      : "border-[#ccd9eb] bg-white text-[#10203c]"
                  } ${isRTL ? "text-right" : "text-left"}`}
                />
              </div>

              {forgotError && (
                <p
                  className={`rounded-xl border px-3 py-2 text-sm ${
                    theme === "dark"
                      ? "border-red-900/60 bg-red-950/30 text-red-300"
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
                      ? "border-emerald-900/60 bg-emerald-950/30 text-emerald-300"
                      : "border-emerald-200 bg-emerald-50 text-emerald-700"
                  } ${isRTL ? "text-right" : "text-left"}`}
                >
                  {forgotFeedback}
                </p>
              )}

              <div className={`flex items-center gap-2 ${isRTL ? "flex-row-reverse" : ""}`}>
                <button
                  type="submit"
                  disabled={forgotSubmitting}
                  className="inline-flex flex-1 items-center justify-center rounded-xl bg-[#0A2240] px-4 py-2.5 text-sm font-semibold text-white hover:bg-[#12325e] disabled:opacity-60"
                >
                  {forgotSubmitting ? ui.forgotSending : ui.forgotSend}
                </button>
                <button
                  type="button"
                  onClick={closeForgotPasswordModal}
                  disabled={forgotSubmitting}
                  className={`inline-flex items-center justify-center rounded-xl border px-4 py-2.5 text-sm font-semibold ${
                    theme === "dark"
                      ? "border-gray-700 bg-gray-800 text-gray-200 hover:bg-gray-700"
                      : "border-[#cddcf0] bg-[#f4f8ff] text-[#20406c] hover:bg-[#eaf2ff]"
                  } disabled:opacity-60`}
                >
                  {ui.forgotClose}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
