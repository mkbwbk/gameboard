const DEFAULT_RATING = 1200;
const K_FACTOR = 32;

export function getExpectedScore(ratingA: number, ratingB: number): number {
  return 1 / (1 + Math.pow(10, (ratingB - ratingA) / 400));
}

export function calculateNewRatings(
  ratingA: number,
  ratingB: number,
  scoreA: number // 1 = win, 0.5 = draw, 0 = loss
): { newRatingA: number; newRatingB: number } {
  const expectedA = getExpectedScore(ratingA, ratingB);
  const expectedB = 1 - expectedA;
  const scoreB = 1 - scoreA;

  return {
    newRatingA: Math.round(ratingA + K_FACTOR * (scoreA - expectedA)),
    newRatingB: Math.round(ratingB + K_FACTOR * (scoreB - expectedB)),
  };
}

export { DEFAULT_RATING, K_FACTOR };
