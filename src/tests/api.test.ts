import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest';
import {
  getArticles,
  getAllArticlesForAdmin,
  getArticleBySlug,
  getFeaturedArticles,
  getBreakingNews,
  getArticlesByCategory,
  createArticle,
  updateArticleStatus,
  deleteArticle,
  getCategories,
  getCategoryBySlug,
  getUsers,
  getUserById,
  updateUserRole,
  getAdsByPlacement,
  getAllAds,
  toggleAdStatus,
  WP_API_CONFIG,
} from '@/lib/api';

describe('Testes de Integração da Camada de Dados e Editorial (API)', () => {
  it('recupera a lista de matérias publicadas', async () => {
    const articles = await getArticles();
    expect(articles.length).toBeGreaterThan(0);
    articles.forEach((a) => expect(a.status).toBe('published'));
  });

  it('recupera um artigo único pelo slug a partir da memória', async () => {
    const articles = await getArticles();
    const firstSlug = articles[0].slug;
    const article = await getArticleBySlug(firstSlug);
    expect(article).not.toBeNull();
    expect(article?.slug).toBe(firstSlug);
  });

  it('recupera todas as matérias para a visão administrativa incluindo rascunhos', async () => {
    const all = await getAllArticlesForAdmin();
    expect(all.length).toBeGreaterThanOrEqual(1);
    expect(all[0].id).toBeDefined();
  });

  it('filtra matérias em destaque com precisão', async () => {
    const featured = await getFeaturedArticles();
    expect(Array.isArray(featured)).toBe(true);
    featured.forEach((art) => {
      expect(art.isFeatured).toBe(true);
      expect(art.status).toBe('published');
    });
  });

  it('recupera a notícia de plantão urgente (breaking news)', async () => {
    const breaking = await getBreakingNews();
    expect(breaking).not.toBeNull();
  });

  it('recupera matérias filtradas pelo slug da categoria', async () => {
    const categories = await getCategories();
    const catSlug = categories[0].slug;
    const articles = await getArticlesByCategory(catSlug);
    expect(Array.isArray(articles)).toBe(true);
    articles.forEach((art) => {
      expect(art.category.slug).toBe(catSlug);
    });

    const emptyList = await getArticlesByCategory('categoria-inexistente');
    expect(emptyList).toEqual([]);
  });

  it('cria uma nova matéria com propriedades autocalculadas e persiste em memória', async () => {
    const newArticle = await createArticle({
      title: 'Hospital Sírio-Libanês anuncia nova unidade focada em oncologia de precisão',
      kicker: 'INVESTIMENTO',
      subtitle: 'Com aporte de R$ 350 milhões, centro terá aceleradores lineares com IA.',
      content: '<p>O Hospital Sírio-Libanês detalhou os planos de expansão hospitalar...</p>',
      categorySlug: 'negocios',
      status: 'published',
      authorId: 'usr-1',
      tags: ['Hospitais', 'Oncologia'],
    });

    expect(newArticle.id).toBeDefined();
    expect(newArticle.slug).toBe(
      'hospital-sirio-libanes-anuncia-nova-unidade-focada-em-oncologia-de-precisao'
    );
    expect(newArticle.readingTimeMinutes).toBeGreaterThanOrEqual(1);
    expect(newArticle.seo.metaTitle).toContain('Hospital Sírio-Libanês');

    const fetched = await getArticleBySlug(newArticle.slug);
    expect(fetched).not.toBeNull();
    expect(fetched?.title).toBe(newArticle.title);
  });

  it('atualiza o status da matéria e retorna falso para identificador inexistente', async () => {
    const article = (await getArticles())[0];
    const updated = await updateArticleStatus(article.id, 'review');
    expect(updated).toBe(true);

    const failUpdate = await updateArticleStatus('id-inexistente-xyz', 'published');
    expect(failUpdate).toBe(false);
  });

  it('remove uma matéria e retorna verdadeiro, ou falso caso não seja encontrada', async () => {
    const created = await createArticle({
      title: 'Artigo Para Ser Deletado Imediatamente',
      kicker: 'TESTE',
      subtitle: 'Subtítulo temporário para teste de remoção.',
      content: '<p>Conteúdo temporário</p>',
      categorySlug: 'negocios',
      status: 'draft',
      authorId: 'usr-1',
    });

    const deleted = await deleteArticle(created.id);
    expect(deleted).toBe(true);

    const reDelete = await deleteArticle('id-totalmente-inexistente');
    expect(reDelete).toBe(false);
  });

  it('recupera lista de categorias e busca categoria individual pelo slug', async () => {
    const categories = await getCategories();
    expect(categories.length).toBeGreaterThan(0);

    const first = categories[0];
    const found = await getCategoryBySlug(first.slug);
    expect(found).not.toBeNull();
    expect(found?.slug).toBe(first.slug);

    const notFound = await getCategoryBySlug('slug-inexistente-12345');
    expect(notFound).toBeNull();
  });

  it('recupera lista de usuários e busca usuário individual pelo identificador', async () => {
    const users = await getUsers();
    expect(users.length).toBeGreaterThan(0);

    const user = await getUserById(users[0].id);
    expect(user).not.toBeNull();
    expect(user?.id).toBe(users[0].id);

    const notFoundUser = await getUserById('usuario-inexistente');
    expect(notFoundUser).toBeNull();
  });

  it('atualiza o papel do usuário em todos os níveis com verificação da matriz de RBAC', async () => {
    const user = await getUserById('usr-3');
    expect(user).not.toBeNull();

    // SUPER_ADMIN
    await updateUserRole('usr-3', 'SUPER_ADMIN');
    expect(user?.role).toBe('SUPER_ADMIN');
    expect(user?.permissions.canManageUsers).toBe(true);
    expect(user?.permissions.canPublishArticle).toBe(true);

    // EDITOR_CHIEF
    await updateUserRole('usr-3', 'EDITOR_CHIEF');
    expect(user?.role).toBe('EDITOR_CHIEF');
    expect(user?.permissions.canManageUsers).toBe(false);
    expect(user?.permissions.canPublishArticle).toBe(true);
    expect(user?.permissions.canManageAds).toBe(true);

    // JOURNALIST
    await updateUserRole('usr-3', 'JOURNALIST');
    expect(user?.role).toBe('JOURNALIST');
    expect(user?.permissions.canCreateArticle).toBe(true);
    expect(user?.permissions.canPublishArticle).toBe(false);
    expect(user?.permissions.canManageAds).toBe(false);

    // COMMERCIAL
    await updateUserRole('usr-3', 'COMMERCIAL');
    expect(user?.role).toBe('COMMERCIAL');
    expect(user?.permissions.canCreateArticle).toBe(false);
    expect(user?.permissions.canManageAds).toBe(true);

    // Usuário desconhecido
    const res = await updateUserRole('usuario-fantasma', 'JOURNALIST');
    expect(res).toBe(false);
  });

  it('gerencia unidades publicitárias e alterna status ativo/inativo', async () => {
    const allAds = await getAllAds();
    expect(allAds.length).toBeGreaterThan(0);

    const targetAd = allAds[0];
    const initialStatus = targetAd.active;

    const toggled = await toggleAdStatus(targetAd.id);
    expect(toggled).toBe(true);
    expect(targetAd.active).toBe(!initialStatus);

    // Retorna ao status inicial
    await toggleAdStatus(targetAd.id);
    expect(targetAd.active).toBe(initialStatus);

    const invalidToggle = await toggleAdStatus('ad-inexistente-xyz');
    expect(invalidToggle).toBe(false);
  });

  it('recupera unidade de anúncio pela posição editorial', async () => {
    const ad = await getAdsByPlacement('header_billboard');
    if (ad) {
      expect(ad.placement).toBe('header_billboard');
      expect(ad.active).toBe(true);
    }
  });

  describe('Integração de Fallback com a API do WordPress', () => {
    const originalFetch = global.fetch;

    afterEach(() => {
      global.fetch = originalFetch;
    });

    it('recorre à API do WordPress quando o artigo não existe localmente e mapeia seus campos', async () => {
      const mockWpPost = {
        id: 9999,
        slug: 'wp-noticia-remota-teste',
        title: { rendered: 'Notícia Vinda Direto do WordPress &amp; Exclusiva' },
        content: { rendered: '<p>Conteúdo retornado da API WP.</p>' },
        excerpt: { rendered: '<p>Resumo da notícia remota...</p>' },
        date: '2026-11-07T12:00:00',
        modified: '2026-11-07T13:00:00',
        _embedded: {
          author: [{ name: 'Correspondente Brasília' }],
          'wp:featuredmedia': [{ source_url: 'https://images.unsplash.com/remote.jpg' }],
        },
      };

      global.fetch = vi.fn().mockResolvedValue({
        ok: true,
        json: async () => [mockWpPost],
      } as Response);

      const article = await getArticleBySlug('wp-noticia-remota-teste');
      expect(article).not.toBeNull();
      expect(article?.id).toBe('wp-9999');
      expect(article?.title).toBe('Notícia Vinda Direto do WordPress  Exclusiva');
      expect(article?.author.name).toBe('Correspondente Brasília');
      expect(article?.coverImage).toBe('https://images.unsplash.com/remote.jpg');
    });

    it('trata erros de conexão da API do WordPress de forma resiliente e retorna nulo', async () => {
      global.fetch = vi.fn().mockRejectedValue(new Error('Network error connecting to WP'));

      const article = await getArticleBySlug('artigo-que-da-erro-de-rede');
      expect(article).toBeNull();
    });

    it('retorna nulo caso a API do WordPress retorne uma lista vazia de resultados', async () => {
      global.fetch = vi.fn().mockResolvedValue({
        ok: true,
        json: async () => [],
      } as Response);

      const article = await getArticleBySlug('artigo-nao-encontrado-nem-no-wp');
      expect(article).toBeNull();
    });
  });
});
