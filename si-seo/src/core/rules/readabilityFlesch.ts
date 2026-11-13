import { SeoAnalysisInput, SeoRuleResult } from '../types';
import { calculateWordCount } from './keywordDensity';

/**
 * Heurística enxuta para contar sílabas em português
 */
export function countSyllablesPtBr(word: string): number {
  const clean = word.toLowerCase().trim().replace(/[^a-záàâãéêíóôõúç]/g, '');
  if (clean.length <= 2) return 1;

  // Encontra grupos de vogais
  const vowels = clean.match(/[aeiouyáàâãéêíóôõú]+/g);
  return vowels ? Math.max(1, vowels.length) : 1;
}

export function extractSentences(text: string): string[] {
  const clean = text.replace(/<[^>]*>/g, ' ').replace(/\s+/g, ' ').trim();
  if (!clean) return [];
  // Divide por pontuação terminal (. ! ?)
  return clean
    .split(/(?<=[.!?])\s+/)
    .map((s) => s.trim())
    .filter((s) => s.length > 0);
}

export function calculateFleschPtBr(text: string): { score: number; wordCount: number; sentenceCount: number } {
  const sentences = extractSentences(text);
  const words = text.replace(/<[^>]*>/g, ' ').replace(/[^\wáàâãéêíóôõúç\s]/gi, '').split(/\s+/).filter(Boolean);

  const wordCount = words.length;
  const sentenceCount = Math.max(1, sentences.length);

  if (wordCount === 0) {
    return { score: 0, wordCount: 0, sentenceCount: 0 };
  }

  const totalSyllables = words.reduce((acc, word) => acc + countSyllablesPtBr(word), 0);
  const asl = wordCount / sentenceCount; // Comprimento médio da frase
  const asw = totalSyllables / wordCount; // Média de sílabas por palavra

  // Fórmula Flesch adaptada para o Português (Fernandez-Huerta / Martins)
  const score = Math.round(248.835 - (1.015 * asl) - (84.6 * asw));
  const clampedScore = Math.min(100, Math.max(0, score));

  return { score: clampedScore, wordCount, sentenceCount };
}

export function checkReadabilityFlesch(input: SeoAnalysisInput): SeoRuleResult & { fleschScore: number } {
  const { score, wordCount } = calculateFleschPtBr(input.content);

  if (wordCount < 50) {
    return {
      id: 'readability-flesch',
      name: 'Facilidade de Leitura (Flesch PT-BR)',
      category: 'readability',
      status: 'warning',
      scoreImpact: 5,
      fleschScore: score,
      message: 'Texto ainda curto para avaliar a leiturabilidade com precisão.',
      recommendation: 'Escreva um pouco mais para medir a clareza do texto.',
    };
  }

  if (score >= 45) {
    return {
      id: 'readability-flesch',
      name: 'Facilidade de Leitura (Flesch PT-BR)',
      category: 'readability',
      status: 'success',
      scoreImpact: 10,
      fleschScore: score,
      message: `Excelente clareza para saúde e jornalismo (Índice: ${score}/100). Leitura fluida e acessível.`,
      recommendation: 'Ótimo para prender a atenção do leitor de saúde até o final.',
    };
  }

  if (score >= 30) {
    return {
      id: 'readability-flesch',
      name: 'Facilidade de Leitura (Flesch PT-BR)',
      category: 'readability',
      status: 'warning',
      scoreImpact: 6,
      fleschScore: score,
      message: `Leitura moderadamente densa (Índice: ${score}/100).`,
      recommendation: 'Tente usar frases mais curtas e vocabulário mais direto para facilitar a leitura.',
    };
  }

  return {
    id: 'readability-flesch',
    name: 'Facilidade de Leitura (Flesch PT-BR)',
    category: 'readability',
    status: 'error',
    scoreImpact: 2,
    fleschScore: score,
    message: `Texto muito denso ou técnico (Índice: ${score}/100).`,
    recommendation: 'Reduza termos excessivamente longos e encurte as sentenças complexas.',
  };
}
