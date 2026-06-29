import { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import apiClient from "../../config/apiClient";

function ManageTutorships() {
  const [sections, setSections] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    fetchSections();
  }, []);

  const fetchSections = async () => {
    try {
      setLoading(true);
      const response = await apiClient("/sections/my_sections/");
      if (!response.ok) throw new Error("Error al obtener secciones");
      const data = await response.json();
      setSections(data);
      setError(null);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
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

  return (
    <section>
      <h2 className="text-4xl font-bold text-[#003057]">Gestionar Ayudantías</h2>
      <p className="mt-4 text-gray-600">Administra tus ayudantías activas.</p>

      {sections.length === 0 ? (
        <div className="bg-white rounded-2xl shadow-md p-6 mt-10 text-center">
          <p className="text-gray-600 text-lg">No tienes secciones asignadas.</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mt-10">
          {sections.map((section) => (
            <article key={section.id} className="bg-white rounded-2xl shadow-md p-6">
              <h3 className="text-2xl font-bold text-[#003057]">{section.course_nombre}</h3>
              <p className="mt-3 text-gray-700"><strong>NRC:</strong> {section.nrc}</p>
              <p className="mt-2 text-gray-700"><strong>Semestre:</strong> {section.semestre} {section.year}</p>
              <p className="mt-2 text-gray-700">
                <strong>Postulantes pendientes:</strong> {section.postulantes_pendientes}
              </p>
              <Link
                to="/teacher/applicants"
                className="inline-block mt-6 bg-[#00AEEF] text-white px-5 py-3 rounded-xl hover:opacity-80 transition"
              >
                Ver Postulantes
              </Link>
            </article>
          ))}
        </div>
      )}
    </section>
  );
}

export default ManageTutorships;
