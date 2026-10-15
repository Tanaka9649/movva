import Image from "next/image";
import { evento } from "@/config/evento";
import { CtaLink } from "./CtaLink";

/* Instante em que a linha de continuidade alcança cada geração (fração do desenho).
   Comprimento total da linha ≈ 359; o primeiro trecho mede ≈ 191. */
const reach = [0, 0.53, 1];
const at = (f: number) => `calc(var(--draw-delay) + var(--draw-dur) * ${f})`;

function GenerationsGraphic({ className = "" }: { className?: string }) {
  const muted = "#5e5559";
  const rows = [
    { y: 70, label: "1ª geração" },
    { y: 230, label: "2ª geração" },
    { y: 390, label: "3ª geração" },
  ];
  const nodeDelay = (y: number) => at(reach[rows.findIndex((r) => r.y === y)]);
  return (
    <svg viewBox="0 0 420 460" fill="none" aria-hidden="true" focusable="false" className={className}>
      <defs>
        {/* Degradê da logo Movva (vinho → rosé), usado só na linha de continuidade */}
        <linearGradient id="movva-line" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0" stopColor="#e391b3" />
          <stop offset="1" stopColor="#9c1e57" />
        </linearGradient>
      </defs>
      {rows.map((r) => (
        <g key={r.y}>
          <line x1="0" x2="420" y1={r.y} y2={r.y} stroke="#3a3337" strokeWidth="1" strokeDasharray="2 6" />
          <text
            className="tree-label"
            style={{ ["--d" as string]: nodeDelay(r.y) }}
            x="0"
            y={r.y - 14}
            fill="#8f868a"
            fontSize="12"
            letterSpacing="1.5"
            fontFamily="inherit"
          >
            {r.label.toUpperCase()}
          </text>
        </g>
      ))}

      {/* Ramificações */}
      <path d="M220 70 C 220 150, 150 150, 150 230" stroke={muted} strokeWidth="1.5" />
      <path d="M150 230 C 150 310, 105 310, 105 390" stroke={muted} strokeWidth="1.5" />
      <path d="M150 230 C 150 310, 190 310, 190 390" stroke={muted} strokeWidth="1.5" />
      <path d="M310 230 C 310 310, 360 310, 360 390" stroke={muted} strokeWidth="1.5" />

      {/* Linha de continuidade */}
      <path
        className="draw"
        style={{ ["--len" as string]: 360 }}
        d="M220 70 C 220 150, 310 150, 310 230 C 310 310, 265 310, 265 390"
        stroke="url(#movva-line)"
        strokeWidth="2"
        strokeLinecap="round"
      />

      {/* Nós */}
      {[
        [150, 230],
        [105, 390],
        [190, 390],
        [360, 390],
      ].map(([cx, cy]) => (
        <circle key={`${cx}-${cy}`} cx={cx} cy={cy} r="5" fill="#0e0c0d" stroke="#5e5559" strokeWidth="1.4" />
      ))}
      {[
        [220, 70],
        [310, 230],
        [265, 390],
      ].map(([cx, cy]) => (
        <g key={`b-${cx}-${cy}`} className="tree-node" style={{ ["--d" as string]: nodeDelay(cy) }}>
          <circle cx={cx} cy={cy} r="14" stroke="#d7a3ba" strokeOpacity="0.25" />
          <circle cx={cx} cy={cy} r="6" fill="#d7a3ba" />
        </g>
      ))}
    </svg>
  );
}

export function Hero() {
  const facts = [evento.date, evento.city, evento.format].filter(Boolean) as string[];

  return (
    <section id="topo" aria-labelledby="hero-title" className="relative isolate overflow-hidden">
      {/* Grade sutil de fundo */}
      <div
        aria-hidden="true"
        className="pointer-events-none absolute inset-0 -z-10 opacity-[0.35] [background-image:linear-gradient(to_right,#201c1e_1px,transparent_1px)] [background-size:96px_100%] [mask-image:linear-gradient(to_bottom,black,transparent_85%)]"
      />

      <div className="mx-auto grid max-w-6xl gap-12 px-5 pb-20 pt-14 sm:px-8 sm:pt-20 md:pb-28 lg:grid-cols-[1.25fr_0.75fr] lg:items-center lg:gap-16 lg:pt-24">
        <div>
          {evento.logo && (
            <Image
              src={evento.logo}
              alt={evento.logoAlt || evento.name}
              width={939}
              height={200}
              priority
              className="rise mb-10 h-14 w-auto sm:h-16 lg:h-[4.5rem]"
            />
          )}
          {/* Linha de fatos: mostra data · cidade · formato quando confirmados; até lá, o tema */}
          <p className="rise text-sm font-semibold uppercase tracking-[0.12em] text-rose">
            {facts.length > 0 ? facts.join(" · ") : evento.theme}
          </p>

          <h1
            id="hero-title"
            className="rise rise-1 mt-6 text-balance text-[2.35rem] font-semibold leading-[1.08] tracking-[-0.025em] text-paper sm:text-6xl lg:text-[4rem]"
          >
            Você construiu um patrimônio.{" "}
            Agora, precisa planejar sua{" "}
            <span className="text-rose">continuidade.</span>
          </h1>

          <p className="rise rise-2 mt-7 max-w-xl text-pretty text-lg leading-[1.65] text-muted-dark sm:text-xl">
            {evento.description}
          </p>

          <div className="rise rise-3 mt-10 flex flex-col gap-4 sm:flex-row sm:items-center">
            <CtaLink className="w-full sm:w-auto">Quero participar da imersão</CtaLink>
            <a
              href="#temas"
              className="inline-flex min-h-12 items-center justify-center px-2 text-[0.9375rem] font-semibold text-paper underline decoration-paper/40 decoration-1 underline-offset-[6px] transition-colors hover:decoration-rose"
            >
              Ver os temas
            </a>
          </div>

        </div>

        <div data-reveal className="rise rise-4 relative mx-auto w-full max-w-[15rem] sm:max-w-sm lg:max-w-none">
          <GenerationsGraphic className="h-auto w-full" />
        </div>
      </div>
    </section>
  );
}
