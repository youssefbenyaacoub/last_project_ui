import { useEffect, useMemo, useState } from "react";
import { AlertCircle, Save } from "lucide-react";
import { useTheme } from "../contexts/ThemeContext";
import { useLanguage } from "../contexts/LanguageContext";
import {
  getClientId,
  getFormData,
  getFormSchema,
  getMe,
  submitForm,
} from "../api";

const toArray = (value) => {
  if (Array.isArray(value)) return value;
  if (typeof value === "string") {
    try {
      const parsed = JSON.parse(value);
      return Array.isArray(parsed) ? parsed : value ? [value] : [];
    } catch {
      return value ? [value] : [];
    }
  }
  return [];
};

export function Profile() {
  const { theme } = useTheme();
  const { isRTL } = useLanguage();
  const isDark = theme === "dark";

  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");

  const [profile, setProfile] = useState(null);
  const [schemaFields, setSchemaFields] = useState([]);
  const [formValues, setFormValues] = useState({});

  const clientId = getClientId();

  useEffect(() => {
    const load = async () => {
      if (!clientId) {
        setError("Session absente. Connectez-vous pour voir le profil.");
        setLoading(false);
        return;
      }

      try {
        setLoading(true);
        setError("");

        const [meData, schemaData, formData] = await Promise.all([
          getMe(),
          getFormSchema(),
          getFormData(clientId),
        ]);

        setProfile(meData || null);

        const fields = Array.isArray(schemaData?.fields) ? schemaData.fields : [];
        setSchemaFields(fields);

        const initialValues = {};
        const existing = formData?.form_data || {};
        fields.forEach((field) => {
          if (field.type === "multi-select") {
            initialValues[field.field_id] = toArray(existing[field.field_id]);
          } else {
            initialValues[field.field_id] = existing[field.field_id] || "";
          }
        });

        setFormValues(initialValues);
      } catch (err) {
        setError(err.message || "Impossible de charger le profil.");
      } finally {
        setLoading(false);
      }
    };

    load();
  }, [clientId]);

  const indicators = profile?.indicators || {};

  const identityRows = useMemo(
    () => [
      { label: "Client ID", value: profile?.client_id || "-" },
      { label: "Name", value: profile?.client_name || "-" },
      { label: "Email", value: profile?.email || "-" },
      { label: "Phone", value: profile?.phone || "-" },
      { label: "Email verified", value: profile?.email_verified ? "Yes" : "No" },
    ],
    [profile],
  );

  const updateField = (fieldId, value) => {
    setFormValues((prev) => ({ ...prev, [fieldId]: value }));
  };

  const toggleMultiValue = (fieldId, option) => {
    setFormValues((prev) => {
      const existing = toArray(prev[fieldId]);
      const hasOption = existing.includes(option);
      return {
        ...prev,
        [fieldId]: hasOption
          ? existing.filter((item) => item !== option)
          : [...existing, option],
      };
    });
  };

  const saveForm = async () => {
    if (!clientId) return;

    try {
      setSaving(true);
      setError("");
      setSuccess("");

      await submitForm(clientId, formValues);
      setSuccess("Profil enrichi sauvegarde et recommandations mises a jour.");
    } catch (err) {
      setError(err.message || "Echec lors de la sauvegarde du formulaire.");
    } finally {
      setSaving(false);
    }
  };

  if (loading) {
    return (
      <div className={`p-6 lg:p-8 ${isDark ? "bg-gray-900 text-white" : "bg-gray-50 text-gray-900"}`}>
        Loading profile...
      </div>
    );
  }

  return (
    <div
      className={`min-h-full space-y-6 p-4 lg:p-8 ${
        isDark ? "bg-gray-900 text-white" : "bg-gray-50 text-gray-900"
      } ${isRTL ? "text-right" : "text-left"}`}
    >
      <div>
        <h1 className="text-2xl font-semibold lg:text-3xl">My Profile</h1>
        <p className={isDark ? "text-gray-400" : "text-gray-600"}>
          Donnees synchronisees avec /api/auth/me et /api/form.
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
          <AlertCircle className="h-4 w-4" />
          {error || success}
        </div>
      )}

      <section className={`rounded-xl border p-5 ${isDark ? "border-gray-700 bg-gray-800" : "border-gray-200 bg-white"}`}>
        <h2 className="mb-3 text-lg font-semibold">Identity</h2>
        <div className="grid gap-3 md:grid-cols-2">
          {identityRows.map((row) => (
            <div key={row.label} className={`rounded-lg p-3 ${isDark ? "bg-gray-900" : "bg-gray-50"}`}>
              <p className={`text-xs ${isDark ? "text-gray-400" : "text-gray-500"}`}>{row.label}</p>
              <p className="mt-1 text-sm font-medium">{row.value}</p>
            </div>
          ))}
        </div>

        <div className="mt-4 grid gap-3 md:grid-cols-3">
          <div className={`rounded-lg p-3 ${isDark ? "bg-gray-900" : "bg-gray-50"}`}>
            <p className={`text-xs ${isDark ? "text-gray-400" : "text-gray-500"}`}>Estimated balance</p>
            <p className="mt-1 text-sm font-medium">{Number(indicators.estimated_balance || 0).toFixed(2)} TND</p>
          </div>
          <div className={`rounded-lg p-3 ${isDark ? "bg-gray-900" : "bg-gray-50"}`}>
            <p className={`text-xs ${isDark ? "text-gray-400" : "text-gray-500"}`}>Financial score</p>
            <p className="mt-1 text-sm font-medium">{indicators.financial_score ?? "-"}</p>
          </div>
          <div className={`rounded-lg p-3 ${isDark ? "bg-gray-900" : "bg-gray-50"}`}>
            <p className={`text-xs ${isDark ? "text-gray-400" : "text-gray-500"}`}>Monthly savings</p>
            <p className="mt-1 text-sm font-medium">{Number(indicators.net_monthly_savings || 0).toFixed(2)} TND</p>
          </div>
        </div>
      </section>

      <section className={`rounded-xl border p-5 ${isDark ? "border-gray-700 bg-gray-800" : "border-gray-200 bg-white"}`}>
        <div className="mb-4 flex items-center justify-between gap-3">
          <h2 className="text-lg font-semibold">Enhanced profile form</h2>
          <button
            type="button"
            onClick={saveForm}
            disabled={saving}
            className="inline-flex items-center gap-2 rounded-lg bg-[#0A2240] px-4 py-2 text-white hover:bg-[#12305b] disabled:opacity-60"
          >
            <Save className="h-4 w-4" />
            {saving ? "Saving..." : "Save form"}
          </button>
        </div>

        {schemaFields.length === 0 ? (
          <p className={isDark ? "text-gray-400" : "text-gray-600"}>No schema available.</p>
        ) : (
          <div className="grid gap-4 md:grid-cols-2">
            {schemaFields.map((field) => (
              <div key={field.field_id} className="space-y-1.5">
                <label className={`text-sm font-medium ${isDark ? "text-gray-200" : "text-gray-700"}`}>
                  {field.field_id}
                </label>

                {field.type === "select" && (
                  <select
                    value={formValues[field.field_id] || ""}
                    onChange={(event) => updateField(field.field_id, event.target.value)}
                    className={`w-full rounded-lg border px-3 py-2 ${
                      isDark ? "border-gray-600 bg-gray-700" : "border-gray-300 bg-white"
                    }`}
                  >
                    <option value="">-- select --</option>
                    {(field.options || []).map((option) => (
                      <option key={option} value={option}>
                        {option}
                      </option>
                    ))}
                  </select>
                )}

                {field.type === "multi-select" && (
                  <div className={`rounded-lg border p-2 ${isDark ? "border-gray-600 bg-gray-700" : "border-gray-300 bg-white"}`}>
                    <div className="max-h-32 space-y-1 overflow-auto">
                      {(field.options || []).map((option) => {
                        const checked = toArray(formValues[field.field_id]).includes(option);
                        return (
                          <label key={option} className="flex items-center gap-2 text-sm">
                            <input
                              type="checkbox"
                              checked={checked}
                              onChange={() => toggleMultiValue(field.field_id, option)}
                            />
                            <span>{option}</span>
                          </label>
                        );
                      })}
                    </div>
                  </div>
                )}

                {field.type === "number" && (
                  <input
                    type="number"
                    value={formValues[field.field_id] || ""}
                    onChange={(event) => updateField(field.field_id, event.target.value)}
                    className={`w-full rounded-lg border px-3 py-2 ${
                      isDark ? "border-gray-600 bg-gray-700" : "border-gray-300 bg-white"
                    }`}
                  />
                )}

                {field.type !== "select" && field.type !== "multi-select" && field.type !== "number" && (
                  <input
                    value={formValues[field.field_id] || ""}
                    onChange={(event) => updateField(field.field_id, event.target.value)}
                    className={`w-full rounded-lg border px-3 py-2 ${
                      isDark ? "border-gray-600 bg-gray-700" : "border-gray-300 bg-white"
                    }`}
                  />
                )}
              </div>
            ))}
          </div>
        )}
      </section>
    </div>
  );
}
