import { useState } from "react";
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
  Users,
  Activity,
  Clock,
} from "lucide-react";
import { useLanguage } from "../contexts/LanguageContext";
import logoExpanded from "../assets/BH_logo2.png";
import logoWhite from "../assets/bh_logo_blanc.png";
import flagAr from "../assets/flags/Flag_of_Tunisia.svg.webp";
import flagEn from "../assets/flags/Flag_of_the_United_Kingdom_(3-5).svg.webp";
import flagFr from "../assets/flags/Flag_of_France.svg.png";

/* ────────────────────────────────────────────
   Landing page — Smart Banking Assistant
   ──────────────────────────────────────────── */

export function FirstPage() {
  const navigate = useNavigate();
  const { language, setLanguage, t, isRTL } = useLanguage();
  const [activeSlide, setActiveSlide] = useState(0);

  const carouselSlides = [
    {
      icon: BarChart3,
      label: t("carouselLabel1"),
      title: t("carouselTitle1"),
      subtitle: t("carouselSubtitle1"),
      value: t("carouselDesc1"),
      color: "#0A2240",
      bgColor: "#E7EDF5",
    },
    {
      icon: Lightbulb,
      label: t("carouselLabel2"),
      title: t("carouselTitle2"),
      subtitle: t("carouselSubtitle2"),
      value: t("carouselDesc2"),
      color: "#0A2240",
      bgColor: "#E7EDF5",
    },
    {
      icon: ShieldCheck,
      label: t("carouselLabel3"),
      title: t("carouselTitle3"),
      subtitle: t("carouselSubtitle3"),
      value: t("carouselDesc3"),
      color: "#0A2240",
      bgColor: "#E7EDF5",
    },
  ];

  const features = [
    {
      icon: BarChart3,
      title: t("featureActivityTitle"),
      desc: t("featureActivityDesc"),
    },
    {
      icon: Lightbulb,
      title: t("featureInsightsTitle"),
      desc: t("featureInsightsDesc"),
    },
    {
      icon: ShieldCheck,
      title: t("featureSecureTitle"),
      desc: t("featureSecureDesc"),
    },
  ];

  const stats = [
    { icon: Users, value: "50K+", label: t("activeUsers") },
    { icon: Activity, value: "2M+", label: t("transactionsProcessed") },
    { icon: Clock, value: "99.9%", label: t("uptime") },
  ];

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

  return (
    <div
      dir={isRTL ? "rtl" : "ltr"}
      className="min-h-screen flex flex-col bg-white"
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
      <section className="bg-linear-to-br from-[#0A2240] via-[#123864] to-[#0A2240]">
        <div className="max-w-7xl mx-auto px-6 lg:px-8 py-20 lg:py-28">
          <div className="grid lg:grid-cols-2 gap-16 lg:gap-24 items-center">
            {/* Text column */}
            <div
              className={`space-y-8 ${isRTL ? "text-right lg:order-2" : "text-left"}`}
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
                  {t("heroSubtitle")}
                </p>
              </div>

              <button
                id="hero-access-btn"
                onClick={() => navigate("/login")}
                className={`group inline-flex items-center gap-2.5 px-8 py-4 rounded-full text-base font-bold text-white bg-[#0A2240] hover:bg-[#0A2240]/90 transition-all duration-200 shadow-lg shadow-[#0A2240]/25 hover:shadow-xl hover:shadow-[#0A2240]/30 cursor-pointer ${
                  isRTL ? "flex-row-reverse" : ""
                }`}
              >
                {t("accessYourSpace")}
                <ArrowRight
                  className={`w-4.5 h-4.5 transition-transform duration-200 ${
                    isRTL
                      ? "rotate-180 group-hover:-translate-x-1"
                      : "group-hover:translate-x-1"
                  }`}
                />
              </button>
            </div>

            {/* Carousel column */}
            <div className={`${isRTL ? "lg:order-1" : ""}`}>
              <div className="relative">
                {/* Decorative background shapes */}
                <div
                  className={`absolute -top-8 w-64 h-64 bg-[#0A2240]/8 rounded-full blur-3xl ${
                    isRTL ? "-left-8" : "-right-8"
                  }`}
                />
                <div
                  className={`absolute -bottom-8 w-48 h-48 bg-[#0A2240]/5 rounded-full blur-3xl ${
                    isRTL ? "-right-8" : "-left-8"
                  }`}
                />

                {/* Carousel cards */}
                <div className="relative z-10 space-y-4">
                  {carouselSlides.map((slide, index) => {
                    const isActive = index === activeSlide;
                    return (
                      <div
                        key={index}
                        onClick={() => setActiveSlide(index)}
                        className={`flex items-center gap-5 p-5 rounded-2xl border cursor-pointer transition-all duration-500 ${
                          isRTL ? "flex-row-reverse text-right" : ""
                        } ${
                          isActive
                            ? "bg-white border-gray-200 shadow-xl shadow-gray-200/50 scale-[1.02]"
                            : "bg-gray-50/80 border-gray-100 hover:bg-white hover:border-gray-200 hover:shadow-md scale-100"
                        }`}
                      >
                        {/* Icon */}
                        <div
                          className={`shrink-0 w-14 h-14 rounded-xl flex items-center justify-center transition-colors duration-500`}
                          style={{
                            backgroundColor: isActive
                              ? slide.bgColor
                              : "#f1f5f9",
                          }}
                        >
                          <slide.icon
                            className="w-6 h-6 transition-colors duration-500"
                            style={{
                              color: isActive ? slide.color : "#94a3b8",
                            }}
                            strokeWidth={1.75}
                          />
                        </div>

                        {/* Content */}
                        <div className="flex-1 min-w-0">
                          <p className="text-xs font-semibold text-[#0A2240]/70 tracking-wider mb-1">
                            {slide.label}
                          </p>
                          <p
                            className={`text-sm font-semibold transition-colors duration-500 ${
                              isActive ? "text-gray-900" : "text-gray-500"
                            }`}
                          >
                            {slide.title}
                          </p>
                          <p
                            className={`text-sm mt-0.5 transition-colors duration-500 ${
                              isActive ? "text-gray-600" : "text-gray-400"
                            }`}
                          >
                            {slide.subtitle}
                          </p>
                          <p
                            className="text-sm font-bold mt-1.5 transition-colors duration-500"
                            style={{
                              color: isActive ? slide.color : "#cbd5e1",
                            }}
                          >
                            {slide.value}
                          </p>
                        </div>

                        {/* Active indicator line */}
                        <div
                          className={`shrink-0 w-1 h-10 rounded-full transition-all duration-500 ${
                            isActive ? "opacity-100" : "opacity-0"
                          }`}
                          style={{ backgroundColor: slide.color }}
                        />
                      </div>
                    );
                  })}
                </div>

                {/* Carousel dots */}
                <div
                  className={`flex items-center gap-2 mt-6 ${
                    isRTL ? "justify-end" : "justify-start"
                  }`}
                >
                  {carouselSlides.map((_, index) => (
                    <button
                      key={index}
                      onClick={() => setActiveSlide(index)}
                      className={`rounded-full transition-all duration-300 cursor-pointer ${
                        index === activeSlide
                          ? "w-8 h-2 bg-[#0A2240]"
                          : "w-2 h-2 bg-gray-200 hover:bg-gray-300"
                      }`}
                    />
                  ))}
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ── FEATURES SECTION ── */}
      <section className="bg-white border-t border-gray-100">
        <div className="max-w-7xl mx-auto px-6 lg:px-8 py-20 lg:py-24">
          <div className="grid md:grid-cols-3 gap-8 lg:gap-12">
            {features.map((feature, index) => (
              <div
                key={index}
                className={`group p-8 rounded-2xl border border-gray-100 hover:border-gray-200 bg-surface-alt hover:bg-white hover:shadow-xl hover:shadow-gray-100/80 transition-all duration-300 ${
                  isRTL ? "text-right" : "text-left"
                }`}
              >
                <div className="w-12 h-12 rounded-xl flex items-center justify-center mb-5 transition-colors duration-300 bg-[#E7EDF5] group-hover:bg-[#0A2240]/15">
                  <feature.icon
                    className="w-5.5 h-5.5 transition-colors duration-300 text-[#0A2240]"
                    strokeWidth={1.75}
                  />
                </div>
                <h3 className="text-base font-bold text-gray-900 mb-2">
                  {feature.title}
                </h3>
                <p className="text-sm text-gray-500 leading-relaxed">
                  {feature.desc}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── TRUST / STATS SECTION ── */}
      <section className="bg-[#0A2240]">
        <div className="max-w-7xl mx-auto px-6 lg:px-8 py-14 lg:py-16">
          <div
            className={`flex flex-col items-center gap-8 ${
              isRTL ? "text-right" : "text-center"
            }`}
          >
            <h2 className="text-lg font-semibold text-white/80">
              {t("trustedBy")}
            </h2>
            <div className="grid grid-cols-3 gap-12 lg:gap-24 w-full max-w-2xl">
              {stats.map((stat, index) => (
                <div key={index} className="flex flex-col items-center gap-2">
                  <stat.icon
                    className="w-5 h-5 text-white/50 mb-1"
                    strokeWidth={1.5}
                  />
                  <span className="text-3xl lg:text-4xl font-extrabold text-white">
                    {stat.value}
                  </span>
                  <span className="text-xs font-medium text-white/60 uppercase tracking-wider">
                    {stat.label}
                  </span>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* ── CTA BANNER ── */}
      <section className="bg-surface-alt">
        <div className="max-w-7xl mx-auto px-6 lg:px-8 py-16 lg:py-20">
          <div
            className={`flex flex-col lg:flex-row items-center justify-between gap-6 ${
              isRTL ? "lg:flex-row-reverse text-right" : "text-center lg:text-left"
            }`}
          >
            <div>
              <h2 className="text-2xl lg:text-3xl font-bold text-gray-900 mb-2">
                {t("heroHeadline")}
              </h2>
              <p className="text-gray-500">
                {t("heroSubtitle")}
              </p>
            </div>
            <button
              id="cta-access-btn"
              onClick={() => navigate("/login")}
              className={`shrink-0 group inline-flex items-center gap-2 px-8 py-3.5 rounded-full text-sm font-bold text-white bg-[#0A2240] hover:bg-[#0A2240]/90 transition-all duration-200 shadow-lg shadow-[#0A2240]/20 hover:shadow-xl cursor-pointer ${
                isRTL ? "flex-row-reverse" : ""
              }`}
            >
              {t("accessYourSpace")}
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
                {t("heroSubtitle")}
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
