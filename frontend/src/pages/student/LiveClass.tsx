import { useState, useEffect, useRef } from "react";
import { Link } from "react-router-dom";
import axios from "axios";
import StudentPageBanner from "../../components/StudentPageBanner";

const API = "http://localhost:4000/api";

interface MessageItem {
  id: string;
  senderRole: "teacher" | "student";
  senderName: string;
  originalText: string;
  hindiText: string;
  studentViewText: string;
  studentViewDevanagari: string;
  studentViewPhonetic: string;
  audioUrl: string;
  latencyMs: number;
  timestamp: string;
}

const TRIBAL_LIVE_UI = {
  san: {
    langLabel: "संथाली (ᱥᱟᱱᱛᱟᱲᱤ)",
    scriptName: "देवनागरी / ओल चिकी",
    liveBadge: "🔴 लाइव कक्षा (अभी लाइव)",
    pageTitle: "🎙️ विद्यार्थी लाइव कक्षा",
    pageSubtitle: "शिक्षक हिंदी में बोलेंगे, और आप अपनी संथाली भाषा में देख और सुन सकेंगे!",
    autoAudioOn: "🔊 स्वतः आवाज: चालू",
    autoAudioOff: "🔇 स्वतः आवाज: बंद",
    feedTitle: "💬 लाइव अनुवादित वार्तालाप",
    audioActive: "🔊 संथाली आवाज सक्रिय",
    waitingClass: "कक्षा शुरू होने की प्रतीक्षा की जा रही है...",
    translatedTag: "संथाली में अनुवादित ✓",
    listenBtn: "🔊 सुनें",
    speakingNow: "🔊 बोल रहे हैं...",
    pronunciation: "🗣️ उच्चारण:",
    recordingBanner: "🔴 आवाज रिकॉर्ड हो रही है... बोलें!",
    stopRecording: "⏹️ बोलना समाप्त करें",
    micPrompt: "अपनी बात बोलें (जैसे: 'नमस्ते शिक्षक जी', 'हाँ, समझ आ गया')...",
    speakBtn: "🎙️ बोलें",
    listeningState: "सुन रहे हैं...",
    placeholder: "यहाँ लिखें या 🎙️ 'बोलें' बटन दबाकर बोलें...",
    sendBtn: "भेजें",
    sendingBtn: "भेजा जा रहा है...",
    quickHeading: "⚡ त्वरित उत्तर (तुरंत जवाब दें)",
    bridgeInfoTitle: "🎧 द्विभाषी अनुवाद (हिंदी ⟷ संथाली):",
    bridgeInfoDesc: "आप जो भी बोलेंगे या चुनेंगे, शिक्षक को तुरंत हिंदी में अनुवाद होकर प्राप्त होगा।",
    quickPhrases: [
      { label: "✋ हाँ, समझ आ गया!", tribal: "ᱦᱮᱸ, ᱵᱩᱡᱷᱟᱹᱣ ᱮᱱᱟ!", devanagari: "हें, बुझौ एना!", phonetic: "Hen, bujhaw ena!" },
      { label: "🔄 कृपया एक बार फिर दोहराएं", tribal: "ᱟᱨᱦᱚᱸ ᱢᱤᱫ ᱫᱷᱟᱣ ᱢᱮᱱ ᱢᱮ।", devanagari: "आरहों मिद धाव मेन मे।", phonetic: "Arhon mid dhaw men me." },
      { label: "🙏 नमस्ते शिक्षक जी!", tribal: "ᱡᱚᱦᱟᱨ ᱢᱟᱪᱮᱛ!", devanagari: "जोहार माचेत!", phonetic: "Johar machet!" },
      { label: "🙋 मेरा एक प्रश्न है", tribal: "ᱤᱧᱟᱜ ᱢᱤᱫ ᱠᱩᱠᱞᱤ ᱢᱮᱱᱟᱜ-ᱟ।", devanagari: "इञाग मिद कुक्ली मेनाग-ᱟ।", phonetic: "Inyag mid kukli menag-a." },
      { label: "✅ हाँ शिक्षक जी, मैं उपस्थित हूँ", tribal: "ᱦᱮᱸ ᱢᱟᱪᱮᱛ, ᱤᱧ ᱢᱮᱱᱟᱹᱧᱟ!", devanagari: "हें माचेत, इञ मेनाञा!", phonetic: "Hen machet, iny menanya!" },
    ],
  },
  ho: {
    langLabel: "हो (ᱦᱳ)",
    scriptName: "वारंग चिती / देवनागरी",
    liveBadge: "🔴 लाइव कक्षा (अभी लाइव)",
    pageTitle: "🎙️ विद्यार्थी लाइव कक्षा",
    pageSubtitle: "शिक्षक हिंदी में बोलेंगे, और आप अपनी हो भाषा में देख और सुन सकेंगे!",
    autoAudioOn: "🔊 स्वतः आवाज: चालू",
    autoAudioOff: "🔇 स्वतः आवाज: बंद",
    feedTitle: "💬 लाइव अनुवादित वार्तालाप",
    audioActive: "🔊 हो भाषा आवाज सक्रिय",
    waitingClass: "कक्षा शुरू होने की प्रतीक्षा की जा रही है...",
    translatedTag: "हो भाषा में अनुवादित ✓",
    listenBtn: "🔊 सुनें",
    speakingNow: "🔊 बोल रहे हैं...",
    pronunciation: "🗣️ उच्चारण:",
    recordingBanner: "🔴 आवाज रिकॉर्ड हो रही है... बोलें!",
    stopRecording: "⏹️ बोलना समाप्त करें",
    micPrompt: "अपनी बात बोलें (जैसे: 'नमस्ते शिक्षक जी', 'हाँ, समझ आ गया')...",
    speakBtn: "🎙️ बोलें",
    listeningState: "सुन रहे हैं...",
    placeholder: "यहाँ लिखें या 🎙️ 'बोलें' बटन दबाकर बोलें...",
    sendBtn: "भेजें",
    sendingBtn: "भेजा जा रहा है...",
    quickHeading: "⚡ त्वरित उत्तर (तुरंत जवाब दें)",
    bridgeInfoTitle: "🎧 द्विभाषी अनुवाद (हिंदी ⟷ हो):",
    bridgeInfoDesc: "आप जो भी बोलेंगे या चुनेंगे, शिक्षक को तुरंत हिंदी में अनुवाद होकर प्राप्त होगा।",
    quickPhrases: [
      { label: "✋ हाँ, समझ आ गया!", tribal: "ᱦᱮᱸ, ᱤᱛᱩ ᱮᱱᱟ!", devanagari: "हें, इतु एना!", phonetic: "Hen, itu ena!" },
      { label: "🔄 कृपया एक बार फिर दोहराएं", tribal: "ᱟᱨᱦᱚᱸ ᱢᱤᱫ ᱫᱷᱟᱣ ᱢᱮᱱ ᱢᱮ।", devanagari: "आरहों मिद धाव मेन मे।", phonetic: "Arhon mid dhaw men me." },
      { label: "🙏 नमस्ते शिक्षक जी!", tribal: "ᱡᱳᱣᱟᱨ ᱢᱟᱪᱮᱛ!", devanagari: "जोवार माचेत!", phonetic: "Jowar machet!" },
      { label: "🙋 मेरा एक प्रश्न है", tribal: "ᱟᱹᱧᱟᱜ ᱢᱤᱫ ᱠᱩᱠᱞᱤ ᱢᱮᱱᱟᱜ-ᱟ।", devanagari: "अंञाग मिद कुक्ली मेनाग-आ।", phonetic: "Anyag mid kukli menag-a." },
      { label: "✅ हाँ शिक्षक जी, मैं उपस्थित हूँ", tribal: "ᱦᱮᱸ ᱢᱟᱪᱮᱛ, ᱟᱹᱧ ᱢᱮᱱᱟᱹᱧᱟ!", devanagari: "हें माचेत, अंञ मेनाञा!", phonetic: "Hen machet, any menanya!" },
    ],
  },
  mun: {
    langLabel: "मुंडारी (ᱢᱩᱱᱰᱟᱨᱤ)",
    scriptName: "देवनागरी / मुंडारी लिपि",
    liveBadge: "🔴 लाइव कक्षा (अभी लाइव)",
    pageTitle: "🎙️ विद्यार्थी लाइव कक्षा",
    pageSubtitle: "शिक्षक हिंदी में बोलेंगे, और आप अपनी मुंडारी भाषा में देख और सुन सकेंगे!",
    autoAudioOn: "🔊 स्वतः आवाज: चालू",
    autoAudioOff: "🔇 स्वतः आवाज: बंद",
    feedTitle: "💬 लाइव अनुवादित वार्तालाप",
    audioActive: "🔊 मुंडारी आवाज सक्रिय",
    waitingClass: "कक्षा शुरू होने की प्रतीक्षा की जा रही है...",
    translatedTag: "मुंडारी में अनुवादित ✓",
    listenBtn: "🔊 सुनें",
    speakingNow: "🔊 बोल रहे हैं...",
    pronunciation: "🗣️ उच्चारण:",
    recordingBanner: "🔴 आवाज रिकॉर्ड हो रही है... बोलें!",
    stopRecording: "⏹️ बोलना समाप्त करें",
    micPrompt: "अपनी बात बोलें (जैसे: 'नमस्ते शिक्षक जी', 'हाँ, समझ आ गया')...",
    speakBtn: "🎙️ बोलें",
    listeningState: "सुन रहे हैं...",
    placeholder: "यहाँ लिखें या 🎙️ 'बोलें' बटन दबाकर बोलें...",
    sendBtn: "भेजें",
    sendingBtn: "भेजा जा रहा है...",
    quickHeading: "⚡ त्वरित उत्तर (तुरंत जवाब दें)",
    bridgeInfoTitle: "🎧 द्विभाषी अनुवाद (हिंदी ⟷ मुंडारी):",
    bridgeInfoDesc: "आप जो भी बोलेंगे या चुनेंगे, शिक्षक को तुरंत हिंदी में अनुवाद होकर प्राप्त होगा।",
    quickPhrases: [
      { label: "✋ हाँ, समझ आ गया!", tribal: "ᱦᱮᱸ, ᱵᱩᱡᱷᱟᱹᱣ ᱮᱱᱟ!", devanagari: "हें, बुझौ एना!", phonetic: "Hen, bujhaw ena!" },
      { label: "🔄 कृपया एक बार फिर दोहराएं", tribal: "ᱟᱨᱦᱚᱸ ᱢᱮᱱ ᱢᱮ।", devanagari: "आरहों मेन मे।", phonetic: "Arhon men me." },
      { label: "🙏 नमस्ते शिक्षक जी!", tribal: "ᱡᱚᱦᱟᱨ ᱢᱟᱪᱮᱛ!", devanagari: "जोहार माचेत!", phonetic: "Johar machet!" },
      { label: "🙋 मेरा एक प्रश्न है", tribal: "ᱤᱧᱟᱜ ᱢᱤᱫ ᱠᱩᱠᱞᱤ ᱢᱮᱱᱟᱜ-ᱟ।", devanagari: "इञाग मिद कुक्ली मेनाग-आ।", phonetic: "Inyag mid kukli menag-a." },
      { label: "✅ हाँ शिक्षक जी, मैं उपस्थित हूँ", tribal: "ᱦᱮᱸ ᱢᱟᱪᱮᱛ, ᱤᱧ ᱢᱮᱱᱟᱹᱧᱟ!", devanagari: "हें माचेत, इञ मेनाञा!", phonetic: "Hen machet, iny menanya!" },
    ],
  },
};

// Helper: Parse Date + Time string into a Date object
function parseStudentToDate(dateStr: string, timeStr: string): Date {
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

// Helper: Format seconds to MM:SS or HH:MM:SS
function formatStudentRemaining(totalSec: number): string {
  if (totalSec <= 0) return "00:00";
  const hours = Math.floor(totalSec / 3600);
  const minutes = Math.floor((totalSec % 3600) / 60);
  const seconds = totalSec % 60;
  if (hours > 0) {
    return `${hours}:${String(minutes).padStart(2, "0")}:${String(seconds).padStart(2, "0")}`;
  }
  return `${String(minutes).padStart(2, "0")}:${String(seconds).padStart(2, "0")}`;
}

export default function StudentLiveClass() {
  const isTeacher = typeof window !== "undefined" && localStorage.getItem("userRole") === "teacher";
  const studentName = localStorage.getItem("userName") || (isTeacher ? "शिक्षक" : "विद्यार्थी");
  const registeredLang = (localStorage.getItem("preferredLang") as "san" | "ho" | "mun") || "san";
  const [selectedLang, setSelectedLang] = useState<"san" | "ho" | "mun">(registeredLang);
  const [inputText, setInputText] = useState("");
  const [loading, setLoading] = useState(false);
  const [messages, setMessages] = useState<MessageItem[]>([]);

  // Active Live Class Schedule Synced from Teacher
  const [activeSchedule, setActiveSchedule] = useState<any>(() => {
    const saved = localStorage.getItem("activeLiveClassSchedule");
    if (saved) {
      try {
        return JSON.parse(saved);
      } catch (e) {}
    }
    return null;
  });
  const [scheduleStatus, setScheduleStatus] = useState<"upcoming" | "live" | "ended">("live");
  const [isClassLocked, setIsClassLocked] = useState(false);
  const [studentCountdown, setStudentCountdown] = useState("");

  // Speech Output (TTS) State for Student
  const [playingAudioId, setPlayingAudioId] = useState<string | null>(null);
  const [autoSpeak, setAutoSpeak] = useState(true);
  const previousMessageCountRef = useRef<number>(0);

  // Speech Recognition (Voice Input) State for Student
  const [isRecording, setIsRecording] = useState(false);
  const [speechTranscript, setSpeechTranscript] = useState("");
  const [micStatusMsg, setMicStatusMsg] = useState("");
  const [recognitionInstance, setRecognitionInstance] = useState<any>(null);

  const t = TRIBAL_LIVE_UI[selectedLang] || TRIBAL_LIVE_UI.san;

  // Poll active class schedule every 1 second
  useEffect(() => {
    const checkSchedule = () => {
      const saved = localStorage.getItem("activeLiveClassSchedule");
      if (!saved) return;
      try {
        const parsed = JSON.parse(saved);
        setActiveSchedule(parsed);
        const now = new Date();
        const start = parseStudentToDate(parsed.date, parsed.startTime);
        const end = parseStudentToDate(parsed.date, parsed.endTime);
        const nowTime = now.getTime();

        if (nowTime < start.getTime()) {
          setScheduleStatus("upcoming");
          setIsClassLocked(false);
          const diff = Math.max(0, Math.floor((start.getTime() - nowTime) / 1000));
          setStudentCountdown(formatStudentRemaining(diff));
        } else if (nowTime >= start.getTime() && nowTime < end.getTime()) {
          setScheduleStatus("live");
          setIsClassLocked(false);
          const diff = Math.max(0, Math.floor((end.getTime() - nowTime) / 1000));
          setStudentCountdown(formatStudentRemaining(diff));
        } else {
          setScheduleStatus("ended");
          setIsClassLocked(true);
          setStudentCountdown("00:00");
          if (isRecording) {
            stopStudentSpeechRecognition();
          }
          if (messages.length > 0) {
            setMessages([]);
          }
        }
      } catch (e) {}
    };

    checkSchedule();
    const interval = setInterval(checkSchedule, 1000);
    return () => clearInterval(interval);
  }, [isRecording, messages.length]);

  useEffect(() => {
    fetchSessionMessages();
    const interval = setInterval(fetchSessionMessages, 2000);
    return () => clearInterval(interval);
  }, [selectedLang, isClassLocked, scheduleStatus]);

  // Natural Tribal Speech Synthesis (TTS) - Student hears everything in their selected tribal language
  const speakTribal = (item: any, id?: string) => {
    const textToSpeak = item.studentViewDevanagari || item.studentViewPhonetic || item.studentViewText || item.hindiText;
    if (!textToSpeak || !textToSpeak.trim()) return;

    if (id) setPlayingAudioId(id);

    try {
      if ("speechSynthesis" in window) {
        window.speechSynthesis.cancel();
        // Remove raw Ol Chiki glyphs for the speech engine so phonetics sound natural
        const cleanPronunciation = textToSpeak.replace(/[\u1C50-\u1C7F]/g, "").trim() || item.studentViewPhonetic || item.studentViewDevanagari;

        const utterance = new SpeechSynthesisUtterance(cleanPronunciation);
        utterance.lang = "hi-IN";
        utterance.rate = 0.88; // Gentle pacing for young tribal learners
        utterance.pitch = 1.05;

        const voices = window.speechSynthesis.getVoices();
        const inVoice = voices.find(
          (v) => v.lang.toLowerCase().includes("hi") || v.lang.toLowerCase().includes("in")
        );
        if (inVoice) {
          utterance.voice = inVoice;
        }

        utterance.onend = () => {
          setPlayingAudioId(null);
        };
        utterance.onerror = () => {
          setPlayingAudioId(null);
        };

        window.speechSynthesis.speak(utterance);
      } else {
        const audioUrl = `https://dict.youdao.com/dictvoice?audio=${encodeURIComponent(textToSpeak)}&type=2`;
        const audio = new Audio(audioUrl);
        audio.onended = () => setPlayingAudioId(null);
        audio.onerror = () => setPlayingAudioId(null);
        audio.play().catch(() => setPlayingAudioId(null));
      }
    } catch (e) {
      console.warn("Tribal speech synthesis error:", e);
      setPlayingAudioId(null);
    }
  };

  // Auto-Speak Effect: Automatically pronounce teacher's incoming message in tribal language for student
  useEffect(() => {
    if (messages.length > previousMessageCountRef.current && messages.length > 0) {
      const latestMsg = messages[messages.length - 1];
      if (autoSpeak) {
        speakTribal(latestMsg, latestMsg.id);
      }
    }
    previousMessageCountRef.current = messages.length;
  }, [messages, autoSpeak, selectedLang]);

  // Voice Input Speech Recognition for Student
  const startStudentSpeechRecognition = () => {
    if (isClassLocked) {
      setMicStatusMsg("🔒 कक्षा का समय समाप्त हो चुका है।");
      return;
    }

    const SpeechRecognition = (window as any).SpeechRecognition || (window as any).webkitSpeechRecognition;

    if (!SpeechRecognition) {
      setMicStatusMsg("🎙️ माइक सक्रिय है...");
      setIsRecording(true);
      const demoResponses = t.quickPhrases.map((p) => p.tribal);
      const picked = demoResponses[Math.floor(Math.random() * demoResponses.length)];
      setTimeout(() => {
        setInputText(picked);
        setSpeechTranscript(picked);
        setIsRecording(false);
        setMicStatusMsg("आवाज रिकॉर्ड हुई: " + picked);
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
        setMicStatusMsg("🎤 माइक चालू है... " + t.speakBtn);
        setSpeechTranscript("");
      };

      recognition.onresult = (event: any) => {
        let currentText = "";
        for (let i = event.resultIndex; i < event.results.length; i++) {
          currentText += event.results[i][0].transcript;
        }
        setSpeechTranscript(currentText);

        const lowerSpoken = currentText.toLowerCase();
        let mappedTribal = currentText;
        if (lowerSpoken.includes("समझ") || lowerSpoken.includes("हाँ") || lowerSpoken.includes("yes")) {
          mappedTribal = selectedLang === "ho" ? "ᱦᱮᱸ, ᱤᱛᱩ ᱮᱱᱟ!" : "ᱦᱮᱸ, ᱵᱩᱡᱷᱟᱹᱣ ᱮᱱᱟ!";
        } else if (lowerSpoken.includes("नमस्ते") || lowerSpoken.includes("जोहार") || lowerSpoken.includes("hello")) {
          mappedTribal = selectedLang === "ho" ? "ᱡᱳᱣᱟᱨ ᱢᱟᱪᱮᱛ!" : "ᱡᱚᱦᱟᱨ ᱢᱟᱪᱮᱛ!";
        } else if (lowerSpoken.includes("सवाल") || lowerSpoken.includes("प्रश्न") || lowerSpoken.includes("doubt")) {
          mappedTribal = "ᱤᱧᱟᱜ ᱢᱤᱫ ᱠᱩᱠᱞᱤ ᱢᱮᱱᱟᱜ-ᱟ।";
        } else if (lowerSpoken.includes("फिर") || lowerSpoken.includes("दोबारा") || lowerSpoken.includes("repeat")) {
          mappedTribal = "ᱟᱨᱦᱚᱸ ᱢᱤᱫ ᱫᱷᱟᱣ ᱢᱮᱱ ᱢᱮ।";
        } else if (lowerSpoken.includes("उपस्थित") || lowerSpoken.includes("हाजिर") || lowerSpoken.includes("present")) {
          mappedTribal = selectedLang === "ho" ? "ᱦᱮᱸ ᱢᱟᱪᱮᱛ, ᱟᱹᱧ ᱢᱮᱱᱟᱹᱧᱟ!" : "ᱦᱮᱸ ᱢᱟᱪᱮᱛ, ᱤᱧ ᱢᱮᱱᱟᱹᱧᱟ!";
        }

        setInputText(mappedTribal);
      };

      recognition.onerror = (event: any) => {
        console.warn("Speech recognition error:", event.error);
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

  const stopStudentSpeechRecognition = () => {
    if (recognitionInstance) {
      try {
        recognitionInstance.stop();
      } catch (e) {
        console.log(e);
      }
    }
    setIsRecording(false);
  };

  const handleToggleStudentMic = () => {
    if (isClassLocked) {
      alert("🔒 कक्षा का समय समाप्त हो चुका है।");
      return;
    }
    if (isRecording) {
      stopStudentSpeechRecognition();
    } else {
      startStudentSpeechRecognition();
    }
  };

  const fetchSessionMessages = async () => {
    if (isClassLocked || scheduleStatus === "ended") {
      if (messages.length > 0) setMessages([]);
      return;
    }
    try {
      const res = await axios.get(`${API}/live/session?lang=${selectedLang}`);
      setMessages(res.data.turns || []);
    } catch (err) {
      console.error("Error fetching student live session:", err);
    }
  };

  const handleSendMessage = async (textToSend: string) => {
    if (isClassLocked) {
      alert("🔒 कक्षा का निर्धारित समय समाप्त हो चुका है। यह लाइव सत्र स्वतः बंद हो गया है।");
      return;
    }
    if (!textToSend || textToSend.trim() === "") return;
    if (isRecording) stopStudentSpeechRecognition();
    setLoading(true);

    try {
      await axios.post(`${API}/live/translate-speech`, {
        text: textToSend.trim(),
        from: selectedLang,
        role: "student",
        senderName: `${studentName} (विद्यार्थी)`,
      });

      setInputText("");
      setSpeechTranscript("");
      setMicStatusMsg("");
      await fetchSessionMessages();
    } catch (err) {
      console.error("Error sending student speech:", err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="p-6 sm:p-8 bg-[#F8FAFC] min-h-full space-y-6 max-w-6xl mx-auto font-sans">
      {/* 1. Header Banner matching Image 2 */}
      <StudentPageBanner
        icon="🎙️"
        title={t.pageTitle.replace(/^[^\w\s\u0900-\u097F]+/, "").trim()}
        subtitle={t.pageSubtitle}
        tag={t.liveBadge}
        gradientClass="from-[#2563EB] to-[#7C3AED]"
        extraAction={
          <Link
            to="/teacher/liveclass"
            style={{ background: "linear-gradient(135deg, #4F46E5 0%, #7C3AED 100%)" }}
            className="text-[#FFFFFF] font-black text-xs sm:text-sm px-4 py-2.5 rounded-full border border-white/30 shadow-md transition flex items-center gap-2 active:scale-95 cursor-pointer"
            title="नई लाइव क्लास शेड्यूल या जोड़ें"
          >
            <span>📅</span>
            <span>+ नई क्लास जोड़ें</span>
          </Link>
        }
      />

      {/* 2. Active Scheduled Class Banner & Live Timer for Student */}
      {activeSchedule && (
        <div className="bg-white p-5 rounded-[18px] border border-[#C7D2FE] shadow-2xs space-y-3">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-3 border-b border-[#E0E7FF]">
            <div className="flex flex-wrap items-center gap-2">
              <span className="bg-[#DBEAFE] text-[#1E40AF] text-xs font-black px-3 py-1 rounded-full border border-[#BFDBFE]">
                🎓 {activeSchedule.grade}
              </span>
              <span className="bg-[#EEF2FF] text-[#4338CA] text-xs font-black px-3 py-1 rounded-full border border-[#C7D2FE]">
                📚 विषय: {activeSchedule.subject}
              </span>
            </div>

            <div className="flex items-center gap-2">
              {scheduleStatus === "live" ? (
                <div className="flex items-center gap-2 bg-[#EFF6FF] border border-[#BFDBFE] px-3.5 py-1.5 rounded-xl">
                  <span className="relative flex h-2.5 w-2.5">
                    <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-red-400 opacity-75"></span>
                    <span className="relative inline-flex rounded-full h-2.5 w-2.5 bg-red-600"></span>
                  </span>
                  <span className="text-xs font-black text-[#1E40AF]">
                    🔴 कक्षा लाइव है • शेष समय:
                  </span>
                  <span className="text-xs font-mono font-black text-[#0F172A] bg-white px-2 py-0.5 rounded-md border border-[#DBEAFE]">
                    ⏱️ {studentCountdown}
                  </span>
                </div>
              ) : scheduleStatus === "upcoming" ? (
                <div className="flex items-center gap-2 bg-[#FEF3C7] border border-[#FDE68A] px-3.5 py-1.5 rounded-xl">
                  <span className="text-xs font-black text-[#92400E]">
                    ⏳ आगामी कक्षा • शुरू होने में शेष:
                  </span>
                  <span className="text-xs font-mono font-black text-[#92400E] bg-white px-2 py-0.5 rounded-md border border-[#FDE68A]">
                    🕒 {studentCountdown}
                  </span>
                </div>
              ) : (
                <div className="flex items-center gap-2 bg-[#F1F5F9] border border-[#CBD5E1] px-3.5 py-1.5 rounded-xl">
                  <span className="text-xs font-black text-[#475569]">
                    🔒 कक्षा का समय समाप्त — सत्र स्वतः बंद है
                  </span>
                </div>
              )}
            </div>
          </div>

          <div className="flex items-center justify-between">
            <div className="space-y-0.5">
              <div className="text-[11px] font-bold text-slate-500">आज का विषय / टॉपिक:</div>
              <h3 className="text-base sm:text-lg font-black text-[#0F172A] flex items-center gap-2">
                <span>📖</span>
                <span>{activeSchedule.topic}</span>
              </h3>
            </div>
          </div>
        </div>
      )}

      {/* Auto-Close Notice for Student when Time Expires */}
      {isClassLocked && (
        <div className="bg-[#FEF2F2] border border-[#FECACA] p-4 rounded-xl flex items-center gap-3 shadow-2xs">
          <span className="text-2xl">🔒</span>
          <div>
            <h4 className="text-sm font-black text-[#991B1B]">
              कक्षा का निर्धारित समय समाप्त हो चुका है — यह लाइव सत्र स्वतः बंद हो गया है।
            </h4>
            <p className="text-xs text-[#7F1D1D] font-medium mt-0.5">
              समय सीमा पूरी होने के कारण अब आप नए संदेश या आवाज़ नहीं भेज सकते। शिक्षक के अगले सत्र की प्रतीक्षा करें।
            </p>
          </div>
        </div>
      )}

      {/* Audio & Language Toolbar */}
      <div className="bg-white p-4 rounded-[16px] border border-[#C7D2FE] shadow-2xs flex flex-wrap items-center justify-between gap-3">
        <div className="flex items-center gap-2">
          <span className="text-xs font-black text-slate-700">⚡ तीव्र अनुवाद गति (150ms से कम)</span>
        </div>

        <div className="flex items-center gap-2">
          {/* Auto-Speak Toggle Button */}
          <button
            onClick={() => setAutoSpeak(!autoSpeak)}
            className={`px-3.5 py-2 rounded-xl font-bold text-xs border border-[#C7D2FE] shadow-2xs transition flex items-center gap-1.5 bg-white ${
              autoSpeak
                ? "text-blue-800 ring-2 ring-blue-300"
                : "text-slate-500"
            }`}
          >
            <span>{autoSpeak ? "🔊" : "🔇"}</span>
            <span>{autoSpeak ? "स्वतः आवाज: चालू" : "स्वतः आवाज: बंद"}</span>
          </button>

          {/* Language Selection */}
          <div className="flex items-center gap-1.5 bg-white p-1 rounded-xl border border-[#C7D2FE] shadow-2xs">
            {(["san", "ho", "mun"] as const).map((lang) => (
              <button
                key={lang}
                onClick={() => {
                  setSelectedLang(lang);
                  localStorage.setItem("preferredLang", lang);
                }}
                className={`px-3 py-1.5 rounded-lg text-xs font-bold transition ${
                  selectedLang === lang
                    ? "bg-blue-600 text-white shadow-sm"
                    : "text-slate-600 hover:text-slate-900"
                }`}
              >
                {lang === "san" ? "संथाली (ᱥᱟᱱᱛᱟᱲᱤ)" : lang === "ho" ? "हो (ᱦᱳ)" : "मुंडारी (ᱢᱩᱱᱰᱟᱨᱤ)"}
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* 2. Main Live Class Area */}
      <div className={isTeacher ? "space-y-4" : "grid grid-cols-1 lg:grid-cols-3 gap-6"}>
        {/* Left: Real-Time Live Message Stream in Student's Language */}
        <div className={isTeacher ? "w-full space-y-4" : "lg:col-span-2 space-y-4"}>
          <div className="bg-[#EEF2FF] p-6 rounded-[16px] border border-[#C7D2FE] shadow-2xs space-y-4">
            <div className="flex items-center justify-between border-b border-[#C7D2FE] pb-3">
              <div className="flex items-center gap-2">
                <span className="text-sm font-extrabold text-slate-900 uppercase tracking-wider">
                  {t.feedTitle}
                </span>
                <span className="w-2 h-2 rounded-full bg-blue-600 animate-ping"></span>
              </div>
              <span className="text-[11px] font-bold text-blue-900/70 bg-white px-2.5 py-1 rounded-lg border border-[#C7D2FE] shadow-2xs flex items-center gap-1">
                {t.audioActive}
              </span>
            </div>

            {/* Messages Scroll Area */}
            <div className="space-y-4 max-h-[460px] overflow-y-auto pr-2">
              {messages.length === 0 ? (
                <div className="py-12 text-center text-slate-500 text-xs font-semibold bg-white rounded-xl border border-[#C7D2FE] p-6">
                  {isClassLocked || scheduleStatus === "ended" ? (
                    <div className="space-y-1.5 max-w-md mx-auto text-center">
                      <div className="text-sm font-black text-slate-800 flex items-center justify-center gap-1.5">
                        <span>🔒</span>
                        <span>कक्षा समाप्त / बंद हो चुकी है</span>
                      </div>
                      <p className="text-xs text-slate-500">
                        इस सत्र के सभी संवाद और संदेश साफ़ कर दिए गए हैं।
                      </p>
                    </div>
                  ) : (
                    t.waitingClass
                  )}
                </div>
              ) : (
                messages.map((item) => (
                  <div
                    key={item.id}
                    className={`p-4 sm:p-5 rounded-[12px] border border-[#C7D2FE] bg-white shadow-2xs transition-all ${
                      item.senderRole === "teacher"
                        ? "mr-4 border-l-4 border-l-blue-600"
                        : "ml-4 border-l-4 border-l-sky-500"
                    }`}
                  >
                    <div className="flex items-center justify-between mb-2">
                      <div className="flex items-center gap-2">
                        <span
                          className={`text-xs font-black px-2.5 py-0.5 rounded-full ${
                            item.senderRole === "teacher"
                              ? "bg-blue-600 text-white"
                              : "bg-blue-700 text-white"
                          }`}
                        >
                          {item.senderRole === "teacher" ? `👨‍🏫 ${item.senderName}` : `🎒 ${item.senderName}`}
                        </span>
                        {item.senderRole === "teacher" && (
                          <span className="text-[10px] bg-[#EEF2FF] text-blue-800 border border-[#C7D2FE] font-bold px-2 py-0.5 rounded-md">
                            {t.translatedTag}
                          </span>
                        )}
                      </div>
                      <div className="flex items-center gap-2 text-[10px] text-slate-500 font-bold">
                        <span>{item.timestamp}</span>
                        <button
                          onClick={() => speakTribal(item, item.id)}
                          className={`px-3 py-1 rounded-xl border text-xs font-bold transition flex items-center gap-1.5 shadow-2xs ${
                            playingAudioId === item.id
                              ? "bg-blue-600 text-white border-blue-700 animate-pulse ring-2 ring-blue-300"
                              : "bg-[#EEF2FF] hover:bg-slate-100 text-slate-700 border-[#C7D2FE]"
                          }`}
                        >
                          <span>🔊</span>
                          <span>
                            {playingAudioId === item.id
                              ? "बोल रहे हैं..."
                              : "सुनें"}
                          </span>
                        </button>
                      </div>
                    </div>

                    <div className="space-y-1">
                      {/* 1. Devanagari script first */}
                      {item.studentViewDevanagari && (
                        <p className="text-base sm:text-lg font-black text-slate-900 leading-relaxed">
                          {item.studentViewDevanagari}
                        </p>
                      )}
                      {/* 2. Ol Chiki native script in parenthesis/subtitle */}
                      {item.studentViewText && item.studentViewText !== item.studentViewDevanagari && (
                        <p className="text-sm font-bold text-blue-700">
                          ({item.studentViewText})
                        </p>
                      )}
                      {/* 3. Phonetic pronunciation guide */}
                      {item.studentViewPhonetic && (
                        <p className="text-xs text-slate-500 font-semibold">
                          {t.pronunciation} {item.studentViewPhonetic}
                        </p>
                      )}
                    </div>
                  </div>
                ))
              )}
            </div>

            {/* Student Speech Recognition & Input Box */}
            <div className="pt-4 border-t border-[#C7D2FE] space-y-3">
              {/* Active Student Voice Recording Live Banner */}
              {isRecording && (
                <div className="bg-red-50 border-2 border-red-400 p-4 rounded-2xl animate-pulse space-y-2">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <span className="w-3 h-3 rounded-full bg-red-600 animate-ping"></span>
                      <span className="text-xs font-black text-red-700 uppercase tracking-wider">
                        {t.recordingBanner}
                      </span>
                    </div>
                    <button
                      onClick={stopStudentSpeechRecognition}
                      className="bg-red-600 hover:bg-red-700 text-white text-[11px] font-extrabold px-3 py-1 rounded-lg shadow-xs"
                    >
                      {t.stopRecording}
                    </button>
                  </div>
                  {speechTranscript ? (
                    <div className="bg-white p-2.5 rounded-xl border border-red-200 text-sm font-black text-blue-800">
                      "{speechTranscript}"
                    </div>
                  ) : (
                    <p className="text-xs text-red-600 font-bold italic">
                      {t.micPrompt}
                    </p>
                  )}
                </div>
              )}

              {/* Status or permission feedback */}
              {micStatusMsg && !isRecording && (
                <div className="text-[11px] font-bold text-blue-800 bg-white px-3 py-1.5 rounded-xl border border-[#C7D2FE] shadow-2xs flex items-center justify-between">
                  <span>{micStatusMsg}</span>
                  <button onClick={() => setMicStatusMsg("")} className="text-blue-500 hover:text-blue-800 font-bold ml-2">×</button>
                </div>
              )}

              <div className="flex items-center gap-2">
                {/* 1. Large Warm Coral Amber Microphone Button */}
                <button
                  type="button"
                  onClick={handleToggleStudentMic}
                  disabled={isClassLocked}
                  className={`p-3.5 rounded-xl font-black text-xs sm:text-sm flex items-center gap-2 transition-all shadow-md shrink-0 active:scale-95 disabled:opacity-50 disabled:cursor-not-allowed ${
                    isClassLocked
                      ? "bg-slate-300 text-slate-500"
                      : isRecording
                      ? "bg-[#D97706] hover:bg-[#b45309] text-white shadow-amber-600/40 animate-pulse ring-4 ring-amber-300/40"
                      : "bg-[#D97706] hover:bg-[#b45309] text-white shadow-amber-600/30"
                  }`}
                  title={isClassLocked ? "कक्षा का समय समाप्त हो चुका है" : isRecording ? "बोलना रोकें" : "बोलें"}
                >
                  <span className="text-base">{isClassLocked ? "🔒" : isRecording ? "🔴" : "🎙️"}</span>
                  <span className="hidden sm:inline font-black">
                    {isClassLocked ? "माइक बंद है" : isRecording ? "सुन रहे हैं..." : "बोलें"}
                  </span>
                </button>

                {/* 2. Input Box */}
                <input
                  type="text"
                  value={inputText}
                  disabled={isClassLocked}
                  onChange={(e) => setInputText(e.target.value)}
                  onKeyDown={(e) => e.key === "Enter" && !isClassLocked && handleSendMessage(inputText)}
                  placeholder={
                    isClassLocked
                      ? "🔒 कक्षा का समय समाप्त हो चुका है — सत्र बंद है"
                      : t.placeholder
                  }
                  className={`flex-1 border p-3.5 rounded-xl text-xs sm:text-sm font-semibold transition shadow-2xs ${
                    isClassLocked
                      ? "bg-slate-100 border-slate-300 text-slate-400 cursor-not-allowed"
                      : "border-[#C7D2FE] bg-white text-slate-900 focus:outline-none focus:border-[#1E56A0] focus:ring-2 focus:ring-blue-100"
                  }`}
                />

                {/* 3. Send Button */}
                <button
                  onClick={() => handleSendMessage(inputText)}
                  disabled={loading || !inputText.trim() || isClassLocked}
                  className="bg-[#1E56A0] hover:bg-[#164580] text-white px-6 py-3.5 rounded-xl text-xs sm:text-sm font-black shadow-md shadow-[#1E56A0]/25 transition active:scale-95 disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-1.5 shrink-0"
                >
                  <span>{loading ? t.sendingBtn : t.sendBtn}</span>
                  <span>➔</span>
                </button>
              </div>
            </div>
          </div>
        </div>

        {/* Right 1 Col: Quick Student Responses in Mother Tongue - Hidden for teachers */}
        {!isTeacher && (
          <div className="space-y-4">
            <div className="bg-[#EEF2FF] p-6 rounded-[16px] border border-[#C7D2FE] shadow-2xs space-y-4">
              <div className="flex items-center justify-between">
                <h3 className="text-xs font-extrabold text-blue-900/70 uppercase tracking-wider">
                  {t.quickHeading}
                </h3>
                {isClassLocked && (
                  <span className="text-[10px] font-bold text-slate-400">🔒 लॉक</span>
                )}
              </div>

              <div className="space-y-2.5">
                {t.quickPhrases.map((phrase, idx) => (
                  <button
                    key={idx}
                    disabled={isClassLocked}
                    onClick={() => handleSendMessage(phrase.tribal)}
                    className={`w-full text-left p-3.5 rounded-xl transition active:scale-95 group space-y-1 shadow-2xs ${
                      isClassLocked
                        ? "bg-slate-100 border border-slate-200 opacity-60 cursor-not-allowed"
                        : "bg-white hover:bg-blue-50 border border-[#C7D2FE] hover:border-blue-400"
                    }`}
                  >
                    <div className={`font-extrabold text-xs ${isClassLocked ? "text-slate-400" : "text-slate-900 group-hover:text-blue-700"}`}>
                      {phrase.label}
                    </div>
                    <div className="text-xs font-black text-blue-700">{phrase.devanagari} ({phrase.tribal})</div>
                    <div className="text-[10px] text-slate-500">🗣️ {phrase.phonetic}</div>
                  </button>
                ))}
              </div>

              <div className="p-4 bg-white rounded-xl border border-[#C7D2FE] shadow-2xs text-xs text-blue-900 space-y-1">
                <p className="font-bold">{t.bridgeInfoTitle}</p>
                <p className="text-[11px] leading-relaxed text-slate-700">
                  {t.bridgeInfoDesc}
                </p>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}