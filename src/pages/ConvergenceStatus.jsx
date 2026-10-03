import { useEffect } from 'react';
import { convergenceMilestones, reviewedAt, summarizeMilestones } from '../utils/convergenceStatus';
import './convergence-status.css';

export default function ConvergenceStatus() {
  const progress = summarizeMilestones(convergenceMilestones);
  useEffect(() => { document.title = 'PRIME-AI — Progression vérifiée'; }, []);
  return <main className="convergence-page">
    <a href="/responsive-preview">← Cockpit desktop + mobile</a>
    <h1>Progression vérifiée</h1>
    <p>Trois sites, dix jalons. Bleu : validé. Gris : restant ou bloqué.</p>
    <section className="convergence-overview" aria-label="Progression globale">
      <div className="convergence-pie" role="img" aria-label={`${progress.percent} % des jalons validés ; ${100 - progress.percent} % restants ou bloqués`} style={{ '--progress-angle': `${progress.percent * 3.6}deg` }} />
      <div><strong>{progress.percent} %</strong><p>{progress.completed} / {progress.total} jalons validés</p><span className="convergence-key"><i />Validés</span><span className="convergence-key remaining"><i />Restants ou bloqués</span></div>
    </section>
    <p className="convergence-warning"><strong>Aucun des trois sites publics n’a reçu cette version.</strong> Ce pourcentage compte des jalons de même poids, pas du temps de travail ni une estimation de livraison.</p>
    <p className="convergence-timestamp">État documenté au <time dateTime={reviewedAt}>{new Date(reviewedAt).toLocaleString('fr-FR', { timeZone: 'Europe/Paris' })} (Paris)</time>. Pas de télémétrie automatique : un jalon ne change qu’après nouvelle validation.</p>
    <ul className="convergence-milestones">{convergenceMilestones.map(item => <li key={item.id}>
      <span className={`convergence-badge${item.complete ? ' complete' : ''}`}>{item.complete ? 'Validé' : 'Restant / bloqué'}</span>
      <h2>{item.title}</h2><p>{item.evidence}</p>{item.href && <a href={item.href}>Voir le résultat local →</a>}
    </li>)}</ul>
    <p className="convergence-warning">Le bleu à 100 % exige des preuves pour les dix jalons. Activer les agents ne suffit pas à valider leurs résultats.</p>
  </main>;
}
