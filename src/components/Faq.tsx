"use client";

import { useId, useState } from "react";
import { evento } from "@/config/evento";

export function Faq() {
  const items = evento.faq.filter((f) => f.question && f.answer);
  const [openIndex, setOpenIndex] = useState<number | null>(0);
  const baseId = useId();

  if (!items.length) return null;

  return (
    <section id="perguntas" aria-labelledby="perguntas-title" className="on-light bg-paper text-ink">
      <div className="mx-auto grid max-w-6xl gap-12 px-5 py-20 sm:px-8 md:py-28 lg:grid-cols-[0.8fr_1.2fr] lg:gap-20">
        <div className="reveal">
          <p className="flex items-center gap-3 text-xs font-bold uppercase tracking-[0.2em] text-wine">
            <span aria-hidden="true" className="h-px w-8 bg-wine/70" />
            Perguntas frequentes
          </p>
          <h2 id="perguntas-title" className="mt-6 text-balance text-[2rem] font-extrabold leading-[1.08] tracking-[-0.03em] sm:text-5xl">
            Antes de se inscrever.
          </h2>
        </div>

        <div className="reveal border-t border-line-light">
          {items.map((item, i) => {
            const isOpen = openIndex === i;
            const buttonId = `${baseId}-q-${i}`;
            const panelId = `${baseId}-a-${i}`;
            return (
              <div key={item.question} className="border-b border-line-light">
                <h3>
                  <button
                    id={buttonId}
                    type="button"
                    aria-expanded={isOpen}
                    aria-controls={panelId}
                    onClick={() => setOpenIndex(isOpen ? null : i)}
                    className="group flex min-h-16 w-full items-center justify-between gap-6 py-6 text-left text-lg font-bold tracking-[-0.01em] transition-colors hover:text-wine sm:text-xl"
                  >
                    <span>{item.question}</span>
                    <span
                      aria-hidden="true"
                      className={`relative grid size-9 shrink-0 place-items-center rounded-full border transition-colors duration-300 ${
                        isOpen ? "border-wine bg-wine text-paper" : "border-ink/20 group-hover:border-wine"
                      }`}
                    >
                      <span className="absolute h-px w-3.5 bg-current" />
                      <span
                        className={`absolute h-3.5 w-px bg-current transition-transform duration-300 ease-out-soft ${isOpen ? "scale-y-0" : "scale-y-100"}`}
                      />
                    </span>
                  </button>
                </h3>
                <div
                  id={panelId}
                  role="region"
                  aria-labelledby={buttonId}
                  hidden={!isOpen}
                  className="pb-7 pr-12"
                >
                  <p className="text-pretty text-lg leading-relaxed text-muted-light">{item.answer}</p>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
}
