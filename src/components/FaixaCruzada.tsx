import { Faixa } from './Faixa'

/** Duas faixas cruzadas em X, andando em sentidos opostos. */
export function FaixaCruzada({ a, b }: { a: readonly string[]; b: readonly string[] }) {
  return (
    <div id="faixas" className="relative z-30 overflow-hidden bg-preto py-14 md:py-20">
      <div className="relative h-[clamp(8rem,16vw,13rem)]">
        <div className="absolute inset-x-[-6%] top-1/2 -translate-y-1/2 rotate-[-9deg] md:rotate-[-4deg]">
          <Faixa itens={a} estilo="display" tom="clara" duracao={46} />
        </div>
        <div className="absolute inset-x-[-6%] top-1/2 -translate-y-1/2 rotate-[9deg] md:rotate-[4deg] shadow-[0_30px_60px_-20px_rgba(0,0,0,0.8)]">
          <Faixa itens={b} estilo="display" tom="metal" reverso duracao={52} />
        </div>
      </div>
    </div>
  )
}
