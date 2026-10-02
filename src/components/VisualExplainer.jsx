import { useEffect, useId, useRef, useState } from 'react';
import { Play, Pause, Maximize } from 'lucide-react';
import { useLanguage } from '../context/LanguageContext';
import './visual-explainer.css';

async function playBounded(element) {
  let timer;
  try {
    await Promise.race([element.play(), new Promise((_, reject) => {
      timer = setTimeout(() => { element.pause(); reject(new Error('Playback timed out after 8 seconds.')); }, 8000);
    })]);
  } finally { clearTimeout(timer); }
}

export default function VisualExplainer({ style, src, autoPlay = false, compact = false, poster = '/pwa-512.png', ...props }) {
  const { t } = useLanguage();
  const video = useRef(null);
  const container = useRef(null);
  const caption = useId();
  const [playing, setPlaying] = useState(false);
  const [duration, setDuration] = useState(0);
  const [time, setTime] = useState(0);
  const [error, setError] = useState('');
  const [loaded, setLoaded] = useState(false);
  const manuallyPaused = useRef(false);
  const explicitPlayback = useRef(false);
  const manualPlayPending = useRef(false);
  const playError = t('media.playError');
  useEffect(() => {
    const element = video.current;
    const reduced = matchMedia('(prefers-reduced-motion: reduce)');
    let visible = false;
    let active = true;
    const load = () => setLoaded(true);
    const update = () => {
      if (!visible || document.hidden) { explicitPlayback.current = false; element.pause(); return; }
      if (reduced.matches && !explicitPlayback.current) { element.pause(); return; }
      if (autoPlay && !manuallyPaused.current && !reduced.matches) {
        load();
        if (loaded) playBounded(element).catch(failure => {
          if (active && visible && !reduced.matches && !document.hidden) setError(`${playError} ${failure.message}`);
        });
      }
    };
    const near = new IntersectionObserver(entries => {
      if (entries.some(entry => entry.isIntersecting)) { load(); near.disconnect(); }
    }, { rootMargin: '240px' });
    const viewport = new IntersectionObserver(entries => { visible = entries[0].isIntersecting && entries[0].intersectionRatio >= 0.1; update(); }, { threshold: 0.1 });
    near.observe(element);
    viewport.observe(element);
    if (loaded && manualPlayPending.current) {
      manualPlayPending.current = false;
      playBounded(element).catch(failure => { if (active) setError(`${playError} ${failure.message}`); });
    }
    reduced.addEventListener('change', update);
    document.addEventListener('visibilitychange', update);
    return () => {
      active = false; element.pause(); near.disconnect(); viewport.disconnect();
      reduced.removeEventListener('change', update); document.removeEventListener('visibilitychange', update);
    };
  }, [src, autoPlay, playError, loaded]);
  const toggle = async () => {
    setError('');
    // Keep the action consistent with its label during asynchronous autoplay events.
    if (playing) { explicitPlayback.current = false; manuallyPaused.current = true; video.current.pause(); }
    else {
      try {
        manuallyPaused.current = false;
        explicitPlayback.current = true;
        if (!loaded) { manualPlayPending.current = true; setLoaded(true); return; }
        await playBounded(video.current);
      }
      catch (failure) { setError(`${t('media.playError')} ${failure.message}`); }
    }
  };
  return (
    <div ref={container} className="visual-explainer" style={{ width: style?.width || '100%', maxWidth: style?.maxWidth }}>
      <video
        {...props} ref={video} src={loaded ? src : undefined} data-src={src} data-deferred={!loaded}
        poster={poster} width="1280" height="720" preload="metadata" muted playsInline controls={false}
        aria-describedby={caption} style={style}
        onPlay={() => setPlaying(true)} onPause={() => setPlaying(false)}
        onTimeUpdate={event => setTime(event.currentTarget.currentTime)}
        onLoadedMetadata={event => {
          setDuration(Number.isFinite(event.currentTarget.duration) ? event.currentTarget.duration : 0);
          setTime(event.currentTarget.currentTime);
          setError('');
        }}
        onError={() => setError(t('media.loadError'))}
      />
      <div className="visual-explainer-controls">
        <button type="button" aria-label={t(playing ? 'media.pause' : 'media.play')} onClick={toggle}>
          {compact ? (playing ? <Pause size={16} aria-hidden="true" /> : <Play size={16} aria-hidden="true" />) : t(playing ? 'media.pause' : 'media.play')}
        </button>
        <label className="visual-explainer-seek">
          {!compact && <span>{t('media.seek')}</span>}
          <input type="range" min="0" max={duration || 1} step="0.1" value={Math.min(time, duration || 1)} disabled={!duration}
            aria-label={t('media.seek')}
            onChange={event => { video.current.currentTime = Number(event.target.value); setTime(Number(event.target.value)); }} />
        </label>
        <output aria-label={t('media.position')}>{Math.floor(time)} / {Math.floor(duration)} s</output>
        {typeof document !== 'undefined' && document.fullscreenEnabled && <button type="button" aria-label={t('media.fullscreen')} onClick={async () => {
          try {
            if (document.fullscreenElement === container.current) await document.exitFullscreen();
            else await container.current.requestFullscreen();
          } catch (failure) { setError(`${t('media.fullscreenError')} ${failure.message}`); }
        }}>{compact ? <Maximize size={16} aria-hidden="true" /> : t('media.fullscreen')}</button>}
      </div>
      <p id={caption} className="visual-explainer-caption">{t(compact ? 'media.compactVisualOnly' : 'media.visualOnly')}</p>
      {error && <p role="alert" className="visual-explainer-error">{error}</p>}
    </div>
  );
}
