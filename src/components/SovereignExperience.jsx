import { useEffect, useRef, useState } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { Home, Boxes, Layers, Network, Database, Grid3X3, X, CodeXml } from 'lucide-react';
import { useLanguage } from '../context/LanguageContext';
import { goldPages } from '../utils/goldPages';
import { localFleetRequest } from '../utils/localFleet';
import Card3D from './Card3D';
import VisualExplainer from './VisualExplainer';
import PortableWorkspace from './PortableWorkspace';
import LocalFleetPanel from './LocalFleetPanel';
import useNavigationMenu from './useNavigationMenu';

const copy = {
  en: {
    home: 'Home', tech: 'Tech', workspace: 'Workspace', fleet: 'Fleet', memory: 'Memory', more: 'More',
    open: 'Open', preview: 'Preview', original: 'Original preview', watch: 'Watch',
    local: 'Local', manual: 'Manual', optional: 'Optional',
    offline: 'Offline', transfer: 'Transfer', advisory: 'Advisory',
    decorative: 'Illustrative gold 3D scene, not live telemetry',
    fiction: 'Original fiction. No medical service.',
    unavailable: 'Local fleet unavailable on this device.',
    missing: 'Page not found', missingNote: 'Choose a local page.',
    footer: 'PrimeAI · $0 local workspace', menu: 'Explore pages', close: 'Close navigation menu',
    originalDisclosure: 'Original concept screens are illustrative. Only proxied fleet records represent actual local data.',
  },
  fr: {
    home: 'Accueil', tech: 'Tech', workspace: 'Espace', fleet: 'Flotte', memory: 'Mémoire', more: 'Plus',
    open: 'Ouvrir', preview: 'Aperçu', original: 'Aperçu original', watch: 'Voir',
    local: 'Local', manual: 'Manuel', optional: 'Facultatif',
    offline: 'Hors ligne', transfer: 'Transfert', advisory: 'Conseil',
    decorative: 'Scène 3D dorée illustrative, sans télémétrie en direct',
    fiction: 'Fiction originale. Aucun service médical.',
    unavailable: 'Flotte locale indisponible sur cet appareil.',
    missing: 'Page introuvable', missingNote: 'Choisissez une page locale.',
    footer: 'PrimeAI · Espace local gratuit', menu: 'Explorer les pages', close: 'Fermer le menu',
    originalDisclosure: 'Les écrans conceptuels originaux sont illustratifs. Seuls les enregistrements de flotte via proxy représentent des données locales réelles.',
  },
};

function MemoryStatus({ label }) {
  const [data, setData] = useState(null);
  const [error, setError] = useState('');
  useEffect(() => {
    const controller = new AbortController();
    localFleetRequest('memory', { signal: AbortSignal.any([controller.signal, AbortSignal.timeout(8000)]) })
      .then(value => {
        if (value?.backend !== 'filesystem' || !value.counts || typeof value.counts !== 'object' ||
            Object.values(value.counts).some(count => !Number.isInteger(count) || count < 0)) throw new Error('Invalid memory counts.');
        if (!controller.signal.aborted) setData(value);
      }).catch(failure => { if (!controller.signal.aborted) setError(`${label} ${failure.message}`); });
    return () => controller.abort();
  }, [label]);
  return <section className="sg-memory" aria-label="Local filesystem memory">
    {error && <p role="alert">{error}</p>}
    {data && <dl>{Object.entries(data.counts).map(([kind, count]) => <div key={kind}><dt>{kind}</dt><dd>{count}</dd></div>)}</dl>}
  </section>;
}

function GoldScene({ label, small = false }) {
  return <div className={`sg-scene${small ? ' sg-scene-small' : ''}`} role="img" aria-label={label}>
    <div className="sg-scene-orbit" aria-hidden="true" />
    <div className="sg-scene-orbit sg-scene-orbit-cross" aria-hidden="true" />
    <div className="sg-orb" aria-hidden="true"><span>P</span></div>
  </div>;
}

export default function SovereignExperience({ children }) {
  const { pathname } = useLocation();
  const { language, setLanguage } = useLanguage();
  const c = copy[language];
  const descriptor = goldPages[pathname];
  const [originalOpen, setOriginalOpen] = useState(false);
  const [fleetReady, setFleetReady] = useState(false);
  const chapters = useRef([]);
  const { mobileMenuOpen, setMobileMenuOpen, toggleRef, menuRef } = useNavigationMenu();
  const legacy = new URLSearchParams(window.location.search).get('original') === '1';
  const title = descriptor?.[language][0] || c.missing;
  const subtitle = descriptor?.[language][1] || c.missingNote;
  useEffect(() => { document.title = `PrimeAI | ${title}`; }, [title]);
  useEffect(() => { window.scrollTo(0, 0); }, [pathname]);
  const nav = [
    { path: '/', label: c.home, Icon: Home }, { path: '/technologie', label: c.tech, Icon: Layers },
    { path: '/ecosysteme', label: c.workspace, Icon: Boxes }, { path: '/fleet-command', label: c.fleet, Icon: Network },
    { path: '/memory', label: c.memory, Icon: Database },
  ];
  const openOriginal = () => {
    setOriginalOpen(true);
    const detail = document.getElementById('sg-original');
    detail?.scrollIntoView({ behavior: matchMedia('(prefers-reduced-motion: reduce)').matches ? 'auto' : 'smooth' });
    detail?.querySelector('summary').focus({ preventScroll: true });
  };
  if (legacy) return <div className="sg-legacy-view">{children}</div>;
  return <div className="sg-shell">
    <a className="skip-link" href="#sg-main" onClick={event => {
      event.preventDefault(); document.getElementById('sg-main').focus(); document.getElementById('sg-main').scrollIntoView();
    }}>{language === 'fr' ? 'Aller au contenu' : 'Skip to content'}</a>
    <header className="sg-header">
      <div className="sg-header-inner">
        <Link to="/" className="sg-logo" aria-label="PrimeAI"><span className="sg-logo-orb" aria-hidden="true" /></Link>
        <nav className="sg-nav" aria-label={language === 'fr' ? 'Navigation principale' : 'Primary navigation'}>
          {nav.map(({ path, label, Icon }) => <Link key={path} to={path} aria-label={label} aria-current={pathname === path ? 'page' : undefined} onClick={() => setMobileMenuOpen(false)}>
            <Icon size={16} aria-hidden="true" /><span>{label}</span>
          </Link>)}
          <button ref={toggleRef} type="button" className="mobile-nav-toggle" aria-label={mobileMenuOpen ? c.close : (language === 'fr' ? 'Ouvrir le menu de navigation' : 'Open navigation menu')}
            aria-controls="sg-mobile-navigation" aria-expanded={mobileMenuOpen} onClick={() => setMobileMenuOpen(!mobileMenuOpen)}>
            <Grid3X3 size={16} aria-hidden="true" /><span>{c.more}</span>
          </button>
        </nav>
        <button className="sg-language" type="button" aria-label={language === 'en' ? 'Switch to French' : 'Passer en anglais'} onClick={() => setLanguage(language === 'en' ? 'fr' : 'en')}>{language === 'en' ? 'FR' : 'EN'}</button>
        <Link className="sg-button sg-header-cta" to="/ecosysteme">{c.open}</Link>
      </div>
    </header>
    {mobileMenuOpen && <div id="sg-mobile-navigation" className="sg-menu" ref={menuRef} role="dialog" aria-modal="true" aria-label={c.menu}>
      <button type="button" aria-label={c.close} onClick={() => { setMobileMenuOpen(false); toggleRef.current.focus(); }}><X size={20} /></button>
      <div className="sg-route-grid">{Object.entries(goldPages).filter(([route]) => route !== '/vision').map(([route, item]) => <Link to={route} key={route} onClick={() => setMobileMenuOpen(false)}>{item[language][0]}</Link>)}</div>
    </div>}
    <main id="sg-main" tabIndex={-1} data-fleet-ready={descriptor?.kind === 'fleet' ? fleetReady : undefined}>
      <section className="sg-hero" aria-labelledby="sg-title">
        <div className="sg-particles" aria-hidden="true" />
        <div className="sg-container sg-hero-grid">
          <div><h1 id="sg-title">{title}</h1><p className="sg-subline">{subtitle}</p>
            <div className="sg-actions">
              {pathname === '/ecosysteme' || descriptor?.kind === 'fleet' ? <button className="sg-button" type="button" onClick={() => {
                const area = document.getElementById('sg-functional');
                area.scrollIntoView({ behavior: matchMedia('(prefers-reduced-motion: reduce)').matches ? 'auto' : 'smooth' });
                area.querySelector('textarea')?.focus({ preventScroll: true });
              }}>{c.open}</button> : <Link className="sg-button" to="/ecosysteme">{c.workspace}</Link>}
              <button className="sg-button sg-ghost" type="button" onClick={openOriginal}>{c.preview}</button>
            </div>
          </div>
          <GoldScene label={c.decorative} />
        </div>
      </section>
      {descriptor && <div className="sg-container">
        <div className="sg-card-grid">
          {[[c.local, c.offline, '/ecosysteme'], [c.manual, c.transfer, '/ecosysteme'], [c.optional, c.advisory, '/fleet-command']].map(([heading, caption, href], index) => <Card3D key={heading} index={index}>
            <GoldScene small label={c.decorative} />
            <h2><Link to={href}>{heading}</Link></h2><p>{caption}</p>
          </Card3D>)}
        </div>
        {descriptor.kind === 'fiction' && <p className="sg-disclosure">{c.fiction}</p>}
        <div id="sg-functional" className="sg-functional">
          {pathname === '/ecosysteme' && <PortableWorkspace />}
          {descriptor.kind === 'fleet' && <LocalFleetPanel onReadiness={setFleetReady} compact />}
          {descriptor.kind === 'memory' && <MemoryStatus label={c.unavailable} />}
        </div>
        <section className="sg-media-strip" aria-label={c.watch}>
          <h2>{c.watch}</h2>
          <div className="sg-chapters">{descriptor.media.map((stem, index) => <button type="button" key={stem} aria-label={`${c.watch} ${stem}`}
            onClick={() => chapters.current[index]?.scrollIntoView({ behavior: matchMedia('(prefers-reduced-motion: reduce)').matches ? 'auto' : 'smooth', block: 'nearest', inline: 'center' })}>{index + 1}</button>)}</div>
          <div className="sg-reel" tabIndex={0} aria-label={c.watch}>
            {descriptor.media.map((stem, index) => <div className="sg-reel-chapter" key={stem} ref={element => { chapters.current[index] = element; }}>
              <VisualExplainer src={`/prime_${stem}_${language}.mp4`} autoPlay loop compact poster="/pwa-512.png"
                style={{ width: '100%', display: 'block', borderRadius: 'var(--sg-radius) var(--sg-radius) 0 0' }} />
            </div>)}
          </div>
        </section>
        <details id="sg-original" className="sg-original" open={originalOpen} onToggle={event => setOriginalOpen(event.currentTarget.open)}>
          <summary>{c.original}</summary>
          {originalOpen && <><p className="sg-disclosure">{c.originalDisclosure}</p>
            <iframe key={`${pathname}-${language}`} title={`${c.original}: ${title}`} src={`/?original=1#${pathname}`}
              loading="lazy" sandbox="allow-scripts allow-same-origin allow-forms allow-downloads" /></>}
        </details>
      </div>}
    </main>
    <footer className="sg-footer sg-container"><span>{c.footer}</span><a href="https://github.com/Yacinewhatchandcode/prime-ai-website" target="_blank" rel="noopener noreferrer" aria-label="GitHub"><CodeXml size={18} /></a></footer>
  </div>;
}
