import { useRef, useState } from 'react'
import {
  motion,
  useMotionTemplate,
  useMotionValueEvent,
  useReducedMotion,
  useScroll,
  useTransform,
  type MotionValue,
} from 'framer-motion'
import { CAPITULOS, type Capitulo } from '../../lib/fotos'
import { EASE } from '../../lib/site'
import { Conteiner, Folha, Titulo } from '../Section'

const N = CAPITULOS.length

/** Onde cada capítulo começa a abrir (o primeiro abre logo que a cena trava). */
const inicio = (i: number) => i / N + (i === 0 ? 0 : -0.06)
/** A partir de que ponto o texto do capítulo i já está na tela. */
const textoEntra = (i: number) => inicio(i) + 0.07

const tamanhoImagem = '(min-width: 1024px) 50vw, 100vw'

/**
 * Stills que travam no scroll. Cada imagem nasce da Linha do logo: um fio de luz corta a tela
 * na horizontal e se abre na foto, que vai assentando devagar. O texto troca de baixo para cima
 * (ou de cima para baixo, se a pessoa voltar).
 */
export function Capitulos() {
  const reduzir = useReducedMotion()
  return reduzir ? <CapitulosEstaticos /> : <CapitulosFixos />
}

function CapitulosFixos() {
  const trilho = useRef<HTMLDivElement>(null)
  const { scrollYProgress: p } = useScroll({ target: trilho, offset: ['start start', 'end end'] })
  const [ativo, setAtivo] = useState(-1)

  useMotionValueEvent(p, 'change', (v) => {
    let atual = -1
    for (let i = 0; i < N; i++) if (v >= textoEntra(i)) atual = i
    setAtivo(atual)
  })

  return (
    <Folha id="o-jeito-dbc" tom="preta" revelar={false} rotulo="O jeito DBC">
      <div ref={trilho} className="relative" style={{ height: `${N * 100 + 80}vh` }}>
        <div className="sticky top-0 h-[100svh] overflow-hidden">
          {/* imagens: topo no mobile, metade direita no desktop */}
          <div className="absolute inset-x-0 top-0 h-[58svh] lg:inset-y-0 lg:left-1/2 lg:right-0 lg:h-auto">
            {CAPITULOS.map((c, i) => (
              <Camada key={c.id} capitulo={c} i={i} p={p} />
            ))}
            <div
              aria-hidden="true"
              className="pointer-events-none absolute inset-x-0 bottom-0 z-20 h-28 bg-linear-to-t from-preto to-transparent lg:inset-y-0 lg:left-0 lg:right-auto lg:h-auto lg:w-40 lg:bg-linear-to-r"
            />
          </div>

          {/* texto: embaixo no mobile, metade esquerda no desktop */}
          <div className="absolute inset-x-0 bottom-0 top-[58svh] flex flex-col px-[clamp(1.25rem,5vw,3.5rem)] pt-5 lg:inset-y-0 lg:left-0 lg:right-1/2 lg:top-0 lg:justify-center lg:pl-[max(3.5rem,calc((100vw-1320px)/2+3.5rem))] lg:pr-14 lg:pt-0">
            <Contador ativo={ativo} p={p} />
            <div className="relative mt-5 h-[13.5rem] sm:h-[15rem] lg:mt-12 lg:h-[21rem]">
              {CAPITULOS.map((c, i) => (
                <TextoCapitulo key={c.id} capitulo={c} estado={ativo === i ? 'dentro' : ativo > i ? 'passou' : 'antes'} />
              ))}
            </div>
          </div>
        </div>
      </div>
    </Folha>
  )
}

function Camada({ capitulo, i, p }: { capitulo: Capitulo; i: number; p: MotionValue<number> }) {
  const l0 = inicio(i)
  const l1 = l0 + 0.035
  const aberto = l1 + 0.075

  // 1. o fio de luz se desenha do centro para as bordas
  const fio = useTransform(p, [l0, l1], [0, 1])
  const fioOpacidade = useTransform(p, [l0, l0 + 0.005, aberto - 0.015, aberto], [0, 1, 1, 0])
  // 2. o fio se abre na foto
  const meia = useTransform(p, [l1, aberto], [50, 0])
  const recorte = useMotionTemplate`inset(${meia}% 0% ${meia}% 0%)`
  // 3. a foto assenta devagar enquanto o capítulo dura
  const escala = useTransform(p, [l0, Math.min(1, (i + 1) / N + 0.04)], [1.18, 1])
  // 4. escurece quando o próximo capítulo abre por cima
  const proximo = i < N - 1 ? inicio(i + 1) : 2
  const sombra = useTransform(p, [proximo, proximo + 0.11], [0, 0.65])

  return (
    <div className="absolute inset-0" style={{ zIndex: i + 1 }}>
      <motion.div className="absolute inset-0 overflow-hidden" style={{ clipPath: recorte }}>
        <motion.img
          src={capitulo.foto.src}
          srcSet={capitulo.foto.srcSet}
          sizes={tamanhoImagem}
          width={capitulo.foto.w}
          height={capitulo.foto.h}
          alt={capitulo.foto.alt}
          loading="lazy"
          decoding="async"
          draggable={false}
          className="h-full w-full select-none object-cover"
          style={{ scale: escala, objectPosition: capitulo.foco }}
        />
        <motion.div aria-hidden="true" className="absolute inset-0 bg-preto" style={{ opacity: sombra }} />
      </motion.div>
      <motion.span
        aria-hidden="true"
        className="absolute inset-x-0 top-1/2 h-px bg-branco shadow-[0_0_16px_2px_rgba(255,255,255,0.6)]"
        style={{ scaleX: fio, opacity: fioOpacidade }}
      />
    </div>
  )
}

function Contador({ ativo, p }: { ativo: number; p: MotionValue<number> }) {
  const atual = String(Math.max(ativo, 0) + 1).padStart(2, '0')
  return (
    <div className="flex items-center gap-5" aria-hidden="true">
      <span className="font-display text-[1.05rem] tabular-nums text-branco">
        {atual}
        <span className="text-aco"> / {String(N).padStart(2, '0')}</span>
      </span>
      <div className="flex max-w-[13rem] flex-1 gap-2">
        {CAPITULOS.map((c, i) => (
          <Segmento key={c.id} i={i} p={p} />
        ))}
      </div>
    </div>
  )
}

function Segmento({ i, p }: { i: number; p: MotionValue<number> }) {
  const fim = i < N - 1 ? textoEntra(i + 1) : 1
  const cheio = useTransform(p, [textoEntra(i), fim], [0, 1])
  return (
    <span className="relative h-px flex-1 overflow-hidden bg-white/15">
      <motion.span className="absolute inset-0 origin-left bg-branco" style={{ scaleX: cheio }} />
    </span>
  )
}

const linhaVariantes = {
  antes: { y: '130%', transition: { duration: 0.5, ease: EASE } },
  dentro: (k: number) => ({ y: '0%', transition: { duration: 0.95, ease: EASE, delay: 0.06 + k * 0.08 } }),
  passou: { y: '-130%', transition: { duration: 0.55, ease: EASE } },
}

const apoioVariantes = {
  antes: { opacity: 0, y: 16, transition: { duration: 0.35 } },
  dentro: { opacity: 1, y: 0, transition: { duration: 0.8, ease: EASE, delay: 0.3 } },
  passou: { opacity: 0, y: -16, transition: { duration: 0.35 } },
}

function TextoCapitulo({ capitulo, estado }: { capitulo: Capitulo; estado: 'antes' | 'dentro' | 'passou' }) {
  const visivel = estado === 'dentro'
  return (
    <div className="absolute inset-x-0 top-0" aria-hidden={!visivel}>
      <motion.p className="kicker" variants={apoioVariantes} initial={false} animate={estado}>
        {capitulo.kicker}
      </motion.p>
      <h3 className="mt-4 font-display text-[clamp(2.15rem,4.6vw,4.6rem)] leading-[1] tracking-[-0.022em] text-branco lg:mt-6">
        {capitulo.titulo.map((linha, k) => (
          <span key={k} className="-mb-[0.08em] block overflow-hidden pb-[0.08em]">
            <motion.span className="block" variants={linhaVariantes} custom={k} initial={false} animate={estado}>
              {linha}
            </motion.span>
          </span>
        ))}
      </h3>
      <motion.p
        className="texto-corpo mt-4 max-w-[30rem] text-prata lg:mt-7"
        variants={apoioVariantes}
        initial={false}
        animate={estado}
      >
        {capitulo.texto}
      </motion.p>
    </div>
  )
}

/* ---------- com movimento reduzido: os capítulos em sequência, sem travar ---------- */
function CapitulosEstaticos() {
  return (
    <Folha id="o-jeito-dbc" tom="preta" revelar={false} rotulo="O jeito DBC">
      <Conteiner className="pb-36 pt-28">
        <Titulo linhas={['O jeito DBC']} />
        <div className="mt-16 flex flex-col gap-20">
          {CAPITULOS.map((c) => (
            <article key={c.id} className="grid items-center gap-8 lg:grid-cols-2 lg:gap-14">
              <img
                src={c.foto.src}
                srcSet={c.foto.srcSet}
                sizes="(min-width: 1024px) 50vw, 100vw"
                width={c.foto.w}
                height={c.foto.h}
                alt={c.foto.alt}
                loading="lazy"
                className="aspect-[4/5] w-full rounded-[1.75rem] object-cover"
                style={{ objectPosition: c.foco }}
              />
              <div>
                <p className="kicker">{c.kicker}</p>
                <h3 className="mt-5 font-display text-[clamp(2.15rem,4.6vw,4.2rem)] leading-[1] tracking-[-0.022em] text-branco">
                  {c.titulo.join(' ')}
                </h3>
                <p className="texto-corpo mt-5 max-w-[30rem] text-prata">{c.texto}</p>
              </div>
            </article>
          ))}
        </div>
      </Conteiner>
    </Folha>
  )
}
