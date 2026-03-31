import { useState, useEffect } from "react";
import { useNavigate } from "react-router";
import { motion as Motion, AnimatePresence } from "framer-motion";
import {
  Lock,
  Eye,
  EyeOff,
  Check,
  CreditCard,
  House,
} from "lucide-react";
import { useTheme } from "../contexts/ThemeContext";
import { useLanguage } from "../contexts/LanguageContext";
import logoExpanded from "../assets/BH_logo2.png";
import logoDark from "../assets/BH_logo2.png";
import flagAr from "../assets/flags/Flag_of_Tunisia.svg.webp";
import flagEn from "../assets/flags/Flag_of_the_United_Kingdom_(3-5).svg.webp";
import flagFr from "../assets/flags/Flag_of_France.svg.png";

export function LoginPage() {
  const navigate = useNavigate();
  const { theme } = useTheme();
  const { language, setLanguage, isRTL } = useLanguage();
  const [currentStep, setCurrentStep] = useState(1);
  const [currentTextIndex, setCurrentTextIndex] = useState(0);
  const [showPassword, setShowPassword] = useState(false);

  // Step 1: Login
  const [cinNumber, setCinNumber] = useState("");
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

  const rotatingScriptTexts = [
    "مرحبًا بكم في BH Advisor",
    "Bienvenue sur BH Advisor",
    "Welcome to BH Advisor",
  ];

  const loginCopy = {
    en: {
      loginTitle: "Login",
      loginSubtitle: "Sign in to your account",
      home: "Home",
      cinLabel: "CIN Number",
      cinPlaceholder: "Enter your CIN number",
      passwordLabel: "Password",
      passwordPlaceholder: "Enter your password",
      forgotPassword: "Forgot password?",
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
      cinLabel: "Numero CIN",
      cinPlaceholder: "Entrez votre numero CIN",
      passwordLabel: "Mot de passe",
      passwordPlaceholder: "Entrez votre mot de passe",
      forgotPassword: "Mot de passe oublie?",
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
      cinLabel: "رقم بطاقة التعريف",
      cinPlaceholder: "أدخل رقم بطاقة التعريف",
      passwordLabel: "كلمة المرور",
      passwordPlaceholder: "أدخل كلمة المرور",
      forgotPassword: "هل نسيت كلمة المرور؟",
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

  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentTextIndex((prev) => (prev + 1) % rotatingScriptTexts.length);
    }, 3000);

    return () => clearInterval(interval);
  }, [rotatingScriptTexts.length]);

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

  const handleNextStep = () => {
    if (currentStep === 1) {
      setCurrentStep(2);
    } else {
      navigate("/client");
    }
  };

  const handlePreviousStep = () => {
    if (currentStep > 1) {
      setCurrentStep(currentStep - 1);
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
          {/* Logo - Always at top center */}
          <div className="mb-8 flex justify-center">
            <img
              src={theme === "dark" ? logoDark : logoExpanded}
              alt="BH Bank"
              className="h-12"
            />
          </div>

          <div
            className={`mb-6 flex ${isRTL ? "justify-start" : "justify-end"}`}
          >
            <button
              type="button"
              onClick={() => navigate("/")}
              className={`inline-flex items-center gap-2 rounded-lg px-4 py-2 text-sm font-medium transition-colors cursor-pointer ${
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
            {/* Step 1: Login with CIN and Password */}
            {currentStep === 1 && (
              <Motion.div
                key="step1"
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: 20 }}
                transition={{ duration: 0.3 }}
              >
                <h1
                  className={`mb-2 ${theme === "dark" ? "text-white" : "text-gray-900"} text-[36px] ${
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
                  {/* CIN Number */}
                  <div>
                    <label
                      className={`block text-sm mb-2 ${theme === "dark" ? "text-gray-300" : "text-gray-700"} ${
                        isRTL ? "text-right" : "text-left"
                      }`}
                    >
                      {ui.cinLabel}
                    </label>
                    <div className="relative">
                      <div
                        className={`absolute ${isRTL ? "right-4" : "left-4"} top-1/2 -translate-y-1/2 ${theme === "dark" ? "text-gray-500" : "text-gray-400"}`}
                      >
                        <CreditCard size={20} />
                      </div>
                      <input
                        type="text"
                        value={cinNumber}
                        onChange={(e) => setCinNumber(e.target.value)}
                        placeholder={ui.cinPlaceholder}
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
                      className="text-sm text-[#242f54] hover:underline cursor-pointer"
                    >
                      {ui.forgotPassword}
                    </button>
                  </div>

                  {/* Submit Button */}
                  <button
                    type="button"
                    onClick={handleNextStep}
                    className="w-full bg-[#242f54] text-white rounded-xl py-4 hover:bg-[#1a2340] transition-colors cursor-pointer"
                  >
                    {ui.signIn}
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

        <div className="relative z-10 text-center px-8">
          <AnimatePresence mode="wait">
            <Motion.div
              key={currentTextIndex}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              transition={{ duration: 0.7, ease: "easeOut" }}
              className="text-white"
            >
              <h2
                className="text-4xl md:text-5xl whitespace-nowrap"
                style={{
                  fontFamily:
                    "'Inter', 'SF Pro Display', -apple-system, BlinkMacSystemFont, sans-serif",
                  fontWeight: 300,
                  letterSpacing: "-0.02em",
                }}
              >
                {rotatingScriptTexts[currentTextIndex]}
              </h2>
            </Motion.div>
          </AnimatePresence>
        </div>
      </div>
    </div>
  );
}
