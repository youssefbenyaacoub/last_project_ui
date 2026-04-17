import { StaticPageLayout } from "../components/StaticPageLayout";
import { useLanguage } from "../contexts/LanguageContext";
import {
  Bar,
  BarChart,
  CartesianGrid,
  Cell,
  Legend,
  Line,
  LineChart,
  Pie,
  PieChart,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from "recharts";

function renderSections(sections) {
  return sections.map((section, index) => (
    <section key={index} className="space-y-3">
      <h2 className="text-lg font-bold text-gray-900">{section.title}</h2>
      {section.paragraph ? (
        <p className="text-sm leading-relaxed text-gray-600">{section.paragraph}</p>
      ) : null}
      {section.items ? (
        <ul className="space-y-2 list-disc list-inside text-sm leading-relaxed text-gray-600">
          {section.items.map((item, itemIndex) => (
            <li key={itemIndex}>{item}</li>
          ))}
        </ul>
      ) : null}
    </section>
  ));
}

function GenericInfoPage({ copy }) {
  const { language, isRTL } = useLanguage();
  const data = copy[language] || copy.en;

  return (
    <StaticPageLayout title={data.title}>
      <div className={`space-y-8 ${isRTL ? "text-right" : "text-left"}`}>
        <p className="text-sm leading-relaxed text-gray-600">{data.intro}</p>
        {renderSections(data.sections)}
      </div>
    </StaticPageLayout>
  );
}

const beginnerGuideCopy = {
  en: {
    title: "Beginner Guide: How To Use The Platform",
    intro:
      "This walkthrough is designed for first-time users. Follow the sequence below and you will be able to navigate the platform confidently in your first 30 minutes.",
    stepsTitle: "Step-By-Step Platform Walkthrough",
    routeLabel: "Main route",
    tipLabel: "Beginner tip",
    steps: [
      {
        title: "Sign in and open your workspace",
        route: "/login",
        goal: "Access your secure client area.",
        actions: [
          "Enter your email and password.",
          "Confirm OTP if requested.",
          "Wait for redirection to the dashboard.",
        ],
        tip: "If login fails, check keyboard language and OTP validity time.",
      },
      {
        title: "Read your financial snapshot",
        route: "/dashboard",
        goal: "Understand balance, income, expenses, and monthly trends.",
        actions: [
          "Review summary cards at the top.",
          "Check transactions and spending blocks.",
          "Identify one category with high spending.",
        ],
        tip: "Start decisions from trends, not one isolated transaction.",
      },
      {
        title: "Complete your profile",
        route: "/dashboard/profile",
        goal: "Improve recommendation quality.",
        actions: [
          "Verify identity and contact information.",
          "Update enhanced profile fields.",
          "Save changes and confirm success message.",
        ],
        tip: "More complete profile data leads to better product suggestions.",
      },
      {
        title: "Ask the chatbot for guidance",
        route: "/dashboard/chatbot",
        goal: "Get quick answers and personalized help.",
        actions: [
          "Start with a simple question like: 'How can I reduce expenses?'.",
          "Use one topic per message for clearer answers.",
          "Copy actionable recommendations into your plan.",
        ],
        tip: "Use short, specific prompts for better quality responses.",
      },
      {
        title: "Explore products and compare packs",
        route: "/dashboard/products and /dashboard/product-comparator",
        goal: "Find the most relevant products for your profile.",
        actions: [
          "Open Products and filter by category.",
          "Open Comparator and select up to 3 packs.",
          "Switch between All, Differences, and Similarities.",
        ],
        tip: "Prioritize eligibility and monthly affordability over feature count.",
      },
      {
        title: "Run simulations before choosing",
        route: "/dashboard/simulator",
        goal: "Estimate monthly payments and savings outcomes.",
        actions: [
          "Enter realistic amount, duration, and rate.",
          "Compare at least two scenarios.",
          "Keep the scenario that fits your monthly cash flow.",
        ],
        tip: "A sustainable monthly payment is safer than a larger short-term loan.",
      },
      {
        title: "Set and monitor your budget",
        route: "/dashboard/budget",
        goal: "Control spending and avoid over-budget categories.",
        actions: [
          "Set monthly limits by category.",
          "Review progress bars and alerts.",
          "Adjust limits after salary or expense changes.",
        ],
        tip: "Review budget once per week, not only at month-end.",
      },
      {
        title: "Use claims if something goes wrong",
        route: "/dashboard/reclamation",
        goal: "Report incidents and track response status.",
        actions: [
          "Choose the claim type.",
          "Describe the issue with date and context.",
          "Monitor claim status in history.",
        ],
        tip: "A clear, factual description speeds up support resolution.",
      },
    ],
    charts: {
      impactTitle: "Feature Impact In The First Week",
      impactSubtitle: "Recommended focus order based on beginner value.",
      impactLegend: "Impact score",
      progressTitle: "Confidence Growth (Day 1 To Day 7)",
      progressSubtitle: "Expected confidence increase when following this guide.",
      progressLegend: "Confidence",
      timeTitle: "Suggested Time Split For Your First 30 Minutes",
      timeSubtitle: "Use this split to avoid spending too much time in one module.",
    },
    impactData: [
      { module: "Dashboard", impact: 96 },
      { module: "Profile", impact: 89 },
      { module: "Products", impact: 84 },
      { module: "Simulator", impact: 82 },
      { module: "Budget", impact: 88 },
      { module: "Chatbot", impact: 78 },
    ],
    progressData: [
      { day: "D1", confidence: 22 },
      { day: "D2", confidence: 35 },
      { day: "D3", confidence: 48 },
      { day: "D4", confidence: 59 },
      { day: "D5", confidence: 71 },
      { day: "D6", confidence: 81 },
      { day: "D7", confidence: 90 },
    ],
    timeSplitData: [
      { name: "Dashboard", value: 7 },
      { name: "Profile", value: 5 },
      { name: "Products", value: 6 },
      { name: "Simulator", value: 5 },
      { name: "Budget", value: 4 },
      { name: "Chatbot", value: 3 },
    ],
    checklistTitle: "First Session Checklist",
    checklist: [
      "I can log in and access my dashboard.",
      "My profile is complete and saved.",
      "I compared at least 2 products.",
      "I ran one simulation and checked affordability.",
      "I configured my monthly budget categories.",
      "I know where to open a support claim.",
    ],
  },
  fr: {
    title: "Guide Debutant: Comment Utiliser La Plateforme",
    intro:
      "Ce parcours est concu pour les nouveaux utilisateurs. Suivez les etapes dans cet ordre pour maitriser la plateforme en moins de 30 minutes.",
    stepsTitle: "Parcours Detaille Etape Par Etape",
    routeLabel: "Route principale",
    tipLabel: "Conseil debutant",
    steps: [
      {
        title: "Connexion et acces a l'espace client",
        route: "/login",
        goal: "Entrer dans votre espace securise.",
        actions: [
          "Saisissez email et mot de passe.",
          "Validez l'OTP si demande.",
          "Attendez la redirection vers le dashboard.",
        ],
        tip: "En cas d'erreur, verifiez la langue du clavier et la validite OTP.",
      },
      {
        title: "Lecture du snapshot financier",
        route: "/dashboard",
        goal: "Comprendre solde, revenus, depenses et tendances.",
        actions: [
          "Lisez les cartes resume en haut.",
          "Consultez transactions et depenses.",
          "Reperez une categorie de depense elevee.",
        ],
        tip: "Prenez des decisions sur la tendance, pas sur un seul mouvement.",
      },
      {
        title: "Mise a jour du profil",
        route: "/dashboard/profile",
        goal: "Ameliorer la precision des recommandations.",
        actions: [
          "Verifiez identite et contact.",
          "Remplissez le formulaire enrichi.",
          "Enregistrez et verifiez le message de succes.",
        ],
        tip: "Plus le profil est complet, plus les recommandations sont pertinentes.",
      },
      {
        title: "Utilisation du chatbot",
        route: "/dashboard/chatbot",
        goal: "Obtenir des conseils rapides et personnalises.",
        actions: [
          "Posez une question claire, par exemple sur la reduction des depenses.",
          "Restez sur un seul sujet par message.",
          "Gardez les actions recommandees utiles.",
        ],
        tip: "Des prompts courts et precis donnent de meilleures reponses.",
      },
      {
        title: "Exploration et comparaison des produits",
        route: "/dashboard/products et /dashboard/product-comparator",
        goal: "Identifier les offres adaptees a votre profil.",
        actions: [
          "Filtrez les produits par categorie.",
          "Comparez jusqu'a 3 packs.",
          "Utilisez les vues Tous, Differences, Similitudes.",
        ],
        tip: "Priorisez l'eligibilite et la mensualite supportable.",
      },
      {
        title: "Simulation avant decision",
        route: "/dashboard/simulator",
        goal: "Estimer mensualites et scenarios d'epargne.",
        actions: [
          "Saisissez montant, duree, taux realistes.",
          "Comparez au moins deux scenarios.",
          "Retenez le scenario soutenable mensuellement.",
        ],
        tip: "Une mensualite stable est plus sure qu'un montant trop ambitieux.",
      },
      {
        title: "Pilotage du budget",
        route: "/dashboard/budget",
        goal: "Controler les depenses par categorie.",
        actions: [
          "Fixez un plafond par categorie.",
          "Suivez les barres de progression.",
          "Ajustez selon revenus et charges reelles.",
        ],
        tip: "Faites un check budget hebdomadaire.",
      },
      {
        title: "Declaration de reclamation",
        route: "/dashboard/reclamation",
        goal: "Signaler un incident et suivre son statut.",
        actions: [
          "Choisissez le type de reclamation.",
          "Ajoutez une description factuelle avec date.",
          "Consultez l'historique de traitement.",
        ],
        tip: "Une description claire accelere la resolution.",
      },
    ],
    charts: {
      impactTitle: "Impact Des Modules Sur La Premiere Semaine",
      impactSubtitle: "Ordre de priorite recommande pour debuter.",
      impactLegend: "Score d'impact",
      progressTitle: "Progression De Confiance (J1 a J7)",
      progressSubtitle: "Confiance attendue en suivant ce parcours.",
      progressLegend: "Confiance",
      timeTitle: "Repartition Conseillee De Vos 30 Premieres Minutes",
      timeSubtitle: "Evitez de passer trop de temps sur un seul module.",
    },
    impactData: [
      { module: "Dashboard", impact: 96 },
      { module: "Profil", impact: 89 },
      { module: "Produits", impact: 84 },
      { module: "Simulateur", impact: 82 },
      { module: "Budget", impact: 88 },
      { module: "Chatbot", impact: 78 },
    ],
    progressData: [
      { day: "J1", confidence: 22 },
      { day: "J2", confidence: 35 },
      { day: "J3", confidence: 48 },
      { day: "J4", confidence: 59 },
      { day: "J5", confidence: 71 },
      { day: "J6", confidence: 81 },
      { day: "J7", confidence: 90 },
    ],
    timeSplitData: [
      { name: "Dashboard", value: 7 },
      { name: "Profil", value: 5 },
      { name: "Produits", value: 6 },
      { name: "Simulateur", value: 5 },
      { name: "Budget", value: 4 },
      { name: "Chatbot", value: 3 },
    ],
    checklistTitle: "Checklist Premiere Session",
    checklist: [
      "Je peux me connecter et ouvrir le dashboard.",
      "Mon profil est complete et enregistre.",
      "J'ai compare au moins 2 produits.",
      "J'ai fait une simulation avec mensualite verifiee.",
      "J'ai defini mes categories budgetaires.",
      "Je sais ou ouvrir une reclamation.",
    ],
  },
  ar: {
    title: "دليل المبتدئ لاستخدام المنصة",
    intro:
      "هذا المسار مخصص للمستخدم الجديد. باتباع الخطوات بالترتيب ستتمكن من استخدام المنصة بثقة خلال أول 30 دقيقة.",
    stepsTitle: "مسار مفصل خطوة بخطوة",
    routeLabel: "المسار الرئيسي",
    tipLabel: "نصيحة للمبتدئ",
    steps: [
      {
        title: "تسجيل الدخول وفتح المساحة الشخصية",
        route: "/login",
        goal: "الدخول إلى مساحة العميل الآمنة.",
        actions: [
          "أدخل البريد الإلكتروني وكلمة المرور.",
          "أكد رمز OTP عند الطلب.",
          "انتظر التحويل إلى لوحة التحكم.",
        ],
        tip: "عند الفشل، تحقق من لغة لوحة المفاتيح وصلاحية رمز OTP.",
      },
      {
        title: "قراءة الملخص المالي",
        route: "/dashboard",
        goal: "فهم الرصيد والدخل والمصاريف والاتجاهات.",
        actions: [
          "راجع البطاقات الملخصة في الأعلى.",
          "اطلع على المعاملات وحركة المصاريف.",
          "حدد فئة إنفاق مرتفعة.",
        ],
        tip: "ابن قرارك على الاتجاه العام وليس على عملية واحدة.",
      },
      {
        title: "استكمال الملف الشخصي",
        route: "/dashboard/profile",
        goal: "تحسين دقة التوصيات.",
        actions: [
          "تحقق من بيانات الهوية والتواصل.",
          "أكمل الحقول الإضافية.",
          "احفظ التغييرات وتأكد من رسالة النجاح.",
        ],
        tip: "كلما كانت البيانات أدق كانت التوصيات أفضل.",
      },
      {
        title: "استخدام الشات بوت",
        route: "/dashboard/chatbot",
        goal: "الحصول على مساعدة سريعة وشخصية.",
        actions: [
          "ابدأ بسؤال واضح عن المصاريف أو الادخار.",
          "ارسل موضوعا واحدا في كل رسالة.",
          "احتفظ بالنصائح القابلة للتنفيذ.",
        ],
        tip: "الأسئلة القصيرة والواضحة تعطي إجابات أفضل.",
      },
      {
        title: "استكشاف المنتجات والمقارنة",
        route: "/dashboard/products و /dashboard/product-comparator",
        goal: "اختيار المنتجات المناسبة لملفك.",
        actions: [
          "صف المنتجات حسب الفئة.",
          "قارن حتى 3 باقات.",
          "استخدم طرق العرض: الكل، الاختلافات، التشابهات.",
        ],
        tip: "الأهلية والقدرة الشهرية أهم من عدد المزايا.",
      },
      {
        title: "تشغيل المحاكاة قبل الاختيار",
        route: "/dashboard/simulator",
        goal: "تقدير القسط الشهري وسيناريوهات الادخار.",
        actions: [
          "أدخل مبلغا ومدة ونسبة واقعية.",
          "قارن سيناريوهين على الأقل.",
          "اختر السيناريو الأنسب لتدفقك المالي.",
        ],
        tip: "قسط شهري مستقر أفضل من التزام مرتفع.",
      },
      {
        title: "إدارة الميزانية",
        route: "/dashboard/budget",
        goal: "التحكم في الإنفاق حسب الفئات.",
        actions: [
          "حدد سقفا شهريا لكل فئة.",
          "تابع مؤشرات التقدم والتنبيهات.",
          "عدل الحدود حسب التغيرات الواقعية.",
        ],
        tip: "راجع الميزانية أسبوعيا وليس في آخر الشهر فقط.",
      },
      {
        title: "إرسال شكوى عند وجود مشكلة",
        route: "/dashboard/reclamation",
        goal: "الإبلاغ عن المشكلة ومتابعة الحالة.",
        actions: [
          "اختر نوع الشكوى.",
          "اكتب وصفا واضحا مع التاريخ.",
          "تابع التحديثات من سجل الشكاوى.",
        ],
        tip: "الوصف الواضح يسرع حل المشكلة.",
      },
    ],
    charts: {
      impactTitle: "أثر كل وحدة خلال الأسبوع الأول",
      impactSubtitle: "ترتيب البدء المقترح للمستخدم الجديد.",
      impactLegend: "درجة الأثر",
      progressTitle: "نمو الثقة من اليوم 1 إلى اليوم 7",
      progressSubtitle: "تطور متوقع عند اتباع هذا الدليل.",
      progressLegend: "الثقة",
      timeTitle: "توزيع مقترح لأول 30 دقيقة",
      timeSubtitle: "حتى لا تستهلك وقتك في جزء واحد فقط.",
    },
    impactData: [
      { module: "لوحة التحكم", impact: 96 },
      { module: "الملف الشخصي", impact: 89 },
      { module: "المنتجات", impact: 84 },
      { module: "المحاكي", impact: 82 },
      { module: "الميزانية", impact: 88 },
      { module: "الشات بوت", impact: 78 },
    ],
    progressData: [
      { day: "ي1", confidence: 22 },
      { day: "ي2", confidence: 35 },
      { day: "ي3", confidence: 48 },
      { day: "ي4", confidence: 59 },
      { day: "ي5", confidence: 71 },
      { day: "ي6", confidence: 81 },
      { day: "ي7", confidence: 90 },
    ],
    timeSplitData: [
      { name: "لوحة التحكم", value: 7 },
      { name: "الملف الشخصي", value: 5 },
      { name: "المنتجات", value: 6 },
      { name: "المحاكي", value: 5 },
      { name: "الميزانية", value: 4 },
      { name: "الشات بوت", value: 3 },
    ],
    checklistTitle: "قائمة التحقق للجلسة الأولى",
    checklist: [
      "أستطيع تسجيل الدخول والوصول إلى لوحة التحكم.",
      "ملفي الشخصي مكتمل ومحفوظ.",
      "قارنت بين منتجين على الأقل.",
      "قمت بمحاكاة وتأكدت من القدرة الشهرية.",
      "ضبطت فئات الميزانية الشهرية.",
      "أعرف أين أفتح شكوى عند الحاجة.",
    ],
  },
};

const supportCenterCopy = {
  en: {
    title: "Support Center",
    intro:
      "Our support team is ready to help you with account, transfer, and security questions.",
    sections: [
      {
        title: "How to Contact Us",
        items: [
          "Email: support@bhbank.tn",
          "Phone: +216 71 126 000",
          "Availability: Monday to Friday, 8:00 to 18:00",
        ],
      },
      {
        title: "Before Reaching Out",
        items: [
          "Prepare your account email and recent activity details.",
          "Describe the issue and include screenshots if possible.",
          "Do not share your password or one-time verification code.",
        ],
      },
    ],
  },
  fr: {
    title: "Centre d'assistance",
    intro:
      "Notre equipe support est prete a vous aider pour les questions de compte, virement et securite.",
    sections: [
      {
        title: "Comment nous contacter",
        items: [
          "Email : support@bhbank.tn",
          "Telephone : +216 71 126 000",
          "Disponibilite : lundi a vendredi, 8:00 a 18:00",
        ],
      },
      {
        title: "Avant de nous contacter",
        items: [
          "Preparez votre email de compte et les details recents.",
          "Decrivez le probleme et ajoutez des captures si possible.",
          "Ne partagez jamais votre mot de passe ou code OTP.",
        ],
      },
    ],
  },
  ar: {
    title: "مركز الدعم",
    intro:
      "فريق الدعم جاهز لمساعدتك في أسئلة الحساب والتحويل والأمان.",
    sections: [
      {
        title: "كيفية التواصل معنا",
        items: [
          "البريد الإلكتروني: support@bhbank.tn",
          "الهاتف: +216 71 126 000",
          "أوقات العمل: من الاثنين إلى الجمعة، 8:00 إلى 18:00",
        ],
      },
      {
        title: "قبل التواصل",
        items: [
          "جهّز بريد حسابك وتفاصيل النشاط الأخير.",
          "اشرح المشكلة وأرفق لقطات شاشة إن أمكن.",
          "لا تشارك كلمة المرور أو رمز التحقق المؤقت.",
        ],
      },
    ],
  },
};

const privacyPolicyCopy = {
  en: {
    title: "Privacy Policy",
    intro:
      "This page explains how BH Bank collects, uses, and protects your personal data.",
    sections: [
      {
        title: "Data We Collect",
        items: [
          "Identity and contact information during account registration.",
          "Transaction and usage data to provide banking services.",
          "Security logs to detect and prevent fraud.",
        ],
      },
      {
        title: "How We Use Data",
        items: [
          "Provide core banking features and customer support.",
          "Improve service quality and personalized insights.",
          "Meet legal and regulatory obligations.",
        ],
      },
    ],
  },
  fr: {
    title: "Politique de confidentialite",
    intro:
      "Cette page explique comment BH Bank collecte, utilise et protege vos donnees personnelles.",
    sections: [
      {
        title: "Donnees collectees",
        items: [
          "Informations d'identite et de contact a l'inscription.",
          "Donnees de transactions et d'usage pour le service bancaire.",
          "Journaux de securite pour detecter et prevenir la fraude.",
        ],
      },
      {
        title: "Utilisation des donnees",
        items: [
          "Fournir les fonctionnalites bancaires et le support client.",
          "Ameliorer la qualite du service et les insights personnalises.",
          "Respecter les obligations legales et reglementaires.",
        ],
      },
    ],
  },
  ar: {
    title: "سياسة الخصوصية",
    intro:
      "توضح هذه الصفحة كيف يجمع BH Bank بياناتك الشخصية ويستخدمها ويحميها.",
    sections: [
      {
        title: "البيانات التي نجمعها",
        items: [
          "بيانات الهوية والاتصال أثناء التسجيل.",
          "بيانات المعاملات والاستخدام لتقديم الخدمات البنكية.",
          "سجلات الأمان لاكتشاف الاحتيال ومنعه.",
        ],
      },
      {
        title: "كيفية استخدام البيانات",
        items: [
          "تقديم الخدمات البنكية الأساسية ودعم العملاء.",
          "تحسين جودة الخدمة وتقديم رؤى مخصصة.",
          "الالتزام بالمتطلبات القانونية والتنظيمية.",
        ],
      },
    ],
  },
};

const termsOfServiceCopy = {
  en: {
    title: "Terms of Service",
    intro:
      "These terms define the rules for using BH Bank digital services.",
    sections: [
      {
        title: "Account Responsibilities",
        items: [
          "Keep your login credentials private and secure.",
          "Use accurate information and keep your profile updated.",
          "Report suspicious account activity immediately.",
        ],
      },
      {
        title: "Service Usage",
        items: [
          "Use BH Bank services only for lawful activities.",
          "Respect transfer limits and security checks.",
          "BH Bank may temporarily limit access for security reasons.",
        ],
      },
    ],
  },
  fr: {
    title: "Conditions d'utilisation",
    intro:
      "Ces conditions definissent les regles d'utilisation des services numeriques BH Bank.",
    sections: [
      {
        title: "Responsabilites du compte",
        items: [
          "Gardez vos identifiants de connexion prives et securises.",
          "Utilisez des informations exactes et mettez votre profil a jour.",
          "Signalez immediatement toute activite suspecte.",
        ],
      },
      {
        title: "Utilisation du service",
        items: [
          "Utilisez les services BH Bank uniquement pour des activites legales.",
          "Respectez les limites de virement et controles de securite.",
          "BH Bank peut limiter temporairement l'acces pour raison de securite.",
        ],
      },
    ],
  },
  ar: {
    title: "شروط الخدمة",
    intro:
      "تحدد هذه الشروط قواعد استخدام الخدمات الرقمية لـ BH Bank.",
    sections: [
      {
        title: "مسؤوليات الحساب",
        items: [
          "حافظ على سرية بيانات تسجيل الدخول الخاصة بك.",
          "استخدم معلومات دقيقة وحدّث ملفك الشخصي باستمرار.",
          "أبلغ فورًا عن أي نشاط مشبوه.",
        ],
      },
      {
        title: "استخدام الخدمة",
        items: [
          "استخدم خدمات BH Bank في أنشطة قانونية فقط.",
          "التزم بحدود التحويل وإجراءات الأمان.",
          "قد يقيّد البنك الوصول مؤقتًا لأسباب أمنية.",
        ],
      },
    ],
  },
};

const securityCopy = {
  en: {
    title: "Security",
    intro:
      "Security is a priority. Follow these practices to protect your account.",
    sections: [
      {
        title: "Recommended Actions",
        items: [
          "Enable two-factor authentication.",
          "Use a unique password and update it regularly.",
          "Log out from shared or public devices.",
        ],
      },
      {
        title: "Fraud Prevention",
        items: [
          "Never share OTP codes with anyone.",
          "Ignore suspicious links and unknown attachments.",
          "Contact support immediately if you notice unusual activity.",
        ],
      },
    ],
  },
  fr: {
    title: "Securite",
    intro:
      "La securite est une priorite. Suivez ces bonnes pratiques pour proteger votre compte.",
    sections: [
      {
        title: "Actions recommandees",
        items: [
          "Activez l'authentification a deux facteurs.",
          "Utilisez un mot de passe unique et changez-le regulierement.",
          "Deconnectez-vous sur les appareils partages ou publics.",
        ],
      },
      {
        title: "Prevention de la fraude",
        items: [
          "Ne partagez jamais votre code OTP.",
          "Ignorez les liens suspects et pieces jointes inconnues.",
          "Contactez le support immediatement en cas d'activite anormale.",
        ],
      },
    ],
  },
  ar: {
    title: "الأمان",
    intro:
      "الأمان أولوية. اتبع هذه الممارسات لحماية حسابك.",
    sections: [
      {
        title: "إجراءات موصى بها",
        items: [
          "فعّل المصادقة الثنائية.",
          "استخدم كلمة مرور فريدة وقم بتحديثها بانتظام.",
          "سجّل الخروج من الأجهزة المشتركة أو العامة.",
        ],
      },
      {
        title: "الوقاية من الاحتيال",
        items: [
          "لا تشارك رمز OTP مع أي شخص.",
          "تجاهل الروابط المشبوهة والمرفقات غير المعروفة.",
          "اتصل بالدعم فورًا إذا لاحظت نشاطًا غير طبيعي.",
        ],
      },
    ],
  },
};

export function UserGuidesPage() {
  const { language, isRTL } = useLanguage();
  const data = beginnerGuideCopy[language] || beginnerGuideCopy.en;
  const pieColors = ["#0A2240", "#1d4ed8", "#0891b2", "#16a34a", "#f59e0b", "#ef4444"];

  return (
    <StaticPageLayout title={data.title}>
      <div className={`space-y-10 ${isRTL ? "text-right" : "text-left"}`}>
        <p className="text-sm leading-relaxed text-gray-600">{data.intro}</p>

        <section className="space-y-4">
          <h2 className="text-xl font-bold text-gray-900">{data.stepsTitle}</h2>

          <div className="space-y-4">
            {data.steps.map((step, index) => (
              <article key={`${step.title}-${index}`} className="rounded-2xl border border-gray-200 bg-white p-5 shadow-xs">
                <div className={`flex items-start gap-4 ${isRTL ? "flex-row-reverse" : ""}`}>
                  <div className="inline-flex h-9 w-9 shrink-0 items-center justify-center rounded-full bg-[#0A2240] text-sm font-bold text-white">
                    {index + 1}
                  </div>

                  <div className="min-w-0 flex-1 space-y-2">
                    <h3 className="text-base font-semibold text-gray-900">{step.title}</h3>
                    <p className="text-sm text-gray-600">{step.goal}</p>

                    <div className={`flex flex-wrap items-center gap-2 ${isRTL ? "justify-end" : "justify-start"}`}>
                      <span className="rounded-full bg-[#e7edf5] px-2.5 py-1 text-[11px] font-semibold uppercase tracking-wide text-[#0A2240]">
                        {data.routeLabel}
                      </span>
                      <span className="rounded-full border border-gray-200 bg-gray-50 px-2.5 py-1 text-xs font-mono text-gray-700">
                        {step.route}
                      </span>
                    </div>

                    <ul className={`space-y-1.5 text-sm text-gray-700 ${isRTL ? "list-none" : "list-disc pl-5"}`}>
                      {step.actions.map((item, actionIndex) => (
                        <li key={`${step.title}-action-${actionIndex}`} className={isRTL ? "before:ml-2 before:content-['•']" : ""}>
                          {item}
                        </li>
                      ))}
                    </ul>

                    <p className="rounded-lg border border-blue-100 bg-blue-50 px-3 py-2 text-xs text-blue-800">
                      <span className="font-semibold">{data.tipLabel}: </span>
                      {step.tip}
                    </p>
                  </div>
                </div>
              </article>
            ))}
          </div>
        </section>

        <section className="grid gap-6 xl:grid-cols-2">
          <article className="rounded-2xl border border-gray-200 bg-white p-5">
            <h3 className="text-base font-semibold text-gray-900">{data.charts.impactTitle}</h3>
            <p className="mt-1 text-sm text-gray-600">{data.charts.impactSubtitle}</p>

            <div className="mt-4 h-72 w-full">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={data.impactData} margin={{ top: 10, right: 12, left: -18, bottom: 4 }}>
                  <CartesianGrid strokeDasharray="3 3" stroke="#e5e7eb" />
                  <XAxis dataKey="module" tick={{ fontSize: 12, fill: "#475569" }} axisLine={false} tickLine={false} />
                  <YAxis domain={[0, 100]} tick={{ fontSize: 12, fill: "#475569" }} axisLine={false} tickLine={false} />
                  <Tooltip
                    contentStyle={{ borderRadius: 10, border: "1px solid #dbe4f1" }}
                    formatter={(value) => [`${value}%`, data.charts.impactLegend]}
                  />
                  <Legend />
                  <Bar dataKey="impact" name={data.charts.impactLegend} fill="#0A2240" radius={[8, 8, 0, 0]} />
                </BarChart>
              </ResponsiveContainer>
            </div>
          </article>

          <article className="rounded-2xl border border-gray-200 bg-white p-5">
            <h3 className="text-base font-semibold text-gray-900">{data.charts.progressTitle}</h3>
            <p className="mt-1 text-sm text-gray-600">{data.charts.progressSubtitle}</p>

            <div className="mt-4 h-72 w-full">
              <ResponsiveContainer width="100%" height="100%">
                <LineChart data={data.progressData} margin={{ top: 10, right: 12, left: -18, bottom: 4 }}>
                  <CartesianGrid strokeDasharray="3 3" stroke="#e5e7eb" />
                  <XAxis dataKey="day" tick={{ fontSize: 12, fill: "#475569" }} axisLine={false} tickLine={false} />
                  <YAxis domain={[0, 100]} tick={{ fontSize: 12, fill: "#475569" }} axisLine={false} tickLine={false} />
                  <Tooltip
                    contentStyle={{ borderRadius: 10, border: "1px solid #dbe4f1" }}
                    formatter={(value) => [`${value}%`, data.charts.progressLegend]}
                  />
                  <Legend />
                  <Line
                    type="monotone"
                    dataKey="confidence"
                    name={data.charts.progressLegend}
                    stroke="#1d4ed8"
                    strokeWidth={3}
                    dot={{ r: 4, fill: "#1d4ed8" }}
                    activeDot={{ r: 6 }}
                  />
                </LineChart>
              </ResponsiveContainer>
            </div>
          </article>

          <article className="rounded-2xl border border-gray-200 bg-white p-5 xl:col-span-2">
            <h3 className="text-base font-semibold text-gray-900">{data.charts.timeTitle}</h3>
            <p className="mt-1 text-sm text-gray-600">{data.charts.timeSubtitle}</p>

            <div className="mt-4 h-80 w-full">
              <ResponsiveContainer width="100%" height="100%">
                <PieChart>
                  <Pie
                    data={data.timeSplitData}
                    dataKey="value"
                    nameKey="name"
                    cx="50%"
                    cy="50%"
                    innerRadius={65}
                    outerRadius={110}
                    paddingAngle={2}
                    label={({ name, value }) => `${name}: ${value}m`}
                  >
                    {data.timeSplitData.map((entry, index) => (
                      <Cell key={`time-split-${entry.name}-${index}`} fill={pieColors[index % pieColors.length]} />
                    ))}
                  </Pie>
                  <Tooltip
                    contentStyle={{ borderRadius: 10, border: "1px solid #dbe4f1" }}
                    formatter={(value) => [`${value} min`, "Time"]}
                  />
                  <Legend />
                </PieChart>
              </ResponsiveContainer>
            </div>
          </article>
        </section>

        <section className="rounded-2xl border border-gray-200 bg-white p-5">
          <h3 className="text-base font-semibold text-gray-900">{data.checklistTitle}</h3>
          <ul className={`mt-3 space-y-2 text-sm text-gray-700 ${isRTL ? "list-none" : "list-disc pl-5"}`}>
            {data.checklist.map((item, index) => (
              <li key={`guide-checklist-${index}`} className={isRTL ? "before:ml-2 before:content-['•']" : ""}>
                {item}
              </li>
            ))}
          </ul>
        </section>
      </div>
    </StaticPageLayout>
  );
}

export function SupportCenterPage() {
  return <GenericInfoPage copy={supportCenterCopy} />;
}

export function PrivacyPolicyPage() {
  return <GenericInfoPage copy={privacyPolicyCopy} />;
}

export function TermsOfServicePage() {
  return <GenericInfoPage copy={termsOfServiceCopy} />;
}

export function SecurityPage() {
  return <GenericInfoPage copy={securityCopy} />;
}
