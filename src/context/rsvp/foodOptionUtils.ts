import {
  FOOD_OPTIONS,
  isValidFoodOption,
} from '../../components/rsvp/utils/foodOptions';

/**
 * Gets the display-friendly name for a food option ID
 * @param optionId - The food option ID (e.g., 'option1', 'option2') or null/undefined
 * @returns The display name (e.g., 'Herb-Crusted Salmon') or undefined if not found or not provided
 */
export function getFoodOptionName(
  optionId?: string | null,
): string | undefined {
  if (!optionId || !isValidFoodOption(optionId)) return;
  return FOOD_OPTIONS.find(option => option.id === optionId)?.name;
}
