import { useEffect } from 'react';
import { useLocation } from 'react-router-dom';
import { useLanguage } from '../context/LanguageContext';

const routeTitles = {
  '/': ['PRIME-AI — Sovereign Cognitive Infrastructure', 'PRIME-AI — Infrastructure cognitive souveraine'],
  '/vision': ['PRIME-AI — Sovereign Cognitive Infrastructure', 'PRIME-AI — Infrastructure cognitive souveraine'],
  '/technologie': ['Architecture | PRIME-AI', 'Architecture | PRIME-AI'],
  '/ecosysteme': ['Ecosystem | PRIME-AI', 'Écosystème | PRIME-AI'],
  '/sovereign-ai': ['Sovereignty | PRIME-AI', 'Souveraineté | PRIME-AI'],
  '/multi-agent-systems': ['Governed Agents | PRIME-AI', 'Agents gouvernés | PRIME-AI'],
  '/enterprise-ai-orchestration': ['Infrastructure Integrations | PRIME-AI', 'Intégrations d’infrastructure | PRIME-AI'],
  '/yace-aura': ['Yace Aura Console | PRIME-AI', 'Console Yace Aura | PRIME-AI'],
  '/orb': ['ORB Console | PRIME-AI', 'Console ORB | PRIME-AI'],
  '/orchestration': ['Orchestration Console | PRIME-AI', 'Console d’orchestration | PRIME-AI'],
  '/media': ['Media Console | PRIME-AI', 'Console média | PRIME-AI'],
  '/whatsapp': ['WhatsApp Agent Preview | PRIME-AI', 'Aperçu agent WhatsApp | PRIME-AI'],
  '/memory': ['Memory Console | PRIME-AI', 'Console mémoire | PRIME-AI'],
  '/factory': ['Agent Factory Preview | PRIME-AI', 'Aperçu usine à agents | PRIME-AI'],
  '/amlazr': ['AMLAZR Execution Preview | PRIME-AI', 'Aperçu exécution AMLAZR | PRIME-AI'],
  '/azirem': ['Azirem Preview | PRIME-AI', 'Aperçu Azirem | PRIME-AI'],
  '/credentials': ['Credentials Console | PRIME-AI', 'Console identifiants | PRIME-AI'],
  '/revenue': ['Revenue Console | PRIME-AI', 'Console revenus | PRIME-AI'],
  '/yace19': ['YACE19AI Research Preview | PRIME-AI', 'Aperçu recherche YACE19AI | PRIME-AI'],
  '/fleet-command': ['Fleet Command | PRIME-AI', 'Commandement de flotte | PRIME-AI'],
  '/surveyor': ['Cyber Surveyor Preview | PRIME-AI', 'Aperçu Cyber Surveyor | PRIME-AI'],
  '/uk': ['United Kingdom Deployment Planning | PRIME-AI', 'Planification de déploiement au Royaume-Uni | PRIME-AI'],
  '/de': ['Germany Deployment Planning | PRIME-AI', 'Planification de déploiement en Allemagne | PRIME-AI'],
  '/ch': ['Switzerland Deployment Planning | PRIME-AI', 'Planification de déploiement en Suisse | PRIME-AI'],
  '/ae': ['UAE Deployment Planning | PRIME-AI', 'Planification de déploiement aux Émirats arabes unis | PRIME-AI'],
  '/jp': ['Japan Deployment Planning | PRIME-AI', 'Planification de déploiement au Japon | PRIME-AI'],
  '/cn': ['China Deployment Planning | PRIME-AI', 'Planification de déploiement en Chine | PRIME-AI'],
  '/sg': ['Singapore Deployment Planning | PRIME-AI', 'Planification de déploiement à Singapour | PRIME-AI'],
  '/za': ['South Africa Deployment Planning | PRIME-AI', 'Planification de déploiement en Afrique du Sud | PRIME-AI'],
  '/br': ['Brazil Deployment Planning | PRIME-AI', 'Planification de déploiement au Brésil | PRIME-AI'],
  '/ca': ['Canada Deployment Planning | PRIME-AI', 'Planification de déploiement au Canada | PRIME-AI'],
};

const routeDescriptions = {
  '/': ['PRIME-AI connects models, memory and governed agents on infrastructure your organization controls.', 'PRIME-AI relie modèles, mémoire et agents gouvernés sur une infrastructure contrôlée par votre organisation.'],
  '/vision': ['PRIME-AI connects models, memory and governed agents on infrastructure your organization controls.', 'PRIME-AI relie modèles, mémoire et agents gouvernés sur une infrastructure contrôlée par votre organisation.'],
  '/technologie': ['Explore the PRIME-AI infrastructure architecture, from model access and memory to governed agents and execution.', 'Découvrez l’architecture PRIME-AI, de l’accès aux modèles et à la mémoire jusqu’aux agents gouvernés et à l’exécution.'],
  '/ecosysteme': ['See how PRIME-AI infrastructure connects research, deployment environments and operational applications.', 'Découvrez comment l’infrastructure PRIME-AI relie recherche, environnements de déploiement et applications opérationnelles.'],
  '/sovereign-ai': ['Learn how deployment choices define data residency, access control, provider use and local execution.', 'Découvrez comment les choix de déploiement définissent résidence des données, accès, fournisseurs et exécution locale.'],
  '/multi-agent-systems': ['Understand the infrastructure for scoped, observable and governed multi-agent systems.', 'Découvrez l’infrastructure de systèmes multi-agents encadrés, observables et gouvernés.'],
  '/enterprise-ai-orchestration': ['Connect enterprise systems to governed AI workflows with deployment and access boundaries you control.', 'Reliez les systèmes d’entreprise à des flux IA gouvernés selon vos contrôles de déploiement et d’accès.'],
};

const extraDescriptions = {
  '/yace-aura': ['Yace Aura operator-console preview. Displayed operational status depends on the configured environment.', 'Aperçu de la console opérateur Yace Aura. Le statut dépend de l’environnement configuré.'],
  '/orb': ['ORB subsystem interface preview within the PRIME-AI environment.', 'Aperçu de l’interface du sous-système ORB dans l’environnement PRIME-AI.'],
  '/orchestration': ['Operator preview for multi-agent orchestration. Live status depends on the configured environment.', 'Aperçu opérateur de l’orchestration multi-agents. Le statut dépend de l’environnement configuré.'],
  '/media': ['Media command-center preview within the PRIME-AI environment.', 'Aperçu du centre de commande média dans l’environnement PRIME-AI.'],
  '/whatsapp': ['WhatsApp agent integration preview. Availability depends on account permissions and configuration.', 'Aperçu de l’intégration d’un agent WhatsApp. Disponibilité selon permissions et configuration.'],
  '/memory': ['Memory-system interface preview. Storage and retention depend on deployment configuration.', 'Aperçu de l’interface mémoire. Stockage et conservation dépendent du déploiement.'],
  '/factory': ['Agent factory interface preview. Capabilities depend on the configured environment.', 'Aperçu de l’interface de création d’agents. Capacités selon l’environnement configuré.'],
  '/amlazr': ['AMLAZR is the operational application focused on AI execution and workflows.', 'AMLAZR est l’application opérationnelle dédiée à l’exécution et aux flux de travail IA.'],
  '/azirem': ['Azirem coding-assistant interface preview.', 'Aperçu de l’interface de l’assistant de programmation Azirem.'],
  '/credentials': ['This legacy route redirects to the PRIME-AI homepage.', 'Cette ancienne adresse redirige vers la page d’accueil PRIME-AI.'],
  '/revenue': ['This legacy route redirects to the PRIME-AI homepage.', 'Cette ancienne adresse redirige vers la page d’accueil PRIME-AI.'],
  '/yace19': ['Opening the YACE19AI research site.', 'Ouverture du site de recherche YACE19AI.'],
  '/fleet-command': ['This legacy route redirects to the PRIME-AI orchestration console.', 'Cette ancienne adresse redirige vers la console d’orchestration PRIME-AI.'],
  '/surveyor': ['Cyber Surveyor quality-assurance preview. Results depend on the configured environment.', 'Aperçu qualité Cyber Surveyor. Les résultats dépendent de l’environnement configuré.'],
  '/uk': ['United Kingdom deployment-planning template; no active regional node or local data residency is confirmed.', 'Modèle de planification au Royaume-Uni ; aucun nœud régional actif ni hébergement local n’est confirmé.'],
  '/de': ['Germany deployment-planning template; no active regional node or local data residency is confirmed.', 'Modèle de planification en Allemagne ; aucun nœud régional actif ni hébergement local n’est confirmé.'],
  '/ch': ['Switzerland deployment-planning template; no active regional node or local data residency is confirmed.', 'Modèle de planification en Suisse ; aucun nœud régional actif ni hébergement local n’est confirmé.'],
  '/ae': ['UAE deployment-planning template; no active regional node or local data residency is confirmed.', 'Modèle de planification aux Émirats arabes unis ; aucun nœud régional actif ni hébergement local n’est confirmé.'],
  '/jp': ['Japan deployment-planning template; no active regional node or local data residency is confirmed.', 'Modèle de planification au Japon ; aucun nœud régional actif ni hébergement local n’est confirmé.'],
  '/cn': ['China deployment-planning template; no active regional node or local data residency is confirmed.', 'Modèle de planification en Chine ; aucun nœud régional actif ni hébergement local n’est confirmé.'],
  '/sg': ['Singapore deployment-planning template; no active regional node or local data residency is confirmed.', 'Modèle de planification à Singapour ; aucun nœud régional actif ni hébergement local n’est confirmé.'],
  '/za': ['South Africa deployment-planning template; no active regional node or local data residency is confirmed.', 'Modèle de planification en Afrique du Sud ; aucun nœud régional actif ni hébergement local n’est confirmé.'],
  '/br': ['Brazil deployment-planning template; no active regional node or local data residency is confirmed.', 'Modèle de planification au Brésil ; aucun nœud régional actif ni hébergement local n’est confirmé.'],
  '/ca': ['Canada deployment-planning template; no active regional node or local data residency is confirmed.', 'Modèle de planification au Canada ; aucun nœud régional actif ni hébergement local n’est confirmé.'],
};

function ensureMeta(attribute, value, property = 'name') {
  let element = document.head.querySelector(`meta[${property}="${attribute}"]`);
  if (!element) {
    element = document.createElement('meta');
    element.setAttribute(property, attribute);
    document.head.append(element);
  }
  element.content = value;
}

function ensureLink(rel, href, hreflang) {
  const selector = hreflang ? `link[rel="${rel}"][hreflang="${hreflang}"]` : `link[rel="${rel}"]`;
  let element = document.head.querySelector(selector);
  if (!element) {
    element = document.createElement('link');
    element.rel = rel;
    if (hreflang) element.hreflang = hreflang;
    document.head.append(element);
  }
  element.href = href;
}

export default function RouteMetadata() {
  const { pathname } = useLocation();
  const { language } = useLanguage();
  const lang = language === 'fr' ? 'fr' : 'en';
  useEffect(() => {
    const currentUrl = new URL(window.location.href);
    if (currentUrl.searchParams.get('lang') !== lang) {
      currentUrl.searchParams.set('lang', lang);
      window.history.replaceState(window.history.state, '', currentUrl);
    }
    const titles = routeTitles[pathname] || ['Page not found | PRIME-AI', 'Page introuvable | PRIME-AI'];
    const descriptions = routeDescriptions[pathname] || extraDescriptions[pathname] || [
      'PRIME-AI sovereign cognitive infrastructure.',
      'Infrastructure cognitive souveraine PRIME-AI.',
    ];
    const title = titles[lang === 'fr' ? 1 : 0];
    const description = descriptions[lang === 'fr' ? 1 : 0];
    const canonical = new URL(pathname, 'https://prime-ai.fr').href;
    document.title = title;
    document.documentElement.lang = lang;
    ensureMeta('description', description);
    ensureMeta('og:type', 'website', 'property');
    ensureMeta('og:title', title, 'property');
    ensureMeta('og:description', description, 'property');
    ensureMeta('og:url', canonical, 'property');
    ensureMeta('og:image', 'https://prime-ai.fr/julia/julia-agent-mode.webp', 'property');
    ensureMeta('og:image:alt', 'Julia Agent Mode on PRIME-AI', 'property');
    ensureMeta('twitter:card', 'summary_large_image');
    ensureMeta('twitter:title', title);
    ensureMeta('twitter:description', description);
    ensureMeta('twitter:image', 'https://prime-ai.fr/julia/julia-agent-mode.webp');
    ensureLink('canonical', canonical);
    for (const locale of ['fr', 'en']) {
      const localized = new URL(pathname, 'https://prime-ai.fr');
      localized.searchParams.set('lang', locale);
      ensureLink('alternate', localized.href, locale);
    }
    const defaultLocale = new URL(pathname, 'https://prime-ai.fr');
    ensureLink('alternate', defaultLocale.href, 'x-default');

    const breadcrumbItems = [{ name: 'PRIME-AI', item: 'https://prime-ai.fr/' }];
    if (pathname !== '/') breadcrumbItems.push({ name: title.split('|')[0].trim(), item: canonical });
    const graph = {
      '@context': 'https://schema.org',
      '@graph': [
        {
          '@type': 'Organization',
          '@id': 'https://prime-ai.fr/#organization',
          name: 'PRIME-AI',
          url: 'https://prime-ai.fr/',
          logo: 'https://prime-ai.fr/prime_ai_logo.png',
          sameAs: ['https://www.linkedin.com/in/yacine-benhamou-b26386124/'],
        },
        {
          '@type': 'WebSite',
          '@id': 'https://prime-ai.fr/#website',
          url: 'https://prime-ai.fr/',
          name: 'PRIME-AI',
          publisher: { '@id': 'https://prime-ai.fr/#organization' },
          inLanguage: ['en', 'fr'],
        },
        {
          '@type': 'BreadcrumbList',
          '@id': `${canonical}#breadcrumb`,
          itemListElement: breadcrumbItems.map((item, index) => ({
            '@type': 'ListItem',
            position: index + 1,
            name: item.name,
            item: item.item,
          })),
        },
        {
          '@type': 'WebPage',
          '@id': `${canonical}#webpage`,
          name: title,
          description,
          url: canonical,
          inLanguage: lang,
          isPartOf: { '@id': 'https://prime-ai.fr/#website' },
          breadcrumb: { '@id': `${canonical}#breadcrumb` },
        },
      ],
    };
    let structuredData = document.getElementById('prime-ai-structured-data');
    if (!structuredData) {
      structuredData = document.createElement('script');
      structuredData.id = 'prime-ai-structured-data';
      structuredData.type = 'application/ld+json';
      document.head.append(structuredData);
    }
    structuredData.textContent = JSON.stringify(graph);
  }, [pathname, lang]);

  return null;
}
