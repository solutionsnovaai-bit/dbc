import { useEffect } from 'react'
import Lenis from 'lenis'

let instancia: Lenis | null = null

/** Acesso à Lenis fora do hook (navbar, loader). Null no mobile e com reduced-motion. */
export function getLenis() {
  return instancia
}

/**
 * Rolagem com inércia só no desktop com mouse. No toque o scroll nativo já é o melhor,
 * e com prefers-reduced-motion a Lenis nem liga.
 */
export function useSmoothScroll() {
  useEffect(() => {
    const desktop = window.matchMedia('(min-width: 1024px) and (pointer: fine)')
    const reduzir = window.matchMedia('(prefers-reduced-motion: reduce)')
    if (!desktop.matches || reduzir.matches) return

    const lenis = new Lenis({
      duration: 1.15,
      easing: (t) => 1 - Math.pow(1 - t, 4),
      smoothWheel: true,
    })
    instancia = lenis

    let raf = 0
    const loop = (tempo: number) => {
      lenis.raf(tempo)
      raf = requestAnimationFrame(loop)
    }
    raf = requestAnimationFrame(loop)

    return () => {
      cancelAnimationFrame(raf)
      lenis.destroy()
      instancia = null
    }
  }, [])
}

/** Rola até uma seção respeitando Lenis e reduced-motion. */
export function rolarPara(id: string) {
  const alvo = id === 'inicio' ? 0 : document.getElementById(id)
  if (alvo === null) return
  const reduzir = window.matchMedia('(prefers-reduced-motion: reduce)').matches
  if (instancia) {
    instancia.scrollTo(alvo, { duration: 1.4 })
    return
  }
  if (typeof alvo === 'number') window.scrollTo({ top: 0, behavior: reduzir ? 'auto' : 'smooth' })
  else alvo.scrollIntoView({ behavior: reduzir ? 'auto' : 'smooth', block: 'start' })
}
