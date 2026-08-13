// Work, About, Contact, Privacy pages — plus the shared product list.

import { useLang, PageBody, SectionHead, Pill, Arrow } from "./components.jsx";
import { Reveal } from "./effects.jsx";

// ── Products (shared by Work page and the home teaser) ───────────────
export const PRODUCTS = [
  { key: "sunspot",    name: "Sunspot",    domain: "sunspot.fi",    url: "https://sunspot.fi" },
  { key: "saatavilla", name: "Saatavilla", domain: "saatavilla.fi", url: "https://saatavilla.fi" },
  { key: "ololla",     name: "Ololla",     domain: "ololla.fi",     url: "https://ololla.fi" },
];

// Small line-drawn motifs, one per product — same 1.2px stroke language
// as the logo marks.
export function ProductMotif({ kind, size = 34 }) {
  const common = { width: size, height: size, viewBox: "0 0 34 34", fill: "none", "aria-hidden": true };
  if (kind === "sunspot") {
    // sun over a horizon, rays as ticks
    return (
      <svg {...common}>
        <line x1="3" y1="24" x2="31" y2="24" stroke="currentColor" strokeWidth="1.2" />
        <path d="M 9 24 A 8 8 0 0 1 25 24" stroke="currentColor" strokeWidth="1.2" />
        <circle cx="17" cy="21" r="2.2" fill="currentColor" />
        {[[17,8,17,4],[8.5,11,6,8.5],[25.5,11,28,8.5]].map((r, i) => (
          <line key={i} x1={r[0]} y1={r[1]} x2={r[2]} y2={r[3]} stroke="currentColor" strokeWidth="1.2" strokeLinecap="round" />
        ))}
      </svg>
    );
  }
  if (kind === "saatavilla") {
    // calendar of slots, two taken
    return (
      <svg {...common}>
        <rect x="4" y="6" width="26" height="22" stroke="currentColor" strokeWidth="1.2" />
        <line x1="4" y1="12" x2="30" y2="12" stroke="currentColor" strokeWidth="1.2" />
        {[0,1,2].map(r => [0,1,2].map(c => {
          const filled = (r === 0 && c === 1) || (r === 1 && c === 2);
          return (
            <circle key={r+"-"+c} cx={9.5 + c*7.5} cy={16.5 + r*4.5} r={filled ? 1.9 : 1.1}
              fill={filled ? "currentColor" : "none"}
              stroke="currentColor" strokeWidth="1.1" />
          );
        }))}
      </svg>
    );
  }
  // ololla — a cabin by the water
  return (
    <svg {...common}>
      <path d="M 7 16 L 17 7 L 27 16" stroke="currentColor" strokeWidth="1.2" strokeLinejoin="round" />
      <path d="M 9.5 14 L 9.5 25 L 24.5 25 L 24.5 14" stroke="currentColor" strokeWidth="1.2" />
      <rect x="15" y="18.5" width="4" height="6.5" stroke="currentColor" strokeWidth="1.1" />
      <line x1="4" y1="29" x2="30" y2="29" stroke="currentColor" strokeWidth="1.2" strokeDasharray="3 3" />
    </svg>
  );
}

// ── Work ─────────────────────────────────────────────────────────────
export function Work({ navigate }) {
  const { t, lang } = useLang();
  return (
    <PageBody screenLabel="Work">
      <section className="hero" style={{ paddingBottom: "clamp(40px, 5vw, 72px)" }}>
        <div className="wrap">
          <Reveal><div className="kicker"><span className="dot" />{t("work.kicker")}</div></Reveal>
          <div className="spacer-32" />
          <Reveal delay={80}>
            <h1 className="display display-lg" style={{ whiteSpace: "pre-line", marginBottom: 40 }}>
              {t("work.title").split("\n").map((line, i, arr) => (
                <span key={i} style={{ display: "block" }}>
                  {i === arr.length - 1 ? <em>{line}</em> : line}
                </span>
              ))}
            </h1>
          </Reveal>
          <Reveal delay={140}>
            <p className="lede" style={{ maxWidth: "60ch" }}>{t("work.lede")}</p>
          </Reveal>
        </div>
      </section>

      <section className="section" style={{ paddingTop: 0, borderTop: 0 }}>
        <div className="wrap">
          <div className="work-list">
            {PRODUCTS.map((p, i) => (
              <Reveal key={p.key} delay={i * 100} as="div">
                <a className="work-card" href={p.url} target="_blank" rel="noopener noreferrer">
                  <div className="wc-head">
                    <span className="wc-idx mono">W.0{i+1}</span>
                    <span className="wc-motif"><ProductMotif kind={p.key} /></span>
                  </div>
                  <div className="wc-main">
                    <span className="wc-tag mono">{t("work."+p.key+".tag")}</span>
                    <span className="wc-name display">{p.name}</span>
                    <p className="wc-desc">{t("work."+p.key+".desc")}</p>
                  </div>
                  <div className="wc-side">
                    <Pill live={true}>{t("work.status")}</Pill>
                    <span className="wc-domain mono">{p.domain} <Arrow /></span>
                  </div>
                </a>
              </Reveal>
            ))}
          </div>
        </div>
      </section>

      <section className="section">
        <div className="wrap" style={{ display: "flex", justifyContent: "space-between", alignItems: "baseline", gap: 24, flexWrap: "wrap" }}>
          <h3 className="display display-sm" style={{ maxWidth: "30ch" }}>
            {t("work.tail")}
          </h3>
          <button className="btn" onClick={() => navigate("contact")}>
            {lang === "fi" ? "Ota yhteyttä" : "Get in touch"} <Arrow />
          </button>
        </div>
      </section>
    </PageBody>
  );
}

// ── About ────────────────────────────────────────────────────────────
export function About({ navigate }) {
  const { t, lang } = useLang();
  return (
    <PageBody screenLabel="About">
      {/* Hero */}
      <section className="hero" style={{ paddingBottom: "clamp(40px, 5vw, 72px)" }}>
        <div className="wrap">
          <Reveal><div className="kicker"><span className="dot" />{t("about.kicker")}</div></Reveal>
          <div className="spacer-32" />
          <Reveal delay={80}>
            <h1 className="display display-lg" style={{ whiteSpace: "pre-line", marginBottom: 40 }}>
              {t("about.title").split("\n").map((line, i, arr) => (
                <span key={i} style={{ display: "block" }}>
                  {i === arr.length - 1 ? <em>{line}</em> : line}
                </span>
              ))}
            </h1>
          </Reveal>
          <Reveal delay={140}>
            <p className="lede" style={{ maxWidth: "64ch" }}>{t("about.lede")}</p>
          </Reveal>
        </div>
      </section>

      {/* Story */}
      <section className="section">
        <div className="wrap">
          <SectionHead
            idx="01"
            kicker={t("about.story.kicker")}
            title={t("about.story.title")}
            intro={null}
          />
          <div className="story-grid">
            <div>
              <Reveal>
                <div className="aside" style={{ marginBottom: 16 }}>
                  {lang === "fi" ? "Aikajana, lyhyesti" : "Timeline, briefly"}
                </div>
                <div className="mono" style={{ fontSize: 12, lineHeight: 1.8, color: "var(--ink-soft)" }}>
                  <div>2025 Q1 — {lang === "fi" ? "ensimmäiset kokeilut" : "first experiments"}</div>
                  <div>2025 Q3 — {lang === "fi" ? "yhteinen alusta syntyy" : "shared platform begins"}</div>
                  <div>2025 Q4 — {lang === "fi" ? "ensimmäinen tuotantopalvelu" : "first production service"}</div>
                  <div>2026 Q1 — RK9 AI OY {lang === "fi" ? "perustettu" : "incorporated"}</div>
                  <div style={{ color: "var(--accent)" }}>2026 — {lang === "fi" ? "kolme palvelua tuotannossa" : "three services in production"}</div>
                </div>
              </Reveal>
            </div>
            <div className="prose">
              <Reveal><p className="drop-cap">{t("about.story.p1")}</p></Reveal>
              <Reveal delay={80}><p>{t("about.story.p2")}</p></Reveal>
              <Reveal delay={160}><p>{t("about.story.p3")}</p></Reveal>
            </div>
          </div>
        </div>
      </section>

      {/* How it works — 4 steps */}
      <section className="section">
        <div className="wrap">
          <SectionHead
            idx="02"
            kicker={t("about.how.kicker")}
            title={t("about.how.title")}
            intro={t("about.how.intro")}
          />
          <div className="steps four">
            {[1,2,3,4].map(i => (
              <Reveal key={i} delay={i * 80} as="div" className="step">
                <span className="step-idx">0{i} / 04</span>
                <span className="step-who">{t("about.how.s"+i+".t")}</span>
                <div className="step-body">{t("about.how.s"+i+".b")}</div>
              </Reveal>
            ))}
          </div>
        </div>
      </section>

      {/* Values */}
      <section className="section">
        <div className="wrap">
          <SectionHead
            idx="03"
            kicker={t("about.values.kicker")}
            title={t("about.values.title")}
            intro={lang === "fi" ? "Neljä periaatetta, jotka ohjaavat kaikkea." : "Four principles that guide everything."}
          />
          <div className="values">
            {[1,2,3,4].map(i => (
              <Reveal key={i} delay={(i-1) * 80} as="div" className="value">
                <span className="v-idx">V.0{i}</span>
                <div className="v-title">{t("about.values.v"+i+".t")}</div>
                <div className="v-body">{t("about.values.v"+i+".b")}</div>
              </Reveal>
            ))}
          </div>
        </div>
      </section>

      {/* CTA tail */}
      <section className="section">
        <div className="wrap" style={{ display: "flex", justifyContent: "space-between", alignItems: "baseline", gap: 24, flexWrap: "wrap" }}>
          <h3 className="display display-sm" style={{ maxWidth: "30ch" }}>
            {lang === "fi" ? "Kysyttävää? Yksi sähköposti riittää." : "Questions? One email is enough."}
          </h3>
          <button className="btn" onClick={() => navigate("contact")}>
            {lang === "fi" ? "Yhteystiedot" : "Contact"} <Arrow />
          </button>
        </div>
      </section>
    </PageBody>
  );
}

export function Contact({ navigate }) {
  const { t, lang } = useLang();
  return (
    <PageBody screenLabel="Contact">
      <section className="hero" style={{ paddingBottom: "clamp(40px, 5vw, 72px)" }}>
        <div className="wrap">
          <Reveal><div className="kicker"><span className="dot" />{t("contact.kicker")}</div></Reveal>
          <div className="spacer-32" />
          <Reveal delay={80}>
            <h1 className="display display-lg" style={{ whiteSpace: "pre-line", marginBottom: 40 }}>
              {t("contact.title").split("\n").map((line, i, arr) => (
                <span key={i} style={{ display: "block" }}>
                  {i === arr.length - 1 ? <em>{line}</em> : line}
                </span>
              ))}
            </h1>
          </Reveal>
          <Reveal delay={140}>
            <p className="lede" style={{ maxWidth: "60ch" }}>{t("contact.lede")}</p>
          </Reveal>
        </div>
      </section>

      <section className="section">
        <div className="wrap">
          <div className="info-grid">
            <div className="info-card">
              <span className="lbl">{t("contact.founder")}</span>
              <div className="val">Mikko-Ville Lahti</div>
              <div className="sub">{lang === "fi" ? "Perustaja" : "Founder"} · RK9 AI OY</div>
            </div>
            <div className="info-card">
              <span className="lbl">{t("contact.email")}</span>
              <div className="val"><a href="mailto:mikko-ville.lahti@rk9.fi">mikko-ville.lahti@rk9.fi</a></div>
              <div className="sub">{lang === "fi" ? "Vastaus 1–2 arkipäivässä" : "Reply within 1–2 business days"}</div>
            </div>
            <div className="info-card">
              <span className="lbl">{t("contact.location")}</span>
              <div className="val">{t("contact.location.value")}</div>
              <div className="sub">UTC+2 / UTC+3 · {lang === "fi" ? "Forssa" : "Forssa"}</div>
            </div>
            <div className="info-card">
              <span className="lbl">{t("contact.company")}</span>
              <div className="val" style={{ fontSize: "clamp(20px, 2vw, 28px)" }}>{t("contact.company.value")}</div>
              <div className="sub">{lang === "fi" ? "Itse hostattu, palvelimet Suomessa" : "Self-hosted, servers in Finland"}</div>
            </div>
          </div>
        </div>
      </section>

      <section className="section">
        <div className="wrap" style={{ display: "flex", justifyContent: "space-between", alignItems: "baseline", gap: 24, flexWrap: "wrap" }}>
          <h3 className="display display-sm" style={{ maxWidth: "32ch" }}>
            {lang === "fi" ? "Katso ensin mitä olemme rakentaneet." : "See what we have built first."}
          </h3>
          <button className="btn btn-secondary" onClick={() => navigate("work")}>
            {lang === "fi" ? "Työt" : "Work"} <Arrow />
          </button>
        </div>
      </section>
    </PageBody>
  );
}

export function Privacy({ navigate }) {
  const { t, lang } = useLang();
  return (
    <PageBody screenLabel="Privacy">
      <section className="hero" style={{ paddingBottom: "clamp(40px, 5vw, 72px)" }}>
        <div className="wrap">
          <Reveal><div className="kicker"><span className="dot" />{t("privacy.kicker")}</div></Reveal>
          <div className="spacer-32" />
          <Reveal delay={80}>
            <h1 className="display display-lg" style={{ marginBottom: 24 }}>{t("privacy.title")}</h1>
          </Reveal>
          <Reveal delay={140}>
            <div className="mono" style={{ fontSize: 12.5, color: "var(--subtle)", letterSpacing: "0.04em" }}>
              {t("privacy.updated")}
            </div>
          </Reveal>
        </div>
      </section>

      <section className="section" style={{ paddingTop: 0 }}>
        <div className="wrap">
          <div className="privacy-sections">
            {[1, 2, 3, 4].map(i => (
              <Reveal key={i} as="div" className="privacy-section" delay={(i-1) * 60}>
                <div>
                  <div className="ps-num">§{String(i).padStart(2,"0")}</div>
                  <div className="ps-title">{t("privacy.s"+i+".t")}</div>
                </div>
                <div className="ps-body">{t("privacy.s"+i+".b")}</div>
              </Reveal>
            ))}
          </div>
        </div>
      </section>
    </PageBody>
  );
}
