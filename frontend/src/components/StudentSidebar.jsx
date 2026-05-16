import { Link } from "react-router-dom";

function StudentSidebar() {
  return (
    <aside className="bg-[#003057] text-white w-full md:w-64 min-h-auto md:min-h-screen p-6">

      <h2 className="text-2xl font-bold mb-8">
        Estudiante
      </h2>

      <nav>
        <ul className="flex md:flex-col gap-3 flex-wrap">

          <li>
            <Link
              to="/student"
              className="block bg-[#004b87] px-4 py-3 rounded-xl hover:bg-[#00AEEF] transition"
            >
              Inicio
            </Link>
          </li>

          <li>
            <Link
              to="/student/apply"
              className="block bg-[#004b87] px-4 py-3 rounded-xl hover:bg-[#00AEEF] transition"
            >
              Postular
            </Link>
          </li>

          <li>
            <Link
              to="/student/applications"
              className="block bg-[#004b87] px-4 py-3 rounded-xl hover:bg-[#00AEEF] transition"
            >
              Mis postulaciones
            </Link>
          </li>

          <li>
            <Link
              to="/student/profile"
              className="block bg-[#004b87] px-4 py-3 rounded-xl hover:bg-[#00AEEF] transition"
            >
              Perfil
            </Link>
          </li>

          <li>
          <button
            onClick={() => {

              const confirmLogout = window.confirm(
                "¿Estás seguro de cerrar sesión?"
              );

              if (confirmLogout) {
                localStorage.removeItem("userEmail");
                window.location.href = "/";
              }

            }}

            className="block w-full text-left bg-red-500 px-4 py-3 rounded-xl hover:bg-red-600 transition text-white flex items-center gap-3"
          >
            <img
              src="/poweroff.png"
              alt="LogOut"
              className="w-7 h-7"
            />
            Cerrar Sesión
          </button>
          </li>
        </ul>
      </nav>
    </aside>
  );
}

export default StudentSidebar;