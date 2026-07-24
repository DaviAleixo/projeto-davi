
export default function Header() {
  return (
    <header className="relative z-30 w-full flex justify-between items-center px-6 md:px-16 py-6 select-none bg-transparent">
      {/* Logo com símbolo de infinito sobre o B */}
      <div className="flex flex-col items-start cursor-pointer">
        <div className="flex items-center gap-0.5 relative">
          {/* Símbolo do infinito acima da letra B */}
          <span className="absolute -top-3.5 left-0.5 text-[10px] font-bold text-blue-600 tracking-widest">
            ∞
          </span>
          <span className="text-2xl font-black tracking-tight text-neutral-900">
            Davi<span className="text-blue-600">.</span>
          </span>
        </div>
      </div>

      {/* Navegação e Idiomas */}
      <div className="flex items-center gap-8 md:gap-12">
        <nav className="hidden md:flex items-center gap-10 text-xs font-semibold tracking-wider text-neutral-500">
          <a href="#design" className="hover:text-neutral-950 transition-colors uppercase">Design</a>
          <a href="#projetos" className="hover:text-neutral-950 transition-colors uppercase">Projetos</a>
          <a href="#sobre" className="hover:text-neutral-950 transition-colors uppercase">Sobre mim</a>
        </nav>

        {/* Chaveador de Idiomas */}
        <div className="flex items-center gap-2 text-xs font-bold tracking-widest text-neutral-400">
          <button className="hover:text-neutral-950 transition-colors cursor-pointer">PT</button>
          <span className="text-neutral-300">|</span>
          <button className="text-blue-600 font-extrabold cursor-pointer border-b-2 border-blue-600 pb-0.5">EN</button>
        </div>

        {/* Botão de Contato Premium */}
        <a
          href="mailto:contato@davialeixo.com"
          className="px-6 py-2.5 rounded-sm bg-neutral-950 text-white text-xs font-bold tracking-widest hover:bg-neutral-800 transition-all flex items-center gap-1.5 shadow-[0_4px_12px_rgba(0,0,0,0.08)] cursor-pointer"
        >
          <span>contato@davialeixo.com</span>
          <span className="text-[10px] text-blue-400">↗</span>
        </a>
      </div>
    </header>
  );
}
