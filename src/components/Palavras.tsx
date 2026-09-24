import { motion, useReducedMotion, useTransform, type MotionValue } from 'framer-motion'

/**
 * Texto que acende palavra por palavra de acordo com um progresso de scroll (0 a 1).
 * de/ate definem em que trecho do progresso a frase inteira se completa.
 */
export function Palavras({
  texto,
  progresso,
  de = 0,
  ate = 1,
  apagada = 0.14,
  className = '',
  as: Tag = 'p',
}: {
  texto: string
  progresso: MotionValue<number>
  de?: number
  ate?: number
  apagada?: number
  className?: string
  as?: 'p' | 'h2' | 'h3' | 'span'
}) {
  const reduzir = useReducedMotion()
  const palavras = texto.split(' ')
  const passo = (ate - de) / palavras.length

  return (
    <Tag className={className}>
      {palavras.map((palavra, i) => (
        <Palavra
          key={i}
          progresso={progresso}
          inicio={de + passo * i}
          fim={de + passo * (i + 1)}
          apagada={apagada}
          estatica={Boolean(reduzir)}
        >
          {palavra}
        </Palavra>
      ))}
    </Tag>
  )
}

function Palavra({
  children,
  progresso,
  inicio,
  fim,
  apagada,
  estatica,
}: {
  children: string
  progresso: MotionValue<number>
  inicio: number
  fim: number
  apagada: number
  estatica: boolean
}) {
  const opacidade = useTransform(progresso, [inicio, fim], [apagada, 1])
  return (
    <>
      <motion.span style={estatica ? undefined : { opacity: opacidade }}>{children}</motion.span>{' '}
    </>
  )
}
