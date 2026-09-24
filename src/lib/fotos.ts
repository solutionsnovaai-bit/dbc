/**
 * Catálogo de imagens. Cada asset novo entra em /public/img com as larguras 760 e 1400
 * (ex.: ramos/beleza-760.webp e ramos/beleza-1400.webp) e vira uma linha aqui com foto().
 * Enquanto um item estiver null, o site mostra a versão desenhada (ícone em metal).
 */
export type Foto = {
  src: string
  srcSet: string
  w: number
  h: number
  alt: string
}

/**
 * Monta o srcset a partir do nome base em /public/img.
 * w e h são as medidas do original; os arquivos são gerados em 760 e na maior largura até 1400
 * (ex.: capitulos/analise-760.webp e capitulos/analise-1122.webp).
 */
export function foto(nome: string, w: number, h: number, alt: string): Foto {
  const maior = Math.min(w, 1400)
  const altura = Math.round((h * maior) / w)
  return {
    src: `/img/${nome}-${maior}.webp`,
    srcSet: maior > 760 ? `/img/${nome}-760.webp 760w, /img/${nome}-${maior}.webp ${maior}w` : `/img/${nome}-${maior}.webp ${maior}w`,
    w: maior,
    h: altura,
    alt,
  }
}

export const HERO = {
  // Mesma condição usada no <picture> e no CSS do hero.
  mediaDesktop: '(min-width: 1024px) and (min-aspect-ratio: 5/4)',
  desktop: {
    src: '/img/hero-desktop-1400.webp',
    srcSet: '/img/hero-desktop-760.webp 760w, /img/hero-desktop-1400.webp 1400w, /img/hero-desktop-1672.webp 1672w',
    w: 1672,
    h: 941,
  },
  mobile: {
    src: '/img/hero-mobile-760.webp',
    srcSet: '/img/hero-mobile-760.webp 760w, /img/hero-mobile-941.webp 941w',
    w: 941,
    h: 1672,
  },
  alt: "Logo DBC Du Binho Cred's em metal escovado sobre piso preto espelhado",
} as const

export const MARCA = {
  /** Logo completo texturizado, fundo transparente (1438 x 683). */
  logo: {
    src: '/img/logo-dbc-1400.webp',
    srcSet: '/img/logo-dbc-760.webp 760w, /img/logo-dbc-1400.webp 1438w',
    w: 1438,
    h: 683,
    alt: "DBC Du Binho Cred's, Empresa Simples de Crédito",
  },
  /** Só o monograma com a linha, para a navbar e o rodapé (520 x 155). */
  monograma: { src: '/img/monograma-dbc.webp', w: 520, h: 155, alt: "DBC Du Binho Cred's" },
  /** Máscaras do logo original (branco + alfa), usadas para pintar o logo com qualquer material. */
  mascaraLogo: { src: '/img/logo-mask.png', w: 1064, h: 487 },
  mascaraMonograma: { src: '/img/monograma-mask.png', w: 1064, h: 295 },
  /** Faixas horizontais do logo texturizado, em % da altura, para montar o loader em camadas. */
  camadas: {
    monograma: [4.25, 53.29],
    linha: [53.88, 59.15],
    nome: [59.74, 73.79],
    tagline: [82.58, 95.02],
  },
} as const

export type Ramo = {
  id: string
  nome: string
  frase: string
  icone: 'tesoura' | 'formao' | 'chave' | 'faca' | 'colher' | 'sineta'
  foto: Foto | null
}

export const RAMOS: Ramo[] = [
  { id: 'beleza', nome: 'Beleza', frase: 'Cadeira nova, agenda cheia.', icone: 'tesoura', foto: null },
  { id: 'marcenaria', nome: 'Marcenaria', frase: 'Máquina nova, prazo menor.', icone: 'formao', foto: null },
  { id: 'oficina', nome: 'Oficina', frase: 'Equipamento novo, mais carro por dia.', icone: 'chave', foto: null },
  { id: 'gastronomia', nome: 'Gastronomia', frase: 'Cozinha maior, mais pedido saindo.', icone: 'faca', foto: null },
  { id: 'construcao', nome: 'Construção', frase: 'Obra andando, cliente indicando.', icone: 'colher', foto: null },
  { id: 'comercio', nome: 'Comércio', frase: 'Estoque cheio na hora certa.', icone: 'sineta', foto: null },
]

export const PASSOS_FOTOS: { analise: Foto | null; garantias: Foto | null; contrato: Foto | null } = {
  analise: null,
  garantias: null,
  contrato: null,
}

/** Vídeo do cofre abrindo (scroll). Quando chegar: { mp4: '/video/cofre.mp4', poster: '/img/cofre-poster.webp' } */
export const COFRE: { mp4: string; poster?: string } | null = null

/** Medalha DBC fotografada. Enquanto null, o card usa a moeda desenhada em CSS. */
export const MEDALHA: Foto | null = null

/* ------------------------------------------------------------
   CAPÍTULOS: stills que travam no scroll com texto surgindo
   foco = object-position (onde a imagem não pode ser cortada)
   ------------------------------------------------------------ */
export type Capitulo = {
  id: string
  kicker: string
  titulo: [string, string]
  texto: string
  foto: Foto
  foco: string
}

export const CAPITULOS: Capitulo[] = [
  {
    id: 'atendimento',
    kicker: 'Atendimento',
    titulo: ['Crédito é', 'assunto sério.'],
    texto: 'Por isso o atendimento é personalizado, do primeiro contato ao contrato assinado.',
    foto: foto('capitulos/atendimento', 1648, 2048, 'Recepção ampla com parede de mármore escuro, madeira e luz quente'),
    foco: '58% 50%',
  },
  {
    id: 'analise',
    kicker: 'Análise',
    titulo: ['Análise de gente,', 'não de planilha.'],
    texto: 'Cada operação é avaliada conforme o perfil do cliente.',
    foto: foto('capitulos/analise', 1122, 1402, 'Aperto de mão sobre uma mesa de mármore preto'),
    foco: '42% 45%',
  },
  {
    id: 'exclusivo',
    kicker: 'Exclusividade',
    titulo: ['Exclusivo para', 'quem tem CNPJ.'],
    texto: 'Crédito para MEI, microempresa e empresa de pequeno porte, com capital próprio da DBC.',
    foto: foto('capitulos/exclusivo', 1122, 1402, 'Mão segurando um cartão preto com o logo DBC'),
    foco: '45% 42%',
  },
  {
    id: 'crescimento',
    kicker: 'Crescimento',
    titulo: ['Crédito na', 'hora certa.'],
    texto: 'Planejamento, responsabilidade e o crédito certo para a sua empresa dar o próximo passo.',
    foto: foto('capitulos/crescimento', 1648, 2048, 'Empresário de braços cruzados em frente à sua loja ao pôr do sol'),
    foco: '46% 30%',
  },
]

/* ------------------------------------------------------------
   CONQUISTAS: carrossel que anda sozinho
   ------------------------------------------------------------ */
export type Conquista = { id: string; legenda: string; foto: Foto; foco: string }

export const CONQUISTAS: Conquista[] = [
  {
    id: 'casa',
    legenda: 'A casa nova.',
    foto: foto('conquistas/casa', 1448, 1086, 'Casa moderna com piscina iluminada ao anoitecer'),
    foco: '55% 50%',
  },
  {
    id: 'chaves',
    legenda: 'As chaves na mão.',
    foto: foto('conquistas/chaves', 1448, 1086, 'Chaves sobre a bancada de um apartamento novo'),
    foco: '30% 70%',
  },
  {
    id: 'carro',
    legenda: 'O carro novo.',
    foto: foto('conquistas/bmw', 1448, 1086, 'Farol de LED de um sedã preto na chuva, à noite'),
    foco: '45% 50%',
  },
  {
    id: 'viagem',
    legenda: 'A viagem que não fica mais para depois.',
    foto: foto('conquistas/viagem', 1448, 1086, 'Asa do avião sobre as nuvens vista pela janela ao pôr do sol'),
    foco: '55% 50%',
  },
  {
    id: 'garagem',
    legenda: 'A garagem que você imaginou.',
    foto: foto('conquistas/mercedes', 1448, 1086, 'Sedã preto de luxo parado em uma garagem de concreto'),
    foco: '55% 55%',
  },
  {
    id: 'destinos',
    legenda: 'Os próximos destinos.',
    foto: foto('conquistas/destinos', 960, 720, 'Mala de couro ao lado de uma poltrona na sala de espera do aeroporto'),
    foco: '38% 60%',
  },
  {
    id: 'jetski',
    legenda: 'O fim de semana merecido.',
    foto: foto('conquistas/jetski', 1448, 1086, 'Jet ski cortando o mar ao pôr do sol'),
    foco: '40% 50%',
  },
]
