import { useEffect, useMemo, useState } from 'react';
import { createPortal } from 'react-dom';
import { Link, NavLink, useLocation } from 'react-router-dom';
import { useMobileHeaderCollapse } from '../hooks/useMobileHeaderCollapse';
import HeaderTassel from './HeaderTassel.jsx';

const NAV_ICONS = {
  home: '/assets/icons/school-svgrepo-com.svg',
  documents: '/assets/icons/documents-svgrepo-com.svg',
  about: '/assets/icons/info-square-svgrepo-com.svg',
  contact: '/assets/icons/phone-calling-rounded-svgrepo-com.svg',
  calendar: '/assets/icons/calendar-svgrepo-com.svg',
  activity: '/assets/icons/activity-svgrepo-com.svg',
  chat: '/assets/icons/chat-unread-svgrepo-com.svg',
  menu: '/assets/icons/burger-menu-svgrepo-com.svg'
};

const NAV_ITEMS = [
  { to: '/', end: true, label: 'Acasă', icon: NAV_ICONS.home },
  { to: '/documente', label: 'Documente', icon: NAV_ICONS.documents },
  { to: '/despre-noi', label: 'Despre Noi', icon: NAV_ICONS.about },
  { to: '/contact', label: 'Contact', icon: NAV_ICONS.contact },
  { to: '/calendar', label: 'Calendar', icon: NAV_ICONS.calendar },
  { to: '/activitate', label: 'Activitate', icon: NAV_ICONS.activity, adminOnly: true }
];

function NavIcon({ src }) {
  return (
    <span className="site-header-nav-icon" aria-hidden="true">
      <img src={src} alt="" className="site-header-nav-icon-img" width={20} height={20} decoding="async" />
    </span>
  );
}

function SiteHeader({ isLoggedIn, displayName, showChat, showActivity, onLogout }) {
  const location = useLocation();
  const onAccountPage = location.pathname === '/cont';
  const [menuOpen, setMenuOpen] = useState(false);
  const { collapseProgress, isCompact, isMobile } = useMobileHeaderCollapse(location.pathname);

  const navLinks = useMemo(() => {
    const items = NAV_ITEMS.filter((item) => !item.adminOnly || showActivity);
    if (showChat) {
      items.push({ to: '/chat', label: 'Chat', icon: NAV_ICONS.chat });
    }
    return items;
  }, [showActivity, showChat]);

  useEffect(() => {
    setMenuOpen(false);
  }, [location.pathname]);

  useEffect(() => {
    if (!menuOpen) return undefined;
    const previousOverflow = document.body.style.overflow;
    document.body.style.overflow = 'hidden';
    return () => {
      document.body.style.overflow = previousOverflow;
    };
  }, [menuOpen]);

  useEffect(() => {
    const onKeyDown = (event) => {
      if (event.key === 'Escape') setMenuOpen(false);
    };
    window.addEventListener('keydown', onKeyDown);
    return () => window.removeEventListener('keydown', onKeyDown);
  }, []);

  const closeMenu = () => setMenuOpen(false);

  const mobileDrawer =
    menuOpen &&
    createPortal(
      <div
        id="site-header-drawer"
        className="site-header-drawer site-header-drawer--open"
        aria-hidden={false}
      >
        <button type="button" className="site-header-drawer-backdrop" aria-label="Închide meniul" onClick={closeMenu} />
        <div className="site-header-drawer-panel" role="dialog" aria-modal="true" aria-label="Meniu navigare">
          <div className="site-header-drawer-head">
            <span className="site-header-drawer-title">Meniu</span>
            <button type="button" className="site-header-drawer-close" onClick={closeMenu} aria-label="Închide">
              ×
            </button>
          </div>
          <nav className="site-header-drawer-nav" aria-label="Navigare mobilă">
            <ul className="site-header-drawer-list">
              {navLinks.map((item) => (
                <li key={item.to}>
                  <NavLink
                    to={item.to}
                    end={item.end}
                    className={({ isActive }) =>
                      `site-header-drawer-link${isActive ? ' site-header-drawer-link--active' : ''}`
                    }
                    onClick={closeMenu}
                  >
                    <NavIcon src={item.icon} />
                    <span>{item.label}</span>
                  </NavLink>
                </li>
              ))}
            </ul>
          </nav>

          <div className="site-header-drawer-foot">
            {isLoggedIn ? (
              <>
                <Link
                  to="/cont"
                  className={`site-header-drawer-account${onAccountPage ? ' site-header-drawer-account--active' : ''}`}
                  onClick={closeMenu}
                >
                  <span className="site-header-drawer-account-avatar" aria-hidden="true">
                    {displayName.charAt(0).toUpperCase()}
                  </span>
                  <span className="site-header-drawer-account-text">
                    <span className="site-header-drawer-account-label">Contul meu</span>
                    <span className="site-header-drawer-account-name">{displayName}</span>
                  </span>
                </Link>
                <button
                  type="button"
                  className="site-header-drawer-logout"
                  onClick={() => {
                    closeMenu();
                    onLogout?.();
                  }}
                >
                  Deconectare
                </button>
              </>
            ) : (
              <div className="site-header-drawer-auth">
                <Link to="/login" className="site-header-drawer-auth-btn site-header-drawer-auth-btn--login" onClick={closeMenu}>
                  Autentificare
                </Link>
                <Link
                  to="/register"
                  className="site-header-drawer-auth-btn site-header-drawer-auth-btn--register"
                  onClick={closeMenu}
                >
                  Înregistrare
                </Link>
              </div>
            )}
          </div>
        </div>
      </div>,
      document.body
    );

  const headerClassName = [
    'site-header',
    isMobile && (isCompact ? 'site-header--compact' : 'site-header--expanded'),
    isMobile && collapseProgress > 0 && collapseProgress < 1 ? 'site-header--collapsing' : ''
  ]
    .filter(Boolean)
    .join(' ');

  return (
    <header className={headerClassName}>
      <div className="site-header-shell">
        <div className="site-header-accent" aria-hidden="true" />
        <div className="site-header-inner">
        <Link to="/" className="site-header-brand" aria-label="Portal LT1 — pagina principală">
          <span className="site-header-logo-wrap">
            <img src="/assets/logo-mov-vector.pdf.png" alt="" className="site-header-logo" />
          </span>
          <div className="site-header-brand-text">
            <span className="site-header-brand-title">Liceul Tehnologic Nr. 1</span>
            <span className="site-header-brand-sub">Câmpulung Moldovenesc</span>
          </div>
        </Link>

        <nav className="site-header-nav site-header-nav--desktop" aria-label="Navigare principală">
          <ul className="site-header-nav-list">
            {navLinks.map((item) => (
              <li key={item.to}>
                <NavLink
                  to={item.to}
                  end={item.end}
                  aria-label={item.label}
                  title={item.label}
                  className={({ isActive }) =>
                    `site-header-nav-link${item.to === '/chat' ? ' site-header-nav-link--chat' : ''}${
                      isActive ? ' site-header-nav-link--active' : ''
                    }`
                  }
                >
                  <NavIcon src={item.icon} />
                  <span className="site-header-nav-label">{item.label}</span>
                </NavLink>
              </li>
            ))}
          </ul>
        </nav>

        <div className="site-header-toolbar">
          <button
            type="button"
            className="site-header-menu-btn"
            aria-label={menuOpen ? 'Închide meniul' : 'Deschide meniul'}
            aria-expanded={menuOpen}
            aria-controls="site-header-drawer"
            onClick={() => setMenuOpen((open) => !open)}
          >
            <img src={NAV_ICONS.menu} alt="" width={22} height={22} decoding="async" />
          </button>

          <div className="site-header-actions site-header-actions--desktop">
            {isLoggedIn ? (
              <Link
                to="/cont"
                className={`site-header-user site-header-user--link${onAccountPage ? ' site-header-user--active' : ''}`}
                title="Detalii cont"
                aria-label={`Contul meu: ${displayName}`}
              >
                <span className="site-header-user-avatar" aria-hidden="true">
                  {displayName.charAt(0).toUpperCase()}
                </span>
                <span className="site-header-user-name">{displayName}</span>
              </Link>
            ) : (
              <>
                <Link to="/login" className="site-header-btn site-header-btn--login">
                  Autentificare
                </Link>
                <Link to="/register" className="site-header-btn site-header-btn--register">
                  Înregistrare
                </Link>
              </>
            )}
          </div>
        </div>
        </div>
      </div>

      <HeaderTassel collapseProgress={isMobile ? collapseProgress : 0} />

      {mobileDrawer}
    </header>
  );
}

export default SiteHeader;
