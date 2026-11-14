/**
 * Normalizador de Texto e Utilitários Linguísticos para Português
 * Trata acentuações ("mídia" == "midia", "ômega 3" == "omega 3"), maiúsculas e pontuações.
 */

/**
 * Remove diacríticos e acentos preservando letras base
 * Ex: "mídia" -> "midia", "coração" -> "coracao"
 */
export const stripAccents = (str = '') => {
  if (typeof str !== 'string') return '';
  return str.normalize('NFD').replace(/[\u0300-\u036f]/g, '');
};

/**
 * Normaliza string: remove acentos, passa para minúsculas e limpa caracteres especiais
 */
export const normalizeText = (str = '') => {
  if (typeof str !== 'string') return '';
  const noAccents = stripAccents(str).toLowerCase();
  return noAccents.replace(/[^\w\s-]/g, ' ').replace(/\s+/g, ' ').trim();
};

/**
 * Converte string para formato de slug de URL
 */
export const slugify = (str = '') => {
  return normalizeText(str)
    .replace(/[^a-z0-9-]/g, '-')
    .replace(/-+/g, '-')
    .replace(/^-|-$/g, '');
};

/**
 * Remove tags HTML mantendo espaçamento entre blocos
 */
export const stripHtml = (html = '') => {
  if (typeof html !== 'string') return '';
  return html
    .replace(/<(script|style)[^>]*?>[\s\S]*?<\/\1>/gi, '')
    .replace(/<\/?[^>]+(>|$)/g, ' ')
    .replace(/&nbsp;/gi, ' ')
    .replace(/&amp;/gi, '&')
    .replace(/&quot;/gi, '"')
    .replace(/&#39;/gi, "'")
    .replace(/\s+/g, ' ')
    .trim();
};

/**
 * Extrai palavras individuais de um texto preservando acentos
 */
export const extractWords = (text = '') => {
  const clean = stripHtml(text);
  if (!clean) return [];
  const matches = clean.match(/[\p{L}\p{N}]+/gu);
  return matches || [];
};

/**
 * Divide o texto em frases com base na pontuação (. ! ? :)
 */
export const extractSentences = (text = '') => {
  const clean = stripHtml(text);
  if (!clean) return [];
  const sentences = clean.split(/[.!?:]+/).map((s) => s.trim()).filter((s) => s.length > 0);
  return sentences.length > 0 ? sentences : [clean];
};

/**
 * Conta sílabas aproximadas em uma palavra em português
 */
export const countSyllablesPt = (word = '') => {
  if (!word) return 1;
  const lower = stripAccents(word.toLowerCase());
  const matches = lower.match(/[aeiouy]+/g);
  return matches ? Math.max(1, matches.length) : 1;
};

/**
 * Verifica se um texto contém um termo (ignorando acentos e maiúsculas)
 */
export const containsNormalized = (source = '', term = '') => {
  const normSource = normalizeText(source);
  const normTerm = normalizeText(term);
  if (!normSource || !normTerm) return false;
  return normSource.includes(normTerm);
};

/**
 * Conta quantas vezes o termo aparece no texto (ignorando acentos e maiúsculas)
 */
export const countOccurrencesNormalized = (source = '', term = '') => {
  const normSource = normalizeText(source);
  const normTerm = normalizeText(term);
  if (!normSource || !normTerm) return 0;
  
  let count = 0;
  let pos = 0;
  while ((pos = normSource.indexOf(normTerm, pos)) !== -1) {
    count++;
    pos += normTerm.length;
  }
  return count;
};
