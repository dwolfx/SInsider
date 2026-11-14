import { extractWords, extractSentences, countSyllablesPt } from './text-normalizer.js';

/**
 * Cálculo do Índice de Facilidade de Leitura Flesch adaptado para o Português (Flesch-Martins)
 * Fórmula: 248.835 - (1.015 * ASL) - (84.6 * ASW)
 * Onde:
 *  - ASL = Comprimento Médio da Sentença (palavras / frases)
 *  - ASW = Número Médio de Sílabas por Palavra (sílabas / palavras)
 *
 * @param {string} text Texto limpo ou HTML
 * @returns {number} Pontuação de 0 a 100
 */
export const calculateFleschPt = (text = '') => {
  const words = extractWords(text);
  const wordCount = words.length;

  if (wordCount < 10) {
    return 50; // valor mediano para textos muito curtos
  }

  const sentences = extractSentences(text);
  const sentenceCount = Math.max(1, sentences.length);

  let totalSyllables = 0;
  words.forEach((w) => {
    totalSyllables += countSyllablesPt(w);
  });

  const asl = wordCount / sentenceCount;
  const asw = totalSyllables / wordCount;

  const score = 248.835 - 1.015 * asl - 84.6 * asw;
  return Math.max(0, Math.min(100, Math.round(score)));
};

/**
 * Classificação textual da legibilidade Flesch
 */
export const getFleschClassification = (score) => {
  if (score >= 75) {
    return { label: 'Leitura muito fácil', status: 'good' };
  }
  if (score >= 60) {
    return { label: 'Leitura fácil e acessível', status: 'good' };
  }
  if (score >= 40) {
    return { label: 'Leitura moderadamente densa', status: 'moderate' };
  }
  return { label: 'Leitura difícil (frases longas)', status: 'poor' };
};
