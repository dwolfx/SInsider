# 🚀 SI-SEO (Saúde Insider SEO Engine)

Motor de análise on-page e linter de SEO em tempo real desenvolvido especialmente para o **Saúde Insider**. Funciona tanto como um **Plugin nativo do WordPress (Gutenberg)** em React quanto como uma **biblioteca modular de componentes** para aplicações React / Next.js modernas.

---

## 🎯 Principais Recursos

- **Score 0 a 100 Dinâmico:** Avaliação em tempo real de boas práticas de ranqueamento.
- **Leiturabilidade Flesch PT-BR:** Cálculo calibrado especificamente para o idioma português brasileiro.
- **Prévia SERP do Google (Desktop & Mobile):** Visualização fiel do snippet de pesquisa com contador de caracteres.
- **Checklist Interativo:** Diagnósticos objetivos de presença de palavra-chave (título, slug, meta descrição, H2/H3, alt de imagens, densidade e introdução).
- **Retrocompatibilidade com Yoast SEO:** Lê e grava nos mesmos campos de meta (`_yoast_wpseo_*`) para você não perder nada do acervo existente do portal.
- **Sem Dependência de Tailwind ou CSS Inline:** 100% construído com **CSS Modules** e Design Tokens escaláveis.

---

## 📁 Estrutura do Projeto

```
C:/sites/si-seo/
├── package.json
├── tsconfig.json
├── vite.config.ts
├── vitest.config.ts
├── plugin/
│   └── si-seo.php             # Plugin PHP para ativar dentro do WordPress
├── src/
│   ├── styles/
│   │   └── tokens.module.css  # Design tokens e variáveis visuais
│   ├── core/                  # Motor de regras determinísticas em TypeScript puro
│   │   ├── types.ts
│   │   ├── engine.ts          # Orquestrador do cálculo do score
│   │   ├── rules/             # Regras isoladas e modulares
│   │   └── __tests__/         # Suíte de testes unitários 100% em PT-BR
│   ├── ui/                    # Componentes React reutilizáveis com CSS Modules
│   │   ├── ScoreBadge/
│   │   ├── SerpPreview/
│   │   ├── Checklist/
│   │   ├── KeywordInput/
│   │   └── SeoPanel/
│   └── wordpress/             # Integração com a Sidebar do Gutenberg
```

---

## 🛠️ Comandos Rápidos

```bash
# Instalar dependências
npm install

# Rodar todos os testes unitários (Vitest)
npm run test

# Modo de desenvolvimento
npm run dev

# Compilar para produção (gera os arquivos para o WordPress e React)
npm run build
```

---

## 🔌 Como usar no WordPress (Gutenberg)

1. Execute `npm run build`.
2. Copie a pasta `si-seo` para a pasta de plugins do seu WordPress:  
   `wp-content/plugins/si-seo/`
3. Vá no painel do WordPress em **Plugins** e clique em **Ativar**.
4. Ao editar qualquer matéria no Saúde Insider, abra a barra lateral direita para ver o painel **SI-SEO** ativo!
