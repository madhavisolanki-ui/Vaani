import { useState, useRef, useEffect } from "react";
import StudentPageBanner from "../../components/StudentPageBanner";

const COLORS = [
  { name: "नीला", value: "#2563EB" },
  { name: "लाल", value: "#DC2626" },
  { name: "हरा", value: "#16A34A" },
  { name: "पीला", value: "#EAB308" },
  { name: "नारंगी", value: "#EA580C" },
  { name: "बैंगनी", value: "#9333EA" },
  { name: "गुलाबी", value: "#DB2777" },
  { name: "काला", value: "#0F172A" },
  { name: "भूरा", value: "#78350F" },
];

const TEMPLATES = [
  { id: "blank", name: "कोरा कैनवास", icon: "📄" },
  { id: "mango", name: "मीठा आम (उली)", icon: "🥭" },
  { id: "elephant", name: "हाथी (हाति)", icon: "🐘" },
  { id: "sun", name: "सूरज (सिंगी)", icon: "☀️" },
  { id: "tree", name: "हरा पेड़ (दारू)", icon: "🌳" },
];

export default function DrawingCanvas() {
  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const [color, setColor] = useState("#2563EB");
  const [brushSize, setBrushSize] = useState(6);
  const [isEraser, setIsEraser] = useState(false);
  const [isDrawing, setIsDrawing] = useState(false);
  const [history, setHistory] = useState<ImageData[]>([]);
  const [saveSuccess, setSaveSuccess] = useState(false);

  useEffect(() => {
    initCanvas();
  }, []);

  const initCanvas = () => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;
    ctx.fillStyle = "#FFFFFF";
    ctx.fillRect(0, 0, canvas.width, canvas.height);
    saveState();
  };

  const saveState = () => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;
    const state = ctx.getImageData(0, 0, canvas.width, canvas.height);
    setHistory((prev) => [...prev.slice(-10), state]);
  };

  const undo = () => {
    if (history.length <= 1) return;
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;
    const newHistory = [...history];
    newHistory.pop(); // current
    const previous = newHistory[newHistory.length - 1];
    ctx.putImageData(previous, 0, 0);
    setHistory(newHistory);
  };

  const startDrawing = (e: React.MouseEvent<HTMLCanvasElement> | React.TouchEvent<HTMLCanvasElement>) => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    setIsDrawing(true);
    const rect = canvas.getBoundingClientRect();
    const scaleX = canvas.width / rect.width;
    const scaleY = canvas.height / rect.height;

    let clientX = 0;
    let clientY = 0;
    if ("touches" in e) {
      clientX = e.touches[0].clientX;
      clientY = e.touches[0].clientY;
    } else {
      clientX = e.clientX;
      clientY = e.clientY;
    }

    const x = (clientX - rect.left) * scaleX;
    const y = (clientY - rect.top) * scaleY;

    ctx.beginPath();
    ctx.moveTo(x, y);
  };

  const draw = (e: React.MouseEvent<HTMLCanvasElement> | React.TouchEvent<HTMLCanvasElement>) => {
    if (!isDrawing) return;
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    const rect = canvas.getBoundingClientRect();
    const scaleX = canvas.width / rect.width;
    const scaleY = canvas.height / rect.height;

    let clientX = 0;
    let clientY = 0;
    if ("touches" in e) {
      clientX = e.touches[0].clientX;
      clientY = e.touches[0].clientY;
    } else {
      clientX = e.clientX;
      clientY = e.clientY;
    }

    const x = (clientX - rect.left) * scaleX;
    const y = (clientY - rect.top) * scaleY;

    ctx.strokeStyle = isEraser ? "#FFFFFF" : color;
    ctx.lineWidth = brushSize;
    ctx.lineCap = "round";
    ctx.lineJoin = "round";
    ctx.lineTo(x, y);
    ctx.stroke();
  };

  const stopDrawing = () => {
    if (isDrawing) {
      setIsDrawing(false);
      saveState();
    }
  };

  const clearCanvas = () => {
    if (!confirm("क्या आप पूरा कैनवास साफ़ करना चाहते हैं?")) return;
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;
    ctx.fillStyle = "#FFFFFF";
    ctx.fillRect(0, 0, canvas.width, canvas.height);
    saveState();
  };

  const loadTemplate = (id: string) => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    ctx.fillStyle = "#FFFFFF";
    ctx.fillRect(0, 0, canvas.width, canvas.height);

    if (id === "blank") {
      saveState();
      return;
    }

    // Draw outline for kids to color
    ctx.strokeStyle = "#94A3B8";
    ctx.lineWidth = 4;
    ctx.lineCap = "round";

    if (id === "mango") {
      // Outline of mango
      ctx.beginPath();
      ctx.ellipse(380, 220, 110, 150, Math.PI / 4, 0, 2 * Math.PI);
      ctx.stroke();
      // Stem
      ctx.beginPath();
      ctx.moveTo(330, 100);
      ctx.quadraticCurveTo(340, 70, 360, 60);
      ctx.strokeStyle = "#78350F";
      ctx.lineWidth = 6;
      ctx.stroke();
      // Leaf
      ctx.beginPath();
      ctx.ellipse(370, 85, 35, 16, Math.PI / 6, 0, 2 * Math.PI);
      ctx.strokeStyle = "#16A34A";
      ctx.lineWidth = 3;
      ctx.stroke();
    } else if (id === "sun") {
      // Circle
      ctx.beginPath();
      ctx.arc(380, 210, 80, 0, 2 * Math.PI);
      ctx.stroke();
      // Rays
      for (let i = 0; i < 12; i++) {
        const angle = (i * Math.PI) / 6;
        const x1 = 380 + Math.cos(angle) * 95;
        const y1 = 210 + Math.sin(angle) * 95;
        const x2 = 380 + Math.cos(angle) * 125;
        const y2 = 210 + Math.sin(angle) * 125;
        ctx.beginPath();
        ctx.moveTo(x1, y1);
        ctx.lineTo(x2, y2);
        ctx.stroke();
      }
    } else if (id === "tree") {
      // Trunk
      ctx.beginPath();
      ctx.moveTo(350, 330);
      ctx.lineTo(350, 200);
      ctx.lineTo(410, 200);
      ctx.lineTo(410, 330);
      ctx.strokeStyle = "#78350F";
      ctx.lineWidth = 5;
      ctx.stroke();
      // Tree Crown
      ctx.beginPath();
      ctx.arc(380, 140, 85, 0, 2 * Math.PI);
      ctx.strokeStyle = "#16A34A";
      ctx.lineWidth = 4;
      ctx.stroke();
    } else if (id === "elephant") {
      // Body
      ctx.beginPath();
      ctx.ellipse(380, 210, 110, 85, 0, 0, 2 * Math.PI);
      ctx.stroke();
      // Head
      ctx.beginPath();
      ctx.arc(280, 190, 50, 0, 2 * Math.PI);
      ctx.stroke();
      // Trunk
      ctx.beginPath();
      ctx.moveTo(250, 210);
      ctx.quadraticCurveTo(210, 250, 230, 280);
      ctx.stroke();
    }
    saveState();
  };

  const downloadDrawing = () => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const image = canvas.toDataURL("image/png");
    const link = document.createElement("a");
    link.download = `वाणीसेतु-चित्रकला-${Date.now()}.png`;
    link.href = image;
    link.click();
    setSaveSuccess(true);
    setTimeout(() => setSaveSuccess(false), 3000);
  };

  return (
    <div className="p-4 sm:p-7 bg-[#F8FAFC] min-h-full space-y-6 max-w-6xl mx-auto font-sans">
      {/* 1. Header Banner matching Image 2 */}
      <StudentPageBanner
        icon="🎨"
        title="चित्रकला व रंग भरो"
        subtitle="डिजिटल कैनवास पर अपनी कल्पना से चित्र बनाएं, रंग भरें और सहेजें!"
        tag="सृजनात्मक कोना"
        gradientClass="from-[#2563EB] to-[#7C3AED]"
      />

      {/* Main Studio Card */}
      <div className="bg-white rounded-[16px] border border-[#C7D2FE] shadow-sm p-4 sm:p-6 space-y-5">
        {/* Template Selector */}
        <div className="space-y-2">
          <label className="text-xs font-black text-slate-700 uppercase tracking-wider block">
            १. चित्र रूपरेखा (टेम्पलेट) चुनें:
          </label>
          <div className="flex flex-wrap gap-2">
            {TEMPLATES.map((t) => (
              <button
                type="button"
                key={t.id}
                onClick={() => loadTemplate(t.id)}
                className="bg-[#EEF2FF] hover:bg-blue-100 text-slate-800 font-bold text-xs px-3.5 py-2 rounded-xl border border-[#C7D2FE] flex items-center gap-2 transition active:scale-95 cursor-pointer"
              >
                <span>{t.icon}</span>
                <span>{t.name}</span>
              </button>
            ))}
          </div>
        </div>

        {/* Toolbar: Colors, Brush/Eraser, Sizes */}
        <div className="flex flex-wrap items-center justify-between gap-3 bg-[#EEF2FF] p-3.5 rounded-2xl border border-[#C7D2FE]">
          {/* Color Palette */}
          <div className="flex items-center gap-2">
            <span className="text-xs font-black text-slate-700">रंग:</span>
            <div className="flex items-center gap-1.5 flex-wrap">
              {COLORS.map((c) => (
                <button
                  type="button"
                  key={c.value}
                  onClick={() => {
                    setColor(c.value);
                    setIsEraser(false);
                  }}
                  className={`w-7 h-7 rounded-full transition transform active:scale-95 cursor-pointer shadow-2xs ${
                    !isEraser && color === c.value
                      ? "ring-3 ring-blue-600 scale-110 shadow-sm"
                      : "hover:scale-105"
                  }`}
                  style={{ backgroundColor: c.value }}
                  title={c.name}
                />
              ))}
            </div>
          </div>

          {/* Brush / Eraser Mode */}
          <div className="flex items-center gap-2">
            <button
              type="button"
              onClick={() => setIsEraser(false)}
              className={`px-3.5 py-1.5 rounded-xl text-xs font-black border transition cursor-pointer ${
                !isEraser
                  ? "bg-blue-600 text-white border-blue-600 shadow-xs"
                  : "bg-white text-slate-700 border-[#C7D2FE] hover:bg-slate-50"
              }`}
            >
              ✏️ ब्रश
            </button>
            <button
              type="button"
              onClick={() => setIsEraser(true)}
              className={`px-3.5 py-1.5 rounded-xl text-xs font-black border transition cursor-pointer ${
                isEraser
                  ? "bg-blue-600 text-white border-blue-600 shadow-xs"
                  : "bg-white text-slate-700 border-[#C7D2FE] hover:bg-slate-50"
              }`}
            >
              🧹 रबर (इरेज़र)
            </button>
          </div>

          {/* Brush Size */}
          <div className="flex items-center gap-2">
            <span className="text-xs font-black text-slate-700">मोटाई:</span>
            {[3, 6, 12].map((sz) => (
              <button
                type="button"
                key={sz}
                onClick={() => setBrushSize(sz)}
                className={`px-2.5 py-1 rounded-lg text-xs font-bold border transition cursor-pointer ${
                  brushSize === sz
                    ? "bg-blue-600 text-white border-blue-600"
                    : "bg-white text-slate-700 border-[#C7D2FE]"
                }`}
              >
                {sz === 3 ? "पतला" : sz === 6 ? "मध्यम" : "मोटा"}
              </button>
            ))}
          </div>

          {/* Undo */}
          <button
            type="button"
            onClick={undo}
            className="bg-white hover:bg-slate-100 text-slate-700 border border-[#C7D2FE] px-3 py-1.5 rounded-xl text-xs font-bold flex items-center gap-1 cursor-pointer transition"
            title="पूर्ववत करें"
          >
            <span>↩️</span>
            <span>पूर्ववत (Undo)</span>
          </button>
        </div>

        {/* HTML5 Canvas */}
        <div className="border-2 border-dashed border-[#C7D2FE] rounded-2xl overflow-hidden bg-white shadow-inner flex justify-center p-2">
          <canvas
            ref={canvasRef}
            width={760}
            height={420}
            onMouseDown={startDrawing}
            onMouseMove={draw}
            onMouseUp={stopDrawing}
            onMouseLeave={stopDrawing}
            onTouchStart={startDrawing}
            onTouchMove={draw}
            onTouchEnd={stopDrawing}
            className="cursor-crosshair w-full max-w-full touch-none bg-white rounded-xl"
          />
        </div>

        {/* Action Controls */}
        <div className="flex flex-wrap items-center justify-between gap-3 pt-2 border-t border-slate-100">
          <button
            type="button"
            onClick={clearCanvas}
            className="bg-white hover:bg-red-50 text-red-600 border border-red-200 px-4 py-2.5 rounded-xl text-xs font-bold transition flex items-center gap-1.5 cursor-pointer shadow-2xs"
          >
            <span>🗑️</span>
            <span>कैनवास साफ़ करें</span>
          </button>

          <div className="flex items-center gap-3">
            {saveSuccess && (
              <span className="text-xs font-black text-emerald-700 bg-emerald-50 px-3 py-1.5 rounded-xl border border-emerald-200 animate-in fade-in">
                ✓ चित्र सहेज लिया गया!
              </span>
            )}
            <button
              type="button"
              onClick={downloadDrawing}
              className="bg-emerald-600 hover:bg-emerald-700 text-white font-black text-xs px-6 py-2.5 rounded-xl shadow-md transition flex items-center gap-2 cursor-pointer active:scale-95"
            >
              <span>💾</span>
              <span>चित्र सहेजें (डाउनलोड)</span>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
