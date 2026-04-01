import { useEffect, useMemo, useRef, useState } from "react";
import {
  AlertCircle,
  Camera,
  Loader2,
  Save,
  ShieldCheck,
  Trash2,
  Upload,
  UserRound,
  Wallet,
} from "lucide-react";
import { useTheme } from "../contexts/ThemeContext";
import { useLanguage } from "../contexts/LanguageContext";
import {
  getClientId,
  getFormData,
  getFormSchema,
  getMe,
  submitForm,
  updateProfilePhoto,
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

const PROFILE_COPY = {
  en: {
    title: "My Profile",
    subtitle: "Manage your identity, photo and financial profile in one place.",
    loading: "Loading profile...",
    identityTitle: "Identity snapshot",
    cardLabel: "Banking identity",
    uploadPhoto: "Upload photo",
    removePhoto: "Remove",
    defaultName: "Client",
    noEmail: "No email",
    noPhone: "No phone",
    verified: "Verified",
    notVerified: "Not verified",
    memberSince: "Member since",
    unknown: "Unknown",
    estimatedBalance: "Estimated balance",
    financialScore: "Financial score",
    monthlySavings: "Monthly savings",
    enhancedFormTitle: "Enhanced profile form",
    enhancedFormSubtitle: "Update your personal preferences to improve recommendations.",
    saveForm: "Save form",
    savingForm: "Saving...",
    noSchema: "No schema available.",
    sessionMissing: "Missing session. Please sign in again to view your profile.",
    loadError: "Unable to load profile.",
    saveError: "Failed to save profile form.",
    saveSuccess: "Profile form saved and recommendations refreshed.",
    invalidImage: "Please choose an image (PNG, JPG or WEBP).",
    imageTooLarge: "Image too large. Please choose a lighter image.",
    photoSaveError: "Unable to update profile photo.",
    photoNetworkError: "Unable to reach server while uploading the photo. Check backend connectivity and try again.",
    photoSaveSuccess: "Profile photo updated successfully.",
    photoRemoved: "Profile photo removed.",
    photoSaving: "Updating photo...",
    choosePhoto: "Choose photo",
    emailLabel: "Email",
    phoneLabel: "Phone",
    clientIdLabel: "Client ID",
    statusLabel: "Status",
  },
  fr: {
    title: "Mon Profil",
    subtitle: "Gerez votre identite, votre photo et votre profil financier.",
    loading: "Chargement du profil...",
    identityTitle: "Vue identite",
    cardLabel: "Identite bancaire",
    uploadPhoto: "Ajouter une photo",
    removePhoto: "Supprimer",
    defaultName: "Client",
    noEmail: "Aucun email",
    noPhone: "Aucun telephone",
    verified: "Verifie",
    notVerified: "Non verifie",
    memberSince: "Client depuis",
    unknown: "Inconnu",
    estimatedBalance: "Solde estime",
    financialScore: "Score financier",
    monthlySavings: "Epargne mensuelle",
    enhancedFormTitle: "Formulaire de profil enrichi",
    enhancedFormSubtitle: "Mettez a jour vos preferences pour des recommandations plus precises.",
    saveForm: "Enregistrer",
    savingForm: "Enregistrement...",
    noSchema: "Aucun schema disponible.",
    sessionMissing: "Session absente. Connectez-vous pour voir votre profil.",
    loadError: "Impossible de charger le profil.",
    saveError: "Echec lors de la sauvegarde du formulaire.",
    saveSuccess: "Profil enregistre et recommandations mises a jour.",
    invalidImage: "Selectionnez une image PNG, JPG ou WEBP.",
    imageTooLarge: "Image trop grande. Choisissez une image plus legere.",
    photoSaveError: "Impossible de mettre a jour la photo de profil.",
    photoNetworkError: "Impossible de joindre le serveur pendant l'envoi de la photo. Verifiez le backend puis reessayez.",
    photoSaveSuccess: "Photo de profil mise a jour.",
    photoRemoved: "Photo de profil supprimee.",
    photoSaving: "Mise a jour de la photo...",
    choosePhoto: "Choisir une photo",
    emailLabel: "Email",
    phoneLabel: "Telephone",
    clientIdLabel: "Client ID",
    statusLabel: "Statut",
  },
  ar: {
    title: "ملفي الشخصي",
    subtitle: "ادارة الهوية والصورة والبيانات المالية في صفحة واحدة.",
    loading: "جاري تحميل الملف الشخصي...",
    identityTitle: "ملخص الهوية",
    cardLabel: "الهوية البنكية",
    uploadPhoto: "رفع صورة",
    removePhoto: "حذف",
    defaultName: "عميل",
    noEmail: "لا يوجد بريد",
    noPhone: "لا يوجد هاتف",
    verified: "موثق",
    notVerified: "غير موثق",
    memberSince: "عميل منذ",
    unknown: "غير معروف",
    estimatedBalance: "الرصيد التقديري",
    financialScore: "التقييم المالي",
    monthlySavings: "الادخار الشهري",
    enhancedFormTitle: "استمارة الملف الشخصي",
    enhancedFormSubtitle: "حدث تفضيلاتك للحصول على توصيات ادق.",
    saveForm: "حفظ",
    savingForm: "جاري الحفظ...",
    noSchema: "لا يوجد مخطط متاح.",
    sessionMissing: "الجلسة غير متاحة. يرجى تسجيل الدخول.",
    loadError: "تعذر تحميل الملف الشخصي.",
    saveError: "فشل حفظ الاستمارة.",
    saveSuccess: "تم حفظ الملف الشخصي وتحديث التوصيات.",
    invalidImage: "يرجى اختيار صورة PNG او JPG او WEBP.",
    imageTooLarge: "الصورة كبيرة جدا. يرجى اختيار صورة أخف.",
    photoSaveError: "تعذر تحديث الصورة الشخصية.",
    photoNetworkError: "تعذر الاتصال بالخادم أثناء رفع الصورة. تحقق من تشغيل الخلفية ثم أعد المحاولة.",
    photoSaveSuccess: "تم تحديث الصورة الشخصية.",
    photoRemoved: "تم حذف الصورة الشخصية.",
    photoSaving: "جاري تحديث الصورة...",
    choosePhoto: "اختيار صورة",
    emailLabel: "البريد الالكتروني",
    phoneLabel: "رقم الهاتف",
    clientIdLabel: "رقم العميل",
    statusLabel: "الحالة",
  },
};

const fieldLabel = (fieldId = "") =>
  fieldId
    .replace(/_/g, " ")
    .replace(/\b\w/g, (char) => char.toUpperCase());

const readFileAsDataUrl = (file) =>
  new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onload = () => resolve(String(reader.result || ""));
    reader.onerror = () => reject(new Error("file-read-error"));
    reader.readAsDataURL(file);
  });

const compressImage = (srcDataUrl, maxSide = 360, quality = 0.82) =>
  new Promise((resolve, reject) => {
    const image = new Image();
    image.onload = () => {
      const longestSide = Math.max(image.width, image.height) || 1;
      const scale = Math.min(1, maxSide / longestSide);
      const width = Math.max(1, Math.round(image.width * scale));
      const height = Math.max(1, Math.round(image.height * scale));

      const canvas = document.createElement("canvas");
      canvas.width = width;
      canvas.height = height;
      const context = canvas.getContext("2d");

      if (!context) {
        resolve(srcDataUrl);
        return;
      }

      context.drawImage(image, 0, 0, width, height);
      resolve(canvas.toDataURL("image/jpeg", quality));
    };
    image.onerror = () => reject(new Error("image-compression-error"));
    image.src = srcDataUrl;
  });

const isNetworkFetchError = (err) => {
  const message = String(err?.message || "").toLowerCase();
  return (
    message.includes("failed to fetch") ||
    message.includes("networkerror") ||
    message.includes("load failed")
  );
};

export function Profile() {
  const { theme } = useTheme();
  const { language, isRTL } = useLanguage();
  const isDark = theme === "dark";
  const labels = PROFILE_COPY[language] || PROFILE_COPY.en;

  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [photoSaving, setPhotoSaving] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");

  const [profile, setProfile] = useState(null);
  const [schemaFields, setSchemaFields] = useState([]);
  const [formValues, setFormValues] = useState({});

  const clientId = getClientId();
  const fileInputRef = useRef(null);

  useEffect(() => {
    const load = async () => {
      if (!clientId) {
        setError(labels.sessionMissing);
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
        setError(err.message || labels.loadError);
      } finally {
        setLoading(false);
      }
    };

    load();
  }, [clientId, labels.loadError, labels.sessionMissing]);

  const indicators = profile?.indicators || {};

  const memberSince = useMemo(() => {
    if (!profile?.created_at) return labels.unknown;

    const date = new Date(profile.created_at);
    if (Number.isNaN(date.getTime())) return labels.unknown;

    return date.toLocaleDateString(language, { year: "numeric", month: "short" });
  }, [profile?.created_at, labels.unknown, language]);

  const profileInitials = useMemo(() => {
    const base =
      profile?.client_name || profile?.email || profile?.client_id || labels.defaultName;
    const chunks = String(base)
      .trim()
      .split(/\s+/)
      .filter(Boolean)
      .slice(0, 2);

    if (chunks.length === 0) return "CL";
    return chunks.map((chunk) => chunk[0]?.toUpperCase() || "").join("") || "CL";
  }, [profile?.client_name, profile?.email, profile?.client_id, labels.defaultName]);

  const identityRows = useMemo(
    () => [
      { label: labels.clientIdLabel, value: profile?.client_id || "-" },
      { label: "Name", value: profile?.client_name || "-" },
      { label: labels.emailLabel, value: profile?.email || "-" },
      { label: labels.phoneLabel, value: profile?.phone || "-" },
      {
        label: labels.statusLabel,
        value: profile?.email_verified ? labels.verified : labels.notVerified,
      },
    ],
    [profile, labels.clientIdLabel, labels.emailLabel, labels.phoneLabel, labels.statusLabel, labels.verified, labels.notVerified],
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
      setSuccess(labels.saveSuccess);
    } catch (err) {
      setError(err.message || labels.saveError);
    } finally {
      setSaving(false);
    }
  };

  const triggerPhotoPicker = () => {
    if (!photoSaving) {
      fileInputRef.current?.click();
    }
  };

  const onPhotoSelected = async (event) => {
    const file = event.target.files?.[0];
    event.target.value = "";
    if (!file) return;

    if (!file.type.startsWith("image/")) {
      setError(labels.invalidImage);
      setSuccess("");
      return;
    }

    if (file.size > 8 * 1024 * 1024) {
      setError(labels.imageTooLarge);
      setSuccess("");
      return;
    }

    try {
      setPhotoSaving(true);
      setError("");
      setSuccess("");

      const source = await readFileAsDataUrl(file);
      let optimized = await compressImage(source, 360, 0.82);

      // Retry with stronger compression when payload is close to backend/db limits.
      if (optimized.length > 900_000) {
        optimized = await compressImage(optimized, 280, 0.72);
      }

      if (optimized.length > 1_000_000) {
        setError(labels.imageTooLarge);
        return;
      }

      const response = await updateProfilePhoto(optimized);

      setProfile((prev) => ({
        ...(prev || {}),
        profile_photo: response?.profile_photo || optimized,
      }));
      setSuccess(labels.photoSaveSuccess);
    } catch (err) {
      setError(
        isNetworkFetchError(err)
          ? labels.photoNetworkError
          : err.message || labels.photoSaveError,
      );
    } finally {
      setPhotoSaving(false);
    }
  };

  const removePhoto = async () => {
    try {
      setPhotoSaving(true);
      setError("");
      setSuccess("");
      await updateProfilePhoto("");
      setProfile((prev) => ({ ...(prev || {}), profile_photo: "" }));
      setSuccess(labels.photoRemoved);
    } catch (err) {
      setError(
        isNetworkFetchError(err)
          ? labels.photoNetworkError
          : err.message || labels.photoSaveError,
      );
    } finally {
      setPhotoSaving(false);
    }
  };

  if (loading) {
    return (
      <div className={`p-6 lg:p-8 ${isDark ? "bg-gray-900 text-white" : "bg-gray-50 text-gray-900"}`}>
        {labels.loading}
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
        <h1 className="text-2xl font-semibold lg:text-3xl">{labels.title}</h1>
        <p className={isDark ? "text-gray-400" : "text-gray-600"}>
          {labels.subtitle}
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

      <section
        className={`relative overflow-hidden rounded-2xl border p-5 lg:p-6 ${
          isDark ? "border-gray-700 bg-gray-800" : "border-gray-200 bg-white"
        }`}
      >
        <div
          className={`pointer-events-none absolute -right-16 -top-16 h-40 w-40 rounded-full blur-2xl ${
            isDark ? "bg-indigo-500/20" : "bg-cyan-300/30"
          }`}
        />
        <div
          className={`pointer-events-none absolute -bottom-20 -left-16 h-44 w-44 rounded-full blur-2xl ${
            isDark ? "bg-emerald-500/15" : "bg-emerald-200/40"
          }`}
        />

        <div className="relative grid gap-6 lg:grid-cols-[auto,1fr,auto] lg:items-center">
          <div className="relative mx-auto lg:mx-0">
            <div
              className={`h-28 w-28 overflow-hidden rounded-3xl ring-4 ${
                isDark ? "ring-gray-700 bg-gray-900" : "ring-white bg-gray-100"
              }`}
            >
              {profile?.profile_photo ? (
                <img
                  src={profile.profile_photo}
                  alt="Profile"
                  className="h-full w-full object-cover"
                />
              ) : (
                <div className="flex h-full w-full items-center justify-center bg-linear-to-br from-[#0A2240] to-[#1f5faa] text-2xl font-semibold text-white">
                  {profileInitials}
                </div>
              )}
            </div>
            <button
              type="button"
              onClick={triggerPhotoPicker}
              disabled={photoSaving}
              className="absolute -bottom-2 -right-2 inline-flex h-9 w-9 items-center justify-center rounded-full bg-[#0A2240] text-white shadow-lg hover:bg-[#12305b] disabled:cursor-not-allowed disabled:opacity-60"
              aria-label={labels.uploadPhoto}
            >
              {photoSaving ? <Loader2 className="h-4 w-4 animate-spin" /> : <Camera className="h-4 w-4" />}
            </button>
          </div>

          <div className="space-y-3">
            <p className={`text-xs uppercase tracking-[0.18em] ${isDark ? "text-cyan-300" : "text-sky-700"}`}>
              {labels.cardLabel}
            </p>
            <h2 className="text-2xl font-semibold lg:text-3xl">
              {profile?.client_name || labels.defaultName}
            </h2>
            <p className={`${isDark ? "text-gray-300" : "text-gray-600"}`}>
              {profile?.email || labels.noEmail}
            </p>

            <div className="flex flex-wrap items-center gap-2 text-xs">
              <span className={`rounded-full px-3 py-1 ${isDark ? "bg-gray-700 text-gray-200" : "bg-gray-100 text-gray-700"}`}>
                {labels.clientIdLabel}: {profile?.client_id || "-"}
              </span>
              <span
                className={`rounded-full px-3 py-1 ${
                  profile?.email_verified
                    ? "bg-emerald-100 text-emerald-700"
                    : "bg-amber-100 text-amber-700"
                }`}
              >
                {profile?.email_verified ? labels.verified : labels.notVerified}
              </span>
              <span className={`rounded-full px-3 py-1 ${isDark ? "bg-gray-700 text-gray-200" : "bg-gray-100 text-gray-700"}`}>
                {labels.phoneLabel}: {profile?.phone || labels.noPhone}
              </span>
            </div>

            <div className="flex flex-wrap gap-2 pt-1">
              <button
                type="button"
                onClick={triggerPhotoPicker}
                disabled={photoSaving}
                className="inline-flex items-center gap-2 rounded-lg bg-[#0A2240] px-4 py-2 text-sm text-white hover:bg-[#12305b] disabled:cursor-not-allowed disabled:opacity-60"
              >
                {photoSaving ? <Loader2 className="h-4 w-4 animate-spin" /> : <Upload className="h-4 w-4" />}
                {photoSaving ? labels.photoSaving : labels.uploadPhoto}
              </button>

              <button
                type="button"
                onClick={removePhoto}
                disabled={photoSaving || !profile?.profile_photo}
                className={`inline-flex items-center gap-2 rounded-lg border px-4 py-2 text-sm disabled:cursor-not-allowed disabled:opacity-60 ${
                  isDark
                    ? "border-gray-600 bg-gray-900 text-gray-100 hover:bg-gray-700"
                    : "border-gray-300 bg-white text-gray-700 hover:bg-gray-50"
                }`}
              >
                <Trash2 className="h-4 w-4" />
                {labels.removePhoto}
              </button>

              <input
                ref={fileInputRef}
                type="file"
                accept="image/png,image/jpeg,image/webp"
                className="hidden"
                onChange={onPhotoSelected}
              />
            </div>
          </div>

          <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-1">
            <div className={`rounded-xl border p-3 ${isDark ? "border-gray-700 bg-gray-900" : "border-gray-200 bg-gray-50"}`}>
              <p className={`text-xs ${isDark ? "text-gray-400" : "text-gray-500"}`}>
                {labels.memberSince}
              </p>
              <p className="mt-1 text-sm font-semibold">{memberSince}</p>
            </div>
            <div className={`rounded-xl border p-3 ${isDark ? "border-gray-700 bg-gray-900" : "border-gray-200 bg-gray-50"}`}>
              <p className={`text-xs ${isDark ? "text-gray-400" : "text-gray-500"}`}>{labels.statusLabel}</p>
              <p className="mt-1 text-sm font-semibold">{profile?.email_verified ? labels.verified : labels.notVerified}</p>
            </div>
          </div>
        </div>
      </section>

      <section className={`rounded-xl border p-5 ${isDark ? "border-gray-700 bg-gray-800" : "border-gray-200 bg-white"}`}>
        <h2 className="mb-3 text-lg font-semibold">{labels.identityTitle}</h2>
        <div className="grid gap-3 md:grid-cols-2">
          {identityRows.map((row) => (
            <div key={row.label} className={`rounded-lg p-3 ${isDark ? "bg-gray-900" : "bg-gray-50"}`}>
              <p className={`text-xs ${isDark ? "text-gray-400" : "text-gray-500"}`}>{row.label}</p>
              <p className="mt-1 text-sm font-medium">{row.value}</p>
            </div>
          ))}
        </div>

        <div className="mt-4 grid gap-3 md:grid-cols-3">
          <div className={`rounded-xl border p-3 ${isDark ? "border-gray-700 bg-gray-900" : "border-gray-200 bg-gray-50"}`}>
            <div className="flex items-center gap-2">
              <span className="inline-flex h-8 w-8 items-center justify-center rounded-full bg-sky-100 text-sky-700">
                <Wallet className="h-4 w-4" />
              </span>
              <p className={`text-xs ${isDark ? "text-gray-400" : "text-gray-500"}`}>{labels.estimatedBalance}</p>
            </div>
            <p className="mt-2 text-sm font-semibold">
              {Number(indicators.estimated_balance || 0).toFixed(2)} TND
            </p>
          </div>
          <div className={`rounded-xl border p-3 ${isDark ? "border-gray-700 bg-gray-900" : "border-gray-200 bg-gray-50"}`}>
            <div className="flex items-center gap-2">
              <span className="inline-flex h-8 w-8 items-center justify-center rounded-full bg-emerald-100 text-emerald-700">
                <ShieldCheck className="h-4 w-4" />
              </span>
              <p className={`text-xs ${isDark ? "text-gray-400" : "text-gray-500"}`}>{labels.financialScore}</p>
            </div>
            <p className="mt-2 text-sm font-semibold">{indicators.financial_score ?? "-"}</p>
          </div>
          <div className={`rounded-xl border p-3 ${isDark ? "border-gray-700 bg-gray-900" : "border-gray-200 bg-gray-50"}`}>
            <div className="flex items-center gap-2">
              <span className="inline-flex h-8 w-8 items-center justify-center rounded-full bg-indigo-100 text-indigo-700">
                <UserRound className="h-4 w-4" />
              </span>
              <p className={`text-xs ${isDark ? "text-gray-400" : "text-gray-500"}`}>{labels.monthlySavings}</p>
            </div>
            <p className="mt-2 text-sm font-semibold">
              {Number(indicators.net_monthly_savings || 0).toFixed(2)} TND
            </p>
          </div>
        </div>
      </section>

      <section className={`rounded-xl border p-5 ${isDark ? "border-gray-700 bg-gray-800" : "border-gray-200 bg-white"}`}>
        <div className="mb-4 flex items-center justify-between gap-3">
          <div>
            <h2 className="text-lg font-semibold">{labels.enhancedFormTitle}</h2>
            <p className={`mt-1 text-sm ${isDark ? "text-gray-400" : "text-gray-600"}`}>
              {labels.enhancedFormSubtitle}
            </p>
          </div>
          <button
            type="button"
            onClick={saveForm}
            disabled={saving}
            className="inline-flex items-center gap-2 rounded-lg bg-[#0A2240] px-4 py-2 text-white hover:bg-[#12305b] disabled:opacity-60"
          >
            <Save className="h-4 w-4" />
            {saving ? labels.savingForm : labels.saveForm}
          </button>
        </div>

        {schemaFields.length === 0 ? (
          <p className={isDark ? "text-gray-400" : "text-gray-600"}>{labels.noSchema}</p>
        ) : (
          <div className="grid gap-4 md:grid-cols-2">
            {schemaFields.map((field) => (
              <div key={field.field_id} className="space-y-1.5">
                <label className={`text-sm font-medium ${isDark ? "text-gray-200" : "text-gray-700"}`}>
                  {fieldLabel(field.field_id)}
                </label>

                {field.type === "select" && (
                  <select
                    value={formValues[field.field_id] ?? ""}
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
                    value={formValues[field.field_id] ?? ""}
                    onChange={(event) => updateField(field.field_id, event.target.value)}
                    className={`w-full rounded-lg border px-3 py-2 ${
                      isDark ? "border-gray-600 bg-gray-700" : "border-gray-300 bg-white"
                    }`}
                  />
                )}

                {field.type !== "select" && field.type !== "multi-select" && field.type !== "number" && (
                  <input
                    value={formValues[field.field_id] ?? ""}
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
