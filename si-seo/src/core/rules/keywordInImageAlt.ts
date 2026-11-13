import { SeoAnalysisInput, SeoRuleResult } from '../types';
import { textContainsKeyword } from '../textUtils';

export function checkKeywordInImageAlt(input: SeoAnalysisInput): SeoRuleResult {
  const keyword = input.focusKeyword.trim();
  const alts = input.imageAlts || [];

  // Extrai alts do HTML se não vieram estruturados
  const extractedAlts = alts.length > 0
    ? alts
    : (input.content.match(/<img[^>]+alt=["'](.*?)["']/gi) || [])
        .map((img) => {
          const match = img.match(/alt=["'](.*?)["']/i);
          return match ? match[1].trim() : '';
        });

  if (extractedAlts.length === 0) {
    return {
      id: 'keyword-image-alt',
      name: 'Texto Alternativo das Imagens (Alt)',
      category: 'additional',
      status: 'warning',
      scoreImpact: 3,
      message: 'Nenhuma imagem foi detectada no conteúdo.',
      recommendation: 'Adicione imagens ilustrativas ou gráficos com descrições alt adequadas.',
    };
  }

  const hasKeywordInAlt = extractedAlts.some((alt) => textContainsKeyword(alt, keyword));

  if (hasKeywordInAlt) {
    return {
      id: 'keyword-image-alt',
      name: 'Texto Alternativo das Imagens (Alt)',
      category: 'additional',
      status: 'success',
      scoreImpact: 10,
      message: 'Pelo menos uma imagem contém a palavra-chave no texto alternativo (alt).',
      recommendation: 'Ajuda na indexação no Google Imagens e na acessibilidade.',
    };
  }

  return {
    id: 'keyword-image-alt',
    name: 'Texto Alternativo das Imagens (Alt)',
    category: 'additional',
    status: 'warning',
    scoreImpact: 5,
    message: 'Nenhuma imagem possui a palavra-chave foco no atributo alt.',
    recommendation: `Atualize o texto alternativo de uma das imagens com "${input.focusKeyword}".`,
  };
}
