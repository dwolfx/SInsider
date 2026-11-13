import React from 'react';
import Link from 'next/link';
import { Article } from '@/types';
import { formatDate } from '@/lib/utils';
import styles from './ArticleCard.module.css';

interface ArticleHorizontalCardProps {
  article: Article;
}

export const ArticleHorizontalCard: React.FC<ArticleHorizontalCardProps> = ({ article }) => {
  const articleUrl = `/noticia/${article.slug}`;

  return (
    <article className={styles.horizontalCard}>
      <div className={styles.horizontalMediaWrapper}>
        <Link href={articleUrl} className={styles.titleLink}>
          <img
            src={article.coverImage}
            alt={article.title}
            className={styles.horizontalMediaImg}
          />
        </Link>
      </div>

      <div className={styles.horizontalBody}>
        <div>
          <div className={styles.heroHeaderRow}>
            <span className={styles.kicker}>{article.kicker}</span>
            <span aria-hidden="true">•</span>
            <span className={styles.date}>{article.category.name}</span>
          </div>

          <Link href={articleUrl} className={styles.titleLink}>
            <h3 className={styles.horizontalTitle}>{article.title}</h3>
          </Link>
        </div>

        <div className={styles.metaRow}>
          <span>{article.author.name}</span>
          <span>{formatDate(article.publishedAt)}</span>
        </div>
      </div>
    </article>
  );
};
