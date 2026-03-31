import { useState } from "react";
import { ChevronDown } from "lucide-react";
import { useLanguage } from "../contexts/LanguageContext";
import { StaticPageLayout } from "../components/StaticPageLayout";

const faqData = {
  en: {
    title: "Frequently Asked Questions",
    categories: [
      {
        name: "Account",
        items: [
          {
            q: "How do I open an account with BH Bank?",
            a: "You can open an account online by clicking 'Access your space' and following the registration steps. You'll need a valid ID, proof of address, and a phone number. The process takes less than 10 minutes.",
          },
          {
            q: "How can I check my account balance?",
            a: "Log into your BH Bank dashboard. Your balance is displayed on the main screen. You can also view detailed breakdowns of income and expenses.",
          },
          {
            q: "Can I have multiple accounts?",
            a: "Yes, BH Bank allows you to manage multiple accounts (savings, current, joint) from a single dashboard. Contact support to add additional accounts.",
          },
        ],
      },
      {
        name: "Security",
        items: [
          {
            q: "Is my data safe with BH Bank?",
            a: "Yes. We use AES-256 encryption, two-factor authentication, and comply with international banking security standards. Your data is never shared with third parties without your consent.",
          },
          {
            q: "What should I do if I suspect unauthorized access?",
            a: "Immediately change your password and contact our support line at +216 71 126 000. We will lock your account and investigate the issue within 24 hours.",
          },
          {
            q: "How does two-factor authentication work?",
            a: "When you log in, you'll receive a one-time code via SMS or email. Enter this code to verify your identity. You can manage 2FA settings in your account preferences.",
          },
        ],
      },
      {
        name: "Transfers",
        items: [
          {
            q: "How do I make a bank transfer?",
            a: "Go to the Transfers section in your dashboard, enter the recipient's details and amount, then confirm. Transfers between BH Bank accounts are instant.",
          },
          {
            q: "Are there transfer limits?",
            a: "Daily transfer limits depend on your account type. Standard accounts have a 10,000 TND daily limit. Contact support to request a temporary increase.",
          },
          {
            q: "How long do international transfers take?",
            a: "International transfers typically take 2-5 business days depending on the destination country and receiving bank.",
          },
        ],
      },
    ],
  },
  fr: {
    title: "Questions fréquentes",
    categories: [
      {
        name: "Compte",
        items: [
          {
            q: "Comment ouvrir un compte chez BH Bank ?",
            a: "Vous pouvez ouvrir un compte en ligne en cliquant sur « Accéder à votre espace » et en suivant les étapes d'inscription. Vous aurez besoin d'une pièce d'identité valide, d'un justificatif de domicile et d'un numéro de téléphone. Le processus prend moins de 10 minutes.",
          },
          {
            q: "Comment consulter mon solde ?",
            a: "Connectez-vous à votre tableau de bord BH Bank. Votre solde est affiché sur l'écran principal. Vous pouvez également consulter le détail de vos revenus et dépenses.",
          },
          {
            q: "Puis-je avoir plusieurs comptes ?",
            a: "Oui, BH Bank vous permet de gérer plusieurs comptes (épargne, courant, joint) depuis un seul tableau de bord. Contactez le support pour ajouter des comptes supplémentaires.",
          },
        ],
      },
      {
        name: "Sécurité",
        items: [
          {
            q: "Mes données sont-elles en sécurité ?",
            a: "Oui. Nous utilisons le chiffrement AES-256, l'authentification à deux facteurs et respectons les normes internationales de sécurité bancaire. Vos données ne sont jamais partagées avec des tiers sans votre consentement.",
          },
          {
            q: "Que faire en cas d'accès non autorisé ?",
            a: "Changez immédiatement votre mot de passe et contactez notre ligne d'assistance au +216 71 126 000. Nous verrouillerons votre compte et enquêterons dans les 24 heures.",
          },
          {
            q: "Comment fonctionne la double authentification ?",
            a: "Lors de la connexion, vous recevrez un code unique par SMS ou e-mail. Saisissez ce code pour vérifier votre identité. Vous pouvez gérer la 2FA dans vos paramètres.",
          },
        ],
      },
      {
        name: "Virements",
        items: [
          {
            q: "Comment effectuer un virement ?",
            a: "Accédez à la section Virements de votre tableau de bord, entrez les coordonnées du destinataire et le montant, puis confirmez. Les virements entre comptes BH Bank sont instantanés.",
          },
          {
            q: "Y a-t-il des plafonds de virement ?",
            a: "Les plafonds journaliers dépendent du type de compte. Les comptes standard ont un plafond de 10 000 TND par jour. Contactez le support pour demander une augmentation temporaire.",
          },
          {
            q: "Combien de temps prend un virement international ?",
            a: "Les virements internationaux prennent généralement 2 à 5 jours ouvrables selon le pays de destination et la banque destinataire.",
          },
        ],
      },
    ],
  },
  ar: {
    title: "الأسئلة الشائعة",
    categories: [
      {
        name: "الحساب",
        items: [
          {
            q: "كيف أفتح حسابًا في BH Bank؟",
            a: "يمكنك فتح حساب عبر الإنترنت بالنقر على « الوصول إلى حسابك » واتباع خطوات التسجيل. ستحتاج إلى هوية سارية وإثبات عنوان ورقم هاتف. تستغرق العملية أقل من 10 دقائق.",
          },
          {
            q: "كيف يمكنني التحقق من رصيدي؟",
            a: "قم بتسجيل الدخول إلى لوحة التحكم الخاصة بك. يتم عرض رصيدك على الشاشة الرئيسية. يمكنك أيضًا عرض تفاصيل الدخل والمصاريف.",
          },
          {
            q: "هل يمكنني امتلاك حسابات متعددة؟",
            a: "نعم، يتيح لك BH Bank إدارة عدة حسابات (توفير، جاري، مشترك) من لوحة تحكم واحدة. اتصل بالدعم لإضافة حسابات إضافية.",
          },
        ],
      },
      {
        name: "الأمان",
        items: [
          {
            q: "هل بياناتي آمنة؟",
            a: "نعم. نستخدم تشفير AES-256 والمصادقة الثنائية ونلتزم بمعايير الأمان المصرفية الدولية. لا تتم مشاركة بياناتك مع أطراف ثالثة دون موافقتك.",
          },
          {
            q: "ماذا أفعل في حالة وصول غير مصرح به؟",
            a: "قم بتغيير كلمة المرور فورًا واتصل بخط الدعم على +216 71 126 000. سنقوم بقفل حسابك والتحقيق خلال 24 ساعة.",
          },
          {
            q: "كيف تعمل المصادقة الثنائية؟",
            a: "عند تسجيل الدخول، ستتلقى رمزًا لمرة واحدة عبر SMS أو البريد الإلكتروني. أدخل هذا الرمز للتحقق من هويتك. يمكنك إدارة إعدادات المصادقة الثنائية في تفضيلات حسابك.",
          },
        ],
      },
      {
        name: "التحويلات",
        items: [
          {
            q: "كيف أقوم بإجراء تحويل؟",
            a: "انتقل إلى قسم التحويلات في لوحة التحكم، أدخل تفاصيل المستلم والمبلغ، ثم قم بالتأكيد. التحويلات بين حسابات BH Bank فورية.",
          },
          {
            q: "هل هناك حدود للتحويل؟",
            a: "تعتمد حدود التحويل اليومية على نوع الحساب. الحسابات العادية لها حد يومي قدره 10,000 د.ت. اتصل بالدعم لطلب زيادة مؤقتة.",
          },
          {
            q: "كم يستغرق التحويل الدولي؟",
            a: "تستغرق التحويلات الدولية عادةً من 2 إلى 5 أيام عمل حسب بلد الوجهة والبنك المستلم.",
          },
        ],
      },
    ],
  },
};

function AccordionItem({ question, answer, isOpen, onToggle, isRTL }) {
  return (
    <div className="border-b border-gray-100 last:border-b-0">
      <button
        onClick={onToggle}
        className={`w-full flex items-center justify-between py-5 cursor-pointer group ${
          isRTL ? "flex-row-reverse text-right" : "text-left"
        }`}
      >
        <span className={`text-[15px] font-semibold ${isOpen ? "text-[#0A2240]" : "text-gray-900"} group-hover:text-[#0A2240] transition-colors pr-4`}>
          {question}
        </span>
        <ChevronDown
          className={`w-4 h-4 shrink-0 text-gray-400 transition-transform duration-300 ${
            isOpen ? "rotate-180 text-[#0A2240]" : ""
          }`}
        />
      </button>
      <div className={`overflow-hidden transition-all duration-300 ${isOpen ? "max-h-60 pb-5" : "max-h-0"}`}>
        <p className="text-sm text-gray-500 leading-relaxed">{answer}</p>
      </div>
    </div>
  );
}

export function FAQPage() {
  const { language, isRTL } = useLanguage();
  const data = faqData[language] || faqData.en;
  const [openItems, setOpenItems] = useState({});

  const toggleItem = (key) => {
    setOpenItems((prev) => ({ ...prev, [key]: !prev[key] }));
  };

  return (
    <StaticPageLayout title={data.title}>
      <div className="space-y-10">
        {data.categories.map((category, catIdx) => (
          <div key={catIdx}>
            <div className={`flex items-center gap-3 mb-6 ${isRTL ? "flex-row-reverse" : ""}`}>
              <div className="w-1 h-6 rounded-full bg-[#0A2240]" />
              <h2 className="text-lg font-bold text-gray-900">{category.name}</h2>
            </div>
            <div className="bg-surface-alt rounded-2xl border border-gray-100 px-6">
              {category.items.map((item, idx) => {
                const key = `${catIdx}-${idx}`;
                return (
                  <AccordionItem
                    key={key}
                    question={item.q}
                    answer={item.a}
                    isOpen={!!openItems[key]}
                    onToggle={() => toggleItem(key)}
                    isRTL={isRTL}
                  />
                );
              })}
            </div>
          </div>
        ))}
      </div>
    </StaticPageLayout>
  );
}
