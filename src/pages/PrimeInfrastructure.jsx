import { Link } from 'react-router-dom';
import { useLanguage } from '../context/LanguageContext';
import './prime-infrastructure.css';

const copy = {
  en: {
    eyebrow: 'SOVEREIGN COGNITIVE INFRASTRUCTURE',
    title: 'Your intelligence. Your infrastructure. Your control.',
    description: 'Connect models, memory and agents on infrastructure you control — from research to real-world execution.',
    primary: 'Explore the Infrastructure',
    secondary: 'Discuss a Private Deployment',
    architecture: 'One governed path from models to execution',
    stages: [
      ['01', 'Models', 'Open or hosted models, selected for each task.'],
      ['02', 'Memory & reasoning', 'Your knowledge, retrieval and reasoning policies.'],
      ['03', 'Governed agents', 'Scoped tools, permissions, approvals and audit trails.'],
      ['04', 'Execution', 'Workflows connected to the systems you authorize.'],
    ],
    definitionLabel: 'What “sovereign” means here',
    definitionTitle: 'Control is a deployment decision, not a slogan.',
    definitions: [
      ['Where data resides', 'Choose the environment and region for your data, models and logs.'],
      ['Who controls access', 'Your organization sets identity, permissions, retention and audit policy.'],
      ['External providers', 'External model and cloud providers are optional; integrations depend on your chosen configuration.'],
      ['What runs locally', 'Models, memory and orchestration can run on infrastructure you operate, subject to hardware and deployment requirements.'],
    ],
    constellation: 'Part of one connected constellation',
    constellationText: 'PRIME-AI provides the infrastructure layer connecting YACE19AI research with AMLAZR execution.',
    research: 'Explore research',
    execution: 'Explore execution',
    details: 'Architecture details',
  },
  fr: {
    eyebrow: 'INFRASTRUCTURE COGNITIVE SOUVERAINE',
    title: 'Votre intelligence. Votre infrastructure. Votre contrôle.',
    description: 'Connectez modèles, mémoire et agents sur une infrastructure que vous contrôlez — de la recherche à l’exécution réelle.',
    primary: 'Explorer l’infrastructure',
    secondary: 'Discuter d’un déploiement privé',
    architecture: 'Un parcours gouverné, des modèles à l’exécution',
    stages: [
      ['01', 'Modèles', 'Modèles ouverts ou hébergés, choisis pour chaque tâche.'],
      ['02', 'Mémoire et raisonnement', 'Vos connaissances, votre recherche et vos règles de raisonnement.'],
      ['03', 'Agents gouvernés', 'Outils, permissions, validations et journaux d’audit contrôlés.'],
      ['04', 'Exécution', 'Flux de travail reliés aux systèmes que vous autorisez.'],
    ],
    definitionLabel: 'Ce que signifie « souverain »',
    definitionTitle: 'Le contrôle est un choix de déploiement, pas un slogan.',
    definitions: [
      ['Où résident les données', 'Choisissez l’environnement et la région de vos données, modèles et journaux.'],
      ['Qui contrôle les accès', 'Votre organisation définit l’identité, les permissions, la conservation et les audits.'],
      ['Fournisseurs externes', 'Les fournisseurs externes de modèles et de cloud sont optionnels ; les intégrations dépendent de votre configuration.'],
      ['Ce qui fonctionne localement', 'Modèles, mémoire et orchestration peuvent fonctionner sur une infrastructure que vous exploitez, selon les exigences matérielles et de déploiement.'],
    ],
    constellation: 'Au cœur d’une constellation connectée',
    constellationText: 'PRIME-AI fournit la couche d’infrastructure qui relie la recherche de YACE19AI à l’exécution d’AMLAZR.',
    research: 'Découvrir la recherche',
    execution: 'Découvrir l’exécution',
    details: 'Détails de l’architecture',
  },
};

export default function PrimeInfrastructure() {
  const { language } = useLanguage();
  const text = copy[language === 'fr' ? 'fr' : 'en'];

  return (
    <div className="prime-infrastructure">
      <section className="prime-hero" aria-labelledby="prime-home-title">
        <div className="prime-hero-copy">
          <p className="prime-eyebrow"><span aria-hidden="true" />{text.eyebrow}</p>
          <h1 id="prime-home-title">{text.title}</h1>
          <p className="prime-lede">{text.description}</p>
          <div className="prime-hero-actions">
            <Link className="prime-action primary" to="/technologie">{text.primary}<span aria-hidden="true">↗</span></Link>
            <a className="prime-action secondary" href="https://calendly.com/info-primeai/30min" target="_blank" rel="noopener noreferrer">{text.secondary}<span aria-hidden="true">↗</span></a>
          </div>
        </div>
        <div className="prime-hero-orbit" aria-hidden="true">
          <div className="orbit orbit-outer" />
          <div className="orbit orbit-inner" />
          <div className="orbit-core"><span>PRIME<br />AI</span></div>
          <i className="orbit-node node-blue" />
          <i className="orbit-node node-red" />
          <i className="orbit-node node-violet" />
        </div>
      </section>

      <section className="prime-architecture" aria-labelledby="prime-architecture-title">
        <div className="section-heading">
          <p className="prime-eyebrow">{text.eyebrow}</p>
          <h2 id="prime-architecture-title">{text.architecture}</h2>
        </div>
        <ol className="architecture-flow">
          {text.stages.map(([number, title, description], index) => (
            <li className="architecture-stage" key={number}>
              <span className="stage-number">{number}</span>
              <h3>{title}</h3>
              <p>{description}</p>
              {index < text.stages.length - 1 && <span className="stage-arrow" aria-hidden="true">→</span>}
            </li>
          ))}
        </ol>
      </section>

      <section className="prime-sovereignty" aria-labelledby="prime-sovereignty-title">
        <div className="sovereignty-intro">
          <p className="prime-eyebrow">{text.definitionLabel}</p>
          <h2 id="prime-sovereignty-title">{text.definitionTitle}</h2>
        </div>
        <dl className="sovereignty-definitions">
          {text.definitions.map(([term, definition]) => (
            <div key={term}>
              <dt>{term}</dt>
              <dd>{definition}</dd>
            </div>
          ))}
        </dl>
      </section>

      <section className="prime-constellation" aria-labelledby="prime-constellation-title">
        <div>
          <p className="prime-eyebrow">{text.constellation}</p>
          <h2 id="prime-constellation-title">{text.constellationText}</h2>
        </div>
        <div className="constellation-links">
          <a href="https://yace19ai.com">{text.research}<span aria-hidden="true">↗</span></a>
          <a href="https://amlazr.com">{text.execution}<span aria-hidden="true">↗</span></a>
          <Link to="/technologie">{text.details}<span aria-hidden="true">↗</span></Link>
        </div>
      </section>
    </div>
  );
}
