import { useState, useEffect } from "react";
import apiClient from "../../config/apiClient";

function StudentTutorshipHistory() {
  const [history, setHistory] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    fetchHistory();
  }, []);

  const fetchHistory = async () => {
    try {
      setLoading(true);
      const response = await apiClient("/history/my_history/");

      if (!response.ok) {
        throw new Error("Error al obtener el historial");
      }

      const data = await response.json();
      setHistory(data);
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
      'COMPLETADA': { bg: 'bg-green-100', text: 'text-green-800', label: 'Completada' },
      'INCOMPLETA': { bg: 'bg-yellow-100', text: 'text-yellow-800', label: 'Incompleta' },
      'CANCELADA': { bg: 'bg-red-100', text: 'text-red-800', label: 'Cancelada' },
    };
    const config = statusMap[status] || statusMap['INCOMPLETA'];
    return `${config.bg} ${config.text}`;
  };

  const getStatusLabel = (status) => {
    const labels = {
      'COMPLETADA': 'Completada',
      'INCOMPLETA': 'Incompleta',
      'CANCELADA': 'Cancelada',
    };
    return labels[status] || status;
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
        Historial de Ayudantías
      </h1>

      {error && (
        <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded mb-4">
          {error}
        </div>
      )}

      {history.length === 0 ? (
        <div className="text-center py-8">
          <p className="text-gray-600 text-lg">No tienes historial de ayudantías</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {history.map((record) => (
            <div
              key={record.id}
              className="border-2 border-[#004b87] rounded-lg p-4 hover:shadow-lg transition"
            >
              <div className="mb-3">
                <h3 className="text-lg font-bold text-[#003057] mb-1">
                  {record.curso_nombre}
                </h3>
                <p className="text-sm font-semibold text-gray-600">
                  Sección: {record.seccion_numero}
                </p>
              </div>

              <div className="mb-3">
                <span className={`inline-block px-3 py-1 rounded-full text-sm font-semibold ${getStatusBadge(record.estado_final)}`}>
                  {getStatusLabel(record.estado_final)}
                </span>
              </div>

              <div className="text-sm text-gray-700 mb-3">
                <p className="mb-1">
                  <strong>Semestre:</strong> {record.semestre}
                </p>
              </div>

              <p className="text-xs text-gray-500">
                Registrado: {new Date(record.created_at).toLocaleDateString("es-CL")}
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
