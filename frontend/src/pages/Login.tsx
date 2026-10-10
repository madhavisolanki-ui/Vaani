import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { loginApi, registerApi } from "../api/auth";

export default function Login() {
  // First option is Register by default, beside it is Sign In
  const [mode, setMode] = useState<"register" | "login">("register");

  // First selection is Role (Teacher vs Student)
  const [role, setRole] = useState<"teacher" | "student">("teacher");

  // Form Fields
  const [name, setName] = useState("");
  const [phone, setPhone] = useState("");
  const [schoolName, setSchoolName] = useState("");
  const [address, setAddress] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [preferredLang, setPreferredLang] = useState<"san" | "ho" | "mun">("san");
  const [studentGrade, setStudentGrade] = useState("कक्षा 1");

  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  // Dynamic Dictionary based on selected Role
  const isTeacher = role === "teacher";

  // Everywhere Santhali is used, first Devanagari script, followed by (Ol Chiki Script)
  const ui = {
    tagline: isTeacher
      ? "✨ हिंदी से आदिवासी भाषा एआई टूलकिट (Jharkhand MTB-MLE)"
      : "✨ संथाली आयो आड़ांग सेचेद प्लेटफ़ॉर्म (ᱥᱟᱱᱛᱟᱲᱤ ᱟᱭᱳ ᱟᱲᱟᱝ ᱥᱮᱪᱮᱫ ᱯᱞᱮᱴᱯᱷᱚᱨᱢ)",
    tabRegister: isTeacher ? "पंजीकरण" : "रेजिस्टार (ᱨᱮᱡᱤᱥᱴᱟᱨ)",
    tabLogin: isTeacher ? "साइन इन" : "साइन इन (ᱥᱟᱭᱤᱱ ᱤᱱ)",
    roleLabel: isTeacher ? "१. भूमिका चुनें:" : "१. ठांव / रोल बाछाव मे (᱑. ᱴᱷᱟᱶ / ᱨᱳᱞ ᱵᱟᱪᱷᱟᱣ ᱢᱮ):",
    teacherRoleName: isTeacher ? "शिक्षक" : "माचेत (ᱢᱟᱪᱮᱛ)",
    studentRoleName: isTeacher ? "छात्र" : "चेदेदिय़ा (ᱥᱮᱪᱮᱫᱤᱭᱟᱹ)",
    nameLabel: isTeacher ? "पूरा नाम:" : "आमाग पुराय ञुतुम (ᱟᱢᱟᱜ ᱯᱩᱨᱟᱹ ᱧᱩᱛᱩᱢ):",
    namePlaceholder: isTeacher ? "माधवी कुमारी" : "सिदो मुर्मू (ᱥᱤᱫᱳ ᱢᱩᱨᱢᱩ)",
    phoneLabel: isTeacher ? "मोबाइल / फ़ोन नंबर:" : "फोन / मोबाइल लम्बर (ᱯᱷᱳᱱ ᱮᱞ):",
    phonePlaceholder: isTeacher ? "उदा. 9876543210 (10 अंक)" : "9876543210 (᱑᱐ ᱮᱞ)",
    phoneRequired: isTeacher ? "कृपया 10 अंकों का मान्य मोबाइल नंबर दर्ज करें।" : "दाया काते १० अंक फोन लम्बर ओल मे (ᱫᱟᱭᱟ ᱠᱟᱛᱮ ᱑᱐ ᱮᱞ ᱯᱷᱳᱱ ᱮᱞ ᱚᱞ ᱢᱮ)৷",
    schoolLabel: isTeacher ? "विद्यालय का नाम:" : "बिरदाग़ार / स्कूल ञुतुम (ᱵᱤᱨᱫᱟᱹᱜᱟᱲ ᱧᱩᱛᱩᱢ):",
    schoolPlaceholder: isTeacher ? "उदा. राजकीय प्राथमिक विद्यालय, शिकारीपाड़ा" : "सरकारी प्राथमिक विद्यालय (ᱥᱚᱨᱠᱟᱨᱤ ᱵᱤᱨᱫᱟᱹᱜᱟᱲ)",
    addressLabel: isTeacher ? "पता / स्थान (ब्लॉक, ज़िला):" : "आतो / ठिकणा (ᱟᱛᱳ / ᱴᱷᱤᱠᱬᱟᱹ):",
    addressPlaceholder: isTeacher ? "उदा. शिकारीपाड़ा, ज़िला: दुमका, झारखंड" : "शिकारीपाड़ा, दुमका (ᱫᱩᱢᱠᱟ)",
    emailLabel: isTeacher ? "ईमेल पता:" : "ईमेल ठिकणा (ᱤᱢᱮᱞ ᱴᱷᱤᱠᱬᱟᱹ):",
    emailPlaceholder: isTeacher ? "teacher@school.in" : "student@school.in",
    passwordLabel: isTeacher ? "पासवर्ड:" : "दानांग साबाद / पासवर्ड (ᱫᱟᱱᱟᱝ ᱥᱟᱵᱟᱫ):",
    passwordPlaceholder: isTeacher ? "कम से कम ६ अक्षर दर्ज करें" : "कम खोन कम ६ आखोर (ᱠᱚᱢ ᱠᱷᱚᱱ ᱠᱚᱢ ᱖ ᱟᱹᱠᱷᱚᱨ)",
    mediumLabel: isTeacher ? "शिक्षण माध्यम:" : "आमाग आयो आड़ांग (ᱟᱢᱟᱜ ᱟᱭᱳ ᱟᱲᱟᱝ):",
    hindiMediumBadge: isTeacher ? "हिंदी माध्यम" : "हिंदी",
    registerBtn: isTeacher ? "शिक्षक खाता बनाएं ➔" : "चेदेदिय़ा एकाउन्ट बेनाव मे (ᱥᱮᱪᱮᱫᱤᱭᱟᱹ ᱮᱠᱟᱣᱩᱱᱴ ᱵᱮᱱᱟᱣ ᱢᱮ) ➔",
    loginBtn: isTeacher ? "लॉग इन करें ➔" : "साइन इन मे (ᱥᱟᱭᱤᱱ ᱤᱱ ᱢᱮ) ➔",
    loadingRegister: isTeacher ? "खाता बनाया जा रहा है..." : "एकाउन्ट बेनावग काना... (ᱮᱠᱟᱣᱩᱱᱴ ᱵᱮᱱᱟᱣᱜ ᱠᱟᱱᱟ...)",
    loadingLogin: isTeacher ? "सत्यापित किया जा रहा है..." : "साइन इन चालाग काना... (ᱥᱟᱭᱤᱱ ᱤᱱ ᱪᱟᱞᱟᱜ ᱠᱟᱱᱟ...)",
    alreadyHaveAccount: isTeacher ? "पहले से खाता है?" : "माड़ांग खोन एकाउन्ट मेनाग-आ? (ᱢᱟᱲᱟᱝ ᱠᱷᱚᱱ ᱮᱠᱟᱣᱩᱱᱴ ᱢᱮᱱᱟᱜ-ᱟ?)",
    switchToLogin: isTeacher ? "लॉग इन करें" : "साइन इन मे (ᱥᱟᱭᱤᱱ ᱤᱱ ᱢᱮ)",
    dontHaveAccount: isTeacher ? "खाता नहीं है?" : "एकाउन्ट बानूग-आ? (ᱮᱠᱟᱣᱩᱱᱴ ᱵᱟᱹᱱᱩᱜ-ᱟ?)",
    switchToRegister: isTeacher ? "नया पंजीकरण करें" : "नांवा रेजिस्टार मे (ᱱᱟᱶᱟ ᱨᱮᱡᱤᱥᱴᱟᱨ ᱢᱮ)",
    gradeLabel: isTeacher ? "कक्षा:" : "कक्षा / चानच (ᱪᱟᱱᱟᱪ):",
    nameRequired: isTeacher ? "कृपया अपना पूरा नाम दर्ज करें।" : "दाया काते आमाग पुराय ञुतुम ओल मे (ᱫᱟᱭᱟ ᱠᱟᱛᱮ ᱟᱢᱟᱜ ᱯᱩᱨᱟᱹ ᱧᱩᱛᱩᱢ ᱚᱞ ᱢᱮ)৷",
    authFailed: isTeacher ? "लॉग इन विफल रहा। कृपया ईमेल और पासवर्ड की जाँच करें।" : "लोगिन बाय हुई लेना (ᱞᱚᱜᱤᱱ ᱵᱟᱭ ᱦᱩᱭ ᱞᱮᱱᱟ)৷",
  };

  const handleRoleChange = (newRole: "teacher" | "student") => {
    setRole(newRole);
    setError("");
    if (mode === "login") {
      if (newRole === "teacher") {
        setEmail("teacher@test.com");
        setPassword("123456");
      } else {
        setEmail("student@test.com");
        setPassword("123456");
      }
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    setLoading(true);

    try {
      if (mode === "login") {
        const data = await loginApi(email, password);
        localStorage.setItem("token", data.token);
        localStorage.setItem("role", data.role);
        localStorage.setItem("userEmail", email);
        const resolvedName =
          data.user?.name || (email.toLowerCase().includes("teacher") ? "Madhavi" : "Student");
        localStorage.setItem("userName", resolvedName);
        if (data.user?.phone) localStorage.setItem("userPhone", data.user.phone);
        if (data.user?.schoolName) localStorage.setItem("userSchool", data.user.schoolName);
        if (data.user?.address) localStorage.setItem("userAddress", data.user.address);
        localStorage.setItem("studentGrade", data.user?.grade || "कक्षा 1");
        localStorage.setItem("preferredLang", data.user?.preferredLang || (role === "teacher" ? "san" : preferredLang));
        navigate(data.role === "teacher" ? "/teacher" : "/student");
      } else {
        if (!name.trim()) {
          setError(ui.nameRequired);
          setLoading(false);
          return;
        }
        if (role === "teacher" && (!phone.trim() || phone.trim().length < 10)) {
          setError(ui.phoneRequired);
          setLoading(false);
          return;
        }
        const data = await registerApi({
          name: name.trim(),
          email: email.trim(),
          phone: phone.trim(),
          schoolName: schoolName.trim(),
          address: address.trim(),
          password,
          role,
          grade: studentGrade,
          preferredLang: role === "teacher" ? "san" : preferredLang,
        });
        localStorage.setItem("token", data.token);
        localStorage.setItem("role", data.role);
        localStorage.setItem("userEmail", email.trim());
        localStorage.setItem("userName", data.user?.name || name.trim());
        if (phone.trim()) localStorage.setItem("userPhone", phone.trim());
        if (schoolName.trim()) localStorage.setItem("userSchool", schoolName.trim());
        if (address.trim()) localStorage.setItem("userAddress", address.trim());
        localStorage.setItem("studentGrade", data.user?.grade || studentGrade || "कक्षा 1");
        localStorage.setItem("preferredLang", preferredLang);
        navigate(data.role === "teacher" ? "/teacher" : "/dashboard");
      }
    } catch (err: any) {
      console.error("Auth error:", err);
      const msg = err.response?.data?.error || ui.authFailed;
      setError(msg);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-[#1E56A0] via-[#164580] to-[#0F172A] p-4 sm:p-6 relative overflow-hidden font-sans">
      {/* Decorative Ambient Background Soft Glows with Backdrop Blur */}
      <div className="absolute top-[-10%] left-[-10%] w-[500px] h-[500px] bg-blue-400/20 rounded-full blur-[120px] pointer-events-none"></div>
      <div className="absolute bottom-[-10%] right-[-10%] w-[500px] h-[500px] bg-sky-300/20 rounded-full blur-[120px] pointer-events-none"></div>

      {/* Main Card with Soft Light Blue (#EEF2FF) and Light Blue (#C7D2FE) Border */}
      <div className="w-full max-w-lg bg-[#EEF2FF] rounded-[16px] shadow-2xl p-6 sm:p-9 border border-[#C7D2FE] relative z-10 space-y-6">
        {/* Brand Header */}
        <div className="text-center space-y-2">
          <div className="w-14 h-14 bg-white border-2 border-[#C7D2FE] rounded-2xl flex items-center justify-center mx-auto shadow-2xs">
            <span className="text-2xl">🎓</span>
          </div>
          <span className="inline-block bg-white text-[#1E56A0] border border-[#C7D2FE] text-[11px] font-black px-3 py-1 rounded-full uppercase tracking-wider shadow-2xs">
            {ui.tagline}
          </span>
          <h1 className="text-3xl font-black text-slate-900">
            Vaani<span className="text-[#E05638]">Setu</span>
          </h1>
        </div>

        {/* 1. TABS: Register First, Sign In Beside It */}
        <div className="flex bg-white p-1.5 rounded-xl border border-[#C7D2FE] shadow-2xs">
          <button
            type="button"
            onClick={() => {
              setMode("register");
              setError("");
              setName("");
              setPhone("");
              setSchoolName("");
              setAddress("");
              setEmail("");
              setPassword("");
            }}
            className={`flex-1 py-3 text-xs sm:text-sm font-black rounded-lg transition-all duration-150 ${
              mode === "register"
                ? "bg-[#1E56A0] text-white shadow-md shadow-[#1E56A0]/25"
                : "text-slate-600 hover:text-slate-900"
            }`}
          >
            {ui.tabRegister}
          </button>
          <button
            type="button"
            onClick={() => {
              setMode("login");
              setError("");
              if (role === "teacher") {
                setEmail("teacher@test.com");
                setPassword("123456");
              } else {
                setEmail("student@test.com");
                setPassword("123456");
              }
            }}
            className={`flex-1 py-3 text-xs sm:text-sm font-black rounded-lg transition-all duration-150 ${
              mode === "login"
                ? "bg-[#1E56A0] text-white shadow-md shadow-[#1E56A0]/25"
                : "text-slate-600 hover:text-slate-900"
            }`}
          >
            {ui.tabLogin}
          </button>
        </div>

        {/* 2. ROLE SELECTION */}
        <div className="bg-white p-4 rounded-xl border border-[#C7D2FE] shadow-2xs space-y-2">
          <label className="block text-xs font-black text-slate-800 uppercase tracking-wider">
            {ui.roleLabel}
          </label>
          <div className="grid grid-cols-2 gap-3">
            <button
              type="button"
              onClick={() => handleRoleChange("teacher")}
              className={`p-3.5 rounded-xl border text-xs sm:text-sm font-black flex items-center justify-center gap-2 transition active:scale-95 ${
                role === "teacher"
                  ? "bg-[#1E56A0] text-white border-[#1E56A0] shadow-md shadow-[#1E56A0]/30 ring-2 ring-blue-300"
                  : "bg-[#EEF2FF] text-slate-700 border-[#C7D2FE] hover:bg-blue-100/60"
              }`}
            >
              <span>{ui.teacherRoleName}</span>
            </button>

            <button
              type="button"
              onClick={() => handleRoleChange("student")}
              className={`p-3.5 rounded-xl border text-xs sm:text-sm font-black flex items-center justify-center gap-2 transition active:scale-95 ${
                role === "student"
                  ? "bg-[#1E56A0] text-white border-[#1E56A0] shadow-md shadow-[#1E56A0]/30 ring-2 ring-blue-300"
                  : "bg-[#EEF2FF] text-slate-700 border-[#C7D2FE] hover:bg-blue-100/60"
              }`}
            >
              <span>{ui.studentRoleName}</span>
            </button>
          </div>
        </div>

        {/* Error Notification */}
        {error && (
          <div className="bg-red-50 border border-red-200 text-red-700 text-xs p-3.5 rounded-xl text-center font-bold">
            {error}
          </div>
        )}

        {/* Authentication Form */}
        <form onSubmit={handleSubmit} className="space-y-4">
          {mode === "register" && (
            <>
              {/* Full Name Field */}
              <div>
                <label className="block text-xs font-black text-slate-700 mb-1 uppercase tracking-wider">
                  {ui.nameLabel}
                </label>
                <input
                  className="w-full border border-[#C7D2FE] bg-white px-4 py-3 rounded-xl focus:border-blue-600 focus:ring-2 focus:ring-blue-100 focus:outline-none text-sm font-semibold text-slate-800 transition shadow-2xs"
                  placeholder={ui.namePlaceholder}
                  type="text"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  required
                />
              </div>

              {/* Mobile / Phone Number (Required for Teacher) */}
              {role === "teacher" && (
                <div>
                  <div className="flex items-center justify-between mb-1">
                    <label className="block text-xs font-black text-slate-700 uppercase tracking-wider">
                      {ui.phoneLabel}
                    </label>
                    <span className="text-[10px] bg-white text-blue-800 font-extrabold px-2 py-0.5 rounded-md border border-[#C7D2FE] shadow-2xs">
                      १० अंक अनिवार्य
                    </span>
                  </div>
                  <div className="relative">
                    <div className="absolute inset-y-0 left-0 flex items-center pl-3.5 pointer-events-none text-xs font-extrabold text-slate-600">
                      🇮🇳 +91
                    </div>
                    <input
                      className="w-full border border-[#C7D2FE] bg-white pl-16 pr-4 py-3 rounded-xl focus:border-blue-600 focus:ring-2 focus:ring-blue-100 focus:outline-none text-sm font-semibold text-slate-800 transition tracking-wide shadow-2xs"
                      placeholder={ui.phonePlaceholder}
                      type="tel"
                      maxLength={10}
                      value={phone}
                      onChange={(e) => setPhone(e.target.value.replace(/\D/g, ""))}
                      required
                    />
                  </div>
                </div>
              )}

              {/* School Name Field (For both Teacher and Student) */}
              <div>
                <label className="block text-xs font-black text-slate-700 mb-1 uppercase tracking-wider">
                  {ui.schoolLabel}
                </label>
                <input
                  className="w-full border border-[#C7D2FE] bg-white px-4 py-3 rounded-xl focus:border-blue-600 focus:ring-2 focus:ring-blue-100 focus:outline-none text-sm font-semibold text-slate-800 transition shadow-2xs"
                  placeholder={ui.schoolPlaceholder}
                  type="text"
                  value={schoolName}
                  onChange={(e) => setSchoolName(e.target.value)}
                  required
                />
              </div>

              {/* Address / Location Field (For both Teacher and Student) */}
              <div>
                <label className="block text-xs font-black text-slate-700 mb-1 uppercase tracking-wider">
                  {ui.addressLabel}
                </label>
                <input
                  className="w-full border border-[#C7D2FE] bg-white px-4 py-3 rounded-xl focus:border-blue-600 focus:ring-2 focus:ring-blue-100 focus:outline-none text-sm font-semibold text-slate-800 transition shadow-2xs"
                  placeholder={ui.addressPlaceholder}
                  type="text"
                  value={address}
                  onChange={(e) => setAddress(e.target.value)}
                  required
                />
              </div>

              {/* Language / Medium Selection */}
              <div>
                <label className="block text-xs font-black text-slate-700 mb-1 uppercase tracking-wider">
                  {ui.mediumLabel}
                </label>
                {role === "teacher" ? (
                  <div className="w-full border border-[#C7D2FE] px-4 py-3 rounded-xl text-xs font-black text-blue-800 bg-white shadow-2xs flex items-center justify-between">
                    <span>{ui.hindiMediumBadge}</span>
                    <span className="text-[10px] bg-[#EEF2FF] text-blue-900 border border-[#C7D2FE] px-2 py-0.5 rounded-md font-bold">
                      प्राथमिक शिक्षण (FLN)
                    </span>
                  </div>
                ) : (
                  <div className="grid grid-cols-3 gap-2">
                    {(
                      [
                        { id: "san", label: "संथाली (ᱥᱟᱱᱛᱟᱲᱤ)" },
                        { id: "ho", label: "हो (ᱦᱳ)" },
                        { id: "mun", label: "मुंडारी (ᱢᱩᱱᱰᱟᱨᱤ)" },
                      ] as const
                    ).map((lang) => (
                      <button
                        type="button"
                        key={lang.id}
                        onClick={() => setPreferredLang(lang.id)}
                        className={`py-2.5 px-2 rounded-xl text-xs font-black border transition ${
                          preferredLang === lang.id
                            ? "bg-blue-600 text-white border-blue-600 shadow-sm"
                            : "bg-white text-slate-700 border-[#C7D2FE] hover:bg-blue-50/50 shadow-2xs"
                        }`}
                      >
                        {lang.label}
                      </button>
                    ))}
                  </div>
                )}
              </div>

              {/* Student Class / Grade Selection */}
              {role === "student" && (
                <div>
                  <div className="flex items-center justify-between mb-1">
                    <label className="block text-xs font-black text-slate-700 uppercase tracking-wider">
                      {ui.gradeLabel}
                    </label>
                    <span className="text-[10px] bg-white text-blue-800 font-extrabold px-2 py-0.5 rounded-md border border-[#C7D2FE] shadow-2xs">
                      कक्षा अनुसार सामग्री
                    </span>
                  </div>
                  <div className="grid grid-cols-3 sm:grid-cols-5 gap-2">
                    {["कक्षा 1", "कक्षा 2", "कक्षा 3", "कक्षा 4", "कक्षा 5"].map((grd) => (
                      <button
                        type="button"
                        key={grd}
                        onClick={() => setStudentGrade(grd)}
                        className={`py-2 px-1 rounded-xl text-xs font-black border transition ${
                          studentGrade === grd
                            ? "bg-blue-600 text-white border-blue-600 shadow-sm"
                            : "bg-white text-slate-700 border-[#C7D2FE] hover:bg-blue-50/50 shadow-2xs"
                        }`}
                      >
                        {grd}
                      </button>
                    ))}
                  </div>
                </div>
              )}
            </>
          )}

          {/* Email Address */}
          <div>
            <label className="block text-xs font-black text-slate-700 mb-1 uppercase tracking-wider">
              {ui.emailLabel}
            </label>
            <input
              className="w-full border border-[#C7D2FE] bg-white px-4 py-3 rounded-xl focus:border-blue-600 focus:ring-2 focus:ring-blue-100 focus:outline-none text-sm font-semibold text-slate-800 transition shadow-2xs"
              placeholder={ui.emailPlaceholder}
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
            />
          </div>

          {/* Password */}
          <div>
            <label className="block text-xs font-black text-slate-700 mb-1 uppercase tracking-wider">
              {ui.passwordLabel}
            </label>
            <input
              className="w-full border border-[#C7D2FE] bg-white px-4 py-3 rounded-xl focus:border-blue-600 focus:ring-2 focus:ring-blue-100 focus:outline-none text-sm font-semibold text-slate-800 transition shadow-2xs"
              type="password"
              placeholder={ui.passwordPlaceholder}
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
            />
          </div>

          {/* Submit Action Button (Warm Coral Amber Theme) */}
          <button
            type="submit"
            disabled={loading}
            className="w-full py-4 rounded-xl font-black text-sm text-white bg-[#D97706] hover:bg-[#b45309] shadow-lg shadow-amber-600/30 transition duration-150 mt-2 disabled:opacity-50 active:scale-95 flex items-center justify-center gap-2"
          >
            {loading ? (
              <span>{mode === "register" ? ui.loadingRegister : ui.loadingLogin}</span>
            ) : (
              <span>{mode === "register" ? ui.registerBtn : ui.loginBtn}</span>
            )}
          </button>
        </form>

        {/* Footer Switch Link */}
        <div className="pt-2 text-center border-t border-slate-100">
          {mode === "register" ? (
            <p className="text-xs text-slate-500 font-medium">
              {ui.alreadyHaveAccount}{" "}
              <button
                type="button"
                onClick={() => {
                  setMode("login");
                  setError("");
                  if (role === "teacher") {
                    setEmail("teacher@test.com");
                    setPassword("123456");
                  } else {
                    setEmail("student@test.com");
                    setPassword("123456");
                  }
                }}
                className="font-black text-blue-600 hover:underline ml-1"
              >
                {ui.switchToLogin}
              </button>
            </p>
          ) : (
            <p className="text-xs text-slate-500 font-medium">
              {ui.dontHaveAccount}{" "}
              <button
                type="button"
                onClick={() => {
                  setMode("register");
                  setError("");
                  setName("");
                  setPhone("");
                  setSchoolName("");
                  setAddress("");
                  setEmail("");
                  setPassword("");
                }}
                className="font-black text-blue-600 hover:underline ml-1"
              >
                {ui.switchToRegister}
              </button>
            </p>
          )}
        </div>
      </div>
    </div>
  );
}