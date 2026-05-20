import { useEffect, useRef, useState } from 'react';
import { Link } from 'react-router-dom';
import { AUTH_TOKEN_KEY, getWsOrigin } from '../utils/apiClient';
import { loadAuthSession } from '../utils/authSession';
import { getCookie } from '../utils/cookies';

function ChatPage() {
  const session = loadAuthSession();
  const token = localStorage.getItem(AUTH_TOKEN_KEY);
  const isLoggedIn = Boolean(getCookie('portal_user') && token && session);
  const canChat = Boolean(session?.permissions?.includes('chat:use'));

  const [messages, setMessages] = useState([]);
  const [draft, setDraft] = useState('');
  const [status, setStatus] = useState('Deconectat');
  const [error, setError] = useState('');
  const wsRef = useRef(null);

  useEffect(() => {
    if (!isLoggedIn || !canChat) return undefined;

    const ws = new WebSocket(getWsOrigin());
    wsRef.current = ws;
    setStatus('Conectare...');

    ws.onopen = () => {
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
        }
      } catch {
        // ignore malformed payloads
      }
    };

    ws.onclose = () => {
      setStatus('Deconectat');
      wsRef.current = null;
    };

    ws.onerror = () => {
      setError('Nu s-a putut conecta la serverul de chat. Verifica MongoDB si backend-ul.');
      setStatus('Eroare');
    };

    return () => {
      ws.close();
    };
  }, [isLoggedIn, canChat, token, session]);

  const handleSubmit = (event) => {
    event.preventDefault();
    const text = draft.trim();
    if (!text || !wsRef.current || wsRef.current.readyState !== WebSocket.OPEN) return;

    wsRef.current.send(JSON.stringify({ type: 'chat_message', text }));
    setDraft('');
    setError('');
  };

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
        <p>Contul tau nu are permisiunea <code>chat:use</code>.</p>
      </section>
    );
  }

  return (
    <section className="page-shell chat-page">
      <header className="page-head">
        <h1>Chat in timp real</h1>
        <p>
          Conectat ca <strong>{session.fullName}</strong> ({session.role}) — {status}
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
        <p className="auth-note">
          Pentru demonstratie Silver: deschide chat-ul cu <strong>admin</strong> pe un PC si cu{' '}
          <strong>user</strong> pe altul (ex. elev@lt1.ro dupa ce adaugi cont).
        </p>
      </div>
    </section>
  );
}

export default ChatPage;
