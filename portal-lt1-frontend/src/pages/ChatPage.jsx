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
  const [chatReady, setChatReady] = useState(false);
  const [error, setError] = useState('');
  const wsRef = useRef(null);
  const messagesRef = useRef(null);
  const shouldAutoScrollRef = useRef(true);

  const userId = session?.id ?? '';
  const permissionsKey = (session?.permissions ?? []).join(',');

  useEffect(() => {
    if (!isLoggedIn || !canChat || !token) return undefined;

    let cancelled = false;
    const ws = new WebSocket(wsUrl);
    wsRef.current = ws;
    setStatus('Conectare...');
    setChatReady(false);
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
          setChatReady(true);
        }
        if (payload.type === 'chat_join_ok') {
          setChatReady(true);
        }
        if (payload.type === 'chat_message' && payload.message) {
          setMessages((prev) => {
            if (prev.some((item) => item.id === payload.message.id)) return prev;
            return [...prev, payload.message];
          });
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
      if (wsRef.current === ws) {
        wsRef.current = null;
      }
      if (!cancelled) {
        setChatReady(false);
        setStatus('Deconectat');
      }
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

  useEffect(() => {
    if (!chatReady) return;
    if (!shouldAutoScrollRef.current) return;
    const node = messagesRef.current;
    if (!node) return;

    const doScroll = () => {
      node.scrollTop = node.scrollHeight;
    };

    // wait for DOM paint (new messages) then snap to bottom
    requestAnimationFrame(doScroll);
  }, [chatReady, messages.length]);

  const handleSubmit = (event) => {
    event.preventDefault();
    const text = draft.trim();
    const socket = wsRef.current;

    if (!text) return;

    if (!socket || socket.readyState !== WebSocket.OPEN) {
      setError('Conexiunea s-a intrerupt. Reincarca pagina Chat.');
      setChatReady(false);
      setStatus('Deconectat');
      return;
    }

    if (!chatReady) {
      setError('Chat-ul se initializeaza. Asteapta cateva secunde si incearca din nou.');
      return;
    }

    socket.send(JSON.stringify({ type: 'chat_message', text }));
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
      <header className="chat-hero" aria-labelledby="chat-hero-title">
        <img
          src="/assets/poza_liceu.jpeg"
          alt=""
          className="chat-hero-media"
          aria-hidden="true"
        />
        <div className="chat-hero-scrim" aria-hidden="true" />
        <div className="chat-hero-content">
          <span className="chat-hero-badge">Comunicare scolara</span>
          <h1 id="chat-hero-title">
            Chat <span className="chat-hero-title-gradient">in timp real</span>
          </h1>
          <p className="chat-hero-lead">
            Conectat ca <strong>{session.fullName}</strong> ({session.role}){' '}
            <span
              className={`chat-status chat-status--${
                status === 'Conectat' ? 'ok' : status === 'Eroare' ? 'error' : 'warn'
              }`}
            >
              {status}
            </span>
          </p>
          <p className="muted chat-ws">WebSocket: {wsUrl}</p>
        </div>
      </header>

      <div className="chat-panel">
        <ul
          className="chat-messages"
          aria-live="polite"
          ref={messagesRef}
          onScroll={(event) => {
            const node = event.currentTarget;
            const distanceFromBottom = node.scrollHeight - node.scrollTop - node.clientHeight;
            shouldAutoScrollRef.current = distanceFromBottom < 80;
          }}
        >
          {messages.map((item) => (
            <li
              key={item.id}
              className={`chat-message chat-message--${item.role}${
                item.userId && session?.id && item.userId === session.id ? ' chat-message--me' : ''
              }`}
            >
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
          <button type="submit" className="chat-send" disabled={status !== 'Conectat' || !chatReady}>
            Trimite
          </button>
        </form>

        {error ? <p className="error">{error}</p> : null}
      </div>
    </section>
  );
}

export default ChatPage;
