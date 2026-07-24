import React, { useRef, useState, useEffect } from 'react';
import { motion, useScroll, useTransform, MotionValue } from 'framer-motion';

// --- REUSABLE COMPONENTS ---

// 1. ContactButton
export const ContactButton: React.FC<{ text?: string; onClick?: () => void }> = ({ text = "Fale Comigo", onClick }) => {
  return (
    <button
      onClick={onClick}
      className="rounded-full text-white font-medium uppercase tracking-widest transition-transform duration-200 hover:scale-105 active:scale-95 px-8 py-3 sm:px-10 sm:py-3.5 md:px-12 md:py-4 text-xs sm:text-sm md:text-base cursor-pointer"
      style={{
        background: 'linear-gradient(123deg, #18011F 7%, #B600A8 37%, #7621B0 72%, #BE4C00 100%)',
        boxShadow: '0px 4px 4px rgba(181, 1, 167, 0.25), inset 4px 4px 12px #7721B1',
        outline: '2px solid white',
        outlineOffset: '-3px',
      }}
    >
      {text}
    </button>
  );
};

// 2. LiveProjectButton
export const LiveProjectButton: React.FC<{ text?: string; onClick?: () => void }> = ({ text = "Projeto ao vivo", onClick }) => {
  return (
    <button 
      onClick={onClick}
      className="rounded-full border-2 border-[#D7E2EA] text-[#D7E2EA] font-medium uppercase tracking-widest px-8 py-3 sm:px-10 sm:py-3.5 text-sm sm:text-base hover:bg-[#D7E2EA]/10 transition-colors duration-200 cursor-pointer"
    >
      {text}
    </button>
  );
};

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

export const FadeIn: React.FC<FadeInProps> = ({
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
};

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
const HeroSection: React.FC = () => {
  const scrollToSection = (id: string) => {
    const element = document.getElementById(id);
    if (element) {
      element.scrollIntoView({ behavior: 'smooth' });
    }
  };

  return (
    <section className="relative h-screen w-full flex flex-col justify-between overflow-hidden bg-[#0C0C0C]">
      {/* Navbar */}
      <FadeIn as="nav" delay={0} y={-20} className="w-full flex justify-between items-center px-6 md:px-10 pt-6 md:pt-8 z-20">
        {[
          { label: "Sobre", id: "about" },
          { label: "Serviços", id: "services" },
          { label: "Projetos", id: "projects" },
          { label: "Preços", id: "pricing" },
          { label: "Contato", id: "contact" }
        ].map((link) => (
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

      {/* Hero Heading Container */}
      <div className="flex-grow flex flex-col items-center justify-center w-full px-6 relative">
        {/* Hero Portrait */}
        <FadeIn delay={0.6} y={30} className="absolute left-1/2 -translate-x-1/2 z-10 bottom-0 sm:bottom-0 top-1/2 -translate-y-1/2 sm:top-auto sm:translate-y-0">
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

        {/* Headline overlay for premium feel */}
        <div className="z-20 text-center max-w-2xl px-4 mt-8 sm:mt-16 md:mt-24">
          <FadeIn delay={0.3} y={20}>
            <h2 className="text-[#D7E2EA] text-lg sm:text-xl md:text-2xl font-bold uppercase tracking-wider mb-2">
              Desenvolvendo experiências digitais que transformam visitantes em clientes.
            </h2>
            <p className="text-[#D7E2EA]/60 text-xs sm:text-sm md:text-base font-light">
              Sou Davi Aleixo, desenvolvedor e web designer especializado na criação de sites, landing pages e sistemas personalizados que unem estratégia, design e tecnologia para gerar resultados reais para empresas.
            </p>
          </FadeIn>
        </div>
      </div>

      {/* Bottom Bar */}
      <div className="w-full flex justify-between items-end px-6 md:px-10 pb-7 sm:pb-8 md:pb-10 z-20">
        <FadeIn delay={0.35} y={20} className="max-w-[160px] sm:max-w-[220px] md:max-w-[260px]">
          <div className="flex gap-3">
            <button 
              onClick={() => scrollToSection("contact")}
              className="rounded-full bg-white text-black font-semibold uppercase tracking-wider text-[10px] sm:text-xs px-4 py-2 hover:bg-white/90 transition-colors"
            >
              Solicitar Projeto
            </button>
            <button 
              onClick={() => scrollToSection("projects")}
              className="rounded-full border border-white/20 text-white font-semibold uppercase tracking-wider text-[10px] sm:text-xs px-4 py-2 hover:bg-white/10 transition-colors"
            >
              Ver Projetos
            </button>
          </div>
        </FadeIn>

        <FadeIn delay={0.5} y={20}>
          <ContactButton onClick={() => scrollToSection("contact")} />
        </FadeIn>
      </div>
    </section>
  );
};

// 2. MarqueeSection (Images marquee)
const MARQUEE_IMAGES = [
  "https://motionsites.ai/assets/hero-space-voyage-preview-eECLH3Yc.gif",
  "https://motionsites.ai/assets/hero-codenest-preview-Cgppc2qV.gif",
  "https://motionsites.ai/assets/hero-vex-ventures-preview-BczMFIiw.gif",
  "https://motionsites.ai/assets/hero-stellar-ai-v2-preview-DjvxjG3C.gif",
  "https://motionsites.ai/assets/hero-asme-preview-B_nGDnTP.gif",
  "https://motionsites.ai/assets/hero-transform-data-preview-Cx5OU29N.gif",
  "https://motionsites.ai/assets/hero-vitara-preview-Cjz2QYyU.gif",
  "https://motionsites.ai/assets/hero-terra-preview-BFjrCr7T.gif",
  "https://motionsites.ai/assets/hero-skyelite-preview-DHaZIgUv.gif",
  "https://motionsites.ai/assets/hero-aethera-preview-DknSlcTa.gif",
  "https://motionsites.ai/assets/hero-designpro-preview-D8c5_een.gif",
  "https://motionsites.ai/assets/hero-stellar-ai-preview-D3HL6bw1.gif",
  "https://motionsites.ai/assets/hero-xportfolio-preview-D4A8maiC.gif",
  "https://motionsites.ai/assets/hero-orbit-web3-preview-BXt4OttD.gif",
  "https://motionsites.ai/assets/hero-nexora-preview-cx5HmUgo.gif",
  "https://motionsites.ai/assets/hero-evr-ventures-preview-DZxeVFEX.gif",
  "https://motionsites.ai/assets/hero-planet-orbit-preview-DWAP8Z1P.gif",
  "https://motionsites.ai/assets/hero-new-era-preview-CocuDUm9.gif",
  "https://motionsites.ai/assets/hero-wealth-preview-B70idl_u.gif",
  "https://motionsites.ai/assets/hero-luminex-preview-CxOP7ce6.gif",
  "https://motionsites.ai/assets/hero-celestia-preview-0yO3jXO8.gif"
];

const MarqueeSection: React.FC = () => {
  const sectionRef = useRef<HTMLDivElement>(null);
  const [offset, setOffset] = useState(0);

  useEffect(() => {
    const handleScroll = () => {
      if (!sectionRef.current) return;
      const rect = sectionRef.current.getBoundingClientRect();
      const sectionTop = window.scrollY + rect.top;
      const calculatedOffset = (window.scrollY - sectionTop + window.innerHeight) * 0.3;
      setOffset(calculatedOffset);
    };

    window.addEventListener('scroll', handleScroll, { passive: true });
    handleScroll();
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const row1Images = [...MARQUEE_IMAGES.slice(0, 11), ...MARQUEE_IMAGES.slice(0, 11), ...MARQUEE_IMAGES.slice(0, 11)];
  const row2Images = [...MARQUEE_IMAGES.slice(11), ...MARQUEE_IMAGES.slice(11), ...MARQUEE_IMAGES.slice(11)];

  return (
    <section ref={sectionRef} id="marquee" className="w-full bg-[#0C0C0C] pt-24 sm:pt-32 md:pt-40 pb-10 overflow-hidden">
      <div className="flex flex-col gap-3">
        {/* Row 1: Moves RIGHT */}
        <div
          className="flex gap-3 transition-transform duration-75 ease-out"
          style={{
            transform: `translateX(${offset - 200}px)`,
            willChange: 'transform',
          }}
        >
          {row1Images.map((src, idx) => (
            <img
              key={`r1-${idx}`}
              src={src}
              alt="Marquee animation"
              loading="lazy"
              className="w-[420px] h-[270px] rounded-2xl object-cover flex-shrink-0"
            />
          ))}
        </div>

        {/* Row 2: Moves LEFT */}
        <div
          className="flex gap-3 transition-transform duration-75 ease-out"
          style={{
            transform: `translateX(${-(offset - 200)}px)`,
            willChange: 'transform',
          }}
        >
          {row2Images.map((src, idx) => (
            <img
              key={`r2-${idx}`}
              src={src}
              alt="Marquee animation"
              loading="lazy"
              className="w-[420px] h-[270px] rounded-2xl object-cover flex-shrink-0"
            />
          ))}
        </div>
      </div>
    </section>
  );
};

// 3. AboutSection
const AboutSection: React.FC = () => {
  return (
    <section id="about" className="relative min-h-screen w-full flex flex-col justify-center items-center px-5 sm:px-8 md:px-10 py-20 bg-[#0C0C0C] overflow-hidden">
      {/* Decorative Images/Badges - Kept the 3D aesthetic shapes for visual luxury */}
      {/* Top Left Moon */}
      <FadeIn delay={0.1} x={-80} y={0} duration={0.9} className="absolute top-[4%] left-[1%] sm:left-[2%] md:left-[4%] z-10 pointer-events-none">
        <img
          src="https://shrug-person-78902957.figma.site/_components/v2/ebb2b8f25d8e24d5f0a5ca8af4c950de81aa2fd7/moon_icon.11395d36.png"
          alt="Moon 3D"
          className="w-[120px] sm:w-[160px] md:w-[210px] h-auto object-contain opacity-40"
        />
      </FadeIn>

      {/* Bottom Left 3D Object */}
      <FadeIn delay={0.25} x={-80} y={0} duration={0.9} className="absolute bottom-[8%] left-[3%] sm:left-[6%] md:left-[10%] z-10 pointer-events-none">
        <img
          src="https://shrug-person-78902957.figma.site/_components/v2/ebb2b8f25d8e24d5f0a5ca8af4c950de81aa2fd7/p59_1.4659672e.png"
          alt="Abstract 3D Object"
          className="w-[100px] sm:w-[140px] md:w-[180px] h-auto object-contain opacity-40"
        />
      </FadeIn>

      {/* Top Right Lego Icon */}
      <FadeIn delay={0.15} x={80} y={0} duration={0.9} className="absolute top-[4%] right-[1%] sm:right-[2%] md:right-[4%] z-10 pointer-events-none">
        <img
          src="https://shrug-person-78902957.figma.site/_components/v2/ebb2b8f25d8e24d5f0a5ca8af4c950de81aa2fd7/lego_icon-1.703bb594.png"
          alt="Lego 3D"
          className="w-[120px] sm:w-[160px] md:w-[210px] h-auto object-contain opacity-40"
        />
      </FadeIn>

      {/* Bottom Right 3D Group */}
      <FadeIn delay={0.3} x={80} y={0} duration={0.9} className="absolute bottom-[8%] right-[3%] sm:right-[6%] md:right-[10%] z-10 pointer-events-none">
        <img
          src="https://shrug-person-78902957.figma.site/_components/v2/ebb2b8f25d8e24d5f0a5ca8af4c950de81aa2fd7/Group_134-1.2e04f3ce.png"
          alt="Abstract 3D Group"
          className="w-[130px] sm:w-[170px] md:w-[220px] h-auto object-contain opacity-40"
        />
      </FadeIn>

      {/* Content wrapper */}
      <div className="flex flex-col items-center text-center max-w-4xl z-20 gap-10 sm:gap-14 md:gap-16">
        <FadeIn delay={0} y={40}>
          <h2 className="hero-heading font-black uppercase leading-none tracking-tight text-[clamp(2.5rem,10vw,140px)] select-none">
            Sobre
          </h2>
          <h3 className="text-[#D7E2EA] font-semibold text-lg sm:text-2xl md:text-3xl mt-4 max-w-2xl mx-auto leading-relaxed">
            Mais do que desenvolver sites.
          </h3>
        </FadeIn>

        <div className="flex flex-col items-center gap-16 sm:gap-20 md:gap-24 w-full">
          <AnimatedText
            text="Meu objetivo é criar experiências digitais que fortaleçam marcas, transmitam credibilidade e transformem visitantes em oportunidades de negócio. Cada projeto é desenvolvido com foco em estratégia, performance, identidade visual e conversão, entregando soluções modernas que realmente ajudam empresas a crescer."
            className="text-[#D7E2EA] font-medium leading-relaxed max-w-[700px] text-[clamp(1rem,2vw,1.35rem)]"
          />

          <FadeIn delay={0.2} y={30}>
            <ContactButton onClick={() => {
              document.getElementById("contact")?.scrollIntoView({ behavior: 'smooth' });
            }} />
          </FadeIn>
        </div>
      </div>
    </section>
  );
};

// 4. ServicesSection
interface ServiceItem {
  number: string;
  name: string;
  description: string;
}

const SERVICES: ServiceItem[] = [
  {
    number: "01",
    name: "Landing Pages",
    description: "Landing pages desenvolvidas para campanhas de tráfego pago, lançamento de produtos, captação de leads e aumento das conversões.",
  },
  {
    number: "02",
    name: "Sites Institucionais",
    description: "Sites modernos, rápidos e totalmente responsivos para fortalecer a presença digital da sua empresa.",
  },
  {
    number: "03",
    name: "Sistemas Web",
    description: "Desenvolvimento de sistemas personalizados para automatizar processos internos e aumentar a produtividade.",
  },
  {
    number: "04",
    name: "CRM e Automações",
    description: "Integração entre CRM, formulários, WhatsApp, e-mail marketing e automações inteligentes para acelerar seu atendimento.",
  },
  {
    number: "05",
    name: "Otimização e Performance",
    description: "Melhoria de velocidade, SEO técnico, experiência do usuário e estrutura para entregar máxima performance.",
  },
];

const ServicesSection: React.FC = () => {
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
};

// 5. ProjectsSection
interface Project {
  number: string;
  name: string;
  category: string;
  client: string;
  description: string;
  images: {
    col1_1: string;
    col1_2: string;
    col2: string;
  };
}

const PROJECTS: Project[] = [
  {
    number: "01",
    name: "Landing Page Premium",
    category: "Landing Page",
    client: "Nexo Corp",
    description: "Página de alta conversão estruturada para lançamento de fundo de investimentos de alto padrão.",
    images: {
      col1_1: "https://images.higgs.ai/?default=1&output=webp&url=https%3A%2F%2Fd8j0ntlcm91z4.cloudfront.net%2Fuser_38xzZboKViGWJOttwIXH07lWA1P%2Fhf_20260412_055344_5eff02e0-87a5-41ce-b64f-eb08da8f33db.png&w=1280&q=85",
      col1_2: "https://images.higgs.ai/?default=1&output=webp&url=https%3A%2F%2Fd8j0ntlcm91z4.cloudfront.net%2Fuser_38xzZboKViGWJOttwIXH07lWA1P%2Fhf_20260412_055431_11d841fd-8b41-46a5-82e4-b04f2407a7d8.png&w=1280&q=85",
      col2: "https://images.higgs.ai/?default=1&output=webp&url=https%3A%2F%2Fd8j0ntlcm91z4.cloudfront.net%2Fuser_38xzZboKViGWJOttwIXH07lWA1P%2Fhf_20260412_055451_e317bf2d-28d4-48cc-86b0-6f72f25b6327.png&w=1280&q=85",
    },
  },
  {
    number: "02",
    name: "Site Institucional",
    category: "Site Institucional",
    client: "Apex Logística",
    description: "Website moderno e rápido com design minimalista com foco em captação de clientes corporativos.",
    images: {
      col1_1: "https://images.higgs.ai/?default=1&output=webp&url=https%3A%2F%2Fd8j0ntlcm91z4.cloudfront.net%2Fuser_38xzZboKViGWJOttwIXH07lWA1P%2Fhf_20260412_055654_911201c5-36d9-4bc6-bac7-331adfce159f.png&w=1280&q=85",
      col1_2: "https://images.higgs.ai/?default=1&output=webp&url=https%3A%2F%2Fd8j0ntlcm91z4.cloudfront.net%2Fuser_38xzZboKViGWJOttwIXH07lWA1P%2Fhf_20260412_055723_5ceda0b8-d9c2-4665-b2e3-83ba19ba76d1.png&w=1280&q=85",
      col2: "https://images.higgs.ai/?default=1&output=webp&url=https%3A%2F%2Fd8j0ntlcm91z4.cloudfront.net%2Fuser_38xzZboKViGWJOttwIXH07lWA1P%2Fhf_20260412_055753_adc5dcbd-a8e6-49c0-b43a-9b030d835cea.png&w=1280&q=85",
    },
  },
  {
    number: "03",
    name: "Sistema Web Personalizado",
    category: "Sistema Web",
    client: "Noctus Tech",
    description: "Plataforma de gestão integrada para centralização de dados, automações de atendimento e relatórios em tempo real.",
    images: {
      col1_1: "https://images.higgs.ai/?default=1&output=webp&url=https%3A%2F%2Fd8j0ntlcm91z4.cloudfront.net%2Fuser_38xzZboKViGWJOttwIXH07lWA1P%2Fhf_20260412_055759_963cfb0b-4bd1-4b0f-9d0a-09bd6cf95b2f.png&w=1280&q=85",
      col1_2: "https://images.higgs.ai/?default=1&output=webp&url=https%3A%2F%2Fd8j0ntlcm91z4.cloudfront.net%2Fuser_38xzZboKViGWJOttwIXH07lWA1P%2Fhf_20260412_060108_438f781a-9846-4dcc-89ab-c4e6cb830f5b.png&w=1280&q=85",
      col2: "https://images.higgs.ai/?default=1&output=webp&url=https%3A%2F%2Fd8j0ntlcm91z4.cloudfront.net%2Fuser_38xzZboKViGWJOttwIXH07lWA1P%2Fhf_20260412_055818_9d062121-ad7e-46b9-999a-1a6a692ef1ee.png&w=1280&q=85",
    },
  },
];

interface ProjectCardProps {
  project: Project;
  index: number;
  totalCards: number;
  scrollYProgress: MotionValue<number>;
}

const ProjectCard: React.FC<ProjectCardProps> = ({ project, index, totalCards, scrollYProgress }) => {
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
        className="w-full bg-[#0C0C0C] border-2 border-[#D7E2EA] rounded-[40px] sm:rounded-[50px] md:rounded-[60px] p-4 sm:p-6 md:p-8 flex flex-col gap-6 md:gap-8 shadow-2xl relative"
      >
        {/* Top Row */}
        <div className="flex flex-wrap justify-between items-center w-full gap-4 border-b border-[#D7E2EA]/10 pb-4">
          <div className="flex items-center gap-4 sm:gap-6">
            <span className="font-black text-[clamp(2.5rem,7vw,90px)] leading-none text-[#D7E2EA] hero-heading">
              {project.number}
            </span>
            <div className="flex flex-col">
              <span className="text-xs sm:text-sm text-[#D7E2EA]/60 uppercase tracking-widest">
                {project.category} • {project.client}
              </span>
              <h3 className="font-semibold text-lg sm:text-xl md:text-2xl uppercase tracking-wider text-[#D7E2EA]">
                {project.name}
              </h3>
              <p className="text-[#D7E2EA]/70 text-xs sm:text-sm mt-1 font-light max-w-lg">
                {project.description}
              </p>
            </div>
          </div>
          <LiveProjectButton text="Ver Projeto" onClick={() => {
            document.getElementById("contact")?.scrollIntoView({ behavior: 'smooth' });
          }} />
        </div>

        {/* Bottom Row - Two-column image grid */}
        <div className="grid grid-cols-1 md:grid-cols-10 gap-4 flex-1 w-full">
          {/* Left Column (40% width on desktop) */}
          <div className="md:col-span-4 flex flex-col gap-4">
            <img
              src={project.images.col1_1}
              alt={`${project.name} preview 1`}
              className="w-full object-cover rounded-[25px] sm:rounded-[35px] md:rounded-[45px]"
              style={{ height: 'clamp(130px, 16vw, 230px)' }}
            />
            <img
              src={project.images.col1_2}
              alt={`${project.name} preview 2`}
              className="w-full object-cover rounded-[25px] sm:rounded-[35px] md:rounded-[45px]"
              style={{ height: 'clamp(160px, 22vw, 340px)' }}
            />
          </div>

          {/* Right Column (60% width on desktop) */}
          <div className="md:col-span-6">
            <img
              src={project.images.col2}
              alt={`${project.name} main showcase`}
              className="w-full h-full min-h-[300px] object-cover rounded-[25px] sm:rounded-[35px] md:rounded-[45px]"
            />
          </div>
        </div>
      </motion.div>
    </div>
  );
};

const ProjectsSection: React.FC = () => {
  const containerRef = useRef<HTMLDivElement>(null);
  const { scrollYProgress } = useScroll({
    target: containerRef,
    offset: ["start start", "end end"]
  });

  return (
    <section
      ref={containerRef}
      id="projects"
      className="bg-[#0C0C0C] text-[#D7E2EA] rounded-t-[40px] sm:rounded-t-[50px] md:rounded-t-[60px] -mt-10 sm:-mt-12 md:-mt-14 relative z-30 px-5 sm:px-8 md:px-10 pt-20 pb-32"
    >
      <div className="max-w-5xl mx-auto flex flex-col">
        <FadeIn delay={0} y={40} className="w-full text-center mb-16 sm:mb-20">
          <h2 className="hero-heading font-black uppercase text-[clamp(2.5rem,10vw,140px)] leading-none select-none">
            Projetos
          </h2>
        </FadeIn>

        {/* Sticky-stacking container */}
        <div className="flex flex-col w-full relative">
          {PROJECTS.map((project, idx) => (
            <ProjectCard
              key={project.number}
              project={project}
              index={idx}
              totalCards={PROJECTS.length}
              scrollYProgress={scrollYProgress}
            />
          ))}
        </div>
      </div>
    </section>
  );
};

// 6. Diferencial Section
const DiferencialSection: React.FC = () => {
  const differentials = [
    {
      title: "Design Premium",
      desc: "Interfaces modernas inspiradas nas maiores empresas do mundo."
    },
    {
      title: "Alta Performance",
      desc: "Sites rápidos, otimizados e preparados para crescer."
    },
    {
      title: "Estratégia",
      desc: "Cada página é construída pensando em conversão."
    },
    {
      title: "Tecnologia",
      desc: "React, Next.js, WordPress, Tailwind e as melhores ferramentas do mercado."
    }
  ];

  return (
    <section id="differentials" className="bg-white text-[#0C0C0C] rounded-t-[40px] sm:rounded-t-[50px] md:rounded-t-[60px] px-5 sm:px-8 md:px-10 py-20 sm:py-24 md:py-32 relative z-35 -mt-10 sm:-mt-12 md:-mt-14">
      <div className="max-w-5xl mx-auto flex flex-col">
        <FadeIn delay={0} y={40} className="w-full text-center mb-16 sm:mb-20">
          <h2 className="text-[#0C0C0C] font-black uppercase text-[clamp(2.3rem,8vw,120px)] leading-none select-none">
            Por que escolher meu trabalho?
          </h2>
        </FadeIn>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-8 w-full mt-10">
          {differentials.map((item, idx) => (
            <FadeIn
              key={idx}
              delay={idx * 0.15}
              y={30}
              className="bg-[#0C0C0C]/5 rounded-3xl p-6 sm:p-8 md:p-10 border border-[#0C0C0C]/10 flex flex-col justify-between hover:bg-[#0C0C0C]/10 transition-colors duration-300"
            >
              <div>
                <h3 className="font-bold text-xl sm:text-2xl uppercase tracking-wider text-black">
                  {item.title}
                </h3>
                <p className="font-light leading-relaxed mt-4 text-[#0C0C0C]/70 text-sm sm:text-base md:text-lg">
                  {item.desc}
                </p>
              </div>
            </FadeIn>
          ))}
        </div>
      </div>
    </section>
  );
};

// 7. Pricing Section
const PricingSection: React.FC = () => {
  const tiers = [
    {
      title: "Landing Pages",
      desc: "LP Premium para tráfego pago, lançamentos e leads.",
      price: "Sob Consulta",
      whatsappMsg: "Olá Davi, gostaria de um orçamento para Landing Page."
    },
    {
      title: "Sites Institucionais",
      desc: "Otimizados, modernos e rápidos para a sua empresa.",
      price: "Sob Consulta",
      whatsappMsg: "Olá Davi, gostaria de um orçamento para Site Institucional."
    },
    {
      title: "Sistemas & CRM",
      desc: "Automações inteligentes e painéis sob medida.",
      price: "Sob Consulta",
      whatsappMsg: "Olá Davi, gostaria de solicitar orçamento para um Sistema/Automação personalizado."
    }
  ];

  return (
    <section id="pricing" className="bg-[#0C0C0C] text-[#D7E2EA] rounded-t-[40px] sm:rounded-t-[50px] md:rounded-t-[60px] px-5 sm:px-8 md:px-10 py-20 sm:py-24 md:py-32 relative z-40 -mt-10 sm:-mt-12 md:-mt-14 border-t border-[#D7E2EA]/10">
      <div className="max-w-5xl mx-auto flex flex-col">
        <FadeIn delay={0} y={40} className="w-full text-center mb-16 sm:mb-20">
          <h2 className="hero-heading font-black uppercase text-[clamp(2.5rem,10vw,140px)] leading-none select-none">
            Preços
          </h2>
        </FadeIn>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 w-full">
          {tiers.map((tier, idx) => (
            <FadeIn
              key={idx}
              delay={idx * 0.1}
              y={30}
              className="bg-[#121212] border border-[#D7E2EA]/10 rounded-[30px] p-6 sm:p-8 flex flex-col justify-between hover:border-[#D7E2EA]/30 transition-all duration-300 shadow-xl"
            >
              <div>
                <h3 className="font-bold text-lg sm:text-xl uppercase tracking-wider text-white">
                  {tier.title}
                </h3>
                <p className="text-[#D7E2EA]/60 text-xs sm:text-sm mt-3 font-light leading-relaxed">
                  {tier.desc}
                </p>
                <div className="text-white text-2xl font-black mt-6">
                  {tier.price}
                </div>
              </div>
              <div className="mt-8">
                <ContactButton 
                  text="Solicitar Orçamento" 
                  onClick={() => {
                    const text = encodeURIComponent(tier.whatsappMsg);
                    window.open(`https://wa.me/5511999999999?text=${text}`, '_blank');
                  }} 
                />
              </div>
            </FadeIn>
          ))}
        </div>
      </div>
    </section>
  );
};

// 8. CTA Section
const CTASection: React.FC = () => {
  return (
    <section id="contact" className="relative min-h-[70vh] w-full flex flex-col justify-center items-center px-5 sm:px-8 md:px-10 py-20 bg-[#0C0C0C] border-t border-[#D7E2EA]/10">
      <div className="flex flex-col items-center text-center max-w-3xl z-20 gap-8 sm:gap-12">
        <FadeIn delay={0} y={40}>
          <h2 className="hero-heading font-black uppercase leading-none tracking-tight text-[clamp(2rem,8vw,100px)] select-none">
            Contato
          </h2>
          <h3 className="text-white font-bold text-xl sm:text-2xl md:text-3xl mt-4">
            Vamos transformar sua ideia em um projeto de alto nível.
          </h3>
          <p className="text-[#D7E2EA]/60 text-sm sm:text-base md:text-lg mt-4 max-w-xl mx-auto leading-relaxed">
            Se você procura um site moderno, uma landing page de alta conversão ou um sistema desenvolvido sob medida, estou pronto para criar uma solução que gere resultados para o seu negócio.
          </p>
        </FadeIn>

        <FadeIn delay={0.2} y={30}>
          <ContactButton 
            text="Fale Comigo" 
            onClick={() => {
              window.open("https://wa.me/5511999999999?text=Ol%C3%A1%20Davi!%20Gostaria%20de%20solicitar%20um%20projeto%20com%20voc%C3%AA.", "_blank");
            }} 
          />
        </FadeIn>
      </div>
    </section>
  );
};

// 9. Footer
const Footer: React.FC = () => {
  return (
    <footer className="w-full bg-[#080808] border-t border-[#D7E2EA]/10 py-12 px-6 text-[#D7E2EA]/60 text-center text-xs sm:text-sm">
      <div className="max-w-5xl mx-auto flex flex-col md:flex-row justify-between items-center gap-6">
        <div className="text-left md:max-w-sm">
          <h4 className="text-white font-bold text-base uppercase tracking-wider">Davi Aleixo</h4>
          <p className="text-xs uppercase tracking-widest text-[#D7E2EA]/40 mt-1">Desenvolvedor Web & Web Designer</p>
          <p className="text-[#D7E2EA]/50 text-xs mt-2">
            Especialista em Sites, Landing Pages e Sistemas Personalizados.
          </p>
        </div>
        <div className="text-right">
          <p>© {new Date().getFullYear()} Davi Aleixo. Todos os direitos reservados.</p>
          <p className="text-[10px] text-[#D7E2EA]/30 mt-1">Desenvolvido com sofisticação, confiança e tecnologia.</p>
        </div>
      </div>
    </footer>
  );
};


// --- MAIN PORTFOLIO PAGE COMPONENT ---
export default function Portfolio() {
  return (
    <div className="w-full bg-[#0C0C0C] font-kanit overflow-x-clip text-[#D7E2EA]">
      <HeroSection />
      <MarqueeSection />
      <AboutSection />
      <ServicesSection />
      <ProjectsSection />
      <DiferencialSection />
      <PricingSection />
      <CTASection />
      <Footer />
    </div>
  );
}
