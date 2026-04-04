import { useEffect, useState } from "react";
import { useNavigate } from "react-router";
import { Eye, EyeOff, House, Lock, Mail, ShieldCheck, UserRound } from "lucide-react";
import { useTheme } from "../contexts/ThemeContext";
import { useLanguage } from "../contexts/LanguageContext";
import logoExpanded from "../assets/BH_logo2.png";
import {
  clearAgentAuthSession,
  getAgentAuthToken,
  loginAgent,
  setAgentAuthSession,
} from "../api";

const REMEMBER_AGENT_EMAIL_KEY = "bh_agent_last_email";

const copyByLanguage = {
  en: {
    title: "Agent Portal",
    subtitle: "Secure access for BH Bank staff",
    home: "Home",
    clientAccess: "Client access",
    emailLabel: "Agent email",
    emailPlaceholder: "name@bhbank.tn",
    passwordLabel: "Password",
    passwordPlaceholder: "Enter your password",
    rememberMe: "Remember my agent login",
    passwordHint: "Use your browser password manager to safely remember the password.",
    signIn: "Sign in as agent",
    loading: "Signing in...",
    scopeTitle: "After login, your dashboard is categorized",
    scopeProfile: "Client profile and household context",
    scopeFinance: "Financial indicators and borrowing capacity",
    scopeRisk: "Risk level and credit decision reasons",
    scopeProducts: "Existing products and cross-sell opportunities",
    workspaceTitle: "BH Agent Workspace",
    workspaceDescription:
      "This portal is reserved for BH Bank staff. Agent sessions use dedicated authentication and isolated local storage keys.",
    securityTitle: "Security and scope",
    securityEndpoint: "Dedicated endpoint: /api/auth/agent/login",
    securityRoutes: "Dedicated routes: /agent/login and /agent/dashboard",
    securityStorage: "Dedicated storage keys: bh_agent_*",
  },
  fr: {
    title: "Portail Agent",
    subtitle: "Acces securise pour les equipes BH Bank",
    home: "Accueil",
    clientAccess: "Acces client",
    emailLabel: "Email agent",
    emailPlaceholder: "nom@bhbank.tn",
    passwordLabel: "Mot de passe",
    passwordPlaceholder: "Entrez votre mot de passe",
    rememberMe: "Se souvenir de ma connexion agent",
    passwordHint: "Utilisez le gestionnaire de mots de passe du navigateur pour memoriser le mot de passe en securite.",
    signIn: "Connexion agent",
    loading: "Connexion...",
    scopeTitle: "Apres connexion, votre dashboard est categorise",
    scopeProfile: "Profil client et contexte familial",
    scopeFinance: "Indicateurs financiers et capacite d'emprunt",
    scopeRisk: "Niveau de risque et raisons de decision credit",
    scopeProducts: "Produits existants et opportunites de cross-sell",
    workspaceTitle: "Espace Agent BH",
    workspaceDescription:
      "Ce portail est reserve aux equipes BH Bank. Les sessions agent utilisent une authentification dediee et des cles locales isolees.",
    securityTitle: "Securite et perimetre",
    securityEndpoint: "Endpoint dedie: /api/auth/agent/login",
    securityRoutes: "Routes dediees: /agent/login et /agent/dashboard",
    securityStorage: "Cles de stockage dediees: bh_agent_*",
  },
  ar: {
    title: "Agent Portal",
    subtitle: "Secure BH Bank staff access",
    home: "Home",
    clientAccess: "Client access",
    emailLabel: "Agent email",
    emailPlaceholder: "name@bhbank.tn",
    passwordLabel: "Password",
    passwordPlaceholder: "Enter your password",
    rememberMe: "Remember my agent login",
    passwordHint: "Use your browser password manager to safely remember the password.",
    signIn: "Agent sign in",
    loading: "Signing in...",
    scopeTitle: "After login, your dashboard is categorized",
    scopeProfile: "Client profile and household context",
    scopeFinance: "Financial indicators and borrowing capacity",
    scopeRisk: "Risk level and credit decision reasons",
    scopeProducts: "Existing products and cross-sell opportunities",
    workspaceTitle: "BH Agent Workspace",
    workspaceDescription:
      "This portal is reserved for BH Bank staff. Agent sessions use dedicated authentication and isolated local storage keys.",
    securityTitle: "Security and scope",
    securityEndpoint: "Dedicated endpoint: /api/auth/agent/login",
    securityRoutes: "Dedicated routes: /agent/login and /agent/dashboard",
    securityStorage: "Dedicated storage keys: bh_agent_*",
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
  const { language, isRTL } = useLanguage();

  const ui = copyByLanguage[getLangKey(language)] || copyByLanguage.fr;

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [rememberMe, setRememberMe] = useState(true);
  const [showPassword, setShowPassword] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [errorMessage, setErrorMessage] = useState("");

  useEffect(() => {
    const savedEmail = localStorage.getItem(REMEMBER_AGENT_EMAIL_KEY) || "";
    if (savedEmail) {
      setEmail(savedEmail);
      setRememberMe(true);
    }

    if (getAgentAuthToken()) {
      navigate("/agent/dashboard", { replace: true });
    }
  }, [navigate]);

  const handleSubmit = async (event) => {
    event.preventDefault();
    if (isSubmitting) return;

    try {
      setIsSubmitting(true);
      setErrorMessage("");
      clearAgentAuthSession();

      const payload = await loginAgent({
        email: email.trim().toLowerCase(),
        password,
      });

      if (rememberMe) {
        localStorage.setItem(REMEMBER_AGENT_EMAIL_KEY, email.trim().toLowerCase());
      } else {
        localStorage.removeItem(REMEMBER_AGENT_EMAIL_KEY);
      }

      setAgentAuthSession(payload);
      navigate("/agent/dashboard", { replace: true });
    } catch (error) {
      setErrorMessage(error.message || "Agent login failed.");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className={`min-h-screen ${theme === "dark" ? "bg-[#0f172a]" : "bg-[#f6f8fc]"}`} dir={isRTL ? "rtl" : "ltr"}>
      <div className="mx-auto flex min-h-screen w-full max-w-6xl items-center px-5 py-8 sm:px-8">
        <div className="grid w-full gap-8 lg:grid-cols-[1.2fr_1fr]">
          <section
            className={`rounded-3xl border p-8 sm:p-10 ${
              theme === "dark"
                ? "border-white/10 bg-[#111d33] text-white"
                : "border-[#dbe4f2] bg-white text-[#13233f]"
            }`}
          >
            <div className={`mb-8 flex items-center justify-between gap-3 ${isRTL ? "flex-row-reverse" : ""}`}>
              <img src={logoExpanded} alt="BH Bank" className="h-11 w-auto" />
              <div className={`flex items-center gap-2 ${isRTL ? "flex-row-reverse" : ""}`}>
                <button
                  type="button"
                  onClick={() => navigate("/")}
                  className={`inline-flex items-center gap-2 rounded-xl border px-3 py-2 text-sm ${
                    theme === "dark"
                      ? "border-white/15 text-white/90 hover:bg-white/10"
                      : "border-[#d4ddec] text-[#0A2240] hover:bg-[#eff4fb]"
                  } ${isRTL ? "flex-row-reverse" : ""}`}
                >
                  <House size={16} />
                  {ui.home}
                </button>
                <button
                  type="button"
                  onClick={() => navigate("/login")}
                  className={`inline-flex items-center gap-2 rounded-xl border px-3 py-2 text-sm ${
                    theme === "dark"
                      ? "border-white/15 text-white/90 hover:bg-white/10"
                      : "border-[#d4ddec] text-[#0A2240] hover:bg-[#eff4fb]"
                  } ${isRTL ? "flex-row-reverse" : ""}`}
                >
                  <UserRound size={16} />
                  {ui.clientAccess}
                </button>
              </div>
            </div>

            <div className={`mb-7 ${isRTL ? "text-right" : "text-left"}`}>
              <h1 className="text-3xl font-extrabold tracking-tight">{ui.title}</h1>
              <p className={`mt-2 text-sm ${theme === "dark" ? "text-white/70" : "text-[#5f7090]"}`}>{ui.subtitle}</p>

              <div className={`mt-4 rounded-2xl border p-3 text-xs ${theme === "dark" ? "border-white/15 bg-white/5 text-white/80" : "border-[#d7e0ee] bg-[#f8fbff] text-[#4d6286]"}`}>
                <p className="font-semibold">{ui.scopeTitle}</p>
                <div className="mt-2 grid gap-2 sm:grid-cols-2">
                  <p>- {ui.scopeProfile}</p>
                  <p>- {ui.scopeFinance}</p>
                  <p>- {ui.scopeRisk}</p>
                  <p>- {ui.scopeProducts}</p>
                </div>
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
                    type="email"
                    name="username"
                    value={email}
                    onChange={(event) => setEmail(event.target.value)}
                    autoComplete="username"
                    placeholder={ui.emailPlaceholder}
                    className={`w-full rounded-xl border py-3.5 ${
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
                    className={`w-full rounded-xl border py-3.5 ${
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

              <div className={`space-y-2 ${isRTL ? "text-right" : "text-left"}`}>
                <label className={`inline-flex items-center gap-2 text-sm ${isRTL ? "flex-row-reverse" : ""}`}>
                  <input
                    type="checkbox"
                    checked={rememberMe}
                    onChange={(event) => setRememberMe(event.target.checked)}
                    className="h-4 w-4 rounded border-gray-300 text-[#0A2240]"
                  />
                  <span>{ui.rememberMe}</span>
                </label>
                <p className={`text-xs ${theme === "dark" ? "text-white/55" : "text-[#6f82a3]"}`}>
                  {ui.passwordHint}
                </p>
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
                className="inline-flex w-full items-center justify-center gap-2 rounded-xl bg-[#0A2240] px-4 py-3.5 font-semibold text-white hover:opacity-90 disabled:cursor-not-allowed disabled:opacity-60"
              >
                <ShieldCheck size={18} />
                {isSubmitting ? ui.loading : ui.signIn}
              </button>
            </form>
          </section>

          <aside
            className={`rounded-3xl border p-8 sm:p-10 ${
              theme === "dark"
                ? "border-white/10 bg-[#0b1525] text-white"
                : "border-[#dbe4f2] bg-[#f1f5fc] text-[#13233f]"
            }`}
          >
            <h2 className="text-xl font-bold">{ui.workspaceTitle}</h2>
            <p className={`mt-3 text-sm leading-relaxed ${theme === "dark" ? "text-white/75" : "text-[#516484]"}`}>
              {ui.workspaceDescription}
            </p>
            <div className="mt-8 space-y-3">
              <p className={`text-xs font-semibold uppercase tracking-wide ${theme === "dark" ? "text-white/60" : "text-[#5f7090]"}`}>
                {ui.securityTitle}
              </p>
              <div className={`rounded-2xl border px-4 py-3 text-sm ${theme === "dark" ? "border-white/15 bg-white/5" : "border-[#d6e0ef] bg-white"}`}>
                {ui.securityEndpoint}
              </div>
              <div className={`rounded-2xl border px-4 py-3 text-sm ${theme === "dark" ? "border-white/15 bg-white/5" : "border-[#d6e0ef] bg-white"}`}>
                {ui.securityRoutes}
              </div>
              <div className={`rounded-2xl border px-4 py-3 text-sm ${theme === "dark" ? "border-white/15 bg-white/5" : "border-[#d6e0ef] bg-white"}`}>
                {ui.securityStorage}
              </div>
            </div>
          </aside>
        </div>
      </div>
    </div>
  );
}
