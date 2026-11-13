/**
 * Utilitários de normalização de texto e caracteres diacríticos (acentos)
 * O Google trata palavras acentuadas e desacentuadas como equivalentes semânticos
 * (ex: 'beneficios' === 'benefícios', 'saude' === 'saúde', 'acao' === 'ação').
 */

/**
 * Remove acentos e caracteres diacríticos preservando as letras base
 */
export function stripAccents(str: string): string {
  if (!str) return '';
  return str.normalize('NFD').replace(/[\u0300-\u036f]/g, '');
}

/**
 * Normaliza uma string para comparação textual insensível a maiúsculas e acentos
 */
export function normalizeForSearch(str: string): string {
  if (!str) return '';
  return stripAccents(str.trim().toLowerCase());
}

/**
 * Verifica se um texto contém uma determinada palavra-chave, ignorando acentos e case
 */
export function textContainsKeyword(haystack: string, keyword: string): boolean {
  if (!haystack || !keyword) return false;
  return normalizeForSearch(haystack).includes(normalizeForSearch(keyword));
}

/**
 * Verifica se um texto inicia com uma palavra-chave, ignorando acentos e case
 */
export function textStartsWithKeyword(haystack: string, keyword: string): boolean {
  if (!haystack || !keyword) return false;
  return normalizeForSearch(haystack).startsWith(normalizeForSearch(keyword));
}

/**
 * Converte um termo em um padrão Regex que aceita variações com e sem acento no português
 * (ex: 'beneficios' casa com 'benefícios' e 'saude' casa com 'saúde').
 */
export function createDiacriticRegexPattern(term: string): string {
  if (!term) return '';
  const accentMap: Record<string, string> = {
    a: '[aáàãâä]',
    e: '[eéèêë]',
    i: '[iíìîï]',
    o: '[oóòõôö]',
    u: '[uúùûü]',
    c: '[cç]',
  };

  const stripped = stripAccents(term.toLowerCase());
  return stripped
    .replace(/[.*+?^${}()|[\]\\]/g, '\\$&')
    .replace(/[aeiouc]/g, (char) => accentMap[char] || char);
}
