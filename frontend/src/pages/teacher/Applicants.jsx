import { useState, useEffect } from "react";
import apiClient from "../../config/apiClient";

function Applicants() {
  const [postulations, setPostulations] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    fetchPostulations();
  }, []);

  const fetchPostulations = async () => {
    try {
      setLoading(true);
      const response = await apiClient("/postulations/pending/");
      if (!response.ok) throw new Error("Error al obtener postulaciones");
      const data = await response.json();
      setPostulations(data);
      setError(null);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  const updateStatus = async (id, estado) => {
    try {
      const response = await apiClient(`/postulations/${id}/update_status/`, {
        method: "PATCH",
        body: JSON.stringify({ estado }),
      });
      if (!response.ok) throw new Error("Error al actualizar estado");
      setPostulations((prev) => prev.filter((p) => p.id !== id));
    } catch (err) {
      alert(err.message);
    }
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center min-h-screen">
        <p className="text-xl text-gray-600">Cargando postulantes...</p>
      </div>
    );
  }

  if (error) {
    return (
      <section>
        <h2 className="text-4xl font-bold text-[#003057]">Postulantes</h2>
        <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded mt-6">{error}</div>
      </section>
    );
  }

  return (
    <section>
      <h2 className="text-4xl font-bold text-[#003057]">Postulantes</h2>
      <p className="mt-4 text-gray-600">Revisa y gestiona los estudiantes postulados.</p>

      {postulations.length === 0 ? (
        <div className="bg-white rounded-2xl shadow-md p-6 mt-10 text-center">
          <p className="text-gray-600 text-lg">No hay postulaciones pendientes.</p>
        </div>
      ) : (
        <div className="overflow-x-auto mt-10">
          <table className="w-full bg-white rounded-2xl shadow-md overflow-hidden">
            <thead className="bg-[#003057] text-white">
              <tr>
                <th className="text-left px-6 py-4">Nombre</th>
                <th className="text-left px-6 py-4">RUT</th>
                <th className="text-left px-6 py-4">PPA</th>
                <th className="text-left px-6 py-4">Asignatura</th>
                <th className="text-left px-6 py-4">NRC</th>
                <th className="text-left px-6 py-4">Acción</th>
              </tr>
            </thead>
            <tbody>
              {postulations.map((p) => (
                <tr key={p.id} className="border-b hover:bg-gray-50">
                  <td className="px-6 py-4 font-medium">{p.alumno_nombre}</td>
                  <td className="px-6 py-4 text-gray-700">{p.alumno_rut}</td>
                  <td className="px-6 py-4">{p.alumno_ppa ?? "-"}</td>
                  <td className="px-6 py-4">{p.curso_nombre}</td>
                  <td className="px-6 py-4 text-gray-700">{p.seccion_nrc}</td>
                  <td className="px-6 py-4 flex gap-2">
                    <button
                      onClick={() => updateStatus(p.id, "ACEPTADA")}
                      className="bg-green-600 text-white px-4 py-2 rounded-lg hover:bg-green-700 transition"
                    >
                      Aceptar
                    </button>
                    <button
                      onClick={() => updateStatus(p.id, "RECHAZADA")}
                      className="bg-red-600 text-white px-4 py-2 rounded-lg hover:bg-red-700 transition"
                    >
                      Rechazar
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </section>
  );
}

export default Applicants;
