import { useState, useEffect } from "react";
import apiClient from "../../config/apiClient";

const anioActual = new Date().getFullYear();

// Fila vacía por defecto para el formulario de asignaturas manuales
const filaVacia = () => ({
  course: "",
  nrc: "",
  semestre: "1",
  year: String(anioActual),
});

function ManageUsers() {
  // ── Crear profesor desde API UCN ──
  const [rut, setRut] = useState("");
  const [nombre, setNombre] = useState("");
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState(null);
  const [error, setError] = useState(null);

  // Asignaturas manuales a agregar junto con el profesor nuevo
  const [seccionesNuevoProfesor, setSeccionesNuevoProfesor] = useState([]);

  // ── Cursos disponibles (para los selects de asignatura) ──
  const [cursos, setCursos] = useState([]);
  const [loadingCursos, setLoadingCursos] = useState(true);

  // ── Asignar asignatura a un profesor existente ──
  const [profesores, setProfesores] = useState([]);
  const [loadingProfesores, setLoadingProfesores] = useState(true);
  const [busquedaProfesor, setBusquedaProfesor] = useState("");
  const [profesorSeleccionado, setProfesorSeleccionado] = useState(null);
  const [seccionesProfesorExistente, setSeccionesProfesorExistente] = useState([]);
  const [asignando, setAsignando] = useState(false);
  const [asignarResult, setAsignarResult] = useState(null);
  const [asignarError, setAsignarError] = useState(null);

  // ── Convertir alumno en profesor ──
  const [alumnos, setAlumnos] = useState([]);
  const [loadingAlumnos, setLoadingAlumnos] = useState(true);
  const [busquedaAlumno, setBusquedaAlumno] = useState("");
  const [alumnoSeleccionado, setAlumnoSeleccionado] = useState(null);
  const [promoviendo, setPromoviendo] = useState(false);
  const [promoverResult, setPromoverResult] = useState(null);
  const [promoverError, setPromoverError] = useState(null);

  useEffect(() => {
    fetchCursos();
    fetchProfesores();
    fetchAlumnos();
  }, []);

  const fetchCursos = async () => {
    try {
      setLoadingCursos(true);
      const res = await apiClient("/courses/");
      if (!res.ok) throw new Error();
      const data = await res.json();
      setCursos(Array.isArray(data) ? data : []);
    } catch (err) {
      console.error("Error al cargar cursos", err);
    } finally {
      setLoadingCursos(false);
    }
  };

  const fetchProfesores = async () => {
    try {
      setLoadingProfesores(true);
      const res = await apiClient("/teacher-profiles/");
      if (!res.ok) throw new Error();
      const data = await res.json();
      setProfesores(Array.isArray(data) ? data : []);
    } catch (err) {
      console.error("Error al cargar profesores", err);
    } finally {
      setLoadingProfesores(false);
    }
  };

  const fetchAlumnos = async () => {
    try {
      setLoadingAlumnos(true);
      const res = await apiClient("/student-profiles/");
      if (!res.ok) throw new Error();
      const data = await res.json();
      setAlumnos(Array.isArray(data) ? data : []);
    } catch (err) {
      console.error("Error al cargar alumnos", err);
    } finally {
      setLoadingAlumnos(false);
    }
  };

  // ── Helpers genéricos para manejar filas de secciones manuales ──
  const agregarFila = (setSecciones) => {
    setSecciones((prev) => [...prev, filaVacia()]);
  };

  const eliminarFila = (setSecciones, index) => {
    setSecciones((prev) => prev.filter((_, i) => i !== index));
  };

  const actualizarFila = (setSecciones, index, campo, valor) => {
    setSecciones((prev) =>
      prev.map((fila, i) => (i === index ? { ...fila, [campo]: valor } : fila))
    );
  };

  // Crea las secciones en el backend, una por una, y devuelve un resumen
  const crearSecciones = async (secciones, profesorId) => {
    const creadas = [];
    const errores = [];
    for (const fila of secciones) {
      if (!fila.course || !fila.nrc) continue; // fila incompleta, se ignora
      try {
        const res = await apiClient("/sections/", {
          method: "POST",
          body: JSON.stringify({
            course: fila.course,
            nrc: fila.nrc,
            semestre: fila.semestre,
            year: fila.year,
            profesor: profesorId,
          }),
        });
        if (!res.ok) {
          const errData = await res.json().catch(() => ({}));
          throw new Error(errData.error || errData.detail || "Error al crear sección");
        }
        const data = await res.json();
        creadas.push(data);
      } catch (err) {
        errores.push(`NRC ${fila.nrc}: ${err.message}`);
      }
    }
    return { creadas, errores };
  };

  // ── Crear profesor nuevo (+ secciones manuales opcionales) ──
  const handleSubmit = async (e) => {
    e.preventDefault();
    setError(null);
    setResult(null);

    if (!rut.trim()) {
      setError("El RUT es requerido");
      return;
    }

    try {
      setLoading(true);
      const response = await apiClient("/users/create_teacher/", {
        method: "POST",
        body: JSON.stringify({
          rut: rut.trim(),
          nombre_completo: nombre.trim(),
        }),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || "Error al crear profesor");
      }

      // Si se agregaron filas de asignaturas manuales, las creamos ahora
      let manualInfo = null;
      const filasValidas = seccionesNuevoProfesor.filter((f) => f.course && f.nrc);
      if (filasValidas.length > 0) {
        manualInfo = await crearSecciones(filasValidas, data.user.id);
      }

      setResult({ ...data, manual: manualInfo });
      setRut("");
      setNombre("");
      setSeccionesNuevoProfesor([]);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  // ── Asignar asignaturas a un profesor ya existente ──
  const profesoresFiltrados = profesores.filter((p) => {
    const term = busquedaProfesor.trim().toLowerCase();
    if (!term) return true;
    return (
      p.user?.nombre_completo?.toLowerCase().includes(term) ||
      p.user?.rut?.toLowerCase().includes(term)
    );
  });

  const handleSeleccionarProfesor = (p) => {
    setProfesorSeleccionado(p);
    setSeccionesProfesorExistente([]);
    setAsignarResult(null);
    setAsignarError(null);
  };

  const handleAsignarSecciones = async () => {
    if (!profesorSeleccionado) return;
    const filasValidas = seccionesProfesorExistente.filter((f) => f.course && f.nrc);
    if (filasValidas.length === 0) {
      setAsignarError("Agrega al menos una asignatura con curso y NRC");
      return;
    }
    try {
      setAsignando(true);
      setAsignarError(null);
      setAsignarResult(null);
      const { creadas, errores } = await crearSecciones(
        filasValidas,
        profesorSeleccionado.user.id
      );
      setAsignarResult({ creadas: creadas.length, errores });
      setSeccionesProfesorExistente([]);
    } catch (err) {
      setAsignarError(err.message);
    } finally {
      setAsignando(false);
    }
  };

  // ── Convertir alumno en profesor ──
  // Solo alumnos con perfil activo (no ya promovidos previamente)
  const alumnosFiltrados = alumnos.filter((a) => {
    if (a.activo === false) return false;
    const term = busquedaAlumno.trim().toLowerCase();
    if (!term) return true;
    return (
      a.user?.nombre_completo?.toLowerCase().includes(term) ||
      a.user?.rut?.toLowerCase().includes(term)
    );
  });

  const handleSeleccionarAlumno = (a) => {
    setAlumnoSeleccionado(a);
    setPromoverResult(null);
    setPromoverError(null);
  };

  const handlePromoverAProfesor = async () => {
    if (!alumnoSeleccionado) return;
    const nombreAlumno = alumnoSeleccionado.user?.nombre_completo;
    if (
      !window.confirm(
        `¿Convertir a ${nombreAlumno} en profesor? Su historial como alumno se conserva, pero pasará a tener rol de profesor.`
      )
    ) {
      return;
    }
    try {
      setPromoviendo(true);
      setPromoverError(null);
      setPromoverResult(null);
      const res = await apiClient("/users/promote_to_teacher/", {
        method: "POST",
        body: JSON.stringify({ user_id: alumnoSeleccionado.user.id }),
      });
      const data = await res.json();
      if (!res.ok) {
        throw new Error(data.error || "Error al convertir a profesor");
      }
      setPromoverResult(data);
      setAlumnoSeleccionado(null);
      // Refrescar ambas listas: el alumno queda inactivo y aparece como profesor nuevo
      await fetchAlumnos();
      await fetchProfesores();
    } catch (err) {
      setPromoverError(err.message);
    } finally {
      setPromoviendo(false);
    }
  };


  const renderFormularioSecciones = (secciones, setSecciones) => (
    <div className="mt-4">
      {secciones.length > 0 && (
        <div className="space-y-3 mb-3">
          {secciones.map((fila, index) => (
            <div
              key={index}
              className="grid grid-cols-1 md:grid-cols-5 gap-2 items-end bg-white border-2 border-gray-200 rounded-lg p-3"
            >
              <div className="md:col-span-2">
                <label className="block text-xs font-medium text-gray-600 mb-1">Curso</label>
                <select
                  value={fila.course}
                  onChange={(e) =>
                    actualizarFila(setSecciones, index, "course", e.target.value)
                  }
                  className="w-full border-2 border-gray-200 rounded-lg px-2 py-2 text-sm focus:outline-none focus:border-[#00AEEF] bg-white"
                >
                  <option value="">
                    {loadingCursos ? "Cargando cursos..." : "Selecciona un curso"}
                  </option>
                  {cursos.map((c) => (
                    <option key={c.id} value={c.id}>
                      {c.codigo_curso} - {c.nombre}
                    </option>
                  ))}
                </select>
              </div>
              <div>
                <label className="block text-xs font-medium text-gray-600 mb-1">NRC</label>
                <input
                  type="text"
                  value={fila.nrc}
                  onChange={(e) =>
                    actualizarFila(setSecciones, index, "nrc", e.target.value)
                  }
                  className="w-full border-2 border-gray-200 rounded-lg px-2 py-2 text-sm focus:outline-none focus:border-[#00AEEF]"
                  placeholder="Ej: 1234"
                />
              </div>
              <div>
                <label className="block text-xs font-medium text-gray-600 mb-1">Semestre</label>
                <select
                  value={fila.semestre}
                  onChange={(e) =>
                    actualizarFila(setSecciones, index, "semestre", e.target.value)
                  }
                  className="w-full border-2 border-gray-200 rounded-lg px-2 py-2 text-sm focus:outline-none focus:border-[#00AEEF] bg-white"
                >
                  <option value="1">1</option>
                  <option value="2">2</option>
                </select>
              </div>
              <div className="flex gap-2">
                <div className="flex-1">
                  <label className="block text-xs font-medium text-gray-600 mb-1">Año</label>
                  <input
                    type="number"
                    value={fila.year}
                    onChange={(e) =>
                      actualizarFila(setSecciones, index, "year", e.target.value)
                    }
                    className="w-full border-2 border-gray-200 rounded-lg px-2 py-2 text-sm focus:outline-none focus:border-[#00AEEF]"
                  />
                </div>
                <button
                  type="button"
                  onClick={() => eliminarFila(setSecciones, index)}
                  className="text-red-600 hover:text-red-800 text-sm px-2"
                  title="Quitar esta asignatura"
                >
                  ✕
                </button>
              </div>
            </div>
          ))}
        </div>
      )}
      <button
        type="button"
        onClick={() => agregarFila(setSecciones)}
        className="text-[#00AEEF] hover:text-[#0099cc] text-sm font-medium transition"
      >
        + Agregar asignatura
      </button>
    </div>
  );

  return (
    <div className="bg-white rounded-lg shadow-lg p-6">
      <h1 className="text-3xl font-bold text-[#003057] mb-6">
        Gestionar Usuarios
      </h1>

      {error && (
        <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded mb-4">
          {error}
        </div>
      )}

      {result && (
        <div className="bg-green-100 border border-green-400 text-green-700 px-4 py-3 rounded mb-4">
          <p className="font-bold">Profesor creado exitosamente</p>
          <p className="mt-1">RUT: {result.user.rut}</p>
          <p>Nombre: {result.user.nombre_completo}</p>
          <p>Contraseña: {result.password}</p>
          {result.sync_secciones > 0 && (
            <p>Secciones sincronizadas: {result.sync_secciones}</p>
          )}
          {result.courses_summary && result.courses_summary.length > 0 && (
            <div className="mt-2">
              <p className="font-semibold">Cursos sincronizados:</p>
              <ul className="list-disc list-inside text-sm mt-1">
                {result.courses_summary.map((item, i) => (
                  <li key={i}>
                    {item.codigo} — {item.nombre}
                    {item.curso_existente ? " (ya existía)" : " (nuevo)"}
                    {" — NRC "}{item.nrc}
                  </li>
                ))}
              </ul>
            </div>
          )}
          {result.error_sync && (
            <p className="text-yellow-700 mt-1">Advertencia: {result.error_sync}</p>
          )}
          {result.manual && (
            <p className="mt-1">
              Asignaturas manuales agregadas: {result.manual.creadas.length}
              {result.manual.errores.length > 0 && (
                <span className="text-yellow-700">
                  {" "}
                  ({result.manual.errores.length} con error: {result.manual.errores.join("; ")})
                </span>
              )}
            </p>
          )}
        </div>
      )}

      <div className="bg-gray-50 border-2 border-[#003057] rounded-lg p-6 mb-6">
        <h2 className="text-xl font-bold text-[#003057] mb-4">
          Crear Profesor desde API UCN
        </h2>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-gray-700 font-semibold mb-2">
              RUT del Profesor *
            </label>
            <input
              type="text"
              value={rut}
              onChange={(e) => setRut(e.target.value)}
              className="w-full px-4 py-2 border-2 border-gray-300 rounded-lg focus:outline-none focus:border-[#00AEEF]"
              placeholder="Ej: 6543250-1 (con guión)"
            />
          </div>

          <div>
            <label className="block text-gray-700 font-semibold mb-2">
              Nombre Completo (opcional)
            </label>
            <input
              type="text"
              value={nombre}
              onChange={(e) => setNombre(e.target.value)}
              className="w-full px-4 py-2 border-2 border-gray-300 rounded-lg focus:outline-none focus:border-[#00AEEF]"
              placeholder="Ej: Juan Pérez"
            />
          </div>

          {/* Asignaturas manuales adicionales, opcional */}
          <div className="border-t border-gray-200 pt-4">
            <p className="text-gray-700 font-semibold mb-1">
              Asignaturas manuales adicionales (opcional)
            </p>
            <p className="text-sm text-gray-500 mb-2">
              Además de lo que sincronice automáticamente la API de la UCN, puedes
              agregarle aquí otras secciones a este profesor.
            </p>
            {renderFormularioSecciones(seccionesNuevoProfesor, setSeccionesNuevoProfesor)}
          </div>

          <button
            type="submit"
            disabled={loading}
            className="bg-[#003057] text-white px-6 py-2 rounded-lg hover:bg-[#004b87] transition disabled:opacity-50"
          >
            {loading ? "Creando..." : "Crear Profesor"}
          </button>
        </form>
      </div>

      {result && result.sections && result.sections.length > 0 && (
        <div className="mb-6">
          <h2 className="text-2xl font-bold text-[#003057] mb-4">
            Secciones Asignadas
          </h2>
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
                {result.sections.map((s) => (
                  <tr key={s.id} className="border-b border-gray-200 hover:bg-gray-50">
                    <td className="py-3 px-4 text-gray-700">{s.nrc}</td>
                    <td className="py-3 px-4 text-gray-700">{s.course_nombre}</td>
                    <td className="py-3 px-4 text-gray-700">{s.semestre} {s.year}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* ── Asignar asignaturas a un profesor existente ── */}
      <div className="bg-gray-50 border-2 border-[#003057] rounded-lg p-6">
        <h2 className="text-xl font-bold text-[#003057] mb-4">
          Agregar Asignatura a Profesor Existente
        </h2>

        <input
          type="text"
          value={busquedaProfesor}
          onChange={(e) => setBusquedaProfesor(e.target.value)}
          placeholder="Buscar profesor por nombre o RUT..."
          className="w-full md:w-96 px-4 py-2 border-2 border-gray-300 rounded-lg focus:outline-none focus:border-[#00AEEF] mb-3"
        />

        {loadingProfesores ? (
          <p className="text-gray-500 text-sm">Cargando profesores...</p>
        ) : (
          <div className="max-h-48 overflow-y-auto border-2 border-gray-200 rounded-lg mb-4 bg-white">
            {profesoresFiltrados.length === 0 ? (
              <p className="text-gray-500 text-sm p-3">No se encontraron profesores.</p>
            ) : (
              profesoresFiltrados.map((p) => (
                <button
                  key={p.id}
                  type="button"
                  onClick={() => handleSeleccionarProfesor(p)}
                  className={`w-full text-left px-4 py-2 text-sm border-b border-gray-100 last:border-b-0 hover:bg-gray-50 transition ${
                    profesorSeleccionado?.id === p.id ? "bg-blue-50" : ""
                  }`}
                >
                  <span className="font-medium text-gray-800">
                    {p.user?.nombre_completo}
                  </span>
                  <span className="text-gray-500 ml-2 font-mono text-xs">
                    {p.user?.rut}
                  </span>
                </button>
              ))
            )}
          </div>
        )}

        {profesorSeleccionado && (
          <div className="bg-white border-2 border-[#00AEEF] rounded-lg p-4">
            <p className="text-sm text-gray-600 mb-2">
              Agregando asignaturas a{" "}
              <span className="font-bold text-[#003057]">
                {profesorSeleccionado.user?.nombre_completo}
              </span>{" "}
              ({profesorSeleccionado.user?.rut})
            </p>

            {asignarError && (
              <div className="bg-red-100 border border-red-400 text-red-700 px-3 py-2 rounded mb-3 text-sm">
                {asignarError}
              </div>
            )}
            {asignarResult && (
              <div className="bg-green-100 border border-green-400 text-green-700 px-3 py-2 rounded mb-3 text-sm">
                {asignarResult.creadas} asignatura(s) agregada(s) correctamente.
                {asignarResult.errores.length > 0 && (
                  <span className="text-yellow-700 block mt-1">
                    {asignarResult.errores.length} con error: {asignarResult.errores.join("; ")}
                  </span>
                )}
              </div>
            )}

            {renderFormularioSecciones(
              seccionesProfesorExistente,
              setSeccionesProfesorExistente
            )}

            <button
              type="button"
              onClick={handleAsignarSecciones}
              disabled={asignando}
              className="mt-4 bg-green-600 text-white px-5 py-2 rounded-lg hover:bg-green-700 transition text-sm disabled:opacity-50"
            >
              {asignando ? "Guardando..." : "Guardar asignaturas"}
            </button>
          </div>
        )}
      </div>

      {/* ── Convertir alumno en profesor ── */}
      <div className="bg-gray-50 border-2 border-[#003057] rounded-lg p-6 mt-6">
        <h2 className="text-xl font-bold text-[#003057] mb-1">
          Convertir Alumno en Profesor
        </h2>
        <p className="text-sm text-gray-500 mb-4">
          El alumno conserva su historial académico (ramos aprobados, PPA, carrera),
          pero pasa a tener rol de profesor.
        </p>

        <input
          type="text"
          value={busquedaAlumno}
          onChange={(e) => setBusquedaAlumno(e.target.value)}
          placeholder="Buscar alumno por nombre o RUT..."
          className="w-full md:w-96 px-4 py-2 border-2 border-gray-300 rounded-lg focus:outline-none focus:border-[#00AEEF] mb-3"
        />

        {promoverError && (
          <div className="bg-red-100 border border-red-400 text-red-700 px-3 py-2 rounded mb-3 text-sm">
            {promoverError}
          </div>
        )}
        {promoverResult && (
          <div className="bg-green-100 border border-green-400 text-green-700 px-3 py-2 rounded mb-3 text-sm">
            <p className="font-bold">
              {promoverResult.user.nombre_completo} ahora es profesor.
            </p>
            {promoverResult.sync_secciones > 0 && (
              <p>Secciones sincronizadas: {promoverResult.sync_secciones}</p>
            )}
            {promoverResult.courses_summary && promoverResult.courses_summary.length > 0 && (
              <div className="mt-1">
                <p className="font-semibold">Cursos sincronizados:</p>
                <ul className="list-disc list-inside text-sm mt-1">
                  {promoverResult.courses_summary.map((item, i) => (
                    <li key={i}>
                      {item.codigo} — {item.nombre}
                      {item.curso_existente ? " (ya existía)" : " (nuevo)"}
                      {" — NRC "}{item.nrc}
                    </li>
                  ))}
                </ul>
              </div>
            )}
            {promoverResult.error_sync && (
              <p className="text-yellow-700 mt-1">
                Advertencia: {promoverResult.error_sync}
              </p>
            )}
          </div>
        )}

        {loadingAlumnos ? (
          <p className="text-gray-500 text-sm">Cargando alumnos...</p>
        ) : (
          <div className="max-h-48 overflow-y-auto border-2 border-gray-200 rounded-lg mb-4 bg-white">
            {alumnosFiltrados.length === 0 ? (
              <p className="text-gray-500 text-sm p-3">No se encontraron alumnos.</p>
            ) : (
              alumnosFiltrados.map((a) => (
                <button
                  key={a.id}
                  type="button"
                  onClick={() => handleSeleccionarAlumno(a)}
                  className={`w-full text-left px-4 py-2 text-sm border-b border-gray-100 last:border-b-0 hover:bg-gray-50 transition ${
                    alumnoSeleccionado?.id === a.id ? "bg-blue-50" : ""
                  }`}
                >
                  <span className="font-medium text-gray-800">
                    {a.user?.nombre_completo}
                  </span>
                  <span className="text-gray-500 ml-2 font-mono text-xs">
                    {a.user?.rut}
                  </span>
                  {a.carrera_nombre && (
                    <span className="text-gray-400 ml-2 text-xs">
                      {a.carrera_nombre}
                    </span>
                  )}
                </button>
              ))
            )}
          </div>
        )}

        {alumnoSeleccionado && (
          <div className="bg-white border-2 border-[#00AEEF] rounded-lg p-4">
            <p className="text-sm text-gray-600 mb-3">
              Alumno seleccionado:{" "}
              <span className="font-bold text-[#003057]">
                {alumnoSeleccionado.user?.nombre_completo}
              </span>{" "}
              ({alumnoSeleccionado.user?.rut})
            </p>
            <button
              type="button"
              onClick={handlePromoverAProfesor}
              disabled={promoviendo}
              className="bg-[#003057] text-white px-5 py-2 rounded-lg hover:bg-[#004b87] transition text-sm disabled:opacity-50"
            >
              {promoviendo ? "Convirtiendo..." : "Convertir en Profesor"}
            </button>
          </div>
        )}
      </div>
    </div>
  );
}

export default ManageUsers;