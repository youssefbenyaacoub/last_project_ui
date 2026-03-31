import { useState } from "react";
import { useNavigate } from "react-router";
import {
  ChevronRight,
  ChevronLeft,
  Briefcase,
  Home,
  Car,
  Users,
  Baby,
  Calendar,
  DollarSign,
  Target,
  GraduationCap,
} from "lucide-react";
import { useTheme } from "../contexts/ThemeContext";
import { useLanguage } from "../contexts/LanguageContext";
import logoExpanded from "../assets/BH_logo2.png";

export function QuestPage() {
  const navigate = useNavigate();
  const { theme } = useTheme();
  const { language } = useLanguage();
  const [currentStep, setCurrentStep] = useState(0);
  const [answers, setAnswers] = useState({
    occupation: "",
    housing: "",
    hasVehicle: "",
    maritalStatus: "",
    hasChildren: "",
    numberOfChildren: "",
    age: "",
    monthlyIncome: "",
    financialGoals: [],
  });

  const questions = [
    {
      id: "occupation",
      icon: Briefcase,
      question:
        language === "fr"
          ? "Quelle est votre situation professionnelle?"
          : "What is your employment status?",
      options: [
        {
          value: "employed",
          label: language === "fr" ? "Salarié(e)" : "Employed",
        },
        {
          value: "self-employed",
          label: language === "fr" ? "Indépendant(e)" : "Self-employed",
        },
        {
          value: "student",
          label: language === "fr" ? "Étudiant(e)" : "Student",
        },
        {
          value: "retired",
          label: language === "fr" ? "Retraité(e)" : "Retired",
        },
        {
          value: "unemployed",
          label: language === "fr" ? "Sans emploi" : "Unemployed",
        },
      ],
    },
    {
      id: "housing",
      icon: Home,
      question:
        language === "fr"
          ? "Quelle est votre situation de logement?"
          : "What is your housing situation?",
      options: [
        { value: "owner", label: language === "fr" ? "Propriétaire" : "Owner" },
        { value: "renter", label: language === "fr" ? "Locataire" : "Renter" },
        {
          value: "family",
          label: language === "fr" ? "Chez la famille" : "Living with family",
        },
        { value: "other", label: language === "fr" ? "Autre" : "Other" },
      ],
    },
    {
      id: "hasVehicle",
      icon: Car,
      question:
        language === "fr"
          ? "Possédez-vous un véhicule?"
          : "Do you own a vehicle?",
      options: [
        {
          value: "yes-owned",
          label: language === "fr" ? "Oui, acheté" : "Yes, owned",
        },
        {
          value: "yes-financed",
          label: language === "fr" ? "Oui, financé" : "Yes, financed",
        },
        { value: "no", label: language === "fr" ? "Non" : "No" },
      ],
    },
    {
      id: "maritalStatus",
      icon: Users,
      question:
        language === "fr"
          ? "Quelle est votre situation familiale?"
          : "What is your marital status?",
      options: [
        {
          value: "single",
          label: language === "fr" ? "Célibataire" : "Single",
        },
        { value: "married", label: language === "fr" ? "Marié(e)" : "Married" },
        {
          value: "divorced",
          label: language === "fr" ? "Divorcé(e)" : "Divorced",
        },
        { value: "widowed", label: language === "fr" ? "Veuf(ve)" : "Widowed" },
      ],
    },
    {
      id: "hasChildren",
      icon: Baby,
      question:
        language === "fr" ? "Avez-vous des enfants?" : "Do you have children?",
      options: [
        { value: "yes", label: language === "fr" ? "Oui" : "Yes" },
        { value: "no", label: language === "fr" ? "Non" : "No" },
      ],
    },
    {
      id: "numberOfChildren",
      icon: Baby,
      question:
        language === "fr"
          ? "Combien d'enfants avez-vous?"
          : "How many children do you have?",
      skip: answers.hasChildren !== "yes",
      options: [
        { value: "1", label: "1" },
        { value: "2", label: "2" },
        { value: "3", label: "3" },
        { value: "4+", label: "4+" },
      ],
    },
    {
      id: "age",
      icon: Calendar,
      question:
        language === "fr"
          ? "Quelle est votre tranche d'âge?"
          : "What is your age range?",
      options: [
        { value: "18-25", label: "18-25" },
        { value: "26-35", label: "26-35" },
        { value: "36-45", label: "36-45" },
        { value: "46-55", label: "46-55" },
        { value: "56+", label: "56+" },
      ],
    },
    {
      id: "monthlyIncome",
      icon: DollarSign,
      question:
        language === "fr"
          ? "Quel est votre revenu mensuel approximatif?"
          : "What is your approximate monthly income?",
      options: [
        { value: "0-1000", label: "0 - 1,000 TND" },
        { value: "1000-2500", label: "1,000 - 2,500 TND" },
        { value: "2500-5000", label: "2,500 - 5,000 TND" },
        { value: "5000-10000", label: "5,000 - 10,000 TND" },
        { value: "10000+", label: "10,000+ TND" },
      ],
    },
    {
      id: "financialGoals",
      icon: Target,
      question:
        language === "fr"
          ? "Quels sont vos objectifs financiers? (plusieurs choix possibles)"
          : "What are your financial goals? (multiple choices)",
      multiple: true,
      options: [
        { value: "save", label: language === "fr" ? "Épargner" : "Save money" },
        { value: "invest", label: language === "fr" ? "Investir" : "Invest" },
        {
          value: "buy-home",
          label: language === "fr" ? "Acheter une maison" : "Buy a home",
        },
        {
          value: "buy-car",
          label: language === "fr" ? "Acheter une voiture" : "Buy a car",
        },
        {
          value: "education",
          label: language === "fr" ? "Éducation" : "Education",
        },
        {
          value: "retirement",
          label: language === "fr" ? "Retraite" : "Retirement",
        },
      ],
    },
  ];

  const visibleQuestions = questions.filter((q) => !q.skip);
  const currentQuestion = visibleQuestions[currentStep];
  const progress = ((currentStep + 1) / visibleQuestions.length) * 100;

  const handleAnswer = (value) => {
    if (currentQuestion.multiple) {
      const current = answers[currentQuestion.id] || [];
      const updated = current.includes(value)
        ? current.filter((v) => v !== value)
        : [...current, value];
      setAnswers({ ...answers, [currentQuestion.id]: updated });
    } else {
      setAnswers({ ...answers, [currentQuestion.id]: value });
    }
  };

  const handleNext = () => {
    if (currentStep < visibleQuestions.length - 1) {
      setCurrentStep(currentStep + 1);
    } else {
      // Questionnaire complete
      navigate("/client");
    }
  };

  const handleBack = () => {
    if (currentStep > 0) {
      setCurrentStep(currentStep - 1);
    }
  };

  const canProceed = currentQuestion.multiple
    ? (answers[currentQuestion.id] || []).length > 0
    : answers[currentQuestion.id];

  return (
    <div
      className={`min-h-screen ${theme === "dark" ? "bg-gray-900" : "bg-linear-to-br from-blue-50 to-white"} flex items-center justify-center p-4`}
    >
      <div
        className={`w-full max-w-3xl ${theme === "dark" ? "bg-gray-800" : "bg-white"} rounded-2xl shadow-xl p-8 md:p-12`}
      >
        {/* Header */}
        <div className="mb-8">
          <img src={logoExpanded} alt="BH Bank" className="h-10 mx-auto mb-6" />
          <h1
            className={`text-2xl md:text-3xl font-bold text-center ${theme === "dark" ? "text-white" : "text-gray-900"} mb-2`}
          >
            {language === "fr"
              ? "Personnalisez votre expérience"
              : "Personalize your experience"}
          </h1>
          <p
            className={`text-center ${theme === "dark" ? "text-gray-400" : "text-gray-600"}`}
          >
            {language === "fr"
              ? "Quelques questions pour mieux vous connaître"
              : "A few questions to better understand you"}
          </p>
        </div>

        {/* Progress Bar */}
        <div className="mb-8">
          <div
            className={`h-2 ${theme === "dark" ? "bg-gray-700" : "bg-gray-200"} rounded-full overflow-hidden`}
          >
            <div
              className="h-full bg-[#242f54] transition-all duration-300"
              style={{ width: `${progress}%` }}
            ></div>
          </div>
          <p
            className={`text-sm ${theme === "dark" ? "text-gray-400" : "text-gray-600"} text-center mt-2`}
          >
            {language === "fr" ? "Question" : "Question"} {currentStep + 1} /{" "}
            {visibleQuestions.length}
          </p>
        </div>

        {/* Question */}
        <div className="mb-8">
          <div className="flex items-center justify-center mb-6">
            <div className="w-16 h-16 bg-[#242f54] rounded-full flex items-center justify-center">
              <currentQuestion.icon className="w-8 h-8 text-white" />
            </div>
          </div>
          <h2
            className={`text-xl md:text-2xl font-semibold text-center ${theme === "dark" ? "text-white" : "text-gray-900"} mb-8`}
          >
            {currentQuestion.question}
          </h2>

          {/* Options */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {currentQuestion.options.map((option) => {
              const isSelected = currentQuestion.multiple
                ? (answers[currentQuestion.id] || []).includes(option.value)
                : answers[currentQuestion.id] === option.value;

              return (
                <button
                  key={option.value}
                  onClick={() => handleAnswer(option.value)}
                  className={`p-4 rounded-xl border-2 transition-all text-left ${
                    isSelected
                      ? "border-[#242f54] bg-[#242f54]/10"
                      : theme === "dark"
                        ? "border-gray-700 hover:border-gray-600 bg-gray-700"
                        : "border-gray-200 hover:border-gray-300 bg-gray-50"
                  }`}
                >
                  <span
                    className={`font-medium ${theme === "dark" ? "text-white" : "text-gray-900"}`}
                  >
                    {option.label}
                  </span>
                </button>
              );
            })}
          </div>
        </div>

        {/* Navigation */}
        <div className="flex justify-between items-center">
          <button
            onClick={handleBack}
            disabled={currentStep === 0}
            className={`flex items-center space-x-2 px-6 py-3 rounded-lg transition-colors ${
              currentStep === 0
                ? theme === "dark"
                  ? "text-gray-600 cursor-not-allowed"
                  : "text-gray-400 cursor-not-allowed"
                : theme === "dark"
                  ? "text-white hover:bg-gray-700"
                  : "text-gray-700 hover:bg-gray-100"
            }`}
          >
            <ChevronLeft className="w-5 h-5" />
            <span>{language === "fr" ? "Retour" : "Back"}</span>
          </button>

          <button
            onClick={handleNext}
            disabled={!canProceed}
            className={`flex items-center space-x-2 px-6 py-3 rounded-lg transition-all ${
              canProceed
                ? "bg-[#242f54] text-white hover:bg-[#1a2340]"
                : theme === "dark"
                  ? "bg-gray-700 text-gray-500 cursor-not-allowed"
                  : "bg-gray-200 text-gray-400 cursor-not-allowed"
            }`}
          >
            <span>
              {currentStep === visibleQuestions.length - 1
                ? language === "fr"
                  ? "Terminer"
                  : "Finish"
                : language === "fr"
                  ? "Suivant"
                  : "Next"}
            </span>
            <ChevronRight className="w-5 h-5" />
          </button>
        </div>

        {/* Skip Option */}
        <div className="text-center mt-6">
          <button
            onClick={() => navigate("/client")}
            className={`text-sm ${theme === "dark" ? "text-gray-400 hover:text-gray-300" : "text-gray-600 hover:text-gray-700"} underline`}
          >
            {language === "fr" ? "Passer cette étape" : "Skip this step"}
          </button>
        </div>
      </div>
    </div>
  );
}
