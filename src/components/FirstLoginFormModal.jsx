import { useMemo, useState } from "react";
import { AlertCircle, Globe, Save } from "lucide-react";
import { useLanguage } from "../contexts/LanguageContext";

const modalCopy = {
  en: {
    title: "Complete your profile",
    subtitle:
      "Please fill this form before using the platform. The fields and choices come from the backend schema.",
    save: "Save and continue",
    saving: "Saving...",
    required: "Required",
    selectPlaceholder: "Select...",
    yes: "Yes",
    no: "No",
  },
  fr: {
    title: "Completer votre profil",
    subtitle:
      "Veuillez remplir ce formulaire avant d'utiliser la plateforme. Les champs et choix proviennent du schema backend.",
    save: "Enregistrer et continuer",
    saving: "Enregistrement...",
    required: "Obligatoire",
    selectPlaceholder: "Selectionner...",
    yes: "Oui",
    no: "Non",
  },
  ar: {
    title: "اكمال ملفك الشخصي",
    subtitle:
      "يرجى تعبئة هذا النموذج قبل استعمال المنصة. كل الحقول والاختيارات قادمة من مخطط الخلفية.",
    save: "حفظ والمتابعة",
    saving: "جار الحفظ...",
    required: "اجباري",
    selectPlaceholder: "اختر...",
    yes: "نعم",
    no: "لا",
  },
};

const sectionTitleTranslations = {
  professionnel: {
    en: "Professional information",
    ar: "المعلومات المهنية",
  },
  personnel: {
    en: "Personal information",
    ar: "المعلومات الشخصية",
  },
  logement: {
    en: "Housing",
    ar: "السكن",
  },
  vehicule: {
    en: "Vehicle",
    ar: "المركبة",
  },
  projets: {
    en: "Projects and goals",
    ar: "المشاريع والاهداف",
  },
  produits_existants: {
    en: "Existing BH Bank products",
    ar: "منتجات BH Bank الحالية",
  },
  optionnel: {
    en: "Additional information (optional)",
    ar: "معلومات اضافية (اختياري)",
  },
};

const fieldLabelTranslations = {
  statut_professionnel: { en: "Employment status", ar: "الوضع المهني" },
  secteur_activite: { en: "Activity sector", ar: "قطاع النشاط" },
  anciennete_emploi: { en: "Job seniority (years)", ar: "الاقدمية في العمل (سنوات)" },
  situation_familiale: { en: "Marital status", ar: "الحالة العائلية" },
  nombre_enfants: { en: "Number of children", ar: "عدد الاطفال" },
  niveau_etudes: { en: "Education level", ar: "المستوى الدراسي" },
  situation_logement: { en: "Housing status", ar: "وضعية السكن" },
  credit_immobilier_en_cours: {
    en: "Do you have an active home loan?",
    ar: "هل لديك قرض سكني جاري؟",
  },
  souhait_achat_logement: {
    en: "Do you plan to buy a home?",
    ar: "هل تخطط لشراء سكن؟",
  },
  possede_voiture: { en: "Do you own a car?", ar: "هل تملك سيارة؟" },
  type_voiture: { en: "Car type", ar: "نوع السيارة" },
  credit_auto_en_cours: {
    en: "Do you have an active car loan?",
    ar: "هل لديك قرض سيارة جاري؟",
  },
  projets_12_mois: {
    en: "Projects in the next 12 months",
    ar: "المشاريع خلال 12 شهرا القادمة",
  },
  interet_etudes_enfants: {
    en: "Do you want to prepare your children's studies?",
    ar: "هل ترغب في التحضير لدراسة اطفالك؟",
  },
  tolerance_risque: { en: "Risk tolerance", ar: "تحمل المخاطر" },
  objectif_financier: { en: "Main financial goal", ar: "الهدف المالي الرئيسي" },
  produits_bh_existants: {
    en: "Do you already have BH Bank products?",
    ar: "هل لديك منتجات BH Bank حاليا؟",
  },
  charges_mensuelles: {
    en: "Monthly fixed expenses",
    ar: "المصاريف الشهرية الثابتة",
  },
};

function normalizeSchema(rawSchema) {
  if (!rawSchema) {
    return [];
  }

  if (Array.isArray(rawSchema.sections)) {
    return rawSchema.sections.map((section) => ({
      section_id: section.section_id || section.section_title || "section",
      section_title: section.section_title || section.section_id || "Section",
      fields: Array.isArray(section.fields) ? section.fields : [],
    }));
  }

  if (Array.isArray(rawSchema.fields)) {
    return [
      {
        section_id: "profile",
        section_title: "Profile",
        fields: rawSchema.fields,
      },
    ];
  }

  return [];
}

function toArray(value) {
  if (Array.isArray(value)) {
    return value;
  }

  if (typeof value === "string") {
    if (!value.trim()) {
      return [];
    }

    if (value.trim().startsWith("[")) {
      try {
        const parsed = JSON.parse(value);
        return Array.isArray(parsed) ? parsed : [];
      } catch {
        return [value];
      }
    }

    return [value];
  }

  return [];
}

function parseConditionList(raw) {
  const values = [];
  const regex = /'([^']*)'|"([^"]*)"/g;
  let match = null;

  while ((match = regex.exec(raw)) !== null) {
    values.push((match[1] || match[2] || "").trim());
  }

  return values;
}

function normalizeBooleanValue(value) {
  if (value === true) return "Oui";
  if (value === false) return "Non";

  const normalized = String(value || "").trim().toLowerCase();
  if (["oui", "yes", "true", "1"].includes(normalized)) return "Oui";
  if (["non", "no", "false", "0"].includes(normalized)) return "Non";
  return "";
}

function evaluateCondition(condition, values) {
  if (!condition) {
    return true;
  }

  const expr = String(condition).trim();
  let match = expr.match(/^([a-zA-Z0-9_]+)\s+NOT\s+IN\s+\[(.*)\]$/i);

  if (match) {
    const field = match[1];
    const list = parseConditionList(match[2]);
    const current = String(values[field] || "").trim();
    return !list.includes(current);
  }

  match = expr.match(/^([a-zA-Z0-9_]+)\s+IN\s+\[(.*)\]$/i);
  if (match) {
    const field = match[1];
    const list = parseConditionList(match[2]);
    const current = String(values[field] || "").trim();
    return list.includes(current);
  }

  match = expr.match(/^([a-zA-Z0-9_]+)\s*==\s*(true|false)$/i);
  if (match) {
    const field = match[1];
    const expected = match[2].toLowerCase() === "true";
    const current = normalizeBooleanValue(values[field]);
    return expected ? current === "Oui" : current === "Non";
  }

  match = expr.match(/^([a-zA-Z0-9_]+)\s*==\s*['"](.+)['"]$/);
  if (match) {
    const field = match[1];
    const expected = match[2].trim();
    const current = String(values[field] || "").trim();
    return current === expected;
  }

  return true;
}

function getFieldId(field) {
  return field.field_id || field.name || "";
}

function buildInitialValues(sections, initialData) {
  const values = {};

  sections.forEach((section) => {
    section.fields.forEach((field) => {
      const fieldId = getFieldId(field);
      if (!fieldId) return;

      const existing = initialData?.[fieldId];

      if (field.type === "multi-select") {
        values[fieldId] = toArray(existing);
      } else if (field.type === "boolean") {
        values[fieldId] = normalizeBooleanValue(existing);
      } else {
        values[fieldId] = existing ?? "";
      }
    });
  });

  return values;
}

function isFilled(value, type) {
  if (type === "multi-select") {
    return toArray(value).length > 0;
  }
  return String(value ?? "").trim().length > 0;
}

function getTranslatedLabel(field, language) {
  const fieldId = getFieldId(field);
  const translation = fieldLabelTranslations[fieldId];

  if (translation && translation[language]) {
    return translation[language];
  }

  return field.label || fieldId;
}

function getTranslatedSection(section, language) {
  const translation = sectionTitleTranslations[section.section_id];

  if (translation && translation[language]) {
    return translation[language];
  }

  return section.section_title || section.section_id;
}

function getOptionValue(option) {
  if (option && typeof option === "object") {
    if (option.value !== undefined && option.value !== null) {
      return String(option.value);
    }
    if (option.id !== undefined && option.id !== null) {
      return String(option.id);
    }
    if (option.code !== undefined && option.code !== null) {
      return String(option.code);
    }
    if (option.label !== undefined && option.label !== null) {
      return typeof option.label === "string" ? option.label : "";
    }
    return "";
  }

  if (option === undefined || option === null) {
    return "";
  }

  return String(option);
}

function getOptionLabel(option, language) {
  if (option && typeof option === "object") {
    if (option.labels && typeof option.labels === "object") {
      const translated = option.labels[language] || option.labels.en || option.labels.fr;
      if (translated) {
        return String(translated);
      }
    }

    if (option.label && typeof option.label === "object") {
      const translated = option.label[language] || option.label.en || option.label.fr;
      if (translated) {
        return String(translated);
      }
    }

    if (typeof option.label === "string") {
      return option.label;
    }

    if (typeof option.text === "string") {
      return option.text;
    }
  }

  return getOptionValue(option);
}

function getFieldOptions(options, language) {
  if (!Array.isArray(options)) {
    return [];
  }

  return options
    .map((option) => {
      const value = getOptionValue(option);
      const label = getOptionLabel(option, language) || value;
      return { value, label };
    })
    .filter((option) => option.value);
}

export function FirstLoginFormModal({
  schema,
  initialData,
  isSaving,
  error,
  onSubmit,
}) {
  const { language, setLanguage, isRTL } = useLanguage();
  const ui = modalCopy[language] || modalCopy.en;

  const sections = useMemo(() => normalizeSchema(schema), [schema]);
  const [formValues, setFormValues] = useState(() =>
    buildInitialValues(sections, initialData)
  );

  const canSubmit = useMemo(() => {
    for (const section of sections) {
      for (const field of section.fields) {
        const fieldId = getFieldId(field);
        if (!fieldId) continue;

        const visible = evaluateCondition(field.condition, formValues);
        if (!visible) continue;

        if (field.required && !isFilled(formValues[fieldId], field.type)) {
          return false;
        }
      }
    }

    return true;
  }, [sections, formValues]);

  const updateValue = (fieldId, value) => {
    setFormValues((prev) => ({ ...prev, [fieldId]: value }));
  };

  const toggleMultiOption = (fieldId, option) => {
    setFormValues((prev) => {
      const current = toArray(prev[fieldId]);
      const hasOption = current.includes(option);
      const next = hasOption
        ? current.filter((item) => item !== option)
        : [...current, option];
      return { ...prev, [fieldId]: next };
    });
  };

  const handleSubmit = async (event) => {
    event.preventDefault();

    const payload = {};

    sections.forEach((section) => {
      section.fields.forEach((field) => {
        const fieldId = getFieldId(field);
        if (!fieldId) return;

        const visible = evaluateCondition(field.condition, formValues);

        if (!visible) {
          payload[fieldId] = field.type === "multi-select" ? [] : "";
          return;
        }

        if (field.type === "multi-select") {
          payload[fieldId] = toArray(formValues[fieldId]);
          return;
        }

        if (field.type === "boolean") {
          payload[fieldId] = normalizeBooleanValue(formValues[fieldId]);
          return;
        }

        payload[fieldId] = formValues[fieldId] ?? "";
      });
    });

    await onSubmit(payload);
  };

  return (
    <div className="fixed inset-0 z-60 flex items-center justify-center bg-black/50 p-4">
      <div
        className={`max-h-[90vh] w-full max-w-4xl overflow-y-auto rounded-2xl bg-white p-6 shadow-2xl ${
          isRTL ? "text-right" : "text-left"
        }`}
      >
        <div className="mb-6 flex flex-wrap items-start justify-between gap-3">
          <div>
            <h2 className="text-2xl font-semibold text-gray-900">{ui.title}</h2>
            <p className="mt-1 text-sm text-gray-600">{ui.subtitle}</p>
          </div>

          <div className="inline-flex items-center gap-2 rounded-lg border border-gray-200 bg-gray-50 p-1.5">
            <Globe className="h-4 w-4 text-gray-500" />
            {["ar", "fr", "en"].map((langCode) => (
              <button
                key={langCode}
                type="button"
                onClick={() => setLanguage(langCode)}
                className={`rounded-md px-2.5 py-1 text-xs font-semibold uppercase ${
                  language === langCode
                    ? "bg-[#0A2240] text-white"
                    : "text-gray-700 hover:bg-white"
                }`}
              >
                {langCode}
              </button>
            ))}
          </div>
        </div>

        {error && (
          <div className="mb-4 flex items-center gap-2 rounded-lg border border-red-200 bg-red-50 p-3 text-sm text-red-700">
            <AlertCircle className="h-4 w-4" />
            {error}
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-5">
          {sections.map((section) => (
            <section key={section.section_id} className="rounded-xl border border-gray-200 p-4">
              <h3 className="mb-4 text-sm font-semibold uppercase tracking-wide text-gray-700">
                {getTranslatedSection(section, language)}
              </h3>

              <div className="grid gap-4 md:grid-cols-2">
                {section.fields.map((field) => {
                  const fieldId = getFieldId(field);
                  if (!fieldId) return null;

                  const visible = evaluateCondition(field.condition, formValues);
                  if (!visible) return null;

                  const value = formValues[fieldId] ?? "";
                  const required = Boolean(field.required);

                  return (
                    <div key={fieldId} className="space-y-1.5">
                      <label className="block text-sm font-medium text-gray-700">
                        {getTranslatedLabel(field, language)}
                        {required && <span className="ml-1 text-red-500">*</span>}
                      </label>

                      {field.type === "select" && (
                        <select
                          value={value}
                          onChange={(event) => updateValue(fieldId, event.target.value)}
                          className="w-full rounded-lg border border-gray-300 bg-white px-3 py-2"
                          required={required}
                        >
                          <option value="">{ui.selectPlaceholder}</option>
                          {getFieldOptions(field.options, language).map((option) => (
                            <option key={option.value} value={option.value}>
                              {option.label}
                            </option>
                          ))}
                        </select>
                      )}

                      {field.type === "boolean" && (
                        <select
                          value={normalizeBooleanValue(value)}
                          onChange={(event) => updateValue(fieldId, event.target.value)}
                          className="w-full rounded-lg border border-gray-300 bg-white px-3 py-2"
                          required={required}
                        >
                          <option value="">{ui.selectPlaceholder}</option>
                          <option value="Oui">{ui.yes}</option>
                          <option value="Non">{ui.no}</option>
                        </select>
                      )}

                      {field.type === "multi-select" && (
                        <div className="max-h-40 space-y-2 overflow-auto rounded-lg border border-gray-300 bg-white p-2">
                          {getFieldOptions(field.options, language).map((option) => {
                            const checked = toArray(value).includes(option.value);

                            return (
                              <label key={option.value} className="flex items-center gap-2 text-sm text-gray-700">
                                <input
                                  type="checkbox"
                                  checked={checked}
                                  onChange={() => toggleMultiOption(fieldId, option.value)}
                                  className="rounded border-gray-300"
                                />
                                {option.label}
                              </label>
                            );
                          })}
                        </div>
                      )}

                      {field.type === "number" && (
                        <input
                          type="number"
                          value={value}
                          onChange={(event) => updateValue(fieldId, event.target.value)}
                          min={field.min}
                          max={field.max}
                          className="w-full rounded-lg border border-gray-300 bg-white px-3 py-2"
                          required={required}
                        />
                      )}

                      {!["select", "boolean", "multi-select", "number"].includes(field.type) && (
                        <input
                          type="text"
                          value={value}
                          onChange={(event) => updateValue(fieldId, event.target.value)}
                          className="w-full rounded-lg border border-gray-300 bg-white px-3 py-2"
                          required={required}
                        />
                      )}

                      {required && !isFilled(value, field.type) && (
                        <p className="text-xs text-red-600">{ui.required}</p>
                      )}
                    </div>
                  );
                })}
              </div>
            </section>
          ))}

          <div className={`flex ${isRTL ? "justify-start" : "justify-end"}`}>
            <button
              type="submit"
              disabled={isSaving || !canSubmit}
              className="inline-flex items-center gap-2 rounded-lg bg-[#0A2240] px-4 py-2 text-white hover:bg-[#12305b] disabled:cursor-not-allowed disabled:opacity-60"
            >
              <Save className="h-4 w-4" />
              {isSaving ? ui.saving : ui.save}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
