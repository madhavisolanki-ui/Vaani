import { useState } from "react";
import { Link } from "react-router-dom";

interface UploadedDoc {
  id: string;
  name: string;
  grade: string;
  subject: string;
  targetLang: string;
  size: string;
  uploadedDate: string;
  status: "translated" | "processing" | "ready";
  type: "pdf" | "image" | "worksheet";
}

export default function TeacherDocuments() {
  const [docs, setDocs] = useState<UploadedDoc[]>([
    {
      id: "doc_1",
      name: "गणित_गिनती_टीएलएम_चित्र_वर्कशीट.pdf",
      grade: "कक्षा 1",
      subject: "गणित",
      targetLang: "मुंडारी",
      size: "2.4 एमबी",
      uploadedDate: "09 अक्टूबर 2026",
      status: "translated",
      type: "pdf",
    },
    {
      id: "doc_2",
      name: "हमारे_आसपास_के_पेड़_पौधे_स्कैन.jpg",
      grade: "कक्षा 2",
      subject: "भाषा व पर्यावरण",
      targetLang: "संथाली (देवनागरी + ओल चिकी)",
      size: "1.8 एमबी",
      uploadedDate: "08 अक्टूबर 2026",
      status: "translated",
      type: "image",
    },
    {
      id: "doc_3",
      name: "पलाश_निपुण_सप्ताह_4_गतिविधि_योजना.pdf",
      grade: "कक्षा 1",
      subject: "भाषा व पर्यावरण",
      targetLang: "हो",
      size: "3.1 एमबी",
      uploadedDate: "05 अक्टूबर 2026",
      status: "ready",
      type: "pdf",
    },
  ]);

  const [uploading, setUploading] = useState(false);
  const [fileName, setFileName] = useState("");
  const [docSubject, setDocSubject] = useState("गणित");
  const [docGrade, setDocGrade] = useState("कक्षा 1");
  const [targetLang, setTargetLang] = useState("मुंडारी");
  const [successMsg, setSuccessMsg] = useState(false);

  const handleUploadSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!fileName.trim()) return;

    setUploading(true);
    setTimeout(() => {
      const newDocItem: UploadedDoc = {
        id: `doc_${Date.now()}`,
        name: fileName.trim().endsWith(".pdf") ? fileName.trim() : `${fileName.trim()}.pdf`,
        grade: docGrade,
        subject: docSubject,
        targetLang: targetLang,
        size: "1.5 एमबी",
        uploadedDate: "आज",
        status: "translated",
        type: "pdf",
      };
      setDocs([newDocItem, ...docs]);
      setUploading(false);
      setFileName("");
      setSuccessMsg(true);
      setTimeout(() => setSuccessMsg(false), 3000);
    }, 1200);
  };

  const handleDelete = (id: string) => {
    setDocs(docs.filter((d) => d.id !== id));
  };

  return (
    <div className="p-4 sm:p-8 bg-[#F8FAFC] min-h-full space-y-6 max-w-5xl mx-auto font-sans pb-16">
      {/* 1. Header Banner */}
      <div
        className="p-6 sm:p-8 rounded-[20px] text-white shadow-md flex flex-wrap items-center justify-between gap-4"
        style={{ background: "linear-gradient(135deg, #2563EB 0%, #7C3AED 100%)" }}
      >
        <div>
          <div className="flex flex-wrap items-center gap-2 mb-2">
            <span
              className="text-xs font-black px-3 py-1 rounded-full border border-white/30 backdrop-blur-md shadow-xs uppercase tracking-wide text-white"
              style={{ backgroundColor: "rgba(255, 255, 255, 0.2)" }}
            >
              दस्तावेज़ एवं शिक्षण सामग्री भंडार
            </span>
            <span
              className="text-xs font-bold px-2.5 py-1 rounded-full border border-white/30 backdrop-blur-md shadow-xs text-white"
              style={{ backgroundColor: "rgba(255, 255, 255, 0.2)" }}
            >
              ⚡ एआई द्विभाषी दस्तावेज़ कनवर्टर
            </span>
          </div>
          <h1 className="text-2xl sm:text-3xl font-black text-white tracking-tight">
            📂 दस्तावेज़ एवं शिक्षण सामग्री अपलोड
          </h1>
          <p className="text-blue-100 text-xs sm:text-sm mt-1 max-w-2xl font-medium">
            पाठ्य-सामग्री, वर्कशीट्स या हस्तलिखित शिक्षण-अधिगम सामग्री (टीएलएम) अपलोड करें। हमारा एआई इसे जनजातीय भाषा में स्वतः अनुवादित करेगा।
          </p>
        </div>

        <div className="flex items-center gap-2">
          <Link
            to="/teacher"
            className="px-4 py-2.5 rounded-xl border border-white/30 text-xs font-bold text-white hover:bg-white/20 transition shadow-xs backdrop-blur-md"
            style={{ backgroundColor: "rgba(255, 255, 255, 0.15)" }}
          >
            ⬅ डैशबोर्ड
          </Link>
        </div>
      </div>

      {/* Success Notification */}
      {successMsg && (
        <div className="bg-[#DBEAFE] border border-[#BFDBFE] text-[#1E40AF] text-xs sm:text-sm font-black p-4 rounded-2xl flex items-center justify-between shadow-xs animate-in fade-in duration-200">
          <div className="flex items-center gap-2.5">
            <span className="text-lg">✓</span>
            <span>दस्तावेज़ सफलतापूर्वक अपलोड हो गया और एआई अनुवाद तैयार है!</span>
          </div>
        </div>
      )}

      {/* 2. Upload Form Card */}
      <div className="bg-white p-6 sm:p-8 rounded-[16px] border border-[#DBEAFE] shadow-xs space-y-5">
        <h2 className="text-base sm:text-lg font-black text-[#0F172A] flex items-center gap-2 border-b border-[#DBEAFE] pb-3">
          <span>📤</span>
          <span>नई पाठ्य सामग्री या टीएलएम अपलोड करें</span>
        </h2>

        <form onSubmit={handleUploadSubmit} className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div>
              <label className="block text-xs font-bold text-slate-700 mb-1.5 uppercase tracking-wider">
                1. कक्षा
              </label>
              <select
                value={docGrade}
                onChange={(e) => setDocGrade(e.target.value)}
                className="w-full border border-[#DBEAFE] p-3 rounded-xl bg-white text-sm font-bold text-[#0F172A] focus:outline-none focus:ring-2 focus:ring-[#BFDBFE] shadow-2xs"
              >
                <option value="कक्षा 1">कक्षा 1 (प्राथमिक स्तर 1)</option>
                <option value="कक्षा 2">कक्षा 2 (प्राथमिक स्तर 2)</option>
              </select>
            </div>

            <div>
              <label className="block text-xs font-bold text-slate-700 mb-1.5 uppercase tracking-wider">
                2. विषय
              </label>
              <select
                value={docSubject}
                onChange={(e) => setDocSubject(e.target.value)}
                className="w-full border border-[#DBEAFE] p-3 rounded-xl bg-white text-sm font-bold text-[#0F172A] focus:outline-none focus:ring-2 focus:ring-[#BFDBFE] shadow-2xs"
              >
                <option value="गणित">गणित</option>
                <option value="भाषा व पर्यावरण">भाषा व पर्यावरण</option>
                <option value="चित्रकला व गतिविधि">चित्रकला व गतिविधि</option>
              </select>
            </div>

            <div>
              <label className="block text-xs font-bold text-slate-700 mb-1.5 uppercase tracking-wider">
                3. लक्षित अनुवाद भाषा
              </label>
              <select
                value={targetLang}
                onChange={(e) => setTargetLang(e.target.value)}
                className="w-full border border-[#DBEAFE] p-3 rounded-xl bg-white text-sm font-bold text-[#0F172A] focus:outline-none focus:ring-2 focus:ring-[#BFDBFE] shadow-2xs"
              >
                <option value="मुंडारी">मुंडारी</option>
                <option value="हो">हो</option>
                <option value="संथाली">संथाली</option>
              </select>
            </div>
          </div>

          <div>
            <label className="block text-xs font-bold text-slate-700 mb-1.5 uppercase tracking-wider">
              दस्तावेज़ का शीर्षक / फ़ाइल नाम
            </label>
            <input
              type="text"
              value={fileName}
              onChange={(e) => setFileName(e.target.value)}
              placeholder="उदा. कक्षा_1_पशु_पक्षियों_की_पहचान_टीएलएम"
              className="w-full border border-[#DBEAFE] p-3 rounded-xl bg-white text-sm font-semibold text-[#0F172A] focus:outline-none focus:ring-2 focus:ring-[#BFDBFE] shadow-2xs"
              required
            />
          </div>

          {/* Drag & Drop Visual Area */}
          <div className="border-2 border-dashed border-[#DBEAFE] hover:border-[#4F46E5] bg-[#F8FAFC] p-6 rounded-[12px] text-center cursor-pointer transition shadow-2xs">
            <span className="text-3xl block mb-1">📄</span>
            <p className="text-xs sm:text-sm font-bold text-slate-700">
              फ़ाइल यहाँ खींचें और छोड़ें या ब्राउज़ करें (पीडीएफ़, चित्र - अधिकतम 15 एमबी)
            </p>
            <p className="text-[11px] text-slate-500 mt-1">
              हस्तलिखित टीएलएम चार्ट और मुद्रित पाठ्यपुस्तकों का हाई-क्वालिटी एआई सपोर्ट
            </p>
          </div>

          <div className="flex justify-end">
            <button
              type="submit"
              disabled={uploading || !fileName.trim()}
              style={{ background: "linear-gradient(135deg, #4F46E5 0%, #7C3AED 100%)" }}
              className="text-white font-black text-xs px-6 py-3.5 rounded-xl shadow-md shadow-indigo-600/20 hover:opacity-95 transition active:scale-95 disabled:opacity-50 flex items-center gap-2"
            >
              <span>{uploading ? "अपलोड व एआई प्रोसेसिंग हो रहा है..." : "📤 दस्तावेज़ अपलोड करें"}</span>
              <span>➔</span>
            </button>
          </div>
        </form>
      </div>

      {/* 3. Uploaded Documents Repository Table/Cards */}
      <div className="bg-white p-6 sm:p-8 rounded-[16px] border border-[#DBEAFE] shadow-xs space-y-4">
        <div className="flex items-center justify-between border-b border-[#DBEAFE] pb-3">
          <div className="flex items-center gap-2">
            <h3 className="text-base font-black text-[#0F172A]">
              📚 आपके अपलोड किए गए दस्तावेज़ ({docs.length})
            </h3>
          </div>
        </div>

        <div className="space-y-3">
          {docs.map((d) => (
            <div
              key={d.id}
              className="bg-[#F8FAFC] border border-[#E2E8F0] p-4 rounded-xl flex flex-col sm:flex-row sm:items-center justify-between gap-4 transition hover:border-[#CBD5E1] shadow-2xs"
            >
              <div className="flex items-start gap-3.5">
                <div className="w-11 h-11 rounded-xl bg-[#EEF2FF] border border-[#C7D2FE]/60 shadow-2xs flex items-center justify-center shrink-0">
                  {d.type === "pdf" ? (
                    <svg className="w-5 h-5 text-[#4F46E5]" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                      <path strokeLinecap="round" strokeLinejoin="round" d="M7 21h10a2 2 0 002-2V9.414a1 1 0 00-.293-.707l-5.414-5.414A1 1 0 0012.586 3H7a2 2 0 00-2 2v14a2 2 0 002 2z" />
                      <path strokeLinecap="round" strokeLinejoin="round" d="M13 3v5a1 1 0 001 1h5" />
                    </svg>
                  ) : (
                    <svg className="w-5 h-5 text-[#4F46E5]" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                      <path strokeLinecap="round" strokeLinejoin="round" d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
                    </svg>
                  )}
                </div>
                <div>
                  <h4 className="text-sm font-black text-[#0F172A]">{d.name}</h4>
                  <div className="flex flex-wrap items-center gap-2 mt-1.5">
                    <span className="text-[11px] font-bold bg-[#DBEAFE] text-[#1E3A8A] px-2.5 py-0.5 rounded-md border border-[#BFDBFE] shadow-2xs">
                      {d.grade} • {d.subject}
                    </span>
                    <span className="text-[11px] font-bold bg-[#F5F3FF] text-[#4338CA] px-2.5 py-0.5 rounded-md border border-[#DDD6FE] shadow-2xs">
                      🌐 अनुवाद: {d.targetLang}
                    </span>
                    <span className="text-[11px] text-slate-500 bg-white px-2.5 py-0.5 rounded-md border border-[#E2E8F0] shadow-2xs">
                      {d.size} • {d.uploadedDate}
                    </span>
                  </div>
                </div>
              </div>

              <div className="flex items-center gap-2 shrink-0 self-end sm:self-center">
                <span className="bg-[#DBEAFE] text-[#1E40AF] text-xs font-bold px-3 py-1.5 rounded-lg border border-[#BFDBFE] shadow-2xs flex items-center gap-1.5">
                  <span>✓</span> अनुवादित
                </span>
                <button
                  type="button"
                  onClick={() => alert(`"${d.name}" डाउनलोड प्रारंभ हुआ।`)}
                  className="px-3.5 py-1.5 rounded-lg border border-[#C7D2FE] bg-white text-xs font-bold text-[#4F46E5] hover:bg-[#EEF2FF] transition shadow-2xs flex items-center gap-1.5"
                  title="डाउनलोड करें"
                >
                  <span>📥</span>
                  <span>डाउनलोड</span>
                </button>
                <button
                  type="button"
                  onClick={() => handleDelete(d.id)}
                  className="px-2.5 py-1.5 rounded-lg border border-[#E2E8F0] bg-white text-xs font-bold text-red-500 hover:bg-red-50 hover:text-red-600 transition shadow-2xs"
                  title="हटाएं"
                >
                  🗑️
                </button>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
