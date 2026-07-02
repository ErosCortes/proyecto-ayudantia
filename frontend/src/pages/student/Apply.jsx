import { useState, useEffect } from "react";
import apiClient from "../../config/apiClient";

function Apply() {
  const [sections, setSections] = useState([]);
  const [profile, setProfile] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [submitting, setSubmitting] = useState(false);

  const puedePostular = () => {
    if (!profile) return true;
    const ppa = parseFloat(profile.ppa);
    const ppaValido = !isNaN(ppa) && ppa >= 5;
    return !profile.alerta_academica && ppaValido;
  };

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    try {
      setLoading(true);
      const [sectionsRes, profileRes] = await Promise.all([
        apiClient("/sections/available/"),
        apiClient("/users/profile_type/"),
      ]);

      if (!sectionsRes.ok) {
        throw new Error("Error al obtener secciones disponibles");
      }

      const sectionsData = await sectionsRes.json();
      setSections(sectionsData);

      if (profileRes.ok) {
        const profileData = await profileRes.json();
        setProfile(profileData.profile);
      }

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
      const response = await apiClient("/postulations/apply/", {
        method: "POST",
        body: JSON.stringify({ id_curso: sectionId }),
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || "Error al postular");
      }

      alert("Postulación realizada exitosamente");
      fetchData();
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

      {profile && !puedePostular() && (
        <div className="bg-yellow-100 border border-yellow-400 text-yellow-800 px-4 py-3 rounded mt-4 mb-4">
          {profile.alerta_academica
            ? "No puedes postular a ayudantías porque tienes alerta académica."
            : "Tu PPA actual no cumple con el mínimo requerido (5.0) para postular a ayudantías."}
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
                <strong>NRC:</strong> {section.nrc}
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
                disabled={submitting || !puedePostular()}
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