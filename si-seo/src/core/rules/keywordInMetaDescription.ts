import { SeoAnalysisInput, SeoRuleResult } from '../types';
import { textContainsKeyword } from '../textUtils';

export function checkKeywordInMetaDescription(input: SeoAnalysisInput): SeoRuleResult {
  const keyword = input.focusKeyword.trim();
  const desc = input.metaDescription.trim();

  if (!desc) {
    return {
      id: 'keyword-in-meta-desc',
      name: 'Meta Descrição',
      category: 'basic',
      status: 'error',
      scoreImpact: 0,
      message: 'A meta descrição ainda não foi preenchida.',
      recommendation: 'Escreva uma meta descrição entre 120 e 160 caracteres com a palavra-chave.',
    };
  }

  const length = desc.length;
  const containsKeyword = keyword ? textContainsKeyword(desc, keyword) : false;

  if (containsKeyword && length >= 120 && length <= 160) {
    return {
      id: 'keyword-in-meta-desc',
      name: 'Meta Descrição',
      category: 'basic',
      status: 'success',
      scoreImpact: 10,
      message: 'Meta descrição excelente! Contém a palavra-chave e tamanho ideal.',
      recommendation: 'Perfeito para atrair cliques na página de resultados de busca.',
    };
  }

  if (containsKeyword) {
    return {
      id: 'keyword-in-meta-desc',
      name: 'Meta Descrição',
      category: 'basic',
      status: 'warning',
      scoreImpact: 7,
      message: `Contém a palavra-chave, mas tem ${length} caracteres (o ideal é 120-160).`,
      recommendation: length < 120 ? 'Aumente um pouco a descrição para informar melhor o leitor.' : 'Encurte para evitar que o Google corte o texto com reticências.',
    };
  }

  return {
    id: 'keyword-in-meta-desc',
    name: 'Meta Descrição',
    category: 'basic',
    status: 'error',
    scoreImpact: 0,
    message: 'A palavra-chave foco não está na meta descrição.',
    recommendation: `Inclua "${input.focusKeyword}" naturalmente na meta descrição.`,
  };
}
