function Navbar() {
  return (
    <header className="bg-[#003057] text-white shadow-lg">
      <nav className="max-w-7xl mx-auto px-4 py-3 flex justify-between items-center">

        {/* Logo + título */}
        <section className="flex items-center gap-3">
          
          <a
            href="https://www.ucn.cl"
            target="_blank"
            rel="noreferrer"
          >
            <img
              src="/logo70azul.png"
              alt="UCN"
              className="h-12 md:h-16 cursor-pointer"
            />
          </a>

          <h1 className="text-lg md:text-xl font-bold">
            Ayudantías UCN
          </h1>

        </section>

        {/* Menú desktop */}
        <ul className="hidden md:flex gap-6">
          <li>
            <a href="#" className="hover:text-[#00AEEF]">
              Inicio
            </a>
          </li>

          <li>
            <a href="#" className="hover:text-[#00AEEF]">
              Perfil
            </a>
          </li>

          <li>
            <a href="#" className="hover:text-[#00AEEF]">
              Contacto
            </a>
          </li>
        </ul>

      </nav>
    </header>
  );
}

export default Navbar;