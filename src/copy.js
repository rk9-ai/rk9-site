// Bilingual copy — slim. Only Home, About, Contact, Privacy.

export const COPY = {
  // ── nav ─────────────────────────────────────────────────────────────
  "nav.index":   { fi: "Etusivu",     en: "Index" },
  "nav.about":   { fi: "Yhtiö",       en: "Company" },
  "nav.contact": { fi: "Yhteystiedot", en: "Contact" },
  "nav.privacy": { fi: "Tietosuoja",  en: "Privacy" },

  // ── hero ────────────────────────────────────────────────────────────
  "kicker": {
    fi: "RK9 AI OY · Suomalainen ohjelmistoyhtiö",
    en: "RK9 AI OY · A Finnish software company",
  },
  "live": { fi: "Toiminnassa juuri nyt", en: "Operational right now" },

  "home.hero.title": {
    fi: "Yksi henkilö.\nKoneellinen miehistö.",
    en: "One person.\nA machine workforce.",
  },
  "home.hero.subtitle": {
    fi: "RK9 AI on suomalainen ohjelmistoyhtiö, jossa autonomiset AI-agentit rakentavat ja operoivat digitaalisia palveluja. Ihminen asettaa suunnan; loput tekee kone.",
    en: "RK9 AI is a Finnish software company where autonomous AI agents build and run digital services. A human sets the direction; the machine does the rest.",
  },
  "home.hero.cta.about":   { fi: "Yhtiöstä",         en: "About the company" },
  "home.hero.cta.contact": { fi: "Ota yhteyttä",     en: "Get in touch" },

  // ── home / what we do ───────────────────────────────────────────────
  "home.what.kicker": { fi: "Mitä rakennetaan", en: "What is being built" },
  "home.what.title": {
    fi: "Digitaaliset palvelut, jotka kehittävät itseään.",
    en: "Digital services that develop themselves.",
  },
  "home.what.p1": {
    fi: "RK9 AI rakentaa ja operoi digitaalisia palveluja suomalaisille markkinoille. Jokainen palvelu on oikeasti tuotannossa — ei demoa, ei kuvakaappausta. Asiakas ei tiedä, että toisella puolella ei ole tiimiä.",
    en: "RK9 AI builds and operates digital services for Finnish markets. Each service is genuinely in production — not a demo, not a screenshot. The customer does not know there is no team on the other side.",
  },
  "home.what.p2": {
    fi: "AI-agentit hoitavat koko elinkaaren: kehityksen, julkaisun, ylläpidon, asiakaspalvelun, prospektoinnin ja monitoroinnin. Yksi ihminen valvoo, hyväksyy isot päätökset, ja ohjaa suuntaa.",
    en: "AI agents handle the entire lifecycle: development, deployment, maintenance, support, prospecting, and monitoring. One person oversees, approves the big calls, and steers the direction.",
  },
  "home.what.p3": {
    fi: "Kiinnostavin kysymys ei ole se, kuinka hyviä agentit ovat. Se on se, millaisen rakenteen ne tarvitsevat ympärilleen toimiakseen vastuullisesti.",
    en: "The most interesting question is not how good the agents are. It is what kind of structure they need around themselves to operate responsibly.",
  },

  // ── home / how it works ─────────────────────────────────────────────
  "home.how.kicker": { fi: "Miten se toimii", en: "How it works" },
  "home.how.title": {
    fi: "Ihminen, alusta, miehistö.",
    en: "Human, platform, workforce.",
  },
  "home.how.intro": {
    fi: "Kolmitasoinen rakenne, jota sama sykli toistaa joka päivä.",
    en: "A three-layer structure, repeated every day by the same cycle.",
  },

  "home.how.step1.role":  { fi: "Suunta",        en: "Direction" },
  "home.how.step1.who":   { fi: "Ihminen",       en: "Human" },
  "home.how.step1.body":  { fi: "Strategia, etiikka, hinnoittelu, isot tuotepäätökset. Aamuraportti ja hyväksyntäportit.", en: "Strategy, ethics, pricing, big product calls. Morning reports and approval gates." },

  "home.how.step2.role":  { fi: "Orkestrointi",  en: "Orchestration" },
  "home.how.step2.who":   { fi: "Paperclip",     en: "Paperclip" },
  "home.how.step2.body":  { fi: "Avoimen lähdekoodin alusta. Org chart per palvelu, projektit, tavoitteet, budjetti, audit-jäljet.", en: "An open-source platform. Org chart per service, projects, goals, budget, audit trails." },

  // Orchestration variants — chosen by Tweak `orch`
  // A) Työnjohto — suomalainen suora
  "orch.tyonjohto.role": { fi: "Orkestrointi", en: "Orchestration" },
  "orch.tyonjohto.who":  { fi: "Työnjohto",   en: "The works" },
  "orch.tyonjohto.body": {
    fi: "Joka palvelulla on org chart, projektit, tavoitteet ja budjetti. Työnjohto jakaa työn agenteille ja pitää kirjaa hyväksynnöistä.",
    en: "Each service has an org chart, projects, goals and a budget. The works routes the work to the agents and keeps a ledger of approvals.",
  },
  // B) Hermosto — metafora
  "orch.hermosto.role":  { fi: "Välitys",  en: "Conduction" },
  "orch.hermosto.who":   { fi: "Hermosto", en: "The nervous system" },
  "orch.hermosto.body": {
    fi: "Kuljettaa suunnan ihmiseltä agenteille ja raportit takaisin. Tallentaa päätökset, hyväksynnät ja budjetit.",
    en: "Carries direction from the human to the agents, and reports back. Records decisions, approvals, and budgets.",
  },
  // C) Käyttöjärjestelmä — funktio ilman tuotenimeä
  "orch.os.role":   { fi: "Alusta", en: "Platform" },
  "orch.os.who":    { fi: "Yhtiön käyttöjärjestelmä", en: "The company's operating system" },
  "orch.os.body": {
    fi: "Avoimen lähdekoodin pohja, muokattu RK9:n tarpeisiin. Org chartit, budjetit, hyväksyntäportit ja audit-jäljet.",
    en: "An open-source base, adapted to RK9's needs. Org charts, budgets, approval gates and audit trails.",
  },

  "home.how.step3.role":  { fi: "Suoritus",      en: "Execution" },
  "home.how.step3.who":   { fi: "Agenttiarmeija",  en: "An agent workforce" },
  "home.how.step3.body":  { fi: "Koodi, deploy, korjaukset, sähköposti, monitorointi, prospektointi. Käytännössä kaikki paitsi suunta.", en: "Code, deploys, fixes, email, monitoring, prospecting. In practice, everything except direction." },

  // ── home / metrics ──────────────────────────────────────────────────
  "home.metrics.kicker": { fi: "Mittaluokka", en: "Scale" },
  "home.metrics.agents":   { fi: "Agentteja työssä — määrä vaihtelee", en: "Agents at work — the number varies" },
  "home.metrics.humans":   { fi: "Ihmistä työllistettynä",   en: "Humans employed" },
  "home.metrics.hosting":  { fi: "Itse hostattua, Suomessa", en: "Self-hosted, in Finland" },
  "home.metrics.fork":     { fi: "Pohja avoimena lähdekoodina", en: "Base open-sourced" },

  // ── home / founder ──────────────────────────────────────────────────
  "home.founder.kicker": { fi: "Perustaja",          en: "Founder" },
  "home.founder.name":   { fi: "Mikko-Ville Lahti",  en: "Mikko-Ville Lahti" },
  "home.founder.role":   { fi: "Perustaja, ainoa työntekijä", en: "Founder, sole employee" },
  "home.founder.bio": {
    fi: "Asettaa suunnan, hyväksyy isot päätökset, lukee aamulla agenttien yöraportit. Muun työn tekee kone. Lisää yhtiön taustasta löytyy tiedoista.",
    en: "Sets the direction, approves the big calls, reads the agents' overnight reports in the morning. The rest is done by the machine. More background on the company page.",
  },
  "home.founder.cta": { fi: "Yhtiön tarina", en: "The company story" },

  // ── about ───────────────────────────────────────────────────────────
  "about.kicker": { fi: "Yhtiö", en: "Company" },
  "about.title": {
    fi: "Pieni yhtiö,\nepätavallinen kokoonpano.",
    en: "A small company,\nan unusual configuration.",
  },
  "about.lede": {
    fi: "RK9 AI on yhden ihmisen perustama suomalainen ohjelmistoyhtiö, jonka työvoima koostuu autonomisista AI-agenteista. Yhtiö testaa konkreettisesti, miten pitkälle tämä järjestely venyy.",
    en: "RK9 AI is a Finnish software company founded by one person, with a workforce made of autonomous AI agents. The company is a practical test of how far that configuration stretches.",
  },

  "about.story.kicker": { fi: "Tarina", en: "Story" },
  "about.story.title":  { fi: "Lyhyt versio", en: "The short version" },
  "about.story.p1": {
    fi: "Alkuvuodesta 2025 yksi ihminen alkoi käyttää AI-työkaluja kokoamaan pieniä sivuprojekteja. Työkalut paranivat nopeammin kuin niitä ehdittiin testata.",
    en: "In early 2025, one person started using AI tools to assemble small side projects. The tools improved faster than they could be tested.",
  },
  "about.story.p2": {
    fi: "Kun yksi agentti osasi viedä ominaisuuden ideasta tuotantoon ilman manuaalista välikättä, kysymys siirtyi: kuinka monta agenttia voi koordinoida samaan aikaan? Mikä on se rakenne, joka pitää homman koossa?",
    en: "When one agent could take a feature from idea to production with no human in the middle, the question shifted: how many agents can you coordinate at once? What is the structure that holds it all together?",
  },
  "about.story.p3": {
    fi: "Vastausta rakennettiin avoimesta Paperclip-alustasta. Tuotantohaara on raskaasti muokattu mutta perusta pidetään julkisena. Yhtiö on yhden hengen, mutta työvoima ei.",
    en: "The answer was built on the open-source Paperclip platform. The production fork is heavily customised but the base is kept public. The company is one person; the workforce is not.",
  },

  "about.how.kicker": { fi: "Toimintamalli", en: "Operating model" },
  "about.how.title":  { fi: "Miten se toimii käytännössä", en: "How it works in practice" },
  "about.how.intro": {
    fi: "Sama sykli toistuu joka päivä, joka palvelulle.",
    en: "The same cycle repeats every day, for every service.",
  },
  "about.how.s1.t": { fi: "Ihminen asettaa suunnan", en: "Human sets direction" },
  "about.how.s1.b": { fi: "Tavoitteet, strategia, eettiset rajat, isot tuotepäätökset. Hyväksyntäportit.", en: "Goals, strategy, ethical limits, big product calls. Approval gates." },
  "about.how.s2.t": { fi: "Työnjohto orkestroi", en: "The works orchestrates" },
  "about.how.s2.b": { fi: "Jokaisella palvelulla on org chart, projektit, tavoitteet, budjetti. Työnjohto jakaa työn agenteille.", en: "Each service has an org chart, projects, goals, and a budget. The works routes work to agents." },
  // Variants for the same step on About
  "about.how.s2.t.tyonjohto": { fi: "Työnjohto orkestroi", en: "The works orchestrates" },
  "about.how.s2.b.tyonjohto": { fi: "Jokaisella palvelulla on org chart, projektit, tavoitteet, budjetti. Työnjohto jakaa työn agenteille.", en: "Each service has an org chart, projects, goals, and a budget. The works routes work to agents." },
  "about.how.s2.t.hermosto":  { fi: "Hermosto välittää",      en: "The nervous system conducts" },
  "about.how.s2.b.hermosto":  { fi: "Kuljettaa suunnan ihmiseltä agenteille ja raportit takaisin. Joka palvelulla on org chart, projektit ja budjetti.", en: "Carries direction from the human to the agents, and reports back. Each service has an org chart, projects, and a budget." },
  "about.how.s2.t.os":        { fi: "Käyttöjärjestelmä orkestroi", en: "The operating system orchestrates" },
  "about.how.s2.b.os":        { fi: "Avoin lähdekoodi pohjana, raskaasti muokattu. Org chartit per palvelu, budjetit ja audit-jäljet.", en: "Open-source base, heavily customised. Org charts per service, budgets, and audit trails." },
  "about.how.s3.t": { fi: "Agentit toteuttavat",     en: "Agents execute" },
  "about.how.s3.b": { fi: "Koodi, deploy, korjaukset, asiakaspalvelu, monitorointi, prospektointi. Käytännössä kaikki paitsi suunta.", en: "Code, deploys, fixes, support, monitoring, prospecting. In practice, everything except direction." },
  "about.how.s4.t": { fi: "Ihminen tarkistaa",       en: "Human reviews" },
  "about.how.s4.b": { fi: "Aamuraportti, satunnaisotanta, hyväksyntäportit isoille muutoksille.", en: "Morning report, random sampling, approval gates for big changes." },

  "about.values.kicker": { fi: "Periaatteet", en: "Principles" },
  "about.values.title":  { fi: "Arvot",       en: "Values" },
  "about.values.v1.t": { fi: "Autonomia ja vastuu",          en: "Autonomy with accountability" },
  "about.values.v1.b": { fi: "Agentit saavat tehdä paljon. Siksi audit-jäljet, budjettikatto, ja ihmisen hyväksyntäportit isoille päätöksille.", en: "Agents are allowed to do a lot. Hence audit trails, budget caps, and human approval gates for the big decisions." },
  "about.values.v2.t": { fi: "Oikeat tuotteet, ei demoja",   en: "Real products, not demos" },
  "about.values.v2.b": { fi: "Tuotannossa, oikeilla asiakkailla. Ei kuvakaappauksia LinkedInissä.", en: "In production, with real customers. Not screenshots on LinkedIn." },
  "about.values.v3.t": { fi: "Avointa lähdekoodia missä mahdollista", en: "Open source where possible" },
  "about.values.v3.b": { fi: "Paperclip on MIT-lisenssillä. Tuotantohaara on yksityinen, mutta perusta jaetaan.", en: "Paperclip is MIT-licensed. The production fork is private, but the base is shared back." },
  "about.values.v4.t": { fi: "Suomalainen pragmatismi",      en: "Finnish pragmatism" },
  "about.values.v4.b": { fi: "Rakenna, mittaa, iteroi. Numerot puhukoot.", en: "Build it, measure it, iterate. Let the numbers speak." },

  // ── contact ─────────────────────────────────────────────────────────
  "contact.kicker": { fi: "Yhteystiedot", en: "Contact" },
  "contact.title": {
    fi: "Yksi sähköposti,\nyksi ihminen.",
    en: "One email,\none person.",
  },
  "contact.lede": {
    fi: "Vastaus saattaa tulla agentilta, mutta sähköposti tulee ihmiselle. Yritämme vastata kahden työpäivän kuluessa.",
    en: "The reply may be drafted by an agent, but the email goes to a human. We try to respond within two business days.",
  },
  "contact.founder": { fi: "Perustaja",  en: "Founder" },
  "contact.email":   { fi: "Sähköposti", en: "Email" },
  "contact.location": { fi: "Sijainti",  en: "Location" },
  "contact.location.value": { fi: "Suomi", en: "Finland" },
  "contact.company": { fi: "Yhtiö",      en: "Company" },
  "contact.company.value": { fi: "RK9 AI OY · Y-tunnus 3612536-6", en: "RK9 AI OY · Business ID 3612536-6" },

  // ── privacy ─────────────────────────────────────────────────────────
  "privacy.kicker": { fi: "Tietosuoja", en: "Privacy" },
  "privacy.title":  { fi: "Tietosuojaseloste", en: "Privacy policy" },
  "privacy.updated": { fi: "Päivitetty 12.05.2026", en: "Last updated 12 May 2026" },
  "privacy.s1.t": { fi: "Rekisterinpitäjä", en: "Data controller" },
  "privacy.s1.b": {
    fi: "RK9 AI OY, Forssa, Suomi. Yhteyshenkilö: Mikko-Ville Lahti, mikko-ville.lahti@rk9.fi.",
    en: "RK9 AI OY, Forssa, Finland. Contact: Mikko-Ville Lahti, mikko-ville.lahti@rk9.fi.",
  },
  "privacy.s2.t": { fi: "Käsitellyt tiedot", en: "Data processed" },
  "privacy.s2.b": {
    fi: "Yhteystietoja (nimi, sähköposti) käsitellään ainoastaan yhteydenpitoon ja palvelujen toimittamiseen. Käyttötilastoja kerätään anonyymisti.",
    en: "Contact data (name, email) is processed solely for correspondence and service delivery. Usage statistics are collected anonymously.",
  },
  "privacy.s3.t": { fi: "Tietojen luovutus", en: "Data sharing" },
  "privacy.s3.b": {
    fi: "Tietoja ei myydä eikä luovuteta kolmansille osapuolille markkinointitarkoituksiin. Käytämme yksittäisiä alihankkijoita (esim. sähköpostipalvelin) palvelun tuottamiseen.",
    en: "Data is not sold or shared with third parties for marketing. We use individual subprocessors (e.g. an email server) to operate the service.",
  },
  "privacy.s4.t": { fi: "Oikeutesi", en: "Your rights" },
  "privacy.s4.b": {
    fi: "Sinulla on oikeus pyytää datasi tarkastusta, korjausta tai poistoa. Lähetä pyyntö osoitteeseen mikko-ville.lahti@rk9.fi — vastaamme kuukauden kuluessa.",
    en: "You have the right to request inspection, correction, or deletion of your data. Send a request to mikko-ville.lahti@rk9.fi — we will respond within one month.",
  },

  // ── footer ──────────────────────────────────────────────────────────
  "footer.colophon": {
    fi: "Sivusto on yhden ihmisen ja koneellisen miehistön yhteistyö. Lähdekoodi on tarkastettavissa pyynnöstä.",
    en: "This site is the work of one person and a machine workforce. Source available on request.",
  },
  "footer.imprint": {
    fi: "© 2026 RK9 AI OY · Forssa",
    en: "© 2026 RK9 AI OY · Forssa",
  },
};

export function makeT(getLang) {
  return function t(key) {
    const entry = COPY[key];
    if (!entry) return "[" + key + "]";
    const lang = getLang();
    return entry[lang] || entry.en || entry.fi || key;
  };
}
