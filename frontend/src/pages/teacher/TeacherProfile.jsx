function TeacherProfile() {

  const userEmail =
    localStorage.getItem("userEmail");

  return (

    <section>

      <h2 className="text-4xl font-bold text-[#003057]">
        Perfil del Profesor
      </h2>

      <p className="mt-3 text-gray-600">
        Información académica y gestión docente.
      </p>

      <div className="bg-white rounded-2xl shadow-md p-8 mt-10 max-w-4xl">

        {/* Header Perfil */}
        <div className="flex items-center gap-6 border-b pb-6">

          <img
              src="/fotoross.jpg"
              alt="Profesor"
              className="w-24 h-24 rounded-full object-cover border-4 border-[#003057]"
            />

          <div>

            <h3 className="text-3xl font-bold text-[#003057]">
              Eric Ross
            </h3>

            <p className="text-gray-500 mt-1">
              Profesor
            </p>

          </div>

        </div>

        {/* Datos */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mt-8">

          <article className="bg-gray-50 rounded-xl p-5">

            <h4 className="text-sm text-gray-500 font-semibold">
              Correo Institucional
            </h4>

            <p className="mt-2 text-[#003057] font-medium break-all">
              {userEmail || "profesorucntest@gmail.com"}
            </p>

          </article>

          <article className="bg-gray-50 rounded-xl p-5">

            <h4 className="text-sm text-gray-500 font-semibold">
              Escuela
            </h4>

            <p className="mt-2 text-[#003057] font-medium">
              Escuela de Ingenieria
            </p>

          </article>

          <article className="bg-gray-50 rounded-xl p-5">

            <h4 className="text-sm text-gray-500 font-semibold">
              Cargo
            </h4>

            <p className="mt-2 text-[#003057] font-medium">
              Big boss
            </p>

          </article>

          <article className="bg-gray-50 rounded-xl p-5">

            <h4 className="text-sm text-gray-500 font-semibold">
              Activo desde:
            </h4>

            <p className="mt-2 text-[#003057] font-medium">
              1945
            </p>

          </article>

        </div>

      </div>

    </section>

  );
}

export default TeacherProfile;