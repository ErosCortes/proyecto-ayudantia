function AdminHome() {
  return (
    <div className="bg-white rounded-lg shadow-lg p-8">
      <h1 className="text-4xl font-bold text-[#003057] mb-6">
        Panel de Administrador
      </h1>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        
        <div className="bg-gradient-to-br from-[#003057] to-[#004b87] text-white rounded-lg p-6 shadow-lg hover:shadow-xl transition">
          <h3 className="text-2xl font-bold mb-2">Gestionar Cursos</h3>
          <p className="text-gray-200">
            Crea, edita y elimina cursos del sistema
          </p>
        </div>

        <div className="bg-gradient-to-br from-[#00AEEF] to-[#0099cc] text-white rounded-lg p-6 shadow-lg hover:shadow-xl transition">
          <h3 className="text-2xl font-bold mb-2">Gestionar Usuarios</h3>
          <p className="text-gray-200">
            Administra roles y permisos de usuarios
          </p>
        </div>

        <div className="bg-gradient-to-br from-[#004b87] to-[#003057] text-white rounded-lg p-6 shadow-lg hover:shadow-xl transition">
          <h3 className="text-2xl font-bold mb-2">Sistema</h3>
          <p className="text-gray-200">
            Configuración y mantenimiento del sistema
          </p>
        </div>

      </div>

      <div className="mt-8 bg-blue-50 border-l-4 border-[#003057] p-4">
        <h4 className="text-lg font-bold text-[#003057] mb-2">
          Bienvenido al Panel de Administrador
        </h4>
        <p className="text-gray-700">
          Desde aquí puedes gestionar todos los aspectos del sistema de ayudantías.
          Selecciona una opción en el menú lateral para comenzar.
        </p>
      </div>
    </div>
  );
}

export default AdminHome;
