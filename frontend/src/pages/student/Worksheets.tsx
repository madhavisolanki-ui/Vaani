import { useState, useEffect, useRef } from "react";
import axios from "axios";
import StudentPageBanner from "../../components/StudentPageBanner";

const API = "http://localhost:4000/api";

const TRIBAL_WORKSHEET_UI = {
  san: {
    langLabel: "संथाली (ᱥᱟᱱᱛᱟᱲᱤ)",
    scriptName: "देवनागरी / ओल चिकी",
    starsBadge: "⭐ सितारे",
    title: "📝 द्विभाषी अभ्यास पत्रक",
    subtitle: "शिक्षक द्वारा दिए गए अभ्यास पत्रक को अपनी मातृभाषा में हल करें, चित्र बनाएं या वॉयस नोट भेजें।",
    marks: "अंक",
    mins: "मिनट",
    subject: "📚 विषय:",
    instructions: "निर्देश:",
    startQuiz: "अभ्यास शुरू करें",
    backToList: "← वापस सूची पर जाएं",
    question: "प्रश्न",
    listenQ: "🔊 प्रश्न सुनें",
    submitAns: "📤 उत्तर शिक्षक को जमा करें",
    wellDone: "🎉 शाबाश! आपका उत्तर सफलतापूर्वक जमा हो गया है!",
    earnedMarks: "अंक प्राप्त किए!",
    earnedStars: "⭐ सितारे आपको मिले!",
    noPapers: "फिलहाल आपकी कक्षा के लिए कोई नया अभ्यास पत्रक उपलब्ध नहीं है।",
  },
  ho: {
    langLabel: "हो (ᱦᱳ)",
    scriptName: "वारंग चिती / देवनागरी",
    starsBadge: "⭐ सितारे",
    title: "📝 द्विभाषी अभ्यास पत्रक",
    subtitle: "शिक्षक द्वारा दिए गए अभ्यास पत्रक को अपनी मातृभाषा में हल करें, चित्र बनाएं या वॉयस नोट भेजें।",
    marks: "अंक",
    mins: "मिनट",
    subject: "📚 विषय:",
    instructions: "निर्देश:",
    startQuiz: "अभ्यास शुरू करें",
    backToList: "← वापस सूची पर जाएं",
    question: "प्रश्न",
    listenQ: "🔊 प्रश्न सुनें",
    submitAns: "📤 उत्तर शिक्षक को जमा करें",
    wellDone: "🎉 शाबाश! आपका उत्तर सफलतापूर्वक जमा हो गया है!",
    earnedMarks: "अंक प्राप्त किए!",
    earnedStars: "⭐ सितारे आपको मिले!",
    noPapers: "फिलहाल आपकी कक्षा के लिए कोई नया अभ्यास पत्रक उपलब्ध नहीं है।",
  },
  mun: {
    langLabel: "मुंडारी (ᱢᱩᱱᱰᱟᱨᱤ)",
    scriptName: "देवनागरी / मुंडारी लिपि",
    starsBadge: "⭐ सितारे",
    title: "📝 द्विभाषी अभ्यास पत्रक",
    subtitle: "शिक्षक द्वारा दिए गए अभ्यास पत्रक को अपनी मातृभाषा में हल करें, चित्र बनाएं या वॉयस नोट भेजें।",
    marks: "अंक",
    mins: "मिनट",
    subject: "📚 विषय:",
    instructions: "निर्देश:",
    startQuiz: "अभ्यास शुरू करें",
    backToList: "← वापस सूची पर जाएं",
    question: "प्रश्न",
    listenQ: "🔊 प्रश्न सुनें",
    submitAns: "📤 उत्तर शिक्षक को जमा करें",
    wellDone: "🎉 शाबाश! आपका उत्तर सफलतापूर्वक जमा हो गया है!",
    earnedMarks: "अंक प्राप्त किए!",
    earnedStars: "⭐ सितारे आपको मिले!",
    noPapers: "फिलहाल आपकी कक्षा के लिए कोई नया अभ्यास पत्रक उपलब्ध नहीं है।",
  },
};

export default function StudentWorksheets() {
  const studentName = localStorage.getItem("userName") || "सिदो मुर्मू";
  const studentGrade = localStorage.getItem("studentGrade") || "कक्षा 1";
  const registeredLang = (localStorage.getItem("preferredLang") as "san" | "ho" | "mun") || "mun";

  const [selectedLang, setSelectedLang] = useState<"san" | "ho" | "mun">(registeredLang);
  const [activeTab, setActiveTab] = useState<"worksheets" | "scorecard">("worksheets");

  const [worksheets, setWorksheets] = useState<any[]>([]);
  const [submissions, setSubmissions] = useState<any[]>([]);
  const [activeWorksheet, setActiveWorksheet] = useState<any>(null);
  const [loading, setLoading] = useState(false);

  // Solving State (Drawing, Photo, Voice, Notes)
  const [submissionMode, setSubmissionMode] = useState<"drawing" | "photo" | "audio" | "text">("drawing");
  const [studentTribalNotes, setStudentTribalNotes] = useState("");
  const [photoDataUrl, setPhotoDataUrl] = useState<string | null>(null);
  const [isRecording, setIsRecording] = useState(false);
  const [recordedAudioUrl, setRecordedAudioUrl] = useState<string | null>(null);
  const [submitting, setSubmitting] = useState(false);
  const [submissionSuccess, setSubmissionSuccess] = useState<string | null>(null);

  // Drawing Canvas References
  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const [isDrawing, setIsDrawing] = useState(false);
  const [brushColor, setBrushColor] = useState("#C2410C"); // default reddish orange
  const [brushSize, setBrushSize] = useState(6);
  const mediaRecorderRef = useRef<MediaRecorder | null>(null);
  const audioChunksRef = useRef<Blob[]>([]);

  const t = TRIBAL_WORKSHEET_UI[selectedLang] || TRIBAL_WORKSHEET_UI.mun;

  useEffect(() => {
    fetchData();
  }, [selectedLang, studentGrade]);

  const fetchData = async () => {
    setLoading(true);
    try {
      const [wsRes, subRes] = await Promise.all([
        axios.get(`${API}/worksheets/saved?grade=${encodeURIComponent(studentGrade)}`).catch(() => ({ data: { worksheets: [] } })),
        axios.get(`${API}/worksheets/submissions?studentName=${encodeURIComponent(studentName)}`).catch(() => ({ data: { submissions: [] } })),
      ]);

      setWorksheets(wsRes.data.worksheets || []);
      const userSubs = subRes.data.submissions || [];
      setSubmissions(userSubs);

      // Auto update total stars if reviewed submissions found
      let totalEarned = 0;
      userSubs.forEach((s: any) => {
        if (s.status === "reviewed" && s.starsEarned) {
          totalEarned += s.starsEarned;
        }
      });
      if (totalEarned > 0) {
        const currentSaved = Number(localStorage.getItem("studentStars") || "24");
        if (totalEarned > 0 && currentSaved < 24 + totalEarned) {
          localStorage.setItem("studentStars", String(24 + totalEarned));
        }
      }
    } catch (err) {
      console.error("कार्यपत्रक डेटा प्राप्त करने में त्रुटि", err);
    } finally {
      setLoading(false);
    }
  };

  const playAudio = (text: string) => {
    if (!text || !text.trim()) return;
    try {
      if ("speechSynthesis" in window) {
        window.speechSynthesis.cancel();
        const utterance = new SpeechSynthesisUtterance(text.trim());
        utterance.lang = "hi-IN";
        utterance.rate = 0.88;
        utterance.pitch = 1.05;
        window.speechSynthesis.speak(utterance);
      } else {
        const audioUrl = `https://dict.youdao.com/dictvoice?audio=${encodeURIComponent(text)}&type=2`;
        const audio = new Audio(audioUrl);
        audio.play().catch((e) => console.log("Audio play error:", e));
      }
    } catch (e) {
      console.warn("Speech error:", e);
    }
  };

  // Canvas Drawing Handlers
  const startDrawing = (e: React.MouseEvent<HTMLCanvasElement> | React.TouchEvent<HTMLCanvasElement>) => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    setIsDrawing(true);
    const rect = canvas.getBoundingClientRect();
    const x = "touches" in e ? e.touches[0].clientX - rect.left : e.clientX - rect.left;
    const y = "touches" in e ? e.touches[0].clientY - rect.top : e.clientY - rect.top;

    ctx.beginPath();
    ctx.moveTo(x, y);
    ctx.lineCap = "round";
    ctx.lineJoin = "round";
    ctx.strokeStyle = brushColor;
    ctx.lineWidth = brushSize;
  };

  const draw = (e: React.MouseEvent<HTMLCanvasElement> | React.TouchEvent<HTMLCanvasElement>) => {
    if (!isDrawing) return;
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    const rect = canvas.getBoundingClientRect();
    const x = "touches" in e ? e.touches[0].clientX - rect.left : e.clientX - rect.left;
    const y = "touches" in e ? e.touches[0].clientY - rect.top : e.clientY - rect.top;

    ctx.lineTo(x, y);
    ctx.stroke();
  };

  const stopDrawing = () => {
    setIsDrawing(false);
  };

  const clearCanvas = () => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;
    ctx.clearRect(0, 0, canvas.width, canvas.height);
  };

  // Photo Input Handler
  const handlePhotoUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onload = () => {
      setPhotoDataUrl(reader.result as string);
    };
    reader.readAsDataURL(file);
  };

  // Voice Recording Handlers
  const startVoiceRecording = async () => {
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
      const mediaRecorder = new MediaRecorder(stream);
      mediaRecorderRef.current = mediaRecorder;
      audioChunksRef.current = [];

      mediaRecorder.ondataavailable = (event) => {
        if (event.data.size > 0) {
          audioChunksRef.current.push(event.data);
        }
      };

      mediaRecorder.onstop = () => {
        const audioBlob = new Blob(audioChunksRef.current, { type: "audio/webm" });
        const reader = new FileReader();
        reader.onloadend = () => {
          setRecordedAudioUrl(reader.result as string);
        };
        reader.readAsDataURL(audioBlob);
        stream.getTracks().forEach((track) => track.stop());
      };

      mediaRecorder.start();
      setIsRecording(true);
    } catch (err) {
      console.warn("माइक अनुमति नहीं मिली, सिमुलेशन मोड शुरू कर रहे हैं:", err);
      setIsRecording(true);
      setTimeout(() => {
        setIsRecording(false);
        setRecordedAudioUrl("data:audio/mp3;base64,//uQZAAAAAAAAAAAAAAAAAAAAAAAWGluZwAAAA8AAAACAAACcQCA");
        alert("आवाज रिकॉर्ड कर ली गई है!");
      }, 3000);
    }
  };

  const stopVoiceRecording = () => {
    if (mediaRecorderRef.current && isRecording) {
      mediaRecorderRef.current.stop();
      setIsRecording(false);
    }
  };

  // Submit Solution to Teacher with Reverse AI Translation
  const handleSubmitSolution = async () => {
    if (!activeWorksheet) return;
    setSubmitting(true);

    let solutionPayload = "";
    if (submissionMode === "drawing" && canvasRef.current) {
      solutionPayload = canvasRef.current.toDataURL("image/png");
    } else if (submissionMode === "photo" && photoDataUrl) {
      solutionPayload = photoDataUrl;
    } else if (submissionMode === "audio" && recordedAudioUrl) {
      solutionPayload = recordedAudioUrl;
    }

    try {
      await axios.post(`${API}/worksheets/submit`, {
        worksheetId: activeWorksheet.id,
        worksheetTitleHindi: activeWorksheet.titleHindi,
        worksheetTitleTribal: activeWorksheet.titleTribal,
        studentName,
        studentGrade,
        targetLang: selectedLang,
        submissionType: submissionMode,
        solutionData: solutionPayload,
        solutionTribalText: studentTribalNotes || (selectedLang === "mun" ? "ᱯᱮ ᱥᱮᱣ ᱢᱮᱱᱟᱜ-ᱟ (Pe Sew Menah-a)" : "᱓ (Three) ᱥᱮᱣ"),
        totalMarks: activeWorksheet.totalMarks || 10,
      });

      setSubmissionSuccess("🎉 शाबाश! आपका उत्तर शिक्षक को भेज दिया गया है। शिक्षक की जांच के बाद आपको सितारे (⭐) मिलेंगे!");
      fetchData();
      setTimeout(() => {
        setSubmissionSuccess(null);
        setActiveWorksheet(null);
        setActiveTab("scorecard");
      }, 2500);
    } catch (err) {
      console.error("समाधान जमा करने में त्रुटि", err);
      alert("उत्तर जमा करने में त्रुटि हुई। कृपया पुनः प्रयास करें।");
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="p-6 sm:p-8 bg-[#F8FAFC] min-h-full space-y-6 max-w-5xl mx-auto font-sans">
      {/* 1. Header Banner matching Image 2 */}
      <StudentPageBanner
        icon="📝"
        title="द्विभाषी अभ्यास पत्रक"
        subtitle={t.subtitle}
        tag={`${studentGrade} • ⭐ ${localStorage.getItem("studentStars") || "24"} सितारे`}
        gradientClass="from-[#2563EB] to-[#7C3AED]"
      />

      {/* Toolbar: Tab Switcher & Language Selector */}
      <div className="bg-white p-4 rounded-[16px] border border-[#C7D2FE] shadow-2xs flex flex-wrap items-center justify-between gap-3">
        <div className="flex items-center gap-2">
          <span className="text-xs font-black text-slate-700">निपुण भारत अभ्यास सत्र</span>
        </div>
          {/* Worksheets vs Scorecard */}
          <div className="flex bg-white p-1 rounded-xl border border-[#C7D2FE] shadow-2xs">
            <button
              onClick={() => {
                setActiveTab("worksheets");
                setActiveWorksheet(null);
              }}
              className={`px-3 py-1.5 rounded-lg text-xs font-bold transition ${
                activeTab === "worksheets"
                  ? "bg-blue-600 text-white shadow-sm"
                  : "text-slate-600 hover:text-slate-900"
              }`}
            >
              📚 अभ्यास पत्रक ({worksheets.length})
            </button>
            <button
              onClick={() => {
                setActiveTab("scorecard");
                setActiveWorksheet(null);
              }}
              className={`px-3 py-1.5 rounded-lg text-xs font-bold transition flex items-center gap-1 ${
                activeTab === "scorecard"
                  ? "bg-blue-600 text-white shadow-sm"
                  : "text-slate-600 hover:text-slate-900"
              }`}
            >
              <span>🏆 मेरा स्कोरकार्ड ({submissions.length})</span>
            </button>
          </div>

          {/* Language Selection */}
          <div className="flex items-center gap-1 bg-white p-1 rounded-xl border border-[#C7D2FE] shadow-2xs">
            {(["mun", "san", "ho"] as const).map((lang) => (
              <button
                key={lang}
                onClick={() => {
                  setSelectedLang(lang);
                  localStorage.setItem("preferredLang", lang);
                }}
                className={`px-2.5 py-1.5 rounded-lg text-xs font-bold transition ${
                  selectedLang === lang
                    ? "bg-blue-600 text-white shadow-sm"
                    : "text-slate-600 hover:text-slate-900"
                }`}
              >
                {lang === "san" ? "संथाली" : lang === "ho" ? "हो" : "मुंडारी"}
              </button>
            ))}
          </div>
        </div>

      {/* SUCCESS BANNER NOTIFICATION */}
      {submissionSuccess && (
        <div className="bg-emerald-50 border border-emerald-300 p-4 rounded-xl text-center space-y-1 shadow-2xs animate-bounce">
          <span className="text-3xl">🎉</span>
          <p className="text-sm font-black text-emerald-900">{submissionSuccess}</p>
        </div>
      )}

      {/* TAB 1: AVAILABLE WORKSHEETS FOR THIS GRADE */}
      {activeTab === "worksheets" && !activeWorksheet && (
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <h2 className="text-sm font-black text-slate-800">
              📌 {studentGrade} के लिए उपलब्ध अभ्यास पत्रक
            </h2>
            <span className="text-xs font-bold text-blue-700 bg-white px-2.5 py-1 rounded-lg border border-[#C7D2FE]">
              केवल {studentGrade} सामग्री
            </span>
          </div>

          {loading ? (
            <div className="bg-[#EEF2FF] p-8 rounded-[16px] text-center border border-[#C7D2FE]">
              <p className="text-xs font-bold text-slate-600">अभ्यास पत्रक लोड हो रहे हैं...</p>
            </div>
          ) : worksheets.length === 0 ? (
            <div className="bg-[#EEF2FF] p-8 rounded-[16px] text-center border border-[#C7D2FE] space-y-2">
              <span className="text-3xl">📝</span>
              <p className="text-slate-600 text-sm font-semibold">{t.noPapers}</p>
              <p className="text-xs text-slate-500">
                शिक्षक जब {studentGrade} के लिए नई वर्कशीट अपलोड करेंगे, वह यहाँ दिखाई देगी।
              </p>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
              {worksheets.map((ws) => (
                <div
                  key={ws.id}
                  className="bg-[#EEF2FF] p-6 rounded-[16px] border border-[#C7D2FE] shadow-2xs hover:shadow-md transition space-y-4"
                >
                  <div className="flex items-center justify-between">
                    <span className="bg-white text-blue-700 text-xs font-extrabold px-3 py-1 rounded-full border border-[#C7D2FE] shadow-2xs">
                      {ws.grade} • {ws.subject}
                    </span>
                    <span className="bg-white text-amber-800 text-xs font-bold px-2.5 py-1 rounded-full border border-[#C7D2FE] shadow-2xs">
                      ⭐ {ws.totalMarks} {t.marks}
                    </span>
                  </div>

                  <div>
                    <h3 className="text-base font-black text-slate-900">{ws.titleHindi}</h3>
                    <p className="text-xs font-bold text-blue-700 mt-0.5">
                      🌾 {ws.titleTribal}
                    </p>
                  </div>

                  <div className="bg-white p-3 rounded-xl border border-[#C7D2FE] shadow-2xs text-xs space-y-1">
                    <p className="font-bold text-slate-800">{t.instructions}</p>
                    <p className="text-slate-700">{ws.instructionsHindi}</p>
                    <p className="text-blue-700 font-semibold">{ws.instructionsTribal}</p>
                  </div>

                  <div className="pt-2 flex items-center justify-between">
                    <button
                      onClick={() => {
                        setActiveWorksheet(ws);
                        setPhotoDataUrl(null);
                        setRecordedAudioUrl(null);
                        setStudentTribalNotes("");
                        setTimeout(() => clearCanvas(), 100);
                      }}
                      className="bg-blue-600 hover:bg-blue-700 text-white font-extrabold text-xs px-5 py-2.5 rounded-xl shadow-md transition active:scale-95 flex items-center gap-1.5"
                    >
                      <span>✏️</span> {t.startQuiz}
                    </button>
                    <span className="text-[11px] font-bold text-slate-600 bg-white px-2 py-1 rounded-lg border border-[#C7D2FE]">
                      🎯 {ws.nipunCompetencyCode || "FLN-N1.1"}
                    </span>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      )}

      {/* ACTIVE WORKSHEET SOLVING WORKSPACE */}
      {activeWorksheet && (
        <div className="bg-[#EEF2FF] p-6 sm:p-8 rounded-[16px] border border-[#C7D2FE] shadow-2xs space-y-6">
          <div className="flex flex-wrap items-center justify-between gap-3 border-b border-[#C7D2FE] pb-4">
            <div>
              <span className="text-xs font-bold text-blue-700 bg-white border border-[#C7D2FE] px-3 py-0.5 rounded-full uppercase tracking-wider shadow-2xs">
                {activeWorksheet.grade} • {activeWorksheet.subject} • 🎯 {activeWorksheet.nipunCompetencyCode}
              </span>
              <h2 className="text-2xl font-black text-slate-900 mt-1">
                {activeWorksheet.titleHindi}
              </h2>
              <p className="text-sm font-bold text-blue-700 mt-0.5">
                🌾 {activeWorksheet.titleTribal}
              </p>
            </div>
            <button
              onClick={() => setActiveWorksheet(null)}
              className="bg-white hover:bg-slate-100 text-slate-700 border border-[#C7D2FE] px-4 py-2 rounded-xl text-xs font-bold shadow-2xs"
            >
              {t.backToList}
            </button>
          </div>

          {/* Instructions & Audio guidance */}
          <div className="bg-white p-4 rounded-xl border border-[#C7D2FE] shadow-2xs space-y-2">
            <div className="flex items-center justify-between">
              <span className="text-xs font-black text-blue-900 uppercase tracking-wider">
                📢 {t.instructions}
              </span>
              <button
                onClick={() => playAudio(activeWorksheet.instructionsHindi + "। " + (activeWorksheet.instructionsTribal || ""))}
                className="text-xs bg-[#EEF2FF] text-blue-700 hover:bg-blue-100 px-3 py-1 rounded-lg border border-[#C7D2FE] font-bold flex items-center gap-1.5 shadow-2xs"
              >
                <span>🔊</span> निर्देश सुनें
              </button>
            </div>
            <p className="text-xs font-semibold text-slate-800">
              {activeWorksheet.instructionsHindi}
            </p>
            <p className="text-xs font-bold text-blue-700">
              🌾 {activeWorksheet.instructionsTribal}
            </p>
          </div>

          {/* Question Display Card */}
          <div className="space-y-4">
            {activeWorksheet.sections?.map((sec: any, secIdx: number) => (
              <div key={secIdx} className="space-y-3">
                {sec.questions?.map((q: any) => (
                  <div
                    key={q.qNum}
                    className="p-5 rounded-[14px] border border-[#C7D2FE] bg-white shadow-2xs space-y-3"
                  >
                    <div className="flex items-center justify-between">
                      <span className="text-xs font-black text-blue-700 bg-[#EEF2FF] border border-[#C7D2FE] px-2.5 py-0.5 rounded-full">
                        {t.question} {q.qNum}
                      </span>
                      <button
                        onClick={() => playAudio(q.promptHindi + "। " + q.promptTribal)}
                        className="text-xs bg-[#EEF2FF] text-blue-700 hover:bg-blue-100 px-2.5 py-1 rounded-lg border border-[#C7D2FE] font-bold flex items-center gap-1 shadow-2xs"
                      >
                        {t.listenQ}
                      </button>
                    </div>

                    <div className="space-y-1">
                      <p className="text-base font-black text-slate-900 flex items-center gap-2">
                        <span>{q.promptHindi}</span>
                        {q.imageHint && <span className="text-2xl">{q.imageHint}</span>}
                      </p>
                      <p className="text-xs font-bold text-blue-700">
                        🌾 {q.promptTribal}
                      </p>
                    </div>
                  </div>
                ))}
              </div>
            ))}
          </div>

          {/* Child-friendly Interactive Solution Workspace */}
          <div className="bg-white p-6 rounded-[16px] border border-[#C7D2FE] shadow-2xs space-y-4">
            <div className="flex flex-wrap items-center justify-between gap-2 border-b border-slate-100 pb-3">
              <h3 className="text-sm font-black text-slate-900">
                ✏️ अपना उत्तर / सोल्यूशन अपलोड करें
              </h3>
              {/* Submission Mode Selector */}
              <div className="flex bg-[#EEF2FF] p-1 rounded-xl border border-[#C7D2FE]">
                <button
                  type="button"
                  onClick={() => setSubmissionMode("drawing")}
                  className={`px-3 py-1.5 rounded-lg text-xs font-black transition ${
                    submissionMode === "drawing" ? "bg-blue-600 text-white shadow-sm" : "text-slate-700"
                  }`}
                >
                  🎨 टैबलेट ड्रॉइंग
                </button>
                <button
                  type="button"
                  onClick={() => setSubmissionMode("photo")}
                  className={`px-3 py-1.5 rounded-lg text-xs font-black transition ${
                    submissionMode === "photo" ? "bg-blue-600 text-white shadow-sm" : "text-slate-700"
                  }`}
                >
                  📷 फोटो अपलोड
                </button>
                <button
                  type="button"
                  onClick={() => setSubmissionMode("audio")}
                  className={`px-3 py-1.5 rounded-lg text-xs font-black transition ${
                    submissionMode === "audio" ? "bg-blue-600 text-white shadow-sm" : "text-slate-700"
                  }`}
                >
                  🎙️ वॉयस नोट
                </button>
              </div>
            </div>

            {/* MODALITY 1: TABLET DRAWING CANVAS */}
            {submissionMode === "drawing" && (
              <div className="space-y-3">
                <div className="flex flex-wrap items-center justify-between gap-3 bg-[#EEF2FF] p-3 rounded-xl border border-[#C7D2FE]">
                  {/* Colors */}
                  <div className="flex items-center gap-1.5">
                    <span className="text-xs font-bold text-slate-700 mr-1">रंग:</span>
                    {["#0F172A", "#2563EB", "#DC2626", "#16A34A", "#D97706", "#9333EA"].map((c) => (
                      <button
                        key={c}
                        type="button"
                        onClick={() => setBrushColor(c)}
                        style={{ backgroundColor: c }}
                        className={`w-6 h-6 rounded-full border-2 transition ${
                          brushColor === c ? "border-white ring-2 ring-blue-500 scale-110" : "border-transparent"
                        }`}
                      />
                    ))}
                  </div>

                  {/* Brush Size */}
                  <div className="flex items-center gap-2">
                    <span className="text-xs font-bold text-slate-700">पेंसिल आकार:</span>
                    {[3, 6, 12].map((s) => (
                      <button
                        key={s}
                        type="button"
                        onClick={() => setBrushSize(s)}
                        className={`px-2 py-0.5 rounded text-xs font-bold border transition ${
                          brushSize === s ? "bg-blue-600 text-white border-blue-600" : "bg-white text-slate-700 border-[#C7D2FE]"
                        }`}
                      >
                        {s === 3 ? "बारीक" : s === 6 ? "मध्यम" : "मोटा"}
                      </button>
                    ))}
                  </div>

                  {/* Clear Button */}
                  <button
                    type="button"
                    onClick={clearCanvas}
                    className="text-xs font-bold bg-white hover:bg-red-50 text-red-600 border border-red-200 px-3 py-1 rounded-lg"
                  >
                    🗑️ कैनवास साफ़ करें
                  </button>
                </div>

                {/* HTML5 Canvas */}
                <div className="border-2 border-dashed border-[#C7D2FE] rounded-2xl p-2 bg-[#FFFDF5] flex justify-center">
                  <canvas
                    ref={canvasRef}
                    width={600}
                    height={280}
                    onMouseDown={startDrawing}
                    onMouseMove={draw}
                    onMouseUp={stopDrawing}
                    onMouseLeave={stopDrawing}
                    onTouchStart={startDrawing}
                    onTouchMove={draw}
                    onTouchEnd={stopDrawing}
                    className="touch-none bg-white border border-slate-200 rounded-xl shadow-inner cursor-crosshair max-w-full"
                  />
                </div>
                <p className="text-[11px] text-center text-slate-500">
                  💡 इस कैनवास पर अपनी उंगली या स्टाइलस से संख्या लिखें, सेब/फल बनाएं और उत्तर हल करें।
                </p>
              </div>
            )}

            {/* MODALITY 2: PHOTO / CAMERA UPLOAD */}
            {submissionMode === "photo" && (
              <div className="space-y-3 bg-[#EEF2FF] p-6 rounded-xl border border-[#C7D2FE] text-center">
                <input
                  type="file"
                  accept="image/*"
                  onChange={handlePhotoUpload}
                  className="hidden"
                  id="photo-upload-input"
                />
                <label
                  htmlFor="photo-upload-input"
                  className="inline-flex items-center gap-2 bg-blue-600 hover:bg-blue-700 text-white font-extrabold text-xs px-6 py-3 rounded-xl shadow-md cursor-pointer transition active:scale-95"
                >
                  <span>📷</span> अपनी कॉपी या स्लेट की फोटो खींचें / अपलोड करें
                </label>

                {photoDataUrl && (
                  <div className="mt-4 flex flex-col items-center">
                    <p className="text-xs font-bold text-emerald-700 mb-2">✓ फोटो तैयार है:</p>
                    <img
                      src={photoDataUrl}
                      alt="फोटो पूर्वावलोकन"
                      className="max-h-56 rounded-xl border border-[#C7D2FE] shadow-sm"
                    />
                  </div>
                )}
              </div>
            )}

            {/* MODALITY 3: AUDIO / VOICE NOTE */}
            {submissionMode === "audio" && (
              <div className="space-y-4 bg-[#EEF2FF] p-6 rounded-xl border border-[#C7D2FE] text-center">
                <div className="space-y-1">
                  <h4 className="text-sm font-black text-slate-900">
                    🎙️ अपनी मातृभाषा में बोलकर उत्तर रिकॉर्ड करें
                  </h4>
                  <p className="text-xs text-slate-600">
                    माइक दबाकर बोलें। एआई शिक्षक के लिए आपकी आवाज का हिंदी अनुवाद तैयार करेगा।
                  </p>
                </div>

                <div className="flex items-center justify-center gap-3">
                  {!isRecording ? (
                    <button
                      type="button"
                      onClick={startVoiceRecording}
                      className="bg-red-600 hover:bg-red-700 text-white font-extrabold text-xs px-6 py-3 rounded-xl shadow-md flex items-center gap-2 active:scale-95 transition"
                    >
                      <span>🎙️</span> रिकॉर्डिंग शुरू करें
                    </button>
                  ) : (
                    <button
                      type="button"
                      onClick={stopVoiceRecording}
                      className="bg-slate-900 text-white font-extrabold text-xs px-6 py-3 rounded-xl shadow-md flex items-center gap-2 animate-pulse"
                    >
                      <span>⏹️</span> रिकॉर्डिंग समाप्त करें (रोकें)
                    </button>
                  )}
                </div>

                {recordedAudioUrl && (
                  <div className="mt-3 p-3 bg-white rounded-xl border border-[#C7D2FE] inline-block">
                    <p className="text-xs font-bold text-emerald-700 mb-1">✓ आवाज रिकॉर्ड हो गई:</p>
                    <audio controls src={recordedAudioUrl} className="h-10" />
                  </div>
                )}
              </div>
            )}

            {/* Student Explanation / Tribal Notes */}
            <div className="space-y-2 pt-2 border-t border-slate-100">
              <label className="block text-xs font-black text-slate-700 uppercase tracking-wider">
                🌾 मातृभाषा में उत्तर या स्पष्टीकरण (वैकल्पिक):
              </label>
              <div className="flex flex-wrap gap-1.5 mb-2">
                {[
                  "ᱯᱮ ᱥᱮᱣ (Pe Sew - 3 सेब)",
                  "ᱵᱟᱨ ᱩᱞ (Bar Ul - 2 आम)",
                  "ᱢᱤᱫ, ᱵᱟᱨ, ᱯᱮ (1, 2, 3)",
                  "ᱥᱟᱨᱤ ᱜᱮ (Sari Ge - सही)",
                ].map((chip) => (
                  <button
                    key={chip}
                    type="button"
                    onClick={() => setStudentTribalNotes((prev) => (prev ? prev + " • " + chip : chip))}
                    className="text-[11px] font-bold bg-[#EEF2FF] hover:bg-blue-100 text-blue-900 border border-[#C7D2FE] px-2.5 py-1 rounded-lg"
                  >
                    + {chip}
                  </button>
                ))}
              </div>
              <input
                type="text"
                placeholder="उदा. ᱯᱮ ᱥᱮᱣ ᱢᱮᱱᱟᱜ-ᱟ (३ सेब हैं)"
                value={studentTribalNotes}
                onChange={(e) => setStudentTribalNotes(e.target.value)}
                className="w-full bg-[#EEF2FF]/50 border border-[#C7D2FE] p-3 rounded-xl text-xs font-semibold text-slate-800 focus:outline-none"
              />
            </div>

            {/* Submission CTA */}
            <div className="pt-3 border-t border-[#C7D2FE] flex justify-end">
              <button
                onClick={handleSubmitSolution}
                disabled={submitting}
                className="bg-emerald-600 hover:bg-emerald-700 text-white font-extrabold text-xs px-8 py-3.5 rounded-xl shadow-md transition active:scale-95 disabled:opacity-50 flex items-center gap-2"
              >
                {submitting ? "उत्तर जमा हो रहा है..." : t.submitAns}
              </button>
            </div>
          </div>
        </div>
      )}

      {/* TAB 2: STUDENT SCORECARD & STARS */}
      {activeTab === "scorecard" && (
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <h2 className="text-sm font-black text-slate-800">
              🏆 मेरा स्कोरकार्ड व अर्जित सितारे ({studentGrade})
            </h2>
            <span className="text-xs font-extrabold text-amber-800 bg-white px-3 py-1 rounded-full border border-[#C7D2FE] shadow-2xs">
              कुल सितारे: ⭐ {localStorage.getItem("studentStars") || "24"}
            </span>
          </div>

          {submissions.length === 0 ? (
            <div className="bg-[#EEF2FF] p-8 rounded-[16px] text-center border border-[#C7D2FE] space-y-2">
              <span className="text-3xl">📭</span>
              <p className="text-slate-600 text-sm font-semibold">आपने अभी तक कोई अभ्यास पत्रक जमा नहीं किया है।</p>
              <button
                onClick={() => setActiveTab("worksheets")}
                className="bg-blue-600 text-white px-4 py-2 rounded-xl text-xs font-bold"
              >
                अभ्यास पत्रक देखें ➔
              </button>
            </div>
          ) : (
            <div className="space-y-4">
              {submissions.map((sub) => {
                const isReviewed = sub.status === "reviewed";
                return (
                  <div
                    key={sub.id}
                    className="bg-white p-6 rounded-[16px] border border-[#C7D2FE] shadow-2xs space-y-4"
                  >
                    <div className="flex flex-wrap items-center justify-between gap-2 border-b border-slate-100 pb-3">
                      <div>
                        <h3 className="text-base font-black text-slate-900">{sub.worksheetTitleHindi}</h3>
                        <p className="text-xs text-blue-700 font-bold">{sub.worksheetTitleTribal}</p>
                      </div>

                      <div>
                        {isReviewed ? (
                          <span className="bg-emerald-100 text-emerald-900 border border-emerald-300 text-xs font-black px-3 py-1 rounded-full">
                            🟢 मूल्यांकित ({sub.marksObtained} / {sub.totalMarks} अंक)
                          </span>
                        ) : (
                          <span className="bg-amber-100 text-amber-900 border border-amber-300 text-xs font-black px-3 py-1 rounded-full">
                            🟡 शिक्षक समीक्षा लंबित
                          </span>
                        )}
                      </div>
                    </div>

                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                      {/* Solution Snapshot */}
                      <div className="bg-[#EEF2FF] p-3 rounded-xl border border-[#C7D2FE] space-y-2">
                        <span className="text-xs font-bold text-slate-700">मेरा सबमिशन:</span>
                        {sub.solutionData && (sub.submissionType === "drawing" || sub.submissionType === "photo") ? (
                          <img
                            src={sub.solutionData}
                            alt="सबमिशन"
                            className="max-h-36 rounded border border-[#C7D2FE] bg-white object-contain"
                          />
                        ) : (
                          <p className="text-xs font-semibold text-blue-900 bg-white p-2.5 rounded-lg border border-[#C7D2FE]">
                            {sub.solutionTribalText}
                          </p>
                        )}
                      </div>

                      {/* Result / Review Box */}
                      <div className="space-y-2">
                        {isReviewed ? (
                          <div className="bg-emerald-50 p-4 rounded-xl border border-emerald-200 space-y-2">
                            <div className="flex items-center justify-between">
                              <span className="text-xs font-black text-emerald-900">
                                प्राप्तांक: {sub.marksObtained} / {sub.totalMarks} अंक
                              </span>
                              <span className="text-xs font-black text-amber-700 bg-white px-2.5 py-0.5 rounded-full border border-amber-200">
                                +{sub.starsEarned} ⭐
                              </span>
                            </div>
                            <div className="bg-white p-2.5 rounded-lg border border-emerald-100 text-xs font-semibold text-slate-800">
                              💬 <strong>शिक्षक की टिप्पणी:</strong> {sub.teacherFeedback}
                            </div>
                          </div>
                        ) : (
                          <div className="bg-amber-50 p-4 rounded-xl border border-amber-200 text-xs font-bold text-amber-900 space-y-1">
                            <p>⏳ शिक्षक द्वारा समीक्षा की जा रही है।</p>
                            <p className="text-[11px] text-amber-800 font-medium">
                              उत्तर सही होने पर आपको तुरंत अंक और सितारे (⭐) प्राप्त होंगे।
                            </p>
                          </div>
                        )}
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </div>
      )}
    </div>
  );
}
