export interface ProductRecommendation {
  name: string;
  description: string;
  explanation: string;
  price: string;
  amazonUrl: string;
  imageUrl?: string;
  features?: string[];
}

export interface WizardState {
  currentStep: 'category' | 'criteria' | 'recommendations' | 'results';
  category?: string;
  criteria?: string;
  recommendations?: ProductRecommendation[];
  permalink?: string;
} 