import { useState, useEffect } from "react";

function StudentTutorshipHistory() {
  const [tutorships, setTutorships] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    fetchHistory();
  }, []);

  const fetchHistory = async () => {
    try {
      setLoading(true);
      const response = await fetch("http://localhost:8000/users/tutorship-history/", {
        method: "GET",
        credentials: "include",
        headers: {
          "Content-Type": "application/json",
        },
      });

      if (!response.ok) {
        throw new Error("Error al obtener el historial");
      }

      const data = await response.json();
      setTutorships(data);
      setError(null);
    } catch (err) {
      setError(err.message);
      console.error("Error:", err);
    } finally {
      setLoading(false);
    }
  };

  const getStatusBadge = (status) => {
    const statusMap = {
      'ACTIVE': { bg: 'bg-green-100', text: 'text-green-800', label: 'Activa' },
      'COMPLETED': { bg: 'bg-blue-100', text: 'text-blue-800', label: 'Completada' },
      'CANCELLED': { bg: 'bg-red-100', text: 'text-red-800', label: 'Cancelada' },
    };
    const config = statusMap[status] || statusMap['ACTIVE'];
    return `${config.bg} ${config.text}`;
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center min-h-screen">
        <p className="text-xl text-gray-600">Cargando historial...</p>
      </div>
    );
  }

  return (
    <div className="bg-white rounded-lg shadow-lg p-6">
      <h1 className="text-3xl font-bold text-[#003057] mb-6">
        Cursos donde soy Ayudante
      </h1>

      {error && (
        <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded mb-4">
          {error}
        </div>
      )}

      {tutorships.length === 0 ? (
        <div className="text-center py-8">
          <p className="text-gray-600 text-lg">No estás asignado como ayudante en ningún curso</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {tutorships.map((tutorship) => (
            <div
              key={tutorship.id}
              className="border-2 border-[#004b87] rounded-lg p-4 hover:shadow-lg transition"
            >
              <div className="mb-3">
                <h3 className="text-lg font-bold text-[#003057] mb-1">
                  {tutorship.course}
                </h3>
                <p className="text-sm font-semibold text-gray-600">
                  Código: {tutorship.course_code}
                </p>
              </div>

              <div className="mb-3">
                <span className={`inline-block px-3 py-1 rounded-full text-sm font-semibold ${getStatusBadge(tutorship.status)}`}>
                  {tutorship.status === 'ACTIVE' ? 'Activa' : tutorship.status === 'COMPLETED' ? 'Completada' : 'Cancelada'}
                </span>
              </div>

              <div className="text-sm text-gray-700 mb-3">
                <p className="mb-1">
                  <strong>Profesor:</strong> {tutorship.teacher}
                </p>
                {tutorship.start_date && (
                  <p className="mb-1">
                    <strong>Inicio:</strong> {new Date(tutorship.start_date).toLocaleDateString("es-CL")}
                  </p>
                )}
                {tutorship.end_date && (
                  <p className="mb-1">
                    <strong>Fin:</strong> {new Date(tutorship.end_date).toLocaleDateString("es-CL")}
                  </p>
                )}
              </div>

              {tutorship.description && (
                <p className="text-sm text-gray-600 bg-gray-50 p-2 rounded mb-3 border-l-4 border-[#00AEEF]">
                  {tutorship.description}
                </p>
              )}

              <p className="text-xs text-gray-500">
                Asignado: {new Date(tutorship.created_at).toLocaleDateString("es-CL")}
              </p>
            </div>
          ))}
        </div>
      )}

      <div className="mt-6">
        <button
          onClick={fetchHistory}
          className="bg-[#003057] text-white px-4 py-2 rounded-lg hover:bg-[#004b87] transition"
        >
          Actualizar
        </button>
      </div>
    </div>
  );
}

export default StudentTutorshipHistory;
