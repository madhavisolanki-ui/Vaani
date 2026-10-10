import { useState, useEffect } from "react";
import axios from "axios";

const API = "http://localhost:4000/api";

export default function TeacherWorksheets() {
  const [activeTab, setActiveTab] = useState<"studio" | "submissions">("studio");

  // Studio Generator State
  const [topics, setTopics] = useState<any[]>([]);
  const [selectedTopic, setSelectedTopic] = useState("");
  const [grade, setGrade] = useState("कक्षा 1");
  const [targetLang, setTargetLang] = useState("san");
  const [generating, setGenerating] = useState(false);
  const [worksheet, setWorksheet] = useState<any>(null);

  // Custom Upload State
  const [isCustomMode, setIsCustomMode] = useState(false);
  const [customTitle, setCustomTitle] = useState("");
  const [customGrade, setCustomGrade] = useState("कक्षा 1");
  const [customSubject, setCustomSubject] = useState("गणित (संख्या ज्ञान)");
  const [customLang, setCustomLang] = useState("mun");
  const [customTotalMarks, setCustomTotalMarks] = useState(10);
  const [customInstructions, setCustomInstructions] = useState("चित्र गिनें, अपनी स्लेट या टैबलेट पर ड्रॉइंग बनाएं और उत्तर बताएं।");
  const [customQ1Prompt, setCustomQ1Prompt] = useState("यहाँ कितने फल हैं? 🍎🍎🍎 गिनकर संख्या लिखो और चित्र बनाओ।");
  const [customQ1Hint, setCustomQ1Hint] = useState("🍎🍎🍎");
  const [customQ2Prompt, setCustomQ2Prompt] = useState("आम 🥭 का चित्र देखकर अपनी मातृभाषा में नाम बोलो।");
  const [customQ2Hint, setCustomQ2Hint] = useState("🥭");
  const [uploadingCustom, setUploadingCustom] = useState(false);

  // Submissions & Review State
  const [submissions, setSubmissions] = useState<any[]>([]);
  const [submissionFilter, setSubmissionFilter] = useState<"all" | "pending" | "reviewed">("all");
  const [loadingSubmissions, setLoadingSubmissions] = useState(false);
  const [reviewMarks, setReviewMarks] = useState<Record<string, number>>({});
  const [reviewFeedback, setReviewFeedback] = useState<Record<string, string>>({});
  const [gradingId, setGradingId] = useState<string | null>(null);

  useEffect(() => {
    fetchTopics();
    fetchSubmissions();
  }, []);

  const fetchTopics = async () => {
    try {
      const res = await axios.get(`${API}/curriculum/topics`);
      setTopics(res.data.topics || []);
      if (res.data.topics?.length > 0) {
        setSelectedTopic(res.data.topics[0].name);
      }
    } catch (err) {
      console.error("विषय प्राप्त करने में त्रुटि", err);
    }
  };

  const fetchSubmissions = async () => {
    setLoadingSubmissions(true);
    try {
      const res = await axios.get(`${API}/worksheets/submissions`);
      setSubmissions(res.data.submissions || []);
    } catch (err) {
      console.error("सबमिशन प्राप्त करने में त्रुटि", err);
    } finally {
      setLoadingSubmissions(false);
    }
  };

  const handleGenerate = async () => {
    if (!selectedTopic) return;
    setGenerating(true);

    try {
      const res = await axios.post(`${API}/worksheets/generate`, {
        topic: selectedTopic,
        grade,
        targetLang,
      });
      setWorksheet(res.data.worksheet);
    } catch (err) {
      console.error("कार्यपत्रक जनरेट करने में त्रुटि", err);
      alert("कार्यपत्रक जनरेट करने में त्रुटि");
    } finally {
      setGenerating(false);
    }
  };

  const handleCreateCustom = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!customTitle.trim()) {
      alert("कृपया कार्यपत्रक का शीर्षक दर्ज करें।");
      return;
    }
    setUploadingCustom(true);
    try {
      const res = await axios.post(`${API}/worksheets/custom`, {
        titleHindi: customTitle.trim(),
        grade: customGrade,
        subject: customSubject,
        targetLang: customLang,
        totalMarks: customTotalMarks,
        instructionsHindi: customInstructions.trim(),
        questions: [
          { promptHindi: customQ1Prompt.trim(), imageHint: customQ1Hint.trim() },
          { promptHindi: customQ2Prompt.trim(), imageHint: customQ2Hint.trim() },
        ],
      });
      alert("कार्यपत्रक सफलतापूर्वक अपलोड व अनुवादित हो गया! यह " + customGrade + " के विद्यार्थियों को दिखाई देगा।");
      setWorksheet(res.data.worksheet);
      setIsCustomMode(false);
    } catch (err) {
      console.error("कस्टम कार्यपत्रक बनाने में त्रुटि", err);
      alert("कस्टम कार्यपत्रक बनाने में त्रुटि हुई।");
    } finally {
      setUploadingCustom(false);
    }
  };

  const handleOpenPdf = () => {
    if (!worksheet?.id) return;
    window.open(`${API}/worksheets/${worksheet.id}/html`, "_blank");
  };

  const handleGradeSubmission = async (subId: string, totalMarks: number) => {
    const marks = reviewMarks[subId] !== undefined ? reviewMarks[subId] : totalMarks;
    const feedback = reviewFeedback[subId] || "बहुत बढ़िया! सुंदर चित्र और सही उत्तर।";
    setGradingId(subId);

    try {
      const res = await axios.post(`${API}/worksheets/review`, {
        submissionId: subId,
        marksObtained: marks,
        teacherFeedback: feedback,
      });
      alert(`मूल्यांकन दर्ज हुआ! छात्र को ${res.data.submission.starsEarned} ⭐ सितारे प्राप्त हुए।`);
      fetchSubmissions();
    } catch (err) {
      console.error("मूल्यांकन दर्ज करने में त्रुटि", err);
      alert("मूल्यांकन दर्ज करने में त्रुटि हुई।");
    } finally {
      setGradingId(null);
    }
  };

  const filteredSubmissions = submissions.filter((s) => {
    if (submissionFilter === "pending") return s.status === "pending";
    if (submissionFilter === "reviewed") return s.status === "reviewed";
    return true;
  });

  return (
    <div className="p-6 sm:p-8 bg-[#F8FAFC] min-h-full space-y-6 font-sans max-w-6xl mx-auto">
      {/* 1. Header Banner */}
      <div
        className="rounded-3xl p-6 sm:p-8 text-[#FFFFFF] shadow-xl shadow-blue-900/10 relative overflow-hidden"
        style={{
          background: "linear-gradient(135deg, #2563EB 0%, #7C3AED 100%)",
        }}
      >
        <div className="relative z-10 flex flex-col md:flex-row md:items-center justify-between gap-6">
          <div className="space-y-3 max-w-3xl">
            <div className="flex flex-wrap items-center gap-2">
              <span
                className="text-xs font-bold text-white px-3 py-1 rounded-full backdrop-blur-md shadow-xs border border-white/20"
                style={{ backgroundColor: "rgba(255, 255, 255, 0.2)" }}
              >
                🎯 निपुण भारत मिशन • FLN कार्यपत्रक वर्कफ़्लो
              </span>
              <span
                className="text-xs font-bold text-white px-3 py-1 rounded-full backdrop-blur-md shadow-xs border border-white/20"
                style={{ backgroundColor: "rgba(255, 255, 255, 0.2)" }}
              >
                🔄 ऑटो अनुवाद एवं रिवर्स हिंदी समीक्षा
              </span>
            </div>

            <div className="flex items-center gap-3.5">
              <div
                className="w-12 h-12 rounded-2xl flex items-center justify-center text-2xl shadow-inner border border-white/30 backdrop-blur-md shrink-0"
                style={{ backgroundColor: "rgba(255, 255, 255, 0.2)" }}
              >
                📝
              </div>
              <h1 className="text-2xl sm:text-3xl font-black text-white tracking-tight">
                द्विभाषी अभ्यास पत्रक स्टूडियो एवं समीक्षा
              </h1>
            </div>

            <p className="text-blue-50/90 text-xs sm:text-sm font-medium leading-relaxed">
              हिंदी में वर्कशीट बनाएं/अपलोड करें, छात्रों द्वारा मातृभाषा में हल किए गए सोल्यूशन की एआई रिवर्स हिंदी अनुवाद में समीक्षा करें और अंक प्रदान करें।
            </p>
          </div>
        </div>
      </div>

      {/* 2. Main Tab Navigation (Rounded Pill Tabs) */}
      <div className="flex flex-wrap items-center justify-between gap-4">
        <div className="bg-white p-1.5 rounded-full border border-[#E2E8F0] shadow-xs inline-flex items-center gap-2">
          <button
            onClick={() => setActiveTab("studio")}
            className={`px-5 py-2.5 rounded-full text-xs font-black transition-all duration-200 cursor-pointer flex items-center gap-2 ${
              activeTab === "studio"
                ? "bg-blue-600 text-white shadow-md shadow-blue-500/20"
                : "text-slate-600 hover:text-slate-900 hover:bg-slate-50"
            }`}
          >
            <span>✨ कार्यपत्रक बनाएं व अपलोड करें</span>
          </button>
          <button
            onClick={() => {
              setActiveTab("submissions");
              fetchSubmissions();
            }}
            className={`px-5 py-2.5 rounded-full text-xs font-black transition-all duration-200 cursor-pointer flex items-center gap-2 ${
              activeTab === "submissions"
                ? "bg-blue-600 text-white shadow-md shadow-blue-500/20"
                : "text-slate-600 hover:text-slate-900 hover:bg-slate-50"
            }`}
          >
            <span>📊 छात्र सबमिशन एवं मूल्यांकन</span>
            <span className="bg-rose-100 text-rose-700 border border-rose-200 text-[10px] px-2 py-0.5 rounded-full font-black flex items-center gap-1">
              <span>🔴</span>
              <span>
                {submissions.filter((s) => s.status === "pending").length > 0
                  ? submissions.filter((s) => s.status === "pending").length
                  : 3}
              </span>
            </span>
          </button>
        </div>

        {activeTab === "studio" && (
          <div className="bg-white p-1 rounded-full border border-[#E2E8F0] shadow-xs inline-flex items-center text-xs">
            <button
              onClick={() => setIsCustomMode(false)}
              className={`px-4 py-1.5 rounded-full font-bold transition cursor-pointer ${
                !isCustomMode
                  ? "bg-indigo-50 text-indigo-700 font-black border border-indigo-200"
                  : "text-slate-600 hover:text-slate-900"
              }`}
            >
              🤖 एआई ऑटो-जनरेटर
            </button>
            <button
              onClick={() => setIsCustomMode(true)}
              className={`px-4 py-1.5 rounded-full font-bold transition cursor-pointer ${
                isCustomMode
                  ? "bg-indigo-50 text-indigo-700 font-black border border-indigo-200"
                  : "text-slate-600 hover:text-slate-900"
              }`}
            >
              📤 कस्टम अपलोड
            </button>
          </div>
        )}
      </div>

      {/* TAB 1: WORK SHEET STUDIO & UPLOAD */}
      {activeTab === "studio" && (
        <div className="space-y-6">
          {!isCustomMode ? (
            /* 3. Form Container: Crisp White Card (#FFFFFF) with subtle border (#E2E8F0) */
            <div className="bg-[#FFFFFF] p-6 sm:p-8 rounded-2xl shadow-sm border border-[#E2E8F0] space-y-6">
              <div className="flex items-center justify-between border-b border-[#F1F5F9] pb-4">
                <div>
                  <h2 className="text-sm font-black text-slate-800 uppercase tracking-wider flex items-center gap-2">
                    <span className="w-2.5 h-2.5 rounded-full bg-indigo-600"></span>
                    निपुण भारत FLN लक्ष्य एवं भाषा चयन
                  </h2>
                  <p className="text-xs text-slate-500 mt-0.5">
                    कक्षा, विषय व भाषा चुनें - एआई स्वतः द्विभाषी अभ्यास पत्रक तैयार करेगा
                  </p>
                </div>
                <span className="text-xs font-bold text-indigo-600 bg-indigo-50 border border-indigo-100 px-3 py-1 rounded-full">
                  चरण 1 से 3
                </span>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-2 uppercase tracking-wider">
                    1. विषय और दक्षता चुनें
                  </label>
                  <select
                    className="w-full border border-[#E2E8F0] p-3.5 rounded-xl focus:border-indigo-600 focus:ring-2 focus:ring-indigo-100 focus:outline-none bg-[#FFFFFF] text-sm font-semibold text-slate-800 transition shadow-2xs cursor-pointer hover:border-slate-300"
                    value={selectedTopic}
                    onChange={(e) => setSelectedTopic(e.target.value)}
                  >
                    {topics.map((topic) => (
                      <option key={topic.id} value={topic.name}>
                        {topic.name} ({topic.grade})
                      </option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-2 uppercase tracking-wider">
                    2. कक्षा
                  </label>
                  <select
                    className="w-full border border-[#E2E8F0] p-3.5 rounded-xl focus:border-indigo-600 focus:ring-2 focus:ring-indigo-100 focus:outline-none bg-[#FFFFFF] text-sm font-semibold text-slate-800 transition shadow-2xs cursor-pointer hover:border-slate-300"
                    value={grade}
                    onChange={(e) => setGrade(e.target.value)}
                  >
                    <option value="कक्षा 1">कक्षा 1</option>
                    <option value="कक्षा 2">कक्षा 2</option>
                  </select>
                </div>

                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-2 uppercase tracking-wider">
                    3. स्थानीय मातृभाषा
                  </label>
                  <select
                    className="w-full border border-[#E2E8F0] p-3.5 rounded-xl focus:border-indigo-600 focus:ring-2 focus:ring-indigo-100 focus:outline-none bg-[#FFFFFF] text-sm font-semibold text-slate-800 transition shadow-2xs cursor-pointer hover:border-slate-300"
                    value={targetLang}
                    onChange={(e) => setTargetLang(e.target.value)}
                  >
                    <option value="san">संथाली (ᱥᱟᱱᱛᱟᱲᱤ)</option>
                    <option value="ho">हो (ᱦᱳ)</option>
                    <option value="mun">मुंडारी (ᱢᱩᱱᱰᱟᱨᱤ)</option>
                  </select>
                </div>
              </div>

              {/* 4. CTA Button: Sleek Indigo-to-Violet gradient button (#4F46E5 ➔ #7C3AED) with hover elevate animation */}
              <button
                onClick={handleGenerate}
                disabled={generating || !selectedTopic}
                className="w-full bg-gradient-to-r from-[#4F46E5] to-[#7C3AED] hover:from-[#4338CA] hover:to-[#6D28D9] text-white py-4 rounded-xl font-black text-sm shadow-md shadow-indigo-500/25 transition-all duration-200 hover:-translate-y-0.5 hover:shadow-lg disabled:opacity-50 disabled:hover:translate-y-0 disabled:hover:shadow-md flex items-center justify-center gap-2 cursor-pointer active:scale-[0.99]"
              >
                {generating ? (
                  <>
                    <span className="animate-spin text-base">⏳</span>
                    <span>निपुण भारत वर्कशीट जनरेट हो रही है...</span>
                  </>
                ) : (
                  <>
                    <span>✨</span>
                    <span>निपुण भारत वर्कशीट ऑटो-जनरेट करें</span>
                  </>
                )}
              </button>
            </div>
          ) : (
            /* Custom Teacher Upload Form */
            <form onSubmit={handleCreateCustom} className="bg-[#FFFFFF] p-6 sm:p-8 rounded-2xl shadow-sm border border-[#E2E8F0] space-y-6">
              <div className="border-b border-[#F1F5F9] pb-4">
                <h2 className="text-sm font-black text-slate-800 uppercase tracking-wider flex items-center gap-2 mb-1">
                  <span className="w-2.5 h-2.5 rounded-full bg-indigo-600"></span>
                  शिक्षक कस्टम अभ्यास पत्रक अपलोड
                </h2>
                <p className="text-xs text-slate-500">
                  शिक्षक हिंदी में शीर्षक, निर्देश और प्रश्न दर्ज करें। एआई इंजन छात्र की मातृभाषा में इसका स्वतः अनुवाद कर ऑडियो व चित्र संकेतों के साथ प्रकाशित करेगा।
                </p>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-4 gap-5">
                <div className="md:col-span-2">
                  <label className="block text-xs font-bold text-slate-700 mb-2 uppercase tracking-wider">
                    कार्यपत्रक का शीर्षक (हिंदी में) *
                  </label>
                  <input
                    type="text"
                    required
                    placeholder="उदा. गिनती 1 से 5 और फलों के नाम"
                    value={customTitle}
                    onChange={(e) => setCustomTitle(e.target.value)}
                    className="w-full border border-[#E2E8F0] p-3.5 rounded-xl bg-[#FFFFFF] text-sm font-semibold text-slate-800 focus:outline-none focus:border-indigo-600 focus:ring-2 focus:ring-indigo-100 transition shadow-2xs hover:border-slate-300"
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-2 uppercase tracking-wider">
                    कक्षा चुनें *
                  </label>
                  <select
                    value={customGrade}
                    onChange={(e) => setCustomGrade(e.target.value)}
                    className="w-full border border-[#E2E8F0] p-3.5 rounded-xl bg-[#FFFFFF] text-sm font-semibold text-slate-800 focus:outline-none focus:border-indigo-600 focus:ring-2 focus:ring-indigo-100 transition shadow-2xs cursor-pointer hover:border-slate-300"
                  >
                    <option value="कक्षा 1">कक्षा 1</option>
                    <option value="कक्षा 2">कक्षा 2</option>
                  </select>
                </div>

                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-2 uppercase tracking-wider">
                    लक्षित मातृभाषा *
                  </label>
                  <select
                    value={customLang}
                    onChange={(e) => setCustomLang(e.target.value)}
                    className="w-full border border-[#E2E8F0] p-3.5 rounded-xl bg-[#FFFFFF] text-sm font-semibold text-slate-800 focus:outline-none focus:border-indigo-600 focus:ring-2 focus:ring-indigo-100 transition shadow-2xs cursor-pointer hover:border-slate-300"
                  >
                    <option value="mun">मुंडारी (ᱢᱩᱱᱰᱟᱨᱤ)</option>
                    <option value="san">संथाली (ᱥᱟᱱᱛᱟᱲᱤ)</option>
                    <option value="ho">हो (ᱦᱳ)</option>
                  </select>
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-2 uppercase tracking-wider">
                    विषय *
                  </label>
                  <input
                    type="text"
                    value={customSubject}
                    onChange={(e) => setCustomSubject(e.target.value)}
                    className="w-full border border-[#E2E8F0] p-3.5 rounded-xl bg-[#FFFFFF] text-sm font-semibold text-slate-800 focus:outline-none focus:border-indigo-600 focus:ring-2 focus:ring-indigo-100 transition shadow-2xs hover:border-slate-300"
                    placeholder="गणित / भाषा / पर्यावरण"
                  />
                </div>
                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-2 uppercase tracking-wider">
                    पूर्णांक (कुल अंक) *
                  </label>
                  <input
                    type="number"
                    min={5}
                    max={50}
                    value={customTotalMarks}
                    onChange={(e) => setCustomTotalMarks(Number(e.target.value))}
                    className="w-full border border-[#E2E8F0] p-3.5 rounded-xl bg-[#FFFFFF] text-sm font-semibold text-slate-800 focus:outline-none focus:border-indigo-600 focus:ring-2 focus:ring-indigo-100 transition shadow-2xs hover:border-slate-300"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 mb-2 uppercase tracking-wider">
                  विद्यार्थी के लिए निर्देश (हिंदी में) *
                </label>
                <textarea
                  rows={2}
                  value={customInstructions}
                  onChange={(e) => setCustomInstructions(e.target.value)}
                  className="w-full border border-[#E2E8F0] p-3.5 rounded-xl bg-[#FFFFFF] text-sm font-semibold text-slate-800 focus:outline-none focus:border-indigo-600 focus:ring-2 focus:ring-indigo-100 transition shadow-2xs hover:border-slate-300"
                  placeholder="उदा. चित्र गिनें, स्लेट या टैबलेट पर ड्रॉइंग बनाएं और उत्तर बताएं।"
                />
              </div>

              {/* Questions Section */}
              <div className="space-y-4 bg-slate-50/70 p-5 rounded-xl border border-[#E2E8F0]">
                <h3 className="text-xs font-black text-slate-800 uppercase tracking-wider">
                  अभ्यास प्रश्न (हिंदी में प्रविष्ट करें, एआई स्वतः मातृभाषा में बदलेगा)
                </h3>

                <div className="grid grid-cols-1 md:grid-cols-4 gap-3">
                  <div className="md:col-span-3">
                    <label className="block text-[11px] font-bold text-slate-600 mb-1">प्रश्न १:</label>
                    <input
                      type="text"
                      value={customQ1Prompt}
                      onChange={(e) => setCustomQ1Prompt(e.target.value)}
                      className="w-full border border-[#E2E8F0] p-2.5 rounded-lg text-xs font-semibold text-slate-800 bg-white"
                    />
                  </div>
                  <div>
                    <label className="block text-[11px] font-bold text-slate-600 mb-1">चित्र/इमोजी संकेत:</label>
                    <input
                      type="text"
                      value={customQ1Hint}
                      onChange={(e) => setCustomQ1Hint(e.target.value)}
                      className="w-full border border-[#E2E8F0] p-2.5 rounded-lg text-xs font-semibold text-slate-800 text-center text-lg bg-white"
                    />
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-4 gap-3 pt-3 border-t border-slate-200">
                  <div className="md:col-span-3">
                    <label className="block text-[11px] font-bold text-slate-600 mb-1">प्रश्न २:</label>
                    <input
                      type="text"
                      value={customQ2Prompt}
                      onChange={(e) => setCustomQ2Prompt(e.target.value)}
                      className="w-full border border-[#E2E8F0] p-2.5 rounded-lg text-xs font-semibold text-slate-800 bg-white"
                    />
                  </div>
                  <div>
                    <label className="block text-[11px] font-bold text-slate-600 mb-1">चित्र/इमोजी संकेत:</label>
                    <input
                      type="text"
                      value={customQ2Hint}
                      onChange={(e) => setCustomQ2Hint(e.target.value)}
                      className="w-full border border-[#E2E8F0] p-2.5 rounded-lg text-xs font-semibold text-slate-800 text-center text-lg bg-white"
                    />
                  </div>
                </div>
              </div>

              <button
                type="submit"
                disabled={uploadingCustom}
                className="w-full bg-gradient-to-r from-[#4F46E5] to-[#7C3AED] hover:from-[#4338CA] hover:to-[#6D28D9] text-white py-4 rounded-xl font-black text-sm shadow-md shadow-indigo-500/25 transition-all duration-200 hover:-translate-y-0.5 hover:shadow-lg disabled:opacity-50 disabled:hover:translate-y-0 disabled:hover:shadow-md flex items-center justify-center gap-2 cursor-pointer active:scale-[0.99]"
              >
                {uploadingCustom ? "ऑटो-अनुवाद व प्रकाशन हो रहा है..." : "📤 प्रकाशित करें एवं छात्रों के डैशबोर्ड पर भेजें"}
              </button>
            </form>
          )}

          {/* Worksheet Preview Card */}
          {worksheet && (
            <div className="bg-[#EEF2FF] p-6 sm:p-8 rounded-[16px] shadow-2xs border border-[#C7D2FE] space-y-6">
              <div className="flex flex-wrap items-center justify-between gap-4 border-b border-[#C7D2FE] pb-5">
                <div>
                  <div className="flex items-center gap-2 mb-2">
                    <span className="text-xs font-black text-blue-700 bg-white border border-[#C7D2FE] px-3 py-1 rounded-full uppercase tracking-wider shadow-2xs">
                      🎯 निपुण परिणाम: {worksheet.nipunCompetencyCode || "संख्या ज्ञान-1.1"}
                    </span>
                    <span className="text-xs font-bold text-slate-600 bg-white border border-[#C7D2FE] px-3 py-1 rounded-full shadow-2xs">
                      {worksheet.nipunDomain}
                    </span>
                  </div>
                  <h2 className="text-2xl font-black text-slate-900 mt-1">
                    {worksheet.titleHindi}
                  </h2>
                  <p className="text-sm font-bold text-blue-700 mt-0.5">
                    {worksheet.titleTribal}
                  </p>
                </div>

                <button
                  onClick={handleOpenPdf}
                  className="bg-blue-600 hover:bg-blue-700 text-white px-6 py-3 rounded-xl font-bold text-xs shadow-md shadow-blue-600/25 flex items-center gap-2 transition transform active:scale-95"
                >
                  <span>🖨️</span> आधिकारिक कार्यपत्रक प्रिंट करें / सहेजें
                </button>
              </div>

              {/* NIPUN Bharat Learning Lakshya Box */}
              <div className="bg-white p-5 rounded-[12px] border border-[#C7D2FE] shadow-2xs space-y-2">
                <h3 className="text-xs font-black text-blue-900 uppercase tracking-wider flex items-center gap-1.5">
                  <span>🎯</span> निपुण भारत सीखने का प्रतिफल:
                </h3>
                <p className="text-xs text-slate-800 font-semibold">
                  📘 <strong>हिंदी:</strong> {worksheet.nipunLakshyaHindi}
                </p>
                <p className="text-xs text-blue-800 font-bold">
                  🌾 <strong>{worksheet.targetLangName}:</strong> {worksheet.nipunLakshyaTribal}
                </p>
              </div>

              {/* Metadata Banner */}
              <div className="bg-white p-4 rounded-xl border border-[#C7D2FE] shadow-2xs flex flex-wrap justify-between text-xs font-bold text-slate-700 gap-2">
                <div>📚 विषय: {worksheet.subject}</div>
                <div>🎒 कक्षा: {worksheet.grade}</div>
                <div>🌾 भाषा: {worksheet.targetLangName}</div>
                <div>🏆 कुल अंक: {worksheet.totalMarks} अंक</div>
              </div>

              {/* Sections List */}
              <div className="space-y-5">
                {worksheet.sections?.map((section: any, idx: number) => (
                  <div
                    key={idx}
                    className="border border-[#C7D2FE] rounded-[16px] p-6 bg-white shadow-2xs space-y-4"
                  >
                    <div className="border-b border-slate-100 pb-3">
                      <h3 className="text-base font-extrabold text-slate-900">
                        {section.sectionTitleHindi}
                      </h3>
                      <h4 className="text-xs font-bold text-blue-700 mt-0.5">
                        {section.sectionTitleTribal}
                      </h4>
                    </div>

                    <div className="space-y-3">
                      {section.questions?.map((q: any) => (
                        <div
                          key={q.qNum}
                          className="p-4 rounded-xl bg-[#EEF2FF]/60 border border-[#C7D2FE] flex items-center justify-between"
                        >
                          <div className="space-y-1">
                            <p className="text-sm font-bold text-slate-800 flex items-center gap-2">
                              <span>{q.qNum}. {q.promptHindi}</span>
                              {q.imageHint && <span className="text-xl">{q.imageHint}</span>}
                            </p>
                            <p className="text-xs font-bold text-blue-700">
                              🌾 {q.promptTribal}
                            </p>
                          </div>

                          <div className="w-36 border-b-2 border-[#C7D2FE] h-6"></div>
                        </div>
                      ))}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>
      )}

      {/* TAB 2: STUDENT SUBMISSIONS & EVALUATION */}
      {activeTab === "submissions" && (
        <div className="space-y-6">
          {/* Submissions Filter & Stats Bar */}
          <div className="bg-[#EEF2FF] p-5 rounded-[16px] border border-[#C7D2FE] shadow-2xs flex flex-wrap items-center justify-between gap-4">
            <div>
              <h2 className="text-base font-black text-slate-900">
                📥 प्राप्त छात्र समाधान एवं उत्तर पुस्तिकाएं
              </h2>
              <p className="text-xs text-slate-600 mt-0.5">
                छात्रों द्वारा टैबलेट ड्रॉइंग, फोटो व वॉयस नोट के माध्यम से भेजे गए उत्तरों का एआई रिवर्स हिंदी अनुवाद देखें और अंक दर्ज करें।
              </p>
            </div>

            <div className="flex items-center gap-2">
              <button
                onClick={() => setSubmissionFilter("all")}
                className={`px-3 py-1.5 rounded-lg text-xs font-bold transition ${
                  submissionFilter === "all" ? "bg-blue-600 text-white" : "bg-white text-slate-700 border border-[#C7D2FE]"
                }`}
              >
                सभी ({submissions.length})
              </button>
              <button
                onClick={() => setSubmissionFilter("pending")}
                className={`px-3 py-1.5 rounded-lg text-xs font-bold transition ${
                  submissionFilter === "pending" ? "bg-amber-600 text-white" : "bg-white text-slate-700 border border-[#C7D2FE]"
                }`}
              >
                लंबित समीक्षा ({submissions.filter((s) => s.status === "pending").length})
              </button>
              <button
                onClick={() => setSubmissionFilter("reviewed")}
                className={`px-3 py-1.5 rounded-lg text-xs font-bold transition ${
                  submissionFilter === "reviewed" ? "bg-emerald-600 text-white" : "bg-white text-slate-700 border border-[#C7D2FE]"
                }`}
              >
                मूल्यांकित ({submissions.filter((s) => s.status === "reviewed").length})
              </button>
            </div>
          </div>

          {/* Submissions Cards List */}
          {loadingSubmissions ? (
            <div className="p-8 text-center bg-[#EEF2FF] rounded-[16px] border border-[#C7D2FE]">
              <p className="text-xs font-bold text-slate-600">सबमिशन लोड हो रहे हैं...</p>
            </div>
          ) : filteredSubmissions.length === 0 ? (
            <div className="p-12 text-center bg-[#EEF2FF] rounded-[16px] border border-[#C7D2FE] space-y-2">
              <span className="text-4xl">📭</span>
              <h3 className="text-sm font-black text-slate-800">कोई सबमिशन उपलब्ध नहीं है</h3>
              <p className="text-xs text-slate-600">
                जब छात्र अपने डैशबोर्ड पर वर्कशीट हल कर जमा करेंगे, उनके उत्तर यहाँ दिखाई देंगे।
              </p>
            </div>
          ) : (
            <div className="space-y-6">
              {filteredSubmissions.map((sub) => {
                const isPending = sub.status === "pending";
                const currentMarkInput = reviewMarks[sub.id] !== undefined ? reviewMarks[sub.id] : (sub.marksObtained !== null ? sub.marksObtained : sub.totalMarks);

                return (
                  <div
                    key={sub.id}
                    className="bg-white p-6 rounded-[16px] border border-[#C7D2FE] shadow-2xs space-y-5"
                  >
                    {/* Header info */}
                    <div className="flex flex-wrap items-center justify-between gap-3 border-b border-slate-100 pb-4">
                      <div>
                        <div className="flex items-center gap-2 mb-1">
                          <span className="bg-[#EEF2FF] text-blue-800 border border-[#C7D2FE] text-xs font-black px-3 py-0.5 rounded-full">
                            👤 {sub.studentName}
                          </span>
                          <span className="bg-white text-slate-700 border border-[#C7D2FE] text-xs font-bold px-2.5 py-0.5 rounded-full">
                            🎒 {sub.studentGrade}
                          </span>
                          <span className="bg-white text-blue-700 border border-[#C7D2FE] text-xs font-bold px-2.5 py-0.5 rounded-full">
                            🌐 {sub.targetLangName}
                          </span>
                        </div>
                        <h3 className="text-base font-black text-slate-900 mt-1">
                          {sub.worksheetTitleHindi}
                        </h3>
                        {sub.worksheetTitleTribal && (
                          <p className="text-xs font-bold text-blue-700">
                            {sub.worksheetTitleTribal}
                          </p>
                        )}
                      </div>

                      <div className="text-right">
                        {isPending ? (
                          <span className="bg-amber-100 text-amber-900 border border-amber-300 text-xs font-extrabold px-3 py-1 rounded-full inline-block">
                            🟡 समीक्षा लंबित
                          </span>
                        ) : (
                          <span className="bg-emerald-100 text-emerald-900 border border-emerald-300 text-xs font-extrabold px-3 py-1 rounded-full inline-block">
                            🟢 मूल्यांकित ({sub.marksObtained} / {sub.totalMarks} अंक • +{sub.starsEarned} ⭐)
                          </span>
                        )}
                        <p className="text-[11px] text-slate-600 mt-1">
                          जमा दिनांक: {new Date(sub.submittedAt).toLocaleDateString("hi-IN")}
                        </p>
                      </div>
                    </div>

                    {/* Solution Preview Grid */}
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                      {/* Left: Solution Artifact (Drawing, Photo or Audio) */}
                      <div className="bg-[#EEF2FF] p-4 rounded-xl border border-[#C7D2FE] space-y-3">
                        <div className="flex items-center justify-between">
                          <span className="text-xs font-bold text-blue-900 flex items-center gap-1.5">
                            {sub.submissionType === "drawing" && "🎨 डिजिटल टैबलेट ड्रॉइंग"}
                            {sub.submissionType === "photo" && "📷 स्लेट/कॉपी की फोटो"}
                            {sub.submissionType === "audio" && "🎙️ वॉयस नोट / मौखिक उत्तर"}
                            {sub.submissionType === "written" && "✏️ लिखित उत्तर"}
                          </span>
                          <span className="text-[10px] bg-white text-slate-600 px-2 py-0.5 rounded-md border border-[#C7D2FE] font-bold">
                            छात्र सबमिशन
                          </span>
                        </div>

                        {/* Artifact Display */}
                        {sub.solutionData && (sub.submissionType === "drawing" || sub.submissionType === "photo") ? (
                          <div className="bg-white p-2 rounded-lg border border-[#C7D2FE] flex items-center justify-center min-h-[160px] overflow-hidden">
                            <img
                              src={sub.solutionData}
                              alt="छात्र का समाधान"
                              className="max-h-56 max-w-full object-contain rounded"
                            />
                          </div>
                        ) : sub.solutionData && sub.submissionType === "audio" ? (
                          <div className="bg-white p-4 rounded-lg border border-[#C7D2FE] space-y-2 text-center">
                            <audio controls src={sub.solutionData} className="w-full h-10" />
                            <p className="text-xs text-blue-700 font-bold">छात्र द्वारा रिकॉर्ड की गई ऑडियो क्लिप</p>
                          </div>
                        ) : (
                          <div className="bg-white p-4 rounded-lg border border-[#C7D2FE] text-xs font-bold text-slate-700">
                            {sub.solutionTribalText}
                          </div>
                        )}

                        {/* Student Original Tribal Explanation */}
                        {sub.solutionTribalText && (
                          <div className="bg-white p-3 rounded-lg border border-[#C7D2FE] text-xs">
                            <strong className="text-slate-800 block mb-0.5">🌾 छात्र का मूल कथन (मातृभाषा):</strong>
                            <p className="text-blue-900 font-semibold">{sub.solutionTribalText}</p>
                          </div>
                        )}
                      </div>

                      {/* Right: AI Reverse Hindi Translation & Grading */}
                      <div className="space-y-4">
                        {/* AI Reverse Translation Box */}
                        <div className="bg-blue-50/80 p-4 rounded-xl border border-blue-200 space-y-2">
                          <div className="flex items-center gap-1.5">
                            <span className="text-base">🤖</span>
                            <span className="text-xs font-black text-blue-900 uppercase tracking-wider">
                              एआई स्वतः हिंदी अनुवाद:
                            </span>
                          </div>
                          <p className="text-xs font-bold text-slate-800 bg-white p-3 rounded-lg border border-blue-100 leading-relaxed shadow-2xs">
                            {sub.solutionHindiTranslated || "एआई अनुवाद प्रक्रिया में है..."}
                          </p>
                          <p className="text-[10px] text-blue-800/70 font-semibold">
                            ✓ छात्र के मातृभाषा उत्तर को शिक्षक की समझ हेतु हिंदी में अनुवादित किया गया है।
                          </p>
                        </div>

                        {/* Grading Form / Reviewed Result */}
                        {isPending ? (
                          <div className="bg-[#EEF2FF] p-4 rounded-xl border border-[#C7D2FE] space-y-3">
                            <h4 className="text-xs font-black text-slate-900 uppercase tracking-wider">
                              शिक्षक मूल्यांकन एवं अंक प्रविष्टि:
                            </h4>

                            <div className="flex items-center gap-3">
                              <label className="text-xs font-bold text-slate-700">
                                अंक दर्ज करें (पूर्णांक {sub.totalMarks}):
                              </label>
                              <input
                                type="number"
                                min={0}
                                max={sub.totalMarks}
                                value={currentMarkInput}
                                onChange={(e) =>
                                  setReviewMarks((prev) => ({
                                    ...prev,
                                    [sub.id]: Number(e.target.value),
                                  }))
                                }
                                className="w-20 bg-white border border-[#C7D2FE] p-2 rounded-lg text-sm font-black text-blue-900 text-center"
                              />
                              <span className="text-xs font-bold text-slate-600">अंक</span>
                            </div>

                            {/* Quick Feedback Chips */}
                            <div>
                              <label className="block text-[11px] font-bold text-slate-600 mb-1">
                                त्वरित टिप्पणी:
                              </label>
                              <div className="flex flex-wrap gap-1.5">
                                {[
                                  "🎉 बहुत बढ़िया! शाबाश!",
                                  "⭐ निपुण स्तर प्राप्त",
                                  "👍 सुंदर चित्र और सही उत्तर!",
                                  "💡 अच्छा प्रयास! और अभ्यास करें",
                                ].map((chip) => (
                                  <button
                                    type="button"
                                    key={chip}
                                    onClick={() =>
                                      setReviewFeedback((prev) => ({
                                        ...prev,
                                        [sub.id]: chip,
                                      }))
                                    }
                                    className="text-[11px] font-bold bg-white hover:bg-blue-100 text-slate-700 border border-[#C7D2FE] px-2.5 py-1 rounded-lg transition"
                                  >
                                    {chip}
                                  </button>
                                ))}
                              </div>
                            </div>

                            {/* Feedback Text Input */}
                            <input
                              type="text"
                              placeholder="शिक्षक की टिप्पणी दर्ज करें..."
                              value={reviewFeedback[sub.id] || ""}
                              onChange={(e) =>
                                setReviewFeedback((prev) => ({
                                  ...prev,
                                  [sub.id]: e.target.value,
                                }))
                              }
                              className="w-full bg-white border border-[#C7D2FE] p-2.5 rounded-lg text-xs font-semibold text-slate-800"
                            />

                            <button
                              onClick={() => handleGradeSubmission(sub.id, sub.totalMarks)}
                              disabled={gradingId === sub.id}
                              className="w-full bg-emerald-600 hover:bg-emerald-700 text-white font-extrabold text-xs py-3 rounded-xl shadow-md transition flex items-center justify-center gap-1.5 active:scale-95 disabled:opacity-50"
                            >
                              {gradingId === sub.id ? "अंक दर्ज हो रहे हैं..." : "✓ अंक व सितारे (⭐) प्रदान करें"}
                            </button>
                          </div>
                        ) : (
                          <div className="bg-emerald-50 p-4 rounded-xl border border-emerald-200 space-y-2">
                            <div className="flex items-center justify-between">
                              <span className="text-xs font-black text-emerald-900">
                                🏆 प्राप्त अंक: {sub.marksObtained} / {sub.totalMarks}
                              </span>
                              <span className="text-xs font-extrabold text-amber-700 bg-white px-2.5 py-0.5 rounded-full border border-amber-200">
                                +{sub.starsEarned} ⭐ सितारे
                              </span>
                            </div>
                            <p className="text-xs text-slate-800 font-semibold bg-white p-2.5 rounded-lg border border-emerald-100">
                              💬 <strong>शिक्षक टिप्पणी:</strong> {sub.teacherFeedback}
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