export type WizardStep = 'category' | 'criteria' | 'recommendations' | 'results';

export interface WizardState {
  currentStep: WizardStep;
  category: string;
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