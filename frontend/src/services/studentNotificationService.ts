export interface StudentNotification {
  id: string;
  type: "live_class" | "worksheet" | "quiz" | "feedback";
  title: string;
  description: string;
  timestamp: string;
  isRead: boolean;
  icon: string;
  badge: string;
  ctaText: string;
  ctaLink: string;
  audioNote?: string;
  grade?: string;
}

const INITIAL_NOTIFICATIONS: StudentNotification[] = [
  {
    id: "notif_live_1",
    type: "live_class",
    title: "नई लाइव कक्षा शेड्यूल्ड हुई है 🔴",
    description: "शिक्षक माधवी मुर्मू जी द्वारा 'गिनती 1 से 10 और संख्या बोध' पर लाइव कक्षा शुरू हो चुकी है।",
    timestamp: "2 मिनट पहले",
    isRead: false,
    icon: "🎙️",
    badge: "🔴 लाइव कक्षा अलर्ट",
    ctaText: "🎙️ लाइव कक्षा में जुड़ें",
    ctaLink: "/live-class",
    grade: "कक्षा 1",
  },
  {
    id: "notif_worksheet_1",
    type: "worksheet",
    title: "शिक्षक ने नया अभ्यास पत्रक दिया है 📝",
    description: "कक्षा 1 के लिए नया द्विभाषी मुंडारी व हिंदी अभ्यास पत्रक (गिनती व चित्र मिलान) हल करने हेतु उपलब्ध है।",
    timestamp: "15 मिनट पहले",
    isRead: false,
    icon: "📝",
    badge: "📝 वर्कशीट अलर्ट",
    ctaText: "✏️ अभ्यास पत्रक हल करें",
    ctaLink: "/worksheets",
    grade: "कक्षा 1",
  },
  {
    id: "notif_quiz_1",
    type: "quiz",
    title: "नया क्विज़/खेल उपलब्ध है 🎮",
    description: "संख्या बोध और रंग पहचान पर नया सचित्र ऑडियो क्विज़ तैयार है! प्रश्नों का उत्तर दें और सितारे जीतें।",
    timestamp: "1 घंटा पहले",
    isRead: false,
    icon: "🎮",
    badge: "🎮 क्विज़ अलर्ट",
    ctaText: "🧠 क्विज़ खेलें",
    ctaLink: "/quiz",
    grade: "कक्षा 1",
  },
  {
    id: "notif_feedback_1",
    type: "feedback",
    title: "आपकी वर्कशीट जाँच ली गई है! ⭐ 5/5 मिले 🌟",
    description: "शिक्षक ने आपके द्वारा सबमिट किया गया चित्र और उत्तर जाँचा और 5 में से 5 सितारे दिए! शाबाश!",
    audioNote: "शाबाश सिदो! तुमने मुंडारी और हिंदी में सभी प्रश्नों के बहुत सुंदर और सही उत्तर लिखे हैं। ऐसे ही मन लगाकर पढ़ाई करो!",
    timestamp: "30 मिनट पहले",
    isRead: false,
    icon: "🌟",
    badge: "🌟 शिक्षक समीक्षा अलर्ट",
    ctaText: "⭐ स्कोरकार्ड व सितारे देखें",
    ctaLink: "/worksheets",
    grade: "कक्षा 1",
  },
];

const STORAGE_KEY = "student_notifications";

export const getStudentNotifications = (): StudentNotification[] => {
  try {
    const saved = localStorage.getItem(STORAGE_KEY);
    if (saved) return JSON.parse(saved);
  } catch (e) {
    console.error("Error reading student notifications:", e);
  }
  return INITIAL_NOTIFICATIONS;
};

export const saveStudentNotifications = (notifs: StudentNotification[]): void => {
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(notifs));
    window.dispatchEvent(new Event("student_notifications_updated"));
  } catch (e) {
    console.error("Error saving student notifications:", e);
  }
};

export const markNotificationAsRead = (id: string): void => {
  const notifs = getStudentNotifications();
  const updated = notifs.map((n) => (n.id === id ? { ...n, isRead: true } : n));
  saveStudentNotifications(updated);
};

export const markAllNotificationsAsRead = (): void => {
  const notifs = getStudentNotifications();
  const updated = notifs.map((n) => ({ ...n, isRead: true }));
  saveStudentNotifications(updated);
};

export const getUnreadNotificationCount = (): number => {
  const notifs = getStudentNotifications();
  return notifs.filter((n) => !n.isRead).length;
};
