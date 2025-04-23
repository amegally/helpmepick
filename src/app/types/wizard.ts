export interface ProductRecommendation {
  id: string;
  name: string;
  description: string;
  price?: number;
  imageUrl?: string;
  features?: string[];
  amazonUrl?: string;
} 