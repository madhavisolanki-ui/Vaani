import { useState } from "react";
import StudentPageBanner from "../../components/StudentPageBanner";

export default function StudentSettings() {
  const [selectedLang, setSelectedLang] = useState<"mun" | "san" | "ho">(
    (localStorage.getItem("preferredLang") as any) || "mun"
  );
  const [speechSpeed, setSpeechSpeed] = useState(
    localStorage.getItem("speechSpeed") || "1.0"
  );
  const [autoPlayAudio, setAutoPlayAudio] = useState(
    localStorage.getItem("autoPlayAudio") !== "false"
  );

  // Student Profile fields in Settings
  const [name, setName] = useState(
    localStorage.getItem("userName") || localStorage.getItem("studentName") || "सिदो मुर्मू"
  );
  const [grade, setGrade] = useState(
    localStorage.getItem("studentGrade") || localStorage.getItem("userGrade") || "कक्षा 1"
  );
  const [school, setSchool] = useState(
    localStorage.getItem("userSchool") || "राजकीय प्राथमिक विद्यालय, शिकारीपाड़ा"
  );
  const [phone, setPhone] = useState(
    localStorage.getItem("userPhone") || "9876543210"
  );

  const [toastMsg, setToastMsg] = useState("");

  const handleSave = () => {
    localStorage.setItem("preferredLang", selectedLang);
    localStorage.setItem("speechSpeed", speechSpeed);
    localStorage.setItem("autoPlayAudio", String(autoPlayAudio));

    localStorage.setItem("userName", name.trim());
    localStorage.setItem("studentName", name.trim());
    localStorage.setItem("studentGrade", grade);
    localStorage.setItem("userGrade", grade);
    localStorage.setItem("userSchool", school.trim());
    localStorage.setItem("userPhone", phone.trim());

    // Trigger update for other components
    window.dispatchEvent(new Event("userProfileUpdated"));
    window.dispatchEvent(new Event("storage"));

    setToastMsg("प्राथमिकताएं एवं प्रोफ़ाइल विवरण सफलतापूर्वक सहेज लिए गए! ✓");
    setTimeout(() => setToastMsg(""), 3500);
  };

  return (
    <div className="p-4 sm:p-7 bg-[#F8FAFC] min-h-full space-y-6 max-w-4xl mx-auto font-sans">
      {/* 1. Header Banner matching Image 2 */}
      <StudentPageBanner
        icon="⚙️"
        title="सेटिंग्स"
        subtitle="अपनी स्थानीय मातृभाषा, व्यक्तिगत प्रोफ़ाइल और पठन प्राथमिकताएं निर्धारित करें"
        tag="व्यक्तिगत विकल्प"
        gradientClass="from-[#2563EB] to-[#7C3AED]"
      />

      {/* Settings Form Card */}
      <div className="bg-white rounded-[16px] border border-[#C7D2FE] p-6 sm:p-8 shadow-sm space-y-7">
        {/* 1. Student Identity Settings */}
        <div className="space-y-4">
          <div className="flex items-center gap-2 border-b border-slate-100 pb-2">
            <span className="text-xl">👤</span>
            <label className="text-xs font-black text-slate-800 uppercase tracking-wider block">
              १. विद्यार्थी प्रोफ़ाइल विवरण (Student Profile Details):
            </label>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div className="space-y-1">
              <label className="block text-xs font-bold text-slate-700">विद्यार्थी का नाम:</label>
              <input
                type="text"
                value={name}
                onChange={(e) => setName(e.target.value)}
                placeholder="उदा. सिदो मुर्मू"
                className="w-full bg-slate-50 border border-slate-300 focus:border-blue-500 focus:bg-white rounded-xl px-3.5 py-2 text-sm font-bold text-slate-900 outline-none transition"
              />
            </div>

            <div className="space-y-1">
              <label className="block text-xs font-bold text-slate-700">कक्षा (Class / Grade):</label>
              <select
                value={grade}
                onChange={(e) => setGrade(e.target.value)}
                className="w-full bg-slate-50 border border-slate-300 focus:border-blue-500 focus:bg-white rounded-xl px-3.5 py-2 text-sm font-bold text-slate-900 outline-none transition cursor-pointer"
              >
                <option value="कक्षा 1">कक्षा 1</option>
                <option value="कक्षा 2">कक्षा 2</option>
                <option value="कक्षा 3">कक्षा 3</option>
                <option value="कक्षा 4">कक्षा 4</option>
                <option value="कक्षा 5">कक्षा 5</option>
              </select>
            </div>

            <div className="space-y-1 sm:col-span-2">
              <label className="block text-xs font-bold text-slate-700">विद्यालय का नाम:</label>
              <input
                type="text"
                value={school}
                onChange={(e) => setSchool(e.target.value)}
                placeholder="उदा. राजकीय प्राथमिक विद्यालय"
                className="w-full bg-slate-50 border border-slate-300 focus:border-blue-500 focus:bg-white rounded-xl px-3.5 py-2 text-sm font-bold text-slate-900 outline-none transition"
              />
            </div>

            <div className="space-y-1 sm:col-span-2">
              <label className="block text-xs font-bold text-slate-700">अभिभावक का फोन नं:</label>
              <input
                type="tel"
                value={phone}
                onChange={(e) => setPhone(e.target.value)}
                placeholder="उदा. 9876543210"
                className="w-full bg-slate-50 border border-slate-300 focus:border-blue-500 focus:bg-white rounded-xl px-3.5 py-2 text-sm font-bold text-slate-900 outline-none transition"
              />
            </div>
          </div>
        </div>

        {/* 2. Mother Tongue Selection */}
        <div className="space-y-3 pt-4 border-t border-slate-100">
          <label className="block text-xs font-black text-slate-800 uppercase tracking-wider">
            २. अपनी पसंदीदा मातृभाषा चुनें (Target Tribal Language):
          </label>
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
            {[
              { id: "mun", label: "मुंडारी", script: "Devanagari / Mundari", icon: "🌾" },
              { id: "san", label: "संथाली", script: "Ol Chiki (ᱚᱞ ᱪᱤᱠᱤ)", icon: "🏹" },
              { id: "ho", label: "हो", script: "Warang Citi (𑢹𑣉)", icon: "🌿" },
            ].map((lang) => (
              <button
                type="button"
                key={lang.id}
                onClick={() => setSelectedLang(lang.id as any)}
                className={`p-4 rounded-2xl border text-left transition cursor-pointer flex flex-col justify-between space-y-2 ${
                  selectedLang === lang.id
                    ? "bg-[#EEF2FF] border-blue-600 ring-2 ring-blue-500 shadow-sm"
                    : "bg-[#F8FAFC] border-slate-200 hover:border-[#C7D2FE]"
                }`}
              >
                <div className="flex items-center justify-between">
                  <span className="text-2xl">{lang.icon}</span>
                  {selectedLang === lang.id && (
                    <span className="text-blue-600 font-black text-sm">✓ सक्रिय</span>
                  )}
                </div>
                <div>
                  <h3 className="text-base font-black text-slate-900">{lang.label}</h3>
                  <p className="text-xs font-semibold text-slate-500">{lang.script}</p>
                </div>
              </button>
            ))}
          </div>
        </div>

        {/* 3. Voice & Speech Speed */}
        <div className="space-y-3 pt-3 border-t border-slate-100">
          <label className="block text-xs font-black text-slate-800 uppercase tracking-wider">
            ३. ऑडियो उच्चारण एवं बोलने की गति:
          </label>
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
            {[
              { val: "0.8", label: "धीमी गति (०.८x)", desc: "छोटे बच्चों के लिए सहज" },
              { val: "1.0", label: "सामान्य गति (१.०x)", desc: "डिफ़ॉल्ट आवाज़ गति" },
              { val: "1.2", label: "तेज़ गति (१.२x)", desc: "त्वरित अभ्यास के लिए" },
            ].map((spd) => (
              <button
                type="button"
                key={spd.val}
                onClick={() => setSpeechSpeed(spd.val)}
                className={`p-3.5 rounded-2xl border text-left transition cursor-pointer ${
                  speechSpeed === spd.val
                    ? "bg-[#EEF2FF] border-blue-600 ring-2 ring-blue-500 shadow-sm"
                    : "bg-[#F8FAFC] border-slate-200 hover:border-[#C7D2FE]"
                }`}
              >
                <h4 className="text-sm font-black text-slate-900">{spd.label}</h4>
                <p className="text-xs font-medium text-slate-500 mt-0.5">{spd.desc}</p>
              </button>
            ))}
          </div>
        </div>

        {/* 4. Auto-play Voice Toggle */}
        <div className="flex items-center justify-between p-4 rounded-2xl bg-[#EEF2FF] border border-[#C7D2FE]">
          <div>
            <h4 className="text-sm font-black text-slate-900">
              ४. प्रश्न खुलते ही स्वतः आवाज़ बोलना (Auto-speak)
            </h4>
            <p className="text-xs text-slate-600 font-medium mt-0.5">
              वर्कशीट या फ़्लैशकार्ड खोलते ही प्रश्न पढ़कर सुनाना
            </p>
          </div>
          <button
            type="button"
            onClick={() => setAutoPlayAudio(!autoPlayAudio)}
            className={`w-12 h-6 flex items-center rounded-full p-1 cursor-pointer transition ${
              autoPlayAudio ? "bg-blue-600 justify-end" : "bg-slate-300 justify-start"
            }`}
          >
            <span className="bg-white w-4 h-4 rounded-full shadow-md"></span>
          </button>
        </div>

        {/* Save Controls */}
        <div className="pt-2 flex flex-col sm:flex-row items-center justify-between gap-3 border-t border-slate-100">
          <div>
            {toastMsg && (
              <span className="text-xs font-black text-emerald-700 bg-emerald-50 px-3 py-1.5 rounded-xl border border-emerald-200">
                {toastMsg}
              </span>
            )}
          </div>
          <button
            type="button"
            onClick={handleSave}
            className="w-full sm:w-auto bg-blue-600 hover:bg-blue-700 text-white font-black text-xs px-8 py-3 rounded-xl shadow-md transition cursor-pointer active:scale-95"
          >
            सेटिंग्स व प्रोफ़ाइल सहेजें ➔
          </button>
        </div>
      </div>
    </div>
  );
}
