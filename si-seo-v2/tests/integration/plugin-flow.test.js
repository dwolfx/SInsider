import { describe, it } from 'node:test';
import assert from 'node:assert/strict';

import { runSeoAnalysis } from '../../src/engine/seo-analyzer.js';
import { extractSuggestedKeywords } from '../../src/engine/keyword-extractor.js';
import { PRESETS } from '../../src/data/presets.js';

describe('Integration Flow: End-to-End Post Editing & Analysis', () => {
  it('simula o redator digitando um novo artigo de saúde e recebendo insights reativos', () => {
    // 1. Redator começa com rascunho sem palavra-chave
    let draft = {
      title: 'Benefícios do Salmão e da Sardinha',
      slug: 'beneficios-peixes',
      desc: '',
      content: '<p>Comer peixe faz muito bem para a saúde do corpo.</p>',
      keyword: '',
    };

    let result1 = runSeoAnalysis(draft);
    assert.ok(result1.score < 50, 'Rascunho inicial incompleto deve ter nota baixa');

    // 2. O extrator sugere palavras-chave automáticas a partir do texto
    let suggestions = extractSuggestedKeywords(draft.title, draft.content, 5);
    assert.ok(suggestions.length > 0);

    // 3. Redator escolhe "salmão", expande o conteúdo com H2, alt tag e meta descrição
    draft.keyword = 'salmão';
    draft.title = 'Salmão: Conheça os Principais Benefícios para o Coração e Longevidade';
    draft.slug = 'salmao-beneficios-saude-do-coracao';
    draft.desc = 'Descubra como o consumo regular de salmão beneficia o coração e reduz o colesterol ruim com ômega 3 comprovado por médicos especialistas.';
    draft.content = `
      <h2>Por que o salmão é considerado um superalimento?</h2>
      <p>O <strong>salmão</strong> é uma das fontes mais ricas e biodisponíveis de ácidos graxos essenciais para o sistema cardiovascular humano.</p>
      <p>Estudos indicam que sua ingestão regular diminui processos inflamatórios crônicos e regula a circulação arterial de maneira expressiva.</p>
      <img src="https://images.unsplash.com/photo-1" alt="Filé fresco de salmão grelhado para refeição saudável rica em nutrientes" />
      <h2>Benefícios Comprovados do Salmão para o Corpo</h2>
      <p>Além da proteção cardíaca, as vitaminas do complexo B presentes no salmão auxiliam na cognição e na regeneração celular contínua.</p>
      <p>Portanto, incluir pelo menos duas porções semanais de peixe na dieta é uma estratégia nutricional altamente recomendada por médicos cardiologistas.</p>
      <p>O consumo regular melhora o perfil lipídico, eleva o colesterol bom e traz mais vitalidade para os treinos diários e atividades profissionais.</p>
      <p>Para quem busca praticidade, o preparo assado com ervas finas preserva os nutrientes sem adicionar gorduras saturadas prejudiciais ao organismo.</p>
      <p>Converse com seu nutricionista para alinhar a frequência ideal de consumo de frutos do mar de acordo com seu objetivo individual de saúde e bem-estar.</p>
      <p>Com hábitos simples e regulares, o salmão se torna um poderoso aliado na prevenção de eventos cardíacos severos e no equilíbrio metabólico.</p>
      <p>Priorize peixes frescos de procedência confiável para garantir a máxima pureza nutricional em todas as suas refeições em família.</p>
      <p>Invista na sua longevidade com escolhas conscientes que trazem sabor, equilíbrio e proteção duradoura para o seu sistema circulatório.</p>
    `;

    let result2 = runSeoAnalysis(draft);

    // A nota deve ter subido expressivamente após as correções
    assert.ok(result2.score > result1.score, 'A pontuação deve aumentar após otimizações');
    assert.ok(result2.score >= 80, `Esperado score >= 80, obtido: ${result2.score}`);
  });

  it('verifica que a matéria real do Saúde Insider tem consistência de análise', () => {
    const analysis = runSeoAnalysis(PRESETS.realNews1);
    assert.ok(analysis.score >= 70, `Score esperado >= 70, obtido: ${analysis.score}`);
    assert.ok(analysis.metrics.wordCount > 100);
    assert.ok(['good', 'moderate'].includes(analysis.statusClass));
  });
});
