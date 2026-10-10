import { useState } from "react";
import { Link } from "react-router-dom";

export default function TeacherSettings() {

  // 1. Language & Translation Settings State
  const [targetLang, setTargetLang] = useState<string>(
    localStorage.getItem("preferredLang") || "mun"
  );
  const [santhaliScript, setSanthaliScript] = useState<string>(
    localStorage.getItem("santhaliScript") || "devanagari"
  );

  // 2. Real-time Voice & Audio Settings State
  const [latencyMode, setLatencyMode] = useState<string>(
    localStorage.getItem("latencyMode") || "fast"
  );
  const [speechSpeed, setSpeechSpeed] = useState<string>(
    localStorage.getItem("speechSpeed") || "1.0"
  );
  const [autoPlayStudentVoice, setAutoPlayStudentVoice] = useState<boolean>(
    localStorage.getItem("autoPlayStudentVoice") !== "false"
  );

  // 3. Offline & Storage Management State
  const [models, setModels] = useState({
    ho: true,
    mun: true,
    san: true,
  });
  const [autoSync, setAutoSync] = useState<boolean>(
    localStorage.getItem("autoSync") !== "false"
  );

  // Notification Toast
  const [saved, setSaved] = useState(false);

  // 4. Teacher & School Profile
  const teacherName = localStorage.getItem("userName") || "माधवी सोलंकी";
  const userSchool =
    localStorage.getItem("userSchool") ||
    "राजकीय प्राथमिक विद्यालय, खूंटी, झारखंड";

  const handleSave = () => {
    localStorage.setItem("preferredLang", targetLang);
    localStorage.setItem("santhaliScript", santhaliScript);
    localStorage.setItem("latencyMode", latencyMode);
    localStorage.setItem("speechSpeed", speechSpeed);
    localStorage.setItem("autoPlayStudentVoice", String(autoPlayStudentVoice));
    localStorage.setItem("autoSync", String(autoSync));

    setSaved(true);
    setTimeout(() => setSaved(false), 3000);
  };

  return (
    <div className="p-4 sm:p-8 bg-[#F8FAFC] min-h-full space-y-6 max-w-5xl mx-auto font-sans pb-16">
      {/* Page Header with Bilingual Context Badge */}
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
                वाणीसेतु
              </span>
              <span
                className="text-xs font-bold px-3 py-1 rounded-full border border-white/30 backdrop-blur-md shadow-xs text-white flex items-center gap-1.5"
                style={{ backgroundColor: "rgba(255, 255, 255, 0.2)" }}
              >
                <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse"></span>
                शिक्षक नियंत्रण कक्ष (100% हिंदी माध्यम)
              </span>
            </div>
            <h1 className="text-2xl sm:text-3xl font-black text-white tracking-tight">
              ⚙️ सेटिंग्स 
            </h1>
            <p className="text-blue-100 text-xs sm:text-sm mt-1 max-w-3xl leading-relaxed font-medium">
              यहाँ आप तय कर सकते हैं कि बच्चों को किस जनजातीय भाषा में अनुवादित आवाज़ और पाठ सामग्री प्राप्त हो।
            </p>
          </div>

          <div className="flex items-center gap-2">
            <Link
              to="/teacher"
              className="px-4 py-2.5 rounded-xl border border-white/30 text-xs font-bold text-white hover:bg-white/20 transition shadow-xs backdrop-blur-md"
              style={{ backgroundColor: "rgba(255, 255, 255, 0.15)" }}
            >
              ⬅ डैशबोर्ड पर लौटें
            </Link>
            <button
              onClick={handleSave}
              style={{ background: "linear-gradient(135deg, #4F46E5 0%, #7C3AED 100%)" }}
              className="text-white font-black text-xs px-5 py-2.5 rounded-xl shadow-md shadow-indigo-600/20 hover:opacity-95 transition active:scale-95 flex items-center gap-2"
            >
              <span>💾</span>
              <span>सेव करें</span>
            </button>
          </div>
        </div>
      </div>

      {/* Success Notification Alert */}
      {saved && (
        <div className="bg-[#DBEAFE] border border-[#BFDBFE] text-[#1E40AF] text-xs sm:text-sm font-black p-4 rounded-2xl flex items-center justify-between shadow-xs animate-in fade-in duration-200">
          <div className="flex items-center gap-2.5">
            <span className="text-lg">✓</span>
            <span>
              सेटिंग्स सफलतापूर्वक सुरक्षित हो गई हैं! लाइव कक्षा और अनुवाद इंजन नई प्राथमिकताओं के अनुसार अपडेट हो गए हैं।
            </span>
          </div>
          <button
            onClick={() => setSaved(false)}
            className="text-[#1E40AF] hover:text-[#1E3A8A] font-bold text-base px-2"
          >
            ✕
          </button>
        </div>
      )}

      {/* 1. विद्यालय एवं शिक्षक प्रोफ़ाइल (School & Teacher Profile) */}
      <div className="bg-white rounded-[16px] p-6 sm:p-7 shadow-xs border border-[#DBEAFE] space-y-4">
        <div className="flex items-center justify-between border-b border-[#DBEAFE] pb-3">
          <div className="flex items-center gap-3">
            <div className="w-9 h-9 rounded-xl bg-[#EFF6FF] text-[#1E40AF] border border-[#DBEAFE] font-black flex items-center justify-center text-lg shadow-2xs">
              1
            </div>
            <div>
              <h2 className="text-base sm:text-lg font-black text-[#0F172A]">
                विद्यालय एवं शिक्षक प्रोफ़ाइल
              </h2>
              <p className="text-xs text-slate-600">
                प्राथमिक शिक्षक एवं विद्यालय का बुनियादी विवरण।
              </p>
            </div>
          </div>

          <Link
            to="/teacher/profile"
            className="px-4 py-2 bg-white hover:bg-[#F8FAFC] text-[#1E40AF] border border-[#DBEAFE] rounded-xl text-xs font-black transition flex items-center gap-1.5 shadow-2xs"
          >
            <span>👤</span>
            <span>पूरी प्रोफ़ाइल देखें व बदलें</span>
            <span>➔</span>
          </Link>
        </div>

        {/* Clean 3-Item List */}
        <div className="bg-[#F8FAFC] rounded-[12px] p-5 border border-[#DBEAFE] shadow-2xs divide-y divide-[#DBEAFE] text-xs sm:text-sm font-semibold space-y-3">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between pt-1 gap-1">
            <span className="font-extrabold text-slate-600">
              • शिक्षक का नाम:
            </span>
            <span className="font-black text-slate-900 text-sm">
              {teacherName} <span className="text-[#1E40AF] font-bold text-xs">(हिंदी माध्यम)</span>
            </span>
          </div>

          <div className="flex flex-col sm:flex-row sm:items-center justify-between pt-3 gap-1">
            <span className="font-extrabold text-slate-600">
              • विद्यालय का नाम:
            </span>
            <span className="font-black text-slate-900 text-sm">
              {userSchool}
            </span>
          </div>

          <div className="flex flex-col sm:flex-row sm:items-center justify-between pt-3 gap-1">
            <span className="font-extrabold text-slate-600">
              • आवंटित कक्षाएं:
            </span>
            <span className="font-black text-[#1E40AF] bg-[#DBEAFE] px-2.5 py-0.5 rounded-lg border border-[#DBEAFE] text-xs shadow-2xs">
              कक्षा 1 और कक्षा 2 (प्राथमिक स्तर)
            </span>
          </div>
        </div>
      </div>

      {/* 2. भाषा एवं अनुवाद कस्टमाइज़ेशन (Language & Translation Settings) */}
      <div className="bg-white rounded-[16px] p-6 sm:p-7 shadow-xs border border-[#DBEAFE] space-y-5">
        <div className="flex items-center gap-3 border-b border-[#DBEAFE] pb-3">
          <div className="w-9 h-9 rounded-xl bg-[#EFF6FF] text-[#1E40AF] border border-[#DBEAFE] font-black flex items-center justify-center text-lg shadow-2xs">
            2
          </div>
          <div>
            <h2 className="text-base sm:text-lg font-black text-[#0F172A]">
              भाषा एवं अनुवाद कस्टमाइज़ेशन
            </h2>
            <p className="text-xs text-slate-600">
              कक्षा की लक्षित जनजातीय भाषा और लिपि प्राथमिकताओं का चयन करें।
            </p>
          </div>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs sm:text-sm">
            <thead>
              <tr className="border-b border-[#DBEAFE] text-slate-600 text-[11px] uppercase tracking-wider">
                <th className="py-3 px-3 font-bold w-1/4">सेटिंग का नाम</th>
                <th className="py-3 px-3 font-bold w-1/3">
                  शिक्षक के लिए विकल्प / चयन
                </th>
                <th className="py-3 px-3 font-bold">विवरण एवं उपयोग</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-[#DBEAFE]">
              {/* Target Tribal Language */}
              <tr className="hover:bg-[#F8FAFC] transition">
                <td className="py-4 px-3 font-extrabold text-slate-800">
                  छात्रों की जनजातीय भाषा
                </td>
                <td className="py-4 px-3">
                  <select
                    value={targetLang}
                    onChange={(e) => setTargetLang(e.target.value)}
                    className="w-full border border-[#DBEAFE] bg-white p-2.5 rounded-xl font-black text-xs sm:text-sm text-[#1E40AF] focus:outline-none focus:ring-2 focus:ring-[#BFDBFE] shadow-2xs"
                  >
                    <option value="mun">मुंडारी</option>
                    <option value="ho">हो</option>
                    <option value="san">संथाली</option>
                  </select>
                </td>
                <td className="py-4 px-3 text-xs text-slate-600 leading-relaxed">
                  शिक्षक अपने स्कूल के अनुसार बच्चों की मातृभाषा चुनेंगे। शिक्षक
                  जो भी हिंदी बोलेंगे, वह इस चुनी हुई भाषा में ऑटो-अनुवादित होगी।
                </td>
              </tr>

              {/* Santhali Script Mode */}
              <tr className="hover:bg-[#F8FAFC] transition">
                <td className="py-4 px-3 font-extrabold text-slate-800">
                  संथाली लिपि चयन
                </td>
                <td className="py-4 px-3">
                  <select
                    value={santhaliScript}
                    onChange={(e) => setSanthaliScript(e.target.value)}
                    className="w-full border border-[#DBEAFE] bg-white p-2.5 rounded-xl font-bold text-xs sm:text-sm text-slate-800 focus:outline-none focus:ring-2 focus:ring-[#BFDBFE] shadow-2xs"
                  >
                    <option value="devanagari">देवनागरी</option>
                    <option value="olchiki">ओल चिकी</option>
                    <option value="both">
                      दोनों (देवनागरी + ओल चिकी)
                    </option>
                  </select>
                </td>
                <td className="py-4 px-3 text-xs text-slate-600 leading-relaxed">
                  यदि संथाली भाषा चुनी गई है, तो बच्चों के स्क्रीन पर वर्कशीट्स या
                  शब्द किस लिपि में दिखेंगे।
                </td>
              </tr>

              {/* Teacher Dashboard Language */}
              <tr className="hover:bg-[#F8FAFC] transition">
                <td className="py-4 px-3 font-extrabold text-slate-800">
                  शिक्षक डैशबोर्ड भाषा
                </td>
                <td className="py-4 px-3">
                  <div className="inline-flex items-center gap-2 bg-[#F8FAFC] text-slate-800 border border-[#DBEAFE] font-black text-xs px-3 py-1.5 rounded-lg shadow-2xs">
                    <span>🔒</span>
                    <span>हिंदी (फ़िक्स)</span>
                  </div>
                </td>
                <td className="py-4 px-3 text-xs text-slate-600 leading-relaxed">
                  शिक्षक के लिए सभी मेन्यू, बटन और अनुवाद परिणाम हमेशा केवल
                  हिंदी में ही रहेंगे।
                </td>
              </tr>
            </tbody>
          </table>
        </div>
      </div>

      {/* 3. रियल-टाइम वॉइस एवं ऑडियो सेटिंग्स (Voice & Live Translation Settings) */}
      <div className="bg-white rounded-[16px] p-6 sm:p-7 shadow-xs border border-[#DBEAFE] space-y-5">
        <div className="flex items-center gap-3 border-b border-[#DBEAFE] pb-3">
          <div className="w-9 h-9 rounded-xl bg-[#EFF6FF] text-[#1E40AF] border border-[#DBEAFE] font-black flex items-center justify-center text-lg shadow-2xs">
            3
          </div>
          <div>
            <h2 className="text-base sm:text-lg font-black text-[#0F172A]">
              रियल-टाइम वॉइस एवं ऑडियो सेटिंग्स
            </h2>
            <p className="text-xs text-slate-600">
              लाइव कक्षा में आवाज अनुवाद की गति और प्लेबैक व्यवहार को नियंत्रित करें।
            </p>
          </div>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs sm:text-sm">
            <thead>
              <tr className="border-b border-[#DBEAFE] text-slate-600 text-[11px] uppercase tracking-wider">
                <th className="py-3 px-3 font-bold w-1/4">सेटिंग का नाम</th>
                <th className="py-3 px-3 font-bold w-1/3">
                  शिक्षक के लिए विकल्प / चयन
                </th>
                <th className="py-3 px-3 font-bold">विवरण एवं उपयोग</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-[#DBEAFE]">
              {/* Translation Latency */}
              <tr className="hover:bg-[#F8FAFC] transition">
                <td className="py-4 px-3 font-extrabold text-slate-800">
                  अनुवाद गति
                </td>
                <td className="py-4 px-3 space-y-2">
                  <label className="flex items-center gap-2 cursor-pointer font-bold text-xs text-slate-800">
                    <input
                      type="radio"
                      name="latency"
                      value="fast"
                      checked={latencyMode === "fast"}
                      onChange={() => setLatencyMode("fast")}
                      className="accent-[#4F46E5] w-4 h-4 cursor-pointer"
                    />
                    <span>अति-तीव्र गति (&lt; ३ सेकंड)</span>
                  </label>
                  <label className="flex items-center gap-2 cursor-pointer font-bold text-xs text-slate-600">
                    <input
                      type="radio"
                      name="latency"
                      value="accurate"
                      checked={latencyMode === "accurate"}
                      onChange={() => setLatencyMode("accurate")}
                      className="accent-[#4F46E5] w-4 h-4 cursor-pointer"
                    />
                    <span>उच्च-सटीकता मोड</span>
                  </label>
                </td>
                <td className="py-4 px-3 text-xs text-slate-600 leading-relaxed">
                  कम-लागत वाले 2 जीबी रैम टैबलेट पर 3 सेकंड से कम समय में लाइव आवाज़
                  अनुवाद सुनिश्चित करने के लिए।
                </td>
              </tr>

              {/* Audio Playback Speed */}
              <tr className="hover:bg-[#F8FAFC] transition">
                <td className="py-4 px-3 font-extrabold text-slate-800">
                  ऑडियो प्लेबैक स्पीड
                </td>
                <td className="py-4 px-3">
                  <select
                    value={speechSpeed}
                    onChange={(e) => setSpeechSpeed(e.target.value)}
                    className="w-full border border-[#DBEAFE] bg-white p-2.5 rounded-xl font-bold text-xs sm:text-sm text-slate-800 focus:outline-none focus:ring-2 focus:ring-[#BFDBFE] shadow-2xs"
                  >
                    <option value="0.8">धीमी गति (०.८x - छोटे बच्चों के लिए)</option>
                    <option value="1.0">सामान्य गति (१.०x)</option>
                    <option value="1.2">तेज़ गति (१.२x)</option>
                  </select>
                </td>
                <td className="py-4 px-3 text-xs text-slate-600 leading-relaxed">
                  प्राथमिक विद्यालय के छोटे बच्चों के लिए जनजातीय ऑडियो अनुवाद की
                  आवाज़ की गति धीमी या सामान्य रखना।
                </td>
              </tr>

              {/* Auto Play Student Voice */}
              <tr className="hover:bg-[#F8FAFC] transition">
                <td className="py-4 px-3 font-extrabold text-slate-800">
                  छात्र का उत्तर ऑटो-प्ले
                </td>
                <td className="py-4 px-3">
                  <label className="flex items-center gap-2.5 bg-white border border-[#DBEAFE] p-2.5 rounded-xl cursor-pointer shadow-2xs">
                    <input
                      type="checkbox"
                      checked={autoPlayStudentVoice}
                      onChange={(e) => setAutoPlayStudentVoice(e.target.checked)}
                      className="w-5 h-5 accent-[#4F46E5] rounded cursor-pointer"
                    />
                    <span className="font-black text-xs text-[#1E40AF]">
                      {autoPlayStudentVoice ? "चालू करें (सक्रिय)" : "बंद (निष्क्रिय)"}
                    </span>
                  </label>
                </td>
                <td className="py-4 px-3 text-xs text-slate-600 leading-relaxed">
                  जब छात्र अपनी जनजातीय भाषा में उत्तर दे, तो उसका अनुवाद शिक्षक
                  की स्क्रीन पर तुरंत <strong>हिंदी ऑडियो एवं टेक्स्ट</strong> के
                  रूप में स्वतः बजे।
                </td>
              </tr>
            </tbody>
          </table>
        </div>
      </div>

      {/* 4. ऑफ़लाइन डेटा एवं स्टोरेज प्रबंधन (Offline & Storage Management) */}
      <div className="bg-white rounded-[16px] p-6 sm:p-7 shadow-xs border border-[#DBEAFE] space-y-5">
        <div className="flex items-center gap-3 border-b border-[#DBEAFE] pb-3">
          <div className="w-9 h-9 rounded-xl bg-[#EFF6FF] text-[#1E40AF] border border-[#DBEAFE] font-black flex items-center justify-center text-lg shadow-2xs">
            4
          </div>
          <div>
            <h2 className="text-base sm:text-lg font-black text-[#0F172A]">
              ऑफ़लाइन डेटा एवं स्टोरेज प्रबंधन
            </h2>
            <p className="text-xs text-slate-600">
              कम नेटवर्क वाले ग्रामीण क्षेत्रों में ऑफ़लाइन टैबलेट तत्परता और डेटा प्रबंधन।
            </p>
          </div>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs sm:text-sm">
            <thead>
              <tr className="border-b border-[#DBEAFE] text-slate-600 text-[11px] uppercase tracking-wider">
                <th className="py-3 px-3 font-bold w-1/4">सेटिंग का नाम</th>
                <th className="py-3 px-3 font-bold w-1/3">स्थिति / विकल्प</th>
                <th className="py-3 px-3 font-bold">विवरण एवं उपयोग</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-[#DBEAFE]">
              {/* Offline AI Engine Status */}
              <tr className="hover:bg-[#F8FAFC] transition">
                <td className="py-4 px-3 font-extrabold text-slate-800">
                  ऑफ़लाइन एआई इंजन स्थिति
                </td>
                <td className="py-4 px-3">
                  <div className="inline-flex items-center gap-2 bg-[#DBEAFE] text-[#1E40AF] border border-[#DBEAFE] px-3 py-1.5 rounded-xl font-black text-xs shadow-2xs">
                    <span className="w-2 h-2 rounded-full bg-[#1E40AF] animate-pulse"></span>
                    <span>● ऑफ़लाइन सक्रिय</span>
                  </div>
                </td>
                <td className="py-4 px-3 text-xs text-slate-600 leading-relaxed">
                  यह दर्शाता है कि बिना इंटरनेट के टैबलेट पर अनुवाद इंजन सही से
                  कार्य कर रहा है।
                </td>
              </tr>

              {/* Tablet Storage Usage */}
              <tr className="hover:bg-[#F8FAFC] transition">
                <td className="py-4 px-3 font-extrabold text-slate-800">
                  टैबलेट स्टोरेज उपयोग
                </td>
                <td className="py-4 px-3 space-y-1.5">
                  <div className="flex items-center justify-between text-xs font-black text-[#1E3A8A]">
                    <span>1.2 जीबी / 16 जीबी उपयोगित</span>
                    <span className="text-[11px] text-[#1E40AF] font-bold">
                      14.8 जीबी खाली
                    </span>
                  </div>
                  <div className="w-full bg-[#EFF6FF] border border-[#DBEAFE] h-3 rounded-full overflow-hidden p-0.5 shadow-2xs">
                    <div
                      className="bg-[#4F46E5] h-full rounded-full transition-all"
                      style={{ width: "7.5%" }}
                    ></div>
                  </div>
                </td>
                <td className="py-4 px-3 text-xs text-slate-600 leading-relaxed">
                  2 जीबी रैम / 16 जीबी स्टोरेज वाले सस्ते टैबलेट की मेमोरी स्थिति।
                </td>
              </tr>

              {/* Downloaded Offline Models */}
              <tr className="hover:bg-[#F8FAFC] transition">
                <td className="py-4 px-3 font-extrabold text-slate-800">
                  ऑफ़लाइन भाषा मॉडल डाउनलोड
                </td>
                <td className="py-4 px-3 space-y-1.5">
                  <label className="flex items-center gap-2 font-bold text-xs text-slate-800 cursor-pointer">
                    <input
                      type="checkbox"
                      checked={models.ho}
                      onChange={(e) =>
                        setModels({ ...models, ho: e.target.checked })
                      }
                      className="accent-[#4F46E5] w-4 h-4 rounded"
                    />
                    <span>हो (110 एमबी) — डाउनलोड किया गया</span>
                  </label>
                  <label className="flex items-center gap-2 font-bold text-xs text-slate-800 cursor-pointer">
                    <input
                      type="checkbox"
                      checked={models.mun}
                      onChange={(e) =>
                        setModels({ ...models, mun: e.target.checked })
                      }
                      className="accent-[#4F46E5] w-4 h-4 rounded"
                    />
                    <span>मुंडारी (120 एमबी) — डाउनलोड किया गया</span>
                  </label>
                  <label className="flex items-center gap-2 font-bold text-xs text-slate-800 cursor-pointer">
                    <input
                      type="checkbox"
                      checked={models.san}
                      onChange={(e) =>
                        setModels({ ...models, san: e.target.checked })
                      }
                      className="accent-[#4F46E5] w-4 h-4 rounded"
                    />
                    <span>संथाली (145 एमबी) — डाउनलोड किया गया</span>
                  </label>
                </td>
                <td className="py-4 px-3 text-xs text-slate-600 leading-relaxed">
                  इंटरनेट उपलब्ध होने पर शिक्षक अपनी आवश्यकतानुसार जनजातीय भाषा
                  के ऑडियो मॉडल डाउनलोड करके रख सकते हैं।
                </td>
              </tr>

              {/* Network Auto-Sync */}
              <tr className="hover:bg-[#F8FAFC] transition">
                <td className="py-4 px-3 font-extrabold text-slate-800">
                  ऑटो-सिंक सेटिंग्स
                </td>
                <td className="py-4 px-3">
                  <label className="flex items-center gap-2 font-bold text-xs text-slate-800 cursor-pointer">
                    <input
                      type="checkbox"
                      checked={autoSync}
                      onChange={(e) => setAutoSync(e.target.checked)}
                      className="accent-[#4F46E5] w-4 h-4 rounded"
                    />
                    <span>केवल वाई-फाई / मोबाइल नेटवर्क मिलने पर सिंक करें</span>
                  </label>
                </td>
                <td className="py-4 px-3 text-xs text-slate-600 leading-relaxed">
                  स्कूल में नेटवर्क आते ही छात्र मूल्यांकन और नई निपुण भारत पाठ
                  योजनाएँ स्वतः सिंक हो जाएँगी।
                </td>
              </tr>
            </tbody>
          </table>
        </div>
      </div>

      {/* Global Save Action Bar */}
      <div className="pt-2 flex items-center justify-end gap-3">
        <Link
          to="/teacher"
          className="px-5 py-3 rounded-xl border border-[#DBEAFE] bg-white text-xs font-bold text-slate-700 hover:bg-[#F8FAFC] transition shadow-2xs"
        >
          रद्द करें
        </Link>
        <button
          onClick={handleSave}
          style={{ background: "linear-gradient(135deg, #4F46E5 0%, #7C3AED 100%)" }}
          className="text-white font-black text-xs px-8 py-3.5 rounded-xl shadow-lg shadow-indigo-600/25 hover:opacity-95 transition duration-150 active:scale-95 flex items-center gap-2"
        >
          <span>💾</span>
          <span>सभी सेटिंग्स सेव करें</span>
        </button>
      </div>
    </div>
  );
}