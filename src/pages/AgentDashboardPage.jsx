import { useEffect, useMemo, useState } from "react";
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
    subtitle: "One client dossier at a time",
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
    essentialsTitle: "Essentials",
    decisionTitle: "Credit decision",
    capacityTitle: "Borrowing capacity",
    reasonsTitle: "Main reasons",
    indicatorsTitle: "Financial indicators",
    profileTitle: "Profile snapshot",
    productsProjectsTitle: "Products and goals",
    advancedTitle: "Advanced details",
    showAdvanced: "Show advanced details",
    hideAdvanced: "Hide advanced details",
    invalidCin: "CIN must contain numbers only.",
    loginExpired: "Session expired. Please sign in again.",
    logout: "Log out",
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
    noRecommendations: "No recommendation available yet.",
    photoMissing: "No profile photo available",
    seniorityLabel: "Account seniority (days)",
    lastOpLabel: "Days since last operation",
    activitySector: "Activity sector",
    workSeniority: "Employment seniority",
    debtRatio: "Real debt ratio",
    toleranceRisk: "Risk tolerance",
    noData: "Not available",
  },
  fr: {
    title: "Espace Agent",
    subtitle: "Un dossier client a la fois",
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
    essentialsTitle: "Essentiel",
    decisionTitle: "Decision credit",
    capacityTitle: "Capacite d'emprunt",
    reasonsTitle: "Raisons principales",
    indicatorsTitle: "Indicateurs financiers",
    profileTitle: "Profil rapide",
    productsProjectsTitle: "Produits et objectifs",
    advancedTitle: "Details avances",
    showAdvanced: "Afficher les details avances",
    hideAdvanced: "Masquer les details avances",
    invalidCin: "Le CIN doit contenir uniquement des chiffres.",
    loginExpired: "Session expiree. Reconnectez-vous.",
    logout: "Deconnexion",
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
    noRecommendations: "Aucune recommandation disponible pour le moment.",
    photoMissing: "Aucune photo de profil disponible",
    seniorityLabel: "Anciennete compte (jours)",
    lastOpLabel: "Jours depuis la derniere operation",
    activitySector: "Secteur d'activite",
    workSeniority: "Anciennete emploi",
    debtRatio: "Taux d'endettement reel",
    toleranceRisk: "Tolerance au risque",
    noData: "Non disponible",
  },
  ar: {
    title: "Agent Workspace",
    subtitle: "One client dossier at a time",
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
    essentialsTitle: "Essentials",
    decisionTitle: "Credit decision",
    capacityTitle: "Borrowing capacity",
    reasonsTitle: "Main reasons",
    indicatorsTitle: "Financial indicators",
    profileTitle: "Profile snapshot",
    productsProjectsTitle: "Products and goals",
    advancedTitle: "Advanced details",
    showAdvanced: "Show advanced details",
    hideAdvanced: "Hide advanced details",
    invalidCin: "CIN must contain numbers only.",
    loginExpired: "Session expired. Please sign in again.",
    logout: "Log out",
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
    noRecommendations: "No recommendation available yet.",
    photoMissing: "No profile photo available",
    seniorityLabel: "Account seniority (days)",
    lastOpLabel: "Days since last operation",
    activitySector: "Activity sector",
    workSeniority: "Employment seniority",
    debtRatio: "Real debt ratio",
    toleranceRisk: "Risk tolerance",
    noData: "Not available",
  },
};

const getLangKey = (language) => {
  if (language === "ar") return "ar";
  if (language === "en") return "en";
  return "fr";
};

const formatMoney = (value) => {
  if (value === null || value === undefined || String(value).trim() === "") return "-";
  const number = Number(value);
  if (Number.isNaN(number)) return "-";
  return `${number.toLocaleString(undefined, { maximumFractionDigits: 0 })} TND`;
};

const formatPercent = (value) => {
  if (value === null || value === undefined || String(value).trim() === "") return "-";
  const number = Number(value);
  if (Number.isNaN(number)) return "-";
  return `${(number * 100).toFixed(1)}%`;
};

const displayValue = (value) => {
  if (value === null || value === undefined) return "-";
  if (typeof value === "string" && value.trim() === "") return "-";
  return String(value);
};

const itemToText = (item) => {
  if (item === null || item === undefined) return "";
  if (typeof item === "string" || typeof item === "number" || typeof item === "boolean") {
    return String(item).trim();
  }

  if (typeof item === "object") {
    const preferredKeys = [
      "product_name",
      "name",
      "label",
      "title",
      "nom_produit",
      "product",
      "projet",
      "objectif",
    ];

    for (const key of preferredKeys) {
      const candidate = item[key];
      if (typeof candidate === "string" && candidate.trim()) {
        return candidate.trim();
      }
    }

    const firstScalar = Object.values(item).find(
      (value) =>
        typeof value === "string" ||
        typeof value === "number" ||
        typeof value === "boolean",
    );

    if (firstScalar !== undefined) {
      return String(firstScalar).trim();
    }
  }

  return "";
};

const listFromValue = (value) => {
  if (Array.isArray(value)) {
    return [...new Set(value.map(itemToText).filter(Boolean))];
  }

  if (value && typeof value === "object") {
    const text = itemToText(value);
    return text ? [text] : [];
  }

  if (typeof value !== "string") return [];
  const raw = value.trim();
  if (!raw) return [];

  try {
    const parsed = JSON.parse(raw);
    if (Array.isArray(parsed)) {
      return [...new Set(parsed.map(itemToText).filter(Boolean))];
    }
    if (parsed && typeof parsed === "object") {
      const text = itemToText(parsed);
      return text ? [text] : [];
    }
  } catch {
    // Ignore parse failures and fall back to splitting.
  }

  return [...new Set(raw
    .split(/[,;|]/)
    .map((item) => item.trim())
    .filter(Boolean))];
};

const resolveClientPhoto = (value) => {
  let raw = value;

  if (raw && typeof raw === "object") {
    raw = raw.url || raw.src || raw.path || raw.photo || "";
  }

  raw = String(raw || "").trim();
  if (!raw) return "";

  if (raw.startsWith("data:image/")) return raw;
  if (raw.startsWith("http://") || raw.startsWith("https://")) return raw;

  // Accept plain base64 payloads from legacy rows.
  if (/^[A-Za-z0-9+/=]+$/.test(raw) && raw.length > 100) {
    return `data:image/jpeg;base64,${raw}`;
  }

  // Keep API-relative URLs on Vite proxy path.
  if (raw.startsWith("/api/")) return raw;

  // Common backend static paths served by Flask on port 5000.
  if (
    raw.startsWith("/uploads/") ||
    raw.startsWith("/media/") ||
    raw.startsWith("/storage/") ||
    raw.startsWith("uploads/") ||
    raw.startsWith("media/") ||
    raw.startsWith("storage/")
  ) {
    const protocol = window.location.protocol || "http:";
    const host = window.location.hostname || "localhost";
    const normalized = raw.startsWith("/") ? raw : `/${raw}`;
    return `${protocol}//${host}:5000${normalized}`;
  }

  if (raw.startsWith("/")) {
    const protocol = window.location.protocol || "http:";
    const host = window.location.hostname || "localhost";
    return `${protocol}//${host}:5000${raw}`;
  }

  return raw;
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
  const [showAdvanced, setShowAdvanced] = useState(false);
  const [photoFailed, setPhotoFailed] = useState(false);

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

  const handleLogout = () => {
    clearAgentAuthSession();
    navigate("/agent/login", { replace: true });
  };

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
      setShowAdvanced(false);
      setPhotoFailed(false);
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

  const clientName = clientSummary?.client_name || creditAnalysis?.client_name || "Client";
  const clientPhoto =
    clientSummary?.client_photo ||
    creditAnalysis?.client_photo ||
    creditAnalysis?.client_profile?.profile_photo ||
    clientSummary?.client_profile?.profile_photo ||
    "";
  const clientInitials = useMemo(() => getInitials(clientName), [clientName]);
  const clientPhotoSrc = useMemo(() => resolveClientPhoto(clientPhoto), [clientPhoto]);

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
  const existingProductsList = listFromValue(existingProducts);
  const projectsList = listFromValue(clientProfile?.projets_12_mois || "");
  const reasons = Array.isArray(loanDecision?.reasons) ? loanDecision.reasons : [];

  const pageBg = theme === "dark" ? "bg-[#0f172a] text-white" : "bg-surface-alt text-text";
  const navbarClass =
    theme === "dark" ? "border-white/10 bg-[#101b31]" : "border-border bg-surface";
  const panelClass =
    theme === "dark"
      ? "rounded-2xl border border-white/10 bg-[#14233b] p-5"
      : "rounded-2xl border border-border bg-surface p-5";
  const softCardClass =
    theme === "dark"
      ? "rounded-xl border border-white/10 bg-white/5 p-3"
      : "rounded-xl border border-border bg-surface-alt p-3";
  const mutedTextClass = theme === "dark" ? "text-white/65" : "text-text-muted";

  const inputClass =
    theme === "dark"
      ? "w-full rounded-xl border border-white/15 bg-[#0d192c] px-3 py-2.5 text-sm text-white placeholder:text-white/40"
      : "w-full rounded-xl border border-border bg-surface px-3 py-2.5 text-sm text-text placeholder:text-text-muted";

  const primaryButtonClass =
    "inline-flex items-center justify-center gap-2 rounded-xl bg-primary px-4 py-2.5 text-sm font-semibold text-white hover:bg-primary-hover disabled:cursor-not-allowed disabled:opacity-60";

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
    <div className={`min-h-screen ${pageBg}`} dir={isRTL ? "rtl" : "ltr"}>
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
            <div className={softCardClass}>{agentProfile?.full_name || agentProfile?.agent_id || "Agent"}</div>
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

                {!clientSummary && !searchError ? (
                  <div className={panelClass}>{ui.noResult}</div>
                ) : (
                  <section className="grid gap-6 lg:grid-cols-[1.25fr_0.95fr]">
                    <div className="space-y-6">
                      <article className={panelClass}>
                        <h2 className="text-lg font-bold">{ui.clientCardTitle}</h2>
                        <div className="mt-4 flex flex-col gap-4 sm:flex-row sm:items-center">
                          <div className="h-24 w-24 overflow-hidden rounded-2xl border border-border bg-surface-alt">
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

                          <div className="grid flex-1 gap-2 text-sm sm:grid-cols-2">
                            <p className={softCardClass}>{ui.idLabel}: {displayValue(clientSummary?.client_id)}</p>
                            <p className={softCardClass}>{ui.segmentLabel}: {displayValue(segmentation.rfm_segment)}</p>
                            <p className={softCardClass}>{ui.scoreLabel}: {Number(clientSummary?.financial_score || 0).toFixed(0)}/100</p>
                            <p className={softCardClass}>{ui.riskLevel}: {displayValue(loanDecision?.risk_level)}</p>
                            <p className={softCardClass}>{ui.regularIncome}: {clientSummary?.has_regular_income ? ui.yes : ui.no}</p>
                            <p className={softCardClass}>{ui.formCompleted}: {clientSummary?.form_completed ? ui.yes : ui.no}</p>
                          </div>
                        </div>
                        <p className="mt-3 text-lg font-semibold">{clientName}</p>
                        {(!clientPhotoSrc || photoFailed) && (
                          <p className={`text-xs ${mutedTextClass}`}>{ui.photoMissing}</p>
                        )}
                      </article>

                      <article className={panelClass}>
                        <h2 className="text-lg font-bold">{ui.essentialsTitle}</h2>
                        <div className="mt-4 grid gap-3 md:grid-cols-2">
                          <div className={softCardClass}>
                            <p className="text-sm font-semibold">{ui.salaryLabel}</p>
                            <p className="mt-1 text-lg font-bold">{formatMoney(financialIndicators?.monthly_salary)}</p>
                          </div>
                          <div className={softCardClass}>
                            <p className="text-sm font-semibold">{ui.expensesLabel}</p>
                            <p className="mt-1 text-lg font-bold">{formatMoney(financialIndicators?.avg_monthly_expenses)}</p>
                          </div>
                          <div className={softCardClass}>
                            <p className="text-sm font-semibold">{ui.savingsLabel}</p>
                            <p className="mt-1 text-lg font-bold">{formatMoney(financialIndicators?.net_monthly_savings)}</p>
                          </div>
                          <div className={softCardClass}>
                            <p className="text-sm font-semibold">{ui.ratioLabel}</p>
                            <p className="mt-1 text-lg font-bold">{formatPercent(financialIndicators?.expense_income_ratio)}</p>
                          </div>
                        </div>

                        <div className="mt-5 grid gap-4 lg:grid-cols-2">
                          <div>
                            <p className="text-sm font-semibold">{ui.profileTitle}</p>
                            <div className="mt-2 grid gap-2">
                              <p className={softCardClass}>{ui.ageRange}: {displayValue(clientProfile.tranche_age)}</p>
                              <p className={softCardClass}>{ui.familyStatus}: {displayValue(clientProfile.situation_familiale)}</p>
                              <p className={softCardClass}>{ui.professionStatus}: {displayValue(clientProfile.statut_professionnel)}</p>
                              <p className={softCardClass}>{ui.housingStatus}: {displayValue(clientProfile.situation_logement)}</p>
                            </div>
                          </div>

                          <div>
                            <p className="text-sm font-semibold">{ui.productsProjectsTitle}</p>
                            <div className="mt-2 grid gap-2">
                              <p className={softCardClass}>{ui.objectiveLabel}: {displayValue(clientProfile.objectif_financier)}</p>
                              <div className={softCardClass}>
                                <p className="text-xs font-semibold uppercase tracking-wide">{ui.productsLabel}</p>
                                {existingProductsList.length > 0 ? (
                                  <div className="mt-2 flex flex-wrap gap-2">
                                    {existingProductsList.map((product, index) => (
                                      <span
                                        key={`existing-${index}-${product}`}
                                        className="inline-flex rounded-full border border-border bg-surface px-2.5 py-1 text-xs"
                                      >
                                        {product}
                                      </span>
                                    ))}
                                  </div>
                                ) : (
                                  <p className={`mt-2 text-sm ${mutedTextClass}`}>{ui.noData}</p>
                                )}
                              </div>

                              <div className={softCardClass}>
                                <p className="text-xs font-semibold uppercase tracking-wide">{ui.projectsLabel}</p>
                                {projectsList.length > 0 ? (
                                  <div className="mt-2 flex flex-wrap gap-2">
                                    {projectsList.map((project, index) => (
                                      <span
                                        key={`project-${index}-${project}`}
                                        className="inline-flex rounded-full border border-border bg-surface px-2.5 py-1 text-xs"
                                      >
                                        {project}
                                      </span>
                                    ))}
                                  </div>
                                ) : (
                                  <p className={`mt-2 text-sm ${mutedTextClass}`}>{ui.noData}</p>
                                )}
                              </div>

                              <div className={softCardClass}>
                                <p className="text-xs font-semibold uppercase tracking-wide">{ui.recommendationsLabel}</p>
                                {recommendedProducts.length > 0 ? (
                                  <div className="mt-2 flex flex-wrap gap-2">
                                    {recommendedProducts.map((product, index) => (
                                      <span
                                        key={`rec-${index}-${product}`}
                                        className="inline-flex rounded-full border border-border bg-surface px-2.5 py-1 text-xs"
                                      >
                                        {product}
                                      </span>
                                    ))}
                                  </div>
                                ) : (
                                  <p className={`mt-2 text-sm ${mutedTextClass}`}>{ui.noRecommendations}</p>
                                )}
                              </div>
                            </div>
                          </div>
                        </div>
                      </article>

                      <article className={panelClass}>
                        <button
                          type="button"
                          onClick={() => setShowAdvanced((prev) => !prev)}
                          className="inline-flex items-center rounded-xl border border-border bg-surface-alt px-3 py-2 text-sm font-medium hover:bg-surface"
                        >
                          {showAdvanced ? ui.hideAdvanced : ui.showAdvanced}
                        </button>

                        {showAdvanced && (
                          <div className="mt-4 grid gap-3 md:grid-cols-2">
                            <p className={softCardClass}>{ui.seniorityLabel}: {displayValue(accountInfo.account_seniority_days)}</p>
                            <p className={softCardClass}>{ui.lastOpLabel}: {displayValue(accountInfo.days_since_last_op)}</p>
                            <p className={softCardClass}>{ui.activitySector}: {displayValue(clientProfile.secteur_activite)}</p>
                            <p className={softCardClass}>{ui.workSeniority}: {displayValue(clientProfile.anciennete_emploi)}</p>
                            <p className={softCardClass}>{ui.debtRatio}: {displayValue(clientProfile.taux_endettement_reel)}</p>
                            <p className={softCardClass}>{ui.toleranceRisk}: {displayValue(clientProfile.tolerance_risque)}</p>
                          </div>
                        )}
                      </article>
                    </div>

                    <aside className={panelClass}>
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

                          <p className={softCardClass}>{ui.riskLevel}: {displayValue(loanDecision?.risk_level)}</p>

                          <div>
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
                          </div>

                          <div>
                            <h3 className="text-sm font-semibold">{ui.capacityTitle}</h3>
                            <div className="mt-2 grid gap-2 text-sm">
                              <p className={softCardClass}>36m: {formatMoney(loanDecision?.borrowing_capacity?.["36_months"])}</p>
                              <p className={softCardClass}>60m: {formatMoney(loanDecision?.borrowing_capacity?.["60_months"])}</p>
                              <p className={softCardClass}>84m: {formatMoney(loanDecision?.borrowing_capacity?.["84_months"])}</p>
                              <p className={softCardClass}>Monthly: {formatMoney(loanDecision?.max_monthly_payment)}</p>
                            </div>
                          </div>

                          <div>
                            <h3 className="text-sm font-semibold">{ui.indicatorsTitle}</h3>
                            <div className="mt-2 grid gap-2 text-sm">
                              <p className={softCardClass}>{ui.segmentLabel}: {displayValue(segmentation.rfm_segment)}</p>
                              <p className={softCardClass}>Savings profile: {displayValue(segmentation.savings_profile)}</p>
                              <p className={softCardClass}>R/F/M: {displayValue(segmentation?.rfm_scores?.R)}/{displayValue(segmentation?.rfm_scores?.F)}/{displayValue(segmentation?.rfm_scores?.M)}</p>
                            </div>
                          </div>
                        </div>
                      )}

                      <p className={`mt-5 inline-flex items-center gap-2 text-xs ${mutedTextClass}`}>
                        <AlertCircle size={13} />
                        {ui.loginExpired}
                      </p>
                    </aside>
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
