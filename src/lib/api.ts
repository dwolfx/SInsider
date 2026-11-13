import { Article, Category, User, AdUnit, AdPlacement, ArticleStatus } from '@/types';
import { MOCK_ARTICLES, MOCK_CATEGORIES, MOCK_USERS, MOCK_ADS, MOCK_TAGS } from './mock-data';
import { slugify, calculateReadingTime } from './utils';

// State container in memory (simulating DB/CMS backend)
let articlesDb: Article[] = [...MOCK_ARTICLES];
let categoriesDb: Category[] = [...MOCK_CATEGORIES];
let usersDb: User[] = [...MOCK_USERS];
let adsDb: AdUnit[] = [...MOCK_ADS];

export const WP_API_CONFIG = {
  baseUrl: process.env.NEXT_PUBLIC_WP_API_URL || 'https://saudeinsider.com.br/wp-json/wp/v2',
  useLiveWp: process.env.NEXT_PUBLIC_USE_LIVE_WP === 'true',
};

// ================= ARTICLES =================
export async function getArticles(): Promise<Article[]> {
  return articlesDb.filter((a) => a.status === 'published');
}

export async function getAllArticlesForAdmin(): Promise<Article[]> {
  return articlesDb;
}

export async function getArticleBySlug(slug: string): Promise<Article | null> {
  const local = articlesDb.find((a) => a.slug === slug);
  if (local) return local;

  // Try live WordPress fallback automatically for any post
  try {
    const res = await fetch(`${WP_API_CONFIG.baseUrl}/posts?slug=${slug}&_embed`, {
      next: { revalidate: 60 },
    });
    if (res.ok) {
      const posts = await res.json();
      if (posts && posts.length > 0) {
        const wpPost = posts[0];
        const mapped = mapWpPostToArticle(wpPost);
        articlesDb.push(mapped);
        return mapped;
      }
    }
  } catch (e) {
    console.warn('Fallback WP fetch error:', e);
  }

  return null;
}

export async function getFeaturedArticles(): Promise<Article[]> {
  const published = articlesDb.filter((a) => a.status === 'published');
  return published.filter((a) => a.isFeatured);
}

export async function getBreakingNews(): Promise<Article | null> {
  const breaking = articlesDb.find((a) => a.isBreaking && a.status === 'published');
  return breaking || articlesDb[0] || null;
}

export async function getArticlesByCategory(categorySlug: string): Promise<Article[]> {
  return articlesDb.filter(
    (a) => a.category.slug === categorySlug && a.status === 'published'
  );
}

export async function createArticle(input: {
  title: string;
  kicker: string;
  subtitle: string;
  content: string;
  categorySlug: string;
  coverImage?: string;
  status: ArticleStatus;
  isFeatured?: boolean;
  isBreaking?: boolean;
  authorId: string;
  tags?: string[];
}): Promise<Article> {
  const author = usersDb.find((u) => u.id === input.authorId) || usersDb[0];
  const category = categoriesDb.find((c) => c.slug === input.categorySlug) || categoriesDb[0];
  const slug = slugify(input.title);

  const newArticle: Article = {
    id: `art-${Date.now()}`,
    slug,
    title: input.title,
    kicker: input.kicker || 'NOTÍCIA',
    subtitle: input.subtitle,
    content: input.content,
    excerpt: input.subtitle.slice(0, 160) + '...',
    coverImage: input.coverImage || 'https://images.unsplash.com/photo-1505751172876-fa1923c5c528?w=1200&auto=format&fit=crop&q=80',
    coverImageCaption: 'Redação Saúde Insider',
    author: {
      id: author.id,
      name: author.name,
      role: author.bio || 'Redação Saúde Insider',
      avatarUrl: author.avatarUrl,
    },
    category,
    tags: (input.tags || ['Saúde']).map((t) => ({ id: slugify(t), name: t, slug: slugify(t) })),
    status: input.status,
    publishedAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
    readingTimeMinutes: calculateReadingTime(input.content),
    views: 0,
    isFeatured: !!input.isFeatured,
    isBreaking: !!input.isBreaking,
    seo: {
      metaTitle: `${input.title} | Saúde Insider`,
      metaDescription: input.subtitle,
      keywords: [category.name, ...(input.tags || [])],
    },
  };

  articlesDb.unshift(newArticle);
  return newArticle;
}

export async function updateArticleStatus(id: string, status: ArticleStatus): Promise<boolean> {
  const index = articlesDb.findIndex((a) => a.id === id);
  if (index !== -1) {
    articlesDb[index].status = status;
    articlesDb[index].updatedAt = new Date().toISOString();
    return true;
  }
  return false;
}

export async function deleteArticle(id: string): Promise<boolean> {
  const initialLen = articlesDb.length;
  articlesDb = articlesDb.filter((a) => a.id !== id);
  return articlesDb.length < initialLen;
}

// ================= CATEGORIES =================
export async function getCategories(): Promise<Category[]> {
  return categoriesDb;
}

export async function getCategoryBySlug(slug: string): Promise<Category | null> {
  const normalized = slug.toLowerCase().trim();
  const local = categoriesDb.find((c) => c.slug.toLowerCase() === normalized);
  if (local) return local;

  try {
    const res = await fetch(`https://saudeinsider.com.br/wp-json/wp/v2/categories?slug=${encodeURIComponent(normalized)}`);
    if (res.ok) {
      const data = await res.json();
      if (Array.isArray(data) && data.length > 0) {
        const item = data[0];
        const newCat: Category = {
          id: `cat-${item.slug}`,
          name: item.name,
          slug: item.slug,
          description: item.description || `Notícias e análises sobre ${item.name}`,
          colorHex: '#7a0f16',
        };
        categoriesDb.push(newCat);
        return newCat;
      }
    }
  } catch {
    // Network fallback error handled gracefully
  }

  return null;
}

// ================= USERS & PERMISSIONS =================
export async function getUsers(): Promise<User[]> {
  return usersDb;
}

export async function getUserById(id: string): Promise<User | null> {
  return usersDb.find((u) => u.id === id) || null;
}

export async function updateUserRole(userId: string, role: User['role']): Promise<boolean> {
  const user = usersDb.find((u) => u.id === userId);
  if (!user) return false;

  user.role = role;
  // Apply role-based default permissions
  switch (role) {
    case 'SUPER_ADMIN':
      user.permissions = {
        canCreateArticle: true,
        canPublishArticle: true,
        canDeleteArticle: true,
        canManageUsers: true,
        canManageAds: true,
        canViewAnalytics: true,
      };
      break;
    case 'EDITOR_CHIEF':
      user.permissions = {
        canCreateArticle: true,
        canPublishArticle: true,
        canDeleteArticle: true,
        canManageUsers: false,
        canManageAds: true,
        canViewAnalytics: true,
      };
      break;
    case 'JOURNALIST':
      user.permissions = {
        canCreateArticle: true,
        canPublishArticle: false,
        canDeleteArticle: false,
        canManageUsers: false,
        canManageAds: false,
        canViewAnalytics: false,
      };
      break;
    case 'COMMERCIAL':
      user.permissions = {
        canCreateArticle: false,
        canPublishArticle: false,
        canDeleteArticle: false,
        canManageUsers: false,
        canManageAds: true,
        canViewAnalytics: true,
      };
      break;
  }
  return true;
}

// ================= ADS =================
export async function getAdsByPlacement(placement: AdPlacement): Promise<AdUnit | null> {
  const activeAds = adsDb.filter((a) => a.placement === placement && a.active);
  if (activeAds.length === 0) return null;
  // Pick random or first active ad
  return activeAds[Math.floor(Math.random() * activeAds.length)];
}

export async function getAllAds(): Promise<AdUnit[]> {
  return adsDb;
}

export async function toggleAdStatus(adId: string): Promise<boolean> {
  const ad = adsDb.find((a) => a.id === adId);
  if (ad) {
    ad.active = !ad.active;
    return true;
  }
  return false;
}

// Helper to map WordPress API post to our schema
function mapWpPostToArticle(wpPost: any): Article {
  const title = wpPost.title?.rendered?.replace(/&[^;]+;/g, '') || 'Sem título';
  const content = wpPost.content?.rendered || '';
  const excerpt = wpPost.excerpt?.rendered?.replace(/<[^>]+>/g, '').slice(0, 160) || '';
  const mediaUrl =
    wpPost._embedded?.['wp:featuredmedia']?.[0]?.source_url ||
    'https://images.unsplash.com/photo-1576091160399-112ba8d25d1d?w=1200&auto=format&fit=crop&q=80';

  return {
    id: `wp-${wpPost.id}`,
    slug: wpPost.slug,
    title,
    kicker: 'SAÚDE INSIDER',
    subtitle: excerpt,
    content,
    excerpt,
    coverImage: mediaUrl,
    author: {
      id: 'usr-wp',
      name: wpPost._embedded?.author?.[0]?.name || 'Redação Saúde Insider',
      role: 'Equipe Editorial',
      avatarUrl: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=150&auto=format&fit=crop&q=80',
    },
    category: MOCK_CATEGORIES[0],
    tags: [MOCK_TAGS[0]],
    status: 'published',
    publishedAt: wpPost.date,
    updatedAt: wpPost.modified,
    readingTimeMinutes: calculateReadingTime(content),
    views: 1200,
    seo: {
      metaTitle: `${title} | Saúde Insider`,
      metaDescription: excerpt,
      keywords: ['saúde', 'saúde insider'],
    },
  };
}
