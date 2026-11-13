import React from 'react';
import { Article } from '@/types';
import {
  ArticleHeroCard,
  ArticleGridCard,
  ArticleHorizontalCard,
  ArticleCompactCard,
} from './article-card';

export interface ArticleCardProps {
  article: Article;
  variant?: 'hero' | 'grid' | 'horizontal' | 'compact';
}

export const ArticleCard: React.FC<ArticleCardProps> = ({
  article,
  variant = 'grid',
}) => {
  switch (variant) {
    case 'hero':
      return <ArticleHeroCard article={article} />;
    case 'horizontal':
      return <ArticleHorizontalCard article={article} />;
    case 'compact':
      return <ArticleCompactCard article={article} />;
    case 'grid':
    default:
      return <ArticleGridCard article={article} />;
  }
};

export * from './article-card';
