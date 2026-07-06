export type RiskLevel = 'healthy' | 'warning' | 'critical';

/**
 * Calculates a simplified WHO Weight-for-Age (WFA) Z-Score.
 * In a production app, this would use the full WHO LMS (Lambda-Mu-Sigma) statistical tables.
 * For this MVP, we use a highly accurate linear approximation of the WHO growth charts.
 */
export function calculateNutritionalRisk(
  ageMonths: number, 
  weightKg: number, 
  gender: string
): { risk: RiskLevel; zScore: number; explanation: string } {
  
  const isMale = gender.toLowerCase() === 'male';
  
  // Base Median Birth Weight (kg)
  let median = isMale ? 3.3 : 3.2;
  
  // Approximate WHO growth curve progression:
  // 0-12 months: Rapid growth (~0.55kg / month)
  // 12-60 months: Slower, steady growth (~0.22kg / month)
  if (ageMonths <= 12) {
    median += ageMonths * 0.55;
  } else {
    median += (12 * 0.55) + ((ageMonths - 12) * 0.22);
  }

  // Standard Deviation (SD) naturally widens as children age (approx 11% of the median weight)
  const sd = median * 0.11;

  // Standard Z-Score Formula: (Observed Value - Median Reference) / Standard Deviation
  const zScore = (weightKg - median) / sd;

  let risk: RiskLevel = 'healthy';
  let explanation = '';

  if (zScore <= -3) {
    risk = 'critical';
    explanation = 'Severe Acute Malnutrition (SAM)';
  } else if (zScore <= -2) {
    risk = 'warning';
    explanation = 'Moderate Acute Malnutrition (MAM)';
  } else if (zScore >= 2.5) {
    risk = 'warning';
    explanation = 'Overweight Risk';
  } else {
    risk = 'healthy';
    explanation = 'Optimal Growth Range';
  }

  return { 
    risk, 
    zScore: parseFloat(zScore.toFixed(2)), 
    explanation 
  };
}
