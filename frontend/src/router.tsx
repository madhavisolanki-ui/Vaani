import { createBrowserRouter, Navigate } from "react-router-dom";
import Login from "./pages/Login";
import TeacherHome from "./pages/teacher/Home";
import StudentHome from "./pages/student/Home";
import TeacherLayout from "./layouts/TeacherLayout";
import StudentLayout from "./layouts/StudentLayout";
import TeacherLiveClass from "./pages/teacher/LiveClass";
import StudentLiveClass from "./pages/student/LiveClass";
import TeacherWorksheets from "./pages/teacher/Worksheets";
import StudentWorksheets from "./pages/student/Worksheets";
import TeacherFlashcards from "./pages/teacher/Flashcards";
import StudentFlashcards from "./pages/student/Flashcards";
import TeacherLessonPlanner from "./pages/teacher/LessonPlanner";
import TeacherSettings from "./pages/teacher/Settings";
import TeacherProfile from "./pages/teacher/Profile";
import TeacherNotifications from "./pages/teacher/Notifications";
import TeacherDocuments from "./pages/teacher/Documents";
import TeacherProgressTracker from "./pages/teacher/ProgressTracker";
import TeacherOfflineSync from "./pages/teacher/OfflineSync";
import TeacherQuizSchedule from "./pages/teacher/QuizSchedule";
import StudentDrawingCanvas from "./pages/student/DrawingCanvas";
import StudentAudioLibrary from "./pages/student/AudioLibrary";
import StudentProfile from "./pages/student/Profile";
import StudentSettings from "./pages/student/Settings";
import StudentNotifications from "./pages/student/Notifications";
import StudentQuiz from "./pages/student/Quiz";

export const router = createBrowserRouter([
  { path: "/login", element: <Login /> },

  // Teacher Protected Routes
  {
    path: "/teacher",
    element: <TeacherLayout />,
    children: [
      { index: true, element: <TeacherHome /> },
      { path: "profile", element: <TeacherProfile /> },
      { path: "notifications", element: <TeacherNotifications /> },
      { path: "liveclass", element: <TeacherLiveClass /> },
      { path: "baatcheet", element: <Navigate to="/teacher/liveclass" replace /> },
      { path: "quiz-schedule", element: <TeacherQuizSchedule /> },
      { path: "documents", element: <TeacherDocuments /> },
      { path: "lesson-planner", element: <TeacherLessonPlanner /> },
      { path: "worksheets", element: <TeacherWorksheets /> },
      { path: "flashcards", element: <TeacherFlashcards /> },
      { path: "progress", element: <TeacherProgressTracker /> },
      { path: "offline-sync", element: <TeacherOfflineSync /> },
      { path: "settings", element: <TeacherSettings /> },
    ],
  },

  // Student Navigation Routes with StudentLayout
  {
    element: <StudentLayout />,
    children: [
      { path: "/dashboard", element: <StudentHome /> },
      { path: "/live-class", element: <StudentLiveClass /> },
      { path: "/liveclass", element: <Navigate to="/live-class" replace /> },
      { path: "/worksheets", element: <StudentWorksheets /> },
      { path: "/flashcards", element: <StudentFlashcards /> },
      { path: "/drawing-canvas", element: <StudentDrawingCanvas /> },
      { path: "/audio-library", element: <StudentAudioLibrary /> },
      { path: "/profile", element: <StudentProfile /> },
      { path: "/settings", element: <StudentSettings /> },
      { path: "/notifications", element: <StudentNotifications /> },
      { path: "/quiz", element: <StudentQuiz /> },
      // Aliases under /student
      { path: "/student", element: <StudentHome /> },
      { path: "/student/dashboard", element: <Navigate to="/dashboard" replace /> },
      { path: "/student/liveclass", element: <Navigate to="/live-class" replace /> },
      { path: "/student/live-class", element: <Navigate to="/live-class" replace /> },
      { path: "/student/worksheets", element: <Navigate to="/worksheets" replace /> },
      { path: "/student/flashcards", element: <Navigate to="/flashcards" replace /> },
      { path: "/student/drawing-canvas", element: <Navigate to="/drawing-canvas" replace /> },
      { path: "/student/audio-library", element: <Navigate to="/audio-library" replace /> },
      { path: "/student/profile", element: <Navigate to="/profile" replace /> },
      { path: "/student/settings", element: <Navigate to="/settings" replace /> },
      { path: "/student/notifications", element: <Navigate to="/notifications" replace /> },
      { path: "/student/quiz", element: <Navigate to="/quiz" replace /> },
    ],
  },

  { path: "*", element: <Navigate to="/login" replace /> },
]);