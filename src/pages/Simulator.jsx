import { useState } from "react";
import { Calculator, PiggyBank, TrendingUp, AlertCircle } from "lucide-react";
import { useTheme } from "../contexts/ThemeContext";
import { useLanguage } from "../contexts/LanguageContext";
import { savingsProjection, simulateLoan } from "../api";

const formatAmount = (value) =>
  `${new Intl.NumberFormat("fr-TN", {
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  }).format(Number(value || 0))} TND`;

export function Simulator() {
  const { theme } = useTheme();
  const { isRTL } = useLanguage();
  const isDark = theme === "dark";

  const [mode, setMode] = useState("loan");
  const [amount, setAmount] = useState(10000);
  const [durationMonths, setDurationMonths] = useState(36);
  const [annualRate, setAnnualRate] = useState(8.5);
  const [monthlyDeposit, setMonthlyDeposit] = useState(500);
  const [years, setYears] = useState(5);

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [result, setResult] = useState(null);

  const runSimulation = async () => {
    try {
      setLoading(true);
      setError("");
      setResult(null);

      if (mode === "loan") {
        const data = await simulateLoan({
          amount: Number(amount),
          duration_months: Number(durationMonths),
          annual_rate: Number(annualRate),
        });
        setResult(data);
      } else {
        const data = await savingsProjection({
          initial_amount: Number(amount),
          monthly_deposit: Number(monthlyDeposit),
          annual_rate: Number(annualRate),
          years: Number(years),
        });
        setResult(data);
      }
    } catch (err) {
      setError(err.message || "Simulation impossible.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div
      className={`min-h-full space-y-6 p-4 lg:p-8 ${
        isDark ? "bg-gray-900 text-white" : "bg-white text-gray-900"
      } ${isRTL ? "text-right" : "text-left"}`}
    >
      <div>
        <h1 className="text-2xl font-semibold lg:text-3xl">Financial Simulator</h1>
        <p className={isDark ? "text-gray-400" : "text-gray-600"}>
          Calculs executes cote backend pour garantir la coherence metier.
        </p>
      </div>

      <div className="flex gap-3">
        <button
          type="button"
          onClick={() => setMode("loan")}
          className={`inline-flex items-center gap-2 rounded-lg px-4 py-2 ${
            mode === "loan"
              ? "bg-[#0A2240] text-white"
              : isDark
                ? "bg-gray-800 text-gray-300"
                : "bg-gray-100 text-gray-700"
          } ${isRTL ? "flex-row-reverse" : ""}`}
        >
          <TrendingUp className="h-4 w-4" />
          Loan
        </button>
        <button
          type="button"
          onClick={() => setMode("savings")}
          className={`inline-flex items-center gap-2 rounded-lg px-4 py-2 ${
            mode === "savings"
              ? "bg-[#0A2240] text-white"
              : isDark
                ? "bg-gray-800 text-gray-300"
                : "bg-gray-100 text-gray-700"
          } ${isRTL ? "flex-row-reverse" : ""}`}
        >
          <PiggyBank className="h-4 w-4" />
          Savings
        </button>
      </div>

      <div className="grid gap-6 lg:grid-cols-2">
        <section className={`rounded-xl border p-5 ${isDark ? "border-gray-700 bg-gray-800" : "border-gray-200 bg-white"}`}>
          <div className={`mb-4 flex items-center gap-2 ${isRTL ? "flex-row-reverse" : ""}`}>
            <Calculator className="h-5 w-5" />
            <h2 className="text-lg font-semibold">Input</h2>
          </div>

          <div className="space-y-4">
            <label className="block text-sm">
              <span className="mb-1 block">Amount (TND)</span>
              <input
                type="number"
                value={amount}
                onChange={(event) => setAmount(event.target.value)}
                className={`w-full rounded-lg border px-3 py-2 ${
                  isDark ? "border-gray-600 bg-gray-700" : "border-gray-300 bg-white"
                } ${isRTL ? "text-right" : "text-left"}`}
              />
            </label>

            <label className="block text-sm">
              <span className="mb-1 block">Annual rate (%)</span>
              <input
                type="number"
                value={annualRate}
                onChange={(event) => setAnnualRate(event.target.value)}
                className={`w-full rounded-lg border px-3 py-2 ${
                  isDark ? "border-gray-600 bg-gray-700" : "border-gray-300 bg-white"
                } ${isRTL ? "text-right" : "text-left"}`}
              />
            </label>

            {mode === "loan" ? (
              <label className="block text-sm">
                <span className="mb-1 block">Duration (months)</span>
                <input
                  type="number"
                  value={durationMonths}
                  onChange={(event) => setDurationMonths(event.target.value)}
                  className={`w-full rounded-lg border px-3 py-2 ${
                    isDark ? "border-gray-600 bg-gray-700" : "border-gray-300 bg-white"
                  } ${isRTL ? "text-right" : "text-left"}`}
                />
              </label>
            ) : (
              <>
                <label className="block text-sm">
                  <span className="mb-1 block">Monthly deposit (TND)</span>
                  <input
                    type="number"
                    value={monthlyDeposit}
                    onChange={(event) => setMonthlyDeposit(event.target.value)}
                    className={`w-full rounded-lg border px-3 py-2 ${
                      isDark ? "border-gray-600 bg-gray-700" : "border-gray-300 bg-white"
                    } ${isRTL ? "text-right" : "text-left"}`}
                  />
                </label>
                <label className="block text-sm">
                  <span className="mb-1 block">Years</span>
                  <input
                    type="number"
                    value={years}
                    onChange={(event) => setYears(event.target.value)}
                    className={`w-full rounded-lg border px-3 py-2 ${
                      isDark ? "border-gray-600 bg-gray-700" : "border-gray-300 bg-white"
                    } ${isRTL ? "text-right" : "text-left"}`}
                  />
                </label>
              </>
            )}

            <button
              type="button"
              onClick={runSimulation}
              disabled={loading}
              className="w-full rounded-lg bg-[#0A2240] px-4 py-2.5 text-white hover:bg-[#12305b] disabled:opacity-60"
            >
              {loading ? "Calcul..." : "Run simulation"}
            </button>
          </div>
        </section>

        <section className={`rounded-xl border p-5 ${isDark ? "border-gray-700 bg-gray-800" : "border-gray-200 bg-white"}`}>
          <h2 className="mb-4 text-lg font-semibold">Results</h2>

          {error && (
            <div
              className={`mb-4 flex items-center gap-2 rounded-lg border p-3 text-sm ${
                isDark
                  ? "border-red-800 bg-red-950/30 text-red-300"
                  : "border-red-200 bg-red-50 text-red-700"
              }`}
            >
              <AlertCircle className="h-4 w-4" />
              {error}
            </div>
          )}

          {!result && !error && <p className={isDark ? "text-gray-400" : "text-gray-600"}>Run a simulation to view backend results.</p>}

          {result && mode === "loan" && (
            <div className="space-y-3 text-sm">
              <p>Monthly payment: <span className="font-semibold">{formatAmount(result.monthly_payment)}</span></p>
              <p>Total cost: <span className="font-semibold">{formatAmount(result.total_cost)}</span></p>
              <p>Total interest: <span className="font-semibold">{formatAmount(result.total_interest)}</span></p>
              <p>Duration: <span className="font-semibold">{result.duration_months} months</span></p>
            </div>
          )}

          {result && mode === "savings" && (
            <div className="space-y-3 text-sm">
              <p>Final balance: <span className="font-semibold">{formatAmount(result.final_balance)}</span></p>
              <p>Total deposited: <span className="font-semibold">{formatAmount(result.total_deposited)}</span></p>
              <p>Total interest: <span className="font-semibold">{formatAmount(result.total_interest)}</span></p>
              <p>Projection points: <span className="font-semibold">{Array.isArray(result.projections) ? result.projections.length : 0}</span></p>
            </div>
          )}
        </section>
      </div>
    </div>
  );
}
