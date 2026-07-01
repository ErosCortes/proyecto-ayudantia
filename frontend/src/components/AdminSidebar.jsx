import { Link } from "react-router-dom";

function AdminSidebar() {
  return (
    <aside className="bg-[#003057] text-white w-full md:w-64 min-h-auto md:min-h-screen p-6">

      <h2 className="text-2xl font-bold mb-8">
        Administrador
      </h2>

      <nav>
        <ul className="flex md:flex-col gap-3 flex-wrap">

          <li>
            <Link
              to="/admin"
              className="block bg-[#004b87] px-4 py-3 rounded-xl hover:bg-[#00AEEF] transition"
            >
              Inicio
            </Link>
          </li>

          <li>
            <Link
              to="/admin/courses"
              className="block bg-[#004b87] px-4 py-3 rounded-xl hover:bg-[#00AEEF] transition"
            >
              Gestionar Cursos
            </Link>
          </li>

          <li>
            <Link
              to="/admin/users"
              className="block bg-[#004b87] px-4 py-3 rounded-xl hover:bg-[#00AEEF] transition"
            >
              Gestionar Usuarios
            </Link>
          </li>

          <li>
            <Link
              to="/admin/historial"
              className="block bg-[#004b87] px-4 py-3 rounded-xl hover:bg-[#00AEEF] transition"
            >
              Historial Ayudantías
            </Link>


          </li>
          <li>
          <Link
            to="/admin/export-payments"
            className="block bg-[#004b87] px-4 py-3 rounded-xl hover:bg-[#00AEEF] transition"
          >
            Exportar Pagos
      </Link>
        </li>
        </ul>
      </nav>
    </aside>
  );
}

export default AdminSidebar;
