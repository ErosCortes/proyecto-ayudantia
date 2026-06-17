import { useState, useEffect } from "react";
import apiClient from "../../config/apiClient";

function ManageCourses() {
  const [courses, setCourses] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [showForm, setShowForm] = useState(false);
  const [formData, setFormData] = useState({
    nombre: "",
    codigo_curso: "",
    description: "",
    metodo_seleccion: "INDIVIDUAL",
  });
  const [submitting, setSubmitting] = useState(false);

  useEffect(() => {
    fetchCourses();
  }, []);

  const fetchCourses = async () => {
    try {
      setLoading(true);
      const response = await apiClient("/courses/");

      if (!response.ok) {
        throw new Error("Error al obtener cursos");
      }

      const data = await response.json();
      setCourses(data);
      setError(null);
    } catch (err) {
      setError(err.message);
      console.error("Error:", err);
    } finally {
      setLoading(false);
    }
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
  
    if (!formData.nombre || !formData.codigo_curso) {
      setError("El nombre y codigo del curso son requeridos");
      return;
    }

    try {
      setSubmitting(true);

      const response = await apiClient("/courses/", {
        method: "POST",
        body: JSON.stringify(formData),
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || "Error al crear curso");
      }

      const newCourse = await response.json();
      setCourses((prev) => [...prev, newCourse]);
      setFormData({ nombre: "", codigo_curso: "", description: "", metodo_seleccion: "INDIVIDUAL" });
      setShowForm(false);
      setError(null);
    } catch (err) {
      setError(err.message);
      console.error("Error:", err);
    } finally {
      setSubmitting(false);
    }
  };

  const handleDeleteCourse = async (courseId) => {
    if (!window.confirm("¿Estas seguro de que deseas eliminar este curso?")) {
      return;
    }

    try {
      const response = await apiClient(`/courses/${courseId}/`, {
        method: "DELETE",
      });

      if (!response.ok) {
        throw new Error("Error al eliminar curso");
      }

      setCourses((prev) => prev.filter((course) => course.id !== courseId));
    } catch (err) {
      setError(err.message);
      console.error("Error:", err);
    }
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center min-h-screen">
        <p className="text-xl text-gray-600">Cargando cursos...</p>
      </div>
    );
  }

  return (
    <div className="bg-white rounded-lg shadow-lg p-6">
      <h1 className="text-3xl font-bold text-[#003057] mb-6">
        Gestión de Cursos
      </h1>

      {error && (
        <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded mb-4">
          {error}
        </div>
      )}

      <button
        onClick={() => setShowForm(!showForm)}
        className="bg-[#00AEEF] text-white px-4 py-2 rounded-lg hover:bg-[#0099cc] transition mb-6"
      >
        {showForm ? "Cancelar" : "+ Crear Nuevo Curso"}
      </button>

      {showForm && (
        <div className="bg-gray-50 border-2 border-[#003057] rounded-lg p-6 mb-6">
          <h2 className="text-xl font-bold text-[#003057] mb-4">
            Crear Nuevo Curso
          </h2>
          
          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label className="block text-gray-700 font-semibold mb-2">
                Nombre del Curso *
              </label>
              <input
                type="text"
                name="nombre"
                value={formData.nombre}
                onChange={handleInputChange}
                className="w-full px-4 py-2 border-2 border-gray-300 rounded-lg focus:outline-none focus:border-[#00AEEF]"
                placeholder="Ej: Cálculo I"
              />
            </div>

            <div>
              <label className="block text-gray-700 font-semibold mb-2">
                Código del Curso *
              </label>
              <input
                type="text"
                name="codigo_curso"
                value={formData.codigo_curso}
                onChange={handleInputChange}
                className="w-full px-4 py-2 border-2 border-gray-300 rounded-lg focus:outline-none focus:border-[#00AEEF]"
                placeholder="Ej: MAT101"
              />
            </div>

            <div>
              <label className="block text-gray-700 font-semibold mb-2">
                Descripción
              </label>
              <textarea
                name="description"
                value={formData.description}
                onChange={handleInputChange}
                className="w-full px-4 py-2 border-2 border-gray-300 rounded-lg focus:outline-none focus:border-[#00AEEF]"
                placeholder="Descripción del curso"
                rows="4"
              />
            </div>

            <div>
              <label className="block text-gray-700 font-semibold mb-2">
                Método de Selección
              </label>
              <select
                name="metodo_seleccion"
                value={formData.metodo_seleccion}
                onChange={handleInputChange}
                className="w-full px-4 py-2 border-2 border-gray-300 rounded-lg focus:outline-none focus:border-[#00AEEF]"
              >
                <option value="INDIVIDUAL">Cada profesor elige su propio ayudante</option>
                <option value="COORDINADOR">Un profesor coordina todos los paralelos</option>
              </select>
            </div>

            <button
              type="submit"
              disabled={submitting}
              className="bg-green-600 text-white px-6 py-2 rounded-lg hover:bg-green-700 transition disabled:opacity-50"
            >
              {submitting ? "Creando..." : "Crear Curso"}
            </button>
          </form>
        </div>
      )}

      <h2 className="text-2xl font-bold text-[#003057] mb-4">
        Cursos Disponibles
      </h2>

      {courses.length === 0 ? (
        <div className="text-center py-8">
          <p className="text-gray-600 text-lg">No hay cursos disponibles</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {courses.map((course) => (
            <div
              key={course.id}
              className="border-2 border-[#004b87] rounded-lg p-4 hover:shadow-lg transition"
            >
              <h3 className="text-lg font-bold text-[#003057] mb-2">
                {course.nombre}
              </h3>
              <p className="text-sm text-gray-600 mb-2">
                <strong>Código:</strong> {course.codigo_curso}
              </p>
              <p className="text-sm text-gray-600 mb-2">
                <strong>Método:</strong> {course.metodo_seleccion === 'INDIVIDUAL' ? 'Individual' : 'Coordinador'}
              </p>
              <p className="text-sm text-gray-600 mb-4">
                <strong>Descripción:</strong> {course.description || "-"}
              </p>
              <p className="text-xs text-gray-500 mb-4">
                Creado: {new Date(course.created_at).toLocaleDateString("es-CL")}
              </p>
              <button
                onClick={() => handleDeleteCourse(course.id)}
                className="w-full bg-red-600 text-white px-3 py-2 rounded-lg hover:bg-red-700 transition text-sm"
              >
                Eliminar
              </button>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

export default ManageCourses;
