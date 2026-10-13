"use client";

import { useEffect, useState } from "react";
import { CtaLink } from "./CtaLink";

/**
 * Barra fixa no celular com atalho para a inscrição.
 * O espaço que ela ocupa é reservado no <body> (ver --mobile-bar-h em globals.css),
 * então nunca cobre texto nem rodapé. Ela some enquanto a seção de inscrição está visível.
 */
export function MobileBar() {
  const [hidden, setHidden] = useState(false);

  useEffect(() => {
    const target = document.getElementById("inscricao");
    if (!target || !("IntersectionObserver" in window)) return;
    const io = new IntersectionObserver(([entry]) => setHidden(entry.isIntersecting), { threshold: 0.15 });
    io.observe(target);
    return () => io.disconnect();
  }, []);

  return (
    <div
      className={`fixed inset-x-0 bottom-0 z-30 border-t border-line-dark bg-ink/92 px-4 pt-3 backdrop-blur-md transition-[transform,opacity] duration-300 ease-out-soft md:hidden ${
        hidden ? "pointer-events-none translate-y-full opacity-0" : "translate-y-0 opacity-100"
      }`}
      style={{ paddingBottom: "calc(0.75rem + env(safe-area-inset-bottom))" }}
      aria-hidden={hidden}
      inert={hidden}
    >
      <CtaLink className="w-full">Quero participar da imersão</CtaLink>
    </div>
  );
}
