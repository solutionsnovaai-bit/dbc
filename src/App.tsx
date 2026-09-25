import { useEffect, useState } from 'react'
import { MotionConfig } from 'framer-motion'
import { useSmoothScroll, getLenis } from './hooks/useSmoothScroll'
import { useMagnetic } from './hooks/useMagnetic'
import { Loader, jaViuIntro } from './components/Loader'
import { Navbar } from './components/Navbar'
import { Hero } from './components/Hero'
import { FaixaGigante } from './components/FaixaGigante'
import { FaixaCruzada } from './components/FaixaCruzada'
import { Seo } from './components/Seo'
import { WhatsAppFab } from './components/WhatsAppFab'
import { DefsMetal } from './components/icons'
import { Manifesto } from './components/secoes/Manifesto'
import { Capitulos } from './components/secoes/Capitulos'
import { Conquistas } from './components/secoes/Conquistas'
import { ParaQuem } from './components/secoes/ParaQuem'
import { ComoFunciona } from './components/secoes/ComoFunciona'
import { CreditoLiberado } from './components/secoes/CreditoLiberado'
import { SimplesSeria } from './components/secoes/SimplesSeria'
import { Duvidas } from './components/secoes/Duvidas'
import { CtaFinal } from './components/secoes/CtaFinal'
import { Rodape } from './components/secoes/Rodape'

const FAIXA_ABERTURA = [
  'Crédito para empresas',
  'Análise rápida',
  'Capital próprio',
  'Sem tarifas',
  'Atendimento personalizado',
] as const

const FAIXA_PUBLICO = ['MEI', 'Microempresa', 'Empresa de pequeno porte', 'São Paulo e cidades vizinhas'] as const

const FAIXA_FRASES = ['Empresa boa não para por falta de crédito', 'Levou um não? Vamos analisar seu caso'] as const

const FAIXA_BORDOES = [
  'Quem investe cresce',
  'Crédito inteligente faz empresa crescer',
  'Aqui o dinheiro trabalha pelo seu negócio',
] as const

export default function App() {
  const [loaderAtivo, setLoaderAtivo] = useState(() => !jaViuIntro())
  const [pronto, setPronto] = useState(() => jaViuIntro())

  useSmoothScroll()
  useMagnetic()

  useEffect(() => {
    if ('scrollRestoration' in history) history.scrollRestoration = 'manual'
  }, [])

  // Enquanto o loader roda, nada rola
  useEffect(() => {
    const html = document.documentElement
    if (loaderAtivo) {
      window.scrollTo(0, 0)
      html.classList.add('travado')
      getLenis()?.stop()
    } else {
      html.classList.remove('travado')
      getLenis()?.start()
    }
  }, [loaderAtivo])

  return (
    <MotionConfig reducedMotion="user">
      <Seo />
      <DefsMetal />
      <div className="grao" aria-hidden="true" />

      {loaderAtivo && <Loader onRevelar={() => setPronto(true)} onFim={() => setLoaderAtivo(false)} />}

      <Navbar visivel={pronto} />

      <main>
        <Hero pronto={pronto} />
        <div className="bg-preto pb-[var(--radius-folha)]">
          <FaixaGigante itens={FAIXA_ABERTURA} />
        </div>
        <Manifesto />
        <Capitulos />
        <ComoFunciona />
        <ParaQuem />
        <FaixaCruzada a={FAIXA_BORDOES} b={FAIXA_FRASES} />
        <CreditoLiberado />
        <Conquistas />
        <div className="bg-preto pb-[var(--radius-folha)]">
          <FaixaGigante itens={FAIXA_PUBLICO} sentido={-1} velocidade={60} />
        </div>
        <SimplesSeria />
        <Duvidas />
        <CtaFinal />
      </main>

      <Rodape />
      <WhatsAppFab liberado={pronto} />
    </MotionConfig>
  )
}
