import { useEffect, useMemo, useState } from "react";
import { Search, Star, AlertCircle, X, Info, Plus } from "lucide-react";
import { useTheme } from "../contexts/ThemeContext";
import { useLanguage } from "../contexts/LanguageContext";
import { getClientId, getClientRecommendation, getMe, getProductsCatalog } from "../api";
import { Skeleton, SkeletonLines } from "../components/Skeleton";
import bhLogo from "../assets/BH_logo2.png";
import cardBhGoldInternationale from "../assets/cartes/BH Gold Internationale.webp";
import cardBhGoldNationales from "../assets/cartes/BH Gold Nationales.webp";
import card3xpay from "../assets/cartes/Carte 3XPAY.webp";
import cardBhTechnologie from "../assets/cartes/Carte BH technologie.webp";
import cardBhTravel from "../assets/cartes/Carte BH Travel.webp";
import cardCibNationale from "../assets/cartes/Carte CIB Nationale.webp";
import cardPlatinumInternationale from "../assets/cartes/Carte Platinum internationale.webp";
import cardPlatinumNationale from "../assets/cartes/Carte Platinum Nationale.webp";
import cardPlatinumTravel from "../assets/cartes/Carte Platinum Travel.webp";
import cardYasmine from "../assets/cartes/CARTE YASMINE.webp";
import cardVisaInternationale from "../assets/cartes/VISA Internationale.webp";
import photoBhAuto from "../assets/photos/BH AUTO (pour professions libérales).webp";
import photoBhSmsNetmobileTel from "../assets/photos/BH SMS  BH NetMobile  BH TEL.webp";
import photoBonDeCaisse from "../assets/photos/Bon de Caisse.webp";
import photoBta from "../assets/photos/Bons du Trésor Assimilables (BTA).webp";
import photoBtct from "../assets/photos/Bons du Trésor à Court Terme (BTCT).webp";
import photoCertificatDepot from "../assets/photos/Certificat de Dépôt.webp";
import photoCarteBhScolarite from "../assets/photos/Carte BH Scolarite.webp";
import photoCarteGo from "../assets/photos/Carte GO.webp";
import photoCse from "../assets/photos/Compte Spécial d'Épargne (CSE).webp";
import photoCat from "../assets/photos/Compte à Terme (CAT).webp";
import photoCreditOrdi from "../assets/photos/Crédit Achat Ordinateur.webp";
import photoCreditAmenagement from "../assets/photos/Crédit Aménagement (Moyen Terme).webp";
import photoCreditImmo from "../assets/photos/Crédit Direct (Immobilier).webp";
import photoCreditPerso from "../assets/photos/Crédit Personnel.webp";
import photoDhamenCredit from "../assets/photos/DHAMEN (Assurance Crédit).webp";
import photoDhamenCompte from "../assets/photos/DHAMEN COMPTE.webp";
import photoDhamenRetraite from "../assets/photos/Dhamen Epargne Retraite.webp";
import photoEtrade from "../assets/photos/E-Trade (Opérations Internationales).webp";
import photoPackAffaires from "../assets/photos/Pack Affaires (Créateurs d'entreprise).webp";
import photoPackGrow from "../assets/photos/Pack GROW (Professions Libérales).webp";
import photoPackPlatinum from "../assets/photos/Pack Platinum (Clientèle Diamant).webp";
import photoPackSelect from "../assets/photos/Pack Select+.webp";
import photoPackSenior from "../assets/photos/Pack SENIOR (55-80 ans).webp";
import photoPackSmart from "../assets/photos/Pack SMART (Jeunes 18-25 ans).webp";
import photoPelClassique from "../assets/photos/PEL Classique (Plan Épargne Logement).webp";
import photoPelElJedid from "../assets/photos/PEL El Jedid.webp";
import photoPlanEpargneEtudes from "../assets/photos/Plan Épargne Études.webp";
import photoPremierLogement from "../assets/photos/Programme Al Masken Al Awel (Premier Logement).webp";
import photoSicav from "../assets/photos/SICAV BH Placement.webp";
import photoAssurSenior from "../assets/photos/Assur Senior.webp";
import photoAssuranceIncendie from "../assets/photos/Assurance Incendie.webp";
import photoAvancePromedica from "../assets/photos/Avance Promedica.webp";
import photoCmt from "../assets/photos/CMT.webp";
import photoCreditPro from "../assets/photos/Crédit PRO.webp";

const uiByLanguage = {
  en: {
    title: "Products Catalog",
    subtitle: "Explore all BH Bank products with complete details.",
    searchPlaceholder: "Search by product name or description",
    allCategories: "All categories",
    loading: "Loading products...",
    noProducts: "No products found.",
    recommended: "Recommended",
    recommendedForYou: "Recommended for you",
    allProducts: "All products",
    moreInfo: "More info",
    recommendationTitle: "Why this product is good for you",
    recommendationFallback:
      "This product matches your profile, account activity, and financial goals.",
    featuresTitle: "Key features",
    detailsTitle: "Additional details",
    compareTitle: "BH Product Comparator",
    compareSubtitle: "Select 2 or 3 products to compare rates, duration, monthly estimate, and profile eligibility.",
    compareAmountLabel: "Simulation amount (TND)",
    compareAmountHint: "Used to estimate monthly payment for financing products.",
    compareSelectionCount: "Selected products",
    compareMinHint: "Select at least 1 pack to display the comparison table.",
    compareMaxHint: "Maximum 3 products can be compared at once.",
    compareReset: "Reset comparison",
    compareAdd: "Compare",
    compareRemove: "Remove",
    compareBestFit: "Best fit",
    compareMetric: "Feature",
    compareRowCategory: "Category",
    compareRowRate: "Rate",
    compareRowDuration: "Duration",
    compareRowMonthly: "Estimated monthly payment",
    compareRowEligibility: "Profile eligibility",
    compareRowConditions: "Eligibility conditions",
    compareRowFit: "Fit score",
    compareNoRate: "N/A",
    compareNoDuration: "N/A",
    compareNoMonthly: "N/A",
    compareMonths: "months",
    compareStatusEligible: "Eligible",
    compareStatusPartial: "Partially eligible",
    compareStatusNotEligible: "Not eligible",
    compareStatusReview: "To review",
    compareConditionRecommended: "Recommended by your profile model.",
    compareConditionLoanEligible: "Loan profile: Eligible.",
    compareConditionLoanPartial: "Loan profile: Partially Eligible.",
    compareConditionLoanNotEligible: "Loan profile: Not Eligible.",
    compareConditionLoanReview: "Loan profile unavailable.",
    compareConditionIncomeMissing: "Monthly income missing in profile.",
    compareConditionDebtHealthy: "Projected debt ratio within 40%.",
    compareConditionDebtWatch: "Projected debt ratio above 40%.",
    compareConditionDebtHigh: "Projected debt ratio too high.",
    compareConditionLoanOnly: "Monthly payment applies to financing products only.",
    compareConditionIncomeThreshold: "Minimum advised income:",
    compareConditionAgeRange: "Age condition:",
    compareConditionAgeUnknown: "Age band missing in profile.",
    compareConditionProfessionMismatch: "Professional status does not fully match this product.",
    compareConditionProfessionMatched: "Professional status aligned with this product.",
    compareConditionHousingMismatch: "Housing profile may not match first-home rules.",
    comparePackPanelTitle: "Compare packs",
    comparePackSelectedCount: "({count} pack(s) selected)",
    compareAddPack: "Add a pack",
    compareRunAction: "Compare",
    compareNoSelectionState: "No product selected.",
    compareUniqueHint: "The same product cannot be selected twice.",
    compareViewAll: "All",
    compareViewDifferences: "Differences",
    compareViewSimilarities: "Similarities",
    compareNoRowsForMode: "No rows to show for this filter.",
    compareSelectPlaceholder: "Select a pack",
    close: "Close",
  },
  fr: {
    title: "Catalogue des produits",
    subtitle: "Explorez tous les produits BH Bank avec leurs details complets.",
    searchPlaceholder: "Rechercher par nom ou description",
    allCategories: "Toutes les categories",
    loading: "Chargement des produits...",
    noProducts: "Aucun produit trouve.",
    recommended: "Recommande",
    recommendedForYou: "Produits recommandes pour vous",
    allProducts: "Tous les produits",
    moreInfo: "Plus d'infos",
    recommendationTitle: "Pourquoi ce produit est adapte a votre profil",
    recommendationFallback:
      "Ce produit est coherent avec votre profil, votre activite bancaire et vos objectifs financiers.",
    featuresTitle: "Caracteristiques principales",
    detailsTitle: "Informations complementaires",
    compareTitle: "Comparateur de produits BH Bank",
    compareSubtitle: "Selectionnez 2 ou 3 produits pour comparer taux, duree, mensualite estimee et eligibilite selon votre profil reel.",
    compareAmountLabel: "Montant de simulation (TND)",
    compareAmountHint: "Utilise pour estimer la mensualite des produits de financement.",
    compareSelectionCount: "Produits selectionnes",
    compareMinHint: "Selectionnez au moins 1 pack pour afficher le tableau comparatif.",
    compareMaxHint: "Maximum 3 produits comparables en meme temps.",
    compareReset: "Reinitialiser",
    compareAdd: "Comparer",
    compareRemove: "Retirer",
    compareBestFit: "Meilleur choix",
    compareMetric: "CARACTERISTIQUE",
    compareRowCategory: "Categorie",
    compareRowRate: "Taux",
    compareRowDuration: "Duree",
    compareRowMonthly: "Mensualite estimee",
    compareRowEligibility: "Eligibilite profil",
    compareRowConditions: "Conditions d'eligibilite",
    compareRowFit: "Score d'adaptation",
    compareNoRate: "N/A",
    compareNoDuration: "N/A",
    compareNoMonthly: "N/A",
    compareMonths: "mois",
    compareStatusEligible: "Eligible",
    compareStatusPartial: "Partiellement eligible",
    compareStatusNotEligible: "Non eligible",
    compareStatusReview: "A verifier",
    compareConditionRecommended: "Produit recommande par votre profil.",
    compareConditionLoanEligible: "Profil credit: Eligible.",
    compareConditionLoanPartial: "Profil credit: Partiellement Eligible.",
    compareConditionLoanNotEligible: "Profil credit: Not Eligible.",
    compareConditionLoanReview: "Profil credit indisponible.",
    compareConditionIncomeMissing: "Revenu mensuel absent du profil.",
    compareConditionDebtHealthy: "Taux d'endettement projete <= 40%.",
    compareConditionDebtWatch: "Taux d'endettement projete > 40%.",
    compareConditionDebtHigh: "Taux d'endettement projete trop eleve.",
    compareConditionLoanOnly: "La mensualite ne s'applique qu'aux produits de financement.",
    compareConditionIncomeThreshold: "Revenu minimum conseille:",
    compareConditionAgeRange: "Condition d'age:",
    compareConditionAgeUnknown: "Tranche d'age absente du profil.",
    compareConditionProfessionMismatch: "Statut professionnel partiellement non aligne avec ce produit.",
    compareConditionProfessionMatched: "Statut professionnel aligne avec ce produit.",
    compareConditionHousingMismatch: "Profil logement potentiellement non conforme aux regles primo-accedant.",
    comparePackPanelTitle: "Comparer les packs",
    comparePackSelectedCount: "({count} packs sont selectionnes)",
    compareAddPack: "Ajouter un pack",
    compareRunAction: "Comparer",
    compareNoSelectionState: "Aucun produit selectionne.",
    compareUniqueHint: "Le meme produit ne peut pas etre selectionne deux fois.",
    compareViewAll: "Tous",
    compareViewDifferences: "Differences",
    compareViewSimilarities: "Similitudes",
    compareNoRowsForMode: "Aucune ligne a afficher pour ce filtre.",
    compareSelectPlaceholder: "Selectionner un pack",
    close: "Fermer",
  },
  ar: {
    title: "دليل المنتجات",
    subtitle: "اكتشف جميع منتجات بنك BH مع شرح واضح لكل خدمة.",
    searchPlaceholder: "ابحث باسم المنتج أو وصفه",
    allCategories: "كل الفئات",
    loading: "جاري تحميل المنتجات...",
    noProducts: "لم يتم العثور على منتجات.",
    recommended: "موصى به لك",
    recommendedForYou: "المنتجات الموصى بها لك",
    allProducts: "كل المنتجات",
    moreInfo: "عرض التفاصيل",
    recommendationTitle: "لماذا ننصحك بهذا المنتج؟",
    recommendationFallback:
      "اخترنا هذا المنتج لأنه يتوافق مع احتياجاتك المالية ونمط استخدامك البنكي.",
    featuresTitle: "المزايا الأساسية",
    detailsTitle: "تفاصيل إضافية",
    compareTitle: "مقارن منتجات BH Bank",
    compareSubtitle: "اختر 2 أو 3 منتجات لمقارنة النسبة والمدة والقسط التقديري والأهلية حسب ملفك الحقيقي.",
    compareAmountLabel: "مبلغ المحاكاة (TND)",
    compareAmountHint: "يُستخدم لتقدير القسط الشهري لمنتجات التمويل.",
    compareSelectionCount: "المنتجات المختارة",
    compareMinHint: "اختر باقة واحدة على الأقل لعرض جدول المقارنة.",
    compareMaxHint: "يمكن مقارنة 3 منتجات كحد أقصى.",
    compareReset: "إعادة التعيين",
    compareAdd: "مقارنة",
    compareRemove: "إزالة",
    compareBestFit: "الأنسب",
    compareMetric: "الخاصية",
    compareRowCategory: "الفئة",
    compareRowRate: "النسبة",
    compareRowDuration: "المدة",
    compareRowMonthly: "القسط الشهري التقديري",
    compareRowEligibility: "أهلية الملف",
    compareRowConditions: "شروط الأهلية",
    compareRowFit: "درجة الملاءمة",
    compareNoRate: "غير متاح",
    compareNoDuration: "غير متاح",
    compareNoMonthly: "غير متاح",
    compareMonths: "شهر",
    compareStatusEligible: "مؤهل",
    compareStatusPartial: "مؤهل جزئيا",
    compareStatusNotEligible: "غير مؤهل",
    compareStatusReview: "يحتاج مراجعة",
    compareConditionRecommended: "منتج موصى به حسب ملفك.",
    compareConditionLoanEligible: "أهلية القرض: مؤهل.",
    compareConditionLoanPartial: "أهلية القرض: مؤهل جزئيا.",
    compareConditionLoanNotEligible: "أهلية القرض: غير مؤهل.",
    compareConditionLoanReview: "بيانات أهلية القرض غير متوفرة.",
    compareConditionIncomeMissing: "الدخل الشهري غير متوفر في الملف.",
    compareConditionDebtHealthy: "نسبة المديونية المتوقعة ضمن 40%.",
    compareConditionDebtWatch: "نسبة المديونية المتوقعة أعلى من 40%.",
    compareConditionDebtHigh: "نسبة المديونية المتوقعة مرتفعة جدا.",
    compareConditionLoanOnly: "القسط الشهري يخص منتجات التمويل فقط.",
    compareConditionIncomeThreshold: "الحد الأدنى الموصى به للدخل:",
    compareConditionAgeRange: "شرط العمر:",
    compareConditionAgeUnknown: "فئة العمر غير متوفرة في الملف.",
    compareConditionProfessionMismatch: "الوضع المهني لا يتطابق بالكامل مع هذا المنتج.",
    compareConditionProfessionMatched: "الوضع المهني متوافق مع هذا المنتج.",
    compareConditionHousingMismatch: "وضع السكن قد لا يطابق شروط السكن الأول.",
    comparePackPanelTitle: "مقارنة الباقات",
    comparePackSelectedCount: "(تم اختيار {count} باقة)",
    compareAddPack: "إضافة باقة",
    compareRunAction: "مقارنة",
    compareNoSelectionState: "لم يتم اختيار أي منتج.",
    compareUniqueHint: "لا يمكن اختيار نفس المنتج مرتين.",
    compareViewAll: "الكل",
    compareViewDifferences: "الاختلافات",
    compareViewSimilarities: "التشابهات",
    compareNoRowsForMode: "لا توجد صفوف مطابقة لهذا الفلتر.",
    compareSelectPlaceholder: "اختر باقة",
    close: "إغلاق",
  },
};

const categoryLabels = {
  en: {
    "Épargne": "Savings",
    "Crédits": "Loans",
    Cartes: "Cards",
    Packs: "Packs",
    Assurances: "Insurance",
    Services: "Services",
  },
  fr: {
    "Épargne": "Epargne",
    "Crédits": "Credits",
    Cartes: "Cartes",
    Packs: "Packs",
    Assurances: "Assurances",
    Services: "Services",
  },
  ar: {
    "Épargne": "ادخار",
    "Crédits": "قروض",
    Cartes: "بطاقات",
    Packs: "حزم",
    Assurances: "تأمين",
    Services: "خدمات",
  },
};

const extendedProducts = [
  {
    id: "certificat-depot",
    category: "Épargne",
    name: "Certificat de Depot",
    description: "Placement negocie pour les montants importants avec rendement fixe.",
    features: ["Capital garanti", "Taux negocie", "Durée flexible"],
  },
  {
    id: "bta",
    category: "Épargne",
    name: "Bons du Tresor Assimilables (BTA)",
    description: "Titre d'Etat a moyen et long terme avec rendement connu a l'avance.",
    features: ["Placement souverain", "Risque modere", "Rendement planifie"],
  },
  {
    id: "btct",
    category: "Épargne",
    name: "Bons du Tresor a Court Terme (BTCT)",
    description: "Placement sur horizon court pour diversifier votre epargne de tresorerie.",
    features: ["Horizon court", "Liquidite reguliere", "Support de tresorerie"],
  },
  {
    id: "carte-yasmine",
    category: "Cartes",
    name: "Carte Yasmine",
    description: "Carte nationale pour paiements et retraits avec services BH digitaux.",
    features: ["Paiement local", "Retrait DAB", "Gestion via BH Net"],
  },
  {
    id: "carte-go",
    category: "Cartes",
    name: "Carte GO",
    description: "Carte adaptee aux jeunes 18-25 ans avec offres digitales.",
    features: ["Offres jeunes", "Paiements rapides", "Compatible mobile"],
  },
  {
    id: "carte-gold-nat",
    category: "Cartes",
    name: "Carte BH Gold Nationale",
    description: "Carte premium nationale avec plafonds et services etendus.",
    features: ["Plafond eleve", "Assistance", "Avantages premium"],
  },
  {
    id: "carte-platinum-nat",
    category: "Cartes",
    name: "Carte BH Platinum Nationale",
    description: "Carte haut de gamme avec avantages exclusifs et assistance renforcee.",
    features: ["Premium", "Conciergerie", "Assurances"],
  },
  {
    id: "visa-classic-int",
    category: "Cartes",
    name: "Visa Classic Internationale",
    description: "Carte internationale pour paiements et retraits a l'etranger.",
    features: ["Paiement international", "Retrait international", "Securite 3D"],
  },
  {
    id: "carte-scolarite",
    category: "Cartes",
    name: "Carte BH Scolarite",
    description: "Carte dediee aux depenses scolaires et universitaires.",
    features: ["Frais etudes", "Suivi parental", "Paiement securise"],
  },
  {
    id: "pack-affaires",
    category: "Packs",
    name: "Pack Affaires",
    description: "Pack pour createurs d'entreprise et activite professionnelle.",
    features: ["Compte pro", "Services digitaux", "Accompagnement"],
  },
  {
    id: "assur-senior",
    category: "Assurances",
    name: "Assur Senior",
    description: "Protection et assistance adaptees aux clients seniors.",
    features: ["Protection senior", "Assistance medicale", "Couverture etendue"],
  },
  {
    id: "assurance-incendie",
    category: "Assurances",
    name: "Assurance Incendie",
    description: "Couverture des biens en cas d'incendie et risques associes.",
    features: ["Protection habitation", "Indemnisation", "Assistance"],
  },
  {
    id: "bh-netmobile",
    category: "Services",
    name: "BH NetMobile",
    description: "Application mobile pour suivre comptes, cartes et operations.",
    features: ["24/7", "Virements", "Consultation en temps reel"],
  },
  {
    id: "credit-pro",
    category: "Crédits",
    name: "Credit PRO",
    description: "Financement dedie aux besoins professionnels et tres petites entreprises.",
    features: ["Tresorerie", "Investissement", "Echeances adaptees"],
  },
  {
    id: "cmt",
    category: "Crédits",
    name: "CMT",
    description: "Credit moyen terme pour equipement professionnel.",
    features: ["Moyen terme", "Equipement", "Montant sur mesure"],
  },
  {
    id: "avance-promedica",
    category: "Crédits",
    name: "Avance Promedica",
    description: "Solution de financement ciblee pour professionnels de la sante.",
    features: ["Professions medicales", "Deblocage rapide", "Taux preferentiel"],
  },
];

const recommendationKeyToProductId = {
  "plan-epargne-etudes": "epargne-etudes",
  cse: "cse-yaychek",
  "bon-de-caisse": "bon-caisse",
  "certificat-depot": "certificat-depot",
  bta: "bta",
  btct: "btct",
  "bons-du-tresor-assimilables-bta": "bta",
  "bons-du-tresor-a-court-terme-btct": "btct",
  cat: "cat",
  "pel-classique": "pel",
  "pel-el-jedid": "pel",
  "credit-direct": "credit-immo",
  "al-masken": "premier-logement",
  "credit-personnel": "credit-perso",
  "bh-auto": "bh-auto",
  "credit-ordinateur": "credit-ordi",
  "credit-amenagement": "credit-amenagement",
  "carte-cib": "carte-cib",
  "carte-yasmine": "carte-yasmine",
  "carte-go": "carte-go",
  "carte-gold-nat": "carte-gold-nat",
  "carte-platinum-nat": "carte-platinum-nat",
  "visa-classic-int": "visa-classic-int",
  "carte-gold-int": "carte-gold-intl",
  "carte-platinum-int": "carte-platinum-intl",
  "carte-travel": "carte-travel",
  "carte-scolarite": "carte-scolarite",
  "carte-technologie": "carte-technologie",
  "carte-3xpay": "carte-3xpay",
  "pack-smart": "pack-smart",
  "pack-select": "pack-select",
  "pack-senior": "pack-senior",
  "pack-grow": "pack-grow",
  "pack-affaires": "pack-affaires",
  "pack-platinum": "pack-platinum",
  "dhamen-credit": "dhamen-credit",
  "dhamen-compte": "dhamen-compte",
  "dhamen-epargne-ret": "dhamen-retraite",
  "assur-senior": "assur-senior",
  "assurance-incendie": "assurance-incendie",
  "bh-netmobile": "bh-netmobile",
  "bh-sms": "bh-sms",
  "credit-pro": "credit-pro",
  cmt: "cmt",
  "avance-promedica": "avance-promedica",
};

const productNameTranslations = {
  "epargne-etudes": {
    en: "Education Savings Plan",
    fr: "Plan Epargne Etudes",
    ar: "خطة ادخار التعليم",
  },
  "cse-yaychek": {
    en: "Y'Aychek Savings Account",
    fr: "Compte Epargne Y'Aychek",
    ar: "حساب ادخار يعيشك",
  },
  "bon-caisse": { en: "Cash Certificate", fr: "Bon de Caisse", ar: "شهادة ادخار نقدية" },
  bta: {
    en: "Treasury Bonds (BTA)",
    fr: "Bons du Tresor Assimilables (BTA)",
    ar: "سندات الخزينة القابلة للإدماج (BTA)",
  },
  btct: {
    en: "Short-Term Treasury Bills (BTCT)",
    fr: "Bons du Tresor a Court Terme (BTCT)",
    ar: "أذون الخزينة قصيرة الأجل (BTCT)",
  },
  cat: { en: "Term Deposit Account", fr: "Compte a Terme", ar: "حساب لأجل" },
  pel: { en: "Home Savings Plan", fr: "Plan Epargne Logement", ar: "خطة ادخار السكن" },
  sicav: { en: "SICAV BH Placement", fr: "SICAV BH Placement", ar: "سيكاف BH للاستثمار" },
  "credit-immo": {
    en: "Direct Mortgage Loan",
    fr: "Credit Immobilier Direct",
    ar: "قرض عقاري مباشر",
  },
  "premier-logement": {
    en: "First Home Program",
    fr: "Al Masken Al Awel",
    ar: "برنامج المسكن الأول",
  },
  "credit-perso": { en: "Personal Loan", fr: "Credit Personnel", ar: "قرض شخصي" },
  "bh-auto": { en: "BH Auto Loan", fr: "BH Auto", ar: "قرض سيارة BH" },
  "credit-ordi": { en: "Computer Loan", fr: "Credit Ordinateur", ar: "قرض حاسوب" },
  "credit-amenagement": {
    en: "Renovation Loan",
    fr: "Credit Amenagement",
    ar: "قرض التهيئة",
  },
  "carte-3xpay": {
    en: "3XPAY Card",
    fr: "Carte 3XPAY",
    ar: "بطاقة 3XPAY",
  },
  "carte-platinum-intl": {
    en: "International Platinum Card",
    fr: "Carte Platinum Internationale",
    ar: "بطاقة بلاتينيوم دولية",
  },
  "carte-gold-intl": {
    en: "International Gold Card",
    fr: "Carte Gold Internationale",
    ar: "بطاقة ذهبية دولية",
  },
  "carte-technologie": {
    en: "BH Technology Card",
    fr: "Carte BH Technologie",
    ar: "بطاقة BH للتكنولوجيا",
  },
  "carte-travel": { en: "BH Travel Card", fr: "Carte BH Travel", ar: "بطاقة BH للسفر" },
  "carte-cib": { en: "CIB Card", fr: "Carte CIB", ar: "بطاقة CIB" },
  "pack-select": { en: "Select+ Pack", fr: "Pack Select+", ar: "حزمة Select+" },
  "pack-platinum": { en: "Platinum Pack", fr: "Pack Platinum", ar: "حزمة بلاتينيوم" },
  "pack-grow": { en: "GROW Pack", fr: "Pack GROW", ar: "حزمة GROW" },
  "pack-senior": { en: "Senior Pack", fr: "Pack Senior", ar: "حزمة سينيور" },
  "pack-smart": { en: "SMART Pack", fr: "Pack SMART", ar: "حزمة SMART" },
  "dhamen-credit": { en: "DHAMEN Credit", fr: "DHAMEN Credit", ar: "تأمين ضمان القرض" },
  "dhamen-compte": { en: "DHAMEN Account", fr: "DHAMEN Compte", ar: "تأمين ضمان الحساب" },
  "dhamen-retraite": {
    en: "Retirement Savings Insurance",
    fr: "Dhamen Epargne Retraite",
    ar: "تأمين ادخار التقاعد",
  },
  "bh-sms": { en: "BH SMS Alerts", fr: "BH SMS", ar: "خدمة رسائل BH" },
  "e-trade": { en: "E-Trade Service", fr: "E-Trade", ar: "خدمة التجارة الإلكترونية" },
  "certificat-depot": { en: "Deposit Certificate", fr: "Certificat de Depot", ar: "شهادة إيداع" },
  "carte-yasmine": { en: "Yasmine Card", fr: "Carte Yasmine", ar: "بطاقة ياسمين" },
  "carte-go": { en: "GO Card", fr: "Carte GO", ar: "بطاقة GO" },
  "carte-gold-nat": {
    en: "National Gold Card",
    fr: "Carte BH Gold Nationale",
    ar: "بطاقة ذهبية وطنية",
  },
  "carte-platinum-nat": {
    en: "National Platinum Card",
    fr: "Carte BH Platinum Nationale",
    ar: "بطاقة بلاتينيوم وطنية",
  },
  "visa-classic-int": {
    en: "Visa Classic International",
    fr: "Visa Classic Internationale",
    ar: "فيزا كلاسيك دولية",
  },
  "carte-scolarite": {
    en: "School Card",
    fr: "Carte BH Scolarite",
    ar: "بطاقة الدراسة",
  },
  "pack-affaires": { en: "Business Pack", fr: "Pack Affaires", ar: "حزمة الأعمال" },
  "assur-senior": { en: "Senior Insurance", fr: "Assur Senior", ar: "تأمين كبار السن" },
  "assurance-incendie": {
    en: "Fire Insurance",
    fr: "Assurance Incendie",
    ar: "تأمين الحريق",
  },
  "bh-netmobile": { en: "BH NetMobile", fr: "BH NetMobile", ar: "تطبيق BH NetMobile" },
  "credit-pro": { en: "Professional Loan", fr: "Credit PRO", ar: "قرض مهني" },
  cmt: { en: "Medium-Term Loan", fr: "CMT", ar: "قرض متوسط الأجل" },
  "avance-promedica": {
    en: "Promedica Advance",
    fr: "Avance Promedica",
    ar: "سلفة بروميديكا",
  },
};

const categoryImageTheme = {
  "Épargne": { from: "#0ea5e9", to: "#0369a1", accent: "#bae6fd" },
  "Crédits": { from: "#4f46e5", to: "#1d4ed8", accent: "#c7d2fe" },
  Cartes: { from: "#0f766e", to: "#0ea5a3", accent: "#99f6e4" },
  Packs: { from: "#7c3aed", to: "#a855f7", accent: "#ddd6fe" },
  Assurances: { from: "#059669", to: "#16a34a", accent: "#bbf7d0" },
  Services: { from: "#ea580c", to: "#f59e0b", accent: "#fed7aa" },
};

const productImageById = {
  "carte-3xpay": card3xpay,
  "carte-cib": cardCibNationale,
  "carte-go": photoCarteGo,
  "carte-scolarite": photoCarteBhScolarite,
  "carte-yasmine": cardYasmine,
  "carte-technologie": cardBhTechnologie,
  "carte-travel": cardBhTravel,
  "carte-platinum-intl": cardPlatinumInternationale,
  "carte-platinum-nat": cardPlatinumNationale,
  "carte-gold-intl": cardBhGoldInternationale,
  "carte-gold-nat": cardBhGoldNationales,
  "visa-classic-int": cardVisaInternationale,
  // Keep aliases for potential future IDs.
  "carte-platinum-travel": cardPlatinumTravel,
  "carte-gold-int": cardBhGoldInternationale,
  "carte-platinum-int": cardPlatinumInternationale,

  "epargne-etudes": photoPlanEpargneEtudes,
  "plan-epargne-etudes": photoPlanEpargneEtudes,
  "cse-yaychek": photoCse,
  cse: photoCse,
  "bon-caisse": photoBonDeCaisse,
  bta: photoBta,
  "bons-du-tresor-assimilables-bta": photoBta,
  btct: photoBtct,
  "bons-du-tresor-a-court-terme-btct": photoBtct,
  cat: photoCat,
  pel: photoPelClassique,
  "pel-classique": photoPelClassique,
  "pel-el-jedid": photoPelElJedid,
  sicav: photoSicav,
  "certificat-depot": photoCertificatDepot,

  "credit-immo": photoCreditImmo,
  "credit-direct": photoCreditImmo,
  "premier-logement": photoPremierLogement,
  "al-masken": photoPremierLogement,
  "credit-perso": photoCreditPerso,
  "bh-auto": photoBhAuto,
  "credit-ordi": photoCreditOrdi,
  "credit-amenagement": photoCreditAmenagement,
  "credit-pro": photoCreditPro,
  cmt: photoCmt,
  "avance-promedica": photoAvancePromedica,

  "pack-platinum": photoPackPlatinum,
  "pack-affaires": photoPackAffaires,
  "pack-grow": photoPackGrow,
  "pack-select": photoPackSelect,
  "pack-senior": photoPackSenior,
  "pack-smart": photoPackSmart,

  "dhamen-credit": photoDhamenCredit,
  "dhamen-compte": photoDhamenCompte,
  "dhamen-retraite": photoDhamenRetraite,
  "dhamen-epargne-ret": photoDhamenRetraite,
  "assur-senior": photoAssurSenior,
  "assurance-incendie": photoAssuranceIncendie,

  "bh-netmobile": photoBhSmsNetmobileTel,
  "bh-sms": photoBhSmsNetmobileTel,
  "bh-tel": photoBhSmsNetmobileTel,
  "e-trade": photoEtrade,
};

const thematicUnsplashUrl = (keywords, sig) =>
  `https://source.unsplash.com/1600x900/?${encodeURIComponent(keywords)}&sig=${sig}`;

const makeImageSignature = (value) => {
  const text = String(value || "bh-product");
  let hash = 0;

  for (let i = 0; i < text.length; i += 1) {
    hash = ((hash << 5) - hash + text.charCodeAt(i)) | 0;
  }

  return 2000 + Math.abs(hash % 500000);
};

const productImageUrlById = {
  "epargne-etudes": thematicUnsplashUrl("education,savings,students", 1001),
  "cse-yaychek": thematicUnsplashUrl("family,savings,bank", 1002),
  "bon-caisse": thematicUnsplashUrl("cash,deposit,certificate", 1003),
  bta: thematicUnsplashUrl("treasury,bond,investment", 1103),
  btct: thematicUnsplashUrl("treasury,bill,finance", 1104),
  cat: thematicUnsplashUrl("term,deposit,finance", 1004),
  pel: thematicUnsplashUrl("home,savings,planning", 1005),
  sicav: thematicUnsplashUrl("stock,market,investment", 1006),
  "certificat-depot": thematicUnsplashUrl("bank,certificate,money", 1007),

  "credit-immo": thematicUnsplashUrl("mortgage,house,keys", 1008),
  "premier-logement": thematicUnsplashUrl("first,home,apartment", 1009),
  "credit-perso": thematicUnsplashUrl("personal,loan,budget", 1010),
  "bh-auto": thematicUnsplashUrl("car,loan,driver", 1011),
  "credit-ordi": thematicUnsplashUrl("laptop,computer,technology", 1012),
  "credit-amenagement": thematicUnsplashUrl("home,renovation,interior", 1013),
  "credit-pro": thematicUnsplashUrl("business,office,finance", 1014),
  cmt: thematicUnsplashUrl("equipment,industry,business", 1015),
  "avance-promedica": thematicUnsplashUrl("doctor,medical,clinic", 1016),

  "carte-go": thematicUnsplashUrl("young,banking,smartphone", 1017),
  "carte-scolarite": thematicUnsplashUrl("student,education,payment", 1018),

  "pack-platinum": thematicUnsplashUrl("premium,banking,lifestyle", 1019),
  "pack-affaires": thematicUnsplashUrl("entrepreneur,business,meeting", 1020),
  "pack-grow": thematicUnsplashUrl("growth,professional,success", 1021),
  "pack-select": thematicUnsplashUrl("bank,customer,service", 1022),
  "pack-senior": thematicUnsplashUrl("senior,retirement,smile", 1023),
  "pack-smart": thematicUnsplashUrl("young,digital,banking", 1024),

  "dhamen-credit": thematicUnsplashUrl("insurance,credit,protection", 1025),
  "dhamen-compte": thematicUnsplashUrl("insurance,account,security", 1026),
  "dhamen-retraite": thematicUnsplashUrl("retirement,insurance,planning", 1027),
  "assur-senior": thematicUnsplashUrl("senior,health,insurance", 1028),
  "assurance-incendie": thematicUnsplashUrl("home,fire,safety", 1029),

  "bh-netmobile": thematicUnsplashUrl("mobile,banking,app", 1030),
  "bh-sms": thematicUnsplashUrl("phone,sms,notification", 1031),
  "e-trade": thematicUnsplashUrl("trading,chart,market", 1032),
};

const categoryImageKeywordByCategory = {
  "Épargne": "savings,bank,coins",
  "Crédits": "loan,finance,calculator",
  Cartes: "card,payment,shopping",
  Packs: "service,bundle,bank",
  Assurances: "insurance,protection,family",
  Services: "digital,service,technology",
};

const COMPARISON_MIN_SELECTION = 1;
const COMPARISON_MAX_SELECTION = 3;
const DEFAULT_COMPARISON_AMOUNT = 30000;
const DEFAULT_LOAN_RATE = 10.5;
const DEFAULT_LOAN_DURATION_MONTHS = 60;
const BCT_DEBT_RATIO_SOFT_LIMIT = 0.4;
const BCT_DEBT_RATIO_HARD_LIMIT = 0.5;

const PACK_CELL_YES = "__yes__";
const PACK_CELL_NO = "__no__";
const PACK_CELL_DASH = "__dash__";

const curatedPackComparisonRows = [
  {
    key: "target",
    label: { en: "Target Segment", fr: "CLIENTELE CIBLE", ar: "الفئة المستهدفة" },
    values: {
      "pack-platinum": "Or & Diamant",
      "pack-affaires": "TPE-PME",
      "pack-grow": "Professions Liberales",
      "pack-select": "Argent",
      "pack-senior": PACK_CELL_DASH,
      "pack-smart": "Jeune (18 a 25 ans)",
    },
  },
  {
    key: "account",
    label: { en: "Current Account", fr: "COMPTE DE DEPOT", ar: "حساب الإيداع" },
    values: {
      "pack-platinum": PACK_CELL_YES,
      "pack-affaires": "Compte courant",
      "pack-grow": "Compte courant 1017",
      "pack-select": PACK_CELL_YES,
      "pack-senior": PACK_CELL_DASH,
      "pack-smart": PACK_CELL_YES,
    },
  },
  {
    key: "pricing",
    label: { en: "Pricing", fr: "TARIFICATION", ar: "التسعير" },
    values: {
      "pack-platinum": "36 DT/Tr - 52 DT/Tr",
      "pack-affaires": "50 DT/Tr - 64 DT/Tr",
      "pack-grow": "43 DT/Tr",
      "pack-select": "23 DT/Tr - 28 DT/Tr",
      "pack-senior": PACK_CELL_DASH,
      "pack-smart": "15 DT/Tr",
    },
  },
  {
    key: "main-card",
    label: { en: "Main Card", fr: "CARTE PRINCIPALE", ar: "البطاقة الرئيسية" },
    values: {
      "pack-platinum": "BH Platinum nationale ou Gold Nationale",
      "pack-affaires": "BH Classic Nationale ou BH Platinum Nationale",
      "pack-grow": "BH GOLD nationale",
      "pack-select": "Nationale Yasmine ou CIB",
      "pack-senior": PACK_CELL_DASH,
      "pack-smart": "Nationale GO",
    },
  },
  {
    key: "international-card",
    label: { en: "International Card", fr: "CARTE INTERNATIONALE", ar: "البطاقة الدولية" },
    values: {
      "pack-platinum": "Option : Platinum Internationale (AVA)",
      "pack-affaires": "Option : Classic ou Platinum Internationale (AVA)",
      "pack-grow": "Option : BH TRAVEL ou Visa Gold Internationale (AVA)",
      "pack-select": PACK_CELL_NO,
      "pack-senior": PACK_CELL_DASH,
      "pack-smart": PACK_CELL_NO,
    },
  },
  {
    key: "remote-service",
    label: { en: "Remote Service", fr: "SERVICE A DISTANCE", ar: "الخدمات عن بعد" },
    values: {
      "pack-platinum": PACK_CELL_YES,
      "pack-affaires": PACK_CELL_YES,
      "pack-grow": "BH Net Mobile professionnel",
      "pack-select": PACK_CELL_YES,
      "pack-senior": PACK_CELL_DASH,
      "pack-smart": PACK_CELL_YES,
    },
  },
  {
    key: "dhamen-membership",
    label: { en: "DHAMEN Membership", fr: "ADHESION A \"DHAMEN COMPTE\"", ar: "الانخراط في ضمان الحساب" },
    values: {
      "pack-platinum": PACK_CELL_YES,
      "pack-affaires": PACK_CELL_NO,
      "pack-grow": PACK_CELL_NO,
      "pack-select": PACK_CELL_YES,
      "pack-senior": PACK_CELL_DASH,
      "pack-smart": PACK_CELL_YES,
    },
  },
  {
    key: "savings-account",
    label: { en: "Savings Account", fr: "COMPTE D'EPARGNE", ar: "حساب الادخار" },
    values: {
      "pack-platinum": PACK_CELL_YES,
      "pack-affaires": PACK_CELL_YES,
      "pack-grow": PACK_CELL_NO,
      "pack-select": PACK_CELL_YES,
      "pack-senior": PACK_CELL_DASH,
      "pack-smart": PACK_CELL_YES,
    },
  },
  {
    key: "standing-transfer",
    label: { en: "Standing Transfer", fr: "VIREMENT PERMANENT", ar: "التحويل الدائم" },
    values: {
      "pack-platinum": PACK_CELL_YES,
      "pack-affaires": PACK_CELL_NO,
      "pack-grow": PACK_CELL_YES,
      "pack-select": PACK_CELL_YES,
      "pack-senior": PACK_CELL_DASH,
      "pack-smart": PACK_CELL_YES,
    },
  },
  {
    key: "extra-options",
    label: { en: "Extra Options", fr: "OPTIONS SUPPLEMENTAIRES", ar: "خيارات اضافية" },
    values: {
      "pack-platinum": "E-Trade, BH M Pay, Dahmen Epargne Retraite, Carte d'epargne",
      "pack-affaires": "Carte Internationale, E-Trade professionnel, BH MPay Pro",
      "pack-grow": "Carte BH TRAVEL, Visa Gold Internationale, BH SMS",
      "pack-select": "BH Recharge, Assurance Dhamen Compte, Carte d'epargne",
      "pack-senior": PACK_CELL_DASH,
      "pack-smart": "Credit Permis, Credit TIC",
    },
  },
  {
    key: "exclusive-benefits",
    label: { en: "Exclusive Benefits", fr: "AVANTAGES EXCLUSIFS", ar: "مزايا حصرية" },
    values: {
      "pack-platinum": "Chequier personnalise, reductions, Assurance & Assistance MasterCard",
      "pack-affaires": "Reductions, assistance personnalisee, Assurance & Assistance MasterCard",
      "pack-grow": "Avantages sur credits et operations bancaires, acces aux offres BH Bank",
      "pack-select": "Tarification reduite, options supplementaires",
      "pack-senior": PACK_CELL_DASH,
      "pack-smart": "Credits specifiques pour jeunes",
    },
  },
];

const curatedPackIds = new Set([
  "pack-platinum",
  "pack-affaires",
  "pack-grow",
  "pack-select",
  "pack-senior",
  "pack-smart",
]);

const productFinanceProfiles = {
  "credit-immo": { annualRate: 10.24, durationMonths: 300, isLoan: true },
  "premier-logement": { annualRate: 8.95, durationMonths: 300, isLoan: true },
  "credit-perso": { annualRate: 11.99, durationMonths: 84, isLoan: true },
  "bh-auto": { annualRate: 10.49, durationMonths: 60, isLoan: true },
  "credit-ordi": { annualRate: 10.74, durationMonths: 36, isLoan: true },
  "credit-amenagement": { annualRate: 10.74, durationMonths: 84, isLoan: true },
  "credit-pro": { annualRate: 10.49, durationMonths: 84, isLoan: true },
  cmt: { annualRate: 9.99, durationMonths: 72, isLoan: true },
  "avance-promedica": { annualRate: 9.49, durationMonths: 60, isLoan: true },
  "epargne-etudes": { annualRate: 3.3, durationMonths: 60, isLoan: false },
  "cse-yaychek": { annualRate: 2.8, durationMonths: 12, isLoan: false },
  "bon-caisse": { annualRate: 8.2, durationMonths: 18, isLoan: false },
  bta: { annualRate: 7.8, durationMonths: 36, isLoan: false },
  btct: { annualRate: 7.2, durationMonths: 12, isLoan: false },
  cat: { annualRate: 8.5, durationMonths: 24, isLoan: false },
  pel: { annualRate: 3.5, durationMonths: 48, isLoan: false },
  "certificat-depot": { annualRate: 8.4, durationMonths: 24, isLoan: false },
};

const productEligibilityRules = {
  "carte-go": { minAge: 18, maxAge: 25 },
  "pack-senior": { minAge: 55 },
  "carte-gold-nat": { minIncome: 2800 },
  "carte-gold-intl": { minIncome: 2800 },
  "carte-platinum-nat": { minIncome: 6000 },
  "carte-platinum-intl": { minIncome: 6000 },
  "credit-pro": { professionAny: ["liberal", "independant", "entrepreneur", "profession"] },
  "pack-affaires": { professionAny: ["liberal", "independant", "entrepreneur", "profession"] },
  cmt: { professionAny: ["liberal", "independant", "entrepreneur", "profession"] },
  "avance-promedica": { professionAny: ["sante", "medical", "medecin", "pharmac", "infirm"] },
};

const normalizeText = (value) =>
  String(value || "")
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .toLowerCase()
    .replace(/[^a-z0-9\u0600-\u06ff]+/g, " ")
    .trim();

const canonicalId = (value) => String(value || "").toLowerCase().replace(/_/g, "-").trim();

const slugFromName = (name) => normalizeText(name).replace(/\s+/g, "-");

const toNumber = (value, fallback = 0) => {
  const parsed = Number(value);
  return Number.isFinite(parsed) ? parsed : fallback;
};

const toPositive = (value) => {
  const parsed = Number(value);
  return Number.isFinite(parsed) && parsed > 0 ? parsed : 0;
};

const clamp = (value, min, max) => Math.min(max, Math.max(min, value));

const fillCountToken = (template, count) =>
  String(template || "").replace("{count}", String(count));

const toComparisonCell = (rawValue) => {
  if (rawValue === PACK_CELL_YES) {
    return { display: "✓", compare: "yes", kind: "yes" };
  }

  if (rawValue === PACK_CELL_NO) {
    return { display: "✕", compare: "no", kind: "no" };
  }

  if (rawValue === PACK_CELL_DASH) {
    return { display: "-", compare: "dash", kind: "dash" };
  }

  const safeDisplay = String(rawValue || "-");
  return {
    display: safeDisplay,
    compare: normalizeText(safeDisplay),
    kind: "text",
  };
};

function localeByLanguage(language) {
  if (language === "ar") return "ar-TN";
  if (language === "fr") return "fr-TN";
  return "en-US";
}

function formatCurrency(value, language) {
  if (!Number.isFinite(value)) return "-";
  return new Intl.NumberFormat(localeByLanguage(language), {
    style: "currency",
    currency: "TND",
    maximumFractionDigits: 2,
  }).format(value);
}

function inferAgeFromBand(ageBandValue) {
  const normalized = normalizeText(ageBandValue);
  if (!normalized) return null;
  if (normalized.includes("senior")) return 60;

  const matches = normalized.match(/\d{1,2}/g);
  if (!matches || matches.length === 0) return null;

  if (matches.length >= 2) {
    const min = Number(matches[0]);
    const max = Number(matches[1]);
    if (Number.isFinite(min) && Number.isFinite(max)) {
      return (min + max) / 2;
    }
  }

  const first = Number(matches[0]);
  return Number.isFinite(first) ? first : null;
}

function includesAny(text, candidates = []) {
  if (!text) return false;
  return candidates.some((candidate) => text.includes(normalizeText(candidate)));
}

function getProductFinanceProfile(product) {
  const mapped = productFinanceProfiles[product.id];
  if (mapped) return mapped;

  if (product.category === "Crédits") {
    return {
      annualRate: DEFAULT_LOAN_RATE,
      durationMonths: DEFAULT_LOAN_DURATION_MONTHS,
      isLoan: true,
    };
  }

  if (product.category === "Épargne") {
    return {
      annualRate: 3.5,
      durationMonths: 24,
      isLoan: false,
    };
  }

  return {
    annualRate: null,
    durationMonths: null,
    isLoan: false,
  };
}

function estimateMonthlyPayment(amount, durationMonths, annualRate) {
  if (!(amount > 0) || !(durationMonths > 0) || !Number.isFinite(annualRate)) {
    return null;
  }

  const monthlyRate = annualRate / 100 / 12;
  if (monthlyRate <= 0) {
    return amount / durationMonths;
  }

  return amount * monthlyRate / (1 - (1 + monthlyRate) ** (-durationMonths));
}

function getWorstStatus(current, candidate) {
  const statusRank = {
    eligible: 3,
    review: 2,
    partial: 1,
    "not-eligible": 0,
  };

  return statusRank[candidate] < statusRank[current] ? candidate : current;
}

function comparisonStatusLabel(status, ui) {
  if (status === "eligible") return ui.compareStatusEligible;
  if (status === "partial") return ui.compareStatusPartial;
  if (status === "not-eligible") return ui.compareStatusNotEligible;
  return ui.compareStatusReview;
}

function comparisonStatusClass(status, isDark) {
  if (status === "eligible") {
    return isDark
      ? "bg-emerald-900/40 text-emerald-200 border border-emerald-700"
      : "bg-emerald-100 text-emerald-700 border border-emerald-200";
  }

  if (status === "partial") {
    return isDark
      ? "bg-amber-900/35 text-amber-200 border border-amber-700"
      : "bg-amber-100 text-amber-700 border border-amber-200";
  }

  if (status === "not-eligible") {
    return isDark
      ? "bg-red-900/35 text-red-200 border border-red-700"
      : "bg-red-100 text-red-700 border border-red-200";
  }

  return isDark
    ? "bg-slate-800 text-slate-200 border border-slate-700"
    : "bg-slate-100 text-slate-700 border border-slate-200";
}

function evaluateProductFit({
  product,
  finance,
  monthlyPayment,
  monthlyIncome,
  monthlyExpenses,
  profileIndicators,
  ui,
}) {
  let status = "review";
  let score = 45;
  const conditions = [];

  const loanEligibility = normalizeText(profileIndicators?.loan_eligibility || "");
  const profession = normalizeText(profileIndicators?.statut_professionnel || "");
  const housing = normalizeText(profileIndicators?.situation_logement || "");
  const inferredAge = inferAgeFromBand(profileIndicators?.tranche_age || "");
  const rules = productEligibilityRules[product.id] || {};

  if (product.isRecommended) {
    score += 12;
    conditions.push(ui.compareConditionRecommended);
  }

  if (finance.isLoan) {
    if (loanEligibility.includes("not eligible")) {
      status = "not-eligible";
      score -= 18;
      conditions.push(ui.compareConditionLoanNotEligible);
    } else if (loanEligibility.includes("partial")) {
      status = "partial";
      score += 4;
      conditions.push(ui.compareConditionLoanPartial);
    } else if (loanEligibility.includes("eligible")) {
      status = "eligible";
      score += 12;
      conditions.push(ui.compareConditionLoanEligible);
    } else {
      status = "review";
      conditions.push(ui.compareConditionLoanReview);
    }

    if (monthlyIncome <= 0) {
      status = getWorstStatus(status, "review");
      score -= 8;
      conditions.push(ui.compareConditionIncomeMissing);
    } else if (Number.isFinite(monthlyPayment) && monthlyPayment > 0) {
      const projectedDebtRatio = (monthlyExpenses + monthlyPayment) / monthlyIncome;
      const projectedDebtRatioPct = `${(projectedDebtRatio * 100).toFixed(1)}%`;

      if (projectedDebtRatio <= BCT_DEBT_RATIO_SOFT_LIMIT) {
        score += 12;
        conditions.push(`${ui.compareConditionDebtHealthy} (${projectedDebtRatioPct})`);
      } else if (projectedDebtRatio <= BCT_DEBT_RATIO_HARD_LIMIT) {
        status = getWorstStatus(status, "partial");
        score += 2;
        conditions.push(`${ui.compareConditionDebtWatch} (${projectedDebtRatioPct})`);
      } else {
        status = getWorstStatus(status, "not-eligible");
        score -= 14;
        conditions.push(`${ui.compareConditionDebtHigh} (${projectedDebtRatioPct})`);
      }
    }
  } else {
    status = "review";
    conditions.push(ui.compareConditionLoanOnly);
  }

  if (rules.minIncome && monthlyIncome > 0 && monthlyIncome < rules.minIncome) {
    status = getWorstStatus(status, "not-eligible");
    score -= 10;
    conditions.push(`${ui.compareConditionIncomeThreshold} ${Math.round(rules.minIncome)} TND`);
  }

  if (rules.minAge || rules.maxAge) {
    if (Number.isFinite(inferredAge)) {
      const belowMin = rules.minAge && inferredAge < rules.minAge;
      const aboveMax = rules.maxAge && inferredAge > rules.maxAge;

      if (belowMin || aboveMax) {
        status = getWorstStatus(status, "not-eligible");
        score -= 8;
        const range = rules.maxAge ? `${rules.minAge}-${rules.maxAge}` : `${rules.minAge}+`;
        conditions.push(`${ui.compareConditionAgeRange} ${range}`);
      }
    } else {
      status = getWorstStatus(status, "review");
      score -= 3;
      conditions.push(ui.compareConditionAgeUnknown);
    }
  }

  if (rules.professionAny?.length) {
    if (includesAny(profession, rules.professionAny)) {
      score += 5;
      conditions.push(ui.compareConditionProfessionMatched);
    } else {
      status = getWorstStatus(status, "partial");
      score -= 6;
      conditions.push(ui.compareConditionProfessionMismatch);
    }
  }

  if (product.id === "premier-logement" && housing.includes("proprietaire")) {
    status = getWorstStatus(status, "partial");
    score -= 6;
    conditions.push(ui.compareConditionHousingMismatch);
  }

  return {
    status,
    score: clamp(Math.round(score), 0, 100),
    conditions: Array.from(new Set(conditions)).slice(0, 3),
  };
}

function productImageDataUri(product) {
  const theme = categoryImageTheme[product.category] || {
    from: "#1e3a8a",
    to: "#1d4ed8",
    accent: "#93c5fd",
  };

  const svg = `
<svg xmlns="http://www.w3.org/2000/svg" width="800" height="420" viewBox="0 0 800 420">
  <defs>
    <linearGradient id="g" x1="0" y1="0" x2="1" y2="1">
      <stop offset="0%" stop-color="${theme.from}"/>
      <stop offset="100%" stop-color="${theme.to}"/>
    </linearGradient>
  </defs>
  <rect width="800" height="420" rx="34" fill="url(#g)"/>
  <circle cx="700" cy="90" r="110" fill="${theme.accent}" opacity="0.25"/>
  <circle cx="120" cy="360" r="130" fill="${theme.accent}" opacity="0.18"/>
</svg>`;

  return `data:image/svg+xml;utf8,${encodeURIComponent(svg)}`;
}

function productImageSource(product) {
  const mappedImage = productImageById[product.id];
  if (mappedImage) {
    return mappedImage;
  }

  const linkedImage = productImageUrlById[product.id];
  if (linkedImage) {
    return linkedImage;
  }

  const fallbackKeywords =
    categoryImageKeywordByCategory[product.category]
    || "banking,finance,product";
  const fallbackSeed = `${product.id || product.name || "product"}-${product.category || "Services"}`;

  return thematicUnsplashUrl(
    `${fallbackKeywords},${product.id || product.name || "item"}`,
    makeImageSignature(fallbackSeed),
  );
}

function localizedCategory(category, language) {
  if (language === "ar") return categoryLabels.ar[category] || category;
  if (language === "en") return categoryLabels.en[category] || category;
  return categoryLabels.fr[category] || category;
}

function localizedDescription(product, language) {
  if (language === "fr") return product.description || "";

  const categoryCopy = {
    en: {
      "Épargne": "Designed to help you save and grow your balance with better yields.",
      "Crédits": "Built to finance your projects with transparent and flexible repayments.",
      Cartes: "Optimized for daily payments, secure transactions, and banking convenience.",
      Packs: "A bundled offer combining key services for better value and simpler banking.",
      Assurances: "Protection coverage to secure your account, credit, and personal assets.",
      Services: "Digital banking service to monitor and manage your activity in real time.",
    },
    ar: {
      "Épargne": "مصمم لمساعدتك على الادخار وتنمية رصيدك بعوائد أفضل.",
      "Crédits": "مخصص لتمويل مشاريعك مع أقساط واضحة ومرنة.",
      Cartes: "مثالي للمدفوعات اليومية مع أمان عال وسهولة في الاستخدام.",
      Packs: "حزمة تجمع الخدمات الأساسية بقيمة أفضل وإدارة أبسط.",
      Assurances: "تغطية تأمينية لحماية حسابك وقروضك وممتلكاتك.",
      Services: "خدمة رقمية لمتابعة عملياتك البنكية وإدارتها في الوقت الفعلي.",
    },
  };

  return categoryCopy[language]?.[product.category] || product.description || "";
}

function localizedDetails(category, language) {
  const details = {
    en: {
      "Épargne": ["Flexible contribution rhythm", "Capital secured", "Suitable for medium and long term planning"],
      "Crédits": ["Clear repayment plan", "Adjustable financing amount", "Fast eligibility decision"],
      Cartes: ["Daily secure payments", "ATM and online usage", "Spending control options"],
      Packs: ["Bundled pricing advantage", "Multi-service access", "Simple activation"],
      Assurances: ["Protection against major risks", "Coverage adapted to your profile", "Easy claim follow-up"],
      Services: ["Digital access 24/7", "Real-time notifications", "Simple account management"],
    },
    fr: {
      "Épargne": ["Versements flexibles", "Capital securise", "Adaptation au moyen et long terme"],
      "Crédits": ["Plan de remboursement clair", "Montant modulable", "Decision d'eligibilite rapide"],
      Cartes: ["Paiements securises au quotidien", "Usage DAB et en ligne", "Controle des depenses"],
      Packs: ["Tarification groupee avantageuse", "Services multiples", "Activation simple"],
      Assurances: ["Protection contre les risques majeurs", "Couverture adaptee a votre profil", "Suivi simple"],
      Services: ["Acces digital 24/7", "Notifications en temps reel", "Gestion simplifiee"],
    },
    ar: {
      "Épargne": ["مساهمات مرنة حسب قدرتك", "رأس المال محمي", "ملائم للتخطيط المتوسط والطويل الأجل"],
      "Crédits": ["خطة سداد واضحة", "قيمة التمويل قابلة للتخصيص", "قرار الأهلية سريع"],
      Cartes: ["مدفوعات يومية آمنة", "استخدام في الصراف الآلي والإنترنت", "تحكم أفضل في المصاريف"],
      Packs: ["تسعير مجمّع أوفر", "وصول إلى خدمات متعددة", "تفعيل سريع وسهل"],
      Assurances: ["حماية من المخاطر الأساسية", "تغطية مناسبة لملفك", "متابعة المطالبات بسهولة"],
      Services: ["وصول رقمي على مدار الساعة", "تنبيهات فورية", "إدارة مبسطة للحساب"],
    },
  };

  return details[language]?.[category] || details.fr[category] || [];
}

function recommendationFallback(language, ui) {
  return ui.recommendationFallback;
}

function productPhotoTag(language) {
  return language === "ar" ? "بنك BH" : "BH BANK";
}

function ProductsCatalogSkeleton({ isDark }) {
  return (
    <div className={`space-y-4 ${isDark ? "skeleton-dark" : ""}`}>
      <div className="grid gap-4 lg:grid-cols-3">
        <Skeleton className="h-12 rounded-xl lg:col-span-2" />
        <Skeleton className="h-12 rounded-xl" />
      </div>

      <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-3">
        {Array.from({ length: 6 }).map((_, index) => (
          <article
            key={`products-skeleton-${index}`}
            className={`rounded-xl border p-4 ${isDark ? "border-gray-700 bg-gray-800" : "border-gray-200 bg-white"}`}
          >
            <Skeleton className="h-36 w-full rounded-lg" />
            <Skeleton className="mt-4 h-4 w-28 rounded-md" />
            <Skeleton className="mt-3 h-5 w-4/5 rounded-md" />
            <SkeletonLines className="mt-3" lines={2} lineClassName="h-3 rounded-md" lastLineClassName="w-3/4" />
            <Skeleton className="mt-4 h-9 w-32 rounded-lg" />
          </article>
        ))}
      </div>
    </div>
  );
}

function ProductsComparatorSkeleton({ isDark }) {
  return (
    <div className={`grid items-start gap-6 xl:grid-cols-[minmax(300px,400px)_minmax(0,1fr)] ${isDark ? "skeleton-dark" : ""}`}>
      <aside className={`rounded-3xl border p-5 ${isDark ? "border-gray-700 bg-gray-800" : "border-gray-200 bg-white"}`}>
        <Skeleton className="h-7 w-44 rounded-lg" />
        <Skeleton className="mt-2 h-4 w-36 rounded-md" />
        <div className="mt-5 space-y-3">
          <Skeleton className="h-12 rounded-full" />
          <Skeleton className="h-12 rounded-full" />
        </div>
        <Skeleton className="mt-5 h-12 rounded-full" />
        <Skeleton className="mt-3 h-11 rounded-full" />
      </aside>

      <section className="space-y-5">
        <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-3">
          {Array.from({ length: 3 }).map((_, index) => (
            <div
              key={`compare-card-skeleton-${index}`}
              className={`rounded-3xl border p-4 ${isDark ? "border-gray-700 bg-gray-800" : "border-gray-200 bg-white"}`}
            >
              <Skeleton className="h-44 w-full rounded-xl" />
              <Skeleton className="mt-4 h-6 w-4/5 rounded-md" />
            </div>
          ))}
        </div>

        <div className={`rounded-3xl border p-4 ${isDark ? "border-gray-700 bg-gray-800" : "border-gray-200 bg-white"}`}>
          <Skeleton className="h-10 w-full rounded-xl" />
          <SkeletonLines className="mt-4" lines={6} lineClassName="h-8 rounded-md" lastLineClassName="w-full" />
        </div>
      </section>
    </div>
  );
}

function normalizeProduct(product) {
  const id = canonicalId(product?.id || slugFromName(product?.name));
  return {
    id,
    category: product?.category || "Services",
    name: product?.name || "Produit",
    description: product?.description || "",
    features: Array.isArray(product?.features) ? product.features : [],
    color: product?.color || "#0A2240",
    icon: product?.icon || "box",
  };
}

function matchRecommendation(product, entries) {
  const productNameNorm = normalizeText(product.name);

  for (const entry of entries) {
    if (entry.key) {
      const mappedId = recommendationKeyToProductId[entry.key] || entry.key;
      if (mappedId === product.id) {
        return entry;
      }
    }

    if (!entry.nameNorm) continue;

    if (
      productNameNorm.includes(entry.nameNorm) ||
      entry.nameNorm.includes(productNameNorm)
    ) {
      return entry;
    }
  }

  return null;
}

export function Products({ showComparator = false } = {}) {
  const { theme } = useTheme();
  const { language, isRTL } = useLanguage();
  const isDark = theme === "dark";

  const ui = uiByLanguage[language] || uiByLanguage.fr;

  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [search, setSearch] = useState("");
  const [products, setProducts] = useState([]);
  const [selectedCategory, setSelectedCategory] = useState("all");
  const [recommendedOnly, setRecommendedOnly] = useState(false);
  const [recommendationEntries, setRecommendationEntries] = useState([]);
  const [selectedProduct, setSelectedProduct] = useState(null);
  const [profileIndicators, setProfileIndicators] = useState({});
  const [comparisonProductIds, setComparisonProductIds] = useState(
    () => Array(COMPARISON_MIN_SELECTION).fill(""),
  );
  const [comparisonSlotCount, setComparisonSlotCount] = useState(COMPARISON_MIN_SELECTION);
  const [comparisonStarted, setComparisonStarted] = useState(false);
  const [comparisonViewMode, setComparisonViewMode] = useState("all");
  const [comparisonAmount, setComparisonAmount] = useState(DEFAULT_COMPARISON_AMOUNT);
  const [comparisonWarning, setComparisonWarning] = useState("");

  const clientId = getClientId();

  useEffect(() => {
    const loadProducts = async () => {
      try {
        setLoading(true);
        setError("");

        const [catalogData, recommendationData, profileData] = await Promise.all([
          getProductsCatalog(),
          clientId ? getClientRecommendation(clientId).catch(() => null) : Promise.resolve(null),
          showComparator && clientId ? getMe().catch(() => null) : Promise.resolve(null),
        ]);

        const backendProducts = Array.isArray(catalogData?.products)
          ? catalogData.products.map(normalizeProduct)
          : [];

        const merged = [...backendProducts];
        const existingIds = new Set(backendProducts.map((item) => item.id));

        for (const extra of extendedProducts) {
          const normalized = normalizeProduct(extra);
          if (!existingIds.has(normalized.id)) {
            merged.push(normalized);
            existingIds.add(normalized.id);
          }
        }

        setProducts(merged);

        const rawRecommendations = Array.isArray(recommendationData?.recommended_products)
          ? recommendationData.recommended_products
          : [];

        const entries = rawRecommendations.map((item) => {
          if (typeof item === "string") {
            return {
              key: "",
              name: item,
              nameNorm: normalizeText(item),
              reason: "",
            };
          }

          const key = canonicalId(item?.product_key || "");
          const name = item?.product_name || item?.name || "";

          return {
            key,
            name,
            nameNorm: normalizeText(name),
            reason: item?.reason || "",
          };
        });

        setRecommendationEntries(entries);
        setProfileIndicators(showComparator ? profileData?.indicators || {} : {});
      } catch (err) {
        setError(err.message || "Impossible de charger les produits.");
        setProfileIndicators({});
      } finally {
        setLoading(false);
      }
    };

    loadProducts();
  }, [clientId, showComparator]);

  const categories = useMemo(() => {
    const raw = Array.from(new Set(products.map((product) => product.category).filter(Boolean)));
    return ["all", ...raw];
  }, [products]);

  const localizedProducts = useMemo(() => {
    return products.map((product) => {
      const nameTranslation = productNameTranslations[product.id]?.[language]
        || productNameTranslations[product.id]?.fr
        || product.name;

      const displayName = nameTranslation || product.name;
      const displayDescription = localizedDescription(product, language);
      const displayFeatures =
        language === "fr" && product.features.length > 0
          ? product.features
          : localizedDetails(product.category, language);

      const recommendation = matchRecommendation(product, recommendationEntries);
      const recommendationReason =
        language === "fr" && recommendation?.reason
          ? recommendation.reason
          : recommendation
            ? recommendationFallback(language, ui)
            : "";

      return {
        ...product,
        displayName,
        displayDescription,
        displayFeatures,
        displayDetails: localizedDetails(product.category, language),
        localizedCategory: localizedCategory(product.category, language),
        isRecommended: Boolean(recommendation),
        recommendationReason,
      };
    });
  }, [products, language, recommendationEntries, ui]);

  const hasRecommendedProducts = useMemo(
    () => localizedProducts.some((product) => product.isRecommended),
    [localizedProducts],
  );

  useEffect(() => {
    if (!hasRecommendedProducts && recommendedOnly) {
      setRecommendedOnly(false);
    }
  }, [hasRecommendedProducts, recommendedOnly]);

  useEffect(() => {
    if (!showComparator) return;

    setComparisonProductIds((previous) => {
      const validIds = new Set(localizedProducts.map((product) => product.id));
      const next = Array.from({ length: Math.max(COMPARISON_MIN_SELECTION, comparisonSlotCount) }, (_, index) => {
        const current = previous[index] || "";
        if (!current) return "";
        return validIds.has(current) ? current : "";
      });

      const isSame = next.length === previous.length
        && next.every((value, index) => value === previous[index]);

      return isSame ? previous : next;
    });
  }, [comparisonSlotCount, localizedProducts, showComparator]);

  const normalizedComparisonAmount = useMemo(() => {
    const parsed = toNumber(comparisonAmount, DEFAULT_COMPARISON_AMOUNT);
    if (parsed <= 0) return DEFAULT_COMPARISON_AMOUNT;
    return clamp(parsed, 1000, 2_000_000);
  }, [comparisonAmount]);

  const profileFinancialSnapshot = useMemo(() => {
    const monthlyIncome =
      toPositive(profileIndicators?.avg_monthly_income)
      || toPositive(profileIndicators?.monthly_salary);

    const declaredExpenses = toPositive(profileIndicators?.avg_monthly_expenses);
    const expenseRatio = clamp(toNumber(profileIndicators?.expense_income_ratio, 0), 0, 1.5);

    const monthlyExpenses = declaredExpenses > 0
      ? declaredExpenses
      : monthlyIncome > 0 && expenseRatio > 0
        ? monthlyIncome * expenseRatio
        : 0;

    return {
      monthlyIncome,
      monthlyExpenses,
    };
  }, [profileIndicators]);

  useEffect(() => {
    if (!showComparator) return;
    if (profileFinancialSnapshot.monthlyIncome <= 0) return;

    setComparisonAmount((currentAmount) => {
      if (toNumber(currentAmount, DEFAULT_COMPARISON_AMOUNT) !== DEFAULT_COMPARISON_AMOUNT) {
        return currentAmount;
      }

      const suggestedAmount = clamp(
        Math.round((profileFinancialSnapshot.monthlyIncome * 24) / 500) * 500,
        5000,
        300000,
      );

      return suggestedAmount;
    });
  }, [profileFinancialSnapshot.monthlyIncome, showComparator]);

  const comparisonCandidates = useMemo(() => {
    const packs = localizedProducts.filter((product) => product.category === "Packs");
    if (packs.length > 0) {
      return packs;
    }

    return localizedProducts;
  }, [localizedProducts]);

  const selectedComparisonProductIds = useMemo(() => {
    const validIds = new Set(comparisonCandidates.map((product) => product.id));
    const unique = [];
    const seen = new Set();

    comparisonProductIds.forEach((productId) => {
      if (!productId || !validIds.has(productId) || seen.has(productId)) {
        return;
      }

      seen.add(productId);
      unique.push(productId);
    });

    return unique;
  }, [comparisonCandidates, comparisonProductIds]);

  const selectedComparisonProducts = useMemo(() => {
    return selectedComparisonProductIds
      .map((productId) => comparisonCandidates.find((product) => product.id === productId))
      .filter(Boolean);
  }, [comparisonCandidates, selectedComparisonProductIds]);

  const comparisonRows = useMemo(() => {
    return selectedComparisonProducts.map((product) => {
      const finance = getProductFinanceProfile(product);
      const monthlyPayment = finance.isLoan
        ? estimateMonthlyPayment(
          normalizedComparisonAmount,
          toNumber(finance.durationMonths, 0),
          toNumber(finance.annualRate, Number.NaN),
        )
        : null;

      const fit = evaluateProductFit({
        product,
        finance,
        monthlyPayment,
        monthlyIncome: profileFinancialSnapshot.monthlyIncome,
        monthlyExpenses: profileFinancialSnapshot.monthlyExpenses,
        profileIndicators,
        ui,
      });

      return {
        product,
        finance,
        monthlyPayment,
        fit,
      };
    });
  }, [
    normalizedComparisonAmount,
    profileFinancialSnapshot.monthlyExpenses,
    profileFinancialSnapshot.monthlyIncome,
    profileIndicators,
    selectedComparisonProducts,
    ui,
  ]);

  const bestFitProductId = useMemo(() => {
    if (comparisonRows.length < COMPARISON_MIN_SELECTION) {
      return "";
    }

    return [...comparisonRows].sort((a, b) => b.fit.score - a.fit.score)[0]?.product?.id || "";
  }, [comparisonRows]);

  const isCuratedPackComparison = useMemo(() => {
    if (selectedComparisonProducts.length < COMPARISON_MIN_SELECTION) {
      return false;
    }

    return selectedComparisonProducts.every((product) => curatedPackIds.has(product.id));
  }, [selectedComparisonProducts]);

  const highlightedComparisonProductId = useMemo(() => {
    if (isCuratedPackComparison) {
      return comparisonRows[0]?.product?.id || "";
    }

    return bestFitProductId;
  }, [bestFitProductId, comparisonRows, isCuratedPackComparison]);

  const comparisonTableRows = useMemo(() => {
    if (isCuratedPackComparison) {
      return curatedPackComparisonRows.map((row) => ({
        key: row.key,
        label: row.label[language] || row.label.fr,
        values: comparisonRows.map((item) => toComparisonCell(row.values[item.product.id])),
      }));
    }

    const rows = [
      {
        key: "category",
        label: ui.compareRowCategory,
        values: comparisonRows.map((item) => ({
          display: item.product.localizedCategory,
          compare: normalizeText(item.product.localizedCategory),
          kind: "text",
        })),
      },
      {
        key: "rate",
        label: ui.compareRowRate,
        values: comparisonRows.map((item) => ({
          display: Number.isFinite(item.finance.annualRate)
            ? `${toNumber(item.finance.annualRate, 0).toFixed(2)}%`
            : ui.compareNoRate,
          compare: Number.isFinite(item.finance.annualRate)
            ? `rate-${toNumber(item.finance.annualRate, 0).toFixed(2)}`
            : "rate-na",
          kind: "text",
        })),
      },
      {
        key: "duration",
        label: ui.compareRowDuration,
        values: comparisonRows.map((item) => ({
          display: item.finance.durationMonths
            ? `${item.finance.durationMonths} ${ui.compareMonths}`
            : ui.compareNoDuration,
          compare: item.finance.durationMonths ? `duration-${item.finance.durationMonths}` : "duration-na",
          kind: "text",
        })),
      },
      {
        key: "monthly",
        label: ui.compareRowMonthly,
        values: comparisonRows.map((item) => ({
          display: Number.isFinite(item.monthlyPayment)
            ? formatCurrency(item.monthlyPayment, language)
            : ui.compareNoMonthly,
          compare: Number.isFinite(item.monthlyPayment)
            ? `monthly-${Math.round(item.monthlyPayment)}`
            : "monthly-na",
          kind: "text",
        })),
      },
      {
        key: "eligibility",
        label: ui.compareRowEligibility,
        values: comparisonRows.map((item) => ({
          display: comparisonStatusLabel(item.fit.status, ui),
          compare: `status-${item.fit.status}`,
          kind: "text",
        })),
      },
      {
        key: "conditions",
        label: ui.compareRowConditions,
        values: comparisonRows.map((item) => ({
          display: item.fit.conditions.length > 0 ? item.fit.conditions.join(" | ") : "-",
          compare: item.fit.conditions.length > 0
            ? normalizeText(item.fit.conditions.join(" "))
            : "condition-none",
          kind: "text",
        })),
      },
      {
        key: "fit",
        label: ui.compareRowFit,
        values: comparisonRows.map((item) => ({
          display: `${item.fit.score}/100`,
          compare: `fit-${item.fit.score}`,
          kind: "text",
        })),
      },
    ];

    return rows;
  }, [comparisonRows, isCuratedPackComparison, language, ui]);

  const visibleComparisonRows = useMemo(() => {
    if (comparisonViewMode === "all") {
      return comparisonTableRows;
    }

    return comparisonTableRows.filter((row) => {
      const uniqueValues = new Set(row.values.map((value) => value.compare));
      if (comparisonViewMode === "differences") {
        return uniqueValues.size > 1;
      }

      return uniqueValues.size === 1;
    });
  }, [comparisonTableRows, comparisonViewMode]);

  useEffect(() => {
    if (selectedComparisonProducts.length >= COMPARISON_MIN_SELECTION) {
      return;
    }

    setComparisonStarted(false);
  }, [selectedComparisonProducts.length]);

  const updateComparisonSlot = (slotIndex, nextProductId) => {
    if (!showComparator) return;

    const normalizedId = canonicalId(nextProductId || "");

    setComparisonProductIds((previous) => {
      const padded = Array.from(
        { length: Math.max(COMPARISON_MIN_SELECTION, comparisonSlotCount) },
        (_, index) => previous[index] || "",
      );

      if (
        normalizedId
        && padded.some((productId, index) => index !== slotIndex && canonicalId(productId) === normalizedId)
      ) {
        setComparisonWarning(ui.compareUniqueHint);
        return previous;
      }

      padded[slotIndex] = normalizedId;
      setComparisonWarning("");
      return padded;
    });
  };

  const removeComparisonProduct = (productId) => {
    if (!showComparator) return;

    const normalizedId = canonicalId(productId || "");
    if (!normalizedId) return;

    setComparisonProductIds((previous) =>
      previous.map((slotId) => (canonicalId(slotId) === normalizedId ? "" : slotId)),
    );
    setComparisonWarning("");
  };

  const toggleComparisonProduct = (productId) => {
    if (!showComparator) return;

    const normalizedId = canonicalId(productId || "");
    if (!normalizedId) return;

    const isAlreadySelected = comparisonProductIds.some(
      (slotId) => canonicalId(slotId) === normalizedId,
    );
    if (isAlreadySelected) {
      removeComparisonProduct(normalizedId);
      return;
    }

    const emptySlotIndex = comparisonProductIds.findIndex((slotId) => !canonicalId(slotId));
    if (emptySlotIndex >= 0) {
      updateComparisonSlot(emptySlotIndex, normalizedId);
      return;
    }

    if (comparisonSlotCount < COMPARISON_MAX_SELECTION) {
      setComparisonSlotCount((previous) => previous + 1);
      setComparisonProductIds((previous) => [...previous, normalizedId]);
      setComparisonWarning("");
      return;
    }

    setComparisonWarning(ui.compareMaxHint);
  };

  const addComparisonSlot = () => {
    if (!showComparator) return;

    if (comparisonSlotCount >= COMPARISON_MAX_SELECTION) {
      setComparisonWarning(ui.compareMaxHint);
      return;
    }

    setComparisonSlotCount((previous) => previous + 1);
    setComparisonProductIds((previous) => [...previous, ""]);
    setComparisonWarning("");
  };

  const runComparison = () => {
    if (selectedComparisonProducts.length < COMPARISON_MIN_SELECTION) {
      setComparisonWarning(ui.compareMinHint);
      setComparisonStarted(false);
      return;
    }

    setComparisonStarted(true);
    setComparisonWarning("");
  };

  const clearComparison = () => {
    setComparisonProductIds(Array(COMPARISON_MIN_SELECTION).fill(""));
    setComparisonSlotCount(COMPARISON_MIN_SELECTION);
    setComparisonWarning("");
    setComparisonStarted(false);
    setComparisonViewMode("all");
  };

  const filteredProducts = useMemo(() => {
    const term = normalizeText(search);

    return localizedProducts.filter((product) => {
      const matchesCategory = selectedCategory === "all" || product.category === selectedCategory;
      const haystack = normalizeText(
        `${product.displayName} ${product.displayDescription} ${product.localizedCategory}`,
      );

      const matchesSearch = term.length === 0 || haystack.includes(term);
      const matchesRecommendation = !recommendedOnly || product.isRecommended;
      return matchesCategory && matchesSearch && matchesRecommendation;
    });
  }, [localizedProducts, recommendedOnly, search, selectedCategory]);

  if (showComparator) {
    return (
      <div
        dir={isRTL ? "rtl" : "ltr"}
        className={`min-h-full space-y-6 p-4 lg:p-8 ${
          isDark ? "bg-gray-900 text-white" : "bg-gray-50 text-gray-900"
        } ${isRTL ? "text-right" : "text-left"}`}
      >
        {error && (
          <div
            className={`flex items-center gap-2 rounded-xl border p-4 text-sm ${
              isDark
                ? "border-red-800 bg-red-950/30 text-red-300"
                : "border-red-200 bg-red-50 text-red-700"
            }`}
          >
            <AlertCircle className="h-4 w-4" />
            {error}
          </div>
        )}

        {loading ? (
          <ProductsComparatorSkeleton isDark={isDark} />
        ) : (
          <div className="grid items-start gap-6 xl:grid-cols-[minmax(300px,400px)_minmax(0,1fr)]">
            <aside
              className={`rounded-3xl border p-5 ${
                isDark ? "border-gray-700 bg-gray-800" : "border-gray-200 bg-white"
              }`}
            >
              <h2 className="text-3xl font-semibold">{ui.comparePackPanelTitle}</h2>
              <p className={`mt-2 text-sm ${isDark ? "text-gray-300" : "text-gray-700"}`}>
                {fillCountToken(ui.comparePackSelectedCount, selectedComparisonProducts.length)}
              </p>

              <div className="mt-5 space-y-3">
                {Array.from({ length: Math.max(COMPARISON_MIN_SELECTION, comparisonSlotCount) }).map((_, slotIndex) => {
                  const currentValue = comparisonProductIds[slotIndex] || "";

                  return (
                    <div key={`comparison-slot-${slotIndex}`}>
                      <select
                        value={currentValue}
                        onChange={(event) => updateComparisonSlot(slotIndex, event.target.value)}
                        className={`w-full rounded-full border px-5 py-3 text-lg ${
                          isDark
                            ? "border-gray-600 bg-gray-900 text-white"
                            : "border-gray-300 bg-gray-50 text-gray-700"
                        }`}
                      >
                        <option value="">{ui.compareSelectPlaceholder}</option>
                        {comparisonCandidates.map((product) => {
                          const alreadySelected = comparisonProductIds.some(
                            (id, index) => index !== slotIndex && canonicalId(id) === product.id,
                          );

                          return (
                            <option
                              key={`candidate-${slotIndex}-${product.id}`}
                              value={product.id}
                              disabled={alreadySelected}
                            >
                              {String(product.displayName || product.name || "").toUpperCase()}
                            </option>
                          );
                        })}
                      </select>
                    </div>
                  );
                })}
              </div>

              {comparisonSlotCount < COMPARISON_MAX_SELECTION && (
                <button
                  type="button"
                  onClick={addComparisonSlot}
                  className="mt-5 inline-flex w-full items-center justify-center gap-2 rounded-full bg-[#e7001f] px-5 py-3 text-lg font-semibold text-white hover:bg-[#d2001b]"
                >
                  <span>{ui.compareAddPack}</span>
                  <Plus className="h-5 w-5" />
                </button>
              )}

              <button
                type="button"
                onClick={runComparison}
                className="mt-4 w-full rounded-full bg-[#0A2240] px-5 py-3 text-lg font-semibold text-white hover:bg-[#133764]"
              >
                {ui.compareRunAction}
              </button>

              <button
                type="button"
                onClick={clearComparison}
                className={`mt-2.5 w-full rounded-full border px-4 py-2 text-sm ${
                  isDark
                    ? "border-gray-600 text-gray-200 hover:bg-gray-700"
                    : "border-gray-300 text-gray-700 hover:bg-gray-100"
                }`}
              >
                {ui.compareReset}
              </button>

              {comparisonWarning && (
                <p className={`mt-3 text-xs ${isDark ? "text-amber-200" : "text-amber-700"}`}>
                  {comparisonWarning}
                </p>
              )}
            </aside>

            <section className="space-y-5">
              {selectedComparisonProducts.length === 0 ? (
                <div
                  className={`rounded-3xl border p-8 text-center text-4xl font-medium ${
                    isDark ? "border-gray-700 bg-gray-800 text-gray-200" : "border-gray-200 bg-white text-[#0A2240]"
                  }`}
                >
                  {ui.compareNoSelectionState}
                </div>
              ) : (
                <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-3">
                  {selectedComparisonProducts.map((product) => (
                    <article
                      key={`selected-card-${product.id}`}
                      className={`overflow-hidden rounded-3xl border ${
                        isDark ? "border-gray-700 bg-gray-800" : "border-gray-200 bg-white"
                      }`}
                    >
                      <div className="relative h-56 w-full overflow-hidden">
                        <img
                          src={productImageSource(product)}
                          alt={product.displayName}
                          className="h-full w-full object-cover"
                          loading="lazy"
                          onError={(event) => {
                            event.currentTarget.onerror = null;
                            event.currentTarget.src = productImageDataUri(product);
                          }}
                        />
                        <div className={`absolute top-3 z-20 rounded-lg bg-white/90 p-1.5 shadow-sm ${isRTL ? "right-3" : "left-3"}`}>
                          <img src={bhLogo} alt="BH Bank" className="h-4 w-auto object-contain" />
                        </div>
                        <button
                          type="button"
                          onClick={() => removeComparisonProduct(product.id)}
                          className={`absolute top-3 inline-flex h-8 w-8 items-center justify-center rounded-full ${
                            isDark ? "bg-gray-900/70 text-gray-100 hover:bg-gray-900" : "bg-white/90 text-[#0A2240] hover:bg-white"
                          } ${isRTL ? "left-3" : "right-3"}`}
                          aria-label={ui.compareRemove}
                        >
                          <X className="h-4 w-4" />
                        </button>
                      </div>

                      <div className="grid grid-cols-[1fr_auto]">
                        <div className="bg-[#e7001f] px-5 py-4 text-white">
                          <p className="text-[11px] font-semibold tracking-[0.16em]">PACK</p>
                          <p className="mt-1 text-3xl font-bold leading-[1.05]">
                            {String(product.displayName || "").toUpperCase()}
                          </p>
                        </div>
                        <div className={`flex items-center justify-center px-5 ${isDark ? "bg-gray-900 text-gray-200" : "bg-gray-50 text-[#0A2240]"}`}>
                          <img src={bhLogo} alt="BH Bank" className="h-11 w-auto object-contain" />
                        </div>
                      </div>
                    </article>
                  ))}
                </div>
              )}

              {comparisonStarted && selectedComparisonProducts.length >= COMPARISON_MIN_SELECTION && (
                <section className="space-y-4">
                  <div className={`flex flex-wrap gap-2 ${isRTL ? "justify-start" : "justify-end"}`}>
                    {[
                      { key: "all", label: ui.compareViewAll },
                      { key: "differences", label: ui.compareViewDifferences },
                      { key: "similarities", label: ui.compareViewSimilarities },
                    ].map((mode) => (
                      <button
                        key={`mode-${mode.key}`}
                        type="button"
                        onClick={() => setComparisonViewMode(mode.key)}
                        className={`rounded-full border px-7 py-2.5 text-lg ${
                          comparisonViewMode === mode.key
                            ? "border-[#0A2240] bg-[#0A2240] text-white"
                            : isDark
                              ? "border-gray-600 text-gray-200 hover:bg-gray-700"
                              : "border-gray-300 bg-white text-[#0A2240] hover:bg-gray-100"
                        }`}
                      >
                        {mode.label}
                      </button>
                    ))}
                  </div>

                  <div className={`overflow-x-auto rounded-3xl border ${isDark ? "border-gray-700 bg-gray-800" : "border-gray-200 bg-white"}`}>
                    <table className="w-full min-w-220 border-separate border-spacing-0">
                      <thead>
                        <tr>
                          <th className={`w-[32%] border-b px-6 py-4 text-left text-lg font-semibold ${isDark ? "border-[#d8001d] bg-gray-900" : "border-[#d8001d] bg-gray-50"}`}>
                            {ui.compareMetric}
                          </th>
                          {comparisonRows.map((item) => (
                            <th
                              key={`header-${item.product.id}`}
                              className={`border-b px-6 py-4 text-left text-lg font-semibold ${
                                item.product.id === highlightedComparisonProductId
                                  ? isDark
                                    ? "border-[#d8001d] bg-blue-900/30"
                                    : "border-[#d8001d] bg-blue-50"
                                  : isDark
                                    ? "border-[#d8001d] bg-gray-900"
                                    : "border-[#d8001d] bg-gray-50"
                              }`}
                            >
                              <div className="flex items-center justify-between gap-2">
                                <span>{String(item.product.displayName || "").toUpperCase()}</span>
                                <button
                                  type="button"
                                  onClick={() => removeComparisonProduct(item.product.id)}
                                  className={`inline-flex h-7 w-7 items-center justify-center rounded-full ${
                                    isDark ? "bg-gray-700 text-gray-200 hover:bg-gray-600" : "bg-white text-[#0A2240] hover:bg-gray-100"
                                  }`}
                                  aria-label={ui.compareRemove}
                                >
                                  <X className="h-4 w-4" />
                                </button>
                              </div>
                            </th>
                          ))}
                        </tr>
                      </thead>

                      <tbody>
                        {visibleComparisonRows.map((row) => (
                          <tr key={`row-${row.key}`}>
                            <th className={`border-b px-6 py-3.5 text-left text-sm font-semibold ${isDark ? "border-gray-700 bg-gray-900" : "border-gray-200 bg-white"}`}>
                              {row.label}
                            </th>

                            {row.values.map((value, index) => (
                              <td
                                key={`row-${row.key}-${comparisonRows[index]?.product?.id || index}`}
                                className={`border-b px-6 py-3.5 text-sm lg:text-base ${
                                  isDark ? "border-gray-700 text-gray-200" : "border-gray-200 text-gray-800"
                                } ${
                                  isCuratedPackComparison
                                  && comparisonRows[index]?.product?.id === highlightedComparisonProductId
                                    ? isDark
                                      ? "bg-blue-900/20"
                                      : "bg-blue-50/70"
                                    : ""
                                }`}
                              >
                                {value.kind === "yes" ? (
                                  <span className="text-2xl font-bold text-green-700">✓</span>
                                ) : value.kind === "no" ? (
                                  <span className="text-2xl font-bold text-red-700">✕</span>
                                ) : value.kind === "dash" ? (
                                  <span className={isDark ? "text-gray-400" : "text-gray-500"}>-</span>
                                ) : (
                                  <span className="whitespace-pre-wrap">{value.display}</span>
                                )}
                              </td>
                            ))}
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>

                  {visibleComparisonRows.length === 0 && (
                    <div
                      className={`rounded-xl border p-4 text-sm ${
                        isDark
                          ? "border-gray-700 bg-gray-800 text-gray-300"
                          : "border-gray-200 bg-white text-gray-600"
                      }`}
                    >
                      {ui.compareNoRowsForMode}
                    </div>
                  )}
                </section>
              )}
            </section>
          </div>
        )}
      </div>
    );
  }

  return (
    <div
      dir={isRTL ? "rtl" : "ltr"}
      className={`min-h-full space-y-6 p-4 lg:p-8 ${
        isDark ? "bg-gray-900 text-white" : "bg-gray-50 text-gray-900"
      } ${isRTL ? "text-right" : "text-left"}`}
    >
      <div>
        <h1 className="text-2xl font-semibold lg:text-3xl">{showComparator ? ui.compareTitle : ui.title}</h1>
        <p className={isDark ? "text-gray-400" : "text-gray-600"}>{showComparator ? ui.compareSubtitle : ui.subtitle}</p>
      </div>

      {error && (
        <div
          className={`flex items-center gap-2 rounded-xl border p-4 text-sm ${
            isDark
              ? "border-red-800 bg-red-950/30 text-red-300"
              : "border-red-200 bg-red-50 text-red-700"
          }`}
        >
          <AlertCircle className="h-4 w-4" />
          {error}
        </div>
      )}

      <div className="grid gap-4 lg:grid-cols-3">
        <div
          className={`lg:col-span-2 flex items-center gap-2 rounded-xl border px-4 py-3 ${
            isDark ? "border-gray-700 bg-gray-800" : "border-gray-200 bg-white"
          } ${isRTL ? "flex-row-reverse" : ""}`}
        >
          <Search className="h-4 w-4 text-gray-400" />
          <input
            value={search}
            onChange={(event) => setSearch(event.target.value)}
            placeholder={ui.searchPlaceholder}
            className={`w-full bg-transparent outline-none ${isRTL ? "text-right" : "text-left"}`}
          />
        </div>

        <select
          value={selectedCategory}
          onChange={(event) => setSelectedCategory(event.target.value)}
          className={`rounded-xl border px-4 py-3 ${
            isDark
              ? "border-gray-700 bg-gray-800 text-white"
              : "border-gray-200 bg-white text-gray-900"
          } ${isRTL ? "text-right" : "text-left"}`}
        >
          {categories.map((category) => (
            <option key={category} value={category}>
              {category === "all" ? ui.allCategories : localizedCategory(category, language)}
            </option>
          ))}
        </select>
      </div>

      <div className={`flex ${isRTL ? "justify-start" : "justify-end"}`}>
        <button
          type="button"
          onClick={() => setRecommendedOnly((previous) => !previous)}
          disabled={!hasRecommendedProducts}
          className={`inline-flex items-center gap-2 rounded-full border px-4 py-2 text-sm font-medium transition ${
            recommendedOnly
              ? "border-amber-500 bg-amber-100 text-amber-800"
              : isDark
                ? "border-gray-600 bg-gray-800 text-gray-200 hover:bg-gray-700"
                : "border-gray-300 bg-white text-gray-700 hover:bg-gray-50"
          } ${!hasRecommendedProducts ? "cursor-not-allowed opacity-50" : ""}`}
        >
          <Star className="h-4 w-4" />
          {recommendedOnly ? ui.allProducts : ui.recommendedForYou}
        </button>
      </div>

      {showComparator && (
        <section
          className={`rounded-2xl border p-4 lg:p-5 ${
            isDark ? "border-gray-700 bg-gray-800/70" : "border-gray-200 bg-white"
          }`}
        >
        <div className="flex flex-wrap items-start justify-between gap-3">
          <div>
            <h2 className="text-lg font-semibold lg:text-xl">{ui.compareTitle}</h2>
            <p className={`text-sm ${isDark ? "text-gray-400" : "text-gray-600"}`}>{ui.compareSubtitle}</p>
          </div>

          <button
            type="button"
            onClick={clearComparison}
            className={`rounded-lg px-3 py-2 text-sm ${
              isDark ? "bg-gray-900 text-gray-200 hover:bg-gray-700" : "bg-gray-100 text-gray-700 hover:bg-gray-200"
            }`}
          >
            {ui.compareReset}
          </button>
        </div>

        <div className="mt-4 grid gap-4 lg:grid-cols-[minmax(220px,320px)_1fr]">
          <label className="space-y-1.5">
            <span className={`text-xs font-medium uppercase tracking-wide ${isDark ? "text-gray-400" : "text-gray-500"}`}>
              {ui.compareAmountLabel}
            </span>
            <input
              type="number"
              min={1000}
              max={2000000}
              step={500}
              value={comparisonAmount}
              onChange={(event) => setComparisonAmount(toNumber(event.target.value, 0))}
              className={`w-full rounded-lg border px-3 py-2 text-sm outline-none ${
                isDark
                  ? "border-gray-600 bg-gray-900 text-white focus:border-blue-500"
                  : "border-gray-300 bg-white text-gray-900 focus:border-blue-500"
              }`}
            />
            <p className={`text-xs ${isDark ? "text-gray-400" : "text-gray-500"}`}>
              {ui.compareAmountHint}
            </p>
          </label>

          <div>
            <p className="text-sm font-medium">
              {ui.compareSelectionCount}: {selectedComparisonProducts.length}/{COMPARISON_MAX_SELECTION}
            </p>
            <p className={`mt-1 text-xs ${isDark ? "text-gray-400" : "text-gray-500"}`}>
              {selectedComparisonProducts.length < COMPARISON_MIN_SELECTION
                ? ui.compareMinHint
                : ui.compareMaxHint}
            </p>

            <div className="mt-3 flex flex-wrap gap-2">
              {selectedComparisonProducts.length === 0 && (
                <span
                  className={`rounded-full px-3 py-1 text-xs ${
                    isDark ? "bg-gray-900 text-gray-300" : "bg-gray-100 text-gray-600"
                  }`}
                >
                  {ui.compareMinHint}
                </span>
              )}

              {selectedComparisonProducts.map((product) => (
                <button
                  key={product.id}
                  type="button"
                  onClick={() => toggleComparisonProduct(product.id)}
                  className={`inline-flex items-center gap-1 rounded-full border px-3 py-1 text-xs ${
                    isDark
                      ? "border-gray-600 bg-gray-900 text-gray-200 hover:border-gray-500"
                      : "border-gray-300 bg-gray-50 text-gray-700 hover:border-gray-400"
                  }`}
                >
                  <span>{product.displayName}</span>
                  <X className="h-3 w-3" />
                </button>
              ))}
            </div>
          </div>
        </div>

        {comparisonWarning && (
          <div
            className={`mt-4 rounded-lg border px-3 py-2 text-xs ${
              isDark
                ? "border-amber-700 bg-amber-900/20 text-amber-200"
                : "border-amber-200 bg-amber-50 text-amber-700"
            }`}
          >
            {comparisonWarning}
          </div>
        )}

        {comparisonRows.length >= COMPARISON_MIN_SELECTION && (
          <div className="mt-5 overflow-x-auto">
            <table className="w-full min-w-220 border-separate border-spacing-0 text-sm">
              <thead>
                <tr>
                  <th
                    className={`sticky left-0 z-10 border-b px-3 py-3 ${
                      isDark ? "border-gray-700 bg-gray-900 text-gray-200" : "border-gray-200 bg-gray-50 text-gray-700"
                    } ${isRTL ? "text-right" : "text-left"}`}
                  >
                    {ui.compareMetric}
                  </th>
                  {comparisonRows.map((item) => {
                    const isBest = item.product.id === bestFitProductId;

                    return (
                      <th
                        key={item.product.id}
                        className={`border-b px-4 py-3 ${
                          isDark ? "border-gray-700 bg-gray-900" : "border-gray-200 bg-gray-50"
                        } ${isRTL ? "text-right" : "text-left"}`}
                      >
                        <div className={`space-y-1 rounded-lg px-2 py-1 ${isBest ? "ring-2 ring-emerald-400/70" : ""}`}>
                          <p className="font-semibold">{item.product.displayName}</p>
                          {isBest && (
                            <span className="inline-flex rounded-full bg-emerald-100 px-2 py-0.5 text-[11px] font-medium text-emerald-700">
                              {ui.compareBestFit}
                            </span>
                          )}
                        </div>
                      </th>
                    );
                  })}
                </tr>
              </thead>

              <tbody>
                <tr>
                  <th className={`sticky left-0 z-10 border-b px-3 py-3 ${isDark ? "border-gray-700 bg-gray-900" : "border-gray-200 bg-white"} ${isRTL ? "text-right" : "text-left"}`}>
                    {ui.compareRowCategory}
                  </th>
                  {comparisonRows.map((item) => (
                    <td key={`${item.product.id}-category`} className={`border-b px-4 py-3 ${isDark ? "border-gray-700" : "border-gray-200"}`}>
                      {item.product.localizedCategory}
                    </td>
                  ))}
                </tr>

                <tr>
                  <th className={`sticky left-0 z-10 border-b px-3 py-3 ${isDark ? "border-gray-700 bg-gray-900" : "border-gray-200 bg-white"} ${isRTL ? "text-right" : "text-left"}`}>
                    {ui.compareRowRate}
                  </th>
                  {comparisonRows.map((item) => (
                    <td key={`${item.product.id}-rate`} className={`border-b px-4 py-3 ${isDark ? "border-gray-700" : "border-gray-200"}`}>
                      {Number.isFinite(item.finance.annualRate)
                        ? `${toNumber(item.finance.annualRate, 0).toFixed(2)}%`
                        : ui.compareNoRate}
                    </td>
                  ))}
                </tr>

                <tr>
                  <th className={`sticky left-0 z-10 border-b px-3 py-3 ${isDark ? "border-gray-700 bg-gray-900" : "border-gray-200 bg-white"} ${isRTL ? "text-right" : "text-left"}`}>
                    {ui.compareRowDuration}
                  </th>
                  {comparisonRows.map((item) => (
                    <td key={`${item.product.id}-duration`} className={`border-b px-4 py-3 ${isDark ? "border-gray-700" : "border-gray-200"}`}>
                      {item.finance.durationMonths
                        ? `${item.finance.durationMonths} ${ui.compareMonths}`
                        : ui.compareNoDuration}
                    </td>
                  ))}
                </tr>

                <tr>
                  <th className={`sticky left-0 z-10 border-b px-3 py-3 ${isDark ? "border-gray-700 bg-gray-900" : "border-gray-200 bg-white"} ${isRTL ? "text-right" : "text-left"}`}>
                    {ui.compareRowMonthly}
                  </th>
                  {comparisonRows.map((item) => (
                    <td key={`${item.product.id}-monthly`} className={`border-b px-4 py-3 ${isDark ? "border-gray-700" : "border-gray-200"}`}>
                      {Number.isFinite(item.monthlyPayment)
                        ? formatCurrency(item.monthlyPayment, language)
                        : ui.compareNoMonthly}
                    </td>
                  ))}
                </tr>

                <tr>
                  <th className={`sticky left-0 z-10 border-b px-3 py-3 ${isDark ? "border-gray-700 bg-gray-900" : "border-gray-200 bg-white"} ${isRTL ? "text-right" : "text-left"}`}>
                    {ui.compareRowEligibility}
                  </th>
                  {comparisonRows.map((item) => (
                    <td key={`${item.product.id}-eligibility`} className={`border-b px-4 py-3 ${isDark ? "border-gray-700" : "border-gray-200"}`}>
                      <span className={`inline-flex rounded-full px-2.5 py-1 text-xs font-medium ${comparisonStatusClass(item.fit.status, isDark)}`}>
                        {comparisonStatusLabel(item.fit.status, ui)}
                      </span>
                    </td>
                  ))}
                </tr>

                <tr>
                  <th className={`sticky left-0 z-10 border-b px-3 py-3 ${isDark ? "border-gray-700 bg-gray-900" : "border-gray-200 bg-white"} ${isRTL ? "text-right" : "text-left"}`}>
                    {ui.compareRowConditions}
                  </th>
                  {comparisonRows.map((item) => (
                    <td key={`${item.product.id}-conditions`} className={`border-b px-4 py-3 text-xs ${isDark ? "border-gray-700 text-gray-300" : "border-gray-200 text-gray-600"}`}>
                      {item.fit.conditions.length > 0 ? item.fit.conditions.join(" | ") : "-"}
                    </td>
                  ))}
                </tr>

                <tr>
                  <th className={`sticky left-0 z-10 px-3 py-3 ${isDark ? "bg-gray-900" : "bg-white"} ${isRTL ? "text-right" : "text-left"}`}>
                    {ui.compareRowFit}
                  </th>
                  {comparisonRows.map((item) => (
                    <td key={`${item.product.id}-fit`} className="px-4 py-3">
                      <span className="font-semibold">{item.fit.score}/100</span>
                    </td>
                  ))}
                </tr>
              </tbody>
            </table>
          </div>
        )}
        </section>
      )}

      {loading ? (
        <ProductsCatalogSkeleton isDark={isDark} />
      ) : (
        <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-3">
          {filteredProducts.map((product) => (
            <article
              key={product.id}
              className={`overflow-hidden rounded-xl border ${
                isDark ? "border-gray-700 bg-gray-800" : "border-gray-200 bg-white"
              }`}
            >
              <div className="relative h-36 w-full overflow-hidden">
                <img
                  src={productImageSource(product)}
                  alt={product.displayName}
                  className="h-full w-full object-cover"
                  loading="lazy"
                  onError={(event) => {
                    event.currentTarget.onerror = null;
                    event.currentTarget.src = productImageDataUri(product);
                  }}
                />
                <div className={`absolute top-3 z-20 rounded-lg bg-white/90 p-1.5 shadow-sm ${isRTL ? "right-3" : "left-3"}`}>
                  <img src={bhLogo} alt="BH Bank" className="h-4 w-auto object-contain" />
                </div>
                <div className="absolute inset-0 bg-linear-to-r from-black/50 via-black/20 to-transparent" />
                <div className={`absolute inset-x-0 bottom-0 p-3 ${isRTL ? "text-right" : "text-left"}`}>
                  <p className="text-[10px] font-semibold tracking-[0.14em] text-white/80">
                    {productPhotoTag(language)}
                  </p>
                  <p className="mt-1 truncate text-sm font-semibold text-white">{product.displayName}</p>
                  <p className="text-xs text-blue-100">{product.localizedCategory}</p>
                </div>
              </div>

              <div className="p-5">
                <div className="mb-3 flex items-center justify-between gap-2">
                  <span
                    className={`rounded-full px-2.5 py-1 text-xs ${
                      isDark ? "bg-gray-900 text-gray-300" : "bg-gray-100 text-gray-600"
                    }`}
                  >
                    {product.localizedCategory}
                  </span>
                  {product.isRecommended && (
                    <span className="inline-flex items-center gap-1 rounded-full bg-amber-100 px-2.5 py-1 text-xs text-amber-700">
                      <Star className="h-3 w-3" />
                      {ui.recommended}
                    </span>
                  )}
                </div>

                <h2 className="text-lg font-semibold">{product.displayName}</h2>
                <p className={`mt-2 text-sm ${isDark ? "text-gray-300" : "text-gray-600"}`}>
                  {product.displayDescription}
                </p>

                {product.isRecommended && (
                  <p className={`mt-3 rounded-lg px-3 py-2 text-xs ${isDark ? "bg-amber-900/20 text-amber-200" : "bg-amber-50 text-amber-800"}`}>
                    {product.recommendationReason || ui.recommendationFallback}
                  </p>
                )}

                <div className="mt-4 flex flex-wrap gap-2">
                  <button
                    type="button"
                    onClick={() => setSelectedProduct(product)}
                    className="inline-flex items-center gap-2 rounded-lg bg-[#0A2240] px-3 py-2 text-sm font-medium text-white hover:bg-[#12305b]"
                  >
                    <Info className="h-4 w-4" />
                    {ui.moreInfo}
                  </button>

                  {showComparator && (
                    <button
                      type="button"
                      onClick={() => toggleComparisonProduct(product.id)}
                      className={`inline-flex items-center gap-2 rounded-lg px-3 py-2 text-sm font-medium ${
                        comparisonProductIds.includes(product.id)
                          ? "bg-emerald-600 text-white hover:bg-emerald-700"
                          : isDark
                            ? "bg-gray-900 text-gray-200 hover:bg-gray-700"
                            : "bg-gray-100 text-gray-700 hover:bg-gray-200"
                      }`}
                    >
                      {comparisonProductIds.includes(product.id) ? ui.compareRemove : ui.compareAdd}
                    </button>
                  )}
                </div>
              </div>
            </article>
          ))}

          {filteredProducts.length === 0 && (
            <div
              className={`md:col-span-2 xl:col-span-3 rounded-xl border p-6 text-sm ${
                isDark
                  ? "border-gray-700 bg-gray-800 text-gray-300"
                  : "border-gray-200 bg-white text-gray-600"
              }`}
            >
              {ui.noProducts}
            </div>
          )}
        </div>
      )}

      {selectedProduct && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/55 p-4">
          <div
            className={`max-h-[92vh] w-full max-w-3xl overflow-y-auto rounded-2xl border ${
              isDark ? "border-gray-700 bg-gray-900 text-white" : "border-gray-200 bg-white text-gray-900"
            }`}
          >
            <div className="relative h-52 w-full overflow-hidden">
              <img
                src={productImageSource(selectedProduct)}
                alt={selectedProduct.displayName}
                className="h-full w-full object-cover"
                loading="lazy"
                onError={(event) => {
                  event.currentTarget.onerror = null;
                  event.currentTarget.src = productImageDataUri(selectedProduct);
                }}
              />
              <div className={`absolute top-3 z-20 rounded-lg bg-white/90 p-1.5 shadow-sm ${isRTL ? "right-3" : "left-3"}`}>
                <img src={bhLogo} alt="BH Bank" className="h-4 w-auto object-contain" />
              </div>
              <div className="absolute inset-0 bg-linear-to-r from-black/55 via-black/20 to-transparent" />
              <div className={`absolute inset-x-0 bottom-0 p-5 ${isRTL ? "text-right" : "text-left"}`}>
                <p className="text-xs font-semibold tracking-[0.18em] text-white/80">
                  {productPhotoTag(language)}
                </p>
                <p className="mt-1 text-2xl font-semibold leading-tight text-white">
                  {selectedProduct.displayName}
                </p>
                <p className="mt-1 text-sm text-blue-100">{selectedProduct.localizedCategory}</p>
              </div>
              <button
                type="button"
                onClick={() => setSelectedProduct(null)}
                className={`absolute top-3 inline-flex h-9 w-9 items-center justify-center rounded-full bg-black/40 text-white hover:bg-black/60 ${
                  isRTL ? "left-3" : "right-3"
                }`}
                aria-label={ui.close}
              >
                <X className="h-4 w-4" />
              </button>
            </div>

            <div className="space-y-5 p-6">
              <div className="flex flex-wrap items-center justify-between gap-3">
                <div>
                  <h2 className="text-2xl font-semibold">{selectedProduct.displayName}</h2>
                  <p className={isDark ? "text-gray-400" : "text-gray-600"}>
                    {selectedProduct.localizedCategory}
                  </p>
                </div>

                {selectedProduct.isRecommended && (
                  <span className="inline-flex items-center gap-1 rounded-full bg-amber-100 px-3 py-1 text-xs text-amber-700">
                    <Star className="h-3.5 w-3.5" />
                    {ui.recommended}
                  </span>
                )}
              </div>

              <p className={isDark ? "text-gray-300" : "text-gray-700"}>{selectedProduct.displayDescription}</p>

              {selectedProduct.isRecommended && (
                <div className={`rounded-xl border p-4 ${isDark ? "border-amber-800 bg-amber-900/15" : "border-amber-200 bg-amber-50"}`}>
                  <h3 className="mb-2 text-sm font-semibold">{ui.recommendationTitle}</h3>
                  <p className="text-sm">{selectedProduct.recommendationReason || ui.recommendationFallback}</p>
                </div>
              )}

              <div className="grid gap-4 md:grid-cols-2">
                <div className={`rounded-xl border p-4 ${isDark ? "border-gray-700 bg-gray-800" : "border-gray-200 bg-gray-50"}`}>
                  <h3 className="mb-2 text-sm font-semibold">{ui.featuresTitle}</h3>
                  <ul className={`list-disc space-y-1.5 text-sm ${isRTL ? "pr-5" : "pl-5"}`}>
                    {(selectedProduct.displayFeatures || []).slice(0, 6).map((feature) => (
                      <li key={feature}>{feature}</li>
                    ))}
                  </ul>
                </div>

                <div className={`rounded-xl border p-4 ${isDark ? "border-gray-700 bg-gray-800" : "border-gray-200 bg-gray-50"}`}>
                  <h3 className="mb-2 text-sm font-semibold">{ui.detailsTitle}</h3>
                  <ul className={`list-disc space-y-1.5 text-sm ${isRTL ? "pr-5" : "pl-5"}`}>
                    {(selectedProduct.displayDetails || []).slice(0, 6).map((detail) => (
                      <li key={detail}>{detail}</li>
                    ))}
                  </ul>
                </div>
              </div>

              <div className={`flex ${isRTL ? "justify-start" : "justify-end"}`}>
                <button
                  type="button"
                  onClick={() => setSelectedProduct(null)}
                  className={`rounded-lg px-4 py-2 text-sm ${
                    isDark ? "bg-gray-800 hover:bg-gray-700" : "bg-gray-100 hover:bg-gray-200"
                  }`}
                >
                  {ui.close}
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
