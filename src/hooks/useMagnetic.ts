import { useEffect } from 'react'

/**
 * Qualquer elemento com data-magnetic segue o ponteiro de leve.
 * data-magnetic="0.25" ajusta a força (padrão 0.3). Só com mouse e sem reduced-motion.
 * Também publica --mx/--my (posição do ponteiro dentro do botão) para o brilho.
 */
export function useMagnetic() {
  useEffect(() => {
    const fino = window.matchMedia('(pointer: fine)').matches
    const reduzir = window.matchMedia('(prefers-reduced-motion: reduce)').matches
    if (!fino || reduzir) return

    let atual: HTMLElement | null = null

    const soltar = (el: HTMLElement) => {
      el.style.transform = ''
      el.dataset.tx = '0'
      el.dataset.ty = '0'
    }

    const mover = (e: PointerEvent) => {
      const alvo = (e.target as Element | null)?.closest?.('[data-magnetic]') as HTMLElement | null
      if (atual && atual !== alvo) soltar(atual)
      atual = alvo
      if (!alvo) return

      const r = alvo.getBoundingClientRect()
      const tx = Number(alvo.dataset.tx || 0)
      const ty = Number(alvo.dataset.ty || 0)
      const cx = r.left - tx + r.width / 2
      const cy = r.top - ty + r.height / 2
      const forca = Number(alvo.dataset.magnetic) || 0.3
      const nx = (e.clientX - cx) * forca
      const ny = (e.clientY - cy) * forca

      alvo.dataset.tx = String(nx)
      alvo.dataset.ty = String(ny)
      alvo.style.transform = `translate3d(${nx.toFixed(2)}px, ${ny.toFixed(2)}px, 0)`
      alvo.style.setProperty('--mx', `${e.clientX - (r.left - tx)}px`)
      alvo.style.setProperty('--my', `${e.clientY - (r.top - ty)}px`)
    }

    const sair = () => {
      if (atual) soltar(atual)
      atual = null
    }

    document.addEventListener('pointermove', mover, { passive: true })
    document.documentElement.addEventListener('pointerleave', sair)
    window.addEventListener('blur', sair)
    return () => {
      document.removeEventListener('pointermove', mover)
      document.documentElement.removeEventListener('pointerleave', sair)
      window.removeEventListener('blur', sair)
    }
  }, [])
}
