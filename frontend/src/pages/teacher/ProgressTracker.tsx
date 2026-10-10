import { useState } from "react";
import { Link } from "react-router-dom";

interface StudentProgress {
  id: string;
  name: string;
  grade: string;
  motherTongue: string;
  attendancePct: number;
  oralScore: number; // out of 100
  worksheetScore: number; // out of 100
  nipunStatus: "लक्ष्य प्राप्त" | "प्रगति पर" | "विशेष सहयोग";
}

export default function TeacherProgressTracker() {
  const [selectedGrade, setSelectedGrade] = useState<"कक्षा 1" | "कक्षा 2">("कक्षा 1");

  const students: StudentProgress[] = [
    {
      id: "std_1",
      name: "सिदो मुर्मू",
      grade: "कक्षा 1",
      motherTongue: "संथाली",
      attendancePct: 92,
      oralScore: 88,
      worksheetScore: 84,
      nipunStatus: "लक्ष्य प्राप्त",
    },
    {
      id: "std_2",
      name: "सुनीता हांसदा",
      grade: "कक्षा 1",
      motherTongue: "मुंडारी",
      attendancePct: 88,
      oralScore: 76,
      worksheetScore: 78,
      nipunStatus: "प्रगति पर",
    },
    {
      id: "std_3",
      name: "बिरसा मुंडा",
      grade: "कक्षा 1",
      motherTongue: "मुंडारी",
      attendancePct: 95,
      oralScore: 92,
      worksheetScore: 90,
      nipunStatus: "लक्ष्य प्राप्त",
    },
    {
      id: "std_4",
      name: "मंगली सोरेन",
      grade: "कक्षा 1",
      motherTongue: "हो",
      attendancePct: 78,
      oralScore: 62,
      worksheetScore: 58,
      nipunStatus: "विशेष सहयोग",
    },
    {
      id: "std_5",
      name: "रोशन तिर्की",
      grade: "कक्षा 2",
      motherTongue: "मुंडारी",
      attendancePct: 90,
      oralScore: 85,
      worksheetScore: 82,
      nipunStatus: "लक्ष्य प्राप्त",
    },
    {
      id: "std_6",
      name: "अनिता टुडू",
      grade: "कक्षा 2",
      motherTongue: "संथाली",
      attendancePct: 86,
      oralScore: 74,
      worksheetScore: 72,
      nipunStatus: "प्रगति पर",
    },
  ];

  const filtered = students.filter((s) => s.grade === selectedGrade);

  // Summary Metrics
  const avgAttendance = Math.round(
    filtered.reduce((acc, s) => acc + s.attendancePct, 0) / (filtered.length || 1)
  );
  const avgOral = Math.round(
    filtered.reduce((acc, s) => acc + s.oralScore, 0) / (filtered.length || 1)
  );
  const achievedCount = filtered.filter(
    (s) => s.nipunStatus === "लक्ष्य प्राप्त"
  ).length;

  return (
    <div className="p-4 sm:p-8 bg-[#F8FAFC] min-h-full space-y-6 max-w-6xl mx-auto font-sans pb-16">
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
              निपुण भारत बुनियादी शिक्षा मूल्यांकन
            </span>
            <span
              className="text-xs font-bold px-2.5 py-1 rounded-full border border-white/30 backdrop-blur-md shadow-xs text-white"
              style={{ backgroundColor: "rgba(255, 255, 255, 0.2)" }}
            >
              🇮🇳 निपुण भारत मिशन ट्रैकर
            </span>
          </div>
          <h1 className="text-2xl sm:text-3xl font-black text-white tracking-tight">
            📊 प्रगति ट्रैकर एवं छात्र मूल्यांकन रिपोर्ट
          </h1>
          <p className="text-blue-100 text-xs sm:text-sm mt-1 max-w-2xl font-medium">
            कक्षा 1 और 2 के बच्चों की बुनियादी साक्षरता, संख्यात्मकता एवं मौखिक समझ की वास्तविक प्रगति रिपोर्ट।
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
          <button
            type="button"
            onClick={() => alert("निपुण मूल्यांकन रिपोर्ट डाउनलोड शुरू हो रहा है...")}
            style={{ background: "linear-gradient(135deg, #4F46E5 0%, #7C3AED 100%)" }}
            className="text-white font-black text-xs px-4 py-2.5 rounded-xl shadow-md shadow-indigo-600/20 hover:opacity-95 transition active:scale-95 flex items-center gap-1.5"
          >
            <span>📥</span>
            <span>निपुण रिपोर्ट डाउनलोड करें</span>
          </button>
        </div>
      </div>

      {/* 2. Grade Toggle and High-level FLN Metrics */}
      <div className="flex items-center justify-between flex-wrap gap-4">
        <div className="flex bg-white p-1.5 rounded-2xl border border-[#DBEAFE] shadow-xs">
          {(["कक्षा 1", "कक्षा 2"] as const).map((grade) => (
            <button
              key={grade}
              onClick={() => setSelectedGrade(grade)}
              style={
                selectedGrade === grade
                  ? { background: "linear-gradient(135deg, #4F46E5 0%, #7C3AED 100%)" }
                  : undefined
              }
              className={`px-5 py-2.5 text-xs sm:text-sm font-black rounded-xl transition ${
                selectedGrade === grade
                  ? "text-white shadow-xs"
                  : "text-slate-600 hover:text-slate-900"
              }`}
            >
              {grade} (प्राथमिक स्तर)
            </button>
          ))}
        </div>

        <div className="text-xs font-bold text-slate-600 bg-white px-3.5 py-2 rounded-xl border border-[#DBEAFE] shadow-xs">
          कुल नामांकित छात्र: <span className="text-[#1E3A8A] font-black">{filtered.length}</span>
        </div>
      </div>

      {/* 3. Summary Stat Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <div className="bg-white p-5 rounded-[16px] border border-[#DBEAFE] shadow-xs space-y-1">
          <span className="text-xs font-bold text-slate-600 uppercase tracking-wider">
            निपुण लक्ष्य प्राप्ति दर
          </span>
          <div className="text-2xl font-black text-[#1E3A8A]">
            {Math.round((achievedCount / (filtered.length || 1)) * 100)}%
          </div>
          <p className="text-[11px] text-slate-600 font-medium">
            {achievedCount} में से {filtered.length} छात्र दक्ष स्तर पर हैं।
          </p>
        </div>

        <div className="bg-white p-5 rounded-[16px] border border-[#DBEAFE] shadow-xs space-y-1">
          <span className="text-xs font-bold text-slate-600 uppercase tracking-wider">
            औसत मौखिक भाषा समझ
          </span>
          <div className="text-2xl font-black text-[#1E3A8A]">
            {avgOral}%
          </div>
          <p className="text-[11px] text-slate-600 font-medium">
            मातृभाषा से हिंदी संवाद में छात्रों का समझ स्तर।
          </p>
        </div>

        <div className="bg-white p-5 rounded-[16px] border border-[#DBEAFE] shadow-xs space-y-1">
          <span className="text-xs font-bold text-slate-600 uppercase tracking-wider">
            औसत कक्षा उपस्थिति
          </span>
          <div className="text-2xl font-black text-[#1E3A8A]">
            {avgAttendance}%
          </div>
          <p className="text-[11px] text-slate-600 font-medium">
            सप्ताह के दौरान विद्यालय में नियमित उपस्थिति।
          </p>
        </div>
      </div>

      {/* 4. Student Roster Evaluation Table */}
      <div className="bg-white rounded-[16px] p-6 sm:p-8 border border-[#DBEAFE] shadow-xs space-y-4">
        <h3 className="text-base font-black text-[#0F172A] border-b border-[#DBEAFE] pb-3">
          🎓 छात्रवार निपुण दक्षता प्रगति सूची
        </h3>

        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs sm:text-sm">
            <thead>
              <tr className="border-b border-[#DBEAFE] text-slate-600 text-[11px] uppercase tracking-wider">
                <th className="py-3 px-3 font-extrabold">छात्र का नाम</th>
                <th className="py-3 px-3 font-extrabold">मातृभाषा</th>
                <th className="py-3 px-3 font-extrabold text-center">उपस्थिति</th>
                <th className="py-3 px-3 font-extrabold text-center">मौखिक समझ</th>
                <th className="py-3 px-3 font-extrabold text-center">वर्कशीट स्कोर</th>
                <th className="py-3 px-3 font-extrabold text-right">निपुण भारत स्थिति</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-[#DBEAFE] font-semibold">
              {filtered.map((s) => (
                <tr key={s.id} className="hover:bg-[#F8FAFC] transition">
                  <td className="py-3.5 px-3 font-black text-[#0F172A] flex items-center gap-2">
                    <span className="w-7 h-7 rounded-lg bg-[#EFF6FF] border border-[#DBEAFE] text-[#1E40AF] font-black text-xs flex items-center justify-center shadow-2xs">
                      {s.name.charAt(0)}
                    </span>
                    <span>{s.name}</span>
                  </td>
                  <td className="py-3.5 px-3 text-slate-700 font-bold">
                    {s.motherTongue}
                  </td>
                  <td className="py-3.5 px-3 text-center">
                    <span className="bg-[#F8FAFC] border border-[#DBEAFE] text-slate-700 px-2 py-0.5 rounded-md text-xs font-bold shadow-2xs">
                      {s.attendancePct}%
                    </span>
                  </td>
                  <td className="py-3.5 px-3 text-center">
                    <span className="bg-[#EFF6FF] text-[#1E40AF] px-2.5 py-0.5 rounded-md text-xs font-black border border-[#DBEAFE] shadow-2xs">
                      {s.oralScore}/100
                    </span>
                  </td>
                  <td className="py-3.5 px-3 text-center">
                    <span className="bg-[#EFF6FF] text-[#1E40AF] px-2.5 py-0.5 rounded-md text-xs font-black border border-[#DBEAFE] shadow-2xs">
                      {s.worksheetScore}/100
                    </span>
                  </td>
                  <td className="py-3.5 px-3 text-right">
                    <span className="inline-block px-3 py-1 rounded-full text-xs font-black border border-[#DBEAFE] bg-[#DBEAFE] text-[#1E40AF] shadow-2xs">
                      {s.nipunStatus}
                    </span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
