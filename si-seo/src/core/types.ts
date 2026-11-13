export type RuleStatus = 'success' | 'warning' | 'error';

export type RuleCategory = 'basic' | 'readability' | 'advanced' | 'additional';

export interface SeoRuleResult {
  id: string;
  name: string;
  category: RuleCategory;
  status: RuleStatus;
  scoreImpact: number;
  message: string;
  recommendation: string;
}

export interface SeoAnalysisInput {
  focusKeyword: string;
  title: string;
  slug: string;
  metaDescription: string;
  content: string;
  headings?: string[];
  imageAlts?: string[];
}

export interface SeoReport {
  overallScore: number;
  status: RuleStatus;
  passedCount: number;
  warningCount: number;
  errorCount: number;
  results: SeoRuleResult[];
  statistics: {
    wordCount: number;
    sentenceCount: number;
    paragraphCount: number;
    keywordDensityPercent: number;
    fleschScore: number;
    readingTimeMinutes: number;
    internalLinksCount: number;
    externalLinksCount: number;
  };
}
