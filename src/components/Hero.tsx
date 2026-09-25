import { useEffect, useRef, useState, type RefObject } from 'react'
import { motion, useReducedMotion, useScroll, useTransform } from 'framer-motion'
import { HERO } from '../lib/fotos'
import { EASE, MENSAGENS, waLink } from '../lib/site'
import { useSceneActivity } from '../hooks/useSceneActivity'
import { rolarPara } from '../hooks/useSmoothScroll'
import { IconeWhatsApp } from './icons'

const LINHAS = ['Empresa boa', 'não para por', 'falta de crédito.']
const prioridadeAlta = { fetchpriority: 'high' } as Record<string, string>

/** Centro do passeio da luz (em % do quadro), igual ao do CSS. */
const CENTRO = { desktop: [71, 40], mobile: [51, 25] } as const
const AMPLITUDE = { desktop: [17, 7], mobile: [30, 5] } as const

export function Hero({ pronto }: { pronto: boolean }) {
  const secao = useRef<HTMLElement>(null)
  const quadro = useRef<HTMLDivElement>(null)
  const luz = useRef<HTMLDivElement>(null)
  const halo = useRef<HTMLDivElement>(null)
  const reduzir = useReducedMotion()
  const ativo = useSceneActivity(secao)
  const [passeioCss, setPasseioCss] = useState(false)

  const { scrollYProgress } = useScroll({ target: secao, offset: ['start start', 'end start'] })
  const midiaY = useTransform(scrollYProgress, [0, 1], ['0%', '16%'])
  const midiaEscala = useTransform(scrollYProgress, [0, 1], [1, 0.93])
  const textoY = useTransform(scrollYProgress, [0, 1], [0, -90])
  const textoOpacidade = useTransform(scrollYProgress, [0, 0.55], [1, 0])

  // No toque a luz passeia por animação CSS de transform: roda na GPU, sem JS a cada quadro.
  useEffect(() => {
    setPasseioCss(!reduzir && !window.matchMedia('(pointer: fine)').matches)
  }, [reduzir])

  // Com mouse, a luz segue o cursor. Só escreve transform (nada de repintar a imagem).
  useEffect(() => {
    const el = quadro.current
    if (!el || !ativo || reduzir || !window.matchMedia('(pointer: fine)').matches) return
    const composicaoDesktop = window.matchMedia(HERO.mediaDesktop)
    let w = el.offsetWidth
    let h = el.offsetHeight
    const ro = new ResizeObserver(() => {
      w = el.offsetWidth
      h = el.offsetHeight
    })
    ro.observe(el)

    let alvoX = Number.NaN
    let alvoY = Number.NaN
    let x = 0
    let y = 0
    let iniciou = false
    let ultimoMovimento = -Infinity
    let raf = 0
    const t0 = performance.now()

    const mover = (e: PointerEvent) => {
      const r = el.getBoundingClientRect()
      alvoX = ((e.clientX - r.left) / r.width) * 100
      alvoY = ((e.clientY - r.top) / r.height) * 100
      ultimoMovimento = performance.now()
    }

    const loop = (t: number) => {
      const chave = composicaoDesktop.matches ? 'desktop' : 'mobile'
      const [cx, cy] = CENTRO[chave]
      const [ax, ay] = AMPLITUDE[chave]
      const ocioso = Number.isNaN(alvoX) || t - ultimoMovimento > 2600
      const s = (t - t0) / 1000
      const px = ocioso ? cx + ax * Math.sin(s * 0.42) : alvoX
      const py = ocioso ? cy + ay * Math.sin(s * 0.67 + 1.1) : alvoY
      if (!iniciou) {
        x = px
        y = py
        iniciou = true
      }
      const k = ocioso ? 0.035 : 0.12
      x += (px - x) * k
      y += (py - y) * k
      const transformacao = `translate3d(${(((x - cx) / 100) * w).toFixed(1)}px, ${(((y - cy) / 100) * h).toFixed(1)}px, 0)`
      if (luz.current) luz.current.style.transform = transformacao
      if (halo.current) halo.current.style.transform = transformacao
      raf = requestAnimationFrame(loop)
    }

    window.addEventListener('pointermove', mover, { passive: true })
    raf = requestAnimationFrame(loop)
    return () => {
      cancelAnimationFrame(raf)
      ro.disconnect()
      window.removeEventListener('pointermove', mover)
    }
  }, [ativo, reduzir])

  const entrada = (atraso: number) => ({
    initial: reduzir ? false : { opacity: 0, y: 18 },
    animate: pronto ? { opacity: 1, y: 0 } : undefined,
    transition: { duration: 1, ease: EASE, delay: atraso },
  })

  const camadaLuz = (ref: RefObject<HTMLDivElement>, classe: string) => (
    <div ref={ref} className={classe} aria-hidden="true">
      <div className="luz-x">
        <div className="luz-y">
          <div className="luz-gradiente" />
        </div>
      </div>
    </div>
  )

  return (
    <section
      id="inicio"
      ref={secao}
      className="hero"
      aria-label="Início"
      data-ativo={ativo}
      data-passeio={passeioCss}
    >
      <motion.div className="hero-midia" style={reduzir ? undefined : { y: midiaY, scale: midiaEscala }}>
        <motion.div
          ref={quadro}
          className="hero-quadro"
          initial={reduzir ? false : { opacity: 0, scale: 1.05 }}
          animate={pronto ? { opacity: 1, scale: 1 } : undefined}
          transition={{ duration: 1.8, ease: EASE }}
        >
          <picture>
            <source media={HERO.mediaDesktop} srcSet={HERO.desktop.srcSet} sizes="100vw" type="image/webp" />
            <img
              className="hero-img"
              src={HERO.mobile.src}
              srcSet={HERO.mobile.srcSet}
              sizes="100vw"
              width={HERO.mobile.w}
              height={HERO.mobile.h}
              alt={HERO.alt}
              decoding="async"
              {...prioridadeAlta}
            />
          </picture>
          {camadaLuz(luz, 'hero-luz')}
          {camadaLuz(halo, 'hero-halo')}
        </motion.div>
      </motion.div>

      <div className="hero-veu" aria-hidden="true" />

      <motion.div className="hero-conteudo" style={reduzir ? undefined : { y: textoY, opacity: textoOpacidade }}>
        <h1 className="titulo-hero text-branco">
          {LINHAS.map((linha, i) => (
            <span key={linha} className="-mb-[0.07em] block overflow-hidden pb-[0.07em]">
              <motion.span
                className="block"
                initial={reduzir ? false : { y: '130%' }}
                animate={pronto ? { y: '0%' } : undefined}
                transition={{ duration: 1.15, ease: EASE, delay: 0.2 + i * 0.1 }}
              >
                {linha}
              </motion.span>
            </span>
          ))}
        </h1>

        <motion.p {...entrada(0.55)} className="texto-corpo mt-5 max-w-[34rem] text-prata md:mt-7">
          Crédito com capital próprio para MEI, micro e pequenas empresas de São Paulo e cidades vizinhas. Análise do seu
          negócio, contrato transparente e atendimento personalizado.
        </motion.p>

        <motion.div {...entrada(0.7)} className="mt-7 flex flex-wrap items-center gap-3 md:mt-9">
          <a
            href={waLink(MENSAGENS.hero)}
            target="_blank"
            rel="noopener noreferrer"
            data-magnetic="0.25"
            className="btn btn-claro btn-grande w-full sm:w-auto"
          >
            <IconeWhatsApp />
            <span>Pedir análise no WhatsApp</span>
          </a>
          <button
            type="button"
            data-magnetic="0.25"
            onClick={() => rolarPara('como-funciona')}
            className="btn btn-vazado btn-grande hidden sm:inline-flex"
          >
            Como funciona
          </button>
        </motion.div>

        <motion.p {...entrada(0.85)} className="texto-miudo mt-5 text-aco">
          Crédito sujeito à análise. Exclusivo para empresas com CNPJ.
        </motion.p>
      </motion.div>
    </section>
  )
}
