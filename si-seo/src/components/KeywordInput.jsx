import React from 'react';

export const KeywordInput = ({
  keyword,
  onChangeKeyword,
  suggestedKeywords = [],
}) => {
  return (
    <div className="si-keyword-section">
      <div className="si-form-group">
        <label className="si-label" htmlFor="si-focus-keyword">
          Palavra-chave Foco
        </label>
        <input
          id="si-focus-keyword"
          type="text"
          className="si-input"
          value={keyword}
          onChange={(e) => onChangeKeyword(e.target.value)}
          placeholder="Ex: ômega 3, vitamina d, pressão alta..."
        />
        <span className="si-hint">
          O termo principal pelo qual você quer que a matéria seja encontrada.
        </span>
      </div>

      {suggestedKeywords.length > 0 && (
        <div className="si-chips-container">
          <span className="si-chip-label">
            Sugestões automáticas no texto (clique para selecionar):
          </span>
          {suggestedKeywords.map((term) => {
            const isSelected = keyword.toLowerCase() === term.toLowerCase();
            return (
              <button
                key={term}
                type="button"
                className={`si-chip-btn ${isSelected ? 'is-selected' : ''}`}
                onClick={() => onChangeKeyword(term)}
                title={`Definir "${term}" como palavra-chave foco`}
              >
                {term}
              </button>
            );
          })}
        </div>
      )}
    </div>
  );
};
