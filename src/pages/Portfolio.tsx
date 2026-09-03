import React, { useRef, useState, useEffect, memo, useCallback, useMemo } from 'react';
import { motion, useScroll, useTransform, MotionValue } from 'framer-motion';
import { useNavigate } from 'react-router-dom';

// --- REUSABLE COMPONENTS ---

// 1. ContactButton
export const ContactButton: React.FC<{ text?: string; onClick?: () => void }> = memo(({ text = "Fale Comigo", onClick }) => {
  return (
    <button
      onClick={onClick}
      className="rounded-full text-white font-medium uppercase tracking-widest transition-transform duration-200 hover:scale-105 active:scale-95 px-8 py-3 sm:px-10 sm:py-3.5 md:px-12 md:py-4 text-xs sm:text-sm md:text-base cursor-pointer"
      style={{
        background: 'linear-gradient(123deg, #020617 7%, #1e3a8a 37%, #2563eb 72%, #38bdf8 100%)',
        boxShadow: '0px 4px 4px rgba(37, 99, 235, 0.25), inset 4px 4px 12px #1d4ed8',
        outline: '2px solid white',
        outlineOffset: '-3px',
      }}
    >
      {text}
    </button>
  );
});

// 2. LiveProjectButton
export const LiveProjectButton: React.FC<{ text?: string; onClick?: () => void }> = memo(({ text = "Projeto ao vivo", onClick }) => {
  return (
    <button 
      onClick={onClick}
      className="rounded-full border-2 border-[#D7E2EA] text-[#D7E2EA] font-medium uppercase tracking-widest px-8 py-3 sm:px-10 sm:py-3.5 text-sm sm:text-base hover:bg-[#D7E2EA]/10 transition-colors duration-200 cursor-pointer"
    >
      {text}
    </button>
  );
});

// 3. FadeIn Component
interface FadeInProps {
  children: React.ReactNode;
  delay?: number;
  duration?: number;
  x?: number;
  y?: number;
  as?: keyof JSX.IntrinsicElements;
  className?: string;
}

export const FadeIn = memo<FadeInProps>(({
  children,
  delay = 0,
  duration = 0.7,
  x = 0,
  y = 30,
  as = 'div',
  className = '',
}) => {
  const MotionComponent = motion.create(as);
  return (
    <MotionComponent
      className={className}
      initial={{ opacity: 0, x, y }}
      whileInView={{ opacity: 1, x: 0, y: 0 }}
      viewport={{ once: true, margin: "50px", amount: 0 }}
      transition={{
        delay,
        duration,
        ease: [0.25, 0.1, 0.25, 1],
      }}
    >
      {children}
    </MotionComponent>
  );
});

// 4. Magnet Component
interface MagnetProps {
  children: React.ReactNode;
  padding?: number;
  strength?: number;
  activeTransition?: string;
  inactiveTransition?: string;
  className?: string;
}

export const Magnet: React.FC<MagnetProps> = ({
  children,
  padding = 150,
  strength = 3,
  activeTransition = "transform 0.3s ease-out",
  inactiveTransition = "transform 0.6s ease-in-out",
  className = '',
}) => {
  const [transform, setTransform] = useState({ x: 0, y: 0 });
  const [transition, setTransition] = useState(inactiveTransition);
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handleMouseMove = (e: MouseEvent) => {
      if (!ref.current) return;
      const rect = ref.current.getBoundingClientRect();
      const elementCenterX = rect.left + rect.width / 2;
      const elementCenterY = rect.top + rect.height / 2;
      
      const distanceX = e.clientX - elementCenterX;
      const distanceY = e.clientY - elementCenterY;
      const distance = Math.sqrt(distanceX * distanceX + distanceY * distanceY);
      
      const maxDistance = Math.max(rect.width, rect.height) / 2 + padding;
      
      if (distance < maxDistance) {
        setTransition(activeTransition);
        setTransform({
          x: distanceX / strength,
          y: distanceY / strength,
        });
      } else {
        setTransition(inactiveTransition);
        setTransform({ x: 0, y: 0 });
      }
    };

    const handleMouseLeave = () => {
      setTransition(inactiveTransition);
      setTransform({ x: 0, y: 0 });
    };

    window.addEventListener('mousemove', handleMouseMove);
    ref.current?.addEventListener('mouseleave', handleMouseLeave);

    return () => {
      window.removeEventListener('mousemove', handleMouseMove);
      ref.current?.removeEventListener('mouseleave', handleMouseLeave);
    };
  }, [padding, strength, activeTransition, inactiveTransition]);

  return (
    <div
      ref={ref}
      className={className}
      style={{
        transform: `translate3d(${transform.x}px, ${transform.y}px, 0)`,
        transition,
        willChange: 'transform',
      }}
    >
      {children}
    </div>
  );
};

// 5. AnimatedText Component
interface AnimatedTextProps {
  text: string;
  className?: string;
}

export const AnimatedText: React.FC<AnimatedTextProps> = ({ text, className = '' }) => {
  const containerRef = useRef<HTMLParagraphElement>(null);
  const { scrollYProgress } = useScroll({
    target: containerRef,
    offset: ['start 0.8', 'end 0.2'],
  });

  const chars = text.split('');

  return (
    <p ref={containerRef} className={className + " inline-block flex-wrap justify-center text-center"}>
      {chars.map((char, index) => (
        <Character
          key={index}
          char={char}
          index={index}
          total={chars.length}
          progress={scrollYProgress}
        />
      ))}
    </p>
  );
};

interface CharacterProps {
  char: string;
  index: number;
  total: number;
  progress: MotionValue<number>;
}

const Character: React.FC<CharacterProps> = ({ char, index, total, progress }) => {
  const start = index / total;
  const end = (index + 1) / total;
  const opacity = useTransform(progress, [start, end], [0.2, 1]);

  return (
    <span className="relative inline-block select-none">
      <span className="opacity-0">{char === ' ' ? '\u00A0' : char}</span>
      <motion.span style={{ opacity }} className="absolute left-0 top-0">
        {char === ' ' ? '\u00A0' : char}
      </motion.span>
    </span>
  );
};


// --- SECTIONS ---

// 1. HeroSection
const HeroSection = memo(() => {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  const scrollToSection = useCallback((id: string) => {
    setMobileMenuOpen(false);
    const element = document.getElementById(id);
    if (element) {
      element.scrollIntoView({ behavior: 'smooth' });
    }
  }, []);

  const navLinks = [
    { label: "Sobre", id: "about" },
    { label: "Serviços", id: "services" },
    { label: "Projetos", id: "marquee" },
    { label: "Diferenciais", id: "differentials" },
    { label: "Trajetória", id: "experience" },
    { label: "Contato", id: "contact" }
  ];

  return (
    <section className="relative min-h-screen w-full flex flex-col justify-between overflow-hidden bg-[#0C0C0C]">
      {/* ================= DESKTOP NAVBAR ================= */}
      <FadeIn as="nav" delay={0} y={-20} className="hidden md:flex w-full justify-between items-center px-6 md:px-10 pt-6 md:pt-8 z-30">
        {navLinks.slice(0, 5).map((link) => (
          <a
            key={link.id}
            href={`#${link.id}`}
            onClick={(e) => {
              e.preventDefault();
              scrollToSection(link.id);
            }}
            className="text-[#D7E2EA] font-medium uppercase tracking-wider text-sm md:text-lg lg:text-[1.4rem] transition-opacity duration-200 hover:opacity-70"
          >
            {link.label}
          </a>
        ))}
      </FadeIn>

      {/* ================= MOBILE NAVBAR ================= */}
      <div className="flex md:hidden w-full justify-between items-center px-6 pt-6 z-40">
        {/* Logo */}
        <div className="flex flex-col text-left select-none">
          <span className="text-xs font-black text-white uppercase tracking-wider leading-tight">DAVI</span>
          <span className="text-xs font-black text-white uppercase tracking-wider leading-tight">ALEIXO</span>
        </div>

        {/* Hamburger Menu Toggle */}
        <button
          onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
          className="text-white p-2 focus:outline-none cursor-pointer"
          aria-label="Abrir Menu"
        >
          <div className="w-6 h-4 flex flex-col justify-between items-end">
            <span className={`h-[2px] bg-white rounded-full transition-all duration-300 ${mobileMenuOpen ? 'w-6 rotate-45 translate-y-[7px]' : 'w-6'}`}></span>
            <span className={`h-[2px] bg-white rounded-full transition-all duration-300 ${mobileMenuOpen ? 'opacity-0' : 'w-4'}`}></span>
            <span className={`h-[2px] bg-white rounded-full transition-all duration-300 ${mobileMenuOpen ? 'w-6 -rotate-45 -translate-y-[7px]' : 'w-5'}`}></span>
          </div>
        </button>
      </div>

      {/* Mobile Drawer Menu */}
      {mobileMenuOpen && (
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: -20 }}
          className="fixed inset-0 bg-[#0C0C0C]/95 backdrop-blur-xl z-30 md:hidden flex flex-col items-center justify-center gap-8 px-6"
        >
          {navLinks.map((link) => (
            <a
              key={link.id}
              href={`#${link.id}`}
              onClick={(e) => {
                e.preventDefault();
                scrollToSection(link.id);
              }}
              className="text-2xl font-bold uppercase tracking-widest text-[#D7E2EA] hover:text-white transition-colors"
            >
              {link.label}
            </a>
          ))}
        </motion.div>
      )}

      {/* ================= DESKTOP HERO CONTENT ================= */}
      <div className="hidden md:flex flex-grow flex-col items-center justify-center w-full px-6 relative">
        {/* Hero Portrait */}
        <FadeIn delay={0.6} y={30} className="absolute left-1/2 -translate-x-1/2 z-10 bottom-0 top-1/2 -translate-y-1/2 sm:top-auto sm:translate-y-0">
          <Magnet padding={150} strength={3} className="cursor-pointer">
            <img
              src="/avatar-Davi.png"
              alt="Davi Portrait"
              className="w-[280px] sm:w-[360px] md:w-[440px] lg:w-[520px] h-auto object-contain pointer-events-none select-none"
            />
          </Magnet>
        </FadeIn>

        {/* Big Heading */}
        <div className="w-full text-center overflow-hidden z-0 pointer-events-none mb-12 sm:mb-20">
          <FadeIn delay={0.15} y={40}>
            <h1 className="hero-heading font-black uppercase tracking-tight leading-none whitespace-nowrap w-full text-[14vw] sm:text-[15vw] md:text-[16vw] lg:text-[17.5vw] mt-6 sm:mt-4 md:-mt-5 select-none">
              Davi Aleixo
            </h1>
          </FadeIn>
        </div>
      </div>

      {/* Desktop Bottom Bar */}
      <div className="hidden md:flex w-full justify-between items-end px-6 md:px-10 pb-7 sm:pb-8 md:pb-10 z-20">
        <FadeIn delay={0.35} y={20} className="max-w-[160px] sm:max-w-[220px] md:max-w-[260px]">
          <div className="flex gap-3">
            <button 
              onClick={() => scrollToSection("contact")}
              className="rounded-full bg-white text-black font-semibold uppercase tracking-wider text-[10px] sm:text-xs px-4 py-2 hover:bg-white/90 transition-colors cursor-pointer"
            >
              Solicitar Projeto
            </button>
            <button 
              onClick={() => scrollToSection("marquee")}
              className="rounded-full border border-white/20 text-white font-semibold uppercase tracking-wider text-[10px] sm:text-xs px-4 py-2 hover:bg-white/10 transition-colors cursor-pointer"
            >
              Ver Projetos
            </button>
          </div>
        </FadeIn>

        <FadeIn delay={0.5} y={20}>
          <ContactButton onClick={() => scrollToSection("contact")} />
        </FadeIn>
      </div>

      {/* ================= MOBILE HERO CONTENT (EXACT SCREENSHOT DESIGN) ================= */}
      <div className="flex md:hidden flex-col items-center justify-between w-full px-5 pt-4 pb-8 z-10 flex-grow">
        {/* Top Text & Avatar Stack */}
        <div className="relative w-full flex flex-col items-center pt-2">
          {/* Stacked DAVI ALEIXO Background Title */}
          <div className="flex flex-col items-center leading-none text-center select-none pointer-events-none">
            <span className="hero-heading font-black uppercase tracking-tighter text-[23vw] leading-[0.8]">
              DAVI
            </span>
            <span className="hero-heading font-black uppercase tracking-tighter text-[23vw] leading-[0.8]">
              ALEIXO
            </span>
          </div>

          {/* 3D Avatar Center Overlap */}
          <div className="-mt-12 sm:-mt-14 z-10 pointer-events-none select-none">
            <img
              src="/avatar-Davi.png"
              alt="Davi Portrait"
              className="w-[280px] sm:w-[320px] h-auto object-contain mx-auto drop-shadow-2xl"
            />
          </div>
        </div>

        {/* Subtitle, Divider & Description */}
        <div className="flex flex-col items-center text-center mt-3 z-10 w-full">
          <span className="text-[11px] sm:text-xs font-bold uppercase tracking-[0.2em] text-[#D7E2EA]">
            DESENVOLVEDOR FULL STACK &amp; WEB DESIGNER
          </span>
          <div className="w-12 h-[2px] bg-blue-600 my-2.5 rounded-full shadow-[0_0_8px_#2563EB]" />
          <p className="text-xs sm:text-sm text-[#D7E2EA]/70 font-light max-w-[270px] leading-relaxed">
            Crio sites, sistemas e experiências digitais focadas em performance e resultados.
          </p>
        </div>

        {/* Action Buttons (Stacked with Right Arrow) */}
        <div className="flex flex-col w-full max-w-[290px] gap-3 mt-6 z-10">
          <button
            onClick={() => scrollToSection("contact")}
            className="w-full rounded-full bg-white text-black font-bold uppercase tracking-wider text-xs py-3.5 px-6 flex items-center justify-center gap-2 hover:bg-white/90 active:scale-95 transition-all shadow-xl cursor-pointer"
          >
            <span>SOLICITAR PROJETO</span>
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" className="w-3.5 h-3.5">
              <path strokeLinecap="round" strokeLinejoin="round" d="M13.5 4.5L21 12m0 0l-7.5 7.5M21 12H3" />
            </svg>
          </button>

          <button
            onClick={() => scrollToSection("marquee")}
            className="w-full rounded-full bg-black/40 border border-white/30 text-white font-bold uppercase tracking-wider text-xs py-3.5 px-6 flex items-center justify-center gap-2 hover:bg-white/10 active:scale-95 transition-all cursor-pointer backdrop-blur-sm"
          >
            <span>VER PROJETOS</span>
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" className="w-3.5 h-3.5">
              <path strokeLinecap="round" strokeLinejoin="round" d="M13.5 4.5L21 12m0 0l-7.5 7.5M21 12H3" />
            </svg>
          </button>
        </div>

        {/* Scroll To Explore Indicator */}
        <div className="flex flex-col items-center gap-1.5 mt-6 z-10 select-none cursor-pointer" onClick={() => scrollToSection("marquee")}>
          <div className="w-4 h-6 rounded-full border border-[#D7E2EA]/40 flex justify-center pt-1">
            <motion.div
              animate={{ y: [0, 4, 0] }}
              transition={{ repeat: Infinity, duration: 1.4, ease: "easeInOut" }}
              className="w-1 h-1.5 bg-[#D7E2EA] rounded-full"
            />
          </div>
          <span className="text-[9px] uppercase tracking-[0.25em] text-[#D7E2EA]/40 font-medium">
            SCROLL PARA EXPLORAR
          </span>
        </div>
      </div>
    </section>
  );
});

// 2. MarqueeSection (Images marquee)
const MARQUEE_IMAGES = [
  { src: "/karinacapa.png", href: "https://www.karinalemospsicologa.com/" },
  { src: "/verumcapa.png", href: "https://news.grupoverum.com.br/pv/" },
  { src: "/staffgocapa.png", href: "https://staffgoevent.vercel.app/" },
  { src: "/pontoazicapa.png" },
  { src: "/supracapa.png", href: "https://suprasoft.net/" },
  { src: "/loures.png", href: "https://louresadv.com.br/" },
  { src: "/siteamadereira.png", href: "https://amadeireira.com.br/" },
  { src: "/amadereiravendas.png", href: "https://amadereiravendas.vercel.app/" },
  { src: "/rafael.png", href: "https://rafaelcruz.netlify.app/" },
  { src: "/noctus.png", href: "https://noctus-company.vercel.app/" }
];

const DoubleTapLink = memo(({ href, children, className }: { href: string; children: React.ReactNode; className?: string }) => {
  const [lastTap, setLastTap] = useState(0);

  const handlePointerDown = () => {
    const now = Date.now();
    if (now - lastTap < 400) {
      window.open(href, '_blank');
      setLastTap(0);
    } else {
      setLastTap(now);
    }
  };

  return (
    <div 
      onPointerDown={handlePointerDown}
      className={className}
    >
      {children}
    </div>
  );
});

const MarqueeSection = memo(() => {
  const sectionRef = useRef<HTMLDivElement>(null);
  
  const { scrollYProgress } = useScroll({
    target: sectionRef,
    offset: ["start end", "end start"]
  });

  const x1 = useTransform(scrollYProgress, [0, 1], [-30000, -29300]); // Moves Right on scroll
  const x2 = useTransform(scrollYProgress, [0, 1], [-30000, -30700]); // Moves Left on scroll

  // Divide images evenly across Row 1 and Row 2
  const row1Images = useMemo(() => {
    const list = MARQUEE_IMAGES.filter((_, idx) => idx % 2 === 0);
    return Array(40).fill(list).flat();
  }, []);

  const row2Images = useMemo(() => {
    const list = MARQUEE_IMAGES.filter((_, idx) => idx % 2 !== 0);
    return Array(40).fill(list).flat();
  }, []);

  return (
    <section ref={sectionRef} id="marquee" className="w-full bg-[#0C0C0C] pt-16 sm:pt-24 md:pt-32 pb-14 sm:pb-20 overflow-hidden">
      {/* Title and Description */}
      <div className="w-full text-center mb-10 sm:mb-14 px-6 z-10 relative">
        <FadeIn delay={0.1} y={20}>
          <h2 className="hero-heading font-black uppercase text-[clamp(2.5rem,8vw,100px)] text-[#D7E2EA] leading-none mb-4">
            Projetos
          </h2>
          <p className="text-[#D7E2EA]/70 text-sm sm:text-base md:text-lg font-light tracking-wide max-w-md mx-auto leading-relaxed">
            Arraste para o lado para explorar os projetos.
            <br className="hidden sm:block" />
            Dê <strong className="text-white font-medium">dois cliques</strong> na imagem para acessar o site.
          </p>
        </FadeIn>
      </div>

      <div className="flex flex-col gap-4 sm:gap-6">
        {/* Row 1: Moves RIGHT on scroll */}
        <motion.div 
          drag="x" 
          dragElastic={0}
          className="cursor-grab active:cursor-grabbing w-max"
        >
          <motion.div
            className="flex gap-4 sm:gap-6 w-max"
            style={{
              x: x1,
              willChange: 'transform',
            }}
          >
            {row1Images.map((item, idx) => {
              const content = (
                <img
                  key={`r1-${idx}`}
                  src={item.src}
                  alt="Projeto"
                  loading="lazy"
                  decoding="async"
                  draggable={false}
                  className="w-[320px] sm:w-[400px] md:w-[440px] h-[200px] sm:h-[250px] md:h-[275px] rounded-2xl object-cover flex-shrink-0 pointer-events-none shadow-2xl border border-white/5"
                />
              );
              return item.href ? (
                <DoubleTapLink 
                  href={item.href}
                  key={`div-r1-${idx}`} 
                  className="cursor-pointer pointer-events-auto hover:opacity-85 hover:scale-[1.02] transition-all duration-300"
                >
                  {content}
                </DoubleTapLink>
              ) : content;
            })}
          </motion.div>
        </motion.div>

        {/* Row 2: Moves LEFT on scroll */}
        <motion.div 
          drag="x" 
          dragElastic={0}
          className="cursor-grab active:cursor-grabbing w-max"
        >
          <motion.div
            className="flex gap-4 sm:gap-6 w-max"
            style={{
              x: x2,
              willChange: 'transform',
            }}
          >
            {row2Images.map((item, idx) => {
              const content = (
                <img
                  key={`r2-${idx}`}
                  src={item.src}
                  alt="Projeto"
                  loading="lazy"
                  decoding="async"
                  draggable={false}
                  className="w-[320px] sm:w-[400px] md:w-[440px] h-[200px] sm:h-[250px] md:h-[275px] rounded-2xl object-cover flex-shrink-0 pointer-events-none shadow-2xl border border-white/5"
                />
              );
              return item.href ? (
                <DoubleTapLink 
                  href={item.href}
                  key={`div-r2-${idx}`} 
                  className="cursor-pointer pointer-events-auto hover:opacity-85 hover:scale-[1.02] transition-all duration-300"
                >
                  {content}
                </DoubleTapLink>
              ) : content;
            })}
          </motion.div>
        </motion.div>
      </div>
    </section>
  );
});

// 3. AboutSection
const AboutSection = memo(() => {
  return (
    <section id="about" className="relative min-h-screen w-full flex flex-col justify-center items-center px-5 sm:px-8 md:px-10 py-24 sm:py-32 bg-[#0C0C0C] overflow-hidden">
      {/* Decorative 3D Glassmorphic Elements */}
      {/* Top Left: Code / Brackets Logo */}
      <FadeIn delay={0.1} x={-60} y={0} duration={0.9} className="absolute top-[4%] sm:top-[6%] left-[2%] sm:left-[4%] md:left-[6%] z-10 pointer-events-none hidden sm:block">
        <img
          src="/codigo.png"
          alt="Code 3D Icon"
          className="w-[120px] sm:w-[160px] md:w-[220px] h-auto object-contain drop-shadow-[0_10px_30px_rgba(37,99,235,0.3)]"
        />
      </FadeIn>

      {/* Top Right: Code Screen Window */}
      <FadeIn delay={0.15} x={60} y={0} duration={0.9} className="absolute top-[4%] sm:top-[6%] right-[2%] sm:right-[4%] md:right-[6%] z-10 pointer-events-none hidden sm:block">
        <img
          src="/tela.png"
          alt="Screen 3D Window"
          className="w-[140px] sm:w-[180px] md:w-[250px] h-auto object-contain drop-shadow-[0_10px_30px_rgba(37,99,235,0.3)]"
        />
      </FadeIn>

      {/* Bottom Left: 3D Laptop */}
      <FadeIn delay={0.25} x={-60} y={0} duration={0.9} className="absolute bottom-[4%] sm:bottom-[6%] left-[2%] sm:left-[4%] md:left-[6%] z-10 pointer-events-none hidden sm:block">
        <img
          src="/pc.png"
          alt="Laptop 3D"
          className="w-[160px] sm:w-[220px] md:w-[290px] h-auto object-contain drop-shadow-[0_10px_30px_rgba(37,99,235,0.3)]"
        />
      </FadeIn>

      {/* Bottom Right: 3D Curly Braces */}
      <FadeIn delay={0.3} x={60} y={0} duration={0.9} className="absolute bottom-[4%] sm:bottom-[6%] right-[3%] sm:right-[5%] md:right-[7%] z-10 pointer-events-none hidden sm:block">
        <img
          src="/colchete.png"
          alt="Curly Braces 3D"
          className="w-[120px] sm:w-[150px] md:w-[210px] h-auto object-contain drop-shadow-[0_10px_30px_rgba(37,99,235,0.3)]"
        />
      </FadeIn>

      {/* Content wrapper */}
      <div className="flex flex-col items-center text-center max-w-3xl z-20 gap-8 sm:gap-10">
        <FadeIn delay={0} y={40} className="flex flex-col items-center">
          <h2 className="hero-heading font-black uppercase leading-none tracking-tight text-[clamp(3rem,9vw,120px)] select-none">
            Sobre
          </h2>
          <h3 className="text-[#D7E2EA] font-semibold text-xl sm:text-2xl md:text-3xl mt-4 max-w-2xl mx-auto leading-relaxed">
            Mais do que desenvolver sites.
          </h3>
        </FadeIn>

        <div className="flex flex-col items-center gap-10 sm:gap-14 w-full">
          <AnimatedText
            text="Minha trajetória começou no desenvolvimento de software, construindo sistemas, interfaces e soluções para problemas reais. Hoje, levo essa experiência para a criação de sites e experiências digitais que unem design, tecnologia e estratégia. Não trabalho apenas com templates ou páginas visualmente bonitas. Cada projeto é pensado para a realidade da marca, com atenção à experiência do usuário, performance, responsividade e conversão. Do código à interface, meu objetivo é transformar ideias em produtos digitais profissionais, rápidos e com identidade própria."
            className="text-[#D7E2EA] font-medium leading-relaxed max-w-[700px] text-[clamp(1rem,2vw,1.35rem)]"
          />

          <FadeIn delay={0.2} y={30}>
            <button 
              onClick={() => {
                document.getElementById("contact")?.scrollIntoView({ behavior: 'smooth' });
              }}
              className="rounded-full text-white font-semibold uppercase tracking-widest text-xs sm:text-sm px-10 py-3.5 transition-transform duration-200 hover:scale-105 active:scale-95 cursor-pointer shadow-[0_0_30px_rgba(37,99,235,0.6)] border border-white/20"
              style={{
                background: 'linear-gradient(135deg, #1d4ed8 0%, #2563eb 60%, #38bdf8 100%)',
              }}
            >
              FALE COMIGO
            </button>
          </FadeIn>
        </div>
      </div>
    </section>
  );
});

// 4. ServicesSection
interface ServiceItem {
  number: string;
  name: string;
  description: string;
}

const SERVICES: ServiceItem[] = [
  {
    number: "01",
    name: "Landing Pages & Páginas de Vendas",
    description: "Landing pages, páginas de lançamento e páginas de vendas focadas em apresentar ofertas, captar contatos e gerar oportunidades.",
  },
  {
    number: "02",
    name: "Sites Institucionais",
    description: "Sites profissionais, modernos e responsivos para empresas e profissionais que querem fortalecer sua presença e credibilidade digital.",
  },
  {
    number: "03",
    name: "Catálogos & Páginas de Produtos",
    description: "Catálogos digitais e páginas personalizadas para apresentar produtos, coleções e serviços, com experiências adaptadas à forma de venda de cada negócio.",
  },
  {
    number: "04",
    name: "Sistemas Web",
    description: "Sistemas personalizados, painéis administrativos e soluções web desenvolvidas de acordo com processos e necessidades específicas do negócio.",
  },
  {
    number: "05",
    name: "Formulários & Soluções Interativas",
    description: "Formulários personalizados, diagnósticos, simuladores, calculadoras e outras experiências interativas desenvolvidas para objetivos específicos.",
  },
];

const ServicesSection = memo(() => {
  return (
    <section id="services" className="bg-white text-[#0C0C0C] rounded-t-[40px] sm:rounded-t-[50px] md:rounded-t-[60px] px-5 sm:px-8 md:px-10 py-20 sm:py-24 md:py-32 relative z-20">
      <div className="max-w-5xl mx-auto flex flex-col">
        <h2 className="text-center font-black uppercase text-[clamp(2.5rem,10vw,140px)] leading-none mb-16 sm:mb-20 md:mb-28">
          Serviços
        </h2>

        <div className="flex flex-col w-full">
          {SERVICES.map((service, index) => (
            <FadeIn
              key={service.number}
              delay={index * 0.1}
              y={30}
              className="flex flex-col md:flex-row items-start md:items-center py-8 sm:py-10 md:py-12 border-b border-[#0C0C0C]/15 last:border-b-0"
            >
              {/* Number */}
              <span className="font-black text-[clamp(2.5rem,8vw,120px)] leading-none text-[#0C0C0C] mr-8 md:mr-16 min-w-[70px] sm:min-w-[120px] md:min-w-[160px]">
                {service.number}
              </span>

              {/* Name & Description stacked vertically on the right */}
              <div className="flex flex-col gap-2 mt-4 md:mt-0 flex-1">
                <h3 className="font-medium uppercase text-[clamp(1rem,2.2vw,2.1rem)] text-black">
                  {service.name}
                </h3>
                <p className="font-light leading-relaxed max-w-2xl text-[clamp(0.85rem,1.6vw,1.25rem)] text-[#0C0C0C]/70">
                  {service.description}
                </p>
              </div>
            </FadeIn>
          ))}
        </div>
      </div>
    </section>
  );
});

// 5. DevelopSection (Formerly ProjectsSection)
interface DevelopFeature {
  icon: React.ReactNode;
  label: string;
}

interface DevelopItem {
  number: string;
  name: string;
  eyebrow: string;
  description: string;
  buttonText: string;
  features: DevelopFeature[];
}

const TargetIcon = () => (
  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" className="w-6 h-6 text-[#3B82F6]">
    <circle cx="12" cy="12" r="10"></circle>
    <circle cx="12" cy="12" r="4"></circle>
  </svg>
);

const FunnelIcon = () => (
  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" className="w-6 h-6 text-[#D7E2EA]/70">
    <path strokeLinecap="round" strokeLinejoin="round" d="M3 4a1 1 0 011-1h16a1 1 0 011 1v2.586a1 1 0 01-.293.707l-6.414 6.414a1 1 0 00-.293.707V17l-4 4v-6.586a1 1 0 00-.293-.707L3.293 7.293A1 1 0 013 6.586V4z" />
  </svg>
);

const LightningIcon = () => (
  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" className="w-6 h-6 text-[#D7E2EA]/70">
    <path strokeLinecap="round" strokeLinejoin="round" d="M13 10V3L4 14h7v7l9-11h-7z" />
  </svg>
);

const ChartIcon = () => (
  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" className="w-6 h-6 text-[#D7E2EA]/70">
    <path strokeLinecap="round" strokeLinejoin="round" d="M18 20V10M12 20V4M6 20v-6" />
  </svg>
);

const ScreenIcon = () => (
  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" className="w-6 h-6 text-[#D7E2EA]/70">
    <rect x="2" y="3" width="20" height="14" rx="2" ry="2" />
    <line x1="8" y1="21" x2="16" y2="21" />
    <line x1="12" y1="17" x2="12" y2="21" />
  </svg>
);

const GridIcon = () => (
  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" className="w-6 h-6 text-[#D7E2EA]/70">
    <rect x="3" y="3" width="7" height="7" rx="1" />
    <rect x="14" y="3" width="7" height="7" rx="1" />
    <rect x="14" y="14" width="7" height="7" rx="1" />
    <rect x="3" y="14" width="7" height="7" rx="1" />
  </svg>
);

const MobileIcon = () => (
  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" className="w-6 h-6 text-[#D7E2EA]/70">
    <rect x="5" y="2" width="14" height="20" rx="2" ry="2" />
    <line x1="12" y1="18" x2="12.01" y2="18" />
  </svg>
);

const TagIcon = () => (
  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" className="w-6 h-6 text-[#D7E2EA]/70">
    <path strokeLinecap="round" strokeLinejoin="round" d="M7 7h.01M7 3h5c.512 0 1.024.195 1.414.586l7 7a2 2 0 010 2.828l-7 7a2 2 0 01-2.828 0l-7-7A1.994 1.994 0 013 12V7a4 4 0 014-4z" />
  </svg>
);

const CodeIcon = () => (
  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" className="w-6 h-6 text-[#D7E2EA]/70">
    <path strokeLinecap="round" strokeLinejoin="round" d="M10 20l4-16m4 4l4 4-4 4M6 16l-4-4 4-4" />
  </svg>
);

const DatabaseIcon = () => (
  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" className="w-6 h-6 text-[#D7E2EA]/70">
    <ellipse cx="12" cy="5" rx="9" ry="3" />
    <path d="M21 12c0 1.66-4 3-9 3s-9-1.34-9-3" />
    <path d="M3 5v14c0 1.66 4 3 9 3s9-1.34 9-3V5" />
  </svg>
);

const NodeIcon = () => (
  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" className="w-6 h-6 text-[#D7E2EA]/70">
    <circle cx="18" cy="5" r="3" />
    <circle cx="6" cy="12" r="3" />
    <circle cx="18" cy="19" r="3" />
    <line x1="8.59" y1="13.51" x2="15.42" y2="17.49" />
    <line x1="15.41" y1="6.51" x2="8.59" y2="10.49" />
  </svg>
);

const LockIcon = () => (
  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" className="w-6 h-6 text-[#D7E2EA]/70">
    <rect x="3" y="11" width="18" height="11" rx="2" ry="2" />
    <path d="M7 11V7a5 5 0 0110 0v4" />
  </svg>
);

const DEVELOP_ITEMS: DevelopItem[] = [
  {
    number: "01",
    name: "Landing Pages & Páginas de Vendas",
    eyebrow: "CONVERSÃO • VENDAS",
    description: "Landing pages, páginas de vendas e experiências digitais criadas para apresentar ofertas, captar oportunidades e transformar atenção em ação.",
    buttonText: "SOLICITAR PROJETO",
    features: [
      { icon: <TargetIcon />, label: "FOCO" },
      { icon: <FunnelIcon />, label: "CAPTAÇÃO" },
      { icon: <LightningIcon />, label: "CONVERSÃO" },
      { icon: <ChartIcon />, label: "RESULTADOS" },
    ]
  },
  {
    number: "02",
    name: "Sites & Catálogos",
    eyebrow: "MARCA • PRESENÇA DIGITAL",
    description: "Sites profissionais e catálogos digitais desenvolvidos para apresentar empresas, serviços e produtos com clareza, personalidade e uma experiência moderna.",
    buttonText: "SOLICITAR PROJETO",
    features: [
      { icon: <ScreenIcon />, label: "PRESENÇA" },
      { icon: <GridIcon />, label: "ORGANIZAÇÃO" },
      { icon: <MobileIcon />, label: "RESPONSIVO" },
      { icon: <TagIcon />, label: "PRODUTOS" },
    ]
  },
  {
    number: "03",
    name: "Sistemas & Soluções Web",
    eyebrow: "TECNOLOGIA • SOB MEDIDA",
    description: "Sistemas, painéis, formulários e ferramentas digitais desenvolvidos sob medida para transformar necessidades específicas em soluções funcionais.",
    buttonText: "FALAR SOBRE UMA IDEIA",
    features: [
      { icon: <CodeIcon />, label: "DESENVOLVIMENTO" },
      { icon: <DatabaseIcon />, label: "DADOS" },
      { icon: <NodeIcon />, label: "INTEGRAÇÃO" },
      { icon: <LockIcon />, label: "SEGURANÇA" },
    ]
  },
];

// --- COMPOSIÇÕES GRÁFICAS ABSTRATAS ---
const VisualConversao = memo(() => (
  <div className="w-full h-full min-h-[250px] md:min-h-[350px] flex flex-col items-center justify-center relative p-6 overflow-hidden bg-[#0A0A0A]">
    {/* Background Outline Text */}
    <div className="absolute inset-0 flex items-center justify-center pointer-events-none opacity-[0.15] select-none overflow-hidden px-4">
      <span className="text-[clamp(3rem,10vw,6.5rem)] font-black tracking-tighter text-transparent uppercase whitespace-nowrap" style={{ WebkitTextStroke: '1px #D7E2EA' }}>
        CONVERSÃO
      </span>
    </div>
    
    <div className="w-full max-w-lg z-10 flex flex-col items-start gap-8 relative">
      <div className="flex items-center gap-2 mb-4">
        <div className="w-2 h-2 rounded-full bg-blue-500 shadow-[0_0_8px_#3B82F6]"></div>
        <span className="text-[10px] uppercase tracking-[0.2em] text-[#3B82F6] font-semibold">ESTRATÉGIA</span>
      </div>

      {/* Ascending Chart Line */}
      <div className="w-full h-24 relative mb-4">
        <svg className="w-full h-full overflow-visible" preserveAspectRatio="none" viewBox="0 0 100 40">
          <motion.path 
            initial={{ pathLength: 0 }} whileInView={{ pathLength: 1 }} transition={{ duration: 1.5, ease: "easeInOut" }}
            d="M0 30 Q20 40, 40 20 T80 15 T100 5"
            fill="none" stroke="#3B82F6" strokeWidth="1.5"
            className="drop-shadow-[0_0_8px_rgba(59,130,246,0.8)]"
          />
          <motion.circle 
            initial={{ opacity: 0 }} whileInView={{ opacity: 1 }} transition={{ delay: 1.5 }}
            cx="100" cy="5" r="1.5" fill="#60A5FA" className="drop-shadow-[0_0_6px_#93C5FD]"
          />
        </svg>
        
        <motion.div 
          initial={{ opacity: 0, y: 10 }} whileInView={{ opacity: 1, y: 0 }} transition={{ delay: 1.6 }}
          className="absolute -right-2 top-8 border border-blue-500/30 bg-blue-500/10 backdrop-blur-md rounded px-3 py-1 text-[10px] uppercase tracking-widest text-blue-400 font-bold"
        >
          CTA
        </motion.div>
      </div>

      {/* Nodes */}
      <div className="flex items-center justify-between w-full relative">
        {/* Dashed connecting line */}
        <div className="absolute top-1/2 left-0 w-full h-[1px] bg-gradient-to-r from-transparent via-[#D7E2EA]/20 to-transparent border-t border-dashed border-[#D7E2EA]/20"></div>
        
        <div className="border border-[#D7E2EA]/10 bg-[#0A0A0A] rounded-lg px-4 py-2 z-10 text-[10px] sm:text-xs uppercase tracking-widest text-[#D7E2EA]/50">
          Tráfego
        </div>
        <div className="border border-blue-500/50 bg-[#0A0A0A] rounded-lg px-4 py-2 z-10 text-[10px] sm:text-xs uppercase tracking-widest text-blue-400 font-medium shadow-[0_0_15px_rgba(59,130,246,0.15)]">
          Landing Page
        </div>
        <div className="border border-[#D7E2EA]/10 bg-[#0A0A0A] rounded-lg px-4 py-2 z-10 text-[10px] sm:text-xs uppercase tracking-widest text-[#D7E2EA]/50 flex items-center gap-2">
          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" className="w-3 h-3"><path strokeLinecap="round" strokeLinejoin="round" d="M15.75 6a3.75 3.75 0 11-7.5 0 3.75 3.75 0 017.5 0zM4.501 20.118a7.5 7.5 0 0114.998 0A17.933 17.933 0 0112 21.75c-2.676 0-5.216-.584-7.499-1.632z" /></svg>
          Lead
        </div>
      </div>
    </div>
  </div>
));

const VisualPresenca = memo(() => (
  <div className="w-full h-full min-h-[250px] md:min-h-[350px] flex items-center justify-center relative p-6 overflow-hidden bg-[#0A0A0A]">
    <div className="w-full flex items-center justify-center gap-6 max-w-2xl">
      {/* Browser Mockup */}
      <motion.div 
        initial={{ opacity: 0, x: -20 }} whileInView={{ opacity: 1, x: 0 }} transition={{ duration: 0.6 }}
        className="flex-[2] border border-[#D7E2EA]/10 rounded-xl bg-[#0F0F0F] overflow-hidden flex flex-col h-56 shadow-2xl"
      >
        {/* Browser Topbar */}
        <div className="h-8 border-b border-[#D7E2EA]/10 flex items-center justify-between px-4">
          <span className="text-[8px] uppercase tracking-widest text-[#D7E2EA]/40 font-bold">MARCA</span>
          <div className="flex gap-2">
            <div className="w-4 h-1 bg-[#D7E2EA]/10 rounded-full"></div>
            <div className="w-4 h-1 bg-[#D7E2EA]/10 rounded-full"></div>
            <div className="w-4 h-1 bg-[#D7E2EA]/10 rounded-full"></div>
          </div>
        </div>
        <div className="p-6 flex flex-col flex-1">
          <h4 className="text-xl font-black text-white uppercase tracking-wider mb-1">
            SUA MARCA,
          </h4>
          <h4 className="text-xl font-black text-blue-500 uppercase tracking-wider mb-6">
            SUA PRESENÇA.
          </h4>
          <div className="w-24 h-1 bg-[#D7E2EA]/10 rounded-full mb-2"></div>
          <div className="w-32 h-1 bg-[#D7E2EA]/10 rounded-full mb-8"></div>
          
          <div className="flex gap-3 mt-auto">
            {[1, 2, 3].map(i => (
              <div key={i} className="flex-1 border border-[#D7E2EA]/10 rounded-lg p-2 flex flex-col gap-2">
                <div className="w-full h-8 bg-[#D7E2EA]/5 rounded flex items-center justify-center">
                  <svg className="w-4 h-4 text-[#D7E2EA]/20" fill="none" stroke="currentColor" viewBox="0 0 24 24"><rect width="18" height="18" x="3" y="3" rx="2" ry="2"/><circle cx="8.5" cy="8.5" r="1.5"/><polyline points="21 15 16 10 5 21"/></svg>
                </div>
                <div className="w-full h-1 bg-[#D7E2EA]/10 rounded-full"></div>
                <div className="w-2/3 h-1 bg-[#D7E2EA]/10 rounded-full"></div>
              </div>
            ))}
          </div>
        </div>
      </motion.div>

      {/* Mobile Mockup & Dot Grid */}
      <motion.div 
        initial={{ opacity: 0, x: 20 }} whileInView={{ opacity: 1, x: 0 }} transition={{ duration: 0.6, delay: 0.2 }}
        className="flex-1 hidden md:flex items-center gap-6"
      >
        <div className="w-32 h-64 border border-[#D7E2EA]/10 rounded-2xl bg-[#0F0F0F] p-2 flex flex-col">
          <div className="flex justify-between items-center mb-4 px-1">
            <span className="text-[6px] uppercase tracking-widest text-[#D7E2EA]/50">MARCA</span>
            <div className="w-3 h-3 flex flex-col justify-center gap-[2px]">
              <div className="w-full h-[1px] bg-[#D7E2EA]/40"></div>
              <div className="w-full h-[1px] bg-[#D7E2EA]/40"></div>
              <div className="w-full h-[1px] bg-[#D7E2EA]/40"></div>
            </div>
          </div>
          <div className="w-full h-20 bg-[#D7E2EA]/5 rounded-lg mb-4 flex items-center justify-center">
            <svg className="w-6 h-6 text-[#D7E2EA]/10" fill="none" stroke="currentColor" viewBox="0 0 24 24"><rect width="18" height="18" x="3" y="3" rx="2" ry="2"/><circle cx="8.5" cy="8.5" r="1.5"/><polyline points="21 15 16 10 5 21"/></svg>
          </div>
          <div className="w-full h-4 bg-blue-500/20 rounded mb-4"></div>
          <div className="w-full h-1 bg-[#D7E2EA]/10 rounded-full mb-2"></div>
          <div className="w-3/4 h-1 bg-[#D7E2EA]/10 rounded-full mb-2"></div>
          <div className="w-5/6 h-1 bg-[#D7E2EA]/10 rounded-full"></div>
        </div>
        
        <div className="grid grid-cols-3 gap-3">
          {[...Array(12)].map((_, i) => (
            <div key={i} className={`w-1 h-1 rounded-full ${i % 4 === 0 ? 'bg-blue-500' : 'bg-[#D7E2EA]/20'}`}></div>
          ))}
        </div>
      </motion.div>
    </div>
  </div>
));

const VisualSistemas = memo(() => (
  <div className="w-full h-full min-h-[250px] md:min-h-[350px] flex items-center justify-center relative p-6 overflow-hidden bg-[#0A0A0A]">
    <div className="w-full flex items-center justify-center gap-8 max-w-3xl">
      {/* Dashboard Mockup */}
      <motion.div 
        initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} transition={{ duration: 0.6 }}
        className="flex-[3] border border-[#D7E2EA]/10 rounded-xl bg-[#0F0F0F] flex h-60 shadow-2xl overflow-hidden"
      >
        {/* Sidebar */}
        <div className="w-16 border-r border-[#D7E2EA]/10 flex flex-col items-center py-4 gap-4">
          <div className="w-6 h-6 rounded bg-[#D7E2EA]/10 mb-2"></div>
          <div className="w-6 h-6 rounded bg-[#D7E2EA]/5"></div>
          <div className="w-6 h-6 rounded bg-blue-500/20 border border-blue-500/50"></div>
          <div className="w-6 h-6 rounded bg-[#D7E2EA]/5"></div>
          <div className="w-6 h-6 rounded bg-[#D7E2EA]/5"></div>
        </div>
        {/* Main Content */}
        <div className="flex-1 p-4 flex flex-col">
          <span className="text-[8px] uppercase tracking-widest text-[#D7E2EA]/50 font-bold mb-4">PAINEL</span>
          <div className="flex gap-4 h-24 mb-4">
            <div className="flex-[2] border border-[#D7E2EA]/10 rounded-lg bg-[#0A0A0A] relative overflow-hidden">
               <svg className="absolute inset-0 w-full h-full" preserveAspectRatio="none" viewBox="0 0 100 40">
                 <path d="M0 30 Q10 20, 20 25 T40 15 T60 20 T80 5 T100 10" fill="none" stroke="#3B82F6" strokeWidth="1.5" className="opacity-70" />
                 <path d="M0 30 Q10 20, 20 25 T40 15 T60 20 T80 5 T100 10 L100 40 L0 40 Z" fill="url(#blue-gradient)" opacity="0.1" />
                 <defs>
                   <linearGradient id="blue-gradient" x1="0" y1="0" x2="0" y2="1">
                     <stop offset="0%" stopColor="#3B82F6" />
                     <stop offset="100%" stopColor="transparent" />
                   </linearGradient>
                 </defs>
               </svg>
            </div>
            <div className="flex-1 border border-[#D7E2EA]/10 rounded-lg bg-[#0A0A0A] flex items-center justify-center relative">
              <svg viewBox="0 0 36 36" className="w-12 h-12">
                <path className="text-[#D7E2EA]/10" d="M18 2.0845 a 15.9155 15.9155 0 0 1 0 31.831 a 15.9155 15.9155 0 0 1 0 -31.831" fill="none" stroke="currentColor" strokeWidth="4" />
                <path className="text-blue-500" strokeDasharray="75, 100" d="M18 2.0845 a 15.9155 15.9155 0 0 1 0 31.831 a 15.9155 15.9155 0 0 1 0 -31.831" fill="none" stroke="currentColor" strokeWidth="4" />
              </svg>
              <div className="absolute right-2 top-2 flex flex-col gap-1">
                <div className="w-4 h-[2px] bg-[#D7E2EA]/20"></div>
                <div className="w-3 h-[2px] bg-[#D7E2EA]/20"></div>
                <div className="w-4 h-[2px] bg-[#D7E2EA]/20"></div>
              </div>
            </div>
          </div>
          <div className="flex-1 border border-[#D7E2EA]/10 rounded-lg bg-[#0A0A0A] p-2 flex flex-col gap-2">
            {[1, 2, 3].map(i => (
              <div key={i} className="flex items-center justify-between w-full">
                <div className="flex items-center gap-2">
                  <div className="w-2 h-2 rounded-full border border-[#D7E2EA]/20"></div>
                  <div className="w-12 h-[2px] bg-[#D7E2EA]/10"></div>
                </div>
                <div className="flex items-center gap-2">
                  <div className="w-2 h-2 rounded-full bg-blue-500/50"></div>
                  <div className="w-2 h-2 rounded-full bg-blue-500/50"></div>
                  <div className="w-2 h-2 rounded-full bg-blue-500/50"></div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </motion.div>

      {/* Logic Flowchart */}
      <motion.div 
        initial={{ opacity: 0, scale: 0.95 }} whileInView={{ opacity: 1, scale: 1 }} transition={{ duration: 0.6, delay: 0.2 }}
        className="flex-[2] hidden md:flex flex-col gap-6"
      >
        {/* Flow Diagram */}
        <div className="flex items-center justify-center relative h-20">
          {/* Connecting lines */}
          <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
             <svg className="w-full h-full">
               <path d="M 30 40 L 70 40 L 70 20 L 100 20" fill="none" stroke="rgba(215,226,234,0.1)" strokeWidth="1" />
               <path d="M 30 40 L 70 40 L 70 60 L 100 60" fill="none" stroke="rgba(215,226,234,0.1)" strokeWidth="1" />
               <path d="M 140 20 L 170 20 L 170 40 L 210 40" fill="none" stroke="rgba(215,226,234,0.1)" strokeWidth="1" />
               <path d="M 140 60 L 170 60 L 170 40 L 210 40" fill="none" stroke="rgba(215,226,234,0.1)" strokeWidth="1" />
             </svg>
          </div>
          <div className="w-8 h-8 border border-[#D7E2EA]/20 rounded flex items-center justify-center bg-[#0F0F0F] z-10 mx-4">
             <div className="w-2 h-2 rounded-full border border-[#D7E2EA]/40"></div>
          </div>
          <div className="flex flex-col gap-6 z-10 mx-2">
            <div className="w-8 h-8 border border-[#D7E2EA]/20 rounded bg-[#0F0F0F]"></div>
            <div className="w-8 h-8 border border-blue-500/50 rounded flex items-center justify-center bg-blue-500/10">
              <span className="text-[8px] font-bold text-blue-400">&lt;/&gt;</span>
            </div>
          </div>
          <div className="w-8 h-8 border border-[#D7E2EA]/20 rounded flex items-center justify-center bg-[#0F0F0F] z-10 mx-4">
             <div className="w-3 h-3 border border-[#D7E2EA]/40 rounded-sm"></div>
          </div>
        </div>

        {/* Form Inputs Mockup */}
        <div className="flex flex-col gap-2">
          <div className="w-full h-6 border border-[#D7E2EA]/10 bg-[#0F0F0F] rounded flex items-center px-2">
            <div className="w-8 h-[2px] bg-[#D7E2EA]/10"></div>
          </div>
          <div className="w-full h-6 border border-[#D7E2EA]/10 bg-[#0F0F0F] rounded flex items-center px-2">
            <div className="w-12 h-[2px] bg-[#D7E2EA]/10"></div>
          </div>
          <div className="w-16 h-6 bg-blue-500/20 border border-blue-500/30 rounded mt-1"></div>
        </div>
      </motion.div>
    </div>
  </div>
));

interface DevelopCardProps {
  item: DevelopItem;
  index: number;
  totalCards: number;
  scrollYProgress: MotionValue<number>;
}

const DevelopCard = memo<DevelopCardProps>(({ item, index, totalCards, scrollYProgress }) => {
  // Stacking scale effect
  const targetScale = 1 - (totalCards - 1 - index) * 0.03;
  const startScroll = index / totalCards;
  const scale = useTransform(scrollYProgress, [startScroll, 1], [1, targetScale]);

  return (
    <div className="w-full min-h-[85vh] flex justify-center items-start sticky top-24 md:top-32 pb-16">
      <motion.div
        style={{
          scale,
          top: `${index * 28}px`,
        }}
        className="w-full bg-[#0C0C0C] border border-[#D7E2EA]/20 rounded-[30px] sm:rounded-[40px] md:rounded-[50px] overflow-hidden shadow-2xl relative flex flex-col xl:flex-row xl:h-[600px]"
      >
        {/* Left Column: Text Content & Features */}
        <div className="w-full xl:w-[45%] p-8 sm:p-10 md:p-12 flex flex-col justify-between border-b xl:border-b-0 xl:border-r border-[#D7E2EA]/10 h-full">
          <div className="flex flex-col">
            <div className="flex items-center gap-6 mb-6">
              <span className="font-black text-[clamp(4rem,8vw,100px)] leading-none text-[#D7E2EA] hero-heading opacity-90">
                {item.number}
              </span>
              <div className="flex flex-col">
                <span className="text-xs sm:text-sm text-blue-500 font-bold uppercase tracking-widest mb-1">
                  {item.eyebrow}
                </span>
                <h3 className="font-bold text-2xl sm:text-3xl md:text-4xl uppercase tracking-wider text-[#D7E2EA] leading-tight">
                  {item.name}
                </h3>
              </div>
            </div>
            <p className="text-[#D7E2EA]/60 text-sm sm:text-base md:text-lg font-light max-w-md leading-relaxed">
              {item.description}
            </p>
          </div>

          {/* Features Row */}
          <div className="grid grid-cols-4 gap-2 sm:gap-4 mt-12 pt-8 border-t border-[#D7E2EA]/10">
            {item.features.map((feature, i) => (
              <div key={i} className="flex flex-col items-center justify-center text-center gap-3">
                <div className="w-10 h-10 sm:w-12 sm:h-12 rounded-full border border-[#D7E2EA]/10 flex items-center justify-center bg-[#0F0F0F]">
                   {feature.icon}
                </div>
                <span className="text-[9px] sm:text-[10px] font-bold text-[#D7E2EA]/50 uppercase tracking-widest">
                  {feature.label}
                </span>
              </div>
            ))}
          </div>
        </div>

        {/* Right Column: CTA Button & Visual Graphic */}
        <div className="w-full xl:w-[55%] flex flex-col relative bg-[#080808] h-full">
           {/* Abstract Visual Container (order-1 on mobile) */}
           <div className="flex-1 w-full h-full flex items-center justify-center order-1 xl:order-none">
             {item.number === "01" && <VisualConversao />}
             {item.number === "02" && <VisualPresenca />}
             {item.number === "03" && <VisualSistemas />}
           </div>

           {/* CTA Button Wrapper (order-2 on mobile and centered, absolute top right on desktop) */}
           <div className="w-full flex justify-center xl:justify-end p-6 md:p-8 xl:absolute xl:top-0 xl:right-0 z-20 order-2 xl:order-none">
              <LiveProjectButton text={item.buttonText} onClick={() => {
                document.getElementById("contact")?.scrollIntoView({ behavior: 'smooth' });
              }} />
           </div>
        </div>
      </motion.div>
    </div>
  );
});

const DevelopSection = memo(() => {
  const containerRef = useRef<HTMLDivElement>(null);
  const { scrollYProgress } = useScroll({
    target: containerRef,
    offset: ["start start", "end end"]
  });

  return (
    <section
      ref={containerRef}
      id="develop"
      className="bg-[#0C0C0C] text-[#D7E2EA] rounded-t-[40px] sm:rounded-t-[50px] md:rounded-t-[60px] -mt-10 sm:-mt-12 md:-mt-14 relative z-30 px-5 sm:px-8 md:px-10 pt-20 pb-32"
    >
      <div className="max-w-5xl mx-auto flex flex-col">
        <FadeIn delay={0} y={40} className="w-full text-center mb-16 sm:mb-20">
          <h2 className="hero-heading font-black uppercase text-[clamp(1.8rem,7vw,100px)] leading-none select-none">
            O Que Eu Desenvolvo
          </h2>
        </FadeIn>

        {/* Sticky-stacking container */}
        <div className="flex flex-col w-full relative">
          {DEVELOP_ITEMS.map((item, idx) => (
            <DevelopCard
              key={item.number}
              item={item}
              index={idx}
              totalCards={DEVELOP_ITEMS.length}
              scrollYProgress={scrollYProgress}
            />
          ))}
        </div>
      </div>
    </section>
  );
});

// 6. Diferencial Section
const DiferencialSection = memo(() => {
  const differentials = [
    {
      number: "01",
      tag: "Design & Experiência",
      title: "Design Estratégico",
      desc: "Interfaces personalizadas que unem estética, usabilidade e identidade para transmitir profissionalismo e valor à sua marca.",
      highlight: "Identidade única & sem templates genéricos"
    },
    {
      number: "02",
      tag: "Velocidade & Otimização",
      title: "Alta Performance",
      desc: "Sites rápidos, responsivos e otimizados para oferecer uma experiência fluida em qualquer dispositivo.",
      highlight: "Carregamento instantâneo & SEO técnico"
    },
    {
      number: "03",
      tag: "Vendas & Engajamento",
      title: "Foco em Conversão",
      desc: "Cada seção é planejada para conduzir o visitante, destacar sua oferta e transformar acessos em oportunidades reais.",
      highlight: "Arquitetura orientada a resultados reais"
    },
    {
      number: "04",
      tag: "Arquitetura & Código",
      title: "Tecnologia Moderna",
      desc: "Desenvolvimento com React, Next.js, WordPress e outras tecnologias de ponta escolhidas de acordo com cada projeto.",
      highlight: "Next.js • React • TypeScript • WordPress"
    },
    {
      number: "05",
      tag: "Dados & Inteligência",
      title: "Análise e Tracking",
      desc: "Configuração de Google Analytics, Google Tag Manager, Meta Pixel e eventos para acompanhar acessos, cliques e conversões.",
      highlight: "GA4 • Pixel Meta • GTM Integrado"
    },
    {
      number: "06",
      tag: "Personalização Total",
      title: "Soluções Sob Medida",
      desc: "Do site a integrações, automações e sistemas personalizados, desenvolvo a solução de acordo com a necessidade do seu negócio.",
      highlight: "100% alinhado à sua regra de negócio"
    }
  ];

  return (
    <section id="differentials" className="bg-[#FAFBFD] text-[#0C0C0C] rounded-t-[40px] sm:rounded-t-[50px] md:rounded-t-[60px] px-5 sm:px-8 md:px-10 py-20 sm:py-24 md:py-32 relative z-35 -mt-10 sm:-mt-12 md:-mt-14 overflow-hidden">
      {/* Ambient background glows */}
      <div className="absolute top-1/4 left-1/2 -translate-x-1/2 w-[800px] h-[500px] bg-blue-500/5 blur-[120px] rounded-full pointer-events-none -z-10" />
      <div className="absolute bottom-10 right-10 w-[400px] h-[400px] bg-cyan-500/5 blur-[100px] rounded-full pointer-events-none -z-10" />

      <div className="max-w-6xl mx-auto flex flex-col">
        <FadeIn delay={0} y={40} className="w-full text-center mb-16 sm:mb-20">
          <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-blue-50/80 border border-blue-200/60 text-blue-600 text-xs font-semibold uppercase tracking-widest mb-5">
            <span className="w-1.5 h-1.5 rounded-full bg-blue-600 animate-pulse"></span>
            Pilares de Excelência
          </div>
          <h2 className="text-[#0C0C0C] font-black uppercase text-[clamp(2.3rem,8vw,120px)] leading-none select-none tracking-tight">
            Por que escolher meu trabalho?
          </h2>
          <p className="text-[#0C0C0C]/60 text-sm sm:text-base md:text-lg max-w-xl mx-auto mt-4 font-normal">
            Soluções completas construídas para posicionar sua marca com autoridade e gerar resultados consistentes.
          </p>
        </FadeIn>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 sm:gap-7 w-full">
          {differentials.map((item, idx) => (
            <FadeIn
              key={idx}
              delay={idx * 0.08}
              y={30}
              className="group relative bg-white rounded-[26px] sm:rounded-[30px] p-7 sm:p-8 border border-slate-200/80 hover:border-blue-500/40 shadow-[0_4px_25px_rgba(0,0,0,0.03)] hover:shadow-[0_20px_45px_rgba(37,99,235,0.1)] hover:-translate-y-2 transition-all duration-300 flex flex-col justify-between overflow-hidden"
            >
              {/* Subtle top indicator highlight */}
              <div className="absolute top-0 left-0 right-0 h-[3px] bg-gradient-to-r from-transparent via-blue-500 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
              
              {/* Card ambient background hover gradient */}
              <div className="absolute inset-0 bg-gradient-to-br from-blue-50/40 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300 pointer-events-none" />

              <div className="relative z-10">
                {/* Header with Tag and Clean Architectural Number */}
                <div className="flex items-center justify-between gap-3 mb-6">
                  <span className="inline-block px-3 py-1 rounded-lg bg-slate-100/90 text-slate-700 text-[11px] font-mono font-semibold uppercase tracking-wider border border-slate-200/60 group-hover:bg-blue-50 group-hover:border-blue-200/80 group-hover:text-blue-700 transition-colors duration-200">
                    {item.tag}
                  </span>
                  <span className="text-2xl sm:text-3xl font-black font-mono tracking-tighter text-slate-300 group-hover:text-blue-600 transition-colors duration-300">
                    {item.number}
                  </span>
                </div>

                <h3 className="font-extrabold text-xl sm:text-2xl uppercase tracking-tight text-slate-900 group-hover:text-blue-600 transition-colors duration-200">
                  {item.title}
                </h3>
                
                <p className="font-normal leading-relaxed mt-3 text-slate-600 text-sm sm:text-[0.95rem]">
                  {item.desc}
                </p>
              </div>

              {/* Bottom Feature Pill */}
              <div className="relative z-10 mt-6 pt-4 border-t border-slate-100 flex items-center justify-between">
                <span className="text-xs font-medium text-slate-400 group-hover:text-slate-600 transition-colors flex items-center gap-1.5">
                  <span className="w-1.5 h-1.5 rounded-full bg-blue-500/60 group-hover:bg-blue-600 transition-colors"></span>
                  {item.highlight}
                </span>
              </div>
            </FadeIn>
          ))}
        </div>
      </div>
    </section>
  );
});

// 7. Experience & Education Section
const ExperienceSection = memo(() => {
  const navigate = useNavigate();
  const experiences = [
    {
      title: "Web Designer & Desenvolvedor",
      company: "Projetos Independentes",
      period: "Atual",
      desc: "Criação de experiências digitais para empresas e profissionais, desenvolvendo landing pages, páginas de vendas, sites, catálogos e soluções personalizadas com foco em unir estratégia, design e tecnologia."
    },
    {
      title: "Desenvolvedor Full Stack",
      company: "Ponto Azi Software",
      period: "Experiência Profissional",
      desc: "Desenvolvimento e evolução de sistemas empresariais utilizados em operações reais, criando novas funcionalidades, solucionando problemas e transformando necessidades de diferentes negócios em soluções digitais."
    },
    {
      title: "Desenvolvedor e Suporte",
      company: "Supra",
      period: "Experiência Profissional",
      desc: "Atuação no desenvolvimento de soluções para diferentes necessidades de negócio, incluindo a criação de um sistema para operações de distribuidoras e contato direto com demandas e desafios do dia a dia das empresas."
    },
    {
      title: "Desenvolvedor Full Stack",
      company: "Usecase Tecnologia",
      period: "Experiência Profissional",
      desc: "Início da minha trajetória profissional no desenvolvimento de soluções digitais, participando ativamente de projetos de grande porte, como o BioParque, e construindo uma base sólida na criação de sistemas e resolução de problemas reais."
    }
  ];

  const education = [
    {
      title: "Sistemas de Informação",
      company: "Estácio",
      period: "Formação Acadêmica",
      desc: "Formação acadêmica voltada à tecnologia e ao desenvolvimento de soluções digitais, complementando a experiência adquirida ao longo da minha trajetória profissional."
    },
    {
      title: "Cursos & Formação Complementar",
      company: "Udemy",
      period: "Formação Complementar",
      desc: "Cursos de capacitação e aprofundamento contínuo em desenvolvimento web, interfaces e tecnologias modernas."
    }
  ];

  return (
    <section id="experience" className="bg-[#0C0C0C] text-[#D7E2EA] px-5 sm:px-8 md:px-10 py-20 sm:py-24 md:py-32 relative z-40 border-t border-[#D7E2EA]/10 mt-10">
      <div className="max-w-5xl mx-auto flex flex-col gap-16">
        <FadeIn delay={0} y={40} className="w-full text-center mb-4">
          <h2 className="hero-heading font-black uppercase text-[clamp(2.5rem,10vw,140px)] leading-none select-none">
            Trajetória
          </h2>
        </FadeIn>

        {/* Experiência - Grid 2x2 perfeitamente balanceado */}
        <div className="flex flex-col gap-8 w-full">
          <h3 className="font-bold text-2xl sm:text-3xl uppercase tracking-wider text-white border-b border-[#D7E2EA]/10 pb-4">
            Experiência
          </h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-x-12 gap-y-10 w-full">
            {experiences.map((exp, idx) => (
              <FadeIn key={idx} delay={idx * 0.1} y={20} className="flex flex-col gap-2">
                <div className="flex justify-between items-start flex-wrap gap-2">
                  <h4 className="font-bold text-lg sm:text-xl text-white">{exp.title}</h4>
                  <span className="text-[#D7E2EA]/50 text-xs sm:text-sm uppercase tracking-widest">{exp.period}</span>
                </div>
                <p className="text-[#D7E2EA]/80 font-medium uppercase text-xs sm:text-sm tracking-wider">
                  {exp.company}
                </p>
                <p className="font-light leading-relaxed text-[#D7E2EA]/60 text-sm sm:text-base mt-2">
                  {exp.desc}
                </p>
              </FadeIn>
            ))}
          </div>
        </div>

        {/* Formação - Grid 1x2 perfeitamente balanceado */}
        <div className="flex flex-col gap-8 w-full">
          <h3 className="font-bold text-2xl sm:text-3xl uppercase tracking-wider text-white border-b border-[#D7E2EA]/10 pb-4">
            Formação
          </h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-x-12 gap-y-10 w-full">
            {education.map((edu, idx) => (
              <FadeIn key={idx} delay={idx * 0.1 + 0.15} y={20} className="flex flex-col gap-2">
                <div className="flex justify-between items-start flex-wrap gap-2">
                  <h4 className="font-bold text-lg sm:text-xl text-white">{edu.title}</h4>
                  <span className="text-[#D7E2EA]/50 text-xs sm:text-sm uppercase tracking-widest">{edu.period}</span>
                </div>
                <p className="text-[#D7E2EA]/80 font-medium uppercase text-xs sm:text-sm tracking-wider">
                  {edu.company}
                </p>
                <p className="font-light leading-relaxed text-[#D7E2EA]/60 text-sm sm:text-base mt-2">
                  {edu.desc}
                </p>
              </FadeIn>
            ))}
          </div>
        </div>

        {/* CTA Card for Technical Specs / Full Curriculum */}
        <FadeIn delay={0.3} y={30} className="w-full mt-16 pt-8 border-t border-[#D7E2EA]/10">
          <div className="relative overflow-hidden rounded-[30px] border border-blue-500/30 bg-gradient-to-r from-[#0F172A]/95 via-[#0B1120] to-[#0F172A]/95 p-8 sm:p-10 md:p-12 shadow-2xl flex flex-col md:flex-row items-center justify-between gap-8 group">
            {/* Ambient Lighting */}
            <div className="absolute top-0 right-0 w-96 h-96 bg-blue-600/15 rounded-full blur-[100px] pointer-events-none group-hover:bg-blue-600/25 transition-all duration-500" />
            <div className="absolute inset-0 bg-[radial-gradient(ellipse_80%_50%_at_50%_0%,rgba(59,130,246,0.12),transparent)] pointer-events-none" />

            <div className="flex flex-col gap-3 text-center md:text-left z-10 max-w-xl">
              <h3 className="text-2xl sm:text-3xl md:text-4xl font-black uppercase text-white tracking-wide leading-tight">
                Quer ver todas as especificações técnicas?
              </h3>
              <p className="text-[#D7E2EA]/70 text-sm sm:text-base font-light leading-relaxed">
                Acesse meu currículo técnico completo com linguagens, frameworks, bancos de dados, integrações e diferenciais de engenharia.
              </p>
            </div>

            <div className="z-10 flex-shrink-0">
              <button
                onClick={() => {
                  window.scrollTo({ top: 0, left: 0, behavior: 'instant' });
                  navigate('/curriculo');
                }}
                className="rounded-full text-white font-semibold uppercase tracking-wider text-xs sm:text-sm px-8 py-4 sm:px-10 sm:py-4.5 transition-all duration-300 hover:scale-105 active:scale-95 cursor-pointer shadow-[0_0_30px_rgba(37,99,235,0.4)] flex items-center gap-3 border border-white/20 hover:border-white/50"
                style={{
                  background: 'linear-gradient(135deg, #1d4ed8 0%, #2563eb 50%, #38bdf8 100%)',
                }}
              >
                <span>Ver Especificações Técnicas</span>
                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" className="w-4 h-4">
                  <path strokeLinecap="round" strokeLinejoin="round" d="M13.5 4.5L21 12m0 0l-7.5 7.5M21 12H3" />
                </svg>
              </button>
            </div>
          </div>
        </FadeIn>
      </div>
    </section>
  );
});

// 8. Process Section
const ProcessSection = memo(() => {
  const steps = [
    {
      num: "01",
      title: "Entendimento",
      desc: "Alinhamento profundo sobre objetivos, público-alvo e necessidades reais do seu negócio."
    },
    {
      num: "02",
      title: "Estratégia",
      desc: "Planejamento da estrutura focada em alta conversão e na melhor experiência do usuário."
    },
    {
      num: "03",
      title: "Design & Dev",
      desc: "Criação visual premium e desenvolvimento de código limpo, focado em alta performance."
    },
    {
      num: "04",
      title: "Entrega",
      desc: "Testes finais rigorosos, otimização SEO e publicação do seu projeto no ar."
    }
  ];

  return (
    <section id="process" className="bg-white text-[#0C0C0C] rounded-t-[40px] sm:rounded-t-[50px] md:rounded-t-[60px] px-5 sm:px-8 md:px-10 py-20 sm:py-24 md:py-32 relative z-45">
      <div className="max-w-5xl mx-auto flex flex-col">
        <FadeIn delay={0} y={40} className="w-full text-center mb-16 sm:mb-20">
          <h2 className="text-[#0C0C0C] font-black uppercase text-[clamp(2.5rem,10vw,140px)] leading-none select-none">
            Processo
          </h2>
        </FadeIn>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8 w-full mt-6">
          {steps.map((step, idx) => (
            <FadeIn key={idx} delay={idx * 0.15} y={30} className="flex flex-col gap-4">
              <span className="font-black text-[clamp(3rem,6vw,80px)] leading-none text-[#0C0C0C]/10">
                {step.num}
              </span>
              <h3 className="font-bold text-xl sm:text-2xl uppercase tracking-wider text-black">
                {step.title}
              </h3>
              <p className="font-light leading-relaxed text-[#0C0C0C]/70 text-sm sm:text-base">
                {step.desc}
              </p>
            </FadeIn>
          ))}
        </div>
      </div>
    </section>
  );
});

// 9. Testimonials Section
const TestimonialsSection = memo(() => {
  const [activeMobileIdx, setActiveMobileIdx] = useState(0);

  const testimonials = [
    {
      role: "Psicologia & Saúde",
      feedback: "Ficou maravilhoso, só elogios 😍. Ficou lindo, funcional e o sistema do blog está ajudando demais. Só tenho a agradecer pela atenção e trabalho!"
    },
    {
      role: "Advocacia & Jurídico",
      feedback: "Desde o início, você demonstrou um profissionalismo admirável, sempre atento aos detalhes, aberto às minhas ideias e extremamente comprometido. O resultado ficou muito além do que eu imaginava. O site ficou moderno, leve, intuitivo e visualmente impecável."
    },
    {
      role: "Comércio & Vendas",
      feedback: "Davi, testei a página de vendas que você fez e o resultado está incrível! Meu retorno melhorou 3 vezes e a página está muito rápida. Muito obrigado!"
    }
  ];

  return (
    <section id="testimonials" className="bg-[#0C0C0C] text-[#D7E2EA] rounded-t-[40px] sm:rounded-t-[50px] md:rounded-t-[60px] px-5 sm:px-8 md:px-10 py-20 sm:py-24 md:py-32 relative z-50 -mt-10 sm:-mt-12 md:-mt-14 overflow-hidden">
      <div className="max-w-6xl mx-auto flex flex-col">
        <FadeIn delay={0} y={40} className="w-full text-center mb-12 sm:mb-16">
          <h2 className="hero-heading font-black uppercase text-[clamp(2.5rem,10vw,140px)] leading-none select-none">
            Feedbacks
          </h2>
          <p className="text-[#D7E2EA]/60 text-sm sm:text-base mt-4 max-w-md mx-auto">
            O que clientes e parceiros dizem sobre o trabalho entregue.
          </p>
        </FadeIn>

        {/* Desktop View: 3-column grid */}
        <div className="hidden md:grid md:grid-cols-3 gap-6 w-full">
          {testimonials.map((test, idx) => (
            <FadeIn key={idx} delay={idx * 0.15} y={30} className="bg-[#121212] border border-[#D7E2EA]/10 rounded-[28px] p-7 lg:p-8 flex flex-col justify-between hover:border-blue-500/40 hover:bg-[#151515] transition-all duration-300 shadow-xl">
              <div>
                <svg className="w-8 h-8 text-blue-500/40 mb-4" fill="currentColor" viewBox="0 0 32 32">
                  <path d="M10.041 21.096c-1.397-2.315-1.996-4.996-1.782-7.962.193-2.673 1.258-4.966 3.195-6.88 1.937-1.914 4.305-3.085 7.106-3.513l1.109 2.505c-1.571.554-2.88 1.341-3.928 2.361-1.047 1.02-1.748 2.222-2.102 3.606 1.761 0 3.238.561 4.432 1.684 1.194 1.123 1.791 2.551 1.791 4.284 0 1.713-.604 3.167-1.811 4.364-1.208 1.196-2.709 1.795-4.502 1.795-1.551 0-2.822-.748-3.811-2.244zm14.156 0c-1.397-2.315-1.996-4.996-1.782-7.962.193-2.673 1.258-4.966 3.195-6.88 1.937-1.914 4.305-3.085 7.106-3.513l1.109 2.505c-1.571.554-2.88 1.341-3.928 2.361-1.047 1.02-1.748 2.222-2.102 3.606 1.761 0 3.238.561 4.432 1.684 1.194 1.123 1.791 2.551 1.791 4.284 0 1.713-.604 3.167-1.811 4.364-1.208 1.196-2.709 1.795-4.502 1.795-1.551 0-2.822-.748-3.811-2.244z"/>
                </svg>
                <p className="font-light leading-relaxed text-[#D7E2EA]/85 text-sm lg:text-base italic">
                  "{test.feedback}"
                </p>
              </div>
              <div className="mt-6 pt-5 border-t border-[#D7E2EA]/10 flex items-center justify-between">
                <span className="text-blue-400 text-xs uppercase tracking-widest font-semibold">{test.role}</span>
                <span className="text-emerald-400/90 text-[10px] uppercase font-mono tracking-wider">Verificado</span>
              </div>
            </FadeIn>
          ))}
        </div>

        {/* Mobile View: Touch Carousel */}
        <div className="md:hidden flex flex-col items-center w-full">
          <div 
            className="w-full flex overflow-x-auto snap-x snap-mandatory no-scrollbar gap-4 pb-4 px-1"
            onScroll={(e) => {
              const target = e.currentTarget;
              const cardWidth = target.offsetWidth * 0.85;
              const idx = Math.round(target.scrollLeft / cardWidth);
              if (idx >= 0 && idx < testimonials.length) {
                setActiveMobileIdx(idx);
              }
            }}
          >
            {testimonials.map((test, idx) => (
              <div
                key={idx}
                className="snap-center shrink-0 w-[88vw] max-w-[340px] bg-[#121212] border border-[#D7E2EA]/10 rounded-[28px] p-6 sm:p-7 flex flex-col justify-between shadow-2xl"
              >
                <div>
                  <svg className="w-7 h-7 text-blue-500/40 mb-3" fill="currentColor" viewBox="0 0 32 32">
                    <path d="M10.041 21.096c-1.397-2.315-1.996-4.996-1.782-7.962.193-2.673 1.258-4.966 3.195-6.88 1.937-1.914 4.305-3.085 7.106-3.513l1.109 2.505c-1.571.554-2.88 1.341-3.928 2.361-1.047 1.02-1.748 2.222-2.102 3.606 1.761 0 3.238.561 4.432 1.684 1.194 1.123 1.791 2.551 1.791 4.284 0 1.713-.604 3.167-1.811 4.364-1.208 1.196-2.709 1.795-4.502 1.795-1.551 0-2.822-.748-3.811-2.244zm14.156 0c-1.397-2.315-1.996-4.996-1.782-7.962.193-2.673 1.258-4.966 3.195-6.88 1.937-1.914 4.305-3.085 7.106-3.513l1.109 2.505c-1.571.554-2.88 1.341-3.928 2.361-1.047 1.02-1.748 2.222-2.102 3.606 1.761 0 3.238.561 4.432 1.684 1.194 1.123 1.791 2.551 1.791 4.284 0 1.713-.604 3.167-1.811 4.364-1.208 1.196-2.709 1.795-4.502 1.795-1.551 0-2.822-.748-3.811-2.244z"/>
                  </svg>
                  <p className="font-light leading-relaxed text-[#D7E2EA]/85 text-sm italic">
                    "{test.feedback}"
                  </p>
                </div>
                <div className="mt-6 pt-4 border-t border-[#D7E2EA]/10 flex items-center justify-between">
                  <span className="text-blue-400 text-xs uppercase tracking-widest font-semibold">{test.role}</span>
                  <span className="text-emerald-400/90 text-[10px] uppercase font-mono tracking-wider">Verificado</span>
                </div>
              </div>
            ))}
          </div>

          {/* Dots Indicator */}
          <div className="flex items-center gap-2 mt-4">
            {testimonials.map((_, i) => (
              <div
                key={i}
                className={`h-1.5 rounded-full transition-all duration-300 ${
                  activeMobileIdx === i ? 'w-6 bg-blue-500 shadow-[0_0_8px_#3B82F6]' : 'w-1.5 bg-white/20'
                }`}
              />
            ))}
          </div>
        </div>
      </div>
    </section>
  );
});

// 10. CTA Section
const CTASection = memo(() => {
  return (
    <section id="contact" className="relative min-h-[70vh] w-full flex flex-col justify-center items-center px-5 sm:px-8 md:px-10 py-20 bg-[#0C0C0C] border-t border-[#D7E2EA]/10">
      <div className="flex flex-col items-center text-center max-w-3xl z-20 gap-8 sm:gap-12">
        <FadeIn delay={0} y={40}>
          <h2 className="hero-heading font-black uppercase leading-none tracking-tight text-[clamp(2.2rem,8vw,100px)] select-none">
            Tem uma ideia?
          </h2>
          <h3 className="text-white font-bold text-xl sm:text-3xl md:text-4xl mt-4 max-w-2xl mx-auto">
            Vamos transformar em um projeto.
          </h3>
          <p className="text-[#D7E2EA]/60 text-sm sm:text-base md:text-lg mt-6 max-w-xl mx-auto leading-relaxed">
            Seja para criar um novo site, uma landing page de alta conversão ou tirar uma ideia do papel, estou pronto para ajudar seu negócio a crescer.
          </p>
        </FadeIn>

        <FadeIn delay={0.2} y={30}>
          <ContactButton 
            text="Iniciar Projeto" 
            onClick={() => {
              window.open("https://wa.me/5531998275828?text=Olá%20Davi!%20Gostaria%20de%20transformar%20uma%20ideia%20em%20projeto.", "_blank");
            }} 
          />
        </FadeIn>
      </div>
    </section>
  );
});

// 9. Footer
const Footer = memo(() => {
  const scrollToTop = () => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  return (
    <footer className="w-full bg-[#070709] border-t border-white/[0.08] pt-14 pb-10 px-6 sm:px-10 text-[#D7E2EA]/70 relative z-50">
      <div className="max-w-6xl mx-auto flex flex-col gap-10">
        
        {/* Main Footer Row */}
        <div className="grid grid-cols-1 md:grid-cols-12 gap-8 items-start text-center md:text-left">
          
          {/* Col 1: Brand & Info (5 cols) */}
          <div className="md:col-span-5 flex flex-col items-center md:items-start gap-3">
            <div className="flex items-center gap-2">
              <span className="w-2 h-2 rounded-full bg-blue-500 shadow-[0_0_8px_#3B82F6]"></span>
              <h4 className="text-white font-black text-xl sm:text-2xl uppercase tracking-wider">
                Davi Aleixo
              </h4>
            </div>
            <p className="text-blue-400 text-xs sm:text-sm font-semibold uppercase tracking-widest font-mono">
              Desenvolvedor Full Stack • Web Designer
            </p>
            <p className="text-[#D7E2EA]/60 text-xs sm:text-sm font-light leading-relaxed max-w-sm">
              Especialista em Sites de Alta Performance, Landing Pages de Conversão e Sistemas Personalizados.
            </p>
          </div>

          {/* Col 2: Navigation Links (4 cols) */}
          <div className="md:col-span-4 flex flex-col items-center md:items-start gap-3">
            <span className="text-[11px] uppercase tracking-[0.2em] text-white font-bold font-mono">
              Navegação Rápida
            </span>
            <div className="flex flex-wrap justify-center md:justify-start gap-x-6 gap-y-2 text-xs sm:text-sm text-[#D7E2EA]/70">
              <a href="#hero" className="hover:text-blue-400 transition-colors">Início</a>
              <a href="#marquee" className="hover:text-blue-400 transition-colors">Projetos</a>
              <a href="#about" className="hover:text-blue-400 transition-colors">Sobre</a>
              <a href="#services" className="hover:text-blue-400 transition-colors">Serviços</a>
              <a href="#experience" className="hover:text-blue-400 transition-colors">Trajetória</a>
              <a href="/curriculo" className="text-blue-400 font-medium hover:underline">Especificações Técnicas →</a>
            </div>
          </div>

          {/* Col 3: Quick Action & Back to Top (3 cols) */}
          <div className="md:col-span-3 flex flex-col items-center md:items-end gap-4">
            <a
              href="https://wa.me/5531998275828?text=Olá%20Davi!%20Gostaria%20de%20conversar%20sobre%20um%20projeto."
              target="_blank"
              rel="noopener noreferrer"
              className="px-5 py-2.5 rounded-full bg-blue-600 hover:bg-blue-500 text-white font-semibold text-xs uppercase tracking-wider shadow-[0_0_20px_rgba(37,99,235,0.35)] transition-all cursor-pointer"
            >
              Falar no WhatsApp
            </a>

            <button
              onClick={scrollToTop}
              className="flex items-center gap-1.5 text-xs uppercase tracking-widest text-[#D7E2EA]/50 hover:text-white transition-colors cursor-pointer group"
            >
              <span>Voltar ao topo</span>
              <span className="group-hover:-translate-y-0.5 transition-transform">↑</span>
            </button>
          </div>

        </div>

        {/* Bottom Copyright Row */}
        <div className="pt-8 border-t border-white/[0.06] flex flex-col sm:flex-row items-center justify-between gap-4 text-center sm:text-left text-xs text-[#D7E2EA]/50">
          <p>© {new Date().getFullYear()} Davi Aleixo. Todos os direitos reservados.</p>
          <p className="text-[11px] font-mono text-[#D7E2EA]/40">
            Desenvolvido com sofisticação, estratégia e alta performance.
          </p>
        </div>

      </div>
    </footer>
  );
});


// --- MAIN PORTFOLIO PAGE COMPONENT ---
export default function Portfolio() {
  return (
    <div className="w-full bg-[#0C0C0C] font-kanit overflow-x-clip text-[#D7E2EA]">
      <HeroSection />
      <MarqueeSection />
      <AboutSection />
      <ServicesSection />
      <DevelopSection />
      <DiferencialSection />
      <ExperienceSection />
      <ProcessSection />
      <TestimonialsSection />
      <CTASection />
      <Footer />
    </div>
  );
}
