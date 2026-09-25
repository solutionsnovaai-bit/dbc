import { useEffect, useId, useRef } from 'react'
import {
  motion,
  useMotionTemplate,
  useMotionValueEvent,
  useReducedMotion,
  useScroll,
  useTransform,
  type MotionValue,
} from 'framer-motion'
import { COFRE, MARCA } from '../../lib/fotos'
import { Folha } from '../Section'
import { Palavras } from '../Palavras'

const FRASE = 'Com planejamento, responsabilidade e crédito na hora certa, o sonho começa a virar realidade.'

/**
 * O momento do site: a porta do cofre gira, os trincos recolhem, a luz abre do centro
 * e inunda a tela com a cor da folha seguinte.
 * Quando o vídeo do cofre (Kling) chegar, é só preencher COFRE em lib/fotos.ts.
 */
export function CreditoLiberado() {
  const trilho = useRef<HTMLDivElement>(null)
  const palco = useRef<HTMLDivElement>(null)
  const mostrador = useRef<HTMLDivElement>(null)
  const reduzir = useReducedMotion()
  const { scrollYProgress: p } = useScroll({ target: trilho, offset: ['start start', 'end end'] })

  const dialEscala = useTransform(p, [0.5, 0.86], [1, 1.16])
  const dialOpacidade = useTransform(p, [0.62, 0.9], [1, 0.25])
  const luzEscala = useTransform(p, [0.42, 0.82], [0.12, 2.6])
  const luzOpacidade = useTransform(p, [0.42, 0.6], [0, 1])
  const textoOpacidade = useTransform(p, [0.64, 0.74], [1, 0])
  const raio = useTransform(p, [0.72, 0.97], [0, 150])
  const inundacao = useMotionTemplate`circle(${raio}% at var(--cx, 50%) var(--cy, 50%))`

  // centro da inundação = centro do mostrador, onde quer que ele esteja no layout
  useEffect(() => {
    const el = palco.current
    const alvo = mostrador.current
    if (!el || !alvo) return
    const medir = () => {
      const a = el.getBoundingClientRect()
      const b = alvo.getBoundingClientRect()
      el.style.setProperty('--cx', `${(((b.left + b.width / 2 - a.left) / a.width) * 100).toFixed(2)}%`)
      el.style.setProperty('--cy', `${(((b.top + b.height / 2 - a.top) / a.height) * 100).toFixed(2)}%`)
    }
    medir()
    const ro = new ResizeObserver(medir)
    ro.observe(el)
    return () => ro.disconnect()
  }, [])

  return (
    <Folha id="credito-liberado" tom="preta" revelar={false} rotulo="Crédito liberado">
      <div ref={trilho} className={reduzir ? 'relative' : 'relative h-[270vh]'}>
        <div ref={palco} className={reduzir ? 'relative min-h-[100svh]' : 'sticky top-0 h-[100svh] overflow-hidden'}>
          <div className="absolute inset-0 flex flex-col items-center pt-[max(5.5rem,11svh)] lg:flex-row lg:items-center lg:justify-end lg:pr-[7vw] lg:pt-0">
            <div ref={mostrador} className="relative aspect-square w-[min(80vw,44svh)] lg:w-[min(44vw,74svh)]">
              <motion.div className="absolute inset-0 will-change-transform" style={reduzir ? undefined : { scale: dialEscala, opacity: dialOpacidade }}>
                {COFRE ? <VideoCofre progresso={p} /> : <Mostrador progresso={p} estatico={Boolean(reduzir)} />}
              </motion.div>
              {!reduzir && (
                <motion.div
                  aria-hidden="true"
                  className="pointer-events-none absolute inset-[-10%] rounded-full mix-blend-screen will-change-transform"
                  style={{
                    scale: luzEscala,
                    opacity: luzOpacidade,
                    background:
                      'radial-gradient(circle, rgba(255,255,255,1) 0%, rgba(245,246,248,0.95) 14%, rgba(233,235,238,0.35) 40%, rgba(233,235,238,0) 64%)',
                  }}
                />
              )}
            </div>
          </div>

          <motion.div
            className="absolute inset-x-0 bottom-0 pb-[max(3rem,env(safe-area-inset-bottom))] will-change-[opacity] lg:inset-y-0 lg:right-auto lg:flex lg:w-[52%] lg:items-center lg:pb-0"
            style={reduzir ? undefined : { opacity: textoOpacidade }}
          >
            <div className="px-[clamp(1.25rem,5vw,3.5rem)] lg:pl-[max(3.5rem,calc((100vw-1320px)/2+3.5rem))]">
              <h2 className="kicker mb-6 font-sans md:mb-8">Crédito liberado</h2>
              <Palavras
                texto={FRASE}
                progresso={p}
                de={0.05}
                ate={0.46}
                apagada={0.13}
                className="max-w-[19ch] font-display text-[clamp(2rem,3.7vw,3.5rem)] leading-[1.06] tracking-[-0.018em] text-branco"
              />
            </div>
          </motion.div>

          {!reduzir && <motion.div aria-hidden="true" className="absolute inset-0 bg-nevoa will-change-transform" style={{ clipPath: inundacao }} />}
        </div>
      </div>
    </Folha>
  )
}

function VideoCofre({ progresso }: { progresso: MotionValue<number> }) {
  const ref = useRef<HTMLVideoElement>(null)
  useMotionValueEvent(progresso, 'change', (v) => {
    const video = ref.current
    if (!video || !video.duration) return
    const alvo = Math.min(1, Math.max(0, (v - 0.04) / 0.6)) * (video.duration - 0.05)
    if (Math.abs(video.currentTime - alvo) > 0.015) video.currentTime = alvo
  })
  if (!COFRE) return null
  return (
    <video
      ref={ref}
      src={COFRE.mp4}
      poster={COFRE.poster}
      muted
      playsInline
      preload="auto"
      aria-hidden="true"
      className="absolute inset-0 h-full w-full object-contain"
    />
  )
}

/* ---------- a porta do cofre: segredo numerado que gira direita, esquerda, direita ---------- */
const C = 300

function Mostrador({ progresso, estatico }: { progresso: MotionValue<number>; estatico: boolean }) {
  const id = useId().replace(/:/g, '')
  const girarAnel = useTransform(progresso, [0, 1], [0, 40])
  // a combinação: gira para a direita, volta para a esquerda, fecha para a direita
  const girarSegredo = useTransform(progresso, [0.02, 0.16, 0.3, 0.42], [0, 250, -70, 36])
  const recolher = useTransform(progresso, [0.42, 0.56], [0, -26])
  const opacidadeTrinco = useTransform(progresso, [0.42, 0.56], [1, 0.3])

  const ponto = (r: number, graus: number) => {
    const a = ((graus - 90) * Math.PI) / 180
    return [C + r * Math.cos(a), C + r * Math.sin(a)] as const
  }

  const marcasAro = Array.from({ length: 120 }, (_, i) => {
    const longa = i % 10 === 0
    const [x1, y1] = ponto(longa ? 256 : 266, i * 3)
    const [x2, y2] = ponto(276, i * 3)
    return <line key={i} x1={x1} y1={y1} x2={x2} y2={y2} stroke={longa ? 'rgba(220,223,228,0.9)' : 'rgba(196,200,206,0.32)'} strokeWidth={longa ? 2 : 1} />
  })

  // escala do segredo: 100 divisões, número a cada 10
  const marcasSegredo = Array.from({ length: 100 }, (_, i) => {
    const dez = i % 10 === 0
    const cinco = i % 5 === 0
    const [x1, y1] = ponto(dez ? 150 : cinco ? 156 : 160, i * 3.6)
    const [x2, y2] = ponto(168, i * 3.6)
    return <line key={i} x1={x1} y1={y1} x2={x2} y2={y2} stroke={dez ? 'rgba(235,237,240,0.95)' : 'rgba(196,200,206,0.45)'} strokeWidth={dez ? 1.8 : 1} />
  })
  const numeros = Array.from({ length: 10 }, (_, i) => {
    const [x, y] = ponto(130, i * 36)
    return (
      <text
        key={i}
        x={x}
        y={y}
        transform={`rotate(${i * 36} ${x} ${y})`}
        textAnchor="middle"
        dominantBaseline="central"
        fontFamily="'Bodoni Moda Variable', 'Bodoni Moda', Georgia, serif"
        fontSize={19}
        fill="rgba(230,232,235,0.9)"
      >
        {i * 10}
      </text>
    )
  })
  // serrilhado da borda do botão
  const serrilhado = Array.from({ length: 90 }, (_, i) => {
    const [x1, y1] = ponto(170, i * 4)
    const [x2, y2] = ponto(178, i * 4)
    return <line key={i} x1={x1} y1={y1} x2={x2} y2={y2} stroke="rgba(0,0,0,0.55)" strokeWidth={1.2} />
  })

  const girar = (valor: MotionValue<number>) => (estatico ? undefined : { rotate: valor })
  const camada = 'absolute inset-0 h-full w-full'

  // Cada parte que gira é uma camada HTML própria: a rotação vira transform na GPU,
  // em vez de redesenhar centenas de traços do SVG a cada quadro de scroll.
  return (
    <div className="absolute inset-0" role="img" aria-label="Segredo de cofre com o monograma DBC">
      {/* 1. porta fixa e trincos (e os gradientes usados pelas outras camadas) */}
      <svg viewBox="0 0 600 600" className={camada} aria-hidden="true">
        <defs>
          <linearGradient id={`${id}-metal`} gradientUnits="userSpaceOnUse" x1="80" y1="60" x2="520" y2="540">
            <stop offset="0" stopColor="#7d828a" />
            <stop offset="0.35" stopColor="#f4f5f7" />
            <stop offset="0.55" stopColor="#9ea3ab" />
            <stop offset="0.75" stopColor="#ffffff" />
            <stop offset="1" stopColor="#6f747c" />
          </linearGradient>
          <radialGradient id={`${id}-porta`} cx="0.42" cy="0.38" r="0.7">
            <stop offset="0" stopColor="#15171a" />
            <stop offset="1" stopColor="#030304" />
          </radialGradient>
          <radialGradient id={`${id}-segredo`} cx="0.38" cy="0.32" r="0.8">
            <stop offset="0" stopColor="#3a3d43" />
            <stop offset="0.55" stopColor="#15171a" />
            <stop offset="1" stopColor="#060607" />
          </radialGradient>
          <radialGradient id={`${id}-placa`} cx="0.4" cy="0.35" r="0.75">
            <stop offset="0" stopColor="#2b2e34" />
            <stop offset="1" stopColor="#050506" />
          </radialGradient>
        </defs>
        <circle cx={C} cy={C} r={296} fill="none" stroke="rgba(255,255,255,0.08)" />
        <circle cx={C} cy={C} r={287} fill={`url(#${id}-porta)`} stroke={`url(#${id}-metal)`} strokeWidth={1.5} strokeOpacity={0.75} />
        <circle cx={C} cy={C} r={248} fill="none" stroke="rgba(255,255,255,0.07)" />
        {Array.from({ length: 12 }, (_, i) => (
          <g key={i} transform={`rotate(${i * 30 + 15} ${C} ${C})`}>
            <motion.rect
              x={C - 9}
              y={C - 238}
              width={18}
              height={40}
              rx={5}
              fill={`url(#${id}-metal)`}
              style={estatico ? undefined : { y: recolher, opacity: opacidadeTrinco }}
            />
          </g>
        ))}
      </svg>

      {/* 2. anel de marcas */}
      <motion.div className="absolute inset-0 will-change-transform" style={girar(girarAnel)}>
        <svg viewBox="0 0 600 600" className={camada} aria-hidden="true">
          {marcasAro}
        </svg>
      </motion.div>

      {/* 3. o segredo numerado */}
      <motion.div className="absolute inset-0 will-change-transform" style={girar(girarSegredo)}>
        <svg viewBox="0 0 600 600" className={camada} aria-hidden="true">
          <circle cx={C} cy={C} r={178} fill={`url(#${id}-metal)`} />
          {serrilhado}
          <circle cx={C} cy={C} r={169} fill={`url(#${id}-segredo)`} stroke="rgba(255,255,255,0.12)" />
          {marcasSegredo}
          {numeros}
          <circle cx={C} cy={C} r={104} fill="none" stroke="rgba(255,255,255,0.1)" />
        </svg>
      </motion.div>

      {/* 4. índice e placa central, fixos */}
      <svg viewBox="0 0 600 600" className={camada} aria-hidden="true">
        <path d={`M${C - 9} ${C - 196} L${C + 9} ${C - 196} L${C} ${C - 181} Z`} fill={`url(#${id}-metal)`} />
        <circle cx={C} cy={C} r={80} fill={`url(#${id}-placa)`} stroke={`url(#${id}-metal)`} strokeWidth={1.5} />
        <image href={MARCA.monograma.src} x={C - 56} y={C - 16.7} width={112} height={33.4} />
      </svg>
    </div>
  )
}
