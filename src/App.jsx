// App shell — routing, language. Locked production configuration
// (the design's Tweaks panel is intentionally not shipped).

import { useState, useEffect } from "react";
import { LangCtx, Nav, Footer } from "./components.jsx";
import { CoordsHud } from "./effects.jsx";
import { Home } from "./home.jsx";
import { About, Contact, Privacy } from "./pages.jsx";
import { makeT } from "./copy.js";

// Locked design configuration (chosen from the Tweaks explorations).
//   palette  pine       — Petäjä, cream + green
//   fontPair editorial  — Instrument Serif + Geist
//   hero     network    — agent-network hero
//   canvas   mesh        — MESH.GRID visualisation
//   logo     grid
//   hud      true        — coords HUD (auto-hidden < 760px)
//   orch     os          — "Yhtiön käyttöjärjestelmä" orchestration copy
export const CONFIG = {
  palette: "pine",
  fontPair: "editorial",
  hero: "network",
  canvas: "mesh",
  logo: "grid",
  hud: true,
  orch: "os",
};

export default function App() {
  const [lang, setLang] = useState(() => localStorage.getItem("rk9.lang") || "fi");
  const [route, setRoute] = useState(() => (location.hash || "#home").replace(/^#/, ""));

  useEffect(() => {
    localStorage.setItem("rk9.lang", lang);
    document.documentElement.lang = lang;
  }, [lang]);

  useEffect(() => {
    const onHash = () => setRoute((location.hash || "#home").replace(/^#/, ""));
    window.addEventListener("hashchange", onHash);
    return () => window.removeEventListener("hashchange", onHash);
  }, []);

  const navigate = (r) => {
    location.hash = "#" + r;
    setRoute(r);
    window.scrollTo({ top: 0, behavior: "auto" });
  };

  const tt = makeT(() => lang);
  const ctx = { lang, setLang, t: tt };

  let page;
  const seg = route.split("/");
  if (seg[0] === "about") page = <About navigate={navigate} orch={CONFIG.orch} />;
  else if (seg[0] === "contact") page = <Contact navigate={navigate} />;
  else if (seg[0] === "privacy") page = <Privacy navigate={navigate} />;
  else page = <Home navigate={navigate} heroVariant={CONFIG.hero} orch={CONFIG.orch} canvas={CONFIG.canvas} />;

  return (
    <LangCtx.Provider value={ctx}>
      <Nav route={route} navigate={navigate} logoVariant={CONFIG.logo} />
      <div key={route + lang}>{page}</div>
      <Footer navigate={navigate} logoVariant={CONFIG.logo} />

      {CONFIG.hud && <CoordsHud route={route} />}
    </LangCtx.Provider>
  );
}
