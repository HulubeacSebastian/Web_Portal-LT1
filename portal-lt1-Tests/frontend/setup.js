import '@testing-library/jest-dom';

// JSDOM doesn't implement matchMedia; some hooks rely on it.
Object.defineProperty(window, 'matchMedia', {
  writable: true,
  value: (query) => ({
    matches: false,
    media: query,
    onchange: null,
    addListener: () => {},
    removeListener: () => {},
    addEventListener: () => {},
    removeEventListener: () => {},
    dispatchEvent: () => false
  })
});

// Some UI components use ResizeObserver (not available in JSDOM by default).
class ResizeObserverMock {
  observe() {}
  unobserve() {}
  disconnect() {}
}

globalThis.ResizeObserver = ResizeObserverMock;

// Some pages scroll on navigation/interactions.
window.scrollTo = () => {};
