# Saúde Insider — Nova Arquitetura Digital Headless & SI-SEO

Portal de jornalismo analítico, inteligência regulatória e estratégia de negócios para quem decide os rumos da saúde no Brasil, acompanhado do motor proprietário **SI-SEO (Saúde Insider SEO Engine)**.

---

## 🚀 Stack Tecnológica & Decisões de Arquitetura

* **Framework Principal:** Next.js 15 (App Router) + TypeScript + Tailwind CSS
* **Motor de SEO (`si-seo/`):** Biblioteca React + TypeScript + CSS Modules e Plugin WordPress (Gutenberg) com análise on-page em tempo real, leiturabilidade Flesch PT-BR e retrocompatibilidade com Yoast SEO.
* **Testes Automatizados:** Vitest + React Testing Library + JSDOM (cobertura nos módulos críticos tanto do portal quanto do motor SI-SEO).
* **Design System Editorial:** Componentes atômicos e modulares estilizados sob os padrões de publicações globais de referência (*Financial Times*, *Endpoints News*, *Business Insider*).
* **Portabilidade para Mobile e Apps:**
  * 100% responsivo para navegadores móveis.
  * Compatível com empacotamento nativo via **Capacitor** ou migração direta de componentes e lógica para **React Native / Expo**.

---

## 📦 Estrutura do Repositório

```text
Saude Insider/
├── src/                                 # Código-fonte do Portal Next.js 15
│   ├── app/
│   │   ├── (public)/                    # Capa, Matéria Completa ([slug]) e Editorias
│   │   └── admin/                       # Dashboard, Gestão Editorial, Publicador, Ads e RBAC
│   ├── components/                      # Componentes UI, Ads (IAB), Editorial, Layout e Admin
│   ├── core/ & types/                   # Tipagem estrita de Notícias, Usuários, Ads, Categorias
│   ├── lib/                             # API Adapter (Mock / WP REST API), SEO Schema.org, Utils
│   └── tests/                           # Suítes de testes do portal
├── si-seo/                              # Motor de SEO On-Page & Plugin WordPress (Gutenberg)
│   ├── plugin/si-seo.php                # Bootstrap do plugin WordPress e registro de metadados
│   ├── src/core/                        # Regras determinísticas de SEO e cálculo de Flesch PT-BR
│   ├── src/ui/                          # ScoreBadge, SerpPreview, Checklist, KeywordInput, SeoPanel
│   └── src/wordpress/                   # Integração com a Sidebar do Gutenberg
├── mapped_articles.json                 # Mapeamento estruturado de artigos e taxonomias
└── ARCHITECTURE.md                      # Documentação detalhada da arquitetura do ecossistema
```

---

## 🎯 Funcionalidades Atendidas

1. **Área Logada & Controle de Permissões (RBAC):**
   * Perfis: `SUPER_ADMIN`, `EDITOR_CHIEF`, `JOURNALIST`, `COMMERCIAL`.
   * Matriz granular de direitos (Criar, Publicar, Excluir, Gerir Ads, Gerir Usuários, Ver Métricas).

2. **Publicidade & Monetização:**
   * Slots responsivos em posições nobres: `header_billboard` (970x90/728x90), `sidebar_rectangle` (300x250/300x600), `in_article_fluid` (728x180) e `bottom_banner`.
   * Identificação de conteúdo patrocinado e banners de anunciantes diretos ou mídia programática.

3. **SEO Estruturado & Motor `si-seo`:**
   * Injeção de metadados dinâmicos e Schema.org (`NewsArticle`, `NewsMediaOrganization`).
   * Simulador em tempo real de snippet do Google (Desktop e Mobile), checklist de palavra-chave e cálculo de leiturabilidade Flesch adaptado ao português brasileiro.

4. **Padronização para Acelerar a Redação:**
   * Modelos rápidos com um clique: *Furo Urgente*, *Grande Entrevista*, *Análise de Mercado*, *Healthtech & IA*.
   * Cálculo automático de tempo de leitura e geração de slugs amigáveis.

---

## 🛠️ Comandos de Desenvolvimento

### Portal Principal (Raiz)
```bash
# Instalar dependências
npm install

# Executar em modo desenvolvimento (Porta 3030)
npm run dev

# Executar suíte completa de testes
npm test

# Executar build de produção
npm run build
```

### Motor / Plugin SI-SEO (`./si-seo`)
```bash
cd si-seo
npm install
npm test
npm run build
```

Veja mais detalhes técnicos em [ARCHITECTURE.md](./ARCHITECTURE.md) e em [si-seo/README.md](./si-seo/README.md).
