import { useNavigate } from "react-router";
import {
  ArrowRight,
  BarChart3,
  Lightbulb,
  ShieldCheck,
  Mail,
  Phone,
  HelpCircle,
  FileText,
} from "lucide-react";
import { useLanguage } from "../contexts/LanguageContext";
import logoExpanded from "../assets/BH_logo2.png";
import logoWhite from "../assets/bh_logo_blanc.png";
import bhPhones from "../assets/bh_phones.png";
import bhStructure from "../assets/bh_strucuture.png";
import bhClock from "../assets/bh_clock.png";
import flagAr from "../assets/flags/Flag_of_Tunisia.svg.webp";
import flagEn from "../assets/flags/Flag_of_the_United_Kingdom_(3-5).svg.webp";
import flagFr from "../assets/flags/Flag_of_France.svg.png";

/* ────────────────────────────────────────────
   Landing page — Smart Banking Assistant
   ──────────────────────────────────────────── */

export function FirstPage() {
  const navigate = useNavigate();
  const { language, setLanguage, t, isRTL } = useLanguage();

  const middleFeaturesCopy = {
    en: {
      title: "Your banking companion",
      subtitle: "Everything you need to manage your finances with clarity and confidence.",
      cards: [
        {
          title: "Clear view of your activity",
          desc: "Track all your transactions, balance, and expenses in one place.",
        },
        {
          title: "Personalized guidance",
          desc: "Receive product recommendations tailored to your financial profile and projects.",
        },
        {
          title: "Secure access",
          desc: "Your data is protected with AES-256 encryption and two-factor authentication.",
        },
      ],
    },
    fr: {
      title: "Votre compagnon bancaire",
      subtitle: "Tout ce qu'il faut pour piloter vos finances avec clarté et sérénité.",
      cards: [
        {
          title: "Vue claire de votre activité",
          desc: "Suivez toutes vos transactions et soldes en un seul endroit.",
        },
        {
          title: "Conseils personnalisés",
          desc: "Recevez des conseils adaptés à vos habitudes de dépenses.",
        },
        {
          title: "Accès sécurisé",
          desc: "Vos données sont protégées par un chiffrement bancaire.",
        },
      ],
    },
    ar: {
      title: "رفيقك البنكي",
      subtitle: "كل ما تحتاجه لإدارة أموالك بوضوح وثقة.",
      cards: [
        {
          title: "رؤية واضحة لنشاطك",
          desc: "تابع جميع معاملاتك ورصيدك ونفقاتك في مكان واحد.",
        },
        {
          title: "نصائح مخصصة",
          desc: "احصل على توصيات منتجات مناسبة لملفك المالي ولمشاريعك.",
        },
        {
          title: "وصول آمن",
          desc: "بياناتك محمية بتشفير AES-256 ومصادقة ثنائية.",
        },
      ],
    },
  };

  const middleFeatures = middleFeaturesCopy[language] || middleFeaturesCopy.en;

  const features = [
    {
      icon: BarChart3,
      title: middleFeatures.cards[0].title,
      desc: middleFeatures.cards[0].desc,
    },
    {
      icon: Lightbulb,
      title: middleFeatures.cards[1].title,
      desc: middleFeatures.cards[1].desc,
    },
    {
      icon: ShieldCheck,
      title: middleFeatures.cards[2].title,
      desc: middleFeatures.cards[2].desc,
    },
  ];

  const phoneSectionCopy = {
    en: {
      title: "Your banking companion",
      subtitle: "Everything you need to manage your money with clarity and confidence.",
    },
    fr: {
      title: "Votre compagnon bancaire",
      subtitle: "Tout ce qu'il faut pour piloter vos finances avec clarté et sérénité.",
    },
    ar: {
      title: "رفيقك البنكي اليومي",
      subtitle: "كل ما تحتاجه لإدارة أموالك بوضوح وثقة.",
    },
  };

  const phoneSection = phoneSectionCopy[language] || phoneSectionCopy.en;

  const languageOptions = [
    {
      code: "ar",
      flag: flagAr,
      flagAlt: "Tunisia flag",
      label: "AR",
      aria: "Switch to Arabic",
    },
    {
      code: "en",
      flag: flagEn,
      flagAlt: "United Kingdom flag",
      label: "EN",
      aria: "Switch to English",
    },
    {
      code: "fr",
      flag: flagFr,
      flagAlt: "France flag",
      label: "FR",
      aria: "Switch to French",
    },
  ];

  const helpLinks = [
    { label: t("footerFAQ"), path: "/faq" },
    { label: t("footerGuides"), path: "/user-guides" },
    { label: t("footerSupport"), path: "/support-center" },
  ];

  const legalLinks = [
    { label: t("footerPrivacy"), path: "/privacy-policy" },
    { label: t("footerTerms"), path: "/terms-of-service" },
    { label: t("footerSecurity"), path: "/security" },
  ];

  const guideLinkCopy = {
    en: {
      title: "How to use the platform",
      subtitle: "Beginner walkthrough with detailed steps and charts.",
      button: "Open beginner guide",
    },
    fr: {
      title: "Comment utiliser la plateforme",
      subtitle: "Parcours débutant détaillé avec étapes et graphiques.",
      button: "Ouvrir le guide débutant",
    },
    ar: {
      title: "كيفية استخدام المنصة",
      subtitle: "دليل مبتدئ مفصل مع خطوات ورسوم بيانية.",
      button: "فتح دليل المبتدئ",
    },
  };
  const guideEntry = guideLinkCopy[language] || guideLinkCopy.en;

  const trustCtaCopy = {
    en: {
      title: "Your personal financial space, available 24/7.",
      subtitle:
        "Financial score, product recommendations, and credit simulation - everything you need to make the right decisions.",
      buttonExplore: "Discover the features",
      buttonAccess: "Access your space",
    },
    fr: {
      title: "Votre espace financier personnel, disponible 24h/24.",
      subtitle:
        "Score financier, recommandations produits, simulateur de crédit - tout ce dont vous avez besoin pour prendre les bonnes décisions.",
      buttonExplore: "Découvrir les fonctionnalités",
      buttonAccess: "Accéder à votre espace",
    },
    ar: {
      title: "مساحتك المالية الشخصية، متاحة 24/24.",
      subtitle:
        "النقطة المالية، توصيات المنتجات، ومحاكي القرض - كل ما تحتاجه لاتخاذ القرارات الصحيحة.",
      buttonExplore: "اكتشف الميزات",
      buttonAccess: "ادخل إلى مساحتك",
    },
  };

  const trustCta = trustCtaCopy[language] || trustCtaCopy.en;

  const footerTaglineCopy = {
    en: "Intelligent banking product recommendation system - BH Bank Tunisia",
    fr: "Système intelligent de recommandation de produits bancaires - BH Bank Tunisie",
    ar: "نظام ذكي للتوصية بالمنتجات البنكية - بنك الإسكان تونس",
  };

  const footerTagline = footerTaglineCopy[language] || footerTaglineCopy.en;

  const heroAccessLabel = language === "fr" ? "Accéder à votre espace" : t("accessYourSpace");

  const renderHeroHeadline = () => {
    if (language === "fr") {
      return (
        <>
          La <span className="text-accent">banque</span> simple,
          <br className="hidden sm:block" /> pensée pour vous.
        </>
      );
    }

    return t("heroHeadline");
  };

  const renderHeroSubtitle = () => {
    if (language === "fr") {
      return "Comprenez votre activité et prenez de meilleures décisions financières.";
    }

    return t("heroSubtitle");
  };

  return (
    <div
      dir={isRTL ? "rtl" : "ltr"}
      className="min-h-screen flex flex-col overflow-x-hidden bg-white"
    >
      {/* Floating language switcher */}
      <div className="fixed right-2 sm:right-6 top-1/2 -translate-y-1/2 z-50">
        <div className="rounded-2xl border border-gray-200 bg-white p-1.5 shadow-lg">
          <div className="flex flex-col items-stretch gap-1">
            {languageOptions.map((option) => {
              const isActive = language === option.code;
              return (
                <button
                  key={option.code}
                  id={`lang-switch-${option.code}`}
                  type="button"
                  onClick={() => setLanguage(option.code)}
                  aria-label={option.aria}
                  aria-pressed={isActive}
                  className={`flex items-center justify-center gap-2 rounded-xl w-21.5 px-2.5 py-2 transition-all duration-200 cursor-pointer ${
                    isActive
                      ? "bg-[#0A2240] text-white shadow-md"
                      : "text-gray-700 hover:bg-gray-100"
                  }`}
                >
                  <img
                    src={option.flag}
                    alt={option.flagAlt}
                    className={`h-4 w-6 rounded-xs object-cover ${
                      isActive ? "ring-1 ring-white/80" : ""
                    }`}
                  />
                  <span className="text-[10px] font-bold tracking-wide">
                    {option.label}
                  </span>
                </button>
              );
            })}
          </div>
        </div>
      </div>

      {/* ── HERO SECTION ── */}
      <section className="overflow-hidden bg-linear-to-br from-[#0A2240] via-[#123864] to-[#0A2240] min-h-[88vh] lg:min-h-[96vh]">
        <div className="max-w-7xl mx-auto px-6 pt-20 pb-0 lg:px-8 lg:pt-28 lg:pb-0">
          <div className="grid items-center gap-12 lg:grid-cols-2 lg:items-end lg:gap-16">
            {/* Text column */}
            <div
              className={`max-w-3xl space-y-8 lg:order-1 ${isRTL ? "text-right" : "text-left"}`}
            >
              <div className="space-y-5">
                <div className={`${isRTL ? "justify-end" : "justify-start"} flex`}>
                  <img
                    src={logoWhite}
                    alt="BH Bank"
                    className="h-14 sm:h-16 w-auto drop-shadow-[0_8px_20px_rgba(0,0,0,0.25)]"
                  />
                </div>

                <h1
                  className="text-4xl sm:text-5xl lg:text-[3.5rem] font-extrabold text-white leading-[1.1] tracking-tight"
                >
                  {renderHeroHeadline()}
                </h1>
                <p
                  className={`text-lg lg:text-xl leading-relaxed text-white/80 max-w-lg ${
                    isRTL ? "mr-0 ml-auto" : ""
                  }`}
                >
                  {renderHeroSubtitle()}
                </p>
              </div>

              <div className={`space-y-3 ${isRTL ? "items-end" : "items-start"}`}>
                <div className={`flex flex-wrap gap-3 ${isRTL ? "justify-end" : "justify-start"}`}>
                  <button
                    id="hero-access-btn"
                    onClick={() => navigate("/login")}
                    className={`group inline-flex items-center gap-2.5 px-8 py-4 rounded-full text-base font-bold text-white bg-[#0A2240] hover:bg-[#0A2240]/90 transition-all duration-200 shadow-lg shadow-[#0A2240]/25 hover:shadow-xl hover:shadow-[#0A2240]/30 cursor-pointer ${
                      isRTL ? "flex-row-reverse" : ""
                    }`}
                  >
                    {heroAccessLabel}
                    <ArrowRight
                      className={`w-4.5 h-4.5 transition-transform duration-200 ${
                        isRTL
                          ? "rotate-180 group-hover:-translate-x-1"
                          : "group-hover:translate-x-1"
                      }`}
                    />
                  </button>

                  <button
                    id="hero-guide-btn"
                    onClick={() => navigate("/user-guides")}
                    className={`inline-flex items-center gap-2.5 rounded-full border border-white/35 bg-white/10 px-6 py-4 text-base font-bold text-white backdrop-blur-sm transition-all duration-200 hover:bg-white/20 ${
                      isRTL ? "flex-row-reverse" : ""
                    }`}
                  >
                    <FileText className="h-4.5 w-4.5" />
                    {guideEntry.button}
                  </button>
                </div>

                <p className={`text-sm text-white/75 ${isRTL ? "text-right" : "text-left"}`}>
                  {guideEntry.subtitle}
                </p>
              </div>
            </div>

            {/* Structure visual on the right side of hero */}
            <div className="relative w-full pt-2 lg:order-2 lg:justify-self-end lg:self-end lg:pt-0">
              <div
                className={`absolute -top-8 h-72 w-72 rounded-full bg-white/8 blur-3xl ${
                  isRTL ? "-left-10" : "-right-10"
                }`}
              />
              <div
                className={`absolute -bottom-8 h-56 w-56 rounded-full bg-[#9AB7D8]/15 blur-3xl ${
                  isRTL ? "-right-10" : "-left-10"
                }`}
              />

              <div className="relative z-10">
                <img
                  src={bhStructure}
                  alt="BH Structure"
                  className="h-auto w-full max-w-none object-contain lg:ml-auto lg:w-[165%] lg:-translate-x-10"
                />
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ── FEATURES SECTION ── */}
      <section className="bg-white border-t border-gray-100">
        <div className="max-w-7xl mx-auto px-6 lg:px-8 py-20 lg:py-24">
          <div className="mx-auto mb-12 max-w-3xl text-center lg:mb-14">
            <h2 className="text-3xl font-bold text-gray-900 lg:text-4xl">
              {middleFeatures.title}
            </h2>
            <p className="mx-auto mt-4 max-w-3xl text-base text-gray-500 lg:text-xl">
              {middleFeatures.subtitle}
            </p>
          </div>

          <div className="grid gap-10 md:grid-cols-3 lg:gap-14">
            {features.map((feature, index) => (
              <div
                key={index}
                className="group px-3 py-2 text-center"
              >
                <div className="mx-auto mb-6 flex h-16 w-16 items-center justify-center rounded-full border border-gray-200">
                  <feature.icon
                    className="h-7 w-7 text-[#0A2240]"
                    strokeWidth={1.75}
                  />
                </div>
                <h3 className="mb-3 text-xl font-bold text-gray-900 lg:text-2xl">
                  {feature.title}
                </h3>
                <p className="text-base leading-relaxed text-gray-500 lg:text-lg">
                  {feature.desc}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── PHONE + WORDS SECTION ── */}
      <section className="bg-[#0A2240]">
        <div className="max-w-7xl mx-auto px-6 lg:px-8 py-14 lg:py-16">
          <div className={`grid gap-8 lg:grid-cols-5 lg:items-center ${isRTL ? "text-right" : "text-left"}`}>
            <div className={`${isRTL ? "lg:order-2" : "lg:order-1"} lg:col-span-3`}>
              <img
                src={bhPhones}
                alt="BH Phones"
                className="mx-auto h-auto w-full max-w-2xl lg:max-w-3xl object-contain"
              />
            </div>

            <div className={`space-y-7 text-center ${isRTL ? "lg:order-1" : "lg:order-2"} lg:col-span-2`}>
              <div className="mx-auto max-w-xl">
                <h2 className="text-3xl font-bold text-white lg:text-4xl">{phoneSection.title}</h2>
                <p className="mt-3 text-base text-white/80 lg:text-lg">{phoneSection.subtitle}</p>
              </div>

              <div className="space-y-5">
                <article className="px-2">
                  <h3 className="text-lg font-semibold text-white lg:text-xl">{middleFeatures.cards[0].title}</h3>
                  <p className="mt-2 text-sm text-white/80 lg:text-base">{middleFeatures.cards[0].desc}</p>
                </article>

                <article className="px-2">
                  <h3 className="text-lg font-semibold text-white lg:text-xl">{middleFeatures.cards[1].title}</h3>
                  <p className="mt-2 text-sm text-white/80 lg:text-base">{middleFeatures.cards[1].desc}</p>
                </article>

                <article className="px-2">
                  <h3 className="text-lg font-semibold text-white lg:text-xl">{middleFeatures.cards[2].title}</h3>
                  <p className="mt-2 text-sm text-white/80 lg:text-base">{middleFeatures.cards[2].desc}</p>
                </article>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ── CTA BANNER ── */}
      <section className="bg-surface-alt">
        <div className="max-w-7xl mx-auto px-6 lg:px-8 py-16 lg:py-20">
          <div
            className={`flex flex-col lg:flex-row items-center justify-between gap-8 ${
              isRTL ? "lg:flex-row-reverse text-right" : "text-center lg:text-left"
            }`}
          >
            <div className={`flex flex-col items-center gap-5 ${isRTL ? "lg:flex-row-reverse" : "lg:flex-row"}`}>
              <div>
                <h2 className="mb-2 text-2xl font-bold text-gray-900 lg:text-3xl">
                  {trustCta.title}
                </h2>
                <p className="text-gray-500">
                  {trustCta.subtitle}
                </p>
              </div>
              <img
                src={bhClock}
                alt="BH Clock"
                className="h-20 w-20 object-contain sm:h-24 sm:w-24 lg:h-28 lg:w-28"
              />
            </div>
            <div className={`shrink-0 flex flex-wrap items-center gap-3 ${isRTL ? "justify-end" : "justify-center lg:justify-start"}`}>
              <button
                id="cta-guide-btn"
                onClick={() => navigate("/user-guides")}
                className={`inline-flex items-center gap-2 rounded-full border border-[#0A2240]/25 bg-white px-6 py-3.5 text-sm font-bold text-[#0A2240] transition-colors hover:bg-[#edf2f9] ${
                  isRTL ? "flex-row-reverse" : ""
                }`}
              >
                <FileText className="h-4 w-4" />
                {trustCta.buttonExplore}
              </button>

              <button
                id="cta-access-btn"
                onClick={() => navigate("/login")}
                className={`group inline-flex items-center gap-2 px-8 py-3.5 rounded-full text-sm font-bold text-white bg-[#0A2240] hover:bg-[#0A2240]/90 transition-all duration-200 shadow-lg shadow-[#0A2240]/20 hover:shadow-xl cursor-pointer ${
                  isRTL ? "flex-row-reverse" : ""
                }`}
              >
                {trustCta.buttonAccess}
                <ArrowRight
                  className={`w-4 h-4 transition-transform duration-200 ${
                    isRTL
                      ? "rotate-180 group-hover:-translate-x-1"
                      : "group-hover:translate-x-1"
                  }`}
                />
              </button>
            </div>
          </div>
        </div>
      </section>

      {/* ── FOOTER ── */}
      <footer className="bg-white border-t border-gray-200">
        <div className="max-w-7xl mx-auto px-6 lg:px-8 py-14 lg:py-16">
          <div
            className={`grid md:grid-cols-4 gap-10 lg:gap-12 ${
              isRTL ? "text-right" : "text-left"
            }`}
          >
            {/* Brand */}
            <div className="space-y-4">
              <img
                src={logoExpanded}
                alt="BH Bank"
                className="h-9 object-contain"
              />
              <p className="text-sm text-gray-400 leading-relaxed max-w-xs">
                {footerTagline}
              </p>
            </div>

            {/* Contact */}
            <div className="space-y-4">
              <h4 className="text-sm font-bold text-gray-900 uppercase tracking-wider">
                {t("footerContact")}
              </h4>
              <p className="text-sm text-gray-400">{t("footerContactDesc")}</p>
              <div className="space-y-2.5">
                <a
                  href="mailto:support@bhbank.tn"
                  className={`flex items-center gap-2 text-sm text-gray-500 hover:text-[#0A2240] transition-colors ${
                    isRTL ? "flex-row-reverse" : ""
                  }`}
                >
                  <Mail className="w-3.5 h-3.5" />
                  {t("footerContactEmail")}
                </a>
                <a
                  href="tel:+21671126000"
                  className={`flex items-center gap-2 text-sm text-gray-500 hover:text-[#0A2240] transition-colors ${
                    isRTL ? "flex-row-reverse" : ""
                  }`}
                >
                  <Phone className="w-3.5 h-3.5" />
                  {t("footerContactPhone")}
                </a>
              </div>
            </div>

            {/* Help */}
            <div className="space-y-4">
              <h4 className="text-sm font-bold text-gray-900 uppercase tracking-wider">
                {t("footerHelp")}
              </h4>
              <p className="text-sm text-gray-400">{t("footerHelpDesc")}</p>
              <ul className="space-y-2">
                {helpLinks.map((item, i) => (
                  <li key={i}>
                    <button
                      type="button"
                      onClick={() => navigate(item.path)}
                      className={`flex items-center gap-2 text-sm text-gray-500 hover:text-[#0A2240] transition-colors cursor-pointer ${
                        isRTL ? "flex-row-reverse" : ""
                      }`}
                    >
                      <HelpCircle className="w-3.5 h-3.5" />
                      {item.label}
                    </button>
                  </li>
                ))}
              </ul>
            </div>

            {/* Legal */}
            <div className="space-y-4">
              <h4 className="text-sm font-bold text-gray-900 uppercase tracking-wider">
                {t("footerLegal")}
              </h4>
              <p className="text-sm text-gray-400">{t("footerLegalDesc")}</p>
              <ul className="space-y-2">
                {legalLinks.map((item, i) => (
                  <li key={i}>
                    <button
                      type="button"
                      onClick={() => navigate(item.path)}
                      className={`flex items-center gap-2 text-sm text-gray-500 hover:text-[#0A2240] transition-colors cursor-pointer ${
                        isRTL ? "flex-row-reverse" : ""
                      }`}
                    >
                      <FileText className="w-3.5 h-3.5" />
                      {item.label}
                    </button>
                  </li>
                ))}
              </ul>
            </div>
          </div>

          {/* Bottom bar */}
          <div className="mt-12 pt-8 border-t border-gray-100">
            <div
              className={`flex flex-col sm:flex-row items-center justify-between gap-4 ${
                isRTL ? "sm:flex-row-reverse" : ""
              }`}
            >
              <p className="text-xs text-gray-400">{t("footerRights")}</p>
              <div
                className={`flex items-center gap-1.5 ${
                  isRTL ? "flex-row-reverse" : ""
                }`}
              >
                <span className="w-2 h-2 rounded-full bg-[#0A2240]" />
                <span className="text-xs font-medium text-gray-400">
                  BH Bank
                </span>
              </div>
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
}
