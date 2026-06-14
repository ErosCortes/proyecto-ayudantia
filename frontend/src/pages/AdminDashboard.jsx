import Navbar from "../components/Navbar";
import AdminSidebar from "../components/AdminSidebar";
import { Outlet } from "react-router-dom";

function AdminDashboard() {
  return (
    <div className="bg-gray-100 min-h-screen">

      <Navbar />

      <div className="flex flex-col md:flex-row">

        <AdminSidebar />

        <main className="flex-1 p-6">
          <Outlet />
        </main>

      </div>
    </div>
  );
}

export default AdminDashboard;
