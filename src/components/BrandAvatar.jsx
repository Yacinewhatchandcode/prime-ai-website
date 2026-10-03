import { useEffect, useId, useRef, useState } from 'react';
import { ArrowUpRight, ChevronDown, ChevronUp, Square, Volume2, X } from 'lucide-react';
import { brandProfiles, personalLogoStatement, resolveBrand } from '../utils/brandProfiles';
import IntentChat from './IntentChat';
import './brand-avatar.css';

export default function BrandAvatar() {
  const [brand, setBrand] = useState(() => resolveBrand(window.location));
  const [open, setOpen] = useState(false);
  const [speaking, setSpeaking] = useState(false);
  const [speechError, setSpeechError] = useState('');
  const trigger = useRef(null);
  const lastTap = useRef(null);
  const utterance = useRef(null);
  const id = useId();
  const speechSupported = typeof window.speechSynthesis !== 'undefined' && typeof window.SpeechSynthesisUtterance !== 'undefined';

  const stopSpeech = () => {
    if (utterance.current) {
      utterance.current.onend = null;
      utterance.current.onerror = null;
      window.speechSynthesis.cancel();
      utterance.current = null;
    }
    setSpeaking(false);
  };

  useEffect(() => {
    return () => {
      if (utterance.current) {
        utterance.current.onend = null;
        utterance.current.onerror = null;
        window.speechSynthesis.cancel();
      }
    };
  }, []);

  const selectBrand = profile => {
    stopSpeech();
    setSpeechError('');
    setBrand(profile);
    const url = new URL(window.location.href);
    url.searchParams.set('brand', profile.id);
    history.replaceState(null, '', `${url.pathname}${url.search}${url.hash}`);
  };
  const activateColor = (event, profile) => {
    selectBrand(profile);
    // Keyboard activation opens the layer directly; touch/mouse opens on the second tap.
    if (event.detail === 0) { setOpen(true); return; }
    const now = event.timeStamp;
    if (lastTap.current?.brand === profile.id && now - lastTap.current.time < 450) {
      setOpen(true);
      lastTap.current = null;
    } else lastTap.current = { brand: profile.id, time: now };
  };
  const close = () => { stopSpeech(); setOpen(false); trigger.current?.focus({ preventScroll: true }); };
  const speak = () => {
    stopSpeech();
    setSpeechError('');
    if (!speechSupported) { setSpeechError('This browser does not support speech synthesis. The complete introduction is available as text.'); return; }
    const value = new window.SpeechSynthesisUtterance(`${brand.name}. ${personalLogoStatement} ${brand.meaning}`);
    const localVoice = window.speechSynthesis.getVoices().find(voice => voice.localService && voice.lang.startsWith('en'));
    if (!localVoice) { setSpeechError('No verified device-local English voice is available. Speech was not started; the introduction remains available as text.'); return; }
    value.voice = localVoice;
    value.lang = localVoice.lang;
    value.onend = () => { setSpeaking(false); utterance.current = null; };
    value.onerror = event => { setSpeaking(false); utterance.current = null; setSpeechError(`Device speech failed: ${event.error}.`); };
    utterance.current = value;
    setSpeaking(true);
    window.speechSynthesis.speak(value);
  };

  return <section id="brand-constellation" className={`brand-avatar${open ? ' brand-avatar-open' : ''}`} style={{ '--brand-accent': brand.accent }} aria-label="Three-color 3D unfolding avatar ribbon">
    <div className="brand-avatar-ribbon">
    <button type="button" className="brand-avatar-logo" aria-label={`Open ${brand.name} avatar layer`} aria-expanded={open} aria-controls={`${id}-panel`} onClick={() => open ? close() : setOpen(true)}><span className="brand-logo-orbit" aria-hidden="true" /><img src="/prime-trinity.svg" width="64" height="64" alt="" /></button>
    <div className="brand-avatar-introduction"><strong>{brand.name} <span>· {brand.domain}</span></strong><p>{personalLogoStatement}</p><small>Your personal declaration · three triangles, nine points</small></div>
    <div className="brand-avatar-colors" role="group" aria-label="Choose a website color layer">
      {brandProfiles.map(profile => <button key={profile.id} type="button" className={`brand-color brand-color-${profile.id}`} aria-pressed={brand.id === profile.id} aria-label={`${profile.color}: ${profile.name} layer`} onClick={event => activateColor(event, profile)}><svg width="16" height="16" viewBox="0 0 20 20" aria-hidden="true"><path d="M10 2 18 17H2Z" fill={profile.id === 'amlazr' ? '#fff' : profile.accent} stroke={profile.id === 'amlazr' ? '#79869f' : profile.accent} strokeWidth="1.5" /></svg><span>{profile.color}</span></button>)}
    </div>
    <button ref={trigger} className="brand-open-layer" type="button" aria-expanded={open} aria-controls={`${id}-panel`} onClick={() => open ? close() : setOpen(true)}>{open ? <ChevronUp size={17} /> : <ChevronDown size={17} />}{open ? 'Fold layer' : 'Unfold layer'}</button>
    <small className="brand-gesture-note">Tap to select · double-tap to open · Enter opens directly</small>
    </div>
    <div id={`${id}-panel`} className="brand-avatar-fold" hidden={!open} role="region" aria-labelledby={`${id}-title`} onKeyDown={event => { if (event.key === 'Escape') { event.stopPropagation(); close(); } }}>
      {open && <>
        <button className="brand-avatar-close" type="button" aria-label="Fold avatar layer" onClick={close}><X size={21} /></button>
        <div className="brand-avatar-dialog-heading"><img src="/prime-trinity.svg" width="65" height="65" alt="" /><div><p>{brand.color} · personal identity layer</p><h2 id={`${id}-title`}>{brand.name}</h2></div></div>
        <blockquote>{personalLogoStatement}</blockquote>
        <p className="brand-meaning">{brand.meaning}</p>
        <p className="brand-provenance">The blue/white/red colors and three-domain identity follow your direction. The layer descriptions are design copy, not generated facts about your life. The custom nine-point mark is inspired by your Bahá’í symbolism; it does not claim to be an official religious emblem.</p>
        <div className="brand-avatar-dialog-links"><a href={brand.url} target="_blank" rel="noreferrer">Visit {brand.domain}<ArrowUpRight size={14} /></a><nav aria-label="Local brand layer previews">{brandProfiles.map(profile => <a href={`/replica?brand=${profile.id}`} key={profile.id} aria-current={profile.id === brand.id ? 'page' : undefined}>{profile.name}</a>)}</nav></div>
        <div className="brand-speech"><button type="button" onClick={speak} disabled={speaking || !speechSupported}><Volume2 size={16} />Read my introduction</button><button type="button" onClick={stopSpeech} disabled={!speaking}><Square size={14} />Stop voice</button><span>Optional device-local text-to-speech · not Julia model speech</span></div>
        {speechError && <p className="brand-speech-error" role="alert">{speechError}</p>}
        <p className="brand-julia-state">Julia avatar retrieval: not connected to these domain layers. The panel below uses the existing local PRIME intent service and its allowlisted sources; it does not claim to retrieve YACE19AI or AMLAZR knowledge. No automatic inference or website changes occur.</p>
        <IntentChat identity={brand.name} initialExpanded />
      </>}
    </div>
  </section>;
}
