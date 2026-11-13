import { SeoAnalysisInput, SeoRuleResult } from '../types';
import { textContainsKeyword, textStartsWithKeyword } from '../textUtils';

export function checkKeywordInTitle(input: SeoAnalysisInput): SeoRuleResult {
  const keyword = input.focusKeyword.trim();
  const title = input.title.trim();

  if (!keyword) {
    return {
      id: 'keyword-in-title',
      name: 'Palavra-chave no Título',
      category: 'basic',
      status: 'error',
      scoreImpact: 0,
      message: 'Nenhuma palavra-chave foco foi informada.',
      recommendation: 'Defina uma palavra-chave foco para a matéria.',
    };
  }

  if (!title) {
    return {
      id: 'keyword-in-title',
      name: 'Palavra-chave no Título',
      category: 'basic',
      status: 'error',
      scoreImpact: 0,
      message: 'O título do artigo está vazio.',
      recommendation: 'Escreva um título atraente contendo a palavra-chave foco.',
    };
  }

  const containsKeyword = textContainsKeyword(title, keyword);
  const startsWithKeyword = textStartsWithKeyword(title, keyword);

  if (startsWithKeyword) {
    return {
      id: 'keyword-in-title',
      name: 'Palavra-chave no Título',
      category: 'basic',
      status: 'success',
      scoreImpact: 15,
      message: 'Excelente! A palavra-chave foco está no início do título.',
      recommendation: 'Mantenha essa estrutura para obter máximo destaque no Google.',
    };
  }

  if (containsKeyword) {
    return {
      id: 'keyword-in-title',
      name: 'Palavra-chave no Título',
      category: 'basic',
      status: 'success',
      scoreImpact: 12,
      message: 'A palavra-chave foco está presente no título.',
      recommendation: 'Se possível, posicione-a mais próxima do início para maior relevância.',
    };
  }

  return {
    id: 'keyword-in-title',
    name: 'Palavra-chave no Título',
    category: 'basic',
    status: 'error',
    scoreImpact: 0,
    message: 'A palavra-chave foco não foi encontrada no título.',
    recommendation: `Inclua "${input.focusKeyword}" no título principal do artigo.`,
  };
}
