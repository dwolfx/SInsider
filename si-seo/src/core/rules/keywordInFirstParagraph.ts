import { SeoAnalysisInput, SeoRuleResult } from '../types';
import { textContainsKeyword } from '../textUtils';

export function checkKeywordInFirstParagraph(input: SeoAnalysisInput): SeoRuleResult {
  const keyword = input.focusKeyword.trim();
  const rawContent = input.content.trim();

  if (!keyword || !rawContent) {
    return {
      id: 'keyword-first-paragraph',
      name: 'Palavra-chave no Início do Conteúdo',
      category: 'basic',
      status: 'error',
      scoreImpact: 0,
      message: 'Conteúdo ou palavra-chave não informados.',
      recommendation: 'Escreva a matéria e insira a palavra-chave nos primeiros parágrafos.',
    };
  }

  // Pega aproximadamente os primeiros 10% ou os primeiros 300 caracteres
  const sampleLength = Math.max(300, Math.floor(rawContent.length * 0.15));
  const introduction = rawContent.slice(0, sampleLength);

  if (textContainsKeyword(introduction, keyword)) {
    return {
      id: 'keyword-first-paragraph',
      name: 'Palavra-chave no Início do Conteúdo',
      category: 'basic',
      status: 'success',
      scoreImpact: 10,
      message: 'A palavra-chave foco aparece logo no primeiro parágrafo.',
      recommendation: 'Excelente prática para confirmar o tema ao leitor e aos motores de busca.',
    };
  }

  return {
    id: 'keyword-first-paragraph',
    name: 'Palavra-chave no Início do Conteúdo',
    category: 'basic',
    status: 'warning',
    scoreImpact: 4,
    message: 'A palavra-chave foco não aparece logo na introdução.',
    recommendation: `Mencione "${input.focusKeyword}" nas primeiras 2 a 3 linhas da matéria.`,
  };
}
