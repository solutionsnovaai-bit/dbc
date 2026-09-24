import { useRef, type CSSProperties } from 'react'
import { motion, useInView, useReducedMotion, useScroll, useTransform } from 'framer-motion'
import { EASE, SITE, VIZINHAS } from '../../lib/site'
import { MARCA, MEDALHA } from '../../lib/fotos'
import { Conteiner, Folha, Linha, Titulo } from '../Section'
import { IconeDocumento, IconeEscudo, IconePino, IconeTransferencia } from '../icons'

const listaVizinhas = `${VIZINHAS.slice(0, -1).join(', ')} e ${VIZINHAS[VIZINHAS.length - 1]}`

const GARANTIAS = [
  {
    Icone: IconeTransferencia,
    titulo: 'Conta PJ para conta PJ',
    texto: 'O dinheiro sai da conta da DBC direto para a conta da sua empresa. Sempre.',
  },
  {
    Icone: IconeDocumento,
    titulo: 'Contrato na sua mão',
    texto: 'Toda operação tem contrato próprio, com uma cópia entregue a você.',
  },
  {
    Icone: IconeEscudo,
    titulo: 'Operação registrada',
    texto: 'Cada operação é registrada em entidade registradora autorizada, como a lei exige.',
  },
]

export function SimplesSeria() {
  return (
    <Folha id="seguranca" tom="escura" rotulo="Segurança">
      <Conteiner className="pb-40 pt-28 md:pb-52 md:pt-40">
        <div className="grid gap-8 lg:grid-cols-12 lg:items-end">
          <Titulo linhas={['Simples no nome.', 'Séria na lei.']} className="titulo-secao lg:col-span-7" />
          <p className="texto-corpo max-w-[31rem] text-prata lg:col-span-5 lg:col-start-8">
            A Empresa Simples de Crédito é regulamentada pela {SITE.lei}. Na prática, isso protege quem pega crédito.
          </p>
        </div>

        <div className="mt-14 grid gap-4 md:mt-20 lg:grid-cols-12 lg:gap-5">
          <CartaoTarifa />
          <CartaoCapital />
        </div>

        <ul className="mt-16 grid gap-12 md:mt-24 md:grid-cols-3 md:gap-8 lg:gap-12">
          {GARANTIAS.map(({ Icone, titulo, texto }, i) => (
            <li key={titulo}>
              <Linha className="text-white/15" atraso={i * 0.12} />
              <Icone metal className="mt-7 h-7 w-7" strokeWidth={1.3} />
              <h3 className="titulo-card mt-5">{titulo}</h3>
              <p className="texto-corpo mt-2.5 max-w-[24rem] text-prata">{texto}</p>
            </li>
          ))}
        </ul>

        <div className="mt-16 grid gap-6 rounded-[2rem] border border-white/[0.08] bg-grafite p-7 md:mt-20 md:grid-cols-[auto_1fr] md:items-center md:gap-10 md:p-10">
          <span className="grid h-14 w-14 place-items-center rounded-full bg-branco text-preto">
            <IconePino className="h-6 w-6" strokeWidth={1.4} />
          </span>
          <div>
            <h3 className="titulo-card">Crédito local</h3>
            <p className="texto-corpo mt-2 max-w-[62ch] text-prata">
              Atendemos empresas de São Paulo e das cidades que fazem divisa com a capital, como {listaVizinhas}.
            </p>
          </div>
        </div>
      </Conteiner>
    </Folha>
  )
}

function CartaoTarifa() {
  return (
    <div className="relative flex min-h-[26rem] flex-col justify-between overflow-hidden rounded-[2rem] border border-white/[0.08] bg-preto p-7 text-branco md:min-h-[30rem] md:p-11 lg:col-span-7">
      <div
        aria-hidden="true"
        className="absolute inset-0 bg-[radial-gradient(ellipse_60%_60%_at_85%_0%,rgba(255,255,255,0.09),rgba(255,255,255,0)_70%)]"
      />
      <p className="texto-miudo relative text-aco">Tarifa</p>
      <div className="relative">
        <Odometro />
        <span aria-hidden="true" className="mt-6 block h-px w-full bg-linear-to-r from-white/40 via-white/10 to-transparent" />
        <p className="texto-corpo mt-6 max-w-[34rem] text-prata">
          Por lei, a Empresa Simples de Crédito só pode cobrar juros. Nada de tarifa de cadastro, de abertura ou de manutenção.
        </p>
      </div>
    </div>
  )
}

/** "R$ 0,00": cada dígito gira como um contador mecânico e para no zero. */
function Odometro() {
  const ref = useRef<HTMLDivElement>(null)
  const visto = useInView(ref, { once: true, margin: '0px 0px -20% 0px' })
  const reduzir = useReducedMotion()
  const caracteres = '0,00'.split('')
  let coluna = 0

  return (
    <div
      ref={ref}
      role="img"
      aria-label="Tarifa: zero reais"
      className="flex items-start font-display leading-none tracking-[-0.02em] text-[clamp(5.2rem,13vw,10.5rem)]"
    >
      <span className="texto-metal mr-[0.08em] mt-[0.12em] text-[0.34em] tracking-normal">R$</span>
      {caracteres.map((c, i) => {
        if (c < '0' || c > '9') {
          return (
            <span key={i} className="texto-metal w-[0.28em] text-center">
              {c}
            </span>
          )
        }
        const indice = coluna++
        const inicio = (indice * 3 + 4) % 10
        const faixa = [
          ...Array.from({ length: 10 - inicio }, (_, k) => inicio + k),
          ...Array.from({ length: 10 }, (_, k) => k),
          Number(c),
        ]
        const deslocamento = `-${((faixa.length - 1) / faixa.length) * 100}%`
        return (
          <span key={i} className="relative inline-block h-[1em] w-[0.62em] overflow-hidden">
            <motion.span
              className="absolute inset-x-0 top-0 flex flex-col items-center"
              initial={reduzir ? false : { y: '0%' }}
              animate={visto || reduzir ? { y: deslocamento } : undefined}
              style={reduzir ? { y: deslocamento } : undefined}
              transition={{ duration: 1.9 + indice * 0.35, ease: [0.16, 1, 0.3, 1], delay: 0.15 }}
            >
              {faixa.map((d, k) => (
                <span key={k} className="texto-metal block h-[1em]">
                  {d}
                </span>
              ))}
            </motion.span>
          </span>
        )
      })}
    </div>
  )
}

function CartaoCapital() {
  const ref = useRef<HTMLDivElement>(null)
  const reduzir = useReducedMotion()
  const { scrollYProgress } = useScroll({ target: ref, offset: ['start end', 'end start'] })
  const giro = useTransform(scrollYProgress, [0, 1], [-32, 32])
  const flutua = useTransform(scrollYProgress, [0, 1], [18, -18])

  return (
    <div
      ref={ref}
      className="relative flex min-h-[26rem] flex-col justify-between overflow-hidden rounded-[2rem] border border-white/[0.08] bg-grafite p-7 md:min-h-[30rem] md:p-11 lg:col-span-5"
    >
      <div className="grid flex-1 place-items-center py-6 [perspective:900px]">
        {MEDALHA ? (
          <img
            src={MEDALHA.src}
            srcSet={MEDALHA.srcSet}
            sizes="(min-width: 1024px) 26vw, 70vw"
            width={MEDALHA.w}
            height={MEDALHA.h}
            alt={MEDALHA.alt}
            loading="lazy"
            decoding="async"
            className="w-[min(70%,17rem)]"
          />
        ) : (
          <motion.div
            aria-hidden="true"
            className="moeda w-[min(62%,15rem)]"
            style={reduzir ? undefined : { rotateY: giro, y: flutua }}
            initial={reduzir ? false : { scale: 0.9, opacity: 0 }}
            whileInView={{ scale: 1, opacity: 1 }}
            viewport={{ once: true }}
            transition={{ duration: 1.2, ease: EASE }}
          >
            <div className="moeda-borda" />
            <div className="moeda-campo" />
            <div className="moeda-aro" />
            <div className="moeda-relevo" style={{ '--mascara': `url(${MARCA.mascaraMonograma.src})` } as CSSProperties} />
          </motion.div>
        )}
      </div>
      <div>
        <h3 className="titulo-card">Capital próprio</h3>
        <p className="texto-corpo mt-2.5 max-w-[26rem] text-prata">
          Todo crédito sai do capital da própria DBC. Sem dinheiro de terceiros no meio.
        </p>
      </div>
    </div>
  )
}
