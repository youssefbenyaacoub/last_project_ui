import { useState, useRef, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { ArrowUp, X, Menu, Plus, MessageSquare, Clock3 } from "lucide-react";
import { useTheme } from "../contexts/ThemeContext";
import { useLanguage } from "../contexts/LanguageContext";

const CHATBOT_TEXTS = {
  en: {
    suggestedQuestions: [
      "Check my balance",
      "Make a transfer",
      "Banking products",
      "Interest rates",
    ],
    conversations: "Conversations",
    startConversation: "Start new conversation",
    emptyConversations: "Your conversation list will appear here.",
    assistantTitle: "BHint Assistant",
    assistantSubtitle: "Smart help for your daily banking questions.",
    helpTitle: "How can I help you today?",
    helpSubtitle: "Choose a suggestion below or type your own message.",
    inputPlaceholder: "Type your question...",
    botResponses: {
      balance:
        "Your current balance is 8,450.75 TND. Your last transaction was on February 5, 2025.",
      transfer:
        "To make a transfer, go to your Dashboard and click on 'Quick Transfer'.",
      products:
        "BH Bank offers savings accounts (PEL, DHAMEN), personal and home loans, and investment solutions. Would you like a personalised recommendation?",
      rates:
        "Current rates: Personal loan 9.5%/yr, Home loan 7.2%/yr, Classic PEL 4.5%/yr. Use the simulator for detailed calculations.",
      complaint:
        "To file a complaint, go to the 'Claims Management' section. We process every request within 48 hours.",
      transactions:
        "Your recent transactions include: Netflix subscription (15.99 TND), Transfer to Sarah Johnson (250.00 TND), and Grocery shopping (87.50 TND).",
      default:
        "I'm here to help! You can ask me about your balance, transfers, banking products, interest rates, or file a complaint.",
    },
  },
  fr: {
    suggestedQuestions: [
      "Verifier mon solde",
      "Faire un virement",
      "Produits bancaires",
      "Taux d'interet",
    ],
    conversations: "Conversations",
    startConversation: "Nouvelle conversation",
    emptyConversations: "Votre liste de conversations apparaitra ici.",
    assistantTitle: "Assistant BHint",
    assistantSubtitle: "Aide intelligente pour vos questions bancaires quotidiennes.",
    helpTitle: "Comment puis-je vous aider aujourd'hui ?",
    helpSubtitle: "Choisissez une suggestion ci-dessous ou ecrivez votre message.",
    inputPlaceholder: "Ecrivez votre question...",
    botResponses: {
      balance:
        "Votre solde actuel est de 8 450,75 TND. Votre derniere transaction date du 5 fevrier 2025.",
      transfer:
        "Pour effectuer un virement, allez dans votre Tableau de bord puis cliquez sur 'Virement rapide'.",
      products:
        "BH Bank propose des comptes epargne (PEL, DHAMEN), des credits personnels et immobiliers, ainsi que des solutions d'investissement. Voulez-vous une recommandation personnalisee ?",
      rates:
        "Taux actuels : credit personnel 9,5%/an, credit immobilier 7,2%/an, PEL classique 4,5%/an. Utilisez le simulateur pour un calcul detaille.",
      complaint:
        "Pour deposer une reclamation, allez dans la section 'Gestion des reclamations'. Nous traitons chaque demande sous 48 heures.",
      transactions:
        "Vos transactions recentes incluent : abonnement Netflix (15,99 TND), virement vers Sarah Johnson (250,00 TND) et courses alimentaires (87,50 TND).",
      default:
        "Je suis la pour vous aider ! Vous pouvez me demander votre solde, vos virements, les produits bancaires, les taux d'interet ou deposer une reclamation.",
    },
  },
  ar: {
    suggestedQuestions: [
      "تحقق من رصيدي",
      "اريد القيام بتحويل",
      "المنتجات البنكية",
      "نسب الفائدة",
    ],
    conversations: "المحادثات",
    startConversation: "محادثة جديدة",
    emptyConversations: "ستظهر قائمة محادثاتك هنا.",
    assistantTitle: "مساعد BHint",
    assistantSubtitle: "مساعدة ذكية لأسئلتك البنكية اليومية.",
    helpTitle: "كيف يمكنني مساعدتك اليوم؟",
    helpSubtitle: "اختر اقتراحا من الاسفل او اكتب رسالتك.",
    inputPlaceholder: "اكتب سؤالك...",
    botResponses: {
      balance:
        "رصيدك الحالي هو 8,450.75 TND. اخر عملية تمت بتاريخ 5 فيفري 2025.",
      transfer:
        "للقيام بتحويل، انتقل الى لوحة التحكم ثم اضغط على 'تحويل سريع'.",
      products:
        "يقدم BH Bank حسابات ادخار (PEL و DHAMEN)، وقروضا شخصية وعقارية، وحلول استثمار. هل تريد توصية مخصصة؟",
      rates:
        "النسب الحالية: قرض شخصي 9.5% سنويا، قرض سكني 7.2% سنويا، PEL كلاسيكي 4.5% سنويا. استخدم المحاكي لحساب ادق.",
      complaint:
        "لتقديم شكوى، اذهب الى قسم 'ادارة الشكاوى'. نقوم بمعالجة كل طلب خلال 48 ساعة.",
      transactions:
        "من عملياتك الاخيرة: اشتراك Netflix (15.99 TND)، تحويل الى Sarah Johnson (250.00 TND)، ومشتريات بقالة (87.50 TND).",
      default:
        "انا هنا لمساعدتك! يمكنك سؤالي عن رصيدك، التحويلات، المنتجات البنكية، نسب الفائدة او تقديم شكوى.",
    },
  },
};

const INTENT_KEYWORDS = {
  balance: ["balance", "solde", "رصيد", "الرصيد"],
  transfer: ["transfer", "virement", "تحويل", "حوالة"],
  products: ["product", "products", "produit", "produits", "منتج", "منتجات"],
  rates: ["rate", "rates", "taux", "interest", "interet", "فائدة", "فوائد", "نسبة"],
  complaint: ["complaint", "reclamation", "claim", "شكوى", "شكاية"],
  transactions: ["transaction", "transactions", "عملية", "عمليات", "معاملة", "معاملات"],
};

const truncateText = (text, maxLength) => {
  if (text.length <= maxLength) {
    return text;
  }
  return `${text.slice(0, maxLength).trim()}...`;
};

const formatTime = (date, language) => {
  const locale = language === "ar" ? "ar-TN" : language === "fr" ? "fr-FR" : "en-US";

  return new Intl.DateTimeFormat(locale, {
    hour: "2-digit",
    minute: "2-digit",
  }).format(date);
};

export function Chatbot() {
  const { theme } = useTheme();
  const { language, isRTL } = useLanguage();
  const isDark = theme === "dark";
  const ui = CHATBOT_TEXTS[language] || CHATBOT_TEXTS.en;

  const [messages, setMessages] = useState([]);
  const [input, setInput] = useState("");
  const [showSuggestions, setShowSuggestions] = useState(true);
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const [conversations, setConversations] = useState([]);
  const [activeConversationId, setActiveConversationId] = useState(null);

  const bottomRef = useRef(null);

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  const getBotResponse = (text) => {
    const lowerText = text.toLowerCase();

    if (INTENT_KEYWORDS.balance.some((keyword) => lowerText.includes(keyword))) {
      return ui.botResponses.balance;
    }
    if (INTENT_KEYWORDS.transfer.some((keyword) => lowerText.includes(keyword))) {
      return ui.botResponses.transfer;
    }
    if (INTENT_KEYWORDS.products.some((keyword) => lowerText.includes(keyword))) {
      return ui.botResponses.products;
    }
    if (INTENT_KEYWORDS.rates.some((keyword) => lowerText.includes(keyword))) {
      return ui.botResponses.rates;
    }
    if (INTENT_KEYWORDS.complaint.some((keyword) => lowerText.includes(keyword))) {
      return ui.botResponses.complaint;
    }
    if (INTENT_KEYWORDS.transactions.some((keyword) => lowerText.includes(keyword))) {
      return ui.botResponses.transactions;
    }

    return ui.botResponses.default;
  };

  const startNewConversation = () => {
    setMessages([]);
    setShowSuggestions(true);
    setActiveConversationId(null);
    setInput("");
    setIsSidebarOpen(false);
  };

  const openConversation = (conversationId) => {
    const selectedConversation = conversations.find(
      (conversation) => conversation.id === conversationId,
    );

    if (!selectedConversation) {
      return;
    }

    setActiveConversationId(conversationId);
    setMessages(selectedConversation.messages);
    setShowSuggestions(selectedConversation.messages.length === 0);
    setIsSidebarOpen(false);
  };

  const upsertConversation = (conversationId, userText, nextMessages) => {
    const now = new Date();
    const title = truncateText(userText, 38);
    const preview = truncateText(userText, 70);

    setConversations((previous) => {
      const existing = previous.find(
        (conversation) => conversation.id === conversationId,
      );

      const updatedConversation = existing
        ? {
            ...existing,
            title: existing.title || title,
            preview,
            updatedAt: now,
            messages: nextMessages,
          }
        : {
            id: conversationId,
            title,
            preview,
            updatedAt: now,
            messages: nextMessages,
          };

      return [
        updatedConversation,
        ...previous.filter((conversation) => conversation.id !== conversationId),
      ];
    });
  };

  const sendMessage = (text) => {
    if (!text.trim()) {
      return;
    }

    setShowSuggestions(false);

    const now = new Date();
    const userMsg = { from: "user", text, timestamp: now };
    const botReply = {
      from: "bot",
      text: getBotResponse(text),
      timestamp: new Date(),
    };

    const nextMessages = [...messages, userMsg, botReply];
    setMessages(nextMessages);

    const conversationId = activeConversationId ?? Date.now();
    if (!activeConversationId) {
      setActiveConversationId(conversationId);
    }

    upsertConversation(conversationId, text, nextMessages);
    setInput("");
  };

  const handleSuggestedQuestion = (question) => {
    sendMessage(question);
  };

  const SidebarContent = () => {
    return (
      <>
        <div
          className={`border-b px-4 py-4 ${
            isDark ? "border-white/10" : "border-[#e5ebf4]"
          }`}
        >
          <div className="mb-3 flex items-center justify-between">
            <h2 className="text-sm font-semibold uppercase tracking-wide">
              {ui.conversations}
            </h2>
            <span
              className={`rounded-full px-2 py-0.5 text-xs font-semibold ${
                isDark ? "bg-white/10 text-white/80" : "bg-[#edf2fb] text-[#0A2240]"
              }`}
            >
              {conversations.length}
            </span>
          </div>

          <button
            type="button"
            onClick={startNewConversation}
            className="inline-flex w-full items-center justify-center gap-2 rounded-xl bg-[#0A2240] px-3 py-2.5 text-sm font-semibold text-white transition-colors hover:bg-[#12305b] cursor-pointer"
          >
            <Plus size={16} />
            {ui.startConversation}
          </button>
        </div>

        <div className="flex-1 space-y-2 overflow-y-auto p-3">
          {conversations.length === 0 ? (
            <div
              className={`rounded-xl border px-3 py-4 text-sm ${
                isDark ? "border-white/10 text-white/60" : "border-[#e1e7f0] text-[#6b7a93]"
              }`}
            >
              {ui.emptyConversations}
            </div>
          ) : (
            conversations.map((conversation) => {
              const isActive = conversation.id === activeConversationId;

              return (
                <button
                  key={conversation.id}
                  type="button"
                  onClick={() => openConversation(conversation.id)}
                  className={`w-full rounded-xl border px-3 py-2.5 transition-colors cursor-pointer ${
                    isRTL ? "text-right" : "text-left"
                  } ${
                    isActive
                      ? isDark
                        ? "border-[#305a95] bg-[#15243b]"
                        : "border-[#b7c8e6] bg-[#eef3fb]"
                      : isDark
                        ? "border-white/10 hover:bg-white/5"
                        : "border-[#e2e8f2] hover:bg-[#f5f8fd]"
                  }`}
                >
                  <div className={`flex items-start gap-2.5 ${isRTL ? "flex-row-reverse" : ""}`}>
                    <MessageSquare
                      size={15}
                      className={isDark ? "mt-0.5 text-white/70" : "mt-0.5 text-text-muted"}
                    />

                    <div className="min-w-0 flex-1">
                      <p
                        className={`truncate text-sm font-semibold ${
                          isDark ? "text-white" : "text-[#1b2c4a]"
                        }`}
                      >
                        {conversation.title}
                      </p>
                      <p
                        className={`mt-0.5 truncate text-xs ${
                          isDark ? "text-white/60" : "text-[#6b7a93]"
                        }`}
                      >
                        {conversation.preview}
                      </p>
                    </div>
                  </div>

                  <div
                    className={`mt-1.5 flex items-center gap-1 text-[11px] ${
                      isDark ? "text-white/50" : "text-[#8a98ad]"
                    } ${isRTL ? "flex-row-reverse justify-end" : ""}`}
                  >
                    <Clock3 size={12} />
                    {formatTime(conversation.updatedAt, language)}
                  </div>
                </button>
              );
            })
          )}
        </div>
      </>
    );
  };

  return (
    <div
      className={`relative flex h-screen overflow-hidden ${
        isDark ? "bg-[#0f172a] text-white" : "bg-[#f6f8fb] text-[#182540]"
      } ${isRTL ? "flex-row-reverse" : ""}`}
    >
      {/* Desktop Sidebar */}
      <aside
        className={`hidden w-80 shrink-0 flex-col ${isRTL ? "border-l" : "border-r"} lg:flex ${
          isDark ? "border-white/10 bg-[#101b2e]" : "border-[#dfe6f1] bg-white/95"
        }`}
      >
        <SidebarContent />
      </aside>

      {/* Mobile Sidebar */}
      <AnimatePresence>
        {isSidebarOpen && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="absolute inset-0 z-40 bg-[#0A2240]/35 backdrop-blur-[1px] lg:hidden"
            onClick={() => setIsSidebarOpen(false)}
          >
            <motion.aside
              initial={{ x: isRTL ? "100%" : "-100%" }}
              animate={{ x: 0 }}
              exit={{ x: isRTL ? "100%" : "-100%" }}
              transition={{ type: "tween", duration: 0.25 }}
              className={`h-full w-[86%] max-w-sm ${isRTL ? "ml-auto border-l" : "border-r"} ${
                isDark ? "border-white/10 bg-[#101b2e]" : "border-[#dfe6f1] bg-white"
              }`}
              onClick={(event) => event.stopPropagation()}
            >
              <div
                className={`flex items-center justify-between border-b px-4 py-4 ${
                  isDark ? "border-white/10" : "border-[#e5ebf4]"
                }`}
              >
                <h3 className="text-base font-semibold">BHint</h3>
                <button
                  type="button"
                  onClick={() => setIsSidebarOpen(false)}
                  className="rounded-lg p-1.5 hover:bg-black/5 cursor-pointer"
                >
                  <X size={18} />
                </button>
              </div>

              <SidebarContent />
            </motion.aside>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Main Area */}
      <div className="flex min-w-0 flex-1 flex-col">
        <header
          className={`sticky top-0 z-20 border-b px-4 py-4 sm:px-6 ${
            isDark ? "border-white/10 bg-[#0f172a]/95" : "border-[#e2e8f2] bg-[#f6f8fb]/95"
          } backdrop-blur-sm`}
        >
          <div className={`flex items-center justify-between gap-3 ${isRTL ? "flex-row-reverse" : ""}`}>
            <div className={`flex items-center gap-3 ${isRTL ? "flex-row-reverse" : ""}`}>
              <button
                type="button"
                onClick={() => setIsSidebarOpen(true)}
                className={`inline-flex h-9 w-9 items-center justify-center rounded-lg lg:hidden ${
                  isDark ? "bg-white/10 hover:bg-white/15" : "bg-white hover:bg-[#edf2fb]"
                } cursor-pointer`}
              >
                <Menu size={18} />
              </button>

              <div>
                <h1 className={`text-xl font-semibold tracking-tight sm:text-2xl ${isRTL ? "text-right" : "text-left"}`}>
                  {ui.assistantTitle}
                </h1>
                <p className={`text-xs sm:text-sm ${isDark ? "text-white/60" : "text-[#6b7a93]"} ${isRTL ? "text-right" : "text-left"}`}>
                  {ui.assistantSubtitle}
                </p>
              </div>
            </div>

            <button
              type="button"
              onClick={startNewConversation}
              className={`hidden items-center gap-2 rounded-lg px-3 py-2 text-sm font-semibold transition-colors sm:inline-flex ${
                isDark
                  ? "bg-[#0A2240] text-white hover:bg-[#12305b]"
                  : "bg-[#0A2240] text-white hover:bg-[#12305b]"
              } cursor-pointer`}
            >
              <Plus size={16} />
              {ui.startConversation}
            </button>
          </div>
        </header>

        <div className="flex-1 overflow-y-auto px-4 py-6 sm:px-8">
          <div className="mx-auto w-full max-w-3xl">
            {showSuggestions && messages.length === 0 ? (
              <motion.div
                initial={{ opacity: 0, scale: 0.96 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ duration: 0.35 }}
                className="flex min-h-[55vh] flex-col items-center justify-center space-y-7"
              >
                <div className="space-y-2 text-center">
                  <h2
                    className={`text-3xl font-semibold sm:text-4xl ${
                      isDark ? "text-white" : "text-[#152644]"
                    }`}
                  >
                      {ui.helpTitle}
                  </h2>
                  <p className={`text-sm ${isDark ? "text-white/60" : "text-[#6b7a93]"}`}>
                      {ui.helpSubtitle}
                  </p>
                </div>

                <div className="grid w-full max-w-2xl gap-3 sm:grid-cols-2">
                    {ui.suggestedQuestions.map((question, index) => (
                    <motion.button
                        key={question}
                      initial={{ opacity: 0, y: 12 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ delay: 0.1 + index * 0.07 }}
                      whileHover={{ scale: 1.01 }}
                      whileTap={{ scale: 0.99 }}
                        onClick={() => handleSuggestedQuestion(question)}
                      className={`rounded-2xl border p-4 text-left transition-all hover:-translate-y-0.5 hover:shadow-md cursor-pointer ${
                        isDark
                          ? "border-white/10 bg-white/5 text-white hover:border-[#6c8dc4]"
                          : "border-[#dbe4f1] bg-white text-[#1c2e4f] hover:border-[#9fb6d9]"
                        } ${isRTL ? "text-right" : "text-left"}`}
                    >
                        <span className="text-sm font-medium">{question}</span>
                    </motion.button>
                  ))}
                </div>
              </motion.div>
            ) : (
              <div className="space-y-4 pb-2">
                <AnimatePresence>
                  {messages.map((message, index) => (
                    <motion.div
                      key={index}
                      initial={{ opacity: 0, y: 10 }}
                      animate={{ opacity: 1, y: 0 }}
                      exit={{ opacity: 0, y: 6 }}
                      transition={{ duration: 0.25 }}
                      className={`flex ${
                        message.from === "user"
                          ? isRTL
                            ? "justify-start"
                            : "justify-end"
                          : isRTL
                            ? "justify-end"
                            : "justify-start"
                      }`}
                    >
                      <div
                        className={`max-w-[85%] rounded-2xl border px-4 py-3 text-sm leading-relaxed shadow-sm sm:max-w-[75%] ${
                          message.from === "user"
                            ? "border-[#0A2240] bg-[#0A2240] text-white"
                            : isDark
                              ? "border-white/10 bg-[#182235] text-gray-100"
                              : "border-[#e1e7f0] bg-white text-[#182540]"
                        } ${isRTL ? "text-right" : "text-left"}`}
                      >
                        <p>{message.text}</p>
                        <p
                          className={`mt-1 text-[11px] ${
                            message.from === "user"
                              ? "text-white/70"
                              : isDark
                                ? "text-gray-400"
                                : "text-[#8a98ad]"
                          } ${isRTL ? "text-left" : "text-right"}`}
                        >
                          {formatTime(message.timestamp, language)}
                        </p>
                      </div>
                    </motion.div>
                  ))}
                </AnimatePresence>
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
              className={`flex items-center gap-2 rounded-2xl border px-3 py-2 shadow-sm ${
                isDark
                  ? "border-white/10 bg-[#182235]"
                  : "border-[#d9e2ef] bg-white"
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
                placeholder={ui.inputPlaceholder}
                className={`flex-1 bg-transparent text-sm outline-none ${
                  isDark
                    ? "text-white placeholder:text-white/45"
                    : "text-[#182540] placeholder:text-[#8a98ad]"
                } ${isRTL ? "text-right" : "text-left"}`}
              />

              <button
                type="button"
                onClick={() => sendMessage(input)}
                disabled={!input.trim()}
                className="inline-flex h-10 w-10 items-center justify-center rounded-xl bg-[#0A2240] text-white transition-colors hover:bg-[#12305b] disabled:cursor-not-allowed disabled:opacity-45"
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
