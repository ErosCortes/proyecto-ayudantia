function Profile() {

  const userEmail =
    localStorage.getItem("userEmail");

  return (

    <section>

      <h2 className="text-4xl font-bold text-[#003057]">
        Mi Perfil
      </h2>

      <p className="mt-3 text-gray-600">
        Información personal y académica del estudiante.
      </p>

      <div className="bg-white rounded-2xl shadow-md p-8 mt-10 max-w-3xl">

        {/* Header Perfil */}
        <div className="flex items-center gap-6 border-b pb-6">

          <div className="w-24 h-24 rounded-full bg-[#003057] text-white flex items-center justify-center text-4xl font-bold">

            L

          </div>

          <div>

            <h3 className="text-3xl font-bold text-[#003057]">
              Lucas Trujillo
            </h3>

            <p className="text-gray-500 mt-1">
              Estudiante
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
              {userEmail || "lucas@alumnos.ucn.cl"}
            </p>

          </article>

          <article className="bg-gray-50 rounded-xl p-5">

            <h4 className="text-sm text-gray-500 font-semibold">
              Carrera
            </h4>

            <p className="mt-2 text-[#003057] font-medium">
              Ingeniería Civil en Computación e Informatica
            </p>

          </article>

          <article className="bg-gray-50 rounded-xl p-5">

            <h4 className="text-sm text-gray-500 font-semibold">
              Escuela
            </h4>

            <p className="mt-2 text-[#003057] font-medium">
              Escuela de Ingeniería
            </p>

          </article>

          <article className="bg-gray-50 rounded-xl p-5">

            <h4 className="text-sm text-gray-500 font-semibold">
              Año de ingreso
            </h4>

            <p className="mt-2 text-[#003057] font-medium">
              2023
            </p>

          </article>

        </div>

      </div>

    </section>

  );
}

export default Profile;