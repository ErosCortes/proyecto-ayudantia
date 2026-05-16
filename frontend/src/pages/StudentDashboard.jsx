import Navbar from "../components/Navbar";
import StudentSidebar from "../components/StudentSidebar";
import { Outlet } from "react-router-dom";
import { useState } from "react";
import { studentApplications }
  from "../data/mockData";

function StudentDashboard() {

  const [applications, setApplications] =
    useState(studentApplications);

  return (
    <div className="bg-gray-100 min-h-screen">

      <Navbar />

      <div className="flex flex-col md:flex-row">

        <StudentSidebar />

        <main className="flex-1 p-6">

          <Outlet
            context={{
              applications,
              setApplications,
            }}
          />

        </main>

      </div>

    </div>
  );
}

export default StudentDashboard;
