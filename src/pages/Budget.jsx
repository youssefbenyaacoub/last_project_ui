import { useEffect, useMemo, useState } from "react";
import { Plus, Save, AlertCircle } from "lucide-react";
import { useTheme } from "../contexts/ThemeContext";
import { useLanguage } from "../contexts/LanguageContext";
import { getBudget, upsertBudget } from "../api";

const currentMonth = () => new Date().toISOString().slice(0, 7);

const formatAmount = (value) => `${new Intl.NumberFormat("fr-TN").format(Number(value || 0))} TND`;

export function Budget() {
  const { theme } = useTheme();
  const { isRTL } = useLanguage();
  const isDark = theme === "dark";

  const [month, setMonth] = useState(currentMonth());
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState("");
  const [feedback, setFeedback] = useState("");

  const loadBudget = async (targetMonth) => {
    try {
      setLoading(true);
      setError("");
      const data = await getBudget(targetMonth);
      setCategories(Array.isArray(data?.categories) ? data.categories : []);
    } catch (err) {
      setError(err.message || "Impossible de charger le budget.");
      setCategories([]);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadBudget(month);
  }, [month]);

  const totals = useMemo(() => {
    const budget = categories.reduce((sum, item) => sum + Number(item.budget || 0), 0);
    const spent = categories.reduce((sum, item) => sum + Number(item.spent || 0), 0);
    return {
      budget,
      spent,
      remaining: budget - spent,
    };
  }, [categories]);

  const updateCategory = (index, field, value) => {
    setCategories((prev) => {
      const next = [...prev];
      next[index] = {
        ...next[index],
        [field]: field === "category" ? value : Number(value),
      };
      return next;
    });
  };

  const addCategory = () => {
    setCategories((prev) => [...prev, { category: "", budget: 0, spent: 0 }]);
  };

  const saveBudget = async () => {
    try {
      setSaving(true);
      setError("");
      setFeedback("");

      const payload = {
        month,
        categories: categories
          .filter((item) => String(item.category || "").trim().length > 0)
          .map((item) => ({
            category: item.category,
            budget: Number(item.budget || 0),
            spent: Number(item.spent || 0),
          })),
      };

      await upsertBudget(payload);
      setFeedback("Budget sauvegarde avec succes.");
      await loadBudget(month);
    } catch (err) {
      setError(err.message || "Echec de sauvegarde du budget.");
    } finally {
      setSaving(false);
    }
  };

  return (
    <div
      className={`min-h-full space-y-6 p-4 lg:p-8 ${
        isDark ? "bg-gray-900 text-white" : "bg-gray-50 text-gray-900"
      } ${isRTL ? "text-right" : "text-left"}`}
    >
      <div>
        <h1 className="text-2xl font-semibold lg:text-3xl">Budget Planner</h1>
        <p className={isDark ? "text-gray-400" : "text-gray-600"}>
          Donnees budgetaires synchronisees avec /api/auth/budget.
        </p>
      </div>

      <div className={`grid gap-4 md:grid-cols-4 ${isRTL ? "text-right" : "text-left"}`}>
        <div className={`rounded-xl border p-4 ${isDark ? "border-gray-700 bg-gray-800" : "border-gray-200 bg-white"}`}>
          <p className={isDark ? "text-gray-400" : "text-gray-500"}>Total budget</p>
          <p className="mt-1 text-xl font-semibold">{formatAmount(totals.budget)}</p>
        </div>
        <div className={`rounded-xl border p-4 ${isDark ? "border-gray-700 bg-gray-800" : "border-gray-200 bg-white"}`}>
          <p className={isDark ? "text-gray-400" : "text-gray-500"}>Total spent</p>
          <p className="mt-1 text-xl font-semibold">{formatAmount(totals.spent)}</p>
        </div>
        <div className={`rounded-xl border p-4 ${isDark ? "border-gray-700 bg-gray-800" : "border-gray-200 bg-white"}`}>
          <p className={isDark ? "text-gray-400" : "text-gray-500"}>Remaining</p>
          <p className="mt-1 text-xl font-semibold">{formatAmount(totals.remaining)}</p>
        </div>
        <div className={`rounded-xl border p-4 ${isDark ? "border-gray-700 bg-gray-800" : "border-gray-200 bg-white"}`}>
          <label className="text-sm">
            Month
            <input
              type="month"
              value={month}
              onChange={(event) => setMonth(event.target.value)}
              className={`mt-1 w-full rounded-lg border px-2 py-1.5 ${
                isDark ? "border-gray-600 bg-gray-700" : "border-gray-300 bg-white"
              }`}
            />
          </label>
        </div>
      </div>

      {(error || feedback) && (
        <div
          className={`flex items-center gap-2 rounded-xl border p-4 text-sm ${
            error
              ? isDark
                ? "border-red-800 bg-red-950/30 text-red-300"
                : "border-red-200 bg-red-50 text-red-700"
              : isDark
                ? "border-emerald-800 bg-emerald-950/20 text-emerald-300"
                : "border-emerald-200 bg-emerald-50 text-emerald-700"
          }`}
        >
          <AlertCircle className="h-4 w-4" />
          {error || feedback}
        </div>
      )}

      <section className={`rounded-xl border p-5 ${isDark ? "border-gray-700 bg-gray-800" : "border-gray-200 bg-white"}`}>
        <div className="mb-4 flex flex-wrap items-center justify-between gap-3">
          <h2 className="text-lg font-semibold">Categories</h2>
          <div className="flex gap-2">
            <button
              type="button"
              onClick={addCategory}
              className="inline-flex items-center gap-2 rounded-lg border px-3 py-2 text-sm"
            >
              <Plus className="h-4 w-4" />
              Add
            </button>
            <button
              type="button"
              onClick={saveBudget}
              disabled={saving}
              className="inline-flex items-center gap-2 rounded-lg bg-[#0A2240] px-3 py-2 text-sm text-white hover:bg-[#12305b] disabled:opacity-60"
            >
              <Save className="h-4 w-4" />
              {saving ? "Saving..." : "Save"}
            </button>
          </div>
        </div>

        {loading ? (
          <p className={isDark ? "text-gray-400" : "text-gray-600"}>Loading...</p>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full min-w-140 text-sm">
              <thead>
                <tr className={isDark ? "text-gray-300" : "text-gray-600"}>
                  <th className="px-3 py-2 text-left">Category</th>
                  <th className="px-3 py-2 text-left">Budget</th>
                  <th className="px-3 py-2 text-left">Spent</th>
                </tr>
              </thead>
              <tbody>
                {categories.map((item, index) => (
                  <tr key={`${item.category || "cat"}-${index}`} className={isDark ? "border-t border-gray-700" : "border-t border-gray-200"}>
                    <td className="px-3 py-2">
                      <input
                        value={item.category || ""}
                        onChange={(event) => updateCategory(index, "category", event.target.value)}
                        className={`w-full rounded-lg border px-2 py-1.5 ${
                          isDark ? "border-gray-600 bg-gray-700" : "border-gray-300 bg-white"
                        }`}
                      />
                    </td>
                    <td className="px-3 py-2">
                      <input
                        type="number"
                        value={item.budget || 0}
                        onChange={(event) => updateCategory(index, "budget", event.target.value)}
                        className={`w-full rounded-lg border px-2 py-1.5 ${
                          isDark ? "border-gray-600 bg-gray-700" : "border-gray-300 bg-white"
                        }`}
                      />
                    </td>
                    <td className="px-3 py-2">
                      <input
                        type="number"
                        value={item.spent || 0}
                        onChange={(event) => updateCategory(index, "spent", event.target.value)}
                        className={`w-full rounded-lg border px-2 py-1.5 ${
                          isDark ? "border-gray-600 bg-gray-700" : "border-gray-300 bg-white"
                        }`}
                      />
                    </td>
                  </tr>
                ))}

                {categories.length === 0 && (
                  <tr>
                    <td colSpan={3} className={`px-3 py-6 text-center ${isDark ? "text-gray-400" : "text-gray-500"}`}>
                      No category yet for this month.
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        )}
      </section>
    </div>
  );
}
