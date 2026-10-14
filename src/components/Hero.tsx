import Image from "next/image";
import { evento } from "@/config/evento";
import { CtaLink } from "./CtaLink";

function GenerationsGraphic({ className = "" }: { className?: string }) {
  const muted = "#3d3539";
  const rows = [
    { y: 70, label: "1ª geração" },
    { y: 230, label: "2ª geração" },
    { y: 390, label: "3ª geração" },
  ];
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
          <line x1="0" x2="420" y1={r.y} y2={r.y} stroke={muted} strokeWidth="1" strokeDasharray="2 6" />
          <text x="0" y={r.y - 14} fill="#7d7378" fontSize="11" letterSpacing="1.5" fontFamily="inherit">
            {r.label.toUpperCase()}
          </text>
        </g>
      ))}

      {/* Ramificações */}
      <path d="M220 70 C 220 150, 150 150, 150 230" stroke={muted} strokeWidth="1.4" />
      <path d="M150 230 C 150 310, 105 310, 105 390" stroke={muted} strokeWidth="1.4" />
      <path d="M150 230 C 150 310, 190 310, 190 390" stroke={muted} strokeWidth="1.4" />
      <path d="M310 230 C 310 310, 360 310, 360 390" stroke={muted} strokeWidth="1.4" />

      {/* Linha de continuidade */}
      <path
        className="draw"
        style={{ ["--len" as string]: 420 }}
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
        <g key={`b-${cx}-${cy}`}>
          <circle cx={cx} cy={cy} r="14" stroke="#d7a3ba" strokeOpacity="0.25" />
          <circle cx={cx} cy={cy} r="6" fill="#d7a3ba" />
        </g>
      ))}
    </svg>
  );
}

export function Hero() {
  const details = [
    evento.date && { label: "Data", value: evento.date },
    evento.time && { label: "Horário", value: evento.time },
    (evento.venue || evento.city) && {
      label: "Local",
      value: [evento.venue, evento.city].filter(Boolean).join(" · "),
    },
  ].filter(Boolean) as { label: string; value: string }[];

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
          <p className="rise inline-flex items-center gap-3 rounded-full border border-rose/40 bg-rose/[0.06] py-1.5 pl-2 pr-4 text-[0.8rem] font-semibold tracking-wide text-rose-soft">
            <span aria-hidden="true" className="size-1.5 rounded-full bg-rose" />
            {evento.theme}
          </p>

          <h1
            id="hero-title"
            className="rise rise-1 mt-7 text-balance text-[2.35rem] font-extrabold leading-[1.04] tracking-[-0.035em] text-paper sm:text-6xl lg:text-[4.25rem]"
          >
            Você construiu um patrimônio.{" "}
            <span className="text-muted-dark">Agora, precisa planejar sua </span>
            <span className="text-rose">continuidade.</span>
          </h1>

          <p className="rise rise-2 mt-7 max-w-xl text-pretty text-lg leading-relaxed text-muted-dark sm:text-xl">
            {evento.description}
          </p>

          <div className="rise rise-3 mt-10 flex flex-col gap-4 sm:flex-row sm:items-center">
            <CtaLink className="w-full sm:w-auto">Quero participar da imersão</CtaLink>
            <a
              href="#temas"
              className="inline-flex min-h-12 items-center justify-center px-2 text-sm font-semibold text-muted-dark underline decoration-line-dark underline-offset-[6px] transition-colors hover:text-paper hover:decoration-rose"
            >
              Ver os temas
            </a>
          </div>

          {details.length > 0 && (
            <dl className="rise rise-4 mt-12 grid gap-px overflow-hidden rounded-xl border border-line-dark bg-line-dark sm:grid-cols-3">
              {details.map((d) => (
                <div key={d.label} className="bg-ink px-5 py-4">
                  <dt className="text-xs font-semibold uppercase tracking-[0.16em] text-muted-dark">{d.label}</dt>
                  <dd className="mt-1 font-semibold text-paper">{d.value}</dd>
                </div>
              ))}
            </dl>
          )}
        </div>

        <div className="rise rise-2 relative mx-auto w-full max-w-[15rem] sm:max-w-sm lg:max-w-none">
          <GenerationsGraphic className="h-auto w-full" />
        </div>
      </div>
    </section>
  );
}
