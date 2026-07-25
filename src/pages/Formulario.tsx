import { useState } from 'react'
import { supabase } from '../lib/supabase'
import { GlowEffect } from '../components/ui/glow-effect'
import { ShineBorder } from '../components/ui/shine-border'
import 'react-phone-number-input/style.css'
import PhoneInput from 'react-phone-number-input'

const FATURAMENTO_OPTIONS = [
  'Comecei agora, ainda não estou faturando.',
  'R$ 1.000 a R$ 5.000',
  'R$ 5.000 a R$ 15.000',
  'R$ 15.000 a R$ 30.000,00',
  'R$ 30.000,00 a R$ 50.000,00',
  'R$ 50.000,00 a R$ 100.000,00',
  'Acima de R$ 100.000,00',
]

interface FormData {
  primeiro_nome: string
  email: string
  whatsapp: string
  possui_site: boolean | null
  objetivo: string
  tem_verba_anuncio: boolean | null
  faturamento_mensal: string
}

interface DiagnosticoResultado {
  recomendacao: string
  motivos: string[]
}

const TOTAL_STEPS = 7

function RadioOption({
  label,
  selected,
  onClick,
}: {
  label: string
  selected: boolean
  onClick: () => void
}) {
  return (
    <div className={`radio-option${selected ? ' selected' : ''}`} onClick={onClick}>
      <div className="radio-circle">
        {selected && <div className="radio-dot" />}
      </div>
      <span className="radio-label">{label}</span>
    </div>
  )
}

export default function Formulario() {
  const [step, setStep] = useState(1)
  const [data, setData] = useState<FormData>({
    primeiro_nome: '',
    email: '',
    whatsapp: '',
    possui_site: null,
    objetivo: '',
    tem_verba_anuncio: null,
    faturamento_mensal: '',
  })
  const [submitted, setSubmitted] = useState(false)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')
  const [resultado, setResultado] = useState<DiagnosticoResultado | null>(null)

  const next = () => {
    setError('')
    if (!canAdvance()) {
      showValidationError()
      return
    }
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
      case 3: {
        const rawDigits = data.whatsapp.replace(/\D/g, '')
        const localDigits = rawDigits.startsWith('55') && rawDigits.length > 11 ? rawDigits.slice(2) : rawDigits
        return localDigits.length === 10 || localDigits.length === 11
      }
      case 4: return data.possui_site !== null
      case 5: return data.objetivo !== ''
      case 6: return data.tem_verba_anuncio !== null
      case 7: return data.faturamento_mensal !== ''
      default: return false
    }
  }

  const showValidationError = () => {
    switch (step) {
      case 1: setError('Por favor, preencha seu primeiro nome (mínimo 2 caracteres).'); break
      case 2: setError('Por favor, digite um e-mail válido.'); break
      case 3: setError('Por favor, insira um WhatsApp válido com DDD (10 ou 11 dígitos).'); break
      case 4: setError('Por favor, selecione se possui ou não um site.'); break
      case 5: setError('Por favor, selecione o seu objetivo principal.'); break
      case 6: setError('Por favor, informe se investe ou quer investir em anúncios.'); break
      case 7: setError('Por favor, selecione sua faixa de faturamento mensal.'); break
    }
  }

  const calcularDiagnostico = (): DiagnosticoResultado => {
    const { possui_site, objetivo, tem_verba_anuncio } = data

    // Caso 1: Não tem site + CRM -> CRM & Landing Page para impulsionar vendas
    if (possui_site === false && objetivo === 'automatizar') {
      return {
        recomendacao: 'Sistema CRM & Landing Page para Impulsionar Vendas',
        motivos: [
          'Sua empresa ainda não possui um site ou canal próprio de vendas na internet.',
          'Uma Landing Page de alta conversão atrairá e converterá visitantes em contatos diretos.',
          'O CRM organizará todos os atendimentos automaticamente para acelerar e fechar mais vendas.',
        ],
      }
    }

    // Caso 2: Já tem site + CRM
    if (objetivo === 'automatizar') {
      return {
        recomendacao: 'Sistema CRM & Automação de Atendimento',
        motivos: [
          'Sua empresa necessita organizar o histórico de contatos e centralizar atendimentos.',
          'Um CRM com automação reduz o tempo de resposta e impede a perda de novos leads.',
          'Permite acompanhar cada etapa do funil de vendas e automatizar tarefas repetitivas.',
        ],
      }
    }

    // Caso 2: Landing Page
    if (objetivo === 'vender_especifico' || tem_verba_anuncio) {
      return {
        recomendacao: 'Landing Page de Alta Conversão',
        motivos: [
          'Você tem como foco vender um serviço ou produto específico com alta conversão.',
          'Uma landing page é focada em transformar visitantes em contatos diretos, multiplicando suas vendas.',
          'Elimina distrações e otimiza os resultados do seu investimento publicitário.',
        ],
      }
    }

    // Caso 3 (Default): Site Institucional
    return {
      recomendacao: 'Site Institucional Profissional',
      motivos: [
        'Sua empresa ainda não possui um site profissional.',
        'Você quer fortalecer sua credibilidade e autoridade perante o mercado.',
        'Um site ajudará clientes a encontrarem sua empresa no Google e conhecerem seus serviços.',
      ],
    }
  }

  const handleSubmit = async () => {
    setError('')
    if (!canAdvance()) {
      showValidationError()
      return
    }
    setLoading(true)

    const diag = calcularDiagnostico()
    setResultado(diag)

    try {
      // Salva na tabela de diagnóstico leads_site
      const { error: sbError2 } = await supabase.from('leads_site').insert([
        {
          nome: data.primeiro_nome.trim(),
          email: data.email.trim(),
          whatsapp: data.whatsapp.trim(),
          possui_site: data.possui_site,
          investe_anuncios: data.tem_verba_anuncio,
          objetivo: data.objetivo,
          faturamento: data.faturamento_mensal,
          recomendacao_solucao: diag.recomendacao,
          motivos_diagnostico: diag.motivos,
          origem: 'diagnostico_site',
        },
      ])
      if (sbError2) {
        console.error('Erro Supabase leads_site:', sbError2)
        throw new Error(`Erro leads_site: ${sbError2.message}`)
      }
      setSubmitted(true)
    } catch (err: any) {
      setError(err.message || 'Ocorreu um erro ao enviar suas respostas. Tente novamente.')
    } finally {
      setLoading(false)
    }
  }

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter') {
      if (step < TOTAL_STEPS) next()
      else handleSubmit()
    }
  }

  const getWhatsAppUrl = () => {
    const rec = resultado?.recomendacao || 'Diagnóstico Digital'
    const msg = encodeURIComponent(
      `Olá! Fiz meu diagnóstico no site e minha recomendação foi: "${rec}". Gostaria de agendar uma conversa sobre o meu projeto.`
    )
    return `https://wa.me/5531998275828?text=${msg}`
  }

  // ─── Tela de sucesso / Diagnóstico ──────────────────────────────
  if (submitted && resultado) {
    return (
      <div className="form-page-container relative overflow-hidden">
        {/* ── Spline 3D Background (Apenas na parte final) ── */}
        <div className="pointer-events-none absolute inset-0 z-0 overflow-hidden">
          <iframe
            src="https://my.spline.design/motiontrails-mQJiWP02BoJRJj7QScWZ8Yil/"
            frameBorder="0"
            title="Motion trails background"
            className="h-[calc(100%+240px)] w-full -mt-16 -mb-[220px] scale-[1.1] sm:scale-[1.05] origin-top opacity-70"
            style={{ filter: "hue-rotate(60deg) saturate(1.2)" }}
          />
        </div>

        <div className="form-wrapper relative z-10">
          <ShineBorder color={["#3B82F6", "#FFFFFF", "#2563EB", "#FFFFFF"]} borderRadius={16} borderWidth={2} duration={5}>
            <div className="success-card w-full">
              <div className="success-icon" style={{ color: '#3B82F6', borderColor: 'rgba(59,130,246,0.4)', background: 'rgba(59,130,246,0.12)' }}>✓</div>
              <div className="success-badge" style={{ color: '#3B82F6', borderColor: 'rgba(59,130,246,0.4)', background: 'rgba(59,130,246,0.12)' }}>
                <span>●</span> Diagnóstico Calculado
              </div>
              
              <div style={{ textAlign: 'center', width: '100%' }}>
                <span style={{ fontSize: '12px', textTransform: 'uppercase', letterSpacing: '0.15em', color: '#3B82F6', fontWeight: 700 }}>
                  Recomendação:
                </span>
                <h1 className="success-title" style={{ marginTop: '6px', color: '#FFFFFF', fontSize: '26px', fontWeight: 800, textShadow: '0 0 25px rgba(59, 130, 246, 0.5)' }}>
                  {resultado.recomendacao}
                </h1>
              </div>

              <div style={{ 
                background: '#0F1929', 
                border: '1px solid rgba(59, 130, 246, 0.2)', 
                borderRadius: '12px', 
                padding: '20px', 
                textAlign: 'left', 
                width: '100%',
                boxShadow: 'inset 0 0 20px rgba(59, 130, 246, 0.05)'
              }}>
                <h4 style={{ fontSize: '13px', textTransform: 'uppercase', letterSpacing: '0.1em', color: '#3B82F6', fontWeight: 700, marginBottom: '12px' }}>
                  Por que recomendamos isso?
                </h4>
                <ul style={{ display: 'flex', flexDirection: 'column', gap: '10px', listStyle: 'none' }}>
                  {resultado.motivos.map((m, idx) => (
                    <li key={idx} style={{ fontSize: '14px', color: '#F8FAFC', lineHeight: '1.5', display: 'flex', alignItems: 'flex-start', gap: '8px', fontWeight: 500 }}>
                      <span style={{ color: '#3B82F6', fontWeight: 'bold' }}>•</span>
                      <span>{m}</span>
                    </li>
                  ))}
                </ul>
              </div>

              <p className="success-text" style={{ color: '#94A3B8', fontSize: '14px' }}>
                Obrigado, <strong style={{ color: '#FFFFFF' }}>{data.primeiro_nome}</strong>! Clique abaixo para conversarmos no WhatsApp sobre a melhor estratégia para o seu negócio.
              </p>

              <div className="relative w-full mt-2">
                <GlowEffect
                  colors={['#3B82F6', '#2563EB', '#1D4ED8', '#1E40AF', '#3B82F6']}
                  mode="colorShift"
                  blur="medium"
                  duration={3}
                  scale={1.04}
                  style={{ zIndex: -1 }}
                />
                <a
                  href={getWhatsAppUrl()}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="landing-cta-btn relative w-full text-center"
                  style={{ textDecoration: 'none' }}
                >
                  Falar no WhatsApp
                </a>
              </div>
            </div>
          </ShineBorder>
          <p className="form-footer">Web Designer & Desenvolvedor</p>
        </div>
      </div>
    )
  }

  // ─── Steps do Formulário ────────────────────────────────────────
  const renderStep = () => {
    switch (step) {

      // Step 1 — Nome
      case 1:
        return (
          <div className="step-card" key="s1" onKeyDown={handleKeyDown}>
            <div className="step-header">
              <h2 className="step-question">Qual é o seu primeiro nome?</h2>
            </div>
            <div className="input-group">
              <input
                autoFocus
                className="form-input"
                type="text"
                placeholder="Seu nome..."
                value={data.primeiro_nome}
                onChange={(e) => {
                  setError('')
                  setData({ ...data, primeiro_nome: e.target.value })
                }}
              />
            </div>
            <div className="relative w-full">
              <GlowEffect
                colors={['#3B82F6', '#2563EB', '#1D4ED8', '#1E40AF', '#3B82F6']}
                mode="colorShift"
                blur="medium"
                duration={3}
                scale={1.04}
                style={{ zIndex: -1 }}
              />
              <button className="landing-cta-btn relative w-full" onClick={next}>
                Continuar
                <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2.5" style={{ width: '18px', height: '18px' }}>
                  <path strokeLinecap="round" strokeLinejoin="round" d="M14 5l7 7m0 0l-7 7m7-7H3" />
                </svg>
              </button>
            </div>
          </div>
        )

      // Step 2 — Email
      case 2:
        return (
          <div className="step-card" key="s2" onKeyDown={handleKeyDown}>
            <div className="step-header">
              <h2 className="step-question">Qual é o seu melhor e-mail?</h2>
              <p className="step-subtitle">Usaremos apenas para contato comercial. Não enviamos spam.</p>
            </div>
            <div className="input-group">
              <input
                autoFocus
                className="form-input"
                type="email"
                placeholder="seu@email.com"
                value={data.email}
                onChange={(e) => {
                  setError('')
                  setData({ ...data, email: e.target.value })
                }}
              />
            </div>
            <div className="relative w-full">
              <GlowEffect
                colors={['#3B82F6', '#2563EB', '#1D4ED8', '#1E40AF', '#3B82F6']}
                mode="colorShift"
                blur="medium"
                duration={3}
                scale={1.04}
                style={{ zIndex: -1 }}
              />
              <button className="landing-cta-btn relative w-full" onClick={next}>
                Continuar
                <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2.5" style={{ width: '18px', height: '18px' }}>
                  <path strokeLinecap="round" strokeLinejoin="round" d="M14 5l7 7m0 0l-7 7m7-7H3" />
                </svg>
              </button>
            </div>
            <button className="btn-back" onClick={back}>← Voltar</button>
          </div>
        )

      // Step 3 — WhatsApp
      case 3:
        return (
          <div className="step-card" key="s3" onKeyDown={handleKeyDown}>
            <div className="step-header">
              <h2 className="step-question">Qual é o seu WhatsApp?</h2>
              <p className="step-subtitle">Com DDD. Ex: (11) 99999-0000</p>
            </div>
            <div className="input-group">
              <PhoneInput
                defaultCountry="BR"
                international={false}
                numberInputProps={{ maxLength: 15 }}
                placeholder="(11) 99999-9999"
                value={data.whatsapp}
                onChange={(val) => {
                  setError('')
                  if (val) {
                    const raw = val.replace(/\D/g, '')
                    if (raw.length > 13) return
                  }
                  setData({ ...data, whatsapp: val || '' })
                }}
              />
            </div>
            <div className="relative w-full">
              <GlowEffect
                colors={['#3B82F6', '#2563EB', '#1D4ED8', '#1E40AF', '#3B82F6']}
                mode="colorShift"
                blur="medium"
                duration={3}
                scale={1.04}
                style={{ zIndex: -1 }}
              />
              <button className="landing-cta-btn relative w-full" onClick={next}>
                Continuar
                <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2.5" style={{ width: '18px', height: '18px' }}>
                  <path strokeLinecap="round" strokeLinejoin="round" d="M14 5l7 7m0 0l-7 7m7-7H3" />
                </svg>
              </button>
            </div>
            <button className="btn-back" onClick={back}>← Voltar</button>
          </div>
        )

      // Step 4 — Possui Site
      case 4:
        return (
          <div className="step-card" key="s4">
            <div className="step-header">
              <h2 className="step-question">Sua empresa já possui um site profissional?</h2>
            </div>
            <div className="bool-buttons">
              <button
                className={`bool-btn${data.possui_site === false ? ' selected' : ''}`}
                onClick={() => {
                  setError('')
                  setData({ ...data, possui_site: false })
                }}
              >
                Não tenho site
              </button>
              <button
                className={`bool-btn${data.possui_site === true ? ' selected' : ''}`}
                onClick={() => {
                  setError('')
                  setData({ ...data, possui_site: true })
                }}
              >
                Já tenho site
              </button>
            </div>
            <div className="relative w-full">
              <GlowEffect
                colors={['#3B82F6', '#2563EB', '#1D4ED8', '#1E40AF', '#3B82F6']}
                mode="colorShift"
                blur="medium"
                duration={3}
                scale={1.04}
                style={{ zIndex: -1 }}
              />
              <button className="landing-cta-btn relative w-full" onClick={next}>
                Continuar
                <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2.5" style={{ width: '18px', height: '18px' }}>
                  <path strokeLinecap="round" strokeLinejoin="round" d="M14 5l7 7m0 0l-7 7m7-7H3" />
                </svg>
              </button>
            </div>
            <button className="btn-back" onClick={back}>← Voltar</button>
          </div>
        )

      // Step 5 — Objetivo Principal
      case 5:
        return (
          <div className="step-card" key="s5">
            <div className="step-header">
              <h2 className="step-question">Qual é o seu principal objetivo digital?</h2>
            </div>
            <div className="timing-buttons">
              {[
                { value: 'credibilidade', label: 'Fortalecer credibilidade e ser encontrado no Google' },
                { value: 'vender_especifico', label: 'Vender um produto ou serviço específico com tráfego' },
                { value: 'automatizar', label: 'Automatizar atendimento e processos de vendas (CRM)' },
              ].map((opt) => (
                <button
                  key={opt.value}
                  className={`timing-btn${data.objetivo === opt.value ? ' selected' : ''}`}
                  onClick={() => {
                    setError('')
                    setData({ ...data, objetivo: opt.value })
                  }}
                >
                  {opt.label}
                </button>
              ))}
            </div>
            <div className="relative w-full">
              <GlowEffect
                colors={['#3B82F6', '#2563EB', '#1D4ED8', '#1E40AF', '#3B82F6']}
                mode="colorShift"
                blur="medium"
                duration={3}
                scale={1.04}
                style={{ zIndex: -1 }}
              />
              <button className="landing-cta-btn relative w-full" onClick={next}>
                Continuar
                <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2.5" style={{ width: '18px', height: '18px' }}>
                  <path strokeLinecap="round" strokeLinejoin="round" d="M14 5l7 7m0 0l-7 7m7-7H3" />
                </svg>
              </button>
            </div>
            <button className="btn-back" onClick={back}>← Voltar</button>
          </div>
        )

      // Step 6 — Verba de anúncio
      case 6:
        return (
          <div className="step-card" key="s6">
            <div className="step-header">
              <h2 className="step-question">Você já investe ou quer investir em anúncios pagos (Meta/Google)?</h2>
            </div>
            <div className="bool-buttons">
              <button
                className={`bool-btn${data.tem_verba_anuncio === true ? ' selected' : ''}`}
                onClick={() => {
                  setError('')
                  setData({ ...data, tem_verba_anuncio: true })
                }}
              >
                Sim, invisto/pretendo
              </button>
              <button
                className={`bool-btn${data.tem_verba_anuncio === false ? ' selected' : ''}`}
                onClick={() => {
                  setError('')
                  setData({ ...data, tem_verba_anuncio: false })
                }}
              >
                Não invisto
              </button>
            </div>
            <div className="relative w-full">
              <GlowEffect
                colors={['#3B82F6', '#2563EB', '#1D4ED8', '#1E40AF', '#3B82F6']}
                mode="colorShift"
                blur="medium"
                duration={3}
                scale={1.04}
                style={{ zIndex: -1 }}
              />
              <button className="landing-cta-btn relative w-full" onClick={next}>
                Continuar
                <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2.5" style={{ width: '18px', height: '18px' }}>
                  <path strokeLinecap="round" strokeLinejoin="round" d="M14 5l7 7m0 0l-7 7m7-7H3" />
                </svg>
              </button>
            </div>
            <button className="btn-back" onClick={back}>← Voltar</button>
          </div>
        )

      // Step 7 — Faturamento mensal
      case 7:
        return (
          <div className="step-card" key="s7">
            <div className="step-header">
              <h2 className="step-question">Qual é a faixa de faturamento mensal do seu negócio?</h2>
            </div>
            <div className="input-group">
              <div className="radio-list">
                {FATURAMENTO_OPTIONS.map((opt) => (
                  <RadioOption
                    key={opt}
                    label={opt}
                    selected={data.faturamento_mensal === opt}
                    onClick={() => {
                      setError('')
                      setData({ ...data, faturamento_mensal: opt })
                    }}
                  />
                ))}
              </div>
            </div>
            {error && <p className="error-msg">{error}</p>}
            <div className="relative w-full">
              <GlowEffect
                colors={['#3B82F6', '#2563EB', '#1D4ED8', '#1E40AF', '#3B82F6']}
                mode="colorShift"
                blur="medium"
                duration={3}
                scale={1.04}
                style={{ zIndex: -1 }}
              />
              <button
                className="landing-cta-btn relative w-full"
                disabled={loading}
                onClick={handleSubmit}
              >
                {loading ? <><div className="spinner" /> Calculando Diagnóstico...</> : <>Gerar Diagnóstico Gratuito</>}
              </button>
            </div>
            <button className="btn-back" onClick={back}>← Voltar</button>
          </div>
        )

      default:
        return null
    }
  }

  return (
    <div className="form-page-container">
      <div className="form-wrapper">
        {/* Render Step */}
        {renderStep()}

        {/* Exibição de Erro */}
        {error && (
          <div className="error-msg-container flex justify-center text-center mt-2">
            <p className="error-msg">{error}</p>
          </div>
        )}

        {/* Footer */}
        <div className="discreet-footer">
          <span>Suas informações são seguras</span>
        </div>
      </div>
    </div>
  )
}
