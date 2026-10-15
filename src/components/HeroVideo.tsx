"use client";

import { useEffect, useRef } from "react";

/**
 * Vídeo de fundo do topo. O arquivo já vem desfocado, escurecido e sem áudio (scripts/preparar-video.sh),
 * então o navegador não precisa aplicar filtro. Regras para não pesar:
 * - só começa a carregar depois que a página terminou de carregar;
 * - não carrega com movimento reduzido, economia de dados ou conexão 2G (fica só a imagem de capa);
 * - pausa quando sai da tela.
 */
export function HeroVideo({ mp4, webm, poster }: { mp4: string; webm: string; poster: string }) {
  const ref = useRef<HTMLVideoElement>(null);

  useEffect(() => {
    const v = ref.current;
    if (!v || (!mp4 && !webm)) return;
    const reduce = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    const conn = (navigator as Navigator & { connection?: { saveData?: boolean; effectiveType?: string } }).connection;
    const lowData = conn?.saveData === true || /(^|-)2g$/.test(conn?.effectiveType ?? "");
    if (reduce || lowData) return;

    let started = false;
    let timer = 0;
    const start = () => {
      if (started) return;
      started = true;
      const useWebm = webm && v.canPlayType('video/webm; codecs="vp9"') !== "";
      v.src = useWebm ? webm : mp4 || webm;
      v.load();
      v.play().catch(() => {});
    };
    const arm = () => {
      timer = window.setTimeout(start, 500);
    };
    if (document.readyState === "complete") arm();
    else window.addEventListener("load", arm, { once: true });

    const io = new IntersectionObserver(([e]) => {
      if (!started) return;
      if (e.isIntersecting) v.play().catch(() => {});
      else v.pause();
    });
    io.observe(v);

    return () => {
      window.clearTimeout(timer);
      window.removeEventListener("load", arm);
      io.disconnect();
    };
  }, [mp4, webm]);

  return (
    <video
      ref={ref}
      muted
      loop
      playsInline
      preload="none"
      poster={poster || undefined}
      aria-hidden="true"
      tabIndex={-1}
      disablePictureInPicture
      className="absolute inset-0 h-full w-full object-cover"
    />
  );
}
