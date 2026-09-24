import { useEffect, useState, type RefObject } from 'react'

/**
 * true só quando o elemento está visível E a aba está ativa.
 * Loops de animação (luz do hero, carrossel, faixas) pausam fora disso.
 */
export function useSceneActivity(ref: RefObject<Element | null>, rootMargin = '0px') {
  const [ativo, setAtivo] = useState(false)

  useEffect(() => {
    const el = ref.current
    if (!el) return
    let visivel = false
    const atualizar = () => setAtivo(visivel && document.visibilityState === 'visible')

    const io = new IntersectionObserver(
      ([entrada]) => {
        visivel = entrada.isIntersecting
        atualizar()
      },
      { rootMargin },
    )
    io.observe(el)
    document.addEventListener('visibilitychange', atualizar)
    return () => {
      io.disconnect()
      document.removeEventListener('visibilitychange', atualizar)
    }
  }, [ref, rootMargin])

  return ativo
}
