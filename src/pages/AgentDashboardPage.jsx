import { useEffect, useState } from "react";
import { useNavigate } from "react-router";
import {
  AlertCircle,
  CheckCircle2,
  LogOut,
  Search,
  ShieldUser,
  XCircle,
} from "lucide-react";
import { useTheme } from "../contexts/ThemeContext";
import { useLanguage } from "../contexts/LanguageContext";
import {
  clearAgentAuthSession,
  getAgentAuthToken,
  getAgentCreditAnalysis,
  getAgentMe,
  searchAgentClient,
} from "../api";

const copyByLanguage = {
  en: {
    title: "Agent Workspace",
    subtitle: "Client dossier only",
    loadingAgent: "Loading your workspace...",
    globalError: "Unable to load agent profile.",
    searchTitle: "Client dossier search",
    searchHintCenter: "Start by entering a CIN",
    searchHintTop: "Search another client by CIN",
    searchPlaceholder: "Enter CIN (numbers only)",
    runSearch: "Open dossier",
    searching: "Loading dossier...",
    noResult: "No client selected yet.",
    summaryTitle: "Client identity",
    profileCategoryTitle: "Categorized client information",
    personalInfoTitle: "Personal",
    professionalInfoTitle: "Professional",
    accountInfoTitle: "Account and behavior",
    productsInfoTitle: "Products and projects",
    decisionTitle: "Credit decision",
    indicatorsTitle: "Financial indicators",
    reasonsTitle: "Decision reasons",
    capacityTitle: "Borrowing capacity",
    segmentationTitle: "Segmentation",
    riskTitle: "Risk level",
    recommendedProductsTitle: "Recommended products",
    existingProductsTitle: "Existing BH products",
    noRecommendedProducts: "No recommendation available yet.",
    profileFallback: "No profile details available yet.",
    regularIncome: "Regular income",
    formCompleted: "Form completed",
    yes: "Yes",
    no: "No",
    ageRange: "Age range",
    familyStatus: "Family status",
    childrenCount: "Children",
    educationLevel: "Education",
    housingStatus: "Housing",
    professionStatus: "Employment status",
    activitySector: "Activity sector",
    workSeniority: "Employment seniority",
    monthlyCharges: "Monthly charges",
    debtRatio: "Real debt ratio",
    ownsCar: "Owns a car",
    carType: "Car type",
    autoLoan: "Auto loan",
    homeLoan: "Home loan",
    housingPlan: "Housing purchase plan",
    childrenStudies: "Children studies interest",
    riskTolerance: "Risk tolerance",
    financialGoal: "Financial goal",
    projects12Months: "Projects (12 months)",
    seniorityDays: "Account seniority (days)",
    daysSinceLastOp: "Days since last operation",
    transactionFrequency: "Transaction frequency",
    avgTransactionsMonth: "Avg transactions / month",
    firstOperation: "First operation",
    lastOperation: "Last operation",
    incomeStability: "Income stability",
    loginExpired: "Session expired. Please sign in again.",
    invalidCin: "CIN must contain numbers only.",
    logout: "Log out",
  },
  fr: {
    title: "Espace Agent",
    subtitle: "Dossier client uniquement",
    loadingAgent: "Chargement de votre espace...",
    globalError: "Impossible de charger le profil agent.",
    searchTitle: "Recherche dossier client",
    searchHintCenter: "Commencez par saisir un CIN",
    searchHintTop: "Rechercher un autre client par CIN",
    searchPlaceholder: "Entrez le CIN (chiffres uniquement)",
    runSearch: "Ouvrir dossier",
    searching: "Chargement du dossier...",
    noResult: "Aucun client selectionne pour le moment.",
    summaryTitle: "Identite client",
    profileCategoryTitle: "Informations client categorisees",
    personalInfoTitle: "Informations personnelles",
    professionalInfoTitle: "Informations professionnelles",
    accountInfoTitle: "Compte et comportement",
    productsInfoTitle: "Produits et projets",
    decisionTitle: "Decision credit",
    indicatorsTitle: "Indicateurs financiers",
    reasonsTitle: "Raisons de decision",
    capacityTitle: "Capacite d'emprunt",
    segmentationTitle: "Segmentation",
    riskTitle: "Niveau de risque",
    recommendedProductsTitle: "Produits recommandes",
    existingProductsTitle: "Produits BH existants",
    noRecommendedProducts: "Aucune recommandation disponible pour le moment.",
    profileFallback: "Aucun detail de profil disponible pour le moment.",
    regularIncome: "Revenu regulier",
    formCompleted: "Formulaire complete",
    yes: "Oui",
    no: "Non",
    ageRange: "Tranche d'age",
    familyStatus: "Situation familiale",
    childrenCount: "Nombre d'enfants",
    educationLevel: "Niveau d'etudes",
    housingStatus: "Situation logement",
    professionStatus: "Statut professionnel",
    activitySector: "Secteur d'activite",
    workSeniority: "Anciennete emploi",
    monthlyCharges: "Charges mensuelles",
    debtRatio: "Taux d'endettement reel",
    ownsCar: "Possede une voiture",
    carType: "Type de voiture",
    autoLoan: "Credit auto",
    homeLoan: "Credit immobilier",
    housingPlan: "Projet achat logement",
    childrenStudies: "Interet etudes enfants",
    riskTolerance: "Tolerance au risque",
    financialGoal: "Objectif financier",
    projects12Months: "Projets (12 mois)",
    seniorityDays: "Anciennete du compte (jours)",
    daysSinceLastOp: "Jours depuis la derniere operation",
    transactionFrequency: "Frequence de transaction",
    avgTransactionsMonth: "Moyenne transactions / mois",
    firstOperation: "Premiere operation",
    lastOperation: "Derniere operation",
    incomeStability: "Stabilite du revenu",
    loginExpired: "Session expiree. Reconnectez-vous.",
    invalidCin: "Le CIN doit contenir uniquement des chiffres.",
    logout: "Deconnexion",
  },
  ar: {
    title: "Agent Workspace",
    subtitle: "Client dossier only",
    loadingAgent: "Loading your workspace...",
    globalError: "Unable to load agent profile.",
    searchTitle: "Client dossier search",
    searchHintCenter: "Start by entering a CIN",
    searchHintTop: "Search another client by CIN",
    searchPlaceholder: "Enter CIN (numbers only)",
    runSearch: "Open dossier",
    searching: "Loading dossier...",
    noResult: "No client selected yet.",
    summaryTitle: "Client identity",
    profileCategoryTitle: "Categorized client information",
    personalInfoTitle: "Personal",
    professionalInfoTitle: "Professional",
    accountInfoTitle: "Account and behavior",
    productsInfoTitle: "Products and projects",
    decisionTitle: "Credit decision",
    indicatorsTitle: "Financial indicators",
    reasonsTitle: "Decision reasons",
    capacityTitle: "Borrowing capacity",
    segmentationTitle: "Segmentation",
    riskTitle: "Risk level",
    recommendedProductsTitle: "Recommended products",
    existingProductsTitle: "Existing BH products",
    noRecommendedProducts: "No recommendation available yet.",
    profileFallback: "No profile details available yet.",
    regularIncome: "Regular income",
    formCompleted: "Form completed",
    yes: "Yes",
    no: "No",
    ageRange: "Age range",
    familyStatus: "Family status",
    childrenCount: "Children",
    educationLevel: "Education",
    housingStatus: "Housing",
    professionStatus: "Employment status",
    activitySector: "Activity sector",
    workSeniority: "Employment seniority",
    monthlyCharges: "Monthly charges",
    debtRatio: "Real debt ratio",
    ownsCar: "Owns a car",
    carType: "Car type",
    autoLoan: "Auto loan",
    homeLoan: "Home loan",
    housingPlan: "Housing purchase plan",
    childrenStudies: "Children studies interest",
    riskTolerance: "Risk tolerance",
    financialGoal: "Financial goal",
    projects12Months: "Projects (12 months)",
    seniorityDays: "Account seniority (days)",
    daysSinceLastOp: "Days since last operation",
    transactionFrequency: "Transaction frequency",
    avgTransactionsMonth: "Avg transactions / month",
    firstOperation: "First operation",
    lastOperation: "Last operation",
    incomeStability: "Income stability",
    loginExpired: "Session expired. Please sign in again.",
    invalidCin: "CIN must contain numbers only.",
    logout: "Log out",
  },
};

const getLangKey = (language) => {
  if (language === "ar") return "ar";
  if (language === "en") return "en";
  return "fr";
};

const formatMoney = (value) => {
  const number = Number(value || 0);
  return `${number.toLocaleString(undefined, { maximumFractionDigits: 0 })} TND`;
};

const formatPercent = (value) => `${(Number(value || 0) * 100).toFixed(1)}%`;

const displayValue = (value) => {
  if (value === null || value === undefined) return "-";
  if (typeof value === "string" && value.trim() === "") return "-";
  return String(value);
};

const listFromValue = (value) => {
  if (Array.isArray(value)) {
    return value
      .map((item) => String(item || "").trim())
      .filter(Boolean);
  }

  if (typeof value !== "string") return [];

  const raw = value.trim();
  if (!raw) return [];

  try {
    const parsed = JSON.parse(raw);
    if (Array.isArray(parsed)) {
      return parsed
        .map((item) => String(item || "").trim())
        .filter(Boolean);
    }
  } catch {
    // Keep fallback split parsing.
  }

  return raw
    .split(/[,;|]/)
    .map((item) => item.trim())
    .filter(Boolean);
};

const badgeByEligibility = {
  Eligible: "bg-emerald-100 text-emerald-800 border-emerald-200",
  "Partially Eligible": "bg-amber-100 text-amber-800 border-amber-200",
  "Not Eligible": "bg-rose-100 text-rose-800 border-rose-200",
};

export function AgentDashboardPage() {
  const navigate = useNavigate();
  const { theme } = useTheme();
  const { language, isRTL } = useLanguage();

  const ui = copyByLanguage[getLangKey(language)] || copyByLanguage.fr;

  const [loadingAgent, setLoadingAgent] = useState(true);
  const [pageError, setPageError] = useState("");
  const [agentProfile, setAgentProfile] = useState(null);

  const [cin, setCin] = useState("");
  const [searching, setSearching] = useState(false);
  const [searchError, setSearchError] = useState("");
  const [clientSummary, setClientSummary] = useState(null);
  const [creditAnalysis, setCreditAnalysis] = useState(null);
  const [searchPinned, setSearchPinned] = useState(false);

  const handleLogout = () => {
    clearAgentAuthSession();
    navigate("/agent/login", { replace: true });
  };

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
  }, [navigate, ui.globalError]);

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
      setSearchPinned(true);
      setSearchError("");
      setClientSummary(null);
      setCreditAnalysis(null);

      const summary = await searchAgentClient(normalizedCin);
      setClientSummary(summary || null);

      const analysis = await getAgentCreditAnalysis(summary?.client_id || normalizedCin);
      setCreditAnalysis(analysis || null);
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

  const loanDecision = creditAnalysis?.credit_decision || null;
  const financialIndicators =
    creditAnalysis?.financial_indicators || clientSummary?.financial_snapshot || null;
  const clientProfile = creditAnalysis?.client_profile || clientSummary?.client_profile || {};
  const segmentation = creditAnalysis?.segmentation || {
    rfm_segment: clientSummary?.rfm_segment || "",
    savings_profile: clientSummary?.savings_profile || "",
    kmeans_cluster: null,
    rfm_scores: {},
  };
  const accountInfo = creditAnalysis?.account_info || clientSummary?.account_snapshot || {};
  const existingProducts =
    creditAnalysis?.existing_products || clientSummary?.produits_bh_existants || "";
  const recommendedProducts = listFromValue(
    creditAnalysis?.recommended_products || clientSummary?.recommended_products || [],
  );
  const reasons = Array.isArray(loanDecision?.reasons) ? loanDecision.reasons : [];

  const rootClass = theme === "dark" ? "bg-[#0f172a] text-white" : "bg-surface-alt text-text";
  const navbarClass =
    theme === "dark"
      ? "border-white/10 bg-[#101a2f]"
      : "border-border bg-surface";
  const panelClass =
    theme === "dark"
      ? "rounded-3xl border border-white/10 bg-[#121f35] p-5 shadow-sm"
      : "rounded-3xl border border-border bg-surface p-5 shadow-sm";
  const mutedTextClass = theme === "dark" ? "text-white/65" : "text-text-muted";
  const chipClass =
    theme === "dark"
      ? "rounded-xl border border-white/15 bg-white/5 px-3 py-2 text-sm"
      : "rounded-xl border border-border bg-surface-alt px-3 py-2 text-sm";
  const dataCellClass =
    theme === "dark"
      ? "rounded-xl border border-white/10 bg-[#0d192c] px-3 py-2"
      : "rounded-xl border border-border bg-surface-alt px-3 py-2";

  const inputClass =
    theme === "dark"
      ? "w-full rounded-xl border border-white/15 bg-[#0d192c] px-3 py-2.5 text-sm text-white placeholder:text-white/40"
      : "w-full rounded-xl border border-border bg-surface px-3 py-2.5 text-sm text-text placeholder:text-text-muted";

  const primaryButtonClass =
    "inline-flex items-center justify-center gap-2 rounded-xl bg-primary px-4 py-2.5 text-sm font-semibold text-white hover:bg-primary-hover disabled:cursor-not-allowed disabled:opacity-60";

  const showData = Boolean(clientSummary);

  const searchForm = (
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

  return (
    <div className={`min-h-screen ${rootClass}`} dir={isRTL ? "rtl" : "ltr"}>
      <header className={`border-b px-5 py-4 sm:px-8 ${navbarClass}`}>
        <div className="mx-auto flex w-full max-w-7xl items-center justify-between gap-4">
          <div className={`flex items-center gap-3 ${isRTL ? "flex-row-reverse" : ""}`}>
            <span className="inline-flex h-10 w-10 items-center justify-center rounded-xl bg-primary text-white">
              <ShieldUser size={19} />
            </span>
            <div className={isRTL ? "text-right" : "text-left"}>
              <h1 className="text-xl font-bold sm:text-2xl">{ui.title}</h1>
              <p className={`text-xs sm:text-sm ${mutedTextClass}`}>{ui.subtitle}</p>
            </div>
          </div>

          <div className={`flex items-center gap-3 ${isRTL ? "flex-row-reverse" : ""}`}>
            <div className={chipClass}>
              {agentProfile?.full_name || agentProfile?.agent_id || "Agent"}
            </div>
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
          <div className={panelClass}>{ui.loadingAgent}</div>
        ) : (
          <>
            {!searchPinned ? (
              <section className="flex min-h-[68vh] items-center justify-center">
                <div className={`${panelClass} w-full max-w-2xl`}>
                  <h2 className="text-lg font-bold">{ui.searchTitle}</h2>
                  <p className={`mt-1 text-sm ${mutedTextClass}`}>{ui.searchHintCenter}</p>
                  <div className="mt-4">{searchForm}</div>
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
                  {searchForm}
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

                {!showData && !searchError ? (
                  <div className={panelClass}>{ui.noResult}</div>
                ) : (
                  <section className="grid gap-6 lg:grid-cols-[1.2fr_0.95fr]">
                    <div className={panelClass}>
                      <div className={dataCellClass}>
                        <h3 className="text-base font-semibold">{ui.summaryTitle}</h3>
                        <div className="mt-3 grid gap-2 text-sm sm:grid-cols-2 lg:grid-cols-4">
                          <p className={chipClass}>ID: {displayValue(clientSummary?.client_id)}</p>
                          <p className={chipClass}>Name: {displayValue(clientSummary?.client_name)}</p>
                          <p className={chipClass}>Segment: {displayValue(segmentation.rfm_segment)}</p>
                          <p className={chipClass}>
                            Score: {Number(clientSummary?.financial_score || 0).toFixed(0)}/100
                          </p>
                        </div>
                        <div className="mt-3 grid gap-2 text-sm sm:grid-cols-2 lg:grid-cols-3">
                          <p className={chipClass}>
                            {ui.formCompleted}: {clientSummary?.form_completed ? ui.yes : ui.no}
                          </p>
                          <p className={chipClass}>
                            {ui.regularIncome}: {clientSummary?.has_regular_income ? ui.yes : ui.no}
                          </p>
                          <p className={chipClass}>
                            {ui.riskTitle}: {displayValue(loanDecision?.risk_level)}
                          </p>
                        </div>
                      </div>

                      <div className={`${dataCellClass} mt-4`}>
                        <h4 className="text-sm font-semibold">{ui.profileCategoryTitle}</h4>

                        <div className="mt-3 grid gap-4 lg:grid-cols-2">
                          <div>
                            <p className={`text-xs font-semibold uppercase tracking-wide ${mutedTextClass}`}>
                              {ui.personalInfoTitle}
                            </p>
                            <div className="mt-2 grid gap-2 text-sm">
                              <p className={chipClass}>{ui.ageRange}: {displayValue(clientProfile.tranche_age)}</p>
                              <p className={chipClass}>{ui.familyStatus}: {displayValue(clientProfile.situation_familiale)}</p>
                              <p className={chipClass}>{ui.childrenCount}: {displayValue(clientProfile.nombre_enfants)}</p>
                              <p className={chipClass}>{ui.educationLevel}: {displayValue(clientProfile.niveau_etudes)}</p>
                              <p className={chipClass}>{ui.housingStatus}: {displayValue(clientProfile.situation_logement)}</p>
                            </div>
                          </div>

                          <div>
                            <p className={`text-xs font-semibold uppercase tracking-wide ${mutedTextClass}`}>
                              {ui.professionalInfoTitle}
                            </p>
                            <div className="mt-2 grid gap-2 text-sm">
                              <p className={chipClass}>{ui.professionStatus}: {displayValue(clientProfile.statut_professionnel)}</p>
                              <p className={chipClass}>{ui.activitySector}: {displayValue(clientProfile.secteur_activite)}</p>
                              <p className={chipClass}>{ui.workSeniority}: {displayValue(clientProfile.anciennete_emploi)}</p>
                              <p className={chipClass}>{ui.monthlyCharges}: {displayValue(clientProfile.charges_mensuelles)}</p>
                              <p className={chipClass}>{ui.debtRatio}: {displayValue(clientProfile.taux_endettement_reel)}</p>
                            </div>
                          </div>
                        </div>

                        <div className="mt-4">
                          <p className={`text-xs font-semibold uppercase tracking-wide ${mutedTextClass}`}>
                            {ui.accountInfoTitle}
                          </p>
                          <div className="mt-2 grid gap-2 text-sm sm:grid-cols-2">
                            <p className={chipClass}>{ui.seniorityDays}: {displayValue(accountInfo.account_seniority_days)}</p>
                            <p className={chipClass}>{ui.daysSinceLastOp}: {displayValue(accountInfo.days_since_last_op)}</p>
                            <p className={chipClass}>{ui.transactionFrequency}: {displayValue(accountInfo.transaction_frequency)}</p>
                            <p className={chipClass}>{ui.avgTransactionsMonth}: {displayValue(accountInfo.avg_transactions_month)}</p>
                            <p className={chipClass}>{ui.firstOperation}: {displayValue(accountInfo.first_operation)}</p>
                            <p className={chipClass}>{ui.lastOperation}: {displayValue(accountInfo.last_operation)}</p>
                          </div>
                        </div>

                        <div className="mt-4">
                          <p className={`text-xs font-semibold uppercase tracking-wide ${mutedTextClass}`}>
                            {ui.productsInfoTitle}
                          </p>
                          <div className="mt-2 space-y-2 text-sm">
                            <p className={chipClass}>{ui.existingProductsTitle}: {displayValue(existingProducts)}</p>
                            <p className={chipClass}>{ui.projects12Months}: {displayValue(clientProfile.projets_12_mois)}</p>
                            <p className={chipClass}>{ui.financialGoal}: {displayValue(clientProfile.objectif_financier)}</p>
                            <p className={chipClass}>{ui.riskTolerance}: {displayValue(clientProfile.tolerance_risque)}</p>
                            <p className={chipClass}>{ui.housingPlan}: {displayValue(clientProfile.souhait_achat_logement)}</p>
                            <p className={chipClass}>{ui.homeLoan}: {displayValue(clientProfile.credit_immobilier_en_cours)}</p>
                            <p className={chipClass}>{ui.autoLoan}: {displayValue(clientProfile.credit_auto_en_cours)}</p>
                            <p className={chipClass}>{ui.ownsCar}: {displayValue(clientProfile.possede_voiture)}</p>
                            <p className={chipClass}>{ui.carType}: {displayValue(clientProfile.type_voiture)}</p>
                            <p className={chipClass}>{ui.childrenStudies}: {displayValue(clientProfile.interet_etudes_enfants)}</p>
                          </div>

                          <div className="mt-3">
                            <p className={`text-xs font-semibold uppercase tracking-wide ${mutedTextClass}`}>
                              {ui.recommendedProductsTitle}
                            </p>
                            {recommendedProducts.length > 0 ? (
                              <div className="mt-2 flex flex-wrap gap-2">
                                {recommendedProducts.map((product) => (
                                  <span
                                    key={product}
                                    className={`inline-flex rounded-full border px-3 py-1 text-xs font-medium ${
                                      theme === "dark"
                                        ? "border-white/20 bg-white/10 text-white"
                                        : "border-border bg-surface text-text"
                                    }`}
                                  >
                                    {product}
                                  </span>
                                ))}
                              </div>
                            ) : (
                              <p className={`mt-2 text-sm ${mutedTextClass}`}>{ui.noRecommendedProducts}</p>
                            )}
                          </div>
                        </div>

                        {!Object.values(clientProfile || {}).some(Boolean) && (
                          <p className={`mt-4 text-sm ${mutedTextClass}`}>{ui.profileFallback}</p>
                        )}
                      </div>
                    </div>

                    <div className={panelClass}>
                      <h2 className="text-lg font-bold">{ui.decisionTitle}</h2>

                      {!loanDecision ? (
                        <p className={`mt-4 text-sm ${mutedTextClass}`}>{ui.noResult}</p>
                      ) : (
                        <div className="mt-4 space-y-4">
                          <div
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
                          </div>

                          <p className={chipClass}>
                            {ui.riskTitle}: {displayValue(loanDecision?.risk_level)}
                          </p>

                          <div>
                            <h3 className="text-sm font-semibold">{ui.reasonsTitle}</h3>
                            <ul className="mt-2 space-y-2 text-sm">
                              {reasons.length > 0 ? (
                                reasons.map((reason, index) => (
                                  <li key={`${reason}-${index}`} className={chipClass}>
                                    {reason}
                                  </li>
                                ))
                              ) : (
                                <li className={mutedTextClass}>No specific reason provided.</li>
                              )}
                            </ul>
                          </div>

                          <div>
                            <h3 className="text-sm font-semibold">{ui.capacityTitle}</h3>
                            <div className="mt-2 grid gap-2 text-sm sm:grid-cols-2">
                              <p className={chipClass}>
                                36m: {formatMoney(loanDecision?.borrowing_capacity?.["36_months"])}
                              </p>
                              <p className={chipClass}>
                                60m: {formatMoney(loanDecision?.borrowing_capacity?.["60_months"])}
                              </p>
                              <p className={chipClass}>
                                84m: {formatMoney(loanDecision?.borrowing_capacity?.["84_months"])}
                              </p>
                              <p className={chipClass}>
                                Monthly: {formatMoney(loanDecision?.max_monthly_payment)}
                              </p>
                            </div>
                          </div>

                          {financialIndicators && (
                            <div>
                              <h3 className="text-sm font-semibold">{ui.indicatorsTitle}</h3>
                              <div className="mt-2 grid gap-2 text-sm sm:grid-cols-2">
                                <p className={chipClass}>Salary: {formatMoney(financialIndicators.monthly_salary)}</p>
                                <p className={chipClass}>Expenses: {formatMoney(financialIndicators.avg_monthly_expenses)}</p>
                                <p className={chipClass}>Savings: {formatMoney(financialIndicators.net_monthly_savings)}</p>
                                <p className={chipClass}>
                                  Score: {Number(financialIndicators.financial_score || 0).toFixed(0)}/100
                                </p>
                                <p className={chipClass}>Ratio: {formatPercent(financialIndicators.expense_income_ratio)}</p>
                                <p className={chipClass}>
                                  {ui.incomeStability}: {Number(financialIndicators.income_stability_score || 0).toFixed(0)}/100
                                </p>
                              </div>
                            </div>
                          )}

                          <div>
                            <h3 className="text-sm font-semibold">{ui.segmentationTitle}</h3>
                            <div className="mt-2 grid gap-2 text-sm sm:grid-cols-2">
                              <p className={chipClass}>Segment: {displayValue(segmentation.rfm_segment)}</p>
                              <p className={chipClass}>Savings profile: {displayValue(segmentation.savings_profile)}</p>
                              <p className={chipClass}>Cluster: {displayValue(segmentation.kmeans_cluster)}</p>
                              <p className={chipClass}>
                                R/F/M: {displayValue(segmentation?.rfm_scores?.R)}/
                                {displayValue(segmentation?.rfm_scores?.F)}/
                                {displayValue(segmentation?.rfm_scores?.M)}
                              </p>
                            </div>
                          </div>
                        </div>
                      )}

                      <p className={`mt-5 inline-flex items-center gap-2 text-xs ${mutedTextClass}`}>
                        <AlertCircle size={13} />
                        {ui.loginExpired}
                      </p>
                    </div>
                  </section>
                )}
              </>
            )}
          </>
        )}
      </main>
    </div>
  );
}
