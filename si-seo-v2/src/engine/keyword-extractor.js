import { normalizeText, stripAccents, stripHtml } from './text-normalizer.js';

// Stop words em português mais comuns no jornalismo e artigos de saúde
const PT_STOP_WORDS = new Set([
  'a', 'o', 'os', 'as', 'um', 'uma', 'uns', 'umas', 'de', 'do', 'da', 'dos', 'das',
  'em', 'no', 'na', 'nos', 'nas', 'por', 'pelo', 'pela', 'pelos', 'pelas', 'para',
  'pra', 'com', 'sem', 'sob', 'sobre', 'que', 'se', 'e', 'ou', 'mas', 'como',
  'mais', 'menos', 'muito', 'muita', 'muitos', 'muitas', 'pouco', 'pouca', 'ja',
  'quando', 'onde', 'quem', 'qual', 'quais', 'esse', 'essa', 'esses', 'essas',
  'este', 'esta', 'estes', 'estas', 'aquele', 'aquela', 'aqueles', 'aquelas',
  'isso', 'isto', 'aquilo', 'seu', 'sua', 'seus', 'suas', 'meu', 'minha',
  'nosso', 'nossa', 'ele', 'ela', 'eles', 'elas', 'foi', 'foram', 'era', 'eram',
  'sao', 'ser', 'estar', 'tem', 'ter', 'traz', 'pode', 'podem', 'fazer', 'ate',
  'entre', 'assim', 'tambem', 'alem', 'disso', 'mesmo', 'mesma', 'cada', 'outro',
  'outra', 'outros', 'outras', 'bem', 'nao', 'sim', 'segundo', 'apos', 'durante',
  'estudos', 'artigo', 'post', 'texto', 'sobre'
]);

/**
 * Extrai palavras-chave candidatas automáticas de um artigo
 * Analisa o título (peso alto) e o corpo do texto (n-grams de 1, 2 e 3 palavras).
 *
 * @param {string} title Título do post
 * @param {string} content Conteúdo do post (HTML ou texto)
 * @param {number} maxResults Quantidade máxima de sugestões (padrão: 5)
 * @returns {Array<string>} Lista de palavras-chave sugeridas em formato limpo
 */
export const extractSuggestedKeywords = (title = '', content = '', maxResults = 5) => {
  const cleanTitle = stripHtml(title);
  const cleanContent = stripHtml(content);
  const fullText = `${cleanTitle} ${cleanTitle} ${cleanContent}`; // Título duplicado para dar peso extra

  const normalized = normalizeText(fullText);
  if (!normalized) return [];

  const rawTokens = normalized.split(/\s+/).filter((t) => t.length > 0);
  const filteredTokens = rawTokens.filter((token) => !PT_STOP_WORDS.has(token) && token.length > 2);

  const phraseScores = new Map();

  // 1. Extração de Unigramas (1 palavra forte)
  filteredTokens.forEach((token) => {
    if (token.length >= 4) {
      phraseScores.set(token, (phraseScores.get(token) || 0) + 1);
    }
  });

  // 2. Extração de Bigramas (2 palavras fortes juntas, ex: "vitamina d", "omega 3", "varejo farmaceutico")
  for (let i = 0; i < rawTokens.length - 1; i++) {
    const w1 = rawTokens[i];
    const w2 = rawTokens[i + 1];

    // Bigrama válido: primeira palavra não pode ser stop word
    if (!PT_STOP_WORDS.has(w1)) {
      // Aceita números (como 3 em omega 3) ou letras isoladas (como d em vitamina d)
      if (!PT_STOP_WORDS.has(w2) || /^[0-9a-z]$/i.test(w2)) {
        const bigram = `${w1} ${w2}`;
        phraseScores.set(bigram, (phraseScores.get(bigram) || 0) + 3);
      }
    }
  }

  // 3. Extração de Trigramas (3 palavras com conectivos, ex: "saude do coracao")
  for (let i = 0; i < rawTokens.length - 2; i++) {
    const w1 = rawTokens[i];
    const w2 = rawTokens[i + 1];
    const w3 = rawTokens[i + 2];

    if (!PT_STOP_WORDS.has(w1) && !PT_STOP_WORDS.has(w3)) {
      const trigram = `${w1} ${w2} ${w3}`;
      phraseScores.set(trigram, (phraseScores.get(trigram) || 0) + 3.5);
    }
  }

  // Ordena por pontuação de frequência/relevância
  const sorted = Array.from(phraseScores.entries())
    .sort((a, b) => b[1] - a[1])
    .map(([phrase]) => phrase);

  // Filtra redundâncias
  const uniqueSuggestions = [];
  for (const phrase of sorted) {
    const alreadySubsumed = uniqueSuggestions.some(
      (existing) => existing === phrase || (existing.includes(phrase) && existing.split(' ').length > 2)
    );
    if (!alreadySubsumed) {
      uniqueSuggestions.push(phrase);
    }
    if (uniqueSuggestions.length >= maxResults) break;
  }

  return uniqueSuggestions;
};
