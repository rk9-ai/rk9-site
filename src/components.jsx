// Shared: Logo, Nav, Footer, language context, page wrapper.

import { useState, createContext, useContext } from "react";

// ── Language context ─────────────────────────────────────────────────
export const LangCtx = createContext({ lang: "fi", setLang: () => {}, t: (k) => k });
export const useLang = () => useContext(LangCtx);

// ── Logo marks — three variants ──────────────────────────────────────
// Same wordmark ("RK9.ai") for all; the symbol differs.
//   grid  — 3×3 of dots, one filled (kept from v1)
//   pulse — concentric rings, animated radar pulse
//   bars  — three vertical bars at varying heights, status-meter feel
export function LogoMark({ variant = "grid", size = 26, live = false }) {
  if (variant === "pulse") {
    return (
      <svg width={size} height={size} viewBox="0 0 26 26" fill="none" aria-hidden="true">
        <circle cx="13" cy="13" r="11" stroke="currentColor" strokeWidth="1.1" opacity="0.35" />
        <circle cx="13" cy="13" r="7" stroke="currentColor" strokeWidth="1.1" opacity="0.6" />
        <circle cx="13" cy="13" r="3" fill="currentColor" />
        {live && (
          <circle cx="13" cy="13" r="3" fill="none" stroke="currentColor" strokeWidth="1">
            <animate attributeName="r" values="3;11" dur="2.4s" repeatCount="indefinite" />
            <animate attributeName="opacity" values="0.6;0" dur="2.4s" repeatCount="indefinite" />
          </circle>
        )}
      </svg>
    );
  }
  if (variant === "bars") {
    return (
      <svg width={size} height={size} viewBox="0 0 26 26" fill="none" aria-hidden="true">
        {[
          { x: 4,  h: 12, d: "0s" },
          { x: 10, h: 20, d: "0.3s" },
          { x: 16, h: 8,  d: "0.6s" },
          { x: 22, h: 16, d: "0.15s" },
        ].map((b, i) => {
          const y = (26 - b.h) / 2;
          return (
            <rect key={i} x={b.x - 1.5} y={y} width="3" height={b.h} fill="currentColor" rx="0.5">
              {live && (
                <animate attributeName="height" values={`${b.h};${Math.max(4, b.h-6)};${b.h}`} dur="2.4s" begin={b.d} repeatCount="indefinite" />
              )}
              {live && (
                <animate attributeName="y" values={`${y};${y+3};${y}`} dur="2.4s" begin={b.d} repeatCount="indefinite" />
              )}
            </rect>
          );
        })}
      </svg>
    );
  }
  // grid — kept
  return (
    <svg width={size} height={size} viewBox="0 0 26 26" fill="none" aria-hidden="true">
      {[0,1,2].map(r => [0,1,2].map(c => {
        const filled = (r === 1 && c === 1) || (r === 0 && c === 2);
        return (
          <circle key={r+"-"+c} cx={4 + c*9} cy={4 + r*9} r={filled ? 2.4 : 1.4}
            fill={filled ? "currentColor" : "none"}
            stroke="currentColor" strokeWidth="1.2"/>
        );
      }))}
    </svg>
  );
}

export function Logo({ variant = "grid", onClick, live = false }) {
  return (
    <button className="logo" onClick={onClick} aria-label="RK9 AI">
      <span className="logo-mark"><LogoMark variant={variant} live={live} /></span>
      <span className="logo-text">RK9<span className="dim">.ai</span></span>
    </button>
  );
}

// ── Status pill ──────────────────────────────────────────────────────
export function Pill({ children, live = false }) {
  return (
    <span className={"pill" + (live ? " live" : "")}>
      <span className="pulse" />
      <span>{children}</span>
    </span>
  );
}

// ── Nav ──────────────────────────────────────────────────────────────
const NAV_ITEMS = [
  { key: "index",   path: "home" },
  { key: "about",   path: "about" },
  { key: "contact", path: "contact" },
  { key: "privacy", path: "privacy" },
];

export function Nav({ route, navigate, logoVariant }) {
  const { lang, setLang, t } = useLang();
  const [open, setOpen] = useState(false);
  const active = route.split("/")[0];

  return (
    <nav className="nav">
      <div className="wrap nav-inner">
        <Logo variant={logoVariant} onClick={() => { navigate("home"); setOpen(false); }} live={true} />

        <div className={"nav-links" + (open ? " open" : "")}>
          {NAV_ITEMS.map((it, i) => (
            <button
              key={it.key}
              className={"nav-link" + (active === it.path ? " active" : "")}
              onClick={() => { navigate(it.path); setOpen(false); }}
            >
              <span className="nav-idx">§{String(i+1).padStart(2,"0")}</span>
              <span>{t("nav." + it.key)}</span>
            </button>
          ))}
        </div>

        <div className="nav-right">
          <div className="lang-switch" role="tablist" aria-label="Language">
            <button className={lang === "fi" ? "active" : ""} onClick={() => setLang("fi")} aria-label="Suomi">FI</button>
            <button className={lang === "en" ? "active" : ""} onClick={() => setLang("en")} aria-label="English">EN</button>
          </div>
          <button className="nav-mobile-toggle" onClick={() => setOpen(o => !o)}>
            {open ? "×" : "≡"}
          </button>
        </div>
      </div>
    </nav>
  );
}

// ── Footer ───────────────────────────────────────────────────────────
export function Footer({ navigate, logoVariant }) {
  const { t, lang } = useLang();
  return (
    <footer className="footer">
      <div className="wrap">
        <div className="footer-grid">
          <div className="footer-col footer-brand">
            <Logo variant={logoVariant} onClick={() => navigate("home")} />
            <p className="footer-colophon">{t("footer.colophon")}</p>
          </div>
          <div className="footer-col">
            <h4>{t("nav.index")}</h4>
            <ul>
              <li><button onClick={() => navigate("home")}>{t("nav.index")}</button></li>
              <li><button onClick={() => navigate("about")}>{t("nav.about")}</button></li>
            </ul>
          </div>
          <div className="footer-col">
            <h4>{t("nav.contact")}</h4>
            <ul>
              <li><button onClick={() => navigate("contact")}>{t("nav.contact")}</button></li>
              <li><a href="mailto:mikko-ville.lahti@rk9.fi">mikko-ville.lahti@rk9.fi</a></li>
            </ul>
          </div>
          <div className="footer-col">
            <h4>{t("nav.privacy")}</h4>
            <ul>
              <li><button onClick={() => navigate("privacy")}>{t("nav.privacy")}</button></li>
            </ul>
          </div>
        </div>
        <div className="footer-bottom">
          <span>{t("footer.imprint")}</span>
          <span className="mono">rk9.fi · {lang.toUpperCase()} · v2026.05</span>
        </div>
      </div>
    </footer>
  );
}

// ── Page wrapper ─────────────────────────────────────────────────────
export function PageBody({ children, screenLabel }) {
  return (
    <main className="page-content" data-screen-label={screenLabel}>
      {children}
    </main>
  );
}

// ── Section header — reused across pages ────────────────────────────
export function SectionHead({ idx, kicker, title, intro, children }) {
  return (
    <div className="sec-head">
      <div className="left">
        <span className="kicker">
          {idx && <span className="sec-idx">§{idx}</span>}
          <span className="dot" /> {kicker}
        </span>
        <h2 className="display display-md">{title}</h2>
      </div>
      <div className="right">
        {intro && <p className="lede">{intro}</p>}
        {children}
      </div>
    </div>
  );
}

// ── Arrow icon ───────────────────────────────────────────────────────
export function Arrow() { return <span className="arrow" aria-hidden="true">→</span>; }
