import { useState } from "react";
import {
  Plus,
  Target,
  TrendingUp,
  Calendar,
  DollarSign,
  Award,
  CheckCircle,
} from "lucide-react";
import { useTheme } from "../contexts/ThemeContext";
import { useLanguage } from "../contexts/LanguageContext";

const initialObjectives = [
  {
    id: 1,
    name: { fr: "Voyage à Paris", en: "Trip to Paris" },
    icon: "✈️",
    targetAmount: 3000,
    currentAmount: 1850,
    deadline: "2026-07-15",
    color: "#3b82f6",
    milestones: [
      { percentage: 25, reached: true },
      { percentage: 50, reached: true },
      { percentage: 75, reached: false },
      { percentage: 100, reached: false },
    ],
  },
  {
    id: 2,
    name: { fr: "Nouvelle voiture", en: "New Car" },
    icon: "🚗",
    targetAmount: 25000,
    currentAmount: 12500,
    deadline: "2027-01-01",
    color: "#10b981",
    milestones: [
      { percentage: 25, reached: true },
      { percentage: 50, reached: true },
      { percentage: 75, reached: false },
      { percentage: 100, reached: false },
    ],
  },
  {
    id: 3,
    name: { fr: "Fonds d'urgence", en: "Emergency Fund" },
    icon: "🏥",
    targetAmount: 10000,
    currentAmount: 7800,
    deadline: "2026-12-31",
    color: "#f59e0b",
    milestones: [
      { percentage: 25, reached: true },
      { percentage: 50, reached: true },
      { percentage: 75, reached: true },
      { percentage: 100, reached: false },
    ],
  },
  {
    id: 4,
    name: { fr: "Appartement", en: "Apartment" },
    icon: "🏠",
    targetAmount: 50000,
    currentAmount: 8500,
    deadline: "2028-06-01",
    color: "#8b5cf6",
    milestones: [
      { percentage: 25, reached: false },
      { percentage: 50, reached: false },
      { percentage: 75, reached: false },
      { percentage: 100, reached: false },
    ],
  },
  {
    id: 5,
    name: { fr: "Études Master", en: "Master's Degree" },
    icon: "🎓",
    targetAmount: 15000,
    currentAmount: 4200,
    deadline: "2026-09-01",
    color: "#ec4899",
    milestones: [
      { percentage: 25, reached: true },
      { percentage: 50, reached: false },
      { percentage: 75, reached: false },
      { percentage: 100, reached: false },
    ],
  },
];

export function Obj() {
  const { theme } = useTheme();
  const { language } = useLanguage();
  const [objectives, setObjectives] = useState(initialObjectives);
  const [showAddModal, setShowAddModal] = useState(false);

  const totalTargetAmount = objectives.reduce(
    (sum, obj) => sum + obj.targetAmount,
    0,
  );
  const totalCurrentAmount = objectives.reduce(
    (sum, obj) => sum + obj.currentAmount,
    0,
  );
  const totalProgress = (
    (totalCurrentAmount / totalTargetAmount) *
    100
  ).toFixed(1);

  const completedObjectives = objectives.filter(
    (obj) => obj.currentAmount >= obj.targetAmount,
  );
  const activeObjectives = objectives.filter(
    (obj) => obj.currentAmount < obj.targetAmount,
  );

  const getProgressColor = (percentage) => {
    if (percentage >= 100) return "bg-green-500";
    if (percentage >= 75) return "bg-blue-500";
    if (percentage >= 50) return "bg-yellow-500";
    return "bg-gray-400";
  };

  const getDaysRemaining = (deadline) => {
    const today = new Date();
    const deadlineDate = new Date(deadline);
    const diffTime = deadlineDate - today;
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
    return diffDays;
  };

  const formatDate = (dateString) => {
    const date = new Date(dateString);
    return date.toLocaleDateString(language === "fr" ? "fr-FR" : "en-US", {
      year: "numeric",
      month: "long",
      day: "numeric",
    });
  };

  return (
    <div
      className={`p-4 lg:p-8 space-y-6 ${theme === "dark" ? "bg-gray-900" : "bg-gray-50"}`}
    >
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1
            className={`text-2xl font-semibold mb-2 ${theme === "dark" ? "text-white" : "text-gray-900"}`}
          >
            {language === "fr" ? "Objectifs d'Épargne" : "Savings Goals"}
          </h1>
          <p
            className={`${theme === "dark" ? "text-gray-400" : "text-gray-600"}`}
          >
            {language === "fr"
              ? "Tirelires virtuelles avec suivi de progression"
              : "Virtual piggy banks with progress tracking"}
          </p>
        </div>
        <button
          onClick={() => setShowAddModal(true)}
          className="flex items-center space-x-2 px-4 py-2 bg-[#242f54] text-white rounded-lg hover:bg-[#1a2340] transition-colors"
        >
          <Plus className="w-5 h-5" />
          <span>{language === "fr" ? "Nouvel objectif" : "New Goal"}</span>
        </button>
      </div>

      {/* Overall Progress */}
      <div
        className={`${theme === "dark" ? "bg-linear-to-r from-blue-900/30 to-purple-900/30 border-blue-800" : "bg-linear-to-r from-blue-50 to-purple-50 border-blue-200"} border rounded-xl p-6`}
      >
        <div className="flex items-center justify-between mb-6">
          <div className="flex items-center space-x-3">
            <div className="w-12 h-12 bg-[#242f54] rounded-lg flex items-center justify-center">
              <Target className="w-6 h-6 text-white" />
            </div>
            <div>
              <h2
                className={`font-semibold text-lg ${theme === "dark" ? "text-white" : "text-gray-900"}`}
              >
                {language === "fr" ? "Progression globale" : "Overall Progress"}
              </h2>
              <p
                className={`text-sm ${theme === "dark" ? "text-gray-300" : "text-gray-600"}`}
              >
                {totalCurrentAmount} TND / {totalTargetAmount} TND
              </p>
            </div>
          </div>
          <div className="text-right">
            <p
              className={`text-3xl font-bold ${theme === "dark" ? "text-white" : "text-gray-900"}`}
            >
              {totalProgress}%
            </p>
            <p
              className={`text-sm ${theme === "dark" ? "text-gray-400" : "text-gray-600"}`}
            >
              {activeObjectives.length}{" "}
              {language === "fr" ? "objectifs actifs" : "active goals"}
            </p>
          </div>
        </div>

        <div
          className={`h-4 rounded-full overflow-hidden ${theme === "dark" ? "bg-gray-700" : "bg-gray-200"}`}
        >
          <div
            className="h-full bg-linear-to-r from-blue-500 to-purple-500 transition-all"
            style={{ width: `${Math.min(totalProgress, 100)}%` }}
          ></div>
        </div>
      </div>

      {/* Statistics Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div
          className={`${theme === "dark" ? "bg-gray-800 border-gray-700" : "bg-white border-gray-200"} border rounded-xl p-6`}
        >
          <div className="flex items-center justify-between mb-3">
            <p
              className={`text-sm ${theme === "dark" ? "text-gray-400" : "text-gray-600"}`}
            >
              {language === "fr" ? "Total épargné" : "Total Saved"}
            </p>
            <DollarSign className="w-5 h-5 text-green-500" />
          </div>
          <p className={`text-3xl font-bold text-green-600`}>
            {totalCurrentAmount} TND
          </p>
        </div>

        <div
          className={`${theme === "dark" ? "bg-gray-800 border-gray-700" : "bg-white border-gray-200"} border rounded-xl p-6`}
        >
          <div className="flex items-center justify-between mb-3">
            <p
              className={`text-sm ${theme === "dark" ? "text-gray-400" : "text-gray-600"}`}
            >
              {language === "fr" ? "Objectifs complétés" : "Completed Goals"}
            </p>
            <Award className="w-5 h-5 text-yellow-500" />
          </div>
          <p
            className={`text-3xl font-bold ${theme === "dark" ? "text-white" : "text-gray-900"}`}
          >
            {completedObjectives.length}
          </p>
        </div>

        <div
          className={`${theme === "dark" ? "bg-gray-800 border-gray-700" : "bg-white border-gray-200"} border rounded-xl p-6`}
        >
          <div className="flex items-center justify-between mb-3">
            <p
              className={`text-sm ${theme === "dark" ? "text-gray-400" : "text-gray-600"}`}
            >
              {language === "fr" ? "Restant à épargner" : "Remaining to Save"}
            </p>
            <TrendingUp className="w-5 h-5 text-blue-500" />
          </div>
          <p
            className={`text-3xl font-bold ${theme === "dark" ? "text-white" : "text-gray-900"}`}
          >
            {totalTargetAmount - totalCurrentAmount} TND
          </p>
        </div>
      </div>

      {/* Objectives List */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {objectives.map((obj) => {
          const progress = (
            (obj.currentAmount / obj.targetAmount) *
            100
          ).toFixed(1);
          const daysRemaining = getDaysRemaining(obj.deadline);
          const isCompleted = obj.currentAmount >= obj.targetAmount;

          return (
            <div
              key={obj.id}
              className={`${theme === "dark" ? "bg-gray-800 border-gray-700" : "bg-white border-gray-200"} border rounded-xl p-6 hover:shadow-lg transition-shadow`}
            >
              {/* Header */}
              <div className="flex items-start justify-between mb-4">
                <div className="flex items-center space-x-3">
                  <div
                    className="w-12 h-12 rounded-lg flex items-center justify-center text-2xl"
                    style={{ backgroundColor: `${obj.color}20` }}
                  >
                    {obj.icon}
                  </div>
                  <div>
                    <h3
                      className={`font-semibold ${theme === "dark" ? "text-white" : "text-gray-900"}`}
                    >
                      {obj.name[language]}
                    </h3>
                    <div className="flex items-center space-x-2 text-sm">
                      <Calendar
                        className={`w-4 h-4 ${theme === "dark" ? "text-gray-400" : "text-gray-500"}`}
                      />
                      <span
                        className={`${theme === "dark" ? "text-gray-400" : "text-gray-600"}`}
                      >
                        {formatDate(obj.deadline)}
                      </span>
                    </div>
                  </div>
                </div>
                {isCompleted && (
                  <CheckCircle className="w-6 h-6 text-green-500" />
                )}
              </div>

              {/* Progress */}
              <div className="mb-4">
                <div className="flex items-center justify-between mb-2">
                  <span
                    className={`text-sm ${theme === "dark" ? "text-gray-400" : "text-gray-600"}`}
                  >
                    {obj.currentAmount} TND / {obj.targetAmount} TND
                  </span>
                  <span
                    className={`text-sm font-semibold ${theme === "dark" ? "text-white" : "text-gray-900"}`}
                  >
                    {progress}%
                  </span>
                </div>
                <div
                  className={`h-3 rounded-full overflow-hidden ${theme === "dark" ? "bg-gray-700" : "bg-gray-200"}`}
                >
                  <div
                    className={`h-full transition-all ${getProgressColor(parseFloat(progress))}`}
                    style={{ width: `${Math.min(progress, 100)}%` }}
                  ></div>
                </div>
              </div>

              {/* Milestones */}
              <div className="mb-4">
                <p
                  className={`text-xs font-medium mb-2 ${theme === "dark" ? "text-gray-400" : "text-gray-600"}`}
                >
                  {language === "fr" ? "Jalons" : "Milestones"}
                </p>
                <div className="flex items-center space-x-2">
                  {obj.milestones.map((milestone, index) => (
                    <div
                      key={index}
                      className={`flex-1 h-2 rounded-full ${
                        milestone.reached
                          ? "bg-green-500"
                          : theme === "dark"
                            ? "bg-gray-700"
                            : "bg-gray-200"
                      }`}
                      title={`${milestone.percentage}%`}
                    ></div>
                  ))}
                </div>
              </div>

              {/* Footer */}
              <div className="flex items-center justify-between pt-4 border-t border-gray-200">
                <div className="flex items-center space-x-2">
                  {daysRemaining > 0 ? (
                    <>
                      <Calendar
                        className={`w-4 h-4 ${theme === "dark" ? "text-gray-400" : "text-gray-500"}`}
                      />
                      <span
                        className={`text-sm ${theme === "dark" ? "text-gray-400" : "text-gray-600"}`}
                      >
                        {daysRemaining}{" "}
                        {language === "fr" ? "jours restants" : "days left"}
                      </span>
                    </>
                  ) : (
                    <span className="text-sm text-red-600">
                      {language === "fr"
                        ? "Échéance passée"
                        : "Deadline passed"}
                    </span>
                  )}
                </div>
                <button
                  className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors ${
                    isCompleted
                      ? theme === "dark"
                        ? "bg-green-900/30 text-green-400"
                        : "bg-green-50 text-green-600"
                      : "bg-[#242f54] text-white hover:bg-[#1a2340]"
                  }`}
                >
                  {isCompleted
                    ? language === "fr"
                      ? "✓ Complété"
                      : "✓ Completed"
                    : language === "fr"
                      ? "+ Ajouter"
                      : "+ Add"}
                </button>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
