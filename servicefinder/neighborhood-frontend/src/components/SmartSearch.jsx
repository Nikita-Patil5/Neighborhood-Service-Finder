import { useState } from "react";
import { smartSearch } from "../api/aiApi";

const EXAMPLES = ["my tap is leaking", "fan not working", "deep clean before festival"];

export default function SmartSearch({ onSelect }) {
  const [query, setQuery] = useState("");
  const [results, setResults] = useState(null);
  const [mode, setMode] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const runSearch = async (text) => {
    const q = (text ?? query).trim();
    if (!q) return;
    setQuery(q);
    setLoading(true);
    setError("");
    try {
      const data = await smartSearch(q);
      setResults(data.services);
      setMode(data.mode);
    } catch {
      setError("Search failed. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="my-4">
      <div className="input-group mb-2">
        <input
          className="form-control"
          placeholder='Describe your problem, e.g. "my tap is leaking"'
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          onKeyDown={(e) => e.key === "Enter" && runSearch()}
        />
        <button className="btn btn-primary" onClick={() => runSearch()} disabled={loading}>
          {loading ? "Searching..." : "🔍 Smart Search"}
        </button>
      </div>

      <div className="mb-3">
        {EXAMPLES.map((ex) => (
          <button key={ex} className="btn btn-sm btn-outline-secondary me-2" onClick={() => runSearch(ex)}>
            {ex}
          </button>
        ))}
      </div>

      {error && <div className="alert alert-danger">{error}</div>}

      {mode === "keyword" && (
        <div className="alert alert-warning py-2">
          AI search is unavailable, showing keyword results instead.
        </div>
      )}
      {mode === "ai" && results && <small className="text-muted">✨ AI-matched results</small>}

      {results && results.length === 0 && <p className="mt-2">No matching services found.</p>}

      <div className="row mt-2">
        {results?.map((s) => (
  <div className="col-md-6 mb-3" key={s.id}>
    <div className="card h-100 shadow-sm">
      <div className="card-body">
        <h5 className="card-title">{s.name}</h5>
        <span className="badge bg-info text-dark mb-2">{s.category}</span>
        <p className="card-text">{s.description}</p>

        <div className="mb-1">
          <strong>₹{s.price}</strong>
          {s.totalReviews > 0 ? (
            <span className="ms-3">⭐ {s.averageRating.toFixed(1)} ({s.totalReviews})</span>
          ) : (
            <span className="ms-3 text-muted">No reviews yet</span>
          )}
        </div>

        <small className="text-muted d-block">👨‍🔧 {s.providerName}</small>
        {s.providerAddress && (
          <small className="text-muted d-block">📍 {s.providerAddress}</small>
        )}
      </div>
      {onSelect && (
        <div className="card-footer bg-white">
          <button className="btn btn-sm btn-success" onClick={() => onSelect(s)}>
            View / Book
          </button>
        </div>
      )}
    </div>
  </div>
))}
      </div>
    </div>
  );
}
