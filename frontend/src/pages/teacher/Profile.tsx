import { useState, useEffect, useRef } from "react";
import { Link, useNavigate, useSearchParams } from "react-router-dom";

export default function TeacherProfile() {
  const navigate = useNavigate();
  const [searchParams, setSearchParams] = useSearchParams();

  // Mode and alert states
  const [isEditing, setIsEditing] = useState(false);
  const [savedMessage, setSavedMessage] = useState(false);
  const [error, setError] = useState("");
  const [showSignoutConfirm, setShowSignoutConfirm] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  // 1. Top Header & School Details
  const [name, setName] = useState(
    localStorage.getItem("userName") || "माधवी सोलंकी"
  );
  const [photo, setPhoto] = useState(
    localStorage.getItem("userPhoto") || ""
  );
  const [regDate, setRegDate] = useState(
    localStorage.getItem("userRegDate") || "15 जुलाई 2024"
  );
  const [schoolName, setSchoolName] = useState(
    localStorage.getItem("userSchool") ||
      "राजकीय प्राथमिक विद्यालय, खूंटी, झारखंड"
  );
  const [udiseCode, setUdiseCode] = useState(
    localStorage.getItem("userUdise") || "20110304501"
  );
  const [designation, setDesignation] = useState(
    localStorage.getItem("userDesignation") ||
      "सहायक शिक्षक"
  );
  const [assignedClasses, setAssignedClasses] = useState(
    localStorage.getItem("userClasses") ||
      "कक्षा 1 एवं कक्षा 2 (प्राथमिक स्तर)"
  );

  // 2. Personal & Academic Details
  const [empId, setEmpId] = useState(
    localStorage.getItem("userEmpId") || "JH-EMP-40819"
  );
  const [dob, setDob] = useState(
    localStorage.getItem("userDob") || "1992-08-14"
  );
  const [gender, setGender] = useState(
    localStorage.getItem("userGender") || "महिला"
  );
  const [phone, setPhone] = useState(
    localStorage.getItem("userPhone") || "7017390959"
  );
  const [email, setEmail] = useState(
    localStorage.getItem("userEmail") || "madhavisolanki02@gmail.com"
  );
  const [qualification, setQualification] = useState(
    localStorage.getItem("userQualification") ||
      "बी.एड / डी.एल.एड एवं जेटेट (प्राथमिक स्तर उत्तीर्ण)"
  );

  // 3. Communication Details
  const [address, setAddress] = useState(
    localStorage.getItem("userAddress") ||
      "ग्राम- डांगरा, पोस्ट- तोरपा, मुख्य मार्ग"
  );
  const [district, setDistrict] = useState(
    localStorage.getItem("userDistrict") || "खूंटी"
  );
  const [block, setBlock] = useState(
    localStorage.getItem("userBlock") || "तोरपा / शिकारीपाड़ा"
  );
  const [state, setState] = useState(
    localStorage.getItem("userState") || "झारखण्ड"
  );
  const [pincode, setPincode] = useState(
    localStorage.getItem("userPincode") || "835227"
  );

  // 4. Emergency Contact
  const [emergName, setEmergName] = useState(
    localStorage.getItem("userEmergName") || "राजेश सोलंकी"
  );
  const [emergRelation, setEmergRelation] = useState(
    localStorage.getItem("userEmergRelation") || "अभिभावक"
  );
  const [emergPhone, setEmergPhone] = useState(
    localStorage.getItem("userEmergPhone") || "9876543211"
  );

  // Form backup state for cancelation
  const [tempData, setTempData] = useState<any>(null);

  // Automatically enter edit mode if ?edit=true is passed
  useEffect(() => {
    if (searchParams.get("edit") === "true") {
      handleStartEdit();
    }
  }, [searchParams]);

  const handleStartEdit = () => {
    setTempData({
      name,
      photo,
      regDate,
      schoolName,
      udiseCode,
      designation,
      assignedClasses,
      empId,
      dob,
      gender,
      phone,
      email,
      qualification,
      address,
      district,
      block,
      state,
      pincode,
      emergName,
      emergRelation,
      emergPhone,
    });
    setIsEditing(true);
    setError("");
  };

  const handleCancelEdit = () => {
    if (tempData) {
      setName(tempData.name);
      setPhoto(tempData.photo);
      setRegDate(tempData.regDate);
      setSchoolName(tempData.schoolName);
      setUdiseCode(tempData.udiseCode);
      setDesignation(tempData.designation);
      setAssignedClasses(tempData.assignedClasses);
      setEmpId(tempData.empId);
      setDob(tempData.dob);
      setGender(tempData.gender);
      setPhone(tempData.phone);
      setEmail(tempData.email);
      setQualification(tempData.qualification);
      setAddress(tempData.address);
      setDistrict(tempData.district);
      setBlock(tempData.block);
      setState(tempData.state);
      setPincode(tempData.pincode);
      setEmergName(tempData.emergName);
      setEmergRelation(tempData.emergRelation);
      setEmergPhone(tempData.emergPhone);
    }
    setIsEditing(false);
    setError("");
    // Remove query param if present
    if (searchParams.get("edit")) {
      setSearchParams({});
    }
  };

  const handlePhotoUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    if (file.size > 3 * 1024 * 1024) {
      setError("फ़ोटो का आकार 3MB से कम होना चाहिए।");
      return;
    }

    const reader = new FileReader();
    reader.onloadend = () => {
      const dataUrl = reader.result as string;
      setPhoto(dataUrl);
      localStorage.setItem("userPhoto", dataUrl);
      window.dispatchEvent(new Event("userProfileUpdated"));
      window.dispatchEvent(new Event("storage"));
      setSavedMessage(true);
      setTimeout(() => setSavedMessage(false), 3000);
    };
    reader.readAsDataURL(file);
  };

  const handleRemovePhoto = () => {
    setPhoto("");
    localStorage.removeItem("userPhoto");
    window.dispatchEvent(new Event("userProfileUpdated"));
    window.dispatchEvent(new Event("storage"));
  };

  const handleSaveProfile = (e: React.FormEvent) => {
    e.preventDefault();

    // Validations
    if (!name.trim()) {
      setError("कृपया शिक्षक का पूरा नाम दर्ज करें।");
      return;
    }
    if (!phone.trim() || phone.trim().length < 10) {
      setError("कृपया शिक्षक का 10 अंकों का मान्य मोबाइल नंबर दर्ज करें।");
      return;
    }
    if (!email.trim() || !email.includes("@")) {
      setError("कृपया एक मान्य ईमेल आईडी दर्ज करें।");
      return;
    }
    if (!schoolName.trim()) {
      setError("कृपया विद्यालय का नाम दर्ज करें।");
      return;
    }
    if (!udiseCode.trim()) {
      setError("कृपया विद्यालय का यू-डायस कोड दर्ज करें।");
      return;
    }

    // Persist all values
    localStorage.setItem("userName", name.trim());
    if (photo) {
      localStorage.setItem("userPhoto", photo.trim());
    } else {
      localStorage.removeItem("userPhoto");
    }
    localStorage.setItem("userRegDate", regDate.trim());
    localStorage.setItem("userSchool", schoolName.trim());
    localStorage.setItem("userUdise", udiseCode.trim());
    localStorage.setItem("userDesignation", designation.trim());
    localStorage.setItem("userClasses", assignedClasses);
    localStorage.setItem("userEmpId", empId.trim());
    localStorage.setItem("userDob", dob.trim());
    localStorage.setItem("userGender", gender);
    localStorage.setItem("userPhone", phone.trim());
    localStorage.setItem("userEmail", email.trim());
    localStorage.setItem("userQualification", qualification.trim());
    localStorage.setItem("userAddress", address.trim());
    localStorage.setItem("userDistrict", district.trim());
    localStorage.setItem("userBlock", block.trim());
    localStorage.setItem("userState", state.trim());
    localStorage.setItem("userPincode", pincode.trim());
    localStorage.setItem("userEmergName", emergName.trim());
    localStorage.setItem("userEmergRelation", emergRelation.trim());
    localStorage.setItem("userEmergPhone", emergPhone.trim());

    // Broadcast update events across tabs and layout components
    window.dispatchEvent(new Event("userProfileUpdated"));
    window.dispatchEvent(new Event("storage"));

    setIsEditing(false);
    setSavedMessage(true);
    setError("");
    if (searchParams.get("edit")) {
      setSearchParams({});
    }
    setTimeout(() => setSavedMessage(false), 4000);
  };

  const handleSignOut = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("role");
    localStorage.removeItem("userName");
    localStorage.removeItem("userEmail");
    localStorage.removeItem("userPhone");
    localStorage.removeItem("userSchool");
    localStorage.removeItem("userAddress");
    navigate("/login");
  };

  const initial = (name.trim().charAt(0) || "म").toUpperCase();

  return (
    <div className="p-4 sm:p-8 bg-[#F8FAFC] min-h-full space-y-6 max-w-5xl mx-auto font-sans pb-28">
      {/* Hidden File Input for Image Upload */}
      <input
        type="file"
        ref={fileInputRef}
        onChange={handlePhotoUpload}
        accept="image/*"
        className="hidden"
      />

      {/* Top Breadcrumb & Edit Status Bar */}
      <div className="flex flex-wrap items-center justify-between gap-4">
        <div className="flex items-center gap-2">
          <Link
            to="/teacher"
            className="px-3.5 py-2 rounded-xl border border-[#E2E8F0] bg-white text-xs font-bold text-slate-700 hover:bg-slate-50 transition shadow-2xs flex items-center gap-1.5"
          >
            <span>⬅</span>
            <span>डैशबोर्ड</span>
          </Link>
          <span className="text-xs text-slate-400">/</span>
          <span className="text-xs font-black text-[#1E56A0] bg-[#1E56A0]/10 px-2.5 py-1 rounded-lg">
            शिक्षक प्रोफ़ाइल
          </span>
          {isEditing && (
            <span className="bg-blue-50 text-[#1E56A0] text-xs font-black px-2.5 py-1 rounded-lg border border-blue-200 animate-pulse">
              ✏️ संपादन मोड चालू
            </span>
          )}
        </div>

        {/* Primary Action Button */}
        <div className="flex items-center gap-3">
          {!isEditing ? (
            <button
              type="button"
              onClick={handleStartEdit}
              className="bg-[#2563EB] hover:bg-[#1D4ED8] text-white font-black text-xs sm:text-sm px-6 py-2.5 rounded-xl shadow-md shadow-blue-600/25 transition active:scale-95 flex items-center gap-2"
            >
              <span>✏️</span>
              <span>प्रोफ़ाइल संपादित करें</span>
            </button>
          ) : (
            <div className="flex items-center gap-2">
              <button
                type="button"
                onClick={handleCancelEdit}
                className="px-4 py-2.5 rounded-xl border border-[#E2E8F0] bg-white text-xs font-bold text-slate-700 hover:bg-slate-100 transition"
              >
                रद्द करें
              </button>
              <button
                type="button"
                onClick={handleSaveProfile}
                className="bg-[#10B981] hover:bg-emerald-700 text-white font-black text-xs sm:text-sm px-6 py-2.5 rounded-xl shadow-md shadow-emerald-600/25 transition active:scale-95 flex items-center gap-1.5"
              >
                <span>💾</span>
                <span>बदलाव सुरक्षित करें</span>
              </button>
            </div>
          )}
        </div>
      </div>

      {/* Success Alert */}
      {savedMessage && (
        <div className="bg-emerald-50 border-2 border-emerald-300 text-emerald-900 text-xs sm:text-sm font-black p-4 rounded-2xl flex items-center justify-between shadow-xs animate-in fade-in duration-200">
          <div className="flex items-center gap-2.5">
            <span className="text-xl">✅</span>
            <span>
              शिक्षक प्रोफ़ाइल विवरण सफलतापूर्वक सुरक्षित कर लिया गया है! संपूर्ण
              पोर्टल पर नया डेटा तुरंत अपडेट हो गया है।
            </span>
          </div>
          <button
            onClick={() => setSavedMessage(false)}
            className="text-emerald-700 hover:text-emerald-950 font-bold text-base px-2"
          >
            ✕
          </button>
        </div>
      )}

      {/* Error Alert */}
      {error && (
        <div className="bg-red-50 border border-red-200 text-red-700 text-xs font-bold p-3.5 rounded-2xl text-center shadow-xs">
          ⚠️ {error}
        </div>
      )}

      {/* =========================================================================
          1. मुख्य प्रोफ़ाइल कार्ड (Top Header Card)
      ========================================================================= */}
      <section className="bg-[#EEF2FF] rounded-[16px] p-6 sm:p-8 shadow-2xs border border-[#C7D2FE] relative overflow-hidden">
        {/* Subtle decorative royal blue accent bar on left */}
        <div className="absolute top-0 left-0 bottom-0 w-2.5 bg-[#1E56A0]" />

        <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-6 pl-2">
          {/* Avatar / Profile Photo + Main Identity */}
          <div className="flex flex-col sm:flex-row items-start sm:items-center gap-5">
            {/* Avatar with Photo Upload / Edit Button */}
            <div className="relative group">
              {photo ? (
                <img
                  src={photo}
                  alt={name}
                  className="w-20 h-20 sm:w-24 sm:h-24 rounded-2xl object-cover border-2 border-white shadow-md"
                />
              ) : (
                <div className="w-20 h-20 sm:w-24 sm:h-24 rounded-2xl bg-gradient-to-br from-[#1E56A0] to-[#164580] text-white font-black text-3xl sm:text-4xl flex items-center justify-center shadow-md border-2 border-white">
                  {initial}
                </div>
              )}

              {/* Quick photo change button */}
              <button
                type="button"
                onClick={() => fileInputRef.current?.click()}
                className="absolute inset-0 bg-black/40 hover:bg-black/60 text-white rounded-2xl opacity-0 group-hover:opacity-100 transition flex flex-col items-center justify-center text-[10px] font-black gap-0.5 cursor-pointer"
                title="फ़ोटो बदलें / अपलोड करें"
              >
                <span className="text-sm">📷</span>
                <span>फ़ोटो बदलें</span>
              </button>
            </div>

            <div className="space-y-1.5">
              <h1 className="text-2xl sm:text-3xl font-black text-[#0F172A] tracking-tight">
                {name}
              </h1>
              <p className="text-xs sm:text-sm font-bold text-[#1E56A0]">
                शिक्षक
              </p>

              <div className="flex flex-wrap items-center gap-x-4 gap-y-1 text-xs text-slate-600 font-medium">
                <span className="flex items-center gap-1.5">
                  <span className="text-slate-500 font-semibold">🏫 विद्यालय:</span>
                  <strong className="text-slate-900 font-bold">{schoolName}</strong>
                </span>
                <span className="flex items-center gap-1.5">
                  <span className="text-slate-500 font-semibold">📋 यू-डायस+ कोड:</span>
                  <code className="bg-white px-2.5 py-0.5 rounded-md font-mono text-[11px] font-bold text-slate-800 border border-[#C7D2FE] shadow-2xs">
                    {udiseCode}
                  </code>
                </span>
              </div>

              {/* Quick photo action link */}
              <div className="pt-1 flex items-center gap-3 text-xs">
                <button
                  type="button"
                  onClick={() => fileInputRef.current?.click()}
                  className="bg-white px-2.5 py-1 rounded-lg border border-[#C7D2FE] shadow-2xs text-[#1E56A0] hover:text-blue-800 font-black flex items-center gap-1 text-[11px]"
                >
                  <span>📷</span>
                  <span>{photo ? "फ़ोटो बदलें" : "फ़ोटो अपलोड करें"}</span>
                </button>
                {photo && (
                  <button
                    type="button"
                    onClick={handleRemovePhoto}
                    className="bg-white px-2.5 py-1 rounded-lg border border-[#C7D2FE] shadow-2xs text-red-600 hover:text-red-800 font-bold text-[11px]"
                  >
                    हटाएं
                  </button>
                )}
              </div>
            </div>
          </div>

          {/* Registration Date & Edit Button in Header */}
          <div className="flex md:flex-col items-center md:items-end justify-between w-full md:w-auto pt-4 md:pt-0 border-t md:border-t-0 border-[#C7D2FE]/60 gap-3">
            <div className="text-left md:text-right">
              <span className="text-[11px] font-bold text-slate-500 uppercase tracking-wider block">
                पंजीयन तिथि
              </span>
              <p className="text-xs sm:text-sm font-black text-slate-800 flex items-center md:justify-end gap-1.5 mt-0.5 bg-white px-3 py-1 rounded-lg border border-[#C7D2FE] shadow-2xs">
                <span>📅</span>
                <span>{regDate}</span>
              </p>
            </div>

            {!isEditing && (
              <button
                type="button"
                onClick={handleStartEdit}
                className="inline-flex items-center gap-1.5 bg-white hover:bg-blue-50 text-[#1E56A0] font-black text-xs px-3.5 py-2 rounded-xl border border-[#C7D2FE] shadow-2xs transition"
              >
                <span>✏️</span>
                <span>विवरण संपादित करें</span>
              </button>
            )}
          </div>
        </div>
      </section>

      {/* =========================================================================
          VIEW MODE VS EDIT MODE
      ========================================================================= */}
      {!isEditing ? (
        <div className="space-y-6">
          {/* =========================================================================
              2. व्यक्तिगत एवं शैक्षणिक विवरण (Academic & Personal Details)
          ========================================================================= */}
          <section className="bg-[#EEF2FF] rounded-[16px] p-6 sm:p-8 shadow-2xs border border-[#C7D2FE]">
            <div className="flex items-center justify-between border-b border-[#C7D2FE]/60 pb-4 mb-6">
              <div className="flex items-center gap-2.5">
                <div className="w-9 h-9 rounded-xl bg-white border border-[#C7D2FE] text-[#1E56A0] font-black flex items-center justify-center text-lg shadow-2xs">
                  🎓
                </div>
                <div>
                  <h2 className="text-base sm:text-lg font-black text-[#0F172A]">
                    2. व्यक्तिगत एवं शैक्षणिक विवरण
                  </h2>
                  <p className="text-xs text-slate-600 font-medium">
                    शिक्षक की व्यक्तिगत पहचान, मानव संपदा कोड व शैक्षणिक योग्यता
                  </p>
                </div>
              </div>

              {/* Edit button on section */}
              <button
                type="button"
                onClick={handleStartEdit}
                className="text-xs font-black text-[#1E56A0] hover:text-blue-800 bg-white hover:bg-blue-50 px-3 py-1.5 rounded-xl border border-[#C7D2FE] shadow-2xs transition flex items-center gap-1"
              >
                <span>✏️</span>
                <span>संपादित करें</span>
              </button>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
              {/* Full Name */}
              <div className="p-4 rounded-[12px] bg-white border border-[#C7D2FE] shadow-2xs space-y-1">
                <span className="text-[11px] font-bold text-slate-500 uppercase tracking-wider block">
                  शिक्षक का पूरा नाम
                </span>
                <p className="text-sm font-black text-slate-900">{name}</p>
              </div>

              {/* Employee ID */}
              <div className="p-4 rounded-[12px] bg-white border border-[#C7D2FE] shadow-2xs space-y-1">
                <span className="text-[11px] font-bold text-slate-500 uppercase tracking-wider block">
                  शिक्षक आईडी
                </span>
                <p className="text-sm font-black text-[#1E56A0] font-mono tracking-wide">
                  {empId}
                </p>
              </div>

              {/* Date of Birth */}
              <div className="p-4 rounded-[12px] bg-white border border-[#C7D2FE] shadow-2xs space-y-1">
                <span className="text-[11px] font-bold text-slate-500 uppercase tracking-wider block">
                  जन्म तिथि 
                </span>
                <p className="text-sm font-black text-slate-900">{dob}</p>
              </div>

              {/* Gender */}
              <div className="p-4 rounded-[12px] bg-white border border-[#C7D2FE] shadow-2xs space-y-1">
                <span className="text-[11px] font-bold text-slate-500 uppercase tracking-wider block">
                  लिंग 
                </span>
                <p className="text-sm font-black text-slate-900">{gender}</p>
              </div>

              {/* Mobile Number */}
              <div className="p-4 rounded-[12px] bg-white border border-[#C7D2FE] shadow-2xs space-y-1">
                <span className="text-[11px] font-bold text-slate-500 uppercase tracking-wider block">
                  मोबाइल नंबर 
                </span>
                <p className="text-sm font-black text-slate-900 flex items-center gap-1.5">
                  <span className="text-xs">🇮🇳</span>
                  <span>+91 {phone}</span>
                </p>
              </div>

              {/* Email Address */}
              <div className="p-4 rounded-[12px] bg-white border border-[#C7D2FE] shadow-2xs space-y-1">
                <span className="text-[11px] font-bold text-slate-500 uppercase tracking-wider block">
                  ईमेल आईडी 
                </span>
                <p className="text-sm font-black text-slate-900 truncate" title={email}>
                  {email}
                </p>
              </div>

              {/* Highest Qualification */}
              <div className="p-4 rounded-[12px] bg-white border border-[#C7D2FE] shadow-2xs space-y-1 sm:col-span-2">
                <span className="text-[11px] font-bold text-slate-500 uppercase tracking-wider block">
                  उच्चतम योग्यता 
                </span>
                <p className="text-sm font-black text-slate-900 flex items-center gap-2">
                  <span className="text-blue-600">📜</span>
                  <span>{qualification}</span>
                </p>
              </div>

              {/* Assigned Classes */}
              <div className="p-4 rounded-[12px] bg-white border border-[#C7D2FE] shadow-2xs space-y-1 sm:col-span-1">
                <span className="text-[11px] font-bold text-slate-500 uppercase tracking-wider block">
                  आवंटित कक्षाएं
                </span>
                <p className="text-sm font-black text-slate-900 flex items-center gap-1.5">
                  <span>🎒</span>
                  <span>{assignedClasses}</span>
                </p>
              </div>
            </div>
          </section>

          {/* =========================================================================
              3. संचार विवरण (Communication Details)
          ========================================================================= */}
          <section className="bg-[#EEF2FF] rounded-[16px] p-6 sm:p-8 shadow-2xs border border-[#C7D2FE]">
            <div className="flex items-center justify-between border-b border-[#C7D2FE]/60 pb-4 mb-6">
              <div className="flex items-center gap-2.5">
                <div className="w-9 h-9 rounded-xl bg-white border border-[#C7D2FE] text-[#1E56A0] font-black flex items-center justify-center text-lg shadow-2xs">
                  📍
                </div>
                <div>
                  <h2 className="text-base sm:text-lg font-black text-[#0F172A]">
                    3. संचार विवरण 
                  </h2>
                  <p className="text-xs text-slate-600 font-medium">
                    वर्तमान/स्थायी निवास एवं विद्यालय का प्रशासनिक क्षेत्र
                  </p>
                </div>
              </div>

              {/* Edit button on section */}
              <button
                type="button"
                onClick={handleStartEdit}
                className="text-xs font-black text-[#1E56A0] hover:text-blue-800 bg-white hover:bg-blue-50 px-3 py-1.5 rounded-xl border border-[#C7D2FE] shadow-2xs transition flex items-center gap-1"
              >
                <span>✏️</span>
                <span>संपादित करें</span>
              </button>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
              {/* Address */}
              <div className="p-4 rounded-[12px] bg-white border border-[#C7D2FE] shadow-2xs space-y-1 sm:col-span-2 lg:col-span-4">
                <span className="text-[11px] font-bold text-slate-500 uppercase tracking-wider block">
                  वर्तमान / स्थायी पता 
                </span>
                <p className="text-sm font-black text-slate-900">{address}</p>
              </div>

              {/* District */}
              <div className="p-4 rounded-[12px] bg-white border border-[#C7D2FE] shadow-2xs space-y-1">
                <span className="text-[11px] font-bold text-slate-500 uppercase tracking-wider block">
                  ज़िला 
                </span>
                <p className="text-sm font-black text-slate-900">{district}</p>
              </div>

              {/* Block / Tehsil */}
              <div className="p-4 rounded-[12px] bg-white border border-[#C7D2FE] shadow-2xs space-y-1">
                <span className="text-[11px] font-bold text-slate-500 uppercase tracking-wider block">
                  ब्लॉक / तहसील 
                </span>
                <p className="text-sm font-black text-slate-900">{block}</p>
              </div>

              {/* State */}
              <div className="p-4 rounded-[12px] bg-white border border-[#C7D2FE] shadow-2xs space-y-1">
                <span className="text-[11px] font-bold text-slate-500 uppercase tracking-wider block">
                  राज्य 
                </span>
                <p className="text-sm font-black text-slate-900">{state}</p>
              </div>

              {/* Pincode */}
              <div className="p-4 rounded-[12px] bg-white border border-[#C7D2FE] shadow-2xs space-y-1">
                <span className="text-[11px] font-bold text-slate-500 uppercase tracking-wider block">
                  पिनकोड 
                </span>
                <p className="text-sm font-black text-slate-900 font-mono">
                  {pincode}
                </p>
              </div>
            </div>
          </section>

          {/* =========================================================================
              4. आपातकालीन संपर्क (Emergency Contact)
          ========================================================================= */}
          <section className="bg-[#EEF2FF] rounded-[16px] p-6 sm:p-8 shadow-2xs border border-[#C7D2FE]">
            <div className="flex items-center justify-between border-b border-[#C7D2FE]/60 pb-4 mb-6">
              <div className="flex items-center gap-2.5">
                <div className="w-9 h-9 rounded-xl bg-white border border-[#C7D2FE] text-red-600 font-black flex items-center justify-center text-lg shadow-2xs">
                  🚨
                </div>
                <div>
                  <h2 className="text-base sm:text-lg font-black text-[#0F172A]">
                    4. आपातकालीन संपर्क 
                  </h2>
                  <p className="text-xs text-slate-600 font-medium">
                    आकस्मिक परिस्थिति या चिकित्सा सहायता के लिए प्राथमिक संपर्क सूत्र
                  </p>
                </div>
              </div>

              {/* Edit button on section */}
              <button
                type="button"
                onClick={handleStartEdit}
                className="text-xs font-black text-[#1E56A0] hover:text-blue-800 bg-white hover:bg-blue-50 px-3 py-1.5 rounded-xl border border-[#C7D2FE] shadow-2xs transition flex items-center gap-1"
              >
                <span>✏️</span>
                <span>संपादित करें</span>
              </button>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
              {/* Emergency Person Name */}
              <div className="p-4 rounded-[12px] bg-white border border-[#C7D2FE] shadow-2xs space-y-1">
                <span className="text-[11px] font-bold text-slate-500 uppercase tracking-wider block">
                  आपातकालीन व्यक्ति का नाम
                </span>
                <p className="text-sm font-black text-slate-900">{emergName}</p>
              </div>

              {/* Relation */}
              <div className="p-4 rounded-[12px] bg-white border border-[#C7D2FE] shadow-2xs space-y-1">
                <span className="text-[11px] font-bold text-slate-500 uppercase tracking-wider block">
                  शिक्षक से संबंध 
                </span>
                <p className="text-sm font-black text-slate-900">
                  {emergRelation}
                </p>
              </div>

              {/* Emergency Phone */}
              <div className="p-4 rounded-[12px] bg-white border border-[#C7D2FE] shadow-2xs space-y-1">
                <span className="text-[11px] font-bold text-slate-500 uppercase tracking-wider block">
                  आपातकालीन मोबाइल नंबर
                </span>
                <p className="text-sm font-black text-red-700 flex items-center gap-1.5">
                  <span>📞</span>
                  <span>+91 {emergPhone}</span>
                </p>
              </div>
            </div>
          </section>
        </div>
      ) : (
        /* =========================================================================
            EDIT FORM MODE (Interactive Profile Editor)
        ========================================================================= */
        <form onSubmit={handleSaveProfile} className="space-y-6">
          {/* Section 1 Form: Top Card / School & Photo Fields */}
          <div className="bg-[#EEF2FF] rounded-[16px] p-6 sm:p-8 shadow-2xs border border-[#C7D2FE] space-y-5">
            <div className="flex items-center justify-between border-b border-[#C7D2FE]/60 pb-3">
              <h3 className="text-base font-black text-[#1E56A0] flex items-center gap-2">
                <span>🏫</span>
                <span>1. मुख्य विद्यालय, पद एवं प्रोफ़ाइल फ़ोटो संपादन</span>
              </h3>
              <span className="text-xs bg-white text-[#1E56A0] font-bold px-3 py-1 rounded-full border border-[#C7D2FE] shadow-2xs">
                संपादन चालू है
              </span>
            </div>

            {/* Photo Upload Manager */}
            <div className="p-4 rounded-[12px] bg-white border border-[#C7D2FE] shadow-2xs flex flex-col sm:flex-row items-center gap-4">
              <div className="w-16 h-16 rounded-2xl bg-[#1E56A0] text-white font-black text-2xl flex items-center justify-center overflow-hidden border-2 border-white shadow-xs">
                {photo ? (
                  <img
                    src={photo}
                    alt="फ़ोटो पूर्वावलोकन"
                    className="w-full h-full object-cover"
                  />
                ) : (
                  initial
                )}
              </div>
              <div className="flex-1 text-center sm:text-left space-y-1">
                <p className="text-xs font-black text-slate-800">
                  शिक्षक प्रोफ़ाइल फ़ोटो
                </p>
                <p className="text-[11px] text-slate-500">
                  अपने टैबलेट या मोबाइल से नई फ़ोटो अपलोड करें (अधिकतम 3 एमबी)।
                </p>
              </div>
              <div className="flex items-center gap-2">
                <button
                  type="button"
                  onClick={() => fileInputRef.current?.click()}
                  className="px-4 py-2 rounded-xl bg-[#1E56A0] text-white text-xs font-bold hover:bg-blue-800 transition flex items-center gap-1.5 shadow-2xs"
                >
                  <span>📷</span>
                  <span>डिवाइस से फ़ोटो चुनें</span>
                </button>
                {photo && (
                  <button
                    type="button"
                    onClick={handleRemovePhoto}
                    className="px-3 py-2 rounded-xl border border-red-200 text-red-600 text-xs font-bold hover:bg-red-50 transition bg-white"
                  >
                    हटाएं
                  </button>
                )}
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block text-xs font-black text-slate-700 mb-1">
                  आवंटित विद्यालय का नाम:
                </label>
                <input
                  type="text"
                  value={schoolName}
                  onChange={(e) => setSchoolName(e.target.value)}
                  className="w-full border border-[#C7D2FE] bg-white p-3 rounded-xl font-bold text-sm text-slate-800 focus:outline-none focus:ring-2 focus:ring-blue-100 focus:border-[#1E56A0] shadow-2xs"
                  required
                />
              </div>

              <div>
                <label className="block text-xs font-black text-slate-700 mb-1">
                  विद्यालय का यू-डायस+ कोड:
                </label>
                <input
                  type="text"
                  value={udiseCode}
                  onChange={(e) => setUdiseCode(e.target.value)}
                  className="w-full border border-[#C7D2FE] bg-white p-3 rounded-xl font-bold text-sm text-slate-800 font-mono focus:outline-none focus:ring-2 focus:ring-blue-100 focus:border-[#1E56A0] shadow-2xs"
                  required
                />
              </div>

              <div>
                <label className="block text-xs font-black text-slate-700 mb-1">
                  पद / पदनाम :
                </label>
                <input
                  type="text"
                  value={designation}
                  onChange={(e) => setDesignation(e.target.value)}
                  className="w-full border border-[#C7D2FE] bg-white p-3 rounded-xl font-bold text-sm text-slate-800 focus:outline-none focus:ring-2 focus:ring-blue-100 focus:border-[#1E56A0] shadow-2xs"
                  required
                />
              </div>

              <div>
                <label className="block text-xs font-black text-slate-700 mb-1">
                  पंजीयन तिथि :
                </label>
                <input
                  type="text"
                  value={regDate}
                  onChange={(e) => setRegDate(e.target.value)}
                  className="w-full border border-[#C7D2FE] bg-white p-3 rounded-xl font-bold text-sm text-slate-800 focus:outline-none focus:ring-2 focus:ring-blue-100 focus:border-[#1E56A0] shadow-2xs"
                  required
                />
              </div>
            </div>
          </div>

          {/* Section 2 Form: Academic & Personal Details */}
          <div className="bg-[#EEF2FF] rounded-[16px] p-6 sm:p-8 shadow-2xs border border-[#C7D2FE] space-y-5">
            <h3 className="text-base font-black text-[#1E56A0] flex items-center gap-2 border-b border-[#C7D2FE]/60 pb-3">
              <span>🎓</span>
              <span>2. व्यक्तिगत एवं शैक्षणिक विवरण संपादन</span>
            </h3>

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
              <div>
                <label className="block text-xs font-black text-slate-700 mb-1">
                  शिक्षक का पूरा नाम:
                </label>
                <input
                  type="text"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  className="w-full border border-[#C7D2FE] bg-white p-3 rounded-xl font-bold text-sm text-slate-800 focus:outline-none focus:ring-2 focus:ring-blue-100 focus:border-[#1E56A0] shadow-2xs"
                  required
                />
              </div>

              <div>
                <label className="block text-xs font-black text-slate-700 mb-1">
                  शिक्षक आईडी :
                </label>
                <input
                  type="text"
                  value={empId}
                  onChange={(e) => setEmpId(e.target.value)}
                  className="w-full border border-[#C7D2FE] bg-white p-3 rounded-xl font-bold text-sm text-slate-800 font-mono focus:outline-none focus:ring-2 focus:ring-blue-100 focus:border-[#1E56A0] shadow-2xs"
                  required
                />
              </div>

              <div>
                <label className="block text-xs font-black text-slate-700 mb-1">
                  जन्म तिथि :
                </label>
                <input
                  type="text"
                  value={dob}
                  onChange={(e) => setDob(e.target.value)}
                  placeholder="उदा. 14 अगस्त 1992"
                  className="w-full border border-[#C7D2FE] bg-white p-3 rounded-xl font-bold text-sm text-slate-800 focus:outline-none focus:ring-2 focus:ring-blue-100 focus:border-[#1E56A0] shadow-2xs"
                  required
                />
              </div>

              <div>
                <label className="block text-xs font-black text-slate-700 mb-1">
                  लिंग :
                </label>
                <select
                  value={gender}
                  onChange={(e) => setGender(e.target.value)}
                  className="w-full border border-[#C7D2FE] bg-white p-3 rounded-xl font-bold text-sm text-slate-800 focus:outline-none focus:ring-2 focus:ring-blue-100 focus:border-[#1E56A0] shadow-2xs"
                >
                  <option value="महिला">महिला</option>
                  <option value="पुरुष">पुरुष</option>
                  <option value="अन्य">अन्य</option>
                </select>
              </div>

              <div>
                <label className="block text-xs font-black text-slate-700 mb-1">
                  मोबाइल नंबर:
                </label>
                <div className="relative">
                  <span className="absolute inset-y-0 left-0 flex items-center pl-3.5 pointer-events-none text-xs font-black text-slate-500">
                    🇮🇳 +91
                  </span>
                  <input
                    type="tel"
                    maxLength={10}
                    value={phone}
                    onChange={(e) => setPhone(e.target.value.replace(/\D/g, ""))}
                    className="w-full border border-[#C7D2FE] bg-white pl-16 pr-4 py-3 rounded-xl font-bold text-sm text-slate-800 focus:outline-none focus:ring-2 focus:ring-blue-100 focus:border-[#1E56A0] shadow-2xs"
                    required
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-black text-slate-700 mb-1">
                  ईमेल आईडी:
                </label>
                <input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="w-full border border-[#C7D2FE] bg-white p-3 rounded-xl font-bold text-sm text-slate-800 focus:outline-none focus:ring-2 focus:ring-blue-100 focus:border-[#1E56A0] shadow-2xs"
                  required
                />
              </div>

              <div className="sm:col-span-2">
                <label className="block text-xs font-black text-slate-700 mb-1">
                  उच्चतम योग्यता:
                </label>
                <input
                  type="text"
                  value={qualification}
                  onChange={(e) => setQualification(e.target.value)}
                  placeholder="उदा. बी.एड / डी.एल.एड एवं जेटेट (प्राथमिक स्तर)"
                  className="w-full border border-[#C7D2FE] bg-white p-3 rounded-xl font-bold text-sm text-slate-800 focus:outline-none focus:ring-2 focus:ring-blue-100 focus:border-[#1E56A0] shadow-2xs"
                  required
                />
              </div>

              <div>
                <label className="block text-xs font-black text-slate-700 mb-1">
                  आवंटित कक्षाएं:
                </label>
                <select
                  value={assignedClasses}
                  onChange={(e) => setAssignedClasses(e.target.value)}
                  className="w-full border border-[#C7D2FE] bg-white p-3 rounded-xl font-bold text-sm text-slate-800 focus:outline-none focus:ring-2 focus:ring-blue-100 focus:border-[#1E56A0] shadow-2xs"
                >
                  <option value="कक्षा 1 एवं कक्षा 2 (प्राथमिक स्तर)">
                    कक्षा 1 एवं कक्षा 2 (प्राथमिक स्तर)
                  </option>
                  <option value="कक्षा 1 (प्राथमिक स्तर)">कक्षा 1 (प्राथमिक स्तर)</option>
                  <option value="कक्षा 2 (प्राथमिक स्तर)">कक्षा 2 (प्राथमिक स्तर)</option>
                  <option value="कक्षा 1 से 5 (प्राथमिक विद्यालय)">
                    कक्षा 1 से 5 (प्राथमिक विद्यालय)
                  </option>
                </select>
              </div>
            </div>
          </div>

          {/* Section 3 Form: Communication Details */}
          <div className="bg-[#EEF2FF] rounded-[16px] p-6 sm:p-8 shadow-2xs border border-[#C7D2FE] space-y-5">
            <h3 className="text-base font-black text-[#1E56A0] flex items-center gap-2 border-b border-[#C7D2FE]/60 pb-3">
              <span>📍</span>
              <span>3. संचार एवं पता विवरण संपादन</span>
            </h3>

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
              <div className="sm:col-span-2 lg:col-span-4">
                <label className="block text-xs font-black text-slate-700 mb-1">
                  वर्तमान / स्थायी पता:
                </label>
                <input
                  type="text"
                  value={address}
                  onChange={(e) => setAddress(e.target.value)}
                  className="w-full border border-[#C7D2FE] bg-white p-3 rounded-xl font-bold text-sm text-slate-800 focus:outline-none focus:ring-2 focus:ring-blue-100 focus:border-[#1E56A0] shadow-2xs"
                  required
                />
              </div>

              <div>
                <label className="block text-xs font-black text-slate-700 mb-1">
                  ज़िला:
                </label>
                <input
                  type="text"
                  value={district}
                  onChange={(e) => setDistrict(e.target.value)}
                  className="w-full border border-[#C7D2FE] bg-white p-3 rounded-xl font-bold text-sm text-slate-800 focus:outline-none focus:ring-2 focus:ring-blue-100 focus:border-[#1E56A0] shadow-2xs"
                  required
                />
              </div>

              <div>
                <label className="block text-xs font-black text-slate-700 mb-1">
                  ब्लॉक / तहसील:
                </label>
                <input
                  type="text"
                  value={block}
                  onChange={(e) => setBlock(e.target.value)}
                  className="w-full border border-[#C7D2FE] bg-white p-3 rounded-xl font-bold text-sm text-slate-800 focus:outline-none focus:ring-2 focus:ring-blue-100 focus:border-[#1E56A0] shadow-2xs"
                  required
                />
              </div>

              <div>
                <label className="block text-xs font-black text-slate-700 mb-1">
                  राज्य:
                </label>
                <input
                  type="text"
                  value={state}
                  onChange={(e) => setState(e.target.value)}
                  className="w-full border border-[#C7D2FE] bg-white p-3 rounded-xl font-bold text-sm text-slate-800 focus:outline-none focus:ring-2 focus:ring-blue-100 focus:border-[#1E56A0] shadow-2xs"
                  required
                />
              </div>

              <div>
                <label className="block text-xs font-black text-slate-700 mb-1">
                  पिनकोड:
                </label>
                <input
                  type="text"
                  maxLength={6}
                  value={pincode}
                  onChange={(e) => setPincode(e.target.value.replace(/\D/g, ""))}
                  className="w-full border border-[#C7D2FE] bg-white p-3 rounded-xl font-bold text-sm text-slate-800 font-mono focus:outline-none focus:ring-2 focus:ring-blue-100 focus:border-[#1E56A0] shadow-2xs"
                  required
                />
              </div>
            </div>
          </div>

          {/* Section 4 Form: Emergency Contact */}
          <div className="bg-[#EEF2FF] rounded-[16px] p-6 sm:p-8 shadow-2xs border border-[#C7D2FE] space-y-5">
            <h3 className="text-base font-black text-red-600 flex items-center gap-2 border-b border-[#C7D2FE]/60 pb-3">
              <span>🚨</span>
              <span>4. आपातकालीन संपर्क विवरण संपादन</span>
            </h3>

            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
              <div>
                <label className="block text-xs font-black text-slate-700 mb-1">
                  आपातकालीन व्यक्ति का नाम:
                </label>
                <input
                  type="text"
                  value={emergName}
                  onChange={(e) => setEmergName(e.target.value)}
                  className="w-full border border-[#C7D2FE] bg-white p-3 rounded-xl font-bold text-sm text-slate-800 focus:outline-none focus:ring-2 focus:ring-blue-100 focus:border-[#1E56A0] shadow-2xs"
                  required
                />
              </div>

              <div>
                <label className="block text-xs font-black text-slate-700 mb-1">
                  शिक्षक से संबंध :
                </label>
                <input
                  type="text"
                  value={emergRelation}
                  onChange={(e) => setEmergRelation(e.target.value)}
                  placeholder="उदा. पति / पिता / अभिभावक"
                  className="w-full border border-[#C7D2FE] bg-white p-3 rounded-xl font-bold text-sm text-slate-800 focus:outline-none focus:ring-2 focus:ring-blue-100 focus:border-[#1E56A0] shadow-2xs"
                  required
                />
              </div>

              <div>
                <label className="block text-xs font-black text-slate-700 mb-1">
                  आपातकालीन मोबाइल नंबर:
                </label>
                <div className="relative">
                  <span className="absolute inset-y-0 left-0 flex items-center pl-3.5 pointer-events-none text-xs font-black text-slate-500">
                    🇮🇳 +91
                  </span>
                  <input
                    type="tel"
                    maxLength={10}
                    value={emergPhone}
                    onChange={(e) =>
                      setEmergPhone(e.target.value.replace(/\D/g, ""))
                    }
                    className="w-full border border-[#C7D2FE] bg-white pl-16 pr-4 py-3 rounded-xl font-bold text-sm text-slate-800 focus:outline-none focus:ring-2 focus:ring-blue-100 focus:border-[#1E56A0] shadow-2xs"
                    required
                  />
                </div>
              </div>
            </div>
          </div>

          {/* Form Action Controls */}
          <div className="pt-2 flex items-center justify-end gap-3">
            <button
              type="button"
              onClick={handleCancelEdit}
              className="px-6 py-3 rounded-xl border border-[#C7D2FE] bg-white text-xs font-bold text-slate-700 hover:bg-slate-100 transition shadow-2xs"
            >
              रद्द करें
            </button>
            <button
              type="submit"
              className="bg-[#2563EB] hover:bg-[#1D4ED8] text-white font-black text-xs sm:text-sm px-8 py-3 rounded-xl shadow-md shadow-blue-600/25 transition active:scale-95 flex items-center gap-2"
            >
              <span>💾</span>
              <span>सभी बदलाव सुरक्षित करें</span>
            </button>
          </div>
        </form>
      )}

      {/* =========================================================================
          5. खाता प्रबंधन (Account Actions / Signout Section)
      ========================================================================= */}
      <section className="bg-[#EEF2FF] rounded-[16px] p-6 sm:p-8 shadow-2xs border border-[#C7D2FE] relative overflow-hidden">
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
          <div className="space-y-1">
            <div className="flex items-center gap-2">
              <span className="w-2.5 h-2.5 rounded-full bg-red-500"></span>
              <h2 className="text-base font-black text-red-900">
                5. खाता प्रबंधन एवं सुरक्षा
              </h2>
            </div>
            <p className="text-xs text-slate-600">
              कक्षा समाप्त होने पर अथवा साझा विद्यालय टैबलेट से कार्य पूर्ण होने पर
              पोर्टल से सुरक्षित रूप से साइनआउट करें।
            </p>
          </div>

          <button
            type="button"
            onClick={() => setShowSignoutConfirm(true)}
            className="w-full sm:w-auto px-6 py-3 rounded-2xl bg-white hover:bg-red-600 text-red-700 hover:text-white border border-[#C7D2FE] hover:border-red-600 text-xs font-black transition duration-150 active:scale-95 flex items-center justify-center gap-2 shadow-2xs group"
          >
            <span className="text-sm group-hover:translate-x-0.5 transition">🚪</span>
            <span>साइनआउट / लॉगआउट</span>
          </button>
        </div>
      </section>

      {/* Signout Confirmation Modal */}
      {showSignoutConfirm && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/60 backdrop-blur-xs p-4 animate-in fade-in">
          <div className="bg-white rounded-3xl max-w-md w-full p-6 sm:p-8 shadow-2xl border border-slate-200 text-center space-y-4">
            <div className="w-14 h-14 rounded-2xl bg-red-100 text-red-600 font-black text-2xl flex items-center justify-center mx-auto">
              🚪
            </div>
            <div className="space-y-1.5">
              <h3 className="text-lg font-black text-slate-900">
                क्या आप सचमुच साइनआउट करना चाहते हैं?
              </h3>
              <p className="text-xs text-slate-500 leading-relaxed">
                आपका वर्तमान सत्र समाप्त हो जाएगा। पुनः लॉगिन करने के लिए शिक्षक
                आईडी या पंजीकृत मोबाइल नंबर का उपयोग करें।
              </p>
            </div>

            <div className="flex items-center justify-center gap-3 pt-2">
              <button
                type="button"
                onClick={() => setShowSignoutConfirm(false)}
                className="flex-1 py-3 px-4 rounded-xl border border-slate-200 text-xs font-bold text-slate-700 hover:bg-slate-100 transition"
              >
                नहीं, वापस जाएं
              </button>
              <button
                type="button"
                onClick={handleSignOut}
                className="flex-1 py-3 px-4 rounded-xl bg-red-600 hover:bg-red-700 text-white text-xs font-black shadow-md shadow-red-600/30 transition active:scale-95 flex items-center justify-center gap-1.5"
              >
                <span>हाँ, साइनआउट करें</span>
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
