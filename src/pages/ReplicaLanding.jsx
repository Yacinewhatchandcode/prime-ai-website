import { useEffect, useRef, useState } from 'react';
import { ArrowRight, AudioLines, ChartNoAxesColumnIncreasing, Cloud, Globe2, Infinity as InfinityIcon, Mail, Menu, Monitor, Network, PlayCircle, Send, ShieldCheck, Smartphone, Sparkles, Target, X, Zap } from 'lucide-react';
import useNavigationMenu from '../components/useNavigationMenu';
import BrandAvatar from '../components/BrandAvatar';
import './replica.css';

const art = '/replica-art/';
const copy = {
  en: {
    nav: ['Platform', 'Ecosystem', 'Fleet', 'Briefing'],
    deploy: 'Deploy Sovereign Intelligence', eyebrow: 'Sovereign cognitive infrastructure',
    title: 'Intelligence.', title2: 'designed to think', title3: 'with you.',
    intro: 'PRIME-AI orchestrates sovereign multi-agent systems to amplify your cognition and scale your impact.',
    watch: 'Watch Overview', principles: ['Sovereign AI agents', 'Your data. Your rules.', 'Everywhere you work'],
    cards: [
      ['Memory', 'Persistent cognition.', 'Autonomous semantic backup.', 'Your knowledge, connected. A local-first memory layer keeps context available across your agents without handing ownership to a cloud vendor.'],
      ['Orchestration', 'Systems thinking together.', 'Synchronic collaborative multi-agents.', 'Specialized agents collaborate around your intent. Reasoning, creation and execution become one coordinated workflow, under your control.'],
      ['Trust', 'Your infrastructure. Your intelligence.', 'Uncompromising privacy by design.', 'Keep your models and data on infrastructure you choose. Local-first operation, clear boundaries and human oversight are core design principles.'],
    ],
    augmented: 'Augmented human', brainTitle: 'Your cognition.', brainTitle2: 'Augmented.',
    brainCopy: 'Free your mind from execution constraints. PRIME-AI manages the technical complexity, model alignment, and background data pipelines, so you can focus on what truly matters: higher-order thinking.',
    benefits: [['Amplify', 'creativity'], ['Accelerate', 'decisions'], ['Multiply', 'capabilities'], ['Scale', 'your impact']],
    ecosystem: 'PRIME-AI ecosystem', ecoTitle: 'An intelligence present', ecoTitle2: 'wherever you move forward.',
    ecoCopy: 'One ecosystem. Every platform.', ecoCopy2: 'Your sovereign AI companion, everywhere you work, create and build.',
    fleet: 'Your sovereign fleet', fleetTitle: 'Your Personal AI Fleet',
    fleetCopy: 'A constellation of specialized AI agents, working in harmony to amplify your cognition across every domain.',
    book: 'Book a Discovery Call', roles: ['Research', 'Creation', 'Orchestration', 'Analysis', 'Automation'],
    briefing: 'System briefing', briefingTitle: 'Stay ahead of the curve.',
    briefingCopy: 'Get notified about new sovereign updates, autonomous features, and exclusive architecture briefs.',
    subscribe: 'Subscribe', email: 'Your email address', demo: 'Local preview only. No email is stored or sent.',
    success: 'Demo complete. Your email was not stored or sent.',
    finalIntro: 'PRIME-AI is not a tool.', finalIntro2: 'It is your cognitive advantage.',
    finalTitle: 'Deploy Your Sovereign Fleet Today.',
    finalCopy: 'AI is not a SaaS vendor lock-in. It is a secure, decentralized infrastructure.', own: 'Own your intelligence.',
    privacy: 'Privacy', terms: 'Terms', copyright: '© 2026 PRIME-AI. Sovereign intelligence for a brighter tomorrow.',
    preview: 'Responsive preview', close: 'Close dialog', local: 'Local concept preview',
  },
  fr: {
    nav: ['Plateforme', 'Écosystème', 'Flotte', 'Briefing'],
    deploy: "Déployer l’intelligence souveraine", eyebrow: 'Infrastructure cognitive souveraine',
    title: 'L’intelligence.', title2: 'conçue pour penser', title3: 'avec vous.',
    intro: 'PRIME-AI orchestre des systèmes multi-agents souverains pour amplifier votre cognition et votre impact.',
    watch: 'Voir la présentation', principles: ['Agents IA souverains', 'Vos données. Vos règles.', 'Partout où vous travaillez'],
    cards: [
      ['Mémoire', 'Une cognition persistante.', 'Sauvegarde sémantique autonome.', 'Une mémoire locale connecte vos connaissances et conserve le contexte entre vos agents, sans céder vos données à un fournisseur cloud.'],
      ['Orchestration', 'Des systèmes qui pensent ensemble.', 'Des multi-agents collaboratifs.', 'Des agents spécialisés collaborent autour de votre intention. Raisonnement, création et exécution forment un flux coordonné, sous votre contrôle.'],
      ['Confiance', 'Votre infrastructure. Votre intelligence.', 'La confidentialité dès la conception.', 'Conservez vos modèles et vos données sur l’infrastructure de votre choix. Fonctionnement local et supervision humaine sont au cœur de la conception.'],
    ],
    augmented: 'Humain augmenté', brainTitle: 'Votre cognition.', brainTitle2: 'Augmentée.',
    brainCopy: 'Libérez votre esprit des contraintes d’exécution. PRIME-AI gère la complexité technique, l’alignement des modèles et les données en arrière-plan pour vous concentrer sur l’essentiel : la réflexion de haut niveau.',
    benefits: [['Amplifiez', 'la créativité'], ['Accélérez', 'les décisions'], ['Multipliez', 'vos capacités'], ['Développez', 'votre impact']],
    ecosystem: 'Écosystème PRIME-AI', ecoTitle: 'Une intelligence présente', ecoTitle2: 'partout où vous avancez.',
    ecoCopy: 'Un écosystème. Toutes les plateformes.', ecoCopy2: 'Votre compagnon IA souverain, partout où vous travaillez, créez et construisez.',
    fleet: 'Votre flotte souveraine', fleetTitle: 'Votre flotte IA personnelle',
    fleetCopy: 'Une constellation d’agents IA spécialisés, en harmonie pour amplifier votre cognition dans chaque domaine.',
    book: 'Planifier une découverte', roles: ['Recherche', 'Création', 'Orchestration', 'Analyse', 'Automatisation'],
    briefing: 'Briefing système', briefingTitle: 'Gardez une longueur d’avance.',
    briefingCopy: 'Découvrez les nouveautés souveraines, les fonctions autonomes et les dossiers d’architecture.',
    subscribe: 'S’abonner', email: 'Votre adresse email', demo: 'Aperçu local. Aucun email enregistré ou envoyé.',
    success: 'Démo terminée. Votre email n’a été ni enregistré ni envoyé.',
    finalIntro: 'PRIME-AI n’est pas un outil.', finalIntro2: 'C’est votre avantage cognitif.',
    finalTitle: 'Déployez votre flotte souveraine.',
    finalCopy: 'L’IA n’est pas un abonnement captif. C’est une infrastructure sécurisée et décentralisée.', own: 'Possédez votre intelligence.',
    privacy: 'Confidentialité', terms: 'Conditions', copyright: '© 2026 PRIME-AI. Une intelligence souveraine pour demain.',
    preview: 'Aperçu responsive', close: 'Fermer la fenêtre', local: 'Aperçu conceptuel local',
  },
};
const platforms = [
  { name: 'Mac', sub: 'macOS', Icon: Monitor, color: 'slate', video: 'desktop', description: 'Local-first desktop intelligence. Connect your working context on your own M4 and macOS infrastructure.' },
  { name: 'Windows', sub: 'Windows OS', Icon: Monitor, color: 'blue', video: 'desktop', description: 'A sovereign workspace for your Windows environment, with local models and secure file-system context.' },
  { name: 'Mobile', sub: 'iOS / Android', Icon: Smartphone, color: 'cyan', video: 'mobile', description: 'Take your thinking with you. A mobile companion for your notes, voice and asynchronous workflows.' },
  { name: 'Telegram (gram)', sub: 'Telegram Gateway', Icon: Send, color: 'cyan', video: 'gram', description: 'An optional messaging gateway to your own agent infrastructure. This preview does not connect a Telegram account.' },
  { name: 'Teleprompter', sub: 'DSPy Optimizer', Icon: Sparkles, color: 'purple', video: 'teleprompter', description: 'Compile and refine agent instructions through local validation and prompt optimization.' },
  { name: 'Private Cloud', sub: 'Private Server', Icon: Cloud, color: 'blue', video: 'cloud', description: 'Run inference and data pipelines on infrastructure you control. No cloud service is provisioned by this preview.' },
];
const ids = ['platform', 'ecosystem', 'fleet', 'briefing'];

export function PrimeWordmark() {
  return <span className="replica-wordmark">
    <img className="replica-brand-mark" src="/prime-trinity.svg" width="38" height="38" alt="" />
    <span>PRIME-AI</span>
  </span>;
}

function Eyebrow({ children, id }) {
  return <p className="replica-eyebrow" id={id}><span>{children}</span><i aria-hidden="true" /></p>;
}

export default function ReplicaLanding() {
  const [language, setLanguage] = useState('en');
  const c = copy[language];
  const [dialog, setDialog] = useState(null);
  const [submitted, setSubmitted] = useState(false);
  const dialogRef = useRef(null);
  const emailRef = useRef(null);
  const closingFocus = useRef(null);
  const { mobileMenuOpen, setMobileMenuOpen, toggleRef, menuRef } = useNavigationMenu();

  useEffect(() => {
    document.title = 'PRIME-AI — Sovereign cognitive infrastructure';
    const previousLanguage = document.documentElement.lang;
    document.documentElement.lang = language;
    return () => { document.documentElement.lang = previousLanguage; };
  }, [language]);

  useEffect(() => {
    const desktop = matchMedia('(min-width: 641px)');
    const closeMobileMenu = event => { if (event.matches) setMobileMenuOpen(false); };
    desktop.addEventListener('change', closeMobileMenu);
    return () => desktop.removeEventListener('change', closeMobileMenu);
  }, [setMobileMenuOpen]);

  useEffect(() => {
    if (!dialog) return;
    const element = dialogRef.current;
    const previousFocus = document.activeElement;
    const previousOverflow = document.body.style.overflow;
    document.body.style.overflow = 'hidden';
    element.showModal();
    return () => {
      element.close();
      document.body.style.overflow = previousOverflow;
      (closingFocus.current || previousFocus)?.focus({ preventScroll: true });
      closingFocus.current = null;
    };
  }, [dialog]);

  const deploy = () => setDialog({
    title: c.finalTitle,
    text: language === 'en'
      ? 'Start with your goals, your models, and infrastructure you own. This is a local design preview: no fleet is deployed and no discovery call is booked here.'
      : 'Commencez par vos objectifs, vos modèles et votre infrastructure. Cet aperçu local ne déploie aucune flotte et ne réserve aucun rendez-vous.',
    action: true,
  });
  const navigate = (event, id) => {
    event.preventDefault();
    setMobileMenuOpen(false);
    history.replaceState(null, '', `#${id}`);
    document.getElementById(id)?.scrollIntoView({ behavior: matchMedia('(prefers-reduced-motion: reduce)').matches ? 'instant' : 'smooth' });
    document.getElementById(id)?.focus({ preventScroll: true });
  };
  const showPolicy = type => setDialog({
    title: c[type],
    text: language === 'en'
      ? 'This local replica is a design demonstration, not the production service. No newsletter information is sent or persisted. All illustration assets are served locally; the HUD and fleet are conceptual, not live telemetry.'
      : 'Cette réplique locale est une démonstration, pas le service de production. Aucune donnée du formulaire n’est envoyée ni conservée. Les illustrations sont locales ; le HUD et la flotte ne sont pas des données en direct.',
  });

  return <div className="prime-replica">
    <a className="replica-skip" href="#platform" onClick={event => navigate(event, 'platform')}>{language === 'en' ? 'Skip to content' : 'Aller au contenu'}</a>
    <header className="replica-header replica-container">
      <a href="/replica" aria-label="PRIME-AI home"><PrimeWordmark /></a>
      <nav className="replica-desktop-nav" aria-label="Primary navigation">
        {ids.map((id, index) => <a href={`#${id}`} key={id} onClick={event => navigate(event, id)}>{c.nav[index]}</a>)}
      </nav>
      <div className="replica-header-actions">
        <Globe2 size={16} aria-hidden="true" />
        <button type="button" aria-label="English" aria-pressed={language === 'en'} onClick={() => setLanguage('en')}>EN</button>
        <button type="button" aria-label="Français" aria-pressed={language === 'fr'} onClick={() => setLanguage('fr')}>FR</button>
        <button className="replica-button replica-header-deploy" type="button" onClick={deploy}>{c.deploy} <ArrowRight size={14} /></button>
        <button className="replica-menu-toggle" type="button" ref={toggleRef} aria-controls="replica-mobile-menu" aria-expanded={mobileMenuOpen} aria-label={mobileMenuOpen ? 'Close navigation menu' : 'Open navigation menu'} onClick={() => setMobileMenuOpen(!mobileMenuOpen)}>
          {mobileMenuOpen ? <X /> : <Menu />}
        </button>
      </div>
      {mobileMenuOpen && <nav ref={menuRef} id="replica-mobile-menu" className="replica-mobile-nav" aria-label="Mobile navigation">
        {ids.map((id, index) => <a href={`#${id}`} key={id} onClick={event => navigate(event, id)}>{c.nav[index]}<ArrowRight size={18} /></a>)}
        <button className="replica-button" type="button" onClick={() => { setMobileMenuOpen(false); deploy(); }}>{c.deploy}<ArrowRight size={16} /></button>
      </nav>}
    </header>

    <main className="replica-container">
      <section id="platform" tabIndex={-1} className="replica-hero" aria-labelledby="replica-title">
        <div className="replica-hero-copy">
          <Eyebrow>{c.eyebrow}</Eyebrow>
          <h1 id="replica-title">{c.title}<br /><span className="replica-gradient">{c.title2}<br />{c.title3}</span></h1>
          <p className="replica-hero-description">{c.intro}</p>
          <div className="replica-hero-buttons">
            <button className="replica-button" type="button" onClick={deploy}>{c.deploy}<ArrowRight size={16} /></button>
            <button className="replica-button replica-button-light" type="button" onClick={() => setDialog({ title: c.watch, text: c.local, video: `sovereign_${language}` })}><PlayCircle size={21} />{c.watch}</button>
          </div>
          <div className="replica-principles">
            {[InfinityIcon, ShieldCheck, Globe2].map((Icon, index) => <div key={c.principles[index]}><span>{c.principles[index]}</span><Icon size={27} aria-hidden="true" /></div>)}
          </div>
        </div>
        <div className="replica-hero-art">
          <img className="replica-constellation" src={`${art}constellation.webp`} alt="A connected blue globe surrounded by colorful orbiting agent cities" width="470" height="417" fetchPriority="high" />
          <div className="replica-hud" aria-label="Illustrative cognitive HUD, not live telemetry">
            <div className="replica-hud-heading"><span>COGNITIVE_HUD_v2.0</span><i /><i /><i /></div>
            <div className="replica-scan"><Target size={22} /><strong>SCAN</strong><span /></div>
            <p><i />Ingesting digital memory nodes... OK</p>
            <p><i />Sync status: 100% synchronized</p>
            <p><i />Cognitive bridge established... OK</p>
            <span className="replica-hud-note">CONCEPT VISUALIZATION</span>
          </div>
          <p className="replica-art-mantra" aria-hidden="true">Connect<br />Orchestrate<br />Augment<br />Sovereign<br />Everywhere<span /></p>
        </div>
      </section>

      <section className="replica-foundations" aria-label="Sovereign foundations">
        {c.cards.map(([title, line1, line2, description], index) => <button type="button" className={`replica-foundation replica-foundation-${index}`} key={title} onClick={() => setDialog({ title, text: description })}>
          <img src={`${art}${['memory-orb', 'orchestration-orb', 'trust-orb'][index]}.webp`} alt="" width="71" height="79" />
          <span className="replica-card-copy"><strong>{title}</strong><span>{line1}<br />{line2}</span></span>
          <span className="replica-card-number">0{index + 1}</span><span className="replica-circle-arrow"><ArrowRight size={14} /></span>
        </button>)}
      </section>

      <section className="replica-augmented" aria-labelledby="replica-brain-title">
        <div className="replica-brain-copy">
          <Eyebrow>{c.augmented}</Eyebrow>
          <h2 id="replica-brain-title">{c.brainTitle}<br /><span className="replica-gradient">{c.brainTitle2}</span></h2>
          <p>{c.brainCopy}</p>
          <div className="replica-benefits">{[Zap, Target, Network, ChartNoAxesColumnIncreasing].map((Icon, index) => <div key={index}><span className={`replica-benefit-icon replica-benefit-${index}`}><Icon size={25} /></span><span><strong>{c.benefits[index][0]}</strong><br />{c.benefits[index][1]}</span></div>)}</div>
        </div>
        <div className="replica-brain-art">
          <img src={`${art}augmented-brain.webp`} alt="A luminous multicolored brain connected to orbiting intelligence nodes" width="399" height="246" loading="lazy" />
          <p className="replica-art-mantra" aria-hidden="true">Think further<br />Create more<br />Move faster<br />Stay sovereign<span /></p>
        </div>
      </section>

      <BrandAvatar />
      <section id="ecosystem" tabIndex={-1} className="replica-ecosystem" aria-labelledby="replica-eco-title">
        <Eyebrow>{c.ecosystem}</Eyebrow>
        <div className="replica-section-heading"><h2 id="replica-eco-title">{c.ecoTitle}<br /><span className="replica-gradient">{c.ecoTitle2}</span></h2><p>{c.ecoCopy}<br />{c.ecoCopy2}</p></div>
        <div className="replica-platforms">
          {platforms.map(({ name, sub, Icon, color, video, description }, index) => <button type="button" key={name} onClick={() => setDialog({ title: name, text: description, video: `${video}_${language}` })} className="replica-platform">
            {index === 0 ? <svg className="replica-apple" viewBox="0 0 32 36" aria-hidden="true"><path d="M21 7c2-2 3-4 3-7-3 0-5 2-7 4-1 2-2 4-1 6 2 0 4-1 5-3ZM27 19c0-4 2-6 4-7-2-3-5-4-7-4-3 0-5 2-7 2s-4-2-7-2C5 8 1 12 1 18c0 6 3 13 6 17 2 2 4 1 6 0s4-1 6 0 4 2 6-1c2-2 4-6 5-9-2-1-3-3-3-6Z" fill="currentColor" /></svg>
              : index === 1 ? <svg className="replica-windows" viewBox="0 0 32 32" aria-hidden="true"><path d="m1 4 13-2v12H1Zm16-2 14-2v14H17ZM1 17h13v12L1 27Zm16 0h14v15l-14-2Z" fill="currentColor" /></svg>
                : <Icon className={`replica-platform-icon replica-icon-${color}`} size={40} strokeWidth={1.7} aria-hidden="true" />}
            <strong>{name}</strong><span>{sub}</span><span className="replica-circle-arrow"><ArrowRight size={13} /></span>
          </button>)}
        </div>
      </section>

      <section id="fleet" tabIndex={-1} className="replica-fleet" aria-labelledby="replica-fleet-title">
        <div><Eyebrow>{c.fleet}</Eyebrow><h2 id="replica-fleet-title">{c.fleetTitle}</h2><p>{c.fleetCopy}</p><button className="replica-button" type="button" onClick={deploy}>{c.book}<ArrowRight size={16} /></button></div>
        <figure className="replica-fleet-art"><img src={`${art}fleet.webp`} width="549" height="132" alt="Five colorful agent cities linked into one sovereign constellation" loading="lazy" /><figcaption>{c.roles.map((role, index) => <span key={role} className={`replica-role-${index}`}>{role}</span>)}</figcaption></figure>
      </section>

      <section id="briefing" tabIndex={-1} className="replica-briefing" aria-labelledby="replica-briefing-title">
        <Eyebrow>{c.briefing}</Eyebrow>
        <div className="replica-section-heading"><h2 id="replica-briefing-title">{c.briefingTitle}</h2><p>{c.briefingCopy}</p></div>
        <form className="replica-signup" onSubmit={event => { event.preventDefault(); setSubmitted(true); emailRef.current.value = ''; }}>
          <label className="replica-email"><Mail size={20} aria-hidden="true" /><span className="replica-sr-only">{c.email}</span><input ref={emailRef} type="email" required name="email" placeholder="satoshi@example.com" autoComplete="email" onChange={() => setSubmitted(false)} aria-describedby="replica-signup-note" /></label>
          <button className="replica-button" type="submit">{c.subscribe}<ArrowRight size={16} /></button>
        </form>
        <p id="replica-signup-note" className="replica-signup-note" role="status">{submitted ? c.success : c.demo}</p>
      </section>

      <section className="replica-final" aria-labelledby="replica-final-title">
        <img className="replica-final-globe" src={`${art}final-globe.webp`} alt="" width="211" height="171" loading="lazy" />
        <div><p>{c.finalIntro}<br /><strong className="replica-gradient">{c.finalIntro2}</strong></p><span className="replica-final-rule" /><h2 id="replica-final-title">{c.finalTitle}</h2><p className="replica-final-description">{c.finalCopy}<br /><strong>{c.own}</strong></p><button className="replica-button" type="button" onClick={deploy}>{c.deploy}<ArrowRight size={16} /></button></div>
        <img className="replica-final-city" src={`${art}final-city.webp`} alt="" width="220" height="171" loading="lazy" />
      </section>
    </main>

    <footer className="replica-footer replica-container">
      <a href="/replica" aria-label="PRIME-AI home"><PrimeWordmark /></a>
      <nav aria-label="Footer navigation">{ids.map((id, index) => <a key={id} href={`#${id}`} onClick={event => navigate(event, id)}>{c.nav[index]}</a>)}<button type="button" onClick={() => showPolicy('privacy')}>{c.privacy}</button><button type="button" onClick={() => showPolicy('terms')}>{c.terms}</button></nav>
      <span className="replica-socials" aria-label="Sovereign connectivity"><Network size={17} /><AudioLines size={17} /><Globe2 size={17} /></span>
      <small>{c.copyright}</small>
      <a className="replica-preview-link" href="/responsive-preview">{c.preview}<ArrowRight size={12} /></a>
      <a className="replica-preview-link" href="/semantic-library">{language === 'en' ? 'Keyword library' : 'Bibliothèque sémantique'}<ArrowRight size={12} /></a>
      <a className="replica-preview-link" href="/legacy/#/">{language === 'en' ? 'Existing workspace' : 'Espace existant'}<ArrowRight size={12} /></a>
      <nav className="replica-brand-family" aria-label={language === 'en' ? 'PRIME-AI brand constellation' : 'Constellation de marques PRIME-AI'}>
        <span>{language === 'en' ? 'Three triangles. Nine points. One constellation.' : 'Trois triangles. Neuf pointes. Une constellation.'}</span>
        <a href="https://prime-ai.com" target="_blank" rel="noreferrer">PRIME-AI <ArrowRight size={12} /></a>
        <a href="https://prime-ai.fr" target="_blank" rel="noreferrer">prime-ai.fr</a>
        <a href="https://yace19ai.com" target="_blank" rel="noreferrer">yace19ai.com</a>
        <a href="https://amlazr.com" target="_blank" rel="noreferrer">amlazr.com</a>
      </nav>
    </footer>

    <dialog ref={dialogRef} className="replica-dialog" aria-labelledby="replica-dialog-title" onCancel={() => setDialog(null)} onClick={event => { if (event.target === event.currentTarget) setDialog(null); }}>
      {dialog && <><button className="replica-dialog-close" aria-label={c.close} onClick={() => setDialog(null)} type="button" autoFocus><X /></button><Eyebrow>{c.local}</Eyebrow><h2 id="replica-dialog-title">{dialog.title}</h2><p>{dialog.text}</p>
        {dialog.video && <><video key={dialog.video} src={`/prime_${dialog.video}.mp4`} controls muted playsInline preload="none" poster={`${art}constellation.webp`} aria-describedby="replica-video-caption" /><p id="replica-video-caption" className="replica-video-caption">{language === 'en' ? 'Illustrative visual explainer. No narration or soundtrack; read the on-screen text. The concepts are also described on this page.' : 'Explication visuelle illustrative, sans narration ni bande-son. Lisez le texte à l’écran. Les concepts sont aussi décrits sur cette page.'}</p></>}
        {dialog.action && <button className="replica-button" type="button" onClick={() => { closingFocus.current = emailRef.current; setDialog(null); document.getElementById('briefing').scrollIntoView(); }}>{c.nav[3]}<ArrowRight size={16} /></button>}
      </>}
    </dialog>
  </div>;
}
