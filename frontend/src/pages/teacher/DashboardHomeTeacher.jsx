import {
  tutoringOffers,
  studentApplications
} from "../../data/mockData";

function DashboardHomeTeacher() {

  return (

    <section>

      <h2 className="text-4xl font-bold text-[#003057]">
        Panel del Profesor
      </h2>

      <p className="mt-3 text-gray-600">
        Gestiona tus ayudantías y revisa postulaciones de estudiantes.
      </p>

      <div className="grid grid-cols-1 gap-8 mt-10">

        {/* AYUDANTÍAS ACTIVAS */}
        <article className="bg-white p-6 rounded-2xl shadow-md">

          <h3 className="text-2xl font-bold text-[#003057]">
            Mis ayudantías activas
          </h3>

          <div className="mt-6 space-y-4">

            {tutoringOffers.map((offer) => (

              <div
                key={offer.id}
                className="border rounded-xl p-4 bg-gray-50 flex justify-between items-center"
              >

                <div>

                  <h4 className="font-bold text-[#003057]">
                    {offer.subject}
                  </h4>

                  <p className="text-sm text-gray-600">
                    Cupos disponibles: {offer.slots}
                  </p>

                </div>

                <span className="text-xs px-3 py-1 rounded-full bg-blue-100 text-blue-700">
                  Activa
                </span>

              </div>

            ))}

          </div>

        </article>

        {/* POSTULANTES */}
        <article className="bg-white p-6 rounded-2xl shadow-md">

          <h3 className="text-2xl font-bold text-[#003057]">
            Postulaciones recibidas
          </h3>

          <p className="mt-3 text-gray-600">
            Estudiantes que han postulado a tus ayudantías.
          </p>

          <div className="mt-6 space-y-4">

            {studentApplications.map((app) => (

              <div
                key={app.id}
                className="border rounded-xl p-4 bg-gray-50"
              >

                <div className="flex justify-between items-center">

                  <div>

                    <h4 className="font-bold text-[#003057]">
                      {app.subject}
                    </h4>

                    <p className="text-sm text-gray-600">
                      Estudiante: {app.student || "Alumno"}
                    </p>

                  </div>

                  {/* estado visual */}
                  <span
                    className={`text-xs px-3 py-1 rounded-full ${
                      app.status === "Aceptada"
                        ? "bg-green-100 text-green-700"
                        : app.status === "Rechazada"
                        ? "bg-red-100 text-red-700"
                        : "bg-yellow-100 text-yellow-700"
                    }`}
                  >
                    {app.status}
                  </span>

                </div>

              </div>

            ))}

          </div>

        </article>

      </div>

    </section>

  );
}

export default DashboardHomeTeacher;