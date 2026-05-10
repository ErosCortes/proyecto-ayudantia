import Navbar from "../components/LoginNavbar";

function LoginPage() {

  const handleGoogleLogin = () => {
    window.location.href =
      "http://localhost:8000/auth/login/google-oauth2/";
  };

  const handleNormalLogin = (e) => {
    e.preventDefault();

    alert("Próximamente disponible");
  };

  return (
    <div className="bg-gray-100 min-h-screen flex flex-col md:flex-row font-sans">

      {/* Sidebar */}
      <aside className="hidden md:flex w-72 bg-[#003057] text-white p-8 flex-col justify-between">

        <div>

          <h1 className="text-3xl font-bold">
            Portal de Ayudantías
          </h1>

          <p className="mt-4 text-gray-200 leading-relaxed">
            Plataforma para gestión de ayudantías,
            postulaciones y apoyo académico.
          </p>

        </div>

        
      </aside>

      {/* Main */}
      <div className="flex-1 flex flex-col">

        <Navbar />

        <main className="flex-1 flex items-center justify-center px-4 py-10">

          <section className="bg-white w-full max-w-md rounded-2xl shadow-lg p-8">

            {/* Logo Universidad */}
            <img
              src="/logoucn.png"
              alt="Logo UCN"
              className="w-28 mx-auto mb-4"
            />

            <h2 className="text-3xl font-bold text-[#003057] text-center">
              Iniciar Sesión
            </h2>

            <p className="text-center text-gray-500 mt-2 mb-8">
              Accede con tu cuenta institucional
            </p>

            <form
              onSubmit={handleNormalLogin}
              className="flex flex-col gap-4"
            >

              <div>

                <label className="block mb-2 text-sm font-medium text-gray-700">
                  Correo institucional
                </label>

                <input
                  type="email"
                  placeholder="correo@universidad.cl"
                  className="w-full border border-gray-300 rounded-xl px-4 py-3 focus:outline-none focus:ring-2 focus:ring-[#00AEEF]"
                />

              </div>

              <div>

                <label className="block mb-2 text-sm font-medium text-gray-700">
                  Contraseña
                </label>

                <input
                  type="password"
                  placeholder="********"
                  className="w-full border border-gray-300 rounded-xl px-4 py-3 focus:outline-none focus:ring-2 focus:ring-[#00AEEF]"
                />

              </div>

              <button
                type="submit"
                className="bg-[#003057] text-white py-3 rounded-xl font-semibold hover:opacity-90 transition"
              >
                Ingresar
              </button>

            </form>

            <div className="flex items-center gap-4 my-6">

              <div className="flex-1 h-px bg-gray-300"></div>

              <span className="text-gray-400 text-sm">
                o
              </span>

              <div className="flex-1 h-px bg-gray-300"></div>

            </div>

           <button
              onClick={handleGoogleLogin}
              className="w-full bg-[#003057] text-white py-3 rounded-xl font-semibold hover:opacity-90 transition relative flex items-center justify-center"
            >
              <img
                src="/logo-google.png"
                alt="Google"
                className="w-10 h-10 absolute left-1"
              />

              Continuar con Google

            </button>

          </section>

        </main>

      </div>

    </div>
  );
}

export default LoginPage;