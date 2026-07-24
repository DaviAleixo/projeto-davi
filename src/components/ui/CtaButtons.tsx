import { Link } from "react-router-dom";

export default function CtaButtons() {
  return (
    <div className="flex flex-col sm:flex-row items-center gap-4 pointer-events-auto select-none">
      {/* Botão 1: Desenvolvedor (Fundo Escuro) */}
      <Link
        to="/formulario"
        className="w-full sm:w-auto px-8 py-4 bg-neutral-950 text-white rounded-md text-xs font-bold tracking-wider hover:bg-neutral-800 transition-all flex items-center justify-center gap-2 shadow-[0_4px_15px_rgba(0,0,0,0.15)] group"
      >
        <span>Você precisa de um desenvolvedor</span>
        <span className="text-[10px] text-blue-400 group-hover:translate-x-0.5 group-hover:-translate-y-0.5 transition-transform">↗</span>
      </Link>

      {/* Botão 2: Designer (Fundo Claro com borda azul) */}
      <Link
        to="/formulario"
        className="w-full sm:w-auto px-8 py-4 bg-white text-blue-600 border border-blue-600/30 rounded-md text-xs font-bold tracking-wider hover:bg-blue-50/50 hover:border-blue-600 transition-all flex items-center justify-center gap-2 group"
      >
        <span>Você precisa de um designer</span>
        <span className="text-[10px] text-blue-600 group-hover:translate-x-0.5 group-hover:-translate-y-0.5 transition-transform">↗</span>
      </Link>
    </div>
  );
}
