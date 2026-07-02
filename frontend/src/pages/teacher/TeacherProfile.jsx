import { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import apiClient from "../../config/apiClient";

function TeacherProfile() {
  const [profileData, setProfileData] = useState(null);
  const [sections, setSections] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    try {
      setLoading(true);
      const [profileRes, sectionsRes] = await Promise.all([
        apiClient("/users/profile_type/"),
        apiClient("/sections/my_sections/"),
      ]);

      if (!profileRes.ok || !sectionsRes.ok) {
        throw new Error("Error al obtener datos del perfil");
      }

      const profile = await profileRes.json();
      const secs = await sectionsRes.json();

      setProfileData(profile);
      setSections(secs);
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
        <p className="text-xl text-gray-600">Cargando perfil...</p>
      </div>
    );
  }

  if (error) {
    return (
      <section>
        <h2 className="text-4xl font-bold text-[#003057]">Perfil Profesor</h2>
        <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded mt-6">{error}</div>
      </section>
    );
  }

  const user = profileData?.user;

  return (
    <section>
      <h2 className="text-4xl font-bold text-[#003057]">Perfil Profesor</h2>

      <div className="bg-white rounded-2xl shadow-md p-6 mt-6">
        <h3 className="text-2xl font-bold text-[#003057] mb-4">Datos Personales</h3>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <p className="text-sm text-gray-500">Nombre</p>
            <p className="text-lg font-semibold">{user?.nombre_completo}</p>
          </div>
          <div>
            <p className="text-sm text-gray-500">RUT</p>
            <p className="text-lg font-semibold">{user?.rut}</p>
          </div>
          <div>
            <p className="text-sm text-gray-500">Correo</p>
            <p className="text-lg font-semibold">{user?.correo_institucional || user?.email || "-"}</p>
          </div>
          <div>
            <p className="text-sm text-gray-500">Teléfono</p>
            <p className="text-lg font-semibold">{user?.telefono || "-"}</p>
          </div>

          <div className="mt-6 pt-4 border-t border-gray-200">
            <Link
              to="../change-password"
              className="inline-block bg-[#003057] text-white px-5 py-2 rounded-lg hover:bg-[#002244] transition-colors font-medium"
            >
              Cambiar Contraseña
            </Link>
          </div>
        </div>
      </div>

      <div className="bg-white rounded-2xl shadow-md p-6 mt-6">
        <h3 className="text-2xl font-bold text-[#003057] mb-4">
          Mis Secciones ({sections.length})
        </h3>

        {sections.length === 0 ? (
          <p className="text-gray-600">No tienes secciones asignadas.</p>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-left">
              <thead>
                <tr className="border-b-2 border-[#004b87]">
                  <th className="py-3 px-4 font-bold text-[#003057]">NRC</th>
                  <th className="py-3 px-4 font-bold text-[#003057]">Curso</th>
                  <th className="py-3 px-4 font-bold text-[#003057]">Semestre</th>
                </tr>
              </thead>
              <tbody>
                {sections.map((section) => (
                  <tr key={section.id} className="border-b border-gray-200 hover:bg-gray-50">
                    <td className="py-3 px-4 text-gray-700">{section.nrc}</td>
                    <td className="py-3 px-4 text-gray-700">{section.course_nombre}</td>
                    <td className="py-3 px-4 text-gray-700">{section.semestre} {section.year}</td>
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

export default TeacherProfile;
