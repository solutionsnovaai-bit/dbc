import { useState } from 'react'
import { useMotionValueEvent, useReducedMotion, type MotionValue } from 'framer-motion'

/**
 * Texto que acende palavra por palavra conforme o scroll (progresso de 0 a 1; de/ate = trecho em que
 * a frase inteira se completa). Cada palavra acende com transição CSS quando a rolagem passa por ela:
 * o React só atualiza quando muda a quantidade de palavras acesas, não a cada quadro.
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
  const total = palavras.length
  const contar = (v: number) => Math.max(0, Math.min(total, Math.floor(((v - de) / (ate - de)) * total + 0.5)))
  const [acesas, setAcesas] = useState(() => contar(progresso.get()))

  useMotionValueEvent(progresso, 'change', (v) => {
    const n = contar(v)
    setAcesas((atual) => (atual === n ? atual : n))
  })

  return (
    <Tag className={className}>
      {palavras.map((palavra, i) => (
        <span
          key={i}
          className="transition-opacity duration-500 ease-out"
          style={{ opacity: reduzir || i < acesas ? 1 : apagada }}
        >
          {palavra}{' '}
        </span>
      ))}
    </Tag>
  )
}
