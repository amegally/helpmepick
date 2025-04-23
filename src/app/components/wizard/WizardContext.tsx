import { createContext, useContext, useState, ReactNode } from 'react';
import { WizardState, WizardContextType, ProductRecommendation } from '@/types/wizard';

const initialState: WizardState = {
  currentStep: 'category',
  category: '',
  criteria: '',
  recommendations: [],
};

const WizardContext = createContext<WizardContextType | undefined>(undefined);

export function WizardProvider({ children }: { children: ReactNode }) {
  const [state, setState] = useState<WizardState>(initialState);

  const setCategory = (category: string) => {
    setState(prev => ({ ...prev, category }));
  };

  const setCriteria = (criteria: string) => {
    setState(prev => ({ ...prev, criteria }));
  };

  const setRecommendations = (recommendations: ProductRecommendation[]) => {
    setState(prev => ({ ...prev, recommendations }));
  };

  const nextStep = () => {
    const steps: Record<string, string> = {
      'category': 'criteria',
      'criteria': 'recommendations',
      'recommendations': 'results',
    };
    setState(prev => ({
      ...prev,
      currentStep: steps[prev.currentStep] as WizardState['currentStep'] || prev.currentStep,
    }));
  };

  const previousStep = () => {
    const steps: Record<string, string> = {
      'criteria': 'category',
      'recommendations': 'criteria',
      'results': 'recommendations',
    };
    setState(prev => ({
      ...prev,
      currentStep: steps[prev.currentStep] as WizardState['currentStep'] || prev.currentStep,
    }));
  };

  const reset = () => {
    setState(initialState);
  };

  return (
    <WizardContext.Provider
      value={{
        state,
        setCategory,
        setCriteria,
        setRecommendations,
        nextStep,
        previousStep,
        reset,
      }}
    >
      {children}
    </WizardContext.Provider>
  );
}

export function useWizard() {
  const context = useContext(WizardContext);
  if (context === undefined) {
    throw new Error('useWizard must be used within a WizardProvider');
  }
  return context;
} 