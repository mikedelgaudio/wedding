// Food options configuration
export const FOOD_OPTIONS = [
  {
    id: 'option1',
    name: 'Herb-Crusted Salmon',
    description:
      'Fresh Atlantic salmon with herb crust, roasted vegetables, and lemon butter sauce',
  },
  {
    id: 'option2',
    name: 'Grilled Chicken Breast',
    description:
      'Free-range chicken breast with rosemary, seasonal vegetables, and garlic mashed potatoes',
  },
  {
    id: 'option3',
    name: 'Steak',
    description:
      'Juicy grilled steak with chimichurri sauce, served with roasted potatoes and seasonal vegetables',
  },
  {
    id: 'option4',
    name: 'Vegetarian Risotto',
    description:
      'Creamy wild mushroom risotto with truffle oil, roasted vegetables, and fresh herbs',
  },
  {
    id: 'unknown',
    name: "I don't know",
    description:
      'We will contact you to discuss dietary preferences and options',
  },
] as const;

export type FoodOptionId =
  | 'option1'
  | 'option2'
  | 'option3'
  | 'option4'
  | 'unknown';

// Type guard to validate food option values
export function isValidFoodOption(
  value: string | null,
): value is FoodOptionId | null {
  if (value === null) return true;
  return FOOD_OPTIONS.some(option => option.id === value);
}
