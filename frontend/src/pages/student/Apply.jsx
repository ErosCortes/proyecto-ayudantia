import { tutoringOffers } from "../../data/mockData";
import { useOutletContext } from "react-router-dom";

function Apply() {

  const { applications, setApplications } =
    useOutletContext();

  const handleApply = (offer) => {

    // Verifica si ya postuló
    const alreadyApplied = applications.some(
      (app) => app.subject === offer.subject
    );

    if (alreadyApplied) {

      alert("Ya postulaste a esta ayudantía");
      return;

    }

    // Nueva postulación mock
    const newApplication = {

      id: applications.length + 1,
      student: "Lucas Trujillo",
      subject: offer.subject,
      status: "Pendiente",
      date: new Date().toLocaleDateString(),

};

    // Actualiza estado
    setApplications([
      ...applications,
      newApplication,
    ]);

    alert("Postulación enviada");

  };

  return (

    <section>

      <h2 className="text-4xl font-bold text-[#003057]">
        Ayudantías Disponibles
      </h2>

      <p className="mt-4 text-gray-600">
        Revisa y postula a ayudantías abiertas.
      </p>

      <div className="grid grid-cols-1 gap-6 mt-10">

        {tutoringOffers.map((offer) => (

          <article
            key={offer.id}
            className="bg-white rounded-2xl shadow-md p-6"
          >

            <h3 className="text-2xl font-bold text-[#003057]">
              {offer.subject}
            </h3>

            <p className="mt-3 text-gray-700">
              <strong>Profesor:</strong> {offer.professor}
            </p>

            <p className="mt-2 text-gray-700">
              <strong>Cupos:</strong> {offer.slots}
            </p>

            <p className="mt-2 text-gray-700">
              <strong>Requisitos:</strong> {offer.requirements}
            </p>

            <button
              onClick={() => handleApply(offer)}
              className="mt-6 bg-[#00AEEF] text-white px-5 py-3 rounded-xl hover:opacity-80 transition"
            >
              Postular
            </button>

          </article>

        ))}

      </div>

    </section>

  );
}

export default Apply;