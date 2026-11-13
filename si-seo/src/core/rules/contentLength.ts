import { SeoAnalysisInput, SeoRuleResult } from '../types';
import { calculateWordCount } from './keywordDensity';

export function checkContentLength(input: SeoAnalysisInput): SeoRuleResult {
  const count = calculateWordCount(input.content);

  if (count >= 450) {
    return {
      id: 'content-length',
      name: 'Tamanho do Conteúdo',
      category: 'basic',
      status: 'success',
      scoreImpact: 15,
      message: `Artigo aprofundado com ${count} palavras.`,
      recommendation: 'Excelente profundidade de conteúdo para saúde e jornalismo regulatório.',
    };
  }

  if (count >= 250) {
    return {
      id: 'content-length',
      name: 'Tamanho do Conteúdo',
      category: 'basic',
      status: 'warning',
      scoreImpact: 8,
      message: `Conteúdo com ${count} palavras (mínimo recomendado: 450 palavras).`,
      recommendation: 'Aprofunde a análise ou traga mais dados para enriquecer a matéria.',
    };
  }

  return {
    id: 'content-length',
    name: 'Tamanho do Conteúdo',
    category: 'basic',
    status: 'error',
    scoreImpact: 0,
    message: `Texto muito curto (${count} palavras). Artigos com menos de 300 palavras têm baixa relevância.`,
    recommendation: 'Escreva um texto mais completo para esclarecer o leitor e ranquear bem.',
  };
}
