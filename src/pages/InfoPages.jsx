import { StaticPageLayout } from "../components/StaticPageLayout";
import { useLanguage } from "../contexts/LanguageContext";

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

const userGuidesCopy = {
  en: {
    title: "User Guides",
    intro:
      "Find practical guides to use BH Bank services faster and more effectively.",
    sections: [
      {
        title: "Get Started",
        items: [
          "Create your account and verify your profile.",
          "Secure your account with a strong password and 2FA.",
          "Connect your contact details to receive instant alerts.",
        ],
      },
      {
        title: "Daily Banking",
        items: [
          "Track your income and expenses from the dashboard.",
          "Use transfer tools to send money in a few steps.",
          "Review spending insights before setting new goals.",
        ],
      },
    ],
  },
  fr: {
    title: "Guides d'utilisation",
    intro:
      "Retrouvez des guides pratiques pour utiliser les services BH Bank plus rapidement et efficacement.",
    sections: [
      {
        title: "Demarrage",
        items: [
          "Creez votre compte et verifiez votre profil.",
          "Securisez votre compte avec un mot de passe fort et la 2FA.",
          "Ajoutez vos coordonnees pour recevoir des alertes instantanees.",
        ],
      },
      {
        title: "Banque au quotidien",
        items: [
          "Suivez vos revenus et depenses depuis le tableau de bord.",
          "Utilisez les outils de virement en quelques etapes.",
          "Consultez les insights avant de definir de nouveaux objectifs.",
        ],
      },
    ],
  },
  ar: {
    title: "أدلة الاستخدام",
    intro:
      "اعثر على أدلة عملية لاستخدام خدمات BH Bank بشكل أسرع وأكثر فعالية.",
    sections: [
      {
        title: "البدء",
        items: [
          "أنشئ حسابك وأكمل التحقق من ملفك الشخصي.",
          "أمّن حسابك بكلمة مرور قوية والمصادقة الثنائية.",
          "أضف بيانات الاتصال لتلقي تنبيهات فورية.",
        ],
      },
      {
        title: "الخدمات اليومية",
        items: [
          "تابع دخلك ومصاريفك من لوحة التحكم.",
          "استخدم أدوات التحويل لإرسال الأموال بخطوات قليلة.",
          "راجع الرؤى قبل تحديد أهداف جديدة.",
        ],
      },
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
  return <GenericInfoPage copy={userGuidesCopy} />;
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
