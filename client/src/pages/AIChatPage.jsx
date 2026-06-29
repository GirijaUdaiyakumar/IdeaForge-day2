import { useState, useRef, useEffect, useCallback, memo } from "react";
import { motion, AnimatePresence } from "framer-motion";
import ReactMarkdown from "react-markdown";
import remarkGfm from "remark-gfm";
import { toast } from "react-hot-toast";
import DashboardLayout from "../components/layouts/DashboardLayout";
import { chatWithAI, getChatHistory, deleteChat } from "../services/aiService";
import {
  RiSendPlaneLine, RiDeleteBin6Line, RiAddLine,
  RiHistoryLine, RiFileCopyLine, RiCheckLine,
} from "react-icons/ri";

/* ── Personas ── */
const PERSONAS = [
  { id: "mentor",    emoji: "🧠", name: "Startup Mentor",  desc: "200+ founders mentored",           color: "var(--gold)" },
  { id: "investor",  emoji: "💰", name: "VC Investor",     desc: "10,000+ pitches evaluated",        color: "var(--emerald)" },
  { id: "cto",       emoji: "⚙️", name: "CTO Advisor",    desc: "Tech architecture expert",          color: "var(--blue)" },
  { id: "marketing", emoji: "📣", name: "Growth Expert",   desc: "GTM & growth specialist",           color: "var(--purple)" },
  { id: "product",   emoji: "🎯", name: "Product Manager", desc: "Product-market fit expert",         color: "var(--magenta)" },
  { id: "financial", emoji: "📊", name: "CFO Advisor",     desc: "Finance & fundraising expert",      color: "var(--cyan)" },
  { id: "cofounder", emoji: "🚀", name: "AI Co-Founder",   desc: "Execution & sprint planning",       color: "var(--orange)" },
];

const QUICK_PROMPTS = [
  "How do I validate my startup idea before building?",
  "What's the best way to find my first 100 customers?",
  "How do I structure my seed round pitch?",
  "What metrics matter most to Series A investors?",
  "How do I build an MVP in 30 days?",
  "What's a realistic SaaS revenue model?",
];

/* ── Copy button ── */
const CopyButton = memo(({ text }) => {
  const [copied, setCopied] = useState(false);
  const copy = async () => {
    try {
      await navigator.clipboard.writeText(text);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch { /* silent */ }
  };
  return (
    <motion.button
      onClick={copy}
      whileHover={{ scale: 1.1 }}
      whileTap={{ scale: 0.9 }}
      style={{
        background: "none", border: "none", cursor: "pointer",
        color: copied ? "var(--emerald)" : "var(--text-muted)",
        fontSize: 13, padding: "3px 5px", borderRadius: 4,
        display: "flex", alignItems: "center", gap: 4,
        transition: "color 0.2s",
      }}
      title="Copy message"
    >
      {copied ? <RiCheckLine /> : <RiFileCopyLine />}
    </motion.button>
  );
});

/* ── Message bubble ── */
const MessageBubble = memo(({ msg, persona }) => (
  <motion.div
    initial={{ opacity: 0, y: 8 }}
    animate={{ opacity: 1, y: 0 }}
    style={{ display: "flex", flexDirection: "column", alignItems: msg.role === "user" ? "flex-end" : "flex-start", gap: 4 }}
  >
    {msg.role === "assistant" && (
      <div style={{ display: "flex", alignItems: "center", gap: 6, paddingLeft: 2 }}>
        <div style={{ width: 22, height: 22, borderRadius: "50%", background: `${persona?.color || "var(--gold)"}20`, display: "flex", alignItems: "center", justifyContent: "center", fontSize: 12 }}>
          {persona?.emoji}
        </div>
        <span style={{ fontSize: 11, fontWeight: 600, color: persona?.color || "var(--gold)" }}>{persona?.name}</span>
        <span style={{ fontSize: 10, color: "var(--text-muted)" }}>
          {new Date(msg.timestamp).toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" })}
        </span>
      </div>
    )}
    <div style={{ position: "relative", maxWidth: "78%", wordBreak: "break-word" }}>
      <div className={`chat-message ${msg.role}`}>
        {msg.role === "assistant" ? (
          <div className="markdown-content">
            <ReactMarkdown remarkPlugins={[remarkGfm]}>{msg.content}</ReactMarkdown>
          </div>
        ) : (
          <span>{msg.content}</span>
        )}
      </div>
      {msg.role === "assistant" && (
        <div style={{ position: "absolute", top: 6, right: 8 }}>
          <CopyButton text={msg.content} />
        </div>
      )}
    </div>
    {msg.role === "user" && (
      <span style={{ fontSize: 10, color: "var(--text-muted)", paddingRight: 2 }}>
        {new Date(msg.timestamp).toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" })}
      </span>
    )}
  </motion.div>
));

/* ── Typing indicator ── */
const TypingIndicator = memo(({ emoji }) => (
  <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }}
    style={{ display: "flex", alignItems: "center", gap: 8 }}>
    <div style={{
      width: 22, height: 22, borderRadius: "50%",
      background: "rgba(245,158,11,0.15)",
      display: "flex", alignItems: "center", justifyContent: "center", fontSize: 12,
    }}>{emoji}</div>
    <div className="chat-message assistant" style={{ display: "flex", gap: 5, alignItems: "center", padding: "12px 16px" }}>
      {[0, 1, 2].map(i => (
        <span key={i} style={{
          width: 7, height: 7, background: "var(--gold)", borderRadius: "50%",
          animation: `pulse 1.2s ease ${i * 0.2}s infinite`,
        }} />
      ))}
    </div>
  </motion.div>
));

/* ────────────────────────────────── */

export default function AIChatPage() {
  const [persona, setPersona] = useState("mentor");
  const [messages, setMessages] = useState([]);
  const [input, setInput] = useState("");
  const [loading, setLoading] = useState(false);
  const [chatId, setChatId] = useState(null);
  const [history, setHistory] = useState([]);
  const [showHistory, setShowHistory] = useState(false);
  const [historyLoading, setHistoryLoading] = useState(false);

  const messagesEndRef = useRef(null);
  const inputRef = useRef(null);

  const currentPersona = PERSONAS.find(p => p.id === persona);

  // Auto-scroll
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages, loading]);

  // Auto-resize textarea
  const handleInputChange = (e) => {
    setInput(e.target.value);
    const el = e.target;
    el.style.height = "auto";
    el.style.height = Math.min(el.scrollHeight, 140) + "px";
  };

  // Load chat history
  const loadHistory = useCallback(async () => {
    setHistoryLoading(true);
    try {
      const res = await getChatHistory();
      setHistory(res.data || []);
    } catch { /* silent */ }
    finally { setHistoryLoading(false); }
  }, []);

  const handlePersonaChange = (id) => {
    setPersona(id);
    setMessages([]);
    setChatId(null);
    inputRef.current?.focus();
  };

  const newChat = () => {
    setMessages([]);
    setChatId(null);
    inputRef.current?.focus();
  };

  const handleDeleteChat = async (id, e) => {
    e.stopPropagation();
    try {
      await deleteChat(id);
      setHistory(prev => prev.filter(c => c._id !== id));
      if (chatId === id) { setMessages([]); setChatId(null); }
    } catch { toast.error("Failed to delete chat"); }
  };

  const handleSend = async (text) => {
    const message = (text || input).trim();
    if (!message || loading) return;
    setInput("");
    if (inputRef.current) { inputRef.current.style.height = "auto"; }
    setLoading(true);

    const userMsg = { role: "user", content: message, timestamp: new Date() };
    setMessages(prev => [...prev, userMsg]);

    try {
      const res = await chatWithAI({ message, persona, chatId, history: messages.slice(-10) });
      if (res.success) {
        setMessages(prev => [...prev, { role: "assistant", content: res.reply, timestamp: new Date() }]);
        if (res.chatId && !chatId) {
          setChatId(res.chatId);
          loadHistory(); // refresh history list
        }
      } else {
        toast.error("AI response failed");
        setMessages(prev => prev.slice(0, -1));
      }
    } catch {
      toast.error("Network error. Please try again.");
      setMessages(prev => prev.slice(0, -1));
    } finally {
      setLoading(false);
      inputRef.current?.focus();
    }
  };

  const handleKeyDown = (e) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      handleSend();
    }
  };

  return (
    <DashboardLayout>
      <div className="page-header" style={{ marginBottom: 16 }}>
        <h1 className="page-title">🤖 AI Mentor Chat</h1>
        <p className="page-subtitle">Expert AI advisors available 24/7 to help build your startup</p>
      </div>

      <div style={{ display: "grid", gridTemplateColumns: "220px 1fr", gap: 16, height: "calc(100vh - 230px)", minHeight: 520 }}
        className="chat-layout">

        {/* ── Left: Persona + History ── */}
        <div style={{ display: "flex", flexDirection: "column", gap: 10, overflow: "hidden" }}>

          {/* Persona selector */}
          <div className="glass-card" style={{ padding: 12, overflowY: "auto", flex: 1 }}>
            <div style={{ fontSize: 10, fontWeight: 700, color: "var(--text-muted)", textTransform: "uppercase", letterSpacing: "0.1em", marginBottom: 10 }}>
              Advisor
            </div>
            {PERSONAS.map(p => (
              <button key={p.id} onClick={() => handlePersonaChange(p.id)}
                style={{
                  width: "100%",
                  background: persona === p.id ? `${p.color}14` : "transparent",
                  border: `1px solid ${persona === p.id ? `${p.color}30` : "transparent"}`,
                  borderRadius: "var(--radius-sm)", padding: "9px 10px",
                  textAlign: "left", cursor: "pointer",
                  transition: "var(--transition-fast)", marginBottom: 3,
                  display: "flex", alignItems: "center", gap: 8,
                }}
                onMouseEnter={e => { if (persona !== p.id) e.currentTarget.style.background = "var(--glass-2)"; }}
                onMouseLeave={e => { if (persona !== p.id) e.currentTarget.style.background = "transparent"; }}
              >
                <span style={{ fontSize: 17 }}>{p.emoji}</span>
                <div>
                  <div style={{ fontSize: 12, fontWeight: 600, color: persona === p.id ? p.color : "var(--text-primary)", lineHeight: 1.2 }}>
                    {p.name}
                  </div>
                  <div style={{ fontSize: 10, color: "var(--text-muted)", lineHeight: 1.3 }}>{p.desc}</div>
                </div>
              </button>
            ))}

            {/* History toggle */}
            <div style={{ marginTop: 14, borderTop: "1px solid var(--border-subtle)", paddingTop: 12 }}>
              <button onClick={() => { setShowHistory(!showHistory); if (!showHistory) loadHistory(); }}
                style={{
                  width: "100%", background: "none", border: "none",
                  cursor: "pointer", display: "flex", alignItems: "center", gap: 8,
                  fontSize: 12, fontWeight: 600, color: "var(--text-muted)",
                  padding: "6px 0", transition: "color var(--transition-fast)",
                }}
                onMouseEnter={e => e.currentTarget.style.color = "var(--text-primary)"}
                onMouseLeave={e => e.currentTarget.style.color = "var(--text-muted)"}
              >
                <RiHistoryLine style={{ fontSize: 15 }} />
                Chat History
              </button>
              {showHistory && (
                <div style={{ marginTop: 8, display: "flex", flexDirection: "column", gap: 4, maxHeight: 140, overflowY: "auto" }}>
                  {historyLoading ? (
                    <div style={{ fontSize: 11, color: "var(--text-muted)", textAlign: "center", padding: 8 }}>Loading...</div>
                  ) : history.length === 0 ? (
                    <div style={{ fontSize: 11, color: "var(--text-muted)", textAlign: "center", padding: 8 }}>No history yet</div>
                  ) : history.slice(0, 8).map(c => (
                    <div key={c._id}
                      style={{
                        display: "flex", alignItems: "center", gap: 6,
                        padding: "6px 8px", borderRadius: "var(--radius-sm)",
                        background: chatId === c._id ? "var(--glass-3)" : "var(--glass-1)",
                        cursor: "pointer", transition: "var(--transition-fast)",
                      }}
                      onClick={() => { setChatId(c._id); setShowHistory(false); }}
                    >
                      <span style={{ fontSize: 12, flex: 1, overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap", color: "var(--text-secondary)" }}>
                        {c.title}
                      </span>
                      <button onClick={e => handleDeleteChat(c._id, e)}
                        style={{ background: "none", border: "none", cursor: "pointer", color: "var(--text-muted)", fontSize: 12, flexShrink: 0, display: "flex", padding: 2 }}>
                        <RiDeleteBin6Line />
                      </button>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>
        </div>

        {/* ── Right: Chat ── */}
        <div className="glass-card" style={{ display: "flex", flexDirection: "column", overflow: "hidden" }}>

          {/* Chat header */}
          <div style={{
            padding: "14px 18px", borderBottom: "1px solid var(--border-subtle)",
            display: "flex", alignItems: "center", justifyContent: "space-between", flexShrink: 0,
          }}>
            <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
              <div style={{
                width: 38, height: 38, borderRadius: "50%",
                background: `${currentPersona?.color || "var(--gold)"}18`,
                display: "flex", alignItems: "center", justifyContent: "center", fontSize: 20,
              }}>
                {currentPersona?.emoji}
              </div>
              <div>
                <div style={{ fontWeight: 700, fontSize: 14 }}>{currentPersona?.name}</div>
                <div style={{ fontSize: 11, display: "flex", alignItems: "center", gap: 5 }}>
                  <span style={{
                    width: 6, height: 6, borderRadius: "50%",
                    background: "var(--emerald)", display: "inline-block",
                    boxShadow: "0 0 6px var(--emerald)",
                  }} />
                  <span style={{ color: "var(--emerald)", fontWeight: 500 }}>Online</span>
                </div>
              </div>
            </div>
            <div style={{ display: "flex", gap: 8 }}>
              {messages.length > 0 && (
                <button className="btn btn-ghost btn-sm" onClick={newChat} style={{ fontSize: 12 }}>
                  <RiAddLine /> New
                </button>
              )}
            </div>
          </div>

          {/* Messages area */}
          <div style={{ flex: 1, overflowY: "auto", padding: "18px 18px", display: "flex", flexDirection: "column", gap: 14 }}>
            {messages.length === 0 && (
              <div style={{ textAlign: "center", marginTop: "auto", paddingTop: 40 }}>
                <div style={{ fontSize: 52, marginBottom: 14 }}>{currentPersona?.emoji}</div>
                <h3 style={{ fontFamily: "var(--font-display)", fontWeight: 700, fontSize: 18, marginBottom: 6 }}>
                  Chat with {currentPersona?.name}
                </h3>
                <p style={{ color: "var(--text-muted)", fontSize: 13, marginBottom: 24, maxWidth: 340, margin: "0 auto 24px" }}>
                  {currentPersona?.desc}
                </p>
                <div style={{ display: "flex", flexWrap: "wrap", gap: 8, justifyContent: "center" }}>
                  {QUICK_PROMPTS.map(sp => (
                    <button key={sp} onClick={() => handleSend(sp)}
                      className="btn btn-secondary btn-sm" style={{ fontSize: 12, textAlign: "left" }}>
                      {sp}
                    </button>
                  ))}
                </div>
              </div>
            )}

            {messages.map((msg, i) => (
              <MessageBubble key={i} msg={msg} persona={currentPersona} />
            ))}

            {loading && <TypingIndicator emoji={currentPersona?.emoji} />}
            <div ref={messagesEndRef} />
          </div>

          {/* Input area */}
          <div style={{
            padding: "12px 16px", borderTop: "1px solid var(--border-subtle)", flexShrink: 0,
          }}>
            <div style={{
              display: "flex", gap: 8, alignItems: "flex-end",
              background: "var(--glass-2)", border: "1px solid var(--border-default)",
              borderRadius: "var(--radius-md)", padding: "6px 6px 6px 14px",
              transition: "border-color var(--transition-fast)",
            }}
              onFocusCapture={e => e.currentTarget.style.borderColor = "var(--gold)"}
              onBlurCapture={e => e.currentTarget.style.borderColor = "var(--border-default)"}
            >
              <textarea
                ref={inputRef}
                style={{
                  flex: 1, background: "none", border: "none", outline: "none",
                  color: "var(--text-primary)", fontSize: 14, resize: "none",
                  fontFamily: "var(--font-body)", lineHeight: 1.6,
                  minHeight: 22, maxHeight: 140, overflowY: "auto",
                  paddingTop: 6, paddingBottom: 6,
                }}
                placeholder={`Ask ${currentPersona?.name}... (Enter to send, Shift+Enter for new line)`}
                value={input}
                onChange={handleInputChange}
                onKeyDown={handleKeyDown}
                rows={1}
              />
              <button
                onClick={() => handleSend()}
                disabled={loading || !input.trim()}
                style={{
                  width: 36, height: 36, borderRadius: "var(--radius-sm)",
                  background: input.trim() && !loading
                    ? "linear-gradient(135deg, var(--gold), var(--orange))"
                    : "var(--glass-3)",
                  border: "none", cursor: input.trim() && !loading ? "pointer" : "not-allowed",
                  display: "flex", alignItems: "center", justifyContent: "center",
                  color: input.trim() && !loading ? "#000" : "var(--text-muted)",
                  fontSize: 17, flexShrink: 0,
                  transition: "var(--transition-fast)",
                }}
              >
                <RiSendPlaneLine />
              </button>
            </div>
            <div style={{ fontSize: 10, color: "var(--text-muted)", marginTop: 6, textAlign: "center" }}>
              AI responses may not be accurate. Always verify important decisions.
            </div>
          </div>
        </div>
      </div>
    </DashboardLayout>
  );
}
