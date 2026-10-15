"""Review sentiment, aspect tagging and spam flagging."""
import re
from transformers import pipeline

_clf = pipeline(
    "sentiment-analysis",
    model="distilbert-base-uncased-finetuned-sst-2-english",
)

NEUTRAL_THRESHOLD = 0.70  # low-confidence predictions are labelled neutral

ASPECTS = {
    "punctuality": ["late", "on time", "punctual", "delay", "prompt", "waited", "early"],
    "price": ["price", "cost", "cheap", "expensive", "charge", "affordable", "overcharg", "fee"],
    "quality": ["quality", "work", "fixed", "repair", "clean", "job", "result", "finish"],
    "behavior": ["polite", "rude", "behav", "friendly", "professional", "respect", "attitude"],
}

URL_RE = re.compile(r"(https?://|www\.)", re.I)
REPEAT_RE = re.compile(r"(.)\1{6,}")


def _label(result) -> str:
    if result["score"] < NEUTRAL_THRESHOLD:
        return "neutral"
    return result["label"].lower()


def _is_spam(text: str) -> bool:
    letters = [c for c in text if c.isalpha()]
    shouty = len(letters) > 15 and sum(c.isupper() for c in letters) / len(letters) > 0.7
    return bool(URL_RE.search(text) or REPEAT_RE.search(text) or shouty)


def analyze(text: str) -> dict:
    text = (text or "").strip()
    if not text:
        return {"sentiment": "neutral", "score": 0.0, "aspects": [], "flagged": False}

    overall = _clf(text, truncation=True, max_length=512)[0]

    # aspect-level sentiment: classify only the sentences that mention an aspect
    sentences = [s.strip() for s in re.split(r"[.!?\n]+", text) if s.strip()]
    hits = []  # (aspect, sentence)
    for s in sentences:
        low = s.lower()
        for aspect, words in ASPECTS.items():
            if any(w in low for w in words):
                hits.append((aspect, s))
    aspects = {}
    if hits:
        preds = _clf([s for _, s in hits], truncation=True, max_length=256)
        for (aspect, _), p in zip(hits, preds):
            aspects[aspect] = _label(p)  # last mention wins

    return {
        "sentiment": _label(overall),
        "score": round(float(overall["score"]), 4),
        "aspects": [f"{a}:{v}" for a, v in aspects.items()],
        "flagged": _is_spam(text),
    }
