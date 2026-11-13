# Arquitetura do Ecossistema Saúde Insider

Este documento descreve a organização técnica do repositório **Saúde Insider**, que unifica o **Portal Headless (Next.js 15)**, os **Scripts de Ingestão/Mapeamento WordPress** e o motor **SI-SEO (`./si-seo`)**.

---

## 1. Portal Headless (`src/`)

Construído em **Next.js 15 (App Router)** com **TypeScript** e **Tailwind CSS**, o portal separa a experiência pública de leitura de alta performance da área administrativa da redação:

- **Camada Pública (`src/app/(public)`):**
  - Renderização otimizada para Core Web Vitals e Google News.
  - Geração automática de JSON-LD (`NewsArticle`, `BreadcrumbList`, `NewsMediaOrganization`) via `src/lib/seo.ts`.
  - Slots de publicidade IAB (`src/components/ads/`) com tamanhos responsivos e fallback.
- **Painel Editorial & Admin (`src/app/admin`):**
  - Controle de acesso baseado em papéis (`RBAC`) em `src/app/admin/usuarios`.
  - Editor de matérias com templates pré-configurados e pré-visualização de SEO.
- **Integração de Dados (`src/lib/api.ts`):**
  - Camada adaptadora capaz de consumir a REST API do WordPress em tempo real ou operar sobre dados mapeados localmente (`mapped_articles.json`).

---

## 2. Motor SI-SEO (`si-seo/`)

Subprojeto independente e desacoplado localizado na pasta `si-seo/`:

- **`si-seo/src/core/`**: Motor determinístico em TypeScript puro (zero dependências externas de UI) que avalia:
  - Presença da palavra-chave em foco (título SEO, H1, primeiro parágrafo, subtítulos H2/H3, slug, meta description e atributos `alt`).
  - Densidade de palavra-chave, comprimento do texto, links internos e externos.
  - Índice de Facilidade de Leitura de Flesch calibrado para o português brasileiro.
- **`si-seo/src/ui/`**: Componentes visuais modulares (`SeoPanel`, `ScoreBadge`, `SerpPreview`, `Checklist`, `KeywordInput`) estilizados com CSS Modules (`tokens.module.css`).
- **`si-seo/plugin/si-seo.php` & `si-seo/src/wordpress/`**: Empacotamento como plugin nativo para a sidebar do editor Gutenberg no WordPress, sincronizado com os campos `_yoast_wpseo_focuskw`, `_yoast_wpseo_title` e `_yoast_wpseo_metadesc`.

---

## 3. Utilitários de Inspeção e Migração (Raiz)

Na raiz do projeto encontram-se scripts Node.js utilizados durante a engenharia reversa, mapeamento de taxonomias e validação da estrutura legada:

- `fetch_tax.js` / `fetch_formats.js`: Extração de categorias, tags e formatos da API.
- `check_models_direct.js` / `check_post_models.js`: Verificação da estrutura de posts e metadados.
- `inspect_header_fixo.js` / `inspect_nav_scroll.js` / `navigation.js` / `agenda.js`: Scripts de apoio para fidelidade visual de componentes e comportamento de navegação.
- `mapped_articles.json`: Snapshot de matérias reais mapeadas para testes e desenvolvimento local.
