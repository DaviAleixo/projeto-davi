import { motion } from 'framer-motion'
import type { Variants } from 'framer-motion'
import { Instagram, Send, Briefcase, FileText } from 'lucide-react'


export default function Links() {
  const containerVariants: Variants = {
    hidden: { opacity: 0 },
    show: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1,
      },
    },
  }

  const itemVariants: Variants = {
    hidden: { opacity: 0, y: 20 },
    show: { opacity: 1, y: 0, transition: { type: 'spring', stiffness: 100 } },
  }

  const socialLinks = [
    {
      title: 'Consultoria via WhatsApp',
      subtitle: 'Fale diretamente comigo para acelerar suas vendas',
      icon: <Send className="w-6 h-6 text-white" />,
      url: 'https://wa.me/5500000000000', // User can customize this link
      highlight: true,
    },
    {
      title: 'Fazer Diagnóstico Gratuito',
      subtitle: 'Preencha o formulário e receba uma análise do seu negócio',
      icon: <FileText className="w-6 h-6 text-[#B600A8]" />,
      url: '/formulario',
      internal: true,
    },
    {
      title: 'Ver Meu Portfólio',
      subtitle: 'Conheça meus projetos, resultados e metodologia de trabalho',
      icon: <Briefcase className="w-6 h-6 text-[#7621B0]" />,
      url: '/',
      internal: true,
    },
    {
      title: 'Acompanhar no Instagram',
      subtitle: 'Conteúdo diário sobre tráfego pago, marketing e vendas',
      icon: <Instagram className="w-6 h-6 text-[#BE4C00]" />,
      url: 'https://instagram.com/', // User can customize
    },
  ]

  return (
    <div className="min-h-screen bg-[#0C0C0C] text-[#D7E2EA] font-kanit flex flex-col items-center justify-between p-6 relative overflow-hidden">
      {/* Background Gradients */}
      <div className="absolute top-[-20%] left-[-20%] w-[60vw] h-[60vw] rounded-full bg-[#B600A8]/10 blur-[130px] pointer-events-none" />
      <div className="absolute bottom-[-20%] right-[-20%] w-[60vw] h-[60vw] rounded-full bg-[#7621B0]/10 blur-[130px] pointer-events-none" />

      {/* Main Content Area */}
      <main className="w-full max-w-md mx-auto z-10 flex flex-col items-center pt-16 pb-12">
        {/* Profile Card */}
        <motion.div 
          initial={{ opacity: 0, scale: 0.8 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.5, ease: 'easeOut' }}
          className="flex flex-col items-center text-center mb-8"
        >
          {/* Avatar Container with glowing animation */}
          <div className="relative w-24 h-24 mb-4">
            <div className="absolute inset-0 rounded-full bg-gradient-to-tr from-[#B600A8] via-[#7621B0] to-[#BE4C00] animate-pulse blur-md opacity-75" />
            <div className="relative w-full h-full rounded-full border-2 border-white/20 bg-[#121212] overflow-hidden flex items-center justify-center">
              {/* Initials or generic avatar if no image */}
              <span className="text-3xl font-bold bg-gradient-to-r from-[#B600A8] to-[#7621B0] bg-clip-text text-transparent">D</span>
            </div>
          </div>

          <h1 className="text-2xl font-bold uppercase tracking-wider text-white">Davi</h1>
          <p className="text-sm text-[#D7E2EA]/60 font-medium uppercase tracking-widest mt-1">Gestor de Tráfego Pago</p>
          <p className="text-xs text-[#D7E2EA]/40 mt-2 max-w-[280px] leading-relaxed">
            Escalando faturamentos através de anúncios online de alta conversão.
          </p>
        </motion.div>

        {/* Links List */}
        <motion.div 
          variants={containerVariants}
          initial="hidden"
          animate="show"
          className="w-full flex flex-col gap-4"
        >
          {socialLinks.map((link, idx) => {
            const hrefAttr = link.url
            
            return (
              <motion.a
                key={idx}
                href={hrefAttr}
                target={link.internal ? undefined : '_blank'}
                rel={link.internal ? undefined : 'noopener noreferrer'}
                variants={itemVariants}
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                className={`group flex items-center gap-4 p-4 rounded-2xl border transition-all duration-300 ${
                  link.highlight
                    ? 'bg-gradient-to-r from-[#B600A8] to-[#7621B0] border-transparent text-white shadow-[0_4px_20px_rgba(182,0,168,0.35)] hover:shadow-[0_4px_25px_rgba(182,0,168,0.5)]'
                    : 'bg-[#121212]/60 backdrop-blur-md border-white/10 text-[#D7E2EA] hover:border-white/20 hover:bg-white/5'
                }`}
              >
                <div className={`p-2.5 rounded-xl ${link.highlight ? 'bg-white/10' : 'bg-white/5 group-hover:bg-white/10'} transition-colors`}>
                  {link.icon}
                </div>
                <div className="flex-1 text-left">
                  <h3 className="font-semibold text-sm md:text-base uppercase tracking-wider group-hover:text-white transition-colors">{link.title}</h3>
                  <p className={`text-xs mt-0.5 ${link.highlight ? 'text-white/70' : 'text-[#D7E2EA]/50'}`}>{link.subtitle}</p>
                </div>
              </motion.a>
            )
          })}
        </motion.div>
      </main>

      {/* Footer */}
      <footer className="w-full text-center z-10 py-6 border-t border-white/5">
        <p className="text-xs text-[#D7E2EA]/30 uppercase tracking-widest">
          © {new Date().getFullYear()} Davi · Todos os direitos reservados
        </p>
      </footer>
    </div>
  )
}
