import React from "react";
import { Link } from "react-router-dom";

export default function Hero() {
  return (
    <main className="relative flex-grow w-full flex flex-col justify-between items-center px-6 md:px-16 pb-12 mt-12 md:mt-16 select-none z-10">
      
      {/* 1. Aura Azul Abstrata no Fundo Geral */}
      <div className="absolute top-[45%] left-[55%] -translate-x-1/2 -translate-y-1/2 w-[60vw] h-[60vw] max-w-[800px] rounded-full bg-blue-200/20 blur-[130px] pointer-events-none z-0" />

      {/* 2. Tagline Superior */}
      <div className="relative z-30 flex flex-col items-center justify-center text-center">
        <p className="text-sm md:text-base font-medium tracking-wide text-neutral-800 flex items-center gap-1.5">
          <span>👋</span> , meu nome é Davi e eu sou
        </p>
      </div>

      {/* 3. Bloco de Títulos Gigantes (Camada z-10) */}
      <div className="relative w-full flex flex-col items-center justify-center text-center my-auto py-8">
        
        {/* Título Superior: Desenvolvedor (Sólido Preto) */}
        <h2 className="text-[10vw] font-black tracking-tighter leading-none text-neutral-900 uppercase z-10 select-none">
          Desenvolvedor
        </h2>

        {/* Título Inferior: & Webdesigner (Vazado Azul) */}
        <h2 
          className="text-[9.5vw] font-black tracking-tighter leading-[0.8] uppercase z-10 select-none"
          style={{
            WebkitTextStroke: "1.5px #2563EB",
            color: "transparent"
          }}
        >
          & Webdesigner
        </h2>

        {/* 4. MOLDURA E FOTO DA PESSOA (Z-20) com Glow e Degradê de Integração */}
        <div className="absolute bottom-[-40px] left-1/2 -translate-x-1/2 w-full max-w-[480px] h-[55vh] md:h-[65vh] lg:h-[72vh] z-20 pointer-events-none flex justify-center items-end">
          
          {/* Brilho Azul (Glow/Aura) exatamente atrás da cabeça e ombros */}
          <div className="absolute top-[25%] left-1/2 -translate-x-1/2 w-[320px] h-[320px] rounded-full bg-blue-500/25 blur-[70px] z-0 pointer-events-none animate-pulse" style={{ animationDuration: '4s' }} />

          {/* Imagem do Davi */}
          <img
            src="/davi.png"
            alt="Davi Aleixo Portrait"
            className="h-full w-auto object-contain object-bottom relative z-10"
          />

          {/* Degradê na cor exata do fundo para suavizar a base reta da foto e integrá-la ao background */}
          <div className="absolute inset-x-0 bottom-0 h-32 bg-gradient-to-t from-[#F6F8FA] via-[#F6F8FA]/70 to-transparent z-30 pointer-events-none" />

        </div>

      </div>

      {/* 5. Rodapé Simplificado (Botão centralizado na frente de tudo - z-30) */}
      <div className="relative z-30 w-full flex justify-center mt-auto pt-6">
        <Link
          to="/formulario"
          className="w-full sm:w-auto px-10 py-4 bg-neutral-950 text-white rounded-md text-xs font-bold tracking-widest hover:bg-neutral-800 transition-all flex items-center justify-center gap-2 shadow-[0_4px_15px_rgba(0,0,0,0.15)] group cursor-pointer"
        >
          <span>Fazer diagnóstico gratuito</span>
          <span className="text-[10px] text-blue-400 group-hover:translate-x-0.5 group-hover:-translate-y-0.5 transition-transform">↗</span>
        </Link>
      </div>

    </main>
  );
}
