import { WizardProvider } from './WizardContext';
import { ProgressIndicator } from './ProgressIndicator';
import { CategoryStep } from './CategoryStep';
import { CriteriaStep } from './CriteriaStep';
import { RecommendationsStep } from './RecommendationsStep';
import { ResultsStep } from './ResultsStep';
import { useWizard } from './WizardContext';
import { motion, AnimatePresence } from 'framer-motion';

function WizardContent() {
  const { state } = useWizard();

  const renderStep = () => {
    switch (state.currentStep) {
      case 'category':
        return <CategoryStep />;
      case 'criteria':
        return <CriteriaStep />;
      case 'recommendations':
        return <RecommendationsStep />;
      case 'results':
        return <ResultsStep />;
      default:
        return null;
    }
  };

  return (
    <div className="max-w-2xl mx-auto">
      <ProgressIndicator currentStep={state.currentStep} />
      <AnimatePresence mode="wait">
        <motion.div
          key={state.currentStep}
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: -20 }}
          transition={{ duration: 0.3 }}
          className="bg-white rounded-lg shadow-lg p-6"
        >
          {renderStep()}
        </motion.div>
      </AnimatePresence>
    </div>
  );
}

export function Wizard() {
  return (
    <WizardProvider>
      <WizardContent />
    </WizardProvider>
  );
} 