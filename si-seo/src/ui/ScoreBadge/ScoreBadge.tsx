import React from 'react';
import styles from './ScoreBadge.module.css';
import { RuleStatus } from '../../core/types';

interface ScoreBadgeProps {
  score: number;
  status: RuleStatus;
  isPending?: boolean;
}

export const ScoreBadge: React.FC<ScoreBadgeProps> = ({ score, status, isPending = false }) => {
  const getBadgeClass = () => {
    if (isPending) return styles.badgePending;
    switch (status) {
      case 'success':
        return styles.badgeSuccess;
      case 'warning':
        return styles.badgeWarning;
      case 'error':
      default:
        return styles.badgeError;
    }
  };

  const getStatusLabel = () => {
    if (isPending) return 'Aguardando palavra-chave';
    if (score >= 80) return 'Excelente otimização';
    if (score >= 50) return 'Otimização moderada';
    return 'Precisa de melhorias';
  };

  return (
    <div className={styles.container}>
      <div className={`${styles.badge} ${getBadgeClass()}`}>
        {isPending ? '--' : score}
      </div>
      <div className={styles.info}>
        <h4 className={styles.title}>Pontuação SI-SEO</h4>
        <p className={styles.description}>{getStatusLabel()}</p>
      </div>
    </div>
  );
};
