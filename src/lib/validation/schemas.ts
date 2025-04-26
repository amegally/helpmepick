import { z } from 'zod';

// Maximum allowed lengths
const MAX_CATEGORY_LENGTH = 200;
const MAX_CRITERIA_LENGTH = 500;

// Validation schemas
export const categorySchema = z.object({
  category: z.string()
    .min(1, "Category is required")
    .max(MAX_CATEGORY_LENGTH, `Category must be ${MAX_CATEGORY_LENGTH} characters or less`)
    .trim(),
});

export const criteriaSchema = z.object({
  criteria: z.string()
    .min(1, "Criteria is required")
    .max(MAX_CRITERIA_LENGTH, `Response must be ${MAX_CRITERIA_LENGTH} characters or less`)
    .trim(),
});

// Type inference
export type CategoryInput = z.infer<typeof categorySchema>;
export type CriteriaInput = z.infer<typeof criteriaSchema>; 