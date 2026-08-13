// Home — hero with the vault graph sphere, what we do, how we work,
// work teaser, metrics, founder.

import { useLang, PageBody, SectionHead, Pill, Arrow } from "./components.jsx";
import { Reveal, VaultGraph, AnimatedNumber } from "./effects.jsx";
import { PRODUCTS, ProductMotif } from "./pages.jsx";

function Hero({ navigate }) {
  const { t } = useLang();
  return (
    <section className="hero">
      <div className="wrap">
        <Reveal as="div">
          <div className="kicker"><span className="dot" />{t("kicker")}</div>
        </Reveal>
        <div className="spacer-32" />
        <div className="hero-grid">
          <div className="hero-text">
            <Reveal delay={80}>
              <h1 className="display display-xl hero-title">
                {t("home.hero.title").split("\n").map((line, i, arr) => (
                  <span key={i} style={{ display: "block" }}>
                    {i === arr.length - 1 ? <em>{line}</em> : line}
                  </span>
                ))}
              </h1>
            </Reveal>
            <Reveal delay={160}>
              <p className="lede">{t("home.hero.subtitle")}</p>
            </Reveal>
            <Reveal delay={240}>
              <div className="hero-actions">
                <button className="btn" onClick={() => navigate("work")}>
                  {t("home.hero.cta.work")} <Arrow />
                </button>
                <button className="btn btn-secondary" onClick={() => navigate("contact")}>
                  {t("home.hero.cta.contact")}
                </button>
              </div>
            </Reveal>
            <Reveal delay={320}>
              <Pill live={true}>{t("live")}</Pill>
            </Reveal>
          </div>
          <Reveal delay={120} className="hero-side">
            <VaultGraph />
            <p className="vault-caption">{t("vault.caption")}</p>
          </Reveal>
        </div>
      </div>
    </section>
  );
}

export function Home({ navigate }) {
  const { t, lang } = useLang();
  return (
    <PageBody screenLabel="Home">
      <Hero navigate={navigate} />

      {/* What we do */}
      <section className="section">
        <div className="wrap">
          <SectionHead
            idx="01"
            kicker={t("home.what.kicker")}
            title={t("home.what.title")}
            intro={null}
          />
          <div className="story-grid">
            <div>
              <Reveal>
                <p className="aside" style={{ marginBottom: 24 }}>
                  ↳ {lang === "fi" ? "Suomalaisille markkinoille." : "For Finnish markets."}
                </p>
              </Reveal>
            </div>
            <div className="prose">
              <Reveal><p className="drop-cap">{t("home.what.p1")}</p></Reveal>
              <Reveal delay={80}><p>{t("home.what.p2")}</p></Reveal>
              <Reveal delay={160}><p>{t("home.what.p3")}</p></Reveal>
            </div>
          </div>
        </div>
      </section>

      {/* How we work — 3 steps */}
      <section className="section">
        <div className="wrap">
          <SectionHead
            idx="02"
            kicker={t("home.how.kicker")}
            title={t("home.how.title")}
            intro={t("home.how.intro")}
          />
          <div className="steps">
            {[1,2,3].map(i => (
              <Reveal key={i} delay={i * 100} as="div" className="step">
                <span className="step-idx">0{i} / 03</span>
                <span className="step-role">{t("home.how.step"+i+".role")}</span>
                <span className="step-who">{t("home.how.step"+i+".who")}</span>
                <div className="step-body">{t("home.how.step"+i+".body")}</div>
              </Reveal>
            ))}
          </div>
        </div>
      </section>

      {/* Work teaser */}
      <section className="section">
        <div className="wrap">
          <SectionHead
            idx="03"
            kicker={t("home.work.kicker")}
            title={t("home.work.title")}
            intro={null}
          >
            <button className="text-link" onClick={() => navigate("work")}>
              {t("home.work.cta")} <Arrow />
            </button>
          </SectionHead>
          <div className="work-teaser">
            {PRODUCTS.map((p, i) => (
              <Reveal key={p.key} delay={i * 100} as="div">
                <a className="work-tease" href={p.url} target="_blank" rel="noopener noreferrer">
                  <span className="wt-idx mono">W.0{i+1}</span>
                  <span className="wt-motif"><ProductMotif kind={p.key} /></span>
                  <span className="wt-name">{p.name}</span>
                  <span className="wt-tag mono">{t("work."+p.key+".tag")}</span>
                  <span className="wt-domain mono">{p.domain} <Arrow /></span>
                </a>
              </Reveal>
            ))}
          </div>
        </div>
      </section>

      {/* Metrics */}
      <section className="section">
        <div className="wrap">
          <SectionHead
            idx="04"
            kicker={t("home.metrics.kicker")}
            title={lang === "fi" ? "Numerot puhuvat." : "The numbers speak."}
            intro={null}
          />
          <div className="metrics">
            <div className="metric">
              <span className="idx mono">M.01</span>
              <div className="num"><AnimatedNumber value={3} /></div>
              <div className="lbl">{t("home.metrics.services")}</div>
            </div>
            <div className="metric">
              <span className="idx mono">M.02</span>
              <div className="num"><AnimatedNumber value={100} suffix=" %" /></div>
              <div className="lbl">{t("home.metrics.hosting")}</div>
            </div>
            <div className="metric">
              <span className="idx mono">M.03</span>
              <div className="num tnum">2026</div>
              <div className="lbl">{t("home.metrics.founded")}</div>
            </div>
            <div className="metric">
              <span className="idx mono">M.04</span>
              <div className="num">MIT</div>
              <div className="lbl">{t("home.metrics.oss")}</div>
            </div>
          </div>
        </div>
      </section>

      {/* Founder */}
      <section className="section">
        <div className="wrap">
          <SectionHead
            idx="05"
            kicker={t("home.founder.kicker")}
            title={t("home.founder.name")}
            intro={null}
          >
            <div className="aside" style={{ marginTop: 4 }}>{t("home.founder.role")}</div>
          </SectionHead>
          <div className="story-grid">
            <div>
              <Reveal>
                {/* portrait placeholder */}
                <div style={{
                  width: "100%",
                  aspectRatio: "3 / 4",
                  background: "var(--surface)",
                  border: "1px solid var(--rule)",
                  position: "relative",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  fontFamily: "var(--font-mono)",
                  fontSize: 12,
                  color: "var(--subtle)",
                  letterSpacing: "0.05em",
                  textTransform: "uppercase",
                  maxWidth: 320,
                }}>
                  <span>portrait · placeholder</span>
                  <span style={{ position: "absolute", top: 12, left: 14, fontSize: 11 }}>P.01</span>
                  <span style={{ position: "absolute", bottom: 12, right: 14, fontSize: 11 }}>mvl</span>
                </div>
              </Reveal>
            </div>
            <div>
              <Reveal>
                <p className="prose" style={{ marginBottom: 28 }}>{t("home.founder.bio")}</p>
              </Reveal>
              <Reveal delay={80}>
                <button className="text-link" onClick={() => navigate("about")}>
                  {t("home.founder.cta")} <Arrow />
                </button>
              </Reveal>
            </div>
          </div>
        </div>
      </section>
    </PageBody>
  );
}
