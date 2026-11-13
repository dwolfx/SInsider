import React from 'react';
import Link from 'next/link';
import { Article } from '@/types';
import { Badge } from '@/components/ui/Badge';
import { formatDate } from '@/lib/utils';
import styles from './ArticleCard.module.css';

interface ArticleGridCardProps {
  article: Article;
}

export const ArticleGridCard: React.FC<ArticleGridCardProps> = ({ article }) => {
  const articleUrl = `/noticia/${article.slug}`;

  return (
    <article className={styles.gridCard}>
      <div className={styles.gridMediaWrapper}>
        <Link href={articleUrl} className={styles.titleLink}>
          <img
            src={article.coverImage}
            alt={article.title}
            className={styles.gridMediaImg}
          />
        </Link>
        <div className={styles.gridBadgeWrapper}>
          <Badge variant="brand">{article.category.name}</Badge>
        </div>
      </div>

      <div className={styles.gridBody}>
        <div>
          <span className={styles.kicker}>{article.kicker}</span>
          <Link href={articleUrl} className={styles.titleLink}>
            <h3 className={styles.gridTitle}>{article.title}</h3>
          </Link>
          <p className={styles.gridExcerpt}>
            {article.subtitle || article.excerpt}
          </p>
        </div>

        <div className={styles.metaRow}>
          <span>{article.author.name}</span>
          <span>{formatDate(article.publishedAt)}</span>
        </div>
      </div>
    </article>
  );
};
