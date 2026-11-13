import React from 'react';
import Link from 'next/link';

export interface NavItem {
  name: string;
  href: string;
  children?: { name: string; href: string }[];
}

export const DEFAULT_PRIMARY_NAV: NavItem[] = [
  { name: 'Economia', href: '/editoria/economia' },
  {
    name: 'Negócios',
    href: '/editoria/negocios',
    children: [
      { name: 'Farmacêuticas', href: '/editoria/negocios/farmaceuticas' },
      { name: 'Indústria', href: '/editoria/negocios/industria' },
      { name: 'Operadoras de Saúde', href: '/editoria/negocios/operadoras-de-saude' },
      { name: 'Perfis', href: '/editoria/negocios/perfis' },
      { name: 'Rede Hospitalar', href: '/editoria/negocios/rede-hospitalar' },
    ],
  },
  {
    name: 'Política',
    href: '/editoria/politica',
    children: [
      { name: 'Assembleias', href: '/editoria/politica/assembleias' },
      { name: 'Câmara', href: '/editoria/politica/camara' },
      { name: 'Executivo Estadual', href: '/editoria/politica/executivo-estadual' },
      { name: 'Executivo Federal', href: '/editoria/politica/executivo-federal' },
      { name: 'Senado', href: '/editoria/politica/senado' },
    ],
  },
  { name: 'Regulatório', href: '/editoria/regulatorio' },
  { name: 'Judiciário', href: '/editoria/judiciario' },
];

export interface PrimaryNavProps {
  items?: NavItem[];
  className?: string;
  onLinkClick?: () => void;
}

export const PrimaryNav: React.FC<PrimaryNavProps> = ({
  items = DEFAULT_PRIMARY_NAV,
  className = 'si-nav si-nav--primary',
  onLinkClick,
}) => {
  return (
    <nav className={className} aria-label="Editorias">
      <ul id="menu-editorias" className="si-nav__list">
        {items.map((item) => (
          <li key={item.name} className={`menu-item ${item.children ? 'menu-item-has-children' : ''}`}>
            <Link href={item.href} onClick={onLinkClick}>
              {item.name}
            </Link>
            {item.children && (
              <ul className="sub-menu">
                {item.children.map((child) => (
                  <li key={child.name} className="menu-item">
                    <Link href={child.href} onClick={onLinkClick}>
                      {child.name}
                    </Link>
                  </li>
                ))}
              </ul>
            )}
          </li>
        ))}
      </ul>
    </nav>
  );
};
