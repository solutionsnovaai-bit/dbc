import { useEffect, useRef, useState } from 'react'
import {
  AnimatePresence,
  motion,
  useMotionValueEvent,
  useReducedMotion,
  useScroll,
  useSpring,
  useTransform,
  useVelocity,
} from 'framer-motion'
import { EASE, MENSAGENS, dentroDoHorario, waLink } from '../lib/site'
import { IconeConversa } from './icons'

/**
 * Esfera preta com anel prata. Aparece depois do hero, some perto do fim (onde já tem o CTA),
 * balança de leve com a velocidade do scroll e mostra o ponto verde no horário de atendimento.
 */
export function WhatsAppFab({ liberado }: { liberado: boolean }) {
  const reduzir = useReducedMotion()
  const { scrollY } = useScroll()
  const [mostrar, setMostrar] = useState(false)
  const [balao, setBalao] = useState(false)
  const [hover, setHover] = useState(false)
  const [online, setOnline] = useState(() => dentroDoHorario())
  const jaMostrouBalao = useRef(false)

  const velocidade = useVelocity(scrollY)
  const deslocamento = useTransform(velocidade, [-2600, 0, 2600], [14, 0, -14])
  const inercia = useSpring(deslocamento, { stiffness: 160, damping: 16, mass: 0.6 })

  useMotionValueEvent(scrollY, 'change', (v) => {
    const passouHero = v > window.innerHeight * 0.75
    const pertoDoFim = v + window.innerHeight > document.documentElement.scrollHeight - 700
    setMostrar(passouHero && !pertoDoFim)
  })

  useEffect(() => {
    if (!mostrar || jaMostrouBalao.current) return
    jaMostrouBalao.current = true
    setBalao(true)
    const t = window.setTimeout(() => setBalao(false), 6500)
    return () => window.clearTimeout(t)
  }, [mostrar])

  useEffect(() => {
    const id = window.setInterval(() => setOnline(dentroDoHorario()), 60_000)
    return () => window.clearInterval(id)
  }, [])

  const status = online ? 'Online agora' : 'Deixe sua mensagem'

  return (
    <AnimatePresence>
      {liberado && mostrar && (
        <motion.div
          className="fixed bottom-[max(1.25rem,env(safe-area-inset-bottom))] right-4 z-40 md:right-6"
          initial={{ opacity: 0, y: 28, scale: 0.85 }}
          animate={{ opacity: 1, y: 0, scale: 1 }}
          exit={{ opacity: 0, y: 28, scale: 0.85 }}
          transition={{ duration: 0.6, ease: EASE }}
        >
          <motion.div className="flex items-center gap-3" style={reduzir ? undefined : { y: inercia }}>
            <AnimatePresence>
              {(balao || hover) && (
                <motion.a
                  href={waLink(MENSAGENS.padrao)}
                  target="_blank"
                  rel="noopener noreferrer"
                  tabIndex={-1}
                  aria-hidden="true"
                  className="hidden flex-col rounded-2xl bg-branco px-4 py-2.5 text-preto shadow-[0_18px_40px_-16px_rgba(0,0,0,0.55)] sm:flex"
                  initial={{ opacity: 0, x: 12 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: 12 }}
                  transition={{ duration: 0.45, ease: EASE }}
                  onMouseEnter={() => setHover(true)}
                  onMouseLeave={() => setHover(false)}
                >
                  <span className="text-[0.9rem] font-medium leading-tight">Pedir análise</span>
                  <span className="text-[0.75rem] leading-tight text-aco">{status}</span>
                </motion.a>
              )}
            </AnimatePresence>

            <a
              href={waLink(MENSAGENS.padrao)}
              target="_blank"
              rel="noopener noreferrer"
              data-magnetic="0.35"
              aria-label={`Pedir análise no WhatsApp. ${status}`}
              onMouseEnter={() => setHover(true)}
              onMouseLeave={() => setHover(false)}
              className="relative grid h-[3.75rem] w-[3.75rem] place-items-center rounded-full text-branco shadow-[0_20px_44px_-14px_rgba(0,0,0,0.75)] transition-[transform] duration-500 ease-lux"
              style={{
                background: 'radial-gradient(circle at 34% 28%, #2c2f35 0%, #0a0b0c 55%, #000 100%)',
                boxShadow:
                  '0 0 0 1px rgba(196,200,206,0.55), inset 0 1px 0 rgba(255,255,255,0.18), 0 20px 44px -14px rgba(0,0,0,0.75)',
              }}
            >
              <IconeConversa className="h-6 w-6" />
              {online && (
                <span aria-hidden="true" className="absolute right-0.5 top-0.5 grid h-3.5 w-3.5 place-items-center">
                  <span className="absolute inset-0 animate-ping rounded-full bg-[#2fd17a] opacity-50 motion-reduce:animate-none" />
                  <span className="relative h-3 w-3 rounded-full bg-[#2fd17a] ring-2 ring-preto" />
                </span>
              )}
            </a>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  )
}
