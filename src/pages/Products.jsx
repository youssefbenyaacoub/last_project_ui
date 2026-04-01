import { useEffect, useMemo, useState } from "react";
import { Search, Star, AlertCircle } from "lucide-react";
import { useTheme } from "../contexts/ThemeContext";
import { useLanguage } from "../contexts/LanguageContext";
import { getClientId, getClientRecommendation, getProductsCatalog } from "../api";

export function Products() {
  const { theme } = useTheme();
  const { language, isRTL } = useLanguage();
  const isDark = theme === "dark";

  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [search, setSearch] = useState("");
  const [products, setProducts] = useState([]);
  const [selectedCategory, setSelectedCategory] = useState("all");
  const [recommendedNames, setRecommendedNames] = useState([]);

  const clientId = getClientId();

  useEffect(() => {
    const loadProducts = async () => {
      try {
        setLoading(true);
        setError("");

        const [catalogData, recommendationData] = await Promise.all([
          getProductsCatalog(),
          clientId ? getClientRecommendation(clientId).catch(() => null) : Promise.resolve(null),
        ]);

        setProducts(Array.isArray(catalogData?.products) ? catalogData.products : []);

        const recommended = (recommendationData?.recommended_products || []).map((product) => {
          if (typeof product === "string") {
            return product.toLowerCase();
          }
          return (product?.product_name || product?.name || "").toLowerCase();
        });
        setRecommendedNames(recommended.filter(Boolean));
      } catch (err) {
        setError(err.message || "Impossible de charger les produits.");
      } finally {
        setLoading(false);
      }
    };

    loadProducts();
  }, [clientId]);

  const categories = useMemo(() => {
    const raw = Array.from(new Set(products.map((product) => product.category).filter(Boolean)));
    return ["all", ...raw];
  }, [products]);

  const filteredProducts = useMemo(() => {
    const term = search.trim().toLowerCase();
    return products.filter((product) => {
      const matchesCategory = selectedCategory === "all" || product.category === selectedCategory;
      const matchesSearch =
        term.length === 0 ||
        product.name?.toLowerCase().includes(term) ||
        product.description?.toLowerCase().includes(term);
      return matchesCategory && matchesSearch;
    });
  }, [products, search, selectedCategory]);

  const getLocalizedCategory = (category) => {
    if (!category) return "-";
    if (language === "ar") {
      const map = {
        "Épargne": "ادخار",
        "Crédits": "قروض",
        "Cartes": "بطاقات",
        "Packs": "باقات",
        "Assurances": "تأمين",
        "Services": "خدمات",
      };
      return map[category] || category;
    }
    if (language === "en") {
      const map = {
        "Épargne": "Savings",
        "Crédits": "Loans",
        "Cartes": "Cards",
        "Packs": "Packs",
        "Assurances": "Insurance",
        "Services": "Services",
      };
      return map[category] || category;
    }
    return category;
  };

  return (
    <div
      className={`min-h-full space-y-6 p-4 lg:p-8 ${
        isDark ? "bg-gray-900 text-white" : "bg-gray-50 text-gray-900"
      } ${isRTL ? "text-right" : "text-left"}`}
    >
      <div>
        <h1 className="text-2xl font-semibold lg:text-3xl">Products Catalog</h1>
        <p className={isDark ? "text-gray-400" : "text-gray-600"}>
          Donnees synchronisees avec le backend BH Advisor.
        </p>
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
            placeholder="Search by product name or description"
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
              {category === "all" ? "All categories" : getLocalizedCategory(category)}
            </option>
          ))}
        </select>
      </div>

      {loading ? (
        <div className={`rounded-xl border p-4 ${isDark ? "border-gray-700 bg-gray-800" : "border-gray-200 bg-white"}`}>
          Loading products...
        </div>
      ) : (
        <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-3">
          {filteredProducts.map((product) => {
            const isRecommended = recommendedNames.some((name) =>
              product.name?.toLowerCase().includes(name) || name.includes(product.name?.toLowerCase() || ""),
            );

            return (
              <article
                key={product.id}
                className={`rounded-xl border p-5 ${
                  isDark ? "border-gray-700 bg-gray-800" : "border-gray-200 bg-white"
                }`}
              >
                <div className="mb-3 flex items-center justify-between gap-2">
                  <span
                    className={`rounded-full px-2.5 py-1 text-xs ${
                      isDark ? "bg-gray-900 text-gray-300" : "bg-gray-100 text-gray-600"
                    }`}
                  >
                    {getLocalizedCategory(product.category)}
                  </span>
                  {isRecommended && (
                    <span className="inline-flex items-center gap-1 rounded-full bg-amber-100 px-2.5 py-1 text-xs text-amber-700">
                      <Star className="h-3 w-3" />
                      Recommended
                    </span>
                  )}
                </div>

                <h2 className="text-lg font-semibold">{product.name}</h2>
                <p className={`mt-2 text-sm ${isDark ? "text-gray-300" : "text-gray-600"}`}>
                  {product.description}
                </p>

                {!!product.features?.length && (
                  <ul className="mt-3 space-y-1 text-sm">
                    {product.features.slice(0, 4).map((feature) => (
                      <li key={feature} className={isDark ? "text-gray-300" : "text-gray-700"}>
                        • {feature}
                      </li>
                    ))}
                  </ul>
                )}
              </article>
            );
          })}

          {filteredProducts.length === 0 && (
            <div
              className={`md:col-span-2 xl:col-span-3 rounded-xl border p-6 text-sm ${
                isDark ? "border-gray-700 bg-gray-800 text-gray-300" : "border-gray-200 bg-white text-gray-600"
              }`}
            >
              No products found.
            </div>
          )}
        </div>
      )}
    </div>
  );
}
