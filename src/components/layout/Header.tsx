'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { UserCheck } from 'lucide-react';
import { PrimaryNav } from './PrimaryNav';
import { SecondaryNav } from './SecondaryNav';
import { SearchPanel } from './SearchPanel';
import { MobileDrawer } from './MobileDrawer';

interface HeaderProps {
  variant?: 'home' | 'materia' | 'listagem';
}

export const Header: React.FC<HeaderProps> = ({ variant = 'home' }) => {
  const [drawerOpen, setDrawerOpen] = useState(false);
  const [searchOpen, setSearchOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [isFixo, setIsFixo] = useState(false);
  const pathname = usePathname();

  // Determine if this is an article page
  const isArticle = variant === 'materia' || pathname.startsWith('/noticia');
  const headerVariantClass = isArticle ? 'si-header--materia' : 'si-header--home';

  // Native scroll handler for is-fixo sticky header
  useEffect(() => {
    const handleScroll = () => {
      const scrollY = window.scrollY || window.pageYOffset;
      const threshold = isArticle ? 60 : 80;
      setIsFixo(scrollY > threshold);
    };

    window.addEventListener('scroll', handleScroll, { passive: true });
    handleScroll();
    return () => window.removeEventListener('scroll', handleScroll);
  }, [isArticle]);

  return (
    <>
      <header
        className={`si-header ${headerVariantClass} ${isFixo ? 'is-fixo' : ''}`}
        data-si-barra-fixa
        suppressHydrationWarning
      >
        <div className="si-header__bar">
          <div className="si-header__inner">

            {/* Monograma que surge na margem esquerda na rolagem */}
            <div className="si-header__monograma">
              <Link
                className="si-logo si-logo--monograma"
                href="/"
                rel="home"
                aria-hidden="true"
                tabIndex={-1}
              >
                <span className="si-logo__janela">
                  <img
                    className="si-logo__fonte"
                    src="https://saudeinsider.com.br/wp-content/uploads/2026/08/logo-si.png"
                    alt=""
                    decoding="async"
                  />
                </span>
              </Link>
            </div>

            {/* Left Side: Drawer + Search + Primary Nav */}
            <div className="si-header__side si-header__side--start">
              <button
                type="button"
                onClick={() => setDrawerOpen(true)}
                className="si-header__button si-header__button--menu cursor-pointer"
                aria-label="Abrir menu"
              >
                <svg className="si-icon" aria-hidden="true" width="17" height="17" viewBox="0 0 17 17" fill="none">
                  <path d="M2.83333 8.5H14.1667" stroke="#111111" strokeWidth="1.0625" strokeLinecap="round" strokeLinejoin="round" />
                  <path d="M2.83333 4.25H14.1667" stroke="#111111" strokeWidth="1.0625" strokeLinecap="round" strokeLinejoin="round" />
                  <path d="M2.83333 12.75H14.1667" stroke="#111111" strokeWidth="1.0625" strokeLinecap="round" strokeLinejoin="round" />
                </svg>
                <span className="si-visually-hidden">Abrir menu</span>
              </button>

              <button
                type="button"
                onClick={() => setSearchOpen(!searchOpen)}
                className="si-header__button si-header__button--search cursor-pointer"
                aria-label="Abrir busca"
              >
                <svg className="si-icon" aria-hidden="true" width="15" height="15" viewBox="0 0 15 15" fill="none">
                  <path d="M6.875 11.875C9.63642 11.875 11.875 9.63642 11.875 6.875C11.875 4.11358 9.63642 1.875 6.875 1.875C4.11358 1.875 1.875 4.11358 1.875 6.875C1.875 9.63642 4.11358 11.875 6.875 11.875Z" stroke="#111111" strokeWidth="0.9375" strokeLinecap="round" strokeLinejoin="round" />
                  <path d="M13.125 13.125L10.4375 10.4375" stroke="#111111" strokeWidth="0.9375" strokeLinecap="round" strokeLinejoin="round" />
                </svg>
                <span className="si-visually-hidden">Abrir busca</span>
              </button>

              <span className="si-header__divider" aria-hidden="true" />

              <PrimaryNav />
            </div>

            {/* Center Logo & Condensed Version */}
            <div className="si-header__logo">
              <Link href="/" className="custom-logo-link" rel="home">
                <img
                  src="https://saudeinsider.com.br/wp-content/uploads/2026/08/logo-si.png"
                  className="custom-logo"
                  alt="Saúde Insider"
                  decoding="async"
                />
              </Link>
              <span className="si-header__logo-condensado">
                <Link className="si-logo si-logo--assinatura" href="/" rel="home">
                  <span className="si-logo__janela">
                    <img
                      className="si-logo__fonte"
                      src="https://saudeinsider.com.br/wp-content/uploads/2026/08/logo-si.png"
                      alt=""
                      decoding="async"
                    />
                  </span>
                  <span className="si-visually-hidden">Saúde Insider</span>
                </Link>
              </span>
            </div>

            {/* Right Side: Secondary Nav + CMS Button */}
            <div className="si-header__side si-header__side--end">
              <SecondaryNav />

              <Link
                href="/admin"
                className="hidden lg:inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-[11px] font-bold text-white bg-[var(--si-color-brand-primary,#7a0f16)] hover:bg-[var(--si-color-brand-primary-hover,#5c0b10)] transition-colors shadow-xs ml-3"
              >
                <UserCheck className="w-3.5 h-3.5" />
                <span>CMS</span>
              </Link>
            </div>

          </div>
        </div>
      </header>

      {/* Espaço reservado para quando o header se torna fixo, evitando pulo no layout */}
      <div
        className="si-header__espaco"
        aria-hidden="true"
        suppressHydrationWarning
      />

      <MobileDrawer
        isOpen={drawerOpen}
        onClose={() => setDrawerOpen(false)}
      />

      <SearchPanel
        isOpen={searchOpen}
        searchQuery={searchQuery}
        onSearchChange={setSearchQuery}
        onClose={() => setSearchOpen(false)}
      />
    </>
  );
};
