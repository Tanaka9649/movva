import Image from "next/image";
import { evento } from "@/config/evento";
import { CtaLink } from "./CtaLink";

const nav = [
  { href: "#reflexao", label: "Reflexão" },
  { href: "#temas", label: "Temas" },
  { href: "#para-quem", label: "Para quem" },
  { href: "#perguntas", label: "Perguntas" },
];

export function Header() {
  return (
    <header className="sticky top-0 z-40 border-b border-line-dark/70 bg-ink/85 backdrop-blur-md supports-[backdrop-filter]:bg-ink/70">
      <div className="mx-auto flex h-16 max-w-6xl items-center justify-between gap-4 px-5 sm:px-8">
        <a href="#topo" className="flex min-w-0 items-center gap-3" aria-label={`${evento.name} — início`}>
          {evento.logo ? (
            <Image src={evento.logo} alt={evento.logoAlt || evento.name} width={140} height={36} className="h-8 w-auto" priority />
          ) : (
            <>
              <span aria-hidden="true" className="grid size-7 shrink-0 place-items-center rounded-full border border-bronze/60">
                <span className="size-1.5 rounded-full bg-bronze" />
              </span>
              <span className="truncate text-[0.95rem] font-bold tracking-tight text-paper">{evento.name}</span>
            </>
          )}
        </a>

        <nav aria-label="Seções da página" className="hidden md:block">
          <ul className="flex items-center gap-7 text-sm text-muted-dark">
            {nav.map((item) => (
              <li key={item.href}>
                <a href={item.href} className="transition-colors duration-200 hover:text-paper">
                  {item.label}
                </a>
              </li>
            ))}
          </ul>
        </nav>

        <CtaLink size="sm" arrow={false} className="shrink-0">
          Realizar inscrição
        </CtaLink>
      </div>
    </header>
  );
}
