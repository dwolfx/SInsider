import { SeoAnalysisInput, SeoRuleResult } from '../types';

export function checkKeywordInSlug(input: SeoAnalysisInput): SeoRuleResult {
  const keyword = input.focusKeyword
    .trim()
    .toLowerCase()
    .normalize('NFD')
    .replace(/[\u0300-\u036f]/g, '')
    .replace(/[^a-z0-9]+/g, '-');

  const slug = input.slug
    .trim()
    .toLowerCase()
    .normalize('NFD')
    .replace(/[\u0300-\u036f]/g, '');

  if (!keyword || !slug) {
    return {
      id: 'keyword-in-slug',
      name: 'Palavra-chave na URL (Slug)',
      category: 'basic',
      status: 'error',
      scoreImpact: 0,
      message: 'Slug ou palavra-chave não definidos.',
      recommendation: 'Configure a URL amigável contendo a palavra-chave foco.',
    };
  }

  const isPresent = slug.includes(keyword);

  if (isPresent) {
    return {
      id: 'keyword-in-slug',
      name: 'Palavra-chave na URL (Slug)',
      category: 'basic',
      status: 'success',
      scoreImpact: 10,
      message: 'A palavra-chave foco está presente na URL amigável.',
      recommendation: 'Mantenha URLs curtas e objetivas.',
    };
  }

  return {
    id: 'keyword-in-slug',
    name: 'Palavra-chave na URL (Slug)',
    category: 'basic',
    status: 'error',
    scoreImpact: 0,
    message: 'A palavra-chave foco não está na URL.',
    recommendation: `Adicione termos da palavra-chave "${input.focusKeyword}" no slug da publicação.`,
  };
}
