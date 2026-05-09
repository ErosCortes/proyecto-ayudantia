import { studentApplications } from "../../data/mockData";

function Applications() {
  const getStatusStyle = (status) => {
    switch (status) {
      case "Aceptada":
        return "bg-green-100 text-green-700";

      case "Rechazada":
        return "bg-red-100 text-red-700";

      default:
        return "bg-yellow-100 text-yellow-700";
    }
  };

  return (
    <section>

      <h2 className="text-4xl font-bold text-[#003057]">
        Mis Postulaciones
      </h2>

      <p className="mt-4 text-gray-600">
        Estado de tus postulaciones realizadas.
      </p>

      <div className="overflow-x-auto mt-10">

        <table className="w-full bg-white rounded-2xl shadow-md overflow-hidden">

          <thead className="bg-[#003057] text-white">

            <tr>

              <th className="text-left px-6 py-4">
                Asignatura
              </th>

              <th className="text-left px-6 py-4">
                Estado
              </th>

              <th className="text-left px-6 py-4">
                Fecha
              </th>

            </tr>

          </thead>

          <tbody>

            {studentApplications.map((application) => (
              <tr
                key={application.id}
                className="border-b"
              >

                <td className="px-6 py-4">
                  {application.subject}
                </td>

                <td className="px-6 py-4">

                  <span
                    className={`px-3 py-1 rounded-full text-sm font-semibold ${getStatusStyle(application.status)}`}
                  >
                    {application.status}
                  </span>

                </td>

                <td className="px-6 py-4">
                  {application.date}
                </td>

              </tr>
            ))}

          </tbody>

        </table>

      </div>

    </section>
  );
}

export default Applications;