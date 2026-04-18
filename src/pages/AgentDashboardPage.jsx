import { useCallback, useEffect, useMemo, useState } from "react";
import { useNavigate } from "react-router";
import {
  AlertCircle,
  CheckCircle2,
  Download,
  FileCheck2,
  LogOut,
  MapPinned,
  RefreshCw,
  Search,
  XCircle,
} from "lucide-react";
import {
  CircleMarker,
  MapContainer,
  Popup,
  TileLayer,
  useMap,
} from "react-leaflet";
import "leaflet/dist/leaflet.css";
import { useTheme } from "../contexts/ThemeContext";
import { useLanguage } from "../contexts/LanguageContext";
import logoExpanded from "../assets/BH_logo2.png";
import flagAr from "../assets/flags/Flag_of_Tunisia.svg.webp";
import flagEn from "../assets/flags/Flag_of_the_United_Kingdom_(3-5).svg.webp";
import flagFr from "../assets/flags/Flag_of_France.svg.png";
import { Skeleton, SkeletonLines } from "../components/Skeleton";
import {
  clearAgentAuthSession,
  fillAgentClientAgencies,
  getAgentAuthToken,
  getAgentComplaints,
  getAgentClientComplaints,
  getAgentCreditAnalysis,
  getAgentDashboard,
  getAgentMe,
  downloadAgentMonthlyReport,
  searchAgentClient,
  updateAgentComplaint,
  updateAgentClientComplaint,
} from "../api";

const copyByLanguage = {
  en: {
    title: "Agent Command Center",
    subtitle: "Portfolio intelligence across BH network",
    loadingAgent: "Loading your workspace...",
    globalError: "Unable to load agent profile.",
    searchTitle: "Find client dossier",
    searchHintCenter: "Start by entering a CIN",
    searchHintTop: "Search another client CIN",
    searchPlaceholder: "Enter CIN (numbers only)",
    runSearch: "Open dossier",
    searching: "Opening...",
    noResult: "No client selected yet.",
    clientCardTitle: "Client card",
    clientViewSectionHint: "Use these sections to view the full client dossier.",
    clientTabSummary: "Summary",
    clientTabDecision: "Credit",
    clientTabAdvanced: "Advanced",
    essentialsTitle: "Essentials",
    decisionTitle: "Credit decision",
    capacityTitle: "Borrowing capacity",
    reasonsTitle: "Main reasons",
    indicatorsTitle: "Financial indicators",
    importantTitle: "Important details",
    eligibilityLabel: "Eligibility",
    monthlyLimitLabel: "Monthly max payment",
    accountActivityTitle: "Account and activity",
    profileTitle: "Profile snapshot",
    productsProjectsTitle: "Products and goals",
    advancedTitle: "Advanced details",
    showAdvanced: "Show advanced details",
    hideAdvanced: "Hide advanced details",
    invalidCin: "CIN must contain numbers only.",
    loginExpired: "Session expired. Please sign in again.",
    changePassword: "Change password",
    logout: "Log out",
    welcomeLabel: "Welcome",
    agentFallbackName: "Agent",
    yes: "Yes",
    no: "No",
    idLabel: "Client ID",
    segmentLabel: "Segment",
    scoreLabel: "Financial score",
    regularIncome: "Regular income",
    formCompleted: "Form completed",
    riskLevel: "Risk level",
    ageRange: "Age range",
    familyStatus: "Family status",
    professionStatus: "Employment status",
    housingStatus: "Housing status",
    salaryLabel: "Monthly salary",
    expensesLabel: "Monthly expenses",
    savingsLabel: "Monthly savings",
    ratioLabel: "Expense/Income ratio",
    productsLabel: "Existing products",
    objectiveLabel: "Financial objective",
    projectsLabel: "12-month projects",
    recommendationsLabel: "Recommended products",
    savingsProfileLabel: "Savings profile",
    rfmLabel: "R/F/M scores",
    clusterLabel: "Cluster",
    noRecommendations: "No recommendation available yet.",
    photoMissing: "No profile photo available",
    seniorityLabel: "Account seniority (days)",
    lastOpLabel: "Days since last operation",
    activitySector: "Activity sector",
    workSeniority: "Employment seniority",
    debtRatio: "Real debt ratio",
    toleranceRisk: "Risk tolerance",
    noData: "Not available",
    portfolioTitle: "Network client pulse",
    portfolioSubtitle: "Interactive agency view across BH Bank network",
    loadingPortfolio: "Loading global dashboard...",
    dashboardLoadError: "Unable to load portfolio metrics.",
    totalClientsLabel: "Total clients",
    formsCompletedLabel: "Forms completed",
    missingAgenciesLabel: "Clients without agency",
    agencyMapTitle: "Agency map",
    agencyMapHint: "Click a branch point to inspect client volume.",
    regionsTitle: "Regional distribution",
    topAgenciesTitle: "Top agencies",
    largestAgencyTitle: "Largest agency by region",
    syncAgenciesMissing: "Fill missing agencies",
    syncAgenciesRefresh: "Rebalance agency allocation",
    syncingAgencies: "Syncing...",
    agencySyncSuccess: "Agency assignment updated.",
    agencySyncError: "Unable to update agencies.",
    reportMonthLabel: "Report month",
    reportFormatLabel: "Format",
    reportFormatXlsx: "Excel (.xlsx)",
    reportFormatPdf: "PDF (.pdf)",
    downloadMonthlyReport: "Download monthly report",
    downloadingMonthlyReport: "Preparing report...",
    reportDownloadSuccess: "Monthly report downloaded successfully.",
    reportDownloadError: "Unable to download monthly report.",
    agenciesUpToDate: "All clients already have an assigned agency.",
    selectedAgency: "Selected agency",
    noAgencyData: "No agency data available yet.",
    ultraTitle: "Ultra dashboard",
    ultraSubtitle: "360 view on all BH clients: profile, finance, products and data quality",
    financeSnapshotTitle: "Financial snapshot",
    demographicsTitle: "Client demographics",
    productsInsightsTitle: "Products insights",
    dataQualityTitle: "Data quality",
    objectivesRiskTitle: "Objectives and risk appetite",
    complaintsTitle: "Complaints monitoring",
    avgSalaryLabel: "Average monthly salary",
    avgExpensesLabel: "Average monthly expenses",
    avgSavingsLabel: "Average monthly savings",
    avgBalanceLabel: "Average estimated balance",
    avgScoreLabel: "Average financial score",
    regularIncomeRateLabel: "Regular income rate",
    clientsWithProductsLabel: "Clients with existing products",
    clientsWithRecommendationsLabel: "Clients with recommendations",
    topExistingProductsLabel: "Top existing products",
    topRecommendedProductsLabel: "Top recommended products",
    topAgeRangesLabel: "Top age ranges",
    topFamilyStatusLabel: "Top family status",
    topEmploymentStatusLabel: "Top employment status",
    topEducationLabel: "Top education levels",
    topObjectivesLabel: "Top financial objectives",
    topRiskToleranceLabel: "Top risk appetite",
    missingGovernorateLabel: "Missing governorate",
    missingPostalCodeLabel: "Missing postal code",
    unknownAgencyLabelsLabel: "Unknown agency labels",
    formCompletionRateLabel: "Form completion rate",
    totalComplaintsLabel: "Total complaints",
    openComplaintsLabel: "Open complaints",
    closedComplaintsLabel: "Closed complaints",
    noStatsYet: "No stats available yet.",
    tabPortfolio: "Network pulse",
    tabUltra: "Ultra analytics",
    tabAgencies: "Agencies",
    tabComplaints: "Complaints inbox",
    tabClients: "Client desk",
    workspaceNavHint: "Quick switch: click a tab to open its live view.",
    ultraPrev: "Previous",
    ultraNext: "Next",
    ultraPageLabel: "Page",
    clientPrev: "Previous",
    clientNext: "Next",
    clientPageLabel: "Client section",
    eligibilityCirclesTitle: "Eligibility and client volume",
    eligibleCircleLabel: "Eligible",
    partiallyCircleLabel: "Partially eligible",
    notEligibleCircleLabel: "Not eligible",
    clientsTargetCircleLabel: "Clients (target 5000)",
    ultraDataMissingTitle: "Ultra data not fully available",
    ultraDataMissingHint: "The analytics source did not return enough fields. Refresh after backend sync.",
  },
  fr: {
    title: "Cockpit Agent BH",
    subtitle: "Pilotage global du portefeuille clients",
    loadingAgent: "Chargement de votre espace...",
    globalError: "Impossible de charger le profil agent.",
    searchTitle: "Rechercher un dossier client",
    searchHintCenter: "Commencez par saisir un CIN",
    searchHintTop: "Rechercher un autre CIN client",
    searchPlaceholder: "Entrez le CIN (chiffres uniquement)",
    runSearch: "Ouvrir dossier",
    searching: "Ouverture...",
    noResult: "Aucun client selectionne pour le moment.",
    clientCardTitle: "Carte client",
    clientViewSectionHint: "Utilisez ces sections pour afficher tout le dossier client.",
    clientTabSummary: "Resume",
    clientTabDecision: "Credit",
    clientTabAdvanced: "Avance",
    essentialsTitle: "Essentiel",
    decisionTitle: "Decision credit",
    capacityTitle: "Capacite d'emprunt",
    reasonsTitle: "Raisons principales",
    indicatorsTitle: "Indicateurs financiers",
    importantTitle: "Details importants",
    eligibilityLabel: "Eligibilite",
    monthlyLimitLabel: "Mensualite max",
    accountActivityTitle: "Compte et activite",
    profileTitle: "Profil rapide",
    productsProjectsTitle: "Produits et objectifs",
    advancedTitle: "Details avances",
    showAdvanced: "Afficher les details avances",
    hideAdvanced: "Masquer les details avances",
    invalidCin: "Le CIN doit contenir uniquement des chiffres.",
    loginExpired: "Session expiree. Reconnectez-vous.",
    changePassword: "Changer mot de passe",
    logout: "Deconnexion",
    welcomeLabel: "Bienvenue",
    agentFallbackName: "Agent",
    yes: "Oui",
    no: "Non",
    idLabel: "ID client",
    segmentLabel: "Segment",
    scoreLabel: "Score financier",
    regularIncome: "Revenu regulier",
    formCompleted: "Formulaire complete",
    riskLevel: "Niveau de risque",
    ageRange: "Tranche d'age",
    familyStatus: "Situation familiale",
    professionStatus: "Statut professionnel",
    housingStatus: "Situation logement",
    salaryLabel: "Salaire mensuel",
    expensesLabel: "Depenses mensuelles",
    savingsLabel: "Epargne mensuelle",
    ratioLabel: "Ratio depenses/revenu",
    productsLabel: "Produits existants",
    objectiveLabel: "Objectif financier",
    projectsLabel: "Projets 12 mois",
    recommendationsLabel: "Produits recommandes",
    savingsProfileLabel: "Profil epargne",
    rfmLabel: "Scores R/F/M",
    clusterLabel: "Cluster",
    noRecommendations: "Aucune recommandation disponible pour le moment.",
    photoMissing: "Aucune photo de profil disponible",
    seniorityLabel: "Anciennete compte (jours)",
    lastOpLabel: "Jours depuis la derniere operation",
    activitySector: "Secteur d'activite",
    workSeniority: "Anciennete emploi",
    debtRatio: "Taux d'endettement reel",
    toleranceRisk: "Tolerance au risque",
    noData: "Non disponible",
    portfolioTitle: "Vue reseau clients BH",
    portfolioSubtitle: "Vue interactive par agence sur tout le reseau BH Bank",
    loadingPortfolio: "Chargement du dashboard global...",
    dashboardLoadError: "Impossible de charger les metriques globales.",
    totalClientsLabel: "Total clients",
    formsCompletedLabel: "Formulaires completes",
    missingAgenciesLabel: "Clients sans agence",
    agencyMapTitle: "Carte des agences",
    agencyMapHint: "Cliquez sur un point agence pour voir le volume clients.",
    regionsTitle: "Repartition regionale",
    topAgenciesTitle: "Top agences",
    largestAgencyTitle: "La plus grande agence par region",
    syncAgenciesMissing: "Remplir les agences manquantes",
    syncAgenciesRefresh: "Reequilibrer la repartition agences",
    syncingAgencies: "Synchronisation...",
    agencySyncSuccess: "Affectation des agences mise a jour.",
    agencySyncError: "Impossible de mettre a jour les agences.",
    reportMonthLabel: "Mois du rapport",
    reportFormatLabel: "Format",
    reportFormatXlsx: "Excel (.xlsx)",
    reportFormatPdf: "PDF (.pdf)",
    downloadMonthlyReport: "Telecharger rapport mensuel",
    downloadingMonthlyReport: "Preparation du rapport...",
    reportDownloadSuccess: "Rapport mensuel telecharge avec succes.",
    reportDownloadError: "Impossible de telecharger le rapport mensuel.",
    agenciesUpToDate: "Tous les clients ont deja une agence assignee.",
    selectedAgency: "Agence selectionnee",
    noAgencyData: "Aucune donnee agence disponible pour le moment.",
    ultraTitle: "Dashboard ultra",
    ultraSubtitle: "Vue 360 sur tous les clients BH: profil, finance, produits et qualite de donnees",
    financeSnapshotTitle: "Snapshot financier",
    demographicsTitle: "Demographie clients",
    productsInsightsTitle: "Insights produits",
    dataQualityTitle: "Qualite des donnees",
    objectivesRiskTitle: "Objectifs et appetence au risque",
    complaintsTitle: "Suivi des reclamations",
    avgSalaryLabel: "Salaire mensuel moyen",
    avgExpensesLabel: "Depenses mensuelles moyennes",
    avgSavingsLabel: "Epargne mensuelle moyenne",
    avgBalanceLabel: "Solde estime moyen",
    avgScoreLabel: "Score financier moyen",
    regularIncomeRateLabel: "Taux revenu regulier",
    clientsWithProductsLabel: "Clients avec produits existants",
    clientsWithRecommendationsLabel: "Clients avec recommandations",
    topExistingProductsLabel: "Top produits existants",
    topRecommendedProductsLabel: "Top produits recommandes",
    topAgeRangesLabel: "Top tranches d'age",
    topFamilyStatusLabel: "Top situations familiales",
    topEmploymentStatusLabel: "Top statuts pro",
    topEducationLabel: "Top niveaux d'etudes",
    topObjectivesLabel: "Top objectifs financiers",
    topRiskToleranceLabel: "Top tolerance au risque",
    missingGovernorateLabel: "Gouvernorat manquant",
    missingPostalCodeLabel: "Code postal manquant",
    unknownAgencyLabelsLabel: "Libelles agence inconnus",
    formCompletionRateLabel: "Taux completion formulaires",
    totalComplaintsLabel: "Total reclamations",
    openComplaintsLabel: "Reclamations ouvertes",
    closedComplaintsLabel: "Reclamations fermees",
    noStatsYet: "Aucune statistique disponible pour le moment.",
    tabPortfolio: "Vue reseau",
    tabUltra: "Ultra analytics",
    tabAgencies: "Agences",
    tabComplaints: "Boite reclamations",
    tabClients: "Dossiers clients",
    workspaceNavHint: "Navigation rapide: cliquez un onglet pour afficher la vue.",
    ultraPrev: "Precedent",
    ultraNext: "Suivant",
    ultraPageLabel: "Page",
    clientPrev: "Precedent",
    clientNext: "Suivant",
    clientPageLabel: "Section dossier",
    eligibilityCirclesTitle: "Eligibilite et volume clients",
    eligibleCircleLabel: "Eligible",
    partiallyCircleLabel: "Partiel",
    notEligibleCircleLabel: "Non eligible",
    clientsTargetCircleLabel: "Clients (objectif 5000)",
    ultraDataMissingTitle: "Donnees ultra incompletes",
    ultraDataMissingHint: "La source analytics n'a pas renvoye assez de champs. Relancez apres synchronisation backend.",
  },
  ar: {
    title: "Agent Command Center",
    subtitle: "Portfolio intelligence across BH network",
    loadingAgent: "Loading your workspace...",
    globalError: "Unable to load agent profile.",
    searchTitle: "Find client dossier",
    searchHintCenter: "Start by entering a CIN",
    searchHintTop: "Search another client CIN",
    searchPlaceholder: "Enter CIN (numbers only)",
    runSearch: "Open dossier",
    searching: "Opening...",
    noResult: "No client selected yet.",
    clientCardTitle: "Client card",
    clientViewSectionHint: "Use these sections to view the full client dossier.",
    clientTabSummary: "Summary",
    clientTabDecision: "Credit",
    clientTabAdvanced: "Advanced",
    essentialsTitle: "Essentials",
    decisionTitle: "Credit decision",
    capacityTitle: "Borrowing capacity",
    reasonsTitle: "Main reasons",
    indicatorsTitle: "Financial indicators",
    importantTitle: "Important details",
    eligibilityLabel: "Eligibility",
    monthlyLimitLabel: "Monthly max payment",
    accountActivityTitle: "Account and activity",
    profileTitle: "Profile snapshot",
    productsProjectsTitle: "Products and goals",
    advancedTitle: "Advanced details",
    showAdvanced: "Show advanced details",
    hideAdvanced: "Hide advanced details",
    invalidCin: "CIN must contain numbers only.",
    loginExpired: "Session expired. Please sign in again.",
    changePassword: "Change password",
    logout: "Log out",
    welcomeLabel: "مرحبا",
    agentFallbackName: "الوكيل",
    yes: "Yes",
    no: "No",
    idLabel: "Client ID",
    segmentLabel: "Segment",
    scoreLabel: "Financial score",
    regularIncome: "Regular income",
    formCompleted: "Form completed",
    riskLevel: "Risk level",
    ageRange: "Age range",
    familyStatus: "Family status",
    professionStatus: "Employment status",
    housingStatus: "Housing status",
    salaryLabel: "Monthly salary",
    expensesLabel: "Monthly expenses",
    savingsLabel: "Monthly savings",
    ratioLabel: "Expense/Income ratio",
    productsLabel: "Existing products",
    objectiveLabel: "Financial objective",
    projectsLabel: "12-month projects",
    recommendationsLabel: "Recommended products",
    savingsProfileLabel: "Savings profile",
    rfmLabel: "R/F/M scores",
    clusterLabel: "Cluster",
    noRecommendations: "No recommendation available yet.",
    photoMissing: "No profile photo available",
    seniorityLabel: "Account seniority (days)",
    lastOpLabel: "Days since last operation",
    activitySector: "Activity sector",
    workSeniority: "Employment seniority",
    debtRatio: "Real debt ratio",
    toleranceRisk: "Risk tolerance",
    noData: "Not available",
    portfolioTitle: "Network client pulse",
    portfolioSubtitle: "Interactive agency view across BH Bank network",
    loadingPortfolio: "Loading global dashboard...",
    dashboardLoadError: "Unable to load portfolio metrics.",
    totalClientsLabel: "Total clients",
    formsCompletedLabel: "Forms completed",
    missingAgenciesLabel: "Clients without agency",
    agencyMapTitle: "Agency map",
    agencyMapHint: "Click a branch point to inspect client volume.",
    regionsTitle: "Regional distribution",
    topAgenciesTitle: "Top agencies",
    largestAgencyTitle: "Largest agency by region",
    syncAgenciesMissing: "Fill missing agencies",
    syncAgenciesRefresh: "Rebalance agency allocation",
    syncingAgencies: "Syncing...",
    agencySyncSuccess: "Agency assignment updated.",
    agencySyncError: "Unable to update agencies.",
    reportMonthLabel: "Report month",
    reportFormatLabel: "Format",
    reportFormatXlsx: "Excel (.xlsx)",
    reportFormatPdf: "PDF (.pdf)",
    downloadMonthlyReport: "Download monthly report",
    downloadingMonthlyReport: "Preparing report...",
    reportDownloadSuccess: "Monthly report downloaded successfully.",
    reportDownloadError: "Unable to download monthly report.",
    agenciesUpToDate: "All clients already have an assigned agency.",
    selectedAgency: "Selected agency",
    noAgencyData: "No agency data available yet.",
    ultraTitle: "Ultra dashboard",
    ultraSubtitle: "360 view on all BH clients: profile, finance, products and data quality",
    financeSnapshotTitle: "Financial snapshot",
    demographicsTitle: "Client demographics",
    productsInsightsTitle: "Products insights",
    dataQualityTitle: "Data quality",
    objectivesRiskTitle: "Objectives and risk appetite",
    complaintsTitle: "Complaints monitoring",
    avgSalaryLabel: "Average monthly salary",
    avgExpensesLabel: "Average monthly expenses",
    avgSavingsLabel: "Average monthly savings",
    avgBalanceLabel: "Average estimated balance",
    avgScoreLabel: "Average financial score",
    regularIncomeRateLabel: "Regular income rate",
    clientsWithProductsLabel: "Clients with existing products",
    clientsWithRecommendationsLabel: "Clients with recommendations",
    topExistingProductsLabel: "Top existing products",
    topRecommendedProductsLabel: "Top recommended products",
    topAgeRangesLabel: "Top age ranges",
    topFamilyStatusLabel: "Top family status",
    topEmploymentStatusLabel: "Top employment status",
    topEducationLabel: "Top education levels",
    topObjectivesLabel: "Top financial objectives",
    topRiskToleranceLabel: "Top risk appetite",
    missingGovernorateLabel: "Missing governorate",
    missingPostalCodeLabel: "Missing postal code",
    unknownAgencyLabelsLabel: "Unknown agency labels",
    formCompletionRateLabel: "Form completion rate",
    totalComplaintsLabel: "Total complaints",
    openComplaintsLabel: "Open complaints",
    closedComplaintsLabel: "Closed complaints",
    noStatsYet: "No stats available yet.",
    tabPortfolio: "نبض الشبكة",
    tabUltra: "تحليلات متقدمة",
    tabAgencies: "الوكالات",
    tabComplaints: "صندوق الشكاوى",
    tabClients: "ملفات العملاء",
    workspaceNavHint: "تنقل سريع: اضغط على تبويب لعرض الصفحة.",
    ultraPrev: "السابق",
    ultraNext: "التالي",
    ultraPageLabel: "الصفحة",
    clientPrev: "السابق",
    clientNext: "التالي",
    clientPageLabel: "قسم الملف",
    eligibilityCirclesTitle: "الاهلية وحجم العملاء",
    eligibleCircleLabel: "مؤهل",
    partiallyCircleLabel: "مؤهل جزئيا",
    notEligibleCircleLabel: "غير مؤهل",
    clientsTargetCircleLabel: "العملاء (هدف 5000)",
    ultraDataMissingTitle: "Ultra data not fully available",
    ultraDataMissingHint: "The analytics source did not return enough fields. Refresh after backend sync.",
  },
};

const getLangKey = (language) => {
  if (language === "ar") return "ar";
  if (language === "en") return "en";
  return "fr";
};

const languageOptions = [
  {
    code: "fr",
    label: "FR",
    flag: flagFr,
    flagAlt: "France flag",
    aria: "Switch to French",
  },
  {
    code: "en",
    label: "EN",
    flag: flagEn,
    flagAlt: "United Kingdom flag",
    aria: "Switch to English",
  },
  {
    code: "ar",
    label: "AR",
    flag: flagAr,
    flagAlt: "Tunisia flag",
    aria: "Switch to Arabic",
  },
];

const complaintsUiByLanguage = {
  en: {
    tab: "Complaints",
    title: "Complaints management",
    inboxTitle: "Complaints inbox",
    inboxSubtitle: "Track and resolve client complaints without opening a client dossier.",
    loading: "Loading complaints...",
    empty: "No complaints found for this client.",
    inboxEmpty: "No complaints found for this filter.",
    inboxLoadError: "Unable to load complaints inbox.",
    type: "Type",
    client: "Client",
    clientCin: "CIN",
    status: "Status",
    filterLabel: "Filter",
    filterOpen: "Open",
    filterSubmitted: "Submitted",
    filterInProgress: "In progress",
    filterResolved: "Resolved",
    filterRejected: "Rejected",
    filterAssignedToMe: "Assigned to me",
    filterUnassigned: "Unassigned",
    message: "Client message",
    response: "Agent response",
    createdAt: "Created at",
    assignedToMe: "Assigned to me",
    refresh: "Refresh",
    save: "Save update",
    saving: "Saving...",
    saveError: "Unable to save complaint update.",
  },
  fr: {
    tab: "Reclamations",
    title: "Gestion des reclamations",
    inboxTitle: "Boite des reclamations",
    inboxSubtitle: "Suivez et traitez les reclamations sans rechercher un dossier client.",
    loading: "Chargement des reclamations...",
    empty: "Aucune reclamation pour ce client.",
    inboxEmpty: "Aucune reclamation pour ce filtre.",
    inboxLoadError: "Impossible de charger la boite des reclamations.",
    type: "Type",
    client: "Client",
    clientCin: "CIN",
    status: "Statut",
    filterLabel: "Filtre",
    filterOpen: "Ouvertes",
    filterSubmitted: "Soumises",
    filterInProgress: "En cours",
    filterResolved: "Resolues",
    filterRejected: "Rejetees",
    filterAssignedToMe: "Assignees a moi",
    filterUnassigned: "Non assignees",
    message: "Message client",
    response: "Reponse agent",
    createdAt: "Creee le",
    assignedToMe: "Assignee a moi",
    refresh: "Rafraichir",
    save: "Enregistrer",
    saving: "Enregistrement...",
    saveError: "Impossible de mettre a jour la reclamation.",
  },
  ar: {
    tab: "الشكاوى",
    title: "ادارة الشكاوى",
    inboxTitle: "صندوق الشكاوى",
    inboxSubtitle: "تابع الشكاوى وقم بمعالجتها دون البحث عن ملف عميل.",
    loading: "جار تحميل الشكاوى...",
    empty: "لا توجد شكاوى لهذا العميل.",
    inboxEmpty: "لا توجد شكاوى لهذا الفلتر.",
    inboxLoadError: "تعذر تحميل صندوق الشكاوى.",
    type: "النوع",
    client: "العميل",
    clientCin: "رقم CIN",
    status: "الحالة",
    filterLabel: "الفلتر",
    filterOpen: "المفتوحة",
    filterSubmitted: "مقدمة",
    filterInProgress: "قيد المعالجة",
    filterResolved: "تم الحل",
    filterRejected: "مرفوضة",
    filterAssignedToMe: "معينة لي",
    filterUnassigned: "غير معينة",
    message: "رسالة العميل",
    response: "رد المستشار",
    createdAt: "تاريخ الانشاء",
    assignedToMe: "معينة لي",
    refresh: "تحديث",
    save: "حفظ التعديل",
    saving: "جار الحفظ...",
    saveError: "تعذر حفظ تعديل الشكوى.",
  },
};

const complaintTypeLabels = {
  auth_login_issue: {
    en: "Login / authentication issue",
    fr: "Connexion et authentification",
    ar: "مشكلة تسجيل الدخول والمصادقة",
  },
  account_data_issue: {
    en: "Account data or dashboard issue",
    fr: "Donnees de compte ou tableau de bord",
    ar: "مشكلة بيانات الحساب او لوحة التحكم",
  },
  transfer_payment_issue: {
    en: "Transfer or online payment issue",
    fr: "Virement ou paiement en ligne",
    ar: "مشكلة تحويل او دفع عبر المنصة",
  },
  profile_settings_issue: {
    en: "Profile or settings issue",
    fr: "Profil et parametres utilisateur",
    ar: "مشكلة الملف الشخصي او الاعدادات",
  },
  notification_issue: {
    en: "Notification or alert issue",
    fr: "Notifications et alertes",
    ar: "مشكلة الاشعارات والتنبيهات",
  },
  chatbot_issue: {
    en: "Chatbot assistance issue",
    fr: "Assistant chatbot",
    ar: "مشكلة في مساعد الدردشة",
  },
  other_platform_issue: {
    en: "Other platform-related issue",
    fr: "Autre incident lie a la plateforme",
    ar: "مشكلة اخرى مرتبطة بالمنصة",
  },
};

const complaintStatusLabels = {
  submitted: { en: "Submitted", fr: "Soumise", ar: "مقدمة" },
  in_progress: { en: "In progress", fr: "En cours", ar: "قيد المعالجة" },
  resolved: { en: "Resolved", fr: "Resolue", ar: "تم الحل" },
  rejected: { en: "Rejected", fr: "Rejetee", ar: "مرفوضة" },
};

const normalizeComplaintStatusValue = (statusValue) => {
  const key = String(statusValue || "").trim().toLowerCase();
  if (key === "en_attente") return "submitted";
  if (key === "en_cours") return "in_progress";
  if (key === "resolue") return "resolved";
  if (key === "submitted" || key === "in_progress" || key === "resolved" || key === "rejected") {
    return key;
  }
  return "submitted";
};

const getComplaintTypeLabel = (typeValue, language) => {
  const key = String(typeValue || "").trim().toLowerCase();
  return complaintTypeLabels[key]?.[language] || complaintTypeLabels[key]?.en || key || "-";
};

const getComplaintStatusLabel = (statusValue, language) => {
  const key = normalizeComplaintStatusValue(statusValue);
  return complaintStatusLabels[key]?.[language] || complaintStatusLabels[key]?.en || key;
};

const getComplaintStatusBadgeClass = (statusValue, theme) => {
  const key = normalizeComplaintStatusValue(statusValue);
  const dark = theme === "dark";

  if (key === "resolved") {
    return dark
      ? "border-emerald-500/40 bg-emerald-500/20 text-emerald-100"
      : "border-emerald-200 bg-emerald-50 text-emerald-700";
  }
  if (key === "rejected") {
    return dark
      ? "border-rose-500/40 bg-rose-500/20 text-rose-100"
      : "border-rose-200 bg-rose-50 text-rose-700";
  }
  if (key === "in_progress") {
    return dark
      ? "border-amber-500/40 bg-amber-500/20 text-amber-100"
      : "border-amber-200 bg-amber-50 text-amber-700";
  }
  return dark
    ? "border-sky-500/40 bg-sky-500/20 text-sky-100"
    : "border-sky-200 bg-sky-50 text-sky-700";
};

const formatDateTime = (value, language) => {
  if (!value) return "-";
  const date = new Date(value);
  if (Number.isNaN(date.getTime())) return "-";

  const locale = language === "en" ? "en-US" : language === "ar" ? "ar-TN" : "fr-FR";
  return new Intl.DateTimeFormat(locale, {
    day: "2-digit",
    month: "2-digit",
    year: "numeric",
    hour: "2-digit",
    minute: "2-digit",
    hour12: false,
  }).format(date);
};

const formatMoney = (value) => {
  if (value === null || value === undefined || String(value).trim() === "") return "-";
  const number = Number(value);
  if (Number.isNaN(number)) return "-";
  return `${number.toLocaleString(undefined, { maximumFractionDigits: 0 })} TND`;
};

const displayValue = (value) => {
  if (value === null || value === undefined) return "-";
  if (typeof value === "string" && value.trim() === "") return "-";
  return String(value);
};

const parseOptionalNumber = (value) => {
  if (value === null || value === undefined) return null;

  if (typeof value === "number") {
    return Number.isFinite(value) ? value : null;
  }

  if (typeof value === "string") {
    const raw = value.trim();
    if (!raw) return null;

    const normalized = raw.replace(/\s+/g, "").replace(",", ".");
    const parsed = Number(normalized);
    return Number.isFinite(parsed) ? parsed : null;
  }

  return null;
};

const pickFirstNumericValue = (...values) => {
  for (const value of values) {
    const parsed = parseOptionalNumber(value);
    if (parsed !== null) return parsed;
  }
  return null;
};

const normalizeCounterRows = (rowsLike) => {
  if (Array.isArray(rowsLike)) {
    return rowsLike
      .map((row) => ({
        name: String(row?.name || "").trim(),
        count: parseOptionalNumber(row?.count),
      }))
      .filter((row) => row.name && row.count !== null && row.count > 0)
      .map((row) => ({ ...row, count: Math.round(row.count) }));
  }

  if (rowsLike && typeof rowsLike === "object") {
    return Object.entries(rowsLike)
      .map(([name, count]) => ({
        name: String(name || "").trim(),
        count: parseOptionalNumber(count),
      }))
      .filter((row) => row.name && row.count !== null && row.count > 0)
      .sort((a, b) => b.count - a.count)
      .map((row) => ({ ...row, count: Math.round(row.count) }));
  }

  return [];
};

const INVALID_PHOTO_VALUES = new Set(["null", "none", "nan", "undefined", "n/a", "false"]);

const normalizeClientPhotoValue = (value) => {
  let raw = value;

  if (raw && typeof raw === "object") {
    raw = raw.url || raw.src || raw.path || raw.photo || raw.profile_photo || "";
  }

  raw = String(raw || "").trim();
  if (!raw) return "";

  // Some rows store quoted payloads like "data:image/...".
  raw = raw.replace(/^['"]+|['"]+$/g, "").trim();
  if (!raw) return "";

  if (INVALID_PHOTO_VALUES.has(raw.toLowerCase())) return "";
  return raw;
};

const resolveSingleClientPhoto = (value) => {
  const raw = normalizeClientPhotoValue(value);
  if (!raw) return "";

  if (raw.startsWith("data:image/")) return raw;
  if (raw.startsWith("http://") || raw.startsWith("https://")) return raw;

  // Accept plain base64 payloads from legacy rows.
  if (/^[A-Za-z0-9+/=]+$/.test(raw) && raw.length > 100) {
    return `data:image/jpeg;base64,${raw}`;
  }

  // Keep API-relative URLs on Vite proxy path.
  if (raw.startsWith("/api/")) return raw;
  if (raw.startsWith("api/")) return `/${raw}`;

  const protocol = window.location.protocol || "http:";
  const host = window.location.hostname || "localhost";

  // Common backend static paths served by Flask on port 5000.
  if (
    raw.startsWith("/uploads/") ||
    raw.startsWith("/media/") ||
    raw.startsWith("/storage/") ||
    raw.startsWith("uploads/") ||
    raw.startsWith("media/") ||
    raw.startsWith("storage/")
  ) {
    const normalized = raw.startsWith("/") ? raw : `/${raw}`;
    return `${protocol}//${host}:5000${normalized}`;
  }

  if (raw.startsWith("/")) {
    return `${protocol}//${host}:5000${raw}`;
  }

  return raw;
};

const resolveClientPhoto = (...values) => {
  for (const value of values) {
    const resolved = resolveSingleClientPhoto(value);
    if (resolved) return resolved;
  }
  return "";
};

const getInitials = (name) => {
  const parts = String(name || "")
    .split(" ")
    .map((part) => part.trim())
    .filter(Boolean);

  if (parts.length === 0) return "CL";
  if (parts.length === 1) return parts[0].slice(0, 2).toUpperCase();
  return `${parts[0][0] || ""}${parts[1][0] || ""}`.toUpperCase();
};

const badgeByEligibility = {
  Eligible: "bg-emerald-100 text-emerald-800 border-emerald-200",
  "Partially Eligible": "bg-amber-100 text-amber-800 border-amber-200",
  "Not Eligible": "bg-rose-100 text-rose-800 border-rose-200",
};

const regionColorByName = {
  "Grand Tunis": "#0ea5e9",
  "Cap Bon & Nord": "#22c55e",
  "Sahel & Centre": "#f59e0b",
  "Sud & Sfax": "#ef4444",
  "Autres zones": "#94a3b8",
};

const regionDisplayOrder = [
  "Grand Tunis",
  "Cap Bon & Nord",
  "Sahel & Centre",
  "Sud & Sfax",
  "Autres zones",
];

const tunisiaGeoBounds = {
  north: 37.55,
  south: 30.1,
  west: 7.3,
  east: 11.7,
};

const agencyMapCoordBounds = {
  minX: 90,
  maxX: 235,
  minY: 75,
  maxY: 475,
};

const clamp = (value, min, max) => Math.min(max, Math.max(min, value));

const projectAgencyToLatLng = (agency) => {
  const rawX = Number(agency?.map_x ?? 160);
  const rawY = Number(agency?.map_y ?? 260);
  const normalizedX =
    (clamp(rawX, agencyMapCoordBounds.minX, agencyMapCoordBounds.maxX) - agencyMapCoordBounds.minX) /
    (agencyMapCoordBounds.maxX - agencyMapCoordBounds.minX);
  const normalizedY =
    (clamp(rawY, agencyMapCoordBounds.minY, agencyMapCoordBounds.maxY) - agencyMapCoordBounds.minY) /
    (agencyMapCoordBounds.maxY - agencyMapCoordBounds.minY);

  const latitude =
    tunisiaGeoBounds.north - normalizedY * (tunisiaGeoBounds.north - tunisiaGeoBounds.south);
  const longitude =
    tunisiaGeoBounds.west + normalizedX * (tunisiaGeoBounds.east - tunisiaGeoBounds.west);

  return [latitude, longitude];
};

function MapViewController({ selectedLatLng }) {
  const map = useMap();

  useEffect(() => {
    if (!selectedLatLng) return;
    const targetZoom = Math.max(map.getZoom(), 7);
    map.flyTo(selectedLatLng, targetZoom, {
      duration: 0.45,
    });
  }, [map, selectedLatLng]);

  return null;
}

function AgencyBubbleMap({ agencies, selectedAgencyName, onSelectAgency, ui, isDark }) {
  const hasData = Array.isArray(agencies) && agencies.length > 0;
  const maxCount = Math.max(1, ...((agencies || []).map((agency) => Number(agency?.count || 0))));
  const markers = useMemo(
    () =>
      (agencies || [])
        .map((agency) => ({
          ...agency,
          latLng: projectAgencyToLatLng(agency),
        })),
    [agencies],
  );
  const selectedMarker = markers.find((agency) => agency?.name === selectedAgencyName) || null;
  const selectedLatLng = selectedMarker?.latLng || null;
  const mapCenter = selectedLatLng || [34.1, 9.4];
  const tileUrl = isDark
    ? "https://{s}.basemaps.cartocdn.com/dark_all/{z}/{x}/{y}{r}.png"
    : "https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png";
  const tileAttribution = isDark
    ? '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors &copy; CARTO'
    : '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors';

  if (!hasData) {
    return (
      <div
        className={`flex min-h-70 items-center justify-center rounded-2xl border p-4 text-sm ${
          isDark ? "border-white/10 bg-[#0f1d33] text-white/70" : "border-border bg-surface-alt text-text-muted"
        }`}
      >
        {ui.noAgencyData}
      </div>
    );
  }

  return (
    <div className="overflow-hidden rounded-2xl border border-border/70 dark:border-white/10">
      <div className="h-105 w-full">
        <MapContainer
          center={mapCenter}
          zoom={6}
          minZoom={5}
          maxZoom={10}
          scrollWheelZoom={false}
          attributionControl
          className="h-full w-full"
          maxBounds={[
            [29.5, 6.9],
            [38.0, 12.4],
          ]}
          maxBoundsViscosity={0.75}
        >
          <TileLayer attribution={tileAttribution} url={tileUrl} />
          <MapViewController selectedLatLng={selectedLatLng} />

          {markers.map((agency) => {
            const count = Number(agency?.count || 0);
            const radius = count > 0 ? 5 + (count / maxCount) * 11 : 4;
            const color = regionColorByName[agency?.region] || regionColorByName["Autres zones"];
            const isSelected = agency?.name === selectedAgencyName;
            const fillOpacity = count > 0 ? (isSelected ? 0.95 : 0.72) : (isSelected ? 0.7 : 0.3);

            return (
              <CircleMarker
                key={agency?.name}
                center={agency.latLng}
                radius={radius}
                eventHandlers={{
                  click: () => onSelectAgency(agency?.name || ""),
                }}
                pathOptions={{
                  color: isSelected ? "#ffffff" : color,
                  weight: isSelected ? 3 : 1.5,
                  fillColor: color,
                  fillOpacity,
                }}
              >
                <Popup>
                  <div className="space-y-1">
                    <p className="text-sm font-semibold">{agency?.name || ui.selectedAgency || "Agency"}</p>
                    <p className="text-xs">{agency?.region || "Autres zones"}</p>
                    <p className="text-xs font-semibold">{count.toLocaleString()} {ui.totalClientsLabel}</p>
                  </div>
                </Popup>
              </CircleMarker>
            );
          })}
        </MapContainer>
      </div>
    </div>
  );
}

function CircleStatCard({ label, value, total, strokeColor = "#0A4DB3" }) {
  const rawValue = Number(value);
  const safeValue = Number.isFinite(rawValue) ? Math.max(0, rawValue) : 0;
  const rawTotal = Number(total);
  const safeTotal = Number.isFinite(rawTotal) && rawTotal > 0 ? rawTotal : Math.max(safeValue, 1);
  const ratio = Math.min(1, safeValue / safeTotal);

  const radius = 40;
  const circumference = 2 * Math.PI * radius;
  const dashOffset = circumference * (1 - ratio);

  return (
    <div className="rounded-xl border border-[#d5e2f4] bg-white p-3 text-black">
      <div className="relative mx-auto h-28 w-28">
        <svg viewBox="0 0 100 100" className="h-full w-full -rotate-90">
          <circle cx="50" cy="50" r={radius} stroke="#e6eef9" strokeWidth="8" fill="none" />
          <circle
            cx="50"
            cy="50"
            r={radius}
            stroke={strokeColor}
            strokeWidth="8"
            fill="none"
            strokeLinecap="round"
            strokeDasharray={circumference}
            strokeDashoffset={dashOffset}
          />
        </svg>
        <div className="absolute inset-0 flex flex-col items-center justify-center">
          <span className="text-lg font-extrabold text-black">{Math.round(safeValue).toLocaleString()}</span>
          <span className="text-[10px] font-semibold text-slate-500">{Math.round(ratio * 100)}%</span>
        </div>
      </div>
      <p className="mt-2 text-center text-xs font-semibold uppercase tracking-wide text-slate-600">{label}</p>
    </div>
  );
}

function AgentWorkspaceSkeleton({ isDark }) {
  const panelClass =
    isDark
      ? "rounded-2xl border border-white/10 bg-[#14233b] p-5"
      : "rounded-2xl border border-border bg-surface p-5";
  const cardClass =
    isDark
      ? "rounded-2xl border border-white/10 bg-[#0f1d33] p-4"
      : "rounded-2xl border border-border bg-surface-alt p-4";

  return (
    <div className={`space-y-6 ${isDark ? "skeleton-dark" : ""}`}>
      <section className={panelClass}>
        <Skeleton className="h-6 w-48 rounded-lg" />
        <Skeleton className="mt-2 h-4 w-full max-w-xs rounded-md" />
        <div className="mt-4 flex flex-col gap-3 sm:flex-row">
          <Skeleton className="h-11 flex-1 rounded-xl" />
          <Skeleton className="h-11 w-full rounded-xl sm:w-36" />
        </div>
      </section>

      <section className="grid gap-6 lg:grid-cols-2">
        {Array.from({ length: 2 }).map((_, index) => (
          <article key={`agent-skeleton-card-${index}`} className={cardClass}>
            <Skeleton className="h-5 w-44 rounded-md" />
            <SkeletonLines className="mt-4" lines={4} lineClassName="h-4 rounded-md" lastLineClassName="w-4/5" />
            <div className="mt-4 grid gap-2 sm:grid-cols-2">
              <Skeleton className="h-12 rounded-lg" />
              <Skeleton className="h-12 rounded-lg" />
            </div>
          </article>
        ))}
      </section>

      <section className={panelClass}>
        <Skeleton className="h-6 w-56 rounded-lg" />
        <SkeletonLines className="mt-4" lines={5} lineClassName="h-10 rounded-lg" lastLineClassName="w-full" />
      </section>
    </div>
  );
}

export function AgentDashboardPage() {
  const navigate = useNavigate();
  const { theme } = useTheme();
  const { language, setLanguage, isRTL } = useLanguage();

  const ui = copyByLanguage[getLangKey(language)] || copyByLanguage.fr;
  const complaintsUi = complaintsUiByLanguage[getLangKey(language)] || complaintsUiByLanguage.fr;

  const [loadingAgent, setLoadingAgent] = useState(true);
  const [pageError, setPageError] = useState("");
  const [agentProfile, setAgentProfile] = useState(null);

  const [cin, setCin] = useState("");
  const [searching, setSearching] = useState(false);
  const [searchError, setSearchError] = useState("");
  const [clientSummary, setClientSummary] = useState(null);
  const [creditAnalysis, setCreditAnalysis] = useState(null);
  const [searchPinned, setSearchPinned] = useState(false);
  const [activeFeaturePage, setActiveFeaturePage] = useState(0);
  const [photoFailed, setPhotoFailed] = useState(false);
  const [selectedClientCin, setSelectedClientCin] = useState("");
  const [clientComplaintsLoading, setClientComplaintsLoading] = useState(false);
  const [clientComplaintsError, setClientComplaintsError] = useState("");
  const [clientComplaints, setClientComplaints] = useState([]);
  const [complaintDrafts, setComplaintDrafts] = useState({});
  const [savingComplaintId, setSavingComplaintId] = useState("");
  const [agentComplaintsLoading, setAgentComplaintsLoading] = useState(false);
  const [agentComplaintsError, setAgentComplaintsError] = useState("");
  const [agentComplaints, setAgentComplaints] = useState([]);
  const [agentComplaintDrafts, setAgentComplaintDrafts] = useState({});
  const [agentSavingComplaintId, setAgentSavingComplaintId] = useState("");
  const [agentComplaintFilter, setAgentComplaintFilter] = useState("open");
  const [dashboardLoading, setDashboardLoading] = useState(true);
  const [dashboardError, setDashboardError] = useState("");
  const [dashboardData, setDashboardData] = useState(null);
  const [selectedAgencyName, setSelectedAgencyName] = useState("");
  const [syncingAgencies, setSyncingAgencies] = useState(false);
  const [syncFeedback, setSyncFeedback] = useState("");
  const [reportMonth, setReportMonth] = useState(() => new Date().toISOString().slice(0, 7));
  const [reportFormat, setReportFormat] = useState("xlsx");
  const [downloadingReport, setDownloadingReport] = useState(false);
  const [reportFeedback, setReportFeedback] = useState("");
  const [reportFeedbackError, setReportFeedbackError] = useState(false);
  const [activeWorkspaceTab, setActiveWorkspaceTab] = useState("ultra");
  const [activeUltraPage, setActiveUltraPage] = useState(0);
  const [hideWorkspaceNavOnScroll, setHideWorkspaceNavOnScroll] = useState(false);

  const loadDashboardSnapshot = useCallback(async () => {
    try {
      setDashboardLoading(true);
      setDashboardError("");
      const payload = await getAgentDashboard();
      setDashboardData(payload || null);

      const firstActiveAgency = (payload?.agencies || []).find(
        (agency) => Number(agency?.count || 0) > 0,
      );
      const firstAgency = (payload?.agencies || [])[0] || null;
      const selectedDefault = firstActiveAgency?.name || firstAgency?.name || "";
      if (selectedDefault) {
        setSelectedAgencyName((current) => current || selectedDefault);
      }
    } catch (error) {
      if (error?.status === 401 || error?.status === 403) {
        clearAgentAuthSession();
        navigate("/agent/login", { replace: true });
        return;
      }
      setDashboardError(error?.message || ui.dashboardLoadError);
    } finally {
      setDashboardLoading(false);
    }
  }, [navigate, ui.dashboardLoadError]);

  useEffect(() => {
    if (!getAgentAuthToken()) {
      navigate("/agent/login", { replace: true });
      return;
    }

    const loadAgent = async () => {
      try {
        setLoadingAgent(true);
        setPageError("");
        const profile = await getAgentMe();
        setAgentProfile(profile || null);

        await loadDashboardSnapshot();
      } catch (error) {
        if (error?.status === 401 || error?.status === 403) {
          clearAgentAuthSession();
          navigate("/agent/login", { replace: true });
          return;
        }
        setPageError(error.message || ui.globalError);
      } finally {
        setLoadingAgent(false);
      }
    };

    loadAgent();
  }, [loadDashboardSnapshot, navigate, ui.globalError]);

  const handleLogout = () => {
    clearAgentAuthSession();
    navigate("/agent/login", { replace: true });
  };

  const handleSyncAgencies = async () => {
    if (syncingAgencies) return;

    try {
      setSyncingAgencies(true);
      setSyncFeedback("");

      const result = await fillAgentClientAgencies({ overwrite: true });
      const updatedCount = Number(result?.updated_count || 0);
      const feedbackMessage =
        result?.message || `${ui.agencySyncSuccess} (${updatedCount.toLocaleString()} clients)`;
      setSyncFeedback(feedbackMessage);

      await loadDashboardSnapshot();
    } catch (error) {
      if (error?.status === 401 || error?.status === 403) {
        clearAgentAuthSession();
        navigate("/agent/login", { replace: true });
        return;
      }
      setSyncFeedback(error?.message || ui.agencySyncError);
    } finally {
      setSyncingAgencies(false);
    }
  };

  const handleDownloadMonthlyReport = async () => {
    if (downloadingReport) return;

    try {
      setDownloadingReport(true);
      setReportFeedback("");
      setReportFeedbackError(false);

      const selectedMonth = String(reportMonth || "").trim();
      const selectedFormat = String(reportFormat || "xlsx").trim().toLowerCase() === "pdf" ? "pdf" : "xlsx";
      const { blob, filename } = await downloadAgentMonthlyReport(selectedMonth, selectedFormat);

      const objectUrl = URL.createObjectURL(blob);
      const anchor = document.createElement("a");
      anchor.href = objectUrl;
      anchor.download = filename || `rapport_mensuel_clients_${selectedMonth || "courant"}.${selectedFormat}`;
      document.body.appendChild(anchor);
      anchor.click();
      anchor.remove();
      URL.revokeObjectURL(objectUrl);

      setReportFeedback(ui.reportDownloadSuccess);
      setReportFeedbackError(false);
    } catch (error) {
      if (error?.status === 401 || error?.status === 403) {
        clearAgentAuthSession();
        navigate("/agent/login", { replace: true });
        return;
      }
      setReportFeedback(error?.message || ui.reportDownloadError);
      setReportFeedbackError(true);
    } finally {
      setDownloadingReport(false);
    }
  };

  const loadClientComplaints = useCallback(async (clientCin, options = {}) => {
    const normalizedCin = String(clientCin || "").trim();
    const showLoader = options?.showLoader !== false;

    if (!normalizedCin) {
      setClientComplaints([]);
      setComplaintDrafts({});
      setClientComplaintsError("");
      return;
    }

    try {
      if (showLoader) {
        setClientComplaintsLoading(true);
      }
      setClientComplaintsError("");

      const payload = await getAgentClientComplaints(normalizedCin);
      const rows = Array.isArray(payload?.complaints) ? payload.complaints : [];
      setClientComplaints(rows);

      const nextDrafts = {};
      rows.forEach((item) => {
        const complaintId = String(item?.id || "").trim();
        if (!complaintId) return;
        nextDrafts[complaintId] = {
          status: normalizeComplaintStatusValue(item?.status),
          response: String(item?.response || item?.agent_response || ""),
        };
      });
      setComplaintDrafts(nextDrafts);
    } catch (error) {
      setClientComplaintsError(error?.message || complaintsUi.loadError);
      if (showLoader) {
        setClientComplaints([]);
      }
    } finally {
      if (showLoader) {
        setClientComplaintsLoading(false);
      }
    }
  }, [complaintsUi.loadError]);

  const loadAgentComplaints = useCallback(async (statusValue = "open", options = {}) => {
    const normalizedStatus = String(statusValue || "open").trim().toLowerCase() || "open";
    const showLoader = options?.showLoader !== false;

    try {
      if (showLoader) {
        setAgentComplaintsLoading(true);
      }
      setAgentComplaintsError("");

      const payload = await getAgentComplaints(normalizedStatus, 120);
      const rows = Array.isArray(payload?.complaints) ? payload.complaints : [];
      setAgentComplaints(rows);

      const nextDrafts = {};
      rows.forEach((item) => {
        const complaintId = String(item?.id || "").trim();
        if (!complaintId) return;
        nextDrafts[complaintId] = {
          status: normalizeComplaintStatusValue(item?.status),
          response: String(item?.response || item?.agent_response || ""),
        };
      });
      setAgentComplaintDrafts(nextDrafts);
    } catch (error) {
      setAgentComplaintsError(error?.message || complaintsUi.inboxLoadError);
      if (showLoader) {
        setAgentComplaints([]);
      }
    } finally {
      if (showLoader) {
        setAgentComplaintsLoading(false);
      }
    }
  }, [complaintsUi.inboxLoadError]);

  const handleSearch = async (event) => {
    event.preventDefault();
    if (searching) return;

    const normalizedCin = cin.trim();
    if (!/^\d+$/.test(normalizedCin)) {
      setSearchError(ui.invalidCin);
      return;
    }

    try {
      setSearching(true);
      setActiveWorkspaceTab("clients");
      setSearchPinned(true);
      setActiveFeaturePage(0);
      setPhotoFailed(false);
      setSearchError("");
      setClientSummary(null);
      setCreditAnalysis(null);
      setSelectedClientCin("");
      setClientComplaints([]);
      setComplaintDrafts({});
      setClientComplaintsError("");

      const summary = await searchAgentClient(normalizedCin);
      setClientSummary(summary || null);

      const analysis = await getAgentCreditAnalysis(summary?.client_id || normalizedCin);
      setCreditAnalysis(analysis || null);
      setSelectedClientCin(normalizedCin);

      await loadClientComplaints(normalizedCin);
    } catch (error) {
      if (error?.status === 401 || error?.status === 403) {
        clearAgentAuthSession();
        navigate("/agent/login", { replace: true });
        return;
      }
      setSearchError(error.message || "Client search failed.");
    } finally {
      setSearching(false);
    }
  };

  const handleComplaintDraftChange = (complaintId, updates) => {
    const key = String(complaintId || "").trim();
    if (!key) return;

    setComplaintDrafts((previous) => ({
      ...previous,
      [key]: {
        ...(previous[key] || {}),
        ...(updates || {}),
      },
    }));
  };

  const handleSaveComplaint = async (complaintRow) => {
    const complaintId = String(complaintRow?.id || "").trim();
    if (!complaintId || !selectedClientCin) return;

    const draft = complaintDrafts[complaintId] || {};
    const status = normalizeComplaintStatusValue(draft?.status || complaintRow?.status);
    const response = String(draft?.response || "").trim();

    try {
      setSavingComplaintId(complaintId);
      setClientComplaintsError("");

      await updateAgentClientComplaint(selectedClientCin, complaintId, {
        status,
        response,
      });

      await loadClientComplaints(selectedClientCin, { showLoader: false });
    } catch (error) {
      setClientComplaintsError(error?.message || complaintsUi.saveError);
    } finally {
      setSavingComplaintId("");
    }
  };

  const handleAgentComplaintDraftChange = (complaintId, updates) => {
    const key = String(complaintId || "").trim();
    if (!key) return;

    setAgentComplaintDrafts((previous) => ({
      ...previous,
      [key]: {
        ...(previous[key] || {}),
        ...(updates || {}),
      },
    }));
  };

  const handleSaveAgentComplaint = async (complaintRow) => {
    const complaintId = String(complaintRow?.id || "").trim();
    if (!complaintId) return;

    const draft = agentComplaintDrafts[complaintId] || {};
    const status = normalizeComplaintStatusValue(draft?.status || complaintRow?.status);
    const response = String(draft?.response || "").trim();

    try {
      setAgentSavingComplaintId(complaintId);
      setAgentComplaintsError("");

      await updateAgentComplaint(complaintId, {
        status,
        response,
      });

      await loadAgentComplaints(agentComplaintFilter, { showLoader: false });
    } catch (error) {
      setAgentComplaintsError(error?.message || complaintsUi.saveError);
    } finally {
      setAgentSavingComplaintId("");
    }
  };

  useEffect(() => {
    if (activeWorkspaceTab !== "complaints") return;
    loadAgentComplaints(agentComplaintFilter);
  }, [activeWorkspaceTab, agentComplaintFilter, loadAgentComplaints]);

  useEffect(() => {
    if (activeWorkspaceTab !== "agencies") {
      setHideWorkspaceNavOnScroll(false);
      return;
    }

    const onScroll = () => {
      setHideWorkspaceNavOnScroll(window.scrollY > 280);
    };

    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => {
      window.removeEventListener("scroll", onScroll);
    };
  }, [activeWorkspaceTab]);

  const clientName = clientSummary?.client_name || creditAnalysis?.client_name || "Client";
  const clientInitials = useMemo(() => getInitials(clientName), [clientName]);
  const clientPhotoSrc = useMemo(
    () =>
      resolveClientPhoto(
        clientSummary?.client_photo,
        creditAnalysis?.client_photo,
        creditAnalysis?.client_profile?.profile_photo,
        clientSummary?.client_profile?.profile_photo,
      ),
    [
      clientSummary?.client_photo,
      creditAnalysis?.client_photo,
      creditAnalysis?.client_profile?.profile_photo,
      clientSummary?.client_profile?.profile_photo,
    ],
  );

  useEffect(() => {
    if (clientPhotoSrc) {
      setPhotoFailed(false);
    }
  }, [clientPhotoSrc]);

  const loanDecision = creditAnalysis?.credit_decision || null;
  const clientProfile = creditAnalysis?.client_profile || clientSummary?.client_profile || {};
  const segmentation = creditAnalysis?.segmentation || {
    rfm_segment: clientSummary?.rfm_segment || "",
    savings_profile: clientSummary?.savings_profile || "",
    kmeans_cluster: null,
    rfm_scores: {},
  };
  const accountInfo = creditAnalysis?.account_info || clientSummary?.account_snapshot || {};
  const reasons = Array.isArray(loanDecision?.reasons) ? loanDecision.reasons : [];

  const agencyRows = useMemo(
    () => (Array.isArray(dashboardData?.agencies) ? dashboardData.agencies : []),
    [dashboardData?.agencies],
  );
  const agenciesWithClients = useMemo(
    () => agencyRows.filter((agency) => Number(agency?.count || 0) > 0),
    [agencyRows],
  );
  const regionRows = Array.isArray(dashboardData?.regions) ? dashboardData.regions : [];
  const selectedAgency = useMemo(
    () => agencyRows.find((agency) => agency?.name === selectedAgencyName) || null,
    [agencyRows, selectedAgencyName],
  );
  const biggestAgencyByRegion = useMemo(() => {
    const bestByRegion = {};

    agenciesWithClients.forEach((agency) => {
      const regionName = agency?.region || "Autres zones";
      const count = Number(agency?.count || 0);
      const current = bestByRegion[regionName];

      if (!current || count > current.count) {
        bestByRegion[regionName] = {
          name: agency?.name || "-",
          count,
        };
      }
    });

    return regionDisplayOrder
      .filter((regionName) => Boolean(bestByRegion[regionName]))
      .map((regionName) => ({
        region: regionName,
        ...bestByRegion[regionName],
      }));
  }, [agenciesWithClients]);

  useEffect(() => {
    if (!agencyRows.length) return;
    const selectedStillExists = agencyRows.some((agency) => agency?.name === selectedAgencyName);
    if (!selectedStillExists) {
      const fallback = agenciesWithClients[0]?.name || agencyRows[0]?.name || "";
      setSelectedAgencyName(fallback);
    }
  }, [agencyRows, agenciesWithClients, selectedAgencyName]);

  const totalClients = Number(dashboardData?.total_clients || 0);
  const formsCompleted = Number(dashboardData?.forms_completed || 0);
  const missingAgencies = Number(dashboardData?.agence_completion?.missing_clients || 0);
  const loanEligibility = dashboardData?.loan_eligibility || {};
  const loanEligibleCount = Number(loanEligibility?.Eligible || 0);
  const loanPartialCount = Number(loanEligibility?.["Partially Eligible"] || 0);
  const loanNotEligibleCount = Number(loanEligibility?.["Not Eligible"] || 0);
  const formsCompletionRate = totalClients > 0 ? Number(((formsCompleted / totalClients) * 100).toFixed(1)) : 0;

  const ultraOverview =
    dashboardData?.ultra_overview ||
    dashboardData?.ultraOverview ||
    dashboardData?.ultra ||
    dashboardData?.analytics ||
    {};
  const ultraFinance =
    ultraOverview?.finance || ultraOverview?.finance_snapshot || ultraOverview?.financial_snapshot || {};
  const ultraDistribution =
    ultraOverview?.distribution || ultraOverview?.demographics || ultraOverview?.client_distribution || {};
  const ultraProducts = ultraOverview?.products || ultraOverview?.product_insights || {};
  const ultraDataQuality = ultraOverview?.data_quality || ultraOverview?.quality || {};
  const ultraComplaints = ultraOverview?.complaints || ultraOverview?.complaints_monitoring || {};

  const avgMonthlySalary = pickFirstNumericValue(
    ultraFinance?.avg_monthly_salary,
    ultraFinance?.average_monthly_salary,
    ultraFinance?.monthly_salary_avg,
    ultraFinance?.salaire_mensuel_moyen,
  );
  const avgMonthlyExpenses = pickFirstNumericValue(
    ultraFinance?.avg_monthly_expenses,
    ultraFinance?.average_monthly_expenses,
    ultraFinance?.monthly_expenses_avg,
    ultraFinance?.depenses_mensuelles_moyennes,
  );
  const avgMonthlySavings = pickFirstNumericValue(
    ultraFinance?.avg_net_monthly_savings,
    ultraFinance?.average_net_monthly_savings,
    ultraFinance?.monthly_savings_avg,
    ultraFinance?.epargne_mensuelle_moyenne,
  );
  const avgEstimatedBalance = pickFirstNumericValue(
    ultraFinance?.avg_estimated_balance,
    ultraFinance?.average_estimated_balance,
    ultraFinance?.estimated_balance_avg,
    ultraFinance?.solde_estime_moyen,
  );
  const avgFinancialScore = pickFirstNumericValue(
    ultraFinance?.avg_financial_score,
    ultraFinance?.average_financial_score,
    ultraFinance?.financial_score_avg,
    ultraFinance?.score_financier_moyen,
  );
  const regularIncomeRate = pickFirstNumericValue(
    ultraFinance?.regular_income_rate,
    ultraFinance?.regular_income_percentage,
    ultraFinance?.taux_revenu_regulier,
  );

  const clientsWithExistingProducts = pickFirstNumericValue(
    ultraProducts?.clients_with_existing_products,
    ultraProducts?.clientsWithExistingProducts,
  );
  const clientsWithRecommendations = pickFirstNumericValue(
    ultraProducts?.clients_with_recommendations,
    ultraProducts?.clientsWithRecommendations,
  );

  const topExistingProducts = normalizeCounterRows(
    ultraProducts?.top_existing_products ||
      ultraProducts?.topExistingProducts ||
      ultraProducts?.existing_products_distribution ||
      [],
  );
  const topRecommendedProducts = normalizeCounterRows(
    ultraProducts?.top_recommended_products ||
      ultraProducts?.topRecommendedProducts ||
      ultraProducts?.recommended_products_distribution ||
      [],
  );

  const ageRanges = normalizeCounterRows(
    ultraDistribution?.age_ranges || ultraDistribution?.ageRanges || ultraDistribution?.tranche_age || [],
  );
  const familyStatuses = normalizeCounterRows(
    ultraDistribution?.family_statuses || ultraDistribution?.familyStatuses || ultraDistribution?.situation_familiale || [],
  );
  const employmentStatuses = normalizeCounterRows(
    ultraDistribution?.employment_statuses || ultraDistribution?.employmentStatuses || ultraDistribution?.statut_professionnel || [],
  );
  const educationLevels = normalizeCounterRows(
    ultraDistribution?.education_levels || ultraDistribution?.educationLevels || ultraDistribution?.niveau_etudes || [],
  );
  const financialObjectives = normalizeCounterRows(
    ultraDistribution?.financial_objectives || ultraDistribution?.financialObjectives || ultraDistribution?.objectif_financier || [],
  );
  const riskToleranceRows = normalizeCounterRows(
    ultraDistribution?.risk_tolerance || ultraDistribution?.riskTolerance || ultraDistribution?.tolerance_risque || [],
  );

  const missingGovernorate = pickFirstNumericValue(
    ultraDataQuality?.missing_gouvernorat,
    ultraDataQuality?.missing_governorate,
  );
  const missingPostalCode = pickFirstNumericValue(
    ultraDataQuality?.missing_code_postal,
    ultraDataQuality?.missing_postal_code,
  );
  const unknownAgencyLabels = pickFirstNumericValue(
    ultraDataQuality?.unknown_agence_labels,
    ultraDataQuality?.unknown_agency_labels,
  );
  const formCompletionRateUltra = pickFirstNumericValue(
    ultraDataQuality?.form_completion_rate,
    ultraDataQuality?.forms_completion_rate,
    formsCompletionRate,
  );

  const complaintsTotal = pickFirstNumericValue(ultraComplaints?.total, ultraComplaints?.total_complaints);
  const complaintsOpen = pickFirstNumericValue(ultraComplaints?.open, ultraComplaints?.open_complaints);
  const complaintsClosed = pickFirstNumericValue(ultraComplaints?.closed, ultraComplaints?.closed_complaints);

  const hasUltraFinanceData = [
    avgMonthlySalary,
    avgMonthlyExpenses,
    avgMonthlySavings,
    avgEstimatedBalance,
    avgFinancialScore,
    regularIncomeRate,
  ].some((value) => value !== null);
  const hasUltraBreakdownData = [
    ageRanges,
    familyStatuses,
    employmentStatuses,
    educationLevels,
    financialObjectives,
    riskToleranceRows,
    topExistingProducts,
    topRecommendedProducts,
  ].some((rows) => rows.length > 0);
  const hasUltraData = hasUltraFinanceData || hasUltraBreakdownData;
  const agentDisplayName = agentProfile?.full_name || agentProfile?.agent_id || ui.agentFallbackName;
  const ultraClientTarget = 5000;
  const eligibilityBase = Math.max(
    totalClients,
    loanEligibleCount + loanPartialCount + loanNotEligibleCount,
    1,
  );
  const clientsTargetBase = Math.max(ultraClientTarget, totalClients, 1);
  const ultraEligibilityCircles = [
    {
      key: "eligible",
      label: ui.eligibleCircleLabel,
      value: loanEligibleCount,
      total: eligibilityBase,
      strokeColor: "#0A4DB3",
    },
    {
      key: "partial",
      label: ui.partiallyCircleLabel,
      value: loanPartialCount,
      total: eligibilityBase,
      strokeColor: "#2d73da",
    },
    {
      key: "not-eligible",
      label: ui.notEligibleCircleLabel,
      value: loanNotEligibleCount,
      total: eligibilityBase,
      strokeColor: "#dc2626",
    },
    {
      key: "clients-target",
      label: ui.clientsTargetCircleLabel,
      value: totalClients,
      total: clientsTargetBase,
      strokeColor: "#1e3a8a",
    },
  ];

  const showSyncAction = missingAgencies > 0;
  const syncButtonLabel = ui.syncAgenciesMissing;
  const ultraPageItems = [
    { key: "finance", label: ui.ultraTitle, tone: "finance" },
    { key: "demographics", label: ui.demographicsTitle, tone: "demographics" },
    { key: "products", label: ui.productsInsightsTitle, tone: "products" },
    { key: "objectives", label: ui.objectivesRiskTitle, tone: "objectives" },
    { key: "quality", label: ui.dataQualityTitle, tone: "quality" },
  ];
  const ultraPageCount = ultraPageItems.length;
  const activeUltraItem = ultraPageItems[activeUltraPage] || ultraPageItems[0];
  const ultraMutedTextClass = "text-slate-700";

  const goPrevUltraPage = () => {
    setActiveUltraPage((previous) => Math.max(0, previous - 1));
  };

  const goNextUltraPage = () => {
    setActiveUltraPage((previous) => Math.min(ultraPageCount - 1, previous + 1));
  };

  const pageBg = theme === "dark" ? "bg-[#0f172a] text-white" : "bg-white text-black";
  const navbarClass =
    theme === "dark" ? "border-white/10 bg-[#101b31]" : "border-slate-200 bg-white";
  const panelClass =
    theme === "dark"
      ? "rounded-2xl border border-white/10 bg-[#14233b] p-5"
      : "rounded-2xl border border-slate-200 bg-white p-5 text-black";
  const softCardClass =
    theme === "dark"
      ? "rounded-xl border border-white/10 bg-white/5 p-3"
      : "rounded-xl border border-slate-200 bg-white p-3 text-black";
  const sectionCardClass =
    theme === "dark"
      ? "rounded-2xl border border-white/10 bg-[#0f1d33] p-4"
      : "rounded-2xl border border-slate-200 bg-white p-4 text-black";
  const importantSectionClass =
    theme === "dark"
      ? "rounded-2xl border border-red-300/40 bg-red-500/10 p-4"
      : "rounded-2xl border border-red-300 bg-red-50 p-4";
  const importantItemClass =
    theme === "dark"
      ? "rounded-xl border border-red-300/35 bg-red-500/10 p-3"
      : "rounded-xl border border-red-200 bg-white p-3";
  const importantLabelClass = theme === "dark" ? "text-red-100" : "text-red-700";
  const mutedTextClass = theme === "dark" ? "text-white/65" : "text-slate-600";

  const inputClass =
    theme === "dark"
      ? "w-full rounded-xl border border-white/15 bg-[#0d192c] px-3 py-2.5 text-sm text-white placeholder:text-white/40"
      : "w-full rounded-xl border border-slate-300 bg-white px-3 py-2.5 text-sm text-black placeholder:text-slate-400";

  const primaryButtonClass =
    "inline-flex items-center justify-center gap-2 rounded-xl bg-[#0A4DB3] px-4 py-2.5 text-sm font-semibold text-white hover:bg-[#083f94] disabled:cursor-not-allowed disabled:opacity-60";
  const secondaryButtonClass =
    "inline-flex items-center justify-center gap-2 rounded-xl border border-[#0A4DB3] bg-[#0A4DB3] px-4 py-2.5 text-sm font-extrabold text-white hover:bg-[#083f94] disabled:cursor-not-allowed disabled:opacity-60";

  const workspaceTabs = [
    { key: "ultra", label: ui.tabUltra, Icon: FileCheck2 },
    { key: "agencies", label: ui.tabAgencies, Icon: MapPinned },
    { key: "complaints", label: ui.tabComplaints, Icon: AlertCircle },
    { key: "clients", label: ui.tabClients, Icon: Search },
  ];

  const getWorkspaceTabClass = (isActive) => {
    if (isActive) {
      return "flex w-full items-center justify-center gap-2 rounded-xl border border-[#0A4DB3] bg-[#0A4DB3] px-3 py-3 text-sm font-extrabold uppercase tracking-wide text-white shadow-sm transition";
    }

    return `flex w-full items-center justify-center gap-2 rounded-xl border px-3 py-3 text-sm font-bold uppercase tracking-wide transition ${
      theme === "dark"
        ? "border-white/10 bg-[#0f1d33] text-white/85 hover:border-blue-300/50 hover:bg-[#12233d]"
        : "border-slate-300 bg-white text-black hover:border-blue-300 hover:bg-blue-50"
    }`;
  };

  const getUltraPanelClass = (tone) => {
    void tone;
    return "rounded-2xl border border-[#c9d8ec] bg-white p-4 text-black";
  };

  const renderCounterRows = (rows, limit = 5, variant = "default") => {
    const isUltraVariant = variant === "ultra";
    const normalizedRows = normalizeCounterRows(rows);

    if (!normalizedRows.length) {
      return (
        <p
          className={`rounded-xl border px-3 py-2 text-sm ${
            isUltraVariant ? "border-[#d5e2f4] bg-white text-slate-700" : mutedTextClass
          }`}
        >
          {ui.noStatsYet}
        </p>
      );
    }

    return (
      <div className="space-y-2">
        {normalizedRows.slice(0, limit).map((item, index) => (
          <div
            key={`${item.name}-${item.count}`}
            className={`${
              isUltraVariant ? "rounded-xl border border-[#d5e2f4] bg-white p-3" : softCardClass
            } flex items-center justify-between gap-3`}
          >
            <div className="flex items-center gap-2 text-sm">
              <span
                className={`inline-flex h-5 min-w-5 items-center justify-center rounded-full text-[10px] font-extrabold ${
                  isUltraVariant
                    ? "bg-[#eaf2ff] text-[#214b89]"
                    : theme === "dark"
                      ? "bg-white/12 text-white/85"
                      : "bg-[#dde9f9] text-[#2f4a70]"
                }`}
              >
                {index + 1}
              </span>
              <span className={`font-medium ${isUltraVariant ? "text-black" : ""}`}>{item.name}</span>
            </div>
            <div className={`text-sm ${isUltraVariant ? "text-black" : ""}`}>
              <span className="font-bold">{item.count.toLocaleString()}</span>
            </div>
          </div>
        ))}
      </div>
    );
  };

  const clientSectionCount = 4;

  const goPrevClientSection = () => {
    setActiveFeaturePage((previous) => Math.max(0, previous - 1));
  };

  const goNextClientSection = () => {
    setActiveFeaturePage((previous) => Math.min(clientSectionCount - 1, previous + 1));
  };

  const searchForm = () => (
    <form onSubmit={handleSearch} className="flex flex-col gap-3 sm:flex-row">
      <input
        value={cin}
        onChange={(event) => setCin(event.target.value)}
        placeholder={ui.searchPlaceholder}
        className={`${inputClass} ${isRTL ? "text-right" : "text-left"}`}
      />
      <button type="submit" disabled={searching} className={primaryButtonClass}>
        <Search size={16} />
        {searching ? ui.searching : ui.runSearch}
      </button>
    </form>
  );

  const renderFieldCard = (label, value) => (
    <div className={softCardClass}>
      <p className={`text-[11px] font-semibold uppercase tracking-wide ${mutedTextClass}`}>{label}</p>
      <p className="mt-1 text-sm font-semibold">{value}</p>
    </div>
  );

  const renderUltraFieldCard = (label, value) => (
    <div className="rounded-xl border border-[#d5e2f4] bg-white p-3">
      <p className="text-[11px] font-semibold uppercase tracking-wide text-slate-600">{label}</p>
      <p className="mt-1 text-sm font-semibold text-black">{value}</p>
    </div>
  );

  const renderImportantCard = (label, value) => (
    <div className={importantItemClass}>
      <p className={`text-[11px] font-semibold uppercase tracking-wide ${importantLabelClass}`}>{label}</p>
      <p className="mt-1 text-base font-bold">{value}</p>
    </div>
  );

  return (
    <div className={`min-h-screen ${pageBg}`} dir={isRTL ? "rtl" : "ltr"}>
      <div className="fixed left-3 top-1/2 z-30 -translate-y-1/2 sm:left-5">
        <div
          className={`inline-flex flex-col items-stretch gap-1 rounded-2xl border p-1.5 ${
            theme === "dark" ? "border-white/20 bg-[#0f1d34]" : "border-[#d4ddec] bg-[#f4f7fc]"
          }`}
        >
          {languageOptions.map((item) => {
            const isActive = language === item.code;
            return (
              <button
                key={item.code}
                type="button"
                onClick={() => setLanguage(item.code)}
                className={`inline-flex h-9 w-9 items-center justify-center rounded-xl text-[11px] font-semibold transition ${
                  isActive
                    ? theme === "dark"
                      ? "bg-[#1f4b8f] text-white"
                      : "bg-[#0A2240] text-white"
                    : theme === "dark"
                      ? "text-white/85 hover:bg-white/10"
                      : "text-[#3d5174] hover:bg-[#e7eef9]"
                }`}
                aria-pressed={isActive}
                aria-label={item.aria}
              >
                <img src={item.flag} alt={item.flagAlt} className="h-4 w-4 rounded-full object-cover" />
              </button>
            );
          })}
        </div>
      </div>

      <header className={`border-b px-5 py-4 sm:px-8 ${navbarClass}`}>
        <div className="mx-auto grid w-full max-w-7xl grid-cols-[1fr_auto_1fr] items-center gap-3">
          <div />

          <div className="flex justify-center">
            <img src={logoExpanded} alt="BH Bank" className="h-10 w-auto sm:h-11" />
          </div>

          <div className="flex items-center justify-end gap-2 sm:gap-3">
            
            <button
              type="button"
              onClick={handleLogout}
              className="inline-flex items-center gap-2 rounded-xl border border-rose-300 bg-rose-50 px-3 py-2 text-sm font-medium text-rose-700 hover:bg-rose-100"
            >
              <LogOut size={16} />
              {ui.logout}
            </button>
          </div>
        </div>
      </header>

      <main className="mx-auto w-full max-w-7xl px-5 py-6 sm:px-8">
        <section className={`${panelClass} mb-4`}>
          <p className={`text-sm font-semibold ${mutedTextClass}`}>{ui.welcomeLabel}</p>
          <p className="mt-1 text-xl font-bold">{agentDisplayName}</p>
        </section>

        {pageError && (
          <div
            className={`mb-4 rounded-xl border px-4 py-3 text-sm ${
              theme === "dark"
                ? "border-red-900/60 bg-red-950/40 text-red-300"
                : "border-red-200 bg-red-50 text-red-700"
            }`}
          >
            {pageError}
          </div>
        )}

        {loadingAgent ? (
          <AgentWorkspaceSkeleton isDark={theme === "dark"} />
        ) : (
          <>
            <section className={`${panelClass} mb-6`}>
              <div className="flex flex-col items-center gap-2">
                <label className="w-full sm:w-52 space-y-1">
                    <span className={`text-[11px] font-semibold uppercase tracking-wide ${mutedTextClass}`}>
                      {ui.reportMonthLabel}
                    </span>
                    <input
                      type="month"
                      value={reportMonth}
                      onChange={(event) => setReportMonth(event.target.value)}
                      className={`${inputClass} h-11 w-full`}
                    />
                </label>

                <div className={`flex w-full max-w-md flex-col items-center justify-center gap-2 sm:flex-row sm:items-end ${isRTL ? "sm:flex-row-reverse" : ""}`}>
                  <label className="w-full sm:w-52 space-y-1">
                      <span className={`text-[11px] font-semibold uppercase tracking-wide ${mutedTextClass}`}>
                        {ui.reportFormatLabel}
                      </span>
                      <select
                        value={reportFormat}
                        onChange={(event) => setReportFormat(event.target.value)}
                        className={`${inputClass} h-11 w-full`}
                      >
                        <option value="xlsx">{ui.reportFormatXlsx}</option>
                        <option value="pdf">{ui.reportFormatPdf}</option>
                      </select>
                    </label>

                  <button
                    type="button"
                    onClick={handleDownloadMonthlyReport}
                    disabled={downloadingReport || dashboardLoading}
                    className={`${primaryButtonClass} h-11 w-full sm:w-52 justify-center px-3`}
                  >
                    <Download size={16} className={downloadingReport ? "animate-pulse" : ""} />
                    {downloadingReport ? ui.downloadingMonthlyReport : ui.downloadMonthlyReport}
                  </button>
                </div>

                {showSyncAction && (
                  <button
                    type="button"
                    onClick={handleSyncAgencies}
                    disabled={syncingAgencies || dashboardLoading}
                    className={secondaryButtonClass}
                  >
                    <RefreshCw size={16} className={syncingAgencies ? "animate-spin" : ""} />
                    {syncingAgencies ? ui.syncingAgencies : syncButtonLabel}
                  </button>
                )}
              </div>

              {dashboardLoading && <p className={`mt-3 text-sm ${mutedTextClass}`}>{ui.loadingPortfolio}</p>}

              {dashboardError && (
                <p
                  className={`mt-4 rounded-xl border px-3 py-2 text-sm ${
                    theme === "dark"
                      ? "border-red-900/60 bg-red-950/40 text-red-300"
                      : "border-red-200 bg-red-50 text-red-700"
                  }`}
                >
                  {dashboardError}
                </p>
              )}

              {syncFeedback && (
                <p
                  className={`mt-4 rounded-xl border px-3 py-2 text-sm ${
                    theme === "dark"
                      ? "border-emerald-900/60 bg-emerald-950/30 text-emerald-300"
                      : "border-emerald-200 bg-emerald-50 text-emerald-700"
                  }`}
                >
                  {syncFeedback}
                </p>
              )}

              {reportFeedback && (
                <p
                  className={`mt-4 rounded-xl border px-3 py-2 text-sm ${
                    reportFeedbackError
                      ? theme === "dark"
                        ? "border-red-900/60 bg-red-950/40 text-red-300"
                        : "border-red-200 bg-red-50 text-red-700"
                      : theme === "dark"
                        ? "border-blue-800/60 bg-blue-950/35 text-blue-200"
                        : "border-blue-200 bg-blue-50 text-blue-700"
                  }`}
                >
                  {reportFeedback}
                </p>
              )}
            </section>

            <section
              className={`${activeWorkspaceTab === "agencies" ? "relative" : "sticky top-3 z-20"} mb-6 rounded-2xl border p-2 backdrop-blur transition-all duration-200 ${
                activeWorkspaceTab === "agencies" && hideWorkspaceNavOnScroll
                  ? "pointer-events-none -translate-y-3 opacity-0"
                  : "opacity-100"
              } ${
                theme === "dark"
                  ? "border-white/10 bg-linear-to-r from-[#0d1c30] via-[#102645] to-[#112d55]"
                  : "border-[#c9d8ec] bg-linear-to-r from-[#f4f9ff] via-[#edf5ff] to-[#e8f1ff]"
              }`}
            >
              <div className="grid gap-2 sm:grid-cols-4">
                {workspaceTabs.map((tab) => {
                  const isActive = activeWorkspaceTab === tab.key;
                  const Icon = tab.Icon;
                  return (
                    <button
                      key={tab.key}
                      type="button"
                      onClick={() => setActiveWorkspaceTab(tab.key)}
                      className={getWorkspaceTabClass(isActive)}
                    >
                      <Icon size={15} />
                      {tab.label}
                    </button>
                  );
                })}
              </div>
              <p className={`mt-2 px-2 text-[11px] font-semibold tracking-wide ${mutedTextClass}`}>
                {ui.workspaceNavHint}
              </p>
            </section>

            {activeWorkspaceTab === "ultra" && !hasUltraData && (
              <section
                className={`mb-6 rounded-2xl border px-4 py-3 text-sm ${
                  theme === "dark"
                    ? "border-amber-300/40 bg-amber-500/10 text-amber-100"
                    : "border-amber-300 bg-amber-50 text-amber-900"
                }`}
              >
                <p className="font-extrabold">{ui.ultraDataMissingTitle}</p>
                <p className="mt-1 opacity-90">{ui.ultraDataMissingHint}</p>
              </section>
            )}

            {activeWorkspaceTab === "ultra" && (
              <section className="mb-6">
                <article className="mb-4 rounded-2xl border border-[#c9d8ec] bg-white p-4">
                  <h3 className="text-lg font-bold text-black">{ui.eligibilityCirclesTitle}</h3>
                  <div className="mt-3 grid gap-3 sm:grid-cols-2 xl:grid-cols-4">
                    {ultraEligibilityCircles.map((item) => (
                      <CircleStatCard
                        key={item.key}
                        label={item.label}
                        value={item.value}
                        total={item.total}
                        strokeColor={item.strokeColor}
                      />
                    ))}
                  </div>
                </article>

                <div className={`mb-4 flex items-center justify-between gap-2 ${isRTL ? "flex-row-reverse" : ""}`}>
                  <button
                    type="button"
                    onClick={goPrevUltraPage}
                    disabled={activeUltraPage === 0}
                    className="inline-flex min-w-24 items-center justify-center rounded-xl border border-blue-700 bg-blue-700 px-3 py-2 text-sm font-semibold text-white disabled:cursor-not-allowed disabled:opacity-40"
                  >
                    {ui.ultraPrev}
                  </button>

                  <div className="rounded-xl border border-[#c9d8ec] bg-white px-3 py-2 text-center">
                    <p className="text-[11px] font-semibold uppercase tracking-wide text-slate-600">
                      {ui.ultraPageLabel} {activeUltraPage + 1} / {ultraPageCount}
                    </p>
                    <p className="text-sm font-bold text-black">{activeUltraItem.label}</p>
                  </div>

                  <button
                    type="button"
                    onClick={goNextUltraPage}
                    disabled={activeUltraPage === ultraPageCount - 1}
                    className="inline-flex min-w-24 items-center justify-center rounded-xl border border-blue-700 bg-blue-700 px-3 py-2 text-sm font-semibold text-white disabled:cursor-not-allowed disabled:opacity-40"
                  >
                    {ui.ultraNext}
                  </button>
                </div>

                {activeUltraItem.key === "finance" && (
                  <article className={getUltraPanelClass("finance")}>
                    <h3 className="text-lg font-bold text-black">{ui.ultraTitle}</h3>
                    <p className="mt-1 text-base font-semibold text-black">{ui.ultraSubtitle}</p>

                    <h4 className="mt-4 text-sm font-semibold text-black">{ui.financeSnapshotTitle}</h4>
                    <div className="mt-2 grid gap-2 sm:grid-cols-2 lg:grid-cols-3">
                      {renderUltraFieldCard(ui.avgSalaryLabel, avgMonthlySalary === null ? ui.noData : formatMoney(avgMonthlySalary))}
                      {renderUltraFieldCard(ui.avgExpensesLabel, avgMonthlyExpenses === null ? ui.noData : formatMoney(avgMonthlyExpenses))}
                      {renderUltraFieldCard(ui.avgSavingsLabel, avgMonthlySavings === null ? ui.noData : formatMoney(avgMonthlySavings))}
                      {renderUltraFieldCard(ui.avgBalanceLabel, avgEstimatedBalance === null ? ui.noData : formatMoney(avgEstimatedBalance))}
                      {renderUltraFieldCard(ui.avgScoreLabel, avgFinancialScore === null ? ui.noData : `${avgFinancialScore.toFixed(1)}/100`)}
                      {renderUltraFieldCard(ui.regularIncomeRateLabel, regularIncomeRate === null ? ui.noData : `${regularIncomeRate.toFixed(1)}%`)}
                    </div>
                  </article>
                )}

                {activeUltraItem.key === "demographics" && (
                  <article className={getUltraPanelClass("demographics")}>
                    <h3 className="text-lg font-bold text-black">{ui.demographicsTitle}</h3>

                    <div className="mt-3 grid gap-4 md:grid-cols-2">
                      <div>
                        <p className={`mb-2 text-xs font-semibold uppercase tracking-wide ${ultraMutedTextClass}`}>
                          {ui.topAgeRangesLabel}
                        </p>
                        {renderCounterRows(ageRanges, 4, "ultra")}
                      </div>

                      <div>
                        <p className={`mb-2 text-xs font-semibold uppercase tracking-wide ${ultraMutedTextClass}`}>
                          {ui.topFamilyStatusLabel}
                        </p>
                        {renderCounterRows(familyStatuses, 4, "ultra")}
                      </div>

                      <div>
                        <p className={`mb-2 text-xs font-semibold uppercase tracking-wide ${ultraMutedTextClass}`}>
                          {ui.topEmploymentStatusLabel}
                        </p>
                        {renderCounterRows(employmentStatuses, 4, "ultra")}
                      </div>

                      <div>
                        <p className={`mb-2 text-xs font-semibold uppercase tracking-wide ${ultraMutedTextClass}`}>
                          {ui.topEducationLabel}
                        </p>
                        {renderCounterRows(educationLevels, 4, "ultra")}
                      </div>
                    </div>
                  </article>
                )}

                {activeUltraItem.key === "products" && (
                  <article className={getUltraPanelClass("products")}>
                    <h3 className="text-lg font-bold text-black">{ui.productsInsightsTitle}</h3>
                    <div className="mt-3 grid gap-2 sm:grid-cols-2 xl:grid-cols-1">
                      {renderUltraFieldCard(
                        ui.clientsWithProductsLabel,
                        clientsWithExistingProducts === null ? ui.noData : Math.round(clientsWithExistingProducts).toLocaleString(),
                      )}
                      {renderUltraFieldCard(
                        ui.clientsWithRecommendationsLabel,
                        clientsWithRecommendations === null ? ui.noData : Math.round(clientsWithRecommendations).toLocaleString(),
                      )}
                    </div>

                    <div className="mt-4">
                      <p className={`mb-2 text-xs font-semibold uppercase tracking-wide ${ultraMutedTextClass}`}>
                        {ui.topExistingProductsLabel}
                      </p>
                      {renderCounterRows(topExistingProducts, 5, "ultra")}
                    </div>

                    <div className="mt-4">
                      <p className={`mb-2 text-xs font-semibold uppercase tracking-wide ${ultraMutedTextClass}`}>
                        {ui.topRecommendedProductsLabel}
                      </p>
                      {renderCounterRows(topRecommendedProducts, 5, "ultra")}
                    </div>
                  </article>
                )}

                {activeUltraItem.key === "objectives" && (
                  <article className={getUltraPanelClass("objectives")}>
                    <h3 className="text-lg font-bold text-black">{ui.objectivesRiskTitle}</h3>

                    <div className="mt-3">
                      <p className={`mb-2 text-xs font-semibold uppercase tracking-wide ${ultraMutedTextClass}`}>
                        {ui.topObjectivesLabel}
                      </p>
                      {renderCounterRows(financialObjectives, 5, "ultra")}
                    </div>

                    <div className="mt-4">
                      <p className={`mb-2 text-xs font-semibold uppercase tracking-wide ${ultraMutedTextClass}`}>
                        {ui.topRiskToleranceLabel}
                      </p>
                      {renderCounterRows(riskToleranceRows, 5, "ultra")}
                    </div>
                  </article>
                )}

                {activeUltraItem.key === "quality" && (
                  <article className={getUltraPanelClass("quality")}>
                    <h3 className="text-lg font-bold text-black">{ui.dataQualityTitle}</h3>
                    <div className="mt-3 grid gap-2">
                      {renderUltraFieldCard(
                        ui.formCompletionRateLabel,
                        formCompletionRateUltra === null ? ui.noData : `${formCompletionRateUltra.toFixed(1)}%`,
                      )}
                      {renderUltraFieldCard(ui.missingAgenciesLabel, missingAgencies.toLocaleString())}
                      {renderUltraFieldCard(
                        ui.missingGovernorateLabel,
                        missingGovernorate === null ? ui.noData : Math.round(missingGovernorate).toLocaleString(),
                      )}
                      {renderUltraFieldCard(
                        ui.missingPostalCodeLabel,
                        missingPostalCode === null ? ui.noData : Math.round(missingPostalCode).toLocaleString(),
                      )}
                      {renderUltraFieldCard(
                        ui.unknownAgencyLabelsLabel,
                        unknownAgencyLabels === null ? ui.noData : Math.round(unknownAgencyLabels).toLocaleString(),
                      )}
                    </div>

                    <h4 className="mt-5 text-sm font-semibold text-black">{ui.complaintsTitle}</h4>
                    <div className="mt-2 grid gap-2 sm:grid-cols-3 xl:grid-cols-1">
                      {renderUltraFieldCard(
                        ui.totalComplaintsLabel,
                        complaintsTotal === null ? ui.noData : Math.round(complaintsTotal).toLocaleString(),
                      )}
                      {renderUltraFieldCard(
                        ui.openComplaintsLabel,
                        complaintsOpen === null ? ui.noData : Math.round(complaintsOpen).toLocaleString(),
                      )}
                      {renderUltraFieldCard(
                        ui.closedComplaintsLabel,
                        complaintsClosed === null ? ui.noData : Math.round(complaintsClosed).toLocaleString(),
                      )}
                    </div>
                  </article>
                )}
              </section>
            )}

            {activeWorkspaceTab === "agencies" && (
              <section className="mb-6 grid gap-6 xl:grid-cols-[1.35fr_1fr]">
              <article className={panelClass}>
                <h3 className="text-lg font-bold">{ui.agencyMapTitle}</h3>
                <p className={`mt-1 text-sm ${mutedTextClass}`}>{ui.agencyMapHint}</p>

                <div className="mt-4">
                  <AgencyBubbleMap
                    agencies={agencyRows}
                    selectedAgencyName={selectedAgencyName}
                    onSelectAgency={setSelectedAgencyName}
                    ui={ui}
                    isDark={theme === "dark"}
                  />
                </div>

                {selectedAgency && (
                  <div className="mt-4 grid gap-2 sm:grid-cols-3">
                    {renderFieldCard(ui.selectedAgency, displayValue(selectedAgency?.name))}
                    {renderFieldCard(ui.totalClientsLabel, Number(selectedAgency?.count || 0).toLocaleString())}
                    {renderFieldCard(ui.regionsTitle, displayValue(selectedAgency?.region))}
                  </div>
                )}
              </article>

              <article className={panelClass}>
                <h3 className="text-lg font-bold">{ui.topAgenciesTitle}</h3>
                <div className="mt-3 space-y-2">
                  {agenciesWithClients.length > 0 ? (
                    agenciesWithClients.slice(0, 8).map((agency) => {
                      const isSelected = selectedAgencyName === agency?.name;
                      return (
                        <button
                          key={agency?.name}
                          type="button"
                          onClick={() => setSelectedAgencyName(agency?.name || "")}
                          className={`flex w-full items-center justify-between rounded-xl border px-3 py-2 text-left text-sm transition ${
                            isSelected
                              ? theme === "dark"
                                ? "border-sky-300/60 bg-sky-500/20"
                                : "border-sky-300 bg-sky-50"
                              : theme === "dark"
                                ? "border-white/10 bg-[#0f1d33] hover:bg-[#12233d]"
                                : "border-slate-200 bg-white hover:bg-blue-50"
                          }`}
                        >
                          <span>{agency?.name}</span>
                          <span className="font-bold">{Number(agency?.count || 0).toLocaleString()}</span>
                        </button>
                      );
                    })
                  ) : (
                    <p className={`rounded-xl border px-3 py-2 text-sm ${mutedTextClass}`}>{ui.noAgencyData}</p>
                  )}
                </div>

                <h4 className="mt-5 text-sm font-semibold">{ui.regionsTitle}</h4>
                <div className="mt-2 space-y-2">
                  {regionRows.map((region) => {
                    const count = Number(region?.count || 0);
                    const regionName = region?.name || "Autres zones";
                    const ratio = totalClients > 0 ? Math.max(2, Math.round((count / totalClients) * 100)) : 0;
                    const color = regionColorByName[regionName] || regionColorByName["Autres zones"];

                    return (
                      <div key={regionName} className={softCardClass}>
                        <div className="flex items-center justify-between text-xs font-semibold">
                          <span>{regionName}</span>
                          <span>{count.toLocaleString()}</span>
                        </div>
                        <div className={`mt-2 h-2.5 overflow-hidden rounded-full ${theme === "dark" ? "bg-white/10" : "bg-slate-100"}`}>
                          <div className="h-full rounded-full" style={{ width: `${ratio}%`, backgroundColor: color }} />
                        </div>
                      </div>
                    );
                  })}
                </div>

                <h4 className="mt-5 text-sm font-semibold">{ui.largestAgencyTitle}</h4>
                <div className="mt-2 space-y-2">
                  {biggestAgencyByRegion.length > 0 ? (
                    biggestAgencyByRegion.map((item) => (
                      <div key={item.region} className={softCardClass}>
                        <div className="flex items-center justify-between text-xs font-semibold">
                          <span>{item.region}</span>
                          <span>{item.count.toLocaleString()}</span>
                        </div>
                        <p className="mt-1 text-sm font-medium">{item.name}</p>
                      </div>
                    ))
                  ) : (
                    <p className={`rounded-xl border px-3 py-2 text-sm ${mutedTextClass}`}>{ui.noAgencyData}</p>
                  )}
                </div>
              </article>
              </section>
            )}

            {activeWorkspaceTab === "complaints" && (
              <section className="mb-6">
                <article className={panelClass}>
                  <div className="flex flex-col gap-3 lg:flex-row lg:items-center lg:justify-between">
                    <div>
                      <h2 className="text-lg font-bold">{complaintsUi.inboxTitle}</h2>
                      <p className={`mt-1 text-sm ${mutedTextClass}`}>{complaintsUi.inboxSubtitle}</p>
                    </div>

                    <div className="flex flex-col gap-2 sm:flex-row sm:items-end">
                      <label className="space-y-1">
                        <span className={`text-[11px] font-semibold uppercase tracking-wide ${mutedTextClass}`}>
                          {complaintsUi.filterLabel}
                        </span>
                        <select
                          value={agentComplaintFilter}
                          onChange={(event) => setAgentComplaintFilter(event.target.value)}
                          className={`${inputClass} sm:w-auto`}
                          disabled={agentComplaintsLoading}
                        >
                          <option value="open">{complaintsUi.filterOpen}</option>
                          <option value="submitted">{complaintsUi.filterSubmitted}</option>
                          <option value="in_progress">{complaintsUi.filterInProgress}</option>
                          <option value="resolved">{complaintsUi.filterResolved}</option>
                          <option value="rejected">{complaintsUi.filterRejected}</option>
                          <option value="assigned_to_me">{complaintsUi.filterAssignedToMe}</option>
                          <option value="unassigned">{complaintsUi.filterUnassigned}</option>
                        </select>
                      </label>

                      <button
                        type="button"
                        onClick={() => loadAgentComplaints(agentComplaintFilter)}
                        disabled={agentComplaintsLoading}
                        className={secondaryButtonClass}
                      >
                        <RefreshCw size={16} className={agentComplaintsLoading ? "animate-spin" : ""} />
                        {complaintsUi.refresh}
                      </button>
                    </div>
                  </div>

                  {agentComplaintsError && (
                    <div
                      className={`mt-4 flex items-center gap-2 rounded-xl border px-3 py-2 text-sm ${
                        theme === "dark"
                          ? "border-red-900/60 bg-red-950/40 text-red-300"
                          : "border-red-200 bg-red-50 text-red-700"
                      }`}
                    >
                      <AlertCircle size={16} />
                      <span>{agentComplaintsError}</span>
                    </div>
                  )}

                  {agentComplaintsLoading ? (
                    <div className={`mt-4 rounded-xl border p-4 ${theme === "dark" ? "border-white/10" : "border-border"}`}>
                      <SkeletonLines
                        lines={6}
                        lineClassName="h-4 rounded-md"
                        lastLineClassName="w-4/6"
                      />
                    </div>
                  ) : agentComplaints.length === 0 ? (
                    <p className={`mt-4 text-sm ${mutedTextClass}`}>{complaintsUi.inboxEmpty}</p>
                  ) : (
                    <div className="mt-4 grid gap-3 xl:grid-cols-2">
                      {agentComplaints.map((complaint, index) => {
                        const complaintId = String(complaint?.id || "").trim();
                        const cardKey = complaintId || `inbox-row-${index}`;
                        const draft = agentComplaintDrafts[complaintId] || {};
                        const draftStatus = normalizeComplaintStatusValue(draft?.status || complaint?.status);
                        const draftResponse = String(
                          draft?.response ?? complaint?.response ?? complaint?.agent_response ?? "",
                        );
                        const isSaving = agentSavingComplaintId === complaintId;
                        const typeText =
                          getComplaintTypeLabel(complaint?.complaint_type, language) ||
                          String(complaint?.subject || "").trim() ||
                          "-";
                        const messageText = String(complaint?.message || complaint?.description || "").trim() || "-";
                        const clientNameValue = String(complaint?.client_name || "").trim() || "-";
                        const clientCinValue =
                          String(complaint?.client_cin || complaint?.client_id || "").trim() || "-";

                        return (
                          <article
                            key={cardKey}
                            className={`rounded-2xl border p-4 ${
                              theme === "dark" ? "border-white/10 bg-[#0f1d33]" : "border-slate-200 bg-white"
                            }`}
                          >
                            <div className="flex flex-wrap items-start justify-between gap-2">
                              <div>
                                <p className="text-sm font-semibold">{typeText}</p>
                                <p className={`mt-1 text-xs ${mutedTextClass}`}>
                                  {complaintsUi.client}: {clientNameValue} - {complaintsUi.clientCin}: {clientCinValue}
                                </p>
                              </div>

                              <div className="flex items-center gap-2">
                                {complaint?.assigned_to_me && (
                                  <span
                                    className={`inline-flex items-center rounded-full border px-2.5 py-1 text-xs font-semibold ${
                                      theme === "dark"
                                        ? "border-cyan-400/40 bg-cyan-500/20 text-cyan-100"
                                        : "border-cyan-200 bg-cyan-50 text-cyan-700"
                                    }`}
                                  >
                                    {complaintsUi.assignedToMe}
                                  </span>
                                )}

                                <span
                                  className={`inline-flex items-center rounded-full border px-2.5 py-1 text-xs font-semibold ${getComplaintStatusBadgeClass(
                                    draftStatus,
                                    theme,
                                  )}`}
                                >
                                  {getComplaintStatusLabel(draftStatus, language)}
                                </span>
                              </div>
                            </div>

                            <p className={`mt-2 text-xs ${mutedTextClass}`}>
                              {complaintsUi.createdAt}: {formatDateTime(complaint?.created_at, language)}
                            </p>

                            <div className="mt-3">
                              <p className={`text-[11px] font-semibold uppercase tracking-wide ${mutedTextClass}`}>
                                {complaintsUi.message}
                              </p>
                              <p className={`mt-1 text-sm leading-relaxed ${theme === "dark" ? "text-white" : "text-black"}`}>{messageText}</p>
                            </div>

                            <div className="mt-3 grid gap-3 lg:grid-cols-[220px_minmax(0,1fr)]">
                              <label className="space-y-1">
                                <span className={`text-[11px] font-semibold uppercase tracking-wide ${mutedTextClass}`}>
                                  {complaintsUi.status}
                                </span>
                                <select
                                  value={draftStatus}
                                  onChange={(event) =>
                                    handleAgentComplaintDraftChange(complaintId, {
                                      status: event.target.value,
                                    })
                                  }
                                  className={inputClass}
                                  disabled={isSaving || !complaintId}
                                >
                                  <option value="submitted">{getComplaintStatusLabel("submitted", language)}</option>
                                  <option value="in_progress">{getComplaintStatusLabel("in_progress", language)}</option>
                                  <option value="resolved">{getComplaintStatusLabel("resolved", language)}</option>
                                  <option value="rejected">{getComplaintStatusLabel("rejected", language)}</option>
                                </select>
                              </label>

                              <label className="space-y-1">
                                <span className={`text-[11px] font-semibold uppercase tracking-wide ${mutedTextClass}`}>
                                  {complaintsUi.response}
                                </span>
                                <textarea
                                  rows={3}
                                  value={draftResponse}
                                  onChange={(event) =>
                                    handleAgentComplaintDraftChange(complaintId, {
                                      response: event.target.value,
                                    })
                                  }
                                  className={`${inputClass} resize-y`}
                                  disabled={isSaving || !complaintId}
                                />
                              </label>
                            </div>

                            <div className="mt-3 flex justify-end">
                              <button
                                type="button"
                                onClick={() => handleSaveAgentComplaint(complaint)}
                                disabled={isSaving || !complaintId}
                                className={primaryButtonClass}
                              >
                                {isSaving ? complaintsUi.saving : complaintsUi.save}
                              </button>
                            </div>
                          </article>
                        );
                      })}
                    </div>
                  )}
                </article>
              </section>
            )}

            {activeWorkspaceTab === "clients" && (!searchPinned ? (
              <section className="flex min-h-[68vh] items-center justify-center">
                <div className={`${panelClass} w-full max-w-2xl`}>
                  <h2 className="text-lg font-bold">{ui.searchTitle}</h2>
                  <p className={`mt-1 text-sm ${mutedTextClass}`}>{ui.searchHintCenter}</p>
                  <div className="mt-4">{searchForm()}</div>
                  {searchError && (
                    <p
                      className={`mt-4 rounded-xl border px-3 py-2 text-sm ${
                        theme === "dark"
                          ? "border-red-900/60 bg-red-950/40 text-red-300"
                          : "border-red-200 bg-red-50 text-red-700"
                      }`}
                    >
                      {searchError}
                    </p>
                  )}
                </div>
              </section>
            ) : (
              <>
                <section className={`${panelClass} mb-6`}>
                  <p className={`mb-3 text-sm ${mutedTextClass}`}>{ui.searchHintTop}</p>
                  {searchForm()}
                </section>

                {searchError && (
                  <p
                    className={`mb-6 rounded-xl border px-3 py-2 text-sm ${
                      theme === "dark"
                        ? "border-red-900/60 bg-red-950/40 text-red-300"
                        : "border-red-200 bg-red-50 text-red-700"
                    }`}
                  >
                    {searchError}
                  </p>
                )}

                {!clientSummary && !searchError ? (
                  <div className={panelClass}>{ui.noResult}</div>
                ) : (
                  <section className="space-y-6">
                    <article className={panelClass}>
                      <div className={`flex items-center justify-between gap-2 ${isRTL ? "flex-row-reverse" : ""}`}>
                        <button
                          type="button"
                          onClick={goPrevClientSection}
                          disabled={activeFeaturePage === 0}
                          className="inline-flex min-w-24 items-center justify-center rounded-xl border border-[#0A4DB3] bg-[#0A4DB3] px-3 py-2 text-sm font-semibold text-white disabled:cursor-not-allowed disabled:opacity-40"
                        >
                          {ui.clientPrev}
                        </button>

                        <div className="rounded-xl border border-slate-200 bg-white px-3 py-2 text-center">
                          <p className="text-[11px] font-semibold uppercase tracking-wide text-slate-600">
                            {ui.clientPageLabel} {activeFeaturePage + 1} / {clientSectionCount}
                          </p>
                        </div>

                        <button
                          type="button"
                          onClick={goNextClientSection}
                          disabled={activeFeaturePage === clientSectionCount - 1}
                          className="inline-flex min-w-24 items-center justify-center rounded-xl border border-[#0A4DB3] bg-[#0A4DB3] px-3 py-2 text-sm font-semibold text-white disabled:cursor-not-allowed disabled:opacity-40"
                        >
                          {ui.clientNext}
                        </button>
                      </div>
                      <p className={`mt-2 text-xs font-semibold ${mutedTextClass}`}>{ui.clientViewSectionHint}</p>
                    </article>

                    {activeFeaturePage === 0 && (
                      <article className={panelClass}>
                        <h2 className="text-lg font-bold">{ui.clientCardTitle}</h2>
                        <div className="mt-4">
                          <div className="flex flex-col items-center gap-3 text-center">
                            <div className="h-24 w-24 overflow-hidden rounded-2xl border border-slate-200 bg-white">
                              {clientPhotoSrc && !photoFailed ? (
                                <img
                                  src={clientPhotoSrc}
                                  alt={clientName}
                                  className="h-full w-full object-cover"
                                  onError={() => setPhotoFailed(true)}
                                />
                              ) : (
                                <div className="flex h-full w-full items-center justify-center text-2xl font-bold text-primary">
                                  {clientInitials}
                                </div>
                              )}
                            </div>

                            <div className="max-w-xl">
                              <p className="text-lg font-extrabold tracking-tight">{clientName}</p>
                              <p className={`text-sm ${mutedTextClass}`}>
                                {ui.segmentLabel}: {displayValue(segmentation.rfm_segment)}
                              </p>
                              {(!clientPhotoSrc || photoFailed) && (
                                <p className={`mt-1 text-xs ${mutedTextClass}`}>{ui.photoMissing}</p>
                              )}
                            </div>
                          </div>

                          <div className="mt-4 grid gap-2 text-sm sm:grid-cols-2">
                            {renderFieldCard(ui.idLabel, displayValue(clientSummary?.client_id))}
                            {renderFieldCard(ui.scoreLabel, `${Number(clientSummary?.financial_score || 0).toFixed(0)}/100`)}
                            {renderFieldCard(ui.riskLevel, displayValue(loanDecision?.risk_level))}
                            {renderFieldCard(ui.regularIncome, clientSummary?.has_regular_income ? ui.yes : ui.no)}
                            {renderFieldCard(ui.formCompleted, clientSummary?.form_completed ? ui.yes : ui.no)}
                            {renderFieldCard(ui.ageRange, displayValue(clientProfile?.tranche_age))}
                            {renderFieldCard(ui.familyStatus, displayValue(clientProfile?.situation_familiale))}
                            {renderFieldCard(ui.professionStatus, displayValue(clientProfile?.statut_professionnel))}
                            {renderFieldCard(ui.objectiveLabel, displayValue(clientProfile?.objectif_financier))}
                          </div>
                        </div>
                      </article>
                    )}

                    {activeFeaturePage === 1 && (
                      <article className={panelClass}>
                        <h2 className="text-lg font-bold">{ui.decisionTitle}</h2>

                        {!loanDecision ? (
                          <p className={`mt-4 text-sm ${mutedTextClass}`}>{ui.noResult}</p>
                        ) : (
                          <div className="mt-4 space-y-4">
                            <section className={importantSectionClass}>
                              <p className={`text-xs font-semibold uppercase tracking-wide ${importantLabelClass}`}>
                                {ui.importantTitle}
                              </p>
                              <div className="mt-3 grid gap-3 sm:grid-cols-3">
                                <div className={importantItemClass}>
                                  <p className={`text-[11px] font-semibold uppercase tracking-wide ${importantLabelClass}`}>
                                    {ui.eligibilityLabel}
                                  </p>
                                  <div className="mt-2">
                                    <span
                                      className={`inline-flex items-center gap-2 rounded-full border px-3 py-1 text-sm font-semibold ${
                                        badgeByEligibility[loanDecision.eligibility] ||
                                        "bg-slate-100 text-slate-700 border-slate-200"
                                      }`}
                                    >
                                      {loanDecision.eligibility === "Eligible" ? (
                                        <CheckCircle2 size={15} />
                                      ) : (
                                        <XCircle size={15} />
                                      )}
                                      {loanDecision.eligibility || "-"}
                                    </span>
                                  </div>
                                </div>
                                <div className={importantItemClass}>
                                  <p className={`text-[11px] font-semibold uppercase tracking-wide ${importantLabelClass}`}>
                                    {ui.riskLevel}
                                  </p>
                                  <p className="mt-1 text-base font-bold">
                                    {displayValue(loanDecision?.risk_level)}
                                  </p>
                                </div>
                                <div className={importantItemClass}>
                                  <p className={`text-[11px] font-semibold uppercase tracking-wide ${importantLabelClass}`}>
                                    {ui.monthlyLimitLabel}
                                  </p>
                                  <p className="mt-1 text-base font-bold">
                                    {formatMoney(loanDecision?.max_monthly_payment)}
                                  </p>
                                </div>
                              </div>
                            </section>

                            <section className={sectionCardClass}>
                              <h3 className="text-sm font-semibold">{ui.reasonsTitle}</h3>
                              <ul className="mt-2 space-y-2 text-sm">
                                {reasons.length > 0 ? (
                                  reasons.map((reason, index) => (
                                    <li key={`${reason}-${index}`} className={softCardClass}>
                                      {reason}
                                    </li>
                                  ))
                                ) : (
                                  <li className={mutedTextClass}>-</li>
                                )}
                              </ul>
                            </section>

                            <section className={sectionCardClass}>
                              <h3 className="text-sm font-semibold">{ui.capacityTitle}</h3>
                              <div className="mt-2 grid gap-2 text-sm sm:grid-cols-2">
                                {renderFieldCard("36m", formatMoney(loanDecision?.borrowing_capacity?.["36_months"]))}
                                {renderFieldCard("60m", formatMoney(loanDecision?.borrowing_capacity?.["60_months"]))}
                                {renderFieldCard("84m", formatMoney(loanDecision?.borrowing_capacity?.["84_months"]))}
                                {renderFieldCard(ui.monthlyLimitLabel, formatMoney(loanDecision?.max_monthly_payment))}
                              </div>
                            </section>

                            <section className={sectionCardClass}>
                              <h3 className="text-sm font-semibold">{ui.indicatorsTitle}</h3>
                              <div className="mt-2 grid gap-2 text-sm sm:grid-cols-3">
                                {renderFieldCard(ui.segmentLabel, displayValue(segmentation.rfm_segment))}
                                {renderFieldCard(ui.savingsProfileLabel, displayValue(segmentation.savings_profile))}
                                {renderFieldCard(
                                  ui.rfmLabel,
                                  `${displayValue(segmentation?.rfm_scores?.R)}/${displayValue(segmentation?.rfm_scores?.F)}/${displayValue(segmentation?.rfm_scores?.M)}`,
                                )}
                              </div>
                            </section>
                          </div>
                        )}
                      </article>
                    )}

                    {activeFeaturePage === 2 && (
                      <article className={panelClass}>
                        <h2 className="text-lg font-bold">{ui.advancedTitle}</h2>
                        <div className="mt-4 space-y-4">
                          <section className={importantSectionClass}>
                            <p className={`text-xs font-semibold uppercase tracking-wide ${importantLabelClass}`}>
                              {ui.importantTitle}
                            </p>
                            <div className="mt-3 grid gap-3 sm:grid-cols-2 lg:grid-cols-4">
                              {renderImportantCard(ui.riskLevel, displayValue(loanDecision?.risk_level))}
                              {renderImportantCard(ui.debtRatio, displayValue(clientProfile.taux_endettement_reel))}
                              {renderImportantCard(ui.toleranceRisk, displayValue(clientProfile.tolerance_risque))}
                              {renderImportantCard(ui.lastOpLabel, displayValue(accountInfo.days_since_last_op))}
                            </div>
                          </section>

                          <section className={sectionCardClass}>
                            <h3 className="text-sm font-semibold">{ui.accountActivityTitle}</h3>
                            <div className="mt-2 grid gap-2 text-sm sm:grid-cols-2 lg:grid-cols-3">
                              {renderFieldCard(ui.seniorityLabel, displayValue(accountInfo.account_seniority_days))}
                              {renderFieldCard(ui.lastOpLabel, displayValue(accountInfo.days_since_last_op))}
                              {renderFieldCard(ui.segmentLabel, displayValue(segmentation.rfm_segment))}
                              {renderFieldCard(ui.savingsProfileLabel, displayValue(segmentation.savings_profile))}
                              {renderFieldCard(ui.clusterLabel, displayValue(segmentation.kmeans_cluster))}
                              {renderFieldCard(
                                ui.rfmLabel,
                                `${displayValue(segmentation?.rfm_scores?.R)}/${displayValue(segmentation?.rfm_scores?.F)}/${displayValue(segmentation?.rfm_scores?.M)}`,
                              )}
                            </div>
                          </section>

                          <section className={sectionCardClass}>
                            <h3 className="text-sm font-semibold">{ui.profileTitle}</h3>
                            <div className="mt-2 grid gap-2 text-sm sm:grid-cols-2 lg:grid-cols-3">
                              {renderFieldCard(ui.activitySector, displayValue(clientProfile.secteur_activite))}
                              {renderFieldCard(ui.workSeniority, displayValue(clientProfile.anciennete_emploi))}
                              {renderFieldCard(ui.ageRange, displayValue(clientProfile.tranche_age))}
                              {renderFieldCard(ui.familyStatus, displayValue(clientProfile.situation_familiale))}
                              {renderFieldCard(ui.professionStatus, displayValue(clientProfile.statut_professionnel))}
                              {renderFieldCard(ui.housingStatus, displayValue(clientProfile.situation_logement))}
                              {renderFieldCard(ui.objectiveLabel, displayValue(clientProfile.objectif_financier))}
                            </div>
                          </section>
                        </div>
                      </article>
                    )}

                    {activeFeaturePage === 3 && (
                      <article className={panelClass}>
                        <h2 className="text-lg font-bold">{complaintsUi.title}</h2>

                        {clientComplaintsLoading ? (
                          <div className={`mt-4 rounded-xl border p-4 ${theme === "dark" ? "border-white/10" : "border-border"}`}>
                            <SkeletonLines
                              lines={5}
                              lineClassName="h-4 rounded-md"
                              lastLineClassName="w-4/6"
                            />
                          </div>
                        ) : (
                          <>
                            {clientComplaintsError && (
                              <div
                                className={`mt-4 flex items-center gap-2 rounded-xl border px-3 py-2 text-sm ${
                                  theme === "dark"
                                    ? "border-red-900/60 bg-red-950/40 text-red-300"
                                    : "border-red-200 bg-red-50 text-red-700"
                                }`}
                              >
                                <AlertCircle size={16} />
                                <span>{clientComplaintsError}</span>
                              </div>
                            )}

                            {clientComplaints.length === 0 ? (
                              <p className={`mt-4 text-sm ${mutedTextClass}`}>{complaintsUi.empty}</p>
                            ) : (
                              <div className="mt-4 grid gap-3 xl:grid-cols-2">
                                {clientComplaints.map((complaint, index) => {
                                  const complaintId = String(complaint?.id || `row-${index}`);
                                  const draft = complaintDrafts[complaintId] || {};
                                  const draftStatus = normalizeComplaintStatusValue(
                                    draft?.status || complaint?.status,
                                  );
                                  const draftResponse = String(
                                    draft?.response ?? complaint?.response ?? complaint?.agent_response ?? "",
                                  );
                                  const isSaving = savingComplaintId === complaintId;
                                  const typeText =
                                    getComplaintTypeLabel(complaint?.complaint_type, language) ||
                                    String(complaint?.subject || "").trim() ||
                                    "-";
                                  const messageText = String(
                                    complaint?.message || complaint?.description || "",
                                  ).trim() || "-";

                                  return (
                                    <article
                                      key={complaintId}
                                      className={`rounded-2xl border p-4 ${
                                        theme === "dark" ? "border-white/10 bg-[#0f1d33]" : "border-slate-200 bg-white"
                                      }`}
                                    >
                                      <div className="flex flex-wrap items-start justify-between gap-2">
                                        <p className="text-sm font-semibold">{typeText}</p>
                                        <span
                                          className={`inline-flex items-center rounded-full border px-2.5 py-1 text-xs font-semibold ${getComplaintStatusBadgeClass(
                                            draftStatus,
                                            theme,
                                          )}`}
                                        >
                                          {getComplaintStatusLabel(draftStatus, language)}
                                        </span>
                                      </div>

                                      <p className={`mt-2 text-xs ${mutedTextClass}`}>
                                        {complaintsUi.createdAt}: {formatDateTime(complaint?.created_at, language)}
                                      </p>

                                      <div className="mt-3">
                                        <p className={`text-[11px] font-semibold uppercase tracking-wide ${mutedTextClass}`}>
                                          {complaintsUi.message}
                                        </p>
                                        <p className={`mt-1 text-sm leading-relaxed ${theme === "dark" ? "text-white" : "text-black"}`}>{messageText}</p>
                                      </div>

                                      <div className="mt-3 grid gap-3 lg:grid-cols-[220px_minmax(0,1fr)]">
                                        <label className="space-y-1">
                                          <span
                                            className={`text-[11px] font-semibold uppercase tracking-wide ${mutedTextClass}`}
                                          >
                                            {complaintsUi.status}
                                          </span>
                                          <select
                                            value={draftStatus}
                                            onChange={(event) =>
                                              handleComplaintDraftChange(complaintId, {
                                                status: event.target.value,
                                              })
                                            }
                                            className={inputClass}
                                            disabled={isSaving}
                                          >
                                            <option value="submitted">{getComplaintStatusLabel("submitted", language)}</option>
                                            <option value="in_progress">{getComplaintStatusLabel("in_progress", language)}</option>
                                            <option value="resolved">{getComplaintStatusLabel("resolved", language)}</option>
                                            <option value="rejected">{getComplaintStatusLabel("rejected", language)}</option>
                                          </select>
                                        </label>

                                        <label className="space-y-1">
                                          <span
                                            className={`text-[11px] font-semibold uppercase tracking-wide ${mutedTextClass}`}
                                          >
                                            {complaintsUi.response}
                                          </span>
                                          <textarea
                                            rows={3}
                                            value={draftResponse}
                                            onChange={(event) =>
                                              handleComplaintDraftChange(complaintId, {
                                                response: event.target.value,
                                              })
                                            }
                                            className={`${inputClass} resize-y`}
                                            disabled={isSaving}
                                          />
                                        </label>
                                      </div>

                                      <div className="mt-3 flex justify-end">
                                        <button
                                          type="button"
                                          onClick={() => handleSaveComplaint(complaint)}
                                          disabled={isSaving}
                                          className={primaryButtonClass}
                                        >
                                          {isSaving ? complaintsUi.saving : complaintsUi.save}
                                        </button>
                                      </div>
                                    </article>
                                  );
                                })}
                              </div>
                            )}
                          </>
                        )}
                      </article>
                    )}

                  </section>
                )}
              </>
            ))}
          </>
        )}
      </main>
    </div>
  );
}
