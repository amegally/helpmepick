import { WizardProvider } from './WizardContext';
import { ProgressIndicator } from './ProgressIndicator';
import { CategoryStep } from './CategoryStep';
import { CriteriaStep } from './CriteriaStep';
import { RecommendationsStep } from './RecommendationsStep';
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
          transition={{ 
            duration: 0.4,
            ease: [0.4, 0, 0.2, 1]
          }}
          className="backdrop-blur-lg bg-white/90 dark:bg-gray-800/90 rounded-2xl shadow-xl border border-gray-200/50 dark:border-gray-700/50 p-8"
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