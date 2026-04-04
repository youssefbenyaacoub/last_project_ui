import { useState } from "react";
import { useNavigate } from "react-router";
import { motion, AnimatePresence } from "framer-motion";
import {
  Mail,
  Lock,
  User,
  Phone,
  Eye,
  EyeOff,
  CreditCard,
  Check,
  Calendar,
  House,
} from "lucide-react";
import { useTheme } from "../contexts/ThemeContext";
import { useLanguage } from "../contexts/LanguageContext";
import logoExpanded from "../assets/BH_logo2.png";
import flagAr from "../assets/flags/Flag_of_Tunisia.svg.webp";
import flagEn from "../assets/flags/Flag_of_the_United_Kingdom_(3-5).svg.webp";
import flagFr from "../assets/flags/Flag_of_France.svg.png";
import {
  registerAccount,
  resendEmailOTP,
  setAuthSession,
  verifyCard,
  verifyEmail,
  verifyOTP,
} from "../api";

export function SignInPage() {
  const navigate = useNavigate();
  const { theme } = useTheme();
  const { language, setLanguage, isRTL } = useLanguage();
  const [currentStep, setCurrentStep] = useState(1);
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [errorMessage, setErrorMessage] = useState("");
  const [clientId, setClientId] = useState("");
  const [phoneVerificationRequired, setPhoneVerificationRequired] = useState(true);

  // Step 1: Personal Information
  const [cardNumber, setCardNumber] = useState("");
  const [fullName, setFullName] = useState("");
  const [birthDate, setBirthDate] = useState("");
  const [phoneNumber, setPhoneNumber] = useState("");

  // Step 2: Phone Verification
  const [phoneCode, setPhoneCode] = useState(["", "", "", "", "", ""]);

  // Step 3: Account credentials
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");

  // Step 4: Email Verification
  const [emailCode, setEmailCode] = useState(["", "", "", "", "", ""]);

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

  const stepLabels = {
    fr: [
      "Vérification Carte",
      "Code SMS",
      "Créer le Compte",
      "Vérifier Email",
    ],
    en: [
      "Card Verification",
      "SMS Code",
      "Create Account",
      "Verify Email",
    ],
    ar: [
      "التحقق من البطاقة",
      "رمز SMS",
      "إنشاء الحساب",
      "تحقق من البريد",
    ],
  };

  const localizedSteps = stepLabels[language] || stepLabels.en;
  const visibleSteps = phoneVerificationRequired
    ? localizedSteps
    : [localizedSteps[0], localizedSteps[2], localizedSteps[3]];
  const visualCurrentStep = phoneVerificationRequired
    ? currentStep
    : currentStep === 4
      ? 3
      : currentStep;

  const signInCopy = {
    en: {
      home: "Home",
      step1Hint: "Card Number (Client ID), full name, birth date and phone number",
      cardLabel: "Card Number (Client ID)",
      fullNameLabel: "Full Name",
      birthDateLabel: "Birth Date",
      birthDatePlaceholder: "dd/mm/yyyy",
      phoneLabel: "Phone Number",
      step1Cta: "Send OTP code",
      step2DescPrefix: "You received an OTP code at",
      codeNotReceived: "Didn't receive the code? ",
      resend: "Resend",
      back: "Back",
      verify: "Verify",
      step3Hint: "Enter email, password and confirm password",
      emailLabel: "Email Address",
      emailPlaceholder: "Enter your email",
      passwordLabel: "Password",
      passwordPlaceholder: "Create a password",
      confirmPasswordLabel: "Confirm Password",
      confirmPasswordPlaceholder: "Confirm your password",
      passwordMismatch: "Passwords do not match",
      continue: "Continue",
      step4DescPrefix: "Enter the OTP code sent to",
      complete: "Complete",
      haveAccount: "Already have an account? ",
      signIn: "Sign in",
      faq: "FAQ",
    },
    fr: {
      home: "Accueil",
      step1Hint:
        "Numero de Carte (ID Client), nom complet, date de naissance et numero de telephone",
      cardLabel: "Numéro de Carte (ID Client)",
      fullNameLabel: "Nom Complet",
      birthDateLabel: "Date de Naissance",
      birthDatePlaceholder: "jj/mm/aaaa",
      phoneLabel: "Numéro de téléphone",
      step1Cta: "Envoyer le code OTP",
      step2DescPrefix: "Vous avez recu un OTP au",
      codeNotReceived: "Code non reçu? ",
      resend: "Renvoyer",
      back: "Retour",
      verify: "Vérifier",
      step3Hint: "Ajoutez email, mot de passe et confirmation",
      emailLabel: "Adresse email",
      emailPlaceholder: "Entrez votre email",
      passwordLabel: "Mot de passe",
      passwordPlaceholder: "Créer un mot de passe",
      confirmPasswordLabel: "Confirmer le mot de passe",
      confirmPasswordPlaceholder: "Confirmer votre mot de passe",
      passwordMismatch: "Les mots de passe ne correspondent pas",
      continue: "Continuer",
      step4DescPrefix: "Entrez le code OTP envoye a",
      complete: "Terminer",
      haveAccount: "Vous avez déjà un compte? ",
      signIn: "Se connecter",
      faq: "FAQ",
    },
    ar: {
      home: "الرئيسية",
      step1Hint: "رقم البطاقة (معرف العميل)، الاسم الكامل، تاريخ الميلاد ورقم الهاتف",
      cardLabel: "رقم البطاقة (معرف العميل)",
      fullNameLabel: "الاسم الكامل",
      birthDateLabel: "تاريخ الميلاد",
      birthDatePlaceholder: "يوم/شهر/سنة",
      phoneLabel: "رقم الهاتف",
      step1Cta: "إرسال رمز OTP",
      step2DescPrefix: "لقد استلمت رمز OTP على",
      codeNotReceived: "لم يصلك الرمز؟ ",
      resend: "إعادة الإرسال",
      back: "رجوع",
      verify: "تحقق",
      step3Hint: "أدخل البريد الإلكتروني وكلمة المرور وتأكيدها",
      emailLabel: "البريد الإلكتروني",
      emailPlaceholder: "أدخل بريدك الإلكتروني",
      passwordLabel: "كلمة المرور",
      passwordPlaceholder: "أنشئ كلمة مرور",
      confirmPasswordLabel: "تأكيد كلمة المرور",
      confirmPasswordPlaceholder: "أكد كلمة المرور",
      passwordMismatch: "كلمتا المرور غير متطابقتين",
      continue: "متابعة",
      step4DescPrefix: "أدخل رمز OTP المرسل إلى",
      complete: "إنهاء",
      haveAccount: "لديك حساب بالفعل؟ ",
      signIn: "تسجيل الدخول",
      faq: "الأسئلة الشائعة",
    },
  };

  const ui = signInCopy[language] || signInCopy.en;

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

  const handleEmailCodeChange = (index, value) => {
    if (value.length <= 1 && /^\d*$/.test(value)) {
      const newCode = [...emailCode];
      newCode[index] = value;
      setEmailCode(newCode);

      if (value && index < 5) {
        const nextInput = document.getElementById(`email-code-${index + 1}`);
        nextInput?.focus();
      }
    }
  };

  const handleResendCode = async (channel) => {
    setErrorMessage("");

    try {
      setIsSubmitting(true);

      if (channel === "phone") {
        if (!phoneVerificationRequired) {
          return;
        }

        await verifyCard({
          card_number: cardNumber.trim(),
          full_name: fullName.trim(),
          birthday: birthDate.trim(),
          phone: phoneNumber.trim(),
        });
        return;
      }

      const normalizedEmail = email.trim().toLowerCase();
      if (!normalizedEmail) {
        setErrorMessage("Email is required before resending code.");
        return;
      }

      await resendEmailOTP({ email: normalizedEmail });
    } catch (error) {
      setErrorMessage(error.message || "Unable to resend code.");
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleNextStep = async () => {
    setErrorMessage("");

    try {
      setIsSubmitting(true);

      if (currentStep === 1) {
        const payload = await verifyCard({
          card_number: cardNumber.trim(),
          full_name: fullName.trim(),
          birthday: birthDate.trim(),
          phone: phoneNumber.trim(),
        });

        setClientId(String(payload?.client_id || "").trim());
        if (payload?.client_name) {
          setFullName(String(payload.client_name));
        }
        const shouldVerifyPhone = payload?.phone_verification_required !== false;
        setPhoneVerificationRequired(shouldVerifyPhone);
        setCurrentStep(shouldVerifyPhone ? 2 : 3);
        return;
      }

      if (currentStep === 2) {
        const otp = phoneCode.join("");
        if (otp.length !== 6) {
          setErrorMessage("OTP code must contain 6 digits.");
          return;
        }

        await verifyOTP({
          phone: phoneNumber.trim(),
          code: otp,
          purpose: "registration",
        });

        setCurrentStep(3);
        return;
      }

      if (currentStep === 3) {
        if (password !== confirmPassword) {
          setErrorMessage(ui.passwordMismatch);
          return;
        }

        const resolvedClientId = clientId.trim();
        if (!resolvedClientId) {
          setErrorMessage("Card verification is required first.");
          return;
        }

        const normalizedEmail = email.trim().toLowerCase();
        const payload = await registerAccount({
          client_id: resolvedClientId,
          card_number: cardNumber.trim(),
          email: normalizedEmail,
          password,
          phone: phoneNumber.trim(),
        });

        setAuthSession({ ...payload, email: normalizedEmail });
        setCurrentStep(4);
        return;
      }

      if (currentStep === 4) {
        const otp = emailCode.join("");
        if (otp.length !== 6) {
          setErrorMessage("Email OTP code must contain 6 digits.");
          return;
        }

        await verifyEmail({
          email: email.trim().toLowerCase(),
          code: otp,
        });

        navigate("/dashboard");
      }
    } catch (error) {
      setErrorMessage(error.message || "Sign up failed.");
    } finally {
      setIsSubmitting(false);
    }
  };

  const handlePreviousStep = () => {
    setErrorMessage("");

    if (currentStep === 3 && !phoneVerificationRequired) {
      setCurrentStep(1);
      return;
    }

    if (currentStep > 1) {
      setCurrentStep(currentStep - 1);
    }
  };

  return (
    <div
      dir={isRTL ? "rtl" : "ltr"}
      className={`min-h-screen flex lg:flex-row-reverse ${theme === "dark" ? "bg-gray-900" : ""}`}
    >
      {/* Left Side - Aesthetic Background */}
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

        <div
          className={`relative z-10 w-full h-[76vh] px-8 lg:px-12 flex items-center ${
            isRTL ? "justify-start" : "justify-end"
          }`}
        >
          {/* Vertical step indicators across the blue side */}
          <div className="relative h-full w-full max-w-sm">
            <div
              className="absolute top-6 bottom-6 left-5 w-0.5 bg-white/20"
            />

            <div className="h-full flex flex-col justify-between">
              {visibleSteps.map((text, index) => {
                const step = index + 1;
                const isDone = visualCurrentStep > step;
                const isActive = visualCurrentStep === step;

                return (
                  <div
                    key={step}
                    className={`relative flex items-center gap-4 ${
                      isRTL ? "flex-row-reverse text-right" : "text-left"
                    }`}
                  >
                    <div
                      className={`w-10 h-10 lg:w-11 lg:h-11 rounded-full flex items-center justify-center text-sm font-semibold shrink-0 ${
                        isDone || isActive
                          ? "bg-white text-[#10203c]"
                          : "bg-white/20 text-white/70"
                      }`}
                    >
                      {isDone ? <Check size={18} /> : step}
                    </div>
                    <p
                      className={`text-base lg:text-lg ${
                        isActive
                          ? "text-white font-semibold"
                          : "text-white/80 font-medium"
                      }`}
                    >
                      {text}
                    </p>
                  </div>
                );
              })}
            </div>
          </div>
        </div>
      </div>

      {/* Right Side - Signup Form */}
      <div
        className={`w-full lg:w-1/2 ${theme === "dark" ? "bg-[#020917]" : "bg-white"} flex items-center justify-center p-8 overflow-y-auto`}
      >
        <motion.div
          initial={{ opacity: 0, x: 20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.6, delay: 0.2 }}
          className="w-full max-w-md"
        >
          {/* Logo - Always at top center */}
          <div className="mb-8 flex justify-center">
            <img src={logoExpanded} alt="BH Bank" className="h-12" />
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

          <AnimatePresence mode="wait">
            {errorMessage && (
              <p
                className={`mb-4 text-sm ${
                  theme === "dark" ? "text-red-400" : "text-red-600"
                } ${isRTL ? "text-right" : "text-left"}`}
              >
                {errorMessage}
              </p>
            )}

            {/* Step 1: Personal Information */}
            {currentStep === 1 && (
              <motion.div
                key="step1"
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -20 }}
                transition={{ duration: 0.3 }}
              >
                <h1
                  className={`text-4xl mb-2 ${theme === "dark" ? "text-white" : "text-gray-900"}`}
                >
                  {localizedSteps[0]}
                </h1>
                <p
                  className={`mb-8 ${theme === "dark" ? "text-gray-400" : "text-gray-600"}`}
                >
                  {ui.step1Hint}
                </p>

                <form className="space-y-6">
                  {/* Card Number */}
                  <div>
                    <label
                      className={`block text-sm mb-2 ${theme === "dark" ? "text-gray-300" : "text-gray-700"}`}
                    >
                      {ui.cardLabel}
                    </label>
                    <div className="relative">
                      <div
                        className={`absolute left-4 top-1/2 -translate-y-1/2 ${theme === "dark" ? "text-gray-500" : "text-gray-400"}`}
                      >
                        <CreditCard size={20} />
                      </div>
                      <input
                        type="text"
                        value={cardNumber}
                        onChange={(e) =>
                          setCardNumber(e.target.value.replace(/\D/g, "").slice(0, 19))
                        }
                        placeholder="1234567812345678"
                        inputMode="numeric"
                        maxLength={19}
                        className={`w-full border rounded-xl px-12 py-4 placeholder:text-gray-400 focus:outline-none focus:border-[#242f54] focus:ring-2 focus:ring-[#242f54]/20 transition-all cursor-text ${
                          theme === "dark"
                            ? "bg-gray-800 border-gray-700 text-white"
                            : "bg-white border-gray-300 text-gray-900"
                        }`}
                      />
                    </div>
                  </div>

                  {/* Full Name */}
                  <div>
                    <label
                      className={`block text-sm mb-2 ${theme === "dark" ? "text-gray-300" : "text-gray-700"}`}
                    >
                      {ui.fullNameLabel}
                    </label>
                    <div className="relative">
                      <div
                        className={`absolute left-4 top-1/2 -translate-y-1/2 ${theme === "dark" ? "text-gray-500" : "text-gray-400"}`}
                      >
                        <User size={20} />
                      </div>
                      <input
                        type="text"
                        value={fullName}
                        onChange={(e) => setFullName(e.target.value)}
                        placeholder="Full name"
                        className={`w-full border rounded-xl px-12 py-4 placeholder:text-gray-400 focus:outline-none focus:border-[#242f54] focus:ring-2 focus:ring-[#242f54]/20 transition-all cursor-text ${
                          theme === "dark"
                            ? "bg-gray-800 border-gray-700 text-white"
                            : "bg-white border-gray-300 text-gray-900"
                        }`}
                      />
                    </div>
                  </div>

                  {/* Birth Date */}
                  <div>
                    <label
                      className={`block text-sm mb-2 ${theme === "dark" ? "text-gray-300" : "text-gray-700"}`}
                    >
                      {ui.birthDateLabel}
                    </label>
                    <div className="relative">
                      <div
                        className={`absolute left-4 top-1/2 -translate-y-1/2 ${theme === "dark" ? "text-gray-500" : "text-gray-400"}`}
                      >
                        <Calendar size={20} />
                      </div>
                      <input
                        type="text"
                        value={birthDate}
                        onChange={(e) => setBirthDate(e.target.value)}
                        placeholder={ui.birthDatePlaceholder}
                        className={`w-full border rounded-xl px-12 py-4 placeholder:text-gray-400 focus:outline-none focus:border-[#242f54] focus:ring-2 focus:ring-[#242f54]/20 transition-all cursor-text ${
                          theme === "dark"
                            ? "bg-gray-800 border-gray-700 text-white"
                            : "bg-white border-gray-300 text-gray-900"
                        }`}
                      />
                    </div>
                  </div>

                  {/* Phone Number */}
                  <div>
                    <label
                      className={`block text-sm mb-2 ${theme === "dark" ? "text-gray-300" : "text-gray-700"}`}
                    >
                      {ui.phoneLabel}
                    </label>
                    <div className="relative">
                      <div
                        className={`absolute left-4 top-1/2 -translate-y-1/2 ${theme === "dark" ? "text-gray-500" : "text-gray-400"}`}
                      >
                        <Phone size={20} />
                      </div>
                      <input
                        type="tel"
                        value={phoneNumber}
                        onChange={(e) => setPhoneNumber(e.target.value)}
                        placeholder="+216 XX XXX XXX"
                        className={`w-full border rounded-xl px-12 py-4 placeholder:text-gray-400 focus:outline-none focus:border-[#242f54] focus:ring-2 focus:ring-[#242f54]/20 transition-all cursor-text ${
                          theme === "dark"
                            ? "bg-gray-800 border-gray-700 text-white"
                            : "bg-white border-gray-300 text-gray-900"
                        }`}
                      />
                    </div>
                  </div>

                  {/* Submit Button */}
                  <button
                    type="button"
                    onClick={handleNextStep}
                    disabled={isSubmitting}
                    className="w-full bg-[#242f54] text-white rounded-xl py-4 hover:bg-[#1a2340] transition-colors cursor-pointer"
                  >
                    {isSubmitting ? "..." : ui.step1Cta}
                  </button>
                </form>
              </motion.div>
            )}

            {/* Step 2: Phone Verification */}
            {currentStep === 2 && (
              <motion.div
                key="step2"
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -20 }}
                transition={{ duration: 0.3 }}
              >
                <h1
                  className={`text-4xl mb-2 ${theme === "dark" ? "text-white" : "text-gray-900"}`}
                >
                  {localizedSteps[1]}
                </h1>
                <p
                  className={`mb-8 ${theme === "dark" ? "text-gray-400" : "text-gray-600"}`}
                >
                  {`${ui.step2DescPrefix} ${phoneNumber}`}
                </p>

                <div className="space-y-6">
                  {/* SMS Code Input */}
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
                    <button
                      type="button"
                      onClick={() => handleResendCode("phone")}
                      disabled={isSubmitting}
                      className="text-[#242f54] hover:underline cursor-pointer disabled:opacity-60 disabled:cursor-not-allowed"
                    >
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
                      disabled={isSubmitting}
                      className="flex-1 bg-[#242f54] text-white rounded-xl py-4 hover:bg-[#1a2340] transition-colors cursor-pointer disabled:opacity-60 disabled:cursor-not-allowed"
                    >
                      {isSubmitting ? "..." : ui.verify}
                    </button>
                  </div>
                </div>
              </motion.div>
            )}

            {/* Step 3: Create Account */}
            {currentStep === 3 && (
              <motion.div
                key="step3"
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -20 }}
                transition={{ duration: 0.3 }}
              >
                <h1
                  className={`text-4xl mb-2 ${theme === "dark" ? "text-white" : "text-gray-900"}`}
                >
                  {localizedSteps[2]}
                </h1>
                <p
                  className={`mb-8 ${theme === "dark" ? "text-gray-400" : "text-gray-600"}`}
                >
                  {ui.step3Hint}
                </p>

                <form className="space-y-6">
                  {/* Email */}
                  <div>
                    <label
                      className={`block text-sm mb-2 ${theme === "dark" ? "text-gray-300" : "text-gray-700"}`}
                    >
                      {ui.emailLabel}
                    </label>
                    <div className="relative">
                      <div
                        className={`absolute left-4 top-1/2 -translate-y-1/2 ${theme === "dark" ? "text-gray-500" : "text-gray-400"}`}
                      >
                        <Mail size={20} />
                      </div>
                      <input
                        type="email"
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        placeholder={ui.emailPlaceholder}
                        className={`w-full border rounded-xl px-12 py-4 placeholder:text-gray-400 focus:outline-none focus:border-[#242f54] focus:ring-2 focus:ring-[#242f54]/20 transition-all cursor-text ${
                          theme === "dark"
                            ? "bg-gray-800 border-gray-700 text-white"
                            : "bg-white border-gray-300 text-gray-900"
                        }`}
                      />
                    </div>
                  </div>

                  {/* Password */}
                  <div>
                    <label
                      className={`block text-sm mb-2 ${theme === "dark" ? "text-gray-300" : "text-gray-700"}`}
                    >
                      {ui.passwordLabel}
                    </label>
                    <div className="relative">
                      <div
                        className={`absolute left-4 top-1/2 -translate-y-1/2 ${theme === "dark" ? "text-gray-500" : "text-gray-400"}`}
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
                        }`}
                      />
                      <button
                        type="button"
                        onClick={() => setShowPassword(!showPassword)}
                        className={`absolute right-4 top-1/2 -translate-y-1/2 cursor-pointer ${
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

                  {/* Confirm Password */}
                  <div>
                    <label
                      className={`block text-sm mb-2 ${theme === "dark" ? "text-gray-300" : "text-gray-700"}`}
                    >
                      {ui.confirmPasswordLabel}
                    </label>
                    <div className="relative">
                      <div
                        className={`absolute left-4 top-1/2 -translate-y-1/2 ${theme === "dark" ? "text-gray-500" : "text-gray-400"}`}
                      >
                        <Lock size={20} />
                      </div>
                      <input
                        type={showConfirmPassword ? "text" : "password"}
                        value={confirmPassword}
                        onChange={(e) => setConfirmPassword(e.target.value)}
                        placeholder={ui.confirmPasswordPlaceholder}
                        className={`w-full border rounded-xl px-12 py-4 placeholder:text-gray-400 focus:outline-none focus:border-[#242f54] focus:ring-2 focus:ring-[#242f54]/20 transition-all cursor-text ${
                          theme === "dark"
                            ? "bg-gray-800 border-gray-700 text-white"
                            : "bg-white border-gray-300 text-gray-900"
                        }`}
                      />
                      <button
                        type="button"
                        onClick={() =>
                          setShowConfirmPassword(!showConfirmPassword)
                        }
                        className={`absolute right-4 top-1/2 -translate-y-1/2 cursor-pointer ${
                          theme === "dark"
                            ? "text-gray-500 hover:text-gray-400"
                            : "text-gray-400 hover:text-gray-600"
                        }`}
                      >
                        {showConfirmPassword ? (
                          <EyeOff size={20} />
                        ) : (
                          <Eye size={20} />
                        )}
                      </button>
                    </div>
                    {password &&
                      confirmPassword &&
                      password !== confirmPassword && (
                        <p className="text-red-500 text-sm mt-2">
                          {ui.passwordMismatch}
                        </p>
                      )}
                  </div>

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
                      disabled={isSubmitting}
                      className="flex-1 bg-[#242f54] text-white rounded-xl py-4 hover:bg-[#1a2340] transition-colors cursor-pointer disabled:opacity-60 disabled:cursor-not-allowed"
                    >
                      {isSubmitting ? "..." : ui.continue}
                    </button>
                  </div>
                </form>
              </motion.div>
            )}

            {/* Step 4: Email Verification */}
            {currentStep === 4 && (
              <motion.div
                key="step4"
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -20 }}
                transition={{ duration: 0.3 }}
              >
                <h1
                  className={`text-4xl mb-2 ${theme === "dark" ? "text-white" : "text-gray-900"}`}
                >
                  {localizedSteps[3]}
                </h1>
                <p
                  className={`mb-8 ${theme === "dark" ? "text-gray-400" : "text-gray-600"}`}
                >
                  {`${ui.step4DescPrefix} ${email}`}
                </p>

                <div className="space-y-6">
                  {/* Email Code Input */}
                  <div className="flex gap-3 justify-center">
                    {emailCode.map((digit, index) => (
                      <input
                        key={index}
                        id={`email-code-${index}`}
                        type="text"
                        inputMode="numeric"
                        maxLength={1}
                        value={digit}
                        onChange={(e) =>
                          handleEmailCodeChange(index, e.target.value)
                        }
                        onKeyDown={(e) => {
                          if (e.key === "Backspace" && !digit && index > 0) {
                            document
                              .getElementById(`email-code-${index - 1}`)
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
                    <button
                      type="button"
                      onClick={() => handleResendCode("email")}
                      disabled={isSubmitting}
                      className="text-[#242f54] hover:underline cursor-pointer disabled:opacity-60 disabled:cursor-not-allowed"
                    >
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
                      disabled={isSubmitting}
                      className="flex-1 bg-[#242f54] text-white rounded-xl py-4 hover:bg-[#1a2340] transition-colors cursor-pointer disabled:opacity-60 disabled:cursor-not-allowed"
                    >
                      {isSubmitting ? "..." : ui.complete}
                    </button>
                  </div>
                </div>
              </motion.div>
            )}
          </AnimatePresence>

          {/* Sign in link */}
          <p
            className={`text-center text-sm mt-8 ${theme === "dark" ? "text-gray-400" : "text-gray-600"}`}
          >
            {ui.haveAccount}
            <button
              onClick={() => navigate("/login")}
              className="text-[#242f54] hover:underline cursor-pointer"
            >
              {ui.signIn}
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
        </motion.div>
      </div>
    </div>
  );
}
