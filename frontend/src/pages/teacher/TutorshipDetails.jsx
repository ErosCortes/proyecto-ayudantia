import {
  teacherTutorships,
} from "../../data/mockData";

import {
  useParams,
  useOutletContext,
} from "react-router-dom";

function TutorshipDetail() {

  const { id } = useParams();

  const {
    teacherApplicants,
    setTeacherApplicants,
  } = useOutletContext();

  const tutorship =
    teacherTutorships.find(
      (t) => t.id === Number(id)
    );

  const filteredApplicants =
    teacherApplicants.filter(
      (applicant) =>
        applicant.subject ===
        tutorship.subject
    );

  const updateStatus = (
    applicantId,
    newStatus
  ) => {

    const updatedApplicants =
      teacherApplicants.map(
        (applicant) => {

          if (
            applicant.id === applicantId
          ) {

            return {
              ...applicant,
              status: newStatus,
            };
          }

          return applicant;
        }
      );

    setTeacherApplicants(updatedApplicants);
  };

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
        {tutorship.subject}
      </h2>

      <p className="mt-4 text-gray-600">
        Gestiona postulantes de esta ayudantía.
      </p>

      <div className="mt-10 space-y-6">

        {filteredApplicants.map((applicant) => (

          <article
            key={applicant.id}
            className="bg-white rounded-2xl shadow-md p-6"
          >

            <h3 className="text-2xl font-bold text-[#003057]">
              {applicant.name}
            </h3>

            <p className="mt-3 text-gray-700">
              <strong>Promedio:</strong>
              {" "}
              {applicant.average}
            </p>

            <div className="mt-4">

              <span
                className={`px-3 py-1 rounded-full text-sm font-semibold ${getStatusStyle(applicant.status)}`}
              >
                {applicant.status}
              </span>

            </div>

            {applicant.status === "Pendiente" && (

              <div className="flex gap-3 mt-6">

                <button
                  onClick={() =>
                    updateStatus(
                      applicant.id,
                      "Aceptado"
                    )
                  }
                  className="bg-green-500 text-white px-5 py-3 rounded-xl hover:opacity-80 transition"
                >
                  Aceptar
                </button>

                <button
                  onClick={() =>
                    updateStatus(
                      applicant.id,
                      "Rechazado"
                    )
                  }
                  className="bg-red-500 text-white px-5 py-3 rounded-xl hover:opacity-80 transition"
                >
                  Rechazar
                </button>

              </div>
            )}

          </article>
        ))}

      </div>

    </section>
  );
}

export default TutorshipDetail;