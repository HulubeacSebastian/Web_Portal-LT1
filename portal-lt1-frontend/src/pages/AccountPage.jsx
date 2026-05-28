import { useCallback, useEffect, useState } from 'react';
import { Link, Navigate } from 'react-router-dom';
import { apiRequest, AUTH_CHANGED_EVENT } from '../utils/apiClient';
import { getDisplayName, hasAuthSession, loadAuthSession, mergeAuthUser } from '../utils/authSession';

const ROLE_LABELS = {
  admin: 'Administrator',
  user: 'Utilizator'
};

function AccountPage({ onLogout }) {
  const session = loadAuthSession();
  const [profile, setProfile] = useState(null);
  const [nicknameDraft, setNicknameDraft] = useState('');
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState('');
  const [saveMessage, setSaveMessage] = useState('');

  const loadProfile = useCallback(async () => {
    setLoading(true);
    setError('');
    try {
      const data = await apiRequest('/api/users/profile');
      setProfile(data);
      setNicknameDraft(data.nickname || '');
      mergeAuthUser(data);
      window.dispatchEvent(new Event(AUTH_CHANGED_EVENT));
    } catch (err) {
      setError(err.message || 'Nu am putut incarca profilul.');
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    if (!hasAuthSession()) return;
    loadProfile();
  }, [loadProfile]);

  if (!hasAuthSession()) {
    return <Navigate to="/login" replace state={{ from: '/cont' }} />;
  }

  const displayName = getDisplayName(profile || session);
  const roleLabel = ROLE_LABELS[profile?.role || session?.role] || profile?.role || session?.role;
  const roleDescription = profile?.roleDescription || session?.roleDescription || '';
  const permissions = profile?.permissions || session?.permissions || [];

  async function handleSaveNickname(event) {
    event.preventDefault();
    setSaving(true);
    setSaveMessage('');
    setError('');
    try {
      const updated = await apiRequest('/api/users/profile', {
        method: 'PATCH',
        body: { nickname: nicknameDraft }
      });
      setProfile(updated);
      mergeAuthUser(updated);
      window.dispatchEvent(new Event(AUTH_CHANGED_EVENT));
      setSaveMessage('Nickname actualizat.');
    } catch (err) {
      const fieldError = err.data?.errors?.nickname;
      setError(fieldError || err.message || 'Nu am putut salva nickname-ul.');
    } finally {
      setSaving(false);
    }
  }

  return (
    <section className="page-stack account-page">
      <article className="card account-hero">
        <div className="account-hero-main">
          <span className="account-avatar" aria-hidden="true">
            {displayName.charAt(0).toUpperCase()}
          </span>
          <div>
            <p className="eyebrow">Contul meu</p>
            <div className="account-hero-title-row">
              <h2>{displayName}</h2>
              <span className="account-role-badge">{roleLabel}</span>
            </div>
          </div>
        </div>
        <div className="account-hero-right">
          <div className="account-hero-actions" aria-label="Actiuni cont">
            <button type="button" className="danger" onClick={() => onLogout()}>
              Deconectare
            </button>
            <Link to="/" className="secondary account-link-btn">
              Înapoi acasă
            </Link>
          </div>
        </div>
      </article>

      {loading ? (
        <article className="card">
          <p className="muted">Se încarcă detaliile contului…</p>
        </article>
      ) : null}

      {error && !loading ? (
        <article className="card account-alert account-alert--error">
          <p>{error}</p>
          <button type="button" className="secondary" onClick={loadProfile}>
            Reîncearcă
          </button>
        </article>
      ) : null}

      {!loading && profile ? (
        <>
          <article className="card account-details">
            <h3>Informații cont</h3>
            <dl className="account-dl">
              <div>
                <dt>Nume complet</dt>
                <dd>{profile.fullName}</dd>
              </div>
              <div>
                <dt>Email</dt>
                <dd>{profile.email}</dd>
              </div>
              <div>
                <dt>Tip cont</dt>
                <dd>
                  <strong>{roleLabel}</strong>
                  {roleDescription ? <span className="muted account-role-desc"> — {roleDescription}</span> : null}
                </dd>
              </div>
              <div>
                <dt>ID utilizator</dt>
                <dd className="account-mono">{profile.id}</dd>
              </div>
            </dl>
          </article>

          <article className="card account-nickname">
            <h3>Nickname</h3>
            <form className="account-nickname-form" onSubmit={handleSaveNickname}>
              <label htmlFor="account-nickname" className="visually-hidden">
                Nickname
              </label>
              <div className="account-nickname-row">
                <input
                  id="account-nickname"
                  type="text"
                  value={nicknameDraft}
                  onChange={(e) => setNicknameDraft(e.target.value)}
                  placeholder="ex: AdminLT1"
                  maxLength={32}
                  autoComplete="nickname"
                />
                <button type="submit" className="btn account-nickname-save" disabled={saving}>
                  {saving ? 'Se salvează…' : 'Salvează'}
                </button>
              </div>
              {saveMessage ? <p className="account-save-ok">{saveMessage}</p> : null}
            </form>
          </article>

          <article className="card account-permissions">
            <h3>Permisiuni</h3>
            {permissions.length === 0 ? (
              <p className="muted">Nu ai permisiuni suplimentare atribuite.</p>
            ) : (
              <ul className="account-permission-list">
                {permissions.map((code) => (
                  <li key={code}>{code}</li>
                ))}
              </ul>
            )}
          </article>

        </>
      ) : null}
    </section>
  );
}

export default AccountPage;
