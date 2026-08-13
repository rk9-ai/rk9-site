// Technical flourishes: crosshair / coords HUD, vault graph sphere,
// animated counter, on-view reveal hook.

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

// ── Vault graph sphere ──────────────────────────────────────────────
// A rotating 3D knowledge graph (Obsidian-style): notes as points on a
// sphere, links as hairline edges, a few hub notes below the surface.
// Plain canvas 2D with a hand-rolled projection — no dependencies.
// Drag to spin (with inertia); honors prefers-reduced-motion.
const GRAPH_SURFACE = 196;
const GRAPH_HUBS = 7;

function buildGraph() {
  // Deterministic-ish jitter keeps the layout stable across remounts.
  const nodes = [];
  const golden = Math.PI * (3 - Math.sqrt(5));
  for (let i = 0; i < GRAPH_SURFACE; i++) {
    const y = 1 - (i / (GRAPH_SURFACE - 1)) * 2;
    const rr = Math.sqrt(Math.max(0, 1 - y * y));
    const th = i * golden;
    const jitter = 0.97 + ((i * 37) % 11) / 11 * 0.07;
    nodes.push({
      x: Math.cos(th) * rr * jitter,
      y: y * jitter,
      z: Math.sin(th) * rr * jitter,
      w: i % 19 === 0 ? 2.4 : i % 7 === 0 ? 1.6 : 1,
      phase: ((i * 73) % 100) / 100 * Math.PI * 2,
      accent: i % 23 === 0,
    });
  }
  // Hubs: larger notes sitting below the surface.
  for (let i = 0; i < GRAPH_HUBS; i++) {
    const y = 1 - (i / (GRAPH_HUBS - 1)) * 2;
    const rr = Math.sqrt(Math.max(0, 1 - y * y));
    const th = i * golden * 9 + 1.3;
    nodes.push({
      x: Math.cos(th) * rr * 0.55,
      y: y * 0.55,
      z: Math.sin(th) * rr * 0.55,
      w: 3.2,
      phase: i,
      accent: false,
      hub: true,
    });
  }

  const dist2 = (a, b) => {
    const dx = a.x - b.x, dy = a.y - b.y, dz = a.z - b.z;
    return dx * dx + dy * dy + dz * dz;
  };
  const edgeSet = new Set();
  const edges = [];
  const addEdge = (i, j) => {
    const key = i < j ? i + "-" + j : j + "-" + i;
    if (edgeSet.has(key)) return;
    edgeSet.add(key);
    edges.push([i, j]);
  };
  // Surface notes: link to their 2 nearest surface neighbors.
  for (let i = 0; i < GRAPH_SURFACE; i++) {
    const near = [];
    for (let j = 0; j < GRAPH_SURFACE; j++) {
      if (i === j) continue;
      near.push([dist2(nodes[i], nodes[j]), j]);
    }
    near.sort((a, b) => a[0] - b[0]);
    addEdge(i, near[0][1]);
    addEdge(i, near[1][1]);
  }
  // Hubs: link to their 6 nearest surface notes and the next hub.
  for (let h = GRAPH_SURFACE; h < nodes.length; h++) {
    const near = [];
    for (let j = 0; j < GRAPH_SURFACE; j++) near.push([dist2(nodes[h], nodes[j]), j]);
    near.sort((a, b) => a[0] - b[0]);
    for (let k = 0; k < 6; k++) addEdge(h, near[k][1]);
    if (h + 1 < nodes.length) addEdge(h, h + 1);
  }
  return { nodes, edges };
}

export function VaultGraph() {
  const canvasRef = useRef(null);
  const wrapRef = useRef(null);
  const [counts, setCounts] = useState({ nodes: 0, edges: 0 });

  useEffect(() => {
    const canvas = canvasRef.current;
    const wrap = wrapRef.current;
    if (!canvas || !wrap) return;
    const ctx = canvas.getContext("2d");

    const { nodes, edges } = buildGraph();
    setCounts({ nodes: nodes.length, edges: edges.length });

    let dpr = Math.min(2, window.devicePixelRatio || 1);
    let w = 0, h = 0;

    function resize() {
      const r = wrap.getBoundingClientRect();
      w = r.width; h = r.height;
      canvas.width = Math.round(w * dpr);
      canvas.height = Math.round(h * dpr);
      canvas.style.width = w + "px";
      canvas.style.height = h + "px";
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
    }
    resize();
    const ro = new ResizeObserver(() => { resize(); if (reduced) drawFrame(performance.now()); });
    ro.observe(wrap);

    function cssvar(name, fallback) {
      const v = getComputedStyle(document.documentElement).getPropertyValue(name).trim();
      return v || fallback;
    }

    // Rotation state — auto spin + drag with inertia.
    let yaw = 0.6;
    let pitch = 0.32;
    let yawVel = 0;
    const BASE_SPIN = 0.000055; // rad per ms
    let dragging = false;
    let lastX = 0, lastY = 0;

    const signals = []; // dots traveling along an edge
    let lastSignal = 0;

    const reduced = window.matchMedia("(prefers-reduced-motion: reduce)").matches;

    const proj = new Array(nodes.length);

    function drawFrame(now) {
      // Skip frames before the wrap has a real size (e.g. mid-remount on
      // language switch) — avoids transient negative/zero radii.
      if (w <= 0 || h <= 0) return;
      const ink = cssvar("--ink", "#181f1a");
      const accent = cssvar("--accent", "#2d5f4f");

      ctx.clearRect(0, 0, w, h);
      const cx = w * 0.5, cy = h * 0.52;
      const R = Math.min(w, h) * 0.365;
      const F = 3.1; // camera distance in sphere radii

      const cosY = Math.cos(yaw), sinY = Math.sin(yaw);
      const cosP = Math.cos(pitch), sinP = Math.sin(pitch);

      // Project all nodes.
      for (let i = 0; i < nodes.length; i++) {
        const n = nodes[i];
        // rotate around Y, then X
        const x1 = n.x * cosY + n.z * sinY;
        const z1 = -n.x * sinY + n.z * cosY;
        const y2 = n.y * cosP - z1 * sinP;
        const z2 = n.y * sinP + z1 * cosP;
        const persp = F / (F - z2);
        proj[i] = {
          x: cx + x1 * R * persp,
          y: cy + y2 * R * persp,
          z: z2,
          depth: (z2 + 1) / 2, // 0 back … 1 front
          persp,
        };
      }

      // Halo ring behind the sphere — ties the globe to the page frame.
      ctx.save();
      ctx.strokeStyle = ink;
      ctx.globalAlpha = 0.10;
      ctx.setLineDash([2, 6]);
      ctx.beginPath();
      ctx.arc(cx, cy, Math.max(0, R * 1.12), 0, Math.PI * 2);
      ctx.stroke();
      ctx.restore();

      // Edges — hairlines, faded by depth.
      ctx.lineWidth = 1;
      for (let e = 0; e < edges.length; e++) {
        const a = proj[edges[e][0]], b = proj[edges[e][1]];
        const d = (a.depth + b.depth) / 2;
        ctx.save();
        ctx.strokeStyle = ink;
        ctx.globalAlpha = 0.05 + Math.pow(d, 1.8) * 0.26;
        ctx.beginPath();
        ctx.moveTo(a.x, a.y);
        ctx.lineTo(b.x, b.y);
        ctx.stroke();
        ctx.restore();
      }

      // Signals — a link lights up and a dot travels along it.
      if (!reduced && now - lastSignal > 1300 && signals.length < 4) {
        signals.push({ edge: edges[Math.floor(Math.random() * edges.length)], t: 0, dur: 1100 });
        lastSignal = now;
      }
      for (let i = signals.length - 1; i >= 0; i--) {
        const s = signals[i];
        s.t += 16.7;
        const tf = s.t / s.dur;
        if (tf >= 1) { signals.splice(i, 1); continue; }
        const a = proj[s.edge[0]], b = proj[s.edge[1]];
        const d = (a.depth + b.depth) / 2;
        const px = a.x + (b.x - a.x) * tf;
        const py = a.y + (b.y - a.y) * tf;
        ctx.save();
        ctx.strokeStyle = accent;
        ctx.globalAlpha = (1 - Math.abs(tf - 0.5) * 2) * (0.15 + d * 0.4);
        ctx.beginPath();
        ctx.moveTo(a.x, a.y);
        ctx.lineTo(b.x, b.y);
        ctx.stroke();
        ctx.fillStyle = accent;
        ctx.globalAlpha = (1 - Math.abs(tf - 0.5) * 2) * (0.3 + d * 0.6);
        ctx.beginPath();
        ctx.arc(px, py, Math.max(0, 1.6 * a.persp), 0, Math.PI * 2);
        ctx.fill();
        ctx.restore();
      }

      // Nodes — back to front so front notes stay crisp.
      const order = [];
      for (let i = 0; i < nodes.length; i++) order.push(i);
      order.sort((i, j) => proj[i].z - proj[j].z);
      for (let k = 0; k < order.length; k++) {
        const i = order[k];
        const n = nodes[i];
        const p = proj[i];
        const breathe = reduced ? 0.5 : (Math.sin(now / 1400 + n.phase) + 1) / 2;
        const r = Math.max(0.4, (0.9 + n.w * 0.85) * (0.5 + 0.5 * p.depth) * p.persp);
        ctx.save();
        if (n.accent) {
          ctx.fillStyle = accent;
          ctx.globalAlpha = (0.25 + Math.pow(p.depth, 1.4) * 0.65) * (0.6 + breathe * 0.4);
        } else {
          ctx.fillStyle = ink;
          ctx.globalAlpha = (0.14 + Math.pow(p.depth, 1.5) * 0.8) * (n.hub ? 0.9 : 0.75 + breathe * 0.25);
        }
        ctx.beginPath();
        ctx.arc(p.x, p.y, r, 0, Math.PI * 2);
        ctx.fill();
        // Hub notes get a thin halo ring, like an open node in a graph view.
        if (n.hub) {
          ctx.strokeStyle = ink;
          ctx.lineWidth = 1;
          ctx.globalAlpha = 0.12 + p.depth * 0.3;
          ctx.beginPath();
          ctx.arc(p.x, p.y, Math.max(0, r + 3.5 * p.persp), 0, Math.PI * 2);
          ctx.stroke();
        }
        ctx.restore();
      }
    }

    let running = true;
    let lastNow = performance.now();
    function frame(now) {
      if (!running) return;
      const dt = Math.min(50, now - lastNow); lastNow = now;
      if (!dragging) {
        yaw += (BASE_SPIN + yawVel) * dt;
        yawVel *= 0.94; // inertia decay back to base spin
        // gentle pitch wobble around the resting tilt
        pitch += (0.32 + Math.sin(now / 9000) * 0.06 - pitch) * 0.02;
      }
      drawFrame(now);
      requestAnimationFrame(frame);
    }

    // Drag to spin (pointer events cover mouse + touch).
    const onDown = (e) => {
      dragging = true;
      lastX = e.clientX; lastY = e.clientY;
      canvas.setPointerCapture?.(e.pointerId);
      canvas.style.cursor = "grabbing";
    };
    const onMove = (e) => {
      if (!dragging) return;
      const dx = e.clientX - lastX;
      const dy = e.clientY - lastY;
      lastX = e.clientX; lastY = e.clientY;
      yaw += dx * 0.006;
      pitch = Math.max(-1.1, Math.min(1.1, pitch + dy * 0.005));
      yawVel = dx * 0.00035;
      if (reduced) drawFrame(performance.now());
    };
    const onUp = (e) => {
      dragging = false;
      canvas.releasePointerCapture?.(e.pointerId);
      canvas.style.cursor = "grab";
    };
    canvas.addEventListener("pointerdown", onDown);
    window.addEventListener("pointermove", onMove, { passive: true });
    window.addEventListener("pointerup", onUp);
    canvas.style.cursor = "grab";
    canvas.style.touchAction = "none";

    if (reduced) {
      drawFrame(performance.now());
    } else {
      requestAnimationFrame(frame);
    }

    return () => {
      running = false;
      ro.disconnect();
      canvas.removeEventListener("pointerdown", onDown);
      window.removeEventListener("pointermove", onMove);
      window.removeEventListener("pointerup", onUp);
    };
  }, []);

  return (
    <div
      ref={wrapRef}
      className="vault-graph"
      role="img"
      aria-label="RK9 vault — knowledge graph sphere"
    >
      <canvas ref={canvasRef} aria-hidden="true" />
      <div className="vault-graph-label tl">
        <span className="mono">VAULT.GRAPH</span>
        <span className="mono dim">{counts.nodes} NOTES · {counts.edges} LINKS</span>
      </div>
      <div className="vault-graph-label br">
        <span className="mono dim">RK9 · VAULT</span>
      </div>
      <div className="vault-graph-corner tr" aria-hidden="true">+</div>
      <div className="vault-graph-corner bl" aria-hidden="true">+</div>
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
