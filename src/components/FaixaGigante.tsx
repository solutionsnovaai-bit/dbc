import { Fragment, useEffect, useRef } from 'react'
import { useAnimationFrame, useReducedMotion, useScroll, useSpring, useTransform, useVelocity } from 'framer-motion'
import { MARCA } from '../lib/fotos'
import { useSceneActivity } from '../hooks/useSceneActivity'

/**
 * Faixa gigante de palavras. Anda sozinha, acelera com a velocidade do scroll
 * e inverte o sentido quando a pessoa rola para cima. Palavras alternam cheio e contorno.
 */
export function FaixaGigante({ itens, sentido = 1, velocidade = 70 }: { itens: readonly string[]; sentido?: 1 | -1; velocidade?: number }) {
  const area = useRef<HTMLDivElement>(null)
  const trilho = useRef<HTMLDivElement>(null)
  const grupo = useRef<HTMLDivElement>(null)
  const ativo = useSceneActivity(area, '0px')
  const reduzir = useReducedMotion()
  const { scrollY } = useScroll()
  const vel = useVelocity(scrollY)
  const velSuave = useSpring(vel, { damping: 50, stiffness: 400 })
  const fator = useTransform(velSuave, [0, 1000], [0, 5], { clamp: false })
  const x = useRef(0)
  const largura = useRef(0)
  const direcao = useRef<number>(sentido)

  useEffect(() => {
    const el = grupo.current
    if (!el) return
    const medir = () => (largura.current = el.offsetWidth)
    medir()
    const ro = new ResizeObserver(medir)
    ro.observe(el)
    return () => ro.disconnect()
  }, [])

  useAnimationFrame((_, delta) => {
    if (!ativo || reduzir || !trilho.current || !largura.current) return
    const f = fator.get()
    if (f < -0.05) direcao.current = -sentido
    else if (f > 0.05) direcao.current = sentido
    const dt = Math.min(delta, 50) / 1000
    x.current -= direcao.current * velocidade * dt * (1 + Math.abs(f))
    const L = largura.current
    if (x.current <= -L) x.current += L
    if (x.current > 0) x.current -= L
    trilho.current.style.transform = `translate3d(${x.current.toFixed(2)}px,0,0)`
  })

  const conteudo = (copia: number) => (
    <div ref={copia === 0 ? grupo : undefined} className="flex shrink-0 items-center" aria-hidden={copia > 0 || undefined}>
      {itens.map((item, i) => (
        <Fragment key={`${copia}-${i}`}>
          <span className={`whitespace-nowrap px-[0.35em] ${i % 2 === 0 ? 'text-branco' : 'texto-contorno'}`}>{item}</span>
          <img src={MARCA.monograma.src} alt="" className="mx-[0.25em] h-[0.3em] w-auto shrink-0 opacity-80" />
        </Fragment>
      ))}
    </div>
  )

  return (
    <div ref={area} className="relative overflow-hidden border-y border-white/[0.06] bg-preto py-6 md:py-9" aria-label={itens.join(', ')}>
      <div
        ref={trilho}
        className="flex w-max font-display text-[clamp(3.4rem,9vw,8.5rem)] leading-[1.02] tracking-[-0.025em] will-change-transform"
      >
        {conteudo(0)}
        {conteudo(1)}
        {conteudo(2)}
      </div>
    </div>
  )
}
