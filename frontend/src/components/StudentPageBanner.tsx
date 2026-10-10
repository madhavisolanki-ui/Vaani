import { Link } from "react-router-dom";

interface StudentPageBannerProps {
  icon: string;
  title: string;
  subtitle: string;
  tag?: string;
  gradientClass?: string;
  extraAction?: React.ReactNode;
}

export default function StudentPageBanner({
  icon,
  title,
  subtitle,
  tag,
  gradientClass = "from-[#2563EB] to-[#7C3AED]",
  extraAction,
}: StudentPageBannerProps) {
  const isTeacher = typeof window !== "undefined" && localStorage.getItem("userRole") === "teacher";
  const dashboardLink = isTeacher ? "/teacher" : "/dashboard";

  return (
    <div
      className={`bg-gradient-to-r ${gradientClass} rounded-3xl p-5 sm:p-7 text-[#FFFFFF] shadow-xl shadow-indigo-900/15 flex flex-col sm:flex-row sm:items-center justify-between gap-4 relative overflow-hidden`}
      style={{
        background:
          gradientClass === "from-[#2563EB] to-[#7C3AED]"
            ? "linear-gradient(90deg, #2563EB 0%, #7C3AED 100%)"
            : undefined,
      }}
    >
      {/* Decorative ambient subtle background glow */}
      <div className="absolute -top-10 -right-10 w-44 h-44 bg-white/10 rounded-full blur-2xl pointer-events-none"></div>

      <div className="flex items-center gap-3.5 relative z-10">
        <div
          className="w-14 h-14 rounded-2xl flex items-center justify-center text-3xl shadow-inner border border-white/25 shrink-0 backdrop-blur-xs"
          style={{ backgroundColor: "rgba(255, 255, 255, 0.2)" }}
        >
          {icon}
        </div>
        <div className="space-y-1">
          <div className="flex items-center gap-2 flex-wrap">
            <h1 className="text-2xl sm:text-3xl font-black text-[#FFFFFF] tracking-tight">
              {title}
            </h1>
            {tag && (
              <span
                className="text-[#FFFFFF] text-[11px] font-black px-2.5 py-0.5 rounded-full border border-white/30 backdrop-blur-xs shadow-xs"
                style={{ backgroundColor: "rgba(255, 255, 255, 0.25)" }}
              >
                {tag}
              </span>
            )}
          </div>
          <p className="text-xs sm:text-sm text-[#FFFFFF] font-medium leading-relaxed">
            {subtitle}
          </p>
        </div>
      </div>

      <div className="relative z-10 flex flex-wrap items-center gap-2.5 shrink-0">
        <Link
          to={dashboardLink}
          className="bg-white/20 hover:bg-white/30 text-[#FFFFFF] font-bold text-xs sm:text-sm px-4 py-2.5 rounded-full border border-white/30 shadow-md backdrop-blur-xs transition flex items-center gap-2 self-start sm:self-auto active:scale-95 cursor-pointer"
          title="मुख्य डैशबोर्ड पर जाएं"
        >
          <span className="text-sm">⬅️</span>
          <span>डैशबोर्ड पर लौटें</span>
        </Link>
        {extraAction}
      </div>
    </div>
  );
}
