import { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import apiClient from "../../config/apiClient";


function ManageTutorships() {
  const [sections, setSections] = useState([]);
  const [selectedSection, setSelectedSection] = useState(null);
  const [aceptados, setAceptados] = useState([]);
  const [loading, setLoading] = useState(true);
  const [loadingAceptados, setLoadingAceptados] = useState(false);
  const [error, setError] = useState(null);

  useEffect(() => {
    fetchSections();
  }, []);

  useEffect(() => {
    if (selectedSection) {
      fetchAceptados(selectedSection);
    } else {
      setAceptados([]);
    }
  }, [selectedSection]);

  const fetchSections = async () => {
    try {
      setLoading(true);
      const response = await apiClient("/sections/my_sections/");
      if (!response.ok) throw new Error("Error al obtener secciones");
      const data = await response.json();
      setSections(data);
      if (data.length > 0) setSelectedSection(data[0].id);
      setError(null);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  const fetchAceptados = async (sectionId) => {
    try {
      setLoadingAceptados(true);
      const res = await apiClient(`/postulations/accepted/?section_id=${sectionId}`);
      if (!res.ok) throw new Error("Error al obtener ayudantes aceptados");
      const data = await res.json();
      setAceptados(data);
    } catch (err) {
      console.error(err.message);
    } finally {
      setLoadingAceptados(false);
    }
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center min-h-screen">
        <p className="text-xl text-gray-600">Cargando secciones...</p>
      </div>
    );
  }

  if (error) {
    return (
      <section>
        <h2 className="text-4xl font-bold text-[#003057]">Gestionar Ayudantías</h2>
        <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded mt-6">{error}</div>
      </section>
    );
  }

  const seccionActual = sections.find((s) => s.id === selectedSection);

  return (
    <section>
      <h2 className="text-4xl font-bold text-[#003057]">Gestionar Ayudantías</h2>
      <p className="mt-2 text-gray-500">Revisa los ayudantes aceptados por sección.</p>

      {sections.length === 0 ? (
        <div className="bg-white rounded-2xl shadow-md p-6 mt-10 text-center">
          <p className="text-gray-600 text-lg">No tienes secciones asignadas.</p>
        </div>
      ) : (
        <>
          {/* Selector de secciones */}
          <div className="mt-6 flex flex-wrap gap-3">
            {sections.map((sec) => (
              <button
                key={sec.id}
                onClick={() => setSelectedSection(sec.id)}
                className={`px-5 py-3 rounded-xl font-medium text-sm transition ${
                  selectedSection === sec.id
                    ? "bg-[#003057] text-white shadow-md"
                    : "bg-white text-gray-700 border border-gray-300 hover:border-[#003057]"
                }`}
              >
                {sec.course_nombre}
                <span className="ml-2 text-xs opacity-75">NRC {sec.nrc}</span>
              </button>
            ))}
          </div>

          {/* Info de la sección + link a postulantes */}
          {seccionActual && (
            <div className="bg-white rounded-2xl shadow-md p-6 mt-6 flex items-center justify-between flex-wrap gap-4">
              <div>
                <h3 className="text-xl font-bold text-[#003057]">{seccionActual.course_nombre}</h3>
                <p className="text-gray-500 text-sm mt-1">
                  NRC {seccionActual.nrc} · Semestre {seccionActual.semestre} {seccionActual.year}
                </p>
                <p className="text-gray-500 text-sm">
                  Postulantes pendientes: <strong>{seccionActual.postulantes_pendientes}</strong>
                </p>
              </div>
              <Link
                to="/teacher/applicants"
                className="bg-[#00AEEF] text-white px-5 py-3 rounded-xl hover:opacity-80 transition text-sm font-medium"
              >
                Ver Postulantes Pendientes
              </Link>
            </div>
          )}

          {/* Tabla de ayudantes aceptados */}
          <div className="bg-white rounded-2xl shadow-md p-6 mt-6">
            <h3 className="text-xl font-bold text-[#003057] mb-4">
              Ayudantes Aceptados
            </h3>

            {loadingAceptados ? (
              <p className="text-gray-500 text-center py-8">Cargando ayudantes...</p>
            ) : aceptados.length === 0 ? (
              <p className="text-gray-500 text-center py-8">
                No hay ayudantes aceptados para esta sección aún.
              </p>
            ) : (
              <div className="overflow-x-auto">
                <table className="w-full text-left">
                  <thead>
                    <tr className="border-b-2 border-[#004b87]">
                      <th className="py-3 px-4 font-bold text-[#003057]">Nombre</th>
                      <th className="py-3 px-4 font-bold text-[#003057]">RUT</th>
                      <th className="py-3 px-4 font-bold text-[#003057]">PPA</th>
                      <th className="py-3 px-4 font-bold text-[#003057]">Fecha aceptación</th>
                    </tr>
                  </thead>
                  <tbody>
                    {aceptados.map((p) => (
                      <tr key={p.id} className="border-b border-gray-100 hover:bg-gray-50">
                        <td className="py-3 px-4 font-medium text-gray-800">{p.alumno_nombre}</td>
                        <td className="py-3 px-4 text-gray-500 text-sm">{p.alumno_rut}</td>
                        <td className="py-3 px-4 text-gray-700">{p.alumno_ppa ?? "-"}</td>
                        <td className="py-3 px-4 text-gray-500 text-sm">
                          {p.updated_at ? new Date(p.updated_at).toLocaleDateString("es-CL") : "-"}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}
          </div>
        </>
      )}
    </section>
  );
}

export default ManageTutorships;