import { useEffect, useState } from "react";
import { useNavigate } from "react-router";
import { Eye, EyeOff, Lock, Mail, ShieldCheck } from "lucide-react";
import { useTheme } from "../contexts/ThemeContext";
import { useLanguage } from "../contexts/LanguageContext";
import logoExpanded from "../assets/BH_logo2.png";
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
    forgotSuccess:
      "Your request was submitted. You will receive an email after the administrator decision.",
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
    forgotSuccess:
      "Votre demande a ete envoyee. Vous recevrez un email apres la decision de l'administrateur.",
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
    primaryInfoLabel: "Informations principales",
    securityTitle: "Securite et perimetre",
    securityEndpoint: "Endpoint dedie: /api/auth/agent/login",
    securityRoutes: "Routes dediees: /agent/login et /agent/dashboard",
    securityStorage: "Cles de stockage dediees: bh_agent_*",
  },
  ar: {
    title: "Agent Portal",
    subtitle: "Secure BH Bank staff access",
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
    forgotSuccess:
      "Your request was submitted. You will receive an email after the administrator decision.",
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
    primaryInfoLabel: "Key login information",
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

    try {
      setIsSubmitting(true);
      setErrorMessage("");
      clearAgentAuthSession();

      const identifier = email.trim();
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
      setErrorMessage(error.message || "Agent login failed.");
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
      setForgotError(error.message || "Unable to submit reset request.");
    } finally {
      setForgotSubmitting(false);
    }
  };

  return (
    <div className={`relative min-h-screen overflow-hidden ${theme === "dark" ? "bg-[#0d1628]" : "bg-[#edf2f9]"}`} dir={isRTL ? "rtl" : "ltr"}>
      <div className="pointer-events-none absolute -left-12 top-0 h-72 w-72 rounded-full bg-[#0A2240]/15 blur-3xl" />
      <div className="pointer-events-none absolute -right-16 bottom-0 h-80 w-80 rounded-full bg-[#D71920]/10 blur-3xl" />

      <div className="relative mx-auto flex min-h-screen w-full max-w-6xl items-center px-5 py-8 sm:px-8">
        <div className="grid w-full gap-8">
          <section
            className={`rounded-4xl border p-8 sm:p-10 ${
              theme === "dark"
                ? "border-white/10 bg-[#111f37]/95 text-white shadow-[0_18px_35px_rgba(0,0,0,0.35)]"
                : "border-[#dbe4f2] bg-white text-[#13233f] shadow-[0_16px_32px_rgba(18,35,65,0.09)]"
            }`}
          >
            <div className={`mb-8 flex items-center justify-between gap-3 ${isRTL ? "flex-row-reverse" : ""}`}>
              <img src={logoExpanded} alt="BH Bank" className="h-11 w-auto" />
              <div
                className={`inline-flex items-center gap-2 rounded-full border px-3 py-1.5 text-xs font-semibold ${
                  theme === "dark"
                    ? "border-[#3e6db1]/70 bg-[#10213e] text-[#bdd5ff]"
                    : "border-[#c6d7f1] bg-[#eef4ff] text-[#214b89]"
                } ${isRTL ? "flex-row-reverse" : ""}`}
              >
                <ShieldCheck size={14} />
                {ui.accessBadge}
              </div>
            </div>

            <div className={`mb-7 ${isRTL ? "text-right" : "text-left"}`}>
              <h1 className="text-3xl font-extrabold tracking-tight sm:text-[2.15rem]">{ui.title}</h1>
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

              <div className={`flex flex-wrap items-center justify-between gap-2 ${isRTL ? "flex-row-reverse" : ""}`}>
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
                className="inline-flex w-full items-center justify-center gap-2 rounded-2xl bg-[#0A2240] px-4 py-3.5 font-semibold text-white transition hover:bg-[#122f57] disabled:cursor-not-allowed disabled:opacity-60"
              >
                <ShieldCheck size={18} />
                {isSubmitting ? ui.loading : ui.signIn}
              </button>
            </form>
          </section>
        </div>
      </div>

      {forgotOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-[#081326]/65 px-4" onClick={closeForgotModal}>
          <div
            className={`w-full max-w-lg rounded-3xl border p-6 sm:p-7 ${
              theme === "dark"
                ? "border-white/15 bg-[#0f1e36] text-white shadow-[0_20px_40px_rgba(0,0,0,0.45)]"
                : "border-[#d8e1ef] bg-white text-[#14233e] shadow-[0_20px_40px_rgba(18,35,65,0.2)]"
            }`}
            onClick={(event) => event.stopPropagation()}
          >
            <div className={`mb-3 flex items-center justify-between gap-3 ${isRTL ? "flex-row-reverse" : ""}`}>
              <h2 className="text-xl font-bold">{ui.forgotTitle}</h2>
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
                className="inline-flex w-full items-center justify-center rounded-2xl bg-[#0A2240] px-4 py-3 font-semibold text-white transition hover:bg-[#122f57] disabled:cursor-not-allowed disabled:opacity-60"
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
