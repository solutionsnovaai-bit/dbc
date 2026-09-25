/**
 * Tudo que é dado da empresa mora aqui. Trocou telefone, e-mail ou horário? Só aqui.
 */
export const SITE = {
  nome: "DBC Du Binho Cred's",
  // Confira no cartão CNPJ: a LC 167/2019 exige "Empresa Simples de Crédito" no nome empresarial.
  razaoSocial: 'Du Binho Creds LTDA',
  cnpj: '43.487.282/0001-06',
  cidade: 'São Paulo',
  uf: 'SP',
  email: 'rubens.rosario@hotmail.com',
  // Número que o próprio cliente usou no filme. Confirmar antes de publicar.
  whatsapp: '5511917427750',
  whatsappExibicao: '(11) 91742-7750',
  instagram: '', // ex.: 'https://www.instagram.com/usuario' (vazio = não aparece)
  url: (import.meta.env.VITE_SITE_URL ?? '').replace(/\/$/, ''),
  slogan: 'Soluções inteligentes para impulsionar empresas.',
  lei: 'Lei Complementar nº 167/2019',
} as const

/** Cidades que fazem divisa com a capital, usadas como exemplo na copy. */
export const VIZINHAS = [
  'Guarulhos',
  'Osasco',
  'Santo André',
  'São Bernardo do Campo',
  'São Caetano do Sul',
  'Diadema',
  'Taboão da Serra',
] as const

/** Horário de atendimento no fuso de São Paulo (0 = domingo). Confirmar com o cliente. */
export const HORARIO = { dias: [1, 2, 3, 4, 5], inicio: 9, fim: 18 } as const

/**
 * Ícone oficial do WhatsApp recolorido nas cores da DBC (a partir do arquivo oficial):
 * cor = balão preto, anel prata e telefone branco (botão flutuante);
 * mono = anel + telefone numa cor só, pintado com a cor do texto (botões).
 */
export const ICONE_WHATSAPP = { cor: '/img/whatsapp-dbc.webp', mono: '/img/whatsapp-mono.png' } as const

export const MENSAGENS = {
  padrao: 'Olá! Vim pelo site da DBC e quero pedir uma análise de crédito para a minha empresa.',
  hero: 'Olá! Vim pelo site da DBC e quero pedir uma análise de crédito para a minha empresa.',
  final: 'Olá! Quero pedir uma análise de crédito para a minha empresa. Pode me ajudar?',
  ramo: (ramo: string) =>
    `Olá! Tenho uma empresa do ramo de ${ramo.toLowerCase()} e quero pedir uma análise de crédito.`,
  outroRamo: 'Olá! Meu ramo não aparece no site, mas tenho CNPJ. Posso pedir uma análise de crédito?',
  golpe: 'Olá! Recebi uma cobrança em nome da DBC e quero confirmar se é verdadeira.',
} as const

export function waLink(mensagem: string = MENSAGENS.padrao) {
  return `https://wa.me/${SITE.whatsapp}?text=${encodeURIComponent(mensagem)}`
}

export const NAV_ITEMS = [
  { id: 'para-quem', label: 'Para quem' },
  { id: 'como-funciona', label: 'Como funciona' },
  { id: 'seguranca', label: 'Segurança' },
  { id: 'duvidas', label: 'Dúvidas' },
] as const

export const EASE = [0.22, 1, 0.36, 1] as const

/** Está dentro do horário de atendimento agora (fuso de São Paulo)? */
export function dentroDoHorario(agora: Date = new Date()) {
  const partes = new Intl.DateTimeFormat('en-US', {
    timeZone: 'America/Sao_Paulo',
    weekday: 'short',
    hour: 'numeric',
    hourCycle: 'h23',
  }).formatToParts(agora)
  const dias = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat']
  const dia = dias.indexOf(partes.find((p) => p.type === 'weekday')?.value ?? '')
  const hora = Number(partes.find((p) => p.type === 'hour')?.value ?? -1) % 24
  return (HORARIO.dias as readonly number[]).includes(dia) && hora >= HORARIO.inicio && hora < HORARIO.fim
}
