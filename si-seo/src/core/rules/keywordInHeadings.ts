import { SeoAnalysisInput, SeoRuleResult } from '../types';
import { textContainsKeyword } from '../textUtils';

export function checkKeywordInHeadings(input: SeoAnalysisInput): SeoRuleResult {
  const keyword = input.focusKeyword.trim();
  const headings = input.headings || [];

  // Se não passou array explícito de headings, tenta extrair por regex do HTML
  const extractedHeadings = headings.length > 0 
    ? headings 
    : (input.content.match(/<h[2-4][^>]*>(.*?)<\/h[2-4]>/gi) || [])
        .map((h) => h.replace(/<[^>]+>/g, '').trim());

  if (extractedHeadings.length === 0) {
    return {
      id: 'keyword-in-headings',
      name: 'Subtítulos (H2 / H3)',
      category: 'additional',
      status: 'warning',
      scoreImpact: 3,
      message: 'Nenhum subtítulo (H2 ou H3) foi detectado.',
      recommendation: 'Divida o artigo com subtítulos H2/H3 para facilitar a escaneabilidade.',
    };
  }

  const hasKeywordInHeading = extractedHeadings.some((h) => textContainsKeyword(h, keyword));

  if (hasKeywordInHeading) {
    return {
      id: 'keyword-in-headings',
      name: 'Subtítulos (H2 / H3)',
      category: 'additional',
      status: 'success',
      scoreImpact: 10,
      message: 'A palavra-chave foco aparece em pelo menos um subtítulo (H2/H3).',
      recommendation: 'Excelente estrutura de tópicos para leitores e motores de busca.',
    };
  }

  return {
    id: 'keyword-in-headings',
    name: 'Subtítulos (H2 / H3)',
    category: 'additional',
    status: 'warning',
    scoreImpact: 5,
    message: 'A palavra-chave foco não foi encontrada em nenhum subtítulo.',
    recommendation: `Insira a palavra-chave "${input.focusKeyword}" em pelo menos um H2 ou H3.`,
  };
}
