import { useMemo, useState } from "react";
import { useNavigate, useSearchParams } from "react-router";
import { Eye, EyeOff, House, KeyRound, Lock, ShieldCheck } from "lucide-react";
import { useTheme } from "../contexts/ThemeContext";
import { useLanguage } from "../contexts/LanguageContext";
import logoExpanded from "../assets/BH_logo2.png";
import { resetAgentPasswordWithLink } from "../api";

const copyByLanguage = {
  fr: {
    title: "Reinitialiser mot de passe agent",
    subtitle: "Definissez un nouveau mot de passe fort pour votre compte agent.",
    home: "Accueil",
    backToLogin: "Retour connexion agent",
    passwordLabel: "Nouveau mot de passe",
    confirmLabel: "Confirmer le mot de passe",
    passwordHint: "8+ caracteres, 1 majuscule, 1 chiffre",
    submit: "Enregistrer",
    submitting: "Enregistrement...",
    success: "Mot de passe reinitialise. Vous pouvez vous connecter.",
    tokenMissing: "Lien invalide: token manquant.",
    mismatch: "Les mots de passe ne correspondent pas.",
  },
  en: {
    title: "Reset agent password",
    subtitle: "Set a strong new password for your agent account.",
    home: "Home",
    backToLogin: "Back to agent login",
    passwordLabel: "New password",
    confirmLabel: "Confirm password",
    passwordHint: "8+ chars, 1 uppercase, 1 digit",
    submit: "Save",
    submitting: "Saving...",
    success: "Password reset complete. You can now sign in.",
    tokenMissing: "Invalid link: missing token.",
    mismatch: "Passwords do not match.",
  },
  ar: {
    title: "Reset agent password",
    subtitle: "Set a strong new password for your agent account.",
    home: "Home",
    backToLogin: "Back to agent login",
    passwordLabel: "New password",
    confirmLabel: "Confirm password",
    passwordHint: "8+ chars, 1 uppercase, 1 digit",
    submit: "Save",
    submitting: "Saving...",
    success: "Password reset complete. You can now sign in.",
    tokenMissing: "Invalid link: missing token.",
    mismatch: "Passwords do not match.",
  },
};

const getLangKey = (language) => {
  if (language === "ar") return "ar";
  if (language === "en") return "en";
  return "fr";
};

const normalizeResetToken = (value) => {
  let token = String(value || "").trim();
  if (!token) return "";

  token = token.replace(/^['\"]+|['\"]+$/g, "");
  token = token.replace(/\s+/g, "");
  token = token.replace(/=/g, "");
  if (token.startsWith("=3D")) token = token.slice(3);
  else if (token.startsWith("3D") && token.length > 12) token = token.slice(2);
  token = token.replace(/[)\].,;:!?]+$/, "");
  return token.trim();
};

const isStrongPassword = (value) => {
  const password = String(value || "");
  return password.length >= 8 && /[A-Z]/.test(password) && /\d/.test(password);
};

export function AgentResetPasswordPage() {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const { theme } = useTheme();
  const { language, isRTL } = useLanguage();

  const ui = copyByLanguage[getLangKey(language)] || copyByLanguage.fr;
  const isDark = theme === "dark";

  const token = useMemo(() => normalizeResetToken(searchParams.get("token")), [searchParams]);

  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");

  const handleSubmit = async (event) => {
    event.preventDefault();
    if (loading) return;

    setError("");
    setSuccess("");

    if (!token) {
      setError(ui.tokenMissing);
      return;
    }

    if (password !== confirmPassword) {
      setError(ui.mismatch);
      return;
    }

    if (!isStrongPassword(password)) {
      setError(ui.passwordHint);
      return;
    }

    try {
      setLoading(true);
      await resetAgentPasswordWithLink({
        token,
        new_password: password,
      });
      setSuccess(ui.success);
      setPassword("");
      setConfirmPassword("");
    } catch (apiError) {
      setError(apiError?.message || "Reset failed.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className={`min-h-screen ${isDark ? "bg-[#0d1628] text-white" : "bg-[#edf2f9] text-[#13233f]"}`} dir={isRTL ? "rtl" : "ltr"}>
      <div className="mx-auto flex min-h-screen w-full max-w-5xl items-center px-5 py-8 sm:px-8">
        <section className={`mx-auto w-full max-w-xl rounded-3xl border p-8 sm:p-10 ${isDark ? "border-white/10 bg-[#111f37]/95" : "border-[#dbe4f2] bg-white"}`}>
          <div className="mb-7 flex items-center justify-between gap-3">
            <img src={logoExpanded} alt="BH Bank" className="h-11 w-auto" />
            <button
              type="button"
              onClick={() => navigate("/")}
              className={`inline-flex items-center gap-2 rounded-xl border px-3 py-2 text-sm font-medium transition ${
                isDark
                  ? "border-white/15 text-white/90 hover:bg-white/10"
                  : "border-[#d4ddec] bg-white text-[#0A2240] hover:bg-[#eff4fb]"
              } ${isRTL ? "flex-row-reverse" : ""}`}
            >
              <House size={16} />
              {ui.home}
            </button>
          </div>

          <h1 className="text-2xl font-extrabold sm:text-3xl">{ui.title}</h1>
          <p className={`mt-2 text-sm ${isDark ? "text-white/70" : "text-[#5f7090]"}`}>{ui.subtitle}</p>

          <form className="mt-7 space-y-5" onSubmit={handleSubmit}>
            <div>
              <label className={`mb-2 block text-sm font-medium ${isRTL ? "text-right" : "text-left"}`}>{ui.passwordLabel}</label>
              <div className="relative">
                <Lock
                  size={18}
                  className={`pointer-events-none absolute top-1/2 -translate-y-1/2 ${
                    isRTL ? "right-4" : "left-4"
                  } ${isDark ? "text-white/50" : "text-[#7384a4]"}`}
                />
                <input
                  type={showPassword ? "text" : "password"}
                  value={password}
                  onChange={(event) => setPassword(event.target.value)}
                  autoComplete="new-password"
                  className={`w-full rounded-xl border py-3.5 ${
                    isRTL ? "pr-11 pl-11 text-right" : "pl-11 pr-11 text-left"
                  } ${
                    isDark
                      ? "border-white/15 bg-[#0c1628] text-white placeholder:text-white/35"
                      : "border-[#d7e0ee] bg-[#fbfcff] text-[#13233f] placeholder:text-[#95a2b9]"
                  }`}
                  required
                />
                <button
                  type="button"
                  onClick={() => setShowPassword((prev) => !prev)}
                  className={`absolute top-1/2 -translate-y-1/2 ${isRTL ? "left-4" : "right-4"} ${
                    isDark ? "text-white/65" : "text-[#7384a4]"
                  }`}
                >
                  {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
                </button>
              </div>
            </div>

            <div>
              <label className={`mb-2 block text-sm font-medium ${isRTL ? "text-right" : "text-left"}`}>{ui.confirmLabel}</label>
              <div className="relative">
                <Lock
                  size={18}
                  className={`pointer-events-none absolute top-1/2 -translate-y-1/2 ${
                    isRTL ? "right-4" : "left-4"
                  } ${isDark ? "text-white/50" : "text-[#7384a4]"}`}
                />
                <input
                  type={showConfirmPassword ? "text" : "password"}
                  value={confirmPassword}
                  onChange={(event) => setConfirmPassword(event.target.value)}
                  autoComplete="new-password"
                  className={`w-full rounded-xl border py-3.5 ${
                    isRTL ? "pr-11 pl-11 text-right" : "pl-11 pr-11 text-left"
                  } ${
                    isDark
                      ? "border-white/15 bg-[#0c1628] text-white placeholder:text-white/35"
                      : "border-[#d7e0ee] bg-[#fbfcff] text-[#13233f] placeholder:text-[#95a2b9]"
                  }`}
                  required
                />
                <button
                  type="button"
                  onClick={() => setShowConfirmPassword((prev) => !prev)}
                  className={`absolute top-1/2 -translate-y-1/2 ${isRTL ? "left-4" : "right-4"} ${
                    isDark ? "text-white/65" : "text-[#7384a4]"
                  }`}
                >
                  {showConfirmPassword ? <EyeOff size={18} /> : <Eye size={18} />}
                </button>
              </div>
              <p className={`mt-2 text-xs ${isDark ? "text-white/55" : "text-[#6f82a3]"}`}>{ui.passwordHint}</p>
            </div>

            {error && (
              <p className={`rounded-xl border px-3 py-2 text-sm ${
                isDark
                  ? "border-red-900/60 bg-red-950/40 text-red-300"
                  : "border-red-200 bg-red-50 text-red-700"
              } ${isRTL ? "text-right" : "text-left"}`}>
                {error}
              </p>
            )}

            {success && (
              <p className={`rounded-xl border px-3 py-2 text-sm ${
                isDark
                  ? "border-emerald-900/60 bg-emerald-950/30 text-emerald-300"
                  : "border-emerald-200 bg-emerald-50 text-emerald-700"
              } ${isRTL ? "text-right" : "text-left"}`}>
                {success}
              </p>
            )}

            <button
              type="submit"
              disabled={loading}
              className="inline-flex w-full items-center justify-center gap-2 rounded-2xl bg-[#0A2240] px-4 py-3.5 font-semibold text-white transition hover:bg-[#122f57] disabled:cursor-not-allowed disabled:opacity-60"
            >
              <ShieldCheck size={18} />
              {loading ? ui.submitting : ui.submit}
            </button>

            <button
              type="button"
              onClick={() => navigate("/agent/login")}
              className={`inline-flex w-full items-center justify-center gap-2 rounded-2xl border px-4 py-3 text-sm font-semibold ${
                isDark
                  ? "border-white/15 bg-white/5 text-white hover:bg-white/10"
                  : "border-[#d7e0ee] bg-white text-[#13233f] hover:bg-[#f4f8fe]"
              }`}
            >
              <KeyRound size={16} />
              {ui.backToLogin}
            </button>
          </form>
        </section>
      </div>
    </div>
  );
}
