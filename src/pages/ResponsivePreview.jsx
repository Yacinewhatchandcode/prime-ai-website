import { useEffect, useRef, useState } from 'react';
import { ArrowUpRight, Monitor, RefreshCw, Smartphone } from 'lucide-react';
import { PrimeWordmark } from './ReplicaLanding';
import IntentChat from '../components/IntentChat';
import './responsive-preview.css';

function DevicePane({ width, height, mobile, version }) {
  const container = useRef(null);
  const [scale, setScale] = useState(1);
  useEffect(() => {
    const observer = new ResizeObserver(([entry]) => setScale(Math.min(1, entry.contentRect.width / width)));
    observer.observe(container.current);
    return () => observer.disconnect();
  }, [width]);
  return <div className={`preview-device ${mobile ? 'preview-phone' : 'preview-desktop'}`}>
    <div className="preview-device-bar">{mobile ? <Smartphone size={14} /> : <Monitor size={14} />}<span>{mobile ? 'Mobile' : 'Desktop'} · {width} × {height}</span><a href="/replica" target="_blank" rel="noreferrer" aria-label={`Open ${mobile ? 'mobile' : 'desktop'} page in a new tab`}><ArrowUpRight size={15} /></a></div>
    <div ref={container} className="preview-scale-area">
      <div style={{ height: height * scale }} className="preview-iframe-holder">
        <iframe key={version} title={`PRIME-AI ${mobile ? 'mobile' : 'desktop'} responsive implementation`} src="/replica?embedded=1" style={{ width, height, transform: `scale(${scale})` }} />
      </div>
    </div>
  </div>;
}

export default function ResponsivePreview() {
  const [mobile, setMobile] = useState(390);
  const [desktop, setDesktop] = useState(1440);
  const [version, setVersion] = useState(0);
  useEffect(() => { document.title = 'PRIME-AI — Desktop + mobile preview'; }, []);
  return <main className="replica-preview">
    <header className="preview-toolbar">
      <a href="/replica" aria-label="Open PRIME-AI landing page"><PrimeWordmark /></a>
      <div><h1>One intelligence. Every screen.</h1><p>Two real viewports. One responsive implementation.</p></div>
      <a className="preview-open" href="/replica" target="_blank" rel="noreferrer">Open landing page<ArrowUpRight size={16} /></a>
    </header>
    <section className="preview-controls" aria-label="Viewport controls">
      <label><Monitor size={17} />Desktop<select value={desktop} onChange={event => setDesktop(Number(event.target.value))}><option value={1440}>1440 px</option><option value={1280}>1280 px</option><option value={1024}>1024 px</option></select></label>
      <label><Smartphone size={17} />Mobile<select value={mobile} onChange={event => setMobile(Number(event.target.value))}><option value={390}>390 px</option><option value={375}>375 px</option></select></label>
      <button type="button" onClick={() => setVersion(version + 1)}><RefreshCw size={16} />Reset both</button>
      <span>Scroll each pane independently · local-only demo</span>
      <a href="/semantic-library" className="preview-resource-link">Keyword library<ArrowUpRight size={13} /></a>
      <a href="/convergence" className="preview-resource-link">Progression vérifiée<ArrowUpRight size={13} /></a>
      <a href="/replica-image" className="preview-resource-link">Full replica images<ArrowUpRight size={13} /></a>
      <a href="/legacy/#/" className="preview-resource-link">Existing workspace<ArrowUpRight size={13} /></a>
    </section>
    <IntentChat />
    <div className="preview-panes">
      <DevicePane width={desktop} height={1100} version={version} />
      <DevicePane width={mobile} height={844} mobile version={version} />
    </div>
    <p className="preview-disclosure">Illustrations extracted from the supplied reference; layout, navigation, cards and forms are real components. HUD and fleet artwork are conceptual, not live status. No signup information is sent.</p>
  </main>;
}
