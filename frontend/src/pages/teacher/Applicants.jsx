import { useState, useEffect } from "react";
import apiClient from "../../config/apiClient";

const ESTADO_STYLES = {
  COMPLETADA: "bg-green-100 text-green-800",
  INCOMPLETA: "bg-yellow-100 text-yellow-800",
  CANCELADA: "bg-red-100 text-red-800",
};

const OPCIONES_ORDEN = [
  { value: "prioridad", label: "Prioridad (PPA + nota curso)" },
  { value: "ppa", label: "Mejor PPA" },
  { value: "nota_curso", label: "Mejor nota en el curso" },
  { value: "fecha", label: "Postulación más antigua" },
  { value: "fecha_desc", label: "Postulación más reciente" },
  { value: "nombre", label: "Nombre (A-Z)" },
];

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

function AsignarSeccionModal({ postulation, courseSections, onAssign, onClose }) {
  const [selectedSection, setSelectedSection] = useState("");
  const [saving, setSaving] = useState(false);

  const handleAssign = async () => {
    if (!selectedSection) return;
    try {
      setSaving(true);
      const res = await apiClient(`/postulations/${postulation.id}/assign_section/`, {
        method: "POST",
        body: JSON.stringify({ seccion_id: parseInt(selectedSection) }),
      });
      if (!res.ok) {
        const err = await res.json();
        throw new Error(err.error || "Error al asignar sección");
      }
      onAssign(postulation.id);
      onClose();
    } catch (err) {
      alert(err.message);
    } finally {
      setSaving(false);
    }
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-2xl shadow-xl w-full max-w-md p-6">
        <h3 className="text-xl font-bold text-[#003057] mb-4">Asignar Sección</h3>
        <p className="text-gray-600 mb-4">
          Asigna un NRC a {postulation.alumno_nombre} para el curso {postulation.curso_nombre}.
        </p>
        <select
          value={selectedSection}
          onChange={(e) => setSelectedSection(e.target.value)}
          className="w-full border-2 border-gray-200 rounded-lg px-3 py-2 text-sm focus:outline-none focus:border-[#00AEEF] bg-white mb-4"
        >
          <option value="">Selecciona un NRC</option>
          {courseSections.map((sec) => (
            <option key={sec.id} value={sec.id}>
              NRC {sec.nrc} — {sec.profesor_nombre || "Sin profesor"}
            </option>
          ))}
        </select>
        <div className="flex justify-end gap-3">
          <button
            onClick={onClose}
            className="bg-gray-300 text-gray-700 px-4 py-2 rounded-lg hover:bg-gray-400 transition text-sm"
          >
            Cancelar
          </button>
          <button
            onClick={handleAssign}
            disabled={!selectedSection || saving}
            className="bg-[#003057] text-white px-4 py-2 rounded-lg hover:bg-[#004b87] transition text-sm disabled:opacity-50"
          >
            {saving ? "Asignando..." : "Asignar"}
          </button>
        </div>
      </div>
    </div>
  );
}

const TABS = [
  { key: "PENDIENTE", label: "Pendientes" },
  { key: "ACEPTADA", label: "Aceptados" },
];

function Applicants() {
  const [courses, setCourses] = useState([]);
  const [selectedCourse, setSelectedCourse] = useState(null);
  const [postulations, setPostulations] = useState([]);
  const [loadingCourses, setLoadingCourses] = useState(true);
  const [loadingPostulations, setLoadingPostulations] = useState(false);
  const [error, setError] = useState(null);
  const [modalAlumno, setModalAlumno] = useState(null);
  const [asignarModal, setAsignarModal] = useState(null);
  const [orden, setOrden] = useState("prioridad");
  const [sectionsByCourse, setSectionsByCourse] = useState({});
  const [tab, setTab] = useState("PENDIENTE");

  useEffect(() => {
    fetchCourses();
  }, []);

  useEffect(() => {
    if (selectedCourse) {
      fetchPostulations(selectedCourse, orden, tab);
      fetchSectionsForCourse(selectedCourse);
    } else {
      setPostulations([]);
    }
  }, [selectedCourse, orden, tab]);

  const fetchCourses = async () => {
    try {
      setLoadingCourses(true);
      const response = await apiClient("/courses/my_courses/");
      if (!response.ok) throw new Error("Error al obtener cursos");
      const data = await response.json();
      setCourses(data);
      if (data.length > 0) {
        setSelectedCourse(data[0].id);
      }
      setError(null);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoadingCourses(false);
    }
  };

  const fetchPostulations = async (courseId, criterioOrden, estado) => {
    try {
      setLoadingPostulations(true);
      const response = await apiClient(`/postulations/pending/?curso_id=${courseId}&orden=${criterioOrden}&estado=${estado}`);
      if (!response.ok) throw new Error("Error al obtener postulaciones");
      const data = await response.json();
      setPostulations(data);
      setError(null);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoadingPostulations(false);
    }
  };

  const fetchSectionsForCourse = async (courseId) => {
    try {
      const res = await apiClient(`/sections/by_course/?course_id=${courseId}`);
      if (!res.ok) return;
      const data = await res.json();
      setSectionsByCourse((prev) => ({ ...prev, [courseId]: data }));
    } catch (err) {
      console.error("Error al cargar secciones", err);
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

  const handleAccept = (postulation) => {
    updateStatus(postulation.id, "ACEPTADA");
  };

  const handleAssignSection = (postulation) => {
    setAsignarModal(postulation);
  };

  const onSectionAssigned = (postulationId) => {
    setPostulations((prev) => prev.filter((p) => p.id !== postulationId));
    setAsignarModal(null);
  };

  if (loadingCourses) {
    return (
      <div className="flex justify-center items-center min-h-screen">
        <p className="text-xl text-gray-600">Cargando cursos...</p>
      </div>
    );
  }

  if (error && courses.length === 0) {
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
      <p className="mt-4 text-gray-600">Selecciona un curso para ver sus postulantes.</p>

      {courses.length === 0 ? (
        <div className="bg-white rounded-2xl shadow-md p-6 mt-10 text-center">
          <p className="text-gray-600 text-lg">No tienes cursos asignados.</p>
        </div>
      ) : (
        <>
          {/* Selector de cursos */}
          <div className="mt-6 flex flex-wrap gap-3">
            {courses.map((course) => (
              <button
                key={course.id}
                onClick={() => setSelectedCourse(course.id)}
                className={`px-5 py-3 rounded-xl font-medium text-sm transition ${
                  selectedCourse === course.id
                    ? "bg-[#003057] text-white shadow-md"
                    : "bg-white text-gray-700 border border-gray-300 hover:border-[#003057]"
                }`}
              >
                {course.codigo_curso} — {course.nombre}
              </button>
            ))}
          </div>

          {/* Tabs: Pendientes / Aceptados */}
          <div className="mt-6 flex gap-2 border-b border-gray-200">
            {TABS.map((t) => (
              <button
                key={t.key}
                onClick={() => setTab(t.key)}
                className={`px-5 py-2 text-sm font-medium transition border-b-2 -mb-px ${
                  tab === t.key
                    ? "border-[#003057] text-[#003057]"
                    : "border-transparent text-gray-500 hover:text-gray-700"
                }`}
              >
                {t.label}
              </button>
            ))}
          </div>

          {/* Selector de orden */}
          <div className="mt-4 flex items-center gap-3">
            <label htmlFor="orden" className="text-gray-700 font-medium text-sm">
              Ordenar por:
            </label>
            <select
              id="orden"
              value={orden}
              onChange={(e) => setOrden(e.target.value)}
              className="border border-gray-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-[#004b87]"
            >
              {OPCIONES_ORDEN.map((op) => (
                <option key={op.value} value={op.value}>
                  {op.label}
                </option>
              ))}
            </select>
          </div>

          {loadingPostulations ? (
            <div className="flex justify-center items-center py-16">
              <p className="text-xl text-gray-600">Cargando postulantes...</p>
            </div>
          ) : postulations.length === 0 ? (
            <div className="bg-white rounded-2xl shadow-md p-6 mt-6 text-center">
              <p className="text-gray-600 text-lg">
                {tab === "PENDIENTE"
                  ? "No hay postulaciones pendientes para este curso."
                  : "No hay postulaciones aceptadas para este curso."}
              </p>
            </div>
          ) : (
            <div className="overflow-x-auto mt-6">
              <table className="w-full bg-white rounded-2xl shadow-md overflow-hidden">
                <thead className="bg-[#003057] text-white">
                  <tr>
                    <th className="text-left px-6 py-4">Nombre</th>
                    <th className="text-left px-6 py-4">RUT</th>
                    <th className="text-left px-6 py-4">PPA</th>
                    <th className="text-left px-6 py-4">Curso</th>
                    {tab === "ACEPTADA" && <th className="text-left px-6 py-4">NRC Asignado</th>}
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
                      {tab === "ACEPTADA" && (
                        <td className="px-6 py-4 text-gray-700">{p.seccion_asignada_nrc || "-"}</td>
                      )}
                      <td className="px-6 py-4">
                        <div className="flex gap-2 flex-wrap">
                          <button
                            onClick={() => setModalAlumno({ id: p.id_alumno, nombre: p.alumno_nombre, rut: p.alumno_rut })}
                            className="bg-[#004b87] text-white px-3 py-2 rounded-lg hover:bg-[#00AEEF] transition text-sm"
                          >
                            Ver historial
                          </button>
                          {tab === "PENDIENTE" && (
                            <>
                              <button
                                onClick={() => handleAccept(p)}
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
                            </>
                          )}
                          {tab === "ACEPTADA" && (
                            <button
                              onClick={() => handleAssignSection(p)}
                              className="bg-[#003057] text-white px-3 py-2 rounded-lg hover:bg-[#004b87] transition text-sm"
                            >
                              Asignar NRC
                            </button>
                          )}
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </>
      )}

      {modalAlumno && (
        <HistorialModal
          alumno={modalAlumno}
          onClose={() => setModalAlumno(null)}
        />
      )}

      {asignarModal && (
        <AsignarSeccionModal
          postulation={asignarModal}
          courseSections={sectionsByCourse[asignarModal.curso] || []}
          onAssign={onSectionAssigned}
          onClose={() => setAsignarModal(null)}
        />
      )}
    </section>
  );
}

export default Applicants;
