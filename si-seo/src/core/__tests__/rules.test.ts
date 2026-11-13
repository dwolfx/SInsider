import { describe, it, expect } from 'vitest';
import { checkKeywordInTitle } from '../rules/keywordInTitle';
import { checkKeywordInSlug } from '../rules/keywordInSlug';
import { checkKeywordInMetaDescription } from '../rules/keywordInMetaDescription';
import { checkKeywordDensity } from '../rules/keywordDensity';
import { checkContentLength } from '../rules/contentLength';
import { calculateFleschPtBr } from '../rules/readabilityFlesch';
import { checkLinksAudit } from '../rules/linksAudit';
import { generateNewsArticleSchema } from '../schemaNewsArticle';

describe('Suíte de Regras Individuais de SEO (PT-BR)', () => {
  describe('Regra: Palavra-chave no Slug', () => {
    it('deve aprovar quando o slug contiver os termos da palavra-chave normalizados', () => {
      const resultado = checkKeywordInSlug({
        focusKeyword: 'Inteligência Artificial',
        title: 'IA na Medicina',
        slug: 'inteligencia-artificial-na-medicina',
        metaDescription: '',
        content: '',
      });

      expect(resultado.status).toBe('success');
      expect(resultado.message).toContain('presente na URL');
    });

    it('deve reprovar quando o slug não contiver a palavra-chave', () => {
      const resultado = checkKeywordInSlug({
        focusKeyword: 'Inteligência Artificial',
        title: 'Medicina Moderna',
        slug: 'medicina-moderna-brasil',
        metaDescription: '',
        content: '',
      });

      expect(resultado.status).toBe('error');
      expect(resultado.message).toContain('não está na URL');
    });
  });

  describe('Regra: Meta Descrição', () => {
    it('deve aprovar com nota máxima quando tiver tamanho ideal (120-160 caracteres) e a palavra-chave', () => {
      const resultado = checkKeywordInMetaDescription({
        focusKeyword: 'planos de saúde',
        title: '',
        slug: '',
        metaDescription: 'Descubra como os novos modelos de planos de saúde estão redefinindo o acesso e a sustentabilidade dos hospitais privados em todo o país.',
        content: '',
      });

      expect(resultado.status).toBe('success');
      expect(resultado.scoreImpact).toBe(10);
    });

    it('deve emitir alerta quando contiver a palavra-chave mas for curta demais', () => {
      const resultado = checkKeywordInMetaDescription({
        focusKeyword: 'planos de saúde',
        title: '',
        slug: '',
        metaDescription: 'Artigo sobre planos de saúde no Brasil.',
        content: '',
      });

      expect(resultado.status).toBe('warning');
      expect(resultado.message).toContain('o ideal é 120-160');
    });
  });

  describe('Regra: Densidade e Tamanho do Conteúdo', () => {
    it('deve calcular corretamente a densidade da palavra-chave', () => {
      const resultado = checkKeywordDensity({
        focusKeyword: 'geriatria',
        title: '',
        slug: '',
        metaDescription: '',
        content: 'A geriatria é essencial para o cuidado do idoso. Na geriatria preventiva, a saúde melhora.',
      });

      expect(resultado.wordCount).toBeGreaterThan(10);
      expect(resultado.densityPercent).toBeGreaterThan(0);
    });

    it('deve aprovar artigos com 600 ou mais palavras', () => {
      const textoLongo = new Array(650).fill('saúde').join(' ');
      const resultado = checkContentLength({
        focusKeyword: 'saúde',
        title: '',
        slug: '',
        metaDescription: '',
        content: textoLongo,
      });

      expect(resultado.status).toBe('success');
      expect(resultado.message).toContain('650 palavras');
    });
  });

  describe('Regra: Legibilidade Flesch em Português', () => {
    it('deve calcular índice Flesch coerente para textos simples em português', () => {
      const textoSimples = 'A saúde é muito boa. O dia está claro e calmo. Todos gostam de viver bem.';
      const { score, sentenceCount, wordCount } = calculateFleschPtBr(textoSimples);

      expect(score).toBeGreaterThan(50);
      expect(sentenceCount).toBe(3);
      expect(wordCount).toBeGreaterThan(10);
    });
  });

  describe('Regra: Auditoria de Links Jornalísticos (E-E-A-T)', () => {
    it('deve aprovar quando houver links internos e fontes externas citadas', () => {
      const htmlComLinks = `
        <p>Conforme apurado em nossa <a href="/noticias/regulacao-ans">reportagem sobre a ANS</a>, o setor avança.</p>
        <p>Dados divulgados pelo <a href="https://anvisa.gov.br">portal da ANVISA</a> comprovam a eficácia.</p>
      `;

      const resultado = checkLinksAudit({
        focusKeyword: 'saúde',
        title: '',
        slug: '',
        metaDescription: '',
        content: htmlComLinks,
      });

      expect(resultado.status).toBe('success');
      expect(resultado.internalLinksCount).toBe(1);
      expect(resultado.externalLinksCount).toBe(1);
    });

    it('deve alertar quando faltar citação de fontes externas', () => {
      const htmlSoInterno = '<p>Veja mais no nosso <a href="/arquivo">portal</a>.</p>';

      const resultado = checkLinksAudit({
        focusKeyword: 'saúde',
        title: '',
        slug: '',
        metaDescription: '',
        content: htmlSoInterno,
      });

      expect(resultado.status).toBe('warning');
      expect(resultado.message).toContain('nenhuma citação a fontes externas');
    });
  });

  describe('Módulo: Gerador de Dados Estruturados Schema NewsArticle', () => {
    it('deve gerar payload JSON-LD compatível com Google News em português', () => {
      const schema = generateNewsArticleSchema({
        focusKeyword: 'saúde suplementar',
        title: 'Novas regras da ANS para operadoras',
        slug: 'novas-regras-ans-operadoras',
        metaDescription: 'Análise detalhada das novas normas do setor de saúde.',
        content: '',
      });

      expect(schema['@type']).toBe('NewsArticle');
      expect(schema.headline).toBe('Novas regras da ANS para operadoras');
      expect(schema.publisher.name).toBe('Saúde Insider');
      expect(schema.inLanguage).toBe('pt-BR');
    });
  });

  describe('Tolerância a Acentos e Diacríticos (Equivalência Semântica do Google)', () => {
    it('deve reconhecer que "beneficios" e "benefícios" são a mesma palavra no título', () => {
      const resultado = checkKeywordInTitle({
        focusKeyword: 'beneficios do cha',
        title: 'Benefícios do Chá de Camomila Comprovados',
        slug: '',
        metaDescription: '',
        content: '',
      });

      expect(resultado.status).toBe('success');
      expect(resultado.scoreImpact).toBeGreaterThanOrEqual(12);
    });

    it('deve contabilizar densidade corretamente mesmo quando a palavra-chave não tiver acento e o texto tiver', () => {
      const texto = 'Muitos estudos mostram os benefícios para a saúde. Estes benefícios são duradouros e trazem benefícios reais.';
      const resultado = checkKeywordDensity({
        focusKeyword: 'beneficios',
        title: '',
        slug: '',
        metaDescription: '',
        content: texto,
      });

      expect(resultado.occurrences ?? resultado.message).toContain('3 vezes');
    });
  });
});
