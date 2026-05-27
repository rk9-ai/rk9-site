// About, Contact, Privacy pages.

import { useLang, PageBody, SectionHead, Arrow } from "./components.jsx";
import { Reveal } from "./effects.jsx";

export function About({ navigate, orch }) {
  const { t, lang } = useLang();
  const orchKey = orch || "tyonjohto";
  const stepKey = (i) => i === 2
    ? { t: t("about.how.s2.t." + orchKey), b: t("about.how.s2.b." + orchKey) }
    : { t: t("about.how.s"+i+".t"),        b: t("about.how.s"+i+".b") };
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
                  <div>2025 Q3 — {lang === "fi" ? "Paperclip-haara syntyy" : "Paperclip fork begins"}</div>
                  <div>2025 Q4 — {lang === "fi" ? "ensimmäinen tuotantopalvelu" : "first production service"}</div>
                  <div>2026 Q1 — RK9 AI OY {lang === "fi" ? "perustettu" : "incorporated"}</div>
                  <div style={{ color: "var(--accent)" }}>2026 — {lang === "fi" ? "nyt" : "now"}</div>
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
            {[1,2,3,4].map(i => {
              const s = stepKey(i);
              return (
                <Reveal key={i + "-" + orchKey} delay={i * 80} as="div" className="step">
                  <span className="step-idx">0{i} / 04</span>
                  <span className="step-who">{s.t}</span>
                  <div className="step-body">{s.b}</div>
                </Reveal>
              );
            })}
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
            {lang === "fi" ? "Lue ensin yhtiön taustasta — säästät minuutin." : "Read the company background first — saves you a minute."}
          </h3>
          <button className="btn btn-secondary" onClick={() => navigate("about")}>
            {lang === "fi" ? "Yhtiöstä" : "About the company"} <Arrow />
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
