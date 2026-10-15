import { useEffect, useState } from "react";
import { Card, ProgressBar, Badge, Spinner } from "react-bootstrap";
import { getMyInsights } from "../../api/aiApi"; // adjust path if your file lives elsewhere

const cap = (s) => s.charAt(0).toUpperCase() + s.slice(1);

export default function ProviderInsights() {
  const [items, setItems] = useState(null);
  const [failed, setFailed] = useState(false);

  useEffect(() => {
    getMyInsights()
      .then(setItems)
      .catch(() => setFailed(true));
  }, []);

  return (
    <Card className="shadow-lg mt-4">
      <Card.Body>
        <h2 className="card-title mb-4">🤖 Customer Feedback Insights</h2>

        {failed && <p className="text-muted">Could not load insights right now.</p>}
        {!failed && items === null && <Spinner animation="border" size="sm" />}
        {items && items.length === 0 && (
          <p className="text-muted">No reviews yet. Insights appear after customers review your services.</p>
        )}

        {items?.map((s) => {
          const n = s.analyzedReviews || 1;
          return (
            <div key={s.serviceId} className="mb-4 pb-3 border-bottom">
              <div className="d-flex justify-content-between">
                <strong>{s.serviceName}</strong>
                <span className="text-muted">
                  ⭐ {s.averageRating.toFixed(1)} · {s.totalReviews} review{s.totalReviews === 1 ? "" : "s"}
                </span>
              </div>

              <ProgressBar className="my-2" style={{ height: 14 }}>
                <ProgressBar variant="success" now={(s.positive / n) * 100} key="p" />
                <ProgressBar variant="secondary" now={(s.neutral / n) * 100} key="n" />
                <ProgressBar variant="danger" now={(s.negative / n) * 100} key="x" />
              </ProgressBar>
              <small className="text-muted">
                {s.positivePercent}% positive · {s.neutral} neutral · {s.negative} negative
              </small>

              {s.praised.length > 0 && (
                <div className="mt-2">
                  <small className="me-2">👍 Customers praise:</small>
                  {s.praised.map((a) => (
                    <Badge key={a} bg="success" className="me-1">{cap(a)}</Badge>
                  ))}
                </div>
              )}
              {s.criticized.length > 0 && (
                <div className="mt-1">
                  <small className="me-2">⚠️ Needs improvement:</small>
                  {s.criticized.map((a) => (
                    <Badge key={a} bg="danger" className="me-1">{cap(a)}</Badge>
                  ))}
                </div>
              )}
            </div>
          );
        })}
      </Card.Body>
    </Card>
  );
}