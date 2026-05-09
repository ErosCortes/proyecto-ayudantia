import { tutoringOffers } from "../../data/mockData";

function Apply() {
  return (
    <section>

      <h2 className="text-4xl font-bold text-[#003057]">
        Ayudantías Disponibles
      </h2>

      <p className="mt-4 text-gray-600">
        Revisa y postula a ayudantías abiertas.
      </p>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mt-10">

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