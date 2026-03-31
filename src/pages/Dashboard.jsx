import { useState } from "react";
import { Eye, EyeOff } from "lucide-react";
import { useTheme } from "../contexts/ThemeContext";
import { useLanguage } from "../contexts/LanguageContext";
import { ProfileSidebar } from "../components/ProfileSidebar";
import { BarChart, Bar, XAxis, ResponsiveContainer, Cell } from "recharts";

const spendingValues = [20, 40, 25, 35, 50, 30, 45, 55];

const monthLabelsByLanguage = {
  en: ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug"],
  fr: ["Jan", "Fev", "Mar", "Avr", "Mai", "Jui", "Jul", "Aou"],
  ar: ["ينا", "فبر", "مار", "أبر", "ماي", "يون", "يول", "أغس"],
};

const uiByLanguage = {
  en: {
    hideProfile: "Hide profile",
    showProfile: "Show profile",
    cardholder: "Cardholder",
    expires: "Expires",
    used: "used",
    monthly: "Monthly",
    yearly: "Yearly",
    shopping: "Shopping",
    groceries: "Groceries",
    dining: "Dining",
  },
  fr: {
    hideProfile: "Masquer le profil",
    showProfile: "Afficher le profil",
    cardholder: "Titulaire",
    expires: "Expiration",
    used: "utilise",
    monthly: "Par mois",
    yearly: "Par an",
    shopping: "Achats",
    groceries: "Epicerie",
    dining: "Restaurants",
  },
  ar: {
    hideProfile: "إخفاء الملف الشخصي",
    showProfile: "إظهار الملف الشخصي",
    cardholder: "صاحب البطاقة",
    expires: "تاريخ الانتهاء",
    used: "مستخدم",
    monthly: "شهري",
    yearly: "سنوي",
    shopping: "التسوق",
    groceries: "البقالة",
    dining: "المطاعم",
  },
};

const transactionTemplates = [
  {
    id: 1,
    name: "Apple Store",
    category: {
      en: "Shopping",
      fr: "Achats",
      ar: "التسوق",
    },
    amount: -1250,
    time: "17:42",
    color: "bg-blue-500",
  },
  {
    id: 2,
    name: "YouTube",
    category: {
      en: "Social media",
      fr: "Medias sociaux",
      ar: "وسائل التواصل",
    },
    amount: -45,
    time: "12:42",
    color: "bg-red-500",
  },
  {
    id: 3,
    name: "Netflix",
    category: {
      en: "Entertainment",
      fr: "Divertissement",
      ar: "الترفيه",
    },
    amount: -124,
    time: "21:22",
    color: "bg-purple-500",
  },
  {
    id: 4,
    name: "Spotify",
    category: {
      en: "Music",
      fr: "Musique",
      ar: "الموسيقى",
    },
    amount: -15,
    time: "08:15",
    color: "bg-green-500",
  },
];

export function Dashboard() {
  const { theme } = useTheme();
  const { language, t, isRTL } = useLanguage();
  const [showProfile, setShowProfile] = useState(true);
  const [showBalance, setShowBalance] = useState(true);
  const paymentLimitUsed = Math.round((2485 / 3000) * 100);
  const ui = uiByLanguage[language] || uiByLanguage.en;

  const monthLabels = monthLabelsByLanguage[language] || monthLabelsByLanguage.en;
  const spendingData = monthLabels.map((month, index) => ({
    month,
    value: spendingValues[index],
  }));

  const transactions = transactionTemplates.map((transaction) => ({
    ...transaction,
    category: transaction.category[language] || transaction.category.en,
  }));

  const topCategoryCards = [
    {
      amount: 328,
      label: ui.shopping,
      accent: "#3b82f6",
    },
    {
      amount: 240,
      label: ui.groceries,
      accent: "#14b8a6",
    },
    {
      amount: 203,
      label: ui.dining,
      accent: "#f97316",
    },
  ];

  const spendingBarPalette =
    theme === "dark"
      ? ["#1f3c88", "#1f4fa8", "#1f6bc9", "#2098dc", "#2db4ea", "#2388cc", "#2f6eb5", "#3b5ea3"]
      : ["#d5e4ff", "#bdd4ff", "#a1c1ff", "#86adff", "#6999ff", "#4d86f4", "#3b73df", "#2e5fc7"];

  return (
    <div className={`flex h-full ${isRTL ? "flex-row-reverse" : ""}`}>
      {/* Main Dashboard */}
      <div className={`flex-1 p-8 lg:p-8 space-y-5 ${isRTL ? "text-right" : ""}`}>
        {/* Header */}
        <div
          className={`flex items-center justify-between ${isRTL ? "flex-row-reverse" : ""}`}
        >
          <h1
            className={`text-3xl font-medium ${theme === "dark" ? "text-white" : "text-gray-900"}`}
          >
            {t("hello")}, Martin Bratik
          </h1>
          <button
            onClick={() => setShowProfile(!showProfile)}
            className={`px-4 py-2 text-sm border rounded-lg transition-colors ${theme === "dark" ? "border-gray-700 text-gray-300 hover:bg-gray-800" : "border-gray-300 text-gray-700 hover:bg-gray-50"}`}
            aria-label={showProfile ? ui.hideProfile : ui.showProfile}
          >
            {showProfile ? ui.hideProfile : ui.showProfile}
          </button>
        </div>

        {/* Balance and Top Categories Row */}
        {/* Balance Card */}
        <div className="space-y-2">
          <div className="flex items-center justify-between">
            <p
              className={`text-sm ${theme === "dark" ? "text-gray-400" : "text-gray-500"}`}
            >
              {t("totalBalance")}
            </p>
            <button onClick={() => setShowBalance(!showBalance)}>
              {showBalance ? (
                <Eye
                  className={`w-4 h-4 ${theme === "dark" ? "text-gray-500" : "text-gray-400"}`}
                />
              ) : (
                <EyeOff
                  className={`w-4 h-4 ${theme === "dark" ? "text-gray-500" : "text-gray-400"}`}
                />
              )}
            </button>
          </div>
          <h2
            className={`text-4xl font-semibold ${theme === "dark" ? "text-white" : "text-gray-900"}`}
          >
            {showBalance ? "3 048 TND" : "••••••"}
          </h2>
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {/* Credit Card */}
            <div className="relative overflow-hidden rounded-2xl border border-[#0A2240]/20 bg-linear-to-br from-[#0A2240] via-[#184068] to-[#0f6fa9] p-6 h-44 text-white shadow-xl shadow-[#0A2240]/20">
              <div className="absolute -top-8 right-8 h-24 w-24 rounded-full bg-white/10 blur-sm"></div>
              <div className="absolute -bottom-10 -right-6 h-28 w-28 rounded-full bg-cyan-200/20"></div>

              <div className="relative z-10 h-full flex flex-col justify-between">
                <div className="flex items-center justify-between">
                  <div className="h-8 w-11 rounded-md bg-white/25 ring-1 ring-white/20"></div>
                  <p className="text-[11px] font-semibold tracking-[0.2em] text-white/85">
                    BH BANK
                  </p>
                </div>

                <div>
                  <p className="text-lg tracking-[0.15em] mb-4 text-white/95">
                    5737 4677 4969 2698
                  </p>
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-[11px] text-white/70 uppercase tracking-wide">
                        {ui.cardholder}
                      </p>
                      <p className="text-sm font-medium">Martin Bratik</p>
                    </div>
                    <div>
                      <p className="text-[11px] text-white/70 uppercase tracking-wide">
                        {ui.expires}
                      </p>
                      <p className="text-sm font-medium">05/25</p>
                    </div>
                    <div className="h-8 w-10 rounded-md bg-white/20 ring-1 ring-white/20"></div>
                  </div>
                </div>
              </div>
            </div>

            {/* Payment Limit */}
            <div
              className={`rounded-2xl border p-5 ${
                theme === "dark"
                  ? "border-[#1f324f] bg-[#0f1a2b]"
                  : "border-[#d8e1ef] bg-[#f8fbff]"
              }`}
            >
              <div className="flex items-center justify-between mb-2">
                <p
                  className={`text-sm font-medium ${theme === "dark" ? "text-white" : "text-gray-900"}`}
                >
                  {t("paymentLimit")}
                </p>
                <p
                  className={`text-sm ${theme === "dark" ? "text-gray-400" : "text-gray-500"}`}
                >
                  2 485 TND / 3 000 TND
                </p>
              </div>
              <div
                className={`h-2.5 rounded-full overflow-hidden ${theme === "dark" ? "bg-[#243349]" : "bg-[#d8e0eb]"}`}
              >
                <div
                  className="h-full bg-linear-to-r from-[#0A2240] via-[#1d4ed8] to-[#14b8a6] rounded-full"
                  style={{ width: `${paymentLimitUsed}%` }}
                ></div>
              </div>
              <p
                className={`mt-2 text-xs font-medium ${
                  theme === "dark" ? "text-cyan-300" : "text-[#1d4ed8]"
                }`}
              >
                {paymentLimitUsed}% {ui.used}
              </p>
            </div>
          </div>

          {/* Top Categories and Spending */}
          <div className="space-y-4">
            {/* Top Categories */}
            <div>
              <h3
                className={`text-sm font-medium mb-4 ${theme === "dark" ? "text-white" : "text-gray-900"}`}
              >
                {t("topCategories")}
              </h3>
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                {topCategoryCards.map((category) => (
                  <div
                    key={category.label}
                    className={`rounded-xl border px-4 py-3 ${
                      theme === "dark"
                        ? "bg-gray-800 border-gray-700"
                        : "bg-white border-gray-200"
                    }`}
                  >
                    <div className="mb-2 flex items-center gap-2">
                      <span
                        className="h-2.5 w-2.5 rounded-full"
                        style={{ backgroundColor: category.accent }}
                      ></span>
                      <p
                        className={`text-xs ${theme === "dark" ? "text-gray-400" : "text-gray-500"}`}
                      >
                        {category.label}
                      </p>
                    </div>
                    <p
                      className={`text-base font-semibold ${theme === "dark" ? "text-white" : "text-gray-900"}`}
                    >
                      {category.amount} TND
                    </p>
                  </div>
                ))}
              </div>
            </div>

            {/* Monthly Spending Chart */}
            <div
              className={`${theme === "dark" ? "bg-gray-800 border-gray-700" : "bg-white border-gray-200"} border rounded-xl p-5`}
            >
              <div className="flex items-center justify-between mb-4">
                <div>
                  <p
                    className={`text-xs mb-1 ${theme === "dark" ? "text-gray-400" : "text-gray-500"}`}
                  >
                    {t("monthlySpending")}
                  </p>
                  <p
                    className={`text-xl font-semibold ${theme === "dark" ? "text-white" : "text-gray-900"}`}
                  >
                    1 025 TND
                  </p>
                </div>
                <div
                  className={`flex gap-2 border-b ${theme === "dark" ? "border-gray-700" : "border-gray-200"} ${isRTL ? "flex-row-reverse" : ""}`}
                >
                  <button
                    className={`px-3 py-1 text-sm border-b-2 ${theme === "dark" ? "border-white text-white" : "border-black text-black"}`}
                  >
                    {ui.monthly}
                  </button>
                  <button
                    className={`px-3 py-1 text-sm ${theme === "dark" ? "text-gray-500" : "text-gray-400"}`}
                  >
                    {ui.yearly}
                  </button>
                </div>
              </div>
              <ResponsiveContainer width="100%" height={120}>
                <BarChart data={spendingData}>
                  <XAxis
                    dataKey="month"
                    axisLine={false}
                    tickLine={false}
                    tick={{
                      fontSize: 10,
                      fill: theme === "dark" ? "#9CA3AF" : "#999",
                    }}
                  />
                  <Bar
                    dataKey="value"
                    radius={[4, 4, 0, 0]}
                  >
                    {spendingData.map((entry, index) => (
                      <Cell
                        key={`${entry.month}-${index}`}
                        fill={spendingBarPalette[index % spendingBarPalette.length]}
                      />
                    ))}
                  </Bar>
                </BarChart>
              </ResponsiveContainer>
            </div>
          </div>
        </div>

        {/* Last Transaction */}
        <div>
          <div className="flex items-center justify-between mb-4">
            <h3
              className={`text-lg font-medium ${theme === "dark" ? "text-white" : "text-gray-900"}`}
            >
              {t("lastTransactions")}
            </h3>
            <button
              className={`text-sm hover:underline ${theme === "dark" ? "text-gray-400 hover:text-gray-300" : "text-gray-500 hover:text-gray-700"}`}
            >
              {t("viewAll")}
            </button>
          </div>
          <div
            className={`${theme === "dark" ? "bg-gray-800 border-gray-700" : "bg-white border-gray-200"} border rounded-xl p-6`}
          >
            <div className="space-y-4">
              {transactions.map((transaction, index) => (
                <div key={transaction.id}>
                  <div
                    className={`flex items-center justify-between ${isRTL ? "flex-row-reverse" : ""}`}
                  >
                    <div
                      className={`flex items-center gap-4 ${isRTL ? "flex-row-reverse" : ""}`}
                    >
                      <div
                        className={`w-2 h-2 rounded-full ${transaction.color}`}
                      ></div>
                      <div>
                        <p
                          className={`font-medium ${theme === "dark" ? "text-white" : "text-gray-900"}`}
                        >
                          {transaction.name}
                        </p>
                        <p
                          className={`text-sm ${theme === "dark" ? "text-gray-400" : "text-gray-500"}`}
                        >
                          {transaction.category}
                        </p>
                      </div>
                    </div>
                    <div className={isRTL ? "text-left" : "text-right"}>
                      <p
                        className={`font-semibold ${transaction.amount < 0 ? "text-red-600" : "text-green-600"}`}
                      >
                        {transaction.amount < 0 ? "-" : "+"}
                        {Math.abs(transaction.amount)} TND
                      </p>
                      <p
                        className={`text-xs ${theme === "dark" ? "text-gray-500" : "text-gray-400"}`}
                      >
                        {transaction.time}
                      </p>
                    </div>
                  </div>
                  {index < transactions.length - 1 && (
                    <div
                      className={`mt-4 border-b ${theme === "dark" ? "border-gray-700" : "border-gray-100"}`}
                    ></div>
                  )}
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* Profile Sidebar */}
      <ProfileSidebar isVisible={showProfile} />
    </div>
  );
}
