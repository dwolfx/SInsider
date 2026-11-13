export type UserRole = 'SUPER_ADMIN' | 'EDITOR_CHIEF' | 'JOURNALIST' | 'COMMERCIAL';

export interface UserPermission {
  canCreateArticle: boolean;
  canPublishArticle: boolean;
  canDeleteArticle: boolean;
  canManageUsers: boolean;
  canManageAds: boolean;
  canViewAnalytics: boolean;
}

export type UserPermissions = UserPermission;

export interface User {
  id: string;
  name: string;
  email: string;
  role: UserRole;
  avatarUrl: string;
  bio?: string;
  permissions: UserPermission;
  active: boolean;
}

export type ArticleStatus = 'draft' | 'review' | 'scheduled' | 'published';

export type ArticleFormat = 
  | 'padrao'           // Matéria editorial padrão (792px, imagem horizontal, single.css)
  | 'entrevista'       // Grande Entrevista / Pingue-Pongue (foto vertical, Q&A, entrevista.css)
  | 'podcast'          // Episódio de Podcast com áudio e notas
  | 'cupula'           // Especial / Cobertura da Cúpula (banner de seção, cupula.css)
  | 'opiniao'          // Coluna de Opinião assinada com bio destacada
  | 'branded';         // Informe Publicitário / Branded Content

export interface Category {
  id: string;
  name: string;
  slug: string;
  description: string;
  colorHex: string;
}

export interface Tag {
  id: string;
  name: string;
  slug: string;
}

export interface ArticleSEO {
  metaTitle: string;
  metaDescription: string;
  canonicalUrl?: string;
  ogImageUrl?: string;
  keywords: string[];
}

export interface Article {
  id: string;
  slug: string;
  title: string;
  kicker: string; // Chapéu editorial (ex: "EXCLUSIVO", "REGULATÓRIO", "ENTREVISTAS")
  subtitle: string; // Linha fina (Standfirst)
  content: string;
  excerpt: string;
  coverImage: string;
  coverImageCaption?: string;
  author: {
    id: string;
    name: string;
    role: string;
    avatarUrl: string;
  };
  category: Category;
  tags: Tag[];
  format?: ArticleFormat; // Modelo / Padrão de publicação
  status: ArticleStatus;
  publishedAt: string;
  updatedAt: string;
  readingTimeMinutes: number;
  views: number;
  isFeatured?: boolean;
  isBreaking?: boolean;
  isSponsored?: boolean;
  sponsoredBy?: string;
  seo: ArticleSEO;
}

export type AdPlacement = 
  | 'header_billboard' 
  | 'sidebar_rectangle' 
  | 'in_article_fluid' 
  | 'bottom_banner';

export interface AdUnit {
  id: string;
  name: string;
  placement: AdPlacement;
  advertiser: string;
  imageUrl?: string;
  targetUrl?: string;
  htmlScript?: string;
  type: 'image' | 'script' | 'sponsored_post';
  active: boolean;
  views: number;
  clicks: number;
  startDate?: string;
  endDate?: string;
}
