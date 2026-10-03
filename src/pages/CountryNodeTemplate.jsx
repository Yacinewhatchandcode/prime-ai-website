import { Link } from 'react-router-dom';
import { useLanguage } from '../context/LanguageContext';
import './country-node.css';

const frenchNames = {
  'United Kingdom': 'Royaume-Uni',
  Germany: 'Allemagne',
  Switzerland: 'Suisse',
  'United Arab Emirates': 'Émirats arabes unis',
  Japan: 'Japon',
  China: 'Chine',
  Singapore: 'Singapour',
  'South Africa': 'Afrique du Sud',
  Brazil: 'Brésil',
  Canada: 'Canada',
};

export default function CountryNodeTemplate({ countryName, flag }) {
  const { language } = useLanguage();
  const isFrench = language === 'fr';
  const localizedCountry = isFrench ? frenchNames[countryName] : countryName;

  return (
    <main className="country-planning">
      <header className="country-header">
        <Link to="/" aria-label={isFrench ? 'Retour à PRIME-AI' : 'Back to PRIME-AI'}>← PRIME-AI</Link>
        <span>DEPLOYMENT PLANNING</span>
      </header>
      <section className="country-intro" aria-labelledby="country-title">
        <span className="country-flag" aria-hidden="true">{flag}</span>
        <p className="country-eyebrow">{isFrench ? 'DÉPLOIEMENT À CONFIRMER' : 'DEPLOYMENT TO BE VERIFIED'}</p>
        <h1 id="country-title">
          {isFrench ? 'Planifier un déploiement en' : 'Plan a deployment in'} {localizedCountry}
        </h1>
        <p>
          {isFrench
            ? 'Cette page est un point de départ de planification. Elle ne confirme pas l’existence d’un nœud actif, d’un hébergement local ni d’une conformité réglementaire dans cette juridiction.'
            : 'This page is a planning starting point. It does not confirm an active regional node, in-country hosting or regulatory compliance in this jurisdiction.'}
        </p>
      </section>
      <section className="country-checklist" aria-labelledby="country-checklist-title">
        <h2 id="country-checklist-title">{isFrench ? 'Informations à valider avant publication' : 'Details to verify before publication'}</h2>
        <dl>
          <div><dt>{isFrench ? 'Lieu d’hébergement' : 'Hosting location'}</dt><dd>TODO — {isFrench ? 'Confirmer les régions, sauvegardes et flux de données.' : 'Confirm regions, backups and data flows.'}</dd></div>
          <div><dt>{isFrench ? 'Opérateur et accès' : 'Operator and access'}</dt><dd>TODO — {isFrench ? 'Documenter l’opérateur, les identités, les permissions et les audits.' : 'Document the service operator, identities, permissions and audit controls.'}</dd></div>
          <div><dt>{isFrench ? 'Exigences locales' : 'Local requirements'}</dt><dd>TODO — {isFrench ? 'Faire vérifier les obligations applicables par un conseil qualifié.' : 'Have applicable requirements reviewed by qualified counsel.'}</dd></div>
        </dl>
        <a href="https://calendly.com/info-primeai/30min" target="_blank" rel="noopener noreferrer">
          {isFrench ? 'Discuter d’un déploiement privé' : 'Discuss a private deployment'} <span aria-hidden="true">↗</span>
        </a>
      </section>
    </main>
  );
}
