import { useState } from "react";
import { useNavigate } from "react-router-dom";
import apiClient from "../config/apiClient";

function ChangePassword() {
  const navigate = useNavigate();
  const [oldPassword, setOldPassword] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [newPassword2, setNewPassword2] = useState("");
  const [error, setError] = useState(null);
  const [success, setSuccess] = useState(false);
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError(null);

    if (newPassword !== newPassword2) {
      setError("Las contraseñas nuevas no coinciden.");
      return;
    }

    setLoading(true);
    try {
      const res = await apiClient("/users/change_password/", {
        method: "POST",
        body: JSON.stringify({
          old_password: oldPassword,
          new_password: newPassword,
          new_password2: newPassword2,
        }),
      });

      if (res.ok) {
        setSuccess(true);
      } else {
        const data = await res.json();
        const msg = data?.new_password2?.[0] || data?.old_password?.[0] || data?.detail || data?.message || "Error al cambiar la contraseña";
        setError(msg);
      }
    } catch {
      setError("Error de conexión con el servidor.");
    } finally {
      setLoading(false);
    }
  };

  const goBack = () => navigate("../profile");

  return (
    <section>
      <h2 className="text-4xl font-bold text-[#003057]">Cambiar Contraseña</h2>

      <div className="bg-white rounded-2xl shadow-md p-6 mt-6">
        {success ? (
          <div className="text-center py-8">
            <p className="text-green-600 text-xl font-semibold mb-6">
              Contraseña cambiada exitosamente
            </p>
            <button
              onClick={goBack}
              className="bg-[#003057] text-white px-6 py-3 rounded-lg hover:bg-[#002244] transition-colors font-semibold"
            >
              Volver a mi perfil
            </button>
          </div>
        ) : (
          <form onSubmit={handleSubmit} className="max-w-md">
            <div className="mb-4">
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Contraseña actual
              </label>
              <input
                type="password"
                value={oldPassword}
                onChange={(e) => setOldPassword(e.target.value)}
                className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-[#003057]"
                required
              />
            </div>

            <div className="mb-4">
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Nueva contraseña
              </label>
              <input
                type="password"
                value={newPassword}
                onChange={(e) => setNewPassword(e.target.value)}
                className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-[#003057]"
                required
                minLength={6}
              />
            </div>

            <div className="mb-4">
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Confirmar nueva contraseña
              </label>
              <input
                type="password"
                value={newPassword2}
                onChange={(e) => setNewPassword2(e.target.value)}
                className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-[#003057]"
                required
                minLength={6}
              />
            </div>

            {error && (
              <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded mb-4">
                {error}
              </div>
            )}

            <div className="flex items-center gap-3">
              <button
                type="submit"
                disabled={loading}
                className="bg-[#003057] text-white px-6 py-3 rounded-lg hover:bg-[#002244] transition-colors font-semibold disabled:opacity-50"
              >
                {loading ? "Cambiando..." : "Cambiar Contraseña"}
              </button>
              <button
                type="button"
                onClick={goBack}
                className="text-gray-600 hover:text-gray-800 px-4 py-3 font-medium"
              >
                Volver
              </button>
            </div>
          </form>
        )}
      </div>
    </section>
  );
}

export default ChangePassword;
