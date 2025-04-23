import { WizardStep } from '@/types/wizard';
import { motion } from 'framer-motion';

interface ProgressIndicatorProps {
  currentStep: WizardStep;
}

const steps: { step: WizardStep; label: string }[] = [
  { step: 'category', label: 'Category' },
  { step: 'criteria', label: 'Criteria' },
  { step: 'recommendations', label: 'Recommendations' },
  { step: 'results', label: 'Results' },
];

export function ProgressIndicator({ currentStep }: ProgressIndicatorProps) {
  const currentStepIndex = steps.findIndex(s => s.step === currentStep);
  const progress = (currentStepIndex + 1) / steps.length * 100;

  return (
    <div className="mb-8">
      <div className="flex justify-between mb-2">
        {steps.map(({ step, label }, index) => (
          <div
            key={step}
            className={`flex flex-col items-center ${
              index <= currentStepIndex ? 'text-blue-600' : 'text-gray-400'
            }`}
          >
            <div
              className={`w-8 h-8 rounded-full flex items-center justify-center mb-2 ${
                index <= currentStepIndex ? 'bg-blue-600 text-white' : 'bg-gray-200'
              }`}
            >
              {index + 1}
            </div>
            <span className="text-sm font-medium">{label}</span>
          </div>
        ))}
      </div>
      <div className="relative h-2 bg-gray-200 rounded-full">
        <motion.div
          className="absolute left-0 h-full bg-blue-600 rounded-full"
          initial={{ width: 0 }}
          animate={{ width: `${progress}%` }}
          transition={{ duration: 0.5, ease: 'easeInOut' }}
        />
      </div>
    </div>
  );
} 