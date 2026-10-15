import Image from "next/image";
import { evento } from "@/config/evento";
import { CtaLink } from "./CtaLink";

function Eyebrow({ children, tone = "dark" }: { children: React.ReactNode; tone?: "dark" | "light" }) {
  return (
    <p
      className={`flex items-center gap-3 text-[0.8125rem] font-bold uppercase tracking-[0.18em] ${
        tone === "dark" ? "text-rose" : "text-wine"
      }`}
    >
      {/* Único uso do degradê da logo fora dela: assinatura discreta da marca em cada seção */}
      <span aria-hidden="true" className="eb-line h-[2px] w-10 shrink-0 bg-linear-to-r from-brand to-brand-light" />
      {children}
    </p>
  );
}

/* ------------------------------------------------------------------ */
/* 2. IDENTIFICAÇÃO                                                    */
/* ------------------------------------------------------------------ */

const questions = [
  "Quem vai dar continuidade à sua empresa ou propriedade?",
  "Sua família conhece seus planos para o futuro do patrimônio?",
  "Como alinhar quem gere o negócio e quem não participa dele?",
  "Que decisões precisam vir antes da passagem para a próxima geração?",
];

export function Reflexao() {
  return (
    <section id="reflexao" aria-labelledby="reflexao-title" className="on-light bg-paper text-ink">
      <div className="mx-auto grid max-w-6xl gap-12 px-5 py-20 sm:px-8 md:py-28 lg:grid-cols-[0.9fr_1.1fr] lg:gap-20">
        <div className="reveal lg:sticky lg:top-28 lg:self-start">
          <Eyebrow tone="light">Um momento de reflexão</Eyebrow>
          <h2
            id="reflexao-title"
            className="mt-6 text-balance text-[2rem] font-semibold leading-[1.1] tracking-[-0.022em] sm:text-5xl"
          >
            O que você construiu hoje está preparado para continuar amanhã?
          </h2>
        </div>

        <ol className="border-t border-line-light">
          {questions.map((q, i) => (
            <li key={q} style={{ ["--d" as string]: `${i * 90}ms` }} className="reveal grid grid-cols-[3rem_1fr] gap-4 border-b border-line-light py-7 sm:grid-cols-[3.5rem_1fr] sm:py-9">
              <span aria-hidden="true" className="pt-1 text-sm font-bold tabular-nums tracking-wider text-wine">
                {String(i + 1).padStart(2, "0")}
              </span>
              <p className="max-w-[32rem] text-balance text-xl font-semibold leading-snug tracking-[-0.01em] sm:text-2xl">{q}</p>
            </li>
          ))}
        </ol>
      </div>
    </section>
  );
}

/* ------------------------------------------------------------------ */
/* 3. TEMAS                                                            */
/* ------------------------------------------------------------------ */

const pillars = [
  {
    title: "Planejamento sucessório",
    text: "As questões a discutir para preparar a transição entre gerações.",
  },
  {
    title: "Proteção e organização patrimonial",
    text: "Caminhos para organizar e proteger o patrimônio familiar e empresarial.",
  },
  {
    title: "Continuidade dos negócios e da família",
    text: "Preparação de sucessores, responsabilidades e alinhamento entre familiares.",
  },
];

const contexts = ["Empresas familiares", "Propriedades rurais", "Imóveis"];

export function Temas() {
  return (
    <section id="temas" aria-labelledby="temas-title" className="bg-graphite">
      <div className="mx-auto max-w-6xl px-5 py-20 sm:px-8 md:py-28">
        <div className="reveal max-w-3xl">
          <Eyebrow>Temas da imersão</Eyebrow>
          <h2 id="temas-title" className="mt-6 text-balance text-[2rem] font-semibold leading-[1.1] tracking-[-0.022em] text-paper sm:text-5xl">
            Três frentes para pensar a continuidade com clareza.
          </h2>
        </div>

        <div className="reveal mt-14 grid gap-0 md:mt-20 md:grid-cols-3 md:gap-10">
          {pillars.map((p, i) => (
            <article key={p.title} className="tema border-t border-line-dark py-8 md:py-0 md:pt-8">
              <div className="flex items-baseline justify-between gap-4">
                <span aria-hidden="true" className="text-[1.75rem] font-semibold tabular-nums tracking-tight text-rose">
                  {String(i + 1).padStart(2, "0")}
                </span>
                <span aria-hidden="true" style={{ ["--d" as string]: `${i * 120}ms` }} className="num-line h-px flex-1 bg-rose/60" />
              </div>
              <h3 className="mt-5 text-xl font-semibold tracking-[-0.01em] text-paper sm:text-2xl">{p.title}</h3>
              <p className="mt-3 text-pretty text-[1.0625rem] leading-[1.65] text-muted-dark">{p.text}</p>
            </article>
          ))}
        </div>

        <div className="reveal mt-16 flex flex-col gap-8 rounded-xl border border-line-dark bg-ink/60 p-6 sm:p-8 md:mt-20 md:flex-row md:items-center md:justify-between">
          <div>
            <p className="text-sm font-semibold uppercase tracking-[0.16em] text-muted-dark">Aplicado à realidade de</p>
            <ul className="mt-4 flex flex-wrap gap-2.5">
              {contexts.map((c) => (
                <li key={c} className="rounded-md border border-line-dark px-4 py-2 text-sm font-semibold text-paper">
                  {c}
                </li>
              ))}
            </ul>
          </div>
          <CtaLink className="w-full md:w-auto">Quero participar da imersão</CtaLink>
        </div>
      </div>
    </section>
  );
}

/* ------------------------------------------------------------------ */
/* 4. PALESTRANTES E CONFIANÇA — oculto enquanto não houver dados reais  */
/* ------------------------------------------------------------------ */

export function Palestrantes() {
  const speakers = evento.speakers.filter((s) => s.name && s.specialty);
  const testimonials = evento.testimonials.filter((t) => t.quote && t.author);
  const photos = evento.pastEventPhotos.filter((p) => p.src && p.caption);
  const hasOrganizer = Boolean(evento.organizer);

  if (!speakers.length && !testimonials.length && !photos.length && !hasOrganizer) return null;

  return (
    <section id="palestrantes" aria-labelledby="palestrantes-title" className="bg-ink">
      <div className="mx-auto max-w-6xl px-5 py-20 sm:px-8 md:py-28">
        <div className="reveal max-w-3xl">
          <Eyebrow>{speakers.length ? "Palestrantes" : "Realização"}</Eyebrow>
          <h2 id="palestrantes-title" className="mt-6 text-balance text-[2rem] font-semibold leading-[1.1] tracking-[-0.022em] text-paper sm:text-5xl">
            {speakers.length ? "Quem conduz a imersão." : "Quem está por trás da imersão."}
          </h2>
        </div>

        {speakers.length > 0 && (
          <ul className="reveal mt-14 grid gap-10 sm:grid-cols-2 lg:grid-cols-3">
            {speakers.map((s) => (
              <li key={s.name}>
                {s.photo && (
                  <div className="relative aspect-[4/5] overflow-hidden rounded-xl bg-graphite">
                    <Image src={s.photo} alt={`Foto de ${s.name}`} fill sizes="(min-width:1024px) 33vw, (min-width:640px) 50vw, 100vw" className="object-cover grayscale-[20%]" />
                  </div>
                )}
                <h3 className="mt-5 text-xl font-semibold text-paper">{s.name}</h3>
                <p className="mt-1 text-sm font-semibold text-rose">{s.specialty}</p>
                {s.bio && <p className="mt-3 text-pretty leading-relaxed text-muted-dark">{s.bio}</p>}
              </li>
            ))}
          </ul>
        )}

        {hasOrganizer && (
          <div className="reveal mt-14 flex flex-wrap items-center gap-6 border-t border-line-dark pt-8">
            <p className="text-sm font-semibold uppercase tracking-[0.16em] text-muted-dark">Realização</p>
            {evento.organizerLogo ? (
              <Image src={evento.organizerLogo} alt={evento.organizer} width={160} height={48} className="h-10 w-auto" />
            ) : (
              <p className="text-lg font-bold text-paper">{evento.organizer}</p>
            )}
          </div>
        )}

        {photos.length > 0 && (
          <ul className="reveal mt-14 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
            {photos.map((p) => (
              <li key={p.src}>
                <figure>
                  <div className="relative aspect-[4/3] overflow-hidden rounded-xl bg-graphite">
                    <Image src={p.src} alt={p.alt} fill sizes="(min-width:1024px) 33vw, (min-width:640px) 50vw, 100vw" className="object-cover" />
                  </div>
                  <figcaption className="mt-3 text-sm text-muted-dark">{p.caption}</figcaption>
                </figure>
              </li>
            ))}
          </ul>
        )}

        {testimonials.length > 0 && (
          <ul className="reveal mt-14 grid gap-6 md:grid-cols-2">
            {testimonials.map((t) => (
              <li key={t.author} className="border-l-2 border-rose pl-6">
                <blockquote className="text-pretty text-lg leading-relaxed text-paper">“{t.quote}”</blockquote>
                <p className="mt-4 text-sm font-semibold text-paper">
                  {t.author}
                  {t.role && <span className="font-normal text-muted-dark"> · {t.role}</span>}
                </p>
              </li>
            ))}
          </ul>
        )}
      </div>
    </section>
  );
}

/* ------------------------------------------------------------------ */
/* 5. EXPERIÊNCIA / PARA QUEM                                          */
/* ------------------------------------------------------------------ */

const audience = [
  { title: "Empresários", text: "Que conduzem empresas familiares." },
  { title: "Produtores rurais", text: "Que querem preparar a continuidade da propriedade." },
  { title: "Sócios e sucessores", text: "Que participam, ou vão participar, das decisões." },
  { title: "Famílias empresárias", text: "Dentro ou fora da gestão do negócio." },
];

export function ParaQuem() {
  const schedule = evento.schedule.filter((s) => s.title);
  return (
    <section id="para-quem" aria-labelledby="para-quem-title" className="on-light bg-paper text-ink">
      <div className="mx-auto max-w-6xl px-5 py-20 sm:px-8 md:py-28">
        <div className="reveal grid gap-6 lg:grid-cols-[1.5fr_0.5fr] lg:items-end">
          <div>
            <Eyebrow tone="light">Para quem é</Eyebrow>
            <h2 id="para-quem-title" className="mt-6 max-w-[47.5rem] text-balance text-[2rem] font-semibold leading-[1.1] tracking-[-0.022em] sm:text-5xl">
              Pensada para quem decide o futuro do patrimônio.
            </h2>
          </div>
        </div>

        <ul className="reveal mt-14 grid gap-px overflow-hidden rounded-xl border border-line-light bg-line-light sm:grid-cols-2 md:mt-20">
          {audience.map((a) => (
            <li key={a.title} className="bg-paper p-7 sm:p-10">
              <h3 className="text-xl font-semibold tracking-[-0.01em]">{a.title}</h3>
              <p className="mt-2 max-w-[34ch] text-pretty text-[1.0625rem] leading-[1.6] text-muted-light">{a.text}</p>
            </li>
          ))}
        </ul>

        {schedule.length > 0 && (
          <div className="reveal mt-20">
            <h3 className="text-2xl font-semibold tracking-[-0.02em]">Programação</h3>
            <ol className="mt-8 border-t border-line-light">
              {schedule.map((s) => (
                <li key={`${s.time}-${s.title}`} className="grid gap-2 border-b border-line-light py-6 sm:grid-cols-[9rem_1fr] sm:gap-8">
                  <span className="font-bold tabular-nums text-wine">{s.time}</span>
                  <div>
                    <p className="text-lg font-semibold">{s.title}</p>
                    {s.description && <p className="mt-1 text-muted-light">{s.description}</p>}
                  </div>
                </li>
              ))}
            </ol>
          </div>
        )}
      </div>
    </section>
  );
}

/* ------------------------------------------------------------------ */
/* FOOTER                                                              */
/* ------------------------------------------------------------------ */

export function Footer() {
  const contacts = evento.contacts.filter((c) => c.href && c.value);
  return (
    <footer className="border-t border-line-dark bg-ink">
      <div className="mx-auto flex max-w-6xl flex-col gap-8 px-5 pb-8 pt-16 sm:px-8 md:flex-row md:items-center md:justify-between">
        <div>
          {evento.logo ? (
            <Image src={evento.logo} alt={evento.logoAlt || evento.name} width={939} height={200} className="h-12 w-auto sm:h-14" />
          ) : (
            <p className="text-lg font-bold tracking-tight text-paper">{evento.name}</p>
          )}
          {evento.organizer && (
            <p className="mt-4 text-sm text-muted-dark">
              Realização:{" "}
              {evento.organizerUrl ? (
                <a href={evento.organizerUrl} className="font-semibold text-paper underline decoration-line-dark underline-offset-4 hover:decoration-rose" target="_blank" rel="noopener noreferrer">
                  {evento.organizer}
                </a>
              ) : (
                <span className="font-semibold text-paper">{evento.organizer}</span>
              )}
            </p>
          )}
        </div>

        {contacts.length > 0 && (
          <ul className="space-y-2 text-sm">
            {contacts.map((c) => (
              <li key={c.href}>
                <span className="text-muted-dark">{c.label}: </span>
                <a href={c.href} className="font-semibold text-paper underline decoration-line-dark underline-offset-4 hover:decoration-rose">
                  {c.value}
                </a>
              </li>
            ))}
          </ul>
        )}

        <a href="#topo" className="self-start text-sm font-semibold text-muted-dark transition-colors hover:text-paper md:self-center">
          Voltar ao topo ↑
        </a>
      </div>
      <div className="mx-auto max-w-6xl px-5 pb-12 sm:px-8">
        <p className="border-t border-[#2a2528] pt-6 text-[0.8125rem] text-[#8f868a]">© {new Date().getFullYear()} {evento.name}</p>
      </div>
    </footer>
  );
}
