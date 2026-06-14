function DashboardHomeTeacher() {
  return (
    <section>

      <h2 className="text-4xl font-bold text-[#003057]">
        Panel del Profesor
      </h2>

      <p className="mt-3 text-gray-600">
        Gestiona ayudantías y revisa postulantes.
      </p>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mt-10">

        <article className="bg-white p-6 rounded-2xl shadow-md">

          <h3 className="text-2xl font-bold text-[#003057]">
            Ayudantías activas
          </h3>

          <p className="mt-3 text-gray-600">
            Administra tus ayudantías disponibles.
          </p>

        </article>

        <article className="bg-white p-6 rounded-2xl shadow-md">

          <h3 className="text-2xl font-bold text-[#003057]">
            Postulantes
          </h3>

          <p className="mt-3 text-gray-600">
            Revisa estudiantes postulados.
          </p>

        </article>

      </div>

    </section>
  );
}

export default DashboardHomeTeacher;