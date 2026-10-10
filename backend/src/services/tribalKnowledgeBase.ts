export type TribalLanguage = "san" | "ho" | "mun";

export interface LanguageMeta {
  code: TribalLanguage;
  name: string;
  nativeName: string;
  script: string;
  region: string;
  icon: string;
}

export const SUPPORTED_LANGUAGES: Record<TribalLanguage, LanguageMeta> = {
  san: {
    code: "san",
    name: "Santhali",
    nativeName: "ᱥᱟᱱᱛᱟᱲᱤ (संथाली)",
    script: "Ol Chiki / Devanagari",
    region: "Santhal Pargana, Jharkhand",
    icon: "",
  },
  ho: {
    code: "ho",
    name: "Ho",
    nativeName: "ᱦᱳ (हो)",
    script: "Warang Citi / Devanagari",
    region: "Kolhan Division, West Singhbhum, Jharkhand",
    icon: "",
  },
  mun: {
    code: "mun",
    name: "Mundari",
    nativeName: "ᱢᱩᱱᱰᱟᱨᱤ (मुंडारी)",
    script: "Devanagari / Mundari Bani",
    region: "Ranchi, Khunti, Jharkhand",
    icon: "",
  },
};

export interface VocabItem {
  id: string;
  hindi: string;
  english: string;
  category: string;
  icon: string;
  translations: {
    san: { native: string; devanagari: string; phonetic: string; audioText: string };
    ho: { native: string; devanagari: string; phonetic: string; audioText: string };
    mun: { native: string; devanagari: string; phonetic: string; audioText: string };
  };
}

// -----------------------------------------------------------------------------------
// Comprehensive Bilingual & Vernacular Dictionary (Tribal MTB-MLE)
// -----------------------------------------------------------------------------------
export const TRIBAL_VOCABULARY: VocabItem[] = [
  // 1. NUMBERS (1 - 20, 50, 100)
  { id: "num_1", hindi: "एक", english: "One", category: "numbers", icon: "1️⃣",
    translations: {
      san: { native: "ᱢᱤᱫ", devanagari: "मित", phonetic: "Mit", audioText: "Mit" },
      ho: { native: "ᱢᱤᱭᱟᱫ", devanagari: "मियाद", phonetic: "Miyad", audioText: "Miyad" },
      mun: { native: "ᱢᱤᱭᱟ", devanagari: "मिया", phonetic: "Miya", audioText: "Miya" },
    }
  },
  { id: "num_2", hindi: "दो", english: "Two", category: "numbers", icon: "2️⃣",
    translations: {
      san: { native: "ᱵᱟᱨ", devanagari: "बार", phonetic: "Bar", audioText: "Bar" },
      ho: { native: "ᱵᱟᱨᱤᱭᱟ", devanagari: "बारिया", phonetic: "Bariya", audioText: "Bariya" },
      mun: { native: "ᱵᱟᱨᱤᱭᱟ", devanagari: "बारिया", phonetic: "Bariya", audioText: "Bariya" },
    }
  },
  { id: "num_3", hindi: "तीन", english: "Three", category: "numbers", icon: "3️⃣",
    translations: {
      san: { native: "ᱯᱮ", devanagari: "पे", phonetic: "Pe", audioText: "Pe" },
      ho: { native: "ᱟᱯᱤᱭᱟ", devanagari: "आपिया", phonetic: "Apiya", audioText: "Apiya" },
      mun: { native: "ᱟᱯᱤᱭᱟ", devanagari: "अपिया", phonetic: "Apia", audioText: "Apia" },
    }
  },
  { id: "num_4", hindi: "चार", english: "Four", category: "numbers", icon: "4️⃣",
    translations: {
      san: { native: "ᱯᱳᱱ", devanagari: "पोन", phonetic: "Pon", audioText: "Pon" },
      ho: { native: "ᱩᱯᱩᱱᱤᱭᱟ", devanagari: "उपोनिया", phonetic: "Uponiya", audioText: "Uponiya" },
      mun: { native: "ᱩᱯᱩᱱᱤᱭᱟ", devanagari: "उपोनिया", phonetic: "Uponia", audioText: "Uponia" },
    }
  },
  { id: "num_5", hindi: "पाँच", english: "Five", category: "numbers", icon: "5️⃣",
    translations: {
      san: { native: "ᱢᱚᱬᱮ", devanagari: "मोड़े", phonetic: "More", audioText: "More" },
      ho: { native: "ᱢᱚᱬᱮᱭᱟ", devanagari: "मोड़ेया", phonetic: "Modeya", audioText: "Modeya" },
      mun: { native: "ᱢᱚᱬᱮᱭᱟ", devanagari: "मोड़ेया", phonetic: "Modeya", audioText: "Modeya" },
    }
  },
  { id: "num_6", hindi: "छह", english: "Six", category: "numbers", icon: "6️⃣",
    translations: {
      san: { native: "ᱛᱩᱨᱩᱭ", devanagari: "तुरुय", phonetic: "Turui", audioText: "Turui" },
      ho: { native: "ᱛᱩᱨᱤᱭᱟ", devanagari: "तुरिया", phonetic: "Turiya", audioText: "Turiya" },
      mun: { native: "ᱛᱩᱨᱩᱭᱟ", devanagari: "तुरुइया", phonetic: "Turuiya", audioText: "Turuiya" },
    }
  },
  { id: "num_7", hindi: "सात", english: "Seven", category: "numbers", icon: "7️⃣",
    translations: {
      san: { native: "ᱮᱭᱟᱭ", devanagari: "एयाय", phonetic: "Eyae", audioText: "Eyae" },
      ho: { native: "ᱮᱭᱟ", devanagari: "एया", phonetic: "Eya", audioText: "Eya" },
      mun: { native: "ᱮᱭᱟ", devanagari: "एया", phonetic: "Eya", audioText: "Eya" },
    }
  },
  { id: "num_8", hindi: "आठ", english: "Eight", category: "numbers", icon: "8️⃣",
    translations: {
      san: { native: "ᱤᱨᱟᱹᱞ", devanagari: "इरल", phonetic: "Iral", audioText: "Iral" },
      ho: { native: "ᱤᱨᱤᱞᱤᱭᱟ", devanagari: "इरलिया", phonetic: "Irliya", audioText: "Irliya" },
      mun: { native: "ᱤᱨᱤᱞᱤᱭᱟ", devanagari: "इरलिया", phonetic: "Irliya", audioText: "Irliya" },
    }
  },
  { id: "num_9", hindi: "नौ", english: "Nine", category: "numbers", icon: "9️⃣",
    translations: {
      san: { native: "ᱟᱨᱮ", devanagari: "आरे", phonetic: "Are", audioText: "Are" },
      ho: { native: "ᱟᱨᱮᱭᱟ", devanagari: "आरेया", phonetic: "Areya", audioText: "Areya" },
      mun: { native: "ᱟᱨᱮᱭᱟ", devanagari: "आरेया", phonetic: "Areya", audioText: "Areya" },
    }
  },
  { id: "num_10", hindi: "दस", english: "Ten", category: "numbers", icon: "🔟",
    translations: {
      san: { native: "ᱜᱮᱞ", devanagari: "गेल", phonetic: "Gel", audioText: "Gel" },
      ho: { native: "ᱜᱮᱞᱮᱭᱟ", devanagari: "गेलेया", phonetic: "Geleya", audioText: "Geleya" },
      mun: { native: "ᱜᱮᱞᱮᱭᱟ", devanagari: "गेलेया", phonetic: "Geleya", audioText: "Geleya" },
    }
  },

  // 2. PRONOUNS & COMMON PARTICLES
  { id: "prn_i", hindi: "मैं", english: "I / Me", category: "grammar", icon: "🙋",
    translations: {
      san: { native: "ᱤᱧ", devanagari: "इंज", phonetic: "Iny", audioText: "Iny" },
      ho: { native: "ᱟᱹᱧ", devanagari: "अंज", phonetic: "Any", audioText: "Any" },
      mun: { native: "ᱟᱹᱧ", devanagari: "अंज", phonetic: "Any", audioText: "Any" },
    }
  },
  { id: "prn_we", hindi: "हम", english: "We", category: "grammar", icon: "👥",
    translations: {
      san: { native: "ᱟᱵᱚ", devanagari: "आबो", phonetic: "Abo", audioText: "Abo" },
      ho: { native: "ᱟᱵᱩ", devanagari: "आबु", phonetic: "Abu", audioText: "Abu" },
      mun: { native: "ᱟᱵᱩ", devanagari: "आबु", phonetic: "Abu", audioText: "Abu" },
    }
  },
  { id: "prn_you", hindi: "तुम", english: "You", category: "grammar", icon: "👉",
    translations: {
      san: { native: "ᱟᱢ", devanagari: "आम", phonetic: "Am", audioText: "Am" },
      ho: { native: "ᱟᱢ", devanagari: "आम", phonetic: "Am", audioText: "Am" },
      mun: { native: "ᱟᱢ", devanagari: "आम", phonetic: "Am", audioText: "Am" },
    }
  },
  { id: "prn_you_all", hindi: "आप सब", english: "You all", category: "grammar", icon: "🙌",
    translations: {
      san: { native: "ᱟᱯᱮ", devanagari: "आपे", phonetic: "Ape", audioText: "Ape" },
      ho: { native: "ᱟᱯᱮ", devanagari: "आपे", phonetic: "Ape", audioText: "Ape" },
      mun: { native: "ᱟᱯᱮ", devanagari: "आपे", phonetic: "Ape", audioText: "Ape" },
    }
  },
  { id: "prn_he_she", hindi: "वह", english: "He/She", category: "grammar", icon: "👤",
    translations: {
      san: { native: "ᱩᱱᱤ", devanagari: "उनी", phonetic: "Uni", audioText: "Uni" },
      ho: { native: "ᱟᱹᱭ", devanagari: "अय", phonetic: "Ay", audioText: "Ay" },
      mun: { native: "ᱟᱹᱭ", devanagari: "अय", phonetic: "Ay", audioText: "Ay" },
    }
  },
  { id: "prn_this", hindi: "यह", english: "This", category: "grammar", icon: "👇",
    translations: {
      san: { native: "ᱱᱚᱶᱟ", devanagari: "नोवा", phonetic: "Nowa", audioText: "Nowa" },
      ho: { native: "ᱱᱮᱭᱟ", devanagari: "नेया", phonetic: "Neya", audioText: "Neya" },
      mun: { native: "ᱱᱮᱭᱟ", devanagari: "नेया", phonetic: "Neya", audioText: "Neya" },
    }
  },
  { id: "prn_that", hindi: "वह / वो", english: "That", category: "grammar", icon: "👉",
    translations: {
      san: { native: "ᱦᱟᱱᱟ", devanagari: "हाना", phonetic: "Hana", audioText: "Hana" },
      ho: { native: "ᱮᱱᱟ", devanagari: "एना", phonetic: "Ena", audioText: "Ena" },
      mun: { native: "ᱮᱱᱟ", devanagari: "एना", phonetic: "Ena", audioText: "Ena" },
    }
  },

  // 3. QUESTIONS (क्या, क्यों, कहाँ, कब, कैसे, कौन)
  { id: "q_what", hindi: "क्या", english: "What", category: "questions", icon: "❓",
    translations: {
      san: { native: "ᱪᱮᱫ", devanagari: "चेद", phonetic: "Ched", audioText: "Ched" },
      ho: { native: "ᱪᱤᱱᱟᱹ", devanagari: "चीनाः", phonetic: "China", audioText: "China" },
      mun: { native: "ᱪᱤᱱᱟᱹ", devanagari: "चीनाः", phonetic: "China", audioText: "China" },
    }
  },
  { id: "q_why", hindi: "क्यों", english: "Why", category: "questions", icon: "🤔",
    translations: {
      san: { native: "ᱪᱮᱫᱟᱜ", devanagari: "चेदाक", phonetic: "Chedah", audioText: "Chedah" },
      ho: { native: "ᱪᱤᱱᱟᱹᱜᱮ", devanagari: "चीनागे", phonetic: "Chinage", audioText: "Chinage" },
      mun: { native: "ᱪᱤᱱᱟᱹᱜᱮ", devanagari: "चीनागे", phonetic: "Chinage", audioText: "Chinage" },
    }
  },
  { id: "q_where", hindi: "कहाँ", english: "Where", category: "questions", icon: "📍",
    translations: {
      san: { native: "ᱚᱠᱟᱨᱮ", devanagari: "ओकारे", phonetic: "Okare", audioText: "Okare" },
      ho: { native: "ᱚᱠᱳᱨᱮ", devanagari: "ओकोरे", phonetic: "Okore", audioText: "Okore" },
      mun: { native: "ᱚᱠᱳᱨᱮ", devanagari: "ओकोरे", phonetic: "Okore", audioText: "Okore" },
    }
  },
  { id: "q_when", hindi: "कब", english: "When", category: "questions", icon: "⏰",
    translations: {
      san: { native: "ᱛᱤᱥ", devanagari: "तीस", phonetic: "Tis", audioText: "Tis" },
      ho: { native: "ᱛᱤᱥᱤᱝ", devanagari: "तीसिंग", phonetic: "Tising", audioText: "Tising" },
      mun: { native: "ᱛᱤᱥᱤᱝ", devanagari: "तीसिंग", phonetic: "Tising", audioText: "Tising" },
    }
  },
  { id: "q_who", hindi: "कौन", english: "Who", category: "questions", icon: "👤",
    translations: {
      san: { native: "ᱚᱠᱚᱭ", devanagari: "ओकोय", phonetic: "Okoy", audioText: "Okoy" },
      ho: { native: "ᱚᱠᱳᱭ", devanagari: "ओकोय", phonetic: "Okoy", audioText: "Okoy" },
      mun: { native: "ᱚᱠᱳᱭ", devanagari: "ओकोय", phonetic: "Okoy", audioText: "Okoy" },
    }
  },
  { id: "q_how", hindi: "कैसे", english: "How", category: "questions", icon: "💡",
    translations: {
      san: { native: "ᱪᱮᱫ ᱞᱮᱠᱟ", devanagari: "चेद लेका", phonetic: "Ched leka", audioText: "Ched leka" },
      ho: { native: "ᱪᱤᱞᱠᱟ", devanagari: "चिल्का", phonetic: "Chilka", audioText: "Chilka" },
      mun: { native: "ᱪᱤᱞᱠᱟ", devanagari: "चिल्का", phonetic: "Chilka", audioText: "Chilka" },
    }
  },

  // 4. COMMON VERBS (क्रिया)
  { id: "v_read", hindi: "पढ़ना", english: "Read", category: "verbs", icon: "📖",
    translations: {
      san: { native: "ᱯᱟᱲᱦᱟᱣ", devanagari: "पाड़हाव", phonetic: "Parhaw", audioText: "Parhaw" },
      ho: { native: "ᱯᱟᱲᱟᱣ", devanagari: "पाड़ाव", phonetic: "Paraw", audioText: "Paraw" },
      mun: { native: "ᱯᱟᱲᱦᱟᱣ", devanagari: "पाड़हाव", phonetic: "Parhaw", audioText: "Parhaw" },
    }
  },
  { id: "v_write", hindi: "लिखना", english: "Write", category: "verbs", icon: "✍️",
    translations: {
      san: { native: "ᱚᱞ", devanagari: "ओल", phonetic: "Ol", audioText: "Ol" },
      ho: { native: "ᱳᱞ", devanagari: "ओल", phonetic: "Ol", audioText: "Ol" },
      mun: { native: "ᱳᱞ", devanagari: "ओल", phonetic: "Ol", audioText: "Ol" },
    }
  },
  { id: "v_speak", hindi: "बोलना", english: "Speak", category: "verbs", icon: "🗣️",
    translations: {
      san: { native: "ᱨᱚᱲ", devanagari: "रोड़", phonetic: "Ror", audioText: "Ror" },
      ho: { native: "ᱠᱟᱡᱤ", devanagari: "काजी", phonetic: "Kaji", audioText: "Kaji" },
      mun: { native: "ᱠᱟᱡᱤ", devanagari: "काजी", phonetic: "Kaji", audioText: "Kaji" },
    }
  },
  { id: "v_listen", hindi: "सुनना", english: "Listen", category: "verbs", icon: "👂",
    translations: {
      san: { native: "ᱟᱸᱡᱚᱢ", devanagari: "आंजोम", phonetic: "Anjom", audioText: "Anjom" },
      ho: { native: "ᱟᱭᱩᱢ", devanagari: "आयूम", phonetic: "Ayum", audioText: "Ayum" },
      mun: { native: "ᱟᱸᱡᱚᱢ", devanagari: "आंजोम", phonetic: "Anjom", audioText: "Anjom" },
    }
  },
  { id: "v_see", hindi: "देखना", english: "See / Look", category: "verbs", icon: "👀",
    translations: {
      san: { native: "ᱧᱮᱞ", devanagari: "ञेल", phonetic: "Gnel", audioText: "Gnel" },
      ho: { native: "ᱱᱮᱞ", devanagari: "नेल", phonetic: "Nel", audioText: "Nel" },
      mun: { native: "ᱱᱮᱞ", devanagari: "नेल", phonetic: "Nel", audioText: "Nel" },
    }
  },
  { id: "v_eat", hindi: "खाना", english: "Eat", category: "verbs", icon: "🍲",
    translations: {
      san: { native: "ᱡᱚᱢ", devanagari: "जोम", phonetic: "Jom", audioText: "Jom" },
      ho: { native: "ᱡᱳᱢ", devanagari: "जोम", phonetic: "Jom", audioText: "Jom" },
      mun: { native: "ᱡᱳᱢ", devanagari: "जोम", phonetic: "Jom", audioText: "Jom" },
    }
  },
  { id: "v_drink", hindi: "पीना", english: "Drink", category: "verbs", icon: "🥛",
    translations: {
      san: { native: "ᱧᱩ", devanagari: "ञु", phonetic: "Gnu", audioText: "Gnu" },
      ho: { native: "ᱱᱩ", devanagari: "नू", phonetic: "Nu", audioText: "Nu" },
      mun: { native: "ᱱᱩ", devanagari: "नू", phonetic: "Nu", audioText: "Nu" },
    }
  },
  { id: "v_play", hindi: "खेलना", english: "Play", category: "verbs", icon: "⚽",
    translations: {
      san: { native: "ᱮᱱᱮᱡ", devanagari: "एनेज", phonetic: "Enej", audioText: "Enej" },
      ho: { native: "ᱤᱱᱩᱝ", devanagari: "इनुंग", phonetic: "Inung", audioText: "Inung" },
      mun: { native: "ᱤᱱᱩᱝ", devanagari: "इनुंग", phonetic: "Inung", audioText: "Inung" },
    }
  },
  { id: "v_come", hindi: "आना", english: "Come", category: "verbs", icon: "🚶",
    translations: {
      san: { native: "ᱦᱤᱡᱩᱜ", devanagari: "हिजुक", phonetic: "Hijuh", audioText: "Hijuh" },
      ho: { native: "ᱦᱤᱡᱩ", devanagari: "हिजु", phonetic: "Hiju", audioText: "Hiju" },
      mun: { native: "ᱦᱤᱡᱩ", devanagari: "हिजु", phonetic: "Hiju", audioText: "Hiju" },
    }
  },
  { id: "v_go", hindi: "जाना", english: "Go", category: "verbs", icon: "🏃",
    translations: {
      san: { native: "ᱥᱮᱱᱚᱜ", devanagari: "सेनोक", phonetic: "Senoh", audioText: "Senoh" },
      ho: { native: "ᱥᱮᱱᱳ", devanagari: "सेनो", phonetic: "Seno", audioText: "Seno" },
      mun: { native: "ᱥᱮᱱᱳ", devanagari: "सेनो", phonetic: "Seno", audioText: "Seno" },
    }
  },
  { id: "v_learn", hindi: "सीखना", english: "Learn", category: "verbs", icon: "🧠",
    translations: {
      san: { native: "ᱪᱮᱫᱚᱜ", devanagari: "चेदोक", phonetic: "Chedoh", audioText: "Chedoh" },
      ho: { native: "ᱤᱛᱩ", devanagari: "इतु", phonetic: "Itu", audioText: "Itu" },
      mun: { native: "ᱥᱮᱬᱟ", devanagari: "सेणा", phonetic: "Sena", audioText: "Sena" },
    }
  },

  // 5. NATURE & ENVIRONMENT (प्रकृति, पर्यावरण, स्थान)
  { id: "nat_sun", hindi: "सूरज / सूर्य", english: "Sun", category: "nature", icon: "☀️",
    translations: {
      san: { native: "ᱥᱤᱧ ᱪᱟᱸᱫᱚ", devanagari: "सिंय चांदो", phonetic: "Sing Chando", audioText: "Sing Chando" },
      ho: { native: "ᱥᱤᱝ ᱪᱟᱸᱫᱳ", devanagari: "सिंग चांदो", phonetic: "Sing Chando", audioText: "Sing Chando" },
      mun: { native: "ᱥᱤᱝ ᱪᱟᱸᱫᱳ", devanagari: "सिंग चांदो", phonetic: "Sing Chando", audioText: "Sing Chando" },
    }
  },
  { id: "nat_moon", hindi: "चाँद / चंद्रमा", english: "Moon", category: "nature", icon: "🌙",
    translations: {
      san: { native: "ᱧᱤᱫᱟᱹ ᱪᱟᱸᱫᱚ", devanagari: "ञिदा चांदो", phonetic: "Gnida Chando", audioText: "Gnida Chando" },
      ho: { native: "ᱪᱟᱸᱫᱳ", devanagari: "चांदो", phonetic: "Chando", audioText: "Chando" },
      mun: { native: "ᱪᱟᱸᱫᱳ", devanagari: "चांदो", phonetic: "Chando", audioText: "Chando" },
    }
  },
  { id: "nat_star", hindi: "तारे / तारा", english: "Star", category: "nature", icon: "⭐",
    translations: {
      san: { native: "ᱤᱯᱤᱞ", devanagari: "इपिल", phonetic: "Ipil", audioText: "Ipil" },
      ho: { native: "ᱤᱯᱤᱞ", devanagari: "इपिल", phonetic: "Ipil", audioText: "Ipil" },
      mun: { native: "ᱤᱯᱤᱞ", devanagari: "इपिल", phonetic: "Ipil", audioText: "Ipil" },
    }
  },
  { id: "nat_sky", hindi: "आकाश / आसमान", english: "Sky", category: "nature", icon: "🌌",
    translations: {
      san: { native: "ᱥᱮᱨᱢᱟ", devanagari: "सेरमा", phonetic: "Serma", audioText: "Serma" },
      ho: { native: "ᱥᱤᱨᱢᱟ", devanagari: "सिरमा", phonetic: "Sirma", audioText: "Sirma" },
      mun: { native: "ᱥᱤᱨᱢᱟ", devanagari: "सिरमा", phonetic: "Sirma", audioText: "Sirma" },
    }
  },
  { id: "nat_mountain", hindi: "पहाड़ / पर्वत", english: "Mountain", category: "nature", icon: "⛰️",
    translations: {
      san: { native: "ᱵᱩᱨᱩ", devanagari: "बुरु", phonetic: "Buru", audioText: "Buru" },
      ho: { native: "ᱵᱩᱨᱩ", devanagari: "बुरु", phonetic: "Buru", audioText: "Buru" },
      mun: { native: "ᱵᱩᱨᱩ", devanagari: "बुरु", phonetic: "Buru", audioText: "Buru" },
    }
  },
  { id: "nat_river", hindi: "नदी", english: "River", category: "nature", icon: "🌊",
    translations: {
      san: { native: "ᱜᱟᱰᱟ", devanagari: "गाडा", phonetic: "Gada", audioText: "Gada" },
      ho: { native: "ᱜᱟᱰᱟ", devanagari: "गाडा", phonetic: "Gada", audioText: "Gada" },
      mun: { native: "ᱜᱟᱰᱟ", devanagari: "गाडा", phonetic: "Gada", audioText: "Gada" },
    }
  },
  { id: "nat_forest", hindi: "जंगल / वन", english: "Forest", category: "nature", icon: "🌲",
    translations: {
      san: { native: "ᱵᱤᱨ", devanagari: "बीर", phonetic: "Bir", audioText: "Bir" },
      ho: { native: "ᱵᱤᱨ", devanagari: "बीर", phonetic: "Bir", audioText: "Bir" },
      mun: { native: "ᱵᱤᱨ", devanagari: "बीर", phonetic: "Bir", audioText: "Bir" },
    }
  },
  { id: "nat_village", hindi: "गाँव / ग्राम", english: "Village", category: "nature", icon: "🏡",
    translations: {
      san: { native: "ᱟᱹᱛᱩ", devanagari: "आतु", phonetic: "Atu", audioText: "Atu" },
      ho: { native: "ᱦᱟᱛᱩ", devanagari: "हातु", phonetic: "Hatu", audioText: "Hatu" },
      mun: { native: "ᱦᱟᱛᱩ", devanagari: "हातु", phonetic: "Hatu", audioText: "Hatu" },
    }
  },
  { id: "nat_flower", hindi: "फूल / पुष्प", english: "Flower", category: "nature", icon: "🌸",
    translations: {
      san: { native: "ᱵᱟᱦᱟ", devanagari: "बाहा", phonetic: "Baha", audioText: "Baha" },
      ho: { native: "ᱵᱟ", devanagari: "बा", phonetic: "Baa", audioText: "Baa" },
      mun: { native: "ᱵᱟ", devanagari: "बा", phonetic: "Baa", audioText: "Baa" },
    }
  },
  { id: "nat_fruit", hindi: "फल", english: "Fruit", category: "nature", icon: "🍎",
    translations: {
      san: { native: "ᱡᱚ", devanagari: "जो", phonetic: "Jo", audioText: "Jo" },
      ho: { native: "ᱡᱳ", devanagari: "जो", phonetic: "Jo", audioText: "Jo" },
      mun: { native: "ᱡᱳ", devanagari: "जो", phonetic: "Jo", audioText: "Jo" },
    }
  },
  { id: "nat_leaf", hindi: "पत्ता", english: "Leaf", category: "nature", icon: "🍃",
    translations: {
      san: { native: "ᱥᱟᱠᱟᱢ", devanagari: "साकाम", phonetic: "Sakam", audioText: "Sakam" },
      ho: { native: "ᱥᱟᱠᱟᱢ", devanagari: "साकाम", phonetic: "Sakam", audioText: "Sakam" },
      mun: { native: "ᱥᱟᱠᱟᱢ", devanagari: "साकाम", phonetic: "Sakam", audioText: "Sakam" },
    }
  },
  { id: "nat_rain", hindi: "बारिश / वर्षा", english: "Rain", category: "nature", icon: "🌧️",
    translations: {
      san: { native: "ᱫᱟᱜ / ᱡᱟᱹᱲᱤ", devanagari: "दाक / जाड़ी", phonetic: "Dah / Jari", audioText: "Dah" },
      ho: { native: "ᱜᱟᱢᱟ", devanagari: "गामा", phonetic: "Gama", audioText: "Gama" },
      mun: { native: "ᱜᱟᱢᱟ", devanagari: "गामा", phonetic: "Gama", audioText: "Gama" },
    }
  },

  // 6. FAMILY & RELATIONS (परिवार)
  { id: "fam_mother", hindi: "माँ / माता", english: "Mother", category: "family", icon: "👩",
    translations: {
      san: { native: "ᱟᱭᱳ", devanagari: "आयो", phonetic: "Ayo", audioText: "Ayo" },
      ho: { native: "ᱮᱸᱜᱟ", devanagari: "एंगा", phonetic: "Enga", audioText: "Enga" },
      mun: { native: "ᱮᱸᱜᱟ", devanagari: "एंगा", phonetic: "Enga", audioText: "Enga" },
    }
  },
  { id: "fam_father", hindi: "पिता / बाबा", english: "Father", category: "family", icon: "👨",
    translations: {
      san: { native: "ᱵᱟᱵᱟ", devanagari: "बाबा", phonetic: "Baba", audioText: "Baba" },
      ho: { native: "ᱟᱯᱟ", devanagari: "आपा", phonetic: "Apa", audioText: "Apa" },
      mun: { native: "ᱟᱯᱟ", devanagari: "आपा", phonetic: "Apa", audioText: "Apa" },
    }
  },
  { id: "fam_brother", hindi: "भाई", english: "Brother", category: "family", icon: "👦",
    translations: {
      san: { native: "ᱵᱚᱭᱦᱟ", devanagari: "बोयहा", phonetic: "Boyha", audioText: "Boyha" },
      ho: { native: "ᱦᱟᱜᱟ", devanagari: "हागा", phonetic: "Haga", audioText: "Haga" },
      mun: { native: "ᱦᱟᱜᱟ", devanagari: "हागा", phonetic: "Haga", audioText: "Haga" },
    }
  },
  { id: "fam_sister", hindi: "बहन", english: "Sister", category: "family", icon: "👧",
    translations: {
      san: { native: "ᱢᱤᱥᱤ", devanagari: "मिसि", phonetic: "Misi", audioText: "Misi" },
      ho: { native: "ᱢᱤᱥᱤ", devanagari: "मिसि", phonetic: "Misi", audioText: "Misi" },
      mun: { native: "ᱢᱤᱥᱤ", devanagari: "मिसि", phonetic: "Misi", audioText: "Misi" },
    }
  },
  { id: "fam_friend", hindi: "दोस्त / मित्र", english: "Friend", category: "family", icon: "🤝",
    translations: {
      san: { native: "ᱜᱟᱛᱮ", devanagari: "गाते", phonetic: "Gate", audioText: "Gate" },
      ho: { native: "ᱡᱩᱲᱤ", devanagari: "जुड़ी", phonetic: "Juri", audioText: "Juri" },
      mun: { native: "ᱡᱩᱲᱤ", devanagari: "जुड़ी", phonetic: "Juri", audioText: "Juri" },
    }
  },
  { id: "fam_child", hindi: "बच्चा / बच्चे", english: "Child / Children", category: "family", icon: "👶",
    translations: {
      san: { native: "ᱜᱤᱫᱽᱨᱟᱹ", devanagari: "गिदरा", phonetic: "Gidra", audioText: "Gidra" },
      ho: { native: "ᱦᱩᱱᱠᱳ", devanagari: "हुनको", phonetic: "Hunko", audioText: "Hunko" },
      mun: { native: "ᱦᱳᱱᱠᱳ", devanagari: "होनको", phonetic: "Honko", audioText: "Honko" },
    }
  },
  { id: "fam_teacher", hindi: "शिक्षक / गुरुजी", english: "Teacher", category: "family", icon: "👨‍🏫",
    translations: {
      san: { native: "ᱢᱟᱪᱮᱛ", devanagari: "माचेत", phonetic: "Machet", audioText: "Machet" },
      ho: { native: "ᱢᱟᱪᱮᱛ", devanagari: "माचेत", phonetic: "Machet", audioText: "Machet" },
      mun: { native: "ᱢᱟᱪᱮᱛ", devanagari: "माचेत", phonetic: "Machet", audioText: "Machet" },
    }
  },

  // 7. TIME & ADJECTIVES (समय और विशेषण)
  { id: "adj_good", hindi: "अच्छा / बहुत अच्छा", english: "Good / Great", category: "adjectives", icon: "👍",
    translations: {
      san: { native: "ᱵᱷᱟᱹᱜᱤ / ᱱᱟᱯᱟᱭ", devanagari: "भागि / नापाय", phonetic: "Bhagi / Napay", audioText: "Bhagi" },
      ho: { native: "ᱵᱩᱜᱤ", devanagari: "बुगी", phonetic: "Bugi", audioText: "Bugi" },
      mun: { native: "ᱵᱮᱥ", devanagari: "बेस", phonetic: "Besh", audioText: "Besh" },
    }
  },
  { id: "adj_big", hindi: "बड़ा", english: "Big", category: "adjectives", icon: "🐘",
    translations: {
      san: { native: "ᱢᱟᱨᱟᱝ", devanagari: "मारांग", phonetic: "Marang", audioText: "Marang" },
      ho: { native: "ᱢᱟᱨᱟᱝ", devanagari: "मारांग", phonetic: "Marang", audioText: "Marang" },
      mun: { native: "ᱢᱟᱨᱟᱝ", devanagari: "मारांग", phonetic: "Marang", audioText: "Marang" },
    }
  },
  { id: "adj_small", hindi: "छोटा", english: "Small", category: "adjectives", icon: "🐜",
    translations: {
      san: { native: "ᱦᱩᱰᱤᱧ", devanagari: "हुड़िंज", phonetic: "Hudinj", audioText: "Hudinj" },
      ho: { native: "ᱦᱩᱰᱤᱝ", devanagari: "हुडिंग", phonetic: "Huding", audioText: "Huding" },
      mun: { native: "ᱦᱩᱰᱤᱝ", devanagari: "हुडिंग", phonetic: "Huding", audioText: "Huding" },
    }
  },
  { id: "adj_happy", hindi: "खुश / प्रसन्न", english: "Happy", category: "adjectives", icon: "😊",
    translations: {
      san: { native: "ᱨᱟᱹᱥᱠᱟᱹ", devanagari: "रास्का", phonetic: "Raska", audioText: "Raska" },
      ho: { native: "ᱨᱟᱥᱠᱟ", devanagari: "रास्का", phonetic: "Raska", audioText: "Raska" },
      mun: { native: "ᱨᱟᱥᱠᱟ", devanagari: "रास्का", phonetic: "Raska", audioText: "Raska" },
    }
  },
  { id: "adj_beautiful", hindi: "सुंदर", english: "Beautiful", category: "adjectives", icon: "✨",
    translations: {
      san: { native: "ᱪᱚᱨᱚᱠ", devanagari: "चरोक", phonetic: "Chorok", audioText: "Chorok" },
      ho: { native: "ᱪᱚᱨᱚᱠ", devanagari: "चरोक", phonetic: "Chorok", audioText: "Chorok" },
      mun: { native: "ᱪᱚᱨᱚᱠ", devanagari: "चरोक", phonetic: "Chorok", audioText: "Chorok" },
    }
  },
  { id: "adj_today", hindi: "आज", english: "Today", category: "time", icon: "📅",
    translations: {
      san: { native: "ᱛᱮᱦᱮᱧ", devanagari: "तेहेंज", phonetic: "Tehenj", audioText: "Tehenj" },
      ho: { native: "ᱛᱤᱥᱤᱝ", devanagari: "तिसिंग", phonetic: "Tising", audioText: "Tising" },
      mun: { native: "ᱛᱤᱧ", devanagari: "तिंय", phonetic: "Tiny", audioText: "Tiny" },
    }
  },
  { id: "adj_tomorrow", hindi: "कल (आने वाला)", english: "Tomorrow", category: "time", icon: "🌅",
    translations: {
      san: { native: "ᱜᱟᱯᱟ", devanagari: "गापा", phonetic: "Gapa", audioText: "Gapa" },
      ho: { native: "ᱜᱟᱯᱟ", devanagari: "गापा", phonetic: "Gapa", audioText: "Gapa" },
      mun: { native: "ᱜᱟᱯᱟ", devanagari: "गापा", phonetic: "Gapa", audioText: "Gapa" },
    }
  },
  { id: "adj_morning", hindi: "सुबह", english: "Morning", category: "time", icon: "☀️",
    translations: {
      san: { native: "ᱥᱮᱛᱟᱜ", devanagari: "सेताक", phonetic: "Setah", audioText: "Setah" },
      ho: { native: "ᱥᱮᱛᱟ", devanagari: "सेता", phonetic: "Seta", audioText: "Seta" },
      mun: { native: "ᱥᱮᱛᱟ", devanagari: "सेता", phonetic: "Seta", audioText: "Seta" },
    }
  },
  { id: "adj_evening", hindi: "शाम", english: "Evening", category: "time", icon: "🌆",
    translations: {
      san: { native: "ᱟᱹᱭᱩᱵ", devanagari: "आयुब", phonetic: "Ayub", audioText: "Ayub" },
      ho: { native: "ᱟᱹᱭᱩᱵ", devanagari: "आयुब", phonetic: "Ayub", audioText: "Ayub" },
      mun: { native: "ᱟᱹᱭᱩᱵ", devanagari: "आयुब", phonetic: "Ayub", audioText: "Ayub" },
    }
  },

  // 8. ANIMALS & BIRDS (पशु और पक्षी)
  { id: "anim_dog", hindi: "कुत्ता", english: "Dog", category: "animals", icon: "🐕",
    translations: {
      san: { native: "ᱥᱮᱛᱟ", devanagari: "सेता", phonetic: "Seta", audioText: "Seta" },
      ho: { native: "ᱥᱮᱛᱟ", devanagari: "सेता", phonetic: "Seta", audioText: "Seta" },
      mun: { native: "ᱥᱮᱛᱟ", devanagari: "सेता", phonetic: "Seta", audioText: "Seta" },
    }
  },
  { id: "anim_cat", hindi: "बिल्ली", english: "Cat", category: "animals", icon: "🐈",
    translations: {
      san: { native: "ᱯᱩᱥᱤ", devanagari: "पुसी", phonetic: "Pusi", audioText: "Pusi" },
      ho: { native: "ᱯᱩᱥᱤ", devanagari: "पुसी", phonetic: "Pusi", audioText: "Pusi" },
      mun: { native: "ᱯᱩᱥᱤ", devanagari: "पुसी", phonetic: "Pusi", audioText: "Pusi" },
    }
  },
  { id: "anim_cow", hindi: "गाय", english: "Cow", category: "animals", icon: "🐄",
    translations: {
      san: { native: "ᱜᱟᱹᱭ", devanagari: "गइ", phonetic: "Gai", audioText: "Gai" },
      ho: { native: "ᱜᱟᱹᱭ", devanagari: "गइ", phonetic: "Gai", audioText: "Gai" },
      mun: { native: "ᱜᱟᱹᱭ", devanagari: "गइ", phonetic: "Gai", audioText: "Gai" },
    }
  },
  { id: "anim_bull", hindi: "बैल", english: "Ox / Bull", category: "animals", icon: "🐂",
    translations: {
      san: { native: "ᱰᱟᱝᱜᱽᱨᱟ", devanagari: "डांगरा", phonetic: "Dangra", audioText: "Dangra" },
      ho: { native: "ᱰᱟᱝᱜᱽᱨᱟ", devanagari: "डांगरा", phonetic: "Dangra", audioText: "Dangra" },
      mun: { native: "ᱰᱟᱝᱜᱽᱨᱟ", devanagari: "डांगरा", phonetic: "Dangra", audioText: "Dangra" },
    }
  },
  { id: "anim_goat", hindi: "बकरी", english: "Goat", category: "animals", icon: "🐐",
    translations: {
      san: { native: "ᱢᱮᱨᱚᱢ", devanagari: "मेरोम", phonetic: "Merom", audioText: "Merom" },
      ho: { native: "ᱢᱮᱨᱚᱢ", devanagari: "मेरोम", phonetic: "Merom", audioText: "Merom" },
      mun: { native: "ᱢᱮᱨᱚᱢ", devanagari: "मेरोम", phonetic: "Merom", audioText: "Merom" },
    }
  },
  { id: "anim_bird", hindi: "चिड़िया / पक्षी", english: "Bird", category: "animals", icon: "🐦",
    translations: {
      san: { native: "ᱪᱮᱬᱮ", devanagari: "चेणे", phonetic: "Chene", audioText: "Chene" },
      ho: { native: "ᱪᱮᱬᱮ", devanagari: "चेणे", phonetic: "Chene", audioText: "Chene" },
      mun: { native: "ᱪᱮᱬᱮ", devanagari: "चेणे", phonetic: "Chene", audioText: "Chene" },
    }
  },
  { id: "anim_fish", hindi: "मछली", english: "Fish", category: "animals", icon: "🐟",
    translations: {
      san: { native: "ᱦᱟᱹᱠᱩ", devanagari: "हाकु", phonetic: "Haku", audioText: "Haku" },
      ho: { native: "ᱦᱟᱹᱠᱩ", devanagari: "हाकु", phonetic: "Haku", audioText: "Haku" },
      mun: { native: "ᱦᱟᱹᱠᱩ", devanagari: "हाकु", phonetic: "Haku", audioText: "Haku" },
    }
  },
  { id: "anim_elephant", hindi: "हाथी", english: "Elephant", category: "animals", icon: "🐘",
    translations: {
      san: { native: "ᱦᱟᱹᱛᱤ", devanagari: "हाती", phonetic: "Hati", audioText: "Hati" },
      ho: { native: "ᱦᱟᱹᱛᱤ", devanagari: "हाती", phonetic: "Hati", audioText: "Hati" },
      mun: { native: "ᱦᱟᱹᱛᱤ", devanagari: "हाती", phonetic: "Hati", audioText: "Hati" },
    }
  },
  { id: "anim_tiger", hindi: "बाघ / शेर", english: "Tiger", category: "animals", icon: "🐅",
    translations: {
      san: { native: "ᱛᱟᱹᱨᱩᱵ", devanagari: "तारुब", phonetic: "Tarub", audioText: "Tarub" },
      ho: { native: "ᱛᱟᱹᱨᱩᱵ", devanagari: "तारुब", phonetic: "Tarub", audioText: "Tarub" },
      mun: { native: "ᱛᱟᱹᱨᱩᱵ", devanagari: "तारुब", phonetic: "Tarub", audioText: "Tarub" },
    }
  },
  { id: "anim_monkey", hindi: "बंदर", english: "Monkey", category: "animals", icon: "🐒",
    translations: {
      san: { native: "ᱜᱟᱹᱲᱤ", devanagari: "गाड़ी", phonetic: "Gari", audioText: "Gari" },
      ho: { native: "ᱜᱟᱹᱲᱤ", devanagari: "गाड़ी", phonetic: "Gari", audioText: "Gari" },
      mun: { native: "ᱜᱟᱹᱲᱤ", devanagari: "गाड़ी", phonetic: "Gari", audioText: "Gari" },
    }
  },

  // 9. COLORS (रंग)
  { id: "col_red", hindi: "लाल", english: "Red", category: "colors", icon: "🔴",
    translations: {
      san: { native: "ᱟᱨᱟᱜ", devanagari: "आराक", phonetic: "Arah", audioText: "Arah" },
      ho: { native: "ᱟᱨᱟ", devanagari: "आरा", phonetic: "Ara", audioText: "Ara" },
      mun: { native: "ᱟᱨᱟ", devanagari: "आरा", phonetic: "Ara", audioText: "Ara" },
    }
  },
  { id: "col_green", hindi: "हरा", english: "Green", category: "colors", icon: "🟢",
    translations: {
      san: { native: "ᱦᱟᱹᱨᱭᱟᱹᱲ", devanagari: "हरियाड़", phonetic: "Haryar", audioText: "Haryar" },
      ho: { native: "ᱦᱟᱹᱨᱤᱭᱟᱹᱲ", devanagari: "हरियाड़", phonetic: "Haryar", audioText: "Haryar" },
      mun: { native: "ᱦᱟᱹᱨᱤᱭᱟᱹᱲ", devanagari: "हरियाड़", phonetic: "Haryar", audioText: "Haryar" },
    }
  },
  { id: "col_yellow", hindi: "पीला", english: "Yellow", category: "colors", icon: "🟡",
    translations: {
      san: { native: "ᱥᱟᱥᱟᱝ", devanagari: "सासांग", phonetic: "Sasang", audioText: "Sasang" },
      ho: { native: "ᱥᱟᱥᱟᱝ", devanagari: "सासांग", phonetic: "Sasang", audioText: "Sasang" },
      mun: { native: "ᱥᱟᱥᱟᱝ", devanagari: "सासांग", phonetic: "Sasang", audioText: "Sasang" },
    }
  },
  { id: "col_white", hindi: "सफेद", english: "White", category: "colors", icon: "⚪",
    translations: {
      san: { native: "ᱯᱩᱸᱰ", devanagari: "पुंड", phonetic: "Pund", audioText: "Pund" },
      ho: { native: "ᱯᱩᱱᱰᱤ", devanagari: "पुंडी", phonetic: "Pundi", audioText: "Pundi" },
      mun: { native: "ᱯᱩᱱᱰᱤ", devanagari: "पुंडी", phonetic: "Pundi", audioText: "Pundi" },
    }
  },
  { id: "col_black", hindi: "काला", english: "Black", category: "colors", icon: "⚫",
    translations: {
      san: { native: "ᱦᱮᱸᱫᱮ", devanagari: "हेंदे", phonetic: "Hende", audioText: "Hende" },
      ho: { native: "ᱦᱮᱸᱫᱮ", devanagari: "हेंदे", phonetic: "Hende", audioText: "Hende" },
      mun: { native: "ᱦᱮᱸᱫᱮ", devanagari: "हेंदे", phonetic: "Hende", audioText: "Hende" },
    }
  },
  { id: "col_blue", hindi: "नीला", english: "Blue", category: "colors", icon: "🔵",
    translations: {
      san: { native: "ᱞᱤᱞ", devanagari: "लील", phonetic: "Lil", audioText: "Lil" },
      ho: { native: "ᱞᱤᱞ", devanagari: "लील", phonetic: "Lil", audioText: "Lil" },
      mun: { native: "ᱞᱤᱞ", devanagari: "लील", phonetic: "Lil", audioText: "Lil" },
    }
  },

  // 10. SCHOOL & CLASSROOM (स्कूल और कक्षा)
  { id: "sch_school", hindi: "स्कूल / विद्यालय", english: "School", category: "school", icon: "🏫",
    translations: {
      san: { native: "ᱤᱛᱩᱱ ᱟᱥᱲᱟ", devanagari: "इतुन आसड़ा", phonetic: "Itun Asra", audioText: "Itun Asra" },
      ho: { native: "ᱤᱛᱩᱱ ᱟᱥᱲᱟ", devanagari: "इतुन आसड़ा", phonetic: "Itun Asra", audioText: "Itun Asra" },
      mun: { native: "ᱤᱛᱩᱱ ᱟᱥᱲᱟ", devanagari: "इतुन आसड़ा", phonetic: "Itun Asra", audioText: "Itun Asra" },
    }
  },
  { id: "sch_water", hindi: "पानी / जल", english: "Water", category: "school", icon: "💧",
    translations: {
      san: { native: "ᱫᱟᱜ", devanagari: "दाक", phonetic: "Dah", audioText: "Dah" },
      ho: { native: "ᱫᱟᱜ", devanagari: "दाक", phonetic: "Dah", audioText: "Dah" },
      mun: { native: "ᱫᱟᱜ", devanagari: "दाक", phonetic: "Dah", audioText: "Dah" },
    }
  },
  { id: "sch_food", hindi: "खाना / भात / चावल", english: "Food / Rice", category: "school", icon: "🍚",
    translations: {
      san: { native: "ᱫᱟᱠᱟ", devanagari: "दाका", phonetic: "Daka", audioText: "Daka" },
      ho: { native: "ᱢᱟᱱᱰᱤ", devanagari: "मांडी", phonetic: "Mandi", audioText: "Mandi" },
      mun: { native: "ᱢᱟᱱᱰᱤ", devanagari: "मांडी", phonetic: "Mandi", audioText: "Mandi" },
    }
  },
  { id: "sch_tree", hindi: "पेड़ / वृक्ष", english: "Tree", category: "nature", icon: "🌳",
    translations: {
      san: { native: "ᱫᱟᱨᱮ", devanagari: "दारे", phonetic: "Dare", audioText: "Dare" },
      ho: { native: "ᱫᱟᱨᱩ", devanagari: "दारु", phonetic: "Daru", audioText: "Daru" },
      mun: { native: "ᱫᱟᱨᱩ", devanagari: "दारु", phonetic: "Daru", audioText: "Daru" },
    }
  },
  { id: "sch_house", hindi: "घर / मकान", english: "House / Home", category: "nature", icon: "🏠",
    translations: {
      san: { native: "ᱚᱲᱟᱜ", devanagari: "ओड़ाक", phonetic: "Orah", audioText: "Orah" },
      ho: { native: "ᱚᱲᱟᱜ", devanagari: "ओड़ाक", phonetic: "Orah", audioText: "Orah" },
      mun: { native: "ᱚᱲᱟᱜ", devanagari: "ओड़ाक", phonetic: "Orah", audioText: "Orah" },
    }
  },
  { id: "sch_hand", hindi: "हाथ", english: "Hand", category: "body", icon: "✋",
    translations: {
      san: { native: "ᱛᱤ", devanagari: "ती", phonetic: "Ti", audioText: "Ti" },
      ho: { native: "ᱛᱤ", devanagari: "ती", phonetic: "Ti", audioText: "Ti" },
      mun: { native: "ᱛᱤ", devanagari: "ती", phonetic: "Ti", audioText: "Ti" },
    }
  },
  { id: "sch_eye", hindi: "आँख", english: "Eye", category: "body", icon: "👁️",
    translations: {
      san: { native: "ᱢᱮᱫ", devanagari: "मेत", phonetic: "Met", audioText: "Met" },
      ho: { native: "ᱢᱮᱫ", devanagari: "मेत", phonetic: "Met", audioText: "Met" },
      mun: { native: "ᱢᱮᱫ", devanagari: "मेत", phonetic: "Met", audioText: "Met" },
    }
  },

  // 11. GRAMMAR PARTICLES, CONJUNCTIONS & AUXILIARY VERBS (व्याकरण, कारक व संयोजक)
  { id: "par_on", hindi: "पर / ऊपर / में", english: "On / In / At", category: "grammar", icon: "📍",
    translations: {
      san: { native: "ᱨᱮ", devanagari: "रे", phonetic: "Re", audioText: "Re" },
      ho: { native: "ᱨᱮ", devanagari: "रे", phonetic: "Re", audioText: "Re" },
      mun: { native: "ᱨᱮ", devanagari: "रे", phonetic: "Re", audioText: "Re" },
    }
  },
  { id: "par_and", hindi: "और / तथा", english: "And", category: "grammar", icon: "➕",
    translations: {
      san: { native: "ᱟᱨ", devanagari: "आर", phonetic: "Ar", audioText: "Ar" },
      ho: { native: "ᱟᱱᱤ", devanagari: "आनी", phonetic: "Ani", audioText: "Ani" },
      mun: { native: "ᱟᱨ", devanagari: "आर", phonetic: "Ar", audioText: "Ar" },
    }
  },
  { id: "par_from", hindi: "से", english: "From / With", category: "grammar", icon: "➡️",
    translations: {
      san: { native: "ᱠᱷᱚᱱ", devanagari: "खोन", phonetic: "Khon", audioText: "Khon" },
      ho: { native: "ᱮᱛᱮ", devanagari: "एते", phonetic: "Ete", audioText: "Ete" },
      mun: { native: "ᱠᱷᱚᱱ", devanagari: "खोन", phonetic: "Khon", audioText: "Khon" },
    }
  },
  { id: "par_is_are", hindi: "है / हैं / हूँ", english: "Is / Are / Am", category: "grammar", icon: "✨",
    translations: {
      san: { native: "ᱢᱮᱱᱟᱜ-ᱟ", devanagari: "मेनाग-आ", phonetic: "Menag-a", audioText: "Menag-a" },
      ho: { native: "ᱢᱮᱱᱟ", devanagari: "मेना", phonetic: "Mena", audioText: "Mena" },
      mun: { native: "ᱢᱮᱱᱟ", devanagari: "मेना", phonetic: "Mena", audioText: "Mena" },
    }
  },
  { id: "par_was_were", hindi: "था / थी / थे", english: "Was / Were", category: "grammar", icon: "⏳",
    translations: {
      san: { native: "ᱛᱟᱦᱮᱸᱠᱟᱱᱟ", devanagari: "ताहेंकाना", phonetic: "Tahenkana", audioText: "Tahenkana" },
      ho: { native: "ᱛᱟᱭᱠᱮᱱᱟ", devanagari: "तायकेना", phonetic: "Taikena", audioText: "Taikena" },
      mun: { native: "ᱛᱟᱭᱠᱮᱱᱟ", devanagari: "तायकेना", phonetic: "Taikena", audioText: "Taikena" },
    }
  },
  { id: "v_sit_down", hindi: "बैठना / बैठ / बैठी / बैठे", english: "Sit", category: "verbs", icon: "🪑",
    translations: {
      san: { native: "ᱫᱩᱲᱩᱵ", devanagari: "दुरुब", phonetic: "Durup", audioText: "Durup" },
      ho: { native: "ᱫᱩᱵᱽ", devanagari: "दुब", phonetic: "Dub", audioText: "Dub" },
      mun: { native: "ᱫᱩᱲᱩᱵ", devanagari: "दुरुब", phonetic: "Durup", audioText: "Durup" },
    }
  },
  { id: "v_live_stay", hindi: "रहना / रहते / रहती", english: "Live / Stay", category: "verbs", icon: "🏡",
    translations: {
      san: { native: "ᱛᱟᱦᱮᱸᱱ", devanagari: "ताहेंन", phonetic: "Tahen", audioText: "Tahen" },
      ho: { native: "ᱛᱟᱭᱱ", devanagari: "तायन", phonetic: "Tain", audioText: "Tain" },
      mun: { native: "ᱛᱟᱭᱱ", devanagari: "तायन", phonetic: "Tain", audioText: "Tain" },
    }
  },
  { id: "v_shine", hindi: "चमकना / चमकता / चमकती", english: "Shine", category: "verbs", icon: "✨",
    translations: {
      san: { native: "ᱡᱤᱞᱤᱠ", devanagari: "जिलिक", phonetic: "Jilik", audioText: "Jilik" },
      ho: { native: "ᱡᱤᱞᱤᱠ", devanagari: "जिलिक", phonetic: "Jilik", audioText: "Jilik" },
      mun: { native: "ᱡᱤᱞᱤᱠ", devanagari: "जिलिक", phonetic: "Jilik", audioText: "Jilik" },
    }
  },
  { id: "v_want", hindi: "चाहना / चाहता / चाहती", english: "Want", category: "verbs", icon: "💭",
    translations: {
      san: { native: "ᱠᱷᱚᱡ", devanagari: "खोज", phonetic: "Khoj", audioText: "Khoj" },
      ho: { native: "ᱠᱷᱳᱡ", devanagari: "खोज", phonetic: "Khoj", audioText: "Khoj" },
      mun: { native: "ᱠᱷᱳᱡ", devanagari: "खोज", phonetic: "Khoj", audioText: "Khoj" },
    }
  },
  { id: "adj_very", hindi: "बहुत / ज्यादा", english: "Very / Much", category: "adjectives", icon: "⭐",
    translations: {
      san: { native: "ᱟᱹᱰᱤ", devanagari: "आडी", phonetic: "Adi", audioText: "Adi" },
      ho: { native: "ᱟᱹᱰᱤ", devanagari: "आडी", phonetic: "Adi", audioText: "Adi" },
      mun: { native: "ᱟᱹᱰᱤ", devanagari: "आडी", phonetic: "Adi", audioText: "Adi" },
    }
  },
];

// -----------------------------------------------------------------------------------
// Real-Time Ol Chiki (ᱚᱞ ᱪᱤᱠᱤ) & Warang Citi Script Transliteration Map
// -----------------------------------------------------------------------------------
const DEVANAGARI_TO_OL_CHIKI: Record<string, string> = {
  "क": "ᱠ", "ख": "ᱠᱷ", "ग": "ᱜ", "घ": "ᱜᱷ", "ङ": "ᱝ",
  "च": "ᱪ", "छ": "ᱪᱷ", "ज": "ᱡ", "झ": "ᱡᱷ", "ञ": "ᱧ",
  "ट": "ᱴ", "ठ": "ᱴᱷ", "ड": "ᱰ", "ढ": "ᱰᱷ", "ण": "ᱬ",
  "त": "ᱛ", "थ": "ᱛᱷ", "द": "ᱫ", "ध": "ᱫᱷ", "न": "ᱱ",
  "प": "ᱯ", "फ": "ᱯᱷ", "ब": "ᱵ", "भ": "ᱵᱷ", "म": "ᱢ",
  "य": "ᱭ", "र": "ᱨ", "ल": "ᱞ", "व": "ᱣ", "श": "ᱥ",
  "ष": "ᱥ", "स": "ᱥ", "ह": "ᱦ", "ड़": "ᱲ", "ढ़": "ᱲᱷ",
  "अ": "ᱚ", "आ": "ᱟ", "इ": "ᱤ", "ई": "ᱤ", "उ": "ᱩ",
  "ऊ": "ᱩ", "ऋ": "ᱨᱤ", "ए": "ᱮ", "ऐ": "ᱮ", "ओ": "ᱳ",
  "औ": "ᱳ", "ं": "ᱸ", "ः": "ᱺ", "ँ": "ᱸ",
  "ा": "ᱟ", "ि": "ᱤ", "ी": "ᱤ", "ु": "ᱩ", "ू": "ᱩ",
  "े": "ᱮ", "ै": "ᱮ", "ो": "ᱳ", "ौ": "ᱳ", "्": "",
  "०": "᱐", "१": "᱑", "२": "᱒", "३": "᱓", "४": "᱔",
  "५": "᱕", "६": "᱖", "७": "᱗", "८": "᱘", "९": "᱙",
  "1": "᱑", "2": "᱒", "3": "᱓", "4": "᱔", "5": "᱕",
  "6": "᱖", "7": "᱗", "8": "᱘", "9": "᱙", "0": "᱐",
  " ": " ", "।": "।", "?": "?", "!": "!", ",": ",", ".": ".",
};

export function transliterateToOlChiki(text: string): string {
  let result = "";
  for (let i = 0; i < text.length; i++) {
    const char = text[i];
    result += DEVANAGARI_TO_OL_CHIKI[char] || char;
  }
  return result;
}

// -----------------------------------------------------------------------------------
// Expanded Classroom Dialogue Patterns
// -----------------------------------------------------------------------------------
export const CLASSROOM_DIALOGUE_PATTERNS: Array<{
  keywords: string[];
  hindi: string;
  san: { native: string; devanagari: string; phonetic: string };
  ho: { native: string; devanagari: string; phonetic: string };
  mun: { native: string; devanagari: string; phonetic: string };
}> = [
  {
    keywords: ["hello", "नमस्ते", "स्वागत", "प्रणाम", "जोहार", "good morning"],
    hindi: "नमस्ते बच्चों, कक्षा में सबका स्वागत है!",
    san: { native: "ᱡᱚᱦᱟᱨ ᱜᱤᱫᱽᱨᱟᱹ ᱠᱚ, ᱠᱞᱟᱥ ᱨᱮ ᱥᱟᱱᱟᱢ ᱠᱚᱣᱟᱜ ᱥᱟᱹᱜᱩᱱ ᱫᱟᱨᱟᱢ!", devanagari: "जोहार गिदरा को, क्लास रे सानाम कोवाग सागुन दाराम!", phonetic: "Johar gidra ko, class re sanam kowag sagun daram!" },
    ho: { native: "ᱡᱳᱣᱟᱨ ᱜᱤᱫᱽᱨᱟᱹ ᱠᱳ, ᱠᱞᱟᱥ ᱨᱮ ᱥᱟᱱᱟᱢ ᱠᱳ ᱢᱟᱱᱟᱣ ᱢᱮ!", devanagari: "जोवार गिदरा को, क्लास रे सानाम को मानाव मे!", phonetic: "Jowar gidra ko, class re sanam ko manaw me!" },
    mun: { native: "ᱡᱚᱦᱟᱨ ᱜᱤᱫᱽᱨᱟᱹ ᱠᱚ, ᱠᱞᱟᱥ ᱨᱮ ᱥᱟᱱᱟᱢ ᱠᱚ ᱡᱚᱦᱟᱨ!", devanagari: "जोहार गिदरा को, क्लास रे सानाम को जोहार!", phonetic: "Johar gidra ko, class re sanam ko johar!" },
  },
  {
    keywords: ["बैठ", "बैठो", "बैठ जाएं", "stand", "sit"],
    hindi: "सब बच्चे शांत होकर बैठ जाएं।",
    san: { native: "ᱥᱟᱱᱟᱢ ᱜᱤᱫᱽᱨᱟᱹ ᱛᱷᱤᱨ ᱠᱟᱛᱮ ᱫᱩᱲᱩᱵ ᱯᱮ।", devanagari: "सानाम गिदरा थिर काते दुड़ुप पे।", phonetic: "Sanam gidra thir kate durup pe." },
    ho: { native: "ᱥᱟᱱᱟᱢ ᱜᱤᱫᱽᱨᱟᱹ ᱫᱩᱵᱽ ᱯᱮ।", devanagari: "सानाम गिदरा दुब पे।", phonetic: "Sanam gidra dub pe." },
    mun: { native: "ᱥᱟᱱᱟᱢ ᱜᱤᱫᱽᱨᱟᱹ ᱫᱩᱲᱩᱵ ᱯᱮ।", devanagari: "सानाम गिदरा दुड़ुप पे।", phonetic: "Sanam gidra durup pe." },
  },
  {
    keywords: ["किताब", "कॉपी", "पन्ना", "खोलो", "book"],
    hindi: "सब बच्चे अपनी किताब का पाठ खोलें।",
    san: { native: "ᱥᱟᱱᱟᱢ ᱜᱤᱫᱽᱨᱟᱹ ᱟᱯᱱᱟᱨᱟᱜ ᱯᱩᱛᱷᱤ ᱡᱷᱤᱡ ᱯᱮ।", devanagari: "सानाम गिदरा अपनाराग पुथी झिज पे।", phonetic: "Sanam gidra apnarag puthi jhij pe." },
    ho: { native: "ᱥᱟᱱᱟᱢ ᱜᱤᱫᱽᱨᱟᱹ ᱯᱩᱛᱷᱤ ᱠᱷᱳᱞ ᱯᱮ।", devanagari: "सानाम गिदरा पुथी खोल पे।", phonetic: "Sanam gidra puthi khol pe." },
    mun: { native: "ᱥᱟᱱᱟᱢ ᱜᱤᱫᱽᱨᱟᱹ ᱯᱩᱛᱷᱤ ᱡᱷᱤᱡ ᱯᱮ।", devanagari: "सानाम गिदरा पुथी झिज पे।", phonetic: "Sanam gidra puthi jhij pe." },
  },
  {
    keywords: ["गिनती", "1 से 10", "संख्या", "number"],
    hindi: "आज हम 1 से 10 तक गिनती सीखेंगे।",
    san: { native: "ᱛᱮᱦᱮᱧ ᱟᱵᱚ ᱑ ᱠᱷᱚᱱ ᱑᱐ ᱫᱷᱟᱹᱵᱤᱡ ᱞᱮᱠᱷᱟ ᱵᱚᱱ ᱪᱮᱫᱚᱜ-ᱟ।", devanagari: "तेहेंज आबो १ खोन १० धाबिज लेखा बोन चेदोग-आ।", phonetic: "Tehenj abo 1 khon 10 dhabij lekha bon chedog-a." },
    ho: { native: "ᱛᱤᱥᱤᱝ ᱟᱵᱩ ᱑ ᱮᱛᱮ ᱑᱐ ᱞᱮᱠᱷᱟ ᱤᱛᱩ-ᱱᱟ।", devanagari: "तिसिंग आबु १ एते १० लेखा इतु-ना।", phonetic: "Tising abu 1 ete 10 lekha itu-na." },
    mun: { native: "ᱛᱤᱧ ᱟᱵᱩ ᱑ ᱠᱷᱚᱱ ᱑᱐ ᱞᱮᱠᱷᱟ ᱥᱮᱬᱟ ᱮᱭᱟ।", devanagari: "तिंय आबु १ खोन १० लेखा सेणा एया।", phonetic: "Tiny abu 1 khon 10 lekha sena eya." },
  },
  {
    keywords: ["समझ", "आया", "समझ आया", "clear"],
    hindi: "क्या सब बच्चों को समझ में आया?",
    san: { native: "ᱪᱮᱫ ᱥᱟᱱᱟᱢ ᱜᱤᱫᱽᱨᱟᱹ ᱠᱚ ᱵᱩᱡᱷᱟᱹᱣ ᱮᱱᱟ?", devanagari: "चेद सानाम गिदरा को बुझाव एना?", phonetic: "Ched sanam gidra ko bujhaw ena?" },
    ho: { native: "ᱪᱮᱫ ᱥᱟᱱᱟᱢ ᱜᱤᱫᱽᱨᱟᱹ ᱤᱛᱩ ᱮᱱᱟ?", devanagari: "चेद सानाम गिदरा इतु एना?", phonetic: "Ched sanam gidra itu ena?" },
    mun: { native: "ᱪᱮᱫ ᱥᱟᱱᱟᱢ ᱜᱤᱫᱽᱨᱟᱹ ᱵᱩᱡᱷᱟᱹᱣ ᱮᱱᱟ?", devanagari: "चेद सानाम गिदरा बुझाव एना?", phonetic: "Ched sanam gidra bujhaw ena?" },
  },
  {
    keywords: ["शाबाश", "बढ़िया", "बहुत अच्छा", "good", "great"],
    hindi: "बहुत बढ़िया बच्चों! शाबाश।",
    san: { native: "ᱟᱹᱰᱤ ᱱᱟᱯᱟᱭ ᱜᱤᱫᱽᱨᱟᱹ ᱠᱚ! ᱥᱟᱵᱟᱥ।", devanagari: "आडी नापाय गिदरा को! साबास।", phonetic: "Adi napay gidra ko! Sabas." },
    ho: { native: "ᱟᱹᱰᱤ ᱵᱩᱜᱤ ᱜᱤᱫᱽᱨᱟᱹ ᱠᱳ! ᱥᱟᱵᱟᱥ।", devanagari: "आडी बुगी गिदरा को! साबास।", phonetic: "Adi bugi gidra ko! Sabas." },
    mun: { native: "ᱟᱹᱰᱤ ᱵᱮᱥ ᱜᱤᱫᱽᱨᱟᱹ ᱠᱚ! ᱥᱟᱵᱟᱥ।", devanagari: "आडी बेस गिदरा को! साबास।", phonetic: "Adi bes gidra ko! Sabas." },
  },
  {
    keywords: ["हाँ समझ", "समझ आ गया", "bujhaw", "itu", "yes understand"],
    hindi: "हाँ, मुझे समझ आ गया!",
    san: { native: "ᱦᱮᱸ, ᱵᱩᱡᱷᱟᱹᱣ ᱮᱱᱟ!", devanagari: "हें, बुझाव एना!", phonetic: "Hen, bujhaw ena!" },
    ho: { native: "ᱦᱮᱸ, ᱤᱛᱩ ᱮᱱᱟ!", devanagari: "हें, इतु एना!", phonetic: "Hen, itu ena!" },
    mun: { native: "ᱦᱮᱸ, ᱵᱩᱡᱷᱟᱹᱣ ᱮᱱᱟ!", devanagari: "हें, बुझाव एना!", phonetic: "Hen, bujhaw ena!" },
  },
  {
    keywords: ["फिर से", "दोबारा", "repeat", "once more"],
    hindi: "कृपया एक बार फिर से बताएं।",
    san: { native: "ᱟᱨᱦᱚᱸ ᱢᱤᱫ ᱫᱷᱟᱣ ᱢᱮᱱ ᱢᱮ।", devanagari: "आरहों मिद धाव मेन मे।", phonetic: "Arhon mid dhaw men me." },
    ho: { native: "ᱟᱨᱦᱚᱸ ᱢᱤᱫ ᱫᱷᱟᱣ ᱢᱮᱱ ᱢᱮ।", devanagari: "आरहों मिद धाव मेन मे।", phonetic: "Arhon mid dhaw men me." },
    mun: { native: "ᱟᱨᱦᱚᱸ ᱢᱮᱱ ᱢᱮ।", devanagari: "आरहों मेन मे।", phonetic: "Arhon men me." },
  },
  {
    keywords: ["सवाल", "प्रश्न", "doubt", "question", "ᱠᱩᱠᱞᱤ"],
    hindi: "मेरा एक सवाल है।",
    san: { native: "ᱤᱧᱟᱜ ᱢᱤᱫ ᱠᱩᱠᱞᱤ ᱢᱮᱱᱟᱜ-ᱟ।", devanagari: "इञाग मिद कुकली मेनाग-आ।", phonetic: "Inyag mid kukli menag-a." },
    ho: { native: "ᱟᱹᱧᱟᱜ ᱢᱤᱫ ᱠᱩᱞᱤ ᱢᱮᱱᱟᱜ-ᱟ।", devanagari: "अञाग मिद कुली मेनाग-आ।", phonetic: "Anyag mid kuli menag-a." },
    mun: { native: "ᱟᱹᱧᱟᱜ ᱢᱤᱫ ᱠᱩᱠᱞᱤ ᱢᱮᱱᱟᱜ-ᱟ।", devanagari: "अञाग मिद कुकली मेनाग-आ।", phonetic: "Anyag mid kukli menag-a." },
  },
  {
    keywords: ["उपस्थित", "हाजिर", "present", "yes sir", "yes mam", "yes madam"],
    hindi: "जी गुरुजी, मैं उपस्थित हूँ।",
    san: { native: "ᱦᱮᱸ ᱢᱟᱪᱮᱛ, ᱤᱧ ᱢᱮᱱᱟᱹᱧᱟ!", devanagari: "हें माचेत, इञ मेनाञा!", phonetic: "Hen machet, iny menanya!" },
    ho: { native: "ᱦᱮᱸ ᱢᱟᱪᱮᱛ, ᱟᱹᱧ ᱢᱮᱱᱟᱹᱧᱟ!", devanagari: "हें माचेत, अञ मेनाञा!", phonetic: "Hen machet, any menanya!" },
    mun: { native: "ᱦᱮᱸ ᱢᱟᱪᱮᱛ, ᱟᱹᱧ ᱢᱮᱱᱟᱹᱧᱟ!", devanagari: "हें माचेत, अञ मेनाञा!", phonetic: "Hen machet, any menanya!" },
  },
  {
    keywords: ["लिख", "लिख लिया", "done", "finished", "copied"],
    hindi: "हाँ गुरुजी, मैंने लिख लिया है।",
    san: { native: "ᱦᱮᱸ, ᱤᱧ ᱚᱞ ᱠᱮᱫᱟᱹᱧ।", devanagari: "हें, इञ ओल केदाइए।", phonetic: "Hen, iny ol kedainy." },
    ho: { native: "ᱦᱮᱸ, ᱟᱹᱧ ᱚᱞ ᱠᱮᱫᱟᱹᱧ।", devanagari: "हें, अञ ओल केदाइए।", phonetic: "Hen, any ol kedainy." },
    mun: { native: "ᱦᱮᱸ, ᱟᱹᱧ ᱚᱞ ᱠᱮᱫᱟᱹᱧ।", devanagari: "हें, अञ ओल केदाइए।", phonetic: "Hen, any ol kedainy." },
  },
  {
    keywords: ["धन्यवाद", "शुक्रिया", "thank you", "thanks"],
    hindi: "धन्यवाद शिक्षक जी!",
    san: { native: "ᱥᱟᱨᱦᱟᱣ ᱢᱟᱪᱮᱛ!", devanagari: "सारहाव माचेत!", phonetic: "Sarhaw machet!" },
    ho: { native: "ᱥᱟᱨᱦᱟᱣ ᱢᱟᱪᱮᱛ!", devanagari: "सारहाव माचेत!", phonetic: "Sarhaw machet!" },
    mun: { native: "ᱥᱟᱨᱦᱟᱣ ᱢᱟᱪᱮᱛ!", devanagari: "सारहाव माचेत!", phonetic: "Sarhaw machet!" },
  },
];

// -----------------------------------------------------------------------------------
// Dynamic Multi-Word & Tokenizer Vernacular Translation Engine
// -----------------------------------------------------------------------------------
export function translateOfflinePhrase(
  text: string,
  from: "hi" | "tribal",
  targetLang: TribalLanguage = "san"
): { translatedText: string; devanagari: string; phonetic: string; source: string } {
  const cleanText = (text || "").trim();
  const lower = cleanText.toLowerCase();
  const tokens = cleanText.split(/[\s,।!?]+/).filter(Boolean);

  // 1. Direct Pattern Match (only for direct phrases or short prompt triggers)
  if (tokens.length <= 4 || CLASSROOM_DIALOGUE_PATTERNS.some((p) => p.hindi === cleanText)) {
    for (const pat of CLASSROOM_DIALOGUE_PATTERNS) {
      if (from === "hi") {
        const match =
          cleanText === pat.hindi ||
          pat.keywords.some((k) => lower === k.toLowerCase() || (lower.includes(k.toLowerCase()) && lower.length <= k.length + 6));
        if (match) {
          const tr = pat[targetLang] || pat.san;
          return {
            translatedText: tr.native,
            devanagari: tr.devanagari,
            phonetic: tr.phonetic,
            source: "pattern_engine",
          };
        }
      } else {
        const match =
          pat.keywords.some((k) => lower === k.toLowerCase()) ||
          cleanText === pat.san.native ||
          cleanText === pat.ho.native ||
          cleanText === pat.mun.native;
        if (match) {
          return {
            translatedText: pat.hindi,
            devanagari: pat.hindi,
            phonetic: pat.hindi,
            source: "pattern_engine",
          };
        }
      }
    }
  }

  // 2. Exact Knowledge Base Match
  for (const item of TRIBAL_VOCABULARY) {
    const hindiVariants = item.hindi.split("/").map((s) => s.trim().toLowerCase());
    if (from === "hi") {
      if (hindiVariants.includes(lower) || cleanText === item.hindi) {
        const tr = item.translations[targetLang] || item.translations.san;
        return {
          translatedText: tr.native,
          devanagari: tr.devanagari,
          phonetic: tr.phonetic,
          source: "vocab_exact",
        };
      }
    } else {
      const tr = item.translations[targetLang] || item.translations.san;
      if (
        tr.native.toLowerCase() === lower ||
        tr.devanagari.toLowerCase() === lower ||
        tr.phonetic.toLowerCase() === lower ||
        cleanText === tr.native
      ) {
        return {
          translatedText: item.hindi.split("/")[0].trim(),
          devanagari: item.hindi.split("/")[0].trim(),
          phonetic: item.hindi.split("/")[0].trim(),
          source: "vocab_exact",
        };
      }
    }
  }

  // 3. Multi-Token Sentence-Level Vernacular Translator
  // Splits arbitrary sentence into words, finds best vernacular substitutes, and applies Ol Chiki script
  if (from === "hi") {
    const translatedNativeTokens: string[] = [];
    const translatedDevTokens: string[] = [];
    const translatedPhoneticTokens: string[] = [];

    for (const token of tokens) {
      if (!token) continue;
      const cleanToken = token.trim();
      const tokenLower = cleanToken.toLowerCase();

      // Find token in vocabulary with priority to exact match then variant match
      const matched =
        TRIBAL_VOCABULARY.find((v) => {
          const variants = v.hindi.split("/").map((s) => s.trim().toLowerCase());
          return variants.includes(tokenLower);
        }) ||
        TRIBAL_VOCABULARY.find((v) => {
          const variants = v.hindi.split("/").map((s) => s.trim());
          return variants.some((s) => s.includes(cleanToken) || cleanToken.includes(s));
        });

      if (matched) {
        const tr = matched.translations[targetLang] || matched.translations.san;
        translatedNativeTokens.push(tr.native);
        translatedDevTokens.push(tr.devanagari.split("/")[0].trim());
        translatedPhoneticTokens.push(tr.phonetic.split("/")[0].trim().split(" ")[0]);
      } else {
        // Dynamic transliteration into Ol Chiki if target is Santhali
        if (targetLang === "san") {
          translatedNativeTokens.push(transliterateToOlChiki(cleanToken));
        } else {
          translatedNativeTokens.push(cleanToken);
        }
        translatedDevTokens.push(cleanToken);
        translatedPhoneticTokens.push(cleanToken);
      }
    }

    if (translatedNativeTokens.length > 0) {
      return {
        translatedText: translatedNativeTokens.join(" "),
        devanagari: translatedDevTokens.join(" "),
        phonetic: translatedPhoneticTokens.join(" "),
        source: "vernacular_tokenizer",
      };
    }
  } else {
    // Tribal to Hindi Tokenizer
    const tokens = cleanText.split(/[\s,।!?]+/);
    const hindiTokens: string[] = [];

    for (const token of tokens) {
      if (!token) continue;
      const cleanToken = token.trim();
      const matched = TRIBAL_VOCABULARY.find(
        (v) =>
          v.translations[targetLang].native.includes(cleanToken) ||
          v.translations[targetLang].devanagari.includes(cleanToken) ||
          v.translations[targetLang].phonetic.toLowerCase().includes(cleanToken.toLowerCase())
      );

      if (matched) {
        hindiTokens.push(matched.hindi);
      } else {
        hindiTokens.push(cleanToken);
      }
    }

    if (hindiTokens.length > 0) {
      return {
        translatedText: hindiTokens.join(" "),
        devanagari: hindiTokens.join(" "),
        phonetic: hindiTokens.join(" "),
        source: "vernacular_tokenizer",
      };
    }
  }

  // 4. Default Clean Transliterated Output
  if (from === "hi") {
    const olChikiFallback = targetLang === "san" ? transliterateToOlChiki(text) : text;
    return {
      translatedText: olChikiFallback,
      devanagari: text,
      phonetic: text,
      source: "transliteration_fallback",
    };
  } else {
    return {
      translatedText: text,
      devanagari: text,
      phonetic: text,
      source: "transliteration_fallback",
    };
  }
}

export function getVocabByCategory(category: string, lang: TribalLanguage = "san") {
  return TRIBAL_VOCABULARY.filter((v) => v.category === category).map((v) => ({
    id: v.id,
    hindi: v.hindi,
    english: v.english,
    icon: v.icon,
    category: v.category,
    translation: v.translations[lang] || v.translations.san,
  }));
}
