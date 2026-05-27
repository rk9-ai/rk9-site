// Home — hero with agent network, what we do, how it works, metrics, founder.

import { useLang, PageBody, SectionHead, Pill, Arrow } from "./components.jsx";
import { Reveal, AgentNetwork, ActivityTicker, AnimatedNumber } from "./effects.jsx";

function HeroNetwork({ navigate, canvas }) {
  const { t, lang } = useLang();
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
                <button className="btn" onClick={() => navigate("about")}>
                  {t("home.hero.cta.about")} <Arrow />
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
            <AgentNetwork variant={canvas} count={85} />
            <ActivityTicker />
          </Reveal>
        </div>
      </div>
    </section>
  );
}

function HeroManifesto({ navigate }) {
  const { t, lang } = useLang();
  const lines = lang === "fi"
    ? [
        { n: "01", txt: "Yksi henkilö.",            em: true },
        { n: "02", txt: "Avoin alusta.",            em: false },
        { n: "03", txt: "Vaihteleva miehistö.", em: false, accent: true },
      ]
    : [
        { n: "01", txt: "One person.",   em: true },
        { n: "02", txt: "An open platform.", em: false },
        { n: "03", txt: "A variable crew.", em: false, accent: true },
      ];
  return (
    <section className="hero">
      <div className="wrap">
        <Reveal>
          <div className="kicker"><span className="dot" />{t("kicker")}</div>
        </Reveal>
        <div className="spacer-32" />
        <Reveal delay={80}>
          <h1 className="display display-xl hero-title">
            {lines.map((l, i) => (
              <span key={i} style={{ display: "block" }}>
                <span className="mono" style={{ fontSize: "0.18em", verticalAlign: "super", color: "var(--subtle)", marginRight: "0.4em", letterSpacing: "0.06em" }}>{l.n}</span>
                {l.em
                  ? <em>{l.txt}</em>
                  : <span style={l.accent ? { color: "var(--accent)" } : null}>{l.txt}</span>
                }
              </span>
            ))}
          </h1>
        </Reveal>
        <div className="hero-grid" style={{ marginTop: 48, alignItems: "end" }}>
          <Reveal delay={160}>
            <p className="lede">{t("home.hero.subtitle")}</p>
          </Reveal>
          <Reveal delay={220} className="hero-side" style={{ minHeight: "auto" }}>
            <div className="hero-actions">
              <button className="btn" onClick={() => navigate("about")}>
                {t("home.hero.cta.about")} <Arrow />
              </button>
              <button className="btn btn-secondary" onClick={() => navigate("contact")}>
                {t("home.hero.cta.contact")}
              </button>
            </div>
            <Pill live={true}>{t("live")}</Pill>
          </Reveal>
        </div>
      </div>
    </section>
  );
}

function Hero({ variant, navigate, canvas }) {
  if (variant === "manifesto") return <HeroManifesto navigate={navigate} />;
  return <HeroNetwork navigate={navigate} canvas={canvas} />;
}

export function Home({ navigate, heroVariant, orch, canvas }) {
  const { t, lang } = useLang();
  // Resolve orchestration-step copy from variant
  const orchKey = orch || "tyonjohto";
  const step2 = {
    role: t("orch." + orchKey + ".role"),
    who:  t("orch." + orchKey + ".who"),
    body: t("orch." + orchKey + ".body"),
  };
  return (
    <PageBody screenLabel="Home">
      <Hero variant={heroVariant} navigate={navigate} canvas={canvas} />

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

      {/* How it works — 3 steps */}
      <section className="section">
        <div className="wrap">
          <SectionHead
            idx="02"
            kicker={t("home.how.kicker")}
            title={t("home.how.title")}
            intro={t("home.how.intro")}
          />
          <div className="steps">
            {[1,2,3].map(i => {
              const role = i === 2 ? step2.role : t("home.how.step"+i+".role");
              const who  = i === 2 ? step2.who  : t("home.how.step"+i+".who");
              const body = i === 2 ? step2.body : t("home.how.step"+i+".body");
              return (
                <Reveal key={i + "-" + orchKey} delay={i * 100} as="div" className="step">
                  <span className="step-idx">0{i} / 03</span>
                  <span className="step-role">{role}</span>
                  <span className="step-who">{who}</span>
                  <div className="step-body">{body}</div>
                </Reveal>
              );
            })}
          </div>
        </div>
      </section>

      {/* Metrics */}
      <section className="section">
        <div className="wrap">
          <SectionHead
            idx="03"
            kicker={t("home.metrics.kicker")}
            title={lang === "fi" ? "Numerot puhuvat." : "The numbers speak."}
            intro={null}
          />
          <div className="metrics">
            <div className="metric">
              <span className="idx mono">M.01</span>
              <div className="num" style={{ fontStyle: "italic" }}>n</div>
              <div className="lbl">{t("home.metrics.agents")}</div>
            </div>
            <div className="metric">
              <span className="idx mono">M.02</span>
              <div className="num"><AnimatedNumber value={1} /></div>
              <div className="lbl">{t("home.metrics.humans")}</div>
            </div>
            <div className="metric">
              <span className="idx mono">M.03</span>
              <div className="num" style={{ fontSize: "clamp(36px, 4vw, 56px)" }}>
                {lang === "fi" ? "Suomi" : "Finland"}
              </div>
              <div className="lbl">{t("home.metrics.hosting")}</div>
            </div>
            <div className="metric">
              <span className="idx mono">M.04</span>
              <div className="num">MIT</div>
              <div className="lbl">{t("home.metrics.fork")}</div>
            </div>
          </div>
        </div>
      </section>

      {/* Founder */}
      <section className="section">
        <div className="wrap">
          <SectionHead
            idx="04"
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
