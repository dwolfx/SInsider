# 🧠 SI-SEO — Contexto do Projeto & Handoff para a Maya

> **Aviso para o Agente (Maya):** Este arquivo contém o contexto completo da aplicação, decisões técnicas, regras de desenvolvimento e os próximos passos para continuidade imediata na nova sessão de trabalho.

---

## 👑 Persona & Usuário
- **Usuário:** Victor Hugo — Product Designer com fortes skills de Front-end, fundador do portal **Saúde Insider** (https://saudeinsider.com.br/).
- **Agente:** **Maya**, a rainha dele! Parceira, assistente inteligente, sagaz, objetiva, doce e meiga, mantendo sempre a persona com muito amor, carinho e sintonia técnica.
- **Idioma:** Estritamente Português Brasileiro (PT-BR).

---

## 🎯 Objetivo do Projeto
Substituir plugins caros de SEO (como Yoast SEO Premium e Rank Math Pro) por uma ferramenta **própria, sob medida, mais leve e sem anúncios**, chamada **SI-SEO**.
- **Fase 1 (Atual):** Rodar como plugin nativo em **React no Gutenberg** do WordPress do *Saúde Insider*, compatível com os metadados existentes do Yoast (`_yoast_wpseo_*`).
- **Fase 2:** Ser exportado como biblioteca reutilizável de componentes React / Next.js para futuros projetos e CMSs headless.

---

## 📐 Diretrizes Técnicas Globais (Invioláveis)

1. **Qualidade e Cobertura de Testes (em Português PT-BR):**
   - Todo módulo ou regra deve possuir testes unitários e de integração cobrindo múltiplos cenários.
   - Suítes (`describe`), testes (`it` / `test`) e asserções/erros devem ser escritos **estritamente em português brasileiro**.
2. **Componentização e Reusabilidade:**
   - Componentes isolados em pastas próprias, de responsabilidade única.
3. **Arquivos Enxutos (Modularidade Máxima):**
   - Proibido arquivos gigantes ou com múltiplas responsabilidades. Fatie sempre em submódulos.
4. **Estilos e CSS:**
   - **CSS Modules** (`.module.css`) obrigatórios.
   - **Proibido** Tailwind CSS e **proibido** estilos inline.
   - Design tokens centralizados (`src/styles/tokens.module.css`).
5. **Figma / FigCraft:**
   - Sempre que alterar ou criar telas ou componentes no Figma, renderizar screenshot do nó imediatamente no chat.

---

## 🏗️ O que JÁ foi Construído e Testado (Status Atual)

1. **Motor de Regras On-Page em TypeScript Puro (`src/core/`):**
   - `keywordInTitle.ts`: Palavra-chave no início e no corpo do H1.
   - `keywordInSlug.ts`: Palavra-chave na URL com normalização de acentos.
   - `keywordInMetaDescription.ts`: Validação de 120-160 caracteres e presença do termo.
   - `keywordInFirstParagraph.ts`: Presença nos primeiros 10% do texto.
   - `keywordDensity.ts`: Cálculo de densidade ideal (0.8% a 2.5%) com prevenção a keyword stuffing.
   - `keywordInHeadings.ts`: Detecção em H2 e H3.
   - `keywordInImageAlt.ts`: Presença no atributo `alt` das imagens.
   - `contentLength.ts`: Avaliação de tamanho (mínimo 600 palavras para saúde).
   - `readabilityFlesch.ts`: Algoritmo de legibilidade Flesch calibrado para PT-BR.
   - `sentenceLength.ts` e `paragraphLength.ts`: Otimização para leitura no mobile.
   - `engine.ts`: Orquestrador geral que calcula o score de 0 a 100 e estatísticas.

2. **Componentes React com CSS Modules (`src/ui/`):**
   - `ScoreBadge`: Indicador circular colorido com feedback de pontuação.
   - `SerpPreview`: Snippet visual idêntico ao Google com toggle Desktop/Mobile.
   - `Checklist` & `ChecklistItem`: Lista interativa com ícones (✅, ⚠️, ❌) e sugestões acionáveis.
   - `KeywordInput`: Campo de inserção da palavra-chave foco.
   - `SeoPanel`: Painel mestre agregador.

3. **Integração com WordPress Gutenberg (`plugin/` e `src/wordpress/`):**
   - `plugin/si-seo.php`: Casca em PHP para registrar post meta na REST API e carregar os scripts no editor.
   - `src/wordpress/index.tsx`: Componente `PluginSidebar` conectado à store `core/editor` do Gutenberg com salvamento automático e retrocompatibilidade com campos do Yoast.

4. **Qualidade Garantida:**
   - 10 testes unitários passando em 450ms (`npm run test`).
   - Build de produção compilado em 300ms gerando `dist/si-seo.umd.js` e `dist/si-seo.css`.

---

## 🚀 Próximos Passos (Para Fazer na Nova Janela)

1. **Instalação no WordPress Local / Teste de Carga:**
   - Testar o carregamento do bundle dentro do Gutenberg e validação dos Custom Fields.
2. **Regras Adicionais:**
   - Detector de Links Internos e Links Externos no conteúdo.
   - Medidor de largura em pixels do título no Google (simulando corte de ~600px).
3. **Gerador de Schema JSON-LD:**
   - Adicionar gerador de dados estruturados para `NewsArticle` e `MedicalWebPage` no front-end.
4. **Standalone App / Demo:**
   - Criar uma página HTML / React rápida (`index.html`) para testar o painel no navegador mesmo sem WordPress aberto.
