import { useState, useEffect } from "react";
import API_ENDPOINTS from "../../config/api";

function Apply() {
  const [sections, setSections] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [submitting, setSubmitting] = useState(false);

  useEffect(() => {
    fetchAvailableSections();
  }, []);

  const fetchAvailableSections = async () => {
    try {
      setLoading(true);
      const response = await fetch(API_ENDPOINTS.sectionsAvailable, {
        method: "GET",
        credentials: "include",
        headers: {
          "Content-Type": "application/json",
        },
      });

      if (!response.ok) {
        throw new Error("Error al obtener secciones disponibles");
      }

      const data = await response.json();
      setSections(data);
      setError(null);
    } catch (err) {
      setError(err.message);
      console.error("Error:", err);
    } finally {
      setLoading(false);
    }
  };

  const handleApply = async (sectionId) => {
    if (!window.confirm("¿Deseas postular a esta sección?")) {
      return;
    }

    try {
      setSubmitting(true);
      const response = await fetch(API_ENDPOINTS.apply, {
        method: "POST",
        credentials: "include",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ id_curso: sectionId }),
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || "Error al postular");
      }

      alert("Postulación realizada exitosamente");
      // Recargar la lista
      fetchAvailableSections();
    } catch (err) {
      alert(`Error: ${err.message}`);
      console.error("Error:", err);
    } finally {
      setSubmitting(false);
    }
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center min-h-screen">
        <p className="text-xl text-gray-600">Cargando secciones disponibles...</p>
      </div>
    );
  }

  return (
    <section>

      <h2 className="text-4xl font-bold text-[#003057]">
        Ayudantías Disponibles
      </h2>

      <p className="mt-4 text-gray-600">
        Revisa y postula a ayudantías abiertas.
      </p>

      {error && (
        <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded mt-4 mb-4">
          {error}
        </div>
      )}

      {sections.length === 0 ? (
        <div className="text-center py-8 mt-10">
          <p className="text-gray-600 text-lg">No hay secciones disponibles en este momento</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mt-10">

          {sections.map((section) => (
            <article
              key={section.id}
              className="bg-white rounded-2xl shadow-md p-6"
            >

              <h3 className="text-2xl font-bold text-[#003057]">
                {section.course_nombre}
              </h3>

              <p className="mt-3 text-gray-700">
                <strong>Código:</strong> {section.course}
              </p>

              <p className="mt-2 text-gray-700">
                <strong>Sección:</strong> {section.numero}
              </p>

              <p className="mt-2 text-gray-700">
                <strong>Profesor:</strong> {section.profesor_nombre || "No asignado"}
              </p>

              <p className="mt-2 text-gray-700">
                <strong>Semestre:</strong> {section.semestre}
              </p>

              <p className="mt-2 text-gray-700">
                <strong>Año:</strong> {section.year}
              </p>

              <button
                onClick={() => handleApply(section.id)}
                disabled={submitting}
                className="mt-6 bg-[#00AEEF] text-white px-5 py-3 rounded-xl hover:opacity-80 transition disabled:opacity-50"
              >
                {submitting ? "Postulando..." : "Postular"}
              </button>

            </article>
          ))}

        </div>
      )}

    </section>
  );
}

export default Apply;