import { describe, it } from 'node:test';
import assert from 'node:assert/strict';

import {
  stripAccents,
  normalizeText,
  containsNormalized,
  countOccurrencesNormalized,
  slugify,
  extractWords,
  extractSentences,
  countSyllablesPt,
} from '../../src/engine/text-normalizer.js';

describe('Text Normalizer & Portuguese Accents', () => {
  it('remove acentos corretamente preservando as letras base', () => {
    assert.equal(stripAccents('mídia'), 'midia');
    assert.equal(stripAccents('ômega 3'), 'omega 3');
    assert.equal(stripAccents('saúde'), 'saude');
    assert.equal(stripAccents('coração'), 'coracao');
    assert.equal(stripAccents('farmacêutico'), 'farmaceutico');
  });

  it('identifica termos idênticos com ou sem acentos (mídia == midia)', () => {
    const textComAcento = 'A expansão da mídia digital transformou o setor.';
    const textSemAcento = 'A expansao da midia digital transformou o setor.';

    assert.equal(containsNormalized(textComAcento, 'midia'), true);
    assert.equal(containsNormalized(textComAcento, 'mídia'), true);
    assert.equal(containsNormalized(textSemAcento, 'midia'), true);
    assert.equal(containsNormalized(textSemAcento, 'mídia'), true);
  });

  it('conta ocorrências ignorando acentuação e maiúsculas', () => {
    const text = 'O Ômega 3 é incrível. Consuma ômega 3 diariamente e omega 3 em cápsulas.';
    assert.equal(countOccurrencesNormalized(text, 'omega 3'), 3);
    assert.equal(countOccurrencesNormalized(text, 'ômega 3'), 3);
  });

  it('gera slugs amigáveis limpando acentos e pontuação', () => {
    assert.equal(slugify('Ômega 3: Saúde do Coração!'), 'omega-3-saude-do-coracao');
    assert.equal(slugify('Vendas no Varejo Farmacêutico 2026'), 'vendas-no-varejo-farmaceutico-2026');
  });

  it('extrai palavras e sentenças com acentuação preservada', () => {
    const sample = 'O ômega 3 protege o coração. Médicos recomendam peixes de águas profundas!';
    const words = extractWords(sample);
    const sentences = extractSentences(sample);

    assert.ok(words.includes('ômega'));
    assert.ok(words.includes('coração'));
    assert.equal(sentences.length, 2);
  });

  it('calcula sílabas em português com aproximação correta', () => {
    assert.equal(countSyllablesPt('banana'), 3);
    assert.equal(countSyllablesPt('casa'), 2);
    assert.equal(countSyllablesPt('sol'), 1);
  });
});
