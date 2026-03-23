import { useState, useEffect, useCallback } from "react";
import quotes, { type Quote } from "./data/quotes";
import QuoteCard from "./components/QuoteCard";
import "./App.css";

const STORAGE_KEY = "daily-quote-last";
const LOADING_DELAY = 400;

function getRandomQuote(current: Quote | null): Quote {
  if (quotes.length <= 1) return quotes[0];
  let next: Quote;
  do {
    next = quotes[Math.floor(Math.random() * quotes.length)];
  } while (next.text === current?.text);
  return next;
}

function loadSavedQuote(): Quote | null {
  try {
    const saved = localStorage.getItem(STORAGE_KEY);
    if (saved) return JSON.parse(saved) as Quote;
  } catch {
    // ignore
  }
  return null;
}

function saveQuote(quote: Quote): void {
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(quote));
  } catch {
    // ignore
  }
}

export default function App() {
  const [quote, setQuote] = useState<Quote | null>(null);
  const [visible, setVisible] = useState(false);
  const [loading, setLoading] = useState(true);
  const [copied, setCopied] = useState(false);

  // Load initial quote
  useEffect(() => {
    const saved = loadSavedQuote();
    const initial = saved ?? getRandomQuote(null);
    saveQuote(initial);

    const timer = setTimeout(() => {
      setQuote(initial);
      setLoading(false);
      setVisible(true);
    }, LOADING_DELAY);

    return () => clearTimeout(timer);
  }, []);

  const handleNewQuote = useCallback(() => {
    setVisible(false);
    setLoading(true);
    setCopied(false);

    setTimeout(() => {
      const next = getRandomQuote(quote);
      setQuote(next);
      saveQuote(next);
      setLoading(false);
      setVisible(true);
    }, LOADING_DELAY);
  }, [quote]);

  const handleCopy = useCallback(async () => {
    if (!quote) return;
    const text = `"${quote.text}" — ${quote.author}`;
    try {
      await navigator.clipboard.writeText(text);
      setCopied(true);
      setTimeout(() => setCopied(false), 1500);
    } catch {
      // fallback
      const textarea = document.createElement("textarea");
      textarea.value = text;
      document.body.appendChild(textarea);
      textarea.select();
      document.execCommand("copy");
      document.body.removeChild(textarea);
      setCopied(true);
      setTimeout(() => setCopied(false), 1500);
    }
  }, [quote]);

  return (
    <main className="app-container">
      <header className="app-header">
        <p className="app-title">Daily Quote</p>
      </header>

      <QuoteCard quote={quote} visible={visible} loading={loading} />

      <div className="app-actions">
        <button
          id="new-quote-btn"
          className="btn btn-primary"
          onClick={handleNewQuote}
          disabled={loading}
        >
          New Quote
        </button>
        <button
          id="copy-quote-btn"
          className={`btn btn-secondary ${copied ? "btn-copied" : ""}`}
          onClick={handleCopy}
          disabled={!quote || loading}
        >
          {copied ? "Copied!" : "Copy Quote"}
        </button>
      </div>

      <footer className="app-footer">
        <p className="app-footer-text">A quiet moment of inspiration</p>
      </footer>
    </main>
  );
}
