import Navbar from "../components/Navbar";
import StudentSidebar from "../components/StudentSidebar";
import { Outlet } from "react-router-dom";

function StudentDashboard() {
  return (
    <div className="bg-gray-100 min-h-screen">

      <Navbar />

      <div className="flex flex-col md:flex-row">

        <StudentSidebar />

        <main className="flex-1 p-6">
          <Outlet />
        </main>

      </div>
    </div>
  );
}

export default StudentDashboard;