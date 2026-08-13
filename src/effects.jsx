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
// A rotating 3D knowledge graph in the spirit of Obsidian's graph view:
// a dark field, hundreds of light notes clumped into clusters around hub
// notes, hairline links, and a few amber-tinted clusters. Plain canvas
// 2D with a hand-rolled projection — no dependencies. Drag to spin
// (with inertia); honors prefers-reduced-motion.
const CLUSTERS = 16;
const LOOSE_NODES = 150;

function buildGraph() {
  const nodes = [];
  const golden = Math.PI * (3 - Math.sqrt(5));

  // Normalize a point to a spherical shell with slight thickness.
  const onShell = (x, y, z, shell) => {
    const len = Math.hypot(x, y, z) || 1;
    const r = shell * (0.94 + Math.random() * 0.1);
    return { x: x / len * r, y: y / len * r, z: z / len * r };
  };

  // Cluster hubs spread over the sphere (fibonacci + jitter).
  for (let c = 0; c < CLUSTERS; c++) {
    const y = 1 - (c / (CLUSTERS - 1)) * 2;
    const rr = Math.sqrt(Math.max(0, 1 - y * y));
    const th = c * golden * 5 + 0.9;
    const p = onShell(
      Math.cos(th) * rr + (Math.random() - 0.5) * 0.2,
      y + (Math.random() - 0.5) * 0.2,
      Math.sin(th) * rr + (Math.random() - 0.5) * 0.2,
      1
    );
    // Roughly a fifth of the clusters are amber — like a tag group.
    const amber = c % 5 === 1;
    nodes.push({
      ...p,
      w: 2.6 + Math.random() * 1.6,
      phase: Math.random() * Math.PI * 2,
      amber,
      hub: true,
      cluster: c,
    });
  }

  // Satellites sprayed around each hub.
  for (let c = 0; c < CLUSTERS; c++) {
    const hub = nodes[c];
    const count = 20 + Math.floor(Math.random() * 24);
    const spread = 0.18 + Math.random() * 0.28;
    for (let s = 0; s < count; s++) {
      const p = onShell(
        hub.x + (Math.random() - 0.5) * 2 * spread,
        hub.y + (Math.random() - 0.5) * 2 * spread,
        hub.z + (Math.random() - 0.5) * 2 * spread,
        1
      );
      nodes.push({
        ...p,
        w: 0.7 + Math.random() * (Math.random() < 0.12 ? 1.8 : 0.8),
        phase: Math.random() * Math.PI * 2,
        amber: hub.amber ? Math.random() < 0.75 : Math.random() < 0.03,
        hub: false,
        cluster: c,
      });
    }
  }

  // Loose notes filling the gaps.
  for (let i = 0; i < LOOSE_NODES; i++) {
    const y = 1 - (i / (LOOSE_NODES - 1)) * 2;
    const rr = Math.sqrt(Math.max(0, 1 - y * y));
    const th = i * golden * 3 + 2.2;
    const p = onShell(
      Math.cos(th) * rr + (Math.random() - 0.5) * 0.3,
      y + (Math.random() - 0.5) * 0.3,
      Math.sin(th) * rr + (Math.random() - 0.5) * 0.3,
      1
    );
    nodes.push({
      ...p,
      w: 0.6 + Math.random() * 0.7,
      phase: Math.random() * Math.PI * 2,
      amber: Math.random() < 0.06,
      hub: false,
      cluster: -1,
    });
  }

  const dist2 = (a, b) => {
    const dx = a.x - b.x, dy = a.y - b.y, dz = a.z - b.z;
    return dx * dx + dy * dy + dz * dz;
  };
  const edgeSet = new Set();
  const edges = [];
  const addEdge = (i, j) => {
    if (i === j) return;
    const key = i < j ? i + "-" + j : j + "-" + i;
    if (edgeSet.has(key)) return;
    edgeSet.add(key);
    edges.push([i, j]);
  };
  const nearest = (i, pool, k) => {
    const near = [];
    for (const j of pool) {
      if (j === i) continue;
      near.push([dist2(nodes[i], nodes[j]), j]);
    }
    near.sort((a, b) => a[0] - b[0]);
    return near.slice(0, k).map(n => n[1]);
  };

  const all = nodes.map((_, i) => i);
  for (let i = 0; i < nodes.length; i++) {
    const n = nodes[i];
    if (n.hub) continue;
    // Spoke to the cluster hub (most satellites), or to the nearest note.
    if (n.cluster >= 0 && Math.random() < 0.8) addEdge(i, n.cluster);
    for (const j of nearest(i, all, Math.random() < 0.35 ? 2 : 1)) addEdge(i, j);
  }
  // Hubs: link to the 2 nearest hubs — the backbone.
  const hubIdx = all.slice(0, CLUSTERS);
  for (const h of hubIdx) for (const j of nearest(h, hubIdx, 2)) addEdge(h, j);
  // A handful of long cross-links between clusters — the connective fuzz.
  for (let k = 0; k < 50; k++) {
    addEdge(Math.floor(Math.random() * nodes.length), Math.floor(Math.random() * nodes.length));
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
      // Light notes and an Obsidian-style amber tint on the dark field.
      const note = "#e8e6d5";
      const amber = "#c98f4b";

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
      ctx.strokeStyle = note;
      ctx.globalAlpha = 0.07;
      ctx.setLineDash([2, 6]);
      ctx.beginPath();
      ctx.arc(cx, cy, Math.max(0, R * 1.12), 0, Math.PI * 2);
      ctx.stroke();
      ctx.restore();

      // Edges — hairlines, faded by depth; amber links stay amber.
      ctx.lineWidth = 1;
      for (let e = 0; e < edges.length; e++) {
        const i0 = edges[e][0], i1 = edges[e][1];
        const a = proj[i0], b = proj[i1];
        const d = (a.depth + b.depth) / 2;
        const isAmber = nodes[i0].amber && nodes[i1].amber;
        ctx.save();
        ctx.strokeStyle = isAmber ? amber : note;
        ctx.globalAlpha = (isAmber ? 0.06 : 0.035) + Math.pow(d, 1.5) * (isAmber ? 0.22 : 0.13);
        ctx.beginPath();
        ctx.moveTo(a.x, a.y);
        ctx.lineTo(b.x, b.y);
        ctx.stroke();
        ctx.restore();
      }

      // Signals — a link lights up and a dot travels along it.
      if (!reduced && now - lastSignal > 900 && signals.length < 6) {
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
        ctx.strokeStyle = amber;
        ctx.globalAlpha = (1 - Math.abs(tf - 0.5) * 2) * (0.1 + d * 0.35);
        ctx.beginPath();
        ctx.moveTo(a.x, a.y);
        ctx.lineTo(b.x, b.y);
        ctx.stroke();
        ctx.fillStyle = amber;
        ctx.globalAlpha = (1 - Math.abs(tf - 0.5) * 2) * (0.35 + d * 0.6);
        ctx.beginPath();
        ctx.arc(px, py, Math.max(0, 1.7 * a.persp), 0, Math.PI * 2);
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
        const breathe = reduced ? 0.5 : (Math.sin(now / 1600 + n.phase) + 1) / 2;
        const r = Math.max(0.35, (0.8 + n.w * 1.05) * (0.45 + 0.55 * p.depth) * p.persp);
        const col = n.amber ? amber : note;
        ctx.save();
        // Soft glow under the bigger notes — the Obsidian shimmer.
        if (n.w > 1.6) {
          ctx.fillStyle = col;
          ctx.globalAlpha = (0.03 + Math.pow(p.depth, 1.6) * 0.09) * (0.7 + breathe * 0.3);
          ctx.beginPath();
          ctx.arc(p.x, p.y, r * 2.6, 0, Math.PI * 2);
          ctx.fill();
        }
        ctx.fillStyle = col;
        ctx.globalAlpha = (0.17 + Math.pow(p.depth, 1.4) * 0.78) * (n.hub ? 0.95 : 0.7 + breathe * 0.3);
        ctx.beginPath();
        ctx.arc(p.x, p.y, r, 0, Math.PI * 2);
        ctx.fill();
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
