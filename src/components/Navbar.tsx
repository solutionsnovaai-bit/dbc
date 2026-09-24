import { useEffect, useRef, useState } from 'react'
import { AnimatePresence, motion, useMotionValueEvent, useReducedMotion, useScroll } from 'framer-motion'
import { EASE, MENSAGENS, NAV_ITEMS, SITE, waLink } from '../lib/site'
import { MARCA } from '../lib/fotos'
import { getLenis, rolarPara } from '../hooks/useSmoothScroll'
import { IconeConversa, IconeFechar, IconeMenu } from './icons'

export function Navbar({ visivel }: { visivel: boolean }) {
  const reduzir = useReducedMotion()
  const { scrollY, scrollYProgress } = useScroll()
  const [ativo, setAtivo] = useState<string>('')
  const [escondida, setEscondida] = useState(false)
  const [menuAberto, setMenuAberto] = useState(false)
  const botaoMenu = useRef<HTMLButtonElement>(null)
  const primeiroLink = useRef<HTMLButtonElement>(null)

  // Some ao descer (depois do hero), volta ao subir
  useMotionValueEvent(scrollY, 'change', (atual) => {
    const anterior = scrollY.getPrevious() ?? 0
    const passouHero = atual > window.innerHeight * 0.9
    setEscondida(passouHero && atual > anterior + 2 && !menuAberto)
    if (atual < anterior - 2 || !passouHero) setEscondida(false)
  })

  // Scroll spy: a seção que cruza o meio da tela
  useEffect(() => {
    const secoes = NAV_ITEMS.map((i) => document.getElementById(i.id)).filter(Boolean) as HTMLElement[]
    const io = new IntersectionObserver(
      (entradas) => {
        entradas.forEach((e) => {
          if (e.isIntersecting) setAtivo(e.target.id)
        })
      },
      { rootMargin: '-45% 0px -50% 0px' },
    )
    secoes.forEach((s) => io.observe(s))
    const topo = () => {
      if (window.scrollY < window.innerHeight * 0.5) setAtivo('')
    }
    window.addEventListener('scroll', topo, { passive: true })
    return () => {
      io.disconnect()
      window.removeEventListener('scroll', topo)
    }
  }, [])

  // Menu mobile: trava a rolagem, fecha no Esc, devolve o foco
  useEffect(() => {
    const html = document.documentElement
    if (menuAberto) {
      html.classList.add('travado')
      getLenis()?.stop()
      primeiroLink.current?.focus()
      const esc = (e: KeyboardEvent) => e.key === 'Escape' && setMenuAberto(false)
      window.addEventListener('keydown', esc)
      return () => {
        window.removeEventListener('keydown', esc)
        html.classList.remove('travado')
        getLenis()?.start()
        botaoMenu.current?.focus()
      }
    }
  }, [menuAberto])

  const ir = (id: string) => {
    setMenuAberto(false)
    window.setTimeout(() => rolarPara(id), menuAberto ? 380 : 0)
  }

  return (
    <>
      <motion.header
        className="pointer-events-none fixed inset-x-0 top-0 z-50 flex justify-center px-3 pt-[max(0.75rem,env(safe-area-inset-top))] md:pt-4"
        initial={false}
        animate={{
          y: !visivel ? -90 : escondida ? -110 : 0,
          opacity: visivel && !escondida ? 1 : 0,
        }}
        transition={{ duration: reduzir ? 0 : 0.7, ease: EASE }}
      >
        <nav
          aria-label="Principal"
          className="pointer-events-auto relative flex w-full max-w-[1120px] items-center justify-between gap-2 rounded-full border border-white/[0.08] bg-[rgba(10,11,13,0.62)] py-2 pl-5 pr-2 shadow-[0_18px_50px_-20px_rgba(0,0,0,0.7)] backdrop-blur-xl backdrop-saturate-150 lg:w-auto"
        >
          <a
            href="#inicio"
            onClick={(e) => {
              e.preventDefault()
              ir('inicio')
            }}
            className="flex shrink-0 items-center rounded-full py-1"
            aria-label={`${SITE.nome}, voltar ao início`}
          >
            <img src={MARCA.monograma.src} alt="" width={MARCA.monograma.w} height={MARCA.monograma.h} className="h-[22px] w-auto md:h-6" />
          </a>

          <ul className="mx-4 hidden items-center gap-1 lg:flex">
            {NAV_ITEMS.map((item) => (
              <li key={item.id} className="relative">
                <button
                  type="button"
                  onClick={() => ir(item.id)}
                  className={`relative z-10 rounded-full px-4 py-2 text-[0.9rem] transition-colors duration-300 ${
                    ativo === item.id ? 'text-branco' : 'text-prata/80 hover:text-branco'
                  }`}
                >
                  {item.label}
                </button>
                {ativo === item.id && (
                  <motion.span
                    layoutId="pilula-nav"
                    className="absolute inset-0 rounded-full bg-white/[0.09]"
                    transition={{ type: 'spring', stiffness: 380, damping: 34 }}
                  />
                )}
              </li>
            ))}
          </ul>

          <div className="flex items-center gap-1.5">
            <a
              href={waLink(MENSAGENS.padrao)}
              target="_blank"
              rel="noopener noreferrer"
              data-magnetic="0.2"
              className="btn btn-claro btn-pequeno"
            >
              <IconeConversa />
              <span>Pedir análise</span>
            </a>
            <button
              ref={botaoMenu}
              type="button"
              onClick={() => setMenuAberto(true)}
              className="grid h-10 w-10 place-items-center rounded-full text-branco transition-colors hover:bg-white/10 lg:hidden"
              aria-label="Abrir menu"
              aria-expanded={menuAberto}
              aria-controls="menu-mobile"
            >
              <IconeMenu className="h-5 w-5" />
            </button>
          </div>

          {/* progresso da página desenhado na Linha */}
          <span aria-hidden="true" className="absolute inset-x-6 bottom-0 h-px overflow-hidden">
            <motion.span
              className="block h-full origin-left bg-linear-to-r from-aco via-branco to-aco"
              style={{ scaleX: scrollYProgress }}
            />
          </span>
        </nav>
      </motion.header>

      <AnimatePresence>
        {menuAberto && (
          <motion.div
            id="menu-mobile"
            role="dialog"
            aria-modal="true"
            aria-label="Menu"
            className="fixed inset-0 z-[70] flex flex-col bg-preto px-6 pb-[max(2rem,env(safe-area-inset-bottom))] pt-[max(1rem,env(safe-area-inset-top))]"
            initial={{ clipPath: 'inset(0% 0% 100% 0%)' }}
            animate={{ clipPath: 'inset(0% 0% 0% 0%)' }}
            exit={{ clipPath: 'inset(0% 0% 100% 0%)' }}
            transition={{ duration: reduzir ? 0 : 0.6, ease: EASE }}
          >
            <div className="flex items-center justify-between py-2">
              <img src={MARCA.monograma.src} alt="" className="h-6 w-auto" />
              <button
                type="button"
                onClick={() => setMenuAberto(false)}
                className="grid h-11 w-11 place-items-center rounded-full border border-white/15 text-branco"
                aria-label="Fechar menu"
              >
                <IconeFechar className="h-5 w-5" />
              </button>
            </div>

            <ul className="mt-14 flex flex-col">
              {NAV_ITEMS.map((item, i) => (
                <li key={item.id} className="overflow-hidden border-b border-white/[0.08]">
                  <motion.button
                    ref={i === 0 ? primeiroLink : undefined}
                    type="button"
                    onClick={() => ir(item.id)}
                    className="block w-full py-4 text-left font-display text-[2.6rem] leading-none tracking-[-0.02em] text-branco"
                    initial={{ y: '110%' }}
                    animate={{ y: '0%' }}
                    transition={{ duration: 0.8, ease: EASE, delay: 0.18 + i * 0.07 }}
                  >
                    {item.label}
                  </motion.button>
                </li>
              ))}
            </ul>

            <motion.div
              className="mt-auto flex flex-col gap-4"
              initial={{ opacity: 0, y: 16 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.7, ease: EASE, delay: 0.5 }}
            >
              <a href={waLink(MENSAGENS.padrao)} target="_blank" rel="noopener noreferrer" className="btn btn-claro btn-grande w-full">
                <IconeConversa />
                <span>Pedir análise no WhatsApp</span>
              </a>
              <p className="texto-miudo text-aco">
                {SITE.whatsappExibicao} <br />
                {SITE.email}
              </p>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  )
}
