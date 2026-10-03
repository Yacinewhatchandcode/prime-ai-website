export const reviewedAt = '2026-10-03T15:48:00Z';

export const convergenceMilestones = [
  { id: 'responsive', title: 'Design responsive local', complete: true, evidence: '375 / 390 / 1440 px : navigation et absence de débordement vérifiées.', href: '/responsive-preview' },
  { id: 'ribbon', title: 'Bandeau 3D et trois couleurs', complete: true, evidence: 'Dépliage intégré à la page, double-tap et clavier vérifiés.', href: '/replica#brand-constellation' },
  { id: 'retrieval', title: 'Récupération locale de sources', complete: true, evidence: '24 fiches sourcées ; citations distinctes des réponses générées.', href: '/semantic-library' },
  { id: 'merge', title: 'Fusion des versions séparées', complete: false, evidence: 'Branches séparées ; aucun artefact commun final validé.' },
  { id: 'publish', title: 'Publication des trois sites', complete: false, evidence: 'Aucun déploiement de cette version. Reconstruction suspendue sous 3 Gio libres.' },
  { id: 'julia', title: 'Julia : conversation et retrieval par domaine', complete: false, evidence: 'Démo scriptée seulement ; API de production et adaptateur retrieval absents.' },
  { id: 'gmail', title: 'Iva / Gmail autonome', complete: false, evidence: 'Compte Iva non identifié ; autorisation Gmail et destinataire manquants.' },
  { id: 'bytebot', title: 'ByteBot local autorisé', complete: false, evidence: 'Aucun adaptateur de bureau local autorisé disponible.' },
  { id: 'security', title: 'Sécurité de production', complete: false, evidence: 'Revue limitée du code effectuée ; configuration de production non validée. Aucune garantie absolue.' },
  { id: 'iphone', title: 'Validation iPhone réel / Safari', complete: false, evidence: 'Tailles mobiles Chromium vérifiées ; pas de validation sur iPhone réel.' },
];

export function summarizeMilestones(milestones) {
  const completed = milestones.filter(item => item.complete).length;
  const total = milestones.length;
  return { completed, remaining: total - completed, total, percent: total ? Math.round(completed / total * 100) : 0 };
}
