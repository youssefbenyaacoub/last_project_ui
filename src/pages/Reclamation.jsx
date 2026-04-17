import { useCallback, useEffect, useMemo, useState } from "react";
import { AlertCircle, CheckCircle2, FileText, Send } from "lucide-react";
import { useTheme } from "../contexts/ThemeContext";
import { useLanguage } from "../contexts/LanguageContext";
import { createComplaint, getComplaints } from "../api";
import { Skeleton, SkeletonLines } from "../components/Skeleton";

const TYPE_OPTIONS = [
  {
    value: "auth_login_issue",
    labels: {
      en: "Login / authentication issue",
      fr: "Connexion et authentification",
      ar: "مشكلة تسجيل الدخول والمصادقة",
    },
  },
  {
    value: "account_data_issue",
    labels: {
      en: "Account data or dashboard issue",
      fr: "Donnees de compte ou tableau de bord",
      ar: "مشكلة بيانات الحساب او لوحة التحكم",
    },
  },
  {
    value: "transfer_payment_issue",
    labels: {
      en: "Transfer or online payment issue",
      fr: "Virement ou paiement en ligne",
      ar: "مشكلة تحويل او دفع عبر المنصة",
    },
  },
  {
    value: "profile_settings_issue",
    labels: {
      en: "Profile or settings issue",
      fr: "Profil et parametres utilisateur",
      ar: "مشكلة الملف الشخصي او الاعدادات",
    },
  },
  {
    value: "notification_issue",
    labels: {
      en: "Notification or alert issue",
      fr: "Notifications et alertes",
      ar: "مشكلة الاشعارات والتنبيهات",
    },
  },
  {
    value: "chatbot_issue",
    labels: {
      en: "Chatbot assistance issue",
      fr: "Assistant chatbot",
      ar: "مشكلة في مساعد الدردشة",
    },
  },
  {
    value: "other_platform_issue",
    labels: {
      en: "Other platform-related issue",
      fr: "Autre incident lie a la plateforme",
      ar: "مشكلة اخرى مرتبطة بالمنصة",
    },
  },
];

const UI_COPY = {
  en: {
    pageTitle: "Claims Management",
    pageSubtitle: "Submit claims only for BH Advisor platform services.",
    formTitle: "New claim",
    typeLabel: "Claim type",
    descriptionLabel: "Description",
    submitIdle: "Submit",
    submitBusy: "Sending...",
    historyTitle: "Claim history",
    loading: "Loading...",
    empty: "No claim yet.",
    untitled: "Untitled",
    responseTitle: "Agent response",
    submitSuccess: "Claim sent successfully.",
    loadError: "Unable to load claims.",
    submitError: "Unable to send claim.",
    syncing: "Syncing with server...",
  },
  fr: {
    pageTitle: "Gestion des reclamations",
    pageSubtitle: "Deposez des reclamations uniquement sur les services de la plateforme BH Advisor.",
    formTitle: "Nouvelle reclamation",
    typeLabel: "Type de reclamation",
    descriptionLabel: "Description",
    submitIdle: "Soumettre",
    submitBusy: "Envoi...",
    historyTitle: "Historique des reclamations",
    loading: "Chargement...",
    empty: "Aucune reclamation pour le moment.",
    untitled: "Sans objet",
    responseTitle: "Reponse agent",
    submitSuccess: "Reclamation envoyee avec succes.",
    loadError: "Impossible de charger les reclamations.",
    submitError: "Envoi de la reclamation impossible.",
    syncing: "Synchronisation avec le serveur...",
  },
  ar: {
    pageTitle: "ادارة الشكاوى",
    pageSubtitle: "قدّم شكاوى تخص خدمات منصة BH Advisor فقط.",
    formTitle: "شكوى جديدة",
    typeLabel: "نوع الشكوى",
    descriptionLabel: "الوصف",
    submitIdle: "ارسال",
    submitBusy: "جار الارسال...",
    historyTitle: "سجل الشكاوى",
    loading: "جار التحميل...",
    empty: "لا توجد شكاوى حاليا.",
    untitled: "بدون عنوان",
    responseTitle: "رد المستشار",
    submitSuccess: "تم ارسال الشكوى بنجاح.",
    loadError: "تعذر تحميل الشكاوى.",
    submitError: "تعذر ارسال الشكوى.",
    syncing: "جاري المزامنة مع الخادم...",
  },
};

const STATUS_LABELS = {
  submitted: { en: "Submitted", fr: "Soumise", ar: "مقدمة" },
  pending_sync: { en: "Syncing", fr: "Synchronisation", ar: "قيد المزامنة" },
  in_progress: { en: "In progress", fr: "En cours", ar: "قيد المعالجة" },
  resolved: { en: "Resolved", fr: "Resolue", ar: "تم الحل" },
  rejected: { en: "Rejected", fr: "Rejetee", ar: "مرفوضة" },
  en_attente: { en: "Submitted", fr: "Soumise", ar: "مقدمة" },
  en_cours: { en: "In progress", fr: "En cours", ar: "قيد المعالجة" },
  resolue: { en: "Resolved", fr: "Resolue", ar: "تم الحل" },
};

const LOCALE_BY_LANG = {
  ar: "ar-TN",
  en: "en-GB",
  fr: "fr-FR",
};

const formatDate = (value, language) => {
  const date = new Date(value);
  if (Number.isNaN(date.getTime())) return "-";
  return new Intl.DateTimeFormat(LOCALE_BY_LANG[language] || "fr-FR", {
    day: "2-digit",
    month: "2-digit",
    year: "numeric",
    hour: "2-digit",
    minute: "2-digit",
  }).format(date);
};

const getUi = (language) => UI_COPY[language] || UI_COPY.en;

const getTypeLabel = (typeValue, language) => {
  const match = TYPE_OPTIONS.find((opt) => opt.value === typeValue);
  return match?.labels?.[language] || match?.labels?.en || "";
};

const getStatusLabel = (statusValue, language) => {
  const key = String(statusValue || "").trim().toLowerCase();
  return STATUS_LABELS[key]?.[language] || STATUS_LABELS[key]?.en || statusValue || "submitted";
};

const buildOptimisticComplaint = ({ complaintType, subject, message }) => ({
  id: `optimistic-${Date.now()}-${Math.random().toString(16).slice(2, 8)}`,
  complaint_type: complaintType,
  subject,
  message,
  status: "pending_sync",
  created_at: new Date().toISOString(),
  optimistic: true,
});

export function Reclamation() {
  const { theme } = useTheme();
  const { isRTL, language } = useLanguage();
  const ui = getUi(language);
  const isDark = theme === "dark";

  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");
  const [complaints, setComplaints] = useState([]);

  const [complaintType, setComplaintType] = useState(TYPE_OPTIONS[0].value);
  const [message, setMessage] = useState("");

  const loadComplaints = useCallback(async ({ showLoader = true } = {}) => {
    try {
      if (showLoader) {
        setLoading(true);
        setError("");
      }
      const data = await getComplaints();
      setComplaints(Array.isArray(data?.complaints) ? data.complaints : []);
    } catch (err) {
      if (showLoader) {
        setError(err.message || ui.loadError);
        setComplaints([]);
      }
    } finally {
      if (showLoader) {
        setLoading(false);
      }
    }
  }, [ui.loadError]);

  useEffect(() => {
    loadComplaints();
  }, [loadComplaints]);

  const sortedComplaints = useMemo(() => {
    return [...complaints].sort((a, b) => new Date(b.created_at) - new Date(a.created_at));
  }, [complaints]);

  const submitComplaint = async (event) => {
    event.preventDefault();

    const nextType = complaintType;
    const nextMessage = message.trim();
    const nextSubject = getTypeLabel(nextType, language) || nextType;
    const optimisticComplaint = buildOptimisticComplaint({
      complaintType: nextType,
      subject: nextSubject,
      message: nextMessage,
    });

    try {
      setSubmitting(true);
      setError("");
      setSuccess("");

      setComplaints((prev) => [optimisticComplaint, ...prev]);
      setSuccess(ui.submitSuccess);
      setComplaintType(TYPE_OPTIONS[0].value);
      setMessage("");

      await createComplaint({
        complaint_type: nextType,
        subject: nextSubject,
        message: nextMessage,
      });

      setComplaints((prev) =>
        prev.map((item) =>
          item.id === optimisticComplaint.id
            ? { ...item, optimistic: false, status: "submitted" }
            : item,
        ),
      );

      void loadComplaints({ showLoader: false });
    } catch (err) {
      setComplaints((prev) => prev.filter((item) => item.id !== optimisticComplaint.id));
      setComplaintType(nextType);
      setMessage(nextMessage);
      setSuccess("");
      setError(err.message || ui.submitError);
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div
      className={`min-h-full space-y-6 p-4 lg:p-8 ${
        isDark ? "bg-gray-900 text-white" : "bg-gray-50 text-gray-900"
      } ${isRTL ? "text-right" : "text-left"}`}
    >
      <div>
        <h1 className="text-2xl font-semibold lg:text-3xl">{ui.pageTitle}</h1>
        <p className={isDark ? "text-gray-400" : "text-gray-600"}>
          {ui.pageSubtitle}
        </p>
      </div>

      {(error || success) && (
        <div
          className={`flex items-center gap-2 rounded-xl border p-4 text-sm ${
            error
              ? isDark
                ? "border-red-800 bg-red-950/30 text-red-300"
                : "border-red-200 bg-red-50 text-red-700"
              : isDark
                ? "border-emerald-800 bg-emerald-950/20 text-emerald-300"
                : "border-emerald-200 bg-emerald-50 text-emerald-700"
          }`}
        >
          {error ? <AlertCircle className="h-4 w-4" /> : <CheckCircle2 className="h-4 w-4" />}
          {error || success}
        </div>
      )}

      <div className="grid gap-6 xl:grid-cols-5">
        <section className={`xl:col-span-2 rounded-xl border p-5 ${isDark ? "border-gray-700 bg-gray-800" : "border-gray-200 bg-white"}`}>
          <h2 className="mb-4 text-lg font-semibold">{ui.formTitle}</h2>

          <form onSubmit={submitComplaint} className="space-y-4">
            <label className="block text-sm">
              <span className="mb-1 block">{ui.typeLabel}</span>
              <select
                value={complaintType}
                onChange={(event) => setComplaintType(event.target.value)}
                required
                className={`w-full rounded-lg border px-3 py-2 ${
                  isDark ? "border-gray-600 bg-gray-700" : "border-gray-300 bg-white"
                } ${isRTL ? "text-right" : "text-left"}`}
              >
                {TYPE_OPTIONS.map((option) => (
                  <option key={option.value} value={option.value}>
                    {option.labels[language] || option.labels.en}
                  </option>
                ))}
              </select>
            </label>

            <label className="block text-sm">
              <span className="mb-1 block">{ui.descriptionLabel}</span>
              <textarea
                value={message}
                onChange={(event) => setMessage(event.target.value)}
                required
                minLength={10}
                rows={6}
                className={`w-full rounded-lg border px-3 py-2 ${
                  isDark ? "border-gray-600 bg-gray-700" : "border-gray-300 bg-white"
                } ${isRTL ? "text-right" : "text-left"}`}
              />
            </label>

            <button
              type="submit"
              disabled={submitting}
              className="inline-flex items-center gap-2 rounded-lg bg-[#0A2240] px-4 py-2 text-white hover:bg-[#12305b] disabled:opacity-60"
            >
              <Send className="h-4 w-4" />
              {submitting ? ui.submitBusy : ui.submitIdle}
            </button>
          </form>
        </section>

        <section className={`xl:col-span-3 rounded-xl border p-5 ${isDark ? "border-gray-700 bg-gray-800" : "border-gray-200 bg-white"}`}>
          <h2 className="mb-4 text-lg font-semibold">{ui.historyTitle}</h2>

          {loading ? (
            <div className={`space-y-3 ${isDark ? "skeleton-dark" : ""}`}>
              {Array.from({ length: 3 }).map((_, index) => (
                <div
                  key={`complaint-skeleton-${index}`}
                  className={`rounded-lg border p-4 ${isDark ? "border-gray-700 bg-gray-900" : "border-gray-200 bg-gray-50"}`}
                >
                  <div className="mb-3 flex items-center justify-between gap-3">
                    <Skeleton className="h-4 w-52 rounded-md" />
                    <Skeleton className="h-6 w-24 rounded-full" />
                  </div>
                  <SkeletonLines lines={2} lineClassName="h-3 rounded-md" lastLineClassName="w-5/6" />
                  <Skeleton className="mt-3 h-3 w-28 rounded-md" />
                </div>
              ))}
            </div>
          ) : sortedComplaints.length === 0 ? (
            <p className={isDark ? "text-gray-400" : "text-gray-600"}>{ui.empty}</p>
          ) : (
            <div className="space-y-3">
              {sortedComplaints.map((complaint) => (
                <article
                  key={complaint.id || `${complaint.subject}-${complaint.created_at}`}
                  className={`rounded-lg border p-4 ${
                    complaint.optimistic
                      ? isDark
                        ? "border-blue-700/60 bg-blue-950/20"
                        : "border-blue-200 bg-blue-50/70"
                      : isDark
                        ? "border-gray-700 bg-gray-900"
                        : "border-gray-200 bg-gray-50"
                  }`}
                >
                  <div className="mb-2 flex items-center justify-between gap-3">
                    <h3 className="font-semibold">
                      {getTypeLabel(complaint.complaint_type, language) || complaint.subject || ui.untitled}
                    </h3>
                    <span className={`inline-flex items-center gap-1 rounded-full px-2.5 py-1 text-xs ${
                      complaint.optimistic
                        ? isDark
                          ? "bg-blue-900/45 text-blue-200"
                          : "bg-blue-100 text-blue-700"
                        : isDark
                          ? "bg-gray-800 text-gray-300"
                          : "bg-white text-gray-600"
                    }`}>
                      <FileText className="h-3 w-3" />
                      {getStatusLabel(complaint.status, language)}
                    </span>
                  </div>

                  <p className={`mb-2 text-sm ${isDark ? "text-gray-300" : "text-gray-700"}`}>
                    {complaint.message || "-"}
                  </p>

                  {complaint.response ? (
                    <div className={`mb-2 rounded-lg border p-3 text-sm ${isDark ? "border-blue-800 bg-blue-950/20 text-blue-100" : "border-blue-200 bg-blue-50 text-blue-800"}`}>
                      <p className="mb-1 font-semibold">{ui.responseTitle}</p>
                      <p>{complaint.response}</p>
                    </div>
                  ) : null}

                  <p className={`text-xs ${isDark ? "text-gray-400" : "text-gray-500"}`}>
                    {formatDate(complaint.created_at, language)}
                  </p>

                  {complaint.optimistic && (
                    <p className={`mt-2 text-xs ${isDark ? "text-blue-200" : "text-blue-700"}`}>
                      {ui.syncing}
                    </p>
                  )}
                </article>
              ))}
            </div>
          )}
        </section>
      </div>
    </div>
  );
}
