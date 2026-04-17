import { useEffect, useState } from "react";
import { useNavigate } from "react-router";
import {
  ArrowRight,
  Mail,
  Phone,
  HelpCircle,
  FileText,
} from "lucide-react";
import { useLanguage } from "../contexts/LanguageContext";
import logoExpanded from "../assets/BH_logo2.webp";
import logoWhite from "../assets/bh_logo_blanc.webp";
import bhPhones from "../assets/bh_phones.webp";
import bhStructure from "../assets/bh_strucuture.webp";
import bhClock from "../assets/bh_clock.webp";
import avisCommercant from "../assets/avis/Commerçant tunisien.webp";
import avisHommeAge from "../assets/avis/Homme âgé tunisien.webp";
import avisJeuneFemme from "../assets/avis/Jeune femme tunisienne.webp";
import avisJeuneHomme from "../assets/avis/Jeune homme tunisien (moderne).webp";
import avisEtudiant from "../assets/avis/Étudiant tunisien.webp";
import hoverAdultSuit from "../assets/folder carousel hover/Adult in suit.webp";
import hoverAdultLogo from "../assets/folder carousel hover/Adult with BH Bank logo.webp";
import hoverBaby from "../assets/folder carousel hover/Baby.webp";
import hoverChild from "../assets/folder carousel hover/Child.webp";
import hoverTeenager from "../assets/folder carousel hover/Teenager.webp";
import hoverYoungAdult from "../assets/folder carousel hover/Young adult.webp";
import flagAr from "../assets/flags/Flag_of_Tunisia.svg.webp";
import flagEn from "../assets/flags/Flag_of_the_United_Kingdom_(3-5).svg.webp";
import flagFr from "../assets/flags/Flag_of_France.svg.webp";

/* ────────────────────────────────────────────
   Landing page — Smart Banking Assistant
   ──────────────────────────────────────────── */

export function FirstPage() {
  const navigate = useNavigate();
  const { language, setLanguage, t, isRTL } = useLanguage();
  const [activeReview, setActiveReview] = useState(0);
  const [activeHoverPhoto, setActiveHoverPhoto] = useState(null);

  const clientReviewsSectionCopy = {
    en: {
      title: "Client reviews",
      subtitle: "Real feedback from people using BH Advisor in their daily financial decisions.",
      badge: "Verified client",
    },
    fr: {
      title: "Avis de nos clients",
      subtitle: "Des retours concrets de clients qui utilisent BH Advisor au quotidien.",
      badge: "Client vérifié",
    },
    ar: {
      title: "آراء عملائنا",
      subtitle: "آراء حقيقية من عملاء يستخدمون BH Advisor في قراراتهم المالية اليومية.",
      badge: "عميل موثق",
    },
  };

  const hoverCarouselPhotos = [
    {
      src: hoverBaby,
      alt: "Baby",
    },
    {
      src: hoverChild,
      alt: "Child",
    },
    {
      src: hoverTeenager,
      alt: "Teenager",
    },
    {
      src: hoverYoungAdult,
      alt: "Young adult",
    },
    {
      src: hoverAdultSuit,
      alt: "Adult in suit",
    },
    {
      src: hoverAdultLogo,
      alt: "Adult with BH Bank red logo and Arabic text تخمم فيكم",
    },
  ];

  const clientReviewsCopy = {
    en: [
      {
        name: "Nabil A.",
        role: "Retail business owner",
        avatar: avisCommercant,
        text: "The dashboard gives me a clear view of expenses and cash flow. I can decide faster with less stress.",
      },
      {
        name: "Youssef B.",
        role: "Young professional",
        avatar: avisJeuneHomme,
        text: "Product recommendations are relevant to my profile, and the credit simulator helped me plan my project safely.",
      },
      {
        name: "Hiba K.",
        role: "Engineer",
        avatar: avisJeuneFemme,
        text: "Simple interface, useful insights, and strong security. It feels professional and reliable.",
      },
      {
        name: "Hatem R.",
        role: "Retired client",
        avatar: avisHommeAge,
        text: "I follow my financial activity clearly and I always feel guided step by step.",
      },
      {
        name: "Amir B.",
        role: "Student",
        avatar: avisEtudiant,
        text: "Very clear interface and practical recommendations for managing a small monthly budget.",
      },
    ],
    fr: [
      {
        name: "Nabil A.",
        role: "Commerçant",
        avatar: avisCommercant,
        text: "Le tableau de bord me donne une vue claire de mes dépenses. Je prends de meilleures décisions, plus vite.",
      },
      {
        name: "Youssef B.",
        role: "Jeune actif",
        avatar: avisJeuneHomme,
        text: "Les recommandations produits sont pertinentes et le simulateur de crédit m'a aidé à bien préparer mon projet.",
      },
      {
        name: "Hiba K.",
        role: "Ingénieure",
        avatar: avisJeuneFemme,
        text: "Interface simple, informations utiles et sécurité rassurante. L'expérience est fluide et claire.",
      },
      {
        name: "Hatem R.",
        role: "Client retraité",
        avatar: avisHommeAge,
        text: "Je vois facilement mon activité financière et je me sens accompagné dans mes décisions.",
      },
      {
        name: "Amir B.",
        role: "Étudiant",
        avatar: avisEtudiant,
        text: "La plateforme est claire et les conseils sont utiles pour gérer mon budget de manière simple.",
      },
    ],
    ar: [
      {
        name: "نبيل أ.",
        role: "صاحب مشروع",
        avatar: avisCommercant,
        text: "لوحة التحكم تعطيني رؤية واضحة للمصاريف، وهذا يساعدني على اتخاذ قرارات مالية أفضل بسرعة.",
      },
      {
        name: "يوسف ب.",
        role: "موظف شاب",
        avatar: avisJeuneHomme,
        text: "توصيات المنتجات مناسبة لملفي المالي، ومحاكي القرض ساعدني في التخطيط لمشروعي بثقة.",
      },
      {
        name: "هيبة ك.",
        role: "مهندسة",
        avatar: avisJeuneFemme,
        text: "واجهة بسيطة، مؤشرات مفيدة، وحماية قوية للبيانات. تجربة مريحة واحترافية.",
      },
      {
        name: "حاتم ر.",
        role: "متقاعد",
        avatar: avisHommeAge,
        text: "أتابع نشاطي المالي بوضوح وأشعر بثقة أكبر عند اتخاذ القرارات البنكية.",
      },
      {
        name: "أمير ب.",
        role: "طالب",
        avatar: avisEtudiant,
        text: "واجهة سهلة وتوصيات عملية تساعدني على تنظيم مصاريفي الشهرية بشكل أفضل.",
      },
    ],
  };

  const clientReviewsSection =
    clientReviewsSectionCopy[language] || clientReviewsSectionCopy.en;
  const clientReviews = clientReviewsCopy[language] || clientReviewsCopy.en;
  const isHoverCarouselActive = activeHoverPhoto !== null;
  const safeActiveReview = clientReviews.length
    ? activeReview % clientReviews.length
    : 0;

  useEffect(() => {
    if (clientReviews.length <= 1) {
      return undefined;
    }

    const intervalId = window.setInterval(() => {
      setActiveReview((previous) => (previous + 1) % clientReviews.length);
    }, 5000);

    return () => window.clearInterval(intervalId);
  }, [clientReviews.length]);

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
      subtitle: "",
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
      subtitle: "",
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

  const renderTrustCtaTitle = () => {
    if (language === "fr") {
      return (
        <>
          <span className="block">Votre espace financier personnel,</span>
          <span className="block">
            disponible <span className="text-accent">24h/24</span>.
          </span>
        </>
      );
    }

    return trustCta.title;
  };

  const hoverStripTitleCopy = {
    en: {
      introPrefix: "With",
      main: "we support you",
      sub: "from childhood to your golden years.",
    },
    fr: {
      introPrefix: "Avec",
      main: "nous vous accompagnons",
      sub: "de l'enfance a l'age d'or.",
    },
    ar: {
      introPrefix: "مع",
      main: "نرافقكم",
      sub: "من الطفولة إلى سن الحكمة.",
    },
  };

  const hoverStripTitle = hoverStripTitleCopy[language] || hoverStripTitleCopy.en;

  const renderHoverStripTitle = () => (
    <>
      <span
        className={`block text-sm font-semibold tracking-[0.12em] lg:text-base ${
          language === "ar" ? "" : "uppercase"
        }`}
      >
        <span
          className={`inline-flex items-center justify-center gap-2 ${
            isRTL ? "flex-row-reverse" : ""
          }`}
        >
          <span>{hoverStripTitle.introPrefix}</span>
          <span className="inline-flex items-center">
            <img
              src={logoWhite}
              alt="BH logo"
              className="h-3.5 w-auto object-contain drop-shadow-[0_1px_2px_rgba(10,34,64,0.5)] sm:h-14"
            />
          </span>
        </span>
      </span>
      <span className="mt-2 block text-3xl font-extrabold leading-tight lg:text-5xl">
        {hoverStripTitle.main}
      </span>
      <span className="block text-2xl font-bold leading-tight lg:text-4xl">
        {hoverStripTitle.sub}
      </span>
    </>
  );

  const phoneSplitRows =
    language === "fr"
      ? [
          { left: "Vue claire de", right: "votre activité" },
          { left: "Conseils", right: "personnalisés" },
          { left: "Accès", right: "sécurisé" },
        ]
      : language === "ar"
        ? [
            { left: "لنشاطك", right: "رؤية واضحة" },
            { left: "مخصصة", right: "نصائح" },
            { left: "آمن", right: "وصول" },
          ]
        : [
            { left: "Clear view of", right: "your activity" },
            { left: "Personalized", right: "guidance" },
            { left: "Secure", right: "access" },
          ];

  const mobilePhoneRows = phoneSplitRows.map((row) =>
    isRTL ? `${row.right} ${row.left}` : `${row.left} ${row.right}`,
  );

  return (
    <div
      dir={isRTL ? "rtl" : "ltr"}
      className="min-h-screen flex flex-col overflow-x-hidden bg-white"
    >
      {/* Floating language switcher */}
      <div className="fixed right-2 top-3 z-50 sm:right-6 sm:top-1/2 sm:-translate-y-1/2">
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
                  className={`flex h-10 w-12 items-center justify-center rounded-xl transition-all duration-200 cursor-pointer ${
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
                </button>
              );
            })}
          </div>
        </div>
      </div>

      {/* ── HERO SECTION ── */}
      <section className="overflow-hidden bg-linear-to-br from-[#0A2240] via-[#123864] to-[#0A2240] min-h-[88vh] lg:min-h-[96vh]">
        <div className="max-w-7xl mx-auto px-6 pt-14 pb-0 lg:px-8 lg:pt-28 lg:pb-0">
          <div dir="ltr" className="grid min-h-[74vh] content-between items-center gap-8 lg:min-h-0 lg:content-normal lg:grid-cols-2 lg:items-end lg:gap-16">
            {/* Text column */}
            <div
              className={`relative z-20 max-w-3xl space-y-8 ${isRTL ? "lg:order-2 lg:justify-self-end text-right" : "lg:order-1 text-left"}`}
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

                {guideEntry.subtitle ? (
                  <p className={`text-sm text-white/75 ${isRTL ? "text-right" : "text-left"}`}>
                    {guideEntry.subtitle}
                  </p>
                ) : null}
              </div>
            </div>

            {/* Structure visual on the right side of hero */}
            <div
              className={`relative w-full self-end pt-4 lg:self-end lg:pt-0 ${
                isRTL ? "lg:order-1 lg:justify-self-start" : "lg:order-2 lg:justify-self-end"
              }`}
            >
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

              <div
                className={`relative z-10 flex w-full items-end justify-center ${
                  isRTL ? "lg:justify-start" : "lg:justify-end"
                }`}
              >
                <img
                  src={bhStructure}
                  alt="BH Structure"
                  className={`h-auto w-[118%] max-w-120 object-contain translate-y-12 sm:w-[92%] sm:translate-y-14 lg:max-w-none lg:translate-y-30 ${
                    isRTL
                      ? "object-bottom-left lg:w-[230%] lg:-translate-x-100"
                      : "object-bottom-right lg:w-[230%] lg:translate-x-100"
                  }`}
                />
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ── PHONE + WORDS SECTION ── */}
      <section className="relative overflow-hidden bg-linear-to-br from-[#ffffff] via-[#f5f7fa] to-[#edf1f5] min-h-0 lg:min-h-[82vh]">
        <div
          className={`pointer-events-none absolute -top-16 h-72 w-72 rounded-full bg-[#d7e1ea]/45 blur-3xl ${
            isRTL ? "-left-16" : "-right-16"
          }`}
        />
        <div
          className={`pointer-events-none absolute -bottom-24 h-80 w-80 rounded-full border border-[#cfd9e4]/70 bg-[#f2f6fa]/50 ${
            isRTL ? "-right-20" : "-left-20"
          }`}
        />
        <div
          className={`pointer-events-none absolute top-1/2 h-36 w-36 -translate-y-1/2 rotate-12 rounded-3xl bg-[#e2e9f1]/55 ${
            isRTL ? "left-10" : "right-10"
          }`}
        />

        <div className="relative z-10 max-w-7xl mx-auto px-6 lg:px-8 py-12 sm:py-16 lg:py-24">
          <div className={`grid gap-6 sm:gap-8 lg:gap-12 lg:grid-cols-[minmax(340px,1fr)_auto_minmax(340px,1fr)] lg:items-center ${isRTL ? "text-right" : "text-left"}`}>
            <div
              className={`order-2 hidden w-full grid-rows-3 gap-5 text-center lg:grid ${
                isRTL ? "lg:order-3 lg:justify-items-start lg:text-left" : "lg:justify-items-end lg:text-right"
              }`}
            >
              {phoneSplitRows.map((row, index) => (
                <h3
                  key={`phone-left-${index}`}
                  className={`flex h-16 items-center whitespace-nowrap tracking-tight text-2xl font-extrabold leading-[1.08] text-[#16324d] sm:h-20 sm:text-3xl lg:h-24 lg:text-[3rem] ${
                    isRTL ? "justify-center lg:justify-start" : "justify-center lg:justify-end"
                  }`}
                >
                  {row.left}
                </h3>
              ))}
            </div>

            <div className="order-1 flex justify-center lg:order-2">
              <img
                src={bhPhones}
                alt="BH Phones"
                className="h-auto w-[74%] max-w-xs object-contain transition-transform duration-300 sm:w-[60%] sm:max-w-sm lg:w-full lg:max-w-5xl lg:scale-[1.35]"
              />
            </div>

            <div className="order-2 space-y-2 text-center lg:hidden">
              {mobilePhoneRows.map((line, index) => (
                <h3
                  key={`phone-mobile-${index}`}
                  className={`text-3xl font-extrabold leading-tight sm:text-4xl ${
                    index % 2 === 0 ? "text-[#16324d]" : "text-[#355b80]"
                  }`}
                >
                  {line}
                </h3>
              ))}
            </div>

            <div
              className={`order-3 hidden w-full grid-rows-3 gap-5 text-center lg:grid ${
                isRTL ? "lg:order-1 lg:justify-items-end lg:text-right" : "lg:justify-items-start lg:text-left"
              }`}
            >
              {phoneSplitRows.map((row, index) => (
                <h3
                  key={`phone-right-${index}`}
                  className={`flex h-16 items-center whitespace-nowrap tracking-tight text-2xl font-extrabold leading-[1.08] text-[#355b80] sm:h-20 sm:text-3xl lg:h-24 lg:text-[3rem] ${
                    isRTL ? "justify-center lg:justify-end" : "justify-center lg:justify-start"
                  }`}
                >
                  {row.right}
                </h3>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* ── HOVER IMAGE STRIP ── */}
      <section className="relative overflow-hidden bg-linear-to-br from-[#fcfcfd] via-[#f3f5f8] to-[#eceff3] py-14 lg:py-16">
        <div
          className={`pointer-events-none absolute -top-20 h-80 w-80 rounded-full bg-white/70 blur-3xl ${
            isRTL ? "-left-20" : "-right-20"
          }`}
        />
        <div
          className={`pointer-events-none absolute -bottom-24 h-96 w-96 rounded-full border border-[#d7dfe8]/70 ${
            isRTL ? "-right-24" : "-left-24"
          }`}
        />

        <div className="relative z-10 max-w-7xl mx-auto px-6 text-center lg:px-8">
          <h2 className="mx-auto max-w-5xl leading-tight text-[#1b3f63]">
            {renderHoverStripTitle()}
          </h2>
          <div className="mx-auto mt-4 h-1.5 w-28 rounded-full bg-linear-to-r from-[#8da6bf] to-[#c7d3df]" />
        </div>

        <div
          onMouseLeave={() => setActiveHoverPhoto(null)}
          className="relative z-10 mt-8 flex w-full flex-nowrap items-stretch overflow-x-auto"
        >
          {hoverCarouselPhotos.map((photo, index) => {
            const isActive = activeHoverPhoto === index;
            const isShrunk = isHoverCarouselActive && !isActive;
            const isLastPhoto = index === hoverCarouselPhotos.length - 1;
            const isLastPhotoActive = activeHoverPhoto === hoverCarouselPhotos.length - 1;

            return (
              <button
                key={`${photo.alt}-${index}`}
                type="button"
                onMouseEnter={() => setActiveHoverPhoto(index)}
                onFocus={() => setActiveHoverPhoto(index)}
                onClick={() => setActiveHoverPhoto(index)}
                aria-label={photo.alt}
                aria-pressed={isActive}
                className={`group relative shrink-0 overflow-hidden transition-all duration-500 ease-out cursor-pointer ${
                  isActive
                    ? isLastPhoto
                      ? "basis-[70%] sm:basis-[60%] md:basis-[40%] lg:basis-[30%]"
                      : "basis-[54%] sm:basis-[37%] md:basis-[25%] lg:basis-[21%]"
                    : isShrunk
                      ? isLastPhotoActive
                        ? "basis-[32%] opacity-80 sm:basis-[22%] md:basis-[15%] lg:basis-[14%]"
                        : "basis-[36%] opacity-85 sm:basis-[24%] md:basis-[16%] lg:basis-[15.8%]"
                      : "basis-[45%] sm:basis-[30%] md:basis-[16.66%] lg:basis-[16.66%]"
                } ${isLastPhoto && isActive ? "bg-[#f3f5f8]" : ""}
                }`}
              >
                <img
                  src={photo.src}
                  alt={photo.alt}
                  className={`h-64 w-full transition-all duration-500 ease-out sm:h-80 md:h-88 lg:h-120 ${
                    isLastPhoto && isActive
                      ? "object-contain bg-[#f3f5f8] p-2 sm:p-3"
                      : "object-cover"
                  } ${
                    isActive
                      ? isLastPhoto
                        ? "scale-[1.22]"
                        : "scale-110"
                      : isShrunk
                        ? "scale-100"
                        : "scale-105"
                  }`}
                />
              </button>
            );
          })}
        </div>
      </section>

      {/* ── CLIENT REVIEWS CAROUSEL ── */}
      <section className="border-t border-[#e4edf7] bg-[#f8fbff]">
        <div className="max-w-7xl mx-auto px-6 lg:px-8 py-16 lg:py-20">
          <div className={`mx-auto max-w-3xl ${isRTL ? "text-right" : "text-center"}`}>
            <h2 className="text-3xl font-bold text-[#1b3f63] lg:text-4xl">
              {clientReviewsSection.title}
            </h2>
            <p className="mt-3 text-base text-[#5A7EA2] lg:text-lg">
              {clientReviewsSection.subtitle}
            </p>
          </div>

          <div className="mt-10 overflow-hidden rounded-3xl border border-[#d5e2f0] bg-white shadow-lg shadow-[#0A2240]/8">
            <div
              className="flex transition-transform duration-700 ease-out"
              style={{
                transform: `translateX(${isRTL ? safeActiveReview * 100 : -safeActiveReview * 100}%)`,
              }}
            >
              {clientReviews.map((review, index) => (
                <article
                  key={`review-${index}`}
                  className="w-full shrink-0 p-7 sm:p-9 lg:p-11"
                >
                  <div
                    className={`flex items-start justify-between gap-4 ${
                      isRTL ? "flex-row-reverse" : ""
                    }`}
                  >
                    <div className={`flex items-center gap-3 ${isRTL ? "flex-row-reverse" : ""}`}>
                      <img
                        src={review.avatar}
                        alt={review.name}
                        className="h-14 w-14 rounded-full border-2 border-[#d9e6f3] object-cover"
                      />
                      <div className={isRTL ? "text-right" : "text-left"}>
                        <h3 className="text-xl font-bold text-[#0A2240]">{review.name}</h3>
                        <p className="mt-1 text-sm font-medium text-[#2F5F93]">{review.role}</p>
                      </div>
                    </div>
                    <span className="rounded-full bg-[#E7EDF5] px-3 py-1 text-xs font-bold tracking-wide text-[#0A2240]">
                      {clientReviewsSection.badge}
                    </span>
                  </div>

                  <p className={`mt-6 text-lg leading-relaxed text-gray-700 ${isRTL ? "text-right" : "text-left"}`}>
                    &quot;{review.text}&quot;
                  </p>
                </article>
              ))}
            </div>
          </div>

          <div className={`mt-6 flex items-center gap-2 ${isRTL ? "justify-end" : "justify-center"}`}>
            {clientReviews.map((review, index) => (
              <button
                key={`${review.name}-${index}`}
                type="button"
                onClick={() => setActiveReview(index)}
                aria-label={`Review ${index + 1}`}
                aria-pressed={safeActiveReview === index}
                className={`h-2.5 rounded-full transition-all duration-300 cursor-pointer ${
                  safeActiveReview === index
                    ? "w-8 bg-[#0A2240]"
                    : "w-2.5 bg-[#9AB7D8] hover:bg-[#0A2240]/60"
                }`}
              />
            ))}
          </div>
        </div>
      </section>

      {/* ── CTA BANNER ── */}
      <section className="bg-surface-alt">
        <div className="max-w-7xl mx-auto px-6 lg:px-8 py-16 lg:py-20">
          <div
            className={`flex flex-col gap-8 lg:flex-row lg:items-center lg:justify-between ${
              isRTL ? "lg:flex-row-reverse text-right" : "text-center lg:text-left"
            }`}
          >
            <div
              className={`flex flex-col items-center gap-5 lg:flex-row lg:items-center lg:gap-7 ${
                isRTL ? "lg:flex-row-reverse" : "lg:flex-row"
              }`}
            >
              <img
                src={bhClock}
                alt="BH Clock"
                className="h-28 w-28 object-contain sm:h-32 sm:w-32 lg:h-40 lg:w-40"
              />
              <div className={`max-w-3xl ${isRTL ? "lg:text-right" : "lg:text-left"}`}>
                <h2 className="mb-2 text-2xl font-bold text-gray-900 lg:text-3xl">
                  {renderTrustCtaTitle()}
                </h2>
                {trustCta.subtitle ? (
                  <p className="text-gray-500">
                    {trustCta.subtitle}
                  </p>
                ) : null}
              </div>
            </div>
            <div className={`shrink-0 flex items-center ${isRTL ? "justify-end" : "justify-center lg:justify-end"}`}>
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
