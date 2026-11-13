import React from 'react';
import Link from 'next/link';
import { Article } from '@/types';
import { Clock, Eye } from 'lucide-react';
import { ArticleCardBadges } from './ArticleCardBadges';
import { ArticleAuthorMeta } from './ArticleAuthorMeta';
import styles from './ArticleCard.module.css';

interface ArticleHeroCardProps {
  article: Article;
}

export const ArticleHeroCard: React.FC<ArticleHeroCardProps> = ({ article }) => {
  const articleUrl = `/noticia/${article.slug}`;

  return (
    <article className={styles.heroCard}>
      <div className={styles.heroContent}>
        <div>
          <ArticleCardBadges
            kicker={article.kicker}
            categoryName={article.category.name}
            isBreaking={article.isBreaking}
          />

          <Link href={articleUrl} className={styles.titleLink}>
            <h2 className={styles.heroTitle}>{article.title}</h2>
          </Link>

          <p className={styles.heroExcerpt}>
            {article.subtitle || article.excerpt}
          </p>
        </div>

        <div className={styles.metaRow}>
          <ArticleAuthorMeta
            authorName={article.author.name}
            avatarUrl={article.author.avatarUrl}
            publishedAt={article.publishedAt}
          />

          <div className={styles.statsRow}>
            <span className={styles.statItem}>
              <Clock className="w-3.5 h-3.5" />
              {article.readingTimeMinutes} min de leitura
            </span>
            <span className={styles.statItem}>
              <Eye className="w-3.5 h-3.5" />
              {article.views.toLocaleString('pt-BR')}
            </span>
          </div>
        </div>
      </div>

      <div className={styles.heroMediaWrapper}>
        <Link href={articleUrl} className={styles.titleLink}>
          <img
            src={article.coverImage}
            alt={article.title}
            className={styles.heroMediaImg}
          />
        </Link>
      </div>
    </article>
  );
};
