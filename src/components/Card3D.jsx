import { useEffect, useRef } from 'react';

export default function Card3D({ children, index = 0 }) {
  const card = useRef(null);
  const highlight = useRef(null);
  const frame = useRef(0);
  useEffect(() => {
    const element = card.current;
    const reduced = matchMedia('(prefers-reduced-motion: reduce)');
    const observer = new IntersectionObserver(entries => {
      if (entries.some(entry => entry.isIntersecting)) { element.classList.add('sg-revealed'); observer.disconnect(); }
    });
    observer.observe(element);
    const reset = () => {
      cancelAnimationFrame(frame.current);
      element.style.transform = '';
      highlight.current.style.transform = '';
    };
    reduced.addEventListener('change', reset);
    return () => { observer.disconnect(); cancelAnimationFrame(frame.current); reduced.removeEventListener('change', reset); };
  }, []);
  const move = event => {
    if (event.pointerType !== 'mouse' || matchMedia('(prefers-reduced-motion: reduce)').matches) return;
    const rect = card.current.getBoundingClientRect();
    const x = Math.max(-1, Math.min(1, (event.clientX - rect.left) / rect.width * 2 - 1));
    const y = Math.max(-1, Math.min(1, (event.clientY - rect.top) / rect.height * 2 - 1));
    cancelAnimationFrame(frame.current);
    frame.current = requestAnimationFrame(() => {
      card.current.style.transform = `rotateX(${-y * 8}deg) rotateY(${x * 8}deg)`;
      highlight.current.style.transform = `translate3d(${x * rect.width / 2}px, ${y * rect.height / 2}px, 0)`;
    });
  };
  return <div className="sg-card-perspective">
    <article ref={card} className="sg-card sg-reveal" style={{ transitionDelay: `${index * 60}ms` }} onPointerMove={move}
      onPointerLeave={() => { cancelAnimationFrame(frame.current); card.current.style.transform = ''; highlight.current.style.transform = ''; }}>
      <div ref={highlight} className="sg-card-highlight" aria-hidden="true" />
      {children}
    </article>
  </div>;
}
