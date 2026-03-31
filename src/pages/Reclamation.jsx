import { useMemo, useState } from "react";
import {
  AlertCircle,
  CheckCircle,
  Clock,
  FileText,
  Plus,
  Search,
  XCircle,
} from "lucide-react";
import { useTheme } from "../contexts/ThemeContext";
import { useLanguage } from "../contexts/LanguageContext";

const categoryLabels = {
  billing: { en: "Billing", fr: "Facturation", ar: "الفوترة" },
  card: { en: "Card", fr: "Carte", ar: "البطاقة" },
  transfer: { en: "Transfer", fr: "Transfert", ar: "التحويل" },
  account: { en: "Account", fr: "Compte", ar: "الحساب" },
  general: { en: "General", fr: "Général", ar: "عام" },
};

const uiByLanguage = {
  en: {
    title: "Claims Management",
    subtitle: "Submit and track your claims in real-time",
    searchPlaceholder: "Search by ID or subject",
    actions: {
      newClaim: "New Claim",
      hideForm: "Hide Form",
      submit: "Submit",
      cancel: "Cancel",
    },
    form: {
      title: "Create a New Claim",
      subject: "Subject",
      subjectPlaceholder: "Describe the issue briefly",
      category: "Category",
      description: "Description",
      descriptionPlaceholder: "Give us full details to speed up processing",
      statusFilter: "Filter by status",
      allStatuses: "All statuses",
    },
    table: {
      claimId: "ID",
      subject: "Subject",
      category: "Category",
      status: "Status",
      date: "Date",
      lastUpdate: "Last Update",
      empty: "No claims found with the current filters.",
    },
    details: {
      title: "Claim Details",
      noSelection: "Select a claim to display all details.",
      description: "Description",
      timeline: "Timeline",
      createdOn: "Created on",
      updatedOn: "Last update",
    },
    feedback: {
      created: "Claim submitted successfully.",
    },
    validation: {
      subjectRequired: "Subject is required.",
      descriptionMin: "Description must contain at least 10 characters.",
    },
    statuses: {
      pending: "Pending",
      "in-progress": "In Progress",
      resolved: "Resolved",
      rejected: "Rejected",
    },
  },
  fr: {
    title: "Gestion des réclamations",
    subtitle: "Soumettez et suivez vos réclamations en temps réel",
    searchPlaceholder: "Rechercher par ID ou objet",
    actions: {
      newClaim: "Nouvelle réclamation",
      hideForm: "Masquer le formulaire",
      submit: "Soumettre",
      cancel: "Annuler",
    },
    form: {
      title: "Créer une nouvelle réclamation",
      subject: "Objet",
      subjectPlaceholder: "Décrivez brièvement le problème",
      category: "Catégorie",
      description: "Description",
      descriptionPlaceholder:
        "Ajoutez le maximum de détails pour accélérer le traitement",
      statusFilter: "Filtrer par statut",
      allStatuses: "Tous les statuts",
    },
    table: {
      claimId: "ID",
      subject: "Objet",
      category: "Catégorie",
      status: "Statut",
      date: "Date",
      lastUpdate: "Dernière MAJ",
      empty: "Aucune réclamation ne correspond aux filtres actuels.",
    },
    details: {
      title: "Détails de la réclamation",
      noSelection: "Sélectionnez une réclamation pour afficher les détails.",
      description: "Description",
      timeline: "Chronologie",
      createdOn: "Créée le",
      updatedOn: "Dernière mise à jour",
    },
    feedback: {
      created: "Réclamation soumise avec succès.",
    },
    validation: {
      subjectRequired: "L'objet est obligatoire.",
      descriptionMin:
        "La description doit contenir au moins 10 caractères.",
    },
    statuses: {
      pending: "En attente",
      "in-progress": "En cours",
      resolved: "Résolue",
      rejected: "Rejetée",
    },
  },
  ar: {
    title: "إدارة الشكاوى",
    subtitle: "قدّم شكواك وتابع حالتها بشكل فوري",
    searchPlaceholder: "ابحث برقم الشكوى أو الموضوع",
    actions: {
      newClaim: "شكوى جديدة",
      hideForm: "إخفاء النموذج",
      submit: "إرسال",
      cancel: "إلغاء",
    },
    form: {
      title: "إنشاء شكوى جديدة",
      subject: "الموضوع",
      subjectPlaceholder: "اكتب وصفًا مختصرًا للمشكلة",
      category: "الفئة",
      description: "الوصف",
      descriptionPlaceholder: "أضف تفاصيل كافية لتسريع المعالجة",
      statusFilter: "التصفية حسب الحالة",
      allStatuses: "كل الحالات",
    },
    table: {
      claimId: "الرقم",
      subject: "الموضوع",
      category: "الفئة",
      status: "الحالة",
      date: "التاريخ",
      lastUpdate: "آخر تحديث",
      empty: "لا توجد شكاوى مطابقة للتصفية الحالية.",
    },
    details: {
      title: "تفاصيل الشكوى",
      noSelection: "اختر شكوى لعرض جميع التفاصيل.",
      description: "الوصف",
      timeline: "التسلسل الزمني",
      createdOn: "تاريخ الإنشاء",
      updatedOn: "آخر تحديث",
    },
    feedback: {
      created: "تم إرسال الشكوى بنجاح.",
    },
    validation: {
      subjectRequired: "الموضوع مطلوب.",
      descriptionMin: "يجب أن يحتوي الوصف على 10 أحرف على الأقل.",
    },
    statuses: {
      pending: "قيد الانتظار",
      "in-progress": "قيد المعالجة",
      resolved: "تمت المعالجة",
      rejected: "مرفوضة",
    },
  },
};

const existingClaims = [
  {
    id: "CLM-2026-001",
    subject: {
      fr: "Frais bancaires incorrects",
      en: "Incorrect bank fees",
      ar: "رسوم بنكية غير صحيحة",
    },
    categoryKey: "billing",
    status: "in-progress",
    date: "2026-03-10",
    lastUpdate: "2026-03-13",
    description: {
      fr: "Des frais de 25 TND ont été prélevés à tort sur mon compte.",
      en: "A 25 TND fee was incorrectly charged to my account.",
      ar: "تم خصم رسوم بقيمة 25 د.ت من حسابي بالخطأ.",
    },
  },
  {
    id: "CLM-2026-002",
    subject: {
      fr: "Problème de carte bancaire",
      en: "Bank card issue",
      ar: "مشكلة في البطاقة البنكية",
    },
    categoryKey: "card",
    status: "resolved",
    date: "2026-03-05",
    lastUpdate: "2026-03-08",
    description: {
      fr: "Ma carte a été bloquée sans raison.",
      en: "My card was blocked without reason.",
      ar: "تم حظر بطاقتي دون سبب واضح.",
    },
  },
  {
    id: "CLM-2026-003",
    subject: {
      fr: "Virement non reçu",
      en: "Transfer not received",
      ar: "تحويل لم يصل",
    },
    categoryKey: "transfer",
    status: "rejected",
    date: "2026-02-28",
    lastUpdate: "2026-03-02",
    description: {
      fr: "Le virement de 500 TND n'est pas arrivé.",
      en: "The 500 TND transfer did not arrive.",
      ar: "التحويل بقيمة 500 د.ت لم يصل حتى الآن.",
    },
  },
  {
    id: "CLM-2026-004",
    subject: {
      fr: "Demande d'informations",
      en: "Information request",
      ar: "طلب معلومات",
    },
    categoryKey: "general",
    status: "pending",
    date: "2026-03-14",
    lastUpdate: "2026-03-14",
    description: {
      fr: "Je souhaite obtenir un relevé détaillé.",
      en: "I would like to get a detailed statement.",
      ar: "أرغب في الحصول على كشف حساب مفصل.",
    },
  },
];

const getLangKey = (language) => {
  if (language === "ar") {
    return "ar";
  }
  if (language === "fr") {
    return "fr";
  }
  return "en";
};

const getDateLocale = (langKey) => {
  if (langKey === "ar") {
    return "ar-TN";
  }
  if (langKey === "fr") {
    return "fr-FR";
  }
  return "en-US";
};

const getLocalizedValue = (valueByLanguage, langKey) => {
  return valueByLanguage?.[langKey] || valueByLanguage?.en || "";
};

export function Reclamation() {
  const { theme } = useTheme();
  const { language, isRTL } = useLanguage();
  const langKey = getLangKey(language);
  const ui = uiByLanguage[langKey] || uiByLanguage.en;

  const [claims, setClaims] = useState(existingClaims);
  const [showForm, setShowForm] = useState(false);
  const [selectedClaimId, setSelectedClaimId] = useState(existingClaims[0]?.id);
  const [searchTerm, setSearchTerm] = useState("");
  const [statusFilter, setStatusFilter] = useState("all");
  const [feedback, setFeedback] = useState("");
  const [newClaim, setNewClaim] = useState({
    subject: "",
    categoryKey: "billing",
    description: "",
  });
  const [errors, setErrors] = useState({ subject: "", description: "" });

  const statusCards = [
    { key: "pending", icon: Clock, iconClass: "text-yellow-500" },
    { key: "in-progress", icon: AlertCircle, iconClass: "text-blue-500" },
    { key: "resolved", icon: CheckCircle, iconClass: "text-green-500" },
    { key: "rejected", icon: XCircle, iconClass: "text-red-500" },
  ];

  const statusOptions = ["all", "pending", "in-progress", "resolved", "rejected"];

  const statusStats = useMemo(() => {
    return {
      pending: claims.filter((claim) => claim.status === "pending").length,
      inProgress: claims.filter((claim) => claim.status === "in-progress").length,
      resolved: claims.filter((claim) => claim.status === "resolved").length,
      rejected: claims.filter((claim) => claim.status === "rejected").length,
    };
  }, [claims]);

  const filteredClaims = useMemo(() => {
    const normalizedSearch = searchTerm.trim().toLowerCase();

    return claims
      .filter((claim) => {
        const matchesStatus =
          statusFilter === "all" || claim.status === statusFilter;

        const localizedSubject = getLocalizedValue(claim.subject, langKey)
          .trim()
          .toLowerCase();
        const matchesSearch =
          normalizedSearch.length === 0 ||
          claim.id.toLowerCase().includes(normalizedSearch) ||
          localizedSubject.includes(normalizedSearch);

        return matchesStatus && matchesSearch;
      })
      .sort((a, b) => new Date(b.date) - new Date(a.date));
  }, [claims, langKey, searchTerm, statusFilter]);

  const selectedClaim = useMemo(() => {
    return claims.find((claim) => claim.id === selectedClaimId) || null;
  }, [claims, selectedClaimId]);

  const getStatusColor = (status) => {
    switch (status) {
      case "pending":
        return theme === "dark"
          ? "bg-yellow-900/30 text-yellow-400"
          : "bg-yellow-100 text-yellow-700";
      case "in-progress":
        return theme === "dark"
          ? "bg-blue-900/30 text-blue-400"
          : "bg-blue-100 text-blue-700";
      case "resolved":
        return theme === "dark"
          ? "bg-green-900/30 text-green-400"
          : "bg-green-100 text-green-700";
      case "rejected":
        return theme === "dark"
          ? "bg-red-900/30 text-red-400"
          : "bg-red-100 text-red-700";
      default:
        return theme === "dark"
          ? "bg-gray-700 text-gray-300"
          : "bg-gray-100 text-gray-700";
    }
  };

  const getStatusIcon = (status) => {
    switch (status) {
      case "pending":
        return <Clock className="w-4 h-4" />;
      case "in-progress":
        return <AlertCircle className="w-4 h-4" />;
      case "resolved":
        return <CheckCircle className="w-4 h-4" />;
      case "rejected":
        return <XCircle className="w-4 h-4" />;
      default:
        return <FileText className="w-4 h-4" />;
    }
  };

  const getStatusLabel = (status) => {
    return ui.statuses[status] || status;
  };

  const getCategoryLabel = (categoryKey) => {
    return (
      categoryLabels[categoryKey]?.[langKey] ||
      categoryLabels.general[langKey] ||
      categoryKey
    );
  };

  const formatDate = (dateValue) => {
    const parsedDate = new Date(dateValue);
    if (Number.isNaN(parsedDate.getTime())) {
      return dateValue;
    }
    return parsedDate.toLocaleDateString(getDateLocale(langKey));
  };

  const updateNewClaim = (field, value) => {
    setNewClaim((prev) => ({ ...prev, [field]: value }));
    if (errors[field]) {
      setErrors((prev) => ({ ...prev, [field]: "" }));
    }
  };

  const handleSubmit = (event) => {
    event.preventDefault();

    const subject = newClaim.subject.trim();
    const description = newClaim.description.trim();
    const nextErrors = { subject: "", description: "" };

    if (!subject) {
      nextErrors.subject = ui.validation.subjectRequired;
    }
    if (description.length < 10) {
      nextErrors.description = ui.validation.descriptionMin;
    }

    setErrors(nextErrors);

    if (nextErrors.subject || nextErrors.description) {
      return;
    }

    const maxExistingId = claims.reduce((max, claim) => {
      const idParts = claim.id.split("-");
      const lastPart = Number(idParts[idParts.length - 1]);
      if (Number.isFinite(lastPart)) {
        return Math.max(max, lastPart);
      }
      return max;
    }, 0);

    const today = new Date().toISOString().split("T")[0];
    const claimId = `CLM-${new Date().getFullYear()}-${String(maxExistingId + 1).padStart(3, "0")}`;

    const claimPayload = {
      id: claimId,
      subject: { en: subject, fr: subject, ar: subject },
      categoryKey: newClaim.categoryKey,
      status: "pending",
      date: today,
      lastUpdate: today,
      description: { en: description, fr: description, ar: description },
    };

    setClaims((prev) => [claimPayload, ...prev]);
    setSelectedClaimId(claimId);
    setFeedback(ui.feedback.created);
    setShowForm(false);
    setErrors({ subject: "", description: "" });
    setNewClaim({ subject: "", categoryKey: "billing", description: "" });
  };

  const handleCancelForm = () => {
    setShowForm(false);
    setErrors({ subject: "", description: "" });
    setNewClaim({ subject: "", categoryKey: "billing", description: "" });
  };

  const containerBgClass = theme === "dark" ? "bg-gray-900" : "bg-gray-50";
  const cardClass =
    theme === "dark"
      ? "bg-gray-800 border-gray-700"
      : "bg-white border-gray-200";
  const inputClass =
    theme === "dark"
      ? "bg-gray-700 border-gray-600 text-white"
      : "bg-gray-50 border-gray-300 text-gray-900";
  const textMainClass = theme === "dark" ? "text-white" : "text-gray-900";
  const textMutedClass = theme === "dark" ? "text-gray-400" : "text-gray-600";

  return (
    <div className={`p-4 lg:p-8 space-y-6 ${containerBgClass}`}>
      <div
        className={`flex flex-col gap-4 md:items-center md:justify-between ${
          isRTL ? "md:flex-row-reverse" : "md:flex-row"
        }`}
      >
        <div className={isRTL ? "text-right" : "text-left"}>
          <h1 className={`text-2xl font-semibold mb-2 ${textMainClass}`}>
            {ui.title}
          </h1>
          <p className={textMutedClass}>{ui.subtitle}</p>
        </div>

        <button
          onClick={() => {
            setShowForm((prev) => !prev);
            setFeedback("");
          }}
          className={`inline-flex items-center gap-2 px-4 py-2 bg-[#242f54] text-white rounded-lg hover:bg-[#1a2340] transition-colors ${
            isRTL ? "flex-row-reverse" : ""
          }`}
        >
          <Plus className="w-5 h-5" />
          <span>{showForm ? ui.actions.hideForm : ui.actions.newClaim}</span>
        </button>
      </div>

      <div
        className={`grid grid-cols-1 md:grid-cols-3 gap-3 ${
          isRTL ? "text-right" : "text-left"
        }`}
      >
        <div className="relative md:col-span-2">
          <Search
            className={`absolute top-1/2 -translate-y-1/2 w-4 h-4 ${
              isRTL ? "right-3" : "left-3"
            } ${textMutedClass}`}
          />
          <input
            type="text"
            value={searchTerm}
            onChange={(event) => setSearchTerm(event.target.value)}
            placeholder={ui.searchPlaceholder}
            className={`w-full py-3 border rounded-lg focus:outline-none focus:ring-2 focus:ring-[#242f54] ${inputClass} ${
              isRTL ? "pr-10 text-right" : "pl-10 text-left"
            }`}
          />
        </div>

        <select
          value={statusFilter}
          onChange={(event) => setStatusFilter(event.target.value)}
          aria-label={ui.form.statusFilter}
          className={`w-full px-4 py-3 border rounded-lg focus:outline-none focus:ring-2 focus:ring-[#242f54] ${inputClass} ${
            isRTL ? "text-right" : "text-left"
          }`}
        >
          {statusOptions.map((statusValue) => (
            <option key={statusValue} value={statusValue}>
              {statusValue === "all"
                ? ui.form.allStatuses
                : getStatusLabel(statusValue)}
            </option>
          ))}
        </select>
      </div>

      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        {statusCards.map(({ key, icon: Icon, iconClass }) => {
          const total =
            key === "in-progress" ? statusStats.inProgress : statusStats[key];

          return (
            <div key={key} className={`${cardClass} border rounded-xl p-4`}>
              <div
                className={`flex items-center justify-between mb-2 ${
                  isRTL ? "flex-row-reverse" : ""
                }`}
              >
                <Icon className={`w-5 h-5 ${iconClass}`} />
                <span className={`text-2xl font-bold ${textMainClass}`}>{total}</span>
              </div>
              <p className={`text-sm ${textMutedClass}`}>{getStatusLabel(key)}</p>
            </div>
          );
        })}
      </div>

      {feedback && (
        <div
          className={`px-4 py-3 rounded-lg border ${
            theme === "dark"
              ? "bg-green-900/20 border-green-800 text-green-300"
              : "bg-green-50 border-green-200 text-green-700"
          } ${isRTL ? "text-right" : "text-left"}`}
        >
          {feedback}
        </div>
      )}

      {showForm && (
        <div className={`${cardClass} border rounded-xl p-6`}>
          <h2
            className={`text-lg font-semibold mb-4 ${textMainClass} ${
              isRTL ? "text-right" : "text-left"
            }`}
          >
            {ui.form.title}
          </h2>

          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label
                className={`block text-sm font-medium mb-2 ${
                  theme === "dark" ? "text-gray-300" : "text-gray-700"
                } ${isRTL ? "text-right" : "text-left"}`}
              >
                {ui.form.subject}
              </label>
              <input
                type="text"
                value={newClaim.subject}
                onChange={(event) => updateNewClaim("subject", event.target.value)}
                placeholder={ui.form.subjectPlaceholder}
                className={`w-full px-4 py-3 border rounded-lg focus:outline-none focus:ring-2 focus:ring-[#242f54] ${inputClass} ${
                  isRTL ? "text-right" : "text-left"
                } ${errors.subject ? "border-red-500" : ""}`}
                required
              />
              {errors.subject && (
                <p className="text-red-500 text-sm mt-2">{errors.subject}</p>
              )}
            </div>

            <div>
              <label
                className={`block text-sm font-medium mb-2 ${
                  theme === "dark" ? "text-gray-300" : "text-gray-700"
                } ${isRTL ? "text-right" : "text-left"}`}
              >
                {ui.form.category}
              </label>
              <select
                value={newClaim.categoryKey}
                onChange={(event) =>
                  updateNewClaim("categoryKey", event.target.value)
                }
                className={`w-full px-4 py-3 border rounded-lg focus:outline-none focus:ring-2 focus:ring-[#242f54] ${inputClass} ${
                  isRTL ? "text-right" : "text-left"
                }`}
              >
                {Object.keys(categoryLabels).map((key) => (
                  <option key={key} value={key}>
                    {getCategoryLabel(key)}
                  </option>
                ))}
              </select>
            </div>

            <div>
              <label
                className={`block text-sm font-medium mb-2 ${
                  theme === "dark" ? "text-gray-300" : "text-gray-700"
                } ${isRTL ? "text-right" : "text-left"}`}
              >
                {ui.form.description}
              </label>
              <textarea
                value={newClaim.description}
                onChange={(event) =>
                  updateNewClaim("description", event.target.value)
                }
                rows={4}
                placeholder={ui.form.descriptionPlaceholder}
                className={`w-full px-4 py-3 border rounded-lg focus:outline-none focus:ring-2 focus:ring-[#242f54] ${inputClass} ${
                  isRTL ? "text-right" : "text-left"
                } ${errors.description ? "border-red-500" : ""}`}
                required
              />
              {errors.description && (
                <p className="text-red-500 text-sm mt-2">{errors.description}</p>
              )}
            </div>

            <div
              className={`flex items-center gap-3 justify-end ${
                isRTL ? "flex-row-reverse" : ""
              }`}
            >
              <button
                type="button"
                onClick={handleCancelForm}
                className={`px-6 py-2 border rounded-lg transition-colors ${
                  theme === "dark"
                    ? "border-gray-600 text-gray-300 hover:bg-gray-700"
                    : "border-gray-300 text-gray-700 hover:bg-gray-50"
                }`}
              >
                {ui.actions.cancel}
              </button>
              <button
                type="submit"
                className="px-6 py-2 bg-[#242f54] text-white rounded-lg hover:bg-[#1a2340] transition-colors"
              >
                {ui.actions.submit}
              </button>
            </div>
          </form>
        </div>
      )}

      <div className="grid grid-cols-1 xl:grid-cols-3 gap-6">
        <div className={`${cardClass} border rounded-xl overflow-hidden xl:col-span-2`}>
          <div className="overflow-x-auto">
            <table className="w-full min-w-[700px]">
              <thead className={theme === "dark" ? "bg-gray-700" : "bg-gray-50"}>
                <tr>
                  <th
                    className={`px-6 py-4 text-sm font-medium ${
                      theme === "dark" ? "text-gray-300" : "text-gray-700"
                    } ${isRTL ? "text-right" : "text-left"}`}
                  >
                    {ui.table.claimId}
                  </th>
                  <th
                    className={`px-6 py-4 text-sm font-medium ${
                      theme === "dark" ? "text-gray-300" : "text-gray-700"
                    } ${isRTL ? "text-right" : "text-left"}`}
                  >
                    {ui.table.subject}
                  </th>
                  <th
                    className={`px-6 py-4 text-sm font-medium ${
                      theme === "dark" ? "text-gray-300" : "text-gray-700"
                    } ${isRTL ? "text-right" : "text-left"}`}
                  >
                    {ui.table.category}
                  </th>
                  <th
                    className={`px-6 py-4 text-sm font-medium ${
                      theme === "dark" ? "text-gray-300" : "text-gray-700"
                    } ${isRTL ? "text-right" : "text-left"}`}
                  >
                    {ui.table.status}
                  </th>
                  <th
                    className={`px-6 py-4 text-sm font-medium ${
                      theme === "dark" ? "text-gray-300" : "text-gray-700"
                    } ${isRTL ? "text-right" : "text-left"}`}
                  >
                    {ui.table.date}
                  </th>
                  <th
                    className={`px-6 py-4 text-sm font-medium ${
                      theme === "dark" ? "text-gray-300" : "text-gray-700"
                    } ${isRTL ? "text-right" : "text-left"}`}
                  >
                    {ui.table.lastUpdate}
                  </th>
                </tr>
              </thead>

              <tbody
                className={
                  theme === "dark"
                    ? "divide-y divide-gray-700"
                    : "divide-y divide-gray-200"
                }
              >
                {filteredClaims.length === 0 && (
                  <tr>
                    <td
                      colSpan={6}
                      className={`px-6 py-12 ${textMutedClass} ${
                        isRTL ? "text-right" : "text-left"
                      }`}
                    >
                      {ui.table.empty}
                    </td>
                  </tr>
                )}

                {filteredClaims.map((claim) => {
                  const isSelected = selectedClaimId === claim.id;
                  return (
                    <tr
                      key={claim.id}
                      onClick={() => setSelectedClaimId(claim.id)}
                      className={`transition-colors cursor-pointer ${
                        theme === "dark" ? "hover:bg-gray-700" : "hover:bg-gray-50"
                      } ${
                        isSelected
                          ? theme === "dark"
                            ? "bg-[#242f54]/35"
                            : "bg-blue-50"
                          : ""
                      }`}
                    >
                      <td
                        className={`px-6 py-4 font-mono text-sm ${
                          theme === "dark" ? "text-gray-300" : "text-gray-900"
                        } ${isRTL ? "text-right" : "text-left"}`}
                      >
                        {claim.id}
                      </td>
                      <td
                        className={`px-6 py-4 font-medium ${textMainClass} ${
                          isRTL ? "text-right" : "text-left"
                        }`}
                      >
                        {getLocalizedValue(claim.subject, langKey)}
                      </td>
                      <td
                        className={`px-6 py-4 text-sm ${textMutedClass} ${
                          isRTL ? "text-right" : "text-left"
                        }`}
                      >
                        {getCategoryLabel(claim.categoryKey)}
                      </td>
                      <td className={`px-6 py-4 ${isRTL ? "text-right" : "text-left"}`}>
                        <span
                          className={`inline-flex items-center gap-1 px-3 py-1 rounded-full text-xs font-medium ${getStatusColor(
                            claim.status,
                          )} ${isRTL ? "flex-row-reverse" : ""}`}
                        >
                          {getStatusIcon(claim.status)}
                          <span>{getStatusLabel(claim.status)}</span>
                        </span>
                      </td>
                      <td
                        className={`px-6 py-4 text-sm ${textMutedClass} ${
                          isRTL ? "text-right" : "text-left"
                        }`}
                      >
                        {formatDate(claim.date)}
                      </td>
                      <td
                        className={`px-6 py-4 text-sm ${textMutedClass} ${
                          isRTL ? "text-right" : "text-left"
                        }`}
                      >
                        {formatDate(claim.lastUpdate)}
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        </div>

        <div className={`${cardClass} border rounded-xl p-6`}>
          <h2
            className={`text-lg font-semibold mb-4 ${textMainClass} ${
              isRTL ? "text-right" : "text-left"
            }`}
          >
            {ui.details.title}
          </h2>

          {!selectedClaim && <p className={textMutedClass}>{ui.details.noSelection}</p>}

          {selectedClaim && (
            <div className={`space-y-5 ${isRTL ? "text-right" : "text-left"}`}>
              <div>
                <p className={`text-xs uppercase tracking-wide mb-1 ${textMutedClass}`}>
                  {ui.table.subject}
                </p>
                <p className={`text-base font-semibold ${textMainClass}`}>
                  {getLocalizedValue(selectedClaim.subject, langKey)}
                </p>
              </div>

              <div>
                <p className={`text-xs uppercase tracking-wide mb-1 ${textMutedClass}`}>
                  {ui.details.description}
                </p>
                <p className={textMainClass}>
                  {getLocalizedValue(selectedClaim.description, langKey)}
                </p>
              </div>

              <div
                className={`rounded-lg border p-4 space-y-3 ${
                  theme === "dark"
                    ? "border-gray-700 bg-gray-900/30"
                    : "border-gray-200 bg-gray-50"
                }`}
              >
                <h3 className={`text-sm font-semibold ${textMainClass}`}>
                  {ui.details.timeline}
                </h3>

                <div
                  className={`flex items-center justify-between gap-3 ${
                    isRTL ? "flex-row-reverse" : ""
                  }`}
                >
                  <span className={`text-sm ${textMutedClass}`}>{ui.table.claimId}</span>
                  <span className={`text-sm font-mono ${textMainClass}`}>
                    {selectedClaim.id}
                  </span>
                </div>

                <div
                  className={`flex items-center justify-between gap-3 ${
                    isRTL ? "flex-row-reverse" : ""
                  }`}
                >
                  <span className={`text-sm ${textMutedClass}`}>{ui.table.category}</span>
                  <span className={`text-sm ${textMainClass}`}>
                    {getCategoryLabel(selectedClaim.categoryKey)}
                  </span>
                </div>

                <div
                  className={`flex items-center justify-between gap-3 ${
                    isRTL ? "flex-row-reverse" : ""
                  }`}
                >
                  <span className={`text-sm ${textMutedClass}`}>{ui.table.status}</span>
                  <span
                    className={`inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-xs font-medium ${getStatusColor(
                      selectedClaim.status,
                    )} ${isRTL ? "flex-row-reverse" : ""}`}
                  >
                    {getStatusIcon(selectedClaim.status)}
                    <span>{getStatusLabel(selectedClaim.status)}</span>
                  </span>
                </div>

                <div
                  className={`flex items-center justify-between gap-3 ${
                    isRTL ? "flex-row-reverse" : ""
                  }`}
                >
                  <span className={`text-sm ${textMutedClass}`}>
                    {ui.details.createdOn}
                  </span>
                  <span className={`text-sm ${textMainClass}`}>
                    {formatDate(selectedClaim.date)}
                  </span>
                </div>

                <div
                  className={`flex items-center justify-between gap-3 ${
                    isRTL ? "flex-row-reverse" : ""
                  }`}
                >
                  <span className={`text-sm ${textMutedClass}`}>
                    {ui.details.updatedOn}
                  </span>
                  <span className={`text-sm ${textMainClass}`}>
                    {formatDate(selectedClaim.lastUpdate)}
                  </span>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
