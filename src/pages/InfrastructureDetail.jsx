import { Link } from 'react-router-dom';
import { useLanguage } from '../context/LanguageContext';
import './infrastructure-detail.css';

const pages = {
  technology: {
    en: {
      eyebrow: 'PRIME-AI TECHNOLOGY',
      title: 'Connect intelligence to the environments you govern.',
      intro: 'PRIME-AI is a composable infrastructure layer, not a requirement to use one model or one cloud. Deployment boundaries and integrations are chosen for each environment.',
      stages: [
        ['Models', 'Configure local, open or hosted model endpoints according to your task and deployment policy.'],
        ['Memory & reasoning', 'Connect approved knowledge sources and define retrieval, retention and residency rules.'],
        ['Governed agents', 'Scope each agent to its approved tools, permissions, review steps and audit requirements.'],
        ['Execution', 'Connect workflows to the systems and actions that an operator has authorized.'],
      ],
      note: 'Architecture and availability depend on your selected components, hardware and deployment configuration.',
      next: 'Explore sovereignty',
      nextPath: '/sovereign-ai',
    },
    fr: {
      eyebrow: 'TECHNOLOGIE PRIME-AI',
      title: 'Reliez l’intelligence aux environnements que vous gouvernez.',
      intro: 'PRIME-AI est une couche d’infrastructure composable, sans modèle ni cloud imposé. Les limites de déploiement et les intégrations sont choisies pour chaque environnement.',
      stages: [
        ['Modèles', 'Configurez des points d’accès locaux, ouverts ou hébergés selon la tâche et la politique de déploiement.'],
        ['Mémoire et raisonnement', 'Connectez les sources autorisées et définissez les règles de recherche, conservation et résidence.'],
        ['Agents gouvernés', 'Limitez chaque agent à ses outils, permissions, validations et exigences d’audit.'],
        ['Exécution', 'Reliez les flux aux systèmes et actions autorisés par un opérateur.'],
      ],
      note: 'L’architecture et la disponibilité dépendent des composants, du matériel et de la configuration sélectionnés.',
      next: 'Explorer la souveraineté',
      nextPath: '/sovereign-ai',
    },
  },
  ecosystem: {
    en: {
      eyebrow: 'ONE CONNECTED CONSTELLATION',
      title: 'Three complementary roles. One clear boundary.',
      intro: 'The constellation separates research, infrastructure and operations so each site makes one distinct promise.',
      stages: [
        ['YACE19AI · Research', 'Research, models and world models: discover what becomes possible.'],
        ['PRIME-AI · Infrastructure', 'Connect models, memory and governed agents on infrastructure your organization controls.'],
        ['AMLAZR · Execution', 'Operational applications that turn intelligence into outcomes through agents and workflows.'],
      ],
      note: 'The brands have distinct roles. Specific cross-site integrations depend on the products and configuration in use.',
      next: 'Explore the infrastructure',
      nextPath: '/technologie',
    },
    fr: {
      eyebrow: 'UNE CONSTELLATION CONNECTÉE',
      title: 'Trois rôles complémentaires, une frontière claire.',
      intro: 'La constellation distingue recherche, infrastructure et opérations pour donner à chaque site une promesse précise.',
      stages: [
        ['YACE19AI · Recherche', 'Recherche, modèles et modèles du monde : explorer les possibles.'],
        ['PRIME-AI · Infrastructure', 'Relier modèles, mémoire et agents gouvernés sur une infrastructure contrôlée par votre organisation.'],
        ['AMLAZR · Exécution', 'Des applications opérationnelles qui transforment l’intelligence en résultats via agents et flux.'],
      ],
      note: 'Les marques ont des rôles distincts. Les intégrations dépendent des produits et de la configuration utilisés.',
      next: 'Explorer l’infrastructure',
      nextPath: '/technologie',
    },
  },
  sovereignty: {
    en: {
      eyebrow: 'DEPLOYMENT CONTROL',
      title: 'Sovereignty is defined by four deployment choices.',
      intro: 'For PRIME-AI, “sovereign” is a practical description of who controls an AI system and how it is deployed—not a claim that every component is always local.',
      stages: [
        ['Where data resides', 'Choose the environment and region for data, models, backups and operational logs.'],
        ['Who controls access', 'Your organization defines identities, permissions, retention and audit policy.'],
        ['Which providers are optional', 'External model and cloud services can be integrated when selected; they are not mandatory for every deployment.'],
        ['What runs locally', 'Models, memory and orchestration may run on infrastructure you operate, subject to hardware and configuration.'],
      ],
      note: 'Confirm data flows, provider terms and jurisdictional requirements for each deployment before processing sensitive information.',
      next: 'View the architecture',
      nextPath: '/technologie',
    },
    fr: {
      eyebrow: 'CONTRÔLE DU DÉPLOIEMENT',
      title: 'La souveraineté se définit par quatre choix de déploiement.',
      intro: 'Pour PRIME-AI, « souverain » décrit concrètement le contrôle et le déploiement d’un système d’IA — sans prétendre que chaque composant est toujours local.',
      stages: [
        ['Où résident les données', 'Choisissez l’environnement et la région des données, modèles, sauvegardes et journaux.'],
        ['Qui contrôle les accès', 'Votre organisation définit identités, permissions, conservation et politique d’audit.'],
        ['Quels fournisseurs sont optionnels', 'Les services externes de modèles et de cloud peuvent être intégrés sans être imposés à chaque déploiement.'],
        ['Ce qui fonctionne localement', 'Modèles, mémoire et orchestration peuvent fonctionner sur une infrastructure exploitée par vous, selon le matériel et la configuration.'],
      ],
      note: 'Vérifiez les flux de données, conditions fournisseurs et exigences juridictionnelles avant tout traitement sensible.',
      next: 'Voir l’architecture',
      nextPath: '/technologie',
    },
  },
  agents: {
    en: {
      eyebrow: 'GOVERNED AGENT SYSTEMS',
      title: 'Give each agent a defined role and a bounded authority.',
      intro: 'Multi-agent orchestration is infrastructure for coordinating specialized work. Its safe scope depends on explicit tools, access policy and operator review.',
      stages: [
        ['Separate responsibilities', 'Assign bounded tasks and clear hand-offs instead of granting every agent broad access.'],
        ['Limit available tools', 'Expose only the integrations and records required for each approved task.'],
        ['Keep people in control', 'Require operator review or confirmation for actions with material impact.'],
        ['Observe and audit', 'Make execution status, decisions and errors visible to the people responsible for the system.'],
      ],
      note: 'Autonomy, performance and audit coverage depend on the configured models, tools and operating environment.',
      next: 'Explore enterprise integrations',
      nextPath: '/enterprise-ai-orchestration',
    },
    fr: {
      eyebrow: 'SYSTÈMES D’AGENTS GOUVERNÉS',
      title: 'Attribuez à chaque agent un rôle et une autorité délimitée.',
      intro: 'L’orchestration multi-agents coordonne des tâches spécialisées. Son périmètre sûr dépend des outils, règles d’accès et validations explicites.',
      stages: [
        ['Séparer les responsabilités', 'Définissez des tâches limitées et des relais clairs plutôt qu’un accès étendu.'],
        ['Limiter les outils disponibles', 'Exposez uniquement les intégrations et données nécessaires à chaque tâche autorisée.'],
        ['Garder le contrôle humain', 'Exigez une validation opérateur pour les actions à impact important.'],
        ['Observer et auditer', 'Rendez l’exécution, les décisions et les erreurs visibles aux responsables du système.'],
      ],
      note: 'Autonomie, performances et couverture d’audit dépendent des modèles, outils et environnements configurés.',
      next: 'Explorer les intégrations d’entreprise',
      nextPath: '/enterprise-ai-orchestration',
    },
  },
  integrations: {
    en: {
      eyebrow: 'ENTERPRISE INTEGRATION',
      title: 'Connect workflows without handing over control.',
      intro: 'PRIME-AI provides the infrastructure boundary around model access, memory, agent permissions and approved connections to enterprise systems.',
      stages: [
        ['Select a system', 'Identify the data source or business application needed for a specific workflow.'],
        ['Set a permission boundary', 'Use organization-managed credentials and grant only the required read or action scope.'],
        ['Define approval rules', 'Decide which steps need human confirmation, escalation or a second reviewer.'],
        ['Review outcomes', 'Make results and failures available to the people responsible for operations.'],
      ],
      note: 'AMLAZR focuses on the operational applications and workflows built on intelligence infrastructure; integration availability depends on the deployed product.',
      next: 'Explore AMLAZR',
      nextPath: 'https://amlazr.com',
    },
    fr: {
      eyebrow: 'INTÉGRATION D’ENTREPRISE',
      title: 'Reliez les flux de travail sans céder le contrôle.',
      intro: 'PRIME-AI définit les limites d’accès aux modèles, à la mémoire, aux permissions des agents et aux connexions autorisées aux systèmes d’entreprise.',
      stages: [
        ['Choisir un système', 'Identifiez la source de données ou l’application nécessaire à un flux précis.'],
        ['Définir les permissions', 'Utilisez des identifiants gérés par l’organisation et accordez uniquement les droits nécessaires.'],
        ['Définir les validations', 'Précisez les étapes exigeant confirmation, escalade ou double validation humaine.'],
        ['Examiner les résultats', 'Rendez résultats et erreurs accessibles aux responsables opérationnels.'],
      ],
      note: 'AMLAZR se concentre sur les applications opérationnelles et les flux construits sur l’infrastructure d’intelligence ; les intégrations dépendent du produit déployé.',
      next: 'Découvrir AMLAZR',
      nextPath: 'https://amlazr.com',
    },
  },
};

export default function InfrastructureDetail({ page }) {
  const { language } = useLanguage();
  const content = pages[page]?.[language === 'fr' ? 'fr' : 'en'];
  if (!content) throw new Error(`Unknown infrastructure page: ${page}`);
  const NextLink = content.nextPath.startsWith('https://') ? 'a' : Link;
  const nextLinkProps = NextLink === 'a'
    ? { href: content.nextPath, rel: 'noopener noreferrer' }
    : { to: content.nextPath };

  return (
    <main className="infrastructure-detail">
      <header className="detail-hero">
        <p className="detail-eyebrow"><span aria-hidden="true" />{content.eyebrow}</p>
        <h1>{content.title}</h1>
        <p className="detail-intro">{content.intro}</p>
      </header>
      <section aria-labelledby="detail-path-title" className="detail-path">
        <h2 id="detail-path-title">{content.stages.length === 4 ? 'Models → memory → governed agents → execution' : 'Research → infrastructure → execution'}</h2>
        <ol>
          {content.stages.map(([title, description], index) => (
            <li key={title}>
              <span className="detail-number">{String(index + 1).padStart(2, '0')}</span>
              <div><h3>{title}</h3><p>{description}</p></div>
            </li>
          ))}
        </ol>
      </section>
      <aside className="detail-boundary" aria-label="Deployment boundary">
        <span aria-hidden="true">i</span>
        <p>{content.note}</p>
      </aside>
      <div className="detail-next">
        <NextLink {...nextLinkProps}>{content.next}<span aria-hidden="true"> ↗</span></NextLink>
      </div>
    </main>
  );
}
