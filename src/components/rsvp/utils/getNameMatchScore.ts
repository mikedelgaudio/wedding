export function getNameMatchScore(params: {
  sanitizedUserInputFirstName: string;
  sanitizedUserInputLastName: string;
  fullNameToCompare: string | null;
}): number {
  const {
    sanitizedUserInputFirstName,
    sanitizedUserInputLastName,
    fullNameToCompare,
  } = params;

  if (!fullNameToCompare) {
    return 0;
  }

  const nameLower = fullNameToCompare.toLowerCase();
  const nameParts = nameLower.split(' ');

  let score = 0;

  // Exact first name match
  if (nameParts.some(part => part === sanitizedUserInputFirstName)) {
    score += 10;
  }
  // Partial first name match
  else if (
    nameParts.some(
      part =>
        part.includes(sanitizedUserInputFirstName) ||
        sanitizedUserInputFirstName.includes(part),
    )
  ) {
    score += 5;
  }

  // Exact last name match
  if (nameParts.some(part => part === sanitizedUserInputLastName)) {
    score += 10;
  }
  // Partial last name match
  else if (
    nameParts.some(
      part =>
        part.includes(sanitizedUserInputLastName) ||
        sanitizedUserInputLastName.includes(part),
    )
  ) {
    score += 5;
  }

  // Bonus for full name containing both search terms
  if (
    nameLower.includes(sanitizedUserInputFirstName) &&
    nameLower.includes(sanitizedUserInputLastName)
  ) {
    score += 3;
  }

  return score;
}
