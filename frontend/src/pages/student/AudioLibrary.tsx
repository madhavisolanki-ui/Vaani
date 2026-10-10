import { useState, useEffect } from "react";
import StudentPageBanner from "../../components/StudentPageBanner";

interface FolkStory {
  id: string;
  title: string;
  tribalSubtitle: string;
  duration: string;
  icon: string;
  category: string;
  content: string;
  tribalContent: string;
  moral: string;
}

const FOLK_STORIES: FolkStory[] = [
  {
    id: "story_1",
    title: "चतुर सियार और मगरमच्छ",
    tribalSubtitle: "तुयु आर तयां (हो / मुंडारी लोककथा)",
    duration: "2 मिनट",
    icon: "🦊",
    category: "लोककथा",
    content:
      "एक बार नदी किनारे एक चतुर सियार पानी पीने गया। वहाँ एक मगरमच्छ ने उसका पैर पकड़ लिया। सियार ने घबराने के बजाय ज़ोर से हँसते हुए कहा - 'अरे मूर्ख मगरमच्छ! तुमने मेरा पैर नहीं, बल्कि एक पेड़ की सूखी लकड़ी पकड़ रखी है!' मगरमच्छ ने लकड़ी समझकर पैर छोड़ दिया और सियार झट से कूदकर सुरक्षित भाग निकला।",
    tribalContent:
      "मियाद गाड़ा आड़े रे तुयु दाः णु लेका सेनेयाना। तयां तुयुआः काटा सबकेदा। तुयु कगे बोरोकेते लंदाकेते मेनेदा - 'ए तयां! आम दो काटा बांग सबाकादाम, सुकुरु दारू गे सबाकादाम!' तयां सुकुरु दारू आटकारकेते काटा आराकेदा, आर तुयु दौड़केते निर ओड़ोकेना।",
    moral: "मुसीबत के समय बुद्धि और धैर्य से काम लेना चाहिए।",
  },
  {
    id: "story_2",
    title: "सूरज और चाँद की दोस्ती",
    tribalSubtitle: "सिंगी आर चांदो (संथाली लोककथा)",
    duration: "3 मिनट",
    icon: "☀️",
    category: "पौराणिक कथा",
    content:
      "पुराने समय में सूरज और चाँद दोनों भाई-बहन थे और दोनों ही दिन में चमकते थे। लेकिन उनके तेज़ ताप से धरती पर पेड़-पौधे और नन्हे बच्चे झुलसने लगे। चाँद ने धरती की करुणा देखकर रात में शीतल रोशनी देने का फैसला किया, ताकि बच्चे मीठी नींद सो सकें और शीतल चाँदनी में प्रकृति मुस्कुरा सके।",
    tribalContent:
      "माड़ांग जुग रे सिंगी आर चांदो बारिया बोयहा किन ताहेंकाना। किन बानार सिंगी बेड़ा रे गे किन जुलोग काना ताहेंद। धरती रीन गिद्रा को लोः काना ताहेंद। चांदो गिद्रा कोवाः माया ञेलकेते ञिंदा बेड़ा रे रावांग आड़सांग सोदोरोः ए एहोबकेदा।",
    moral: "दूसरों की भलाई के लिए त्याग करना सबसे बड़ा गुण है।",
  },
  {
    id: "story_3",
    title: "नन्ही चिड़िया और विशाल आग",
    tribalSubtitle: "हुडिंग चेँड़े आर सेंगल (मुंडारी लोककथा)",
    duration: "2.5 मिनट",
    icon: "🐦",
    category: "प्रेरक प्रसंग",
    content:
      "एक बड़े जंगल में भीषण आग लग गई। सभी बड़े जानवर जान बचाकर भाग रहे थे। एक नन्ही चिड़िया अपनी चोंच में नदी से पानी की बूँदें भर-भरकर आग पर डाल रही थी। शेर ने हँसकर पूछा - 'क्या तेरी बूँद से आग बुझेगी?' चिड़िया ने उत्तर दिया - 'जब भी इस जंगल का इतिहास लिखा जाएगा, मेरा नाम आग लगाने वालों में नहीं, आग बुझाने वालों में होगा।' ",
    tribalContent:
      "मियाद मारंग बीर रे सेंगल लागावेना। जोतो मारंग जानवार को निरोः काना ताहेंद। मियाद हुडिंग चेँड़े गाड़ा खोन आकिंचोचो ते दाः आगुकेते सेंगल रे चुडुंगएद ताहेंद। चेँड़े मेनेदा - 'इञाः ञुतुम सेंगल इरांग रे गे ओलोग-आ!'",
    moral: "हमारा छोटा सा नेक प्रयास भी अत्यंत महत्वपूर्ण होता है।",
  },
  {
    id: "story_4",
    title: "गुलु और जादुई महुआ पेड़",
    tribalSubtitle: "गुलु आर जादू महुल दारू (झारखंड लोककथा)",
    duration: "3 मिनट",
    icon: "🌳",
    category: "प्रकृति प्रेम",
    content:
      "गुलु हर रोज़ सुबह उठकर गाँव के बूढ़े महुआ पेड़ को पानी देता था और पक्षियों के लिए दाना रखता था। सूखे के मौसम में जब पूरे गाँव में खाने की कमी हुई, तो उस महुआ पेड़ ने सबसे मीठे और पौष्टिक फूल दिए, जिससे पूरे गाँव के बच्चों को ताज़गी और पोषण मिला।",
    tribalContent:
      "गुलु दिनम सेता बेड़ा महुल दारू रे दाः दुलएद ताहेंद आर चेँड़े को लागीद चावले एराएद ताहेंद। रोहोर दिन रे महुल दारू जोतो खोन सिबिल बाहा एमाद कोवा, जाहाते आतो रीन गिद्रा को शक्ति ञामकेदा।",
    moral: "प्रकृति की रक्षा करने पर प्रकृति हमारा सदैव भरण-पोषण करती है।",
  },
];

export default function AudioLibrary() {
  const [playingStoryId, setPlayingStoryId] = useState<string | null>(null);
  const [activeLang, setActiveLang] = useState<"hindi" | "tribal">("hindi");
  const [speechSpeed, setSpeechSpeed] = useState<number>(1.0);
  const [selectedCategory, setSelectedCategory] = useState("all");

  useEffect(() => {
    return () => {
      if ("speechSynthesis" in window) {
        window.speechSynthesis.cancel();
      }
    };
  }, []);

  const handlePlayStory = (story: FolkStory) => {
    if (!("speechSynthesis" in window)) {
      alert("आपके ब्राउज़र में आवाज़ (Text-to-Speech) समर्थित नहीं है।");
      return;
    }

    if (playingStoryId === story.id) {
      window.speechSynthesis.cancel();
      setPlayingStoryId(null);
      return;
    }

    window.speechSynthesis.cancel();
    setPlayingStoryId(story.id);

    const textToRead = activeLang === "hindi" ? `${story.title}। ${story.content}। सीख: ${story.moral}` : `${story.title}। ${story.tribalContent}`;
    const utterance = new SpeechSynthesisUtterance(textToRead);
    utterance.lang = "hi-IN";
    utterance.rate = speechSpeed;

    utterance.onend = () => {
      setPlayingStoryId(null);
    };

    utterance.onerror = () => {
      setPlayingStoryId(null);
    };

    window.speechSynthesis.speak(utterance);
  };

  const handleStop = () => {
    if ("speechSynthesis" in window) {
      window.speechSynthesis.cancel();
    }
    setPlayingStoryId(null);
  };

  const filteredStories = selectedCategory === "all"
    ? FOLK_STORIES
    : FOLK_STORIES.filter((s) => s.category === selectedCategory);

  return (
    <div className="p-4 sm:p-7 bg-[#F8FAFC] min-h-full space-y-6 max-w-6xl mx-auto font-sans">
      {/* 1. Header Banner matching Image 2 */}
      <StudentPageBanner
        icon="🎧"
        title="कहानियाँ"
        subtitle="मातृभाषा व हिंदी में प्रेरणादायक लोककथाएँ, बालगीत एवं प्रकृति की कहानियाँ सुनें!"
        tag="लोककथाएँ व बालगीत"
        gradientClass="from-[#2563EB] to-[#7C3AED]"
      />

      {/* Control Bar: Language, Playback Speed, Filter */}
      <div className="bg-white rounded-[16px] border border-[#C7D2FE] p-4 sm:p-5 shadow-sm flex flex-wrap items-center justify-between gap-4">
        {/* Language Mode Toggle */}
        <div className="flex items-center gap-2">
          <span className="text-xs font-black text-slate-700">सुनाई देने वाली भाषा:</span>
          <div className="flex bg-[#EEF2FF] p-1 rounded-xl border border-[#C7D2FE]">
            <button
              type="button"
              onClick={() => {
                setActiveLang("hindi");
                if (playingStoryId) handleStop();
              }}
              className={`px-3 py-1.5 rounded-lg text-xs font-black transition cursor-pointer ${
                activeLang === "hindi"
                  ? "bg-blue-600 text-white shadow-xs"
                  : "text-slate-700 hover:text-slate-900"
              }`}
            >
              🇮🇳 हिंदी
            </button>
            <button
              type="button"
              onClick={() => {
                setActiveLang("tribal");
                if (playingStoryId) handleStop();
              }}
              className={`px-3 py-1.5 rounded-lg text-xs font-black transition cursor-pointer ${
                activeLang === "tribal"
                  ? "bg-blue-600 text-white shadow-xs"
                  : "text-slate-700 hover:text-slate-900"
              }`}
            >
              🌾 मातृभाषा (हो/मुंडारी/संथाली)
            </button>
          </div>
        </div>

        {/* Playback Speed */}
        <div className="flex items-center gap-2">
          <span className="text-xs font-black text-slate-700">ऑडियो गति:</span>
          <div className="flex bg-[#EEF2FF] p-1 rounded-xl border border-[#C7D2FE] text-xs font-bold">
            {[
              { val: 0.8, label: "०.८x (धीमी)" },
              { val: 1.0, label: "१.०x (सामान्य)" },
              { val: 1.2, label: "१.२x (तेज़)" },
            ].map((spd) => (
              <button
                type="button"
                key={spd.val}
                onClick={() => setSpeechSpeed(spd.val)}
                className={`px-2.5 py-1 rounded-lg transition cursor-pointer ${
                  speechSpeed === spd.val
                    ? "bg-blue-600 text-white shadow-xs"
                    : "text-slate-700 hover:text-slate-900"
                }`}
              >
                {spd.label}
              </button>
            ))}
          </div>
        </div>

        {/* Global Stop Button */}
        {playingStoryId && (
          <button
            type="button"
            onClick={handleStop}
            className="bg-red-50 hover:bg-red-100 text-red-600 border border-red-200 px-4 py-2 rounded-xl text-xs font-black flex items-center gap-1.5 cursor-pointer shadow-2xs transition"
          >
            <span>⏹️</span>
            <span>ऑडियो बंद करें</span>
          </button>
        )}
      </div>

      {/* Category Filter Pills */}
      <div className="flex flex-wrap items-center gap-2">
        <span className="text-xs font-black text-slate-700">कहानियों की श्रेणी:</span>
        {[
          { id: "all", label: "सभी कहानियाँ" },
          { id: "लोककथा", label: "📜 लोककथाएँ" },
          { id: "पौराणिक कथा", label: "✨ पौराणिक कथा" },
          { id: "प्रेरक प्रसंग", label: "💡 प्रेरक प्रसंग" },
          { id: "प्रकृति प्रेम", label: "🌿 प्रकृति प्रेम" },
        ].map((cat) => (
          <button
            type="button"
            key={cat.id}
            onClick={() => setSelectedCategory(cat.id)}
            className={`px-3 py-1.5 rounded-full text-xs font-bold border transition cursor-pointer ${
              selectedCategory === cat.id
                ? "bg-blue-600 text-white border-blue-600 shadow-2xs"
                : "bg-white text-slate-700 border-[#C7D2FE] hover:bg-[#EEF2FF]"
            }`}
          >
            {cat.label}
          </button>
        ))}
      </div>

      {/* Stories Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
        {filteredStories.map((story) => {
          const isPlaying = playingStoryId === story.id;
          return (
            <div
              key={story.id}
              className={`bg-white rounded-[16px] border p-5 sm:p-6 shadow-sm flex flex-col justify-between space-y-4 transition ${
                isPlaying
                  ? "border-amber-500 ring-2 ring-amber-300 bg-amber-50/20"
                  : "border-[#C7D2FE] hover:shadow-md"
              }`}
            >
              <div className="space-y-3">
                {/* Header of Story Card */}
                <div className="flex items-start justify-between gap-3">
                  <div className="flex items-center gap-3">
                    <span className="text-3xl p-2 bg-[#EEF2FF] rounded-2xl border border-[#C7D2FE]">
                      {story.icon}
                    </span>
                    <div>
                      <h3 className="text-base sm:text-lg font-black text-slate-900">
                        {story.title}
                      </h3>
                      <p className="text-xs font-bold text-amber-700">
                        {story.tribalSubtitle}
                      </p>
                    </div>
                  </div>
                  <span className="text-[11px] font-bold bg-[#EEF2FF] text-blue-900 px-2.5 py-1 rounded-full border border-[#C7D2FE] shrink-0">
                    ⏱️ {story.duration}
                  </span>
                </div>

                {/* Content */}
                <div className="bg-[#F8FAFC] p-3.5 rounded-xl border border-slate-200 text-xs text-slate-700 leading-relaxed font-medium">
                  {activeLang === "hindi" ? story.content : story.tribalContent}
                </div>

                {/* Moral */}
                <div className="bg-amber-50 p-2.5 rounded-xl border border-amber-200 text-xs font-bold text-amber-900 flex items-center gap-2">
                  <span>💡</span>
                  <span>सीख: {story.moral}</span>
                </div>
              </div>

              {/* Bottom Action */}
              <div className="pt-2 border-t border-slate-100 flex items-center justify-between">
                <span className="text-xs font-bold text-slate-500">
                  {isPlaying ? "🔊 कहानी चल रही है..." : "🎧 सुनने के लिए तैयार"}
                </span>

                <button
                  type="button"
                  onClick={() => handlePlayStory(story)}
                  className={`px-5 py-2.5 rounded-xl text-xs font-black shadow-md flex items-center gap-2 transition cursor-pointer active:scale-95 ${
                    isPlaying
                      ? "bg-red-600 hover:bg-red-700 text-white"
                      : "bg-blue-600 hover:bg-blue-700 text-white"
                  }`}
                >
                  <span>{isPlaying ? "⏸️ रोकें" : "▶️ कहानी सुनें"}</span>
                </button>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
