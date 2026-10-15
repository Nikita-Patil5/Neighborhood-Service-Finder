// Small sentiment badge + aspect tags for one review.
// Usage: <ReviewInsights review={r} />   (user dashboard: flagText="Under review, hidden from public")
const COLORS = { positive: "success", neutral: "secondary", negative: "danger" };
const ICONS = { positive: "😊", neutral: "😐", negative: "😞" };

const cap = (s) => s.charAt(0).toUpperCase() + s.slice(1);

export default function ReviewInsights({ review, flagText = "⚠ Flagged as suspicious" }) {
  if (!review) return null;

  const aspects = (review.aspects || "")
    .split(",")
    .filter(Boolean)
    .map((a) => a.split(":"));

  if (!review.sentiment && !review.flagged) return null;

  return (
    <div className="mt-1">
      {review.sentiment && (
        <span className={`badge bg-${COLORS[review.sentiment] || "secondary"} me-2`}>
          {ICONS[review.sentiment]} {cap(review.sentiment)}
        </span>
      )}
      {aspects.map(([name, value]) => (
        <span
          key={name}
          className={`badge bg-light border text-${COLORS[value] || "secondary"} me-1`}
          title={`${cap(name)}: ${value}`}
        >
          {cap(name)}
        </span>
      ))}
      {review.flagged && <span className="badge bg-warning text-dark ms-1">{flagText}</span>}
    </div>
  );
}