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

        {/* Ayudantías disponibles */}
        <article className="bg-white p-6 rounded-2xl shadow-md">

          <h3 className="text-2xl font-bold text-[#003057]">
            Ayudantías disponibles
          </h3>

          <p className="mt-3 text-gray-600">
            Revisa ayudantías abiertas para postular.
          </p>

          <div className="mt-6 space-y-4">

            {/* SOLO PROGRAMACIÓN 1 */}
            <div className="border rounded-xl p-4 bg-gray-50">

              <h4 className="font-bold text-[#003057]">
                Programación 1
              </h4>

              <p className="text-sm text-gray-600 mt-1">
                Profesor: Eric Ross
              </p>

            </div>

          </div>

        </article>

        {/* Postulaciones */}
        <article className="bg-white p-6 rounded-2xl shadow-md">

          <h3 className="text-2xl font-bold text-[#003057]">
            Estado de postulaciones
          </h3>

          <p className="mt-3 text-gray-600">
            Consulta el estado de tus solicitudes.
          </p>

          <div className="mt-6 space-y-4">

            {/* BASE DE DATOS */}
            <div className="border rounded-xl p-4 bg-gray-50">

              <h4 className="font-bold text-[#003057]">
                Base de Datos
              </h4>

              <p className="text-sm text-green-600 mt-1">
                Estado: Aceptada
              </p>

            </div>

            {/* CÁLCULO 2 */}
            <div className="border rounded-xl p-4 bg-gray-50">

              <h4 className="font-bold text-[#003057]">
                Cálculo 2
              </h4>

              <p className="text-sm text-red-600 mt-1">
                Estado: Rechazada
              </p>

            </div>

          </div>

        </article>

      </div>

    </section>

  );
}

export default DashboardHome;