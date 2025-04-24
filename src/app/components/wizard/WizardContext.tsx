'use client';

import React, { createContext, useContext, useState, type ReactNode } from 'react';
import { WizardState, ProductRecommendation, WizardStep } from '@/types/wizard';

interface WizardContextType {
  state: WizardState;
  setCategory: (category: string) => void;
  setCriteria: (criteria: string) => void;
  setRecommendations: (recommendations: ProductRecommendation[]) => void;
  nextStep: () => void;
  previousStep: () => void;
  reset: () => void;
}

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
    setState(prev => {
      const steps: WizardStep[] = ['category', 'criteria', 'recommendations', 'results'];
      const currentIndex = steps.indexOf(prev.currentStep);
      const nextStep = steps[currentIndex + 1] || prev.currentStep;
      return { ...prev, currentStep: nextStep };
    });
  };

  const previousStep = () => {
    setState(prev => {
      const steps: WizardStep[] = ['category', 'criteria', 'recommendations', 'results'];
      const currentIndex = steps.indexOf(prev.currentStep);
      const prevStep = steps[currentIndex - 1] || prev.currentStep;
      return { ...prev, currentStep: prevStep };
    });
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