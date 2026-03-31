import { useState } from "react";
import { Calculator, TrendingUp, PiggyBank, Info } from "lucide-react";
import { useTheme } from "../contexts/ThemeContext";
import { useLanguage } from "../contexts/LanguageContext";

const simulatorProducts = {
  credit: [
    {
      id: "personal",
      name: {
        fr: "Crédit Personnel",
        en: "Personal Loan",
        ar: "قرض شخصي",
      },
      rate: 5.9,
      minAmount: 1000,
      maxAmount: 50000,
      minDuration: 12,
      maxDuration: 84,
    },
    {
      id: "dhamen",
      name: {
        fr: "DHAMEN Crédit",
        en: "DHAMEN Credit",
        ar: "قرض DHAMEN",
      },
      rate: 5.5,
      minAmount: 5000,
      maxAmount: 100000,
      minDuration: 12,
      maxDuration: 120,
    },
    {
      id: "auto",
      name: {
        fr: "Crédit Auto",
        en: "Auto Loan",
        ar: "قرض سيارة",
      },
      rate: 6.2,
      minAmount: 5000,
      maxAmount: 75000,
      minDuration: 24,
      maxDuration: 84,
    },
    {
      id: "mortgage",
      name: {
        fr: "Crédit Immobilier",
        en: "Mortgage",
        ar: "قرض سكني",
      },
      rate: 4.5,
      minAmount: 20000,
      maxAmount: 500000,
      minDuration: 60,
      maxDuration: 300,
    },
    {
      id: "student",
      name: {
        fr: "Crédit Étudiant",
        en: "Student Loan",
        ar: "قرض طالب",
      },
      rate: 3.9,
      minAmount: 1000,
      maxAmount: 30000,
      minDuration: 12,
      maxDuration: 120,
    },
  ],
  savings: [
    {
      id: "pel",
      name: {
        fr: "PEL Classique",
        en: "Classic PEL",
        ar: "PEL كلاسيكي",
      },
      rate: 2.5,
      minAmount: 100,
      maxAmount: 100000,
      minDuration: 12,
      maxDuration: 180,
    },
    {
      id: "premium",
      name: {
        fr: "Compte Épargne Premium",
        en: "Premium Savings",
        ar: "حساب ادخار مميز",
      },
      rate: 3.0,
      minAmount: 500,
      maxAmount: 200000,
      minDuration: 1,
      maxDuration: 120,
    },
    {
      id: "retirement",
      name: {
        fr: "Plan Retraite",
        en: "Retirement Plan",
        ar: "خطة تقاعد",
      },
      rate: 4.0,
      minAmount: 1000,
      maxAmount: 500000,
      minDuration: 60,
      maxDuration: 360,
    },
    {
      id: "term",
      name: {
        fr: "Compte à Terme",
        en: "Term Deposit",
        ar: "وديعة لاجل",
      },
      rate: 3.5,
      minAmount: 1000,
      maxAmount: 100000,
      minDuration: 3,
      maxDuration: 60,
    },
  ],
};

const uiByLanguage = {
  en: {
    title: "Financial Simulator",
    subtitle: "Calculate your loan payments or savings gains",
    loan: "Loan",
    savings: "Savings",
    parameters: "Parameters",
    customize: "Customize your simulation",
    product: "Product",
    conditions: "Product conditions",
    rate: "Rate",
    amount: "Amount",
    duration: "Duration",
    months: "months",
    amountInput: "Amount (TND)",
    durationInput: "Duration (months)",
    results: "Results",
    monthlyPayment: "Monthly Payment",
    totalCost: "Total Cost",
    totalInterest: "Total Interest",
    finalAmount: "Final Amount",
    interestEarned: "Interest Earned",
    annualRate: "Annual Rate",
    amortization: "Amortization Table",
    hide: "Hide",
    show: "Show",
    month: "Month",
    payment: "Payment",
    principal: "Principal",
    interest: "Interest",
    remaining: "Remaining",
    monthsRemaining: (value) => `... ${value} months remaining`,
  },
  fr: {
    title: "Simulateur Financier",
    subtitle: "Calculez vos mensualités de crédit ou vos gains d'épargne",
    loan: "Crédit",
    savings: "Épargne",
    parameters: "Paramètres",
    customize: "Personnalisez votre simulation",
    product: "Produit",
    conditions: "Conditions du produit",
    rate: "Taux",
    amount: "Montant",
    duration: "Durée",
    months: "mois",
    amountInput: "Montant (TND)",
    durationInput: "Durée (mois)",
    results: "Résultats",
    monthlyPayment: "Mensualité",
    totalCost: "Coût total",
    totalInterest: "Intérêts totaux",
    finalAmount: "Montant final",
    interestEarned: "Intérêts gagnés",
    annualRate: "Taux annuel",
    amortization: "Tableau d'amortissement",
    hide: "Masquer",
    show: "Afficher",
    month: "Mois",
    payment: "Mensualité",
    principal: "Capital",
    interest: "Intérêts",
    remaining: "Reste",
    monthsRemaining: (value) => `... ${value} mois restants`,
  },
  ar: {
    title: "المحاكي المالي",
    subtitle: "احسب قسط القرض الشهري او عائدات الادخار",
    loan: "قرض",
    savings: "ادخار",
    parameters: "الاعدادات",
    customize: "قم بتخصيص المحاكاة",
    product: "المنتج",
    conditions: "شروط المنتج",
    rate: "النسبة",
    amount: "المبلغ",
    duration: "المدة",
    months: "شهر",
    amountInput: "المبلغ (TND)",
    durationInput: "المدة (بالاشهر)",
    results: "النتائج",
    monthlyPayment: "القسط الشهري",
    totalCost: "الكلفة الاجمالية",
    totalInterest: "اجمالي الفوائد",
    finalAmount: "المبلغ النهائي",
    interestEarned: "الفوائد المكتسبة",
    annualRate: "النسبة السنوية",
    amortization: "جدول السداد",
    hide: "اخفاء",
    show: "اظهار",
    month: "الشهر",
    payment: "الدفعة",
    principal: "اصل الدين",
    interest: "الفائدة",
    remaining: "المتبقي",
    monthsRemaining: (value) => `... متبقي ${value} شهر`,
  },
};

export function Simulator() {
  const { theme } = useTheme();
  const { language, isRTL } = useLanguage();
  const langKey = language === "ar" ? "ar" : language === "fr" ? "fr" : "en";
  const ui = uiByLanguage[langKey] || uiByLanguage.en;
  const [simulatorType, setSimulatorType] = useState("credit");
  const [selectedProduct, setSelectedProduct] = useState(
    simulatorProducts.credit[0],
  );
  const [amount, setAmount] = useState(10000);
  const [duration, setDuration] = useState(36);
  const [showAmortization, setShowAmortization] = useState(false);

  const products = simulatorProducts[simulatorType];

  // Calculate monthly payment and total for credit
  const calculateCredit = () => {
    const monthlyRate = selectedProduct.rate / 100 / 12;
    const monthlyPayment =
      (amount * monthlyRate * Math.pow(1 + monthlyRate, duration)) /
      (Math.pow(1 + monthlyRate, duration) - 1);
    const totalAmount = monthlyPayment * duration;
    const totalInterest = totalAmount - amount;

    return {
      monthlyPayment: monthlyPayment.toFixed(2),
      totalAmount: totalAmount.toFixed(2),
      totalInterest: totalInterest.toFixed(2),
    };
  };

  // Calculate total for savings
  const calculateSavings = () => {
    const monthlyRate = selectedProduct.rate / 100 / 12;
    const totalAmount = amount * Math.pow(1 + monthlyRate, duration);
    const totalInterest = totalAmount - amount;

    return {
      totalAmount: totalAmount.toFixed(2),
      totalInterest: totalInterest.toFixed(2),
      finalRate: selectedProduct.rate,
    };
  };

  // Generate amortization table
  const generateAmortizationTable = () => {
    if (simulatorType !== "credit") return [];

    const monthlyRate = selectedProduct.rate / 100 / 12;
    const monthlyPayment = parseFloat(calculateCredit().monthlyPayment);
    let remainingCapital = amount;
    const table = [];

    for (let month = 1; month <= Math.min(duration, 12); month++) {
      const interest = remainingCapital * monthlyRate;
      const principal = monthlyPayment - interest;
      remainingCapital -= principal;

      table.push({
        month,
        monthlyPayment: monthlyPayment.toFixed(2),
        principal: principal.toFixed(2),
        interest: interest.toFixed(2),
        remainingCapital: Math.max(0, remainingCapital).toFixed(2),
      });
    }

    return table;
  };

  const results =
    simulatorType === "credit" ? calculateCredit() : calculateSavings();
  const amortizationTable = generateAmortizationTable();

  const handleProductChange = (productId) => {
    const product = products.find((p) => p.id === productId);
    setSelectedProduct(product);
    setAmount(product.minAmount);
    setDuration(product.minDuration);
  };

  return (
    <div
      className={`p-4 lg:p-8 space-y-6 ${theme === "dark" ? "bg-gray-900" : "bg-white"} ${isRTL ? "text-right" : "text-left"}`}
    >
      {/* Header */}
      <div>
        <h1
          className={`text-2xl font-semibold mb-2 ${theme === "dark" ? "text-white" : "text-gray-900"}`}
        >
          {ui.title}
        </h1>
        <p
          className={`${theme === "dark" ? "text-gray-400" : "text-gray-600"}`}
        >
          {ui.subtitle}
        </p>
      </div>

      {/* Simulator Type Toggle */}
      <div className={`flex gap-4 ${isRTL ? "flex-row-reverse" : ""}`}>
        <button
          onClick={() => {
            setSimulatorType("credit");
            setSelectedProduct(simulatorProducts.credit[0]);
            setAmount(simulatorProducts.credit[0].minAmount);
            setDuration(simulatorProducts.credit[0].minDuration);
          }}
          className={`flex items-center gap-2 px-6 py-3 rounded-lg transition-all ${isRTL ? "flex-row-reverse" : ""} ${
            simulatorType === "credit"
              ? "bg-[#242f54] text-white shadow-lg"
              : theme === "dark"
                ? "bg-gray-800 text-gray-300 hover:bg-gray-700"
                : "bg-white text-gray-700 hover:bg-gray-50 border border-gray-200"
          }`}
        >
          <TrendingUp className="w-5 h-5" />
          <span className="font-medium">{ui.loan}</span>
        </button>
        <button
          onClick={() => {
            setSimulatorType("savings");
            setSelectedProduct(simulatorProducts.savings[0]);
            setAmount(simulatorProducts.savings[0].minAmount);
            setDuration(simulatorProducts.savings[0].minDuration);
          }}
          className={`flex items-center gap-2 px-6 py-3 rounded-lg transition-all ${isRTL ? "flex-row-reverse" : ""} ${
            simulatorType === "savings"
              ? "bg-[#242f54] text-white shadow-lg"
              : theme === "dark"
                ? "bg-gray-800 text-gray-300 hover:bg-gray-700"
                : "bg-white text-gray-700 hover:bg-gray-50 border border-gray-200"
          }`}
        >
          <PiggyBank className="w-5 h-5" />
          <span className="font-medium">{ui.savings}</span>
        </button>
      </div>

      <div className="grid lg:grid-cols-2 gap-6">
        {/* Input Section */}
        <div
          className={`${theme === "dark" ? "bg-gray-800 border-gray-700" : "bg-white border-gray-200"} border rounded-xl p-6 space-y-6`}
        >
          <div className={`flex items-center gap-3 ${isRTL ? "flex-row-reverse" : ""}`}>
            <div className="w-12 h-12 bg-[#242f54] rounded-lg flex items-center justify-center">
              <Calculator className="w-6 h-6 text-white" />
            </div>
            <div>
              <h2
                className={`font-semibold text-lg ${theme === "dark" ? "text-white" : "text-gray-900"}`}
              >
                {ui.parameters}
              </h2>
              <p
                className={`text-sm ${theme === "dark" ? "text-gray-400" : "text-gray-600"}`}
              >
                {ui.customize}
              </p>
            </div>
          </div>

          {/* Product Selection */}
          <div>
            <label
              className={`block text-sm font-medium mb-2 ${theme === "dark" ? "text-gray-300" : "text-gray-700"}`}
            >
              {ui.product}
            </label>
            <select
              value={selectedProduct.id}
              onChange={(e) => handleProductChange(e.target.value)}
              className={`w-full px-4 py-3 border rounded-lg focus:outline-none focus:ring-2 focus:ring-[#242f54] ${
                theme === "dark"
                  ? "bg-gray-700 border-gray-600 text-white"
                  : "bg-gray-50 border-gray-300 text-gray-900"
              } ${isRTL ? "text-right" : "text-left"}`}
            >
              {products.map((product) => (
                <option key={product.id} value={product.id}>
                  {product.name[langKey] || product.name.en} - {product.rate}%
                </option>
              ))}
            </select>
          </div>

          {/* Product Details */}
          <div
            className={`${theme === "dark" ? "bg-gray-700" : "bg-blue-50"} p-4 rounded-lg space-y-2`}
          >
            <div className={`flex items-center gap-2 mb-2 ${isRTL ? "flex-row-reverse" : ""}`}>
              <Info
                className={`w-4 h-4 ${theme === "dark" ? "text-blue-400" : "text-blue-600"}`}
              />
              <span
                className={`text-sm font-medium ${theme === "dark" ? "text-white" : "text-gray-900"}`}
              >
                {ui.conditions}
              </span>
            </div>
            <p
              className={`text-xs ${theme === "dark" ? "text-gray-300" : "text-gray-700"}`}
            >
              {ui.rate}:{" "}
              <strong>{selectedProduct.rate}%</strong>
            </p>
            <p
              className={`text-xs ${theme === "dark" ? "text-gray-300" : "text-gray-700"}`}
            >
              {ui.amount}:{" "}
              <strong>
                {selectedProduct.minAmount} - {selectedProduct.maxAmount} TND
              </strong>
            </p>
            <p
              className={`text-xs ${theme === "dark" ? "text-gray-300" : "text-gray-700"}`}
            >
              {ui.duration}:{" "}
              <strong>
                {selectedProduct.minDuration} - {selectedProduct.maxDuration}{" "}
                {ui.months}
              </strong>
            </p>
          </div>

          {/* Amount Input */}
          <div>
            <label
              className={`block text-sm font-medium mb-2 ${theme === "dark" ? "text-gray-300" : "text-gray-700"}`}
            >
              {ui.amountInput}
            </label>
            <input
              type="number"
              value={amount}
              onChange={(e) =>
                setAmount(
                  Math.max(
                    selectedProduct.minAmount,
                    Math.min(
                      selectedProduct.maxAmount,
                      parseInt(e.target.value) || 0,
                    ),
                  ),
                )
              }
              min={selectedProduct.minAmount}
              max={selectedProduct.maxAmount}
              className={`w-full px-4 py-3 border rounded-lg focus:outline-none focus:ring-2 focus:ring-[#242f54] ${
                theme === "dark"
                  ? "bg-gray-700 border-gray-600 text-white"
                  : "bg-gray-50 border-gray-300 text-gray-900"
              } ${isRTL ? "text-right" : "text-left"}`}
            />
            <input
              type="range"
              value={amount}
              onChange={(e) => setAmount(parseInt(e.target.value))}
              min={selectedProduct.minAmount}
              max={selectedProduct.maxAmount}
              step={100}
              className="w-full mt-2"
            />
          </div>

          {/* Duration Input */}
          <div>
            <label
              className={`block text-sm font-medium mb-2 ${theme === "dark" ? "text-gray-300" : "text-gray-700"}`}
            >
              {ui.durationInput}
            </label>
            <input
              type="number"
              value={duration}
              onChange={(e) =>
                setDuration(
                  Math.max(
                    selectedProduct.minDuration,
                    Math.min(
                      selectedProduct.maxDuration,
                      parseInt(e.target.value) || 0,
                    ),
                  ),
                )
              }
              min={selectedProduct.minDuration}
              max={selectedProduct.maxDuration}
              className={`w-full px-4 py-3 border rounded-lg focus:outline-none focus:ring-2 focus:ring-[#242f54] ${
                theme === "dark"
                  ? "bg-gray-700 border-gray-600 text-white"
                  : "bg-gray-50 border-gray-300 text-gray-900"
              } ${isRTL ? "text-right" : "text-left"}`}
            />
            <input
              type="range"
              value={duration}
              onChange={(e) => setDuration(parseInt(e.target.value))}
              min={selectedProduct.minDuration}
              max={selectedProduct.maxDuration}
              className="w-full mt-2"
            />
          </div>
        </div>

        {/* Results Section */}
        <div className="space-y-6">
          {/* Summary Card */}
          <div
            className={`${theme === "dark" ? "bg-gray-800 border-gray-700" : "bg-white border-gray-200"} border rounded-xl p-6`}
          >
            <h3
              className={`font-semibold mb-6 ${theme === "dark" ? "text-white" : "text-gray-900"}`}
            >
              {ui.results}
            </h3>

            {simulatorType === "credit" ? (
              <div className="space-y-4">
                <div
                  className={`${theme === "dark" ? "bg-gray-700" : "bg-gray-50"} p-4 rounded-lg`}
                >
                  <p
                    className={`text-sm mb-1 ${theme === "dark" ? "text-gray-400" : "text-gray-600"}`}
                  >
                    {ui.monthlyPayment}
                  </p>
                  <p
                    className={`text-3xl font-bold ${theme === "dark" ? "text-white" : "text-gray-900"}`}
                  >
                    {results.monthlyPayment} TND
                  </p>
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div
                    className={`${theme === "dark" ? "bg-gray-700" : "bg-gray-50"} p-4 rounded-lg`}
                  >
                    <p
                      className={`text-xs mb-1 ${theme === "dark" ? "text-gray-400" : "text-gray-600"}`}
                    >
                      {ui.totalCost}
                    </p>
                    <p
                      className={`text-xl font-semibold ${theme === "dark" ? "text-white" : "text-gray-900"}`}
                    >
                      {results.totalAmount} TND
                    </p>
                  </div>

                  <div
                    className={`${theme === "dark" ? "bg-gray-700" : "bg-gray-50"} p-4 rounded-lg`}
                  >
                    <p
                      className={`text-xs mb-1 ${theme === "dark" ? "text-gray-400" : "text-gray-600"}`}
                    >
                      {ui.totalInterest}
                    </p>
                    <p className={`text-xl font-semibold text-red-600`}>
                      {results.totalInterest} TND
                    </p>
                  </div>
                </div>
              </div>
            ) : (
              <div className="space-y-4">
                <div
                  className={`${theme === "dark" ? "bg-gray-700" : "bg-gray-50"} p-4 rounded-lg`}
                >
                  <p
                    className={`text-sm mb-1 ${theme === "dark" ? "text-gray-400" : "text-gray-600"}`}
                  >
                    {ui.finalAmount}
                  </p>
                  <p className={`text-3xl font-bold text-green-600`}>
                    {results.totalAmount} TND
                  </p>
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div
                    className={`${theme === "dark" ? "bg-gray-700" : "bg-gray-50"} p-4 rounded-lg`}
                  >
                    <p
                      className={`text-xs mb-1 ${theme === "dark" ? "text-gray-400" : "text-gray-600"}`}
                    >
                      {ui.interestEarned}
                    </p>
                    <p className={`text-xl font-semibold text-green-600`}>
                      +{results.totalInterest} TND
                    </p>
                  </div>

                  <div
                    className={`${theme === "dark" ? "bg-gray-700" : "bg-gray-50"} p-4 rounded-lg`}
                  >
                    <p
                      className={`text-xs mb-1 ${theme === "dark" ? "text-gray-400" : "text-gray-600"}`}
                    >
                      {ui.annualRate}
                    </p>
                    <p
                      className={`text-xl font-semibold ${theme === "dark" ? "text-white" : "text-gray-900"}`}
                    >
                      {results.finalRate}%
                    </p>
                  </div>
                </div>
              </div>
            )}
          </div>

          {/* Amortization Table for Credit */}
          {simulatorType === "credit" && (
            <div
              className={`${theme === "dark" ? "bg-gray-800 border-gray-700" : "bg-white border-gray-200"} border rounded-xl p-6`}
            >
              <div className="flex items-center justify-between mb-4">
                <h3
                  className={`font-semibold ${theme === "dark" ? "text-white" : "text-gray-900"}`}
                >
                  {ui.amortization}
                </h3>
                <button
                  onClick={() => setShowAmortization(!showAmortization)}
                  className={`text-sm px-3 py-1 rounded ${
                    theme === "dark"
                      ? "bg-gray-700 text-gray-300 hover:bg-gray-600"
                      : "bg-gray-100 text-gray-700 hover:bg-gray-200"
                  }`}
                >
                  {showAmortization ? ui.hide : ui.show}
                </button>
              </div>

              {showAmortization && (
                <div className="overflow-x-auto">
                  <table className="w-full text-sm">
                    <thead>
                      <tr
                        className={`border-b ${theme === "dark" ? "border-gray-700" : "border-gray-200"}`}
                      >
                        <th
                          className={`${isRTL ? "text-right" : "text-left"} py-2 ${theme === "dark" ? "text-gray-400" : "text-gray-600"}`}
                        >
                          {ui.month}
                        </th>
                        <th
                          className={`text-right py-2 ${theme === "dark" ? "text-gray-400" : "text-gray-600"}`}
                        >
                          {ui.payment}
                        </th>
                        <th
                          className={`text-right py-2 ${theme === "dark" ? "text-gray-400" : "text-gray-600"}`}
                        >
                          {ui.principal}
                        </th>
                        <th
                          className={`text-right py-2 ${theme === "dark" ? "text-gray-400" : "text-gray-600"}`}
                        >
                          {ui.interest}
                        </th>
                        <th
                          className={`text-right py-2 ${theme === "dark" ? "text-gray-400" : "text-gray-600"}`}
                        >
                          {ui.remaining}
                        </th>
                      </tr>
                    </thead>
                    <tbody>
                      {amortizationTable.map((row) => (
                        <tr
                          key={row.month}
                          className={`border-b ${theme === "dark" ? "border-gray-700" : "border-gray-100"}`}
                        >
                          <td
                            className={`${isRTL ? "text-right" : "text-left"} py-2 ${theme === "dark" ? "text-white" : "text-gray-900"}`}
                          >
                            {row.month}
                          </td>
                          <td
                            className={`text-right py-2 ${theme === "dark" ? "text-white" : "text-gray-900"}`}
                          >
                            {row.monthlyPayment} TND
                          </td>
                          <td
                            className={`text-right py-2 ${theme === "dark" ? "text-green-400" : "text-green-600"}`}
                          >
                            {row.principal} TND
                          </td>
                          <td
                            className={`text-right py-2 ${theme === "dark" ? "text-red-400" : "text-red-600"}`}
                          >
                            {row.interest} TND
                          </td>
                          <td
                            className={`text-right py-2 ${theme === "dark" ? "text-gray-300" : "text-gray-700"}`}
                          >
                            {row.remainingCapital} TND
                          </td>
                        </tr>
                      ))}
                      {duration > 12 && (
                        <tr>
                          <td
                            colSpan={5}
                            className={`text-center py-2 text-xs ${theme === "dark" ? "text-gray-500" : "text-gray-400"}`}
                          >
                            {ui.monthsRemaining(duration - 12)}
                          </td>
                        </tr>
                      )}
                    </tbody>
                  </table>
                </div>
              )}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
