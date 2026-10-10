# 🎓 वाणीसेतु (VaniSetu) - बहुभाषी जनजातीय शिक्षा मंच
### *Bilingual Vernacular Pedagogy Platform for Tribal Education (Jharkhand)*

वाणीसेतु एक अभिनव द्विभाषी शैक्षणिक मंच है जिसे प्राथमिक कक्षाओं (कक्षा 1 से 5) के जनजातीय बच्चों और शिक्षकों के बीच भाषाई खाई को पाटने के लिए विकसित किया गया है। यह मंच **निपुण भारत (NIPUN Bharat)** एवं **FLN (मूलभूत साक्षरता व संख्या ज्ञान)** के मानकों पर आधारित है।

---

## 🌟 प्रमुख विशेषताएं (Key Features)

### 👨‍🏫 शिक्षक पोर्टल (Teacher Portal)
- 🎙️ **लाइव द्विभाषी कक्षा (Live Class):** वास्तविक समय में हिंदी से स्थानीय भाषा में अनुवाद व ऑडियो उच्चारण।
- 📝 **कार्यपत्रक निर्माण (Worksheet Generator):** निपुण भारत दक्षताओं के अनुसार बहुविकल्पीय व चित्र आधारित अभ्यास पत्रक।
- 🎴 **सचित्र शब्द कार्ड (Flashcards):** चित्र, देवनागरी, व ओल चिकी/वारंग चिती लिपि में सचित्र शब्दकोश।
- 📖 **पाठ योजनाकार (Lesson Planner):** 4-चरणीय शिक्षण योजना (Warmup, Teaching, Activity, Assessment)।
- 📊 **प्रगति ट्रैकर (Progress Tracker):** छात्रवार FLN सीखने के स्तर और अंक।
- 📶 **ऑफलाइन सिंक (Offline Mode):** दूरस्थ क्षेत्रों के लिए ऑफ़लाइन डेटा सिंकिंग।

### 🎒 विद्यार्थी पोर्टल (Student Portal)
- 🏠 **डैशबोर्ड (Dashboard):** 9 प्रमुख टूल्स के लिए क्विक एक्सेस ग्रिड व विषयवार प्रगति।
- 🎙️ **लाइव कक्षा (Live Class):** शिक्षक की आवाज़ सुनना और मातृभाषा में ऑडियो प्रतिक्रिया देना।
- 📝 **अभ्यास पत्रक (Worksheets):** डिजिटल स्लेट ड्रॉइंग कैनवास, फोटो अपलोड व वॉयस नोट के साथ उत्तर जमा करना।
- 🎯 **क्विज़ व मूल्यांकन (Interactive Quiz):** सितारे (Stars ⭐) व ऑडियो प्रश्नों के साथ मनोरंजक क्विज़।
- 🎴 **सचित्र शब्द कार्ड (Word Cards):** चित्र देखकर शब्द सीखना व नेटिव उच्चारण सुनना।
- 🎨 **चित्रकला व रंग भरो (Drawing Canvas):** बच्चों के लिए डिजिटल कैनवास और रंग भरने के टूल्स।
- 🎧 **कहानियाँ (Folk Stories):** संथाली, हो व मुंडारी की लोककथाएँ और बालगीत।
- 👤 **मेरी प्रोफ़ाइल (Profile):** विद्यार्थी पहचान पत्र, स्कूल विवरण, कुल सितारे और संपादन सुविधा।
- ⚙️ **सेटिंग्स (Settings):** पसंदीदा स्थानीय भाषा और आवाज़ की गति का चयन।

---

## 🗣️ समर्थित भाषाएं व लिपियां (Supported Languages)

| भाषा (Language) | लिपि (Script) | क्षेत्र (Region) |
|---|---|---|
| **संथाली (Santali)** | ओल चिकी (Ol Chiki) / देवनागरी | संताल परगना, झारखंड |
| **हो (Ho)** | वारंग चिती (Warang Chiti) / देवनागरी | पश्चिमी सिंहभूम (कोल्हान) |
| **मुंडारी (Mundari)** | देवनागरी / मुंडारी लिपि | खूंटी, रांची पठार |

---

## 🛠️ तकनीकी संरचना (Tech Stack)

- **Frontend:** React 18, TypeScript, Vite, Tailwind CSS, Lucide Icons, Canvas API, Web Speech API
- **Backend:** Node.js, Express.js, TypeScript, JWT Authentication, bcryptjs
- **Design System:** Custom Royal Blue to Violet Gradient (`#2563EB ➔ #7C3AED`), Accessible high-contrast typography, Child-friendly responsive cards

---

## 🚀 इंस्टॉलेशन व सेटअप (Quick Start Guide)

### 1. पूर्वापेक्षाएं (Prerequisites)
- [Node.js](https://nodejs.org/) (संस्करण v18 या उच्चतर)
- `npm` पैकेज मैनेजर

### 2. क्लोन करें (Clone Repository)
```bash
git clone https://github.com/your-username/vernacular-edu.git
cd vernacular-edu
```

### 3. बैकएंड सेटअप (Backend Setup)
```bash
cd backend
npm install
cp .env.example .env
npm run build
npm start
```
*बैकएंड `http://localhost:4000` पर प्रारंभ होगा।*

### 4. फ्रंटएंड सेटअप (Frontend Setup)
```bash
cd ../frontend
npm install
npm run dev
```
*ब्राउज़र में `http://localhost:5173` खोलें।*

---

## 🔐 डिफ़ॉल्ट लॉगिन विवरण (Test Credentials)

| भूमिका (Role) | ईमेल (Email) | पासवर्ड (Password) |
|---|---|---|
| 👨‍🏫 **शिक्षक (Teacher)** | `teacher@test.com` | `123456` |
| 🎒 **विद्यार्थी (Student)** | `student@test.com` | `123456` |

---

## 📜 लाइसेंस (License)
यह परियोजना शैक्षणिक एवं सामाजिक उपयोग हेतु विकसित की गई है।
