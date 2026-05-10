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

        </ul>
      </nav>
    </aside>
  );
}

export default TeacherSidebar;