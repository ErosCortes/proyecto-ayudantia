import Navbar from "../components/Navbar";

function LoginPage() {
  const handleLogin = () => {
    window.location.href =
      "http://localhost:8000/auth/login/google-oauth2/";
  };

  return (
    <div className="bg-gray-100 font-sans flex flex-col md:flex-row min-h-screen">

      {/* Sidebar desktop */}
      <aside className="hidden md:flex w-64 bg-[#003057] text-white p-6 flex-col gap-6">

        <h2 className="text-2xl font-bold">
          Acceso
        </h2>

        <button
          onClick={handleLogin}
          className="bg-[#00AEEF] py-3 rounded-xl font-semibold hover:opacity-80"
        >
          Ingresar con cuenta institucional
        </button>

      </aside>

      {/* Contenido principal */}
      <div className="flex-1 flex flex-col">

        <Navbar />

        {/* Hero */}
        <main className="flex-1 flex items-center justify-center">

          <section className="bg-white py-12 md:py-16 text-center px-6 rounded-xl shadow-md mx-4">

            <h2 className="text-3xl md:text-5xl font-bold text-[#003057]">
              Portal de Ayudantías
            </h2>

            <p className="mt-4 text-gray-600 text-base md:text-lg">
              Encuentra horarios, materiales y apoyo académico en un solo lugar.
            </p>

            {/* Botón móvil */}
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

export default LoginPage;