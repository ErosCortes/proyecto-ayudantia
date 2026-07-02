import { useState, useEffect } from "react";
import apiClient from "../../config/apiClient";

function ManageCourses() {
  // Cursos de la UCN (API externa)
  const [cursosUcn, setCursosUcn] = useState([]);
  const [loadingUcn, setLoadingUcn] = useState(true);
  const [errorUcn, setErrorUcn] = useState(null);

  // Cursos guardados en la BD local
  const [cursosLocales, setCursosLocales] = useState([]);
  const [loadingLocales, setLoadingLocales] = useState(true);

  // Sincronización
  const [syncing, setSyncing] = useState(false);
  const [syncResult, setSyncResult] = useState(null);

  // Formulario nuevo curso manual
  const [showForm, setShowForm] = useState(false);
  const [formData, setFormData] = useState({
    nombre: "",
    codigo_curso: "",
    description: "",
    metodo_seleccion: "INDIVIDUAL",
  });
  const [submitting, setSubmitting] = useState(false);
  const [formError, setFormError] = useState(null);

  // Paralelo (sección) a agregar a un curso existente
  const [paraleloForm, setParaleloForm] = useState({ courseId: null, nrc: "", profesor: "", semestre: "1", year: String(new Date().getFullYear()) });
  const [addingParalelo, setAddingParalelo] = useState(false);
  const [paraleloError, setParaleloError] = useState(null);

  const [profesores, setProfesores] = useState([]);

  // Filtros independientes para cada tabla
  const [filtroLocales, setFiltroLocales] = useState("");
  const [filtroUcn, setFiltroUcn] = useState("");
  // Filtro adicional por estado de ayudantía: "TODAS" | "ACTIVAS" | "INACTIVAS"
  const [filtroAyudantia, setFiltroAyudantia] = useState("TODAS");

  useEffect(() => {
    fetchCursosUcn();
    fetchCursosLocales();
    fetchProfesores();
  }, []);

  const fetchCursosUcn = async () => {
    try {
      setLoadingUcn(true);
      setErrorUcn(null);
      const res = await apiClient("/courses-ucn/");
      if (!res.ok) throw new Error("Error al obtener cursos desde la UCN");
      const data = await res.json();
      setCursosUcn(Array.isArray(data) ? data : []);
    } catch (err) {
      setErrorUcn(err.message);
    } finally {
      setLoadingUcn(false);
    }
  };

  const fetchCursosLocales = async () => {
    try {
      setLoadingLocales(true);
      const res = await apiClient("/courses/");
      if (!res.ok) throw new Error("Error al obtener cursos locales");
      const data = await res.json();
      setCursosLocales(Array.isArray(data) ? data : []);
    } catch (err) {
      console.error(err);
    } finally {
      setLoadingLocales(false);
    }
  };

  const fetchProfesores = async () => {
  try {
    const res = await apiClient("/teacher-profiles/");
    if (!res.ok) throw new Error();
    const data = await res.json();
    setProfesores(data);
  } catch (err) {
    console.error("Error al cargar profesores", err);
  }
};

  const handleSync = async () => {
    try {
      setSyncing(true);
      setSyncResult(null);
      const res = await apiClient("/courses-ucn/sync/", { method: "POST" });
      if (!res.ok) throw new Error("Error al sincronizar");
      const data = await res.json();
      setSyncResult(data);
      await fetchCursosLocales();
    } catch (err) {
      setSyncResult({ error: err.message });
    } finally {
      setSyncing(false);
    }
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!formData.nombre || !formData.codigo_curso) {
      setFormError("El nombre y código del curso son requeridos");
      return;
    }
    try {
      setSubmitting(true);
      setFormError(null);
      const res = await apiClient("/courses/", {
        method: "POST",
        body: JSON.stringify(formData),
      });
      if (!res.ok) {
        const errData = await res.json();
        throw new Error(errData.error || "Error al crear curso");
      }
      const newCourse = await res.json();
      setCursosLocales((prev) => [...prev, newCourse]);
      setFormData({ nombre: "", codigo_curso: "", description: "", metodo_seleccion: "INDIVIDUAL" });
      setShowForm(false);
    } catch (err) {
      setFormError(err.message);
    } finally {
      setSubmitting(false);
    }
  };

  const handleDelete = async (courseId) => {
    if (!window.confirm("¿Estás seguro de eliminar este curso?")) return;
    try {
      const res = await apiClient(`/courses/${courseId}/`, { method: "DELETE" });
      if (!res.ok) throw new Error("Error al eliminar curso");
      setCursosLocales((prev) => prev.filter((c) => c.id !== courseId));
    } catch (err) {
      alert(err.message);
    }
  };
  const handleCambiarMetodo = async (courseId, nuevoMetodo) => {
  try {
    const res = await apiClient(`/courses/${courseId}/`, {
      method: "PATCH",
      body: JSON.stringify({ metodo_seleccion: nuevoMetodo }),
    });
    if (!res.ok) throw new Error("Error al actualizar método");
    setCursosLocales((prev) =>
      prev.map((c) =>
        c.id === courseId ? { ...c, metodo_seleccion: nuevoMetodo } : c
      )
    );
  } catch (err) {
    alert(err.message);
  }
};

const handleCambiarCoordinador = async (courseId, profesorUserId) => {
  try {
    const res = await apiClient(`/courses/${courseId}/`, {
      method: "PATCH",
      body: JSON.stringify({ coordinador: profesorUserId || null }),
    });
    if (!res.ok) throw new Error("Error al asignar coordinador");
    setCursosLocales((prev) =>
      prev.map((c) =>
        c.id === courseId ? { ...c, coordinador: profesorUserId || null } : c
      )
    );
  } catch (err) {
    alert(err.message);
  }
};

  const handleAddParalelo = async () => {
    if (!paraleloForm.nrc.trim()) {
      setParaleloError("El NRC es requerido");
      return;
    }
    try {
      setAddingParalelo(true);
      setParaleloError(null);
      const res = await apiClient(`/courses/${paraleloForm.courseId}/add_section/`, {
        method: "POST",
        body: JSON.stringify({
          nrc: paraleloForm.nrc.trim(),
          profesor: paraleloForm.profesor || null,
          semestre: paraleloForm.semestre,
          year: parseInt(paraleloForm.year),
        }),
      });
      if (!res.ok) {
        const err = await res.json();
        throw new Error(err.error || "Error al agregar paralelo");
      }
      setParaleloForm({ courseId: null, nrc: "", profesor: "", semestre: "1", year: String(new Date().getFullYear()) });
      alert("Paralelo agregado exitosamente");
    } catch (err) {
      setParaleloError(err.message);
    } finally {
      setAddingParalelo(false);
    }
  };

  const handleToggleAyudantia = async (courseId, activaActual) => {
  const nuevoValor = !activaActual;
  const confirmMsg = nuevoValor
    ? "¿Reactivar la ayudantía de este curso para el semestre?"
    : "¿Marcar este curso como SIN ayudantía este semestre?";
  if (!window.confirm(confirmMsg)) return;
  try {
    const res = await apiClient(`/courses/${courseId}/`, {
      method: "PATCH",
      body: JSON.stringify({ ayudantia_activa: nuevoValor }),
    });
    if (!res.ok) throw new Error("Error al actualizar estado de ayudantía");
    setCursosLocales((prev) =>
      prev.map((c) =>
        c.id === courseId ? { ...c, ayudantia_activa: nuevoValor } : c
      )
    );
  } catch (err) {
    alert(err.message);
  }
};

  const codigosLocales = new Set(cursosLocales.map((c) => c.codigo_curso));

  // Cursos locales filtrados por nombre/código y por estado de ayudantía (combinables)
  const cursosLocalesFiltrados = cursosLocales.filter((c) => {
    const term = filtroLocales.trim().toLowerCase();
    const coincideTexto =
      !term ||
      c.nombre?.toLowerCase().includes(term) ||
      c.codigo_curso?.toLowerCase().includes(term);

    // Si el campo no existe en un curso viejo, se asume ayudantía activa por defecto
    const activa = c.ayudantia_activa !== false;
    const coincideEstado =
      filtroAyudantia === "TODAS" ||
      (filtroAyudantia === "ACTIVAS" && activa) ||
      (filtroAyudantia === "INACTIVAS" && !activa);

    return coincideTexto && coincideEstado;
  });

  // Cursos UCN filtrados por nombre, código o NRC (case-insensitive)
  const cursosUcnFiltrados = cursosUcn.filter((curso) => {
    const term = filtroUcn.trim().toLowerCase();
    if (!term) return true;
    const nombre = (curso.asignatura || curso.nombre || "").toLowerCase();
    const codigo = (curso.codigo || "").toLowerCase();
    const nrc = String(curso.nrc || "").toLowerCase();
    return nombre.includes(term) || codigo.includes(term) || nrc.includes(term);
  });

  return (
    <section>
      <h2 className="text-4xl font-bold text-[#003057]">Gestión de Cursos</h2>
      <p className="mt-2 text-gray-500">Cursos obtenidos desde la API de la UCN y cursos registrados en el sistema.</p>

      {/* ── CURSOS LOCALES ── */}
      <div className="bg-white rounded-2xl shadow-md p-6 mt-6">
        <div className="flex items-center justify-between mb-4 flex-wrap gap-3">
          <div>
            <h3 className="text-xl font-bold text-[#003057]">Cursos en el Sistema</h3>
            <p className="text-sm text-gray-500 mt-1">
              {loadingLocales
                ? "Cargando..."
                : `${cursosLocalesFiltrados.length} de ${cursosLocales.length} cursos registrados`}
            </p>
          </div>
          <button
            onClick={() => setShowForm(!showForm)}
            className="bg-[#00AEEF] text-white px-4 py-2 rounded-lg hover:bg-[#0099cc] transition text-sm"
          >
            {showForm ? "Cancelar" : "+ Agregar curso manual"}
          </button>
        </div>

        {showForm && (
          <div className="bg-gray-50 border-2 border-[#003057] rounded-xl p-5 mb-6">
            <h4 className="text-lg font-bold text-[#003057] mb-4">Nuevo Curso</h4>
            {formError && (
              <div className="bg-red-100 border border-red-400 text-red-700 px-3 py-2 rounded mb-3 text-sm">
                {formError}
              </div>
            )}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Nombre *</label>
                <input
                  type="text"
                  name="nombre"
                  value={formData.nombre}
                  onChange={handleInputChange}
                  className="w-full border-2 border-gray-200 rounded-lg px-3 py-2 text-sm focus:outline-none focus:border-[#00AEEF]"
                  placeholder="Ej: Cálculo I"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Código *</label>
                <input
                  type="text"
                  name="codigo_curso"
                  value={formData.codigo_curso}
                  onChange={handleInputChange}
                  className="w-full border-2 border-gray-200 rounded-lg px-3 py-2 text-sm focus:outline-none focus:border-[#00AEEF]"
                  placeholder="Ej: MAT101"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Método de selección</label>
                <select
                  name="metodo_seleccion"
                  value={formData.metodo_seleccion}
                  onChange={handleInputChange}
                  className="w-full border-2 border-gray-200 rounded-lg px-3 py-2 text-sm focus:outline-none focus:border-[#00AEEF] bg-white"
                >
                  <option value="INDIVIDUAL">Individual (cada profesor elige)</option>
                  <option value="COORDINADOR">Coordinador (un profesor coordina)</option>
                </select>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Descripción</label>
                <input
                  type="text"
                  name="description"
                  value={formData.description}
                  onChange={handleInputChange}
                  className="w-full border-2 border-gray-200 rounded-lg px-3 py-2 text-sm focus:outline-none focus:border-[#00AEEF]"
                  placeholder="Opcional"
                />
              </div>
            </div>
            <button
              onClick={handleSubmit}
              disabled={submitting}
              className="mt-4 bg-green-600 text-white px-5 py-2 rounded-lg hover:bg-green-700 transition text-sm disabled:opacity-50"
            >
              {submitting ? "Guardando..." : "Guardar curso"}
            </button>
          </div>
        )}

        {/* Filtros cursos locales */}
        <div className="mb-4 flex flex-wrap gap-3">
          <input
            type="text"
            value={filtroLocales}
            onChange={(e) => setFiltroLocales(e.target.value)}
            placeholder="Buscar por nombre o código..."
            className="w-full md:w-80 border-2 border-gray-200 rounded-lg px-3 py-2 text-sm focus:outline-none focus:border-[#00AEEF]"
          />
          <select
            value={filtroAyudantia}
            onChange={(e) => setFiltroAyudantia(e.target.value)}
            className="border-2 border-gray-200 rounded-lg px-3 py-2 text-sm focus:outline-none focus:border-[#00AEEF] bg-white"
          >
            <option value="TODAS">Todas las ayudantías</option>
            <option value="ACTIVAS">Ayudantía activa este semestre</option>
            <option value="INACTIVAS">Ayudantía inactiva este semestre</option>
          </select>
        </div>

        {loadingLocales ? (
          <p className="text-gray-500 text-center py-8">Cargando cursos...</p>
        ) : cursosLocales.length === 0 ? (
          <p className="text-gray-500 text-center py-8">
            No hay cursos en el sistema. Sincroniza desde la UCN o agrega uno manualmente.
          </p>
        ) : cursosLocalesFiltrados.length === 0 ? (
          <p className="text-gray-500 text-center py-8">
            No se encontraron cursos que coincidan con "{filtroLocales}".
          </p>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-left">
              <thead>
                <tr className="border-b-2 border-[#004b87]">
                  <th className="py-3 px-4 font-bold text-[#003057] text-sm">Código</th>
                  <th className="py-3 px-4 font-bold text-[#003057] text-sm">Nombre</th>
                  <th className="py-3 px-4 font-bold text-[#003057] text-sm">Método</th>
                  <th className="py-3 px-4 font-bold text-[#003057] text-sm">Coordinador</th>
                  <th className="py-3 px-4 font-bold text-[#003057] text-sm">Ayudantía</th>
                  <th className="py-3 px-4 font-bold text-[#003057] text-sm">Paralelos</th>
                  <th className="py-3 px-4 font-bold text-[#003057] text-sm">Acciones</th>
                </tr>
              </thead>
              <tbody>
                {cursosLocalesFiltrados.map((course) => {
                  const ayudantiaActiva = course.ayudantia_activa !== false;
                  return (
                  <tr
                    key={course.id}
                    className={`border-b border-gray-100 hover:bg-gray-50 ${
                      !ayudantiaActiva ? "bg-gray-50 opacity-60" : ""
                    }`}
                  >
                    <td className="py-3 px-4 text-gray-600 text-sm font-mono">{course.codigo_curso}</td>
                    <td className="py-3 px-4 text-gray-800">{course.nombre}</td>
                    <td className="py-3 px-4">
                      <select
                        value={course.metodo_seleccion}
                        onChange={(e) => handleCambiarMetodo(course.id, e.target.value)}
                        disabled={!ayudantiaActiva}
                        className="border-2 border-gray-200 rounded-lg px-2 py-1 text-sm focus:outline-none focus:border-[#00AEEF] bg-white disabled:opacity-50"
                      >
                        <option value="INDIVIDUAL">Individual</option>
                        <option value="COORDINADOR">Coordinador</option>
                      </select>
                    </td>
                    <td className="py-3 px-4">
                      {course.metodo_seleccion === "COORDINADOR" ? (
                        <select
                          value={course.coordinador || ""}
                          onChange={(e) => handleCambiarCoordinador(course.id, e.target.value)}
                          disabled={!ayudantiaActiva}
                          className="border-2 border-gray-200 rounded-lg px-2 py-1 text-sm focus:outline-none focus:border-[#00AEEF] bg-white disabled:opacity-50"
                        >
                          <option value="">Sin asignar</option>
                          {profesores.map((p) => (
                            <option key={p.id} value={p.user.id}>
                              {p.user.nombre_completo}
                            </option>
                          ))}
                        </select>
                     ) : (
                       <span className="text-gray-400 text-sm">—</span>
                      )}
                    </td>
                    <td className="py-3 px-4">
                      <button
                        onClick={() => handleToggleAyudantia(course.id, ayudantiaActiva)}
                        className={`inline-flex items-center gap-2 px-3 py-1 rounded-full text-xs font-semibold transition ${
                          ayudantiaActiva
                            ? "bg-green-100 text-green-700 hover:bg-green-200"
                            : "bg-red-100 text-red-700 hover:bg-red-200"
                        }`}
                        title={
                          ayudantiaActiva
                            ? "Click para marcar sin ayudantía este semestre"
                            : "Click para reactivar la ayudantía"
                        }
                      >
                        <span
                          className={`w-2 h-2 rounded-full ${
                            ayudantiaActiva ? "bg-green-600" : "bg-red-600"
                          }`}
                        />
                        {ayudantiaActiva ? "Activa" : "Sin ayudantía"}
                      </button>
                    </td>
                    <td className="py-3 px-4">
                      <button
                        onClick={() => setParaleloForm({ ...paraleloForm, courseId: course.id })}
                        className="text-[#00AEEF] hover:text-[#0099cc] text-sm font-medium transition"
                        disabled={!ayudantiaActiva}
                      >
                        + Agregar NRC
                      </button>
                    </td>
                    <td className="py-3 px-4">
                      <button
                      onClick={() => handleDelete(course.id)}
                      className="text-red-600 hover:text-red-800 text-sm font-medium transition"
                   >
                      Eliminar
                    </button>
                  </td>
                </tr>
                  );
               })}
              </tbody>
            </table>
          </div>
        )}
      </div>

      {/* ── FORMULARIO AGREGAR PARALELO ── */}
      {paraleloForm.courseId && (
        <div className="bg-yellow-50 border-2 border-[#00AEEF] rounded-xl p-5 mt-6">
          <h3 className="text-lg font-bold text-[#003057] mb-1">Agregar Paralelo (NRC)</h3>
          <p className="text-sm text-gray-500 mb-4">
            Curso ID: {paraleloForm.courseId}
          </p>
          {paraleloError && (
            <div className="bg-red-100 border border-red-400 text-red-700 px-3 py-2 rounded mb-3 text-sm">
              {paraleloError}
            </div>
          )}
          <div className="grid grid-cols-1 md:grid-cols-5 gap-3 items-end">
            <div>
              <label className="block text-xs font-medium text-gray-600 mb-1">NRC *</label>
              <input
                type="text"
                value={paraleloForm.nrc}
                onChange={(e) => setParaleloForm({ ...paraleloForm, nrc: e.target.value })}
                className="w-full border-2 border-gray-200 rounded-lg px-3 py-2 text-sm focus:outline-none focus:border-[#00AEEF]"
                placeholder="Ej: 12345"
              />
            </div>
            <div>
              <label className="block text-xs font-medium text-gray-600 mb-1">Profesor</label>
              <select
                value={paraleloForm.profesor}
                onChange={(e) => setParaleloForm({ ...paraleloForm, profesor: e.target.value })}
                className="w-full border-2 border-gray-200 rounded-lg px-3 py-2 text-sm focus:outline-none focus:border-[#00AEEF] bg-white"
              >
                <option value="">Sin asignar</option>
                {profesores.map((p) => (
                  <option key={p.id} value={p.user.id}>
                    {p.user.nombre_completo}
                  </option>
                ))}
              </select>
            </div>
            <div>
              <label className="block text-xs font-medium text-gray-600 mb-1">Semestre</label>
              <select
                value={paraleloForm.semestre}
                onChange={(e) => setParaleloForm({ ...paraleloForm, semestre: e.target.value })}
                className="w-full border-2 border-gray-200 rounded-lg px-3 py-2 text-sm focus:outline-none focus:border-[#00AEEF] bg-white"
              >
                <option value="1">1</option>
                <option value="2">2</option>
              </select>
            </div>
            <div>
              <label className="block text-xs font-medium text-gray-600 mb-1">Año</label>
              <input
                type="number"
                value={paraleloForm.year}
                onChange={(e) => setParaleloForm({ ...paraleloForm, year: e.target.value })}
                className="w-full border-2 border-gray-200 rounded-lg px-3 py-2 text-sm focus:outline-none focus:border-[#00AEEF]"
              />
            </div>
            <div className="flex gap-2">
              <button
                onClick={handleAddParalelo}
                disabled={addingParalelo}
                className="bg-green-600 text-white px-4 py-2 rounded-lg hover:bg-green-700 transition text-sm disabled:opacity-50"
              >
                {addingParalelo ? "Guardando..." : "Guardar"}
              </button>
              <button
                onClick={() => { setParaleloForm({ courseId: null, nrc: "", profesor: "", semestre: "1", year: String(new Date().getFullYear()) }); setParaleloError(null); }}
                className="bg-gray-300 text-gray-700 px-4 py-2 rounded-lg hover:bg-gray-400 transition text-sm"
              >
                Cancelar
              </button>
            </div>
          </div>
        </div>
      )}

      {/* ── CURSOS UCN ── */}
      <div className="bg-white rounded-2xl shadow-md p-6 mt-6">
        <div className="flex items-center justify-between mb-4 flex-wrap gap-3">
          <div>
            <h3 className="text-xl font-bold text-[#003057]">Cursos desde la UCN</h3>
            <p className="text-sm text-gray-500 mt-1">
              {loadingUcn
                ? "Cargando..."
                : `${cursosUcnFiltrados.length} de ${cursosUcn.length} cursos disponibles`}
            </p>
          </div>
          <div className="flex gap-3 items-center">
            {syncResult && !syncResult.error && (
              <span className="text-sm text-green-700 bg-green-100 px-3 py-1 rounded-full">
                ✓ {syncResult.creados} creados, {syncResult.actualizados} actualizados
              </span>
            )}
            {syncResult?.error && (
              <span className="text-sm text-red-700 bg-red-100 px-3 py-1 rounded-full">
                {syncResult.error}
              </span>
            )}
            <button
              onClick={handleSync}
              disabled={syncing || loadingUcn}
              className="bg-[#003057] text-white px-4 py-2 rounded-lg hover:bg-[#004b87] transition text-sm disabled:opacity-50"
            >
              {syncing ? "Sincronizando..." : "↻ Sincronizar al sistema"}
            </button>
          </div>
        </div>

        {errorUcn && (
          <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded mb-4 text-sm">
            {errorUcn}
          </div>
        )}

        {/* Filtro cursos UCN */}
        <div className="mb-4">
          <input
            type="text"
            value={filtroUcn}
            onChange={(e) => setFiltroUcn(e.target.value)}
            placeholder="Buscar por nombre, código o NRC..."
            className="w-full md:w-80 border-2 border-gray-200 rounded-lg px-3 py-2 text-sm focus:outline-none focus:border-[#00AEEF]"
          />
        </div>

        {loadingUcn ? (
          <p className="text-gray-500 text-center py-8">Consultando API de la UCN...</p>
        ) : cursosUcn.length === 0 ? (
          <p className="text-gray-500 text-center py-8">No se encontraron cursos en la API de la UCN.</p>
        ) : cursosUcnFiltrados.length === 0 ? (
          <p className="text-gray-500 text-center py-8">
            No se encontraron cursos que coincidan con "{filtroUcn}".
          </p>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-left">
              <thead>
                <tr className="border-b-2 border-[#004b87]">
                  <th className="py-3 px-4 font-bold text-[#003057] text-sm">Código</th>
                  <th className="py-3 px-4 font-bold text-[#003057] text-sm">Nombre</th>
                  <th className="py-3 px-4 font-bold text-[#003057] text-sm">NRC</th>
                  <th className="py-3 px-4 font-bold text-[#003057] text-sm">Estado</th>

                </tr>
              </thead>
              <tbody>
                {cursosUcnFiltrados.map((curso, i) => {
                  const sincronizado = codigosLocales.has(curso.codigo);
                  return (
                    <tr key={i} className="border-b border-gray-100 hover:bg-gray-50">
                      <td className="py-3 px-4 text-gray-600 text-sm font-mono">{curso.codigo}</td>
                      <td className="py-3 px-4 text-gray-800">{curso.asignatura || curso.nombre}</td>
                      <td className="py-3 px-4 text-gray-500 text-sm">{curso.nrc || "-"}</td>
                      <td className="py-3 px-4">
                        {sincronizado ? (
                          <span className="inline-block px-2 py-1 rounded-full text-xs font-semibold bg-green-100 text-green-700">
                            En sistema
                          </span>
                        ) : (
                          <span className="inline-block px-2 py-1 rounded-full text-xs font-semibold bg-yellow-100 text-yellow-700">
                            Sin sincronizar
                          </span>
                        )}
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </section>
  );
}

export default ManageCourses;