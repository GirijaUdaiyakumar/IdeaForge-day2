import { useState, useRef, useEffect, useCallback } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { toast } from "react-hot-toast";
import { RiMicLine, RiMicOffLine, RiCloseLine, RiVolumeUpLine, RiGlobalLine } from "react-icons/ri";
import api from "../services/api";

/* ── Supported languages ── */
const LANGUAGES = [
  { code: "en-IN", label: "English",   flag: "🇬🇧", voiceLang: "en-IN" },
  { code: "hi-IN", label: "Hindi",     flag: "🇮🇳", voiceLang: "hi-IN" },
  { code: "ta-IN", label: "Tamil",     flag: "🌿",  voiceLang: "ta-IN" },
  { code: "te-IN", label: "Telugu",    flag: "🌸",  voiceLang: "te-IN" },
  { code: "ml-IN", label: "Malayalam", flag: "🌴",  voiceLang: "ml-IN" },
];

/* ── Animated wave bars ── */
function WaveBars({ active, color = "var(--gold)" }) {
  return (
    <div style={{ display: "flex", alignItems: "center", gap: 3, height: 28 }}>
      {[1, 1.6, 1.2, 1.8, 1.4, 1, 1.5].map((h, i) => (
        <motion.div key={i}
          style={{ width: 3, borderRadius: 3, background: color }}
          animate={active
            ? { height: [4, h * 20, 4], opacity: [0.5, 1, 0.5] }
            : { height: 4, opacity: 0.3 }
          }
          transition={{ duration: 0.8, repeat: Infinity, delay: i * 0.1, ease: "easeInOut" }}
        />
      ))}
    </div>
  );
}

export default function VoiceAI() {
  const [open, setOpen]               = useState(false);
  const [listening, setListening]     = useState(false);
  const [speaking, setSpeaking]       = useState(false);
  const [transcript, setTranscript]   = useState("");
  const [response, setResponse]       = useState("");
  const [langCode, setLangCode]       = useState("en-IN");
  const [supported, setSupported]     = useState(false);
  const [showLangMenu, setShowLangMenu] = useState(false);

  const recognitionRef = useRef(null);
  const synthRef       = useRef(window.speechSynthesis);

  const currentLang = LANGUAGES.find(l => l.code === langCode) || LANGUAGES[0];

  /* ── Initialise SpeechRecognition ── */
  useEffect(() => {
    const SR = window.SpeechRecognition || window.webkitSpeechRecognition;
    if (SR) {
      setSupported(true);
      const rec = new SR();
      rec.continuous     = false;
      rec.interimResults = true;
      rec.lang           = langCode;

      rec.onresult = e => {
        const t = Array.from(e.results).map(r => r[0].transcript).join("");
        setTranscript(t);
      };
      rec.onend   = () => setListening(false);
      rec.onerror = err => {
        setListening(false);
        if (err.error !== "no-speech") toast.error("Microphone error: " + err.error);
      };
      recognitionRef.current = rec;
    }
    return () => synthRef.current?.cancel();
  }, []);

  /* ── Update lang when changed ── */
  useEffect(() => {
    if (recognitionRef.current) {
      recognitionRef.current.lang = langCode;
    }
  }, [langCode]);

  /* ── Text-to-speech in selected language ── */
  const speak = useCallback((text) => {
    if (!synthRef.current) return;
    synthRef.current.cancel();

    const clean = text
      .replace(/#{1,6}\s/g, "")
      .replace(/\*\*/g, "")
      .replace(/\*/g, "")
      .replace(/`{1,3}/g, "")
      .replace(/\n+/g, ". ")
      .slice(0, 400);

    const utt  = new SpeechSynthesisUtterance(clean);
    utt.lang   = currentLang.voiceLang;
    utt.rate   = 0.95;
    utt.pitch  = 1.05;

    // Pick the best matching voice
    const allVoices = synthRef.current.getVoices();
    const match = allVoices.find(v =>
      v.lang === currentLang.voiceLang ||
      v.lang.startsWith(currentLang.code.split("-")[0])
    );
    if (match) utt.voice = match;

    utt.onstart = () => setSpeaking(true);
    utt.onend   = () => setSpeaking(false);
    utt.onerror = () => setSpeaking(false);
    synthRef.current.speak(utt);
  }, [currentLang]);

  /* ── Send to AI mentor ── */
  const sendToAI = useCallback(async (text) => {
    if (!text.trim()) return;
    setResponse("Thinking...");
    try {
      const langInstruction = langCode !== "en-IN"
        ? ` Please respond in ${currentLang.label}.`
        : "";
      const res = await api.post("/ai/chat", {
        message: text + langInstruction,
        persona: "mentor",
        history: [],
      });
      if (res.data.success) {
        setResponse(res.data.reply);
        speak(res.data.reply);
      } else {
        setResponse("Sorry, the AI could not respond. Please try again.");
      }
    } catch {
      setResponse("Connection error. Please check your network.");
    }
  }, [langCode, currentLang.label, speak]);

  /* ── Toggle microphone ── */
  const toggleListen = () => {
    if (!supported) {
      toast.error("Voice recognition is not supported in this browser. Please use Chrome or Edge.");
      return;
    }
    if (listening) {
      recognitionRef.current?.stop();
      if (transcript.trim()) sendToAI(transcript);
    } else {
      setTranscript("");
      setResponse("");
      synthRef.current?.cancel();
      setSpeaking(false);
      try {
        recognitionRef.current?.start();
        setListening(true);
      } catch {
        toast.error("Microphone is already active.");
      }
    }
  };

  const stopSpeaking = () => { synthRef.current?.cancel(); setSpeaking(false); };

  const handleLangChange = (code) => {
    if (listening) { recognitionRef.current?.stop(); setListening(false); }
    synthRef.current?.cancel(); setSpeaking(false);
    setTranscript(""); setResponse("");
    setLangCode(code);
    setShowLangMenu(false);
  };

  return (
    <>
      {/* Floating trigger */}
      <AnimatePresence>
        {!open && (
          <motion.button
            initial={{ scale: 0, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            exit={{ scale: 0, opacity: 0 }}
            onClick={() => setOpen(true)}
            aria-label="Open Voice AI"
            style={{
              position: "fixed", bottom: 90, right: 24,
              width: 52, height: 52, borderRadius: "50%",
              background: "linear-gradient(135deg,var(--gold),var(--orange))",
              border: "none", cursor: "pointer", zIndex: 300,
              display: "flex", alignItems: "center", justifyContent: "center",
              boxShadow: "0 4px 24px rgba(245,158,11,0.45)",
              fontSize: 22, color: "#000",
            }}
            whileHover={{ scale: 1.1, boxShadow: "0 6px 32px rgba(245,158,11,0.6)" }}
            whileTap={{ scale: 0.92 }}
          >
            <RiMicLine />
          </motion.button>
        )}
      </AnimatePresence>

      {/* Voice panel */}
      <AnimatePresence>
        {open && (
          <motion.div
            initial={{ opacity: 0, scale: 0.9, y: 20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.9, y: 20 }}
            transition={{ duration: 0.25, ease: [0.22, 1, 0.36, 1] }}
            style={{
              position: "fixed", bottom: 90, right: 24,
              width: 330, zIndex: 300,
              background: "rgba(10,15,30,0.97)",
              border: "1px solid rgba(245,158,11,0.2)",
              borderRadius: "var(--radius-xl)",
              boxShadow: "0 24px 64px rgba(0,0,0,0.6), 0 0 0 1px rgba(245,158,11,0.1)",
              overflow: "visible",
            }}
          >
            {/* Header */}
            <div style={{
              padding: "12px 16px",
              borderBottom: "1px solid var(--border-subtle)",
              display: "flex", alignItems: "center", justifyContent: "space-between",
              background: "rgba(245,158,11,0.06)",
              borderRadius: "var(--radius-xl) var(--radius-xl) 0 0",
            }}>
              <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
                <div style={{
                  width: 30, height: 30, borderRadius: "50%",
                  background: "linear-gradient(135deg,var(--gold),var(--orange))",
                  display: "flex", alignItems: "center", justifyContent: "center",
                  fontSize: 15, color: "#000", fontWeight: 700,
                }}>🧠</div>
                <div>
                  <div style={{ fontWeight: 700, fontSize: 13 }}>Voice Mentor</div>
                  <div style={{ fontSize: 10, color: listening ? "var(--emerald)" : speaking ? "var(--gold)" : "var(--text-muted)" }}>
                    {listening ? "🔴 Listening..." : speaking ? "🔊 Speaking..." : `Ready · ${currentLang.label}`}
                  </div>
                </div>
              </div>

              {/* Language selector */}
              <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
                <div style={{ position: "relative" }}>
                  <button
                    onClick={() => setShowLangMenu(!showLangMenu)}
                    style={{
                      display: "flex", alignItems: "center", gap: 5,
                      background: "var(--glass-2)", border: "1px solid var(--border-default)",
                      borderRadius: "var(--radius-sm)", padding: "4px 8px",
                      cursor: "pointer", fontSize: 11, color: "var(--text-secondary)",
                      transition: "var(--transition-fast)",
                    }}
                  >
                    <RiGlobalLine style={{ fontSize: 12 }} />
                    <span>{currentLang.flag} {currentLang.label}</span>
                  </button>
                  <AnimatePresence>
                    {showLangMenu && (
                      <motion.div
                        initial={{ opacity: 0, y: -4 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0, y: -4 }}
                        style={{
                          position: "absolute", top: "calc(100% + 6px)", right: 0,
                          background: "rgba(10,15,30,0.98)",
                          border: "1px solid var(--border-default)",
                          borderRadius: "var(--radius-md)",
                          overflow: "hidden", zIndex: 999,
                          minWidth: 150,
                          boxShadow: "0 8px 24px rgba(0,0,0,0.4)",
                        }}
                      >
                        {LANGUAGES.map(lang => (
                          <button
                            key={lang.code}
                            onClick={() => handleLangChange(lang.code)}
                            style={{
                              display: "flex", alignItems: "center", gap: 8,
                              width: "100%", padding: "9px 14px",
                              background: lang.code === langCode ? "rgba(245,158,11,0.12)" : "transparent",
                              border: "none", cursor: "pointer",
                              fontSize: 13, color: lang.code === langCode ? "var(--gold)" : "var(--text-secondary)",
                              transition: "background 0.15s",
                              textAlign: "left",
                            }}
                            onMouseEnter={e => { if (lang.code !== langCode) e.currentTarget.style.background = "var(--glass-2)"; }}
                            onMouseLeave={e => { if (lang.code !== langCode) e.currentTarget.style.background = "transparent"; }}
                          >
                            <span>{lang.flag}</span>
                            <span>{lang.label}</span>
                            {lang.code === langCode && <span style={{ marginLeft: "auto", fontSize: 11 }}>✓</span>}
                          </button>
                        ))}
                      </motion.div>
                    )}
                  </AnimatePresence>
                </div>

                <button
                  onClick={() => { setOpen(false); recognitionRef.current?.stop(); synthRef.current?.cancel(); setShowLangMenu(false); }}
                  style={{ background: "none", border: "none", cursor: "pointer", color: "var(--text-muted)", fontSize: 18, display: "flex" }}
                >
                  <RiCloseLine />
                </button>
              </div>
            </div>

            {/* Body */}
            <div style={{ padding: "18px 16px", display: "flex", flexDirection: "column", alignItems: "center", gap: 14 }}>
              <WaveBars active={listening || speaking} color={listening ? "var(--emerald)" : "var(--gold)"} />

              {/* Transcript */}
              {transcript && (
                <div style={{
                  width: "100%", background: "var(--glass-2)",
                  borderRadius: "var(--radius-md)", padding: "10px 14px",
                  fontSize: 13, color: "var(--text-secondary)", lineHeight: 1.6,
                  border: "1px solid var(--border-subtle)",
                }}>
                  <div style={{ fontSize: 10, color: "var(--text-muted)", marginBottom: 4, textTransform: "uppercase", letterSpacing: "0.06em" }}>
                    You said ({currentLang.label})
                  </div>
                  {transcript}
                </div>
              )}

              {/* AI Response */}
              {response && (
                <div style={{
                  width: "100%", background: "rgba(245,158,11,0.06)",
                  borderRadius: "var(--radius-md)", padding: "10px 14px",
                  fontSize: 13, color: "var(--text-secondary)", lineHeight: 1.6,
                  border: "1px solid rgba(245,158,11,0.15)",
                  maxHeight: 130, overflowY: "auto",
                }}>
                  <div style={{ fontSize: 10, color: "var(--gold)", marginBottom: 4, textTransform: "uppercase", letterSpacing: "0.06em" }}>
                    AI Mentor ({currentLang.label})
                  </div>
                  {response}
                </div>
              )}

              {/* Buttons */}
              <div style={{ display: "flex", gap: 8, width: "100%" }}>
                <motion.button
                  onClick={toggleListen}
                  whileTap={{ scale: 0.92 }}
                  style={{
                    flex: 1, padding: "11px 0",
                    borderRadius: "var(--radius-md)", border: listening ? "1px solid rgba(239,68,68,0.4)" : "none",
                    background: listening
                      ? "rgba(239,68,68,0.12)"
                      : "linear-gradient(135deg,var(--gold),var(--orange))",
                    color: listening ? "var(--red)" : "#000",
                    cursor: "pointer", fontWeight: 700, fontSize: 13,
                    display: "flex", alignItems: "center", justifyContent: "center", gap: 7,
                    transition: "var(--transition-fast)",
                  }}
                >
                  {listening ? <><RiMicOffLine /> Stop</> : <><RiMicLine /> Speak</>}
                </motion.button>

                {speaking && (
                  <motion.button
                    initial={{ opacity: 0, scale: 0.8 }}
                    animate={{ opacity: 1, scale: 1 }}
                    onClick={stopSpeaking}
                    title="Stop speaking"
                    style={{
                      padding: "11px 14px", borderRadius: "var(--radius-md)",
                      background: "var(--glass-2)", border: "1px solid var(--border-default)",
                      color: "var(--gold)", cursor: "pointer", fontSize: 18,
                      display: "flex", alignItems: "center",
                    }}
                  >
                    <RiVolumeUpLine />
                  </motion.button>
                )}
              </div>

              <div style={{ fontSize: 11, color: "var(--text-muted)", textAlign: "center", lineHeight: 1.5 }}>
                {!supported
                  ? "⚠️ Voice not supported. Use Chrome or Edge for voice features."
                  : `Tap Speak, ask a question in ${currentLang.label}, get AI guidance aloud.`
                }
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}
