# SI-SEO (Saúde Insider SEO) 🚀

Plugin profissional de SEO on-page, legibilidade Flesch PT e auditoria jornalística para WordPress, desenvolvido especialmente para o **Saúde Insider**.

---

## 🌟 Funcionalidades Principais

- **Motor em Tempo Real Reativo (React):** Análise instantânea conforme o redator digita ou cola o texto.
- **Identificador Automático de Palavras-Chave (Chips Clicáveis):** Extrai termos mais fortes do artigo (n-grams) e exibe em tags para seleção com 1 clique.
- **Tolerância Total a Acentuações:** Normalização avançada em português (`mídia` == `midia`, `ômega 3` == `omega 3`). O destacador grifa preservando os acentos originais no texto.
- **Drawer Flutuante com Z-Index Alto:** Abre suavemente por cima do editor (`z-index: 99999`), sem quebrar o layout do Gutenberg.
- **16 Métricas Industriais:** H1, Slug, Meta Descrição, Lead Jornalístico, Densidade, Flesch PT-BR, Frases Curtas, Alt de Imagens, Subtítulos, etc.
- **Prévia no Google:** SERP Desktop e Mobile com contadores de caracteres (`55/60 carac.` e `106/160 carac.`).
- **Playground de Teste Dedicado:** Página embutida no wp-admin com presets de notícias reais do Saúde Insider e artigo de Ômega 3.
- **Zero Risco de Conflito:** Detecta se o Yoast SEO ou Rank Math já está ativo e evita duplicações no `<head>`.

---

## 📦 Como Instalar no WordPress

1. Baixe o arquivo gerado em: `dist-zip/si-seo.zip` (apenas ~73 KB).
2. No painel do seu WordPress, vá em **Plugins > Adicionar Novo > Enviar Plugin**.
3. Selecione o arquivo `si-seo.zip` e clique em **Instalar Agora**.
4. Clique em **Ativar Plugin**.

---

## 🛠️ Comandos de Desenvolvimento

```bash
# Rodar playground de desenvolvimento local (localhost:3333)
npm run dev

# Rodar todos os testes unitários e de integração
npm run test:all

# Compilar e gerar novo ZIP pronto para o WordPress
npm run package
```
