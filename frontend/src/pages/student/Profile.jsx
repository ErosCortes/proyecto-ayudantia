import { useState, useEffect } from "react";
import apiClient from "../../config/apiClient";

function Profile() {
  const [profileData, setProfileData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    fetchProfile();
  }, []);

  const fetchProfile = async () => {
    try {
      setLoading(true);
      const response = await apiClient("/users/profile_type/");
      if (!response.ok) {
        throw new Error("Error al obtener los datos del perfil");
      }
      const data = await response.json();
      setProfileData(data);
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
        <h2 className="text-4xl font-bold text-[#003057]">Mi Perfil</h2>
        <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded mt-6">
          {error}
        </div>
      </section>
    );
  }

  const user = profileData?.user;
  const profile = profileData?.profile;
  const subjects = profile?.asignaturas_aprobadas || [];

  return (
    <section>
      <h2 className="text-4xl font-bold text-[#003057]">Mi Perfil</h2>

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
            <p className="text-lg font-semibold">{user?.correo_institucional}</p>
          </div>
          <div>
            <p className="text-sm text-gray-500">Teléfono</p>
            <p className="text-lg font-semibold">{user?.telefono || "-"}</p>
          </div>
          <div>
            <p className="text-sm text-gray-500">Dirección</p>
            <p className="text-lg font-semibold">{user?.direccion || "-"}</p>
          </div>
          <div>
            <p className="text-sm text-gray-500">Carrera</p>
            <p className="text-lg font-semibold">{profile?.carrera_nombre || "-"}</p>
          </div>
          <div>
            <p className="text-sm text-gray-500">PPA</p>
            <p className="text-lg font-semibold">{profile?.ppa ?? "-"}</p>
          </div>
          <div>
            <p className="text-sm text-gray-500">Alerta Académica</p>
            <p className="text-lg font-semibold">
              {profile?.alerta_academica ? (
                <span className="text-red-600">Sí</span>
              ) : (
                <span className="text-green-600">No</span>
              )}
            </p>
          </div>
        </div>
      </div>

      <div className="bg-white rounded-2xl shadow-md p-6 mt-6">
        <h3 className="text-2xl font-bold text-[#003057] mb-4">
          Asignaturas Aprobadas ({subjects.length})
        </h3>

        {subjects.length === 0 ? (
          <p className="text-gray-600">No hay asignaturas aprobadas registradas.</p>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-left">
              <thead>
                <tr className="border-b-2 border-[#004b87]">
                  <th className="py-3 px-4 font-bold text-[#003057]">Código</th>
                  <th className="py-3 px-4 font-bold text-[#003057]">Nombre</th>
                  <th className="py-3 px-4 font-bold text-[#003057]">Nota</th>
                  <th className="py-3 px-4 font-bold text-[#003057]">Periodo</th>
                  <th className="py-3 px-4 font-bold text-[#003057]">Tipo</th>
                </tr>
              </thead>
              <tbody>
                {subjects.map((subject) => (
                  <tr key={subject.id} className="border-b border-gray-200 hover:bg-gray-50">
                    <td className="py-3 px-4 text-gray-700">{subject.codigo}</td>
                    <td className="py-3 px-4 text-gray-700">{subject.nombre}</td>
                    <td className="py-3 px-4 font-semibold">{subject.nota}</td>
                    <td className="py-3 px-4 text-gray-700">{subject.periodo}</td>
                    <td className="py-3 px-4">
                      <span className={`inline-block px-2 py-1 rounded-full text-xs font-semibold ${
                        subject.inscription_type === 'CONVALIDADA'
                          ? 'bg-purple-100 text-purple-800'
                          : 'bg-blue-100 text-blue-800'
                      }`}>
                        {subject.inscription_type}
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

export default Profile;
