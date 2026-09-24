import { useEffect, useRef, type PointerEvent as ReactPointerEvent } from 'react'
import { useReducedMotion } from 'framer-motion'
import { MENSAGENS, waLink } from '../../lib/site'
import { RAMOS, type Ramo } from '../../lib/fotos'
import { useSceneActivity } from '../../hooks/useSceneActivity'
import { Conteiner, Folha, Titulo } from '../Section'
import { ICONES_RAMO, IconeConversa } from '../icons'

const COPIAS = 4
const VELOCIDADE = 34 // px/s de deriva

export function ParaQuem() {
  return (
    <Folha id="para-quem" tom="preta" rotulo="Para quem é">
      <div className="pb-36 pt-28 md:pb-48 md:pt-40">
        <Conteiner>
          <div className="grid gap-8 lg:grid-cols-12 lg:items-end">
            <Titulo linhas={['Do salão', 'à oficina.']} className="titulo-secao lg:col-span-7" />
            <p className="texto-corpo max-w-[30rem] text-prata lg:col-span-5 lg:col-start-8">
              Crédito para quem vive de CNPJ: MEI, microempresa e empresa de pequeno porte.
            </p>
          </div>
        </Conteiner>
        <Carrossel />
      </div>
    </Folha>
  )
}

function Carrossel() {
  const area = useRef<HTMLDivElement>(null)
  const trilho = useRef<HTMLDivElement>(null)
  const primeiro = useRef<HTMLDivElement>(null)
  const ativo = useSceneActivity(area, '120px')
  const reduzir = useReducedMotion()
  const s = useRef({
    x: 0,
    v: 0,
    largura: 0,
    pressionado: false,
    arrastando: false,
    pausado: false,
    lento: false,
    inicioX: 0,
    ultimoX: 0,
    ultimoT: 0,
    moveu: 0,
  })

  const aplicar = () => {
    const e = s.current
    if (e.largura > 0) {
      while (e.x >= -e.largura) e.x -= e.largura
      while (e.x < -2 * e.largura) e.x += e.largura
    }
    if (trilho.current) trilho.current.style.transform = `translate3d(${e.x.toFixed(2)}px,0,0)`
  }

  // mede a largura de uma cópia (cards + espaço)
  useEffect(() => {
    const el = primeiro.current
    if (!el) return
    const medir = () => {
      const e = s.current
      const anterior = e.largura
      e.largura = el.offsetWidth
      if (!anterior) e.x = -e.largura
      aplicar()
    }
    medir()
    const ro = new ResizeObserver(medir)
    ro.observe(el)
    return () => ro.disconnect()
  }, [])

  // deriva contínua + inércia depois do arraste
  useEffect(() => {
    if (!ativo) return
    let raf = 0
    let anterior = performance.now()
    const passo = (t: number) => {
      const e = s.current
      const dt = Math.min(0.05, (t - anterior) / 1000)
      anterior = t
      if (!e.arrastando) {
        const alvo = e.pausado || reduzir ? 0 : e.lento ? -VELOCIDADE * 0.3 : -VELOCIDADE
        e.v += (alvo - e.v) * (1 - Math.exp(-dt * 2.4))
        e.x += e.v * dt
        aplicar()
      }
      raf = requestAnimationFrame(passo)
    }
    raf = requestAnimationFrame(passo)
    return () => cancelAnimationFrame(raf)
  }, [ativo, reduzir])

  const baixar = (ev: ReactPointerEvent<HTMLDivElement>) => {
    if (ev.pointerType === 'mouse' && ev.button !== 0) return
    const e = s.current
    e.pressionado = true
    e.arrastando = false
    e.inicioX = ev.clientX
    e.ultimoX = ev.clientX
    e.ultimoT = performance.now()
    e.moveu = 0
  }

  const mover = (ev: ReactPointerEvent<HTMLDivElement>) => {
    const e = s.current
    if (!e.pressionado) return
    if (!e.arrastando) {
      if (Math.abs(ev.clientX - e.inicioX) < 6) return
      // só captura o ponteiro quando vira arraste, para o toque simples continuar sendo clique
      e.arrastando = true
      e.v = 0
      ev.currentTarget.setPointerCapture(ev.pointerId)
    }
    const agora = performance.now()
    const dx = ev.clientX - e.ultimoX
    const dt = Math.max(8, agora - e.ultimoT) / 1000
    e.x += dx
    e.v = e.v * 0.25 + (dx / dt) * 0.75
    e.moveu += Math.abs(dx)
    e.ultimoX = ev.clientX
    e.ultimoT = agora
    aplicar()
  }

  const soltar = () => {
    const e = s.current
    e.pressionado = false
    if (e.arrastando) {
      e.arrastando = false
      e.v = Math.max(-2600, Math.min(2600, e.v))
    }
  }

  return (
    <div
      ref={area}
      role="region"
      aria-label="Ramos atendidos"
      className="mt-14 cursor-grab select-none active:cursor-grabbing md:mt-20"
      style={{ touchAction: 'pan-y' }}
      onPointerDown={baixar}
      onPointerMove={mover}
      onPointerUp={soltar}
      onPointerCancel={soltar}
      onPointerEnter={(ev) => {
        if (ev.pointerType === 'mouse') s.current.lento = true
      }}
      onPointerLeave={(ev) => {
        if (ev.pointerType === 'mouse') s.current.lento = false
        soltar()
      }}
      onFocusCapture={() => (s.current.pausado = true)}
      onBlurCapture={() => (s.current.pausado = false)}
      onClickCapture={(ev) => {
        if (s.current.moveu > 8) {
          ev.preventDefault()
          ev.stopPropagation()
        }
      }}
    >
      <div ref={trilho} className="flex w-max will-change-transform">
        {Array.from({ length: COPIAS }, (_, copia) => (
          <div key={copia} ref={copia === 0 ? primeiro : undefined} className="flex gap-4 pr-4 md:gap-5 md:pr-5">
            {RAMOS.map((ramo) => (
              <CartaoRamo key={`${copia}-${ramo.id}`} ramo={ramo} oculto={copia > 0} />
            ))}
            <CartaoOutroRamo oculto={copia > 0} />
          </div>
        ))}
      </div>
    </div>
  )
}

/** Inclinação 3D + brilho que segue o ponteiro (só com mouse). */
function useInclinacao() {
  const mover = (ev: ReactPointerEvent<HTMLElement>) => {
    if (ev.pointerType !== 'mouse') return
    const el = ev.currentTarget
    const r = el.getBoundingClientRect()
    const px = (ev.clientX - r.left) / r.width
    const py = (ev.clientY - r.top) / r.height
    el.style.setProperty('--rx', `${((0.5 - py) * 7).toFixed(2)}deg`)
    el.style.setProperty('--ry', `${((px - 0.5) * 9).toFixed(2)}deg`)
    el.style.setProperty('--px', `${(px * 100).toFixed(1)}%`)
    el.style.setProperty('--py', `${(py * 100).toFixed(1)}%`)
  }
  const sair = (ev: ReactPointerEvent<HTMLElement>) => {
    const el = ev.currentTarget
    el.style.setProperty('--rx', '0deg')
    el.style.setProperty('--ry', '0deg')
  }
  return { onPointerMove: mover, onPointerLeave: sair }
}

const classeCartao =
  'group relative block w-[72vw] max-w-[340px] shrink-0 sm:w-[300px] lg:w-[330px] [perspective:1000px] outline-none'
const classeCorpo =
  'relative aspect-[4/5] overflow-hidden rounded-[1.75rem] border border-white/[0.07] transition-transform duration-500 ease-lux [transform:rotateX(var(--rx,0deg))_rotateY(var(--ry,0deg))] group-focus-visible:ring-2 group-focus-visible:ring-prata'

function CartaoRamo({ ramo, oculto }: { ramo: Ramo; oculto: boolean }) {
  const Icone = ICONES_RAMO[ramo.icone]
  const inclinacao = useInclinacao()

  return (
    <a
      href={waLink(MENSAGENS.ramo(ramo.nome))}
      target="_blank"
      rel="noopener noreferrer"
      draggable={false}
      tabIndex={oculto ? -1 : undefined}
      aria-hidden={oculto || undefined}
      aria-label={`${ramo.nome}: ${ramo.frase} Pedir análise no WhatsApp`}
      className={classeCartao}
      {...inclinacao}
    >
      <div className={`${classeCorpo} bg-grafite`}>
        {ramo.foto ? (
          <img
            src={ramo.foto.src}
            srcSet={ramo.foto.srcSet}
            sizes="(min-width: 1024px) 330px, (min-width: 640px) 300px, 72vw"
            width={ramo.foto.w}
            height={ramo.foto.h}
            alt={ramo.foto.alt}
            loading="lazy"
            decoding="async"
            draggable={false}
            className="absolute inset-0 h-full w-full object-cover transition-transform duration-700 ease-lux group-hover:scale-[1.04]"
          />
        ) : (
          <div aria-hidden="true" className="absolute inset-0">
            {/* estúdio preto com luz de cima, o objeto em metal sobre o piso espelhado */}
            <div className="absolute inset-0 bg-[radial-gradient(ellipse_70%_55%_at_50%_18%,rgba(255,255,255,0.13),rgba(255,255,255,0)_70%)]" />
            <div className="absolute left-1/2 top-[37%] w-[42%] -translate-x-1/2 -translate-y-1/2">
              <Icone metal strokeWidth={0.9} className="h-auto w-full drop-shadow-[0_10px_24px_rgba(0,0,0,0.6)] transition-transform duration-700 ease-lux group-hover:-translate-y-1.5" />
            </div>
            <div className="absolute left-[12%] right-[12%] top-[60%] h-px bg-linear-to-r from-transparent via-white/35 to-transparent" />
            <div className="absolute left-1/2 top-[60%] w-[42%] opacity-[0.13] [transform:translateX(-50%)_scaleY(-1)] [mask-image:linear-gradient(to_top,rgba(0,0,0,0.9),transparent_55%)]">
              <Icone metal strokeWidth={0.9} className="h-auto w-full" />
            </div>
          </div>
        )}

        <div aria-hidden="true" className="absolute inset-x-0 bottom-0 h-3/5 bg-linear-to-t from-black/85 via-black/40 to-transparent" />
        <div
          aria-hidden="true"
          className="pointer-events-none absolute inset-0 opacity-0 mix-blend-overlay transition-opacity duration-500 group-hover:opacity-100"
          style={{ background: 'radial-gradient(circle at var(--px,50%) var(--py,30%), rgba(255,255,255,0.55), transparent 45%)' }}
        />

        <div className="absolute inset-x-0 bottom-0 p-6 md:p-7">
          <p className="texto-miudo text-aco">{ramo.nome}</p>
          <p className="titulo-card mt-1.5 text-branco">{ramo.frase}</p>
          <span className="mt-5 inline-flex items-center gap-2 text-[0.85rem] text-prata transition-colors group-hover:text-branco">
            <IconeConversa className="h-4 w-4" />
            <span className="link-linha">Pedir análise</span>
          </span>
        </div>
      </div>
    </a>
  )
}

function CartaoOutroRamo({ oculto }: { oculto: boolean }) {
  const inclinacao = useInclinacao()
  return (
    <a
      href={waLink(MENSAGENS.outroRamo)}
      target="_blank"
      rel="noopener noreferrer"
      draggable={false}
      tabIndex={oculto ? -1 : undefined}
      aria-hidden={oculto || undefined}
      className={classeCartao}
      {...inclinacao}
    >
      <div className={`${classeCorpo} flex flex-col justify-between border-white/15 bg-transparent p-6 md:p-7`}>
        <IconeConversa metal strokeWidth={1} className="h-14 w-14" />
        <div>
          <p className="titulo-card text-branco">Seu ramo não está aqui?</p>
          <p className="texto-corpo mt-2 text-prata">Tem CNPJ, a gente analisa.</p>
          <span className="btn btn-claro btn-pequeno mt-6">Chamar no WhatsApp</span>
        </div>
      </div>
    </a>
  )
}
