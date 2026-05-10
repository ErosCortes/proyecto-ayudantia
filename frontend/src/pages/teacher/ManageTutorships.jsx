import { teacherTutorships }
  from "../../data/mockData";

import { useNavigate }
  from "react-router-dom";

function ManageTutorships() {

  const navigate = useNavigate();

  const handleManage = (id) => {

    navigate(`/teacher/tutorship/${id}`);
  };

  return (
    <section>

      <h2 className="text-4xl font-bold text-[#003057]">
        Gestionar Ayudantías
      </h2>

      <p className="mt-4 text-gray-600">
        Administra tus ayudantías activas.
      </p>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mt-10">

        {teacherTutorships.map((tutorship) => (

          <article
            key={tutorship.id}
            className="bg-white rounded-2xl shadow-md p-6"
          >

            <h3 className="text-2xl font-bold text-[#003057]">
              {tutorship.subject}
            </h3>

            <p className="mt-3 text-gray-700">
              <strong>Postulantes:</strong>
              {" "}
              {tutorship.applicants}
            </p>

            <p className="mt-2 text-gray-700">
              <strong>Cupos:</strong>
              {" "}
              {tutorship.slots}
            </p>

            <button
              onClick={() =>
                handleManage(tutorship.id)
              }
              className="mt-6 bg-[#00AEEF] text-white px-5 py-3 rounded-xl hover:opacity-80 transition"
            >
              Gestionar
            </button>

          </article>
        ))}

      </div>

    </section>
  );
}

export default ManageTutorships;