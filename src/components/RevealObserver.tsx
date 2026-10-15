"use client";

import { useEffect } from "react";

/** Revela elementos .reveal ao entrarem na tela. Sem JS ou com movimento reduzido, tudo já fica visível. */
export function RevealObserver() {
  useEffect(() => {
    // Avisa o script do <head> que o observador assumiu (ele desliga o modo .js se isso não acontecer)
    document.documentElement.setAttribute("data-motion-ready", "");
    const els = Array.from(document.querySelectorAll<HTMLElement>(".reveal, [data-reveal]"));
    const brand = document.querySelector<HTMLElement>("[data-brand-m]");
    const reduce = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    if (reduce || !("IntersectionObserver" in window)) {
      els.forEach((el) => el.classList.add("is-visible"));
      brand?.classList.add("is-in");
      return;
    }
    // Momento de marca: dispara uma vez, quando 40% do símbolo aparece
    const brandIo = brand
      ? new IntersectionObserver(
          (entries) => {
            if (entries.some((e) => e.isIntersecting)) {
              brand.classList.add("is-in");
              brandIo?.disconnect();
            }
          },
          { threshold: 0.4 },
        )
      : null;
    if (brand) brandIo?.observe(brand);
    const io = new IntersectionObserver(
      (entries) => {
        entries.forEach((e) => {
          if (e.isIntersecting) {
            e.target.classList.add("is-visible");
            io.unobserve(e.target);
          }
        });
      },
      { rootMargin: "0px 0px -10% 0px", threshold: 0.15 },
    );
    els.forEach((el) => io.observe(el));
    return () => {
      io.disconnect();
      brandIo?.disconnect();
    };
  }, []);
  return null;
}
