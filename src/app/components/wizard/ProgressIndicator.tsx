import { motion } from 'framer-motion';

type WizardStep = 'category' | 'criteria' | 'recommendations';

interface ProgressIndicatorProps {
  currentStep: WizardStep;
}

const steps: { step: WizardStep; label: string }[] = [
  { step: 'category', label: 'Category' },
  { step: 'criteria', label: 'Criteria' },
  { step: 'recommendations', label: 'Clarity' },
];

export function ProgressIndicator({ currentStep }: ProgressIndicatorProps) {
  const currentStepIndex = steps.findIndex(s => s.step === currentStep);
  const progress = (currentStepIndex + 1) / steps.length * 100;

  return (
    <div className="mb-6 sm:mb-12">
      <div className="flex justify-between mb-2 sm:mb-4">
        {steps.map(({ step, label }, index) => (
          <div
            key={step}
            className={`flex flex-col items-center ${
              index <= currentStepIndex ? 'text-blue-600 dark:text-blue-400' : 'text-gray-400 dark:text-gray-500'
            }`}
          >
            <motion.div
              initial={false}
              animate={{
                scale: index <= currentStepIndex ? 1 : 0.9,
                opacity: index <= currentStepIndex ? 1 : 0.5,
              }}
              className={`w-8 h-8 sm:w-10 sm:h-10 rounded-full flex items-center justify-center mb-2 sm:mb-3 ${
                index <= currentStepIndex 
                  ? 'bg-blue-100 dark:bg-blue-900/30 text-blue-600 dark:text-blue-400 ring-2 ring-blue-600 dark:ring-blue-400' 
                  : 'bg-gray-100 dark:bg-gray-800'
              }`}
            >
              <span className="text-sm sm:text-base">{index + 1}</span>
            </motion.div>
            <span className="text-xs sm:text-sm font-medium whitespace-nowrap">{label}</span>
          </div>
        ))}
      </div>
      <div className="relative h-1.5 sm:h-2 bg-gray-100 dark:bg-gray-800 rounded-full overflow-hidden">
        <motion.div
          className="absolute left-0 h-full bg-gradient-to-r from-blue-600 to-indigo-600"
          initial={{ width: 0 }}
          animate={{ width: `${progress}%` }}
          transition={{ duration: 0.5, ease: [0.4, 0, 0.2, 1] }}
        />
      </div>
    </div>
  );
} 