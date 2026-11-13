import React from 'react';
import { formatDate } from '@/lib/utils';
import styles from './ArticleCard.module.css';

interface ArticleAuthorMetaProps {
  authorName: string;
  avatarUrl?: string;
  publishedAt: string;
}

export const ArticleAuthorMeta: React.FC<ArticleAuthorMetaProps> = ({
  authorName,
  avatarUrl,
  publishedAt,
}) => {
  return (
    <div className={styles.authorBlock}>
      {avatarUrl && (
        <img
          src={avatarUrl}
          alt={authorName}
          className={styles.avatar}
        />
      )}
      <div>
        <span className={styles.authorName}>{authorName}</span>
        <span className={styles.date}>{formatDate(publishedAt)}</span>
      </div>
    </div>
  );
};
