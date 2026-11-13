import { SeoAnalysisInput, SeoReport, SeoRuleResult } from './types';
import { checkKeywordInTitle } from './rules/keywordInTitle';
import { checkKeywordInSlug } from './rules/keywordInSlug';
import { checkKeywordInMetaDescription } from './rules/keywordInMetaDescription';
import { checkKeywordInFirstParagraph } from './rules/keywordInFirstParagraph';
import { checkKeywordDensity, calculateWordCount } from './rules/keywordDensity';
import { checkKeywordInHeadings } from './rules/keywordInHeadings';
import { checkKeywordInImageAlt } from './rules/keywordInImageAlt';
import { checkContentLength } from './rules/contentLength';
import { checkReadabilityFlesch, calculateFleschPtBr, extractSentences } from './rules/readabilityFlesch';
import { checkSentenceLength } from './rules/sentenceLength';
import { checkParagraphLength, extractParagraphs } from './rules/paragraphLength';
import { checkLinksAudit } from './rules/linksAudit';

export function analyzeSeo(input: SeoAnalysisInput): SeoReport {
  const densityResult = checkKeywordDensity(input);
  const fleschResult = checkReadabilityFlesch(input);
  const linksResult = checkLinksAudit(input);

  const results: SeoRuleResult[] = [
    checkKeywordInTitle(input),
    checkKeywordInSlug(input),
    checkKeywordInMetaDescription(input),
    checkKeywordInFirstParagraph(input),
    densityResult,
    checkContentLength(input),
    checkKeywordInHeadings(input),
    checkKeywordInImageAlt(input),
    linksResult,
    fleschResult,
    checkSentenceLength(input),
    checkParagraphLength(input),
  ];

  // Cálculo ponderado do Score (0 a 100)
  // Soma dos pesos máximos possíveis: 15+10+10+10+10+15+10+10+10+10+10+10 = 130
  const maxPossibleScore = 130;
  const currentTotal = results.reduce((sum, r) => sum + r.scoreImpact, 0);
  const overallScore = Math.min(100, Math.round((currentTotal / maxPossibleScore) * 100));

  const passedCount = results.filter((r) => r.status === 'success').length;
  const warningCount = results.filter((r) => r.status === 'warning').length;
  const errorCount = results.filter((r) => r.status === 'error').length;

  const wordCount = calculateWordCount(input.content);
  const sentences = extractSentences(input.content);
  const paragraphs = extractParagraphs(input.content);
  const { score: fleschScore } = calculateFleschPtBr(input.content);

  // Média editorial jornalística: 200 palavras por minuto
  const readingTimeMinutes = Math.max(1, Math.ceil(wordCount / 200));

  const status = overallScore >= 80 ? 'success' : overallScore >= 50 ? 'warning' : 'error';

  return {
    overallScore,
    status,
    passedCount,
    warningCount,
    errorCount,
    results,
    statistics: {
      wordCount,
      sentenceCount: sentences.length,
      paragraphCount: paragraphs.length,
      keywordDensityPercent: densityResult.densityPercent,
      fleschScore,
      readingTimeMinutes,
      internalLinksCount: linksResult.internalLinksCount,
      externalLinksCount: linksResult.externalLinksCount,
    },
  };
}
