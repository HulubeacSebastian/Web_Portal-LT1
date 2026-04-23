import { useEffect, useMemo, useState } from 'react';
import { Link, NavLink, Route, Routes, useLocation, useNavigate } from 'react-router-dom';
import HomePage from './pages/HomePage.jsx';
import DocumentListPage from './pages/DocumentListPage.jsx';
import DocumentAnalyticsPage from './pages/DocumentAnalyticsPage.jsx';
import DocumentDetailPage from './pages/DocumentDetailPage.jsx';
import DocumentFormPage from './pages/DocumentFormPage.jsx';
import LoginPage from './pages/LoginPage.jsx';
import RegisterPage from './pages/RegisterPage.jsx';
import AboutPage from './pages/AboutPage.jsx';
import ContactPage from './pages/ContactPage.jsx';
import CalendarPage from './pages/CalendarPage.jsx';
import ActivityInsightsPage from './pages/ActivityInsightsPage.jsx';
import NotFoundPage from './pages/NotFoundPage.jsx';
import SchoolFooter from './components/SchoolFooter.jsx';
import { DocumentsProvider } from './store/DocumentsContext';
import logo from '../assets/logo-mov-vector.pdf.png';
import { deleteCookie, getCookie, setCookie } from './utils/cookies';
import {
  getActivitySnapshot,
  getPreferences,
  recordActivityEvent,
  savePreference,
  trackPageVisit
} from './utils/activityCookies';

function App() {
  const location = useLocation();
  const navigate = useNavigate();
  const [cookieConsent, setCookieConsent] = useState(Boolean(getCookie('portal_cookie_consent')));
  const [activity, setActivity] = useState(() => getActivitySnapshot());
  const [authUser, setAuthUser] = useState(() => getCookie('portal_user') || '');

  useEffect(() => {
    if (cookieConsent) {
      setCookie('portal_last_path', location.pathname, { maxAge: 60 * 60 * 24 * 30 });
      const snapshot = trackPageVisit(location.pathname);
      setActivity(snapshot);
      savePreference('lastVisitedPath', location.pathname);
      recordActivityEvent('route_change', { path: location.pathname });
    }
  }, [cookieConsent, location.pathname]);

  useEffect(() => {
    setAuthUser(getCookie('portal_user') || '');
  }, [location.pathname]);

  const isLoggedIn = Boolean(authUser);
  const userLabel = useMemo(() => authUser || 'Vizitator', [authUser]);

  const handleLogout = () => {
    deleteCookie('portal_user');
    localStorage.removeItem('portal_jwt');
    setAuthUser('');
    recordActivityEvent('logout');
    navigate('/');
  };

  const acceptCookies = () => {
    setCookie('portal_cookie_consent', 'accepted', { maxAge: 60 * 60 * 24 * 365 });
    setCookieConsent(true);
    recordActivityEvent('cookie_consent_accepted');
  };

  const preferenceCount = Object.keys(getPreferences()).length;

  return (
    <DocumentsProvider>
      <div className="layout">
        <header className="header">
          <div className="header-inner">
            <div className="header-center">
              <img src={logo} alt="Logo LT1" className="brand-logo" />
              <nav className="nav nav-main">
                <NavLink to="/" end className={({ isActive }) => `nav-link${isActive ? ' active' : ''}`}>
                  Acasa
                </NavLink>
                <NavLink
                  to="/documente"
                  className={({ isActive }) => `nav-link${isActive ? ' active' : ''}`}
                >
                  Documente
                </NavLink>
                <NavLink
                  to="/despre-noi"
                  className={({ isActive }) => `nav-link${isActive ? ' active' : ''}`}
                >
                  Despre Noi
                </NavLink>
                <NavLink
                  to="/contact"
                  className={({ isActive }) => `nav-link${isActive ? ' active' : ''}`}
                >
                  Contact
                </NavLink>
                <NavLink
                  to="/calendar"
                  className={({ isActive }) => `nav-link${isActive ? ' active' : ''}`}
                >
                  Calendar
                </NavLink>
                <NavLink
                  to="/activitate"
                  className={({ isActive }) => `nav-link${isActive ? ' active' : ''}`}
                >
                  Activitate
                </NavLink>
              </nav>
            </div>

            <div className="header-auth">
              {isLoggedIn ? (
                <button type="button" className="auth-btn login-btn" onClick={handleLogout}>
                  Deconectare
                </button>
              ) : (
                <>
                  <Link to="/login" className="auth-btn login-btn">
                    Login
                  </Link>
                  <Link to="/register" className="auth-btn register-btn">
                    Register
                  </Link>
                </>
              )}
            </div>
          </div>
        </header>

        {!cookieConsent ? (
          <div className="cookie-banner">
            <span>Folosim cookie-uri pentru preferinte si activitate. Bun venit, {userLabel}.</span>
            <button type="button" className="btn" onClick={acceptCookies}>
              Accept
            </button>
          </div>
        ) : null}

        {cookieConsent ? (
          <div className="cookie-banner">
            <span>
              Monitorizare activa: {activity.totalVisits} navigari, ultima pagina {activity.lastPath}, preferinte salvate{' '}
              {preferenceCount}.
            </span>
          </div>
        ) : null}

        <main className="content">
          <Routes>
            <Route path="/" element={<HomePage />} />
            <Route path="/documente" element={<DocumentListPage />} />
            <Route path="/documente2" element={<DocumentAnalyticsPage />} />
            <Route path="/documente/adauga" element={<DocumentFormPage mode="create" />} />
            <Route path="/documente/:id" element={<DocumentDetailPage />} />
            <Route path="/documente/:id/edit" element={<DocumentFormPage mode="edit" />} />
            <Route path="/despre-noi" element={<AboutPage />} />
            <Route path="/contact" element={<ContactPage />} />
            <Route path="/calendar" element={<CalendarPage />} />
            <Route path="/activitate" element={<ActivityInsightsPage />} />
            <Route path="/login" element={<LoginPage />} />
            <Route path="/register" element={<RegisterPage />} />
            <Route path="*" element={<NotFoundPage />} />
          </Routes>
        </main>

        <SchoolFooter />
      </div>
    </DocumentsProvider>
  );
}

export default App;
