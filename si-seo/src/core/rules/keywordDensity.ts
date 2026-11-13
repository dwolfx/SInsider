import { SeoAnalysisInput, SeoRuleResult } from '../types';
import { normalizeForSearch } from '../textUtils';

export function calculateWordCount(text: string): number {
  const clean = text.replace(/<[^>]*>/g, ' ').replace(/\s+/g, ' ').trim();
  if (!clean) return 0;
  return clean.split(/\s+/).length;
}

export function checkKeywordDensity(input: SeoAnalysisInput): SeoRuleResult & { densityPercent: number; wordCount: number } {
  const keywordNormalized = normalizeForSearch(input.focusKeyword);
  const cleanContentNormalized = normalizeForSearch(input.content.replace(/<[^>]*>/g, ' '));
  const wordCount = calculateWordCount(input.content);
  const displayKeyword = input.focusKeyword.trim();

  if (!keywordNormalized || wordCount === 0) {
    return {
      id: 'keyword-density',
      name: 'Densidade da Palavra-chave',
      category: 'basic',
      status: 'error',
      scoreImpact: 0,
      densityPercent: 0,
      wordCount,
      message: 'Não há conteúdo suficiente ou palavra-chave definida para calcular a densidade.',
      recommendation: 'Defina a palavra-chave foco e escreva o corpo da matéria para analisarmos a distribuição.',
    };
  }

  // Regex de ocorrências no texto visível limpo e normalizado (sem acentos)
  const escaped = keywordNormalized.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
  const matches = cleanContentNormalized.match(new RegExp(escaped, 'g'));
  const occurrences = matches ? matches.length : 0;

  // Frequência real da frase/termo no conteúdo (padrão de mercado para entidades e frases-chave)
  const densityPercent = Number(((occurrences / wordCount) * 100).toFixed(2));

  // Faixa ideal oficial calibrada (0.5% a 2.5% da extensão do texto)
  if (densityPercent >= 0.5 && densityPercent <= 2.5) {
    return {
      id: 'keyword-density',
      name: 'Densidade da Palavra-chave',
      category: 'basic',
      status: 'success',
      scoreImpact: 10,
      densityPercent,
      wordCount,
      message: `Densidade perfeita: a palavra-chave "${displayKeyword}" aparece ${occurrences} vezes (densidade de ${densityPercent}%).`,
      recommendation: 'Excelente equilíbrio! A distribuição está natural e dentro do padrão ideal recomendado pelo Google.',
    };
  }

  if (densityPercent < 0.5) {
    return {
      id: 'keyword-density',
      name: 'Densidade da Palavra-chave',
      category: 'basic',
      status: 'warning',
      scoreImpact: 5,
      densityPercent,
      wordCount,
      message: `A palavra-chave "${displayKeyword}" aparece apenas ${occurrences} vez(es) (densidade de ${densityPercent}%). O recomendável é entre 0.5% e 2.5%.`,
      recommendation: `Distribua a palavra-chave "${displayKeyword}" mais algumas vezes de maneira fluida pelo conteúdo.`,
    };
  }

  if (densityPercent <= 3.5) {
    return {
      id: 'keyword-density',
      name: 'Densidade da Palavra-chave',
      category: 'basic',
      status: 'warning',
      scoreImpact: 6,
      densityPercent,
      wordCount,
      message: `A palavra-chave "${displayKeyword}" aparece ${occurrences} vezes (densidade de ${densityPercent}%). Está no limiar superior do recomendável (0.5% a 2.5%).`,
      recommendation: `Considere substituir 1 ou 2 menções de "${displayKeyword}" por termos correlatos para manter a leitura agradável.`,
    };
  }

  return {
    id: 'keyword-density',
    name: 'Densidade da Palavra-chave',
    category: 'basic',
    status: 'error',
    scoreImpact: 2,
    densityPercent,
    wordCount,
    message: `A palavra-chave "${displayKeyword}" aparece ${occurrences} vezes no texto (densidade de ${densityPercent}%). Risco de penalização por repetição excessiva (keyword stuffing).`,
    recommendation: `Remova repetições excessivas de "${displayKeyword}" ou substitua por sinônimos para evitar penalizações do Google.`,
  };
}
