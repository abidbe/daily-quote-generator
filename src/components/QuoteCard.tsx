import { type Quote } from "../data/quotes";
import "./QuoteCard.css";

interface QuoteCardProps {
  quote: Quote | null;
  visible: boolean;
  loading: boolean;
}

export default function QuoteCard({ quote, visible, loading }: QuoteCardProps) {
  return (
    <div className="quote-card" aria-live="polite">
      <div className={`quote-content ${visible && !loading ? "fade-in" : "fade-out"}`}>
        {loading ? (
          <div className="quote-loader">
            <span className="dot" />
            <span className="dot" />
            <span className="dot" />
          </div>
        ) : quote ? (
          <>
            <blockquote className="quote-text">
              &ldquo;{quote.text}&rdquo;
            </blockquote>
            <cite className="quote-author">&mdash; {quote.author}</cite>
          </>
        ) : null}
      </div>
    </div>
  );
}
