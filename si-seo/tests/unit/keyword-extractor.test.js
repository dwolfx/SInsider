import { describe, it } from 'node:test';
import assert from 'node:assert/strict';

import { extractSuggestedKeywords } from '../../src/engine/keyword-extractor.js';
import { PRESETS } from '../../src/data/presets.js';

describe('Keyword Extractor (Smart Chips)', () => {
  it('extrai termos relevantes filtrando stop words em português', () => {
    const title = 'Vitamina D e a Imunidade';
    const content = 'A vitamina d fortalece o sistema imunológico e previne osteoporose.';

    const suggestions = extractSuggestedKeywords(title, content, 5);

    assert.ok(suggestions.length > 0);
    // Deve sugerir "vitamina d"
    const hasVitaminaD = suggestions.some((s) => s.includes('vitamina d'));
    assert.equal(hasVitaminaD, true);
  });

  it('extrai as palavras-chave da matéria de Ômega 3 do vídeo', () => {
    const { title, content } = PRESETS.intermediate;
    const suggestions = extractSuggestedKeywords(title, content, 5);

    assert.ok(suggestions.length > 0);
    const hasOmega3 = suggestions.some((s) => s.includes('omega 3') || s.includes('omega'));
    assert.equal(hasOmega3, true);
  });

  it('extrai termos compostos da matéria de Varejo Farmacêutico do Saúde Insider', () => {
    const { title, content } = PRESETS.realNews1;
    const suggestions = extractSuggestedKeywords(title, content, 5);

    assert.ok(suggestions.length > 0);
    const hasVarejo = suggestions.some((s) => s.includes('varejo farmaceutico') || s.includes('varejo'));
    assert.equal(hasVarejo, true);
  });
});
