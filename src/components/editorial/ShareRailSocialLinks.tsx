import React from 'react';

interface ShareRailSocialLinksProps {
  encodedUrl: string;
  encodedTitle: string;
}

export const ShareRailSocialLinks: React.FC<ShareRailSocialLinksProps> = ({
  encodedUrl,
  encodedTitle,
}) => {
  return (
    <>
      {/* LinkedIn */}
      <a
        className="si-article__acao si-article__acao--rede"
        href={`https://www.linkedin.com/sharing/share-offsite/?url=${encodedUrl}`}
        target="_blank"
        rel="noopener noreferrer"
        aria-label="Compartilhar no LinkedIn"
        title="Compartilhar no LinkedIn"
      >
        <svg className="si-icon" aria-hidden="true" focusable="false" width="13" height="13" viewBox="0 0 13 13" fill="none" xmlns="http://www.w3.org/2000/svg">
          <path d="M8.66675 4.3335C9.5287 4.3335 10.3554 4.67591 10.9648 5.2854C11.5743 5.89489 11.9167 6.72154 11.9167 7.5835V11.3752H9.75008V7.5835C9.75008 7.29618 9.63594 7.02063 9.43278 6.81746C9.22962 6.6143 8.95407 6.50016 8.66675 6.50016C8.37943 6.50016 8.10388 6.6143 7.90072 6.81746C7.69755 7.02063 7.58341 7.29618 7.58341 7.5835V11.3752H5.41675V7.5835C5.41675 6.72154 5.75916 5.89489 6.36865 5.2854C6.97814 4.67591 7.80479 4.3335 8.66675 4.3335Z" stroke="#9A9A96" strokeWidth="0.8125" strokeLinecap="round" strokeLinejoin="round" />
          <path d="M3.24992 4.875H1.08325V11.375H3.24992V4.875Z" stroke="#9A9A96" strokeWidth="0.8125" strokeLinecap="round" strokeLinejoin="round" />
          <path d="M2.16659 3.25016C2.76489 3.25016 3.24992 2.76514 3.24992 2.16683C3.24992 1.56852 2.76489 1.0835 2.16659 1.0835C1.56828 1.0835 1.08325 1.56852 1.08325 2.16683C1.08325 2.76514 1.56828 3.25016 2.16659 3.25016Z" stroke="#9A9A96" strokeWidth="0.8125" strokeLinecap="round" strokeLinejoin="round" />
        </svg>
      </a>

      {/* Instagram Oficial */}
      <a
        className="si-article__acao si-article__acao--rede"
        href="https://www.instagram.com/saude_insider/"
        target="_blank"
        rel="noopener noreferrer"
        aria-label="Perfil do Saúde Insider no Instagram"
        title="Perfil do Saúde Insider no Instagram"
      >
        <svg className="si-icon" aria-hidden="true" focusable="false" width="13" height="13" viewBox="0 0 13 13" fill="none" xmlns="http://www.w3.org/2000/svg">
          <path d="M9.20825 1.0835H3.79159C2.29581 1.0835 1.08325 2.29606 1.08325 3.79183V9.2085C1.08325 10.7043 2.29581 11.9168 3.79159 11.9168H9.20825C10.704 11.9168 11.9166 10.7043 11.9166 9.2085V3.79183C11.9166 2.29606 10.704 1.0835 9.20825 1.0835Z" stroke="#9A9A96" strokeWidth="0.8125" strokeLinecap="round" strokeLinejoin="round" />
          <path d="M8.66659 6.15891C8.73344 6.60971 8.65644 7.07011 8.44654 7.47463C8.23665 7.87915 7.90072 8.20718 7.49747 8.41207C7.0904 8.61696 6.62908 8.68828 6.17914 8.61588C5.7292 8.54348 5.31354 8.33104 4.99129 8.00879C4.66904 7.68654 4.45661 7.27089 4.38421 6.82095C4.31181 6.371 4.38312 5.90969 4.58802 5.50262C4.79291 5.09554 5.12094 4.76344 5.52546 4.55354C5.92997 4.34365 6.39037 4.26665 6.84117 4.3335C7.30101 4.40168 7.72672 4.61596 8.05542 4.94466C8.38413 5.27337 8.5984 5.69908 8.66659 6.15891Z" stroke="#9A9A96" strokeWidth="0.8125" strokeLinecap="round" strokeLinejoin="round" />
          <path d="M9.47925 3.521H9.48466" stroke="#9A9A96" strokeWidth="0.8125" strokeLinecap="round" strokeLinejoin="round" />
        </svg>
      </a>

      {/* WhatsApp */}
      <a
        className="si-article__acao si-article__acao--rede"
        href={`https://api.whatsapp.com/send?text=${encodedTitle}%20${encodedUrl}`}
        target="_blank"
        rel="noopener noreferrer"
        aria-label="Compartilhar no WhatsApp"
        title="Compartilhar no WhatsApp"
      >
        <svg className="si-icon" aria-hidden="true" focusable="false" width="15" height="15" viewBox="0 0 15 15" fill="none" xmlns="http://www.w3.org/2000/svg">
          <path d="M13.125 7.1875a5.2375 5.2375 0 0 1-0.5625 2.375a5.3125 5.3125 0 0 1-4.75 2.9375a5.2375 5.2375 0 0 1-2.375-0.5625L1.875 13.125l1.1875-3.5625a5.2375 5.2375 0 0 1-0.5625-2.375a5.3125 5.3125 0 0 1 2.9375-4.75a5.2375 5.2375 0 0 1 2.375-0.5625h0.3125a5.3 5.3 0 0 1 5 5z" stroke="#767676" strokeWidth="1.25" strokeLinecap="round" strokeLinejoin="round" />
        </svg>
      </a>

      {/* Telegram */}
      <a
        className="si-article__acao si-article__acao--rede"
        href={`https://t.me/share/url?url=${encodedUrl}&text=${encodedTitle}`}
        target="_blank"
        rel="noopener noreferrer"
        aria-label="Compartilhar no Telegram"
        title="Compartilhar no Telegram"
      >
        <svg className="si-icon" aria-hidden="true" focusable="false" width="15" height="15" viewBox="0 0 15 15" fill="none" xmlns="http://www.w3.org/2000/svg">
          <path d="M13.75 1.25L6.875 8.125" stroke="#767676" strokeWidth="1.25" strokeLinecap="round" strokeLinejoin="round" />
          <path d="M13.75 1.25l-4.375 12.5l-2.5-5.625l-5.625-2.5z" stroke="#767676" strokeWidth="1.25" strokeLinecap="round" strokeLinejoin="round" />
        </svg>
      </a>

      {/* X / Twitter */}
      <a
        className="si-article__acao si-article__acao--rede"
        href={`https://twitter.com/intent/tweet?url=${encodedUrl}&text=${encodedTitle}`}
        target="_blank"
        rel="noopener noreferrer"
        aria-label="Compartilhar no X (Twitter)"
        title="Compartilhar no X (Twitter)"
      >
        <svg className="si-icon" aria-hidden="true" focusable="false" width="15" height="15" viewBox="0 0 15 15" fill="none" xmlns="http://www.w3.org/2000/svg">
          <path d="M3.4375 2.5L11.5625 12.5" stroke="#767676" strokeWidth="1.25" strokeLinecap="round" strokeLinejoin="round" />
          <path d="M11.5625 2.5L3.4375 12.5" stroke="#767676" strokeWidth="1.25" strokeLinecap="round" strokeLinejoin="round" />
        </svg>
      </a>

      {/* E-mail */}
      <a
        className="si-article__acao si-article__acao--rede"
        href={`mailto:?subject=${encodedTitle}&body=${encodedUrl}`}
        aria-label="Compartilhar no E-mail"
        title="Compartilhar no E-mail"
      >
        <svg className="si-icon" aria-hidden="true" focusable="false" width="13" height="13" viewBox="0 0 13 13" fill="none" xmlns="http://www.w3.org/2000/svg">
          <path d="M10.8334 2.1665H2.16671C1.5684 2.1665 1.08337 2.65153 1.08337 3.24984V9.74984C1.08337 10.3481 1.5684 10.8332 2.16671 10.8332H10.8334C11.4317 10.8332 11.9167 10.3481 11.9167 9.74984V3.24984C11.9167 2.65153 11.4317 2.1665 10.8334 2.1665Z" stroke="#9A9A96" strokeWidth="0.8125" strokeLinecap="round" strokeLinejoin="round" />
          <path d="M11.9167 3.7915L7.05796 6.879C6.89073 6.98378 6.69738 7.03934 6.50004 7.03934C6.3027 7.03934 6.10935 6.98378 5.94212 6.879L1.08337 3.7915" stroke="#9A9A96" strokeWidth="0.8125" strokeLinecap="round" strokeLinejoin="round" />
        </svg>
      </a>
    </>
  );
};
