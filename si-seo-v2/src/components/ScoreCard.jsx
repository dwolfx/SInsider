import React from 'react';

export const ScoreCard = ({ analysis }) => {
  const { score, statusLabel, statusClass, metrics } = analysis;

  return (
    <div className="si-score-card">
      <div className="si-score-header">
        <div className={`si-score-circle ${statusClass}`}>
          {score}
        </div>
        <div className="si-score-info">
          <span className="si-score-title">Pontuação SI-SEO</span>
          <span className="si-score-subtitle">{statusLabel}</span>
        </div>
      </div>

      <div className="si-metrics-row">
        <div className="si-metric-box">
          <span className="si-metric-val">{metrics.wordCount}</span>
          <span className="si-metric-label">Palavras</span>
        </div>

        <div className="si-metric-box">
          <span className="si-metric-val">{metrics.density}%</span>
          <span className="si-metric-label">Densidade</span>
        </div>

        <div className="si-metric-box">
          <span className="si-metric-val">{metrics.fleschPt}/100</span>
          <span className="si-metric-label">Flesch PT</span>
        </div>
      </div>
    </div>
  );
};
