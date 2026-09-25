import { useRef, useState } from 'react'
import { motion, useReducedMotion, useScroll, useTransform } from 'framer-motion'
import { EASE, MENSAGENS, waLink } from '../../lib/site'
import { MARCA } from '../../lib/fotos'
import { Conteiner, Folha, Titulo } from '../Section'
import { IconeWhatsApp } from '../icons'

export function CtaFinal() {
  const logo = useRef<HTMLDivElement>(null)
  const reduzir = useReducedMotion()
  const { scrollYProgress } = useScroll({ target: logo, offset: ['start end', 'end end'] })
  const y = useTransform(scrollYProgress, [0, 1], [90, 0])
  const reflexo = useTransform(scrollYProgress, [0, 1], ['120% 0%', '-20% 0%'])
  const mascara = `url(${MARCA.mascaraLogo.src})`
  const [desktop] = useState(() => window.matchMedia('(min-width: 1024px) and (pointer: fine)').matches)

  return (
    <Folha id="contato" tom="escura" rotulo="Pedir análise">
      <Conteiner className="pt-28 md:pt-40">
        <div className="grid gap-10 lg:grid-cols-12 lg:items-end">
          <Titulo
            linhas={['Quem investe', 'cresce.']}
            className="font-display text-[clamp(3.1rem,6.6vw,7rem)] leading-[0.95] tracking-[-0.03em] lg:col-span-7"
          />
          <motion.div
            className="lg:col-span-5"
            initial={reduzir ? false : { opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: '0px 0px -10% 0px' }}
            transition={{ duration: 1, ease: EASE, delay: 0.2 }}
          >
            <p className="texto-corpo max-w-[28rem] text-prata">
              Se você tem uma empresa e quer crescer, conte com quem acredita no seu potencial.
            </p>
            <a
              href={waLink(MENSAGENS.final)}
              target="_blank"
              rel="noopener noreferrer"
              data-magnetic="0.25"
              className="btn btn-claro btn-grande mt-8 w-full sm:w-auto"
            >
              <IconeWhatsApp />
              <span>Pedir análise no WhatsApp</span>
            </a>
            <p className="texto-miudo mt-5 text-aco">Crédito sujeito à análise. Exclusivo para empresas com CNPJ.</p>
          </motion.div>
        </div>
      </Conteiner>

      {/* logo gigante em ônix, sempre inteiro */}
      <Conteiner className="pb-[calc(var(--radius-folha)+4.5rem)] pt-20 md:pb-[calc(var(--radius-folha)+7rem)] md:pt-28">
        <motion.div
          ref={logo}
          role="img"
          aria-label="DBC Du Binho Cred's, Empresa Simples de Crédito"
          className="mx-auto aspect-[1064/487] w-full max-w-[1180px] will-change-transform"
          style={{
            WebkitMaskImage: mascara,
            maskImage: mascara,
            WebkitMaskSize: '100% 100%',
            maskSize: '100% 100%',
            WebkitMaskRepeat: 'no-repeat',
            maskRepeat: 'no-repeat',
            backgroundImage:
              'linear-gradient(105deg, rgba(255,255,255,0) 42%, rgba(255,255,255,0.85) 50%, rgba(255,255,255,0) 58%), linear-gradient(165deg, #f4f5f7 0%, #8b9098 36%, #e3e5e8 58%, #6f747c 100%)',
            backgroundSize: '260% 100%, 100% 100%',
            backgroundRepeat: 'no-repeat',
            backgroundPosition: '50% 0%',
            ...(reduzir ? {} : desktop ? { y, backgroundPosition: reflexo } : { y }),
          }}
        />
      </Conteiner>
    </Folha>
  )
}
