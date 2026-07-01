import { useState, useEffect, useCallback } from "react";
import apiClient from "../../config/apiClient";

const ESTADO_STYLES = {
  COMPLETADA: "bg-green-100 text-green-800",
  INCOMPLETA: "bg-yellow-100 text-yellow-800",
  CANCELADA: "bg-red-100 text-red-800",
};

const ESTADOS = ["", "COMPLETADA", "INCOMPLETA", "CANCELADA"];

function HistorialAyudantias() {
  const [history, setHistory] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const [filtroAlumno, setFiltroAlumno] = useState("");
  const [filtroSemestre, setFiltroSemestre] = useState("");
  const [filtroEstado, setFiltroEstado] = useState("");
  const [filtroCurso, setFiltroCurso] = useState("");

  const fetchHistory = useCallback(async () => {
    try {
      setLoading(true);
      const params = new URLSearchParams();
      if (filtroAlumno)   params.append("alumno", filtroAlumno);
      if (filtroSemestre) params.append("semestre", filtroSemestre);
      if (filtroEstado)   params.append("estado", filtroEstado);
      if (filtroCurso)    params.append("curso", filtroCurso);

      const query = params.toString() ? `?${params.toString()}` : "";
      const res = await apiClient(`/history/all_history/${query}`);
      if (!res.ok) throw new Error("Error al cargar el historial");
      const data = await res.json();
      setHistory(data);
      setError(null);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  }, [filtroAlumno, filtroSemestre, filtroEstado, filtroCurso]);

  useEffect(() => {
    fetchHistory();
  }, [fetchHistory]);

  const handleLimpiar = () => {
    setFiltroAlumno("");
    setFiltroSemestre("");
    setFiltroEstado("");
    setFiltroCurso("");
  };

  const semestresUnicos = [...new Set(history.map((h) => h.semestre))].sort().reverse();

  return (
    <section>
      <h2 className="text-4xl font-bold text-[#003057]">Historial de Ayudantías</h2>
      <p className="mt-2 text-gray-500">Consulta y filtra todos los registros del sistema.</p>

      {/* Filtros */}
      <div className="bg-white rounded-2xl shadow-md p-6 mt-6">
        <h3 className="text-lg font-bold text-[#003057] mb-4">Filtros</h3>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
          <div>
            <label className="block text-sm text-gray-600 mb-1 font-medium">Alumno (nombre o RUT)</label>
            <input
              type="text"
              value={filtroAlumno}
              onChange={(e) => setFiltroAlumno(e.target.value)}
              placeholder="Buscar alumno..."
              className="w-full border-2 border-gray-200 rounded-lg px-3 py-2 text-sm focus:outline-none focus:border-[#00AEEF]"
            />
          </div>
          <div>
            <label className="block text-sm text-gray-600 mb-1 font-medium">Semestre</label>
            <input
              type="text"
              value={filtroSemestre}
              onChange={(e) => setFiltroSemestre(e.target.value)}
              placeholder="Ej: 2024-1"
              className="w-full border-2 border-gray-200 rounded-lg px-3 py-2 text-sm focus:outline-none focus:border-[#00AEEF]"
            />
          </div>
          <div>
            <label className="block text-sm text-gray-600 mb-1 font-medium">Estado</label>
            <select
              value={filtroEstado}
              onChange={(e) => setFiltroEstado(e.target.value)}
              className="w-full border-2 border-gray-200 rounded-lg px-3 py-2 text-sm focus:outline-none focus:border-[#00AEEF] bg-white"
            >
              {ESTADOS.map((e) => (
                <option key={e} value={e}>{e || "Todos"}</option>
              ))}
            </select>
          </div>
          <div>
            <label className="block text-sm text-gray-600 mb-1 font-medium">Curso</label>
            <input
              type="text"
              value={filtroCurso}
              onChange={(e) => setFiltroCurso(e.target.value)}
              placeholder="Nombre del curso..."
              className="w-full border-2 border-gray-200 rounded-lg px-3 py-2 text-sm focus:outline-none focus:border-[#00AEEF]"
            />
          </div>
        </div>
        <div className="mt-4 flex gap-3">
          <button
            onClick={handleLimpiar}
            className="px-4 py-2 text-sm rounded-lg border-2 border-gray-300 text-gray-600 hover:border-[#003057] hover:text-[#003057] transition"
          >
            Limpiar filtros
          </button>
          <span className="text-sm text-gray-400 self-center">
            {loading ? "Buscando..." : `${history.length} resultado${history.length !== 1 ? "s" : ""}`}
          </span>
        </div>
      </div>

      {/* Tabla */}
      <div className="bg-white rounded-2xl shadow-md mt-6 overflow-hidden">
        {error && (
          <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 m-4 rounded">
            {error}
          </div>
        )}

        {loading ? (
          <div className="flex justify-center items-center py-16">
            <p className="text-gray-500">Cargando historial...</p>
          </div>
        ) : history.length === 0 ? (
          <div className="flex justify-center items-center py-16">
            <p className="text-gray-500">No se encontraron registros con los filtros aplicados.</p>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-left">
              <thead className="bg-[#003057] text-white">
                <tr>
                  <th className="px-6 py-4 font-semibold">Alumno</th>
                  <th className="px-6 py-4 font-semibold">RUT</th>
                  <th className="px-6 py-4 font-semibold">Curso</th>
                  <th className="px-6 py-4 font-semibold">NRC</th>
                  <th className="px-6 py-4 font-semibold">Semestre</th>
                  <th className="px-6 py-4 font-semibold">Estado</th>
                </tr>
              </thead>
              <tbody>
                {history.map((item) => (
                  <tr key={item.id} className="border-b border-gray-100 hover:bg-gray-50">
                    <td className="px-6 py-4 font-medium text-gray-800">{item.alumno_nombre}</td>
                    <td className="px-6 py-4 text-gray-500 text-sm">{item.alumno_rut}</td>
                    <td className="px-6 py-4 text-gray-700">{item.curso_nombre}</td>
                    <td className="px-6 py-4 text-gray-500 text-sm">{item.seccion_nrc}</td>
                    <td className="px-6 py-4 text-gray-700">{item.semestre}</td>
                    <td className="px-6 py-4">
                      <span className={`inline-block px-2 py-1 rounded-full text-xs font-semibold ${ESTADO_STYLES[item.estado_final] || "bg-gray-100 text-gray-700"}`}>
                        {item.estado_final}
                      </span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </section>
  );
}

export default HistorialAyudantias;
