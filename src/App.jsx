// App shell — routing, language. Locked production configuration
// (the design's Tweaks panel is intentionally not shipped).

import { useState, useEffect } from "react";
import { LangCtx, Nav, Footer } from "./components.jsx";
import { CoordsHud } from "./effects.jsx";
import { Home } from "./home.jsx";
import { Work, About, Contact, Privacy } from "./pages.jsx";
import { makeT } from "./copy.js";

// Locked design configuration (chosen from the Tweaks explorations).
//   palette  pine       — Petäjä, cream + green
//   fontPair editorial  — Instrument Serif + Geist
//   logo     grid
//   hud      true       — coords HUD (auto-hidden < 760px)
export const CONFIG = {
  palette: "pine",
  fontPair: "editorial",
  logo: "grid",
  hud: true,
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
  if (seg[0] === "work") page = <Work navigate={navigate} />;
  else if (seg[0] === "about") page = <About navigate={navigate} />;
  else if (seg[0] === "contact") page = <Contact navigate={navigate} />;
  else if (seg[0] === "privacy") page = <Privacy navigate={navigate} />;
  else page = <Home navigate={navigate} />;

  return (
    <LangCtx.Provider value={ctx}>
      <Nav route={route} navigate={navigate} logoVariant={CONFIG.logo} />
      <div key={route + lang}>{page}</div>
      <Footer navigate={navigate} logoVariant={CONFIG.logo} />

      {CONFIG.hud && <CoordsHud route={route} />}
    </LangCtx.Provider>
  );
}
