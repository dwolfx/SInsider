import React from 'react';
import styles from './Checklist.module.css';
import { SeoRuleResult } from '../../core/types';
import { ChecklistItem } from './ChecklistItem';

interface ChecklistProps {
  results: SeoRuleResult[];
  focusKeyword?: string;
  activeHighlightKeyword?: string;
  onToggleHighlight?: (keyword: string) => void;
}

export const Checklist: React.FC<ChecklistProps> = ({
  results,
  focusKeyword,
  activeHighlightKeyword,
  onToggleHighlight,
}) => {
  return (
    <div className={styles.container}>
      {results.map((rule) => (
        <ChecklistItem
          key={rule.id}
          rule={rule}
          focusKeyword={focusKeyword}
          activeHighlightKeyword={activeHighlightKeyword}
          onToggleHighlight={onToggleHighlight}
        />
      ))}
    </div>
  );
};
