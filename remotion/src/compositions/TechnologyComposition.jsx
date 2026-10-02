import React from 'react';
import { Sequence, interpolate, useCurrentFrame, useVideoConfig } from 'remotion';

const copy = {
  en: {
    title: 'PRIME-AI Sovereign Fleet', subtitle: 'TECHNICAL WORKSPACE CARTOGRAPHY',
    disclosure: 'Illustrative architecture — not live telemetry',
    topology: 'Sovereign Topology — Local-First Hardware',
    topologyNote: 'The free browser workspace needs no fleet. Optional desktop inference uses the M4.',
    optional: 'OPTIONAL NODE', host: 'LOCAL HOST',
    m4: 'Optional local Ollama inference; planner, analyst and reviewer.',
    imac: 'Optional additional machine. Not required or assumed reachable.',
    pi: 'Optional edge device. Not required or assumed reachable.',
    queue: 'Advisory Queue — Sequential Local Roles', queueNote: 'User-created goals; bounded inference; no automatic execution.',
    plan: 'Planner — propose an advisory plan', analyze: 'Analyst — examine human-supplied context', review: 'Reviewer — describe limitations and risks',
    memory: 'Local Memory — Filesystem Mission Records', memoryNote: 'Actual records live in the optional local backend, not this static video.',
    memoryCards: ['Mission status and role outputs', 'Terminal errors and memory references', 'Hashed portable mission snapshots', 'No fabricated tool or deployment results'],
    transfer: 'Portable JSON — Manual Device Transfer', transferNote: 'No cloud, account or paid API. Export and import the file yourself.',
    transferCards: ['Browser IndexedDB: goals, tasks and notes', '.primeai.json: versioned data and SHA-256', 'Import preview: timestamps and conflict review', 'Checksums are not encryption or authenticity'],
    offline: 'Free Workspace — Desktop and Mobile', offlineNote: 'Install the app shell after an online load. Videos and APIs are not cached.',
    offlineCards: ['Create and edit goals and tasks', 'Save notes; reload preserves local data', 'Export, transfer and confirm the merge', 'Optional advisory results — no autonomous tools'],
    closing: 'Local by default. Optional by design.', closingNote: 'Start with the free browser workspace.',
  },
  fr: {
    title: 'PRIME-AI Flotte Souveraine', subtitle: "CARTOGRAPHIE DE L'ESPACE TECHNIQUE",
    disclosure: 'Architecture illustrative — aucune télémétrie en direct',
    topology: 'Topologie Souveraine — Matériel Local',
    topologyNote: "L'espace gratuit ne nécessite aucune flotte. L'inférence de bureau facultative utilise le M4.",
    optional: 'NŒUD FACULTATIF', host: 'HÔTE LOCAL',
    m4: 'Inférence Ollama locale facultative ; planification, analyse et revue.',
    imac: 'Machine supplémentaire facultative. Ni requise ni supposée accessible.',
    pi: 'Appareil périphérique facultatif. Ni requis ni supposé accessible.',
    queue: 'File Consultative — Rôles Locaux Séquentiels', queueNote: "Objectifs de l'utilisateur ; inférence limitée ; aucune exécution automatique.",
    plan: 'Planification — proposer un plan consultatif', analyze: "Analyse — examiner le contexte fourni", review: 'Revue — décrire les limites et les risques',
    memory: 'Mémoire Locale — Fichiers de Missions', memoryNote: "Les enregistrements réels sont dans le backend facultatif, pas dans cette vidéo.",
    memoryCards: ['Statut des missions et résultats des rôles', 'Erreurs terminales et références mémoire', 'Instantanés portables avec empreinte', "Aucun résultat d'outil ou de déploiement inventé"],
    transfer: 'JSON Portable — Transfert Manuel', transferNote: 'Sans cloud, compte ni API payante. Transférez vous-même le fichier.',
    transferCards: ['IndexedDB : objectifs, tâches et notes', '.primeai.json : données versionnées et SHA-256', "Aperçu d'import : dates et revue des conflits", "Empreinte : ni chiffrement ni authenticité"],
    offline: 'Espace Gratuit — Bureau et Mobile', offlineNote: "Installez l'application après un chargement connecté. Vidéos et API non mises en cache.",
    offlineCards: ['Créer et modifier objectifs et tâches', 'Sauver les notes ; recharger les données', 'Exporter, transférer et confirmer la fusion', 'Conseils facultatifs — aucun outil autonome'],
    closing: 'Local par défaut. Facultatif par choix.', closingNote: "Commencez avec l'espace gratuit dans le navigateur.",
  },
};

function Panel({ title, note, children, color = '#3b82f6' }) {
  const frame = useCurrentFrame();
  const opacity = interpolate(frame, [0, 12], [0.85, 1], { extrapolateRight: 'clamp' });
  return <div style={{ position: 'absolute', inset: '65px 60px 90px', opacity }}>
    <h1 style={{ fontSize: 36, color, margin: '0 0 14px' }}>{title}</h1>
    <p style={{ color: '#94a3b8', fontSize: 18, margin: '0 0 35px', lineHeight: 1.6 }}>{note}</p>
    {children}
  </div>;
}

function Card({ title, detail, color = '#3b82f6', badge }) {
  return <div style={{ background: '#1e293b', borderLeft: `5px solid ${color}`, borderRadius: 6, padding: '22px 24px', marginBottom: 18 }}>
    <div style={{ display: 'flex', alignItems: 'center', gap: 18 }}>
      <strong style={{ fontSize: 25 }}>{title}</strong>
      {badge && <span style={{ color, fontSize: 15, fontWeight: 700 }}>{badge}</span>}
    </div>
    {detail && <p style={{ color: '#94a3b8', fontSize: 17, margin: '12px 0 0', lineHeight: 1.5 }}>{detail}</p>}
  </div>;
}

export default function TechnologyComposition({ language = 'en' }) {
  const c = copy[language];
  const { fps, width, height } = useVideoConfig();
  const cards = lines => <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 20 }}>
    {lines.map((title, index) => <Card key={title} title={title} color={index % 2 ? '#f59e0b' : '#06b6d4'} />)}
  </div>;
  return <div style={{
    width, height, position: 'relative', overflow: 'hidden', color: '#f8fafc', fontFamily: 'Arial, sans-serif', backgroundColor: '#0f172a',
    backgroundImage: 'linear-gradient(#18223555 1px, transparent 1px), linear-gradient(90deg, #18223555 1px, transparent 1px)', backgroundSize: '48px 48px',
  }}>
    <Sequence durationInFrames={fps * 7}>
      <div style={{ position: 'absolute', inset: 0, display: 'flex', flexDirection: 'column', justifyContent: 'center', alignItems: 'center' }}>
        <div style={{ color: '#f59e0b', fontSize: 65, marginBottom: 24 }}>⚡</div>
        <h1 style={{ fontSize: 58, color: '#3b82f6', margin: 0 }}>{c.title}</h1>
        <p style={{ color: '#94a3b8', fontSize: 22, letterSpacing: 3 }}>{c.subtitle}</p>
      </div>
    </Sequence>
    <Sequence from={fps * 7} durationInFrames={fps * 9}>
      <Panel title={c.topology} note={c.topologyNote}>
        <Card title="Apple M4 Pro" detail={c.m4} badge={c.host} />
        <Card title="iMac Core i9" detail={c.imac} badge={c.optional} color="#f59e0b" />
        <Card title="Raspberry Pi 5" detail={c.pi} badge={c.optional} color="#10b981" />
      </Panel>
    </Sequence>
    <Sequence from={fps * 16} durationInFrames={fps * 8}>
      <Panel title={c.queue} note={c.queueNote} color="#06b6d4">
        {[c.plan, c.analyze, c.review].map(title => <Card key={title} title={title} color="#06b6d4" />)}
      </Panel>
    </Sequence>
    <Sequence from={fps * 24} durationInFrames={fps * 8}>
      <Panel title={c.memory} note={c.memoryNote} color="#f59e0b">{cards(c.memoryCards)}</Panel>
    </Sequence>
    <Sequence from={fps * 32} durationInFrames={fps * 8}>
      <Panel title={c.transfer} note={c.transferNote} color="#06b6d4">{cards(c.transferCards)}</Panel>
    </Sequence>
    <Sequence from={fps * 40} durationInFrames={fps * 7}>
      <Panel title={c.offline} note={c.offlineNote}>
        {cards(c.offlineCards)}
        <h2 style={{ color: '#f59e0b', fontSize: 30 }}>{c.closing}</h2>
        <p style={{ color: '#94a3b8', fontSize: 18 }}>{c.closingNote}</p>
      </Panel>
    </Sequence>
    <div style={{ position: 'absolute', bottom: 32, left: 60, right: 60, fontSize: 18, color: '#e6c587' }}>{c.disclosure}</div>
  </div>;
}
