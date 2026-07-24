import { Button } from "@/components/ui/button"

export default function FormularioDavi() {
  return (
    <div className="relative min-h-screen w-full overflow-hidden bg-gradient-to-br from-[#0B192C] via-[#1E3E62] to-[#000000] font-audiowide">

      {/* ── L1: Spline Background (Marca d'água ocultada no mobile e desktop) ── */}
      <div className="pointer-events-none absolute inset-0 z-0 overflow-hidden">
        <iframe
          src="https://my.spline.design/motiontrails-mQJiWP02BoJRJj7QScWZ8Yil/"
          frameBorder="0"
          title="Motion trails background"
          className="h-[calc(100%+240px)] w-full -mt-16 -mb-[220px] scale-[1.1] sm:scale-[1.05] origin-top"
          style={{ filter: "hue-rotate(60deg) saturate(1.2)" }}
        />
      </div>

      {/* ── L2: Foto no Desktop (Pulsando com origin-bottom sem causar scrollbar) ── */}
      <img
        src="/davi.png"
        alt="Davi"
        className="hidden lg:block absolute bottom-0 right-4 xl:right-16 z-10 h-[82vh] max-h-[720px] w-auto object-contain object-bottom pointer-events-none animate-pulse-scale origin-bottom"
        style={{
          filter:
            "drop-shadow(0 0 50px rgba(59, 130, 246, 0.5)) drop-shadow(0 0 100px rgba(59, 130, 246, 0.3))",
        }}
      />

      {/* ── L3: Conteúdo / Textos ── */}
      <main className="relative z-20 min-h-screen w-full flex flex-col lg:flex-row items-center">
        
        {/* Foto no Mobile (lg:hidden - versão original com charme, mas sem drop-shadow p/ evitar glitch quadrado) */}
        <div className="lg:hidden relative flex-none h-[40vh] min-h-[280px] w-full flex items-center justify-center pt-8 overflow-hidden bg-gradient-to-b from-[#0B1B30] via-[#0E2442]/50 to-transparent">
          {/* Luz azul original cobrindo o topo */}
          <div className="absolute -top-10 inset-x-0 h-40 bg-gradient-to-b from-[#0B1B30] via-[#0E2442] to-transparent pointer-events-none" />
          <div className="absolute top-0 left-1/2 -translate-x-1/2 w-80 h-80 rounded-full bg-blue-500/40 blur-3xl pointer-events-none" />
          
          <img
            src="/davi.png"
            alt="Davi"
            className="relative z-10 max-h-[90%] max-w-[85%] w-auto h-auto object-contain mx-auto translate-y-6 scale-[1.5] [mask-image:linear-gradient(to_bottom,black_85%,transparent_100%)]"
          />
        </div>

        {/* Coluna de Texto */}
        <div className="flex-1 w-full px-6 py-8 sm:px-10 lg:px-16 xl:px-24 lg:pt-12 lg:pb-0 flex flex-col justify-center items-center lg:items-start text-center lg:text-left lg:max-w-[55%]">
          
          {/* Subtítulo */}
          <div className="mb-3 inline-flex items-center gap-2">
            <span className="hidden lg:block h-2 w-2 rounded-full bg-blue-400 shadow-[0_0_12px_rgba(59,130,246,0.9)]" />
            <span className="text-[11px] sm:text-xs font-bold uppercase tracking-[0.2em] text-blue-400">
              DESENVOLVEDOR & WEBDESIGNER
            </span>
          </div>

          {/* Headline */}
          <h1 className="mb-4 text-pretty text-2xl sm:text-3xl lg:text-3xl xl:text-4xl font-extrabold leading-tight tracking-tight text-white max-w-xl">
            TRANSFORMO IDEIAS EM SITES{" "}
            <span className="text-blue-400">QUE GERAM RESULTADOS.</span>
          </h1>

          {/* Descrição / Copy */}
          <p className="mb-6 text-xs sm:text-sm lg:text-sm leading-relaxed text-white/80 max-w-md">
            Preencha o formulário e receba um{" "}
            <strong className="text-white font-semibold">diagnóstico gratuito</strong>{" "}
            de como posso ajudar sua empresa a atrair{" "}
            <span className="text-blue-400 font-semibold">mais leads</span>{" "}
            através do{" "}
            <strong className="text-white font-semibold">Google</strong>{" "}
            e aumentar suas vendas.
          </p>

          {/* Botão Único */}
          <div className="relative w-full sm:w-auto">
            <div className="absolute inset-0 bg-blue-500/40 blur-xl rounded-xl" />
            <a href="/formulario" className="relative block w-full sm:w-auto">
              <Button
                size="lg"
                className="w-full sm:w-auto rounded-xl bg-white px-8 py-3.5 text-xs sm:text-sm font-bold uppercase tracking-wider text-[#0B192C] shadow-[0_0_20px_rgba(255,255,255,0.3)] transition-all duration-300 hover:bg-blue-50 hover:shadow-[0_0_30px_rgba(59,130,246,0.6)] hover:scale-[1.02] active:scale-[0.98]"
              >
                DIAGNÓSTICO GRATUITO
              </Button>
            </a>
          </div>

        </div>
      </main>
    </div>
  )
}
