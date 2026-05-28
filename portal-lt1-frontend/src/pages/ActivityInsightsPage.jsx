import { useEffect, useMemo, useState } from 'react';
import { apiRequest } from '../utils/apiClient';

function normalizeRoleLabel(value) {
  if (!value) return '-';
  const v = String(value).toLowerCase();
  if (v === 'admin') return 'Administrator';
  if (v === 'profesor') return 'Profesor';
  if (v === 'teacher') return 'Profesor';
  if (v === 'elev') return 'Elev';
  if (v === 'user') return 'Elev';
  return String(value);
}

function formatLastLogin(value) {
  if (!value) return '-';
  const date = new Date(value);
  if (Number.isNaN(date.getTime())) return '-';
  return date.toLocaleString('ro-RO');
}

function ActivityInsightsPage() {
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [selectedUserId, setSelectedUserId] = useState('');
  const [details, setDetails] = useState(null);
  const [detailsLoading, setDetailsLoading] = useState(false);
  const [detailsError, setDetailsError] = useState('');
  const [savingRole, setSavingRole] = useState(false);
  const [draftRole, setDraftRole] = useState('');

  const sortedUsers = useMemo(() => {
    return [...users].sort((a, b) => String(a.email).localeCompare(String(b.email)));
  }, [users]);

  const refreshData = async () => {
    setLoading(true);
    setError('');
    try {
      const data = await apiRequest('/api/users');
      setUsers(Array.isArray(data) ? data : []);
    } catch (err) {
      setError(err?.message || 'Nu s-au putut incarca utilizatorii.');
    } finally {
      setLoading(false);
    }
  };

  const loadDetails = async (userId) => {
    if (!userId) return;
    setDetailsLoading(true);
    setDetailsError('');
    try {
      const data = await apiRequest(`/api/users/${userId}`);
      setDetails(data || null);
      setDraftRole(data?.role || '');
    } catch (err) {
      setDetailsError(err?.message || 'Nu s-au putut incarca detaliile utilizatorului.');
      setDetails(null);
      setDraftRole('');
    } finally {
      setDetailsLoading(false);
    }
  };

  const saveRole = async () => {
    if (!selectedUserId || !draftRole) return;
    setSavingRole(true);
    setDetailsError('');
    try {
      const updated = await apiRequest(`/api/users/${selectedUserId}/role`, {
        method: 'PATCH',
        body: { role: draftRole }
      });
      setDetails(updated || null);
      setUsers((prev) => prev.map((u) => (u.id === selectedUserId ? { ...u, ...updated } : u)));
    } catch (err) {
      setDetailsError(err?.message || 'Nu s-a putut salva rolul.');
    } finally {
      setSavingRole(false);
    }
  };

  useEffect(() => {
    refreshData();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return (
    <section className="page-stack">
      <article className="card page-title-row">
        <div>
          <p className="eyebrow">Administrare</p>
          <h2>Conturi utilizatori</h2>
          <p className="muted">Lista conturilor existente in baza de date.</p>
        </div>
        <div className="actions">
          <button type="button" className="secondary" onClick={refreshData}>
            Reincarca
          </button>
        </div>
      </article>

      <article className="card">
        <h3>Lista conturi</h3>
        {loading ? <p className="muted">Se incarca...</p> : null}
        {error ? <p className="error">{error}</p> : null}
        {!loading && !error && sortedUsers.length === 0 ? (
          <p className="muted">Nu exista conturi in baza de date.</p>
        ) : null}
        {!loading && !error && sortedUsers.length > 0 ? (
          <div className="detail-grid">
            <div className="table-wrap">
              <table>
                <thead>
                  <tr>
                    <th>Email</th>
                    <th>Nume</th>
                    <th>Rol</th>
                    <th>Nickname</th>
                    <th>Ultima conectare</th>
                  </tr>
                </thead>
                <tbody>
                  {sortedUsers.map((user) => (
                    <tr
                      key={user.id}
                      style={{
                        cursor: 'pointer',
                        background: selectedUserId === user.id ? 'rgba(106, 87, 184, 0.08)' : undefined
                      }}
                      onClick={() => {
                        setSelectedUserId(user.id);
                        loadDetails(user.id);
                      }}
                    >
                      <td>{user.email}</td>
                      <td>{user.fullName || '-'}</td>
                      <td>{normalizeRoleLabel(user.role)}</td>
                      <td>{user.nickname || '-'}</td>
                      <td>{formatLastLogin(user.last_login_at)}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>

            <div className="card" style={{ alignSelf: 'start' }}>
              <h3>Detalii cont</h3>
              {!selectedUserId ? <p className="muted">Selecteaza un cont din tabel.</p> : null}
              {detailsLoading ? <p className="muted">Se incarca detaliile...</p> : null}
              {detailsError ? <p className="error">{detailsError}</p> : null}
              {!detailsLoading && !detailsError && details ? (
                <>
                  <div className="list-lines">
                    <div className="line-item">
                      <strong>Email</strong>
                      <span>{details.email}</span>
                    </div>
                    <div className="line-item">
                      <strong>Nume</strong>
                      <span>{details.fullName || '-'}</span>
                    </div>
                    <div className="line-item">
                      <strong>Nickname</strong>
                      <span>{details.nickname || '-'}</span>
                    </div>
                    <div className="line-item">
                      <strong>Rol curent</strong>
                      <span>{normalizeRoleLabel(details.role)}</span>
                    </div>
                    <div className="line-item">
                      <strong>Ultima conectare</strong>
                      <span>{formatLastLogin(details.last_login_at)}</span>
                    </div>
                  </div>

                  <div className="mt-12">
                    <label htmlFor="user-role">Schimba rolul</label>
                    <select
                      id="user-role"
                      value={draftRole || ''}
                      onChange={(e) => setDraftRole(e.target.value)}
                      disabled={savingRole}
                    >
                      <option value="elev">Elev</option>
                      <option value="profesor">Profesor</option>
                      <option value="admin">Administrator</option>
                    </select>
                    <div className="actions mt-8">
                      <button type="button" className="btn" onClick={saveRole} disabled={savingRole || !draftRole}>
                        {savingRole ? 'Salvez...' : 'Salveaza'}
                      </button>
                    </div>
                  </div>
                </>
              ) : null}
            </div>
          </div>
        ) : null}
      </article>
    </section>
  );
}

export default ActivityInsightsPage;

