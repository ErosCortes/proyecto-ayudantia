import { Link } from "react-router-dom";

function TeacherSidebar() {
  return (
    <aside className="bg-[#003057] text-white w-full md:w-64 min-h-auto md:min-h-screen p-6">

      <h2 className="text-2xl font-bold mb-8">
        Profesor
      </h2>

      <nav>
        <ul className="flex md:flex-col gap-3 flex-wrap">

          <li>
            <Link
              to="/teacher"
              className="block bg-[#004b87] px-4 py-3 rounded-xl hover:bg-[#00AEEF] transition"
            >
              Inicio
            </Link>
          </li>

          <li>
            <Link
              to="/teacher/manage"
              className="block bg-[#004b87] px-4 py-3 rounded-xl hover:bg-[#00AEEF] transition"
            >
              Gestionar Ayudantías
            </Link>
          </li>

          <li>
            <Link
              to="/teacher/applicants"
              className="block bg-[#004b87] px-4 py-3 rounded-xl hover:bg-[#00AEEF] transition"
            >
              Ver Postulantes
            </Link>
          </li>

          <li>
            <Link
              to="/teacher/profile"
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

export default TeacherSidebar;