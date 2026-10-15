/**
 * Fita em movimento entre o topo e a primeira seção.
 * CSS puro (sem JavaScript): duas cópias idênticas do trecho deslizam em laço.
 * Decorativa: o texto fica disponível uma única vez para leitores de tela.
 * Com movimento reduzido, a fita fica parada.
 */
const items = ["Evento exclusivo", "Movva planejamento sucessório"];
const PAIRS = 5; // cada metade precisa ser mais larga que a tela

function Row({ hidden = false }: { hidden?: boolean }) {
  return (
    <ul aria-hidden={hidden || undefined} className="flex shrink-0 items-center">
      {Array.from({ length: PAIRS }).flatMap((_, k) =>
        items.map((text) => (
          <li key={`${k}-${text}`} className="flex shrink-0 items-center whitespace-nowrap">
            <span className="px-7 text-[0.9375rem] font-semibold uppercase tracking-[0.16em] sm:px-9 sm:text-base">{text}</span>
            <span aria-hidden="true" className="size-1.5 rounded-full bg-white/70" />
          </li>
        )),
      )}
    </ul>
  );
}

export function Fita() {
  return (
    <div className="pointer-events-none relative z-10 h-0 overflow-x-clip">
      <p className="sr-only">Evento exclusivo. Movva planejamento sucessório.</p>
      {/* A fita é mais larga que a tela e levemente inclinada; o centro dela fica na divisa entre as seções */}
      <div className="absolute -left-[5%] top-0 w-[110%] -translate-y-1/2 -rotate-[1.6deg] overflow-hidden bg-logo-pink py-3.5 text-white shadow-[0_10px_30px_-14px_rgba(0,0,0,0.6)] sm:py-4">
        <div className="fita-track flex w-max">
          <Row />
          <Row hidden />
        </div>
      </div>
    </div>
  );
}
