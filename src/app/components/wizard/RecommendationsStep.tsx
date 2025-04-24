import { useEffect, useState } from 'react';
import { useWizard } from './WizardContext';
import { motion } from 'framer-motion';
import { ProductRecommendation } from '@/types/wizard';
import { generateAmazonAffiliateUrl } from '@/lib/api/amazon';

export function RecommendationsStep() {
  const { state, setRecommendations, nextStep, previousStep } = useWizard();
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    let isSubscribed = true; // For cleanup

    async function fetchRecommendations() {
      if (!state.category || !state.criteria) {
        return;
      }

      try {
        const response = await fetch('/api/wizard/recommendations', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            category: state.category,
            criteria: state.criteria,
          }),
        });

        if (!response.ok) {
          throw new Error('Failed to fetch recommendations');
        }

        const data = await response.json();
        if (!isSubscribed) return;

        // Process recommendations to add affiliate links using search
        const processedRecommendations = data.recommendations.map((rec: ProductRecommendation) => ({
          ...rec,
          amazonUrl: generateAmazonAffiliateUrl(rec.name),
        }));
        setRecommendations(processedRecommendations);
      } catch (err) {
        console.error('Error fetching recommendations:', err);
        if (isSubscribed) {
          setError('Failed to load recommendations. Please try again.');
        }
      } finally {
        if (isSubscribed) {
          setLoading(false);
        }
      }
    }

    fetchRecommendations();

    return () => {
      isSubscribed = false;
    };
  }, [state.category, state.criteria]); // Removed setRecommendations from dependencies

  if (loading) {
    return (
      <div className="space-y-6">
        <div className="text-center">
          <h2 className="text-2xl font-semibold text-gray-900 mb-2">
            Finding the perfect recommendations...
          </h2>
          <p className="text-gray-600">
            We're analyzing your preferences to find the best options.
          </p>
        </div>
        <div className="flex justify-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="space-y-6">
        <div className="text-center">
          <h2 className="text-2xl font-semibold text-red-600 mb-2">
            Oops! Something went wrong
          </h2>
          <p className="text-gray-600">{error}</p>
        </div>
        <div className="flex justify-center">
          <button
            onClick={previousStep}
            className="px-6 py-3 border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors font-medium"
          >
            Go Back
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-2xl font-semibold text-gray-900 mb-2">
          Here are our recommendations
        </h2>
        <p className="text-gray-600">
          Based on your preferences, we think these options would be perfect for you.
        </p>
      </div>

      <div className="grid gap-6">
        {state.recommendations.map((product, index) => (
          <motion.div
            key={index}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: index * 0.1 }}
            className="bg-white rounded-lg border border-gray-200 overflow-hidden hover:shadow-lg transition-shadow"
          >
            <div className="p-6">
              <div className="flex items-start gap-4">
                {product.imageUrl && (
                  <img
                    src={product.imageUrl}
                    alt={product.name}
                    className="w-24 h-24 object-cover rounded-lg"
                  />
                )}
                <div className="flex-1">
                  <h3 className="font-semibold text-lg text-gray-900">{product.name}</h3>
                  <p className="text-gray-600 text-sm mb-2">{product.description}</p>
                  <div className="flex items-center gap-4">
                    {product.price && (
                      <span className="text-green-600 font-medium">{product.price}</span>
                    )}
                    {product.rating && (
                      <span className="text-yellow-500">★ {product.rating}</span>
                    )}
                  </div>
                </div>
              </div>
              <div className="mt-4 pt-4 border-t border-gray-100">
                <p className="text-sm text-gray-600">{product.explanation}</p>
              </div>
              <div className="mt-4">
                <a
                  href={product.amazonUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-block bg-yellow-400 text-black px-4 py-2 rounded hover:bg-yellow-500 transition-colors text-sm font-medium"
                >
                  View on Amazon
                </a>
              </div>
            </div>
          </motion.div>
        ))}
      </div>

      <div className="flex gap-3">
        <button
          onClick={previousStep}
          className="flex-1 px-6 py-3 border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors font-medium"
        >
          Back
        </button>
        <button
          onClick={nextStep}
          className="flex-1 bg-blue-600 text-white py-3 px-6 rounded-lg hover:bg-blue-700 transition-colors font-medium"
        >
          View Results
        </button>
      </div>
    </div>
  );
} 