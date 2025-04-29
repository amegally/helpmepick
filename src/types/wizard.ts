export type WizardStep = 'category' | 'criteria' | 'recommendations';

export interface WizardState {
  currentStep: WizardStep;
  category: string;
  originalInput: string;
  criteria: string;
  recommendations: ProductRecommendation[];
}

export interface ProductRecommendation {
  name: string;
  description: string;
  explanation: string;
  price: string;
  rating: number;
  amazonUrl: string;
  personalNote: string;
}

export interface WizardResult {
  id: string;
  createdAt: Date;
  category: string;
  criteria: string;
  recommendations: ProductRecommendation[];
  permalink: string;
}

export interface WizardContextType {
  state: WizardState;
  setCategory: (category: string) => void;
  setCriteria: (criteria: string) => void;
  setRecommendations: (recommendations: ProductRecommendation[]) => void;
  nextStep: () => void;
  previousStep: () => void;
  reset: () => void;
}