import { useEffect, useMemo, useRef, useState } from "react";
import {
  AlertCircle,
  Loader2,
  Pencil,
  Save,
  ShieldCheck,
  Trash2,
  Upload,
  UserRound,
  Wallet,
  X,
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
import { Skeleton, SkeletonLines } from "../components/Skeleton";
import {
  isOfflineCacheStale,
  readProfileOfflineCache,
  writeProfileOfflineCache,
} from "../offlineCache";

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
    editForm: "Modify",
    closeForm: "Close",
    editHint: "Click Modify to edit your form fields.",
    validationSummary: "Please correct the highlighted fields.",
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
    cinLabel: "Client CIN",
    cardNumberLabel: "Card number",
    cardExpiryLabel: "Card expiry",
    cardsCountLabel: "Cards count",
    cardCodeLabel: "Card code (mock)",
    statusLabel: "Status",
    offlineBanner: "Offline mode enabled. Showing your latest synchronized profile data.",
    offlineLastSync: "Last sync",
    staleDataWarning: "Cached profile data may be outdated (last sync older than 24h).",
    syncInProgress: "Connection restored. Synchronizing profile data...",
    syncSuccess: "Profile synchronized successfully.",
    syncFailed: "Profile synchronization failed. The app will retry when the network is stable.",
    offlineReadOnly: "Offline mode: profile updates are temporarily disabled.",
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
    editForm: "Modifier",
    closeForm: "Fermer",
    editHint: "Cliquez sur Modifier pour mettre a jour les champs du formulaire.",
    validationSummary: "Veuillez corriger les champs en erreur.",
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
    cinLabel: "CIN client",
    cardNumberLabel: "Numero de carte",
    cardExpiryLabel: "Expiration carte",
    cardsCountLabel: "Nombre de cartes",
    cardCodeLabel: "Code carte (mock)",
    statusLabel: "Statut",
    offlineBanner: "Mode hors ligne active. Affichage des dernieres donnees synchronisees du profil.",
    offlineLastSync: "Derniere synchro",
    staleDataWarning: "Les donnees du profil en cache peuvent etre anciennes (derniere synchro superieure a 24h).",
    syncInProgress: "Connexion retablie. Synchronisation du profil...",
    syncSuccess: "Profil synchronise avec succes.",
    syncFailed: "Echec de synchronisation du profil. L'application reessaiera quand le reseau sera stable.",
    offlineReadOnly: "Mode hors ligne: les mises a jour du profil sont temporairement desactivees.",
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
    editForm: "تعديل",
    closeForm: "اغلاق",
    editHint: "اضغط على تعديل لتحديث حقول الاستمارة.",
    validationSummary: "يرجى تصحيح الحقول التي تحتوي على أخطاء.",
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
    cinLabel: "رقم CIN",
    cardNumberLabel: "رقم البطاقة",
    cardExpiryLabel: "تاريخ انتهاء البطاقة",
    cardsCountLabel: "عدد البطاقات",
    cardCodeLabel: "رمز البطاقة (تجريبي)",
    statusLabel: "الحالة",
    offlineBanner: "تم تفعيل الوضع دون انترنت. يتم عرض اخر بيانات الملف الشخصي التي تمت مزامنتها.",
    offlineLastSync: "اخر مزامنة",
    staleDataWarning: "قد تكون بيانات الملف الشخصي المخزنة قديمة (اخر مزامنة تجاوزت 24 ساعة).",
    syncInProgress: "تمت استعادة الاتصال. جاري مزامنة بيانات الملف الشخصي...",
    syncSuccess: "تمت مزامنة الملف الشخصي بنجاح.",
    syncFailed: "فشلت مزامنة الملف الشخصي. سيعاد المحاولة عند استقرار الشبكة.",
    offlineReadOnly: "وضع دون انترنت: تم تعطيل تحديثات الملف الشخصي مؤقتا.",
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

const formatDateTime = (value, language) => {
  if (!value) return "-";
  const date = new Date(value);
  if (Number.isNaN(date.getTime())) return "-";

  const locale = language === "en" ? "en-US" : language === "ar" ? "ar-TN" : "fr-FR";
  return new Intl.DateTimeFormat(locale, {
    day: "2-digit",
    month: "short",
    year: "numeric",
    hour: "2-digit",
    minute: "2-digit",
    hour12: false,
  }).format(date);
};

const extractSchemaFields = (schemaPayload) => {
  if (!schemaPayload || typeof schemaPayload !== "object") {
    return [];
  }

  const directFields = Array.isArray(schemaPayload.fields) ? schemaPayload.fields : [];
  const sectionFields = Array.isArray(schemaPayload.sections)
    ? schemaPayload.sections.flatMap((section) =>
        Array.isArray(section?.fields) ? section.fields : [],
      )
    : [];

  const merged = [...directFields, ...sectionFields].filter(
    (field) => field && typeof field === "object" && field.field_id,
  );

  const seen = new Set();
  return merged.filter((field) => {
    const id = String(field.field_id);
    if (seen.has(id)) return false;
    seen.add(id);
    return true;
  });
};

const normalizeBooleanValue = (value) => {
  const raw = String(value ?? "").trim().toLowerCase();
  if (value === true || raw === "true" || raw === "1" || raw === "yes" || raw === "oui") {
    return "yes";
  }
  if (value === false || raw === "false" || raw === "0" || raw === "no" || raw === "non") {
    return "no";
  }
  return "";
};

const BOOLEAN_SELECT_OPTIONS = [
  { value: "yes", label: "Oui" },
  { value: "no", label: "Non" },
];

const parseValidationErrors = (err) => {
  const fieldErrors = {};
  const generalErrors = [];

  const payloadErrors = Array.isArray(err?.payload?.errors) ? err.payload.errors : [];
  const rawSource = payloadErrors.length
    ? payloadErrors
    : String(err?.message || "")
        .split("|")
        .map((item) => item.trim())
        .filter(Boolean);

  rawSource.forEach((item) => {
    const match = String(item).match(/^([a-zA-Z0-9_]+)\s*:\s*(.+)$/);
    if (match) {
      const fieldId = String(match[1] || "").trim();
      const reason = String(match[2] || "").trim();
      if (fieldId && reason) {
        fieldErrors[fieldId] = reason;
        return;
      }
    }
    if (item) generalErrors.push(String(item));
  });

  return { fieldErrors, generalErrors };
};

const buildInitialFormValuesFromSchema = (fields, existingValues) => {
  const safeFields = Array.isArray(fields) ? fields : [];
  const existing = existingValues && typeof existingValues === "object" ? existingValues : {};

  if (safeFields.length === 0) {
    return existing;
  }

  const initialValues = {};
  safeFields.forEach((field) => {
    if (!field || !field.field_id) return;

    if (field.type === "multi-select") {
      initialValues[field.field_id] = toArray(existing[field.field_id]);
    } else if (field.type === "boolean") {
      initialValues[field.field_id] = normalizeBooleanValue(existing[field.field_id]);
    } else {
      initialValues[field.field_id] = existing[field.field_id] || "";
    }
  });

  return initialValues;
};

function ProfileSkeleton({ isDark, isRTL }) {
  return (
    <div
      className={`min-h-full space-y-6 p-4 lg:p-8 ${
        isDark ? "skeleton-dark bg-gray-900 text-white" : "bg-gray-50 text-gray-900"
      } ${isRTL ? "text-right" : "text-left"}`}
    >
      <div className="space-y-3">
        <Skeleton className="h-8 w-52 rounded-lg" />
        <Skeleton className="h-4 w-full max-w-xl rounded-md" />
      </div>

      <section className={`rounded-2xl border p-5 lg:p-6 ${isDark ? "border-gray-700 bg-gray-800" : "border-gray-200 bg-white"}`}>
        <div className="grid gap-6 lg:grid-cols-[auto,1fr,auto] lg:items-center">
          <Skeleton className="mx-auto h-28 w-28 rounded-3xl lg:mx-0" />

          <div className="space-y-3">
            <Skeleton className="h-4 w-40 rounded-md" />
            <Skeleton className="h-8 w-64 rounded-lg" />
            <Skeleton className="h-4 w-56 rounded-md" />
            <div className="flex flex-wrap gap-2">
              <Skeleton className="h-6 w-28 rounded-full" />
              <Skeleton className="h-6 w-24 rounded-full" />
              <Skeleton className="h-6 w-32 rounded-full" />
            </div>
            <div className="flex flex-wrap gap-2 pt-1">
              <Skeleton className="h-10 w-40 rounded-lg" />
              <Skeleton className="h-10 w-28 rounded-lg" />
            </div>
          </div>

          <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-1">
            <Skeleton className="h-20 rounded-xl" />
            <Skeleton className="h-20 rounded-xl" />
          </div>
        </div>
      </section>

      <section className={`rounded-xl border p-5 ${isDark ? "border-gray-700 bg-gray-800" : "border-gray-200 bg-white"}`}>
        <Skeleton className="h-7 w-40 rounded-lg" />
        <div className="mt-4 grid gap-3 md:grid-cols-2">
          {Array.from({ length: 6 }).map((_, index) => (
            <Skeleton key={`profile-identity-skeleton-${index}`} className="h-16 rounded-lg" />
          ))}
        </div>

        <div className="mt-4 grid gap-3 md:grid-cols-3">
          <Skeleton className="h-24 rounded-xl" />
          <Skeleton className="h-24 rounded-xl" />
          <Skeleton className="h-24 rounded-xl" />
        </div>
      </section>

      <section className={`rounded-xl border p-5 ${isDark ? "border-gray-700 bg-gray-800" : "border-gray-200 bg-white"}`}>
        <div className="mb-4 flex items-center justify-between gap-3">
          <div className="space-y-2">
            <Skeleton className="h-6 w-52 rounded-lg" />
            <Skeleton className="h-4 w-80 max-w-full rounded-md" />
          </div>
          <Skeleton className="h-10 w-36 rounded-lg" />
        </div>

        <div className="grid gap-4 md:grid-cols-2">
          {Array.from({ length: 6 }).map((_, index) => (
            <div key={`profile-form-skeleton-${index}`} className="space-y-2">
              <Skeleton className="h-4 w-32 rounded-md" />
              <Skeleton className="h-10 rounded-lg" />
            </div>
          ))}
        </div>

        <SkeletonLines className="mt-4" lines={2} lineClassName="h-3 rounded-md" lastLineClassName="w-2/3" />
      </section>
    </div>
  );
}

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
  const [isFormEditing, setIsFormEditing] = useState(false);
  const [isFormModalOpen, setIsFormModalOpen] = useState(false);
  const [formFieldErrors, setFormFieldErrors] = useState({});
  const [formModalError, setFormModalError] = useState("");
  const [isOffline, setIsOffline] = useState(() => (typeof navigator !== "undefined" ? !navigator.onLine : false));
  const [usingOfflineData, setUsingOfflineData] = useState(false);
  const [lastSyncAt, setLastSyncAt] = useState("");
  const [isCacheStale, setIsCacheStale] = useState(false);
  const [syncState, setSyncState] = useState("idle");
  const [refreshNonce, setRefreshNonce] = useState(0);
  const syncStateRef = useRef("idle");

  const clientId = getClientId();
  const fileInputRef = useRef(null);

  useEffect(() => {
    syncStateRef.current = syncState;
  }, [syncState]);

  useEffect(() => {
    if (typeof window === "undefined") return undefined;

    const handleOnline = () => {
      setIsOffline(false);
      setSyncState("syncing");
      setRefreshNonce((value) => value + 1);
    };

    const handleOffline = () => {
      setIsOffline(true);
      setSyncState("idle");
    };

    window.addEventListener("online", handleOnline);
    window.addEventListener("offline", handleOffline);

    return () => {
      window.removeEventListener("online", handleOnline);
      window.removeEventListener("offline", handleOffline);
    };
  }, []);

  useEffect(() => {
    let cancelled = false;

    const load = async () => {
      if (!clientId) {
        setError(labels.sessionMissing);
        setUsingOfflineData(false);
        setIsCacheStale(false);
        setLoading(false);
        return;
      }

      const reconnectSyncAttempt = syncStateRef.current === "syncing";
      const cachedSnapshot = readProfileOfflineCache(clientId);

      const applyCachedSnapshot = (snapshot) => {
        const hasCachedData =
          Boolean(snapshot?.profile) ||
          (Array.isArray(snapshot?.schemaFields) && snapshot.schemaFields.length > 0) ||
          (snapshot?.formValues && Object.keys(snapshot.formValues).length > 0);

        if (!hasCachedData) return false;

        const fields = Array.isArray(snapshot?.schemaFields) ? snapshot.schemaFields : [];
        const initialValues = buildInitialFormValuesFromSchema(fields, snapshot?.formValues || {});

        setProfile(snapshot?.profile || null);
        setSchemaFields(fields);
        setFormValues(initialValues);
        setLastSyncAt(snapshot?.updatedAt || "");
        setIsCacheStale(isOfflineCacheStale(snapshot?.updatedAt));
        return true;
      };

      try {
        setLoading(true);
        setError("");

        const offlineNow = typeof navigator !== "undefined" && !navigator.onLine;
        if (offlineNow) {
          setIsOffline(true);
          const usedCache = applyCachedSnapshot(cachedSnapshot);
          setUsingOfflineData(usedCache);

          if (!usedCache) {
            setError(labels.loadError);
            setIsCacheStale(false);
          }

          if (reconnectSyncAttempt) {
            setSyncState(usedCache ? "idle" : "failed");
          }

          return;
        }

        const [meData, schemaData, formData] = await Promise.all([
          getMe(),
          getFormSchema(),
          getFormData(clientId),
        ]);

        if (cancelled) return;

        const nextProfile = meData || null;
        const fields = extractSchemaFields(schemaData);
        const initialValues = buildInitialFormValuesFromSchema(fields, formData?.form_data || {});

        setProfile(nextProfile);
        setSchemaFields(fields);
        setFormValues(initialValues);
        setIsFormEditing(false);
        setFormFieldErrors({});
        setFormModalError("");
        setUsingOfflineData(false);
        setIsOffline(false);
        setIsCacheStale(false);

        const nowIso = new Date().toISOString();
        setLastSyncAt(nowIso);
        writeProfileOfflineCache(clientId, {
          updatedAt: nowIso,
          profile: nextProfile,
          schemaFields: fields,
          formValues: initialValues,
        });

        if (reconnectSyncAttempt) {
          setSyncState("synced");
        }
      } catch (err) {
        if (cancelled) return;

        const usedCache = applyCachedSnapshot(cachedSnapshot);
        setUsingOfflineData(usedCache);

        if (!usedCache) {
          setError(err.message || labels.loadError);
          setIsCacheStale(false);
        } else {
          setError("");
        }

        if (isNetworkFetchError(err)) {
          setIsOffline(true);
        }

        if (reconnectSyncAttempt) {
          setSyncState("failed");
        }
      } finally {
        if (!cancelled) {
          setLoading(false);
        }
      }
    };

    load();

    return () => {
      cancelled = true;
    };
  }, [clientId, labels.loadError, labels.sessionMissing, refreshNonce]);

  useEffect(() => {
    if (syncState !== "synced" && syncState !== "failed") return undefined;
    const timerId = window.setTimeout(() => setSyncState("idle"), 3000);
    return () => window.clearTimeout(timerId);
  }, [syncState]);

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

  const enableFormEditing = () => {
    if (schemaFields.length === 0) {
      setError(labels.noSchema);
      setSuccess("");
      return;
    }

    if (isOffline) {
      setError(labels.offlineReadOnly);
      setSuccess("");
      return;
    }

    setError("");
    setSuccess("");
    setFormFieldErrors({});
    setFormModalError("");
    setIsFormEditing(true);
    setIsFormModalOpen(true);
  };

  const closeFormModal = () => {
    if (saving) return;
    setIsFormModalOpen(false);
    setIsFormEditing(false);
    setFormFieldErrors({});
    setFormModalError("");
  };

  const clearFieldError = (fieldId) => {
    setFormFieldErrors((prev) => {
      if (!prev[fieldId]) return prev;
      const next = { ...prev };
      delete next[fieldId];
      return next;
    });
  };

  const updateField = (fieldId, value) => {
    clearFieldError(fieldId);
    setFormModalError("");
    setFormValues((prev) => ({ ...prev, [fieldId]: value }));
  };

  const toggleMultiValue = (fieldId, option) => {
    clearFieldError(fieldId);
    setFormModalError("");
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
    if (isOffline) {
      setError(labels.offlineReadOnly);
      setSuccess("");
      return;
    }

    try {
      setSaving(true);
      setError("");
      setSuccess("");
      setFormFieldErrors({});
      setFormModalError("");

      await submitForm(clientId, formValues);
      const nowIso = new Date().toISOString();
      setLastSyncAt(nowIso);
      setIsCacheStale(false);
      writeProfileOfflineCache(clientId, {
        updatedAt: nowIso,
        profile,
        schemaFields,
        formValues,
      });
      setIsFormEditing(false);
      setIsFormModalOpen(false);
      setSuccess(labels.saveSuccess);
    } catch (err) {
      setError(err.message || labels.saveError);
      const { fieldErrors, generalErrors } = parseValidationErrors(err);
      setFormFieldErrors(fieldErrors);
      if (generalErrors.length > 0) {
        setFormModalError(generalErrors.join(" | "));
      } else if (Object.keys(fieldErrors).length > 0) {
        setFormModalError(labels.validationSummary);
      } else {
        setFormModalError(err.message || labels.saveError);
      }
    } finally {
      setSaving(false);
    }
  };

  const triggerPhotoPicker = () => {
    if (!photoSaving) {
      if (isOffline) {
        setError(labels.offlineReadOnly);
        setSuccess("");
        return;
      }
      fileInputRef.current?.click();
    }
  };

  const onPhotoSelected = async (event) => {
    const file = event.target.files?.[0];
    event.target.value = "";
    if (!file) return;

    if (isOffline) {
      setError(labels.offlineReadOnly);
      setSuccess("");
      return;
    }

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

      const nextProfile = {
        ...(profile || {}),
        profile_photo: response?.profile_photo || optimized,
      };
      setProfile(nextProfile);
      const nowIso = new Date().toISOString();
      setLastSyncAt(nowIso);
      setIsCacheStale(false);
      writeProfileOfflineCache(clientId, {
        updatedAt: nowIso,
        profile: nextProfile,
        schemaFields,
        formValues,
      });
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
    if (isOffline) {
      setError(labels.offlineReadOnly);
      setSuccess("");
      return;
    }

    try {
      setPhotoSaving(true);
      setError("");
      setSuccess("");
      await updateProfilePhoto("");
      const nextProfile = { ...(profile || {}), profile_photo: "" };
      setProfile(nextProfile);
      const nowIso = new Date().toISOString();
      setLastSyncAt(nowIso);
      setIsCacheStale(false);
      writeProfileOfflineCache(clientId, {
        updatedAt: nowIso,
        profile: nextProfile,
        schemaFields,
        formValues,
      });
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

  useEffect(() => {
    if (!isFormModalOpen || typeof window === "undefined" || typeof document === "undefined") {
      return undefined;
    }

    const handleKeyDown = (event) => {
      if (event.key === "Escape") {
        if (saving) return;
        setIsFormModalOpen(false);
        setIsFormEditing(false);
      }
    };

    const previousOverflow = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    window.addEventListener("keydown", handleKeyDown);

    return () => {
      document.body.style.overflow = previousOverflow;
      window.removeEventListener("keydown", handleKeyDown);
    };
  }, [isFormModalOpen, saving]);

  if (loading) {
    return <ProfileSkeleton isDark={isDark} isRTL={isRTL} />;
  }

  const syncNotice =
    syncState === "syncing"
      ? labels.syncInProgress
      : syncState === "synced"
        ? labels.syncSuccess
        : syncState === "failed"
          ? labels.syncFailed
          : "";
  const connectivityNotice = syncNotice || ((isOffline || usingOfflineData) ? labels.offlineBanner : "");

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

      {connectivityNotice && (
        <div
          className={`rounded-xl border p-4 text-sm ${
            syncState === "failed"
              ? isDark
                ? "border-red-800 bg-red-950/30 text-red-300"
                : "border-red-200 bg-red-50 text-red-700"
              : syncState === "synced"
                ? isDark
                  ? "border-emerald-800 bg-emerald-950/20 text-emerald-300"
                  : "border-emerald-200 bg-emerald-50 text-emerald-700"
                : isDark
                  ? "border-amber-800 bg-amber-950/20 text-amber-200"
                  : "border-amber-200 bg-amber-50 text-amber-700"
          }`}
        >
          <div className="flex items-start gap-2">
            <AlertCircle className="mt-0.5 h-4 w-4" />
            <div>
              <p>{connectivityNotice}</p>
              {lastSyncAt && (
                <p className={`mt-1 text-xs ${isDark ? "text-gray-300" : "text-[#4f5c72]"}`}>
                  {labels.offlineLastSync}: {formatDateTime(lastSyncAt, language)}
                </p>
              )}
              {isCacheStale && (isOffline || usingOfflineData) && (
                <p className={`mt-1 text-xs ${isDark ? "text-amber-200" : "text-amber-800"}`}>
                  {labels.staleDataWarning}
                </p>
              )}
            </div>
          </div>
        </div>
      )}

      <section
        className={`relative overflow-hidden rounded-2xl border p-4 lg:p-5 ${
          isDark ? "border-gray-700 bg-gray-800" : "border-gray-200 bg-white"
        }`}
      >
        <div className="relative mt-1 flex flex-col gap-3 lg:flex-row lg:items-start">
          <div className={`rounded-xl border p-3 lg:flex-1 ${isDark ? "border-gray-700 bg-gray-900" : "border-gray-200 bg-gray-50"}`}>
            <p className={`text-[11px] uppercase tracking-[0.18em] ${isDark ? "text-cyan-300" : "text-sky-700"}`}>
              {labels.cardLabel}
            </p>

            <div className="mt-2 flex flex-col items-center gap-2.5 text-center">
              <div
                className={`h-32 w-32 overflow-hidden rounded-full ring-4 lg:h-36 lg:w-36 ${
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
                  <div className="flex h-full w-full items-center justify-center bg-[#0A2240] text-xl font-semibold text-white">
                    {profileInitials}
                  </div>
                )}
              </div>

              <div>
                <h2 className="text-lg font-semibold leading-tight lg:text-xl">
                  {profile?.client_name || labels.defaultName}
                </h2>
                <p className={`mt-1 text-sm ${isDark ? "text-gray-300" : "text-gray-600"}`}>
                  {profile?.email || labels.noEmail}
                </p>
              </div>
            </div>

            <div className="mt-3 grid gap-1.5 sm:grid-cols-2">
              <button
                type="button"
                onClick={triggerPhotoPicker}
                disabled={photoSaving || isOffline}
                className="inline-flex w-full items-center justify-center gap-1.5 rounded-lg bg-[#0A2240] px-2.5 py-1.5 text-[11px] text-white hover:bg-[#12305b] disabled:cursor-not-allowed disabled:opacity-60"
              >
                {photoSaving ? <Loader2 className="h-3.5 w-3.5 animate-spin" /> : <Upload className="h-3.5 w-3.5" />}
                {photoSaving ? labels.photoSaving : labels.uploadPhoto}
              </button>

              <button
                type="button"
                onClick={removePhoto}
                disabled={photoSaving || isOffline || !profile?.profile_photo}
                className={`inline-flex w-full items-center justify-center gap-1.5 rounded-lg border px-2.5 py-1.5 text-[11px] disabled:cursor-not-allowed disabled:opacity-60 ${
                  isDark
                    ? "border-gray-600 bg-gray-900 text-gray-100 hover:bg-gray-700"
                    : "border-gray-300 bg-white text-gray-700 hover:bg-gray-50"
                }`}
              >
                <Trash2 className="h-3.5 w-3.5" />
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

            <div className="mt-3 grid grid-cols-2 gap-1.5">
              <div className={`rounded-xl border p-2 ${isDark ? "border-gray-700 bg-gray-800" : "border-gray-200 bg-white"}`}>
                <p className={`text-[11px] ${isDark ? "text-gray-400" : "text-gray-500"}`}>
                  {labels.memberSince}
                </p>
                <p className="mt-0.5 text-sm font-semibold">{memberSince}</p>
              </div>
              <div className={`rounded-xl border p-2 ${isDark ? "border-gray-700 bg-gray-800" : "border-gray-200 bg-white"}`}>
                <p className={`text-[11px] ${isDark ? "text-gray-400" : "text-gray-500"}`}>{labels.statusLabel}</p>
                <p className="mt-0.5 text-sm font-semibold">{profile?.email_verified ? labels.verified : labels.notVerified}</p>
              </div>
            </div>
          </div>

          <div className={`rounded-xl border p-3 lg:flex-1 ${isDark ? "border-gray-700 bg-gray-900" : "border-gray-200 bg-gray-50"}`}>
            <div className="space-y-2">
              <div className={`rounded-xl border p-3 ${isDark ? "border-gray-700 bg-gray-800" : "border-gray-200 bg-white"}`}>
                <div className="flex items-center justify-between gap-3">
                  <div className="flex items-center gap-2">
                    <span className="inline-flex h-8 w-8 items-center justify-center rounded-full bg-sky-100 text-sky-700">
                      <Wallet className="h-4 w-4" />
                    </span>
                    <p className={`text-xs ${isDark ? "text-gray-400" : "text-gray-500"}`}>{labels.estimatedBalance}</p>
                  </div>
                  <p className="text-sm font-semibold tabular-nums">
                    {Number(indicators.estimated_balance || 0).toFixed(2)} TND
                  </p>
                </div>
              </div>

              <div className={`rounded-xl border p-3 ${isDark ? "border-gray-700 bg-gray-800" : "border-gray-200 bg-white"}`}>
                <div className="flex items-center justify-between gap-3">
                  <div className="flex items-center gap-2">
                    <span className="inline-flex h-8 w-8 items-center justify-center rounded-full bg-emerald-100 text-emerald-700">
                      <ShieldCheck className="h-4 w-4" />
                    </span>
                    <p className={`text-xs ${isDark ? "text-gray-400" : "text-gray-500"}`}>{labels.financialScore}</p>
                  </div>
                  <p className="text-sm font-semibold tabular-nums">{indicators.financial_score ?? "-"}</p>
                </div>
              </div>

              <div className={`rounded-xl border p-3 ${isDark ? "border-gray-700 bg-gray-800" : "border-gray-200 bg-white"}`}>
                <div className="flex items-center justify-between gap-3">
                  <div className="flex items-center gap-2">
                    <span className="inline-flex h-8 w-8 items-center justify-center rounded-full bg-indigo-100 text-indigo-700">
                      <UserRound className="h-4 w-4" />
                    </span>
                    <p className={`text-xs ${isDark ? "text-gray-400" : "text-gray-500"}`}>{labels.monthlySavings}</p>
                  </div>
                  <p className="text-sm font-semibold tabular-nums">
                    {Number(indicators.net_monthly_savings || 0).toFixed(2)} TND
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      <section className={`rounded-xl border p-5 ${isDark ? "border-gray-700 bg-gray-800" : "border-gray-200 bg-white"}`}>
        <div className="flex items-center justify-between gap-3">
          <div>
            <h2 className="text-lg font-semibold">{labels.enhancedFormTitle}</h2>
            <p className={`mt-1 text-sm ${isDark ? "text-gray-400" : "text-gray-600"}`}>
              {labels.enhancedFormSubtitle}
            </p>
            <p className={`mt-2 text-xs ${isDark ? "text-cyan-300" : "text-sky-700"}`}>
              {labels.editHint}
            </p>
          </div>
          <button
            type="button"
            onClick={enableFormEditing}
            disabled={saving}
            className={`inline-flex items-center gap-2 rounded-lg border px-4 py-2 text-sm disabled:cursor-not-allowed disabled:opacity-60 ${
              isDark
                ? "border-gray-600 bg-gray-900 text-gray-100 hover:bg-gray-700"
                : "border-gray-300 bg-white text-gray-700 hover:bg-gray-50"
            }`}
          >
            <Pencil className="h-4 w-4" />
            {labels.editForm}
          </button>
        </div>
      </section>

      {isFormModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
          <button
            type="button"
            aria-label={labels.closeForm}
            onClick={closeFormModal}
            className="absolute inset-0 bg-black/55"
          />

          <div
            className={`relative z-10 flex max-h-[88vh] w-full max-w-5xl flex-col overflow-hidden rounded-2xl border shadow-2xl ${
              isDark ? "border-gray-700 bg-gray-800 text-white" : "border-gray-200 bg-white text-gray-900"
            }`}
          >
            <div className={`flex items-start justify-between gap-3 border-b px-4 py-3 ${isDark ? "border-gray-700" : "border-gray-200"}`}>
              <div>
                <h2 className="text-lg font-semibold">{labels.enhancedFormTitle}</h2>
                <p className={`mt-1 text-sm ${isDark ? "text-gray-400" : "text-gray-600"}`}>
                  {labels.enhancedFormSubtitle}
                </p>
              </div>

              <button
                type="button"
                onClick={closeFormModal}
                disabled={saving}
                className={`inline-flex h-9 w-9 items-center justify-center rounded-lg border disabled:cursor-not-allowed disabled:opacity-60 ${
                  isDark
                    ? "border-gray-600 bg-gray-900 text-gray-100 hover:bg-gray-700"
                    : "border-gray-300 bg-white text-gray-700 hover:bg-gray-50"
                }`}
                aria-label={labels.closeForm}
              >
                <X className="h-4 w-4" />
              </button>
            </div>

            <div className="overflow-y-auto p-4">
              {(formModalError || Object.keys(formFieldErrors).length > 0) && (
                <div
                  className={`mb-4 rounded-lg border px-3 py-2 text-sm ${
                    isDark
                      ? "border-red-800 bg-red-950/30 text-red-300"
                      : "border-red-200 bg-red-50 text-red-700"
                  }`}
                >
                  <p>{formModalError || labels.validationSummary}</p>
                </div>
              )}

              {schemaFields.length === 0 ? (
                <p className={isDark ? "text-gray-400" : "text-gray-600"}>{labels.noSchema}</p>
              ) : (
                <div className="grid gap-4 md:grid-cols-2">
                  {schemaFields.map((field) => (
                    <div key={field.field_id} className="space-y-1.5">
                      {(() => {
                        const hasError = Boolean(formFieldErrors[field.field_id]);
                        return (
                          <>
                      <label className={`text-sm font-medium ${isDark ? "text-gray-200" : "text-gray-700"}`}>
                        {fieldLabel(field.field_id)}
                      </label>

                      {field.type === "select" && (
                        <select
                          value={formValues[field.field_id] ?? ""}
                          onChange={(event) => updateField(field.field_id, event.target.value)}
                          disabled={!isFormEditing || isOffline}
                          className={`w-full rounded-lg border px-3 py-2 ${
                            hasError
                              ? isDark
                                ? "border-red-500 bg-gray-700"
                                : "border-red-500 bg-white"
                              : isDark
                                ? "border-gray-600 bg-gray-700"
                                : "border-gray-300 bg-white"
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

                      {field.type === "boolean" && (
                        <select
                          value={formValues[field.field_id] ?? ""}
                          onChange={(event) => updateField(field.field_id, event.target.value)}
                          disabled={!isFormEditing || isOffline}
                          className={`w-full rounded-lg border px-3 py-2 ${
                            hasError
                              ? isDark
                                ? "border-red-500 bg-gray-700"
                                : "border-red-500 bg-white"
                              : isDark
                                ? "border-gray-600 bg-gray-700"
                                : "border-gray-300 bg-white"
                          }`}
                        >
                          <option value="">-- select --</option>
                          {BOOLEAN_SELECT_OPTIONS.map((option) => (
                            <option key={option.value} value={option.value}>
                              {option.label}
                            </option>
                          ))}
                        </select>
                      )}

                      {field.type === "multi-select" && (
                        <div
                          className={`rounded-lg border p-2 ${
                            hasError
                              ? isDark
                                ? "border-red-500 bg-gray-700"
                                : "border-red-500 bg-white"
                              : isDark
                                ? "border-gray-600 bg-gray-700"
                                : "border-gray-300 bg-white"
                          }`}
                        >
                          <div className="max-h-32 space-y-1 overflow-auto">
                            {(field.options || []).map((option) => {
                              const checked = toArray(formValues[field.field_id]).includes(option);
                              return (
                                <label key={option} className="flex items-center gap-2 text-sm">
                                  <input
                                    type="checkbox"
                                    checked={checked}
                                    disabled={!isFormEditing || isOffline}
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
                          disabled={!isFormEditing || isOffline}
                          className={`w-full rounded-lg border px-3 py-2 ${
                            hasError
                              ? isDark
                                ? "border-red-500 bg-gray-700"
                                : "border-red-500 bg-white"
                              : isDark
                                ? "border-gray-600 bg-gray-700"
                                : "border-gray-300 bg-white"
                          }`}
                        />
                      )}

                      {field.type !== "select" && field.type !== "multi-select" && field.type !== "number" && field.type !== "boolean" && (
                        <input
                          value={formValues[field.field_id] ?? ""}
                          onChange={(event) => updateField(field.field_id, event.target.value)}
                          disabled={!isFormEditing || isOffline}
                          className={`w-full rounded-lg border px-3 py-2 ${
                            hasError
                              ? isDark
                                ? "border-red-500 bg-gray-700"
                                : "border-red-500 bg-white"
                              : isDark
                                ? "border-gray-600 bg-gray-700"
                                : "border-gray-300 bg-white"
                          }`}
                        />
                      )}

                      {hasError && (
                        <p className={`text-xs ${isDark ? "text-red-300" : "text-red-600"}`}>
                          {formFieldErrors[field.field_id]}
                        </p>
                      )}
                          </>
                        );
                      })()}
                    </div>
                  ))}
                </div>
              )}
            </div>

            <div className={`flex items-center justify-end gap-2 border-t px-4 py-3 ${isDark ? "border-gray-700" : "border-gray-200"}`}>
              <button
                type="button"
                onClick={closeFormModal}
                disabled={saving}
                className={`inline-flex items-center gap-2 rounded-lg border px-4 py-2 text-sm disabled:cursor-not-allowed disabled:opacity-60 ${
                  isDark
                    ? "border-gray-600 bg-gray-900 text-gray-100 hover:bg-gray-700"
                    : "border-gray-300 bg-white text-gray-700 hover:bg-gray-50"
                }`}
              >
                {labels.closeForm}
              </button>
              <button
                type="button"
                onClick={saveForm}
                disabled={saving || isOffline || !isFormEditing}
                className="inline-flex items-center gap-2 rounded-lg bg-[#0A2240] px-4 py-2 text-white hover:bg-[#12305b] disabled:opacity-60"
              >
                <Save className="h-4 w-4" />
                {saving ? labels.savingForm : labels.saveForm}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
