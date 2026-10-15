"use client";

import { useEffect, useRef } from "react";

type P = { x: number; y: number; vx: number; vy: number; r: number; a: number };

/**
 * Partículas de fundo que reagem ao ponteiro: o mouse afasta de leve e, ao arrastar (mouse apertado ou dedo),
 * as partículas acompanham o movimento. Fica atrás do conteúdo e não captura cliques.
 * Leve de propósito: poucas partículas, para quando sai da tela ou a aba fica oculta,
 * e com movimento reduzido desenha uma vez só, parado.
 */
export function Particulas({ className = "" }: { className?: string }) {
  const ref = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const canvas = ref.current;
    const host = canvas?.parentElement;
    const ctx = canvas?.getContext("2d");
    if (!canvas || !host || !ctx) return;

    const reduce = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    const conn = (navigator as Navigator & { connection?: { saveData?: boolean } }).connection;
    const light = conn?.saveData === true;

    let w = 0;
    let h = 0;
    let dpr = 1;
    let ps: P[] = [];
    let raf = 0;
    let running = false;
    let visible = true;
    const pointer = { x: -9999, y: -9999, px: -9999, py: -9999, down: false, active: false };

    const LINK = 110; // distância máxima para ligar duas partículas
    const REACH = 130; // raio de influência do ponteiro

    const build = () => {
      const rect = host.getBoundingClientRect();
      w = Math.max(1, rect.width);
      h = Math.max(1, rect.height);
      dpr = Math.min(window.devicePixelRatio || 1, 2);
      canvas.width = Math.round(w * dpr);
      canvas.height = Math.round(h * dpr);
      canvas.style.width = `${w}px`;
      canvas.style.height = `${h}px`;
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
      const cap = light ? 28 : w < 640 ? 38 : 80;
      const n = Math.min(cap, Math.round((w * h) / 16000));
      ps = Array.from({ length: n }, () => ({
        x: Math.random() * w,
        y: Math.random() * h,
        vx: (Math.random() - 0.5) * 0.25,
        vy: (Math.random() - 0.5) * 0.25,
        r: 1 + Math.random() * 1.6,
        a: 0.3 + Math.random() * 0.45,
      }));
      draw();
    };

    const draw = () => {
      ctx.clearRect(0, 0, w, h);
      for (let i = 0; i < ps.length; i++) {
        const p = ps[i];
        for (let j = i + 1; j < ps.length; j++) {
          const q = ps[j];
          const dx = p.x - q.x;
          const dy = p.y - q.y;
          const d2 = dx * dx + dy * dy;
          if (d2 < LINK * LINK) {
            ctx.strokeStyle = `rgba(227,145,179,${0.16 * (1 - Math.sqrt(d2) / LINK)})`;
            ctx.lineWidth = 1;
            ctx.beginPath();
            ctx.moveTo(p.x, p.y);
            ctx.lineTo(q.x, q.y);
            ctx.stroke();
          }
        }
      }
      for (const p of ps) {
        ctx.fillStyle = `rgba(230,193,209,${p.a})`;
        ctx.beginPath();
        ctx.arc(p.x, p.y, p.r, 0, Math.PI * 2);
        ctx.fill();
      }
    };

    const step = () => {
      const dragX = pointer.x - pointer.px;
      const dragY = pointer.y - pointer.py;
      for (const p of ps) {
        if (pointer.active) {
          const dx = p.x - pointer.x;
          const dy = p.y - pointer.y;
          const d = Math.hypot(dx, dy);
          if (d < REACH && d > 0.1) {
            const f = 1 - d / REACH;
            if (pointer.down) {
              // arrastar: leva as partículas junto com o movimento
              p.vx += dragX * 0.08 * f;
              p.vy += dragY * 0.08 * f;
            } else {
              // passar o mouse: afasta de leve
              p.vx += (dx / d) * 0.35 * f;
              p.vy += (dy / d) * 0.35 * f;
            }
          }
        }
        // atrito e deriva lenta, para voltar sempre ao movimento calmo
        p.vx *= 0.96;
        p.vy *= 0.96;
        p.vx += (Math.random() - 0.5) * 0.012;
        p.vy += (Math.random() - 0.5) * 0.012;
        const sp = Math.hypot(p.vx, p.vy);
        if (sp > 3) {
          p.vx = (p.vx / sp) * 3;
          p.vy = (p.vy / sp) * 3;
        }
        p.x += p.vx;
        p.y += p.vy;
        if (p.x < -10) p.x = w + 10;
        else if (p.x > w + 10) p.x = -10;
        if (p.y < -10) p.y = h + 10;
        else if (p.y > h + 10) p.y = -10;
      }
      pointer.px = pointer.x;
      pointer.py = pointer.y;
      draw();
    };

    const loop = () => {
      step();
      raf = requestAnimationFrame(loop);
    };
    const update = () => {
      const should = visible && !document.hidden && !reduce;
      if (should && !running) {
        running = true;
        raf = requestAnimationFrame(loop);
      } else if (!should && running) {
        running = false;
        cancelAnimationFrame(raf);
      }
    };

    const toLocal = (e: PointerEvent) => {
      const r = host.getBoundingClientRect();
      return { x: e.clientX - r.left, y: e.clientY - r.top };
    };
    const onMove = (e: PointerEvent) => {
      const { x, y } = toLocal(e);
      if (!pointer.active) {
        pointer.px = x;
        pointer.py = y;
      }
      pointer.x = x;
      pointer.y = y;
      pointer.active = true;
    };
    const onDown = (e: PointerEvent) => {
      onMove(e);
      pointer.down = true;
      // evita selecionar o texto da seção enquanto a pessoa arrasta
      if (e.pointerType === "mouse") host.style.userSelect = "none";
    };
    const onUp = () => {
      pointer.down = false;
      host.style.userSelect = "";
    };
    const onLeave = () => {
      pointer.active = false;
      pointer.down = false;
      host.style.userSelect = "";
      pointer.x = pointer.y = pointer.px = pointer.py = -9999;
    };

    build();
    if (!reduce) {
      host.addEventListener("pointermove", onMove, { passive: true });
      host.addEventListener("pointerdown", onDown, { passive: true });
      window.addEventListener("pointerup", onUp, { passive: true });
      window.addEventListener("pointercancel", onUp, { passive: true });
      host.addEventListener("pointerleave", onLeave, { passive: true });
    }
    const io = new IntersectionObserver(([e]) => {
      visible = e.isIntersecting;
      update();
    });
    io.observe(host);
    const ro = new ResizeObserver(build);
    ro.observe(host);
    document.addEventListener("visibilitychange", update);
    update();

    return () => {
      running = false;
      cancelAnimationFrame(raf);
      io.disconnect();
      ro.disconnect();
      document.removeEventListener("visibilitychange", update);
      host.removeEventListener("pointermove", onMove);
      host.removeEventListener("pointerdown", onDown);
      window.removeEventListener("pointerup", onUp);
      window.removeEventListener("pointercancel", onUp);
      host.removeEventListener("pointerleave", onLeave);
    };
  }, []);

  return <canvas ref={ref} aria-hidden="true" className={`pointer-events-none absolute inset-0 ${className}`} />;
}
