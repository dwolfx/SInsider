import React from 'react';
import Link from 'next/link';
import { Article } from '@/types';
import { formatDate } from '@/lib/utils';
import styles from './ArticleCard.module.css';

interface ArticleCompactCardProps {
  article: Article;
}

export const ArticleCompactCard: React.FC<ArticleCompactCardProps> = ({ article }) => {
  const articleUrl = `/noticia/${article.slug}`;

  return (
    <article className={styles.compactCard}>
      <span className={styles.kicker}>{article.kicker}</span>
      <Link href={articleUrl} className={styles.titleLink}>
        <h4 className={styles.compactTitle}>{article.title}</h4>
      </Link>
      <div className={styles.compactMeta}>
        <span>{formatDate(article.publishedAt)}</span>
        <span aria-hidden="true">•</span>
        <span>{article.readingTimeMinutes} min</span>
      </div>
    </article>
  );
};
