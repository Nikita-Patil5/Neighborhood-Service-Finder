"""Admin analytics computed with pandas (KPIs, trends, rankings, simple forecast)."""
import numpy as np
import pandas as pd

STATUS_ORDER = ["PENDING", "CONFIRMED", "DONE", "CANCELLED"]
SENTIMENTS = ["positive", "neutral", "negative"]
BOOKING_COLS = ["id", "date", "status", "category", "service", "provider", "price"]
REVIEW_COLS = ["rating", "sentiment", "provider", "service"]


def _num(v, digits=2):
    """numpy/NaN-safe number for JSON."""
    if v is None:
        return None
    try:
        if np.isnan(v):
            return None
    except TypeError:
        pass
    return round(float(v), digits)


def _forecast(monthly: pd.Series):
    """Linear trend over the last (up to) 6 full months -> estimate for the next month.

    If the latest month is the current, still-running month, it is left out of the
    fit (it is incomplete and would drag the trend down) and becomes the forecast target.
    """
    if len(monthly) < 2:
        return None

    current = pd.Period(pd.Timestamp.today(), freq="M")
    train, target, note = monthly, monthly.index[-1] + 1, None
    if monthly.index[-1] >= current and len(monthly) >= 3:
        train, target = monthly.iloc[:-1], monthly.index[-1]
        note = "Current month is still in progress, so it was excluded from the trend."

    y = train.values[-6:].astype(float)
    if len(y) < 2:
        return None
    x = np.arange(len(y))
    slope, intercept = np.polyfit(x, y, 1)
    predicted = max(0.0, slope * len(y) + intercept)
    trend = "up" if slope > 0.5 else "down" if slope < -0.5 else "flat"
    return {
        "next_month": str(target),
        "predicted": int(round(predicted)),
        "trend": trend,
        "months_used": int(len(y)),
        "confidence": "medium" if len(y) >= 4 else "low",
        "method": "Linear trend on recent monthly bookings",
        "note": note,
    }


def compute(bookings: list, reviews: list) -> dict:
    b = pd.DataFrame(bookings, columns=BOOKING_COLS)
    r = pd.DataFrame(reviews, columns=REVIEW_COLS)

    b["status"] = b["status"].fillna("UNKNOWN").astype(str).str.upper()
    b["category"] = b["category"].fillna("").replace("", "Uncategorized")
    b["provider"] = b["provider"].fillna("").replace("", "Unknown")
    b["price"] = pd.to_numeric(b["price"], errors="coerce").fillna(0.0)
    b["date"] = pd.to_datetime(b["date"], errors="coerce")
    r["rating"] = pd.to_numeric(r["rating"], errors="coerce")
    r["provider"] = r["provider"].fillna("").replace("", "Unknown")

    total = len(b)
    done = int((b["status"] == "DONE").sum())
    cancelled = int((b["status"] == "CANCELLED").sum())
    analyzed = int(r["sentiment"].notna().sum())
    positive = int((r["sentiment"] == "positive").sum())

    kpis = {
        "total_bookings": total,
        "completed": done,
        "cancelled": cancelled,
        "cancellation_rate": round(100 * cancelled / total, 1) if total else 0.0,
        "completion_rate": round(100 * done / total, 1) if total else 0.0,
        "revenue": _num(b.loc[b["status"] == "DONE", "price"].sum()),
        "total_reviews": int(len(r)),
        "avg_rating": _num(r["rating"].mean()) if len(r) else None,
        "positive_pct": round(100 * positive / analyzed, 1) if analyzed else None,
    }

    # status breakdown
    counts = b["status"].value_counts().to_dict()
    ordered = [s for s in STATUS_ORDER if s in counts] + [s for s in counts if s not in STATUS_ORDER]
    status_breakdown = [{"status": s, "count": int(counts[s])} for s in ordered]

    # demand by category
    demand = b["category"].value_counts()
    demand_by_category = [{"category": k, "count": int(v)} for k, v in demand.items()]

    # bookings per month (gaps filled with 0)
    valid = b.dropna(subset=["date"]).copy()
    bookings_per_month, forecast = [], None
    if len(valid):
        valid["month"] = valid["date"].dt.to_period("M")
        monthly = valid.groupby("month").size()
        full = pd.period_range(monthly.index.min(), monthly.index.max(), freq="M")
        monthly = monthly.reindex(full, fill_value=0)
        bookings_per_month = [{"month": str(p), "bookings": int(v)} for p, v in monthly.items()]
        forecast = _forecast(monthly)

    # sentiment split
    sent_counts = r["sentiment"].value_counts().to_dict()
    sentiment_split = [{"sentiment": s, "count": int(sent_counts.get(s, 0))} for s in SENTIMENTS]

    # top providers
    prov = b.groupby("provider").agg(
        bookings=("provider", "size"),
        completed=("status", lambda s: int((s == "DONE").sum())),
    )
    rv = r.groupby("provider").agg(avg_rating=("rating", "mean"), reviews=("rating", "count"))
    prov = prov.join(rv, how="left")
    prov["reviews"] = prov["reviews"].fillna(0)
    prov = prov.sort_values(["bookings", "avg_rating"], ascending=[False, False]).head(5)
    top_providers = [
        {
            "provider": name,
            "bookings": int(row["bookings"]),
            "completed": int(row["completed"]),
            "avg_rating": _num(row["avg_rating"]),
            "reviews": int(row["reviews"]),
        }
        for name, row in prov.iterrows()
    ]

    return {
        "kpis": kpis,
        "status_breakdown": status_breakdown,
        "demand_by_category": demand_by_category,
        "bookings_per_month": bookings_per_month,
        "sentiment_split": sentiment_split,
        "top_providers": top_providers,
        "forecast": forecast,
    }