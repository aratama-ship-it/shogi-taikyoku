export function pickRandomPuzzleIndex(entries, currentIndex, randomValue = Math.random()) {
  const indexes = entries
    .map((entry) => (typeof entry === "number" ? entry : entry?.index))
    .filter(Number.isInteger);

  if (!indexes.length) return null;

  const candidates = indexes.length > 1
    ? indexes.filter((index) => index !== currentIndex)
    : indexes;
  const available = candidates.length ? candidates : indexes;
  const normalized = Number.isFinite(randomValue)
    ? Math.max(0, Math.min(randomValue, 0.999999999999))
    : 0;

  return available[Math.floor(normalized * available.length)];
}
