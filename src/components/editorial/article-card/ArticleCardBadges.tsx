import React from 'react';
import { Badge } from '@/components/ui/Badge';
import styles from './ArticleCard.module.css';

interface ArticleCardBadgesProps {
  kicker?: string;
  categoryName?: string;
  isBreaking?: boolean;
}

export const ArticleCardBadges: React.FC<ArticleCardBadgesProps> = ({
  kicker,
  categoryName,
  isBreaking,
}) => {
  return (
    <div className={styles.heroHeaderRow}>
      {kicker && <span className={styles.kicker}>{kicker}</span>}
      {categoryName && (
        <>
          <span aria-hidden="true">•</span>
          <Badge variant="brand">{categoryName}</Badge>
        </>
      )}
      {isBreaking && (
        <Badge variant="danger">
          URGENTE
        </Badge>
      )}
    </div>
  );
};
