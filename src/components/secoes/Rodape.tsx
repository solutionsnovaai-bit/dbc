import { NAV_ITEMS, SITE, waLink } from '../../lib/site'
import { MARCA } from '../../lib/fotos'
import { rolarPara } from '../../hooks/useSmoothScroll'
import { Conteiner, Linha } from '../Section'

export function Rodape() {
  const ano = new Date().getFullYear()

  return (
    <footer className="folha folha-preta" aria-label="Rodapé">
      <Conteiner className="pb-[max(2.5rem,env(safe-area-inset-bottom))] pt-20 md:pt-28">
        <div className="grid gap-12 md:grid-cols-2 lg:grid-cols-12 lg:gap-8">
          <div className="lg:col-span-4">
            <img
              src={MARCA.monograma.src}
              width={MARCA.monograma.w}
              height={MARCA.monograma.h}
              alt={MARCA.monograma.alt}
              loading="lazy"
              className="h-9 w-auto md:h-10"
            />
            <p className="texto-corpo mt-6 max-w-[20rem] text-prata">{SITE.slogan}</p>
          </div>

          <nav aria-label="Seções" className="lg:col-span-2">
            <p className="texto-miudo text-aco">Navegação</p>
            <ul className="mt-4 flex flex-col gap-2.5">
              {NAV_ITEMS.map((item) => (
                <li key={item.id}>
                  <button type="button" onClick={() => rolarPara(item.id)} className="link-linha text-left text-[0.95rem] text-prata hover:text-branco">
                    {item.label}
                  </button>
                </li>
              ))}
            </ul>
          </nav>

          <div className="lg:col-span-3">
            <p className="texto-miudo text-aco">Contato</p>
            <ul className="mt-4 flex flex-col gap-2.5 text-[0.95rem]">
              <li>
                <a href={waLink()} target="_blank" rel="noopener noreferrer" className="link-linha text-prata hover:text-branco">
                  WhatsApp <span className="whitespace-nowrap">{SITE.whatsappExibicao}</span>
                </a>
              </li>
              <li>
                <a href={`mailto:${SITE.email}`} className="link-linha break-all text-prata hover:text-branco">
                  {SITE.email}
                </a>
              </li>
              {SITE.instagram ? (
                <li>
                  <a href={SITE.instagram} target="_blank" rel="noopener noreferrer" className="link-linha text-prata hover:text-branco">
                    Instagram
                  </a>
                </li>
              ) : null}
            </ul>
          </div>

          <div className="lg:col-span-3">
            <p className="texto-miudo text-aco">Onde atuamos</p>
            <p className="mt-4 text-[0.95rem] leading-relaxed text-prata">São Paulo/SP e cidades que fazem divisa com a capital.</p>
          </div>
        </div>

        <Linha className="mt-16 text-white/10 md:mt-20" />

        <p className="texto-miudo mt-8 max-w-[78ch] text-aco">
          {SITE.razaoSocial}, CNPJ {SITE.cnpj}. Empresa Simples de Crédito nos termos da {SITE.lei}. Operamos exclusivamente com
          capital próprio e não captamos recursos de terceiros. Todo crédito está sujeito à análise.
        </p>

        <div className="texto-miudo mt-10 flex flex-col gap-2 text-aco md:flex-row md:items-center md:justify-between">
          <p>
            © {ano} {SITE.nome}
          </p>
          <p>
            Desenvolvido por <span className="tracking-[0.08em] text-prata">NOVA AI SOLUTIONS</span>
          </p>
        </div>
      </Conteiner>
    </footer>
  )
}
