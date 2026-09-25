import type { SVGProps } from 'react'
import { ICONE_WHATSAPP } from '../lib/site'

/**
 * Ícones próprios, 24x24, traço 1.5. Nada de biblioteca.
 * metal={true} pinta o traço com o gradiente prata definido em <DefsMetal />.
 */
type Props = SVGProps<SVGSVGElement> & { metal?: boolean; titulo?: string }

function Base({ metal, titulo, children, strokeWidth = 1.5, ...rest }: Props) {
  return (
    <svg
      viewBox="0 0 24 24"
      fill="none"
      stroke={metal ? 'url(#dbc-metal)' : 'currentColor'}
      strokeWidth={strokeWidth}
      strokeLinecap="round"
      strokeLinejoin="round"
      aria-hidden={titulo ? undefined : true}
      role={titulo ? 'img' : undefined}
      {...rest}
    >
      {titulo ? <title>{titulo}</title> : null}
      {children}
    </svg>
  )
}

/** Gradiente prata usado pelos ícones com metal. Renderizado uma vez no App. */
export function DefsMetal() {
  return (
    <svg width="0" height="0" aria-hidden="true" style={{ position: 'absolute' }}>
      <defs>
        <linearGradient id="dbc-metal" gradientUnits="userSpaceOnUse" x1="2" y1="3" x2="22" y2="21">
          <stop offset="0" stopColor="#8B9098" />
          <stop offset="0.38" stopColor="#F4F5F7" />
          <stop offset="0.56" stopColor="#9EA3AB" />
          <stop offset="0.78" stopColor="#FFFFFF" />
          <stop offset="1" stopColor="#7D828A" />
        </linearGradient>
      </defs>
    </svg>
  )
}

export const IconeConversa = (p: Props) => (
  <Base {...p}>
    <path d="M20 11.5c0 4.14-3.8 7.5-8.5 7.5-1.14 0-2.23-.2-3.22-.56L4 19.5l1.3-3.34C4.48 14.87 4 13.24 4 11.5 4 7.36 7.8 4 12.5 4S20 7.36 20 11.5Z" />
    <path d="M8.9 11.6h.01M12.1 11.6h.01M15.3 11.6h.01" strokeWidth={2.2} />
  </Base>
)

export const IconeSeta = (p: Props) => (
  <Base {...p}>
    <path d="M4.5 12h15M13.5 6l6 6-6 6" />
  </Base>
)

export const IconeSetaBaixo = (p: Props) => (
  <Base {...p}>
    <path d="M12 4.5v15M6 13.5l6 6 6-6" />
  </Base>
)

export const IconePausa = (p: Props) => (
  <Base {...p}>
    <path d="M9 6v12M15 6v12" strokeWidth={2} />
  </Base>
)

export const IconePlay = (p: Props) => (
  <Base {...p}>
    <path d="M8 5.5v13l10.5-6.5L8 5.5Z" />
  </Base>
)

export const IconeCheck = (p: Props) => (
  <Base {...p}>
    <path d="M5 12.5l4.2 4.2L19 7" />
  </Base>
)

export const IconeMais = (p: Props) => (
  <Base {...p}>
    <path d="M12 5v14M5 12h14" />
  </Base>
)

export const IconeFechar = (p: Props) => (
  <Base {...p}>
    <path d="M6 6l12 12M18 6 6 18" />
  </Base>
)

/** Duas linhas: o menu também é feito da Linha do logo. */
export const IconeMenu = (p: Props) => (
  <Base {...p}>
    <path d="M4 9h16M4 15h16" />
  </Base>
)

export const IconeEscudo = (p: Props) => (
  <Base {...p}>
    <path d="M12 3.2 19 6v5.4c0 4.4-3 8.1-7 9.4-4-1.3-7-5-7-9.4V6l7-2.8Z" />
    <path d="M9 11.8l2.1 2.1 4.1-4.1" />
  </Base>
)

export const IconeCadeado = (p: Props) => (
  <Base {...p}>
    <rect x="5" y="10.5" width="14" height="10" rx="2.2" />
    <path d="M8 10.5V7.8a4 4 0 0 1 8 0v2.7M12 14.4v2.4" />
  </Base>
)

export const IconeDocumento = (p: Props) => (
  <Base {...p}>
    <path d="M7 3.5h6.8L18 7.7v12.8H7z" />
    <path d="M13.5 3.5V8H18M9.8 12h5.2M9.8 15h5.2M9.8 18h3" />
  </Base>
)

export const IconeTransferencia = (p: Props) => (
  <Base {...p}>
    <path d="M4 8.5h14.5M15 5l3.5 3.5L15 12M20 15.5H5.5M9 12l-3.5 3.5L9 19" />
  </Base>
)

export const IconePino = (p: Props) => (
  <Base {...p}>
    <path d="M12 21s-6.5-5.5-6.5-11a6.5 6.5 0 0 1 13 0c0 5.5-6.5 11-6.5 11Z" />
    <circle cx="12" cy="10" r="2.3" />
  </Base>
)

export const IconeLupa = (p: Props) => (
  <Base {...p}>
    <circle cx="10.5" cy="10.5" r="6" />
    <path d="M15 15l5 5" />
  </Base>
)

export const IconeCaneta = (p: Props) => (
  <Base {...p}>
    <path d="M8 3h8l1.2 6.5L12 21 6.8 9.5 8 3Z" />
    <path d="M12 21v-8.4" />
    <circle cx="12" cy="11.4" r="1.2" />
  </Base>
)

export const IconeTesoura = (p: Props) => (
  <Base {...p}>
    <circle cx="6.5" cy="17.5" r="2.6" />
    <circle cx="17.5" cy="17.5" r="2.6" />
    <path d="M8.4 15.6 18.6 4M15.6 15.6 5.4 4" />
  </Base>
)

export const IconeFormao = (p: Props) => (
  <Base {...p}>
    <rect x="9" y="2.5" width="6" height="8.5" rx="2.4" />
    <path d="M9.8 11h4.4v1.8H9.8zM10.6 12.8h2.8V19L12 21.5 10.6 19z" />
  </Base>
)

export const IconeChave = (p: Props) => (
  <Base {...p}>
    <path d="M8.1 17.7l9.6-9.6M6.3 15.9l9.6-9.6" />
    <circle cx="5.6" cy="18.4" r="3" />
    <circle cx="5.6" cy="18.4" r="1.2" />
    <path d="M15.9 6.3a3.3 3.3 0 0 1 .2-2.9l1.9 1.9 1.6-.3.3-1.6-1.9-1.9a3.3 3.3 0 0 1 2.9 4.9 3.3 3.3 0 0 1-3.2 1.7" />
  </Base>
)

export const IconeFaca = (p: Props) => (
  <Base {...p}>
    <path d="M8.3 13.7 20 4q-2.8 8.4-9.7 11.7Z" />
    <path d="M8.9 15.1 4.3 19.7" strokeWidth={2.6} />
  </Base>
)

export const IconeColher = (p: Props) => (
  <Base {...p}>
    <path d="M20.5 3.5 9.8 8.3l2.1 3.8 3.8 2.1Z" />
    <path d="M13 13.4 10.2 14" />
    <path d="M10.2 14 4.6 19.6" strokeWidth={2.6} />
  </Base>
)

export const IconeSineta = (p: Props) => (
  <Base {...p}>
    <path d="M4 17.5h16M5.8 17.5a6.2 6.2 0 0 1 12.4 0M12 11.3V9.5M10.3 9.5h3.4M3 20.5h18" />
  </Base>
)

export const ICONES_RAMO = {
  tesoura: IconeTesoura,
  formao: IconeFormao,
  chave: IconeChave,
  faca: IconeFaca,
  colher: IconeColher,
  sineta: IconeSineta,
} as const

/** Ícone do WhatsApp numa cor só (a cor do texto em volta). Tamanho padrão igual aos ícones dos botões. */
export function IconeWhatsApp({ className = 'h-[1.2rem] w-[1.2rem]' }: { className?: string }) {
  const mascara = `url(${ICONE_WHATSAPP.mono})`
  return (
    <span
      aria-hidden="true"
      className={`inline-block shrink-0 bg-current ${className}`}
      style={{
        WebkitMaskImage: mascara,
        maskImage: mascara,
        WebkitMaskSize: 'contain',
        maskSize: 'contain',
        WebkitMaskRepeat: 'no-repeat',
        maskRepeat: 'no-repeat',
        WebkitMaskPosition: 'center',
        maskPosition: 'center',
      }}
    />
  )
}
