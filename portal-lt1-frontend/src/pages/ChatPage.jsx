import { useEffect, useMemo, useRef, useState } from 'react';
import { Link } from 'react-router-dom';
import { AUTH_TOKEN_KEY, getWsOrigin } from '../utils/apiClient';
import { loadAuthSession } from '../utils/authSession';
import { getCookie } from '../utils/cookies';

function ChatPage() {
  const [authVersion, setAuthVersion] = useState(0);
  const session = useMemo(() => loadAuthSession(), [authVersion]);

  useEffect(() => {
    const onAuthChange = () => setAuthVersion((value) => value + 1);
    window.addEventListener('portal-auth-changed', onAuthChange);
    return () => window.removeEventListener('portal-auth-changed', onAuthChange);
  }, []);
  const token = localStorage.getItem(AUTH_TOKEN_KEY);
  const isLoggedIn = Boolean(getCookie('portal_user') && token && session);
  const canChat = Boolean(session?.permissions?.includes('chat:use'));
  const wsUrl = getWsOrigin();

  const [messages, setMessages] = useState([]);
  const [draft, setDraft] = useState('');
  const [status, setStatus] = useState('Deconectat');
  const [error, setError] = useState('');
  const wsRef = useRef(null);

  const userId = session?.id ?? '';
  const permissionsKey = (session?.permissions ?? []).join(',');

  useEffect(() => {
    if (!isLoggedIn || !canChat || !token) return undefined;

    let cancelled = false;
    const ws = new WebSocket(wsUrl);
    wsRef.current = ws;
    setStatus('Conectare...');
    setError('');

    ws.onopen = () => {
      if (cancelled) return;
      setError('');
      setStatus('Conectat');
      ws.send(
        JSON.stringify({
          type: 'chat_join',
          token,
          displayName: session.fullName || session.email
        })
      );
    };

    ws.onmessage = (event) => {
      try {
        const payload = JSON.parse(event.data);
        if (payload.type === 'chat_history') {
          setMessages(payload.messages || []);
        }
        if (payload.type === 'chat_message' && payload.message) {
          setMessages((prev) => [...prev, payload.message]);
        }
        if (payload.type === 'chat_error') {
          setError(payload.message || 'Eroare chat.');
          setStatus('Eroare');
        }
      } catch {
        // ignore malformed payloads
      }
    };

    ws.onclose = () => {
      if (!cancelled) {
        setStatus('Deconectat');
      }
      wsRef.current = null;
    };

    ws.onerror = () => {
      if (cancelled || ws.readyState === WebSocket.OPEN) return;
      setError(`Nu s-a putut conecta la ${wsUrl}. Verifica backend-ul (port 3000) si firewall-ul Windows.`);
      setStatus('Eroare');
    };

    return () => {
      cancelled = true;
      ws.close();
    };
  }, [isLoggedIn, canChat, token, userId, permissionsKey, wsUrl, session?.fullName, session?.email]);

  const handleSubmit = (event) => {
    event.preventDefault();
    const text = draft.trim();
    if (!text || !wsRef.current || wsRef.current.readyState !== WebSocket.OPEN) return;

    wsRef.current.send(JSON.stringify({ type: 'chat_message', text }));
    setDraft('');
    setError('');
  };

  if (getCookie('portal_user') && token && !session) {
    return (
      <section className="page-shell">
        <h1>Chat scolar</h1>
        <p>Sesiunea e veche. Delogheaza-te si autentifica-te din nou pentru a activa chat-ul.</p>
        <Link to="/login" className="btn">
          Reautentificare
        </Link>
      </section>
    );
  }

  if (!isLoggedIn) {
    return (
      <section className="page-shell">
        <h1>Chat scolar</h1>
        <p>Trebuie sa fii autentificat pentru a folosi chat-ul.</p>
        <Link to="/login" className="btn">
          Autentificare
        </Link>
      </section>
    );
  }

  if (!canChat) {
    return (
      <section className="page-shell">
        <h1>Chat scolar</h1>
        <p>Contul tau nu are permisiunea chat:use. Reautentifica-te dupa migrarea Silver.</p>
        <Link to="/login" className="btn">
          Autentificare
        </Link>
      </section>
    );
  }

  return (
    <section className="page-shell chat-page">
      <header className="page-head">
        <h1>Chat in timp real</h1>
        <p>
          Conectat ca <strong>{session.fullName}</strong> ({session.role}) — <strong>{status}</strong>
        </p>
        <p className="muted" style={{ fontSize: '0.85rem' }}>
          WebSocket: {wsUrl}
        </p>
      </header>

      <div className="chat-panel">
        <ul className="chat-messages" aria-live="polite">
          {messages.map((item) => (
            <li key={item.id} className={`chat-message chat-message--${item.role}`}>
              <span className="chat-message-meta">
                {item.displayName} · {new Date(item.sentAt).toLocaleTimeString('ro-RO')}
              </span>
              <p>{item.text}</p>
            </li>
          ))}
        </ul>

        <form className="chat-form" onSubmit={handleSubmit}>
          <label htmlFor="chat-input">Mesaj</label>
          <textarea
            id="chat-input"
            rows={3}
            maxLength={500}
            value={draft}
            onChange={(event) => setDraft(event.target.value)}
            placeholder="Scrie un mesaj pentru ceilalti utilizatori conectati..."
          />
          <button type="submit" className="btn" disabled={status !== 'Conectat'}>
            Trimite
          </button>
        </form>

        {error ? <p className="error">{error}</p> : null}
      </div>
    </section>
  );
}

export default ChatPage;
