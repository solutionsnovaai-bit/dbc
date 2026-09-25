import { Helmet } from 'react-helmet-async'
import { SITE, VIZINHAS } from '../lib/site'

const TITULO = "DBC Du Binho Cred's | Crédito para MEI e pequenas empresas em São Paulo"
const DESCRICAO =
  'Empresa Simples de Crédito com capital próprio. Crédito para MEI, micro e pequenas empresas de São Paulo e cidades vizinhas, sem tarifas e com atendimento personalizado.'
const TITULO_SOCIAL = "DBC Du Binho Cred's | Empresa Simples de Crédito"
const DESCRICAO_SOCIAL =
  'Crédito com capital próprio para MEI, micro e pequenas empresas de São Paulo. Sem tarifas e com análise do seu negócio.'

const w = SITE.whatsapp
const TELEFONE = `+${w.slice(0, 2)} ${w.slice(2, 4)} ${w.slice(4, 9)}-${w.slice(9)}`

export function Seo() {
  const url = SITE.url
  const imagem = `${url}/og-dbc.jpg`

  const jsonLd = {
    '@context': 'https://schema.org',
    '@type': 'FinancialService',
    name: SITE.nome,
    legalName: SITE.razaoSocial,
    taxID: SITE.cnpj,
    description: DESCRICAO,
    slogan: SITE.slogan,
    url: `${url}/`,
    logo: `${url}/icon-512.png`,
    image: imagem,
    email: SITE.email,
    telephone: TELEFONE,
    address: {
      '@type': 'PostalAddress',
      addressLocality: SITE.cidade,
      addressRegion: SITE.uf,
      addressCountry: 'BR',
    },
    areaServed: [{ '@type': 'City', name: SITE.cidade }, ...VIZINHAS.map((name) => ({ '@type': 'City', name }))],
    ...(SITE.instagram ? { sameAs: [SITE.instagram] } : {}),
  }

  return (
    <Helmet htmlAttributes={{ lang: 'pt-BR' }}>
      <title>{TITULO}</title>
      <meta name="description" content={DESCRICAO} />
      <link rel="canonical" href={`${url}/`} />

      <meta property="og:type" content="website" />
      <meta property="og:locale" content="pt_BR" />
      <meta property="og:site_name" content={SITE.nome} />
      <meta property="og:title" content={TITULO_SOCIAL} />
      <meta property="og:description" content={DESCRICAO_SOCIAL} />
      <meta property="og:url" content={`${url}/`} />
      <meta property="og:image" content={imagem} />
      <meta property="og:image:width" content="1200" />
      <meta property="og:image:height" content="630" />
      <meta property="og:image:alt" content="Logo DBC Du Binho Cred's em metal sobre fundo preto" />

      <meta name="twitter:card" content="summary_large_image" />
      <meta name="twitter:title" content={TITULO_SOCIAL} />
      <meta name="twitter:description" content={DESCRICAO_SOCIAL} />
      <meta name="twitter:image" content={imagem} />

      <script type="application/ld+json">{JSON.stringify(jsonLd)}</script>
    </Helmet>
  )
}
