export function calculateWordSimilarity(word1: string, word2: string): number {
  if (Math.abs(word1.length - word2.length) > 2) return 0;

  const maxLen = Math.max(word1.length, word2.length);
  if (maxLen < 3) return word1 === word2 ? 1 : 0;

  let matches = 0;
  const minLen = Math.min(word1.length, word2.length);

  // Count matching characters in similar positions
  for (let i = 0; i < minLen; i++) {
    if (word1[i] === word2[i]) matches++;
  }

  // Check for common transpositions (ab vs ba)
  if (word1.length === word2.length && matches === word1.length - 2) {
    for (let i = 0; i < word1.length - 1; i++) {
      if (word1[i] === word2[i + 1] && word1[i + 1] === word2[i]) {
        matches += 1.5; // Bonus for transposition
        break;
      }
    }
  }

  return matches / maxLen;
}
