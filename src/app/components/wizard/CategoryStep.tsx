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
  const [isValidating, setIsValidating] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const validateAndProceed = async (category: string) => {
    setIsValidating(true);
    setError(null);
    
    try {
      const response = await fetch('/api/wizard/validate', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ query: category }),
      });

      if (!response.ok) {
        throw new Error('Failed to validate category');
      }

      const validation = await response.json();
      
      if (validation.isValid) {
        // Use the normalized category if available, otherwise use the original input
        setCategory(validation.category || category, category);
        nextStep();
      } else {
        setError(validation.reason || 'Please enter a valid product category.');
        if (validation.suggestion) {
          setError(prev => `${prev} Try something like: "${validation.suggestion}"`);
        }
      }
    } catch (err) {
      console.error('Error validating category:', err);
      setError('Failed to validate category. Please try again.');
    } finally {
      setIsValidating(false);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!customCategory.trim()) return;
    await validateAndProceed(customCategory.trim());
  };

  const handleExampleClick = async (description: string) => {
    setCustomCategory(description);
    await validateAndProceed(description);
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
            onChange={(e) => {
              setCustomCategory(e.target.value);
              setError(null);
            }}
            placeholder="e.g., Help me pick the best laptop for video editing"
            className={`w-full px-4 py-3 rounded-lg border ${
              error ? 'border-red-300 focus:ring-red-500 focus:border-red-500' : 'border-gray-300 focus:ring-blue-500 focus:border-blue-500'
            } outline-none transition-colors`}
            required
            disabled={isValidating}
          />
          {error && (
            <p className="mt-2 text-sm text-red-600">{error}</p>
          )}
        </div>
        <button
          type="submit"
          disabled={isValidating}
          className="w-full bg-blue-600 text-white py-3 px-6 rounded-lg hover:bg-blue-700 transition-colors font-medium disabled:opacity-50"
        >
          {isValidating ? (
            <span className="flex items-center justify-center">
              <svg className="animate-spin h-5 w-5 mr-2" viewBox="0 0 24 24">
                <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" fill="none" />
                <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" />
              </svg>
              Validating...
            </span>
          ) : (
            'Next Step'
          )}
        </button>
      </form>

      <div className="space-y-3">
        <p className="text-sm text-gray-500 text-center">Or choose an example:</p>
        <div className="grid gap-3">
          {exampleCategories.map((category) => (
            <motion.button
              key={category.title}
              onClick={() => handleExampleClick(category.description)}
              disabled={isValidating}
              className="w-full text-left p-4 rounded-lg border border-gray-200 hover:border-blue-500 hover:bg-blue-50 transition-colors disabled:opacity-50"
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