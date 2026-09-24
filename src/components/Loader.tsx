import { useEffect, useRef, useState } from 'react'
import { motion, useMotionValue, useReducedMotion } from 'framer-motion'
import { HERO, MARCA } from '../lib/fotos'
import { EASE } from '../lib/site'

/** Demonstração: o loader roda em toda visita. Para rodar só 1x por sessão, troque para true. */
const UMA_VEZ_POR_SESSAO = false
const CHAVE = 'dbc:intro'

export function jaViuIntro() {
  if (!UMA_VEZ_POR_SESSAO) return false
  try {
    return sessionStorage.getItem(CHAVE) === '1'
  } catch {
    return false
  }
}

type Fase = 'contando' | 'logo' | 'saindo'
const recorte = ([topo, base]: readonly number[]) => `inset(${topo}% -2% ${100 - base}% -2%)`
const ABRE: [number, number, number, number] = [0.76, 0, 0.18, 1]

/**
 * 1. A Linha atravessa a tela enquanto o contador vai de 000 a 100 (preso ao carregamento real).
 * 2. A Linha recolhe até virar a régua do logo, e o DBC sobe de trás dela, camada por camada.
 * 3. Um reflexo corre pelo metal e a tela se abre ao meio, na altura da Linha, revelando o hero.
 */
export function Loader({ onRevelar, onFim }: { onRevelar: () => void; onFim: () => void }) {
  const reduzir = useReducedMotion()
  const [fase, setFase] = useState<Fase>('contando')
  const [numero, setNumero] = useState(0)
  const progresso = useMotionValue(0)
  const cb = useRef({ onRevelar, onFim })
  cb.current = { onRevelar, onFim }

  // 1. carrega o essencial e conta
  useEffect(() => {
    const desktop = window.matchMedia(HERO.mediaDesktop).matches
    const fontes = [MARCA.logo.src, desktop ? HERO.desktop.src : HERO.mobile.src]
    const real = { v: 0, n: 0 }
    fontes.forEach((src) => {
      const img = new Image()
      img.onload = img.onerror = () => {
        real.n += 1
        real.v = real.n / fontes.length
      }
      img.src = src
    })
    const limite = window.setTimeout(() => (real.v = 1), 4500)
    const minimo = reduzir ? 250 : 1500
    const t0 = performance.now()
    let atual = 0
    let raf = 0
    const passo = (t: number) => {
      const tempo = Math.min(1, (t - t0) / minimo)
      const alvo = Math.min(tempo, 0.12 + real.v * 0.88)
      atual += (alvo - atual) * 0.14
      if (tempo >= 1 && real.v >= 1 && atual > 0.994) atual = 1
      progresso.set(atual)
      setNumero(Math.round(atual * 100))
      if (atual >= 1) {
        setFase('logo')
        return
      }
      raf = requestAnimationFrame(passo)
    }
    raf = requestAnimationFrame(passo)
    return () => {
      cancelAnimationFrame(raf)
      window.clearTimeout(limite)
    }
  }, [progresso, reduzir])

  // 2 e 3. logo e abertura
  useEffect(() => {
    if (fase !== 'logo') return
    const t1 = window.setTimeout(
      () => {
        setFase('saindo')
        cb.current.onRevelar()
      },
      reduzir ? 350 : 2300,
    )
    return () => window.clearTimeout(t1)
  }, [fase, reduzir])

  useEffect(() => {
    if (fase !== 'saindo') return
    const t2 = window.setTimeout(
      () => {
        try {
          sessionStorage.setItem(CHAVE, '1')
        } catch {
          /* navegação privada */
        }
        cb.current.onFim()
      },
      reduzir ? 300 : 1150,
    )
    return () => window.clearTimeout(t2)
  }, [fase, reduzir])

  const c = MARCA.camadas
  const img = () => (
    <img src={MARCA.logo.src} alt="" draggable={false} className="absolute inset-0 h-full w-full select-none" />
  )
  const saindo = fase === 'saindo'
  const noLogo = fase !== 'contando'

  return (
    <div aria-hidden="true" className={`fixed inset-0 z-[100] ${saindo ? 'pointer-events-none' : ''}`}>
      {/* as duas metades que se abrem na altura da Linha */}
      <motion.div
        className="absolute inset-x-0 top-0 h-1/2 bg-preto"
        initial={false}
        animate={{ y: saindo ? '-100%' : '0%' }}
        transition={{ duration: reduzir ? 0.3 : 1.1, ease: ABRE }}
      />
      <motion.div
        className="absolute inset-x-0 bottom-0 h-1/2 bg-preto"
        initial={false}
        animate={{ y: saindo ? '100%' : '0%' }}
        transition={{ duration: reduzir ? 0.3 : 1.1, ease: ABRE }}
      />

      {/* a Linha de carregamento, atravessando a tela */}
      <motion.div
        className="absolute inset-x-0 top-1/2 h-px bg-branco shadow-[0_0_18px_2px_rgba(255,255,255,0.45)]"
        style={{ scaleX: progresso, transformOrigin: noLogo ? '50% 50%' : '0% 50%' }}
        animate={noLogo ? { scaleX: 0.42, opacity: 0 } : undefined}
        transition={{ duration: 0.9, ease: EASE }}
      />

      {/* contador */}
      <motion.div
        className="absolute inset-x-0 bottom-0 flex items-end justify-between px-[clamp(1.25rem,5vw,3.5rem)] pb-[max(1.5rem,env(safe-area-inset-bottom))]"
        animate={noLogo ? { opacity: 0, y: 24 } : { opacity: 1, y: 0 }}
        transition={{ duration: 0.7, ease: EASE }}
      >
        <span className="font-display text-[clamp(4.5rem,13vw,10rem)] leading-[0.8] tracking-[-0.03em] text-branco tabular-nums">
          {String(numero).padStart(3, '0')}
        </span>
        <span className="kicker mb-3 hidden sm:inline-flex">Empresa Simples de Crédito</span>
      </motion.div>

      {/* o logo, com a régua alinhada ao centro da tela (onde a Linha estava) */}
      <motion.div
        className="absolute left-1/2 top-1/2 aspect-[1438/683] w-[min(80vw,700px)]"
        style={{ translate: '-50% -56.5%' }}
        animate={saindo ? { opacity: 0, scale: 1.05 } : { opacity: 1, scale: 1 }}
        transition={{ duration: 0.45, ease: EASE }}
      >
        {noLogo &&
          (reduzir ? (
            img()
          ) : (
            <>
              <div className="absolute inset-0" style={{ clipPath: recorte(c.linha) }}>
                <motion.div
                  className="absolute inset-0"
                  initial={{ scaleX: 0.3, opacity: 0 }}
                  animate={{ scaleX: 1, opacity: 1 }}
                  transition={{ duration: 0.9, ease: EASE }}
                >
                  {img()}
                </motion.div>
              </div>
              <div className="absolute inset-0" style={{ clipPath: `inset(0% -2% ${100 - c.monograma[1]}% -2%)` }}>
                <motion.div
                  className="absolute inset-0"
                  initial={{ y: '52%' }}
                  animate={{ y: '0%' }}
                  transition={{ duration: 1.1, ease: EASE, delay: 0.3 }}
                >
                  {img()}
                </motion.div>
              </div>
              <div className="absolute inset-0" style={{ clipPath: recorte(c.nome) }}>
                <motion.div
                  className="absolute inset-0"
                  initial={{ opacity: 0, scaleX: 1.12, filter: 'blur(8px)' }}
                  animate={{ opacity: 1, scaleX: 1, filter: 'blur(0px)' }}
                  transition={{ duration: 0.9, ease: EASE, delay: 0.8 }}
                >
                  {img()}
                </motion.div>
              </div>
              <div className="absolute inset-0" style={{ clipPath: recorte(c.tagline) }}>
                <motion.div
                  className="absolute inset-0"
                  initial={{ opacity: 0, y: '3%', filter: 'blur(6px)' }}
                  animate={{ opacity: 1, y: '0%', filter: 'blur(0px)' }}
                  transition={{ duration: 0.85, ease: EASE, delay: 1.0 }}
                >
                  {img()}
                </motion.div>
              </div>
              <motion.div
                className="pointer-events-none absolute inset-0"
                style={{
                  WebkitMaskImage: `url(${MARCA.logo.src})`,
                  maskImage: `url(${MARCA.logo.src})`,
                  WebkitMaskSize: '100% 100%',
                  maskSize: '100% 100%',
                  backgroundImage:
                    'linear-gradient(105deg, rgba(255,255,255,0) 40%, rgba(255,255,255,0.95) 50%, rgba(255,255,255,0) 60%)',
                  backgroundSize: '260% 100%',
                  backgroundRepeat: 'no-repeat',
                  mixBlendMode: 'overlay',
                }}
                initial={{ backgroundPosition: '130% 0%' }}
                animate={{ backgroundPosition: '-30% 0%' }}
                transition={{ duration: 1.0, ease: [0.45, 0, 0.2, 1], delay: 1.3 }}
              />
            </>
          ))}
      </motion.div>

      {/* clarão na costura quando a tela abre */}
      <motion.div
        className="absolute inset-x-0 top-1/2 h-px bg-branco"
        initial={false}
        animate={saindo && !reduzir ? { opacity: [0, 1, 0], scaleY: [1, 6, 1] } : { opacity: 0 }}
        transition={{ duration: 0.8, ease: EASE }}
      />
    </div>
  )
}
