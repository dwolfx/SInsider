'use client';

import React, { useState } from 'react';

export interface SocialLinksProps {
  siteUrl?: string;
}

export const SocialLinks: React.FC<SocialLinksProps> = ({
  siteUrl = 'https://saudeinsider.com.br/',
}) => {
  const [copied, setCopied] = useState(false);

  const copyLink = () => {
    if (typeof navigator !== 'undefined') {
      navigator.clipboard.writeText(siteUrl);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    }
  };

  return (
    <ul className="si-footer__redes">
      <li>
        <a
          className="si-footer__rede"
          href="https://www.linkedin.com/company/saúde-insider/"
          title="LinkedIn"
          target="_blank"
          rel="noopener noreferrer"
        >
          <span className="si-visually-hidden">LinkedIn</span>
          <svg className="si-icon" aria-hidden="true" focusable="false" width="13" height="13" viewBox="0 0 13 13" fill="none" xmlns="http://www.w3.org/2000/svg">
            <path d="M8.66675 4.3335C9.5287 4.3335 10.3554 4.67591 10.9648 5.2854C11.5743 5.89489 11.9167 6.72154 11.9167 7.5835V11.3752H9.75008V7.5835C9.75008 7.29618 9.63594 7.02063 9.43278 6.81746C9.22962 6.6143 8.95407 6.50016 8.66675 6.50016C8.37943 6.50016 8.10388 6.6143 7.90072 6.81746C7.69755 7.02063 7.58341 7.29618 7.58341 7.5835V11.3752H5.41675V7.5835C5.41675 6.72154 5.75916 5.89489 6.36865 5.2854C6.97814 4.67591 7.80479 4.3335 8.66675 4.3335Z" stroke="#9A9A96" strokeWidth="0.8125" strokeLinecap="round" strokeLinejoin="round" />
            <path d="M3.24992 4.875H1.08325V11.375H3.24992V4.875Z" stroke="#9A9A96" strokeWidth="0.8125" strokeLinecap="round" strokeLinejoin="round" />
            <path d="M2.16659 3.25016C2.76489 3.25016 3.24992 2.76514 3.24992 2.16683C3.24992 1.56852 2.76489 1.0835 2.16659 1.0835C1.56828 1.0835 1.08325 1.56852 1.08325 2.16683C1.08325 2.76514 1.56828 3.25016 2.16659 3.25016Z" stroke="#9A9A96" strokeWidth="0.8125" strokeLinecap="round" strokeLinejoin="round" />
          </svg>
        </a>
      </li>
      <li>
        <a
          className="si-footer__rede"
          href="https://www.instagram.com/saude_insider/"
          title="Instagram"
          target="_blank"
          rel="noopener noreferrer"
        >
          <span className="si-visually-hidden">Instagram</span>
          <svg className="si-icon" aria-hidden="true" focusable="false" width="13" height="13" viewBox="0 0 13 13" fill="none" xmlns="http://www.w3.org/2000/svg">
            <path d="M9.20825 1.0835H3.79159C2.29581 1.0835 1.08325 2.29606 1.08325 3.79183V9.2085C1.08325 10.7043 2.29581 11.9168 3.79159 11.9168H9.20825C10.704 11.9168 11.9166 10.7043 11.9166 9.2085V3.79183C11.9166 2.29606 10.704 1.0835 9.20825 1.0835Z" stroke="#9A9A96" strokeWidth="0.8125" strokeLinecap="round" strokeLinejoin="round" />
            <path d="M8.66659 6.15891C8.73344 6.60971 8.65644 7.07011 8.44654 7.47463C8.23665 7.87915 7.90454 8.20718 7.49747 8.41207C7.0904 8.61696 6.62908 8.68828 6.17914 8.61588C5.7292 8.54348 5.31354 8.33104 4.99129 8.00879C4.66904 7.68654 4.45661 7.27089 4.38421 6.82095C4.31181 6.371 4.38312 5.90969 4.58802 5.50262C4.79291 5.09554 5.12094 4.76344 5.52546 4.55354C5.92997 4.34365 6.39037 4.26665 6.84117 4.3335C7.30101 4.40168 7.72672 4.61596 8.05542 4.94466C8.38413 5.27337 8.5984 5.69908 8.66659 6.15891Z" stroke="#9A9A96" strokeWidth="0.8125" strokeLinecap="round" strokeLinejoin="round" />
            <path d="M9.47925 3.521H9.48466" stroke="#9A9A96" strokeWidth="0.8125" strokeLinecap="round" strokeLinejoin="round" />
          </svg>
        </a>
      </li>
      <li>
        <a
          className="si-footer__rede"
          href="https://x.com/saudeinsider"
          title="X (Twitter)"
          target="_blank"
          rel="noopener noreferrer"
        >
          <span className="si-visually-hidden">X (Twitter)</span>
          <svg className="si-icon" aria-hidden="true" focusable="false" width="15" height="15" viewBox="0 0 15 15" fill="none" xmlns="http://www.w3.org/2000/svg">
            <path d="M3.4375 2.5L11.5625 12.5" stroke="#767676" strokeWidth="1.25" strokeLinecap="round" strokeLinejoin="round" />
            <path d="M11.5625 2.5L3.4375 12.5" stroke="#767676" strokeWidth="1.25" strokeLinecap="round" strokeLinejoin="round" />
          </svg>
        </a>
      </li>
      <li>
        <a
          className="si-footer__rede"
          href="https://www.youtube.com/@saudeinsider"
          title="YouTube"
          target="_blank"
          rel="noopener noreferrer"
        >
          <span className="si-visually-hidden">YouTube</span>
          <svg className="si-icon" aria-hidden="true" focusable="false" width="13" height="13" viewBox="0 0 13 13" fill="none" xmlns="http://www.w3.org/2000/svg">
            <path d="M1.35411 3.79167C0.975714 5.5774 0.975714 7.4226 1.35411 9.20833C1.40383 9.38968 1.49989 9.55496 1.63285 9.68792C1.76582 9.82088 1.9311 9.91695 2.11244 9.96667C5.01764 10.4481 7.98225 10.4481 10.8874 9.96667C11.0688 9.91695 11.2341 9.82088 11.367 9.68792C11.5 9.55496 11.5961 9.38968 11.6458 9.20833C12.0242 7.4226 12.0242 5.5774 11.6458 3.79167C11.5961 3.61032 11.5 3.44504 11.367 3.31208C11.2341 3.17912 11.0688 3.08305 10.8874 3.03333C7.98224 2.55204 5.01764 2.55204 2.11244 3.03333C1.9311 3.08305 1.76582 3.17912 1.63285 3.31208C1.49989 3.44504 1.40383 3.61032 1.35411 3.79167Z" stroke="#9A9A96" strokeWidth="0.8125" strokeLinecap="round" strokeLinejoin="round" />
            <path d="M5.41663 8.125L8.12496 6.5L5.41663 4.875V8.125Z" stroke="#9A9A96" strokeWidth="0.8125" strokeLinecap="round" strokeLinejoin="round" />
          </svg>
        </a>
      </li>
      <li>
        <button
          type="button"
          className="si-footer__rede cursor-pointer"
          onClick={copyLink}
          title="Copiar link do site"
        >
          <span className="si-visually-hidden">Copiar link do site</span>
          <svg className="si-icon" aria-hidden="true" focusable="false" width="15" height="15" viewBox="0 0 15 15" fill="none" xmlns="http://www.w3.org/2000/svg">
            <path d="M6.25 8.125a3.125 3.125 0 0 0 4.7125.3375l1.875-1.875a3.125 3.125 0 0 0-4.41875-4.41875L7.34375 3.2375" stroke="#767676" strokeWidth="1.25" strokeLinecap="round" strokeLinejoin="round" />
            <path d="M8.75 6.875a3.125 3.125 0 0 0-4.7125-.3375L2.1625 8.4125a3.125 3.125 0 0 0 4.41875 4.41875L7.65625 11.7625" stroke="#767676" strokeWidth="1.25" strokeLinecap="round" strokeLinejoin="round" />
          </svg>
        </button>
      </li>
    </ul>
  );
};
