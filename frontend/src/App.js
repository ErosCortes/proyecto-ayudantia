import { BrowserRouter, Routes, Route } from "react-router-dom";

import LoginPage from "./pages/LoginPage";

import StudentDashboard from "./pages/StudentDashboard";
import DashboardHome from "./pages/student/DashboardHome";
import Apply from "./pages/student/Apply";
import Applications from "./pages/student/Applications";
import Profile from "./pages/student/Profile";
import StudentTutorshipHistory from "./pages/student/TutorshipHistory";

import TeacherDashboard from "./pages/TeacherDashboard";
import DashboardHomeTeacher from "./pages/teacher/DashboardHomeTeacher";
import ManageTutorships from "./pages/teacher/ManageTutorships";
import Applicants from "./pages/teacher/Applicants";
import TeacherProfile from "./pages/teacher/TeacherProfile";

import AdminDashboard from "./pages/AdminDashboard";
import AdminHome from "./pages/admin/AdminHome";
import ManageCourses from "./pages/admin/ManageCourses";

function App() {
  return (
    <BrowserRouter>

      <Routes>

        {/* Login */}
        <Route path="/" element={<LoginPage />} />

        {/* ESTUDIANTE */}
        <Route path="/student" element={<StudentDashboard />}>

          <Route index element={<DashboardHome />} />

          <Route path="apply" element={<Apply />} />

          <Route
            path="applications"
            element={<Applications />}
          />

          <Route
            path="tutorship-history"
            element={<StudentTutorshipHistory />}
          />

          <Route path="profile" element={<Profile />} />

        </Route>

        {/* PROFESOR */}
        <Route path="/teacher" element={<TeacherDashboard />}>

          <Route index element={<DashboardHomeTeacher />} />

          <Route
            path="manage"
            element={<ManageTutorships />}
          />

          <Route
            path="applicants"
            element={<Applicants />}
          />

          <Route
            path="profile"
            element={<TeacherProfile />}
          />

        </Route>

        {/* ADMINISTRADOR */}
        <Route path="/admin" element={<AdminDashboard />}>

          <Route index element={<AdminHome />} />

          <Route
            path="courses"
            element={<ManageCourses />}
          />

        </Route>

      </Routes>

    </BrowserRouter>
  );
}

export default App;