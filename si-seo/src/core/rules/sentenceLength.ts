import { SeoAnalysisInput, SeoRuleResult } from '../types';
import { extractSentences } from './readabilityFlesch';
import { calculateWordCount } from './keywordDensity';

export function checkSentenceLength(input: SeoAnalysisInput): SeoRuleResult {
  const sentences = extractSentences(input.content);
  if (sentences.length === 0) {
    return {
      id: 'sentence-length',
      name: 'Comprimento das Frases',
      category: 'readability',
      status: 'warning',
      scoreImpact: 0,
      message: 'Nenhuma frase detectada.',
      recommendation: 'Escreva frases objetivas.',
    };
  }

  // Frases longas: mais de 25 palavras
  const longSentences = sentences.filter((s) => calculateWordCount(s) > 25);
  const percentage = Math.round((longSentences.length / sentences.length) * 100);

  if (percentage <= 20) {
    return {
      id: 'sentence-length',
      name: 'Comprimento das Frases',
      category: 'readability',
      status: 'success',
      scoreImpact: 10,
      message: `Apenas ${percentage}% das frases são longas (máx. 25 palavras).`,
      recommendation: 'Excelente ritmo de leitura.',
    };
  }

  return {
    id: 'sentence-length',
    name: 'Comprimento das Frases',
    category: 'readability',
    status: 'warning',
    scoreImpact: 5,
    message: `${percentage}% das frases contêm mais de 25 palavras (recomendado: menos de 20%).`,
    recommendation: 'Divida algumas frases longas em duas usando pontos finais.',
  };
}
