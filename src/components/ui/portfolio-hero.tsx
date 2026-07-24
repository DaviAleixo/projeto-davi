import React, { useState, useEffect, useMemo } from "react";
import { Link } from "react-router-dom";

// BlurText animation component
interface BlurTextProps {
  text: string;
  delay?: number;
  animateBy?: "words" | "letters";
  direction?: "top" | "bottom";
  className?: string;
  style?: React.CSSProperties;
}

const BlurText: React.FC<BlurTextProps> = ({
  text,
  delay = 30,
  animateBy = "words",
  direction = "top",
  className = "",
  style,
}) => {
  const [inView] = useState(true); // Start as true for instant above-the-fold rendering

  const segments = useMemo(() => {
    return animateBy === "words" ? text.split(" ") : text.split("");
  }, [text, animateBy]);

  return (
    <p className={`inline-flex flex-wrap ${className}`} style={style}>
      {segments.map((segment, i) => (
        <span
          key={i}
          style={{
            display: "inline-block",
            filter: inView ? "blur(0px)" : "blur(10px)",
            opacity: inView ? 1 : 0,
            transform: inView ? "translateY(0)" : `translateY(${direction === "top" ? "-20px" : "20px"})`,
            transition: `all 0.4s ease-out ${i * delay}ms`,
          }}
        >
          {segment}
          {animateBy === "words" && i < segments.length - 1 ? "\u00A0" : ""}
        </span>
      ))}
    </p>
  );
};

export default function PortfolioHero() {
  useEffect(() => {
    document.documentElement.classList.add("dark");
  }, []);

  return (
    <div 
      className="min-h-screen text-foreground transition-colors overflow-hidden relative flex flex-col justify-center items-center selection:bg-[#2563EB]/30 selection:text-white"
      style={{
        backgroundColor: "#000000",
        color: "hsl(0 0% 98%)",
      }}
    >
      {/* Background patterns & glows */}
      <div className="absolute inset-0 bg-[radial-gradient(ellipse_80%_80%_at_50%_-20%,rgba(37,99,235,0.08),rgba(255,255,255,0))]" />
      <div className="absolute top-[10%] left-[5%] w-[40vw] h-[40vw] rounded-full bg-blue-600/[0.03] blur-[140px] pointer-events-none" />
      <div className="absolute bottom-[10%] right-[5%] w-[45vw] h-[45vw] rounded-full bg-blue-500/[0.02] blur-[160px] pointer-events-none" />

      {/* Grid overlay */}
      <div className="absolute inset-0 bg-[linear-gradient(to_right,rgba(255,255,255,0.005)_1px,transparent_1px),linear-gradient(to_bottom,rgba(255,255,255,0.005)_1px,transparent_1px)] bg-[size:4rem_4rem] [mask-image:radial-gradient(ellipse_60%_50%_at_50%_50%,#000_80%,transparent_100%)] pointer-events-none" />

      {/* Hero Section */}
      <main className="relative z-10 w-full max-w-7xl mx-auto px-6 flex flex-col items-center">
        
        <section className="flex flex-col justify-center items-center">
          {/* Hero Title Area */}
          <div className="relative text-center select-none py-12 flex flex-col items-center justify-center">
            
            {/* Subtle Backlight Glow for Text & Photo */}
            <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[280px] h-[280px] sm:w-[380px] sm:h-[380px] rounded-full bg-gradient-to-tr from-[#2563EB]/20 to-transparent blur-[80px] pointer-events-none z-0" />

            <div className="relative z-10">
              <div>
                <BlurText
                  text="DAVI"
                  delay={50}
                  animateBy="letters"
                  direction="top"
                  className="font-extrabold text-[100px] sm:text-[140px] md:text-[180px] lg:text-[210px] leading-[0.75] tracking-tighter uppercase justify-center whitespace-nowrap bg-gradient-to-b from-white via-white to-neutral-400 bg-clip-text text-transparent"
                  style={{ fontFamily: "'Fira Code', monospace" }}
                />
              </div>
              <div>
                <BlurText
                  text="ALEIXO"
                  delay={50}
                  animateBy="letters"
                  direction="top"
                  className="font-extrabold text-[100px] sm:text-[140px] md:text-[180px] lg:text-[210px] leading-[0.75] tracking-tighter uppercase justify-center whitespace-nowrap bg-gradient-to-r from-[#2563EB] via-blue-500 to-white bg-clip-text text-transparent"
                  style={{ fontFamily: "'Fira Code', monospace" }}
                />
              </div>

              {/* Profile Picture - Perfectly Centered Overlay (Rounded Square) */}
              <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 z-20">
                <div className="w-[75px] h-[120px] sm:w-[105px] sm:h-[165px] md:w-[125px] md:h-[195px] lg:w-[145px] lg:h-[225px] rounded-[40px] overflow-hidden border border-white/10 shadow-[0_0_50px_rgba(37,99,235,0.35)] transition-transform duration-300 hover:scale-110 cursor-pointer">
                  <img
                    src="https://i.postimg.cc/y8DnKLyK/albert-dera-ILip77-Sbm-OE-unsplash.jpg"
                    alt="Davi Aleixo"
                    className="w-full h-full object-cover"
                  />
                </div>
              </div>
            </div>
          </div>

          {/* Tagline & Call-to-Action */}
          <div className="w-full max-w-xl flex flex-col items-center gap-8 pt-4 z-20">
            <div className="flex justify-center max-w-lg">
              <h2 className="text-lg sm:text-2xl text-center text-white font-bold tracking-tight leading-snug">
                Design que atrai. Estrutura que vende.
              </h2>
            </div>
            <div className="flex justify-center max-w-lg">
              <p className="text-xs sm:text-sm text-center text-neutral-300 font-medium leading-relaxed max-w-md">
                Preencha o formulário e faça seu diagnóstico gratuito para descobrir como melhorar sua página e converter mais clientes.
              </p>
            </div>
            
            <div className="relative group mt-4">
              <div className="absolute -inset-0.5 bg-gradient-to-r from-[#2563EB] to-blue-500 rounded-full blur opacity-30 group-hover:opacity-60 transition duration-300" />
              <Link
                to="/formulario"
                className="relative flex items-center justify-center px-12 py-5 bg-white hover:bg-neutral-100 text-black rounded-full font-bold text-xs sm:text-sm uppercase tracking-widest transition-all duration-300 cursor-pointer shadow-[0_4px_20px_rgba(255,255,255,0.15)]"
              >
                Iniciar Diagnóstico Gratuito
                <span className="ml-2.5 group-hover:translate-x-1 transition-transform duration-200">→</span>
              </Link>
            </div>
          </div>
        </section>
      </main>
    </div>
  );
}

