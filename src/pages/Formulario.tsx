import { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { supabase } from '../lib/supabase'

const FATURAMENTO_OPTIONS = [
  'Comecei agora, ainda não estou faturando.',
  'R$ 1.000 a R$ 5.000',
  'R$ 5.000 a R$ 15.000',
  'R$ 15.000 a R$ 30.000,00',
  'R$ 30.000,00 a R$ 50.000,00',
  'R$ 50.000,00 a R$ 100.000,00',
  'Acima de R$ 100.000,00',
]

const TIMING_OPTIONS = [
  { value: 'Agora', label: 'Quero começar imediatamente', emoji: '🚀' },
  { value: 'Semana que vem', label: 'Preciso de alguns dias', emoji: '📅' },
]

interface FormData {
  primeiro_nome: string
  email: string
  whatsapp: string
  instagram_pessoal: string
  instagram_negocio: string
  faturamento_mensal: string
  faturamento_mes_passado: string
  tem_verba_anuncio: boolean | null
  quando_aumentar_vendas: string
}

const TOTAL_STEPS = 9

export default function Formulario() {
  const [step, setStep] = useState(1)
  const [data, setData] = useState<FormData>({
    primeiro_nome: '',
    email: '',
    whatsapp: '',
    instagram_pessoal: '',
    instagram_negocio: '',
    faturamento_mensal: '',
    faturamento_mes_passado: '',
    tem_verba_anuncio: null,
    quando_aumentar_vendas: '',
  })
  const [submitted, setSubmitted] = useState(false)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')

  const progress = (step / TOTAL_STEPS) * 100

  const next = () => {
    setError('')
    setStep((s) => Math.min(s + 1, TOTAL_STEPS))
  }
  const back = () => {
    setError('')
    setStep((s) => Math.max(s - 1, 1))
  }

  const canAdvance = () => {
    switch (step) {
      case 1: return data.primeiro_nome.trim().length >= 2
      case 2: return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(data.email)
      case 3: return data.whatsapp.replace(/\D/g, '').length >= 10
      case 4: return data.instagram_pessoal.trim().length >= 2
      case 5: return data.instagram_negocio.trim().length >= 2
      case 6: return data.faturamento_mensal !== ''
      case 7: return data.faturamento_mes_passado !== ''
      case 8: return data.tem_verba_anuncio !== null
      case 9: return data.quando_aumentar_vendas !== ''
      default: return false
    }
  }

  const handleSubmit = async () => {
    if (!canAdvance()) return
    setLoading(true)
    setError('')
    try {
      const { error: sbError } = await supabase.from('form_leads').insert([
        {
          primeiro_nome: data.primeiro_nome.trim(),
          email: data.email.trim(),
          whatsapp: data.whatsapp.trim(),
          instagram_pessoal: data.instagram_pessoal.trim(),
          instagram_negocio: data.instagram_negocio.trim(),
          faturamento_mensal: data.faturamento_mensal,
          faturamento_mes_passado: data.faturamento_mes_passado,
          tem_verba_anuncio: data.tem_verba_anuncio,
          quando_aumentar_vendas: data.quando_aumentar_vendas,
          origem: 'formulario-davi',
        },
      ])
      if (sbError) throw sbError
      setSubmitted(true)
    } catch (err: any) {
      setError(err.message || 'Ocorreu um erro ao enviar suas respostas. Tente novamente.')
    } finally {
      setLoading(false)
    }
  }

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && canAdvance()) {
      if (step < TOTAL_STEPS) next()
      else handleSubmit()
    }
  }

  return (
    <div className="min-h-screen bg-[#000000] text-[#E2E8F0] font-sans flex flex-col items-center justify-between p-6 relative overflow-hidden selection:bg-[#2563EB]/30 selection:text-white">
      {/* Premium Ambient Background Glows */}
      <div className="absolute top-[-25%] left-[-20%] w-[60vw] h-[60vw] rounded-full bg-gradient-to-br from-[#2563EB]/15 to-transparent blur-[140px] pointer-events-none animate-pulse" style={{ animationDuration: '8s' }} />
      <div className="absolute bottom-[-20%] right-[-15%] w-[65vw] h-[65vw] rounded-full bg-gradient-to-tr from-blue-600/10 to-transparent blur-[160px] pointer-events-none animate-pulse" style={{ animationDuration: '12s' }} />
      <div className="absolute top-[30%] left-[40%] w-[300px] h-[300px] rounded-full bg-blue-600/5 blur-[100px] pointer-events-none" />

      {/* Header */}
      <header className="w-full max-w-xl flex items-center justify-between z-10 pt-4 pb-2">
        <a href="/" className="flex items-center gap-3 group">
          <span className="relative flex h-3 w-3">
            <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-[#2563EB] opacity-75"></span>
            <span className="relative inline-flex rounded-full h-3 w-3 bg-gradient-to-r from-[#2563EB] to-blue-400"></span>
          </span>
          <span className="font-bold text-lg tracking-widest uppercase bg-gradient-to-r from-white to-[#D7E2EA]/70 bg-clip-text text-transparent group-hover:to-white transition-all duration-300">
            DAVI ALEIXO
          </span>
        </a>
        <a href="/" className="text-xs font-semibold text-[#D7E2EA]/50 hover:text-white uppercase tracking-widest transition-colors flex items-center gap-1.5 group">
          Voltar ao site
          <span className="group-hover:translate-x-1 transition-transform duration-200">→</span>
        </a>
      </header>

      {/* Main Form Container */}
      <main className="w-full max-w-xl my-auto z-10 flex flex-col gap-6 py-6">
        <AnimatePresence mode="wait">
          {submitted ? (
            <motion.div
              key="success"
              initial={{ opacity: 0, scale: 0.97, y: 10 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.97 }}
              transition={{ duration: 0.5, ease: [0.16, 1, 0.3, 1] }}
              className="w-full bg-[#0D0D0E]/60 backdrop-blur-2xl border border-white/[0.06] rounded-[32px] p-8 md:p-12 flex flex-col items-center text-center shadow-[0_24px_80px_-15px_rgba(37,99,235,0.12)] relative overflow-hidden"
            >
              <div className="absolute top-0 inset-x-0 h-1.5 bg-gradient-to-r from-[#2563EB] to-blue-400" />
              <div className="w-20 h-20 rounded-full bg-gradient-to-tr from-[#2563EB] to-blue-500 flex items-center justify-center text-3xl text-white mb-8 shadow-[0_0_40px_rgba(37,99,235,0.4)] relative">
                <span className="absolute inset-0 rounded-full bg-inherit blur-md opacity-40 animate-pulse" />
                <span className="relative">✓</span>
              </div>
              <span className="px-4 py-1.5 rounded-full text-[10px] font-bold tracking-widest bg-gradient-to-r from-[#2563EB]/20 to-blue-500/20 text-[#60A5FA] uppercase mb-5 border border-[#2563EB]/20">
                Formulário Recebido
              </span>
              <h1 className="text-2xl md:text-3xl font-extrabold uppercase tracking-wider text-white mb-4">
                Excelente, {data.primeiro_nome}!
              </h1>
              <p className="text-[#D7E2EA]/75 text-sm md:text-base leading-relaxed max-w-sm">
                Suas respostas foram salvas. Vou analisar seus dados pessoalmente e entrarei em contato via WhatsApp nas próximas horas.
              </p>
            </motion.div>
          ) : (
            <motion.div
              key="form-step"
              initial={{ opacity: 0, y: 12 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -12 }}
              transition={{ duration: 0.35, ease: [0.16, 1, 0.3, 1] }}
              className="w-full flex flex-col gap-5"
            >
              {/* Progress Bar */}
              <div className="flex flex-col gap-2.5 px-1">
                <div className="w-full h-1 bg-white/[0.04] rounded-full overflow-hidden relative">
                  <div 
                    className="h-full bg-gradient-to-r from-[#2563EB] via-blue-500 to-blue-400 transition-all duration-500 ease-out shadow-[0_0_8px_rgba(37,99,235,0.5)]"
                    style={{ width: `${progress}%` }}
                  />
                </div>
                <div className="flex justify-between items-center text-[10px] font-bold text-[#D7E2EA]/40 uppercase tracking-widest">
                  <span>Passo {step} de {TOTAL_STEPS}</span>
                  <span className="text-[#2563EB]/80">{Math.round(progress)}% Concluído</span>
                </div>
              </div>

              {/* Cards / Questions */}
              <div className="bg-[#0D0D0E]/60 backdrop-blur-2xl border border-white/[0.06] rounded-[32px] p-7 md:p-10 shadow-[0_32px_96px_-24px_rgba(0,0,0,0.8)] relative overflow-hidden">
                <div className="absolute top-0 inset-x-0 h-[1px] bg-gradient-to-r from-transparent via-white/10 to-transparent" />
                
                {step === 1 && (
                  <div className="flex flex-col gap-6" onKeyDown={handleKeyDown}>
                    <div>
                      <span className="text-[10px] font-bold uppercase tracking-widest text-[#2563EB]">Identificação</span>
                      <h2 className="text-xl md:text-2xl font-bold uppercase tracking-wider text-white mt-1">Como posso te chamar?</h2>
                      <p className="text-xs text-[#D7E2EA]/50 mt-1.5">Insira o seu primeiro nome para começarmos.</p>
                    </div>
                    <div className="relative">
                      <input
                        autoFocus
                        type="text"
                        className="w-full bg-white/[0.03] border border-white/[0.08] focus:border-[#2563EB]/80 rounded-2xl px-6 py-4.5 text-[#E2E8F0] placeholder-[#D7E2EA]/20 focus:outline-none focus:ring-4 focus:ring-[#2563EB]/10 transition-all duration-300 font-medium"
                        placeholder="Digite seu nome..."
                        value={data.primeiro_nome}
                        onChange={(e) => setData({ ...data, primeiro_nome: e.target.value })}
                      />
                    </div>
                  </div>
                )}

                {step === 2 && (
                  <div className="flex flex-col gap-6" onKeyDown={handleKeyDown}>
                    <div>
                      <span className="text-[10px] font-bold uppercase tracking-widest text-[#2563EB]">Contato Principal</span>
                      <h2 className="text-xl md:text-2xl font-bold uppercase tracking-wider text-white mt-1">Qual o seu melhor e-mail?</h2>
                      <p className="text-xs text-[#D7E2EA]/50 mt-1.5">Insira um e-mail válido para contato e acompanhamento.</p>
                    </div>
                    <div className="relative">
                      <input
                        autoFocus
                        type="email"
                        className="w-full bg-white/[0.03] border border-white/[0.08] focus:border-[#2563EB]/80 rounded-2xl px-6 py-4.5 text-[#E2E8F0] placeholder-[#D7E2EA]/20 focus:outline-none focus:ring-4 focus:ring-[#2563EB]/10 transition-all duration-300 font-medium"
                        placeholder="seu.email@exemplo.com"
                        value={data.email}
                        onChange={(e) => setData({ ...data, email: e.target.value })}
                      />
                    </div>
                  </div>
                )}

                {step === 3 && (
                  <div className="flex flex-col gap-6" onKeyDown={handleKeyDown}>
                    <div>
                      <span className="text-[10px] font-bold uppercase tracking-widest text-[#2563EB]">Conexão Imediata</span>
                      <h2 className="text-xl md:text-2xl font-bold uppercase tracking-wider text-white mt-1">Qual o seu WhatsApp?</h2>
                      <p className="text-xs text-[#D7E2EA]/50 mt-1.5">Por aqui agendaremos o seu diagnóstico gratuito. Com DDD.</p>
                    </div>
                    <div className="relative">
                      <input
                        autoFocus
                        type="tel"
                        className="w-full bg-white/[0.03] border border-white/[0.08] focus:border-[#2563EB]/80 rounded-2xl px-6 py-4.5 text-[#E2E8F0] placeholder-[#D7E2EA]/20 focus:outline-none focus:ring-4 focus:ring-[#2563EB]/10 transition-all duration-300 font-medium"
                        placeholder="(00) 99999-0000"
                        value={data.whatsapp}
                        onChange={(e) => setData({ ...data, whatsapp: e.target.value })}
                      />
                    </div>
                  </div>
                )}

                {step === 4 && (
                  <div className="flex flex-col gap-6" onKeyDown={handleKeyDown}>
                    <div>
                      <span className="text-[10px] font-bold uppercase tracking-widest text-[#2563EB]">Mídia Social</span>
                      <h2 className="text-xl md:text-2xl font-bold uppercase tracking-wider text-white mt-1">Seu Instagram pessoal</h2>
                      <p className="text-xs text-[#D7E2EA]/50 mt-1.5">Ex: @seu_perfil (mínimo 2 caracteres).</p>
                    </div>
                    <div className="relative">
                      <input
                        autoFocus
                        type="text"
                        className="w-full bg-white/[0.03] border border-white/[0.08] focus:border-[#2563EB]/80 rounded-2xl px-6 py-4.5 text-[#E2E8F0] placeholder-[#D7E2EA]/20 focus:outline-none focus:ring-4 focus:ring-[#2563EB]/10 transition-all duration-300 font-medium"
                        placeholder="@seuusuario"
                        value={data.instagram_pessoal}
                        onChange={(e) => setData({ ...data, instagram_pessoal: e.target.value })}
                      />
                    </div>
                  </div>
                )}

                {step === 5 && (
                  <div className="flex flex-col gap-6" onKeyDown={handleKeyDown}>
                    <div>
                      <span className="text-[10px] font-bold uppercase tracking-widest text-[#2563EB]">Negócio</span>
                      <h2 className="text-xl md:text-2xl font-bold uppercase tracking-wider text-white mt-1">Instagram da empresa</h2>
                      <p className="text-xs text-[#D7E2EA]/50 mt-1.5">Perfil de onde faremos a análise estrutural de anúncios.</p>
                    </div>
                    <div className="relative">
                      <input
                        autoFocus
                        type="text"
                        className="w-full bg-white/[0.03] border border-white/[0.08] focus:border-[#2563EB]/80 rounded-2xl px-6 py-4.5 text-[#E2E8F0] placeholder-[#D7E2EA]/20 focus:outline-none focus:ring-4 focus:ring-[#2563EB]/10 transition-all duration-300 font-medium"
                        placeholder="@instagramdaempresa"
                        value={data.instagram_negocio}
                        onChange={(e) => setData({ ...data, instagram_negocio: e.target.value })}
                      />
                    </div>
                  </div>
                )}

                {step === 6 && (
                  <div className="flex flex-col gap-6">
                    <div>
                      <span className="text-[10px] font-bold uppercase tracking-widest text-[#2563EB]">Faturamento</span>
                      <h2 className="text-xl md:text-2xl font-bold uppercase tracking-wider text-white mt-1">Qual a faixa de faturamento mensal atual do seu negócio?</h2>
                    </div>
                    <div className="flex flex-col gap-2.5 max-h-[320px] overflow-y-auto pr-1 custom-scrollbar">
                      {FATURAMENTO_OPTIONS.map((opt) => {
                        const isSelected = data.faturamento_mensal === opt;
                        return (
                          <button
                            key={opt}
                            onClick={() => setData({ ...data, faturamento_mensal: opt })}
                            className={`w-full text-left bg-white/[0.02] border rounded-2xl px-5 py-4 hover:bg-white/[0.06] transition-all duration-200 flex items-center justify-between group ${
                              isSelected 
                                ? 'border-[#2563EB] text-white bg-[#2563EB]/5 shadow-[0_0_15px_rgba(37,99,235,0.1)]' 
                                : 'border-white/[0.06] text-[#D7E2EA]/75'
                            }`}
                          >
                            <span className="text-sm font-medium">{opt}</span>
                            <div className={`w-5 h-5 rounded-full border flex items-center justify-center transition-all ${
                              isSelected ? 'border-[#2563EB] bg-[#2563EB]' : 'border-white/20 group-hover:border-white/40'
                            }`}>
                              {isSelected && <div className="w-2 h-2 rounded-full bg-white" />}
                            </div>
                          </button>
                        );
                      })}
                    </div>
                  </div>
                )}

                {step === 7 && (
                  <div className="flex flex-col gap-6">
                    <div>
                      <span className="text-[10px] font-bold uppercase tracking-widest text-[#2563EB]">Retrospecto</span>
                      <h2 className="text-xl md:text-2xl font-bold uppercase tracking-wider text-white mt-1">Quanto faturou no mês passado?</h2>
                    </div>
                    <div className="flex flex-col gap-2.5 max-h-[320px] overflow-y-auto pr-1 custom-scrollbar">
                      {FATURAMENTO_OPTIONS.map((opt) => {
                        const isSelected = data.faturamento_mes_passado === opt;
                        return (
                          <button
                            key={opt}
                            onClick={() => setData({ ...data, faturamento_mes_passado: opt })}
                            className={`w-full text-left bg-white/[0.02] border rounded-2xl px-5 py-4 hover:bg-white/[0.06] transition-all duration-200 flex items-center justify-between group ${
                              isSelected 
                                ? 'border-[#2563EB] text-white bg-[#2563EB]/5 shadow-[0_0_15px_rgba(37,99,235,0.1)]' 
                                : 'border-white/[0.06] text-[#D7E2EA]/75'
                            }`}
                          >
                            <span className="text-sm font-medium">{opt}</span>
                            <div className={`w-5 h-5 rounded-full border flex items-center justify-center transition-all ${
                              isSelected ? 'border-[#2563EB] bg-[#2563EB]' : 'border-white/20 group-hover:border-white/40'
                            }`}>
                              {isSelected && <div className="w-2 h-2 rounded-full bg-white" />}
                            </div>
                          </button>
                        );
                      })}
                    </div>
                  </div>
                )}

                {step === 8 && (
                  <div className="flex flex-col gap-6">
                    <div>
                      <span className="text-[10px] font-bold uppercase tracking-widest text-[#2563EB]">Orçamento de Tráfego</span>
                      <h2 className="text-xl md:text-2xl font-bold uppercase tracking-wider text-white mt-1">Orçamento para investir pelo menos R$30/dia em anúncios?</h2>
                      <p className="text-xs text-[#D7E2EA]/50 mt-1.5">Equivale a cerca de R$ 900 mensais direcionados às plataformas de anúncios.</p>
                    </div>
                    <div className="grid grid-cols-2 gap-4">
                      <button
                        onClick={() => setData({ ...data, tem_verba_anuncio: true })}
                        className={`border rounded-2xl py-6 flex flex-col items-center gap-3 transition-all duration-300 relative group overflow-hidden ${
                          data.tem_verba_anuncio === true 
                            ? 'border-[#2563EB] text-white bg-[#2563EB]/10 shadow-[0_0_20px_rgba(37,99,235,0.15)]' 
                            : 'border-white/[0.06] text-[#D7E2EA]/75 bg-white/[0.02] hover:bg-white/[0.05]'
                        }`}
                      >
                        <span className="text-3xl transition-transform duration-300 group-hover:scale-110">✅</span>
                        <span className="font-semibold text-xs sm:text-sm uppercase tracking-wider">Sim, possuo</span>
                      </button>
                      <button
                        onClick={() => setData({ ...data, tem_verba_anuncio: false })}
                        className={`border rounded-2xl py-6 flex flex-col items-center gap-3 transition-all duration-300 relative group overflow-hidden ${
                          data.tem_verba_anuncio === false 
                            ? 'border-[#2563EB] text-white bg-[#2563EB]/10 shadow-[0_0_20px_rgba(37,99,235,0.15)]' 
                            : 'border-white/[0.06] text-[#D7E2EA]/75 bg-white/[0.02] hover:bg-white/[0.05]'
                        }`}
                      >
                        <span className="text-3xl transition-transform duration-300 group-hover:scale-110">❌</span>
                        <span className="font-semibold text-xs sm:text-sm uppercase tracking-wider">Ainda não</span>
                      </button>
                    </div>
                  </div>
                )}

                {step === 9 && (
                  <div className="flex flex-col gap-6">
                    <div>
                      <span className="text-[10px] font-bold uppercase tracking-widest text-[#2563EB]">Timing do Projeto</span>
                      <h2 className="text-xl md:text-2xl font-bold uppercase tracking-wider text-white mt-1">Quando você gostaria de começar a aumentar as suas vendas?</h2>
                    </div>
                    <div className="flex flex-col gap-3.5">
                      {TIMING_OPTIONS.map((opt) => {
                        const isSelected = data.quando_aumentar_vendas === opt.value;
                        return (
                          <button
                            key={opt.value}
                            onClick={() => setData({ ...data, quando_aumentar_vendas: opt.value })}
                            className={`w-full text-left border rounded-2xl px-6 py-5 transition-all duration-300 flex items-center gap-4 group relative overflow-hidden ${
                              isSelected 
                                ? 'border-[#2563EB] text-white bg-[#2563EB]/10 shadow-[0_0_20px_rgba(37,99,235,0.15)]' 
                                : 'border-white/[0.06] text-[#D7E2EA]/85 bg-white/[0.02] hover:bg-white/[0.05]'
                            }`}
                          >
                            <span className="text-3xl transition-transform duration-300 group-hover:scale-110">{opt.emoji}</span>
                            <div className="flex flex-col">
                              <span className="font-semibold text-sm sm:text-base">{opt.label}</span>
                            </div>
                          </button>
                        );
                      })}
                    </div>
                  </div>
                )}

                {error && <p className="text-red-400 text-xs font-semibold mt-5 flex items-center gap-1.5">⚠️ {error}</p>}

                {/* Step Actions */}
                <div className="flex items-center justify-between mt-8 pt-6 border-t border-white/[0.06]">
                  {step > 1 ? (
                    <button
                      onClick={back}
                      className="px-6 py-3 border border-white/[0.08] hover:border-white/20 rounded-full hover:bg-white/[0.03] text-xs font-bold uppercase tracking-wider transition-all duration-200 active:scale-95 text-[#D7E2EA]/60 hover:text-white"
                    >
                      ← Voltar
                    </button>
                  ) : (
                    <div />
                  )}

                  {step < TOTAL_STEPS ? (
                    <button
                      onClick={next}
                      disabled={!canAdvance()}
                      className="px-8 py-3.5 bg-gradient-to-r from-[#2563EB] to-blue-600 disabled:from-white/5 disabled:to-white/5 disabled:text-[#D7E2EA]/20 disabled:cursor-not-allowed hover:brightness-110 text-white rounded-full font-bold text-xs uppercase tracking-widest shadow-[0_6px_24px_rgba(37,99,235,0.3)] disabled:shadow-none hover:scale-[1.02] active:scale-95 transition-all duration-300"
                    >
                      Continuar →
                    </button>
                  ) : (
                    <button
                      onClick={handleSubmit}
                      disabled={!canAdvance() || loading}
                      className="px-8 py-3.5 bg-gradient-to-r from-[#2563EB] via-blue-600 to-blue-500 disabled:opacity-50 disabled:cursor-not-allowed hover:brightness-110 text-white rounded-full font-bold text-xs uppercase tracking-widest shadow-[0_6px_30px_rgba(37,99,235,0.4)] hover:scale-[1.02] active:scale-95 transition-all duration-300"
                    >
                      {loading ? 'Processando...' : 'Finalizar Diagnóstico 🚀'}
                    </button>
                  )}
                </div>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </main>

      {/* Footer */}
      <footer className="w-full text-center z-10 py-4 border-t border-white/[0.04]">
        <p className="text-[10px] font-bold text-[#D7E2EA]/30 tracking-widest uppercase">
          Davi Aleixo · Marketing de Performance · Todos os direitos reservados 🔒
        </p>
      </footer>
    </div>
  );
}
