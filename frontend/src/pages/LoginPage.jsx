import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import Navbar from "../components/Navbar";

const ROUTES = {
  admin: "/admin",
  teacher: "/teacher",
  student: "/student",
};

function LoginPage() {
  const { login, register, isAuthenticated, profileType } = useAuth();
  const navigate = useNavigate();

  const [isRegister, setIsRegister] = useState(false);
  const [rut, setRut] = useState("");
  const [password, setPassword] = useState("");
  const [password2, setPassword2] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  if (isAuthenticated && profileType) {
    const route = ROUTES[profileType] || "/student";
    navigate(route, { replace: true });
    return null;
  }

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    setLoading(true);

    try {
      let data;
      if (isRegister) {
        data = await register(rut, password, password2);
      } else {
        data = await login(rut, password);
      }
      const route = ROUTES[data.profile_type] || "/student";
      navigate(route, { replace: true });
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="bg-gray-100 font-sans flex flex-col md:flex-row min-h-screen">
      <aside className="hidden md:flex w-64 bg-[#003057] text-white p-6 flex-col gap-6">
        <h2 className="text-2xl font-bold">Acceso</h2>
      </aside>

      <div className="flex-1 flex flex-col">
        <Navbar />

        <main className="flex-1 flex items-center justify-center">
          <section className="bg-white py-8 md:py-12 px-8 rounded-xl shadow-md mx-4 w-full max-w-md">
            <h2 className="text-3xl font-bold text-[#003057] text-center">
              {isRegister ? "Crear cuenta" : "Iniciar sesion"}
            </h2>

            {error && (
              <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded mt-4">
                {error}
              </div>
            )}

            <form onSubmit={handleSubmit} className="mt-6 flex flex-col gap-4">
              <div>
                <label className="block text-gray-700 text-sm font-semibold mb-1">RUT</label>
                <input
                  type="text"
                  placeholder="11111111-1"
                  value={rut}
                  onChange={(e) => setRut(e.target.value)}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#00AEEF]"
                  required
                />
              </div>

              <div>
                <label className="block text-gray-700 text-sm font-semibold mb-1">Contrasena</label>
                <input
                  type="password"
                  placeholder="••••••••"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#00AEEF]"
                  required
                  minLength={6}
                />
              </div>

              {isRegister && (
                <div>
                  <label className="block text-gray-700 text-sm font-semibold mb-1">Confirmar contrasena</label>
                  <input
                    type="password"
                    placeholder="••••••••"
                    value={password2}
                    onChange={(e) => setPassword2(e.target.value)}
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#00AEEF]"
                    required
                    minLength={6}
                  />
                </div>
              )}

              <button
                type="submit"
                disabled={loading}
                className="bg-[#00AEEF] text-white py-3 rounded-xl font-semibold hover:opacity-80 disabled:opacity-50 mt-2"
              >
                {loading ? "Cargando..." : isRegister ? "Crear cuenta" : "Ingresar"}
              </button>
            </form>

            <p className="mt-4 text-center text-sm text-gray-600">
              {isRegister ? "Ya tienes cuenta?" : "No tienes cuenta?"}{" "}
              <button
                onClick={() => { setIsRegister(!isRegister); setError(""); }}
                className="text-[#00AEEF] font-semibold hover:underline"
              >
                {isRegister ? "Inicia sesion" : "Registrate aqui"}
              </button>
            </p>
          </section>
        </main>
      </div>
    </div>
  );
}

export default LoginPage;
