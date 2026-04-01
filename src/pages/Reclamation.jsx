import { useEffect, useMemo, useState } from "react";
import { AlertCircle, CheckCircle2, FileText, Send } from "lucide-react";
import { useTheme } from "../contexts/ThemeContext";
import { useLanguage } from "../contexts/LanguageContext";
import { createComplaint, getComplaints } from "../api";

const formatDate = (value) => {
  const date = new Date(value);
  if (Number.isNaN(date.getTime())) return "-";
  return new Intl.DateTimeFormat("fr-FR", {
    day: "2-digit",
    month: "2-digit",
    year: "numeric",
    hour: "2-digit",
    minute: "2-digit",
  }).format(date);
};

export function Reclamation() {
  const { theme } = useTheme();
  const { isRTL } = useLanguage();
  const isDark = theme === "dark";

  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");
  const [complaints, setComplaints] = useState([]);

  const [subject, setSubject] = useState("");
  const [message, setMessage] = useState("");

  const loadComplaints = async () => {
    try {
      setLoading(true);
      setError("");
      const data = await getComplaints();
      setComplaints(Array.isArray(data?.complaints) ? data.complaints : []);
    } catch (err) {
      setError(err.message || "Impossible de charger les reclamations.");
      setComplaints([]);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadComplaints();
  }, []);

  const sortedComplaints = useMemo(() => {
    return [...complaints].sort((a, b) => new Date(b.created_at) - new Date(a.created_at));
  }, [complaints]);

  const submitComplaint = async (event) => {
    event.preventDefault();

    try {
      setSubmitting(true);
      setError("");
      setSuccess("");

      await createComplaint({
        subject: subject.trim(),
        message: message.trim(),
      });

      setSuccess("Reclamation envoyee avec succes.");
      setSubject("");
      setMessage("");
      await loadComplaints();
    } catch (err) {
      setError(err.message || "Envoi de la reclamation impossible.");
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
        <h1 className="text-2xl font-semibold lg:text-3xl">Claims Management</h1>
        <p className={isDark ? "text-gray-400" : "text-gray-600"}>
          Interface branchee a /api/auth/complaints.
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
          <h2 className="mb-4 text-lg font-semibold">New complaint</h2>

          <form onSubmit={submitComplaint} className="space-y-4">
            <label className="block text-sm">
              <span className="mb-1 block">Subject</span>
              <input
                value={subject}
                onChange={(event) => setSubject(event.target.value)}
                required
                className={`w-full rounded-lg border px-3 py-2 ${
                  isDark ? "border-gray-600 bg-gray-700" : "border-gray-300 bg-white"
                } ${isRTL ? "text-right" : "text-left"}`}
              />
            </label>

            <label className="block text-sm">
              <span className="mb-1 block">Description</span>
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
              {submitting ? "Sending..." : "Submit"}
            </button>
          </form>
        </section>

        <section className={`xl:col-span-3 rounded-xl border p-5 ${isDark ? "border-gray-700 bg-gray-800" : "border-gray-200 bg-white"}`}>
          <h2 className="mb-4 text-lg font-semibold">Complaint history</h2>

          {loading ? (
            <p className={isDark ? "text-gray-400" : "text-gray-600"}>Loading...</p>
          ) : sortedComplaints.length === 0 ? (
            <p className={isDark ? "text-gray-400" : "text-gray-600"}>No complaint yet.</p>
          ) : (
            <div className="space-y-3">
              {sortedComplaints.map((complaint) => (
                <article
                  key={complaint.id || `${complaint.subject}-${complaint.created_at}`}
                  className={`rounded-lg border p-4 ${isDark ? "border-gray-700 bg-gray-900" : "border-gray-200 bg-gray-50"}`}
                >
                  <div className="mb-2 flex items-center justify-between gap-3">
                    <h3 className="font-semibold">{complaint.subject || "Sans objet"}</h3>
                    <span className={`inline-flex items-center gap-1 rounded-full px-2.5 py-1 text-xs ${isDark ? "bg-gray-800 text-gray-300" : "bg-white text-gray-600"}`}>
                      <FileText className="h-3 w-3" />
                      {complaint.status || "pending"}
                    </span>
                  </div>

                  <p className={`mb-2 text-sm ${isDark ? "text-gray-300" : "text-gray-700"}`}>
                    {complaint.message || "-"}
                  </p>
                  <p className={`text-xs ${isDark ? "text-gray-400" : "text-gray-500"}`}>
                    {formatDate(complaint.created_at)}
                  </p>
                </article>
              ))}
            </div>
          )}
        </section>
      </div>
    </div>
  );
}
