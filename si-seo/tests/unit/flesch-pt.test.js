import { describe, it } from 'node:test';
import assert from 'node:assert/strict';

import { calculateFleschPt, getFleschClassification } from '../../src/engine/flesch-pt.js';

describe('Flesch Reading Ease for Portuguese (Flesch-Martins)', () => {
  it('retorna pontuação delimitada entre 0 e 100', () => {
    const text = 'Texto simples com frases curtas e diretas. O leitor compreende facilmente.';
    const score = calculateFleschPt(text);

    assert.ok(score >= 0 && score <= 100);
  });

  it('dá nota maior para textos com frases curtas e diretas', () => {
    const easyText = 'O sol brilha. O dia está lindo. Beba água fresca. Viva com saúde.';
    const hardText = 'Inobstante as considerações pretéritas acerca da multiplicidade biológica, faz-se mister salientar a indispensabilidade de averiguações pormenorizadas.';

    const scoreEasy = calculateFleschPt(easyText);
    const scoreHard = calculateFleschPt(hardText);

    assert.ok(scoreEasy > scoreHard);
  });

  it('classifica corretamente os níveis de leitura', () => {
    assert.equal(getFleschClassification(85).status, 'good');
    assert.equal(getFleschClassification(50).status, 'moderate');
    assert.equal(getFleschClassification(25).status, 'poor');
  });
});
