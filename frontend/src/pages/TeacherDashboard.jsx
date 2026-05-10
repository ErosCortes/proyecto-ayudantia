import Navbar from "../components/Navbar";
import TeacherSidebar from "../components/TeacherSidebar";
import { Outlet } from "react-router-dom";

import { useState } from "react";

import { applicants }
  from "../data/mockData";

function TeacherDashboard() {

  const [teacherApplicants, setTeacherApplicants] =
    useState(applicants);

  return (
    <div className="bg-gray-100 min-h-screen">

      <Navbar />

      <div className="flex flex-col md:flex-row">

        <TeacherSidebar />

        <main className="flex-1 p-6">

          <Outlet
            context={{
              teacherApplicants,
              setTeacherApplicants,
            }}
          />

        </main>

      </div>

    </div>
  );
}

export default TeacherDashboard;