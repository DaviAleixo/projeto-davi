import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useNavigate } from 'react-router-dom';
import { 
  ArrowLeft, 
  Send,
  CheckCircle2,
  Briefcase, 
  GraduationCap,
  Layers,
  ShieldCheck,
  Cpu,
  Database,
  Workflow,
  BarChart3,
  Cloud,
  Code2
} from 'lucide-react';

// --- VIBRANT TECH ICONS ---
const ReactNextIcon = () => (
  <svg viewBox="0 0 24 24" fill="none" className="w-6 h-6 text-[#00D8FF]">
    <circle cx="12" cy="12" r="2" fill="#00D8FF"/>
    <ellipse cx="12" cy="12" rx="9" ry="3.5" stroke="#00D8FF" strokeWidth="1.4" transform="rotate(0 12 12)"/>
    <ellipse cx="12" cy="12" rx="9" ry="3.5" stroke="#00D8FF" strokeWidth="1.4" transform="rotate(60 12 12)"/>
    <ellipse cx="12" cy="12" rx="9" ry="3.5" stroke="#00D8FF" strokeWidth="1.4" transform="rotate(120 12 12)"/>
  </svg>
);

const JSTSIcon = () => (
  <svg viewBox="0 0 24 24" className="w-6 h-6">
    <rect width="24" height="24" rx="4" fill="#3178C6" />
    <path d="M4 8h5v1.8H7.4V16H5.6V9.8H4V8zm6.5 3.5c.4-.3 1-.6 1.7-.6 1.2 0 2 .7 2 1.7 0 1-.6 1.6-1.6 1.9l-.6.2c-.5.2-.7.3-.7.6 0 .3.3.6.8.6.5 0 1-.2 1.3-.4l.4 1.2c-.5.3-1.1.5-1.8.5-1.3 0-2.1-.7-2.1-1.8 0-1 .7-1.6 1.6-2l.6-.2c.4-.1.6-.3.6-.6 0-.3-.3-.5-.7-.5-.4 0-.8.2-1.1.4l-.5-1z" fill="#FFF" />
    <rect x="15" y="8" width="5" height="8" rx="1" fill="#F7DF1E" fillOpacity="0.3"/>
    <text x="16" y="14.5" fill="#F7DF1E" fontSize="7" fontWeight="bold" fontFamily="sans-serif">JS</text>
  </svg>
);

const HtmlTailwindIcon = () => (
  <svg viewBox="0 0 24 24" fill="none" className="w-6 h-6 text-[#38BDF8]">
    <path d="M12.001 5.25c-3.125 0-5.078 1.563-5.86 4.688 1.172-1.563 2.539-2.149 4.102-1.758 1.055.263 1.808 1.028 2.642 1.875 1.358 1.381 2.929 2.977 6.366 2.977 3.125 0 5.078-1.563 5.86-4.688-1.172 1.563-2.539 2.149-4.102 1.758-1.055-.263-1.808-1.028-2.642-1.875-1.358-1.381-2.929-2.977-6.366-2.977zM4.751 12.75c-3.125 0-5.078 1.563-5.86 4.688 1.172-1.563 2.539-2.149 4.102-1.758 1.055.263 1.808 1.028 2.642 1.875 1.358 1.381 2.929 2.977 6.366 2.977 3.125 0 5.078-1.563 5.86-4.688-1.172 1.563-2.539 2.149-4.102 1.758-1.055-.263-1.808-1.028-2.642-1.875-1.358-1.381-2.929-2.977-6.366-2.977z" fill="#38BDF8"/>
  </svg>
);

const NodeIcon = () => (
  <svg viewBox="0 0 24 24" fill="none" className="w-6 h-6 text-[#68A063]">
    <path d="M12 2L3.5 7V17L12 22L20.5 17V7L12 2Z" stroke="#68A063" strokeWidth="1.5" strokeLinejoin="round" fill="#68A063" fillOpacity="0.15"/>
    <path d="M12 6.5V17.5M8 9L12 11.5L16 9M8 15L12 12.5L16 15" stroke="#68A063" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
  </svg>
);

const ApiWebhookIcon = () => (
  <svg viewBox="0 0 24 24" fill="none" className="w-6 h-6 text-[#A855F7]">
    <circle cx="6" cy="12" r="3" stroke="#A855F7" strokeWidth="1.8"/>
    <circle cx="18" cy="6" r="3" stroke="#A855F7" strokeWidth="1.8"/>
    <circle cx="18" cy="18" r="3" stroke="#A855F7" strokeWidth="1.8"/>
    <path d="M8.7 10.7L15.3 7.3M8.7 13.3L15.3 16.7" stroke="#A855F7" strokeWidth="1.6" strokeLinecap="round"/>
  </svg>
);

const SqlIcon = () => (
  <svg viewBox="0 0 24 24" fill="none" className="w-6 h-6 text-[#336791]">
    <rect width="24" height="24" rx="4" fill="#336791" fillOpacity="0.2"/>
    <path d="M12 4C7.58 4 4 7.58 4 12C4 16.42 7.58 20 12 20C16.42 20 20 16.42 20 12C20 7.58 16.42 4 12 4ZM12 6C14.76 6 17 8.24 17 11C17 12.38 16.44 13.63 15.54 14.54L12 11V6ZM7.46 9.46C8.36 8.56 9.61 8 11 8V13L7.46 9.46ZM12 18C9.24 18 7 15.76 7 13C7 11.62 7.56 10.37 8.46 9.46L12 13V18ZM16.54 14.54C15.64 15.44 14.39 16 13 16V11L16.54 14.54Z" fill="#336791"/>
  </svg>
);

const SupabaseIcon = () => (
  <svg viewBox="0 0 24 24" fill="none" className="w-6 h-6 text-[#3ECF8E]">
    <path d="M13.4 2.5L3.8 13.8C3.4 14.3 3.8 15 4.4 15H11.5L10.6 21.5C10.4 22.3 11.4 22.8 11.9 22.2L21.5 10.9C21.9 10.4 21.5 9.7 20.9 9.7H13.8L14.7 3.2C14.9 2.4 13.9 1.9 13.4 2.5Z" fill="#3ECF8E"/>
  </svg>
);

const GitIcon = () => (
  <svg viewBox="0 0 24 24" fill="none" className="w-6 h-6 text-[#F05032]">
    <path d="M21.6 10.8L13.2 2.4C12.7 1.9 11.9 1.9 11.4 2.4L9.5 4.3L11.9 6.7C12.5 6.5 13.2 6.6 13.7 7.1C14.2 7.6 14.3 8.4 14.1 9L16.4 11.3C17 11.1 17.8 11.2 18.3 11.7C19 12.4 19 13.5 18.3 14.2C17.6 14.9 16.5 14.9 15.8 14.2C15.3 13.7 15.1 12.9 15.4 12.3L13.2 10.1V15.2C13.4 15.4 13.5 15.7 13.5 16C13.5 17.1 12.6 18 11.5 18C10.4 18 9.5 17.1 9.5 16C9.5 15.3 9.9 14.7 10.5 14.3V9.2L8.2 11.5L2.4 5.7C1.9 5.2 1.9 4.4 2.4 3.9L10.8 12.3C11.3 12.8 12.1 12.8 12.6 12.3L21.6 3.3C22.1 3.8 22.1 4.6 21.6 5.1L21.6 10.8Z" fill="#F05032"/>
  </svg>
);

const AiLlmIcon = () => (
  <svg viewBox="0 0 24 24" fill="none" className="w-6 h-6 text-[#EC4899]">
    <path d="M12 2L14.4 7.6L20 10L14.4 12.4L12 18L9.6 12.4L4 10L9.6 7.6L12 2Z" fill="#EC4899" fillOpacity="0.8"/>
    <path d="M18 16L19.2 18.8L22 20L19.2 21.2L18 24L16.8 21.2L14 20L16.8 18.8L18 16Z" fill="#EC4899"/>
  </svg>
);

const N8nIcon = () => (
  <svg viewBox="0 0 24 24" fill="none" className="w-6 h-6 text-[#FF6D5A]">
    <rect width="24" height="24" rx="4" fill="#FF6D5A" fillOpacity="0.2"/>
    <path d="M6 12C6 9.79 7.79 8 10 8C11.3 8 12.44 8.62 13.16 9.58L10.84 11.42C10.63 11.16 10.33 11 10 11C9.45 11 9 11.45 9 12C9 12.55 9.45 13 10 13C10.33 13 10.63 12.84 10.84 12.58L13.16 14.42C12.44 15.38 11.3 16 10 16C7.79 16 6 14.21 6 12Z" fill="#FF6D5A"/>
    <circle cx="17" cy="12" r="2.5" fill="#FF6D5A"/>
  </svg>
);

interface TechDomainItem {
  name: string;
  desc: string;
  level: 'AVANÇADO' | 'INTERMEDIÁRIO' | 'INTERMEDIÁRIO / AVANÇADO';
  percentage: number;
  category: 'frontend' | 'backend' | 'database' | 'ai' | 'devops';
}

const DOMAIN_TECHS: TechDomainItem[] = [
  {
    name: "React.js / Next.js",
    desc: "Desenvolvimento de aplicações e interfaces web modernas, responsivas e performáticas, utilizando componentização e boas práticas de desenvolvimento.",
    level: "AVANÇADO",
    percentage: 96,
    category: "frontend"
  },
  {
    name: "JavaScript / TypeScript",
    desc: "Desenvolvimento frontend e backend, criação de funcionalidades, manipulação de dados, tipagem e construção de aplicações web modernas.",
    level: "AVANÇADO",
    percentage: 95,
    category: "frontend"
  },
  {
    name: "HTML / CSS / Tailwind CSS",
    desc: "Construção de interfaces responsivas, layouts personalizados e experiências adaptadas para diferentes dispositivos e resoluções.",
    level: "AVANÇADO",
    percentage: 95,
    category: "frontend"
  },
  {
    name: "Node.js / Backend",
    desc: "Desenvolvimento de aplicações backend, regras de negócio, APIs e integração com bancos de dados e serviços externos.",
    level: "INTERMEDIÁRIO",
    percentage: 82,
    category: "backend"
  },
  {
    name: "APIs REST, Webhooks & Integrações",
    desc: "Desenvolvimento e consumo de APIs REST, integração entre sistemas e plataformas, autenticação, tratamento de dados e implementação de webhooks.",
    level: "AVANÇADO",
    percentage: 92,
    category: "backend"
  },
  {
    name: "PostgreSQL / MySQL / SQL",
    desc: "Modelagem e manipulação de bancos de dados relacionais, relacionamentos, consultas SQL, análise de dados e implementação de regras de negócio.",
    level: "AVANÇADO",
    percentage: 92,
    category: "database"
  },
  {
    name: "Supabase",
    desc: "Desenvolvimento de backends utilizando PostgreSQL, autenticação, autorização, políticas RLS, banco de dados e integração com aplicações web.",
    level: "INTERMEDIÁRIO / AVANÇADO",
    percentage: 88,
    category: "database"
  },
  {
    name: "Arquitetura de Software",
    desc: "Estruturação de aplicações, separação de responsabilidades, organização por camadas e definição de soluções pensando em manutenção, segurança e evolução dos sistemas.",
    level: "AVANÇADO",
    percentage: 90,
    category: "backend"
  },
  {
    name: "Autenticação & Segurança",
    desc: "Implementação e compreensão de autenticação, autorização, JWT, controle de acesso, proteção de APIs, gerenciamento de permissões e políticas de segurança de dados.",
    level: "INTERMEDIÁRIO / AVANÇADO",
    percentage: 88,
    category: "backend"
  },
  {
    name: "Git & GitHub",
    desc: "Versionamento de código, organização de repositórios, gerenciamento de branches e manutenção do histórico de desenvolvimento dos projetos.",
    level: "AVANÇADO",
    percentage: 92,
    category: "devops"
  },
  {
    name: "IA & LLMs",
    desc: "Integração de modelos de linguagem e recursos de inteligência artificial em aplicações, sistemas e automações.",
    level: "INTERMEDIÁRIO",
    percentage: 80,
    category: "ai"
  },
  {
    name: "RAG & Bancos Vetoriais",
    desc: "Experiência prática com recuperação de contexto, integração com modelos de linguagem e utilização de bancos vetoriais em projetos de inteligência artificial.",
    level: "INTERMEDIÁRIO",
    percentage: 78,
    category: "ai"
  },
  {
    name: "n8n & Automação",
    desc: "Criação de workflows, automação de processos e integração entre APIs, sistemas e serviços externos.",
    level: "INTERMEDIÁRIO",
    percentage: 82,
    category: "ai"
  },
  {
    name: "Tracking & Analytics",
    desc: "Implementação de Google Analytics 4, Google Tag Manager, eventos, pixels e acompanhamento de conversões e comportamento em aplicações web.",
    level: "INTERMEDIÁRIO",
    percentage: 85,
    category: "devops"
  },
  {
    name: "Deploy & Infraestrutura Web",
    desc: "Deploy e configuração de aplicações, domínios, DNS, SSL, variáveis de ambiente e publicação de projetos utilizando diferentes plataformas e ambientes de hospedagem.",
    level: "INTERMEDIÁRIO",
    percentage: 80,
    category: "devops"
  }
];

const OTHER_TOOLS = [
  "PHP", "Java", "Visual Objects", "Python", "Redis", "Vite", 
  "Express.js", "GA4", "Google Tag Manager", "Vercel", "Netlify", 
  "cPanel", "GitHub", "REST", "JWT"
];

const EXPERIENCES = [
  {
    role: "Web Designer & Desenvolvedor Full Stack",
    company: "Projetos Independentes",
    period: "Atual",
    desc: "Criação de experiências digitais para empresas e profissionais, desenvolvendo landing pages, páginas de vendas, sites, catálogos e soluções personalizadas com foco em unir estratégia, design e tecnologia."
  },
  {
    role: "Desenvolvedor Full Stack",
    company: "Ponto Azi Software",
    period: "Experiência Profissional",
    desc: "Desenvolvimento e evolução de sistemas empresariais utilizados em operações reais, criando novas funcionalidades, solucionando problemas e transformando necessidades de diferentes negócios em soluções digitais."
  },
  {
    role: "Desenvolvedor e Suporte",
    company: "Supra",
    period: "Experiência Profissional",
    desc: "Atuação no desenvolvimento de soluções para diferentes necessidades de negócio, incluindo a criação de um sistema para operações de distribuidoras e contato direto com demandas e desafios do dia a dia das empresas."
  },
  {
    role: "Desenvolvedor Full Stack",
    company: "Usecase Tecnologia",
    period: "Experiência Profissional",
    desc: "Início da minha trajetória profissional no desenvolvimento de soluções digitais, participando ativamente de projetos de grande porte, como o BioParque, e construindo uma base sólida na criação de sistemas e resolução de problemas reais."
  }
];

const EDUCATION = [
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

export default function Curriculo() {
  const navigate = useNavigate();
  const [selectedCategory, setSelectedCategory] = useState<'all' | 'frontend' | 'backend' | 'database' | 'ai' | 'devops'>('all');

  const filteredTechs = selectedCategory === 'all'
    ? DOMAIN_TECHS
    : DOMAIN_TECHS.filter(t => t.category === selectedCategory);

  return (
    <div className="min-h-screen w-full bg-[#05070D] text-[#D7E2EA] font-kanit selection:bg-blue-600 selection:text-white pb-24">
      {/* Background Ambience */}
      <div className="fixed inset-0 pointer-events-none z-0">
        <div className="absolute top-[-5%] left-[25%] w-[600px] h-[600px] bg-blue-600/10 rounded-full blur-[150px]" />
        <div className="absolute bottom-[10%] right-[15%] w-[500px] h-[500px] bg-sky-500/10 rounded-full blur-[150px]" />
      </div>

      {/* Top Navbar */}
      <header className="sticky top-0 z-50 backdrop-blur-xl bg-[#05070D]/85 border-b border-white/[0.08] px-6 py-4">
        <div className="max-w-6xl mx-auto flex items-center justify-between">
          <button
            onClick={() => navigate('/portfolio')}
            className="flex items-center gap-2 text-xs sm:text-sm uppercase tracking-widest text-[#D7E2EA]/80 hover:text-white transition-colors group cursor-pointer font-medium"
          >
            <ArrowLeft className="w-4 h-4 group-hover:-translate-x-1 transition-transform" />
            <span>Voltar ao Portfólio</span>
          </button>

          <div className="flex items-center gap-3">
            <a
              href="https://wa.me/5531998275828?text=Olá%20Davi!%20Vi%20suas%20especificações%20técnicas%20e%20gostaria%20de%20conversar."
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center gap-2 px-5 py-2 rounded-full bg-blue-600 hover:bg-blue-500 text-white font-semibold text-xs uppercase tracking-wider shadow-[0_0_20px_rgba(37,99,235,0.4)] transition-all cursor-pointer"
            >
              <Send className="w-3.5 h-3.5" />
              <span>Contratar</span>
            </a>
          </div>
        </div>
      </header>

      {/* Main Container */}
      <main className="max-w-6xl mx-auto px-5 sm:px-8 pt-10 sm:pt-14 relative z-10 flex flex-col gap-16">
        
        {/* ================= PROFILE HEADER CARD ================= */}
        <section className="bg-gradient-to-b from-[#0F172A]/90 to-[#0B0F19]/95 border border-white/10 rounded-[32px] p-8 sm:p-12 shadow-2xl relative overflow-hidden">
          <div className="absolute top-0 right-0 w-80 h-80 bg-blue-500/10 rounded-full blur-[90px] pointer-events-none" />
          
          <div className="flex flex-col lg:flex-row items-center lg:items-start gap-8 lg:gap-12 relative z-10">
            {/* Avatar */}
            <div className="relative flex-shrink-0">
              <div className="w-32 h-32 sm:w-40 sm:h-40 rounded-full p-1 bg-gradient-to-tr from-blue-600 via-sky-400 to-indigo-500 shadow-[0_0_35px_rgba(37,99,235,0.4)]">
                <div className="w-full h-full rounded-full overflow-hidden bg-gradient-to-b from-blue-600 via-blue-900 to-[#080B14] flex items-end justify-center">
                  <img
                    src="/davi.png"
                    alt="Davi Aleixo"
                    className="w-full h-full object-cover object-top"
                  />
                </div>
              </div>
            </div>

            {/* Info */}
            <div className="flex flex-col items-center lg:items-start text-center lg:text-left flex-1">
              <div className="flex items-center gap-3 mb-2 flex-wrap justify-center lg:justify-start">
                <span className="px-3 py-1 rounded-full bg-blue-500/10 border border-blue-500/30 text-blue-400 text-xs font-bold uppercase tracking-widest">
                  Currículo &amp; Especificações Técnicas
                </span>
              </div>

              <h1 className="text-3xl sm:text-5xl font-black uppercase text-white tracking-tight mt-1">
                Davi Aleixo
              </h1>
              <p className="text-blue-400 text-lg sm:text-xl font-medium tracking-wide mt-1">
                Desenvolvedor Full Stack • Web Designer • Soluções Digitais
              </p>

              <p className="text-[#D7E2EA]/70 font-light text-sm sm:text-base leading-relaxed mt-4 max-w-2xl">
                Desenvolvedor com sólida vivência na criação de sistemas web corporativos, landing pages de alta conversão e arquitetura de interfaces modernas. Foco em aliar engenharia de código robusta, estética refinada, velocidade extrema e métricas reais de negócio.
              </p>

              {/* Badges / Metrics */}
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 w-full mt-8 pt-6 border-t border-white/10">
                <div className="flex flex-col items-center lg:items-start">
                  <span className="text-2xl sm:text-3xl font-black text-white">+4</span>
                  <span className="text-[11px] uppercase tracking-widest text-[#D7E2EA]/50 font-medium">Anos de Atuação</span>
                </div>
                <div className="flex flex-col items-center lg:items-start">
                  <span className="text-2xl sm:text-3xl font-black text-blue-400">100%</span>
                  <span className="text-[11px] uppercase tracking-widest text-[#D7E2EA]/50 font-medium">Foco em Performance</span>
                </div>
                <div className="flex flex-col items-center lg:items-start">
                  <span className="text-2xl sm:text-3xl font-black text-white">Full Stack</span>
                  <span className="text-[11px] uppercase tracking-widest text-[#D7E2EA]/50 font-medium">Front &amp; Backend</span>
                </div>
                <div className="flex flex-col items-center lg:items-start">
                  <span className="text-2xl sm:text-3xl font-black text-sky-400">Next / React</span>
                  <span className="text-[11px] uppercase tracking-widest text-[#D7E2EA]/50 font-medium">Stack Principal</span>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* ================= HERO STACK & CODE CARD (EXACT MOCKUP DESIGN) ================= */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-center">
          
          {/* Left Column: Heading, Subtitle & Filter Tabs */}
          <div className="lg:col-span-7 flex flex-col gap-6">
            {/* Tag */}
            <div className="flex items-center gap-2">
              <div className="w-2 h-2 rounded-full bg-blue-500 shadow-[0_0_8px_#3B82F6] animate-pulse"></div>
              <span className="text-xs uppercase tracking-[0.2em] text-blue-400 font-bold">
                TECNOLOGIAS &amp; FERRAMENTAS
              </span>
            </div>

            {/* Big Heading */}
            <h1 className="text-4xl sm:text-5xl lg:text-6xl font-black uppercase tracking-tight leading-none text-white">
              Stack &amp; <br />
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-[#2563EB] via-[#38BDF8] to-[#60A5FA]">
                Especialidades
              </span>
            </h1>

            {/* Description */}
            <p className="text-[#D7E2EA]/70 text-sm sm:text-base font-light max-w-xl leading-relaxed">
              Tecnologias e competências que utilizo para desenvolver aplicações, sistemas e produtos digitais, atuando do frontend ao backend, banco de dados, integrações, arquitetura e deploy.
            </p>

            {/* Filter Pills */}
            <div className="flex items-center gap-2.5 flex-wrap pt-2">
              {[
                { id: 'all', label: 'Todas' },
                { id: 'frontend', label: 'Frontend' },
                { id: 'backend', label: 'Backend' },
                { id: 'database', label: 'Banco de Dados' },
                { id: 'ai', label: 'IA & Automação' },
                { id: 'devops', label: 'DevOps & Deploy' },
              ].map((tab) => (
                <button
                  key={tab.id}
                  onClick={() => setSelectedCategory(tab.id as any)}
                  className={`px-4 py-2 rounded-full text-xs font-semibold tracking-wider transition-all duration-200 cursor-pointer ${
                    selectedCategory === tab.id
                      ? 'bg-blue-600 text-white shadow-[0_0_15px_rgba(37,99,235,0.4)]'
                      : 'bg-[#0B1120] text-[#D7E2EA]/70 border border-white/[0.08] hover:border-white/20 hover:text-white'
                  }`}
                >
                  {tab.label}
                </button>
              ))}
            </div>
          </div>

          {/* Right Column: Code Card */}
          <div className="lg:col-span-5 relative">
            <div className="relative bg-[#090D18]/90 border border-white/10 rounded-2xl p-6 sm:p-8 font-mono text-xs sm:text-sm shadow-2xl overflow-hidden backdrop-blur-xl">
              {/* Floating Code Badge on Top-Left */}
              <div className="absolute top-4 left-4 w-8 h-8 rounded-lg bg-blue-600/20 border border-blue-500/50 flex items-center justify-center text-blue-400 font-bold shadow-[0_0_15px_rgba(37,99,235,0.3)]">
                &lt;/&gt;
              </div>

              {/* Dot Grid Pattern Texture on Right */}
              <div className="absolute top-4 right-4 bottom-4 w-24 opacity-15 pointer-events-none grid grid-cols-6 gap-2">
                {[...Array(36)].map((_, i) => (
                  <div key={i} className="w-1 h-1 rounded-full bg-blue-400"></div>
                ))}
              </div>

              {/* Code Snippet with Line Numbers */}
              <div className="flex flex-col gap-2 pt-8">
                <div className="flex items-center gap-4">
                  <span className="text-[#D7E2EA]/30 select-none">01</span>
                  <span><span className="text-pink-400 font-semibold">const</span> <span className="text-white">developer</span> = &#123;</span>
                </div>
                <div className="flex items-center gap-4">
                  <span className="text-[#D7E2EA]/30 select-none">02</span>
                  <span className="pl-4"><span className="text-blue-400">role</span>: <span className="text-emerald-400">'Full Stack Developer'</span>,</span>
                </div>
                <div className="flex items-center gap-4">
                  <span className="text-[#D7E2EA]/30 select-none">03</span>
                  <span className="pl-4"><span className="text-blue-400">focus</span>: [<span className="text-emerald-400">'produto'</span>, <span className="text-emerald-400">'arquitetura'</span>, <span className="text-emerald-400">'performance'</span>],</span>
                </div>
                <div className="flex items-center gap-4">
                  <span className="text-[#D7E2EA]/30 select-none">04</span>
                  <span className="pl-4"><span className="text-blue-400">mindset</span>: <span className="text-emerald-400">'problem-solving'</span>,</span>
                </div>
                <div className="flex items-center gap-4">
                  <span className="text-[#D7E2EA]/30 select-none">05</span>
                  <span className="pl-4"><span className="text-blue-400">code</span>: <span className="text-emerald-400">'clean &amp; scalable'</span>,</span>
                </div>
                <div className="flex items-center gap-4">
                  <span className="text-[#D7E2EA]/30 select-none">06</span>
                  <span className="pl-4"><span className="text-blue-400">learning</span>: <span className="text-emerald-400">'continuous'</span></span>
                </div>
                <div className="flex items-center gap-4">
                  <span className="text-[#D7E2EA]/30 select-none">07</span>
                  <span>&#125;</span>
                </div>
              </div>
            </div>
          </div>

        </div>

        {/* ================= DOMAIN OF TECHNOLOGIES LIST (MATCHING SCREENSHOT) ================= */}
        <div className="flex flex-col gap-6">
          <span className="text-xs uppercase tracking-[0.2em] text-[#D7E2EA]/40 font-bold font-mono">
            DOMÍNIO DAS TECNOLOGIAS
          </span>

          <div className="flex flex-col gap-3">
            <AnimatePresence mode="popLayout">
              {filteredTechs.map((item, idx) => (
                <motion.div
                  key={item.name}
                  layout
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, scale: 0.98 }}
                  transition={{ duration: 0.25, delay: idx * 0.02 }}
                  className="bg-[#090D18]/80 border border-white/[0.06] hover:border-white/15 rounded-2xl p-4 sm:p-5 flex flex-col md:flex-row items-start md:items-center justify-between gap-4 transition-all hover:bg-[#0B1120]"
                >
                  {/* Left: Name & Description */}
                  <div className="flex flex-col flex-1">
                    <h3 className="text-base sm:text-lg font-bold text-white tracking-wide">
                      {item.name}
                    </h3>
                    <p className="text-xs sm:text-sm text-[#D7E2EA]/60 font-light mt-0.5 leading-relaxed">
                      {item.desc}
                    </p>
                  </div>

                  {/* Right: Level Badge & Progress Bar */}
                  <div className="flex flex-col items-start md:items-end gap-1.5 w-full md:w-64 flex-shrink-0 pt-2 md:pt-0">
                    <span className={`text-[10px] uppercase tracking-widest font-bold ${
                      item.level === 'AVANÇADO' 
                        ? 'text-emerald-400' 
                        : item.level === 'INTERMEDIÁRIO / AVANÇADO'
                        ? 'text-sky-400'
                        : 'text-blue-400'
                    }`}>
                      {item.level}
                    </span>

                    {/* Progress Bar Track */}
                    <div className="w-full h-1.5 bg-white/10 rounded-full overflow-hidden relative">
                      <motion.div
                        initial={{ width: 0 }}
                        whileInView={{ width: `${item.percentage}%` }}
                        viewport={{ once: true }}
                        transition={{ duration: 0.8, delay: idx * 0.03 }}
                        className={`h-full rounded-full ${
                          item.level === 'AVANÇADO' 
                            ? 'bg-emerald-400 shadow-[0_0_8px_#34D399]' 
                            : item.level === 'INTERMEDIÁRIO / AVANÇADO'
                            ? 'bg-gradient-to-r from-blue-500 to-emerald-400 shadow-[0_0_8px_#38BDF8]'
                            : 'bg-blue-500 shadow-[0_0_8px_#3B82F6]'
                        }`}
                      />
                    </div>
                  </div>
                </motion.div>
              ))}
            </AnimatePresence>
          </div>
        </div>

        {/* ================= OTHER TECHNOLOGIES & TOOLS ================= */}
        <div className="relative rounded-[28px] bg-gradient-to-b from-[#0B1120]/90 via-[#080D18]/95 to-[#060913] border border-white/[0.09] p-7 sm:p-9 shadow-2xl overflow-hidden backdrop-blur-xl">
          {/* Subtle Ambient Background Glows */}
          <div className="absolute top-0 right-1/4 w-72 h-72 bg-blue-600/10 rounded-full blur-[80px] pointer-events-none" />
          <div className="absolute bottom-0 left-10 w-48 h-48 bg-sky-500/10 rounded-full blur-[60px] pointer-events-none" />

          {/* Header */}
          <div className="flex items-center justify-between flex-wrap gap-3 pb-5 border-b border-white/[0.06] relative z-10">
            <div className="flex items-center gap-3">
              <div className="w-8 h-8 rounded-lg bg-blue-600/20 border border-blue-500/40 flex items-center justify-center text-blue-400 font-mono text-xs shadow-[0_0_12px_rgba(37,99,235,0.3)]">
                &lt;/&gt;
              </div>
              <div>
                <h4 className="text-xs uppercase tracking-[0.2em] text-white font-bold font-mono">
                  Outras Tecnologias &amp; Ferramentas
                </h4>
                <p className="text-[11px] text-[#D7E2EA]/50 font-light mt-0.5">
                  Linguagens secundárias, ecossistemas de deploy, bibliotecas e infraestrutura
                </p>
              </div>
            </div>

            <span className="text-[10px] uppercase font-mono px-3 py-1 rounded-full bg-blue-500/10 border border-blue-500/20 text-blue-400 font-semibold tracking-widest hidden sm:inline-block">
              {OTHER_TOOLS.length} Tecnologias
            </span>
          </div>

          {/* Badges Grid */}
          <div className="flex flex-wrap gap-2.5 sm:gap-3 pt-6 relative z-10">
            {OTHER_TOOLS.map((tool, idx) => (
              <motion.div
                key={idx}
                whileHover={{ scale: 1.05, y: -2 }}
                transition={{ type: 'spring', stiffness: 400, damping: 20 }}
                className="group relative flex items-center gap-2 px-4 py-2.5 rounded-xl bg-[#0F172A]/70 border border-white/[0.08] hover:border-blue-500/50 hover:bg-[#1E293B]/90 hover:shadow-[0_0_20px_rgba(59,130,246,0.25)] transition-all duration-200 cursor-default"
              >
                {/* Subtle Glow Dot */}
                <span className="w-1.5 h-1.5 rounded-full bg-blue-400/60 group-hover:bg-blue-400 group-hover:shadow-[0_0_6px_#38BDF8] transition-all duration-200" />
                <span className="text-xs sm:text-sm font-mono font-medium text-[#D7E2EA]/85 group-hover:text-white transition-colors">
                  {tool}
                </span>
              </motion.div>
            ))}
          </div>
        </div>

        {/* ================= TRAJETÓRIA PROFISSIONAL ================= */}
        <div className="flex flex-col gap-8 pt-8 border-t border-white/10">
          <div className="flex items-center gap-2">
            <Briefcase className="w-5 h-5 text-blue-500" />
            <h2 className="text-2xl sm:text-3xl font-black uppercase text-white tracking-wide">
              Trajetória Profissional
            </h2>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {EXPERIENCES.map((exp, idx) => (
              <div
                key={idx}
                className="bg-[#090D18]/80 border border-white/[0.08] rounded-2xl p-6 sm:p-7 flex flex-col justify-between gap-3 hover:border-blue-500/30 transition-all"
              >
                <div>
                  <div className="flex justify-between items-start flex-wrap gap-2 mb-1">
                    <h3 className="font-bold text-lg sm:text-xl text-white">{exp.role}</h3>
                    <span className="text-[#D7E2EA]/50 text-xs uppercase tracking-widest font-mono">{exp.period}</span>
                  </div>
                  <p className="text-blue-400 font-medium uppercase text-xs tracking-wider">
                    {exp.company}
                  </p>
                  <p className="font-light leading-relaxed text-[#D7E2EA]/70 text-xs sm:text-sm mt-3">
                    {exp.desc}
                  </p>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* ================= FORMAÇÃO & EDUCAÇÃO ================= */}
        <div className="flex flex-col gap-8 pt-4">
          <div className="flex items-center gap-2">
            <GraduationCap className="w-5 h-5 text-blue-500" />
            <h2 className="text-2xl sm:text-3xl font-black uppercase text-white tracking-wide">
              Formação &amp; Qualificação
            </h2>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {EDUCATION.map((edu, idx) => (
              <div
                key={idx}
                className="bg-[#090D18]/80 border border-white/[0.08] rounded-2xl p-6 sm:p-7 flex flex-col justify-between gap-3"
              >
                <div>
                  <div className="flex justify-between items-start flex-wrap gap-2 mb-1">
                    <h3 className="font-bold text-lg sm:text-xl text-white">{edu.title}</h3>
                    <span className="text-[#D7E2EA]/50 text-xs uppercase tracking-widest font-mono">{edu.period}</span>
                  </div>
                  <p className="text-blue-400 font-medium uppercase text-xs tracking-wider">
                    {edu.company}
                  </p>
                  <p className="font-light leading-relaxed text-[#D7E2EA]/70 text-xs sm:text-sm mt-3">
                    {edu.desc}
                  </p>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* ================= BOTTOM CTA ================= */}
        <div className="bg-gradient-to-r from-blue-900/40 via-blue-700/30 to-blue-900/40 border border-blue-500/40 rounded-[32px] p-8 sm:p-12 text-center flex flex-col items-center gap-6 shadow-[0_10px_40px_rgba(37,99,235,0.2)] mt-6">
          <h2 className="text-2xl sm:text-4xl font-black uppercase text-white tracking-tight max-w-2xl">
            Pronto para transformar sua ideia em um projeto digital de alta qualidade?
          </h2>
          <p className="text-[#D7E2EA]/80 font-light text-sm sm:text-base max-w-xl leading-relaxed">
            Seja para desenvolvimento sob medida, contratação ou consultoria técnica, estou à disposição para impulsionar seu produto.
          </p>

          <div className="flex flex-wrap items-center justify-center gap-4 mt-2">
            <a
              href="https://wa.me/5531998275828?text=Olá%20Davi!%20Gostaria%20de%20conversar%20sobre%20uma%20oportunidade%20ou%20projeto."
              target="_blank"
              rel="noopener noreferrer"
              className="rounded-full bg-white text-black font-bold uppercase tracking-wider text-xs sm:text-sm px-8 py-3.5 hover:bg-white/90 transition-transform duration-200 hover:scale-105 active:scale-95 shadow-xl cursor-pointer"
            >
              Falar no WhatsApp
            </a>
            <button
              onClick={() => navigate('/portfolio')}
              className="rounded-full border border-white/30 text-white font-medium uppercase tracking-wider text-xs sm:text-sm px-8 py-3.5 hover:bg-white/10 transition-colors cursor-pointer"
            >
              Voltar ao Portfólio
            </button>
          </div>
        </div>

      </main>
    </div>
  );
}
