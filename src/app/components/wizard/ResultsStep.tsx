import { useState } from 'react';
import { useWizard } from './WizardContext';
import { motion } from 'framer-motion';

export function ResultsStep() {
  const { state, reset } = useWizard();
  const [copied, setCopied] = useState(false);

  const handleCopyLink = async () => {
    // In a real implementation, this would be a proper permalink
    const shareUrl = `${window.location.origin}?category=${encodeURIComponent(state.category)}&criteria=${encodeURIComponent(state.criteria)}`;
    
    try {
      await navigator.clipboard.writeText(shareUrl);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch (err) {
      console.error('Failed to copy:', err);
    }
  };

  return (
    <div className="space-y-6">
      <div className="text-center">
        <h2 className="text-2xl font-semibold text-gray-900 mb-2">
          All set! Here's your summary
        </h2>
        <p className="text-gray-600">
          You can share these recommendations or start a new search.
        </p>
      </div>

      <div className="bg-gray-50 rounded-lg p-6 space-y-4">
        <div>
          <h3 className="text-sm font-medium text-gray-500">Your Search</h3>
          <p className="text-gray-900 mt-1">{state.category}</p>
        </div>
        <div>
          <h3 className="text-sm font-medium text-gray-500">Your Criteria</h3>
          <p className="text-gray-900 mt-1">{state.criteria}</p>
        </div>
        <div>
          <h3 className="text-sm font-medium text-gray-500">Recommendations</h3>
          <ul className="mt-1 space-y-2">
            {state.recommendations.map((product, index) => (
              <li key={index} className="text-gray-900">
                {product.name} - {product.price}
              </li>
            ))}
          </ul>
        </div>
      </div>

      <div className="flex gap-3">
        <button
          onClick={handleCopyLink}
          className="flex-1 px-6 py-3 border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors font-medium relative"
        >
          {copied ? (
            <motion.span
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -10 }}
            >
              Copied!
            </motion.span>
          ) : (
            'Copy Share Link'
          )}
        </button>
        <button
          onClick={reset}
          className="flex-1 bg-blue-600 text-white py-3 px-6 rounded-lg hover:bg-blue-700 transition-colors font-medium"
        >
          Start New Search
        </button>
      </div>
    </div>
  );
} 