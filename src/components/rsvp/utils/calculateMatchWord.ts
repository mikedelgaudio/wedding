import { calculateWordSimilarity } from './calculateWordSimilarity';
import { normalizeString } from './normalizeString';

export function calculateMatchScore(
  searchName: string,
  candidateName: string,
): number {
  const normalizedSearch = normalizeString(searchName);
  const normalizedCandidate = normalizeString(candidateName);

  // Exact match gets highest score
  if (normalizedSearch === normalizedCandidate) {
    return 1.0;
  }

  // Full substring match gets high score
  if (normalizedCandidate.includes(normalizedSearch)) {
    return 0.9;
  }

  const searchWords = normalizedSearch.split(/\s+/);
  const candidateWords = normalizedCandidate.split(/\s+/);

  let totalScore = 0;
  let matchedWords = 0;

  for (const searchWord of searchWords) {
    let bestWordScore = 0;

    for (const candidateWord of candidateWords) {
      // Exact word match
      if (searchWord === candidateWord) {
        bestWordScore = Math.max(bestWordScore, 1.0);
      }
      // Substring match (handles partial names like "Mike" -> "Michael")
      else if (
        candidateWord.includes(searchWord) ||
        searchWord.includes(candidateWord)
      ) {
        const longer = Math.max(searchWord.length, candidateWord.length);
        const shorter = Math.min(searchWord.length, candidateWord.length);
        // Give higher score for longer matches
        const lengthRatio = shorter / longer;
        bestWordScore = Math.max(bestWordScore, lengthRatio * 0.85);
      }
      // Common name variations (first names often have nicknames)
      else if (searchWords.length > 1 && candidateWords.length > 1) {
        // Check if this could be a nickname/full name pair
        const isFirstName =
          searchWords.indexOf(searchWord) === 0 ||
          candidateWords.indexOf(candidateWord) === 0;
        if (isFirstName) {
          const similarity = calculateWordSimilarity(searchWord, candidateWord);
          if (similarity > 0.4) {
            // More lenient for first names
            bestWordScore = Math.max(bestWordScore, similarity * 0.6);
          }
        }
      }
      // Fuzzy match for typos (simple Levenshtein-like)
      else {
        const similarity = calculateWordSimilarity(searchWord, candidateWord);
        if (similarity > 0.6) {
          // Allow for 1-2 character differences
          bestWordScore = Math.max(bestWordScore, similarity * 0.7);
        }
      }
    }

    if (bestWordScore > 0) {
      matchedWords++;
      totalScore += bestWordScore;
    }
  }

  // Require at least one word to match and return average score
  if (matchedWords === 0) return 0;

  const avgScore = totalScore / searchWords.length;
  // Bonus for matching more words, but don't penalize too much for single matches (like last name only)
  const wordMatchRatio = matchedWords / searchWords.length;

  return avgScore * Math.max(wordMatchRatio, 0.5); // Minimum 50% weight even for partial matches
}
