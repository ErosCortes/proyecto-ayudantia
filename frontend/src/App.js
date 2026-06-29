import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import { AuthProvider, useAuth } from "./context/AuthContext";

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
import ManageUsers from "./pages/admin/ManageUsers";
import HistorialAyudantias from "./pages/admin/HistorialAyudantias";

function ProtectedRoute({ children, allowedRole }) {
  const { isAuthenticated, profileType, loading } = useAuth();

  if (loading) {
    return (
      <div className="flex justify-center items-center min-h-screen">
        <p className="text-xl text-gray-600">Cargando...</p>
      </div>
    );
  }

  if (!isAuthenticated) {
    return <Navigate to="/" replace />;
  }

  if (allowedRole && profileType !== allowedRole) {
    const redirectMap = { admin: "/admin", teacher: "/teacher", student: "/student" };
    return <Navigate to={redirectMap[profileType] || "/"} replace />;
  }

  return children;
}

function AppRoutes() {
  return (
    <Routes>
      {/* Login */}
      <Route path="/" element={<LoginPage />} />

      {/* ESTUDIANTE */}
      <Route
        path="/student"
        element={
          <ProtectedRoute allowedRole="student">
            <StudentDashboard />
          </ProtectedRoute>
        }
      >
        <Route index element={<DashboardHome />} />
        <Route path="apply" element={<Apply />} />
        <Route path="applications" element={<Applications />} />
        <Route path="tutorship-history" element={<StudentTutorshipHistory />} />
        <Route path="profile" element={<Profile />} />
      </Route>

      {/* PROFESOR */}
      <Route
        path="/teacher"
        element={
          <ProtectedRoute allowedRole="teacher">
            <TeacherDashboard />
          </ProtectedRoute>
        }
      >
        <Route index element={<DashboardHomeTeacher />} />
        <Route path="manage" element={<ManageTutorships />} />
        <Route path="applicants" element={<Applicants />} />
        <Route path="profile" element={<TeacherProfile />} />
      </Route>

      {/* ADMINISTRADOR */}
      <Route
        path="/admin"
        element={
          <ProtectedRoute allowedRole="admin">
            <AdminDashboard />
          </ProtectedRoute>
        }
      >
        <Route index element={<AdminHome />} />
        <Route path="courses" element={<ManageCourses />} />
        <Route path="users" element={<ManageUsers />} />
        <Route path="historial" element={<HistorialAyudantias />} />
      </Route>
    </Routes>
  );
}

function App() {
  return (
    <BrowserRouter>
      <AuthProvider>
        <AppRoutes />
      </AuthProvider>
    </BrowserRouter>
  );
}

export default App;
