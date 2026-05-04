import React from "react";
import ReactDOM from "react-dom/client";
import "./index.css";

function App() {
  const handleLogin = () => {
    window.location.href =
      "http://localhost:8000/auth/login/google-oauth2/";
  };

  return (
    <div className="bg-gray-100 font-sans flex flex-col md:flex-row min-h-screen">
      
      {/* Sidebar (solo desktop) */}
      <aside className="hidden md:flex w-64 bg-[#003057] text-white p-6 flex-col gap-6">
        <h2 className="text-2xl font-bold">Acceso</h2>

        <button
          onClick={handleLogin}
          className="bg-[#00AEEF] py-3 rounded-xl font-semibold hover:opacity-80"
        >
          Ingresar con cuenta institucional
        </button>
      </aside>

      {/* Contenido principal */}
      <div className="flex-1 flex flex-col">
        
        {/* Navbar */}
        <header className="bg-[#003057] text-white shadow-lg">
          <nav className="max-w-7xl mx-auto px-4 py-3 flex justify-between items-center">
            
            {/* Logo + título */}
            <section className="flex items-center gap-3">
              <a href="https://www.ucn.cl" target="_blank" rel="noreferrer">
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
            <ul className="hidden md:flex gap-6">
              <li><a href="#" className="hover:text-[#00AEEF]">Inicio</a></li>
              <li><a href="#" className="hover:text-[#00AEEF]">Cursos</a></li>
              <li><a href="#" className="hover:text-[#00AEEF]">Calendario</a></li>
              <li><a href="#" className="hover:text-[#00AEEF]">Material</a></li>
              <li><a href="#" className="hover:text-[#00AEEF]">Contacto</a></li>
            </ul>
          </nav>
        </header>

        {/* Hero */}
        <main className="flex-1 flex items-center justify-center">
          <section className="bg-white py-12 md:py-16 text-center px-6 rounded-xl shadow-md">
            
            <h2 className="text-3xl md:text-5xl font-bold text-[#003057]">
              Portal de Ayudantías
            </h2>

            <p className="mt-4 text-gray-600 text-base md:text-lg">
              Encuentra horarios, materiales y apoyo académico en un solo lugar.
            </p>

            {/* Botón login (visible en móvil) */}
            <button
              onClick={handleLogin}
              className="mt-6 bg-[#00AEEF] text-white px-6 py-3 rounded-2xl text-base md:text-lg shadow hover:scale-105 transition md:hidden"
            >
              Ingresar con cuenta institucional
            </button>

          </section>
        </main>

      </div>
    </div>
  );
}

const root = ReactDOM.createRoot(document.getElementById("root"));
root.render(<App />);