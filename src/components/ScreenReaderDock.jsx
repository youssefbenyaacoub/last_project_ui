import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import { Pause, Play, Square, Volume2 } from "lucide-react";
import { useLocation } from "react-router";
import { useLanguage } from "../contexts/LanguageContext";
import { useTheme } from "../contexts/ThemeContext";

const SETTINGS_STORAGE_KEY = "bh_dashboard_settings";
const DEFAULT_VOICE_RATE = 0.95;
const MIN_VOICE_RATE = 0.7;
const MAX_VOICE_RATE = 1.3;
const AUTO_SPEAK_DELAY_MS = 420;
const AUTO_SPEAK_MAX_CHARS = 220;
const AUTO_SPEAK_SELECTORS = [
  "button",
  "a[href]",
  "input:not([type='hidden'])",
  "select",
  "textarea",
  "[role='button']",
  "[role='link']",
  "[tabindex]:not([tabindex='-1'])",
  "[data-sr-text]",
  "label",
  "h1",
  "h2",
  "h3",
  "h4",
  "h5",
  "h6",
  "p",
  "li",
].join(",");

const defaultAccessibility = {
  screenReader: false,
  voiceName: "auto",
  voiceRate: DEFAULT_VOICE_RATE,
};

const uiByLanguage = {
  en: {
    title: "Screen reader",
    play: "Read this page",
    pause: "Pause",
    resume: "Resume",
    stop: "Stop",
    noContent: "No readable content found on this page.",
    unavailable: "Voice reading is not available in this browser.",
  },
  fr: {
    title: "Lecture vocale",
    play: "Lire cette page",
    pause: "Pause",
    resume: "Reprendre",
    stop: "Arreter",
    noContent: "Aucun contenu lisible trouve sur cette page.",
    unavailable: "La lecture vocale n'est pas disponible dans ce navigateur.",
  },
  ar: {
    title: "القراءة الصوتية",
    play: "اقرأ هذه الصفحة",
    pause: "ايقاف مؤقت",
    resume: "استئناف",
    stop: "ايقاف",
    noContent: "لا يوجد محتوى قابل للقراءة في هذه الصفحة.",
    unavailable: "القراءة الصوتية غير متوفرة في هذا المتصفح.",
  },
};

const getVoiceId = (voice) => voice?.voiceURI || voice?.name || "";

const getStoredAccessibility = () => {
  try {
    const raw = localStorage.getItem(SETTINGS_STORAGE_KEY);
    const parsed = raw ? JSON.parse(raw) : {};
    const merged = {
      ...defaultAccessibility,
      ...(parsed?.accessibility || {}),
    };

    const voiceRate = Number(merged.voiceRate);
    merged.voiceRate = Number.isFinite(voiceRate)
      ? Math.min(MAX_VOICE_RATE, Math.max(MIN_VOICE_RATE, voiceRate))
      : DEFAULT_VOICE_RATE;

    if (!merged.voiceName) {
      merged.voiceName = "auto";
    }

    return merged;
  } catch {
    return defaultAccessibility;
  }
};

const getSpeechVoices = () => {
  if (typeof window === "undefined" || !("speechSynthesis" in window)) {
    return [];
  }
  return window.speechSynthesis.getVoices().filter((voice) => Boolean(voice?.name));
};

const resolveLanguageCode = (language) => {
  if (language === "ar") return "ar-TN";
  if (language === "en") return "en-US";
  return "fr-FR";
};

const getReadablePageText = () => {
  const target = document.querySelector("main") || document.querySelector("#root") || document.body;
  if (!target) return "";

  const clone = target.cloneNode(true);
  clone
    .querySelectorAll(
      "script, style, noscript, svg, button, input, textarea, select, [aria-hidden='true']",
    )
    .forEach((node) => node.remove());

  return (clone.textContent || "").replace(/\s+/g, " ").trim();
};

const getSpeechTargetElement = (target, dockNode) => {
  if (!(target instanceof Element)) return null;

  const candidate = target.closest(AUTO_SPEAK_SELECTORS);
  if (!candidate) return null;

  if (dockNode && dockNode.contains(candidate)) return null;
  if (candidate.getAttribute("aria-hidden") === "true") return null;

  return candidate;
};

const getElementSpeechText = (element) => {
  if (!element) return "";

  const labelledBy = element.getAttribute("aria-labelledby");
  if (labelledBy) {
    const labelFromIds = labelledBy
      .split(/\s+/)
      .map((id) => document.getElementById(id)?.textContent || "")
      .join(" ")
      .replace(/\s+/g, " ")
      .trim();
    if (labelFromIds) {
      return labelFromIds.slice(0, AUTO_SPEAK_MAX_CHARS);
    }
  }

  const direct =
    element.getAttribute("data-sr-text") ||
    element.getAttribute("aria-label") ||
    element.getAttribute("title") ||
    element.getAttribute("alt") ||
    "";

  if (String(direct).trim()) {
    return String(direct).replace(/\s+/g, " ").trim().slice(0, AUTO_SPEAK_MAX_CHARS);
  }

  const placeholder = element.getAttribute("placeholder") || "";
  if (placeholder.trim()) {
    return placeholder.replace(/\s+/g, " ").trim().slice(0, AUTO_SPEAK_MAX_CHARS);
  }

  const value = "value" in element ? String(element.value || "") : "";
  if (value.trim()) {
    return value.replace(/\s+/g, " ").trim().slice(0, AUTO_SPEAK_MAX_CHARS);
  }

  const text = (element.textContent || "").replace(/\s+/g, " ").trim();
  if (!text) return "";

  return text.slice(0, AUTO_SPEAK_MAX_CHARS);
};

export function ScreenReaderDock() {
  const { language, isRTL } = useLanguage();
  const { theme } = useTheme();
  const location = useLocation();
  const ui = uiByLanguage[language] || uiByLanguage.fr;

  const [accessibility, setAccessibility] = useState(() => getStoredAccessibility());
  const [availableVoices, setAvailableVoices] = useState([]);
  const [statusMessage, setStatusMessage] = useState("");
  const [isSpeaking, setIsSpeaking] = useState(false);
  const [isPaused, setIsPaused] = useState(false);

  const dockRef = useRef(null);
  const utteranceRef = useRef(null);
  const hoverSpeakTimeoutRef = useRef(null);
  const lastAutoTextRef = useRef("");
  const keyboardNavigationRef = useRef(false);
  const speechModeRef = useRef("idle");

  const isBrowserSpeechAvailable =
    typeof window !== "undefined" && "speechSynthesis" in window;

  const currentVoiceRate = useMemo(() => {
    const rate = Number(accessibility?.voiceRate);
    if (!Number.isFinite(rate)) return DEFAULT_VOICE_RATE;
    return Math.min(MAX_VOICE_RATE, Math.max(MIN_VOICE_RATE, rate));
  }, [accessibility?.voiceRate]);

  const clearScheduledAutoSpeak = useCallback(() => {
    if (!hoverSpeakTimeoutRef.current) return;
    window.clearTimeout(hoverSpeakTimeoutRef.current);
    hoverSpeakTimeoutRef.current = null;
  }, []);

  const getVoiceForSpeech = useCallback(() => {
    if (!availableVoices.length) return null;

    const selectedVoiceId = accessibility?.voiceName;
    if (selectedVoiceId && selectedVoiceId !== "auto") {
      const explicit = availableVoices.find((voice) => getVoiceId(voice) === selectedVoiceId);
      if (explicit) return explicit;
    }

    const languagePrefix = language === "ar" ? "ar" : language === "fr" ? "fr" : "en";
    const localeVoice = availableVoices.find((voice) =>
      (voice.lang || "").toLowerCase().startsWith(languagePrefix),
    );

    return localeVoice || availableVoices[0];
  }, [accessibility?.voiceName, availableVoices, language]);

  const stopSpeech = useCallback(
    ({ onlyAuto = false, clearStatus = false } = {}) => {
      if (!isBrowserSpeechAvailable) return;
      if (onlyAuto && speechModeRef.current !== "auto") return;
      clearScheduledAutoSpeak();
      window.speechSynthesis.cancel();
      utteranceRef.current = null;
      speechModeRef.current = "idle";
      setIsSpeaking(false);
      setIsPaused(false);
      if (clearStatus) {
        setStatusMessage("");
      }
    },
    [clearScheduledAutoSpeak, isBrowserSpeechAvailable],
  );

  const speakElementText = useCallback(
    (rawText) => {
      const normalized = String(rawText || "").replace(/\s+/g, " ").trim();
      if (!normalized) return;

      if (!isBrowserSpeechAvailable) {
        setStatusMessage(ui.unavailable);
        return;
      }

      const utterance = new SpeechSynthesisUtterance();
      utterance.text = normalized.slice(0, AUTO_SPEAK_MAX_CHARS);
      utterance.lang = resolveLanguageCode(language);
      utterance.rate = currentVoiceRate;
      utterance.pitch = 1;

      const selectedVoice = getVoiceForSpeech();
      if (selectedVoice) {
        utterance.voice = selectedVoice;
      }

      utterance.onend = () => {
        speechModeRef.current = "idle";
        setIsSpeaking(false);
        setIsPaused(false);
      };

      utterance.onerror = () => {
        speechModeRef.current = "idle";
        setIsSpeaking(false);
        setIsPaused(false);
        setStatusMessage(ui.unavailable);
      };

      try {
        window.speechSynthesis.cancel();
        utteranceRef.current = utterance;
        speechModeRef.current = "auto";
        window.speechSynthesis.speak(utterance);
        setIsSpeaking(true);
        setIsPaused(false);
        lastAutoTextRef.current = utterance.text;
      } catch {
        speechModeRef.current = "idle";
        setIsSpeaking(false);
        setIsPaused(false);
        setStatusMessage(ui.unavailable);
      }
    },
    [currentVoiceRate, getVoiceForSpeech, isBrowserSpeechAvailable, language, ui.unavailable],
  );

  useEffect(() => {
    const syncSettings = () => {
      setAccessibility(getStoredAccessibility());
    };

    const handleStorage = (event) => {
      if (!event || !event.key || event.key === SETTINGS_STORAGE_KEY) {
        syncSettings();
      }
    };

    const handleAccessibilityUpdate = () => {
      syncSettings();
    };

    window.addEventListener("storage", handleStorage);
    window.addEventListener("bh-accessibility-updated", handleAccessibilityUpdate);

    return () => {
      window.removeEventListener("storage", handleStorage);
      window.removeEventListener("bh-accessibility-updated", handleAccessibilityUpdate);
    };
  }, []);

  useEffect(() => {
    if (!isBrowserSpeechAvailable) {
      return;
    }

    const synth = window.speechSynthesis;
    const canUseEventListener = typeof synth.addEventListener === "function";

    const updateVoices = () => {
      setAvailableVoices(getSpeechVoices());
    };

    const updateTimer = window.setTimeout(updateVoices, 0);

    if (canUseEventListener) {
      synth.addEventListener("voiceschanged", updateVoices);
    } else {
      synth.onvoiceschanged = updateVoices;
    }

    return () => {
      window.clearTimeout(updateTimer);
      if (canUseEventListener) {
        synth.removeEventListener("voiceschanged", updateVoices);
      } else if (synth.onvoiceschanged === updateVoices) {
        synth.onvoiceschanged = null;
      }
    };
  }, [isBrowserSpeechAvailable]);

  useEffect(() => {
    if (!isBrowserSpeechAvailable) return;

    const stopTimer = window.setTimeout(() => {
      stopSpeech({ clearStatus: true });
    }, 0);

    return () => {
      window.clearTimeout(stopTimer);
    };
  }, [location.pathname, isBrowserSpeechAvailable, stopSpeech]);

  useEffect(() => {
    if (!isBrowserSpeechAvailable || accessibility?.screenReader) return;

    const stopTimer = window.setTimeout(() => {
      stopSpeech({ clearStatus: true });
    }, 0);

    return () => {
      window.clearTimeout(stopTimer);
    };
  }, [accessibility?.screenReader, isBrowserSpeechAvailable, stopSpeech]);

  useEffect(() => {
    if (!isBrowserSpeechAvailable || !accessibility?.screenReader) return;

    const onKeyDown = (event) => {
      const keyboardKeys = ["Tab", "ArrowUp", "ArrowDown", "ArrowLeft", "ArrowRight"];
      if (keyboardKeys.includes(event.key)) {
        keyboardNavigationRef.current = true;
      }
    };

    const onPointerDown = () => {
      keyboardNavigationRef.current = false;
    };

    window.addEventListener("keydown", onKeyDown, true);
    window.addEventListener("mousedown", onPointerDown, true);
    window.addEventListener("touchstart", onPointerDown, true);

    return () => {
      window.removeEventListener("keydown", onKeyDown, true);
      window.removeEventListener("mousedown", onPointerDown, true);
      window.removeEventListener("touchstart", onPointerDown, true);
    };
  }, [accessibility?.screenReader, isBrowserSpeechAvailable]);

  const playPage = () => {
    if (!isBrowserSpeechAvailable) {
      setStatusMessage(ui.unavailable);
      return;
    }

    const pageText = getReadablePageText();
    if (!pageText) {
      setStatusMessage(ui.noContent);
      return;
    }

    const utterance = new SpeechSynthesisUtterance();
    utterance.text = pageText.slice(0, 3200);
    utterance.lang = resolveLanguageCode(language);
    utterance.rate = currentVoiceRate;
    utterance.pitch = 1;

    const selectedVoice = getVoiceForSpeech();
    if (selectedVoice) {
      utterance.voice = selectedVoice;
    }

    utterance.onend = () => {
      speechModeRef.current = "idle";
      setIsSpeaking(false);
      setIsPaused(false);
    };

    utterance.onerror = () => {
      speechModeRef.current = "idle";
      setIsSpeaking(false);
      setIsPaused(false);
      setStatusMessage(ui.unavailable);
    };

    try {
      clearScheduledAutoSpeak();
      window.speechSynthesis.cancel();
      utteranceRef.current = utterance;
      speechModeRef.current = "manual";
      window.speechSynthesis.speak(utterance);
      setIsSpeaking(true);
      setIsPaused(false);
      setStatusMessage("");
    } catch {
      speechModeRef.current = "idle";
      setIsSpeaking(false);
      setIsPaused(false);
      setStatusMessage(ui.unavailable);
    }
  };

  const pauseSpeech = () => {
    if (!isBrowserSpeechAvailable) return;
    if (window.speechSynthesis.speaking && !window.speechSynthesis.paused) {
      window.speechSynthesis.pause();
      setIsPaused(true);
      setIsSpeaking(true);
    }
  };

  const resumeSpeech = () => {
    if (!isBrowserSpeechAvailable) return;
    if (window.speechSynthesis.paused) {
      window.speechSynthesis.resume();
      setIsPaused(false);
      setIsSpeaking(true);
    }
  };

  useEffect(() => {
    if (!isBrowserSpeechAvailable || !accessibility?.screenReader) return;

    const scheduleElementSpeech = (element) => {
      if (!element) return;
      if (speechModeRef.current === "manual") return;

      const text = getElementSpeechText(element);
      if (!text) return;

      const normalized = text.replace(/\s+/g, " ").trim();
      if (!normalized) return;

      if (
        speechModeRef.current === "auto" &&
        window.speechSynthesis.speaking &&
        normalized === lastAutoTextRef.current
      ) {
        return;
      }

      clearScheduledAutoSpeak();
      hoverSpeakTimeoutRef.current = window.setTimeout(() => {
        speakElementText(normalized);
      }, AUTO_SPEAK_DELAY_MS);
    };

    const handleMouseOver = (event) => {
      const target = getSpeechTargetElement(event.target, dockRef.current);
      scheduleElementSpeech(target);
    };

    const handleMouseOut = (event) => {
      const fromTarget = getSpeechTargetElement(event.target, dockRef.current);
      if (!fromTarget) return;

      const toTarget = getSpeechTargetElement(event.relatedTarget, dockRef.current);
      if (fromTarget === toTarget) return;

      clearScheduledAutoSpeak();
      stopSpeech({ onlyAuto: true });
    };

    const handleFocusIn = (event) => {
      if (!keyboardNavigationRef.current) return;
      const target = getSpeechTargetElement(event.target, dockRef.current);
      scheduleElementSpeech(target);
    };

    const handleFocusOut = (event) => {
      const fromTarget = getSpeechTargetElement(event.target, dockRef.current);
      if (!fromTarget) return;

      const toTarget = getSpeechTargetElement(event.relatedTarget, dockRef.current);
      if (fromTarget === toTarget) return;

      clearScheduledAutoSpeak();
      stopSpeech({ onlyAuto: true });
    };

    document.addEventListener("mouseover", handleMouseOver, true);
    document.addEventListener("mouseout", handleMouseOut, true);
    document.addEventListener("focusin", handleFocusIn, true);
    document.addEventListener("focusout", handleFocusOut, true);

    return () => {
      clearScheduledAutoSpeak();
      document.removeEventListener("mouseover", handleMouseOver, true);
      document.removeEventListener("mouseout", handleMouseOut, true);
      document.removeEventListener("focusin", handleFocusIn, true);
      document.removeEventListener("focusout", handleFocusOut, true);
    };
  }, [accessibility?.screenReader, isBrowserSpeechAvailable, speakElementText, stopSpeech, clearScheduledAutoSpeak]);

  if (!accessibility?.screenReader) {
    return null;
  }

  return (
    <div
      ref={dockRef}
      className={`fixed bottom-5 z-50 ${
        isRTL ? "left-5" : "right-5"
      } pointer-events-none`}
    >
      <div
        className={`pointer-events-auto rounded-2xl border px-3 py-2 shadow-xl backdrop-blur ${
          theme === "dark"
            ? "border-gray-600 bg-gray-900/95 text-gray-100"
            : "border-gray-300 bg-white/95 text-gray-800"
        }`}
      >
        <div className={`mb-2 flex items-center gap-2 text-xs font-semibold ${isRTL ? "flex-row-reverse" : ""}`}>
          <Volume2 className="h-4 w-4 text-cyan-600" />
          <span>{ui.title}</span>
        </div>

        <div className={`flex flex-wrap items-center gap-2 ${isRTL ? "justify-end" : ""}`}>
          <button
            type="button"
            onClick={isPaused ? resumeSpeech : playPage}
            className={`inline-flex items-center gap-1.5 rounded-lg border px-2.5 py-1.5 text-xs font-medium ${
              theme === "dark"
                ? "border-gray-500 bg-gray-800 hover:bg-gray-700"
                : "border-gray-300 bg-white hover:bg-gray-100"
            } ${isRTL ? "flex-row-reverse" : ""}`}
          >
            <Play className="h-3.5 w-3.5" />
            {isPaused ? ui.resume : ui.play}
          </button>

          <button
            type="button"
            onClick={pauseSpeech}
            disabled={!isSpeaking || isPaused}
            className={`inline-flex items-center gap-1.5 rounded-lg border px-2.5 py-1.5 text-xs font-medium disabled:cursor-not-allowed disabled:opacity-50 ${
              theme === "dark"
                ? "border-gray-500 bg-gray-800 hover:bg-gray-700"
                : "border-gray-300 bg-white hover:bg-gray-100"
            } ${isRTL ? "flex-row-reverse" : ""}`}
          >
            <Pause className="h-3.5 w-3.5" />
            {ui.pause}
          </button>

          <button
            type="button"
            onClick={stopSpeech}
            disabled={!isSpeaking && !isPaused}
            className={`inline-flex items-center gap-1.5 rounded-lg border px-2.5 py-1.5 text-xs font-medium disabled:cursor-not-allowed disabled:opacity-50 ${
              theme === "dark"
                ? "border-red-800 bg-red-900/40 text-red-200 hover:bg-red-900/50"
                : "border-red-300 bg-red-50 text-red-700 hover:bg-red-100"
            } ${isRTL ? "flex-row-reverse" : ""}`}
          >
            <Square className="h-3.5 w-3.5" />
            {ui.stop}
          </button>
        </div>

        {statusMessage && (
          <p className={`mt-2 max-w-72 text-[11px] leading-relaxed ${theme === "dark" ? "text-amber-300" : "text-amber-700"}`}>
            {statusMessage}
          </p>
        )}
      </div>
    </div>
  );
}
