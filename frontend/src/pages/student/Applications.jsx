import { studentApplications } from "../../data/mockData";
import { useOutletContext } from "react-router-dom";

function Applications() {

  const { applications } = useOutletContext();

  return (
    <section>

      <h2 className="text-4xl font-bold text-[#003057]">
        Mis Postulaciones
      </h2>

      <p className="mt-4 text-gray-600">
        Revisa el estado de tus postulaciones.
      </p>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mt-10">

        {applications.map((application) => (

          <article
            key={application.id}
            className="bg-white rounded-2xl shadow-md p-6"
          >

            <h3 className="text-2xl font-bold text-[#003057]">
              {application.subject}
            </h3>

            <p className="mt-3 text-gray-700">
              <strong>Estado:</strong> {application.status}
            </p>

            <p className="mt-2 text-gray-700">
              <strong>Fecha:</strong> {application.date}
            </p>

          </article>
        ))}

      </div>

    </section>
  );
}

export default Applications;