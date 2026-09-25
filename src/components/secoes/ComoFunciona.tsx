import { useRef, useState, type ComponentType, type SVGProps } from 'react'
import { motion, useMotionValueEvent, useScroll, useTransform } from 'framer-motion'
import { EASE } from '../../lib/site'
import { PASSOS_FOTOS, type Foto } from '../../lib/fotos'
import { Conteiner, Folha, Titulo } from '../Section'
import { IconeCadeado, IconeCaneta, IconeCheck, IconeLupa } from '../icons'

type Passo = {
  n: string
  titulo: string
  texto: string
  Icone: ComponentType<SVGProps<SVGSVGElement> & { metal?: boolean }>
  foto: Foto | null
}

const PASSOS: Passo[] = [
  {
    n: '01',
    titulo: 'Análise',
    texto: 'Tudo começa com uma análise simples e transparente do cadastro da sua empresa.',
    Icone: IconeLupa,
    foto: PASSOS_FOTOS.analise,
  },
  {
    n: '02',
    titulo: 'Garantias',
    texto: 'Cada operação é avaliada conforme o perfil do cliente. Quando necessário, pedimos garantias, como avalistas.',
    Icone: IconeCadeado,
    foto: PASSOS_FOTOS.garantias,
  },
  {
    n: '03',
    titulo: 'Contrato',
    texto: 'Contrato assinado, cópia na sua mão e crédito direto na conta da sua empresa.',
    Icone: IconeCaneta,
    foto: PASSOS_FOTOS.contrato,
  },
]

const CHECKS = ['Cadastro aprovado', 'Avalistas apresentados', 'Contrato assinado']

export function ComoFunciona() {
  return (
    <Folha id="como-funciona" tom="escura" revelar={false} rotulo="Como funciona">
      <VersaoDesktop />
      <VersaoMobile />
    </Folha>
  )
}

/* ---------- desktop: a seção fica presa enquanto a Linha atravessa os passos ---------- */
function VersaoDesktop() {
  const trilho = useRef<HTMLDivElement>(null)
  const { scrollYProgress } = useScroll({ target: trilho, offset: ['start start', 'end end'] })
  const linha = useTransform(scrollYProgress, [0.05, 0.72], [0, 1])
  const [etapa, setEtapa] = useState(-1)
  const [fechou, setFechou] = useState(false)

  useMotionValueEvent(scrollYProgress, 'change', (v) => {
    setEtapa(v >= 0.51 ? 2 : v >= 0.28 ? 1 : v >= 0.06 ? 0 : -1)
    setFechou(v > 0.8)
  })

  return (
    <div ref={trilho} className="relative hidden h-[260vh] lg:block">
      <div className="sticky top-0 flex h-[100svh] flex-col justify-center pt-16">
        <Conteiner>
          <Titulo linhas={['Três passos.', 'Zero surpresa.']} />

          <div className="relative mt-[clamp(2.25rem,6vh,4.5rem)]">
            <div aria-hidden="true" className="absolute inset-x-0 top-[7px] h-px bg-white/12" />
            <motion.div aria-hidden="true" className="absolute inset-x-0 top-[7px] h-px origin-left bg-branco will-change-transform" style={{ scaleX: linha }} />
            <ol className="relative grid grid-cols-3 gap-10 xl:gap-16">
              {PASSOS.map((passo, i) => (
                <li key={passo.n} className="relative pt-9">
                  <Marcador aceso={etapa >= i} />
                  <div className={`transition-opacity duration-700 ${etapa >= i ? 'opacity-100' : 'opacity-40'}`}>
                    <Numero n={passo.n} aceso={etapa >= i} className="text-[clamp(3.6rem,6.4vw,6rem)] [@media(max-height:820px)]:text-[3.2rem]" />
                    <Visual passo={passo} aceso={etapa >= i} className="mt-5 h-[clamp(6.5rem,17vh,11rem)] [@media(max-height:820px)]:hidden" />
                    <h3 className="titulo-card mt-5">{passo.titulo}</h3>
                    <p className="texto-corpo mt-2.5 max-w-[26rem] text-prata">{passo.texto}</p>
                  </div>
                </li>
              ))}
            </ol>
          </div>

          <Checks visivel={fechou} className="mt-[clamp(1.75rem,5vh,3.5rem)]" />
        </Conteiner>
      </div>
    </div>
  )
}

/* ---------- mobile: a Linha desce na vertical ---------- */
function VersaoMobile() {
  const lista = useRef<HTMLOListElement>(null)
  const { scrollYProgress } = useScroll({ target: lista, offset: ['start 75%', 'end 55%'] })

  return (
    <div className="pb-36 pt-28 lg:hidden">
      <Conteiner>
        <Titulo linhas={['Três passos.', 'Zero surpresa.']} />
        <ol ref={lista} className="relative mt-14">
          <span aria-hidden="true" className="absolute bottom-6 left-[7px] top-2 w-px bg-white/12" />
          <motion.span
            aria-hidden="true"
            className="absolute bottom-6 left-[7px] top-2 w-px origin-top bg-branco will-change-transform"
            style={{ scaleY: scrollYProgress }}
          />
          {PASSOS.map((passo) => (
            <motion.li
              key={passo.n}
              className="relative pb-14 pl-11 last:pb-4"
              initial={{ opacity: 0.35 }}
              whileInView={{ opacity: 1 }}
              viewport={{ amount: 0.55, once: true }}
              transition={{ duration: 0.7, ease: EASE }}
            >
              <span aria-hidden="true" className="absolute left-0 top-2 h-[15px] w-[15px] rounded-full border border-branco bg-branco" />
              <Numero n={passo.n} aceso className="text-[3.4rem]" />
              <Visual passo={passo} aceso className="mt-4 h-40" />
              <h3 className="titulo-card mt-5">{passo.titulo}</h3>
              <p className="texto-corpo mt-2 text-prata">{passo.texto}</p>
            </motion.li>
          ))}
        </ol>
        <ChecksNaVisao className="mt-10" />
      </Conteiner>
    </div>
  )
}

/* ---------- peças ---------- */
function Marcador({ aceso }: { aceso: boolean }) {
  return (
    <span
      aria-hidden="true"
      className={`absolute left-0 top-0 h-[15px] w-[15px] rounded-full border transition-all duration-700 ease-lux ${
        aceso ? 'scale-100 border-branco bg-branco' : 'scale-75 border-white/30 bg-carbono'
      }`}
    />
  )
}

function Numero({ n, aceso, className = '' }: { n: string; aceso: boolean; className?: string }) {
  return (
    <div aria-hidden="true" className={`relative w-max font-display italic leading-none tracking-[-0.03em] ${className}`}>
      <span className="text-white/10">{n}</span>
      <span className={`texto-metal absolute inset-0 transition-opacity duration-700 ${aceso ? 'opacity-100' : 'opacity-0'}`}>{n}</span>
    </div>
  )
}

function Visual({ passo, aceso, className = '' }: { passo: Passo; aceso: boolean; className?: string }) {
  if (passo.foto) {
    return (
      <div className={`overflow-hidden rounded-[1.25rem] bg-preto ${className}`}>
        <img
          src={passo.foto.src}
          srcSet={passo.foto.srcSet}
          sizes="(min-width: 1024px) 30vw, 90vw"
          width={passo.foto.w}
          height={passo.foto.h}
          alt={passo.foto.alt}
          loading="lazy"
          decoding="async"
          className={`h-full w-full object-cover transition-transform duration-[1.4s] ease-lux ${aceso ? 'scale-100' : 'scale-110'}`}
        />
      </div>
    )
  }
  const { Icone } = passo
  return (
    <div
      aria-hidden="true"
      className={`relative grid place-items-center overflow-hidden rounded-[1.25rem] border border-white/[0.08] bg-grafite ${className}`}
    >
      <div className="absolute inset-0 bg-[radial-gradient(ellipse_60%_70%_at_50%_0%,rgba(255,255,255,0.1),rgba(255,255,255,0)_70%)]" />
      <Icone
        strokeWidth={1}
        metal
        className={`relative h-[46%] w-auto transition-transform duration-1000 ease-lux ${aceso ? 'scale-100' : 'scale-90'}`}
      />
    </div>
  )
}

function Checks({ visivel, className = '' }: { visivel: boolean; className?: string }) {
  return (
    <ul className={`flex flex-wrap gap-x-9 gap-y-3 ${className}`}>
      {CHECKS.map((c, i) => (
        <motion.li
          key={c}
          className="inline-flex items-center gap-3 text-[0.98rem] text-branco"
          initial={false}
          animate={visivel ? { opacity: 1, y: 0 } : { opacity: 0, y: 10 }}
          transition={{ duration: 0.6, ease: EASE, delay: visivel ? i * 0.14 : 0 }}
        >
          <CheckRedondo />
          {c}
        </motion.li>
      ))}
    </ul>
  )
}

function ChecksNaVisao({ className = '' }: { className?: string }) {
  return (
    <ul className={`flex flex-col gap-3 ${className}`}>
      {CHECKS.map((c, i) => (
        <motion.li
          key={c}
          className="inline-flex items-center gap-3 text-[0.98rem] text-branco"
          initial={{ opacity: 0, y: 10 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: '0px 0px -10% 0px' }}
          transition={{ duration: 0.6, ease: EASE, delay: i * 0.14 }}
        >
          <CheckRedondo />
          {c}
        </motion.li>
      ))}
    </ul>
  )
}

function CheckRedondo() {
  return (
    <span aria-hidden="true" className="grid h-6 w-6 shrink-0 place-items-center rounded-full bg-branco text-preto">
      <IconeCheck className="h-3.5 w-3.5" strokeWidth={2.2} />
    </span>
  )
}
