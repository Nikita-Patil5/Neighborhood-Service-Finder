"""Unit tests for analytics.py (pure pandas logic, no models or network needed)."""
import pandas as pd

from analytics import compute


def month_date(months_ago: int, day: int = 10) -> str:
    """ISO date `months_ago` months before the current month."""
    p = pd.Period(pd.Timestamp.today(), freq="M") - months_ago
    return f"{p.year}-{p.month:02d}-{day:02d}"


def booking(i, date, status="DONE", category="Cleaning", provider="Asha", price=100.0):
    return {"id": i, "date": date, "status": status, "category": category,
            "service": "svc", "provider": provider, "price": price}


def review(rating, sentiment, provider="Asha"):
    return {"rating": rating, "sentiment": sentiment, "provider": provider, "service": "svc"}


def test_empty_input_returns_zeros_and_no_forecast():
    out = compute([], [])
    assert out["kpis"]["total_bookings"] == 0
    assert out["kpis"]["cancellation_rate"] == 0.0
    assert out["kpis"]["avg_rating"] is None
    assert out["bookings_per_month"] == []
    assert out["top_providers"] == []
    assert out["forecast"] is None


def test_kpis_rates_and_revenue():
    b = [
        booking(1, month_date(1), "DONE", price=100),
        booking(2, month_date(1), "DONE", price=200),
        booking(3, month_date(1), "CANCELLED", price=999),   # cancelled jobs earn nothing
        booking(4, month_date(0), "PENDING", price=50),
    ]
    k = compute(b, [])["kpis"]
    assert k["total_bookings"] == 4
    assert k["completed"] == 2
    assert k["cancelled"] == 1
    assert k["cancellation_rate"] == 25.0
    assert k["completion_rate"] == 50.0
    assert k["revenue"] == 300.0


def test_status_breakdown_follows_fixed_order():
    b = [booking(1, month_date(1), "CANCELLED"), booking(2, month_date(1), "DONE"),
         booking(3, month_date(1), "PENDING"), booking(4, month_date(1), "DONE")]
    statuses = [s["status"] for s in compute(b, [])["status_breakdown"]]
    assert statuses == ["PENDING", "DONE", "CANCELLED"]


def test_status_is_case_insensitive():
    out = compute([booking(1, month_date(1), "done")], [])
    assert out["kpis"]["completed"] == 1


def test_demand_by_category_sorted_descending():
    b = [booking(1, month_date(1), category="Plumbing"),
         booking(2, month_date(1), category="Cleaning"),
         booking(3, month_date(1), category="Cleaning")]
    demand = compute(b, [])["demand_by_category"]
    assert demand[0] == {"category": "Cleaning", "count": 2}
    assert demand[1] == {"category": "Plumbing", "count": 1}


def test_missing_months_are_filled_with_zero():
    b = [booking(1, month_date(3)), booking(2, month_date(1)), booking(3, month_date(1))]
    monthly = compute(b, [])["bookings_per_month"]
    assert [m["bookings"] for m in monthly] == [1, 0, 2]


def test_unparseable_dates_do_not_crash():
    out = compute([booking(1, "not-a-date")], [])
    assert out["kpis"]["total_bookings"] == 1
    assert out["bookings_per_month"] == []


def test_forecast_rising_trend():
    b, i = [], 0
    for months_ago, n in zip([5, 4, 3, 2, 1], [2, 4, 6, 8, 10]):
        for _ in range(n):
            i += 1
            b.append(booking(i, month_date(months_ago)))
    f = compute(b, [])["forecast"]
    assert f["trend"] == "up"
    assert f["predicted"] == 12          # perfect +2/month line
    assert f["months_used"] == 5
    assert f["confidence"] == "medium"
    assert f["note"] is None


def test_forecast_ignores_the_unfinished_current_month():
    b, i = [], 0
    for months_ago, n in zip([4, 3, 2, 1], [4, 6, 8, 10]):
        for _ in range(n):
            i += 1
            b.append(booking(i, month_date(months_ago)))
    b.append(booking(999, month_date(0)))      # only 1 booking so far this month
    f = compute(b, [])["forecast"]
    assert f["next_month"] == pd.Timestamp.today().strftime("%Y-%m")
    assert f["predicted"] == 12                 # partial month did not drag the trend down
    assert f["note"] is not None


def test_forecast_needs_at_least_two_months():
    assert compute([booking(1, month_date(1))], [])["forecast"] is None


def test_top_providers_ranked_with_average_rating():
    b = [booking(1, month_date(1), provider="Asha"), booking(2, month_date(1), provider="Asha"),
         booking(3, month_date(1), provider="Asha"), booking(4, month_date(1), provider="Bala")]
    r = [review(5, "positive", "Asha"), review(3, "neutral", "Asha")]
    top = compute(b, r)["top_providers"]
    assert [p["provider"] for p in top] == ["Asha", "Bala"]
    assert top[0]["avg_rating"] == 4.0
    assert top[0]["reviews"] == 2
    assert top[1]["avg_rating"] is None         # no reviews yet
    assert top[1]["reviews"] == 0


def test_sentiment_split_always_has_three_buckets():
    out = compute([], [review(5, "positive"), review(4, "positive"), review(3, None)])
    split = {s["sentiment"]: s["count"] for s in out["sentiment_split"]}
    assert split == {"positive": 2, "neutral": 0, "negative": 0}
    assert out["kpis"]["positive_pct"] == 100.0   # un-analysed reviews are excluded
