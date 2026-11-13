import { describe, it, expect } from 'vitest';
import { analyzeSeo } from '../engine';
import { SeoAnalysisInput } from '../types';
import { sampleGoodPost, sampleMediumPost, sampleBadPost } from '../../demo/presets';

describe('Motor de Análise de SEO (SI-SEO Engine)', () => {
  it('deve retornar pontuação máxima (acima de 80) e status de sucesso para um artigo perfeitamente otimizado', () => {
    const paragrafoCorpo = '<p>O setor avança com regras claras no país. Novas normas garantem mais transparência para todos. A gestão hospitalar adota boas práticas de governança. O paciente ganha mais agilidade no cuidado diário.</p>';
    const conteudoCompleto = `
      <h2>Panorama da saúde suplementar no Brasil</h2>
      <p>A saúde suplementar no país demanda rigor técnico e acompanhamento permanente da ANS para proteger beneficiários e operadoras.</p>
      ${paragrafoCorpo.repeat(8)}
      <h2>Diretrizes da ANS para a saúde suplementar</h2>
      <p>As novas diretrizes da saúde suplementar definem metas diretas de conformidade. Cada operadora ajusta seus processos com agilidade e foco no usuário.</p>
      ${paragrafoCorpo.repeat(8)}
      <h2>Perspectivas futuras e inovação</h2>
      <p>O futuro da saúde suplementar combina inovação clínica e cuidado preventivo. Todas as equipes trabalham juntas pelo setor.</p>
      ${paragrafoCorpo.repeat(6)}
    `;

    const input: SeoAnalysisInput = {
      focusKeyword: 'saúde suplementar',
      title: 'Saúde suplementar: novas regras e impactos para o setor',
      slug: 'saude-suplementar-novas-regras',
      metaDescription: 'Confira as mudanças na saúde suplementar com foco na regulação da ANS, impacto financeiro para operadoras e direitos dos beneficiários.',
      content: conteudoCompleto,
      headings: ['Panorama da saúde suplementar no Brasil', 'Diretrizes da ANS para a saúde suplementar', 'Perspectivas futuras e inovação'],
      imageAlts: ['Gráfico da saúde suplementar no Brasil'],
    };

    const relatorio = analyzeSeo(input);

    expect(relatorio.overallScore).toBeGreaterThanOrEqual(80);
    expect(relatorio.status).toBe('success');
    expect(relatorio.passedCount).toBeGreaterThan(6);
    expect(relatorio.errorCount).toBe(0);
    expect(relatorio.statistics.keywordDensityPercent).toBeGreaterThan(0.3);
    expect(relatorio.statistics.wordCount).toBeGreaterThanOrEqual(600);
  });

  it('deve avaliar o artigo de demonstração com nota máxima (100% verde)', () => {
    const relatorio = analyzeSeo(sampleGoodPost);
    expect(relatorio.overallScore).toBe(100);
    expect(relatorio.status).toBe('success');
    expect(relatorio.errorCount).toBe(0);
    expect(relatorio.warningCount).toBe(0);
    expect(relatorio.passedCount).toBe(12);
  });

  it('deve avaliar o artigo intermediário com nota próxima de 80 e alertas construtivos', () => {
    const relatorio = analyzeSeo(sampleMediumPost);
    expect(relatorio.overallScore).toBeGreaterThanOrEqual(70);
    expect(relatorio.overallScore).toBeLessThanOrEqual(88);
    expect(relatorio.warningCount).toBeGreaterThan(0);
  });

  it('deve avaliar o artigo ruim com pontuação baixa e múltiplos erros', () => {
    const relatorio = analyzeSeo(sampleBadPost);
    expect(relatorio.overallScore).toBeLessThan(50);
    expect(relatorio.status).toBe('error');
    expect(relatorio.errorCount).toBeGreaterThan(2);
  });

  it('deve penalizar e retornar status de erro quando a matéria não tiver palavra-chave nem conteúdo', () => {
    const inputVazio: SeoAnalysisInput = {
      focusKeyword: '',
      title: '',
      slug: '',
      metaDescription: '',
      content: '',
    };

    const relatorio = analyzeSeo(inputVazio);

    expect(relatorio.overallScore).toBeLessThan(40);
    expect(relatorio.status).toBe('error');
    expect(relatorio.errorCount).toBeGreaterThan(3);
    expect(relatorio.statistics.wordCount).toBe(0);
  });

  it('deve detectar ausência da palavra-chave no título e sugerir correção', () => {
    const inputSemPalavraNoTitulo: SeoAnalysisInput = {
      focusKeyword: 'telemedicina',
      title: 'Avanços tecnológicos nos hospitais brasileiros',
      slug: 'avancos-tecnologicos-hospitais',
      metaDescription: 'A telemedicina cresce no Brasil e amplia o atendimento remoto em clínicas e hospitais privados.',
      content: 'A telemedicina permitiu expandir atendimentos médicos em diversas regiões do país de forma rápida.',
    };

    const relatorio = analyzeSeo(inputSemPalavraNoTitulo);
    const regraTitulo = relatorio.results.find((r) => r.id === 'keyword-in-title');

    expect(regraTitulo).toBeDefined();
    expect(regraTitulo?.status).toBe('error');
    expect(regraTitulo?.message).toContain('não foi encontrada no título');
  });
});
