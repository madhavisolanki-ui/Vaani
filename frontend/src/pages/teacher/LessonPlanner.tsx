import { useState, useEffect } from "react";
import axios from "axios";
import { Link } from "react-router-dom";

const API = "http://localhost:4000/api";

type TabType = "समय-सारणी" | "नोट्स" | "प्रश्न-पत्र" | "लिपि";

export default function TeacherLessonPlanner() {
  const [activeTab, setActiveTab] = useState<TabType>("समय-सारणी");

  // Common Curriculum Topics & Langs
  const [topics, setTopics] = useState<any[]>([]);
  const [loading, setLoading] = useState(false);

  // 1. Live Class Scheduling State
  const [classes, setClasses] = useState<any[]>([]);
  const [showClassModal, setShowClassModal] = useState(false);
  const [showEditClassModal, setShowEditClassModal] = useState(false);
  const [editClassData, setEditClassData] = useState<any>(null);
  const [newClass, setNewClass] = useState({
    date: new Date().toISOString().split("T")[0],
    startTime: "सुबह 10:00 बजे",
    endTime: "सुबह 10:45 बजे",
    subject: "गणित",
    topic: "गिनती 1 से 10 और संख्या बोध",
    grade: "कक्षा 1",
    medium: "हिंदी",
    roomCode: "FLN-HIN-101",
  });

  // 2. Class Notes State (Pure Hindi / English Medium)
  const [notes, setNotes] = useState<any[]>([]);
  const [showNoteModal, setShowNoteModal] = useState(false);
  const [newNote, setNewNote] = useState({
    classId: "",
    date: new Date().toISOString().split("T")[0],
    title: "",
    subject: "गणित",
    topic: "गिनती 1 से 10",
    grade: "कक्षा 1",
    medium: "हिंदी",
    teacherSummary: "",
    keyPoint1: "",
    keyPoint2: "",
    vocabTerm1: "संख्या बोध",
    vocabMeaning1: "संख्याओं की मात्रा और मान को समझना",
    vocabTerm2: "गणना",
    vocabMeaning2: "वस्तुओं को क्रम से एक-एक करके गिनना",
    studentTask: "",
  });
  const [selectedNoteView, setSelectedNoteView] = useState<any>(null);

  // 3. Practice Papers / Worksheets State
  const [practicePapers, setPracticePapers] = useState<any[]>([]);
  const [showPaperModal, setShowPaperModal] = useState(false);
  const [newPaper, setNewPaper] = useState({
    title: "",
    grade: "कक्षा 1",
    subject: "गणित",
    topic: "गिनती 1 से 10",
    medium: "हिंदी",
    instructionsHindi: "नीचे दिए गए सभी प्रश्नों के उत्तर ध्यानपूर्वक दें।",
    totalMarks: 10,
    durationMinutes: 20,
    q1Question: "संख्या '3' के ठीक बाद कौन सी संख्या आती है?",
    q1OptA: "2",
    q1OptB: "4",
    q1OptC: "5",
    q1OptD: "6",
    q1Correct: "4",
    q2Question: "रिक्त स्थान भरें: 1, 2, 3, ___, 5, 6",
    q2Answer: "4",
    q3Oral: "1 से 10 तक सीधी गिनती शिक्षक को सुनाएं।",
  });
  const [selectedPaperView, setSelectedPaperView] = useState<any>(null);

  // 4. Teaching Script State (Pedagogy Guide in Hindi / English)
  const [selectedTopic, setSelectedTopic] = useState("");
  const [scriptGrade, setScriptGrade] = useState("कक्षा 1");
  const [scriptMedium, setScriptMedium] = useState("हिंदी");
  const [plan, setPlan] = useState<any>(null);

  useEffect(() => {
    fetchTopics();
    fetchClasses();
    fetchNotes();
    fetchPracticePapers();
  }, []);

  const fetchTopics = async () => {
    try {
      const res = await axios.get(`${API}/curriculum/topics`);
      setTopics(res.data.topics || []);
      if (res.data.topics?.length > 0) {
        setSelectedTopic(res.data.topics[0].name);
      }
    } catch (err) {
      console.error("टॉपिक्स लोड करने में समस्या आई है", err);
    }
  };

  const fetchClasses = async () => {
    try {
      const res = await axios.get(`${API}/curriculum/classes`);
      setClasses(res.data.classes || []);
    } catch (err) {
      console.error("क्लासेस लोड करने में समस्या आई है", err);
    }
  };

  const fetchNotes = async () => {
    try {
      const res = await axios.get(`${API}/curriculum/notes`);
      setNotes(res.data.notes || []);
    } catch (err) {
      console.error("नोट्स लोड करने में समस्या आई है", err);
    }
  };

  const fetchPracticePapers = async () => {
    try {
      const res = await axios.get(`${API}/curriculum/practice-papers`);
      setPracticePapers(res.data.papers || []);
    } catch (err) {
      console.error("प्रैक्टिस पेपर्स लोड करने में समस्या आई है", err);
    }
  };

  // 1. Handlers for Live Class Scheduling
  const handleScheduleClass = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    try {
      await axios.post(`${API}/curriculum/classes`, {
        ...newClass,
      });
      await fetchClasses();
      setShowClassModal(false);
      alert("✅ लाइव कक्षा सफलतापूर्वक शेड्यूल की गई!");
    } catch (err) {
      console.error("कक्षा निर्धारित करने में त्रुटि", err);
      alert("कक्षा निर्धारित करने में विफल");
    } finally {
      setLoading(false);
    }
  };

  const handleDeleteClass = async (id: string) => {
    if (!confirm("क्या आप इस लाइव क्लास को हटाना चाहते हैं?")) return;
    try {
      await axios.delete(`${API}/curriculum/classes/${id}`);
      fetchClasses();
    } catch (err) {
      console.error("कक्षा हटाने में त्रुटि", err);
    }
  };

  const handleOpenEditClass = (cls: any) => {
    if (cls.isExpired || cls.isLocked || cls.status === "ended") {
      alert("🔒 यह कक्षा समाप्त हो चुकी है। समय समाप्त होने के बाद क्लास को संपादित नहीं किया जा सकता।");
      return;
    }
    setEditClassData({
      id: cls.id,
      date: cls.date,
      startTime: cls.startTime,
      endTime: cls.endTime,
      subject: cls.subject,
      topic: cls.topic,
      grade: cls.grade,
      medium: cls.medium || "हिंदी",
      roomCode: cls.roomCode,
    });
    setShowEditClassModal(true);
  };

  const handleUpdateClass = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!editClassData) return;
    setLoading(true);
    try {
      await axios.put(`${API}/curriculum/classes/${editClassData.id}`, editClassData);
      await fetchClasses();
      setShowEditClassModal(false);
      setEditClassData(null);
      alert("✅ लाइव कक्षा विवरण सफलतापूर्वक अपडेट किया गया!");
    } catch (err: any) {
      console.error("Error updating class:", err);
      const msg = err.response?.data?.error || "क्लास अपडेट करने में विफल।";
      alert(msg);
    } finally {
      setLoading(false);
    }
  };

  // 2. Handlers for Class Notes
  const handleAddNote = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newNote.title.trim()) {
      alert("कृपया नोट्स का शीर्षक दर्ज करें!");
      return;
    }
    setLoading(true);
    try {
      const keyPoints = [newNote.keyPoint1, newNote.keyPoint2].filter(Boolean);
      const vocabulary = [
        { term: newNote.vocabTerm1, meaning: newNote.vocabMeaning1 },
        { term: newNote.vocabTerm2, meaning: newNote.vocabMeaning2 },
      ].filter((v) => v.term || v.meaning);

      await axios.post(`${API}/curriculum/notes`, {
        classId: newNote.classId,
        date: newNote.date,
        title: newNote.title,
        subject: newNote.subject,
        topic: newNote.topic,
        grade: newNote.grade,
        medium: newNote.medium,
        teacherSummary: newNote.teacherSummary,
        keyPoints,
        vocabulary,
        studentTask: newNote.studentTask,
      });
      await fetchNotes();
      setShowNoteModal(false);
      alert("✅ कक्षा नोट्स सफलतापूर्वक सहेजे गए!");
    } catch (err) {
      console.error("नोट सेव करने में समस्या आई है", err);
      alert("नोट सेव करने में समस्या आई है");
    } finally {
      setLoading(false);
    }
  };

  const handleDeleteNote = async (id: string) => {
    if (!confirm("क्या आप इस नोट को हटाना चाहते हैं?")) return;
    try {
      await axios.delete(`${API}/curriculum/notes/${id}`);
      fetchNotes();
      if (selectedNoteView?.id === id) setSelectedNoteView(null);
    } catch (err) {
      console.error("नोट हटाने में त्रुटि", err);
      alert("नोट हटाने में त्रुटि");
    }
  };

  // 3. Handlers for Practice Papers
  const handleCreatePaper = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newPaper.title.trim()) {
      alert("कृपया प्रैक्टिस पेपर का शीर्षक दर्ज करें!");
      return;
    }
    setLoading(true);
    try {
      const questions = [
        {
          qNum: 1,
          questionHindi: newPaper.q1Question,
          type: "mcq",
          options: [newPaper.q1OptA, newPaper.q1OptB, newPaper.q1OptC, newPaper.q1OptD],
          correctAnswer: newPaper.q1Correct,
          marks: 4,
        },
        {
          qNum: 2,
          questionHindi: newPaper.q2Question,
          type: "fill",
          correctAnswer: newPaper.q2Answer,
          marks: 3,
        },
        {
          qNum: 3,
          questionHindi: newPaper.q3Oral,
          type: "oral",
          marks: 3,
        },
      ];

      await axios.post(`${API}/curriculum/practice-papers`, {
        title: newPaper.title,
        grade: newPaper.grade,
        subject: newPaper.subject,
        topic: newPaper.topic,
        medium: newPaper.medium,
        instructionsHindi: newPaper.instructionsHindi,
        totalMarks: newPaper.totalMarks,
        durationMinutes: newPaper.durationMinutes,
        questions,
      });

      await fetchPracticePapers();
      setShowPaperModal(false);
      alert("✅ प्रैक्टिस पेपर / वर्कशीट सफलतापूर्वक बनाई गई!");
    } catch (err) {
      console.error("अभ्यास प्रश्न-पत्र बनाने में त्रुटि", err);
      alert("प्रश्न-पत्र बनाने में विफल");
    } finally {
      setLoading(false);
    }
  };

  const handleDeletePaper = async (id: string) => {
    if (!confirm("क्या आप इस प्रैक्टिस पेपर को हटाना चाहते हैं?")) return;
    try {
      await axios.delete(`${API}/curriculum/practice-papers/${id}`);
      fetchPracticePapers();
      if (selectedPaperView?.id === id) setSelectedPaperView(null);
    } catch (err) {
      console.error("प्रश्न-पत्र हटाने में त्रुटि", err);
      alert("प्रश्न-पत्र हटाने में त्रुटि");
    }
  };

  // 4. Handlers for Teaching Script
  const handleGenerateScript = async () => {
    if (!selectedTopic) return;
    setLoading(true);
    try {
      const res = await axios.post(`${API}/curriculum/lesson-plan/generate`, {
        topic: selectedTopic,
        grade: scriptGrade,
        targetLang: "san", // fallback internal
      });
      setPlan(res.data.lessonPlan);
    } catch (err) {
      console.error("पाठ की पटकथा जनरेट करने में त्रुटि", err);
      alert("पाठ की पटकथा जनरेट करने में त्रुटि");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="p-8 bg-[#F8FAFC] min-h-full space-y-6 max-w-6xl mx-auto font-sans">
      {/* Header Banner */}
      <div
        className="p-6 sm:p-8 rounded-[20px] text-white shadow-md border-0"
        style={{ background: "linear-gradient(135deg, #2563EB 0%, #7C3AED 100%)" }}
      >
        <div className="flex flex-wrap items-center justify-between gap-4">
          <div>
            <div className="flex flex-wrap items-center gap-2 mb-2">
              <span
                className="text-xs font-black px-3 py-1 rounded-full border border-white/30 backdrop-blur-md shadow-xs uppercase tracking-wide text-white"
                style={{ backgroundColor: "rgba(255, 255, 255, 0.2)" }}
              >
                वाणीसेतु • शिक्षक हब
              </span>
              <span
                className="text-xs font-bold px-2.5 py-1 rounded-full border border-white/30 backdrop-blur-md shadow-xs text-white"
                style={{ backgroundColor: "rgba(255, 255, 255, 0.2)" }}
              >
                📅 {new Date().toLocaleDateString("hi-IN", { weekday: "long", day: "numeric", month: "long", year: "numeric" })}
              </span>
            </div>
            <h1 className="text-2xl sm:text-3xl font-black text-white tracking-tight">
              📖 पाठ योजनाकार और शैक्षणिक केंद्र
            </h1>
            <p className="text-blue-100 text-xs sm:text-sm mt-1 max-w-3xl font-medium">
              लाइव कक्षाएं शेड्यूल करें, तारीख अनुसार क्लास नोट्स जोड़ें, और बच्चों के लिए प्रैक्टिस पेपर्स व वर्कशीट्स तैयार करें।
            </p>
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={() => {
                if (activeTab === "समय-सारणी") setShowClassModal(true);
                else if (activeTab === "नोट्स") setShowNoteModal(true);
                else if (activeTab === "प्रश्न-पत्र") setShowPaperModal(true);
                else handleGenerateScript();
              }}
              style={{ background: "linear-gradient(135deg, #4F46E5 0%, #7C3AED 100%)" }}
              className="text-white font-black text-xs sm:text-sm px-5 py-3 rounded-xl shadow-md shadow-indigo-600/20 hover:opacity-95 transition active:scale-95 flex items-center gap-2"
            >
              <span>+</span>
              <span>
                {activeTab === "समय-सारणी"
                  ? "लाइव क्लास शेड्यूल करें"
                  : activeTab === "नोट्स"
                  ? "नए क्लास नोट्स जोड़ें"
                  : activeTab === "प्रश्न-पत्र"
                  ? "नया प्रैक्टिस पेपर बनाएं"
                  : "स्क्रिप्ट तैयार करें"}
              </span>
            </button>
          </div>
        </div>

        {/* Tab Navigation */}
        <div className="flex flex-wrap items-center gap-2.5 mt-6 pt-6 border-t border-white/20">
          <button
            onClick={() => setActiveTab("समय-सारणी")}
            className={`px-4 py-2.5 rounded-xl font-black text-xs sm:text-sm transition flex items-center gap-2 ${
              activeTab === "समय-सारणी"
                ? "bg-[#4F46E5] text-white shadow-md border border-[#4F46E5]"
                : "bg-white text-slate-700 hover:bg-[#F8FAFC] border border-[#DBEAFE] shadow-2xs"
            }`}
          >
            <span>🎙️</span>
            <span>1. लाइव क्लास शेड्यूल ({classes.length})</span>
          </button>

          <button
            onClick={() => setActiveTab("नोट्स")}
            className={`px-4 py-2.5 rounded-xl font-black text-xs sm:text-sm transition flex items-center gap-2 ${
              activeTab === "नोट्स"
                ? "bg-[#4F46E5] text-white shadow-md border border-[#4F46E5]"
                : "bg-white text-slate-700 hover:bg-[#F8FAFC] border border-[#DBEAFE] shadow-2xs"
            }`}
          >
            <span>📝</span>
            <span>2. क्लास नोट्स ({notes.length})</span>
          </button>

          <button
            onClick={() => setActiveTab("प्रश्न-पत्र")}
            className={`px-4 py-2.5 rounded-xl font-black text-xs sm:text-sm transition flex items-center gap-2 ${
              activeTab === "प्रश्न-पत्र"
                ? "bg-[#4F46E5] text-white shadow-md border border-[#4F46E5]"
                : "bg-white text-slate-700 hover:bg-[#F8FAFC] border border-[#DBEAFE] shadow-2xs"
            }`}
          >
            <span>📄</span>
            <span>3. प्रैक्टिस पेपर्स & वर्कशीट्स ({practicePapers.length})</span>
          </button>

          <button
            onClick={() => setActiveTab("लिपि")}
            className={`px-4 py-2.5 rounded-xl font-black text-xs sm:text-sm transition flex items-center gap-2 ${
              activeTab === "लिपि"
                ? "bg-[#4F46E5] text-white shadow-md border border-[#4F46E5]"
                : "bg-white text-slate-700 hover:bg-[#F8FAFC] border border-[#DBEAFE] shadow-2xs"
            }`}
          >
            <span>🗣️</span>
            <span>4. 30-मिनट पेडागोगी स्क्रिप्ट</span>
          </button>
        </div>
      </div>

      {/* ========================================================================= */}
      {/* TAB 1: LIVE CLASS SCHEDULER */}
      {/* ========================================================================= */}
      {activeTab === "समय-सारणी" && (
        <div className="space-y-6">
          <div className="flex items-center justify-between">
            <h2 className="text-xl font-extrabold text-[#0F172A] flex items-center gap-2">
              <span>📅</span> निर्धारित लाइव कक्षाएं
            </h2>
            <button
              onClick={() => setShowClassModal(true)}
              className="bg-white text-[#1E40AF] hover:bg-[#EFF6FF] text-xs font-black px-4 py-2 rounded-xl border border-[#DBEAFE] shadow-2xs transition"
            >
              + नई क्लास जोड़ें
            </button>
          </div>

          {classes.length === 0 ? (
            <div className="bg-white p-12 rounded-[16px] text-center border border-[#DBEAFE] shadow-xs">
              <p className="text-slate-600 text-sm font-semibold">कोई लाइव क्लास शेड्यूल नहीं है। ऊपर दिए बटन से क्लास जोड़ें।</p>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
              {classes.map((cls) => {
                const isEnded = cls.status === "ended" || cls.isExpired || cls.isLocked;
                const isLive = cls.status === "live";

                return (
                  <div
                    key={cls.id}
                    className={`bg-white p-6 rounded-[16px] border border-[#DBEAFE] transition space-y-4 shadow-xs ${
                      isEnded
                        ? "opacity-90"
                        : isLive
                        ? "ring-2 ring-indigo-400"
                        : "hover:shadow-sm"
                    }`}
                  >
                    <div className="flex flex-wrap items-center justify-between gap-2">
                      <div className="flex flex-wrap items-center gap-2">
                        {isEnded ? (
                          <span className="bg-[#DBEAFE] text-[#1E40AF] text-xs font-black px-3 py-1 rounded-full border border-[#BFDBFE] shadow-2xs flex items-center gap-1">
                            <span>🔒</span> समय समाप्त
                          </span>
                        ) : isLive ? (
                          <span className="bg-[#DBEAFE] text-[#1E40AF] text-xs font-black px-3 py-1 rounded-full border border-[#BFDBFE] shadow-2xs flex items-center gap-1.5 animate-pulse">
                            <span className="w-2 h-2 rounded-full bg-[#1E40AF]"></span>
                            🔴 अभी लाइव
                          </span>
                        ) : (
                          <span className="bg-[#DBEAFE] text-[#1E40AF] text-xs font-black px-3 py-1 rounded-full border border-[#BFDBFE] shadow-2xs">
                            ⏳ आगामी
                          </span>
                        )}

                        <span className="bg-[#F8FAFC] text-[#1E40AF] text-xs font-bold px-3 py-1 rounded-full border border-[#DBEAFE] shadow-2xs">
                          📅 {cls.date}
                        </span>
                        <span className="bg-[#F8FAFC] text-slate-700 text-xs font-bold px-2.5 py-1 rounded-full border border-[#DBEAFE] shadow-2xs">
                          ⏰ {cls.startTime} - {cls.endTime}
                        </span>
                      </div>

                      <div className="flex items-center gap-1.5">
                        {isEnded ? (
                          <span
                            className="text-xs text-[#1E40AF] font-bold bg-[#DBEAFE] px-2.5 py-1 rounded-lg border border-[#DBEAFE] select-none cursor-not-allowed shadow-2xs"
                            title="समय समाप्त होने के बाद एडिट नहीं किया जा सकता"
                          >
                            🔒 लॉक
                          </span>
                        ) : (
                          <button
                            onClick={() => handleOpenEditClass(cls)}
                            className="text-[#1E40AF] hover:text-blue-900 bg-white hover:bg-[#F8FAFC] px-2.5 py-1 rounded-lg text-xs font-bold transition flex items-center gap-1 border border-[#DBEAFE] shadow-2xs"
                            title="क्लास का समय या विषय संपादित करें"
                          >
                            <span>✏️</span> एडिट
                          </button>
                        )}

                        <button
                          onClick={() => handleDeleteClass(cls.id)}
                          className="text-red-500 bg-white hover:bg-red-50 p-1.5 rounded-lg text-xs transition border border-[#DBEAFE] shadow-2xs"
                          title="क्लास हटाएं"
                        >
                          🗑️
                        </button>
                      </div>
                    </div>

                    <div>
                      <h3 className="text-lg font-black text-[#0F172A]">{cls.topic}</h3>
                      <p className="text-xs text-slate-600 font-semibold mt-0.5">
                        📚 विषय: <span className="text-slate-800 font-bold">{cls.subject}</span> • {cls.grade}
                      </p>
                    </div>

                    <div className="flex flex-wrap items-center gap-2 pt-2 border-t border-[#DBEAFE] text-xs">
                      <span className="bg-[#F8FAFC] text-[#1E40AF] px-3 py-1 rounded-lg font-bold border border-[#DBEAFE] shadow-2xs">
                        माध्यम: {cls.medium || "हिंदी"}
                      </span>
                      <span className="bg-[#F8FAFC] text-slate-700 px-2.5 py-1 rounded-lg font-mono font-bold border border-[#DBEAFE] shadow-2xs">
                        कक्ष: {cls.roomCode}
                      </span>
                    </div>

                    <div className="flex flex-wrap items-center gap-2 pt-2">
                      {isEnded ? (
                        <button
                          disabled
                          className="flex-1 bg-slate-100 text-slate-400 text-center py-2.5 rounded-xl font-bold text-xs border border-slate-200 cursor-not-allowed"
                        >
                          🔒 क्लास समाप्त
                        </button>
                      ) : (
                        <Link
                          to="/teacher/liveclass"
                          style={{ background: "linear-gradient(135deg, #4F46E5 0%, #7C3AED 100%)" }}
                          className="flex-1 text-white text-center py-2.5 rounded-xl font-extrabold text-xs shadow-md shadow-indigo-600/20 hover:opacity-95 transition flex items-center justify-center gap-1.5"
                        >
                          🎙️ कक्षा शुरू करें
                        </Link>
                      )}
                      <button
                        onClick={() => {
                          setNewNote((prev) => ({
                            ...prev,
                            classId: cls.id,
                            date: cls.date,
                            topic: cls.topic,
                            subject: cls.subject,
                            grade: cls.grade,
                            medium: cls.medium || "हिंदी",
                            title: `कक्षा नोट्स: ${cls.topic} (${cls.date})`,
                          }));
                          setActiveTab("नोट्स");
                          setShowNoteModal(true);
                        }}
                        className="bg-[#F8FAFC] hover:bg-[#EEF2FF] text-[#1E40AF] border border-[#DBEAFE] px-3 py-2.5 rounded-xl font-bold text-xs transition shadow-2xs"
                      >
                        📝 नोट्स जोड़ें
                      </button>
                      <button
                        onClick={() => {
                          setNewPaper((prev) => ({
                            ...prev,
                            topic: cls.topic,
                            subject: cls.subject,
                            grade: cls.grade,
                            medium: cls.medium || "हिंदी",
                            title: `अभ्यास पत्रक: ${cls.topic}`,
                          }));
                          setActiveTab("प्रश्न-पत्र");
                          setShowPaperModal(true);
                        }}
                        className="bg-[#F8FAFC] hover:bg-[#EEF2FF] text-[#1E40AF] border border-[#DBEAFE] px-3 py-2.5 rounded-xl font-bold text-xs transition shadow-2xs"
                      >
                        📄 वर्कशीट
                      </button>
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </div>
      )}

      {/* ========================================================================= */}
      {/* TAB 2: CLASS NOTES & STUDY MATERIAL (HINDI MEDIUM) */}
      {/* ========================================================================= */}
      {activeTab === "नोट्स" && (
        <div className="space-y-6">
          <div className="flex items-center justify-between">
            <h2 className="text-xl font-extrabold text-[#0F172A] flex items-center gap-2">
              <span>📝</span> कक्षा नोट्स और शिक्षण सामग्री
            </h2>
            <button
              onClick={() => setShowNoteModal(true)}
              className="bg-blue-600 hover:bg-blue-700 text-white text-xs font-extrabold px-4 py-2.5 rounded-xl shadow-sm transition"
            >
              + नए क्लास नोट्स लिखें
            </button>
          </div>

          {notes.length === 0 ? (
            <div className="bg-[#EEF2FF] p-12 rounded-[16px] text-center border border-[#C7D2FE] shadow-2xs">
              <p className="text-slate-600 text-sm font-semibold">अभी कोई क्लास नोट्स नहीं जोड़े गए हैं।</p>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
              {notes.map((note) => (
                <div
                  key={note.id}
                  className="bg-[#EEF2FF] p-6 rounded-[16px] border border-[#C7D2FE] shadow-2xs hover:shadow-md transition space-y-4"
                >
                  <div className="flex items-center justify-between">
                    <span className="bg-white text-[#1E56A0] text-xs font-extrabold px-3 py-1 rounded-full border border-[#C7D2FE] shadow-2xs">
                      📅 इस दिन की क्लास के नोट्स: {note.date}
                    </span>
                    <button
                      onClick={() => handleDeleteNote(note.id)}
                      className="text-red-600 bg-white hover:bg-red-50 text-sm p-1.5 rounded-lg border border-[#C7D2FE] shadow-2xs"
                    >
                      🗑️
                    </button>
                  </div>

                  <div>
                    <h3 className="text-base font-black text-slate-900">{note.title}</h3>
                    <p className="text-xs text-slate-600 font-semibold mt-0.5">
                      📚 {note.subject} • {note.grade} • {note.topic}
                    </p>
                  </div>

                  {note.teacherSummary && (
                    <p className="text-xs text-slate-700 bg-white p-3 rounded-[12px] border border-[#C7D2FE] shadow-2xs leading-relaxed">
                      💡 <strong>शिक्षण सारांश:</strong> {note.teacherSummary}
                    </p>
                  )}

                  {note.keyPoints && note.keyPoints.length > 0 && (
                    <div className="bg-white p-3 rounded-[12px] border border-[#C7D2FE] shadow-2xs">
                      <h4 className="text-[11px] font-bold text-slate-500 uppercase tracking-wider mb-1.5">
                        मुख्य शिक्षण बिंदु:
                      </h4>
                      <ul className="list-disc list-inside text-xs text-slate-700 space-y-1 font-medium">
                        {note.keyPoints.map((kp: string, idx: number) => (
                          <li key={idx}>{kp}</li>
                        ))}
                      </ul>
                    </div>
                  )}

                  {note.vocabulary && note.vocabulary.length > 0 && (
                    <div className="bg-white p-3 rounded-[12px] border border-[#C7D2FE] shadow-2xs space-y-1.5">
                      <h4 className="text-[11px] font-bold text-[#1E56A0] uppercase tracking-wider">
                        महत्वपूर्ण अवधारणाएं व शब्दावली:
                      </h4>
                      <div className="space-y-1.5 text-xs">
                        {note.vocabulary.map((v: any, idx: number) => (
                          <div key={idx} className="bg-[#EEF2FF] p-2.5 rounded-lg border border-[#C7D2FE]">
                            <span className="font-bold text-slate-900">{v.term || v.hindi}: </span>
                            <span className="text-slate-700">{v.meaning || v.phonetics}</span>
                          </div>
                        ))}
                      </div>
                    </div>
                  )}

                  {note.studentTask && (
                    <div className="text-xs font-bold text-amber-900 bg-white p-2.5 rounded-[12px] border border-[#C7D2FE] shadow-2xs">
                      🎯 गृहकार्य / अभ्यास कार्य: {note.studentTask}
                    </div>
                  )}

                  <div className="pt-2 flex justify-end">
                    <button
                      onClick={() => setSelectedNoteView(note)}
                      className="text-xs font-bold text-[#1E56A0] hover:underline bg-white px-3 py-1 rounded-lg border border-[#C7D2FE] shadow-2xs"
                    >
                      विस्तार से देखें / प्रिंट करें ➔
                    </button>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      )}

      {/* ========================================================================= */}
      {/* TAB 3: PRACTICE PAPERS & WORKSHEETS (HINDI MEDIUM) */}
      {/* ========================================================================= */}
      {activeTab === "प्रश्न-पत्र" && (
        <div className="space-y-6">
          <div className="flex items-center justify-between">
            <h2 className="text-xl font-extrabold text-[#0F172A] flex items-center gap-2">
              <span>📄</span> बच्चों के लिए प्रैक्टिस पेपर्स व वर्कशीट्स (हिंदी माध्यम)
            </h2>
            <button
              onClick={() => setShowPaperModal(true)}
              className="bg-blue-600 hover:bg-blue-700 text-white text-xs font-extrabold px-4 py-2.5 rounded-xl shadow-sm transition"
            >
              + नया प्रैक्टिस पेपर तैयार करें
            </button>
          </div>

          {practicePapers.length === 0 ? (
            <div className="bg-[#EEF2FF] p-12 rounded-[16px] text-center border border-[#C7D2FE] shadow-2xs">
              <p className="text-slate-600 text-sm font-semibold">अभी कोई प्रैक्टिस पेपर नहीं बनाया गया है।</p>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
              {practicePapers.map((paper) => (
                <div
                  key={paper.id}
                  className="bg-[#EEF2FF] p-6 rounded-[16px] border border-[#C7D2FE] shadow-2xs hover:shadow-md transition space-y-4"
                >
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <span className="bg-white text-[#1E56A0] text-xs font-extrabold px-3 py-1 rounded-full border border-[#C7D2FE] shadow-2xs">
                        {paper.grade}
                      </span>
                      <span className="bg-white text-slate-700 text-xs font-bold px-2.5 py-1 rounded-full border border-[#C7D2FE] shadow-2xs">
                        ⏱️ {paper.durationMinutes} मिनट • 🎯 {paper.totalMarks} अंक
                      </span>
                    </div>
                    <button
                      onClick={() => handleDeletePaper(paper.id)}
                      className="text-red-600 bg-white hover:bg-red-50 text-sm p-1.5 rounded-lg border border-[#C7D2FE] shadow-2xs"
                    >
                      🗑️
                    </button>
                  </div>

                  <div>
                    <h3 className="text-base font-black text-slate-900">{paper.title}</h3>
                    <p className="text-xs text-slate-600 font-semibold mt-0.5">
                      📚 {paper.subject} • {paper.topic} • माध्यम: {paper.medium || "हिंदी"}
                    </p>
                  </div>

                  <div className="bg-white p-3 rounded-[12px] border border-[#C7D2FE] shadow-2xs text-xs text-slate-700">
                    <p className="font-bold text-slate-800 mb-0.5">निर्देश:</p>
                    <p>{paper.instructionsHindi}</p>
                  </div>

                  <div className="space-y-2">
                    <h4 className="text-[11px] font-bold text-slate-400 uppercase tracking-wider">
                      शामिल प्रश्न ({paper.questions?.length || 0} प्रश्न):
                    </h4>
                    {paper.questions?.map((q: any, i: number) => (
                      <div key={i} className="text-xs border-b border-slate-100 pb-1.5 last:border-b-0">
                        <span className="font-bold text-slate-800">प्र. {q.qNum || i + 1}. </span>
                        <span>{q.questionHindi}</span>
                      </div>
                    ))}
                  </div>

                  <div className="pt-2 flex items-center justify-between">
                    <button
                      onClick={() => setSelectedPaperView(paper)}
                      className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-xl text-xs font-bold shadow-sm transition flex items-center gap-1.5"
                    >
                      <span>🖨️</span>
                      <span>प्रैक्टिस पेपर देखें / प्रिंट करें</span>
                    </button>
                    <span className="text-xs font-semibold text-slate-400">📅 {paper.date}</span>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      )}

      {/* ========================================================================= */}
      {/* TAB 4: 30-MINUTE PEDAGOGY SCRIPT */}
      {/* ========================================================================= */}
      {activeTab === "लिपि" && (
        <div className="space-y-6">
          {/* Script Generation Controls */}
          <div className="bg-[#EEF2FF] p-6 rounded-[16px] shadow-2xs border border-[#C7D2FE]">
            <h2 className="text-xs font-bold text-blue-900/60 uppercase tracking-wider mb-4">
              30-मिनट संरचित कक्षा शिक्षण शास्त्र मार्गदर्शन
            </h2>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-5 mb-5">
              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1.5 uppercase tracking-wider">
                  1. विषय-वस्तु
                </label>
                <select
                  className="w-full border border-[#C7D2FE] p-3 rounded-xl focus:border-blue-600 focus:ring-2 focus:ring-blue-100 focus:outline-none bg-white text-sm font-semibold text-slate-800 transition shadow-2xs"
                  value={selectedTopic}
                  onChange={(e) => setSelectedTopic(e.target.value)}
                >
                  {topics.map((t) => (
                    <option key={t.id} value={t.name}>
                      {t.name} ({t.grade})
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1.5 uppercase tracking-wider">
                  2. कक्षा
                </label>
                <select
                  className="w-full border border-[#C7D2FE] p-3 rounded-xl focus:border-blue-600 focus:ring-2 focus:ring-blue-100 focus:outline-none bg-white text-sm font-semibold text-slate-800 transition shadow-2xs"
                  value={scriptGrade}
                  onChange={(e) => setScriptGrade(e.target.value)}
                >
                  <option value="कक्षा 1">कक्षा 1</option>
                  <option value="कक्षा 2">कक्षा 2</option>
                  <option value="कक्षा 3">कक्षा 3</option>
                </select>
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1.5 uppercase tracking-wider">
                  3. शिक्षण माध्यम
                </label>
                <select
                  className="w-full border border-[#C7D2FE] p-3 rounded-xl focus:border-blue-600 focus:ring-2 focus:ring-blue-100 focus:outline-none bg-white text-sm font-semibold text-slate-800 transition shadow-2xs"
                  value={scriptMedium}
                  onChange={(e) => setScriptMedium(e.target.value)}
                >
                  <option value="हिंदी">हिंदी</option>
                  <option value="अंग्रेज़ी">अंग्रेज़ी</option>
                </select>
              </div>
            </div>

            <button
              onClick={handleGenerateScript}
              disabled={loading || !selectedTopic}
              className="w-full bg-blue-600 hover:bg-blue-700 text-white py-3.5 rounded-xl font-bold text-sm shadow-md shadow-blue-600/25 transition duration-150 disabled:opacity-50 flex items-center justify-center gap-2"
            >
              {loading ? "शिक्षण योजना तैयार हो रही है..." : "✨ 30-मिनट शिक्षण योजना स्क्रिप्ट बनाएं"}
            </button>
          </div>

          {/* Script Output Dialogue */}
          {plan && (
            <div className="bg-[#EEF2FF] p-8 rounded-[16px] shadow-2xs border border-[#C7D2FE] space-y-8">
              <div className="border-b border-[#C7D2FE] pb-5">
                <div className="flex flex-wrap items-center justify-between gap-3 mb-2">
                  <span className="bg-white text-blue-700 font-extrabold px-3 py-1 rounded-lg text-xs border border-[#C7D2FE] shadow-2xs">
                    🎯 परिणाम: {plan.learningOutcomeCode}
                  </span>
                  <span className="text-slate-600 text-xs font-bold bg-white px-3 py-1 rounded-lg border border-[#C7D2FE] shadow-2xs">
                    ⏱️ 30-मिनट• {scriptMedium}
                  </span>
                </div>
                <h2 className="text-2xl font-black text-slate-900">{plan.topic}</h2>
                <p className="text-slate-600 text-xs mt-1">{plan.learningOutcomeDesc}</p>
              </div>

              {/* Step-by-Step Script Dialogues in Hindi */}
              <div>
                <h3 className="text-sm font-extrabold text-slate-900 uppercase tracking-wider mb-4 flex items-center gap-2">
                  <span>🗣️</span> 30-मिनट स्टेप-बाय-स्टेप संरचित कक्षा शिक्षण डायलॉग
                </h3>

                <div className="space-y-4">
                  {plan.teachingScript?.map((step: any) => (
                    <div
                      key={step.stepNumber}
                      className="border border-[#C7D2FE] rounded-[16px] p-6 bg-white hover:border-blue-400 transition shadow-2xs"
                    >
                      <div className="flex items-center justify-between mb-4 border-b border-slate-100 pb-3">
                        <span className="font-extrabold text-slate-900 text-base">
                          {step.phaseName}
                        </span>
                        <span className="bg-[#EEF2FF] text-blue-700 text-xs px-3 py-1 rounded-full font-bold border border-[#C7D2FE]">
                          ⏱️ {step.durationMinutes} मिनट
                        </span>
                      </div>

                      <div className="bg-[#EEF2FF]/60 p-4 rounded-xl border border-[#C7D2FE] mb-4">
                        <p className="text-[10px] font-bold text-slate-500 uppercase tracking-wider mb-1">
                          शिक्षक का वक्तव्य:
                        </p>
                        <p className="text-slate-900 font-bold text-sm leading-relaxed">
                          {step.teacherHindiScript}
                        </p>
                      </div>

                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-xs text-slate-600 pt-3 border-t border-slate-100">
                        <div>
                          <span className="font-bold text-slate-800">🎬 शिक्षक की गतिविधि: </span>
                          {step.classroomAction}
                        </div>
                        <div>
                          <span className="font-bold text-slate-800">🙋 छात्रों की अपेक्षित प्रतिक्रिया: </span>
                          {step.expectedStudentResponse}
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          )}
        </div>
      )}

      {/* ========================================================================= */}
      {/* MODAL 1: SCHEDULE LIVE CLASS (HINDI / ENGLISH MEDIUM) */}
      {/* ========================================================================= */}
      {showClassModal && (
        <div className="fixed inset-0 bg-slate-900/40 backdrop-blur-xs flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-3xl max-w-xl w-full p-8 shadow-2xl border border-slate-200 max-h-[90vh] overflow-y-auto">
            <div className="flex items-center justify-between mb-6 pb-4 border-b border-slate-100">
              <h3 className="text-xl font-black text-slate-900">🎙️ नई लाइव कक्षा शेड्यूल करें</h3>
              <button
                onClick={() => setShowClassModal(false)}
                className="text-slate-400 hover:text-slate-600 text-2xl font-bold"
              >
                ×
              </button>
            </div>

            <form onSubmit={handleScheduleClass} className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1">तारीख</label>
                  <input
                    type="date"
                    required
                    value={newClass.date}
                    onChange={(e) => setNewClass({ ...newClass, date: e.target.value })}
                    className="w-full border border-slate-200 p-3 rounded-xl text-sm font-semibold focus:outline-none focus:border-blue-600"
                  />
                </div>
                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1">कक्षा</label>
                  <select
                    value={newClass.grade}
                    onChange={(e) => setNewClass({ ...newClass, grade: e.target.value })}
                    className="w-full border border-slate-200 p-3 rounded-xl text-sm font-semibold focus:outline-none focus:border-blue-600 bg-white"
                  >
                    <option value="कक्षा 1">कक्षा 1</option>
                    <option value="कक्षा 2">कक्षा 2</option>
                    <option value="कक्षा 3">कक्षा 3</option>
                  </select>
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1">शुरू समय</label>
                  <input
                    type="text"
                    required
                    value={newClass.startTime}
                    onChange={(e) => setNewClass({ ...newClass, startTime: e.target.value })}
                    placeholder="सुबह 09:30 बजे"
                    className="w-full border border-slate-200 p-3 rounded-xl text-sm font-semibold focus:outline-none focus:border-blue-600"
                  />
                </div>
                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1">समाप्ति समय</label>
                  <input
                    type="text"
                    required
                    value={newClass.endTime}
                    onChange={(e) => setNewClass({ ...newClass, endTime: e.target.value })}
                    placeholder="सुबह 10:15 बजे"
                    className="w-full border border-slate-200 p-3 rounded-xl text-sm font-semibold focus:outline-none focus:border-blue-600"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">विषय</label>
                <input
                  type="text"
                  required
                  value={newClass.subject}
                  onChange={(e) => setNewClass({ ...newClass, subject: e.target.value })}
                  className="w-full border border-slate-200 p-3 rounded-xl text-sm font-semibold focus:outline-none focus:border-blue-600"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">टॉपिक / पाठ का नाम</label>
                <input
                  type="text"
                  required
                  value={newClass.topic}
                  onChange={(e) => setNewClass({ ...newClass, topic: e.target.value })}
                  placeholder="उदा. गिनती 1 से 10"
                  className="w-full border border-slate-200 p-3 rounded-xl text-sm font-semibold focus:outline-none focus:border-blue-600"
                />
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1">शिक्षण माध्यम</label>
                  <select
                    value={newClass.medium}
                    onChange={(e) => setNewClass({ ...newClass, medium: e.target.value })}
                    className="w-full border border-slate-200 p-3 rounded-xl text-sm font-semibold focus:outline-none focus:border-blue-600 bg-white"
                  >
                    <option value="हिंदी">हिंदी</option>
                    <option value="अंग्रेज़ी ">अंग्रेज़ी </option>
                  </select>
                </div>

                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1">रूम कोड</label>
                  <input
                    type="text"
                    value={newClass.roomCode}
                    onChange={(e) => setNewClass({ ...newClass, roomCode: e.target.value })}
                    className="w-full border border-slate-200 p-3 rounded-xl text-sm font-mono font-semibold focus:outline-none focus:border-blue-600"
                  />
                </div>
              </div>

              <div className="pt-4 flex items-center justify-end gap-3">
                <button
                  type="button"
                  onClick={() => setShowClassModal(false)}
                  className="px-5 py-2.5 rounded-xl font-bold text-xs text-slate-600 hover:bg-slate-100"
                >
                  रद्द करें
                </button>
                <button
                  type="submit"
                  disabled={loading}
                  className="px-6 py-2.5 bg-blue-600 hover:bg-blue-700 text-white rounded-xl font-extrabold text-xs shadow-md shadow-blue-600/20"
                >
                  {loading ? "शेड्यूल हो रहा है..." : "✓ लाइव क्लास शेड्यूल करें"}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* ========================================================================= */}
      {/* MODAL 1B: EDIT SCHEDULED LIVE CLASS */}
      {/* ========================================================================= */}
      {showEditClassModal && editClassData && (
        <div className="fixed inset-0 bg-slate-900/40 backdrop-blur-xs flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-3xl max-w-xl w-full p-8 shadow-2xl border border-slate-200 max-h-[90vh] overflow-y-auto">
            <div className="flex items-center justify-between mb-6 pb-4 border-b border-slate-100">
              <div className="flex items-center gap-2">
                <span className="text-xl">✏️</span>
                <h3 className="text-xl font-black text-slate-900">लाइव क्लास संपादित करें</h3>
              </div>
              <button
                onClick={() => {
                  setShowEditClassModal(false);
                  setEditClassData(null);
                }}
                className="text-slate-400 hover:text-slate-600 text-2xl font-bold"
              >
                ×
              </button>
            </div>

            <form onSubmit={handleUpdateClass} className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1">तारीख</label>
                  <input
                    type="date"
                    required
                    value={editClassData.date}
                    onChange={(e) => setEditClassData({ ...editClassData, date: e.target.value })}
                    className="w-full border border-slate-200 p-3 rounded-xl text-sm font-semibold focus:outline-none focus:border-blue-600"
                  />
                </div>
                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1">कक्षा</label>
                  <select
                    value={editClassData.grade}
                    onChange={(e) => setEditClassData({ ...editClassData, grade: e.target.value })}
                    className="w-full border border-slate-200 p-3 rounded-xl text-sm font-semibold focus:outline-none focus:border-blue-600 bg-white"
                  >
                    <option value="कक्षा 1">कक्षा 1</option>
                    <option value="कक्षा 2">कक्षा 2</option>
                    <option value="कक्षा 3">कक्षा 3</option>
                  </select>
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1">शुरू समय</label>
                  <input
                    type="text"
                    required
                    value={editClassData.startTime}
                    onChange={(e) => setEditClassData({ ...editClassData, startTime: e.target.value })}
                    placeholder="सुबह 09:30 बजे"
                    className="w-full border border-slate-200 p-3 rounded-xl text-sm font-semibold focus:outline-none focus:border-blue-600"
                  />
                </div>
                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1">समाप्ति समय</label>
                  <input
                    type="text"
                    required
                    value={editClassData.endTime}
                    onChange={(e) => setEditClassData({ ...editClassData, endTime: e.target.value })}
                    placeholder="सुबह 10:15 बजे"
                    className="w-full border border-slate-200 p-3 rounded-xl text-sm font-semibold focus:outline-none focus:border-blue-600"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">विषय</label>
                <input
                  type="text"
                  required
                  value={editClassData.subject}
                  onChange={(e) => setEditClassData({ ...editClassData, subject: e.target.value })}
                  className="w-full border border-slate-200 p-3 rounded-xl text-sm font-semibold focus:outline-none focus:border-blue-600"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">टॉपिक / पाठ का नाम</label>
                <input
                  type="text"
                  required
                  value={editClassData.topic}
                  onChange={(e) => setEditClassData({ ...editClassData, topic: e.target.value })}
                  className="w-full border border-slate-200 p-3 rounded-xl text-sm font-semibold focus:outline-none focus:border-blue-600"
                />
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1">शिक्षण माध्यम</label>
                  <select
                    value={editClassData.medium}
                    onChange={(e) => setEditClassData({ ...editClassData, medium: e.target.value })}
                    className="w-full border border-slate-200 p-3 rounded-xl text-sm font-semibold focus:outline-none focus:border-blue-600 bg-white"
                  >
                    <option value="हिंदी">हिंदी</option>
                    <option value="अंग्रेज़ी ">अंग्रेज़ी </option>
                  </select>
                </div>

                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1">रूम कोड</label>
                  <input
                    type="text"
                    value={editClassData.roomCode}
                    onChange={(e) => setEditClassData({ ...editClassData, roomCode: e.target.value })}
                    className="w-full border border-slate-200 p-3 rounded-xl text-sm font-mono font-semibold focus:outline-none focus:border-blue-600"
                  />
                </div>
              </div>

              <div className="pt-4 flex items-center justify-end gap-3">
                <button
                  type="button"
                  onClick={() => {
                    setShowEditClassModal(false);
                    setEditClassData(null);
                  }}
                  className="px-5 py-2.5 rounded-xl font-bold text-xs text-slate-600 hover:bg-slate-100"
                >
                  रद्द करें
                </button>
                <button
                  type="submit"
                  disabled={loading}
                  className="px-6 py-2.5 bg-blue-600 hover:bg-blue-700 text-white rounded-xl font-extrabold text-xs shadow-md shadow-blue-600/20"
                >
                  {loading ? "अपडेट हो रहा है..." : "✓ बदलाव सहेजें"}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
      {/* MODAL 2: ADD CLASS NOTES (HINDI MEDIUM) */}
      {/* ========================================================================= */}
      {showNoteModal && (
        <div className="fixed inset-0 bg-slate-900/40 backdrop-blur-xs flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-3xl max-w-2xl w-full p-8 shadow-2xl border border-slate-200 max-h-[90vh] overflow-y-auto">
            <div className="flex items-center justify-between mb-6 pb-4 border-b border-slate-100">
              <h3 className="text-xl font-black text-slate-900">📝 नए क्लास नोट्स जोड़ें</h3>
              <button
                onClick={() => setShowNoteModal(false)}
                className="text-slate-400 hover:text-slate-600 text-2xl font-bold"
              >
                ×
              </button>
            </div>

            <form onSubmit={handleAddNote} className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1">कक्षा की तारीख</label>
                  <input
                    type="date"
                    required
                    value={newNote.date}
                    onChange={(e) => setNewNote({ ...newNote, date: e.target.value })}
                    className="w-full border border-slate-200 p-3 rounded-xl text-sm font-semibold focus:outline-none focus:border-blue-600"
                  />
                </div>
                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1">कक्षा</label>
                  <input
                    type="text"
                    value={newNote.grade}
                    onChange={(e) => setNewNote({ ...newNote, grade: e.target.value })}
                    className="w-full border border-slate-200 p-3 rounded-xl text-sm font-semibold focus:outline-none focus:border-blue-600"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">नोट्स का शीर्षक</label>
                <input
                  type="text"
                  required
                  value={newNote.title}
                  onChange={(e) => setNewNote({ ...newNote, title: e.target.value })}
                  placeholder="उदा. कक्षा 1: 1 से 10 तक संख्या अवधारणा व पहचान"
                  className="w-full border border-slate-200 p-3 rounded-xl text-sm font-semibold focus:outline-none focus:border-blue-600"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">शिक्षक सारांश</label>
                <textarea
                  rows={2}
                  value={newNote.teacherSummary}
                  onChange={(e) => setNewNote({ ...newNote, teacherSummary: e.target.value })}
                  placeholder="कक्षा में क्या पढ़ाया गया..."
                  className="w-full border border-slate-200 p-3 rounded-xl text-sm font-medium focus:outline-none focus:border-blue-600"
                />
              </div>

              <div className="space-y-2">
                <label className="block text-xs font-bold text-slate-700">मुख्य शिक्षण बिंदु</label>
                <input
                  type="text"
                  value={newNote.keyPoint1}
                  onChange={(e) => setNewNote({ ...newNote, keyPoint1: e.target.value })}
                  placeholder="बिंदु 1: उदा. 1 से 5 तक संख्याओं की पहचान"
                  className="w-full border border-slate-200 p-2.5 rounded-xl text-xs font-semibold focus:outline-none focus:border-blue-600"
                />
                <input
                  type="text"
                  value={newNote.keyPoint2}
                  onChange={(e) => setNewNote({ ...newNote, keyPoint2: e.target.value })}
                  placeholder="बिंदु 2: उदा. कंकड़ों और पत्तियों से गिनती का अभ्यास"
                  className="w-full border border-slate-200 p-2.5 rounded-xl text-xs font-semibold focus:outline-none focus:border-blue-600"
                />
              </div>

              <div className="space-y-2 bg-blue-50/50 p-4 rounded-2xl border border-blue-100">
                <label className="block text-xs font-bold text-blue-900">महत्वपूर्ण शब्दावली / सूत्र</label>
                <div className="grid grid-cols-2 gap-2">
                  <input
                    type="text"
                    value={newNote.vocabTerm1}
                    onChange={(e) => setNewNote({ ...newNote, vocabTerm1: e.target.value })}
                    placeholder="पद / शब्द (उदा. संख्या बोध)"
                    className="border border-slate-200 p-2 rounded-lg text-xs bg-white font-bold"
                  />
                  <input
                    type="text"
                    value={newNote.vocabMeaning1}
                    onChange={(e) => setNewNote({ ...newNote, vocabMeaning1: e.target.value })}
                    placeholder="अर्थ / विवरण (उदा. मात्रा समझना)"
                    className="border border-slate-200 p-2 rounded-lg text-xs bg-white"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">छात्रों के लिए अभ्यास कार्य / होमवर्क</label>
                <input
                  type="text"
                  value={newNote.studentTask}
                  onChange={(e) => setNewNote({ ...newNote, studentTask: e.target.value })}
                  placeholder="उदा. 1 से 10 तक संख्याएं कॉपी में लिखकर अभ्यास करें"
                  className="w-full border border-slate-200 p-3 rounded-xl text-sm font-semibold focus:outline-none focus:border-blue-600"
                />
              </div>

              <div className="pt-4 flex items-center justify-end gap-3">
                <button
                  type="button"
                  onClick={() => setShowNoteModal(false)}
                  className="px-5 py-2.5 rounded-xl font-bold text-xs text-slate-600 hover:bg-slate-100"
                >
                  रद्द करें
                </button>
                <button
                  type="submit"
                  disabled={loading}
                  className="px-6 py-2.5 bg-blue-600 hover:bg-blue-700 text-white rounded-xl font-extrabold text-xs shadow-md shadow-blue-600/20"
                >
                  {loading ? "सहेजा जा रहा है..." : "✓ नोट्स सहेजें"}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* ========================================================================= */}
      {/* MODAL 3: CREATE PRACTICE PAPER */}
      {/* ========================================================================= */}
      {showPaperModal && (
        <div className="fixed inset-0 bg-slate-900/40 backdrop-blur-xs flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-3xl max-w-2xl w-full p-8 shadow-2xl border border-slate-200 max-h-[90vh] overflow-y-auto">
            <div className="flex items-center justify-between mb-6 pb-4 border-b border-slate-100">
              <h3 className="text-xl font-black text-slate-900">📄 नया प्रैक्टिस पेपर / वर्कशीट बनाएं</h3>
              <button
                onClick={() => setShowPaperModal(false)}
                className="text-slate-400 hover:text-slate-600 text-2xl font-bold"
              >
                ×
              </button>
            </div>

            <form onSubmit={handleCreatePaper} className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1">पेपर का शीर्षक</label>
                  <input
                    type="text"
                    required
                    value={newPaper.title}
                    onChange={(e) => setNewPaper({ ...newPaper, title: e.target.value })}
                    placeholder="उदा. अभ्यास पत्रक: संख्या पहचान एवं सरल जोड़"
                    className="w-full border border-slate-200 p-3 rounded-xl text-sm font-semibold focus:outline-none focus:border-blue-600"
                  />
                </div>
                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1">कक्षा</label>
                  <select
                    value={newPaper.grade}
                    onChange={(e) => setNewPaper({ ...newPaper, grade: e.target.value })}
                    className="w-full border border-slate-200 p-3 rounded-xl text-sm font-semibold focus:outline-none focus:border-blue-600 bg-white"
                  >
                    <option value="कक्षा 1">कक्षा 1</option>
                    <option value="कक्षा 2">कक्षा 2</option>
                    <option value="कक्षा 3">कक्षा 3</option>
                  </select>
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1">विषय</label>
                  <input
                    type="text"
                    value={newPaper.subject}
                    onChange={(e) => setNewPaper({ ...newPaper, subject: e.target.value })}
                    className="w-full border border-slate-200 p-2.5 rounded-xl text-xs font-semibold focus:outline-none focus:border-blue-600"
                  />
                </div>
                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1">कुल अंक</label>
                  <input
                    type="number"
                    value={newPaper.totalMarks}
                    onChange={(e) => setNewPaper({ ...newPaper, totalMarks: Number(e.target.value) })}
                    className="w-full border border-slate-200 p-2.5 rounded-xl text-xs font-semibold focus:outline-none focus:border-blue-600"
                  />
                </div>
                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1">समय</label>
                  <input
                    type="number"
                    value={newPaper.durationMinutes}
                    onChange={(e) => setNewPaper({ ...newPaper, durationMinutes: Number(e.target.value) })}
                    className="w-full border border-slate-200 p-2.5 rounded-xl text-xs font-semibold focus:outline-none focus:border-blue-600"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">निर्देश</label>
                <input
                  type="text"
                  value={newPaper.instructionsHindi}
                  onChange={(e) => setNewPaper({ ...newPaper, instructionsHindi: e.target.value })}
                  className="w-full border border-slate-200 p-2.5 rounded-xl text-xs font-semibold focus:outline-none focus:border-blue-600"
                />
              </div>

              {/* Questions Setup */}
              <div className="space-y-3 bg-slate-50 p-4 rounded-2xl border border-slate-200">
                <h4 className="text-xs font-extrabold text-slate-800">प्रश्न 1 (बहुविकल्पीय प्रश्न):</h4>
                <input
                  type="text"
                  value={newPaper.q1Question}
                  onChange={(e) => setNewPaper({ ...newPaper, q1Question: e.target.value })}
                  placeholder="हिंदी में प्रश्न"
                  className="w-full border border-slate-200 p-2 rounded-lg text-xs bg-white"
                />
                <div className="grid grid-cols-2 gap-2">
                  <input
                    type="text"
                    value={newPaper.q1OptA}
                    onChange={(e) => setNewPaper({ ...newPaper, q1OptA: e.target.value })}
                    placeholder="विकल्प क"
                    className="border border-slate-200 p-2 rounded-lg text-xs bg-white"
                  />
                  <input
                    type="text"
                    value={newPaper.q1OptB}
                    onChange={(e) => setNewPaper({ ...newPaper, q1OptB: e.target.value })}
                    placeholder="विकल्प ख"
                    className="border border-slate-200 p-2 rounded-lg text-xs bg-white"
                  />
                  <input
                    type="text"
                    value={newPaper.q1OptC}
                    onChange={(e) => setNewPaper({ ...newPaper, q1OptC: e.target.value })}
                    placeholder="विकल्प ग"
                    className="border border-slate-200 p-2 rounded-lg text-xs bg-white"
                  />
                  <input
                    type="text"
                    value={newPaper.q1OptD}
                    onChange={(e) => setNewPaper({ ...newPaper, q1OptD: e.target.value })}
                    placeholder="विकल्प घ"
                    className="border border-slate-200 p-2 rounded-lg text-xs bg-white"
                  />
                </div>
              </div>

              <div className="pt-4 flex items-center justify-end gap-3">
                <button
                  type="button"
                  onClick={() => setShowPaperModal(false)}
                  className="px-5 py-2.5 rounded-xl font-bold text-xs text-slate-600 hover:bg-slate-100"
                >
                  रद्द करें
                </button>
                <button
                  type="submit"
                  disabled={loading}
                  className="px-6 py-2.5 bg-blue-600 hover:bg-blue-700 text-white rounded-xl font-extrabold text-xs shadow-md shadow-blue-600/20"
                >
                  {loading ? "बनाई जा रही है..." : "✓ पेपर तैयार करें"}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* ========================================================================= */}
      {/* MODAL 4: VIEW / PRINT PRACTICE PAPER MODAL */}
      {/* ========================================================================= */}
      {selectedPaperView && (
        <div className="fixed inset-0 bg-slate-900/50 backdrop-blur-xs flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-3xl max-w-2xl w-full p-8 shadow-2xl border border-slate-200 max-h-[90vh] overflow-y-auto space-y-6">
            <div className="flex items-center justify-between border-b border-slate-200 pb-4">
              <div>
                <span className="bg-blue-100 text-blue-800 text-[11px] font-bold px-3 py-0.5 rounded-full">
                  वाणीसेतु • अभ्यास पत्रक
                </span>
                <h3 className="text-2xl font-black text-slate-900 mt-1">{selectedPaperView.title}</h3>
              </div>
              <button
                onClick={() => setSelectedPaperView(null)}
                className="text-slate-400 hover:text-slate-600 text-2xl font-bold"
              >
                ×
              </button>
            </div>

            <div className="grid grid-cols-3 gap-3 bg-slate-50 p-4 rounded-2xl border border-slate-200 text-xs font-bold text-slate-700">
              <div>📚 कक्षा: {selectedPaperView.grade}</div>
              <div>⏱️ समय: {selectedPaperView.durationMinutes} मिनट</div>
              <div>🎯 कुल अंक: {selectedPaperView.totalMarks} अंक</div>
            </div>

            <div className="border border-slate-200 p-4 rounded-2xl bg-blue-50/40 text-xs">
              <p className="font-extrabold text-blue-900">निर्देश:</p>
              <p className="text-slate-800">{selectedPaperView.instructionsHindi}</p>
            </div>

            <div className="space-y-4">
              <h4 className="font-extrabold text-slate-900 text-sm uppercase tracking-wider">
                प्रश्नावली:
              </h4>
              {selectedPaperView.questions?.map((q: any, i: number) => (
                <div key={i} className="p-4 rounded-xl border border-slate-200 space-y-2 bg-white">
                  <div className="flex items-center justify-between text-xs font-extrabold">
                    <span className="text-blue-700">प्रश्न {q.qNum || i + 1} ({q.marks} अंक)</span>
                    <span className="text-slate-400 uppercase text-[10px]">
                      {q.type === "mcq" ? "बहुविकल्पीय" : q.type === "fill_blank" ? "रिक्त स्थान" : q.type === "oral" ? "मौखिक" : q.type}
                    </span>
                  </div>
                  <p className="text-sm font-bold text-slate-900">{q.questionHindi}</p>
                  {q.options && (
                    <div className="grid grid-cols-2 gap-2 pt-2">
                      {q.options.map((opt: string, optIdx: number) => (
                        <div key={optIdx} className="p-2 border border-slate-100 rounded-lg text-xs font-medium bg-slate-50">
                          ({String.fromCharCode(65 + optIdx)}) {opt}
                        </div>
                      ))}
                    </div>
                  )}
                </div>
              ))}
            </div>

            <div className="pt-4 border-t border-slate-100 flex items-center justify-between">
              <button
                onClick={() => window.print()}
                className="bg-blue-600 hover:bg-blue-700 text-white font-extrabold text-xs px-5 py-2.5 rounded-xl shadow-md flex items-center gap-2"
              >
                <span>🖨️</span>
                <span>प्रिंट करें</span>
              </button>
              <button
                onClick={() => setSelectedPaperView(null)}
                className="bg-slate-100 hover:bg-slate-200 text-slate-700 font-bold text-xs px-5 py-2.5 rounded-xl"
              >
                बंद करें
              </button>
            </div>
          </div>
        </div>
      )}

      {/* ========================================================================= */}
      {/* MODAL 5: VIEW CLASS NOTE DETAILS */}
      {/* ========================================================================= */}
      {selectedNoteView && (
        <div className="fixed inset-0 bg-slate-900/50 backdrop-blur-xs flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-3xl max-w-2xl w-full p-8 shadow-2xl border border-slate-200 max-h-[90vh] overflow-y-auto space-y-6">
            <div className="flex items-center justify-between border-b border-slate-200 pb-4">
              <div>
                <span className="bg-blue-100 text-blue-800 text-[11px] font-bold px-3 py-0.5 rounded-full">
                  📅 तारीख: {selectedNoteView.date}
                </span>
                <h3 className="text-2xl font-black text-slate-900 mt-1">{selectedNoteView.title}</h3>
              </div>
              <button
                onClick={() => setSelectedNoteView(null)}
                className="text-slate-400 hover:text-slate-600 text-2xl font-bold"
              >
                ×
              </button>
            </div>

            {selectedNoteView.teacherSummary && (
              <div className="p-4 bg-slate-50 rounded-2xl border border-slate-200">
                <h4 className="text-xs font-bold text-slate-500 uppercase tracking-wider mb-1">
                  शिक्षण सारांश:
                </h4>
                <p className="text-sm text-slate-800 leading-relaxed">{selectedNoteView.teacherSummary}</p>
              </div>
            )}

            {selectedNoteView.keyPoints && selectedNoteView.keyPoints.length > 0 && (
              <div>
                <h4 className="text-xs font-bold text-slate-500 uppercase tracking-wider mb-2">
                  मुख्य शिक्षण बिंदु:
                </h4>
                <ul className="list-disc list-inside space-y-1.5 text-sm text-slate-800">
                  {selectedNoteView.keyPoints.map((kp: string, idx: number) => (
                    <li key={idx}>{kp}</li>
                  ))}
                </ul>
              </div>
            )}

            {selectedNoteView.vocabulary && selectedNoteView.vocabulary.length > 0 && (
              <div>
                <h4 className="text-xs font-bold text-slate-500 uppercase tracking-wider mb-2">
                  महत्वपूर्ण अवधारणाएं / शब्दावली:
                </h4>
                <div className="space-y-2">
                  {selectedNoteView.vocabulary.map((v: any, idx: number) => (
                    <div key={idx} className="p-3 bg-blue-50/60 rounded-xl border border-blue-100 text-xs">
                      <div className="font-bold text-slate-900">{v.term || v.hindi}</div>
                      <div className="text-slate-700 mt-0.5">{v.meaning || v.phonetics}</div>
                    </div>
                  ))}
                </div>
              </div>
            )}

            <div className="pt-4 border-t border-slate-100 flex items-center justify-between">
              <button
                onClick={() => window.print()}
                className="bg-blue-600 hover:bg-blue-700 text-white font-extrabold text-xs px-5 py-2.5 rounded-xl shadow-md flex items-center gap-2"
              >
                <span>🖨️</span>
                <span>प्रिंट करें</span>
              </button>
              <button
                onClick={() => setSelectedNoteView(null)}
                className="bg-slate-100 hover:bg-slate-200 text-slate-700 font-bold text-xs px-5 py-2.5 rounded-xl"
              >
                बंद करें
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
