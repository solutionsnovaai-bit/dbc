import { useEffect, useLayoutEffect, useRef, useState, type KeyboardEvent, type PointerEvent as ReactPointerEvent } from 'react'
import { animate, motion, useMotionValue, useReducedMotion } from 'framer-motion'
import { CONQUISTAS } from '../../lib/fotos'
import { EASE } from '../../lib/site'
import { useSceneActivity } from '../../hooks/useSceneActivity'
import { Conteiner, Folha, Titulo } from '../Section'
import { IconePausa, IconePlay, IconeSeta } from '../icons'

const TOTAL = CONQUISTAS.length
const COPIAS = 3
const DURACAO = 4.6 // segundos em cada foto

export function Conquistas() {
  return (
    <Folha id="conquistas" tom="clara" revelar={false} rotulo="Conquistas">
      <div className="pb-40 pt-24 md:pb-52 md:pt-36">
        <Conteiner>
          <div className="grid gap-8 lg:grid-cols-12 lg:items-end">
            <Titulo linhas={['A empresa cresce.', 'A vida acompanha.']} className="titulo-secao lg:col-span-7" />
            <p className="texto-corpo max-w-[30rem] text-preto/70 lg:col-span-5 lg:col-start-8">
              É para isso que existe crédito bem feito: para a empresa crescer e levar junto quem está por trás dela.
            </p>
          </div>
        </Conteiner>
        <Carrossel />
      </div>
    </Folha>
  )
}

/**
 * Carrossel central que anda sozinho. O tempo de cada foto é a própria Linha enchendo
 * embaixo: quando ela completa, passa para a próxima. Arrasta, aceita setas do teclado,
 * pausa fora da tela e tem botão de pausa (com movimento reduzido já começa pausado).
 */
function Carrossel() {
  const reduzir = useReducedMotion()
  const janela = useRef<HTMLDivElement>(null)
  const primeiro = useRef<HTMLDivElement>(null)
  const naTela = useSceneActivity(janela, '0px')
  const x = useMotionValue(0)
  const [indice, setIndice] = useState(TOTAL)
  const [ciclo, setCiclo] = useState(0)
  const [pausado, setPausado] = useState(false)
  const [arrastando, setArrastando] = useState(false)
  const indiceRef = useRef(indice)
  indiceRef.current = indice
  const medidas = useRef({ largura: 0, passo: 0, janela: 0 })
  const arraste = useRef({ ativo: false, moveu: false, x0: 0, base: 0 })

  useEffect(() => {
    if (reduzir) setPausado(true)
  }, [reduzir])

  const alvo = (i: number) => medidas.current.janela / 2 - (i * medidas.current.passo + medidas.current.largura / 2)

  // mede slide e espaço entre slides
  useLayoutEffect(() => {
    const medir = () => {
      const j = janela.current
      const s = primeiro.current
      if (!j || !s || !s.parentElement) return
      const espaco = parseFloat(getComputedStyle(s.parentElement).columnGap) || 0
      medidas.current = { largura: s.offsetWidth, passo: s.offsetWidth + espaco, janela: j.offsetWidth }
      x.set(alvo(indiceRef.current))
    }
    medir()
    const ro = new ResizeObserver(medir)
    if (janela.current) ro.observe(janela.current)
    return () => ro.disconnect()
  }, [x])

  // anima até o índice e, no fim, volta em silêncio para a cópia do meio
  useEffect(() => {
    let cancelado = false
    const controle = animate(x, alvo(indice), { duration: 1.05, ease: EASE })
    controle.then(() => {
      if (cancelado || indiceRef.current !== indice) return
      if (indice < TOTAL || indice >= 2 * TOTAL) {
        const normal = (((indice % TOTAL) + TOTAL) % TOTAL) + TOTAL
        x.set(alvo(normal))
        setIndice(normal)
      }
    })
    return () => {
      cancelado = true
      controle.stop()
    }
  }, [indice, x])

  const irPara = (novo: number) => {
    const passo = medidas.current.passo
    // cliques rápidos: mantém o índice perto da cópia do meio sem salto visível
    if (novo > 2 * TOTAL + 1) {
      x.set(x.get() + TOTAL * passo)
      novo -= TOTAL
    } else if (novo < TOTAL - 2) {
      x.set(x.get() - TOTAL * passo)
      novo += TOTAL
    }
    setIndice(novo)
    setCiclo((c) => c + 1)
  }

  const real = ((indice % TOTAL) + TOTAL) % TOTAL
  const irParaReal = (r: number) => irPara(indiceRef.current - real + r)
  const rodando = !pausado && naTela && !arrastando

  const baixar = (e: ReactPointerEvent<HTMLDivElement>) => {
    if (e.pointerType === 'mouse' && e.button !== 0) return
    arraste.current = { ativo: true, moveu: false, x0: e.clientX, base: x.get() }
  }
  const mover = (e: ReactPointerEvent<HTMLDivElement>) => {
    const a = arraste.current
    if (!a.ativo) return
    const dx = e.clientX - a.x0
    if (!a.moveu) {
      if (Math.abs(dx) < 6) return
      a.moveu = true
      setArrastando(true)
      e.currentTarget.setPointerCapture(e.pointerId)
    }
    x.set(a.base + dx)
  }
  const soltar = (e: ReactPointerEvent<HTMLDivElement>, cancelou = false) => {
    const a = arraste.current
    if (!a.ativo) return
    a.ativo = false
    if (!a.moveu) return
    setArrastando(false)
    const dx = e.clientX - a.x0
    if (!cancelou && dx < -60) irPara(indiceRef.current + 1)
    else if (!cancelou && dx > 60) irPara(indiceRef.current - 1)
    else animate(x, alvo(indiceRef.current), { duration: 0.6, ease: EASE })
  }
  const teclado = (e: KeyboardEvent<HTMLDivElement>) => {
    if (e.key === 'ArrowRight') {
      e.preventDefault()
      irPara(indiceRef.current + 1)
    } else if (e.key === 'ArrowLeft') {
      e.preventDefault()
      irPara(indiceRef.current - 1)
    }
  }

  return (
    <>
      <div
        ref={janela}
        role="region"
        aria-roledescription="carrossel"
        aria-label="Conquistas"
        tabIndex={0}
        onKeyDown={teclado}
        className="relative mt-14 cursor-grab select-none outline-none active:cursor-grabbing md:mt-20"
        style={{ touchAction: 'pan-y' }}
        onPointerDown={baixar}
        onPointerMove={mover}
        onPointerUp={(e) => soltar(e)}
        onPointerCancel={(e) => soltar(e, true)}
        onClickCapture={(e) => {
          if (arraste.current.moveu) {
            e.preventDefault()
            e.stopPropagation()
            arraste.current.moveu = false
          }
        }}
      >
        <motion.div className="flex w-max gap-4 will-change-transform md:gap-6" style={{ x, ['--dur' as string]: `${DURACAO}s` }}>
          {Array.from({ length: COPIAS }, (_, copia) =>
            CONQUISTAS.map((c, r) => {
              const abs = copia * TOTAL + r
              const ativo = r === real
              return (
                <div
                  key={abs}
                  ref={abs === 0 ? primeiro : undefined}
                  aria-hidden={copia !== 1 || undefined}
                  onClick={() => !ativo && irPara(abs)}
                  className="relative w-[78vw] shrink-0 sm:w-[72vw] lg:w-[min(60vw,960px)]"
                >
                  <figure
                    className={`conquista relative aspect-square overflow-hidden rounded-[1.5rem] bg-grafite sm:aspect-[4/3] md:rounded-[2rem] lg:aspect-[16/10] ${
                      ativo ? 'is-ativa' : ''
                    }`}
                  >
                    <img
                      src={c.foto.src}
                      srcSet={c.foto.srcSet}
                      sizes="(min-width: 1024px) min(60vw, 960px), (min-width: 640px) 72vw, 78vw"
                      width={c.foto.w}
                      height={c.foto.h}
                      alt={copia === 1 ? c.foto.alt : ''}
                      loading="lazy"
                      decoding="async"
                      draggable={false}
                      className="conquista-img absolute inset-0 h-full w-full select-none object-cover"
                      style={{ objectPosition: c.foco }}
                    />
                    <div aria-hidden="true" className="conquista-veu absolute inset-0 bg-preto" />
                    <div
                      aria-hidden="true"
                      className="conquista-degrade absolute inset-x-0 bottom-0 h-3/5 bg-linear-to-t from-black/80 via-black/35 to-transparent"
                    />
                    <figcaption className="absolute inset-x-0 bottom-0 flex items-end justify-between gap-6 p-5 md:p-8 lg:p-10">
                      <span className="block max-w-[16ch] overflow-hidden font-display text-[clamp(1.55rem,3.2vw,3rem)] leading-[1.04] tracking-[-0.018em] text-branco">
                        <span className="conquista-legenda block">{c.legenda}</span>
                      </span>
                      <span className="conquista-numero shrink-0 font-display text-[0.95rem] tabular-nums text-prata">
                        {String(r + 1).padStart(2, '0')} / {String(TOTAL).padStart(2, '0')}
                      </span>
                    </figcaption>
                  </figure>
                </div>
              )
            }),
          )}
        </motion.div>
      </div>

      <Conteiner className="mt-8 md:mt-10">
        <div className="flex items-center gap-3 md:gap-5">
          <div className="flex flex-1 gap-1.5 md:gap-2">
            {CONQUISTAS.map((c, r) => (
              <button
                key={c.id}
                type="button"
                onClick={() => irParaReal(r)}
                aria-label={`Mostrar: ${c.legenda}`}
                aria-current={r === real || undefined}
                className="relative h-8 flex-1"
              >
                <span className="absolute inset-x-0 top-1/2 h-px overflow-hidden bg-preto/15">
                  {r === real ? (
                    <span
                      key={`t-${ciclo}`}
                      className="linha-timer absolute inset-0 bg-preto"
                      data-pausado={!rodando}
                      style={{ ['--dur' as string]: `${DURACAO}s` }}
                      onAnimationEnd={() => irPara(indiceRef.current + 1)}
                    />
                  ) : (
                    <span
                      className="absolute inset-0 origin-left bg-preto transition-transform duration-500"
                      style={{ transform: `scaleX(${r < real ? 1 : 0})` }}
                    />
                  )}
                </span>
              </button>
            ))}
          </div>
          <button
            type="button"
            onClick={() => setPausado((v) => !v)}
            aria-label={pausado ? 'Continuar carrossel' : 'Pausar carrossel'}
            className="grid h-11 w-11 shrink-0 place-items-center rounded-full border border-preto/15 text-preto transition-colors hover:border-preto/60"
          >
            {pausado ? <IconePlay className="h-4 w-4" /> : <IconePausa className="h-4 w-4" />}
          </button>
          <button
            type="button"
            onClick={() => irPara(indiceRef.current - 1)}
            aria-label="Foto anterior"
            data-magnetic="0.3"
            className="grid h-11 w-11 shrink-0 place-items-center rounded-full border border-preto/15 text-preto transition-colors hover:border-preto/60"
          >
            <IconeSeta className="h-4 w-4 rotate-180" />
          </button>
          <button
            type="button"
            onClick={() => irPara(indiceRef.current + 1)}
            aria-label="Próxima foto"
            data-magnetic="0.3"
            className="grid h-11 w-11 shrink-0 place-items-center rounded-full bg-preto text-branco"
          >
            <IconeSeta className="h-4 w-4" />
          </button>
        </div>
      </Conteiner>
    </>
  )
}
