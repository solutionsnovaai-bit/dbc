# DBC Du Binho Cred's — site institucional

Vite 6 + React 18 + TypeScript + Tailwind v4 + Framer Motion 11, com Lenis (scroll com inércia no desktop) e react-helmet-async.

```bash
npm install
npm run dev       # http://localhost:5173
npm run build     # checa tipos e gera /dist
npm run preview   # serve o /dist localmente
```

---

## Antes de publicar (checklist)

| Onde | O que conferir |
| --- | --- |
| `.env` | `VITE_SITE_URL` com o domínio final, sem barra no fim. Ele alimenta canonical, OG e Twitter do `index.html` e o JSON-LD. |
| `src/lib/site.ts` | **WhatsApp** (hoje `(11) 91742-7750`, tirado do filme — confirmar), **horário** de atendimento (hoje seg–sex, 9h–18h, só controla o "Online agora" do botão flutuante), **razão social** exatamente como no cartão CNPJ, **Instagram** (vazio = não aparece). |
| `public/img/whatsapp-dbc.webp` e `whatsapp-mono.png` | Ícone oficial do WhatsApp recolorido nas cores da DBC (balão preto, anel prata, telefone branco) e a versão de uma cor usada nos botões. |
| `index.html` | O `<noscript>` também mostra o WhatsApp. Se trocar o número, troque lá também. |
| `src/lib/site.ts` → `VIZINHAS` | Cidades citadas como exemplo de atuação. Todas fazem divisa com a capital. Não coloque cidades que não fazem divisa. |
| Vercel | Adicione `VITE_SITE_URL` em *Settings → Environment Variables* se preferir não usar o `.env` do repositório. |

### Regras da LC 167/2019 que o site respeita (não mudar sem falar com o contador/advogado do cliente)

- **Nada da palavra "banco"** em nenhum texto de divulgação (art. 2º, §1º). Inclui bordões, alt de imagem e posts.
- **Área de atuação:** só o município da sede e os que fazem divisa com ele (art. 1º). Atuar fora disso é crime (art. 9º). Por isso o site fala em "São Paulo e cidades vizinhas" e **não** em "Brasil todo".
- **Só juros:** nada de tarifa ou encargo (art. 5º). Por isso o card "R$ 0,00".
- **Só empresas:** MEI, ME e EPP. Pessoa física não.
- Dinheiro só de conta da ESC para conta da empresa; contrato em instrumento próprio com cópia ao cliente; operação registrada em entidade registradora.

---

## Onde fica cada coisa

```
src/
  lib/site.ts          dados da empresa, mensagens do WhatsApp, menu, horário
  lib/fotos.ts         catálogo de imagens (heros, logo, e os assets que ainda vão chegar)
  hooks/               Lenis, atividade de cena (pausa loops fora da tela), botões magnéticos
  components/
    Loader.tsx         contador 000-100 na Linha, logo montado sobre ela e tela abrindo ao meio
                       (roda em toda visita; para 1x por sessão, UMA_VEZ_POR_SESSAO = true)
    Navbar.tsx         cápsula com blur, pílula animada, progresso na Linha, menu mobile
    Hero.tsx           heros desktop/mobile, luz que segue o cursor, parallax
    Faixa.tsx          faixas corridas (tons preta, clara e metal)
    FaixaGigante.tsx   palavras gigantes que aceleram e invertem com o scroll
    FaixaCruzada.tsx   duas faixas cruzadas em X, em sentidos opostos
    Section.tsx        Folha, Conteiner, Kicker, Titulo, Linha
    Palavras.tsx       texto que acende palavra por palavra no scroll
    WhatsAppFab.tsx    botão flutuante
    Seo.tsx            title, OG, Twitter e JSON-LD (FinancialService)
    icons.tsx          ícones próprios (troque IconeConversa pelo ícone oficial do WhatsApp se quiser)
    secoes/            Manifesto, Capitulos, ComoFunciona, ParaQuem, CreditoLiberado, Conquistas,
                       SimplesSeria, Duvidas, CtaFinal, Rodape
public/
  img/                 heros em srcset (760/1400/1672), logo texturizado, máscaras do logo
  img/capitulos/       4 stills que travam no scroll (atendimento, análise, exclusivo, crescimento)
  img/conquistas/      7 fotos do carrossel automático (casa, chaves, carro, viagem, garagem, destinos, jet ski)
  og-dbc.jpg           1200x630 para WhatsApp/Instagram/Facebook
```

---

## Seções com foto

- **Capítulos** (`secoes/Capitulos.tsx`): a cena trava e cada foto nasce da Linha do logo, um fio de luz que se abre na imagem enquanto o texto troca. Textos e fotos ficam em `CAPITULOS`, em `lib/fotos.ts`; `foco` é o `object-position` de cada foto.
- **Conquistas** (`secoes/Conquistas.tsx`): carrossel que anda sozinho. O tempo de cada foto é a Linha enchendo embaixo (`DURACAO`, em segundos). Arrasta, aceita as setas do teclado, pausa fora da tela e tem botão de pausa. Fotos e legendas ficam em `CONQUISTAS`.

### Antes de publicar de verdade (hoje é demonstração)

- As fotos do Mercedes e do BMW mostram a marca (estrela e grade). Em anúncio publicado, troque por carro sem marca.
- O cartão com chip nos Capítulos é imagem de estilo: a ESC não emite cartão, então não use a foto em peça que ofereça cartão.

## Trocando os assets que ainda vão chegar

Tudo que está `null` em `src/lib/fotos.ts` usa uma versão desenhada (ícone em metal, moeda em CSS, porta de cofre em SVG). Quando a foto chegar:

1. Exporte em **WebP** nas larguras **760** e **1400**: `public/img/ramos/beleza-760.webp` e `public/img/ramos/beleza-1400.webp`.
2. Troque o `null` pela chamada `foto()`:

```ts
{ id: 'beleza', nome: 'Beleza', frase: 'Cadeira nova, agenda cheia.', icone: 'tesoura',
  foto: foto('ramos/beleza', 1400, 1750, 'Tesoura de barbeiro em aço sobre fundo preto') },
```

| Asset | Onde entra | Proporção |
| --- | --- | --- |
| 6 still lifes dos ramos | `RAMOS[n].foto` | 4:5 |
| Lupa, cadeado, caneta | `PASSOS_FOTOS` | 16:10 ou 4:3 |
| Medalha DBC | `MEDALHA` | 1:1, fundo transparente ou branco |
| Vídeo do cofre | `COFRE = { mp4: '/video/cofre.mp4', poster: '/img/cofre-poster.webp' }` | 1:1 |

**Vídeo do cofre:** para o scrub no scroll ficar liso, exporte com keyframe em todo quadro:

```bash
ffmpeg -i cofre.mp4 -vf "scale=1080:-2" -c:v libx264 -g 1 -crf 24 -pix_fmt yuv420p -an -movflags +faststart public/video/cofre.mp4
```

---

## Deploy (GitHub + Vercel)

1. `git init && git add . && git commit -m "site DBC"` e suba para um repositório no GitHub.
2. Na Vercel: *Add New → Project*, importe o repositório. O preset **Vite** é detectado sozinho (build `npm run build`, saída `dist`).
3. Configure `VITE_SITE_URL` e publique. Depois aponte o domínio em *Settings → Domains*.
4. Teste o link no WhatsApp: a prévia usa `og-dbc.jpg`. Se trocar a imagem, o WhatsApp pode demorar para atualizar o cache.

`vercel.json` já define cache longo para `/assets` (arquivos com hash) e 30 dias para `/img`.

---

## Acessibilidade e desempenho

- `prefers-reduced-motion`: sem Lenis, sem parallax, sem loops; o loader vira um fade curto.
- Loops (luz do hero, carrossel, faixas) pausam fora da tela e com a aba em segundo plano.
- Tudo que se move no celular anda por transform e opacidade (GPU): a luz do hero, o cofre e as faixas não repintam imagem a cada quadro. A revelação das folhas com escala e o grão de filme ficam só no desktop.
- Foco visível em tudo que é clicável; menu mobile fecha no Esc e devolve o foco.
- Hero pré-carregado só na versão que a tela vai usar; fontes self-hosted (sem Google Fonts).

Desenvolvido por NOVA AI SOLUTIONS.
