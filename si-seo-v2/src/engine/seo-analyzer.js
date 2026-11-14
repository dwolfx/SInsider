import {
  stripHtml,
  normalizeText,
  extractWords,
  extractSentences,
  slugify,
  containsNormalized,
  countOccurrencesNormalized,
} from './text-normalizer.js';
import { calculateFleschPt, getFleschClassification } from './flesch-pt.js';

/**
 * Conectivos jornalísticos e palavras de transição comuns em português
 */
const TRANSITION_WORDS = [
  'alem disso', 'portanto', 'contudo', 'no entanto', 'por outro lado',
  'por exemplo', 'segundo estudos', 'de acordo com', 'em contrapartida',
  'dessa forma', 'assim como', 'finalmente', 'em primeiro lugar',
  'consequentemente', 'ademais', 'apesar de', 'visto que', 'ja que'
];

/**
 * Motor Completo de Análise de SEO e Redação Jornalística
 */
export const runSeoAnalysis = ({
  keyword = '',
  title = '',
  slug = '',
  desc = '',
  content = '',
}) => {
  const plainText = stripHtml(content);
  const words = extractWords(plainText);
  const wordCount = words.length;

  const normKeyword = normalizeText(keyword);
  const kwOccurrences = normKeyword ? countOccurrencesNormalized(plainText, normKeyword) : 0;
  
  const density = wordCount > 0 && normKeyword 
    ? parseFloat(((kwOccurrences / wordCount) * 100).toFixed(2)) 
    : 0;

  const fleschPt = calculateFleschPt(plainText);
  const fleschClass = getFleschClassification(fleschPt);

  const checks = [];
  let earnedScore = 0;
  let maxPossible = 0;

  const addCheck = (weight, checkResult) => {
    maxPossible += weight;
    earnedScore += (checkResult.scoreWeight || 0) * weight;
    checks.push(checkResult);
  };

  // 1. Palavra-chave no Título (H1) [Peso: 15]
  const hasKwInTitle = normKeyword && containsNormalized(title, normKeyword);
  addCheck(15, {
    id: 'keyword_in_title',
    title: 'Palavra-chave no Título',
    status: !normKeyword ? 'warning' : hasKwInTitle ? 'good' : 'poor',
    scoreWeight: !normKeyword ? 0.3 : hasKwInTitle ? 1.0 : 0.0,
    message: !normKeyword
      ? 'Defina uma palavra-chave foco para validar o título.'
      : hasKwInTitle
      ? 'A palavra-chave foco aparece no título principal (H1).'
      : 'A palavra-chave foco não foi encontrada no título do post.',
    tip: hasKwInTitle ? '' : 'Inclua a palavra-chave de forma natural, preferencialmente mais à esquerda do título.',
    actionText: '',
  });

  // 2. Palavra-chave na URL (Slug) [Peso: 10]
  const normSlug = slugify(slug);
  const kwSlug = slugify(normKeyword);
  const hasKwInSlug = normSlug && kwSlug && normSlug.includes(kwSlug);
  addCheck(10, {
    id: 'keyword_in_slug',
    title: 'Palavra-chave na URL (Slug)',
    status: !normKeyword ? 'warning' : hasKwInSlug ? 'good' : 'poor',
    scoreWeight: !normKeyword ? 0.4 : hasKwInSlug ? 1.0 : 0.0,
    message: !normKeyword
      ? 'Defina uma palavra-chave para analisar o slug.'
      : hasKwInSlug
      ? 'A URL contém a palavra-chave foco amigável.'
      : 'A palavra-chave foco não aparece na URL amigável (slug).',
    tip: hasKwInSlug ? '' : 'Edite o slug para incluir a palavra-chave separada por hífens.',
    actionText: '',
  });

  // 3. Meta Descrição [Peso: 15]
  const descLen = desc ? desc.trim().length : 0;
  const hasKwInDesc = normKeyword && containsNormalized(desc, normKeyword);
  let metaStatus = 'poor';
  let metaScore = 0;
  let metaMsg = '';
  let metaTip = '';

  if (descLen === 0) {
    metaStatus = 'poor';
    metaScore = 0;
    metaMsg = 'Nenhuma meta descrição foi informada.';
    metaTip = 'Escreva um resumo cativante de 120 a 160 caracteres com a palavra-chave.';
  } else if (descLen >= 120 && descLen <= 160 && hasKwInDesc) {
    metaStatus = 'good';
    metaScore = 1.0;
    metaMsg = `Meta descrição perfeita! (${descLen} caracteres) com a palavra-chave.`;
  } else if (hasKwInDesc) {
    metaStatus = 'moderate';
    metaScore = 0.65;
    metaMsg = `Contém a palavra-chave, mas tem ${descLen} caracteres (o ideal é 120-160).`;
    metaTip = descLen < 120
      ? 'Aumente um pouco a descrição para informar melhor o leitor.'
      : 'Reduza um pouco a descrição para não ser cortada nos resultados do Google.';
  } else {
    metaStatus = 'poor';
    metaScore = 0.3;
    metaMsg = `A meta descrição possui ${descLen} caracteres, mas não contém a palavra-chave foco.`;
    metaTip = 'Inclua a palavra-chave na descrição para aumentar a taxa de cliques (CTR).';
  }

  addCheck(15, {
    id: 'meta_description',
    title: 'Meta Descrição',
    status: metaStatus,
    scoreWeight: metaScore,
    message: metaMsg,
    tip: metaTip,
    actionText: hasKwInDesc ? `Destacar "${keyword}" no texto` : '',
  });

  // 4. Palavra-chave no Início do Conteúdo (Lead) [Peso: 12]
  const introWords = words.slice(0, 80).join(' ');
  const hasKwInIntro = normKeyword && containsNormalized(introWords, normKeyword);
  addCheck(12, {
    id: 'keyword_in_intro',
    title: 'Palavra-chave no Início do Conteúdo',
    status: !normKeyword ? 'warning' : hasKwInIntro ? 'good' : 'moderate',
    scoreWeight: !normKeyword ? 0.3 : hasKwInIntro ? 1.0 : 0.4,
    message: !normKeyword
      ? 'Adicione conteúdo e palavra-chave para verificar a introdução.'
      : hasKwInIntro
      ? 'A palavra-chave aparece logo no início do texto (primeiro parágrafo / lead).'
      : 'A palavra-chave foco não foi encontrada nas primeiras 80 palavras.',
    tip: hasKwInIntro ? '' : 'No jornalismo de saúde, apresente o termo principal no primeiro parágrafo para reter o leitor.',
    actionText: hasKwInIntro ? `Destacar "${keyword}" no texto` : '',
  });

  // 5. Densidade da Palavra-chave [Peso: 10]
  let densityStatus = 'moderate';
  let densityScore = 0.5;
  let densityMsg = '';
  let densityTip = '';

  if (!normKeyword) {
    densityStatus = 'moderate';
    densityScore = 0.3;
    densityMsg = 'Defina a palavra-chave para calcular a densidade.';
    densityTip = 'A densidade ideal situa-se entre 1.0% e 2.5%.';
  } else if (density >= 0.8 && density <= 2.5) {
    densityStatus = 'good';
    densityScore = 1.0;
    densityMsg = `Densidade equilibrada (${density}% - ${kwOccurrences} repetições).`;
  } else if (density < 0.8) {
    densityStatus = 'moderate';
    densityScore = 0.5;
    densityMsg = `Densidade baixa (${density}%). O termo aparece ${kwOccurrences} vez(es).`;
    densityTip = 'Distribua a palavra-chave mais vezes ao longo do texto de forma natural.';
  } else {
    densityStatus = 'poor';
    densityScore = 0.2;
    densityMsg = `Densidade muito alta (${density}%). Risco de keyword stuffing.`;
    densityTip = 'Reduza repetições excessivas e utilize sinônimos para manter a naturalidade.';
  }

  addCheck(10, {
    id: 'keyword_density',
    title: 'Densidade da Palavra-chave',
    status: densityStatus,
    scoreWeight: densityScore,
    message: densityMsg,
    tip: densityTip,
    actionText: kwOccurrences > 0 ? `Destacar "${keyword}" no texto` : '',
  });

  // 6. Tamanho do Conteúdo [Peso: 12]
  let lenStatus = 'poor';
  let lenScore = 0;
  let lenMsg = '';
  let lenTip = '';

  if (wordCount >= 600) {
    lenStatus = 'good';
    lenScore = 1.0;
    lenMsg = `Excelente tamanho de conteúdo (${wordCount} palavras).`;
  } else if (wordCount >= 300) {
    lenStatus = 'good';
    lenScore = 0.8;
    lenMsg = `Bom tamanho de conteúdo (${wordCount} palavras, acima do mínimo de 300).`;
    lenTip = 'Artigos com mais de 600 palavras tendem a ranquear ainda melhor para tópicos concorridos.';
  } else {
    lenStatus = 'poor';
    lenScore = 0.2;
    lenMsg = `Texto muito curto (${wordCount} palavras). Artigos com menos de 300 palavras têm baixa relevância.`;
    lenTip = 'Escreva um texto mais completo para esclarecer o leitor e ranquear bem.';
  }

  addCheck(12, {
    id: 'content_length',
    title: 'Tamanho do Conteúdo',
    status: lenStatus,
    scoreWeight: lenScore,
    message: lenMsg,
    tip: lenTip,
    actionText: '',
  });

  // 7. Subtítulos (H2 / H3) [Peso: 8]
  const headingMatches = content.match(/<h[23][^>]*>([\s\S]*?)<\/h[23]>/gi) || [];
  const headingCount = headingMatches.length;
  let hasKwInHeading = false;

  for (const h of headingMatches) {
    if (normKeyword && containsNormalized(stripHtml(h), normKeyword)) {
      hasKwInHeading = true;
      break;
    }
  }

  addCheck(8, {
    id: 'subheadings',
    title: 'Subtítulos (H2 / H3)',
    status: headingCount === 0 ? 'moderate' : hasKwInHeading ? 'good' : 'moderate',
    scoreWeight: headingCount === 0 ? 0.3 : hasKwInHeading ? 1.0 : 0.7,
    message: headingCount === 0
      ? 'Nenhum subtítulo (H2 ou H3) foi encontrado no texto.'
      : hasKwInHeading
      ? 'A palavra-chave foco aparece em pelo menos um subtítulo (H2/H3).'
      : `Você tem ${headingCount} subtítulo(s), mas nenhum traz a palavra-chave foco.`,
    tip: hasKwInHeading ? '' : 'Divida o artigo com subtítulos H2 e insira o termo foco em um deles.',
    actionText: hasKwInHeading ? `Destacar "${keyword}" no texto` : '',
  });

  // 8. Texto Alternativo das Imagens (Alt) [Peso: 8]
  const imgTags = content.match(/<img[^>]+>/gi) || [];
  const imgCount = imgTags.length;
  let altsWithKw = 0;

  imgTags.forEach((img) => {
    const altMatch = img.match(/alt=["']([^"']*)["']/i);
    if (altMatch && normKeyword && containsNormalized(altMatch[1], normKeyword)) {
      altsWithKw++;
    }
  });

  addCheck(8, {
    id: 'image_alts',
    title: 'Texto Alternativo das Imagens (Alt)',
    status: imgCount === 0 ? 'moderate' : altsWithKw > 0 ? 'good' : 'moderate',
    scoreWeight: imgCount === 0 ? 0.4 : altsWithKw > 0 ? 1.0 : 0.5,
    message: imgCount === 0
      ? 'Nenhuma imagem encontrada no conteúdo.'
      : altsWithKw > 0
      ? 'Imagens possuem texto alternativo (alt) com a palavra-chave foco.'
      : 'Nenhuma imagem possui a palavra-chave foco no atributo alt.',
    tip: altsWithKw > 0 ? '' : 'Atualize o texto alternativo de uma das imagens com a palavra-chave foco.',
    actionText: altsWithKw > 0 ? `Destacar "${keyword}" no texto` : '',
  });

  // 9. Facilidade de Leitura (Flesch PT-BR) [Peso: 6]
  addCheck(6, {
    id: 'flesch_pt',
    title: 'Facilidade de Leitura (Flesch PT-BR)',
    status: fleschClass.status,
    scoreWeight: fleschPt >= 60 ? 1.0 : fleschPt >= 40 ? 0.7 : 0.3,
    message: `${fleschClass.label} (Índice: ${fleschPt}/100).`,
    tip: fleschPt >= 60 ? '' : 'Tente usar frases mais curtas e vocabulário mais direto para facilitar a leitura.',
    actionText: '',
  });

  // 10. Comprimento das Frases [Peso: 4]
  const sentences = extractSentences(plainText);
  let longSentences = 0;
  sentences.forEach((s) => {
    const sWords = extractWords(s).length;
    if (sWords > 22) longSentences++;
  });
  const longSentenceRatio = sentences.length > 0 ? longSentences / sentences.length : 0;
  const isSentenceGood = longSentenceRatio <= 0.25;

  addCheck(4, {
    id: 'sentence_length',
    title: 'Comprimento das Frases',
    status: isSentenceGood ? 'good' : 'moderate',
    scoreWeight: isSentenceGood ? 1.0 : 0.5,
    message: isSentenceGood
      ? `Frases fluidas e curtas (${Math.round((1 - longSentenceRatio) * 100)}% das frases com tamanho ideal).`
      : `${Math.round(longSentenceRatio * 100)}% das frases têm mais de 22 palavras.`,
    tip: isSentenceGood ? '' : 'No jornalismo, quebre frases longas com pontos finais para prender a atenção do leitor.',
    actionText: '',
  });

  // Cálculo da pontuação final (0 a 100)
  const rawScore = maxPossible > 0 ? (earnedScore / maxPossible) * 100 : 0;
  const finalScore = Math.max(0, Math.min(100, Math.round(rawScore)));

  let statusLabel = 'Com falhas';
  let statusClass = 'poor';

  if (finalScore >= 90) {
    statusLabel = 'Artigo otimizado';
    statusClass = 'good';
  } else if (finalScore >= 70) {
    statusLabel = 'Otimização moderada';
    statusClass = 'moderate';
  }

  return {
    score: finalScore,
    statusLabel,
    statusClass,
    metrics: {
      wordCount,
      density,
      fleschPt,
      kwOccurrences,
    },
    checks,
  };
};
