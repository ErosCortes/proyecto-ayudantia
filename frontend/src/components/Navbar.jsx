import { Link, useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";

function Navbar() {
  const { logout, profileType } = useAuth();
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate("/");
  };

  return (
    <header className="bg-[#003057] text-white shadow-lg">
      <nav className="max-w-7xl mx-auto px-4 py-3 flex justify-between items-center">

        <section className="flex items-center gap-3">

          <a
            href="https://www.ucn.cl"
            target="_blank"
            rel="noreferrer"
          >
            <img
              src="/logo70azul.png"
              alt="UCN"
              className="h-12 md:h-16 cursor-pointer"
            />
          </a>

          <h1 className="text-lg md:text-xl font-bold">
            Ayudantias UCN
          </h1>

        </section>

        <ul className="hidden md:flex gap-6 items-center">
          {profileType && (
            <li>
              <Link to={`/${profileType}`} className="hover:text-[#00AEEF]">
                Inicio
              </Link>
            </li>
          )}

          {profileType && profileType !== "admin" && (
            <li>
              <Link to={`/${profileType}/profile`} className="hover:text-[#00AEEF]">
                Perfil
              </Link>
            </li>
          )}

          <li>
            <a href="https://www.ucn.cl/contactanos/" target="_blank" rel="noreferrer" className="hover:text-[#00AEEF]">
              Contacto
            </a>
          </li>

          {profileType && (
            <li>
              <button
                onClick={handleLogout}
                className="bg-red-600 hover:bg-red-700 px-4 py-2 rounded-lg transition font-semibold"
              >
                Cerrar sesion
              </button>
            </li>
          )}
        </ul>

      </nav>
    </header>
  );
}

export default Navbar;
