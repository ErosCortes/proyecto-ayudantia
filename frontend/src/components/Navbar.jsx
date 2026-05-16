
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
              alt="UCN 70"
              className="h-12 md:h-16 cursor-pointer"
            />
          </a>

          <h1 className="text-lg md:text-xl font-bold text-right w-full">
          Ayudantías UCN
        </h1>

        </section>

        {/* Menú desktop */}
        <ul className="hidden md:flex gap-6">
          <li>
            <a href="https://campusvirtual.ucn.cl/login/index.php" className="hover:text-[#00AEEF]">
              Campus Virtual
            </a>
          </li>

          <li>
            <a href="https://portal.ucn.cl/academy/" className="hover:text-[#00AEEF]">
              Mi Banner UCN
            </a>
          </li>

          <li>
            <a href="https://eic.ucn.cl/" className="hover:text-[#00AEEF]">
              Escuela de Ingeniería
            </a>
          </li>
        </ul>


      </nav>
    </header>
  );
}

export default Navbar;