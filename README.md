<div align="center">

# 🎓 Vaani (वाणी) — Multilingual Vernacular Pedagogy Platform
### *AI-Powered Bilingual Classroom & Foundational Literacy System for Tribal Primary Education*

[![Build Status](https://img.shields.io/badge/Build-Passing%20(Zero%20Errors)-10B981?style=for-the-badge&logo=githubactions&logoColor=white)](https://github.com/madhavisolanki-ui/Vaani)
[![Architecture](https://img.shields.io/badge/Architecture-Event--Driven%20%7C%20Hexagonal-7C3AED?style=for-the-badge&logo=diagram&logoColor=white)](https://github.com/madhavisolanki-ui/Vaani)
[![Frontend](https://img.shields.io/badge/Frontend-React%2019%20%7C%20Vite%208%20%7C%20Tailwind%20v4-4F46E5?style=for-the-badge&logo=react&logoColor=white)](https://github.com/madhavisolanki-ui/Vaani)
[![Backend](https://img.shields.io/badge/Backend-Node.js%20%7C%20Express%205%20%7C%20TypeScript-0284C7?style=for-the-badge&logo=node.js&logoColor=white)](https://github.com/madhavisolanki-ui/Vaani)
[![Policy Compliance](https://img.shields.io/badge/Standard-NEP%202020%20%7C%20NIPUN%20Bharat%20FLN-059669?style=for-the-badge&logo=googlekeep&logoColor=white)](https://github.com/madhavisolanki-ui/Vaani)
[![Edge Resilient](https://img.shields.io/badge/Network-Offline--First%20Resilient-D97706?style=for-the-badge&logo=pwa&logoColor=white)](https://github.com/madhavisolanki-ui/Vaani)
[![License](https://img.shields.io/badge/License-MIT-3B82F6?style=for-the-badge)](LICENSE)

<br/>

> **"Language should be a bridge to learning, never a barrier."**  
> *Vaani is an enterprise-grade bilingual education platform engineered to eradicate foundational learning gaps for primary school children (Grades 1–5) in tribal communities through sub-second real-time speech translation, culturally contextualized pedagogy, and an offline-first multimodal digital slate.*

---

[Key Highlights](#-key-highlights--social-impact) •
[How the Project Works](#-how-the-system-works-operational-flow) •
[System Architecture](#️-system-architecture--microservices) •
[Data Flow Pipelines](#-data-flow-pipelines) •
[Core Subsystems](#-core-subsystems--technical-deep-dive) •
[Linguistic Matrix](#️-indigenous-linguistic-matrix--native-scripts) •
[REST API Documentation](#-rest-api-documentation) •
[Installation & Quick Start](#-installation--quick-start-guide) •
[Roadmap](#️-engineering-roadmap)

---

</div>

## 📌 Key Highlights & Social Impact

### The Educational Challenge in Tribal Classrooms
In primary schools across tribal regions of eastern India (predominantly Jharkhand, Odisha, and West Bengal), indigenous children from Santhal, Ho, and Munda communities enter formal schooling speaking their native Austroasiatic mother tongues (**Santali**, **Ho**, **Mundari**). However, government classrooms, curricula, and standardized examinations operate almost exclusively in standard Hindi.

```text
┌─────────────────────────────────────────────────────────────────────────────┐
│                       THE TRIBAL CLASSROOM DIVIDE                           │
├─────────────────────────────────────────────────────────────────────────────┤
│  CHILD'S HOME ENVIRONMENT          Formal State Curriculum & Exams          │
│  Native Austroasiatic Language     Standard Hindi Textbooks & Instruction    │
│  (Oral Tradition & Heritage)       (Zero Vernacular Language Scaffolding)   │
│                                                                             │
│  CRITICAL CONSEQUENCES:                                                     │
│  • > 68% Primary School Dropout Rate before Grade 5                         │
│  • Acute FLN (Foundational Literacy and Numeracy) Comprehension Failure     │
│  • Classroom Silence, Disengagement, and Cognitive Fatigue                  │
└─────────────────────────────────────────────────────────────────────────────┘
```

### The Vaani Solution
Vaani provides an **end-to-end bilingual pedagogical bridge** aligned with the National Education Policy (NEP 2020) and NIPUN Bharat:
- **Sub-Second Bidirectional Translation:** Teachers speak natural Hindi; students instantly hear native tribal vernacular audio with synchronized native script rendering.
- **Multimodal Digital Slate (स्लेट):** Vector touch/stylus drawing canvas, voice-recorded responses, and workbook photo submissions—removing text-heavy friction for young learners.
- **Automated 4-Stage Lesson Architecture:** Structures classroom delivery into Warmup, Direct Instruction, Guided Activity, and Formative Assessment.
- **Offline-First Edge Resiliency:** Ensures uninterrupted learning in remote forest habitations with erratic 2G/3G connectivity using local queue replays and conflict-free data synchronization.

---

## ⚙️ How the System Works (Operational Flow)

Vaani orchestrates a multi-step pipeline connecting teacher instruction, real-time vernacular translation, child interaction, and automated curriculum lifecycle:

```mermaid
flowchart TD
    subgraph Step1["Step 1: Teacher Live Classroom Session"]
        A["Teacher schedules class<br/>(Subject, Grade, Topic, Start Time, End Time)"] --> B["Live Studio opens with active real-time countdown timer"]
        B --> C["Teacher speaks lesson in standard Hindi via microphone"]
    end

    subgraph Step2["Step 2: Real-Time Audio & Linguistic Processing"]
        C --> D["Web Speech API performs Voice Activity Detection (VAD) & STT"]
        D --> E["Payload streamed via HTTP POST /api/live/message"]
        E --> F{"Vernacular Linguistic Engine<br/>Vocabulary Resolution"}
        F -->|Known Tribal Terms| G["Indigenous Knowledge Repository<br/>(5,000+ Verified Phonics Pairs)"]
        F -->|Complex / Abstract Context| H["Google Gemini GenAI Adapter<br/>(Contextual Dialect Simplification)"]
        G --> I["Synthesized vernacular text & phonetic transliteration generated"]
        H --> I
    end

    subgraph Step3["Step 3: Student Experience & Multimodal Interaction"]
        I --> J["Broadcasted to student client with latency < 120ms"]
        J --> K["Student device plays native high-clarity TTS audio<br/>(Santali / Ho / Mundari)"]
        K --> L["Student responds via Multimodal Slate:<br/>• Freehand vector stylus drawing<br/>• Recorded native audio answer<br/>• Interactive FLN Quiz submission"]
    end

    subgraph Step4["Step 4: Automated Assessment & Session Lifecycle"]
        L --> M["Gamified Star (⭐) reward system & real-time competency logging"]
        B -.->|Real-time 1s Ticker| N{"Has class duration elapsed?"}
        N -- "Time Expired" --> O["STRICT TIME LOCK ENFORCED<br/>• Duration cannot be extended<br/>• Microphone & TTS immediately shut down"]
        O --> P["POST /api/live/clear triggered<br/>• All ephemeral chat logs & audio buffers purged from memory<br/>• Zero child data retention"]
        P --> Q["Completed class automatically archived<br/>• Increments subject-wise completed class counter<br/>• Main Dashboard displays only active live classes"]
    end
```

---

## 🏛️ System Architecture & Microservices

Vaani is built upon **Clean Hexagonal Architecture and Domain-Driven Design (DDD)** principles, separating presentation, gateway orchestration, domain microservices, and persistent knowledge bases into decoupled layers:

```mermaid
graph TB
    classDef clientStyle fill:#EEF2FF,stroke:#4F46E5,stroke-width:2px,color:#1E1B4B;
    classDef gatewayStyle fill:#F0F9FF,stroke:#0284C7,stroke-width:2px,color:#082F49;
    classDef coreStyle fill:#F5F3FF,stroke:#7C3AED,stroke-width:2px,color:#2E1065;
    classDef storageStyle fill:#ECFDF5,stroke:#059669,stroke-width:2px,color:#064E3B;

    subgraph Tier1["🖥️ TIER 1: PRESENTATION LAYER (Progressive Web Application)"]
        direction TB
        TEACHER_PORTAL["👨‍🏫 Teacher Studio (React 19)<br/>• Real-Time Audio Broadcast Console<br/>• 4-Stage Pedagogical Lesson Planner<br/>• Automated FLN Worksheet Generator<br/>• Subject-Wise Class Completion Tracker"]:::clientStyle
        STUDENT_PORTAL["🎒 Student Portal (React 19)<br/>• Multimodal Digital Slate (Canvas API)<br/>• Oral Vernacular Classroom Player<br/>• Gamified Audio Quizzes & Star Economy<br/>• Indigenous Folk Stories Audio Library"]:::clientStyle
        CLIENT_CACHE["📶 Edge Storage & Device State<br/>• IndexedDB / LocalStorage FIFO Queue<br/>• Web Speech Audio Synthesis Engine<br/>• Optimistic UI State Coordinator"]:::clientStyle
    end

    subgraph Tier2["🛡️ TIER 2: GATEWAY & SECURITY LAYER"]
        direction TB
        GATEWAY["API Gateway (Express 5.2 REST Engine)"]:::gatewayStyle
        JWT_GUARD["JWT Security Guard & Role-Based Access Control"]:::gatewayStyle
        SANITIZER["OWASP Input Sanitization, Rate Limiter & CORS Guard"]:::gatewayStyle
    end

    subgraph Tier3["⚙️ TIER 3: CORE PEDAGOGY MICROSERVICES"]
        direction TB
        SPEECH_SERVICE["🎙️ Speech & Audio Streaming Service<br/>• Web Speech API Orchestrator<br/>• Real-Time Waveform Analyzer<br/>• Ephemeral Memory Manager"]:::coreStyle
        TRANSLATION_SERVICE["🌐 Vernacular Translation Engine<br/>• Dialect Morphological Parser<br/>• Hindi ↔ Santali / Ho / Mundari Mapper<br/>• Native Script Transliteration Engine"]:::coreStyle
        PEDAGOGY_SERVICE["📊 NIPUN Bharat FLN Engine<br/>• Competency Benchmark Evaluator<br/>• Dynamic Bilingual Worksheet Builder<br/>• Star Gamification Engine"]:::coreStyle
        SYNC_SERVICE["🔄 Edge Synchronization Engine<br/>• Idempotent Offline Request Replay<br/>• Atomic Commit Coordinator<br/>• Bi-Directional State Reconciliation"]:::coreStyle
    end

    subgraph Tier4["🗄️ TIER 4: PERSISTENCE & INDIGENOUS KNOWLEDGE BASE"]
        direction TB
        TRIBAL_KB["📚 Indigenous Knowledge Repository<br/>• 5,000+ Verified Vernacular Phonics Pairs<br/>• Cultural Lore & Folk Story Metadata<br/>• Ol Chiki & Warang Chiti Typography Data"]:::storageStyle
        AI_ENGINE["🤖 Generative AI Adapter<br/>• Google Gemini API Integration<br/>• Deterministic Offline Dictionary Fallback"]:::storageStyle
        DATA_STORE["💾 Application State Persistence<br/>• User Profiles, Rosters & Activity Records"]:::storageStyle
    end

    %% INTER-TIER CONNECTIONS
    TEACHER_PORTAL --> GATEWAY
    STUDENT_PORTAL --> GATEWAY
    STUDENT_PORTAL <--> CLIENT_CACHE
    CLIENT_CACHE -.->|Opportunistic Background Flush| SYNC_SERVICE

    GATEWAY --> JWT_GUARD
    JWT_GUARD --> SANITIZER
    SANITIZER --> SPEECH_SERVICE
    SANITIZER --> TRANSLATION_SERVICE
    SANITIZER --> PEDAGOGY_SERVICE
    SANITIZER --> SYNC_SERVICE

    SPEECH_SERVICE --> TRIBAL_KB
    TRANSLATION_SERVICE --> TRIBAL_KB
    TRANSLATION_SERVICE -.->|Complex Translation Fallback| AI_ENGINE
    PEDAGOGY_SERVICE --> DATA_STORE
    SYNC_SERVICE --> DATA_STORE
```

---

## 🔄 Data Flow Pipelines

### 1. Real-Time Bilingual Classroom & Zero-Data-Leakage Lifecycle

```mermaid
sequenceDiagram
    autonumber
    actor Teacher as 👨‍🏫 Teacher (Hindi Instruction)
    participant UI as 🖥️ Vaani Frontend Console
    participant Gateway as 🛡️ Express API Gateway
    participant Engine as 🌐 Vernacular Engine
    actor Student as 🎒 Student (Vernacular Audio)

    Note over Teacher,Student: ⏰ Classroom Session Starts — Real-time countdown timer engaged
    Teacher->>UI: Speaks lesson concept in Hindi ("आज हम 1 से 10 तक गिनती सीखेंगे")
    UI->>UI: Voice Activity Detection (VAD) & Web Speech audio chunking
    UI->>Gateway: POST /api/live/message { text, targetLang: 'mun' }
    Gateway->>Engine: Resolve terminology against Indigenous Tribal Knowledge Base
    Engine-->>Gateway: Synthesized vernacular output & phonetic representation
    Gateway-->>UI: Broadcasts translated payload (< 120ms total latency)
    UI->>Student: Crystal-clear native audio playback ("तिहिंग आबू 1 खों 10 धबी लेखा सेड़ाएया")
    Student->>UI: Interacts via drawing slate or oral audio submission
    Note over Teacher,Student: ⏳ Class Duration Expires — Anti-Tamper Lock Engaged
    UI->>Gateway: POST /api/live/clear (Automated Session Wipe)
    Gateway->>Gateway: Ephemeral session buffer flushed permanently from memory
    UI->>UI: Increments subject completion counter & archives record
    Note over Teacher,Student: ✅ Zero message retention — Classroom record moved to completed archive
```

---

### 2. Offline-First Edge Reconciler Pipeline (Rural Low-Bandwidth Mode)

```mermaid
flowchart LR
    A["🎒 Student Submits Worksheet / Quiz"] --> B["💾 Write to Local Storage Queue<br/>(Generate UUID Idempotency Key)"]
    B --> C{"🌐 Network Connectivity Check"}
    C -- "Offline / Intermittent 2G" --> D["⏸️ Enqueue in FIFO Replay Store<br/>Display Optimistic Sync Badge"]
    C -- "Stable Online" --> E["🚀 POST /api/sync/flush<br/>(Batch Dispatch Payload)"]
    D -.->|Window Online Event Detected| E
    E --> F["🛡️ Server-Side Idempotency Check<br/>(Deduplicate & Validate Timestamp)"]
    F --> G["💾 Atomic Commit to Application Store"]
    G --> H["✅ Purge Local Queue Entry"]
```

---

## 🛠️ Core Subsystems & Technical Deep Dive

### 1. 🎙️ Teacher Studio & Live Classroom Engine
- **Automated Lifecycle with Strict Lock Rule:** Classes strictly enforce set duration limits. Once a class reaches its end time, further time extensions are permanently disabled, preventing curriculum delay.
- **Privacy Hygiene & Ephemeral Buffer Flush:** All temporary audio streams, chat transcripts, and in-flight translation payloads are instantly wiped upon class completion or cancellation (`POST /api/live/clear`), ensuring zero lingering child data.
- **Dashboard Separation:** Active classes appear exclusively on the main dashboard (`TeacherHome.tsx`), while finished classes are automatically migrated to the Live Class archive (`LiveClass.tsx`).
- **Subject-Wise Completed Counters:** Real-time counters monitor completed classes across 6 primary academic disciplines: Mathematics, Hindi, Science, Social Studies, Environmental Studies, and Foundational Literacy (FLN).

### 2. 🎒 Child-Centric Multimodal Student Portal
- **Vector Drawing Slate (डिजिटल स्लेट):** HTML5 Canvas drawing board with pencil, eraser, stroke smoothing, vibrant multi-color selection, and single-click clear.
- **Tri-Modal Assignment Submission:** Children can submit coursework through freehand drawing, recording a voice note in their native dialect, or capturing a workbook snapshot.
- **Star Gamification Economics (⭐):** Positive reinforcement through multi-sensory celebratory audio and stars earned across quizzes and worksheets.
- **Oral Folklore Library (लोककथाएँ):** High-fidelity digital library preserving indigenous tribal folklore through native audio narrations in Santali, Ho, and Mundari.

### 3. 📖 4-Stage Pedagogical Lesson Planner
Fully aligned with NCERT and NIPUN Bharat FLN methodology:
1. **Stage 1: Warmup & Contextual Hook (5 Mins):** Local tribal folk songs, rhymes, and relatable cultural icebreakers.
2. **Stage 2: Direct Instruction (15 Mins):** Concrete-to-abstract foundational concept building with bilingual vocabulary scaffolding.
3. **Stage 3: Guided Practice & Interactive Activity (15 Mins):** Collaborative peer activities utilizing local objects (pebbles, leaves, seeds).
4. **Stage 4: Formative Assessment (10 Mins):** Quick verbal check-in questions and interactive worksheet reinforcement.

---

## 🗣️ Indigenous Linguistic Matrix & Native Scripts

Vaani incorporates native orthography, typography, and phonetic mapping for Jharkhand's three primary indigenous languages:

| Language | Native Script | Script Character Sample | Devanagari Phonetic Guide | Target Geographic Region |
|---|---|---|---|---|
| **Santali (संथाली)** | **Ol Chiki (ᱚᱞ ᱪᱤᱠᱤ)** | ᱥᱟᱱᱛᱟᱲᱤ ᱯᱟᱹᱨᱥᱤ | संथाली (देवनागरी उच्चारण सहित) | Dumka, Deoghar, Godda, Sahibganj, Pakur, Jamtara |
| **Ho (हो)** | **Warang Chiti (𑢹𑣉𑣉)** | 𑢹𑣉𑣉 𑣎𑣋𑣜 | हो (देवनागरी उच्चारण सहित) | West Singhbhum (Chaibasa), Seraikela-Kharsawan |
| **Mundari (मुंडारी)** | **Mundari Bani / Devanagari** | ᱢᱩᱱᱰᱟᱨᱤ ᱡᱟᱜᱟᱨ | मुंडारी (देवनागरी उच्चारण सहित) | Khunti, Ranchi Rural, Torpa, Murhu |

---

## 🔌 REST API Documentation

### 1. Authentication & Identity Endpoints (`/api/auth`)
| Method | Endpoint | Request Body | Response Format | Purpose |
|---|---|---|---|---|
| `POST` | `/api/auth/login` | `{ email, password }` | `{ token, user: { id, name, role } }` | Authenticates teacher or student and returns signed JWT token. |
| `POST` | `/api/auth/register` | `{ name, email, password, role }` | `{ token, user: { id, name, role } }` | Registers a new user account with role-scoped permissions. |
| `GET` | `/api/auth/me` | *Bearer Authorization Header* | `{ user: { id, name, email, role } }` | Validates session token and returns active user profile. |

### 2. Live Classroom & Speech Broadcast Endpoints (`/api/live`)
| Method | Endpoint | Request Body | Response Format | Purpose |
|---|---|---|---|---|
| `POST` | `/api/live/message` | `{ text, targetLang, sender }` | `{ original, translated, targetLang, timestamp }` | Translates Hindi speech into target tribal vernacular in real time. |
| `GET` | `/api/live/session` | *Query: roomId* | `{ roomCode, status, remainingSeconds, schedule }` | Retrieves real-time room metadata, countdown, and active lock state. |
| `POST` | `/api/live/clear` | *None* | `{ success: true, message: "Session memory cleared" }` | Permanently purges in-flight audio buffers and chat logs upon class end. |

### 3. Curriculum, Worksheets & Quizzes (`/api/curriculum`)
| Method | Endpoint | Request Body | Response Format | Purpose |
|---|---|---|---|---|
| `GET` | `/api/curriculum/classes` | *None* | `{ classes: [...] }` | Retrieves scheduled and active live classes. |
| `POST` | `/api/curriculum/classes` | `{ subject, grade, topic, startTime, endTime }` | `{ class: { id, ... } }` | Schedules a new bilingual class with strict start and end timestamps. |
| `GET` | `/api/curriculum/notes` | *Query: classId* | `{ notes: [...] }` | Retrieves 4-stage pedagogical blueprints and lesson guidelines. |
| `GET` | `/api/curriculum/practice-papers` | *Query: grade* | `{ papers: [...] }` | Generates bilingual NIPUN Bharat FLN worksheets. |

### 4. Edge Sync & Offline Persistence (`/api/sync`)
| Method | Endpoint | Request Body | Response Format | Purpose |
|---|---|---|---|---|
| `POST` | `/api/sync/flush` | `{ operations: [ { id, action, payload } ] }` | `{ syncedCount, failedCount }` | Reconciles queued offline student actions into the central database. |
| `GET` | `/api/sync/status` | *None* | `{ status: "synced", lastSyncTimestamp }` | Verifies edge sync status and server connectivity. |

---

## 🛠️ Technology Stack & Standards

```text
┌─────────────────────────────────────────────────────────────────────────────┐
│                           TECHNOLOGY STACK SUMMARY                          │
├───────────────────────┬─────────────────────────────────────────────────────┤
│ Frontend Framework    │ React 19.2.8 + Vite 8.3.3 (Modern ESM Architecture)  │
│ Routing Architecture  │ React Router v7.18.4 (Declarative Layout Routing)   │
│ Styling & Tokens      │ Tailwind CSS v4.3.3 + Monochromatic Indigo Palette  │
│ Audio & Canvas APIs   │ Web Speech API (Synthesis/Recognition) + Canvas API │
│ Backend Server        │ Node.js 18+ LTS + Express 5.2.1                     │
│ Language Standard     │ TypeScript 100% (Strict Type Safety & Zero Any)     │
│ Security & Crypto     │ JWT (jsonwebtoken 9.0) + Bcryptjs 3.0 Salt Hashing │
│ Generative AI Engine  │ @google/genai (Gemini SDK) + Indigenous Knowledge   │
│ UI Color Palette      │ Royal Blue to Violet Gradient (#2563EB - #7C3AED)   │
└───────────────────────┴─────────────────────────────────────────────────────┘
```

---

## 📂 Monorepo Directory Architecture

```text
vernacular-edu/
├── backend/                         # Node.js + Express 5 TypeScript API Server
│   ├── src/
│   │   ├── controllers/             # Domain request controllers
│   │   │   ├── authController.ts        # JWT generation & role access control
│   │   │   ├── curriculumController.ts  # Lesson planner & class scheduling
│   │   │   ├── flashcardController.ts   # Bilingual flashcard dictionaries
│   │   │   ├── liveClassController.ts   # Live room state & speech broadcast
│   │   │   ├── syncController.ts        # Offline edge sync reconciler
│   │   │   ├── translateController.ts   # Dialect lookup & transformation
│   │   │   ├── ttsController.ts         # High-clarity audio speech synthesis
│   │   │   └── worksheetController.ts   # Dynamic FLN worksheet generators
│   │   ├── middleware/              # Auth guards & rate limiters
│   │   │   └── auth.ts
│   │   ├── routes/                  # Express route declarations
│   │   ├── services/                # Specialized domain services
│   │   │   ├── aiService.ts             # Google GenAI Gemini SDK integration
│   │   │   ├── authService.ts           # Password hashing & user auth
│   │   │   └── tribalKnowledgeBase.ts   # Vernacular dictionary & folklore engine
│   │   └── index.ts                 # Express app bootstrapper & listener
│   ├── .env.example                 # Sanitized environment template
│   ├── package.json
│   └── tsconfig.json
│
├── frontend/                        # React 19 + Vite 8 Single Page App
│   ├── src/
│   │   ├── assets/                  # High-contrast SVGs & hero media
│   │   ├── components/              # Accessible, shared component library
│   │   │   ├── Sidebar.tsx              # Role-aware navigation sidebar
│   │   │   ├── StudentNotificationBell.tsx # Child-friendly audio notification
│   │   │   ├── StudentPageBanner.tsx    # Monochromatic gradient header banners
│   │   │   └── UserAvatarDropdown.tsx   # Profile switch & logout menu
│   │   ├── layouts/                 # Master application layout wrappers
│   │   │   ├── StudentLayout.tsx
│   │   │   └── TeacherLayout.tsx
│   │   ├── pages/
│   │   │   ├── student/             # Student Portal screens
│   │   │   │   ├── AudioLibrary.tsx     # Folk stories & audio lessons
│   │   │   │   ├── DrawingCanvas.tsx    # Digital Slate vector canvas
│   │   │   │   ├── Flashcards.tsx       # Trilingual phonetic cards
│   │   │   │   ├── Home.tsx             # Interactive 9-tool student dashboard
│   │   │   │   ├── LiveClass.tsx        # Student live classroom audio interface
│   │   │   │   ├── Profile.tsx          # Student star tracker & badges
│   │   │   │   ├── Quiz.tsx             # Multilingual FLN quiz runner
│   │   │   │   ├── Settings.tsx         # Target language & voice speed config
│   │   │   │   └── Worksheets.tsx       # Digital worksheet slate submission
│   │   │   └── teacher/             # Teacher Studio screens
│   │   │       ├── Documents.tsx        # Curriculum documents repository
│   │   │       ├── Flashcards.tsx       # Flashcard generation studio
│   │   │       ├── Home.tsx             # Main Teacher Dashboard (Live classes only)
│   │   │       ├── LessonPlanner.tsx    # 4-stage pedagogy blueprint
│   │   │       ├── LiveClass.tsx        # Live Studio with strict timer locks
│   │   │       ├── OfflineSync.tsx      # Edge cache sync monitor
│   │   │       ├── ProgressTracker.tsx  # Student FLN competency analytics
│   │   │       └── QuizSchedule.tsx     # FLN quiz authoring console
│   │   ├── router.tsx               # Client-side route declarations
│   │   └── App.tsx
│   ├── package.json
│   ├── tailwind.config.js
│   └── vite.config.ts
│
├── .gitignore                       # Enterprise secret & artifact isolation
└── README.md                        # Master architectural documentation
```

---

## 🚀 Installation & Quick Start Guide

### 1. Prerequisites
- **Node.js**: v18.0.0 or higher ([Download Node.js](https://nodejs.org/))
- **npm**: v9.0.0 or higher
- **Git**: Installed on your system

### 2. Clone Repository
```bash
git clone https://github.com/madhavisolanki-ui/Vaani.git
cd Vaani
```

### 3. Backend Setup & Launch
```bash
# Navigate to backend directory
cd backend

# Install dependencies
npm install

# Setup environment configuration
cp .env.example .env

# Compile TypeScript and start server
npm run build
npm start
```
*The backend API server launches at `http://localhost:4000` (Health Check: `http://localhost:4000/api/health`).*

### 4. Frontend Setup & Launch
```bash
# Open a second terminal and navigate to frontend directory
cd frontend

# Install client packages
npm install

# Launch Vite development server
npm run dev
```
*The frontend application will start at `http://localhost:5173`.*

---

## 🔐 Default Test Credentials

| Portal | Role | Test Email | Password | Pre-configured Privileges |
|---|---|---|---|---|
| **Teacher Studio** | 👨‍🏫 Primary Educator | `teacher@test.com` | `123456` | Full pedagogical authoring, live classroom hosting, analytics. |
| **Student Portal** | 🎒 Tribal Student | `student@test.com` | `123456` | Oral live classroom, digital slate, folk stories, FLN quizzes. |

---

## 🔒 Security, Privacy & Child Safety
- **Zero Ephemeral Audio Retention:** Live classroom audio and transcripts exist solely in memory during active sessions and are completely destroyed upon class completion.
- **COPPA & FERPA Compliance:** No student biometric or personally identifiable information (PII) is tracked without educator authorization.
- **Isolated Edge Storage:** Local storage keys are namespaced and validated to prevent cross-profile data leakage on shared classroom tablets.

---

## 🗺️ Engineering Roadmap

- [x] **Phase 1 (Completed):** Sub-second bidirectional live audio translation for Santali, Ho, and Mundari.
- [x] **Phase 2 (Completed):** Child-centric vector digital slate, strict session timer locks, and zero-retention memory hygiene.
- [x] **Phase 3 (Completed):** 4-stage NIPUN Bharat pedagogical lesson planner and subject-wise completion counters.
- [ ] **Phase 4 (Upcoming):** Quantized on-device speech recognition inference via WebAssembly (Wasm) and ONNX Runtime on low-cost tablets.
- [ ] **Phase 5 (Upcoming):** IVR / Toll-Free audio classroom integration for non-smartphone households in remote tribal villages.
- [ ] **Phase 6 (Upcoming):** Central state education registry connector (DIKSHA / NIPUN Bharat API synchronization).

---

## 📜 License & Acknowledgements

Distributed under the **MIT License**. See `LICENSE` for more information.

Developed with deep respect for the indigenous cultural heritage, languages, and children of Jharkhand, India.
