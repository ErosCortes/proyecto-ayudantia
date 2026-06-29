import { useState, useEffect } from "react";
import apiClient from "../../config/apiClient";

const ESTADO_STYLES = {
  COMPLETADA: "bg-green-100 text-green-800",
  INCOMPLETA: "bg-yellow-100 text-yellow-800",
  CANCELADA: "bg-red-100 text-red-800",
};

function HistorialModal({ alumno, onClose }) {
  const [history, setHistory] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchHistory = async () => {
      try {
        const res = await apiClient(`/history/by_student/?student_id=${alumno.id}`);
        if (!res.ok) throw new Error("Error al cargar el historial");
        const data = await res.json();
        setHistory(data);
      } catch (err) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };
    fetchHistory();
  }, [alumno.id]);

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-2xl shadow-xl w-full max-w-2xl max-h-[80vh] flex flex-col">
        {/* Header */}
        <div className="flex items-center justify-between p-6 border-b border-gray-200">
          <div>
            <h3 className="text-xl font-bold text-[#003057]">Historial de Ayudantías</h3>
            <p className="text-gray-500 text-sm mt-1">{alumno.nombre} · {alumno.rut}</p>
          </div>
          <button
            onClick={onClose}
            className="text-gray-400 hover:text-gray-600 text-2xl font-bold leading-none"
          >
            ×
          </button>
        </div>

        {/* Body */}
        <div className="p-6 overflow-y-auto">
          {loading && <p className="text-gray-500 text-center py-8">Cargando historial...</p>}
          {error && <p className="text-red-600 text-center py-8">{error}</p>}

          {!loading && !error && history.length === 0 && (
            <p className="text-gray-500 text-center py-8">
              Este alumno no tiene ayudantías registradas.
            </p>
          )}

          {!loading && !error && history.length > 0 && (
            <table className="w-full text-left">
              <thead>
                <tr className="border-b-2 border-[#004b87]">
                  <th className="py-3 px-3 font-bold text-[#003057] text-sm">Curso</th>
                  <th className="py-3 px-3 font-bold text-[#003057] text-sm">NRC</th>
                  <th className="py-3 px-3 font-bold text-[#003057] text-sm">Semestre</th>
                  <th className="py-3 px-3 font-bold text-[#003057] text-sm">Estado</th>
                </tr>
              </thead>
              <tbody>
                {history.map((item) => (
                  <tr key={item.id} className="border-b border-gray-100 hover:bg-gray-50">
                    <td className="py-3 px-3 text-gray-700 text-sm">{item.curso_nombre}</td>
                    <td className="py-3 px-3 text-gray-500 text-sm">{item.seccion_nrc}</td>
                    <td className="py-3 px-3 text-gray-700 text-sm">{item.semestre}</td>
                    <td className="py-3 px-3">
                      <span className={`inline-block px-2 py-1 rounded-full text-xs font-semibold ${ESTADO_STYLES[item.estado_final] || "bg-gray-100 text-gray-700"}`}>
                        {item.estado_final}
                      </span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          )}
        </div>

        <div className="px-6 py-4 border-t border-gray-200 text-right">
          <button
            onClick={onClose}
            className="bg-[#003057] text-white px-5 py-2 rounded-lg hover:bg-[#004b87] transition text-sm"
          >
            Cerrar
          </button>
        </div>
      </div>
    </div>
  );
}

function Applicants() {
  const [postulations, setPostulations] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [modalAlumno, setModalAlumno] = useState(null);

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
                  <td className="px-6 py-4">
                    <div className="flex gap-2 flex-wrap">
                      <button
                        onClick={() => setModalAlumno({ id: p.id_alumno, nombre: p.alumno_nombre, rut: p.alumno_rut })}
                        className="bg-[#004b87] text-white px-3 py-2 rounded-lg hover:bg-[#00AEEF] transition text-sm"
                      >
                        Ver historial
                      </button>
                      <button
                        onClick={() => updateStatus(p.id, "ACEPTADA")}
                        className="bg-green-600 text-white px-3 py-2 rounded-lg hover:bg-green-700 transition text-sm"
                      >
                        Aceptar
                      </button>
                      <button
                        onClick={() => updateStatus(p.id, "RECHAZADA")}
                        className="bg-red-600 text-white px-3 py-2 rounded-lg hover:bg-red-700 transition text-sm"
                      >
                        Rechazar
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

      {modalAlumno && (
        <HistorialModal
          alumno={modalAlumno}
          onClose={() => setModalAlumno(null)}
        />
      )}
    </section>
  );
}

export default Applicants;
