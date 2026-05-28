/** So khớp đơn giản cho STT / phát âm demo (0–100). */
export function similarityScore(expected: string, actual: string): number {
  const a = normalize(expected);
  const b = normalize(actual);
  if (!a.length) return 0;
  if (a === b) return 100;
  const aWords = a.split(' ');
  const bWords = new Set(b.split(' '));
  let hits = 0;
  for (const w of aWords) {
    if (bWords.has(w)) hits += 1;
  }
  return Math.round((hits / aWords.length) * 100);
}

function normalize(s: string): string {
  return s
    .toLowerCase()
    .replace(/[^\w\s]/g, '')
    .trim();
}

export function pronunciationFeedback(score: number): string {
  if (score >= 90) return 'Xuất sắc — phát âm rất gần mẫu.';
  if (score >= 70) return 'Khá tốt — luyện thêm trọng âm và nhịp.';
  if (score >= 50) return 'Cần cải thiện — thử nói chậm và rõ hơn.';
  return 'Hãy nghe lại mẫu và thử lại từng cụm từ.';
}
