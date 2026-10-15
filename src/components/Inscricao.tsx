"use client";

import Image from "next/image";
import { useEffect, useRef, useState } from "react";
import { evento, isValidRegistrationUrl } from "@/config/evento";
import { Arrow, buttonClasses } from "./CtaLink";

const MODAL_TEXT =
  "As inscrições ainda não estão disponíveis por aqui. Volte em breve para acessar o link de inscrição.";

/** Saída de 150 ms; com movimento reduzido fecha na hora. */
function closeAnimated(dialog: HTMLDialogElement) {
  if (!dialog.open || dialog.classList.contains("closing")) return;
  if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) {
    dialog.close();
    return;
  }
  dialog.classList.add("closing");
  window.setTimeout(() => {
    dialog.close();
    dialog.classList.remove("closing");
  }, 150);
}

function RegistrationButton() {
  const dialogRef = useRef<HTMLDialogElement>(null);
  const triggerRef = useRef<HTMLButtonElement>(null);
  const [isOpen, setIsOpen] = useState(false);
  const url = evento.registrationUrl.trim();
  const active = isValidRegistrationUrl(url);
  const cls = `${buttonClasses.base} ${buttonClasses.sizes.md} ${buttonClasses.variants.primary} w-full sm:w-auto`;

  useEffect(() => {
    const dialog = dialogRef.current;
    if (!dialog) return;
    // Esc também passa pela saída animada
    const onCancel = (e: Event) => {
      e.preventDefault();
      closeAnimated(dialog);
    };
    const onClose = () => {
      setIsOpen(false);
      document.documentElement.style.overflow = "";
      // Devolve o foco ao botão que abriu o modal
      triggerRef.current?.focus();
    };
    dialog.addEventListener("cancel", onCancel);
    dialog.addEventListener("close", onClose);
    return () => {
      dialog.removeEventListener("cancel", onCancel);
      dialog.removeEventListener("close", onClose);
    };
  }, []);

  if (active) {
    return (
      <a href={url} className={cls} rel="noopener">
        <span>Realizar inscrição</span>
        <Arrow />
      </a>
    );
  }

  const open = () => {
    const dialog = dialogRef.current;
    if (!dialog || dialog.open) return;
    dialog.showModal();
    document.documentElement.style.overflow = "hidden";
    setIsOpen(true);
  };

  const close = () => {
    if (dialogRef.current) closeAnimated(dialogRef.current);
  };

  return (
    <>
      <button
        ref={triggerRef}
        type="button"
        onClick={open}
        className={cls}
        aria-haspopup="dialog"
        aria-expanded={isOpen}
        aria-controls="aviso-inscricao"
      >
        <span>Realizar inscrição</span>
        <Arrow />
      </button>

      <dialog
        ref={dialogRef}
        id="aviso-inscricao"
        className="modal"
        aria-labelledby="aviso-inscricao-title"
        aria-describedby="aviso-inscricao-text"
        onClick={(e) => {
          // Fecha ao clicar fora do conteúdo
          if (e.target === e.currentTarget) close();
        }}
      >
        <div className="relative rounded-2xl border border-line-dark bg-graphite p-7 text-paper shadow-2xl sm:p-9">
          <span aria-hidden="true" className="absolute inset-x-7 top-0 h-px bg-rose sm:inset-x-9" />
          <h2 id="aviso-inscricao-title" className="pr-10 text-xl font-bold tracking-[-0.01em]">
            Inscrições em breve
          </h2>
          <p id="aviso-inscricao-text" className="mt-3 text-pretty leading-relaxed text-muted-dark">
            {MODAL_TEXT}
          </p>
          <div className="mt-7 flex justify-end">
            <button
              type="button"
              onClick={close}
              autoFocus
              className={`${buttonClasses.base} ${buttonClasses.sizes.md} ${buttonClasses.variants["outline-dark"]}`}
            >
              Entendi
            </button>
          </div>
          <button
            type="button"
            onClick={close}
            aria-label="Fechar aviso"
            className="absolute right-4 top-4 grid size-10 place-items-center rounded-full text-muted-dark transition-colors hover:bg-graphite-2 hover:text-paper"
          >
            <svg aria-hidden="true" viewBox="0 0 20 20" className="size-5" fill="none">
              <path d="M5 5l10 10M15 5L5 15" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" />
            </svg>
          </button>
        </div>
      </dialog>
    </>
  );
}

export function Inscricao() {
  const location = [evento.venue, evento.address, evento.city].filter(Boolean);
  const facts = [
    evento.date && { label: "Data", value: evento.date },
    evento.time && { label: "Horário", value: evento.time },
    location.length > 0 && { label: "Local", value: location.join(" — ") },
    evento.format && { label: "Formato", value: evento.format },
  ].filter(Boolean) as { label: string; value: string }[];
  const inclusions = evento.inclusions.filter(Boolean);
  const hasDetails = Boolean(evento.price) || facts.length > 0 || inclusions.length > 0;

  return (
    <section id="inscricao" aria-labelledby="inscricao-title" className="bg-paper pb-16 md:pb-24">
      <div className="mx-auto max-w-6xl px-5 sm:px-8">
      <div className="reveal relative overflow-hidden rounded-xl bg-ink">
        {/* Marca d'água com o símbolo Movva */}
        {evento.symbol && (
          <div
            aria-hidden="true"
            data-brand-m
            className="brand-m pointer-events-none absolute right-6 top-1/2 w-[16rem] -translate-y-1/2 select-none overflow-hidden sm:right-12 sm:w-[22rem] lg:right-16 lg:w-[26rem]"
          >
            <Image src={evento.symbol} alt="" width={277} height={256} className="m-base h-auto w-full" />
            {/* Painel da cor do cartão: sobe e revela o símbolo de baixo para cima */}
            <span className="m-cover" />
          </div>
        )}

        <div className={`relative grid gap-12 px-6 py-12 sm:px-12 sm:py-16 lg:gap-16 lg:p-16 ${hasDetails ? "lg:grid-cols-[1.3fr_0.7fr]" : ""}`}>
          <div className={hasDetails ? "" : "max-w-3xl"}>
            <p className="flex items-center gap-3 text-[0.8125rem] font-bold uppercase tracking-[0.18em] text-rose">
              <span aria-hidden="true" className="eb-line h-[2px] w-10 bg-linear-to-r from-brand to-brand-light" />
              Inscrição
            </p>
            <h2 id="inscricao-title" className="mt-6 text-balance text-[2rem] font-semibold leading-[1.1] tracking-[-0.022em] text-paper sm:text-5xl">
              Dê o próximo passo na continuidade do seu patrimônio.
            </h2>
            <p className="mt-6 max-w-xl text-pretty text-lg leading-relaxed text-muted-dark">
              Decisões que conectam patrimônio, família e futuro dos negócios.
            </p>

            <div className="mt-10">
              <RegistrationButton />
            </div>
          </div>

          {hasDetails && (
            <div className="space-y-8 border-t border-line-dark pt-8 lg:border-l lg:border-t-0 lg:pl-12 lg:pt-0">
              {evento.price && (
                <div>
                  <p className="text-xs font-semibold uppercase tracking-[0.16em] text-muted-dark">Investimento</p>
                  <p className="mt-2 text-4xl font-semibold tracking-tight text-paper">{evento.price}</p>
                  {evento.priceNote && <p className="mt-1 text-sm text-muted-dark">{evento.priceNote}</p>}
                </div>
              )}
              {facts.length > 0 && (
                <dl className="space-y-4">
                  {facts.map((f) => (
                    <div key={f.label}>
                      <dt className="text-xs font-semibold uppercase tracking-[0.16em] text-muted-dark">{f.label}</dt>
                      <dd className="mt-1 font-semibold text-paper">{f.value}</dd>
                    </div>
                  ))}
                </dl>
              )}
              {inclusions.length > 0 && (
                <div>
                  <p className="text-xs font-semibold uppercase tracking-[0.16em] text-muted-dark">Inclui</p>
                  <ul className="mt-3 space-y-2">
                    {inclusions.map((item) => (
                      <li key={item} className="flex gap-3 text-paper">
                        <span aria-hidden="true" className="mt-2.5 size-1.5 shrink-0 rounded-full bg-rose" />
                        {item}
                      </li>
                    ))}
                  </ul>
                </div>
              )}
            </div>
          )}
        </div>
      </div>
      </div>
    </section>
  );
}
