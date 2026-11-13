import { SeoAnalysisInput, SeoRuleResult } from '../types';

export interface LinksAuditResult extends SeoRuleResult {
  internalLinksCount: number;
  externalLinksCount: number;
}

export function checkLinksAudit(input: SeoAnalysisInput): LinksAuditResult {
  const content = input.content || '';

  // Extrai todas as tags <a> do HTML
  const linkMatches = content.match(/<a\s+[^>]*href=["']([^"']*)["'][^>]*>/gi) || [];

  let internalLinksCount = 0;
  let externalLinksCount = 0;

  linkMatches.forEach((tag) => {
    const hrefMatch = tag.match(/href=["']([^"']*)["']/i);
    if (!hrefMatch) return;

    const href = hrefMatch[1].trim();
    if (!href || href.startsWith('#') || href.startsWith('javascript:')) return;

    // Links relativos ou com domínio próprio do portal
    if (href.startsWith('/') || href.includes('saudeinsider.com.br')) {
      internalLinksCount++;
    } else if (href.startsWith('http://') || href.startsWith('https://')) {
      externalLinksCount++;
    }
  });

  const hasInternal = internalLinksCount > 0;
  const hasExternal = externalLinksCount > 0;

  if (hasInternal && hasExternal) {
    return {
      id: 'links-audit',
      name: 'Links Internos e Externos (Jornalismo E-E-A-T)',
      category: 'advanced',
      status: 'success',
      scoreImpact: 10,
      internalLinksCount,
      externalLinksCount,
      message: `Excelente distribuição de links: ${internalLinksCount} link(s) interno(s) e ${externalLinksCount} citação(ões) de fonte externa.`,
      recommendation: 'A citação de fontes externas combinada a links do portal reforça a credibilidade jornalística diante do Google.',
    };
  }

  if (hasInternal && !hasExternal) {
    return {
      id: 'links-audit',
      name: 'Links Internos e Externos (Jornalismo E-E-A-T)',
      category: 'advanced',
      status: 'warning',
      scoreImpact: 6,
      internalLinksCount,
      externalLinksCount,
      message: `Encontramos ${internalLinksCount} link(s) interno(s), mas nenhuma citação a fontes externas ou estudos médicos.`,
      recommendation: 'Para matérias de saúde, adicione ao menos um link externo referenciando a fonte oficial (ex: OMS, ANVISA, Ministério da Saúde ou periódico científico).',
    };
  }

  if (!hasInternal && hasExternal) {
    return {
      id: 'links-audit',
      name: 'Links Internos e Externos (Jornalismo E-E-A-T)',
      category: 'advanced',
      status: 'warning',
      scoreImpact: 6,
      internalLinksCount,
      externalLinksCount,
      message: `Encontramos ${externalLinksCount} link(s) externo(s), mas nenhum link interno para outras matérias do portal.`,
      recommendation: 'Insira links apontando para outros artigos relevantes do Saúde Insider para reter o leitor no portal.',
    };
  }

  return {
    id: 'links-audit',
    name: 'Links Internos e Externos (Jornalismo E-E-A-T)',
    category: 'advanced',
    status: 'warning',
    scoreImpact: 3,
    internalLinksCount: 0,
    externalLinksCount: 0,
    message: 'Nenhum link encontrado no corpo da matéria.',
    recommendation: 'Adicione links internos para outros artigos do portal e links externos para fontes oficiais de dados ou estudos médicos.',
  };
}
