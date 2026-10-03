import { useEffect, useState } from 'react';
import { ArrowLeft, Download } from 'lucide-react';
import './replica-image.css';

export default function ReplicaImage() {
  const [mode, setMode] = useState('paired');
  const [manifest, setManifest] = useState(null);
  const [error, setError] = useState('');
  useEffect(() => {
    document.title = 'PRIME-AI — Complete replica image';
    const controller = new AbortController();
    fetch('/replica-exports/manifest.json', { signal: controller.signal })
      .then(async response => {
        if (!response.ok) throw new Error(`Image manifest returned HTTP ${response.status}`);
        const data = await response.json();
        if (!Array.isArray(data.images) || !data.composition) throw new Error('Incomplete full-page image manifest.');
        setManifest(data);
      }).catch(failure => { if (!controller.signal.aborted) setError(failure.message); });
    return () => controller.abort();
  }, []);
  const image = manifest && (mode === 'paired' ? manifest.composition : manifest.images.find(item => item.viewport.width === (mode === 'desktop' ? 1440 : 390)));
  return <main className="replica-image-page">
    <header><a href="/responsive-preview"><ArrowLeft size={16} />Live responsive preview</a><a href="/semantic-library">Source-backed keyword library</a></header>
    <h1>The complete PRIME-AI replica.</h1><p>Tailored full-page images of the real local implementation. Both complete pages are included in the paired visual; no sections are cut off.</p>
    <div className="replica-image-controls" role="group" aria-label="Image composition">{['paired', 'desktop', 'mobile'].map(value => <button type="button" key={value} aria-pressed={mode === value} onClick={() => setMode(value)}>{value === 'paired' ? 'Desktop + mobile' : value === 'desktop' ? 'Full desktop' : 'Full mobile'}</button>)}</div>
    {error && <p role="alert">{error}</p>}
    {!manifest && !error && <p role="status">Loading complete image exports…</p>}
    {image && <><div className="replica-image-info"><span>{image.pixelWidth} × {image.pixelHeight} pixels</span><a href={`/replica-exports/${image.filename}`} download><Download size={16} />Download PNG</a></div><figure className={`replica-image-figure replica-image-${mode}`}><img src={`/replica-exports/${image.filename}`} width={image.pixelWidth} height={image.pixelHeight} alt={mode === 'paired' ? 'Complete PRIME-AI landing page displayed as full desktop and mobile implementations side by side' : `Complete ${mode} PRIME-AI landing-page image`} /></figure><p className="replica-image-limitation">{manifest.limitation} Generated {manifest.generatedAt}. For accessible text and working controls, use the live page rather than this visual export.</p></>}
  </main>;
}
