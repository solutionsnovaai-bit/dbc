import { useRef, type ElementType, type ReactNode } from 'react'
import { motion, useInView, useReducedMotion, useScroll, useTransform } from 'framer-motion'
import { EASE } from '../lib/site'

type Tom = 'clara' | 'escura' | 'preta'

/**
 * Folha arredondada que sobe por cima da anterior.
 * Ao entrar na tela ela cresce de 96% para 100%, como um cartão sendo puxado para cima.
 */
export function Folha({
  id,
  tom,
  children,
  className = '',
  revelar = true,
  rotulo,
}: {
  id?: string
  tom: Tom
  children: ReactNode
  className?: string
  revelar?: boolean
  rotulo?: string
}) {
  const ref = useRef<HTMLElement>(null)
  const reduzir = useReducedMotion()
  const { scrollYProgress } = useScroll({ target: ref, offset: ['start end', 'start 35%'] })
  const escala = useTransform(scrollYProgress, [0, 1], [0.955, 1])
  const y = useTransform(scrollYProgress, [0, 1], [48, 0])
  const animar = revelar && !reduzir

  return (
    <motion.section
      ref={ref}
      id={id}
      aria-label={rotulo}
      className={`folha folha-${tom} ${className}`}
      style={animar ? { scale: escala, y } : undefined}
    >
      {children}
    </motion.section>
  )
}

export function Conteiner({ children, className = '' }: { children: ReactNode; className?: string }) {
  return <div className={`conteiner ${className}`}>{children}</div>
}

export function Kicker({ children, className = '' }: { children: ReactNode; className?: string }) {
  return <p className={`kicker ${className}`}>{children}</p>
}

/**
 * Título com revelação por linha (cada linha sobe de dentro de uma máscara).
 * Passe as linhas já quebradas para controlar o desenho do título.
 */
export function Titulo({
  linhas,
  as: Tag = 'h2',
  className = 'titulo-secao',
  atraso = 0,
  classeLinha = [],
}: {
  linhas: string[]
  as?: ElementType
  className?: string
  atraso?: number
  classeLinha?: string[]
}) {
  const reduzir = useReducedMotion()
  // O IntersectionObserver observa o wrapper da linha: o span animado começa escondido pela máscara
  // e, recortado, nunca seria considerado visível.
  const gatilho = useRef<HTMLSpanElement>(null)
  const visto = useInView(gatilho, { once: true, margin: '0px 0px -12% 0px' })
  return (
    <Tag className={className}>
      {linhas.map((linha, i) => (
        <span key={i} ref={i === 0 ? gatilho : undefined} className="-mb-[0.08em] block overflow-hidden pb-[0.08em]">
          <motion.span
            className={`block ${classeLinha[i] ?? ''}`}
            initial={reduzir ? false : { y: '130%' }}
            animate={visto || reduzir ? { y: '0%' } : undefined}
            transition={{ duration: 1.05, ease: EASE, delay: atraso + i * 0.09 }}
          >
            {linha}
          </motion.span>
        </span>
      ))}
    </Tag>
  )
}

/** A Linha do logo: um fio que se desenha quando entra na tela. */
export function Linha({
  className = '',
  origem = 'left',
  atraso = 0,
}: {
  className?: string
  origem?: 'left' | 'center' | 'right'
  atraso?: number
}) {
  const reduzir = useReducedMotion()
  return (
    <motion.span
      aria-hidden="true"
      className={`block h-px bg-current ${className}`}
      style={{ transformOrigin: origem }}
      initial={reduzir ? false : { scaleX: 0 }}
      whileInView={{ scaleX: 1 }}
      viewport={{ once: true, margin: '0px 0px -10% 0px' }}
      transition={{ duration: 1.3, ease: EASE, delay: atraso }}
    />
  )
}
