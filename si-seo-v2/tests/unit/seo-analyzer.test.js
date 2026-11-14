import { describe, it } from 'node:test';
import assert from 'node:assert/strict';

import { runSeoAnalysis } from '../../src/engine/seo-analyzer.js';
import { PRESETS } from '../../src/data/presets.js';

describe('SEO Engine Analysis & Scoring', () => {
  it('avalia o preset otimizado com nota >= 90 (good)', () => {
    const analysis = runSeoAnalysis(PRESETS.optimized);

    assert.ok(analysis.score >= 90, `Score esperado >= 90, obtido: ${analysis.score}`);
    assert.equal(analysis.statusClass, 'good');
    assert.equal(analysis.statusLabel, 'Artigo otimizado');
  });

  it('avalia a matéria de Ômega 3 do vídeo na faixa intermediária (~75 a ~85)', () => {
    const analysis = runSeoAnalysis(PRESETS.intermediate);

    assert.ok(
      analysis.score >= 70 && analysis.score <= 88,
      `Score esperado entre 70 e 88, obtido: ${analysis.score}`
    );
    assert.equal(analysis.statusClass, 'moderate');
    assert.equal(analysis.statusLabel, 'Otimização moderada');
    assert.ok(analysis.metrics.wordCount >= 150);
  });

  it('avalia o artigo com falhas com nota baixa (< 60 / poor)', () => {
    const analysis = runSeoAnalysis(PRESETS.failing);

    assert.ok(analysis.score < 60, `Score esperado < 60, obtido: ${analysis.score}`);
    assert.equal(analysis.statusClass, 'poor');
    assert.equal(analysis.statusLabel, 'Com falhas');
  });

  it('detecta os critérios individualmente na matéria de Ômega 3', () => {
    const analysis = runSeoAnalysis(PRESETS.intermediate);
    const checksMap = new Map(analysis.checks.map((c) => [c.id, c]));

    // Palavra-chave no título (H1) -> Sucesso
    assert.equal(checksMap.get('keyword_in_title').status, 'good');

    // Palavra-chave no slug -> Sucesso
    assert.equal(checksMap.get('keyword_in_slug').status, 'good');

    // Meta descrição -> Alerta (106 caracteres, abaixo de 120)
    assert.equal(checksMap.get('meta_description').status, 'moderate');

    // Tamanho do conteúdo -> Erro (abaixo de 300 palavras)
    assert.equal(checksMap.get('content_length').status, 'poor');

    // Imagens sem alt da palavra-chave -> Alerta
    assert.equal(checksMap.get('image_alts').status, 'moderate');
  });
});
