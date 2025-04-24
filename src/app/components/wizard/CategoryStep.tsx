import { useState } from 'react';
import { useWizard } from './WizardContext';
import { motion } from 'framer-motion';

const exampleCategories = [
  { title: 'Camera', description: 'Help me pick the best camera' },
  { title: 'Yoga Mat', description: 'Help me pick the best yoga mat' },
  { title: 'Gift for Mom', description: 'Help me pick the best gift for mom' },
];

export function CategoryStep() {
  const { setCategory, nextStep } = useWizard();
  const [customCategory, setCustomCategory] = useState('');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (customCategory.trim()) {
      setCategory(customCategory.trim());
      nextStep();
    }
  };

  const handleExampleClick = (description: string) => {
    setCustomCategory(description);
    setCategory(description);
    nextStep();
  };

  return (
    <div className="space-y-6">
      <div className="text-center">
        <h2 className="text-2xl font-semibold text-gray-900 mb-2">
          What do you want help picking?
        </h2>
        <p className="text-gray-600">
          Tell us what you&apos;re looking for or choose from our examples below
        </p>
      </div>

      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <label htmlFor="category" className="sr-only">
            Category
          </label>
          <input
            type="text"
            id="category"
            value={customCategory}
            onChange={(e) => setCustomCategory(e.target.value)}
            placeholder="e.g., Help me pick the best laptop for video editing"
            className="w-full px-4 py-3 rounded-lg border border-gray-300 focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition-colors"
            required
          />
        </div>
        <button
          type="submit"
          className="w-full bg-blue-600 text-white py-3 px-6 rounded-lg hover:bg-blue-700 transition-colors font-medium"
        >
          Next Step
        </button>
      </form>

      <div className="space-y-3">
        <p className="text-sm text-gray-500 text-center">Or choose an example:</p>
        <div className="grid gap-3">
          {exampleCategories.map((category) => (
            <motion.button
              key={category.title}
              onClick={() => handleExampleClick(category.description)}
              className="w-full text-left p-4 rounded-lg border border-gray-200 hover:border-blue-500 hover:bg-blue-50 transition-colors"
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
            >
              <h3 className="font-medium text-gray-900">{category.title}</h3>
              <p className="text-sm text-gray-600">{category.description}</p>
            </motion.button>
          ))}
        </div>
      </div>
    </div>
  );
} 