import { useState } from 'react';
import {
  clearActivityMonitoring,
  getActivitySnapshot,
  getPreferences,
  getRecentActivityEvents,
  recordActivityEvent
} from '../utils/activityCookies';

function ActivityInsightsPage() {
  const [activity, setActivity] = useState(() => getActivitySnapshot());
  const [preferences, setPreferences] = useState(() => getPreferences());
  const [events, setEvents] = useState(() => getRecentActivityEvents());

  const refreshData = () => {
    recordActivityEvent('insights_refresh');
    setActivity(getActivitySnapshot());
    setPreferences(getPreferences());
    setEvents(getRecentActivityEvents());
  };

  const clearData = () => {
    clearActivityMonitoring();
    setActivity(getActivitySnapshot());
    setPreferences(getPreferences());
    setEvents(getRecentActivityEvents());
  };

  return (
    <section className="page-stack">
      <article className="card page-title-row">
        <div>
          <p className="eyebrow">Cookie Insights</p>
          <h2>Monitorizare activitate si preferinte</h2>
          <p className="muted">Date stocate local in browser prin cookies.</p>
        </div>
        <div className="actions">
          <button type="button" className="secondary" onClick={refreshData}>
            Reincarca
          </button>
          <button type="button" className="danger" onClick={clearData}>
            Sterge monitorizarea
          </button>
        </div>
      </article>

      <article className="card">
        <h3>Activitate utilizator</h3>
        <p>Total navigari: {activity.totalVisits}</p>
        <p>Ultima pagina: {activity.lastPath || '-'}</p>
        <p>Pagini recente: {activity.recentPaths?.length ? activity.recentPaths.join(' | ') : 'Nicio activitate.'}</p>
      </article>

      <article className="card">
        <h3>Preferinte utilizator</h3>
        {Object.keys(preferences).length === 0 ? (
          <p className="muted">Nu exista preferinte salvate.</p>
        ) : (
          <div className="list-lines">
            {Object.entries(preferences).map(([key, value]) => (
              <div key={key} className="line-item">
                <strong>{key}</strong>
                <span>{String(value)}</span>
              </div>
            ))}
          </div>
        )}
      </article>

      <article className="card">
        <h3>Evenimente recente</h3>
        {events.length === 0 ? (
          <p className="muted">Nu exista evenimente inregistrate.</p>
        ) : (
          <div className="list-lines">
            {events.map((event, index) => (
              <div key={`${event.event}-${event.at}-${index}`} className="line-item">
                <div>
                  <strong>{event.event}</strong>
                  <p className="muted">{event.at}</p>
                </div>
                <span>{Object.keys(event.payload || {}).length ? JSON.stringify(event.payload) : '-'}</span>
              </div>
            ))}
          </div>
        )}
      </article>
    </section>
  );
}

export default ActivityInsightsPage;

