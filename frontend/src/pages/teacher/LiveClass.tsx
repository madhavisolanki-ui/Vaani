import { useState, useEffect, useRef } from "react";
import { Link } from "react-router-dom";
import axios from "axios";

const API = "http://localhost:4000/api";

interface MessageItem {
  id: string;
  senderRole: "teacher" | "student";
  senderName: string;
  originalText: string;
  hindiText: string;
  latencyMs: number;
  timestamp: string;
}

export interface LiveClassSchedule {
  id: string;
  grade: string;
  subject: string;
  topic: string;
  date: string; // YYYY-MM-DD
  startTime: string; // "HH:mm" or "hh:mm AM/PM"
  endTime: string; // "HH:mm" or "hh:mm AM/PM"
  durationMinutes: number;
  status: "upcoming" | "live" | "ended";
  isExpired: boolean;
  isLocked: boolean;
  roomCode?: string;
  createdAt?: string;
}

const GRADE_OPTIONS = ["कक्षा 1", "कक्षा 2", "कक्षा 3", "कक्षा 4", "कक्षा 5"];

const SUBJECT_OPTIONS = [
  "गणित",
  "भाषा व पर्यावरण",
  "हिंदी",
  "विज्ञान",
  "सामाजिक अध्ययन",
  "FLN बुनियादी साक्षरता",
];

const SUBJECT_TOPIC_SUGGESTIONS: Record<string, string[]> = {
  "गणित": [
    "गिनती 1 से 10 और संख्या बोध",
    "सरल जोड़ और घटाव की अवधारणा",
    "स्थानीय मान (दहाई और इकाई)",
    "आकार, माप और ज्यामितीय पैटर्न",
    "पहाड़े (2 से 10 तक मौखिक अभ्यास)",
  ],
  "भाषा व पर्यावरण": [
    "रंग, आकार और हमारे आस-पास के जानवर",
    "पेड़-पौधे, पत्तियां और हमारे फल-फूल",
    "स्वच्छता, हाथ धोना और व्यक्तिगत स्वास्थ्य",
    "हमारे मददगार (डाकिया, किसान, शिक्षक, डॉक्टर)",
  ],
  "हिंदी": [
    "वर्णमाला एवं स्वर-व्यंजन पहचान",
    "दो और तीन अक्षर वाले सरल शब्द",
    "कहानी पठन: चालाक लोमड़ी और कौआ",
    "कविता पाठ: तितली और कली",
  ],
  "विज्ञान": [
    "सजीव और निर्जीव वस्तुएं",
    "जल चक्र और वर्षा की प्रक्रिया",
    "मौसम, ऋतुएं और दिन-रात का चक्र",
    "सौर मंडल और ग्रह",
  ],
  "सामाजिक अध्ययन": [
    "हमारा परिवार, घर और पड़ोसी",
    "भारत के राष्ट्रीय प्रतीक एवं झंडा",
    "यातायात के नियम और संकेत",
    "हमारे लोक त्योहार और उत्सव",
  ],
  "FLN बुनियादी साक्षरता": [
    "ध्वनि पहचान एवं तुकबंदी वाले शब्द",
    "चित्र देखकर कहानी बनाना",
    "संख्या रेखा पर कूद-कूद कर गिनती",
    "शब्द पहेली और त्वरित उत्तर",
  ],
};

// Helper: Parse Date + Time string into a Date object
function parseToDate(dateStr: string, timeStr: string): Date {
  try {
    const clean = timeStr.replace(/सुबह|दोपहर|शाम|रात|बजे/g, "").trim();
    const isPM = /pm/i.test(clean);
    const isAM = /am/i.test(clean);
    const numPart = clean.replace(/am|pm/gi, "").trim();
    const parts = numPart.split(":");
    let hour = parseInt(parts[0], 10) || 0;
    const min = parseInt(parts[1], 10) || 0;
    if (isPM && hour < 12) hour += 12;
    if (isAM && hour === 12) hour = 0;

    const [y, m, d] = dateStr.split("-").map(Number);
    return new Date(y, m - 1, d, hour, min, 0, 0);
  } catch (e) {
    return new Date();
  }
}

// Helper: Format time string into 12-hour AM/PM
function formatTimeDisplay(timeStr: string): string {
  if (!timeStr) return "";
  if (timeStr.includes("AM") || timeStr.includes("PM") || timeStr.includes("बजे")) {
    return timeStr;
  }
  const parts = timeStr.split(":");
  let hour = parseInt(parts[0], 10) || 0;
  const min = parseInt(parts[1], 10) || 0;
  const period = hour >= 12 ? "PM" : "AM";
  const h12 = hour % 12 === 0 ? 12 : hour % 12;
  return `${h12}:${String(min).padStart(2, "0")} ${period}`;
}

// Helper: Format seconds to MM:SS or HH:MM:SS
function formatRemaining(totalSec: number): string {
  if (totalSec <= 0) return "00:00";
  const hours = Math.floor(totalSec / 3600);
  const minutes = Math.floor((totalSec % 3600) / 60);
  const seconds = totalSec % 60;
  if (hours > 0) {
    return `${hours}:${String(minutes).padStart(2, "0")}:${String(seconds).padStart(2, "0")}`;
  }
  return `${String(minutes).padStart(2, "0")}:${String(seconds).padStart(2, "0")}`;
}

// Helper: Add minutes to HH:mm string
function addMinutesToTime(timeStr: string, mins: number): string {
  const clean = timeStr.replace(/सुबह|दोपहर|शाम|रात|बजे/g, "").trim();
  const isPM = /pm/i.test(clean);
  const isAM = /am/i.test(clean);
  const numPart = clean.replace(/am|pm/gi, "").trim();
  const parts = numPart.split(":");
  let hour = parseInt(parts[0], 10) || 0;
  let min = parseInt(parts[1], 10) || 0;
  if (isPM && hour < 12) hour += 12;
  if (isAM && hour === 12) hour = 0;

  const totalMin = hour * 60 + min + mins;
  const newHour = Math.floor(totalMin / 60) % 24;
  const newMin = totalMin % 60;
  return `${String(newHour).padStart(2, "0")}:${String(newMin).padStart(2, "0")}`;
}

// Subject-Wise Classes Counter Baseline & Storage Helpers
const DEFAULT_SUBJECT_COUNTS: Record<string, number> = {
  "गणित": 22,
  "भाषा व पर्यावरण": 18,
  "हिंदी": 14,
  "विज्ञान": 9,
  "सामाजिक अध्ययन": 7,
  "FLN बुनियादी साक्षरता": 12,
};

function getStoredSubjectCounts(): Record<string, number> {
  const saved = localStorage.getItem("completedClassesCountBySubject");
  if (saved) {
    try {
      return { ...DEFAULT_SUBJECT_COUNTS, ...JSON.parse(saved) };
    } catch (e) {}
  }
  return { ...DEFAULT_SUBJECT_COUNTS };
}

function normalizeSubjectName(s: string): string {
  if (!s) return "गणित";
  if (s.includes("गणित")) return "गणित";
  if (s.includes("भाषा") || s.includes("पर्यावरण")) return "भाषा व पर्यावरण";
  if (s.includes("हिंदी")) return "हिंदी";
  if (s.includes("विज्ञान")) return "विज्ञान";
  if (s.includes("सामाजिक")) return "सामाजिक अध्ययन";
  if (s.includes("FLN") || s.includes("साक्षरता")) return "FLN बुनियादी साक्षरता";
  return s;
}

const SUBJECT_DETAILS_META: Record<string, { icon: string; desc: string; borderColor: string; bgBadge: string; textBadge: string }> = {
  "गणित": {
    icon: "🔢",
    desc: "संख्या बोध, संक्रियाएं व गिनती",
    borderColor: "border-[#DBEAFE]",
    bgBadge: "bg-[#EFF6FF]",
    textBadge: "text-[#2563EB]",
  },
  "भाषा व पर्यावरण": {
    icon: "🌿",
    desc: "मातृभाषा सेतु, पर्यावरण व जीव",
    borderColor: "border-[#C7D2FE]",
    bgBadge: "bg-[#EEF2FF]",
    textBadge: "text-[#4F46E5]",
  },
  "हिंदी": {
    icon: "📖",
    desc: "वर्णमाला, शब्द रचना व कहानी",
    borderColor: "border-[#DDD6FE]",
    bgBadge: "bg-[#F5F3FF]",
    textBadge: "text-[#7C3AED]",
  },
  "विज्ञान": {
    icon: "🔬",
    desc: "सजीव-निर्जीव, जल व प्रकृति",
    borderColor: "border-[#BAE6FD]",
    bgBadge: "bg-[#F0F9FF]",
    textBadge: "text-[#0284C7]",
  },
  "सामाजिक अध्ययन": {
    icon: "🌍",
    desc: "परिवार, समाज, नियम व संस्कृति",
    borderColor: "border-[#DBEAFE]",
    bgBadge: "bg-[#EFF6FF]",
    textBadge: "text-[#1E40AF]",
  },
  "FLN बुनियादी साक्षरता": {
    icon: "✨",
    desc: "ध्वनि पहचान, तुकबंदी व खेल",
    borderColor: "border-[#C7D2FE]",
    bgBadge: "bg-[#EEF2FF]",
    textBadge: "text-[#6366F1]",
  },
};

export default function TeacherLiveClass() {
  const teacherName = localStorage.getItem("userName") || "माधवी";
  const [inputText, setInputText] = useState("");
  const [loading, setLoading] = useState(false);
  const [messages, setMessages] = useState<MessageItem[]>([]);

  // Subject-wise Completed Classes Counter State
  const [subjectCounts, setSubjectCounts] = useState<Record<string, number>>(getStoredSubjectCounts);
  const [recentCompletedLog, setRecentCompletedLog] = useState<any[]>(() => {
    const saved = localStorage.getItem("completedClassesHistory");
    if (saved) {
      try {
        return JSON.parse(saved);
      } catch (e) {}
    }
    return [
      {
        id: "hist_1",
        subject: "गणित",
        grade: "कक्षा 1",
        topic: "गिनती 1 से 10 और संख्या बोध",
        completedAt: "आज, 10:15 AM",
      },
      {
        id: "hist_2",
        subject: "भाषा व पर्यावरण",
        grade: "कक्षा 2",
        topic: "रंग, आकार और हमारे आस-पास के जानवर",
        completedAt: "आज, 12:15 PM",
      },
    ];
  });

  // Speech Output (Text-To-Speech) State for Teacher
  const [playingAudioId, setPlayingAudioId] = useState<string | null>(null);
  const [autoSpeak, setAutoSpeak] = useState(true);
  const previousMessageCountRef = useRef<number>(0);

  // Speech Recognition (Voice Input) State
  const [isRecording, setIsRecording] = useState(false);
  const [speechTranscript, setSpeechTranscript] = useState("");
  const [micStatusMsg, setMicStatusMsg] = useState("");
  const [recognitionInstance, setRecognitionInstance] = useState<any>(null);

  // --- Live Class Schedule State ---
  const [schedule, setSchedule] = useState<LiveClassSchedule>(() => {
    const saved = localStorage.getItem("activeLiveClassSchedule");
    if (saved) {
      try {
        return JSON.parse(saved);
      } catch (e) {
        // fallback
      }
    }
    const now = new Date();
    const todayStr = now.toISOString().split("T")[0];
    const curHours = String(now.getHours()).padStart(2, "0");
    const curMins = String(now.getMinutes()).padStart(2, "0");
    const startStr = `${curHours}:${curMins}`;
    const endStr = addMinutesToTime(startStr, 45);

    return {
      id: `cls_${Date.now()}`,
      grade: "कक्षा 1",
      subject: "गणित",
      topic: "गिनती 1 से 10 और संख्या बोध",
      date: todayStr,
      startTime: startStr,
      endTime: endStr,
      durationMinutes: 45,
      status: "live",
      isExpired: false,
      isLocked: false,
      roomCode: "FLN-HIN-101",
    };
  });

  const [showScheduleModal, setShowScheduleModal] = useState(false);
  const [countdownText, setCountdownText] = useState("");
  const [secondsRemaining, setSecondsRemaining] = useState<number>(0);
  const [totalDurationSeconds, setTotalDurationSeconds] = useState<number>(2700);

  // Schedule Modal Form Fields
  const [formGrade, setFormGrade] = useState("कक्षा 1");
  const [formSubject, setFormSubject] = useState("गणित");
  const [formTopic, setFormTopic] = useState("गिनती 1 से 10 और संख्या बोध");
  const [formDate, setFormDate] = useState(() => new Date().toISOString().split("T")[0]);
  const [formScheduleMode, setFormScheduleMode] = useState<"now" | "later">("now");
  const [formStartTime, setFormStartTime] = useState(() => {
    const d = new Date();
    return `${String(d.getHours()).padStart(2, "0")}:${String(d.getMinutes()).padStart(2, "0")}`;
  });
  const [formDuration, setFormDuration] = useState(45);



  // Poll chat messages every 2 seconds
  useEffect(() => {
    fetchSessionMessages();
    const interval = setInterval(fetchSessionMessages, 2000);
    return () => clearInterval(interval);
  }, [schedule.isLocked, schedule.status]);

  // Register completed class and increment subject count
  const recordClassCompletion = (cls: LiveClassSchedule) => {
    if (!cls || !cls.id) return;
    try {
      const countedIdsRaw = localStorage.getItem("countedCompletedClassIds");
      const countedIds: string[] = countedIdsRaw ? JSON.parse(countedIdsRaw) : [];
      if (countedIds.includes(cls.id)) return; // Already counted

      countedIds.push(cls.id);
      localStorage.setItem("countedCompletedClassIds", JSON.stringify(countedIds));

      const subj = normalizeSubjectName(cls.subject);
      const currentCounts = getStoredSubjectCounts();
      currentCounts[subj] = (currentCounts[subj] || 0) + 1;
      localStorage.setItem("completedClassesCountBySubject", JSON.stringify(currentCounts));
      setSubjectCounts(currentCounts);

      // Add to completed classes history log
      const historyRaw = localStorage.getItem("completedClassesHistory");
      const history = historyRaw ? JSON.parse(historyRaw) : [];
      const nowTimeStr = new Date().toLocaleTimeString("hi-IN", { hour: "2-digit", minute: "2-digit" });
      const newEntry = {
        id: cls.id,
        subject: subj,
        grade: cls.grade,
        topic: cls.topic,
        completedAt: `आज, ${nowTimeStr}`,
      };
      const updatedHistory = [newEntry, ...history.slice(0, 9)];
      localStorage.setItem("completedClassesHistory", JSON.stringify(updatedHistory));
      setRecentCompletedLog(updatedHistory);

      // Fire cross-component custom event
      window.dispatchEvent(new CustomEvent("classCountUpdated", { detail: currentCounts }));
    } catch (e) {
      console.error("Error recording class completion:", e);
    }
  };

  // --- Real-Time 1-Second Ticker for Live Class Auto-Close Lifecycle ---
  useEffect(() => {
    const checkStatus = () => {
      if (!schedule) return;
      const now = new Date();
      const startDate = parseToDate(schedule.date, schedule.startTime);
      const endDate = parseToDate(schedule.date, schedule.endTime);
      const totalSec = Math.max(1, Math.floor((endDate.getTime() - startDate.getTime()) / 1000));
      setTotalDurationSeconds(totalSec);

      const nowTime = now.getTime();
      const startTime = startDate.getTime();
      const endTime = endDate.getTime();

      if (nowTime < startTime) {
        // UPCOMING (आगामी)
        const secTillStart = Math.max(0, Math.floor((startTime - nowTime) / 1000));
        setSecondsRemaining(secTillStart);
        setCountdownText(formatRemaining(secTillStart));
        if (schedule.status !== "upcoming" || schedule.isLocked) {
          const updated: LiveClassSchedule = {
            ...schedule,
            status: "upcoming",
            isExpired: false,
            isLocked: false,
          };
          setSchedule(updated);
          localStorage.setItem("activeLiveClassSchedule", JSON.stringify(updated));
        }
      } else if (nowTime >= startTime && nowTime < endTime) {
        // LIVE NOW (अभी लाइव)
        const secTillEnd = Math.max(0, Math.floor((endTime - nowTime) / 1000));
        setSecondsRemaining(secTillEnd);
        setCountdownText(formatRemaining(secTillEnd));
        if (schedule.status !== "live" || schedule.isLocked) {
          const updated: LiveClassSchedule = {
            ...schedule,
            status: "live",
            isExpired: false,
            isLocked: false,
          };
          setSchedule(updated);
          localStorage.setItem("activeLiveClassSchedule", JSON.stringify(updated));
        }
      } else {
        // TIME EXPIRED -> AUTO-CLOSE! (समय समाप्त / स्वतः बंद)
        setSecondsRemaining(0);
        setCountdownText("00:00");
        if (schedule.status !== "ended" || !schedule.isLocked) {
          const updated: LiveClassSchedule = {
            ...schedule,
            status: "ended",
            isExpired: true,
            isLocked: true,
          };
          setSchedule(updated);
          localStorage.setItem("activeLiveClassSchedule", JSON.stringify(updated));

          // Increment subject count upon auto-close
          recordClassCompletion(updated);

          // Auto-Stop recording mic and sound if running
          if (isRecording) {
            stopSpeechRecognition();
          }
          if ("speechSynthesis" in window) {
            window.speechSynthesis.cancel();
          }

          // Clear chat messages and backend session history when class auto-ends
          setMessages([]);
          axios.post(`${API}/live/clear`).catch((err) => console.error("Error clearing session on auto-close:", err));
        }
      }
    };

    checkStatus();
    const ticker = setInterval(checkStatus, 1000);
    return () => clearInterval(ticker);
  }, [schedule, isRecording]);

  // Natural Hindi Speech Synthesis (TTS) - Teacher hears everything in pure Hindi
  const speakHindi = (text: string, id?: string) => {
    if (!text || !text.trim()) return;

    if (id) setPlayingAudioId(id);

    try {
      if ("speechSynthesis" in window) {
        window.speechSynthesis.cancel();
        const utterance = new SpeechSynthesisUtterance(text.trim());
        utterance.lang = "hi-IN";
        utterance.rate = 0.95;
        utterance.pitch = 1.0;

        const voices = window.speechSynthesis.getVoices();
        const hindiVoice = voices.find(
          (v) => v.lang.toLowerCase().includes("hi") || v.name.toLowerCase().includes("hindi")
        );
        if (hindiVoice) {
          utterance.voice = hindiVoice;
        }

        utterance.onend = () => setPlayingAudioId(null);
        utterance.onerror = () => setPlayingAudioId(null);

        window.speechSynthesis.speak(utterance);
      } else {
        const audioUrl = `https://translate.google.com/translate_tts?ie=UTF-8&tl=hi&client=tw-ob&q=${encodeURIComponent(text)}`;
        const audio = new Audio(audioUrl);
        audio.onended = () => setPlayingAudioId(null);
        audio.onerror = () => setPlayingAudioId(null);
        audio.play().catch(() => setPlayingAudioId(null));
      }
    } catch (e) {
      console.warn("Speech synthesis error:", e);
      setPlayingAudioId(null);
    }
  };

  // Auto-Speak Effect: Automatically pronounce student's incoming message in Hindi for the teacher
  useEffect(() => {
    if (messages.length > previousMessageCountRef.current && messages.length > 0) {
      const latestMsg = messages[messages.length - 1];
      if (autoSpeak) {
        const textToSpeak = latestMsg.hindiText || latestMsg.originalText;
        if (textToSpeak) {
          speakHindi(textToSpeak, latestMsg.id);
        }
      }
    }
    previousMessageCountRef.current = messages.length;
  }, [messages, autoSpeak]);

  // Speech Recognition for Hindi
  const startSpeechRecognition = () => {
    if (schedule.isLocked) {
      setMicStatusMsg("🔒 कक्षा का समय समाप्त हो चुका है। माइक्रोफ़ोन बंद है।");
      return;
    }

    const SpeechRecognition = (window as any).SpeechRecognition || (window as any).webkitSpeechRecognition;

    if (!SpeechRecognition) {
      setMicStatusMsg("ब्राउज़र में सीधे माइक्रोफ़ोन स्पीच इनपुट चालू किया जा रहा है...");
      setIsRecording(true);
      const demoPhrases = [
        "नमस्ते बच्चों, आज की कक्षा में सबका स्वागत है!",
        "सब बच्चे अपनी किताब का पाठ 1 खोलें।",
        "क्या सभी बच्चों को समझ आ गया?",
        "बहुत बढ़िया बच्चों! शाबाश।",
      ];
      const randomPhrase = demoPhrases[Math.floor(Math.random() * demoPhrases.length)];
      setTimeout(() => {
        setInputText(randomPhrase);
        setSpeechTranscript(randomPhrase);
        setIsRecording(false);
        setMicStatusMsg("आवाज़ रिकॉर्ड हुई: " + randomPhrase);
      }, 2500);
      return;
    }

    try {
      const recognition = new SpeechRecognition();
      recognition.lang = "hi-IN";
      recognition.continuous = true;
      recognition.interimResults = true;

      recognition.onstart = () => {
        setIsRecording(true);
        setMicStatusMsg("🎤 माइक्रोफ़ोन सक्रिय है... कृपया हिंदी में बोलें");
        setSpeechTranscript("");
      };

      recognition.onresult = (event: any) => {
        let currentText = "";
        for (let i = event.resultIndex; i < event.results.length; i++) {
          currentText += event.results[i][0].transcript;
        }
        setSpeechTranscript(currentText);
        setInputText(currentText);
      };

      recognition.onerror = (event: any) => {
        console.warn("Speech recognition error:", event.error);
        if (event.error === "not-allowed") {
          setMicStatusMsg("⚠️ माइक्रोफ़ोन ब्लॉक है। कृपया ब्राउज़र में अनुमति दें।");
        } else {
          setMicStatusMsg("स्पीच इनपुट स्थिति: " + event.error);
        }
        setIsRecording(false);
      };

      recognition.onend = () => {
        setIsRecording(false);
      };

      recognition.start();
      setRecognitionInstance(recognition);
    } catch (err) {
      console.error("Failed to start speech recognition:", err);
      setIsRecording(false);
    }
  };

  const stopSpeechRecognition = () => {
    if (recognitionInstance) {
      try {
        recognitionInstance.stop();
      } catch (e) {
        console.log(e);
      }
    }
    setIsRecording(false);
  };

  const handleToggleMic = () => {
    if (schedule.isLocked) {
      alert("🔒 इस कक्षा का समय निकल चुका है। समाप्त हो चुकी कक्षा का समय दोबारा नहीं बढ़ाया जा सकता। कृपया नई क्लास शेड्यूल करें।");
      return;
    }
    if (isRecording) {
      stopSpeechRecognition();
    } else {
      startSpeechRecognition();
    }
  };

  const fetchSessionMessages = async () => {
    if (schedule?.isLocked || schedule?.status === "ended") {
      setMessages([]);
      return;
    }
    try {
      const res = await axios.get(`${API}/live/session?lang=san`);
      setMessages(res.data.turns || []);
    } catch (err) {
      console.error("लाइव सेशन के संदेश प्राप्त नहीं हो सके।", err);
    }
  };

  const handleSendMessage = async (textToSend: string) => {
    if (schedule.isLocked) {
      alert("🔒 कक्षा का निर्धारित समय समाप्त हो चुका है। यह सत्र स्वतः बंद हो गया है।");
      return;
    }
    if (!textToSend || textToSend.trim() === "") return;
    if (isRecording) stopSpeechRecognition();
    setLoading(true);

    try {
      await axios.post(`${API}/live/translate-speech`, {
        text: textToSend.trim(),
        from: "hi",
        role: "teacher",
        senderName: `${teacherName} (शिक्षक)`,
      });

      setInputText("");
      setSpeechTranscript("");
      setMicStatusMsg("");
      await fetchSessionMessages();
    } catch (err) {
      console.error("संदेश भेजने में त्रुटि हुई।", err);
      alert("संदेश भेजने में त्रुटि हुई।");
    } finally {
      setLoading(false);
    }
  };

  const handleClearSession = async () => {
    if (!confirm("क्या आप कक्षा संवाद को रीसेट करना चाहते हैं?")) return;
    try {
      await axios.post(`${API}/live/clear`);
      setMessages([]);
    } catch (err) {
      console.error("सेशन साफ़ नहीं हो सका। कृपया पुनः प्रयास करें।", err);
    }
  };

  // --- Handlers for Scheduling & Auto-Close Controls ---

  // 1. Open Schedule Modal with default prefilled values
  const handleOpenScheduleModal = () => {
    const d = new Date();
    setFormDate(d.toISOString().split("T")[0]);
    setFormStartTime(`${String(d.getHours()).padStart(2, "0")}:${String(d.getMinutes()).padStart(2, "0")}`);
    setShowScheduleModal(true);
  };

  // 2. Save and activate newly scheduled class
  const handleSaveSchedule = async () => {
    if (!formTopic.trim()) {
      alert("कृपया कक्षा का टॉपिक दर्ज करें।");
      return;
    }

    const now = new Date();
    let targetDate = formDate;
    let startStr = formStartTime;

    if (formScheduleMode === "now") {
      targetDate = now.toISOString().split("T")[0];
      startStr = `${String(now.getHours()).padStart(2, "0")}:${String(now.getMinutes()).padStart(2, "0")}`;
    }

    const endStr = addMinutesToTime(startStr, formDuration);
    const startObj = parseToDate(targetDate, startStr);
    const endObj = parseToDate(targetDate, endStr);
    const nowTime = now.getTime();

    let computedStatus: "upcoming" | "live" | "ended" = "upcoming";
    let isExp = false;
    let isLck = false;

    if (nowTime >= endObj.getTime()) {
      computedStatus = "ended";
      isExp = true;
      isLck = true;
    } else if (nowTime >= startObj.getTime() && nowTime < endObj.getTime()) {
      computedStatus = "live";
      isExp = false;
      isLck = false;
    } else {
      computedStatus = "upcoming";
      isExp = false;
      isLck = false;
    }

    const newClassSchedule: LiveClassSchedule = {
      id: `cls_${Date.now()}`,
      grade: formGrade,
      subject: formSubject,
      topic: formTopic.trim(),
      date: targetDate,
      startTime: startStr,
      endTime: endStr,
      durationMinutes: formDuration,
      status: computedStatus,
      isExpired: isExp,
      isLocked: isLck,
      roomCode: `FLN-${formGrade.replace(/\s+/g, "")}-${Math.floor(100 + Math.random() * 900)}`,
      createdAt: new Date().toISOString(),
    };

    setSchedule(newClassSchedule);
    localStorage.setItem("activeLiveClassSchedule", JSON.stringify(newClassSchedule));

    // Clear previous session messages so new scheduled class starts fresh
    setMessages([]);
    try {
      await axios.post(`${API}/live/clear`);
    } catch (e) {}

    // Also persist to backend curriculum classes
    try {
      await axios.post(`${API}/curriculum/classes`, {
        date: newClassSchedule.date,
        startTime: formatTimeDisplay(newClassSchedule.startTime),
        endTime: formatTimeDisplay(newClassSchedule.endTime),
        subject: newClassSchedule.subject,
        topic: newClassSchedule.topic,
        grade: newClassSchedule.grade,
        medium: "हिंदी",
        roomCode: newClassSchedule.roomCode,
      });
    } catch (e) {
      // Backend sync fallback
    }

    setShowScheduleModal(false);
  };

  // 3. Extend Time by +15 Minutes (ONLY allowed while class is actively LIVE, never after time expires)
  const handleExtend15Minutes = () => {
    if (schedule.status === "ended" || schedule.isExpired || schedule.isLocked) {
      alert("🔒 इस कक्षा का समय निकल चुका है। एक बार समय निकल जाने के बाद कक्षा का समय नहीं बढ़ाया जा सकता। कृपया नई क्लास शेड्यूल करें।");
      return;
    }
    const now = new Date();
    const currentEnd = parseToDate(schedule.date, schedule.endTime);
    if (now.getTime() >= currentEnd.getTime()) {
      alert("🔒 इस कक्षा का समय निकल चुका है। एक बार समय निकल जाने के बाद कक्षा का समय नहीं बढ़ाया जा सकता। कृपया नई क्लास शेड्यूल करें।");
      return;
    }
    const extendedDate = new Date(currentEnd.getTime() + 15 * 60000);
    const newEndStr = `${String(extendedDate.getHours()).padStart(2, "0")}:${String(extendedDate.getMinutes()).padStart(2, "0")}`;

    const updated: LiveClassSchedule = {
      ...schedule,
      endTime: newEndStr,
      durationMinutes: schedule.durationMinutes + 15,
      status: "live",
      isExpired: false,
      isLocked: false,
    };

    setSchedule(updated);
    localStorage.setItem("activeLiveClassSchedule", JSON.stringify(updated));
    alert("⏱️ सक्रिय कक्षा का समय 15 मिनट बढ़ा दिया गया है!");
  };

  // 4. Force Start Now for upcoming class
  const handleStartLiveNow = () => {
    const now = new Date();
    const curStartStr = `${String(now.getHours()).padStart(2, "0")}:${String(now.getMinutes()).padStart(2, "0")}`;
    const newEndStr = addMinutesToTime(curStartStr, schedule.durationMinutes || 45);

    const updated: LiveClassSchedule = {
      ...schedule,
      date: now.toISOString().split("T")[0],
      startTime: curStartStr,
      endTime: newEndStr,
      status: "live",
      isExpired: false,
      isLocked: false,
    };

    setSchedule(updated);
    localStorage.setItem("activeLiveClassSchedule", JSON.stringify(updated));
  };

  // 5. Early Manual End of Class (सत्र समाप्त - काउंट बढ़ेगा और सभी संदेश हटेंगे)
  const handleEndClassNow = async () => {
    if (!confirm("क्या आप कक्षा को अभी समाप्त करना चाहते हैं? निर्धारित समय से पहले सत्र समाप्त हो जाएगा और इस सत्र के सभी संदेश साफ़ कर दिए जाएंगे।")) return;
    const now = new Date();
    const curTimeStr = `${String(now.getHours()).padStart(2, "0")}:${String(now.getMinutes()).padStart(2, "0")}`;

    const updated: LiveClassSchedule = {
      ...schedule,
      endTime: curTimeStr,
      status: "ended",
      isExpired: true,
      isLocked: true,
    };

    if (isRecording) stopSpeechRecognition();
    if ("speechSynthesis" in window) {
      window.speechSynthesis.cancel();
    }
    setSchedule(updated);
    localStorage.setItem("activeLiveClassSchedule", JSON.stringify(updated));

    // Register subject count on manual early finish
    recordClassCompletion(updated);

    // Clear messages from UI and backend server immediately
    setMessages([]);
    try {
      await axios.post(`${API}/live/clear`);
    } catch (err) {
      console.error("Error clearing session on manual end:", err);
    }
  };

  // 6. Cancel Class (कक्षा रद्द करें - सभी संदेश हटेंगे, क्लास काउंट नहीं बढ़ेगा)
  const handleCancelClass = async () => {
    if (!confirm("क्या आप वाकई इस कक्षा को रद्द करना चाहते हैं? इस सत्र के सभी संवाद और संदेश तुरंत साफ़ हो जाएंगे।")) return;

    if (isRecording) stopSpeechRecognition();
    if ("speechSynthesis" in window) {
      window.speechSynthesis.cancel();
    }

    const updated: LiveClassSchedule = {
      ...schedule,
      status: "ended",
      isExpired: true,
      isLocked: true,
    };

    setSchedule(updated);
    localStorage.setItem("activeLiveClassSchedule", JSON.stringify(updated));

    // Notice: Do NOT call recordClassCompletion because it was cancelled, not completed!

    // Clear messages from UI and backend server immediately
    setMessages([]);
    try {
      await axios.post(`${API}/live/clear`);
    } catch (err) {
      console.error("Error clearing session on cancel:", err);
    }
  };

  // Total completed classes across all subjects
  const totalCompletedClasses = Object.values(subjectCounts).reduce((a, b) => a + b, 0);

  // Calculate live progress percentage
  const progressPercent =
    schedule.status === "live" && totalDurationSeconds > 0
      ? Math.min(100, Math.max(0, Math.round(((totalDurationSeconds - secondsRemaining) / totalDurationSeconds) * 100)))
      : schedule.status === "ended"
      ? 100
      : 0;

  return (
    <div className="p-6 sm:p-8 bg-[#F8FAFC] min-h-full space-y-6 max-w-6xl mx-auto font-sans pb-16">
      {/* 1. Header Banner */}
      <div
        style={{ background: "linear-gradient(135deg, #2563EB 0%, #7C3AED 100%)" }}
        className="p-6 sm:p-8 rounded-[20px] shadow-lg shadow-indigo-950/15 border border-white/20 flex flex-col md:flex-row md:items-center justify-between gap-6 relative overflow-hidden text-white"
      >
        <div className="absolute top-0 right-0 -mt-10 -mr-10 w-48 h-48 bg-white/10 rounded-full blur-2xl pointer-events-none" />

        <div className="relative z-10 space-y-3">
          <div className="flex flex-wrap items-center gap-2">
            <span
              style={{ backgroundColor: "rgba(255, 255, 255, 0.2)" }}
              className="text-white text-xs font-black px-3 py-1 rounded-full border border-white/30 backdrop-blur-md shadow-2xs flex items-center gap-1.5"
            >
              {schedule.status === "live" ? (
                <>
                  <span className="w-2 h-2 rounded-full bg-emerald-400 animate-ping"></span>
                  🔴 सक्रिय लाइव कक्षा
                </>
              ) : schedule.status === "upcoming" ? (
                <>
                  <span className="w-2 h-2 rounded-full bg-amber-300"></span>
                  ⏳ आगामी निर्धारित कक्षा
                </>
              ) : (
                <>
                  <span>🔒</span>
                  स्वतः बंद (समय समाप्त)
                </>
              )}
            </span>
            <span
              style={{ backgroundColor: "rgba(255, 255, 255, 0.2)" }}
              className="text-white text-xs font-bold px-3 py-1 rounded-full border border-white/30 backdrop-blur-md shadow-2xs"
            >
              माध्यम: हिंदी
            </span>
          </div>
          <h1 className="text-2xl sm:text-3xl font-black text-white tracking-tight">
            🎙️ लाइव कक्षा संवाद व शेड्यूलर
          </h1>
          <p className="text-blue-100 text-xs sm:text-sm font-medium mt-0.5 max-w-2xl leading-relaxed">
            कक्षा व विषय चुनें, टॉपिक दर्ज करें और समय निर्धारित करें। निर्धारित समय समाप्त होते ही लाइव क्लास स्वतः बंद हो जाएगी।
          </p>
        </div>

        <div className="relative z-10 flex flex-wrap items-center gap-2.5 shrink-0">
          {/* ⬅️ Return to Dashboard Link */}
          <Link
            to="/teacher"
            style={{ backgroundColor: "rgba(255, 255, 255, 0.2)" }}
            className="hover:bg-white/30 text-white font-bold text-xs px-4 py-2.5 rounded-xl border border-white/30 backdrop-blur-md shadow-2xs transition flex items-center gap-1.5 active:scale-95 cursor-pointer"
            title="मुख्य शिक्षक डैशबोर्ड पर जाएं"
          >
            <span className="text-sm">⬅️</span>
            <span>डैशबोर्ड पर लौटें</span>
          </Link>

          {/* Primary CTA: Schedule Class Button */}
          <button
            onClick={handleOpenScheduleModal}
            style={{ background: "linear-gradient(135deg, #4F46E5 0%, #7C3AED 100%)" }}
            className="px-5 py-2.5 rounded-xl font-black text-xs text-white border border-white/30 shadow-md hover:shadow-lg transition flex items-center gap-2 active:scale-95 cursor-pointer"
          >
            <span>📅</span>
            <span>+ नई क्लास जोड़ें</span>
          </button>

          {/* Auto-Speak Toggle Button */}
          <button
            onClick={() => setAutoSpeak(!autoSpeak)}
            style={{ backgroundColor: "rgba(255, 255, 255, 0.2)" }}
            className={`px-4 py-2.5 rounded-xl font-bold text-xs border border-white/30 backdrop-blur-md shadow-2xs transition flex items-center gap-1.5 text-white hover:bg-white/30 cursor-pointer ${
              autoSpeak ? "ring-2 ring-white/60" : "opacity-80"
            }`}
            title="ऑटो-ऑडियो सक्षम/अक्षम करें"
          >
            <span>{autoSpeak ? "🔊" : "🔇"}</span>
            <span>{autoSpeak ? "ऑटो आवाज़: चालू" : "ऑटो आवाज़: बंद"}</span>
          </button>

          <button
            onClick={handleClearSession}
            style={{ backgroundColor: "rgba(255, 255, 255, 0.2)" }}
            className="hover:bg-white/30 text-white text-xs font-bold px-4 py-2.5 rounded-xl border border-white/30 backdrop-blur-md shadow-2xs transition cursor-pointer"
          >
            🔄 संवाद रीसेट
          </button>
        </div>
      </div>

      {/* 2. Scheduled Class Real-Time Status & Auto-Close Controller Card */}
      <div className="bg-[#FFFFFF] p-5 sm:p-6 rounded-[18px] border border-[#DBEAFE] shadow-sm space-y-4">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 pb-3 border-b border-[#DBEAFE]">
          {/* Left: Class, Subject, Room Badges */}
          <div className="flex flex-wrap items-center gap-2">
            <span className="bg-[#DBEAFE] text-[#1E40AF] text-xs font-black px-3 py-1 rounded-full border border-[#BFDBFE]">
              🎓 {schedule.grade}
            </span>
            <span className="bg-[#EEF2FF] text-[#4338CA] text-xs font-black px-3 py-1 rounded-full border border-[#C7D2FE]">
              📚 विषय: {schedule.subject}
            </span>
            {schedule.roomCode && (
              <span className="bg-[#F8FAFC] text-slate-600 text-xs font-bold px-2.5 py-1 rounded-md border border-[#E2E8F0]">
                🏷️ रूम: {schedule.roomCode}
              </span>
            )}
          </div>

          {/* Right: Dynamic Live / Auto-Close Status Pill */}
          <div className="flex items-center gap-2.5">
            {schedule.status === "live" ? (
              <div className="flex items-center gap-2 bg-[#EFF6FF] border border-[#BFDBFE] px-3.5 py-1.5 rounded-xl shadow-2xs">
                <span className="relative flex h-3 w-3">
                  <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-red-400 opacity-75"></span>
                  <span className="relative inline-flex rounded-full h-3 w-3 bg-red-600"></span>
                </span>
                <span className="text-xs font-black text-[#1E40AF]">
                  🔴 लाइव जारी है • स्वतः बंद होने में शेष:
                </span>
                <span className="text-sm font-black font-mono text-[#0F172A] bg-white px-2 py-0.5 rounded-md border border-[#DBEAFE]">
                  ⏱️ {countdownText}
                </span>
              </div>
            ) : schedule.status === "upcoming" ? (
              <div className="flex items-center gap-2 bg-[#FEF3C7] border border-[#FDE68A] px-3.5 py-1.5 rounded-xl shadow-2xs">
                <span className="text-xs font-black text-[#92400E]">
                  ⏳ आगामी कक्षा • लाइव होने में शेष:
                </span>
                <span className="text-sm font-black font-mono text-[#92400E] bg-white px-2 py-0.5 rounded-md border border-[#FDE68A]">
                  🕒 {countdownText}
                </span>
              </div>
            ) : (
              <div className="flex items-center gap-2 bg-[#F1F5F9] border border-[#CBD5E1] px-3.5 py-1.5 rounded-xl shadow-2xs">
                <span className="text-xs font-black text-[#475569]">
                  🔒 कक्षा का समय समाप्त — सत्र स्वतः बंद है
                </span>
              </div>
            )}
          </div>
        </div>

        {/* Middle: Topic Title and Schedule Timing */}
        <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4">
          <div className="space-y-1">
            <div className="text-[11px] font-black uppercase tracking-wider text-slate-500">
              आज का निर्धारित विषय / टॉपिक
            </div>
            <h2 className="text-lg sm:text-xl font-black text-[#0F172A] flex items-center gap-2">
              <span>📖</span>
              <span>{schedule.topic}</span>
            </h2>
            <div className="flex flex-wrap items-center gap-3 text-xs text-slate-600 font-medium pt-0.5">
              <span>📅 {schedule.date}</span>
              <span>•</span>
              <span>
                🕒 {formatTimeDisplay(schedule.startTime)} से {formatTimeDisplay(schedule.endTime)}
              </span>
              <span>•</span>
              <span className="font-bold text-[#1E40AF]">
                अवधि: {schedule.durationMinutes} मिनट
              </span>
            </div>
          </div>

          {/* Action Buttons for Schedule */}
          <div className="flex flex-wrap items-center gap-2 shrink-0">
            {schedule.status === "live" && (
              <>
                <button
                  onClick={handleExtend15Minutes}
                  style={{ background: "linear-gradient(135deg, #4F46E5 0%, #7C3AED 100%)" }}
                  className="px-3.5 py-2 rounded-xl text-xs font-black text-white shadow-xs hover:shadow-md transition active:scale-95 cursor-pointer flex items-center gap-1.5"
                  title="कक्षा का समय 15 मिनट आगे बढ़ाएं"
                >
                  <span>⏱️</span>
                  <span>+15 मिनट बढ़ाएं</span>
                </button>
                <button
                  onClick={handleEndClassNow}
                  className="px-3.5 py-2 rounded-xl text-xs font-bold bg-[#F8FAFC] hover:bg-emerald-50 text-slate-700 hover:text-emerald-700 border border-[#CBD5E1] hover:border-emerald-300 transition active:scale-95 cursor-pointer flex items-center gap-1"
                  title="कक्षा पूरी करें और समाप्त करें"
                >
                  <span>⏹️</span>
                  <span>अभी समाप्त करें</span>
                </button>
                <button
                  onClick={handleCancelClass}
                  className="px-3.5 py-2 rounded-xl text-xs font-bold bg-[#F8FAFC] hover:bg-rose-50 text-slate-700 hover:text-rose-700 border border-[#CBD5E1] hover:border-rose-300 transition active:scale-95 cursor-pointer flex items-center gap-1"
                  title="कक्षा रद्द करें और सभी संदेश हटाएं"
                >
                  <span>❌</span>
                  <span>कक्षा रद्द करें</span>
                </button>
              </>
            )}

            {schedule.status === "upcoming" && (
              <>
                <button
                  onClick={handleStartLiveNow}
                  style={{ background: "linear-gradient(135deg, #2563EB 0%, #7C3AED 100%)" }}
                  className="px-4 py-2 rounded-xl text-xs font-black text-white shadow-xs hover:shadow-md transition active:scale-95 cursor-pointer flex items-center gap-1.5"
                >
                  <span>⚡</span>
                  <span>तुरंत लाइव शुरू करें</span>
                </button>
                <button
                  onClick={handleCancelClass}
                  className="px-3.5 py-2 rounded-xl text-xs font-bold bg-[#F8FAFC] hover:bg-rose-50 text-slate-700 hover:text-rose-700 border border-[#CBD5E1] hover:border-rose-300 transition active:scale-95 cursor-pointer flex items-center gap-1"
                  title="कक्षा रद्द करें और सभी संदेश हटाएं"
                >
                  <span>❌</span>
                  <span>कक्षा रद्द करें</span>
                </button>
              </>
            )}

          </div>
        </div>

        {/* Live Elapsed Progress Bar */}
        {schedule.status === "live" && (
          <div className="space-y-1 pt-1">
            <div className="flex items-center justify-between text-[11px] font-bold text-slate-500">
              <span>प्रारंभ: {formatTimeDisplay(schedule.startTime)}</span>
              <span className="text-[#1E40AF] font-black">{progressPercent}% समय पूर्ण</span>
              <span>स्वतः समाप्ति: {formatTimeDisplay(schedule.endTime)}</span>
            </div>
            <div className="w-full h-2 bg-[#EFF6FF] rounded-full overflow-hidden border border-[#DBEAFE]">
              <div
                className="h-full bg-gradient-to-r from-blue-600 to-indigo-600 rounded-full transition-all duration-1000"
                style={{ width: `${progressPercent}%` }}
              />
            </div>
          </div>
        )}
      </div>

      {/* Auto-Close Alert Notice when Session is Ended */}
      {schedule.isLocked && (
        <div className="bg-[#FEF2F2] border border-[#FECACA] p-4 sm:p-5 rounded-2xl flex flex-col sm:flex-row sm:items-center justify-between gap-3 shadow-2xs">
          <div className="flex items-start sm:items-center gap-3">
            <span className="text-2xl">🔒</span>
            <div>
              <h4 className="text-sm font-black text-[#991B1B]">
                कक्षा का निर्धारित समय समाप्त हो चुका है — यह लाइव सत्र स्वतः बंद हो गया है।
              </h4>
              <p className="text-xs text-[#7F1D1D] font-medium mt-0.5">
                एक बार समय निकल जाने के बाद इस कक्षा की अवधि को दोबारा नहीं बढ़ाया जा सकता। आगे शिक्षण जारी रखने के लिए कृपया नई क्लास शेड्यूल करें।
              </p>
            </div>
          </div>
        </div>
      )}

      {/* 3. विषयवार पूर्ण कक्षा आँकड़े व लाइव काउंटर (Subject-wise Completed Classes Counter) */}
      <div className="bg-[#FFFFFF] p-6 rounded-[20px] border border-[#DBEAFE] shadow-sm space-y-5">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-[#DBEAFE]">
          <div className="space-y-1">
            <div className="flex items-center gap-2">
              <span className="text-xl">📊</span>
              <h2 className="text-lg sm:text-xl font-black text-[#0F172A] tracking-tight">
                विषयवार पूर्ण कक्षा आँकड़े
              </h2>
              <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse"></span>
            </div>
            <p className="text-xs sm:text-sm text-slate-600 font-medium leading-relaxed">
              जैसे-जैसे कक्षाएं संपन्न होती हैं, संबंधित विषय का काउंट यहाँ स्वतः जुड़ता जाता है।
            </p>
          </div>

          <div
            style={{ background: "linear-gradient(135deg, #4F46E5 0%, #7C3AED 100%)" }}
            className="px-4 py-2.5 rounded-xl text-white shadow-md flex items-center gap-2.5 shrink-0"
          >
            <span className="text-lg">🎓</span>
            <div>
              <div className="text-[10px] font-bold text-indigo-100 uppercase tracking-wider">कुल संपन्न कक्षाएं</div>
              <div className="text-base sm:text-lg font-black">{totalCompletedClasses} कक्षाएं</div>
            </div>
          </div>
        </div>

        {/* 6 Subject Count Cards */}
        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-3 sm:gap-4">
          {SUBJECT_OPTIONS.map((subj) => {
            const count = subjectCounts[subj] || 0;
            const meta = SUBJECT_DETAILS_META[subj] || {
              icon: "📚",
              desc: "कक्षा सत्र",
              borderColor: "border-[#DBEAFE]",
              bgBadge: "bg-[#EFF6FF]",
              textBadge: "text-[#2563EB]",
            };
            const isCurrentClassSubject = normalizeSubjectName(schedule.subject) === subj;

            return (
              <div
                key={subj}
                className={`p-4 rounded-[16px] bg-[#F8FAFC] border transition-all duration-200 hover:shadow-md hover:bg-white space-y-2 relative overflow-hidden group ${
                  isCurrentClassSubject
                    ? "border-[#4F46E5] ring-2 ring-indigo-200 shadow-2xs"
                    : "border-[#DBEAFE]"
                }`}
              >
                {isCurrentClassSubject && (
                  <div className="absolute top-0 right-0 bg-[#4F46E5] text-white text-[9px] font-black px-2 py-0.5 rounded-bl-lg">
                    {schedule.status === "live" ? "🔴 लाइव" : "सक्रिय"}
                  </div>
                )}

                <div className="flex items-center justify-between">
                  <span className="text-xl">{meta.icon}</span>
                  <span className={`text-[10px] font-black px-2 py-0.5 rounded-full ${meta.bgBadge} ${meta.textBadge} border ${meta.borderColor}`}>
                    ✓ पूर्ण
                  </span>
                </div>

                <div>
                  <div className="text-2xl sm:text-3xl font-black text-[#0F172A] tracking-tight">
                    {count}
                  </div>
                  <div className="text-xs font-black text-slate-800 line-clamp-1 mt-0.5">
                    {subj}
                  </div>
                  <div className="text-[10px] text-slate-500 font-semibold line-clamp-1 mt-0.5">
                    {meta.desc}
                  </div>
                </div>
              </div>
            );
          })}
        </div>

        {/* Recently Completed Log Bar */}
        {recentCompletedLog.length > 0 && (
          <div className="pt-2 border-t border-[#EFF6FF] flex flex-col sm:flex-row sm:items-center justify-between gap-2 text-xs">
            <div className="flex items-center gap-2 text-slate-600 font-medium">
              <span className="font-extrabold text-[#0F172A]">🕒 हाल ही में पूर्ण हुई कक्षा:</span>
              <span className="font-black text-[#1E40AF]">
                {recentCompletedLog[0].grade} • {recentCompletedLog[0].subject}: "{recentCompletedLog[0].topic}"
              </span>
            </div>
            <span className="text-[11px] text-slate-500 font-bold bg-[#F8FAFC] px-2.5 py-1 rounded-lg border border-[#E2E8F0] shrink-0">
              ✓ {recentCompletedLog[0].completedAt}
            </span>
          </div>
        )}
      </div>

      {/* 4. Main Live Class Area */}
      <div className="w-full space-y-4">
        <div className="bg-[#FFFFFF] p-6 rounded-[16px] border border-[#DBEAFE] shadow-2xs space-y-4">
            <div className="flex items-center justify-between border-b border-[#DBEAFE] pb-3">
              <div className="flex items-center gap-2">
                <span className="text-sm font-extrabold text-[#0F172A] uppercase tracking-wider">
                  💬 कक्षा संवाद प्रवाह
                </span>
                {schedule.status === "live" ? (
                  <span className="w-2 h-2 rounded-full bg-blue-500 animate-ping"></span>
                ) : (
                  <span className="text-xs text-slate-400">({schedule.isLocked ? "बंद" : "प्रतीक्षारत"})</span>
                )}
              </div>
              <span className="text-[11px] font-bold text-[#1E40AF] bg-[#EFF6FF] px-2.5 py-1 rounded-lg border border-[#DBEAFE] shadow-2xs flex items-center gap-1">
                <span>🔊</span> हिंदी वॉइस आउटपुट सक्रिय
              </span>
            </div>

            {/* Messages Scroll Area */}
            <div className="space-y-3.5 max-h-[460px] overflow-y-auto pr-2">
              {messages.length === 0 ? (
                <div className="py-12 text-center text-slate-500 text-xs font-semibold bg-[#EFF6FF] rounded-xl border border-[#DBEAFE] p-6">
                  {schedule.isLocked || schedule.status === "ended" ? (
                    <div className="space-y-1.5 max-w-md mx-auto">
                      <div className="text-sm font-black text-[#1E40AF] flex items-center justify-center gap-1.5">
                        <span>🔒</span>
                        <span>कक्षा समाप्त / रद्द — संवाद सत्र साफ़ कर दिया गया है</span>
                      </div>
                      <p className="text-slate-600 text-xs leading-relaxed">
                        इस कक्षा के सभी संदेश व बातचीत हटा दी गई है। नई क्लास शेड्यूल करने पर नया सत्र आरंभ होगा।
                      </p>
                    </div>
                  ) : (
                    "अभी तक कोई संदेश नहीं भेजा गया है। नीचे से संदेश भेजें या त्वरित निर्देश चुनें।"
                  )}
                </div>
              ) : (
                messages.map((item) => (
                  <div
                    key={item.id}
                    className={`p-4 rounded-[12px] border border-[#DBEAFE] bg-white shadow-2xs transition-all ${
                      item.senderRole === "teacher"
                        ? "ml-4 border-l-4 border-l-[#4F46E5]"
                        : "mr-4 border-l-4 border-l-[#2563EB]"
                    }`}
                  >
                    <div className="flex items-center justify-between mb-1.5">
                      <div className="flex items-center gap-2">
                        <span
                          className={`text-xs font-black px-2.5 py-0.5 rounded-full ${
                            item.senderRole === "teacher"
                              ? "bg-[#4F46E5] text-white"
                              : "bg-[#2563EB] text-white"
                          }`}
                        >
                          {item.senderName}
                        </span>
                        {item.senderRole === "student" && (
                          <span className="text-[10px] bg-[#DBEAFE] text-[#1E40AF] font-bold px-2 py-0.5 rounded-md border border-[#BFDBFE]">
                            हिंदी में अनुवादित ✓
                          </span>
                        )}
                      </div>
                      <div className="flex items-center gap-2 text-[10px] text-slate-500 font-bold">
                        <span>{item.timestamp}</span>
                        <button
                          onClick={() => speakHindi(item.hindiText || item.originalText, item.id)}
                          className={`px-2.5 py-1 rounded-lg border text-xs font-bold transition flex items-center gap-1 shadow-2xs cursor-pointer ${
                            playingAudioId === item.id
                              ? "bg-[#4F46E5] text-white border-[#4F46E5] animate-pulse ring-2 ring-indigo-200"
                              : "bg-[#EFF6FF] hover:bg-[#DBEAFE] text-[#1E40AF] border-[#DBEAFE]"
                          }`}
                          title="हिंदी में सुनें"
                        >
                          <span>🔊</span>
                          <span>{playingAudioId === item.id ? "सुन रहे हैं..." : "हिंदी में सुनें"}</span>
                        </button>
                      </div>
                    </div>

                    <p className="text-sm font-bold text-[#0F172A] leading-relaxed">
                      {item.hindiText || item.originalText}
                    </p>
                  </div>
                ))
              )}
            </div>

            {/* Teacher Speech Recognition & Input Box */}
            <div className="pt-4 border-t border-[#DBEAFE] space-y-3">
              {/* Active Voice Recording Live Banner */}
              {isRecording && !schedule.isLocked && (
                <div className="bg-[#EFF6FF] border-2 border-[#4F46E5] p-4 rounded-2xl animate-pulse space-y-2">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <span className="w-3 h-3 rounded-full bg-[#4F46E5] animate-ping"></span>
                      <span className="text-xs font-black text-[#4F46E5] uppercase tracking-wider">
                        🎙️ लाइव वॉइस इनपुट: आपकी आवाज़ सुनी जा रही है...
                      </span>
                    </div>
                    <button
                      onClick={stopSpeechRecognition}
                      style={{ background: "linear-gradient(135deg, #4F46E5 0%, #7C3AED 100%)" }}
                      className="text-white text-[11px] font-black px-3 py-1 rounded-lg shadow-xs cursor-pointer"
                    >
                      ⏹️ बोलना समाप्त करें
                    </button>
                  </div>
                  {speechTranscript ? (
                    <div className="bg-white p-2.5 rounded-xl border border-[#DBEAFE] text-sm font-black text-[#0F172A]">
                      "{speechTranscript}"
                    </div>
                  ) : (
                    <p className="text-xs text-[#4F46E5] font-bold italic">
                      हिंदी में बोलना शुरू करें (उदा. "नमस्ते बच्चों, सब अपनी किताब का पाठ 1 खोलें")...
                    </p>
                  )}
                </div>
              )}

              {/* Status or permission feedback */}
              {micStatusMsg && !isRecording && (
                <div className="text-[11px] font-bold text-[#1E40AF] bg-[#EFF6FF] px-3 py-1.5 rounded-xl border border-[#DBEAFE] shadow-2xs flex items-center justify-between">
                  <span>{micStatusMsg}</span>
                  <button onClick={() => setMicStatusMsg("")} className="text-[#1E40AF] hover:text-blue-950 font-bold ml-2">×</button>
                </div>
              )}

              <div className="flex items-center gap-2">
                {/* 1. Indigo-Violet Gradient Microphone Button */}
                <button
                  type="button"
                  onClick={handleToggleMic}
                  disabled={schedule.isLocked}
                  style={
                    schedule.isLocked
                      ? { backgroundColor: "#CBD5E1" }
                      : { background: "linear-gradient(135deg, #4F46E5 0%, #7C3AED 100%)" }
                  }
                  className={`p-3.5 rounded-xl font-black text-xs sm:text-sm text-white flex items-center gap-2 transition-all shadow-md shrink-0 active:scale-95 cursor-pointer disabled:cursor-not-allowed disabled:opacity-60 ${
                    isRecording ? "animate-pulse ring-4 ring-indigo-300/40" : ""
                  }`}
                  title={schedule.isLocked ? "कक्षा का समय समाप्त है" : isRecording ? "बोलना रोकें" : "हिंदी में बोलकर भेजें"}
                >
                  <span className="text-base">{schedule.isLocked ? "🔒" : isRecording ? "🔴" : "🎙️"}</span>
                  <span className="hidden sm:inline font-black">
                    {schedule.isLocked ? "माइक बंद है" : isRecording ? "सुन रहे हैं..." : "बोलकर कहें (माइक)"}
                  </span>
                </button>

                {/* 2. Text Input */}
                <input
                  type="text"
                  value={inputText}
                  disabled={schedule.isLocked}
                  onChange={(e) => setInputText(e.target.value)}
                  onKeyDown={(e) => e.key === "Enter" && !schedule.isLocked && handleSendMessage(inputText)}
                  placeholder={
                    schedule.isLocked
                      ? "🔒 कक्षा का समय समाप्त हो चुका है — सत्र स्वतः बंद है"
                      : "यहाँ हिंदी में संदेश लिखें या 🎙️ 'बोलकर कहें' बटन दबाएं..."
                  }
                  className={`flex-1 border p-3.5 rounded-xl text-xs sm:text-sm font-semibold transition shadow-2xs ${
                    schedule.isLocked
                      ? "bg-slate-100 border-slate-300 text-slate-400 cursor-not-allowed"
                      : "border-[#DBEAFE] bg-white text-[#0F172A] focus:outline-none focus:border-[#4F46E5] focus:ring-2 focus:ring-indigo-100"
                  }`}
                />

                {/* 3. Send Button */}
                <button
                  onClick={() => handleSendMessage(inputText)}
                  disabled={loading || !inputText.trim() || schedule.isLocked}
                  style={{ background: "linear-gradient(135deg, #2563EB 0%, #1D4ED8 100%)" }}
                  className="text-white px-6 py-3.5 rounded-xl text-xs sm:text-sm font-black shadow-md shadow-blue-600/25 hover:shadow-lg hover:shadow-blue-600/35 transition active:scale-95 disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-1.5 shrink-0 cursor-pointer"
                >
                  <span>{loading ? "अनुवाद हो रहा है..." : "भेजें"}</span>
                  <span>➔</span>
                </button>
              </div>
            </div>
          </div>
        </div>

      {/* --- 4. Modal: Schedule Live Class (कक्षा, विषय, टॉपिक, समय, अवधि) --- */}
      {showScheduleModal && (
        <div className="fixed inset-0 z-50 bg-slate-900/60 backdrop-blur-sm flex items-center justify-center p-4 overflow-y-auto">
          <div className="bg-white rounded-[24px] max-w-2xl w-full border border-[#DBEAFE] shadow-2xl overflow-hidden my-8 animate-in fade-in zoom-in-95 duration-200">
            {/* Modal Header */}
            <div
              style={{ background: "linear-gradient(135deg, #2563EB 0%, #7C3AED 100%)" }}
              className="p-6 text-white relative overflow-hidden"
            >
              <div className="flex items-center justify-between relative z-10">
                <div className="space-y-1">
                  <div className="flex items-center gap-2">
                    <span
                      style={{ backgroundColor: "rgba(255, 255, 255, 0.2)" }}
                      className="text-xs font-black px-2.5 py-0.5 rounded-full border border-white/30"
                    >
                      📅 लाइव क्लास शेड्यूलर
                    </span>
                  </div>
                  <h3 className="text-xl sm:text-2xl font-black text-white">
                    नई लाइव क्लास शेड्यूल करें
                  </h3>
                  <p className="text-blue-100 text-xs sm:text-sm font-medium">
                    कक्षा, विषय, टॉपिक और समय चुनें। निर्धारित समय समाप्त होने पर क्लास स्वतः बंद हो जाएगी।
                  </p>
                </div>
                <button
                  onClick={() => setShowScheduleModal(false)}
                  className="w-9 h-9 rounded-full bg-white/20 hover:bg-white/30 text-white font-bold flex items-center justify-center transition cursor-pointer"
                >
                  ✕
                </button>
              </div>
            </div>

            {/* Modal Body: Steps 1 to 5 */}
            <div className="p-6 space-y-5 max-h-[75vh] overflow-y-auto">
              {/* Step 1: कक्षा चुनें (Choose Class) */}
              <div className="space-y-2">
                <label className="text-xs font-black text-[#0F172A] uppercase tracking-wider flex items-center gap-1.5">
                  <span className="w-5 h-5 rounded-full bg-[#4F46E5] text-white flex items-center justify-center text-[10px]">1</span>
                  <span>कक्षा चुनें (Class / Grade) *</span>
                </label>
                <div className="grid grid-cols-5 gap-2">
                  {GRADE_OPTIONS.map((g) => (
                    <button
                      key={g}
                      type="button"
                      onClick={() => setFormGrade(g)}
                      className={`py-2.5 px-3 rounded-xl text-xs font-extrabold border transition cursor-pointer ${
                        formGrade === g
                          ? "bg-[#4F46E5] text-white border-[#4F46E5] shadow-sm ring-2 ring-indigo-200"
                          : "bg-white text-slate-700 border-[#DBEAFE] hover:bg-[#EFF6FF]"
                      }`}
                    >
                      {g}
                    </button>
                  ))}
                </div>
              </div>

              {/* Step 2: विषय चुनें (Choose Subject) */}
              <div className="space-y-2">
                <label className="text-xs font-black text-[#0F172A] uppercase tracking-wider flex items-center gap-1.5">
                  <span className="w-5 h-5 rounded-full bg-[#4F46E5] text-white flex items-center justify-center text-[10px]">2</span>
                  <span>विषय चुनें (Subject) *</span>
                </label>
                <div className="grid grid-cols-2 sm:grid-cols-3 gap-2">
                  {SUBJECT_OPTIONS.map((s) => (
                    <button
                      key={s}
                      type="button"
                      onClick={() => {
                        setFormSubject(s);
                        // Auto-suggest first topic for this subject if user hasn't typed custom
                        const suggestions = SUBJECT_TOPIC_SUGGESTIONS[s];
                        if (suggestions && suggestions.length > 0) {
                          setFormTopic(suggestions[0]);
                        }
                      }}
                      className={`p-2.5 rounded-xl text-xs font-black border text-left transition cursor-pointer flex items-center justify-between ${
                        formSubject === s
                          ? "bg-[#4F46E5] text-white border-[#4F46E5] shadow-sm ring-2 ring-indigo-200"
                          : "bg-white text-slate-700 border-[#DBEAFE] hover:bg-[#EFF6FF]"
                      }`}
                    >
                      <span>{s}</span>
                      {formSubject === s && <span>✓</span>}
                    </button>
                  ))}
                </div>
              </div>

              {/* Step 3: टॉपिक लिखें (Topic) */}
              <div className="space-y-2">
                <label className="text-xs font-black text-[#0F172A] uppercase tracking-wider flex items-center gap-1.5">
                  <span className="w-5 h-5 rounded-full bg-[#4F46E5] text-white flex items-center justify-center text-[10px]">3</span>
                  <span>कक्षा का टॉपिक लिखें (Topic) *</span>
                </label>
                <input
                  type="text"
                  value={formTopic}
                  onChange={(e) => setFormTopic(e.target.value)}
                  placeholder="उदा. गिनती 1 से 10 और संख्या बोध..."
                  className="w-full p-3.5 rounded-xl border border-[#DBEAFE] bg-white text-sm font-semibold text-[#0F172A] focus:outline-none focus:border-[#4F46E5] focus:ring-2 focus:ring-indigo-100"
                />

                {/* Quick Topic Chips from Subject */}
                {SUBJECT_TOPIC_SUGGESTIONS[formSubject] && (
                  <div className="space-y-1.5 pt-1">
                    <span className="text-[11px] font-bold text-slate-500">
                      💡 {formSubject} के सुझाए गए टॉपिक (क्लिक करके चुनें):
                    </span>
                    <div className="flex flex-wrap gap-1.5">
                      {SUBJECT_TOPIC_SUGGESTIONS[formSubject].map((item, idx) => (
                        <button
                          key={idx}
                          type="button"
                          onClick={() => setFormTopic(item)}
                          className={`text-[11px] font-bold px-2.5 py-1 rounded-lg border transition cursor-pointer ${
                            formTopic === item
                              ? "bg-[#DBEAFE] text-[#1E40AF] border-[#BFDBFE] font-black"
                              : "bg-[#F8FAFC] text-slate-600 border-[#E2E8F0] hover:bg-white hover:border-[#BFDBFE]"
                          }`}
                        >
                          {item}
                        </button>
                      ))}
                    </div>
                  </div>
                )}
              </div>

              {/* Step 4: लाइव होने का समय (When it goes live) */}
              <div className="space-y-3">
                <label className="text-xs font-black text-[#0F172A] uppercase tracking-wider flex items-center gap-1.5">
                  <span className="w-5 h-5 rounded-full bg-[#4F46E5] text-white flex items-center justify-center text-[10px]">4</span>
                  <span>लाइव होने का समय व तारीख (Live Timing) *</span>
                </label>

                {/* Mode Tabs */}
                <div className="grid grid-cols-2 gap-2">
                  <button
                    type="button"
                    onClick={() => setFormScheduleMode("now")}
                    className={`p-3 rounded-xl text-xs font-black border text-center transition cursor-pointer flex items-center justify-center gap-2 ${
                      formScheduleMode === "now"
                        ? "bg-[#4F46E5] text-white border-[#4F46E5] shadow-sm ring-2 ring-indigo-200"
                        : "bg-white text-slate-700 border-[#DBEAFE] hover:bg-[#EFF6FF]"
                    }`}
                  >
                    <span>⚡ अभी तुरंत लाइव शुरू करें</span>
                  </button>
                  <button
                    type="button"
                    onClick={() => setFormScheduleMode("later")}
                    className={`p-3 rounded-xl text-xs font-black border text-center transition cursor-pointer flex items-center justify-center gap-2 ${
                      formScheduleMode === "later"
                        ? "bg-[#4F46E5] text-white border-[#4F46E5] shadow-sm ring-2 ring-indigo-200"
                        : "bg-white text-slate-700 border-[#DBEAFE] hover:bg-[#EFF6FF]"
                    }`}
                  >
                    <span>⏰ किसी विशिष्ट समय पर लाइव करें</span>
                  </button>
                </div>

                {formScheduleMode === "later" && (
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 p-3.5 bg-[#EFF6FF] rounded-xl border border-[#DBEAFE]">
                    <div className="space-y-1">
                      <label className="text-[11px] font-black text-[#1E40AF]">कक्षा की तारीख:</label>
                      <input
                        type="date"
                        value={formDate}
                        onChange={(e) => setFormDate(e.target.value)}
                        className="w-full p-2.5 bg-white border border-[#BFDBFE] rounded-lg text-xs font-bold text-[#0F172A]"
                      />
                    </div>
                    <div className="space-y-1">
                      <label className="text-[11px] font-black text-[#1E40AF]">लाइव शुरू होने का समय:</label>
                      <input
                        type="time"
                        value={formStartTime}
                        onChange={(e) => setFormStartTime(e.target.value)}
                        className="w-full p-2.5 bg-white border border-[#BFDBFE] rounded-lg text-xs font-bold text-[#0F172A]"
                      />
                    </div>
                  </div>
                )}
              </div>

              {/* Step 5: क्लास की अवधि व स्वतः बंद होने का नियम (Duration & Auto-Close) */}
              <div className="space-y-2">
                <label className="text-xs font-black text-[#0F172A] uppercase tracking-wider flex items-center gap-1.5">
                  <span className="w-5 h-5 rounded-full bg-[#4F46E5] text-white flex items-center justify-center text-[10px]">5</span>
                  <span>क्लास की अवधि (स्वतः बंद होने का समय) *</span>
                </label>
                <div className="grid grid-cols-4 gap-2">
                  {[15, 30, 45, 60].map((dur) => (
                    <button
                      key={dur}
                      type="button"
                      onClick={() => setFormDuration(dur)}
                      className={`py-2.5 px-3 rounded-xl text-xs font-extrabold border transition cursor-pointer text-center ${
                        formDuration === dur
                          ? "bg-[#4F46E5] text-white border-[#4F46E5] shadow-sm ring-2 ring-indigo-200"
                          : "bg-white text-slate-700 border-[#DBEAFE] hover:bg-[#EFF6FF]"
                      }`}
                    >
                      {dur} मिनट
                    </button>
                  ))}
                </div>

                {/* Auto-Close Preview Box */}
                <div className="p-3.5 bg-[#EFF6FF] rounded-xl border border-[#DBEAFE] text-xs text-[#1E40AF] space-y-1">
                  <div className="flex items-center gap-1.5 font-black">
                    <span>💡</span>
                    <span>लाइव क्लास शेड्यूलिंग सारांश:</span>
                  </div>
                  <p className="text-slate-700 text-xs font-medium leading-relaxed">
                    यह क्लास <strong>{formGrade}</strong> के लिए <strong>{formSubject}</strong> विषय पर आयोजित होगी।
                    {formScheduleMode === "now" ? (
                      <>
                        {" "}यह अभी <strong>तुरंत लाइव</strong> होगी और ठीक <strong>{formDuration} मिनट बाद</strong> स्वतः बंद हो जाएगी।
                      </>
                    ) : (
                      <>
                        {" "}यह <strong>{formDate}</strong> को <strong>{formatTimeDisplay(formStartTime)}</strong> पर लाइव होगी और <strong>{formDuration} मिनट बाद ({formatTimeDisplay(addMinutesToTime(formStartTime, formDuration))})</strong> पर <strong>स्वतः बंद</strong> हो जाएगी।
                      </>
                    )}
                  </p>
                </div>
              </div>
            </div>

            {/* Modal Footer Actions */}
            <div className="p-5 border-t border-[#DBEAFE] bg-[#F8FAFC] flex items-center justify-end gap-3">
              <button
                type="button"
                onClick={() => setShowScheduleModal(false)}
                className="px-4 py-2.5 rounded-xl text-xs font-bold text-slate-600 hover:text-slate-900 border border-slate-300 hover:bg-white transition cursor-pointer"
              >
                रद्द करें
              </button>
              <button
                type="button"
                onClick={handleSaveSchedule}
                style={{ background: "linear-gradient(135deg, #4F46E5 0%, #7C3AED 100%)" }}
                className="px-6 py-2.5 rounded-xl text-xs font-black text-white shadow-md hover:shadow-lg transition active:scale-95 cursor-pointer flex items-center gap-2"
              >
                <span>✓</span>
                <span>क्लास शेड्यूल करें व लागू करें</span>
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}