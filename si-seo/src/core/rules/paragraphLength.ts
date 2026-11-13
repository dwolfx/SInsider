import { SeoAnalysisInput, SeoRuleResult } from '../types';
import { calculateWordCount } from './keywordDensity';

export function extractParagraphs(content: string): string[] {
  // Trata quebras duplas de linha ou tags <p>
  if (content.includes('<p>')) {
    const matches = content.match(/<p[^>]*>(.*?)<\/p>/gis);
    if (matches) {
      return matches.map((p) => p.replace(/<[^>]+>/g, '').trim()).filter(Boolean);
    }
  }

  return content
    .split(/\n\s*\n/)
    .map((p) => p.trim())
    .filter(Boolean);
}

export function checkParagraphLength(input: SeoAnalysisInput): SeoRuleResult {
  const paragraphs = extractParagraphs(input.content);

  if (paragraphs.length === 0) {
    return {
      id: 'paragraph-length',
      name: 'Comprimento dos Parágrafos',
      category: 'readability',
      status: 'warning',
      scoreImpact: 0,
      message: 'Nenhum parágrafo identificado.',
      recommendation: 'Separe o texto em blocos de leitura.',
    };
  }

  // Parágrafos longos: mais de 120 palavras
  const longParagraphs = paragraphs.filter((p) => calculateWordCount(p) > 120);

  if (longParagraphs.length === 0) {
    return {
      id: 'paragraph-length',
      name: 'Comprimento dos Parágrafos',
      category: 'readability',
      status: 'success',
      scoreImpact: 10,
      message: 'Todos os parágrafos têm tamanho ideal para leitura em mobile.',
      recommendation: 'Parágrafos curtos aumentam o tempo de permanência na página.',
    };
  }

  return {
    id: 'paragraph-length',
    name: 'Comprimento dos Parágrafos',
    category: 'readability',
    status: 'warning',
    scoreImpact: 5,
    message: `${longParagraphs.length} parágrafo(s) contêm mais de 120 palavras.`,
    recommendation: 'Divida os blocos de texto grandes para melhorar a leitura em celulares.',
  };
}
