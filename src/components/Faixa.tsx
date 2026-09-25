import { Fragment, useRef } from 'react'
import { useSceneActivity } from '../hooks/useSceneActivity'

/**
 * Faixa corrida. Os itens são separados pela Linha do logo.
 * Pausa no hover, fora da tela e com a aba em segundo plano.
 */
export function Faixa({
  itens,
  estilo = 'sans',
  tom = 'preta',
  inclinada = false,
  duracao = 42,
  reverso = false,
}: {
  itens: readonly string[]
  estilo?: 'sans' | 'display'
  tom?: 'preta' | 'clara' | 'metal'
  inclinada?: boolean
  duracao?: number
  reverso?: boolean
}) {
  const ref = useRef<HTMLDivElement>(null)
  const ativo = useSceneActivity(ref, '120px')

  const cores =
    tom === 'preta'
      ? 'bg-preto text-prata border-y border-white/[0.07]'
      : tom === 'metal'
        ? 'bg-linear-to-r from-[#8b9098] via-[#eef0f2] to-[#8b9098] text-preto'
        : 'bg-branco text-preto border-y border-black/[0.06]'

  const texto =
    estilo === 'display'
      ? 'font-display text-[clamp(1.75rem,3.6vw,3rem)] leading-none tracking-[-0.015em] py-6 md:py-8'
      : 'text-[0.95rem] md:text-base font-medium tracking-[-0.005em] py-4 md:py-5'

  const grupo = (copia: number) => (
    <div className="flex shrink-0 items-center" aria-hidden={copia > 0 ? true : undefined}>
      {itens.map((item, i) => (
        <Fragment key={`${copia}-${i}`}>
          <span className="whitespace-nowrap px-6 md:px-8">{item}</span>
          <span className="block h-px w-10 shrink-0 bg-current opacity-40 md:w-14" />
        </Fragment>
      ))}
    </div>
  )

  return (
    <div
      className={inclinada ? 'relative z-30 -my-10 md:-my-14' : 'relative'}
      style={inclinada ? { transform: 'rotate(-2deg)' } : undefined}
    >
      <div
        ref={ref}
        data-ativo={ativo}
        className={`faixa overflow-hidden ${cores} ${inclinada ? '-mx-[4vw] shadow-[0_24px_60px_-24px_rgba(0,0,0,0.55)]' : ''}`}
      >
        <div className={`faixa-trilho ${texto}`} style={{ ['--duracao' as string]: `${duracao}s`, animationDirection: reverso ? 'reverse' : undefined }}>
          {grupo(0)}
          {grupo(1)}
          {grupo(2)}
          {grupo(3)}
        </div>
      </div>
    </div>
  )
}
