import { useNavigate } from "react-router";
import { ArrowLeft } from "lucide-react";
import { useLanguage } from "../contexts/LanguageContext";
import logoExpanded from "../assets/BH_logo2.png";
import flagAr from "../assets/flags/Flag_of_Tunisia.svg.webp";
import flagEn from "../assets/flags/Flag_of_the_United_Kingdom_(3-5).svg.webp";
import flagFr from "../assets/flags/Flag_of_France.svg.png";

/**
 * Shared layout for static pages (FAQ, Legal, Privacy, etc.)
 * Provides branded header with back navigation, language switcher, and footer.
 */
export function StaticPageLayout({ children, title }) {
  const navigate = useNavigate();
  const { language, setLanguage, t, isRTL } = useLanguage();
  const languageOptions = [
    { code: "en", label: "EN", flag: flagEn, flagAlt: "United Kingdom flag" },
    { code: "fr", label: "FR", flag: flagFr, flagAlt: "France flag" },
    { code: "ar", label: "AR", flag: flagAr, flagAlt: "Tunisia flag" },
  ];

  return (
    <div className="min-h-screen flex flex-col bg-white">
      {/* ── HEADER ── */}
      <header className="sticky top-0 z-50 bg-white/95 backdrop-blur-md border-b border-gray-100">
        <div
          className={`max-w-7xl mx-auto px-6 lg:px-8 h-16 flex items-center ${
            isRTL ? "flex-row-reverse" : "flex-row"
          } justify-between`}
        >
          {/* Left: Back + Logo */}
          <div className={`flex items-center gap-4 ${isRTL ? "flex-row-reverse" : ""}`}>
            <button
              onClick={() => navigate("/")}
              className={`flex items-center gap-1.5 text-sm font-medium text-gray-500 hover:text-[#0A2240] transition-colors cursor-pointer ${
                isRTL ? "flex-row-reverse" : ""
              }`}
            >
              <ArrowLeft className={`w-4 h-4 ${isRTL ? "rotate-180" : ""}`} />
              <span className="hidden sm:inline">
                {language === "ar" ? "الرئيسية" : language === "fr" ? "Accueil" : "Home"}
              </span>
            </button>
            <div className={`w-px h-6 bg-gray-200 ${isRTL ? "mr-0" : ""}`} />
            <img
              src={logoExpanded}
              alt="BH Bank"
              className="h-8 object-contain cursor-pointer"
              onClick={() => navigate("/")}
            />
          </div>

          {/* Right: Language switcher */}
          <div className="flex items-center bg-gray-50 rounded-full overflow-hidden border border-gray-100">
            {languageOptions.map((option) => {
              const isActive = language === option.code;
              return (
                <button
                  key={option.code}
                  onClick={() => setLanguage(option.code)}
                  className={`inline-flex items-center gap-1.5 px-3.5 py-1.5 text-xs font-semibold tracking-wide transition-all duration-200 cursor-pointer ${
                    isActive
                      ? "bg-[#0A2240] text-white shadow-sm"
                      : "text-gray-500 hover:text-gray-900"
                  }`}
                >
                  <img
                    src={option.flag}
                    alt={option.flagAlt}
                    className={`h-3.5 w-5 rounded-xs object-cover ${
                      isActive ? "ring-1 ring-white/80" : ""
                    }`}
                  />
                  {option.label}
                </button>
              );
            })}
          </div>
        </div>
      </header>

      {/* ── PAGE HEADER ── */}
      <div className="bg-linear-to-b from-surface-alt to-white border-b border-gray-100">
        <div className="max-w-4xl mx-auto px-6 lg:px-8 py-12 lg:py-16">
          <div className={`${isRTL ? "text-right" : "text-left"}`}>
            <div className={`inline-flex items-center gap-2 px-3 py-1 rounded-full bg-[#E7EDF5] border border-[#0A2240]/10 mb-4 ${isRTL ? "flex-row-reverse" : ""}`}>
              <span className="w-1.5 h-1.5 rounded-full bg-[#0A2240]" />
              <span className="text-[#0A2240] text-[11px] font-semibold tracking-wider uppercase">BH Bank</span>
            </div>
            <h1 className="text-3xl lg:text-4xl font-extrabold text-gray-900 tracking-tight">
              {title}
            </h1>
          </div>
        </div>
      </div>

      {/* ── CONTENT ── */}
      <main className="flex-1">
        <div className={`max-w-4xl mx-auto px-6 lg:px-8 py-12 lg:py-16 ${isRTL ? "text-right" : "text-left"}`}>
          {children}
        </div>
      </main>

      {/* ── FOOTER ── */}
      <footer className="bg-surface-alt border-t border-gray-200">
        <div className="max-w-7xl mx-auto px-6 lg:px-8 py-8">
          <div className={`flex flex-col sm:flex-row items-center justify-between gap-4 ${isRTL ? "sm:flex-row-reverse" : ""}`}>
            <p className="text-xs text-gray-400">{t("footerRights")}</p>
            <div className={`flex items-center gap-1.5 ${isRTL ? "flex-row-reverse" : ""}`}>
              <span className="w-2 h-2 rounded-full bg-[#0A2240]" />
              <span className="text-xs font-medium text-gray-400">BH Bank</span>
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
}
