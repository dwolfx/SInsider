/**
 * Artigos Pré-Carregados para Testes em Tempo Real
 * Baseados no vídeo de referência e em matérias reais do Saúde Insider.
 */

export const PRESETS = {
  // Preset 1: Artigo Otimizado (Nota >= 95 / 100)
  optimized: {
    id: 'optimized',
    name: 'Artigo otimizado (100)',
    type: 'good',
    keyword: 'vitamina d',
    title: 'Vitamina D: Como a Suplementação Correta Fortalece a Imunidade e a Saúde Óssea',
    slug: 'vitamina-d-suplementacao-imunidade-saude-ossea',
    desc: 'Descubra como a vitamina d é essencial para a imunidade, absorção de cálcio e prevenção de doenças com doses seguras e comprovadas pela ciência.',
    content: `<h2>O que é a vitamina d e qual sua importância?</h2>
<p>A <strong>vitamina d</strong> é um nutriente vital para o organismo humano. Ela atua diretamente no fortalecimento da nossa imunidade. Além disso, ela facilita a fixação de cálcio nos ossos. Pesquisas médicas apontam que níveis adequados do nutriente reduzem infecções respiratórias comuns.</p>

<p>A principal fonte natural é a luz do sol. Quinze minutos de sol por dia já estimulam a síntese do composto na pele. Contudo, muitas pessoas trabalham em locais fechados e sofrem com a falta crônica dessa substância nos exames de rotina.</p>

<img src="https://images.unsplash.com/photo-1584308666744-24d5c474f2ae?w=800" alt="Cápsulas de vitamina d para suplementação diária com segurança" />

<h2>Benefícios Comprovados da Vitamina D para a Saúde</h2>
<p>A <strong>vitamina d</strong> melhora a defesa do corpo contra vírus e bactérias sazonais. Ela ativa células de defesa fundamentais para a saúde diária. Por outro lado, a carência desse elemento causa cansaço frequente e dores musculares persistentes.</p>

<p>Pessoas com níveis estáveis relatam mais disposição ao acordar. A integridade dos dentes também depende diretamente dessa regulação metabólica. Estudos recentes mostram benefícios claros para o coração, controle arterial e bom humor.</p>

<h2>Como Ingerir e Suplementar com Segurança</h2>
<p>Antes de iniciar qualquer dose de suplemento vitamínico, faça um exame laboratorial preventivo. O médico avalia a taxa sérica com precisão clínica. Dessa forma, ele prescreve a quantidade exata para o seu peso e idade.</p>

<p>O excesso de vitaminas pode sobrecarregar os rins. Portanto, nunca tome megadoses por conta própria sem respaldo profissional. Alimentos frescos como salmão, sardinha e ovos caipiras ajudam a complementar a dieta balanceada.</p>

<h2>Orientações Finais para o Seu Bem-Estar</h2>
<p>Mantenha hábitos simples e saudáveis no seu cotidiano. Tome sol pela manhã com regularidade e cuide da sua hidratação diária. A prática de atividades físicas ao ar livre potencializa a absorção de nutrientes vitais. A <strong>vitamina d</strong> equilibrada garante uma rotina mais ativa, vigorosa e protegida para toda a sua família ao longo dos anos.</p>`,
  },

  // Preset 2: Artigo Intermediário (~80) - Exatamente o do vídeo do Victor!
  intermediate: {
    id: 'intermediate',
    name: 'Artigo intermediário (~80)',
    type: 'moderate',
    keyword: 'ômega 3',
    title: 'Ômega 3: Como Este Suplemento Ajuda na Saúde do Coração',
    slug: 'omega-3-saude-coracao',
    desc: 'O ômega 3 traz benefícios comprovados para o sistema cardiovascular e controle do colesterol no organismo.',
    content: `<h2>O que é o Ômega 3?</h2>
<p>O <strong>ômega 3</strong> é um ácido graxo essencial que o corpo humano não consegue sintetizar por conta própria. Por esse motivo, sua ingestão deve ocorrer por meio da alimentação ou de suplementação orientada por médicos e nutricionistas.</p>

<p>Peixes de águas profundas, como salmão e sardinha, são fontes riquíssimas desse nutriente na forma de EPA e DHA. Sementes de chia e linhaça também oferecem ótimas concentrações vegetais de ácido alfa-linolênico (ALA).</p>

<img src="https://images.unsplash.com/photo-1584308666744-24d5c474f2ae?w=800" alt="Cápsulas douradas de suplemento alimentar" />

<h2>Benefícios para a Saúde Cardiovascular</h2>
<p>A ingestão regular de ácidos graxos atua diretamente na redução dos níveis de triglicerídeos e no aumento do HDL no sangue. Estudos indicam que o nutriente também auxilia na regulação da pressão arterial e na prevenção da formação de coágulos perigosos nas artérias.</p>

<p>Além disso, suas propriedades anti-inflamatórias protegem o tecido cardíaco contra o estresse oxidativo e o envelhecimento precoce. Médicos cardiologistas frequentemente recomendam sua inclusão na rotina para a prevenção de infartos.</p>

<h2>Como Tomar com Segurança</h2>
<p>A dosagem ideal varia de acordo com as necessidades individuais de cada paciente. Recomenda-se que a ingestão junto às principais refeições melhora a absorção dos ácidos graxos pelo trato digestivo.</p>`,
  },

  // Preset 3: Artigo com Falhas (Nota Baixa)
  failing: {
    id: 'failing',
    name: 'Artigo com falhas',
    type: 'poor',
    keyword: 'exercícios físicos',
    title: 'Dicas Rápidas de Saúde para o Seu Dia a Dia',
    slug: 'dicas-de-saude',
    desc: 'Dicas sobre saúde.',
    content: `<p>Cuidar da saúde é muito importante para viver bem e ter bastante disposição ao longo da semana.</p>
<p>Beba bastante água todos os dias e durma pelo menos 8 horas por noite para acordar com energia renovada.</p>`,
  },

  // Preset 4: Notícia Real do Saúde Insider 1
  realNews1: {
    id: 'realNews1',
    name: 'Notícia Real: Varejo Farmacêutico',
    type: 'good',
    keyword: 'varejo farmacêutico',
    title: 'Vendas digitais já respondem por até 46,6% do varejo farmacêutico, que projeta novos ganhos',
    slug: 'vendas-digitais-varejo-farmaceutico-ganhos-online',
    desc: 'O avanço das vendas online no varejo farmacêutico bate recorde e remodela a experiência dos consumidores em farmácias brasileiras segundo dados do setor.',
    content: `<h2>Aceleração dos Canais Digitais no Mercado Farmacêutico</h2>
<p>A consolidação do e-commerce transformou profundamente o <strong>varejo farmacêutico</strong> nos últimos três anos. Dados recentes do setor demonstram que redes de médio e grande porte já registram até 46,6% do seu faturamento originado em canais virtuais, incluindo aplicativos próprios e serviços de delivery rápido.</p>

<p>Além da conveniência da entrega expressa em poucas horas, a integração de programas de fidelidade e descontos personalizados tem sido decisiva para fidelizar o consumidor que busca medicamentos contínuos e produtos de higiene pessoal.</p>

<img src="https://images.unsplash.com/photo-1576602976047-174e57a47881?w=800" alt="Aplicativo de farmácia com entrega expressa do varejo farmacêutico" />

<h2>Investimentos em Logística e Experiência Omnichannel</h2>
<p>Para sustentar essa expansão acelerada, as principais empresas do <strong>varejo farmacêutico</strong> estão convertendo suas lojas físicas em hubs avançados de distribuição urbana (dark stores parciais).</p>

<p>Com isso, a expectativa de analistas de mercado é que a fatia digital continue crescendo em ritmo superior a dois dígitos ao ano, estabelecendo um novo padrão competitivo de atendimento ágil.</p>`,
  },
};
