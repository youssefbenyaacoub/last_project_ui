import { useState } from "react";
import { useNavigate } from "react-router";
import { Eye, EyeOff, House, Lock, ShieldCheck } from "lucide-react";
import { useTheme } from "../contexts/ThemeContext";
import { useLanguage } from "../contexts/LanguageContext";
import logoExpanded from "../assets/BH_logo2.png";
import { changeAgentPassword, clearAgentAuthSession, getAgentAuthToken } from "../api";

const copyByLanguage = {
  fr: {
    title: "Changer mot de passe agent",
    subtitle: "Mettez a jour votre mot de passe apres connexion.",
    home: "Accueil",
    backToDashboard: "Retour dashboard agent",
    currentPasswordLabel: "Mot de passe actuel",
    newPasswordLabel: "Nouveau mot de passe",
    confirmPasswordLabel: "Confirmer le nouveau mot de passe",
    passwordHint: "8+ caracteres, 1 majuscule, 1 chiffre",
    submit: "Mettre a jour",
    submitting: "Mise a jour...",
    success: "Mot de passe modifie avec succes.",
    mismatch: "Les nouveaux mots de passe ne correspondent pas.",
    invalidStrength: "Le nouveau mot de passe ne respecte pas les regles de securite.",
    loginRequired: "Session agent invalide. Reconnectez-vous.",
  },
  en: {
    title: "Change agent password",
    subtitle: "Update your password after signing in.",
    home: "Home",
    backToDashboard: "Back to agent dashboard",
    currentPasswordLabel: "Current password",
    newPasswordLabel: "New password",
    confirmPasswordLabel: "Confirm new password",
    passwordHint: "8+ chars, 1 uppercase, 1 digit",
    submit: "Update password",
    submitting: "Updating...",
    success: "Password changed successfully.",
    mismatch: "New passwords do not match.",
    invalidStrength: "The new password does not meet security rules.",
    loginRequired: "Agent session is invalid. Please sign in again.",
  },
  ar: {
    title: "Change agent password",
    subtitle: "Update your password after signing in.",
    home: "Home",
    backToDashboard: "Back to agent dashboard",
    currentPasswordLabel: "Current password",
    newPasswordLabel: "New password",
    confirmPasswordLabel: "Confirm new password",
    passwordHint: "8+ chars, 1 uppercase, 1 digit",
    submit: "Update password",
    submitting: "Updating...",
    success: "Password changed successfully.",
    mismatch: "New passwords do not match.",
    invalidStrength: "The new password does not meet security rules.",
    loginRequired: "Agent session is invalid. Please sign in again.",
  },
};

const getLangKey = (language) => {
  if (language === "ar") return "ar";
  if (language === "en") return "en";
  return "fr";
};

const isStrongPassword = (value) => {
  const password = String(value || "");
  return password.length >= 8 && /[A-Z]/.test(password) && /\d/.test(password);
};

export function AgentChangePasswordPage() {
  const navigate = useNavigate();
  const { theme } = useTheme();
  const { language, isRTL } = useLanguage();

  const ui = copyByLanguage[getLangKey(language)] || copyByLanguage.fr;
  const isDark = theme === "dark";

  const [currentPassword, setCurrentPassword] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [showCurrentPassword, setShowCurrentPassword] = useState(false);
  const [showNewPassword, setShowNewPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const handleSubmit = async (event) => {
    event.preventDefault();
    if (loading) return;

    setError("");

    if (!getAgentAuthToken()) {
      clearAgentAuthSession();
      navigate("/agent/login", { replace: true });
      return;
    }

    if (newPassword !== confirmPassword) {
      setError(ui.mismatch);
      return;
    }

    if (!isStrongPassword(newPassword)) {
      setError(ui.invalidStrength);
      return;
    }

    try {
      setLoading(true);
      await changeAgentPassword({
        current_password: currentPassword,
        new_password: newPassword,
      });

      setCurrentPassword("");
      setNewPassword("");
      setConfirmPassword("");
      clearAgentAuthSession();
      navigate("/agent/login", { replace: true });
    } catch (apiError) {
      setError(apiError?.message || "Update failed.");
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
              <label className={`mb-2 block text-sm font-medium ${isRTL ? "text-right" : "text-left"}`}>{ui.currentPasswordLabel}</label>
              <div className="relative">
                <Lock
                  size={18}
                  className={`pointer-events-none absolute top-1/2 -translate-y-1/2 ${
                    isRTL ? "right-4" : "left-4"
                  } ${isDark ? "text-white/50" : "text-[#7384a4]"}`}
                />
                <input
                  type={showCurrentPassword ? "text" : "password"}
                  value={currentPassword}
                  onChange={(event) => setCurrentPassword(event.target.value)}
                  autoComplete="current-password"
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
                  onClick={() => setShowCurrentPassword((prev) => !prev)}
                  className={`absolute top-1/2 -translate-y-1/2 ${isRTL ? "left-4" : "right-4"} ${
                    isDark ? "text-white/65" : "text-[#7384a4]"
                  }`}
                >
                  {showCurrentPassword ? <EyeOff size={18} /> : <Eye size={18} />}
                </button>
              </div>
            </div>

            <div>
              <label className={`mb-2 block text-sm font-medium ${isRTL ? "text-right" : "text-left"}`}>{ui.newPasswordLabel}</label>
              <div className="relative">
                <Lock
                  size={18}
                  className={`pointer-events-none absolute top-1/2 -translate-y-1/2 ${
                    isRTL ? "right-4" : "left-4"
                  } ${isDark ? "text-white/50" : "text-[#7384a4]"}`}
                />
                <input
                  type={showNewPassword ? "text" : "password"}
                  value={newPassword}
                  onChange={(event) => setNewPassword(event.target.value)}
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
                  onClick={() => setShowNewPassword((prev) => !prev)}
                  className={`absolute top-1/2 -translate-y-1/2 ${isRTL ? "left-4" : "right-4"} ${
                    isDark ? "text-white/65" : "text-[#7384a4]"
                  }`}
                >
                  {showNewPassword ? <EyeOff size={18} /> : <Eye size={18} />}
                </button>
              </div>
            </div>

            <div>
              <label className={`mb-2 block text-sm font-medium ${isRTL ? "text-right" : "text-left"}`}>{ui.confirmPasswordLabel}</label>
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
              onClick={() => navigate("/agent/dashboard")}
              className={`inline-flex w-full items-center justify-center gap-2 rounded-2xl border px-4 py-3 text-sm font-semibold ${
                isDark
                  ? "border-white/15 bg-white/5 text-white hover:bg-white/10"
                  : "border-[#d7e0ee] bg-white text-[#13233f] hover:bg-[#f4f8fe]"
              }`}
            >
              <Lock size={16} />
              {ui.backToDashboard}
            </button>
          </form>
        </section>
      </div>
    </div>
  );
}
