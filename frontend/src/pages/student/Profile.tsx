import { useState } from "react";
import StudentPageBanner from "../../components/StudentPageBanner";

export default function StudentProfile() {
  const [isEditing, setIsEditing] = useState(false);

  // Form & profile states initialized from localStorage
  const [name, setName] = useState(
    () => localStorage.getItem("userName") || localStorage.getItem("studentName") || "सिदो मुर्मू"
  );
  const [grade, setGrade] = useState(
    () => localStorage.getItem("studentGrade") || localStorage.getItem("userGrade") || "कक्षा 1"
  );
  const [lang, setLang] = useState<"mun" | "san" | "ho">(
    () => (localStorage.getItem("preferredLang") as any) || "mun"
  );
  const [school, setSchool] = useState(
    () => localStorage.getItem("userSchool") || "राजकीय प्राथमिक विद्यालय, शिकारीपाड़ा"
  );
  const [phone, setPhone] = useState(
    () => localStorage.getItem("userPhone") || "9876543210"
  );
  const [rollNo, setRollNo] = useState(
    () => localStorage.getItem("studentRollNo") || "12"
  );
  const [avatar, setAvatar] = useState(
    () => localStorage.getItem("studentAvatar") || "👦"
  );

  const [toastMsg, setToastMsg] = useState("");

  const [stars] = useState<number>(() => {
    const saved = localStorage.getItem("studentStars");
    return saved ? Number(saved) : 24;
  });

  const AVATAR_OPTIONS = ["👦", "👧", "🦁", "🐯", "🚀", "🌟", "🎨", "📚", "🏹", "🌾"];

  const langLabel =
    lang === "mun"
      ? "मुंडारी (🌐 Mundari / Devanagari)"
      : lang === "san"
      ? "संथाली (🌐 Santhali / Ol Chiki)"
      : "हो (🌐 Ho / Warang Citi)";

  const handleSaveProfile = (e: React.FormEvent) => {
    e.preventDefault();

    // Save to localStorage
    localStorage.setItem("userName", name.trim());
    localStorage.setItem("studentName", name.trim());
    localStorage.setItem("studentGrade", grade);
    localStorage.setItem("userGrade", grade);
    localStorage.setItem("preferredLang", lang);
    localStorage.setItem("userSchool", school.trim());
    localStorage.setItem("userPhone", phone.trim());
    localStorage.setItem("studentRollNo", rollNo.trim());
    localStorage.setItem("studentAvatar", avatar);
    localStorage.setItem("userPhoto", avatar);

    // Notify other components (Layout, Home, Sidebar, UserAvatarDropdown)
    window.dispatchEvent(new Event("userProfileUpdated"));
    window.dispatchEvent(new Event("storage"));

    setIsEditing(false);
    setToastMsg("✓ आपकी प्रोफ़ाइल सफलतापूर्वक अपडेट व सहेज ली गई है!");
    setTimeout(() => setToastMsg(""), 4000);
  };

  const handleCancel = () => {
    // Reset to stored values
    setName(localStorage.getItem("userName") || localStorage.getItem("studentName") || "सिदो मुर्मू");
    setGrade(localStorage.getItem("studentGrade") || localStorage.getItem("userGrade") || "कक्षा 1");
    setLang((localStorage.getItem("preferredLang") as any) || "mun");
    setSchool(localStorage.getItem("userSchool") || "राजकीय प्राथमिक विद्यालय, शिकारीपाड़ा");
    setPhone(localStorage.getItem("userPhone") || "9876543210");
    setRollNo(localStorage.getItem("studentRollNo") || "12");
    setAvatar(localStorage.getItem("studentAvatar") || "👦");
    setIsEditing(false);
  };

  const BADGES = [
    { title: "गणित सितारा", icon: "⭐", desc: "गिनती 1 से 10 में निपुण", color: "from-amber-400 to-amber-600" },
    { title: "कहानी प्रेमी", icon: "🎧", desc: "4+ लोककथाएँ सुनीं", color: "from-rose-400 to-rose-600" },
    { title: "रंग कलाकार", icon: "🎨", desc: "3+ सुंदर चित्र बनाए", color: "from-purple-400 to-purple-600" },
    { title: "नियमित उपस्थिति", icon: "🏅", desc: "लगातार 7 दिन लाइव कक्षा", color: "from-emerald-400 to-emerald-600" },
  ];

  return (
    <div className="p-4 sm:p-7 bg-[#F8FAFC] min-h-full space-y-6 max-w-5xl mx-auto font-sans">
      {/* 1. Header Banner matching Image 2 & Banner Specs */}
      <StudentPageBanner
        icon="👤"
        title="मेरी प्रोफ़ाइल"
        subtitle="आपकी अध्ययन पहचान, व्यक्तिगत विवरण और अर्जित पुरस्कार सितारे"
        tag={`⭐ ${stars} कुल सितारे`}
        gradientClass="from-[#2563EB] to-[#7C3AED]"
      />

      {/* Toast Notification */}
      {toastMsg && (
        <div className="bg-emerald-50 border-2 border-emerald-400 text-emerald-900 p-4 rounded-2xl flex items-center justify-between gap-3 shadow-md animate-in fade-in zoom-in-95">
          <div className="flex items-center gap-2.5 font-black text-sm">
            <span className="text-xl">✅</span>
            <span>{toastMsg}</span>
          </div>
          <button
            type="button"
            onClick={() => setToastMsg("")}
            className="text-emerald-700 hover:text-emerald-900 text-sm font-black px-2 py-1 rounded-lg hover:bg-emerald-100"
          >
            ✕
          </button>
        </div>
      )}

      {/* 2. Student Identity Card (View Mode / Edit Mode) */}
      <div className="bg-white rounded-3xl border border-[#C7D2FE] p-6 sm:p-8 shadow-sm space-y-6">
        <div className="flex flex-wrap items-center justify-between gap-4 border-b border-slate-100 pb-5">
          <div className="flex items-center gap-3">
            <div className="w-14 h-14 rounded-2xl bg-gradient-to-br from-blue-500 to-indigo-600 text-white flex items-center justify-center text-3xl shadow-md border-2 border-white">
              {avatar}
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h2 className="text-xl font-black text-slate-900">{name}</h2>
                <span className="bg-blue-100 text-[#1E56A0] text-xs font-black px-2.5 py-0.5 rounded-full border border-blue-200">
                  {grade}
                </span>
              </div>
              <p className="text-xs text-slate-500 font-semibold mt-0.5">
                आईडी: VS-STU-2026 • रोल नं: {rollNo}
              </p>
            </div>
          </div>

          <div className="flex items-center gap-2.5">
            {!isEditing ? (
              <button
                type="button"
                onClick={() => setIsEditing(true)}
                className="bg-blue-600 hover:bg-blue-700 text-white font-black text-xs px-4 py-2.5 rounded-xl transition flex items-center gap-2 shadow-sm active:scale-95 cursor-pointer"
              >
                <span>✏️</span>
                <span>प्रोफ़ाइल संपादित करें</span>
              </button>
            ) : (
              <span className="text-xs font-black text-blue-700 bg-blue-50 px-3 py-1.5 rounded-xl border border-blue-200">
                📝 संपादन मोड सक्रिय
              </span>
            )}
          </div>
        </div>

        {/* View Details Mode */}
        {!isEditing ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
            <div className="bg-[#EEF2FF] p-4.5 rounded-2xl border border-[#C7D2FE] space-y-1">
              <span className="text-[11px] font-bold text-slate-500 uppercase tracking-wider block">
                विद्यार्थी का पूरा नाम:
              </span>
              <p className="text-base font-black text-slate-900">{name}</p>
            </div>

            <div className="bg-[#EEF2FF] p-4.5 rounded-2xl border border-[#C7D2FE] space-y-1">
              <span className="text-[11px] font-bold text-slate-500 uppercase tracking-wider block">
                कक्षा (Class / Grade):
              </span>
              <p className="text-base font-black text-[#1E56A0]">{grade}</p>
            </div>

            <div className="bg-[#EEF2FF] p-4.5 rounded-2xl border border-[#C7D2FE] space-y-1">
              <span className="text-[11px] font-bold text-slate-500 uppercase tracking-wider block">
                मातृभाषा (Mother Tongue):
              </span>
              <p className="text-base font-black text-slate-800">{langLabel}</p>
            </div>

            <div className="bg-[#EEF2FF] p-4.5 rounded-2xl border border-[#C7D2FE] space-y-1 sm:col-span-2">
              <span className="text-[11px] font-bold text-slate-500 uppercase tracking-wider block">
                विद्यालय का नाम (School):
              </span>
              <p className="text-base font-black text-slate-800">{school}</p>
            </div>

            <div className="bg-[#EEF2FF] p-4.5 rounded-2xl border border-[#C7D2FE] space-y-1">
              <span className="text-[11px] font-bold text-slate-500 uppercase tracking-wider block">
                अभिभावक का फोन नं:
              </span>
              <p className="text-base font-black text-slate-800">📱 {phone}</p>
            </div>
          </div>
        ) : (
          /* Edit Mode Form */
          <form onSubmit={handleSaveProfile} className="space-y-6 animate-in fade-in duration-200">
            {/* Avatar Picker */}
            <div className="space-y-2.5 bg-[#EEF2FF] p-4.5 rounded-2xl border border-[#C7D2FE]">
              <label className="block text-xs font-black text-slate-800 uppercase tracking-wider">
                १. अपनी पसंद का प्रोफ़ाइल अवतार चुनें:
              </label>
              <div className="flex flex-wrap gap-2.5">
                {AVATAR_OPTIONS.map((av) => (
                  <button
                    key={av}
                    type="button"
                    onClick={() => setAvatar(av)}
                    className={`w-11 h-11 rounded-2xl text-2xl flex items-center justify-center transition cursor-pointer ${
                      avatar === av
                        ? "bg-blue-600 text-white scale-110 shadow-md ring-2 ring-blue-400"
                        : "bg-white hover:bg-slate-100 border border-[#C7D2FE]"
                    }`}
                  >
                    {av}
                  </button>
                ))}
              </div>
            </div>

            {/* Inputs Grid */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              {/* Name */}
              <div className="space-y-1.5">
                <label className="block text-xs font-black text-slate-700">
                  विद्यार्थी का नाम: <span className="text-red-500">*</span>
                </label>
                <input
                  type="text"
                  required
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  placeholder="उदा. सिदो मुर्मू"
                  className="w-full bg-slate-50 border border-slate-300 focus:border-blue-500 focus:bg-white rounded-xl px-3.5 py-2.5 text-sm font-bold text-slate-900 outline-none transition"
                />
              </div>

              {/* Grade */}
              <div className="space-y-1.5">
                <label className="block text-xs font-black text-slate-700">
                  कक्षा (Class / Grade): <span className="text-red-500">*</span>
                </label>
                <select
                  value={grade}
                  onChange={(e) => setGrade(e.target.value)}
                  className="w-full bg-slate-50 border border-slate-300 focus:border-blue-500 focus:bg-white rounded-xl px-3.5 py-2.5 text-sm font-bold text-slate-900 outline-none transition cursor-pointer"
                >
                  <option value="कक्षा 1">कक्षा 1</option>
                  <option value="कक्षा 2">कक्षा 2</option>
                  <option value="कक्षा 3">कक्षा 3</option>
                  <option value="कक्षा 4">कक्षा 4</option>
                  <option value="कक्षा 5">कक्षा 5</option>
                </select>
              </div>

              {/* Mother Tongue */}
              <div className="space-y-1.5">
                <label className="block text-xs font-black text-slate-700">
                  मातृभाषा (Tribal Language): <span className="text-red-500">*</span>
                </label>
                <select
                  value={lang}
                  onChange={(e) => setLang(e.target.value as any)}
                  className="w-full bg-slate-50 border border-slate-300 focus:border-blue-500 focus:bg-white rounded-xl px-3.5 py-2.5 text-sm font-bold text-slate-900 outline-none transition cursor-pointer"
                >
                  <option value="mun">🌾 मुंडारी (Mundari)</option>
                  <option value="san">🏹 संथाली (Santhali)</option>
                  <option value="ho">🌿 हो (Ho)</option>
                </select>
              </div>

              {/* Roll No */}
              <div className="space-y-1.5">
                <label className="block text-xs font-black text-slate-700">
                  रोल नंबर / अनुक्रमांक:
                </label>
                <input
                  type="text"
                  value={rollNo}
                  onChange={(e) => setRollNo(e.target.value)}
                  placeholder="उदा. 12"
                  className="w-full bg-slate-50 border border-slate-300 focus:border-blue-500 focus:bg-white rounded-xl px-3.5 py-2.5 text-sm font-bold text-slate-900 outline-none transition"
                />
              </div>

              {/* School */}
              <div className="space-y-1.5 sm:col-span-2">
                <label className="block text-xs font-black text-slate-700">
                  विद्यालय का नाम:
                </label>
                <input
                  type="text"
                  value={school}
                  onChange={(e) => setSchool(e.target.value)}
                  placeholder="उदा. राजकीय प्राथमिक विद्यालय"
                  className="w-full bg-slate-50 border border-slate-300 focus:border-blue-500 focus:bg-white rounded-xl px-3.5 py-2.5 text-sm font-bold text-slate-900 outline-none transition"
                />
              </div>

              {/* Parent Phone */}
              <div className="space-y-1.5 sm:col-span-2">
                <label className="block text-xs font-black text-slate-700">
                  माता-पिता / अभिभावक का संपर्क नंबर:
                </label>
                <input
                  type="tel"
                  value={phone}
                  onChange={(e) => setPhone(e.target.value)}
                  placeholder="उदा. 9876543210"
                  className="w-full bg-slate-50 border border-slate-300 focus:border-blue-500 focus:bg-white rounded-xl px-3.5 py-2.5 text-sm font-bold text-slate-900 outline-none transition"
                />
              </div>
            </div>

            {/* Action Buttons */}
            <div className="flex flex-wrap items-center justify-end gap-3 pt-3 border-t border-slate-100">
              <button
                type="button"
                onClick={handleCancel}
                className="px-5 py-2.5 rounded-xl border border-slate-300 text-slate-700 hover:bg-slate-100 font-bold text-xs transition cursor-pointer"
              >
                ✕ रद्द करें
              </button>
              <button
                type="submit"
                className="px-6 py-2.5 rounded-xl bg-blue-600 hover:bg-blue-700 text-white font-black text-xs transition shadow-md flex items-center gap-2 cursor-pointer active:scale-95"
              >
                <span>💾 बदलाव सहेजें</span>
              </button>
            </div>
          </form>
        )}
      </div>

      {/* 3. Rewards & Stars Section */}
      <div className="bg-white rounded-3xl border border-[#C7D2FE] p-6 sm:p-8 shadow-sm space-y-6">
        <div className="flex items-center justify-between border-b border-slate-100 pb-4">
          <div className="flex items-center gap-2.5">
            <span className="text-2xl">⭐</span>
            <h2 className="text-lg font-black text-slate-900">
              अर्जित सितारे व बैज (Stars & Rewards)
            </h2>
          </div>
          <div className="bg-amber-100 text-amber-900 font-black text-sm px-4 py-1.5 rounded-full border border-amber-300 flex items-center gap-1.5 shadow-2xs">
            <span>⭐</span>
            <span>कुल {stars} सितारे</span>
          </div>
        </div>

        {/* Badges Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          {BADGES.map((b) => (
            <div
              key={b.title}
              className="bg-[#EEF2FF] p-4 rounded-2xl border border-[#C7D2FE] text-center space-y-2.5 hover:shadow-md transition"
            >
              <div
                className={`w-14 h-14 mx-auto rounded-2xl bg-gradient-to-br ${b.color} text-white text-2xl flex items-center justify-center shadow-md`}
              >
                {b.icon}
              </div>
              <div>
                <h3 className="text-sm font-black text-slate-900">{b.title}</h3>
                <p className="text-xs text-slate-600 font-medium mt-0.5">{b.desc}</p>
              </div>
              <span className="inline-block bg-white text-emerald-700 text-[11px] font-bold px-2 py-0.5 rounded-md border border-[#C7D2FE]">
                ✓ अनलॉक
              </span>
            </div>
          ))}
        </div>

        {/* Motivational Card */}
        <div className="bg-gradient-to-r from-blue-50 to-indigo-50 p-5 rounded-2xl border border-blue-200 flex items-center gap-4">
          <span className="text-3xl">🎉</span>
          <div>
            <h4 className="text-sm font-black text-blue-900">
              शाबाश {name}! आप नियमित रूप से अभ्यास कर रहे हैं
            </h4>
            <p className="text-xs text-slate-600 font-medium mt-0.5">
              प्रत्येक पूर्ण वर्कशीट, क्विज़ और लाइव कक्षा के लिए आपको और नए सितारे मिलेंगे!
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
