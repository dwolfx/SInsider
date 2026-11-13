import React, { useState } from 'react';
import styles from './SerpPreview.module.css';

interface SerpPreviewProps {
  title: string;
  slug: string;
  metaDescription: string;
}

const MAX_TITLE_CHARS = 60;
const MAX_DESC_CHARS = 160;
const OFFICIAL_FAVICON_URL = 'https://saudeinsider.com.br/wp-content/uploads/2026/08/favicon-si-32x32.png';

export const SerpPreview: React.FC<SerpPreviewProps> = ({ title, slug, metaDescription }) => {
  const [device, setDevice] = useState<'desktop' | 'mobile'>('desktop');
  const [faviconError, setFaviconError] = useState<boolean>(false);

  const rawTitle = title.trim() || 'Título da matéria | Saúde Insider';
  const cleanSlug = slug.trim() ? slug.trim().replace(/^\/+/, '') : 'sua-materia-aqui';
  const rawDesc = metaDescription.trim() || 'A meta descrição da matéria aparecerá aqui nos resultados de busca do Google.';

  // Truncamentos visuais realistas do Google
  const truncatedTitle = rawTitle.length > MAX_TITLE_CHARS
    ? `${rawTitle.slice(0, MAX_TITLE_CHARS)}...`
    : rawTitle;

  const truncatedDesc = rawDesc.length > MAX_DESC_CHARS
    ? `${rawDesc.slice(0, MAX_DESC_CHARS)}...`
    : rawDesc;

  const titleLen = rawTitle.length;
  const descLen = rawDesc.length;

  const getTitleStatusClass = () => {
    if (titleLen === 0) return styles.badgeWarning;
    if (titleLen > 65) return styles.badgeDanger;
    if (titleLen >= 35 && titleLen <= 60) return styles.badgeNormal;
    return styles.badgeWarning;
  };

  const getDescStatusClass = () => {
    if (descLen === 0) return styles.badgeWarning;
    if (descLen > 160) return styles.badgeDanger;
    if (descLen >= 120 && descLen <= 160) return styles.badgeNormal;
    return styles.badgeWarning;
  };

  const renderFavicon = () => {
    if (faviconError) {
      return <span>SI</span>;
    }
    return (
      <img
        src={OFFICIAL_FAVICON_URL}
        alt="Saúde Insider Favicon"
        className={styles.faviconImg}
        onError={() => setFaviconError(true)}
      />
    );
  };

  return (
    <div className={styles.container}>
      <div className={styles.header}>
        <h4 className={styles.headerTitle}>Prévia no Google</h4>
        <div className={styles.tabs}>
          <button
            type="button"
            className={`${styles.tabButton} ${device === 'desktop' ? styles.tabButtonActive : ''}`}
            onClick={() => setDevice('desktop')}
          >
            Desktop
          </button>
          <button
            type="button"
            className={`${styles.tabButton} ${device === 'mobile' ? styles.tabButtonActive : ''}`}
            onClick={() => setDevice('mobile')}
          >
            Mobile
          </button>
        </div>
      </div>

      <div className={styles.snippetWrapper}>
        {device === 'desktop' ? (
          <div className={styles.snippetDesktop}>
            <div className={styles.desktopHeader}>
              <div className={styles.faviconWrapper}>{renderFavicon()}</div>
              <div className={styles.desktopHeaderMeta}>
                <span className={styles.desktopSiteName}>Saúde Insider</span>
                <span className={styles.desktopBreadcrumb}>
                  https://saudeinsider.com.br › {cleanSlug}
                </span>
              </div>
            </div>
            <h3 className={styles.desktopTitle}>{truncatedTitle}</h3>
            <p className={styles.desktopDesc}>{truncatedDesc}</p>
          </div>
        ) : (
          <div className={styles.snippetMobile}>
            <div className={styles.mobileHeader}>
              <div className={styles.faviconWrapper}>{renderFavicon()}</div>
              <div className={styles.mobileMeta}>
                <span className={styles.mobileSiteName}>Saúde Insider</span>
                <span className={styles.mobileUrl}>
                  https://saudeinsider.com.br › {cleanSlug}
                </span>
              </div>
            </div>
            <h3 className={styles.mobileTitle}>{truncatedTitle}</h3>
            <p className={styles.mobileDesc}>{truncatedDesc}</p>
          </div>
        )}
      </div>

      <div className={styles.lengthBadges}>
        <span className={getTitleStatusClass()}>
          Título: {titleLen}/{MAX_TITLE_CHARS} carac.
        </span>
        <span className={getDescStatusClass()}>
          Meta Desc: {descLen}/{MAX_DESC_CHARS} carac.
        </span>
      </div>
    </div>
  );
};
