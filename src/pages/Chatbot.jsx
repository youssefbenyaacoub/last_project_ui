import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import { ArrowUp, Menu, Plus, X, AlertCircle } from "lucide-react";
import { useTheme } from "../contexts/ThemeContext";
import { useLanguage } from "../contexts/LanguageContext";
import {
  createChatSession,
  getChatHistory,
  getClientId,
  listChatSessions,
  sendChatMessage,
} from "../api";

const uiByLanguage = {
  en: {
    conversationsTitle: "Conversations",
    newConversation: "New conversation",
    loadingConversations: "Loading conversations...",
    connectSubtitle: "Connected to the recommendation backend engine.",
    emptyPromptTitle: "How can I help you today?",
    quickPrompts: [
      "Which products do you recommend for me?",
      "How can I improve my financial profile?",
      "I need a home loan.",
      "Show me my current situation.",
    ],
    messagePlaceholder: "Write your message...",
    noResponse: "No response returned.",
    sessionMissing: "Missing session. Please log in to use the chatbot.",
    loadSessionsError: "Unable to load conversations.",
    loadConversationError: "Unable to load this conversation.",
    createConversationError: "Unable to create a new conversation.",
    sendError: "Error while sending your message.",
    conversationFallback: "Conversation",
    chatbotTitle: "BH Advisor Chatbot",
    chatbotShortName: "BH Advisor",
    typingLabel: "is replying...",
  },
  fr: {
    conversationsTitle: "Conversations",
    newConversation: "Nouvelle conversation",
    loadingConversations: "Chargement des conversations...",
    connectSubtitle: "Connecte au moteur backend de recommandations.",
    emptyPromptTitle: "Comment puis-je vous aider ?",
    quickPrompts: [
      "Quels produits me recommandez-vous ?",
      "Comment ameliorer mon profil financier ?",
      "J'ai besoin d'un credit logement.",
      "Montrez-moi ma situation actuelle.",
    ],
    messagePlaceholder: "Ecrivez votre message...",
    noResponse: "Aucune reponse retournee.",
    sessionMissing: "Session absente. Connectez-vous pour utiliser le chatbot.",
    loadSessionsError: "Impossible de charger les conversations.",
    loadConversationError: "Impossible de charger cette conversation.",
    createConversationError: "Impossible de creer une nouvelle conversation.",
    sendError: "Erreur lors de l'envoi du message.",
    conversationFallback: "Conversation",
    chatbotTitle: "BH Advisor Chatbot",
    chatbotShortName: "BH Advisor",
    typingLabel: "repond...",
  },
  ar: {
    conversationsTitle: "المحادثات",
    newConversation: "محادثة جديدة",
    loadingConversations: "جاري تحميل المحادثات...",
    connectSubtitle: "متصل بمحرك التوصيات الخلفي.",
    emptyPromptTitle: "كيف يمكنني مساعدتك اليوم؟",
    quickPrompts: [
      "ما هي المنتجات التي تنصحني بها؟",
      "كيف احسن ملفي المالي؟",
      "احتاج الى قرض سكن.",
      "اعرض وضعي الحالي.",
    ],
    messagePlaceholder: "اكتب رسالتك...",
    noResponse: "لم يتم ارجاع اي رد.",
    sessionMissing: "لا توجد جلسة. الرجاء تسجيل الدخول لاستخدام المساعد.",
    loadSessionsError: "تعذر تحميل المحادثات.",
    loadConversationError: "تعذر تحميل هذه المحادثة.",
    createConversationError: "تعذر انشاء محادثة جديدة.",
    sendError: "حدث خطا عند ارسال الرسالة.",
    conversationFallback: "محادثة",
    chatbotTitle: "مساعد BH Advisor",
    chatbotShortName: "BH Advisor",
    typingLabel: "يقوم بالرد...",
  },
};

const getLangKey = (language) => {
  if (language === "ar") return "ar";
  if (language === "en") return "en";
  return "fr";
};

const getLocale = (langKey) => {
  if (langKey === "ar") return "ar-TN";
  if (langKey === "en") return "en-US";
  return "fr-FR";
};

const formatTime = (value, locale) => {
  if (!value) return "";
  const date = new Date(value);
  if (Number.isNaN(date.getTime())) return "";
  return new Intl.DateTimeFormat(locale, {
    hour: "2-digit",
    minute: "2-digit",
  }).format(date);
};

export function Chatbot() {
  const { theme } = useTheme();
  const { language, isRTL } = useLanguage();

  const langKey = getLangKey(language);
  const ui = uiByLanguage[langKey] || uiByLanguage.fr;
  const locale = getLocale(langKey);
  const accentColor = "#0A2240";
  const isDark = theme === "dark";

  const [loading, setLoading] = useState(true);
  const [sending, setSending] = useState(false);
  const [error, setError] = useState("");
  const [input, setInput] = useState("");
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);

  const [sessions, setSessions] = useState([]);
  const [activeSessionId, setActiveSessionId] = useState(null);
  const [messages, setMessages] = useState([]);

  const bottomRef = useRef(null);
  const clientId = getClientId();

  const userBubbleStyle = useMemo(
    () => ({
      backgroundColor: accentColor,
      borderColor: accentColor,
      color: "#ffffff",
    }),
    [],
  );

  const assistantBubbleStyle = useMemo(
    () =>
      isDark
        ? {
            backgroundColor: "#182235",
            borderColor: "#3f4b5f",
            color: "#f3f6ff",
          }
        : {
            backgroundColor: "#ffffff",
            borderColor: "#e1e7f0",
            color: "#182540",
          },
    [isDark],
  );

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages, sending]);

  const loadSessions = useCallback(async () => {
    if (!clientId) {
      setError(ui.sessionMissing);
      setLoading(false);
      return;
    }

    try {
      setLoading(true);
      setError("");
      const data = await listChatSessions(clientId);
      const nextSessions = Array.isArray(data?.sessions) ? data.sessions : [];
      setSessions(nextSessions);

      if (nextSessions.length > 0) {
        const firstSessionId = nextSessions[0].id;
        setActiveSessionId(firstSessionId);
        const history = await getChatHistory(clientId, firstSessionId);
        setMessages(
          (history?.history || []).map((entry) => ({
            role: entry.role,
            content: entry.content,
            timestamp: entry.timestamp,
          })),
        );
      } else {
        setMessages([]);
        setActiveSessionId(null);
      }
    } catch (err) {
      setError(err.message || ui.loadSessionsError);
    } finally {
      setLoading(false);
    }
  }, [clientId, ui]);

  useEffect(() => {
    loadSessions();
  }, [loadSessions]);

  const openSession = async (sessionId) => {
    try {
      setActiveSessionId(sessionId);
      setError("");
      const history = await getChatHistory(clientId, sessionId);
      setMessages(
        (history?.history || []).map((entry) => ({
          role: entry.role,
          content: entry.content,
          timestamp: entry.timestamp,
        })),
      );
      setIsSidebarOpen(false);
    } catch (err) {
      setError(err.message || ui.loadConversationError);
    }
  };

  const handleNewConversation = async () => {
    if (!clientId) return;
    try {
      const created = await createChatSession(clientId);
      const session = created?.session;
      if (session?.id) {
        setSessions((prev) => [session, ...prev]);
        setActiveSessionId(session.id);
        setMessages([]);
        setIsSidebarOpen(false);
      }
    } catch (err) {
      setError(err.message || ui.createConversationError);
    }
  };

  const sendMessage = async (text) => {
    const messageText = text.trim();
    if (!messageText || !clientId || sending) return;

    const optimisticUserMessage = {
      role: "user",
      content: messageText,
      timestamp: new Date().toISOString(),
    };

    setMessages((prev) => [...prev, optimisticUserMessage]);
    setInput("");
    setSending(true);
    setError("");

    try {
      const response = await sendChatMessage(clientId, messageText, activeSessionId || undefined);

      setMessages((prev) => [
        ...prev,
        {
          role: "assistant",
          content: response?.response || ui.noResponse,
          timestamp: new Date().toISOString(),
        },
      ]);

      if (response?.session_id && response.session_id !== activeSessionId) {
        setActiveSessionId(response.session_id);
      }

      await loadSessions();
    } catch (err) {
      setError(err.message || ui.sendError);
    } finally {
      setSending(false);
    }
  };

  const emptyState = useMemo(() => messages.length === 0 && !loading, [messages, loading]);

  return (
    <div
      className={`relative flex h-screen overflow-hidden ${
        isDark ? "bg-[#0f172a] text-white" : "bg-[#f6f8fb] text-[#182540]"
      } ${isRTL ? "flex-row-reverse" : ""}`}
    >
      <aside
        className={`hidden w-80 shrink-0 flex-col ${isRTL ? "border-l" : "border-r"} lg:flex ${
          isDark ? "border-white/10 bg-[#101b2e]" : "border-[#dfe6f1] bg-white/95"
        }`}
      >
        <div className={`border-b px-4 py-4 ${isDark ? "border-white/10" : "border-[#e5ebf4]"}`}>
          <button
            type="button"
            onClick={handleNewConversation}
            style={{ backgroundColor: accentColor }}
            className="inline-flex w-full items-center justify-center gap-2 rounded-xl px-3 py-2.5 text-sm font-semibold text-white hover:opacity-90"
          >
            <Plus size={16} />
            {ui.newConversation}
          </button>
        </div>

        <div className="flex-1 space-y-2 overflow-y-auto p-3">
          {sessions.map((session) => {
            const isActive = session.id === activeSessionId;
            return (
              <button
                key={session.id}
                type="button"
                onClick={() => openSession(session.id)}
                className={`w-full rounded-xl border px-3 py-2.5 text-left ${
                  isActive
                    ? isDark
                      ? "bg-[#15243b]"
                      : "bg-[#eef3fb]"
                    : isDark
                      ? "border-white/10 hover:bg-white/5"
                      : "border-[#e2e8f2] hover:bg-[#f5f8fd]"
                } ${isRTL ? "text-right" : "text-left"}`}
                style={
                  isActive
                    ? {
                        borderColor: accentColor,
                        boxShadow: isDark ? "0 0 0 1px rgba(255,255,255,0.04)" : "0 0 0 1px rgba(10,34,64,0.05)",
                      }
                    : undefined
                }
              >
                <p className="truncate text-sm font-semibold">{session.title || ui.conversationFallback}</p>
                <p className={`mt-1 text-xs ${isDark ? "text-white/60" : "text-[#6b7a93]"}`}>
                  {formatTime(session.updated_at, locale)}
                </p>
              </button>
            );
          })}
        </div>
      </aside>

      {isSidebarOpen && (
        <div
          className="absolute inset-0 z-40 bg-[#0A2240]/35 lg:hidden"
          onClick={() => setIsSidebarOpen(false)}
        >
          <aside
            className={`h-full w-[86%] max-w-sm ${isRTL ? "ml-auto border-l" : "border-r"} ${
              isDark ? "border-white/10 bg-[#101b2e]" : "border-[#dfe6f1] bg-white"
            }`}
            onClick={(event) => event.stopPropagation()}
          >
            <div className="flex items-center justify-between border-b px-4 py-4">
              <h3 className="text-base font-semibold">{ui.conversationsTitle}</h3>
              <button type="button" onClick={() => setIsSidebarOpen(false)} className="rounded-lg p-1.5">
                <X size={18} />
              </button>
            </div>
            <div className="p-3">
              <button
                type="button"
                onClick={handleNewConversation}
                style={{ backgroundColor: accentColor }}
                className="mb-3 inline-flex w-full items-center justify-center gap-2 rounded-xl px-3 py-2.5 text-sm font-semibold text-white"
              >
                <Plus size={16} />
                {ui.newConversation}
              </button>
              <div className="space-y-2">
                {sessions.map((session) => (
                  <button
                    key={session.id}
                    type="button"
                    onClick={() => openSession(session.id)}
                    className="w-full rounded-lg border p-2 text-left text-sm"
                  >
                    {session.title || ui.conversationFallback}
                  </button>
                ))}
              </div>
            </div>
          </aside>
        </div>
      )}

      <div className="flex min-w-0 flex-1 flex-col">
        <header
          className={`sticky top-0 z-20 border-b px-4 py-4 sm:px-6 ${
            isDark ? "border-white/10 bg-[#0f172a]/95" : "border-[#e2e8f2] bg-[#f6f8fb]/95"
          }`}
        >
          <div className="flex items-center justify-between gap-3">
            <div className="flex items-center gap-3">
              <button
                type="button"
                onClick={() => setIsSidebarOpen(true)}
                className={`inline-flex h-9 w-9 items-center justify-center rounded-lg lg:hidden ${
                  isDark ? "bg-white/10" : "bg-white"
                }`}
              >
                <Menu size={18} />
              </button>
              <div>
                <h1 className="text-xl font-semibold tracking-tight sm:text-2xl">{ui.chatbotTitle}</h1>
                <p className={`text-xs sm:text-sm ${isDark ? "text-white/60" : "text-[#6b7a93]"}`}>
                  {ui.connectSubtitle}
                </p>
              </div>
            </div>
          </div>
        </header>

        <div className="flex-1 overflow-y-auto px-4 py-6 sm:px-8">
          {error && (
            <div
              className={`mx-auto mb-4 flex w-full max-w-3xl items-center gap-2 rounded-xl border p-4 text-sm ${
                isDark
                  ? "border-red-800 bg-red-950/30 text-red-300"
                  : "border-red-200 bg-red-50 text-red-700"
              }`}
            >
              <AlertCircle className="h-4 w-4" />
              {error}
            </div>
          )}

          <div className="mx-auto w-full max-w-3xl">
            {loading ? (
              <div className={`rounded-xl border p-4 ${isDark ? "border-white/10 bg-white/5" : "border-[#e2e8f2] bg-white"}`}>
                {ui.loadingConversations}
              </div>
            ) : emptyState ? (
              <div className="space-y-4">
                <h2 className="text-2xl font-semibold">{ui.emptyPromptTitle}</h2>
                <div className="grid gap-3 sm:grid-cols-2">
                  {ui.quickPrompts.map((prompt) => (
                    <button
                      key={prompt}
                      type="button"
                      onClick={() => sendMessage(prompt)}
                      className={`rounded-xl border p-3 text-left text-sm ${
                        isDark ? "border-white/10 bg-white/5 hover:bg-white/10" : "border-[#dbe4f1] bg-white"
                      } ${isRTL ? "text-right" : "text-left"}`}
                    >
                      {prompt}
                    </button>
                  ))}
                </div>
              </div>
            ) : (
              <div className="space-y-4 pb-2">
                {messages.map((message, index) => (
                  <div
                    key={`${message.role}-${index}`}
                    className={`flex ${
                      message.role === "user"
                        ? isRTL
                          ? "justify-start"
                          : "justify-end"
                        : isRTL
                          ? "justify-end"
                          : "justify-start"
                    }`}
                  >
                    <div
                      className="max-w-[85%] rounded-2xl border px-4 py-3 text-sm leading-relaxed sm:max-w-[75%]"
                      style={message.role === "user" ? userBubbleStyle : assistantBubbleStyle}
                    >
                      <p>{message.content}</p>
                      <p className={`mt-1 text-[11px] ${message.role === "user" ? "text-white/70" : isDark ? "text-gray-300" : "text-[#667892]"}`}>
                        {formatTime(message.timestamp, locale)}
                      </p>
                    </div>
                  </div>
                ))}

                {sending && (
                  <div className={isRTL ? "flex justify-end" : "flex justify-start"}>
                    <div
                      className="rounded-xl border px-4 py-2 text-sm"
                      style={assistantBubbleStyle}
                    >
                        {ui.chatbotShortName} {ui.typingLabel}
                    </div>
                  </div>
                )}

                <div ref={bottomRef} />
              </div>
            )}
          </div>
        </div>

        <div
          className={`border-t px-4 py-4 sm:px-6 ${
            isDark ? "border-white/10 bg-[#0f172a]" : "border-[#e2e8f2] bg-[#f6f8fb]"
          }`}
        >
          <div className="mx-auto w-full max-w-3xl">
            <div
              className={`flex items-center gap-2 rounded-2xl border px-3 py-2 ${
                isDark ? "border-white/10 bg-[#182235]" : "border-[#d9e2ef] bg-white"
              } ${isRTL ? "flex-row-reverse" : ""}`}
            >
              <input
                value={input}
                onChange={(event) => setInput(event.target.value)}
                onKeyDown={(event) => {
                  if (event.key === "Enter") {
                    event.preventDefault();
                    sendMessage(input);
                  }
                }}
                placeholder={ui.messagePlaceholder}
                className={`flex-1 bg-transparent text-sm outline-none ${
                  isDark ? "text-white placeholder:text-white/45" : "text-[#182540] placeholder:text-[#8a98ad]"
                } ${isRTL ? "text-right" : "text-left"}`}
              />

              <button
                type="button"
                onClick={() => sendMessage(input)}
                disabled={!input.trim() || sending}
                style={{ backgroundColor: accentColor }}
                className="inline-flex h-10 w-10 items-center justify-center rounded-xl text-white hover:opacity-90 disabled:opacity-45"
              >
                <ArrowUp size={16} />
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
