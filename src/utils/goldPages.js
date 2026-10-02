const page = (en, fr, media = ['macro'], kind = 'concept') => ({ en, fr, media, kind });
export const goldPages = {
  '/': page(['Your intelligence. Your rules.', 'Local-first.'], ['Votre intelligence. Vos règles.', 'Priorité au local.'], ['macro', 'desktop', 'mobile', 'cli', 'cloud', 'gram', 'teleprompter'], 'workspace'),
  '/vision': page(['Your intelligence. Your rules.', 'Local-first.'], ['Votre intelligence. Vos règles.', 'Priorité au local.'], ['macro', 'desktop', 'mobile', 'cli', 'cloud', 'gram', 'teleprompter'], 'workspace'),
  '/ecosysteme': page(['Your workspace. Everywhere.', '$0. Manual transfer.'], ['Votre espace. Partout.', 'Gratuit. Transfert manuel.'], ['ecosysteme', 'desktop', 'mobile', 'cli', 'cloud', 'gram', 'teleprompter'], 'workspace'),
  '/technologie': page(['Local architecture. Clear limits.', 'Optional hardware.'], ['Architecture locale. Limites claires.', 'Matériel facultatif.'], ['tech', 'arch_specs', 'sync_protocol']),
  '/sovereign-ai': page(['Keep your data local.', 'Human control.'], ['Gardez vos données locales.', 'Contrôle humain.'], ['sovereign']),
  '/multi-agent-systems': page(['Three roles. Advisory only.', 'No autonomous tools.'], ['Trois rôles. Conseils uniquement.', 'Aucun outil autonome.'], ['multiagent']),
  '/enterprise-ai-orchestration': page(['Plan. Review. Verify.', 'Illustrative architecture.'], ['Planifier. Revoir. Vérifier.', 'Architecture illustrative.'], ['enterprise']),
  '/fleet-command': page(['Local advisory. Real records.', 'No tools or deployment.'], ['Conseils locaux. Enregistrements réels.', 'Aucun outil ni déploiement.'], ['fleet'], 'fleet'),
  '/memory': page(['Local memory. Portable snapshots.', 'Private records stay local.'], ['Mémoire locale. Instantanés portables.', 'Enregistrements privés locaux.'], ['fleet'], 'memory'),
  '/yace-aura': page(['YACE • AURA', 'Trading concept only.'], ['YACE • AURA', 'Concept de trading uniquement.'], ['yace']),
  '/orb': page(['ORB', 'Illustrative.'], ['ORB', 'Illustratif.']),
  '/orchestration': page(['Plan first. Verify results.', 'Advisory concepts.'], ['Planifier. Vérifier les résultats.', 'Concepts consultatifs.'], ['fleet']),
  '/media': page(['Visual stories. No narration.', 'Illustrative media.'], ['Histoires visuelles. Sans narration.', 'Médias illustratifs.'], ['macro', 'yace']),
  '/whatsapp': page(['Messaging concept. Not connected.', 'No account connected.'], ['Messagerie illustrative. Non connectée.', 'Aucun compte connecté.'], ['gram']),
  '/factory': page(['Build ideas. Review plans.', 'Concept only.'], ['Des idées. Des plans.', 'Concept uniquement.'], ['desktop']),
  '/amlazr': page(['AMLAZR. Original fiction.', 'No medical service.'], ['AMLAZR. Fiction originale.', 'Aucun service médical.'], ['macro'], 'fiction'),
  '/azirem': page(['Code concepts. Human control.', 'No autonomous execution.'], ['Concepts de code. Contrôle humain.', 'Aucune exécution autonome.'], ['cli']),
  '/credentials': page(['Access concepts. No accounts.', 'Illustrative vault.'], ['Accès illustratifs. Sans compte.', 'Coffre illustratif.'], ['credentials']),
  '/revenue': page(['Revenue planning. No live totals.', 'No payments connected.'], ['Planification. Aucun revenu en direct.', 'Aucun paiement connecté.'], ['enterprise']),
  '/yace19': page(['YACE19. Experimental concept.', 'Illustrative.'], ['YACE19. Concept expérimental.', 'Illustratif.'], ['yace']),
  '/surveyor': page(['Survey concepts. No active scans.', 'No external research.'], ['Concepts de veille. Aucune analyse active.', 'Aucune recherche externe.'], ['tech']),
};
const countries = {
  uk: ['United Kingdom', 'Royaume-Uni'], de: ['Germany', 'Allemagne'], ch: ['Switzerland', 'Suisse'],
  ae: ['Dubai', 'Dubaï'], jp: ['Japan', 'Japon'], cn: ['China', 'Chine'],
  sg: ['Singapore', 'Singapour'], za: ['South Africa', 'Afrique du Sud'],
  br: ['Brazil', 'Brésil'], ca: ['Canada', 'Canada'],
};
for (const [code, names] of Object.entries(countries)) {
  goldPages[`/${code}`] = page([names[0], 'Regional concept only.'], [names[1], 'Concept régional uniquement.'], ['tech']);
}
