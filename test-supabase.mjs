import { createClient } from '@supabase/supabase-js'

const supabaseUrl = 'https://vwfivgjxxijwiwimvasl.supabase.co'
const supabaseKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InZ3Zml2Z2p4eGlqd2l3aW12YXNsIiwicm9sZSI6ImFub24iLCJpYXQiOjE3ODAzNDM0NDEsImV4cCI6MjA5NTkxOTQ0MX0.dciS0GPV7Hv2m4dvRwTuCPEENM_wDY9c19i7gf43180'
const supabase = createClient(supabaseUrl, supabaseKey)

async function run() {
  console.log('Testing insert with full data...')
  const { data, error } = await supabase.from('leads_site').insert([
    {
      nome: 'Teste Array',
      email: 'teste@teste.com',
      whatsapp: '31999999999',
      possui_site: true,
      investe_anuncios: true,
      objetivo: 'Aumentar vendas',
      faturamento: 'Até R$ 10.000',
      recomendacao_solucao: 'Site Institucional',
      motivos_diagnostico: ['Motivo 1', 'Motivo 2'],
      origem: 'teste_script'
    }
  ])
  
  if (error) {
    console.error('Error:', error)
  } else {
    console.log('Success:', data)
  }
}

run()
