import { useId, useState } from 'react'
import { AnimatePresence, motion } from 'framer-motion'
import { EASE, MENSAGENS, SITE, VIZINHAS, waLink } from '../../lib/site'
import { Conteiner, Folha, Linha, Titulo } from '../Section'
import { IconeConversa, IconeEscudo, IconeMais } from '../icons'

const listaVizinhas = `${VIZINHAS.slice(0, -1).join(', ')} e ${VIZINHAS[VIZINHAS.length - 1]}`

const PERGUNTAS = [
  {
    p: 'Quem pode pedir crédito na DBC?',
    r: 'Empresas com CNPJ enquadradas como MEI, microempresa ou empresa de pequeno porte, com sede em São Paulo ou nas cidades que fazem divisa com a capital.',
  },
  {
    p: 'Pessoa física pode pedir?',
    r: 'Não. Por lei, a Empresa Simples de Crédito só empresta para empresas: MEI, microempresa e empresa de pequeno porte.',
  },
  {
    p: 'Tem tarifa de cadastro ou de abertura?',
    r: 'Não. A lei só permite que a Empresa Simples de Crédito cobre juros. Nada de tarifa de cadastro, de abertura ou de manutenção. Tudo fica claro no contrato antes de você assinar.',
  },
  {
    p: 'Preciso apresentar garantia?',
    r: 'Depende do perfil de cada operação. Depois da análise, podemos pedir garantias, como avalistas.',
  },
  {
    p: 'Como o dinheiro chega até a minha empresa?',
    r: 'Sempre por transferência da conta da DBC direto para a conta da sua empresa. Nunca em dinheiro vivo e nunca em conta de terceiros.',
  },
  {
    p: 'Em quanto tempo sai a resposta?',
    r: 'A análise é rápida. Assim que você mandar os dados da sua empresa pelo WhatsApp, a gente começa a avaliar o seu caso e te dá o retorno.',
  },
  {
    p: 'Quais documentos preciso enviar?',
    r: 'Depende do perfil da empresa. Chama a gente no WhatsApp que passamos a lista certa para o seu caso.',
  },
  {
    p: 'Empresa com restrição pode pedir?',
    r: 'Cada caso é analisado individualmente. Conta para a gente a sua situação no WhatsApp.',
  },
  {
    p: 'Vocês atendem a minha cidade?',
    r: `Atendemos empresas de São Paulo e das cidades que fazem divisa com a capital, como ${listaVizinhas}. A lei das Empresas Simples de Crédito limita a atuação ao município da sede e aos municípios vizinhos.`,
  },
]

export function Duvidas() {
  const [aberta, setAberta] = useState<number | null>(0)
  const base = useId().replace(/:/g, '')

  return (
    <Folha id="duvidas" tom="preta" rotulo="Dúvidas">
      <Conteiner className="pb-40 pt-32 md:pb-52 md:pt-44">
        <Titulo linhas={['Perguntas diretas,', 'respostas diretas.']} />
        <div className="mt-14 grid gap-14 md:mt-20 lg:grid-cols-12 lg:gap-10">
          <div className="lg:col-span-4">
            <div className="lg:sticky lg:top-28">
              <aside className="rounded-[1.75rem] border border-white/[0.1] bg-grafite/70 p-7 md:p-8" aria-label="Aviso contra golpes">
                <IconeEscudo metal strokeWidth={1.2} className="h-10 w-10" />
                <p className="titulo-card mt-5 text-branco">A DBC nunca pede depósito antecipado.</p>
                <p className="texto-corpo mt-3 text-prata">
                  O crédito sai sempre da conta da DBC direto para a conta da sua empresa. Se alguém pedir pagamento em nosso nome para
                  liberar crédito, é golpe.
                </p>
                <a
                  href={waLink(MENSAGENS.golpe)}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="mt-6 inline-flex items-center gap-2.5 text-[0.95rem] text-branco"
                >
                  <IconeConversa className="h-4 w-4 shrink-0" />
                  <span className="link-linha">
                    Confirmar no WhatsApp oficial <span className="whitespace-nowrap">{SITE.whatsappExibicao}</span>
                  </span>
                </a>
              </aside>
            </div>
          </div>

          <div className="lg:col-span-8 lg:col-start-5 lg:pl-6">
            <Linha className="text-white/15" />
            <ul>
              {PERGUNTAS.map((item, i) => {
                const estaAberta = aberta === i
                const idBotao = `${base}-b-${i}`
                const idPainel = `${base}-p-${i}`
                return (
                  <li key={item.p} className="border-b border-white/[0.1]">
                    <h3>
                      <button
                        id={idBotao}
                        type="button"
                        aria-expanded={estaAberta}
                        aria-controls={idPainel}
                        onClick={() => setAberta(estaAberta ? null : i)}
                        className="group flex w-full items-center justify-between gap-6 py-6 text-left md:py-7"
                      >
                        <span className="font-display text-[clamp(1.3rem,2.1vw,1.7rem)] leading-[1.18] tracking-[-0.01em] text-branco">
                          {item.p}
                        </span>
                        <span
                          aria-hidden="true"
                          className={`grid h-10 w-10 shrink-0 place-items-center rounded-full border transition-colors duration-300 ${
                            estaAberta ? 'border-branco bg-branco text-preto' : 'border-white/20 text-branco group-hover:border-white/60'
                          }`}
                        >
                          <IconeMais className={`h-4 w-4 transition-transform duration-500 ease-lux ${estaAberta ? 'rotate-45' : ''}`} />
                        </span>
                      </button>
                    </h3>
                    <AnimatePresence initial={false}>
                      {estaAberta && (
                        <motion.div
                          id={idPainel}
                          role="region"
                          aria-labelledby={idBotao}
                          className="overflow-hidden"
                          initial={{ height: 0, opacity: 0 }}
                          animate={{ height: 'auto', opacity: 1 }}
                          exit={{ height: 0, opacity: 0 }}
                          transition={{ duration: 0.55, ease: EASE }}
                        >
                          <p className="texto-corpo max-w-[60ch] pb-7 pr-14 text-prata">{item.r}</p>
                        </motion.div>
                      )}
                    </AnimatePresence>
                  </li>
                )
              })}
            </ul>
          </div>
        </div>
      </Conteiner>
    </Folha>
  )
}
