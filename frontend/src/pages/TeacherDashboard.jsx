import Navbar from "../components/Navbar";
import TeacherSidebar from "../components/TeacherSidebar";
import { Outlet } from "react-router-dom";

function TeacherDashboard() {
  return (
    <div className="bg-gray-100 min-h-screen">

      <Navbar />

      <div className="flex flex-col md:flex-row">

        <TeacherSidebar />

        <main className="flex-1 p-6">
          <Outlet />
        </main>

      </div>
    </div>
  );
}

export default TeacherDashboard;