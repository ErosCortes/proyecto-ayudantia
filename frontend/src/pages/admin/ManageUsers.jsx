import { useState } from "react";
import apiClient from "../../config/apiClient";

function ManageUsers() {
  const [rut, setRut] = useState("");
  const [nombre, setNombre] = useState("");
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState(null);
  const [error, setError] = useState(null);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError(null);
    setResult(null);

    if (!rut.trim()) {
      setError("El RUT es requerido");
      return;
    }

    try {
      setLoading(true);
      const response = await apiClient("/users/create_teacher/", {
        method: "POST",
        body: JSON.stringify({
          rut: rut.trim(),
          nombre_completo: nombre.trim(),
        }),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || "Error al crear profesor");
      }

      setResult(data);
      setRut("");
      setNombre("");
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="bg-white rounded-lg shadow-lg p-6">
      <h1 className="text-3xl font-bold text-[#003057] mb-6">
        Gestionar Usuarios
      </h1>

      {error && (
        <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded mb-4">
          {error}
        </div>
      )}

      {result && (
        <div className="bg-green-100 border border-green-400 text-green-700 px-4 py-3 rounded mb-4">
          <p className="font-bold">Profesor creado exitosamente</p>
          <p className="mt-1">RUT: {result.user.rut}</p>
          <p>Nombre: {result.user.nombre_completo}</p>
          <p>Contraseña: {result.password}</p>
          {result.sync_secciones > 0 && (
            <p>Secciones sincronizadas: {result.sync_secciones}</p>
          )}
          {result.error_sync && (
            <p className="text-yellow-700 mt-1">Advertencia: {result.error_sync}</p>
          )}
        </div>
      )}

      <div className="bg-gray-50 border-2 border-[#003057] rounded-lg p-6 mb-6">
        <h2 className="text-xl font-bold text-[#003057] mb-4">
          Crear Profesor desde API UCN
        </h2>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-gray-700 font-semibold mb-2">
              RUT del Profesor *
            </label>
            <input
              type="text"
              value={rut}
              onChange={(e) => setRut(e.target.value)}
              className="w-full px-4 py-2 border-2 border-gray-300 rounded-lg focus:outline-none focus:border-[#00AEEF]"
              placeholder="Ej: 6543250-1 (con guión)"
            />
          </div>

          <div>
            <label className="block text-gray-700 font-semibold mb-2">
              Nombre Completo (opcional)
            </label>
            <input
              type="text"
              value={nombre}
              onChange={(e) => setNombre(e.target.value)}
              className="w-full px-4 py-2 border-2 border-gray-300 rounded-lg focus:outline-none focus:border-[#00AEEF]"
              placeholder="Ej: Juan Pérez"
            />
          </div>

          <button
            type="submit"
            disabled={loading}
            className="bg-[#003057] text-white px-6 py-2 rounded-lg hover:bg-[#004b87] transition disabled:opacity-50"
          >
            {loading ? "Creando..." : "Crear Profesor"}
          </button>
        </form>
      </div>

      {result && result.sections && result.sections.length > 0 && (
        <div>
          <h2 className="text-2xl font-bold text-[#003057] mb-4">
            Secciones Asignadas
          </h2>
          <div className="overflow-x-auto">
            <table className="w-full text-left">
              <thead>
                <tr className="border-b-2 border-[#004b87]">
                  <th className="py-3 px-4 font-bold text-[#003057]">NRC</th>
                  <th className="py-3 px-4 font-bold text-[#003057]">Curso</th>
                  <th className="py-3 px-4 font-bold text-[#003057]">Semestre</th>
                </tr>
              </thead>
              <tbody>
                {result.sections.map((s) => (
                  <tr key={s.id} className="border-b border-gray-200 hover:bg-gray-50">
                    <td className="py-3 px-4 text-gray-700">{s.nrc}</td>
                    <td className="py-3 px-4 text-gray-700">{s.course_nombre}</td>
                    <td className="py-3 px-4 text-gray-700">{s.semestre} {s.year}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}
    </div>
  );
}

export default ManageUsers;
