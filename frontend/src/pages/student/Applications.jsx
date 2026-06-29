import { useState, useEffect } from "react";
import apiClient from "../../config/apiClient";

function Applications() {
  const [applications, setApplications] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    fetchMyApplications();
  }, []);

  const fetchMyApplications = async () => {
    try {
      setLoading(true);
      const response = await apiClient("/postulations/my_applications/");

      if (!response.ok) {
        throw new Error("Error al obtener postulaciones");
      }

      const data = await response.json();
      setApplications(data);
      setError(null);
    } catch (err) {
      setError(err.message);
      console.error("Error:", err);
    } finally {
      setLoading(false);
    }
  };

  const getStatusStyle = (status) => {
    switch (status) {
      case "ACEPTADA":
        return "bg-green-100 text-green-700";

      case "RECHAZADA":
        return "bg-red-100 text-red-700";

      default:
        return "bg-yellow-100 text-yellow-700";
    }
  };

  const getStatusLabel = (status) => {
    const labels = {
      "PENDIENTE": "Pendiente",
      "ACEPTADA": "Aceptada",
      "RECHAZADA": "Rechazada",
    };
    return labels[status] || status;
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center min-h-screen">
        <p className="text-xl text-gray-600">Cargando postulaciones...</p>
      </div>
    );
  }

  return (
    <section>

      <h2 className="text-4xl font-bold text-[#003057]">
        Mis Postulaciones
      </h2>

      <p className="mt-4 text-gray-600">
        Estado de tus postulaciones realizadas.
      </p>

      {error && (
        <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded mt-4 mb-4">
          {error}
        </div>
      )}

      {applications.length === 0 ? (
        <div className="text-center py-8 mt-10">
          <p className="text-gray-600 text-lg">No tienes postulaciones realizadas</p>
        </div>
      ) : (
        <div className="overflow-x-auto mt-10">

          <table className="w-full bg-white rounded-2xl shadow-md overflow-hidden">

            <thead className="bg-[#003057] text-white">

              <tr>

                <th className="text-left px-6 py-4">
                  Asignatura
                </th>

                <th className="text-left px-6 py-4">
                  Sección
                </th>

                <th className="text-left px-6 py-4">
                  Estado
                </th>

                <th className="text-left px-6 py-4">
                  Fecha
                </th>

              </tr>

            </thead>

            <tbody>

              {applications.map((application) => (
                <tr
                  key={application.id}
                  className="border-b"
                >

                  <td className="px-6 py-4">
                    {application.curso_nombre}
                  </td>

                  <td className="px-6 py-4">
                    {application.seccion_numero}
                  </td>

                  <td className="px-6 py-4">

                    <span
                      className={`px-3 py-1 rounded-full text-sm font-semibold ${getStatusStyle(application.estado)}`}
                    >
                      {getStatusLabel(application.estado)}
                    </span>

                  </td>

                  <td className="px-6 py-4">
                    {new Date(application.fecha_creacion).toLocaleDateString("es-CL")}
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

export default Applications;