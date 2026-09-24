import { useRef } from 'react'
import { motion, useInView, useReducedMotion, useScroll } from 'framer-motion'
import { EASE } from '../../lib/site'
import { Conteiner, Folha, Linha } from '../Section'
import { Palavras } from '../Palavras'

const TEXTO =
  'Aqui a análise é da sua empresa, não de uma planilha. A gente olha o seu movimento, a sua história e para onde você quer ir. Não prometemos milagre. Prometemos análise séria, feita por quem conhece a sua cidade.'

export function Manifesto() {
  const paragrafo = useRef<HTMLDivElement>(null)
  const reduzir = useReducedMotion()
  const { scrollYProgress } = useScroll({ target: paragrafo, offset: ['start 0.85', 'end 0.5'] })
  const titulo = useRef<HTMLHeadingElement>(null)
  const visto = useInView(titulo, { once: true, margin: '0px 0px -12% 0px' })

  const linha = (texto: string, classe: string, atraso: number) => (
    <span className="-mb-[0.08em] block overflow-hidden pb-[0.08em]">
      <motion.span
        className={`block ${classe}`}
        initial={reduzir ? false : { y: '130%' }}
        animate={visto || reduzir ? { y: '0%' } : undefined}
        transition={{ duration: 1.1, ease: EASE, delay: atraso }}
      >
        {texto}
      </motion.span>
    </span>
  )

  return (
    <Folha id="nosso-jeito" tom="escura" rotulo="Nosso jeito">
      <Conteiner className="pb-36 pt-28 md:pb-48 md:pt-40">
        <div className="grid gap-16 lg:grid-cols-12 lg:gap-10">
          <h2 ref={titulo} className="titulo-secao lg:col-span-7">
            {linha('Levou um não?', 'text-aco', 0)}
            <Linha className="my-6 w-24 text-white/25 md:my-9 md:w-32" atraso={0.25} />
            {linha('Vamos analisar', 'text-branco', 0.15)}
            {linha('seu caso.', 'text-branco', 0.24)}
          </h2>

          <div ref={paragrafo} className="lg:col-span-5 lg:col-start-8 lg:self-end">
            <Palavras
              texto={TEXTO}
              progresso={scrollYProgress}
              apagada={0.16}
              className="text-[clamp(1.3rem,2.1vw,1.75rem)] leading-[1.42] tracking-[-0.012em] text-branco"
            />
          </div>
        </div>
      </Conteiner>
    </Folha>
  )
}
