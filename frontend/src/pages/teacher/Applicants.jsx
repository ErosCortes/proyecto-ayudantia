import { useOutletContext }
  from "react-router-dom";

function Applicants() {

  const { teacherApplicants } =
    useOutletContext();

  const getStatusStyle = (status) => {

    switch (status) {

      case "Aceptado":
        return "bg-green-100 text-green-700";

      case "Rechazado":
        return "bg-red-100 text-red-700";

      default:
        return "bg-yellow-100 text-yellow-700";
    }
  };

  return (
    <section>

      <h2 className="text-4xl font-bold text-[#003057]">
        Postulantes
      </h2>

      <p className="mt-4 text-gray-600">
        Revisa estudiantes postulados.
      </p>

      <div className="overflow-x-auto mt-10">

        <table className="w-full bg-white rounded-2xl shadow-md overflow-hidden">

          <thead className="bg-[#003057] text-white">

            <tr>

              <th className="text-left px-6 py-4">
                Nombre
              </th>

              <th className="text-left px-6 py-4">
                Asignatura
              </th>

              <th className="text-left px-6 py-4">
                Promedio
              </th>

              <th className="text-left px-6 py-4">
                Estado
              </th>

            </tr>

          </thead>

          <tbody>

            {teacherApplicants.map((applicant) => (

              <tr
                key={applicant.id}
                className="border-b"
              >

                <td className="px-6 py-4">
                  {applicant.name}
                </td>

                <td className="px-6 py-4">
                  {applicant.subject}
                </td>

                <td className="px-6 py-4">
                  {applicant.average}
                </td>

                <td className="px-6 py-4">

                  <span
                    className={`px-3 py-1 rounded-full text-sm font-semibold ${getStatusStyle(applicant.status)}`}
                  >
                    {applicant.status}
                  </span>

                </td>

              </tr>
            ))}

          </tbody>

        </table>

      </div>

    </section>
  );
}

export default Applicants;