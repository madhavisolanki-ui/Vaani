import { useState, useEffect } from "react";
import StudentPageBanner from "../../components/StudentPageBanner";
import {
  type QuizItem,
  type QuizAttempt,
  fetchScheduledQuizzes,
  submitQuizAttempt,
  getStoredQuizAttempts,
} from "../../services/quizService";

export default function StudentQuiz() {
  const studentName = localStorage.getItem("userName") || "सिदो मुर्मू";
  const studentGrade = localStorage.getItem("studentGrade") || "कक्षा 1";
  const registeredLang = (localStorage.getItem("preferredLang") as "mun" | "san" | "ho") || "mun";

  const [quizzes, setQuizzes] = useState<QuizItem[]>([]);
  const [attempts, setAttempts] = useState<QuizAttempt[]>([]);
  const [activeTab, setActiveTab] = useState<"all" | "live" | "scheduled" | "scorecard">("all");
  const [loading, setLoading] = useState(true);

  // Active Quiz State
  const [activeQuiz, setActiveQuiz] = useState<QuizItem | null>(null);
  const [currentQuestionIdx, setCurrentQuestionIdx] = useState(0);
  const [selectedOptionIdx, setSelectedOptionIdx] = useState<number | null>(null);
  const [isAnswerSubmitted, setIsAnswerSubmitted] = useState(false);
  const [score, setScore] = useState(0);
  const [quizFinished, setQuizFinished] = useState(false);
  const [speakingQuestion, setSpeakingQuestion] = useState(false);

  // Total student stars
  const [stars, setStars] = useState<number>(() => {
    return Number(localStorage.getItem("studentStars") || "24");
  });

  useEffect(() => {
    loadData();

    const handleUpdate = () => {
      loadData();
      setStars(Number(localStorage.getItem("studentStars") || "24"));
    };

    window.addEventListener("quizScheduledUpdated", handleUpdate);
    window.addEventListener("student_quizzes_updated", handleUpdate);
    window.addEventListener("student_stars_updated", handleUpdate);

    return () => {
      window.removeEventListener("quizScheduledUpdated", handleUpdate);
      window.removeEventListener("student_quizzes_updated", handleUpdate);
      window.removeEventListener("student_stars_updated", handleUpdate);
      if ("speechSynthesis" in window) {
        window.speechSynthesis.cancel();
      }
    };
  }, []);

  const loadData = async () => {
    setLoading(true);
    try {
      const list = await fetchScheduledQuizzes(studentGrade);
      setQuizzes(list);
      setAttempts(getStoredQuizAttempts());
    } catch (e) {
      console.error(e);
    } finally {
      setLoading(false);
    }
  };

  // Text to Speech playback for child-friendly questions
  const playAudio = (hindiText: string, tribalText?: string) => {
    if (!("speechSynthesis" in window)) return;
    window.speechSynthesis.cancel();
    setSpeakingQuestion(true);

    const fullText = tribalText ? `${hindiText}। ${tribalText}` : hindiText;
    const utterance = new SpeechSynthesisUtterance(fullText);
    utterance.lang = "hi-IN";
    utterance.rate = 0.86;
    utterance.pitch = 1.05;
    utterance.onend = () => setSpeakingQuestion(false);
    utterance.onerror = () => setSpeakingQuestion(false);
    window.speechSynthesis.speak(utterance);
  };

  // Start a Quiz
  const handleStartQuiz = (quiz: QuizItem) => {
    setActiveQuiz(quiz);
    setCurrentQuestionIdx(0);
    setSelectedOptionIdx(null);
    setIsAnswerSubmitted(false);
    setScore(0);
    setQuizFinished(false);

    // Speak first question
    if (quiz.questions && quiz.questions.length > 0) {
      playAudio(quiz.questions[0].questionHindi, quiz.questions[0].questionTribal);
    }
  };

  // Answer selection
  const handleSelectOption = (idx: number) => {
    if (isAnswerSubmitted) return;
    setSelectedOptionIdx(idx);
    setIsAnswerSubmitted(true);

    const currentQ = activeQuiz?.questions[currentQuestionIdx];
    const isCorrect = currentQ?.options[idx]?.isCorrect;

    if (isCorrect) {
      setScore((prev) => prev + 1);
      // Friendly audio praise
      if ("speechSynthesis" in window) {
        const praise = new SpeechSynthesisUtterance("शाबाश! बिल्कुल सही जवाब!");
        praise.lang = "hi-IN";
        praise.rate = 0.95;
        window.speechSynthesis.speak(praise);
      }
    }
  };

  // Next Question
  const handleNextQuestion = () => {
    if (!activeQuiz) return;
    if (currentQuestionIdx + 1 < activeQuiz.questions.length) {
      const nextIdx = currentQuestionIdx + 1;
      setCurrentQuestionIdx(nextIdx);
      setSelectedOptionIdx(null);
      setIsAnswerSubmitted(false);
      playAudio(
        activeQuiz.questions[nextIdx].questionHindi,
        activeQuiz.questions[nextIdx].questionTribal
      );
    } else {
      finishQuiz();
    }
  };

  // Finish Quiz and Award Stars
  const finishQuiz = async () => {
    if (!activeQuiz) return;
    setQuizFinished(true);

    const totalQ = activeQuiz.questions.length;
    const finalScore = score + (selectedOptionIdx !== null && activeQuiz.questions[currentQuestionIdx]?.options[selectedOptionIdx]?.isCorrect ? 1 : 0);
    const starsWon = finalScore;

    await submitQuizAttempt({
      quizId: activeQuiz.id,
      quizTitle: activeQuiz.title,
      studentName,
      grade: studentGrade,
      score: finalScore,
      totalQuestions: totalQ,
      starsEarned: starsWon,
    });

    setAttempts(getStoredQuizAttempts());
    setStars(Number(localStorage.getItem("studentStars") || "24"));

    // Audio celebration
    if ("speechSynthesis" in window) {
      const completionUtterance = new SpeechSynthesisUtterance(
        `बधाई हो! आपने क्विज़ पूरा कर लिया है और ${starsWon} सितारे जीते हैं!`
      );
      completionUtterance.lang = "hi-IN";
      window.speechSynthesis.speak(completionUtterance);
    }
  };

  // Filtered quizzes
  const filteredQuizzes = quizzes.filter((q) => {
    if (activeTab === "all") return true;
    if (activeTab === "live") return q.status === "live";
    if (activeTab === "scheduled") return q.status === "scheduled";
    return true;
  });

  return (
    <div className="p-4 sm:p-7 bg-[#F8FAFC] min-h-full space-y-6 max-w-5xl mx-auto font-sans">
      {/* 1. Header Banner matching Image 2 */}
      <StudentPageBanner
        icon="🎯"
        title="नियमित क्विज़ व मूल्यांकन"
        subtitle="शिक्षक द्वारा निर्धारित क्विज़ में भाग लें, सही उत्तर चुनें और सितारे (⭐) जीतें!"
        tag={`${studentGrade} • ⭐ ${stars} कुल सितारे`}
        gradientClass="from-[#2563EB] to-[#7C3AED]"
      />

      {/* 2. Interactive Quiz Player Screen (when taking a quiz) */}
      {activeQuiz && (
        <div className="bg-white rounded-3xl border-2 border-blue-500 shadow-xl p-5 sm:p-8 space-y-6 relative overflow-hidden animate-in fade-in zoom-in-95 duration-200">
          {/* Decorative Header ribbon */}
          <div className="flex flex-wrap items-center justify-between gap-3 border-b border-slate-100 pb-4">
            <div className="flex items-center gap-2.5">
              <span className="text-2xl p-2 bg-blue-50 rounded-xl border border-blue-200">
                {activeQuiz.subject.includes("गणित") ? "🔢" : "📖"}
              </span>
              <div>
                <span className="text-[11px] font-black text-blue-700 bg-blue-50 px-2.5 py-0.5 rounded-full border border-blue-200 uppercase">
                  {activeQuiz.subject} • {activeQuiz.nipunCode}
                </span>
                <h2 className="text-lg sm:text-xl font-black text-slate-900 mt-1">
                  {activeQuiz.title}
                </h2>
              </div>
            </div>

            <button
              onClick={() => {
                if (window.confirm("क्या आप वाकई क्विज़ बीच में छोड़ना चाहते हैं?")) {
                  setActiveQuiz(null);
                  if ("speechSynthesis" in window) window.speechSynthesis.cancel();
                }
              }}
              className="text-xs font-bold text-slate-500 hover:text-red-600 bg-slate-100 hover:bg-red-50 px-3 py-1.5 rounded-xl transition cursor-pointer"
            >
              ✕ बाहर निकलें
            </button>
          </div>

          {!quizFinished ? (
            /* Question Card & Options */
            <div className="space-y-6">
              {/* Progress and Score Bar */}
              <div className="space-y-1.5">
                <div className="flex items-center justify-between text-xs font-black">
                  <span className="text-blue-700">
                    प्रश्न {currentQuestionIdx + 1} / {activeQuiz.questions.length}
                  </span>
                  <span className="text-amber-700 bg-amber-50 px-2.5 py-0.5 rounded-full border border-amber-200">
                    ⭐ सही उत्तर: {score}
                  </span>
                </div>
                <div className="w-full bg-slate-100 h-3 rounded-full overflow-hidden border border-slate-200">
                  <div
                    className="bg-gradient-to-r from-blue-500 to-indigo-600 h-full rounded-full transition-all duration-300"
                    style={{
                      width: `${((currentQuestionIdx + 1) / activeQuiz.questions.length) * 100}%`,
                    }}
                  ></div>
                </div>
              </div>

              {/* Bilingual Question Box */}
              {activeQuiz.questions[currentQuestionIdx] && (
                <div className="bg-[#EEF2FF] p-5 sm:p-7 rounded-2xl border border-[#C7D2FE] space-y-3 relative">
                  <div className="flex items-start justify-between gap-3">
                    <div className="space-y-1.5 flex-1">
                      <div className="flex items-center gap-2">
                        <span className="bg-blue-600 text-white text-[10px] font-black px-2 py-0.5 rounded-md">
                          हिंदी
                        </span>
                        <h3 className="text-lg sm:text-xl font-black text-slate-900 leading-snug">
                          {activeQuiz.questions[currentQuestionIdx].questionHindi}
                        </h3>
                      </div>

                      {activeQuiz.questions[currentQuestionIdx].questionTribal && (
                        <div className="flex items-center gap-2 pt-1">
                          <span className="bg-amber-600 text-white text-[10px] font-black px-2 py-0.5 rounded-md">
                            मातृभाषा
                          </span>
                          <p className="text-base sm:text-lg font-bold text-blue-900">
                            {activeQuiz.questions[currentQuestionIdx].questionTribal}
                          </p>
                        </div>
                      )}

                      {activeQuiz.questions[currentQuestionIdx].tribalOlChiki && (
                        <p className="text-sm font-black text-amber-800 bg-white/60 p-1.5 rounded-lg border border-amber-200 inline-block mt-1">
                          लिपि (ओल चिकी): {activeQuiz.questions[currentQuestionIdx].tribalOlChiki}
                        </p>
                      )}
                    </div>

                    <button
                      type="button"
                      onClick={() =>
                        playAudio(
                          activeQuiz.questions[currentQuestionIdx].questionHindi,
                          activeQuiz.questions[currentQuestionIdx].questionTribal
                        )
                      }
                      className={`p-3 rounded-2xl border transition shadow-sm shrink-0 flex flex-col items-center gap-1 active:scale-95 cursor-pointer ${
                        speakingQuestion
                          ? "bg-amber-500 text-white border-amber-600 ring-2 ring-amber-300 animate-pulse"
                          : "bg-white text-blue-700 border-[#C7D2FE] hover:bg-blue-50"
                      }`}
                      title="प्रश्न सुनें"
                    >
                      <span className="text-2xl">🔊</span>
                      <span className="text-[10px] font-black">सुनें</span>
                    </button>
                  </div>
                </div>
              )}

              {/* Options Grid */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5 pt-2">
                {activeQuiz.questions[currentQuestionIdx]?.options.map((opt, oIdx) => {
                  const isSelected = selectedOptionIdx === oIdx;
                  let btnStyle = "bg-white border-slate-200 hover:border-blue-400 hover:bg-blue-50/50";

                  if (isAnswerSubmitted) {
                    if (opt.isCorrect) {
                      btnStyle = "bg-emerald-50 border-emerald-500 ring-2 ring-emerald-400 text-emerald-950 font-black";
                    } else if (isSelected && !opt.isCorrect) {
                      btnStyle = "bg-rose-50 border-rose-500 ring-2 ring-rose-400 text-rose-950";
                    } else {
                      btnStyle = "bg-slate-50 border-slate-200 opacity-60";
                    }
                  } else if (isSelected) {
                    btnStyle = "bg-blue-50 border-blue-500 ring-2 ring-blue-300";
                  }

                  return (
                    <button
                      key={oIdx}
                      type="button"
                      disabled={isAnswerSubmitted}
                      onClick={() => handleSelectOption(oIdx)}
                      className={`p-4 rounded-2xl border text-left transition flex items-center justify-between gap-3 shadow-2xs cursor-pointer ${btnStyle}`}
                    >
                      <div className="space-y-0.5">
                        <p className="text-base font-black text-slate-900">
                          {opt.textHindi}
                        </p>
                        {opt.textTribal && (
                          <p className="text-xs font-bold text-slate-600">
                            ({opt.textTribal})
                          </p>
                        )}
                      </div>

                      <div className="shrink-0 text-xl">
                        {isAnswerSubmitted && opt.isCorrect && "✅"}
                        {isAnswerSubmitted && isSelected && !opt.isCorrect && "❌"}
                        {!isAnswerSubmitted && (
                          <span className="w-7 h-7 rounded-full bg-slate-100 flex items-center justify-center text-xs font-bold text-slate-500 border border-slate-300">
                            {String.fromCharCode(65 + oIdx)}
                          </span>
                        )}
                      </div>
                    </button>
                  );
                })}
              </div>

              {/* Bottom Actions after selecting */}
              {isAnswerSubmitted && (
                <div className="flex items-center justify-between pt-2 border-t border-slate-100 animate-in fade-in">
                  <div>
                    {activeQuiz.questions[currentQuestionIdx]?.options[selectedOptionIdx!]?.isCorrect ? (
                      <span className="text-sm font-black text-emerald-700 flex items-center gap-1.5">
                        <span>🎉</span>
                        <span>शाबाश! बिल्कुल सही उत्तर!</span>
                      </span>
                    ) : (
                      <span className="text-sm font-black text-rose-700 flex items-center gap-1.5">
                        <span>💡</span>
                        <span>कोई बात नहीं, सही उत्तर हरा चिह्नित है।</span>
                      </span>
                    )}
                  </div>

                  <button
                    type="button"
                    onClick={handleNextQuestion}
                    className="bg-blue-600 hover:bg-blue-700 text-white font-black text-sm px-6 py-2.5 rounded-xl shadow-md transition flex items-center gap-2 active:scale-95 cursor-pointer"
                  >
                    <span>
                      {currentQuestionIdx + 1 < activeQuiz.questions.length
                        ? "अगला प्रश्न ➔"
                        : "परिणाम देखें 🏆"}
                    </span>
                  </button>
                </div>
              )}
            </div>
          ) : (
            /* Quiz Completed Congratulations Card */
            <div className="py-8 text-center space-y-5 animate-in zoom-in-90">
              <div className="w-24 h-24 bg-amber-100 text-amber-600 rounded-full flex items-center justify-center text-5xl mx-auto shadow-inner border-4 border-amber-300 animate-bounce">
                🏆
              </div>

              <div className="space-y-2">
                <span className="bg-emerald-100 text-emerald-800 text-xs font-black px-4 py-1 rounded-full border border-emerald-300">
                  🎉 क्विज़ सफलतापूर्वक पूर्ण!
                </span>
                <h3 className="text-2xl sm:text-3xl font-black text-slate-900">
                  शानदार प्रयास, {studentName}!
                </h3>
                <p className="text-sm text-slate-600 max-w-md mx-auto">
                  आपने इस क्विज़ में उत्कृष्ट प्रदर्शन किया है। आपके सभी उत्तर और अंक शिक्षक डैशबोर्ड पर अपडेट हो गए हैं।
                </p>
              </div>

              {/* Scorecard Metric Pills */}
              <div className="flex items-center justify-center gap-4 flex-wrap">
                <div className="bg-blue-50 border border-blue-200 p-4 rounded-2xl min-w-[130px]">
                  <span className="text-xs font-bold text-blue-700">कुल प्रश्न</span>
                  <p className="text-2xl font-black text-blue-900 mt-0.5">
                    {activeQuiz.questions.length}
                  </p>
                </div>
                <div className="bg-emerald-50 border border-emerald-200 p-4 rounded-2xl min-w-[130px]">
                  <span className="text-xs font-bold text-emerald-700">सही उत्तर</span>
                  <p className="text-2xl font-black text-emerald-900 mt-0.5">
                    {score} / {activeQuiz.questions.length}
                  </p>
                </div>
                <div className="bg-amber-50 border border-amber-200 p-4 rounded-2xl min-w-[130px]">
                  <span className="text-xs font-bold text-amber-700">अर्जित सितारे</span>
                  <p className="text-2xl font-black text-amber-900 mt-0.5">
                    ⭐ +{score}
                  </p>
                </div>
              </div>

              <div className="pt-4 flex items-center justify-center gap-3">
                <button
                  type="button"
                  onClick={() => {
                    setActiveQuiz(null);
                    setActiveTab("scorecard");
                  }}
                  className="bg-blue-600 hover:bg-blue-700 text-white font-black text-xs sm:text-sm px-6 py-3 rounded-xl shadow-md transition active:scale-95 cursor-pointer"
                >
                  🏆 मेरा स्कोरकार्ड देखें
                </button>
                <button
                  type="button"
                  onClick={() => {
                    handleStartQuiz(activeQuiz);
                  }}
                  className="bg-white hover:bg-slate-50 text-slate-800 font-bold text-xs sm:text-sm px-5 py-3 rounded-xl border border-slate-300 transition cursor-pointer"
                >
                  🔄 पुनः अभ्यास करें
                </button>
              </div>
            </div>
          )}
        </div>
      )}

      {/* 3. Main Quizzes List & Scorecard Tabs */}
      {!activeQuiz && (
        <div className="space-y-6">
          {/* Toolbar: Tabs & Class Badge */}
          <div className="bg-white p-4 rounded-[16px] border border-[#C7D2FE] shadow-2xs flex flex-wrap items-center justify-between gap-3">
            <div className="flex items-center gap-2">
              <span className="text-xs font-black text-slate-700">
                📌 {studentGrade} के लिए निर्धारित क्विज़
              </span>
              <span className="bg-blue-50 text-blue-700 text-[11px] font-black px-2.5 py-0.5 rounded-full border border-blue-200">
                मातृभाषा: {registeredLang === "mun" ? "मुंडारी" : registeredLang === "san" ? "संथाली" : "हो"}
              </span>
            </div>

            {/* Filter Tabs */}
            <div className="flex bg-[#EEF2FF] p-1 rounded-xl border border-[#C7D2FE] shadow-2xs">
              <button
                type="button"
                onClick={() => setActiveTab("all")}
                className={`px-3 py-1.5 rounded-lg text-xs font-bold transition cursor-pointer ${
                  activeTab === "all"
                    ? "bg-blue-600 text-white shadow-xs"
                    : "text-slate-600 hover:text-slate-900"
                }`}
              >
                सभी ({quizzes.length})
              </button>
              <button
                type="button"
                onClick={() => setActiveTab("live")}
                className={`px-3 py-1.5 rounded-lg text-xs font-bold transition cursor-pointer flex items-center gap-1 ${
                  activeTab === "live"
                    ? "bg-blue-600 text-white shadow-xs"
                    : "text-slate-600 hover:text-slate-900"
                }`}
              >
                <span className="w-1.5 h-1.5 rounded-full bg-red-500 animate-ping"></span>
                <span>सक्रिय ({quizzes.filter((q) => q.status === "live").length})</span>
              </button>
              <button
                type="button"
                onClick={() => setActiveTab("scheduled")}
                className={`px-3 py-1.5 rounded-lg text-xs font-bold transition cursor-pointer ${
                  activeTab === "scheduled"
                    ? "bg-blue-600 text-white shadow-xs"
                    : "text-slate-600 hover:text-slate-900"
                }`}
              >
                आगामी ({quizzes.filter((q) => q.status === "scheduled").length})
              </button>
              <button
                type="button"
                onClick={() => setActiveTab("scorecard")}
                className={`px-3 py-1.5 rounded-lg text-xs font-bold transition cursor-pointer ${
                  activeTab === "scorecard"
                    ? "bg-blue-600 text-white shadow-xs"
                    : "text-slate-600 hover:text-slate-900"
                }`}
              >
                🏆 स्कोरकार्ड ({attempts.length})
              </button>
            </div>
          </div>

          {/* TAB CONTENT: QUZZES LIST */}
          {activeTab !== "scorecard" && (
            <div>
              {loading ? (
                <div className="bg-white p-12 text-center rounded-2xl border border-slate-200">
                  <div className="w-8 h-8 border-3 border-blue-600 border-t-transparent rounded-full animate-spin mx-auto mb-2"></div>
                  <p className="text-xs font-bold text-slate-500">क्विज़ लोड हो रहे हैं...</p>
                </div>
              ) : filteredQuizzes.length === 0 ? (
                <div className="bg-white p-12 text-center rounded-2xl border border-slate-200 space-y-2">
                  <span className="text-4xl">📝</span>
                  <h3 className="text-base font-black text-slate-800">
                    इस श्रेणी में फिलहाल कोई क्विज़ उपलब्ध नहीं है।
                  </h3>
                  <p className="text-xs text-slate-500">
                    शिक्षक द्वारा नया क्विज़ शेड्यूल करते ही यहाँ दिखाई देगा।
                  </p>
                </div>
              ) : (
                <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                  {filteredQuizzes.map((quiz) => {
                    const isLive = quiz.status === "live";
                    const isMath = quiz.subject.includes("गणित");

                    return (
                      <div
                        key={quiz.id}
                        className="bg-white p-5 sm:p-6 rounded-2xl border border-[#C7D2FE] shadow-2xs hover:shadow-md transition space-y-4 flex flex-col justify-between"
                      >
                        <div className="space-y-3">
                          {/* Top Badges */}
                          <div className="flex items-center justify-between gap-2">
                            <div className="flex items-center gap-1.5">
                              <span className="bg-blue-50 text-blue-800 text-[11px] font-black px-2.5 py-0.5 rounded-full border border-blue-200">
                                {quiz.grade} • {quiz.subject}
                              </span>
                              <span className="bg-amber-50 text-amber-800 text-[11px] font-bold px-2 py-0.5 rounded-full border border-amber-200">
                                🌐 {quiz.targetLangLabel}
                              </span>
                            </div>

                            {isLive ? (
                              <span className="bg-red-500 text-white text-[10px] font-black px-2.5 py-0.5 rounded-full flex items-center gap-1 shadow-xs animate-pulse">
                                <span className="w-1.5 h-1.5 rounded-full bg-white"></span>
                                लाइव क्विज़
                              </span>
                            ) : (
                              <span className="bg-slate-100 text-slate-600 text-[10px] font-bold px-2 py-0.5 rounded-full border border-slate-200">
                                ⏳ शेड्यूल्ड
                              </span>
                            )}
                          </div>

                          {/* Title & Topic */}
                          <div>
                            <div className="flex items-center gap-2">
                              <span className="text-xl">{isMath ? "🔢" : "📖"}</span>
                              <h3 className="text-base font-black text-slate-900 leading-snug">
                                {quiz.title}
                              </h3>
                            </div>
                            <p className="text-xs text-slate-500 font-semibold mt-1">
                              दक्षता कोड: {quiz.nipunCode}
                            </p>
                          </div>

                          {/* Details Bar */}
                          <div className="grid grid-cols-3 gap-2 bg-[#F8FAFC] p-2.5 rounded-xl border border-slate-200 text-center text-xs">
                            <div>
                              <span className="text-[10px] text-slate-500 block">प्रश्नों की संख्या</span>
                              <span className="font-black text-slate-800">
                                {quiz.totalQuestions || quiz.questions.length} प्रश्न
                              </span>
                            </div>
                            <div>
                              <span className="text-[10px] text-slate-500 block">कुल समय</span>
                              <span className="font-black text-slate-800">
                                {quiz.durationMinutes} मिनट
                              </span>
                            </div>
                            <div>
                              <span className="text-[10px] text-slate-500 block">कुल सितारे</span>
                              <span className="font-black text-amber-600">
                                ⭐ {quiz.totalQuestions || 5}
                              </span>
                            </div>
                          </div>

                          {/* Schedule Timing info */}
                          <div className="flex items-center justify-between text-[11px] text-slate-600 bg-slate-50 px-3 py-1.5 rounded-lg border border-slate-200">
                            <span>📅 तिथि: {quiz.date}</span>
                            <span>⏰ समय: {quiz.startTime}</span>
                          </div>
                        </div>

                        {/* Action CTA Button */}
                        <div className="pt-2">
                          <button
                            type="button"
                            onClick={() => handleStartQuiz(quiz)}
                            className="w-full bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 text-white font-black text-xs sm:text-sm py-2.5 rounded-xl shadow-md transition flex items-center justify-center gap-2 active:scale-95 cursor-pointer"
                          >
                            <span>🎯</span>
                            <span>क्विज़ शुरू करें</span>
                            <span>➔</span>
                          </button>
                        </div>
                      </div>
                    );
                  })}
                </div>
              )}
            </div>
          )}

          {/* TAB CONTENT: SCORECARD */}
          {activeTab === "scorecard" && (
            <div className="space-y-4">
              <div className="bg-gradient-to-r from-amber-500 to-orange-600 p-6 rounded-2xl text-white shadow-md flex items-center justify-between gap-4">
                <div className="flex items-center gap-3">
                  <div className="w-14 h-14 bg-white/20 backdrop-blur-xs rounded-2xl flex items-center justify-center text-3xl shadow-inner border border-white/25">
                    ⭐
                  </div>
                  <div>
                    <span className="text-xs font-bold text-amber-100">कुल अर्जित सितारे</span>
                    <h3 className="text-2xl sm:text-3xl font-black">
                      {stars} सितारे
                    </h3>
                  </div>
                </div>
                <div className="text-right">
                  <span className="bg-white/20 px-3 py-1 rounded-full text-xs font-black backdrop-blur-xs">
                    कुल पूर्ण क्विज़: {attempts.length}
                  </span>
                </div>
              </div>

              {attempts.length === 0 ? (
                <div className="bg-white p-12 text-center rounded-2xl border border-slate-200 space-y-2">
                  <span className="text-4xl">🏆</span>
                  <p className="text-sm font-bold text-slate-600">
                    आपने अभी तक कोई क्विज़ हल नहीं किया है। ऊपर दी गई सूची से क्विज़ शुरू करें!
                  </p>
                </div>
              ) : (
                <div className="bg-white rounded-2xl border border-[#C7D2FE] shadow-2xs divide-y divide-slate-100 overflow-hidden">
                  {attempts.map((att) => (
                    <div
                      key={att.id}
                      className="p-4 sm:p-5 flex flex-col sm:flex-row sm:items-center justify-between gap-3 hover:bg-slate-50 transition"
                    >
                      <div className="flex items-center gap-3">
                        <div className="w-10 h-10 bg-emerald-100 text-emerald-800 rounded-xl flex items-center justify-center text-xl shrink-0 font-black">
                          ✓
                        </div>
                        <div>
                          <h4 className="text-base font-black text-slate-900">
                            {att.quizTitle}
                          </h4>
                          <p className="text-xs text-slate-500 mt-0.5">
                            {att.grade} • पूर्ण किया गया: {new Date(att.attemptedAt).toLocaleDateString("hi-IN")}
                          </p>
                        </div>
                      </div>

                      <div className="flex items-center gap-3 self-end sm:self-auto">
                        <span className="bg-emerald-50 text-emerald-800 text-xs font-black px-3 py-1 rounded-full border border-emerald-200">
                          अंक: {att.score} / {att.totalQuestions}
                        </span>
                        <span className="bg-amber-50 text-amber-900 text-xs font-black px-3 py-1 rounded-full border border-amber-200">
                          ⭐ +{att.starsEarned} सितारे
                        </span>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          )}
        </div>
      )}
    </div>
  );
}
