const normalize = value => value.normalize('NFD').replace(/\p{Diacritic}/gu, '').toLowerCase().replace(/[^a-z0-9]+/g, ' ').trim();

export const keywordGroups = [
  { id: 'sovereign-ai', label: 'Sovereign AI', aliases: ['sovereign intelligence', 'souverain', 'souveraine', 'human control', 'data ownership', 'your rules', 'own your intelligence'] },
  { id: 'multi-agent', label: 'Multi-agent systems', aliases: ['multi agent', 'agents', 'fleet', 'flotte', 'constellation', 'research', 'creation', 'analysis', 'automation'] },
  { id: 'cognition', label: 'Cognitive infrastructure', aliases: ['cognitive', 'cognition', 'augmented human', 'brain', 'cerveau', 'thinking', 'intelligence designed to think'] },
  { id: 'orchestration', label: 'AI orchestration', aliases: ['orchestrate', 'orchestration', 'collaboration', 'collaborative', 'workflow', 'pipeline', 'coordination'] },
  { id: 'memory', label: 'Semantic memory', aliases: ['memory', 'memoire', 'semantic backup', 'knowledge', 'context', 'sauvegarde', 'persistent cognition'] },
  { id: 'trust', label: 'Trust and privacy', aliases: ['trust', 'confiance', 'privacy', 'confidentialite', 'secure', 'security', 'encrypted', 'data protection'] },
  { id: 'edge-ai', label: 'Edge AI systems', aliases: ['edge', 'local first', 'local', 'm4', 'mac', 'macos', 'windows', 'desktop', 'mobile', 'ios', 'android'] },
  { id: 'models', label: 'Local AI models', aliases: ['models', 'model', 'llm', 'inference', 'dspy', 'prompt', 'teleprompter', 'alignment', 'optimization'] },
  { id: 'enterprise', label: 'Autonomous enterprise systems', aliases: ['autonomous', 'enterprise', 'entreprise', 'impact', 'scale', 'execution', 'decision', 'business'] },
  { id: 'cloud', label: 'Private AI infrastructure', aliases: ['private cloud', 'private server', 'cloud prive', 'infrastructure', 'decentralized', 'server', 'servers', 'hosting'] },
  { id: 'ecosystem', label: 'Platform ecosystem', aliases: ['ecosystem', 'ecosysteme', 'platform', 'plateforme', 'telegram', 'gram', 'gateway', 'every platform', 'everywhere'] },
  { id: 'briefing', label: 'System briefing', aliases: ['briefing', 'newsletter', 'subscribe', 'updates', 'architecture briefs', 'abonner', 'signup'] },
];

export function classifyText(text) {
  const normalized = ` ${normalize(text)} `;
  return keywordGroups.filter(group => [group.label, ...group.aliases].some(alias => normalized.includes(` ${normalize(alias)} `))).map(group => group.id);
}

export function searchReplica(records, query, groupId = '') {
  const normalized = normalize(query);
  const tokens = normalized.split(' ').filter(Boolean);
  const groups = keywordGroups.filter(group => [group.label, ...group.aliases].some(alias => {
    const value = normalize(alias);
    return normalized && (normalized === value || normalized.includes(value));
  })).map(group => group.id);
  return records.filter(record => !groupId || record.groups.includes(groupId)).map(record => {
    if (!normalized) return { ...record, score: 1, matchedBy: 'All indexed content' };
    const title = normalize(record.title);
    const text = normalize(record.text);
    const phrase = title.includes(normalized) || text.includes(normalized);
    const direct = tokens.filter(token => title.split(' ').includes(token) || text.split(' ').includes(token)).length;
    const expanded = groups.filter(group => record.groups.includes(group)).length;
    return {
      ...record, score: (phrase ? 20 : 0) + direct * 3 + expanded * 5,
      matchedBy: phrase ? 'Exact phrase' : direct ? 'Keyword match' : expanded ? 'Related concept alias' : '',
    };
  }).filter(record => record.score > 0).sort((a, b) => b.score - a.score || a.id.localeCompare(b.id));
}
