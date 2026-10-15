"use client";

import { useEffect, useRef } from "react";

/**
 * Crachá pendurado em um cordão, com física simples (Verlet) e sem biblioteca.
 * - Cordão em "V" preso acima da área visível, com a logo estampada em linha reta.
 * - Presilha na borda de cima do crachá, que balança junto com ele.
 * - Arraste com o mouse ou o dedo na horizontal; um toque rápido dá um empurrão.
 * - Movimento reduzido: crachá parado, sem física.
 * Decorativo: fica fora da árvore de acessibilidade.
 */

type Particle = { x: number; y: number; px: number; py: number; im: number };

const CARD = { w: 560, h: 871 }; // proporção da arte do crachá
const CLIP = { w: 721, h: 1515 }; // proporção da presilha (vista de frente)
const LOGO = { w: 520, h: 108 }; // proporção da logo do cordão
const CLIP_RING = { x: 0.417, y: 0.197 }; // centro do anel dentro da imagem da presilha
const CLIP_BODY_X = 0.597; // centro do corpo da presilha (o anel fica deslocado para a esquerda)

const SEGMENTS = 8; // pontos por tira do cordão
const STEP = 1000 / 60;
const ITER = 12;

export function Cracha({
  image,
  clip,
  strapLogo,
  className = "",
}: {
  image: string;
  clip: string;
  strapLogo: string;
  className?: string;
}) {
  const stageRef = useRef<HTMLDivElement>(null);
  const groupRef = useRef<HTMLDivElement>(null);
  const cardRef = useRef<HTMLDivElement>(null);
  const clipRef = useRef<HTMLImageElement>(null);
  const svgRef = useRef<SVGSVGElement>(null);

  useEffect(() => {
    const stage = stageRef.current;
    const group = groupRef.current;
    const card = cardRef.current;
    const clipEl = clipRef.current;
    const svg = svgRef.current;
    if (!stage || !group || !card || !clipEl || !svg) return;

    const reduce = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    const edgePaths = Array.from(svg.querySelectorAll<SVGPathElement>("[data-edge]"));
    const bodyPaths = Array.from(svg.querySelectorAll<SVGPathElement>("[data-body]"));
    const LOGO_AT = [0.26, 0.66]; // posição de cada logo ao longo da tira (fração do comprimento)
    const logoEls = [0, 1].map((i) => Array.from(svg.querySelectorAll<SVGImageElement>(`[data-logo="${i}"]`)));

    // ---------- estado da simulação
    let W = 0;
    let H = 0;
    let s = 1;
    let rw = 22;
    let lw = 0;
    let lh = 0;
    let body: Particle[] = [];
    let bodyCons: { a: number; b: number; d: number }[] = [];
    let strands: Particle[][] = [];
    let segRest: number[] = [];
    let dragging: null | {
      id: number;
      g: Particle;
      cons: { a: Particle; d: number }[];
      tx: number;
      ty: number;
      x0: number;
      y0: number;
      t0: number;
      maxReach: number;
      left: number;
      right: number;
      below: number;
    } = null;
    let raf = 0;
    let running = false;
    let last = 0;
    let acc = 0;
    let still = 0;
    let visible = false;
    let nudged = false;

    const mk = (x: number, y: number, im: number): Particle => ({ x, y, px: x, py: y, im });

    function build() {
      W = stage!.clientWidth;
      H = stage!.clientHeight;
      if (!W || !H) return false;
      // escala do crachá: cabe na largura (52%) e na altura disponível
      const sW = (W * 0.52) / 200;
      const sH = (H - 150 - 36) / (66 + (200 * CARD.h) / CARD.w);
      s = Math.max(0.5, Math.min(1.1, sW, sH));
      const cw = 200 * s;
      const ch = (cw * CARD.h) / CARD.w;
      const clipH = 130 * s;
      const clipW = (clipH * CLIP.w) / CLIP.h;
      const d = clipH * (1 - CLIP_RING.y) - clipH * 0.2; // anel → borda de cima do crachá (a presilha cobre 20% da altura, sem tapar a logo do crachá)
      const off = (CLIP_BODY_X - CLIP_RING.x) * clipW; // o corpo da presilha fica à direita do anel; o crachá se centraliza no corpo
      rw = 22 * s;
      lh = rw * 0.45;
      lw = (lh * LOGO.w) / LOGO.h;

      // DOM do crachá (origem no anel da presilha)
      card!.style.width = `${cw}px`;
      card!.style.height = `${ch}px`;
      card!.style.left = `${off - cw / 2}px`;
      card!.style.top = `${d}px`;
      card!.style.borderRadius = `${cw * 0.035}px`;
      clipEl!.style.width = `${clipW}px`;
      clipEl!.style.height = `${clipH}px`;
      clipEl!.style.left = `${-CLIP_RING.x * clipW}px`;
      clipEl!.style.top = `${-CLIP_RING.y * clipH}px`;
      group!.style.width = `${cw}px`;
      group!.style.height = `${d + ch}px`;

      // posição de repouso: crachá perto da base da área
      const py = Math.max(110, Math.min(210, H - (d + ch) - 36));
      const cx = W / 2;
      body = [
        mk(cx - off, py, 1), // 0: anel da presilha
        mk(cx - cw / 2, py + d, 1), // 1: canto sup. esq.
        mk(cx + cw / 2, py + d, 1), // 2: canto sup. dir.
        mk(cx - cw / 2, py + d + ch, 1), // 3: canto inf. esq.
        mk(cx + cw / 2, py + d + ch, 1), // 4: canto inf. dir.
        mk(cx, py + d + ch / 2, 1), // 5: centro
      ];
      bodyCons = [];
      for (let i = 0; i < body.length; i++)
        for (let j = i + 1; j < body.length; j++)
          bodyCons.push({ a: i, b: j, d: Math.hypot(body[j].x - body[i].x, body[j].y - body[i].y) });

      // dois lados do cordão, presos acima da área visível
      const ax = Math.min(80 * s, W * 0.2);
      strands = [];
      segRest = [];
      for (const sign of [-1, 1]) {
        const a = { x: cx + sign * ax, y: -14 };
        const len = Math.hypot(cx - off - a.x, py - a.y) * 1.01;
        const rest = len / SEGMENTS;
        const pts: Particle[] = [];
        for (let i = 0; i <= SEGMENTS; i++) {
          if (i === SEGMENTS) {
            pts.push(body[0]);
            break;
          }
          const t = i / SEGMENTS;
          pts.push(mk(a.x + (cx - off - a.x) * t, a.y + (py - a.y) * t, i === 0 ? 0 : 6));
        }
        strands.push(pts);
        segRest.push(rest);
      }
      logoEls.forEach((els) =>
        els.forEach((el) => {
          el.setAttribute("width", String(lw));
          el.setAttribute("height", String(lh));
        }),
      );
      bodyPaths.forEach((p) => p.setAttribute("stroke-width", String(rw)));
      edgePaths.forEach((p) => p.setAttribute("stroke-width", String(rw + 2.5)));
      return true;
    }

    // ---------- restrições
    function eq(a: Particle, b: Particle, d: number) {
      const dx = b.x - a.x;
      const dy = b.y - a.y;
      const dist = Math.hypot(dx, dy) || 1e-6;
      const w = a.im + b.im;
      if (!w) return;
      const k = (dist - d) / dist;
      const ca = a.im / w;
      const cb = b.im / w;
      a.x += dx * k * ca;
      a.y += dy * k * ca;
      b.x -= dx * k * cb;
      b.y -= dy * k * cb;
    }
    function rope(a: Particle, b: Particle, d: number) {
      const dx = b.x - a.x;
      const dy = b.y - a.y;
      const dist = Math.hypot(dx, dy);
      if (dist <= d) return;
      eq(a, b, d);
    }

    const G = (1500 * STEP * STEP) / 1e6; // gravidade em px/passo²
    function simulate() {
      const all: Particle[] = [];
      for (const st of strands) for (let i = 1; i < st.length - 1; i++) all.push(st[i]);
      const chainEnd = all.length;
      for (const p of body) all.push(p);
      let move = 0;
      for (let i = 0; i < all.length; i++) {
        const p = all[i];
        const damp = i < chainEnd ? 0.985 : 0.988;
        let vx = (p.x - p.px) * damp;
        let vy = (p.y - p.py) * damp;
        const sp = Math.hypot(vx, vy);
        if (sp > 45) {
          vx *= 45 / sp;
          vy *= 45 / sp;
        }
        p.px = p.x;
        p.py = p.y;
        p.x += vx;
        p.y += vy + G;
      }
      for (let it = 0; it < ITER; it++) {
        strands.forEach((st, k) => {
          for (let i = 0; i < st.length - 1; i++) rope(st[i], st[i + 1], segRest[k]);
        });
        for (const c of bodyCons) eq(body[c.a], body[c.b], c.d);
        if (dragging) {
          for (const c of dragging.cons) eq(c.a, dragging.g, c.d);
          dragging.g.x = dragging.tx;
          dragging.g.y = dragging.ty;
        }
        for (const p of all) {
          if (p.x < 6) p.x = 6;
          else if (p.x > W - 6) p.x = W - 6;
          if (p.y > H - 6) p.y = H - 6;
        }
      }
      for (const p of all) move = Math.max(move, Math.abs(p.x - p.px) + Math.abs(p.y - p.py));
      return move;
    }

    // ---------- desenho
    function smooth(pts: Particle[]) {
      let d = `M${pts[0].x.toFixed(1)} ${pts[0].y.toFixed(1)}`;
      for (let i = 0; i < pts.length - 1; i++) {
        const p0 = pts[i - 1] || pts[i];
        const p1 = pts[i];
        const p2 = pts[i + 1];
        const p3 = pts[i + 2] || p2;
        d += `C${(p1.x + (p2.x - p0.x) / 6).toFixed(1)} ${(p1.y + (p2.y - p0.y) / 6).toFixed(1)} ${(p2.x - (p3.x - p1.x) / 6).toFixed(1)} ${(p2.y - (p3.y - p1.y) / 6).toFixed(1)} ${p2.x.toFixed(1)} ${p2.y.toFixed(1)}`;
      }
      return d;
    }
    function render() {
      const p = body[0];
      const th = Math.atan2(body[2].y - body[1].y, body[2].x - body[1].x);
      group!.style.transform = `translate(${p.x.toFixed(2)}px,${p.y.toFixed(2)}px) rotate(${th.toFixed(4)}rad)`;
      strands.forEach((st, k) => {
        const d = smooth(st);
        edgePaths[k]?.setAttribute("d", d);
        bodyPaths[k]?.setAttribute("d", d);
        // logos em linha reta ao longo da tira
        const cum = [0];
        for (let i = 1; i < st.length; i++) cum.push(cum[i - 1] + Math.hypot(st[i].x - st[i - 1].x, st[i].y - st[i - 1].y));
        const total = cum[cum.length - 1];
        logoEls[k].forEach((el, n) => {
          const dd = total * LOGO_AT[n];
          let i = 1;
          while (i < cum.length - 1 && cum[i] < dd) i++;
          const seg = cum[i] - cum[i - 1] || 1;
          const t = (dd - cum[i - 1]) / seg;
          const x = st[i - 1].x + (st[i].x - st[i - 1].x) * t;
          const y = st[i - 1].y + (st[i].y - st[i - 1].y) * t;
          const ang = (Math.atan2(st[i].y - st[i - 1].y, st[i].x - st[i - 1].x) * 180) / Math.PI;
          el.setAttribute("opacity", "0.92");
          el.setAttribute("transform", `translate(${x.toFixed(1)} ${y.toFixed(1)}) rotate(${ang.toFixed(1)}) translate(${-lw / 2} ${-lh / 2})`);
        });
      });
    }

    // ---------- laço
    function frame(t: number) {
      raf = 0;
      if (!running) return;
      acc += Math.min(t - last, 50);
      last = t;
      let steps = 0;
      let move = 0;
      while (acc >= STEP && steps < 3) {
        move = Math.max(move, simulate());
        acc -= STEP;
        steps++;
      }
      render();
      if (!dragging && move < 0.02) still++;
      else still = 0;
      if (still > 90 || !visible) {
        running = false;
        return;
      }
      raf = requestAnimationFrame(frame);
    }
    function wake() {
      still = 0;
      if (running) return;
      running = true;
      last = performance.now();
      acc = 0;
      raf = requestAnimationFrame(frame);
    }
    function nudge(vx: number) {
      for (const p of body) p.px -= vx;
      wake();
    }

    // ---------- interação
    function pos(e: PointerEvent) {
      const r = stage!.getBoundingClientRect();
      return { x: e.clientX - r.left, y: e.clientY - r.top };
    }
    function onDown(e: PointerEvent) {
      if (reduce || dragging || (e.pointerType === "mouse" && e.button !== 0)) return;
      const m = pos(e);
      const g = mk(m.x, m.y, 0);
      const gd = Math.hypot(m.x - body[0].x, m.y - body[0].y);
      const mid = { x: W / 2, y: -14 };
      const reach = Math.hypot(body[0].x - mid.x, body[0].y - mid.y) + 40 + gd; // alcance máximo para o ponto agarrado
      dragging = {
        id: e.pointerId,
        g,
        cons: body.map((a) => ({ a, d: Math.hypot(a.x - m.x, a.y - m.y) })),
        tx: m.x,
        ty: m.y,
        x0: m.x,
        y0: m.y,
        t0: performance.now(),
        maxReach: reach,
        // quanto o corpo se estende ao redor do ponto agarrado: mantém o crachá inteiro dentro da área
        left: m.x - Math.min(...body.map((p) => p.x)),
        right: Math.max(...body.map((p) => p.x)) - m.x,
        below: Math.max(...body.map((p) => p.y)) - m.y,
      };
      group!.setPointerCapture(e.pointerId);
      stage!.dataset.grab = "1";
      wake();
    }
    function onMove(e: PointerEvent) {
      if (!dragging || e.pointerId !== dragging.id) return;
      const m = pos(e);
      const mid = { x: W / 2, y: -14 };
      const dx = m.x - mid.x;
      const dy = m.y - mid.y;
      const dist = Math.hypot(dx, dy);
      const lim = dragging.maxReach;
      const k = dist > lim ? lim / dist : 1;
      dragging.tx = Math.max(6 + dragging.left, Math.min(W - 6 - dragging.right, mid.x + dx * k));
      dragging.ty = Math.min(H - 6 - dragging.below, mid.y + dy * k);
      wake();
    }
    function onUp(e: PointerEvent) {
      if (!dragging || e.pointerId !== dragging.id) return;
      const dr = dragging;
      const m = pos(e);
      dragging = null;
      delete stage!.dataset.grab;
      if (Math.hypot(m.x - dr.x0, m.y - dr.y0) < 6 && performance.now() - dr.t0 < 350) {
        // toque rápido: empurrão para o lado oposto ao toque
        nudge(m.x < body[0].x ? 3.2 : -3.2);
      }
      wake();
    }

    // ---------- inicialização
    if (!build()) return;
    render();
    stage.dataset.ready = "1";
    if (reduce) {
      stage.dataset.static = "1";
      return;
    }

    group.addEventListener("pointerdown", onDown);
    group.addEventListener("pointermove", onMove);
    group.addEventListener("pointerup", onUp);
    group.addEventListener("pointercancel", onUp);

    const io = new IntersectionObserver(
      (entries) => {
        visible = entries.some((e) => e.isIntersecting);
        if (visible) {
          if (!nudged) {
            nudged = true; // balanço inicial, uma única vez
            window.setTimeout(() => nudge(2.4), 350);
          } else wake();
        }
      },
      { threshold: 0.25 },
    );
    io.observe(stage);

    let lastW = W;
    let lastH = H;
    const ro = new ResizeObserver(() => {
      if (Math.abs(stage.clientWidth - lastW) < 2 && Math.abs(stage.clientHeight - lastH) < 2) return;
      lastW = stage.clientWidth;
      lastH = stage.clientHeight;
      dragging = null;
      if (build()) {
        render();
        wake();
      }
    });
    ro.observe(stage);

    return () => {
      cancelAnimationFrame(raf);
      running = false;
      io.disconnect();
      ro.disconnect();
      group.removeEventListener("pointerdown", onDown);
      group.removeEventListener("pointermove", onMove);
      group.removeEventListener("pointerup", onUp);
      group.removeEventListener("pointercancel", onUp);
    };
  }, []);

  return (
    <div ref={stageRef} aria-hidden="true" className={`cracha-stage select-none overflow-hidden ${className}`}>
      <svg ref={svgRef} className="pointer-events-none absolute inset-0 h-full w-full overflow-visible" fill="none">
        {[0, 1].map((k) => (
          <g key={k}>
            <path data-edge="" stroke="#2c2628" strokeLinecap="butt" strokeLinejoin="round" />
            <path data-body="" stroke="#0a0809" strokeLinecap="butt" strokeLinejoin="round" />
            {[0, 1].map((n) => (
              <image key={n} data-logo={k} href={strapLogo} opacity="0" preserveAspectRatio="xMidYMid meet" />
            ))}
          </g>
        ))}
      </svg>
      <div ref={groupRef} className="cracha-group absolute left-0 top-0">
        <div ref={cardRef} className="cracha-card absolute overflow-hidden">
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img src={image} alt="" width={CARD.w} height={CARD.h} draggable={false} loading="lazy" decoding="async" className="h-full w-full object-cover" />
        </div>
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img ref={clipRef} src={clip} alt="" width={CLIP.w} height={CLIP.h} draggable={false} loading="lazy" decoding="async" className="absolute" />
      </div>
    </div>
  );
}
