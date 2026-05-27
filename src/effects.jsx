// Technical flourishes: crosshair / coords HUD, agent network canvas,
// animated counter, activity ticker, on-view reveal hook.

import { useState, useEffect, useRef } from "react";
import { useLang } from "./components.jsx";

// ── On-view reveal (IntersectionObserver) ────────────────────────────
export function useInView(opts) {
  const ref = useRef(null);
  const [inView, setInView] = useState(false);
  useEffect(() => {
    if (!ref.current) return;
    const io = new IntersectionObserver(([e]) => {
      if (e.isIntersecting) {
        setInView(true);
        io.disconnect();
      }
    }, { threshold: 0.2, ...opts });
    io.observe(ref.current);
    return () => io.disconnect();
  }, []);
  return [ref, inView];
}

// ── Animated counter ────────────────────────────────────────────────
export function AnimatedNumber({ value, suffix = "", prefix = "", duration = 1400 }) {
  const [ref, inView] = useInView();
  const [n, setN] = useState(0);
  useEffect(() => {
    if (!inView) return;
    let raf;
    const start = performance.now();
    const tick = (now) => {
      const t = Math.min(1, (now - start) / duration);
      // ease-out cubic
      const eased = 1 - Math.pow(1 - t, 3);
      setN(value * eased);
      if (t < 1) raf = requestAnimationFrame(tick);
      else setN(value);
    };
    raf = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(raf);
  }, [inView, value, duration]);
  const display = Number.isInteger(value)
    ? Math.round(n).toLocaleString("fi-FI")
    : n.toFixed(1);
  return (
    <span ref={ref} className="tnum">
      {prefix}{display}{suffix}
    </span>
  );
}

// ── Coordinate HUD — fixed bottom-left ──────────────────────────────
export function CoordsHud({ route }) {
  const [pos, setPos] = useState({ x: 0, y: 0 });
  const [scroll, setScroll] = useState(0);
  const [time, setTime] = useState(() => new Date());

  useEffect(() => {
    const onMove = (e) => setPos({ x: e.clientX, y: e.clientY });
    const onScroll = () => {
      const max = document.documentElement.scrollHeight - window.innerHeight;
      setScroll(max > 0 ? window.scrollY / max : 0);
    };
    const id = setInterval(() => setTime(new Date()), 1000);
    window.addEventListener("mousemove", onMove, { passive: true });
    window.addEventListener("scroll", onScroll, { passive: true });
    onScroll();
    return () => {
      window.removeEventListener("mousemove", onMove);
      window.removeEventListener("scroll", onScroll);
      clearInterval(id);
    };
  }, []);

  const pad = (n) => String(n).padStart(2, "0");
  const t = `${pad(time.getHours())}:${pad(time.getMinutes())}:${pad(time.getSeconds())}`;

  return (
    <div className="hud" aria-hidden="true">
      <div className="hud-row">
        <span className="hud-k">RTE</span>
        <span className="hud-v">/{route || "home"}</span>
      </div>
      <div className="hud-row">
        <span className="hud-k">XY</span>
        <span className="hud-v">{String(pos.x).padStart(4,"0")},{String(pos.y).padStart(4,"0")}</span>
      </div>
      <div className="hud-row">
        <span className="hud-k">SCR</span>
        <span className="hud-v">{(scroll * 100).toFixed(0).padStart(3,"0")}%</span>
      </div>
      <div className="hud-row">
        <span className="hud-k">UTC+3</span>
        <span className="hud-v">{t}</span>
      </div>
    </div>
  );
}

// ── Agent network canvas ────────────────────────────────────────────
// Three variants, picked by `variant` prop:
//   "network" — organic Fibonacci dispersion + pulse arcs through center
//   "orbit"   — concentric rings of agents revolving at different speeds
//   "mesh"    — orthogonal lattice with neighbor lines and ripple activations
export function AgentNetwork({ variant = "network", count = 85 }) {
  const canvasRef = useRef(null);
  const wrapRef = useRef(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    const wrap = wrapRef.current;
    if (!canvas || !wrap) return;
    const ctx = canvas.getContext("2d");

    let dpr = Math.min(2, window.devicePixelRatio || 1);
    let w = 0, h = 0;
    let state = {};

    function generate() {
      if (variant === "orbit") {
        const rings = [
          { r: 0.16, count: 6,  speed: 0.00012, dir: 1 },
          { r: 0.25, count: 12, speed: 0.00008, dir: -1 },
          { r: 0.34, count: 22, speed: 0.00005, dir: 1 },
          { r: 0.43, count: 45, speed: 0.00003, dir: -1 },
        ];
        const agents = [];
        rings.forEach((ring, ri) => {
          for (let i = 0; i < ring.count; i++) {
            agents.push({
              ring: ri,
              angle: (i / ring.count) * Math.PI * 2 + Math.random() * 0.08,
              size: 1.6 + (i % 6 === 0 ? 0.6 : 0),
              alpha: 0.55 + Math.random() * 0.35,
            });
          }
        });
        state = { variant, rings, agents, comets: [], lastComet: 0 };
      } else if (variant === "mesh") {
        const cols = 11;
        const rows = 9;
        const gap = 0.075;
        const x0 = 0.5 - (cols - 1) / 2 * gap;
        const y0 = 0.5 - (rows - 1) / 2 * gap;
        const humanCol = Math.floor(cols / 2);
        const humanRow = Math.floor(rows / 2);
        const nodes = [];
        for (let r = 0; r < rows; r++) {
          for (let c = 0; c < cols; c++) {
            if (r === humanRow && c === humanCol) continue;
            if (((r * 13 + c * 7) % 14) === 0) continue;
            nodes.push({
              c, r,
              bx: x0 + c * gap,
              by: y0 + r * gap,
              phase: Math.random() * Math.PI * 2,
            });
          }
        }
        state = {
          variant, nodes, ripples: [], lastRipple: 0,
          cols, rows, humanCol, humanRow, gap, x0, y0,
        };
      } else {
        // network (default)
        const nodes = new Array(count).fill(0).map((_, i) => {
          const golden = 137.508 * Math.PI / 180;
          const a = i * golden + (i % 3) * 0.1;
          const r = 0.18 + Math.sqrt(i / count) * 0.34 + ((i % 7) * 0.005);
          const aspect = (w / h) || 2;
          const x = 0.5 + Math.cos(a) * r;
          const y = 0.5 + Math.sin(a) * r * (aspect / 2 + 0.2);
          return {
            bx: x, by: y,
            phase: Math.random() * Math.PI * 2,
            speed: 0.4 + Math.random() * 0.6,
            alpha: 0.35 + Math.random() * 0.5,
          };
        });
        state = { variant, nodes, pulses: [], lastSpawn: 0 };
      }
    }

    function resize() {
      const r = wrap.getBoundingClientRect();
      w = r.width; h = r.height;
      canvas.width = Math.round(w * dpr);
      canvas.height = Math.round(h * dpr);
      canvas.style.width = w + "px";
      canvas.style.height = h + "px";
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
      generate();
    }
    resize();
    const ro = new ResizeObserver(resize);
    ro.observe(wrap);

    function cssvar(name, fallback) {
      const v = getComputedStyle(document.documentElement).getPropertyValue(name).trim();
      return v || fallback;
    }

    let running = true;
    let lastNow = performance.now();
    function frame(now) {
      if (!running) return;
      // Skip frames before the wrap has a real size (e.g. mid-remount on
      // language switch) — avoids transient negative/zero arc radii.
      if (w <= 0 || h <= 0) { requestAnimationFrame(frame); return; }
      const dt = Math.min(50, now - lastNow); lastNow = now;
      const ink = cssvar("--ink", "#14130f");
      const accent = cssvar("--accent", "#1d3a6a");
      const isDark = document.documentElement.dataset.theme === "dark";

      ctx.clearRect(0, 0, w, h);
      const cx = w * 0.5, cy = h * 0.5;
      const minDim = Math.min(w, h);

      if (state.variant === "orbit") {
        // rings
        state.rings.forEach((ring) => {
          const rad = ring.r * minDim;
          ctx.save();
          ctx.strokeStyle = isDark ? "rgba(255,255,255,0.10)" : "rgba(0,0,0,0.11)";
          ctx.setLineDash([2, 5]);
          ctx.beginPath();
          ctx.arc(cx, cy, rad, 0, Math.PI * 2);
          ctx.stroke();
          ctx.setLineDash([]);
          ctx.restore();
        });
        // diametric crosshair (subtle frame cue)
        ctx.save();
        ctx.strokeStyle = isDark ? "rgba(255,255,255,0.04)" : "rgba(0,0,0,0.05)";
        ctx.beginPath();
        ctx.moveTo(cx, cy - minDim*0.48); ctx.lineTo(cx, cy + minDim*0.48);
        ctx.moveTo(cx - minDim*0.48, cy); ctx.lineTo(cx + minDim*0.48, cy);
        ctx.stroke();
        ctx.restore();

        // spawn comets
        if (now - state.lastComet > 1500) {
          const ringIdx = Math.floor(Math.random() * state.rings.length);
          state.comets.push({
            ring: ringIdx,
            angle: Math.random() * Math.PI * 2,
            t: 0, dur: 1600,
          });
          state.lastComet = now;
        }

        // agents
        state.agents.forEach(a => {
          const ring = state.rings[a.ring];
          a.angle += ring.speed * ring.dir * dt;
          const rad = ring.r * minDim;
          const x = cx + Math.cos(a.angle) * rad;
          const y = cy + Math.sin(a.angle) * rad;
          ctx.save();
          ctx.fillStyle = ink;
          ctx.globalAlpha = a.alpha;
          ctx.beginPath();
          ctx.arc(x, y, a.size, 0, Math.PI * 2);
          ctx.fill();
          ctx.restore();
        });

        // comets (accent dot with short trail)
        for (let i = state.comets.length - 1; i >= 0; i--) {
          const c = state.comets[i];
          c.t += dt;
          if (c.t >= c.dur) { state.comets.splice(i, 1); continue; }
          const ring = state.rings[c.ring];
          const ang = c.angle + ring.speed * ring.dir * c.t * 6;
          const rad = ring.r * minDim;
          for (let k = 0; k < 7; k++) {
            const kAng = ang - k * 0.045 * ring.dir;
            const x = cx + Math.cos(kAng) * rad;
            const y = cy + Math.sin(kAng) * rad;
            ctx.save();
            ctx.fillStyle = accent;
            ctx.globalAlpha = (1 - k / 7) * 0.7;
            ctx.beginPath();
            ctx.arc(x, y, Math.max(0, 2.4 - k * 0.22), 0, Math.PI * 2);
            ctx.fill();
            ctx.restore();
          }
        }

        // human
        ctx.save();
        ctx.fillStyle = ink;
        ctx.beginPath();
        ctx.arc(cx, cy, 6, 0, Math.PI * 2);
        ctx.fill();
        ctx.strokeStyle = ink;
        ctx.lineWidth = 1.2;
        const pr = 6 + (Math.sin(now / 600) + 1) * 4;
        ctx.globalAlpha = Math.max(0, 0.28 - (Math.sin(now / 600) + 1) * 0.08);
        ctx.beginPath();
        ctx.arc(cx, cy, Math.max(0, pr + 4), 0, Math.PI * 2);
        ctx.stroke();
        ctx.restore();

      } else if (state.variant === "mesh") {
        // connection lines (orthogonal neighbors)
        ctx.save();
        ctx.strokeStyle = isDark ? "rgba(255,255,255,0.07)" : "rgba(0,0,0,0.08)";
        ctx.lineWidth = 1;
        const nodes = state.nodes;
        for (let i = 0; i < nodes.length; i++) {
          const a = nodes[i];
          for (let j = i+1; j < nodes.length; j++) {
            const b = nodes[j];
            const dc = Math.abs(a.c - b.c), dr = Math.abs(a.r - b.r);
            if ((dc === 1 && dr === 0) || (dc === 0 && dr === 1)) {
              ctx.beginPath();
              ctx.moveTo(a.bx * w, a.by * h);
              ctx.lineTo(b.bx * w, b.by * h);
              ctx.stroke();
            }
          }
        }
        ctx.restore();

        // ripples
        if (now - state.lastRipple > 1100) {
          const start = nodes[Math.floor(Math.random() * nodes.length)];
          if (start) {
            state.ripples.push({
              x: start.bx * w, y: start.by * h,
              t: 0, dur: 1800,
            });
          }
          state.lastRipple = now;
        }
        for (let i = state.ripples.length - 1; i >= 0; i--) {
          const r = state.ripples[i];
          r.t += dt;
          const tFrac = r.t / r.dur;
          if (tFrac >= 1) { state.ripples.splice(i, 1); continue; }
          ctx.save();
          ctx.strokeStyle = accent;
          ctx.globalAlpha = (1 - tFrac) * 0.55;
          ctx.lineWidth = 1.4;
          ctx.beginPath();
          ctx.arc(r.x, r.y, Math.max(0, tFrac * (state.gap * w * 4)), 0, Math.PI * 2);
          ctx.stroke();
          ctx.restore();
        }

        // nodes
        nodes.forEach(n => {
          const x = n.bx * w, y = n.by * h;
          const sh = (Math.sin(now / 800 + n.phase) + 1) / 2;
          ctx.save();
          ctx.fillStyle = ink;
          ctx.globalAlpha = 0.5 + sh * 0.4;
          ctx.beginPath();
          ctx.arc(x, y, 2.4, 0, Math.PI * 2);
          ctx.fill();
          ctx.restore();
        });

        // human as a square at grid center
        const hcx = (state.x0 + state.humanCol * state.gap) * w;
        const hcy = (state.y0 + state.humanRow * state.gap) * h;
        ctx.save();
        ctx.fillStyle = ink;
        ctx.fillRect(hcx - 5, hcy - 5, 10, 10);
        ctx.strokeStyle = ink;
        ctx.lineWidth = 1.2;
        const pulse = (Math.sin(now / 600) + 1) * 4;
        ctx.globalAlpha = Math.max(0, 0.28 - (Math.sin(now / 600) + 1) * 0.08);
        ctx.strokeRect(hcx - 7 - pulse/2, hcy - 7 - pulse/2, 14 + pulse, 14 + pulse);
        ctx.restore();

      } else {
        // ── NETWORK (default) ──
        // moving background grid
        ctx.save();
        ctx.strokeStyle = isDark ? "rgba(255,255,255,0.04)" : "rgba(0,0,0,0.05)";
        ctx.lineWidth = 1;
        const cell = 24;
        ctx.beginPath();
        for (let x = (now / 80) % cell; x < w; x += cell) { ctx.moveTo(x, 0); ctx.lineTo(x, h); }
        for (let y = (now / 80) % cell; y < h; y += cell) { ctx.moveTo(0, y); ctx.lineTo(w, y); }
        ctx.stroke();
        ctx.restore();

        // orchestration ring
        ctx.save();
        ctx.strokeStyle = isDark ? "rgba(255,255,255,0.10)" : "rgba(0,0,0,0.12)";
        ctx.setLineDash([2, 6]);
        ctx.beginPath();
        ctx.arc(cx, cy, minDim * 0.22, 0, Math.PI * 2);
        ctx.stroke();
        ctx.setLineDash([]);
        ctx.restore();
        // outer ring
        ctx.save();
        ctx.strokeStyle = isDark ? "rgba(255,255,255,0.05)" : "rgba(0,0,0,0.06)";
        ctx.beginPath();
        ctx.arc(cx, cy, minDim * 0.46, 0, Math.PI * 2);
        ctx.stroke();
        ctx.restore();

        // spawn pulses
        if (now - state.lastSpawn > 220) {
          if (state.pulses.length < 10) {
            const fromIdx = Math.floor(Math.random() * state.nodes.length);
            const toIdx = Math.floor(Math.random() * state.nodes.length);
            if (fromIdx !== toIdx) {
              state.pulses.push({ from: fromIdx, to: toIdx, t: 0, dur: 900 + Math.random() * 1200 });
            }
          }
          state.lastSpawn = now;
        }
        // pulses
        for (let i = state.pulses.length - 1; i >= 0; i--) {
          const p = state.pulses[i];
          p.t += dt;
          const a = state.nodes[p.from], b = state.nodes[p.to];
          if (!a || !b) { state.pulses.splice(i, 1); continue; }
          const ax = a.bx * w, ay = a.by * h;
          const bx = b.bx * w, by = b.by * h;
          const tFrac = Math.min(1, p.t / p.dur);
          if (tFrac >= 1) { state.pulses.splice(i, 1); continue; }
          const mx = (ax + bx) / 2 * 0.6 + cx * 0.4;
          const my = (ay + by) / 2 * 0.6 + cy * 0.4;
          ctx.save();
          ctx.strokeStyle = accent;
          ctx.globalAlpha = (1 - Math.abs(tFrac - 0.5) * 2) * 0.45;
          ctx.lineWidth = 1;
          ctx.beginPath();
          ctx.moveTo(ax, ay);
          ctx.quadraticCurveTo(mx, my, bx, by);
          ctx.stroke();
          ctx.restore();
          const seg = tFrac;
          const headX = (1-seg)*(1-seg)*ax + 2*(1-seg)*seg*mx + seg*seg*bx;
          const headY = (1-seg)*(1-seg)*ay + 2*(1-seg)*seg*my + seg*seg*by;
          ctx.save();
          ctx.fillStyle = accent;
          ctx.beginPath();
          ctx.arc(headX, headY, 1.8, 0, Math.PI * 2);
          ctx.fill();
          ctx.restore();
        }
        // nodes
        for (let i = 0; i < state.nodes.length; i++) {
          const n = state.nodes[i];
          const x = n.bx * w, y = n.by * h;
          const sh = (Math.sin(now / 700 * n.speed + n.phase) + 1) / 2;
          const a = n.alpha * (0.55 + sh * 0.45);
          ctx.save();
          ctx.fillStyle = ink;
          ctx.globalAlpha = a;
          ctx.beginPath();
          ctx.arc(x, y, 1.6 + (i % 11 === 0 ? 1.2 : 0), 0, Math.PI * 2);
          ctx.fill();
          ctx.restore();
        }
        // human center
        ctx.save();
        ctx.fillStyle = ink;
        ctx.beginPath();
        ctx.arc(cx, cy, 6, 0, Math.PI * 2);
        ctx.fill();
        ctx.strokeStyle = ink;
        ctx.lineWidth = 1.5;
        const pR = 6 + (Math.sin(now / 600) + 1) * 4;
        ctx.globalAlpha = 0.3 - (Math.sin(now / 600) + 1) * 0.1;
        ctx.beginPath();
        ctx.arc(cx, cy, pR + 4, 0, Math.PI * 2);
        ctx.stroke();
        ctx.restore();
      }

      requestAnimationFrame(frame);
    }
    requestAnimationFrame(frame);

    return () => { running = false; ro.disconnect(); };
  }, [variant, count]);

  const label = variant === "orbit" ? "ORBIT.SYS"
              : variant === "mesh"  ? "MESH.GRID"
              : "ORG.GRAPH";

  return (
    <div ref={wrapRef} className="agent-net">
      <canvas ref={canvasRef} />
      <div className="agent-net-label tl">
        <span className="mono">{label}</span>
        <span className="mono dim">N NODES · 1 HUMAN</span>
      </div>
      <div className="agent-net-label br">
        <span className="mono dim">RK9.AI / Λ</span>
      </div>
      <div className="agent-net-corner tr" aria-hidden="true">+</div>
      <div className="agent-net-corner bl" aria-hidden="true">+</div>
    </div>
  );
}

// ── Activity ticker — fake but plausible agent log lines ─────────────
const TICKER_FI = [
  ["07:14:02", "scheduler",    "Yöllinen hinta-arvo päivitetty"],
  ["07:31:48", "worker.04",    "Skannaus valmis (0 violaa)"],
  ["08:02:19", "approval",     "Pyydetty hyväksyntä: hinnastomuutos"],
  ["08:15:33", "human::mvl",   "Approved — proceed"],
  ["09:40:11", "deploy",       "Tuotantojulkaisu #482 ok"],
  ["11:08:55", "sim",          "Varjokarttapäivitys (PostGIS)"],
  ["13:22:01", "support",      "Asiakaspalveluvastaus #1841 (FI)"],
  ["14:55:38", "budget",       "Päivän kulutus 12,40 € / 60,00 €"],
  ["18:30:24", "prospect",     "3 uutta liidiä — k-kauppa"],
  ["22:11:09", "reviews",      "AI-tiivistelmä 41 arvostelulle"],
];
const TICKER_EN = [
  ["07:14:02", "scheduler",    "Overnight pricing refresh complete"],
  ["07:31:48", "worker.04",    "Scan complete (0 violations)"],
  ["08:02:19", "approval",     "Approval requested: pricing change"],
  ["08:15:33", "human::mvl",   "Approved — proceed"],
  ["09:40:11", "deploy",       "Production deploy #482 ok"],
  ["11:08:55", "sim",          "Shadow map updated (PostGIS)"],
  ["13:22:01", "support",      "Support reply #1841 (FI)"],
  ["14:55:38", "budget",       "Today's spend €12.40 / €60.00"],
  ["18:30:24", "prospect",     "3 new leads — retail"],
  ["22:11:09", "reviews",      "AI summary for 41 reviews"],
];

export function ActivityTicker() {
  const { lang } = useLang();
  const rows = lang === "fi" ? TICKER_FI : TICKER_EN;
  const [head, setHead] = useState(0);
  useEffect(() => {
    const id = setInterval(() => setHead(h => (h + 1) % rows.length), 2200);
    return () => clearInterval(id);
  }, [rows.length]);
  // show 5 rows, head as the "active" line
  const view = [];
  for (let i = 0; i < 5; i++) {
    view.push(rows[(head + i) % rows.length]);
  }
  return (
    <div className="ticker">
      <div className="ticker-head">
        <span className="ticker-dot" />
        <span className="mono">{lang === "fi" ? "live · agentti.log" : "live · agent.log"}</span>
        <span className="mono dim" style={{ marginLeft: "auto" }}>tail -f</span>
      </div>
      <div className="ticker-body">
        {view.map((r, i) => (
          <div key={head + "-" + i} className={"ticker-row" + (i === 0 ? " new" : "")}>
            <span className="t">{r[0]}</span>
            <span className="c">{r[1]}</span>
            <span className="m">{r[2]}</span>
          </div>
        ))}
      </div>
    </div>
  );
}

// ── On-scroll reveal wrapper ─────────────────────────────────────────
export function Reveal({ children, delay = 0, as = "div", className = "", style }) {
  const [ref, inView] = useInView();
  const Tag = as;
  return (
    <Tag ref={ref} className={(className ? className + " " : "") + "reveal" + (inView ? " is-in" : "")}
         style={{ transitionDelay: delay + "ms", ...(style || {}) }}>
      {children}
    </Tag>
  );
}
