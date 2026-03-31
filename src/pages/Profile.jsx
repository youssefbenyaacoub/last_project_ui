import { useMemo, useState } from "react";
import {
  Camera,
  User,
  Briefcase,
  Home,
  Car,
  Users,
  Baby,
  FileText,
  Edit2,
  Save,
  X,
  Calendar,
  Wallet,
  Target,
} from "lucide-react";
import { useTheme } from "../contexts/ThemeContext";
import { useLanguage } from "../contexts/LanguageContext";
import profileImage from "../assets/man_pfp.png";

const initialPersonalData = {
  firstName: "Martin",
  lastName: "Bratik",
  email: "martin.bratik@gmail.com",
  phone: "+216 99 123 456",
  address: "123 Main Street",
  city: "Tunis",
  zipCode: "1001",
  country: "Tunisia",
};

const initialEnrichmentData = {
  occupation: "employed",
  housing: "renter",
  hasVehicle: "yes-owned",
  maritalStatus: "single",
  hasChildren: "no",
  numberOfChildren: "0",
  age: "26-35",
  monthlyIncome: "2500-5000",
  financialGoals: ["save", "invest"],
  riskTolerance: "moderate",
};

const uiByLanguage = {
  en: {
    subtitle: "Manage your personal information and complete your profile",
    premiumClient: "Premium Client",
    verified: "Verified",
    edit: "Edit",
    save: "Save",
    cancel: "Cancel",
    savedSuccess: "Profile saved successfully",
    changesDiscarded: "Changes discarded",
    personalTab: "Personal Information",
    enrichmentTab: "Enhanced Profile",
    enrichmentHint:
      "This information helps us personalize your recommendations and propose products that fit your profile.",
    employmentStatus: "Employment Status",
    housing: "Housing",
    vehicle: "Vehicle",
    maritalStatus: "Marital Status",
    children: "Children",
    numberOfChildren: "Number of children",
    riskTolerance: "Risk tolerance",
    ageRange: "Age range",
    monthlyIncome: "Monthly income",
    financialGoals: "Financial goals",
    employed: "Employed",
    selfEmployed: "Self-employed",
    student: "Student",
    retired: "Retired",
    owner: "Owner",
    renter: "Renter",
    family: "Living with family",
    yesOwned: "Yes, owned",
    yesFinanced: "Yes, financed",
    no: "No",
    yes: "Yes",
    single: "Single",
    married: "Married",
    divorced: "Divorced",
    conservative: "Conservative",
    moderate: "Moderate",
    aggressive: "Aggressive",
    goalSave: "Save money",
    goalInvest: "Invest",
    goalBuyHome: "Buy a home",
    goalTravel: "Travel",
    goalEducation: "Education planning",
  },
  fr: {
    subtitle: "Gerez vos informations personnelles et completez votre profil",
    premiumClient: "Client Premium",
    verified: "Verifie",
    edit: "Modifier",
    save: "Enregistrer",
    cancel: "Annuler",
    savedSuccess: "Profil enregistre avec succes",
    changesDiscarded: "Modifications annulees",
    personalTab: "Informations personnelles",
    enrichmentTab: "Profil enrichi",
    enrichmentHint:
      "Ces informations nous aident a personnaliser vos recommandations et proposer les produits les plus adaptes a votre profil.",
    employmentStatus: "Situation professionnelle",
    housing: "Logement",
    vehicle: "Vehicule",
    maritalStatus: "Situation familiale",
    children: "Enfants",
    numberOfChildren: "Nombre d'enfants",
    riskTolerance: "Tolerance au risque",
    ageRange: "Tranche d'age",
    monthlyIncome: "Revenu mensuel",
    financialGoals: "Objectifs financiers",
    employed: "Salarie(e)",
    selfEmployed: "Independant(e)",
    student: "Etudiant(e)",
    retired: "Retraite(e)",
    owner: "Proprietaire",
    renter: "Locataire",
    family: "Chez la famille",
    yesOwned: "Oui, achete",
    yesFinanced: "Oui, finance",
    no: "Non",
    yes: "Oui",
    single: "Celibataire",
    married: "Marie(e)",
    divorced: "Divorce(e)",
    conservative: "Conservateur",
    moderate: "Modere",
    aggressive: "Agressif",
    goalSave: "Epargner",
    goalInvest: "Investir",
    goalBuyHome: "Acheter un logement",
    goalTravel: "Voyager",
    goalEducation: "Financer les etudes",
  },
  ar: {
    subtitle: "قم بإدارة معلوماتك الشخصية واستكمل ملفك",
    premiumClient: "عميل مميز",
    verified: "موثق",
    edit: "تعديل",
    save: "حفظ",
    cancel: "إلغاء",
    savedSuccess: "تم حفظ الملف بنجاح",
    changesDiscarded: "تم إلغاء التغييرات",
    personalTab: "المعلومات الشخصية",
    enrichmentTab: "الملف الموسع",
    enrichmentHint:
      "تساعدنا هذه المعلومات على تخصيص التوصيات واقتراح المنتجات المناسبة لملفك.",
    employmentStatus: "الوضع المهني",
    housing: "السكن",
    vehicle: "المركبة",
    maritalStatus: "الحالة العائلية",
    children: "الأطفال",
    numberOfChildren: "عدد الأطفال",
    riskTolerance: "تحمل المخاطر",
    ageRange: "الفئة العمرية",
    monthlyIncome: "الدخل الشهري",
    financialGoals: "الأهداف المالية",
    employed: "موظف",
    selfEmployed: "عمل حر",
    student: "طالب",
    retired: "متقاعد",
    owner: "مالك",
    renter: "مكتري",
    family: "مع العائلة",
    yesOwned: "نعم، ملك",
    yesFinanced: "نعم، ممول",
    no: "لا",
    yes: "نعم",
    single: "أعزب",
    married: "متزوج",
    divorced: "مطلق",
    conservative: "محافظ",
    moderate: "متوازن",
    aggressive: "مرتفع المخاطر",
    goalSave: "الادخار",
    goalInvest: "الاستثمار",
    goalBuyHome: "شراء منزل",
    goalTravel: "السفر",
    goalEducation: "تمويل التعليم",
  },
};

const optionValues = {
  occupation: ["employed", "selfEmployed", "student", "retired"],
  housing: ["owner", "renter", "family"],
  hasVehicle: ["yesOwned", "yesFinanced", "no"],
  maritalStatus: ["single", "married", "divorced"],
  hasChildren: ["no", "yes"],
  riskTolerance: ["conservative", "moderate", "aggressive"],
  financialGoals: ["goalSave", "goalInvest", "goalBuyHome", "goalTravel", "goalEducation"],
};

const ageRanges = [
  { value: "18-25", label: "18-25" },
  { value: "26-35", label: "26-35" },
  { value: "36-45", label: "36-45" },
  { value: "46-60", label: "46-60" },
  { value: "60+", label: "60+" },
];

const incomeRanges = [
  { value: "0-1000", label: "0 - 1 000 TND" },
  { value: "1000-2500", label: "1 000 - 2 500 TND" },
  { value: "2500-5000", label: "2 500 - 5 000 TND" },
  { value: "5000-10000", label: "5 000 - 10 000 TND" },
  { value: "10000+", label: "10 000+ TND" },
];

export function Profile() {
  const { theme } = useTheme();
  const { language, t, isRTL } = useLanguage();

  const langKey = language === "ar" ? "ar" : language === "fr" ? "fr" : "en";
  const ui = uiByLanguage[langKey] || uiByLanguage.en;

  const [activeTab, setActiveTab] = useState("personal");
  const [isEditing, setIsEditing] = useState(false);
  const [feedback, setFeedback] = useState("");

  const [personalData, setPersonalData] = useState(initialPersonalData);
  const [enrichmentData, setEnrichmentData] = useState(initialEnrichmentData);

  const [savedPersonalData, setSavedPersonalData] = useState(initialPersonalData);
  const [savedEnrichmentData, setSavedEnrichmentData] = useState(initialEnrichmentData);

  const isDirty = useMemo(() => {
    return (
      JSON.stringify(personalData) !== JSON.stringify(savedPersonalData) ||
      JSON.stringify(enrichmentData) !== JSON.stringify(savedEnrichmentData)
    );
  }, [personalData, savedPersonalData, enrichmentData, savedEnrichmentData]);

  const inputBaseClass = `w-full px-4 py-3 border rounded-lg focus:outline-none focus:ring-2 focus:ring-[#242f54] ${
    theme === "dark"
      ? "bg-gray-700 border-gray-600 text-white"
      : "bg-gray-50 border-gray-300 text-gray-900"
  } ${isRTL ? "text-right" : "text-left"}`;

  const selectBaseClass = `w-full px-4 py-2.5 border rounded-lg ${
    theme === "dark"
      ? "bg-gray-600 border-gray-500 text-white"
      : "bg-white border-gray-300 text-gray-900"
  } ${isRTL ? "text-right" : "text-left"}`;

  const handlePersonalChange = (event) => {
    const { name, value } = event.target;
    setPersonalData((previous) => ({ ...previous, [name]: value }));
  };

  const handleEnrichmentChange = (field, value) => {
    setEnrichmentData((previous) => ({ ...previous, [field]: value }));
  };

  const handleGoalToggle = (goalKey) => {
    if (!isEditing) return;

    setEnrichmentData((previous) => {
      const exists = previous.financialGoals.includes(goalKey);
      return {
        ...previous,
        financialGoals: exists
          ? previous.financialGoals.filter((goal) => goal !== goalKey)
          : [...previous.financialGoals, goalKey],
      };
    });
  };

  const startEditing = () => {
    setFeedback("");
    setIsEditing(true);
  };

  const handleSave = () => {
    setSavedPersonalData(personalData);
    setSavedEnrichmentData(enrichmentData);
    setIsEditing(false);
    setFeedback(ui.savedSuccess);
  };

  const handleCancel = () => {
    setPersonalData(savedPersonalData);
    setEnrichmentData(savedEnrichmentData);
    setIsEditing(false);
    setFeedback(ui.changesDiscarded);
  };

  const getOptionLabel = (key) => ui[key] || key;

  return (
    <div
      className={`min-h-full p-4 lg:p-8 ${theme === "dark" ? "bg-gray-900" : "bg-gray-50"} ${
        isRTL ? "text-right" : "text-left"
      }`}
    >
      <div className="mx-auto max-w-6xl space-y-6">
        <div>
          <h1
            className={`mb-2 text-2xl font-semibold ${
              theme === "dark" ? "text-white" : "text-gray-900"
            }`}
          >
            {t("profile")}
          </h1>
          <p className={theme === "dark" ? "text-gray-400" : "text-gray-600"}>
            {ui.subtitle}
          </p>
        </div>

        <div
          className={`${
            theme === "dark"
              ? "bg-gray-800 border-gray-700"
              : "bg-white border-gray-200"
          } border rounded-xl p-6`}
        >
          <div
            className={`flex flex-col gap-4 md:items-start md:justify-between ${
              isRTL ? "md:flex-row-reverse" : "md:flex-row"
            }`}
          >
            <div
              className={`flex flex-col items-center gap-4 ${
                isRTL ? "md:flex-row-reverse" : "md:flex-row"
              }`}
            >
              <div className="relative">
                <img
                  src={profileImage}
                  alt="Profile"
                  className="h-24 w-24 rounded-full object-cover"
                />
                <button
                  type="button"
                  className="absolute bottom-0 right-0 flex h-8 w-8 items-center justify-center rounded-full bg-[#242f54] text-white hover:bg-[#1a2340]"
                  aria-label="Change avatar"
                >
                  <Camera className="h-4 w-4" />
                </button>
              </div>

              <div className={isRTL ? "text-right" : "text-left"}>
                <h2
                  className={`text-xl font-semibold ${
                    theme === "dark" ? "text-white" : "text-gray-900"
                  }`}
                >
                  {personalData.firstName} {personalData.lastName}
                </h2>
                <p className={theme === "dark" ? "text-gray-400" : "text-gray-600"}>
                  {personalData.email}
                </p>
                <div
                  className={`mt-3 flex flex-wrap gap-2 ${
                    isRTL ? "justify-end" : "justify-start"
                  }`}
                >
                  <span
                    className={`rounded-full px-3 py-1 text-xs ${
                      theme === "dark"
                        ? "bg-blue-900/30 text-blue-400"
                        : "bg-blue-100 text-blue-600"
                    }`}
                  >
                    {ui.premiumClient}
                  </span>
                  <span
                    className={`rounded-full px-3 py-1 text-xs ${
                      theme === "dark"
                        ? "bg-green-900/30 text-green-400"
                        : "bg-green-100 text-green-600"
                    }`}
                  >
                    {ui.verified}
                  </span>
                </div>
              </div>
            </div>

            <div
              className={`flex items-center gap-2 ${
                isRTL ? "flex-row-reverse self-end" : "self-start"
              }`}
            >
              {isEditing ? (
                <>
                  <button
                    type="button"
                    onClick={handleSave}
                    disabled={!isDirty}
                    className="inline-flex items-center gap-2 rounded-lg bg-green-600 px-4 py-2 text-white transition-colors hover:bg-green-700 disabled:cursor-not-allowed disabled:opacity-50"
                  >
                    <Save className="h-4 w-4" />
                    {ui.save}
                  </button>
                  <button
                    type="button"
                    onClick={handleCancel}
                    className={`inline-flex items-center gap-2 rounded-lg px-4 py-2 transition-colors ${
                      theme === "dark"
                        ? "bg-gray-700 text-gray-200 hover:bg-gray-600"
                        : "bg-gray-200 text-gray-700 hover:bg-gray-300"
                    }`}
                  >
                    <X className="h-4 w-4" />
                    {ui.cancel}
                  </button>
                </>
              ) : (
                <button
                  type="button"
                  onClick={startEditing}
                  className="inline-flex items-center gap-2 rounded-lg bg-[#242f54] px-4 py-2 text-white transition-colors hover:bg-[#1a2340]"
                >
                  <Edit2 className="h-4 w-4" />
                  {ui.edit}
                </button>
              )}
            </div>
          </div>

          {feedback && (
            <p
              className={`mt-4 text-sm ${
                theme === "dark" ? "text-emerald-300" : "text-emerald-700"
              }`}
            >
              {feedback}
            </p>
          )}
        </div>

        <div
          className={`flex border-b ${
            theme === "dark" ? "border-gray-700" : "border-gray-200"
          } ${isRTL ? "flex-row-reverse" : ""}`}
        >
          <button
            type="button"
            onClick={() => setActiveTab("personal")}
            className={`inline-flex items-center gap-2 px-4 py-3 border-b-2 transition-colors ${
              activeTab === "personal"
                ? "border-[#242f54] text-[#242f54]"
                : theme === "dark"
                  ? "border-transparent text-gray-400 hover:text-gray-300"
                  : "border-transparent text-gray-600 hover:text-gray-900"
            } ${isRTL ? "flex-row-reverse" : ""}`}
          >
            <User className="h-5 w-5" />
            <span className="font-medium">{ui.personalTab}</span>
          </button>
          <button
            type="button"
            onClick={() => setActiveTab("enrichment")}
            className={`inline-flex items-center gap-2 px-4 py-3 border-b-2 transition-colors ${
              activeTab === "enrichment"
                ? "border-[#242f54] text-[#242f54]"
                : theme === "dark"
                  ? "border-transparent text-gray-400 hover:text-gray-300"
                  : "border-transparent text-gray-600 hover:text-gray-900"
            } ${isRTL ? "flex-row-reverse" : ""}`}
          >
            <FileText className="h-5 w-5" />
            <span className="font-medium">{ui.enrichmentTab}</span>
          </button>
        </div>

        {activeTab === "personal" && (
          <div
            className={`${
              theme === "dark"
                ? "bg-gray-800 border-gray-700"
                : "bg-white border-gray-200"
            } border rounded-xl p-6`}
          >
            <div className="space-y-6">
              <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
                <div>
                  <label
                    className={`mb-2 block text-sm font-medium ${
                      theme === "dark" ? "text-gray-300" : "text-gray-700"
                    }`}
                  >
                    {t("firstName")}
                  </label>
                  <input
                    type="text"
                    name="firstName"
                    value={personalData.firstName}
                    onChange={handlePersonalChange}
                    disabled={!isEditing}
                    className={`${inputBaseClass} ${
                      !isEditing ? "opacity-60 cursor-not-allowed" : ""
                    }`}
                  />
                </div>
                <div>
                  <label
                    className={`mb-2 block text-sm font-medium ${
                      theme === "dark" ? "text-gray-300" : "text-gray-700"
                    }`}
                  >
                    {t("lastName")}
                  </label>
                  <input
                    type="text"
                    name="lastName"
                    value={personalData.lastName}
                    onChange={handlePersonalChange}
                    disabled={!isEditing}
                    className={`${inputBaseClass} ${
                      !isEditing ? "opacity-60 cursor-not-allowed" : ""
                    }`}
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
                <div>
                  <label
                    className={`mb-2 block text-sm font-medium ${
                      theme === "dark" ? "text-gray-300" : "text-gray-700"
                    }`}
                  >
                    {t("email")}
                  </label>
                  <input
                    type="email"
                    name="email"
                    value={personalData.email}
                    onChange={handlePersonalChange}
                    disabled={!isEditing}
                    className={`${inputBaseClass} ${
                      !isEditing ? "opacity-60 cursor-not-allowed" : ""
                    }`}
                  />
                </div>
                <div>
                  <label
                    className={`mb-2 block text-sm font-medium ${
                      theme === "dark" ? "text-gray-300" : "text-gray-700"
                    }`}
                  >
                    {t("phone")}
                  </label>
                  <input
                    type="tel"
                    name="phone"
                    value={personalData.phone}
                    onChange={handlePersonalChange}
                    disabled={!isEditing}
                    className={`${inputBaseClass} ${
                      !isEditing ? "opacity-60 cursor-not-allowed" : ""
                    }`}
                  />
                </div>
              </div>

              <div>
                <label
                  className={`mb-2 block text-sm font-medium ${
                    theme === "dark" ? "text-gray-300" : "text-gray-700"
                  }`}
                >
                  {t("address")}
                </label>
                <input
                  type="text"
                  name="address"
                  value={personalData.address}
                  onChange={handlePersonalChange}
                  disabled={!isEditing}
                  className={`${inputBaseClass} ${
                    !isEditing ? "opacity-60 cursor-not-allowed" : ""
                  }`}
                />
              </div>

              <div className="grid grid-cols-1 gap-6 md:grid-cols-3">
                <div>
                  <label
                    className={`mb-2 block text-sm font-medium ${
                      theme === "dark" ? "text-gray-300" : "text-gray-700"
                    }`}
                  >
                    {t("city")}
                  </label>
                  <input
                    type="text"
                    name="city"
                    value={personalData.city}
                    onChange={handlePersonalChange}
                    disabled={!isEditing}
                    className={`${inputBaseClass} ${
                      !isEditing ? "opacity-60 cursor-not-allowed" : ""
                    }`}
                  />
                </div>
                <div>
                  <label
                    className={`mb-2 block text-sm font-medium ${
                      theme === "dark" ? "text-gray-300" : "text-gray-700"
                    }`}
                  >
                    {t("zipCode")}
                  </label>
                  <input
                    type="text"
                    name="zipCode"
                    value={personalData.zipCode}
                    onChange={handlePersonalChange}
                    disabled={!isEditing}
                    className={`${inputBaseClass} ${
                      !isEditing ? "opacity-60 cursor-not-allowed" : ""
                    }`}
                  />
                </div>
                <div>
                  <label
                    className={`mb-2 block text-sm font-medium ${
                      theme === "dark" ? "text-gray-300" : "text-gray-700"
                    }`}
                  >
                    {t("country")}
                  </label>
                  <input
                    type="text"
                    name="country"
                    value={personalData.country}
                    onChange={handlePersonalChange}
                    disabled={!isEditing}
                    className={`${inputBaseClass} ${
                      !isEditing ? "opacity-60 cursor-not-allowed" : ""
                    }`}
                  />
                </div>
              </div>
            </div>
          </div>
        )}

        {activeTab === "enrichment" && (
          <div
            className={`${
              theme === "dark"
                ? "bg-gray-800 border-gray-700"
                : "bg-white border-gray-200"
            } border rounded-xl p-6`}
          >
            <div
              className={`${
                theme === "dark"
                  ? "bg-blue-900/20 border-blue-800 text-blue-300"
                  : "bg-blue-50 border-blue-200 text-blue-700"
              } mb-6 rounded-lg border p-4 text-sm`}
            >
              {ui.enrichmentHint}
            </div>

            <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
              <div
                className={`${
                  theme === "dark" ? "bg-gray-700" : "bg-gray-50"
                } rounded-lg p-5`}
              >
                <div className={`mb-3 flex items-center gap-2 ${isRTL ? "flex-row-reverse" : ""}`}>
                  <Briefcase
                    className={`h-5 w-5 ${
                      theme === "dark" ? "text-gray-400" : "text-gray-600"
                    }`}
                  />
                  <h3
                    className={`font-medium ${
                      theme === "dark" ? "text-white" : "text-gray-900"
                    }`}
                  >
                    {ui.employmentStatus}
                  </h3>
                </div>
                <select
                  value={enrichmentData.occupation}
                  onChange={(event) =>
                    handleEnrichmentChange("occupation", event.target.value)
                  }
                  disabled={!isEditing}
                  className={`${selectBaseClass} ${
                    !isEditing ? "opacity-60 cursor-not-allowed" : ""
                  }`}
                >
                  {optionValues.occupation.map((value) => (
                    <option key={value} value={value}>
                      {getOptionLabel(value)}
                    </option>
                  ))}
                </select>
              </div>

              <div
                className={`${
                  theme === "dark" ? "bg-gray-700" : "bg-gray-50"
                } rounded-lg p-5`}
              >
                <div className={`mb-3 flex items-center gap-2 ${isRTL ? "flex-row-reverse" : ""}`}>
                  <Home
                    className={`h-5 w-5 ${
                      theme === "dark" ? "text-gray-400" : "text-gray-600"
                    }`}
                  />
                  <h3
                    className={`font-medium ${
                      theme === "dark" ? "text-white" : "text-gray-900"
                    }`}
                  >
                    {ui.housing}
                  </h3>
                </div>
                <select
                  value={enrichmentData.housing}
                  onChange={(event) =>
                    handleEnrichmentChange("housing", event.target.value)
                  }
                  disabled={!isEditing}
                  className={`${selectBaseClass} ${
                    !isEditing ? "opacity-60 cursor-not-allowed" : ""
                  }`}
                >
                  {optionValues.housing.map((value) => (
                    <option key={value} value={value}>
                      {getOptionLabel(value)}
                    </option>
                  ))}
                </select>
              </div>

              <div
                className={`${
                  theme === "dark" ? "bg-gray-700" : "bg-gray-50"
                } rounded-lg p-5`}
              >
                <div className={`mb-3 flex items-center gap-2 ${isRTL ? "flex-row-reverse" : ""}`}>
                  <Car
                    className={`h-5 w-5 ${
                      theme === "dark" ? "text-gray-400" : "text-gray-600"
                    }`}
                  />
                  <h3
                    className={`font-medium ${
                      theme === "dark" ? "text-white" : "text-gray-900"
                    }`}
                  >
                    {ui.vehicle}
                  </h3>
                </div>
                <select
                  value={enrichmentData.hasVehicle}
                  onChange={(event) =>
                    handleEnrichmentChange("hasVehicle", event.target.value)
                  }
                  disabled={!isEditing}
                  className={`${selectBaseClass} ${
                    !isEditing ? "opacity-60 cursor-not-allowed" : ""
                  }`}
                >
                  {optionValues.hasVehicle.map((value) => (
                    <option key={value} value={value}>
                      {getOptionLabel(value)}
                    </option>
                  ))}
                </select>
              </div>

              <div
                className={`${
                  theme === "dark" ? "bg-gray-700" : "bg-gray-50"
                } rounded-lg p-5`}
              >
                <div className={`mb-3 flex items-center gap-2 ${isRTL ? "flex-row-reverse" : ""}`}>
                  <Users
                    className={`h-5 w-5 ${
                      theme === "dark" ? "text-gray-400" : "text-gray-600"
                    }`}
                  />
                  <h3
                    className={`font-medium ${
                      theme === "dark" ? "text-white" : "text-gray-900"
                    }`}
                  >
                    {ui.maritalStatus}
                  </h3>
                </div>
                <select
                  value={enrichmentData.maritalStatus}
                  onChange={(event) =>
                    handleEnrichmentChange("maritalStatus", event.target.value)
                  }
                  disabled={!isEditing}
                  className={`${selectBaseClass} ${
                    !isEditing ? "opacity-60 cursor-not-allowed" : ""
                  }`}
                >
                  {optionValues.maritalStatus.map((value) => (
                    <option key={value} value={value}>
                      {getOptionLabel(value)}
                    </option>
                  ))}
                </select>
              </div>

              <div
                className={`${
                  theme === "dark" ? "bg-gray-700" : "bg-gray-50"
                } rounded-lg p-5`}
              >
                <div className={`mb-3 flex items-center gap-2 ${isRTL ? "flex-row-reverse" : ""}`}>
                  <Baby
                    className={`h-5 w-5 ${
                      theme === "dark" ? "text-gray-400" : "text-gray-600"
                    }`}
                  />
                  <h3
                    className={`font-medium ${
                      theme === "dark" ? "text-white" : "text-gray-900"
                    }`}
                  >
                    {ui.children}
                  </h3>
                </div>
                <select
                  value={enrichmentData.hasChildren}
                  onChange={(event) =>
                    handleEnrichmentChange("hasChildren", event.target.value)
                  }
                  disabled={!isEditing}
                  className={`${selectBaseClass} ${
                    !isEditing ? "opacity-60 cursor-not-allowed" : ""
                  }`}
                >
                  {optionValues.hasChildren.map((value) => (
                    <option key={value} value={value}>
                      {getOptionLabel(value)}
                    </option>
                  ))}
                </select>

                {enrichmentData.hasChildren === "yes" && (
                  <div className="mt-3">
                    <label
                      className={`mb-2 block text-sm font-medium ${
                        theme === "dark" ? "text-gray-300" : "text-gray-700"
                      }`}
                    >
                      {ui.numberOfChildren}
                    </label>
                    <select
                      value={enrichmentData.numberOfChildren}
                      onChange={(event) =>
                        handleEnrichmentChange("numberOfChildren", event.target.value)
                      }
                      disabled={!isEditing}
                      className={`${selectBaseClass} ${
                        !isEditing ? "opacity-60 cursor-not-allowed" : ""
                      }`}
                    >
                      {["1", "2", "3", "4", "5+"].map((value) => (
                        <option key={value} value={value}>
                          {value}
                        </option>
                      ))}
                    </select>
                  </div>
                )}
              </div>

              <div
                className={`${
                  theme === "dark" ? "bg-gray-700" : "bg-gray-50"
                } rounded-lg p-5`}
              >
                <div className={`mb-3 flex items-center gap-2 ${isRTL ? "flex-row-reverse" : ""}`}>
                  <Calendar
                    className={`h-5 w-5 ${
                      theme === "dark" ? "text-gray-400" : "text-gray-600"
                    }`}
                  />
                  <h3
                    className={`font-medium ${
                      theme === "dark" ? "text-white" : "text-gray-900"
                    }`}
                  >
                    {ui.ageRange}
                  </h3>
                </div>
                <select
                  value={enrichmentData.age}
                  onChange={(event) => handleEnrichmentChange("age", event.target.value)}
                  disabled={!isEditing}
                  className={`${selectBaseClass} ${
                    !isEditing ? "opacity-60 cursor-not-allowed" : ""
                  }`}
                >
                  {ageRanges.map((item) => (
                    <option key={item.value} value={item.value}>
                      {item.label}
                    </option>
                  ))}
                </select>
              </div>

              <div
                className={`${
                  theme === "dark" ? "bg-gray-700" : "bg-gray-50"
                } rounded-lg p-5`}
              >
                <div className={`mb-3 flex items-center gap-2 ${isRTL ? "flex-row-reverse" : ""}`}>
                  <Wallet
                    className={`h-5 w-5 ${
                      theme === "dark" ? "text-gray-400" : "text-gray-600"
                    }`}
                  />
                  <h3
                    className={`font-medium ${
                      theme === "dark" ? "text-white" : "text-gray-900"
                    }`}
                  >
                    {ui.monthlyIncome}
                  </h3>
                </div>
                <select
                  value={enrichmentData.monthlyIncome}
                  onChange={(event) =>
                    handleEnrichmentChange("monthlyIncome", event.target.value)
                  }
                  disabled={!isEditing}
                  className={`${selectBaseClass} ${
                    !isEditing ? "opacity-60 cursor-not-allowed" : ""
                  }`}
                >
                  {incomeRanges.map((item) => (
                    <option key={item.value} value={item.value}>
                      {item.label}
                    </option>
                  ))}
                </select>
              </div>

              <div
                className={`${
                  theme === "dark" ? "bg-gray-700" : "bg-gray-50"
                } rounded-lg p-5`}
              >
                <div className={`mb-3 flex items-center gap-2 ${isRTL ? "flex-row-reverse" : ""}`}>
                  <FileText
                    className={`h-5 w-5 ${
                      theme === "dark" ? "text-gray-400" : "text-gray-600"
                    }`}
                  />
                  <h3
                    className={`font-medium ${
                      theme === "dark" ? "text-white" : "text-gray-900"
                    }`}
                  >
                    {ui.riskTolerance}
                  </h3>
                </div>
                <select
                  value={enrichmentData.riskTolerance}
                  onChange={(event) =>
                    handleEnrichmentChange("riskTolerance", event.target.value)
                  }
                  disabled={!isEditing}
                  className={`${selectBaseClass} ${
                    !isEditing ? "opacity-60 cursor-not-allowed" : ""
                  }`}
                >
                  {optionValues.riskTolerance.map((value) => (
                    <option key={value} value={value}>
                      {getOptionLabel(value)}
                    </option>
                  ))}
                </select>
              </div>

              <div
                className={`${
                  theme === "dark" ? "bg-gray-700" : "bg-gray-50"
                } rounded-lg p-5 md:col-span-2`}
              >
                <div className={`mb-3 flex items-center gap-2 ${isRTL ? "flex-row-reverse" : ""}`}>
                  <Target
                    className={`h-5 w-5 ${
                      theme === "dark" ? "text-gray-400" : "text-gray-600"
                    }`}
                  />
                  <h3
                    className={`font-medium ${
                      theme === "dark" ? "text-white" : "text-gray-900"
                    }`}
                  >
                    {ui.financialGoals}
                  </h3>
                </div>
                <div
                  className={`grid grid-cols-1 gap-2 sm:grid-cols-2 ${
                    isRTL ? "text-right" : "text-left"
                  }`}
                >
                  {optionValues.financialGoals.map((goal) => {
                    const checked = enrichmentData.financialGoals.includes(goal);
                    return (
                      <label
                        key={goal}
                        className={`inline-flex items-center gap-2 rounded-lg border px-3 py-2 text-sm ${
                          theme === "dark"
                            ? "border-gray-600 text-gray-200"
                            : "border-gray-300 text-gray-700"
                        } ${isRTL ? "flex-row-reverse" : ""} ${
                          !isEditing ? "opacity-60" : "cursor-pointer"
                        }`}
                      >
                        <input
                          type="checkbox"
                          checked={checked}
                          disabled={!isEditing}
                          onChange={() => handleGoalToggle(goal)}
                          className="h-4 w-4"
                        />
                        <span>{getOptionLabel(goal)}</span>
                      </label>
                    );
                  })}
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
