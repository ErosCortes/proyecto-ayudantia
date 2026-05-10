function DashboardHome() {
  return (
    <section>

      <h2 className="text-4xl font-bold text-[#003057]">
        Panel del Estudiante
      </h2>

      <p className="mt-3 text-gray-600">
        Bienvenido al portal de ayudantías UCN.
      </p>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mt-10">

        <article className="bg-white p-6 rounded-2xl shadow-md">
          <h3 className="text-2xl font-bold text-[#003057]">
            Ayudantías disponibles
          </h3>

          <p className="mt-3 text-gray-600">
            Revisa ayudantías abiertas para postular.
          </p>
        </article>

        <article className="bg-white p-6 rounded-2xl shadow-md">
          <h3 className="text-2xl font-bold text-[#003057]">
            Estado de postulaciones
          </h3>

          <p className="mt-3 text-gray-600">
            Consulta el estado de tus solicitudes.
          </p>
        </article>

      </div>

    </section>
  );
}

export default DashboardHome;