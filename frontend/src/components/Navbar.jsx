import { useNavigate } from "react-router-dom";

function Navbar() {
  const navigate = useNavigate();

  const handleLogout = async () => {
    try {
      const response = await fetch("http://localhost:8000/users/logout/", {
        method: "POST",
        credentials: "include",
        headers: {
          "Content-Type": "application/json",
        },
      });

      if (response.ok) {
        // Limpiar localStorage
        localStorage.clear();
        sessionStorage.clear();
        
        // Desconectar de Google (opcional pero recomendado)
        // Se abre una ventana pequeña que Google ignora pero limpia la sesión
        window.open("https://accounts.google.com/Logout", "_blank", "width=1,height=1");
        
        // Redirigir al login
        setTimeout(() => {
          window.location.href = "http://localhost:3000/";
        }, 500);
      } else {
        console.error("Error al cerrar sesión");
        window.location.href = "http://localhost:3000/";
      }
    } catch (error) {
      console.error("Error al cerrar sesión:", error);
      window.location.href = "http://localhost:3000/";
    }
  };

  return (
    <header className="bg-[#003057] text-white shadow-lg">
      <nav className="max-w-7xl mx-auto px-4 py-3 flex justify-between items-center">

        {/* Logo + título */}
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
            Ayudantías UCN
          </h1>

        </section>

        {/* Menú desktop */}
        <ul className="hidden md:flex gap-6 items-center">
          <li>
            <a href="#" className="hover:text-[#00AEEF]">
              Inicio
            </a>
          </li>

          <li>
            <a href="#" className="hover:text-[#00AEEF]">
              Perfil
            </a>
          </li>

          <li>
            <a href="#" className="hover:text-[#00AEEF]">
              Contacto
            </a>
          </li>

          <li>
            <button
              onClick={handleLogout}
              className="bg-red-600 hover:bg-red-700 px-4 py-2 rounded-lg transition font-semibold"
            >
              Cerrar sesión
            </button>
          </li>
        </ul>

      </nav>
    </header>
  );
}

export default Navbar;