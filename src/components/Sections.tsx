import Image from "next/image";
import { evento } from "@/config/evento";
import { CtaLink } from "./CtaLink";

function Eyebrow({ children, tone = "dark" }: { children: React.ReactNode; tone?: "dark" | "light" }) {
  return (
    <p
      className={`flex items-center gap-3 text-xs font-bold uppercase tracking-[0.2em] ${
        tone === "dark" ? "text-rose" : "text-wine"
      }`}
    >
      <span aria-hidden="true" className={`h-px w-8 ${tone === "dark" ? "bg-rose/70" : "bg-wine/70"}`} />
      {children}
    </p>
  );
}

/* ------------------------------------------------------------------ */
/* 2. IDENTIFICAÇÃO                                                    */
/* ------------------------------------------------------------------ */

const questions = [
  "Quem está sendo preparado para dar continuidade à sua empresa ou propriedade?",
  "Sua família conhece seus planos para o futuro do patrimônio?",
  "Como alinhar os interesses de quem participa da gestão e de quem não trabalha no negócio?",
  "Quais decisões precisam ser discutidas antes da passagem para a próxima geração?",
];

export function Reflexao() {
  return (
    <section id="reflexao" aria-labelledby="reflexao-title" className="on-light bg-paper text-ink">
      <div className="mx-auto grid max-w-6xl gap-12 px-5 py-20 sm:px-8 md:py-28 lg:grid-cols-[0.9fr_1.1fr] lg:gap-20">
        <div className="reveal lg:sticky lg:top-28 lg:self-start">
          <Eyebrow tone="light">Um momento de reflexão</Eyebrow>
          <h2
            id="reflexao-title"
            className="mt-6 text-balance text-[2rem] font-extrabold leading-[1.08] tracking-[-0.03em] sm:text-5xl"
          >
            O que você construiu hoje está preparado para continuar amanhã?
          </h2>
          <p className="mt-6 max-w-md text-pretty text-lg leading-relaxed text-muted-light">
            Algumas perguntas costumam ficar para depois. Discuti-las com calma, e no tempo certo, faz parte de preparar
            a continuidade.
          </p>
        </div>

        <ol className="reveal border-t border-line-light">
          {questions.map((q, i) => (
            <li key={q} className="grid grid-cols-[3rem_1fr] gap-4 border-b border-line-light py-7 sm:grid-cols-[4.5rem_1fr] sm:py-9">
              <span aria-hidden="true" className="pt-1 text-sm font-bold tabular-nums tracking-wider text-wine">
                {String(i + 1).padStart(2, "0")}
              </span>
              <p className="text-pretty text-xl font-semibold leading-snug tracking-[-0.01em] sm:text-2xl">{q}</p>
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
    text: "Entenda as questões que precisam ser discutidas para preparar a transição entre gerações.",
  },
  {
    title: "Proteção e organização patrimonial",
    text: "Conheça cuidados e caminhos que podem ser avaliados na organização do patrimônio familiar e empresarial.",
  },
  {
    title: "Continuidade dos negócios e da família",
    text: "Reflita sobre preparação de sucessores, responsabilidades e alinhamento entre familiares.",
  },
];

const contexts = ["Empresas familiares", "Propriedades rurais", "Imóveis"];

export function Temas() {
  return (
    <section id="temas" aria-labelledby="temas-title" className="bg-graphite">
      <div className="mx-auto max-w-6xl px-5 py-20 sm:px-8 md:py-28">
        <div className="reveal max-w-3xl">
          <Eyebrow>Temas da imersão</Eyebrow>
          <h2 id="temas-title" className="mt-6 text-balance text-[2rem] font-extrabold leading-[1.08] tracking-[-0.03em] text-paper sm:text-5xl">
            Três frentes para pensar a continuidade com clareza.
          </h2>
        </div>

        <div className="reveal mt-14 grid gap-0 md:mt-20 md:grid-cols-3 md:gap-10">
          {pillars.map((p, i) => (
            <article key={p.title} className="group border-t border-line-dark py-8 md:py-0 md:pt-8">
              <div className="flex items-baseline justify-between gap-4">
                <span aria-hidden="true" className="text-5xl font-extrabold tabular-nums tracking-tight text-line-dark transition-colors duration-500 group-hover:text-rose/80 sm:text-6xl">
                  {String(i + 1).padStart(2, "0")}
                </span>
                <span aria-hidden="true" className="h-px flex-1 origin-left scale-x-0 bg-rose transition-transform duration-500 ease-out-soft group-hover:scale-x-100" />
              </div>
              <h3 className="mt-6 text-xl font-bold tracking-[-0.01em] text-paper sm:text-2xl">{p.title}</h3>
              <p className="mt-3 text-pretty leading-relaxed text-muted-dark">{p.text}</p>
            </article>
          ))}
        </div>

        <div className="reveal mt-16 flex flex-col gap-8 rounded-2xl border border-line-dark bg-ink/60 p-6 sm:p-8 md:mt-20 md:flex-row md:items-center md:justify-between">
          <div>
            <p className="text-sm font-semibold uppercase tracking-[0.16em] text-muted-dark">Aplicado à realidade de</p>
            <ul className="mt-4 flex flex-wrap gap-2.5">
              {contexts.map((c) => (
                <li key={c} className="rounded-full border border-line-dark px-4 py-2 text-sm font-semibold text-paper">
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
          <h2 id="palestrantes-title" className="mt-6 text-balance text-[2rem] font-extrabold leading-[1.08] tracking-[-0.03em] text-paper sm:text-5xl">
            {speakers.length ? "Quem conduz a imersão." : "Quem está por trás da imersão."}
          </h2>
        </div>

        {speakers.length > 0 && (
          <ul className="reveal mt-14 grid gap-10 sm:grid-cols-2 lg:grid-cols-3">
            {speakers.map((s) => (
              <li key={s.name}>
                {s.photo && (
                  <div className="relative aspect-[4/5] overflow-hidden rounded-2xl bg-graphite">
                    <Image src={s.photo} alt={`Foto de ${s.name}`} fill sizes="(min-width:1024px) 33vw, (min-width:640px) 50vw, 100vw" className="object-cover grayscale-[20%]" />
                  </div>
                )}
                <h3 className="mt-5 text-xl font-bold text-paper">{s.name}</h3>
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
  { title: "Empresários", text: "Que conduzem empresas familiares e pensam no futuro da gestão." },
  { title: "Produtores rurais", text: "Que querem preparar a continuidade da propriedade e da atividade." },
  { title: "Sócios e sucessores", text: "Que participam, ou vão participar, das decisões sobre o negócio." },
  { title: "Famílias empresárias", text: "Familiares envolvidos no futuro do negócio, dentro ou fora da gestão." },
];

export function ParaQuem() {
  const schedule = evento.schedule.filter((s) => s.title);
  return (
    <section id="para-quem" aria-labelledby="para-quem-title" className="on-light bg-paper-2 text-ink">
      <div className="mx-auto max-w-6xl px-5 py-20 sm:px-8 md:py-28">
        <div className="reveal grid gap-6 lg:grid-cols-[1fr_1fr] lg:items-end">
          <div>
            <Eyebrow tone="light">Para quem é</Eyebrow>
            <h2 id="para-quem-title" className="mt-6 text-balance text-[2rem] font-extrabold leading-[1.08] tracking-[-0.03em] sm:text-5xl">
              Pensada para quem decide o futuro do patrimônio.
            </h2>
          </div>
          {evento.format && (
            <p className="text-lg leading-relaxed text-muted-light lg:pb-2">
              <span className="font-semibold text-ink">Formato: </span>
              {evento.format}
            </p>
          )}
        </div>

        <ul className="reveal mt-14 grid gap-px overflow-hidden rounded-2xl border border-line-light bg-line-light sm:grid-cols-2">
          {audience.map((a) => (
            <li key={a.title} className="bg-paper-2 p-7 transition-colors duration-300 hover:bg-paper sm:p-9">
              <h3 className="text-xl font-bold tracking-[-0.01em]">{a.title}</h3>
              <p className="mt-2 text-pretty leading-relaxed text-muted-light">{a.text}</p>
            </li>
          ))}
        </ul>

        {schedule.length > 0 && (
          <div className="reveal mt-20">
            <h3 className="text-2xl font-extrabold tracking-[-0.02em]">Programação</h3>
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
      <div className="mx-auto flex max-w-6xl flex-col gap-8 px-5 py-12 sm:px-8 md:flex-row md:items-start md:justify-between">
        <div>
          {evento.logo ? (
            <Image src={evento.logo} alt={evento.logoAlt || evento.name} width={939} height={200} className="h-12 w-auto sm:h-14" />
          ) : (
            <p className="text-lg font-bold tracking-tight text-paper">{evento.name}</p>
          )}
          <p className="mt-4 text-sm text-muted-dark">{evento.theme}</p>
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

        <a href="#topo" className="self-start text-sm font-semibold text-muted-dark transition-colors hover:text-paper">
          Voltar ao topo ↑
        </a>
      </div>
    </footer>
  );
}
